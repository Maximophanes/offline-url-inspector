# Current audit-corrected candidate — security preservation

Candidate **3.2.0-a67e4b13dd5fa5cd**. The newly executed full suite passes **109,827 checks / 130,743 assertions**, including 27 correction checks / 841 assertions and 18 verifier cases. The original 146 embedded checks / 533 assertions also pass. See [AUDIT_CORRECTIONS.md](AUDIT_CORRECTIONS.md) for implemented changes, exact source-boundary preservation, before/after timing and outstanding native-browser checks.

The records below are historical checkpoints. Their claims of byte-identical core/extractor source and browser passes belong to their stated earlier candidate. This correction changes only the authorized decoding control flow and preprocessing implementation; original result fixtures remain pinned. No new native Firefox, VoiceOver or browser-rendering pass is claimed.

## Historical pre-correction records

# Current targeted hostname highlight/@ preservation

Candidate **3.2.0-cf634806f70b4b3c** changes only supplemental presentation source and scoped CSS. Highlighted hostnames use explicit reliable-token annotations and inert text nodes, with no links, event handlers, roles or focus stops. Raw userinfo remains concealed until explicit evidence reveal; no credential assumption is made. The template, main UI wiring, extraction/decoding/comparison algorithms, reference storage, Unicode, worker/offline behavior, CSP policy and dependency lockfile are unchanged from the preceding candidate.

Newly executed tests: 146 embedded checks / 533 assertions; 109,782 full-suite checks / 129,884 assertions, zero failures. Actual hosted in-app 1280/390 px rendering/privacy/keyboard checks are separate from native Firefox/VoiceOver. Current evidence and remaining targeted manual review: [HOSTNAME_HIGHLIGHT_REVIEW.md](HOSTNAME_HIGHLIGHT_REVIEW.md).

## Previous editorial preservation snapshot

# Version 3.2.0 refined candidate — security preservation

The approved refinement changes presentation only. The embedded analyzer is byte-identical to the pre-refinement candidate. Released core/reference/presentation/hosted/worker sources, Unicode data, base CSS, dependency lockfile, workflows and baseline fixtures retain their protected identities. No extraction/decoding limits, comparison algorithm, storage schema, CSP policy, network/navigation capability or worker behavior changes. Generated worker identity follows the normal new HTML hash.

Full private values and parameter names remain inert, lazy evidence and are removed on close/reinspection. Closing the containing disclosures also clears revealed supplemental bodies. Significant findings name hostnames without exposing full URLs. Target attribution uses existing metadata; comparison unavailability and partial/unsupported causes remain explicit. No destination links or execution sinks were added.

Final regression/conformance/ICU/HTTP suite passes **109,761 checks / 129,797 assertions**; all original object/diagnostic pins remain intact. Actual hosted in-app 390/1280 px rendering, privacy/focus and server-stopped cached startup were observed, with browser script/style identities bound to the manifest. This does not establish native Firefox, refined standalone file policies, VoiceOver, physical-mobile, native-zoom or full disconnected-network behavior. See [current review](EMBEDDED_EDITORIAL_REVIEW.md) and its actual-versus-simulated evidence boundaries.

## Historical v3.1.2 preservation review

# Version 3.1.2 security preservation review

Review date: 2026-10-16. Core analysis (`src/core.js`), reference normalization/comparison/storage/import/export (`src/references.js`), and Unicode JSON are byte-identical to the Version 3.1.1 baseline. The base theme retains its appearance after explicitly approved unused-rule removals. Functional pins, complete differential/conformance tests and focused storage/lifecycle/rendering checks pass. This is an internal preservation review, not independent certification.

Presentation keeps original input, classifications and diagnostic explanations; all ASCII alternatives and occurrence positions stay in the log even when omitted from a prominent subsection. Character mappings are complete, and single-character attribution requires supported alignment. Untrusted strings enter text nodes only. The stable reference key/schema/backup contract is unchanged, with no startup rewrite of existing schema-1 bytes.

