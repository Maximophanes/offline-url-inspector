// Isolated DOM integration. This does NOT substitute for Firefox/CSP rendering tests.
// Development dependency only, pinned; absent from the standalone HTML.
import { Window } from 'npm:happy-dom@20.8.4';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertASCII } from './assert-ascii.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'standalone/Offline_URL_Inspector.html'),'utf8');
const data=html.match(/<script type="application\/json" id="unicode-data">([\s\S]*?)<\/script>/)[1];
const runtime=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
const w=new Window({settings:{enableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableIframePageLoading:true}});
const attempts=[];
for(const k of ['fetch','open'])w[k]=(...args)=>{attempts.push([k,...args.map(String)]);throw Error('Network/navigation attempt blocked by test');};
for(const k of ['XMLHttpRequest','WebSocket','EventSource','Worker'])w[k]=class{constructor(...args){attempts.push([k,...args.map(String)]);throw Error('Network/worker attempt blocked by test');}};
w.document.write(markup);
const dataTag=w.document.createElement('script');dataTag.type='application/json';dataTag.id='unicode-data';dataTag.textContent=data;w.document.body.appendChild(dataTag);
w.eval(runtime+'\nwindow.testInspector=Inspector;');
const I=w.testInspector,$=id=>w.document.getElementById(id);
const report={suite:'isolated Happy DOM integration',version:'20.8.4',groups:{},failures:[],networkAttempts:[],assertions:{executed:0,passed:0,failed:0}};let group='rendered cases';
function assert(value,msg='Assertion failed'){report.assertions.executed++;report.assertions[value?'passed':'failed']++;if(!value)throw Error(msg);}
function equal(a,b){assert(a===b,JSON.stringify(a)+' !== '+JSON.stringify(b));}
function test(name,fn){const g=report.groups[group]??={executed:0,passed:0,failed:0};g.executed++;try{fn();g.passed++;}catch(e){g.failed++;report.failures.push({group,name,error:e.message});}}
function inspect(url,expected=''){$('link').value=url;$('expected').value=expected;$('inspect').click();return I.inspect($('link').value,expected);}
for(const c of JSON.parse(readFileSync(resolve(root,'tests/cases.json'))))test(c.name,()=>{
  const r=inspect(c.url,c.expected||'');equal(r.ok,!c.reject);assert(!$('results').classList.contains('hidden'));
  if(r.ok){equal($('ascii').textContent,r.ascii);if(r.decodeError)assert($('unicode').textContent.startsWith('Unavailable'));else equal($('unicode').textContent,I.visible(r.unicode));assert($('messages').textContent.includes('Destination unverified'));}
  else equal($('ascii').textContent,'—');
  if(c.originalCodepoint)assert($('originalChars').textContent.includes(c.originalCodepoint),'Missing original Unicode code point in UI');
  if(c.original!==undefined)equal($('original').textContent,I.visible(c.original));
  if(c.kind==='exact')assert($('comparisonResult').textContent.startsWith('Exact hostname match'));
  if(c.kind==='visual')assert($('comparisonResult').textContent.includes('Potential visual impersonation'));
  if(c.expectedError)assert($('comparisonResult').textContent.startsWith('Could not validate'));
});
group='Version 2.1 ASCII ambiguity rendering';
for(const c of JSON.parse(readFileSync(resolve(root,'tests/ascii-cases.json'))))test(c.name,()=>{
  const r=inspect(c.url,c.expected||'');assertASCII(I,c,r,assert,equal);
  const notices=[...$('messages').children].filter(el=>el.textContent.startsWith('ASCII visual ambiguity'));
  equal(notices.length,r.asciiAmbiguities.length?1:0);
  if(notices.length){assert(notices[0].classList.contains('small'));assert(!notices[0].classList.contains('alert'));}
  if(c.kind==='exact')assert($('comparisonResult').textContent.startsWith('Exact hostname match'));
  if(c.noComparison)assert(!$('comparisonResult').textContent.includes('Potential visual impersonation'));
});
test('Repeated inspection does not duplicate informational findings',()=>{inspect('https://turn.com');inspect('https://turn.com');equal([...$('messages').children].filter(el=>el.textContent.startsWith('ASCII visual ambiguity')).length,1);inspect('https://fgh.net');assert(!$('messages').textContent.includes('ASCII visual ambiguity'));});
group='UI state, text rendering, keyboard, network guards';
test('Unicode example',()=>{$('demoUnicode').click();assert($('comparisonResult').textContent.includes('Potential visual impersonation'));assert($('coloredHost').querySelector('.badchar'));});
test('ASCII example',()=>{$('demoAscii').click();assert($('comparisonResult').textContent.includes('Potential visual impersonation'));});
for(const key of ['metaKey','ctrlKey'])test(key+' Return shortcut',()=>{$('link').value='https://example.invalid';$('expected').value='example.invalid';$('link').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',[key]:true,bubbles:true}));assert($('comparisonResult').textContent.startsWith('Exact'));});
test('Malformed input resets stale results and style',()=>{inspect('https://example.invalid','example.invalid');inspect('https://[');equal($('ascii').textContent,'—');equal($('comparisonResult').className,'value');equal($('coloredHost').textContent,'');});
test('Invalid expected field resets previous match style',()=>{inspect('https://example.invalid','example.invalid');inspect('https://example.invalid','example.invalid:443');equal($('comparisonResult').className,'value warn');});
test('XSS markup remains text',()=>{inspect('https://example.invalid/<img src=https://must-not-contact.invalid onerror="window.__attack=1">?q=<svg/onload=window.__attack=1>');equal(w.document.querySelectorAll('img,svg,iframe,object,embed,a,form,link').length,0);assert(!w.__attack);});
test('Bidi and invisible source is explicitly escaped',()=>{inspect('https://ama\u200bzon.invalid');assert($('original').textContent.includes('⟦U+200B⟧'));assert($('originalChars').textContent.includes('ignored/removed'));});
test('Combining mark source reports sequence normalization',()=>{inspect('https://cafe\u0301.invalid');assert($('originalChars').textContent.includes('sequence normalization'));});
test('Original percent spelling retained separately from decoded Unicode',()=>{inspect('https://%EF%BD%81mazon.invalid');equal($('original').textContent,'%EF%BD%81mazon.invalid');equal($('decodedOriginal').textContent,'ａmazon.invalid');assert($('originalChars').textContent.includes('U+FF41'));});
test('No unrelated path Unicode becomes highlighted hostname',()=>{inspect('https://example.invalid/а?x=𝖺#ο');equal($('coloredHost').querySelectorAll('.badchar').length,0);equal($('originalChars').querySelectorAll('.danger').length,0);});
test('Long path remains text within input limit',()=>{inspect('https://example.invalid/'+'x'.repeat(20000));equal($('ascii').textContent,'example.invalid');});
test('Input cap clears normalized output and bounds preview',()=>{inspect('https://example.invalid/'+'x'.repeat(100000));equal($('ascii').textContent,'—');assert($('messages').textContent.includes('32,768'));assert($('raw').textContent.length<33000);assert($('link').value.length>100000);});
test('No submitted address reaches resource/navigation attributes',()=>equal(w.document.querySelectorAll('[src],[href],[action]').length,0));
test('No network/navigation API attempts across the entire suite',()=>equal(attempts.length,0));
test('Required original layout and responsive CSS retained',()=>{assert(html.includes('@media(max-width:620px)'));assert(html.includes('max-width:1040px'));assert(html.includes('--bg:#110a1b'));for(const id of ['inspect','demoUnicode','demoAscii','scheme','port','path','query','fragment'])assert($(id));});
test('Bundled Unicode license rendered',()=>assert($('license').textContent.startsWith('UNICODE LICENSE V3')));
report.networkAttempts=attempts;
report.total=Object.values(report.groups).reduce((s,g)=>({executed:s.executed+g.executed,passed:s.passed+g.passed,failed:s.failed+g.failed}),{executed:0,passed:0,failed:0});
writeFileSync(resolve(root,'tests/dom-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));await w.happyDOM.close();
if(report.total.failed)Deno.exit(1);
