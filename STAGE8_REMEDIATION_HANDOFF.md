# Stage 8 remediation handoff — v3.3.0

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

**Public derivative.** This document is a sanitized derivative of the privately archived original `STAGE8_REMEDIATION_HANDOFF.md` (SHA-256 `6bf0800fc12f1a0b5916b8b6a03948f0191e06836e4872f90664271940c6c446`; `repository-before-cleanup.tar.gz`, member `repository/STAGE8_REMEDIATION_HANDOFF.md`). The original is not distributed in this public repository. Original dates, findings, verdicts, measurements, limitations and recorded source/evidence hashes remain historical; sanitization does not turn them into current acceptance claims.

Prepared 2026-10-23. **Revised candidate awaits independent reverification.** This is local remediation evidence, not an independent audit pass or final release acceptance. No publication is authorized.

## 1. Findings and current status

| Finding | Original severity | Status | Local outcome |
| --- | --- | --- | --- |
| F-01: Supported embedded comparisons omitted from ordinary warnings | MEDIUM, release blocker | **FIXED AND LOCALLY VERIFIED** | Retained supported embedded visual/structural evidence now enters warning selection with its correct scope and source. |
| F-02: Index generator permits an unapproved generation runtime | LOW | **FIXED AND LOCALLY VERIFIED** | Shared generation function rejects unapproved Deno/V8/TypeScript identities before generation or output writes. |
| Revised candidate's independent security audit and final release acceptance | — | **NOT YET VERIFIED** | Independent auditor must inspect these changes and rerun the cases separately. The original adverse audit verdict is not superseded by this report. |
| Existing bounded extraction/comparisons and unsupported matching coverage | — | **KNOWN LIMITATION** | Preserved; qualified component-specific limitations remain visible. |
| Additional demonstrated remediation blocker | — | **UNRESOLVED BLOCKER: none identified locally** | This does not assert the absence of undiscovered defects. |

The original report, `STAGE8_INDEPENDENT_SECURITY_AUDIT.md`, is unchanged. Its ZIP was inspected before edits: SHA-256 `f18d503b33a6ea57a4e9680d7dc2a921e2c40936cb2f9de7d7f8f9c1c6e8b2c6`. All 543 audit-inventory file hashes matched the starting checkout. The remediation starting inventory records 545 files, including that audit report and the existing ignored `.DS_Store`.

## 2. Verified reproductions

F-01, exact known-suffix case:

1. Open either edition of the preserved candidate.
2. Save `acmecorpaudit.com` in Personal Reference Domains; leave Expected Hostname empty.
3. Inspect `https://example.net/?next=https%3A%2F%2Facrnecorpaudit.com%2F`.
4. Before: original `example.net`, neutral **“No lookalike warnings found”**, and the child only in “Also Inside This URL”. Underlying embedded comparison already retained positive visual evidence.
5. After: actual original hostname remains `example.net`; primary scope **“Address found inside the URL”**, title **“Possible lookalike website”**, match **“acrnecorpaudit.com may resemble acmecorpaudit.com”**, explanation **“‘rn’ can look like ‘m’.”**, and **“Comparison source: Personal Reference Domains.”** The same child is no longer repeated in the embedded summary.

The original auditor's DOM cases were independently rerun on a preserved source copy. Saved, Expected and original-hostname comparisons; Unicode and complete-name-inside structure all exhibited the same omission. The known `.com` case establishes that unsupported automatic suffix eligibility is not the cause. Native Firefox captured the exact false-negative before and the corrected case after.

F-02, independently reproduced in an outside copy of the original sources:

```sh
deno run --cached-only --allow-read=. --allow-write=OUTSIDE_DIRECTORY tools/generate_lookalike_index.mjs --write --output-root OUTSIDE_DIRECTORY
```

Installed Deno 2.9.8 exited successfully and wrote both index and manifest before remediation. In this measured sample the index hash stayed `f34828ae9faa621a83d0d480a888b28985198bbcd90bd3763d18135fd23d0c9e`, but the manifest recorded the unapproved runtime. The existing downstream candidate validator rejected that metadata. After correction the same actual executable exits nonzero with **“Unreviewed index generation runtime; use the approved Deno 2.9.7 runtime before generating outputs”** and creates no output directory. Existing output/sentinel files also survive all simulated runtime-mismatch tests unchanged.