Hosted initialization changed: existing exact-scope registrations are discovered before any network-backed registration attempt, active worker/controller status is verified through bounded fixed-action messages, and refresh attempts/deadlines are bounded. Only fixed application URLs can register/update. Worker behavior is unchanged; only the plaintext 503 recovery message changed. Its complete-cache hashing, waiting-cache revalidation and reviewed activation remain authoritative. No inspected input or reference data enters messages, fetch targets or persistent URL storage. CSP hashes and matched release hashes were regenerated and checked for both editions; no policy was relaxed. See OFFLINE_STARTUP_REVIEW.md and TEST_RESULTS.md.

The implementation-specific controls below are retained from the earlier review and checked where affected. Current real Firefox verification is pending; the user's Version 3.1.1 checks establish the baseline, not Version 3.1.2 enforcement.

## Complete editorial pass: preservation evidence

The final focused interface pass preserves all 139 pre-audit complete inspection results and every raw diagnostic code/level/text/order. Source hashes for core/reference/data/lockfile/workflow remain exact. Base-CSS pins normalize only the approved unused-rule removals and still require the historical full-file hash. Relative to the committed 3.1.2 checkpoint, `src/sw.js` is byte-identical. Relative to the older baseline, **the worker is not byte-identical:** its one plaintext 503 recovery literal was revised for readable, scope-specific recovery. Tests replace only that exact literal and require the original full-file hash; cache/scope/hash/fetch/activation logic therefore remains byte-identical. No existing pin was simply replaced with a new hash.

Presentation changes distinguish unavailable, negative, invalid and uncertain results; actual warning severity is retained. Ordinary Unicode is neutral, supported/control evidence remains emphasized, and character mappings retain their structured evidence and complete internal data; uncertain attribution records remain reversible escaped JSON. All untrusted values still enter text nodes. Exact hostname results disclaim comparison of the rest of the URL.

Storage/normalization/matching/schema/import algorithms are unchanged. UI feedback reports actual persistence outcomes and clarifies that Export cannot preserve an unreadable or different protected record. Reload consent additionally protects visible results and session-only references. Feedback-state tracking clears stale waiting/preparation prose without weakening readiness or reviewed activation.

The full final available suite passed 109,580 checks / 122,882 assertions. All 33 diagnostic families, schema-1 compatibility, strict functional pins, no-network guards and exact CSP hashes pass. The current actual rendered review is `tests/editorial-browser-preview.json`; Firefox/native accessibility/full-disconnection limits remain explicit in `TEST_RESULTS.md` and `FIREFOX_CHECKLIST.md`. The user reports the earlier 3.1.2 persistent cached-startup bug is fixed; that is separate from agent-run final Firefox assertions (zero).

## Scope and conclusions

Reviewed the approved parsing/Unicode core, V3 presentation, text rendering, reference normalization/comparison, browser persistence, JSON import/export, generated CSP, hosted registration, worker install/activation/navigation/message paths, deployment files, and proposed clipboard workflow. No parsing rewrite was undertaken. Presentation helpers combine equivalent evidence and produce explanations without mutating core classifications or diagnostic levels. The V2.1 core algorithm bodies and Unicode JSON were preserved and checked differentially.

The main boundaries are untrusted pasted text, user-supplied reference/import data, an untrusted destination that must never be contacted, browser storage/cache failures, and static application updates. A compromised browser, extension, hosting origin, repository, or distribution can defeat a client-side tool; no package hash or meta CSP authenticates a malicious replacement application.

## Data flow and rendering

Inspection is synchronous in-memory analysis. The document has no fetch/XHR/telemetry/remote font/image/library/Unicode requests. Submitted URLs are never assigned to navigation, links, forms, workers, application messages, cache keys, location, history, or browser storage. `new URL` parses text without fetching it. Credentials, paths, queries, fragments, the original input, and the expected field remain ephemeral application state. Browser/OS session restoration, extensions, user exports/screenshots, and system clipboard retention are outside that application guarantee.

