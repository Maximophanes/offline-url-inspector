#!/usr/bin/env python3
"""Focused final-package and manual-workflow checks; no RC or historical replay."""
import argparse
import json
from pathlib import Path
import re
import shutil
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from release_candidate import verify


def workflow_checks():
    text = (ROOT / '.github/workflows/deploy-pages.yml').read_text()
    triggers = text.split('\non:\n', 1)[1].split('\npermissions:', 1)[0]
    assert re.findall(r'^  ([a-z_]+):', triggers, re.M) == ['workflow_dispatch']
    verify_job, deploy_job = text.split('\n  deploy:', 1)
    for required in [
        "if: github.ref == 'refs/heads/main' && inputs.authorize_deployment",
        'default: false', 'persist-credentials: false',
        'test "$EXPECTED_COMMIT" = "$GITHUB_SHA"',
        'test "$(git rev-parse HEAD)" = "$GITHUB_SHA"',
        '--final-release --output-root "$RUNNER_TEMP/final"',
        '--release-root "$RUNNER_TEMP/final"',
        'tools/release_gate.py', 'tests/current-release.py',
        'm["releaseCandidate"] is False', 'm["publicationAuthorized"] is False',
        'm["sourceIdentity"]["inputsSHA256"]==os.environ["EXPECTED_SOURCE"]',
        'group: pages', 'cancel-in-progress: false',
        'path: ${{ runner.temp }}/final/site', 'include-hidden-files: true',
        'if-no-files-found: error',
    ]:
        assert required in verify_job, required
    assert 'pages: write' not in verify_job and 'id-token: write' not in verify_job
    for required in ['needs: verify', 'pages: write', 'id-token: write',
                     'name: github-pages', 'ref: main', 'persist-credentials: false',
                     'test "$(git rev-parse HEAD)" = "$GITHUB_SHA"']:
        assert required in deploy_job, required
    assert 'historical-results' not in text and 'release-promotion' not in text
    actions = re.findall(r'uses: ([^\s]+)', text)
    assert actions == [
        'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
        'actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9',
        'actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9',
        'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
        'actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346',
    ]
    return {'manualAuthorization': True, 'immutableActions': actions,
            'hostedExecution': 'NOT PERFORMED'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-root', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    args = parser.parse_args()
    release = args.release_root.resolve()
    assert ROOT not in args.report.resolve().parents, 'Keep reports outside the repository'
    report = {'suite': 'Current final packaging and deployment safeguards', 'checks': []}

    def check(name, fn):
        try:
            value = fn()
            report['checks'].append({'name': name, 'passed': True, 'evidence': value})
        except Exception as error:
            report['checks'].append({'name': name, 'passed': False, 'error': str(error)})

    check('current final artifact integrity',
          lambda: verify(ROOT, release, rebuild=False, final_release=True))
    check('manual workflow and deployment guards', workflow_checks)

    def reject(mutate):
        with tempfile.TemporaryDirectory(prefix='oui-current-package-') as folder:
            copy = Path(folder) / 'build'
            shutil.copytree(release, copy)
            mutate(copy)
            try:
                verify(ROOT, copy, rebuild=False, final_release=True)
            except ValueError as error:
                return str(error)
            raise AssertionError('Invalid package accepted')

    for name in ['NOTICES.txt', 'source-materials.zip', 'site/.nojekyll']:
        check('reject missing ' + name,
              lambda name=name: reject(lambda copy: (copy / name).unlink()))
    check('reject extra hosted asset',
          lambda: reject(lambda copy: (copy / 'site/debug.js').write_text('debug')))

    def forge_authorization(copy):
        path = copy / 'build-manifest.json'
        manifest = json.loads(path.read_text())
        manifest['publicationAuthorized'] = True
        path.write_text(json.dumps(manifest, indent=2) + '\n')

    check('reject forged publication authorization', lambda: reject(forge_authorization))
    check('reject changed worker',
          lambda: reject(lambda copy: (copy / 'site/sw.js').write_text('mismatched')))
    report['passed'] = all(item['passed'] for item in report['checks'])
    report['scope'] = 'Current artifacts and local workflow structure; no rebuild, RC, historical replay, live deployment or browser certification.'
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
