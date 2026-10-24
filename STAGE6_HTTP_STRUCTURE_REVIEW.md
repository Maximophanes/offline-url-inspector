# Stage 6 final HTTP caution and structural wording review

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

The requested refinements are implemented for final user review. Branch remains `dev/v3.3.0-automatic-lookalikes`, HEAD `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Stable v3.2.0 and all preceding development work are preserved. No commit, staging, push, merge, deployment, branch/worktree creation or Stage 7/8 work occurred.

## Confirmed defects and exact changes

The engine already recorded HTTP correctly. The presentation policy merged all cautions for one hostname/scope into the strongest hostname finding. This made a distinct transport concern ordinary text within a lookalike explanation, despite the universal secondary-warning rule.

Presentation candidates now distinguish hostname identity from transport. Equivalent identity mechanisms still consolidate; independent HTTP cautions retain their own finding at the **same existing priority** (50 original / 49 recovered). They use the existing secondary caution label and two-pixel amber rule when a stronger finding leads. HTTP is removed from the identity explanation, so it appears once per affected hostname/source scope. Repeated recovered occurrences do not create repeated HTTP warnings. Distinct addresses and original-versus-recovered scope remain explicit.

Embedded HTTP cautions identify their hostname even when that name also has the primary identity warning. This prevents an intervening finding about another embedded address from making transport attribution ambiguous. Relevant Unicode/Punycode context appears once per hostname across ordinary findings. Generic opening/sensitive-information advice still appears once. Full occurrence/source/parent evidence remains deliberate and unchanged.

| Input | Result |
|---|---|
| `http://rnicrosoft.com:8080/login` | Primary Microsoft resemblance; separate secondary **Caution · This link** for HTTP; port 8080 remains Information. |
| `http://example.com/login` | HTTP remains the primary caution because there is no stronger supported warning. |
| `https://example.com:8080/login` | Port information; no invented HTTP caution. |
| `https://rnicrosoft.com:8443/login` | Primary resemblance; port information; no HTTP caution. |
| Recovered HTTP plus visual, structural, userinfo or other identity evidence | Stronger identity warning remains primary; independently styled HTTP caution identifies the recovered hostname. |
| Repeated or mixed HTTP/HTTPS recovered occurrences for one hostname | One scoped HTTP caution says an address inside the link uses HTTP; it does not imply every occurrence does. Occurrences and schemes remain in exact evidence. |

Original HTTP wording is unchanged: **“This link uses unencrypted HTTP”** and **“HTTP does not encrypt information sent to this website.”** Its placement changes when another finding is stronger. Recovered HTTP uses **“Unencrypted HTTP inside this link · [hostname]”** and **“An address inside this link uses HTTP, which does not encrypt information sent to that website.”** These statements describe parsed URL syntax and HTTP's transport property. They do not claim that a connection was established or tested.

## Structural explanations

The existing detections and PSL boundaries were correct. Ordinary results said “The hostname is under com.github.io,” requiring users to interpret a registrable-domain boundary.

The generalized ordinary explanation is now:

> Having google.com inside this longer hostname does not make it that domain or one of its subdomains.

The comparison name comes from supported evidence. The same rule applies to other references, ICANN and PRIVATE suffixes, original and recovered addresses, and supported manual placement comparisons. There is no brand, hostname, URL or suffix exception. No ownership claim is inferred from the reference name.

Technical Details retains the exact registrable domain, suffix rule, PRIVATE/ICANN explanation and supported mechanism. For example, `google.com.github.io` still has boundary `com.github.io` under PRIVATE rule `github.io`; `google.com.blogspot.com` still has `com.blogspot.com` under PRIVATE rule `blogspot.com`. These values are not substituted or guessed for presentation.

Fifteen independently authored boundary controls run for both original and recovered scopes in both editions. They include regular `.net`, `github.io`, `blogspot.com`, `pages.dev`, `s3.amazonaws.com`, multi-label reference names, legitimate `accounts.google.com`/`accounts.google.co.uk`, legitimate private-tenant membership, and partial-name negatives `notgoogle.com.github.io`/`google.comgithub.io`. Positive placement evidence remains positive; legitimate and partial-name controls remain negative. Detailed expectations remain in the preserved `tests/stress-cases.mjs`.

## Generalization and preservation

Only two product sources changed:

- `src/results-presentation.js`: presentation-family grouping, separate evidence-driven recovered HTTP candidate, and shared ordinary structural wording; detailed structural evidence is retained.
- `src/automatic-ui.js`: explicit hostname attribution for independent recovered concerns and deduplicated ordinary Unicode/Punycode context.

