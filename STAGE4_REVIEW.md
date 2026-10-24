# v3.3.0 Stage 4: nested URL occurrence provenance

**Public derivative.** This document is a sanitized derivative of the privately archived original `STAGE4_REVIEW.md` (SHA-256 `6b8abeba970833509e6d68f247c5ccd38813b87e34e65b2c96951046831e7239`; `repository-before-cleanup.tar.gz`, member `repository/STAGE4_REVIEW.md`). The original is not distributed in this public repository. Original dates, findings, verdicts, measurements, limitations and recorded source/evidence hashes remain historical; sanitization does not turn them into current acceptance claims.

Stage 4 corrects nested occurrence attribution while retaining shared parsing and the existing detection/decoding pipeline. No automatic matcher integration or new results panel was added. This is local development work, not a release recommendation.

## 1. Verified starting state

Repository: `<repository>`; branch `dev/v3.3.0-automatic-lookalikes`. Starting HEAD, local main and local origin/main all matched approved v3.2.0 commit `664cc58bf67a2127d0523adec9f1d80c6edd656e`. All Stage 2/3 inventory hashes were verified before changes. The existing uncommitted work, data, branches and production artifacts were preserved. No branch switch/creation, commit, staging, push, PR, merge, deployment, dependency installation or external data acquisition occurred.

## 2. Root cause

The old `expanded` map stored a recovered URL value with a `layers:depth` state. Its first occurrence enqueued nested components using that first candidate's ID as parent. A second equal parent produced another candidate but skipped component expansion entirely. Its child was therefore absent, even though status could remain complete. Shared work and source occurrence identity were conflated.

The reproduced starting example reported three entries: middle IDs 1 and 2, but only child ID 3 with parent 1. There was no child relationship for parent 2.

## 3. Exact files changed

Modified beyond the Stage 3 starting state:

- `src/embedded.js`: context-sensitive shared parse cache, occurrence sites/edges, per-entry expansion, source positions and explicit graph budgets.
- `src/embedded-ui.js`: truthful unique-value/source counts, incomplete-coverage reasons, and source occurrence/position rows in existing revealed evidence.
- `tools/build.py`: explicit outside-repository Stage 4 preview and stable-source overwrite guard.
- `tests/harness.mjs`: explicit development-artifact selection and hash-verified restoration of only the reviewed Stage 4 edits for historical source checks.
- `tests/dom-support.mjs`: faithfully load inert preview data and expose test-only core/reference/extractor objects.
- `deno.json`: three focused Stage 4 tasks.
- `README.md`: Stage 4 discovery and build guidance.

Created:

- `tests/embedded-provenance.mjs`, `embedded-provenance-dom.mjs`, `embedded-provenance-build.py`, `embedded-provenance-benchmark.mjs`.
- `tests/embedded-provenance-source-boundaries.json`: exact reviewed before/after source fragments and whole-file hashes.
- `tests/embedded-provenance-results.json`, `embedded-provenance-dom-results.json`, `embedded-provenance-build-results.json`, `embedded-provenance-benchmark-results.json`, `embedded-provenance-integrity.json`.
- This `STAGE4_REVIEW.md`.

Existing result fixtures and tests were not repinned. Fresh established-suite reports are unchanged where their deterministic content is identical; final inventory evidence records their hashes. `tests/embedded.mjs`, `tests/audit-corrections.mjs` and the v3.2.0 release verifier are unchanged.

## 4. Model and compatibility contract

The result declares `provenanceVersion: 2` and separates three things:

1. **Shared analysis:** internal native URL/preparation/component descriptors, referenced by `candidate.sharedAnalyses` IDs into `result.analyses`. The public analysis table contains interpretation metadata, not another copy of full private URLs.
2. **Source occurrence sites:** `result.occurrences`, with stable inspection-local `id`, parent occurrence ID or null, component, source representation and `entries` referring to legacy candidate IDs. Alternative recovered values at the same supported source site can share an occurrence identity.
3. **Interpretation entries:** the existing `result.candidates` array retains `id`, `parent`, parameter ordinal `occurrence`, value/source value, steps, hostname analysis, comparisons and warnings. New `occurrenceId` links each entry to its source occurrence site. Existing `parent` continues to refer to a candidate/interpretation entry, preserving old UI relationships. Occurrence-table `parent` refers to the source occurrence identity instead.

