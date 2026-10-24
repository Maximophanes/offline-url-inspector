# Stage 8 independent remediation reverification

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

**Public derivative.** This document is a sanitized derivative of the privately archived original `STAGE8_REVERIFICATION.md` (SHA-256 `191e1e1367db06bddd634deec27e7b5ee3b1c09f5a2ebc01ce7303f09353cf53`; `repository-before-cleanup.tar.gz`, member `repository/STAGE8_REVERIFICATION.md`). The original is not distributed in this public repository. Original dates, findings, verdicts, measurements, limitations and recorded source/evidence hashes remain historical; sanitization does not turn them into current acceptance claims.

23 October 2026. **READY FOR FINAL RELEASE ACCEPTANCE.**

The original **MEDIUM release-blocking F-01** and **LOW F-02** are independently verified as resolved in the exact revised candidate identified below. The original failure no longer produces a contradictory warning-free result. The fix handles retained embedded evidence generally, without hostname-specific exceptions. The demonstrated wrong-runtime generator command now refuses before writing output. No new or unresolved release-blocking defect was established by this reverification.

This verdict means the corrected candidate may proceed to final release acceptance. **It does not approve deployment, publication, a final-version rebuild, or completion of the outstanding manual acceptance tasks.** Headful Firefox, VoiceOver, physical-device and OS file-dialog acceptance remain NOT TESTED. Live Pages/Actions execution remains NOT TESTED.

The original [independent audit](STAGE8_INDEPENDENT_SECURITY_AUDIT.md) remains unchanged as historical evidence. This report supersedes its readiness verdict only for this revised identity. All **564 starting inventory files remained unchanged throughout this reverification**. Only this report was added to the repository. No application/data correction, staging, commit, push, PR, merge, deployment or change to stable `main` occurred.

## 1. Current candidate identity and comparison baseline

| Identity | Independently verified value |
|---|---|
| Repository | `<repository>` |
| Branch | `dev/v3.3.0-automatic-lookalikes` |
| HEAD and local `main` | `664cc58bf67a2127d0523adec9f1d80c6edd656e` |
| Staged index | Empty and unchanged |
| Preserved stable edition | v3.2.0; root stable distribution files unchanged |
| Revised version / runtime release | `3.3.0-rc.1` / `3.3.0-rc.1-946a50956b424613` |
| Revised 74-input source digest | `78923611b5530e0055e7460a4427fa354d53c3694f3e2cf48d00ea7fec155292` |
| Starting inventory | 564 Git-visible files, 41,592,684 bytes |
| Starting inventory SHA-256 | `7a2b6d421d74bb9de958b50bf972290bedeecf47ebd98ed2294dc73e19cc5c98` |
| Original audited runtime release | `3.3.0-rc.1-0af3824ff7dd5cb8` |
| Original 70-input source digest | `30037cdc15185edeb644fcf875e22245dbc5c782af420a8a005f66c30fbc393f` |
| Original report SHA-256, unchanged | `9ae71f0cadbbde48b25457a914ed3a6a3d74979a1117c62ba3df0cd95a356227` |
| Original evidence ZIP SHA-256, independently checked | `f18d503b33a6ea57a4e9680d7dc2a921e2c40936cb2f9de7d7f8f9c1c6e8b2c6` |

The inventory digest hashes sorted `SHA256`, two spaces, repository-relative path and LF records. It covers tracked and untracked candidate files; incidental Git-ignored OS metadata and `.git` are outside it. The release source digest uses the builder's separate canonical 74-input inventory. Neither digest is a new immutable Git commit, and HEAD alone cannot identify this uncommitted candidate.

Two fresh builds and verifier rebuilds reproduce all eight outputs exactly. They also match the developer's final package at `<private remediation candidate>` byte for byte. Artifact and changed-source hashes are recorded in the appendix.

