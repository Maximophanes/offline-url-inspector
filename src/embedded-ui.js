'use strict';
// Presentation only: never change the analyzer's objects or infer navigation.
// Full values and parameter names enter inert text nodes only on explicit reveal.
const EmbeddedUI = (() => {
  const labels={complete:'Checks finished for supported formats.',partial:'Some embedded-address checks are incomplete.',unavailable:'Embedded-address checks unavailable.',unsupported:'Some embedded checks aren’t supported.'};
  const reasons={
    'top-level':['These checks need a readable URL with a reliably identified original hostname.','A successfully parsed URL and reliable original hostname attribution are required.'],
    time:['The time limit was reached; some data or comparisons weren’t checked.','The shared 100 ms supplemental time budget was reached.'],
    depth:['The nesting limit was reached; deeper data wasn’t checked.','The shared transformation or nested-structure depth limit is 3.'],
    'percent-depth':['Further URL decoding wasn’t attempted after two layers.','The two-layer percent-decoding limit was reached.'],
    nodes:['The processing limit was reached; some data wasn’t checked.','The shared 128-node analysis limit was reached.'],
    text:['The processing limit was reached; some derived text wasn’t checked.','The shared 131,072-code-unit derived-text limit was reached.'],
    'value-size':['A value was too long to check and was skipped.','The value exceeded 8,192 UTF-16 code units. It was not truncated into an address.'],
    parameters:['Too many parameters or path segments were present to check them all.','The 128-entry parameter or segment limit for a component was reached.'],
    candidates:['The address-entry limit was reached; further entries weren’t recorded.','The 32-candidate occurrence limit was reached.'],
    hostnames:['The hostname-check limit was reached; some hostnames weren’t fully checked.','The 16-hostname analysis limit was reached.'],
    comparisons:['Some visual or spelling comparisons reached their processing limit.','The 256-pair visual/spelling comparison limit was reached. Exact and structural checks are separate.'],
    decoding:['Some URL-encoded text couldn’t be read reliably.','Strict percent decoding failed on malformed escapes or invalid UTF-8. The value was not repaired.'],
    unicode:['Some character data couldn’t be read reliably.','Unpaired Unicode surrogates were not repaired into a complete URL. Browser-normalized evidence is labeled separately.'],
    'invalid-url':['An apparent web address couldn’t be read as a complete HTTP or HTTPS URL.','The apparent HTTP(S) address could not be parsed as a complete supported URL.'],
    boundaries:['A possible web address has uncertain boundaries.','A URL-like substring is not a confirmed complete address.'],
    attribution:['An embedded address’s original hostname couldn’t be identified with certainty.','Original authority attribution is uncertain. The browser-normalized hostname is shown separately.'],
    'host-analysis':['Some extracted hostnames weren’t fully checked.','Full hostname analysis was not available for every extracted HTTP(S) address.'],
    'hostname-decoding':['A readable hostname couldn’t be validated; some comparisons are limited.','Recovered-hostname decoding or validation failed. Readable-host comparisons are limited.'],
    visual:['Visual resemblance couldn’t be checked for one or more embedded hostnames. This doesn’t rule out a lookalike.','One or more visual comparisons are unavailable; this is not a negative result.'],
    expected:['Your expected hostname couldn’t be validated for the embedded comparisons.','The Expected Hostname comparison is unavailable because validation failed.'],
    reference:['A saved reference couldn’t be validated for comparison.','A supplied reference could not be validated.'],
    references:['Some saved references exceeded the comparison-list limit.','The supplied reference list exceeded 100 entries.'],
    structure:['Structured data wasn’t interpreted.','JSON, script and HTML payload extraction are outside this version’s scope.'],
    scheme:['An address using another scheme wasn’t interpreted.','A non-HTTP(S) scheme was recognized; its behavior and any addresses inside it were not interpreted.'],
    opaque:['Some data has no demonstrated address meaning; its use is unknown.','No specific encoding is inferred. Base64, Base64URL, encrypted and application-specific payloads are not decoded.'],
    processing:['The embedded-address checks couldn’t be completed.','Supplemental processing failed. The initial hostname result remains separate.']
  };
  const types={absolute:'Web address (HTTP or HTTPS)','protocol-relative':'Address without a scheme; scheme unresolved',relative:'Relative address; no base URL assumed','url-like':'Possible web address; boundaries uncertain','unsupported-scheme':'Other address type; not interpreted'};
  const classifications={absolute:'Complete absolute HTTP(S) URL','protocol-relative':'Protocol-relative reference',relative:'Relative reference','url-like':'URL-like substring','unsupported-scheme':'Non-HTTP(S) scheme'};
  const relations={exact:'Exact hostname match',subdomain:'Subdomain of the comparison hostname',parent:'Parent of the comparison hostname','name-inside':'Comparison name inside a different hostname',different:'Different hostname'};
  const sourceNames={'Initial hostname':'the link’s hostname','Expected hostname':'your expected hostname','Saved reference':'a saved reference domain'};
  const el=(tag,text='',className='')=>{const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;};
  const safe=value=>Inspector.visible(String(value));
  const count=(n,singular,plural=singular+'s')=>n+' '+(n===1?singular:plural);
  const join=items=>items.length<3?items.join(' and '):items.slice(0,-1).join(', ')+' and '+items.at(-1);
  const canonical=hostname=>hostname.replace(/\.$/,'').toLowerCase();
  function row(parent,label,text,mono=false){const line=el('div','','row');line.append(el('div',label,'key'),el('div',safe(text),'value'+(mono?' mono':'')));parent.appendChild(line);return line;}
  function locationText(location){return location.replace(/^Nested URL (\d+) · /,'Inside address entry $1 · ').replace('relative-reference parameters','parameters in a relative address').replace('URL suffix','embedded address').replace(/^(path|query|fragment)/,word=>word[0].toUpperCase()+word.slice(1));}
  function limitationLines(result){
    const seen=new Set(),lines=[];
    for(const item of result.limitations){const text=(item.component?item.component[0].toUpperCase()+item.component.slice(1)+': ':'')+reasons[item.code][0];if(!seen.has(text)){seen.add(text);lines.push({kind:item.kind,text});}}
    return lines;
  }
  function summary(result){
    const absolute=result.candidates.filter(c=>c.type==='absolute');
    const offhost=[...new Map(absolute.filter(c=>c.initialRelationship!=='exact'&&c.original?.reliable).map(c=>[c.hostname,c])).values()];
    const visual=[];
    for(const c of absolute)for(const comparison of c.comparisons.filter(x=>x.visual)){
      const key=c.hostname+'|'+comparison.hostname;
      let item=visual.find(x=>x.key===key);
      if(!item){item={key,hostname:c.hostname,target:comparison.hostname,sources:[],reliable:false};visual.push(item);}
      item.reliable ||= !!c.original?.reliable;
      if(!item.sources.includes(comparison.source))item.sources.push(comparison.source);
    }
    const parts=[],highlights=[];
    // Mark only explicitly supplied recovered-hostname tokens, never matching
    // words or comparison targets by searching/replacing an explanation string.
    const hostname=c=>({hostname:safe(c.hostname),reliable:!!c.original?.reliable});
    const paragraph=(...tokens)=>{
      let text='';
      for(const token of tokens){const value=typeof token==='string'?token:token.hostname;if(typeof token!=='string'&&token.reliable)highlights.push({paragraph:parts.length,start:text.length,length:value.length});text+=value;}
      parts.push(text);
    };
    const listed=(items,remaining=0)=>{
      const tokens=items.map(hostname);if(remaining)tokens.push(count(remaining,'more hostname'));
      return tokens.flatMap((token,i)=>i?[i===tokens.length-1?' and ':', ',token]:[token]);
    };
    if(offhost.length){
      const shown=offhost.slice(0,3),initial=shown[0].comparisons.find(c=>c.source==='Initial hostname')?.hostname;
      paragraph('This link also contains '+(offhost.length===1?'a web address':'web addresses')+' for ',...listed(shown,offhost.length-shown.length),offhost.length===1?', a different hostname from '+(initial?safe(initial):'the link’s hostname')+'.':'. These differ from '+(initial?safe(initial):'the link’s hostname')+'.');
    }
    for(const item of visual.slice(0,3))paragraph({hostname:safe(item.hostname),reliable:item.reliable},' may look like '+safe(item.target)+' ('+join(item.sources.map(source=>sourceNames[source]))+').');
    if(visual.length)parts.push('Visual resemblance doesn’t establish malicious intent.');
    if(visual.length>3)parts.push('More resemblance comparisons are available in Technical Details.');
    const warnings=new Set(absolute.flatMap(c=>c.warnings));
    if(warnings.has('userinfo')){
      const mentioned=new Set([...offhost.slice(0,3).map(c=>c.hostname),...visual.slice(0,3).filter(c=>c.reliable).map(c=>c.hostname)]);
      const unshown=[...new Map(absolute.filter(c=>c.hasUserinfo&&c.original?.reliable&&!mentioned.has(c.hostname)).map(c=>[c.hostname,c])).values()];
      const explanation='The text before @ is not the website’s hostname.';
      if(unshown.length){const shown=unshown.slice(0,3);paragraph(explanation+(unshown.length===1?' An address with that structure uses the hostname ':' Additional addresses with that structure use the hostnames '),...listed(shown,unshown.length-shown.length),'.');}
      else parts.push(explanation);
    }
    if(warnings.has('invisible'))parts.push('An embedded address contains hidden or control characters.');
    if(warnings.has('backslash'))parts.push('An embedded address contains backslashes that affect how its structure is read.');
    if(result.candidates.some(c=>c.type==='url-like'))parts.push('A possible web address was found, but its boundaries are uncertain.');
    if(absolute.some(c=>c.conflicting))parts.push('A repeated parameter contains different addresses. Which value the website uses is unknown.');
    const limitations=limitationLines(result);
    const relevant=[...limitations.filter(x=>x.kind!=='unsupported').slice(0,2),...limitations.filter(x=>x.kind==='unsupported').slice(0,2)];
    const coverage=(result.status==='partial'&&parts.length?labels.partial+' ':'')+relevant.map(x=>x.text).join(' ')+(limitations.length>relevant.length?' More limitations are listed in Technical Details.':'');
    const title=visual.length?'Embedded hostname may look similar':warnings.size||absolute.some(c=>c.conflicting)?'Embedded address needs review':offhost.length===1?'Another web address found':offhost.length?'Other web addresses found':result.candidates.some(c=>c.type==='url-like')?'Possible web address found':result.status==='partial'?'Embedded-address checks incomplete':result.status==='unavailable'?'Embedded-address checks unavailable':result.status==='unsupported'?(result.limitations.some(l=>l.kind==='unsupported'&&l.code!=='visual')?'Some embedded data couldn’t be interpreted':'Some embedded comparisons aren’t available'):'';
    const tone=visual.length?'warning':warnings.size||absolute.some(c=>c.conflicting)||result.status==='partial'?'caution':'information';
    return {title,parts,highlights,coverage,redirect:parts.length>0,text:[title,...parts,coverage].filter(Boolean).join(' '),tone};
  }
  function countsText(result){
    const totals=Object.fromEntries(Object.keys(types).map(type=>[type,result.candidates.filter(c=>c.type===type).length]));
    if(result.candidates.length===1&&totals.absolute===1)return '1 embedded web address found.';
    const parts=[];
    if(totals.absolute)parts.push(count(totals.absolute,'embedded web address entry','embedded web address entries'));
    if(totals.relative)parts.push(count(totals.relative,'relative reference'));
    if(totals['protocol-relative'])parts.push(count(totals['protocol-relative'],'address without a scheme','addresses without a scheme'));
    if(totals['url-like'])parts.push(count(totals['url-like'],'possible web address','possible web addresses'));
    if(totals['unsupported-scheme'])parts.push(count(totals['unsupported-scheme'],'other-scheme entry','other-scheme entries'));
    if(!parts.length)return '';
    let text=parts.join('; ')+'.';
    const absolute=result.candidates.filter(c=>c.type==='absolute');
    if(absolute.length>1){const locations=new Set(absolute.map(c=>JSON.stringify([c.component,c.parent,c.location]))).size,hosts=new Set(absolute.map(c=>canonical(c.hostname))).size;text+=' Web address entries represent '+count(locations,'source occurrence')+' and '+count(hosts,'distinct hostname')+'.';}
    return text;
  }
  function relationshipText(comparison){
    const hostname=safe(comparison.hostname);
    let text={exact:'Matches '+hostname+'.',subdomain:'A subdomain of '+hostname+'.',parent:'A parent of '+hostname+'.','name-inside':hostname+' occurs inside this different hostname.',different:'Different from '+hostname+'.'}[comparison.relationship];
    if(comparison.visual)text+=' May look similar; appearance doesn’t establish intent.';
    else if(comparison.kind==='spelling')text+=' Similar spelling; this is separate from visual resemblance.';
    if(comparison.unavailable)text+=' Visual resemblance couldn’t be checked; this doesn’t rule out a lookalike.';
    if(comparison.exactOnly)text+=' Only exact identity is checked for IP addresses and single-label names.';
    return text;
  }
  function ordinaryComparisons(article,candidate){
    const groups=[];
    for(const item of candidate.comparisons.filter(c=>c.source!=='Saved reference')){
      const key=JSON.stringify([canonical(item.hostname),item.relationship,item.kind,item.visual,item.unavailable,item.exactOnly,item.mechanism]);
      const existing=groups.find(g=>g.key===key);
      if(existing)existing.sources.push(item.source);else groups.push({key,item,sources:[item.source]});
    }
    for(const group of groups){const label=group.sources.length===2?'Link and expected hostname':group.sources[0]==='Initial hostname'?'Link hostname':'Expected hostname';row(article,label,relationshipText(group.item));}
    if(!groups.some(g=>g.sources.includes('Initial hostname')))row(article,'Compared with link hostname',relations[candidate.initialRelationship]+'. The comparison target details are unavailable.');
    const saved=candidate.comparisons.filter(c=>c.source==='Saved reference');
    for(const item of saved.filter(c=>!c.unavailable).slice(0,3))row(article,'Saved reference domain',relationshipText(item));
    const missing=saved.filter(c=>c.unavailable).length;
    if(missing)article.appendChild(el('p',count(missing,'saved-reference visual comparison')+(missing===1?' is':' are')+' unavailable. This doesn’t rule out a lookalike.','small warn'));
    if(saved.filter(c=>!c.unavailable).length>3)article.appendChild(el('p','More saved-reference comparisons are available in expanded evidence.','small'));
  }
  function comparisonRow(parent,comparison){
    let detail=relations[comparison.relationship];
    if(comparison.visual)detail+=' · Potential visual resemblance ('+comparison.mechanism+'). Appearance does not establish intent.';
    else if(comparison.kind==='spelling')detail+=' · Ordinary spelling similarity.';
    if(comparison.unavailable)detail+=' · Visual comparison unavailable; this is not a negative result.';
    if(comparison.exactOnly)detail+=' · IP and single-label comparisons are exact-only.';
    return row(parent,comparison.source,comparison.hostname+' · '+detail);
  }
  function comparisons(parent,candidate){
    for(const item of candidate.comparisons.filter(c=>c.source!=='Saved reference'))comparisonRow(parent,item);
    const saved=candidate.comparisons.filter(c=>c.source==='Saved reference');
    for(const item of saved.slice(0,3))comparisonRow(parent,item);
    const rest=saved.slice(3);if(!rest.length)return;
    const detail=el('details','','disclosure observation embedded-comparisons'),body=el('div','','category-body');detail.append(el('summary','More saved-reference comparisons'),body);
    detail.addEventListener('toggle',()=>{
      body.replaceChildren();if(!detail.open)return;
      let position=0;const more=el('button','','ghost small');more.type='button';
      const next=()=>{
        const focused=document.activeElement===more;let first;
        for(const item of rest.slice(position,position+10)){const line=comparisonRow(body,item);line.classList.add('embedded-comparison');line.tabIndex=-1;first??=line;}
        position=Math.min(position+10,rest.length);more.remove();
        if(position<rest.length){more.textContent='Show '+count(Math.min(10,rest.length-position),'more comparison');more.setAttribute('aria-label',more.textContent+' for '+safe(candidate.hostname));body.appendChild(more);if(focused)more.focus({preventScroll:true});}
        else if(focused)first?.focus({preventScroll:true});
      };
      more.addEventListener('click',next);next();
    });parent.appendChild(detail);
  }
  function evidence(candidate,parent){
    row(parent,'Address entry',candidate.id);row(parent,'Classification',classifications[candidate.type]);
    row(parent,'Evidence',candidate.evidence==='fact'?'Extracted from the supplied URL text.':'Possible address; boundaries uncertain.');
    row(parent,'Source location',candidate.location);
    if(candidate.parent)row(parent,'Found inside','Address entry '+candidate.parent+'. This is a data relationship, not a verified redirect sequence.');
    if(candidate.parameter){row(parent,'Parameter name',candidate.parameter.original,true);if(candidate.parameter.decoded!==candidate.parameter.original)row(parent,'Decoded parameter name',candidate.parameter.decoded,true);row(parent,'Parameter occurrence',candidate.occurrence);row(parent,'Equals separator',candidate.hasEquals?'Present':'Absent');}
    if(candidate.sourceValue===candidate.value)row(parent,'Source and recovered value',candidate.value,true);
    else{row(parent,'Source value',candidate.sourceValue,true);row(parent,'Recovered value',candidate.value,true);}
    if(candidate.normalized&&candidate.normalized!==candidate.value)row(parent,'Browser-normalized URL',candidate.normalized,true);
    for(const p of candidate.provenance){
      row(parent,'Source representation',p.representation==='submitted'?'From the pasted link':'From the browser-normalized link');
      row(parent,'Decoding steps',p.steps.length?p.steps.map(s=>(s.kind==='form-percent'?'Form-style percent decoding (+ treated as space)':'Strict percent decoding')+', layer '+s.layer).join(' → '):'No additional URL decoding');
    }
    if(candidate.inferredContainer)row(parent,'Application data','Interpreted as nested parameters; application behavior is unknown.');
    if(candidate.hint)row(parent,'Navigation clue','The name or path matches a navigation-related pattern; its actual use is unknown.');
    if(candidate.scheme)row(parent,'Scheme',candidate.scheme);
    if(candidate.effectivePort)row(parent,'Effective port',candidate.effectivePort);
    if(candidate.hostname){
      if(candidate.original&&!candidate.original.reliable)row(parent,'Original hostname','Could not be identified with certainty; the displayed hostname is browser-normalized.');
      comparisons(parent,candidate);
      const warnings=candidate.analysis?.diagnostics.filter(m=>['punycode','dns','bidi-limit','normalization','normalized-ascii','non-ascii','mixed','character-confusables'].includes(m.code))||[];
      for(const warning of warnings)parent.appendChild(el('p',safe(warning.text),'small'+(warning.level==='alert'||warning.level==='warn'?' warn':'')));
    }
  }
  function record(candidate){
    const article=el('article','','embedded-record');article.dataset.candidate=String(candidate.id);
    const heading=el('h3',candidate.hostname?safe(candidate.hostname):candidate.type==='unsupported-scheme'?'Recognized scheme: '+safe(candidate.scheme):types[candidate.type],'embedded-host');heading.id='embedded-entry-'+candidate.id;heading.tabIndex=-1;article.setAttribute('aria-labelledby',heading.id);article.appendChild(heading);
    row(article,'Found in',locationText(candidate.location));
    if(candidate.parent)row(article,'Found inside','Address entry '+candidate.parent+'; this does not establish a redirect sequence.');
    if(candidate.conflicting)article.appendChild(el('p','This parameter contains different addresses in separate occurrences. Which value the website uses is unknown.','small warn'));
    if(candidate.hostname){
      if(candidate.schemePortDiffers)row(article,'Scheme or port','Differs from the link’s URL. Hostname equality is a separate check.');
      if(candidate.analysis?.unicode&&candidate.analysis.unicode!==candidate.hostname)row(article,'Readable hostname',candidate.analysis.unicode,true);
      if(candidate.original&&!candidate.original.reliable)article.appendChild(el('p','The original hostname couldn’t be identified with certainty. The displayed hostname is browser-normalized.','small warn'));
      if(candidate.hasUserinfo)article.appendChild(el('p','Caution: The text before @ is not the website’s hostname.','small warn'));
      if(candidate.warnings.includes('invisible'))article.appendChild(el('p','Caution: Hidden or control characters occur in this recovered address. Reveal the evidence to see their code points.','small warn'));
      if(candidate.warnings.includes('backslash'))article.appendChild(el('p','Caution: Backslashes are present; browser normalization affects URL structure.','small warn'));
      ordinaryComparisons(article,candidate);
      if(!candidate.analysis)article.appendChild(el('p','Caution: Full hostname analysis wasn’t completed for this address.','small warn'));
      else if(candidate.analysis.decodeError)article.appendChild(el('p','The readable hostname couldn’t be validated; some comparisons are limited.','small warn'));
      if(candidate.analysis?.diagnostics.some(m=>m.code==='dns'))article.appendChild(el('p','Caution: This hostname doesn’t follow standard DNS naming rules. Review its validation evidence.','small warn'));
    }
    const reveal=el('details','','disclosure observation embedded-reveal'),body=el('div','','category-body');reveal.append(el('summary','Reveal full values and evidence · may contain private data'),body);
    reveal.querySelector('summary').setAttribute('aria-label','Reveal full values and evidence for address entry '+candidate.id+' · may contain private data');
    reveal.addEventListener('toggle',()=>{body.replaceChildren();if(reveal.open)evidence(candidate,body);});article.appendChild(reveal);
    return article;
  }
  function render(result){
    const section=document.getElementById('embeddedDetails'),status=document.getElementById('embeddedStatus'),list=document.getElementById('embeddedCandidates'),limitations=document.getElementById('embeddedLimitations'),details=document.getElementById('embeddedLimitDetails'),notice=document.getElementById('embeddedNotice');
    section.open=false;document.getElementById('embeddedCoverageDetails').open=false;list.replaceChildren();limitations.replaceChildren();details.replaceChildren();
    status.textContent=labels[result.status];status.dataset.state=result.status;
    if(result.status==='unsupported')status.textContent=result.limitations.some(l=>l.kind==='unsupported'&&l.code!=='visual')?'Some embedded data couldn’t be interpreted.':'Some embedded comparisons aren’t available.';
    const finding=summary(result),title=document.getElementById('embeddedTitle'),body=document.getElementById('embeddedSummary'),coverage=document.getElementById('embeddedCoverage');
    // Avoid rewriting the live summary when the same inspection is rendered again.
    if(title.textContent!==finding.title)title.textContent=finding.title;
    const highlightKey=JSON.stringify(finding.highlights);
    if(body.textContent!==finding.parts.join('')||body.dataset.highlightKey!==highlightKey){
      body.replaceChildren(...finding.parts.map((text,index)=>{
        const p=el('p');let position=0;
        for(const mark of finding.highlights.filter(m=>m.paragraph===index)){
          p.append(document.createTextNode(text.slice(position,mark.start)),el('span',text.slice(mark.start,mark.start+mark.length),'embedded-recovered-host'));position=mark.start+mark.length;
        }
        p.appendChild(document.createTextNode(text.slice(position)));return p;
      }));
      body.dataset.highlightKey=highlightKey;
    }
    if(coverage.textContent!==finding.coverage)coverage.textContent=finding.coverage;
    coverage.classList.toggle('hidden',!finding.coverage);coverage.dataset.state=result.status;
    document.getElementById('embeddedRedirect').classList.toggle('hidden',!finding.redirect);
    notice.dataset.tone=finding.tone;notice.classList.toggle('hidden',!finding.title);
    if(!result.candidates.length)list.appendChild(el('p',result.status==='unavailable'?'Embedded-address checks couldn’t be completed.':result.status==='partial'?'No embedded web addresses found in the data checked.':'No embedded web addresses found in the supported formats.','small'));
    const heading=countsText(result),counter=document.getElementById('embeddedCount'),more=el('button','','ghost small');more.type='button';let position=0;
    const next=()=>{
      const focused=document.activeElement===more;let first;
      for(const candidate of result.candidates.slice(position,position+5)){const article=record(candidate);first??=article;list.appendChild(article);}
      position=Math.min(position+5,result.candidates.length);more.remove();
      counter.textContent=heading+(position<result.candidates.length?' Showing '+position+' of '+result.candidates.length+' entries.':'');
      if(position<result.candidates.length){more.textContent='Show '+count(Math.min(5,result.candidates.length-position),'more entry','more entries');list.appendChild(more);if(focused)more.focus({preventScroll:true});}
      else if(focused)first?.querySelector('h3')?.focus({preventScroll:true});
    };
    more.addEventListener('click',next);next();
    for(const item of limitationLines(result))limitations.appendChild(el('li',item.text));
    for(const item of result.limitations)details.appendChild(el('li',(item.component?item.component+' · ':'')+item.code+': '+reasons[item.code][1]));
    if(result.components.some(c=>c.normalizedDiffers))details.appendChild(el('li','The pasted and browser-normalized components differ. Each source representation is labeled in expanded evidence. The original input remains in Input & Normalization.'));
  }
  function update(top,references){
    let result;try{result=EmbeddedURLs.analyze(top,{references});}catch{result=EmbeddedURLs.unavailable();result.limitations=[{kind:'unavailable',code:'processing'}];}
    render(result);return result;
  }
  document.getElementById('embeddedView').addEventListener('click',()=>{
    document.getElementById('advanced').open=true;const section=document.getElementById('embeddedDetails');section.open=true;section.querySelector('summary').focus();
  });
  for(const id of ['advanced','embeddedDetails'])document.getElementById(id).addEventListener('toggle',event=>{
    if(event.target!==event.currentTarget||event.currentTarget.open)return;
    for(const reveal of document.querySelectorAll('.embedded-reveal')){reveal.open=false;reveal.querySelector('.category-body').replaceChildren();}
  });
  return Object.freeze({update,render,summary});
})();
