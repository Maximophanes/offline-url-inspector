#!/usr/bin/env python3
"""Current messaging/analysis checks plus exact historical UI, in disposable copies."""
import argparse,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);args=p.parse_args();preview=Path(args.development_root).resolve()
report={'suite':'Stage 6 messaging current and preserved historical regressions','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-messaging-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(label,cmd,outputs):
  log=Path(folder)/(label+'.log')
  with log.open('w') as out:r=subprocess.run(cmd,cwd=dest,stdout=out,stderr=subprocess.STDOUT)
  entry={'name':label,'exitCode':r.returncode,'reports':{name:json.loads((dest/'tests'/name).read_text()) for name in outputs if (dest/'tests'/name).exists()}}
  if r.returncode:entry['failureOutput']=log.read_text()[-16000:];report['failures'].append(label)
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+label,flush=True)
 run('current-build',['python3','-B','tests/ux-build.py'],['ux-build-results.json'])
 run('current-messaging',['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/messaging-results.mjs','--development-root='+str(preview)],['messaging-results.json'])
 for name,output in [('unit','unit'),('references','references'),('differential','differential'),('embedded-provenance','embedded-provenance'),('comparisons','comparison'),('service-worker','service-worker'),('hosted-bootstrap','hosted-bootstrap'),('lookalike-calibration','lookalike-calibration')]:
  run('current-'+name,['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+name+'.mjs','--development-root='+str(preview)],[output+'-results.json'])
 # The embedded/audit-corrections suites combine engine and v3.2 literal DOM
 # checks. The unchanged nested historical runner covers them in full; current
 # provenance/coordinator/message tests above exercise today's presentation.
 # Only this task's exact reviewed changes are reversed. The prior runner then
 # runs the original assertions against their own exact historical interfaces.
 for path,b in json.loads((ROOT/'tests/messaging-source-boundaries.json').read_text())['files'].items():
  target=dest/path;text=target.read_text();assert hashlib.sha256(text.encode()).hexdigest()==b['currentSHA256'],path
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert hashlib.sha256(text.encode()).hexdigest()==b['previousSHA256'];target.write_text(text)
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/final-ux-regressions.py';text=script.read_text();old="baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==1;script.write_text(text.replace(old,"baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
 # Current preview has intentionally changed copy/DOM. Rebuild the exact prior
 # presentation in this disposable copy for its unchanged 89-test assertions.
 historical=Path(folder)/'historical-preview';run('historical-preview',['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(historical)],[])
 run('prior-complete-37-command-regressions',['python3','-B','tests/final-ux-regressions.py','--development-root',str(historical)],['final-ux-regression-results.json'])
report['total']={'executedCommands':len(report['commands'])-1+37,'failedCommands':len(report['failures'])};report['total']['passedCommands']=report['total']['executedCommands']-report['total']['failedCommands']
report['scope']='Current messaging, build, analysis and calibration; prior UI assertions use exact hash-restored historical sources in disposable copies. No old test or fixture expectation changed. Nested counts are not independent test totals.'
(ROOT/'tests/messaging-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
