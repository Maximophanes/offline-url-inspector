'use strict';
// Fixed application lifecycle only. No inspected input enters a fetch or message.
const HostedOffline=(()=>{
 const PATH='/offline-url-inspector/';let registration=null,reloadRequested=false,watchAttached=false,checking=null,applying=false;const watched=new WeakSet();
 const el=id=>document.getElementById(id);
 function status(short,detail){el('offlineStatus').textContent=short;el('offlineDetail').textContent=detail;el('offlineHelp').classList.remove('hidden');}
 const feedback=text=>{el('updateStatus').textContent=text;};
 function askStatus(worker){return new Promise(resolve=>{
  if(!worker){resolve(false);return;}const channel=new MessageChannel();
  const timeout=setTimeout(()=>{channel.port1.close();resolve(false);},3000);
  channel.port1.onmessage=e=>{clearTimeout(timeout);channel.port1.close();resolve(e.data?.ready===true);};
  try{worker.postMessage({type:'GET_CACHE_STATUS'},[channel.port2]);}catch{clearTimeout(timeout);channel.port1.close();resolve(false);}
 });}
 async function refresh(){
  const active=registration?.active,waiting=registration?.waiting,installingWorker=registration?.installing,installing=!!installingWorker;
  const [ready,waitingReady]=await Promise.all([askStatus(active),askStatus(waiting)]);
  if(active!==registration?.active||waiting!==registration?.waiting||installingWorker!==registration?.installing)return refresh();
  el('applyUpdate').classList.toggle('hidden',!waiting);
  status(ready?'Offline ready':installing?'Preparing offline access…':'Offline access unavailable',ready?'The complete application cache has been verified. Clearing browser data or private-mode cleanup can remove it; keep the standalone fallback.':'A complete offline cache is not verified. Analysis still runs locally in the loaded page. Reconnect to prepare offline access, or use the standalone file.');
  if(waiting&&!checking)feedback(waitingReady?'Update ready to apply.':'Update available. Its cache needs to be restored before applying; retry online.');
  else if(!waiting&&!installing&&!checking&&/^Update (?:ready to apply\.|available\.)/.test(el('updateStatus').textContent))feedback('');
  return {ready,waiting:!!waiting,waitingReady,installing};
 }
 function watch(){
  const worker=registration?.installing;if(worker&&!watched.has(worker)){watched.add(worker);worker.addEventListener('statechange',async()=>{const state=await refresh();if(worker.state==='redundant'&&!state.waiting)feedback('The update could not be prepared. Your current page is kept; retry online.');});}
  if(!watchAttached){watchAttached=true;registration?.addEventListener('updatefound',()=>{watch();feedback('Update available. Preparing the complete release…');refresh();});}
 }
 function check(){
  if(checking)return checking;if(!registration)return Promise.resolve();
  el('checkCache').disabled=true;el('checkCache').textContent='Checking…';feedback('Checking for updates…');
  checking=(async()=>{
   const offline=navigator.onLine===false;let failed=false;
   if(!offline){try{await registration.update();}catch{failed=true;}}
   const state=await refresh();
   if(offline)feedback('Offline — update check unavailable.');
   else if(failed)feedback('Unable to check for updates. Your current page and saved references were kept.');
   else if(state.waiting)feedback(state.waitingReady?'Update ready to apply.':'Update available. Its complete cache must be restored before applying; retry online.');
   else if(state.installing)feedback('Update available. Preparing the complete release…');
   else feedback('You’re up to date.');
  })().catch(()=>{feedback('Unable to check for updates. Try again when online.');}).finally(()=>{el('checkCache').disabled=false;el('checkCache').textContent='Check for Updates';checking=null;});
  return checking;
 }
 async function start(){
  const url=new URL(location.href);
  if(url.pathname!==PATH&&url.pathname!==PATH+'index.html'){status('Offline access unavailable','Caching is disabled outside the exact /offline-url-inspector/ project path. Local analysis still works.');return;}
  if(!('serviceWorker' in navigator)||!(url.protocol==='https:'||url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname))){status('Offline access unavailable','Service-worker caching is unavailable in this context. Local analysis works; use the standalone file for offline access.');return;}
  const scope=new URL('./',url),worker=new URL('sw.js',scope);
  try{registration=await navigator.serviceWorker.register(worker.href,{scope:scope.href,updateViaCache:'none'});}catch{try{const existing=await navigator.serviceWorker.getRegistration(scope.href);if(existing?.scope===scope.href)registration=existing;}catch{}}
  if(!registration){status('Offline access unavailable','The application cache could not be registered. No offline access is promised; use the standalone fallback.');return;}
  watch();el('updatePanel').classList.remove('hidden');
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadRequested){reloadRequested=false;location.reload();}else refresh();});
  el('checkCache').addEventListener('click',check);
  el('applyUpdate').addEventListener('click',async()=>{
   if(!registration.waiting||applying)return;applying=true;
   try{
    const waiting=registration.waiting,editing=['link','expected','referenceInput'].some(id=>el(id).value)||!el('importReview').classList.contains('hidden');
    if(editing&&!await confirmAction({title:'Apply Update and Reload?',message:'Current URL text, results, and unapplied reference edits or imports will be cleared. Saved reference domains remain.',confirmLabel:'Apply and Reload'}))return;
    if(registration.waiting!==waiting){feedback('The waiting update changed. Check for updates again before applying.');return;}
    reloadRequested=true;feedback('Applying the verified update…');waiting.postMessage({type:'ACTIVATE_REVIEWED_UPDATE'});
    setTimeout(()=>{if(reloadRequested){reloadRequested=false;feedback('The update has not activated. Your current page is kept; retry online.');}},10000);
   }catch{reloadRequested=false;feedback('The update could not be applied. Your current page is kept.');}finally{applying=false;}
  });
  window.addEventListener('online',check);await refresh();
 }
 return Object.freeze({start});
})();
const hostedStartup=HostedOffline.start().catch(()=>{document.getElementById('offlineStatus').textContent='Offline access unavailable';document.getElementById('offlineDetail').textContent='Analysis remains local. Use the standalone fallback.';document.getElementById('offlineHelp').classList.remove('hidden');});
