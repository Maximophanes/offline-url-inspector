#!/usr/bin/env python3
"""Fail closed on explicit RC/final build/data/current-regression prerequisites. No deploy."""
import argparse,json,pathlib,shutil,subprocess,tempfile
from release_candidate import verify,RUNTIME
ROOT=pathlib.Path(__file__).resolve().parents[1]
def gate(candidate,deno,report_path=None,*,final_release=False):
    report={'suite':'v3.3.0 '+('final' if final_release else 'RC')+' mandatory release gate','checks':[],'failures':[]}
    actual=json.loads(subprocess.check_output([str(deno),'eval','console.log(JSON.stringify(Deno.version))'],text=True))
    if actual!=RUNTIME:raise ValueError('Unapproved generation runtime: '+str(actual))
    report['runtime']=actual;report['artifactVerification']=verify(ROOT,candidate,final_release=final_release)
    with tempfile.TemporaryDirectory(prefix='oui-release-gate-') as folder:
        dest=pathlib.Path(folder)/'checkout';shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
        commands=[('foundation-reproduction',['run','--cached-only','--allow-read=.','tools/generate_reference_data.mjs','--check'],None),('index-reproduction',['run','--cached-only','--allow-read=.','tools/generate_lookalike_index.mjs','--check'],None),('foundation-and-PSL',['run','--cached-only','--allow-read=.','--allow-write=tests','tests/reference-foundation.mjs'],'reference-foundation-results.json'),('current-matcher',['run','--cached-only','--allow-read=.','--allow-write=tests','tests/stress-engine.mjs'],'stress-engine-results.json'),('current-candidate-messages-privacy-accessibility',['run','--cached-only','--allow-read=.,'+str(candidate),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/final-copy-results.mjs','--development-root='+str(candidate)],'final-copy-results.json'),('supported-embedded-result-regression',['run','--cached-only','--allow-read=.,'+str(candidate),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/stage8-results.mjs','--development-root='+str(candidate)],'stage8-results.json'),('atomic-worker-lifecycle',['run','--cached-only','--allow-read=.','--allow-write=tests','tests/service-worker.mjs'],'service-worker-results.json'),('hosted-update-controls',['run','--cached-only','--allow-read=.','--allow-write=tests','tests/hosted-bootstrap.mjs'],'hosted-bootstrap-results.json')]
        for script in ['ui-polish','import-preview']:
            commands.append(('current-'+script,['run','--cached-only','--allow-read=.,'+str(candidate),'--allow-write=tests','--allow-env=WS_NO_BUFFER_UTIL,WS_NO_UTF_8_VALIDATE','tests/'+script+'-results.mjs','--development-root='+str(candidate)],script+'-results.json'))
        for name,args,output in commands:
            r=subprocess.run([str(deno),*args],cwd=dest,capture_output=True,text=True);entry={'name':name,'exitCode':r.returncode}
            if output and (dest/'tests'/output).exists():entry['report']=json.loads((dest/'tests'/output).read_text())
            if r.returncode:entry['error']=(r.stdout+r.stderr)[-6000:];report['failures'].append(name)
            report['checks'].append(entry);print(('PASS ' if r.returncode==0 else 'FAIL ')+name,flush=True)
        for name in ['unit','references','embedded-provenance','comparisons','comparison-compatibility']:
            args=[str(deno),'run','--cached-only','--allow-read=.','--allow-write=tests','tests/'+name+'.mjs']
            r=subprocess.run(args,cwd=dest,capture_output=True,text=True)
            entry={'name':name,'exitCode':r.returncode}
            output=dest/'tests'/('comparison-results.json' if name=='comparisons' else name+'-results.json')
            if output.exists():entry['report']=json.loads(output.read_text())
            if r.returncode:entry['error']=(r.stdout+r.stderr)[-6000:];report['failures'].append(name)
            report['checks'].append(entry);print(('PASS ' if r.returncode==0 else 'FAIL ')+name,flush=True)
        generator_report=pathlib.Path(folder)/'stage8-generators.json'
        r=subprocess.run(['python3','-B',str(ROOT/'tests/stage8-generators.py'),'--deno',str(deno),'--report',str(generator_report)],cwd=ROOT,capture_output=True,text=True)
        entry={'name':'early-generator-runtime-rejection','exitCode':r.returncode}
        if generator_report.exists():entry['report']=json.loads(generator_report.read_text())
        if r.returncode:entry['error']=(r.stdout+r.stderr)[-6000:];report['failures'].append(entry['name'])
        report['checks'].append(entry);print(('PASS ' if r.returncode==0 else 'FAIL ')+entry['name'],flush=True)
    report['passed']=not report['failures']
    if report_path:report_path.write_text(json.dumps(report,indent=2)+'\n')
    if not report['passed']:raise ValueError('Release prerequisite failed: '+', '.join(report['failures']))
    return report
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);mode=p.add_mutually_exclusive_group(required=True);mode.add_argument('--candidate-root',type=pathlib.Path);mode.add_argument('--release-root',type=pathlib.Path);p.add_argument('--deno',type=pathlib.Path,required=True);p.add_argument('--report',type=pathlib.Path);a=p.parse_args();gate((a.release_root or a.candidate_root).resolve(),a.deno.resolve(),a.report,final_release=bool(a.release_root))
