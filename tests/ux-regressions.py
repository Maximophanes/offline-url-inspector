#!/usr/bin/env python3
"""Preserve historical assertions; distinguish current analysis from superseded UI."""
import argparse,hashlib,json,re,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);args=p.parse_args();preview=Path(args.development_root).resolve();report={'suite':'Stage 6 UX current analysis and exact historical regressions','commands':[],'failures':[]}
sha=lambda b:hashlib.sha256(b).hexdigest()
with tempfile.TemporaryDirectory(prefix='oui-ux-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(script,scope,development):
  cmd=['deno','run','--cached-only','--allow-read=.,'+str(development),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+script+'.mjs','--development-root='+str(development)];r=subprocess.run(cmd,cwd=dest,capture_output=True,text=True);names=set(re.findall(r'[\w-]+-results\.json',(dest/'tests'/str(script+'.mjs')).read_text()));reports={n:json.loads((dest/'tests'/n).read_text()) for n in names if (dest/'tests'/n).exists()};entry={'script':script,'scope':scope,'exitCode':r.returncode,'reports':reports}
  if r.returncode:entry.update(stdout=r.stdout,stderr=r.stderr);report['failures'].append({'script':script,'scope':scope,'failures':{n:v.get('failures') for n,v in reports.items()}})
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+scope+' '+script,flush=True)
 for name in ['unit','references','differential','embedded-provenance','comparisons','service-worker','hosted-bootstrap']:run(name,'current source/analysis',preview)
 for path,b in json.loads((ROOT/'tests/ux-source-boundaries.json').read_text())['files'].items():
  target=dest/path;text=target.read_text();assert sha(text.encode())==b['currentSHA256'],path
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert sha(text.encode())==b['previousSHA256'];target.write_text(text)
 historical=Path(folder)/'original-stage6';r=subprocess.run(['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(historical)],cwd=dest,capture_output=True,text=True);assert r.returncode==0,r.stderr
 original=json.loads((ROOT/'tests/automatic-build-results.json').read_text())['developmentManifest'];assert json.loads((historical/'build-manifest.json').read_text())==original;report['exactOriginalStage6ManifestReproduced']=True
 run('automatic-ui','historical original Stage 6 presentation (superseded headline policy)',historical)
 # Preserve the complete earlier 20-command runner and test bodies. The sole
 # runner adaptation supplies its git-show baseline from a verified read-only
 # blob, since this disposable source copy intentionally has no .git directory.
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/automatic-regressions.py';text=script.read_text();old="subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==1;text=text.replace(old,"(ROOT/'stable-builder-baseline.txt').read_bytes()");script.write_text(text)
 cmd=['python3','-B','tests/automatic-regressions.py','--development-root',str(historical)];r=subprocess.run(cmd,cwd=dest,capture_output=True,text=True);legacy=json.loads((dest/'tests/automatic-regression-results.json').read_text());report['historicalPrior20CommandRun']={'exitCode':r.returncode,'report':legacy,'runnerAdaptation':'Only read-only git-show baseline acquisition uses its identical prefetched blob in a source copy without .git. No test/assertion/fixture changed.','stableBuilderSHA256':sha(baseline)}
 if r.returncode:report['failures'].append({'scope':'historical prior full regressions','failures':legacy['failures'],'stdout':r.stdout,'stderr':r.stderr})
 print(('PASS ' if not r.returncode else 'FAIL ')+'historical complete prior 20-command regression runner',flush=True)
report['total']={'executedCommands':len(report['commands'])+20,'failedCommands':sum(c['exitCode']!=0 for c in report['commands'])+report['historicalPrior20CommandRun']['report']['total']['failedCommands']};report['total']['passedCommands']=report['total']['executedCommands']-report['total']['failedCommands'];report['scope']='Current source core/reference/provenance/coordinator/worker plus exact historical presentation and prior complete regression execution. Literal old primary-heading and eager-DOM expectations are superseded by the correction brief, retained unchanged against their exact historical runtime. Current UX acceptance is tests/ux-results.mjs.'
(ROOT/'tests/ux-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