Read the actual AGENTS instructions, original audit/evidence and reproduction cases, remediation handoff, relevant Stage 7 hardening and superseding licensing materials, complete remediation diff, modified production sources and new tests. Developer-reported results were treated as claims until independently rerun or replaced with independently authored checks.

## 2. Original findings and updated disposition

| Finding | Original severity / impact | Independent disposition |
|---|---|---|
| F-01: successful embedded comparisons omitted from ordinary warnings | MEDIUM / RELEASE BLOCKER; a completed positive could coexist with “No lookalike warnings found” | **VERIFIED RESOLVED** for this candidate; original fixtures and generalized variants now retain scoped cautions |
| F-02: index generation wrote under an unapproved runtime | LOW; developer could mutate outputs under Deno 2.9.8, though downstream release validation rejected them | **VERIFIED RESOLVED**; actual 2.9.8 write/check/imported calls refuse early without output mutation |
| New or remaining reproduced defect | — | None established in the performed review and tests |

No remaining RELEASE BLOCKER is assigned. Finite comparison/extraction coverage and unperformed platform acceptance are explicitly retained in sections 11–12; they are not converted into successful checks or concealed by this verdict.

## 3. Exact remediation changes and scope review

Relative to the original 543-file audit inventory, exactly **eight preexisting files changed**, no file disappeared, and 21 files were added. One addition is the original audit report itself; the other 20 are the documented remediation handoff, test sources, historical boundaries and evidence. The full name/hash comparison is preserved in `remediation-delta.json` and `remediation.patch`.

| Changed file | Independent assessment |
|---|---|
| `src/results-presentation.js` | Adds selection of supported embedded visual and `legacy-name-inside` relationship proofs, with source labels and existing consolidation/priority rules |
| `tools/lookalike_data_lib.mjs` | Adds an early exact Deno/V8/TypeScript identity guard in shared `generateIndex()` |
| `data/lookalikes/manifest.json` | Only `generator.files["tools/lookalike_data_lib.mjs"]` changes; strict regeneration reproduces it |
| `tools/release_gate.py` | Adds current embedded-result regression and generator-refusal checks; existing requirements remain |
| `tools/release_candidate.py` | Adds four permanent test sources to the input/archive allowlist, increasing 70 inputs to 74; verifier assertions are unchanged |
| `.github/workflows/deploy-pages.yml` | Replaces the historical-runner command with the new hash-checked wrapper; other deployment protections are retained |
| `AUTOMATIC_FINDINGS.md` | Documents supported custom-source embedded warnings and neutral controls |
| `README.md` | Accurately describes remediation as awaiting independent review |

New executable sources reviewed: `tests/stage8-cases.mjs`, `tests/stage8-results.mjs`, `tests/stage8-generators.py`, `tests/stage8-firefox.mjs`, `tests/stage8-regressions.py`. The six recorded historical source boundaries were checked against the original audit snapshot and current hashes. They preserve old assertions on their old interfaces rather than weakening current expectations.

No unexpected or unrelated modification was found. Parser, matcher, reconciliation, embedded extraction/provenance, reference-storage code, schemas, datasets/index contents, CSS, template, hosted lifecycle and worker source remain identical to the original audit. Existing assertions, reports, legal notices and licensing documentation remain preserved. The index manifest's authorized generator-source identity update is not a dataset or detection-policy change.

## 4. Independent reproduction of F-01

The first product check after rebuilding replayed the original auditor's retained DOM script, rather than beginning with the developer's new assertions. All original affected source/method variants now produce cautions in both editions.

Exact original reproduction, independently confirmed again in actual native Firefox file and loopback editions:

1. Save personal reference `acmecorpaudit.com`.
2. Leave Expected Hostname empty.
3. Inspect this text without opening it:

```text
https://example.net/?next=https%3A%2F%2Facrnecorpaudit.com%2F
```

