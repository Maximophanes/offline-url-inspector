#!/usr/bin/env python3
"""Current UI acceptance plus unchanged prior interfaces, in disposable copies."""
import argparse,hashlib,json,pathlib,shutil,subprocess,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--candidate-root',type=pathlib.Path,required=True);p.add_argument('--deno',type=pathlib.Path,required=True);p.add_argument('--report',type=pathlib.Path,required=True);a=p.parse_args();report={'suite':'Final acceptance current polish and preserved historical regressions','checks':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-ui-polish-history-') as folder:
 dest=pathlib.Path(folder)/'source';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 log=a.report.with_suffix('.current.log')
 with log.open('w') as stream:v=subprocess.run([str(a.deno),'run','--cached-only','--allow-read=.,'+str(a.candidate_root),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/ui-polish-results.mjs','--development-root='+str(a.candidate_root)],cwd=dest,stdout=stream,stderr=subprocess.STDOUT)
 entry={'name':'current-candidate-ui-polish','exitCode':v.returncode,'report':json.loads((dest/'tests/ui-polish-results.json').read_text())};report['checks'].append(entry)
 if v.returncode:report['failures'].append(entry['name']);entry['error']=log.read_text()[-8000:]
 for name,b in json.loads((ROOT/'tests/ui-polish-source-boundaries.json').read_text())['files'].items():
  assert sha((dest/name).read_bytes())==b['currentSHA256'],name;prior=b['previousSource'].encode();assert sha(prior)==b['previousSHA256'],name;(dest/name).write_bytes(prior)
 baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT);(dest/'stable-builder-baseline.txt').write_bytes(baseline)
 script=dest/'tests/stage8-regressions.py';s=script.read_text();old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)";assert s.count(old)==1;script.write_text(s.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
 inner=pathlib.Path(folder)/'stage8.json';log=a.report.with_suffix('.historical.log')
 with log.open('w') as stream:v=subprocess.run(['python3','-B','tests/stage8-regressions.py','--candidate-root',str(a.candidate_root),'--report',str(inner)],cwd=dest,stdout=stream,stderr=subprocess.STDOUT)
 entry={'name':'unchanged-prior-historical-chain','exitCode':v.returncode,'report':json.loads(inner.read_text()) if inner.exists() else None};report['checks'].append(entry)
 if v.returncode:report['failures'].append(entry['name']);entry['error']=log.read_text()[-8000:]
report['passed']=not report['failures'];report['scope']='Current polish assertions run on the revised candidate. Only hash-checked UI/documentation/release-input interfaces are then restored in a disposable copy for unchanged historical assertions; no restored-source pass counts as current UI coverage.';a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'passed':report['passed'],'failures':report['failures']}));raise SystemExit(not report['passed'])
