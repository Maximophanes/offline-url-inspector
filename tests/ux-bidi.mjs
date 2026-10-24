// Native Firefox BiDi, loopback endpoint only. No inspected destination is opened.
import {writeFileSync} from 'node:fs';
export async function connect(endpoint){
 const ws=new WebSocket(endpoint),pending=new Map(),events=[];let id=0,context=null;
 await new Promise((ok,bad)=>{ws.onopen=ok;ws.onerror=bad;});
 ws.onmessage=e=>{const data=JSON.parse(e.data);if(data.id){const p=pending.get(data.id);if(!p)return;pending.delete(data.id);clearTimeout(p.timer);data.type==='error'?p.bad(Error(data.error+': '+data.message)):p.ok(data.result);}else events.push(data);};
 const command=(method,params={})=>new Promise((ok,bad)=>{const n=++id;pending.set(n,{ok,bad,timer:setTimeout(()=>{pending.delete(n);bad(Error('Timeout: '+method));},20000)});ws.send(JSON.stringify({id:n,method,params}));});
 async function page(code){const r=await command('script.evaluate',{expression:'(async()=>JSON.stringify(await (async()=>{'+code+'})()))()',target:{context},awaitPromise:true});if(r.type==='exception')throw Error(JSON.stringify(r.exceptionDetails));return JSON.parse(r.result.value);}
 async function key(value,modifiers=[]){await command('input.performActions',{context,actions:[{type:'key',id:'keyboard',actions:[...modifiers.map(value=>({type:'keyDown',value})),{type:'keyDown',value},{type:'keyUp',value},...modifiers.toReversed().map(value=>({type:'keyUp',value}))]}]});}
 async function screenshot(path,clip){const r=await command('browsingContext.captureScreenshot',{context,origin:'document',...(clip?{clip:{type:'box',...clip}}:{})});writeFileSync(path,Uint8Array.from(atob(r.data),c=>c.charCodeAt(0)));return path;}
 return {command,page,key,screenshot,events,setContext:value=>{context=value;},getContext:()=>context,close:async()=>{await command('session.end').catch(()=>{});ws.close();}};
}