| Result element | Original audited candidate | Revised candidate |
|---|---|---|
| Actual original hostname | `example.net` | `example.net` |
| Primary scope | Original/neutral result | **Address found inside the URL** |
| Headline | **No lookalike warnings found** | **Possible lookalike website** |
| Evidence | Positive remained in deeper embedded comparison records | **acrnecorpaudit.com may resemble acmecorpaudit.com**; **“rn” can look like “m”** |
| Source attribution | Missing from ordinary warning | **Personal Reference Domains** |
| Caution count | 0 | 1, without a duplicate child summary |

No contradictory negative headline or reassuring “no notable resemblance” explanation remains in the ordinary result. A neutral original host no longer determines the whole-inspection conclusion when the retained child evidence supports a caution.

The original additional cases were rechecked independently:

- Expected Hostname comparison: the embedded visual caution leads; the outer original-host mismatch remains a separate caution.
- Comparison to the initial hostname: the embedded resemblance survives automatic `.example` ineligibility.
- Unicode comparison: Cyrillic small a **U+0430** versus Latin small a **U+0061** receives a supported Unicode explanation, with correct browser/readable identity and qualified automatic coverage.
- Structural comparison: `acmecorp.example.attacker.com` receives the supported comparison-name placement caution.
- Direct top-level control remains correctly scoped to the original address.

The known-suffix `.com` example and deliberately unsupported `.example` examples both pass. The resolution therefore does not depend on suppressing limitations or restricting the correction to a particular suffix/provider.

## 5. Root-cause and correction assessment

The original detector and coordinator already retained the necessary positives. The presentation formerly consumed built-in finding groups and top-level manual comparisons while omitting embedded custom-source relationship proofs.

At `src/results-presentation.js:126–150`, the correction now reads reconciled relationships, selects embedded source records, and accepts verified `unicode-visual`, `ascii-visual`, or specifically `structural` / `legacy-name-inside` proof. It filters support to the existing Expected Hostname, personal-reference or original-hostname methods. The new candidates enter the existing caution selection, priority, per-host consolidation and source-scope handling.

This is a general correction: there are no hostname/brand/test-fixture exceptions. Exact identity, legitimate parent/subdomain relationships and partial-name substrings are not promoted to structural cautions. The existing character/proof helpers supply explanations; the change does not invent character substitutions or classify every mismatch as visual resemblance.

Visual and structural child candidates retain the existing relative priorities, with independent original userinfo/HTTP and recovered HTTP evidence preserved. Built-in/custom proofs and repeated occurrences consolidate. Multiple distinct recovered hosts still retain independent warnings. A successful manual comparison remains visible when automatic data is missing, time/pair/host-limited, or ineligible. Exhausted reconciliation produces a processing limitation rather than a completed negative.

Tests also call the selector with deeply frozen coordinator results and compare their serialized evidence before/after. No mutation of engine evidence, reference state or provenance was observed. The reviewed correction adds no network, storage, HTML injection, export or navigation capability.

## 6. New independently designed tests

The auditor authored **49 new scenario definitions**, separate from the developer's 34-case corpus. They use different custom names and vary three comparison sources across query, fragment and path carriers. Other combinations include:

- Neutral original with a strong child; strong original with a neutral child.
- Three distinct recovered positives plus an unrelated recovered host.
- Repeated children, distinct nested parents, and mixed HTTP/HTTPS/port appearances of one hostname.
- Exact original Expected/personal matches with a suspicious child, invalid optional Expected input, and all three comparison sources supporting one target.
- A different Cyrillic/Latin custom target; structural placement crossing a PRIVATE hosting boundary.
- Exact/parent/subdomain/substring negative controls and a genuinely completed warning-free control.
- Repeated-occurrence exhaustion, an additional permitted encoding layer, missing index, zero automatic time/host/pair budgets and exhausted relationship reconciliation.
- Sensitive userinfo/token/parameter/markup concealment, deliberate reveal cleanup, and rapid final-inspection replacement.

