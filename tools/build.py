#!/usr/bin/env python3
"""Build both editions from the same core/UI and unchanged pinned Unicode JSON.

Ordinary builds never regenerate Unicode tables. Python standard library only.
"""
import base64
import hashlib
import json
import pathlib
import argparse
from reference_assets import validate as validate_reference_assets,license_bundle

ROOT=pathlib.Path(__file__).resolve().parents[1]
VERSION='3.2.0'
STABLE_EMBEDDED={'src/embedded.js':'b9cfdcfddbe39b7c36de8e1ad7039e7a10a60016201108b16ba006271fc6b153','src/embedded-ui.js':'25bb11bd41525dc8377b980e1a29757a16e84626256fbfc701873ef5b61fece6'}
PRE_PRESENTATION={'src/ui.js':'eae2d60f3e39b9cbdd7896e8e127720c88ee04e8e5ac57c5ae8d583b6e60d99f','src/template.html':'af7d77cd8be336a60f67147097fc9d9c6207fa5893cbc0ed775c25ec3ac65572','src/comparisons.js':'ad6e862bacbe849d11b9c22a02404c10e2fc71285c5d1e03c76977ccdaee653d'}
def sha(data): return hashlib.sha256(data).hexdigest()
def embedded_json(value):
    return json.dumps(value,ensure_ascii=True,separators=(',',':')).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
