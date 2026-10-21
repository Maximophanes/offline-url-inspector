import {read,html,suite,MemoryStorage} from './harness.mjs';
import {mount} from './dom-support.mjs';
import {createHash} from 'node:crypto';
const t=suite('V3.2.0 embedded URL discovery, evidence, limits and privacy','embedded-results.json'),{test,assert,equal}=t;
const data=html().match(/id="unicode-data">([\s\S]*?)<\/script>/)[1];
const {Inspector:I,EmbeddedURLs:E}=new Function('document',read('src/core.js')+'\n'+read('src/embedded.js')+'\nreturn {Inspector,EmbeddedURLs};')({getElementById:()=>({textContent:data})});
const inspect=(url,expected='',references=[],extra={})=>E.analyze(I.inspect(url,expected),{references,clock:()=>0,...extra});
const addresses=r=>r.candidates.filter(c=>c.type==='absolute');
const hosts=r=>[...new Set(addresses(r).map(c=>c.hostname))];
const has=(r,code)=>r.limitations.some(l=>l.code===code);
const outer='https://example.test';
const encode=encodeURIComponent;
t.group('supported discovery with independent expected hostnames');
for(const [name,url,component,layers]of [
 ['plain query',outer+'/?next=https://other.test/a','query',0],
 ['plain fragment',outer+'/#next=https://other.test/a','fragment',0],
 ['whole fragment',outer+'/#https://other.test/a?x=1','fragment',0],
 ['encoded query',outer+'/go?next=https%3A%2F%2Fother.test','query',1],
 ['encoded fragment',outer+'/#next=https%3A%2F%2Fother.test','fragment',1],
 ['fragment route',outer+'/#/login?next=https%3A%2F%2Fother.test','fragment',1],
 ['encoded path',outer+'/out/https%3A%2F%2Fother.test','path',1],
 ['literal path',outer+'/out/https://other.test/a','path',0],
 ['two layers',outer+'/?next=https%253A%252F%252Fother.test','query',2],
 ['unknown name',outer+'/?unfamiliar=https%3A%2F%2Fother.test','query',1],
 ['encoded entire fragment',outer+'/#https%3A%2F%2Fother.test','fragment',1]
])await test(name,()=>{const r=inspect(url);assert(hosts(r).includes('other.test'));const c=addresses(r).find(c=>c.hostname==='other.test');equal(c.component,component);equal(c.layers,layers);equal(c.evidence,'fact');equal(r.status,'complete');});
await test('nested complete URL is data lineage, not a redirect chain',()=>{
 const nested='https://middle.test/?next='+encode('https://final.test');
 const r=inspect(outer+'/?next='+encode(nested));equal(hosts(r).sort(),['final.test','middle.test']);
 const c=addresses(r).find(c=>c.hostname==='final.test');assert(c.parent);equal(c.layers,2);assert(!('finalDestination'in r));
});
await test('repeated names retain conflicting occurrence order',()=>{
 const r=inspect(outer+'/?next=https://first.test&next=https://second.test#next=https://third.test');
 equal(addresses(r).filter(c=>c.component==='query').map(c=>[c.hostname,c.occurrence]),[['first.test',1],['second.test',2]]);equal(hosts(r).sort(),['first.test','second.test','third.test']);
});
await test('duplicate identical values retain each meaningful source occurrence',()=>{
 const r=inspect(outer+'/?next=https://other.test&next=https://other.test');equal(addresses(r).filter(c=>c.component==='query').length,2);equal(r.stats.hostnames,1);
});
t.group('outer boundaries, representations and relative references');
await test('fragment route never creates an outer query',()=>{const top=I.inspect(outer+'/#/login?next=https%3A%2F%2Fother.test'),r=E.analyze(top,{clock:()=>0});equal(top.query,'');assert(addresses(r).every(c=>c.component==='fragment'));});
await test('encoded delimiters remain inside their original value',()=>{
 const r=inspect(outer+'/?next='+encode('https://other.test/a?x=1&y=2#part'));
 const c=addresses(r).find(c=>c.hostname==='other.test');equal(c.value,'https://other.test/a?x=1&y=2#part');equal(c.occurrence,1);equal(c.component,'query');
});
await test('equals signs inside a value are retained',()=>{const r=inspect(outer+'/?next=https://other.test/a=b=c');equal(addresses(r)[0].value,'https://other.test/a=b=c');});
await test('encoded and case-varied names provide weak hints without changing stored spelling',()=>{
 const r=inspect(outer+'/?NeXt=https://first.test&%6eext=https://second.test');equal(addresses(r).map(c=>c.parameter.original),['NeXt','%6eext']);assert(addresses(r).every(c=>c.hint));
});
await test('empty/missing values do not hide a later occurrence',()=>{const r=inspect(outer+'/?next&next=&=x&&next=https://other.test');equal(addresses(r)[0].occurrence,5);equal(addresses(r)[0].hasEquals,true);equal(r.parameters.slice(0,2).map(p=>[p.hasEquals,p.emptyValue]),[[false,true],[true,true]]);equal(r.parameters[2].parameter.original,'');});
await test('literal plus and form-style spaces remain distinct interpretations',()=>{
 const r=inspect(outer+'/?next=https://other.test/a+b');assert(addresses(r).some(c=>c.value==='https://other.test/a+b'));assert(has(r,'boundaries'));equal(r.status,'partial');
 const encoded=inspect(outer+'/?next='+encode('https://other.test/a+b'));assert(addresses(encoded).some(c=>c.value==='https://other.test/a+b'));
});
await test('semicolon is not assumed to separate outer parameters',()=>{const r=inspect(outer+'/?x=one;next=https://other.test');assert(!addresses(r).some(c=>c.parameter?.decoded==='next'));equal(r.status,'partial');});
await test('HTML entities are retained, not silently rewritten',()=>{const r=inspect(outer+'/?x=1&amp;next=https://other.test');equal(addresses(r)[0].parameter.original,'amp;next');});
await test('encoded subordinate parameter strings remain inferred subordinate data',()=>{
 const r=inspect(outer+'/?data='+encode('x=1&next=https://other.test'));assert(addresses(r).some(c=>c.hostname==='other.test'&&c.inferredContainer));assert(addresses(r).every(c=>c.location.includes('nested parameters')));
});
await test('relative and protocol-relative values never acquire absolute destinations',()=>{
 const r=inspect(outer+'/?next=%2Faccount&url=%2F%2Fother.test%2Fa');assert(r.candidates.some(c=>c.type==='relative'&&c.value==='/account'));assert(r.candidates.some(c=>c.type==='protocol-relative'&&c.value==='//other.test/a'));equal(addresses(r),[]);assert(r.candidates.every(c=>!c.hostname&&!c.normalized));
});
await test('a percent-encoded fragment route reveals address data without resolving its relative base',()=>{const r=inspect(outer+'/#'+encode('/login?next=https://other.test'));assert(r.candidates.some(c=>c.type==='relative'&&!c.hostname));assert(addresses(r).some(c=>c.hostname==='other.test'&&c.component==='fragment'));equal(r.status,'complete');});
await test('dot-segment normalization preserves both source interpretations',()=>{
 const top=I.inspect(outer+'/out/https://other.test/../removed'),r=E.analyze(top,{clock:()=>0});
 assert(r.components.find(c=>c.component==='path').normalizedDiffers);assert(addresses(r).some(c=>c.representation==='submitted'&&c.value.includes('/../')));assert(addresses(r).some(c=>c.representation==='browser-normalized'));
});
await test('empty delimiters survive in source metadata',()=>{const r=inspect(outer+'/?#');assert(r.components.find(c=>c.component==='query').hasDelimiter);assert(r.components.find(c=>c.component==='fragment').hasDelimiter);});
await test('additional hash and question-mark characters do not create outer components',()=>{const r=inspect(outer+'/#next=https://other.test/a?x=1#two#three');assert(addresses(r).some(c=>c.value.endsWith('#two#three')));assert(addresses(r).every(c=>c.component==='fragment'));});
t.group('hostname reuse and scoped evidence');
for(const [host,expected,mechanism]of [['аmazon.test','amazon.test','UTS #39'],['arnazon.test','amazon.test','UTS #39'],['vveb.test','web.test','supplemental ASCII visual heuristic']])await test('embedded resemblance '+host,()=>{
 const r=inspect(outer+'/?next='+encode('https://'+host),'example.test',[expected]);const c=addresses(r)[0];assert(c.comparisons.some(x=>x.source==='Saved reference'&&x.visual&&x.mechanism===mechanism));
});
await test('manual target and initial exact match remain independent',()=>{
 const top=I.inspect(outer+'/?next='+encode('https://other.test'),'example.test'),before=JSON.stringify(top),r=E.analyze(top,{references:['example.test'],clock:()=>0});equal(JSON.stringify(top),before);equal(top.comparison.kind,'exact');equal(addresses(r)[0].initialRelationship,'different');
});
await test('userinfo, IPv4/IPv6 and effective ports retain native meaning',()=>{
 const values=['https://expected.test@other.test:8443/a','http://0x7f000001/','https://[2001:db8::1]:443/'];
 const r=inspect(outer+'/?'+values.map((v,i)=>'x'+i+'='+encode(v)).join('&'));
 const a=addresses(r);assert(a.some(c=>c.hostname==='other.test'&&c.hasUserinfo&&c.effectivePort==='8443'));assert(a.some(c=>c.hostname==='127.0.0.1'));assert(a.some(c=>c.hostname==='[2001:db8::1]'&&c.effectivePort==='443'));
});
await test('RTL visual unavailability is not a negative result',()=>{const r=inspect(outer+'/?next='+encode('https://مثال.test'),'example.test');assert(addresses(r)[0].comparisons.some(c=>c.unavailable&&c.visual===null));});
await test('encoded hidden characters remain reviewable',()=>{const r=inspect(outer+'/?next='+encode('https://other.test/a\u202eb'));assert(addresses(r).some(c=>c.warnings.includes('invisible')));});
await test('same-host and subdomain relationships do not imply ownership',()=>{const r=inspect(outer+'/?a='+encode(outer+'/ok')+'&b=https://login.example.test');assert(addresses(r).some(c=>c.initialRelationship==='exact'));assert(addresses(r).some(c=>c.initialRelationship==='subdomain'));assert(!JSON.stringify(r).includes('registrableDomain'));});
t.group('benign negatives and explicitly unsupported interpretations');
for(const url of [outer+'/?utm_source=news#section',outer+'/?q=hello%20world',outer+'/#ordinary-anchor',outer+'/?amount=12&currency=USD'])await test('ordinary data '+url,()=>{const r=inspect(url);equal(addresses(r),[]);equal(r.status,'complete');});
for(const path of ['/go/ordinary','/out/ordinary','/redirect/ordinary'])await test('a path hint alone has no unsupported or warning outcome '+path,()=>{const r=inspect(outer+path);equal(r.status,'complete');equal(r.candidates,[]);});
for(const [name,value]of [['state','aHR0cHM6Ly9vdGhlci50ZXN0'],['data','{"url":"https://other.test"}'],['qs','r-[opaque-data]'],['next','javascript:location="https://other.test"'],['next','data:text/html,https://other.test'],['next','blob:https://other.test/id'],['next','mailto:person@other.test']])await test('unsupported '+name+' value',()=>{
 const r=inspect(outer+'/?'+name+'='+encode(value));equal(addresses(r),[]);equal(r.status,'unsupported');assert(r.limitations.some(l=>l.kind==='unsupported'));
});
await test('OAuth and callback URLs are informational',()=>{
 const r=inspect(outer+'/?redirect_uri='+encode('https://client.test/callback')+'&callback='+encode('https://merchant.test/paid'));
 equal(r.status,'complete');assert(addresses(r).every(c=>!c.warnings.length&&!c.comparisons.some(x=>x.visual)));
});
t.group('malformed, adversarial and deterministic resource boundaries');
for(const payload of ['https%3A%2F%2Fother.test%zz','https%3A%2F%2Fother.test%FF','https%3A%2F%2Fother.test%C0%AF'])await test('strict failure '+payload,()=>{const r=inspect(outer+'/?next='+payload);equal(r.status,'partial');assert(has(r,'decoding'));equal(addresses(r),[]);});
await test('three encoding layers stop at the approved boundary',()=>{const r=inspect(outer+'/?next='+encode(encode(encode('https://other.test'))));equal(addresses(r),[]);assert(has(r,'percent-depth'));equal(r.status,'partial');});
await test('overlong values are not truncated into complete URLs',()=>{const r=inspect(outer+'/?next=https://other.test/'+ 'a'.repeat(9000));equal(addresses(r),[]);equal(r.status,'partial');assert(has(r,'value-size'));});
await test('query saturation cannot prevent fragment/path discovery',()=>{
 const r=inspect(outer+'/out/'+encode('https://path.test')+'?'+Array.from({length:200},(_,i)=>'p'+i+'=x').join('&')+'#next='+encode('https://fragment.test'));
 assert(hosts(r).includes('path.test'));assert(hosts(r).includes('fragment.test'));equal(r.status,'partial');assert(has(r,'parameters')||has(r,'nodes'));
});
await test('a single substring-heavy value yields to other components',()=>{const r=inspect(outer+'/?x='+encode(Array(40).fill('see https://query.test').join(' '))+'#next='+encode('https://fragment.test'));assert(hosts(r).includes('fragment.test'));equal(r.status,'partial');});
await test('candidate and hostname saturation is explicit',()=>{
 const r=inspect(outer+'/?'+Array.from({length:50},(_,i)=>'p'+i+'=https://h'+i+'.test').join('&'));
 assert(r.candidates.length<=E.LIMITS.candidates);assert(r.stats.hostnames<=E.LIMITS.hostnames);equal(r.status,'partial');assert(has(r,'candidates'));
});
await test('visual/spelling budget exhaustion preserves exact checks and unavailable states',()=>{
 const refs=Array.from({length:100},(_,i)=>'reference'+i+'.test'),r=inspect(outer+'/?a=https://first.test&b=https://second.test&c=https://third.test','example.test',refs);
 assert(r.stats.comparisons<=E.LIMITS.comparisons);assert(has(r,'comparisons'));equal(r.status,'partial');assert(addresses(r).some(c=>c.comparisons.some(x=>x.limited&&x.unavailable)));
});
await test('time exhaustion is visible and does not change original results',()=>{let tick=0;const top=I.inspect(outer+'/?next=https://other.test'),before=JSON.stringify(top),r=E.analyze(top,{clock:()=>tick++*101});equal(r.status,'partial');assert(has(r,'time'));equal(JSON.stringify(top),before);});
for(const url of ['https://[','javascript:alert(1)','https:////example.test/','https://example.test/'+ 'a'.repeat(32768)])await test('unavailable top level '+url.slice(0,50),()=>equal(inspect(url).status,'unavailable'));
await test('large limit counters stay bounded',()=>{
 const r=inspect(outer+'/?data='+encode('x='.repeat(4000))+'#'+Array.from({length:200},(_,i)=>'x='+i).join('&'));
 assert(r.stats.nodes<=E.LIMITS.nodes);assert(r.stats.text<=E.LIMITS.text);assert(r.limitations.length<=48);assert(r.candidates.length<=32);
});
await test('candidate serializations share the aggregate derived-text budget',()=>{const r=inspect(outer+'/?'+Array.from({length:20},(_,i)=>'x'+i+'=https://h'+i+'.test/'+ 'a'.repeat(1150)).join('&'));equal(r.status,'partial');assert(has(r,'text'));assert(r.stats.text<=E.LIMITS.text);});
await test('unpaired Unicode is never silently repaired into submitted-value evidence',()=>{const r=inspect(outer+'/?next=https://other.test/\ud800');equal(r.status,'partial');assert(has(r,'unicode'));assert(!addresses(r).some(c=>c.representation==='submitted'&&c.value.includes('\ud800')));});
await test('conflicting repeated values get scoped ambiguity evidence',()=>{const r=inspect(outer+'/?next=https://first.test&next=https://second.test');assert(addresses(r).every(c=>c.conflicting));equal(r.status,'complete');});
await test('no permissive punctuation repair',()=>{const r=inspect(outer+'/?next='+encode('see "https://other.test/a" now'));assert(r.candidates.some(c=>c.type==='url-like'));equal(addresses(r),[]);equal(r.status,'partial');});
t.group('DOM, exact-match visibility, disclosure and privacy');
const storage=new MemoryStorage(),a=mount({storage}),{$,w}=a;
await test('exact match never suppresses embedded off-host notice',()=>{
 a.inspect(outer+'/?next='+encode('https://other.test/reset?token=EMBEDDED_PRIVATE_SENTINEL'),'example.test');equal($('primaryTitle').textContent,'Exact hostname match');assert(!$('embeddedNotice').classList.contains('hidden'));assert($('embeddedNotice').textContent.includes('other.test'));assert($('embeddedNotice').textContent.includes('doesn’t show whether the website will redirect'));equal($('embeddedStatus').textContent,'Checks finished for supported formats.');
});
await test('private decoded evidence is absent until explicitly opened',async()=>{
 assert(!$('embeddedCandidates').textContent.includes('EMBEDDED_PRIVATE_SENTINEL'));assert(!$('embeddedCandidates').textContent.includes('next'));
 const reveal=$('embeddedCandidates').querySelector('details');assert(!reveal.open);reveal.open=true;await new Promise(r=>setTimeout(r,0));assert(reveal.textContent.includes('EMBEDDED_PRIVATE_SENTINEL'));assert(reveal.textContent.includes('Parameter name'));reveal.open=false;await new Promise(r=>setTimeout(r,0));assert(!reveal.textContent.includes('EMBEDDED_PRIVATE_SENTINEL'));
});
await test('reinspection clears old values, open states and partial notices',()=>{
 const reveal=$('embeddedCandidates').querySelector('details');reveal.open=true;a.inspect(outer+'/?q=ordinary#anchor');assert(!$('embeddedCandidates').textContent.includes('EMBEDDED_PRIVATE_SENTINEL'));equal($('embeddedCandidates').querySelectorAll('details[open]').length,0);equal($('embeddedStatus').textContent,'Checks finished for supported formats.');assert($('embeddedNotice').classList.contains('hidden'));assert($('embeddedCandidates').textContent.includes('No embedded web addresses found in the supported formats.'));
});
await test('saved exact match also retains supplemental notice',()=>{w.reviewImportText(JSON.stringify({application:'offline-url-inspector',schemaVersion:1,references:['example.test']}));$('applyImport').click();a.inspect(outer+'/?next=https://other.test');equal($('primaryTitle').textContent,'Exact reference hostname match');assert($('embeddedNotice').textContent.includes('other.test'));});
await test('partial and unsupported status are visible outside the diagnostic log',()=>{
 a.inspect(outer+'/?next=https%253A%25252F%25252Fother.test');equal($('embeddedStatus').textContent,'Some embedded-address checks are incomplete.');assert($('embeddedNotice').textContent.includes('incomplete'));
 a.inspect(outer+'/#qs=r-[opaque-data]');equal($('embeddedStatus').textContent,'Some embedded data couldn’t be interpreted.');equal($('embeddedNotice').dataset.tone,'information');assert($('embeddedNotice').textContent.includes('no demonstrated address meaning'));
 a.inspect('https://[');equal($('embeddedStatus').textContent,'Embedded-address checks unavailable.');assert($('embeddedNotice').textContent.includes('unavailable'));
});
await test('sensitive parameter names are concealed too',()=>{a.inspect(outer+'/?PRIVATE_PARAMETER_SENTINEL='+encode('https://other.test'));assert(!$('embeddedCandidates').textContent.includes('PRIVATE_PARAMETER_SENTINEL'));});
await test('revealed injected strings remain inert and no navigation targets exist',async()=>{
 a.inspect(outer+'/?next='+encode('https://other.test/<svg/onload=EMBEDDED_PRIVATE_SENTINEL>'));
 for(const reveal of $('embeddedCandidates').querySelectorAll('details'))reveal.open=true;await new Promise(r=>setTimeout(r,0));
 equal(w.document.querySelectorAll('a,img,svg,iframe,object,embed,form,link').length,0);equal(a.network,[]);assert(!w.EMBEDDED_PRIVATE_SENTINEL);
});
await test('inspection content never enters persistent references or exports',()=>{
 const saved=storage.writes.map(row=>row[1]).join('\n'),exported=w.testReferences.exportJSON();assert(!/EMBEDDED_PRIVATE_SENTINEL|PRIVATE_PARAMETER_SENTINEL|other\.test/.test(saved+exported));
});
await test('labels and layout use existing accessible native controls',()=>{equal($('embeddedNotice').closest('[role="status"]'),$('primary'));equal($('primary').getAttribute('aria-live'),'polite');equal($('primary').querySelectorAll('[aria-live]').length,0);assert($('embeddedDetails').querySelector('summary').textContent.includes('Embedded URLs'));assert(read('src/embedded.css').includes('overflow-wrap:anywhere'));assert(read('src/embedded.css').includes('unicode-bidi:isolate'));});
await test('candidate pagination is bounded and keyboard focus survives the final page',()=>{
 a.inspect(outer+'/?'+Array.from({length:12},(_,i)=>'x'+i+'=https://host'+i+'.test').join('&'));equal($('embeddedCandidates').querySelectorAll('article').length,5);assert($('embeddedCount').textContent.includes('Showing 5 of 12'));
 let more=$('embeddedCandidates').querySelector('button');more.focus();more.click();equal($('embeddedCandidates').querySelectorAll('article').length,10);more=$('embeddedCandidates').querySelector('button');more.focus();more.click();equal($('embeddedCandidates').querySelectorAll('article').length,12);equal(w.document.activeElement.tagName,'H3');assert(!$('embeddedCount').textContent.includes('Showing'));
});
await test('history, cache, worker messaging and logs receive no inspection data',()=>{
 const attempts=[];
 for(const method of ['pushState','replaceState'])w.history[method]=()=>{attempts.push(method);};
 Object.defineProperty(w.navigator,'serviceWorker',{value:{controller:{postMessage:()=>attempts.push('worker')}},configurable:true});
 Object.defineProperty(w,'caches',{value:{open:()=>attempts.push('cache'),match:()=>attempts.push('cache')},configurable:true});
 for(const method of ['log','warn','error','info','debug'])w.console[method]=()=>attempts.push('console');
 const before=storage.writes.length;a.inspect(outer+'/?next='+encode('https://other.test/a?token=NEW_PRIVATE_SENTINEL')+'#state=PRIVATE_STATE_SENTINEL','example.test');equal(attempts,[]);equal(a.network,[]);equal(storage.writes.length,before);equal(w.document.querySelectorAll('[href],[src],[action]').length,0);
});
await test('pure analyzer and renderer have no I/O, execution or navigation sinks',()=>{
 const source=read('src/embedded.js')+'\n'+read('src/embedded-ui.js');assert(!/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|\.innerHTML|insertAdjacentHTML|\beval\s*\(|new Function|localStorage|sessionStorage|history\.|\.href\s*=|window\.open|navigator\./.test(source));
});
await test('standalone and hosted contain identical supplemental modules with strict CSP',()=>{for(const edition of ['standalone','hosted']){for(const file of ['embedded.js','embedded-ui.js'])assert(html(edition).includes(read('src/'+file)));assert(html(edition).includes("connect-src 'none'"));assert(!html(edition).includes("'unsafe-eval'"));}assert(html().includes("worker-src 'none'"));});
await test('existing hostname engine, reference system and worker sources retain baseline identities',()=>{
 const pins=JSON.parse(read('tests/technical-baseline.json')).sourceFiles;
 for(const path of ['src/core.js','src/references.js','src/presentation.js','src/hosted.js','src/sw.js','data/unicode-data.json','deno.lock','.github/workflows/deploy-pages.yml'])equal(createHash('sha256').update(read(path)).digest('hex'),pins[path]);
});
t.group('approved editorial refinement');
const b=mount(),UI=b.w.testEmbeddedUI,get=b.$;
const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
const present=(url,expected='',references=[])=>{const r=inspect(url,expected,references);UI.render(r);return r;};
for(const [name,url,expected,references,required,absent]of [
 ['initial only','https://web.test/?next=https://vveb.test','',[],['vveb.test may look like web.test','the link’s hostname'],['your expected hostname','a saved reference domain']],
 ['expected only',outer+'/?next=https://vveb.test','web.test',[],['vveb.test may look like web.test','your expected hostname'],['a saved reference domain']],
 ['saved only',outer+'/?next=https://vveb.test','',['web.test'],['vveb.test may look like web.test','a saved reference domain'],['your expected hostname']],
 ['combined','https://web.test/?next=https://vveb.test','web.test',['web.test'],['the link’s hostname','your expected hostname','a saved reference domain'],[]]
])await test('summary attribution: '+name,()=>{const r=present(url,expected,references),text=get('embeddedSummary').textContent;assert(addresses(r).some(c=>c.comparisons.some(x=>x.visual)));for(const value of required)assert(text.includes(value),value);for(const value of absent)assert(!text.includes(value),value);});
await test('different comparison targets are never combined',()=>{
 present('https://web.test/?a=https://vveb.test&b=https://arnazon.test','web.test',['amazon.test']);const text=get('embeddedSummary').textContent;assert(text.includes('vveb.test may look like web.test (the link’s hostname and your expected hostname)'));assert(text.includes('arnazon.test may look like amazon.test (a saved reference domain)'));
});
await test('representative finding names both hosts before Technical Details',()=>{
 b.inspect(outer+'/?next='+encode('https://other.test'),'example.test');equal(get('primaryTitle').textContent,'Exact hostname match');equal(get('embeddedTitle').textContent,'Another web address found');assert(get('embeddedSummary').textContent.includes('other.test, a different hostname from example.test'));assert(!get('advanced').open);assert(get('primary').contains(get('embeddedNotice')));assert(!get('primary').contains(get('embeddedDetails')));assert(!get('embeddedRedirect').classList.contains('hidden'));equal(get('embeddedNotice').dataset.tone,'information');
});
await test('initial mismatch survives an embedded expected-hostname match',()=>{
 b.inspect(outer+'/?next=https://web.test','web.test');equal(get('primaryTitle').textContent,'Hostname mismatch');const text=get('embeddedCandidates').textContent;assert(text.includes('Expected hostnameMatches web.test.'));assert(text.includes('Link hostnameDifferent from example.test.'));assert(!text.includes('Link and expected hostname'));
});
await test('identical initial and expected targets combine only ordinary rows',async()=>{
 present(outer+'/?next=https://other.test','example.test',['other.test']);let text=get('embeddedCandidates').textContent;assert(text.includes('Link and expected hostnameDifferent from example.test.'));assert(!text.includes('Strict percent decoding'));assert(!text.includes('Effective port'));const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();text=reveal.textContent;for(const source of ['Initial hostname','Expected hostname','Saved reference'])assert(text.includes(source));assert(text.includes('Effective port443'));
});
await test('same-host embedded address stays informational without a companion warning',()=>{
 const r=present(outer+'/?next='+encode(outer+'/account'),'example.test');equal(r.status,'complete');assert(get('embeddedNotice').classList.contains('hidden'));equal(get('embeddedCount').textContent,'1 embedded web address found.');assert(get('embeddedCandidates').textContent.includes('Matches example.test.'));
});
await test('different schemes and ports stay separate from hostname equality',async()=>{
 present(outer+'/?next='+encode('http://example.test:8080/path'),'example.test');assert(get('embeddedCandidates').textContent.includes('Hostname equality is a separate check.'));assert(get('embeddedNotice').classList.contains('hidden'));const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();assert(reveal.textContent.includes('Schemehttp:'));assert(reveal.textContent.includes('Effective port8080'));
});
await test('mixed entry types have distinct labels and no destination count',()=>{
 present(outer+'/?a='+encode('https://other.test')+'&b='+encode('/account')+'&c='+encode('//host.test/a')+'&d='+encode('see https://maybe.test now')+'&e='+encode('mailto:person@host.test'));
 const text=get('embeddedCount').textContent;for(const value of ['1 embedded web address entry','1 relative reference','1 address without a scheme','1 possible web address','1 other-scheme entry'])assert(text.includes(value),text);assert(!text.includes('destination'));assert(!get('embeddedCandidates').textContent.includes('person@host.test'));
});
await test('repeated complete addresses count source occurrences and hostnames separately',()=>{
 present(outer+'/?next=https://other.test&next=https://other.test');const text=get('embeddedCount').textContent;assert(text.includes('2 embedded web address entries'));assert(text.includes('2 source occurrences and 1 distinct hostname'));assert(!text.includes('2 distinct'));assert(!get('embeddedSummary').textContent.includes('Which value'));
});
await test('different interpretations of one source do not become separate source occurrences',()=>{
 const r=present(outer+'/out/https://other.test/../removed');const addresses=r.candidates.filter(c=>c.type==='absolute');assert(addresses.length>1);const before=JSON.stringify(r);UI.summary(r);UI.render(r);equal(JSON.stringify(r),before);assert(get('embeddedCount').textContent.includes('source occurrence'));
});
for(const [type,value,label]of [['relative','/account','1 relative reference'],['protocol-relative','//host.test/a','1 address without a scheme'],['url-like','see https://host.test now','1 possible web address'],['unsupported-scheme','mailto:person@host.test','1 other-scheme entry']])await test('singular count for '+type,()=>{present(outer+'/?next='+encode(value));assert(get('embeddedCount').textContent.startsWith(label));assert(!get('embeddedCount').textContent.includes('1 embedded web address found'));});
for(const url of [outer+'/?amount=12&currency=USD',outer+'/?q=hello%20world',outer+'/#ordinary-anchor'])await test('quiet benign result: '+url,()=>{const r=present(url);equal(r.status,'complete');equal(get('embeddedCount').textContent,'');assert(get('embeddedNotice').classList.contains('hidden'));assert(get('embeddedCandidates').textContent.includes('No embedded web addresses found in the supported formats.'));});
await test('OAuth navigation names remain neutral and private',()=>{present(outer+'/?redirect_uri='+encode('https://client.test/callback?token=EDITORIAL_PRIVATE'));equal(get('embeddedNotice').dataset.tone,'information');assert(!get('embeddedNotice').textContent.includes('EDITORIAL_PRIVATE'));assert(!get('embeddedCandidates').textContent.includes('redirect_uri'));assert(!get('embeddedCandidates').textContent.includes('navigation-related pattern'));});
await test('opaque unsupported data has neutral, non-speculative ordinary coverage',()=>{
 const r=present(outer+'/#qs=r-[opaque-data]');equal(r.status,'unsupported');equal(get('embeddedStatus').textContent,'Some embedded data couldn’t be interpreted.');equal(get('embeddedNotice').dataset.tone,'information');assert(get('embeddedCoverage').textContent.includes('no demonstrated address meaning'));assert(!get('embeddedNotice').textContent.includes('Base64'));assert(!get('embeddedCoverageDetails').open);for(const value of ['Base64URL','JSON','proprietary','Server responses','Relative addresses'])assert(get('embeddedCoverageDetails').textContent.includes(value),value);
});
await test('partial and unsupported explanations coexist visibly',()=>{
 const r=present(outer+'/?q=%FF#qs=opaque');equal(r.status,'partial');assert(r.limitations.some(l=>l.kind==='unsupported'));assert(get('embeddedNotice').textContent.includes('incomplete'));assert(get('embeddedCoverage').textContent.includes('URL-encoded text'));assert(get('embeddedCoverage').textContent.includes('no demonstrated address meaning'));assert(!get('embeddedNotice').classList.contains('hidden'));assert(get('embeddedLimitDetails').textContent.includes('UTF-8'));
});
await test('visual unavailability is not described as encoded-payload failure',()=>{
 const r=present(outer+'/?next='+encode('https://مثال.test'),'example.test');equal(r.status,'unsupported');equal(get('embeddedStatus').textContent,'Some embedded comparisons aren’t available.');assert(get('embeddedCoverage').textContent.includes('Visual resemblance couldn’t be checked'));assert(!get('embeddedNotice').textContent.includes('data couldn’t be interpreted'));assert(get('embeddedCandidates').textContent.includes('doesn’t rule out a lookalike'));
});
await test('unavailable supplemental state does not invent a successful top-level result',()=>{b.inspect('https://[');equal(get('primaryTitle').textContent,'Unable to read this URL');equal(get('embeddedStatus').textContent,'Embedded-address checks unavailable.');assert(get('embeddedCoverage').textContent.includes('reliably identified original hostname'));});
await test('processing failure is distinct from invalid input',()=>{
 const r=E.unavailable();r.limitations=[{kind:'unavailable',code:'processing'}];UI.render(r);assert(get('embeddedCoverage').textContent.includes('couldn’t be completed'));assert(!get('embeddedCoverage').textContent.includes('reliably identified'));
});
await test('actual resource limits remain partial and are explained beside results',()=>{
 const r=inspect(outer+'/?'+Array.from({length:40},(_,i)=>'x'+i+'=https://host'+i+'.test').join('&'));equal(r.status,'partial');UI.render(r);assert(get('embeddedNotice').textContent.includes('incomplete'));assert(get('embeddedLimitations').textContent.length>0);assert(!get('embeddedNotice').classList.contains('hidden'));assert(get('embeddedLimitDetails').textContent.includes('limit'));
});
await test('bounded multi-host summary uses one natural list and keeps a singular remainder',()=>{
 present(outer+'/?'+Array.from({length:4},(_,i)=>'x'+i+'=https://host'+i+'.test').join('&'));
 const text=get('embeddedSummary').textContent;assert(text.includes('host0.test, host1.test, host2.test and 1 more hostname.'));assert(!text.includes('host1.test and host2.test and'));
});
await test('candidate final page has singular grammar and focused new heading',()=>{
 present(outer+'/?'+Array.from({length:6},(_,i)=>'x'+i+'=https://host'+i+'.test').join('&'));const more=get('embeddedCandidates').querySelector('button');equal(more.textContent,'Show 1 more entry');more.focus();more.click();equal(b.w.document.activeElement.textContent,'host5.test');assert(!get('embeddedCandidates').querySelector('button'));assert(!get('embeddedCount').textContent.includes('Showing'));
});
await test('pagination never steals unrelated focus',()=>{
 present(outer+'/?'+Array.from({length:6},(_,i)=>'x'+i+'=https://host'+i+'.test').join('&'));get('expected').focus();get('embeddedCandidates').querySelector('button').click();equal(b.w.document.activeElement,get('expected'));
});
await test('saved-comparison final page has singular grammar and focused new evidence',async()=>{
 present(outer+'/?next=https://root.test','',Array.from({length:14},(_,i)=>'r'+i+'.root.test'));const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();const detail=reveal.querySelector('.embedded-comparisons');assert(detail);detail.open=true;await pause();const more=detail.querySelector('button');equal(more.textContent,'Show 1 more comparison');assert(more.getAttribute('aria-label').includes('root.test'));more.focus();more.click();assert(b.w.document.activeElement.classList.contains('embedded-comparison'));assert(b.w.document.activeElement.textContent.includes('r13.root.test'));assert(!detail.querySelector('button'));
});
await test('saved-comparison middle page retains button focus and bounded rendering',async()=>{
 present(outer+'/?next=https://root.test','',Array.from({length:26},(_,i)=>'r'+i+'.root.test'));const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();const detail=reveal.querySelector('.embedded-comparisons');detail.open=true;await pause();equal(detail.querySelectorAll('.embedded-comparison').length,10);let more=detail.querySelector('button');more.focus();more.click();equal(detail.querySelectorAll('.embedded-comparison').length,20);equal(b.w.document.activeElement,more);equal(more.textContent,'Show 3 more comparisons');more.click();equal(detail.querySelectorAll('.embedded-comparison').length,23);assert(!detail.querySelector('button'));
});
await test('private source and parameter distinctions exist only after reveal',async()=>{
 const r=present(outer+'/?PRIV%41TE_PARAMETER='+encode('https://other.test/a?token=EDITORIAL_PRIVATE'));const before=JSON.stringify(r);assert(!get('primary').textContent.includes('EDITORIAL_PRIVATE'));assert(!get('embeddedCandidates').textContent.includes('PRIVATE_PARAMETER'));const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();for(const value of ['PRIV%41TE_PARAMETER','PRIVATE_PARAMETER','EDITORIAL_PRIVATE','Equals separatorPresent','Strict percent decoding, layer 1'])assert(reveal.textContent.includes(value),value);equal(JSON.stringify(r),before);reveal.open=false;await pause();assert(!reveal.textContent.includes('EDITORIAL_PRIVATE'));equal(reveal.querySelector('.category-body').children.length,0);
});
await test('closing an outer disclosure also removes revealed private evidence',async()=>{
 present(outer+'/?next='+encode('https://other.test/a?token=EDITORIAL_PRIVATE'));get('embeddedView').click();await pause();const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();assert(reveal.textContent.includes('EDITORIAL_PRIVATE'));get('embeddedDetails').open=false;await pause();assert(!reveal.open);assert(!reveal.textContent.includes('EDITORIAL_PRIVATE'));
});
await test('details action opens the right disclosures and focuses their summary',()=>{present(outer+'/?next=https://other.test');get('embeddedView').click();assert(get('advanced').open);assert(get('embeddedDetails').open);equal(b.w.document.activeElement,get('embeddedDetails').querySelector('summary'));equal(get('embeddedView').getAttribute('aria-controls'),'embeddedDetails');});
await test('result announcement order is initial then supplemental, with evidence outside',()=>{
 const primary=get('primary');equal(primary.getAttribute('role'),'status');equal(primary.getAttribute('aria-atomic'),'true');assert(primary.querySelector('#primaryTitle').compareDocumentPosition(get('embeddedTitle'))&b.w.Node.DOCUMENT_POSITION_FOLLOWING);equal(primary.querySelectorAll('[aria-live]').length,0);assert(!get('embeddedCandidates').closest('[aria-live]'));assert(!get('embeddedLimitDetails').closest('[aria-live]'));
});
await test('reinspection resets global coverage, private evidence and companion finding',async()=>{
 present(outer+'/?next='+encode('https://other.test/?secret=EDITORIAL_PRIVATE'));get('embeddedCoverageDetails').open=true;const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();present(outer+'/#section');assert(!get('embeddedCoverageDetails').open);assert(!get('embeddedDetails').open);assert(!get('embeddedCandidates').textContent.includes('EDITORIAL_PRIVATE'));assert(get('embeddedNotice').classList.contains('hidden'));equal(get('embeddedCoverage').textContent,'');
});
await test('both editions have the refined companion and complete coverage disclosure',()=>{for(const edition of ['standalone','hosted']){const source=html(edition);for(const value of ['id="embeddedTitle"','id="embeddedView"','id="embeddedCoverageDetails"','Base64URL','Embedded URLs &amp; Redirect Clues'])assert(source.includes(value));}});
await test('hostname validation cautions remain visible before forensic evidence',()=>{
 present(outer+'/?next='+encode('https://bad_name.test'));assert(get('embeddedCandidates').textContent.includes('doesn’t follow standard DNS naming rules'));assert(!get('embeddedCandidates').querySelector('.embedded-reveal').open);
});
await test('literal plus and form-style processing remain distinguishable in evidence',async()=>{
 present(outer+'/?next=https://other.test/a+b');const reveals=await get('embeddedCandidates').querySelectorAll('.embedded-reveal');for(const reveal of reveals)reveal.open=true;await pause();const text=get('embeddedCandidates').textContent;assert(text.includes('https://other.test/a+b'));assert(text.includes('Form-style percent decoding (+ treated as space)'));assert(text.includes('Possible address; boundaries uncertain.'));
});
await test('the approved pass changes neither extraction nor established core fixtures',()=>{
 equal(createHash('sha256').update(read('src/embedded.js')).digest('hex'),'559087c3bf043755c98b8e687676767784e58f80a89e385f9701279db8c42c27');
 for(const path of ['tests/cases.json','tests/ascii-cases.json'])equal(createHash('sha256').update(read(path)).digest('hex'),JSON.parse(read('tests/editorial-baseline.json')).fixtureSHA256[path]);
});
t.group('targeted hostname highlight and @ clarity');
const highlighted=()=>[...get('embeddedSummary').querySelectorAll('.embedded-recovered-host')].map(node=>node.textContent);
await test('single recovered hostname is highlighted without styling the comparison target',()=>{
 b.inspect(outer+'/?next='+encode('https://other.test'),'example.test');equal(highlighted(),['other.test']);equal(get('primaryTitle').textContent,'Exact hostname match');equal(get('embeddedNotice').dataset.tone,'information');assert(get('embeddedSummary').textContent.includes('other.test, a different hostname from example.test.'));equal(get('embeddedSummary').querySelectorAll('a,button,[role],[tabindex],[href]').length,0);
});
await test('encoded @ deception highlights only the actual embedded hostname',()=>{
 b.inspect(outer+'/?next='+encode('https://example.test@attacker.test/login'),'example.test');equal(highlighted(),['attacker.test']);equal(get('primaryTitle').textContent,'Exact hostname match');equal(get('embeddedNotice').dataset.tone,'caution');assert(get('embeddedSummary').textContent.includes('The text before @ is not the website’s hostname.'));assert(!/sign-in|username|password|credential/i.test(get('embeddedSummary').textContent));assert(!get('embeddedCandidates').textContent.includes('Sign-in text'));assert(!get('embeddedCandidates').textContent.includes('example.test@attacker.test'));assert(!get('embeddedRedirect').classList.contains('hidden'));
});
await test('raw sensitive userinfo stays concealed until explicit evidence reveal',async()=>{
 present(outer+'/?next='+encode('https://PRIVATE_USERINFO:PRIVATE_SECRET@attacker.test/private?token=PRIVATE_TOKEN'),'example.test');equal(highlighted(),['attacker.test']);for(const value of ['PRIVATE_USERINFO','PRIVATE_SECRET','PRIVATE_TOKEN']){assert(!get('primary').textContent.includes(value));assert(!get('embeddedCandidates').textContent.includes(value));}const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();assert(reveal.textContent.includes('PRIVATE_USERINFO:PRIVATE_SECRET@attacker.test'));reveal.open=false;await pause();assert(!reveal.textContent.includes('PRIVATE_USERINFO'));
});
await test('same-host userinfo still names its hostname without inventing a mismatch',()=>{
 b.inspect(outer+'/?next='+encode('https://PRIVATE_USERINFO@example.test/login'),'example.test');equal(highlighted(),['example.test']);equal(get('primaryTitle').textContent,'Exact hostname match');assert(get('embeddedSummary').textContent.includes('An address with that structure uses the hostname example.test.'));assert(!get('embeddedSummary').textContent.includes('different hostname'));assert(!get('primary').textContent.includes('PRIVATE_USERINFO'));
});
await test('all displayed distinct recovered hosts receive the same bounded treatment',()=>{
 present(outer+'/?'+Array.from({length:5},(_,i)=>'x'+i+'=https://host'+i+'.test').join('&'));equal(highlighted(),['host0.test','host1.test','host2.test']);assert(get('embeddedSummary').textContent.includes('and 2 more hostnames.'));assert(get('embeddedCount').textContent.includes('5 embedded web address entries'));equal(get('embeddedCandidates').querySelectorAll('article').length,5);
});
await test('repeated occurrences of a hostname produce one main highlight',()=>{
 present(outer+'/?a=https://other.test&b=https://other.test');equal(highlighted(),['other.test']);assert(get('embeddedCount').textContent.includes('2 source occurrences and 1 distinct hostname'));
});
await test('multiple userinfo hosts are named without selecting a presumed destination',()=>{
 present(outer+'/?a='+encode('https://PRIVATE_ONE@first.test')+'&b='+encode('https://PRIVATE_TWO@second.test'));equal(highlighted(),['first.test','second.test']);assert(!get('primary').textContent.includes('PRIVATE_'));assert(get('embeddedSummary').textContent.includes('The text before @ is not the website’s hostname.'));assert(!/final destination|confirmed redirect/i.test(get('embeddedSummary').textContent));
});
await test('an additional same-host userinfo address is identified with its reason',()=>{
 present(outer+'/?a=https://other.test&b='+encode('https://PRIVATE_USERINFO@example.test'));equal(highlighted(),['other.test','example.test']);assert(get('embeddedSummary').textContent.includes('An address with that structure uses the hostname example.test.'));assert(!get('primary').textContent.includes('PRIVATE_USERINFO'));
});
await test('the embedded expected match does not replace the original mismatch',()=>{
 b.inspect(outer+'/?next=https://web.test','web.test');equal(highlighted(),['web.test']);equal(get('primaryTitle').textContent,'Hostname mismatch');assert(get('embeddedCandidates').textContent.includes('Expected hostnameMatches web.test.'));assert(get('embeddedSummary').textContent.includes('different hostname from example.test'));
});
await test('visual comparison highlights the recovered host, not the saved target',()=>{
 present(outer+'/?next=https://vveb.test','',['web.test']);equal(highlighted(),['vveb.test','vveb.test']);assert(get('embeddedSummary').textContent.includes('web.test (a saved reference domain)'));assert(!highlighted().includes('web.test'));
});
for(const [name,value]of [['relative','/account'],['scheme-free','//other.test/path'],['uncertain','see https://other.test now']])await test('no reliable-host highlight for '+name,()=>{present(outer+'/?next='+encode(value));equal(highlighted(),[]);assert(!get('embeddedSummary').querySelector('a'));});
await test('unavailable visual checks retain their qualified hostname and state',()=>{
 const r=present(outer+'/?next='+encode('https://مثال.test'),'example.test');equal(highlighted(),[r.candidates[0].hostname]);equal(get('embeddedStatus').dataset.state,'unsupported');assert(get('embeddedCoverage').textContent.includes('Visual resemblance couldn’t be checked'));
});
await test('an unreliable recovered hostname is never promoted by the highlight',()=>{
 const r=inspect('https://vveb.test/?next=https://vveb.test','web.test');UI.render(r);assert(highlighted().includes('vveb.test'));const copy=JSON.parse(JSON.stringify(r));copy.candidates[0].original.reliable=false;const before=JSON.stringify(copy),words=get('embeddedSummary').textContent;UI.render(copy);equal(get('embeddedSummary').textContent,words);equal(highlighted(),[]);equal(JSON.stringify(copy),before);
});
await test('hostname tokens never highlight ordinary words that share their spelling',()=>{
 present(outer+'/?next=https://a');equal(highlighted(),['a']);equal(get('embeddedSummary').querySelectorAll('.embedded-recovered-host').length,1);assert(get('embeddedSummary').textContent.includes('a web address for a,'));
});
await test('highlighted values stay inert even if a presentation record is malformed',()=>{
 const r=inspect(outer+'/?next=https://other.test');r.candidates[0].hostname='<img src=x onerror=HIGHLIGHT_INJECTION>';UI.render(r);equal(highlighted(),['<img src=x onerror=HIGHLIGHT_INJECTION>']);equal(get('embeddedSummary').querySelectorAll('img,svg,a,iframe,[href],[src]').length,0);assert(!b.w.HIGHLIGHT_INJECTION);
});
await test('long hostname styling wraps without adding interactive affordances',()=>{
 const hostname='a'.repeat(60)+'.'+'b'.repeat(60)+'.'+'c'.repeat(60)+'.test';present(outer+'/?next='+encode('https://'+hostname));equal(highlighted(),[hostname]);const css=read('src/embedded.css'),rule=css.match(/#embeddedSummary \.embedded-recovered-host\{([^}]+)\}/)[1];for(const value of ['font-family:var(--mono)','font-weight:600','color:var(--hover)','background:var(--panel-raised)','white-space:normal','overflow-wrap:anywhere','unicode-bidi:isolate'])assert(rule.includes(value),value);assert(!css.includes('.embedded-recovered-host:hover'));assert(!rule.includes('cursor:pointer'));
});
await test('highlight text stays in the existing announcement and out of keyboard order',()=>{
 present(outer+'/?next=https://other.test');const span=get('embeddedSummary').querySelector('.embedded-recovered-host');equal(span.tagName,'SPAN');equal(span.closest('[aria-live]'),get('primary'));assert(!span.hasAttribute('aria-label'));assert(!span.hasAttribute('role'));assert(!span.hasAttribute('tabindex'));get('embeddedView').click();equal(b.w.document.activeElement,get('embeddedDetails').querySelector('summary'));
});
await test('unchanged summaries keep their existing text nodes',()=>{
 const r=inspect(outer+'/?next=https://other.test');UI.render(r);const span=get('embeddedSummary').querySelector('.embedded-recovered-host');UI.render(r);equal(get('embeddedSummary').querySelector('.embedded-recovered-host'),span);
});
await test('reinspection removes stale highlights and exposed values',async()=>{
 present(outer+'/?next='+encode('https://PRIVATE_USERINFO@attacker.test/?token=PRIVATE_TOKEN'));const reveal=get('embeddedCandidates').querySelector('.embedded-reveal');reveal.open=true;await pause();present(outer+'/#section');equal(highlighted(),[]);assert(get('embeddedNotice').classList.contains('hidden'));assert(!get('embeddedCandidates').textContent.includes('PRIVATE_TOKEN'));equal(get('embeddedCandidates').querySelectorAll('.embedded-reveal[open]').length,0);
});
await b.close();
await a.close();
t.finish({scope:'Unit and simulated DOM; synthetic reserved domains only. No actual browser or runtime redirect verification.'});