Untrusted output uses `textContent`, text nodes, and created elements; there is no `innerHTML`, HTML insertion, `eval`, dynamic function creation, inline event attributes, or untrusted CSS in shipped code. Injection fixtures verify that HTML-like input stays inert. Controls/invisibles are represented explicitly; code points and names support interpretation beyond visual glyphs. The only generated anchor is a local Blob download containing reference JSON, removed after the user-selected export. It never links to inspected input.

The app neither monitors nor automatically reads the clipboard. The Shortcuts workflow opens a literal fixed inspector address and requires explicit pasting. No submitted data travels through query strings or fragments. The user must copy the real hyperlink destination, not merely displayed link text.

## Parsing and comparisons

The retained core preserves original input and separately reports native normalized destination, percent-decoded authority evidence, Punycode, script/normalization findings, and URL components. Tests cover credentials/authority confusion, backslashes, percent encoding, malformed/empty/long inputs, ports, IPv4/IPv6, invalid Punycode, unsupported schemes, bidi controls/invisibles, and Unicode outside the hostname. Input is limited to 32,768 UTF-16 code units. Ambiguous or invalid parsing does not produce an invented destination.

Native URL parsing remains authoritative; custom Unicode processing explains observations rather than replacing the browser destination. There is no DNS, certificate, reputation, redirect, page-content, or ownership lookup. A match is not a safety verdict. Skeletons are labeled internal comparison symbols and never displayed as destination URLs. Full RTL visual skeleton processing is unavailable and is disclosed.

Reference entries pass the same expected-host parser, DNS/syntax checks, and normalized ASCII representation. Duplicate representations collapse after normalization. Exact comparison is separate from visual/spelling similarity. Subdomains require `.` label boundaries; `amazon.com.evil.example` is embedded text rather than a subdomain of `amazon.com`. IPs and single-label names are exact-only. No final-two-label registrable-domain inference is made. Up to 100 references are compared; the main summary limits candidates while advanced details retains all results. Manual expected-host input has priority, and reference outcomes do not erase structural or Unicode evidence.

## Reference storage and imports

Only the user-managed reference record is saved, under the stable key `offline-url-inspector:reference-domains`. The record contains exactly application ID, schema version, and normalized reference hostnames. The worker never accesses or clears localStorage. There is no synchronization or automatic addition from input/history.

Schema 1 is the shared storage/export format. Explicit tested schema-0 draft migration retains every valid normalized entry. Malformed, partially invalid, or unsupported saved records are left untouched and reported as protected; edits remain session-only until a reviewed Replace or confirmed Clear. Failed reads/writes/migrations use session state and preserve the previous stored bytes where accessible. Optimistic comparison of saved bytes prevents a stale tab silently overwriting another tab's edits. Cross-tab state is not automatically merged.

Import accepts at most 128 KiB and 100 entries, each at most 2,048 input characters. File size is checked before reading; UTF-8 JSON size is checked again before parsing. Strict application/schema/field/type validation rejects unknown fields, prototype-bearing fields, malformed names, unsupported versions, and oversized lists. JSON is parsed as data. Private import plans prevent a changed preview object or stale review from altering what is applied. Merge requires Apply; Replace additionally requires confirmation. Import and clear never happen merely by selecting a file or opening the page. Export contains only the portable record.

`file://` localStorage is not standardized; read access alone is not a claim that saving works. Saving status changes only after a write succeeds. Private-mode storage may work temporarily without announcing its private status; the app does not attempt fingerprinting to detect that mode. Browser cleanup or quota/policy can remove or disable storage. Export/import is the manual backup mechanism. Unsupported saved data is not included in a current-reference export; preserve its original raw value separately before an intentional replacement.

GitHub project paths share their hostname's origin. Other applications at `USERNAME.github.io` may read or modify this list, regardless of path. Namespacing prevents accidental collisions only. A separate hostname is an optional stronger boundary. References themselves can reveal interests, so store only hostnames you are comfortable keeping on that origin. No inspected URL, token, or credentials are saved by this app.

## Enforceable policy versus hosting limits

Both documents place meta CSP before styles/scripts. Build-time hashes cover the exact executable script and stylesheet; tests recompute them. There are no external subresources or inline style/event attributes.