## 3. Verified root causes

F-01 is a presentation aggregation defect. The coordinator already retains embedded comparisons, source IDs, occurrence provenance and relationship proofs. `AutomaticUI.view` builds its presentation groups from built-in automatic findings. The selector consumed those groups and original-hostname manual comparisons, while its separate embedded pass added syntax/transport cautions. It never added supported custom embedded relationship proofs. The neutral fallback or an unrelated Expected mismatch therefore became the ordinary result. Engine detection, extraction and suffix policy were functioning as designed.

F-02 is a missing early guard in `generateIndex()`. It previously entered the generation environment and recorded the active runtime in the output manifest without first enforcing the approved identity. CLI write/check modes and imported calls share that function. Existing foundation-generation and downstream release checks remained strict; no evidence showed a release-verifier bypass. Identical measured index bytes under 2.9.8 do not establish determinism under arbitrary unapproved runtimes.

## 4. Exact corrections and files

Only eight preexisting files differ from the remediation starting inventory:

| File | Change |
| --- | --- |
| `src/results-presentation.js` | F-01: consume reconciled embedded `unicode-visual`, `ascii-visual` and `legacy-name-inside` proofs from Expected, personal-reference and original-hostname supports; feed existing warning selection/consolidation. |
| `tools/lookalike_data_lib.mjs` | F-02: first-operation guard in `generateIndex()` requires Deno 2.9.7, V8 15.0.245.2-rusty and TypeScript 6.0.3. |
| `data/lookalikes/manifest.json` | Strict regeneration updates only `generator.files["tools/lookalike_data_lib.mjs"]` for that guard's source hash. No index/data/policy/runtime pin changes. |
| `tools/release_gate.py` | Require the new current-candidate presentation regression and early generator runtime-rejection suites; 14 mandatory command groups. |
| `tools/release_candidate.py` | Bind four new permanent test source files into the enumerated candidate source inventory/archive, increasing inputs from 70 to 74. Verifier assertions unchanged. |
| `.github/workflows/deploy-pages.yml` | Invoke the new hash-checked historical wrapper instead of the prior wrapper directly. All dispatch/main/digest/authorization/action-pin protections retained. No workflow run or deployment performed. |
| `AUTOMATIC_FINDINGS.md` | Document supported embedded custom comparisons, neutral controls and consolidation. |
| `README.md` | Identify the independent findings and local remediation pending independent reverification. |

New executable/test sources are `tests/stage8-cases.mjs`, `tests/stage8-results.mjs`, `tests/stage8-generators.py`, `tests/stage8-firefox.mjs` and `tests/stage8-regressions.py`; `tests/stage8-source-boundaries.json` records six exact before/after historical interfaces. New evidence consists of `tests/stage8-remediation-{starting-inventory,before-dom,after-dom,results,generator-results,gate-results,release-results,historical-results,historical-suite-index,firefox-results,validation-notes,evidence,integrity}.json` and this handoff. The final integrity report enumerates every new and modified file with hashes; its own hash is deliberately excluded.

No engine/parser, reference storage, extraction, occurrence-provenance, CSS, template, disclosure-default or legal-notice sources changed. Existing AGENTS.md already mandates these rules and is unchanged. Prior test assertions and reports remain byte-identical.

## 5. Generalized result behavior

The correction uses retained proof rather than hostname examples. Exact membership, legitimate subdomains/parents and partial-name matches do not become cautions. Unsupported built-in matching cannot hide successful manual proof. Interrupted checks, unavailable data and bounded reconciliation retain their own coverage messages. Completed warning-free results still display the original qualified neutral message.

Existing priority and scope rules apply: supported child visual caution outranks an original Expected mismatch; stronger original userinfo can remain primary; independent HTTP cautions remain secondary warnings. Ports stay informational. Same-host identity mechanisms and repeated comparison sources consolidate; independent transport stays distinct. Occurrences and nested parents remain in the unchanged engine evidence and deliberate disclosures. No recovered address is represented as a verified redirect or contacted destination.