def build(*,reference_foundation=False,provenance_preview=False,comparison_preview=False,automatic_ui_preview=False,release_candidate=False,final_release=False,output_root=ROOT):
    if release_candidate and final_release:raise ValueError('Choose either release-candidate or final-release identity')
    if release_candidate or final_release:automatic_ui_preview=True
    if automatic_ui_preview:comparison_preview=True
    if comparison_preview:reference_foundation=True;provenance_preview=True
    output_root=pathlib.Path(output_root).resolve()
    if (release_candidate or final_release) and output_root.exists() and any(output_root.iterdir()):raise ValueError('Release build requires a fresh empty output directory')
    if (reference_foundation or provenance_preview) and (output_root==ROOT or ROOT in output_root.parents):raise ValueError('Development previews require an output root outside the repository')
    if not provenance_preview and any(sha((ROOT/name).read_bytes())!=pin for name,pin in STABLE_EMBEDDED.items()):raise ValueError('Embedded provenance sources differ from v3.2.0; use --provenance-preview with an outside output root')
    if not automatic_ui_preview and any(sha((ROOT/name).read_bytes())!=pin for name,pin in PRE_PRESENTATION.items()):raise ValueError('Presentation sources differ from Stage 5; use --automatic-ui-preview with an outside output root')
    foundation,reference_assets=validate_reference_assets(ROOT)
    from release_candidate import VERSION as RC_VERSION,FINAL_VERSION
    version=FINAL_VERSION if final_release else RC_VERSION if release_candidate else '3.3.0-stage6' if automatic_ui_preview else '3.3.0-stage5' if comparison_preview else '3.3.0-stage4' if provenance_preview else '3.3.0-stage2' if reference_foundation else VERSION
    data=(ROOT/'data/unicode-data.json').read_bytes()
    if sha(data)!=(ROOT/'data/unicode-data.sha256').read_text().strip(): raise ValueError('Bundled Unicode data changed; review/re-pin deliberately.')
    manifest=json.loads((ROOT/'data/manifest.json').read_text())
    if manifest['version']!='18.0.0' or json.loads(data)['version']!='18.0.0': raise ValueError('Unexpected Unicode version')
    for f in manifest['files']:
        if sha((ROOT/'data'/f['name']).read_bytes())!=f['sha256']: raise ValueError('Unicode source checksum mismatch: '+f['name'])
    css='\n'.join((ROOT/'src'/name).read_text() for name in ['base.css','v3.css','embedded.css'])
    if automatic_ui_preview:css+='\n'+(ROOT/'src/automatic.css').read_text()
    css_hash=base64.b64encode(hashlib.sha256(css.encode()).digest()).decode()
    shared='\n'.join((ROOT/'src'/name).read_text() for name in ['core.js','references.js','presentation.js','embedded.js','embedded-ui.js','ui.js'])
    shared=shared.replace('@@LICENSE@@',json.dumps((ROOT/'data/LICENSE.txt').read_text(),ensure_ascii=True))
    if reference_foundation:
        shared+='\n'+'\n'.join((ROOT/'src'/name).read_text() for name in ['domain-boundaries.js','reference-data.js'])
    if comparison_preview:
        index_manifest=json.loads((ROOT/'data/lookalikes/manifest.json').read_text())
        index=(ROOT/'data/lookalikes/index.json').read_bytes()
        if len(index)!=index_manifest['index']['bytes'] or sha(index)!=index_manifest['index']['sha256']:raise ValueError('Automatic index integrity mismatch')
        if index_manifest['foundationManifestSHA256']!=sha((ROOT/'data/reference-foundation.json').read_bytes()):raise ValueError('Automatic index foundation mismatch')
        if index_manifest['notice']['sha256']!=sha((ROOT/'data/lookalikes/NOTICE.txt').read_bytes()):raise ValueError('Automatic index notice mismatch')
        for name in ['src/lookalikes.js','src/core.js']:
            if sha((ROOT/name).read_bytes())!=index_manifest['generator']['files'][name]:raise ValueError('Automatic index source mismatch: '+name)
        shared+='\n'+'\n'.join((ROOT/'src'/name).read_text() for name in ['lookalikes.js','comparisons.js'])
    if automatic_ui_preview:shared+='\n'+(ROOT/'src/results-presentation.js').read_text()+'\n'+(ROOT/'src/automatic-ui.js').read_text()
    template=(ROOT/'src/template.html').read_text()
    if reference_foundation:
        licenses=license_bundle(ROOT)
        if release_candidate or final_release:
            from release_candidate import candidate_licenses
            licenses=candidate_licenses(ROOT,final_release=final_release)
        blocks=[('reference-manifest',embedded_json(foundation)),('public-suffix-data',reference_assets['data/public-suffix/compiled.json']),('popular-domain-data',reference_assets['data/popular-domains/records.json']),('reference-licenses',embedded_json(licenses))]
        if comparison_preview:
            # The matcher hashes the exact foundation manifest text, including LF.
            blocks[0]=('reference-manifest',(ROOT/'data/reference-foundation.json').read_text())
            blocks.extend([('lookalike-manifest',embedded_json(index_manifest)),('lookalike-index',index.decode()),('lookalike-notice',embedded_json((ROOT/'data/lookalikes/NOTICE.txt').read_text()))])
        if any('</script' in value.lower() for _,value in blocks):raise ValueError('Inert data script delimiter')
        markup=''.join('<script type="application/json" id="'+name+'">'+value+'</script>' for name,value in blocks)
        template=template.replace('<script type="application/json" id="unicode-data">',markup+'<script type="application/json" id="unicode-data">')
    results={}
    for edition,dest in [('standalone',output_root/'standalone/Offline_URL_Inspector.html'),('hosted',output_root/'site/index.html')]:
        program="'use strict';\nconst APP=Object.freeze("+json.dumps({'id':'offline-url-inspector','version':version,'edition':edition},separators=(',',':'))+');\n'+shared
        if edition=='hosted': program+='\n'+(ROOT/'src/hosted.js').read_text()
        if '</script' in program.lower(): raise ValueError('Executable script delimiter in program')
        digest=base64.b64encode(hashlib.sha256(program.encode()).digest()).decode()
        csp="default-src 'none'; script-src 'sha256-"+digest+"'; style-src 'sha256-"+css_hash+"'; connect-src 'none'; img-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; media-src 'none'; worker-src "+("'self'" if edition=='hosted' else "'none'")+"; manifest-src 'none'"
        # No inline style/event attributes are needed in the V3 template.
        values={'@@CSP@@':csp,'@@CSS@@':css,'@@JS@@':program,'@@DATA@@':data.decode(),'@@VERSION@@':version,
          '@@EDITION_STATUS@@':'Standalone · Offline ready' if edition=='standalone' else 'Offline access',
          '@@EDITION_FOOTER@@':'Standalone edition' if edition=='standalone' else 'Hosted edition',
          '@@HOSTED_ONLY@@':'hidden' if edition=='standalone' else '',
          '@@STORAGE_HELP@@':'Reference domains are saved in this browser. Clearing browser data may remove them. Storage for locally opened HTML files is not standardized and may not last; export a backup to keep your list.' if edition=='standalone' else 'Reference domains are saved in this browser. Clearing site data or ending a private session may remove them. Export a backup to keep your list. GitHub Pages projects on the same github.io hostname share browser storage, even when their paths differ.',
          '@@EDITION_PRIVACY@@':'Storage for locally opened HTML files is not standardized and may be unavailable or temporary. Export a backup to keep a portable copy of your references.' if edition=='standalone' else 'The hosted app loads and updates its own fixed application files. It does not request pasted destinations. GitHub Pages projects on the same github.io hostname share one browser security origin: other projects can access reference storage even when their repository paths differ. The storage key prevents accidental name collisions, not access by another app. A separate path does not isolate storage.'}
        html=template
        for key,value in values.items(): html=html.replace(key,value)
        dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html)
        results[edition]={'sha256':sha(html.encode()),'bytes':len(html.encode()),'scriptHash':digest,'styleHash':css_hash}
    hosted_hash=results['hosted']['sha256'];release=version+'-'+hosted_hash[:16]
    worker=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',release).replace('@@INDEX_HASH@@',hosted_hash)
    (output_root/'site/sw.js').write_text(worker);(output_root/'site/.nojekyll').write_text('')
    results['release']=release;results['unicodeVersion']='18.0.0';results['unicodeDataSHA256']=sha(data)
    if reference_foundation:results.update({'developmentOnly':True,'automaticMatchingAvailable':False,'referenceFoundationSHA256':sha((ROOT/'data/reference-foundation.json').read_bytes()),'referenceProvider':'majestic'})
    if provenance_preview:results.update({'developmentOnly':True,'automaticMatchingAvailable':False,'occurrenceProvenanceVersion':2,'embeddedSourcesSHA256':{name:sha((ROOT/name).read_bytes()) for name in STABLE_EMBEDDED}})
    if comparison_preview:results.update({'automaticMatchingAvailable':True,'automaticUIAvailable':False,'comparisonSchemaVersion':1,'initialization':'explicit-local-text','lookalikeIndexSHA256':sha(index),'comparisonSourceSHA256':sha((ROOT/'src/comparisons.js').read_bytes())})
    if automatic_ui_preview:results.update({'automaticUIAvailable':True,'initialization':'scheduled-local-text','automaticUISourceSHA256':sha((ROOT/'src/automatic-ui.js').read_bytes()),'primaryFindingPolicySHA256':sha((ROOT/'src/results-presentation.js').read_bytes())})
    if release_candidate or final_release:
        from release_candidate import finish
        finish(ROOT,output_root,results,final_release=final_release)
    (output_root/'build-manifest.json').write_text(json.dumps(results,indent=2)+'\n')
    print(json.dumps(results,indent=2))
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reference-foundation',action='store_true',help='Embed dormant Stage 2 data/modules; requires an out-of-repository output root')
    parser.add_argument('--provenance-preview',action='store_true',help='Build Stage 4 occurrence provenance as development-only; requires an outside output root')
    parser.add_argument('--comparison-preview',action='store_true',help='Build Stage 5 comparison API and offline index, without new UI; requires an outside output root')
    parser.add_argument('--automatic-ui-preview',action='store_true',help='Build Stage 6 automatic findings UI; development-only, outside output root required')
    release_mode=parser.add_mutually_exclusive_group()
    release_mode.add_argument('--release-candidate',action='store_true',help='Build a local 3.3.0-rc.1 with complete integrity/source materials; outside output root required, no publication')
    release_mode.add_argument('--final-release',action='store_true',help='Build final-version 3.3.0 with complete integrity/source materials; outside output root required, no publication authorization')
    parser.add_argument('--output-root',type=pathlib.Path,default=ROOT)
    args=parser.parse_args();build(reference_foundation=args.reference_foundation,provenance_preview=args.provenance_preview,comparison_preview=args.comparison_preview,automatic_ui_preview=args.automatic_ui_preview,release_candidate=args.release_candidate,final_release=args.final_release,output_root=args.output_root)
