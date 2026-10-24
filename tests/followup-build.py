#!/usr/bin/env python3
"""Current Stage 6 focused presentation follow-up without overwriting prior reports."""
import argparse,json,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--with-dom',action='store_true');args=p.parse_args();report={'suite':'Current Stage 6 focused presentation follow-up build checks','commands':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-followup-build-',dir='/private/tmp') as folder:
 dest=Path(folder)/'checkout';preview=Path(folder)/'preview';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
 commands=[('build-integrity',['python3','-B','tests/ux-build.py'],'ux-build-results.json'),('current-preview',['python3','-B','tools/build.py','--automatic-ui-preview','--output-root',str(preview)],None)]
 if args.with_dom:commands.append(('messages',['deno','run','--cached-only','--allow-read=.,'+str(preview),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/followup-results.mjs','--development-root='+str(preview)],'followup-results.json'))
 for label,command,output in commands:
  r=subprocess.run(command,cwd=dest,capture_output=True,text=True);entry={'name':label,'exitCode':r.returncode}
  if output and (dest/'tests'/output).exists():entry['report']=json.loads((dest/'tests'/output).read_text())
  if r.returncode:report['failures'].append(label);entry['failureOutput']=(r.stdout+r.stderr)[-16000:]
  report['commands'].append(entry);print(('PASS ' if not r.returncode else 'FAIL ')+label,flush=True)
report['scope']='Current generated DOM and deterministic offline builds. All earlier reports are written only in disposable copies; native Firefox is separate.'
report['total']={'executedCommands':len(report['commands']),'failedCommands':len(report['failures'])}
(ROOT/'tests/followup-build-results.json').write_text(json.dumps(report,indent=2)+'\n');raise SystemExit(bool(report['failures']))
