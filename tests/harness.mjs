import { readFileSync,writeFileSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const read=p=>readFileSync(resolve(root,p),'utf8');
export const html=edition=>{
 const option=Deno.args.find(arg=>arg.startsWith('--development-root=')),name=edition==='hosted'?'site/index.html':'standalone/Offline_URL_Inspector.html';
 return read(option?resolve(option.slice('--development-root='.length),name):name);
};
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
// Restore explicitly reviewed presentation deletions/prose for historical source pins.
// Matching the old full-file hash proves all other source bytes remain unchanged.
export function functionalSource(path){
 let source=auditBaselineSource(path);
 if(path==='src/base.css'){
  const reviewed=[
   ['.supporting{padding-left:21px;margin:12px 0 0}', '.supporting,.relevant{padding-left:21px;margin:12px 0 0}'],
   ['.supporting:empty{display:none}', '.relevant{color:var(--orange);font-family:var(--mono);font-size:13px}li{margin:5px 0}.relevant:empty,.supporting:empty{display:none}'],
   ['.readable-label{margin-top:17px}', '.readable-label{margin-top:17px}.gap{height:12px}']
  ];
  // li remains live; restore it only once alongside the reviewed deleted rule.
  source=source.replace('li{margin:5px 0}.supporting:empty{display:none}', '.supporting:empty{display:none}');
  for(const [current,original]of reviewed){if(source.split(current).length!==2)throw Error('Reviewed base-CSS cleanup boundary changed');source=source.replace(current,original);}
  return source;
 }
 if(path==='src/presentation.js'){
  const baseline=JSON.parse(read('tests/reference-interface-baseline.json'));
  for(const [start,end,key]of [['  function validation(','  function inputFailure(','validationBlock'],['  function storageStatus(','  function importSummary(','storageStatusBlock']]){
   const a=source.indexOf(start),b=source.indexOf(end,a);if(a<0||b<0)throw Error('Missing scoped presentation block');source=source.slice(0,a)+baseline[key]+source.slice(b);
  }
  return source.replace('asciiIntroduction,validation,referenceErrorHasDetails,inputFailure','asciiIntroduction,validation,inputFailure');
 }
 if(path!=='src/sw.js')return source;
 const pattern=/(?<=return new Response\()'(?:\\.|[^'\\])*'(?=,\{status:503)/g,matches=[...source.matchAll(pattern)];
 if(matches.length!==1)throw Error('Expected exactly one scoped 503 recovery message');
 return source.replace(pattern,JSON.parse(read('tests/editorial-baseline.json')).workerRecoveryLiteral);
}
// Restore only the exact audited edits, then retain the original whole-file pins.
export function auditBaselineSource(path){
 let source=stage3Source(path);const change=JSON.parse(read('tests/audit-correction-source-boundaries.json')).files[path];
 if(!change)return source;
 for(const pair of [...change.replacements].reverse()){
  if(!pair.current||source.split(pair.current).length!==2)throw Error('Audited source boundary changed: '+path);
  source=source.replace(pair.current,pair.baseline);
 }
 return source;
}
// Reverse only the explicit Stage 4 source edits before applying older audit
// boundaries. Keep original whole-file/fixture pins; never repin them to pass.
export function stage3Source(path){
 let source=stage5Source(path);if(!['src/embedded.js','src/embedded-ui.js'].includes(path))return source;
 const boundary=JSON.parse(read('tests/embedded-provenance-source-boundaries.json')).files[path],hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed Stage 4 source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(!pair.current||source.split(pair.current).length!==2)throw Error('Stage 4 restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Stage 4 restoration hash differs: '+path);
 return source;
}
// Reconstruct historical source bytes only at exact reviewed presentation edits.
// Historical whole-file pins and result fixtures remain unchanged.
export function stage5Source(path){
 let source=stage6Source(path);const boundary=JSON.parse(read('tests/automatic-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed Stage 6 source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(!pair.current||source.split(pair.current).length!==2)throw Error('Stage 6 restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Stage 6 restoration hash differs: '+path);
 return source;
}

// Exact reviewed UX edits only; older known whole-file pins remain authoritative.
export function stage6Source(path){
 let source=finalUXSource(path);const boundary=JSON.parse(read('tests/ux-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex'),current=hash(source);
 const older=[boundary.previousSHA256,JSON.parse(read('tests/automatic-source-boundaries.json')).files[path]?.previousSHA256,JSON.parse(read('tests/embedded-provenance-source-boundaries.json')).files[path]?.previousSHA256];
 if(older.includes(current))return source;
 if(current!==boundary.currentSHA256)throw Error('Unreviewed Stage 6 UX source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('UX restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('UX restoration hash differs: '+path);
 return source;
}

// Reverse the final reviewed presentation refinement before older exact layers.
export function finalUXSource(path){
 let source=messagingSource(path);const boundary=JSON.parse(read('tests/final-ux-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex'),current=hash(source);
 const older=[boundary.previousSHA256,...['ux','automatic','embedded-provenance'].flatMap(name=>{const b=JSON.parse(read('tests/'+name+'-source-boundaries.json')).files[path];return b?[b.previousSHA256,b.currentSHA256]:[];})];
 if(older.includes(current))return source;
 if(current!==boundary.currentSHA256)throw Error('Unreviewed final Stage 6 source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Final UX restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Final UX restoration hash differs: '+path);
 return source;
}

// Exact local messaging edits only. Original assertions and pins stay intact.
export function messagingSource(path){
 let source=acceptanceSource(path);const boundary=JSON.parse(read('tests/messaging-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)!==boundary.currentSHA256)return source; // Earlier layers validate their own historical bytes.
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Messaging restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Messaging restoration hash differs: '+path);
 return source;
}

// Preserve the exact pre-acceptance interfaces for their unchanged assertions.
export function acceptanceSource(path){
 let source=followupSource(path);const boundary=JSON.parse(read('tests/acceptance-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)!==boundary.currentSHA256)return source;
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Acceptance restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Acceptance restoration hash differs: '+path);
 return source;
}

// Restore only this focused follow-up before previous immutable source pins.
export function followupSource(path){
 let source=prominenceSource(path);const boundary=JSON.parse(read('tests/followup-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed follow-up source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Follow-up restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Follow-up restoration hash differs: '+path);
 return source;
}

// Exact reviewed shared warning hierarchy/spacing only, before older pins.
export function prominenceSource(path){
 let source=stressSource(path);const boundary=JSON.parse(read('tests/prominence-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed prominence source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Prominence restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Prominence restoration hash differs: '+path);
 return source;
}

// Current stress corrections, including the explicitly versioned structural
// policy transition. Older assertions retain their exact original runtime.
export function stressSource(path){
 let source=httpStructureSource(path);const boundary=JSON.parse(read('tests/stress-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed stress source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Stress restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Stress restoration hash differs: '+path);
 return source;
}

// Restore only the reviewed HTTP hierarchy and structural wording refinement.
// Previous assertion files and whole-file source pins stay unchanged.
export function httpStructureSource(path){
 let source=finalCopySource(path);const boundary=JSON.parse(read('tests/http-structure-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed HTTP/structure source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('HTTP/structure restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('HTTP/structure restoration hash differs: '+path);
 return source;
}

// Final Stage 6 copy changes restore exactly before earlier source pins.
export function finalCopySource(path){
 let source=read(path);const boundary=JSON.parse(read('tests/final-copy-source-boundaries.json')).files[path];if(!boundary)return source;
 const hash=value=>createHash('sha256').update(value).digest('hex');
 if(hash(source)===boundary.previousSHA256)return source;
 if(hash(source)!==boundary.currentSHA256)throw Error('Unreviewed final-copy source change: '+path);
 for(const pair of [...boundary.replacements].reverse()){
  if(source.split(pair.current).length!==2)throw Error('Final-copy restoration boundary changed: '+path);
  source=source.replace(pair.current,pair.previous);
 }
 if(hash(source)!==boundary.previousSHA256)throw Error('Final-copy restoration hash differs: '+path);
 return source;
}
