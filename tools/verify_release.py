#!/usr/bin/env python3
"""Verify the local 3.2.0 candidate; optionally refresh its normal checksum inventory.

Does not execute application code, change Git state, or publish anything.
Run after tests, documentation, screenshots and build artifacts have settled.
"""
import argparse
import base64
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT=Path(__file__).resolve().parents[1]
BASELINE='d9aed1dc333bb51d2126fa79059a839292b36615'
def git(*args): return subprocess.check_output(['git',*args],cwd=ROOT,text=True).strip()
def sha(data): return hashlib.sha256(data).hexdigest()
def verify():
    assert git('rev-parse','main')==BASELINE, 'Stable main moved'
    assert git('rev-parse','HEAD')==BASELINE, 'Candidate was committed or rebased'
    assert git('branch','--show-current')=='dev/v3.2.0-embedded-url-analysis', 'Unexpected candidate branch'
    manifest=json.loads((ROOT/'build-manifest.json').read_text())
    assert manifest['release'].startswith('3.2.0-')
    protected=['src/core.js','src/references.js','src/presentation.js','src/hosted.js','src/sw.js','src/base.css','src/v3.css','data/unicode-data.json','data/LICENSE.txt','deno.lock','.github/workflows/deploy-pages.yml','tests/cases.json','tests/ascii-cases.json']
    for name in protected:
        original=subprocess.check_output(['git','show',BASELINE+':'+name],cwd=ROOT)
        assert (ROOT/name).read_bytes()==original, 'Protected baseline changed: '+name
    artifacts={}
    for edition,name in [('standalone','standalone/Offline_URL_Inspector.html'),('hosted','site/index.html')]:
        data=(ROOT/name).read_bytes();html=data.decode();entry=manifest[edition]
        assert sha(data)==entry['sha256'] and len(data)==entry['bytes'], 'Artifact identity mismatch'
        for tag,key in [('script','scriptHash'),('style','styleHash')]:
            text=re.search(r'<'+tag+r'>([\s\S]*?)</'+tag+'>',html).group(1)
            digest=base64.b64encode(hashlib.sha256(text.encode()).digest()).decode()
            assert digest==entry[key] and tag+"-src 'sha256-"+digest+"'" in html, 'CSP hash mismatch'
        shared='\n'.join((ROOT/'src'/file).read_text() for file in ['core.js','references.js','presentation.js','embedded.js','embedded-ui.js','ui.js'])
        shared=shared.replace('@@LICENSE@@',json.dumps((ROOT/'data/LICENSE.txt').read_text(),ensure_ascii=True))
        program="'use strict';\nconst APP=Object.freeze("+json.dumps({'id':'offline-url-inspector','version':'3.2.0','edition':edition},separators=(',',':'))+');\n'+shared
        if edition=='hosted':program+='\n'+(ROOT/'src/hosted.js').read_text()
        assert re.search(r'<script>([\s\S]*?)</script>',html).group(1)==program, 'Artifact has stale source'
        assert re.search(r'<style>([\s\S]*?)</style>',html).group(1)=='\n'.join((ROOT/'src'/file).read_text() for file in ['base.css','v3.css','embedded.css']), 'Artifact has stale stylesheet'
        for directive in ["default-src 'none'","connect-src 'none'","base-uri 'none'","form-action 'none'","img-src 'none'","frame-src 'none'"]:
            assert directive in html, 'Missing CSP boundary'
        assert "'unsafe-inline'" not in html and "'unsafe-eval'" not in html
        assert ("worker-src 'none'" if edition=='standalone' else "worker-src 'self'") in html
        assert not re.search(r'\b(?:src|href|action)\s*=',html[:html.index('<script type=')],re.I)
        assert 'Version 3.2.0' in html
        artifacts[name]={'sha256':sha(data),'bytes':len(data)}
    worker=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',manifest['release']).replace('@@INDEX_HASH@@',manifest['hosted']['sha256'])
    assert (ROOT/'site/sw.js').read_text()==worker, 'Worker differs beyond build identity'
    assert sha((ROOT/'data/unicode-data.json').read_bytes())==manifest['unicodeDataSHA256']
    return {'applicationVersion':'3.2.0','baseline':BASELINE,'branch':git('branch','--show-current'),'head':git('rev-parse','HEAD'),'release':manifest['release'],'protectedFilesIdentical':protected,'artifacts':artifacts,'workerBehaviorUnchanged':True,'CSPVerified':True,'scope':'Local artifact integrity and immutable baseline source verification; not publication or native-browser certification.'}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh-checksums',action='store_true')
    args=parser.parse_args();report=verify()
    if args.refresh_checksums:
        (ROOT/'tests/release-checks.json').write_text(json.dumps(report,indent=2)+'\n')
        names=sorted(set(git('ls-files','--cached','--others','--exclude-standard').splitlines())-{'SHA256SUMS'})
        assert all((ROOT/name).is_file() and not (ROOT/name).is_symlink() for name in names)
        (ROOT/'SHA256SUMS').write_text(''.join(sha((ROOT/name).read_bytes())+'  '+name+'\n' for name in names))
    entries=(ROOT/'SHA256SUMS').read_text().splitlines()
    for line in entries:
        digest,name=line.split(maxsplit=1)
        assert sha((ROOT/name).read_bytes())==digest, 'Checksum mismatch: '+name
    print(json.dumps({'release':report['release'],'checksumsVerified':len(entries),'protectedFilesIdentical':len(report['protectedFilesIdentical']),'artifacts':report['artifacts']},indent=2))
if __name__=='__main__':main()
