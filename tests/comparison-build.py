#!/usr/bin/env python3
"""Offline Stage 5 development builds; all generated artifacts are disposable."""
import base64
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]
report={'suite':'Stage 5 build, inert assets and stable artifact preservation','checks':[],'failures':[]}
def sha(b):return hashlib.sha256(b).hexdigest()
def run(*args,ok=True):
    r=subprocess.run(args,cwd=ROOT,capture_output=True,text=True)
    if (r.returncode==0)!=ok:raise AssertionError(r.stdout+r.stderr)
    return r
def require(v,why='Assertion failed'):
    if not v:raise AssertionError(why)
def check(name,fn):
    try:fn();report['checks'].append({'name':name,'passed':True})
    except Exception as e:report['checks'].append({'name':name,'passed':False});report['failures'].append({'name':name,'error':str(e)})
files=['standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js','site/.nojekyll','build-manifest.json']
before={p:(ROOT/p).read_bytes() for p in files}
with tempfile.TemporaryDirectory(prefix='oui-stage5-build-',dir='/private/tmp') as folder:
    temp=Path(folder);one=temp/'one';two=temp/'two'
    check('comparison preview rejects repository root',lambda:require('outside' in run(sys.executable,'-B','tools/build.py','--comparison-preview',ok=False).stderr))
    check('comparison preview rejects repository children',lambda:require('outside' in run(sys.executable,'-B','tools/build.py','--comparison-preview','--output-root',str(ROOT/'site/stage5'),ok=False).stderr))
    for dest in [one,two]:check('build '+dest.name,lambda dest=dest:run(sys.executable,'-B','tools/build.py','--comparison-preview','--output-root',str(dest)))
    check('repeat complete build bytes agree',lambda:[require((one/p).read_bytes()==(two/p).read_bytes(),p) for p in files])
    def integrity():
        manifest=json.loads((one/'build-manifest.json').read_text());old=json.loads((ROOT/'build-manifest.json').read_text())
        require(manifest['automaticMatchingAvailable'] is True and manifest['automaticUIAvailable'] is False and manifest['developmentOnly'] is True)
        require(manifest['comparisonSchemaVersion']==1 and manifest['initialization']=='explicit-local-text')
        require(manifest['comparisonSourceSHA256']==sha((ROOT/'src/comparisons.js').read_bytes()))
        require(manifest['lookalikeIndexSHA256']==sha((ROOT/'data/lookalikes/index.json').read_bytes()))
        for edition,p in [('standalone',files[0]),('hosted',files[1])]:
            raw=(one/p).read_bytes();text=raw.decode();entry=manifest[edition]
            require(entry['sha256']==sha(raw) and entry['bytes']==len(raw))
            for tag,key in [('script','scriptHash'),('style','styleHash')]:
                content=re.search('<'+tag+'>([\\s\\S]*?)</'+tag+'>',text).group(1)
                digest=base64.b64encode(hashlib.sha256(content.encode()).digest()).decode()
                require(entry[key]==digest and tag+"-src 'sha256-"+digest+"'" in text)
            require(entry['styleHash']==old[edition]['styleHash'])
            for policy in ["default-src 'none'","connect-src 'none'","base-uri 'none'","form-action 'none'","frame-src 'none'","img-src 'none'"]:require(policy in text)
            require('unsafe-inline' not in text and 'unsafe-eval' not in text)
            require(not re.search(r'<(?:script|link|img)\b[^>]*(?:src|href)\s*=',text,re.I))
            for id,path in [('reference-manifest','data/reference-foundation.json'),('public-suffix-data','data/public-suffix/compiled.json'),('popular-domain-data','data/popular-domains/records.json'),('lookalike-index','data/lookalikes/index.json')]:require(re.search('id="'+id+'">([\\s\\S]*?)</script>',text).group(1)==(ROOT/path).read_text(),id)
            require(json.loads(re.search('id="lookalike-notice">([\\s\\S]*?)</script>',text).group(1))==(ROOT/'data/lookalikes/NOTICE.txt').read_text())
        require(manifest['release']=='3.3.0-stage5-'+manifest['hosted']['sha256'][:16])
        worker=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',manifest['release']).replace('@@INDEX_HASH@@',manifest['hosted']['sha256']);require((one/'site/sw.js').read_text()==worker)
        report['developmentManifest']=manifest
    check('local data, notices, CSP and worker bind the complete current development bundle',integrity)
    for script in ['comparison-dom.mjs','embedded.mjs','audit-corrections.mjs','dom-v3.mjs','interface.mjs','reference-interface.mjs','technical.mjs']:
        check('generated current runtime '+script,lambda script=script:run('deno','run','--cached-only','--allow-read=.,'+str(one),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+script,'--development-root='+str(one)))
    check('public stable artifacts and manifest remain byte-identical',lambda:[require((ROOT/p).read_bytes()==before[p],p) for p in files])
report['total']={'executed':len(report['checks']),'passed':sum(x['passed'] for x in report['checks']),'failed':len(report['failures'])}
report['scope']='Fresh isolated development builds and generated Happy DOM execution. No full release verifier, HTTP, native Firefox, VoiceOver, deployment or publication.'
(ROOT/'tests/comparison-build-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));raise SystemExit(bool(report['failures']))
