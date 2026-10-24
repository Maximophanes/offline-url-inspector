"""Explicit RC/final v3.3.0 packaging. No network, Git mutation or release approval."""
import base64,hashlib,io,json,re,zipfile,platform,zlib
from pathlib import Path
from reference_assets import validate,license_bundle
VERSION='3.3.0-rc.1'
FINAL_VERSION='3.3.0'
BASELINE='664cc58bf67a2127d0523adec9f1d80c6edd656e'
RUNTIME={'deno':'2.9.7','v8':'15.0.245.2-rusty','typescript':'6.0.3'}
SRC=('automatic-ui.js automatic.css base.css comparisons.js core.js domain-boundaries.js embedded-ui.js embedded.css embedded.js hosted.js lookalikes.js presentation.js reference-data.js references.js results-presentation.js sw.js template.html ui.js v3.css').split()
DATA=('DerivedBidiClass.txt DerivedCoreProperties.txt IdnaMappingTable.txt IdnaTestV2.txt LICENSE.txt NormalizationTest.txt PropertyValueAliases.txt ReadMe.txt ScriptExtensions.txt Scripts.txt UnicodeData.txt confusables.txt manifest.json unicode-data.json unicode-data.sha256 reference-foundation.json lookalikes/NOTICE.txt lookalikes/index.json lookalikes/manifest.json popular-domains/NOTICE.txt popular-domains/provenance.json popular-domains/records.json popular-domains/source.csv popular-domains/source.json public-suffix/LICENSE.txt public-suffix/NOTICE.txt public-suffix/compiled.json public-suffix/public_suffix_list.dat public-suffix/source.json public-suffix/test_psl.txt').split()
TOOLS=('build.py release_candidate.py release_gate.py verify_release.py reference_assets.py extract_majestic.py generate_reference_data.mjs reference_data_lib.mjs generate_lookalike_index.mjs lookalike_data_lib.mjs').split()
DOCS=['REFERENCE_DATA.md','LOOKALIKES.md','COMPARISONS.md','AUTOMATIC_FINDINGS.md','DISTRIBUTION_RIGHTS.md','RELEASE_CANDIDATE.md','FINAL_RELEASE.md','DEPLOYMENT.md','UPDATES_AND_ROLLBACK.md','deno.json','deno.lock','.github/workflows/deploy-pages.yml','tests/stage7-release.py','tests/stage7-regressions.py','tests/stage8-cases.mjs','tests/stage8-results.mjs','tests/stage8-generators.py','tests/stage8-regressions.py','tests/ui-polish-cases.mjs','tests/ui-polish-results.mjs','tests/ui-polish-regressions.py','tests/import-preview-results.mjs','tests/release-promotion.py','tests/release-promotion-regressions.py','tests/release-promotion-source-boundaries.json']
INPUTS=sorted(['src/'+n for n in SRC]+['data/'+n for n in DATA]+['tools/'+n for n in TOOLS]+DOCS)
ARTIFACTS=['NOTICES.txt','source-materials.zip','site/.nojekyll','site/index.html','site/sw.js','standalone/Offline_URL_Inspector.html']
OUTPUTS=set(ARTIFACTS+['build-manifest.json','SHA256SUMS'])
PSL_SOURCE=['data/public-suffix/public_suffix_list.dat','data/public-suffix/compiled.json','src/domain-boundaries.js','tools/generate_reference_data.mjs','tools/reference_data_lib.mjs']
def sha(raw):return hashlib.sha256(raw).hexdigest()
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=True)+'\n'
def require(v,message):
    if not v:raise ValueError(message)
