'use strict';
// Input strings enter text nodes only. The sole generated href is a local JSON
// backup Blob created by an explicit Export click; it never contains inspected URLs.
const $=id=>document.getElementById(id);
const set=(id,value)=>{const text=String(value);if($(id).textContent!==text)$(id).textContent=text;};
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
const rawText=value=>JSON.stringify(value,null,2).replace(/[\u007f-\uffff]/g,ch=>'\\u'+ch.charCodeAt(0).toString(16).padStart(4,'0'));
function rowLabel(label,descriptor=''){
 const key=element('div',label,'key');if(descriptor)key.append(document.createTextNode(' '),element('span','('+descriptor+')','label-detail'));return key;
}
function referenceNotice(text='',tone='information',raw='',field=false,area='reference'){
 const backup=area==='backup',id=backup?'backupStatus':'referenceError',details=backup?'backupErrorDetails':'referenceErrorDetails',rawId=backup?'backupErrorRaw':'referenceErrorRaw';
 set(backup?'referenceError':'backupStatus','');set(backup?'referenceErrorRaw':'backupErrorRaw','');$(backup?'referenceErrorDetails':'backupErrorDetails').classList.add('hidden');
 const target=$(id);target.dataset.tone=tone;
 const prefix=text?({success:'Success',information:'Information',caution:'Caution',error:'Error'}[tone]+': '):'';
 set(id,prefix+text);set(rawId,Inspector.visible(raw));$(details).classList.toggle('hidden',!raw||tone!=='error');
 if(field&&tone==='error')$('referenceInput').setAttribute('aria-invalid','true');else $('referenceInput').removeAttribute('aria-invalid');
}
function referenceFailure(error,context='hostname',field=false,area=context==='import'?'backup':'reference'){referenceNotice(Presentation.validation(error.message,context),'error',error.message,field,area);}
function referenceOutcome(message,area='reference'){const state=referenceStore.snapshot();referenceNotice(state.mode==='browser'?message:message+' This change is only in this tab; export a backup before closing.',state.mode==='browser'?'success':'caution','',false,area);}
function fieldError(id,input,message){set(id,message);$(id).classList.toggle('hidden',!message);if(message)$(input).setAttribute('aria-invalid','true');else $(input).removeAttribute('aria-invalid');}
function asciiGroups(target,observations,locations=true){
 for(const o of observations){
  const group=element('section','','ascii-group');
  const row=(label,value)=>{const line=element('div','','row');line.append(rowLabel(label),element('div',value,'value mono'));group.appendChild(line);};
  row('Potential resemblance',o.alternatives.join(' / '));row('Observed',o.observed.map(s=>'“'+s+'”').join(', '));
  const count=element('p',Presentation.count(o.occurrences.length,'occurrence')+' identified.','small occurrence-count');group.appendChild(count);
  if(locations){
   const list=element('ul','','diagnostic-occurrences mono'),progress=element('p','','small occurrence-progress'),more=element('button','','ghost small');progress.tabIndex=-1;more.type='button';let position=0;
   const next=()=>{
    for(const p of o.occurrences.slice(position,position+50))list.appendChild(element('li',(p.source==='original decoded hostname'?'Decoded hostname':p.source==='readable normalized hostname'?'Readable hostname':p.source)+' · Label '+p.label+', character '+p.offset+' · “'+p.text+'”'));
    position=Math.min(position+50,o.occurrences.length);progress.textContent=position<o.occurrences.length?'Showing '+position+' of '+o.occurrences.length+' locations.':'';
    progress.classList.toggle('hidden',!progress.textContent);more.classList.toggle('hidden',position===o.occurrences.length);
    const nextCount=Math.min(50,o.occurrences.length-position);more.textContent='Show next '+Presentation.count(nextCount,'location');more.setAttribute('aria-label',more.textContent+' for '+o.alternatives.join(' / '));
    if(position===o.occurrences.length&&document.activeElement===more)count.focus({preventScroll:true});
   };
   count.tabIndex=-1;more.addEventListener('click',next);next();group.append(element('div','Locations','key'),list,progress,more);
  }
  target.appendChild(group);
 }
}
function note(message,result){
 const display=Presentation.diagnostic(message),record=element('details','','diagnostic'+(message.level==='info'?' small':''));record.dataset.code=message.code;record.dataset.level=message.level;
 const heading=document.createElement('summary');heading.append(element('span',display.title,'diagnostic-title'),element('span',display.severity,'diagnostic-severity'));
 record.append(heading,element('p',Presentation.diagnosticText(message,result),'diagnostic-explanation small'));
 if(message.code==='ascii-ambiguity'){
  const evidence=element('details','','disclosure observation diagnostic-evidence');evidence.appendChild(element('summary','All ASCII Observations'));const body=element('div','','category-body');asciiGroups(body,result.asciiAmbiguities);evidence.appendChild(body);record.appendChild(evidence);
 }
 const raw=element('details','','disclosure observation raw-diagnostic');raw.append(element('summary','Technical evidence'),element('p',message.text,'diagnostic-text small mono'),element('p','Category: '+display.category+' · Severity: '+display.severity+' · Code: '+message.code,'diagnostic-kind diagnostic-text'));
 record.appendChild(raw);$('messages').appendChild(record);
}
function highlighted(target,text,relevantCharacter=null){clear(target);for(const ch of text){const c=Inspector.info(ch),span=element('span',Inspector.visible(ch));if(c.nonASCII||c.invisible){span.className='badchar';span.dataset.tone=c.invisible||ch===relevantCharacter?'caution':'information';span.title=c.code+' · '+c.name;}target.appendChild(span);}}
function characterChips(target,characters,original,result,comparisonTarget){
 clear(target);
 if(!characters.length){target.appendChild(element('div',original?'No internationalized or hidden characters were identified in the original hostname.':'The readable hostname uses only ASCII characters.','small'));return;}
 const progress=element('div','','small'),more=element('button','Show next 50 characters','ghost small');more.type='button';target.append(progress,more);let position=0;
 const difference=Presentation.unicodeDifference(result,comparisonTarget),describe=value=>[...value].map(ch=>{const i=Inspector.info(ch);return Inspector.visible(ch)+' — '+i.code+' · '+i.name;}).join('\n');
 function nextPage(){const end=Math.min(position+50,characters.length);let firstNewSummary=null;
  for(const c of characters.slice(position,end)){
   const record=element('details','','character');record.dataset.tone=c.invisible||difference?.actual.ch===c.ch?'caution':'information';
   const summary=document.createElement('summary'),heading=element('span',c.code+' · '+c.name,'record-heading');heading.appendChild(element('span',c.evidenceSource||'Character evidence','evidence-source'));summary.append(element('span',Inspector.visible(c.ch),'glyph mono'),heading);record.appendChild(summary);if(!firstNewSummary)firstNewSummary=summary;
   const row=(label,value,descriptor='')=>{const line=element('div','','row');line.append(rowLabel(label,descriptor),element('div',value,'value mono'));record.appendChild(line);};
   row('Observed',Inspector.visible(c.ch));row('Code point',c.code);row('Official name',c.name);row('Writing system',c.script);row('Normalization',Presentation.characterNormalization(c,original,result));
   if(c.idnaStatus==='mapped')row('Mapped representation',describe(c.idnaMapping)||'Removed; no replacement character.');
   else if(c.idnaStatus==='ignored')row('Mapped representation','Removed; no replacement character.');
   else if(result.unicode?.includes(c.ch))row('Readable representation','Same character as observed.');
   else if(original&&result.ok&&!result.decodeError)row('Readable hostname',Inspector.visible(result.unicode),'Unicode');
   if(difference?.actual.ch===c.ch)row('Visually resembles',describe(difference.expected.ch));
   const advanced=element('details','','disclosure observation character-mapping');advanced.appendChild(element('summary','Unicode comparison data'));
   const body=element('div','','category-body small');body.appendChild(element('div','UTS #39 Mapping','key'));
   if(c.confusable===null)body.appendChild(element('p','No UTS #39 mapping is listed for this character.'));
   else{
    body.appendChild(element('p',Inspector.visible(c.ch)+' ('+c.code+') → '+[...c.confusable].map(ch=>Inspector.visible(ch)+' ('+Inspector.cp(ch)+')').join(' '),'mono mapping-value'));
    body.appendChild(element('p','This mapping is used to compare visual similarities. It does not establish that characters occupy corresponding positions in two hostnames.'));
    const names=element('details','','disclosure observation');names.append(element('summary','Mapped character names'),element('p',describe(c.confusable),'category-body mono small'));body.appendChild(names);
   }
   if(comparisonTarget){
    const s=Inspector.skeleton(c.ch),matches=s===null?[]:[...new Set([...comparisonTarget.unicode].filter(ch=>Inspector.skeleton(ch)===s&&ch!==c.ch))];
    if(matches.length&&difference?.actual.ch!==c.ch){const candidates=element('details','','disclosure observation');candidates.append(element('summary','Related comparison characters'),element('p',matches.map(ch=>describe(ch)).join('\n'),'category-body mono small'),element('p','These characters share comparison data. Their positions have not been matched.','category-body small'));body.appendChild(candidates);}
    else if(!matches.length)body.appendChild(element('p','No individual character match was established. Whole-hostname resemblance is a separate comparison.'));
   }
   const raw=element('details','','disclosure observation raw-character');raw.appendChild(element('summary','Raw character data'));
   const rawData=rawText({character:c.ch,codePoint:c.code,name:c.name,writingSystem:c.script,idnaStatus:c.idnaStatus,idnaMapping:c.idnaMapping,confusableMapping:c.confusable});
   raw.appendChild(element('pre',rawData,'category-body mono small'));body.appendChild(raw);advanced.appendChild(body);record.appendChild(advanced);
   if(result.ok)row('Actual Hostname',result.ascii,'ASCII / Punycode');
   target.insertBefore(record,more);
  }
  position=end;progress.textContent=Presentation.count(characters.length,characters.every(c=>c.nonASCII)?'Unicode character':'character')+' identified.'+(position<characters.length?' Showing '+position+' of '+characters.length+'.':'');more.classList.toggle('hidden',position>=characters.length);if(position>=characters.length&&document.activeElement===more)firstNewSummary?.focus({preventScroll:true});
 }
 more.addEventListener('click',nextPage);nextPage();
}
function referenceSummary(refs){
 if(!refs.checked)return 'No saved reference domains were used for this inspection.';
 const parts=[];
 for(const [key,label]of [['exact','Matches'],['subdomains','Subdomain of'],['embedded','Contains the name'],['visual','May look like'],['spelling','Similar spelling to']])if(refs[key].length){const names=refs[key].slice(0,3).map(e=>e.hostname).join(', ');parts.push(label+' '+names+(key==='embedded'?' inside a different hostname':'')+(refs[key].length>3?'; '+Presentation.count(refs[key].length-3,'more match','more matches')+' in Technical Details':'')+'.');}
 if(parts.length)return parts.join(' ')+(refs.unavailable?' Some visual comparisons are unavailable.':'');
 if(refs.unavailable)return 'No exact reference match was found. Some visual comparisons are unavailable.';
 return refs.checked===1?'The saved reference did not produce a supported match.':'None of the '+refs.checked+' saved references produced a supported match.';
}
function comparisonEvidence(result,source,hostname,kind,comparison){
 const record=element('div','','comparison-evidence'),row=(label,value)=>{const line=element('div','','row');line.append(rowLabel(label),element('div',value,label==='Compared with'?'value mono':'value'));record.appendChild(line);};
 row('Comparison source',source);row('Compared with',hostname);row('Result',Presentation.comparisonResult(kind,comparison));
 if(comparison?.visual){
  for(const p of comparison.asciiSubstitutions||[])row('Relevant substitution','“'+p.actual+'” may resemble “'+p.expected+'” in some fonts.');
  let target;try{target=Inspector.expectedHost(hostname);}catch{}
  const difference=Presentation.unicodeDifference(result,target);
  if(difference)row('Relevant character',difference.actual.script+' '+Inspector.visible(difference.actual.ch)+' ('+difference.actual.code+') resembles '+difference.expected.script+' '+Inspector.visible(difference.expected.ch)+' ('+difference.expected.code+').');
 }
 if(comparison){const method=Presentation.comparisonMethod(comparison),advanced=element('details','','disclosure observation');advanced.append(element('summary',method.title),element('p',method.text,'category-body small'));
  const raw=element('details','','disclosure observation');raw.append(element('summary','Technical comparison data'),element('p','Method: '+(comparison.mechanism||'hostname identity / spelling')+(comparison.types?.length?'\nLabel classifications: '+comparison.types.join(', '):'')+(comparison.distance!==undefined?'\nEdit distance: '+comparison.distance:'')+'\nVisual comparison: '+(comparison.unavailable?'unavailable':comparison.exact?'not performed (exact hostname match)':comparison.visual===true?'supported resemblance':comparison.visual===false?'no supported visual resemblance':'unavailable'),'category-body mono small'));advanced.appendChild(raw);record.appendChild(advanced);
 }
 $('referenceCandidates').appendChild(record);
}
function render(r){
  $('results').classList.remove('hidden');for(const id of ['messages','coloredHost','chars','originalChars','supporting','relevantSubstitutions','referenceCandidates','asciiObservations'])clear($(id));
  for(const id of ['ascii','unicode','original','decodedOriginal','normalized','scripts','scheme','port','path','query','fragment','compare','comparisonResult','referenceComparison'])set(id,'—');
  $('compare').className='value mono';$('comparisonResult').className='value';
  const refs=ReferenceDomains.compare(r,referenceStore.snapshot().references),summary=Presentation.summarize(r,refs,!!lastManual.trim());
  fieldError('inspectionError','link',r.ok?'':Presentation.inputFailure(r).detail);fieldError('expectedError','expected',r.expectedError?Presentation.validation(r.expectedError):'');
  $('primary').dataset.kind=summary.kind;set('primaryTitle',summary.title);set('primaryDetail',Presentation.explain(r,summary));
  set('raw',Inspector.visible(r.raw.slice(0,Inspector.MAX_INPUT))+(r.raw.length>Inspector.MAX_INPUT?'\n[Display shortened. The full original URL remains in the input field.]':''));
  set('attributionRaw',r.original?rawText(r.original):'No original hostname was identified.');
  for(const m of r.messages)note(m,r);
  let target=null;try{if(summary.target)target=Inspector.expectedHost(summary.target);}catch{}
  const difference=summary.kind==='visual'?Presentation.unicodeDifference(r,target):null;
  if(r.original){if(r.original.original!==undefined)highlighted($('original'),r.original.original,difference?.actual.ch);else set('original','The original hostname could not be identified with certainty. See the technical evidence.');set('decodedOriginal',r.original.decoded===undefined?'Could not be decoded':Inspector.visible(r.original.decoded)+(r.original.reliable?'':' (unverified)'));}
  const evidence=Presentation.characterEvidence(r);
  characterChips($('originalChars'),evidence.original,true,r,target);
  $('originalCharacterGroup').classList.toggle('hidden',!evidence.original.length&&!!evidence.readable.length);
  $('readableCharacterGroup').classList.toggle('hidden',!evidence.readable.length);
  $('asciiDetails').open=false;set('neutralSlot','');
  set('asciiSummary','ASCII lookalike observations');
  if(!r.ok){$('asciiDetails').classList.add('hidden');return;}
  set('ascii',r.ascii);set('normalized',r.ascii);set('unicode',Inspector.visible(r.unicode));highlighted($('coloredHost'),r.unicode,difference?.actual.ch);characterChips($('chars'),evidence.readable,false,r,target);
  set('scripts',r.writingSystems.join(', ')||'Shared characters; no specific writing system');
  if(r.decodeError){set('coloredHost','The encoded hostname could not be validated. Use the ASCII form above.');set('unicode','Unavailable: encoded hostname validation failed.');set('scripts','Unavailable');clear($('chars'));}
  set('scheme',r.scheme.slice(0,-1)+(r.assumed?' (HTTPS assumed; no scheme was entered)':''));set('port',r.port||(r.original?.port?'Default (input '+r.original.port+'; omitted by the browser)':'Default (not specified)'));set('path',Inspector.visible(r.path||'/'));set('query',Inspector.visible(r.query||'None'));set('fragment',Inspector.visible(r.fragment||'None'));
  if(r.expectedError){set('compare','Could not be checked');set('comparisonResult','Correct the expected hostname above to compare it.');$('comparisonResult').className='value warn';}
  else if(r.comparison){const c=r.comparison;set('compare',r.expected.ascii);set('comparisonResult',c.exact?'Exact hostname match':'Exact hostname mismatch'+(c.visual?' · Potential visual impersonation':c.kind==='spelling'?' · Ordinary spelling similarity':c.unavailable?' · Visual comparison unavailable':''));$('comparisonResult').className='value '+(c.exact?'good':'bad');}
  else{set('compare','Not provided');set('comparisonResult',summary.target?'Saved reference comparison shown below':'No expected hostname entered');}
  // Keep the main reference row brief when a manual target is already authoritative.
  set('referenceComparison',summary.manual?(refs.checked?Presentation.count(refs.checked,'saved reference')+' checked separately. Your expected hostname takes priority.':'No saved reference domains were used for this inspection.'):referenceSummary(refs));
  for(const p of (summary.kind==='visual'&&summary.relevant.length?[]:summary.relevant))$('relevantSubstitutions').appendChild(element('li','“'+p.actual+'” may resemble “'+p.expected+'” in some fonts.'));
  for(const text of Presentation.supporting(r,summary,refs))$('supporting').appendChild(element('li',text));
  if(summary.manual){if(r.comparison){const kind=r.messages.some(m=>m.code==='subdomain')?'subdomains':r.messages.some(m=>m.code==='deceptive-subdomain')?'embedded':r.comparison.kind;comparisonEvidence(r,'Your expected hostname (manual; primary)',r.expected.ascii,kind,r.comparison);}else $('referenceCandidates').appendChild(element('p','No manual comparison: the expected hostname could not be checked.'));}
  if(refs.totalMatches){for(const key of ['exact','subdomains','embedded','visual','spelling'])for(const item of refs[key])comparisonEvidence(r,'Saved reference domain'+(summary.manual?' (secondary)':''),item.hostname,key,item.comparison);}
  else $('referenceCandidates').appendChild(element('p',refs.checked?refs.unavailable?'No exact saved hostname match was found.':referenceSummary(refs):'No saved reference domains were used for this inspection.'));
  if(refs.unavailable)$('referenceCandidates').appendChild(element('p',Presentation.unavailableReferences(refs.unavailable),'comparison-unavailable small warn'));
  const ascii=Presentation.asciiContext(r,summary);$('asciiDetails').classList.toggle('hidden',ascii.hidden);
  for(const p of ascii.relevant)$('asciiObservations').appendChild(element('p','“'+p.actual+'” may resemble “'+p.expected+'” in some fonts.'));
  if(ascii.neutral.length){$('asciiObservations').appendChild(element('p',Presentation.asciiIntroduction));asciiGroups($('asciiObservations'),ascii.neutral,false);}
  if(!ascii.hidden)$('asciiObservations').appendChild(element('p','All observations and their locations are retained in the Full Diagnostic Log.','small'));
}
function analyze(){
  lastManual=$('expected').value;
  try{lastResult=Inspector.inspect($('link').value,lastManual);render(lastResult);}
  catch{lastResult=null;$('results').classList.remove('hidden');for(const id of ['messages','coloredHost','chars','originalChars','supporting','relevantSubstitutions','referenceCandidates','asciiObservations'])clear($(id));for(const id of ['ascii','unicode','original','decodedOriginal','normalized','scripts','scheme','port','path','query','fragment','compare','comparisonResult','referenceComparison'])set(id,'—');set('raw',Inspector.visible($('link').value.slice(0,Inspector.MAX_INPUT))+($('link').value.length>Inspector.MAX_INPUT?'\n[Display shortened. The full original URL remains in the input field.]':''));set('attributionRaw','Original hostname evidence is unavailable because inspection failed.');$('asciiDetails').classList.add('hidden');set('primaryTitle','Inspection could not be completed');set('primaryDetail','No result is available. Check the input and try again.');fieldError('inspectionError','link','Inspection could not be completed. Your original text is still in the input field.');fieldError('expectedError','expected','');$('primary').dataset.kind='error';}
}
function cancelImport(){importPlan=null;importText='';referenceStore.cancelImport();$('importReview').classList.add('hidden');$('importFile').value='';}
function refreshReferences(){
  const state=referenceStore.snapshot();set('referenceCount',state.references.length+(state.mode==='browser'?' saved':' in this tab'));if(state.mode==='browser')storageSavingFailed=false;else if(/could not be written|migration could not be saved/.test(state.status))storageSavingFailed=true;set('storageStatus',Presentation.storageStatus(state,APP.edition,storageSavingFailed));set('storageDetail',Inspector.visible(state.status));set('protectedStorageHelp',state.blocked?(/another tab or app/.test(state.status)?'Export Backup saves the list shown in this tab, not the different saved copy. Review that copy before choosing Replace or Clear.':'Export Backup saves only the readable list shown here. It cannot preserve unreadable saved data. If you need that data, copy the original storage record in browser developer tools before choosing Replace or Clear.'):'');$('protectedStorageHelp').classList.toggle('hidden',!state.blocked);$('storageStatus').dataset.tone=state.mode==='browser'?'information':storageSavingFailed?'error':'caution';$('storageStatus').className=state.mode==='browser'?'small':'small warn';clear($('referenceList'));
  for(const host of state.references){const item=document.createElement('li'),name=document.createElement('div');name.className='ref-name';const decoded=Inspector.expectedHost(host).unicode;name.appendChild(element('span',decoded,'mono'));if(decoded!==host)name.appendChild(element('span',host,'mono small'));if(ReferenceDomains.special(host))name.appendChild(element('span',singleLabel(host)?'Single-label hostname · Exact matches only':'IP address · Exact matches only','small'));
    const edit=element('button','Edit','ghost'),remove=element('button','Remove','ghost');edit.type=remove.type='button';edit.setAttribute('aria-label','Edit reference '+host);remove.setAttribute('aria-label','Remove reference '+host);
    edit.addEventListener('click',()=>{referenceNotice();editingReference=host;$('referenceInput').value=host;set('referenceLabel','Edit reference hostname');set('saveReference','Save edit');$('cancelEdit').classList.remove('hidden');$('referenceInput').focus();});
    remove.addEventListener('click',()=>{try{referenceStore.remove(host);if(editingReference===host)resetEdit();cancelImport();refreshReferences();referenceOutcome('Reference removed.');}catch(e){referenceFailure(e);}});item.append(name,edit,remove);$('referenceList').appendChild(item);
  }
  if(!state.references.length)$('referenceList').appendChild(element('li','No reference domains saved yet.','small'));
  if(lastResult)render(lastResult);
}
function resetEdit(){referenceNotice();editingReference=null;$('referenceInput').value='';set('referenceLabel','Add a reference hostname');set('saveReference','Add');$('cancelEdit').classList.add('hidden');}
function singleLabel(host){return !host.includes('.')&&!host.startsWith('[');}
async function saveReference(){
 if(referenceActionBusy)return;referenceActionBusy=true;
 try{
  const previous=editingReference,host=ReferenceDomains.normalize($('referenceInput').value),entries=referenceStore.snapshot().references;
  if(entries.includes(host)&&host!==previous)throw Error('That normalized hostname is already in Reference Domains.');
  if(!previous&&entries.length>=ReferenceDomains.MAX_ENTRIES)throw Error('The reference list is limited to '+ReferenceDomains.MAX_ENTRIES+' entries.');
  if(singleLabel(host)&&host!==previous&&!await confirmAction({title:'Is This Hostname Complete?',message:'You entered “'+Inspector.visible(host)+'”, which has no domain suffix.\n\nIf you intended a public website, enter its complete hostname. Single-label names are also valid on some private networks, but they can only be matched exactly.',cancelLabel:'Edit Hostname',confirmLabel:previous?'Save as Entered':'Add as Entered',restoreFocus:$('referenceInput')}))return;
  if(previous)referenceStore.edit(previous,host);else referenceStore.add(host);
  resetEdit();cancelImport();refreshReferences();referenceOutcome(previous?'Reference updated.':'Reference added.');
 }catch(e){referenceFailure(e,'hostname',true);}finally{referenceActionBusy=false;}
}
function selectedImportMode(){return $('importReplace').checked?'replace':'merge';}
function reviewImport(){try{
 importPlan=referenceStore.planImport(importText,selectedImportMode());
 const copy=Presentation.importSummary(importPlan);set('importPreviewTitle',copy.title);clear($('importSummary'));for(const line of copy.lines)$('importSummary').appendChild(element('p',line));if(copy.duplicates)$('importSummary').appendChild(element('p',copy.duplicates,'small'));
 clear($('importChanges'));for(const [label,values]of [['To add',importPlan.added],['To remove',importPlan.removed],['References after import',importPlan.final]]){const group=element('div','','import-change-group');group.append(element('h3',label),element('div',values.join('\n')||'None','mono'));$('importChanges').appendChild(group);}
 const internal=importPlan.final.filter(singleLabel);set('importSingleLabels',internal.length?Presentation.count(internal.length,'single-label hostname')+' in this preview: '+internal.join(', ')+'. '+(internal.length===1?'This name may identify a private-network service and can only be matched exactly.':'These names may identify private-network services and can only be matched exactly.'):'');$('importSingleLabels').classList.toggle('hidden',!internal.length);
 $('importReview').classList.remove('hidden');referenceNotice();
 }catch(e){importPlan=null;$('importReview').classList.add('hidden');referenceFailure(e,'import');}}
