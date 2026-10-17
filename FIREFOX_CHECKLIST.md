# Version 3.1.2 final Firefox verification

The user reports the earlier 3.1.2 persistent cached-startup issue fixed. That report and the successful 3.1.1 baseline are separate from the final editorial build. **Agent-run final 3.1.2 Firefox assertions: zero.** Current read-only checks found Firefox 158.0 installed and no geckodriver on PATH. The recorded earlier native startup failure is historical, not a new test or passing result.

Use a disposable test profile/Container and synthetic references. Export existing references before testing; do not clear production data to create failures. For hosted checks run `python3 tools/serve.py` and open `http://127.0.0.1:8765/offline-url-inspector/`. The public site still has the existing release; this checklist does not authorize publication.

Record Firefox/macOS version, edition, profile/Container, network state, result and screenshot/console evidence. Mark states not reached as untested. Source/DOM simulations, in-app rendering and stopping a local server do not establish native Firefox, screen-reader or full-disconnection behavior.

## Complete editorial flow and evidence

1. Open both editions. Read the subtitle, expected-host guidance, placeholders, example buttons and shortcut hint. Confirm manual priority and saved secondary comparisons are understandable. Inspect without opening must not visit a destination.
2. Check desktop layout, 390/320-pixel reflow, native **200% zoom**, visible focus and OS reduced motion. Top-row update controls stay left; the compact violet cache pill stays right. Offline details expand independently underneath without changing document positions of top controls. Feedback should not clip, overlap or move unrelated controls.
3. With VoiceOver, inspect once, then expand technical panels. The primary finding should announce once, not the complete diagnostic subtree. Cache/update announcements are separate; unchanged ready status should not be repeated. Inline errors must be associated with their fields without forced focus.
4. Inspect `https://аmazon.com` against `amazon.com` (Cyrillic U+0430). Check actual ASCII/Punycode, readable Unicode, original and percent-decoded spellings, full original URL and deliberate smaller second-line descriptors. Expand the character: one original/readable record, real glyph/code/name/system, one combined resemblance row, actual UTS #39 sequence and deeper raw data. Relevant caution must remain.
5. Inspect `https://café.invalid` with no target. Ordinary Unicode must be neutral, with no presumed brand. Test fullwidth `ａmazon.com`, combining `café.invalid` (e + U+0301), Punycode input, percent encoding, `æ.invalid` versus `ae.invalid`, invisible U+200B and bidirectional controls. Preserve all original code points and multi-character mappings; do not invent positional correspondence.
6. Compare `arnazon.com` / `amazon.com`, `vveb.com` / `web.com` and `paypaI.com` / `paypal.com` (capital I). Actual substitutions should be prominent once. With no target, ordinary ASCII observations stay collapsed/bounded and do not infer a brand. Expand All ASCII Observations: separated groups, observed alternatives, source/label/character positions and natural counts. Use a long synthetic hostname to exercise location and character paging; every record remains accessible and final paging does not strand focus.
7. Exercise exact match with a different scheme/port/path/query, mismatch, subdomain, name embedded in a longer hostname, spelling similarity, Unicode/ASCII resemblance and RTL visual unavailability. Identity is not entire-URL/site verification. Add saved references and a conflicting manual target; source/priority and secondary matches remain clear. One and multiple unavailable comparisons must not become negative findings.
8. Submit empty/malformed/unsupported/over-limit input and an invalid expected hostname. Errors appear near the right field, preserve entered text, clear old results and offer correction. Expand diagnostics: concise title and actual Warning/Caution/Information; deeper original raw code/level/text/order/evidence remains. Giant ASCII prose should not be the default explanation.
9. Review URL Components, default and explicitly supplied ports, Understanding Your Results, Technical Limitations and Hostname terms together. Preserve the three approved paragraphs and exact comma sentence. Read privacy/shared-origin guidance and full Unicode attribution/license; different github.io paths must not imply isolated storage.

## Reference management, storage and consent

10. Load a synthetic 3.1.1 schema-1 list without rewriting saved bytes, then reload/export and compare entries. Test add/edit/remove, duplicate/invalid names, empty list and input cancellation. Success should say Success and errors should say Error; failed persistence must not claim saved success.
11. Test single-label add/edit: Is This Hostname Complete?, Edit Hostname default, Add as Entered / Save as Entered. Escape restores input/focus; no suffix is appended. Unchanged single-label edits and IPs retain existing behavior. Batch imports support single labels without per-entry prompts.
12. Select a valid backup. Verify Merge/Replace radios, natural zero/one/many additions/removals, final count, duplicates and complete To add/To remove/final lists. Nothing applies until reviewed. Replace/Cancel preserves bytes; explicit acceptance applies the reviewed plan. Invalid JSON/schema/fields/items/size/read failures belong by backup controls, with technical errors deeper.
13. In disposable storage only, test unavailable storage, failed writes, unsupported/corrupt records, concurrent saved changes and legacy migration success/failure. Distinguish loaded/readable/saved/session-only/protected/conflict states. Help and Clear/Replace consent must explain that Export saves only the shown readable list, not unreadable or different saved data. Preserve needed raw records separately before any destructive test.
14. Test Clear, Replace and update dialogs with Tab/Shift-Tab, Escape, duplicate clicks and background shortcuts. Cancel is safe by default. Update consent also protects visible results and session-only references even after input fields are cleared. Export filename, schema/key/fields and portable contents remain unchanged; no inspected URLs or tokens enter backups.