Unicode example: embedded `https://аcmеcorp.example/` compared with `acmecorp.example` displays **“Cyrillic letters ‘а’ and ‘е’ can resemble Latin letters ‘a’ and ‘e’.”** Browser hostname `xn--cmcorp-2nf6b.example` remains available, and the unsupported automatic `.example` limitation stays scoped separately. The wording uses the existing verified-character helpers.

Structural example: embedded `acmecorp.example.attacker.com` explains **“Having acmecorp.example inside this longer hostname does not make it that domain or one of its subdomains.”** Exact/legitimate-child/legitimate-parent and partial-name negative controls remain without new warnings.

## 6. New targeted regressions

`tests/stage8-cases.mjs` has 34 independent outcomes, exercised in each edition. Cases cover the exact auditor `.com` fixture; all three custom comparison sources; one/multiple Unicode confusables; complete-name-inside structure; exact/parent/subdomain/partial-name negatives; neutral originals and suspicious children; suspicious originals and neutral children; two warnings plus weak spelling information; same-host visual/userinfo/structural/HTTP combinations; informational ports; repeated and nested occurrences; built-in/custom deduplication; all three custom sources on one proof; invalid Expected input; partial extraction; and concealed userinfo/token/markup.

Eight additional tests cover interrupted or missing automatic data with successful manual proof, exhausted reconciliation with qualified coverage, privacy reveal cleanup, immutable result/provenance and unchanged saved-reference storage.

**76/76 tests and 1,804/1,804 assertions pass** on the final candidate. These DOM results are separate from native computed accessibility checks. The original auditor DOM script also reported zero missing embedded-warning findings after the correction; its supplemental after report was captured on the interim build with identical corrected application code, not used as final-candidate identity evidence.

## 7. Current and historical regression results

The final candidate's mandatory gate passes **14/14 command groups**:

| Current suite | Passed |
| --- | ---: |
| Foundation/PSL | 162/162 |
| Matcher stress | 27/27 |
| Existing final-copy messages/privacy/accessibility structure | 36/36 |
| New supported embedded presentation | 76/76 |
| Atomic worker lifecycle | 25/25 |
| Hosted update controls | 64/64 |
| Unit/official Unicode fixtures | 108,664/108,664 |
| Reference management | 70/70 |
| Embedded extraction/provenance | 34/34 |
| Unified comparisons | 56/56 |
| Comparison compatibility | 8/8 |
| Runtime mismatch/reproduction | 9/9 |

The remaining two groups are strict foundation and index reproduction checks; both pass. Separate Stage 7 release-hardening fixtures pass **17/17**, including deterministic double build, all-asset strict regeneration, complete original Majestic-file/subset verification, corrupt/missing assets, wrong runtime metadata, absent notices/archive, mixed releases, forged inventories and a deliberately failing mandatory gate.

The full preserved historical chain passes, including messaging 257, acceptance 52, follow-up 118, prominence 90, stress messages 58, HTTP/structure 134, final-copy 36 and earlier core/DOM/provenance/comparison/worker suites. The suite index contains 78 nested suite entries; repeated/nested counts must not be added together.

Historical suites bind old complete source interfaces. `stage8-regressions.py` checks current hashes, restores exactly the six recorded pre-remediation source interfaces in a disposable copy, then runs the unchanged prior chain. A prefetched baseline builder replaces only a Git lookup inside that disposable copy. Historical passes demonstrate preserved assertions on their exact old interfaces; the 14-group gate and 76 new tests verify the current candidate separately. This historical wrapper needs the full checkout/history and earlier fixtures, not only the distribution's scoped source archive.

An initial wrapper attempt stopped at a replacement-count assertion because its string also occurred inside a quoted nested-runner instruction. The wrapper was fixed by anchoring the actual statement to its newline/indentation; no historical expectation was edited. An initial sandboxed BiDi connection failed before browser session creation; reviewed loopback permission enabled the native run. Both attempts are recorded in `tests/stage8-remediation-evidence.json`. Final suites report no failures.

## 8. Generator and approved-data validation

