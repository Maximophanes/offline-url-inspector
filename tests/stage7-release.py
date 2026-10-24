#!/usr/bin/env python3
"""Independent RC mutations, strict reproduction, provenance; fixtures stay outside Git."""
import argparse,hashlib,json,pathlib,shutil,subprocess,sys,tempfile,time,platform,zlib
ROOT=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'tools'))
from release_candidate import verify,OUTPUTS,INPUTS,sha
p=argparse.ArgumentParser();p.add_argument('--task-root',type=pathlib.Path,required=True);p.add_argument('--deno',type=pathlib.Path,required=True);p.add_argument('--majestic-source',type=pathlib.Path);a=p.parse_args();out=a.task_root.resolve();out.mkdir(parents=True,exist_ok=True)
r={'suite':'Stage 7 release hardening and rejection fixtures','checks':[],'failures':[],'toolchain':{'python':platform.python_version(),'zlib':zlib.ZLIB_VERSION,'platform':platform.platform()}}
def check(name,fn):
 try:result=fn();r['checks'].append({'name':name,'passed':True,'evidence':result});print('PASS '+name,flush=True)
 except Exception as e:r['checks'].append({'name':name,'passed':False,'error':str(e)});r['failures'].append(name);print('FAIL '+name+': '+str(e),flush=True)
def run(cmd,cwd=ROOT,ok=True):
 v=subprocess.run([str(x) for x in cmd],cwd=cwd,capture_output=True,text=True);assert (v.returncode==0)==ok,(cmd,v.returncode,(v.stdout+v.stderr)[-4000:]);return {'exitCode':v.returncode,'output':(v.stdout+v.stderr)[-5000:]}
def compare_builds():
 for name in OUTPUTS:assert (out/'one'/name).read_bytes()==(out/'two'/name).read_bytes(),name
 return {name:sha((out/'one'/name).read_bytes()) for name in sorted(OUTPUTS)}
check('complete double-build deterministic bytes and source correspondence',lambda:{'hashes':compare_builds(),'verification':verify(ROOT,out/'one')})
check('strict runtime actual identity',lambda:run([a.deno,'--version']))
def reproduce():
 outputs={}
 for n in ['generated-one','generated-two']:
  dest=out/n;dest.mkdir(exist_ok=True)
  for script in ['generate_reference_data.mjs','generate_lookalike_index.mjs']:
   run([a.deno,'run','--cached-only','--allow-read=.','--allow-write='+str(dest),'tools/'+script,'--write','--output-root',dest])
  outputs[n]={str(p.relative_to(dest)):sha(p.read_bytes()) for p in dest.rglob('*') if p.is_file()}
  for name,h in outputs[n].items():assert sha((ROOT/name).read_bytes())==h,name
 assert outputs['generated-one']==outputs['generated-two'];return outputs
check('strict 2.9.7 double generation equals all approved assets',reproduce)
if a.majestic_source:check('entire original million-row identity and exact selected subset',lambda:run(['python3','-B','tools/extract_majestic.py',a.majestic_source,'--check']))
check('wrong installed runtime refuses data generation',lambda:run(['deno','run','--cached-only','--allow-read=.','tools/generate_reference_data.mjs','--check'],ok=False))
def reject_source(name,mutate):
 with tempfile.TemporaryDirectory(prefix='oui-rc-negative-source-') as folder:
  dest=pathlib.Path(folder)/'source'
  for file in INPUTS:
   target=dest/file;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/file,target)
  mutate(dest)
  return run(['python3','-B',dest/'tools/build.py','--release-candidate','--output-root',pathlib.Path(folder)/'candidate'],cwd=dest,ok=False)
def json_change(p,fn):
 v=json.loads(p.read_text());fn(v);p.write_text(json.dumps(v)+'\n')
check('reject missing bundled index',lambda:reject_source('missing',lambda d:(d/'data/lookalikes/index.json').unlink()))
check('reject corrupt index',lambda:reject_source('corrupt',lambda d:(d/'data/lookalikes/index.json').write_text('{}')))
check('reject truncated approved subset',lambda:reject_source('truncated',lambda d:(d/'data/popular-domains/source.csv').write_bytes((d/'data/popular-domains/source.csv').read_bytes()[:1024])))
check('reject incorrect index runtime metadata',lambda:reject_source('runtime',lambda d:json_change(d/'data/lookalikes/manifest.json',lambda m:m['generator']['runtime'].update(deno='2.9.8'))))
check('reject missing legal source notice',lambda:reject_source('notice',lambda d:(d/'data/public-suffix/NOTICE.txt').unlink()))
def reject_artifact(mutate):
 with tempfile.TemporaryDirectory(prefix='oui-rc-negative-artifact-') as folder:
  dest=pathlib.Path(folder)/'candidate';shutil.copytree(out/'one',dest);mutate(dest)
  try:verify(ROOT,dest)
  except (ValueError,KeyError,AssertionError) as e:return {'explicitRejection':str(e)}
  raise AssertionError('Invalid candidate was accepted')
check('reject mismatched artifact checksum',lambda:reject_artifact(lambda d:(d/'standalone/Offline_URL_Inspector.html').write_text('modified')))
check('reject incorrect release version',lambda:reject_artifact(lambda d:json_change(d/'build-manifest.json',lambda m:m.update(candidateVersion='3.2.0'))))
check('reject unexpected distribution asset',lambda:reject_artifact(lambda d:(d/'site/debug.js').write_text('debug')))
check('reject mixed stable hosted HTML and candidate worker',lambda:reject_artifact(lambda d:shutil.copy2(ROOT/'site/index.html',d/'site/index.html')))
check('reject absent source archive',lambda:reject_artifact(lambda d:(d/'source-materials.zip').unlink()))
# Even recalculated checksums cannot conceal a source/artifact discrepancy.
def forgery(d):
 target=d/'site/index.html';target.write_text(target.read_text().replace('Version 3.3.0-rc.1','Version 3.2.0'))
 json_change(d/'build-manifest.json',lambda m:m['artifacts']['site/index.html'].update(sha256=sha(target.read_bytes()),bytes=target.stat().st_size))
 (d/'SHA256SUMS').write_text(''.join(sha((d/n).read_bytes())+'  '+n+'\n' for n in sorted(OUTPUTS-{'SHA256SUMS'})))
check('reject stale version even with recomputed artifact inventories',lambda:reject_artifact(forgery))
def fail_prerequisite():
 fake=out/'failed-prerequisite-deno';fake.write_text('#!/bin/sh\nif [ "$1" = eval ]; then printf \'%s\\n\' \'{"deno":"2.9.7","v8":"15.0.245.2-rusty","typescript":"6.0.3"}\'; else exit 7; fi\n');fake.chmod(0o700)
 return run(['python3','-B','tools/release_gate.py','--candidate-root',out/'one','--deno',fake,'--report',out/'failed-prerequisite-report.json'],ok=False)
check('mandatory gate rejects failed regression prerequisite',fail_prerequisite)
r['total']={'executed':len(r['checks']),'passed':sum(x['passed'] for x in r['checks']),'failed':len(r['failures'])};(out/'release-tests.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r['total']));raise SystemExit(bool(r['failures']))
