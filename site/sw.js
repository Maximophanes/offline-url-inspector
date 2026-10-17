'use strict';
// This worker knows exactly one application asset. Submitted URLs are never
// accepted as fetch targets, cache keys, message parameters, or navigation URLs.
const RELEASE='3.1.2-fa651e9ae1059f52';
const EXPECTED_HASH='fa651e9ae1059f521fc59396769ab25dd3c4ae4ec877b1e53e91dd62fa9cad27';
const PROJECT_PATH='/offline-url-inspector/';
const SCOPE=new URL(self.registration.scope);
const INDEX_URL=new URL('index.html',SCOPE).href;
const CACHE_PREFIX='offline-url-inspector:/offline-url-inspector/:release:';
const CACHE_NAME=CACHE_PREFIX+RELEASE;
function validScope(){return SCOPE.pathname===PROJECT_PATH&&SCOPE.origin===self.location.origin&&self.location.pathname===PROJECT_PATH+'sw.js';}
function appURL(url){return url.origin===SCOPE.origin&&(url.pathname===PROJECT_PATH||url.pathname===PROJECT_PATH+'index.html');}
async function matchesHash(response){
  if(!response||!response.ok)return false;
  const bytes=await response.clone().arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('')===EXPECTED_HASH;
}
async function cachedRelease(){
  const cache=await caches.open(CACHE_NAME),response=await cache.match(INDEX_URL);
  return await matchesHash(response)?response:null;
}
async function installRelease(){
  if(!validScope())throw Error('Refusing a service worker outside the exact project scope.');
  // A verified existing same-release cache is never deleted on a later failure.
  if(await cachedRelease())return;
  try{
    const response=await fetch(INDEX_URL,{cache:'no-store',credentials:'omit',redirect:'error'});
    if(!await matchesHash(response))throw Error('Incomplete or mismatched application release.');
    const cache=await caches.open(CACHE_NAME);await cache.put(INDEX_URL,response);
    if(!await cachedRelease())throw Error('Cached release could not be verified.');
  }catch(e){await caches.delete(CACHE_NAME);throw e;}
}
self.addEventListener('install',event=>{event.waitUntil(installRelease());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
  if(!validScope()||!await cachedRelease())throw Error('Activation refused: complete release cache unavailable.');
  // Retain one previous working release for controlled rollback/recovery.
  const owned=(await caches.keys()).filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME);
  const previous=owned.at(-1);
  for(const key of owned)if(key!==previous)await caches.delete(key);
  await self.clients.claim();
})());});
self.addEventListener('fetch',event=>{
  if(!validScope()||event.request.method!=='GET'||event.request.mode!=='navigate')return;
  const url=new URL(event.request.url);if(!appURL(url))return;
  event.respondWith((async()=>{
    try{let response=await cachedRelease();if(response)return response;await installRelease();response=await cachedRelease();if(response)return response;}catch{}
    // No arbitrary-request fallback: even cache recovery fetches only INDEX_URL.
    return new Response('The saved offline copy of URL Inspector is unavailable.\n\nReconnect and reopen the app, or use your downloaded standalone HTML file.\n\nIf recovery still fails, use browser developer tools to unregister only the worker scoped to /offline-url-inspector/, then reopen the app online.\n\nReference storage is separate. Export a backup from an open app before clearing site data; other projects may share that data.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
  })());
});
self.addEventListener('message',event=>{
  if(!validScope()||!event.source?.url)return;
  let source;try{source=new URL(event.source.url);}catch{return;}if(!appURL(source))return;
  if(event.data?.type==='GET_CACHE_STATUS')event.waitUntil((async()=>{let ready=false;try{ready=!!await cachedRelease();}catch{}event.ports?.[0]?.postMessage({ready,release:RELEASE});})());
  if(event.data?.type==='ACTIVATE_REVIEWED_UPDATE')event.waitUntil((async()=>{if(!await cachedRelease())await installRelease();if(!await cachedRelease())throw Error('Update cache unavailable.');await self.skipWaiting();})());
});
