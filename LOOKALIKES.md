Current v3.3.0 status: this engine is integrated in the approved Stage 6 UI. The approved current policy is `full-domain-conservative-v2`; the original Stage 3 policy/fixtures below remain historical. Stage 7 changes no matching logic, data or budgets. See [FINAL_RELEASE.md](FINAL_RELEASE.md) and [the Stage 7 handoff](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE7_RELEASE_HARDENING.md) for packaging and fresh validation.

# v3.3.0 Stage 3 automatic lookalike engine

This records the Stage 3 engine and its historical integration boundaries. Stage 5–6 subsequently integrated it into the development inspector; see [AUTOMATIC_FINDINGS.md](AUTOMATIC_FINDINGS.md). The current Stage 6 stress correction explicitly versions the structural policy as v2 below. Stage 3 itself added no startup, UI, embedded orchestration, personal-reference integration or Expected Hostname behavior. Exact membership is neutral; neither rank nor resemblance establishes safety, ownership, intent or maliciousness.

## Public interface and trust boundary

`src/lookalikes.js` defines `AutomaticLookalikes`. Supply the existing Inspector, a successfully loaded Stage 2 `ReferenceData` foundation, the index manifest/text and the exact foundation-manifest text:

```js
const engine = await AutomaticLookalikes.prepare(Inspector, foundation, {
  manifest: indexManifest,
  indexText,
  foundationManifestText
});
if (engine.status === 'ready') {
  const session = engine.createSession();
  const result = engine.compare('google.com.example.net', session);
  const work = session.snapshot();
}
```

Initialization hashes bounded index text and foundation metadata, checks the pinned source/records/Unicode/PSL/core identities, fingerprints normalized tuples, and recomputes every key/bucket once using the current Inspector. Rehashed corrupt/truncated keys, changed IDs and incompatible data fail unavailable. The constructor expects the verified Stage 2 foundation; arbitrary externally fabricated foundation objects are not a supported data source. Test collision fixtures deliberately fabricate a self-contained foundation and are never production inputs.

The trusted application/source bundle supplies manifests. Hashes do not independently authenticate a publisher or protect a replaced whole application. Index format is 1; current policy is `full-domain-conservative-v2`. Result metadata includes source, records, Unicode, PSL, foundation/index checksums and engine/core source identity. Generator identities and notice hashes are in `data/lookalikes/manifest.json`.

`prepare()` returns an unavailable engine for missing, corrupt, unsupported or incompatible inputs. Its `compare()` cannot turn absence of an index into a successful empty comparison. WebCrypto is required for initialization. The stable v3.2.0 inspector does not depend on this engine; the current Stage 6 development preview does.

`compare()` accepts a bare hostname. Use the native parser's inspected hostname at future integration boundaries; do not pass an entire URL or guess a destination from display text. Results distinguish `complete`, `partial`, `unavailable` and `ineligible`, with per-class coverage, limitations and bounded work counters. Unknown, suffix-only, single-label and IP inputs are explicitly ineligible; invalid DNS is unavailable. A non-null default-rule registrable domain is not sufficient for eligibility.

The normal clock is `performance.now`. A constructor clock override exists for deterministic tests; future application integration must use the normal clock. Results contain no elapsed wall-clock field, so completed comparisons are deterministic. Timing exhaustion can change coverage and must remain visible.

## Implemented classes

**Exact membership:** lookup by canonical registrable domain; genuine subdomains and root dots retain that identity. Membership returns source GlobalRank and provenance-row count, with `classification: neutral-membership`. It is separate from findings. Spelling comparisons are suppressed when membership is exact. An actual independently supported resemblance to a different included reference can still be returned, as with the finite `cl`/`d` collision between `tcl.com` and `td.com`; exact membership does not prove either site safe.

