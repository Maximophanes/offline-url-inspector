// Focused Reference Domains acceptance; actual layout is reviewed in browser separately.
import {read,html,suite,modules,MemoryStorage,functionalSource} from './harness.mjs';
import {mount} from './dom-support.mjs';
import {createHash} from 'node:crypto';
const t=suite('V3.1.2 focused Reference Domains presentation','reference-interface-results.json'),{test,assert,equal}=t;
const {ReferenceDomains:R,Presentation:P}=modules(),key=R.KEY,record=references=>JSON.stringify({application:R.APPLICATION,schemaVersion:1,references});
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
async function withApp(fn,options){const a=mount(options);try{await fn(a);}finally{await a.close();}}
const add=(a,value)=>{a.$('referenceInput').value=value;a.$('saveReference').click();};
const hidden=(a,id)=>a.$(id).classList.contains('hidden');
await test('approved cohesive introduction, parent help and internal storage diagnostics retained',()=>withApp(a=>{
 equal(a.$('referencePanel').querySelector('.reference-description').textContent,"Save hostnames to compare with URLs you inspect. A match doesn't verify that a website is safe.");
 assert(a.$('storageStatus').closest('.reference-intro'));assert(!a.$('storageDetail'));assert(!a.$('referencePanel').textContent.includes('Technical storage status'));assert(a.$('referencePanel').textContent.includes('Storage & hostname help'));assert(a.w.testReferences.snapshot().status.includes('saving is verified'));equal(a.storage.writes,[]);
}));
for(const [value,expected]of [['','Enter a hostname, such as example.com.'],['  ','Enter a hostname, such as example.com.'],['a'.repeat(2049),'The hostname exceeds the 2,048-character limit.']])await test('distinct field validation: '+(value.length>10?'overlength':JSON.stringify(value)),()=>withApp(a=>{
 add(a,value);equal(a.$('referenceError').textContent,'Error: '+expected);equal(a.$('referenceInput').getAttribute('aria-invalid'),'true');assert(hidden(a,'referenceErrorDetails'));assert(a.$('referenceErrorRaw').textContent.includes('2,048'));equal(a.storage.writes,[]);equal(a.w.testReferences.snapshot().references,[]);
}));
for(const version of [0,1])for(const [value,expected]of [['','Enter a hostname, such as example.com.'],['a'.repeat(2049),'The hostname exceeds the 2,048-character limit.'],[null,'Enter a hostname as text, such as example.com.']])await test('import schema '+version+' validation: '+(typeof value==='string'?(value.length>10?'overlength':'empty'):'non-string'),()=>withApp(a=>{
 add(a,'example.com');const old=a.storage.getItem(key),data={application:R.APPLICATION,schemaVersion:version,[version?'references':'domains']:['valid.invalid',value]};a.w.reviewImportText(JSON.stringify(data));
 equal(a.$('backupStatus').textContent,'Error: Reference 2: '+expected);assert(hidden(a,'importReview'));assert(hidden(a,'backupErrorDetails'));assert(a.$('backupErrorRaw').textContent.startsWith('Entry 2:'));equal(a.storage.getItem(key),old);
}));
await test('validator rejects the same types and length boundaries without changing its source',()=>{
 const pin=JSON.parse(read('tests/interface-baseline.json')).sourceFiles['src/references.js'];equal(createHash('sha256').update(read('src/references.js')).digest('hex'),pin);
 for(const value of ['',null,23,'a'.repeat(2049),'example.com/path']){let failed=false;try{R.normalize(value);}catch{failed=true;}assert(failed);}
 equal(R.normalize('EXAMPLE.COM.'),'example.com');equal(R.normalize('example.com'+' '.repeat(2037)),'example.com');equal(R.SCHEMA,1);equal(R.KEY,'offline-url-inspector:reference-domains');
});
await test('duplicate and malformed errors suppress repeated details but retain underlying errors',()=>withApp(a=>{
 add(a,'example.com');const old=a.storage.getItem(key);
 for(const value of ['EXAMPLE.COM.','example.com/path']){add(a,value);equal(a.$('referenceError').dataset.tone,'error');assert(hidden(a,'referenceErrorDetails'));assert(a.$('referenceErrorRaw').textContent.length>10);equal(a.storage.getItem(key),old);}
}));
await test('unknown or specific technical failures remain available',()=>{
 assert(P.referenceErrorHasDetails('QuotaExceededError: export object URL allocation failed'));assert(P.referenceErrorHasDetails('Reference file is not valid JSON. Additional parser context: line 7'));assert(P.referenceErrorHasDetails('Each reference must be a nonempty hostname (at most 2,048 input characters). Additional context.'));
 assert(P.referenceErrorHasDetails('Entry 3: Punycode validation failed for xn--invalid'));
 assert(!P.referenceErrorHasDetails('Entry 3: Reference file is not valid JSON.'));
});
await test('readable, loaded, verified write, session-only, failed and protected statuses stay distinct',async()=>{
 await withApp(a=>{assert(a.$('storageStatus').textContent.includes("hasn't been checked"));add(a,'example.com');equal(a.$('storageStatus').textContent,'Saved in this browser');equal(a.$('storageStatus').dataset.tone,'success');});
 const data=new MemoryStorage();data.setItem(key,record(['example.com']));const n=data.writes.length;
 await withApp(a=>{equal(a.$('storageStatus').textContent,'Previously saved references loaded.');equal(data.writes.length,n);equal(a.$('storageStatus').dataset.tone,'information');},{storage:data});
 const unavailable=new MemoryStorage();unavailable.failRead=true;await withApp(a=>{add(a,'example.com');assert(a.$('storageStatus').textContent.startsWith('Storage unavailable'));assert(a.$('referenceError').textContent.startsWith('Caution:'));equal(unavailable.writes,[]);},{storage:unavailable});
 const failed=new MemoryStorage();failed.setItem(key,record(['old.invalid']));const old=failed.getItem(key);failed.failWrite=true;await withApp(a=>{add(a,'new.invalid');assert(a.$('storageStatus').textContent.startsWith('Saving failed'));equal(failed.getItem(key),old);assert(a.$('referenceError').textContent.includes('only in this tab'));},{storage:failed});
 const protectedData=new MemoryStorage();protectedData.setItem(key,'unsupported');await withApp(a=>{add(a,'new.invalid');equal(protectedData.getItem(key),'unsupported');assert(a.$('protectedStorageHelp').textContent.includes('cannot preserve unreadable'));assert(a.w.testReferences.snapshot().status.includes('untouched'));},{storage:protectedData});
});
await test('add, edit, remove and clear consent preserve actual list and keyboard behavior',()=>withApp(async a=>{
 add(a,'one.invalid');add(a,'two.invalid');equal(a.w.testReferences.snapshot().references,['one.invalid','two.invalid']);
 a.$('referenceList').querySelector('button').click();equal(a.w.document.activeElement,a.$('referenceInput'));a.$('referenceInput').value='edited.invalid';a.$('referenceInput').dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));equal(a.w.testReferences.snapshot().references,['edited.invalid','two.invalid']);
 a.$('referenceList').querySelectorAll('button')[1].click();equal(a.w.testReferences.snapshot().references,['two.invalid']);
 a.$('clearReferences').click();assert(a.$('confirmDialog').open);equal(a.w.document.activeElement,a.$('confirmCancel'));a.$('confirmCancel').click();await settle();equal(a.w.testReferences.snapshot().references,['two.invalid']);
 a.$('clearReferences').click();a.$('confirmProceed').click();await settle();equal(a.w.testReferences.snapshot().references,[]);equal(a.$('backupStatus').textContent,'Success: Reference list cleared.');
}));
await test('export success retains schema/filename; failure retains useful technical context',()=>withApp(async a=>{
 add(a,'example.com');let blob,filename;a.w.URL.createObjectURL=b=>{blob=b;return 'blob:reference-fixture';};a.w.URL.revokeObjectURL=()=>{};a.w.HTMLAnchorElement.prototype.click=function(){filename=this.download;};a.$('exportReferences').click();equal(filename,'offline-url-inspector-references.json');equal(JSON.parse(await blob.text()),JSON.parse(record(['example.com'])));assert(a.$('backupStatus').textContent.includes('download prepared'));
 a.w.URL.createObjectURL=()=>{throw Error('Controlled object URL allocation failure');};a.$('exportReferences').click();assert(a.$('backupStatus').textContent.startsWith('Error:'));assert(!hidden(a,'backupErrorDetails'));equal(a.$('backupErrorRaw').textContent,'Controlled object URL allocation failure');
}));
await test('import preview/cancel and reviewed replacement retain safeguards',()=>withApp(async a=>{
 add(a,'old.invalid');const old=a.storage.getItem(key);a.w.reviewImportText(record(['new.invalid']));assert(!hidden(a,'importReview'));assert(a.$('importChanges').textContent.includes('new.invalid'));equal(a.storage.getItem(key),old);a.$('cancelImport').click();equal(a.storage.getItem(key),old);
 a.w.reviewImportText(record(['new.invalid']));a.$('importReplace').checked=true;a.$('importReplace').dispatchEvent(new a.w.Event('change'));a.$('applyImport').click();assert(a.$('confirmDialog').open);a.$('confirmCancel').click();await settle();equal(a.storage.getItem(key),old);
}));
await test('empty feedback collapses in normal flow; both live regions and arrangements retained',()=>{
 const css=read('src/v3.css');assert(css.includes('.form-status{margin:0;overflow-wrap:anywhere}'));assert(!/\.form-status\{[^}]*min-height/.test(css));assert(css.includes('.form-status:not(:empty){margin-top:8px}'));
 for(const edition of ['standalone','hosted']){const s=html(edition);assert(s.includes('id="referenceError" class="small form-status" role="status" aria-live="polite" aria-atomic="true"'));assert(s.includes('id="backupStatus" class="small form-status" role="status" aria-live="polite" aria-atomic="true"'));assert(s.includes('GitHub Pages projects')||edition==='standalone');}
});
await test('only reference copy functions changed in presentation; complete analysis classifications remain pinned',()=>{
 const baseline=JSON.parse(read('tests/reference-interface-baseline.json'));equal(createHash('sha256').update(functionalSource('src/presentation.js')).digest('hex'),baseline.presentationSHA256);
});
t.finish();
