> Historical editorial checkpoint: `3.2.0-8cd78162d6718454`. The current targeted hostname-highlight/@ candidate and newly executed evidence are documented in [HOSTNAME_HIGHLIGHT_REVIEW.md](HOSTNAME_HIGHLIGHT_REVIEW.md). Earlier counts, hashes and browser/manual limits below describe that preceding checkpoint.

# Version 3.2.0 — approved editorial and UX refinement

Review date: 2026-10-21. Current candidate: **3.2.0-8cd78162d6718454**.

## Scope and repository state

Implemented the separately approved presentation refinement on `dev/v3.2.0-embedded-url-analysis`, preserving the existing uncommitted candidate. HEAD and local main remain `d9aed1dc333bb51d2126fa79059a839292b36615`. No commit, staging, branch creation, push, merge, PR, publication or deployment was performed.

The earlier implementation report is retained as historical evidence in [EMBEDDED_URL_REVIEW.md](EMBEDDED_URL_REVIEW.md). This document and the current build manifest describe the refined candidate. The permanent [editorial standard](EDITORIAL_STYLE_GUIDE.md) is unchanged.

## 1. Comparison attribution

`EmbeddedUI.summary()` uses the existing comparison record's source and target. Initial-hostname, Expected Hostname and saved-reference comparisons are named accurately. When several sources refer to the same target, their source names are combined without losing attribution. Different target hostnames receive separate explanations.

For `https://web.test/?next=https://vveb.test` without a manual target or matching saved reference, the summary says `vveb.test may look like web.test (the link’s hostname)`. It does not invent an expected or saved target. All comparison algorithms and unavailable states are unchanged.

## 2. Representative before and after

Input: `https://example.test/?next=https%3A%2F%2Fother.test`; Expected Hostname: `example.test`.

Before: a prominent **Exact hostname match**, followed by a small paragraph, “Additional URL data contains an address on another hostname. No redirect was verified.” The other hostname was available only in Technical Details.

After, visible without opening Technical Details:

> **Exact hostname match**
>
> The hostname matches your expected hostname. This match does not compare the scheme, port, path or query.
>
> **Another web address found**
>
> This link also contains a web address for other.test, a different hostname from example.test.
>
> The link alone doesn’t show whether the website will redirect you there.
>
> View embedded-address details

The original hostname conclusion and its scope explanation are unchanged. The supplemental finding is a separate heading inside the existing polite, atomic result announcement region, following the initial finding in DOM and accessibility-tree order. Routine different-host evidence uses neutral styling; supported resemblance/structure findings and incomplete checks receive restrained contextual emphasis. No whole-link safety or redirect verdict is produced.

## 3. Three information levels

| Level | Refined presentation |
|---|---|
| Main result | Initial conclusion, consequential hostname-first supplemental finding, relevant uncertainty and incomplete-check reasons. Up to three recovered hostnames are named; additional hostname counts are explicit. |
| Technical Details | The retained **Embedded URLs & Redirect Clues** section shows count/type, hostname or qualified reference type, source location, meaningful relationships, cautions and unavailable checks. One section-level explanation states that navigation remains unverified. |
| Explicit private evidence | Source/recovered/normalized values, original/decoded parameter names, occurrence and equals separator, recorded transformations and representations, classification, nesting, scheme/effective port, comparison sources/methods and original hostname diagnostic prose. |

For the ordinary example, the record now contains `other.test`, `Found in: Query · parameter 1`, and `Link and expected hostname: Different from example.test`, followed by the private evidence disclosure. Matching initial/expected targets combine only when their displayed comparison semantics also agree. Both original records remain in expanded evidence. Different targets are never merged.

Uncertain boundaries, original-host attribution, incomplete hostname checks, DNS-validation cautions and unavailable visual comparisons stay with the finding. Routine processing metadata moves deeper. Original diagnostic prose is preserved rather than rewritten.

## 4. Copy decisions

| Previous wording | Refined treatment |
|---|---|
| Complete within supported scope | Checks finished for supported formats. |
| Partial analysis | Some embedded-address checks are incomplete. Relevant reasons accompany the result. |
| Unknown or unsupported interpretation | Cause-specific data-interpretation or comparison-unavailable wording. |
| 1 candidate identified | 1 embedded web address found, when there is exactly one complete HTTP(S) entry. Mixed and plural records use actual type names. |
| Fact about supplied URL data | Removed from ordinary rows; extracted-text versus uncertain-boundary evidence stays explicit deeper. |
| Complete absolute HTTP(S) URL | Ordinary “Web address (HTTP or HTTPS)”; precise classification remains in evidence. |
| Strict percent decoding, layer 1 | Processing method and ordered layers move into expanded evidence; strict versus form-style decoding and `+` handling are preserved. |
| Submitted / browser-normalized component | From the pasted link / From the browser-normalized link, in evidence. |
| Redirect-like name or path convention | A qualified navigation-related pattern in evidence, never proof of navigation or maliciousness. |
| Initial hostname: Different hostname | Actual target hostname and plain relationship; redundant initial/expected rows combine where appropriate. |
| Scheme / effective port | Separate precise fields in evidence; a meaningful difference notice remains in ordinary details. |
| Equals sign: Explicitly supplied | Equals separator: Present / Absent, in evidence. |
| Reveal full evidence | Reveal full values and evidence · may contain private data; accessible name identifies the address entry. |
| Show next 1 candidates | Show 1 more entry. Comparison pagination also handles singular/plural correctly. |

