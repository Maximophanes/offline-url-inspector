import {suite} from './harness.mjs';import {mount} from './dom-support.mjs';import {cases,inside} from './final-copy-cases.mjs';
const t=suite('Stage 6 final contextual advice and concise scoped findings','final-copy-results.json'),{test,assert,equal}=t,pause=()=>new Promise(r=>setTimeout(r,0));
for(const edition of ['standalone','hosted']){
 const app=mount({edition}),{w,$}=app;await w.testAutomaticUI.start();
 async function inspect(url,expected='',saved=[]){w.resetReferenceUI();for(const value of saved)w.testReferences.add(value);app.inspect(url,expected);await pause();await pause();}
 const ordinary=()=>['primaryScope','primaryTitle','primaryMatch','primaryDetail','primaryContext','otherFindings','inspectionCoverage'].map(id=>$(id).textContent).join(' ');
 const named=node=>(node.getAttribute('aria-labelledby')||'').split(/\s+/).filter(Boolean).map(id=>{const ref=$(id);assert(ref,'Missing name reference '+id);return ref.textContent;}).join(' ');
 t.group(edition+' requested A-H and direct copy variants');
 for(const c of cases)await test(c.id,async()=>{
  await inspect(c.url,c.expected,c.saved);const rows=[...$('otherFindings').querySelectorAll('.secondary-finding')],warnings=Number($('primary').dataset.kind==='caution')+rows.filter(n=>n.dataset.kind==='caution').length;
  equal(warnings,c.warnings);equal(ordinary().split('does not encrypt').length-1,c.http);equal($('primaryScope').textContent,c.scope);assert(named($('primary')).includes(c.host));
  const advice=$('primaryDetail').querySelectorAll('.finding-thought'),last=advice[advice.length-1]?.textContent||'';
  if(c.advice==='http'){assert(last.includes('HTTP addresses; use HTTPS instead'));assert(!last.includes('Check the actual hostname'));}
  if(c.advice==='identity'){assert(last.includes('Check the actual hostname'));assert(!last.includes('HTTPS'));}
  if(c.advice==='mixed'){assert(last.includes('actual hostname of each address'));assert(last.includes('sensitive information without HTTPS'));}
  if(c.advice){equal(ordinary().split('Avoid submitting').length-1,c.advice==='identity'?0:1);equal(ordinary().split('Check the actual hostname').length-1,c.advice==='http'?0:1);}
  else assert(!/Avoid submitting|Check the actual hostname/.test(ordinary()));
  assert(!/inside this link|Caution ·|Information ·|USER_PRIVATE|PASS_PRIVATE|TOKEN_PRIVATE/.test(ordinary()));
  if(c.oneGroup)equal($('otherFindings').querySelectorAll('.finding-scope-label').length,1);
  if(c.groups)equal([...$('otherFindings').querySelectorAll('.finding-scope-label')].map(n=>n.textContent),c.groups);
  if(c.information)equal(Number($('primary').dataset.kind==='information')+rows.filter(n=>n.dataset.kind==='information').length,c.information);
  if(c.neutral)assert($('primaryScope').classList.contains('screen-reader-only'));
  for(const row of rows){const name=named(row);assert(name.includes('Original address')||name.includes('Addresses found inside the URL')||name.includes('Expected Hostname'));assert(name.includes(row.dataset.kind==='caution'?'Caution':'Information'));const host=row.querySelector('.screen-reader-only').textContent;assert(name.includes(host));const description=$(row.getAttribute('aria-describedby'));assert(description&&description.textContent);equal(row.querySelector('.finding-kind').textContent,row.dataset.kind==='caution'?'Caution':'Information');}
  const ids=[...$('results').querySelectorAll('[id]')].map(n=>n.id);equal(new Set(ids).size,ids.length);
  assert(!/USER_PRIVATE|PASS_PRIVATE|TOKEN_PRIVATE|rnicrosoft|xn--/.test($('automaticAnnouncement').textContent));assert($('automaticAnnouncement').textContent.includes(c.scope+'.'));
  if(c.limited)assert($('inspectionCoverage').textContent.includes('could not be fully checked'));
  assert(!$('advanced').open&&!$('diagnostics').open);equal(app.network,[]);
 });
 t.group(edition+' evidence privacy and scope retention');
 await test('comparison sources and diagnostic evidence remain deliberate',async()=>{await inspect('http://rnicrosoft.com/','microsoft.com',['microsoft.com']);const state=JSON.stringify(w.testLastResult()),storage=w.testReferences.exportJSON();$('advanced').open=true;await pause();for(const source of ['Expected Hostname','Personal Reference Domains','Built-in popular-domain references'])assert($('automaticRecords').textContent.includes(source));$('diagnostics').open=true;await pause();for(const d of $('diagnostics').querySelectorAll('details'))assert(!d.open);equal(JSON.stringify(w.testLastResult()),state);equal(w.testReferences.exportJSON(),storage);});
 await test('private evidence is unmounted on collapse',async()=>{await inspect(inside('http://USER_PRIVATE:PASS_PRIVATE@rnicrosoft.com/?token=TOKEN_PRIVATE'));assert(!/USER_PRIVATE|PASS_PRIVATE|TOKEN_PRIVATE/.test($('results').textContent));$('diagnostics').open=true;await pause();$('embeddedDetails').open=true;await pause();const held=[...$('embeddedCandidates').querySelectorAll('.embedded-reveal .category-body')];for(const d of $('embeddedCandidates').querySelectorAll('.embedded-reveal'))d.open=true;await pause();assert(held.some(n=>n.textContent.includes('PASS_PRIVATE')));$('diagnostics').open=false;await pause();assert(held.every(n=>!n.textContent));});
 await test('new inspection removes prior scope names and descriptions',async()=>{await inspect(cases[5].url);const held=[...$('otherFindings').querySelectorAll('.secondary-finding')];await inspect(cases[7].url);equal($('otherFindings').querySelectorAll('.secondary-finding').length,0);equal($('primaryHost').textContent,'example.com');assert(!/attacker|rnicrosoft|xn--/.test(named($('primary'))));assert(held.every(n=>!n.isConnected));});
 await app.close();
}
t.finish({scope:'Narrow final copy acceptance: A-H plus direct advice/scope variants, unchanged warning counts/priority, accessible reference wiring and privacy. Native computed accessibility and layout checks are separate; no screen-reader acceptance claim.'});
