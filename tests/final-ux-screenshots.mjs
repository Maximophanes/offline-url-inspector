// Matched native before/after section captures, independent fresh browser storage.
import {connect} from './ux-bidi.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=Deno.args.find(a=>a.startsWith('--task-root='))?.slice(12);if(!root)throw Error('Supply --task-root with before/ and preview/ builds');
const b=await connect('ws://127.0.0.1:9236/session'),report={suite:'Native Firefox matched final Stage 6 before and after sections',captures:[],manifests:{}},pause=ms=>new Promise(r=>setTimeout(r,ms));let stage='before';
const server=Deno.serve({hostname:'127.0.0.1',port:9237,onListen:()=>{}},request=>{const path=new URL(request.url).pathname;if(!['/offline-url-inspector/','/offline-url-inspector/index.html','/offline-url-inspector/sw.js'].includes(path))return new Response('',{status:404});const sw=path.endsWith('sw.js');return new Response(readFileSync(root+'/'+stage+(sw?'/site/sw.js':'/site/index.html')),{headers:{'content-type':sw?'application/javascript':'text/html','cache-control':'no-store'}});});
mkdirSync(root+'/gallery',{recursive:true});
async function capture(edition,name,id){await b.page('document.activeElement?.blur();document.getElementById('+JSON.stringify(id)+').scrollIntoView({block:"start"});return true;');await pause(250);const clip=await b.page('const r=document.getElementById('+JSON.stringify(id)+').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};');const path=root+'/gallery/'+stage+'-'+edition+'-'+name+'.png';await b.screenshot(path,clip);report.captures.push({stage,edition,name,path,clip,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')});}
try{report.capabilities=(await b.command('session.new',{capabilities:{alwaysMatch:{}}})).capabilities;
for(stage of ['before','preview']){
 report.manifests[stage]=JSON.parse(readFileSync(root+'/'+stage+'/build-manifest.json'));
 for(const edition of ['standalone','hosted']){
  const userContext=(await b.command('browser.createUserContext')).userContext,{context}=await b.command('browsingContext.create',{type:'tab',userContext});b.setContext(context);await b.command('browsingContext.setViewport',{context,viewport:{width:1100,height:950}});await b.command('browsingContext.navigate',{context,url:edition==='standalone'?'file://'+root+'/'+stage+'/standalone/Offline_URL_Inspector.html':'http://127.0.0.1:9237/offline-url-inspector/',wait:'complete'});await b.page('await AutomaticUI.start();document.querySelector(".inspect-card").id="captureInspection";return true;');
  if(edition==='hosted')for(let n=0;n<50;n++){if(await b.page('return document.getElementById("offlineStatus").textContent==="Offline ready";'))break;await pause(100);}
  await capture(edition,'controls','captureInspection');
  for(const [name,url]of [['neutral','https://example.com/'],['unsupported','https://example.test/'],['caution','https://rnicrosoft.com/']]){await b.page('document.getElementById("link").value='+JSON.stringify(url)+';document.getElementById("inspect").click();await new Promise(resolve=>{const check=()=>document.getElementById("results").hasAttribute("aria-busy")?setTimeout(check,0):resolve();check();});return true;');await capture(edition,name,'results');if(name==='neutral'){await b.page('document.getElementById("advanced").open=true;return true;');await capture(edition,'neutral-evidence','results');}}
  for(const [name,id]of [['references','referencePanel'],['understanding','understanding']]){await b.page('document.getElementById('+JSON.stringify(id)+').open=true;'+(name==='understanding'?'document.getElementById("technicalLimitations").open=true;document.getElementById("hostnameTerms").open=true;':'')+'return true;');await capture(edition,name,id);await b.page('document.getElementById('+JSON.stringify(id)+').open=false;return true;');}
  await b.command('browsingContext.close',{context});
 }
}
}finally{await server.shutdown();await b.close();}
writeFileSync('tests/final-ux-screenshot-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({captures:report.captures.length,browser:report.capabilities.browserVersion}));
