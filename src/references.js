'use strict';
const ReferenceDomains = (() => {
  const APPLICATION='offline-url-inspector',KEY='offline-url-inspector:reference-domains';
  const SCHEMA=1,MAX_ENTRIES=100,MAX_BYTES=131072;
  function normalize(value){
    if(typeof value!=='string'||!value.trim()||value.length>2048)throw Error('Each reference must be a nonempty hostname (at most 2,048 input characters).');
    const parsed=Inspector.expectedHost(value);if(!parsed)throw Error('A hostname is required.');
    return parsed.ascii;
  }
  function normalizeList(values){
    if(!Array.isArray(values)||values.length>MAX_ENTRIES)throw Error('Reference lists must contain at most '+MAX_ENTRIES+' entries.');
    const result=[];let duplicates=0;
    values.forEach((value,index)=>{let host;try{host=normalize(value);}catch(e){throw Error('Entry '+(index+1)+': '+e.message);}if(result.includes(host))duplicates++;else result.push(host);});
    return {references:result,duplicates};
  }
  const serialize=references=>JSON.stringify({application:APPLICATION,schemaVersion:SCHEMA,references},null,2);
  function parse(text){
    if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('Reference JSON exceeds the 128 KiB limit.');
    let data;try{data=JSON.parse(text);}catch{throw Error('Reference file is not valid JSON.');}
    if(!data||Array.isArray(data)||typeof data!=='object'||data.application!==APPLICATION)throw Error('This is not an Offline URL Inspector reference backup.');
    if(!Number.isInteger(data.schemaVersion)||![0,SCHEMA].includes(data.schemaVersion))throw Error('Unsupported reference schema. Existing data has been preserved.');
    const listKey=data.schemaVersion===0?'domains':'references';
    if(Object.keys(data).sort().join(',')!==['application','schemaVersion',listKey].sort().join(','))throw Error('Unexpected fields in reference data. Import only the documented backup format.');
    const result=normalizeList(data[listKey]);
    return {...result,migrated:data.schemaVersion===0};
  }
  function create({storage=()=>null,protocol='file:'}={}){
    let adapter=null,references=[],lastRaw=null,mode='session',blocked=false,revision=0,nextPlan=0;
    let status='Session-only reference domains. Browser storage is unavailable; use Export to keep a backup.';
    const plans=new Map();
    const savedStatus=()=>protocol==='file:'?'Saved in this browser’s file storage. file:// persistence is not standardized; Export a backup.':'Saved in this browser. Private browsing may be temporary; clearing site data removes references. Export a backup.';
    try{
      adapter=storage();if(!adapter)throw Error('Unavailable');
      lastRaw=adapter.getItem(KEY);mode='browser';status=lastRaw===null?(protocol==='file:'?'Local-file storage can be read; saving is verified when you change the list. file:// persistence is not standardized; Export backups.':'Browser storage can be read; saving is verified on your first change. Private browsing may be temporary. Export backups.'):savedStatus();
      if(lastRaw!==null){
        try{const parsed=parse(lastRaw);references=parsed.references;
          if(parsed.migrated){try{const next=serialize(references);if(adapter.getItem(KEY)!==lastRaw)throw Error('Stored references changed during migration.');adapter.setItem(KEY,next);lastRaw=next;status='Reference schema migrated without discarding valid entries. '+savedStatus();}catch{mode='session';status='Valid saved references are available this session, but the schema migration could not be saved. Original saved bytes remain untouched. Export a backup.';}}
        }catch(e){blocked=true;mode='protected';status='Saved reference data could not be loaded and was left untouched. '+e.message+' New changes are session-only until an explicitly reviewed replacement or Clear all.';}
      }
    }catch{mode='session';status='Session-only reference domains. Browser storage is unavailable or disabled; Export is the recovery mechanism.';}
    function snapshot(){return {references:[...references],mode,status,blocked,revision,key:KEY,schemaVersion:SCHEMA};}
    function commit(next,{replaceSaved=false}={}){
      references=[...next];revision++;plans.clear();
      if(!adapter||mode==='session'){status='Session-only reference changes. The last stored copy, if any, was not replaced; Export a backup.';return snapshot();}
      if(blocked&&!replaceSaved){status='Session-only changes; unreadable or conflicting saved data remains untouched. Export current references, or review an explicit replacement.';return snapshot();}
      try{
        const current=adapter.getItem(KEY);
        if(!replaceSaved&&current!==lastRaw){blocked=true;mode='protected';status='References changed in another tab or app. Saved data was not overwritten; these changes are session-only. Export before reloading or replacing.';return snapshot();}
        const text=serialize(references);adapter.setItem(KEY,text);lastRaw=text;blocked=false;mode='browser';status=savedStatus();
      }catch{mode='session';status='Session-only changes: browser storage could not be written. Existing saved data was not replaced. Export a backup.';}
      return snapshot();
    }
    function add(value){const host=normalize(value);if(references.includes(host))throw Error('That normalized hostname is already in Reference Domains.');if(references.length>=MAX_ENTRIES)throw Error('The reference list is limited to '+MAX_ENTRIES+' entries.');return commit([...references,host]);}
    function edit(previous,value){const host=normalize(value),index=references.indexOf(previous);if(index<0)throw Error('That reference no longer exists.');if(host!==previous&&references.includes(host))throw Error('That normalized hostname already exists.');const next=[...references];next[index]=host;return commit(next);}
    function remove(host){if(!references.includes(host))throw Error('That reference no longer exists.');return commit(references.filter(h=>h!==host));}
    function clear(confirmed=false){if(!confirmed)throw Error('Clearing all references requires explicit confirmation.');return commit([],{replaceSaved:true});}
    function planImport(text,mode='merge'){
      if(!['merge','replace'].includes(mode))throw Error('Choose Merge or Replace.');
      const incoming=parse(text),final=mode==='merge'?[...references]:[];
      for(const host of incoming.references)if(!final.includes(host))final.push(host);
      if(final.length>MAX_ENTRIES)throw Error('The combined list would exceed '+MAX_ENTRIES+' reference domains.');
      const plan={id:++nextPlan,baseRevision:revision,mode,final,added:final.filter(h=>!references.includes(h)),removed:references.filter(h=>!final.includes(h)),duplicates:incoming.duplicates+incoming.references.filter(h=>references.includes(h)).length,migrated:incoming.migrated};
      plans.clear();plans.set(plan.id,plan);return {...plan,final:[...plan.final],added:[...plan.added],removed:[...plan.removed]};
    }
    function applyImport(review,replaceConfirmed=false){const plan=plans.get(review?.id);if(!plan||plan.baseRevision!==revision)throw Error('The list changed; review the import again.');if(plan.mode==='replace'&&!replaceConfirmed)throw Error('Replacing references requires explicit confirmation after review.');return commit(plan.final,{replaceSaved:plan.mode==='replace'&&replaceConfirmed});}
    return Object.freeze({snapshot,add,edit,remove,clear,planImport,applyImport,cancelImport:()=>plans.clear(),exportJSON:()=>serialize(references)});
  }
  const special=host=>host.startsWith('[')||/^(?:\d+\.){3}\d+$/.test(host)||!host.includes('.');
  function compare(result,values){
    const response={checked:values.length,exact:[],subdomains:[],embedded:[],visual:[],spelling:[],unavailable:0,totalMatches:0};
    if(!result.ok)return response;
    const actual=result.ascii.replace(/\.$/,'').toLowerCase();
    for(const hostname of values){
      const expected=Inspector.expectedHost(hostname),entry={hostname,unicode:expected.unicode};
      if(actual===expected.ascii){response.exact.push(entry);continue;}
      if(special(actual)||special(expected.ascii))continue;
      if(actual.endsWith('.'+expected.ascii))response.subdomains.push(entry);
      else if(actual.startsWith(expected.ascii+'.')||actual.includes('.'+expected.ascii+'.'))response.embedded.push(entry);
      if(result.decodeError){response.unavailable++;continue;}
      const c=Inspector.compareHostnames(actual,result.unicode,result.original?.reliable?result.original.decoded:null,expected);
      if(c.unavailable)response.unavailable++;
      if(c.visual){c.asciiSubstitutions=Inspector.asciiComparisonDetails(result.original?.reliable?result.original.decoded:null,result.unicode,expected);response.visual.push({...entry,comparison:c});}
      else if(c.kind==='spelling')response.spelling.push({...entry,comparison:c});
    }
    for(const key of ['exact','subdomains','embedded','visual','spelling']){response[key].sort((a,b)=>b.hostname.length-a.hostname.length||a.hostname.localeCompare(b.hostname));response.totalMatches+=response[key].length;}
    return response;
  }
  return Object.freeze({APPLICATION,KEY,SCHEMA,MAX_ENTRIES,MAX_BYTES,normalize,parse,create,compare,special});
})();
