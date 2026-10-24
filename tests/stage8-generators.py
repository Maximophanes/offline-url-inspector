#!/usr/bin/env python3
"""F-02 runtime refusal and unchanged strict index reproduction; outside fixtures only."""
import argparse,hashlib,json,pathlib,shutil,subprocess,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1];p=argparse.ArgumentParser();p.add_argument('--deno',type=pathlib.Path,required=True);p.add_argument('--report',type=pathlib.Path,required=True);p.add_argument('--unapproved-deno',type=pathlib.Path);a=p.parse_args();r={'suite':'Stage 8 F-02 index generator runtime enforcement','checks':[],'failures':[]};sha=lambda b:hashlib.sha256(b).hexdigest()
def check(name,fn):
 try:value=fn();r['checks'].append({'name':name,'passed':True,'evidence':value});print('PASS '+name,flush=True)
 except Exception as e:r['checks'].append({'name':name,'passed':False,'error':str(e)});r['failures'].append(name);print('FAIL '+name+': '+str(e),flush=True)
def run(cmd):return subprocess.run([str(x) for x in cmd],cwd=ROOT,capture_output=True,text=True)
with tempfile.TemporaryDirectory(prefix='oui-stage8-generator-') as folder:
 base=pathlib.Path(folder);runtime=json.loads(subprocess.check_output([str(a.deno),'eval','console.log(JSON.stringify(Deno.version))'],text=True));assert runtime=={'deno':'2.9.7','v8':'15.0.245.2-rusty','typescript':'6.0.3'};r['runtime']=runtime
 def reject_runtime(field,value,mode):
  out=base/(field+mode.removeprefix('--'));out.mkdir();(out/'sentinel.txt').write_text('preserve');(out/'data/lookalikes').mkdir(parents=True);(out/'data/lookalikes/index.json').write_text('existing index');(out/'data/lookalikes/manifest.json').write_text('existing manifest');before={str(p.relative_to(out)):sha(p.read_bytes()) for p in out.rglob('*') if p.is_file()}
  bootstrap=base/(field+mode.removeprefix('--')+'.mjs');bootstrap.write_text('Object.defineProperty(Deno,"version",{value:Object.freeze({...Deno.version,'+json.dumps(field)+':'+json.dumps(value)+'})});await import('+json.dumps((ROOT/'tools/generate_lookalike_index.mjs').as_uri())+');\n')
  v=run([a.deno,'run','--cached-only','--allow-read='+str(ROOT)+','+str(base),'--allow-write='+str(out),bootstrap,mode,'--output-root',out]);assert v.returncode!=0 and 'Unreviewed index generation runtime' in v.stderr,v.stdout+v.stderr;assert before=={str(p.relative_to(out)):sha(p.read_bytes()) for p in out.rglob('*') if p.is_file()};return {'exitCode':v.returncode,'existingOutputsUnchanged':True}
 for field,value in [('deno','2.9.8'),('v8','unapproved-v8'),('typescript','unapproved-typescript')]:
  for mode in ['--write','--check']:check(field+' mismatch '+mode+' rejects before altering existing outputs',lambda f=field,v=value,m=mode:reject_runtime(f,v,m))
 def reject_actual():
  out=base/'actual-298-absent';v=run([a.unapproved_deno,'run','--cached-only','--allow-read=.','--allow-write='+str(out),'tools/generate_lookalike_index.mjs','--write','--output-root',out]);assert v.returncode!=0 and 'Unreviewed index generation runtime' in v.stderr;assert not out.exists();return {'exitCode':v.returncode,'createdOutputs':False}
 if a.unapproved_deno:check('actual installed unapproved runtime writes zero files',reject_actual)
 def imported():
  bootstrap=base/'imported.mjs';bootstrap.write_text('Object.defineProperty(Deno,"version",{value:Object.freeze({...Deno.version,deno:"2.9.8"})});const{generateIndex}=await import('+json.dumps((ROOT/'tools/lookalike_data_lib.mjs').as_uri())+');await generateIndex();\n');v=run([a.deno,'run','--cached-only','--allow-read='+str(ROOT)+','+str(base),bootstrap]);assert v.returncode!=0 and 'Unreviewed index generation runtime' in v.stderr;return {'exitCode':v.returncode}
 check('imported generation function has the same early guard',imported)
 def reproduce():
  reports=[]
  for name in ['one','two']:
   out=base/name;v=run([a.deno,'run','--cached-only','--allow-read=.','--allow-write='+str(out),'tools/generate_lookalike_index.mjs','--write','--output-root',out]);assert v.returncode==0,v.stderr
   reports.append({str(p.relative_to(out)):sha(p.read_bytes()) for p in out.rglob('*') if p.is_file()})
  assert reports[0]==reports[1]
  for name,h in reports[0].items():assert sha((ROOT/name).read_bytes())==h,name
  return {'exactApprovedRuntimeOutputs':reports[0],'twoGenerationsEqualCurrentPins':True}
 check('approved runtime double generation equals current manifest and unchanged index',reproduce)
 check('strict foundation and index check prerequisites remain enforced',lambda:[{'entryPoint':name,'exitCode':v.returncode} if v.returncode==0 else (_ for _ in ()).throw(AssertionError(v.stderr)) for name in ['generate_reference_data.mjs','generate_lookalike_index.mjs'] for v in [run([a.deno,'run','--cached-only','--allow-read=.','tools/'+name,'--check'])]])
r['total']={'executed':len(r['checks']),'passed':sum(c['passed'] for c in r['checks']),'failed':len(r['failures'])};r['scope']='Runtime mismatches in child processes and actual wrong binary when supplied; only temporary generation paths, no source data update or weakened pins.';a.report.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r['total']));raise SystemExit(bool(r['failures']))
