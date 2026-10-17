# Version 3.1.2 focused Reference Domains review

This pass started from clean committed checkpoint `9b017bd6a145fe664e26cf421f24db134c3fa24e` on `dev/v3.1.2`. Version remains 3.1.2. Work is uncommitted; HEAD, main and the staging area are unchanged. No push, merge or publication occurred.

## Corrections and files

| File | Focused change |
|---|---|
| `src/template.html` | Approved introduction grouped with storage status; removed only the nested Technical storage status disclosure, retaining Storage & hostname help. |
| `src/v3.css` | Cohesive typography, subtle status dot, full-width warnings, tighter list margins/padding, and naturally expanding feedback. Empty feedback has zero height and zero margin. Existing entry/backup button arrangements remain. |
| `src/presentation.js` | Distinguishes empty, overlength and non-string reference entries using the rejected value; numbered imported entries work for schema 0 and 1. Compact verified-write text; exact known duplicate error explanations suppress redundant details. Additional/unknown technical context remains available. |
| `src/ui.js` | Passes rejected entry/import context to presentation, removes the obsolete storage-detail DOM write, retains raw errors internally and useful details visibly, and preserves specific export/file-read exceptions for recovery. |
| `tests/reference-interface.mjs` / baseline | 19 focused checks / 124 assertions. Baseline preserves the original presentation copy blocks and hash; all other presentation bytes/classifications remain pinned. |
| Existing tests / harness | Text/location assertions updated in clarity, DOM, editorial, polish and interface checks; no engine/store pin replaced. Harness restores only the approved reference-copy blocks to prove the original complete presentation hash. |
| `deno.json`, `tools/test_all.py` | Add the focused suite to the existing task catalog and future full-suite runner. The full runner was not executed in this pass. |
| `tools/preview_references.py` | Loopback-only, explicit synthetic visual fixtures using the exact generated standalone program and in-memory storage. No production source changes to simulate failures. |
| Generated editions / integrity | Rebuilt hosted and standalone HTML, matched worker release metadata, build manifest, copy inventory, release checks and SHA256SUMS. Documentation and current focused reports updated. |

The full pending-file list is in `tests/release-checks.json`; screenshot paths and measurements are in `tests/reference-browser-preview.json`.

## Accuracy and preservation

The description is exactly: “Save hostnames to compare with URLs you inspect. A match doesn't verify that a website is safe.” It and the storage message share one introductory group with no narrow desktop text cap.

Initial readable storage still says saving has not been checked. Loaded references are identified as previously saved; a verified change says “Saved in this browser.” Session-only changes, failed writes, protected data and conflicting saved bytes retain distinct warnings and recovery guidance. Local-file persistence and shared-origin limitations remain in Browser Storage help. The removed technical storage disclosure's original diagnostic status remains in the unchanged store snapshot internally.

The validator itself is unchanged: the same raw error, acceptance rules, 2,048-input-character limit and import validation still apply. Only presentation receives the original rejected value to distinguish empty/overlength entries. The reference input's maxlength remains 2048; a controlled programmatic value exercises the overlength field error, and overlength imported entries are independently tested. Invalid imports never partially apply.

Simple duplicate/empty/length/format errors retain their original raw text internally without displaying another explanation. Only complete known fixed error strings are suppressed; an additional diagnostic suffix or unknown exception remains accessible. Specific export/file-read exceptions now remain behind Technical error details instead of being discarded by the handler.

`src/core.js`, `src/references.js`, `src/sw.js`, `src/hosted.js`, base theme/title CSS, Unicode data/license, lockfile and deployment workflow are byte-identical to the checkpoint. The original 139 complete inspection results and ordered diagnostic records still pass their existing snapshot comparisons. Reference storage key/schema/JSON/filename, no startup writes, conflict protection, preview-before-apply, replacement/clear consent, safe defaults, shortcuts and destination-request guards remain unchanged. No runtime dependency or CSP relaxation was added.

## Rendered verification

The agent rendered and visually inspected **33 screenshots** in the Codex in-app browser at **1100×1000** and **390×844**. Only example.com and synthetic .invalid hostnames were used. Empty feedback measured **0 px height / 0 px top margin**. Short messages measured approximately 19.2 px; multiline mobile messages grew naturally to approximately 38.4 px. No observed horizontal page overflow occurred.

