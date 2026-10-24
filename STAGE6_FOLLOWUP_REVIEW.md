# Stage 6 manual acceptance follow-up

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

Work remains on `dev/v3.3.0-automatic-lookalikes`, HEAD `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Stable public artifacts remain v3.2.0. All prior work is preserved; changes are local, unstaged and uncommitted. No branch/worktree, commit, push, merge, deployment or Stage 7/8 work occurred.

## Confirmed defects and wording

These were presentation defects; the supplied cases already had correct parsing, matching and extraction evidence.

| Case | Before | After |
| --- | --- | --- |
| `https://аpplе.com/` — Cyrillic а and е | The warning described the whole mixed-script `аpplе` span and every code point, including unchanged Latin letters. | **“Cyrillic letters ‘а’ and ‘е’ can resemble Latin letters ‘a’ and ‘e’.”** The existing check-address action follows. Full code points and official names remain in Technical Details. |
| `https://xn--pple-43d.com/` | Browser/Punycode and readable Unicode forms were labeled, but the readable name could look identical to the comparison name. | Both actual forms remain; the readable name has the adjacent text **“Contains Cyrillic letter ‘а’.”** The cue is associated through `aria-describedby` and does not rely on color. |
| `https://google.com@attacker.test/login` | “Text before @ is sign-in information, not the website name.” | **“Text before @ is not the actual hostname. Check the actual hostname above.”** `attacker.test` remains the actual hostname, with a strong syntax caution. No userinfo value is inserted into the result. |
| Supplied two-embedded-address URL | `attacker.test` appeared in Other findings and again in Also inside this URL; the warning itself repeated its hostname. | The primary `rnicrosoft.com` resemblance and secondary `attacker.test` syntax warning each appear once. The additional-host summary is absent when it would repeat them. The embedded `.test` popular-domain limitation remains. |

Embedded userinfo now says **“In this embedded address, text before @ is not the actual hostname.”** Adjacent legacy summary and diagnostic presentation use the same syntax-only interpretation. Original engine diagnostic records are preserved verbatim; their username/password syntax observation does not assert that a sign-in occurred.

Before/after structured captures are retained outside the repository at `/private/tmp/oui-stage6-followup-ubin1tpi/before-probe.jsonl` and `after-probe-final.jsonl`.

## General Unicode policy

The ordinary explanation identifies only verified differences. It omits unchanged intervening characters and code-point inventories. Repeated equivalent pairs appear once. Character/script identities come from matching pinned evidence records, with exact character/code-point validation. “Letter” is used only when the official recorded Unicode name identifies a letter; other identities use “character.”

Individual substitution descriptions require a whole-span supported comparison plus independent equality of the existing skeleton for every differing positional pair. This checks display claims; it does not add or change matching policy. Short supported one-to-many mappings remain sequences. Ambiguous, missing or long evidence uses a bounded whole-name explanation directing the user to Technical Details; it never invents missing scripts, names or alignments. At most four distinct supported pairs are enumerated. Longer or more complex cases retain concise qualified explanations and complete technical evidence.

Representative actual matches exercised in readable and A-label forms:

| Readable input | Ordinary evidence |
| --- | --- |
| `аpplе.com` | Cyrillic а and е can resemble Latin a and e; no intervening `ppl` inventory. |
| `gοοgle.com` | Greek ο can resemble Latin o; repeated occurrences do not duplicate the explanation. |
| `gοоgle.com` | Greek ο and Cyrillic о can resemble Latin o. Both scripts are verified. |
| `аррӏе.com` | Four distinct Cyrillic letters а, р, ӏ and е can resemble Latin a, p, l and e; repeated р is consolidated. |
| `ıcloud.com` | Latin dotless-ı can resemble Latin i. |
| `ՠicrosoft.com`, expected `rnicrosoft.com` | The Armenian character can resemble the Latin **sequence** `rn`; no one-to-one substitution is fabricated. |

Readable-hostname cues describe actual characters even when there is no positive popular-domain match. Their enumeration is bounded; incomplete identities fall back to a general Unicode/Technical Details cue. They do not label internationalized names unsafe. ASCII-only and unvalidated readable forms receive no fabricated representation or cue. Native browser hostname identity, actual Unicode glyphs and supplied input remain authoritative and unchanged.

The existing comparison disclosure retains full changed spans, code points, official names and scripts; Character Details retains all original mapping evidence. Existing collapsed defaults remain unchanged.

## Embedded consolidation and scope

Presentation groups candidates by canonical embedded hostname before choosing primary/secondary results. The strongest supported finding still leads. Its ordinary summary incorporates each distinct syntax warning and identifies additional comparison targets, while source labels, independent proof methods and full target comparisons remain in Technical Details.

The additional-host summary excludes names already displayed in the primary or the visible secondary findings. It still lists an additional distinct hostname, such as `mozilla.org`, when useful. Deliberate Technical Details retains every group and recorded-appearance count; its exact-occurrence buttons still reach the existing advanced evidence. Multiple occurrences, parents, representations, source positions, decoding evidence and values are unchanged. No confirmed redirect is inferred.

Adjacent validation covers an embedded visual resemblance plus userinfo both as primary and secondary; repeated and nested occurrences; an additional benign hostname; expected/saved exact matches alongside stronger warnings; supported expected/built-in source labels; and simultaneous userinfo, hidden-character, backslash and conflicting-parameter observations. These distinct warning types now accumulate instead of the previous first-warning-only conditional. Unsupported `.test` matching stays separate from complete extraction and remains visible after consolidation.

