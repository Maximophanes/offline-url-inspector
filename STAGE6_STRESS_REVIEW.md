# Stage 6 consolidated stress correction

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

This correction is ready for the user's final Stage 6 review. It does not constitute release approval. The working branch remains `dev/v3.3.0-automatic-lookalikes`, HEAD `664cc58bf67a2127d0523adec9f1d80c6edd656e`; the stable v3.2.0 distribution is preserved. All development work remains local, unstaged and uncommitted. Stage 7 and Stage 8 have not begun.

## Confirmed defects and already-correct findings

| Scenario | Investigation and resulting behavior |
|---|---|
| 1. Original Microsoft resemblance with userinfo | The native hostname and `rn`/`m` resemblance were correct. The old userinfo explanation pointed vaguely “above,” and separate mechanisms competed as separate findings. One original-host finding now explains the resemblance and `@` in separate thoughts, naming the actual hostname directly. |
| 2. Original resemblance plus a recovered userinfo address | Both detections were correct. The recovered warning remains a recognizable secondary caution with explicit inside-this-link scope. It does not repeat generic opening advice. |
| 3. Four distinct recovered visual/structural findings | Findings and scope were correct. All four cautions remain visible. Readable Unicode now accompanies relevant recovered A-label hostnames, with verified character evidence and browser/Punycode context. |
| 4. Repeated identical recovered address | Occurrence preservation was correct. One ordinary hostname finding retains “Found 2 times in this link.” Exact source/parameter/parent evidence remains deliberately expandable. |
| 5. Recovered `microsoft.com@rnicrosoft.com` | The actual recovered hostname and resemblance were correct. Separate visual and userinfo thoughts now share one finding; no userinfo value is disclosed. |
| 6. `http://rnicrosoft.com:8080/login` | Resemblance and unencrypted HTTP cautions were correct. Port 8080 was disproportionately promoted to caution. It is now informational, while the resemblance and HTTP explanations remain in the primary warning. |
| 7. `https://google.com.github.io/` | The pinned PSL and registrable domain were correct. The old documented structural policy intentionally excluded the crossing label sequence, creating a meaningful coverage gap. The bounded v2 correction below now detects it. |
| 8. `https://%72nicrosoft.com/login` | Native normalization to `rnicrosoft.com` and the Microsoft resemblance were already correct and remain so. The original encoded URL stays available in advanced original-text evidence. Supported normalization does not create another prominent warning. Malformed encodings remain errors or qualified cautions. |

The latest request supplied exact URLs for scenarios 6–8 and descriptions for 1–5. The latter are tested using explicitly authored representative URLs in `tests/stress-cases.mjs`; they are not claimed to reproduce an unavailable recording byte for byte.

The systematic audit also found an adjacent grouping defect: choosing only the first proof for one comparison could omit the ordinary structural explanation when the same pair had both visual and structural evidence. `google.com.goog1e.com` now shows both thoughts within one warning. Equivalent built-in/Expected Hostname/saved structural evidence is described once, while its separate sources and methods remain in Technical Details. Recovered syntax and HTTP mechanisms also retain separate thoughts rather than becoming a single dense paragraph.

## Test 7: evidence, root cause and bounded policy change

The raw pinned PSL contains `github.io` in its PRIVATE section. Its existing boundary lookup returns public suffix `github.io`, registrable domain `com.github.io`, and subdomain `google`. No suffix data, suffix interpretation or boundary code was changed.

Under `full-domain-conservative-v1`, structural windows had to end wholly before the registrable domain. `google.com.github.io` has only one label before that domain, so the two-label `google.com` reference was never requested. The old synthetic fixture explicitly expected this exclusion. This was a documented policy limitation, rather than index corruption, missing Google data or UI suppression. The ordinary completed-negative result exposed its security impact.

The current policy is explicitly versioned `full-domain-conservative-v2`. A complete reference-label sequence must still **start in the genuine subdomain**, but may end on the actual registrant label. It cannot enter the actual public suffix or start within the actual registrable domain. This rule applies equally to ICANN and PRIVATE suffixes and does not match arbitrary substrings. It is justified by the independently different registrable domain, without asserting malicious intent or ownership.

