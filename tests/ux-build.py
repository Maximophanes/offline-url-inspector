#!/usr/bin/env python3
"""Stage 6 isolated development-build verification; no public artifact writes."""
import argparse,base64,hashlib,json,re,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--with-dom',action='store_true');options=parser.parse_args()
report={'suite':'Stage 6 UX development build integrity','checks':[],'failures':[]}
sha=lambda b:hashlib.sha256(b).hexdigest()
def require(v,why='Assertion failed'):
 if not v:raise AssertionError(why)
def check(name,fn):
 try:fn();report['checks'].append({'name':name,'passed':True})
 except Exception as e:report['checks'].append({'name':name,'passed':False});report['failures'].append({'name':name,'error':str(e)})
def run(*args,ok=True):
 r=subprocess.run([sys.executable,'-B','tools/build.py',*args],cwd=ROOT,capture_output=True,text=True);require((r.returncode==0)==ok,r.stdout+r.stderr);return r
files=['standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js','site/.nojekyll','build-manifest.json'];before={p:(ROOT/p).read_bytes() for p in files}
with tempfile.TemporaryDirectory(prefix='oui-stage6-build-',dir='/private/tmp') as folder:
 one=Path(folder)/'one';two=Path(folder)/'two'
 for args in [[],['--automatic-ui-preview'],['--automatic-ui-preview','--output-root',str(ROOT/'site/stage6')],['--comparison-preview','--output-root',str(one)]]:
  check('refuse unsafe or historically mislabeled build '+str(args),lambda args=args:require(any(message in run(*args,ok=False).stderr for message in ['outside','--provenance-preview','--automatic-ui-preview'])))
 for dest in [one,two]:check('isolated build '+dest.name,lambda dest=dest:run('--automatic-ui-preview','--output-root',str(dest)))
 check('repeat complete development bundle bytes agree',lambda:[require((one/p).read_bytes()==(two/p).read_bytes(),p) for p in files])
 def integrity():
  m=json.loads((one/'build-manifest.json').read_text());require(m['automaticUIAvailable'] is True and m['automaticMatchingAvailable'] is True and m['developmentOnly'] is True);require(m['initialization']=='scheduled-local-text');require(m['primaryFindingPolicySHA256']==sha((ROOT/'src/results-presentation.js').read_bytes()));require(m['automaticUISourceSHA256']==sha((ROOT/'src/automatic-ui.js').read_bytes()));require(m['lookalikeIndexSHA256']==sha((ROOT/'data/lookalikes/index.json').read_bytes()))
  for edition,path in [('standalone',files[0]),('hosted',files[1])]:
   raw=(one/path).read_bytes();text=raw.decode();require(m[edition]['sha256']==sha(raw) and m[edition]['bytes']==len(raw))
   for tag,key in [('script','scriptHash'),('style','styleHash')]:
    content=re.search('<'+tag+'>([\\s\\S]*?)</'+tag+'>',text).group(1);digest=base64.b64encode(hashlib.sha256(content.encode()).digest()).decode();require(m[edition][key]==digest and tag+"-src 'sha256-"+digest+"'" in text)
   for policy in ["default-src 'none'","connect-src 'none'","base-uri 'none'","form-action 'none'","frame-src 'none'","img-src 'none'"]:require(policy in text)
   require('unsafe-inline' not in text and 'unsafe-eval' not in text);require(not re.search(r'<(?:script|link|img)\b[^>]*(?:src|href)\s*=',text,re.I))
   for id,path in [('reference-manifest','data/reference-foundation.json'),('public-suffix-data','data/public-suffix/compiled.json'),('popular-domain-data','data/popular-domains/records.json'),('lookalike-index','data/lookalikes/index.json')]:require(re.search('id="'+id+'">([\\s\\S]*?)</script>',text).group(1)==(ROOT/path).read_text(),id)
   require(json.loads(re.search('id="lookalike-notice">([\\s\\S]*?)</script>',text).group(1))==(ROOT/'data/lookalikes/NOTICE.txt').read_text());require('ResultsPresentation' in text and 'AutomaticUI.start()' in text)
  require(m['release']=='3.3.0-stage6-'+m['hosted']['sha256'][:16]);require((one/'site/sw.js').read_text()==(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',m['release']).replace('@@INDEX_HASH@@',m['hosted']['sha256']));report['developmentManifest']=m
 check('current UI, data, notices, CSP and worker bind the complete bundle',integrity)
 if options.with_dom:
  def dom():
   r=subprocess.run(['deno','run','--cached-only','--allow-read=.,'+str(one),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/ux-results.mjs','--development-root='+str(one)],cwd=ROOT,capture_output=True,text=True);require(r.returncode==0,r.stdout+r.stderr)
  check('targeted current generated UI and lifecycle checks',dom)
 check('public stable artifacts remain exact',lambda:[require((ROOT/p).read_bytes()==before[p],p) for p in files])
report['total']={'executed':len(report['checks']),'passed':sum(c['passed'] for c in report['checks']),'failed':len(report['failures'])};report['scope']='Only disposable Stage 6 builds. Historical/default builds refuse changed presentation rather than mislabel it. No release verifier or deployment workflow changes.'
(ROOT/'tests/ux-build-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(bool(report['failures']))