## Changes and preserved work

Relative to the independently captured **432-file** starting checkout, **11 existing files** changed:

- `src/results-presentation.js`: concise versus detailed Unicode explanations, bounded verified readable cues, syntax-only userinfo text and per-host embedded consolidation.
- `src/automatic-ui.js`: deliberate detailed Unicode rendering and omission of already displayed names from the additional-host summary.
- `src/ui.js`, `src/template.html`: the readable-hostname cue, its association and reinspection clearing.
- `src/presentation.js`: adjacent userinfo summary/diagnostic wording.
- `AUTOMATIC_FINDINGS.md`, `EDITORIAL_STYLE_GUIDE.md`, `README.md`, `DESIGN_NOTES.md`: current contract, test entry points and history links. The contradictory old extraction-JSON instruction is replaced with readable evidence guidance.
- `deno.json`, `tests/harness.mjs`: current follow-up commands and exact historical source restoration for unchanged assertions.

**14 files** were added: this review; the `followup-results`, `followup-firefox` suites and JSON reports; `followup-build.py`, `followup-regressions.py`, `followup-inventory.py` and their reports; `followup-source-boundaries.json`; `followup-validation-notes.json`; and `followup-integrity.json`.

The other **421 starting files** are byte-identical, with no starting deletion. This includes all matching/extraction/coordinator modules, reference storage/schema, datasets, generators, strict pins, existing tests/reports, stylesheets, worker, stable artifacts, checksums and deployment configuration. AGENTS.md is unchanged: its existing plain-language, verified-identity, evidence, deduplication and **Systematic Result & Messaging Validation** rules already cover the correction.

## Validation

| Check | Result |
| --- | --- |
| Current standalone/hosted follow-up suite | **118/118 tests; 1,781/1,781 assertions** |
| Current isolated build integrity | **9/9 checks**, including repeatable bytes, CSP, exact bundled data, worker and stable-artifact preservation |
| `deno task test:followup` | **3/3 command groups** |
| Follow-up regression runner | **4/4 command groups**, including the unchanged previous **59/59-command** runner |
| Previous acceptance interface in exact restored sources | **52/52 tests**, unchanged expectations |
| Preserved analysis suites within that runner | **109,056 tests**, no failures; unchanged 10,000-domain calibration |
| Current message inventory | **23 reviewed families**, **3,870 literal/text candidates**, **20 sources**; freshness check passes |
| Native Firefox 158.0.1/macOS | **40/40 checks**, standalone file and hosted loopback; **14 screenshots** |

Counts for nested suites are not added into an inflated grand total. Current message expectations are separately authored for this interface. Earlier literal assertions run against exact hash-restored earlier interfaces in disposable copies; none was edited, repinned or weakened. The seven file reversals independently reconstruct the captured before bytes.

Native checks cover all four supplied cases, repeated and mixed-script letters, manual sequence proof, actual browser/Punycode and Unicode forms, cue association/clearing, stronger original findings, secondary embedded consolidation, sensitive nested reveal/held-node cleanup, native disclosure defaults, source labels, keyboard focus, announcement privacy and unchanged storage schema. Screenshots were visually inspected. At 320px there is no page-wide horizontal overflow. Real tab zoom at 200%/400% gives 640px/320px inner width at 1280px and devicePixelRatio 2/4, without page-wide overflow.

The hosted cache was verified, its local server stopped, and reload/inspection succeeded with **zero additional served requests**. No inspected-destination request or unexpected page error was observed. Expected favicon CSP blocks and browser-process platform/remote-agent teardown warnings are distinguished from application errors; the browser process was not warning-free.

The installed Deno remains 2.9.8. Strict Deno 2.9.7 generator/foundation/matcher sources, pins and the previous successful strict report are byte-identical; strict generation was not rerun for this presentation-only correction. No runtime/dataset update, decoder expansion or RTL/Bidi matching work occurred.

`followup-validation-notes.json` records new-harness corrections separately: an incorrect disclosure ID and helper call/fixture shape, the parent-evidence label expectation, temporary probe config resolution, and sandbox restrictions on native launch/loopback. All final application and test checks pass.

## Preview and remaining limits

Open the fresh standalone preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/004-Offline_URL_Inspector.html` (SHA-256 `a6157a66b7588e1edc311d3aa5e5642e33a3fe651414d668d0c4f8901ba8e8ec`).

```text
file:///private/tmp/oui-stage6-followup-ubin1tpi/preview/standalone/Offline_URL_Inspector.html
```

The matching hosted preview is `/private/tmp/oui-stage6-followup-ubin1tpi/preview/site/`. Build, native and retained preview manifests agree. Before sources, logs and screenshots remain outside the repository; the isolated browser is stopped, its temporary profile/zoom helper removed, and local test servers stopped. macOS controls temporary-folder retention.

```sh
python3 -B tools/build.py --automatic-ui-preview --output-root /private/tmp/oui-stage6-followup-preview
deno task test:followup
python3 -B tests/followup-inventory.py --check
python3 -B tests/followup-regressions.py --development-root /private/tmp/oui-stage6-followup-preview
```

VoiceOver, physical devices, OS picker/download behavior and manual headful acceptance were not performed. A text cue and `aria-describedby` are implementation evidence, not screen-reader acceptance. Font-dependent resemblance, native IDNA differences, bounded extraction, finite matching coverage and unsupported full RTL/Bidi comparisons remain. Ambiguous evidence intentionally stays qualified. Work stops after this focused Stage 6 correction for user review.
