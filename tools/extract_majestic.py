#!/usr/bin/env python3
"""Explicit local extraction only. Never downloads data or changes a source pin.

Validate the entire pinned million-row input before deriving the approved
GlobalRank <= 10000 two-column source subset. The full CSV stays outside Git.
"""
import argparse
import csv
import hashlib
import io
import json
import re
import datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
EXPECTED_FIELDS=['GlobalRank','TldRank','Domain','TLD','RefSubNets','RefIPs','IDN_Domain','IDN_TLD','PrevGlobalRank','PrevTldRank','PrevRefSubNets','PrevRefIPs']
def sha(value):return hashlib.sha256(value).hexdigest()
def extract(source,identity,*,verify_subset=True):
    digest=hashlib.sha256()
    with source.open('rb') as stream:
        for block in iter(lambda:stream.read(1048576),b''):digest.update(block)
    if source.stat().st_size!=identity['original']['bytes'] or digest.hexdigest()!=identity['original']['sha256']:raise ValueError('Original Majestic snapshot differs from reviewed identity')
    out=io.StringIO(newline='');writer=csv.writer(out,lineterminator='\n');writer.writerow(['GlobalRank','Domain']);rows=0
    with source.open(encoding='utf-8',errors='strict',newline='') as stream:
        reader=csv.DictReader(stream,strict=True)
        if reader.fieldnames!=EXPECTED_FIELDS:raise ValueError('Unexpected original CSV columns')
        for row in reader:
            rows+=1
            if set(row)!=set(EXPECTED_FIELDS) or None in row or any(v is None for v in row.values()):raise ValueError('Malformed original CSV row')
            if row['GlobalRank']!=str(rows) or not row['Domain']:raise ValueError('Missing, duplicate or unordered original rank/domain')
            if rows<=10000:writer.writerow([row['GlobalRank'],row['Domain']])
    if rows!=identity['original']['rows']:raise ValueError('Incomplete original CSV')
    result=out.getvalue().encode()
    if verify_subset and (sha(result)!=identity['subset']['sha256'] or len(result)!=identity['subset']['bytes']):raise ValueError('Extracted subset differs from reviewed pin')
    return result
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path);parser.add_argument('--check',action='store_true',help='Compare instead of writing the subset')
    parser.add_argument('--candidate-dir',type=Path,help='Inspect a replacement snapshot into a new directory outside this repository; never approve it')
    parser.add_argument('--expected-original-sha256');parser.add_argument('--retrieved-at',help='Recorded timezone-aware ISO retrieval time, for a candidate only')
    args=parser.parse_args();identity=json.loads((ROOT/'data/popular-domains/source.json').read_text())
    if args.candidate_dir:
        dest=args.candidate_dir.resolve()
        if args.check or dest==ROOT or ROOT in dest.parents or not args.expected_original_sha256 or not re.fullmatch('[a-f0-9]{64}',args.expected_original_sha256) or not args.retrieved_at:raise ValueError('Candidate requires an outside directory, explicit expected source hash and retrieval time')
        if datetime.datetime.fromisoformat(args.retrieved_at).tzinfo is None:raise ValueError('Retrieval time needs a timezone')
        identity['original'].update({'bytes':args.source.stat().st_size,'sha256':args.expected_original_sha256,'httpLastModified':None,'etag':None});identity['retrievedAtUTC']=args.retrieved_at;identity['landingPage']=None;identity['datasetId']='majestic-million-sha256-'+args.expected_original_sha256
        result=extract(args.source,identity,verify_subset=False);identity['subset'].update({'bytes':len(result),'sha256':sha(result)})
        dest.mkdir(parents=True,exist_ok=False);(dest/'source.csv').write_bytes(result);(dest/'candidate.json').write_text(json.dumps({'kind':'majestic-source-candidate','approved':False,'proposedSource':identity,'reviewRequired':'Review acquisition dates, complete source identity, rank changes, exclusions, licenses and derived differences before separately approving repository input changes.'},indent=2)+'\n');print(json.dumps({'status':'candidate-only','directory':str(dest),'sourceSHA256':args.expected_original_sha256,'subsetSHA256':sha(result)}));return
    if args.expected_original_sha256 or args.retrieved_at:raise ValueError('Candidate options require --candidate-dir')
    result=extract(args.source,identity);dest=ROOT/'data/popular-domains/source.csv'
    if args.check:
        if not dest.is_file() or dest.read_bytes()!=result:raise ValueError('Approved subset is absent or differs')
    else:
        if dest.exists() and dest.read_bytes()!=result:raise ValueError('Refusing to overwrite a different subset')
        dest.write_bytes(result)
    print(json.dumps({'sourceRowsVerified':identity['original']['rows'],'subsetRows':10000,'bytes':len(result),'sha256':sha(result),'checked':args.check}))
if __name__=='__main__':main()
