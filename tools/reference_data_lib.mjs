// Development-only, offline deterministic data preparation. Standard libraries only.
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const sha=value=>createHash('sha256').update(value).digest('hex');
export const read=(name,base=root)=>{const path=resolve(base,name);if(statSync(path).size>8388608)throw Error('Oversized reference input: '+name);return readFileSync(path);};
export const json=(name,base=root)=>JSON.parse(read(name,base).toString('utf8'));
export function canonical(value){
  const ordered=v=>Array.isArray(v)?v.map(ordered):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered(v[k])])):v;
  return (JSON.stringify(ordered(value)).replace(/[\u007f-\uffff<>&]/g,ch=>'\\u'+ch.charCodeAt(0).toString(16).padStart(4,'0'))+'\n');
}
export function loadModules(base=root){
  const data=read('data/unicode-data.json',base).toString();
  return new Function('document',read('src/core.js',base)+'\n'+read('src/domain-boundaries.js',base)+'\nreturn {Inspector,DomainBoundaries};')({getElementById:id=>{if(id!=='unicode-data')throw Error('Unexpected document access');return {textContent:data};}});
}
function pinned(name,digest,bytes,base){
  const value=read(name,base);if(sha(value)!==digest||bytes!==undefined&&value.length!==bytes)throw Error('Pinned input differs: '+name);return value;
}
export function parseSubset(text,source){
  // Explicit small CSV reader: no code evaluation; quoted commas/newlines stay fields.
  const rows=[];let row=[],field='',quoted=false,closed=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(quoted){if(ch==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=ch;continue;}
    if(ch==='"'){if(field||closed)throw Error('Malformed CSV quote');quoted=true;continue;}
    if(ch===','||ch==='\n'){
      row.push(field);field='';closed=false;if(ch==='\n'){rows.push(row);row=[];}continue;
    }
    if(closed||ch==='\r')throw Error('Noncanonical subset CSV');field+=ch;
  }
  if(quoted||field||row.length||closed)throw Error('Incomplete subset CSV');
  if(JSON.stringify(rows.shift())!==JSON.stringify(['GlobalRank','Domain']))throw Error('Unexpected subset header');
  if(rows.length!==source.subset.rows||source.subset.rows!==10000||source.subset.firstRank!==1||source.subset.lastRank!==10000)throw Error('Incomplete approved rank selection');
  return rows.map((r,i)=>{
    if(r.length!==2||r[0]!==String(i+1)||!r[1])throw Error('Missing, duplicate or unordered subset rank/domain');
    return {rank:i+1,hostname:r[1],sourceRow:i+1};
  });
}
export function normalizeRecords(rows,boundaries,maxRank){
  const groups=new Map(),excluded=[],exclusions={};let accepted=0;
  for(const row of rows){
    if(row.rank>maxRank)continue;
    const evidence=boundaries.lookup(row.hostname);
    if(evidence.status!=='ok'){
      const reason=evidence.status==='invalid'?evidence.reason:evidence.status;exclusions[reason]=(exclusions[reason]||0)+1;excluded.push({...row,reason});continue;
    }
    accepted++;let item=groups.get(evidence.registrableDomain);
    if(!item){item={asciiDomain:evidence.registrableDomain,unicodeDomain:evidence.unicodeRegistrableDomain,globalRank:row.rank,publicSuffixASCII:evidence.publicSuffix,section:evidence.section,rule:evidence.rule,sourceRows:[]};groups.set(item.asciiDomain,item);}
    item.globalRank=Math.min(item.globalRank,row.rank);item.sourceRows.push({...row,asciiHost:evidence.asciiHost,normalizedInputChanged:evidence.normalizedInputChanged,rule:evidence.rule,section:evidence.section});
  }
  const records=[...groups.values()].sort((a,b)=>a.asciiDomain<b.asciiDomain?-1:a.asciiDomain>b.asciiDomain?1:0).map((r,id)=>({...r,id,sourceRowCount:r.sourceRows.length,spellingEligible:r.globalRank<=1000}));
  return {records,excluded,stats:{selectedRows:rows.filter(r=>r.rank<=maxRank).length,acceptedRows:accepted,excludedRows:excluded.length,exclusions,deduplicatedRows:accepted-records.length,distinctRegistrableDomains:records.length}};
}
export function generate(base=root){
  if(Deno.version.deno!=='2.9.7'||Deno.version.v8!=='15.0.245.2-rusty')throw Error('Unreviewed normalization runtime; review differences before regenerating source pins');
  const source=json('data/popular-domains/source.json',base),psl=json('data/public-suffix/source.json',base);
  if(source.schemaVersion!==1||source.provider!=='majestic'||source.sourceURL!=='https://majestic.com/reports/majestic-million'||source.selection.policyId!=='majestic-global-10k-v1'||source.selection.referenceMaxRank!==10000||source.selection.spellingMaxRank!==1000||source.selection.topUpExcludedRows!==false||source.selection.rankCutoffsBeforeNormalization!==true||JSON.stringify(source.selection.evaluationMaxRanks)!=='[1000,5000,10000]'||JSON.stringify(source.subset.columns)!=='["GlobalRank","Domain"]'||source.original.rows!==1000000||!/^([a-f0-9]{64})$/.test(source.original.sha256))throw Error('Unsupported source/selection policy');
  if(psl.schemaVersion!==1||psl.license.spdx!=='MPL-2.0'||source.license.spdx!=='CC-BY-3.0')throw Error('Unsupported source/license schema');
  const unicode=pinned('data/unicode-data.json',read('data/unicode-data.sha256',base).toString().trim(),undefined,base),unicodeHash=sha(unicode);
  if(JSON.parse(unicode).version!=='18.0.0'||unicodeHash!=='806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1')throw Error('Incompatible Unicode data');
  const subset=pinned('data/popular-domains/source.csv',source.subset.sha256,source.subset.bytes,base),raw=pinned('data/public-suffix/public_suffix_list.dat',psl.sha256,psl.bytes,base);
  pinned('data/popular-domains/NOTICE.txt',source.license.noticeSHA256,undefined,base);pinned('data/public-suffix/NOTICE.txt',psl.license.noticeSHA256,undefined,base);pinned('data/public-suffix/LICENSE.txt',psl.license.sha256,undefined,base);pinned('data/public-suffix/test_psl.txt',psl.fixtures.sha256,undefined,base);
  const rawText=new TextDecoder('utf-8',{fatal:true}).decode(raw),header='// VERSION: '+psl.version+'\n// COMMIT: '+psl.upstreamCommit+'\n\n';
  if(rawText.split(header).length!==2)throw Error('PSL publication identity mismatch');
  const upstream=Buffer.from(rawText.replace(header,'')),blob=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+upstream.length+'\0'),upstream])).digest('hex');
  if(blob!==psl.upstreamGitBlobSHA1)throw Error('PSL upstream blob mismatch');
  const {Inspector:I,DomainBoundaries:B}=loadModules(base),rules=B.compile(rawText,I);
  if(rules.ICANN.length!==psl.rules.ICANN||rules.PRIVATE.length!==psl.rules.PRIVATE||Object.values(rules).flat().filter(r=>r.startsWith('*.')).length!==psl.rules.wildcards||Object.values(rules).flat().filter(r=>r.startsWith('!')).length!==psl.rules.exceptions)throw Error('PSL rule inventory mismatch');
  const pslAsset={schemaVersion:1,kind:'public-suffix-rules',sourceSHA256:psl.sha256,unicodeDataSHA256:unicodeHash,rules};
  const boundaries=B.create(I,pslAsset,{sourceSHA256:psl.sha256,unicodeDataSHA256:unicodeHash});if(boundaries.status!=='ready')throw Error('Compiled PSL unavailable');
  const rows=parseSubset(new TextDecoder('utf-8',{fatal:true}).decode(subset),source),tiers={};
  for(const max of [1000,5000,10000])tiers[max]=normalizeRecords(rows,boundaries,max);
  const result=tiers[10000],records=result.records.map(r=>[r.asciiDomain,r.globalRank,r.sourceRowCount,r.publicSuffixASCII,r.section==='ICANN'?'I':'P']);
  const popularAsset={schemaVersion:1,kind:'popular-domain-records',provider:'majestic',sourceSHA256:source.original.sha256,subsetSHA256:source.subset.sha256,pslSHA256:psl.sha256,unicodeDataSHA256:unicodeHash,normalizationPolicyId:'oui-native-url-psl-v1',selectionPolicyId:source.selection.policyId,referenceMaxRank:10000,spellingMaxRank:1000,fields:['asciiDomain','globalRank','sourceRowCount','publicSuffixASCII','section'],records};
  const outputs={
    'data/public-suffix/compiled.json':canonical(pslAsset),
    'data/popular-domains/records.json':canonical(popularAsset),
    'data/popular-domains/provenance.json':canonical({schemaVersion:1,kind:'popular-domain-provenance',sourceSHA256:source.original.sha256,subsetSHA256:source.subset.sha256,records:result.records.map(r=>({id:r.id,asciiDomain:r.asciiDomain,unicodeDomain:r.unicodeDomain,globalRank:r.globalRank,sourceRows:r.sourceRows})),excluded:result.excluded})
  };
  const sourceFiles=['tools/generate_reference_data.mjs','tools/reference_data_lib.mjs','tools/extract_majestic.py','src/domain-boundaries.js','src/reference-data.js','src/core.js'];
  const generatorFiles=Object.fromEntries(sourceFiles.map(name=>[name,sha(read(name,base))]));
  const licenses={majestic:source.license,psl:psl.license};
  const manifest={schemaVersion:1,application:'offline-url-inspector',kind:'reference-foundation',status:'foundation-only',automaticMatchingAvailable:false,indexFormatVersion:null,provider:'majestic',source,psl,unicode:{version:'18.0.0',uts39Revision:34,scope:'ltr-fast-path',sha256:unicodeHash},normalizationPolicyId:'oui-native-url-psl-v1',generator:{formatVersion:1,files:generatorFiles,referenceRuntime:{name:'Deno',version:'2.9.7',v8:'15.0.245.2-rusty'},note:'Runtime identity records the reviewed generation environment; outputs must compare byte-for-byte on another runtime before acceptance.'},recordCount:records.length,tiers:Object.fromEntries(Object.entries(tiers).map(([k,v])=>[k,v.stats])),licenses,assets:Object.fromEntries(Object.entries(outputs).map(([name,value])=>[name,{sha256:sha(value),bytes:Buffer.byteLength(value)}]))};
  outputs['data/reference-foundation.json']=canonical(manifest);
  return {outputs,manifest,boundaries,rows,tiers};
}
