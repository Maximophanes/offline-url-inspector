// Local Deno/V8 feasibility only. Endpoint heap samples are not peak scratch use.
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {root,read,json,sha} from '../tools/lookalike_data_lib.mjs';
import {loadModules} from '../tools/reference_data_lib.mjs';
import {collisionEngine} from './lookalike-fixtures.mjs';
const {Inspector:I,DomainBoundaries:B}=loadModules();
const {ReferenceData,L}=new Function('DomainBoundaries',read('src/reference-data.js')+'\n'+read('src/lookalikes.js')+'\nreturn {ReferenceData,L:AutomaticLookalikes};')(B);
const gc=typeof globalThis.gc==='function'?globalThis.gc:null,collect=()=>{gc?.();gc?.();},heap=()=>Deno.memoryUsage().heapUsed;
collect();const beforeFoundation=heap(),foundationManifestText=read('data/reference-foundation.json').toString();
let start=performance.now();const foundation=await ReferenceData.load(I,{manifest:JSON.parse(foundationManifestText),pslText:read('data/public-suffix/compiled.json').toString(),popularText:read('data/popular-domains/records.json').toString()});
const foundationMs=performance.now()-start;collect();const afterFoundation=heap();
const manifest=json('data/lookalikes/manifest.json'),indexText=read('data/lookalikes/index.json').toString(),options={manifest,indexText,foundationManifestText};
start=performance.now();const engine=await L.prepare(I,foundation,options),firstPrepareMs=performance.now()-start;
if(engine.status!=='ready')throw Error('Unavailable engine '+engine.reason);
collect();const afterEngine=heap();
const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.ceil(values.length*p)-1],summarize=values=>({samples:values.length,medianMs:percentile(values,.5),p95Ms:percentile(values,.95),maxMs:Math.max(...values)});
const initialization=[];
for(let i=0;i<10;i++){start=performance.now();const candidate=await L.prepare(I,foundation,options);if(candidate.status!=='ready')throw Error('Initialization failed');initialization.push(performance.now()-start);}
const ordinary=['google.com','www.google.com','example.com','example.co.uk','amazon.net','bp.blogspot.com','simple-unique-example.com','arnazon.com','аmazon.com','gooogle.com'];
const adversarial=[Array.from({length:4},(_,i)=>'q'.repeat([63,63,63,57][i])).join('.')+'.com','google.com.'.repeat(20)+'example.net','abcdefghijklmnopqrstuvwxyz'.repeat(2)+'abcdefghijk.com','א.com','a'.repeat(64)+'.com','a'.repeat(2049)];
function measure(service,hosts,iterations){
 const elapsed=[],statuses={},work={maxCandidateIds:0,maxVerifiedPairs:0,maxSpellingStates:0},sizes=[];
 for(let i=0;i<iterations;i++){
  const host=hosts[i%hosts.length],begin=performance.now(),r=service.compare(host);elapsed.push(performance.now()-begin);statuses[r.status]=(statuses[r.status]||0)+1;
  if(r.work){work.maxCandidateIds=Math.max(work.maxCandidateIds,r.work.candidateIds);work.maxVerifiedPairs=Math.max(work.maxVerifiedPairs,r.work.verifiedPairs);work.maxSpellingStates=Math.max(work.maxSpellingStates,r.work.spellingStates);}
  sizes.push(new TextEncoder().encode(JSON.stringify(r)).length);
 }
 return {...summarize(elapsed),statuses,work,maxSerializedEvidenceBytes:Math.max(...sizes)};
}
const ordinaryTiming=measure(engine,ordinary,2000),adversarialTiming=measure(engine,adversarial,600);
const collision=await collisionEngine({I,L,foundation,foundationManifestText,manifest},{clock:()=>performance.now()}),collisionTiming=measure(collision,['ammmmmm.com','аmmmmmm.com'],100);
const endpointDeltas=[];
if(gc)for(const [service,hosts]of [[engine,adversarial],[collision,['ammmmmm.com','аmmmmmm.com']]])for(const host of hosts){collect();const before=heap();service.compare(host);endpointDeltas.push({engine:service===engine?'production':'artificial-collision',hostname:host.length>253?'oversized-input':host,bytes:Math.max(0,heap()-before)});}
const report={suite:'Stage 3 automatic engine local feasibility',runtime:Deno.version,indexSHA256:manifest.index.sha256,engineSourceSHA256:sha(read('src/lookalikes.js')),foundationLoadMs:foundationMs,firstPrepareMs,indexPreparation:summarize(initialization),ordinary:ordinaryTiming,adversarial:adversarialTiming,artificial64WayCollision:collisionTiming,memory:{explicitGC:!!gc,beforeFoundationHeapUsed:beforeFoundation,afterFoundationHeapUsed:afterFoundation,afterIndexHeapUsed:afterEngine,additionalFoundationAndIndexBytes:gc?afterEngine-beforeFoundation:null,additionalIndexBytes:gc?afterEngine-afterFoundation:null,maxObservedEndpointHeapGrowthBytes:endpointDeltas.length?Math.max(...endpointDeltas.map(v=>v.bytes)):null,endpointHeapGrowthSamples:endpointDeltas,retainedTargetBytes:15728640,scratchTargetBytes:2097152,limitations:'GC endpoint heap deltas include runtime bookkeeping and retained input strings; they are local Deno samples, not precise browser retained heap or peak scratch-memory bounds.'},sizes:{serializedIndex:read('data/lookalikes/index.json').length,indexManifest:read('data/lookalikes/manifest.json').length,engineSource:read('src/lookalikes.js').length,foundationRuntimeData:494826},scope:'Local Deno timings with real cooperative clock; 2000 ordinary, 600 adversarial, 100 artificial collision calls. Init uses 10 same-process repetitions. Not Firefox p95, cold-page behavior, hard real-time guarantees or phishing accuracy. Artificial references are test-only; production retains all 9570 approved references.'};
writeFileSync(resolve(root,'tests/lookalike-benchmark-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
if(gc&&report.memory.additionalFoundationAndIndexBytes>15728640)Deno.exit(1);
