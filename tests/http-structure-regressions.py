#!/usr/bin/env python3
"""Current presentation checks and exact prior/historical interfaces, isolated."""
import argparse,hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--development-root',required=True);args=p.parse_args();preview=Path(args.development_root).resolve()
report={'suite':'Stage 6 HTTP caution and structural wording regressions','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-http-structure-regressions-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 def run(label,cmd,outputs):
  log=Path(folder)/(label+'.log')
  with log.open('w') as out:r=subprocess.run(cmd,cwd=dest,stdout=out,stderr=subprocess.STDOUT)
  entry={'name':label,'exitCode':r.returncode,'reports':{name:json.loads((dest/'tests'/name).read_text()) for name in outputs if (dest/'tests'/name).exists()}}
  if r.returncode:entry['failureOutput']=log.read_text()[-16000:];report['failures'].append(label)
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+label,flush=True)
 def restore(file):
  for path,b in json.loads((ROOT/file).read_text())['files'].items():
   target=dest/path;text=target.read_text();assert hashlib.sha256(text.encode()).hexdigest()==b['currentSHA256'],path
   for pair in reversed(b['replacements']):assert text.count(pair['current'])==1;text=text.replace(pair['current'],pair['previous'])
   assert hashlib.sha256(text.encode()).hexdigest()==b['previousSHA256'],path;target.write_text(text)
 run('current-build',['python3','-B','tests/ux-build.py'],['ux-build-results.json'])
 run('current-http-structure',['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/http-structure-results.mjs','--development-root='+str(preview)],['http-structure-results.json'])
 # No matching/generator/data change: preserve the successful strict 2.9.7
 # report and verify every recorded input, instead of substituting Deno 2.9.8.
 m=json.loads((ROOT/'data/lookalikes/manifest.json').read_text());pins=m['generator']['files'];prior=json.loads((ROOT/'tests/stress-integrity.json').read_text());strict=json.loads((ROOT/'tests/stress-strict-results.json').read_text())
 assert not strict['failures'] and strict['runtimeVersion'].startswith('deno 2.9.7 ')
 for path,h in pins.items():assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==h,path
 for path,h in prior['startingInventory'].items():
  if path.startswith('data/') or path in ['src/core.js','src/domain-boundaries.js','src/comparisons.js','src/references.js','src/embedded.js','src/embedded-ui.js']:
   expected=prior['modifiedStartingFileHashes'].get(path,{}).get('after',h);assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==expected,path
 report['strict297Evidence']={'rerun':False,'priorSuccessfulReportUnchanged':True,'allRecordedGeneratorAndInputDataHashesStillMatch':True,'reason':'Presentation-only change; no matching, generation, data or pin modifications.'}
 restore('tests/http-structure-source-boundaries.json')
 historical=Path(folder)/'stress-preview';run('exact-prior-stress-preview',['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(historical)],[])
 run('unchanged-prior-stress-assertions',['deno','run','--cached-only','--allow-read=.,'+str(historical),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/stress-results.mjs','--development-root='+str(historical)],['stress-results.json'])
 restore('tests/stress-source-boundaries.json')
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/prominence-regressions.py';text=script.read_text();old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==1;script.write_text(text.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
 older=Path(folder)/'prominence-preview';run('exact-prior-prominence-preview',['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(older)],[])
 run('unchanged-older-ui-and-historical-regressions',['python3','-B','tests/prominence-regressions.py','--development-root',str(older)],['prominence-regression-results.json'])
report['total']={'executedCommandGroups':len(report['commands']),'passedCommandGroups':len(report['commands'])-len(report['failures']),'failedCommandGroups':len(report['failures'])}
report['scope']='Current presentation/build and unchanged previous stress/prominence/follow-up/acceptance/historical assertions on their exact reconstructed inputs. Earlier reports are written only in disposable copies. Nested totals are not additive. Native Firefox and preserved strict-runtime evidence are reported separately.'
(ROOT/'tests/http-structure-regression-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['total']));raise SystemExit(bool(report['failures']))
