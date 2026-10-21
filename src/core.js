'use strict';
// No network, DOM, storage, navigation, or browser history access in this module.
// UTS #39 rev.34 scope: LTR fast path only; R/AL and explicit bidi controls
// return unavailable, never a negative visual-comparison result.
const Inspector = (() => {
  const D = JSON.parse(document.getElementById('unicode-data').textContent);
  const MAX_INPUT = 32768;
  const cp = ch => 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  function range(table, n, fallback) {
    let lo=0, hi=table.length-1;
    while(lo<=hi){const m=(lo+hi)>>>1, r=table[m];if(n<r[0])hi=m-1;else if(n>r[1])lo=m+1;else return r[2];}
    return fallback;
  }
  const category = ch => range(D.categories, ch.codePointAt(0), 'Cn');
  const bidi = ch => range(D.bidi, ch.codePointAt(0), 'L');
  const ignorable = ch => range(D.ignorables, ch.codePointAt(0), false);
  const script = ch => range(D.scripts, ch.codePointAt(0), 'Zzzz');
  const scriptName = short => (D.scriptNames[short] || short).replaceAll('_',' ');
  function name(ch){
    const n=ch.codePointAt(0);
    if(D.names[n])return D.names[n];
    const block=range(D.nameRanges,n,null);
    if(block){
      if(block.startsWith('CJK Ideograph'))return 'CJK UNIFIED IDEOGRAPH-'+n.toString(16).toUpperCase();
      if(block==='Hangul Syllable'){
        const l=['G','GG','N','D','DD','R','M','B','BB','S','SS','','J','JJ','C','K','T','P','H'];
        const v=['A','AE','YA','YAE','EO','E','YEO','YE','O','WA','WAE','OE','YO','U','WEO','WE','WI','YU','EU','YI','I'];
        const t=['','G','GG','GS','N','NJ','NH','D','L','LG','LM','LB','LS','LT','LP','LH','M','B','BS','S','SS','NG','J','C','K','T','P','H'];
        const k=n-0xAC00;return 'HANGUL SYLLABLE '+l[Math.floor(k/588)]+v[Math.floor(k%588/28)]+t[k%28];
      }
      return block.toUpperCase()+' CHARACTER '+cp(ch);
    }
    return category(ch)==='Cn'?'UNASSIGNED CODE POINT':'CHARACTER '+cp(ch);
  }
  function invisible(ch){return ignorable(ch)||['Cc','Cf','Cs','Zl','Zp'].includes(category(ch))||(category(ch)==='Zs'&&ch!==' ');}
  function visible(s){return [...s].map(c=>invisible(c)?'⟦'+cp(c)+'⟧':c).join('');}
  function info(ch){
    const n=ch.codePointAt(0), rule=range(D.idna,n,['disallowed','']);
    return {ch,code:cp(ch),name:name(ch),script:scriptName(script(ch)),invisible:invisible(ch),
      nonASCII:n>127,confusable:D.confusables[n]??null,idnaStatus:rule[0],idnaMapping:rule[1]};
  }
  // UAX #15 NFD using bundled Unicode 18 data, independent of browser ICU version.
  function nfd(s){
    const out=[];
    function decompose(n){
      if(n>=0xAC00&&n<=0xD7A3){const k=n-0xAC00;out.push(0x1100+Math.floor(k/588),0x1161+Math.floor((k%588)/28));if(k%28)out.push(0x11A7+k%28);}
      else if(D.decomposition[n])D.decomposition[n].forEach(decompose);
      else out.push(n);
    }
    for(const c of s)decompose(c.codePointAt(0));
    let segment=[];const ordered=[];
    function flush(){segment.sort((a,b)=>(D.ccc[a]||0)-(D.ccc[b]||0));ordered.push(...segment);segment=[];}
    for(const n of out){if(!(D.ccc[n]||0)){flush();ordered.push(n);}else segment.push(n);}flush();
    return ordered.map(n=>String.fromCodePoint(n)).join('');
  }
  function internalSkeleton(s){return nfd([...nfd(s)].filter(c=>!ignorable(c)).map(c=>D.confusables[c.codePointAt(0)]??c).join(''));}
  function skeleton(s){
    if([...s].some(c=>['R','AL','RLE','LRE','RLO','LRO','PDF','LRI','RLI','FSI','PDI','B','S'].includes(bidi(c))))return null;
    return internalSkeleton(s);
  }
  function augmented(ch){
    const set=new Set(range(D.extensions,ch.codePointAt(0),[script(ch)]));
    if(set.has('Zyyy')||set.has('Zinh'))return null; // ALL
    if(set.has('Hani'))['Hanb','Hntl','Jpan','Kore'].forEach(s=>set.add(s));
    if(set.has('Hira')||set.has('Kana'))set.add('Jpan');
    if(set.has('Hang'))set.add('Kore');
    if(set.has('Bopo'))set.add('Hanb');
    if(set.has('Latn'))set.add('Hntl');
    return set;
  }
  function resolved(s){
    let result=null;
    for(const ch of s){const a=augmented(ch);if(a)result=result===null?a:new Set([...result].filter(x=>a.has(x)));}
    return result;
  }
  function confusableType(a,b){
    const x=resolved(a),y=resolved(b);
    if(x===null||y===null||[...x].some(s=>y.has(s)))return 'single-script';
    return x.size&&y.size?'whole-script':'mixed-script';
  }
  function scripts(s){return [...new Set([...s].map(script).filter(s=>!['Zyyy','Zinh'].includes(s)))].map(scriptName);}
  // RFC 3492. Bound work before arithmetic and reject non-canonical A-labels below.
  function adapt(delta, points, first){delta=first?Math.floor(delta/700):Math.floor(delta/2);delta+=Math.floor(delta/points);let k=0;while(delta>455){delta=Math.floor(delta/35);k+=36;}return k+Math.floor(36*delta/(delta+38));}
  function punyDecode(label){
    if(!/^xn--[a-z0-9-]+$/i.test(label)||label.length>63)throw Error('Invalid Punycode label syntax or length');
    const input=label.slice(4).toLowerCase(),out=[];let i=0,n=128,bias=72,pos=0,b=input.lastIndexOf('-');
    if(b>=0){for(let j=0;j<b;j++)out.push(input.charCodeAt(j));pos=b+1;}
    if(pos===input.length)throw Error('Punycode has no encoded non-ASCII character');
    while(pos<input.length){
      const old=i;let w=1;
      for(let k=36;;k+=36){
        if(pos>=input.length)throw Error('Truncated Punycode');
        const c=input.charCodeAt(pos++),d=c>=48&&c<=57?c-22:c>=97&&c<=122?c-97:99;
        if(d>=36||d>Math.floor((Number.MAX_SAFE_INTEGER-i)/w))throw Error('Invalid Punycode arithmetic');
        i+=d*w;const t=k<=bias?1:k>=bias+26?26:k-bias;if(d<t)break;
        if(w>Math.floor(Number.MAX_SAFE_INTEGER/(36-t)))throw Error('Punycode overflow');w*=36-t;
      }
      const length=out.length+1;bias=adapt(i-old,length,old===0);n+=Math.floor(i/length);i%=length;
      if(n>0x10ffff||(n>=0xd800&&n<=0xdfff))throw Error('Invalid Punycode scalar');
      out.splice(i,0,n);i++;
    }
    const result=out.map(c=>String.fromCodePoint(c)).join('');
    if(![...result].some(c=>c.codePointAt(0)>127)||punyEncode(result)!==label.toLowerCase())throw Error('Non-canonical Punycode');
    return result;
  }
  function punyEncode(text){
    const input=[...text].map(c=>c.codePointAt(0)),out=input.filter(n=>n<128).map(n=>String.fromCodePoint(n));
    let b=out.length,h=b,n=128,delta=0,bias=72;if(b)out.push('-');
    const digit=n=>String.fromCharCode(n<26?n+97:n-26+48);
    while(h<input.length){
      const m=Math.min(...input.filter(c=>c>=n));delta+=(m-n)*(h+1);n=m;
      if(!Number.isSafeInteger(delta))throw Error('Punycode overflow');
      for(const c of input){
        if(c<n)delta++;
        if(c===n){let q=delta;for(let k=36;;k+=36){const t=k<=bias?1:k>=bias+26?26:k-bias;if(q<t)break;out.push(digit(t+(q-t)%(36-t)));q=Math.floor((q-t)/(36-t));}out.push(digit(q));bias=adapt(delta,h+1,h===b);delta=0;h++;}
      }
      delta++;n++;
    }
    return 'xn--'+out.join('');
  }
  function unicodeHost(host){
    if(host.startsWith('['))return host;
    return host.split('.').map(label=>{
      if(!/^xn--/i.test(label))return label;
      const value=punyDecode(label);
      // Require IDNA round-trip through this browser, not merely RFC 3492 decoding.
      const check=new URL('https://'+value+'.invalid/');
      if(check.hostname!==label.toLowerCase()+'.invalid')throw Error('Punycode fails browser IDNA round-trip');
      if(/[.\/\\:@?#%\s]/u.test(value))throw Error('Punycode decodes to forbidden hostname syntax');
      return value;
    }).join('.');
  }
  function preprocess(raw){
    let start=0,end=raw.length;
    while(start<end&&raw.charCodeAt(start)<=32)start++;
    while(end>start&&raw.charCodeAt(end-1)<=32)end--;
    let text='';const indices=[];
    for(let i=start;i<end;i++)if(!/[\t\n\r]/.test(raw[i])){text+=raw[i];indices.push(i);}
    return {text,indices,start,end,changed:raw!==text};
  }
  function prepare(raw){
    const p=preprocess(raw);let text=p.text,assumed=false,prefix=0;
    if(text&&invisible([...text][0]))throw Error('Leading Unicode whitespace or format characters obscure the URL boundary. Remove them explicitly before inspecting the address.');
    const m=/^([a-z][a-z\d+.-]*):/i.exec(text);
    // Scan the authority token once; overlapping hostname matches can backtrack quadratically.
    const hostPortMatch=/^([^\s/:?#]+):\d*(?:[/?#]|$)/.exec(text);
    const hostPort=!!hostPortMatch&&(/^localhost$/i.test(hostPortMatch[1])||hostPortMatch[1].slice(1,-1).includes('.'));
    if(m&&!hostPort){
      if(!/^https?$/i.test(m[1]))throw Error('Unsupported scheme. Only HTTP and HTTPS URLs are inspected.');
      if(!/^https?:\/\//i.test(text))throw Error('HTTP/HTTPS input must include :// so the original authority is unambiguous.');
    }else{
      assumed=true;prefix=text.startsWith('//')?6:8;text=(prefix===6?'https:':'https://')+text;
    }
    return {p,text,assumed,prefix};
  }
  // A bounded authority scanner, following HTTP(S) special-URL delimiters.
  // The browser parser remains authoritative. Validate the extracted host against it.
  function originalHost(raw, prep, url){
    const text=prep.text,match=/^https?:\/\//i.exec(text);
    if(!match)return {reliable:false,reason:'No unambiguous HTTP(S) authority prefix.'};
    const begin=match[0].length;let end=begin;
    while(end<text.length&&!'/\\?#'.includes(text[end]))end++;
    if(end===begin)return {reliable:false,reason:'Extra authority slashes or backslashes prevent reliable original-host attribution.'};
    let at=-1;for(let i=begin;i<end;i++)if(text[i]==='@')at=i;
    const hostStart=at>=0?at+1:begin,part=text.slice(hostStart,end);let hostEnd=end,port='';
    if(part.startsWith('[')){
      const close=text.indexOf(']',hostStart+1);
      if(close<0||close>=end||!/^(:\d*)?$/.test(text.slice(close+1,end)))return {reliable:false,reason:'Malformed bracketed IPv6 authority.'};
      hostEnd=close+1;port=text.slice(hostEnd,end);
    }else{
      if(/[\[\]]/.test(part))return {reliable:false,reason:'Unbalanced hostname brackets.'};
      let colon=-1;for(let i=hostStart;i<end;i++)if(text[i]===':'){if(colon>=0)return {reliable:false,reason:'Unbracketed IPv6 or multiple port delimiters.'};colon=i;}
      if(colon>=0){hostEnd=colon;port=text.slice(colon,end);if(!/^:\d*$/.test(port))return {reliable:false,reason:'Invalid explicit port syntax.'};}
    }
    const mapped=text.slice(hostStart,hostEnd);
    let rawStart;
    if(at>=0)rawStart=prep.p.indices[at-prep.prefix]+1;
    else rawStart=hostStart===prep.prefix?prep.p.start:prep.p.indices[hostStart-prep.prefix-1]+1;
    const rawEnd=hostEnd-prep.prefix<prep.p.indices.length?prep.p.indices[hostEnd-prep.prefix]:prep.p.end;
    if(!Number.isInteger(rawStart)||!Number.isInteger(rawEnd))return {reliable:false,reason:'Source offsets could not be reconstructed.'};
    const original=raw.slice(rawStart,rawEnd);let decoded;
    try{decoded=decodeURIComponent(mapped);}catch{return {reliable:false,original,reason:'Malformed percent encoding in candidate hostname.'};}
    let validated=false;
    if(url){try{validated=new URL(url.protocol+'//'+mapped+port+'/').hostname===url.hostname;}catch{}}
    return {reliable:!!url&&validated,original,decoded,port,hadUserinfo:at>=0,
      reason:!url?'Candidate hostname only: browser rejected the URL; destination and normalization are unverified.':!validated?'Extracted hostname did not agree with the browser parser.':null};
  }
  const canonicalHost = host => host.replace(/\.$/,'').toLowerCase();
  function dnsWarnings(host){
    if(host.startsWith('['))return [];
    const clean=host.replace(/\.$/,''),warnings=[];
    if(clean.length>253)warnings.push('Hostname exceeds the 253-byte DNS presentation limit.');
    for(const label of clean.split('.')){
      if(!label.length)warnings.push('Hostname contains an empty DNS label.');
      if(label.length>63)warnings.push('A DNS label exceeds 63 ASCII bytes.');
      if(label.startsWith('-')||label.endsWith('-'))warnings.push('A DNS label starts or ends with a hyphen.');
      if(/[^a-z0-9-]/i.test(label))warnings.push('Hostname contains syntax outside ordinary DNS letter/digit/hyphen labels.');
    }
    return [...new Set(warnings)];
  }
  function expectedHost(raw){
    if(!raw.trim())return null;
    if(raw.length>2048)throw Error('Expected hostname is too long.');
    const prep=prepare(raw),u=new URL(prep.text),o=originalHost(raw,prep,u);
    const supplied=prep.p.text.replace(/^https?:\/\//i,'');
    if(!o.reliable||o.hadUserinfo||o.port||u.username||u.password||u.pathname!=='/'||u.search||u.hash||/[?#\\]/.test(supplied)||/\/(?!$)/.test(supplied))throw Error('Enter only a hostname, without credentials, port, path, query, or fragment (a trailing root slash is allowed).');
    if(dnsWarnings(u.hostname).length)throw Error('Expected hostname has invalid DNS label syntax or length.');
    const ascii=canonicalHost(u.hostname),unicode=unicodeHost(ascii);
    return {ascii,unicode,original:o.decoded};
  }
  // Supplemental, finite font-dependent ASCII heuristic. This is not UTS #39.
  function asciiVisual(s){
    if(!/^[\x00-\x7f]+$/.test(s))return null;
    return internalSkeleton(s).toLowerCase().replaceAll('0','o').replaceAll('w','vv').replaceAll('d','cl').replaceAll('5','s').replaceAll('2','z').replaceAll('8','b');
  }
  // Neutral, finite font-dependent observations, separate from comparison.
  // Case is significant here: lowercase i is not an uppercase I observation.
  const ASCII_AMBIGUITIES = Object.freeze([
    ['rn','m'],['vv','w'],['I','l','1'],['O','o','0'],
    ['cl','d'],['5','s'],['2','z'],['8','b']
  ].map(tokens=>Object.freeze(tokens)));
  function asciiAmbiguities(original,unicode){
    if(unicode.startsWith('[')||/^(?:\d+\.){3}\d+$/.test(unicode))return [];
    const observations=new Map();
    const sources=original&&original!==unicode?[['original decoded hostname',original],['readable normalized hostname',unicode]]:[['readable normalized hostname',unicode]];
    for(const [source,host]of sources){
      const labels=host.replace(/[\u3002\uff0e\uff61]/g,'.').split('.');
      labels.forEach((label,labelIndex)=>{
        if(/^xn--/i.test(label))return; // Encoded A-label text is not a readable spelling.
        const points=[...label];
        for(const tokens of ASCII_AMBIGUITIES)for(const token of tokens){
          for(let at=0;at<points.length;at++)if(points.slice(at,at+token.length).join('')===token){
            const key=tokens.join('/');
            if(!observations.has(key))observations.set(key,{alternatives:[...tokens],observed:[],occurrences:[]});
            const o=observations.get(key);if(!o.observed.includes(token))o.observed.push(token);
            o.occurrences.push({text:token,source,label:labelIndex+1,offset:at+1});
          }
        }
      });
    }
    return [...observations.values()];
  }
  function asciiSubstitutions(original,unicode,expected){
    // Explain already-established visual comparisons; this never changes verdicts.
    function align(a,b){
      if(a.length>253||b.length>253||!/^[a-z0-9.-]+$/i.test(a+b))return null;
      const memo=new Map();
      function visit(i,j){
        const key=i+':'+j;if(memo.has(key))return memo.get(key);
        if(i===a.length&&j===b.length)return [];
        if(a[i]===b[j]&&i<a.length){const tail=visit(i+1,j+1);if(tail!==null){memo.set(key,tail);return tail;}}
        for(const tokens of ASCII_AMBIGUITIES)for(const x of tokens)for(const y of tokens){
          if(x!==y&&a.startsWith(x,i)&&b.startsWith(y,j)){
            const tail=visit(i+x.length,j+y.length);
            if(tail!==null){const found=[{actual:x,expected:y},...tail];memo.set(key,found);return found;}
          }
        }
        memo.set(key,null);return null;
      }
      return visit(0,0);
    }
    for(const [a,b]of [[original,expected.original],[unicode,expected.unicode]]){
      if(!a||!b)continue;
      // Do not explain A-label encoding substrings as human visual substitutions.
      if(a.split('.').some(l=>/^xn--/i.test(l))||b.split('.').some(l=>/^xn--/i.test(l)))continue;
      const found=align(a.replace(/\.$/,''),b.replace(/\.$/,''));
      if(found?.length)return [...new Map(found.map(p=>[p.actual+'/'+p.expected,p])).values()];
    }
    return [];
  }
  function editDistance(a,b){ // Optimal string alignment: insertion, deletion, substitution, adjacent transpose.
    const rows=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
    for(let i=0;i<=a.length;i++)rows[i][0]=i;for(let j=0;j<=b.length;j++)rows[0][j]=j;
    for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
      rows[i][j]=Math.min(rows[i-1][j]+1,rows[i][j-1]+1,rows[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
      if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])rows[i][j]=Math.min(rows[i][j],rows[i-2][j-2]+1);
    }
    return rows[a.length][b.length];
  }
  function compare(actual, unicode, original, expected){
    const a=canonicalHost(actual),b=expected.ascii;
    if(a===b)return {kind:'exact',exact:true,visual:false,mechanism:null};
    const x=skeleton(unicode),y=skeleton(expected.unicode);
    if(x!==null&&y!==null&&x===y){
      const types=[];const aa=unicode.split('.'),bb=expected.unicode.split('.');
      if(aa.length===bb.length)for(let i=0;i<aa.length;i++)if(aa[i]!==bb[i])types.push(confusableType(aa[i],bb[i]));
      return {kind:'visual',exact:false,visual:true,mechanism:'UTS #39',types:[...new Set(types)]};
    }
    if(original&&/^[a-z0-9.-]+$/i.test(original)&&/^[a-z0-9.-]+$/i.test(expected.original)){
      if(asciiVisual(canonicalHost(original))===asciiVisual(canonicalHost(expected.original))||asciiVisual(original.replace(/\.$/,''))===asciiVisual(expected.original.replace(/\.$/,'')))return {kind:'visual',exact:false,visual:true,mechanism:'supplemental ASCII visual heuristic'};
    }
    if(x===null||y===null)return {kind:'mismatch',exact:false,visual:null,unavailable:true};
    const aa=[...unicode].join(''),bb=[...expected.unicode].join(''),max=Math.max(aa.length,bb.length);
    if(max<=253&&max>=5){const distance=editDistance(aa,bb);if(distance<=2&&1-distance/max>=0.8)return {kind:'spelling',exact:false,visual:false,distance};}
    return {kind:'mismatch',exact:false,visual:false};
  }
  function inspect(raw,expectedRaw=''){
    const r={raw,ok:false,messages:[],original:null,originalCharacters:[],characters:[],asciiAmbiguities:[],comparison:null,version:D.version};
    const note=(code,text,level='note')=>r.messages.push({code,text,level});
    if(!raw.length||!raw.trim()){note('empty','Paste a URL to inspect.','alert');return r;}
    if(raw.length>MAX_INPUT){note('too-long','Input exceeds 32,768 UTF-16 code units; shorten the URL. No destination was analyzed.','alert');return r;}
    const controls=[...new Set([...raw].filter(invisible))];
    if(controls.length)note('invisible','Input contains control, invisible, whitespace, or bidirectional-format characters: '+controls.map(c=>cp(c)+' '+name(c)).join('; ')+'. Their location matters; they are not automatically hostname characters.','alert');
    if(/%(?![0-9a-f]{2})/i.test(raw))note('percent','Malformed percent encoding appears in the input; some browsers preserve this in paths or queries.','warn');
    let prep,u;
    try{prep=prepare(raw);r.assumed=prep.assumed;}catch(e){note('scheme',e.message,'alert');return r;}
    if(prep.p.changed)note('preprocessing','Browser preprocessing removes leading/trailing C0 controls or spaces and embedded TAB, LF, and CR. The original input is retained below.','warn');
    try{u=new URL(prep.text);}catch{}
    r.original=originalHost(raw,prep,u);
    const o=r.original;
    r.originalCharacters=[...new Set([...(o.original||''),...(o.decoded||'')].filter(c=>c.codePointAt(0)>127||invisible(c)))].map(info);
    if(!u){note('parse','Browser rejected this URL. Any extracted hostname is a candidate only; no normalized destination or safety conclusion is available.','alert');return r;}
    if(!['http:','https:'].includes(u.protocol)||!u.hostname){note('parse','No supported HTTP(S) hostname was found.','alert');return r;}
    r.ascii=u.hostname;r.scheme=u.protocol;r.port=u.port;r.path=u.pathname;r.query=u.search;r.fragment=u.hash;
    try{r.unicode=unicodeHost(r.ascii);}catch(e){note('punycode','Punycode/IDNA validation failed: '+e.message+'. The ASCII hostname remains visible; readable-host comparisons are unavailable.','alert');r.unicode=r.ascii;r.decodeError=true;}
    r.ok=true;
    r.characters=[...new Set([...r.unicode].filter(c=>c.codePointAt(0)>127))].map(info);
    r.writingSystems=scripts(r.unicode);
    r.mixedLabels=r.unicode.startsWith('[')?[]:r.unicode.split('.').filter(label=>resolved(label)?.size===0);
    r.normalized=!r.decodeError&&!!o.reliable&&o.decoded!==r.unicode;
    if(!o.reliable)note('attribution','Original hostname attribution unavailable: '+o.reason+' Original-input character conclusions are limited.','warn');
    if(!r.decodeError&&o.reliable&&r.originalCharacters.length&&!r.characters.length)note('normalized-ascii','Original hostname contains Unicode or invisible characters; browser normalization produces the ASCII hostname shown below. Compatibility mappings are spelling transformations, not evidence of a different destination.','note');
    else if(r.characters.length)note('non-ascii','Non-ASCII characters remain in the internationalized hostname. Internationalized names are legitimate; review the characters and context.');
    if(r.normalized)note('normalization','Original decoded hostname → readable normalized hostname: '+visible(o.decoded)+' → '+visible(r.unicode)+'. IDNA mappings, case folding, canonical composition, IP normalization, or A-label decoding can change the spelling.');
    if(o.hadUserinfo||u.username||u.password)note('userinfo','Username/password syntax occurs before @. It is not the destination hostname; the actual hostname is shown below.','alert');
    if(u.protocol==='http:')note('http','This link uses unencrypted HTTP rather than HTTPS.','alert');
    if(u.port)note('port','Non-default port: '+u.port+'. Verify that it is expected.','warn');
    else if(o.port)note('explicit-port','Explicit port syntax '+o.port+' was supplied; the browser omitted the default or empty port from its normalized representation.');
    if(raw.includes('\\'))note('backslash','HTTP(S) browsers treat backslashes as slashes. Review authority boundaries and the normalized hostname.','warn');
    for(const warning of dnsWarnings(r.ascii))note('dns',warning+' Browser acceptance is not DNS validity.','warn');
    if(r.mixedLabels.length)note('mixed','Multiple writing systems occur within these labels: '+r.mixedLabels.map(visible).join(', ')+'. Mixed writing systems can be legitimate.');
    else if(r.writingSystems.length>1)note('scripts','Writing systems across hostname labels: '+r.writingSystems.join(', ')+'. Japanese/Korean and other legitimate combinations are not automatically suspicious.');
    r.confusableCharacters=r.characters.filter(c=>c.confusable!==null);
    if(r.confusableCharacters.length)note('character-confusables','Some hostname characters have Unicode confusable mappings. A character mapping alone does not establish impersonation. Skeletons are internal comparison keys, never destination hostnames.');
    if(!r.decodeError){
      r.asciiAmbiguities=asciiAmbiguities(o.reliable?o.decoded:null,r.unicode);
      if(r.asciiAmbiguities.length)note('ascii-ambiguity','ASCII visual ambiguity (informational): '+r.asciiAmbiguities.map(a=>a.alternatives.map(s=>'“'+s+'”').join(' / ')+' (observed '+a.observed.map(s=>'“'+s+'”').join(', ')+')').join('; ')+'. Appearance is font-dependent; these observations alone establish no impersonation.','info');
    }
    if(!r.decodeError&&skeleton(r.unicode)===null)note('bidi-limit','UTS #39 visual comparison is unavailable for right-to-left characters or explicit bidi controls in this version. Character identification and exact hostname comparison still apply.','warn');
    let expected;
    try{expected=expectedHost(expectedRaw);r.expected=expected;}catch(e){r.expectedError=e.message;note('expected-error','Expected hostname could not be validated: '+e.message,'warn');}
    if(expected){
      r.comparison=r.decodeError?{kind:canonicalHost(r.ascii)===expected.ascii?'exact':'mismatch',exact:canonicalHost(r.ascii)===expected.ascii,visual:null,unavailable:true}:compare(r.ascii,r.unicode,o.reliable?o.decoded:null,expected);
      const c=r.comparison;
      if(c.exact)note('exact','Exact hostname match after browser normalization (case-insensitive, ignoring one trailing root dot). This does not establish page/path safety or exclude compromise or redirects.');
      else{
        note('mismatch','Hostname mismatch: expected '+expected.ascii+', actual '+r.ascii+'.','alert');
        if(c.visual){
          c.asciiSubstitutions=asciiSubstitutions(o.reliable?o.decoded:null,r.unicode,expected);
          note('impersonation','Potential visual impersonation of the expected hostname ('+c.mechanism+(c.types?.length?'; '+c.types.join(', ')+' label comparison':'')+'). '+(c.asciiSubstitutions.length?'Relevant ASCII substitution'+(c.asciiSubstitutions.length===1?'':'s')+': '+c.asciiSubstitutions.map(p=>'“'+p.actual+'” / “'+p.expected+'”').join(', ')+'. ':'')+'Appearance depends on fonts; this is a warning, not proof of intent.','alert');
        }
        else if(c.kind==='spelling')note('spelling','Ordinary spelling similarity to the expected hostname (edit distance '+c.distance+'). This is separate from visual-confusable detection.','warn');
        if(c.unavailable)note('comparison-limit','Visual comparison is unavailable; a hostname mismatch must not be interpreted as a negative confusables check.','warn');
        const a=canonicalHost(r.ascii),b=expected.ascii;
        if(a.endsWith('.'+b))note('subdomain','The actual hostname is a subdomain of the expected hostname, but does not exactly match it.');
        else if(a.startsWith(b+'.')||a.includes('.'+b+'.'))note('deceptive-subdomain','The expected hostname appears inside a longer hostname. That occurrence does not make the actual hostname an exact match.','alert');
      }
    }
    if(!r.decodeError&&o.reliable&&!dnsWarnings(r.ascii).length&&!r.characters.length&&!r.originalCharacters.length&&!controls.length&&!r.comparison?.visual)note('no-anomalies','No non-ASCII or invisible hostname characters identified. ASCII spelling and visual lookalikes can still exist; this is not a safety verdict.');
    note('unverified','Destination unverified. This tool never visits the URL, follows redirects, checks reputation or ownership, or certifies a page as safe.');
    return r;
  }
  // V3 exposes existing pure comparisons for local references; algorithms unchanged.
  return Object.freeze({inspect,info,cp,visible,nfd,internalSkeleton,skeleton,resolved,confusableType,scripts,punyDecode,punyEncode,unicodeHost,expectedHost,originalHost,prepare,asciiVisual,editDistance,compareHostnames:compare,asciiComparisonDetails:asciiSubstitutions,MAX_INPUT,version:D.version});
})();