Established v3.1.2 primary titles, hostname terms, diagnostic codes/levels/prose, reference controls, help, title animation and base theme are preserved.

## 5. Coverage and limitations

The analyzer's four distinct states remain `complete`, `partial`, `unsupported` and `unavailable`. A neutral completed check is subordinate. Incomplete checks appear beside the main finding with applicable causes, without duplicating the heading. Unsupported interpretation is informational. Visual-comparison unavailability is never described as an encoded-payload failure or a negative lookalike result.

All current limitation families are retained: top-level attribution, processing failure, time, nesting, percent depth, node/text/value budgets, parameters, candidate occurrences, hostnames, comparisons, malformed decoding, Unicode validity, malformed embedded addresses, uncertain boundaries/attribution, hostname analysis/decoding, visual checks, expected/reference validation/list limits, structured data, other schemes and opaque data. Partial and unsupported causes coexist visibly when both occur. The main summary bounds the displayed reasons and points to the full list; individual reasons remain in Technical Details.

**Supported formats & limits** contains the comprehensive explanation: HTTP(S), at most two decoding layers, unresolved relative/scheme-free references, Base64, Base64URL, JSON, encrypted/proprietary formats, and unexamined server/page behavior. No new format is decoded. No specific encoding or maliciousness is inferred for opaque content. A negative supported-format result does not rule out hidden destinations.

## 6. Counts and pagination

Counts distinguish complete web-address entries, relative references, addresses without a scheme, uncertain possible web addresses and other-scheme entries. Multiple absolute entries also report source occurrences and distinct recovered hostnames. Source occurrences are counted by component, parent entry and recorded location; alternative interpretations can create several entries at one source occurrence. Counts never identify distinct or final destinations.

Address pagination remains five entries per action. Extra saved comparisons remain ten per action, behind the evidence disclosure. Both pagers retain focus on a surviving control and move focus to the first new heading/evidence row when the final control disappears. Programmatic actions do not steal unrelated focus. Completed lists omit redundant progress text. The ordinary hostname summary handles a one-hostname remainder naturally.

## 7. Privacy, security and accessibility

Full values and potentially sensitive parameter names are created only on explicit reveal, as inert text. Closing the private disclosure removes its body. Closing either containing Technical Details disclosure also closes and clears private supplemental evidence. Reinspection removes old entries and resets the supplemental and coverage disclosures. Original input and the existing Original URL field remain available; concealment is not secret detection or erasure from browser memory.

No recovered address becomes a link. No inspection data is sent to navigation/history, storage, worker/cache messages, logs or exports. CSP policy, dependency lockfile, Unicode data, reference schema and worker behavior are unchanged. This pass does not modify `src/embedded.js`, `src/core.js`, `src/references.js`, `src/presentation.js`, `src/hosted.js`, `src/sw.js`, `src/base.css` or `src/v3.css`.

The result uses one existing polite atomic live region, with initial then supplemental headings; detailed evidence stays outside it. Native disclosure controls, focused-state styling, keyboard interactions, bidirectional isolation, and wrapping remain. The details action opens both necessary disclosures and focuses their summary. Actual VoiceOver announcement timing/order remains a manual check; DOM/AX ordering is not a substitute.

## 8. Newly executed automated validation

Final `python3 -B tools/test_all.py`: **109,761 checks / 129,797 assertions passed; zero failures**. This includes build/copy inventory, all 17 Deno regression/conformance/HTTP tasks, and the installed independent ICU diagnostic. The final full pass followed the last browser-identified grammar correction.

`tests/embedded-results.json`: **125 checks / 446 assertions passed**, including **41 new focused editorial/UX checks**. These cover initial/expected/saved/combined attribution, distinct targets, exact/off-host, mismatch/embedded-expected, same-host/scheme differences, all five record types, repeated source occurrences, alternative representations, benign queries/anchors/OAuth, all four coverage states, simultaneous partial/unsupported causes, visual unavailability, error distinctions, real resource limits, zero/one/many grammar, both pagers' focus, source/parameter privacy, outer-close clearing, reinspection, DNS cautions, form-style decoding and analyzer immutability.

