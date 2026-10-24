#!/usr/bin/env python3
"""Run unchanged prior suites in disposable checkouts; preserve historical reports."""
import argparse,hashlib,json,re,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);args=p.parse_args();preview=Path(args.development_root).resolve()
report={'suite':'Stage 6 current-runtime and exact historical regression execution','commands':[],'failures':[]}
files=['standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js','site/.nojekyll','build-manifest.json'];sha=lambda b:hashlib.sha256(b).hexdigest()
with tempfile.TemporaryDirectory(prefix='oui-stage6-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(script,scope,development=None):
  before={p.name:p.read_bytes() for p in (dest/'tests').glob('*results.json')};cmd=['deno','run','--cached-only','--allow-read=.,'+str(preview)+','+str(development or dest),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+script+'.mjs']
  if development:cmd+=['--development-root='+str(development)]
  result=subprocess.run(cmd,cwd=dest,capture_output=True,text=True);reports={}
  # Save all freshly executed reports, even when deterministic bytes equal history.
  text=(dest/'tests'/str(script+'.mjs')).read_text();names=set(re.findall(r"[\w-]+-results\.json",text))
  names.update(p.name for p in (dest/'tests').glob('*results.json') if before.get(p.name)!=p.read_bytes())
  for name in names:
   path=dest/'tests'/name
   if path.exists():reports[name]=json.loads(path.read_text())
  entry={'script':script,'scope':scope,'command':cmd,'exitCode':result.returncode,'reports':reports}
  if result.returncode:entry.update(stdout=result.stdout,stderr=result.stderr);report['failures'].append({'script':script,'scope':scope,'errors':[{k:v for k,v in r.items() if k in ['failures','total','assertions']} for r in reports.values()]})
  report['commands'].append(entry);print(('PASS ' if not result.returncode else 'FAIL ')+scope+' '+script,flush=True)
 for name in ['references','differential','embedded','audit-corrections','embedded-provenance','comparisons','dom-v3','interface','reference-interface','technical','polish','service-worker','hosted-bootstrap']:
  run(name,'current Stage 6 source/generated runtime',preview)
 # Exact historical reconstruction occurs only in the disposable copy. No source
 # pins or old assertions are rewritten, and current source is tested above.
 boundary=json.loads((ROOT/'tests/automatic-source-boundaries.json').read_text())['files']
 for path,b in boundary.items():
  target=dest/path;text=target.read_text();assert sha(text.encode())==b['currentSHA256']
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert sha(text.encode())==b['previousSHA256'];target.write_text(text)
 stage5=Path(folder)/'stage5';r=subprocess.run(['python3','-B','tools/build.py','--comparison-preview','--output-root',str(stage5)],cwd=dest,capture_output=True,text=True);assert r.returncode==0,r.stderr
 old=json.loads((ROOT/'tests/comparison-build-results.json').read_text())['developmentManifest'];generated=json.loads((stage5/'build-manifest.json').read_text());assert generated==old,'Stage 5 complete manifest reproduction differs';report['stage5ExactManifestReproduced']=True
 run('comparison-dom','exact reconstructed Stage 5 generated runtime',stage5)
 stage4=Path(folder)/'stage4';r=subprocess.run(['python3','-B','tools/build.py','--provenance-preview','--reference-foundation','--output-root',str(stage4)],cwd=dest,capture_output=True,text=True);assert r.returncode==0,r.stderr
 run('embedded-provenance-dom','exact reconstructed Stage 4 generated runtime',stage4)
 # Stable reconstruction uses the same existing two-file restoration as Stage 4.
 for path,b in json.loads((ROOT/'tests/embedded-provenance-source-boundaries.json').read_text())['files'].items():
  target=dest/path;text=target.read_text();assert sha(text.encode())==b['currentSHA256']
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert sha(text.encode())==b['previousSHA256'];target.write_text(text)
 r=subprocess.run(['python3','-B','tools/build.py'],cwd=dest,capture_output=True,text=True);assert r.returncode==0,r.stderr
 for path in files:assert (dest/path).read_bytes()==(ROOT/path).read_bytes(),path
 report['stableCompleteBundleReproduced']=True
 (dest/'tools/build.py').write_bytes(subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT))
 for name in ['unit','dom','refinement','clarity','editorial']:run(name,'exact reconstructed stable v3.2.0 runtime')
report['total']={'executedCommands':len(report['commands']),'passedCommands':sum(c['exitCode']==0 for c in report['commands']),'failedCommands':sum(c['exitCode']!=0 for c in report['commands'])};report['scope']='Current source and Stage 6 generated DOM are distinct from separately reproduced historical builds. Reports are nested here to preserve earlier handoffs. No prior fixtures, assertions or pins changed.'
(ROOT/'tests/automatic-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
