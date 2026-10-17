#!/usr/bin/env python3
"""Loopback-only Reference Domains visual fixtures; no browser data is persisted.

Serves the exact generated standalone program with in-memory storage and explicit
synthetic actions before/after it. Not used by build.py or deployment.
"""
import argparse
import base64
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
STATES=['empty','one','multiple','emptyInput','overlength','duplicate','malformed','added','edited','removed','exportSuccess','exportFailure','importEmpty','importLong','importMalformed','importPreview','clearConfirm','cleared','session','failedStorage','protected','conflict','help']

def fixture_html():
    html=(ROOT/'standalone/Offline_URL_Inspector.html').read_text()
    source=re.search(r'<script>([\s\S]*?)</script>',html)[1]
    setup=r"""
const referenceFixtureCase=new URL(location.href).searchParams.get('state')||'empty';
const referenceFixtureKey='offline-url-inspector:reference-domains';
const referenceFixtureRecord=references=>JSON.stringify({application:'offline-url-inspector',schemaVersion:1,references});
const referenceFixtureValues=new Map();
if(!['empty','emptyInput','overlength','added','session','help'].includes(referenceFixtureCase))referenceFixtureValues.set(referenceFixtureKey,referenceFixtureCase==='protected'?'Synthetic unsupported stored record':referenceFixtureRecord(referenceFixtureCase==='multiple'?['example.com','one.invalid','two.invalid']:['example.com']));
Object.defineProperty(window,'localStorage',{configurable:true,value:{
 getItem:key=>{if(referenceFixtureCase==='session')throw Error('Controlled storage read denial');return referenceFixtureValues.get(key)??null;},
 setItem:(key,value)=>{if(referenceFixtureCase==='failedStorage')throw Error('Controlled storage write denial');referenceFixtureValues.set(key,String(value));},
 removeItem:key=>referenceFixtureValues.delete(key)
}});
"""
    finish=r"""
{
 const field=document.getElementById('referenceInput'),click=id=>document.getElementById(id).click();
 const add=value=>{field.value=value;click('saveReference');};
 const choice=document.getElementById('referenceFixtureState');choice.value=referenceFixtureCase;
 choice.addEventListener('change',()=>{const next=new URL(location.href);next.searchParams.set('state',choice.value);location.assign(next.href);});
 document.getElementById('referencePanel').open=true;
 switch(referenceFixtureCase){
  case 'emptyInput':add('');break;
  case 'overlength':add('a'.repeat(2049));break;
  case 'duplicate':add('EXAMPLE.COM.');break;
  case 'malformed':add('example.com/path');break;
  case 'added':add('new.invalid');break;
  case 'edited':document.querySelector('#referenceList button').click();field.value='edited.invalid';click('saveReference');break;
  case 'removed':document.querySelectorAll('#referenceList button')[1].click();break;
  case 'exportSuccess':
   HTMLAnchorElement.prototype.click=function(){document.getElementById('referenceFixtureOutcome').textContent='Synthetic backup prepared; download intercepted by this fixture.';};
   click('exportReferences');break;
  case 'exportFailure':URL.createObjectURL=()=>{throw Error('Controlled object URL allocation failure');};click('exportReferences');break;
  case 'importEmpty':beginImport(referenceFixtureRecord(['']));break;
  case 'importLong':beginImport(referenceFixtureRecord(['a'.repeat(2049)]));break;
  case 'importMalformed':beginImport('Synthetic invalid JSON');break;
  case 'importPreview':beginImport(referenceFixtureRecord(['new.invalid','another.invalid']));break;
  case 'clearConfirm':click('clearReferences');break;
  case 'cleared':click('clearReferences');click('confirmProceed');break;
  case 'session':case 'failedStorage':case 'protected':add('new.invalid');break;
  case 'conflict':referenceFixtureValues.set(referenceFixtureKey,referenceFixtureRecord(['other.invalid']));add('new.invalid');break;
  case 'help':document.querySelector('#referencePanel .reference-help').open=true;break;
 }
}
"""
    program=setup+source+finish
    html=re.sub(r'<script>[\s\S]*?</script>',lambda _:'<script>'+program+'</script>',html,count=1)
    digest=base64.b64encode(hashlib.sha256(program.encode()).digest()).decode()
    html=re.sub(r"script-src 'sha256-[^']+'","script-src 'sha256-"+digest+"'",html,count=1)
    options=''.join('<option value="'+s+'">'+s+'</option>' for s in STATES)
    banner='<aside class="card small" aria-label="Controlled reference fixture"><label for="referenceFixtureState">Controlled Reference Domains fixture</label><p>In-memory storage and synthetic inputs only. Standalone program served locally; no real storage failure or disk download is claimed.</p><select id="referenceFixtureState">'+options+'</select><p id="referenceFixtureOutcome" role="status"></p></aside>'
    return html.replace('<header class="masthead">',banner+'<header class="masthead">').encode()

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--port',type=int,default=8782);args=parser.parse_args()
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path.split('?')[0]!='/offline-url-inspector/':self.send_error(404);return
            data=fixture_html();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        def log_message(self,*args):pass
    print(f'Controlled reference fixture: http://127.0.0.1:{args.port}/offline-url-inspector/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
