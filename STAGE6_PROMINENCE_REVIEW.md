# Stage 6 hostname spacing and universal warning hierarchy

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

Branch: `dev/v3.3.0-automatic-lookalikes`. HEAD: `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Stable v3.2.0 artifacts and all earlier Stage 2–6 work are preserved. Changes remain local, unstaged and uncommitted. No branch/worktree, commit, push, merge, deployment or Stage 7/8 work occurred.

Fresh standalone preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/007-Offline_URL_Inspector.html` (SHA-256 `34ab73802957d23661fd125fce25e143bc909de5e9475a094d5214cd06afe585`) · [Before/after screenshot gallery](STAGE6_PROMINENCE_SCREENSHOTS.md)

## Findings and corrections

The supplied cases already had correct hostname and comparison evidence. The presentation lost the semantic kind when rendering Other findings, applied the same ordinary paragraph style to all secondary entries, discarded secondary spelling suggestions and capped the remaining list at three. That cap could hide a fourth or fifth security warning. Coverage limitations could also receive amber coloring alongside an understated security finding.

The shared renderer now preserves each selected finding's kind. There is one primary result, with its existing larger title and three-pixel rule. Every independent secondary caution has a compact two-pixel amber rule, explicit **Caution** label, original-versus-embedded scope, title and explanation. There are no URL/hostname-specific style branches, new themes or new confidence classifications. Informational entries have an **Information** label and no amber rule. Ordinary limitations are muted and remain in their existing single location.

| Case | Before | After |
| --- | --- | --- |
| A: `https://google.com@attacker.test/login` | Prominent primary userinfo caution. | The same primary caution remains; the `.test` eligibility note uses the shared muted limitation treatment. |
| B: supplied URL containing `google.com@attacker.test` and `rnicrosoft.com` | Primary Microsoft lookalike warning; userinfo was a relatively inconspicuous paragraph. | The Microsoft resemblance remains primary. `attacker.test` has a compact **Caution · Embedded address** treatment. Its hostname is not repeated in Also inside this URL. |
| B plus embedded `googel.com` | The weak spelling finding was omitted from the secondary display. | Two security findings remain cautions. The spelling suggestion is separately labeled **Information · Embedded address**, with no amber rule. The `.test` coverage note remains muted. |
| Five distinct secondary userinfo warnings | The three-item cap hid two cautions. | All five remain visible. No warning is displaced by weaker information. |
| Two hostname representations | Approximately 0px between the browser hostname's box and the readable label. | **22px**, reducing to **20px** at the existing 620px breakpoint. Each label keeps its existing **7px** relationship to its own value. |

The IDN change is one shared spacing rule. It does not alter exact ASCII/Punycode or Unicode values, readable-character cues, typography, cards, borders or decoration around the hostname representations.

## Universal severity and ordering audit

The audit also found pre-existing presentation inconsistencies beyond the supplied examples: original HTTP and non-default port findings were marked informational despite the engine's existing `alert`/`warn` records; recorded embedded transport/validation diagnostics and malformed percent encoding could be absent from the ordinary findings. These are corrected through presentation of existing evidence, without changing the inspector, extractor, coordinator or matching policy.

| Finding family | Current treatment |
| --- | --- |
| Original/manual/saved/built-in/embedded visual resemblance | Primary or secondary caution, according to the existing comparison evidence and relative priority. |
| Structural hostname deception and Expected Hostname mismatch | Caution in either position; actual comparison sources remain in deliberate evidence. |
| Userinfo, hidden characters and backslashes | Scoped caution; distinct warnings for the same embedded hostname remain consolidated. |
| Encoded/DNS hostname validation and uncertain attribution | Existing original validation caution; recorded embedded validation evidence is surfaced as a scoped caution. |
| Unencrypted HTTP, non-default ports and malformed percent encoding | Caution reflecting existing engine records or exact parsed transport fields. The original records and severity levels are unchanged. |
| Weak spelling suggestions | Information, without amber caution treatment. |
| Invalid optional Expected Hostname | Field feedback and informational result. It ranks below actual security cautions, including HTTP/port findings. |
| Exact/saved/subdomain identities and completed negatives | Existing qualified neutral results. Stronger security findings still lead. |
| Unsupported, interrupted or unavailable analysis | Scoped technical limitation, separate from security cautions. Existing prominent incomplete-result fallback remains informational when no meaningful finding exists. |
| Routine preprocessing/normalization and ordinary character observations | Existing technical/informational evidence; no blanket promotion of every raw `warn` record. |
| Invalid inspection input | Existing error handling, with no fabricated hostname result. |

