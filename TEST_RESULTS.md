# Version 3.2.0 targeted highlight/@ candidate results

Newly executed targeted suite: **146 checks / 533 assertions passed**, zero failures, including 21 new hostname-highlight/@ tests. Newly executed final full suite: **109,782 checks / 129,884 assertions passed**, zero failures. The targeted run preceded the full build/copy/regression/conformance/ICU/HTTP run. All original fixture and complete inspection/diagnostic pins remain intact; no baseline expectations were replaced.

Current records: `tests/embedded-results.json`, `tests/summary-results.json`, and `tests/hostname-highlight-browser-preview.json`. The latter records 22 actual hosted in-app checks at measured 1280/390 px, both supplied examples, long-host fragments within the viewport, inert markup, keyboard/private reveal/close/reset, and final script/style hashes for **3.2.0-cf634806f70b4b3c**. No native Firefox, VoiceOver or physical mobile pass is claimed for this newest build.

The user reports successful manual Firefox review of the preceding candidate's representative tests, seven additional scenarios and the encoded @ case. That report is not extended to the newest styling. Earlier browser records and benchmarks remain historical; see [the targeted handoff](HOSTNAME_HIGHLIGHT_REVIEW.md) and [preceding editorial report](EMBEDDED_EDITORIAL_REVIEW.md).

## Historical v3.1.2 results

# Version 3.1.2 test results

## Current approved obsolete-code cleanup

Continued from the existing uncommitted Phase 1 work on `dev/v3.1.2` (HEAD `769c6437`). Removed the empty `relevantSubstitutions` / `neutralSlot` placeholders and their dead rendering/clearing operations, exclusive `.relevant` / unused `.gap` styles, the removed nested comparison-observation selector, proven overridden update-control properties, ineffective mobile diagnostic grid placement and the superseded three-column diagnostic declaration. Removed only the unused confirmation `isOpen` accessor and Python `base64` import. The visible mobile diagnostic indentation remains 17 px; the necessary higher-specificity cache-actions override remains.

The full established regression suite ran **once after stabilization: 109,636 checks / 129,347 assertions passed, zero failures**. It includes official Unicode conformance, independent ICU, differential analysis, DOM, storage/imports, worker recovery, hosted startup/update states and actual loopback HTTP/CSP checks. Focused checks passed during development; four separate temporary-root runner tests verify not-requested, successful, unavailable-driver-endpoint and failed-assertion reporting without running Firefox or the conformance suite. `tests/summary-results.json` is the fresh full-run record; previous historical reports remain distinguished from current execution.

Complete inspection, reference-comparison and original diagnostic hashes match the existing 139-fixture baselines. Both editions rebuild deterministically with exact CSP hashes. Historical base-CSS pins are restored through an explicit, narrow test-only normalization of the approved dead-rule deletions; no baseline hash was repinned. Analysis, presentation classifications, reference storage/API/legacy handling, hosted controller, worker source, Unicode data, title animation and editorial guide remain unchanged. `Presentation.storageStatus` keeps its `edition` parameter.

Sixteen current before/after screenshots were inspected at 1100×1000 and 390×844. Desktop/mobile waiting and failed-update geometry, feedback text/typography and diagnostic metadata geometry match exactly. Character/mapping evidence, ASCII reference explanations and focus styling remain readable; Escape cancels the update confirmation and restores focus without losing the input/result. Exact hosted and standalone editions rendered successfully; standalone was served over loopback HTTP. Update-state fixtures simulate worker outcomes explicitly. Native Firefox, screen readers, native zoom and native file:// policy remain unverified. See `tests/technical-browser-preview.json` → `approvedObsoleteCleanup`.

Firefox runner output now distinguishes opt-in not requested from requested success or failed/unavailable execution. The current full run records **Not requested; driver availability was not checked**. Historical Firefox observations were not rewritten as fresh tests.

## Previous Phase 1 — raw-character disclosure removal

From clean checkpoint `769c6437cd6b360d8b920bfb440879de016a802c`, **720 targeted checks / 16,717 assertions passed, zero failures**. The Technical Details suite now has 16 checks / 282 assertions, including complete internal character data, structured rows, IDNA/normalization outcomes, confusable sequences, mapped names and related comparison characters. Existing original-result/source pins and diagnostic ordering checks pass. The full Unicode suite was not rerun.

The raw-character renderer and its exclusive CSS rule were removed. Shared `rawText` remains for uncertain extraction evidence. The agent inspected three current desktop/mobile screenshots; see `rawCharacterCleanup` in `tests/technical-browser-preview.json`. No page overflow was observed. This is in-app browser verification; native Firefox and screen readers were not tested in this pass. Both editions were rebuilt and integrity metadata refreshed before the strictly read-only Phase 2 audit. Current focused aggregate: `tests/technical-targeted-results.json`.


## Previous focused Technical Details checkpoint

From committed checkpoint `87122d79cbf1703d94cd550dbe6be1488896ce47`, **718 targeted checks / 16,600 assertions passed, zero failures**. The new suite contributes 14 checks / 179 assertions. Current aggregate: `tests/technical-targeted-results.json`. The full Unicode conformance suite was **not rerun**; engine/data sources and earlier conformance/full-suite reports are unchanged.

