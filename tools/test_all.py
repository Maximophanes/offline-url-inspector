#!/usr/bin/env python3
"""Final available-suite runner; starts only a loopback development server.

Default: full Unicode/regression, simulated DOM/worker, HTTP, and optional ICU.
Firefox is opt-in and requires an already running local WebDriver endpoint.
"""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import time
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--with-firefox',action='store_true',help='Requires geckodriver on port 4445; executes both real-browser harnesses')
args=parser.parse_args()
def run(command):
    result=subprocess.run(command,cwd=ROOT,capture_output=True,text=True)
    print(('PASS ' if result.returncode==0 else 'ERROR ')+' '.join(command),flush=True)
    if result.returncode: print(result.stdout);print(result.stderr)
    return result.returncode==0
if not run([sys.executable,'tools/build.py']): raise SystemExit(1)
if not run([sys.executable,'tools/audit_copy.py','--check']): raise SystemExit(1)
server=subprocess.Popen([sys.executable,'tools/serve.py'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,text=True)
commands=[]
try:
    ready=False
    for _ in range(40):
        if server.poll() is not None: raise RuntimeError('Test server failed to start. Stop any prior server on port 8765 before this runner.')
        try:
            with urllib.request.urlopen('http://127.0.0.1:8765/offline-url-inspector/',timeout=1) as response:
                if response.status==200: ready=True;break
        except Exception: pass
        time.sleep(.05)
    if not ready: raise RuntimeError('Loopback test server did not become ready.')
    for task in ['test:embedded','test:references','test:dom','test:refinement','test:polish','test:clarity','test:editorial','test:interface','test:reference-interface','test:technical','test:baseline-dom','test:worker','test:hosted','test:differential','test:idna','test:http','test:unicode']:
        commands.append({'command':task,'passed':run(['deno','task',task])})
    icu=Path('/opt/homebrew/opt/icu4c/lib/libicuuc.78.dylib')
    if icu.exists():
        commands.append({'command':'independent ICU diagnostic','passed':run([sys.executable,'tools/review_idna_icu.py','--library',str(icu),'--suffix','78'])})
    else:
        (ROOT/'tests/idna-icu-results.json').write_text(json.dumps({'suite':'independent ICU diagnostic','status':'not executed: supply installed ICU library/suffix','total':{'executed':0,'passed':0,'failed':0},'assertions':{'executed':0,'passed':0,'failed':0}},indent=2)+'\n')
    if args.with_firefox:
        for task in ['test:firefox-standalone','test:firefox-hosted']: commands.append({'command':task,'passed':run(['deno','task',task])})
finally:
    server.terminate()
    try: server.wait(timeout=5)
    except subprocess.TimeoutExpired: server.kill();server.wait()
files=['embedded-results.json','unit-results.json','dom-results.json','references-results.json','dom-v3-results.json','refinement-results.json','polish-results.json','clarity-results.json','editorial-results.json','interface-results.json','reference-interface-results.json','technical-results.json','service-worker-results.json','hosted-bootstrap-results.json','differential-results.json','idna-review-results.json','idna-icu-results.json','http-results.json']
if args.with_firefox: files.extend(['firefox-standalone-results.json','firefox-hosted-results.json'])
reports=[]
for filename in files:
    p=ROOT/'tests'/filename
    if not p.exists(): continue
    r=json.loads(p.read_text());reports.append({'report':filename,'suite':r['suite'],'tests':r['total'],'assertions':r['assertions'],'status':r.get('status','executed')})
total={k:sum(r['tests'][k] for r in reports) for k in ['executed','passed','failed']}
assertions={k:sum(r['assertions'][k] for r in reports) for k in ['executed','passed','failed']}
summary={'applicationVersion':'3.2.0','tests':total,'assertions':assertions,'commands':commands,'suites':reports,'firefox':('Requested: both Firefox harnesses passed; see current real-browser reports.' if all(c['passed'] for c in commands if c['command'].startswith('test:firefox-')) else 'Requested: Firefox execution failed or could not start; see current real-browser reports and command errors.') if args.with_firefox else 'Not requested: use --with-firefox with a running local WebDriver endpoint. Driver availability was not checked.','scope':'Unit/official conformance, simulated DOM and worker lifecycle, actual loopback HTTP. Simulations are not actual Firefox/GitHub Pages deployment.'}
(ROOT/'tests/summary-results.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps({'tests':total,'assertions':assertions,'firefox':summary['firefox']},indent=2))
if total['failed'] or assertions['failed'] or any(not c['passed'] for c in commands): raise SystemExit(1)
