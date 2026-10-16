# Version 3.1.1

Focused final polish on the approved, user-verified V3.1.0 release. V3.1.0 and both tracker references remain unchanged. Deployment is prepared locally only; nothing was published.

- Removed the bounded header pseudo-element whose radial glow was clipped at its rectangle, moving that illumination into the page background. The approved title rule and complete neon keyframes are byte-identical.
- Kept coherent normal/hover button gradients, limited transitions to supported border/shadow/color effects, and removed primary-button hover/pressed translation so its hit area stays stable. Pressed shadows, focus and reduced-motion behavior remain.
- Simplified Reference Domains, empty and storage messages while distinguishing readable storage from verified writes, unavailable storage and saving failures. Advanced details stay available contextually.
- Added custom Clear, Replace, single-label and reload confirmations with safe-default cancellation, Escape, native modal semantics, explicit focus wrapping/restoration, inert background controls, and duplicate-action guards. Native confirmation APIs are absent from application workflows.
- Replaced the two-choice import dropdown with styled native radios, defaulting to Merge. Review, parser/limits/deduplication, schema and replacement consent are preserved. Single-label entries are supported and described in the import review as a batch.
- Added contextual guidance before adding/editing a new single-label hostname, without guessed suffixes or a changed comparison algorithm. Existing unchanged single labels are not interrupted; IP forms are excluded from the warning.
- Separated compact verified offline status from update-check progress/results. Added immediate busy feedback, coalesced rapid requests, truthful offline/failure/no-update states, failed-installation feedback, and a fix for stale waiting-update status during activation. Worker scope, messages, complete-release hashing and cache architecture remain unchanged.
- Promoted existing ASCII substitution evidence into primary manual/reference explanations; retained Unicode explanations, classifications and technical evidence while removing prominent duplication.
- Renamed everyday backup controls to Export Backup / Import Backup, preserving JSON schema and filename. Added targeted modal/import/storage/hover/update tests and actual in-app browser interaction evidence.

Unicode data/core parsing/security algorithms, Reference Domains implementation/schema, and service-worker source are byte-identical to V3.1.0. Existing storage uses the same key and schema 1; no migration is needed for this update. Hosted controller presentation changed to implement the requested status and custom-confirmation behavior. Final available suite: 109,454 checks and 118,210 assertions passed, zero failures. See [TEST_RESULTS.md](TEST_RESULTS.md) for scope and limits, and [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md) for final verification.

---

# Earlier Version 3.1.0 (historical)

A single visual/UX refinement release, preserving approved Version 3.0.0 separately. No tracker, repository, or deployment was modified.

- Introduced Blackberry & Amethyst: layered near-black violet backgrounds, tinted plum panels, restrained borders/shadows, centralized colors, and a Georgia title. Adapted the actual trackers’ 10-second neon timing to readable lilac/violet phases, with a static reduced-motion alternative.
- Refined hover, pressed, focus-visible, and disabled states; retained clear inspection-button priority. Renamed examples to Unicode lookalike and ASCII lookalike without changing sample URLs.
- Shortened the header and added application-independent field labels/help. Moved version/Unicode metadata to the footer and kept edition/cache status accurate.
- Added one page-wide Command/Control Enter handler for both inspection fields and ordinary page areas. Reference edits, reference/import controls, active import reviews, unrelated fields/contenteditable, dialogs, repeated/composing events, and other modifier combinations are guarded.
- Separated expected hostname, comparison result, and explanation. A single differing Unicode character can now produce an explanation with its actual position, script, glyph, and code point, derived from analysis rather than a hardcoded brand case.
- Established major section → technical category → compact evidence hierarchy with native details/summary. ASCII observations are grouped under Character Details. All five requested technical categories and every diagnostic explanation remain accessible.
- Combined identical original/readable character records while retaining source labels, names, code points, normalization rules, mappings, confusable symbols, and comparison characters. Normalization changes preserve the original and mapped/readable evidence. Existing 50-record paging remains.
- Replaced large diagnostic banners with expandable finding title/category/severity rows. Original analysis codes, levels, order, and explanations are preserved.
- Added understated Understanding Your Results, edition-specific Privacy & Storage, and Unicode Data & Licenses disclosures; retained the complete Unicode license.
- Added targeted presentation, shortcut, disclosure, accessibility-structure, contrast, storage-compatibility, and frozen-function-file tests. Updated existing UI expectations while retaining original analysis fixtures and differential checks. Included real in-app browser screenshots and observations separately from automated totals.

## Compatibility

Core URL/Unicode/ASCII/Punycode code, Reference Domains logic/schema/import/export, hosted lifecycle, and service-worker source are byte-identical to V3.0.0. Unicode 18.0.0 JSON is unchanged. The generated worker carries the new matched HTML hash/release ID; its scope and atomic update architecture are unchanged. Existing schema-1 storage and exports remain compatible under the same key.

Final available suite: 109,397 checks and 118,015 assertions passed, zero failures. See [TEST_RESULTS.md](TEST_RESULTS.md). The in-app browser preview is not Firefox verification. Actual Firefox, standalone file-policy behavior, disconnected offline startup, failed-update recovery, OS reduced-motion/accessibility, and live GitHub Pages checks remain on the manual checklist.
