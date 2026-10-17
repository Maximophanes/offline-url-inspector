# Version 3.1.2 focused final interface review

Date: 2026-10-16. Branch: `dev/v3.1.2`. Started from the clean committed development checkpoint `1a6b9a3`. Application version remains 3.1.2. Changes are uncommitted; main, HEAD and the index are unchanged. No push, merge or publication occurred.

## Changes and preserved evidence

`src/v3.css` scopes smaller second-line descriptors to technical rows, leaving desktop main labels inline. Normal Grid flow places Check/Apply left and the content-sized lilac offline pill right, with feedback below. The shortcut-to-update separation is 24 px; the button-to-shortcut and update-button-to-feedback gaps are both 13 px. Mobile controls wrap naturally. Offline help has compact natural sizing when collapsed and full-width semantic paragraphs when expanded.

`src/template.html` provides one atomic status region with a decorative indicator, title and optional explanation, plus one bottom Raw Diagnostic Records disclosure. `src/hosted.js` supplies structured update wording and semantic offline paragraphs. Success is green, progress violet and recoverable/unavailable states amber; text always states the meaning. Existing registration, deadlines, readiness verification, reviewed-worker identity, consent and reload decisions are preserved.

`src/ui.js` keeps ordinary finding titles, severity and concise explanations. It appends the exact original message text, code, category, displayed severity and original level to ordered, separated raw articles. Raw records start collapsed, reset on reinspection, wrap long text and have a keyboard-focusable scroll region. Character Details, mapping sequences, input evidence, complete original URL, reference methods and grouped ASCII occurrences remain contextual. Adjacent Technical Details contains distinct categories; no additional duplicate category was removed.

`tests/interface-baseline.json` was captured before edits from 139 existing fixtures. All complete inspection objects and enriched original record arrays match its SHA-256. The interface suite checks each rendered original in order, plus long/paged ASCII evidence and source pins. Core, references, presentation classifications, base theme/title animation, worker source, Unicode data, lockfile and deployment workflow remain byte-identical to the checkpoint. Reference schema/key, storage behavior and destination-request boundaries remain unchanged. Both generated editions and matching CSP/release hashes were rebuilt.

## Rendered review

The following screenshots were **rendered and visually inspected**, not merely generated. Exact measurements and all screenshot paths are in `tests/interface-browser-preview.json`. Only built-in synthetic examples were used. Screenshots contain no personal inputs or browsing history.

| Required area | Inspected evidence |
|---|---|
| A. Main labels | [Desktop main labels](preview/v3.1.2-final-main-labels.jpg): both inline above full-width fields. |
| B. Input & Normalization | [Desktop labels](preview/v3.1.2-final-labels.jpg), [mobile labels](preview/v3.1.2-final-mobile-labels.jpg): technical descriptors deliberately stacked and muted. |
| C. Full Diagnostic Log | [Diagnostic log](preview/v3.1.2-final-diagnostics.jpg): ordinary findings retain titles/severity without repetitive raw disclosures. |
| D. Raw records | [Desktop raw records](preview/v3.1.2-final-raw-records.jpg), [mobile raw records](preview/v3.1.2-final-mobile-raw.jpg): separated complete records; Tab and Page Down focused/scrolled the region with visible focus. |
| E. All ASCII Observations | [Desktop ASCII](preview/v3.1.2-final-ascii.jpg), [mobile ASCII](preview/v3.1.2-final-mobile-ascii.jpg): grouped observations and locations remain attached to the finding. |
| F. No feedback | [Empty status](preview/v3.1.2-final-empty.jpg), [mobile](preview/v3.1.2-final-mobile-empty.jpg). |
| G. Current | [Successful check](preview/v3.1.2-final-current.jpg), [mobile](preview/v3.1.2-final-mobile-current.jpg): green indicator, left aligned. |
| H. Long failure | [Check failure](preview/v3.1.2-final-failed.jpg), [mobile](preview/v3.1.2-final-mobile-failed.jpg), [activation timeout](preview/v3.1.2-final-pending.jpg): amber dot, supporting text aligned under title. |
| I. Apply Update | [Waiting update](preview/v3.1.2-final-waiting.jpg), [tablet](preview/v3.1.2-final-tablet.jpg): adjacent buttons and compact right-hand desktop pill. |
| J. Collapsed offline help | [Controls](preview/v3.1.2-final-controls.jpg), [waiting](preview/v3.1.2-final-waiting.jpg): compact single-line label. |
| K. Expanded offline help | [Tablet](preview/v3.1.2-final-tablet.jpg), [mobile](preview/v3.1.2-final-mobile-waiting.jpg): exact approved two paragraphs, full available width. |
| L. Narrow layouts | Mobile screenshots above at 390×844, tablet at 768×1024 and [550 px reflow](preview/v3.1.2-final-reflow.jpg). No observed horizontal page overflow. |

Desktop controls retained identical document coordinates across empty/current/waiting/failure states: Check x=80, pill x≈914.3, feedback x=80 at 1100 px. The pill was ≈105.7 px wide. On mobile, the pill takes its own right-aligned row and long explanations increase only their own vertical space. Expanded desktop paragraph width was 906 px inside a 938 px panel. Browser auto-scrolling is distinct from document layout movement.

Production preview used the matched site build and a real local service worker on loopback port 8777. Hard-to-reproduce update states used `tools/preview_interface.py` on 8778: the exact generated shared code and exact hosted controller run with in-memory worker replies. This fixture never registers a real worker and never changes production logic or generated assets. Its visible banner identifies simulation. These views prove rendering, not actual installation or full network disconnection.

[CSS 200% magnification](preview/v3.1.2-final-css-200.jpg) was rendered and inspected at a 1100 px viewport; measured CSS zoom was 2 and the page did not overflow. This and 550 px reflow are **supplemental, not native browser 200% zoom**. The in-app control exposes no native zoom capability; attempted keyboard zoom did not change measured viewport/DPR. Native Firefox control was unavailable because Computer Use permission was not granted. Native Firefox/200% zoom/screen-reader verification therefore remains pending; see the focused steps in [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md). No frame-timing or universal flicker claim is made.

## Automated verification

Targeted interface, hosted, DOM, editorial, clarity, refinement, polish and worker checks passed during development. After application changes settled, the full available regression/Unicode/HTTP/ICU suite ran **once**: **109,600 checks and 128,867 assertions passed; zero failures**. New focused coverage contributes 12 interface checks / 4,354 assertions and eight structured hosted-state/paragraph checks. Counts include official Unicode fixtures and are not counts of browser scenarios.

The final rebuild is deterministic, both CSP policies match exact inline hashes without relaxation, and generated worker release/index hashes match the manifest. `tests/release-checks.json` records source/integrity/branch checks; SHA256SUMS covers distribution files. Reports contain no local working-directory field. No application changes followed the final full run; subsequent changes were documentation and verification metadata.

Native Firefox and native 200% zoom are the remaining required manual checks. The inspected in-app layouts and automated checks pass within their stated scope.
