import {suite} from './harness.mjs';import {mount} from './dom-support.mjs';import {fromBlocks} from './comparison-support.mjs';import {cases,inside} from './stage8-cases.mjs';
const t=suite('Stage 8 F-01 supported embedded result presentation','stage8-results.json'),{test,assert,equal}=t,pause=()=>new Promise(r=>setTimeout(r,0));
for(const edition of ['standalone','hosted']){
 const app=mount({edition}),{w,$}=app;await w.testAutomaticUI.start();
 const ordinary=()=>['primaryScope','primaryTitle','primaryMatch','primaryDetail','primaryContext','otherFindings','inspectionCoverage'].map(id=>$(id).textContent).join(' ');
 const name=n=>n.getAttribute('aria-labelledby').split(/\s+/).map(id=>{assert($(id),'Missing accessible name target '+id);return $(id).textContent;}).join(' ');
 const inspect=async c=>{w.resetReferenceUI();for(const ref of c.refs||[])w.testReferences.add(ref);app.inspect(c.url,c.expected||'');await pause();await pause();};
 t.group(edition+' independent combinations and auditor reproductions');
 for(const c of cases)await test(c.id,async()=>{
  await inspect(c);const rows=[...$('otherFindings').querySelectorAll('.secondary-finding')],warnings=Number($('primary').dataset.kind==='caution')+rows.filter(n=>n.dataset.kind==='caution').length;equal(warnings,c.warnings);
  if(c.scope){equal($('primaryScope').textContent,c.scope);assert($('automaticAnnouncement').textContent.startsWith('Caution. '+c.scope+'.'));}
  if(c.target)assert(ordinary().includes(c.target));
  for(const source of c.sources||[c.source].filter(Boolean))assert(ordinary().includes(source),source);
  if(c.warnings){assert(!ordinary().includes('No lookalike warnings found'));assert(!['Automatic comparisons unavailable','Some automatic comparisons are unavailable'].includes($('primaryTitle').textContent));}
  if(c.negative){equal($('primaryTitle').textContent,'No lookalike warnings found');assert($('primaryDetail').textContent.includes('does not verify'))}
  if(c.information!==undefined)equal(Number($('primary').dataset.kind==='information')+rows.filter(n=>n.dataset.kind==='information').length,c.information);
  if(c.structural)equal($('primaryTitle').textContent,'Misleading hostname structure');
  if(c.unicode){assert(ordinary().includes('Cyrillic'));assert(ordinary().includes('Latin'));assert($('primaryContext').textContent.includes('Punycode'));}
  if(c.occurrences)assert($('primaryContext').textContent.includes('Found '+c.occurrences+' times'));
  if(c.limited)assert($('inspectionCoverage').textContent.includes(c.limited),$('inspectionCoverage').textContent);
  for(const n of [$('primary'),...rows]){assert(/Original address|Address(?:es)? found inside the URL|Expected Hostname/.test(name(n)));assert($(n.getAttribute('aria-describedby')));}
  assert(!/SECRET_USER|SECRET_PASS|SECRET_TOKEN/.test($('results').textContent));assert(!$('results').querySelector('img,svg,iframe,a[href]'));assert(!/SECRET_|acrne|acmecorp/.test($('automaticAnnouncement').textContent));assert(!$('advanced').open&&!$('diagnostics').open);equal(app.network,[]);
  const actual=w.testLastResult();if(c.scope==='Address found inside the URL')assert(name($('primary')).includes($('primaryHost').textContent)&&$('primaryHost').textContent!==actual.ascii);
  // Every retained independent security proof has a warning representation,
  // while legitimate structural membership is not promoted by the selector.
  const ready=await w.testUnifiedComparisons.prepare(fromBlocks(w.document),{clock:()=>0}),r=ready.evaluate(actual,{references:c.refs||[]}),before=JSON.stringify(r),model=w.testAutomaticUI.view(r),selection=w.testAutomaticUI.selection(actual,r.manual.references,model,r);
  for(const relation of r.relationships.filter(x=>['unicode-visual','ascii-visual'].includes(x.class)||x.class==='structural'&&x.scope==='legacy-name-inside')){
   if(!relation.sourceIds.some(id=>r.sources[id-1].role==='embedded'))continue;
   assert([selection.primary,...selection.other].some(x=>x.kind==='caution'&&x.hostname===relation.hostname),'Supported embedded proof lost: '+relation.reference);
  }
  equal(JSON.stringify(r),before);equal(w.testReferences.snapshot().references,c.refs||[]);
 });
 t.group(edition+' scoped resource/data limits and evidence preservation');
 for(const options of [{matcherLimits:{milliseconds:0}},{missing:true}])await test('supported manual success with '+(options.missing?'missing index':'interrupted automatic matching'),async()=>{
  const top=w.testInspector.inspect(inside('https://acrnecorpaudit.com/')),ready=options.missing?w.testUnifiedComparisons.create({status:'unavailable',reason:'missing-index'}):await w.testUnifiedComparisons.prepare(fromBlocks(w.document),{clock:()=>0,...options}),r=ready.evaluate(top,{references:['acmecorpaudit.com']}),before=JSON.stringify(r),selection=w.testAutomaticUI.selection(top,r.manual.references,w.testAutomaticUI.view(r),r);
  equal(selection.primary.kind,'caution');equal(selection.primary.embedded,true);equal(selection.primary.reference,'acmecorpaudit.com');assert(selection.coverage.length);equal(JSON.stringify(r),before);
 });
 await test('exhausted reconciliation reports limitations rather than completed negative',async()=>{const top=w.testInspector.inspect(inside('https://acrnecorpaudit.com/')),ready=await w.testUnifiedComparisons.prepare(fromBlocks(w.document),{clock:()=>0,limits:{relationships:0}}),r=ready.evaluate(top,{references:['acmecorpaudit.com']}),selection=w.testAutomaticUI.selection(top,r.manual.references,w.testAutomaticUI.view(r),r);assert(selection.primary.title!=='No lookalike warnings found');assert(selection.primary.detail.includes('could not')||selection.coverage.length);});
 await test('privacy cleanup, source occurrence evidence and current result reset',async()=>{
  await inspect(cases.at(-1));const captured=w.testLastResult(),state=JSON.stringify(captured),saved=w.testReferences.exportJSON();$('advanced').open=true;await pause();assert(!/SECRET_USER|SECRET_PASS|SECRET_TOKEN/.test($('results').textContent));$('diagnostics').open=true;await pause();$('embeddedDetails').open=true;await pause();const held=[...$('embeddedCandidates').querySelectorAll('.embedded-reveal .category-body')];for(const d of $('embeddedCandidates').querySelectorAll('.embedded-reveal'))d.open=true;await pause();assert(held.some(n=>n.textContent.includes('SECRET_PASS')));$('diagnostics').open=false;await pause();assert(held.every(n=>!n.textContent));equal(JSON.stringify(captured),state);equal(w.testReferences.exportJSON(),saved);await inspect(cases[13]);assert(!/SECRET_|acmecorp|acrne/.test($('results').textContent));
 });
 await app.close();
}
t.finish({scope:'F-01 exact audit fixture and generalized source/scope, visual/structural, partial/unsupported, priority, deduplication, neutral, informational, privacy and accessible-reference cases; engine/result evidence unchanged. Browser-computed accessibility and native layout are separate.'});
