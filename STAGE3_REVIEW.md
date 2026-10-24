# v3.3.0 Stage 3 implementation handoff

Stage 3 is complete locally: a dormant automatic matching engine, deterministic validated indexes, bounded evidence and disjoint calibration. No user-facing findings or application orchestration was activated. The engine is development work, not a release recommendation.

## 1. Verified starting state

Started on `dev/v3.3.0-automatic-lookalikes` with HEAD, local main and local origin/main at `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Verified every Stage 2 inventory/source hash before edits, read STAGE2_REVIEW.md and REFERENCE_DATA.md, and checked offline generation. The existing uncommitted Stage 2 changes were preserved. No branch, commit, push, PR, merge, deployment or external data refresh occurred. All changes remain unstaged/uncommitted.

## 2. Files changed in Stage 3

Modified only `README.md` and `deno.json` beyond the Stage 2 state. The existing `tools/build.py` modification belongs to Stage 2 and was not changed here.

Created:

- Engine: `src/lookalikes.js`.
- Assets: `data/lookalikes/index.json`, `manifest.json`, `NOTICE.txt`.
- Tooling: `tools/lookalike_data_lib.mjs`, `generate_lookalike_index.mjs`, `extract_lookalike_calibration.py`.
- Harnesses: `tests/lookalikes.mjs`, `lookalike-corpus.mjs`, `lookalike-fixtures.mjs`, `lookalike-calibration.mjs`, `lookalike-benchmark.mjs`.
- Inputs: `tests/data/lookalikes/calibration-source.csv`, `calibration-source.json`, `synthetic.json`.
- Evidence: `tests/lookalike-results.json`, `lookalike-calibration-results.json`, `lookalike-benchmark-results.json`, `lookalike-reproduction-results.json`, `lookalike-stage3-integrity.json`.
- Documentation: `LOOKALIKES.md` and this file.

No dependency, workflow or existing application module changed. The final integrity report inventories new files and binds source/report identities, excluding itself.

## 3. Matching classes

Implemented exact neutral membership, full-domain Unicode visual, explained finite ASCII visual, complete-label structural placement, and conservative distance-one spelling. The small public interface and structured output contract are documented in LOOKALIKES.md. There is no numerical maliciousness/ownership score.

## 4. Exact membership

All 9,570 references recognize their registrable identity and original minimum Majestic GlobalRank, including genuine subdomains, root dots, PRIVATE tenants and readable/A-label IDNs. Membership is neutral and suppresses spelling-only findings. It does not assert legitimacy or safety. Genuine separately supported visual relationships between two included domains remain technical evidence: `tcl.com`/`td.com` is the current two-reference ASCII-key collision. Presentation of that situation remains later integration work.

## 5. Unicode and ASCII evidence

Reused pinned Unicode 18.0.0 / UTS #39 rev.34 skeleton, script and character infrastructure and the existing finite ASCII key/explanation functions. Unicode findings retain reproducible full strings/skeleton, scripts, changed spans and bounded character properties; A-label equivalents preserve the mechanism. RTL/bidi is partial/unsupported. ASCII findings require an actual supported sequence explanation and record font dependence. No new ambiguity classes were added.

## 6. Structural placement

References must occupy complete labels wholly outside the actual registrable domain. Occurrence offsets and actual boundary/rule context are retained. Substrings and sequences crossing a PRIVATE registrant boundary do not match. Repeating a reference name inside that same reference's legitimate subdomain does not produce an independent placement finding. Multi-reference placements sort deterministically and retain distinct occurrences.

## 7. Spelling policy

The approved <=1,000 cutoff still contains 883 references; 534 meet the documented six-character ASCII/readable eligibility rules and enter the dictionary. Verification reuses existing optimal-string-alignment distance exactly one: insertion, deletion, substitution or adjacent transposition. Same recognized suffix is required. Initial-character edits, duplicate initial insertion, numeric-suffix-only differences, simple hyphen insertion/deletion, short names, distance two, encoded A-label spellings, cross-suffix spelling and exact built-in membership are suppressed. Evidence stays low priority. Calibration did not justify a recurring-pair suppression registry, so none was added.

## 8. Boundaries and IDNs

The native URL/Inspector path and exact Stage 2 PSL remain authoritative. Both ICANN and PRIVATE rules apply. Unknown, suffix-only, IP, single-label, malformed and over-limit hostnames have explicit coverage/status outcomes; they cannot become successful negatives. Cross-suffix registrant-only comparison is deliberately unsupported. Independent private tenants remain separate.

## 9. Index architecture and sizes

One-time preparation validates source/record/Unicode/PSL/core identities and rederives the full key/bucket inventory before building private maps. Comparison never scans all references with every algorithm.

| Index/material | Actual measurement |
|---|---:|
| Exact references | 9,570 |
| Unicode skeleton keys | 9,570; maximum bucket 1 |
| ASCII visual keys | 9,561; maximum bucket 2 |
| Restricted spelling dictionary keys | 5,102 |
| Serialized index | 494,484 bytes |
| Index manifest | 1,520 bytes |
| Index attribution notice | 1,195 bytes |
| Engine source | 18,369 bytes |
| Existing compiled PSL + references | 494,826 bytes, unchanged |

Index SHA-256: `7cd6bec6f74549177c508468b8f061618d1f90916664621d28df5f1dbb5dc526`.

Engine source SHA-256: `bf6d899e7db7f17d0dd6048b742751618cdb49b2cc8415eb6106d9760037bbb2`.

This stage produced no Stage 3 HTML bundle; ordinary v3.2.0 and Stage 2 preview outputs remain byte-identical. No browser data fetch is needed by the engine contract.

## 10. Determinism and limits

Policy `full-domain-conservative-v1`, index schema 1. Completed comparisons have deterministic ordering and no wall-clock result field. Independent output roots produce exactly the repository index/manifest bytes. Generator hashes/runtime and attribution/source identities are retained.

Limits: 32 candidate IDs and 32 verified pairs per hostname; 256 pairs per shared inspection; spelling traversal 4,096/16,384 states per hostname/inspection; cooperative 50 ms shared time. Sessions have private counters and frozen tokens; limits can only be lowered. Exhaustion is explicit partial coverage. Stronger full-domain candidates precede structural/spelling work. The timing budget is cooperative, not native-operation preemption or a hard deadline. It is separate from existing embedded analysis.

## 11. Disjoint calibration

Reused the exact Stage 1 million-row CSV, fully rechecked its hash/schema/ranks, and extracted 15,000 original rank/hostname rows for ranks 10,001–25,000. Separate input: 293,810 bytes, SHA-256 `820cbba9de28e3030d792847709fd217324a1ab74f15f6ad4b6bf45527dc1e2b`. No new snapshot or provider was used.

Selected 10,000 distinct eligible registrable domains disjoint from every reference, processing through rank 20,199. Accounted for 162 suffix-only exclusions, 32 reference overlaps and 5 duplicates. Original hostnames and canonical equivalents were exercised; non-structural findings agree.

Exact 0; Unicode visual 0; ASCII visual 2; structural 0; spelling-only 5; multiple-reference collisions 0; incomplete/unsupported 0. Conservatively counting both visual candidates as potentially unwanted gives **0.02%**, below the provisional <=0.1% corpus target. This is not ground-truth false-positive rate or phishing accuracy. All references remain covered; no algorithm tier was reduced to pass.

Reviewed both visual candidates (`8k.com`/`bk.com`, `cm.com`/`crn.com`) and all five spelling neighbors (`pixels.com`/`pexels.com`, `fox4news.com`/`foxnews.com`, `instragram.com`/`instagram.com`, `rollingstones.com`/`rollingstone.com`, `firebox.com`/`firefox.com`). LOOKALIKES.md records word-like, short-name, plural and interior-digit nuisance risks without asserting ownership or legitimacy. No inspected destination was contacted.

## 12. Synthetic detection coverage

All **66 fixed cases passed**: 15 Unicode positives, 13 ASCII positives, 6 spelling positives, 6 structural positives, 16 explicit negative/suppression cases and 10 explicit status cases. Every positive target was verified present in the actual dataset. All 15 Unicode positives also pass as native A-label equivalents. Includes private hosting, cross-suffix controls, legitimate reference subdomains, short/digit/hyphen cases, long/malformed input and competing references.

Additional tests enforce the artificial 64-way ASCII/Unicode collision cap, shared/default resource budgets, deterministic multi-reference ranking, repeated outputs, rehashed corrupt inputs and privacy API traps.

## 13. Local performance and memory

Measured Deno 2.9.7 / V8 15.0.245.2-rusty, with the real cooperative clock:

| Operation | Samples | Median | p95 | Maximum |
|---|---:|---:|---:|---:|
| Index preparation | 10 | 81.50 ms | 94.08 ms | 94.08 ms |
| Ordinary matching | 2,000 | 0.0235 ms | 0.0647 ms | 0.9395 ms |
| Adversarial production inputs | 600 | 0.0740 ms | 0.1375 ms | 0.7872 ms |
| Artificial 64-way collision | 100 | 0.3475 ms | 0.5447 ms | 0.8883 ms |

One foundation load measured 81.45 ms; first index preparation 103.49 ms. Startup is separate from the per-inspection budget and should occur once. The adversarial production set deliberately includes malformed and RTL inputs; its partial/unavailable results are expected, not detection failures. Artificial collisions always report partial and verify at most 32 pairs. Ordinary benchmark calls all completed. The calibration corpus required at most one candidate/pair and 31 spelling states per hostname.

Explicit-GC Deno endpoint measurements: additional retained foundation-plus-index heap **9,381,344 bytes (8.95 MiB)**; index portion 6,588,464 bytes. The largest sampled endpoint comparison heap increase was **1,170,728 bytes (1.12 MiB)**, versus provisional 15 MiB retained / 2 MiB scratch targets. Initial artificial collision sampling exceeded the scratch target; reusing query skeleton/script and character evidence within a single comparison reduced repeated allocation while preserving the dataset, evidence and 32-pair cap.

These samples include V8 bookkeeping and retained input strings. Endpoint deltas are not peak scratch profiling or browser retained-heap guarantees. No native Firefox p95, Safari, cold-page or hard real-time claim is made. Native profiling and later startup orchestration remain necessary.

## 14. Executed tests and remaining failures

- `deno task test:lookalikes`: **119 tests / 38,859 assertions**, zero failures.
- `deno task test:lookalike-calibration`: complete 10,000-domain corpus, all coverage/notice-target checks passed.
- `deno task test:lookalike-benchmark`: completed all samples and retained-heap feasibility check.
- `deno task test:lookalike-index`, separate repeat-output roots, and five invalid CLI argument combinations: passed.
- Full-source calibration extractor `--check`: original million-row identity and exact calibration output passed.
- Fresh Stage 2 foundation: **162 tests / 49,099 assertions**; build integrity: **30 checks**; nested preview suite **282 tests / 580 assertions**, all passed.
- Fresh existing suites: Unicode 108,664; references 70; differential 143; audit corrections 27; embedded 146; DOM 33; worker 25; hosted 64: **109,172 total**, zero failures.
- Final identity/inventory, syntax and `git diff --check`: passed, recorded in the final integrity report.

No unresolved test failures. No native browser, complete release verifier or HTTP suite was run. Historical reports were not substituted for current execution; nested suite totals are not summed as independent extra coverage.

## 15. v3.2.0 and Stage 2 preservation

Existing core/reference/embedded/presentation/UI modules, Unicode data, CSS/template, hosted/worker sources, release verifier/workflows/dependency lock and production artifacts are unchanged from the approved baseline. Default builds still reproduce the complete v3.2.0 HTML/worker/manifest bytes. Stage 2 source/data/generators/build integration and historical evidence are preserved. Only README/task discovery changed beyond that starting work. Personal-reference storage/export, Expected Hostname, concealment and nested provenance were not modified. The new engine is never invoked by existing application code.

## 16. Remaining risks and decisions

The corpus is one popularity-ranked snapshot with limited language/naming coverage; it provides no ownership or threat ground truth. Short visual names and legitimate near-neighbors remain explainable nuisance risks. Later UI must respect neutral membership, low-priority spelling, font dependence and partial/unavailable coverage. Exact-reference visual collisions need deliberate presentation.

Native-browser timing, peak memory, crypto/file behavior and startup responsiveness remain unverified. Full-domain-only policy deliberately omits registrant-only cross-suffix resemblance. Hashes assume a trusted reviewed application/manifest. Existing final MPL/source-availability/distribution questions and release-verifier policy remain release-hardening work. This engine is not ready for publication as an activated feature.

## 17. Readiness for Stage 4

The validated engine is ready to support separately authorized subsequent work, including Stage 4 nested provenance. It accepts native hostnames without changing existing diagnostic objects. No nested-provenance correction, original/embedded UI orchestration, reference precedence change or automatic-result presentation was implemented. Work stops at Stage 3.
