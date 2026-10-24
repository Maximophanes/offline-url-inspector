# Stage 8 independent security and release-candidate audit

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

**Public derivative.** This document is a sanitized derivative of the privately archived original `STAGE8_INDEPENDENT_SECURITY_AUDIT.md` (SHA-256 `9ae71f0cadbbde48b25457a914ed3a6a3d74979a1117c62ba3df0cd95a356227`; `repository-before-cleanup.tar.gz`, member `repository/STAGE8_INDEPENDENT_SECURITY_AUDIT.md`). The original is not distributed in this public repository. Original dates, findings, verdicts, measurements, limitations and recorded source/evidence hashes remain historical; sanitization does not turn them into current acceptance claims. Later closure is recorded separately in [STAGE8_REVERIFICATION.md](STAGE8_REVERIFICATION.md).

23 October 2026. Audited locally, without implementing corrections or authorizing release.

**B. NOT READY FOR FINAL RELEASE ACCEPTANCE.** One reproducible **MEDIUM / RELEASE BLOCKER** causes supported embedded visual and structural comparisons to disappear from ordinary results. In a native Firefox reproduction, the candidate says **“No lookalike warnings found”** even though its own comparison evidence establishes a resemblance to a saved reference. The preserved v3.2.0 edition visibly reports that same resemblance. Correction and re-audit are required.

A separate **LOW** generator issue permits index output under an unapproved runtime; the release builder correctly rejects that output. No CRITICAL or HIGH vulnerability was established. No DOM XSS, inspected-destination request, automatic inspected-value persistence, or candidate cache-integrity bypass was found in the performed checks. These are bounded findings, not a proof of safety.

Independent builds reproduce the refreshed Stage 7 package exactly. All 12 mandatory command groups, 17 release-integrity cases, 10 licensing/package cases, and the preserved historical regression chain pass. Those suites do not cover the blocking combination adequately. Independently authored tests and native Firefox establish the defect despite the successful existing suites.

All **543 starting files remain byte-identical**. Branch, HEAD, `main`, index and existing local changes were preserved. This report is the only repository addition from this audit. Nothing was staged, committed, pushed, merged, published or deployed.

## 1. Candidate identity and hashes

| Identity | Audited value |
|---|---|
| Repository | `<repository>` |
| Branch | `dev/v3.3.0-automatic-lookalikes` |
| HEAD and local `main` | `664cc58bf67a2127d0523adec9f1d80c6edd656e` |
| Preserved local stable edition | `3.2.0-a67e4b13dd5fa5cd`; published stable v3.2.0 is the user-provided baseline; the live published app was not visited |
| Current runtime candidate | `3.3.0-rc.1-0af3824ff7dd5cb8` |
| Complete package source digest | `30037cdc15185edeb644fcf875e22245dbc5c782af420a8a005f66c30fbc393f` |
| Explicit release inputs | 70 files, enumerated with sizes and SHA-256 in the rebuilt manifest |
| Entire initial candidate inventory | 543 files / 40,601,321 bytes; 273 tracked names, 19 tracked modifications, 270 untracked files; no staged changes |
| Initial inventory digest | `ebc9f71fe31f9dc511c7f9b4bcce30beb3a907adebc5857f6200075ae3d012a2` |

The inventory digest hashes sorted lines of `SHA256`, two spaces, repository-relative path and LF. The release source digest separately follows the builder's canonical JSON inventory format. These are different, deliberately scoped identities. **HEAD alone does not identify this uncommitted candidate.**

The inventory, exact initial status, initial binary diff, index status and original 543-file source archive were captured before this report was created. Git-ignored incidental files, `.git`, installed software, dependency caches and browser profiles are outside the source inventory. Release inputs have their own exhaustive 70-file allowlist; no ignored file supplies an undeclared runtime input.

Tracked modifications at entry were:

```text
.github/workflows/deploy-pages.yml
DEPLOYMENT.md
DESIGN_NOTES.md
EDITORIAL_STYLE_GUIDE.md
README.md
UPDATES_AND_ROLLBACK.md
deno.json
src/embedded-ui.js
src/embedded.js
src/presentation.js
src/template.html
src/ui.js
tests/dom-support.mjs
tests/harness.mjs
tests/idna-probe-results.json
tests/idna-review-results.json
tests/unit-results.json
tools/build.py
tools/verify_release.py
```

The **complete 270-name untracked list**, including candidate source, datasets, tools, Stage 2–7 reports, assertions and result files, is preserved in `evidence/initial-status.txt`; every file is hashed in `evidence/initial-inventory.json`. Existing untracked work is part of the audit target, not attributed to this audit.

Both fresh builds matched `<private licensing-resolution candidate>` across every output, including the complete manifest. This verifies the licensing follow-up package, rather than the earlier Stage 7 package with superseded documentation.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `site/index.html` | 4,053,647 | `0af3824ff7dd5cb8bd72e4262c66fcbb41bca3b7e15e79c0b02660ececb96f43` |
| `standalone/Offline_URL_Inspector.html` | 4,041,587 | `b17a482ea5b914b6c9e9e58d55ef96c2acba6fc7b37b1898fb14a646fed9ad0f` |
| `site/sw.js` | 4,153 | `864682c766cbe67d5762214b52e56b866ec6f49dbe06b6a311e7cae44d82f704` |
| `site/.nojekyll` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `NOTICES.txt` | 32,246 | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `source-materials.zip` | 2,799,705 | `0a7ba1e47a59ea2a43f3acf021e2430200a5d196bcb1c31e8ec38b3a1e02479c` |
| `build-manifest.json` | 16,520 | `5389ebcc0daa108f917e7c7762ae61e2f298f6c15fb1e44d34b0994a76b3d14b` |
| `SHA256SUMS` | 595 | `cd970635c3d6d5aed6c3192c215a6b3f21f17e094009e32efdfc23cbe4eb296c` |

## 2. Scope, methods and evidence

Read the actual AGENTS guidance, current presentation contract, Stage 7 hardening and superseding licensing handoffs, relevant Stage 6 acceptance/final-copy/structural/stress materials, build/release instructions, workflow and implementation. Earlier claims were treated as hypotheses. Static review covered all runtime modules, their rendering/storage/network sinks, extraction and reconciliation, loaders, build inputs, packaging and lifecycle code.

Write-capable commands were inspected first. Builds, data generations, mutation fixtures, independent tests and result files ran outside the repository. The historical runner was invoked from the original checkout only after confirming that it reads that checkout, copies it, and directs every mutation/report to disposable copies or an explicit outside report path. Its exact hash-checked historical restorations do not alter the audited application or rewrite original assertions.