Executed in both editions: **110/110 DOM checks, 1,632/1,632 assertions**. This includes 98 scenario executions and 12 independent coverage/privacy controls. The oracle checks explicit warning counts/scopes/sources, neutral/informational behavior, accessible-reference validity, preserved successful proofs and immutable evidence. It does not merely assert that one headline changed.

All 49 scenarios were also exercised in native Firefox in both editions: **98 native scenario executions** within the 129-check independent native runner. The original audit's separate engine matrix was rerun as a regression control: **3,548/3,548 checks** covering 175 parsing cases, 25 matching controls, 3,316 independent PSL-oracle comparisons, 19 embedded/provenance scenarios, nine bounded stress cases and four reference-rejection cases. These are regression controls, not 3,548 new remediation-specific scenarios.

Evidence: `independent-fixtures.json`, `independent-dom.json`, `original-reproductions.json`, `independent-engine.json`, and `native-independent.json`. These checks are distinct from the developer's tests, which also passed independently through the gate.

## 7. Browser, accessibility and remaining interaction evidence

Native engine independently observed: macOS Firefox **158.0.1**, build **20261019185856**, `moz:headless: true`, fresh disposable profile. Inspected addresses remained input text; only local application files and fixed loopback resources were opened.

| Area | Independently performed result |
|---|---|
| Original failure and related source/method variants | Corrected in both actual file and hosted editions |
| Independent native matrix | **129/129 checks passed**, including original reproductions, 98 new scenario executions, parsing, privacy, keyboard, layout, offline, upgrade/rollback |
| Native hostname authority | 175 cases per edition, **350 executions**, no accepted hostname/port disagreement with native URL parsing |
| Computed accessible names | **40 verified matches**: 28 custom-case names and 12 mixed-scope warning/information names |
| Corrected warnings at narrow/zoom widths | **18/18 layouts**: custom ASCII, Unicode and three-source explanations at 320px and actual 200%/400% tab zoom in both editions |
| Additional mixed-scope zoom/reflow | Six layouts passed; effective zoom widths 640px/320px, no measured document overflow |
| Keyboard/focus | Native WebDriver key events verify inspection shortcut, Enter disclosure, dialog initial focus, Tab trap, Escape and restored focus in both editions |
| Privacy/state reset | Default concealment, deliberate private reveal, unmount on collapse, no inspected-secret storage, no markup/link nodes, no stale result contamination |
| Import review | Native File/DataTransfer/change-event pipeline verifies review-before-apply, merge, invalid-file preservation and replace cancellation/confirmation |
| Export | Actual export-handler Blob content/schema checked; anchor download suppressed, so no filesystem-download claim |
| Extra import/export/stress runner | **14/14 checks passed**, with successful ordinary recovery after bounded difficult inputs |

The corrected original-case screenshot and three-source 400% screenshot were visually inspected, alongside recorded native layout metrics. The single combined palette, typography and CSS remain unchanged. Native error/live-region text and accessible-reference wiring are verified; spoken announcement behavior is not.

Native requests observed during inspection stayed on file/loopback application resources or local data-font events. Expected favicon attempts were blocked by CSP; no unexpected page error or inspected-destination request was recorded. Static tracing additionally confirms that inspected values do not reach the fixed worker fetch/update paths.

**NOT TESTED:** headful manual Firefox, VoiceOver, physical/mobile devices, Safari/other browsers, actual OS file-picker dialogs, actual backup download/save dialogs and a complete manual keyboard-only walkthrough. Reassessment via Computer Use could list apps, but selecting Firefox returned **“Computer Use permissions are not granted.”** No native-input workaround or screen-reader acceptance claim was made. Computed names and headless key events do not replace those tasks.

The audit-owned Firefox process was identified from its returned profile/PID and stopped after testing. Loopback servers were shut down, temporary zoom helpers uninstalled, and no personal browser profile was used.

## 8. Independent F-02 generator reproduction and integrity

The original command was replayed using the actual unchanged installed Homebrew Deno **2.9.8** and a new outside output path:

```sh
deno run --cached-only --allow-read=. --allow-write=OUTSIDE_DIRECTORY \
  tools/generate_lookalike_index.mjs --write --output-root OUTSIDE_DIRECTORY
```

**Actual revised behavior:** nonzero exit with **“Unreviewed index generation runtime; use the approved Deno 2.9.7 runtime before generating outputs”**. No output directory/files are created. An actual wrong-runtime `--check` preserves existing invalid sentinel outputs. An imported `generateIndex()` call under actual 2.9.8, without granting data-read permissions, reports the runtime error before any data-read capability is required.

The early guard is the first operation in `tools/lookalike_data_lib.mjs:11–13`, before `environment()` or output generation. It requires exact Deno **2.9.7**, V8 **15.0.245.2-rusty** and TypeScript **6.0.3**. CLI and imported calls share that guard. It does not weaken or replace downstream manifest/data validation.

Independently authored generator checks: **9/9 passed**. Besides actual-runtime write/check/imported refusal, they cover conflicting modes, unknown arguments, missing/flag-shaped/duplicate output-root arguments, accurate error diagnostics and corrupt external `--check` output refusal without fallback or mutation.

The developer's dedicated generator suite was independently rerun with the actual wrong binary: **10/10 passed**. Its simulated Deno/V8/TypeScript mismatch cases remain identified as simulations; its actual 2.9.8 test is distinct. The mandatory gate's form runs nine checks without assuming a second installed runtime. Strict double generation matches the current manifest and original index; foundation/index checks and downstream corruption rejection remain enforced.

Verified isolated binary SHA-256: `b73737579d5a84c160e3316487594783fa5c15f4e13252a6a07050b755317f1a`, with the exact approved version tuple. Its bytes equal the contained executable in the retained official archive SHA-256 `5cd46d6268f6f78f5d88bdc7159d20bd44cdaa4b3303474839f87ec6fe7ae25c`, whose official identity was independently checked in the original audit. The installed 2.9.8 executable remains `2e5e5177a25d6a89847f229996fc8f104db8985356f7608067de7a59a42059fe`. No global runtime replacement/update occurred.

## 9. Relevant existing and historical regression results

All relevant existing regressions below were **executed during this reverification**, not merely read from developer receipts:

| Suite / group | Fresh outcome |
|---|---|
| Mandatory current release gate | **14/14 groups passed** |
| New supported embedded-result regression | **76/76 cases, 1,804/1,804 assertions** |
| Existing current final-copy/privacy/accessibility structure | **36/36, 930/930 assertions** |
| Foundation/PSL | **162/162, 49,099/49,099 assertions** |
| Current matcher | **27/27, 19,335/19,335 assertions** |
| Core/official Unicode fixtures | **108,664/108,664, 112,223/112,223 assertions** |
| References | **70/70, 135/135 assertions** |
| Embedded provenance | **34/34, 821/821 assertions** |
| Unified comparisons / compatibility | **56/56 and 8/8** |
| Worker / hosted controls | **25/25 and 64/64** |
| Strict foundation/index reproduction | Both byte checks passed |
| Gate's early-runtime rejection suite | **9/9** |
| Dedicated generator rerun with actual wrong binary | **10/10** |
| Stage 7 release-integrity/strict generation negatives | **17/17** |
| Preserved historical chain through `stage8-regressions.py` | Passed, no failed command chain |

The historical runner was inspected before invocation from the original checkout. It copies sources, restores six exact hash-checked pre-remediation interfaces in a disposable copy, reads the unchanged Git baseline, and writes its report to an explicit outside path. Existing historical assertions and prior reports in the user's checkout were not rewritten. Nested restored-interface outcomes are not current remediation proof and must not be summed with current gate counts.

The developer's reported 83 native checks and 42 accessible names remain developer evidence; they were not relabeled as this auditor's native run. The auditor instead performed the distinct 129-check/40-name matrix, 14 extra interaction/stress checks and 18 corrected-content layouts described above.

