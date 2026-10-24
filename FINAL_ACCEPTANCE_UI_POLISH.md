# Final acceptance — targeted UI polish

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

23 October 2026. **Requested presentation refinements completed for user review.** No detection development, new feature, theme, panel or release promotion was performed. The independently reverified Stage 8 candidate is the comparison baseline; this report records the subsequent local UI changes and does not authorize publication.

## 1. Exact modified and created files

Exactly five of the 566 starting files changed:

| File | Change |
| --- | --- |
| `src/automatic.css` | Shared secondary severity typography, parent/scope spacing and indentation, equivalent finding alignment, and concise nested-source notes. Existing palette and caution rule retained. |
| `src/automatic-ui.js` | Simplify ordinary recovered-host rows; preserve the full technical branch and exact-occurrence action. Reads existing candidate provenance without changing it. |
| `AUTOMATIC_FINDINGS.md` | Update the current presentation contract for hierarchy and ordinary/technical provenance. |
| `tools/release_candidate.py` | Add the three permanent polish regression sources to the explicitly enumerated archive inputs: 74 → 77. No validation assertion changed. |
| `.github/workflows/deploy-pages.yml` | Route the existing historical-test step through `ui-polish-regressions.py`, which tests the new UI before running the unchanged historical chain. No authorization/main/digest/action-pin/deployment condition changed. |

The last two changes keep reproducible packaging and historical assertions usable after an intentional UI-source change. They do not relax Stage 7 safeguards. `tools/release_gate.py` remains unchanged with all 14 mandatory groups.

New sources: `tests/ui-polish-cases.mjs`, `tests/ui-polish-results.mjs`, `tests/ui-polish-firefox.mjs`, `tests/ui-polish-regressions.py`, and `tests/ui-polish-source-boundaries.json`. New reports: `tests/ui-polish-{starting-inventory,results,before-results,gate-results,release-results,regression-results,historical-suite-index,firefox-results,first-firefox-results,viewport-results,nested-limit-evidence,validation-notes,integrity}.json`, plus this document. The integrity inventory enumerates their exact paths and hashes; its own hash is deliberately excluded.

Every other starting file remains byte-identical, including all prior audits, reports, AGENTS.md, engine/parser/storage/priority sources and stable v3.2.0 output. No existing test expectation or historical report was overwritten.

## 2. Before and after

| Surface | Before | After |
| --- | --- | --- |
| Severity metadata | 10px bold Caution/Information, small relative to the finding | Both use 12px / 1.5, weight 600. Caution stays gold; Information stays muted lavender. |
| Other findings hierarchy | Parent and scope both used the same small uppercase label style, with extra gaps between them | Parent is 13px and stronger; the existing 11px scope sits beneath it with a modest inset. Finding content sits one level farther in. No new container. |
| Finding title | 13px at ordinary width, inherited 12px at narrow width | 13px / 1.5, weight 650, including narrow width; remains stronger than severity metadata and smaller than the unchanged primary warning. |
| Ordinary direct recovered name | `example.org · different from the original · link parameters` | `example.org` |
| Ordinary nested name | `example.com · different from the original · nested address text` | `example.com` followed by “Found inside another address.” |
| Same hostname found directly and nested | Combined technical metadata | Hostname followed by “Also found inside another address.” |

The existing uncertainty cue remains when hostname interpretation is uncertain. Technical Details retains same/different relationship, source component/location, occurrence counts and **View exact occurrences**. Exact parameter names, source values, ranges, decoding steps, nesting and parent relationships remain in their existing deliberate disclosures. No recovered address is described as a confirmed redirect.

Normal Firefox captures: before hierarchy — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/041-before-0.png` (SHA-256 `4f1075b8d6e59f393fc05042c276f5938bc37d2a366648235ad19a1585f21caf`), after hierarchy — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/055-standalone-0.png` (SHA-256 `b80402f2315db4480f8c5e9cfdb10c1b875805de243a8b16c9650dfff0343627`), before provenance — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/043-before-12.png` (SHA-256 `5f1ffd3e58c8dd5d4505f5f503d7e0b091e26a7d1b413d613460961325563d2a`), after provenance — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/057-standalone-12.png` (SHA-256 `8dd0a58b643be400e1f4d049533b40a2b32460d27754c188208d781e2a34bd4f`).

