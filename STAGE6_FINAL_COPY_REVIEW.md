# Stage 6 final copy refinement and acceptance

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

Both requested copy refinements are implemented. This work is ready for formal Stage 6 user acceptance; acceptance and release approval are not inferred. Branch remains `dev/v3.3.0-automatic-lookalikes`, HEAD `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Stable v3.2.0 and all prior local development work are preserved. Everything remains local, unstaged and uncommitted. No push, merge, deployment, branch/worktree creation or Stage 7/8 work occurred.

## Context-sensitive recommendations

Advice is chosen from the supported cautions actually present, after the existing selection and consolidation steps. Priority, severity and evidence remain unchanged. The advice appears once, as the final thought in the primary caution; secondary cautions retain their own evidence and caution styling.

| Evidence | Recommendation |
|---|---|
| HTTP only, including HTTP with merely informational ports, weak spelling, exact membership or ordinary coverage limitations | “Avoid submitting passwords or other sensitive information to HTTP addresses; use HTTPS instead.” |
| Hostname-identity caution without HTTP | “Check the actual hostname before opening an address or entering sensitive information.” |
| Both identity and HTTP cautions, whether original, recovered or mixed | “Check the actual hostname of each address. Avoid submitting passwords or other sensitive information without HTTPS.” |
| Neutral or information-only result | No new generic security advice. Existing qualified findings and information remain. |

Before, `http://example.com/login` received the generic “Check the website name before opening the address or entering sensitive information.” It now receives the HTTP-specific recommendation above, alongside the existing explanation that HTTP does not encrypt information sent to the website. A lookalike plus HTTP receives one consolidated recommendation addressing both concerns. An HTTP original with a recovered HTTPS lookalike is handled correctly even though the stronger primary finding itself uses HTTPS.

These are evidence-driven presentation rules, not URL/brand exceptions. No connection, transmission, remote content or redirect is claimed to have occurred. Recommending HTTPS is not a website-safety verdict.

## Short headings with explicit scope

The existing result layout now establishes scope with a label above the primary finding and labels for consecutive runs of secondary findings. The original priority order is preserved exactly; findings are not sorted into separate origin buckets. A scope label repeats only when ordering crosses back to another scope. No additional card, panel, border system, animation or theme was introduced.

| Before | After within the scope context |
|---|---|
| “Possible lookalike inside this link” | “Possible lookalike website” |
| “Misleading website name inside this link” | “Misleading hostname structure” |
| “Unencrypted HTTP inside this link” | “Unencrypted HTTP” |
| “Port 8080 specified inside this link” | “Port 8080 specified” |
| “An address inside this link needs review” | “Address needs review” |
| “Caution · Inside this link” on each row | “Caution” on each row, with the shared “Addresses found inside the URL” scope label |
| “This link uses unencrypted HTTP” | “Unencrypted HTTP,” under “Original address” when it concerns the original URL |

The primary label distinguishes **Original address** from **Address found inside the URL**. Secondary labels distinguish **Original address**, **Addresses found inside the URL**, and an optional **Expected Hostname** notice. Neutral results keep the primary scope available to accessibility APIs without adding a visible label to the quiet result.

Affected hostnames remain in comparison lines and independent recovered transport headings. Informational ports remain information; all independently meaningful cautions retain their existing caution treatment. Repeated occurrences and Unicode/Punycode context retain their previous consolidation. Recovered addresses remain text evidence, not confirmed redirects.

## Accessibility, privacy and evidence

Visible scope is shared, but accessible names are individual. The primary group references its scope, heading, affected hostname and comparison text through `aria-labelledby`; its explanation uses `aria-describedby`. Each secondary finding separately references the relevant scope label, its Caution/Information label, descriptive heading and affected hostname, with a separate description reference. Scope and canonical hostname remain available even when they are not repeated visibly in that row. The settled live announcement retains explicit fixed scope and excludes private URL values and hostnames.

Native Firefox matched **26 computed accessible names** for representative primary and secondary findings, including both scopes, HTTP-only, mixed findings, multiple embedded cautions and informational rows. All focused variants also verify valid name/description references and unchanged warning counts. This is browser-level evidence, not VoiceOver acceptance or a claim about a screen reader's complete interaction experience.

No userinfo, passwords, tokens, parameter names or full recovered URLs were added to ordinary or accessible naming. Names use existing verified hostname evidence and safe text nodes. Exact source/parent/occurrence evidence remains behind deliberate disclosures, and sensitive mounted values are cleared when closed. Reference storage/exports remain unchanged. Disclosure defaults, settled focus and keyboard behavior are preserved.

An initial name-locator expectation did not account for the existing uppercase `.label` styling reflected in Firefox's computed name. Simple controls and a scoped uppercase-name probe confirmed this was a test expectation issue. The corrected test preserves the product's approved styling. A keyboard test initially targeted Technical Details for HTTP-only output, where that empty disclosure is correctly absent; the final keyboard check uses a lookalike with meaningful technical evidence. Neither correction weakened product checks or changed disclosure behavior. Initial evidence and diagnostic probes are retained outside the checkout.

