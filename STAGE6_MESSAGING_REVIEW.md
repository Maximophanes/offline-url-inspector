# Stage 6 reference and systematic messaging refinement

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

Local development on `dev/v3.3.0-automatic-lookalikes`, over unchanged HEAD `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Stable distribution remains v3.2.0. Stage 7/8 have not begun. Changes are unstaged and uncommitted; no branch/worktree, commit, push, merge, PR, release or deployment was created.

## Findings before implementation

Both user-supplied cases were correct at the engine level. `ReferenceDomains.compare` returned one exact match and zero unavailable comparisons for `https://example.test/` with saved `example.test`. It returned zero matches and zero unavailable comparisons for `https://example.com/` with that same saved reference: a completed full-hostname nonmatch, despite the reference's suffix being ineligible for the separate popular-domain database. Personal full-hostname comparisons do not require database/PSL eligibility.

The ambiguous text originated in `src/ui.js`, `referenceSummary(refs)`: its final branch returned “The saved reference did not produce a supported match.” for one checked, nonmatching reference. Earlier branches separately handled zero configured references and unavailable comparisons. The data was sufficient; the wording and new primary selector failed to communicate it consistently. No engine/schema change was necessary.

The pre-change structured probe and initial message-test attempt are retained in `/private/tmp/oui-stage6-messaging-7ktxp4z_/before-probe.json` and `before-message-tests.json`. They reproduce the missing exact/subdomain/spelling results and the incorrect structural target, independently of screenshots.

Actual additional defects found:

- Saved exact, subdomain and spelling evidence could disappear behind unsupported automatic eligibility. Exact Expected Hostname success could likewise disappear behind the unsupported-only fallback.
- A saved structural match could be labeled with an unrelated Expected Hostname. The selector used `r.expected.ascii` before the actual saved match.
- An invalid optional Expected Hostname could displace an independently successful saved exact/subdomain comparison. The error remains beside its field and as a secondary notice when no stronger finding exists; a valid explicit exact target retains its precedence.
- A supported expected visual/structural warning also produced a redundant generic mismatch.
- Advanced results repeated the legacy assessment/supporting text, polished diagnostic log and raw log; ordinary ASCII observations and complete check tables appeared in several places.
- Equivalent expected/personal proofs appeared as separate reference records. They now share one record with both source labels.
- Native review caught a routine `suppressed-exact-membership` row that survived the first simplification. It is a normal processing state, now confined to complete raw comparison records.
- Native testing caught the new formatted comparison JSON passing through `Inspector.visible`, which replaced formatting newlines with visible control markers. The final display uses the established `rawText` formatter: genuine line breaks, escaped non-ASCII/control-bearing values, inert text nodes and parseable JSON. This was a defect in the new refinement, fixed before handoff.

## Corrected behavior and priorities

| Input and selected comparison | Current result |
| --- | --- |
| `example.test`, saved `example.test`, no expected target | **Matches your saved reference**. “The hostname matches example.test, which you saved in Your Reference Domains. This does not verify website safety.” Secondary, quiet note: “Automatic popular-domain comparisons do not apply to .test addresses.” |
| `example.com`, saved `example.test` | **No lookalike warnings found**, qualified by the supported-check and safety limitation. No ordinary reference nonmatch warning. Opened comparison evidence says “No match with your saved reference example.test.” |
| Exact saved `example.test` + invalid Expected Hostname `bad/path` | Saved match remains primary; field error and secondary notice remain visible. |
| No saved references | No absent-reference report or empty personal-comparison panel. |
| Saved visual comparisons unavailable | Explicit “could not be completed” wording and coverage qualification; no completed-nonmatch claim. |
| IP/single-label nonmatch | “No exact match…” plus exact-only scope, rather than claiming completed visual comparisons. |
| `login.example.test`, saved `example.test` | Neutral **Subdomain of your saved reference**, with scope and safety qualification; automatic limitation is secondary. |
| `exampel.test`, saved `example.test` | Informational **Similar spelling**, without a visual/intent claim; automatic limitation is secondary. |
| `example.test.evil.test`, expected `different.test`, saved `example.test` | Structural warning names **example.test**, the source that actually matched. |
| Strong automatic/embedded resemblance with exact expected/personal identity | Strong caution retains priority. |
| Unavailable/limited checks without an independent meaningful result | Qualified incomplete result, never a completed negative. |

Exact expected/personal matches are successful comparisons, not successful negative threat analyses. Incomplete or unavailable independent methods remain qualified alongside them. Actual detector policy, source reconciliation, parser behavior, budgets, datasets and pins are unchanged. See `AUTOMATIC_FINDINGS.md` for the current deterministic display priorities.

## Advanced evidence consolidation

The user deliberately expanded the recording's subsections. Their defaults were already correct. This refinement preserves native, independent collapsed defaults; no default-expansion bug was inferred or “fixed.”

