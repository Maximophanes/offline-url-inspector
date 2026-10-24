#!/usr/bin/env python3
"""Verify current final bytes, then preserve the exact accepted RC history."""
import argparse,hashlib,json,pathlib,shutil,subprocess,sys,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from release_candidate import verify
sha=lambda raw:hashlib.sha256(raw).hexdigest()
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--release-root',type=pathlib.Path,required=True)
p.add_argument('--deno',type=pathlib.Path,required=True)
p.add_argument('--report',type=pathlib.Path,required=True)
a=p.parse_args()
report={'suite':'Final promotion and unchanged accepted RC historical interfaces','artifactVerification':verify(ROOT,a.release_root,final_release=True),'checks':[],'failures':[]}
with tempfile.TemporaryDirectory(prefix='oui-promotion-history-') as folder:
    dest=pathlib.Path(folder)/'source'
    shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('.git','.agents','.codex','.aws','__pycache__','node_modules'))
    boundaries=json.loads((ROOT/'tests/release-promotion-source-boundaries.json').read_text())
    for name,b in boundaries['files'].items():
        assert sha((dest/name).read_bytes())==b['currentSHA256'],name
        previous=b['previousSource'].encode()
        assert sha(previous)==b['previousSHA256'],name
        (dest/name).write_bytes(previous)
    baseline=subprocess.check_output(['git','--no-optional-locks','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)
    (dest/'stable-builder-baseline.txt').write_bytes(baseline)
    script=dest/'tests/ui-polish-regressions.py'
    source=script.read_text()
    old="\n baseline=subprocess.check_output(['git','show','664cc58bf67a2127d0523adec9f1d80c6edd656e:tools/build.py'],cwd=ROOT)"
    assert source.count(old)==1
    script.write_text(source.replace(old,"\n baseline=(ROOT/'stable-builder-baseline.txt').read_bytes()"))
    inner=pathlib.Path(folder)/'accepted-history.json'
    log=a.report.with_suffix('.log')
    with log.open('w') as stream:
        result=subprocess.run(['python3','-B','tests/ui-polish-regressions.py','--candidate-root',str(a.release_root.resolve()),'--deno',str(a.deno.resolve()),'--report',str(inner)],cwd=dest,stdout=stream,stderr=subprocess.STDOUT)
    entry={'name':'unchanged-accepted-rc-and-earlier-history','exitCode':result.returncode,'report':json.loads(inner.read_text()) if inner.exists() else None}
    report['checks'].append(entry)
    if result.returncode:report['failures'].append(entry['name']);entry['error']=log.read_text()[-10000:]
report['passed']=not report['failures']
report['scope']='Current final artifacts are rebuilt/verified first; current UI/import assertions run on those final bytes. Only six hash-checked release-engineering/documentation interfaces are then restored in a disposable copy for the unchanged accepted historical chain. Original pins/assertions remain intact. Nested totals overlap; historical source passes do not establish current-final behavior.'
a.report.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'passed':report['passed'],'failures':report['failures']}))
raise SystemExit(not report['passed'])
