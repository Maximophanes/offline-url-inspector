#!/usr/bin/env python3
"""Focused distribution/license integrity regressions; no data regeneration."""
import argparse,hashlib,json,pathlib,re,shutil,sys,tempfile,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'tools'))
from release_candidate import verify,OUTPUTS,PSL_SOURCE
p=argparse.ArgumentParser();p.add_argument('--task-root',type=pathlib.Path,required=True);a=p.parse_args();out=a.task_root.resolve();candidate=out/'one';sha=lambda b:hashlib.sha256(b).hexdigest()
r={'suite':'Focused Stage 7 licensing and distribution integrity','checks':[],'failures':[]}
def check(name,fn):
 try:value=fn();r['checks'].append({'name':name,'passed':True,'evidence':value});print('PASS '+name,flush=True)
 except Exception as e:r['checks'].append({'name':name,'passed':False,'error':str(e)});r['failures'].append(name);print('FAIL '+name+': '+str(e),flush=True)
def repeat():
 for name in OUTPUTS:assert (candidate/name).read_bytes()==(out/'two'/name).read_bytes(),name
 return {n:sha((candidate/n).read_bytes()) for n in sorted(OUTPUTS)}
check('all eight repeat-build outputs are byte-identical',repeat)
check('existing release verifier rebuilds exact current source and legal materials',lambda:verify(ROOT,candidate))
prior=json.loads((ROOT/'tests/stage7-integrity.json').read_text())['candidateManifest'];current=json.loads((candidate/'build-manifest.json').read_text())
def production_preserved():
 for name in ['standalone','hosted']:assert current[name]==prior[name],name
 for name in ['site/index.html','site/sw.js','site/.nojekyll','standalone/Offline_URL_Inspector.html']:assert current['artifacts'][name]==prior['artifacts'][name],name
 assert current['datasets']==prior['datasets'];return {'release':current['release'],'runtimeAndWorkerStillMatchPriorNativeTestedBytes':True,'allDatasetIdentitiesUnchanged':True}
check('native-tested runtime/worker and all dataset identities are unchanged',production_preserved)
def notices():
 for edition,path in [('standalone','standalone/Offline_URL_Inspector.html'),('hosted','site/index.html')]:
  html=(candidate/path).read_text();bundle=json.loads(re.search(r'id="reference-licenses">([\s\S]*?)</script>',html).group(1));notice=bundle['majesticNotice'];assert notice==(ROOT/'data/popular-domains/NOTICE.txt').read_text()
  for needle in ['Majestic','The Majestic Million','https://majestic.com/reports/majestic-million','https://creativecommons.org/licenses/by/3.0/','GlobalRank <= 10000','normalize and deduplicate','No Majestic endorsement']:assert needle in notice,needle
  assert 'ShareAlike' not in notice;assert 'scope' in bundle
 return {'bothEditions':True,'pinnedAttributionUnchanged':True,'readableLicenseURIsPresent':True}
check('both editions retain author/dataset/source/license/change/no-endorsement notice',notices)
def psl():
 for name in ['standalone/Offline_URL_Inspector.html','site/index.html']:
  bundle=json.loads(re.search(r'id="reference-licenses">([\s\S]*?)</script>',(candidate/name).read_text()).group(1));assert bundle['pslNotice']==(ROOT/'data/public-suffix/NOTICE.txt').read_text();assert bundle['mplLicense']==(ROOT/'data/public-suffix/LICENSE.txt').read_text()
  for source in PSL_SOURCE:assert (ROOT/source).read_text() in bundle['sourceAvailability'],source
 return {'exactPreferredSourceAndTransformationMaterials':PSL_SOURCE,'completeMPLAndPSLNotices':True}
check('PSL preferred source, transformations, full MPL and notices remain offline',psl)
def archive():
 with zipfile.ZipFile(candidate/'source-materials.zip') as z:
  for name in ['data/popular-domains/source.csv','data/popular-domains/source.json','data/popular-domains/NOTICE.txt','data/popular-domains/records.json','data/popular-domains/provenance.json','data/lookalikes/index.json','data/lookalikes/NOTICE.txt','data/public-suffix/public_suffix_list.dat','data/public-suffix/LICENSE.txt','data/public-suffix/NOTICE.txt','DISTRIBUTION_RIGHTS.md']:
   assert z.read(name)==(ROOT/name).read_bytes(),name;assert not z.getinfo(name).flag_bits&1,'Encrypted source'
  assert len(json.loads(z.read('data/popular-domains/records.json'))['records'])==9570
  covered=(ROOT/'data/popular-domains/NOTICE.txt').read_text();assert covered in (candidate/'NOTICES.txt').read_text();assert 'focused resolution' in z.read('DISTRIBUTION_RIGHTS.md').decode()
 return {'exactNoticeAndReadableDataSourceInArchive':True,'records':9570,'encrypted':False}
check('distribution archive and notices retain readable transformed data and current assessment',archive)
def source_change_scope():
 changed=[n for n,v in current['sourceIdentity']['inputs'].items() if v!=prior['sourceIdentity']['inputs'][n]];assert set(changed)=={'DISTRIBUTION_RIGHTS.md','RELEASE_CANDIDATE.md'},changed
 return {'changedCandidateInputs':changed,'noNewRuntimeOrPackagingCode':True}
check('only two documentation inputs changed within the candidate allowlist',source_change_scope)
def reject(mutation):
 with tempfile.TemporaryDirectory(prefix='oui-license-negative-') as folder:
  dest=pathlib.Path(folder)/'candidate';shutil.copytree(candidate,dest);mutation(dest)
  try:verify(ROOT,dest)
  except (ValueError,KeyError,AssertionError) as e:return {'explicitRejection':str(e)}
  raise AssertionError('Damaged license distribution accepted')
check('verifier rejects missing distribution notices',lambda:reject(lambda d:(d/'NOTICES.txt').unlink()))
check('verifier rejects missing source materials',lambda:reject(lambda d:(d/'source-materials.zip').unlink()))
def tamper(d):
 path=d/'standalone/Offline_URL_Inspector.html';text=path.read_text();old='Creative Commons Attribution 3.0 Unported (CC-BY-3.0)';assert old in text;text=text.replace(old,'NOTICE_REMOVED',1);path.write_text(text);m=json.loads((d/'build-manifest.json').read_text());m['standalone'].update(sha256=sha(path.read_bytes()),bytes=path.stat().st_size);m['artifacts']['standalone/Offline_URL_Inspector.html'].update(sha256=sha(path.read_bytes()),bytes=path.stat().st_size);(d/'build-manifest.json').write_text(json.dumps(m,indent=2)+'\n');(d/'SHA256SUMS').write_text(''.join(sha((d/n).read_bytes())+'  '+n+'\n' for n in sorted(OUTPUTS-{'SHA256SUMS'})))
check('verifier rejects removed inline license despite recomputed checksums',lambda:reject(tamper))
r['total']={'executed':len(r['checks']),'passed':sum(c['passed'] for c in r['checks']),'failed':len(r['failures'])};r['scope']='Current notices/source availability and build integrity, not legal adjudication; no dataset generation, refresh or engine change.';(out/'licensing-results.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r['total']));raise SystemExit(bool(r['failures']))
