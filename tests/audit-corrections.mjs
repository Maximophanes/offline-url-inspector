// Focused authorized corrections: extraction/notice regressions and preprocessing equivalence.
import {read,html,suite,MemoryStorage,auditBaselineSource} from './harness.mjs';
import {mount} from './dom-support.mjs';
const t=suite('V3.2.0 approved audit corrections','audit-corrections-results.json'),{test,assert,equal}=t;
const document={getElementById:()=>({textContent:html().match(/id="unicode-data">([\s\S]*?)<\/script>/)[1]})};
const {I,E}=new Function('document',read('src/core.js')+'\n'+read('src/embedded.js')+'\nreturn {I:Inspector,E:EmbeddedURLs};')(document);
const baseline=new Function('document',auditBaselineSource('src/core.js')+'\nreturn Inspector;')(document);
const enc=encodeURIComponent,outer='https://example.test/';
const fixtures=[
 ['A',outer+'#https%3A%2F%2Fother.test/path?x=1','other.test',1],
 ['B',outer+'#https%3A%2F%2Fexample.test%40attacker.test/login?x=1','attacker.test',1],
 ['C',outer+'?next=%2Flogin%3Fnext%253Dhttps%253A%252F%252Fother.test','other.test',2],
 ['literal ampersand',outer+'#https%3A%2F%2Fother.test/path?x&y','other.test',1],
 ['two layers with literal separator',outer+'#https%253A%252F%252Fother.test/path?x=1','other.test',2],
 ['encoded scheme letters',outer+'#%68%74%74%70%73%3A%2F%2Fother.test/?x=1','other.test',1],
 ['encoded fragment delimiter',outer+'#https%3A%2F%2Fother.test/a%23part?x=1','other.test',1],
 ['relative fragment route',outer+'#/login?next=https%3A%2F%2Fother.test','other.test',1],
 ['nested absolute',outer+'?next='+enc('https://middle.test/?next='+enc('https://other.test')),'other.test',2],
 ['encoded relative separators',outer+'?next='+enc('/login%3Fnext%3Dhttps%3A%2F%2Fother.test'),'other.test',2]
];
const storage=new MemoryStorage(),app=mount({storage}),$=selector=>app.$(selector.replace(/^#/,''));
t.group('recovered evidence and visible notices');
for(const [name,url,hostname,layers]of fixtures)await test(name,()=>{
 const top=I.inspect(url,'example.test'),before=JSON.stringify(top),r=E.analyze(top,{clock:()=>0});
 equal(r.status,'complete');const candidate=r.candidates.find(c=>c.hostname===hostname);assert(candidate,'Missing '+hostname);equal(candidate.layers,layers);equal(JSON.stringify(top),before);equal(top.comparison.kind,'exact');
 if(url.includes('#')){equal(top.query,'');equal(candidate.component,'fragment');}else equal(candidate.component,'query');
 app.inspect(url,'example.test');assert(!$('#embeddedNotice').classList.contains('hidden'));assert($('#embeddedSummary').textContent.includes(hostname));equal($('#primaryTitle').textContent,'Exact hostname match');
 if(name==='B'){assert(candidate.hasUserinfo);assert(candidate.warnings.includes('userinfo'));assert($('#embeddedSummary').textContent.includes('The text before @ is not the website’s hostname.'));}
});
t.group('boundaries and honest coverage');
await test('decoded delimiters do not rewrite submitted fragment parameters',()=>{
 const r=E.analyze(I.inspect(outer+'#https%3A%2F%2Fother.test/a?x=1%26y%3D2'),{clock:()=>0});
 assert(r.candidates.some(c=>c.hostname==='other.test'));assert(!r.parameters.some(p=>!p.parent&&p.parameter.original==='y'));assert(r.candidates.filter(c=>c.type==='absolute').every(c=>c.component==='fragment'));
});
await test('literal whole fragments do not spend a duplicate interpretation budget',()=>{
 const legacy=new Function('Inspector',auditBaselineSource('src/embedded.js')+'\nreturn EmbeddedURLs;')(I),top=I.inspect(outer+'#https://other.test/%61?x=1');
 equal(E.analyze(top,{clock:()=>0}).stats.nodes,legacy.analyze(top,{clock:()=>0}).stats.nodes);
});
await test('repeated fragment-route values keep competing hostnames',()=>{
 const r=E.analyze(I.inspect(outer+'#/login?next=https%3A%2F%2Fone.test&next=https%3A%2F%2Ftwo.test'),{clock:()=>0});
 equal(r.candidates.filter(c=>c.type==='absolute').map(c=>[c.hostname,c.occurrence,c.conflicting]),[['one.test',1,true],['two.test',2,true]]);
});
for(const payload of ['https%3A%2F%2Fother.test/%zz?x=1','https%3A%2F%2Fother.test/%FF?x=1','https%3A%2F%2Fother.test/%C0%AF?x=1'])await test('strict fragment decoding failure '+payload,()=>{
 const r=E.analyze(I.inspect(outer+'#'+payload),{clock:()=>0});equal(r.status,'partial');assert(r.limitations.some(l=>l.code==='decoding'));assert(!r.candidates.some(c=>c.type==='absolute'));app.inspect(outer+'#'+payload,'example.test');assert(!$('#embeddedNotice').classList.contains('hidden'));assert($('#embeddedNotice').textContent.includes('incomplete'));
});
await test('a third fragment decoding layer is visible as a limitation',()=>{
 const r=E.analyze(I.inspect(outer+'#https%25253A%25252F%25252Fother.test/path?x=1'),{clock:()=>0});equal(r.status,'partial');assert(r.limitations.some(l=>l.code==='percent-depth'));assert(!r.candidates.some(c=>c.type==='absolute'));
});
await test('an oversized whole interpretation cannot become a truncated URL',()=>{
 const r=E.analyze(I.inspect(outer+'#https%3A%2F%2Fother.test/?x='+'a'.repeat(9000)),{clock:()=>0});equal(r.status,'partial');assert(r.limitations.some(l=>l.code==='value-size'));assert(!r.candidates.some(c=>c.type==='absolute'));
});
for(const suffix of ['#q=hello%20world','#%6eame=value','#/login?q=ordinary%20text'])await test('ordinary encoded fragment data stays quiet '+suffix,()=>{const r=E.analyze(I.inspect(outer+suffix),{clock:()=>0});equal(r.status,'complete');assert(!r.candidates.some(c=>c.type==='absolute'));app.inspect(outer+suffix);assert($('#embeddedNotice').classList.contains('hidden'));});
await test('opaque fragment retains unsupported rather than negative coverage',()=>{const r=E.analyze(I.inspect(outer+'#qs=r-ABC123opaque'),{clock:()=>0});equal(r.status,'unsupported');assert(r.limitations.some(l=>l.code==='opaque'));});
await test('candidate saturation stays partial with the new fragment interpretation',()=>{const r=E.analyze(I.inspect(outer+'?'+Array.from({length:50},(_,i)=>'x'+i+'=https://h'+i+'.test').join('&')+'#https%3A%2F%2Ffragment.test/?x=1'),{clock:()=>0});equal(r.status,'partial');assert(r.candidates.length<=32);assert(r.stats.text<=131072);assert(r.candidates.some(c=>c.hostname==='fragment.test'));});
t.group('concealment and unchanged data boundaries');
await test('corrected whole-fragment values stay concealed and clear on close/reinspection',async()=>{
 app.inspect(outer+'#https%3A%2F%2FPRIVATE_USER:PRIVATE_SECRET%40attacker.test/login?token=PRIVATE_TOKEN','example.test');
 for(const id of ['primary','embeddedCandidates'])assert(!$('#'+id).textContent.includes('PRIVATE_'));
 $('#embeddedView').click();await new Promise(r=>setTimeout(r,0));const reveal=$('#embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await new Promise(r=>setTimeout(r,0));assert(reveal.textContent.includes('PRIVATE_TOKEN'));
 $('#embeddedDetails').open=false;await new Promise(r=>setTimeout(r,0));assert(!reveal.open);assert(!reveal.textContent.includes('PRIVATE_'));
 app.inspect(outer+'#ordinary');assert(!$('#embeddedCandidates').textContent.includes('PRIVATE_'));assert($('#embeddedNotice').classList.contains('hidden'));
 equal(app.network,[]);assert(!storage.writes.map(x=>x[1]).join('').includes('PRIVATE_'));assert(!app.w.testReferences.exportJSON().includes('PRIVATE_'));equal(app.w.document.querySelectorAll('[href],[src],[action]').length,0);
});
t.group('preprocessing equivalence and initialization budget');
await test('linear host/port recognition preserves legacy preparation across adjacent syntax',()=>{
 const hosts=['localhost','LOCALHOST','localhost.','example.test','a','.a','a.','..','...','.a.','a..','..a','a.b.c','例.test','a\\b.test','user@example.test','https','http','[::1]'];
 const suffixes=['',':',':0',':80/',':8080?x',':443#x',':80x',':abc',':1:2','/path','?q=1','#part'];
 const outcome=(engine,text)=>{try{return {value:engine.prepare(text)};}catch(e){return {error:e.message};}};
 for(const host of hosts)for(const suffix of suffixes)for(const prefix of ['',' \t','https://'])equal(outcome(I,prefix+host+suffix),outcome(baseline,prefix+host+suffix));
});
await test('supplemental extraction prepares the top-level text once and reuses candidate preparation',()=>{
 let calls=0;const instrumented={...I,prepare(raw){calls++;return I.prepare(raw);}},analyzer=new Function('Inspector',read('src/embedded.js')+'\nreturn EmbeddedURLs;')(instrumented);
 const r=analyzer.analyze(I.inspect(outer+'?next=https://other.test/path'),{clock:()=>0});assert(r.candidates.some(c=>c.hostname==='other.test'));equal(calls,2);
});
await test('initialization time is checked before queue expansion',()=>{let tick=0;const r=E.analyze(I.inspect(outer+'?next=https://other.test'),{clock:()=>tick++*101});equal(r.status,'partial');assert(r.limitations.some(l=>l.code==='time'));equal(r.stats.nodes,0);});
await app.close();
t.finish({scope:'Synthetic reserved-domain model and guarded Happy DOM regressions. No native Firefox, live redirect, or browser timing verification.'});