def inventory(root):
    result={}
    for name in INPUTS:
        p=root/name
        require(p.is_file() and not p.is_symlink(),'Missing/unsafe candidate input: '+name)
        result[name]={'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())}
    return result

def candidate_licenses(root,*,final_release=False):
    bundle=license_bundle(root)
    package='build' if final_release else 'candidate'
    bundle['scope']='Offline URL Inspector 3.3.0 release-candidate data notices. Source material is included offline; this is not release authorization.'
    bundle['sourceAvailability']='The exact preferred Public Suffix List source and its transformed rules follow under MPL 2.0. The transformation program is reproduced for modification/reproduction, with its independently authored modules retaining their existing terms. Complete pinned inputs, notices and build instructions also accompany this '+package+' in source-materials.zip. No external download is needed to obtain the PSL source.\n'
    for name in PSL_SOURCE:bundle['sourceAvailability']+='\n===== '+name+' =====\n'+(root/name).read_text()
    # Preserve pinned historical notices verbatim, then explain candidate packaging.
    bundle['sourceAvailability']+='\nThe preceding pinned notice describes the earlier development proposal. This '+package+' supplies the exact sources inline and in its companion archive. See DISTRIBUTION_RIGHTS.md for the engineering assessment and remaining legal review.\n'
    if final_release:
        bundle['scope']='Offline URL Inspector '+FINAL_VERSION+' final-version build data notices. Source material is included offline; preparing this build does not authorize publication or deployment.'
    return bundle

def archive_bytes(root):
    output=io.BytesIO()
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
        for name in INPUTS:
            info=zipfile.ZipInfo(name,date_time=(1980,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.create_system=3;info.external_attr=0o100644<<16
            archive.writestr(info,(root/name).read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
    return output.getvalue()

def finish(root,out,manifest,*,final_release=False):
    version=FINAL_VERSION if final_release else VERSION
    foundation,_=validate(root);index=json.loads((root/'data/lookalikes/manifest.json').read_text())
    require(index['generator']['runtime']==RUNTIME,'Unapproved index runtime metadata')
    require(set(index['generator']['files'])=={'src/core.js','src/lookalikes.js','tools/generate_lookalike_index.mjs','tools/lookalike_data_lib.mjs'},'Incomplete index generator inventory')
    for name,pin in index['generator']['files'].items():require(sha((root/name).read_bytes())==pin,'Index generator source mismatch: '+name)
    require(foundation['generator']['referenceRuntime']=={'name':'Deno','version':RUNTIME['deno'],'v8':RUNTIME['v8']},'Unapproved foundation runtime metadata')
    require(index['policyId']=='full-domain-conservative-v2' and index['referenceCount']==9570,'Unexpected approved matching policy/count')
    # The data-format stage flags describe their immutable component schemas,
    # not the completed application's feature availability. Never repin them.
    manifest.update(targetVersion=FINAL_VERSION,releaseCandidate=not final_release,developmentOnly=not final_release,publicationAuthorized=False,generatorRuntime=RUNTIME)
    if final_release:manifest.update(releaseVersion=FINAL_VERSION,buildKind='final',releasePreparationOnly=True)
    else:manifest['candidateVersion']=VERSION
    manifest['buildToolchain']={'python':platform.python_version(),'zlib':zlib.ZLIB_VERSION,'dependencies':'Python standard library only; no runtime package dependency'}
    inputs=inventory(root)
    manifest['sourceIdentity']={'kind':'sha256-input-inventory','baselineCommit':BASELINE,'inputsSHA256':sha(canonical(inputs).encode()),'inputs':inputs,'meaning':'Content identity of explicitly enumerated build inputs; not an immutable Git commit, independent audit approval or publication authorization.'}
    manifest['datasets']={'majesticOriginal':foundation['source']['original'],'majesticSubset':foundation['source']['subset'],'psl':foundation['psl'],'foundationSHA256':sha((root/'data/reference-foundation.json').read_bytes()),'indexSHA256':index['index']['sha256'],'matchingPolicy':index['policyId'],'unicodeSHA256':foundation['unicode']['sha256']}
    (out/'source-materials.zip').write_bytes(archive_bytes(root))
    notices='Offline URL Inspector '+version+' — third-party data notices\n\n'
    for name in ['data/LICENSE.txt','data/popular-domains/NOTICE.txt','data/public-suffix/NOTICE.txt','data/public-suffix/LICENSE.txt','data/lookalikes/NOTICE.txt','DISTRIBUTION_RIGHTS.md']:
        notices+='\n===== '+name+' =====\n'+(root/name).read_text()
    notices+='\nExact preferred PSL source and modifications are included in both HTML editions under Data sources & licenses and in source-materials.zip. Distribute the complete build bundle; an HTML file also retains these notices and PSL source offline. Preparing a build does not authorize publication or deployment.\n'
    (out/'NOTICES.txt').write_text(notices)
    actual={str(p.relative_to(out)) for p in out.rglob('*') if p.is_file()}
    require(actual==set(ARTIFACTS),'Unexpected or stale files in candidate output: '+str(actual.symmetric_difference(ARTIFACTS)))
    manifest['artifacts']={name:{'sha256':sha((out/name).read_bytes()),'bytes':(out/name).stat().st_size} for name in ARTIFACTS}
    manifest['distribution']={'hostedInputs':['site/index.html','site/sw.js','site/.nojekyll'],'standalone':'standalone/Offline_URL_Inspector.html','sourceAndNotices':['source-materials.zip','NOTICES.txt'],'excluded':'Tests, reports, screenshots, previews, full-million CSV, credentials, Git/editor metadata, historical site/standalone outputs. Source archive contains only the explicit input allowlist.'}
    # build.py writes this exact manifest once more after returning.
    (out/'build-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (out/'SHA256SUMS').write_text(''.join(sha((out/name).read_bytes())+'  '+name+'\n' for name in sorted(OUTPUTS-{'SHA256SUMS'})))

def verify(root,out,*,rebuild=True,final_release=False):
    version=FINAL_VERSION if final_release else VERSION
    root=Path(root).resolve();out=Path(out).resolve()
    require(out!=root and root not in out.parents,'Candidate must be outside the source repository')
    actual={str(p.relative_to(out)) for p in out.rglob('*') if p.is_file() or p.is_symlink()}
    require(actual==OUTPUTS,'Distribution inventory mismatch')
    require(not any(p.is_symlink() for p in out.rglob('*')),'Symlink in candidate')
    m=json.loads((out/'build-manifest.json').read_text())
    require(m.get('targetVersion')==FINAL_VERSION and m.get('publicationAuthorized') is False,'Incorrect release target/authorization')
    if final_release:
        require(m.get('releaseVersion')==FINAL_VERSION and m.get('buildKind')=='final' and m.get('releaseCandidate') is False and m.get('developmentOnly') is False and m.get('releasePreparationOnly') is True and 'candidateVersion' not in m,'Incorrect final release version/status')
    else:
        require(m.get('candidateVersion')==VERSION and m.get('releaseCandidate') is True and m.get('developmentOnly') is True and 'releaseVersion' not in m and 'buildKind' not in m,'Incorrect candidate version/status')
    require(m.get('generatorRuntime')==RUNTIME,'Incorrect generator runtime')
    require(m['sourceIdentity']['inputs']==inventory(root),'Candidate source input identity mismatch')
    require(m['sourceIdentity']['inputsSHA256']==sha(canonical(inventory(root)).encode()),'Candidate source digest mismatch')
    require(set(m['artifacts'])==set(ARTIFACTS),'Incomplete artifact manifest')
    require(m['release']==version+'-'+m['hosted']['sha256'][:16],'Incorrect release identity')
    lines=(out/'SHA256SUMS').read_text().splitlines();entries={}
    for line in lines:
        digest,name=line.split('  ',1)
        require(name in OUTPUTS-{'SHA256SUMS'} and name not in entries,'Unexpected/duplicate checksum entry')
        require(sha((out/name).read_bytes())==digest,'Artifact checksum mismatch: '+name);entries[name]=digest
    require(set(entries)==OUTPUTS-{'SHA256SUMS'},'Incomplete checksum inventory')
    for name,item in m['artifacts'].items():require(item=={'sha256':sha((out/name).read_bytes()),'bytes':(out/name).stat().st_size},'Artifact manifest mismatch: '+name)
    for edition,name in [('standalone','standalone/Offline_URL_Inspector.html'),('hosted','site/index.html')]:
        html=(out/name).read_text();require(re.search(r'Version '+re.escape(version)+r'(?=[<\s])',html),'Incorrect visible application version')
        require('"version":"'+version+'","edition":"'+edition+'"' in html,'Incorrect executable application version/edition')
        require(sha((out/name).read_bytes())==m[edition]['sha256'],'Edition manifest mismatch')
        for tag,key in [('script','scriptHash'),('style','styleHash')]:
            matches=re.findall('<'+tag+'>([\\s\\S]*?)</'+tag+'>',html)
            require(len(matches)==1,'Unexpected executable/style block inventory')
            digest=base64.b64encode(hashlib.sha256(matches[0].encode()).digest()).decode()
            require(digest==m[edition][key] and tag+"-src 'sha256-"+digest+"'" in html,'CSP hash mismatch')
        for directive in ["default-src 'none'","connect-src 'none'","base-uri 'none'","form-action 'none'","img-src 'none'","object-src 'none'","frame-src 'none'"]:
            require(directive in html,'Missing CSP directive')
        require('unsafe-inline' not in html and 'unsafe-eval' not in html,'Unsafe CSP')
        require(not re.search(r'<(?:script|link|img)\b[^>]*(?:src|href)\s*=',html,re.I),'External runtime dependency')
        legal=json.loads(re.search(r'id="reference-licenses">([\s\S]*?)</script>',html).group(1))
        require(legal==candidate_licenses(root,final_release=final_release),'Missing or stale offline notices/source materials')
    expected_worker=(root/'src/sw.js').read_text().replace('@@RELEASE@@',m['release']).replace('@@INDEX_HASH@@',m['hosted']['sha256'])
    require((out/'site/sw.js').read_text()==expected_worker,'Worker release/hash/source mismatch')
    # Rebuild from the identified sources. This compares every byte, including
    # CSP, inert data, full legal/source material, worker and both manifests.
    if rebuild:
        import subprocess,tempfile
        with tempfile.TemporaryDirectory(prefix='oui-rc-verify-') as folder:
            p=subprocess.run(['python3','-B',str(root/'tools/build.py'),'--final-release' if final_release else '--release-candidate','--output-root',folder],cwd=root,capture_output=True,text=True)
            require(p.returncode==0,'Candidate rebuild failed: '+p.stderr[-4000:])
            for name in sorted(OUTPUTS):require((out/name).read_bytes()==(Path(folder)/name).read_bytes(),'Source-to-artifact mismatch: '+name)
    return {'version':version,'release':m['release'],'sourceInputsSHA256':m['sourceIdentity']['inputsSHA256'],'filesVerified':len(OUTPUTS),'sourceCorrespondenceRebuilt':rebuild,'publicationAuthorized':False}