## 10. Release-gate and Stage 7 hardening revalidation

**VERIFIED:** two fresh complete builds and source-correspondence verifier rebuilds are byte-identical across all eight artifacts and match the developer's revised package. Version remains explicitly `3.3.0-rc.1`; manifest identity, exact script/style CSP, worker/HTML pairing, expanded source inventory, checksums and publication-disabled metadata are consistent.

The 17 fresh release tests reject missing/corrupt index, truncated subset, wrong runtime metadata, missing legal notice/archive, mixed releases, stale version, unexpected distribution asset, checksum mismatch and forged inventories. A controlled failed prerequisite makes the mandatory gate fail. The remediation did not remove or relax verifier assertions. Four independently authored artifact checks additionally verify double-build bytes, 74-source archive correspondence, dataset identity equality and exact old/new legal/data/style block preservation.

Approved datasets remain unchanged:

| Asset | SHA-256 |
|---|---|
| Original Majestic CSV | `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a` |
| Selected CSV | `01ddd1c4da949fb9d8c4a12b3ae4ca2dce22f9f6048764693553a65664cf5f55` |
| Normalized records | `128daf34b6d5bce08217d2caad82b0e1d5fbca7e4c780505b4705d391589de4a` |
| PSL raw | `8228e4bdac6024c058a1e67859157e468a2613b826b53de0e5cae298e1b70755` |
| PSL compiled | `9be5bdf057a809aeef08699dc4c2c6095823c34cc32b82cd1d6bd96323aa6e59` |
| Unicode bundle | `806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1` |
| Foundation manifest | `24971b3e95142d1e751d0ab8eb283de6b073545553995957927c963e9c1fd5dc` |
| Lookalike index | `f34828ae9faa621a83d0d480a888b28985198bbcd90bd3763d18135fd23d0c9e` |

Both HTML editions' complete legal blocks, preferred PSL source/transformation material, MPL text, Majestic attribution, Unicode/data blocks and lookalike notice are byte-identical to the original audited candidate. `NOTICES.txt` and CSS are identical. The 74-input archive contains every enumerated source with matching bytes. The only changed index-manifest field is the authorized generator-library source hash. The original Majestic licensing resolution is preserved; **no specific contradictory evidence was found and no speculative legal question was reopened**. This is preservation of the prior scoped assessment, not a new universal legal warranty.

Native fresh-profile upgrade/rollback rehearsal passed: controlled v3.2.0 → mismatched/truncated update refusal → deliberate revised-candidate activation → candidate offline reload → deliberate matched v3.2.0 rollback → stable offline reload. Reference JSON bytes remained unchanged across successful transitions. Offline reloads after server shutdown produced zero additional served requests. Fixed worker scope/fetch behavior, retained-cache safeguards and storage schema/key are unchanged; current worker and hosted-control suites passed.

Workflow review confirms the sole changed command selects the new historical wrapper. Manual dispatch/main/authorization/source-digest/commit checks, immutable action references, isolated runtime checksum, job dependencies, read-only verification permissions, deployment-only Pages/OIDC permissions and stale-main check remain. No workflow or repository setting was invoked or changed.

**NOT TESTED:** actual Linux/GitHub runner execution, cross-toolchain archive equality, live Pages/CDN/update/header behavior, real multi-tab/eviction scenarios, environment protection configuration and live rollback deployment. Local simulation/native loopback evidence does not establish those properties on the deployed origin.

## 11. New or unresolved defects and known limitations

No new or unresolved implementation defect was reproduced that requires another correction handoff. Both original findings are closed for this identity; no fix was performed by this auditor.

**KNOWN LIMITATIONS:** finite pinned references and conservative matching policy; bounded extraction/decoding/occurrence/resource coverage; unsupported full RTL/Bidi and deferred encodings; browser-dependent file storage and shared-origin hosted reference storage; integrity checks that do not authenticate a compromised initial delivery. These retain the original audit's limits and current qualified messages. No negative result proves safety, ownership, maliciousness or a confirmed redirect.