No CSS, template, matching algorithm, priority values, data, schema, storage behavior, resource budget, parser, extractor, coordinator, source pin or generator changed. The single combined Blackberry & Amethyst palette, typography, existing hostname spacing and disclosure defaults are byte-identical. Safe text rendering, source concealment/cleanup and reference safeguards remain in place. AGENTS.md already states the universal rule and was left unchanged.

Current documentation changed in `AUTOMATIC_FINDINGS.md`, `EDITORIAL_STYLE_GUIDE.md`, `DESIGN_NOTES.md`, `README.md`. `deno.json` routes current UI aliases through the new isolated suite. `tests/harness.mjs` adds a hash-checked reversal layer for unchanged historical assertions. New test/evidence files use the `tests/http-structure-*` prefix. The exact file inventory and preservation hashes are in `tests/http-structure-integrity.json`.

## Executed validation

| Validation | Actual result |
|---|---|
| Generated standalone + hosted message checks | **134/134 cases; 1,510/1,510 assertions.** Includes 27 transport combinations per edition, default/nondefault ports, 15 boundary controls in both scopes, manual comparison sources, privacy, combined visual/structural proof, repeated/nested addresses and limited extraction. |
| Native Firefox | **133/133 checks**, native headless macOS Firefox 158.0.1, actual file and loopback-hosted editions. Includes three verified before captures, actual computed secondary caution borders/labels, both scopes, source attribution, private reveal cleanup, collapsed defaults and keyboard/focus behavior. |
| Responsive / actual zoom | 18 measured layouts across the two editions: 320px viewport and 1280px viewport at real 200%/400% tab zoom, each with three meaningful warning combinations. Effective widths 640px/320px at 200%/400%; no tested page overflow. |
| Offline / network | Verified hosted cache readiness, stopped the local server, reloaded the cached app and inspected the supplied HTTP lookalike successfully. Zero additional served requests. No inspected-destination requests or unexpected page errors; expected favicon CSP blocks are recorded separately. |
| Current build wrapper | **3/3 command groups**, including 9/9 deterministic build, CSP, worker, data-binding and stable-distribution checks plus current messages. |
| Relevant regression wrapper | **6/6 command groups.** Current build/messages; exact previous stress preview with all unchanged 58 stress cases; exact earlier preview and nested prominence/follow-up/acceptance/historical suites. The retained chain includes 90 prominence cases, 118 follow-up cases and the 59-command acceptance wrapper. Nested totals are not added as independent checks. |
| Systematic message inventory | 23 families, 3,946 literal/text candidates across 20 sources; freshness checked separately from engine correctness. |
| Strict reproduction preservation | All generator/source/input-data hashes still match the preserved successful Deno 2.9.7 evidence. Strict generation was **not rerun** for this presentation-only change; installed Deno 2.9.8 and all strict pins are unchanged. No runtime download or dependency installation was needed. |

Earlier assertions that expected HTTP within the main paragraph and the former structural sentence are preserved unchanged. They run on their exact historical interfaces in disposable copies. Current expectations separately test the corrected interface. All previous result reports remain byte-identical; new reports record this task only. One initial new test selected a port row case-sensitively and missed the existing capitalized embedded title; the selector was corrected without changing product severity. During screenshot review, embedded HTTP hostname attribution was tightened and the final current/native/regression checks were rerun.

Twenty-five native images, including before/after captures, are retained outside the repository. See [the screenshot gallery](STAGE6_HTTP_STRUCTURE_SCREENSHOTS.md). These are actual native Firefox captures; DOM results are not substituted for browser evidence.

## Remaining limits and preview

This correction is ready for final Stage 6 user review. User approval is not inferred. Native evidence is headless Firefox; VoiceOver, headful manual acceptance, Safari and physical devices were not tested. Keyboard/focus checks do not establish screen-reader acceptance. No destination connection, contents, ownership, reputation or redirect was tested. Existing finite-reference, unsupported-comparison and resource-coverage limits remain visible and unchanged. No new known blocker was found within the tested scope.

Fresh standalone preview:

`file:///private/tmp/oui-stage6-http-gmdl5j5u/preview/standalone/Offline_URL_Inspector.html`

Open the HTML preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/005-Offline_URL_Inspector.html` (SHA-256 `741d062a9e0bd703a8148e5735210722e9dba838d3086e26f6d9ed8d4095cfde`). The preview is development-only, outside the checkout, and may eventually be removed by operating-system temporary-file cleanup. Build/native/retained preview manifests are verified to agree. Stop here for final user review; everything remains local, unstaged and uncommitted.
