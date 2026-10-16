'use strict';
const Presentation = (() => {
  function summarize(r,refs,manualProvided){
    const has=code=>r.messages.some(m=>m.code===code);
    const base={kind:'neutral',title:'No unusual hostname characters identified',detail:'Destination unverified. Character checks do not establish website safety.',target:null,relevant:[],manual:manualProvided};
    if(!r.ok)return {...base,kind:'error',title:'Unable to analyze this address reliably',detail:r.messages[0]?.text||'Review the original input.'};
    const manualTarget=r.expected?.ascii;
    const referenceVisual=!manualProvided&&!refs.exact.length?refs.visual[0]:null;
    const visual=manualProvided?r.comparison?.visual:!!referenceVisual;
    const target=(manualTarget||(!manualProvided?(refs.exact[0]||referenceVisual||refs.embedded[0]||refs.subdomains[0]||refs.spelling[0])?.hostname:null))??null;
    const comparison=manualProvided?r.comparison:referenceVisual?.comparison;
    base.target=target;
    if(visual){base.kind='visual';base.title='Potential hostname impersonation';base.detail='The hostname differs from '+target+' and may look similar. This is a visual comparison, not proof of intent.';base.relevant=comparison.asciiSubstitutions||[];}
    else if(has('userinfo')||has('deceptive-subdomain')||(!manualProvided&&refs.embedded.length)||has('attribution')||has('backslash')){
      base.kind='structure';base.title='Potentially misleading URL structure';base.detail=has('userinfo')?'Text before @ is a username segment. The actual hostname is shown below.':!manualProvided&&refs.embedded.length?'A reference hostname appears inside a longer hostname; it is not a subdomain of that reference.':'Review the hostname boundaries and browser-normalized address.';
    }else if(r.decodeError||has('dns')){base.kind='error';base.title='Hostname needs manual review';base.detail='Browser acceptance and readable-domain validity are separate. See validation details.';}
    else if(manualProvided&&r.expectedError){base.kind='error';base.title='Expected hostname could not be checked';base.detail=r.expectedError;}
    else if(manualProvided&&r.comparison&&!r.comparison.exact){base.kind='mismatch';base.title='Hostname mismatch';base.detail='The actual hostname does not exactly match '+target+'.'+(r.comparison.kind==='spelling'?' It has ordinary spelling similarity.':'');}
    else if(manualProvided&&r.comparison?.exact){base.kind='exact';base.title='Exact hostname match';base.detail='The normalized hostname matches your expected hostname. This does not certify the page, path, or subsequent redirects.';}
    else if(!manualProvided&&refs.exact.length){base.kind='exact';base.title='Exact reference hostname match';base.detail='The hostname exactly matches a user-supplied reference. References are comparison targets, not a trust database.';}
    else if(!manualProvided&&refs.subdomains.length){base.kind='subdomain';base.title='Subdomain of a reference hostname';base.detail='This is structurally beneath '+target+', but is not an exact hostname match and is not automatically trustworthy.';}
    else if(r.characters.length){base.kind='international';base.title='Internationalized hostname — review its spelling';base.detail='Non-ASCII characters remain in the hostname. Internationalized names can be legitimate; no impersonated target is inferred.';}
    else if(r.originalCharacters.length){base.kind='normalization';base.title='Original hostname spelling changed during normalization';base.detail='Review the original characters and the resulting actual hostname. Compatibility mappings alone do not establish impersonation.';}
    else if(!manualProvided&&refs.spelling.length){base.kind='similarity';base.title='Spelling similarity to a reference hostname';base.detail='The hostname differs from '+target+'. Ordinary spelling similarity is separate from visual impersonation.';}
    return base;
  }
  function supporting(r,summary,refs){
    const lines=[];const seen=new Set();
    const concise={invisible:'The input contains hidden or formatting characters; inspect their code points in technical details.',userinfo:'Username syntax before @ can disguise the actual hostname.',http:'This URL uses unencrypted HTTP.',port:'A non-default port is specified: '+r.port+'.',punycode:'Readable hostname validation failed; retain the ASCII hostname and review technical details.',dns:'DNS label syntax or length needs review; browser acceptance is not DNS validity.',attribution:'Original hostname attribution is limited; inspect the original text and parsed destination.',preprocessing:'The browser removed whitespace/control characters during preprocessing.',backslash:'Backslashes affect HTTP(S) URL boundaries.', 'deceptive-subdomain':'The expected hostname appears inside a longer, different hostname.'};
    for(const m of r.messages)if(concise[m.code]&&!seen.has(m.code)){
      seen.add(m.code);if(summary.kind==='structure'&&m.code==='userinfo')continue;
      lines.push(concise[m.code]);
    }
    if(r.characters.length&&summary.kind!=='international')lines.push('Non-ASCII characters are highlighted; character details retain original spellings and comparison mappings.');
    else if(r.normalized&&r.originalCharacters.length&&summary.kind!=='normalization')lines.push('Browser normalization changed the original written spelling; the original code points remain in technical details.');
    if(r.messages.some(m=>m.code==='bidi-limit'))lines.push('Right-to-left visual comparison is unavailable; exact hostname comparison remains available.');
    if(summary.manual&&refs.exact.length)lines.push('An exact Reference Domains entry also exists. Your explicit expected hostname remains the primary comparison.');
    if(summary.manual&&refs.embedded.length)lines.push('Reference hostname text appears inside this longer hostname; it is not a subdomain of '+refs.embedded.slice(0,3).map(e=>e.hostname).join(', ')+'. The manual comparison remains separate.');
    return lines;
  }
  // Presentation-only helpers. The analysis result and classifications stay intact.
  function explain(r,summary){
    if(summary.kind!=='visual'||!summary.target||r.decodeError)return summary.detail;
    if(summary.relevant.length){const substitutions=summary.relevant.map(p=>'“'+p.actual+'” may resemble “'+p.expected+'”').join('; ');return Inspector.visible(r.unicode)+' visually resembles '+(summary.manual?'the expected hostname ':'your saved reference ')+summary.target+'. The characters '+substitutions+' in some fonts. This is an observation, not proof of intent.';}
    let expected;try{expected=Inspector.expectedHost(summary.target);}catch{return summary.detail;}
    const actual=[...r.unicode],wanted=[...expected.unicode];
    if(actual.length!==wanted.length)return summary.detail;
    const differences=actual.map((ch,index)=>ch===wanted[index]?null:index).filter(index=>index!==null);
    if(differences.length!==1)return summary.detail;
    const index=differences[0],a=Inspector.info(actual[index]),b=Inspector.info(wanted[index]);
    if(!a.nonASCII&&!b.nonASCII)return summary.detail;
    const position=['first','second','third','fourth','fifth'][index];
    const where=position?'its '+position+' character':'the character at position '+(index+1);
    return 'The inspected hostname resembles '+summary.target+', but '+where+' is '+a.script+' '+Inspector.visible(a.ch)+' ('+a.code+'), not '+b.script+' '+Inspector.visible(b.ch)+' ('+b.code+'). Visual resemblance alone does not establish intent.';
  }
  function characterEvidence(r){
    const shared=new Set();
    if(r.original?.reliable&&!r.decodeError){const readable=new Set(r.characters.map(c=>JSON.stringify(c)));for(const c of r.originalCharacters)if(readable.has(JSON.stringify(c)))shared.add(c.ch);}
    return {original:r.originalCharacters.map(c=>({...c,evidenceSource:shared.has(c.ch)?'Original & readable':r.original?.reliable?'Original':'Original candidate'})),readable:r.characters.filter(c=>!shared.has(c.ch)).map(c=>({...c,evidenceSource:'Readable hostname'}))};
  }
  function diagnostic(m){
    const titles={empty:'No URL supplied','too-long':'Input length limit',scheme:'Unsupported URL scheme',parse:'URL parsing failed',invisible:'Hidden or formatting characters',percent:'Percent encoding',preprocessing:'Browser preprocessing',punycode:'Punycode / IDNA validation',attribution:'Original hostname attribution','normalized-ascii':'Unicode mapped to ASCII','non-ascii':'Internationalized hostname',normalization:'Hostname normalization',userinfo:'Username syntax before @',http:'Unencrypted HTTP',port:'Non-default port','explicit-port':'Explicit port syntax',backslash:'Backslash URL boundaries',dns:'DNS syntax or length',mixed:'Mixed writing systems',scripts:'Writing systems across labels','character-confusables':'Unicode confusable mappings','ascii-ambiguity':'ASCII visual ambiguity','bidi-limit':'Right-to-left comparison limit','expected-error':'Expected hostname validation',exact:'Exact hostname match',mismatch:'Hostname mismatch',impersonation:'Potential visual impersonation',spelling:'Ordinary spelling similarity','comparison-limit':'Visual comparison unavailable',subdomain:'Structural subdomain','deceptive-subdomain':'Embedded expected hostname','no-anomalies':'No unusual hostname characters',unverified:'Destination unverified'};
    const processing=['too-long','scheme','parse','punycode','attribution','bidi-limit','expected-error','comparison-limit'];
    const comparison=['exact','mismatch','impersonation','spelling','subdomain','deceptive-subdomain'];
    return {title:titles[m.code]||m.code,category:m.code==='unverified'?'Verification limit':processing.includes(m.code)?'Processing limit':comparison.includes(m.code)?'Comparison':'Observation',severity:m.level==='alert'?'Warning':m.level==='warn'?'Caution':'Information'};
  }
  function storageStatus(state,edition,writeFailed=false){
    const backup=edition==='standalone'?' Local-file references may be temporary; export a backup.':' Browser data can be cleared; export a backup.';
    if(state.blocked)return 'Saved data needs review. Changes stay in this tab; see Storage & hostname help before replacing it.';
    if(writeFailed)return 'Saving failed. Changes stay in this tab; the saved copy was not replaced. Export a backup.';
    if(state.mode!=='browser')return 'Storage unavailable. References stay in this tab; export a backup.';
    if(state.revision>0||state.status.startsWith('Reference schema migrated'))return 'References saved in this browser.'+backup;
    return (state.status.startsWith('Saved')?'Saved references loaded. New saves are not yet verified in this session.':'Storage is readable; saving is not yet verified.')+backup;
  }
  return Object.freeze({summarize,supporting,explain,characterEvidence,diagnostic,storageStatus});
})();
