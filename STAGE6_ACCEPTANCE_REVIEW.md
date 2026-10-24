# Stage 6 manual acceptance corrections

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

Branch `dev/v3.3.0-automatic-lookalikes`, unchanged HEAD `664cc58bf67a2127d0523adec9f1d80c6edd656e`. All earlier development is preserved. Changes remain local, unstaged and uncommitted. No branch/worktree, commit, push, merge, PR, release, deployment or Stage 7/8 work occurred.

## Defects and representative results

| Case | Before | After |
| --- | --- | --- |
| #7: inspected `rnicrosoft.com/login`, expected `microsoft.com`, saved `rnicrosoft.com` | Correct primary warning; ordinary comparison listed only built-in support. | One warning/one comparison record lists **Expected Hostname** and **Built-in popular-domain references**. Exact saved identity in `rnicrosoft.com` appears separately as neutral context. |
| #10: Cyrillic-а `аpple.com` | “а may look like a” named indistinguishable glyphs without useful identities. | “**Cyrillic character ‘а’ (U+0430) can resemble Latin character ‘a’ (U+0061).**” Both browser ASCII/Punycode and readable Unicode hostname forms are labeled in the main identity area. |
| #14: embedded `google.com@attacker.test` | Correct recovered hostname/userinfo warning, followed by “Some addresses could not be fully checked.” | The warning identifies **attacker.test** as the actual embedded hostname, explains that text before @ is user information, and does not reveal that userinfo. Secondary note: “**Automatic popular-domain comparisons do not apply to embedded .test hostnames.**” |
| Deliberately opened Complete comparison records | Large serialized state object. | Removed. No replacement diagnostic export or serialized state display. |

The first and third are presentation correctness defects: missing supported source attribution and incorrect limitation scope. The Unicode change is a generalized clarity correction to an already correct resemblance finding. Removing state-object displays follows the user's explicit content requirement; the defaults were already collapsed and were not changed.

## #7 source attribution root cause

The coordinator already retained all evidence. For this case it produces three distinct relationships:

- `unicode-visual`, `full-hostname`, target `microsoft.com`, source **expected**: existing UTS #39 proof.
- `ascii-visual`, `full-hostname`, target `microsoft.com`, source **builtin-majestic**: existing finite rn/m proof.
- `exact-hostname`, `full-hostname`, target `rnicrosoft.com`, source **personal-reference**: exact saved identity, with no visual support for the different target.

`AutomaticUI.view` previously collected only relationships whose support included a built-in source. Since the two visual proofs have different classes, the expected proof is a different relationship and was missed. Presentation now collects actually supported visual relationships for the same analysis and reference pair, while preserving distinct proof methods. Structural and spelling support stay scoped to their own classes. An unrelated expected hostname or an exact saved match in another target cannot acquire a resemblance source label.

The record identifies the built-in ASCII method; its optional explanation separately identifies the expected UTS #39 method. Both original relationship objects remain unchanged. The exact saved match is a concise separate identity row when a caution makes that context useful, not a third finding or a safety signal. Equivalent original/embedded and overlapping-personal cases are tested.

## General Unicode presentation rules

- Use verified character records from the pinned engine evidence: exact code points and script identities. Character evidence retains the original official Unicode names and mapping data.
- For short changed spans, name the character or sequence and its code points on both sides. This applies to supported Cyrillic, Greek, Latin, Armenian and other eligible scripts; no Cyrillic-а special case exists.
- Say a changed sequence can resemble another only when the existing pinned skeleton data supports that span relationship. Otherwise explain the verified whole-hostname comparison and identify the changed text without inventing aligned character pairs.
- Manual-only visual proofs use the same presentation policy. The independently verified Armenian U+0560 → Latin `rn` example demonstrates one-to-many sequence handling; the matching policy is unchanged.
- Missing or unknown character metadata falls back to exact code points. Do not guess a name or script. Changed spans longer than eight code points use a concise whole-hostname explanation; their complete existing evidence remains available. This is a display bound, not a detector limit.
- Show valid distinct readable Unicode and browser ASCII/Punycode identities together, with clear labels. ASCII-only and failed readable validation do not gain fabricated Unicode representations. Redundant readable-hostname rows deeper in Technical Details/normalization are omitted.

Actual reference matches exercised include Cyrillic `аpple.com` and `аррӏе.com`, Greek `gοοgle.com`, Latin dotless-ı `ıcloud.com`, and Armenian `ՠicrosoft.com`, including native A-label equivalents. The ordinary warning retains concrete ASCII rn/m explanations.

