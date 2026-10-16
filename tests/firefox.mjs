// Real Firefox integration via W3C WebDriver + WebDriver BiDi request events.
// Start geckodriver --host 127.0.0.1 --port 4445 before running this file.
// Only loopback is needed by this test runner; the application makes no requests.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertASCII } from './assert-ascii.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const endpoint='http://127.0.0.1:4445';
const edition=Deno.args.includes('--hosted')?'hosted':'standalone';
let session,ws,bidiId=0;const pending=new Map(),requests=[],logs=[];
async function wd(method,path='',body){
  const res=await fetch(endpoint+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  const data=await res.json();if(data.value?.error)throw Error(data.value.error+': '+data.value.message);return data.value;
}
const exec=(script,args=[])=>wd('POST','/session/'+session+'/execute/sync',{script,args});
const report={suite:'Firefox integration: '+edition,groups:{},failures:[],networkRequests:[],assertions:{executed:0,passed:0,failed:0}};let group='rendered application cases';
const assert=(value,msg='Assertion failed')=>{report.assertions.executed++;report.assertions[value?'passed':'failed']++;if(!value)throw Error(msg);};
const equal=(a,b)=>assert(a===b,JSON.stringify(a)+' !== '+JSON.stringify(b));
async function test(name,fn){const g=report.groups[group]??={executed:0,passed:0,failed:0};g.executed++;try{await fn();g.passed++;}catch(e){g.failed++;report.failures.push({group,name,error:e.message});}}
function bidi(method,params){return new Promise((resolve,reject)=>{const id=++bidiId;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
try{
  const value=await wd('POST','/session',{capabilities:{alwaysMatch:{browserName:'firefox',webSocketUrl:true,'moz:firefoxOptions':{args:['-headless'],prefs:{'browser.shell.checkDefaultBrowser':false,'browser.startup.page':0,'browser.newtabpage.enabled':false,'datareporting.healthreport.uploadEnabled':false,'toolkit.telemetry.enabled':false,'app.normandy.enabled':false}}}}});
  session=value.sessionId;report.capabilities=value.capabilities;
  ws=new WebSocket(value.capabilities.webSocketUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  ws.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const p=pending.get(msg.id);if(p){pending.delete(msg.id);msg.type==='error'?p.reject(Error(msg.message)):p.resolve(msg.result);}}else if(msg.method==='network.beforeRequestSent')requests.push(msg.params.request.url);else if(msg.method==='log.entryAdded')logs.push(msg.params);};
  await bidi('session.subscribe',{events:['network.beforeRequestSent','log.entryAdded']});
  await wd('POST','/session/'+session+'/window/rect',{width:1100,height:1000});
  await wd('POST','/session/'+session+'/url',{url:edition==='hosted'?'http://127.0.0.1:8765/offline-url-inspector/':pathToFileURL(resolve(root,'standalone/Offline_URL_Inspector.html')).href});
  assert(await exec('return typeof Inspector === "object" && Inspector.version === "18.0.0";'),'Application script failed to initialize (CSP or syntax error)');
  const initialRequests=requests.splice(0);report.initialRequests=initialRequests;
  const cases=JSON.parse(readFileSync(resolve(root,'tests/cases.json')));
  for(const c of cases)await test(c.name,async()=>{
    const r=await exec(`document.getElementById('link').value=arguments[0];document.getElementById('expected').value=arguments[1];document.getElementById('inspect').click();
      const r=Inspector.inspect(document.getElementById('link').value,document.getElementById('expected').value);
      return {r,display:{ascii:document.getElementById('ascii').textContent,unicode:document.getElementById('unicode').textContent,original:document.getElementById('original').textContent,originalChars:document.getElementById('originalChars').textContent,compare:document.getElementById('comparisonResult').textContent,messages:document.getElementById('messages').textContent,shown:!document.getElementById('results').classList.contains('hidden')}};`,[c.url,c.expected||'']);
    const a=r.r,d=r.display;equal(a.ok,!c.reject);assert(d.shown);
    for(const k of ['ascii','unicode','assumed'])if(k in c)equal(a[k],c[k]);
    if('kind'in c)equal(a.comparison?.kind,c.kind);
    if(c.mechanism)equal(a.comparison?.mechanism,c.mechanism);
    if(c.original!==undefined)equal(a.original?.original,c.original);
    if(c.originalCodepoint)assert(d.originalChars.includes(c.originalCodepoint),'Original code point missing from rendered result');
    for(const code of c.codes||[])assert(a.messages.some(m=>m.code===code),'Missing '+code);
    for(const code of c.notCodes||[])assert(!a.messages.some(m=>m.code===code),'Unexpected '+code);
    if(a.ok){equal(d.ascii,a.ascii);assert(d.messages.includes('Destination unverified'));}
    else equal(d.ascii,'—');
    if(c.kind==='exact')assert(d.compare.startsWith('Exact hostname match'));
  });
  group='Version 2.1 neutral ASCII observation and contextual comparison';
  for(const c of JSON.parse(readFileSync(resolve(root,'tests/ascii-cases.json'))))await test(c.name,async()=>{
    const value=await exec(`document.getElementById('link').value=arguments[0];document.getElementById('expected').value=arguments[1];document.getElementById('inspect').click();return {r:Inspector.inspect(arguments[0],arguments[1]),notices:[...document.getElementById('messages').children].filter(el=>el.textContent.startsWith('ASCII visual ambiguity')).map(el=>({text:el.textContent,style:el.className}))};`,[c.url,c.expected||'']);
    assertASCII(null,c,value.r,assert,equal);equal(value.notices.length,value.r.asciiAmbiguities.length?1:0);
    for(const n of value.notices){assert(n.style.includes('small'));assert(!n.style.includes('alert'));}
  });
  group='V3 hierarchy, references, and hosted cache';
  await test('Primary finding and details hierarchy',async()=>{await exec('document.getElementById("demoUnicode").click();');equal(await exec('return document.getElementById("results").firstElementChild.id'),'primary');equal(await exec('return document.getElementById("primaryTitle").textContent'),'Potential hostname impersonation');});
  await test('Reference list explicit add and conservative automatic comparison',async()=>{await exec('document.getElementById("referenceInput").value="amazon.com";document.getElementById("saveReference").click();document.getElementById("expected").value="";document.getElementById("link").value="https://arnazon.com";document.getElementById("inspect").click();');equal(await exec('return document.getElementById("primaryTitle").textContent'),'Potential hostname impersonation');});
  await test('Portable reviewed import/export',async()=>{const exported=await exec('return referenceStore.exportJSON();');const backup=JSON.parse(exported);equal(backup.application,'offline-url-inspector');equal(backup.schemaVersion,1);assert(backup.references.includes('amazon.com'));await exec('beginImport(arguments[0]);', [exported]);assert(await exec('return !document.getElementById("importReview").classList.contains("hidden");'));await exec('document.getElementById("applyImport").click();');});
  if(edition==='hosted'){
    await test('Actual worker scope and cache readiness',async()=>{const value=await wd('POST','/session/'+session+'/execute/async',{script:'const done=arguments[arguments.length-1];navigator.serviceWorker.ready.then(reg=>done(reg.scope));',args:[]});equal(new URL(value).pathname,'/offline-url-inspector/');});
    await test('Hosted references survive page reload',async()=>{await wd('POST','/session/'+session+'/refresh',{});assert(await exec('return referenceStore.snapshot().references.includes("amazon.com");'));});
  }
  group='controls, rendering, CSP, and responsiveness';
  await test('Unicode demonstration button',async()=>{await exec('document.getElementById("demoUnicode").click();');assert((await exec('return document.getElementById("comparisonResult").textContent')).includes('Potential visual impersonation'));});
  await test('ASCII demonstration button',async()=>{await exec('document.getElementById("demoAscii").click();');assert((await exec('return document.getElementById("comparisonResult").textContent')).includes('Potential visual impersonation'));});
  await test('Command Return keyboard shortcut',async()=>{await exec('document.getElementById("link").value="https://example.invalid";document.getElementById("expected").value="example.invalid";document.getElementById("link").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",metaKey:true,bubbles:true}));');assert((await exec('return document.getElementById("comparisonResult").textContent')).startsWith('Exact'));});
  await test('Controls visible and no stale state on malformed input',async()=>{await exec('document.getElementById("link").value="https://[";document.getElementById("inspect").click();');equal(await exec('return document.getElementById("ascii").textContent'),'—');equal(await exec('return document.getElementById("comparisonResult").className'),'value');});
  await test('Injection payload creates no active elements',async()=>{
    await exec('document.getElementById("link").value=arguments[0];document.getElementById("inspect").click();',['https://example.invalid/<img src="https://must-not-contact.invalid/x" onerror="window.__injected=1">?x=<svg/onload=window.__injected=1>']);
    equal(await exec('return document.querySelectorAll("img,svg,iframe,a,form,link,object,embed").length'),0);equal(await exec('return window.__injected||0'),0);
  });
  await test('Long URL renders within bounded input',async()=>{const data=await exec('const t=performance.now();document.getElementById("link").value="https://example.invalid/"+"a".repeat(20000);document.getElementById("expected").value="";document.getElementById("inspect").click();return {ascii:document.getElementById("ascii").textContent,ms:performance.now()-t};');equal(data.ascii,'example.invalid');assert(data.ms<5000);report.longURLRenderMilliseconds=data.ms;});
  await test('32K input cap shows error and clears destination',async()=>{await exec('document.getElementById("link").value="https://example.invalid/"+"a".repeat(32768);document.getElementById("inspect").click();');equal(await exec('return document.getElementById("ascii").textContent'),'—');});
  await test('No horizontal overflow on desktop',async()=>{await exec('document.getElementById("demoUnicode").click();');const d=await exec('return {scroll:document.documentElement.scrollWidth,width:innerWidth};');assert(d.scroll<=d.width);});
  const desktop=await wd('GET','/session/'+session+'/screenshot');writeFileSync(resolve(root,'tests/firefox-'+edition+'-desktop.png'),Uint8Array.from(atob(desktop),c=>c.charCodeAt(0)));
  await wd('POST','/session/'+session+'/window/rect',{width:390,height:844});
  await test('Responsive single-column layout',async()=>{const d=await exec('return {scroll:document.documentElement.scrollWidth,width:innerWidth,columns:getComputedStyle(document.querySelector(".row")).gridTemplateColumns};');assert(d.scroll<=d.width);assert(!d.columns.includes('175px'));});
  const mobile=await wd('GET','/session/'+session+'/screenshot');writeFileSync(resolve(root,'tests/firefox-'+edition+'-mobile.png'),Uint8Array.from(atob(mobile),c=>c.charCodeAt(0)));
  await test('Unicode controls rendered as explicit code points',async()=>{await exec('document.getElementById("link").value="https://ama\\u200bzon.invalid".replace("\\u200b","\u200b");document.getElementById("inspect").click();');assert((await exec('return document.getElementById("original").textContent')).includes('U+200B'));});
  await test('No destination attributes or active resource tags after inspection',async()=>{equal(await exec('return document.querySelectorAll("[src],[href],[action],iframe,object,embed,img,link").length'),0);});
  group='actual browser offline enforcement';
  // Observe an additional event-loop turn before checking BiDi events.
  await exec('return document.readyState;');
  await test('No network requests during all submitted-URL inspections',async()=>assert(!requests.some(u=>{const v=new URL(u);return v.protocol==='http:'||v.protocol==='https:'?!(v.origin==='http://127.0.0.1:8765'&&['/offline-url-inspector/sw.js','/offline-url-inspector/index.html','/offline-url-inspector/'].includes(v.pathname)):false;}),'Submitted or unrelated destination requested'));
  await test('No uncaught browser script errors',async()=>{assert(!logs.some(l=>l.type==='javascript'&&l.level==='error'),JSON.stringify(logs));});
  // Force one fetch from the page realm as a negative CSP canary. This is a
  // test-only .invalid address; CSP must reject it before a request is sent.
  const asyncValue=await wd('POST','/session/'+session+'/execute/async',{script:'const done=arguments[arguments.length-1];fetch("https://csp-canary.invalid/").then(()=>done("unexpected success"),()=>done("blocked"));',args:[]});
  await test('connect-src none blocks deliberate page fetch',async()=>equal(asyncValue,'blocked'));
  await test('CSP canary produced no outgoing request',async()=>assert(!requests.some(u=>u.includes('csp-canary.invalid'))));
  report.networkRequests=[...requests];report.consoleLogs=logs;
}catch(e){
  report.harnessError=e.message;
}finally{
  if(ws)ws.close();
  if(session)await wd('DELETE','/session/'+session).catch(()=>{});
  report.total=Object.values(report.groups).reduce((s,g)=>({executed:s.executed+g.executed,passed:s.passed+g.passed,failed:s.failed+g.failed}),{executed:0,passed:0,failed:0});
  report.status=report.harnessError?(report.total.executed?'incomplete: harness error':'not executed: browser startup failed'):'executed';
  writeFileSync(resolve(root,'tests/firefox-'+edition+'-results.json'),JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({browser:report.capabilities?.browserVersion,groups:report.groups,total:report.total,requests:report.networkRequests,failures:report.failures},null,2));
if(report.total.failed||report.harnessError)Deno.exit(1);