`stats.candidates` counts interpretation entries; `stats.occurrences` counts recorded source sites; `stats.relationships` counts recorded source parent-child edges. `stats.uniqueAddresses` counts distinct exact recovered absolute URL strings, not normalized destinations or distinct owners. Hostname counts remain separately deduplicated. None of these describes verified navigation.

Site identity includes parent source occurrence, source representation, component, local parameter/segment location, coordinate context and any uncertain substring offset. Submitted and browser-normalized views stay labeled and separate; no mapping between changed representations is invented. Distinct relative-reference interpretation entries can share a source site. The supported relative-alternative example retains eight legacy entries but has four source sites, including two absolute-address source sites, instead of counting each alternative as an independent appearance.

Candidate provenance retains representation, complete decoding steps, local `relativeSteps`, `parentAnalysis`, source position, substring position and interpretation mode/layers/depth. `parentAnalysis` identifies the shared parent interpretation responsible for a child; equivalent parent histories remain factored through the parent rather than enumerating their Cartesian product. First-value compatibility fields such as `candidate.steps` remain representative; consumers needing alternatives must use the provenance list and parent links.

Positions are zero-based, end-exclusive UTF-16 ranges. Component query/fragment text excludes `?`/`#`; path text retains its path delimiters. `basis: component` refers to that labeled source view's component; `interpreted-parent-value` refers to the containing relative interpretation's value; `derived-container` explicitly denotes decoded subordinate text. `matchPosition` is relative to an interpreted value. These are not claimed as byte offsets into the entire original input. No second decoder or guessed inverse percent-offset mapping was introduced.

## 5–6. Principal example and parent attribution

Input is constructed as:

```js
const inner = 'https://inner.test';
const middle = 'https://middle.test/?next=' + encodeURIComponent(inner);
const input = 'https://outer.test/?a=' + encodeURIComponent(middle)
  + '&b=' + encodeURIComponent(middle);
```

Measured corrected output:

| Entry / occurrence ID | Hostname | Parent entry / occurrence | Source |
|---:|---|---:|---|
| 1 | middle.test | null | query parameter a, ordinal 1 |
| 2 | middle.test | null | query parameter b, ordinal 2 |
| 3 | inner.test | 1 | first middle's query parameter next |
| 4 | inner.test | 2 | second middle's query parameter next |

Four entries, four source occurrences, two unique recovered absolute values, two hostname analyses and two source edges. Both child provenance records identify the same reusable middle interpretation while preserving their respective parent identities. Their local decoding suffix is percent layer 2; both complete paths retain layers 1 then 2. Root source ranges select the actual distinct parameter values, and each child range selects its own parent's encoded `next` value.

## 7. Parsing work reused

The principal case performs two shared absolute URL parses/component preparations and records two cache hits. Counting the extractor's existing top-level preparation as well, an instrumented Inspector observes three calls to its injected preparation entry point versus four previously. These counters cover extractor parsing, not additional native operations inside the core's independent hostname analysis. Hostname analyses and comparisons remain two.

| Identical middle parents | Old entries, missing repeated children | Corrected entries | Corrected URL parses | Cache hits | Old / new preparations |
|---:|---:|---:|---:|---:|---:|
| 1 | 2 | 2 | 2 | 0 | 3 / 3 |
| 2 | 3 | 4 | 2 | 2 | 4 / 3 |
| 4 | 5 | 8 | 2 | 6 | 6 / 3 |
| 8 | 9 | 16 | 2 | 14 | 10 / 3 |

Each parent still pays for bounded occurrence-specific component traversal and relationship creation. Shared parsing does not imply free occurrence expansion. Fifty local Deno samples per scenario all completed; the two-parent case measured median 0.265 ms / p95 0.473 ms, and eight parents median 0.239 ms / p95 0.377 ms. These synchronous samples ran during local validation and are not native Firefox, hard real-time or like-for-like speedup claims: corrected output contains more child evidence.

## 8. Interpretation/cache identity