Established original-result/diagnostic/reference compatibility checks pass, including the 139 complete inspection-object pins and unchanged fixture files. No baseline fixture, expected core result or existing source pin was rewritten to obtain a pass. The test harness adds only an explicit `EmbeddedUI` test export. Trusted generated application code is executed in simulated DOM; this is not browser sandbox or Firefox evidence.

Builds use the existing Python process. Generated HTML, exact CSP hashes, normal worker build identity, manifest, copy inventory, release checks and checksum inventory are refreshed. The integrity verifier binds each edition to current source/CSS and preserves all 13 protected baseline files. The embedded analyzer additionally retains its pre-refinement SHA-256 pin in the focused suite.

Final integrity results: deterministic rebuild matched; all **260 checksum entries** verified; all **13 stable-baseline protected files** matched; all **18 checked pre-refinement source/fixture/tool identities** matched, including the embedded extractor, permanent editorial standard and build/test tools. `git diff --check` passed.

| Edition | SHA-256 | Bytes |
|---|---|---:|
| Standalone | `63996780e777c47bc2e4bfa5b0c05843645eca4a4e881c6b3f449453039e0790` | 2,341,587 |
| Hosted | `8cd78162d6718454d730f613317ba6465b83e5b636b8b83801d4bb79757de8b7` | 2,353,647 |

## 9. Actual browser observations

[Browser evidence](tests/embedded-editorial-browser-preview.json) is separate from automated simulated DOM reports. The hosted in-app browser rendered **18 representative scenarios at a measured 390 px width**, all passing their acceptance conditions without page overflow. These include all four states, initial/expected/saved/combined attribution, initial mismatch, same-host, different hosts, normal query/anchor/OAuth, opaque data, partial plus unsupported, resource exhaustion, mixed types and repeated addresses.

The final candidate's actual browser script/style hashes match the manifest. A measured **1280 px desktop layout** and **390 px narrow layouts**, with collapsed and expanded Technical Details, were visually reviewed. Keyboard reveal/concealment, sensitive parameter concealment, a long hostname, long decoded values, both one-item final pagination pages, focus transfer and reset were observed in the real in-app browser. Temporary comparison-test references were removed and the preexisting reference list was restored.

The preview server was then stopped. Cached reload reached **Offline ready** and inspected the representative link using the final script hash, preserving the existing reference count. This is actual cached startup with that server unavailable, not full internet disconnection. No warning/error console messages were observed. Destination-network tracing was unavailable; sink protections are supported separately by static and guarded simulated-DOM checks.

Screenshots:

- [Result](preview/v3.2.0-editorial-results.png)
- [Desktop expanded details](preview/v3.2.0-editorial-desktop.png)
- [Narrow result](preview/v3.2.0-editorial-narrow.png)
- [Narrow expanded details](preview/v3.2.0-editorial-narrow-details.png)

## 10. Changed files

| Files | Purpose |
|---|---|
| `src/embedded-ui.js` | Attribution, plain copy, three levels, coverage, counts, privacy reset and focus. |
| `src/template.html`, `src/embedded.css` | Companion heading within the existing result status region; concise section and scoped theme/responsive styling. |
| `src/ui.js` | Render the unchanged initial finding before updating the supplemental presentation. |
| `tests/embedded.mjs`, `tests/dom-support.mjs` | Targeted regression checks and the supplemental test export. |
| Current build, inventory, result, worker-identity, release-check and checksum outputs | Generated evidence bound to the refined candidate. |
| `tests/embedded-editorial-browser-preview.json`, four `preview/v3.2.0-editorial-*.png` files | Newly executed real-browser evidence. |
| README, CHANGELOG, COPY_AUDIT, SECURITY_REVIEW, TEST_RESULTS, original candidate report and this report | Current behavior/evidence, with earlier results clearly historical. |

## 11. Remaining manual gates and unresolved issues

Native Firefox access was attempted and denied because Computer Use permissions are not granted; geckodriver is absent from PATH. No native Firefox automation passed. The user reported the initial, pre-refinement standalone Firefox exact/off-host/reveal case working; that observation is retained with its limited scope and is not extended to the refined interface.

Before release review, manually check the refined standalone file and hosted candidate in Firefox: the representative dual finding, real narrow/zoom layouts, VoiceOver reading/announcement order, private reveal and outer-close reset, both final-page focus behaviors, unsupported versus partial cases, relevant Containers/file policies, reduced motion and full disconnected-network startup. No physical mobile-device result is claimed.

No unresolved implementation or automated-test failure remains. These native/browser-accessibility gates remain open. The candidate stays local, unstaged and uncommitted for review; no release action is authorized by this report.
