> **Superseding licensing follow-up:** [STAGE7_LICENSING_RESOLUTION.md](STAGE7_LICENSING_RESOLUTION.md) records the focused reevaluation and current verdict **READY FOR INDEPENDENT AUDIT**. The licensing blocker and verdict below are preserved as the original Stage 7 historical assessment, not the current conclusion. Runtime/data bytes and earlier test evidence remain preserved; refreshed package hashes are in the follow-up. Stage 8 and deployment remain unauthorized.

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

**Public derivative.** This document is a sanitized derivative of the privately archived original `STAGE7_RELEASE_HARDENING.md` (SHA-256 `f32c934b5ba0daa343e8fa960dc4a2784c617bf6b329cfa8875b7586abcf44f9`; `repository-before-cleanup.tar.gz`, member `repository/STAGE7_RELEASE_HARDENING.md`). The original is not distributed in this public repository. Original dates, findings, verdicts, measurements, limitations and recorded source/evidence hashes remain historical; sanitization does not turn them into current acceptance claims.

# Stage 7 release hardening — Offline URL Inspector v3.3.0

23 October 2026. **NOT READY FOR INDEPENDENT AUDIT.** The technical candidate and review materials are prepared, but the Stage 7 requirement to resolve redistribution rights remains unmet. In particular, the scope of Majestic's CC BY 3.0 Unported grant concerning sui generis database rights needs resolution. This is an explicit release blocker. This verdict is not deployment permission; Stage 8 has not begun.

## 1. Starting repository identity and inventory

