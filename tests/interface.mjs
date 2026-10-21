// Source and DOM preservation; screenshots/layout are reviewed separately.
import {read,html,modules,suite,functionalSource} from './harness.mjs';
import {mount} from './dom-support.mjs';
import {createHash} from 'node:crypto';
const t=suite('V3.1.2 final interface hierarchy and evidence preservation','interface-results.json'),{test,assert,equal}=t;
const a=mount(),{$,w,inspect}=a,{Inspector:I,Presentation:P}=modules(),hash=s=>createHash('sha256').update(s).digest('hex');
const fixtures=[...JSON.parse(read('tests/cases.json')),...JSON.parse(read('tests/ascii-cases.json'))],baseline=JSON.parse(read('tests/interface-baseline.json'));
await test('every complete inspection and original record matches the committed checkpoint',()=>{
 const rows=fixtures.map(c=>{const r=I.inspect(c.url,c.expected||'');return {name:c.name,result:r,records:r.messages.map(m=>({...m,category:P.diagnostic(m).category,severity:P.diagnostic(m).severity}))};});
 equal(rows.length,baseline.fixtures);equal(hash(JSON.stringify(rows)),baseline.completeResultsAndRecordsSHA256);
 for(const [file,expected]of Object.entries(baseline.sourceFiles))equal(hash(['src/core.js','src/presentation.js','src/base.css'].includes(file)?functionalSource(file):read(file)),expected);
});
await test('consolidated records preserve every original message, code, category, severity and order',()=>{
 for(const c of fixtures){const r=inspect(c.url,c.expected||''),ordinary=[...$('messages').children],raw=[...$('rawRecords').children];
  equal(ordinary.length,r.messages.length);equal(raw.length,r.messages.length);equal($('messages').querySelectorAll('.raw-diagnostic,.diagnostic-text').length,0);assert(!$('rawDiagnostics').open);
  raw.forEach((e,i)=>{const m=r.messages[i],display=P.diagnostic(m);equal(e.dataset.code,m.code);equal(e.dataset.level,m.level);equal(e.dataset.category,display.category);equal(e.querySelector('.diagnostic-text').textContent,m.text);equal(e.querySelector('h3').textContent,'Record '+(i+1)+' · '+m.code);assert(e.querySelector('.diagnostic-kind').textContent.includes('Severity: '+display.severity));equal(ordinary[i].querySelector('.diagnostic-severity').textContent,display.severity);});
 }
});
await test('one raw disclosure is last, collapsed, labeled and keyboard-scrollable',()=>{
 inspect('https://аmazon.com','amazon.com');equal($('rawDiagnostics').querySelector('summary').textContent,'Raw Diagnostic Records');equal($('rawDiagnostics').parentElement.lastElementChild,$('rawDiagnostics'));equal($('rawRecords').tabIndex,0);equal($('rawRecords').getAttribute('role'),'region');assert($('rawRecords').getAttribute('aria-label').includes('original'));assert(!$('rawDiagnostics').open);assert(read('src/v3.css').includes('.raw-record-list:focus-visible'));assert(read('src/v3.css').includes('max-height:65vh;overflow:auto'));
});
await test('reinspection clears stale originals and closes an opened raw disclosure',()=>{
 inspect('https://аmazon.com','amazon.com');$('rawDiagnostics').open=true;const r=inspect('https://fgh.net');assert(!$('rawDiagnostics').open);equal($('rawRecords').children.length,r.messages.length);assert(!$('rawRecords').textContent.includes('xn--mazon-3ve.com'));inspect('https://[');assert(!$('rawRecords').textContent.includes('fgh.net'));equal($('rawRecords').children.length,1);
});
await test('structured ASCII observations stay in their finding with all locations',()=>{
 const r=inspect('https://'+ 'm'.repeat(120)+'.invalid'),e=$('messages').querySelector('[data-code="ascii-ambiguity"]');
 assert(e.querySelector('.diagnostic-evidence'));equal(e.querySelector('summary').textContent,'ASCII visual ambiguityInformation');
 const list=e.querySelector('.diagnostic-occurrences'),more=e.querySelector('button');equal(list.children.length,50);more.click();more.click();equal(list.children.length,120);
 equal($('rawRecords').querySelector('[data-code="ascii-ambiguity"] .diagnostic-text').textContent,r.messages.find(m=>m.code==='ascii-ambiguity').text);
});
await test('character mappings, input evidence and comparison methods stay contextual',()=>{
 inspect('https://аmazon.com/account','amazon.com');assert($('characterDetails').querySelector('.mapping-value').textContent.includes('U+0430'));assert($('originalChars').textContent.includes('U+0061'));assert($('referenceCandidates').textContent.includes('Unicode visual comparison'));equal($('raw').textContent,'https://аmazon.com/account');equal($('attributionEvidence').parentElement.closest('details').id,'originalDetails');
});
await test('labels use context-specific styles with no global forced line break',()=>{
 inspect('https://аmazon.com');equal(w.document.querySelectorAll('.hostname-grid .label-detail').length,2);
 const css=read('src/v3.css');assert(css.includes('.row .label-detail{display:block;white-space:nowrap'));assert(!/\.label-detail\{display:block/.test(css.replace('.row .label-detail{','')));
 for(const id of ['decodedOriginal','normalized','unicode'])assert($(id).previousElementSibling.querySelector('.label-detail'));
});
await test('update status is an independent atomic region with decorative indicator',()=>{
 equal($('updateStatus').getAttribute('role'),'status');equal($('updateStatus').getAttribute('aria-atomic'),'true');equal($('updateStatus').querySelector('.update-indicator').getAttribute('aria-hidden'),'true');
 assert(!$('updatePanel').contains($('updateStatus')));equal($('updateStatus').parentElement,$('offlineStatus').parentElement);assert($('updateSummary'));assert($('updateExplanation'));
});
await test('offline disclosure starts with semantic paragraphs and preserves independent flow',()=>{
 equal($('offlineDetail').children[0].tagName,'P');assert(!$('offlineHelp').contains($('checkCache')));assert(!$('offlineHelp').contains($('offlineStatus')));
 const css=read('src/v3.css');assert(!/status-help[^}]*max-width:78ch/.test(css));assert(!/status-help[^}]*white-space:pre-line/.test(css));assert(css.includes('width:max-content'));assert(css.includes('grid-template-columns:minmax(0,1fr) max-content'));
});
await test('status colors are scoped to application feedback; URL findings are unaffected',()=>{
 const css=read('src/v3.css');for(const [tone,color]of [['success','green'],['caution','orange'],['error','red']])assert(css.includes('.update-feedback[data-tone="'+tone+'"]{--update-color:var(--'+color+')}'));
 assert(css.includes('text-align:left'));assert(css.includes('.update-feedback[data-state=""] .update-indicator{visibility:hidden}'));assert(!/\.update-feedback[^}]*text-align:center/.test(css));
});
await test('standalone remains self-contained and has no hosted bootstrap',()=>{
 assert(!html().includes('const HostedOffline='));assert(html('hosted').includes('const HostedOffline='));equal($('offlineStatus').textContent,'Standalone · Offline ready');equal(a.network,[]);
});
await test('source changes add no untrusted HTML sinks or destination requests',()=>{
 assert(!/innerHTML|outerHTML|insertAdjacentHTML/.test(read('src/ui.js')));assert(!/fetch\(|XMLHttpRequest|WebSocket/.test(read('src/hosted.js')));equal(a.network,[]);
});
await a.close();t.finish({kind:'source and simulated DOM; actual desktop/tablet/mobile review and zoom limits are in FINAL_INTERFACE_REVIEW.md'});