- **Comparison evidence & limits:** one manual/personal proof per equivalent target/mechanism with accurate combined source labels, completed nonmatches when useful, genuine coverage exceptions, and built-in rank/row provenance. Routine complete, not-applicable and exact-membership suppression tables are absent.
- **Input & Normalization:** only distinct forms or noteworthy attribution evidence. No repeated actual-hostname row; the actual hostname remains at the top.
- **Character Details:** meaningful original/readable non-ASCII or hidden characters, with their full existing properties. No empty ASCII placeholder inventories; an rn/m finding retains its concrete comparison mechanism in the primary and concise evidence.
- **URL Components:** populated/nondefault values and explicit port evidence. Routine absent query, fragment, port, root path and HTTPS rows are omitted. No generic report of a complete empty embedded extraction.
- **Exact address occurrences:** existing bounded entries, parent/source sites, decoding steps, ranges and further full-value reveals. The ordinary location is concise; exact location and parent metadata are displayed in revealed provenance. Comparison summaries are not repeated again inside the same full-value reveal. Generic supported-format specifications moved to optional Help; actual scoped limit codes remain with evidence.
- **Raw Diagnostic Records:** the sole ordered display of unchanged original message code, level, category and text. Further explicit disclosures retain exhaustive ASCII observations/locations, complete comparison JSON (all per-class states, raw proofs, source labels and membership), and the original submitted URL. Complete comparison JSON omits recovered source URLs and parameter payloads; those retain their exact-occurrence reveal. The duplicate legacy assessment, supporting list and polished Full Diagnostic Log were removed from the displayed flow. Original engine objects remain unchanged in memory.

Raw records mount only when opened. Closing inner/outer disclosures or reinspecting clears mounted raw/private bodies, including held detached occurrence nodes. Existing source/license materials remain application-level, outside per-URL findings.

## Inventory and coverage strategy

`tests/messaging-inventory.json` records source identities and literal/HTML/CSS candidates across all 20 runtime-copy/build/style sources, plus the unchanged legal/data boundaries. Its 23 reviewed families identify trigger, underlying evidence, importance and coexistence risks: input/attribution/URL-structure errors; expected comparisons; saved exact/subdomain/visual/structural/spelling/nonmatch outcomes; neutral built-in membership; automatic visual/structural/spelling results; embedded findings/uncertainty; coverage and asynchronous states; advanced/character evidence; reference CRUD/import/export/storage; cache/update status; Help/legal/source text. Candidate harvesting includes non-copy code/data tokens and is a completeness aid, not a JavaScript parser or automatic editorial verdict.

The independently authored message suite checks actual generated DOM, not only engine objects. It asserts primary title/explanation/importance, source attribution, secondary findings, qualifications, meaningful omissions, absence of affirmative safety claims, collapse/lazy-record behavior, inert rendering, focus and privacy cleanup.

The deterministic matrix has **96 rows per edition**: 12 URL classes × 8 reference configurations, with expected index `(URL index + reference index) % 6`. Explicit pair-set assertions prove coverage of all 72 URL/expected, 96 URL/reference and 48 expected/reference index pairs. URL classes cover ordinary/supported negative, strong ASCII/Unicode, PRIVATE structural, weak spelling, exact built-in, unsupported suffix, malformed input, embedded lookalike, uncertain embedded boundaries and repeated nested evidence. Expected configurations include empty, exact where possible, unrelated, fixture target, invalid and unsupported RTL. Reference configurations include none, exact, unrelated, fixture target, conflicting, overlapping built-ins, unsupported suffix and protected storage. Invalid inputs cannot have an actual exact hostname; fixture-target comparisons are visual only where that relationship is meaningful, rather than inventing impossible states.

Additional selected higher-order cases cover exact expected + exact saved + independent strong evidence; same-pair multi-source consolidation; invalid expected + automatic warning; missing/incompatible data, pair/spelling exhaustion and partial extraction; failed/protected storage; private nested occurrences; and independent equivalent cases in both editions. Automatic/embedded states are outcomes of fixed real fixtures, not an unbounded artificial Cartesian product. Metamorphic assertions verify that adding unrelated references preserves the primary evidence, duplicating nested occurrences preserves two unique values while retaining four correct sites/parents, and a late strong positive survives repeated-value saturation.

## Verification

| Scope | Final evidence |
| --- | --- |
| Current generated standalone/hosted messaging | **257/257 tests; 1,336/1,336 assertions** |
| Current isolated build integrity | **9/9 checks**, including deterministic bytes, exact assets/notices/CSP/worker and stable artifact preservation; message execution is counted separately |
| Current `deno task test:messaging` entry point | All 3 command groups pass in a disposable copy |
| Current analysis suites | **109,056 tests**, zero failures: unit, references, differential, provenance, coordinator, worker and hosted bootstrap |
| Disjoint calibration | 10,000 domains; unchanged 2 ASCII visual / 5 spelling-only / 0 incomplete |
| Aggregate runner | **48/48 commands**, including the unchanged prior 37-command runner against exactly restored historical interfaces; nested counts are not independent grand test totals |
| Strict isolated Deno 2.9.7 | Foundation **162/162, 49,099 assertions**; matcher **119/119, 38,859 assertions**; strict index `--check` passes, zero skips |
| Native macOS Firefox 158.0.1 | **40/40 checks** across file and loopback editions; 12 retained result/zoom screenshots |

