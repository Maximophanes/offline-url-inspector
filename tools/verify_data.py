#!/usr/bin/env python3
"""Verify pinned data; --download restores exactly the pinned release bytes.

Downloading is a development operation, never used by the HTML application.
"""
import argparse
import hashlib
import json
import pathlib
import urllib.request

root=pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--download',action='store_true',help='Download exact manifest URLs and verify before writing')
args=parser.parse_args()
manifest=json.loads((root/'data/manifest.json').read_text())
for f in manifest['files']:
    p=root/'data'/f['name']
    data=urllib.request.urlopen(f['url'],timeout=60).read() if args.download else p.read_bytes()
    digest=hashlib.sha256(data).hexdigest()
    if digest!=f['sha256']:
        raise SystemExit('CHECKSUM MISMATCH: '+f['name']+'; expected '+f['sha256']+', got '+digest+'. Nothing was written for this file.')
    if args.download:
        p.write_bytes(data)
    print('Verified '+f['name'])
print('All pinned Unicode '+manifest['version']+' source files verified.')
