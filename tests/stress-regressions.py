#!/usr/bin/env python3
"""Current stress corrections and unchanged historical policy/UI regressions, isolated."""
import argparse,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);p.add_argument('--strict-runtime',required=True);args=p.parse_args();preview=Path(args.development_root).resolve()
report={'suite':'Stage 6 consolidated stress corrections and preserved policy/UI regressions','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-stress-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(label,cmd,outputs):
  log=Path(folder)/(label+'.log')
  with log.open('w') as out:r=subprocess.run(cmd,cwd=dest,stdout=out,stderr=subprocess.STDOUT)
  entry={'name':label,'exitCode':r.returncode,'reports':{name:json.loads((dest/'tests'/name).read_text()) for name in outputs if (dest/'tests'/name).exists()}}
  if r.returncode:entry['failureOutput']=log.read_text()[-16000:];report['failures'].append(label)
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+label,flush=True)
 run('current-build',['python3','-B','tests/ux-build.py'],['ux-build-results.json'])
 run('current-stress',['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/stress-results.mjs','--development-root='+str(preview)],['stress-results.json'])
 run('current-strict-engine',[args.strict_runtime,'run','--cached-only','--no-prompt','--allow-read=.','--allow-write=tests','tests/stress-engine.mjs'],['stress-engine-results.json'])
 run('current-calibration',['deno','run','--cached-only','--allow-read=.','--allow-write=tests','tests/lookalike-calibration.mjs'],['lookalike-calibration-results.json'])
 for path,b in json.loads((ROOT/'tests/stress-source-boundaries.json').read_text())['files'].items():
  target=dest/path;text=target.read_text();assert hashlib.sha256(text.encode()).hexdigest()==b['currentSHA256'],path
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert hashlib.sha256(text.encode()).hexdigest()==b['previousSHA256'];target.write_text(text)
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/prominence-regressions.py';text=script.read_text();old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==1;script.write_text(text.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
 historical=Path(folder)/'historical-preview';run('exact-prior-preview',['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(historical)],[])
 run('unchanged-prior-followup-and-historical-regressions',['python3','-B','tests/prominence-regressions.py','--development-root',str(historical)],['prominence-regression-results.json'])
report['total']={'executedCommandGroups':len(report['commands']),'passedCommandGroups':len(report['commands'])-len(report['failures']),'failedCommandGroups':len(report['failures'])}
report['scope']='Current UI, build/CSP/offline integrity, and exact prior acceptance plus analysis/history suites in disposable copies. Previous assertions and report files stay unchanged. Nested totals are not added as independent checks.'
(ROOT/'tests/stress-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
