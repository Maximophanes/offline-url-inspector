#!/usr/bin/env python3
"""Current candidate gate plus exact Stage 6 historical interfaces, never repinned."""
import argparse,hashlib,json,pathlib,shutil,subprocess,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--candidate-root',type=pathlib.Path,required=True);p.add_argument('--report',type=pathlib.Path,required=True);a=p.parse_args();r={'suite':'Stage 7 preserved historical regression interfaces','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-stage7-regressions-') as folder:
 dest=pathlib.Path(folder)/'source';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 # Old suites bind complete builder/verifier/workflow source hashes. Restore
 # only the recorded release-engineering boundaries in this disposable copy;
 # current RC safeguards are exercised separately, without changing old assertions.
 for name,b in json.loads((ROOT/'tests/stage7-source-boundaries.json').read_text())['files'].items():
  assert sha((dest/name).read_bytes())==b['currentSHA256'],name
  prior=b['previousSource'].encode();assert sha(prior)==b['previousSHA256'],name;(dest/name).write_bytes(prior)
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/final-copy-regressions.py';s=script.read_text();old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert s.count(old)==1;script.write_text(s.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()",1))
 preview=pathlib.Path(folder)/'stage6-preview';cmd=['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(preview)];v=subprocess.run(cmd,cwd=dest,capture_output=True,text=True);assert v.returncode==0,v.stderr
 log=a.report.with_suffix('.log')
 with log.open('w') as stream:v=subprocess.run(['python3','-B','tests/final-copy-regressions.py','--development-root',str(preview)],cwd=dest,stdout=stream,stderr=subprocess.STDOUT)
 entry={'name':'unchanged-full-historical-regression-chain','exitCode':v.returncode,'report':json.loads((dest/'tests/final-copy-regression-results.json').read_text())}
 if v.returncode:r['failures'].append(entry['name']);entry['error']=log.read_text()[-10000:]
 r['commands'].append(entry)
r['scope']='Historical application assertions run on their exact preserved interfaces with hash-checked release-script restoration. Current RC source/build/data/message/worker regressions are separately recorded by release_gate.py. Counts across nested reports are not additive.';r['passed']=not r['failures'];a.report.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({'passed':r['passed'],'failures':r['failures']}));raise SystemExit(not r['passed'])
