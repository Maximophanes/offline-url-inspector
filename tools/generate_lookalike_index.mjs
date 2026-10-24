// No network permission or dependency: explicit offline generation/check only.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {root,read,sha,generateIndex} from './lookalike_data_lib.mjs';
let mode=null,output=root,hasOutput=false;
for(let i=0;i<Deno.args.length;i++){
  const arg=Deno.args[i];
  if(arg==='--write'||arg==='--check'){if(mode)throw Error('Choose one mode');mode=arg;}
  else if(arg==='--output-root'){if(hasOutput||!Deno.args[i+1]||Deno.args[i+1].startsWith('--'))throw Error('Expected one output root');hasOutput=true;output=resolve(Deno.args[++i]);}
  else throw Error('Unknown argument');
}
if(!mode)throw Error('Choose --write or --check');
const {outputs,manifest,asset}=await generateIndex();
for(const [name,text]of Object.entries(outputs)){
  if(mode==='--check'){if(read(name,output).toString()!==text)throw Error('Stale or corrupt '+name);}
  else{const path=resolve(output,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,text);}
}
console.log(JSON.stringify({status:mode==='--check'?'verified':'generated',referenceCount:manifest.referenceCount,index:manifest.index,unsupportedVisualReferences:asset.unsupportedVisualReferences.length,spellingKeys:asset.spelling.length,files:Object.fromEntries(Object.entries(outputs).map(([n,t])=>[n,{bytes:new TextEncoder().encode(t).length,sha256:sha(t)}]))},null,2));
