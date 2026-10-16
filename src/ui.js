'use strict';
// Input strings enter text nodes only. The sole generated href is a local JSON
// backup Blob created by an explicit Export click; it never contains inspected URLs.
const $=id=>document.getElementById(id);
const set=(id,value)=>{$(id).textContent=String(value);};
const clear=el=>el.replaceChildren();
// Native modal semantics plus explicit safe dismissal/focus guards. Dynamic text is inert.
const Confirmation=(()=>{
 const dialog=$('confirmDialog'),cancel=$('confirmCancel'),proceed=$('confirmProceed'),main=document.querySelector('main');let pending=null;
 function finish(accepted){
  const request=pending;if(!request)return;pending=null;proceed.disabled=true;
  if(dialog.open){try{dialog.close();}catch{dialog.removeAttribute('open');}}
  dialog.removeAttribute('open');dialog.classList.remove('dialog-fallback');
  if(!request.wasInert)main.removeAttribute('inert');
  const target=request.restore?.isConnected?request.restore:$('inspect');target.focus({preventScroll:true});request.resolve(accepted===true);
 }
 cancel.addEventListener('click',()=>finish(false));proceed.addEventListener('click',()=>finish(true));
 dialog.addEventListener('cancel',e=>{e.preventDefault();finish(false);});
 dialog.addEventListener('close',()=>{if(pending&&!dialog.open)finish(false);});
 document.addEventListener('click',e=>{if(pending&&!dialog.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
 document.addEventListener('focusin',e=>{if(pending&&!dialog.contains(e.target))cancel.focus();});
 document.addEventListener('keydown',e=>{
  if(!pending)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finish(false);return;}
  if(!dialog.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();cancel.focus();return;}
  if(e.key==='Tab'){
   const controls=[cancel,proceed].filter(el=>!el.disabled),first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  if(e.repeat&&e.key==='Enter')e.preventDefault();
 },true);
 function request({title,message,confirmLabel='Continue',cancelLabel='Cancel',danger=false,restoreFocus=null}){
  if(pending)return Promise.resolve(false);
  return new Promise(resolve=>{
   pending={resolve,restore:restoreFocus||document.activeElement,wasInert:main.hasAttribute('inert')};
   set('confirmTitle',title);set('confirmMessage',message);set('confirmCancel',cancelLabel);set('confirmProceed',confirmLabel);proceed.classList.toggle('danger',danger);proceed.disabled=false;main.setAttribute('inert','');dialog.setAttribute('aria-modal','true');
   try{dialog.showModal();}catch{dialog.setAttribute('open','');dialog.classList.add('dialog-fallback');}
   cancel.focus({preventScroll:true});
  });
 }
 return Object.freeze({request,isOpen:()=>!!pending});
})();
const confirmAction=options=>Confirmation.request(options);
const referenceStore=ReferenceDomains.create({storage:()=>window.localStorage,protocol:location.protocol});
let lastResult=null,lastManual='',editingReference=null,importText='',importPlan=null,referenceActionBusy=false,storageSavingFailed=false;
function element(tag,text,className=''){const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e;}
function note(message){
 const display=Presentation.diagnostic(message),record=document.createElement('details');record.className='diagnostic'+(message.level==='info'?' small':'');record.dataset.code=message.code;record.dataset.level=message.level;
 const heading=document.createElement('summary');heading.append(element('span',display.title,'diagnostic-title'),element('span',display.category,'diagnostic-kind'),element('span',display.severity,'diagnostic-severity'));
 record.append(heading,element('p',message.text,'diagnostic-text small'));$('messages').appendChild(record);
}
function highlighted(target,text){clear(target);for(const ch of text){const c=Inspector.info(ch),span=element('span',Inspector.visible(ch));if(c.nonASCII||c.invisible){span.className='badchar';span.title=c.code+' · '+c.name;}target.appendChild(span);}}
function characterChips(target,characters,original,result,comparisonTarget){
  clear(target);
  if(!characters.length){target.appendChild(element('div',original?'No non-ASCII or invisible characters in the identified original hostname':'Readable hostname contains only ASCII characters','small'));return;}
  const progress=element('div','','small'),more=element('button','Show next 50 character records','ghost small');more.type='button';target.append(progress,more);let position=0;
  function nextPage(){const end=Math.min(position+50,characters.length);
  let firstNewSummary=null;
  for(const c of characters.slice(position,end)){
    const record=document.createElement('details');record.className='character danger';
    const summary=document.createElement('summary');const heading=element('span',c.code+' · '+c.name,'record-heading');heading.appendChild(element('span',c.evidenceSource||'Character evidence','evidence-source'));summary.append(element('span',Inspector.visible(c.ch),'glyph mono'),heading);record.appendChild(summary);if(!firstNewSummary)firstNewSummary=summary;
    function row(key,value){const line=document.createElement('div');line.className='row';line.append(element('div',key,'key'),element('div',value,'value mono'));record.appendChild(line);}
    row('Observed character',Inspector.visible(c.ch)+' · '+c.code);row('Official name',c.name);row('Writing system',c.script);
    let mapping='Preserved by this character rule; complete hostname processing can include composition/reordering.';
    if(/[\t\r\n]/.test(c.ch))mapping='removed by browser URL preprocessing';
    else if(c.idnaStatus==='mapped')mapping='IDNA character mapping → '+Inspector.visible(c.idnaMapping)+' ('+[...c.idnaMapping].map(Inspector.cp).join(' ')+')';
    else if(c.idnaStatus==='ignored')mapping='ignored/removed by IDNA processing';
    else if(c.idnaStatus==='disallowed')mapping='Disallowed by Unicode 18 mapping data; installed-browser behavior is authoritative.';
    else if(c.idnaStatus==='deviation')mapping='Deviation character; nontransitional processing normally preserves it.';
    if(original&&!result.decodeError&&result.original?.reliable&&result.unicode&&!result.unicode.includes(c.ch)&&!['mapped','ignored'].includes(c.idnaStatus)&&!/[\t\r\n]/.test(c.ch))mapping+=' Absent from readable result; sequence normalization/composition can change individual characters.';
    if(original&&!result.original?.reliable)mapping+=' Candidate only: normalization outcome unverified.';
    row('Normalization rule',mapping);
    const describe=value=>[...value].map(ch=>{const i=Inspector.info(ch);return Inspector.visible(ch)+' — '+i.code+' '+i.name;}).join('; ');
    if(c.idnaStatus==='mapped')row('Mapped representation',describe(c.idnaMapping)||'(empty mapping)');
    else if(c.idnaStatus==='ignored')row('Mapped representation','Removed by IDNA processing.');
    else if(result.unicode?.includes(c.ch))row('Readable representation',describe(c.ch));
    else if(original&&result.ok&&!result.decodeError)row('Readable representation','Sequence normalization → '+Inspector.visible(result.unicode)+'. Individual character alignment is not assumed.');
    row('Confusable symbols',c.confusable===null?'No prototype mapping in the bundled table.':Inspector.visible(c.confusable)+' · '+[...c.confusable].map(Inspector.cp).join(' ')+' · internal comparison symbols, not a destination');
    if(comparisonTarget){
      const s=Inspector.skeleton(c.ch),matches=s===null?[]:[...new Set([...comparisonTarget.unicode].filter(ch=>Inspector.skeleton(ch)===s&&ch!==c.ch))];
      row('Comparison character(s)',matches.length?matches.map(ch=>Inspector.visible(ch)+' '+Inspector.cp(ch)+' '+Inspector.info(ch).name).join('; '):'No individual-character equivalence established. Whole-host comparison is separate.');
    }
    if(original&&result.ok)row('Resulting actual host',result.ascii+' · character rules change written spelling, not proof of a different destination');
    target.insertBefore(record,more);
  }
  position=end;progress.textContent='Showing '+position+' of '+characters.length+' unique character records. All original text remains available.';more.classList.toggle('hidden',position>=characters.length);if(position>=characters.length&&document.activeElement===more)firstNewSummary?.focus({preventScroll:true});}
  more.addEventListener('click',nextPage);nextPage();
}
function referenceSummary(refs){
  if(!refs.checked)return 'No reference domains configured.';
  const parts=[];
  for(const [key,label]of [['exact','Exact reference'],['subdomains','Structural subdomain of'],['embedded','Embedded reference text; not a subdomain of'],['visual','Potential visual comparison with'],['spelling','Spelling similarity to']]){
    if(refs[key].length)parts.push(label+': '+refs[key].slice(0,3).map(e=>e.hostname).join(', ')+(refs[key].length>3?' (+'+(refs[key].length-3)+' more in details)':'')+'.');
  }
  return parts.length?parts.join(' '):'No exact, structural, or supported similarity match among '+refs.checked+' local references. Destination remains unverified.';
}
function render(r){
  $('results').classList.remove('hidden');for(const id of ['messages','coloredHost','chars','originalChars','supporting','relevantSubstitutions','referenceCandidates','asciiObservations'])clear($(id));
  for(const id of ['ascii','unicode','original','decodedOriginal','normalized','scripts','scheme','port','path','query','fragment','compare','comparisonResult','referenceComparison'])set(id,'—');
  $('compare').className='value mono';$('comparisonResult').className='value';
  const refs=ReferenceDomains.compare(r,referenceStore.snapshot().references),summary=Presentation.summarize(r,refs,!!lastManual.trim());
  $('primary').dataset.kind=summary.kind;set('primaryTitle',summary.title);set('primaryDetail',Presentation.explain(r,summary));
  set('raw',Inspector.visible(r.raw.slice(0,Inspector.MAX_INPUT))+(r.raw.length>Inspector.MAX_INPUT?'\n[Display truncated; the complete pasted text remains in the input field.]':''));
  for(const m of r.messages)note(m);
  if(r.original){if(r.original.original!==undefined)highlighted($('original'),r.original.original);else set('original','Unavailable: '+r.original.reason);set('decodedOriginal',r.original.decoded===undefined?'Unavailable':Inspector.visible(r.original.decoded)+(r.original.reliable?'':' (candidate only; not verified)'));}
  let target=null;try{if(summary.target)target=Inspector.expectedHost(summary.target);}catch{}
  const evidence=Presentation.characterEvidence(r);
  characterChips($('originalChars'),evidence.original,true,r,target);
  $('originalCharacterGroup').classList.toggle('hidden',!evidence.original.length&&!!evidence.readable.length);
  $('readableCharacterGroup').classList.toggle('hidden',!evidence.readable.length);
  $('asciiDetails').open=false;set('neutralSlot','');
  set('asciiSummary','ASCII lookalike observations');
  if(!r.ok){$('asciiDetails').classList.add('hidden');return;}
  set('ascii',r.ascii);set('normalized',r.ascii);set('unicode',Inspector.visible(r.unicode));highlighted($('coloredHost'),r.unicode);characterChips($('chars'),evidence.readable,false,r,target);
  set('scripts',r.writingSystems.join(', ')||'Common / Inherited');
  if(r.decodeError){set('coloredHost','Readable hostname unavailable — Punycode/IDNA validation failed.');set('unicode','Unavailable — Punycode/IDNA validation failed.');set('scripts','Unavailable');clear($('chars'));}
  set('scheme',r.scheme.slice(0,-1)+(r.assumed?' (assumed HTTPS; omitted in input)':''));set('port',r.port||'Default / not specified'+(r.original?.port?' (input '+r.original.port+')':''));set('path',Inspector.visible(r.path||'/'));set('query',Inspector.visible(r.query||'None'));set('fragment',Inspector.visible(r.fragment||'None'));
  if(r.expectedError){set('compare','Invalid expected hostname');set('comparisonResult','Could not validate: '+r.expectedError);$('comparisonResult').className='value warn';}
  else if(r.comparison){const c=r.comparison;set('compare',r.expected.ascii);set('comparisonResult',c.exact?'Exact hostname match':'Exact hostname mismatch'+(c.visual?' · Potential visual impersonation':c.kind==='spelling'?' · Ordinary spelling similarity':c.unavailable?' · Visual comparison unavailable':''));$('comparisonResult').className='value '+(c.exact?'good':'bad');}
  else{set('compare','Not provided');set('comparisonResult',summary.target?'Reference comparison shown below':'No manual comparison');}
  // Keep the main reference row brief when a manual target is already authoritative.
  set('referenceComparison',summary.manual?(refs.exact.length?'Exact local reference entry: '+refs.exact[0].hostname+'. Manual expected-host comparison takes priority.':refs.checked?refs.checked+' local references checked; candidates remain in technical details.':'No reference domains configured.'):referenceSummary(refs));
  for(const p of (summary.kind==='visual'&&summary.relevant.length?[]:summary.relevant))$('relevantSubstitutions').appendChild(element('li','“'+p.actual+'” may resemble “'+p.expected+'” in some fonts.'));
  for(const text of Presentation.supporting(r,summary,refs))$('supporting').appendChild(element('li',text));
  if(refs.totalMatches){for(const [key,label]of [['exact','Exact hostname'],['subdomains','Structural subdomain (not exact)'],['embedded','Embedded text (not a subdomain)'],['visual','Visual similarity; exact mismatch'],['spelling','Ordinary spelling similarity']])for(const item of refs[key]){$('referenceCandidates').appendChild(element('p',label+': '+item.hostname+(item.comparison?.mechanism?' · '+item.comparison.mechanism:'')));for(const sub of item.comparison?.asciiSubstitutions||[])$('referenceCandidates').appendChild(element('p','Relevant substitution: “'+sub.actual+'” may resemble “'+sub.expected+'” in some fonts.','mono small'));}}
  else set('referenceCandidates',refs.checked?'No comparison candidates. '+refs.checked+' references checked.':'No reference domains configured.');
  if(refs.unavailable)$('referenceCandidates').appendChild(element('p','Visual comparisons unavailable for '+refs.unavailable+' target(s); no negative confusables conclusion was inferred.'));
  $('asciiDetails').classList.toggle('hidden',!r.asciiAmbiguities.length);
  for(const o of r.asciiAmbiguities){$('asciiObservations').appendChild(element('p',o.alternatives.map(s=>'“'+s+'”').join(' / ')+' · observed '+o.observed.map(s=>'“'+s+'”').join(', ')+'. Font-dependent observation, not an impersonation verdict.'));const sources=[...new Set(o.occurrences.map(p=>p.source))];$('asciiObservations').appendChild(element('div',sources.join('; ')+' · '+o.occurrences.length+' recorded occurrence(s).','small'));}
  if(!lastManual.trim()&&!summary.target&&r.asciiAmbiguities.length){set('neutralSlot','Potential visual ambiguities identified. Expand Character Details for observations.');}
}
function analyze(){
  lastManual=$('expected').value;
  try{lastResult=Inspector.inspect($('link').value,lastManual);render(lastResult);}
  catch{lastResult=null;$('results').classList.remove('hidden');for(const id of ['messages','coloredHost','chars','originalChars','supporting','relevantSubstitutions','referenceCandidates','asciiObservations'])clear($(id));for(const id of ['ascii','unicode','original','decodedOriginal','normalized','scripts','scheme','port','path','query','fragment','compare','comparisonResult','referenceComparison'])set(id,'—');set('primaryTitle','Unable to analyze this address reliably');set('primaryDetail','Inspection failed unexpectedly. No destination or safety conclusion is available.');$('primary').dataset.kind='error';}
}
function cancelImport(){importPlan=null;importText='';referenceStore.cancelImport();$('importReview').classList.add('hidden');$('importFile').value='';}
function refreshReferences(){
  const state=referenceStore.snapshot();set('referenceCount',state.references.length+(state.mode==='browser'?' saved':' this session'));if(state.mode==='browser')storageSavingFailed=false;else if(/could not be written|migration could not be saved/.test(state.status))storageSavingFailed=true;set('storageStatus',Presentation.storageStatus(state,APP.edition,storageSavingFailed));set('storageDetail',state.status);$('storageStatus').className=state.mode==='browser'?'small':'small warn';clear($('referenceList'));
  for(const host of state.references){const item=document.createElement('li'),name=document.createElement('div');name.className='ref-name';const decoded=Inspector.expectedHost(host).unicode;name.appendChild(element('span',decoded,'mono'));if(decoded!==host)name.appendChild(element('span',host,'mono small'));if(ReferenceDomains.special(host))name.appendChild(element('span',singleLabel(host)?'Single-label hostname · Exact matches only':'IP address · Exact matches only','small'));
    const edit=element('button','Edit','ghost'),remove=element('button','Remove','ghost');edit.type=remove.type='button';edit.setAttribute('aria-label','Edit reference '+host);remove.setAttribute('aria-label','Remove reference '+host);
    edit.addEventListener('click',()=>{editingReference=host;$('referenceInput').value=host;set('referenceLabel','Edit reference hostname');set('saveReference','Save edit');$('cancelEdit').classList.remove('hidden');$('referenceInput').focus();});
    remove.addEventListener('click',()=>{try{referenceStore.remove(host);if(editingReference===host)resetEdit();cancelImport();refreshReferences();}catch(e){set('referenceError',e.message);}});item.append(name,edit,remove);$('referenceList').appendChild(item);
  }
  if(!state.references.length)$('referenceList').appendChild(element('li','No reference domains saved yet.','small'));
  if(lastResult)render(lastResult);
}
function resetEdit(){editingReference=null;$('referenceInput').value='';set('referenceLabel','Add a reference hostname');set('saveReference','Add');$('cancelEdit').classList.add('hidden');}
function singleLabel(host){return !host.includes('.')&&!host.startsWith('[');}
async function saveReference(){
 if(referenceActionBusy)return;referenceActionBusy=true;
 try{
  const previous=editingReference,host=ReferenceDomains.normalize($('referenceInput').value),entries=referenceStore.snapshot().references;
  if(entries.includes(host)&&host!==previous)throw Error('That normalized hostname is already in Reference Domains.');
  if(!previous&&entries.length>=ReferenceDomains.MAX_ENTRIES)throw Error('The reference list is limited to '+ReferenceDomains.MAX_ENTRIES+' entries.');
  if(singleLabel(host)&&host!==previous&&!await confirmAction({title:'Is This Hostname Complete?',message:'You entered “'+Inspector.visible(host)+'”, a single-label hostname. It is different from a complete public hostname with a domain suffix. For a public website, edit it to include the complete hostname. Internal hostnames can be added as written; they receive exact matches only.',cancelLabel:'Edit Hostname',confirmLabel:previous?'Save Anyway':'Add Anyway',restoreFocus:$('referenceInput')}))return;
  if(previous)referenceStore.edit(previous,host);else referenceStore.add(host);
  set('referenceError','');resetEdit();cancelImport();refreshReferences();
 }catch(e){set('referenceError',e.message);}finally{referenceActionBusy=false;}
}
function selectedImportMode(){return $('importReplace').checked?'replace':'merge';}
function reviewImport(){try{
 importPlan=referenceStore.planImport(importText,selectedImportMode());
 set('importSummary',importPlan.mode.toUpperCase()+': '+importPlan.added.length+' additions, '+importPlan.removed.length+' removals, '+importPlan.duplicates+' duplicate representations. Final list: '+importPlan.final.length+'. Nothing has been applied.');
 set('importChanges','Add:\n'+(importPlan.added.join('\n')||'(none)')+'\n\nRemove:\n'+(importPlan.removed.join('\n')||'(none)')+'\n\nFinal normalized hostnames:\n'+(importPlan.final.join('\n')||'(empty)'));
 const internal=importPlan.final.filter(singleLabel);set('importSingleLabels',internal.length?'Single-label hostnames in the result (exact matches only): '+internal.join(', ')+'. These may identify internal services; no public suffix is inferred.':'');$('importSingleLabels').classList.toggle('hidden',!internal.length);
 $('importReview').classList.remove('hidden');set('referenceError','');
 }catch(e){importPlan=null;$('importReview').classList.add('hidden');set('referenceError',e.message);}}
function beginImport(text){importText=text;$('importMerge').checked=true;$('importReplace').checked=false;reviewImport();}
$('saveReference').addEventListener('click',saveReference);$('referenceInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&!e.isComposing&&!e.repeat){e.preventDefault();saveReference();}});$('cancelEdit').addEventListener('click',resetEdit);
$('clearReferences').addEventListener('click',async()=>{
 if(referenceActionBusy)return;referenceActionBusy=true;
 try{if(!await confirmAction({title:'Clear Reference Domains?',message:'This will clear your current reference list and, if storage is available, the saved list. You can restore references from an exported backup.',confirmLabel:'Clear References',danger:true}))return;
  referenceStore.clear(true);resetEdit();cancelImport();refreshReferences();set('referenceError',referenceStore.snapshot().mode==='browser'?'Reference list cleared.':'The list was cleared in this tab only. Saved data could not be changed.');
 }catch(e){set('referenceError',e.message);}finally{referenceActionBusy=false;}
});
$('exportReferences').addEventListener('click',()=>{try{const url=URL.createObjectURL(new Blob([referenceStore.exportJSON()],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='offline-url-inspector-references.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);set('referenceError','Reference backup prepared. It contains only normalized reference hostnames.');}catch{set('referenceError','Export could not create a download in this browser. Browser storage is not a backup.');}});
$('importReferences').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',async()=>{const file=$('importFile').files?.[0];if(!file)return;if(file.size>ReferenceDomains.MAX_BYTES){set('referenceError','Import exceeds 128 KiB.');return;}try{beginImport(await file.text());}catch{set('referenceError','Could not read the selected file.');}});
$('importMerge').addEventListener('change',reviewImport);$('importReplace').addEventListener('change',reviewImport);$('cancelImport').addEventListener('click',()=>{cancelImport();$('importReferences').focus({preventScroll:true});});
$('applyImport').addEventListener('click',async()=>{
 if(!importPlan||referenceActionBusy)return;referenceActionBusy=true;const plan=importPlan,replace=plan.mode==='replace';
 try{
  if(replace&&!await confirmAction({title:'Replace Reference Domains?',message:'Replace your current reference list with the reviewed backup?\nCurrent list: '+referenceStore.snapshot().references.length+' · Reviewed list: '+plan.final.length+'\n'+plan.added.length+' additions · '+plan.removed.length+' removals. Existing saved reference data will be replaced. Keep an exported backup if you may need it.',confirmLabel:'Replace References',danger:true}))return;
  referenceStore.applyImport(plan,replace);cancelImport();refreshReferences();$('importReferences').focus({preventScroll:true});set('referenceError',referenceStore.snapshot().mode==='browser'?'Reviewed backup applied.':'Backup applied in this tab only. Export a backup before closing.');
 }catch(e){set('referenceError',e.message);}finally{referenceActionBusy=false;}
});
$('inspect').addEventListener('click',analyze);
// One bubbling handler: no field-specific duplicate, no unrelated editing takeover.
document.addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.repeat||e.isComposing||e.keyCode===229||e.key!=='Enter'||!(e.metaKey||e.ctrlKey)||e.altKey||e.shiftKey)return;
 if(editingReference!==null||!$('importReview').classList.contains('hidden')||document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]'))return;
 const target=e.target instanceof Element?e.target:document.activeElement;
 if(target?.closest('#referencePanel')||target?.closest('[contenteditable]:not([contenteditable="false"])'))return;
 const field=target?.closest('input,textarea,select,button,a,summary');
 if(field&&field!==$('link')&&field!==$('expected')&&field!==$('inspect'))return;
 e.preventDefault();analyze();
});
const shortcutPlatform=navigator.platform||'';
set('shortcutHint',/Mac|iPhone|iPad/.test(shortcutPlatform)?'⌘ + Return to inspect':/Win|Linux/.test(shortcutPlatform)?'Ctrl + Enter to inspect':'⌘ + Return / Ctrl + Enter to inspect');
$('demoUnicode').addEventListener('click',()=>{$('link').value='https://аmazon.com/account';$('expected').value='amazon.com';analyze();});$('demoAscii').addEventListener('click',()=>{$('link').value='https://arnazon.com/orders/123';$('expected').value='amazon.com';analyze();});
set('license',@@LICENSE@@);refreshReferences();
