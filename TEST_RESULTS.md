# Version 3.1.1 final test results

Run date: 2026-10-16. Application 3.1.1. **109,454 checks passed; 118,210 assertions passed; zero failures.** Cases/checks and assertions are separate counts; they are not all independent browser scenarios.

Targeted tests were used while changing the affected UI. After the final runtime changes, the complete available regression/conformance suite ran once and every command passed. Packaging checks and actual interactive browser observations are separate, not added to these totals. Aggregate: `tests/summary-results.json`.

| Suite | Cases/checks | Assertions | Failures |
|---|---:|---:|---:|
| unit and official Unicode fixtures | 108,664 | 112,223 | 0 |
| isolated Happy DOM integration | 157 | 1,031 | 0 |
| Reference domains, storage, imports, prioritization | 70 | 135 | 0 |
| V3 information hierarchy and reference management DOM | 33 | 112 | 0 |
| V3.1 presentation, shortcuts, disclosures and accessibility structure | 199 | 4,093 | 0 |
| V3.1.1 custom confirmations, storage wording, import choices and polish | 45 | 158 | 0 |
| Service worker atomic lifecycle simulation | 25 | 84 | 0 |
| Hosted cache readiness, update feedback and reviewed reload simulation | 27 | 71 | 0 |
| Approved V2.1 core and Unicode preservation | 143 | 148 | 0 |
| review of the 19 original IDNA discrepancies | 64 | 102 | 0 |
| independent ICU UTS 46 review | 19 | 19 | 0 |
| Local /offline-url-inspector/ HTTP deployment | 8 | 34 | 0 |
| **Total** | **109,454** | **118,210** | **0** |

## Functional preservation and compatibility

The approved V3.1.0 files/archive and both tracker references are compared with hashes captured before work; release records are in `tests/release-checks.json`. No previous release or reference file was modified. Core parsing, Unicode/ASCII/Punycode processing, Reference Domains implementation/storage schema/import parser, service-worker source and bundled Unicode JSON are byte-identical. Hosted controller presentation necessarily changed for compact statuses, real update-check feedback and custom reload consent; its fixed URL/scope/messages/complete-cache architecture is preserved.

The full existing differential suite retains 139 complete inspection-object comparisons against the earlier approved core. New polish pins also check the entire V3.1 title rule and keyframe block unchanged. Existing schema-1 records load without rewriting entries. Both editions retain the same application ID, stable key `offline-url-inspector:reference-domains`, schema 1 and portable backup filename. No storage migration is needed.

## What the automated tests establish

**Core and independent data:** Deno 2.9.7 / V8 15.0.245.2-rusty. The main suite includes 100,855 official Unicode normalization checks, 6,712 official prototype-mapping checks, independent Python RFC 3492 fixtures, original application/ASCII/authority cases and 300 sampled IDNA vectors. The unchanged Unicode 18.0.0 source and derived-data hashes were verified, without regenerating tables.

**Existing UI/reference integration:** Original regression and V3/V3.1 suites preserve analysis classifications, original/normalized spelling, character evidence, diagnostic completeness/levels, reference comparisons/manual priority, persistence, protected/unknown data, stale tabs, session fallback, malformed/malicious/oversized imports and portable backups. UI assertions were updated only for the requested controls/presentation. Guarded network/navigation APIs recorded no prohibited attempts. Happy DOM 20.8.4 evaluates trusted app code for these tests; it is not actual Firefox, layout/CSP enforcement or a sandbox for arbitrary untrusted test scripts.

**V3.1.1 polish:** 45 new targeted checks / 158 assertions cover actual store-state wording, no save claim before a verified write, protected/failed storage, modal safe defaults, Escape/cancel/ambiguous close, Tab wrapping/focus restoration, inert/blocked background controls, duplicate submission, fallback behavior, single-label add/edit/cancel/unchanged edits, IP exceptions, normalized duplicates, native radio choices, reviewed Merge/Replace and counts, stale-plan rejection, failed writes, batch imported single labels, backup schema/filename, prominent data-derived substitutions, title preservation and the stable primary-button CSS. These are simulated DOM/source tests; live interaction observations are below.

**Hosted controller:** 27 checks / 71 assertions cover exact registration/scope, truthful verified readiness, initial preparation/unavailable states, immediate busy feedback, successful no-update results, deduplicated rapid checks, known offline state, network/interrupted failures, failed installation, waiting-cache restoration state, reviewed custom reload, changed-worker approval invalidation, activation timeout, preserved work, and fixed message payloads. A waiting-to-active asynchronous status race found in the preview now has a regression check: stale “ready to apply” feedback cannot survive after the waiting worker disappears.

