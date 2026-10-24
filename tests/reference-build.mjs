// Execute trusted preview bundles with the existing cached test dependency.
import {Window} from 'npm:happy-dom@20.8.4';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {read,suite,MemoryStorage} from './harness.mjs';
const t=suite('Stage 2 preview inspection and privacy preservation','reference-preview-results.json'),{test,assert,equal}=t;
const cases=[...JSON.parse(read('tests/cases.json')),...JSON.parse(read('tests/ascii-cases.json'))];
for(const edition of ['standalone','hosted']){
 const source=readFileSync(resolve(Deno.args[0],edition==='standalone'?'standalone/Offline_URL_Inspector.html':'site/index.html'),'utf8'),storage=new MemoryStorage(),network=[];
 const w=new Window({url:edition==='standalone'?'file:///offline-url-inspector-stage2.html':'https://example.invalid/offline-url-inspector/',settings:{enableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableIframePageLoading:true}});
 Object.defineProperty(w,'localStorage',{value:storage});w.TextEncoder=TextEncoder;
 for(const name of ['fetch','open'])w[name]=(...args)=>{network.push([name,...args.map(String)]);throw Error('Destination I/O prohibited');};
 for(const name of ['XMLHttpRequest','WebSocket','EventSource','Worker'])w[name]=class{constructor(){network.push([name]);throw Error('Destination I/O prohibited');}};
 w.document.write(source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const [,attributes,text]of source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g))if(attributes.includes('application/json')){const tag=w.document.createElement('script');tag.type='application/json';tag.id=/id="([^"]+)"/.exec(attributes)[1];tag.textContent=text;w.document.body.append(tag);}
 w.eval(source.match(/<script>([\s\S]*?)<\/script>/)[1]+'\nwindow.stage2Inspector=Inspector;window.stage2References=ReferenceDomains;window.stage2Store=referenceStore;window.stage2Loader=ReferenceData;');
 // Compare in the same realm: native URL error prose differs between Deno and
 // Happy DOM. Preserve complete objects without normalizing any error fields.
 const baseline=w.eval('(()=>{'+read('src/core.js')+'\n'+read('src/references.js')+'\nreturn {Inspector,ReferenceDomains};})()');
 const $=id=>w.document.getElementById(id);
 t.group(edition+' complete result preservation');
 for(const c of cases)await test(c.name,()=>{
  const result=w.stage2Inspector.inspect(c.url,c.expected||'');equal(result,baseline.Inspector.inspect(c.url,c.expected||''));
  equal(w.stage2References.compare(result,['amazon.com','paypal.com','localhost']),baseline.ReferenceDomains.compare(result,['amazon.com','paypal.com','localhost']));
 });
 t.group(edition+' UI and private state');
 await test('no automatic feature activated and no data fetch/navigation',()=>{equal(JSON.parse($('reference-manifest').textContent).automaticMatchingAvailable,false);equal(network,[]);equal(storage.writes,[]);assert(!w.document.querySelector('a[href],img[src],iframe,form[action]'));assert(!$('results').textContent.includes('Built-in reference'));});
 await test('manual inspection still renders original result and conceals embedded data',()=>{
  $('link').value='https://example.com/?next=https%3A%2F%2FPRIVATE_USER%3APRIVATE_SECRET%40other.com%2F%3Ftoken%3DPRIVATE_TOKEN';$('expected').value='example.com';$('inspect').click();
  equal($('primaryTitle').textContent,'Exact hostname match');assert($('embeddedSummary').textContent.includes('other.com'));assert(!$('embeddedCandidates').textContent.includes('PRIVATE_'));assert(!$('primary').textContent.includes('PRIVATE_'));equal(network,[]);assert(!storage.writes.map(r=>r[1]).join('').includes('PRIVATE_'));equal(JSON.parse(w.stage2Store.exportJSON()),{application:'offline-url-inspector',schemaVersion:1,references:[]});
 });
 await w.happyDOM.close();
}
t.finish({scope:'Actual trusted preview code in simulated Happy DOM; no layout, native browser, WebCrypto file-policy or Firefox claim.'});
