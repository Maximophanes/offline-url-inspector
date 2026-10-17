'use strict';
// Copy and display decisions only. Analysis objects, classifications and storage stay intact.
const Presentation = (() => {
  const count=(n,singular,plural=singular+'s')=>n+' '+(n===1?singular:plural);
  const visible=value=>Inspector.visible(String(value??''));
  const asciiIntroduction='Some characters in this hostname have similar-looking alternatives in certain fonts. These observations alone do not establish impersonation.';
  function validation(message,context='hostname'){
    const text=String(message||'');
    const entry=/^Entry (\d+): ([\s\S]*)$/.exec(text);
    if(entry)return 'Reference '+entry[1]+': '+validation(entry[2],'hostname');
    if(/already (?:in Reference Domains|exists)/.test(text))return 'This hostname is already saved.';
    if(/Reference JSON exceeds/.test(text))return 'This backup is too large. The maximum size is 128 KiB.';
    if(/not valid JSON/.test(text))return "This file isn't valid JSON. Choose a backup exported by URL Inspector.";
    if(/not an Offline URL Inspector reference backup/.test(text))return "This isn't a URL Inspector reference backup. Choose a backup exported by this app.";
    if(/Unsupported reference schema/.test(text))return 'This backup uses an unsupported format version. Your saved references have not been changed.';
    if(/Unexpected fields in reference data/.test(text))return "This file doesn't match the expected backup format. Your references have not been changed.";
    if(/Reference lists must contain/.test(text))return 'The backup must contain a list of no more than '+ReferenceDomains.MAX_ENTRIES+' hostnames.';
    if(/combined list would exceed/.test(text))return 'This import would exceed the '+ReferenceDomains.MAX_ENTRIES+'-reference limit. Use a smaller backup or remove some references first.';
    if(/reference list is limited/.test(text))return 'You can save up to '+ReferenceDomains.MAX_ENTRIES+' references. Remove one before adding another.';
    if(/list changed; review the import/.test(text))return 'Your reference list changed during the import. Please review the updated preview before continuing.';
    if(/reference no longer exists/.test(text))return 'This reference is no longer in the list. Choose another entry.';
    if(/Clearing all references requires/.test(text))return 'Confirm Clear References before removing the list.';
    if(/Replacing references requires/.test(text))return 'Confirm Replace References before applying this backup.';
    if(/Choose Merge or Replace/.test(text))return 'Choose Merge or Replace, then review the preview.';
    if(/Each reference must be|Expected hostname is too long/.test(text))return 'Enter a hostname using no more than 2,048 characters.';
    if(/A hostname is required/.test(text))return 'Enter a hostname, such as example.com.';
    if(/Enter only a hostname/.test(text))return 'Enter a hostname without sign-in details, a port, path, query or fragment. A final slash is allowed.';
    if(/Expected hostname has invalid DNS/.test(text))return 'This hostname has an invalid section or is too long. Check its spelling and dots.';
    if(/Leading Unicode whitespace/.test(text))return 'Remove the hidden or spacing characters at the start, then try again. Your original text has been preserved.';
    if(/Unsupported scheme/.test(text))return context==='url'?'Only HTTP and HTTPS links can be inspected. Check the beginning of the URL.':'Enter a hostname or an HTTP/HTTPS address, such as example.com.';
    if(/HTTP\/HTTPS input must include/.test(text))return 'Include :// after http or https, then try again.';
    if(/Punycode|IDNA/i.test(text))return 'This encoded hostname could not be validated. Check the xn-- spelling or use its original Unicode spelling.';
    return context==='import'?"This backup couldn't be imported. Review the file and try again.":'This hostname could not be read. Check its spelling, spaces and brackets.';
  }
  function inputFailure(r){
    const m=r.messages.find(m=>['empty','too-long','scheme','parse'].includes(m.code));
    if(!m)return {title:'Inspection could not be completed',detail:'No result is available. Check the input and try again.'};
    return {title:m.code==='empty'?'Enter a URL to inspect':m.code==='too-long'?'URL exceeds the inspection limit':m.code==='scheme'?'URL format needs review':'Unable to read this URL',detail:diagnosticText(m,r)};
  }
  function summarize(r,refs,manualProvided){
    const has=code=>r.messages.some(m=>m.code===code);
    const base={kind:'neutral',title:'No unusual hostname characters identified',detail:'No internationalized or hidden characters were found in the hostname. Check its spelling and context before opening the link.',target:null,relevant:[],manual:manualProvided,reason:null};
    if(!r.ok)return {...base,kind:'error',...inputFailure(r)};
    const referenceVisual=!manualProvided&&!refs.exact.length?refs.visual[0]:null;
    const visual=manualProvided?r.comparison?.visual:!!referenceVisual;
    const target=(r.expected?.ascii||(!manualProvided?(refs.exact[0]||referenceVisual||refs.embedded[0]||refs.subdomains[0]||refs.spelling[0])?.hostname:null))??null;
    const comparison=manualProvided?r.comparison:referenceVisual?.comparison;base.target=target;
    if(visual){base.kind='visual';base.title='Potential hostname impersonation';base.detail='The hostname differs from '+target+' and may look similar. Visual resemblance does not establish malicious intent.';base.relevant=comparison.asciiSubstitutions||[];}
    else if(has('userinfo')||has('deceptive-subdomain')||(!manualProvided&&refs.embedded.length)||has('attribution')||has('backslash')){
      base.kind='structure';base.title='Potentially misleading URL structure';
      base.reason=has('userinfo')?'userinfo':has('deceptive-subdomain')?'deceptive-subdomain':!manualProvided&&refs.embedded.length?'embedded':has('attribution')?'attribution':'backslash';
      base.detail=base.reason==='userinfo'?'Text before @ is sign-in information, not the hostname. Check the actual hostname below.':['deceptive-subdomain','embedded'].includes(base.reason)?'A comparison hostname appears inside a longer hostname. That does not make this a subdomain of the comparison hostname.':base.reason==='attribution'?'The original hostname could not be identified with certainty. Review the actual hostname and original URL.':'Backslashes can change where the hostname ends. Review the actual hostname and original URL.';
    }else if(r.decodeError||has('dns')){base.kind='error';base.title='Hostname needs manual review';base.reason=r.decodeError?'punycode':'dns';base.detail='Your browser can parse this URL, but its hostname still needs review. See the validation findings in Technical Details.';}
    else if(manualProvided&&r.expectedError){base.kind='error';base.title='Expected hostname could not be checked';base.detail=validation(r.expectedError);}
    else if(manualProvided&&r.comparison&&!r.comparison.exact){
      base.kind=r.comparison.unavailable?'unavailable':'mismatch';base.title=r.comparison.unavailable?'Visual comparison unavailable':'Hostname mismatch';
      base.detail=r.comparison.unavailable?'The hostname differs from '+target+", but visual resemblance couldn't be checked.":has('subdomain')?'This hostname is a subdomain of '+target+', not an exact match.':'The actual hostname differs from '+target+'.'+(r.comparison.kind==='spelling'?' The two have similar spelling.':'');
    }else if(manualProvided&&r.comparison?.exact){base.kind='exact';base.title='Exact hostname match';base.detail='The hostname matches your expected hostname. This match does not compare the scheme, port, path or query.';}
    else if(!manualProvided&&refs.exact.length){base.kind='exact';base.title='Exact reference hostname match';base.detail='The hostname matches a saved reference. This match does not compare the rest of the URL or verify the website.';}
    else if(!manualProvided&&refs.subdomains.length){base.kind='subdomain';base.title='Subdomain of a reference hostname';base.detail='This hostname is a subdomain of '+target+', not an exact match.';}
    else if(!manualProvided&&refs.unavailable&&!refs.totalMatches){base.kind='unavailable';base.title='Visual comparison unavailable';base.detail='No exact reference match was found, but some visual comparisons could not be completed. See Reference Comparisons.';}
    else if(r.characters.length){base.kind='international';base.title='Internationalized hostname';base.detail='This hostname contains Unicode characters. Internationalized names can be legitimate; review the spelling in context.';}
    else if(r.originalCharacters.length){base.kind='normalization';base.title='Hostname spelling changed during processing';base.detail='The original and readable spellings differ. Review both forms in Technical Details; a spelling transformation alone does not establish impersonation.';}
    else if(!manualProvided&&refs.spelling.length){base.kind='similarity';base.title='Spelling similarity to a reference hostname';base.detail='The hostname differs from '+target+' but has similar spelling. This is separate from a visual lookalike comparison.';}
    return base;
  }
  function supporting(r,summary,refs){
    const lines=[],seen=new Set();
    const concise={invisible:'Hidden or formatting characters occur in the submitted text. Technical Details identifies their code points.',userinfo:'Text before @ can distract from the actual hostname.',http:'This URL uses unencrypted HTTP.',port:'The URL specifies port '+r.port+'. Check that this is expected.',punycode:'The readable hostname could not be validated. The ASCII form remains available.',dns:'The hostname does not follow standard DNS naming rules. Review the validation findings.',attribution:'The original hostname could not be identified with certainty.',preprocessing:'Your browser removed spaces or control characters while reading the URL. The original text is preserved.',backslash:'The browser treats backslashes as forward slashes, which can change hostname boundaries.','deceptive-subdomain':'The expected hostname appears inside a longer, different hostname.'};
    for(const m of r.messages)if(concise[m.code]&&!seen.has(m.code)){
      seen.add(m.code);if(m.code===summary.reason)continue;
      lines.push(concise[m.code]);
    }
    if(r.normalized&&r.originalCharacters.length&&!['normalization','international'].includes(summary.kind))lines.push('The original spelling changed during hostname processing. Its code points remain in Character Details.');
    if(r.messages.some(m=>m.code==='bidi-limit')&&summary.kind!=='unavailable')lines.push('Right-to-left visual comparison is unavailable. Exact hostname comparison remains available.');
    if(summary.manual&&refs.embedded.length)lines.push('Saved reference text occurs inside this longer hostname. It is not a subdomain of '+refs.embedded.slice(0,3).map(e=>e.hostname).join(', ')+'.');
    return lines;
  }
  function explain(r,summary){
    if(summary.kind!=='visual'||!summary.target||r.decodeError)return summary.detail;
    if(summary.relevant.length)return visible(r.original?.reliable?r.original.decoded:r.unicode)+' may look like '+(summary.manual?'your expected hostname ':'your saved reference ')+summary.target+'. '+summary.relevant.map(p=>'“'+p.actual+'” may resemble “'+p.expected+'” in some fonts.').join(' ')+' Visual resemblance does not establish malicious intent.';
    let target;try{target=Inspector.expectedHost(summary.target);}catch{return summary.detail;}
    const difference=unicodeDifference(r,target);if(!difference)return summary.detail;
    const {actual:a,expected:b,position}=difference,ordinal=['first','second','third','fourth','fifth'][position-1],where=ordinal?'its '+ordinal+' character':'the character at position '+position;
    return 'The inspected hostname resembles '+summary.target+', but '+where+' is '+a.script+' '+visible(a.ch)+' ('+a.code+'), not '+b.script+' '+visible(b.ch)+' ('+b.code+'). Visual resemblance does not establish malicious intent.';
  }
  function characterEvidence(r){
    const shared=new Set();
    if(r.original?.reliable&&!r.decodeError){const readable=new Set(r.characters.map(c=>JSON.stringify(c)));for(const c of r.originalCharacters)if(readable.has(JSON.stringify(c)))shared.add(c.ch);}
    return {original:r.originalCharacters.map(c=>({...c,evidenceSource:shared.has(c.ch)?'Original & readable':r.original?.reliable?'Original':'Original text (unverified)'})),readable:r.characters.filter(c=>!shared.has(c.ch)).map(c=>({...c,evidenceSource:'Readable hostname'}))};
  }
  function characterNormalization(c,original,r){
    let text='Character preserved unchanged.';
    if(/[\t\r\n]/.test(c.ch))text='Removed while the browser read the URL.';
    else if(c.idnaStatus==='mapped')text='Changed by the hostname character-mapping rules.';
    else if(c.idnaStatus==='ignored')text='Removed during hostname processing.';
    else if(c.idnaStatus==='disallowed')text="This character is not allowed by the bundled IDNA rules. The actual hostname shows your browser's result.";
    else if(c.idnaStatus==='deviation')text="Normally preserved by current hostname rules. Older compatibility rules may replace it.";
    if(original&&!r.decodeError&&r.original?.reliable&&r.unicode&&!r.unicode.includes(c.ch)&&!['mapped','ignored','disallowed'].includes(c.idnaStatus)&&!/[\t\r\n]/.test(c.ch))text='Changed during hostname normalization.';
    if(original&&(!r.original?.reliable||r.decodeError))text='The normalization result is unverified. '+text.replace('Character preserved unchanged.','The character rule would normally preserve it.');
    return text;
  }
  function unicodeDifference(r,target){
    if(!target||r.decodeError||!r.unicode)return null;
    const actual=[...r.unicode],expected=[...target.unicode];if(actual.length!==expected.length)return null;
    const differences=actual.flatMap((ch,i)=>ch===expected[i]?[]:[i]);if(differences.length!==1)return null;
    const i=differences[0],a=Inspector.info(actual[i]),b=Inspector.info(expected[i]),s=Inspector.skeleton(a.ch);
    return (a.nonASCII||b.nonASCII)&&s!==null&&s===Inspector.skeleton(b.ch)?{actual:a,expected:b,position:i+1}:null;
  }
  function asciiContext(r,summary){
    if(summary.relevant.length)return {relevant:summary.relevant,neutral:[],hidden:false};
    const neutral=!summary.target&&!summary.manual&&!r.characters.length&&!r.originalCharacters.length?r.asciiAmbiguities.slice(0,3):[];
    return {relevant:[],neutral,hidden:!neutral.length};
  }
  function comparisonResult(kind,c){
    const result=kind==='exact'||c?.exact?'The normalized hostnames match exactly.':kind==='subdomains'?'The inspected hostname is a subdomain of this hostname, not an exact match.':kind==='embedded'?'This name appears inside a different, longer hostname. It does not make that hostname a subdomain of this one.':c?.visual?'Different hostnames with a potential visual resemblance.':kind==='spelling'||c?.kind==='spelling'?'Different hostnames with similar spelling. This is separate from visual resemblance.':'The hostnames differ.';
    return result+(c?.unavailable?' Visual comparison is unavailable.':'');
  }
  function comparisonMethod(c){
    if(c.unavailable)return {title:'Visual comparison unavailable',text:'The inspector could compare hostname identity, but could not complete the visual check.'};
    if(c.mechanism==='UTS #39')return {title:'Unicode visual comparison',text:'Unicode lookalike data (UTS #39) was used to compare the readable hostnames.'};
    if(c.mechanism==='supplemental ASCII visual heuristic')return {title:'ASCII visual comparison',text:'Font-dependent ASCII alternatives were used to compare the original spellings.'};
    return c.exact?{title:'Hostname identity comparison',text:'Hostnames were compared after browser normalization, ignoring case and one final root dot.'}:c.kind==='spelling'?{title:'Spelling comparison',text:'The readable hostnames were compared for spelling differences.'}:{title:'Hostname comparison',text:'The readable hostnames were compared for supported visual and spelling similarities.'};
  }
  function unavailableReferences(n){return "The inspector couldn't check for visual resemblance to "+count(n,'saved reference')+'. A visual resemblance may still exist.';}
  const diagnosticTitles={empty:'No URL supplied','too-long':'URL exceeds the inspection limit',scheme:'URL format',parse:'URL could not be read',invisible:'Hidden or formatting characters',percent:'Invalid percent encoding',preprocessing:'Spaces or control characters removed',punycode:'Encoded hostname could not be validated',attribution:'Original hostname uncertain','normalized-ascii':'Original characters mapped to ASCII','non-ascii':'Internationalized hostname',normalization:'Hostname spelling changed',userinfo:'Sign-in text before @',http:'Unencrypted HTTP',port:'Non-default port','explicit-port':'Explicit port omitted by the browser',backslash:'Backslashes affect hostname boundaries',dns:'Hostname format needs review',mixed:'Writing systems mixed within a hostname section',scripts:'Writing systems across hostname sections','character-confusables':'Unicode lookalike mappings','ascii-ambiguity':'ASCII visual ambiguity','bidi-limit':'Right-to-left visual comparison unavailable','expected-error':'Expected hostname could not be checked',exact:'Exact hostname match',mismatch:'Hostname mismatch',impersonation:'Potential visual impersonation',spelling:'Similar spelling','comparison-limit':'Visual comparison unavailable',subdomain:'Subdomain of the expected hostname','deceptive-subdomain':'Expected name inside a different hostname','no-anomalies':'No unusual hostname characters',unverified:'Website not verified'};
  function diagnostic(m){
    const processing=['too-long','scheme','parse','punycode','attribution','bidi-limit','expected-error','comparison-limit'],comparison=['exact','mismatch','impersonation','spelling','subdomain','deceptive-subdomain'];
    const severity=m.level==='alert'?'Warning':m.level==='warn'?'Caution':'Information';
    return {title:diagnosticTitles[m.code]||'Additional analysis finding',category:m.code==='unverified'?'Verification limit':processing.includes(m.code)?'Processing limit':comparison.includes(m.code)?'Comparison':'Observation',severity,classification:severity};
  }
  function diagnosticText(m,r){
    const messages={empty:'Paste a URL to begin.','too-long':'This URL exceeds the inspection limit. Shorten it and try again; the complete original remains in the input field.',scheme:validation(m.text,'url'),parse:"Your browser couldn't read this URL. Check the hostname, brackets and port before trying again.",invisible:'Hidden or formatting characters occur in the submitted text. Their code points are retained in the technical evidence; they may occur outside the hostname.',percent:'Some percent-encoded text is incomplete or invalid. Review the original URL; this can affect how it is read.',preprocessing:'Your browser removed spaces or control characters while reading the URL. The original URL is preserved.',punycode:"The encoded hostname couldn't be validated. Its ASCII form remains available; the readable form could not be established.",attribution:'The original hostname could not be identified with certainty. Review the parsed actual hostname and original URL.','normalized-ascii':'Hostname processing mapped the original characters to ASCII. This transformation alone does not establish a different destination.','non-ascii':'Unicode characters remain in the readable hostname. Internationalized names can be legitimate.',normalization:'The original spelling and readable hostname differ. Both forms are retained in the technical evidence.',userinfo:'The text before @ belongs to the sign-in section of the URL. It is not the destination hostname.',http:'This link uses HTTP, which does not encrypt traffic to the website.',port:'The URL specifies port '+r.port+'. Check that this is expected.','explicit-port':'The input explicitly supplied port syntax '+visible(r.original?.port)+'. The browser left out the default or empty port.',backslash:'The browser treats backslashes as forward slashes in HTTP(S) URLs. This can change where the hostname ends.',mixed:'More than one writing system occurs within '+count(r.mixedLabels?.length||0,'hostname section')+'. This can be legitimate; review the spelling.',scripts:'Different writing systems appear across hostname sections. This can be legitimate.','character-confusables':'Some characters have Unicode lookalike mappings. Character Details retains the mapping data.','ascii-ambiguity':asciiIntroduction,'bidi-limit':"Complete right-to-left visual comparisons aren't supported. Exact hostname comparisons remain available.",'expected-error':validation(r.expectedError),exact:'The hostnames match after normalization. This does not compare the rest of the URL.',mismatch:'Expected '+visible(r.expected?.ascii)+'; actual '+visible(r.ascii)+'.',impersonation:'The hostnames differ but may look alike. The technical evidence retains the comparison method and any supported substitutions.',spelling:'The hostnames have similar spelling. This is separate from a Unicode or font-based visual resemblance.','comparison-limit':'Visual resemblance could not be checked. A hostname mismatch here does not rule out a lookalike.',subdomain:'The actual hostname is a subdomain of '+visible(r.expected?.ascii)+', not an exact match.','deceptive-subdomain':'The expected hostname appears inside a longer, different hostname. That occurrence does not make it a subdomain of the expected hostname.','no-anomalies':'No non-ASCII or hidden hostname characters were identified. ASCII lookalikes can still exist.',unverified:'The website has not been visited or checked for ownership, reputation, content or redirects.'};
    if(m.code==='dns')return /253-byte/.test(m.text)?'The hostname exceeds the 253-byte DNS length limit.':/empty DNS label/.test(m.text)?'A hostname section is empty. Check the dots.':/63 ASCII bytes/.test(m.text)?'One hostname section exceeds the 63-byte DNS limit.':/starts or ends with a hyphen/.test(m.text)?'A hostname section starts or ends with a hyphen.':'The hostname contains characters outside standard DNS letter, digit and hyphen rules.';
    return messages[m.code]||'An additional finding is available in the technical evidence.';
  }
  function storageStatus(state,edition,writeFailed=false){
    if(state.blocked)return /another tab or app/.test(state.status)?'Your saved references changed elsewhere. Edits in this tab have not replaced them. Export a backup before reviewing a replacement.':'Saved data needs review. It has not been replaced; changes stay in this tab. See Storage & hostname help.';
    if(writeFailed)return "Saving failed. Changes stay in this tab; the saved copy was not replaced. Export a backup before closing.";
    if(state.mode!=='browser')return 'Storage unavailable. References stay in this tab only; export a backup before closing.';
    if(state.revision>0||state.status.startsWith('Reference schema migrated'))return 'Changes saved in this browser.'+(edition==='standalone'?" Lasting storage for local files isn't guaranteed; keep a backup.":'');
    return state.status.startsWith('Saved')?'Previously saved references loaded.'+(edition==='standalone'?' Local-file storage may not last; keep a backup.':''):"This browser can read reference storage. Saving hasn't been checked yet.";
  }
  function importSummary(plan){
    return {title:'Import Preview — '+(plan.mode==='replace'?'Replace':'Merge'),lines:[plan.added.length?count(plan.added.length,'new reference')+' will be added.':'No new references will be added.',plan.removed.length?count(plan.removed.length,'existing reference')+' will be removed.':'No existing references will be removed.','References after import: '+plan.final.length,'No changes have been made yet.'],duplicates:plan.duplicates?'Duplicate or already saved entries: '+plan.duplicates+'.':''};
  }
  return Object.freeze({count,asciiIntroduction,validation,inputFailure,summarize,supporting,explain,characterEvidence,characterNormalization,unicodeDifference,asciiContext,comparisonResult,comparisonMethod,unavailableReferences,diagnostic,diagnosticText,diagnosticCodes:Object.keys(diagnosticTitles),storageStatus,importSummary});
})();
