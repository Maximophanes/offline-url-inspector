// Focused Technical Details presentation; actual spacing is measured in browser separately.
import {read,modules,suite,functionalSource} from './harness.mjs';
import {mount} from './dom-support.mjs';
import {createHash} from 'node:crypto';
const t=suite('V3.1.2 focused Technical Details presentation','technical-results.json'),{test,assert,equal}=t;
const {Inspector:I,ReferenceDomains:R,Presentation:P}=modules(),a=mount(),{$,w,inspect}=a;
const hash=s=>createHash('sha256').update(s).digest('hex'),baseline=JSON.parse(read('tests/technical-baseline.json'));
await test('source pins survive only the approved unused base-CSS removal',()=>{for(const [file,expected]of Object.entries(baseline.sourceFiles))equal(hash(file==='src/base.css'?functionalSource(file):read(file)),expected);});
await test('139 complete original inspections and reference comparison metadata match the checkpoint',()=>{
 const fixtures=[...JSON.parse(read('tests/cases.json')),...JSON.parse(read('tests/ascii-cases.json'))];
 const rows=fixtures.map(c=>{const result=I.inspect(c.url,c.expected||'');return {name:c.name,result,references:R.compare(result,['amazon.com','example.com','ae.invalid'])};});
 equal(rows.length,baseline.fixtures);equal(hash(JSON.stringify(rows)),baseline.completeResultsAndReferenceComparisonsSHA256);
});
for(const [url,target,title]of [['https://аmazon.com','amazon.com','Unicode visual comparison'],['https://vveb.com','web.com','ASCII visual comparison'],['https://amazoon.com','amazon.com','Spelling comparison'],['https://example.com','example.com','Hostname identity comparison']])await test('comparison context and complete internal metadata: '+title,()=>{
 const r=inspect(url,target),record=$('referenceCandidates').querySelector('.comparison-evidence'),data=w.testComparisonRecord(record);
 assert(!record.textContent.includes('Technical comparison data'));equal(record.querySelectorAll('details').length,1);equal(record.querySelector('summary').textContent,title);
 assert(record.textContent.includes('Your expected hostname (manual; primary)'));assert(record.textContent.includes(r.expected.ascii));assert(record.textContent.includes(P.comparisonResult(data.kind,r.comparison)));
 equal(data.comparison,r.comparison);equal(data.hostname,r.expected.ascii);assert(data.comparison===w.testLastResult().comparison);
 if(r.comparison.visual)assert(record.textContent.includes(title.startsWith('Unicode')?'U+0430':'“vv” may resemble “w”'));
 equal($('rawRecords').children.length,r.messages.length);[...$('rawRecords').children].forEach((x,i)=>equal(x.querySelector('.diagnostic-text').textContent,r.messages[i].text));
});
await test('saved comparisons retain all metadata internally without adding it to raw diagnostics',()=>{
 w.reviewImportText(JSON.stringify({application:R.APPLICATION,schemaVersion:1,references:['amazon.com','example.com']}));$('applyImport').click();
 const r=inspect('https://аmazon.com'),expected=R.compare(r,w.testReferences.snapshot().references);
 const record=[...$('referenceCandidates').querySelectorAll('.comparison-evidence')].find(x=>w.testComparisonRecord(x).hostname==='amazon.com'),data=w.testComparisonRecord(record);
 assert(data.source.startsWith('Saved reference domain'));equal(data.comparison,expected.visual.find(x=>x.hostname==='amazon.com').comparison);assert(data.comparison.mechanism);assert(Array.isArray(data.comparison.types));
 equal($('rawRecords').children.length,r.messages.length);assert(!$('referenceCandidates').textContent.includes('Technical comparison data'));
});
await test('unavailable visual checks retain both contextual and explicit saved-reference warnings',()=>{
 const r=inspect('https://مثال.invalid','example.invalid');assert(r.comparison.unavailable);const record=$('referenceCandidates').querySelector('.comparison-evidence');assert(record.textContent.includes('Visual comparison is unavailable.'));assert(record.textContent.includes('Visual comparison unavailable'));assert(record.textContent.includes('could not complete the visual check'));
 assert($('referenceCandidates').querySelector('.comparison-unavailable').textContent.includes('visual resemblance may still exist'));equal(w.testComparisonRecord(record).comparison,r.comparison);
});
await test('ordinary reliable extraction hides raw JSON while keeping every input representation',()=>{
 for(const url of ['https://arnazon.com/path','https://%61mazon.com','https://name:synthetic@example.com:443/path']){
  const r=inspect(url);assert(r.original.reliable);assert($('attributionEvidence').classList.contains('hidden'));assert($('attributionNotice').classList.contains('hidden'));equal($('attributionRaw').textContent,'');
  equal($('original').textContent,I.visible(r.original.original));equal($('decodedOriginal').textContent,I.visible(r.original.decoded));equal($('normalized').textContent,r.ascii);equal($('unicode').textContent,I.visible(r.unicode));equal($('raw').textContent,I.visible(url));equal(w.testLastResult().original,r.original);
 }
});
await test('uncertain and failed extractions keep plain limitations and complete original objects',()=>{
 for(const url of ['https:////example.com','https://%ZZ.invalid','https://[','https://а.invalid:99999']){
  const r=inspect(url);assert(!r.original.reliable);assert(!$('attributionEvidence').classList.contains('hidden'));assert(!$('attributionNotice').classList.contains('hidden'));assert($('attributionNotice').textContent.includes('unverified')||$('attributionNotice').textContent.includes('could not be established reliably'));
  equal($('attributionEvidence').querySelector('summary').textContent,'Hostname extraction details');equal(JSON.parse($('attributionRaw').textContent),r.original);assert($('attributionReason').textContent.length>20);assert(!$('attributionEvidence').open);equal($('rawRecords').children.length,r.messages.length);
 }
});
await test('reinspection clears stale limitations and resets the disclosure',()=>{
 inspect('https://%ZZ.invalid');$('attributionEvidence').open=true;inspect('https://example.com');assert(!$('attributionEvidence').open);assert($('attributionEvidence').classList.contains('hidden'));equal($('attributionReason').textContent,'');equal($('attributionRaw').textContent,'');equal($('attributionNotice').textContent,'');
 inspect('https://[');assert(!$('attributionEvidence').classList.contains('hidden'));assert(!$('attributionRaw').textContent.includes('%ZZ'));
});
await test('parse failures without extraction records and unexpected errors have honest empty evidence',()=>{
 const r=inspect('ftp://example.com');assert(!r.original);assert($('attributionRaw').textContent.includes('No hostname extraction object'));assert($('attributionNotice').textContent.includes('could not be established reliably'));
 w.testInspectionFailure=true;$('inspect').click();assert($('attributionReason').textContent.includes('Inspection failed'));equal(w.testLastResult(),null);assert(!$('attributionEvidence').open);w.testInspectionFailure=false;
});
await test('count spacing is scoped and pagination/focus retain all 120 original records',()=>{
 const css=read('src/v3.css');assert(css.includes('#characterDetails .character-count{margin:5px 0}'));
 const host=Array.from({length:120},(_,i)=>String.fromCodePoint(0x4e00+i)).join('');inspect('https://'+host+'.invalid');const count=$('originalChars').querySelector('.character-count');assert(count.textContent.includes('Showing 50 of 120'));let more=$('originalChars').querySelector('button');more.click();assert(count.textContent.includes('Showing 100 of 120'));more.focus();more.click();equal($('originalChars').querySelectorAll('.character').length,120);assert(!count.textContent.includes('Showing'));assert(more.classList.contains('hidden'));assert(w.document.activeElement!==more);equal($('raw').textContent,'https://'+host+'.invalid');
});
await test('raw character JSON is absent while structured evidence and complete data remain',()=>{
 for(const [url,target]of [['https://аmazon.com','amazon.com'],['https://ａmazon.com','amazon.com'],['https://faß.invalid',''],['https://ama\u200bzon.invalid',''],['https://æ.invalid','ae.invalid']]){
  const r=inspect(url,target),e=P.characterEvidence(r),complete=[...e.original,...e.readable],internal=P.characterEvidence(w.testLastResult());equal([...internal.original,...internal.readable],complete);
  equal($('characterDetails').querySelectorAll('.raw-character,pre').length,0);assert(!$('characterDetails').textContent.includes('Raw character data'));
  const records=[...$('characterDetails').querySelectorAll('.character')];equal(records.length,complete.length);
  records.forEach((record,i)=>{const c=complete[i];for(const value of [I.visible(c.ch),c.code,c.name,c.script,P.characterNormalization(c,i<e.original.length,r)])assert(record.textContent.includes(value));
   assert(record.querySelector('.character-mapping'));if(c.confusable!==null){assert(record.textContent.includes('Mapped character names'));for(const ch of c.confusable){assert(record.querySelector('.mapping-value').textContent.includes(I.cp(ch)));assert(record.textContent.includes(I.info(ch).name));}}
  });equal($('rawRecords').children.length,r.messages.length);[...$('rawRecords').children].forEach((record,i)=>equal(record.querySelector('.diagnostic-text').textContent,r.messages[i].text));
 }
 assert(!read('src/v3.css').includes('.raw-character'));assert(read('src/ui.js').includes('original?rawText(original)'));
});
await test('related comparison characters and multi-character sequences remain contextual',()=>{
 inspect('https://раypal.com','paypal.com');const records=[...$('characterDetails').querySelectorAll('.character')];equal(records.length,2);for(const record of records){assert(record.textContent.includes('Related comparison characters'));assert(record.textContent.includes('Their positions have not been matched.'));}
 inspect('https://æ.invalid','ae.invalid');assert($('characterDetails').textContent.includes('U+0061'));assert($('characterDetails').textContent.includes('U+0065'));assert($('characterDetails').textContent.includes('Mapped character names'));assert(!$('rawRecords').textContent.includes('confusableMapping'));
});
await test('markup stays inert, no destination requests or new storage keys occur',()=>{
 inspect('https://example.com/<img src=x onerror=ATTACK>?marker=TECHNICAL_ONLY');equal(a.network,[]);assert(!w.ATTACK);equal(w.document.querySelectorAll('img,iframe,object,embed').length,0);assert(!/innerHTML|outerHTML|insertAdjacentHTML/.test(read('src/ui.js')));assert(!a.storage.writes.map(x=>x[1]).join('').includes('TECHNICAL_ONLY'));assert(a.storage.writes.every(x=>x[0]===R.KEY));
});
await test('removed placeholders are unnecessary in both editions, saved/manual comparisons and recovery',async()=>{
 for(const edition of ['hosted','standalone']){
  const app=mount({edition}),el=app.$;
  app.w.reviewImportText(JSON.stringify({application:R.APPLICATION,schemaVersion:1,references:['amazon.com','web.com']}));el('applyImport').click();
  for(const [url,target]of [['https://arnazon.com','amazon.com'],['https://vveb.com',''],['https://turn.com','turn.com'],['https://turn.com',''],['https://[','']]){
   const r=app.inspect(url,target);equal(el('relevantSubstitutions'),null);equal(el('neutralSlot'),null);equal(app.w.testLastResult(),r);equal(el('rawRecords').children.length,r.messages.length);
   if(url.includes('arnazon'))assert(el('primaryDetail').textContent.includes('“rn” may resemble “m”'));
   if(url.includes('vveb'))assert(el('primaryDetail').textContent.includes('“vv” may resemble “w”'));
  }
  app.w.testInspectionFailure=true;el('inspect').click();equal(app.w.testLastResult(),null);equal(el('primaryTitle').textContent,'Inspection could not be completed');equal(el('rawRecords').children.length,0);
  app.w.testInspectionFailure=false;app.inspect('https://example.com','example.com');equal(el('primaryTitle').textContent,'Exact hostname match');equal(app.network,[]);await app.close();
 }
});
await a.close();t.finish();