The dedicated suite passes **10/10** with actual installed 2.9.8 rejection, plus Deno/V8/TypeScript mismatches for write and check, imported-call refusal, double strict generation and strict foundation/index checks. The mandatory CI form runs nine tests without assuming a second installed runtime. Simulated metadata mismatch cases are distinguished from the actual 2.9.8 executable test.

Strict executable SHA-256: `b73737579d5a84c160e3316487594783fa5c15f4e13252a6a07050b755317f1a`; approved runtime is Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3. Installed wrong-runtime binary SHA-256: `2e5e5177a25d6a89847f229996fc8f104db8985356f7608067de7a59a42059fe`.

Unchanged pins:

| Asset | SHA-256 |
| --- | --- |
| Complete original Majestic CSV | `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a` |
| Selected CSV | `01ddd1c4da949fb9d8c4a12b3ae4ca2dce22f9f6048764693553a65664cf5f55` |
| Normalized 9,570-domain records | `128daf34b6d5bce08217d2caad82b0e1d5fbca7e4c780505b4705d391589de4a` |
| PSL raw | `8228e4bdac6024c058a1e67859157e468a2613b826b53de0e5cae298e1b70755` |
| PSL compiled | `9be5bdf057a809aeef08699dc4c2c6095823c34cc32b82cd1d6bd96323aa6e59` |
| Unicode bundle | `806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1` |
| Foundation manifest | `24971b3e95142d1e751d0ab8eb283de6b073545553995957927c963e9c1fd5dc` |
| Lookalike index, 494,484 bytes | `f34828ae9faa621a83d0d480a888b28985198bbcd90bd3763d18135fd23d0c9e` |

The updated index manifest SHA-256 is `93e322005fcdc60baf1c7d39aeccc02233465c5c37bb8bfef2ef481a8cc41e91`. A parsed comparison confirms only the generator library source hash changed. No source snapshot was refreshed. Offline bundled legal/source/license text and NOTICES.txt are byte-identical to the audited candidate; licensing documentation is unchanged.

## 9. Native Firefox and accessibility

Native **headless Firefox 158.0.1, build 20261019185856**, disposable profile: **83/83 checks pass**. Both real `file:` and fixed loopback hosted editions run all 34 cases. **42 actual Firefox accessibility-locator name matches** cover primary and secondary scopes, targets and severities; live-region text is checked for the correct settled status/scope without private values or hostname dumps. This is native browser evidence, not a screen-reader usability claim.

Keyboard shortcut, Enter disclosures, reference-clear dialog initial focus/trap/Escape restoration, private reveals and clearing, no inspected-value persistence, safe rendering, existing collapsed defaults and secondary caution styling pass. There are 18 native layout measurements across 320-pixel windows and real 200%/400% zoom with no horizontal overflow. Before/after, Unicode, multiple-warning and zoom screenshots were captured; representative images were visually inspected. The single combined Blackberry & Amethyst design/CSS is unchanged.

Hosted verification reaches “Offline ready”, stops the server, reloads and reproduces the corrected custom warning with reference bytes retained and **zero additional served requests**. Observed requests stay on the application file/loopback resources; there are no inspected-destination requests or unexpected page errors. Native test extension is uninstalled, owned browser process/profile removed and server stopped. No user profile was used.

Before: native false-negative capture — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/288-before-F01.png` (SHA-256 `3641eb89072267cba81dbffa9a66285c7a283293f16fa640f43ce1457cb7f4a6`). After: corrected standalone capture — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/296-standalone-case-0.png` (SHA-256 `4b79a4e28418fff7db491d18dc150b26237af656181d129d1e7654bfdc87c33d`). 400% hosted capture — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/295-hosted-zoom-4.png` (SHA-256 `5afcf1b85126b038b55416ca46e341708c21cb9e08951f85ac13b9108453577c`).

**NOT YET VERIFIED:** manual VoiceOver, headful user acceptance, physical devices and independent audit of the revised candidate. Existing Stage 7 broader native upgrade/rollback evidence remains historical; this focused run separately checks the changed results, accessibility, layout, privacy and current offline behavior. Deployment has not been exercised.

## 10. Candidate identity and preservation

Branch remains `dev/v3.3.0-automatic-lookalikes`; HEAD and stable main both remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`. The staged index is empty. All prior development work remains local and uncommitted. Stable root site/standalone/manifest/checksum files remain unchanged. Of the 545 starting files, exactly the eight listed above changed; all other starting files, including all prior reports and the original audit, remain byte-identical.

