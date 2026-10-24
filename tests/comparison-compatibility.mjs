// Diagnose actual runtime compatibility without bypassing or editing generation
// guards, changing pins, pretending this is Deno 2.9.7, or writing data assets.
import {suite,read} from './harness.mjs';
import {loadModules,parseSubset,normalizeRecords,canonical,sha} from '../tools/reference_data_lib.mjs';
import {generateIndex} from '../tools/lookalike_data_lib.mjs';
const t=suite('Stage 5 actual-runtime asset compatibility diagnostics','comparison-compatibility-results.json'),{test,equal,assert}=t;
const sameJSON=(a,b)=>equal(sha(canonical(a)),sha(canonical(b)));
const {Inspector:I,DomainBoundaries:B}=loadModules(),manifest=JSON.parse(read('data/reference-foundation.json')),compiled=JSON.parse(read('data/public-suffix/compiled.json'));
const rules=B.compile(read('data/public-suffix/public_suffix_list.dat'),I),psl=B.create(I,{...compiled,rules},{sourceSHA256:manifest.psl.sha256,unicodeDataSHA256:manifest.unicode.sha256});
await test('complete current-runtime PSL compilation matches pinned rules',()=>{equal(canonical({...compiled,rules}),read('data/public-suffix/compiled.json'));equal(psl.status,'ready');});
const rows=parseSubset(read('data/popular-domains/source.csv'),JSON.parse(read('data/popular-domains/source.json'))),tiers={};
for(const max of [1000,5000,10000])await test('actual-runtime normalization preserves exact tier '+max,()=>{tiers[max]=normalizeRecords(rows,psl,max);sameJSON(tiers[max].stats,manifest.tiers[max]);});
await test('every runtime reference tuple agrees with the approved 9570 tuples',()=>{const tuples=tiers[10000].records.map(r=>[r.asciiDomain,r.globalRank,r.sourceRowCount,r.publicSuffixASCII,r.section==='ICANN'?'I':'P']);equal(tuples,JSON.parse(read('data/popular-domains/records.json')).records);});
await test('all 10000 source-row provenance and exclusions agree exactly',()=>{const r=tiers[10000],p=JSON.parse(read('data/popular-domains/provenance.json'));sameJSON(r.records.map(x=>({id:x.id,asciiDomain:x.asciiDomain,unicodeDomain:x.unicodeDomain,globalRank:x.globalRank,sourceRows:x.sourceRows})),p.records);sameJSON(r.excluded,p.excluded);});
const generated=await generateIndex(),oldManifest=JSON.parse(read('data/lookalikes/manifest.json'));
await test('fresh current-runtime index bytes remain exactly approved',()=>equal(generated.outputs['data/lookalikes/index.json'],read('data/lookalikes/index.json')));
await test('all generated index manifest fields except the explicitly reported runtime identity agree',()=>{const {runtime:actual,...actualGenerator}=generated.manifest.generator,{runtime:reviewed,...reviewedGenerator}=oldManifest.generator;sameJSON({...generated.manifest,generator:actualGenerator},{...oldManifest,generator:reviewedGenerator});sameJSON(actual,Deno.version);sameJSON(reviewed,{deno:'2.9.7',typescript:'6.0.3',v8:'15.0.245.2-rusty'});equal(generated.outputs['data/lookalikes/manifest.json']!==read('data/lookalikes/manifest.json'),canonical(actual)!==canonical(reviewed));});
t.finish({actualRuntime:Deno.version,reviewedRuntime:oldManifest.generator.runtime,indexSHA256:sha(generated.outputs['data/lookalikes/index.json']),scope:'Separate compatibility evidence only. Standard foundation/index generation checks still reject the changed runtime identity. No pinned manifest/asset/generator or expectations were updated; no reviewed-runtime or complete original-suite pass is claimed.'});
