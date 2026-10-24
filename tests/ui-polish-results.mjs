import {suite} from './harness.mjs';import {mount} from './dom-support.mjs';import {cases,nestedLimit} from './ui-polish-cases.mjs';
const t=suite('Final acceptance shared hierarchy and recovered provenance','ui-polish-results.json'),{assert,equal,test}=t,pause=()=>new Promise(r=>setTimeout(r,0));
for(const edition of ['standalone','hosted']){
 const app=mount({edition}),{w,$}=app;await w.testAutomaticUI.start();
 const inspect=async c=>{w.resetReferenceUI();for(const v of c.refs||[])w.testReferences.add(v);app.inspect(c.url,c.expected||'');await pause();await pause();};
 for(const c of cases)await test(edition+' '+c.id,async()=>{
  await inspect(c);const rows=[...$('otherFindings').querySelectorAll('.secondary-finding')],all=[$('primary'),...rows];
  equal(all.filter(n=>n.dataset.kind==='caution').length,c.warnings);equal(all.filter(n=>n.dataset.kind==='information').length,c.information);
  if(c.scope)equal($('primaryScope').textContent,c.scope);
  if(c.neutral)equal($('primaryTitle').textContent,'No lookalike warnings found');
  // Regress typography for the observed 10px labels without treating layout simulation as native geometry.
  for(const row of rows){const label=row.querySelector('.finding-kind'),title=row.querySelector('.finding-title');equal(label.textContent,row.dataset.kind==='caution'?'Caution':'Information');assert(parseFloat(w.getComputedStyle(label).fontSize)>=12);assert(parseFloat(w.getComputedStyle(title).fontSize)>parseFloat(w.getComputedStyle(label).fontSize));}
  for(const node of all){const ids=node.getAttribute('aria-labelledby').split(/\s+/),name=ids.map(id=>$(id)?.textContent||'').join(' ');assert(ids.every(id=>$(id)));assert(/Original address|Address(?:es)? found inside the URL|Expected Hostname/.test(name));assert($(node.getAttribute('aria-describedby')));}
  if(c.summary){const summary=[...$('embeddedHostSummary').querySelectorAll('.embedded-host-line')];equal(summary.map(n=>[n.querySelector('.mono').textContent,n.querySelector('.embedded-source-note')?.textContent||'']),c.summary);for(const row of summary)assert(!/different from the original|same hostname|link parameters|recorded appearances/.test(row.textContent));}
  if(c.userinfo){const sentence='Text before @ is not the website name. The actual hostname is '+c.userinfo+'.';const thought=[...$('results').querySelectorAll('.finding-thought')].find(n=>n.textContent===sentence);assert(thought,'Full dynamic @ sentence missing');equal(thought.children.length,0);}
  if(c.limited)assert($('inspectionCoverage').textContent.includes('Some deeper addresses inside this URL were not checked.'));
  if(c.complete)assert(!$('inspectionCoverage').textContent.includes('Some deeper addresses'));
  assert(!/SECRET_USER|SECRET_PASS|SECRET_TOKEN/.test($('results').textContent));assert(!$('results').querySelector('img,svg,iframe,a[href]'));assert(!$('advanced').open&&!$('diagnostics').open);equal(app.network,[]);
  const result=w.testLastResult(),state=JSON.stringify(result),refs=w.testReferences.exportJSON();$('advanced').open=true;await pause();equal(JSON.stringify(result),state);equal(w.testReferences.exportJSON(),refs);
  if(c.summary){for(const [host]of c.summary){const line=[...$('embeddedGroups').querySelectorAll('.embedded-host-line')].find(n=>n.querySelector('.mono').textContent===host);assert(line&&/different from the original/.test(line.textContent));assert(line.querySelector('button')?.textContent==='View exact occurrences');}}
  if(c.occurrences){assert($('embeddedGroups').textContent.includes('2 recorded appearances'));const button=$('embeddedGroups').querySelector('button');button.click();await pause();await pause();assert($('diagnostics').open&&$('embeddedDetails').open);assert(w.document.activeElement.id.startsWith('embedded-entry-'));}
 });
 await test(edition+' supplied depth limit is genuine and complete nested controls remain complete',async()=>{
  const evaluate=url=>w.testEmbeddedAnalyzer.analyze(w.testInspector.inspect(url),{clock:()=>0}),r=evaluate(nestedLimit);equal(r.status,'partial');equal(r.occurrenceCoverage,'partial');equal(r.limits.depth,3);assert(r.limitations.some(l=>l.code==='depth'&&l.location==='Nested URL 2 · path'));equal(r.candidates.map(c=>[c.hostname,c.parent]),[['example.org',null],['rnicrosoft.com',1]]);
  for(const c of cases.filter(c=>c.complete)){const complete=evaluate(c.url);equal(complete.status,'complete');equal(complete.occurrenceCoverage,'complete');assert(!complete.limitations.some(l=>['depth','expansions'].includes(l.code)));}
 });
 await app.close();
}
t.finish({scope:'Current candidate DOM/typography structure and copy, immutable evidence/storage, scoped caution/information, ordinary/technical provenance, dynamic unformatted userinfo sentence and exact nested budget case. Native layout, contrast and computed accessibility are separately tested.'});