## 3. Generalized styling and rendering rules

The same selectors style every secondary caution and informational finding across original, embedded and Expected Hostname scopes. Priority, severity, ordering, deduplication and accessible-name references are unchanged. The parent/list gap is reduced; scope groups use a 12px inset, and equivalent caution/information text aligns after accounting for the existing two-pixel gold caution rule. Findings retain separation, and a new scope remains distinguishable when priority requires switching scope. The chosen spacing/type values are presentation choices, not new security constraints.

Only the shared `embeddedLine` helper distinguishes ordinary from technical rendering. Ordinary output uses hostname plus a short note when nested provenance materially adds context. Technical output retains the previous metadata and action. No hostname, brand, suffix or test-URL exception is introduced. No underlying evidence is removed, serialized into the interactive UI or rewritten.

## 4. The @ explanation is unchanged

The full generalized sentence remains:

> Text before @ is not the website name. The actual hostname is rnicrosoft.com.

The hostname is still substituted dynamically. It is not split, shortened, bolded, separately colored or additionally highlighted. `src/results-presentation.js`, which supplies the sentence for original and embedded findings, is byte-identical to the independently reverified baseline.

Native before/after comparisons verify the full sentence, font size, weight, color and absence of child formatting for both primary and secondary treatments in both editions. The sentence remains one plain text finding-thought; changing the surrounding severity metadata does not restyle its hostname.

## 5. Exact nested-limit verification

The user supplied:

```text
https://example.net/?outer=https%3A%2F%2Fexample.org%2F%3Fnext%3Dhttps%253A%252F%252Frnicrosoft.com%252Flogin
```

**The existing notice is correct and was left unchanged.** Both the original deterministic extractor and unmodified native Firefox execution recover `example.org` and its child `rnicrosoft.com`. The Microsoft lookalike warning remains visible.

A read-only instrumented copy of the original limit hook identifies the attempted work item: `Nested URL 2 · path`, text `/login`, processing depth **4**, percent layers **2**. The approved processing-depth cap is **3**, so that path is not queued. The actual result records `partial`, occurrence coverage `partial`, and a `depth` limitation at that location. This cap is a processing budget across decoding/nested work, not simply a count of hostname nesting levels. The notice does not assert a known third destination; it reports that further text was not fully examined.

The complete control `https://example.net/?p0=` followed by the percent-encoding of `https://example.org/?next=https://rnicrosoft.com/login` retains the same child warning with complete extraction and no depth/expansion notice. Direct recovered and nested neutral controls also complete without the notice. The warning is therefore driven by recorded budget evidence rather than mere presence of another URL.

Evidence: `tests/ui-polish-nested-limit-evidence.json`, the focused DOM tests, and the native budget/control check. Extractor source, budgets, supported decoding and the notice-producing policy are byte-identical to the starting snapshot. No extraction capability was expanded.

## 6. Automated and native verification

| Check | Result |
| --- | --- |
| New current-candidate DOM/copy/typography/provenance tests | **52/52**, **922/922 assertions**, both editions |
| Same assertions against preserved earlier UI | 52 executed: 16 passed, 36 expected presentation failures; demonstrates the prior small labels/verbose rows. No skips counted as passes. |
| Mandatory release gate | **14/14 groups**; includes current messages, 76 Stage 8 result regressions, strict generation/runtime rejection, engine/Unicode/reference/provenance/comparison and worker/update checks |
| Stage 7 release/artifact rejection and reproduction fixtures | **17/17** |
| Full preserved historical chain | **PASS**; 80 nested report entries including the new current wrapper. Nested/repeated counts are not additive. |
| Native headless Firefox | **67/67**, file and loopback editions; **84 actual computed accessible-name matches** |
| Native layout/zoom measurements | **30** across 320px windows and real 200%/400% zoom; no horizontal overflow or severity/title overlap |
| Focused actual-viewport paint verification | **6/6 configurations**, **18 captures**, both editions at narrow/200%/400% |
| Artifact correspondence and double build | All eight outputs byte-identical across two builds; verifier reconstructs source correspondence |

