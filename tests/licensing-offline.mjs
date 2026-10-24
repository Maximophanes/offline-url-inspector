// App-level legal disclosures; no inspection data, navigation or network allowed.
import {mount} from './dom-support.mjs';import {suite} from './harness.mjs';
const t=suite('Stage 7 focused offline licensing disclosures','licensing-offline-results.json'),{test,assert,equal}=t,pause=()=>new Promise(r=>setTimeout(r,0));
for(const edition of ['standalone','hosted']){
 const app=mount({edition}),{w,$}=app;await w.testAutomaticUI.start();
 await test(edition+' Majestic notice is reachable without inspecting a URL',async()=>{
  assert($('results').classList.contains('hidden'));$('unicodeDetails').open=true;$('referenceDataAbout').open=true;await pause();
  const details=[...$('referenceDataAboutBody').querySelectorAll('details')],majestic=details.find(d=>d.querySelector('summary').textContent.includes('Majestic attribution'));assert(majestic);assert(!majestic.open);majestic.open=true;await pause();const text=majestic.querySelector('pre').textContent;
  for(const needle of ['Majestic','The Majestic Million','https://majestic.com/reports/majestic-million','https://creativecommons.org/licenses/by/3.0/','GlobalRank <= 10000','normalize and deduplicate','No Majestic endorsement'])assert(text.includes(needle),needle);
  assert(!/ShareAlike|CC-BY-SA|non-commercial only/.test(text));equal(app.network,[]);
 });
 await test(edition+' PSL preferred source, transformations and MPL remain offline',async()=>{
  const details=[...$('referenceDataAboutBody').querySelectorAll('details')],psl=details.find(d=>d.querySelector('summary').textContent.includes('Public Suffix List attribution')),mpl=details.find(d=>d.querySelector('summary').textContent.includes('full text'));assert(psl&&mpl);psl.open=true;mpl.open=true;await pause();const text=psl.querySelector('pre').textContent;
  for(const needle of ['data/public-suffix/public_suffix_list.dat','// ===BEGIN ICANN DOMAINS===','// ===BEGIN PRIVATE DOMAINS===','tools/generate_reference_data.mjs','MPL 2.0'])assert(text.includes(needle),needle);assert(mpl.querySelector('pre').textContent.includes('Mozilla Public License Version 2.0'));equal(app.network,[]);
 });
 await test(edition+' collapsed disclosures clear mounted legal text and keep reports separate',async()=>{
  const held=[...$('referenceDataAboutBody').querySelectorAll('pre')];$('unicodeDetails').open=false;await pause();assert(held.every(p=>!p.isConnected));assert($('results').classList.contains('hidden'));equal(app.network,[]);
 });
 await app.close();
}
t.finish({scope:'Fresh generated DOM app-level notice reachability, attribution, offline PSL source/MPL and collapse behavior. No browser layout or screen-reader claim.'});