Verified repository: `<repository>`. Branch `dev/v3.3.0-automatic-lookalikes`; HEAD and `main` are `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Stable published release remains v3.2.0. The index was empty at the start and remains unstaged. No branch/worktree, commit, push, PR, merge, settings change, publication or deployment occurred.

The starting inventory contains **513 files**, including 273 tracked names and preserved untracked development files; the complete initial Git status, paths and SHA-256 values are in `tests/stage7-starting-inventory.json`. An independent byte-for-byte snapshot is retained at `<private Stage 7 starting-source snapshot>`. The previous final-copy handoff's 512 recorded file hashes matched; its own report was additionally captured in this 513-file inventory. Stage 2–6 data, engine, UI, assertions, fixtures and earlier result/review documents were inspected and preserved. No starting file was deleted.

Read AGENTS.md, latest final-copy/HTTP/structure handoffs, build and verifier sources, workflow, lifecycle code, source manifests and licensing documentation. Current runtime sources rather than conversational summaries supplied the candidate inputs. `tests/stage7-integrity.json` records the final preservation comparison and exact exceptions. AGENTS.md already covers permanent messaging validation, palette and stage boundaries and remains unchanged.

## 2. Exact files created or modified

Nine starting files changed in Stage 7:

- `.github/workflows/deploy-pages.yml`
- `COMPARISONS.md`
- `DEPLOYMENT.md`
- `LOOKALIKES.md`
- `README.md`
- `REFERENCE_DATA.md`
- `UPDATES_AND_ROLLBACK.md`
- `tools/build.py`
- `tools/verify_release.py`

New files:

- `DISTRIBUTION_RIGHTS.md`
- `RELEASE_CANDIDATE.md`
- `STAGE7_RELEASE_HARDENING.md`
- `tests/stage7-actions.json`
- `tests/stage7-firefox-results.json`
- `tests/stage7-firefox.mjs`
- `tests/stage7-gate-results.json`
- `tests/stage7-integrity.json`
- `tests/stage7-performance-results.json`
- `tests/stage7-regression-results.json`
- `tests/stage7-regressions.py`
- `tests/stage7-release-results.json`
- `tests/stage7-release.py`
- `tests/stage7-rollback-results.json`
- `tests/stage7-rollback.mjs`
- `tests/stage7-source-boundaries.json`
- `tests/stage7-starting-inventory.json`
- `tests/stage7-validation-notes.json`
- `tools/release_candidate.py`
- `tools/release_gate.py`

No `src/` or `data/` file changed. Existing UI copy, priorities, parsing, matching, datasets/pins, original test assertions, storage keys/schemas, disclosure defaults, privacy behavior and combined palette remain byte-identical to the starting state. The root stable `site/`, `standalone/`, `build-manifest.json` and `SHA256SUMS` are untouched. Development reports/tests are internal repository evidence, not runtime deployment files.

## 3. Release-candidate architecture

Candidate version **3.3.0-rc.1**, target release **3.3.0**. Release identity `3.3.0-rc.1-0af3824ff7dd5cb8`. It remains explicitly a local candidate with `publicationAuthorized: false`; promotion to a final version must create and validate another exact build under separate authorization.

Both editions assemble the same approved sources, Unicode data, PSL, popular-domain records, matching index, source notices and evidence-driven findings. The hosted edition adds the unchanged hosted lifecycle and a matching complete-document worker; the standalone edition disables workers. Both include the necessary runtime data as inert JSON. There is no runtime module or database request.

The manifest enumerates **70 build/source inputs**; their canonical input digest is `875733c1d2ab46897eca6136a2f4b6ce6d5ef54d6438f26000b6a546da1db3db`. This digest identifies enumerated working-tree content, **not an immutable Git commit**, publisher authentication, the entire Git tree, or an independent audit. The initial/final inventories separately cover internal tests/reports and every preserved file. The exact eventual committed tree must be reviewed in Stage 8.

`tools/build.py --release-candidate` requires a fresh empty output directory outside the repository. Existing preview modes remain available; unsafe/default builds still refuse to mislabel current sources or replace stable artifacts. `tools/release_candidate.py` extends existing build conventions with an explicit source/archive and distribution allowlist, not a separate packaging framework. Its archive has sorted fixed-time/mode entries. Python 3.15.0 / zlib 1.2.12 produced the verified local archives; cross-toolchain encoding differences must be investigated, not ignored.

Deployment inputs are exactly `site/index.html`, `site/sw.js`, `site/.nojekyll`. Download/audit companions are `NOTICES.txt`, `source-materials.zip`, `build-manifest.json`, `SHA256SUMS`. Tests, historical reports, screenshots, previews, macOS/editor/Git metadata, credentials and the full-million CSV are excluded. The archive includes the explicit build/data source inputs; running the complete regression gate requires the full reviewed checkout.

## 4. Reproducible data-generation evidence

An isolated official **Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3** was downloaded from the fixed official release, checksum-verified before execution, and used without changing global Deno 2.9.8. Official macOS archive SHA-256 `5cd46d6268f6f78f5d88bdc7159d20bd44cdaa4b3303474839f87ec6fe7ae25c`; isolated binary `b73737579d5a84c160e3316487594783fa5c15f4e13252a6a07050b755317f1a`. Global Deno remains `2e5e5177a25d6a89847f229996fc8f104db8985356f7608067de7a59a42059fe`. The wrong global runtime explicitly refused generation.

Fresh `--check` runs and **two separate generations** matched every approved foundation output, provenance record, index and manifest byte-for-byte. No snapshot or pin was refreshed. The entire original **79,648,765-byte / 1,000,000-row** Majestic CSV at `<privately retained original Majestic CSV>` matched SHA-256 `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a`; complete ranks/columns/rows and the exact 10,000-row selected subset were reverified. This uses the approved original file, not today's changing download.

Raw-rank cutoffs precede normalization, with no top-up: 949 accepted rows/883 distinct references at rank 1,000; 4,826/4,714 at 5,000; 9,710/9,570 at 10,000. The 290 top-10,000 exclusions are suffix-only; 140 accepted duplicate rows merge. Spelling is limited to the 883 normalized references whose minimum original rank is <=1,000. Popularity is referring-subnet ranking, not reputation or safety.

PSL snapshot `2026-10-20_08-40-56_UTC`, upstream `5dd321ffe02039e2431382a095cf80e27ff5eb94`, raw SHA-256 `8228e4bdac6024c058a1e67859157e468a2613b826b53de0e5cae298e1b70755`: **6,949 ICANN + 3,447 PRIVATE rules**, including 311 wildcards and 8 exceptions. Current tests independently cover private tenants, exceptions, unknown/suffix-only names, complete-label structure and legitimate/partial-name negatives. Unicode 18.0.0 runtime data remain `806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1`. Policy remains `full-domain-conservative-v2`; index `f34828ae9faa621a83d0d480a888b28985198bbcd90bd3763d18135fd23d0c9e`, 494,484 bytes. Original v1 fixtures/assertions remain unchanged and run on their historical interface. Full RTL/Bidi and deferred Base64/JSON analysis were not added.

Evidence: `tests/stage7-release-results.json`, `tests/stage7-gate-results.json`; generated copies and download/checksum receipts remain under `<private Stage 7 working evidence directory>`. No unexplained data-generation difference was found on this macOS runtime. Linux/GitHub-runner reproduction remains untested.

## 5. Hosted and standalone artifact verification

Two independent outside-repository builds and verifier rebuilds agree across **all eight output files**, not just HTML. `tools/verify_release.py --candidate-root` selects the new verifier explicitly; its historical v3.2.0 entry point and assertions remain available. Verification rejects unsafe/incomplete inventories, symlinks, wrong candidate/runtime metadata, source digest differences, checksum inconsistencies, stale bytes, external runtime resources and missing offline legal/source text. It recomputes CSP/script/style hashes and rebuilds both editions plus worker/archive/notices from the enumerated sources for complete byte comparison. SHA256SUMS covers the manifest and every artifact, excluding itself.

Verified candidate root: `<private Stage 7 candidate>`; independent repeat: `<private Stage 7 repeat candidate>`.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `NOTICES.txt` | 29146 | `6a6a0ad4a92228d5c0149d0ffe6df46ec3fb202e8a22266e2c4cae56db2baffe` |
| `source-materials.zip` | 2798273 | `7e46c03521175b2a2c769efe346004589fd661bdd43dc920e7f41a115d623ba7` |
| `site/.nojekyll` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `site/index.html` | 4053647 | `0af3824ff7dd5cb8bd72e4262c66fcbb41bca3b7e15e79c0b02660ececb96f43` |
| `site/sw.js` | 4153 | `864682c766cbe67d5762214b52e56b866ec6f49dbe06b6a311e7cae44d82f704` |
| `standalone/Offline_URL_Inspector.html` | 4041587 | `b17a482ea5b914b6c9e9e58d55ef96c2acba6fc7b37b1898fb14a646fed9ad0f` |
| `build-manifest.json` | 16520 | `38de88ec9c395daedefe4e831dc0fdb3c27eb9a260c81bc0ef747d23ae0df82e` |
| `SHA256SUMS` | 595 | `7570e97cf9ae8b284fb0fa9b510fb17242e3029c44a0e9911b328de2329d494f` |

Standalone candidate — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/013-Offline_URL_Inspector.html` (SHA-256 `b17a482ea5b914b6c9e9e58d55ef96c2acba6fc7b37b1898fb14a646fed9ad0f`) · Hosted HTML — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/011-index.html` (SHA-256 `0af3824ff7dd5cb8bd72e4262c66fcbb41bca3b7e15e79c0b02660ececb96f43`) · Complete manifest — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/010-build-manifest.json` (SHA-256 `38de88ec9c395daedefe4e831dc0fdb3c27eb9a260c81bc0ef747d23ae0df82e`) · Source materials — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/012-source-materials.zip` (SHA-256 `7e46c03521175b2a2c769efe346004589fd661bdd43dc920e7f41a115d623ba7`). These temporary local files may eventually be removed by OS cleanup. Root stable distribution files were not regenerated.

## 6. Deployment workflow safeguards

The starting workflow uploaded `site` on selected main pushes or manual dispatch without prerequisite validation. The local replacement removes automatic push deployment. A future dispatch must select `main`, explicitly authorize deployment and bind the exact checked-out commit and accepted input digest. It builds fresh files, verifies all candidate artifacts, runs strict data/current regressions and the complete preserved historical chain, then uploads only that run's verified hosted directory. A failure prevents upload/deployment; `needs: verify` links the jobs. The receipt binds commit, input digest, checksums/manifests and results. Concurrent Pages deployments are serialized. Before deployment, a fresh `main` checkout rejects a run superseded while awaiting approval.

Verification has `contents: read` only and does not persist checkout credentials. The environment deployment job alone receives `pages: write` and `id-token: write`, plus read access for its stale-run check. Official checkout/upload/deploy actions are pinned to resolved immutable commits, recorded in `tests/stage7-actions.json`. Linux Deno 2.9.7 is isolated and pinned to the official archive SHA-256 `c6527f24f4b16031d3ae4fa9f658d5f11534c8d84ce7dc8502420280919c3490` before execution. No moving setup-deno action is used. YAML parsed successfully through native Ruby Psych; this is syntax evidence, not a hosted Actions execution.

The user must separately configure branch protection, required reviews/checks and `github-pages` environment reviewers/branch restrictions. A checkbox/input digest does not certify an independent audit or legal permission. GitHub administrator powers and future workflow edits cannot be prevented by these local scripts; there is also a residual race if main changes after the last stale-run check. `ubuntu-latest` remains a moving environment. No repository settings or Actions run were changed/invoked. [GitHub's Pages workflow contract](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [environment controls](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) describe the external protections; final runner/deployment enforcement is **NOT YET TESTED**.

## 7. Hosted update and rollback findings

`src/sw.js`, `src/hosted.js` and `src/references.js` remain byte-identical. Whole-document hashing binds code, data and notices atomically. The worker recognizes only the exact project navigation and fixed application index. It never accepts inspected destinations as cache/fetch/message targets. Verified prior cache retention, failed writes, interrupted downloads, corrupt/missing content, scope restrictions and reviewed activation are exercised in 25 worker and 64 hosted-control simulations.

Native headless Firefox additionally exercised the real preserved **v3.2.0 → candidate** transition on an isolated loopback origin. Candidate worker plus old HTML and candidate worker plus truncated HTML both failed to replace the working controlled stable page/cache. A valid complete candidate waited for Apply Update, then activated successfully; the saved reference JSON was byte-identical. Candidate offline reload succeeded after stopping the local server, with no additional served request. A separate **3/3** native rollback rehearsal offered the exact preserved stable worker/HTML, retained the candidate page until deliberate application, restored v3.2.0 and reopened it offline with identical references.

This is a real browser/local-origin rehearsal, not a live Pages rollout or multi-tab/eviction guarantee. Initial uncontrolled online delivery and publisher authenticity are not established by a hash embedded in the same application. A cached worker may retain old open pages until their reviewed lifecycle completes. An uncached offline profile cannot install. Final deployment must verify exact CDN/header/update behavior, multiple tabs, other supported browser profiles/Containers and a separately authorized rollback path. The forward RC workflow intentionally does not silently build a v3.2 rollback from new sources. Never clear all origin storage to roll back.

## 8. Standalone offline validation

The verified single HTML opens through actual Firefox `file://`, initializes all bundled indexes and runs the current findings without a server/account. It has no external script/font/data dependency, module loading or relative runtime asset path. Strict CSP remains exact, with `connect-src 'none'`, worker disabled and no unsafe-inline/eval permission. No unexpected page error or destination request was observed. The only recorded browser errors were expected blocked favicon attempts under `img-src 'none'`; no actual favicon dependency was added.