**Unicode visual:** full registrable-domain skeleton equality using the pinned Unicode 18.0.0 / UTS #39 revision 34 LTR machinery, genuine canonical difference, and a readable non-ASCII character on at least one side. Evidence retains full readable strings, skeleton, scripts/confusable type, changed spans and character properties/mappings. Unicode and A-label inputs give the same mechanism. Character-detail arrays are capped at 32 per changed side; full bounded spans/strings, skeleton and pinned-table identity preserve reproducibility if that detail list is truncated. RTL/bidi analysis is explicitly unsupported/partial, never a completed visual negative. Current reference targets contain zero unsupported RTL skeletons; a future index with unsupported targets also reduces coverage explicitly.

**ASCII visual:** full-domain visual keys from the existing finite heuristic, followed by the existing explanation/alignment function. A key collision alone cannot produce a finding. The explanation must contain supported substitutions from `rn/m`, `vv/w`, `I/l/1`, `O/o/0`, `cl/d`, `5/s`, `2/z`, `8/b`; no classes were expanded. Original ASCII case can explain uppercase `I`, while the native canonical destination remains authoritative. A-label encoding substrings are never treated as readable ASCII spelling. Evidence explicitly records font dependence.

**Structural placement (v2):** complete reference-label sequences must start in the actual subdomain and end before the actual public suffix. The sequence may include the actual registrant label. For example, `google.com.github.io` contains the independent reference `google.com` while the actual registrable domain is `com.github.io`; `accounts.google.com` remains a legitimate subdomain of the same reference and does not qualify. Both PRIVATE and ICANN rules remain authoritative. No substrings, suffix-only windows or windows starting inside the actual registrable domain qualify. Existing occurrences/scope are unchanged for earlier positives; newly covered tenant-edge occurrences use `complete-label-sequence-crossing-registrant-boundary`. At most one additional ending position per indexed reference-label count is examined; all candidate, pair and cooperative time budgets remain unchanged.

The Stage 3 v1 policy deliberately excluded registrant-boundary crossings, and its original negative fixture for `google.com.github.io` is preserved unchanged. The focused Stage 6 stress review identifies this as a security-relevant coverage gap and explicitly versions the bounded correction as v2. Index lookup keys, buckets, references and upstream data remain unchanged; derived policy/source metadata is regenerated under pinned Deno 2.9.7. Original v1 assertions run on exact v1 sources, with independent v2 PSL/positive/negative tests in `tests/stress-engine.mjs`. See [the current review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_STRESS_REVIEW.md).

**Spelling:** only references whose original minimum GlobalRank is <=1000, same recognized suffix, ASCII/readable registrant labels of at least six characters, and existing optimal-string-alignment distance exactly one. Supported insertion, deletion, substitution and adjacent transposition retain explicit operation/offset evidence. Suppress initial-character edits (including duplicate initial insertion), numeric-suffix-only changes, simple hyphen insertion/deletion, short labels, distance two, non-readable A-label spellings, cross-suffix spelling and exact built-in membership. This is lower-priority evidence. No pair suppression registry was justified by the current corpus.

There are no registrant-only cross-suffix comparisons. A shared registrant under another suffix is insufficient. Full-domain visual keys can agree across recognized suffixes only through a supported complete-domain mechanism; suffix agreement is separately retained. No unknown suffix is promoted to eligible merely to find a match.

## Candidate indexes, ranking and budgets

All 9,570 approved references remain selected. The restricted rank cutoff still supplies 883 unique references; 534 satisfy the additional documented six-character ASCII/readable spelling restrictions and enter the spelling dictionary. No dataset coverage was reduced for calibration.

- Exact/structural domain map: 9,570 entries; structural scanning uses only the small observed set of reference label counts and explicit subdomain windows.
- Unicode skeleton map: 9,570 keys; largest current bucket 1.
- ASCII key map: 9,561 keys; largest bucket 2. Eight IDN targets have no ASCII key, and one pair shares a key.
- Spelling deletion dictionary: 5,102 suffix-qualified keys. Query at most the original label and its unique one-character deletions; this retrieves candidates for distance-one substitutions, insertions, deletions and transpositions. Verification uses `Inspector.editDistance`; there is no combinatorial ambiguity expansion.