The per-inspection cache key includes exact recovered value, submitted/browser-normalized representation, component interpretation mode, form-style flag, whole-path flag, inferred-container flag, used decoding layers and nesting depth. The latter two determine remaining allowances under the fixed limits. Parent identity is deliberately excluded from that shared cache.

Occurrence-specific expansion is keyed by candidate entry plus shared interpretation ID, so every parent entry receives its own nested links while duplicate equivalent expansion of that entry/state is avoided. Different modes, representations or remaining allowances cannot borrow an incompatible nested expansion. Invalid native parses can also be reused conservatively. Native URL parsing, original-host validation and the existing strict percent transformer remain authoritative.

## 9. Bounds and saturation

Preserved: maximum value 8,192 code units, nesting depth 3, percent layers 2, parameters/segments 128 per component, enqueued nodes 128, derived text 131,072 code units, candidate interpretation entries 32, hostname analyses 16, comparison pairs 256 and cooperative supplemental time 100 ms. Component queues still run round-robin. The automatic matcher's separate budgets are unchanged and unused here.

Explicit graph bounds are 32 source occurrence sites, 32 source edges, 64 entry/state expansion attempts and six provenance/shared-interpretation variants per entry. A new cap of eight interpretation entries per exact recovered value/type preserves room for distinct evidence when one address repeats. For example, twenty repeated query values record eight plus a later distinct hostname, report partial occurrence coverage and clearly qualify the count. This is a deliberate stricter bound: nine or more otherwise valid identical appearances may now produce a partial result sooner than the old global 32-entry limit.

Occurrence creation and source-edge creation are charged before insertion; expansion attempts are charged separately. Cache keys and retained component text now also spend the existing derived-text allowance. Missing parent entries do not become fallback grandparent links. Candidate and occurrence limits retain the existing `candidates` saturation reason where applicable, alongside the more specific graph reason.

Unrepresented occurrences, relationships, expansions or provenance set `occurrenceCoverage: partial` and the overall result partial. General extraction limits also qualify occurrence counts. Host-only comparison limits do not falsely imply missing source sites. UI counts describe recorded evidence and explicitly state incomplete occurrence coverage. Unsupported formats remain unsupported; no success is inferred from an empty or unavailable result. No unrestricted recursion or full transformation-path graph was added.

## 10. Existing UI and disclosure

Existing cards, supplemental finding, disclosures, pagination, focus handling, colors, CSS and layout remain intact. Necessary changes are limited to distinct recovered-value counts, accurate source-site counts, incomplete-graph explanations, and source occurrence/range rows inside existing expanded evidence. Legacy entry IDs and `Found inside` relationships remain visible there.

The actual generated standalone and hosted previews pass parent attribution, relative-alternative counting, pagination/focus, private parameter and credential concealment, reveal/close cleanup, outer-close cleanup and reinspection cleanup. Revealed strings remain inert text. No destination links, navigation, inspected-value storage or reference-export pollution was introduced. Main summaries still explain that embedded data does not establish whether a redirect occurs; the embedded @ explanation remains unchanged.

## 11. v3.2.0 security regression preservation

All three supplied A/B/C reproductions pass with the original hostnames and decoding-layer expectations. Strict invalid UTF-8/escape rejection, mixed literal/encoded delimiters, whole fragments, routes, subordinate/relative alternatives and original component boundaries remain supported as before. The original embedded suite passes all 146 checks, and all 27 approved audit-correction checks pass against the current Stage 4 preview.

Whole-fragment transformation now retains the pre-decoding source value when none was assigned by a parameter/segment container. This aligns its encoded source evidence with the recorded component range; it changes no decoding, hostname or URL-detection decision.

The original fixture files and historical source pins remain intact. `embedded-provenance-source-boundaries.json` enumerates exact reviewed source edits and their before/after whole-file hashes. The test helper reverses only those edits before older audit restoration; unexpected source changes fail. Current model and generated-UI tests execute the changed sources, not that historical reconstruction.

## 12. Stage 2/3, offline build and stable release preservation

Majestic inputs/records/ranks, complete PSL rules, Unicode data/primitives, the automatic engine, index/limits and calibration corpus/outcomes are byte-identical to the verified starting state. Foundation and matcher generation checks pass without a data refresh. Expected Hostname, personal references/storage/export and initial diagnostic objects remain unchanged.

