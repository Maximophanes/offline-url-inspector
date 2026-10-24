#!/usr/bin/env python3
"""Run the unchanged prior regression chain on its exact pre-remediation sources."""
import argparse,hashlib,json,pathlib,shutil,subprocess,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest();p=argparse.ArgumentParser();p.add_argument('--candidate-root',type=pathlib.Path,required=True);p.add_argument('--report',type=pathlib.Path,required=True);a=p.parse_args();report={'suite':'Stage 8 exact preserved historical regression interfaces','failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-stage8-historical-') as folder:
 dest=pathlib.Path(folder)/'source';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 boundaries=json.loads((ROOT/'tests/stage8-source-boundaries.json').read_text())['files']
 for name,b in boundaries.items():
  assert sha((dest/name).read_bytes())==b['currentSHA256'],name;prior=b['previousSource'].encode();assert sha(prior)==b['previousSHA256'],name;(dest/name).write_bytes(prior)
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/stage7-regressions.py';text=script.read_text();old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert text.count(old)==1;script.write_text(text.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
 inner=pathlib.Path(folder)/'stage7.json';log=a.report.with_suffix('.log')
 with log.open('w') as stream:v=subprocess.run(['python3','-B','tests/stage7-regressions.py','--candidate-root',str(a.candidate_root),'--report',str(inner)],cwd=dest,stdout=stream,stderr=subprocess.STDOUT)
 report['exitCode']=v.returncode;report['historicalReport']=json.loads(inner.read_text()) if inner.exists() else None
 if v.returncode:report['failures'].append('preserved historical chain');report['error']=log.read_text()[-10000:]
report['passed']=not report['failures'];report['scope']='Only hash-checked release/runtime/generator boundaries are restored in a disposable source copy. Original assertions and prior reports remain unchanged. Current Stage 8 regressions run separately on the revised candidate; no historical pass is counted as current correction coverage.';a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'passed':report['passed'],'failures':report['failures']}));raise SystemExit(not report['passed'])
