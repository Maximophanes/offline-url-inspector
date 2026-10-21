// Synthetic in-process benchmark; heap deltas include GC and are not heap caps.
import {read,html,root} from './harness.mjs';
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const data=html().match(/id="unicode-data">([\s\S]*?)<\/script>/)[1];
const {Inspector:I,EmbeddedURLs:E}=new Function('document',read('src/core.js')+'\n'+read('src/embedded.js')+'\nreturn {Inspector,EmbeddedURLs};')({getElementById:()=>({textContent:data})});
const enc=encodeURIComponent,base='https://example.test',refs=Array.from({length:100},(_,i)=>'reference'+i+'.test');
const scenarios=[
 ['ordinary',base+'/?utm_source=news#section',[]],
 ['encoded-query-and-fragment',base+'/?next='+enc('https://other.test/a')+'#next='+enc('https://fragment.test'),[]],
 ['nested',base+'/?next='+enc('https://middle.test/?next='+enc('https://final.test')),[]],
 ['two-layers',base+'/?next='+enc(enc('https://other.test')),[]],
 ['malformed',base+'/?next=https%3A%2F%2Fother.test%FF',[]],
 ['large-value',base+'/?next=https://other.test/'+ 'a'.repeat(24000),[]],
 ['many-parameters',base+'/?'+Array.from({length:2000},(_,i)=>'x'+i+'=a').join('&')+'#next='+enc('https://fragment.test'),[]],
 ['candidate-saturation',base+'/?'+Array.from({length:50},(_,i)=>'x'+i+'=https://h'+i+'.test').join('&'),[]],
 ['comparison-saturation',base+'/?'+Array.from({length:16},(_,i)=>'x'+i+'=https://h'+i+'.test').join('&'),refs],
 ['unicode-and-invisibles',base+'/?next='+enc('https://аmazon.test/a\u202e')+'#next='+enc('https://vveb.test'),['amazon.test','web.test']],
 ['maximum-accepted-input',base+'/?x='+ 'a'.repeat(I.MAX_INPUT-base.length-4),[]]
];
const report={applicationVersion:'3.2.0',runtime:Deno.version,scope:'Native Deno/V8 synchronous analyzer with its production timer; synthetic reserved domains. Excludes DOM rendering. Memory observations include uncollected allocations and runtime overhead.',limits:E.LIMITS,iterations:50,scenarios:[]};
for(const [name,url,references]of scenarios){
 const top=I.inspect(url);if(!top.ok)throw Error('Benchmark fixture is not accepted: '+name);
 for(let i=0;i<5;i++)E.analyze(top,{references});
 const before=Deno.memoryUsage(),durations=[],statuses={},codes=new Set();let maxText=0,maxNodes=0;
 for(let i=0;i<report.iterations;i++){
  const start=performance.now(),result=E.analyze(top,{references});durations.push(performance.now()-start);statuses[result.status]=(statuses[result.status]||0)+1;
  for(const l of result.limitations)codes.add(l.code);maxText=Math.max(maxText,result.stats.text);maxNodes=Math.max(maxNodes,result.stats.nodes);
 }
 const after=Deno.memoryUsage();durations.sort((a,b)=>a-b);const round=n=>Math.round(n*1000)/1000;
 report.scenarios.push({name,inputCodeUnits:url.length,p50Milliseconds:round(durations[24]),p95Milliseconds:round(durations[47]),maxMilliseconds:round(durations[49]),statuses,limitationCodes:[...codes],maxDerivedCodeUnits:maxText,maxNodes,heapUsedDeltaBytes:after.heapUsed-before.heapUsed,rssDeltaBytes:after.rss-before.rss});
}
writeFileSync(resolve(root,'tests/embedded-benchmark.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
