#!/usr/bin/env python3
"""Loopback-only controlled UI preview. Does not register a real worker.

Runs the exact hosted controller against in-memory browser fixtures. It is
separate from build.py and deploy-pages.yml and never writes site/ assets.
"""
import argparse
import base64
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parents[1]

def fixture_html(zoom=100):
    html = (ROOT/'site/index.html').read_text()
    hosted = (ROOT/'src/hosted.js').read_text()
    program = re.search(r'<script>([\s\S]*?)</script>', html)[1]
    assert program.endswith(hosted)
    setup = r"""
{
 const realWindow=globalThis,realLocation=realWindow.location;
 const fixtureCase=new URL(realLocation.href).searchParams.get('state')||'empty';
 const workerEvents=new EventTarget(),fixtureWindow=new EventTarget();
 const ready=fixtureCase!=='unverified';
 function worker(waiting=false){
  const instance=new EventTarget();
  instance.scriptURL=new URL('sw.js',realLocation.href).href;
  instance.postMessage=(message,ports)=>{
   if(message.type==='GET_CACHE_STATUS')ports[0].postMessage({ready});
   if(message.type==='ACTIVATE_REVIEWED_UPDATE'){
    if(fixtureCase==='applyFailed')throw Error('Controlled activation failure');
    if(fixtureCase==='applied')queueMicrotask(()=>workerEvents.dispatchEvent(new Event('controllerchange')));
   }
  };
  return instance;
 }
 const registration=new EventTarget();
 registration.scope=new URL('./',realLocation.href).href;
 registration.active=worker();
 registration.waiting=['waiting','applied','applyFailed','pending'].includes(fixtureCase)?worker(true):null;
 registration.installing=fixtureCase==='preparing'?worker():null;
 registration.update=()=>fixtureCase==='failed'?Promise.reject(Error('Controlled update-check failure')):Promise.resolve();
 workerEvents.getRegistration=async()=>registration;
 workerEvents.register=async()=>{throw Error('A fixture must never register a real worker');};
 const navigator={serviceWorker:workerEvents,onLine:fixtureCase!=='offline'};
 const window=fixtureWindow;
 const location={href:realLocation.href,reload:()=>{document.getElementById('fixtureOutcome').textContent='Simulated reload requested; no page was reloaded.';}};
 const realTimeout=realWindow.setTimeout.bind(realWindow);
 const setTimeout=(fn,ms)=>realTimeout(fn,fixtureCase==='pending'&&ms===10000?60:ms);
 const clearTimeout=realWindow.clearTimeout.bind(realWindow);
"""
    finish = r"""
 const choice=document.getElementById('fixtureState');
 choice.value=fixtureCase;
 choice.addEventListener('change',()=>{const next=new URL(realLocation.href);next.searchParams.set('state',choice.value);realLocation.assign(next.href);});
 hostedStartup.then(()=>{
  if(['current','failed','preparing','unverified','offline'].includes(fixtureCase))document.getElementById('checkCache').click();
 });
}
"""
    program = program[:-len(hosted)]+setup+hosted+finish
    html = re.sub(r'<script>[\s\S]*?</script>', lambda _: '<script>'+program+'</script>', html, count=1)
    digest = base64.b64encode(hashlib.sha256(program.encode()).digest()).decode()
    html = re.sub(r"script-src 'sha256-[^']+'", "script-src 'sha256-"+digest+"'", html, count=1)
    banner = '''<aside class="card small" aria-label="Controlled update fixture">
<label for="fixtureState">Controlled UI fixture — simulated worker and update outcomes</label>
<p>No real worker is registered. Inspections still use the unchanged engine. Use synthetic inputs.</p>
<select id="fixtureState">
<option value="empty">No feedback</option><option value="current">Up to date</option>
<option value="failed">Long check failure</option><option value="waiting">Apply Update visible</option>
<option value="preparing">Preparing</option><option value="unverified">Offline cache unverified</option>
<option value="offline">Update unavailable offline</option><option value="applied">Applied (choose Apply Update)</option>
<option value="applyFailed">Activation failed (choose Apply Update)</option>
<option value="pending">Activation timeout (choose Apply Update)</option>
</select><p id="fixtureOutcome" role="status"></p></aside>'''
    html=html.replace('<header class="masthead">',banner+'<header class="masthead">')
    if zoom==200:
        css=re.search(r'<style>([\s\S]*?)</style>',html)[1]+'\nhtml{zoom:2}'
        html=re.sub(r'<style>[\s\S]*?</style>',lambda _: '<style>'+css+'</style>',html,count=1)
        style_hash=base64.b64encode(hashlib.sha256(css.encode()).digest()).decode()
        html=re.sub(r"style-src 'sha256-[^']+'","style-src 'sha256-"+style_hash+"'",html,count=1)
        html=html.replace('No real worker is registered.','Controlled 200% CSS magnification; not native browser zoom. No real worker is registered.')
    return html.encode()

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=8778)
    args=parser.parse_args()
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            if urlsplit(self.path).path not in ['/offline-url-inspector/','/offline-url-inspector/index.html']:
                self.send_error(404);return
            data=fixture_html(200 if parse_qs(urlsplit(self.path).query).get('zoom')==['200'] else 100)
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8')
            self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store')
            self.end_headers();self.wfile.write(data)
        def log_message(self,*args): pass
    print(f'Controlled fixture only: http://127.0.0.1:{args.port}/offline-url-inspector/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
