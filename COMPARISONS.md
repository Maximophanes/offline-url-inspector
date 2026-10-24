Current candidate status: orchestration is initialized by the approved Stage 6 interface with bundled local text. Stage 7 packages the same analysis, optional references and Expected Hostname semantics in both editions. Earlier dormant-API statements below describe the original Stage 5 checkpoint. See [RELEASE_CANDIDATE.md](RELEASE_CANDIDATE.md).

# Unified comparison contract, schema 1

Stage 5 composes Inspector, Reference Domains, the Stage 4 extractor and the Stage 3 matcher. `src/comparisons.js` adds no DOM, storage, worker, navigation or network capability. The original diagnostic objects, algorithms, data and displayed UI remain unchanged.

## API and lifecycle

```js
const coordinator = await UnifiedComparisons.prepare({
  foundationManifestText, // exact bundled text, including terminal LF
  pslText, popularText, indexManifest, indexText
});
const inspection = Inspector.inspect(input, expectedHostname);
const combined = coordinator.evaluate(inspection, {
  references: referenceStore.snapshot().references
});
```

Prepare once from trusted bundled text, outside inspection processing. Preparation delegates unchanged hash/normalization/key checks to `ReferenceData.load` and `AutomaticLookalikes.prepare`; it resolves to a coordinator even when automatic data is unavailable. It receives no inspection, retains no pending inspection and never publishes results. Evaluation is synchronous and retains no inspection state in the prepared coordinator. There is no asynchronous inspection completion to attach to a newer inspection. If Stage 6 introduces asynchronous inspection scheduling, it must add generation/cancellation handling.

Optional `embedded` accepts a trusted Stage 4 result **from the same current inspection and reference list**, avoiding duplicate extraction. The default obtains evidence directly. This is a composition API for verified objects, not authentication of arbitrary/stale caller-fabricated results. Treat returned evidence/core references as read-only and release the result on reinspection. `create(preparedEngine, options)` composes an already verified engine and supplies the test seam. Options only lower coordinator/session limits; clock overrides are for deterministic tests. Normal operation uses real cooperative clocks.

The Stage 5 preview provides exact inert local blocks `reference-manifest`, `public-suffix-data`, `popular-domain-data`, `lookalike-manifest`, `lookalike-index`, plus notices. The foundation manifest retains its terminal LF for the matcher's identity check. No runtime fetch or refresh exists.

## Result contract

| Field | Meaning |
|---|---|
| `schemaVersion` | 1 |
| `status` | complete / partial / unsupported / unavailable / invalid-input |
| `data` | Independent automatic readiness, reason and pinned metadata |
| `precedence` | Expected, personal reference, supplemental Majestic |
| `manual.expected` | Existing target/comparison/error and valid/invalid/not-provided state |
| `manual.references` | Existing `ReferenceDomains.compare` result |
| `embedded` | Stage 4 entries, occurrence sites, shared analyses and limitations |
| `sources` | Original/embedded roles, entry/site/parent links, eligibility, positions and decoding provenance |
| `analyses` | Reusable hostname contexts, raw Stage 3 result and attached source IDs |
| `relationships` | Evidence classes, targets, scopes, original proofs/source labels and source attachments |
| `coverage` | Input, automatic, recorded matching, embedded discovery/occurrence, manual and resource states |
| `stats`, `work`, `limits` | Reuse counters and shared session work/limits |

Four ID spaces remain explicit: `sources.id` includes the original source; `entryId` refers to a legacy embedded candidate; `occurrenceId`/`parentOccurrence` refer to Stage 4 source sites; `analysisId` refers to coordinator matching contexts. Relationships attach using `sourceIds`. Original source is first; embedded sources follow extractor entry order. Alternative entries can share a physical occurrence. Full private URL values are not duplicated into the analysis table. Coordinate scopes/factored decoding histories remain those in `STAGE4_REVIEW.md`.

## Eligibility, cache and evidence

Original matching uses the valid native HTTP(S) hostname independently of Expected Hostname. Original spelling attribution and normalized destination identity remain separate. Embedded promotion requires factual absolute HTTP(S), reliable original/analyzed hostname attribution, native agreement, no readable-host decoding error and supported interpretation mode/depth/layers. Uncertain substrings, unresolved relative references and incomplete/unsupported evidence remain excluded sources with reasons. A reliable absolute URL inside a supported relative interpretation can qualify independently. Known positives survive partial extraction.

One per-evaluation cache keys the canonical native hostname and actual matcher input. Reliable ASCII case is retained only when it agrees with native identity, preserving uppercase-I explanations. Other IDNA representations use the native hostname and existing readable conversion. Equivalent inputs share matching across roles/parents/decoding contexts, with every source still attached. Different case inputs do not borrow incompatible explanations. One engine session shares all work budgets; no inspected hostname/result cache survives evaluation.

Expected Hostname remains primary explicit intent; personal references retain their role; built-ins are supplemental and never identify user intent. Embedded comparisons against the original retain `original-hostname` attribution. Exact full-host identity, neutral shared registrable identity, UTS #39 visual, finite ASCII visual, structural and spelling evidence remain distinct. Built-in supports preserve original GlobalRank, row count, suffix/section and pinned source/index metadata; membership is `neutral-membership`, never safety or ownership evidence. Spelling stays low priority.

