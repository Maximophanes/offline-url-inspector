import {suite} from './harness.mjs';
import {mount} from './dom-support.mjs';
import {transportCases,boundaries,inside} from './http-structure-cases.mjs';
const t=suite('Stage 6 independent HTTP caution and plain structural explanations','http-structure-results.json'),{test,assert,equal}=t,pause=()=>new Promise(r=>setTimeout(r,0));
for(const edition of ['standalone','hosted']){
 const app=mount({edition}),{w,$}=app;await w.testAutomaticUI.start();
 async function inspect(url,expected='',saved=[]){w.resetReferenceUI();for(const value of saved)w.testReferences.add(value);app.inspect(url,expected);await pause();await pause();}
 async function open(id){$(id).open=true;await pause();}
 const ordinary=()=>['primaryTitle','primaryMatch','primaryDetail','primaryContext','otherFindings','embeddedHostSummary','inspectionCoverage'].map(id=>$(id).textContent).join(' ');
 t.group(edition+' transport severity, independent warnings and scope');
 for(const c of transportCases)await test(c.name,async()=>{
  await inspect(c.url,c.expected,c.saved);equal($('ascii').textContent,c.host);
  const secondary=[...$('otherFindings').querySelectorAll('.secondary-finding')],http=secondary.filter(n=>n.querySelector('.finding-title').textContent.includes('HTTP'));
  const count=c.http===false?0:c.httpCount||1;
  equal(ordinary().split('does not encrypt').length-1,count);
  if(c.identity){equal($('primary').dataset.kind,'caution');assert(!$('primaryTitle').textContent.includes('HTTP'));assert(!$('primaryDetail').textContent.includes('does not encrypt'));equal(http.length,count);}
  else if(count){assert($('primaryTitle').textContent.includes('HTTP'));equal($('primary').dataset.kind,'caution');}
  for(const row of http){equal(row.dataset.kind,'caution');assert(row.querySelector('.finding-kind').textContent.startsWith('Caution'));}
  if(c.embedded&&count){assert((http[0]||$('primary')).textContent.includes('inside this link'));if(http.length)assert(http[0].querySelector('.finding-kind').textContent.includes('Inside this link'));}
  if(c.name.startsWith('two independent'))assert(http[0].querySelector('.finding-title').textContent.includes('rnicrosoft.com'));
  if(c.http===false)equal(http.length,0);
  if(c.port){const row=secondary.find(n=>new RegExp('port '+c.port,'i').test(n.querySelector('.finding-title').textContent));if(row)equal(row.dataset.kind,'information');else{equal($('primary').dataset.kind,'information');assert($('primaryTitle').textContent.includes(c.port));}}
  if(c.weak)assert(secondary.some(n=>n.dataset.kind==='information'&&n.textContent.includes('Similar spelling')));
  if(c.unsupported)assert($('inspectionCoverage').textContent.includes('do not apply')||$('inspectionCoverage').textContent.includes('aren’t available'));
  if(c.limited)assert($('inspectionCoverage').textContent.includes('could not be fully checked'));
  if(c.unicode){equal(ordinary().split('Browser hostname (Punycode)').length-1,1);assert(ordinary().includes('аpplе.com'));assert(ordinary().includes('Cyrillic'));}
  assert(!/USER_PRIVATE|PASS_PRIVATE|confirmed redirect|connection was established|connection was tested/i.test(ordinary()));
  assert(!secondary.some(n=>n.dataset.kind==='information'&&n.querySelector('.finding-title').textContent.includes('HTTP')));
  if(count)equal(ordinary().split('Check the website name before opening').length-1,1);
  assert(!$('diagnostics').open);await open('diagnostics');for(const d of $('diagnostics').querySelectorAll('details'))assert(!d.open);
 });
 for(const scheme of ['http','https'])for(const port of ['',scheme==='http'?':80':':443',':8080'])await test(scheme+' default and nondefault port '+port,async()=>{
  await inspect(scheme+'://example.com'+port+'/');equal(ordinary().split('does not encrypt').length-1,scheme==='http'?1:0);
  const nondefault=port===':8080',rows=[...$('otherFindings').querySelectorAll('.secondary-finding')];
  if(scheme==='https')equal($('primary').dataset.kind,nondefault?'information':'neutral');
  if(!nondefault)assert(!ordinary().includes('specifies port'));
  for(const row of rows.filter(n=>n.textContent.includes('port 8080')))equal(row.dataset.kind,'information');
 });
 t.group(edition+' structural wording and unchanged independently expected boundaries');
 for(const [host,suffix,section,domain,target,positive]of boundaries)for(const embedded of [false,true])await test((embedded?'inside ':'original ')+host,async()=>{
  await inspect(embedded?inside('https://'+host+'/'):'https://'+host+'/');
  if(positive){const text=ordinary();assert(text.includes('Having '+target+' inside this longer hostname does not make it that domain or one of its subdomains.'));assert(!text.includes('The hostname is under'));await open('advanced');for(const d of $('automaticRecords').querySelectorAll('.automatic-reveal'))d.open=true;await pause();const evidence=$('automaticRecords').textContent;assert(evidence.includes(domain));assert(evidence.includes(suffix));assert(evidence.includes(section==='PRIVATE'?'private hosting rule':'public suffix rule'));}
  else assert(!ordinary().includes('Having '+target+' inside this longer hostname'));
 });
 await test('same wording for manual structure outside automatic eligibility',async()=>{await inspect('https://trusted.test.other.test/','trusted.test',['trusted.test']);assert($('primaryDetail').textContent.includes('Having trusted.test inside this longer hostname'));assert(!$('primaryDetail').textContent.includes('The hostname is under'));});
 await test('structural proof does not repeat across equivalent comparison sources',async()=>{await inspect('https://google.com.example.net/','google.com',['google.com']);equal($('primaryDetail').textContent.split('Having google.com inside').length-1,1);const r=JSON.stringify(w.testLastResult()),storage=w.testReferences.exportJSON();await open('advanced');for(const name of ['Expected Hostname','Personal Reference Domains','Built-in popular-domain references'])assert($('automaticRecords').textContent.includes(name));equal(JSON.stringify(w.testLastResult()),r);equal(w.testReferences.exportJSON(),storage);});
 await test('visual and structural proof both survive alongside HTTP',async()=>{await inspect('http://google.com.goog1e.com/');const text=$('primaryDetail').textContent;assert(text.includes('can look like'));assert(text.includes('Having google.com inside'));assert(!text.includes('does not encrypt'));equal($('otherFindings').querySelectorAll('[data-kind=caution]').length,1);});
 await test('sensitive source values remain deliberate and unmounted on collapse',async()=>{await inspect(inside('http://USER_PRIVATE:PASS_PRIVATE@rnicrosoft.com/?token=TOKEN_PRIVATE'));assert(!/USER_PRIVATE|PASS_PRIVATE|TOKEN_PRIVATE/.test($('results').textContent));await open('diagnostics');await open('embeddedDetails');const held=[...$('embeddedCandidates').querySelectorAll('.embedded-reveal .category-body')];for(const d of $('embeddedCandidates').querySelectorAll('.embedded-reveal'))d.open=true;await pause();assert(held.some(n=>n.textContent.includes('PASS_PRIVATE')));$('diagnostics').open=false;await pause();assert(held.every(n=>!n.textContent));equal(app.network,[]);});
 await app.close();
}
t.finish({scope:'Current standalone and hosted generated presentation: semantic HTTP cautions, proportional ports, regular/PRIVATE structural explanations, negative controls, source attribution, limited coverage and privacy. Matching and data inputs are unchanged; native Firefox is separate.'});
