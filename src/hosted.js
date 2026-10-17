'use strict';
// Fixed application lifecycle only. No inspected input enters a fetch or message.
function offlineDescription(text){
 const target=document.getElementById('offlineDetail');
 if([...target.children].map(p=>p.textContent).join('\n\n')===text)return;
 target.replaceChildren(...text.split('\n\n').map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
}
const HostedOffline=(()=>{
 const PATH='/offline-url-inspector/';
 let registration=null,workerURL='',scopeURL='',reloadRequested=false,checking=null,applying=false,connecting=null,refreshing=null;
 let registrationPending=false,preparationExpired=false,preparationTimer=null,feedbackType='';
 const watched=new WeakSet(),watchedRegistrations=new WeakSet();
 const el=id=>document.getElementById(id);
 function status(short,detail){if(el('offlineStatus').textContent!==short)el('offlineStatus').textContent=short;offlineDescription(detail);el('offlineHelp').classList.remove('hidden');}
 const feedbackMessages={
  checking:['Checking for updates…','','progress'],
  current:['You’re up to date.','','success'],
  preparing:['Preparing the new version…','','progress','preparing'],
  ready:['Update ready.','Choose Apply Update when you are ready to reload.','progress','waiting'],
  notReady:['Update not ready.','Reconnect and try Apply Update again.','caution','waiting'],
  offline:['Update check unavailable.','You’re offline. Reconnect and try again.','caution'],
  checkFailed:['Update check failed.','Your current page remains available; try again when online.','caution'],
  unverified:['Offline access unverified.','The current page is available, but an offline copy could not be confirmed.','caution'],
  prepareFailed:['Update preparation failed.','The current page remains available. Reconnect and check for updates again.','caution'],
  changed:['Available update changed.','Check for updates again before applying it.','caution'],
  applying:['Applying the update…','Keep this tab open.','progress'],
  pending:['Update still pending.','The update has not finished applying. Your current page remains open; reconnect and try again.','caution'],
  applyFailed:['Update could not be applied.','Your current page remains open; try again when online.','caution'],
  applied:['Update applied.','Reloading the app…','success'],
  setupFailed:['Offline setup unavailable.','Reconnect and try Check for Updates, or use the standalone file.','caution']
 };
 const feedback=(key='')=>{
  const [title='',detail='',tone='progress',type='information']=feedbackMessages[key]||[];
  feedbackType=type;el('updateStatus').dataset.state=key;el('updateStatus').dataset.tone=tone;
  for(const [id,text]of [['updateSummary',title],['updateExplanation',detail]])if(el(id).textContent!==text)el(id).textContent=text;
  el('updateExplanation').classList.toggle('hidden',!detail);
 };
 // A timed-out browser operation may still finish; attach no success claims to it.
 function bounded(operation,ms){return new Promise(resolve=>{
  let settled=false;
  const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);resolve(value);};
  const timer=setTimeout(()=>finish({ok:false}),ms);
  Promise.resolve().then(operation).then(value=>finish({ok:true,value}),()=>finish({ok:false}));
 });}
 function controller(){const active=navigator.serviceWorker.controller;return active?.scriptURL===workerURL?active:null;}
 function askStatus(worker){return new Promise(resolve=>{
  if(!worker){resolve(false);return;}
  let channel,timer;
  const finish=ready=>{clearTimeout(timer);if(channel){channel.port1.onmessage=null;channel.port1.close();channel.port2.close?.();}resolve(ready===true);};
  try{
   channel=new MessageChannel();timer=setTimeout(()=>finish(false),3000);
   channel.port1.onmessage=e=>finish(e.data?.ready===true);
   worker.postMessage({type:'GET_CACHE_STATUS'},[channel.port2]);
  }catch{finish(false);}
 });}
 function present(state){
  const preparing=!state.ready&&(state.installing||registrationPending)&&!preparationExpired;
  if(preparing&&preparationTimer===null)preparationTimer=setTimeout(()=>{preparationTimer=null;preparationExpired=true;refresh();},12000);
  if(!preparing&&preparationTimer!==null){clearTimeout(preparationTimer);preparationTimer=null;}
  el('applyUpdate').classList.toggle('hidden',!state.waiting);
  // Fast cache verification goes from a neutral label directly to verified readiness.
  // Preparing is reserved for an actual installation, not a brief local lookup.
  const short=state.ready?'Offline ready':preparing?(state.installing?'Preparing offline access…':'Offline access'):'Offline access unavailable';
  const detail=state.ready?'A verified copy of the URL Inspector is stored locally, allowing it to work without an internet connection.\n\nClearing browser data may remove this copy. Other browser profiles or isolated browsing sessions may need to cache the application separately.':preparing?'Checking for a verified offline copy. Readiness has not yet been confirmed.':'A verified offline copy could not be confirmed. Inspection still works in this open page.\n\nReconnect and check for updates, or use the standalone HTML file. A new browser profile or isolated session may need its own online visit first.';
  status(short,detail);
  if(state.waiting&&!checking)feedback(state.waitingReady?'ready':'notReady');
  else if(!state.waiting&&!state.installing&&!checking&&['waiting','preparing'].includes(feedbackType))feedback('');
 }
 function refresh(){
  if(refreshing)return refreshing;
  refreshing=(async()=>{
   // One bounded retry when activation changes the snapshot; no recursive polling.
   for(let attempt=0;attempt<2;attempt++){
    const current=registration,active=current?.active||controller(),waiting=current?.waiting,installing=current?.installing;
    const [ready,waitingReady]=await Promise.all([askStatus(active),askStatus(waiting)]);
    if(current!==registration||active!==(registration?.active||controller())||waiting!==registration?.waiting||installing!==registration?.installing)continue;
    const state={ready,waiting:!!waiting,waitingReady,installing:!!installing};present(state);return state;
   }
   const state={ready:false,waiting:!!registration?.waiting,waitingReady:false,installing:!!registration?.installing};present(state);return state;
  })().finally(()=>{refreshing=null;});
  return refreshing;
 }
 function watch(){
  for(const worker of [registration?.active,registration?.waiting,registration?.installing])if(worker&&!watched.has(worker)){
   watched.add(worker);worker.addEventListener('statechange',async()=>{watch();const state=await refresh();if(worker.state==='redundant'&&!state.waiting)feedback('prepareFailed');});
  }
  if(registration&&!watchedRegistrations.has(registration)){
   watchedRegistrations.add(registration);registration.addEventListener('updatefound',()=>{preparationExpired=false;watch();feedback('preparing');refresh();});
  }
 }
 function connect(allowRegister){
  if(registration)return Promise.resolve({created:false});
  if(connecting)return connecting;
  registrationPending=true;
  connecting=(async()=>{
   // Read local registration state before any potentially network-backed register().
   const existing=await bounded(()=>navigator.serviceWorker.getRegistration(scopeURL),1500);
   if(existing.ok&&existing.value?.scope===scopeURL){registration=existing.value;watch();return {created:false};}
   if(!allowRegister||navigator.onLine===false)return {created:false};
   const fresh=await bounded(()=>navigator.serviceWorker.register(workerURL,{scope:scopeURL,updateViaCache:'none'}),6000);
   if(fresh.ok&&fresh.value?.scope===scopeURL){registration=fresh.value;watch();return {created:true};}
   return {created:false};
  })().finally(()=>{registrationPending=false;connecting=null;});
  return connecting;
 }
 function check(){
  if(checking)return checking;
  el('checkCache').disabled=true;el('checkCache').textContent='Checking…';feedback('checking');
  checking=(async()=>{
   const offline=navigator.onLine===false,connection=await connect(!offline);let failed=false;
   if(!offline){if(!registration)failed=true;else if(!connection.created)failed=!(await bounded(()=>registration.update(),6000)).ok;}
   const state=await refresh();
   if(offline)feedback('offline');
   else if(failed)feedback('checkFailed');
   else if(state.waiting)feedback(state.waitingReady?'ready':'notReady');
   else if(state.installing)feedback('preparing');
   else feedback(state.ready?'current':'unverified');
  })().catch(()=>{feedback('checkFailed');}).finally(()=>{el('checkCache').disabled=false;el('checkCache').textContent='Check for Updates';checking=null;});
  return checking;
 }
 async function start(){
  const url=new URL(location.href);
  if(url.pathname!==PATH&&url.pathname!==PATH+'index.html'){status('Offline access unavailable','Offline storage is only available at /offline-url-inspector/. Open the hosted app at its project address or use the standalone file.');return;}
  if(!('serviceWorker' in navigator)||!(url.protocol==='https:'||url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname))){status('Offline access unavailable','This browser or address does not support offline storage for the app. Inspection still works here; use the standalone HTML file for offline access.');return;}
  scopeURL=new URL('./',url).href;workerURL=new URL('sw.js',scopeURL).href;
  el('updatePanel').classList.remove('hidden');el('checkCache').disabled=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if(reloadRequested){reloadRequested=false;feedback('applied');location.reload();}
   else connect(false).then(refresh);
  });
  el('checkCache').addEventListener('click',check);
  el('applyUpdate').addEventListener('click',async()=>{
   if(!registration?.waiting||applying)return;applying=true;
   try{
    const waiting=registration.waiting,store=typeof referenceStore==='undefined'?null:referenceStore.snapshot(),sessionReferences=store&&store.mode!=='browser'&&store.references.length>0;
    const editing=['link','expected','referenceInput'].some(id=>el(id).value)||!el('importReview').classList.contains('hidden')||sessionReferences||el('results')&&!el('results').classList.contains('hidden');
    if(editing&&!await confirmAction({title:'Apply Update and Reload?',message:'Applying the update reloads the app. Current URL text, results and unapplied edits or imports will be cleared.'+(sessionReferences?'\n\nReferences that exist only in this tab will also be lost. Choose Cancel and export a backup if you need to keep them.':'\n\nThe update does not change reference data already saved in browser storage.'),confirmLabel:'Apply and Reload'}))return;
    if(registration.waiting!==waiting){feedback('changed');return;}
    reloadRequested=true;feedback('applying');waiting.postMessage({type:'ACTIVATE_REVIEWED_UPDATE'});
    setTimeout(()=>{if(reloadRequested){reloadRequested=false;feedback('pending');}},10000);
   }catch{reloadRequested=false;feedback('applyFailed');}finally{applying=false;}
  });
  window.addEventListener('online',check);
  // A verified controller can answer even while registration discovery is delayed.
  registrationPending=true;const initial=refresh();await connect(true);await initial;const state=await refresh();
  if(!registration&&!state.ready)feedback('setupFailed');
 }
 return Object.freeze({start});
})();
const hostedStartup=HostedOffline.start().catch(()=>{document.getElementById('offlineStatus').textContent='Offline access unavailable';offlineDescription('Offline access could not be checked. Inspection still works in this page; reload when online or use the standalone HTML file.');document.getElementById('offlineHelp').classList.remove('hidden');});