## Exact modified files

Four existing product sources changed:

- `src/results-presentation.js`: contextual advice and shorter finding titles/details; no change to selection priorities, matching or severity.
- `src/automatic-ui.js`: primary/consecutive scope labels, individual accessible references, privacy-safe scoped announcements and shorter row labels.
- `src/template.html`: primary scope/hostname references and group semantics within the existing result.
- `src/automatic.css`: only spacing for the new scope labels, using existing typography/palette classes.

Current guidance changed in `AUTOMATIC_FINDINGS.md`, `EDITORIAL_STYLE_GUIDE.md`, `DESIGN_NOTES.md`, `README.md`. `deno.json` routes current UI task aliases to the new isolated suite, and `tests/harness.mjs` adds an exact hash-checked restoration layer for historical assertions. AGENTS.md already provides adequate durable plain-language, consolidation, provenance, privacy and accessibility guidance and was left unchanged.

The new review, screenshot gallery and `tests/final-copy-*` files contain this task's evidence. `tests/final-copy-integrity.json` lists every changed/new file and preservation hash. Existing assertion files, fixtures, earlier reviews and result reports remain unchanged. No starting file was deleted.

## Focused validation results

| Validation | Executed result |
|---|---|
| Current generated standalone and hosted copy tests | **36/36 cases; 930/930 assertions.** Requested A–H plus direct advice/scope variants, including weak-information-only comparisons, saved exact membership, nested/private sources, limited extraction and scope transitions that must preserve priority. |
| Native Firefox | **44/44 checks** in native headless macOS Firefox 158.0.1, actual standalone `file://` and loopback-hosted editions. Includes A–H/variants, native computed names, independent caution styling, private reveals, evidence sources, defaults and keyboard/focus. |
| Native accessibility names | **26/26 matching computed names** using Firefox's accessibility locator in the result subtree. Name expectations include the existing rendered label capitalization. The method uses the [WebDriver BiDi accessibility locator](https://www.w3.org/TR/webdriver-bidi/#type-browsingContext-AccessibilityLocator). No screen-reader acceptance is claimed. |
| Layout and real zoom | **18 measured layouts**, covering HTTP-only, multiple embedded findings and mixed scope transitions at 320px, plus actual 200%/400% tab zoom in a 1280px viewport. Effective widths 640px/320px; no tested page overflow. |
| Offline and destination privacy | Verified hosted readiness, stopped the local server, reloaded the cached application and inspected the final HTTP-only copy successfully. Zero additional served requests; no inspected-destination requests or unexpected page errors. Expected favicon CSP blocks are recorded separately. |
| Build wrapper | **3/3 command groups**, including **9/9** deterministic bundle, CSP, data, worker and stable-distribution checks plus current copy tests. |
| Relevant regression wrapper | **4/4 command groups**: current build/copy, exact previous preview, then the unchanged previous HTTP/structure and nested historical suites. The retained chain includes 134 HTTP/structure cases, 58 stress cases, 90 prominence cases, 118 follow-up cases and the 59-command acceptance wrapper. Nested totals are not added as independent evidence. |
| Current copy inventory | 23 families and 3,977 literal/text candidates across 20 sources; freshness verified separately from engine correctness. This supplements historical inventories without another broad UI audit. |
| Strict runtime preservation | Matching, generator and all pinned input hashes still match the preserved successful Deno 2.9.7 evidence. Strict generation was not rerun for this copy-only change. Installed Deno 2.9.8 and all strict pins remain unchanged. |

The previous assertions for generic advice and repeated visible scope phrases remain intact and run on their exact previous interface in disposable copies. Current copy expectations are separate. No historical assertion or result report was rewritten to pass the new presentation.

Twenty-four native before/after and zoom images are retained outside the repository; selected images are in [the screenshot gallery](STAGE6_FINAL_COPY_SCREENSHOTS.md). Build, native and retained-preview manifests are verified to agree.

## Acceptance and preview

No outstanding defect was found within these two requested refinements. Stage 6 is ready for the user's formal acceptance decision. VoiceOver, headful manual acceptance, Safari and physical-device testing remain unperformed; automated/browser-computed name checks do not replace them. Existing finite-reference, unsupported-method and resource-coverage limitations remain unchanged. No remote website, transmission, ownership, reputation or redirect was tested.

Working standalone preview:

`file:///private/tmp/oui-stage6-copy-_p1yayxm/preview/standalone/Offline_URL_Inspector.html`

Open the HTML preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/002-Offline_URL_Inspector.html` (SHA-256 `e4cf85d86c5861bd59dcfea74f9db92adbea743b53768a5f38e908f07c581238`). It is development-only and outside the checkout; operating-system temporary-file cleanup may eventually remove it. Stop here after reporting completion. No commit, push, merge, deployment or later-stage work is authorized.
