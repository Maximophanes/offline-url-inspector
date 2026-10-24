#!/usr/bin/env python3
"""Bounded Stage 4 previews. All builds/mutations stay in disposable directories."""
import base64
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]
BASELINE='664cc58bf67a2127d0523adec9f1d80c6edd656e'
report={'suite':'Stage 4 development build and stable preservation','checks':[],'failures':[]}
def sha(raw):return hashlib.sha256(raw).hexdigest()
def run(*args,cwd=ROOT,success=True):
    p=subprocess.run(args,cwd=cwd,capture_output=True,text=True)
    if (p.returncode==0)!=success:raise AssertionError(p.stdout+p.stderr)
    return p
def require(value,message='Assertion failed'):
    if not value:raise AssertionError(message)
def check(name,fn):
    try:fn();report['checks'].append({'name':name,'passed':True})
    except Exception as e:report['checks'].append({'name':name,'passed':False});report['failures'].append({'name':name,'error':str(e)})
def baseline(name):return subprocess.check_output(['git','--no-optional-locks','show',BASELINE+':'+name],cwd=ROOT)
files=['standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js','site/.nojekyll','build-manifest.json']
public_before={name:(ROOT/name).read_bytes() for name in files}
with tempfile.TemporaryDirectory(prefix='oui-stage4-build-',dir='/private/tmp') as directory:
    temp=Path(directory);one=temp/'one';two=temp/'two'
    check('default build refuses changed v3.2.0 source before writing',lambda:require('--provenance-preview' in run(sys.executable,'-B','tools/build.py',success=False).stderr))
    check('preview refuses repository output roots',lambda:require('outside' in run(sys.executable,'-B','tools/build.py','--provenance-preview',success=False).stderr))
    check('preview refuses repository child output roots',lambda:require('outside' in run(sys.executable,'-B','tools/build.py','--provenance-preview','--output-root',str(ROOT/'site/stage4'),success=False).stderr))
    for path in [one,two]:check('development build '+path.name,lambda path=path:run(sys.executable,'-B','tools/build.py','--provenance-preview','--reference-foundation','--output-root',str(path)))
    def repeat():
        for name in files:require((one/name).read_bytes()==(two/name).read_bytes(),name)
    check('both complete development builds are byte-identical',repeat)
    def integrity():
        m=json.loads((one/'build-manifest.json').read_text());old=json.loads((ROOT/'build-manifest.json').read_text())
        require(m['developmentOnly'] is True and m['automaticMatchingAvailable'] is False and m['occurrenceProvenanceVersion']==2)
        require(m['referenceFoundationSHA256']==sha((ROOT/'data/reference-foundation.json').read_bytes()))
        for name,pin in m['embeddedSourcesSHA256'].items():require(pin==sha((ROOT/name).read_bytes()))
        for edition,name in [('standalone',files[0]),('hosted',files[1])]:
            raw=(one/name).read_bytes();text=raw.decode();entry=m[edition]
            require(entry['sha256']==sha(raw) and entry['bytes']==len(raw))
            for tag,key in [('script','scriptHash'),('style','styleHash')]:
                value=re.search('<'+tag+'>([\\s\\S]*?)</'+tag+'>',text).group(1)
                digest=base64.b64encode(hashlib.sha256(value.encode()).digest()).decode()
                require(digest==entry[key] and tag+"-src 'sha256-"+digest+"'" in text)
            require(entry['styleHash']==old[edition]['styleHash'])
            for policy in ["default-src 'none'","connect-src 'none'","img-src 'none'","base-uri 'none'","form-action 'none'","frame-src 'none'"]:require(policy in text)
            require("'unsafe-inline'" not in text and "'unsafe-eval'" not in text)
            require(not re.search(r'<(?:script|link|img)\b[^>]*(?:src|href)\s*=',text,re.I))
            require('const AutomaticLookalikes' not in text)
            for id,path in [('public-suffix-data','data/public-suffix/compiled.json'),('popular-domain-data','data/popular-domains/records.json')]:require(re.search('id="'+id+'">([\\s\\S]*?)</script>',text).group(1)==(ROOT/path).read_text())
        require(m['release']=='3.3.0-stage4-'+m['hosted']['sha256'][:16])
        worker=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',m['release']).replace('@@INDEX_HASH@@',m['hosted']['sha256']);require((one/'site/sw.js').read_text()==worker)
        report['developmentManifest']=m
    check('CSP, complete hashes, style, dormant data and matched worker are consistent',integrity)
    for script in ['embedded-provenance-dom.mjs','embedded.mjs','audit-corrections.mjs']:
        check('current development runtime: '+script,lambda script=script:run('deno','run','--cached-only','--allow-read=.,'+str(one),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+script,'--development-root='+str(one)))
    # Reproduce the unchanged historical build using only a disposable source
    # copy and the two exact approved Git blobs. The real checkout is untouched.
    historical=temp/'historical';historical.mkdir()
    for name in ['src','data','tools']:shutil.copytree(ROOT/name,historical/name,ignore=shutil.ignore_patterns('__pycache__'))
    for name in ['src/embedded.js','src/embedded-ui.js']:(historical/name).write_bytes(baseline(name))
    stable=temp/'stable';stage2=temp/'stage2'
    check('historical source copy still builds approved v3.2.0 offline',lambda:run(sys.executable,'-B',str(historical/'tools/build.py'),'--output-root',str(stable)))
    def stable_bytes():
        for name in files:require((stable/name).read_bytes()==baseline(name),name)
    check('historical complete v3.2.0 artifacts reproduce byte for byte',stable_bytes)
    check('historical Stage 2 source copy builds dormant foundation unchanged',lambda:run(sys.executable,'-B',str(historical/'tools/build.py'),'--reference-foundation','--output-root',str(stage2)))
    def stage2_bytes():
        previous=json.loads((ROOT/'tests/reference-build-results.json').read_text());m=json.loads((stage2/'build-manifest.json').read_text())
        for edition in ['standalone','hosted']:require(m[edition]['sha256']==previous['developmentBuild'][edition]['sha256'])
        require(m['release']==previous['developmentRelease'])
    check('historical Stage 2 preview hashes remain exact',stage2_bytes)
    def untouched():
        for name in files:require((ROOT/name).read_bytes()==public_before[name]==baseline(name),name)
    check('real checkout stable artifacts never changed',untouched)
report['total']={'executed':len(report['checks']),'passed':sum(c['passed'] for c in report['checks']),'failed':len(report['failures'])}
report['scope']='Offline isolated development builds, guarded current Happy DOM execution, and disposable historical source reproduction. No native Firefox, VoiceOver, deployment or release approval.'
(ROOT/'tests/embedded-provenance-build-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2));raise SystemExit(bool(report['failures']))
