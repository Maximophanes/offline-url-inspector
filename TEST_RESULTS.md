# Version 3.1.2 test results

Run date: 2026-10-16. **109,580 checks passed; 122,882 assertions passed; zero failures.** The complete available regression/Unicode suite ran once after application changes and rendered review settled. All commands passed on that final run. Counts are dominated by official Unicode fixtures, not independent browser scenarios. Aggregate: `tests/summary-results.json`.

| Suite | Passed checks | Passed assertions | Failures |
|---|---:|---:|---:|
| unit and official Unicode fixtures | 108,664 | 112,223 | 0 |
| isolated Happy DOM integration | 157 | 1,045 | 0 |
| Reference domains, storage, imports, prioritization | 70 | 135 | 0 |
| V3 information hierarchy and reference management DOM | 33 | 114 | 0 |
| V3.1 presentation, shortcuts, disclosures and accessibility structure | 199 | 4,103 | 0 |
| V3.1.1 custom confirmations, storage wording, import choices and polish | 45 | 160 | 0 |
| V3.1.2 technical clarity, contextual evidence and edition compatibility | 45 | 359 | 0 |
| V3.1.2 complete editorial acceptance and evidence preservation | 52 | 4,197 | 0 |
| Service worker atomic lifecycle simulation | 25 | 84 | 0 |
| Hosted cache readiness, update feedback and reviewed reload simulation | 56 | 159 | 0 |
| Approved V2.1 core and Unicode preservation | 143 | 148 | 0 |
| review of the 19 original IDNA discrepancies | 64 | 102 | 0 |
| independent ICU UTS 46 review | 19 | 19 | 0 |
| Local /offline-url-inspector/ HTTP deployment | 8 | 34 | 0 |
| **Total** | **109,580** | **122,882** | **0** |

## Coverage and preserved behavior

- **Editorial:** 52 acceptance checks / 4,197 assertions cover negative/unavailable/uncertain/invalid outcomes, hostname-only match scope, exact dynamic values, zero/one/many grammar, actual methods, raw data, ordinary Unicode versus supported caution, field errors, imports, protected/conflicting data, failed writes, migration outcomes and announcements. All **33** emitted core diagnostic codes are exercised with original code/level/text/order preserved. All **139** pre-audit development inspection objects match their saved SHA-256 exactly, including raw messages; fixture hashes are pinned too.
- **Inventory:** 1,950 literal/text candidates across ten copy-supplying sources, with line numbers and hashes. The runner checks inventory freshness. This includes non-copy tokens; the human family decisions and exceptions are in [COPY_AUDIT.md](COPY_AUDIT.md), governed by [EDITORIAL_STYLE_GUIDE.md](EDITORIAL_STYLE_GUIDE.md).
- **Core/data:** parser, Unicode/ASCII/Punycode analysis, reference engine/schema, Unicode JSON, base theme, lockfile and workflow remain byte-identical to the baseline. Differential and official normalization/confusables tests pass. The 19 known native Deno IDNA discrepancies are unchanged; independent ICU matches all 19 official outputs. This is not a claim of complete native UTS #46 conformance.
- **Worker exception:** only the plaintext navigation-recovery 503 string changed. The pin check restores exactly that literal and then requires the old full-file hash, proving every other worker byte is unchanged. Atomic install, complete-cache hashing, activation/recovery, fixed fetch/scope and old-cache preservation still pass.
- **Hosted:** 56 checks / 159 assertions cover bounded cached startup, strict status replies, unavailable contexts, discovery/registration/message/update deadlines, interrupted preparations, waiting identity, consent and activation. Eleven editorial/loss/announcement scenarios include no premature readiness, no Preparing flash on cached lookup, no false server/save claims, session-only reference protection and clearing stale preparation after installation finishes.
- **References:** schema-1 records load without startup writes; key/application ID/fields/filename stay stable. Existing validation, conflicts, limits, private import plans, Merge/Replace consent and single-label/modal/keyboard guards pass. Failed writes preserve previous stored bytes and get caution rather than saved-success feedback. Export cannot preserve unreadable/different protected records; help and consent explain this.
- **Rendering/network/CSP:** guarded DOM suites record zero inspected-destination requests/navigation. Markup stays inert. Original case, bidi/control escapes, multi-character mappings and full paged evidence remain. Actual loopback HTTP verifies MIME/path boundaries and exact HTML/worker/script/style hashes for both editions. No runtime dependency or CSP relaxation was introduced.

Text-sensitive existing tests were updated to the revised language while retaining checks for actual classifications, values, original evidence, consent, saved bytes, no-network guards and functional pins. Targeted suites ran during development; the large Unicode suite was not repeatedly run after minor copy/CSS work.

## Actual rendered product review

`tests/editorial-browser-preview.json` records the current Codex in-app review and screenshot paths. It used only synthetic inputs and a separate loopback test origin. The review followed Input → Findings → Technical Details → References → Help, including character/mapping panels, structured complete ASCII groups, inline errors, successful saves/duplicates, Merge/Replace file previews/cancellation and neighboring Understanding/privacy explanations.

At 1100 pixels, the pill was about 106 pixels wide and update controls stayed in the same document positions when offline details expanded from 40 to about 178 pixels. Browser scrolling to the clicked disclosure was accounted for separately. Expanded character evidence had no horizontal page overflow at 390 and 320 pixels. The latter is a CSS reflow check, not native 200% zoom.

A reviewed local update required consent with current work and retained the synthetic saved reference. The rendered review found stale “Preparing the new version…” feedback after first installation; it was corrected before the final run and now has a regression check. With the local server stopped, a new cached tab and reload reached verified Offline ready, analysis worked, saved references remained, and failed-check feedback kept the current page available. Reserved feedback space kept the inspection-card height stable.

Earlier `tests/v312-browser-preview.json` and Version 3.1.1 preview reports remain historical evidence. Neither those nor the current in-app observations establish Firefox, a live Pages deployment, full internet disconnection, native screen readers, 200% zoom, reduced-motion settings, file:// policy or Container isolation. Rare quota/cache/race states are controlled simulations unless explicitly listed as actual observations.

## User evidence and pending Firefox verification

The user reports that the earlier 3.1.2 changes fixed the persistent offline-startup problem. That report is preserved separately from the user-verified 3.1.1 baseline and from the agent's final editorial testing. The brief Preparing transition is addressed without announcing readiness before verification; frame-by-frame Firefox repainting is not claimed solved.

**Agent-executed real Version 3.1.2 Firefox assertions: 0.** Current local read-only checks found Firefox 158.0 installed and no geckodriver on PATH. Historical repository records show an earlier native startup failure; that history was not counted as a current attempt or pass. Complete [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md) before publication. Native zoom/screen-reader/reduced-motion behavior, standalone policy and fully disconnected same/uncached Container behavior remain pending.

## Reproduce

```sh
deno cache --lock=deno.lock tests/dom.mjs tests/dom-v3.mjs tests/refinement.mjs tests/polish.mjs tests/clarity.mjs tests/editorial.mjs
python3 tools/verify_data.py
python3 tools/audit_copy.py --check
python3 tools/test_all.py
```

The runner owns loopback port 8765 and stops it afterward. Happy DOM 20.8.4 evaluates trusted generated app code for development tests; it is not a browser sandbox or runtime dependency. ICU is optional when its library is available. Firefox harnesses remain opt-in on a working driver setup; startup failures fail the command. Both editions were rebuilt deterministically; final integrity/branch/CSP checks are in `tests/release-checks.json`. No commit, push, merge, pull request, publication or settings change was performed.