## Hosted offline and update matrix

| State | Expected observation |
|---|---|
| First uncached online visit | Neutral Offline access while checking; Preparing only during actual installation; ready only after full verified cache. Completed preparation must not leave stale Preparing feedback. |
| Cached online return | Fast local verification; no routine Preparing flash or new registration dependency. |
| Same cached context, fully disconnected | Reopen/reload/inspect from verified cache; no endless Preparing. |
| New offline tab in same cached Firefox Container | Same verified copy and saved references, no false availability claim in another context. |
| Different uncached Container, offline | Browser connection failure is expected; do not bypass isolation. |
| Offline loaded page reconnects | Coalesced retry/check, current page/references retained. |
| Cache missing/invalid or no worker support | No ready claim; actionable reconnect/standalone guidance. Rare states may need controlled tools; do not claim ordinary testing covered them. |
| Delayed/absent discovery, registration or status reply | Bounded transitional state; no premature ready or permanent spinner. |
| Checking / already current | Immediate checking feedback and disabled duplicate action; current only after supported completion. |
| New version installing | Preparation feedback near updates, current page usable. |
| Waiting update ready / not ready | Ready action or clear reconnect/retry guidance; cache readiness remains separate. |
| Preparation/check failure or connection unavailable | Clear failure/retry; current page remains. No invented unreachable server or saved-reference promise. |
| Apply with current work | Review/Cancellation protects work; only consent requests activation of the same reviewed worker. |
| Changed waiting update / apply failure | Earlier consent cannot activate a different update; retry guidance, no reload. |
| Activation pending / timeout | Keep tab open; timeout retains current page and allows retry. |
| Applied update | Requested controller change reloads requesting tab; saved references remain; another tab is not forcibly reloaded. |
| Recovery after cache loss | Only fixed application asset can be restored/hash-verified. Plain 503 fallback names standalone/reconnect and the exact project worker scope. No default clearing of the whole shared origin. |

Establish the cache in the same Container online first. Stop the local server for an application-server failure test, then separately repeat cached startup with the network genuinely disconnected. Use two complete matched local builds for update testing; never hand-edit only generated HTML or its worker. Preserve a standalone fallback.

## Reload and network boundaries

15. Reload at the top and at a scrolled position, once and repeatedly with Command-R. Record cache/network/Container state and whether results/disclosures were open. Distinguish the intentional title animation, browser scrolling and whole-document repaint from application layout shifts. A video/trace is needed for frame timing; source tests do not prove every Firefox flash eliminated.
16. Watch Network/Console while inspecting synthetic `.invalid` URLs with distinctive path/query tokens. No inspected destination/token may be requested. Only fixed application files may load/update. Verify exact CSP initialization in both editions, no external runtime assets and no inspected input in browser storage/exports.

Final editorial Firefox, native zoom, screen-reader, OS reduced-motion, file-policy and full-disconnection results remain pending until performed. Record them separately from historical baseline and current in-app observations.


## Final focused interface verification (pending native Firefox)

The agent inspected the current in-app screenshots in [FINAL_INTERFACE_REVIEW.md](FINAL_INTERFACE_REVIEW.md). Native Firefox control failed because Computer Use permission was unavailable; no native pass is claimed.

1. Run `python3 tools/serve.py` and open the printed loopback project URL in Firefox. Use the built-in Unicode example. At desktop width, confirm both main hostname labels are inline, while Input & Normalization descriptors use smaller second lines. Expand Character Details and verify mapping sequences remain contextual.
2. Expand Full Diagnostic Log and its bottom Raw Diagnostic Records. Check original messages, codes, categories, severity and order; Tab into the record region and use Page Down, with a visible focus ring. Use the ASCII example and expand All ASCII Observations and locations.
3. Inspect no-feedback, successful check, failure and Apply Update states. For hard-to-reproduce states, run `python3 tools/preview_interface.py` and use its explicitly simulated dropdown; this does not verify actual installation. Confirm Check/Apply stay left, the compact lilac pill stays right on desktop, feedback and its explanations stay left, and offline details expand independently across the panel.
4. Repeat at tablet/mobile widths and **native Firefox 200% zoom**. Confirm no horizontal overflow or clipped controls, sensible responsive wrapping, compact collapsed offline help, and readable full-width paragraphs. CSS magnification screenshots are supplemental only.
5. For actual lifecycle assurance, complete the matched-build update and same-context disconnected-startup matrix above. Confirm readiness only after cache verification, current only after successful update check, cancellation protects work, and only the consenting tab reloads.
