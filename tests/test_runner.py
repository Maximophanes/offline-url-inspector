#!/usr/bin/env python3
"""Check runner reporting in temporary roots; never execute app/conformance suites."""
import contextlib
import io
import json
from pathlib import Path
import runpy
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

RUNNER=Path(__file__).resolve().parents[1]/'tools/test_all.py'

class RunnerReporting(unittest.TestCase):
    def exercise(self, requested=False, failure=None):
        with tempfile.TemporaryDirectory(prefix='offline-runner-report-') as folder:
            root=Path(folder);(root/'tools').mkdir();(root/'tests').mkdir()
            runner=root/'tools/test_all.py';shutil.copyfile(RUNNER,runner)
            # Stale reports must not count unless this invocation requests Firefox.
            stale={'suite':'Historical Firefox','total':{'executed':999,'passed':999,'failed':0},'assertions':{'executed':999,'passed':999,'failed':0}}
            for edition in ['standalone','hosted']:
                (root/f'tests/firefox-{edition}-results.json').write_text(json.dumps(stale))
            calls=[]
            def run(command, **kwargs):
                calls.append(command)
                task=command[-1]
                if task.startswith('test:firefox-'):
                    failed=failure is not None
                    report={'suite':task,'total':{'executed':0 if failure=='driver' else 1,'passed':0 if failed else 1,'failed':1 if failure=='assertion' else 0},'assertions':{'executed':0 if failure=='driver' else 1,'passed':0 if failed else 1,'failed':1 if failure=='assertion' else 0},'status':'not executed: browser startup failed' if failure=='driver' else 'executed'}
                    (root/('tests/'+task.replace('test:','')+'-results.json')).write_text(json.dumps(report))
                    return subprocess.CompletedProcess(command,1 if failed else 0,'','Controlled unavailable driver endpoint' if failure=='driver' else 'Controlled assertion failure' if failed else '')
                return subprocess.CompletedProcess(command,0,'','')
            class Server:
                def poll(self):return None
                def terminate(self):pass
                def wait(self, **kwargs):pass
            class Response:
                status=200
                def __enter__(self):return self
                def __exit__(self,*args):pass
            argv=[str(runner)]+(['--with-firefox'] if requested else [])
            code=0
            with patch.object(sys,'argv',argv),patch('subprocess.run',side_effect=run),patch('subprocess.Popen',return_value=Server()),patch('urllib.request.urlopen',return_value=Response()),contextlib.redirect_stdout(io.StringIO()):
                try:runpy.run_path(str(runner),run_name='__main__')
                except SystemExit as error:code=error.code
            return json.loads((root/'tests/summary-results.json').read_text()),calls,code

    def test_not_requested_does_not_claim_missing_driver_or_count_history(self):
        report,calls,code=self.exercise()
        self.assertEqual(code,0);self.assertTrue(report['firefox'].startswith('Not requested:'))
        self.assertIn('availability was not checked',report['firefox'])
        self.assertFalse(any(c[-1].startswith('test:firefox-') for c in calls))
        self.assertEqual(report['tests']['executed'],0)
        self.assertFalse(any('Firefox' in r['suite'] for r in report['suites']))

    def test_requested_success_uses_current_reports(self):
        report,_,code=self.exercise(requested=True)
        self.assertEqual(code,0);self.assertIn('both Firefox harnesses passed',report['firefox'])
        self.assertEqual(report['tests']['executed'],2);self.assertEqual(report['tests']['failed'],0)

    def test_unavailable_driver_fails_without_inventing_executed_tests(self):
        report,_,code=self.exercise(requested=True,failure='driver')
        self.assertEqual(code,1);self.assertIn('could not start',report['firefox'])
        self.assertEqual(report['tests']['executed'],0)
        self.assertTrue(all(not c['passed'] for c in report['commands'] if c['command'].startswith('test:firefox-')))

    def test_failed_execution_is_not_reported_as_not_requested(self):
        report,_,code=self.exercise(requested=True,failure='assertion')
        self.assertEqual(code,1);self.assertTrue(report['firefox'].startswith('Requested:'))
        self.assertIn('failed',report['firefox']);self.assertEqual(report['tests']['failed'],2)

if __name__=='__main__':unittest.main()