Priorities still select one strongest primary and deterministic order. HTTP/port priorities remain 50/45; malformed original percent encoding is 60. Embedded encoding/HTTP/port-only cautions rank 59/49/44, so an equivalent known property of the inspected URL leads over an address merely found inside it. Embedded syntax/validation warnings retain priority 75. Optional Expected Hostname validation information is 30 rather than 70, below actual cautions. No engine severity, stored result object, matching threshold or data eligibility rule was changed.

Security cautions have no ordinary three-item cap. Up to three informational entries appear ordinarily; further comparison information remains in Advanced diagnostics with a direct explanatory note. Neutral secondary successes remain quiet. The additional-host summary excludes every hostname already displayed in the primary or visible secondary findings. Embedded spelling has explicit embedded scope and follows the same grouping policy. Distinct targets, comparison sources/proofs, parent relationships and occurrences remain in deliberate Technical Details/advanced evidence. No recovered address is called a confirmed redirect.

Embedded diagnostics are compact, sometimes shared records. Group-level descriptions report only supported observations for that hostname. Port cautions use each absolute candidate's exact native effective port and scheme, excluding default 443/80; they do not copy a port from shared hostname analysis. Repeated HTTPS/default-port, HTTPS/9090 and HTTP/default-port variants are tested together: one hostname summary retains HTTP and port 9090 evidence without false warnings about ports 443 or 80. Existing extraction/matching coverage bounds remain unchanged.

## Design, accessibility and privacy

The user confirmed there is one existing **combined Blackberry & Amethyst palette**, with no separate themes or theme switch. Base palette tokens, base/v3/embedded stylesheets, gradients, title animation, reduced-motion rules and typography are byte-identical. The targeted rules in `src/automatic.css` reuse the existing amber/muted/ink tokens. No theme controls or unrelated design changes were introduced.

Visible caution and scope labels supplement color. The primary title remains larger than secondary titles. Secondary entries retain native list semantics and introduce no extra live regions, alert roles, focus stops or controls. Native keyboard inspection and disclosure operation retain focus. This is implementation/native-browser evidence, not VoiceOver acceptance.

New content uses existing inert text-node rendering and visible-control handling. Full addresses, userinfo, parameter names, credentials and tokens retain their deliberate reveal boundaries and cleanup. Source labels, storage/schema and backup behavior remain unchanged. The application still makes no inspected-destination requests, stores no inspection history and introduces no telemetry or remote dependency.

AGENTS.md now explicitly states that priority cannot strip independent secondary caution treatment and that the approved palette is a single combined design without separate themes/switch. Existing systematic result/message validation and evidence/privacy requirements remain intact.

## Validation

| Check | Final result |
| --- | --- |
| Current generated standalone/hosted hierarchy suite | **90/90 tests; 1,012/1,012 assertions** |
| Unchanged previous follow-up suite against the current interface | **118/118 tests; 1,781/1,781 assertions** |
| Current isolated build integrity | **9/9 checks**, including repeatability, CSP, exact data/worker binding and stable artifact preservation |
| `deno task test:prominence` | **3/3 command groups** |
| Current + preserved history regression wrapper | **5/5 command groups**, including the prior follow-up wrapper and its preserved **59/59-command** acceptance/analysis/history runner |
| Current message inventory | **23 families**, **3,913 literal/text candidates**, **20 reviewed sources**; freshness check passes |
| Native Firefox 158.0.1/macOS | **128/128 checks**, **23 retained unedited screenshots** |

Nested totals are not summed as independent grand totals. Earlier tests, fixtures and result reports are unchanged. Exact source reversals reconstruct their matching earlier interfaces only in disposable test copies; no assertion was repinned or weakened. Current semantic expectations are separately authored for this interface.