| Policy/control | Standalone | Hosted |
|---|---|---|
| `default-src` | `'none'` | `'none'` |
| `script-src`, `style-src` | Exact SHA-256 hashes | Exact SHA-256 hashes |
| `connect-src`, `img-src`, `font-src`, `object-src`, `frame-src`, `media-src`, `manifest-src` | `'none'` | `'none'` |
| `base-uri`, `form-action` | `'none'` | `'none'` |
| `worker-src` | `'none'` | `'self'`; fixed registration code and exact scope guard |
| `unsafe-inline`, `unsafe-eval` | Absent | Absent |

The hosted worker's own fetches are not restricted by the document's meta `connect-src`; its source enforces a single fixed `index.html` URL. Worker registration/updates and ordinary page loading are legitimate application requests, not destination inspection. CSP hash pinning and static checks passed; enforcement has not been observed in V3.1.2 Firefox.

Meta CSP cannot provide all HTTP-header protections. In particular `frame-ancestors`, CSP `sandbox`, and reporting/report-only policies require response-header support or are unsupported in meta. None is claimed active. Ordinary GitHub Pages deployment provides no package-controlled arbitrary response-header configuration; no custom CSP header, X-Frame-Options, Permissions-Policy, HSTS policy, COOP/COEP, or security-report collector is supplied. GitHub may set its own platform headers; they were not measured here. The package does not introduce a proxy/backend merely to add headers. See [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy).

## Worker scope, offline lifecycle, and recovery

Registration is hard-coded relative to `/offline-url-inspector/`, never `/`; the worker checks both its registration scope and script path. It intercepts only GET navigations to the exact project root or `index.html`, without treating the query as a cache key. Other requests are not handled by the worker. It never fetches an event request, message-supplied URL, submitted hostname, or sibling project. It does not clear unrelated caches or origin data.

Each release has a distinct application-prefixed cache and one complete inline HTML asset. The generated worker pins its SHA-256. Install fetches that fixed asset without credentials or redirects, verifies bytes, writes it, and verifies the stored copy. Interrupted, HTTP-error, quota, or mismatched deployments fail installation and delete only the failed new cache. The existing working cache stays available. SHA checks detect incomplete/mixed release assets; they do not authenticate a compromised origin that can replace both files.

There is no install-time `skipWaiting`. A complete waiting update is announced; the user chooses activation/reload. Current URL text, visible results, reference input, import reviews and session-only reference lists trigger a reload confirmation. Without approval, the current page remains open. The worker rechecks its complete cache before `skipWaiting`; if it was evicted, online recovery must restore and verify that same release first. Failure leaves the current page in place. A tab that did not request reload is not forcibly reloaded when another tab activates a worker; each document is a complete release with no version-sensitive subresources.

Activation checks the complete current cache, keeps one previous application-owned cache, and claims clients. The old worker continues to serve its old complete cache when an update fails. Cache readiness is requested by MessageChannel, not inferred from registration. Messages accept only fixed actions from application-origin/path clients and contain no inspected data.