## #14 coverage-state root cause

The exact supplied input is:

```text
https://example.net/?next=https%3A%2F%2Fgoogle.com%40attacker.test%2Flogin
```

The pre-change probe, retained at `/private/tmp/oui-stage6-acceptance-0xofwhza/before-probe.json`, records:

| Structured state | Actual value |
| --- | --- |
| Original hostname | `example.net` |
| Embedded candidate | Reliable absolute HTTP(S), hostname `attacker.test`, `hasUserinfo: true`, `userinfo` warning |
| Embedded extraction / occurrence coverage / discovery | **complete / complete / complete** |
| Original automatic matching | **complete** |
| Embedded automatic matching | **ineligible**: unknown suffix `.test` |
| Recorded embedded automatic coverage | **unsupported** |
| Aggregate recorded/automatic coverage | **partial**: mixed complete and ineligible contexts |
| Scoped limitation | `automatic / boundary-unknown-suffix` |
| Resource limitation | **false** |

The aggregate contract correctly describes mixed matching coverage; it does not mean extraction was interrupted. The former `ResultsPresentation.coverage` fallback converted any otherwise-unexplained automatic `partial` into “Some addresses could not be fully checked.” The presentation now reads per-analysis eligibility and independent extraction/occurrence states. No coordinator, extractor, matcher or status schema was changed.

Unsupported notes identify original versus embedded scope and consolidate equivalent suffix reasons. Distinct suffix scopes remain distinct. Actual extraction saturation retains its existing incomplete-appearance explanation, while resource-limited matching, unavailable databases and independent matcher failures retain appropriately scoped qualifications. A synthetic structured failure test ensures an unavailable matcher is not hidden by an unsupported-suffix note. An unsupported-only mixture may lead with neutral “Some automatic comparisons are unavailable”; it cannot become a completed negative.

## Readable evidence and privacy

The Complete comparison records disclosure and its serialization handler are removed. The older serialized hostname-attribution object is also removed; its readable attribution explanation and exact original normalization/character evidence remain. No usefulness case justified a diagnostic export, so none was added.

Full result objects, per-class statuses, original proof objects, source relationships and provenance remain intact in memory and in the structured test evidence. Users can inspect source/method labels, concrete mechanisms, official character identities, meaningful coverage exceptions, original ordered diagnostic messages and exact occurrence provenance without reading an internal state object. Ordinary successful checks still do not produce status inventories.

All remaining diagnostic subsections retain their working native collapsed defaults. Full source values, userinfo, parameter names and tokens retain deliberate sensitive-value reveals and close/reinspection cleanup. Added text uses inert text nodes and the existing visible-control handling. No inspected destination links/requests, telemetry, inspected-value persistence or storage-schema changes were introduced. No raw comparison JSON or new developer controls appear in the inspection interface.

## Tests and native evidence

| Scope | Final result |
| --- | --- |
| Current generated standalone/hosted message acceptance | **52/52 tests; 400/400 assertions** |
| Current isolated build integrity | **9/9 checks**: byte repeatability, exact data/notices/CSP/worker and stable artifact preservation |
| Current `deno task test:acceptance` entry point | **3/3 command groups** |
| Current analysis suites | **109,056 tests**, zero failures: unit, references, differential, provenance, coordinator, worker, hosted bootstrap |
| Disjoint 10,000-domain calibration | Unchanged 2 ASCII visual / 5 spelling-only / 0 incomplete |
| Current + exact historical-interface regression runner | **59/59 commands**, including the unchanged earlier 48-command runner |
| Strict isolated Deno 2.9.7 | Foundation **162/162, 49,099 assertions**; matcher **119/119, 38,859 assertions**; strict index `--check` passes; zero skips |
| Native Firefox 158.0.1/macOS | **32/32 checks**, file and loopback editions; **16 retained screenshots** |

The current tests use independently authored semantic expectations for the supplied cases, equivalent source configurations, ten readable/A-label Unicode inputs per edition, sequence handling, missing metadata, scoped failures, real partial extraction, no JSON displays, privacy cleanup and storage/evidence preservation. Existing assertions and fixtures remain unchanged, including former positive JSON-display assertions: those run only against their exact historical presentation in disposable copies. Nested command/test counts are not added as independent grand totals.

