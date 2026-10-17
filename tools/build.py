#!/usr/bin/env python3
"""Build both editions from the same core/UI and unchanged pinned Unicode JSON.

Ordinary builds never regenerate Unicode tables. Python standard library only.
"""
import base64
import hashlib
import json
import pathlib

ROOT=pathlib.Path(__file__).resolve().parents[1]
VERSION='3.1.2'
def sha(data): return hashlib.sha256(data).hexdigest()
def build():
    data=(ROOT/'data/unicode-data.json').read_bytes()
    if sha(data)!=(ROOT/'data/unicode-data.sha256').read_text().strip(): raise ValueError('Bundled Unicode data changed; review/re-pin deliberately.')
    manifest=json.loads((ROOT/'data/manifest.json').read_text())
    if manifest['version']!='18.0.0' or json.loads(data)['version']!='18.0.0': raise ValueError('Unexpected Unicode version')
    for f in manifest['files']:
        if sha((ROOT/'data'/f['name']).read_bytes())!=f['sha256']: raise ValueError('Unicode source checksum mismatch: '+f['name'])
    css=(ROOT/'src/base.css').read_text()+'\n'+(ROOT/'src/v3.css').read_text()
    css_hash=base64.b64encode(hashlib.sha256(css.encode()).digest()).decode()
    shared='\n'.join((ROOT/'src'/name).read_text() for name in ['core.js','references.js','presentation.js','ui.js'])
    shared=shared.replace('@@LICENSE@@',json.dumps((ROOT/'data/LICENSE.txt').read_text(),ensure_ascii=True))
    template=(ROOT/'src/template.html').read_text()
    results={}
    for edition,dest in [('standalone',ROOT/'standalone/Offline_URL_Inspector.html'),('hosted',ROOT/'site/index.html')]:
        program="'use strict';\nconst APP=Object.freeze("+json.dumps({'id':'offline-url-inspector','version':VERSION,'edition':edition},separators=(',',':'))+');\n'+shared
        if edition=='hosted': program+='\n'+(ROOT/'src/hosted.js').read_text()
        if '</script' in program.lower(): raise ValueError('Executable script delimiter in program')
        digest=base64.b64encode(hashlib.sha256(program.encode()).digest()).decode()
        csp="default-src 'none'; script-src 'sha256-"+digest+"'; style-src 'sha256-"+css_hash+"'; connect-src 'none'; img-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; media-src 'none'; worker-src "+("'self'" if edition=='hosted' else "'none'")+"; manifest-src 'none'"
        # No inline style/event attributes are needed in the V3 template.
        values={'@@CSP@@':csp,'@@CSS@@':css,'@@JS@@':program,'@@DATA@@':data.decode(),'@@VERSION@@':VERSION,
          '@@EDITION_STATUS@@':'Standalone · Offline ready' if edition=='standalone' else 'Offline access',
          '@@EDITION_FOOTER@@':'Standalone edition' if edition=='standalone' else 'Hosted edition',
          '@@HOSTED_ONLY@@':'hidden' if edition=='standalone' else '',
          '@@STORAGE_HELP@@':'Reference domains are saved in this browser. Clearing browser data may remove them. Storage for locally opened HTML files is not standardized and may not last; export a backup to keep your list.' if edition=='standalone' else 'Reference domains are saved in this browser. Clearing site data or ending a private session may remove them. Export a backup to keep your list. GitHub Pages projects on the same github.io hostname share browser storage, even when their paths differ.',
          '@@EDITION_PRIVACY@@':'Storage for locally opened HTML files is not standardized and may be unavailable or temporary. Export a backup to keep a portable copy of your references.' if edition=='standalone' else 'The hosted app loads and updates its own fixed application files. It does not request pasted destinations. GitHub Pages projects on the same github.io hostname share one browser security origin: other projects can access reference storage even when their repository paths differ. The storage key prevents accidental name collisions, not access by another app. A separate path does not isolate storage.'}
        html=template
        for key,value in values.items(): html=html.replace(key,value)
        dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html)
        results[edition]={'sha256':sha(html.encode()),'bytes':len(html.encode()),'scriptHash':digest,'styleHash':css_hash}
    hosted_hash=results['hosted']['sha256'];release=VERSION+'-'+hosted_hash[:16]
    worker=(ROOT/'src/sw.js').read_text().replace('@@RELEASE@@',release).replace('@@INDEX_HASH@@',hosted_hash)
    (ROOT/'site/sw.js').write_text(worker);(ROOT/'site/.nojekyll').write_text('')
    results['release']=release;results['unicodeVersion']='18.0.0';results['unicodeDataSHA256']=sha(data)
    (ROOT/'build-manifest.json').write_text(json.dumps(results,indent=2)+'\n')
    print(json.dumps(results,indent=2))
if __name__=='__main__': build()
