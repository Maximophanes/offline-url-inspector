# Version 3.2.0 — approved security audit corrections

Date: 2026-10-21. Corrected local candidate: **3.2.0-a67e4b13dd5fa5cd**.

## State and scope

Started clean on `dev/v3.2.0-embedded-url-analysis`, HEAD `90649ff263a2d938010079dcf6b3fe1cb84724f3`, with stable main `d9aed1dc333bb51d2126fa79059a839292b36615`. HEAD/main remain at those commits. All corrections are local, unstaged and uncommitted. PR #2 remains Draft and unchanged; nothing was pushed, merged, published or deployed.

This implements the three authorized corrections. It does not repeat the independent release audit. The optional nested-occurrence provenance enhancement and all future detection features remain deferred. No presentation, stylesheet, storage, reference, Unicode, worker logic, dependency or deployment change was made.

## Post-audit snapshot-fixture correction

The focused re-audit found no remaining production blocker, but identified a test-fixture failure after a future commit. The old historical fixture followed moving HEAD, omitted `tests/audit-correction-source-boundaries.json`, and always expected 13 unchanged protected files. A corrected committed tree instead requires that metadata and must classify 12 unchanged files plus the approved core exception.

Only `tests/release-verifier.py`, regenerated evidence/integrity records, checksums and supporting documentation changed in this follow-up. Production sources, the production verifier, generated HTML/CSS/worker bytes, manifest, dependencies and candidate identifier remain byte-identical to the independently reviewed `3.2.0-a67e4b13dd5fa5cd` state.

The historical fixture now resolves the fixed `startingCommit` recorded in the correction metadata. It uses real read-only Git blob queries and verifies 13 unchanged protected files with no core exception. It no longer follows HEAD. This fixed historical reference is distinct from hardcoding the current HEAD as a release expectation.

A separate corrected-snapshot case reuses the complete copied local candidate, including correction metadata and its full checksum inventory. It projects a distinct future commit identity, clean status and corresponding Git file inventory, then runs the unchanged production verifier and checks 12 unchanged files plus exactly the approved core exception. No Git commit, object, branch or ref is created. Only Git metadata is simulated; source, artifact, CSP, manifest, worker and full checksum checks execute normally. Historical artifact-only verification deliberately omits its checksum inventory; corrected local and projected clean-commit verification both include it.

New missing/inconsistent-metadata negatives and all existing unauthorized-source/artifact/CSP/checksum negatives operate only on the disposable copied fixture. Assertions and protected-source checks were not weakened.

Executed validation: the focused verifier suite passes **18 cases**, and the applicable full suite passes **109,827 checks / 130,743 assertions**, zero failures. The existing 27 correction checks / 841 assertions, 146 embedded checks / 533 assertions, original 139 result fixtures, privacy/reference/worker simulations, loopback HTTP and Unicode/ICU regressions also pass. These are newly executed results for this test-only follow-up; the performance table below remains the earlier production-correction measurement and was not rerun here.

The candidate is ready for focused manual acceptance testing and eventual commit after review. Native Firefox checks remain outstanding; the clean-commit test is a simulation rather than an actual newly committed checkout. All changes remain unstaged and uncommitted; main and Draft PR #2 are untouched.

## Corrections

1. Fragment dispatch previously interpreted literal `=`/`&` before considering an encoded whole address. A bounded strict-decoding prefix probe now schedules eligible whole-fragment evidence through the existing value decoder, alongside the original parameter interpretation. It never replaces outer component boundaries. Already-literal HTTP(S) fragments avoid duplicate queue work. Remaining recognizable decoding beyond the limit produces an explicit partial state.
2. Relative references previously chose query interpretation instead of remaining whole-value decoding. Both eligible states now run under the existing shared depth, text, node and candidate limits. Native URL parsing, provenance, strict UTF-8 handling and the two-layer allowance remain authoritative.
3. The release verifier previously required candidate HEAD to equal stable main. It now resolves an explicit expected candidate commit (`--candidate`, default HEAD), checks its identity and baseline ancestry, reports local changes separately, and retains source/artifact, CSP, manifest, worker and checksum validation. Inventory validation also rejects missing/duplicate entries. The only core baseline exception is the exact recorded preprocessing delta; all other core bytes and protected files must still match.
4. The hostname/port predicate had overlapping greedy hostname matches. One linear authority-token match plus the equivalent internal-dot/localhost test replaces it. Component extraction reuses preparation already performed for top-level and recovered URLs. Initialization elapsed time is checked before queue expansion. The cooperative 100 ms deadline is not a hard execution guarantee.

The exact approved source edits are recorded in `tests/audit-correction-source-boundaries.json`. Historical whole-source and complete-result pins were not repinned: restoring only these exact edits must recover the original pinned source. Additional core edits are rejected. The unchanged output fixtures and differential tests independently check behavior.

## Confirmed reproductions

| Case | Corrected model and simulated UI result |
|---|---|
| A: `https://example.test/#https%3A%2F%2Fother.test/path?x=1` | `other.test`, layer 1, fragment provenance, complete status and visible off-host notice; original exact match retained |
| B: `https://example.test/#https%3A%2F%2Fexample.test%40attacker.test/login?x=1` | `attacker.test`, layer 1, userinfo caution and visible actual-host highlight; original exact match retained |
| C: `https://example.test/?next=%2Flogin%3Fnext%253Dhttps%253A%252F%252Fother.test` | `other.test`, layer 2, query provenance and visible off-host notice; relative evidence retained |

These are recovered text interpretations, not verified redirects or final destinations.