**Worker integrity/lifecycle:** The unchanged worker is tested for complete single-asset hash verification, waiting/reviewed activation, failed/interrupted/mismatched/quota updates preserving old offline startup, cache eviction/recovery, sibling-cache isolation and reference storage preservation. The new controller does not weaken those protections. These worker failure scenarios are simulations, not an actual interrupted download in Firefox.

**Actual loopback HTTP:** The final runner served the generated files at `/offline-url-inspector/` and verified real responses, MIME types, exact HTML/worker bytes, relative worker path, absence of a root worker/sibling exposure, deployment privacy markers, and exact script/style CSP hashes for both editions. No unsafe-inline, unsafe-eval or new runtime resources were introduced. No repository was created or published.

## Actual interactive browser observations

The Codex in-app browser rendered the hosted build on loopback port 8767. It is **not Firefox**. Structured evidence is in `tests/browser-preview.json`, with screenshots under `preview/`.

- At 1100 px and 390 px, the header glow blended into the page and there was no horizontal page overflow. The narrow modal measured 354 px and stayed within the viewport.
- Three repeated actual pointer entry/exit/click cycles produced the same 190.523 × 44 px button rectangle and no transform. Normal and hover each remained gradients. This verifies observed stable states, not frame-by-frame video of every browser/compositor.
- Single-label guidance defaulted to Edit Hostname; Shift-Tab/Tab wrapped between actions; Escape preserved the list/input and returned focus; Add Anyway saved `intranet` without a suffix. Background controls were inert/excluded from the modal accessibility tree.
- Clear cancellation preserved the list. Explicit Clear References cleared the synthetic list once and restored focus.
- A synthetic schema-1 backup was selected through the native file picker. Merge/Replace radios and native arrow-key operation updated the preview. Imported single labels were described together. Replace Cancel preserved data; explicit Replace applied the reviewed counts and returned focus to Import Backup.
- A waiting local build update prompted custom reload consent. Cancel retained URL text and an unapplied import; explicit Apply/reload loaded the matching complete build with references retained. A successful check reported up to date.
- The preview server was then stopped. Checking for updates reported **Unable to check for updates**, while verified **Offline ready** remained separate. Reload still initialized the cached application and retained references; inspection continued with the server unavailable. This is a real server-unavailable cache test, not an internet-disconnected/private-mode test.
- No console warnings/errors were observed in the captured session. No destination-network monitoring claim is inferred merely from this visual session; source/guarded tests establish the application data-flow evidence.

## Firefox baseline and remaining checks

The user reported **nine V3.1.0 manual Firefox/macOS groups passed**, including standalone/hosted reference persistence, backup/restore, clear/cancel, keyboard/examples, hosted startup and operation after stopping the server. Those are recorded as user-reported baseline evidence in `tests/user-baseline-verification.json`.

**Actual V3.1.1 agent Firefox assertions: 0.** The known native Firefox 158.0 / geckodriver 0.37.1 / macOS 27.0.1 SIGABRT occurred before session/page creation in earlier attempts. Conditions have not meaningfully changed, so that startup procedure was not repeatedly retried. The updated opt-in harness is syntax-checked but not executed. No startup failure is counted as a pass.

Use the focused [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md) for final hover, custom dialogs/focus, radios, single-label guidance, storage failures, updated statuses, reload/upgrade, standalone policy and real cache behavior. Screen-reader, 200% zoom, OS reduced-motion and full interactive contrast checks remain manual. Structural/declared-color tests are not an accessibility certification. Legacy dialog fallback is simulated, not verified in a legacy browser.

The 19 retained Deno IDNA discrepancies remain in the 300-vector sample (281 output matches / 19 discrepancies). Passing assertions require honest native rejection, not fabricated full UTS #46 conformance. Independent ICU 78.3 matches all 19 official outputs. The exact runtime component cause and Firefox behavior for those vectors remain unresolved; [IDNA_REVIEW.md](IDNA_REVIEW.md) retains the evidence. Full RTL visual comparisons, page/redirect/reputation/ownership checks, permanent storage/cache availability and website safety are not claimed.

## Reproduce

From the extracted project directory, with Python 3.10+ and Deno:

```sh
deno cache tests/dom.mjs tests/dom-v3.mjs tests/refinement.mjs tests/polish.mjs
python3 tools/test_all.py
```

The cache command downloads locked Happy DOM only when needed for development. Runtime HTML has no package dependencies. The runner owns/stops loopback port 8765. Individual tasks include `test:polish`, `test:hosted`, `test:worker` and the preserved suites. The ICU diagnostic runs when the tested library exists; on another system provide its installed library/symbol suffix or report that check as not executed.

For opt-in real Firefox testing on a working setup, start `geckodriver --host 127.0.0.1 --port 4445`, then run `python3 tools/test_all.py --with-firefox` in a disposable environment. Startup errors fail the command. Follow the manual checklist for the modified workflows and additional offline/accessibility scenarios. No live GitHub Pages or Shortcuts setup was performed.
