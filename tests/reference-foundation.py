#!/usr/bin/env python3
"""Stage 2 bounded build/data checks. All mutations and builds use temporary roots."""
import base64
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from reference_assets import validate,license_bundle
from extract_majestic import extract,EXPECTED_FIELDS
import csv
import io

report={'suite':'v3.3.0 Stage 2 bounded build and input integrity','tests':[],'failures':[]}
def sha(value):return hashlib.sha256(value).hexdigest()
def run(*args):
    result=subprocess.run(args,cwd=ROOT,text=True,capture_output=True)
    if result.returncode:raise AssertionError(result.stdout+result.stderr)
    return result.stdout
def test(name,fn):
    try:fn();report['tests'].append({'name':name,'passed':True})
    except Exception as e:report['tests'].append({'name':name,'passed':False});report['failures'].append({'name':name,'error':str(e)})
def require(value,message='Assertion failed'):
    if not value:raise AssertionError(message)
def rejects(fn):
    try:fn()
    except (ValueError,KeyError,AssertionError,FileNotFoundError,UnicodeError):return
    raise AssertionError('Expected rejection')

with tempfile.TemporaryDirectory(prefix='oui-stage2-build-',dir='/private/tmp') as directory:
    temp=Path(directory);ordinary=temp/'ordinary';one=temp/'one';two=temp/'two'
    test('offline generation exactly verifies current approved assets',lambda:run('deno','run','--cached-only','--allow-read=.','tools/generate_reference_data.mjs','--check'))
    for name in ['a','b']:
        test('repeat generation '+name,lambda name=name:run('deno','run','--cached-only','--allow-read=.','--allow-write='+str(temp/name),'tools/generate_reference_data.mjs','--write','--output-root',str(temp/name)))
    def repeat():
        for name in ['data/reference-foundation.json','data/public-suffix/compiled.json','data/popular-domains/records.json','data/popular-domains/provenance.json']:
            require((temp/'a'/name).read_bytes()==(temp/'b'/name).read_bytes()==(ROOT/name).read_bytes(),name)
    test('two independent generation roots produce identical bytes',repeat)
    test('ordinary build creates original v3.2 bytes in an isolated root',lambda:run(sys.executable,'-B','tools/build.py','--output-root',str(ordinary)))
    def unchanged():
        for name in ['standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js','site/.nojekyll','build-manifest.json']:
            expected=subprocess.check_output(['git','--no-optional-locks','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:'+name],cwd=ROOT)
            require((ordinary/name).read_bytes()==expected,name)
    test('ordinary build/artifacts/worker/manifest remain byte-identical to approved v3.2',unchanged)
    for path in [one,two]:test('development build '+path.name,lambda path=path:run(sys.executable,'-B','tools/build.py','--reference-foundation','--output-root',str(path)))
    def builds_repeat():
        for name in ['standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js','site/.nojekyll','build-manifest.json']:require((one/name).read_bytes()==(two/name).read_bytes(),name)
    test('development builds are deterministic',builds_repeat)
    def inspect_build():
        manifest=json.loads((one/'build-manifest.json').read_text());base=json.loads((ROOT/'build-manifest.json').read_text())
        require(manifest['developmentOnly'] is True and manifest['automaticMatchingAvailable'] is False)
        measurements={}
        for edition,name in [('standalone','standalone/Offline_URL_Inspector.html'),('hosted','site/index.html')]:
            value=(one/name).read_bytes();html=value.decode();entry=manifest[edition]
            require(sha(value)==entry['sha256'] and len(value)==entry['bytes'])
            for tag,key in [('script','scriptHash'),('style','styleHash')]:
                text=re.search('<'+tag+'>([\\s\\S]*?)</'+tag+'>',html).group(1)
                digest=base64.b64encode(hashlib.sha256(text.encode()).digest()).decode();require(digest==entry[key] and tag+"-src 'sha256-"+digest+"'" in html)
            require(entry['styleHash']==base[edition]['styleHash'])
            for policy in ["default-src 'none'","connect-src 'none'","img-src 'none'","base-uri 'none'","form-action 'none'","frame-src 'none'"]:require(policy in html)
            require("'unsafe-inline'" not in html and "'unsafe-eval'" not in html)
            require(("worker-src 'self'" if edition=='hosted' else "worker-src 'none'") in html)
            require(not re.search(r'<(?:script|link|img)\b[^>]*(?:src|href)\s*=',html,re.I))
            for id,name in [('public-suffix-data','data/public-suffix/compiled.json'),('popular-domain-data','data/popular-domains/records.json')]:require(re.search('id="'+id+'">([\\s\\S]*?)</script>',html).group(1)==(ROOT/name).read_text())
            legal=json.loads(re.search('id="reference-licenses">([\\s\\S]*?)</script>',html).group(1));require('Mozilla Public License' in legal['mplLicense']);require('CC-BY-3.0' in legal['majesticNotice']);require('MPL-2.0' in legal['pslNotice'])
            require('sourceRows' not in html and 'GlobalRank,Domain\n' not in html)
            measurements[edition]={'bytes':len(value),'growthBytes':len(value)-base[edition]['bytes'],'sha256':sha(value)}
        require(manifest['release']=='3.3.0-stage2-'+manifest['hosted']['sha256'][:16])
        expected=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',manifest['release']).replace('@@INDEX_HASH@@',manifest['hosted']['sha256'])
        require((one/'site/sw.js').read_text()==expected)
        report['developmentBuild']=measurements;report['developmentRelease']=manifest['release'];report['referenceManifestSHA256']=manifest['referenceFoundationSHA256']
    test('both editions preserve CSP/self-containment and matched worker integrity',inspect_build)
    test('development mode refuses repository release paths',lambda:rejects(lambda:run(sys.executable,'-B','tools/build.py','--reference-foundation')))
    # Run trusted generated code under the existing cached DOM test dependency.
    def dom():
        output=run('deno','run','--cached-only','--allow-read=.,'+str(one),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/reference-build.mjs',str(one));require('"failed": 0' in output)
    test('both development editions preserve inspection/reference/UI behavior',dom)
    fixture=temp/'fixture';fixture.mkdir()
    names=['data/reference-foundation.json','data/popular-domains/source.json','data/popular-domains/source.csv','data/popular-domains/NOTICE.txt','data/public-suffix/source.json','data/public-suffix/public_suffix_list.dat','data/public-suffix/test_psl.txt','data/public-suffix/NOTICE.txt','data/public-suffix/LICENSE.txt','data/unicode-data.json','tools/generate_reference_data.mjs','tools/reference_data_lib.mjs','tools/extract_majestic.py','src/domain-boundaries.js','src/reference-data.js','src/core.js',*validate(ROOT)[0]['assets']]
    for name in names:
        dest=fixture/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,dest)
    test('independent bounded validator accepts complete copied assets',lambda:validate(fixture))
    for name in ['data/public-suffix/compiled.json','data/popular-domains/records.json','data/popular-domains/provenance.json','data/popular-domains/source.csv','data/public-suffix/LICENSE.txt','data/popular-domains/NOTICE.txt','src/domain-boundaries.js']:
        def negative(name=name):
            path=fixture/name;original=path.read_bytes();path.write_bytes(original+b' ')
            try:rejects(lambda:validate(fixture))
            finally:path.write_bytes(original)
        test('reject modified '+name,negative)
    def missing():
        path=fixture/'data/public-suffix/compiled.json';original=path.read_bytes();path.unlink()
        try:rejects(lambda:validate(fixture))
        finally:path.write_bytes(original)
    test('reject missing compiled data',missing)
    def metadata():
        path=fixture/'data/popular-domains/source.json';original=path.read_bytes();data=json.loads(original);data['provider']='other';path.write_text(json.dumps(data))
        try:rejects(lambda:validate(fixture))
        finally:path.write_bytes(original)
    test('reject source/provider metadata drift',metadata)
    def path_traversal():
        path=fixture/'data/reference-foundation.json';original=path.read_bytes();data=json.loads(original);data['assets']['../escape']={'bytes':0,'sha256':'0'*64};path.write_text(json.dumps(data))
        try:rejects(lambda:validate(fixture))
        finally:path.write_bytes(original)
    test('reject unexpected asset paths before access',path_traversal)
    # Small local fixtures isolate extraction checks without downloading anything.
    text=io.StringIO(newline='');writer=csv.writer(text,lineterminator='\n');writer.writerow(EXPECTED_FIELDS)
    for i,host in enumerate(['one.com','two.com','three.com'],1):writer.writerow([i,i,host,'com',1,1,host,'com',i,i,1,1])
    raw=text.getvalue().encode();path=temp/'tiny.csv';path.write_bytes(raw);subset=b'GlobalRank,Domain\n1,one.com\n2,two.com\n3,three.com\n';identity={'original':{'bytes':len(raw),'sha256':sha(raw),'rows':3},'subset':{'bytes':len(subset),'sha256':sha(subset)}}
    test('extractor preserves original fields/ranks in a validated fixture',lambda:require(extract(path,identity)==subset))
    def truncated():
        changed=json.loads(json.dumps(identity));changed['original']['rows']=4;rejects(lambda:extract(path,changed))
    test('extractor rejects internally hashed but incomplete original rows',truncated)
    def hash_mismatch():
        changed=json.loads(json.dumps(identity));changed['original']['sha256']='0'*64;rejects(lambda:extract(path,changed))
    test('extractor rejects a different original snapshot',hash_mismatch)
    def candidate_rejection(options,message):
        result=subprocess.run([sys.executable,'-B','tools/extract_majestic.py',str(path),*options],cwd=ROOT,text=True,capture_output=True)
        require(result.returncode!=0 and message in result.stderr,result.stdout+result.stderr)
        require(not (temp/'candidate').exists())
    candidate=['--candidate-dir',str(temp/'candidate')]
    test('candidate refresh requires an explicit original checksum',lambda:candidate_rejection(candidate+['--retrieved-at','2026-10-21T00:00:00+00:00'],'explicit expected source hash'))
    test('candidate refresh refuses repository output paths',lambda:candidate_rejection(['--candidate-dir',str(ROOT/'data/unapproved-candidate'),'--expected-original-sha256',sha(raw),'--retrieved-at','2026-10-21T00:00:00+00:00'],'outside directory'))
    test('candidate refresh requires a timezone',lambda:candidate_rejection(candidate+['--expected-original-sha256',sha(raw),'--retrieved-at','2026-10-21T00:00:00'],'needs a timezone'))
    test('candidate refresh validates the complete original hash',lambda:candidate_rejection(candidate+['--expected-original-sha256','0'*64,'--retrieved-at','2026-10-21T00:00:00+00:00'],'differs from reviewed identity'))

passed=sum(x['passed'] for x in report['tests']);report['total']={'executed':len(report['tests']),'passed':passed,'failed':len(report['tests'])-passed};report['scope']='Offline data/build execution, controlled copied-input negatives and cached DOM simulations; not native Firefox or release certification.'
(ROOT/'tests/reference-build-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2));raise SystemExit(bool(report['failures']))
