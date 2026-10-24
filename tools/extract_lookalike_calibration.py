#!/usr/bin/env python3
"""Explicit local extraction of a disjoint calibration input, never a data refresh."""
import argparse
import csv
import hashlib
import io
import json
from pathlib import Path
from extract_majestic import extract

ROOT=Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path);parser.add_argument('--check',action='store_true')
    args=parser.parse_args();identity=json.loads((ROOT/'data/popular-domains/source.json').read_text())
    extract(args.source,identity)  # Verifies full snapshot and all million ordered rows.
    out=io.StringIO(newline='');writer=csv.writer(out,lineterminator='\n');writer.writerow(['GlobalRank','Domain'])
    with args.source.open(encoding='utf-8',errors='strict',newline='') as stream:
        for row in csv.DictReader(stream,strict=True):
            rank=int(row['GlobalRank'])
            if rank>25000:break
            if rank>=10001:writer.writerow([rank,row['Domain']])
    raw=out.getvalue().encode();digest=hashlib.sha256(raw).hexdigest()
    metadata={'schemaVersion':1,'kind':'lookalike-calibration-input','provider':'majestic','sourceURL':identity['sourceURL'],'originalSourceSHA256':identity['original']['sha256'],'sourceRetrievedAtUTC':identity['retrievedAtUTC'],'firstRank':10001,'lastRank':25000,'rows':15000,'bytes':len(raw),'sha256':digest,'columns':['GlobalRank','Domain'],'selection':'First 10000 distinct eligible registrable domains after normalization, excluding every automatic reference; increasing original rank. Remaining source rows are not corpus members.','license':'CC-BY-3.0','licenseURL':identity['license']['url'],'attribution':'Majestic, The Majestic Million. Extracted original ranks/hostnames for calibration; no endorsement or benign/malicious labels. See data/popular-domains/NOTICE.txt.'}
    outputs={'tests/data/lookalikes/calibration-source.csv':raw,'tests/data/lookalikes/calibration-source.json':(json.dumps(metadata,sort_keys=True,indent=2)+'\n').encode()}
    for name,value in outputs.items():
        path=ROOT/name
        if args.check:
            if not path.is_file() or path.read_bytes()!=value:raise ValueError('Calibration input differs: '+name)
        else:
            if path.exists() and path.read_bytes()!=value:raise ValueError('Refusing to overwrite different calibration evidence')
            path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(value)
    print(json.dumps({'status':'verified' if args.check else 'extracted','rows':15000,'firstRank':10001,'lastRank':25000,'bytes':len(raw),'sha256':digest}))
if __name__=='__main__':main()
