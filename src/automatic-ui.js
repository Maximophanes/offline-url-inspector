'use strict';
// Presentation/controller only. The coordinator owns evidence and eligibility.
// Sensitive parameter text is mounted only by an explicit source disclosure.
const AutomaticUI = (() => {
  const $=id=>document.getElementById(id),safe=value=>Inspector.visible(String(value));
  const el=(tag,text='',className='')=>{const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;};
  const order=['unicode-visual','ascii-visual','structural','spelling'];
  const names={'unicode-visual':'Unicode visual resemblance','ascii-visual':'ASCII visual resemblance',structural:'Structural domain placement',spelling:'Spelling-only similarity','exact-hostname':'Exact reference membership','shared-registrable-domain':'Shared registrable-domain membership'};
  const sourceNames={expected:'Expected Hostname supplied by you','personal-reference':'Personal Reference Domains','builtin-majestic':'Built-in Majestic popular-domain reference'};
  const plural=(n,one,many=one+'s')=>n+' '+(n===1?one:many);
  const lexical=(a,b)=>a<b?-1:a>b?1:0;
  let generation=0,timer=null,preparation=null,coordinator=null,current=null,currentInspection=null,currentContext=null,lastAnnouncement='',lastInspection=null;
  function row(parent,label,value,mono=false){const line=el('div','','row');line.append(el('div',label,'key'),el('div',safe(value),'value'+(mono?' mono':'')));parent.append(line);}
  function view(result){
    const groups=new Map(),memberships=new Map();
    for(const a of result.analyses)for(const finding of a.automatic.findings||[]){
      const key=JSON.stringify([a.hostname,finding.reference.domain]);let g=groups.get(key);
      if(!g){g={hostname:a.hostname,reference:finding.reference,analyses:[],evidence:[],sources:[],supports:[]};groups.set(key,g);}
      if(!g.analyses.includes(a))g.analyses.push(a);
      for(const e of finding.evidence)if(!g.evidence.some(p=>JSON.stringify(p)===JSON.stringify(e)))g.evidence.push(e);
      for(const id of a.sourceIds)if(!g.sources.some(s=>s.id===id))g.sources.push(result.sources[id-1]);
      for(const relation of result.relationships.filter(r=>r.analysisId===a.id&&r.reference===finding.reference.domain&&finding.evidence.some(e=>e.class==='structural'?r.class==='structural':e.class==='spelling'?r.class==='spelling':['unicode-visual','ascii-visual'].includes(r.class)))){
        for(const s of relation.supports)if(!g.supports.some(p=>p.source.kind===s.source.kind&&JSON.stringify(p.evidence)===JSON.stringify(s.evidence)))g.supports.push(s);
      }
    }
    for(const a of result.analyses)if(a.automatic.exact){const ref=a.automatic.exact.reference,key=JSON.stringify([a.hostname,ref.domain]);let g=memberships.get(key);if(!g){g={hostname:a.hostname,reference:ref,analyses:[],evidence:[],sources:[],supports:[],membership:true};memberships.set(key,g);}g.analyses.push(a);for(const id of a.sourceIds)g.sources.push(result.sources[id-1]);}
    const findings=[...groups.values()];
    for(const g of findings)g.evidence.sort((a,b)=>order.indexOf(a.class)-order.indexOf(b.class));
    findings.sort((a,b)=>order.indexOf(a.evidence[0].class)-order.indexOf(b.evidence[0].class)||Number(b.analyses.some(x=>x.automatic.boundary.publicSuffix===b.reference.publicSuffix))-Number(a.analyses.some(x=>x.automatic.boundary.publicSuffix===a.reference.publicSuffix))||(a.evidence[0].mechanism.transformations??0)-(b.evidence[0].mechanism.transformations??0)||a.reference.globalRank-b.reference.globalRank||lexical(a.hostname,b.hostname)||lexical(a.reference.domain,b.reference.domain));
    return {findings,memberships:[...memberships.values()],prominent:findings.filter(g=>g.evidence.some(e=>e.class!=='spelling')).slice(0,3),spelling:findings.filter(g=>g.evidence.every(e=>e.class==='spelling'))};
  }
  function cleanReveals(){for(const detail of document.querySelectorAll('.automatic-reveal')){detail.open=false;detail.querySelector('.category-body')?.replaceChildren();}}
  function clear({resetAnnouncement=true}={}){
    generation++;if(timer!==null)clearTimeout(timer);timer=null;current=null;currentInspection=null;currentContext=null;cleanReveals();
    for(const id of ['automaticRecords','otherFindings','embeddedHostSummary','embeddedGroups','inspectionEvidence','comparisonDiagnosticRecords'])$(id)?.replaceChildren();
    for(const id of ['automaticAnnouncement','inspectionCoverage','primaryScope','primaryTitle','primaryHost','primaryMatch','primaryDetail','primaryContext','automaticCount'])if($(id))$(id).textContent='';
    for(const id of ['primary','otherFindingsSection','embeddedSummarySection','inspectionCoverage','automaticDetails','embeddedGroupsDetails','resultsProgress'])$(id)?.classList.add('hidden');
    if(resetAnnouncement){lastAnnouncement='';lastInspection=null;}$('advanced').open=false;$('advanced').classList.add('hidden');$('results').removeAttribute('aria-busy');
  }
  const count=(n,singular,plural=singular+'s')=>n+' '+(n===1?singular:plural);
  const location=g=>[...new Set(g.candidates.map(c=>c.parent?'nested address text':c.component==='query'?'link parameters':c.component==='fragment'?'the part after #':'the path'))].join(', ');
  function embeddedLine(g,parent,technical=false){
    const line=el(technical?'div':'li','','embedded-host-line'),host=el('span',safe(g.hostname),'mono');line.append(host);
    if(technical)line.append(document.createTextNode(' · '+(g.different?'different from the original':'same hostname')+' · '+location(g)+(g.occurrences.length>1?' · '+count(g.occurrences.length,'recorded appearance'):'')));
    else if(g.candidates.some(c=>c.parent))line.append(el('span',g.candidates.some(c=>!c.parent)?'Also found inside another address.':'Found inside another address.','embedded-source-note'));
    if(!g.reliable)line.append(el('span',technical?' · hostname interpretation is uncertain':'Hostname interpretation is uncertain.',technical?'small':'embedded-source-note'));
    if(technical){const reveal=el('button','View exact occurrences','ghost small');reveal.type='button';reveal.addEventListener('click',()=>openAddressEvidence(g.hostname));line.append(reveal);}parent.append(line);
  }
  function comparisonRecord(g,n){
    const article=el('article','','automatic-record'),original=g.sources.some(s=>s.role==='original'),heading=el('h3',safe(original?'Compared with '+g.reference.domain:g.hostname+' → '+g.reference.domain));heading.tabIndex=-1;heading.id='automatic-record-'+n;article.setAttribute('aria-labelledby',heading.id);article.append(heading);
    article.append(el('p',g.evidence.map(e=>names[e.class]).join('; ')+' · built-in comparison','small'));
    row(article,'Source',[...new Set(g.supports.map(s=>ResultsPresentation.sourceNames[s.source.kind]).filter(Boolean))].join('; ')||'Built-in popular-domain references');
    const detail=el('details','','disclosure observation automatic-reveal'),body=el('div','','category-body small');detail.append(el('summary','How these names compare'),body);detail.addEventListener('toggle',()=>{
      body.replaceChildren();if(!detail.open)return;
      for(const e of g.evidence){body.append(el('p',safe(ResultsPresentation.mechanism(e,{detailed:true}))));const m=e.mechanism;
        if(e.class==='unicode-visual'){for(const c of new Map(m.actualCharacters.map(c=>[c.code,c])).values())row(body,'Observed character',c.code+' · '+c.name+' · '+c.script);for(const c of new Map(m.referenceCharacters.map(c=>[c.code,c])).values())row(body,'Reference character',c.code+' · '+c.name+' · '+c.script);}
        if(e.class==='spelling')row(body,'Spelling change',m.operation+' at label position '+m.offset);
      }
      for(const support of g.supports.filter(s=>s.source.kind!=='builtin-majestic'))row(body,ResultsPresentation.sourceNames[support.source.kind]+' method',Presentation.comparisonMethod(support.evidence).title);
      const a=g.analyses[0].automatic,b=a.boundary;if(b&&(g.evidence.some(e=>e.class==='structural')||b.section==='PRIVATE')){row(body,'Website-name boundary',a.registrableDomain,true);row(body,'Suffix rule',b.publicSuffix+' · '+(b.section==='PRIVATE'?'private hosting rule':'public suffix rule'),true);}
    });article.append(detail);return article;
  }
  function usefulRepresentations(r,model){
    const original=r.original?.decoded;
    return {readable:r.ok&&r.unicode&&r.unicode!==r.ascii&&!r.decodeError,original:r.ok&&original&&original!==r.ascii&&original!==r.unicode&&(original.toLowerCase()!==r.ascii.toLowerCase()||model.findings.some(g=>g.sources.some(s=>s.role==='original')&&g.evidence.some(e=>e.class==='ascii-visual'&&e.mechanism.substitutions.some(p=>/[A-Z]/.test(p.actual)))))};
  }
  function technical(result,r,context,model,selection){
    cleanReveals();const evidence=$('inspectionEvidence');evidence.replaceChildren();
    const forms=usefulRepresentations(r,model);
    if(forms.original)row(evidence,'Original hostname spelling',r.original.decoded,true);
    if(r.expected&&!r.expectedError)row(evidence,'Expected Hostname',r.expected.ascii===r.ascii?'Matches the actual hostname':r.expected.ascii,true);
    if(context.referenceResult.exact?.length&&selection.primary.kind==='caution')row(evidence,'Saved personal reference',context.referenceResult.exact[0].hostname+' · matches the actual hostname',true);
    const list=$('automaticRecords');list.replaceChildren();$('automaticDetails').classList.toggle('hidden',!model.findings.length);$('automaticCount').textContent=model.findings.length?'('+model.findings.length+')':'';
    const more=el('button','','ghost small');more.type='button';let position=0;
    function next(){const focused=document.activeElement===more;let first;for(const g of model.findings.slice(position,position+5)){const node=comparisonRecord(g,position++);first??=node;list.append(node);}more.remove();if(position<model.findings.length){more.textContent='Show '+count(Math.min(5,model.findings.length-position),'more comparison');list.append(more);if(focused)more.focus({preventScroll:true});}else if(focused)first?.querySelector('h3').focus({preventScroll:true});}
    more.addEventListener('click',next);next();
    $('embeddedGroups').replaceChildren();$('embeddedGroupsDetails').classList.toggle('hidden',!selection.embedded.length);
    for(const g of selection.embedded)embeddedLine(g,$('embeddedGroups'),true);
  }
  function render(result,r,context){
    current=result;currentInspection=r;currentContext=context;const model=view(result),selection=ResultsPresentation.select(r,context.referenceResult,model,result),p=selection.primary;
    $('resultsProgress').classList.add('hidden');$('results').removeAttribute('aria-busy');$('primary').classList.remove('hidden');$('primary').dataset.kind=p.kind;
    $('primaryScope').textContent=p.embedded?'Address found inside the URL':'Original address';$('primaryScope').classList.toggle('screen-reader-only',p.kind==='neutral');
    $('primaryHost').textContent=safe(p.hostname||r.ascii||'');
    $('primaryTitle').textContent=p.title;
    const matchText=item=>safe(item.readableHostname?(item.match||'').replace(item.hostname,item.readableHostname):item.match||'');
    const thoughts=(node,item)=>{node.replaceChildren();for(const [i,text]of (item.thoughts||[item.detail]).entries()){if(i)node.append(document.createTextNode(' '));node.append(el('span',safe(text),'finding-thought'));}};
    $('primaryMatch').textContent=matchText(p);$('primaryMatch').classList.toggle('hidden',!p.match);thoughts($('primaryDetail'),p);
    const sourceGroup=selection.embedded.find(g=>g.hostname===p.hostname),contextNotes=[];
    if(p.readableHostname)contextNotes.push('Browser hostname (Punycode): '+(p.browserHostname||p.hostname));
    if(p.embedded&&sourceGroup?.occurrences.length>1)contextNotes.push('Found '+sourceGroup.occurrences.length+' times in this link.');
    $('primaryContext').textContent=contextNotes.join(' ');
    if(!p.embedded&&p.group?.evidence.some(e=>e.class==='ascii-visual'&&e.mechanism.substitutions.some(x=>/[A-Z]/.test(x.actual))))$('primaryContext').textContent='This resemblance uses the original spelling; the browser normalizes letter case.';
    $('primaryContext').classList.toggle('hidden',!$('primaryContext').textContent);
    // Priority orders findings; it never strips another finding's severity.
    // All security cautions remain visible. Only routine information is bounded.
    $('otherFindings').replaceChildren();let information=0;const others=selection.other.filter(item=>item.kind!=='information'||information++<3),representedHosts=new Set(p.browserHostname?[p.hostname]:[]);
    let previousScope,scopeId;for(const [index,item]of others.entries()){const li=el('li','','secondary-finding');li.dataset.kind=item.kind;
      const match=item.hostname&&item.hostname===p.hostname&&!(item.embedded&&item.family)?(item.match===item.hostname?'':(item.match||'').replace(item.hostname+' ','')):item.match;
      const scope=item.embedded?'Addresses found inside the URL':item.key==='expected-error'?'Expected Hostname':'Original address';
      if(scope!==previousScope){scopeId='finding-scope-'+index;const heading=el('h4',scope,'label');heading.id=scopeId;const label=el('li','','finding-scope-label');label.setAttribute('role','presentation');label.append(heading);$('otherFindings').append(label);previousScope=scope;}
      const kind=el('span',item.kind==='caution'?'Caution':'Information','finding-kind'),title=el('strong',safe(item.title)+(match?' · '+safe(item.readableHostname?match.replace(item.hostname,item.readableHostname):match):''),'finding-title'),detail=el('span','','finding-detail');kind.id='finding-kind-'+index;title.id='finding-title-'+index;detail.id='finding-detail-'+index;
      const host=el('span',safe(item.hostname||r.ascii),'screen-reader-only');host.id='finding-host-'+index;
      li.setAttribute('aria-labelledby',scopeId+' '+kind.id+' '+title.id+(title.textContent.includes(host.textContent)?'':' '+host.id));li.setAttribute('aria-describedby',detail.id);li.append(kind,title,host,detail);thoughts(detail,item);if(item.readableHostname&&!representedHosts.has(item.hostname)){detail.append(el('span','Browser hostname (Punycode): '+safe(item.browserHostname||item.hostname),'finding-thought small'));representedHosts.add(item.hostname);}$('otherFindings').append(li);
    }
    if(selection.other.length>others.length)$('otherFindings').append(el('li','Additional informational comparisons are available in Advanced diagnostics.','small'));
    $('otherFindingsSection').classList.toggle('hidden',!others.length);
    const shownHosts=new Set([p.hostname,...others.map(item=>item.hostname)]),additional=selection.embedded.filter(g=>g.different&&!shownHosts.has(g.hostname)),hosts=additional.slice(0,3);$('embeddedHostSummary').replaceChildren();for(const g of hosts)embeddedLine(g,$('embeddedHostSummary'));if(additional.length>hosts.length)$('embeddedHostSummary').append(el('li','More distinct names are available in Technical Details.','small'));$('embeddedSummarySection').classList.toggle('hidden',!hosts.length);
    $('inspectionCoverage').textContent=selection.coverage.join(' ');$('inspectionCoverage').classList.toggle('hidden',!selection.coverage.length);
    const forms=usefulRepresentations(r,model),hasTechnical=forms.original||r.expected&&!r.expectedError||context.referenceResult.exact?.length&&p.kind==='caution'||model.findings.length||selection.embedded.length;
    $('advanced').classList.toggle('hidden',!hasTechnical);
    $('comparisonDiagnostics').classList.toggle('hidden',!context.referenceResult.checked&&!r.expected&&!r.expectedError&&!result.analyses.some(a=>a.automatic.findings?.length||a.automatic.status!=='complete')&&!result.coverage.limitations.some(l=>l.scope==='reconciliation'));
    // Only one settled announcement. Hostnames/private text stay out of it.
    const announcement=(p.kind==='caution'?'Caution. ':p.kind==='error'?'Inspection could not be completed. ':'Inspection ready. ')+(p.embedded?'Address found inside the URL. ':'Original address. ')+(p.kind==='error'?'':p.title+'. ')+(selection.coverage.length?'Check limitations are available.':'');
    if(announcement!==lastAnnouncement){$('automaticAnnouncement').textContent=announcement;lastAnnouncement=announcement;}
    // Visible primary has the same fixed headline, so use the separate live
    // region for asynchronous completion and avoid announcing a whole report.
    if($('advanced').open)technical(result,r,context,model,selection);
  }
  function start(){
    if(preparation)return preparation;
    preparation=new Promise(resolve=>{const initialize=async()=>{try{const text=id=>$(id)?.textContent;coordinator=await UnifiedComparisons.prepare({foundationManifestText:text('reference-manifest'),pslText:text('public-suffix-data'),popularText:text('popular-domain-data'),indexManifest:JSON.parse(text('lookalike-manifest')||'null'),indexText:text('lookalike-index')});}catch{coordinator=UnifiedComparisons.create({status:'unavailable',reason:'initialization-failure'});}resolve(coordinator);};if(typeof requestIdleCallback==='function')requestIdleCallback(initialize,{timeout:1000});else setTimeout(initialize,0);});return preparation;
  }
  function update(r,context){
    clear({resetAnnouncement:r!==lastInspection});lastInspection=r;const id=generation;$('results').setAttribute('aria-busy','true');$('resultsProgress').classList.remove('hidden');
    timer=setTimeout(async()=>{timer=null;const ready=await start();if(id!==generation||!$('primary'))return;let result;try{result=ready.evaluate(r,context);}catch{result=UnifiedComparisons.create({status:'unavailable',reason:'processing-failure'}).evaluate(r,context);}if(id===generation)render(result,r,context);},0);
  }
  $('advanced').addEventListener('toggle',()=>{if(!$('advanced'))return;if(!$('advanced').open){cleanReveals();for(const id of ['automaticRecords','embeddedGroups','inspectionEvidence','comparisonDiagnosticRecords'])$(id)?.replaceChildren();return;}if(current){const model=view(current),selection=ResultsPresentation.select(currentInspection,currentContext.referenceResult,model,current);technical(current,currentInspection,currentContext,model,selection);}});
  $('comparisonDiagnostics').addEventListener('toggle',()=>{
    const body=$('comparisonDiagnosticRecords');if(!body)return;body.replaceChildren();if(!$('comparisonDiagnostics').open||!current)return;
    for(const a of current.analyses){
      const r=a.automatic,exceptions=Object.entries(r.coverage||{}).filter(([,state])=>['partial','unsupported','unavailable'].includes(state));
      if(!exceptions.length&&!r.findings?.length&&r.status==='complete')continue;
      const section=el('section','','automatic-record');section.append(el('h3',safe(a.hostname)));
      if(r.status!=='complete')row(section,'Automatic comparison',r.status);
      for(const [kind,state]of exceptions)row(section,kind+' comparison',state);
      for(const reason of r.limitations||[])row(section,'Limit',reason);
      for(const f of r.findings||[])row(section,'Built-in reference provenance',f.reference.domain+' · Majestic GlobalRank '+f.reference.globalRank+' · '+f.reference.sourceRowCount+' contributing source rows.');
      body.append(section);
    }
    for(const l of current.coverage.limitations.filter(l=>l.scope==='reconciliation'))row(body,'Scope / limit',l.scope+' / '+l.code);
  });
  // Application-level data access, independent of an inspection. Each legal
  // document is a separate lazy text disclosure; no serialized JSON or escapes.
  function licenseDisclosure(parent,title,text){const d=el('details','','disclosure observation'),body=el('pre','','category-body license');d.append(el('summary',title),body);d.addEventListener('toggle',()=>{body.textContent=d.open?text:'';});parent.append(d);}
  $('referenceDataAbout').addEventListener('toggle',()=>{const body=$('referenceDataAboutBody');if(!body)return;body.replaceChildren();if(!$('referenceDataAbout').open)return;body.append(el('p','Popular-domain references: Majestic Million, original GlobalRank up to 10,000; restricted spelling references up to 1,000. Popularity does not establish safety. Suffix boundaries: Public Suffix List, including private hosting rules.'));
    try{const data=JSON.parse($('reference-licenses').textContent);licenseDisclosure(body,'Majestic attribution & CC BY 3.0 terms',data.majesticNotice);licenseDisclosure(body,'Public Suffix List attribution & source availability',data.pslNotice+'\n'+data.sourceAvailability);licenseDisclosure(body,'Mozilla Public License 2.0 · full text',data.mplLicense);licenseDisclosure(body,'Lookalike reference notice',JSON.parse($('lookalike-notice').textContent));}catch{body.append(el('p','Reference-source notices are unavailable in this file.'));}
  });
  $('referenceDataTechnical').addEventListener('toggle',()=>{const body=$('referenceDataTechnicalBody');if(!body)return;body.replaceChildren();if(!$('referenceDataTechnical').open)return;try{const data=JSON.parse($('lookalike-manifest').textContent);row(body,'Reference source SHA-256',data.sourceSHA256,true);row(body,'Suffix source SHA-256',data.pslSHA256,true);row(body,'Index SHA-256',data.index.sha256,true);row(body,'Unicode data','18.0.0');body.append(el('p','Exact source files, modifications and reproduction instructions are supplied in the repository data notices and REFERENCE_DATA.md.'));}catch{body.append(el('p','Source identities unavailable in this file.'));}});
  $('unicodeDetails').addEventListener('toggle',()=>{if(!$('unicodeDetails'))return;if($('unicodeDetails').open)return;for(const id of ['referenceDataAbout','referenceDataTechnical']){$(id).open=false;$(id+'Body').replaceChildren();}});
  return Object.freeze({start,update,clear,view,coverage:ResultsPresentation.coverage,selection:ResultsPresentation.select});
})();
AutomaticUI.start();