All 139 baseline inspection objects and saved-reference comparison results match their pre-edit hash. Original diagnostics/order, extraction objects, comparison metadata, contextual methods and unavailable warnings are preserved. The agent visually inspected 28 actual hosted in-app screenshots at desktop/mobile sizes; count gaps measured 12 px on each side, including pagination. See [Technical Details review](TECHNICAL_DETAILS_REVIEW.md) and `tests/technical-browser-preview.json`. Native Firefox and screen readers were not tested in this pass.


## Previous Reference Domains checkpoint

From committed checkpoint `9b017bd6a145fe664e26cf421f24db134c3fa24e`, **704 focused/regression/HTTP checks and 16,421 assertions passed, zero failures**. The new reference-interface suite contributes 19 checks / 124 assertions. Current results: `tests/reference-targeted-results.json`. The complete Unicode conformance suite was **not** rerun. Source pins preserve the validation/store engine, core, worker, data and all 139 original analysis results; presentation changes are limited to the reference validation/storage copy blocks and details helper.

The agent rendered and inspected 33 desktop/mobile screenshots covering the requested reference states. Actual hosted operations use a fresh loopback origin and synthetic hosts; export and rare storage failures use explicit in-memory fixtures. See [Reference Domains review](REFERENCE_DOMAINS_REVIEW.md) and `tests/reference-browser-preview.json`. Native Firefox, screen readers, file:// persistence and actual disk download delivery were not verified by this pass.

## Previous committed interface checkpoint — full-suite record


Run date: 2026-10-16. **109,600 checks passed; 128,867 assertions passed; zero failures.** The complete available regression/Unicode suite ran once after application changes and rendered review settled. All commands passed on that final run. Counts are dominated by official Unicode fixtures, not independent browser scenarios. Aggregate: `tests/summary-results.json`.

| Suite | Passed checks | Passed assertions | Failures |
|---|---:|---:|---:|
| unit and official Unicode fixtures | 108,664 | 112,223 | 0 |
| isolated Happy DOM integration | 157 | 1,045 | 0 |
| Reference domains, storage, imports, prioritization | 70 | 135 | 0 |
| V3 information hierarchy and reference management DOM | 33 | 114 | 0 |
| V3.1 presentation, shortcuts, disclosures and accessibility structure | 199 | 4,103 | 0 |
| V3.1.1 custom confirmations, storage wording, import choices and polish | 45 | 160 | 0 |
| V3.1.2 technical clarity, contextual evidence and edition compatibility | 45 | 355 | 0 |
| V3.1.2 complete editorial acceptance and evidence preservation | 52 | 5,799 | 0 |
| V3.1.2 final interface hierarchy and evidence preservation | 12 | 4,354 | 0 |
| Service worker atomic lifecycle simulation | 25 | 84 | 0 |
| Hosted cache readiness, update feedback and reviewed reload simulation | 64 | 192 | 0 |
| Approved V2.1 core and Unicode preservation | 143 | 148 | 0 |
| review of the 19 original IDNA discrepancies | 64 | 102 | 0 |
| independent ICU UTS 46 review | 19 | 19 | 0 |
| Local /offline-url-inspector/ HTTP deployment | 8 | 34 | 0 |
| **Total** | **109,600** | **128,867** | **0** |

## Coverage and preserved behavior

- **Editorial:** 52 acceptance checks / 5,799 assertions cover negative/unavailable/uncertain/invalid outcomes, hostname-only match scope, exact dynamic values, zero/one/many grammar, actual methods, raw data, ordinary Unicode versus supported caution, field errors, imports, protected/conflicting data, failed writes, migration outcomes and announcements. All **33** emitted core diagnostic codes are exercised with original code/level/text/order preserved. All **139** pre-audit development inspection objects match their saved SHA-256 exactly, including raw messages; fixture hashes are pinned too.
- **Inventory:** 2,012 literal/text candidates across ten copy-supplying sources, with line numbers and hashes. The runner checks inventory freshness. This includes non-copy tokens; the human family decisions and exceptions are in [COPY_AUDIT.md](COPY_AUDIT.md), governed by [EDITORIAL_STYLE_GUIDE.md](EDITORIAL_STYLE_GUIDE.md).
- **Core/data:** parser, Unicode/ASCII/Punycode analysis, reference engine/schema, Unicode JSON, base theme, lockfile and workflow remain byte-identical to the baseline. Differential and official normalization/confusables tests pass. The 19 known native Deno IDNA discrepancies are unchanged; independent ICU matches all 19 official outputs. This is not a claim of complete native UTS #46 conformance.
- **Worker exception:** only the plaintext navigation-recovery 503 string changed. The pin check restores exactly that literal and then requires the old full-file hash, proving every other worker byte is unchanged. Atomic install, complete-cache hashing, activation/recovery, fixed fetch/scope and old-cache preservation still pass.
- **Hosted:** 64 checks / 192 assertions cover bounded cached startup, strict status replies, unavailable contexts, discovery/registration/message/update deadlines, interrupted preparations, waiting identity, consent and activation. Eleven editorial/loss/announcement scenarios include no premature readiness, no Preparing flash on cached lookup, no false server/save claims, session-only reference protection and clearing stale preparation after installation finishes.
- **References:** schema-1 records load without startup writes; key/application ID/fields/filename stay stable. Existing validation, conflicts, limits, private import plans, Merge/Replace consent and single-label/modal/keyboard guards pass. Failed writes preserve previous stored bytes and get caution rather than saved-success feedback. Export cannot preserve unreadable/different protected records; help and consent explain this.
- **Rendering/network/CSP:** guarded DOM suites record zero inspected-destination requests/navigation. Markup stays inert. Original case, bidi/control escapes, multi-character mappings and full paged evidence remain. Actual loopback HTTP verifies MIME/path boundaries and exact HTML/worker/script/style hashes for both editions. No runtime dependency or CSP relaxation was introduced.

