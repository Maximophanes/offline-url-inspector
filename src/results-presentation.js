'use strict';
// Unified display policy only. No detector, parser, persistence, DOM or I/O.
const ResultsPresentation=(()=>{
 const canonical=s=>String(s||'').replace(/\.$/,'').toLowerCase();
 const sourceNames={expected:'Expected Hostname','personal-reference':'Personal Reference Domains','builtin-majestic':'Built-in popular-domain references','original-hostname':'Original inspected hostname'};
 const strong=e=>['unicode-visual','ascii-visual','structural'].includes(e.class);
 // Character identities come only from the verified evidence records. Missing
 // metadata falls back to exact code points, never guessed script or names.
 function unicodeText(span,characters){
  const points=[...span],records=points.map(ch=>characters?.find(c=>c.ch===ch&&c.code===Inspector.cp(ch)));
  const scripts=records.every(c=>c?.script&&c.script!=='Unknown')?[...new Set(records.map(c=>c.script).filter(s=>!['Common','Inherited'].includes(s)))]:[];
  const script=scripts.length===1?scripts[0]+' ':scripts.length>1?scripts.join(' / ')+' ':'';
  return script+(points.length===1?'character ':'sequence ')+'“'+span+'” ('+points.map(Inspector.cp).join(' ')+')';
 }
 function unicodeEvidence(m){
  const a=m.actualChangedSpan||'',b=m.referenceChangedSpan||'';
  if(!a||!b||[...a].length>8||[...b].length>8)return 'The hostnames use different Unicode characters with matching visual-comparison data. Character evidence identifies the changed text.';
  const actual=unicodeText(a,m.actualCharacters),reference=unicodeText(b,m.referenceCharacters);
  return Inspector.skeleton(a)!==null&&Inspector.skeleton(a)===Inspector.skeleton(b)?actual+' can resemble '+reference+'.':'Whole-hostname Unicode comparison supports the resemblance. Changed text: '+actual+' and '+reference+'.';
 }
 const joined=values=>values.length<3?values.join(' and '):values.slice(0,-1).join(', ')+', and '+values.at(-1);
 const identity=(ch,records)=>records?.find(c=>c.ch===ch&&c.code===Inspector.cp(ch)&&c.script&&c.script!=='Unknown');
 function unicodePhrase(points,records,sequence=false){
  const identities=points.map(ch=>identity(ch,records));if(identities.some(c=>!c))return null;
  const scripts=[...new Set(identities.map(c=>c.script))];if(scripts.some(s=>['Common','Inherited'].includes(s)))return null;
  if(scripts.length>1)return !sequence&&points.length<=4&&scripts.length<=2?joined(scripts.map(script=>unicodePhrase(points.filter((ch,i)=>identities[i].script===script),records))):null;
  const noun=sequence?'sequence':identities.every(c=>/\bLETTER\b/.test(c.name||''))?'letter':'character';
  return scripts[0]+' '+noun+(!sequence&&points.length>1?'s':'')+' '+(sequence?'“'+points.join('')+'”':joined(points.map(ch=>'“'+ch+'”')));
 }
 function unicodeMechanism(m){
  const a=[...(m.actualChangedSpan||'')],b=[...(m.referenceChangedSpan||'')],fallback='Different Unicode characters support the visual resemblance. Technical Details identifies the characters.';
  if(!a.length||!b.length||a.length>32||b.length>32)return fallback;
  const key=Inspector.skeleton(a.join(''));if(key===null||key!==Inspector.skeleton(b.join('')))return fallback;
  // Positional pairs are asserted only when every differing character has its
  // own independently matching skeleton. Whole-span evidence alone is weaker.
  if(a.length===b.length){
   const pairs=a.flatMap((ch,i)=>ch===b[i]?[]:[[ch,b[i]]]);
   if(pairs.length&&pairs.every(([x,y])=>Inspector.skeleton(x)!==null&&Inspector.skeleton(x)===Inspector.skeleton(y))){
    const unique=[...new Map(pairs.map(pair=>[JSON.stringify(pair),pair])).values()],left=unicodePhrase([...new Set(unique.map(p=>p[0]))],m.actualCharacters),right=unicodePhrase([...new Set(unique.map(p=>p[1]))],m.referenceCharacters);
    if(left&&right&&unique.length<=4)return left+' can resemble '+right+'.';
    if(left&&right)return 'Several '+identity(unique[0][0],m.actualCharacters).script+' characters can resemble '+identity(unique[0][1],m.referenceCharacters).script+' characters in the comparison name. See Technical Details for each character.';
   }
  }
  // A short one-to-many mapping can be described as a verified sequence,
  // without claiming any individual positional substitutions.
  if(a.length<=3&&b.length<=3){const left=unicodePhrase(a,m.actualCharacters,a.length>1),right=unicodePhrase(b,m.referenceCharacters,b.length>1);if(left&&right)return left+' can resemble '+right+'.';}
  return fallback;
 }
 function readableCue(r){
  if(!r.ok||r.decodeError||!r.unicode||r.unicode===r.ascii)return '';
  const points=[...new Set([...r.unicode].filter(ch=>ch.codePointAt(0)>127))];
  if(points.some(ch=>r.characters?.find(c=>c.ch===ch)?.invisible))return 'Contains hidden or formatting characters. Review Technical Details.';
  const groups=new Map();for(const ch of points){const c=identity(ch,r.characters);if(!c||['Common','Inherited'].includes(c.script))return 'Contains Unicode characters; their identities are in Technical Details.';const group=groups.get(c.script)||[];group.push(ch);groups.set(c.script,group);}
  if(!points.length)return '';
  if(groups.size>2)return 'Contains characters from several writing systems. See Technical Details for their identities.';
  if(points.length>4)return 'Contains '+joined([...groups.keys()])+' characters. See Technical Details for their identities.';
  return 'Contains '+[...groups.values()].map(chars=>unicodePhrase(chars,r.characters)).join('; ')+'.';
 }
 function manualMechanism(r,hostname,c){
  if(c.asciiSubstitutions?.length)return c.asciiSubstitutions.map(p=>'“'+p.actual+'” can look like “'+p.expected+'”').join('; ')+'.';
  if(c.mechanism==='UTS #39'){
   const a=[...r.unicode],b=[...Inspector.expectedHost(hostname).unicode];let start=0,endA=a.length,endB=b.length;
   while(start<endA&&start<endB&&a[start]===b[start])start++;
   while(endA>start&&endB>start&&a[endA-1]===b[endB-1]){endA--;endB--;}
   const actual=a.slice(start,endA).join(''),reference=b.slice(start,endB).join('');
   return unicodeMechanism({actualChangedSpan:actual,referenceChangedSpan:reference,actualCharacters:[...actual].map(Inspector.info),referenceCharacters:[...reference].map(Inspector.info)});
  }
  return 'Different characters may produce a similar-looking name.';
 }
 const structuralText=hostname=>'Having '+hostname+' inside this longer hostname does not make it that domain or one of its subdomains.';
 function mechanism(e,{detailed=false}={}){const m=e.mechanism;
  if(e.class==='ascii-visual')return m.substitutions.map(p=>'“'+p.actual+'” can look like “'+p.expected+'”').join('; ')+'.'+(detailed?' Appearance can vary with the font.':'');
  if(e.class==='unicode-visual')return detailed?unicodeEvidence(m):unicodeMechanism(m);
  if(e.class==='structural')return detailed?'The hostname is under '+m.actualRegistrableDomain+'. '+(m.occurrences?.[0]?.sequence||'The comparison name')+' is part of a longer name.':structuralText(m.occurrences?.[0]?.sequence||'the comparison name');
  return 'The spelling is similar; this is not an established visual resemblance.';
 }
 function embeddedGroups(embedded){
  const groups=new Map();
  for(const c of embedded?.candidates||[]){if(!c.hostname)continue;const key=canonical(c.hostname);let g=groups.get(key);if(!g){g={hostname:key,candidates:[],occurrences:new Set(),components:new Set(),different:c.initialRelationship!=='exact',reliable:false};groups.set(key,g);}g.candidates.push(c);g.occurrences.add(c.occurrenceId??c.id);g.components.add(c.component);g.reliable||=c.type==='absolute'&&c.evidence==='fact'&&c.original?.reliable===true;}
  return [...groups.values()].map(g=>({...g,occurrences:[...g.occurrences],components:[...g.components]}));
 }
 function unsupportedNotes(result){
  const groups=new Map();
  for(const a of result.analyses||[]){if(a.automatic.status!=='ineligible')continue;
   const ending=a.automatic.boundary?.status==='unknown-suffix'?a.hostname.match(/\.([a-z0-9-]+)$/i)?.[1]:null,key=ending||a.automatic.boundary?.status||'other';
   const group=groups.get(key)||{ending,original:false,embedded:false};
   group.original||=a.sourceIds.some(id=>result.sources[id-1]?.role==='original');group.embedded||=a.sourceIds.some(id=>result.sources[id-1]?.role==='embedded');groups.set(key,group);
  }
  return [...groups.values()].map(g=>g.original?(g.ending?'Automatic popular-domain comparisons do not apply to .'+g.ending+' addresses.':'Automatic popular-domain comparisons aren’t available for this kind of hostname.'):(g.ending?'Automatic popular-domain comparisons do not apply to embedded .'+g.ending+' hostnames.':'Automatic popular-domain comparisons aren’t available for some embedded hostnames.'));
 }
 function coverage(result){
  if(!result||result.status==='invalid-input')return [];
  const limits=result.coverage.limitations||[],codes=new Set(limits.map(l=>l.code)),parts=[];
  if(result.data.status==='unavailable')parts.push('Popular-domain comparisons could not be run.');
  else parts.push(...unsupportedNotes(result));
  if(result.data.status==='ready'&&result.coverage.automatic==='unavailable')parts.push('Popular-domain comparisons could not be completed.');
  if(['depth','expansions'].some(c=>codes.has(c)))parts.push('Some deeper addresses inside this URL were not checked.');
  if(codes.has('percent-depth'))parts.push('Further encoded addresses were not checked.');
  if(result.coverage.embedded.occurrences==='partial'&&!parts.some(p=>p.includes('deeper')||p.includes('encoded')))parts.push('Some addresses or repeated appearances inside this URL could not be fully checked.');
  if(result.coverage.resourceLimited&&!parts.some(p=>p.includes('could not be fully')||p.includes('deeper')||p.includes('encoded'))){
   if(limits.some(l=>l.scope==='automatic'))parts.push('Some popular-domain comparisons stopped at the processing limit.');
   if(limits.some(l=>l.scope==='embedded'))parts.push('Some embedded-address checks stopped at the processing limit.');
   if(limits.some(l=>l.scope==='reconciliation'))parts.push('Some comparison evidence could not be assembled at the processing limit.');
  }
  if(result.data.status==='ready'&&result.analyses.some(a=>a.automatic.status==='unavailable'||a.automatic.status==='partial'&&a.automatic.limitations.some(code=>code!=='uts39-rtl-bidi-unavailable'))&&!result.coverage.resourceLimited&&result.coverage.automatic!=='unavailable')parts.push('Some popular-domain comparisons could not be completed.');

  if(result.coverage.embedded.extraction==='unavailable')parts.push('Addresses inside this URL could not be checked.');
  if(result.coverage.manual?.references==='partial')parts.push('Some comparisons with your saved reference domains could not be completed.');
  if(result.coverage.manual?.expected==='unsupported')parts.push('Visual similarity to your Expected Hostname could not be checked.');
  if(codes.has('uts39-rtl-bidi-unavailable'))parts.push('Right-to-left visual comparisons aren’t supported; other applicable checks still run.');
  if(codes.has('unresolved-relative')||codes.has('uncertain-address'))parts.push('Some address-like text could not be assigned a reliable website name.');
  if(result.coverage.automatic==='partial'&&!parts.length)parts.push('Some popular-domain comparisons could not be completed.');
  return [...new Set(parts)];
 }
 function select(r,refs,model,result){
  const candidates=[],seen=new Set(),has=code=>r.messages.some(m=>m.code===code),add=c=>{if(!seen.has(c.key)){seen.add(c.key);candidates.push(c);}};
  if(!r.ok)return {primary:{key:'invalid',kind:'error',title:Presentation.inputFailure(r).title,detail:Presentation.inputFailure(r).detail},other:[],coverage:[],embedded:[]};
  const groups=embeddedGroups(result?.embedded),limits=coverage(result);
  if(r.decodeError||has('dns')||has('attribution'))add({key:'validation',priority:110,kind:'caution',title:'The hostname needs review',detail:r.decodeError?'The encoded website name could not be validated. The browser hostname is '+r.ascii+'. See the character evidence.':has('attribution')?'The browser read this address, but its hostname could not be traced reliably to the original text.':'This hostname does not follow standard website naming rules.'});
  for(const g of model?.findings||[]){if(!g.evidence.some(strong))continue;const original=g.sources.some(s=>s.role==='original'),e=g.evidence.find(strong),structural=e.class==='structural',thoughts=[...new Set(g.evidence.filter(strong).map(e=>mechanism(e)))];add({key:'match:'+g.hostname+'|'+g.reference.domain,priority:original?(structural?90:100):(structural?80:85),kind:'caution',title:structural?'Misleading hostname structure':'Possible lookalike website',match:(original?(structural?'Contains the name ':'May resemble '):g.hostname+(structural?' contains the name ':' may resemble '))+g.reference.domain,detail:thoughts.join(' '),thoughts,hostname:g.hostname,reference:g.reference.domain,group:g,embedded:!original});}
  // Explicit and personal comparisons retain their source and original proof.
  // A built-in explanation for the same pair already covers that finding.
  const manual=[];if(r.comparison&&r.expected)manual.push({hostname:r.expected.ascii,comparison:r.comparison,source:'Expected Hostname',explicit:true});
  for(const key of ['visual','embedded'])for(const v of refs[key]||[])manual.push({...v,source:'Personal Reference Domains'});
  for(const m of manual){const key='match:'+canonical(r.ascii)+'|'+canonical(m.hostname);if(seen.has(key))continue;const c=m.comparison;if(!c?.visual&&c?.kind!=='structure'&&!(refs.embedded||[]).some(e=>e===m))continue;if(!c?.visual)continue;add({key,priority:m.explicit?101:99,kind:'caution',title:'Possible lookalike website',match:'May resemble '+m.hostname,detail:manualMechanism(r,m.hostname,c)+' '+'Check the address before opening it or entering information.',hostname:canonical(r.ascii),reference:m.hostname,source:m.source});}
  // Supported embedded user/original-host comparisons do not depend on a
  // built-in match or automatic eligibility. Consume reconciled proof, without
  // promoting exact membership or legitimate parent/subdomain relationships.
  const embeddedManual=new Map();
  for(const relation of result?.relationships||[]){
   const visual=['unicode-visual','ascii-visual'].includes(relation.class),structural=relation.class==='structural'&&relation.scope==='legacy-name-inside';
   if(!visual&&!structural)continue;
   const source=relation.sourceIds.map(id=>result.sources[id-1]).find(s=>s?.role==='embedded');
   if(!source)continue;
   const candidate=result.embedded.candidates[source.entryId-1],key='match:'+relation.hostname+'|'+relation.reference;
   if(seen.has(key)||!candidate?.analysis||candidate.analysis.decodeError)continue;
   const supports=relation.supports.filter(s=>s.source.kind!=='builtin-majestic'&&(visual?s.evidence.visual===true:s.evidence.relationship==='name-inside'));
   if(!supports.length)continue;
   let item=embeddedManual.get(key);
   if(!item){item={key,priority:80,kind:'caution',title:'Misleading hostname structure',match:relation.hostname+' contains the name '+relation.reference,hostname:relation.hostname,reference:relation.reference,embedded:true,thoughts:[],comparisonSources:new Set()};embeddedManual.set(key,item);}
   if(visual){item.priority=85;item.title='Possible lookalike website';item.match=relation.hostname+' may resemble '+relation.reference;}
   for(const support of supports){
    item.comparisonSources.add(sourceNames[support.source.kind]);
    const proof=visual?{...support.evidence,asciiSubstitutions:Inspector.asciiComparisonDetails(candidate.original?.reliable?candidate.original.decoded:null,candidate.analysis.unicode,Inspector.expectedHost(relation.reference))}:support.evidence;
    item.thoughts.push(visual?manualMechanism(candidate.analysis,relation.reference,proof):structuralText(relation.reference));
   }
  }
  for(const item of embeddedManual.values()){
   item.thoughts=[...new Set(item.thoughts),'Comparison source'+(item.comparisonSources.size===1?'': 's')+': '+joined([...item.comparisonSources])+'.'];
   item.detail=item.thoughts.join(' ');delete item.comparisonSources;add(item);
  }
  if(has('userinfo'))add({key:'userinfo',priority:95,kind:'caution',title:'Check the actual website name',detail:'Text before @ is not the website name. The actual hostname is '+r.ascii+'.'});
  if(has('backslash'))add({key:'backslash',priority:94,kind:'caution',title:'This address has an ambiguous structure',detail:'Browsers treat backslashes as slashes, which can change where the website name ends.'});
  if(has('invisible'))add({key:'invisible',priority:96,kind:'caution',title:'Hidden characters need review',detail:'The supplied address contains hidden or formatting characters. Character Details identifies them.'});
  const placements=[...(has('deceptive-subdomain')&&r.expected?[{hostname:r.expected.ascii}]:[]),...(refs.embedded||[])];
  for(const item of placements){if(candidates.some(c=>c.hostname===canonical(r.ascii)&&canonical(c.reference)===canonical(item.hostname)&&c.group?.evidence.some(e=>e.class==='structural')))continue;add({key:'manual-structure:'+canonical(item.hostname),priority:89,kind:'caution',title:'Misleading hostname structure',match:'Contains '+item.hostname,hostname:canonical(r.ascii),reference:item.hostname,detail:structuralText(item.hostname)});}
  for(const g of groups){const warnings=new Set(g.candidates.flatMap(c=>c.warnings||[])),details=[];
   if(warnings.has('userinfo'))details.push('Text before @ is not the website name. The actual hostname is '+g.hostname+'.');
   if(warnings.has('invisible'))details.push('An embedded address contains hidden characters.');
   if(warnings.has('backslash'))details.push('Backslashes affect an embedded address’s structure.');
   const recorded=code=>g.candidates.some(c=>c.analysis?.diagnostics?.some(m=>m.code===code));
   if(recorded('http'))add({key:'embedded-http:'+g.hostname,priority:49,kind:'caution',family:'transport',title:'Unencrypted HTTP',match:g.hostname,detail:'HTTP does not encrypt information sent to this website.',hostname:g.hostname,embedded:true});
   const ports=[...new Set(g.candidates.filter(c=>c.type==='absolute'&&['http:','https:'].includes(c.scheme)&&c.effectivePort&&c.effectivePort!==(c.scheme==='https:'?'443':'80')).map(c=>c.effectivePort))];
   if(ports.length)add({key:'embedded-port:'+g.hostname,priority:44,kind:'information',title:'Port '+ports.join(', ')+' specified',match:g.hostname,detail:'Some websites use different ports. A port number alone does not establish deception.',hostname:g.hostname,embedded:true});
   if(recorded('percent'))details.push('An embedded address contains incomplete or invalid percent encoding.');
   if(['punycode','dns','attribution'].some(recorded))details.push('An embedded hostname needs validation review. Check its naming and character evidence.');
   if(g.candidates.some(c=>c.conflicting))details.push('A repeated parameter contains different addresses. Which one the website uses is unknown.');
   if(details.length)add({key:'embedded-warning:'+g.hostname,priority:warnings.size||g.candidates.some(c=>c.conflicting)||['punycode','dns','attribution'].some(recorded)?75:recorded('percent')?59:recorded('http')?49:44,kind:'caution',title:'Address needs review',match:g.hostname,detail:details.join(' '),thoughts:details,hostname:g.hostname,embedded:true});
  }
  if(r.expectedError)add({key:'expected-error',priority:30,kind:'information',title:'Expected hostname was not checked',detail:'Correct the Expected Hostname field to compare it. Other available checks are shown here.'});
  else if(r.comparison&&!r.comparison.exact&&!r.comparison.visual&&!has('deceptive-subdomain'))add({key:'expected-mismatch',priority:72,kind:'caution',title:'Different from your expected hostname',match:r.expected.ascii,detail:'The hostname differs from your Expected Hostname, '+r.expected.ascii+'.'});
  if(has('percent'))add({key:'percent',priority:60,kind:'caution',title:'Some URL encoding needs review',detail:'Some percent-encoded text is incomplete or invalid. Check the original text; this can affect how the address is read.'});
  if(has('http'))add({key:'http',priority:50,kind:'caution',family:'transport',title:'Unencrypted HTTP',detail:'HTTP does not encrypt information sent to this website.'});
  if(has('port'))add({key:'port',priority:45,kind:'information',title:'Port '+r.port+' specified',detail:'Some websites use different ports. A port number alone does not establish deception.'});
  for(const g of model?.spelling||[])add({key:'spelling:'+g.hostname+'|'+g.reference.domain,priority:20,kind:'information',title:'Similar spelling',match:(g.sources.some(s=>s.role==='original')?'':g.hostname+' · ')+'Close to '+g.reference.domain,detail:'Spelling alone is weak evidence.',group:g,hostname:g.hostname,reference:g.reference.domain,embedded:!g.sources.some(s=>s.role==='original')});
  for(const item of refs.spelling||[])add({key:'spelling:'+canonical(r.ascii)+'|'+canonical(item.hostname),priority:20,kind:'information',title:'Similar spelling',match:'Close to '+item.hostname,detail:'The spelling is similar to a saved reference. Spelling alone is weak evidence.',hostname:canonical(r.ascii),reference:item.hostname,source:'Personal Reference Domains'});
  if(r.comparison?.exact)add({key:'exact-manual',priority:10,kind:'neutral',title:'Matches your expected hostname',detail:'Only the hostname matches. The website and the rest of the link have not been verified.'});
  if(refs.exact?.length)add({key:'exact-saved',priority:9,kind:'neutral',title:'Matches your saved reference',detail:'The hostname matches '+refs.exact[0].hostname+', which you saved in Your Reference Domains. This does not verify website safety.'});
  else if(refs.subdomains?.length)add({key:'subdomain-saved',priority:8,kind:'neutral',title:'Subdomain of your saved reference',detail:'The hostname is a subdomain of '+refs.subdomains[0].hostname+', which you saved. This is not an exact hostname match and does not verify website safety.'});
  const unsupportedOnly=result?.data.status==='ready'&&unsupportedNotes(result).length>0&&result.analyses.every(a=>['complete','ineligible'].includes(a.automatic.status))&&result.coverage.embedded.extraction==='complete'&&result.coverage.embedded.occurrences==='complete'&&!result.coverage.resourceLimited&&limits.every(note=>unsupportedNotes(result).includes(note));
  if(!candidates.length&&unsupportedOnly)add({key:'unsupported',priority:0,kind:'neutral',title:result.coverage.automatic==='unsupported'?'Automatic comparisons unavailable':'Some automatic comparisons are unavailable',detail:limits.join(' ')});
  if(!candidates.length&&limits.length)add({key:'incomplete',priority:40,kind:'information',title:'Some checks could not be completed',detail:limits.join(' ')+' Review the address in context.'});
  if(!candidates.length)add({key:'neutral',priority:0,kind:'neutral',title:'No lookalike warnings found',detail:'No notable hostname resemblance was detected by the supported checks. This does not verify that the website is safe.'});
  candidates.sort((a,b)=>b.priority-a.priority);
  // Consolidate equivalent hostname-identity evidence within each source
  // scope. Independent security families, such as transport, keep cautions.
  const byHost=new Map();
  const concise=text=>text.replace(/ Check the address before opening it or entering information\./g,'').trim();
  for(let i=0;i<candidates.length;){const item=candidates[i];item.thoughts=[...new Set((item.thoughts||[item.detail]).map(concise))];item.detail=item.thoughts.join(' ');
   if(item.kind!=='caution'){i++;continue;}
   item.hostname??=canonical(r.ascii);const key=(item.embedded?'inside:':'original:')+item.hostname+'|'+(item.family||'identity'),prior=byHost.get(key);
   if(!prior){byHost.set(key,item);i++;continue;}
   for(const [n,text]of item.thoughts.entries()){const thought=(!n&&item.reference&&item.reference!==prior.reference?(item.key.startsWith('expected-')?'Expected name: ':'Also compared with ')+item.reference+'. ':'')+text;
    if(!prior.thoughts.includes(thought))prior.thoughts.push(thought);}
   prior.detail=prior.thoughts.join(' ');candidates.splice(i,1);
  }
  // An invalid optional target is explained beside its field and as a secondary
  // notice; it must not erase an independently successful saved comparison.
  if(candidates[0]?.key==='expected-error'&&candidates.every(c=>c.key==='expected-error'||c.kind==='neutral')){
   const saved=candidates.findIndex(c=>['exact-saved','subdomain-saved'].includes(c.key));
   if(saved>0)candidates.unshift(candidates.splice(saved,1)[0]);
  }
  const primary=candidates[0];
  const other=candidates.slice(1).filter(c=>c.kind!=='neutral').filter(c=>!c.key.startsWith('manual-structure:')||!candidates.some(x=>x.group?.reference.domain===c.reference&&x.hostname===c.hostname&&x.group.evidence.some(e=>e.class==='structural')));
  if(primary.kind==='caution'){
   const cautions=[primary,...other].filter(c=>c.kind==='caution'),transport=cautions.some(c=>c.family==='transport'),identity=cautions.some(c=>c.family!=='transport');
   const advice=transport?(identity?'Check the actual hostname of each address. Avoid submitting passwords or other sensitive information without HTTPS.':'Avoid submitting passwords or other sensitive information to HTTP addresses; use HTTPS instead.'):'Check the actual hostname before opening an address or entering sensitive information.';
   primary.thoughts.push(advice);primary.detail=primary.thoughts.join(' ');
  }
  for(const item of [primary,...other])if(item.embedded){const group=groups.find(g=>g.hostname===item.hostname),candidate=group?.candidates.find(c=>c.analysis&&!c.analysis.decodeError&&c.analysis.unicode&&c.analysis.unicode!==c.hostname);if(candidate){item.readableHostname=candidate.analysis.unicode;item.browserHostname=candidate.hostname;}}
  return {primary,other,coverage:['incomplete','unsupported'].includes(primary.key)?[]:limits,embedded:groups};
 }
 return Object.freeze({select,mechanism,readableCue,embeddedGroups,coverage,sourceNames});
})();
