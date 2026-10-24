#!/usr/bin/env python3
"""Final/RC separation, real packaging mutations and preserved update contracts."""
import argparse,hashlib,json,pathlib,re,shutil,subprocess,sys,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from release_candidate import verify,OUTPUTS,INPUTS,ARTIFACTS,FINAL_VERSION,RUNTIME
sha=lambda raw:hashlib.sha256(raw).hexdigest()
ACCEPTED='f41c5e391619bb73176168045e9c7aaef93410dc'
STABLE='664cc58bf67a2127d0523adec9f1d80c6edd656e'
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--task-root',type=pathlib.Path,required=True)
p.add_argument('--deno',type=pathlib.Path,required=True)
a=p.parse_args();out=a.task_root.resolve()
assert out!=ROOT and ROOT not in out.parents,'Test output must be outside repository'
out.mkdir(parents=True,exist_ok=True)
assert not any(out.iterdir()),'Use a fresh empty test output directory'
report={'suite':'Final version promotion isolation and rejection','checks':[],'failures':[]}
def check(name,fn):
    try:
        evidence=fn();report['checks'].append({'name':name,'passed':True,'evidence':evidence});print('PASS '+name,flush=True)
    except Exception as error:
        report['checks'].append({'name':name,'passed':False,'error':str(error)});report['failures'].append(name);print('FAIL '+name+': '+str(error),flush=True)
def run(args,*,cwd=ROOT,ok=True):
    result=subprocess.run([str(x) for x in args],cwd=cwd,capture_output=True,text=True)
    assert (result.returncode==0)==ok,(args,result.returncode,(result.stdout+result.stderr)[-4000:])
    return {'exitCode':result.returncode,'output':(result.stdout+result.stderr)[-1500:]}
def build(mode,destination,*,cwd=ROOT,ok=True):
    return run(['python3','-B',cwd/'tools/build.py',mode,'--output-root',destination],cwd=cwd,ok=ok)
for name,mode in [('one','--final-release'),('two','--final-release'),('rc','--release-candidate')]:
    build(mode,out/name)
def double_build():
    for name in OUTPUTS:assert (out/'one'/name).read_bytes()==(out/'two'/name).read_bytes(),name
    return verify(ROOT,out/'one',final_release=True)
check('final double build exact eight-file determinism and source correspondence',double_build)
check('separate RC path still builds and verifies',lambda:verify(ROOT,out/'rc'))
def runtime_equivalence():
    for edition,name in [('hosted','site/index.html'),('standalone','standalone/Offline_URL_Inspector.html')]:
        final=(out/'one'/name).read_text();rc=(out/'rc'/name).read_text()
        program=lambda html:re.search(r'<script>([\s\S]*?)</script>',html).group(1)
        assert program(final).replace('"version":"3.3.0"','"version":"3.3.0-rc.1"',1)==program(rc),edition
        assert re.search(r'<style>([\s\S]*?)</style>',final).group(1)==re.search(r'<style>([\s\S]*?)</style>',rc).group(1),edition
        inert=lambda html:{i:body for i,body in re.findall(r'<script type="application/json" id="([^"]+)">([\s\S]*?)</script>',html) if i!='reference-licenses'}
        assert inert(final)==inert(rc),edition
        legal=json.loads(re.search(r'id="reference-licenses">([\s\S]*?)</script>',final).group(1))
        for source in ['data/public-suffix/public_suffix_list.dat','data/public-suffix/compiled.json','src/domain-boundaries.js','tools/generate_reference_data.mjs','tools/reference_data_lib.mjs']:
            assert '\n===== '+source+' =====\n'+(ROOT/source).read_text() in legal['sourceAvailability'],source
    return {'editions':2,'executableDifference':'APP version only','stylesAndRuntimeDataIdentical':True,'exactOfflinePSLSourcesPreserved':True}
check('final executable differs from RC only in APP version; styles/data/source notices preserved',runtime_equivalence)
def reject_mode(path,final):
    try:verify(ROOT,path,final_release=final)
    except ValueError as error:
        assert 'version/status' in str(error);return str(error)
    raise AssertionError('Opposite release mode accepted')
check('final verifier rejects RC',lambda:reject_mode(out/'rc',True))
check('RC verifier rejects final',lambda:reject_mode(out/'one',False))
check('final CLI rejects RC',lambda:run(['python3','-B','tools/verify_release.py','--release-root',out/'rc'],ok=False))
check('RC CLI rejects final',lambda:run(['python3','-B','tools/verify_release.py','--candidate-root',out/'one'],ok=False))
check('build rejects simultaneous RC and final flags',lambda:run(['python3','-B','tools/build.py','--release-candidate','--final-release','--output-root',out/'invalid-mode'],ok=False))
check('final verification cannot rewrite historical checksums',lambda:run(['python3','-B','tools/verify_release.py','--release-root',out/'one','--refresh-checksums'],ok=False))
check('final build rejects repository output',lambda:build('--final-release',ROOT,ok=False))
check('final build refuses stale output',lambda:build('--final-release',out/'one',ok=False))
def reseal(dest):
    m=json.loads((dest/'build-manifest.json').read_text())
    m['artifacts']={n:{'sha256':sha((dest/n).read_bytes()),'bytes':(dest/n).stat().st_size} for n in ARTIFACTS}
    (dest/'build-manifest.json').write_text(json.dumps(m,indent=2)+'\n')
    (dest/'SHA256SUMS').write_text(''.join(sha((dest/n).read_bytes())+'  '+n+'\n' for n in sorted(OUTPUTS-{'SHA256SUMS'})))