Bounded difficult-input checks recovered normally. Fresh native settled-layout samples ranged approximately **6–171 ms** in the small extra test run; these are not field percentiles, cold-start measurements or peak-memory certification. No uncontrolled stress test, destination request, dataset refresh, global runtime change or storage-policy expansion occurred.

## 12. Remaining final acceptance requirements

| Requirement | Status / next evidence |
|---|---|
| Original F-01 misleading negative classification | **VERIFIED resolved** in DOM and both native editions, including new generalized combinations |
| Original F-02 wrong-runtime output mutation | **VERIFIED resolved** using actual wrong binary and strict reproduction |
| Build/data/legal preservation and current prerequisites | **VERIFIED** for this exact source/package identity |
| Native narrow/reflow/real zoom | **VERIFIED** in headless Firefox, including corrected warnings |
| Keyboard shortcut/disclosure/dialog events and focus | **VERIFIED** through native WebDriver events; full headful keyboard-only acceptance remains NOT TESTED |
| Import review/replacement/error pipeline | **VERIFIED** through native File/DataTransfer input; OS picker NOT TESTED |
| Export JSON/schema/content | **VERIFIED** with actual download suppressed; filesystem save/download acceptance NOT TESTED |
| Local controlled upgrade/offline/rollback | **VERIFIED** in isolated native Firefox loopback profile; live deployment and multi-tab acceptance NOT TESTED |
| Headful Firefox manual acceptance | **NOT TESTED** — computer-use permission unavailable |
| VoiceOver on macOS | **NOT TESTED** — computed names/live-region wiring are not spoken-output acceptance |
| Physical/mobile devices and Safari/other browsers | **NOT TESTED** |
| Actual GitHub Actions/Linux/environment protections/Pages | **NOT TESTED**; requires separately authorized final acceptance/deployment work |
| Final immutable commit and final v3.3.0 artifact identity | **NOT TESTED**; future authorized commit/version promotion must be compared with accepted inputs and reverified |

Remaining NOT TESTED items are acceptance obligations, not silently completed requirements. They must be explicitly completed or addressed in the user's final acceptance decision before any separately authorized release/deployment. This report supplies neither that decision nor permission to begin a later stage.

## 13. Updated verdict, evidence and preservation

**READY FOR FINAL RELEASE ACCEPTANCE.** Criteria met: both independently reported defects are resolved at their roots; original reproductions pass; genuinely warning-free and neutral controls remain qualified; successful custom child warnings survive unsupported/partial automatic coverage; independent transport/syntax cautions, privacy, provenance and accessible scopes are retained; strict generation, deterministic packaging, integrity negatives, current gate and historical regressions pass; no unexpected source/data change or new blocker was established.

This is a bounded independent reverification of the revised candidate, not proof that no undiscovered defect exists. It authorizes no deployment and does not collapse the outstanding manual/platform acceptance list.

Durable evidence:

- Reverification evidence directory — private evidence `stage8-reverification-evidence.zip` (SHA-256 `8977e8a73a5d38843e85f25682d3d65bc1ccef1339de74fdacc39b1fd2e87dc9`)
- Complete reverification evidence ZIP — private evidence `stage8-reverification-evidence.zip` (SHA-256 `8977e8a73a5d38843e85f25682d3d65bc1ccef1339de74fdacc39b1fd2e87dc9`)

Evidence ZIP SHA-256: `8977e8a73a5d38843e85f25682d3d65bc1ccef1339de74fdacc39b1fd2e87dc9`.

It preserves the exact 564-file starting source archive, rebuilt candidate, complete eight-file remediation diff, inventories, independent scripts/fixtures, test reports/logs, native screenshots and final integrity receipt. Runtime executables, dependency caches, browser profiles, full-million source CSV and Git internals are excluded. Evidence files have their own manifest. The original audit report and its evidence ZIP are retained separately and unmodified.

