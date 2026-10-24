// Offline development harness: use the existing Inspector and Stage 2 loader.
import {root,read,json,sha,canonical} from './reference_data_lib.mjs';
export {root,read,json,sha,canonical};
export async function environment(){
  const source=['src/core.js','src/domain-boundaries.js','src/reference-data.js','src/lookalikes.js'].map(n=>read(n).toString()).join('\n');
  const {Inspector:I,ReferenceData,AutomaticLookalikes:L}=new Function('document',source+'\nreturn {Inspector,ReferenceData,AutomaticLookalikes};')({getElementById:id=>{if(id!=='unicode-data')throw Error('Unexpected DOM access');return {textContent:read('data/unicode-data.json').toString()};}});
  const foundationManifestText=read('data/reference-foundation.json').toString(),foundation=await ReferenceData.load(I,{manifest:JSON.parse(foundationManifestText),pslText:read('data/public-suffix/compiled.json').toString(),popularText:read('data/popular-domains/records.json').toString()});
  if(foundation.status!=='ready')throw Error('Foundation unavailable: '+foundation.reason);
  return {I,L,foundation,foundationManifestText};
}
export async function generateIndex(){
  if(Deno.version.deno!=='2.9.7'||Deno.version.v8!=='15.0.245.2-rusty'||Deno.version.typescript!=='6.0.3')throw Error('Unreviewed index generation runtime; use the approved Deno 2.9.7 runtime before generating outputs');
  const env=await environment(),{I,L,foundation,foundationManifestText}=env,fm=JSON.parse(foundationManifestText);
  const identity={schemaVersion:1,kind:'automatic-lookalike-index',policyId:L.POLICY,foundationManifestSHA256:sha(foundationManifestText),sourceSHA256:foundation.sourceSHA256,pslSHA256:fm.psl.sha256,unicodeSHA256:fm.unicode.sha256,recordsSHA256:fm.assets['data/popular-domains/records.json'].sha256,recordTuplesSHA256:sha(JSON.stringify(foundation.records)),referenceCount:foundation.records.length};
  const asset={...identity,...L.indexContents(I,foundation)},text=canonical(asset);
  const files=['src/lookalikes.js','src/core.js','tools/lookalike_data_lib.mjs','tools/generate_lookalike_index.mjs'];
  const manifest={...identity,kind:'automatic-lookalike-index-manifest',developmentOnly:true,automaticUIAvailable:false,engineSourceSHA256:sha(read('src/lookalikes.js')),notice:{file:'data/lookalikes/NOTICE.txt',sha256:sha(read('data/lookalikes/NOTICE.txt'))},generator:{formatVersion:1,files:Object.fromEntries(files.map(n=>[n,sha(read(n))])),runtime:Deno.version},index:{file:'data/lookalikes/index.json',bytes:new TextEncoder().encode(text).length,sha256:sha(text)}};
  return {env,asset,manifest,outputs:{'data/lookalikes/index.json':text,'data/lookalikes/manifest.json':canonical(manifest)}};
}
export async function prepared(options={}){
  const env=await environment(),manifest=json('data/lookalikes/manifest.json'),indexText=read('data/lookalikes/index.json').toString();
  const engine=await env.L.prepare(env.I,env.foundation,{manifest,indexText,foundationManifestText:env.foundationManifestText,...options});
  if(engine.status!=='ready')throw Error('Engine unavailable: '+engine.reason);
  return {...env,engine,manifest,indexText};
}
