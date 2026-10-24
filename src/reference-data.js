'use strict';
// Optional Stage 2 foundation loader. No automatic findings, DOM or I/O.
const ReferenceData = (() => {
  const unavailable=reason=>Object.freeze({status:'unavailable',reason,automaticMatchingAvailable:false});
  async function load(inspector,{manifest,pslText,popularText}={}){
    if(!manifest||!pslText||!popularText)return unavailable('missing');
    if(manifest.schemaVersion!==1||manifest.kind!=='reference-foundation'||manifest.status!=='foundation-only'||manifest.automaticMatchingAvailable!==false||manifest.indexFormatVersion!==null||manifest.provider!=='majestic')return unavailable('unsupported-schema');
    if(manifest.unicode?.version!=='18.0.0'||inspector?.version!=='18.0.0'||manifest.unicode.sha256!=='806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1')return unavailable('incompatible-unicode');
    if(typeof pslText!=='string'||typeof popularText!=='string'||pslText.length>1048576||popularText.length>2097152)return unavailable('corrupt');
    if(!globalThis.crypto?.subtle)return unavailable('integrity-unavailable');
    const encoder=new TextEncoder();
    for(const [name,text]of [['data/public-suffix/compiled.json',pslText],['data/popular-domains/records.json',popularText]]){
      const pin=manifest.assets?.[name],bytes=encoder.encode(text);
      if(!pin||pin.bytes!==bytes.length||!/^[a-f0-9]{64}$/.test(pin.sha256))return unavailable('corrupt');
      let digest;try{digest=[...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');}catch{return unavailable('integrity-unavailable');}if(digest!==pin.sha256)return unavailable('corrupt');
    }
    try{
      const psl=JSON.parse(pslText),popular=JSON.parse(popularText);
      const boundaries=DomainBoundaries.create(inspector,psl,{sourceSHA256:manifest.psl?.sha256,unicodeDataSHA256:manifest.unicode.sha256});
      if(boundaries.status!=='ready')return unavailable(boundaries.reason);
      if(psl.rules.ICANN.length!==manifest.psl.rules?.ICANN||psl.rules.PRIVATE.length!==manifest.psl.rules?.PRIVATE)return unavailable('corrupt');
      if(popular.pslSHA256!==manifest.psl.sha256)return unavailable('incompatible-psl');
      if(popular.unicodeDataSHA256!==manifest.unicode.sha256)return unavailable('incompatible-unicode');
      if(popular.schemaVersion!==1||popular.kind!=='popular-domain-records'||popular.provider!=='majestic'||popular.sourceSHA256!==manifest.source?.original?.sha256||popular.subsetSHA256!==manifest.source?.subset?.sha256||popular.normalizationPolicyId!=='oui-native-url-psl-v1'||popular.selectionPolicyId!=='majestic-global-10k-v1'||popular.referenceMaxRank!==10000||popular.spellingMaxRank!==1000||JSON.stringify(popular.fields)!==JSON.stringify(['asciiDomain','globalRank','sourceRowCount','publicSuffixASCII','section']))return unavailable('corrupt');
      if(!Array.isArray(popular.records)||!popular.records.length||popular.records.length>10000||popular.records.length!==manifest.recordCount)return unavailable('corrupt');
      let previous='',accepted=0;const records=[],ranks=new Set();
      for(const tuple of popular.records){
        if(!Array.isArray(tuple)||tuple.length!==5)return unavailable('corrupt');
        const [domain,rank,count,suffix,section]=tuple;
        if(typeof domain!=='string'||domain<=previous||domain.length>253||!Number.isInteger(rank)||rank<1||rank>10000||!Number.isInteger(count)||count<1||count>10000||typeof suffix!=='string'||!['I','P'].includes(section))return unavailable('corrupt');
        // Revalidate the actual runtime's normalization and pinned PSL agreement.
        const evidence=boundaries.lookup(domain);
        if(evidence.status!=='ok'||evidence.asciiHost!==domain||evidence.registrableDomain!==domain||evidence.publicSuffix!==suffix||evidence.section!==(section==='I'?'ICANN':'PRIVATE'))return unavailable('normalization-incompatible');
        if(ranks.has(rank))return unavailable('corrupt');ranks.add(rank);accepted+=count;
        previous=domain;records.push(Object.freeze([...tuple]));
      }
      const stats=manifest.tiers?.['10000'];
      if(!stats||stats.selectedRows!==10000||stats.acceptedRows!==accepted||stats.distinctRegistrableDomains!==records.length||stats.deduplicatedRows!==accepted-records.length||!Number.isInteger(stats.excludedRows)||stats.excludedRows<0||accepted+stats.excludedRows!==10000)return unavailable('corrupt');
      for(const cutoff of [1000,5000])if(manifest.tiers?.[cutoff]?.distinctRegistrableDomains!==records.filter(r=>r[1]<=cutoff).length)return unavailable('corrupt');
      return Object.freeze({status:'ready',stage:'foundation-only',automaticMatchingAvailable:false,provider:'majestic',boundaries,fields:Object.freeze([...popular.fields]),records:Object.freeze(records),sourceSHA256:popular.sourceSHA256});
    }catch{return unavailable('corrupt');}
  }
  return Object.freeze({load});
})();
