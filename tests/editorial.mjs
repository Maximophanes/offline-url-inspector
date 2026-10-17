// Source and simulated DOM acceptance; actual layout is reviewed separately.
import {read,html,modules,suite,MemoryStorage,functionalSource} from './harness.mjs';
import {mount} from './dom-support.mjs';
import {createHash} from 'node:crypto';
const t=suite('V3.1.2 complete editorial acceptance and evidence preservation','editorial-results.json'),{test,assert,equal}=t;
const {Inspector:I,ReferenceDomains:R,Presentation:P}=modules(),a=mount(),{w,$,inspect}=a;
const hash=s=>createHash('sha256').update(s).digest('hex'),backup=references=>JSON.stringify({application:R.APPLICATION,schemaVersion:1,references}),settle=()=>new Promise(resolve=>setTimeout(resolve,0));
const hidden=id=>$(id).classList.contains('hidden'),baseline=JSON.parse(read('tests/editorial-baseline.json'));
const fixtures=[...JSON.parse(read('tests/cases.json')),...JSON.parse(read('tests/ascii-cases.json'))];
function add(host){$('referenceInput').value=host;$('saveReference').click();}
function reset(refs=[]){w.resetReferenceUI();if(refs.length){w.reviewImportText(backup(refs));$('applyImport').click();}}
t.group('traceable inventory, immutable analysis and presentation scope');
await test('all pre-editorial analysis objects including raw diagnostics are identical',()=>{
 for(const [file,expected]of Object.entries(baseline.fixtureSHA256))equal(hash(read(file)),expected);
 const rows=fixtures.map(c=>({name:c.name,result:I.inspect(c.url,c.expected||'')}));
 equal(rows.length,baseline.analysisResultCount);equal(hash(JSON.stringify(rows)),baseline.analysisResultsSHA256);
});
await test('all security engine/data pins survive the scoped recovery-prose exception',()=>{
 for(const [file,expected]of Object.entries(JSON.parse(read('tests/polish-baseline.json')).functionalFiles))equal(hash(functionalSource(file)),expected);
 const worker=read('src/sw.js');assert(worker.includes('status:503'));assert(worker.includes('unregister only the worker scoped to /offline-url-inspector/'));assert(worker.includes('other projects may share that data'));
 assert(/VERSION\s*=\s*['"]3\.1\.2['"]/.test(read('tools/build.py')));for(const edition of ['standalone','hosted'])assert(html(edition).includes('Version 3.1.2'));
});
await test('every emitted diagnostic code has an explanation and an audit entry',()=>{
 const codes=[...new Set([...read('src/core.js').matchAll(/note\('([^']+)'/g)].map(m=>m[1]))].sort();
 equal([...P.diagnosticCodes].sort(),codes);
 const audit=read('COPY_AUDIT.md'),quote=String.fromCharCode(96);for(const code of codes)assert(audit.includes(quote+code+quote),code);
 for(const file of baseline.sourceFilesReviewed)assert(audit.includes(file),file);
});
await test('literal inventory tracks every copy-supplying source with current hashes',()=>{
 const inventory=JSON.parse(read('tests/copy-inventory.json'));
 for(const [path,source]of Object.entries(inventory.sources)){equal(source.sha256,hash(read(path)));assert(source.items.length>0,path);}
});
t.group('result distinctions, dynamic values and exact-match scope');
for(const [url,expected,title,kind]of [
 ['', '', 'Enter a URL to inspect','error'],['ftp://example.invalid','','URL format needs review','error'],['https://[','','Unable to read this URL','error'],
 ['https://fgh.net','','No unusual hostname characters identified','neutral'],['https://café.invalid','','Internationalized hostname','international'],
 ['https://ａmazon.com','','Hostname spelling changed during processing','normalization'],['https://amazoon.com','amazon.com','Hostname mismatch','mismatch'],
 ['https://аmazon.com','amazon.com','Potential hostname impersonation','visual'],['https://مثال.إختبار','example.com','Visual comparison unavailable','unavailable']
])await test(title+' retains its evidence-based state',()=>{
 const r=inspect(url,expected);equal($('primaryTitle').textContent,title);equal($('primary').dataset.kind,kind);
 equal($('messages').children.length,r.messages.length);assert(!/\bsafe\b|\btrusted\b/i.test($('primaryTitle').textContent));
 if(!r.ok){equal($('link').getAttribute('aria-invalid'),'true');assert(!hidden('inspectionError'));equal($('link').value,url);}else assert(!$('link').hasAttribute('aria-invalid'));
});
await test('an exact hostname does not compare different schemes, ports, paths or queries',()=>{
 inspect('http://example.com:8080/changed?x=2','example.com');equal($('primaryTitle').textContent,'Exact hostname match');
 for(const word of ['scheme','port','path','query'])assert($('primaryDetail').textContent.includes(word));
 equal($('scheme').textContent,'http');equal($('port').textContent,'8080');equal($('path').textContent,'/changed');equal($('query').textContent,'?x=2');
 assert($('supporting').textContent.includes('unencrypted HTTP'));
});
await test('saved exact-match language is scoped to hostname identity',()=>{
 reset(['example.com']);inspect('https://example.com/changed?x=2');equal($('primaryTitle').textContent,'Exact reference hostname match');
 assert($('primaryDetail').textContent.includes('does not compare the rest of the URL or verify the website'));
 assert($('referenceCandidates').textContent.includes('match exactly'));assert(!$('referenceCandidates').textContent.includes('Unicode visual comparison'));
});
await test('manual comparison remains primary while saved matches stay separately available',()=>{
 reset(['amazon.com']);const r=inspect('https://amazon.com','example.com');equal(r.comparison.kind,'mismatch');equal($('primaryTitle').textContent,'Hostname mismatch');
 equal($('compare').textContent,'example.com');assert($('referenceCandidates').textContent.includes('Your expected hostname (manual; primary)'));assert($('referenceCandidates').textContent.includes('Saved reference domain (secondary)'));
 assert($('expectedHelp').textContent.includes('checked separately'));assert($('referenceComparison').textContent.includes('1 saved reference checked separately'));
});
await test('unavailable saved comparison is not described as a completed negative check',()=>{
 reset(['example.com']);const r=inspect('https://مثال.إختبار');equal(R.compare(r,['example.com']).unavailable,1);
 equal($('primary').dataset.kind,'unavailable');assert($('referenceCandidates').textContent.includes("couldn't check for visual resemblance to 1 saved reference."));
 assert(!$('referenceCandidates').textContent.includes('did not produce a supported match'));
});
await test('invalid expected hostname has a connected inline error and preserves input',()=>{
 inspect('https://amazon.com','https://example.com/path');equal($('expected').value,'https://example.com/path');equal($('expected').getAttribute('aria-invalid'),'true');
 assert(!hidden('expectedError'));equal($('compare').textContent,'Could not be checked');assert($('expectedError').textContent.includes('without sign-in details'));
 inspect('https://amazon.com','amazon.com');assert(hidden('expectedError'));assert(!$('expected').hasAttribute('aria-invalid'));
});
t.group('Unicode/ASCII evidence and accurate visual semantics');
await test('ordinary Unicode is neutral while a supported lookalike is emphasized',()=>{
 reset();inspect('https://café.invalid');for(const e of $('characterDetails').querySelectorAll('.character'))equal(e.dataset.tone,'information');
 inspect('https://аmazon.com','amazon.com');equal($('originalChars').querySelector('.character').dataset.tone,'caution');equal($('coloredHost').querySelector('.badchar').dataset.tone,'caution');
 inspect('https://ama\u200bzon.invalid');equal($('originalChars').querySelector('.character').dataset.tone,'caution');assert($('original').textContent.includes('⟦U+200B⟧'));
});
for(const [url,target]of [['https://аmazon.com','amazon.com'],['https://æ.invalid','ae.invalid'],['https://ａmazon.com','amazon.com'],['https://faß.invalid',''],['https://cafe\u0301.invalid',''],['https://漢.invalid','']])await test('raw character mappings and code points remain reversible: '+url,()=>{
 const r=inspect(url,target),expected=P.characterEvidence(r),records=[...$('characterDetails').querySelectorAll('.character')],characters=[...expected.original,...expected.readable];
 equal(records.length,characters.length);
 records.forEach((e,i)=>{const c=characters[i],raw=JSON.parse(e.querySelector('.raw-character pre').textContent);equal(raw.character,c.ch);equal(raw.codePoint,c.code);equal(raw.name,c.name);equal(raw.idnaMapping,c.idnaMapping);equal(raw.confusableMapping,c.confusable);
 const mapping=e.querySelector('.mapping-value');if(c.confusable===null){assert(!mapping);assert(e.textContent.includes('No UTS #39 mapping is listed'));}else{assert(mapping.textContent.startsWith(I.visible(c.ch)+' ('+c.code+') → '));for(const ch of c.confusable)assert(mapping.textContent.includes(I.cp(ch)));}
 });
 if(url.includes('æ')){equal(P.unicodeDifference(r,I.expectedHost(target)),null);assert(!$('originalChars').textContent.includes('Visually resembles'));}
 if(url.includes('ß'))assert($('originalChars').textContent.includes('Older compatibility rules may replace it'));
});
await test('unverified original text retains attribution without asserting normalization',()=>{
 const r=inspect('https://а.invalid:99999');equal(JSON.parse($('attributionRaw').textContent),r.original);assert(!r.original.reliable);
 assert($('originalChars').textContent.includes('Original text (unverified)'));assert($('originalChars').textContent.includes('normalization result is unverified'));equal($('ascii').textContent,'—');
});
await test('all Actual/Decoded labels use explicit descriptor elements',()=>{
 inspect('https://аmazon.com','amazon.com');for(const id of ['decodedOriginal','normalized'])assert($(id).previousElementSibling.querySelector('.label-detail'));
 const labels=[...$('characterDetails').querySelectorAll('.key')].filter(e=>e.textContent.startsWith('Actual Hostname'));assert(labels.length>0);for(const label of labels)equal(label.querySelector('.label-detail').textContent,'(ASCII / Punycode)');
 assert(read('src/v3.css').includes('.label-detail{display:block;white-space:nowrap'));
});
await test('ASCII groups retain actual alternatives and positions with natural counts',()=>{
 reset();const r=inspect('https://m.invalid'),groups=$('messages').querySelector('[data-code="ascii-ambiguity"] .diagnostic-evidence').querySelectorAll('.ascii-group');
 equal(groups.length,r.asciiAmbiguities.length);groups.forEach((g,i)=>{const o=r.asciiAmbiguities[i];equal(g.querySelector('.value').textContent,o.alternatives.join(' / '));equal(g.querySelectorAll('li').length,o.occurrences.length);equal(g.querySelector('.occurrence-count').textContent,P.count(o.occurrences.length,'occurrence')+' identified.');assert(g.querySelector('.occurrence-progress').classList.contains('hidden'));for(const p of o.occurrences)assert(g.textContent.includes('Label '+p.label+', character '+p.offset));});
 assert(!$('asciiObservations').textContent.includes('of 1'));assert(!$('primaryDetail').textContent.includes('amazon'));
});
await test('relevant ASCII substitution appears once prominently and raw evidence survives',()=>{
 inspect('https://arnazon.com','amazon.com');equal(($('primaryDetail').textContent.match(/“rn” may resemble “m”/g)||[]).length,1);equal($('relevantSubstitutions').children.length,0);
 assert($('messages').querySelector('[data-code="ascii-ambiguity"] .diagnostic-text').textContent.includes('“rn”'));assert($('asciiDetails').parentElement.closest('#characterDetails'));
});
await test('comparison method headings reflect the actual algorithm',()=>{
 for(const [url,target,heading]of [['https://аmazon.com','amazon.com','Unicode visual comparison'],['https://vveb.com','web.com','ASCII visual comparison'],['https://amazoon.com','amazon.com','Spelling comparison'],['https://example.com','example.com','Hostname identity comparison']]){
  inspect(url,target);const summaries=[...$('referenceCandidates').querySelectorAll('summary')].map(e=>e.textContent);assert(summaries.includes(heading),url+': '+summaries);if(heading!=='Unicode visual comparison')assert(!summaries.includes('Unicode visual comparison'));
 }
});
t.group('complete diagnostics, safe rendering and announcements');
await test('representative diagnostics retain order, raw prose, codes and severity',()=>{
 const covered=new Set();
 for(const c of [...fixtures,{url:'https://example.invalid/'+'x'.repeat(I.MAX_INPUT)}]){const r=inspect(c.url,c.expected||'');[...$('messages').children].forEach((record,i)=>{
  const m=r.messages[i];covered.add(m.code);equal(record.dataset.code,m.code);equal(record.dataset.level,m.level);equal(record.querySelector('.diagnostic-text').textContent,m.text);
  equal(record.querySelector('.diagnostic-severity').textContent,m.level==='alert'?'Warning':m.level==='warn'?'Caution':'Information');
  assert(!record.open);assert(!record.querySelector('.raw-diagnostic').open);assert(record.querySelector('.diagnostic-explanation').textContent.length>10);
 });}
 equal([...covered].sort(),[...P.diagnosticCodes].sort());t.report.diagnosticCodesExercised=[...covered].sort();
});
await test('all registry explanations support unusual states without mutating evidence',()=>{
 const r=I.inspect('https://example.invalid:8080','example.com'),before=JSON.stringify(r);
 for(const code of P.diagnosticCodes){const m={code,level:'warn',text:'Synthetic raw evidence'};assert(P.diagnosticText(m,r).length>10);equal(P.diagnostic(m).severity,'Caution');}
 equal(JSON.stringify(r),before);
});
await test('announcements are scoped and field errors remain connected',()=>{
 equal($('results').getAttribute('aria-live'),null);equal($('primary').getAttribute('aria-atomic'),'true');assert(!$('messages').closest('[aria-live]'));
 for(const id of ['link','expected','referenceInput'])for(const related of $(id).getAttribute('aria-describedby').split(/\s+/))assert($(related));
 for(const id of ['referenceError','backupStatus','offlineStatus','updateStatus'])equal($(id).getAttribute('role'),'status');
 assert(!$('storageStatus').hasAttribute('role'));
});
await test('untrusted markup and bidi source remain inert, exact and isolated',()=>{
 const url='https://example.invalid/<img src=x onerror=ATTACK>?x=\u202e#\u200b';inspect(url);equal($('link').value,url);equal($('raw').textContent,I.visible(url));
 equal(w.document.querySelectorAll('img,svg,iframe,a,object,embed').length,0);assert(!w.ATTACK);assert(read('src/base.css').includes('unicode-bidi:isolate'));assert(!/innerHTML|insertAdjacentHTML|outerHTML/.test(read('src/ui.js')));equal(a.network,[]);
});
t.group('reference validation, import grammar, storage and recovery');
await test('reference errors retain raw details and never rewrite stored bytes',()=>{
 reset(['example.com']);const old=a.storage.getItem(R.KEY);add('EXAMPLE.COM.');equal($('referenceError').dataset.tone,'error');assert($('referenceError').textContent.includes('already saved'));equal($('referenceInput').getAttribute('aria-invalid'),'true');
 assert(!hidden('referenceErrorDetails'));assert($('referenceErrorRaw').textContent.includes('normalized hostname'));equal(a.storage.getItem(R.KEY),old);
 add('new.invalid');equal($('referenceError').dataset.tone,'success');assert($('referenceError').textContent.startsWith('Success:'));assert(!$('referenceError').classList.contains('warn'));assert(hidden('referenceErrorDetails'));assert(!$('referenceInput').hasAttribute('aria-invalid'));equal($('backupStatus').textContent,'');
});
for(const [values,title,added,removed,total]of [
 [[], 'Merge',0,0,1],[['new.invalid'],'Merge',1,0,2],[['one.invalid','two.invalid'],'Merge',2,0,3],
 [[], 'Replace',0,1,0],[['new.invalid'],'Replace',1,1,1],[['one.invalid','two.invalid'],'Replace',2,1,2]
])await test(title+' import grammar and lists for '+values.length+' entries',()=>{
 reset(['example.com']);const old=a.storage.getItem(R.KEY);w.reviewImportText(backup(values));if(title==='Replace'){$('importReplace').checked=true;$('importReplace').dispatchEvent(new w.Event('change'));}
 equal($('importPreviewTitle').textContent,'Import Preview — '+title);const copy=$('importSummary').textContent;
 assert(copy.includes(added?P.count(added,'new reference')+' will be added.':'No new references will be added.'));assert(copy.includes(removed?P.count(removed,'existing reference')+' will be removed.':'No existing references will be removed.'));assert(copy.includes('References after import: '+total));
 const plan=R.create({}).planImport(backup(values),'replace');for(const name of plan.final)assert($('importChanges').textContent.includes(name));
 equal(a.storage.getItem(R.KEY),old);assert(!/\w+\(s\)|1 references/.test(copy));$('cancelImport').click();
});
for(const [value,pattern]of [['not json',/isn't valid JSON/],[JSON.stringify({application:R.APPLICATION,schemaVersion:99,references:[]}),/unsupported format version/],[JSON.stringify({application:R.APPLICATION,schemaVersion:1,references:[],extra:true}),/expected backup format/],[backup(['example.com/path']),/Reference 1:/]])await test('invalid import preserves bytes and gives recovery: '+pattern,()=>{
 reset(['example.com']);const old=a.storage.getItem(R.KEY);w.reviewImportText(value);assert(hidden('importReview'));equal($('backupStatus').dataset.tone,'error');assert(pattern.test($('backupStatus').textContent));assert(!hidden('backupErrorDetails'));equal($('referenceError').textContent,'');equal(a.storage.getItem(R.KEY),old);
});
await test('unreadable saved data stays protected and Export cannot promise to preserve it',async()=>{
 const data=new MemoryStorage();data.setItem(R.KEY,'unreadable original');const b=mount({storage:data});b.$('referenceInput').value='example.com';b.$('saveReference').click();
 equal(data.getItem(R.KEY),'unreadable original');assert(b.$('protectedStorageHelp').textContent.includes('cannot preserve unreadable saved data'));
 b.$('clearReferences').click();assert(b.$('confirmMessage').textContent.includes('not an unreadable or different saved copy'));b.$('confirmCancel').click();await settle();equal(data.getItem(R.KEY),'unreadable original');await b.close();
});
await test('concurrent saved list is distinguished from unreadable data and kept intact',async()=>{
 const data=new MemoryStorage();data.setItem(R.KEY,backup(['old.invalid']));const b=mount({storage:data});const other=backup(['other.invalid']);data.setItem(R.KEY,other);
 b.$('referenceInput').value='new.invalid';b.$('saveReference').click();equal(data.getItem(R.KEY),other);assert(b.$('storageStatus').textContent.includes('changed elsewhere'));assert(b.$('protectedStorageHelp').textContent.includes('not the different saved copy'));equal(b.$('referenceError').dataset.tone,'caution');await b.close();
});
await test('failed write never claims saved success',async()=>{
 const data=new MemoryStorage();data.setItem(R.KEY,backup(['old.invalid']));const old=data.getItem(R.KEY);data.failWrite=true;const b=mount({storage:data});
 b.$('referenceInput').value='new.invalid';b.$('saveReference').click();equal(data.getItem(R.KEY),old);equal(b.$('referenceError').dataset.tone,'caution');assert(b.$('referenceError').textContent.includes('only in this tab'));assert(b.$('storageStatus').textContent.startsWith('Saving failed'));assert(!b.$('referenceError').textContent.includes('Success:'));await b.close();
});
await test('legacy migration retains references and reports actual persistence',async()=>{
 for(const fail of [false,true]){const data=new MemoryStorage(),old=JSON.stringify({application:R.APPLICATION,schemaVersion:0,domains:['EXAMPLE.COM']});data.setItem(R.KEY,old);data.failWrite=fail;const b=mount({storage:data});
 equal(b.w.testReferences.snapshot().references,['example.com']);if(fail){equal(data.getItem(R.KEY),old);assert(b.$('storageStatus').textContent.startsWith('Saving failed'));}else{equal(JSON.parse(data.getItem(R.KEY)).schemaVersion,1);assert(b.$('storageStatus').textContent.startsWith('Changes saved'));}await b.close();}
});
await test('inspection/expected text never enters storage or destination requests',()=>{
 const values=a.storage.writes.map(e=>e[1]).join('');assert(!/ATTACK|onerror|x=2|8080|token=/.test(values));equal(a.network,[]);
});
await test('unexpected inspection failure clears stale evidence and preserves current input',()=>{reset();inspect('https://m.invalid');w.testInspectionFailure=true;$('link').value='https://new.invalid/ORIGINAL';$('inspect').click();w.testInspectionFailure=false;equal($('primaryTitle').textContent,'Inspection could not be completed');equal($('ascii').textContent,'—');equal($('messages').children.length,0);assert(hidden('asciiDetails'));equal($('raw').textContent,'https://new.invalid/ORIGINAL');assert($('inspectionError').textContent.includes('original text is still in the input field'));});
await test('imported single-label guidance uses the actual singular or plural state',()=>{reset();for(const values of [['internal'],['internal','mailhost']]){w.reviewImportText(backup(values));const text=$('importSingleLabels').textContent;assert(text.startsWith(P.count(values.length,'single-label hostname')));assert(text.includes(values.length===1?'This name may':'These names may'));$('cancelImport').click();}});
await a.close();t.finish({kind:'source and simulated DOM; does not establish native Firefox, layout, zoom, screen-reader or container behavior'});
