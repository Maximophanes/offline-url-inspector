// Reproduce all 19 V2 findings and isolate their shared Georgian mapping trigger.
// This is a development diagnostic, not a replacement IDNA implementation.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, domainToASCII } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'standalone/Offline_URL_Inspector.html'),'utf8');
const data=html.match(/id="unicode-data">([\s\S]*?)<\/script>/)[1];
const I=new Function('document',readFileSync(resolve(root,'src/core.js'),'utf8')+';return Inspector;')({getElementById:()=>({textContent:data})});
const findings=JSON.parse(readFileSync(resolve(root,'tests/idna-v2-findings.json'))).differences;
// Independently reviewed identical mappings in official Unicode 16, 17, and 18.
const georgian=new Map([['Ⴀ','ⴀ'],['Ⴌ','ⴌ'],['Ⴎ','ⴎ'],['Ⴚ','ⴚ']]);
function native(s){try{return new URL('https://'+s+'/').hostname;}catch{return null;}}
const report={suite:'review of the 19 original IDNA discrepancies',runtime:Deno.version,icu:process.versions.icu,groups:{},failures:[],findings:[],assertions:{executed:0,passed:0,failed:0}};let group='isolated Georgian mapping and application handling';
function assert(v,message){report.assertions.executed++;report.assertions[v?'passed':'failed']++;if(!v)throw Error(message||'Assertion failed');}
function equal(a,b){assert(a===b,JSON.stringify(a)+' !== '+JSON.stringify(b));}
function test(name,fn){const g=report.groups[group]??={executed:0,passed:0,failed:0};g.executed++;try{fn();g.passed++;}catch(e){g.failed++;report.failures.push({group,name,error:e.message});}}
for(const f of findings){
 const mapped=[...f.source].map(c=>georgian.get(c)||c).join('');
 const before=native(f.source),after=native(mapped),app=I.inspect('https://'+f.source+'/');
 const caps=[...new Set([...f.source].filter(c=>georgian.has(c)))];
 report.findings.push({line:f.line,source:f.source,expected:f.expected,georgianCapitals:caps.map(c=>({character:c,codePoint:I.cp(c),mapping:georgian.get(c)})),nativeOriginal:before,nativeWithOnlyGeorgianMapped:after,nodeDomainToASCII:domainToASCII(f.source),application:{ok:app.ok,ascii:app.ascii||null,messageCodes:app.messages.map(m=>m.code)},classification:before===f.expected?'resolved in current runtime':after===f.expected?'native runtime Georgian mapping discrepancy; no app parser rewrite':'unresolved; see evidence'});
 test('Georgian trigger present, line '+f.line,()=>assert(caps.length>0));
 test('Only Georgian mapping yields official ASCII, line '+f.line,()=>equal(after,f.expected));
 test('Application reports native result honestly, line '+f.line,()=>{if(before===null){assert(!app.ok);assert(app.messages.some(m=>m.code==='parse'));assert(!app.messages.some(m=>m.code==='impersonation'));}else{assert(app.ok);equal(app.ascii,before);}});
}
group='minimal discriminating probes';
for(const [capital,mapped]of georgian){
 test(I.cp(capital)+' mapping accepted',()=>{equal(native(mapped+'.invalid'),I.punyEncode(mapped)+'.invalid');});
 report.findings.push({minimalCapital:capital,mapped,nativeCapital:native(capital+'.invalid'),nativeMapped:native(mapped+'.invalid')});
}
test('Greater-than plus overlay is not the cause',()=>equal(native('>\u0338.invalid'),native('≯.invalid')));
test('Equals plus overlay is not the cause',()=>equal(native('=\u0338.invalid'),native('≠.invalid')));
test('All 19 original findings reviewed',()=>equal(findings.length,19));
report.total=Object.values(report.groups).reduce((s,g)=>({executed:s.executed+g.executed,passed:s.passed+g.passed,failed:s.failed+g.failed}),{executed:0,passed:0,failed:0});
writeFileSync(resolve(root,'tests/idna-review-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({runtime:report.runtime,groups:report.groups,total:report.total,assertions:report.assertions,failures:report.failures},null,2));if(report.total.failed)Deno.exit(1);