def change_json(path,fn):
    value=json.loads(path.read_text());fn(value);path.write_text(json.dumps(value,indent=2)+'\n')
def reject(mutate,reason,*,base='one',resealed=True):
    with tempfile.TemporaryDirectory(prefix='oui-final-negative-') as folder:
        dest=pathlib.Path(folder)/'build';shutil.copytree(out/base,dest);mutate(dest)
        if resealed:reseal(dest)
        try:verify(ROOT,dest,final_release=True)
        except ValueError as error:
            assert reason in str(error),str(error);return {'rejection':str(error),'checksumsRecomputed':resealed}
        raise AssertionError('Invalid final build accepted')
check('forged publication authorization rejected',lambda:reject(lambda d:change_json(d/'build-manifest.json',lambda m:m.update(publicationAuthorized=True)),'authorization'))
check('development-only final rejected',lambda:reject(lambda d:change_json(d/'build-manifest.json',lambda m:m.update(developmentOnly=True)),'final release version/status'))
check('missing preparation-only declaration rejected',lambda:reject(lambda d:change_json(d/'build-manifest.json',lambda m:m.pop('releasePreparationOnly')),'final release version/status'))
def relabel_rc(dest):
    def edit(m):
        m.pop('candidateVersion');m.update(releaseVersion=FINAL_VERSION,buildKind='final',releaseCandidate=False,developmentOnly=False,releasePreparationOnly=True,release=FINAL_VERSION+'-'+m['hosted']['sha256'][:16])
    change_json(dest/'build-manifest.json',edit)
check('renamed RC with forged final manifest/checksums rejected',lambda:reject(relabel_rc,'visible application version',base='rc'))
check('unreviewed source digest rejected',lambda:reject(lambda d:change_json(d/'build-manifest.json',lambda m:m['sourceIdentity'].update(inputsSHA256='0'*64)),'source digest mismatch'))
check('unapproved runtime metadata rejected',lambda:reject(lambda d:change_json(d/'build-manifest.json',lambda m:m['generatorRuntime'].update(deno='2.9.8')),'generator runtime'))
check('mixed RC worker with recalculated checksums rejected',lambda:reject(lambda d:shutil.copy2(out/'rc/site/sw.js',d/'site/sw.js'),'Worker release/hash/source mismatch'))
check('unexpected deployment asset rejected',lambda:reject(lambda d:(d/'site/debug.js').write_text('debug'),'Distribution inventory mismatch'))
check('missing source archive rejected',lambda:reject(lambda d:(d/'source-materials.zip').unlink(),'Distribution inventory mismatch',resealed=False))
def symlink(dest):
    path=dest/'site/.nojekyll';path.unlink();path.symlink_to(out/'one/site/.nojekyll')
check('symlink in distribution rejected',lambda:reject(symlink,'Symlink in candidate'))
def duplicate(dest):
    path=dest/'SHA256SUMS';path.write_text(path.read_text()+path.read_text().splitlines()[0]+'\n')
check('duplicate checksum rejected',lambda:reject(duplicate,'duplicate checksum',resealed=False))
check('altered notice with recalculated inventories rejected',lambda:reject(lambda d:(d/'NOTICES.txt').write_text('Incomplete notices\n'),'Source-to-artifact mismatch'))
def reject_source(mutate,reason):
    with tempfile.TemporaryDirectory(prefix='oui-final-source-negative-') as folder:
        source=pathlib.Path(folder)/'source'
        for name in INPUTS:
            target=source/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/name,target)
        mutate(source)
        evidence=build('--final-release',pathlib.Path(folder)/'final',cwd=source,ok=False)
        assert reason in evidence['output'],evidence
        return evidence
check('final rejects missing bundled index',lambda:reject_source(lambda s:(s/'data/lookalikes/index.json').unlink(),'index.json'))
check('final rejects corrupted bundled index',lambda:reject_source(lambda s:(s/'data/lookalikes/index.json').write_text('{}'),'index integrity mismatch'))
check('final rejects missing legal notice',lambda:reject_source(lambda s:(s/'data/public-suffix/NOTICE.txt').unlink(),'NOTICE.txt'))
check('final rejects truncated source subset',lambda:reject_source(lambda s:(s/'data/popular-domains/source.csv').write_text('truncated'),'mismatch'))
def source_preservation():
    names=subprocess.check_output(['git','--no-optional-locks','ls-tree','-r','--name-only',ACCEPTED,'src','data'],cwd=ROOT,text=True).splitlines()
    for name in names:
        expected=subprocess.check_output(['git','--no-optional-locks','show',ACCEPTED+':'+name],cwd=ROOT)
        assert (ROOT/name).read_bytes()==expected,name
    return {'acceptedCommit':ACCEPTED,'unchangedRuntimeAndDataFiles':len(names)}