Native checks cover source/method labels, Cyrillic/Greek/Latin/Armenian identities, dual hostname forms, one-to-many evidence, #14's scope, independent collapsed defaults, readable diagnostics, private reveal/held-node cleanup, partial extraction, keyboard/focus, announcement privacy, unchanged storage/backup schema, 320px reflow and actual **200%/400% tab zoom**. At 1280px, Firefox measured 640/320px inner width and devicePixelRatio 2/4, without page-wide horizontal overflow. Screenshots were visually inspected. The hosted cached application reloads and inspects after stopping its server. No inspected-destination request or unexpected page error was observed; expected favicon CSP blocks and browser-process platform warnings are kept separate.

`tests/acceptance-validation-notes.json` records implementation-time harness corrections: an assertion initially targeted the wrong disclosure, an unanchored historical-runner source replacement matched a quoted literal as well as the real line, and one new native expression had a quoting error. These are distinguished from application defects. All final checks pass; no old expectation was weakened.

The official temporary 2.9.7 archive/executable matched previously verified publisher hashes. Tests ran with an absolute executable, private cache, copied inputs and no test network permissions. The user's installed Deno remains 2.9.8 with the same hash. Strict source/data/runtime pins were not changed or bypassed.

VoiceOver, physical devices, OS picker/download behavior and manual headful acceptance were not performed. Native headless evidence is not screen-reader acceptance. The approved combined Blackberry & Amethyst palette, existing stylesheets, typography, title/reduced-motion rules and native interactions remain preserved.

## Exact files and preservation

Relative to the independently captured **416-file** starting state, **11 existing files** changed:

- `AGENTS.md`, `AUTOMATIC_FINDINGS.md`, `DESIGN_NOTES.md`, `EDITORIAL_STYLE_GUIDE.md`, `README.md`.
- `src/results-presentation.js`, `src/automatic-ui.js`, `src/ui.js`, `src/template.html`.
- `deno.json`, `tests/harness.mjs`.

**15 files** were added: this review; `tests/acceptance-results.mjs` and its JSON report; `acceptance-build.py` and its JSON report; `acceptance-regressions.py` and its JSON report; `acceptance-firefox.mjs` and its JSON report; `acceptance-inventory.py` and its JSON inventory; `acceptance-source-boundaries.json`; `acceptance-strict-runtime-results.json`; `acceptance-validation-notes.json`; and `acceptance-integrity.json`.

The remaining **405 starting files** are byte-identical; no starting file was deleted. All matching/extraction modules, storage/schema, datasets, generators, pins, earlier tests/reports, stable v3.2.0 artifacts, worker, checksums, verifier and deployment workflow are preserved. Six hash-bound file reversals reconstruct exactly the pre-task sources/helper/tasks only in disposable test copies. The current inventory traces 23 message families across all 20 runtime-copy/build/style sources without overwriting earlier inventories. AGENTS.md reinforces the existing identity/source/scope/readability principles and retains the named systematic validation rule.

## Preview and remaining limits

Open the tested standalone — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/001-Offline_URL_Inspector.html` (SHA-256 `4f88cee07fb72a94a555b1864901cb5c228f3c2cb0df1c741fd24586f092bd8c`).

```text
file:///private/tmp/oui-stage6-acceptance-0xofwhza/preview/standalone/Offline_URL_Inspector.html
```

The hosted preview is `/private/tmp/oui-stage6-acceptance-0xofwhza/preview/site/`. Preview/native/repeated-build identities agree. Logs, screenshots and before sources remain outside the repository; temporary runtime/cache/copy and isolated browser resources are removed and test servers stopped. macOS controls temporary-folder retention.

```sh
python3 -B tools/build.py --automatic-ui-preview --output-root /private/tmp/oui-stage6-acceptance-preview
deno task test:acceptance
python3 -B tests/acceptance-inventory.py --check
python3 -B tests/acceptance-regressions.py --development-root /private/tmp/oui-stage6-acceptance-preview
```

Existing native-IDNA differences, finite visual/spelling eligibility, incomplete RTL/Bidi matching, bounded extraction, cooperative budgets, one-time initialization cost and browser/profile-dependent storage remain. Help explicitly states current bounded percent decoding and excludes Base64, Base64URL, JSON, JWT, encrypted and proprietary decoding; none was implemented or promised. Broader decoding and full RTL/Bidi matching remain research possibilities requiring separate authorization. Final source-availability/distribution and manual accessibility/device acceptance remain later-stage concerns. Work stops at this focused Stage 6 correction for user review.