Candidate version: **3.3.0-rc.1**. Release identity: **3.3.0-rc.1-946a50956b424613**. Enumerated 74-input source digest: `78923611b5530e0055e7460a4427fa354d53c3694f3e2cf48d00ea7fec155292`. This content digest identifies local source bytes; it is not a new Git commit or audit approval. The handoff/native helper/historical boundary and evidence reports are outside the distribution's enumerated build inputs and are covered by the separate checkout integrity inventory.

Two fresh complete builds are byte-identical for all eight artifacts. Expected changes are the executable-script/CSP hashes and HTML from the presentation correction, embedded index-manifest generator-source identity, worker release/HTML hash, source archive's revised/new sources, build manifest and checksums. CSS, data payloads, legal blocks, NOTICES.txt and site/.nojekyll are unchanged. The verifier reconstructs source correspondence and enforces complete inventories; no acceptance pins were weakened.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `standalone/Offline_URL_Inspector.html` | 4043850 | `ea5dc48b27ddab8db3ceef4bb3bf2cba8bc92ea590261405c645f4913e9145cf` |
| `site/index.html` | 4055910 | `946a50956b4246133909432bd0980042c4eeec09d73d51824bdd0ed8ab84bf75` |
| `site/sw.js` | 4153 | `499a3d9beec6bb918dd7fdb2987bf70d25c8c019a01baaa7f478a95adc8dce4a` |
| `site/.nojekyll` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `NOTICES.txt` | 32246 | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `source-materials.zip` | 2808482 | `ee1d4848d9094d302c26e40eb7ee87be9a5d95694ad9375f207e8e916b4c15a4` |
| `build-manifest.json` | 17135 | `12b4d458e70bd96b79bdffa8907e09e4bcbed11a7b131532e62a3338bdaffd47` |
| `SHA256SUMS` | 595 | `ab46a17f351d4c11b39f62a061b044d22f116804296acb0d666b843992af6c09` |