function beginImport(text){importText=text;$('importMerge').checked=true;$('importReplace').checked=false;reviewImport();}
$('saveReference').addEventListener('click',saveReference);$('referenceInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&!e.isComposing&&!e.repeat){e.preventDefault();saveReference();}});$('cancelEdit').addEventListener('click',resetEdit);
$('clearReferences').addEventListener('click',async()=>{
 if(referenceActionBusy)return;referenceActionBusy=true;
 try{if(!await confirmAction({title:'Clear Reference Domains?',message:'This will clear your current reference list and, if storage is available, the saved list. You can restore references from an exported backup.'+(referenceStore.snapshot().blocked?'\n\nSaved data needs review. Export Backup keeps only the list shown here, not an unreadable or different saved copy. Preserve that copy separately before clearing it.':''),confirmLabel:'Clear References',danger:true}))return;
  referenceStore.clear(true);resetEdit();cancelImport();refreshReferences();referenceOutcome('Reference list cleared.','backup');
 }catch(e){referenceFailure(e,'hostname',false,'backup');}finally{referenceActionBusy=false;}
});
$('exportReferences').addEventListener('click',()=>{try{const url=URL.createObjectURL(new Blob([referenceStore.exportJSON()],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='offline-url-inspector-references.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);referenceNotice('Backup download prepared. Check your downloads to keep the file.','success','',false,'backup');}catch{referenceNotice("The backup download couldn't be created. Try exporting again before closing this tab.",'error','',false,'backup');}});
$('importReferences').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',async()=>{const file=$('importFile').files?.[0];if(!file)return;if(file.size>ReferenceDomains.MAX_BYTES){referenceNotice('This backup is too large. The maximum size is 128 KiB.','error','',false,'backup');return;}try{beginImport(await file.text());}catch{referenceNotice("This file couldn't be read. Choose the backup again; no import changes have been applied.",'error','',false,'backup');}});
$('importMerge').addEventListener('change',reviewImport);$('importReplace').addEventListener('change',reviewImport);$('cancelImport').addEventListener('click',()=>{cancelImport();$('importReferences').focus({preventScroll:true});});
$('applyImport').addEventListener('click',async()=>{
 if(!importPlan||referenceActionBusy)return;referenceActionBusy=true;const plan=importPlan,replace=plan.mode==='replace';
 try{
  if(replace&&!await confirmAction({title:'Replace Reference Domains?',message:'Replace your current list with the reviewed backup?\nCurrent list: '+Presentation.count(referenceStore.snapshot().references.length,'reference')+'\nAfter import: '+Presentation.count(plan.final.length,'reference')+'\n\n'+(plan.removed.length?Presentation.count(plan.removed.length,'existing reference')+' will be removed.':'No existing references will be removed.')+' Keep an exported backup if you may need the old list.'+(referenceStore.snapshot().blocked?'\n\nSaved data needs review. Export Backup keeps only the list shown here, not an unreadable or different saved copy. Preserve that copy separately before replacing it.':''),confirmLabel:'Replace References',danger:true}))return;
  referenceStore.applyImport(plan,replace);cancelImport();refreshReferences();$('importReferences').focus({preventScroll:true});referenceOutcome('Backup applied.','backup');
 }catch(e){referenceFailure(e,'import');}finally{referenceActionBusy=false;}
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
