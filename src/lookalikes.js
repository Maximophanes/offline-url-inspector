'use strict';
// Offline, dormant matching only. No URL parsing, DOM, storage, network or UI.
// Callers supply a verified ReferenceData foundation and integrity-bound index.
const AutomaticLookalikes = (() => {
  const FORMAT=1,POLICY='full-domain-conservative-v2';
  const LIMITS=Object.freeze({candidateIds:32,pairsPerHostname:32,pairsPerInspection:256,spellingStatesPerHostname:4096,spellingStatesPerInspection:16384,milliseconds:50});
  const ORDER=['unicode-visual','ascii-visual','structural','spelling'];
  const ascii=s=>/^[a-z0-9.-]+$/i.test(s),nonASCII=s=>/[^\x00-\x7f]/.test(s);
  const lexical=(a,b)=>a<b?-1:a>b?1:0;
  const frozen=value=>{if(value&&typeof value==='object'){for(const v of Object.values(value))frozen(v);Object.freeze(value);}return value;};
  const variants=s=>[...new Set([s,...[...s].map((_,i)=>s.slice(0,i)+s.slice(i+1))])].sort();
  function registrant(domain,suffix){return domain.slice(0,-suffix.length-1);}
  function indexContents(I,foundation){
    if(I?.version!=='18.0.0'||foundation?.status!=='ready'||foundation.provider!=='majestic'||!Array.isArray(foundation.records)||foundation.records.length<1||foundation.records.length>10000)throw Error('Incompatible foundation');
    const keys=[],spelling=new Map(),lengths=new Set(),unsupported=[];
    let previous='';
    for(const [id,row] of foundation.records.entries()){
      const [domain,rank,,suffix]=row;
      if(domain<=previous)throw Error('Unordered foundation');previous=domain;
      const readable=I.unicodeHost(domain),skeleton=I.skeleton(readable),visual=ascii(readable)?I.asciiVisual(readable):null;
      keys.push([id,skeleton,visual]);if(skeleton===null)unsupported.push(id);lengths.add(domain.split('.').length);
      const label=registrant(domain,suffix);
      if(rank<=1000&&ascii(readable)&&!label.startsWith('xn--')&&/^[a-z0-9-]{6,63}$/.test(label))for(const key of variants(label)){
        const value=suffix+'|'+key;if(!spelling.has(value))spelling.set(value,[]);spelling.get(value).push(id);
      }
    }
    const ranked=ids=>ids.sort((a,b)=>foundation.records[a][1]-foundation.records[b][1]||a-b);
    return {keys,spelling:[...spelling].sort(([a],[b])=>lexical(a,b)).map(([key,ids])=>[key,ranked(ids)]),structuralLabelCounts:[...lengths].sort((a,b)=>a-b),unsupportedVisualReferences:unsupported};
  }
  function spellingMechanism(I,a,b){
    if(a===b||a.length<6||b.length<6||Math.abs(a.length-b.length)>1||I.editDistance(a,b)!==1)return null;
    if(a.slice(1)===b||b.slice(1)===a)return null;
    if(a.replace(/\d+$/,'')===b.replace(/\d+$/,''))return null;
    if(a.replaceAll('-','')===b.replaceAll('-',''))return null;
    let at=0;while(a[at]===b[at]&&at<Math.min(a.length,b.length))at++;
    if(at===0)return null;
    if(a.length===b.length){
      if(a.slice(at+1)===b.slice(at+1))return {operation:'substitution',offset:at,actual:a[at],reference:b[at],distance:1};
      if(a[at]===b[at+1]&&a[at+1]===b[at]&&a.slice(at+2)===b.slice(at+2))return {operation:'adjacent-transposition',offset:at,actual:a.slice(at,at+2),reference:b.slice(at,at+2),distance:1};
    }else if(a.length>b.length&&a.slice(at+1)===b.slice(at))return {operation:'insertion',offset:at,actual:a[at],reference:'',distance:1};
    else if(b.length>a.length&&a.slice(at)===b.slice(at+1))return {operation:'deletion',offset:at,actual:'',reference:b[at],distance:1};
    return null;
  }
  function unicodeMechanism(I,a,b,context){
    if(a===b||!(nonASCII(a)||nonASCII(b)))return null;
    const key=context.key;if(key===null||key!==I.skeleton(b))return null;
    const aa=[...a],bb=[...b];let start=0,endA=aa.length,endB=bb.length;
    while(start<Math.min(endA,endB)&&aa[start]===bb[start])start++;
    while(endA>start&&endB>start&&aa[endA-1]===bb[endB-1]){endA--;endB--;}
    const changedA=aa.slice(start,endA),changedB=bb.slice(start,endB),characters=s=>s.slice(0,32).map((ch,offset)=>({offset:start+offset,...context.info(ch)}));
    return {algorithm:'UTS #39 rev.34 LTR',skeleton:key,actualReadable:a,referenceReadable:b,actualScripts:context.scripts,referenceScripts:I.scripts(b),confusableType:I.confusableType(a,b),changedOffset:start,actualChangedSpan:changedA.join(''),referenceChangedSpan:changedB.join(''),actualCharacters:characters(changedA),referenceCharacters:characters(changedB),characterDetailsTruncated:changedA.length>32||changedB.length>32,transformations:Math.max(changedA.length,changedB.length)};
  }
  const unavailable=reason=>frozen({status:'unavailable',reason,compare:()=>({status:'unavailable',findings:[],exact:null,coverage:{all:'unavailable'},limitations:[reason]})});
  async function prepare(I,foundation,{manifest,indexText,foundationManifestText,clock=()=>performance.now()}={}){
    if(!manifest||!indexText||!foundationManifestText)return unavailable('missing-index');
    if(manifest.schemaVersion!==FORMAT||manifest.kind!=='automatic-lookalike-index-manifest'||manifest.policyId!==POLICY)return unavailable('unsupported-index');
    if(I?.version!=='18.0.0'||foundation?.status!=='ready')return unavailable('incompatible-foundation');
    if(typeof indexText!=='string'||typeof foundationManifestText!=='string'||indexText.length>2097152||foundationManifestText.length>65536)return unavailable('corrupt-index');
    if(!globalThis.crypto?.subtle)return unavailable('integrity-unavailable');
    const hash=async value=>[...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');
    try{
      if(await hash(indexText)!==manifest.index.sha256||new TextEncoder().encode(indexText).length!==manifest.index.bytes)return unavailable('corrupt-index');
      if(await hash(foundationManifestText)!==manifest.foundationManifestSHA256)return unavailable('incompatible-foundation');
      const fm=JSON.parse(foundationManifestText),asset=JSON.parse(indexText);
      if(fm.unicode?.sha256!=='806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1'||manifest.unicodeSHA256!==fm.unicode.sha256)return unavailable('incompatible-unicode');
      if(manifest.pslSHA256!==fm.psl?.sha256)return unavailable('incompatible-psl');
      if(manifest.generator?.files?.['src/core.js']!==fm.generator?.files?.['src/core.js']||manifest.engineSourceSHA256!==manifest.generator?.files?.['src/lookalikes.js']||!/^[a-f0-9]{64}$/.test(manifest.engineSourceSHA256)||manifest.index.file!=='data/lookalikes/index.json')return unavailable('incompatible-engine');
      if(manifest.recordsSHA256!==fm.assets?.['data/popular-domains/records.json']?.sha256||manifest.sourceSHA256!==foundation.sourceSHA256||manifest.sourceSHA256!==fm.source?.original?.sha256||manifest.referenceCount!==foundation.records.length||fm.recordCount!==foundation.records.length||await hash(JSON.stringify(foundation.records))!==manifest.recordTuplesSHA256)return unavailable('incompatible-records');
      const identity={schemaVersion:FORMAT,kind:'automatic-lookalike-index',policyId:POLICY,foundationManifestSHA256:manifest.foundationManifestSHA256,sourceSHA256:manifest.sourceSHA256,pslSHA256:manifest.pslSHA256,unicodeSHA256:manifest.unicodeSHA256,recordsSHA256:manifest.recordsSHA256,recordTuplesSHA256:manifest.recordTuplesSHA256,referenceCount:manifest.referenceCount};
      for(const [key,value]of Object.entries(identity))if(asset[key]!==value)return unavailable('incompatible-index');
      // Recompute once, not per inspection: rejects rehashed key/bucket corruption,
      // truncation and native-runtime normalization changes, without trusting IDs.
      const expected=indexContents(I,foundation);
      if(JSON.stringify(Object.keys(asset).sort())!==JSON.stringify([...Object.keys(identity),...Object.keys(expected)].sort()))return unavailable('corrupt-index');
      for(const key of Object.keys(expected))if(JSON.stringify(asset[key])!==JSON.stringify(expected[key]))return unavailable('corrupt-index');
      const records=foundation.records,exact=new Map(records.map((r,id)=>[r[0],id])),unicode=new Map(),visual=new Map(),spelling=new Map(asset.spelling);
      const structuralLabelCounts=asset.structuralLabelCounts,unsupportedReferenceCount=asset.unsupportedVisualReferences.length;
      const add=(map,key,id)=>{if(key===null)return;if(!map.has(key))map.set(key,[]);map.get(key).push(id);};
      for(const [id,u,a]of asset.keys){add(unicode,u,id);add(visual,a,id);}
      for(const map of [unicode,visual])for(const ids of map.values())ids.sort((a,b)=>records[a][1]-records[b][1]||a-b);
      const metadata=frozen({...identity,indexSHA256:manifest.index.sha256,engineSourceSHA256:manifest.engineSourceSHA256,coreSourceSHA256:fm.generator.files['src/core.js'],rankingMeasure:'Majestic GlobalRank (referring-subnet ranking)',crossSuffixRegistrantComparison:false});
      const sessions=new WeakMap();
      function createSession(options={}){
        const limits={...LIMITS};
        for(const [name,value]of Object.entries(options.limits||{})){if(!Object.hasOwn(LIMITS,name)||!Number.isFinite(value)||value<0||value>LIMITS[name]||(name!=='milliseconds'&&!Number.isInteger(value)))throw Error('Limits may only lower finite defaults');limits[name]=value;}
        const state={limits:Object.freeze(limits),pairs:0,spellingStates:0,start:clock()},token=Object.freeze({snapshot:()=>Object.freeze({pairs:state.pairs,spellingStates:state.spellingStates,limits:state.limits})});sessions.set(token,state);return token;
      }
      function compare(hostname,token=createSession()){
        const session=sessions.get(token);
        if(!session)return {status:'unavailable',exact:null,findings:[],coverage:{all:'unavailable'},limitations:['invalid-session']};
        const boundary=foundation.boundaries.lookup(hostname),coverage={exact:'not-applicable',unicode:'not-applicable',ascii:'not-applicable',structural:'not-applicable',spelling:'not-applicable'},limitations=[];
        const work={candidateIds:0,verifiedPairs:0,spellingStates:0,structuralWindows:0};
        const response={status:'complete',inputHostname:typeof hostname==='string'&&hostname.length<=2048?hostname:null,hostname:boundary.asciiHost??null,registrableDomain:boundary.registrableDomain??null,boundary,exact:null,findings:[],coverage,limitations,work,metadata};
        if(boundary.status!=='ok'){response.status=boundary.status==='invalid'||boundary.status==='unavailable'?'unavailable':'ineligible';limitations.push('boundary-'+boundary.status);return response;}
        const domain=boundary.registrableDomain,readable=boundary.unicodeRegistrableDomain,actualLabel=registrant(domain,boundary.publicSuffix),candidates=new Map();
        const partial=reason=>{response.status='partial';if(!limitations.includes(reason))limitations.push(reason);};
        const timed=()=>{if(clock()-session.start>=session.limits.milliseconds){partial('cooperative-time-budget');return true;}return false;};
        const reference=id=>{const r=records[id];return {id,domain:r[0],source:'Majestic Million',globalRank:r[1],sourceRowCount:r[2],publicSuffix:r[3],section:r[4]==='I'?'ICANN':'PRIVATE'};};
        coverage.exact='complete';const member=exact.get(domain);
        if(member!==undefined)response.exact={classification:'neutral-membership',reference:reference(member)};
        let original=domain;
        if(typeof hostname==='string'&&ascii(hostname.replace(/\.$/,'')))original=hostname.replace(/\.$/,'').split('.').slice(-domain.split('.').length).join('.');
        const request=(id,kind,placement)=>{
          if(!candidates.has(id)){
            if(candidates.size>=session.limits.candidateIds){partial('candidate-id-limit');coverage[kind]='partial';return;}
            candidates.set(id,{kinds:new Set(),placements:[]});
          }
          const c=candidates.get(id);c.kinds.add(kind);if(placement)c.placements.push(placement);
        };
        const bucket=(map,key,kind)=>{
          const ids=map.get(key)||[],take=Math.min(ids.length,session.limits.candidateIds);
          if(ids.length>take){partial('index-collision-limit');coverage[kind]='partial';}
          for(let i=0;i<take;i++)request(ids[i],kind);
        };
        if(timed()){for(const key of ['unicode','ascii','structural','spelling'])coverage[key]='partial';return response;}
        const skeleton=I.skeleton(readable);
        coverage.unicode=skeleton===null?'unsupported':'complete';if(skeleton===null)limitations.push('uts39-rtl-bidi-unavailable');
        if(skeleton!==null&&unsupportedReferenceCount){coverage.unicode='partial';partial('unsupported-reference-visual-comparisons');}
        if(skeleton!==null&&!timed())bucket(unicode,skeleton,'unicode');else if(skeleton!==null)coverage.unicode='partial';
        coverage.ascii=ascii(readable)?'complete':'not-applicable';
        if(ascii(readable)&&!timed())for(const key of new Set([I.asciiVisual(readable),I.asciiVisual(original)]))bucket(visual,key,'ascii');else if(ascii(readable))coverage.ascii='partial';
        coverage.structural='complete';
        const labels=boundary.asciiHost.split('.'),outside=labels.length-domain.split('.').length;
        for(let start=0;start<outside&&!timed();start++)for(const count of structuralLabelCounts){
          // A sequence may end on the actual registrant label, but never enter
          // its public suffix. It must still start in a genuine subdomain.
          if(start+count>outside+1)continue;work.structuralWindows++;
          const id=exact.get(labels.slice(start,start+count).join('.'));if(id!==undefined&&id!==member)request(id,'structural',{startLabel:start,endLabelExclusive:start+count,sequence:records[id][0]});
        }
        if(response.status==='partial'&&limitations.includes('cooperative-time-budget'))coverage.structural='partial';
        coverage.spelling=member!==undefined?'suppressed-exact-membership':ascii(readable)&&!actualLabel.startsWith('xn--')&&/^[a-z0-9-]{6,63}$/.test(actualLabel)?'complete':'not-applicable';
        if(coverage.spelling==='complete')for(const key of variants(actualLabel)){
          if(timed()||work.spellingStates>=session.limits.spellingStatesPerHostname||session.spellingStates>=session.limits.spellingStatesPerInspection){partial('spelling-traversal-budget');coverage.spelling='partial';break;}
          work.spellingStates++;session.spellingStates++;
          const ids=spelling.get(boundary.publicSuffix+'|'+key)||[];
          for(const id of ids){
            if(work.spellingStates>=session.limits.spellingStatesPerHostname||session.spellingStates>=session.limits.spellingStatesPerInspection){partial('spelling-traversal-budget');coverage.spelling='partial';break;}
            work.spellingStates++;session.spellingStates++;request(id,'spelling');
            if(response.status==='partial'&&limitations.includes('candidate-id-limit'))break;
          }
        }
        work.candidateIds=candidates.size;
        let unicodeContext;
        for(const [id,candidate]of candidates){
          if(timed()||work.verifiedPairs>=session.limits.pairsPerHostname||session.pairs>=session.limits.pairsPerInspection){partial('verification-budget');for(const key of ['unicode','ascii','structural','spelling'])if(coverage[key]==='complete')coverage[key]='partial';break;}
          work.verifiedPairs++;session.pairs++;
          const ref=reference(id),other=ref.domain.includes('xn--')?I.unicodeHost(ref.domain):ref.domain,evidence=[];
          if(ref.domain!==domain){
            if(candidate.kinds.has('unicode')&&(nonASCII(readable)||nonASCII(other))){
              if(!unicodeContext){const cache=new Map();unicodeContext={key:skeleton,scripts:I.scripts(readable),info:ch=>{if(!cache.has(ch))cache.set(ch,{...I.info(ch),characterSkeleton:I.skeleton(ch)});return cache.get(ch);}};}
              const mechanism=unicodeMechanism(I,readable,other,unicodeContext);if(mechanism)evidence.push({class:'unicode-visual',comparisonScope:'full-registrable-domain',mechanism});
            }
            if(candidate.kinds.has('ascii')&&ascii(readable)&&ascii(other)){
              const substitutions=I.asciiComparisonDetails(original,readable,{original:ref.domain,unicode:other});
              if(substitutions.length)evidence.push({class:'ascii-visual',comparisonScope:'full-registrable-domain',mechanism:{algorithm:'existing finite ASCII visual rules',substitutions,fontDependent:true,transformations:substitutions.length}});
            }
            if(candidate.kinds.has('spelling')&&ref.globalRank<=1000&&ref.publicSuffix===boundary.publicSuffix){
              const mechanism=spellingMechanism(I,actualLabel,registrant(ref.domain,ref.publicSuffix));if(mechanism)evidence.push({class:'spelling',comparisonScope:'registrant-label-same-suffix',mechanism,priority:'low'});
            }
          }
          if(candidate.placements.length)evidence.push({class:'structural',comparisonScope:candidate.placements.some(p=>p.endLabelExclusive>outside)?'complete-label-sequence-crossing-registrant-boundary':'complete-label-sequence-outside-registrable-domain',mechanism:{occurrences:candidate.placements,actualRegistrableDomain:domain,publicSuffix:boundary.publicSuffix,section:boundary.section}});
          if(evidence.length){
            evidence.sort((a,b)=>ORDER.indexOf(a.class)-ORDER.indexOf(b.class));
            response.findings.push({hostname:boundary.asciiHost,registrableDomain:domain,reference:ref,evidence,comparisonAvailability:'supported',suffixAgreement:ref.publicSuffix===boundary.publicSuffix,priority:evidence.some(e=>e.class.endsWith('-visual'))?'visual-review':evidence.some(e=>e.class==='structural')?'placement-review':'low'});
          }
        }
        response.findings.sort((a,b)=>ORDER.indexOf(a.evidence[0].class)-ORDER.indexOf(b.evidence[0].class)||Number(b.suffixAgreement)-Number(a.suffixAgreement)||(a.evidence[0].mechanism.transformations??0)-(b.evidence[0].mechanism.transformations??0)||a.reference.globalRank-b.reference.globalRank||lexical(a.reference.domain,b.reference.domain));
        if(coverage.unicode==='unsupported'&&response.status==='complete')response.status='partial';
        return response;
      }
      return Object.freeze({status:'ready',metadata,limits:LIMITS,createSession,compare,indexStats:frozen({references:records.length,unicodeKeys:unicode.size,asciiKeys:visual.size,spellingKeys:spelling.size,unsupportedVisualReferences:unsupportedReferenceCount,maxUnicodeBucket:Math.max(0,...[...unicode.values()].map(v=>v.length)),maxASCIIBucket:Math.max(0,...[...visual.values()].map(v=>v.length))})});
    }catch{return unavailable('corrupt-index');}
  }
  return Object.freeze({FORMAT,POLICY,LIMITS,indexContents,prepare});
})();
