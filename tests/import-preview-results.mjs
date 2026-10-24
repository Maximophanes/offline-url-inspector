// Current generated runtime, both editions; no layout or native-dialog claim.
import {suite,MemoryStorage} from './harness.mjs';
import {mount} from './dom-support.mjs';
const t=suite('Import preview describes the resulting reference list','import-preview-results.json'),{test,assert,equal}=t;
const cases=[
 {id:'retained name is absent from incoming backup',saved:['plan','example.com'],incoming:['new.example'],merge:['plan','example.com','new.example'],replace:['new.example'],mergeNames:['plan'],replaceNames:[]},
 {id:'incoming single name',saved:['example.com'],incoming:['plan'],merge:['example.com','plan'],replace:['plan'],mergeNames:['plan'],replaceNames:['plan']},
 {id:'retained and incoming names',saved:['plan','example.com'],incoming:['desk','new.example'],merge:['plan','example.com','desk','new.example'],replace:['desk','new.example'],mergeNames:['plan','desk'],replaceNames:['desk']},
 {id:'replace removes existing names',saved:['plan','desk'],incoming:['new.example'],merge:['plan','desk','new.example'],replace:['new.example'],mergeNames:['plan','desk'],replaceNames:[]},
 {id:'multiple incoming names',saved:['example.com'],incoming:['desk','mailhost'],merge:['example.com','desk','mailhost'],replace:['desk','mailhost'],mergeNames:['desk','mailhost'],replaceNames:['desk','mailhost']},
 {id:'normalization and duplicates',saved:['plan'],incoming:['PLAN.','desk','DESK'],merge:['plan','desk'],replace:['plan','desk'],mergeNames:['plan','desk'],replaceNames:['plan','desk']},
 {id:'no single-label names',saved:['example.com'],incoming:['new.example'],merge:['example.com','new.example'],replace:['new.example'],mergeNames:[],replaceNames:[]},
 {id:'empty backup',saved:['plan'],incoming:[],merge:['plan'],replace:[],mergeNames:['plan'],replaceNames:[]},
 {id:'duplicate-only backup counts the final name once',saved:['plan'],incoming:['PLAN'],merge:['plan'],replace:['plan'],mergeNames:['plan'],replaceNames:['plan']},
 {id:'IP addresses are not single-label names',saved:['plan','127.0.0.1'],incoming:['127.1','[2001:db8::1]'],merge:['plan','127.0.0.1','[2001:db8::1]'],replace:['127.0.0.1','[2001:db8::1]'],mergeNames:['plan'],replaceNames:[]},
 {id:'normalized Unicode single label',saved:[],incoming:['café'],merge:['xn--caf-dma'],replace:['xn--caf-dma'],mergeNames:['xn--caf-dma'],replaceNames:['xn--caf-dma']}
];
const backup=references=>JSON.stringify({application:'offline-url-inspector',schemaVersion:1,references});
const expected=names=>!names.length?'':names.length===1
 ?`The resulting list contains 1 single-label hostname: ${names[0]}. This name may identify a local-network service and can only be matched exactly.`
 :`The resulting list contains ${names.length} single-label hostnames: ${names.join(', ')}. These names may identify local-network services and can only be matched exactly.`;
const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
async function checkCase(edition,c,mode,failWrite=false){
 const storage=new MemoryStorage(),app=mount({edition,storage}),{w,$}=app,R=w.testReferenceDomains;
 try{
  for(const host of c.saved)w.testReferences.add(host);
  const snapshot=w.testReferences.snapshot(),saved=storage.getItem(R.KEY),writes=storage.writes.length;
  storage.failWrite=failWrite;
  w.reviewImportText(backup(c.incoming));
  function checkPreview(choice){
   const names=c[choice+'Names'],final=c[choice],node=$('importSingleLabels');
   equal(node.textContent,expected(names));equal(node.classList.contains('hidden'),!names.length);assert(node.classList.contains('small'));equal(node.children.length,0);
   equal($('importPreviewTitle').textContent,'Import Preview — '+(choice==='merge'?'Merge':'Replace'));
   const groups=[...$('importChanges').children];equal(groups.map(n=>n.querySelector('h3').textContent),['To add','To remove','References after import']);
   equal(groups.map(n=>n.querySelector('.mono').textContent),[final.filter(h=>!c.saved.includes(h)),c.saved.filter(h=>!final.includes(h)),final].map(v=>v.join('\n')||'None'));
   equal(w.testReferences.snapshot(),snapshot);equal(storage.getItem(R.KEY),saved);equal(storage.writes.length,writes);
   assert(!node.textContent.includes('in this preview'));assert(!node.textContent.includes('private-network'));assert(!$('importChanges').querySelector('a,img,svg,iframe'));
  }
  checkPreview('merge');
  // Exercise recomputation and stale-text clearing in the same review.
  for(const choice of ['replace','merge',mode]){$('importMerge').checked=choice==='merge';$('importReplace').checked=choice==='replace';$(choice==='merge'?'importMerge':'importReplace').dispatchEvent(new w.Event('change',{bubbles:true}));checkPreview(choice);}
  $('applyImport').click();
  if(mode==='replace'){
   assert($('confirmDialog').open);equal(w.testReferences.snapshot(),snapshot);$('confirmCancel').click();await pause();equal(w.testReferences.snapshot(),snapshot);equal(storage.getItem(R.KEY),saved);
   $('applyImport').click();assert($('confirmDialog').open);$('confirmProceed').click();await pause();
  }else assert(!$('confirmDialog').open);
  equal(w.testReferences.snapshot().references,c[mode]);equal(JSON.parse(w.testReferences.exportJSON()),{application:'offline-url-inspector',schemaVersion:1,references:c[mode]});
  if(failWrite){equal(storage.getItem(R.KEY),saved);equal(w.testReferences.snapshot().mode,'session');}else equal(JSON.parse(storage.getItem(R.KEY)).references,c[mode]);
  assert($('importReview').classList.contains('hidden'));equal(app.network,[]);
 }finally{await app.close();}
}
for(const edition of ['standalone','hosted']){
 t.group(edition+' resulting lists');
 for(const c of cases)for(const mode of ['merge','replace'])await test(c.id+' · '+mode,()=>checkCase(edition,c,mode));
 t.group(edition+' storage fallback');
 for(const mode of ['merge','replace'])await test('write failure preserves saved bytes · '+mode,()=>checkCase(edition,cases[2],mode,true));
}
t.finish({scope:'Current generated file/hosted DOM, result-list grammar and unchanged preview/apply/storage contracts. No native-browser or visual acceptance claim.'});
