# Version 3.1.2 focused Technical Details review

Started from clean committed checkpoint `87122d79cbf1703d94cd550dbe6be1488896ce47` on `dev/v3.1.2`. Version remains 3.1.2. Changes are uncommitted; HEAD, main and staging remain unchanged. No push, merge or publication occurred.

## Three presentation corrections

| Application file | Correction |
|---|---|
| `src/v3.css` | Scoped character-count margins give equal **12 px** label-to-count and count-to-first-card gaps. The same rule covers original/readable groups, multiple characters and pagination. Extraction notice/reason/JSON wrap naturally. No global paragraph spacing or fixed heights were introduced. |
| `src/ui.js` | Character counts have a dedicated class. Removed the nested Technical comparison data disclosure; source, target, result, classification, character/substitution evidence, method explanation and unavailable warnings remain. Complete original comparison objects are retained internally in a WeakMap associated with each rendered comparison; inspection results retain the original extraction object. Nothing is added to Raw Diagnostic Records. |
| `src/template.html` | Reliable extraction hides the redundant JSON. Uncertain/failed extraction gets a visible ordinary-language limitation and collapsed **Hostname extraction details**, with a readable reason and the complete original extraction object. Missing extraction objects are identified honestly. New inspections reset the disclosure and clear stale evidence. |

The complete pending-file inventory is in `tests/release-checks.json`. Supporting changes are `tests/technical.mjs`, `tests/technical-baseline.json`, `tests/technical-results.json`, `tests/technical-targeted-results.json`, `tests/technical-browser-preview.json`, and test-only metadata accessors in `tests/dom-support.mjs`. `deno.json` and `tools/test_all.py` register the focused task for future runs. Both HTML editions, generated worker release hashes, build manifest, copy inventory, checksums and necessary review documentation were refreshed. Screenshots are listed in the browser report.

## Preservation and automated checks

**718 targeted checks / 16,600 assertions passed; zero failures.** The new Technical Details suite contributes **14 checks / 179 assertions**. The relevant reference, DOM, refinement, polish, clarity, editorial, interface, hosted and loopback HTTP checks also passed. The HTTP check needed local-network permission after sandbox fetch failures; its final rerun passed all eight checks.

All **139 complete baseline inspection objects and saved-reference comparison results** match their pre-edit SHA-256, including underlying metadata. Tests verify the same mechanism, label types, distance, availability, source/target and original comparison object where applicable. Reliable and uncertain extraction objects remain unchanged; uncertain evidence JSON is reversible. Exact original diagnostic messages and ordering remain in Raw Diagnostic Records, with no comparison/extraction JSON appended there.

Core parsing, attribution, Unicode/IDNA/Punycode/ASCII analysis, comparison/store engine, presentation classifications, hosted controller, worker source, base theme/title, Unicode data/license, lockfile and workflow are byte-identical to the checkpoint. Browser storage keys/schema/import/export and update safeguards are unchanged. No runtime dependencies, inspected-destination requests or CSP relaxation were introduced.

The full Unicode conformance suite was **not rerun**. Earlier conformance/full-suite reports remain unchanged historical evidence. Current aggregate: `tests/technical-targeted-results.json`. Both rebuilt editions are deterministic, with exact inline CSP hashes and matched HTML/worker/manifest hashes.

## Rendered desktop/mobile review

The agent rendered and visually inspected **28 screenshots** of the actual matched hosted build in the Codex in-app browser, at **1100×1000** and **390×844**. Every measured count gap was **12 px above and below**, including wrapped mobile pagination counts. No horizontal page overflow appeared in the inspected states.

| State | Desktop evidence | Mobile evidence |
|---|---|---|
| One Unicode character | [One character](preview/v3.1.2-technical-desktop-one-character.jpg) | [One character](preview/v3.1.2-technical-mobile-one-character.jpg) |
| Multiple Unicode characters | [Multiple](preview/v3.1.2-technical-desktop-multiple-characters.jpg) | [Multiple](preview/v3.1.2-technical-mobile-multiple-characters.jpg) |
| Pagination | [50 of 120](preview/v3.1.2-technical-desktop-pagination-first.jpg), [complete](preview/v3.1.2-technical-desktop-pagination-complete.jpg) | [Wrapped count](preview/v3.1.2-technical-mobile-pagination.jpg), [complete](preview/v3.1.2-technical-mobile-pagination-complete.jpg) |
| Unicode mappings/method | [Character evidence](preview/v3.1.2-technical-desktop-unicode-evidence.jpg), [method](preview/v3.1.2-technical-desktop-unicode-comparison.jpg) | [Method/evidence](preview/v3.1.2-technical-mobile-unicode-comparison.jpg) |
| ASCII visual method | [ASCII](preview/v3.1.2-technical-desktop-ascii-comparison.jpg) | [ASCII](preview/v3.1.2-technical-mobile-ascii-comparison.jpg) |
| Spelling comparison | [Spelling](preview/v3.1.2-technical-desktop-spelling-comparison.jpg) | [Spelling](preview/v3.1.2-technical-mobile-spelling-comparison.jpg) |
| Exact comparison | [Exact](preview/v3.1.2-technical-desktop-exact-comparison.jpg) | [Exact](preview/v3.1.2-technical-mobile-exact-comparison.jpg) |
| Visual comparison unavailable | [Manual warning](preview/v3.1.2-technical-desktop-unavailable-comparison.jpg) | [Manual and saved-reference warnings](preview/v3.1.2-technical-mobile-unavailable-comparison.jpg) |
| Reliable percent-encoded extraction | [Representations; no raw panel](preview/v3.1.2-technical-desktop-reliable-extraction.jpg) | [Representations; no raw panel](preview/v3.1.2-technical-mobile-reliable-extraction.jpg) |
| Uncertain extraction | [Extra slashes](preview/v3.1.2-technical-desktop-uncertain-extraction.jpg) | [Limitation/reason/evidence](preview/v3.1.2-technical-mobile-uncertain-extraction.jpg) |
| Malformed URL/percent encoding | [Percent error](preview/v3.1.2-technical-desktop-malformed-percent.jpg), [brackets](preview/v3.1.2-technical-desktop-failed-brackets.jpg) | [Percent error](preview/v3.1.2-technical-mobile-malformed-percent.jpg) |
| Unverified extracted candidate | [Rejected port](preview/v3.1.2-technical-desktop-unverified-candidate.jpg) | [Complete wrapping evidence](preview/v3.1.2-technical-mobile-unverified-candidate.jpg) |

Native disclosure summaries opened/closed with Enter and visible focus rings. Keyboard pagination reached all 120 records and moved focus to the first newly added record when the last page completed, on both viewports. Ordinary and uncertain states were inspected consecutively to check reset behavior. Oversized synthetic pagination input retains its existing hostname-validation warnings; it is not presented as a valid destination.

Only synthetic inputs were used. One synthetic `example.invalid` reference was saved for the unavailable-comparison warning check, then cleared through the existing confirmation flow. No browser-rendered failure simulations or production logic changes were needed. Unexpected-renderer-failure coverage is a DOM simulation only. Browser evidence and measurements: `tests/technical-browser-preview.json`.

Remaining limits: this is in-app browser verification, not native Firefox or screen-reader verification. Both editions have source/DOM/CSP/build checks; no new native file:// persistence, OS accessibility, native zoom or frame-timing review is claimed.
