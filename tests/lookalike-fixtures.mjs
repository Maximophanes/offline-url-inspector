// Deliberately artificial collision data; never used as production references.
import {sha,canonical} from '../tools/lookalike_data_lib.mjs';
export async function collisionEngine(env,{clock=()=>0}={}){
 const {I,L,foundation}=env,base=JSON.parse(env.foundationManifestText);
 const names=Array.from({length:64},(_,n)=>'a'+Array.from({length:6},(_,i)=>n&(1<<i)?'rn':'m').join('')+'.com').sort();
 const records=Object.freeze(names.map((domain,i)=>Object.freeze([domain,i+1,1,'com','I']))),fixture={...foundation,records};
 base.recordCount=records.length;
 const foundationManifestText=canonical(base),identity={schemaVersion:1,kind:'automatic-lookalike-index',policyId:L.POLICY,foundationManifestSHA256:sha(foundationManifestText),sourceSHA256:fixture.sourceSHA256,pslSHA256:base.psl.sha256,unicodeSHA256:base.unicode.sha256,recordsSHA256:base.assets['data/popular-domains/records.json'].sha256,recordTuplesSHA256:sha(JSON.stringify(records)),referenceCount:records.length};
 const asset={...identity,...L.indexContents(I,fixture)},indexText=canonical(asset),manifest={...env.manifest,...identity,kind:'automatic-lookalike-index-manifest',index:{file:'data/lookalikes/index.json',sha256:sha(indexText),bytes:new TextEncoder().encode(indexText).length}};
 const engine=await L.prepare(I,fixture,{manifest,indexText,foundationManifestText,clock});
 if(engine.status!=='ready')throw Error('Invalid collision fixture '+engine.reason);
 return engine;
}