Scratch root: `<private reverification scratch directory>`. All write-capable testing occurred outside the repository. The original checkout was used only for inspected read-only source/baseline access and the historical runner that writes to outside paths. Independent test sources were added only to the disposable source copy.

Final integrity verification found **zero modified or missing starting files**. Branch, HEAD, local `main` and empty index remain unchanged. The only repository addition made during reverification is `STAGE8_REVERIFICATION.md`. Work stops with this report; no staging, commit, push, merge, PR, release or deployment occurred.

## Appendix: exact release outputs and modified source hashes

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `NOTICES.txt` | 32246 | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `SHA256SUMS` | 595 | `ab46a17f351d4c11b39f62a061b044d22f116804296acb0d666b843992af6c09` |
| `build-manifest.json` | 17135 | `12b4d458e70bd96b79bdffa8907e09e4bcbed11a7b131532e62a3338bdaffd47` |
| `site/.nojekyll` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `site/index.html` | 4055910 | `946a50956b4246133909432bd0980042c4eeec09d73d51824bdd0ed8ab84bf75` |
| `site/sw.js` | 4153 | `499a3d9beec6bb918dd7fdb2987bf70d25c8c019a01baaa7f478a95adc8dce4a` |
| `source-materials.zip` | 2808482 | `ee1d4848d9094d302c26e40eb7ee87be9a5d95694ad9375f207e8e916b4c15a4` |
| `standalone/Offline_URL_Inspector.html` | 4043850 | `ea5dc48b27ddab8db3ceef4bb3bf2cba8bc92ea590261405c645f4913e9145cf` |

| Modified input | Original audit SHA-256 | Revised SHA-256 |
|---|---|---|
| `src/results-presentation.js` | `cc25a112f6f9f4e0a185b47d40f78dc5e6979513d708d373ccb48bd23ad3740f` | `e87e82e11b2df1824082f65b1c345e013de9069334626d2e603397a0ecd4663d` |
| `tools/lookalike_data_lib.mjs` | `7403e6d3f2b594fbfab091085df1c2208cb469179429cd0a4aa873716c0ee539` | `108df5d8b845fb61c697df548f0870be2e40b73f04cf5ff7ddc1b8c1fa955b1c` |
| `data/lookalikes/manifest.json` | `f5b3c0f3a17cdf7e2268dbfb03be1102c8ebb1932c8e0fea308560528a954f90` | `93e322005fcdc60baf1c7d39aeccc02233465c5c37bb8bfef2ef481a8cc41e91` |
| `tools/release_gate.py` | `9f801745ddae9cb2ca9c3ad9e10c752003fe4ca5b1b6778e41e7c576a775546a` | `2c853c5b95eea8cb738045a739badc170062713b4e33887548fa980ac553e598` |
| `tools/release_candidate.py` | `8d4bef9fff7dec26cda8feab955192dd9a27e5b7ad40dd575092169c1aea41f3` | `616bdcc12d3cfb08481779fc529d206ca4aa6b82425318aa74128acf935d6c03` |
| `.github/workflows/deploy-pages.yml` | `512e184e963248d04b0407987dd8fb76f88f332850f8f51a977dbb9aab34e8e6` | `7e288a8d50c54b2cbb5d3ee23b471a3042ed9ef927c2aa4c557be405a65595eb` |
| `AUTOMATIC_FINDINGS.md` | `79030ff8581468b392cbd80ed1c81e73f9527f112302c1313169765b667a0686` | `13b7a1a61d6d3c5a35300f0da1552bb1fe3a7dbe416dcb87e852b69d31090147` |
| `README.md` | `37a6cc6f64f893261fb8b8f2b899c32a76d232ea5ba87ef04e05a92efac4aa1a` | `6ab21e9ef4478d250c25e20453e4e5e0c8fa1b02e89d10e7a21a0444045a8a63` |
