# Current v3.3.0 build and checks

The final v3.3.0 application is deployed. Use these commands only when a change needs build/package validation or a future deployment has been authorized. Routine maintenance does not require a new release candidate, stage review or repeated audit.

Use a fresh, empty directory outside the checkout:

```sh
python3 -B tools/build.py --final-release --output-root /private/tmp/oui-330-final
python3 -B tools/verify_release.py --release-root /private/tmp/oui-330-final
python3 -B tests/current-release.py --release-root /private/tmp/oui-330-final --report /private/tmp/oui-current-release.json
```

The build uses Python's standard library and pinned local inputs. The verifier checks all eight output files, their manifest/checksums, CSP, offline legal/source materials and worker pairing, then rebuilds to establish exact source correspondence. Python/zlib versions are recorded; archive bytes are compared under the same toolchain. Do not edit generated hashes or overwrite the committed v3.2.0 rollback set.

Run only relevant current tests during maintenance. The manually authorized deployment additionally runs the existing current prerequisite gate, without historical stage replay:

```sh
python3 -B tools/release_gate.py --release-root /private/tmp/oui-330-final --deno /path/to/verified/deno-2.9.7 --report /private/tmp/oui-final-gate.json
```

Data reproduction requires Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3. Tests use the frozen lockfile and cached Happy DOM dependency. Do not refresh datasets or historical assertions for housekeeping.

The final manifest declares `releaseVersion: "3.3.0"`, `buildKind: "final"` and `releaseCandidate: false`. Its source-input digest identifies enumerated bytes; it is not a Git commit or approval. `publicationAuthorized: false` means build creation grants no deployment authority. The build's preparation-only declaration remains a packaging safeguard even after an authorized deployment.

The eight-file bundle contains both editions, the matching hosted worker and `.nojekyll`, source materials, notices, manifest and checksums. Keep these together for build distribution. Each HTML also retains offline notices and PSL source. [DEPLOYMENT.md](DEPLOYMENT.md) describes explicit authorization and exact commit/source checks; [UPDATES_AND_ROLLBACK.md](UPDATES_AND_ROLLBACK.md) covers recovery and storage compatibility.

The [historical RC interface](RELEASE_CANDIDATE.md) and original historical test scripts are retained for compatibility, not as routine maintenance requirements.