| Requested state | Inspected examples |
|---|---|
| Empty / one / multiple | [Empty hosted](preview/v3.1.2-references-hosted-empty.jpg), [verified save](preview/v3.1.2-references-hosted-saved.jpg), [multiple](preview/v3.1.2-references-hosted-multiple.jpg) |
| Empty / overlength entry | [Empty correction](preview/v3.1.2-references-hosted-empty-error.jpg), [overlength](preview/v3.1.2-references-overlength.jpg) |
| Duplicate / malformed | [Duplicate](preview/v3.1.2-references-duplicate.jpg), [malformed](preview/v3.1.2-references-malformed.jpg) |
| Add / edit / remove | [Added](preview/v3.1.2-references-hosted-saved.jpg), [edited](preview/v3.1.2-references-hosted-edited.jpg), [removed](preview/v3.1.2-references-hosted-removed.jpg) |
| Export success / failure | [Prepared](preview/v3.1.2-references-exportSuccess.jpg), [failure](preview/v3.1.2-references-exportFailure.jpg), [useful details](preview/v3.1.2-references-exportFailure-details.jpg) |
| Import errors / preview | [Empty item](preview/v3.1.2-references-importEmpty.jpg), [overlength item](preview/v3.1.2-references-importLong.jpg), [invalid JSON](preview/v3.1.2-references-importMalformed.jpg), [preview](preview/v3.1.2-references-importPreview.jpg) |
| Clear confirmation / success | [Safe-default dialog](preview/v3.1.2-references-hosted-clear-confirm.jpg), [cleared](preview/v3.1.2-references-hosted-cleared.jpg) |
| Session-only / failed save | [Session](preview/v3.1.2-references-session.jpg), [failed save](preview/v3.1.2-references-failedStorage.jpg) |
| Protected / conflicting data | [Protected](preview/v3.1.2-references-protected.jpg), [conflict](preview/v3.1.2-references-conflict.jpg), [recovery help](preview/v3.1.2-references-protected-help.jpg) |
| Help expanded | [Hosted Browser Storage / comparisons](preview/v3.1.2-references-hosted-help.jpg), [mobile help](preview/v3.1.2-references-mobile-hosted-help.jpg) |
| Mobile wrapping / spacing | [Empty](preview/v3.1.2-references-mobile-empty.jpg), [entry error](preview/v3.1.2-references-mobile-malformed.jpg), [failed-save warning](preview/v3.1.2-references-mobile-failedStorage.jpg), [backup error](preview/v3.1.2-references-mobile-importLong.jpg), [preview](preview/v3.1.2-references-mobile-importPreview.jpg) |

Actual hosted add/edit/remove, Enter submission, empty input, clear consent/completion and help used the matched build on a new loopback origin (port 8781). The synthetic list was cleared afterward. Edit focused the input; the clear dialog initially focused Cancel, Tab reached Clear References, and completion restored focus to Clear all. Focus rings and preview keyboard navigation were inspected.

Hard-to-reproduce errors and storage states used the explicitly labeled fixture on port 8782. It serves the exact standalone program with test-only in-memory storage and synthetic actions. Export preparation is intercepted there to prevent a disk download; schema, Blob contents and filename are verified by DOM tests. These screenshots prove rendering, not real quota failure, actual disk delivery or file:// persistence. Native Firefox and screen readers were not tested in this focused pass.

## Targeted verification

**704 checks / 16,421 assertions passed; zero failures**, across references, DOM, refinement, polish, clarity, editorial, interface, reference-interface, baseline DOM, hosted and loopback HTTP suites. Current aggregate: `tests/reference-targeted-results.json`. The HTTP check needed local-network permission after sandbox fetch failures; its final rerun passed all eight checks.

The complete Unicode conformance suite was **not rerun**, because engine and data sources are unchanged. The previous full-suite record remains historical evidence for the committed interface checkpoint. Both editions were rebuilt deterministically; exact inline CSP hashes and matched HTML/worker/manifest hashes pass. Current source/integrity/branch checks are in `tests/release-checks.json`.

Remaining limits: native Firefox/screen-reader behavior, browser-specific local-file persistence and actual disk download delivery are not established by this pass. Existing manual browser verification guidance remains applicable.
