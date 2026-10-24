// Stage 6 preimplementation review of the existing Stage 5 contract.
import {suite} from './harness.mjs';
import {modules,assets} from './comparison-support.mjs';
const t=suite('Stage 6 source-to-presentation contract review','automatic-contract-results.json'),{test,assert,equal}=t;
const {I,U}=modules(),coordinator=await U.prepare(assets(),{clock:()=>0}),enc=encodeURIComponent;
for(const [host,ref,kind]of [['аmazon.com','amazon.com','unicode-visual'],['paypa1.com','paypal.com','ascii-visual'],['google.com.tenant.github.io','google.com','structural'],['gooogle.com','google.com','spelling']])await test(host+' supplies real supported evidence and source',()=>{
 const r=coordinator.evaluate(I.inspect('https://'+host)),row=r.relationships.find(x=>x.reference===ref&&x.class===kind),a=r.analyses[0];
 assert(row);equal(row.hostname,I.inspect('https://'+host).ascii.replace(/\.$/,''));assert(row.supports.some(p=>p.source.kind==='builtin-majestic'&&p.source.reference.source==='Majestic Million'));assert(a.automatic.findings.some(f=>f.reference.domain===ref&&f.evidence.some(e=>e.class===kind)));assert(a.automatic.boundary.publicSuffix);equal(r.sources[0].role,'original');
});
await test('neutral membership and no-manual operation remain separate',()=>{const r=coordinator.evaluate(I.inspect('https://google.com'));equal(r.analyses[0].automatic.exact.classification,'neutral-membership');equal(r.manual.expected.status,'not-provided');equal(r.manual.references.checked,0);});
await test('real embedded evidence retains two respective parent sites and decoding paths',()=>{
 const inner='https://arnazon.com',middle='https://google.com/?next='+enc(inner),r=coordinator.evaluate(I.inspect('https://example.net/?a='+enc(middle)+'&b='+enc(middle),'example.net'));
 equal(r.embedded.stats.occurrences,4);equal(r.embedded.stats.uniqueAddresses,2);equal(r.manual.expected.comparison.kind,'exact');const row=r.relationships.find(x=>x.reference==='amazon.com'&&x.class==='ascii-visual');equal(row.sourceIds,[4,5]);equal(row.sourceIds.map(id=>r.sources[id-1].parentOccurrence),[1,2]);for(const id of row.sourceIds){const s=r.sources[id-1];equal(s.parameter.original,'next');assert(s.sourcePosition);equal(s.provenance[0].steps.map(x=>x.layer),[1,2]);}equal(r.stats.automaticCalls,3);
});
await test('occurrence saturation qualifies discovery without erasing known positives',()=>{const r=coordinator.evaluate(I.inspect('https://example.net/?'+Array.from({length:20},(_,n)=>'x'+n+'='+enc('https://google.com')).join('&')+'&last='+enc('https://arnazon.com')));equal(r.coverage.automatic,'partial');equal(r.coverage.embedded.occurrences,'partial');assert(r.coverage.limitations.some(x=>x.code==='occurrences-per-value'));assert(r.relationships.some(x=>x.reference==='amazon.com'&&x.class==='ascii-visual'));});
t.finish({conclusion:'No substantial source-to-UI integration defect found in representative independent fixtures. Matching policy, native parsing, provenance and coverage supply the required presentation inputs.',scope:'Source contract review using current production index and synthetic URLs; no UI/native-browser claim.'});