| Hostname | Pinned rule / section | Actual registrable domain | `google.com` structural result |
|---|---|---|---|
| `google.com.github.io` | `github.io` / PRIVATE | `com.github.io` | Present; newly covered |
| `google.com.blogspot.com` | `blogspot.com` / PRIVATE | `com.blogspot.com` | Present; newly covered |
| `google.com.pages.dev` | `pages.dev` / PRIVATE | `com.pages.dev` | Present; newly covered |
| `google.com.s3.amazonaws.com` | `s3.amazonaws.com` / PRIVATE | `com.s3.amazonaws.com` | Present; newly covered |
| `google.com.example.net` | `net` / ICANN | `example.net` | Present; existing behavior |
| `google.com.tenant.github.io` | `github.io` / PRIVATE | `tenant.github.io` | Present; existing behavior |
| `google.com.com` | `com` / ICANN | `com.com` | Present; newly covered |
| `accounts.google.com` | `com` / ICANN | `google.com` | Absent; legitimate reference subdomain |
| `notgoogle.com.github.io` | `github.io` / PRIVATE | `com.github.io` | Absent; no complete reference-label sequence |
| `google.comgithub.io` | `io` / ICANN | `comgithub.io` | Absent; no complete reference-label sequence |

Fifteen independent boundary expectations additionally cover `google.co.uk.github.io`, `amazon.co.uk.pages.dev`, `accounts.google.co.uk`, a misleading private-suffix-looking prefix under `.net`, and repeated legitimate private-tenant membership. Every expectation checks the exact raw PSL section/rule as well as the compiled boundary and result; expectations are not generated by the matcher being tested.

At most one additional window per indexed reference-label count is examined. Candidate IDs (32), verified pairs (32 per hostname / 256 per inspection), spelling traversal limits and the 50ms cooperative budget are unchanged. Existing positive scopes remain unchanged. Newly crossing occurrences carry `complete-label-sequence-crossing-registrant-boundary` evidence. No result schema version or source dataset changed.

Only the derived index policy identifier and manifest policy/source/hash metadata were regenerated, under verified Deno 2.9.7. All index keys, buckets, references and lookup contents are identical after excluding `policyId`. Current index: 494,484 bytes, SHA-256 `f34828ae9faa621a83d0d480a888b28985198bbcd90bd3763d18135fd23d0c9e`. The PSL, Majestic records/source snapshots, Unicode data, foundation, notices, generator code and strict runtime pins remain unchanged.

## Wording, severity and redundancy

| Before | After |
|---|---|
| “Text before @ is not the actual hostname. Check the actual hostname above.” | “Text before @ is not the website name. The actual hostname is rnicrosoft.com.” The hostname comes from the applicable original or recovered analysis. |
| “Caution · Embedded address” / “Caution · Inspected URL” | “Caution · Inside this link” / “Caution · This link.” |
| “Comparison evidence” | “Name comparisons.” |
| “Found in link parameters” repeated below a recovered finding | Removed from ordinary findings. Relevant repeated-occurrence counts remain; exact locations stay technical. |
| Repeated “Check the address before opening it or entering information” | One primary advice thought: “Check the website name before opening the address or entering sensitive information.” Secondary findings provide evidence rather than repeat this instruction. |
| Separate warning paragraphs for one hostname's visual / userinfo / HTTP observations | One scoped hostname warning with separate supported mechanism thoughts. Distinct hostnames retain independent caution treatment. |
| Nondefault port caution: “Check that this port is expected.” | Information: “Some websites use different ports. A port number alone does not establish deception.” The actual port remains visible. |
| Structural explanation referring to an unnamed earlier reference | “The hostname is under com.github.io. google.com is part of a longer name.” |
| Recovered `xn--` form requiring interpretation | Readable Unicode in the comparison line, verified character explanation, and “Browser hostname (Punycode): …” context. |

Representative multi-character evidence remains concise and verified: `аpplе.com` uses Cyrillic `а` and `е`, which can resemble Latin `a` and `e`. Code points and fuller sequence/method evidence remain technical. Single-character `xn--pple-43d.com` retains both its readable `аpple.com` form and its exact browser hostname. No ambiguous one-to-one mapping is invented.

The primary finding has the greatest emphasis. Other independently meaningful cautions retain their existing amber rule and explicit caution label. Weak spelling, ports and ordinary technical limitations are not promoted. Information remains bounded to three ordinary rows; security cautions are uncapped. Generic advice is consolidated, not every caution indiscriminately converted to information. Raw diagnostic levels and full engine evidence are preserved.

The single combined Blackberry & Amethyst palette, typography, native disclosure interactions and existing 22px/20px hostname-representation spacing are preserved. No theme switch or new card system was introduced. Advanced Diagnostics and its independent subsections remain collapsed by default. Recovered addresses are observations in URL text, not confirmed redirects.

## Exact changed files

Six existing runtime/presentation sources changed: `src/lookalikes.js`, `src/results-presentation.js`, `src/automatic-ui.js`, `src/automatic.css`, `src/template.html`, `src/presentation.js`. Only `lookalikes.js` changes matching policy; the other five change presentation and wording.