Adjacent tests cover literal ampersands, twice-encoded fragment prefixes, encoded scheme letters and hashes, fragment routes, encoded relative separators, repeated competing hosts, malformed escapes/UTF-8, third-layer and overlength limits, opaque unsupported fragments, component/candidate limits, original-host preservation, initialization exhaustion, and evidence reveal/close/reinspection. Ordinary encoded fragment data remains quiet. A 684-input preparation comparison against the pre-correction implementation preserves values, index maps, assumptions and errors.

## Newly executed validation

- Targeted correction suite: **27 checks / 841 assertions passed**.
- Existing embedded suite: **146 checks / 533 assertions passed**.
- Release-verifier suite: **18 positive/negative cases passed**. Includes the pinned historical pre-correction source/artifacts, the corrected working candidate, a clean future-commit projection with complete metadata, missing/inconsistent correction metadata, explicit candidate mismatch, protected/core/source tampering, both artifact editions, CSP/release/worker mismatch, and incorrect/missing/duplicate checksums. Mutations occur only in a disposable temporary copy; no commits or branches are created.
- Final full suite: **109,827 checks / 130,743 assertions passed**, zero failures. Includes complete original result/diagnostic pins, reference/storage/privacy/DOM regressions, simulated hosted/worker lifecycle, actual loopback HTTP/CSP, official Unicode conformance and independent ICU diagnostics.
- All twelve pinned Unicode sources verified. The original 139 inspection/reference fixtures and their result pins remain unchanged.
- Deterministic repeat-build and final integrity details are recorded in `tests/audit-corrections-integrity.json`; settled checksums and verifier evidence are in `SHA256SUMS` and `tests/release-checks.json`.

The ordinary sandbox denied loopback socket binding. The authorized full runner was then executed with that restriction lifted and shut down its own loopback server. No inspected destination was contacted. No dependencies were installed or updated.

## Before/after performance

Fresh same-runtime comparison of the exact before/after implementations, three iterations per size; medians in milliseconds. Includes top-level inspection, supplemental initialization and queued analysis, excludes rendering. Runtime: Deno 2.9.7 / V8 15.0.245.2-rusty.

| Input units | Before inspect | Before supplemental | Before combined | After inspect | After supplemental | After combined |
|---:|---:|---:|---:|---:|---:|---:|
| 1029 | 2.5 | 3.1 | 5.6 | 1.8 | 0.6 | 2.4 |
| 4029 | 18.3 | 29.1 | 47.4 | 5.0 | 2.2 | 7.4 |
| 8029 | 60.2 | 105.2 | 165.4 | 9.7 | 4.6 | 14.0 |
| 16029 | 223.2 | 405.1 | 630.5 | 18.0 | 8.6 | 27.0 |
| 32729 | 880.0 | 1688.0 | 2568.0 | 38.0 | 18.9 | 56.9 |

All corrected dotted-host runs recovered `other.test` with complete status. The largest combined median fell from approximately 2,568 ms to 57 ms. Long invalid-DNS hostnames still require bounded character/diagnostic work. Cooperative checks cannot preempt a single operation, garbage collection, DOM work or browser scheduling; slower hardware can exceed these measurements. No native Firefox timing or heap bound is claimed.

## Security and manual verification boundary

No inspected-destination requests, navigation, persistence, executable DOM sinks, clickable recovered addresses or additional network capability was introduced. Existing text-node rendering, hostname-first notices, concealed parameter/userinfo/full-value evidence, cleanup and reference exports remain unchanged. Styles, highlights, comparison algorithms, storage schema, worker scope/logic, CSP policy and deployment configuration retain their identities.

No new native Firefox or in-app browser session was run. Earlier browser reports and screenshots describe their recorded older hashes. For this corrected candidate, manually verify both editions' A/B/C results, initial exact-match notices, userinfo explanation, evidence concealment/cleanup, pagination/focus, VoiceOver, native zoom/Unicode wrapping, large-input responsiveness, standalone CSP/file policy, and hosted cached disconnected startup plus matched-build updates/reference retention.

The implementation and automated validation are ready for a **narrow independent re-audit of the three corrections**. This is not native-browser certification or authorization to publish.

## Changed-file inventory

This includes implementation, regression support, recorded results, generated assets and documentation. All remain unstaged.

- `AUDIT_CORRECTIONS.md`
- `CHANGELOG.md`
- `EMBEDDED_EDITORIAL_REVIEW.md`
- `EMBEDDED_URL_REVIEW.md`
- `HOSTNAME_HIGHLIGHT_REVIEW.md`
- `README.md`
- `SECURITY_REVIEW.md`
- `SHA256SUMS`
- `TEST_RESULTS.md`
- `build-manifest.json`
- `deno.json`
- `site/index.html`
- `site/sw.js`
- `src/core.js`
- `src/embedded.js`
- `standalone/Offline_URL_Inspector.html`
- `tests/audit-correction-source-boundaries.json`
- `tests/audit-corrections-integrity.json`
- `tests/audit-corrections-results.json`
- `tests/audit-corrections.mjs`
- `tests/copy-inventory.json`
- `tests/differential.mjs`
- `tests/embedded-benchmark.json`
- `tests/embedded-benchmark.mjs`
- `tests/embedded.mjs`
- `tests/harness.mjs`
- `tests/interface.mjs`
- `tests/release-checks.json`
- `tests/release-verifier-results.json`
- `tests/release-verifier.py`
- `tests/summary-results.json`
- `tests/technical.mjs`
- `tools/test_all.py`
- `tools/verify_release.py`