The scratch root was `<private audit scratch directory>`. Durable evidence is preserved at:

- Evidence directory — private evidence `stage8-audit-evidence.zip` (SHA-256 `f18d503b33a6ea57a4e9680d7dc2a921e2c40936cb2f9de7d7f8f9c1c6e8b2c6`)
- Complete evidence ZIP — private evidence `stage8-audit-evidence.zip` (SHA-256 `f18d503b33a6ea57a4e9680d7dc2a921e2c40936cb2f9de7d7f8f9c1c6e8b2c6`)

Evidence ZIP SHA-256: `f18d503b33a6ea57a4e9680d7dc2a921e2c40936cb2f9de7d7f8f9c1c6e8b2c6`.

The ZIP retains the exact initial source archive, rebuilt candidate, manifests, initial failed attempts, independent test scripts, JSON observations, logs and screenshots. It excludes runtime executables, caches, browser profiles, the full-million CSV and Git internals. `evidence-manifest.json` hashes its evidence files. The report itself is separate. Test fixtures use synthetic secrets and names; none was opened as a destination.

**VERIFIED** means independently observed here. **KNOWN LIMITATION** identifies an intentional or documented boundary, not an executed negative check. **NOT TESTED** means no acceptance claim. **RELEASE BLOCKER** identifies a correction required for this candidate. Legal interpretations are explicitly distinguished from byte/provenance facts.

## 3. Independent threat model

| Boundary | Realistic attack | Audited control and residual risk |
|---|---|---|
| Copied URL → native parser and core | Credentials/@ confusion, encoded hosts, backslashes, controls, malformed IDNs, misleading displayed identity | Native HTTP(S) URL hostname is authoritative; original attribution must validate against it. Input is bounded. Parser acceptance does not establish DNS validity or destination safety. |
| Components → embedded extraction | Hidden/deeply encoded addresses, ambiguous delimiters, duplication, attacker-selected resource exhaustion | Strict bounded decoding, provenance/occurrences, unsupported/partial states. Recovered text establishes no redirect. |
| Hostnames → comparison datasets | False resemblance, missed resemblance, suffix/tenant confusion, ranking interpreted as trust | Pinned offline records and PSL, distinct proof classes and eligibility. Finite coverage and heuristic false positives/negatives remain. F-01 loses already-supported evidence during presentation. |
| URL/reference strings → DOM | Markup, event handlers, clickable scriptable URLs, CSS injection | Dynamic strings enter text nodes; no inspected-string HTML or URL sink was located. CSP adds execution/resource restrictions. |
| Import/storage → personal references | Malformed/schema-conflicting data, quota errors, stale-tab overwrite, prototype-shaped input | Exact schema/field/count/byte checks, canonical hostnames, reviewed replacement and protected/session states. Storage remains origin-scoped, not project-path-isolated. |
| Build inputs → bundled data/code | Corruption, mixed versions, altered notices, stale generators or archives | Hash-bound inputs and data, runtime normalization checks, exact CSP and full rebuild correspondence. Integrity is not publisher authentication. |
| Network delivery → worker/cache | Interrupted installs, mismatched HTML, corruption, stale updates | Fixed application-only fetch, whole-document hash, reviewed activation and retained prior cache. Initial uncontrolled delivery, compromised origin/browser and arbitrary eviction are outside this guarantee. |

The application should help a user evaluate potentially deceptive text while remaining safe when that text is attacker-controlled. Neither a suspicious appearance nor a comparison positive proves malicious intent. A popular-domain match, ASCII text, HTTPS, normalization or absence of warnings cannot prove safety.

## 4. Parsing and normalization findings

**VERIFIED:** 175 independently authored cases agreed with native URL hostname/port parsing for every accepted result in Deno 2.9.7 and again in native Firefox for each edition: 350 native case executions. This is a bounded matrix, not complete WHATWG conformance testing.

The matrix covers user/password and multiple `@` signs; percent and double-encoded hostnames; forward/backslash authority boundaries; dot segments; trailing and empty labels; mixed case; C0/TAB/LF/CR; Unicode whitespace; fullwidth/dot mappings; composed/decomposed Unicode; valid/invalid A-labels; IPv4 alternative spellings; bracketed/compressed IPv6; ports 0/443/65535/65536/negative/nonnumeric/empty; unsupported and incomplete schemes; scheme-less and protocol-relative input; truncation and markup-bearing components. Full inputs and outcomes are in `independent-engine.json` and `native-independent.json`.

The two Microsoft examples normalize to `rnicrosoft.com` and retain supported ASCII resemblance. `google.com@attacker.example` identifies `attacker.example`, not the text before `@`. Extra authority delimiters can produce a native parsed host while losing reliable original attribution; that limitation is surfaced. Invalid DNS labels accepted by the browser receive validation cautions instead of invented DNS verification.

Deliberate differences: the inspector supports HTTP(S), requires explicit `://` for an entered HTTP(S) scheme, and assumes HTTPS for eligible bare/protocol-relative input. It rejects leading obscuring Unicode whitespace rather than silently repairing it. Expected Hostname/reference inputs use a narrower hostname-only contract and permit one trailing root slash/dot normalization. Invalid readable IDNA decoding leaves the ASCII host visible and comparison coverage qualified. Native parsing, DNS validity and visual resemblance are separate questions.

No conflicting accepted displayed/native hostname was found. Full RTL/Bidi visual equivalence remains **KNOWN LIMITATION**; exact identity and character identification remain available.

## 5. Lookalike-matching findings

**RELEASE BLOCKER F-01:** supported embedded comparisons outside built-in findings are dropped from ordinary presentation. See section 16 for exact reproduction, impact and source evidence.

Independently authored matching controls passed **25/25** after correcting two initial audit expectations against the independently verified wildcard rules. Original expectations/results are retained. The corrected expectations were not product changes or relaxed detector assertions.

| Supplied example | Independently observed result |
|---|---|
| `https://accounts.google.com/` | Shared `google.com` registrable domain; no structural-deception finding merely for being its subdomain |
| `https://google.com.github.io/` | Structural comparison to `google.com`; PRIVATE suffix `github.io`, registrable domain `com.github.io` |
| `https://google.com.blogspot.com/` | Structural comparison; PRIVATE suffix `blogspot.com`, registrable domain `com.blogspot.com` |
| `https://google.com.example.net/` | Structural comparison; actual registrable domain `example.net` |
| `https://mygoogle.com.github.io/` | No `google.com` structural comparison from a partial-label substring |
| `https://rnicrosoft.com/` | ASCII visual proof against `microsoft.com` |
| `https://%72nicrosoft.com/login` | Same authoritative host and supported resemblance; original encoding preserved |

