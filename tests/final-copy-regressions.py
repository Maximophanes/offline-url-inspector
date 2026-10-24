#!/usr/bin/env python3
"""Focused final copy checks and unchanged prior acceptance, in disposable copies."""
import argparse,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);args=p.parse_args();preview=Path(args.development_root).resolve()
report={'suite':'Stage 6 final copy and preserved acceptance regressions','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-final-copy-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(label,cmd,outputs):
  log=Path(folder)/(label+'.log')
  with log.open('w') as out:r=subprocess.run(cmd,cwd=dest,stdout=out,stderr=subprocess.STDOUT)
  entry={'name':label,'exitCode':r.returncode,'reports':{name:json.loads((dest/'tests'/name).read_text()) for name in outputs if (dest/'tests'/name).exists()}}
  if r.returncode:entry['failureOutput']=log.read_text()[-16000:];report['failures'].append(label)
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+label,flush=True)
 run('current-build',['python3','-B','tests/ux-build.py'],['ux-build-results.json'])
 run('current-final-copy',['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/final-copy-results.mjs','--development-root='+str(preview)],['final-copy-results.json'])
 for path,b in json.loads((ROOT/'tests/final-copy-source-boundaries.json').read_text())['files'].items():
  target=dest/path;text=target.read_text();assert hashlib.sha256(text.encode()).hexdigest()==b['currentSHA256'],path
  for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
  assert hashlib.sha256(text.encode()).hexdigest()==b['previousSHA256'],path;target.write_text(text)
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/http-structure-regressions.py';text=script.read_text();old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==1;script.write_text(text.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
 previous=Path(folder)/'prior-preview';run('exact-prior-preview',['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(previous)],[])
 run('unchanged-prior-and-historical-regressions',['python3','-B','tests/http-structure-regressions.py','--development-root',str(previous)],['http-structure-regression-results.json'])
report['total']={'executedCommandGroups':len(report['commands']),'passedCommandGroups':len(report['commands'])-len(report['failures']),'failedCommandGroups':len(report['failures'])}
report['scope']='Narrow current advice/scope acceptance and deterministic build checks, then unchanged previous HTTP/structure, stress and historical suites on exact prior interfaces. Earlier assertion/report files are untouched in the actual checkout. Nested totals are not additive; native Firefox is separate. Strict 2.9.7 inputs and prior success are verified by the preserved inner runner; generation is not rerun.'
(ROOT/'tests/final-copy-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
