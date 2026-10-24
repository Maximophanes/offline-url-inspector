import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {read,root} from './harness.mjs';
import {modules,assets} from './comparison-support.mjs';
const {I,U}=modules(),input=assets(),initialization=[],enc=encodeURIComponent;
for(let n=0;n<5;n++){const start=performance.now();const ready=await U.prepare(input);if(ready.data.status!=='ready')throw Error('Initialization unavailable');initialization.push(performance.now()-start);}
const coordinator=await U.prepare(input),measurements=[];
const timing=samples=>{const sorted=[...samples].sort((a,b)=>a-b);return {samples:samples.length,medianMs:sorted[Math.floor(sorted.length/2)],p95Ms:sorted[Math.ceil(sorted.length*.95)-1],maxMs:sorted.at(-1)};};
for(const parents of [1,2,4,8]){
 const middle='https://google.com/?next='+enc('https://arnazon.com'),url='https://example.net/?'+Array.from({length:parents},(_,n)=>'p'+n+'='+enc(middle)).join('&'),top=I.inspect(url),samples=[],statuses={};let result;
 for(let n=0;n<100;n++){const start=performance.now();result=coordinator.evaluate(top);samples.push(performance.now()-start);statuses[result.status]=(statuses[result.status]||0)+1;}
 if(result.stats.automaticCalls!==3||result.stats.cacheHits!==parents*2-2||result.embedded.stats.occurrences!==parents*2)throw Error('Incorrect matching reuse');
 measurements.push({parents,occurrences:result.embedded.stats.occurrences,automaticCalls:result.stats.automaticCalls,cacheHits:result.stats.cacheHits,work:result.work,statuses,timing:timing(samples)});
}
const report={suite:'Stage 5 full coordination local feasibility',runtime:Deno.version,sourceSHA256:createHash('sha256').update(read('src/comparisons.js')).digest('hex'),initialization:timing(initialization),measurements,scope:'Actual-clock local Deno initialization and full synchronous extraction/reconciliation/matching, 100 samples per case. Counters verify reuse; not a native-browser, peak-memory, hard-deadline or speedup claim.'};
writeFileSync(root+'/tests/comparison-benchmark-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
