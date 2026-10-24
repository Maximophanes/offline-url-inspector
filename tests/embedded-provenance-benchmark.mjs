import {read,suite,stage3Source} from './harness.mjs';
import {createHash} from 'node:crypto';
const t=suite('Stage 4 repeated-parent reuse and bounded work measurement','embedded-provenance-benchmark-results.json'),{test,assert,equal}=t;
const data=read('data/unicode-data.json'),{I,E}=new Function('document',read('src/core.js')+'\n'+read('src/embedded.js')+'\nreturn {I:Inspector,E:EmbeddedURLs};')({getElementById:()=>({textContent:data})}),old=stage3Source('src/embedded.js');
const enc=encodeURIComponent,inner='https://inner.test',middle='https://middle.test/?next='+enc(inner),measurements=[];
for(const parents of [1,2,4,8])await test(parents+' identical parents reuse native parse/component work',()=>{
 const input='https://outer.test/?'+Array.from({length:parents},(_,i)=>'p'+i+'='+enc(middle)).join('&'),top=I.inspect(input),entry={parents,inputCodeUnits:input.length};
 for(const [label,source]of [['before',old],['after',read('src/embedded.js')]]){
  let prepares=0;const instrumented={...I,prepare(value){prepares++;return I.prepare(value);}},analyzer=new Function('Inspector',source+'\nreturn EmbeddedURLs;')(instrumented),r=analyzer.analyze(top,{clock:()=>0});
  entry[label]={preparations:prepares,status:r.status,entries:r.candidates.length,sourceOccurrences:r.stats.occurrences??null,hostnames:r.stats.hostnames,comparisons:r.stats.comparisons,nodes:r.stats.nodes,text:r.stats.text,urlParses:r.stats.urlParses??null,cacheHits:r.stats.parseCacheHits??null};
 }
 equal(entry.after.preparations,3);equal(entry.after.urlParses,2);equal(entry.after.cacheHits,2*parents-2);equal(entry.after.entries,2*parents);equal(entry.after.hostnames,2);equal(entry.after.comparisons,2);equal(entry.before.entries,parents+1);equal(entry.before.preparations,parents+2);
 const durations=[],statuses={};
 for(let i=0;i<50;i++){const begin=performance.now(),r=E.analyze(top);durations.push(performance.now()-begin);statuses[r.status]=(statuses[r.status]||0)+1;}
 durations.sort((a,b)=>a-b);entry.productionTimer={samples:50,medianMs:durations[24],p95Ms:durations[47],maxMs:durations[49],statuses};measurements.push(entry);
});
await test('adversarial recurrence cannot multiply occurrence work beyond caps',()=>{let value=inner;for(let i=0;i<3;i++)value='https://level'+i+'.test/?'+Array.from({length:5},(_,j)=>'v'+j+'='+enc(value)).join('&');const top=I.inspect('https://outer.test/?a='+enc(value));const r=E.analyze(top,{clock:()=>0});assert(r.stats.nodes<=128);assert(r.stats.text<=131072);assert(r.candidates.length<=32);assert(r.stats.relationships<=32);assert(r.stats.expansions<=64);equal(r.status,'partial');});
t.finish({sourceSHA256:createHash('sha256').update(read('src/embedded.js')).digest('hex'),measurements,scope:'Local Deno parsing-work counters and 50 synchronous samples per repeated-parent scenario. Before code is exact hash-verified Stage 3 source. Corrected output contains more child evidence; timings are not a like-for-like speedup claim, native Firefox or VoiceOver evidence.'});
