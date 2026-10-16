// Deno 2.x; no downloaded modules. Test fixtures are independent source data.
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { assertASCII } from './assert-ascii.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'standalone/Offline_URL_Inspector.html'),'utf8');
const json=html.match(/<script type="application\/json" id="unicode-data">([\s\S]*?)<\/script>/)[1];
const code=readFileSync(resolve(root,'src/core.js'),'utf8');
const I=new Function('document',code+';return Inspector;')({getElementById:()=>({textContent:json})});
const report={suite:'unit and official Unicode fixtures',runtime:Deno.version,groups:{},failures:[],assertions:{executed:0,passed:0,failed:0}};
let group='application cases';
function test(name,fn){const g=report.groups[group]??={executed:0,passed:0,failed:0};g.executed++;try{fn();g.passed++;}catch(e){g.failed++;report.failures.push({group,name,error:String(e.message)});}}
function assert(v,message='Assertion failed'){report.assertions.executed++;report.assertions[v?'passed':'failed']++;if(!v)throw Error(message);}
function equal(a,b){assert(a===b,`${JSON.stringify(a)} !== ${JSON.stringify(b)}`);}
const cases=JSON.parse(readFileSync(resolve(root,'tests/cases.json')));
cases.push(
 {name:'Very long URL below limit',url:'https://example.invalid/'+ 'a'.repeat(20000),ascii:'example.invalid'},
 {name:'Excessive URL',url:'https://example.invalid/'+ 'a'.repeat(32768),reject:true,codes:['too-long']},
 {name:'64-byte label warned',url:'https://'+'a'.repeat(64)+'.invalid',codes:['dns']},
 {name:'253-byte DNS boundary',url:'https://'+Array(4).fill('a'.repeat(63)).join('.'),codes:['dns']},
 {name:'Leading hyphen label warned',url:'https://-abc.invalid',codes:['dns']},
 {name:'Empty label warned',url:'https://a..invalid',codes:['dns']},
 {name:'Unexpected Unicode combinations rejected',url:'https://a\u0301\u200d\u202e.invalid',reject:true},
 {name:'NUL in host rejected',url:'https://ab\u0000c.invalid',reject:true,originalCodepoint:'U+0000'},
 {name:'Lone surrogate rejected',url:'https://ab\ud800.invalid',reject:true}
);
for(const c of cases)test(c.name,()=>{
  const r=I.inspect(c.url,c.expected||'');
  equal(r.ok,!c.reject);
  for(const k of ['ascii','unicode','assumed'])if(k in c)equal(r[k],c[k]);
  if('kind'in c)equal(r.comparison?.kind,c.kind);
  if(c.mechanism)equal(r.comparison?.mechanism,c.mechanism);
  if(c.type)assert(r.comparison?.types?.includes(c.type));
  if('count'in c)equal(r.characters.length,c.count);
  if('originalCount'in c)equal(r.originalCharacters.length,c.originalCount);
  if(c.original!==undefined)equal(r.original?.original,c.original);
  if(c.reliable!==undefined)equal(r.original?.reliable,c.reliable);
  if(c.codepoint)assert(r.characters.some(x=>x.code===c.codepoint));
  if(c.originalCodepoint)assert(r.originalCharacters.some(x=>x.code===c.originalCodepoint));
  if(c.characterName)assert(r.characters.some(x=>x.name===c.characterName));
  if(c.visualUnavailable)equal(r.comparison?.visual,null);
  if(c.expectedError)assert(r.expectedError);
  for(const code of c.codes||[])assert(r.messages.some(m=>m.code===code),'Missing message: '+code);
  for(const code of c.notCodes||[])assert(!r.messages.some(m=>m.code===code),'Unexpected message: '+code);
  if(r.comparison?.exact)assert(!r.messages.some(m=>m.code==='impersonation'),'Exact match must never be classified as impersonation');
  if(r.ok)assert(r.messages.some(m=>m.code==='unverified'));
});
group='Version 2.1 standalone and contextual ASCII ambiguity';
for(const c of JSON.parse(readFileSync(resolve(root,'tests/ascii-cases.json'))))test(c.name,()=>assertASCII(I,c,I.inspect(c.url,c.expected||''),assert,equal));
group='authority attribution combinations';
for(const scheme of ['https://','HTTPS://','http://','https:\t//',''])
for(const user of ['','user:pass@','аmazon:päss@','first@second@','user%40name@'])
for(const port of ['',':443',':8443'])
for(const [source,ascii,unicode]of [['example.invalid','example.invalid','example.invalid'],['ａmazon.invalid','amazon.invalid','amazon.invalid'],['%D0%B0mazon.invalid','xn--mazon-3ve.invalid','аmazon.invalid'],['[2001:db8::1]','[2001:db8::1]','[2001:db8::1]']])
for(const suffix of ['/path/а?x=@#x','?x=𝖺#fragment'])
test(JSON.stringify([scheme,user,port,source,suffix]),()=>{
  const r=I.inspect(' \n'+scheme+user+source+port+suffix+'\t ');
  // An ASCII "user:" prefix is indistinguishable from an unsupported scheme.
  // Require an explicit HTTP(S) scheme instead of guessing credential syntax.
  if(!scheme&&user==='user:pass@'){assert(!r.ok);assert(r.messages.some(m=>m.code==='scheme'));return;}
  assert(r.ok);equal(r.ascii,ascii);equal(r.unicode,unicode);equal(r.original.original,source);equal(r.original.reliable,true);
});
group='NFD official Unicode 18 conformance';
const fromHex=s=>s.trim().split(/\s+/).filter(Boolean).map(x=>String.fromCodePoint(parseInt(x,16))).join('');
for(const [i,line]of readFileSync(resolve(root,'data/NormalizationTest.txt'),'utf8').split('\n').entries()){
  const data=line.split('#')[0].trim();if(!data||data[0]==='@')continue;
  const c=data.split(';').slice(0,5).map(fromHex);
  for(let k=0;k<5;k++)test(`line ${i+1} column ${k+1}`,()=>equal(I.nfd(c[k]),k<3?c[2]:c[4]));
}
group='official confusables prototype mapping';
for(const [i,line]of readFileSync(resolve(root,'data/confusables.txt'),'utf8').split('\n').entries()){
  const data=line.split('#')[0].trim();if(!data)continue;
  const [a,b]=data.split(';').slice(0,2).map(fromHex);
  test(`line ${i+1}`,()=>equal(I.internalSkeleton(a),I.internalSkeleton(b)));
}
group='UTS 39 behavior and separation';
for(const [a,b]of [['paypal','pаypаl'],['scope','ѕсоре'],['m','rn'],['I','l'],['1','l'],['0','O'],['ǉeto','ljeto']])test(a+' = '+b,()=>equal(I.skeleton(a),I.skeleton(b)));
test('No accidental skeleton case folding',()=>assert(I.skeleton('A')!==I.skeleton('a')));
test('No unsupported vv claim in UTS',()=>assert(I.skeleton('vv')!==I.skeleton('w')));
test('Whole-script definition',()=>equal(I.confusableType('scope','ѕсоре'),'whole-script'));
test('Mixed-script definition',()=>equal(I.confusableType('paypal','pаypаl'),'mixed-script'));
test('Single-script definition',()=>equal(I.confusableType('ǉeto','ljeto'),'single-script'));
test('Japanese resolved scripts',()=>assert(I.resolved('例えテスト').has('Jpan')));
test('Han Latin writing system in rev34',()=>assert(I.resolved('漢a').has('Hntl')));
test('Default ignorable removed in internal skeleton',()=>equal(I.internalSkeleton('a\u200bb'),'ab'));
for(const s of ['שלום','مثال','a\u202eb','a\u2067b'])test('Explicit bidi scope '+JSON.stringify(s),()=>equal(I.skeleton(s),null));
test('Supplementary official character naming',()=>equal(I.info('𝖺').name,'MATHEMATICAL SANS-SERIF SMALL A'));
test('Algorithmic Hangul name',()=>equal(I.info('한').name,'HANGUL SYLLABLE HAN'));
test('Unassigned code point still detected',()=>{const i=I.info('\u0378');assert(i.nonASCII);equal(i.name,'UNASSIGNED CODE POINT');});
group='independent Python RFC 3492 fixtures';
const refs=JSON.parse(readFileSync(resolve(root,'tests/punycode-reference.json')));
for(const r of refs)test(r.text,()=>{equal(I.punyDecode(r.label),r.text);equal(I.punyEncode(r.text),r.label);});
group='official IDNA vectors: matching output or explicit browser rejection';
// Deliberately scoped to successful, ordinary nontransitional vectors. This
// tests interoperability, not full UTS #46 conformance of the installed browser.
const unescape=s=>s.replace(/\\u([0-9a-fA-F]{4})|\\x\{([0-9a-fA-F]+)\}/g,(_,a,b)=>String.fromCodePoint(parseInt(a||b,16)));
let vectors=0;const idnaProbe={runtime:Deno.version,scope:'First 300 eligible nontransitional success vectors; separate interoperability diagnostic, not a UTS 46 conformance claim.',matched:0,differences:[]};
for(const [i,line]of readFileSync(resolve(root,'data/IdnaTestV2.txt'),'utf8').split('\n').entries()){
  const data=line.split('#')[0].trim();if(!data||data[0]==='@')continue;
  const fields=data.split(';').map(s=>s.trim());let [source,toUnicode,unicodeStatus,toAscii,asciiStatus]=fields;
  if(unicodeStatus&&unicodeStatus!=='[]'||asciiStatus&&asciiStatus!=='[]')continue;
  source=unescape(source);toUnicode=unescape(toUnicode||source);toAscii=unescape(toAscii||toUnicode);
  if(!toAscii||!/^[a-z0-9.-]+$/i.test(toAscii)||/[\s:/\\@?#%]/.test(source)||source.length>253||source.split('.').some(l=>l.length>63))continue;
  if(vectors++>=300)break;
  let native;try{native=new URL('https://'+source+'/');}catch{}
  if(!native||native.hostname!==toAscii.toLowerCase())idnaProbe.differences.push({line:i+1,source,expected:toAscii,actual:native?.hostname||'browser rejected'});else idnaProbe.matched++;
  test(`official line ${i+1}`,()=>{
    const r=I.inspect('https://'+source+'/');
    if(!native){assert(!r.ok);assert(r.messages.some(m=>m.code==='parse'));return;}
    assert(r.ok);equal(r.ascii,native.hostname);
    if(native.hostname===toAscii.toLowerCase())equal(r.unicode,toUnicode.toLowerCase());
  });
}
writeFileSync(resolve(root,'tests/idna-probe-results.json'),JSON.stringify(idnaProbe,null,2)+'\n');
group='offline packaging and CSP';
test('Script hash matches exact source',()=>{const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];const hash=createHash('sha256').update(js).digest('base64');assert(html.includes("script-src 'sha256-"+hash+"'"));});
test('CSP denies network and navigation primitives',()=>{for(const s of ["default-src 'none'","connect-src 'none'","img-src 'none'","font-src 'none'","frame-src 'none'","form-action 'none'","base-uri 'none'","worker-src 'none'"])assert(html.includes(s));assert(!html.includes("script-src 'unsafe-inline'"));});
test('No external active resource attributes',()=>{const markup=html.slice(0,html.indexOf('<script type='));assert(!/\b(?:src|href|action)\s*=/i.test(markup));});
test('No executable sinks or inspected-destination network APIs in shared runtime',()=>{const runtime=code+['ui.js','references.js','presentation.js'].map(f=>readFileSync(resolve(root,'src/'+f),'utf8')).join('\n');assert(!/\.innerHTML|\.outerHTML|insertAdjacentHTML|document\.write|\beval\s*\(|new Function|\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|window\.open|location\s*=(?!=)|location\.(?:href\s*=|assign\(|replace\()/.test(runtime));});
const total=Object.values(report.groups).reduce((s,g)=>({executed:s.executed+g.executed,passed:s.passed+g.passed,failed:s.failed+g.failed}),{executed:0,passed:0,failed:0});report.total=total;
writeFileSync(resolve(root,'tests/unit-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({groups:report.groups,total,assertions:report.assertions,failures:report.failures.slice(0,25)},null,2));
if(total.failed)Deno.exit(1);
