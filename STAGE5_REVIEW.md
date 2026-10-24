# v3.3.0 Stage 5 handoff

**Public derivative.** This document is a sanitized derivative of the privately archived original `STAGE5_REVIEW.md` (SHA-256 `0389236822a899ef52f94a6c93444e48409d4fec3f558f7db204f992ccffaa04`; `repository-before-cleanup.tar.gz`, member `repository/STAGE5_REVIEW.md`). The original is not distributed in this public repository. Original dates, findings, verdicts, measurements, limitations and recorded source/evidence hashes remain historical; sanitization does not turn them into current acceptance claims.

Stage 5 implements unified structured comparisons and offline development packaging. Automatic findings remain outside the displayed UI. This is local development evidence, not release approval.

## 1. Verified baseline

Repository `<repository>`, branch `dev/v3.3.0-automatic-lookalikes`. HEAD, local main and local origin/main remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`. All Stage 4 inventories/source hashes were verified and all 336 starting files inventoried before edits. Stage 2/3/4 contracts and actual code/build/test adapters were inspected. Existing uncommitted work was preserved. No branch, staging, commit, push, PR, merge, deployment, dependency installation, data download or pin refresh occurred.

## 2. Exact files

Modified beyond starting Stage 4:

- `tools/build.py`: optional Stage 5 packaging, local index/source/notice checks, exact inert foundation text and preview metadata.
- `tests/dom-support.mjs`: test-only access to the packaged coordinator.
- `deno.json`: four Stage 5 tasks; `README.md`: discovery.
- `tests/unit-results.json`, `tests/idna-probe-results.json`, `tests/idna-review-results.json`: freshly executed reports identify actual Deno 2.9.8. Original fixtures/expectations are unchanged.

Created:

- `src/comparisons.js`.
- `tests/comparison-support.mjs`, `comparisons.mjs`, `comparison-dom.mjs`, `comparison-build.py`, `comparison-compatibility.mjs`, `comparison-benchmark.mjs`.
- `tests/comparison-results.json`, `comparison-dom-results.json`, `comparison-build-results.json`, `comparison-compatibility-results.json`, `comparison-benchmark-results.json`, `comparison-environment-results.json`, `comparison-stage5-integrity.json`.
- `COMPARISONS.md` and this review.

Existing application modules, including Stage 3 matcher and Stage 4 extractor/UI, remain unchanged. So do Stage 2/3/4 data, generators, contracts and historical integrity reports. Exact final inventories are in `tests/comparison-stage5-integrity.json`.

## 3. Architecture

`UnifiedComparisons.prepare(localAssets)` delegates verified foundation/index initialization. The coordinator synchronously evaluates an existing Inspector result, obtains Stage 4 evidence, shares matching/session work, reconciles sources and returns schema 1 without rewriting diagnostics. `COMPARISONS.md` specifies fields, four ID spaces, scopes, coverage and lifecycle. Optional precomputed embedded evidence must be trusted and from the same current inspection/reference list; the default obtains it directly.

## 4–5. Original and embedded integration

Automatic matching works without Expected Hostname or personal references. Invalid Expected Hostname preserves its error while original automatic analysis completes independently. Reliable embedded evidence remains even when the original exactly matches the manual target. Eligibility requires factual absolute HTTP(S), complete reliable native hostname evidence and supported interpretation limits. Ambiguous substrings, unresolved relatives and unsupported/incomplete paths remain excluded sources. Known positives survive partial extraction. No new visible panel/link was added.

## 6–7. Precedence and attribution

Expected Hostname remains primary; personal references retain their role; Majestic is supplemental and does not identify intended targets. Original/embedded roles and embedded comparisons to the original stay explicit. Built-in supports retain original GlobalRank, source row count, suffix/section and pinned identities. Exact/shared membership stays neutral. Full-host, registrable, UTS #39, finite ASCII, structural and spelling evidence retain distinct scopes/mechanisms.

Equivalent finite 5/s proof consolidates Expected/Personal/Majestic labels. Legacy manual rn/m UTS #39 and automatic finite ASCII proofs stay separately attributed. The algorithms were not changed to force one class. Strong evidence survives alongside spelling and neutral membership, including the existing tcl.com/td.com collision.

## 8. Cache reuse

Per-call identity includes native canonical host and actual supported matcher input, retaining reliable agreeing ASCII case. Equivalent roles/parents/decoding contexts share work, with independent attachments. Different case explanations cannot share incompatible results. One session shares inspection budgets. In measured 1/2/4/8-parent cases, 2/4/8/16 embedded occurrences require three matcher calls (original plus two embedded contexts), with 0/2/6/14 hits. Verified work stays two pairs/16 spelling states in that production-data example.

## 9. Stage 4 provenance

The reserved-domain principal example retains four occurrences and two exact recovered values:

| Embedded entry / occurrence | Hostname | Parent occurrence | Shared matching analysis |
|---:|---|---:|---:|
| 1 | middle.test | null | 2 |
| 2 | middle.test | null | 2 |
| 3 | inner.test | 1 | 3 |
| 4 | inner.test | 2 | 3 |

Original is analysis 1: five source attachments, three calls, two hits. `.test` is intentionally unsupported for automatic references, never a complete database negative. A parallel google.com/arnazon.com example produces actual built-in evidence with both child attachments. Source positions, parameters, parent IDs and complete/local decoding paths remain available. No repeated appearance becomes a fabricated unique destination.

## 10. Eight-entry cap

Twenty repeated values followed by a distinct host, duplicate query saturation with distinct path/fragment hosts, and nine repeated nested parents followed by a distinct host preserve the tested distinct evidence. Eight child edges retain correct respective parents. No new fairness defect justified changing the extractor. Overall discovery/occurrence/automatic coverage is partial when saturated even if recorded matching completed. Existing global node/text/depth bounds may still hide sufficiently late evidence; exhaustive discovery is not claimed.

## 11. Coverage and failure

Input validity, data readiness, recorded matching, discovery, occurrences, manual coverage, resource limitation and per-class/boundary states stay independent. Empty complete supported output differs from unsupported, unavailable and limited analysis. Missing/corrupt/incompatible indexes and missing crypto preserve manual/reference results and existing inspector behavior. Invalid Expected Hostname does not disable valid automatic analysis. No limited result is labeled an absence of suspicious embedded addresses.

## 12. Resources and async safety

Coordinator: 17 automatic contexts, 8,192 relationships and at most 33 source attachments. Matcher retains 32 IDs/pairs per host, shared 256 pairs/16,384 spelling states/50 ms, and 4,096 states per host. Extractor retains its independent 100 ms and all Stage 4 graph/node/text/depth/layer/fairness bounds. Existing manual/reference bounds are unchanged. Lowered tests cover host/relationship/pair/spelling/time exhaustion. No aggregate hard latency bound is claimed.

Only explicit asset preparation is asynchronous, receives no inspection and cannot publish findings. Evaluation is synchronous with private per-call caches. A newer inspection remains unchanged when earlier initialization completes. Stage 6 must add generation/cancellation guards if it introduces async per-inspection scheduling.

## 13. Privacy/security

No destination/DNS/WHOIS/certificate/reputation request, telemetry, inspected-value persistence, reference mutation, executable rendering, destination link, worker message, history dependence or runtime refresh was introduced. Both generated editions pass concealment/reveal-close/reinspection cleanup. Decoded parameter markup remains inert on reveal. Relevant hostname/provenance stays in memory; full private URLs are not duplicated into the analysis table or written to logs/storage.

## 14. Fresh evidence and environment discrepancy

| Executed evidence | Result |
|---|---:|
| Stage 5 integration | 56/56 tests, 601 assertions |
| Generated Stage 5 DOM/API, both editions | 16/16 tests, 628 assertions |
| Stage 5 isolated builds/integrity | 14/14 checks |
| Stage 4 model | 34/34 tests, 821 assertions |
| Stage 4 build/stable/Stage 2 reproduction | 15/15 checks |
| Stage 4 generated DOM nested in build | 22/22 tests, 658 assertions |
| Actual-runtime asset compatibility | 8/8 tests, 13 assertions |
| Actual-clock full coordinator | 400 evaluations, all complete |
| Stage 3 disjoint calibration | 10,000 domains; unchanged 2 ASCII / 5 spelling / 0 incomplete |
| Applicable established scope below | 109,486/109,486 checks |

Current Deno is 2.9.8, V8 `15.0.245.2-rusty`; reviewed generation is 2.9.7. No reviewed executable was found in inspected installation/cache locations; nothing was installed. Standard commands were executed with these remaining environment failures:

- `test:reference-foundation`: 160/162 passed. Two generation-related tests stop at the runtime guard before generation/completeness-negative validation. Behavioral/loader/fixture groups pass. This is not a complete fresh suite pass.
- `test:lookalikes`: 118/119 passed. Generation reproduction fails because generated manifest truthfully records 2.9.8, not 2.9.7. Exact reference, all 66 synthetic, evidence, boundary, budget, integrity and privacy cases pass.
- `test:lookalike-index`: rejects that manifest runtime difference; index bytes remain exact.

Separate compatibility diagnostics compile complete PSL rules, normalize all approved source rows/tiers, compare every tuple and accepted/excluded provenance record, and reproduce index bytes. All data and non-runtime manifest fields agree. No guard was bypassed, runtime identity impersonated or pin/expectation changed. Full failed attempts are retained in `tests/comparison-environment-results.json`. Historical foundation/matcher reports overwritten by these runs were recovered only after matching their previously verified starting SHA-256 exactly; they are not current passes.

Version-pinned refinement/clarity also ran on Stage 5: 198/199 and 44/45 pass, each failing only literal `Version 3.2.0`. Those attempts are preserved separately. Both complete suites pass freshly against unchanged stable artifacts; baseline passes are not Stage 5 preview acceptance. Original version/copy expectations were not weakened.

## 15. Regression-count reconciliation

Historical full v3.2.0 is 109,827 checks across 20 suites; its summary remains historical.

| Scope | Checks | Explanation |
|---|---:|---|
| Stage 3, eight suites | 109,172 | Full minus baseline DOM 157, refinement 199, polish 45, clarity 45, editorial 52, interface 12, reference presentation 19, Technical Details 17, release verifier 18, IDNA 64, ICU 19, HTTP 8: 655 omitted |
| Stage 4, nine suites | 109,131 | Stage 3 minus worker 25/hosted 64, plus interface 12/reference presentation 19/Technical Details 17: 41 fewer |
| Stage 5, fourteen applicable passing suites | 109,486 | Stage 4 plus worker 25, hosted 64, baseline DOM 157, polish 45, IDNA 64: 355 more |

Stage 5's exact totals: core/Unicode 108,664; references 70; differential 143; embedded 146; audit corrections 27; main/reference DOM 33; interface 12; reference presentation 19; Technical Details 17; worker 25; hosted 64; baseline DOM 157; polish 45; IDNA 64. Applicable DOM tests execute actual Stage 5 bundles; pure algorithms exercise current unchanged source. Worker/hosted remain lifecycle simulations. The new generated API suite additionally compares all 139 original core/reference fixtures in both current preview realms.

The remaining 341 from full scope are refinement 199, clarity 45, editorial 52, release verifier 18, ICU 19, HTTP 8. Refinement/clarity baseline/version attempts are separate as above. Editorial/copy inventory, full release verification, ICU and HTTP were outside preview acceptance. New/foundation/matcher/nested build totals are not added as a misleading full-release grand total.

## 16. Builds and integrity

`python3 -B tools/build.py --comparison-preview --output-root /private/tmp/oui-stage5-preview` builds outside the repository. Two independent builds are byte-identical. Standalone: 3,413,015 bytes, SHA-256 `8969537c265b92e1468293a0e83550abf877992b3b67ca37ad388d82304e15ae`; hosted: 3,425,075 bytes, SHA-256 `433fc66e5614f60882eecb1d51ae2ae78e3a8c6d12e4ba85566711bb8ff476ec`. Each grows 530,058 bytes above Stage 4. Existing CSP/style restrictions and complete-document worker binding pass. Index/data stay inert until explicit initialization. Old Stage 4, Stage 2 and stable v3.2.0 bytes reproduce exactly. Release verifier/workflows/root checksums/lock/public artifacts/baseline refs remain unchanged. Final hashes/syntax/diff evidence are in `tests/comparison-stage5-integrity.json`.

## 17. Measurements and remaining limits

Five actual-clock local initialization samples: median 172.93 ms, maximum 276.91 ms while other checks ran. In 100 evaluation samples per 1/2/4/8-parent case, all 400 completed. Two parents: median 0.264 ms / p95 1.066 ms; eight: 0.311 ms / 0.731 ms. These are local Deno work/feasibility measurements, not native-browser, cold-page, peak-memory, speedup or deadline acceptance.

Runtime generation remains constrained to reviewed 2.9.7; compatibility diagnostics do not approve refresh. Unknown/PRIVATE/RTL boundary rules, lower-bound occurrence graphs and cooperative timing remain explicit. Native Firefox/Safari, VoiceOver, browser-memory acceptance and final licensing/source-availability/distribution review remain unperformed. Optional precomputed evidence must belong to the current inspection; arbitrary stale objects are outside the contract.

## 18. Stage 6 readiness and stop

The API is implemented and exercised end to end through extraction, matching, reconciliation and occurrence attachment, ready for separately authorized Stage 6 with the runtime-generation limitation recorded. Stage 6 must initialize once, consume current structured results without reparsing, preserve intent/neutral membership/partial coverage, implement accessibility/cleanup, and add cancellation if scheduling becomes asynchronous. No automatic startup/display activation, new main-results panel, redesign or Stage 7 hardening occurred. Work stops after Stage 5.
