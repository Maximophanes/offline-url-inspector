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
 return Object.freeze({request});
})();
const confirmAction=options=>Confirmation.request(options);
const referenceStore=ReferenceDomains.create({storage:()=>window.localStorage,protocol:location.protocol});
const comparisonRecords=new WeakMap();
let lastResult=null,lastManual='',editingReference=null,importText='',importPlan=null,referenceActionBusy=false,storageSavingFailed=false;
function element(tag,text,className=''){const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e;}
function rowLabel(label,descriptor=''){
 const key=element('div',label,'key');if(descriptor)key.append(document.createTextNode(' '),element('span','('+descriptor+')','label-detail'));return key;
}
function referenceNotice(text='',tone='information',raw='',field=false,area='reference'){
 const backup=area==='backup',id=backup?'backupStatus':'referenceError',details=backup?'backupErrorDetails':'referenceErrorDetails',rawId=backup?'backupErrorRaw':'referenceErrorRaw';
 set(backup?'referenceError':'backupStatus','');set(backup?'referenceErrorRaw':'backupErrorRaw','');$(backup?'referenceErrorDetails':'backupErrorDetails').classList.add('hidden');
 const target=$(id);target.dataset.tone=tone;
 const prefix=text?({success:'Success',information:'Information',caution:'Caution',error:'Error'}[tone]+': '):'';
 set(id,prefix+text);set(rawId,Inspector.visible(raw));$(details).classList.toggle('hidden',!raw||tone!=='error'||!Presentation.referenceErrorHasDetails(raw));
 if(field&&tone==='error')$('referenceInput').setAttribute('aria-invalid','true');else $('referenceInput').removeAttribute('aria-invalid');
}
function referenceFailure(error,context='hostname',field=false,area=context==='import'?'backup':'reference'){referenceNotice(Presentation.validation(error.message,context,context==='import'?importText:field?$('referenceInput').value:undefined),'error',error.message,field,area);}
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
 const display=Presentation.diagnostic(message);
 const raw=element('article','','raw-diagnostic-record');raw.dataset.code=message.code;raw.dataset.level=message.level;raw.dataset.category=display.category;
 raw.append(element('h3','Record '+($('rawRecords').children.length+1)+' · '+message.code,'raw-record-title'),element('p',message.text,'diagnostic-text small mono'),element('p','Category: '+display.category+' · Severity: '+display.severity+' · Original level: '+message.level+' · Code: '+message.code,'diagnostic-kind'));
 $('rawRecords').appendChild(raw);
}
function highlighted(target,text,relevantCharacter=null){clear(target);for(const ch of text){const c=Inspector.info(ch),span=element('span',Inspector.visible(ch));if(c.nonASCII||c.invisible){span.className='badchar';span.dataset.tone=c.invisible||ch===relevantCharacter?'caution':'information';span.title=c.code+' · '+c.name;}target.appendChild(span);}}
function characterChips(target,characters,original,result,comparisonTarget){
 clear(target);
 if(!characters.length){target.appendChild(element('div',original?'No internationalized or hidden characters were identified in the original hostname.':'The readable hostname uses only ASCII characters.','small'));return;}
 const progress=element('div','','small character-count'),more=element('button','Show next 50 characters','ghost small');more.type='button';target.append(progress,more);let position=0;
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
   advanced.appendChild(body);record.appendChild(advanced);
   target.insertBefore(record,more);
  }
  position=end;progress.textContent=Presentation.count(characters.length,characters.every(c=>c.nonASCII)?'Unicode character':'character')+' identified.'+(position<characters.length?' Showing '+position+' of '+characters.length+'.':'');more.classList.toggle('hidden',position>=characters.length);if(position>=characters.length&&document.activeElement===more)firstNewSummary?.focus({preventScroll:true});
 }
 more.addEventListener('click',nextPage);nextPage();
}
function referenceNonmatch(result,refs,references){
 if(!refs.checked||refs.totalMatches)return '';
 if(!result.ok)return 'Saved-reference comparisons could not be run because the URL could not be read.';
 if(refs.unavailable)return 'Visual comparisons with '+Presentation.count(refs.unavailable,'saved reference')+' could not be completed.';
 const exactOnly=ReferenceDomains.special(result.ascii)||references.some(ReferenceDomains.special);
 const targets=references.join(', ');
 return (exactOnly?'No exact match with ':'No match with ')+(references.length===1?'your saved reference ':'your saved references ')+targets+'.'+(exactOnly?' IP addresses and single-label names support exact identity only.':'');
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
  record.appendChild(advanced);
 }
 comparisonRecords.set(record,{source,hostname,kind,comparison});
 $('referenceCandidates').appendChild(record);
}
function extractionEvidence(original,failed=false){
 const reliable=original?.reliable===true;
 $('attributionEvidence').open=false;$('attributionEvidence').classList.toggle('hidden',reliable);$('attributionNotice').classList.toggle('hidden',reliable);
 set('attributionNotice',reliable?'':original?.original!==undefined?'The hostname shown above is unverified. It could not be reliably established from the original URL.':'The original hostname could not be established reliably. Check the original URL and parsed hostname values, if available.');
 const reasons={
  'No unambiguous HTTP(S) authority prefix.':'A clear HTTP or HTTPS address prefix could not be identified.',
  'Extra authority slashes or backslashes prevent reliable original-host attribution.':'Extra slashes or backslashes make the start of the hostname ambiguous.',
  'Malformed bracketed IPv6 authority.':'The bracketed IP address or the text following it is incomplete or malformed.',
  'Unbalanced hostname brackets.':'The hostname brackets do not form a matching pair.',
  'Unbracketed IPv6 or multiple port delimiters.':'The hostname contains ambiguous colons. An IPv6 address must use brackets.',
  'Invalid explicit port syntax.':'The port after the hostname is not written as a valid number.',
  'Source offsets could not be reconstructed.':'The hostname could not be traced reliably to its position in the original URL.',
  'Malformed percent encoding in candidate hostname.':'The possible hostname contains incomplete or invalid percent encoding.',
  'Candidate hostname only: browser rejected the URL; destination and normalization are unverified.':'Your browser rejected this URL. The possible hostname and its normalization have not been verified.',
  'Extracted hostname did not agree with the browser parser.':'The extracted hostname did not match the hostname read by your browser.'
 };
 set('attributionReason',reliable?'':failed?'Inspection failed before hostname extraction could be verified. Check the input and try again.':reasons[original?.reason]||'No reliable hostname extraction record was produced.');
}
function renderDiagnosticEvidence(r,refs,summary){
 const showRow=(id,value)=>{set(id,Inspector.visible(value||''));$(id).closest('.row').classList.toggle('hidden',!value);return !!value;};
 extractionEvidence(r.original);
 const shown=new Set([r.ascii,...(!r.decodeError&&r.unicode?[r.unicode]:[])]),forms=[['unicode',r.decodeError?'':r.unicode],['decodedOriginal',r.original?.decoded],['original',r.original?.original]];let formsShown=false;
 for(const [id,value]of forms){const useful=value&&!shown.has(value);formsShown=showRow(id,useful?value:'')||formsShown;if(value)shown.add(value);}
 $('originalDetails').classList.toggle('hidden',!formsShown&&r.original?.reliable===true);
 const evidence=Presentation.characterEvidence(r),hasCharacters=evidence.original.length||evidence.readable.length;
 $('characterDetails').classList.toggle('hidden',!hasCharacters);
 $('originalCharacterGroup').classList.toggle('hidden',!evidence.original.length);$('readableCharacterGroup').classList.toggle('hidden',!evidence.readable.length);
 let target=null;try{if(summary.target)target=Inspector.expectedHost(summary.target);}catch{}
 if(evidence.original.length)characterChips($('originalChars'),evidence.original,true,r,target);
 if(evidence.readable.length)characterChips($('chars'),evidence.readable,false,r,target);
 const componentRows=[['scheme',r.scheme==='http:'?'HTTP':r.assumed?'HTTPS assumed; no scheme was entered':''],['port',r.port||(r.original?.port?'Default port; input '+r.original.port:'')],['path',r.path&&r.path!=='/'?r.path:''],['query',r.query],['fragment',r.fragment]];
 let componentsShown=false;for(const [id,value]of componentRows)componentsShown=showRow(id,value)||componentsShown;
 $('componentsDetails').classList.toggle('hidden',!componentsShown);
 // Reference outcomes are rendered once, from structured evidence, not prose.
 const list=$('referenceCandidates');list.replaceChildren();
 const groups=new Map(),add=(source,hostname,kind,comparison)=>{
  const proof=kind==='exact'||comparison?.exact?'exact':comparison?.visual?comparison.mechanism:kind,key=hostname+'|'+proof;
  const group=groups.get(key);if(group){group.sources.add(source);group.comparison??=comparison;}else groups.set(key,{sources:new Set([source]),hostname,kind,comparison});
 };
 if(r.expectedError)list.appendChild(element('p','Expected Hostname could not be checked. '+Presentation.validation(r.expectedError),'small'));
 else if(r.comparison){const kind=r.messages.some(m=>m.code==='subdomain')?'subdomains':r.messages.some(m=>m.code==='deceptive-subdomain')?'embedded':r.comparison.kind;add('Expected Hostname supplied by you',r.expected.ascii,kind,r.comparison);}
 for(const key of ['exact','subdomains','embedded','visual','spelling'])for(const item of refs[key])add('Personal Reference Domains',item.hostname,key,item.comparison);
 for(const group of groups.values())comparisonEvidence(r,[...group.sources].join('; '),group.hostname,group.kind,group.comparison);
 const references=referenceStore.snapshot().references,nonmatch=referenceNonmatch(r,refs,references);if(nonmatch)list.appendChild(element('p',nonmatch));
 if(refs.unavailable&&refs.totalMatches)list.appendChild(element('p','Visual comparisons with '+Presentation.count(refs.unavailable,'saved reference')+' could not be completed.','small warn'));
}
let diagnosticState=null;
function clearDiagnosticEvidence(){
 if(diagnosticState){diagnosticState.rendered=false;diagnosticState.rawRendered=false;}
 for(const reveal of document.querySelectorAll('.embedded-reveal')){reveal.open=false;reveal.querySelector('.category-body').replaceChildren();}
 for(const id of ['rawRecords','chars','originalChars','referenceCandidates','asciiObservations','embeddedCandidates','embeddedLimitations','embeddedLimitDetails','comparisonDiagnosticRecords'])clear($(id));
 for(const id of ['unicode','original','decodedOriginal','scheme','port','path','query','fragment','raw','attributionNotice','attributionReason','embeddedStatus','embeddedCount'])set(id,'');
 for(const node of $('diagnostics').querySelectorAll('details'))node.open=false;
}
function render(r){
 clearDiagnosticEvidence();$('diagnostics').open=false;
 $('results').classList.remove('hidden');set('ascii',r.ok?r.ascii:'—');document.querySelector('.result-identity').classList.toggle('hidden',!r.ok);
 const readable=r.ok&&!r.decodeError&&r.unicode&&r.unicode!==r.ascii;set('actualHostnameLabel',readable?'Browser hostname (ASCII / Punycode)':'Actual hostname');set('readableHostname',readable?Inspector.visible(r.unicode):'');set('readableHostnameCue',readable?Inspector.visible(ResultsPresentation.readableCue(r)):'');$('readableHostnameGroup').classList.toggle('hidden',!readable);
 const references=referenceStore.snapshot().references,refs=ReferenceDomains.compare(r,references),summary=Presentation.summarize(r,refs,!!lastManual.trim());
 diagnosticState={r,refs,summary,embedded:null,rendered:false};
 fieldError('inspectionError','link',r.ok?'':Presentation.inputFailure(r).detail);fieldError('expectedError','expected',r.expectedError?Presentation.validation(r.expectedError):'');
 const embedded=EmbeddedUI.update(r,references,{defer:true});diagnosticState.embedded=embedded;
 AutomaticUI.update(r,{references,embedded,referenceResult:refs});
}
function hydrateDiagnosticEvidence(){
 if(!diagnosticState||diagnosticState.rendered)return;diagnosticState.rendered=true;
 if(diagnosticState.failed){for(const id of ['comparisonDiagnostics','originalDetails','characterDetails','componentsDetails','embeddedDetails'])$(id).classList.add('hidden');return;}
 const {r,refs,summary,embedded}=diagnosticState;renderDiagnosticEvidence(r,refs,summary);EmbeddedUI.render(embedded);
 $('embeddedDetails').classList.toggle('hidden',!embedded.candidates.length&&!embedded.limitations.length);
 $('embeddedStatus').classList.toggle('hidden',embedded.status==='complete');
}
function hydrateRawRecords(){
 if(!diagnosticState||diagnosticState.failed||diagnosticState.rawRendered)return;diagnosticState.rawRendered=true;
 for(const message of diagnosticState.r.messages)note(message,diagnosticState.r);
 $('asciiDetails').classList.toggle('hidden',!diagnosticState.r.asciiAmbiguities?.length);
}
$('rawDiagnostics').addEventListener('toggle',()=>{
 if($('rawDiagnostics').open)hydrateRawRecords();else{if(diagnosticState)diagnosticState.rawRendered=false;clear($('rawRecords'));clear($('asciiObservations'));set('raw','');for(const node of $('rawDiagnostics').querySelectorAll('details'))node.open=false;}
});
$('asciiDetails').addEventListener('toggle',()=>{clear($('asciiObservations'));if($('asciiDetails').open&&diagnosticState?.r)asciiGroups($('asciiObservations'),diagnosticState.r.asciiAmbiguities);});
$('originalInputDisclosure').addEventListener('toggle',()=>{const raw=diagnosticState?.r?.raw??diagnosticState?.raw??'';set('raw',$('originalInputDisclosure').open?Inspector.visible(raw.slice(0,Inspector.MAX_INPUT))+(raw.length>Inspector.MAX_INPUT?'\n[Display shortened. The full original URL remains in the input field.]':''):'');});
$('diagnostics').addEventListener('toggle',()=>{if(!$('diagnostics'))return;if($('diagnostics').open)hydrateDiagnosticEvidence();else clearDiagnosticEvidence();});
function openAddressEvidence(hostname){
 $('advanced').open=true;$('diagnostics').open=true;hydrateDiagnosticEvidence();$('embeddedDetails').open=true;
 const entry=diagnosticState?.embedded.candidates.find(c=>c.hostname?.replace(/\.$/,'').toLowerCase()===hostname);
 const heading=entry?document.getElementById('embedded-entry-'+entry.id):null;(heading||$('embeddedDetails').querySelector('summary')).focus();
}
$('advanced').addEventListener('toggle',()=>{if(!$('advanced'))return;if(!$('advanced').open){$('diagnostics').open=false;clearDiagnosticEvidence();}});