Build current sources explicitly outside the repository:

```sh
python3 -B tools/build.py --provenance-preview --reference-foundation \
  --output-root /private/tmp/offline-url-inspector-stage4-preview
```

The preview is labeled `3.3.0-stage4`, development-only, with automatic matching unavailable. It embeds the dormant Stage 2 foundation, never the Stage 3 matcher. Both editions retain exact CSP/style restrictions and complete hosted-document/worker hash agreement. Two independent builds are byte-identical. Final standalone size is 2,882,957 bytes and hosted size 2,895,017 bytes, 7,035 bytes above their historical Stage 2 previews.

Default v3.2.0 building now refuses changed embedded sources before writing. Preview mode refuses repository or child output roots. This protects the unchanged stable artifacts rather than silently labeling changed code v3.2.0. The old Stage 2 `test:reference-build` is a historical baseline build entry point, not the current Stage 4 build gate; use `test:provenance-build` now. Its disposable historical source copy substitutes only the two exact approved Git blobs, reproduces all original v3.2.0 artifacts byte for byte, and reproduces the exact Stage 2 preview hashes. It never resets or edits the real checkout. The full release verifier/workflow/root checksums were not weakened or regenerated.

## 13. Fresh validation

```sh
deno task test:provenance
deno task test:provenance-build
deno task test:provenance-benchmark
deno task test:reference-foundation
deno task test:lookalikes
deno task test:lookalike-index
deno task test:lookalike-calibration
```

| Fresh suite | Passed |
|---|---:|
| Stage 4 source model | 34 tests / 821 assertions |
| Stage 4 development UI, both editions | 22 tests / 658 assertions |
| Stage 4 isolated build/integrity | 15 checks |
| Repeated-parent work/feasibility | 5 checks / 38 assertions |
| Existing embedded | 146 |
| Existing audit corrections | 27 |
| Existing core/Unicode | 108,664 |
| Existing references | 70 |
| Existing differential | 143 |
| Existing main/reference DOM | 33 |
| Existing reference presentation | 19 |
| Existing Technical Details | 17 |
| Existing interface/privacy | 12 |
| Stage 2 foundation | 162 tests / 49,099 assertions |
| Stage 3 matcher | 119 tests / 38,859 assertions |

Nine applicable established suites total 109,131 checks, all passed. The development UI additionally compares all 139 original core/reference fixtures in the same runtime in both editions. Stage 3's disjoint 10,000-domain calibration remains exactly two ASCII visual and five spelling-only candidates, zero incomplete comparisons; index identity is unchanged. Final source/report/fixture hashes are recorded in `tests/embedded-provenance-integrity.json`. Nested build-invoked suites are reported separately rather than double-counted in a grand total.

The explicit `--development-root=/absolute/preview/root` argument selects current generated artifacts in shared test helpers; Deno must also receive read access to that path. Other DOM suites were run this way on the Stage 4 preview. Pure algorithm/reference suites exercised current sources with unchanged pinned data. No native Firefox, VoiceOver, live redirect, HTTP suite or full release verifier was executed. Historical reports were not used as substitutes for fresh tests.

## 14. Remaining limitations

Source sites are identities within labeled supported representation/interpretation scopes, not a claim about application behavior. Exact recovered-value counts intentionally differ from hostname and normalized-destination identity. Derived-container offsets are explicitly not inferred original-input byte offsets. Alternative transformation histories remain factored through parent provenance, with bounded variant lists.

Limits can leave a lower-bound graph; callers must inspect both overall status and occurrence coverage. The stricter per-value cap is intentionally visible and can reduce repeated detail before the global candidate cap. Timing remains cooperative. Native browser rendering, accessibility/VoiceOver and browser performance remain unverified. Stage 2's final distribution/licensing/source-availability questions and broader release hardening remain deferred.

## 15. Readiness for Stage 5

The occurrence model is ready for separately authorized Stage 5 orchestration: stable inspection-local occurrence IDs, explicit interpretation entries/parent links, shared parse identities and bounded coverage are available without modifying core results or matcher policy. No automatic matching of original/embedded URLs, async orchestration or new lookalike UI was implemented. Work stops at Stage 4; Stage 5 requires explicit authorization.