The 25 shared cases include primary/secondary warnings, information-only and neutral cases, multiple embedded warnings, HTTP plus ports, original/embedded userinfo with lookalikes, Unicode, all source scopes, repeated/nested/mixed-direct occurrences, the exact supplied limitation, complete controls, private values and the Stage 8 saved-reference correction. Visible severity and scope remain accurate; accessible finding names retain scope, severity, title and affected hostname in the existing reading order.

Firefox **158.0.1, build 20261019185856** ran in owned temporary profiles. Loaded executable-script hashes were checked against the candidate manifest, separately from filesystem hashes. Keyboard exact-occurrence navigation and focus, collapsed private disclosures, reveal cleanup, shortcut behavior and absence of inspected-value persistence pass. Hosted verification stops the local server and reloads the cached app with zero further served requests. Inspector-associated network events stay on fixed application resources; no inspected destinations were requested and no unexpected page errors were recorded.

Computed severity colors retain the existing tokens. Calculated contrast against both opaque result-card gradient stops is at least **8.37:1**, above the 4.5:1 small-text criterion. Representative native screenshots were opened and visually inspected; these checks are separate from DOM/layout measurements.

**Capture caveat investigated:** some full-document PNGs after viewport/zoom changes omitted or clipped offscreen text despite passing DOM/layout checks. Two paint frames alone did not fully resolve that capture path. Actual viewport captures after deliberate scrolling show complete, correctly wrapped text. The screenshot helper now captures a visible card or viewport sections as appropriate. The focused six-configuration probe verified that path without changing product CSS or logic. Both earlier native runs passed the same 67 interface assertions; their counts are not added together, and incomplete full-document images are not treated as visual acceptance evidence.

Reliable zoom evidence: 400% hierarchy viewport — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/029-hosted-4-hierarchy.png` (SHA-256 `4ae78586234613cf68e782cd7e54cba3fe40493dc426755041b5bcdfc4667b4f`), 400% information viewport — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/030-hosted-4-information.png` (SHA-256 `581effc9516ee51dcdbc682a55d1cf9a10e2c36d3a206e9f8b2e0c55b5704400`), 200% viewport — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/035-standalone-2-hierarchy.png` (SHA-256 `fa9ded7121b991c0c0e18cd838a3326db05a4ad448d5289c57479696a9eca015`), narrow viewport — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/023-hosted-1-hierarchy.png` (SHA-256 `6bb9009a739a84267a483543cdc0aa74ca029306e0d6da5def2be7efec02bfa7`).

Historical assertions run through hash-checked restoration of five pre-polish interfaces in disposable copies, followed by the unchanged Stage 8/7/6 chain. Current polish assertions run first on the revised candidate; restored-source passes are not claimed as current UI verification. No source pins were loosened. The native screenshot helper's final capture-only adjustment was also syntax-checked, and its viewport behavior was verified by the focused probe.

## 7. Preservation and remaining limits

All Majestic/PSL/Unicode snapshots, index bytes and manifest, comparison/matching/parsing/priority/storage policies, privacy safeguards, licensing/source availability and disclosure defaults remain unchanged. Both Stage 8 correction sources and their manifest identity are preserved. All eight embedded data/license blocks are byte-identical in each edition; NOTICES.txt is unchanged. The combined Blackberry & Amethyst palette is unchanged.

No unresolved product defect was established by these focused checks. The nested cap remains an intentional existing limitation. Full-document screenshot behavior at zoom is a test-capture limitation; the actual viewport evidence above was used for visual review.

This task's native checks are headless. Human acceptance of the revised UI, VoiceOver, physical-device and live Actions/Pages behavior are not newly claimed. The user's prior hands-on 11-case testing and the independent Stage 8 verdict refer to the preceding baseline. These refinements remain local for user review; no new independent audit approval or deployment approval is implied.