If the active cache disappears, navigation attempts recovery of the fixed expected asset. If unavailable offline, the worker returns a plaintext 503 with recovery/standalone instructions. If the worker registration itself is removed, ordinary browser/network behavior applies. Permanent offline availability is never guaranteed. Recovery must not clear all data for a shared GitHub Pages origin. See [UPDATES_AND_ROLLBACK.md](UPDATES_AND_ROLLBACK.md) and [MDN worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Confirmed findings, changes, and unresolved limits

The review found and addressed a V3 cache-loss edge case before release: a waiting update might lose its verified HTML before activation. Reviewed activation now restores/verifies it or refuses activation. Tests cover both online restoration and offline refusal. A new asynchronous file-import test initially checked before the handler resumed; waiting one event-loop turn resolved the test timing issue, with preview contents and unchanged stored data asserted.

No confirmed new core parsing defect was identified. The 19 known IDNA discrepancies remain a documented Deno native-runtime interoperability limitation, not evidence that all those official successful vectors are invalid. Independent ICU matches all 19. Exact internal runtime cause and Firefox behavior remain unresolved; [IDNA_REVIEW.md](IDNA_REVIEW.md) includes the corrected diagnosis and reproducible evidence.

Remaining material limits:

1. Final V3.1.2 Firefox startup, CSP enforcement, file storage, offline refresh/updates, keyboard/accessibility, screen-reader/zoom, and reduced-motion behavior still require manual verification. In-app browser desktop/narrow rendering, shortcuts, persistence, and a reviewed update were observed separately. Simulations, local HTTP, and that preview are not Firefox or live Pages evidence.
2. Full RTL visual confusable processing is unavailable; native browser IDNA/version differences remain. Unicode names may fall back for unnamed/algorithmic ranges.
3. No page/redirect/reputation/ownership analysis or Public Suffix List. Legitimate IDNs and common ASCII shapes can resemble other names; font-dependent observations do not establish intent.
4. Browser/private/file storage and caches can fail or be cleared. Backup/export is manual. Shared-origin applications and privileged browser components can access origin data.
5. Meta CSP cannot supply all header protections. Integrity hashes depend on a trusted distribution/hosting origin.
6. The fixed `/offline-url-inspector/` architecture must be deliberately rebuilt and retested before using another hosted path. Shortcuts setup has been documented from official platform instructions but not executed on the user's Mac.

Only the local dev/v3.1.2 working tree was modified; main, remote settings and published assets were not changed by this task. Deployment files contain no local user paths or synthetic sensitive test markers. The package includes source/fixtures for review; it contains no user clipboard contents or real recovery links.

## Retained V3.1 UI checks

The new global shortcut has one bubbling listener and explicit guards against double execution, key repetition/composition, unrelated editing, references/imports, dialogs, and other modifier combinations. Untrusted glyph/name/diagnostic text still enters text nodes only. Character deduplication returns presentation copies and preserves all original data. Diagnostic records retain original codes, levels, order, and explanations; category/severity labels supplement them. Script/style CSP hashes are rebuilt for each edition with no policy relaxation. The exact project scope remains unchanged. Only the worker’s 503 recovery prose differs; restoring that one literal reproduces its original whole-file hash. Frozen-file hashes, diagnostic completeness across 139 fixtures, schema-1 startup without rewriting records, and no-network guards passed; see the final report.

## V3.1.1 confirmation and update-state review

Dynamic dialog titles, hostnames, counts and descriptions use text nodes. Clear, Replace, single-label and reload consent use a shared native `dialog` with Cancel/Edit as the initial focus, explicit Tab wrapping, Escape/ambiguous-close cancellation, background `inert` plus activation guards, and focus restoration. Only the explicit Proceed click resolves approval; a close return value does not. Buttons/request guards prevent duplicate submission. The tested fallback preserves modal guards when native `showModal` is unavailable, although real-browser legacy fallback behavior is not certified. No new UI library, external dependency, native confirmation API or storage key was introduced.

A reviewed import plan is captured before confirmation and revalidated by the unchanged store when applied. Stale plans are rejected. Failed writes preserve previous saved bytes under the unchanged store semantics; the UI reports tab-only changes instead of claiming successful persistence. Imported single labels remain valid and are described together; new manual single labels require explicit contextual consent without a guessed suffix.

Offline-cache verification and checking for a newer worker are distinct states. Manual checks have busy/deduplication guards; offline/failure/failed-install results never become an up-to-date claim. Waiting-state snapshots are rechecked after asynchronous cache responses, preventing stale ready-to-apply feedback after activation. Custom reload consent preserves existing work safeguards, and the waiting-worker identity is rechecked after consent. The worker’s executable behavior still accepts only fixed messages and a fixed application asset; its only source change is the 503 recovery string.

The in-app browser verified actual repeated pointer/click states, custom dialogs/focus/cancellation, native radio arrows and file review/replacement, a reviewed update with reference retention, successful checking, failed checking with the server stopped, and cached reload/analysis while that server remained unavailable. These are not Firefox or a fully disconnected-network test. The user’s successful nine-group V3.1.0 Firefox baseline remains separate from pending final V3.1.2 Firefox checks.
