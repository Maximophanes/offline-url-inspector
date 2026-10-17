import { readFileSync,writeFileSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const read=p=>readFileSync(resolve(root,p),'utf8');
export const html=edition=>read(edition==='hosted'?'site/index.html':'standalone/Offline_URL_Inspector.html');
export function modules(){const data=html().match(/id="unicode-data">([\s\S]*?)<\/script>/)[1];return new Function('document',[read('src/core.js'),read('src/references.js'),read('src/presentation.js'),'return {Inspector,ReferenceDomains,Presentation};'].join('\n'))({getElementById:()=>({textContent:data})});}
export function suite(name,filename){
 const report={suite:name,groups:{},failures:[],assertions:{executed:0,passed:0,failed:0}};let group='checks';
 function assert(v,msg='Assertion failed'){report.assertions.executed++;report.assertions[v?'passed':'failed']++;if(!v)throw Error(msg);}
 const equal=(a,b)=>assert(JSON.stringify(a)===JSON.stringify(b),JSON.stringify(a)+' !== '+JSON.stringify(b));
 async function test(name,fn){const g=report.groups[group]??={executed:0,passed:0,failed:0};g.executed++;try{await fn();g.passed++;}catch(e){g.failed++;report.failures.push({group,name,error:e.message});}}
 const throws=(fn,pattern)=>{let error;try{fn();}catch(e){error=e;}assert(!!error,'Expected a rejection');if(pattern)assert(pattern.test(error.message),'Unexpected error '+error.message);};
 function finish(extra={}){report.total=Object.values(report.groups).reduce((s,g)=>({executed:s.executed+g.executed,passed:s.passed+g.passed,failed:s.failed+g.failed}),{executed:0,passed:0,failed:0});Object.assign(report,extra);writeFileSync(resolve(root,'tests',filename),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({suite:name,groups:report.groups,total:report.total,assertions:report.assertions,failures:report.failures.slice(0,25)},null,2));if(report.total.failed)Deno.exit(1);}
 return {report,assert,equal,test,throws,group:value=>{group=value;},finish};
}
export class MemoryStorage {
 constructor(){this.values=new Map();this.writes=[];this.failRead=false;this.failWrite=false;}
 getItem(k){if(this.failRead)throw Error('Storage disabled');return this.values.get(k)??null;}
 setItem(k,v){if(this.failWrite)throw Error('Quota exceeded');this.values.set(k,String(v));this.writes.push([k,String(v)]);}
 removeItem(k){this.values.delete(k);}
}
// Restore only the navigation-recovery prose when checking published worker pins.
// Matching the old full-file hash then proves every other worker byte is unchanged.
export function functionalSource(path){
 const source=read(path);if(path!=='src/sw.js')return source;
 const pattern=/(?<=return new Response\()'(?:\\.|[^'\\])*'(?=,\{status:503)/g,matches=[...source.matchAll(pattern)];
 if(matches.length!==1)throw Error('Expected exactly one scoped 503 recovery message');
 return source.replace(pattern,JSON.parse(read('tests/editorial-baseline.json')).workerRecoveryLiteral);
}