The native checks cover both supplied reference cases, real collapse/keyboard activation, focus, exact raw records, full comparison JSON, strong/weak findings, correct structural source, private nested parents/reveal/cleanup, reference persistence/schema, no inspection-driven storage writes, 320px reflow, actual **200%/400% tab zoom** including expanded raw evidence, and hosted service-worker reload/inspection after stopping the test server. At a 1280px viewport real zoom measured 640/320px inner width and devicePixelRatio 2/4, without horizontal overflow. Screenshots were visually inspected. No inspected-destination request or unexpected page error was observed; expected favicon CSP blocks remain documented. Browser-process platform/sandbox/crash-helper warnings are not represented as warning-free execution.

The approved **single combined Blackberry & Amethyst palette** is preserved. There are no separate theme variants to test. Existing base/v3/embedded/automatic CSS, typography, animations and reduced-motion rules are unchanged. Native HTML semantics and polite announcement privacy were tested; VoiceOver speech, physical devices, OS picker/download acceptance and preference-driven reduced-motion interaction were not performed.

Two initial test-routing errors sent mixed v3.2 engine/DOM suites to the current Stage 6 DOM; their old literal headlines/panel assumptions failed while engine groups passed. Their original full suites are covered by the unchanged nested historical runner. No test body or expected fixture was weakened. `tests/messaging-compatibility-attempts.json` preserves these attempts and the initial native JSON-formatting defect. The correction was to route each interface assertion to its exact historical runtime, while current message/provenance/coordinator tests use current sources.

Temporary Deno archive/executable hashes match the previously verified official immutable 2.9.7 release. Tests use an absolute temporary executable, private cache and copied inputs with no network permission. The installed Deno 2.9.8 executable and its hash are unchanged; generation guards/pins remain strict. `tests/messaging-strict-runtime-results.json` retains complete execution evidence. No engine/runtime identity was spoofed.

## Exact changed files

Relative to this task's independently captured 401-file starting inventory, **12 existing files** changed:

- Guidance: `AGENTS.md`, `AUTOMATIC_FINDINGS.md`, `DESIGN_NOTES.md`, `EDITORIAL_STYLE_GUIDE.md`, `README.md`.
- Product presentation: `src/results-presentation.js`, `src/automatic-ui.js`, `src/ui.js`, `src/embedded-ui.js`, `src/template.html`.
- Current test tasks/historical adapter: `deno.json`, `tests/harness.mjs`.

**15 files** were added: this review; `tests/messaging-results.mjs` and its JSON report; `messaging-build.py` and its JSON report; `messaging-regressions.py` and its JSON report; `messaging-firefox.mjs` and its JSON report; `messaging-inventory.py` and its JSON inventory; `messaging-source-boundaries.json`; `messaging-compatibility-attempts.json`; `messaging-strict-runtime-results.json`; and `messaging-integrity.json`.

No starting file was deleted. All other 389 starting files remain byte-identical, including every earlier test/fixture/report, matching/extraction algorithm, store/schema, dataset/generator/pin, stable distribution/worker/manifest, release checksums, release verifier and deployment workflow. Seven exact source/helper/task restoration boundaries reconstruct the pre-task bytes only in disposable copies; original whole-file pins remain authoritative. `AGENTS.md` holds the single permanent **Systematic Result & Messaging Validation** requirement and the concise no-duplication/independent-success rules; other guidance links to it.

## Preview, reproduction and limits

Open the current standalone preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/006-Offline_URL_Inspector.html` (SHA-256 `6b895540003a19d3bad3ec0b2ade80d9c75ee60034264349ffb8e3b65e71687d`).

Exact URL:

```text
file:///private/tmp/oui-stage6-messaging-7ktxp4z_/preview/standalone/Offline_URL_Inspector.html
```

The retained hosted preview is `/private/tmp/oui-stage6-messaging-7ktxp4z_/preview/site/`. The preview matches the native and repeated-build manifests. Screenshots/logs/pre-change sources remain outside the repository. The owned Firefox process, isolated profile, zoom helper, runtime archive/executable, strict source copy and private cache have been stopped/removed; test servers are stopped. Temporary-folder retention is controlled by macOS.

```sh
python3 -B tools/build.py --automatic-ui-preview --output-root /private/tmp/oui-stage6-messaging-preview
deno task test:messaging
python3 -B tests/messaging-inventory.py --check
python3 -B tests/messaging-regressions.py --development-root /private/tmp/oui-stage6-messaging-preview
```

Engine eligibility, finite visual/spelling classes, incomplete RTL comparison, browser IDNA differences, bounded embedded extraction, cooperative budgets, popularity bias, file-storage variability and one-time initialization cost remain. Pairwise/higher-order tests are targeted coverage, not proof of every possible URL/state. No redirect/content/ownership/reputation check or comprehensive safety verdict is introduced. Manual VoiceOver/headful/device acceptance and final distribution/source-availability review remain later acceptance concerns; no Stage 7 or Stage 8 work is authorized or performed.

Work stops after this Stage 6 correction and audit for user review.