## 8. Updated candidate identities and hashes

Branch remains `dev/v3.3.0-automatic-lookalikes`. HEAD and local `main` remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`; the staged index remains empty. Stable v3.2.0 outputs are unchanged.

Version remains **3.3.0-rc.1**. New runtime release: **3.3.0-rc.1-c60cdd0c2515f03e**. New **77-input** digest: `e4ce06a26b57c2ec38794ce1fb5aaeda3c6bb9f0cfb1f97e76e6260d8344fcbb`. This is local content identity, not a new commit. Comparison baseline: release `3.3.0-rc.1-946a50956b424613`, source digest `78923611b5530e0055e7460a4427fa354d53c3694f3e2cf48d00ea7fec155292`.

Expected artifact changes are CSS/script/CSP and HTML from shared presentation changes, worker HTML/release identity, revised documentation/test sources in the archive, build manifest and checksums. Data/license blocks, NOTICES.txt and .nojekyll remain unchanged. The native helper, boundary file and evidence reports sit outside the scoped build-input archive and are covered by the full checkout integrity inventory.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `standalone/Offline_URL_Inspector.html` | 4044551 | `6d19bdae9be145251e14407e78eb6d4c9ef90253016be07129ce5052a86a0153` |
| `site/index.html` | 4056611 | `c60cdd0c2515f03e24791297b6203ec6c61adf3cdbcc1cc663fa208fc1ac7ac5` |
| `site/sw.js` | 4153 | `f84b2fa4a74005f8b7d3a77a642a2ff191ba24db30a56eb11929397dc6e31ab3` |
| `site/.nojekyll` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `NOTICES.txt` | 32246 | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `source-materials.zip` | 2813784 | `f741179c58c3dc3136c30857e8d1a4079cde10e5dcaabd594145d9b303c04ebf` |
| `build-manifest.json` | 17604 | `c6e2843f0a8534f00f592f8b051cb9203d443dff3f88ab457e92ecb95f58abd2` |
| `SHA256SUMS` | 595 | `fead3e1725290ed293de24a20f5aed9ac392f9ef4152977cfe754bc21c229ce1` |

## 9. Fresh preview and repeatable checks

Fresh standalone: Offline URL Inspector — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/000-Offline_URL_Inspector.html` (SHA-256 `6d19bdae9be145251e14407e78eb6d4c9ef90253016be07129ce5052a86a0153`).

All eight local candidate artifacts are under `/private/tmp/oui-final-polish-s6gtafqv/one`; the second identical build is under `two`. Before candidate, native captures, limit trace and logs remain outside the repository under the same task root. Temporary files may eventually be removed by the operating system; preserve the candidate bytes if moving them for review.

From the full checkout, the focused current/historical wrapper can be rerun without overwriting prior reports:

```sh
python3 -B tests/ui-polish-regressions.py --candidate-root /private/tmp/oui-final-polish-s6gtafqv/one --deno /private/tmp/oui-stage7-e_9pss1f/runtime/deno --report /private/tmp/ui-polish-recheck.json
python3 -B tools/release_gate.py --candidate-root /private/tmp/oui-final-polish-s6gtafqv/one --deno /private/tmp/oui-stage7-e_9pss1f/runtime/deno --report /private/tmp/ui-polish-gate-recheck.json
python3 -B tools/verify_release.py --candidate-root /private/tmp/oui-final-polish-s6gtafqv/one
```

The approved strict runtime tuple remains Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3. Native repetition uses `tests/ui-polish-firefox.mjs` with a fresh dedicated profile on port 9318 and `--task-root` containing `one` and `before-candidate`; its preview server is limited to 127.0.0.1:9319. The helper stops its server and uninstalls its test zoom extension. Only the owned test browsers/profiles were stopped/removed; previews and evidence remain.

No staging, commit, push, merge, deployment, branch/worktree creation, stable-main modification or repository cleanup was performed. Stop here for user review.