The current v2 serialized index is 494,484 bytes, SHA-256 `f34828ae9faa621a83d0d480a888b28985198bbcd90bd3763d18135fd23d0c9e`. Its lookup contents are unchanged from v1; only the policy identifier changed. Manifest/notice sizes and exact current source hashes are in the generated manifest and current stress integrity report. Stage 3 itself did not add the engine/index to HTML; the stable distribution remains byte-identical.

Full-domain visual candidates are collected before structural candidates, then spelling, so budget contention preserves stronger mechanisms first. Bucket IDs use GlobalRank and stable ID order. Verification is bounded, and findings merge materially distinct evidence for the same reference. Sorting prefers Unicode visual, ASCII visual, structural, then spelling; suffix agreement; mechanism cost; GlobalRank only as a tie-breaker; then ASCII domain order. Mechanism cost is changed-span length for Unicode and the number of distinct supported substitution kinds for ASCII, not a threat score or exact visual distance.

Defaults:

| Resource | Per hostname | Shared inspection |
|---|---:|---:|
| Candidate IDs | 32 | Bound through pair limits |
| Verified pairs | 32 | 256 |
| Spelling traversal states | 4,096 | 16,384 |
| Cooperative matching time | Within shared budget | 50 ms |

Limits can only be lowered. Traversal states count query-key and bucket-ID visits; pair limits separately bound edit-distance verification on labels of at most 63 ASCII characters. Sessions are opaque frozen tokens backed by private state; callers cannot raise limits or reset counters. They retain only counters/limits/time, never inspected hostnames or results. Create a session immediately before an inspection and share it across future original/embedded comparisons. This budget is independent of embedded-analysis budgets. Async UI scheduling remains later work.

Collision, candidate, verification, traversal and time exhaustion returns partial coverage with reasons. An artificial 64-reference ASCII/Unicode collision test visits at most 32 candidates/pairs and explicitly reports the omitted coverage. Cooperative timing is checked between bounded units; it cannot promise preemption inside a native parser or existing comparison operation, or a hard real-time deadline.

## Corpus construction and calibration review

The Stage 1 full CSV was still available and passed the original full hash/size/schema/all-million-ranks verification. No data refresh or new source acquisition occurred. `tools/extract_lookalike_calibration.py` extracted original ranks 10,001–25,000 into a separate 293,810-byte test input, SHA-256 `820cbba9de28e3030d792847709fd217324a1ab74f15f6ad4b6bf45527dc1e2b`. The complete 80 MB CSV remains outside the repository. Calibration metadata retains Majestic attribution, license/source identity, retrieval and selection policy.

`tests/lookalike-corpus.mjs` verifies all 15,000 rank rows and source pin, then selects the first 10,000 distinct eligible registrable domains disjoint from every automatic reference. It processes ranks 10,001–20,199: 162 suffix-only exclusions, 32 reference overlaps and 5 duplicate accepted domains. Remaining rows are not corpus members. Normalized corpus identity: `6c2ef0c497fc2d949ca350721d91822fa8759cc219f25f3af0b863cb382c25e9`.

Both original source hostnames and canonical registrable forms are exercised. Non-structural findings agree. No domain is labeled definitively benign/malicious, and no destination, ownership, certificate, DNS or reputation service was contacted.

| Class / coverage | Domains in 10,000-member corpus |
|---|---:|
| Exact membership | 0, by disjoint construction |
| Unicode visual | 0 |
| ASCII visual | 2 |
| Structural placement | 0 |
| Spelling-only | 5 |
| Multiple-reference findings | 0 |
| Unsupported/incomplete comparisons | 0 |

Both visual candidates are conservatively counted as potentially unwanted: **0.02%**, below the provisional 0.1% corpus notice target. This is not a measured real-world false-positive rate or phishing accuracy. Original GlobalRank and strings provide no ground-truth verdict.

