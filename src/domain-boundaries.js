'use strict';
// Offline PSL boundaries only. Inspector remains the URL/IDNA authority.
// No DOM, storage, navigation, network, ownership or reputation capabilities.
const DomainBoundaries = (() => {
  const FORMAT=1,MAX_RULES=20000,MAX_SOURCE=1048576;
  const fail=(status,reason)=>Object.freeze({status,reason,registrableDomain:null});
  function normalize(raw,inspector){
    if(typeof raw!=='string'||!raw||raw.length>2048)return fail('invalid','hostname-input');
    // This API accepts a bare hostname, never a URL or repaired source row.
    if(/[\s\u0000-\u0020\u007f/%\\@?#]/u.test(raw))return fail('invalid','hostname-syntax');
    if(/[^\x00-\x7f]/.test(raw)&&[...raw].some(ch=>inspector.info(ch).invisible))return fail('invalid','hostname-invisible');
    if(raw.includes(':')&&!/^\[[0-9a-f:.]+\]$/i.test(raw))return fail('invalid','hostname-syntax');
    try{
      const host=inspector.expectedHost(raw);
      if(!host)return fail('invalid','hostname-input');
      const trailingDot=/[.\u3002\uff0e\uff61]$/u.test(raw);
      if(host.ascii.startsWith('[')||/^(?:\d+\.){3}\d+$/.test(host.ascii))return Object.freeze({status:'ip',asciiHost:host.ascii,unicodeHost:host.unicode,trailingDot,registrableDomain:null});
      return Object.freeze({status:'normalized',asciiHost:host.ascii,unicodeHost:host.unicode,trailingDot,changed:raw!==host.ascii});
    }catch{return fail('invalid','hostname-normalization');}
  }
  const validRule=rule=>typeof rule==='string'&&rule.length<=255&&/^(?:\*\.|!)?[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(rule)&&rule.replace(/^(?:\*\.|!)/,'').split('.').every(label=>label.length<=63&&/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))&&(!rule.startsWith('!')||rule.includes('.'));
  function compile(raw,inspector){
    if(typeof raw!=='string'||raw.length>MAX_SOURCE)throw Error('Invalid PSL source size');
    const rules={ICANN:[],PRIVATE:[]},seenSections=new Set(),seenRules=new Set();let section=null;
    for(const line of raw.split(/\r?\n/)){
      const begin=/^\/\/ ===BEGIN (ICANN|PRIVATE) DOMAINS===$/.exec(line),end=/^\/\/ ===END (ICANN|PRIVATE) DOMAINS===$/.exec(line);
      if(begin){if(section||seenSections.has(begin[1]))throw Error('Duplicate/nested PSL section');section=begin[1];seenSections.add(section);continue;}
      if(end){if(section!==end[1])throw Error('Mismatched PSL section');section=null;continue;}
      const trimmed=line.trim();if(!trimmed||trimmed.startsWith('//'))continue;
      if(!section)throw Error('PSL rule outside section');
      const source=trimmed.split(/\s/u)[0],prefix=source.startsWith('*.')?'*.':source.startsWith('!')?'!':'',bare=source.slice(prefix.length);
      if(bare.includes('*')||bare.includes('!')||/[.\u3002\uff0e\uff61]$/u.test(bare))throw Error('Invalid PSL rule');
      const host=normalize(bare,inspector),rule=prefix+host.asciiHost;
      if(host.status!=='normalized'||!validRule(rule)||seenRules.has(rule))throw Error('Invalid or duplicate normalized PSL rule: '+source);
      seenRules.add(rule);if(seenRules.size>MAX_RULES)throw Error('Too many PSL rules');rules[section].push(rule);
    }
    if(section||seenSections.size!==2||!rules.ICANN.length||!rules.PRIVATE.length)throw Error('Incomplete PSL sections');
    for(const values of Object.values(rules))values.sort();
    return rules;
  }
  function create(inspector,asset,pins){
    const unavailable=reason=>Object.freeze({status:'unavailable',reason,lookup:()=>fail('unavailable',reason)});
    if(!asset||asset.schemaVersion!==FORMAT||asset.kind!=='public-suffix-rules')return unavailable('unsupported-schema');
    if(!pins||asset.sourceSHA256!==pins.sourceSHA256)return unavailable('incompatible-psl');
    if(asset.unicodeDataSHA256!==pins.unicodeDataSHA256||inspector?.version!=='18.0.0')return unavailable('incompatible-unicode');
    const exact=new Map(),wildcard=new Map(),exceptions=new Map(),roots=new Set();let count=0;
    for(const section of ['ICANN','PRIVATE']){
      if(!Array.isArray(asset.rules?.[section])||!asset.rules[section].length)return unavailable('corrupt');
      let previous='';
      for(const rule of asset.rules[section]){
        if(++count>MAX_RULES||!validRule(rule)||rule<=previous)return unavailable('corrupt');previous=rule;
        const prefix=rule.startsWith('*.')?'*.':rule.startsWith('!')?'!':'',bare=rule.slice(prefix.length),map=prefix==='*.'?wildcard:prefix==='!'?exceptions:exact;
        if(map.has(bare))return unavailable('corrupt');map.set(bare,Object.freeze({rule,section}));
        if(section==='ICANN')roots.add(bare.split('.').at(-1));
      }
    }
    function lookup(raw,{includePrivate=true}={}){
      const host=normalize(raw,inspector);if(host.status!=='normalized')return host;
      const labels=host.asciiHost.split('.');let winner={rule:'*',section:null,length:1},exception=null;
      const allowed=entry=>entry&&(includePrivate||entry.section==='ICANN');
      for(let i=labels.length-1;i>=0;i--){
        const suffix=labels.slice(i).join('.'),length=labels.length-i;
        const ex=exceptions.get(suffix);if(allowed(ex)&&(!exception||length>exception.length))exception={...ex,length};
        const item=exact.get(suffix);if(allowed(item)&&length>=winner.length)winner={...item,length};
        const wild=wildcard.get(suffix);if(i>0&&allowed(wild)&&length+1>winner.length)winner={...wild,length:length+1};
      }
      if(exception)winner=exception;
      const suffixLength=winner.length-(exception?1:0),suffix=labels.slice(-suffixLength).join('.'),registrable=labels.length>suffixLength?labels.slice(-suffixLength-1).join('.'):null;
      const known=roots.has(labels.at(-1)),status=!known?'unknown-suffix':!registrable?'suffix-only':'ok';
      return Object.freeze({status:labels.length===1&&!known?'single-label':status,asciiHost:host.asciiHost,unicodeHost:host.unicodeHost,trailingDot:host.trailingDot,normalizedInputChanged:host.changed,publicSuffix:suffix,registrableDomain:registrable,unicodeRegistrableDomain:registrable?inspector.unicodeHost(registrable):null,subdomain:registrable?labels.slice(0,labels.length-suffixLength-1).join('.'):null,rule:winner.rule,section:winner.section,knownSuffix:known,defaultRule:winner.section===null,wildcard:winner.rule.startsWith('*.'),exception:!!exception,publicSuffixFQDN:suffix+(host.trailingDot?'.':''),registrableDomainFQDN:registrable?registrable+(host.trailingDot?'.':''):null});
    }
    return Object.freeze({status:'ready',ruleCount:count,lookup});
  }
  return Object.freeze({FORMAT,MAX_RULES,normalize,compile,create});
})();