Deduplication includes context, canonical target, class, scope and finite-ASCII substitution set. Equivalent full-host proofs can consolidate Expected/Personal/Majestic labels while retaining each proof. Full-host versus registrable scope, legacy structural versus automatic outside-registrant placement, and legacy full-host versus restricted registrant-label spelling stay separate. Ordering is deterministic: analysis encounter order, class order, target, scope. Raw Stage 3 results retain their original relevance/rank ordering; no threat score is introduced.

`unicode-visual` identifies the existing UTS #39 path, including the legacy manual algorithm's ASCII skeleton matches. Manual arnazon.com/amazon.com uses that path; automatic policy supplies finite ASCII evidence. They stay separately attributed. By contrast, 5potify.com/spotify.com reaches the same finite 5/s proof in all three paths and consolidates labels. No algorithm/policy was changed to force agreement.

## Coverage and bounds

Complete empty supported automatic output means no supported match in that scope, never safety. Unavailable data means no database conclusion while manual results remain available. Invalid original HTTP(S) is `invalid-input`; invalid Expected Hostname has independent manual coverage and cannot disable valid original automatic analysis.

`coverage.recordedAutomatic` describes matching on recorded hostname contexts; `coverage.automatic` additionally qualifies incomplete discovery and excluded evidence. Embedded recorded matching can be complete while occurrence/discovery coverage is partial: additional addresses may have been missed. Unsupported evidence has explicit exclusions. Per-class/boundary limitations remain in each raw result. Resource limits set `resourceLimited` with scoped reasons; partial results retain positives. Corrupt/missing/incompatible data cannot manufacture complete empty comparisons or disable the inspector.

Coordinator limits are 17 automatic contexts, 8,192 relationships and at most 33 source attachments through the existing extractor. The relationship ceiling exceeds the default bounded combination of targets/contexts/evidence; lowered tests explicitly qualify omissions. Matching retains 32 IDs/pairs per host, 256 pairs and 16,384 spelling states per inspection, 4,096 states per host and cooperative shared 50 ms. Extraction retains Stage 4's independent 100 ms, 128 nodes, 131,072 text units, depth 3, two percent layers, 32 entries/sites/edges, 64 expansions and eight entries per recovered value/type. Existing manual/reference bounds remain unchanged. These are separate phase budgets plus bounded reconciliation, not a hard aggregate deadline.

The eight-entry cap preserves the tested later distinct host after twenty repeats, independent path/fragment evidence, and truthful edges for nine repeated nested parents plus a later distinct host. It remains unchanged because no new fairness defect was demonstrated. Existing global node/text/depth limits can still hide sufficiently late evidence; exhaustive discovery is not promised.

## Packaging and future presentation

```sh
python3 -B tools/build.py --comparison-preview --output-root /private/tmp/oui-stage5-preview
deno task test:comparisons
deno task test:comparison-build
deno task test:comparison-compatibility
deno task test:comparison-benchmark
```

Preview metadata declares development-only `3.3.0-stage5`, packaged `automaticMatchingAvailable: true`, `automaticUIAvailable: false`, `initialization: explicit-local-text`. Actual readiness is `coordinator.data.status`. No automatic initialization or new displayed findings are wired into production UI. Stage 6 will consume structured results and `combined.embedded` without reparsing, preserve disclosure/cleanup, and implement accessibility. The stable overwrite guard, outside-repository requirement, CSP/styles, matched worker and public v3.2.0 artifacts remain intact.

Current Deno is 2.9.8; reviewed generation is 2.9.7. Standard generation checks reject that identity drift. Separate diagnostics reproduce pinned rules/tuples/provenance/index bytes and expose only the runtime manifest difference without bypassing guards or changing pins. Actual failed attempts are preserved separately in `tests/comparison-environment-results.json`. Native browser/VoiceOver/memory and final distribution/source-availability review remain future work.


## Stage 6 composition addendum

`evaluate(inspection, {references, embedded, referenceResult})` also accepts an optional **trusted, same-inspection and same-reference-list** `ReferenceDomains.compare` result. The presentation controller already computed that object for the primary/manual UI; supplying it avoids a second saved-reference comparison. The default path is unchanged. The coordinator retains the supplied object without mutation. This is a composition input analogous to the existing `embedded` option, not an input-validation interface for untrusted result objects.

Stage 6's `AutomaticUI` consumes the existing Stage 3 `analysis.automatic` results and the coordinator's source/relationship attachments. It does not infer new matches, change matching policy or use a built-in as explicit user intent. Exact details are in [AUTOMATIC_FINDINGS.md](AUTOMATIC_FINDINGS.md). The Stage 5 packaging section above records that stage's state; current source requires `--automatic-ui-preview` and outside-repository output. Exact Stage 5 bundles remain reproducible in the disposable regression copy.

The runtime discrepancy described above was subsequently resolved under the original strict pins: [STAGE5_VALIDATION_RESOLUTION.md](STAGE5_VALIDATION_RESOLUTION.md). Stage 6 fresh strict execution is recorded separately in `tests/automatic-strict-runtime-results.json`.