New cases additionally cover PRIVATE providers (`pages.dev`, `netlify.app`, `vercel.app`, `s3.amazonaws.com`, `surge.sh`), wildcard/exception hosts, deeper prefixes, `google.comgithub.io`, `notgoogle.com.github.io`, Cyrillic U+0430 in an Apple comparison, restricted transposition spelling, unknown suffixes and cross-suffix negatives. `amazon.net` does not become an `amazon.com` resemblance merely through registrant spelling.

Existing fresh current-policy tests independently rechecked all 9,570 exact reference identities, suppression of spelling on exact membership, ranking, collision/candidate/pair/time limits, source attribution and compatibility. Finite ASCII proofs, Unicode proofs, structural placement and weak spelling remain distinct. Built-in popularity is neutral provenance. Automatic comparison targets full registrable domains; it is not exhaustive visual matching of every arbitrary subdomain. Manual references retain separate full-hostname methods. Their successful embedded results must still be presented, which F-01 violates.

## 6. PSL and PRIVATE suffix findings

**VERIFIED:** 3,316 independent oracle comparisons, covering 1,658 hostnames with PRIVATE rules both enabled and disabled, agreed on public suffix, registrable domain and winning rule. The oracle parses the raw list independently and implements longest-match/wildcard/exception selection separately from `DomainBoundaries`. It includes every wildcard and exception rule plus sampled exact rules, suffix-only names, unknown suffixes and deep subdomains. Existing official-fixture/foundation checks also passed.

Pinned distribution: version `2026-10-20_08-40-56_UTC`; commit `5dd321ffe02039e2431382a095cf80e27ff5eb94`; raw distribution SHA-256 `8228e4bdac6024c058a1e67859157e468a2613b826b53de0e5cae298e1b70755`, 338,010 bytes. Counts: 6,949 ICANN + 3,447 PRIVATE rules, 311 wildcards, 8 exceptions.

