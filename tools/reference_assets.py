"""Bounded offline integrity checks for Stage 2 assets. No IDNA/PSL reimplementation."""
import hashlib
import json
from pathlib import Path

ASSETS={'data/public-suffix/compiled.json':1048576,'data/popular-domains/records.json':2097152,'data/popular-domains/provenance.json':8388608}
def digest(value):return hashlib.sha256(value).hexdigest()
def bounded(root,name,maximum):
    path=root/name
    if path.is_symlink() or not path.is_file() or path.stat().st_size>maximum:raise ValueError('Missing/oversized/symlink reference asset: '+name)
    return path.read_bytes()
def validate(root):
    root=Path(root);raw=bounded(root,'data/reference-foundation.json',65536);manifest=json.loads(raw)
    if manifest.get('schemaVersion')!=1 or manifest.get('kind')!='reference-foundation' or manifest.get('status')!='foundation-only' or manifest.get('provider')!='majestic' or manifest.get('automaticMatchingAvailable') is not False or manifest.get('indexFormatVersion') is not None:raise ValueError('Unsupported reference foundation manifest')
    if set(manifest['assets'])!=set(ASSETS):raise ValueError('Unexpected reference asset inventory')
    values={}
    for name,bound in ASSETS.items():
        data=bounded(root,name,bound);pin=manifest['assets'][name]
        if len(data)!=pin['bytes'] or digest(data)!=pin['sha256']:raise ValueError('Reference asset hash mismatch: '+name)
        values[name]=data
    source=json.loads(bounded(root,'data/popular-domains/source.json',32768));psl=json.loads(bounded(root,'data/public-suffix/source.json',32768))
    if source!=manifest['source'] or psl!=manifest['psl']:raise ValueError('Source metadata differs from generated foundation')
    inputs=[('data/popular-domains/source.csv',source['subset']['sha256'],source['subset']['bytes'],2097152),('data/public-suffix/public_suffix_list.dat',psl['sha256'],psl['bytes'],1048576),('data/public-suffix/test_psl.txt',psl['fixtures']['sha256'],None,32768),('data/public-suffix/LICENSE.txt',psl['license']['sha256'],None,65536),('data/public-suffix/NOTICE.txt',psl['license']['noticeSHA256'],None,32768),('data/popular-domains/NOTICE.txt',source['license']['noticeSHA256'],None,32768),('data/unicode-data.json',manifest['unicode']['sha256'],None,4194304)]
    for name,expected,size,bound in inputs:
        data=bounded(root,name,bound)
        if digest(data)!=expected or size is not None and size!=len(data):raise ValueError('Reference input hash mismatch: '+name)
    expected_generators={'tools/generate_reference_data.mjs','tools/reference_data_lib.mjs','tools/extract_majestic.py','src/domain-boundaries.js','src/reference-data.js','src/core.js'}
    if set(manifest['generator']['files'])!=expected_generators:raise ValueError('Generator inventory differs')
    for name,expected in manifest['generator']['files'].items():
        if digest(bounded(root,name,1048576))!=expected:raise ValueError('Regenerate after reviewed generator/module changes: '+name)
    records=json.loads(values['data/popular-domains/records.json'])
    if len(records['records'])!=manifest['recordCount'] or manifest['tiers']['10000']['distinctRegistrableDomains']!=manifest['recordCount']:raise ValueError('Normalized count mismatch')
    return manifest,{name:value.decode('utf-8') for name,value in values.items()}
def license_bundle(root):
    return {'scope':'Stage 2 development preview; automatic matching is not implemented.','majesticNotice':bounded(root,'data/popular-domains/NOTICE.txt',32768).decode(),'pslNotice':bounded(root,'data/public-suffix/NOTICE.txt',32768).decode(),'mplLicense':bounded(root,'data/public-suffix/LICENSE.txt',65536).decode(),'sourceAvailability':'Exact preferred PSL source and reproduction instructions accompany this local source tree. An immutable source archive and final packaging review are required before distribution.'}
