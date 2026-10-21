#!/usr/bin/env python3
"""Verifier positive/negative regressions. Mutations exist only in a temporary copy."""
from contextlib import contextmanager
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('release_verifier',ROOT/'tools/verify_release.py')
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
report={'suite':'V3.2.0 release verifier positive and negative cases','groups':{'verification':{'executed':0,'passed':0,'failed':0}},'failures':[],'assertions':{'executed':0,'passed':0,'failed':0}}
def test(name,fn):
    group=report['groups']['verification'];group['executed']+=1;report['assertions']['executed']+=1
    try:fn()
    except Exception as error:
        group['failed']+=1;report['assertions']['failed']+=1;report['failures'].append({'name':name,'error':str(error)})
    else:group['passed']+=1;report['assertions']['passed']+=1

def reject(fn,pattern,errors=(AssertionError,)):
    try:fn()
    except errors as error:
        if not re.search(pattern,str(error)):raise AssertionError('Unexpected rejection: '+str(error))
    else:raise AssertionError('Invalid candidate was accepted')

with tempfile.TemporaryDirectory(prefix='url-inspector-verifier-') as temporary:
    fixture=Path(temporary)/'candidate';fixture.mkdir()
    names=v.inventory_names()
    for name in names:
        target=fixture/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,target)
    (fixture/'SHA256SUMS').write_text(''.join(v.sha((fixture/name).read_bytes())+'  '+name+'\n' for name in sorted(names)))
    expected_release=json.loads((fixture/'build-manifest.json').read_text())['release']
    historical_ref=json.loads((fixture/'tests/audit-correction-source-boundaries.json').read_text())['startingCommit']
    historical_commit=v.git('rev-parse','--verify',historical_ref+'^{commit}')
    projected_commit=v.sha(b'test-only corrected committed snapshot')[:40]
    @contextmanager
    def snapshot_identity(commit,synthetic=False,inventory=None):
        # Project Git identity/cleanliness only; source/artifact checks are unchanged.
        # Corrected snapshots also check the full copied checksum inventory.
        real_git=v.git
        def projected_git(*args,repository=ROOT):
            if args==('rev-parse','HEAD'):return commit
            if synthetic and args in [('rev-parse','--verify',commit+'^{commit}'),('rev-parse','--verify','HEAD^{commit}')]:return commit
            if synthetic and args==('merge-base',v.BASELINE,commit):return v.BASELINE
            if args==('status','--porcelain','--untracked-files=all'):return ''
            if inventory is not None and args==('ls-files','--cached','--others','--exclude-standard'):return '\n'.join(sorted(inventory))
            return real_git(*args,repository=repository)
        with patch.object(v,'git',new=projected_git):yield
    def corrected_classification(result):
        assert result['release']==expected_release
        assert len(result['protectedFilesIdentical'])==12
        assert 'src/core.js' not in result['protectedFilesIdentical']
        assert set(result['reviewedSourceChanges'])=={'src/core.js'}
    @contextmanager
    def changed(name,transform):
        path=fixture/name;original=path.read_bytes()
        try:path.write_bytes(transform(original));yield
        finally:path.write_bytes(original)
    def tamper(name,transform,pattern,checksums=True):
        with changed(name,transform):reject(lambda:v.verify(root=fixture,check_checksums=checksums),pattern)
    def positive():
        result=v.verify(root=fixture)
        assert result['candidateCommit']==v.git('rev-parse','HEAD')!=v.BASELINE and result['checksumsVerified']==len(names)
        corrected_classification(result)
    test('corrected local candidate over the actual HEAD and full inventory',positive)
    test('incorrect explicit candidate commit',lambda:reject(lambda:v.verify(root=fixture,candidate=v.BASELINE),'Candidate identity differs'))
    test('protected reference source tampering',lambda:tamper('src/references.js',lambda b:b+b'\n// tampered\n','Protected baseline changed'))
    test('core tampering outside approved change',lambda:tamper('src/core.js',lambda b:b.replace(b'MAX_INPUT = 32768',b'MAX_INPUT = 32769'),'Protected core changed outside'))
    test('core tampering within approved change',lambda:tamper('src/core.js',lambda b:b.replace(b"slice(1,-1).includes('.')",b"slice(1,-1).includes('-')"),'Audited source boundary changed'))
    test('supplemental source without corresponding artifact',lambda:tamper('src/embedded.js',lambda b:b+b'\n// stale bundle\n','Artifact has stale source'))
    test('standalone artifact byte mismatch',lambda:tamper('standalone/Offline_URL_Inspector.html',lambda b:b+b'\n','Artifact identity mismatch'))
    test('hosted artifact byte mismatch',lambda:tamper('site/index.html',lambda b:b+b'\n','Artifact identity mismatch'))
    def change_manifest(key,value):
        def edit(data):
            manifest=json.loads(data)
            if key=='release':manifest[key]=value
            else:manifest['standalone'][key]=value
            return (json.dumps(manifest)+'\n').encode()
        return edit
    test('manifest CSP hash mismatch',lambda:tamper('build-manifest.json',change_manifest('scriptHash','incorrect'),'CSP hash mismatch'))
    test('manifest release mismatch',lambda:tamper('build-manifest.json',change_manifest('release','3.2.0-incorrect'),'Release identity mismatch'))
    test('worker release/hash mismatch',lambda:tamper('site/sw.js',lambda b:b+b'\n','Worker differs beyond build identity'))
    test('inconsistent checksum digest',lambda:tamper('SHA256SUMS',lambda b:b'0'*64+b[64:],'Checksum mismatch'))
    test('missing checksum inventory entry',lambda:tamper('SHA256SUMS',lambda b:b.split(b'\n',1)[1],'Checksum inventory differs'))
    test('duplicate checksum inventory entry',lambda:tamper('SHA256SUMS',lambda b:b+b.splitlines(keepends=True)[0],'Duplicate checksum'))
    def missing_metadata():
        path=fixture/'tests/audit-correction-source-boundaries.json';original=path.read_bytes()
        try:
            path.unlink()
            reject(lambda:v.verify(root=fixture),'audit-correction-source-boundaries.json',errors=(FileNotFoundError,))
        finally:path.write_bytes(original)
    test('missing required correction metadata',missing_metadata)
    def inconsistent_metadata(data):
        metadata=json.loads(data);metadata['files']['src/core.js']['baselineSHA256']='0'*64
        return (json.dumps(metadata)+'\n').encode()
    test('inconsistent correction metadata',lambda:tamper('tests/audit-correction-source-boundaries.json',inconsistent_metadata,'Core exception baseline mismatch'))
    # This is explicitly historical, so follow its recorded original revision,
    # never moving HEAD. It remains the 13-unchanged-source case after a commit.
    def historical_snapshot():
        manifest=json.loads(subprocess.check_output(['git','show',historical_commit+':build-manifest.json'],cwd=ROOT))
        files=set()
        files.update(['build-manifest.json','src/core.js','src/references.js','src/presentation.js','src/hosted.js','src/sw.js','src/base.css','src/v3.css','data/unicode-data.json','data/LICENSE.txt','deno.lock','.github/workflows/deploy-pages.yml','tests/cases.json','tests/ascii-cases.json','src/embedded.js','src/embedded-ui.js','src/ui.js','src/embedded.css','standalone/Offline_URL_Inspector.html','site/index.html','site/sw.js'])
        snapshot=Path(temporary)/'committed';snapshot.mkdir()
        for name in files:
            path=snapshot/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(subprocess.check_output(['git','show',historical_commit+':'+name],cwd=ROOT))
        with snapshot_identity(historical_commit):
            result=v.verify(root=snapshot,candidate=historical_commit,check_checksums=False)
        assert result['candidateCommit']==historical_commit and not result['workingTreeHasChanges']
        assert result['release']==manifest['release'] and len(result['protectedFilesIdentical'])==13
        assert result['reviewedSourceChanges']=={}
    test('pinned historical pre-correction source/artifacts',historical_snapshot)
    def corrected_committed_snapshot():
        actual_head=v.git('rev-parse','HEAD')
        with snapshot_identity(projected_commit,synthetic=True,inventory=names):
            result=v.verify(root=fixture,candidate=projected_commit)
        assert result['candidateCommit']==projected_commit!=actual_head
        assert not result['workingTreeHasChanges'] and result['checksumsVerified']==len(names)
        corrected_classification(result)
    test('corrected candidate as a clean future committed snapshot with complete metadata',corrected_committed_snapshot)

report['total']=dict(report['groups']['verification'])
report['snapshotCoverage']={'historicalCommit':historical_commit,'historicalUnchangedProtectedFiles':13,'correctedUnchangedProtectedFiles':12,'correctedReviewedSourceChanges':['src/core.js'],'correctedCommitSimulation':'Clean projected Git metadata and copied corrected files; no commit created; full checksum checking enabled.'}
report['scope']='Actual verifier execution; negative mutations occur only in a disposable directory. Historical files come from a pinned real Git revision and exercise source/artifact checks without checksum inventory. Corrected local and simulated clean-commit snapshots include full checksum verification. Git metadata alone is projected for snapshot identity; protected-source checks are unchanged. No repository commits, branches, or files are tampered with.'
(ROOT/'tests/release-verifier-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
raise SystemExit(bool(report['failures']))