Local file storage remains browser-dependent and may be unavailable/temporary. Private mode, lifetime, other browsers and operating-system file-picker/download interactions are not certified. Backup exports are the established explicit reference-list mechanism; inspected URLs, credentials and Expected Hostname text remain unsaved. Offline notices/source are accessible through the existing application-level disclosures; no ordinary per-URL legal panel was added.

## 9. Licensing and redistribution assessment

See [DISTRIBUTION_RIGHTS.md](DISTRIBUTION_RIGHTS.md) for the full, separately reasoned assessment. The [current publisher dataset page](https://majestic.com/reports/majestic-million) and [official CSV announcement](https://blog.majestic.com/development/majestic-million-csv-daily/) explicitly apply CC BY 3.0 Unported to the CSV. The verified grant supports copyright reproduction/adaptation/distribution subject to conditions; attribution, source/license URI, change notice and no-endorsement wording are retained. No full-million CSV needs to be a runtime asset merely for attribution.

However, the [CC database FAQ](https://creativecommons.org/faq/#how-does-the-treatment-of-sui-generis-database-rights-vary-in-prior-versions-of-cc-licenses) identifies a separate 3.0 Unported database-rights issue. This review cannot determine legal substantiality of the selected top-ranked rows, jurisdictional applicability or implied additional permission. The [publisher's general website terms](https://majestic.com/company/terms) also require reconciliation with its specific dataset grant. **RELEASE BLOCKER: resolve the applicable distribution rights with an appropriate independent assessment/authoritative clarification before redistribution.** No publisher contact, terms acceptance, license substitution or dataset replacement occurred. Mere bundled-license presence is not treated as clearance.

For PSL, a fresh read of the exact official upstream commit independently matched its recorded Git blob `30b18ab3c21f96dd1c4a7b4adb9b16ed9e2b30aa` and MPL notice; this evidence is in `tests/stage7-actions.json`. The local pinned list was not replaced. The pinned raw source carries MPL 2.0; [official distribution](https://publicsuffix.org/list/), [MPL](https://www.mozilla.org/en-US/MPL/2.0/) and [Mozilla's FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) support source/notice obligations and client-delivered distribution. Both complete HTML editions now supply exact preferred PSL source, compiled tables and transformation materials offline in the existing legal disclosure, with full MPL text. The deterministic companion archive includes exact raw/derived source, approved inputs and reproduction instructions. Original notices are preserved, with a candidate statement clarifying the old proposal's historical status. This is a conservative packaging interpretation, not whole-application relicensing or final legal approval; independent review must accept the compiled/larger-work treatment. PSL fixtures retain their separate CC0 notice. Unicode V3 notice/attribution and source headers remain present; [Unicode's primary license](https://www.unicode.org/license.txt) was checked.

## 10. Startup, latency and memory measurements

Fresh isolated Deno 2.9.7 reports include 10 foundation samples, 10 index samples, 2,000 ordinary comparisons, 600 bounded/adversarial comparisons, artificial collision controls and 100 coordinator samples at each parent count. Foundation load median **53.51 ms**, p95 **88.15 ms**; first index prepare **96.30 ms**. Fresh full coordinator initialization median **133.97 ms**, p95 **174.97 ms**. Ordinary matcher median/p95 **0.022/0.059 ms**; adversarial **0.073/0.121 ms**, with explicit complete/partial/unavailable outcomes. Nested coordinator medians **0.251–0.290 ms**, with verified call reuse and unchanged work limits.

With explicit GC, retained foundation+index endpoint heap delta was **9,380,472 bytes** (index-only 6,588,432), below the existing 15 MiB feasibility target. Maximum sampled endpoint heap growth was 1,170,728 bytes; this is **not a peak scratch-allocation measurement** or proof of the 2 MiB scratch target. macOS cumulative child-process maximum RSS reached 239,960,064 bytes across these benchmark subprocesses; that includes the runtime/process and is not browser heap. No native Firefox heap or peak memory was measured.

Native Firefox 158.0.1, headless macOS, exact candidate HTML:

| Measurement | Standalone | Hosted |
|---|---:|---:|
| First tested navigation to observed ready | 353 ms | 279 ms |
| Same-context reload ready median, 3 samples | 230 ms | 260 ms |
| Fresh coordinator median, 5 samples, text already loaded | 182 ms | 172 ms |
| Ordinary inspection + settled DOM/layout median, 20 | 1 ms | <1 ms clock resolution |
| Multiple-warning median, 20 | 1 ms | 1 ms |
| Mixed embedded median, 20 | 2 ms | 2 ms |
| Bounded adversarial median / maximum, 20 | 3 / 5 ms | 3 / 4 ms |

First-profile navigation is not OS disk-cold startup; the hosted sample follows the upgrade rehearsal. Timer quantization means a recorded zero is below clock resolution, not instantaneous. Fresh coordinators include foundation/index verification but use already loaded text; rendering measurements include matching, presentation and forced layout rather than isolating DOM cost. Six native measured reflow/zoom layouts passed at 320px and actual 200%/400% zoom. No tested overflow, finding suppression or budget reduction occurred.

Earlier Deno foundation/matcher/coordinator reports use comparable algorithms but uncontrolled different runs; they are not evidence of a precise speedup or regression. There is no comparable prior OS-cold/browser-heap baseline. Candidate legal/source embedding adds bytes; final headful/device startup and memory acceptance remain required. All raw measurements/method limitations are in `tests/stage7-performance-results.json` and `tests/stage7-firefox-results.json`.

## 11. Privacy and security preservation

Source review found the only fetch in runtime sources is the fixed application index in the worker. Hosted lifecycle checks register/update only the exact application worker; browser lifecycle traffic is independent of inspection input. Results and reference data use safe text rendering. The only explicit UI-generated link is the existing local Blob reference-backup download, not a recovered destination. No telemetry/reputation/DNS request, arbitrary navigation, URL-derived HTML execution, new storage write or logging of inspected values was added.

Current generated-DOM checks cover private userinfo/token concealment, deliberate reveal cleanup, stale-result removal, cross-inspection names/evidence and unchanged reference exports. Native traces contain only local file/loopback application resources and local data resources. Sensitive markers were absent from ordinary results/storage. Reference schema/key, bounded decoding/extraction, matching counters/cooperative limits, source provenance and caution/information distinctions are unchanged. No confirmed redirect or website-safety claim was introduced. This is targeted release-preservation verification, not the deferred independent adversarial audit.

## 12. Documentation corrections

README now leads with accurate candidate status and current automatic/PSL/optional-reference semantics. REFERENCE_DATA, LOOKALIKES and COMPARISONS distinguish immutable historical component flags/checkpoints from the active application. RELEASE_CANDIDATE gives explicit outside-tree build/verification commands and content-identity limitations. DEPLOYMENT and UPDATES_AND_ROLLBACK lead with the proposed controls and actual stable/current transition, retaining old assertions under historical headings. DISTRIBUTION_RIGHTS records authoritative grants, packaging measures and unresolved rights.

Older no-PSL/manual-only/dormant statements are retained only as explicitly labeled version/stage history, not current capability claims. Existing current help already describes automatic comparisons, PRIVATE suffixes, finite coverage and offline limitations correctly and was not rewritten. Stage 6 findings, terminology, palette, interactions and disclosure defaults are unchanged.

## 13. Full regression results and coverage reconciliation

Final mandatory gate **12/12 command groups**, no failures:

| Area | Fresh evidence |
|---|---|
| Foundation + official PSL/native boundaries/provenance | 162 cases / 49,099 assertions; strict 2.9.7 |
| Current v2 matching, structural/PRIVATE negatives and limits | 27 / 19,335; strict 2.9.7 |
| Core/official Unicode fixtures | 108,664 / 112,223 |
| Personal references/storage/import policy | 70 / 135 |
| Nested embedded occurrence/provenance | 34 / 821 |
| Unified comparisons/Expected Hostname/saved/reference coverage | 56 / 601 |
| Comparison compatibility | 8 / 13 |
| Current generated candidate messages/privacy/accessibility wiring | 36 / 930 across both editions |
| Worker atomic lifecycle simulation | 25 / 84 |
| Hosted update/readiness/confirmation simulation | 64 / 192 |
| Foundation and index generation | both strict `--check` prerequisites passed |

The separate preserved historical chain passed all outer groups: final-copy 4/4, HTTP/structure 6/6, prominence 5/5, follow-up 4/4, acceptance 59/59, messaging 48/48, final-UX 37/37, UX 28/28 and automatic 20/20, with their nested exact interfaces. It includes 134 HTTP/structural, 58 stress, 90 warning-prominence, 118 Unicode/userinfo/deduplication, 257 systematic messaging, 52 acceptance, legacy core/differential/storage/embedded/DOM/CSP/build fixtures and source restorations. These nested numbers overlap and **must not be added** as independent coverage. Current candidate assertions are separate from the historical expected-copy contracts.

Native acceptance **47/47** plus rollback **3/3**; six current reflow/real-zoom measurements passed. Native methods/names and old reports do not substitute for VoiceOver or headful interaction. Existing suites/report files are unchanged; all rerun output was written in disposable copies and retained under new Stage 7 report names.

An initial detached historical attempt produced no fresh completion report and is not counted. The first tracked full historical attempt correctly failed its old full-file builder hash assertion. The Stage 7 wrapper now verifies and restores exactly three prior release-engineering files in a disposable copy before running unchanged historical assertions. No test was weakened. The final chain passed. An official setup-deno tag lookup returned 404; the workflow instead uses the official checksum-pinned runtime directly. Initial logs/reports and `tests/stage7-validation-notes.json` preserve those diagnostics.

## 14. Negative verification results

**17/17 release/reproduction checks passed.** Temporary fixtures explicitly rejected missing/corrupt index, truncated approved subset, incorrect runtime metadata, missing PSL legal notice, altered artifact checksum, wrong release version, unexpected deployed debug file, stable HTML paired with candidate worker, missing source archive, forged stale HTML even with recomputed artifact inventories, and a failed mandatory test prerequisite. The wrong installed generator runtime refused execution. Full repeat builds/generation and original-to-subset provenance were also verified in that suite. Native mismatch/truncation upgrade tests independently preserved the prior complete release. No actual data or stable artifact was corrupted.

## 15. Version-control and eventual release strategy

Keep this working tree local for review. Recommended eventual authorized groups: (1) approved pinned source/provenance/licenses and generators, (2) boundary/matching/orchestration and tests, (3) approved UI/messaging/accessibility with regression evidence, (4) release build/verifier/workflow/source packaging and current documentation. Retain internal review/history/tests as appropriate source-repository evidence; they are excluded from runtime deployment. Do not silently drop untracked implementation inputs. Verify each staged group only after staging is separately authorized.

After rights resolution and other prerequisites, create an explicitly authorized immutable candidate commit on this same branch. Record its full Git SHA, complete tree status and enumerated input digest; rebuild and verify. Stage 8 must audit that exact committed candidate and its data/outputs, not assume today's content digest is a commit. Any audit correction needs a new commit/artifact identity and renewed relevant review. Prepare the PR only with user authorization, compare its final tree/digests with the audited candidate, and independently accept before merging. Prefer preserving the audited candidate through a fast-forward/merge with identical reviewed source inputs; if squash/rebase changes commit identity, record the new commit and prove tree/input equivalence. A changed source/version/packaging requires fresh exact verification.

Merge authorization, final-version promotion, GitHub Actions runner acceptance, explicit deployment authorization, optional signed/annotated final tag and publication are separate future decisions. Keep a verified matched baseline v3.2.0 set for authorized rollback. The isolated native rollback has passed, but live recovery/headers and final workflow rollback controls remain untested. Preserve reference storage and exports throughout; never “roll back” by erasing origin data.

## 16. Outstanding Stage 8 acceptance items

| Status | Item |
|---|---|
| VERIFIED | Starting/final file preservation; stable artifacts and source/data/storage/UI unchanged; local content identity |
| VERIFIED | Strict macOS Deno 2.9.7 double reproduction, complete approved original/subset provenance and corruption rejection |
| VERIFIED | Two deterministic candidate builds, every output checksum/source rebuild, exact CSP and offline legal source packaging |
| VERIFIED | Current and preserved historical regression suites; native headless file/loopback candidate findings, zoom, upgrade, failure recovery and rollback |
| RELEASE BLOCKER | Majestic 3.0 Unported sui generis database-rights scope/substantiality/permission and reconciliation with general terms |
| NOT YET TESTED | Independent adversarial code review of the exact future committed candidate; Stage 8 not started |
| NOT YET TESTED | Independent generator/index reproduction, including official Linux 2.9.7/GitHub runner byte comparison |
| NOT YET TESTED | Independent acceptance of MPL compiled-data/larger-work source-availability treatment and final notices |
| NOT YET TESTED | Native headful Firefox/manual interaction, VoiceOver, physical devices/mobile and other browser/file-origin behavior |
| NOT YET TESTED | Real file picker, actual backup download/import/export round trips and browser-specific temporary-storage behavior |
| NOT YET TESTED | OS disk-cold startup, native heap/peak memory, true peak scratch allocation and device resource acceptance |
| NOT YET TESTED | Live GitHub Actions enforcement, environment/branch protections, exact action-code review and explicit external deployment approval |
| NOT YET TESTED | Exact live Pages upgrade/rollback with headers/CDN, multiple tabs, profiles/Containers and interrupted/evicted caches |
| KNOWN LIMITATION | Finite reference snapshot, conservative spelling, incomplete/unsupported methods and cooperative resource budgets; no comprehensive phishing/ownership/reputation verdict |
| KNOWN LIMITATION | File-origin/private-session persistence, shared github.io origin storage, browser eviction and uncached offline startup |
| KNOWN LIMITATION | Content hashes are not publisher signatures; local input inventory is not an immutable commit; first uncontrolled delivery is outside the worker's integrity check |

VERIFIED entries have fresh executed evidence, not merely earlier report assertions. Pending independent/manual items are not failures disguised as passes.

## 17. Known limitations and blockers

The unresolved distribution-rights question prevents a release-eligible candidate recommendation even though the technical gates pass. No data was removed or substituted to evade it. The complete PSL source/notice packaging is implemented but requires independent legal/compliance acceptance. Actual GitHub workflows/settings and live Pages behavior have not been exercised. The proposed workflow cannot prove a human audit occurred from a dispatch checkbox or defeat a privileged administrator. Moving runner/toolchain differences require explicit reconciliation. Final-version promotion will change artifacts and needs exact revalidation.

No native browser memory, screen-reader, headful/manual or physical-device acceptance is claimed. Timings are bounded samples on this host, not hard real-time guarantees or comparative phishing metrics. Historical source restoration preserves old contracts; it is not a claim that obsolete interfaces are the current UI. No remaining code/data reproducibility discrepancy was found in the tested macOS candidate.

## 18. Stage 7 readiness verdict and stop

**NOT READY FOR INDEPENDENT AUDIT** under the requested Stage 7 release-hardening acceptance: unresolved redistribution rights remain a release blocker. The verifiable local candidate and detailed receipts are available for review; no independent audit was performed or final release approval inferred. Resolve the blocker and agree the exact immutable candidate/remaining acceptance scope before beginning Stage 8.

Stop here for user review. All changes remain local, unstaged and uncommitted. Nothing was pushed, merged, published or deployed; the live v3.2.0 application and stable local artifacts remain preserved.
