// Offline only. Input refresh/extraction is a separate explicitly reviewed action.
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {generate,read,root,sha} from './reference_data_lib.mjs';
const args=[...Deno.args];let write=false,check=false,outputRoot=root,hasOutput=false;
for(let i=0;i<args.length;i++){
  if(args[i]==='--write'){if(write)throw Error('Duplicate --write');write=true;}
  else if(args[i]==='--check'){if(check)throw Error('Duplicate --check');check=true;}
  else if(args[i]==='--output-root'){if(hasOutput||!args[i+1]||args[i+1].startsWith('--'))throw Error('Expected one output-root path');hasOutput=true;outputRoot=resolve(args[++i]);}
  else throw Error('Unknown generator argument');
}
if(write===check)throw Error('Choose exactly --check or --write');
const generated=generate();
for(const [name,value]of Object.entries(generated.outputs)){
  if(check){if(read(name,outputRoot).toString()!==value)throw Error('Stale or corrupt derived asset: '+name);}
  else{const path=resolve(outputRoot,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,value);}
}
console.log(JSON.stringify({status:check?'verified':'generated',provider:'majestic',files:Object.fromEntries(Object.entries(generated.outputs).map(([n,v])=>[n,{bytes:new TextEncoder().encode(v).length,sha256:sha(v)}])),tiers:generated.manifest.tiers},null,2));
