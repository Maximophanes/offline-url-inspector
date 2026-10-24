'use strict';
// Stage 5 composition only. Initialization consumes local text; evaluation is
// synchronous and keeps no inspection state in the prepared coordinator.
const UnifiedComparisons = (() => {
  const VERSION=1,LIMITS=Object.freeze({automaticHosts:17,relationships:8192});
  const canonical=s=>s.replace(/\.$/,'').toLowerCase();
  const classes=['exact-hostname','shared-registrable-domain','unicode-visual','ascii-visual','structural','spelling','mismatch','unavailable'];
  const lexical=(a,b)=>a<b?-1:a>b?1:0;
  function create(engine,{clock=()=>performance.now(),limits={},matcherLimits={}}={}){
    const bounds={...LIMITS};
    for(const [key,n]of Object.entries(limits)){if(!Object.hasOwn(bounds,key)||!Number.isInteger(n)||n<0||n>bounds[key])throw Error('Orchestration limits may only lower defaults');bounds[key]=n;}
    // Validate lowered session limits before accepting inspections. Tokens retain
    // only work counters; no URL or hostname is kept by the prepared engine.
    if(engine?.status==='ready')engine.createSession({limits:matcherLimits});
    const data=Object.freeze({status:engine?.status==='ready'?'ready':'unavailable',reason:engine?.reason||null,metadata:engine?.metadata||null});
    function evaluate(inspection,{references=[],embedded,referenceResult}={}){
      const r=inspection,valid=r?.ok===true&&typeof r.ascii==='string'&&['http:','https:'].includes(r.scheme);
      const out={schemaVersion:VERSION,status:valid?'complete':'invalid-input',data,precedence:['expected','personal-reference','builtin-majestic'],sources:[],analyses:[],relationships:[],manual:{expected:{status:r?.expectedError?'invalid':r?.expected?'valid':'not-provided',target:r?.expected||null,comparison:r?.comparison||null,error:r?.expectedError||null},references:null},embedded:null,coverage:{input:valid?'valid':'invalid-input',automatic:'not-run',embedded:{extraction:'unavailable',occurrences:'unavailable',hostnameDiscovery:'unavailable',recordedAutomatic:'not-run'},resourceLimited:false,limitations:[]},stats:{automaticCalls:0,cacheHits:0,hostnameContexts:0,sourceAttachments:0,relationships:0},limits:Object.freeze({...bounds})};
      const limited=(scope,code,resource=false)=>{if(!out.coverage.limitations.some(x=>x.scope===scope&&x.code===code))out.coverage.limitations.push({scope,code});if(resource)out.coverage.resourceLimited=true;};
      let saved=[];
      try{if(!Array.isArray(references)||references.length>ReferenceDomains.MAX_ENTRIES)throw Error();saved=ReferenceDomains.parse(JSON.stringify({application:ReferenceDomains.APPLICATION,schemaVersion:ReferenceDomains.SCHEMA,references})).references;}
      catch{limited('personal-reference','invalid-reference-list');}
      // Existing objects and reference behavior are retained, never rewritten by
      // automatic matching. Invalid Expected Hostname does not gate this path.
      out.manual.references=referenceResult??ReferenceDomains.compare(valid?r:{ok:false},saved);
      if(!valid)return out;
      let e=embedded;
      if(e===undefined)try{e=EmbeddedURLs.analyze(r,{references:saved,clock});}catch{limited('embedded','processing-failure');}
      const supported=e?.provenanceVersion===2&&Array.isArray(e.candidates)&&e.candidates.length<=EmbeddedURLs.LIMITS.candidates&&Array.isArray(e.occurrences)&&e.occurrences.length<=EmbeddedURLs.LIMITS.occurrences;
      out.embedded=supported?e:EmbeddedURLs.unavailable();
      const extraction=out.embedded;
      out.coverage.embedded={extraction:extraction.status,occurrences:extraction.occurrenceCoverage,hostnameDiscovery:extraction.occurrenceCoverage==='complete'?'complete':extraction.status==='unavailable'?'unavailable':'partial',recordedAutomatic:'not-run'};
      for(const l of extraction.limitations)limited('embedded',l.code,l.kind==='partial'&&['nodes','text','time','parameters','candidates','occurrences','occurrences-per-value','relationships','expansions','provenance','hostnames','comparisons'].includes(l.code));
      const cache=new Map(),rows=new Map();
      const session=engine?.status==='ready'?engine.createSession({limits:matcherLimits}):null;
      function attach(role,a,candidate=null){
        const source={id:out.sources.length+1,role,hostname:a?.ascii||candidate?.hostname||null,entryId:candidate?.id||null,occurrenceId:candidate?.occurrenceId||null,parentOccurrence:candidate?.parent?extraction.candidates[candidate.parent-1]?.occurrenceId||null:null,component:candidate?.component||null,parameter:candidate?.parameter||null,sourcePosition:candidate?.sourcePosition||null,provenance:candidate?.provenance||[],analysisId:null,eligibility:'eligible',reason:null};
        out.sources.push(source);
        if(!a||a.decodeError||typeof a.ascii!=='string'||candidate&&!(candidate.type==='absolute'&&candidate.evidence==='fact'&&candidate.original?.reliable&&a.original?.reliable&&candidate.hostname===a.ascii&&['http:','https:'].includes(candidate.scheme)&&candidate.provenance.some(p=>p.interpretation&&['path','query','fragment'].includes(p.interpretation.mode)&&p.interpretation.depth>=0&&p.interpretation.depth<=EmbeddedURLs.LIMITS.depth&&p.interpretation.layers>=0&&p.interpretation.layers<=EmbeddedURLs.LIMITS.percentLayers))){source.eligibility='unsupported';source.reason=candidate?.type==='relative'?'unresolved-relative':candidate?.type==='url-like'?'uncertain-address':'incomplete-hostname-evidence';return source;}
        const hostname=canonical(a.ascii),original=a.original?.reliable?a.original.decoded:null;
        // Preserve supported ASCII case explanations only when the reliable
        // spelling agrees with the authoritative native hostname. Other IDNA
        // representations use that native hostname and the engine's readable form.
        const matchingInput=typeof original==='string'&&/^[a-z0-9.-]+$/i.test(original)&&canonical(original)===hostname?original:a.ascii;
        const key=JSON.stringify([hostname,matchingInput]);let analysis=cache.get(key);
        if(analysis)out.stats.cacheHits++;
        else{
          let automatic;
          if(!session)automatic={status:'unavailable',reason:data.reason||'missing-index',findings:[],exact:null,coverage:{all:'unavailable'},limitations:[data.reason||'missing-index']};
          else if(out.stats.automaticCalls>=bounds.automaticHosts){automatic={status:'partial',findings:[],exact:null,coverage:{all:'partial'},limitations:['orchestration-host-limit']};limited('automatic','orchestration-host-limit',true);}
          else{out.stats.automaticCalls++;try{automatic=engine.compare(matchingInput,session);}catch{automatic={status:'unavailable',findings:[],exact:null,coverage:{all:'unavailable'},limitations:['matcher-failure']};}}
          analysis={id:out.analyses.length+1,hostname,matchingInput,automatic,sourceIds:[]};cache.set(key,analysis);out.analyses.push(analysis);
          for(const reason of automatic.limitations||[])limited('automatic',reason,/budget|limit/.test(reason));
        }
        analysis.sourceIds.push(source.id);source.analysisId=analysis.id;
        if(analysis.automatic.status==='ineligible'){source.eligibility='unsupported';source.reason=analysis.automatic.limitations[0];}
        return source;
      }
      const first=attach('original',r);
      for(const candidate of extraction.candidates)attach('embedded',candidate.analysis,candidate);
      function add(source,target,kind,scope,evidence,comparisonSource,signature=''){
        if(!source.analysisId)return;
        const domain=canonical(target),key=JSON.stringify([source.analysisId,domain,kind,scope,signature]);let row=rows.get(key);
        if(!row){if(rows.size>=bounds.relationships){limited('reconciliation','relationship-limit',true);return;}row={id:null,analysisId:source.analysisId,hostname:out.analyses[source.analysisId-1].hostname,reference:domain,class:kind,scope,sourceIds:[],supports:[]};rows.set(key,row);}
        if(!row.sourceIds.includes(source.id))row.sourceIds.push(source.id);
        const support={source:comparisonSource,evidence};
        if(!row.supports.some(x=>JSON.stringify(x)===JSON.stringify(support)))row.supports.push(support);
      }
      const visualSignature=(kind,proof)=>kind==='ascii-visual'?JSON.stringify((proof.asciiSubstitutions||proof.mechanism?.substitutions||[]).map(p=>[p.actual,p.expected]).sort()):'';
      function legacy(source,target,c,origin,relation){
        if(c?.exact)add(source,target,'exact-hostname','full-hostname',c,origin);
        else{
          if(relation&&relation!=='different')add(source,target,'structural','legacy-'+relation,c,origin);
          if(c?.visual){const kind=c.mechanism==='UTS #39'?'unicode-visual':'ascii-visual';add(source,target,kind,'full-hostname',c,origin,visualSignature(kind,c));}
          else if(c?.kind==='spelling')add(source,target,'spelling','legacy-full-hostname',c,origin);
          else if(c?.unavailable)add(source,target,'unavailable','legacy-visual',c,origin);
          else if(origin.kind==='expected'||origin.kind==='original-hostname')add(source,target,'mismatch','full-hostname',c,origin);
        }
      }
      if(r.expected&&r.comparison)legacy(first,r.expected.ascii,r.comparison,{kind:'expected',priority:'primary'},EmbeddedURLs.relationship(r.ascii,r.expected.ascii));
      const refs=out.manual.references;
      for(const group of ['exact','subdomains','embedded','visual','spelling'])for(const item of refs[group]){
        const c=item.comparison||{kind:group==='exact'?'exact':'mismatch',exact:group==='exact',visual:false};
        legacy(first,item.hostname,c,{kind:'personal-reference',priority:r.expected?'secondary':'user-reference'},group==='subdomains'||group==='embedded'?EmbeddedURLs.relationship(r.ascii,item.hostname):null);
      }
      for(const source of out.sources.filter(s=>s.role==='embedded')){
        const candidate=extraction.candidates[source.entryId-1];
        for(const c of candidate.comparisons||[])legacy(source,c.hostname,c,{kind:c.source==='Expected hostname'?'expected':c.source==='Saved reference'?'personal-reference':'original-hostname',priority:c.source==='Expected hostname'?'primary':'supplemental'},c.relationship);
      }
      for(const analysis of out.analyses){
        const automatic=analysis.automatic;
        for(const id of analysis.sourceIds){const source=out.sources[id-1];
          if(automatic.exact){const ref=automatic.exact.reference;add(source,ref.domain,analysis.hostname===ref.domain?'exact-hostname':'shared-registrable-domain',analysis.hostname===ref.domain?'full-hostname':'registrable-domain',{classification:'neutral-membership',reference:ref},{kind:'builtin-majestic',priority:'supplemental',reference:ref});}
          for(const finding of automatic.findings)for(const evidence of finding.evidence){
            const scope=evidence.comparisonScope==='full-registrable-domain'&&analysis.hostname===automatic.registrableDomain?'full-hostname':evidence.comparisonScope;
            add(source,finding.reference.domain,evidence.class,scope,evidence,{kind:'builtin-majestic',priority:'supplemental',reference:finding.reference},visualSignature(evidence.class,evidence));
          }
        }
      }
      out.relationships=[...rows.values()].sort((a,b)=>a.analysisId-b.analysisId||classes.indexOf(a.class)-classes.indexOf(b.class)||lexical(a.reference,b.reference)||lexical(a.scope,b.scope));
      out.relationships.forEach((row,n)=>{row.id=n+1;});
      const states=out.analyses.map(a=>a.automatic.status),recorded=states.length===0?'unsupported':states.every(s=>s==='complete')?'complete':states.every(s=>s==='ineligible')?'unsupported':states.every(s=>s==='unavailable')?'unavailable':'partial';
      out.coverage.recordedAutomatic=recorded;
      const excluded=out.sources.some(s=>s.eligibility==='unsupported');
      out.coverage.automatic=data.status==='unavailable'?'unavailable':out.coverage.embedded.hostnameDiscovery!=='complete'&&recorded!=='unavailable'||recorded==='complete'&&excluded?'partial':recorded;
      const embeddedStates=out.sources.filter(s=>s.role==='embedded'&&s.analysisId).map(s=>out.analyses[s.analysisId-1].automatic.status);
      out.coverage.embedded.recordedAutomatic=!embeddedStates.length?'not-applicable':embeddedStates.every(s=>s==='complete')?'complete':embeddedStates.every(s=>s==='ineligible')?'unsupported':embeddedStates.every(s=>s==='unavailable')?'unavailable':'partial';
      if(out.coverage.automatic!=='complete')out.status=out.coverage.automatic;
      if(out.coverage.embedded.hostnameDiscovery!=='complete'||out.coverage.resourceLimited||out.coverage.limitations.some(l=>l.scope==='personal-reference'))out.status=out.status==='unavailable'?'unavailable':'partial';
      if(out.sources.some(s=>s.eligibility==='unsupported')&&out.status==='complete')out.status='partial';
      if(r.expectedError&&out.status==='complete')out.status='partial';
      out.stats.hostnameContexts=out.analyses.length;out.stats.sourceAttachments=out.sources.length;out.stats.relationships=out.relationships.length;
      out.coverage.manual={expected:r.expectedError?'invalid-input':r.comparison?.unavailable?'unsupported':r.comparison?'complete':'not-provided',references:out.coverage.limitations.some(l=>l.scope==='personal-reference')?'invalid-input':refs.unavailable?'partial':'complete'};
      out.work=session?session.snapshot():null;
      return out;
    }
    return Object.freeze({data,limits:Object.freeze(bounds),evaluate});
  }
  async function prepare(assets={},options={}){
    let engine={status:'unavailable',reason:'missing-index'};
    try{
      const text=assets.foundationManifestText;
      if(typeof text!=='string'||text.length>65536)return create(engine,options);
      const foundation=await ReferenceData.load(Inspector,{manifest:JSON.parse(text),pslText:assets.pslText,popularText:assets.popularText});
      engine=foundation.status==='ready'?await AutomaticLookalikes.prepare(Inspector,foundation,{manifest:assets.indexManifest,indexText:assets.indexText,foundationManifestText:text,...(options.clock?{clock:options.clock}:{})}):{status:'unavailable',reason:'foundation-'+foundation.reason};
    }catch{engine={status:'unavailable',reason:'initialization-failure'};}
    return create(engine,options);
  }
  return Object.freeze({VERSION,LIMITS,prepare,create});
})();