function analyze(){
  lastManual=$('expected').value;
  if(typeof AutomaticUI!=='undefined')AutomaticUI.clear();
  try{lastResult=Inspector.inspect($('link').value,lastManual);render(lastResult);}
  catch{EmbeddedUI.update(null,[],{defer:true});lastResult=null;diagnosticState={failed:true,raw:$('link').value,rendered:false};document.querySelector('.result-identity').classList.add('hidden');$('primary').classList.remove('hidden');$('results').classList.remove('hidden');clearDiagnosticEvidence();set('ascii','—');set('primaryTitle','Inspection could not be completed');set('primaryDetail','No result is available. Check the input and try again.');set('automaticAnnouncement','Inspection could not be completed.');fieldError('inspectionError','link','Inspection could not be completed. Your original text is still in the input field.');fieldError('expectedError','expected','');$('primary').dataset.kind='error';}
}
function cancelImport(){importPlan=null;importText='';referenceStore.cancelImport();$('importReview').classList.add('hidden');$('importFile').value='';}
function refreshReferences(){
  const state=referenceStore.snapshot();set('referenceCount',state.references.length+(state.mode==='browser'?' saved':' in this tab'));if(state.mode==='browser')storageSavingFailed=false;else if(/could not be written|migration could not be saved/.test(state.status))storageSavingFailed=true;set('storageStatus',Presentation.storageStatus(state,APP.edition,storageSavingFailed));set('protectedStorageHelp',state.blocked?(/another tab or app/.test(state.status)?'Export Backup saves the list shown in this tab, not the different saved copy. Review that copy before choosing Replace or Clear.':'Export Backup saves only the readable list shown here. It cannot preserve unreadable saved data. If you need that data, copy the original storage record in browser developer tools before choosing Replace or Clear.'):'');$('protectedStorageHelp').classList.toggle('hidden',!state.blocked);$('storageStatus').dataset.tone=state.mode==='browser'?(state.revision>0||state.status.startsWith('Reference schema migrated')?'success':'information'):storageSavingFailed?'error':'caution';$('storageStatus').className=state.mode==='browser'?'small':'small warn';if(!state.references.length&&state.mode==='browser'&&!state.blocked&&!storageSavingFailed&&/^(Saved|Local-file storage can be read|Browser storage can be read)/.test(state.status)){set('storageStatus','');$('storageStatus').classList.add('hidden');}clear($('referenceList'));
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
$('exportReferences').addEventListener('click',()=>{try{const url=URL.createObjectURL(new Blob([referenceStore.exportJSON()],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='offline-url-inspector-references.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);referenceNotice('Backup download prepared. Check your downloads to keep the file.','success','',false,'backup');}catch(e){referenceNotice("The backup download couldn't be created. Try exporting again before closing this tab.",'error',e.message,false,'backup');}});
$('importReferences').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',async()=>{const file=$('importFile').files?.[0];if(!file)return;if(file.size>ReferenceDomains.MAX_BYTES){referenceNotice('This backup is too large. The maximum size is 128 KiB.','error','',false,'backup');return;}try{beginImport(await file.text());}catch(e){referenceNotice("This file couldn't be read. Choose the backup again; no import changes have been applied.",'error',e.message,false,'backup');}});
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