Two derived assets changed: `data/lookalikes/index.json`, `data/lookalikes/manifest.json`. Task/history integration changed in `deno.json` and `tests/harness.mjs`. Current guidance changed in `AGENTS.md`, `AUTOMATIC_FINDINGS.md`, `LOOKALIKES.md`, `DESIGN_NOTES.md`, `EDITORIAL_STYLE_GUIDE.md`, `README.md`.

New evidence is limited to this review, its screenshot gallery and the `tests/stress-*` files. `tests/stress-integrity.json` records the exact starting-file comparison and new-file inventory. No earlier assertion, fixture, review or result report was overwritten. No files were deleted from the starting checkout.

## Executed verification

| Check | Result / scope |
|---|---|
| Current generated message tests | 58/58 scenarios across standalone and hosted editions; detailed assertion count in `tests/stress-results.json`. Eight scenario families plus transport/ports, combined mechanisms, Unicode, optional references, source deduplication, weak information, coverage, malformed encodings and privacy cleanup. |
| Native Firefox | 70/70 checks in macOS Firefox 158.0.1, native headless process with a disposable profile; both actual file and loopback-hosted editions. Fifteen boundary controls per edition, port matrix, combined warnings/weak information, source/storage/reveal behavior, keyboard focus, private announcements, collapsed defaults and page/network checks. |
| Responsive / real zoom | 320px viewport; 1280px viewport at actual 200% and 400% tab zoom. Measured effective widths 640px and 320px, no page horizontal overflow in tested results. A temporary profile-only helper set real tab zoom. |
| Offline | Hosted service-worker readiness verified; server stopped; cached reload and structural inspection succeeded with zero additional served requests. No inspected-destination requests or unexpected page errors. Expected favicon CSP blocks are recorded separately. |
| Build wrapper | 3/3 command groups; includes 9/9 deterministic bundle/CSP/worker/stable-distribution checks and current message tests. |
| Current + historical regression wrapper | 6/6 command groups. Current v2 engine, UI and 10,000-member calibration, then exact prior UI/policy reconstruction and all nested original regressions. The preserved chain includes 90 prominence cases, 118 follow-up cases and the 59-command acceptance wrapper. Nested/repeated totals are not added as independent evidence. |
| Strict Deno 2.9.7 | 6/6 commands: foundation 162/162 (49,099 assertions), current structural engine 27/27 (19,335 assertions), strict index check, two independent byte-identical generations, and unchanged v1 matcher 119/119 (38,859 assertions) on exact v1 inputs. Installed Deno 2.9.8 was not changed. |
| Calibration | Same 10,000 disjoint domains: 2 visual notices, 5 weak spelling findings, 0 structural findings and 0 unsupported/incomplete comparisons. The 0.02% visual corpus notice rate is unchanged; it is not a real-world false-positive or phishing accuracy estimate. |
| Systematic message inventory | 23 families across 20 sources; current inventory freshness checked separately from engine correctness. |

The v1 fixture that intentionally excludes `google.com.github.io` is preserved unchanged. Historical assertions run on exact historical sources/assets in disposable copies, with SHA-256-checked reversals. Independent v2 tests assert the changed policy. This is an explicit policy change, not a silent rewrite of old expected results. Ordinary historical tasks expecting v1 should not be run directly on v2 inputs; the current regression runner supplies their correct context.

Twenty-two current native screenshots are retained outside the repository. Selected images and zoom captures are in [the screenshot gallery](STAGE6_STRESS_SCREENSHOTS.md). Initial implementation/test issues and their corrections are recorded in `tests/stress-validation-notes.json`; final reports contain no failures.

## Remaining limits and handoff

No known blocker remains for the tested structural pattern or the requested presentation correction. Final manual approval remains the user's decision. Native evidence is headless Firefox, not headful acceptance, VoiceOver, Safari, or physical-device testing. Automated keyboard/focus checks do not establish screen-reader acceptance.

The reference list is finite and pinned; unsupported suffixes, RTL visual comparisons and resource exhaustion retain explicit scoped coverage limits. Matching is resemblance/placement evidence, not proof of a deceptive operator. The additional bounded windows can use existing budgets sooner on adversarial names; partial coverage remains explicit. No inspection visited a destination or checked redirects, ownership, reputation or content. Source-data refresh, final licensing/release packaging and later stages remain outside this correction.

Fresh standalone preview:

`file:///private/tmp/oui-stage6-stress-e8gbw7e8/preview/standalone/Offline_URL_Inspector.html`

Open the local HTML file — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/008-Offline_URL_Inspector.html` (SHA-256 `4a19db8cdff292f461e5b4a86da48230573b91c9ab2488182ea6e34fec72775c`). The preview is outside the checkout and development-only; temporary files may be removed by the operating system. Retained preview and native/build manifests are verified against each other in the integrity report. Stop here for user review; no release, commit, push, merge, deployment or later stage is authorized.