The scenario matrix covers multiple ASCII/Unicode visual findings; manual and built-in targets; original and embedded userinfo/structure; hidden characters/backslashes; invalid encoded/DNS hostnames; malformed encoding; HTTP/ports; Expected Hostname mismatch and invalid optional input; saved visual/exact/subdomain comparisons; repeated/nested/multiple addresses; five secondary cautions; weak spelling; neutral negatives; partial extraction; and unsupported/unavailable analysis. Every selected caution is counted against its rendered ordinary caution treatment, in addition to independently specified scenario expectations.

Native before/current standalone comparisons include both supplied cases and IDN spacing at wide and 320px widths and actual 200%/400% tab zoom. The current hosted edition repeats these checks and the full finding matrix. At 1280px, real zoom reports 640px/320px inner width and devicePixelRatio 2/4. There is no page-wide horizontal overflow. IDN gaps measure 22px/20px within normal subpixel rounding; each label-to-value gap remains 7px. Native computed styles confirm the primary three-pixel versus secondary two-pixel rules, smaller secondary titles, explicit labels and separate muted information/limitations. Screenshots were visually inspected.

The hosted cache was verified, its local server stopped, and reload/inspection succeeded with zero additional served requests. No inspected-destination request or unexpected page error was observed. Expected favicon CSP blocks and Firefox-process platform/remote-agent messages remain distinct; the browser process is not claimed to be warning-free.

`tests/prominence-validation-notes.json` records the implementation-time corrections: exact pixel equality was replaced by a 0.1px tolerance for Firefox subpixel rounding; the new embedded diagnostic integration initially used the wrong record shape and was fixed to the actual retained diagnostics/native port fields. These failures were resolved before the final full runs; no old expectation changed.

## Files and preservation

Relative to the independently captured **446-file** starting state, **11 existing files** changed:

- `src/automatic.css`: shared IDN spacing and semantic secondary finding styles.
- `src/automatic-ui.js`: shared kind/scope labels, uncapped cautions, visible weak information and muted limitations.
- `src/results-presentation.js`: explicit embedded spelling scope, existing security diagnostic presentation, exact port evidence and optional-field ordering.
- `src/template.html`: coverage retains its neutral small-text class.
- `AGENTS.md`, `AUTOMATIC_FINDINGS.md`, `EDITORIAL_STYLE_GUIDE.md`, `README.md`, `DESIGN_NOTES.md`: permanent rule, current contract and review/reproduction links.
- `deno.json`, `tests/harness.mjs`: current commands and six exact historical source restoration boundaries.

**16 files** were added: this review; `STAGE6_PROMINENCE_SCREENSHOTS.md`; `tests/prominence-cases.mjs`; the prominence DOM/native suites and their reports; the prominence build/regression/inventory wrappers and their reports; source boundaries, validation notes and final integrity report.

The other **435 starting files** are byte-identical, with no starting deletion. This includes matching, extraction, coordinator, reference storage/schema, Unicode/reference datasets, generators, strict pins, previous tests/reports, stable v3.2.0 artifacts, worker, checksums and deployment configuration. The installed Deno remains 2.9.8 with the same hash. Strict Deno 2.9.7 reproduction sources, pins and the preceding successful strict report are preserved; generation was not rerun for this presentation-only correction.

## Preview and remaining limits

```text
file:///private/tmp/oui-stage6-prominence-4w8i9cms/preview/standalone/Offline_URL_Inspector.html
```

The hosted preview is `/private/tmp/oui-stage6-prominence-4w8i9cms/preview/site/`. Before sources, logs, the exact before preview and screenshots remain outside the repository. Current build/native/retained-preview manifests agree. The owned browser is stopped, its disposable profile/zoom helper removed and local servers stopped. macOS controls temporary-folder retention.

```sh
python3 -B tools/build.py --automatic-ui-preview --output-root /private/tmp/oui-stage6-prominence-preview
deno task test:prominence
python3 -B tests/prominence-inventory.py --check
python3 -B tests/prominence-regressions.py --development-root /private/tmp/oui-stage6-prominence-preview
```

VoiceOver, physical-device and manual headful acceptance remain unperformed. Existing bounded extraction, finite matching coverage, native IDNA differences, font dependence and unsupported full RTL/Bidi comparisons remain. More genuine independent warnings can lengthen the ordinary result; this intentionally preserves their visibility instead of silently dropping them. Weak informational output remains bounded. Work stops here for user review.
