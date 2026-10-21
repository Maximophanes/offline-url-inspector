> Historical pre-correction highlight snapshot: `3.2.0-cf634806f70b4b3c`. The current corrected candidate `3.2.0-a67e4b13dd5fa5cd`, updated identities and new validation are in [AUDIT_CORRECTIONS.md](AUDIT_CORRECTIONS.md). Presentation source and styles remain unchanged.

# Version 3.2.0 — targeted hostname highlight and @ clarity

Date: 2026-10-21. Candidate: **3.2.0-cf634806f70b4b3c**. Starting candidate: `3.2.0-8cd78162d6718454`.

## Scope and state

Only the two approved application presentation changes were made. The existing two-part results, Technical Details, private evidence, counts, comparison attribution, limits and severity choices are preserved. Work remains on `dev/v3.2.0-embedded-url-analysis`, unstaged and uncommitted. HEAD and main remain `d9aed1dc333bb51d2126fa79059a839292b36615`. No branch creation, commit, push, merge, PR, publication or deployment occurred.

The user reports that the preceding candidate passed the initial representative Firefox tests, seven additional scenarios and an encoded embedded-URL @ scenario. Those are user-reported pre-change observations. This pass does not claim newly executed native Firefox or VoiceOver validation.

## Highlight design and safe rendering

`src/embedded-ui.js` marks explicit recovered-hostname tokens while building the supplemental explanation. It does not search/replace arbitrary words or comparison targets. Only complete HTTP(S) entries with reliable original hostname attribution receive the highlight. A matching word, a saved/expected comparison target, a relative reference, or an uncertain substring is not promoted into a highlighted destination.

The renderer uses `document.createTextNode` and the existing textContent-based element helper. Highlight nodes are plain `span` elements with no role, tabindex, href, event handler or hidden accessible label. The surrounding sentence remains ordinary accessible text in the existing polite atomic region. The renderer retains existing nodes when both the explanation and token annotations are unchanged, and updates styling correctly when reliability changes without changing the sentence.

The single scoped CSS rule uses existing tokens: `var(--mono)`, weight 600, lilac `var(--hover)` (`#d8b5f5`) over dark purple `var(--panel-raised)` (`#21162d`), small padding and a 3 px corner radius. There is no border, underline, hover treatment, pointer cursor or new panel. The hostname color remains lilac even when a supported structure finding already gives its heading caution emphasis. Wrapping, bidirectional isolation and cloned backgrounds preserve long text across lines.

Only reliable recovered-hostname mentions in consequential main supplemental findings are affected. Main Actual/Readable Hostname fields, comparison targets, Technical Details headings and unrelated application areas are unchanged.

## @ explanation and examples

**Test A** — `https://example.test/?next=https%3A%2F%2Fother.test`; Expected Hostname `example.test`:

- Before: `other.test` was ordinary text inside the supplemental sentence.
- After: the same sentence highlights only `other.test`; `example.test` stays plain comparison text. The original **Exact hostname match** conclusion and neutral supplemental severity remain unchanged.

**Test B** — `https://example.test/?next=https%3A%2F%2Fexample.test%40attacker.test%2Flogin`; Expected Hostname `example.test`:

- Before: “An embedded address has sign-in text before @; that text is not its destination hostname.”
- After: the existing address sentence highlights **attacker.test**, followed by **“The text before @ is not the website’s hostname.”** No raw userinfo is shown in the main result. The hostname is not repeated in that caution because it was just identified.
- The record-level caution uses the same ordinary explanation. Existing source/recovered values, parameter evidence and parsing/comparison metadata remain behind the unchanged explicit reveal.

When a same-host or other @ case has a reliable hostname that has not already been named, the same caution paragraph identifies that address's hostname with a highlight. It explains that this is an address with the @ structure, without inventing a mismatch. Additional such hostnames remain bounded and explicitly counted.

No userinfo is labeled a confirmed username, password or credential. The unchanged redirect qualification states that the link alone does not show whether the website will redirect there.

## Multiple, uncertain and unavailable results

The existing first-three off-host and visual-comparison summary bounds remain. Named off-host hostnames receive identical treatment; a remainder says how many more hostnames are available. Repeated occurrences of an identical hostname do not create extra main-summary list entries. A hostname can still occur in separate existing address and resemblance explanations, where each mention has a distinct purpose. Candidate/source-occurrence/hostname counts and full paginated evidence are unchanged.

An unresolved relative/scheme-free reference or uncertain URL-like substring receives no hostname highlight. Original-attribution uncertainty does not gain a highlight. A reliably recovered hostname may still be highlighted when a visual comparison is unavailable; the unsupported/unavailable qualification remains visible and is not turned into a negative comparison.

## Privacy, keyboard and unchanged security behavior

The change does not put raw userinfo, tokens, parameter names, full URLs or paths into the new summary markup. Conceal/reveal, private/outer-close clearing and reinspection behavior are unchanged. Reinspection removes stale highlighted spans and old revealed evidence. No links, focus stops, navigation, storage, logging or export sinks were added.

