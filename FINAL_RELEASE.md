# Final v3.3.0 build preparation

The reviewed starting point is commit `f41c5e391619bb73176168045e9c7aaef93410dc`, whose RC is `3.3.0-rc.1-85f424f1dcdbc82d` with source-input digest `46920aaa3bf541a314a87c1b7fa9775c73070489f43e3e372f0590b9eb7986fd`. Final-version preparation creates new bytes from source. It does not rename the RC or authorize publication, merge, tagging or deployment. Stable v3.2.0 and the Draft PR remain unchanged.

Use a fresh, empty directory outside the checkout:

```sh
python3 -B tools/build.py --final-release --output-root /private/tmp/oui-330-final
python3 -B tools/verify_release.py --release-root /private/tmp/oui-330-final
python3 -B tools/release_gate.py --release-root /private/tmp/oui-330-final --deno /path/to/verified/deno-2.9.7 --report /private/tmp/oui-final-gate.json
python3 -B tests/release-promotion.py --task-root /private/tmp/oui-promotion-tests --deno /path/to/verified/deno-2.9.7
python3 -B tests/release-promotion-regressions.py --release-root /private/tmp/oui-330-final --deno /path/to/verified/deno-2.9.7 --report /private/tmp/oui-final-history.json
```

The final manifest has `releaseVersion: "3.3.0"`, `buildKind: "final"`, `releaseCandidate: false`, `developmentOnly: false`, `releasePreparationOnly: true` and `publicationAuthorized: false`. Its release ID is `3.3.0-<hosted HTML SHA-256 prefix>`. The visible labels, executable APP version, offline legal scope, CSP, worker identity, source archive and checksums are rebuilt together. Final verification rejects RC identity; [RC verification](RELEASE_CANDIDATE.md) rejects final identity. Default historical builds retain v3.2.0 guards.

Both modes enforce the same data, strict generator-runtime, source correspondence, eight-file packaging, notice, CSP and worker checks. The final release gate additionally exercises current UI polish and import previews. The new historical wrapper checks exact before/after source hashes, restores only recorded release-engineering interfaces in a disposable copy and runs the unchanged historical chain. Historical passes do not substitute for current-final checks. Use a complete Git checkout for the gate; the allowlisted companion source archive provides build/data reproduction inputs, not the entire historical test checkout.

Builds use Python's standard library offline. Record Python and zlib versions; two builds with the same toolchain must match all eight output files. Data reproduction requires Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3, the frozen lockfile and cached test dependencies. Do not refresh source snapshots or repin historical assertions. `sourceIdentity.inputsSHA256` identifies enumerated source bytes, not a Git commit or acceptance decision. Rebuild after any listed input changes.

The manual Actions workflow explicitly uses `--final-release` and `--release-root`, then rejects unexpected final metadata and an unaccepted source digest. It has no push trigger. A future dispatch needs the exact reviewed commit on main, explicit deployment authorization and applicable environment approval. Neither the build manifest nor a successful local test grants that authorization. Only the freshly verified `final/site` three-file set is uploaded to Pages; the preserved root v3.2.0 outputs are never deployment inputs. Keep the complete eight-file bundle for download/audit distribution. Offline notices and exact PSL source remain inside each HTML.

The user reports successful macOS backup round trip, keyboard-only navigation, VoiceOver and physical-device acceptance of the RC. These were not rerun during version promotion. New final bytes require exact acceptance; actual GitHub-hosted Linux reproduction, protected-environment enforcement, live Pages update/rollback and any unperformed browser/platform coverage remain separate gates. See [deployment safeguards](DEPLOYMENT.md), [rollback compatibility](UPDATES_AND_ROLLBACK.md) and the exact local results in [FINAL_VERSION_PROMOTION.md](FINAL_VERSION_PROMOTION.md).