Reviewed visual candidates are `8k.com` versus `bk.com` (`8/b`) and `cm.com` versus `crn.com` (`m/rn`). These short, potentially independent names show why a supported font-dependent resemblance must not imply intent, ownership or danger. Short-name spelling remains suppressed; visual coverage was not silently removed to erase these cases.

Reviewed spelling neighbors are `pixels.com`/`pexels.com` (vowel substitution), `fox4news.com`/`foxnews.com` (interior digit insertion), `instragram.com`/`instagram.com` (insertion), `rollingstones.com`/`rollingstone.com` (plural-form insertion), and `firebox.com`/`firefox.com` (distinct word-like labels). Plausible independent naming, plural forms and station-style interior digits are nuisance risks. No live ownership or legitimacy is asserted. All five stay low priority, and this one occurrence per pair does not justify a recurring-pair suppression registry. Future calibration should broaden languages, naming patterns and disjoint snapshots rather than treating this small corpus as universal validation.

## Reproduction and tests

Existing Python/Deno tooling only; no dependency additions. The commands below document the original Stage 3 workflow. The original `test:lookalikes` asserts the preserved v1 exclusion and must run on exact v1 inputs. For current v2 checks plus unchanged historical assertions, use `tests/stress-regressions.py --development-root /path/to/preview --strict-runtime /path/to/deno-2.9.7`; for current UI/build checks use `deno task test:stress`. Generation and its strict check require pinned Deno 2.9.7.

```sh
deno run --cached-only --allow-read=. --allow-write=data/lookalikes tools/generate_lookalike_index.mjs --write
deno task test:lookalike-index
deno task test:lookalikes
deno task test:lookalike-calibration
deno task test:lookalike-benchmark
```

Index generation takes only approved local Stage 2 inputs; output has stable ordering, HTML-safe canonical JSON and no moving timestamp/HEAD. Alternate `--output-root` supports separate deterministic repeat runs. Runtime and generator identities are recorded. Refreshing source data remains a separately reviewed action; ordinary builds never retrieve data.

To reproduce calibration extraction from an archived exact original CSV:

```sh
python3 -B tools/extract_lookalike_calibration.py /path/to/majestic_million.csv --check
```

Without `--check`, extraction writes only absent or identical evidence and refuses a different existing subset. It cannot approve another source hash or refresh the reference tier.

The fixed synthetic corpus has 66 independent cases: 15 Unicode positives (also exercised as native A-label equivalents), 13 ASCII positives, 6 spelling positives, 6 structural positives, 16 suppression/negative cases and 10 explicit ineligible/unavailable/unsupported states. Included reference membership is checked before use; examples are not assumed present. Tests additionally check every reference's exact membership, stable ranking/repeated calls, ICANN/PRIVATE/IDN boundaries, collision limits, shared/default budgets, rehashed corrupt index inputs, unavailable crypto and privacy API traps.

Final executed counts, fresh regression results and source/report hashes are in `STAGE3_REVIEW.md` and `tests/lookalike-stage3-integrity.json`. Stage 2 evidence remains preserved as historical identity evidence; its report is not rewritten to hide later README/task additions.

## Privacy, packaging and remaining limits

The engine has no DOM/rendering, destination links, network, DNS/certificate/WHOIS/reputation access, history, telemetry, storage or personal-reference access. Inspection-derived candidate/evidence caches are local to one comparison. The only initialization crypto operation is hashing local data. No core diagnostic object or storage schema changed.

Majestic and existing Unicode/PSL notices accompany the derived index. Final MPL/source-availability/single-file treatment remains the Stage 2 documented release-review issue; this stage neither resolves legal clearance nor relicenses the application. No Stage 3 HTML preview or release-verifier policy change was needed. Existing CSP, stable artifacts and service worker remain untouched.

Deno feasibility measurements do not establish Firefox/Safari performance, file-context crypto behavior or exact peak scratch memory. Final integration must respect partial/unavailable coverage, avoid presenting spelling as prominent security warnings, decide presentation of exact-reference collisions, and retain the existing no-network/concealment guarantees. Stage 4 nested provenance and subsequent UI/orchestration remain separately authorized work.