Text-sensitive existing tests were updated to the revised language while retaining checks for actual classifications, values, original evidence, consent, saved bytes, no-network guards and functional pins. Targeted suites ran during development; the large Unicode suite was not repeatedly run after minor copy/CSS work.

## Final focused rendered review

[FINAL_INTERFACE_REVIEW.md](FINAL_INTERFACE_REVIEW.md) and `tests/interface-browser-preview.json` record inspected desktop (1100 px), tablet (768 px), mobile (390 px), 550 px reflow and explicitly simulated CSS 200% magnification. All requested A–L interface areas were examined. No feedback, current, waiting update, long check failure and activation-timeout views retain left alignment, contextual colors and stable controls. The raw region was keyboard-focused and scrolled. Native Firefox and native 200% zoom remain pending because native Computer Use permission was unavailable.

The new final-interface suite adds 12 checks / 4,354 assertions: all 139 complete results plus original messages/codes/levels/categories/severities/order match the committed checkpoint; all originals remain rendered in the single collapsed raw section, with contextual character/mapping/ASCII/input/reference evidence retained. The hosted suite adds eight structured-feedback/paragraph cases. Test changes move raw-record assertions to the consolidated region without removing the preservation guarantees.

## Earlier committed editorial review (historical)

`tests/editorial-browser-preview.json` records the earlier committed Codex in-app review and screenshot paths. It used only synthetic inputs and a separate loopback test origin. The review followed Input → Findings → Technical Details → References → Help, including character/mapping panels, structured complete ASCII groups, inline errors, successful saves/duplicates, Merge/Replace file previews/cancellation and neighboring Understanding/privacy explanations.

At 1100 pixels, the pill was about 106 pixels wide and update controls stayed in the same document positions when offline details expanded from 40 to about 178 pixels. Browser scrolling to the clicked disclosure was accounted for separately. Expanded character evidence had no horizontal page overflow at 390 and 320 pixels. The latter is a CSS reflow check, not native 200% zoom.

A reviewed local update required consent with current work and retained the synthetic saved reference. The rendered review found stale “Preparing the new version…” feedback after first installation; it was corrected before the final run and now has a regression check. With the local server stopped, a new cached tab and reload reached verified Offline ready, analysis worked, saved references remained, and failed-check feedback kept the current page available. Reserved feedback space kept the inspection-card height stable.

Earlier `tests/v312-browser-preview.json` and Version 3.1.1 preview reports remain historical evidence. Neither those nor the in-app observations establish Firefox, a live Pages deployment, full internet disconnection, native screen readers, 200% zoom, reduced-motion settings, file:// policy or Container isolation. Rare quota/cache/race states are controlled simulations unless explicitly listed as actual observations.

## User evidence and pending Firefox verification

The user reports that the earlier 3.1.2 changes fixed the persistent offline-startup problem. That report is preserved separately from the user-verified 3.1.1 baseline and from the agent's final editorial testing. The brief Preparing transition is addressed without announcing readiness before verification; frame-by-frame Firefox repainting is not claimed solved.

**Agent-executed real Version 3.1.2 Firefox assertions: 0.** Current local read-only checks found Firefox 158.0 installed and no geckodriver on PATH. Historical repository records show an earlier native startup failure; that history was not counted as a current attempt or pass. Complete [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md) before publication. Native zoom/screen-reader/reduced-motion behavior, standalone policy and fully disconnected same/uncached Container behavior remain pending.

## Reproduce

```sh
deno cache --lock=deno.lock tests/dom.mjs tests/dom-v3.mjs tests/refinement.mjs tests/polish.mjs tests/clarity.mjs tests/editorial.mjs tests/interface.mjs
python3 tools/verify_data.py
python3 tools/audit_copy.py --check
python3 tools/test_all.py
```

The runner owns loopback port 8765 and stops it afterward. Happy DOM 20.8.4 evaluates trusted generated app code for development tests; it is not a browser sandbox or runtime dependency. ICU is optional when its library is available. Firefox harnesses remain opt-in on a working driver setup; startup failures fail the command. Both editions were rebuilt deterministically; final integrity/branch/CSP checks are in `tests/release-checks.json`. No commit, push, merge, pull request, publication or settings change was performed.
