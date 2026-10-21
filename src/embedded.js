'use strict';
// Supplemental text analysis only. No DOM, storage, navigation or I/O capabilities.
// The existing Inspector owns top-level parsing and all hostname algorithms.
const EmbeddedURLs = (() => {
  const LIMITS=Object.freeze({value:8192,depth:3,percentLayers:2,parameters:128,nodes:128,text:131072,candidates:32,hostnames:16,comparisons:256,milliseconds:100});
  const HINTS=new Set(['url','next','redirect','redirect_url','redirect_uri','return','returnurl','return_to','continue','target','destination','dest','goto','to','callback','relaystate']);
  const canonical=host=>host.replace(/\.$/,'').toLowerCase();
  const special=host=>host.startsWith('[')||/^(?:\d+\.){3}\d+$/.test(host)||!host.includes('.');
  function relationship(actual,expected){
    const a=canonical(actual),b=canonical(expected);
    if(a===b)return 'exact';
    if(!special(a)&&!special(b)){
      if(a.endsWith('.'+b))return 'subdomain';
      if(b.endsWith('.'+a))return 'parent';
      if(a.startsWith(b+'.')||a.includes('.'+b+'.'))return 'name-inside';
    }
    return 'different';
  }
  const unavailable=()=>({status:'unavailable',candidates:[],limitations:[{kind:'unavailable',code:'top-level',component:null}],observations:[],components:[],stats:{nodes:0,text:0,candidates:0,hostnames:0,comparisons:0},limits:LIMITS});
  // Called only for accepted HTTP(S) input. This locates components, not a host.
  // Map through Inspector's existing preprocessing indices; never invent offsets.
  function components(raw,url,prep){
    const text=prep.text,match=/^https?:\/\//i.exec(text);
    let end=match[0].length;while(end<text.length&&!'/\\?#'.includes(text[end]))end++;
    let hash=text.indexOf('#',end);if(hash<0)hash=text.length;
    let query=text.indexOf('?',end);if(query<0||query>hash)query=hash;
    const at=i=>i-prep.prefix<prep.p.indices.length?prep.p.indices[i-prep.prefix]:prep.p.end;
    const original={path:raw.slice(at(end),at(query)),query:query<hash?raw.slice(at(query+1),at(hash)):'',fragment:hash<text.length?raw.slice(at(hash+1),prep.p.end):''};
    const normalized={path:url.pathname,query:url.search.slice(1),fragment:url.hash.slice(1)};
    return ['path','query','fragment'].map(component=>({component,original:original[component],normalized:normalized[component],hasDelimiter:component==='query'?query<hash:component==='fragment'?hash<text.length:!!original.path,preprocessed:prep.p.changed}));
  }
  function analyze(top,{references=[],clock=()=>performance.now()}={}){
    if(!top?.ok||!top.original?.reliable||typeof top.raw!=='string'||top.raw.length>Inspector.MAX_INPUT)return unavailable();
    const result={status:'complete',candidates:[],limitations:[],observations:[],parameters:[],components:[],stats:{nodes:0,text:0,candidates:0,hostnames:0,comparisons:0,parameters:{path:0,query:0,fragment:0}},limits:LIMITS};
    const started=clock(),queues={path:[],query:[],fragment:[]},limited=new Set(),seenCandidates=new Map(),expanded=new Map(),hostCache=new Map(),comparisonCache=new Map();
    let stopped=false,partial=false,unsupported=false;
    function limit(kind,code,node={}){
      if(kind==='partial')partial=true;if(kind==='unsupported')unsupported=true;
      const key=[kind,code,node.component].join('|');if(limited.has(key))return;limited.add(key);
      // Limit metadata too; one record per reason/component is sufficient after saturation.
      if(result.limitations.length<48)result.limitations.push({kind,code,component:node.component||null,location:node.location||null});
    }
    function time(){if(clock()-started>LIMITS.milliseconds){limit('partial','time');stopped=true;}return !stopped;}
    function enqueue(node){
      if(!node.text)return;
      if(node.depth>LIMITS.depth){limit('partial','depth',node);return;}
      if(result.stats.nodes>=LIMITS.nodes){limit('partial','nodes',node);return;}
      if(result.stats.text+node.text.length>LIMITS.text){limit('partial','text',node);return;}
      result.stats.nodes++;result.stats.text+=node.text.length;queues[node.component].push(node);
    }
    function rootParts(value,parent=null,inherited={steps:[],layers:0,depth:0}){
      for(const part of value){
        if(!parent)result.components.push({component:part.component,hasDelimiter:part.hasDelimiter,normalizedDiffers:part.original!==part.normalized,preprocessed:part.preprocessed});
        const versions=[['submitted',part.original]];
        if(part.original!==part.normalized)versions.push(['browser-normalized',part.normalized]);
        for(const [representation,text]of versions)if(text)enqueue({...inherited,steps:[...inherited.steps],component:part.component,representation,location:parent?'Nested URL '+parent.id+' · '+part.component:part.component,parent:parent?.id||null,text,hint:part.component==='path'&&/\/(?:go|out|redirect)(?:\/|$)/i.test(text),kind:'container',mode:part.component,cursor:0,occurrence:0,pathScanned:false,routeScanned:false});
      }
    }
    let initial;
    try{const prep=Inspector.prepare(top.raw);initial=new URL(prep.text);if(time())rootParts(components(top.raw,initial,prep));}catch{return unavailable();}
    function transform(node,form=false){
      if(!node.text.includes('%')&&!(form&&node.text.includes('+')))return;
      if(node.layers>=LIMITS.percentLayers){limit('partial','percent-depth',node);return;}
      if(node.depth>=LIMITS.depth){limit('partial','depth',node);return;}
      let decoded;
      try{decoded=decodeURIComponent(form?node.text.replaceAll('+',' '):node.text);}catch{limit('partial','decoding',node);return;}
      if(decoded===node.text||node.states?.includes(decoded))return;
      enqueue({...node,text:decoded,steps:[...node.steps,{kind:form?'form-percent':'percent',layer:node.layers+1}],layers:node.layers+1,depth:node.depth+1,form:false,states:[...(node.states||[]),node.text]});
    }
    function add(node,value,type,extra={}){
      const key=[node.component,node.parent,node.location,type].join('|'),bucket=seenCandidates.get(key)||[],old=bucket.find(c=>c.value===value);
      const provenance={representation:node.representation,steps:node.steps};
      if(old){if(!old.provenance.some(p=>JSON.stringify(p)===JSON.stringify(provenance))&&old.provenance.length<6)old.provenance.push(provenance);return old;}
      if(result.candidates.length>=LIMITS.candidates){limit('partial','candidates',node);return null;}
      const charge=value.length+(extra.normalized?.length||0);
      if(result.stats.text+charge>LIMITS.text){limit('partial','text',node);return null;}result.stats.text+=charge;
      const candidate={id:result.candidates.length+1,type,evidence:type==='url-like'?'inference':'fact',component:node.component,location:node.location,representation:node.representation,parent:node.parent,parameter:node.parameter||null,occurrence:node.occurrence||null,hasEquals:node.hasEquals??null,hint:!!node.hint,inferredContainer:!!node.inferredContainer,value,sourceValue:node.sourceValue??node.text,provenance:[provenance],steps:node.steps,layers:node.layers,comparisons:[],warnings:[],...extra};
      result.candidates.push(candidate);bucket.push(candidate);seenCandidates.set(key,bucket);result.stats.candidates++;return candidate;
    }
    function absolute(node,value){
      let url;try{url=new URL(value);}catch{limit('partial','invalid-url',node);return null;}
      if(!['http:','https:'].includes(url.protocol)||!url.hostname)return null;
      const prep=Inspector.prepare(value),original=Inspector.originalHost(value,prep,url);
      const candidate=add(node,value,'absolute',{hostname:url.hostname,scheme:url.protocol,effectivePort:url.port||(url.protocol==='https:'?'443':'80'),normalized:url.href,original,hasUserinfo:!!(original.hadUserinfo||url.username||url.password),initialRelationship:relationship(url.hostname,top.ascii),schemePortDiffers:url.protocol!==top.scheme||(url.port||(url.protocol==='https:'?'443':'80'))!==(top.port||(top.scheme==='https:'?'443':'80'))});
      if(!candidate)return null;
      if(!original.reliable)limit('partial','attribution',node);
      if(candidate.hasUserinfo)candidate.warnings.push('userinfo');
      if([...value].some(ch=>Inspector.info(ch).invisible))candidate.warnings.push('invisible');
      if(value.includes('\\'))candidate.warnings.push('backslash');
      const key=node.layers+':'+node.depth,states=expanded.get(value)||new Set();
      if(!states.has(key)){
        states.add(key);expanded.set(value,states);
        const parts=original.reliable?components(value,url,prep):['path','query','fragment'].map(component=>({component,original:'',normalized:component==='path'?url.pathname:component==='query'?url.search.slice(1):url.hash.slice(1)}));
        const nonempty=parts.filter(p=>p.component!=='path'||p.original&&p.original!=='/'||p.normalized&&p.normalized!=='/');
        if(nonempty.some(p=>p.original||p.normalized))rootParts(nonempty,candidate,{steps:node.steps,layers:node.layers,depth:node.depth+1});
      }
      return candidate;
    }
    const unsafeBoundary=text=>/[\s\u0000-\u0020\u007f<>"'`]/u.test(text);
    function scan(node){
      const matches=/https?:\/\//ig;matches.lastIndex=node.scanCursor||0;
      const match=matches.exec(node.text);if(!match)return false;
      const rest=node.text.slice(match.index);
      if(node.pathWhole&&match.index>0&&node.text[match.index-1]==='/'&&!unsafeBoundary(rest)){
        absolute({...node,location:node.location+' · URL suffix'},rest);return true;
      }
      let end=match.index;while(end<node.text.length&&!/[\s<>"'`]/u.test(node.text[end]))end++;
      add(node,node.text.slice(match.index,end),'url-like');limit('partial','boundaries',node);
      // One match per turn: a single query value cannot fill the occurrence
      // budget before the path/fragment queues have had a chance to run.
      if(result.candidates.length<LIMITS.candidates)queues[node.component].push({...node,kind:'scan',scanCursor:match.index+match[0].length});
      else if(matches.test(node.text))limit('partial','candidates',node);
      return true;
    }
    function value(node){
      if(node.text.length>LIMITS.value){limit('partial','value-size',node);return;}
      const text=node.text;
      if(/[\ud800-\udfff]/u.test(text)){limit('partial','unicode',node);return;}
      if(node.form&&(text.includes('+')||/^https?:\/\//i.test(text))){transform({...node,form:false},true);}
      if(/^\s*[\[{<]/u.test(text)){limit('unsupported','structure',node);return;}
      if(/^[a-z][a-z\d+.-]*:/i.test(text)&&!/^https?:/i.test(text)){add(node,text,'unsupported-scheme',{scheme:text.slice(0,text.indexOf(':')+1)});limit('unsupported','scheme',node);return;}
      if(/^https?:\/\//i.test(text)&&!unsafeBoundary(text)){absolute(node,text);return;}
      if(/^https?:/i.test(text)&&!/^https?:\/\//i.test(text)){limit('partial','invalid-url',node);return;}
      if(/^\/\//.test(text)&&!unsafeBoundary(text)){add(node,text,'protocol-relative');return;}
      const relative=/^(?:\/(?!\/)|\.\.?\/|[?#])/.test(text)&&!node.pathWhole&&!unsafeBoundary(text);
      if(relative){
        const reference=add(node,text,'relative'),question=text.indexOf('?'),hash=text.indexOf('#');
        if(question>=0&&(hash<0||question<hash)){
          enqueue({...node,kind:'container',mode:'query',text:text.slice(question+1,hash<0?text.length:hash),cursor:0,occurrence:0,parent:reference?.id||node.parent,depth:node.depth+1,inferredContainer:true,location:node.location+' · relative-reference parameters',form:false});
        }
        // Query interpretation must not suppress the remaining whole-value decoding state.
        transform(node);
        return;
      }
      // Interpret an entire parameter-like string as a subordinate container.
      // Its delimiters never change the actual outer URL or parent parameter list.
      if(!node.pathWhole&&/^[^\s=&?#]+=[\s\S]*&/.test(text)&&!node.inferredContainer){
        enqueue({...node,kind:'container',mode:'query',cursor:0,occurrence:0,depth:node.depth+1,inferredContainer:true,location:node.location+' · nested parameters',form:false});return;
      }
      const found=scan(node);
      // The full path scan handles literal URL suffixes; segments handle encoding.
      if(!node.pathWhole)transform(node);
      if(!found&&!node.pathWhole&&!text.includes('%')){
        if(node.hint&&node.parameter||/^(?:data|payload|state|qs|policy|signature)$/i.test(node.parameter?.decoded||''))limit('unsupported','opaque',node);
        else if(node.steps.length&&result.observations.length<32)result.observations.push({component:node.component,location:node.location,type:'encoded-data',evidence:'fact'});
      }
    }
    function encodedFragmentAddress(node){
      // A literal separator can belong to an encoded whole URL. Probe only its
      // bounded prefix; actual recovery still uses the strict, budgeted value path.
      if(/^https?:\/\//i.test(node.text))return false;
      const separator=node.text.search(/[=&]/);if(separator<0)return false;
      let prefix=node.text.slice(0,separator);if(prefix.length>LIMITS.value)return false;
      for(let layer=node.layers;prefix.includes('%')&&layer<LIMITS.percentLayers;layer++){
        try{prefix=decodeURIComponent(prefix);}catch{limit('partial','decoding',node);return false;}
        if(/^https?:\/\//i.test(prefix))return true;
      }
      // Recognizable address syntax still requiring decoding must expose its limit.
      return /^https?%/i.test(prefix);
    }
    function container(node){
      // Incremental expansion yields to the other two components after each item.
      if(node.mode==='path'){
        if(!node.pathScanned){node.pathScanned=true;value({...node,kind:'value',pathWhole:true});const literal=/\/https?:\/\//i.exec(node.text);node.stopAt=literal?literal.index+1:node.text.length;queues[node.component].push(node);return;}
        if(node.cursor>=node.stopAt)return;
        if(node.cursor>=node.text.length)return;
        const begin=node.cursor;let end=node.text.indexOf('/',begin);if(end<0)end=node.text.length;
        node.cursor=end+1;
        if(result.stats.parameters[node.component]>=LIMITS.parameters){limit('partial','parameters',node);return;}result.stats.parameters[node.component]++;
        const occurrence=++node.occurrence;
        enqueue({...node,kind:'value',text:node.text.slice(begin,end),sourceValue:node.text.slice(begin,end),pathWhole:false,hint:node.hint||/^(?:go|out|redirect)$/i.test(node.text.slice(begin,end)),location:node.location+' · segment '+occurrence});
        if(node.cursor<node.text.length)queues[node.component].push(node);return;
      }
      if(node.mode==='fragment'&&!node.routeScanned){
        node.routeScanned=true;
        if(encodedFragmentAddress(node))enqueue({...node,kind:'value',sourceValue:node.text,form:false});
        if(/^\//.test(node.text)&&!/^\/\//.test(node.text)){
          const q=node.text.indexOf('?');
          if(q>=0){enqueue({...node,kind:'value',text:node.text.slice(0,q),location:node.location+' · route',form:false});node.text=node.text.slice(q+1);node.location+=' · route parameters';node.inferredContainer=true;}
        }
        if(!node.text.includes('=')&&!node.text.includes('&')){enqueue({...node,kind:'value',form:false});return;}
      }
      if(node.cursor>node.text.length)return;
      if(result.stats.parameters[node.component]>=LIMITS.parameters){limit('partial','parameters',node);return;}result.stats.parameters[node.component]++;
      const begin=node.cursor;let end=node.text.indexOf('&',begin);if(end<0)end=node.text.length;
      node.cursor=end+1;const entry=node.text.slice(begin,end),equals=entry.indexOf('='),rawName=equals<0?entry:entry.slice(0,equals),text=equals<0?'':entry.slice(equals+1),occurrence=++node.occurrence;
      let decoded=rawName;
      if(rawName.length>LIMITS.value)limit('partial','value-size',node);
      else try{decoded=decodeURIComponent(rawName.replaceAll('+',' '));}catch{limit('partial','decoding',node);}
      const parameter={original:rawName,decoded},hint=HINTS.has(decoded.toLowerCase());
      // A naked address (e.g. #https://host/?a=b) is a whole fragment value,
      // rather than a made-up parameter whose name is the address prefix.
      if(node.occurrence===1&&/^https?:\/\//i.test(node.text)){enqueue({...node,kind:'value',text:node.text,form:false});return;}
      if(result.parameters.length<LIMITS.nodes)result.parameters.push({component:node.component,parent:node.parent,representation:node.representation,location:node.location,occurrence,parameter,hasEquals:equals>=0,emptyValue:!text});
      enqueue({...node,kind:'value',text,sourceValue:text,parameter,hasEquals:equals>=0,hint,occurrence,form:true,location:node.location+' · parameter '+occurrence});
      if(node.cursor<=node.text.length)queues[node.component].push(node);
    }
    while(!stopped&&Object.values(queues).some(q=>q.length)){
      for(const component of ['path','query','fragment']){
        if(!time())break;const node=queues[component].shift();if(!node)continue;
        if(node.kind==='container')container(node);else if(node.kind==='scan')scan(node);else value(node);
      }
    }
    const absolutes=result.candidates.filter(c=>c.type==='absolute'),unique=[];
    for(const c of absolutes){
      if(!time())break;
      // Preserve case/Unicode authority variants, while avoiding repeated path work.
      const bucket=hostCache.get(c.hostname)||[],cached=bucket.find(item=>item.original===c.original.decoded&&item.scheme===c.scheme);
      if(cached){c.analysis=cached.analysis;continue;}
      if(result.stats.hostnames>=LIMITS.hostnames){limit('partial','hostnames',c);continue;}
      result.stats.hostnames++;
      const inspected=Inspector.inspect(c.value);
      const analysis={ascii:inspected.ascii,unicode:inspected.unicode,decodeError:!!inspected.decodeError,original:inspected.original,characters:inspected.characters,originalCharacters:inspected.originalCharacters,diagnostics:inspected.messages.filter(m=>!['no-anomalies','unverified','ascii-ambiguity'].includes(m.code))};
      if(analysis.decodeError)limit('partial','hostname-decoding',c);
      bucket.push({original:c.original.decoded,scheme:c.scheme,analysis});hostCache.set(c.hostname,bucket);c.analysis=analysis;unique.push(c);
    }
    const targets=[{source:'Initial hostname',expected:{ascii:canonical(top.ascii),unicode:top.unicode,original:top.original.decoded},unavailable:top.decodeError}];
    if(top.expected)targets.push({source:'Expected hostname',expected:top.expected});
    if(top.expectedError)limit('partial','expected');
    if(references.length>100)limit('partial','references');
    for(const hostname of references.slice(0,100)){
      try{targets.push({source:'Saved reference',expected:Inspector.expectedHost(hostname)});}catch{limit('partial','reference');}
    }
    // Round-robin by target: each candidate gets initial/manual comparisons before
    // large saved lists. Exact/structural checks do not spend a visual pair budget.
    for(const target of targets){
      if(!time())break;
      for(const c of unique){
        if(!time())break;
        const relation=relationship(c.hostname,target.expected.ascii),a=c.analysis;
        let comparison=null;
        if(relation==='exact')comparison={kind:'exact',exact:true,visual:false};
        else if(special(c.hostname)||special(target.expected.ascii))comparison={kind:'mismatch',exact:false,visual:null,exactOnly:true};
        else if(a.decodeError||target.unavailable)comparison={kind:'mismatch',exact:false,visual:null,unavailable:true};
        else{
          const cached=comparisonCache.get(a)||new Map();
          if(cached.has(target.expected))comparison=cached.get(target.expected);
          else if(result.stats.comparisons>=LIMITS.comparisons){limit('partial','comparisons',c);comparison={kind:'mismatch',visual:null,unavailable:true,limited:true};}
          else{result.stats.comparisons++;comparison=Inspector.compareHostnames(c.hostname,a.unicode,c.original.reliable?c.original.decoded:null,target.expected);cached.set(target.expected,comparison);comparisonCache.set(a,cached);}
        }
        if(comparison.unavailable&&!comparison.limited)limit('unsupported','visual',c);
        if(target.source!=='Saved reference'||relation!=='different'||comparison.visual||comparison.kind==='spelling'||comparison.unavailable)c.comparisons.push({source:target.source,hostname:target.expected.ascii,relationship:relation,...comparison});
      }
    }
    // Occurrences share immutable host evidence/comparisons, never a presumed chain.
    for(const c of absolutes){const owner=unique.find(other=>other.analysis===c.analysis);if(owner&&owner!==c)c.comparisons=owner.comparisons;if(!c.analysis)limit('partial','host-analysis',c);}
    const repeated=new Map();for(const c of absolutes)if(c.parameter){const key=[c.component,c.parent,c.parameter.decoded].join('|');if(!repeated.has(key))repeated.set(key,[]);repeated.get(key).push(c);}
    for(const group of repeated.values())if(new Set(group.map(c=>c.occurrence)).size>1&&new Set(group.map(c=>c.normalized)).size>1)for(const c of group)c.conflicting=true;
    result.status=partial?'partial':unsupported?'unsupported':'complete';
    return result;
  }
  return Object.freeze({analyze,unavailable,relationship,LIMITS});
})();
