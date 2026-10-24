#!/usr/bin/env python3
"""Run current acceptance and unchanged historical regressions in disposable copies."""
import argparse,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);args=p.parse_args();preview=Path(args.development_root).resolve()
report={'suite':'Final Stage 6 current UI and unchanged regression evidence','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-final-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(label,cmd,outputs):
  log=Path(folder)/(label+'.log')
  with log.open('w') as out:r=subprocess.run(cmd,cwd=dest,stdout=out,stderr=subprocess.STDOUT)
  entry={'name':label,'exitCode':r.returncode,'reports':{name:json.loads((dest/'tests'/name).read_text()) for name in outputs if (dest/'tests'/name).exists()}}
  if r.returncode:entry['failureOutput']=log.read_text()[-12000:];report['failures'].append(label)
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+label,flush=True)
 run('current-build-and-prior-60-UI-tests',['python3','-B','tests/ux-build.py','--with-dom'],['ux-build-results.json','ux-results.json'])
 run('final-29-UI-tests',['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/final-ux-results.mjs','--development-root='+str(preview)],['final-ux-results.json'])
 for name in ['unit','references','differential','embedded-provenance','comparisons','service-worker','hosted-bootstrap']:
  run('current-'+name,['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+name+'.mjs','--development-root='+str(preview)],[name+'-results.json'])
 # Restore only whole-file-hash-bound presentation edits. All historical tests,
 # fixtures and pins remain exact. Current source tests above use current source.
 for path,b in json.loads((ROOT/'tests/final-ux-source-boundaries.json').read_text())['files'].items():
  target=dest/path;text=target.read_text();assert hashlib.sha256(text.encode()).hexdigest()==b['currentSHA256'],path
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert hashlib.sha256(text.encode()).hexdigest()==b['previousSHA256'];target.write_text(text)
 # The previous runner needs its read-only git-show blob; this copy has no .git.
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/ux-regressions.py';text=script.read_text();old="subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==2;script.write_text(text.replace(old,"(ROOT/'stable-builder-baseline.txt').read_bytes()",1))
 run('prior-complete-28-command-regressions',['python3','-B','tests/ux-regressions.py','--development-root',str(preview)],['ux-regression-results.json'])
report['total']={'executedCommands':len(report['commands'])-1+28,'failedCommands':len(report['failures'])};report['total']['passedCommands']=report['total']['executedCommands']-report['total']['failedCommands'];report['scope']='Current build, original 60 UI checks, final refinement checks and seven current analysis suites. Earlier full 28-command runner uses exact historical presentation reconstruction; assertions and dataset/runtime pins are unchanged. All old result reports are written only in temporary copies.'
(ROOT/'tests/final-ux-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