Only `src/embedded-ui.js` and `src/embedded.css` changed in application source. The template, main UI wiring, extractor/parser, Unicode/ASCII comparisons, references/storage, data, base theme, worker/offline logic, CSP policy, build/test tools and dependency lockfile are unchanged. Generated script/style hashes and worker identity change through the existing build process.

## Newly executed validation

Targeted first: `deno task test:embedded` — **146 checks / 533 assertions passed**, zero failures. This includes **21 new targeted checks** covering both supplied examples, reliable token selection, @ wording/privacy, same-host and mixed relationships, multiple/repeated hosts, expected/saved attribution, uncertain/relative/scheme-free data, unavailable comparisons, reliability changes, ordinary-word collisions, inert rendering, long-host CSS, keyboard/announcement semantics, stable rendering and stale-content reset.

Then `python3 -B tools/test_all.py` — **109,782 checks / 129,884 assertions passed**, zero failures. This includes all established regression/conformance/reference/worker/hosted/HTTP checks and the installed independent ICU diagnostic. All original fixture and 139 complete inspection-object pins remain intact; none were rewritten.

The build/copy inventory was regenerated using the existing process. Exact current-source and CSS correspondence, CSP hashes, normal worker identity, deterministic rebuild, unchanged protected baseline sources and the checksum inventory are verified by the existing integrity workflow. Current literal inventory: 2,670 candidates across 12 copy-supplying sources; code/data tokens remain distinguished from product prose.

## Actual browser evidence

[Current browser record](tests/hostname-highlight-browser-preview.json): **22 passing cases**, covering 11 representative states at measured **1280 px** and **390 px** widths. Both supplied examples retained Exact hostname match. Highlighted nodes had the expected text, remained inert and caused no horizontal page overflow. The long hostname wrapped into six inline fragments at 390 px; every fragment remained within the viewport.

Keyboard activation of View embedded-address details focused the expected disclosure. Explicit reveal showed synthetic private userinfo only in evidence; closing removed it. Reinspection removed old highlights and open evidence. Existing live-region semantics and text order are preserved; actual VoiceOver pronunciation/timing is not claimed. Browser script/style hashes match the final manifest. No warning/error console messages were observed.

Screenshots:

- [Test A, desktop](preview/v3.2.0-highlight-a-1280.png)
- [Test B, desktop](preview/v3.2.0-highlight-b-1280.png)
- [Test B, narrow](preview/v3.2.0-highlight-b-390.png)

This is actual hosted in-app evidence, not native Firefox, physical mobile or VoiceOver verification. The prior candidate's broader browser/manual observations remain historical in [EMBEDDED_EDITORIAL_REVIEW.md](EMBEDDED_EDITORIAL_REVIEW.md).

## Manual handoff

Ready for targeted Firefox review of A/B, long/multiple hostnames at narrow widths, selection/keyboard behavior and VoiceOver interpretation where available. The native standalone/hosted presentation of this newest build has not been tested by the agent. Earlier user-reported Firefox passes are retained without extending them to the changed highlighting.

No unresolved implementation or automated-test failure remains. All work stays local and uncommitted.

## Exact files changed in this targeted pass

This list is relative to the pre-pass candidate, not all earlier uncommitted development work.

- `CHANGELOG.md`
- `COPY_AUDIT.md`
- `EMBEDDED_EDITORIAL_REVIEW.md`
- `EMBEDDED_URL_REVIEW.md`
- `HOSTNAME_HIGHLIGHT_REVIEW.md`
- `README.md`
- `SECURITY_REVIEW.md`
- `SHA256SUMS`
- `TEST_RESULTS.md`
- `build-manifest.json`
- `preview/v3.2.0-highlight-a-1280.png`
- `preview/v3.2.0-highlight-b-1280.png`
- `preview/v3.2.0-highlight-b-390.png`
- `site/index.html`
- `site/sw.js`
- `src/embedded-ui.js`
- `src/embedded.css`
- `standalone/Offline_URL_Inspector.html`
- `tests/copy-inventory.json`
- `tests/embedded-results.json`
- `tests/embedded.mjs`
- `tests/hostname-highlight-browser-preview.json`
- `tests/release-checks.json`
- `tests/summary-results.json`

## Build and preservation record

A deterministic rebuild matched the final manifest. All 22 checked pre-change source/fixture/tool identities matched, including the template, main UI wiring, extractor, core/comparisons, storage, data, workers, base styles, harness and existing tools. The release verifier also preserves all 13 protected stable-baseline files and exact CSP/source correspondence. The checksum inventory covers 265 files. `git diff --check` passed.

| Edition | SHA-256 | Bytes |
|---|---|---:|
| standalone | `cd724e098efd18c6187d954e5b451d2516faa404447c0d38b976e990020662a4` | 2,343,875 |
| hosted | `cf634806f70b4b3c1bc3b9487b1ee959b498194dac3ac1f485e302e1a9591213` | 2,355,935 |