check('all application sources and datasets equal accepted RC commit',source_preservation)
def stable_compatibility():
    names=['src/sw.js','src/hosted.js','src/references.js','site/index.html','site/sw.js','site/.nojekyll','standalone/Offline_URL_Inspector.html','build-manifest.json','SHA256SUMS']
    for name in names:
        assert (ROOT/name).read_bytes()==subprocess.check_output(['git','--no-optional-locks','show',STABLE+':'+name],cwd=ROOT),name
    m=json.loads((ROOT/'build-manifest.json').read_text());hosted=(ROOT/'site/index.html').read_bytes()
    assert sha(hosted)==m['hosted']['sha256']
    expected=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',m['release']).replace('@@INDEX_HASH@@',sha(hosted))
    assert (ROOT/'site/sw.js').read_text()==expected
    assert 'offline-url-inspector:reference-domains' in (ROOT/'src/references.js').read_text()
    return {'stableCommit':STABLE,'matchedStableRelease':m['release'],'filesUnchanged':names,'scope':'Source/asset/storage-contract compatibility, not a live upgrade or rollback rehearsal.'}
check('v3.2.0 matched rollback assets and lifecycle/storage sources preserved',stable_compatibility)
def boundary_identity():
    b=json.loads((ROOT/'tests/release-promotion-source-boundaries.json').read_text())
    assert b['acceptedCommit']==ACCEPTED and len(b['files'])==6
    for name,entry in b['files'].items():
        assert sha((ROOT/name).read_bytes())==entry['currentSHA256'],name
        before=subprocess.check_output(['git','--no-optional-locks','show',ACCEPTED+':'+name],cwd=ROOT)
        assert before.decode()==entry['previousSource'] and sha(before)==entry['previousSHA256'],name
    return {'exactRestorationFiles':list(b['files']),'originalHistoricalPinsChanged':False}
check('historical restoration boundary bound to accepted commit and current sources',boundary_identity)
def workflow():
    text=(ROOT/'.github/workflows/deploy-pages.yml').read_text()
    triggers=text.split('\non:\n',1)[1].split('\npermissions:',1)[0]
    assert re.findall(r'^  ([a-z_]+):',triggers,re.M)==['workflow_dispatch']
    for required in ["if: github.ref == 'refs/heads/main' && inputs.authorize_deployment",'default: false','fetch-depth: 0','persist-credentials: false','--final-release --output-root "$RUNNER_TEMP/final"','--release-root "$RUNNER_TEMP/final"','m["releaseCandidate"] is False','m["publicationAuthorized"] is False','m["sourceIdentity"]["inputsSHA256"]==os.environ["EXPECTED_SOURCE"]','needs: verify','cancel-in-progress: false','name: github-pages','test "$(git rev-parse HEAD)" = "$GITHUB_SHA"','path: ${{ runner.temp }}/final/site','tests/release-promotion.py','tests/release-promotion-regressions.py']:
        assert required in text,required
    assert '--release-candidate' not in text and '/rc' not in text
    assert 'pages: write' not in text.split('\n  deploy:',1)[0]
    actions=re.findall(r'uses: ([^\s]+)',text)
    assert all(re.fullmatch(r'[\w-]+/[\w-]+@[0-9a-f]{40}',action) for action in actions)
    return {'manualFinalOnly':True,'immutableActions':actions,'hostedExecution':'NOT PERFORMED'}
check('manual workflow uses final identity and retains deployment guards',workflow)
def failed_gate():
    fake=out/'failed-prerequisite-deno'
    fake.write_text('#!/bin/sh\nif [ "$1" = eval ]; then printf \'%s\\n\' \''+json.dumps(RUNTIME,separators=(',',':'))+'\'; else exit 7; fi\n');fake.chmod(0o700)
    result=run(['python3','-B','tools/release_gate.py','--release-root',out/'one','--deno',fake,'--report',out/'failed-gate.json'],ok=False)
    gate=json.loads((out/'failed-gate.json').read_text());assert not gate['passed'] and len(gate['failures'])==len(gate['checks'])==16
    return {'rejected':True,'failedPrerequisites':gate['failures']}
check('final mandatory gate blocks failed prerequisites',failed_gate)
report['passed']=not report['failures'];report['total']={'executed':len(report['checks']),'passed':len(report['checks'])-len(report['failures']),'failed':len(report['failures'])}
(out/'release-promotion.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report['total']));raise SystemExit(not report['passed'])