Fresh standalone preview: Offline URL Inspector — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/017-Offline_URL_Inspector.html` (SHA-256 `ea5dc48b27ddab8db3ceef4bb3bf2cba8bc92ea590261405c645f4913e9145cf`). Hosted artifacts, source materials, notices and checksums are alongside it under `<private remediation candidate>`. No preview was created inside the repository. Temporary paths may eventually be removed by the operating system; preserve these bytes for independent review if moving them.

## 11. Remaining risks and limits

- **KNOWN LIMITATION:** results depend on bounded, pinned local evidence. A visual resemblance is not an allegation of malicious intent; no negative result establishes safety, ownership or remote behavior.
- **KNOWN LIMITATION:** supported custom comparisons coexist with deliberately unsupported automatic suffixes and component-specific resource limits. The new tests exercise those distinctions without broadening detection policy.
- **NOT YET VERIFIED:** the revised candidate has not received independent approval. Further audit may identify other defects; do not treat these local passes as release authorization.
- **UNRESOLVED BLOCKER:** none additional reproduced locally during this remediation. The release gate remains the auditor's separate reverification/final acceptance, followed by explicit publication authorization.

## 12. Exact independent reverification instructions

Use this full existing checkout, its untouched prior assertions and the original audit ZIP. First verify the branch/HEAD, empty staged index, candidate hashes above and `tests/stage8-remediation-integrity.json`. Do not replace snapshots, repin historical assertions, edit main or publish.

These are historical remediation-era commands, not current-candidate acceptance instructions. Set `OUI_REPOSITORY` to the full retained checkout, `OUI_DENO_297` to the verified approved executable, `OUI_UNAPPROVED_DENO` to the actual historical 2.9.8 executable, and `OUI_MAJESTIC_SOURCE` to the approved original CSV. Supply real absolute paths yourself and verify the recorded hashes; no placeholder names below denote existing files. The shell checks reject unset variables. Keep all report/build writes outside the source checkout.

```sh
: "${OUI_REPOSITORY:?Set the retained repository path}"
: "${OUI_DENO_297:?Set the verified Deno 2.9.7 executable}"
: "${OUI_UNAPPROVED_DENO:?Set the actual historical Deno 2.9.8 executable}"
: "${OUI_MAJESTIC_SOURCE:?Set the approved original CSV path}"
cd "$OUI_REPOSITORY"
OUI_STAGE8_REVERIFY=$(mktemp -d /private/tmp/oui-stage8-reverify-XXXXXX)
python3 -B tools/build.py --release-candidate --output-root "$OUI_STAGE8_REVERIFY/one"
python3 -B tools/build.py --release-candidate --output-root "$OUI_STAGE8_REVERIFY/two"
python3 -B tools/verify_release.py --candidate-root "$OUI_STAGE8_REVERIFY/one"
python3 -B tools/release_gate.py --candidate-root "$OUI_STAGE8_REVERIFY/one" --deno "$OUI_DENO_297" --report "$OUI_STAGE8_REVERIFY/gate.json"
python3 -B tests/stage8-generators.py --deno "$OUI_DENO_297" --unapproved-deno "$OUI_UNAPPROVED_DENO" --report "$OUI_STAGE8_REVERIFY/generators.json"
python3 -B tests/stage7-release.py --task-root "$OUI_STAGE8_REVERIFY" --deno "$OUI_DENO_297" --majestic-source "$OUI_MAJESTIC_SOURCE"
python3 -B tests/stage8-regressions.py --candidate-root "$OUI_STAGE8_REVERIFY/one" --report "$OUI_STAGE8_REVERIFY/historical.json"
```

The gate includes `stage8-results.mjs` on both final editions and strict generation checks. Inspect its 14 groups individually; do not count the restored historical interfaces as current correction tests. `stage7-release.py` checks double-build equality and negative artifact/source fixtures without publishing.

For native reverification, open a separate terminal and set `OUI_STAGE8_REVERIFY` there to the same temporary path created above. Use a fresh dedicated profile (ports 9308/9309 must be free):

```sh
mkdir "$OUI_STAGE8_REVERIFY/firefox-profile"
/Applications/Firefox.app/Contents/MacOS/firefox --headless --no-remote --profile "$OUI_STAGE8_REVERIFY/firefox-profile" --remote-debugging-port 9308 about:blank
```

Then run from the checkout with the same variables in the harness terminal. Set `OUI_BEFORE_ROOT` to the retained licensing-era candidate whose standalone hash is specified below; this is a historical fixture, not a current public download:

```sh
: "${OUI_BEFORE_ROOT:?Set the verified historical before-candidate path}"
"$OUI_DENO_297" run --cached-only --allow-read=.,"$OUI_STAGE8_REVERIFY","$OUI_BEFORE_ROOT" --allow-write="$OUI_STAGE8_REVERIFY" --allow-net=127.0.0.1:9308,127.0.0.1:9309 tests/stage8-firefox.mjs --task-root="$OUI_STAGE8_REVERIFY" --before-root="$OUI_BEFORE_ROOT"
```

This helper expects the unchanged before standalone SHA-256 `b17a482ea5b914b6c9e9e58d55ef96c2acba6fc7b37b1898fb14a646fed9ad0f` and fresh current artifacts under `one/`; independently verify both before running. Inspect Firefox report/screenshot output, all 34 cases per edition and native accessibility matches. The helper stops its server and uninstalls its test extension; stop only the owned Firefox process/profile after the run. Manual headful/VoiceOver acceptance remains a separate task.

Finally repeat the exact F-01 saved-reference case manually; vary it with Expected/original comparisons, Unicode/structure, `.example` limitations, HTTP, repeated occurrences and the neutral controls. Inspect the F-02 early guard and rejection on both empty and preexisting output directories. Independently review source changes in `src/results-presentation.js` and `tools/lookalike_data_lib.mjs`, verify immutable retained engine/provenance evidence, and issue a new independent verdict tied to the revised source digest.
