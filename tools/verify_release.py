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
def git(*args,repository=ROOT):
    return subprocess.check_output(['git','--no-optional-locks',*args],cwd=repository,text=True).strip()
def sha(data): return hashlib.sha256(data).hexdigest()
def inventory_names(repository=ROOT):
    return set(git('ls-files','--cached','--others','--exclude-standard',repository=repository).splitlines())-{'SHA256SUMS'}

def verify_checksums(root=ROOT,repository=ROOT):
    entries=(root/'SHA256SUMS').read_text().splitlines()
    names=[]
    for line in entries:
        digest,name=line.split(maxsplit=1)
        assert re.fullmatch('[0-9a-f]{64}',digest), 'Invalid checksum syntax'
        assert not Path(name).is_absolute() and '..' not in Path(name).parts, 'Unsafe checksum path'
        assert (root/name).is_file() and not (root/name).is_symlink(), 'Invalid checksum file: '+name
        assert sha((root/name).read_bytes())==digest, 'Checksum mismatch: '+name
        names.append(name)
    assert len(names)==len(set(names)), 'Duplicate checksum entries'
    assert set(names)==inventory_names(repository), 'Checksum inventory differs from repository files'
    return len(entries)

def verify(root=ROOT,repository=ROOT,candidate='HEAD',check_checksums=True):
    assert git('rev-parse','main',repository=repository)==BASELINE, 'Stable main moved'
    head=git('rev-parse','HEAD',repository=repository)
    candidate_commit=git('rev-parse','--verify',candidate+'^{commit}',repository=repository)
    assert head==candidate_commit, 'Candidate identity differs from checked-out HEAD'
    assert git('merge-base',BASELINE,candidate_commit,repository=repository)==BASELINE, 'Candidate does not descend from stable baseline'
    assert git('branch','--show-current',repository=repository)=='dev/v3.2.0-embedded-url-analysis', 'Unexpected candidate branch'
    manifest=json.loads((root/'build-manifest.json').read_text())
    assert manifest['release']=='3.2.0-'+manifest['hosted']['sha256'][:16], 'Release identity mismatch'
    protected=['src/core.js','src/references.js','src/presentation.js','src/hosted.js','src/sw.js','src/base.css','src/v3.css','data/unicode-data.json','data/LICENSE.txt','deno.lock','.github/workflows/deploy-pages.yml','tests/cases.json','tests/ascii-cases.json']
    identical=[];reviewed={}
    for name in protected:
        original=subprocess.check_output(['git','--no-optional-locks','show',BASELINE+':'+name],cwd=repository)
        current=(root/name).read_bytes()
        if current==original:
            identical.append(name);continue
        assert name=='src/core.js', 'Protected baseline changed: '+name
        # The only authorized core exception is the exact recorded preprocessing edit.
        restored=current.decode();change=json.loads((root/'tests/audit-correction-source-boundaries.json').read_text())['files'][name]
        assert change['baselineSHA256']==sha(original), 'Core exception baseline mismatch'
        for pair in reversed(change['replacements']):
            assert pair['current'] and restored.count(pair['current'])==1, 'Audited source boundary changed: '+name
            restored=restored.replace(pair['current'],pair['baseline'],1)
        assert restored.encode()==original, 'Protected core changed outside reviewed preprocessing correction'
        reviewed[name]={'baselineSHA256':sha(original),'currentSHA256':sha(current)}
    artifacts={}
    for edition,name in [('standalone','standalone/Offline_URL_Inspector.html'),('hosted','site/index.html')]:
        data=(root/name).read_bytes();html=data.decode();entry=manifest[edition]
        assert sha(data)==entry['sha256'] and len(data)==entry['bytes'], 'Artifact identity mismatch'
        for tag,key in [('script','scriptHash'),('style','styleHash')]:
            text=re.search(r'<'+tag+r'>([\s\S]*?)</'+tag+'>',html).group(1)
            digest=base64.b64encode(hashlib.sha256(text.encode()).digest()).decode()
            assert digest==entry[key] and tag+"-src 'sha256-"+digest+"'" in html, 'CSP hash mismatch'
        shared='\n'.join((root/'src'/file).read_text() for file in ['core.js','references.js','presentation.js','embedded.js','embedded-ui.js','ui.js'])
        shared=shared.replace('@@LICENSE@@',json.dumps((root/'data/LICENSE.txt').read_text(),ensure_ascii=True))
        program="'use strict';\nconst APP=Object.freeze("+json.dumps({'id':'offline-url-inspector','version':'3.2.0','edition':edition},separators=(',',':'))+');\n'+shared
        if edition=='hosted':program+='\n'+(root/'src/hosted.js').read_text()
        assert re.search(r'<script>([\s\S]*?)</script>',html).group(1)==program, 'Artifact has stale source'
        assert re.search(r'id="unicode-data">([\s\S]*?)</script>',html).group(1)==(root/'data/unicode-data.json').read_text(), 'Artifact has stale Unicode data'
        assert re.search(r'<style>([\s\S]*?)</style>',html).group(1)=='\n'.join((root/'src'/file).read_text() for file in ['base.css','v3.css','embedded.css']), 'Artifact has stale stylesheet'
        for directive in ["default-src 'none'","connect-src 'none'","base-uri 'none'","form-action 'none'","img-src 'none'","frame-src 'none'"]:
            assert directive in html, 'Missing CSP boundary'
        assert "'unsafe-inline'" not in html and "'unsafe-eval'" not in html
        assert ("worker-src 'none'" if edition=='standalone' else "worker-src 'self'") in html
        assert not re.search(r'\b(?:src|href|action)\s*=',html[:html.index('<script type=')],re.I)
        assert 'Version 3.2.0' in html
        artifacts[name]={'sha256':sha(data),'bytes':len(data)}
    worker=(root/'src/sw.js').read_text().replace('@@RELEASE@@',manifest['release']).replace('@@INDEX_HASH@@',manifest['hosted']['sha256'])
    assert (root/'site/sw.js').read_text()==worker, 'Worker differs beyond build identity'
    assert sha((root/'data/unicode-data.json').read_bytes())==manifest['unicodeDataSHA256']
    checksums=verify_checksums(root,repository) if check_checksums else None
    return {'applicationVersion':'3.2.0','baseline':BASELINE,'branch':git('branch','--show-current',repository=repository),'head':head,'candidateCommit':candidate_commit,'workingTreeHasChanges':bool(git('status','--porcelain','--untracked-files=all',repository=repository)),'release':manifest['release'],'protectedFilesIdentical':identical,'reviewedSourceChanges':reviewed,'checksumsVerified':checksums,'artifacts':artifacts,'workerBehaviorUnchanged':True,'CSPVerified':True,'scope':'Local artifact integrity and immutable baseline source verification; not publication or native-browser certification.'}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    mode=parser.add_mutually_exclusive_group()
    mode.add_argument('--candidate-root',type=Path,help='Verify an outside-repository v3.3.0 RC instead of the historical v3.2.0 candidate')
    mode.add_argument('--release-root',type=Path,help='Verify an outside-repository final v3.3.0 build; reject RC identity, no publication authorization')
    parser.add_argument('--refresh-checksums',action='store_true')
    parser.add_argument('--candidate',default='HEAD',help='Expected checked-out commit/ref; local corrections are reported separately')
    args=parser.parse_args()
    if args.candidate_root or args.release_root:
        if args.refresh_checksums or args.candidate!='HEAD':parser.error('Outside build verification cannot refresh historical checksums or assert a working-tree commit identity')
        from release_candidate import verify as verify_candidate
        print(json.dumps(verify_candidate(ROOT,args.release_root or args.candidate_root,final_release=bool(args.release_root)),indent=2));return
    report=verify(candidate=args.candidate,check_checksums=not args.refresh_checksums)
    if args.refresh_checksums:
        names=sorted(inventory_names())
        report['checksumsVerified']=len(names)
        (ROOT/'tests/release-checks.json').write_text(json.dumps(report,indent=2)+'\n')
        assert all((ROOT/name).is_file() and not (ROOT/name).is_symlink() for name in names)
        (ROOT/'SHA256SUMS').write_text(''.join(sha((ROOT/name).read_bytes())+'  '+name+'\n' for name in names))
    count=verify_checksums()
    print(json.dumps({'release':report['release'],'candidateCommit':report['candidateCommit'],'workingTreeHasChanges':report['workingTreeHasChanges'],'checksumsVerified':count,'protectedFilesIdentical':len(report['protectedFilesIdentical']),'reviewedSourceChanges':report['reviewedSourceChanges'],'artifacts':report['artifacts']},indent=2))
if __name__=='__main__':main()