Fresh read-only retrieval of the [exact official upstream commit file](https://github.com/publicsuffix/list/blob/5dd321ffe02039e2431382a095cf80e27ff5eb94/public_suffix_list.dat) matched Git blob `30b18ab3c21f96dd1c4a7b4adb9b16ed9e2b30aa`, 337,921 bytes, SHA-256 `9b4827a9e428a0192a9ea0a6b7804a4cc653d5f39a03456d3b17447b86d78de9`. Removing only the official distribution's VERSION/COMMIT header block from the pinned local file reproduced those exact bytes. The distribution file itself therefore correctly has a different Git blob/hash; there was no unexplained rule difference or dataset replacement. The [official distribution documentation](https://publicsuffix.org/list/) describes daily generation from GitHub.

The approved structural policy deliberately permits a complete reference-label sequence to begin in a real subdomain and end on the actual registrant label, while excluding labels belonging to the actual public suffix. Thus `google.com.a.ck` and `google.com.foo.kawasaki.jp` correctly produce structural evidence: the complete `google.com` sequence is outside those wildcard suffixes. My initial negative expectations for these two cases were wrong; the oracle and source trace resolved them. `google.com.www.ck` and `google.com.city.kawasaki.jp` separately exercise exception behavior. Partial names and legitimate subdomains remain negative controls.

Unknown suffixes use qualified eligibility; the default PSL rule does not establish real registration/ownership. No new PSL boundary defect was established.

## 7. Embedded extraction findings

**VERIFIED:** 19 new extraction/provenance scenarios retained native hostname/scheme identities, valid parent-before-child relationships, occurrence membership and parent occurrence identity. Tested literal and encoded path addresses, fragments with query separators, hash routes, two decoding layers and an additional exhausted layer, relative/protocol-relative forms, unsupported schemes/structured/Base64 data, branching parents, repeated values and mixed HTTP/HTTPS/ports on one hostname.

Observed resource/format limits remained explicit. Repeated source values stop recording at the existing eight-occurrence cap; depth, nodes, text and further decoding limits set partial occurrence coverage. Duplicate host analysis is reused without turning parent relationships into a verified redirect chain. Recorded unsupported relative/structured/opaque data is not evidence that all hidden destinations were found.

Fresh existing tests: provenance 34 cases / 821 assertions; coordinator 56 / 601; compatibility 8 / 13. F-01 occurs after successful extraction and reconciliation: evidence remains available internally and in deliberate occurrence diagnostics, but the normal warning selection omits it.

**KNOWN LIMITATIONS:** finite candidate/host/occurrence/depth budgets; no Base64/Base64URL, JSON, JWT, encrypted/proprietary decoding or remote script/server examination. The current help states these boundaries. No unsupported decoder was implemented or treated as a failure merely for being absent.

## 8. XSS, privacy and data safety

**VERIFIED within performed scope:** dynamic URL/reference strings use `textContent`, text nodes or fixed enumerated classes/attributes. No untrusted `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` or `Function` sink exists in runtime source. Development DOM/module harnesses evaluate trusted generated application code; they are not runtime input sinks. The Happy DOM warning about its evaluation environment was retained, not mistaken for an application vulnerability.

Synthetic markup/event payloads in nested URL values and parameter names did not create `img`, `svg`, iframe or destination-link nodes. Credentials, synthetic tokens and parameter names were absent from default ordinary/technical results and announcements. Exact embedded values appeared only on deliberate reveal; closing diagnostics unmounted captured private bodies. Reinspection and rapid queued replacement removed stale results. Inspection did not add secret-bearing URL/Expected Hostname text to localStorage. Advanced diagnostics is itself explicitly labeled as potentially private; URL components inside that deliberate area are not a redaction/export facility.

Reference parsing rejected markup, script URLs, credentials/paths, unexpected object fields, excess entries and oversized JSON without storage mutation. Existing fresh suites exercise corruption, schema 0 migration, unknown future schema protection, write/quota failures, reviewed plans and stale-tab conflicts. Native File/DataTransfer import verified review-before-apply, invalid-data preservation, merge and replace cancellation/confirmation. Export-handler Blob content contained reference schema data only; its OS download was deliberately suppressed.

Static network-capability tracing found only the fixed application lifecycle worker path and reference-backup Blob download. No inspected string feeds fetch, navigation, a worker message target, a resource URL, DNS/reputation lookup or logging. Native inspection network observations remained local; fixed loopback server logs contain no inspected destinations. Expected favicon requests were blocked by CSP. A Firefox local `data:font` event observed during automation was a local resource event, not destination contact.

Both built editions have exact recomputed script/style CSP hashes, `default-src 'none'`, `connect-src 'none'`, blocked images/fonts/frames/objects/forms/base/media/manifests, no unsafe-inline/eval, and no external runtime asset tags. Hosted worker permission is self-only; standalone worker permission is none. Full rebuild correspondence verified actual code/data/legal blocks, not just matching self-declared hashes.

**KNOWN LIMITATIONS:** same-origin projects/extensions or a compromised browser can read origin storage/page input; file-origin storage is browser-dependent; browser/OS form retention is outside application persistence. CSP/self-contained hashes do not authenticate an initially compromised publisher delivery. No arbitrary clipboard read/write feature was found; the app does not automatically read clipboard contents.

## 9. Warning hierarchy and UX

Current built-in combinations passed the existing **36 cases / 930 assertions** and both native editions' Stage 7 candidate cases. This includes strong visual + HTTP, HTTP alone, HTTPS nondefault ports, userinfo, original/recovered transport permutations, embedded structural evidence, independent warnings, repeats, limited coverage and neutral results.

Independent native mixed-scope checks confirmed visible separate identity and HTTP cautions, informational ports, scope labels, contextual advice, and 12 computed accessible warning names. Screenshots at narrow and zoomed widths were inspected; no clipping or horizontal document overflow was observed in those measured scenarios. Disclosure cleanup, settled keyboard focus, cancel focus and dialog trapping passed.

However, **the universal strongest-supported-finding rule is not satisfied overall**: F-01 leaves successful custom-source embedded proofs outside the visible hierarchy. In known-suffix examples the normal headline and its explanation directly contradict completed positive evidence. With an explicit Expected Hostname, an original-host mismatch remains visible but the stronger distinct embedded resemblance is omitted. Unsupported automatic matching also masks successful supported manual/initial-host comparisons. This is a message correctness defect separately from engine correctness, and a gap in the current cross-feature tests.

No general visual redesign is required or proposed. The approved palette, typography and native interaction design were preserved.

## 10. Resource limits and bounded stress

Independent engine tests used inputs no longer than 32,768 UTF-16 units except one explicit over-limit rejection. Deno's old-space ceiling was 512 MiB. Nine stress cases covered maximum host/path, Unicode/combining-heavy paths, many labels/parameters/recovered values, long malformed A-labels and excess input. Each completed below the audit's five-second case threshold; ordinary recovery succeeded after each. This threshold was an outcome check, not a hard real-time guarantee. Protocol operations had bounded timeouts.

The fresh Deno sample's worst recorded case was approximately 63 ms; retained heap deltas are recorded per case. These endpoint deltas do not establish peak allocation. Core parsing is input-bounded, while embedded/matcher time budgets are cooperative, not preemptive.

Native headless Firefox additionally exercised four bounded stress/recovery inputs per edition. Settled result/layout samples were approximately **4–77 ms** in standalone and **5–63 ms** in hosted mode, followed by a successful ordinary inspection. These are small local samples, not p95 field measurements, disk-cold startup claims or a physical-device performance certification. Native process peak heap/RSS and OS memory pressure were **NOT TESTED**.

Observed caps: extractor value 8,192 units; depth 3; percent layers 2; 128 parameters per component and 128 nodes; 131,072 accounted text units; 32 candidates/occurrences/relationships; 64 expansions; 8 occurrences per value; 16 analyzed hostnames; 256 manual comparison pairs; cooperative 100 ms. Matcher defaults remain 32 candidate IDs and pairs per hostname, 256 pairs per inspection, bounded spelling states, cooperative 50 ms; coordinator automatic host allowance 17 and relationship cap 8,192. Low limits produce partial/unsupported/unavailable coverage rather than a safety verdict. Diagnostic records are lazy/paginated. No uncontrolled stress or live-destination traffic was used.

## 11. Distribution and reproducibility

**VERIFIED:** official Deno 2.9.7 archive SHA-256, contained executable equality and binary SHA-256 were checked before execution. Fresh [official release metadata](https://github.com/denoland/deno/releases/tag/v2.9.7), read through GitHub's release API, independently confirms macOS archive digest `5cd46d6268f6f78f5d88bdc7159d20bd44cdaa4b3303474839f87ec6fe7ae25c` and Linux digest `c6527f24f4b16031d3ae4fa9f658d5f11534c8d84ce7dc8502420280919c3490`. Executed binary: `b73737579d5a84c160e3316487594783fa5c15f4e13252a6a07050b755317f1a`; actual versions: Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3.

The global Homebrew Deno 2.9.8 was not replaced; its binary remains `2e5e5177a25d6a89847f229996fc8f104db8985356f7608067de7a59a42059fe`. Dependencies were copied into an outside cache, and suites used cached-only access. App execution requires none of those development packages.

Two independently generated foundation/index roots matched all approved outputs. Two full builds and verifier rebuilds matched all eight artifacts, with Python 3.15.0 / zlib 1.2.12. Source/archive inventory, embedded data, exact CSP, worker pairing, notices, checksums and complete source-to-artifact correspondence passed. Negative fixtures rejected missing/corrupt index, truncated subset, wrong runtime metadata, missing legal notice/source archive, stale versions, extra assets, mixed stable/current artifacts, changed checksums and even altered content with recomputed artifact inventories. A controlled failed prerequisite made the mandatory gate fail.

**LOW F-02:** actual runtime refusal is early for foundation generation but late for index generation. Deno 2.9.8 can successfully write an index manifest; the candidate builder then rejects it. No bypass of the release gate was established. See section 16.

**NOT TESTED:** execution on Linux/GitHub's actual runner, cross-Python/zlib archive equality and a final non-RC v3.3.0 build. The current workflow targets an RC deliberately; final version promotion and new input/artifact hashes require separate review. Source ZIP supplies the explicit build/data inputs, while the full checkout is required for complete historical regression execution; that limitation is documented.

## 12. License and distribution findings

**VERIFIED provenance facts:** retained original daily CSV is 79,648,765 bytes / 1,000,000 complete ordered ranks, SHA-256 `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a`. Fresh extraction checks reproduce the 176,483-byte, 10,000-row subset SHA-256 `01ddd1c4da949fb9d8c4a12b3ae4ca2dce22f9f6048764693553a65664cf5f55`. Accepted rows normalize/deduplicate to 9,570 references without topping up exclusions. The acquisition record identifies the public daily CSV route and original date metadata; its saved page is 335,681 bytes, SHA-256 `47ed2572ca8d3582f0982d9a294681942b2f28d18a8f2e16ee1d27f6df434803`, with both the CSV and BY license association present. Hashes are provenance evidence, not publisher signatures or an original packet capture.

The current [Majestic download page](https://majestic.com/reports/majestic-million) and [2012 daily CSV announcement](https://blog.majestic.com/development/majestic-million-csv-daily/) independently associate the recurring CSV with CC BY 3.0. Its [2016 announcement](https://blog.majestic.com/development/alexa-top-1-million-sites-retired-heres-majestic-million/) invites attributed mirroring. The [2011 announcement](https://blog.majestic.com/case-studies/million/) identifies a separate dated ShareAlike release. No provenance evidence ties this input to that historical asset.

Both HTML editions and companion files preserve publisher/work/source, BY license URIs, selection/transformation identification and no-endorsement/popularity qualifications. They do not impose new restrictions on covered data. The [CC BY 3.0 legal code](https://creativecommons.org/licenses/by/3.0/legalcode) supports attributed reproduction/adaptation/distribution subject to its terms. The [general publisher terms](https://majestic.com/company/terms) remain a relevant separate context; the daily data-specific grant and public reuse invitation are more specific evidence for this asset than an assumption that every subscription condition governs its acquisition.

**Interpretation, not legal certainty:** I find the superseding Stage 7 reuse conclusion proportionate to the identified public asset and explicit publisher permission. No concrete contrary acquisition contract, missing attribution or unsupported ShareAlike provenance was found that warrants reinstating a blanket licensing blocker. The [CC database FAQ](https://creativecommons.org/faq/#how-does-the-treatment-of-sui-generis-database-rights-vary-in-prior-versions-of-cc-licenses) still distinguishes the sui generis rights omitted from 3.0 Unported's express grant; the publisher's invitation strengthens an inference of intended reuse, not a universal jurisdictional warranty. No publisher was contacted, terms accepted, or rights adjudicated.

PSL remains separately covered by [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/). Exact preferred raw/derived source, transformation materials, MPL text and notices are included offline in both HTML editions and the archive. This meets the observed source-availability/notice needs on the documented executable/larger-work interpretation; [Mozilla's FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) explains file-level treatment. No missing covered source or notice was found. Single-file larger-work interpretation retains its documented caveat; the audit does not silently relicense independently authored code. Unicode and fixture notices remain intact. No dataset/license/pin was changed.

## 13. Hosted update and rollback

**VERIFIED native loopback rehearsal:** fresh isolated v3.2.0 profile → mismatched worker/HTML rejection → truncated download rejection → valid candidate waiting for deliberate application → applied candidate → offline restart → deliberately offered matched v3.2.0 rollback → offline stable restart. Saved reference JSON remained byte-identical across each successful transition. Offline restarts after server shutdown produced zero additional served requests.

The worker fetches only the fixed index with omitted credentials, no-store and redirect rejection; it checks complete-document SHA-256 before cache readiness/activation. The cached HTML contains code, data and legal material together. Exact scope checks, no arbitrary request fallback, bounded hosted status/update waits, explicit activation, corruption recovery and failed writes are additionally covered by 25 worker and 64 hosted-control simulation cases. These controls were inspected, not inferred only from tests. Storage schema/key remain unchanged.

Workflow static review verified manual dispatch only, `main`/authorization/commit checks, accepted source digest, fresh build and prerequisite jobs, immutable action pins, checksum-pinned Linux runtime, read-only verification token, deployment-only Pages/OIDC write permissions, `needs` ordering, serialized deployment, no persisted checkout credentials and a stale-main check. These are meaningful safeguards, not proof that repository environment protections have been configured. No Actions workflow or repository setting was invoked/changed.

**KNOWN LIMITATIONS / NOT TESTED:** live Pages/CDN/header behavior, actual GitHub runner/environment enforcement, multi-tab transitions, eviction/quota under real OS pressure, private profiles/Containers/Safari, and a live rollback deployment. A race remains after the final main check. Initial delivery before worker control is outside the cache hash's authentication guarantee. Retained previous cache is not a permanent rollback archive. Final authorized release must keep a separately verified matched stable pair and rehearse the real deployment path without clearing reference storage.

## 14. Browser and accessibility acceptance

Native test engine: installed macOS **Firefox 158.0.1**, build `20261019185856`, `moz:headless: true`, disposable audit profile. No personal browser profile was used. The audit-owned process was stopped and each fixed local server was shut down.

| Acceptance area | Result |
|---|---|
| Actual standalone `file://` and loopback hosted execution | VERIFIED |
| 175 parser cases in each edition | VERIFIED; 350 native executions |
| F-01 custom-source reproductions | VERIFIED; five variants per edition, ten observations confirming missing evidence |
| 320px viewport, actual 200%/400% tab zoom at 1280px | VERIFIED; six independent measured mixed-result layouts, 640px/320px effective zoom widths, no measured horizontal overflow |
| Keyboard inspection, dialog focus trap, Escape/cancel restoration | VERIFIED in both editions after explicit tab activation |
| Browser-computed warning scope/name resolution | VERIFIED for 12 mixed-scope warning/information names; missing F-01 warnings naturally have no such name |
| Disclosure defaults/private-body cleanup/reinspection | VERIFIED in native and DOM checks |
| File import processing and reviewed merge/replace | VERIFIED through native `File`/`DataTransfer` and change events; not the operating-system picker |
| Export interaction | VERIFIED handler/Blob schema/content; anchor download suppressed, so no OS download claim |
| Error announcement wiring | VERIFIED native import error text and polite live region; spoken announcement NOT TESTED |
| Headful manual operation | NOT TESTED: Computer Use permissions unavailable |
| VoiceOver | NOT TESTED: native computer-use access unavailable; computed names are not spoken-output acceptance |
| Actual OS file picker/download dialogs | NOT TESTED |
| Safari/other browsers, physical mobile/device | NOT TESTED |

The existing Stage 7 Firefox suite initially completed 42/47 checks; its five upgrade assertions failed at an initial default-context page precondition. A separately authored fresh-user-context rehearsal passed the same update/integrity/storage transitions. The first failure is retained and is not presented as a product defect or a successful existing-suite run. Its exact initial-page cause was not established.

The independent native runner first had three harness failures: background hosted-tab keyboard focus, a background accessibility locator timeout, and a network assertion that incorrectly rejected a local `data:font` event. Explicitly activating the tab and admitting local data-font events resolved those checks: final **31/31 observation checks completed**, including ten deliberate F-01 reproductions. This is not a claim that the product passed the missing-warning expectations. Additional native import/export/stress runner: **14/14 checks passed**. Original failed runs and harness changes are preserved.

## 15. Complete test outcomes

Fresh executions, with distinct evidence scopes:

| Execution | Outcome | Evidence |
|---|---|---|
| Two full RC builds + verifier rebuilds | Eight outputs identical, match refreshed Stage 7 bytes | `build-one.log`, `build-two.log`, `release-tests.json`, rebuilt manifest |
| Existing release negatives/strict double generation/full CSV | 17/17 passed | `release-tests.json` |
| Existing licensing/source/notice negatives | 10/10 passed | `licensing-results.json` |
| Mandatory release gate | 12/12 command groups passed | `gate-results.json` |
| Preserved historical wrapper | Passed; exact original assertions on hash-restored historical interfaces | `historical-results.json`, `historical-results.log`, `historical-suite-index.json` |
| Independent engine matrix | 3,548/3,548 final checks passed: 175 parsing, 25 matching, 3,316 PSL, 19 embedded, 9 stress, 4 import-rejection | `independent-engine.json`; first two incorrect wildcard expectations retained separately |
| Independent DOM message/privacy matrix | 16 edition/case observations; confirms missing custom-source warnings alongside passing privacy/recovery controls | `independent-dom.json`, `independent-dom.log` |
| Existing Stage 7 native suite | 42/47 completed successfully; five upgrade precondition failures retained | `initial-firefox-results.json`, `initial-native-stage7.log` |
| Fresh independent native matrix | 31 observation checks completed, including ten F-01 reproductions; no harness failures after correction | `native-independent.json` |
| Native import/export-content/stress | 14/14 passed with stated OS limitations | `native-extra.json` |
| Native v3.2.0 same-fixture baseline | Existing visible embedded resemblance confirmed | `native-stable-baseline.json` |
| Independent wrong-runtime generation | Foundation refused before writing; index incorrectly wrote successfully under 2.9.8 | `wrong-runtime-generation.json` |
| Downstream wrong-runtime rejection | Release build failed with `Unapproved index runtime metadata` | `wrong-runtime-downstream-rejection.json` |
| Original candidate integrity | All 543 starting hashes match; status/index/branch unchanged except this new report | `integrity-before-report.json`, `integrity-final.json` |

Mandatory gate component outcomes:

| Component | Cases passed | Assertions passed |
|---|---:|---:|
| Foundation reproduction / index reproduction | Both byte checks passed | — |
| Foundation and PSL | 162 | 49,099 |
| Current matcher | 27 | 19,335 |
| Current candidate copy/privacy/accessibility | 36 | 930 |
| Worker lifecycle | 25 | 84 |
| Hosted controls | 64 | 192 |
| Core/official Unicode fixtures | 108,664 | 112,223 |
| References | 70 | 135 |
| Embedded provenance | 34 | 821 |
| Coordinator comparisons | 56 | 601 |
| Comparison compatibility | 8 | 13 |

Historical nested reports overlap and must not be added to gate totals. Their 74 report records, exact command paths/interfaces, individual counts and complete results are preserved in the evidence. The historical success proves their preserved expectations; it does not validate a superseded UI contract against this RC. Current RC checks and the independently discovered failures remain separate.

Reproduction entry points, run only from an isolated source copy with outside output paths:

```sh
python3 -B tools/build.py --release-candidate --output-root /outside/fresh-one
python3 -B tools/build.py --release-candidate --output-root /outside/fresh-two
python3 -B tools/verify_release.py --candidate-root /outside/fresh-one
python3 -B tools/release_gate.py --candidate-root /outside/fresh-one --deno /verified/deno-2.9.7 --report /outside/gate.json
python3 -B tests/stage7-release.py --task-root /outside --deno /verified/deno-2.9.7 --majestic-source /retained/majestic_million.csv
python3 -B tests/licensing-resolution.py --task-root /outside
python3 -B tests/stage7-regressions.py --candidate-root /outside/fresh-one --report /outside/historical.json
```

The retained scripts record actual scratch paths, `--cached-only`, read/write permissions and loopback ports. The historical wrapper needs a read-only Git baseline or its documented identical prefetched blob. Do not run the old default release builder against this development checkout or substitute the stable `site/` artifacts for the rebuilt RC.

## 16. Findings ranked by severity

### F-01 — MEDIUM — supported embedded comparison warnings omitted

**Status: RELEASE BLOCKER. Reproducible in both native editions. New regression relative to preserved v3.2.0; not an intentional unsupported-format or finite-reference limitation.** Affected subsystem: presentation of successful embedded manual/personal/original-host comparisons and their accessible warning names.

Minimal reproduction:

1. Open the verified RC standalone file or isolated hosted preview.
2. Add personal reference `acmecorpaudit.com` through Your Reference Domains. Leave Expected Hostname empty.
3. Inspect this text without navigating to it:

```text
https://example.net/?next=https%3A%2F%2Facrnecorpaudit.com%2F
```

**Expected:** an embedded-host caution explaining the supported `rn`/`m` resemblance to the saved `acmecorpaudit.com`, correctly scoped and attributed, with no assertion of a real redirect or maliciousness.

**Actual:** headline **“No lookalike warnings found”**; explanation **“No notable hostname resemblance was detected by the supported checks.”** Zero cautions. `acrnecorpaudit.com` appears only as a different recovered hostname. The extractor simultaneously records a visual-positive comparison to the saved reference. The coordinator retains the relationship; this is not a missing detector capability. v3.2.0 visibly reports **“Embedded hostname may look similar”** and the same saved-reference resemblance for this exact fixture.

Further native reproductions in each edition:

| Source and fixture | Observed defect |
|---|---|
| Saved `acmecorp.example`; recovered `acmecorp.example.attacker.com` | Successful `name-inside` structural relationship; neutral “No lookalike warnings found,” zero cautions |
| Original `acmecorp.example`; recovered `acrnecorp.example` | Successful comparison to initial hostname; only “Automatic comparisons unavailable,” zero cautions |
| Saved `acmecorp.example`; recovered `аcmecorp.example` with **Cyrillic small a U+0430** in place of **Latin small a U+0061** | Successful Unicode visual proof; only automatic-eligibility limitation, zero cautions |
| Expected `acmecorpaudit.com`; recovered `acrnecorpaudit.com` inside `example.net` | Original `example.net` mismatch caution survives, but the independent embedded resemblance and its scope are absent |

`.example` cases intentionally exercise unsupported automatic eligibility while manual comparison succeeds; the `.com` minimal reproduction shows this also happens when automatic checks complete normally. It cannot be excused as an unknown-suffix limitation. Top-level direct `acrnecorp.example` against the saved reference correctly displays a caution, providing a control for the existing comparator.

Root cause, verified from source:

- `src/automatic-ui.js:14–30`: `view()` creates finding groups only while iterating `a.automatic.findings`. Relationship support is appended only after a built-in group already exists.
- `src/comparisons.js:86–88`: embedded comparisons to Expected Hostname, saved references and the initial hostname are already retained in reconciled relationships.
- `src/results-presentation.js:120–125`: built-in groups and top-level manual results create visible comparison candidates; embedded manual relationships are not added.
- `src/results-presentation.js:131–142`: the recovered-host loop adds syntax/transport/validation cautions, but does not consume those successful resemblance/placement comparisons. Neutral fallback follows at `:154–157`.

**Impact:** an attacker-controlled wrapper can hide a supported custom-target resemblance from the normal result. The user loses the exact security clue that their saved reference or original hostname was meant to supply; the live/accessible warning path omits it too. This is a material false-negative presentation defect. It is MEDIUM rather than HIGH because no code execution, data disclosure, destination verification or direct navigation is involved, and deeper evidence is retained. It nevertheless blocks acceptance of a security-inspection tool whose contract is to lead with the strongest supported finding.

Full evidence: `independent-dom.json`; `native-independent.json` → `customComparisons`; `native-stable-baseline.json`; native screenshots `standalone-missing-embedded-warning.png` and `hosted-missing-embedded-warning.png`. The exact tested source snapshot and generated HTML are retained. Reproduction was repeated in DOM and native Firefox, then compared against native stable behavior.

### F-02 — LOW — index generation writes under an unapproved runtime

**Status: VERIFIED; non-blocking release-tool robustness issue because downstream release enforcement rejects it.** Affected subsystem: index generator entry point. Newly identified in this audit; no evidence of a current published artifact bypass.

From an isolated candidate copy, using installed Deno 2.9.8 and a fresh outside directory:

```sh
deno run --cached-only --allow-read=. --allow-write=/outside/index-298 \
  tools/generate_lookalike_index.mjs --write --output-root /outside/index-298
```

**Expected under the documented strict-generation contract:** reject the unapproved runtime before creating outputs, as foundation generation does.

**Actual:** exits 0 and writes both index files. The index content is unchanged in this sample, but the generated manifest records Deno 2.9.8 and differs from the approved manifest (wrong-runtime manifest SHA-256 `61d951ad647baa137ad8432b3d6ff68c838bae7a566d4f71d51403b220d9155c`). A copied-source release build with that manifest rejects it with **`Unapproved index runtime metadata`**.

Sources: `tools/generate_lookalike_index.mjs:12–16`; `tools/lookalike_data_lib.mjs:11–17` records `Deno.version` without the early guard used by `tools/reference_data_lib.mjs:56–57`; downstream enforcement is `tools/release_candidate.py:45–50`. Impact is avoidable output mutation/confusing failed reproduction when a developer explicitly invokes generation under the installed wrong runtime. No original data was touched during this test. Aligning the generator's early refusal is advisable; it is not a reason to claim unsafe artifact acceptance.

## 17. Focused correction handoff

No correction was implemented. The original development conversation should address F-01 without altering matching policy, datasets, PSL, storage schema or raw evidence:

1. Add already-supported embedded visual and genuine misleading-placement evidence from the reconciled relationships to the visible selection path even when no built-in finding exists. Keep legitimate parent/subdomain relationships neutral; do not label every legacy structural relationship deceptive.
2. Preserve actual comparison method/source, affected hostname and original/embedded scope. Do not substitute the outer URL's mismatch for an embedded resemblance. Avoid fabricated one-to-one Unicode explanations, maliciousness claims or redirect verification.
3. Preserve equivalence deduplication and independent HTTP/userinfo/validation cautions. Eligibility limitations must remain scoped to unavailable automatic methods while successful manual evidence remains prominent.
4. Add independent regressions for the exact `.com` and `.example` cases above, saved/Expected/original sources, Unicode/ASCII/structural methods, duplicates/nesting, HTTP in both scopes, unrelated expected targets, supported plus unsupported coverage, and accessible warning names. A positive retained relationship must not yield the negative fallback.
5. Review affected help, descriptions and technical evidence for consistency. Rebuild every artifact, regenerate source-policy manifests only if legitimately affected, preserve original historical assertions, and rerun targeted/current gates plus native file/hosted verification.

F-02 may be corrected separately by rejecting unapproved index-generator runtime before write, with a negative test asserting zero created outputs and unchanged strict 2.9.7 reproduction. Its existing downstream rejection must remain.

Any correction changes the audited identity. Produce a new exact input inventory/package and re-audit the corrected candidate before acceptance. No fix, commit, later stage or deployment is authorized by this handoff.

## 18. Outstanding acceptance tasks

| Item | Status / required next evidence |
|---|---|
| F-01 warning loss | **RELEASE BLOCKER** — correct and re-audit |
| F-02 early runtime refusal | VERIFIED LOW — recommended tooling improvement; current release guard remains effective |
| Final immutable source identity | NOT TESTED — after authorized commit/promotion, verify the exact tree and all corrected inputs/artifacts; current digest is working-tree content |
| Native headful/VoiceOver | NOT TESTED — user-accessible manual session in both editions, including scoped warnings, focus, disclosures and spoken errors |
| OS file-picker and actual export download | NOT TESTED — native dialogs, cancellation, file creation and backup re-import |
| Safari/physical-device acceptance | NOT TESTED — responsive layout, zoom/keyboard equivalents, file/storage behavior |
| GitHub/Linux toolchain | NOT TESTED — exact runner reproduction, prerequisites and archive behavior before promotion |
| Pages environment/repository protections | NOT TESTED — actual configuration and authorized execution; no settings changes were made |
| Live upgrade/multi-tab/cache recovery/rollback | NOT TESTED — separately authorized real deployment rehearsal with matched sets and reference backups |
| RTL/Bidi, deferred encodings, finite references and budgets | KNOWN LIMITATION — retain precise help and partial/unsupported semantics; not automatic failures |
| Majestic database-rights/jurisdiction and single-file MPL interpretation | KNOWN LIMITATION — reasoned licensing assessment retained; no concrete compliance blocker identified, no universal legal warranty |

## 19. Release-gate recommendation and preservation

**B. NOT READY FOR FINAL RELEASE ACCEPTANCE.** F-01 must be corrected and the changed candidate independently verified/re-audited. Passing builds, historical checks and licensing-package integrity do not compensate for a reproducible loss of supported warnings. F-02 is a separate low-severity improvement with an effective downstream release guard.

At completion, every starting source, data, stable artifact, assertion, report and existing untracked file still matches its initial SHA-256. Branch remains `dev/v3.3.0-automatic-lookalikes`; HEAD and local `main` remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`; index remains unchanged and empty. Only `STAGE8_INDEPENDENT_SECURITY_AUDIT.md` was added to the repository by this audit. The initial and final inventories/status checks are preserved in the evidence.

This is an audit-readiness verdict, not deployment permission. Work stops with this report and correction handoff.

## Appendix: runtime source and generator SHA-256 identities

These are entries from the exact 70-input manifest; complete input and 543-file inventories are in the evidence.

| File | SHA-256 |
|---|---|
| `data/lookalikes/manifest.json` | `f5b3c0f3a17cdf7e2268dbfb03be1102c8ebb1932c8e0fea308560528a954f90` |
| `data/popular-domains/records.json` | `128daf34b6d5bce08217d2caad82b0e1d5fbca7e4c780505b4705d391589de4a` |
| `data/public-suffix/compiled.json` | `9be5bdf057a809aeef08699dc4c2c6095823c34cc32b82cd1d6bd96323aa6e59` |
| `data/reference-foundation.json` | `24971b3e95142d1e751d0ab8eb283de6b073545553995957927c963e9c1fd5dc` |
| `src/automatic-ui.js` | `e06ff1f7b9dbdce8de2ac0e5316b8936ed2205de1286c5a4d4d8d557a7c98792` |
| `src/automatic.css` | `0bdba3ec6039aa7a69b38336d6ebff7bf1a0ecdf50c1c1bd12fbb1b5e2c8babc` |
| `src/base.css` | `92fc1cd5e2a24e58025270164b82e1afe3eb0eb1ef9bf35f422728500d5f58cb` |
| `src/comparisons.js` | `a6749b2b73c25b90199d0fcca83d69169e77094f04e4f9dbeb60053c12a1a846` |
| `src/core.js` | `6d7d8a253c175caec0296cbfe71d3cec17b3afdf8aaef72385cabc6902f2a2aa` |
| `src/domain-boundaries.js` | `4ac51e1b89cf808e79d092e3c9585ce3de97ab148b6d962bacdad3c79eb396fb` |
| `src/embedded-ui.js` | `03cc8bbe150fa09b5402e5f333e50b5a9cd4da63e7030a3f7295de848e5cadb4` |
| `src/embedded.css` | `142be7d24b277adb9f9f13027dd488fed0d8f61013fd199a327b53aa60c8432c` |
| `src/embedded.js` | `66df9cd907c29a342d3e856a56cdeae542ae518126f1829d0c500c3ba620a63c` |
| `src/hosted.js` | `1fa488dea88060d8b6f404133c7a85458996d8761d036c7b3d3346bfc5449673` |
| `src/lookalikes.js` | `e1defc2fc85396fd368302cc7cae00597c7485f4f31309388361a9c5dd9bfada` |
| `src/presentation.js` | `7a56101ea75ddb320bb9315eeeb138f1c9c4eb8bfa2a31243a2aad00e938834c` |
| `src/reference-data.js` | `4d4a5568f4a892722b89d3b6932b5233c4730de50c8cd3b0d676ac65abc32eb5` |
| `src/references.js` | `6017e9dbb9806f5192a9691870fb82587220a8c8a3d165cfd0403e5c1d705d23` |
| `src/results-presentation.js` | `cc25a112f6f9f4e0a185b47d40f78dc5e6979513d708d373ccb48bd23ad3740f` |
| `src/sw.js` | `fb139641d523d4761b555825bd1365d53f553ee0c8fb2f6583c854fcc3f75034` |
| `src/template.html` | `8390ecd076ba72549f392a4b6ad516dd78a97bb2d60236b0d57536bf94769585` |
| `src/ui.js` | `972bc713b0a55b7d1a3b004951cc03bed076e3a94959b8235c0a144c2fc9a978` |
| `src/v3.css` | `9dd588661169f691801859789455f9365f8dea30efefaf35a44d626783a335bd` |
| `tools/build.py` | `4f40bc328d7097c5e008c18aa407b3076c6041c22af0b95fe9c304e9bfb1c368` |
| `tools/extract_majestic.py` | `3289b72ded7601ff7b0c1a3acd0bd20126839ff032366e25f0022ad7c42793db` |
| `tools/generate_lookalike_index.mjs` | `b46411767be0dadcd4fd30fa3021f34c275d013a396bf8ee2d365caffbfa2606` |
| `tools/generate_reference_data.mjs` | `2b1f1ce883f0f6c16825ed9c76d2d930c797c0239e8a6e5a6562aa8a297c8cfd` |
| `tools/lookalike_data_lib.mjs` | `7403e6d3f2b594fbfab091085df1c2208cb469179429cd0a4aa873716c0ee539` |
| `tools/reference_assets.py` | `592a326d00da4a4d0a7548742110eb006965673959c686c1cc549c30d06077f4` |
| `tools/reference_data_lib.mjs` | `b15ba7789d674021b0d9084a325cccf9302e65ce96f3ca9a5937bed8a45db149` |
| `tools/release_candidate.py` | `8d4bef9fff7dec26cda8feab955192dd9a27e5b7ad40dd575092169c1aea41f3` |
| `tools/release_gate.py` | `9f801745ddae9cb2ca9c3ad9e10c752003fe4ca5b1b6778e41e7c576a775546a` |
| `tools/verify_release.py` | `e9c72e182ba3f5303a97d665cf6f84cd6450ec7c3bb6cd734eaf0537b6b86cff` |
