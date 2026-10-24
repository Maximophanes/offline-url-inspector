# v3.3.0 pre-commit cleanup handoff

Prepared 2026-10-24 15:05 UTC. Authorized hygiene work only. All original application/data/test/documents remain unchanged except the explicitly authorized removal of 126 archived receipts and restoration of three tracked reports. This handoff is the only new repository file.

**READY FOR INDEPENDENT FINAL-DIFF REVIEW. Public staging/publication remains on hold for the eight path-bearing files described below. This verdict does not authorize any Git or deployment action.**

## 1. Repository identity and exact final counts

- Repository: `$HOME/Documents/GitHub/offline-url-inspector`. Paths here use environment-neutral notation to avoid adding another personal account path.
- Active branch: `dev/v3.3.0-automatic-lookalikes`.
- HEAD, local main and locally stored origin/main: `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Remote references were not fetched.
- Before cleanup: **330** changes, 19 modified tracked files + 311 untracked files.
- After authorized cleanup, before this document: **201** changes, 16 modified tracked files + 185 untracked files.
- Final including this document: **202** changes, 16 modified tracked files + 186 untracked files.
- Staged index remains empty. No staging, commit, push, merge, release, deploy, branch deletion or original-checkout branch/worktree change occurred.
- The stable v3.2.0 site, standalone, manifest and checksum outputs are unchanged.

## 2. Durable archive, exact inventory and restoration

Archive directory:
$HOME/Documents/Offline URL Inspector Archives/v3.3.0-precommit-20261024T145339Z

This is an ordinary persistent Documents directory outside Git; temporary paths are not the sole evidence copy. The directory has owner-only traversal permissions. Keep the archive private.

- `MANIFEST.json` and `INVENTORY.md` enumerate every original relative path, byte count, SHA-256 and cleanup disposition for **584 pre-cleanup source/evidence files**. The original snapshot includes all 126 removed receipts, all three pre-restoration reports, all 30 controlled fixtures, all 91 changed test executables and the historical documents.
- `repository-before-cleanup.tar.gz`: exact 584-file repository snapshot, excluding Git internals and ignored local metadata.
- `referenced-visual-evidence.tar.gz`: **303** discovered screenshot references, mapped to original absolute locations in MANIFEST.json. All existed; no discovered image reference was missing.
- `stage8-audit-evidence.zip` and `stage8-reverification-evidence.zip`: untouched copies of the separately preserved independent evidence, matched against the hashes published in the original reports.
- `pinned-source-evidence.tar.gz`: five exact retained inputs/evidence files: original `majestic_million.csv`, original acquisition JSON, licensed download-page HTML, licensing acquisition-evidence JSON, and original baseline-verification JSON. SUPPLEMENT_MANIFEST.json maps each member to its original location and hash. The CSV was not downloaded/refreshed; its 79,648,765 bytes match `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a`.
- `validation/`: fresh cleanup/commit plans, preservation/privacy/packaging/runtime checks, regression/release reports and execution logs.
- `validated-candidate/`: all eight freshly rebuilt outputs, matching the accepted package byte-for-byte.
- `cleanup-scripts/`: the narrow archive, cleanup and verification orchestration used for this task.
- `RESTORE.md`: selective restoration instructions. Extract into a new outside-repository directory first; verify hashes; copy only explicitly selected members after checking for newer target files. Do not extract blindly over the live checkout.
- `committed-baseline.tar`: read-only source export of the existing baseline, without Git metadata.
- `SHA256SUMS` binds the top-level archives/manifests; `SHA256SUMS.pre-cleanup` preserves the initial checksum list. Nested validation files are bound by VALIDATION_MANIFEST.json.

Exact checksums of the principal immutable archive records:

| File | SHA-256 |
| --- | --- |
| `repository-before-cleanup.tar.gz` | `90665e4ad6835ddb22bfd78ccf3ff3a9273336cb764a36edaa12cc849f051d1e` |
| `referenced-visual-evidence.tar.gz` | `f26af57a404fb25e95533b1cc3a3469a5319a1275f0c2aceec4f7c2f57d7f8d3` |
| `MANIFEST.json` | `0394eceaa0afe45497b9fb349847ac20f2040adfbc09dba75698d7f077191546` |
| `VERIFICATION.json` | `46fffdb95b099f11f753f23b95c7fb30445fba46ac05506109940edc0eaf3a1a` |
| `stage8-audit-evidence.zip` | `f18d503b33a6ea57a4e9680d7dc2a921e2c40936cb2f9de7d7f8f9c1c6e8b2c6` |
| `stage8-reverification-evidence.zip` | `8977e8a73a5d38843e85f25682d3d65bc1ccef1339de74fdacc39b1fd2e87dc9` |
| `pinned-source-evidence.tar.gz` | `9ef2571f3dbf8eafaeee52e53ab33722481d7ec356b6ee7a74b9a55e22a4d012` |
| `VALIDATION_MANIFEST.json` | `807b46e4ef94341dc009ce4b8954bb993a56fbd350b9f5f1c199d8696ab0f76b` |

Before any removal/restoration, archive member bytes were compared with all 584 originals and all 303 external images. All matched. The 126 cleanup targets were still untracked and matched archived hashes immediately before unlinking. Each tracked report was separately verified to differ only in its Deno metadata.

## 3. Exact files removed and restored

The following **126 untracked execution receipts** were removed only after archival verification. Original paths are repository-relative; the archive retains each exact original hash and content. No wildcard deletion, git clean or git reset was used.

- `tests/acceptance-build-results.json`
- `tests/acceptance-firefox-results.json`
- `tests/acceptance-integrity.json`
- `tests/acceptance-regression-results.json`
- `tests/acceptance-results.json`
- `tests/acceptance-strict-runtime-results.json`
- `tests/acceptance-validation-notes.json`
- `tests/automatic-contract-results.json`
- `tests/automatic-firefox-results.json`
- `tests/automatic-regression-results.json`
- `tests/automatic-stage6-integrity.json`
- `tests/automatic-strict-runtime-results.json`
- `tests/automatic-ui-results.json`
- `tests/comparison-benchmark-results.json`
- `tests/comparison-compatibility-results.json`
- `tests/comparison-dom-results.json`
- `tests/comparison-environment-results.json`
- `tests/comparison-results.json`
- `tests/comparison-runtime-resolution-results.json`
- `tests/comparison-stage5-integrity.json`
- `tests/embedded-provenance-benchmark-results.json`
- `tests/embedded-provenance-build-results.json`
- `tests/embedded-provenance-dom-results.json`
- `tests/embedded-provenance-integrity.json`
- `tests/embedded-provenance-results.json`
- `tests/final-copy-build-results.json`
- `tests/final-copy-firefox-results.json`
- `tests/final-copy-integrity.json`
- `tests/final-copy-regression-results.json`
- `tests/final-copy-results.json`
- `tests/final-copy-validation-notes.json`
- `tests/final-ux-firefox-results.json`
- `tests/final-ux-integrity.json`
- `tests/final-ux-regression-results.json`
- `tests/final-ux-results.json`
- `tests/final-ux-screenshot-results.json`
- `tests/final-ux-strict-runtime-results.json`
- `tests/followup-build-results.json`
- `tests/followup-firefox-results.json`
- `tests/followup-integrity.json`
- `tests/followup-regression-results.json`
- `tests/followup-results.json`
- `tests/followup-validation-notes.json`
- `tests/http-structure-build-results.json`
- `tests/http-structure-firefox-results.json`
- `tests/http-structure-integrity.json`
- `tests/http-structure-regression-results.json`
- `tests/http-structure-results.json`
- `tests/http-structure-validation-notes.json`
- `tests/licensing-resolution-evidence.json`
- `tests/licensing-resolution-firefox-results.json`
- `tests/licensing-resolution-gate-results.json`
- `tests/licensing-resolution-integrity.json`
- `tests/licensing-resolution-offline-results.json`
- `tests/licensing-resolution-results.json`
- `tests/licensing-resolution-starting-inventory.json`
- `tests/lookalike-benchmark-results.json`
- `tests/lookalike-calibration-results.json`
- `tests/lookalike-reproduction-results.json`
- `tests/lookalike-results.json`
- `tests/lookalike-stage3-integrity.json`
- `tests/messaging-build-results.json`
- `tests/messaging-compatibility-attempts.json`
- `tests/messaging-firefox-results.json`
- `tests/messaging-integrity.json`
- `tests/messaging-regression-results.json`
- `tests/messaging-results.json`
- `tests/messaging-strict-runtime-results.json`
- `tests/prominence-build-results.json`
- `tests/prominence-firefox-results.json`
- `tests/prominence-integrity.json`
- `tests/prominence-regression-results.json`
- `tests/prominence-results.json`
- `tests/prominence-validation-notes.json`
- `tests/reference-benchmark-results.json`
- `tests/reference-foundation-results.json`
- `tests/reference-preview-results.json`
- `tests/reference-source-results.json`
- `tests/reference-stage2-integrity.json`
- `tests/stage7-actions.json`
- `tests/stage7-firefox-results.json`
- `tests/stage7-gate-results.json`
- `tests/stage7-performance-results.json`
- `tests/stage7-regression-results.json`
- `tests/stage7-release-results.json`
- `tests/stage7-rollback-results.json`
- `tests/stage7-starting-inventory.json`
- `tests/stage7-validation-notes.json`
- `tests/stage8-remediation-after-dom.json`
- `tests/stage8-remediation-before-dom.json`
- `tests/stage8-remediation-evidence.json`
- `tests/stage8-remediation-firefox-results.json`
- `tests/stage8-remediation-gate-results.json`
- `tests/stage8-remediation-generator-results.json`
- `tests/stage8-remediation-historical-results.json`
- `tests/stage8-remediation-historical-suite-index.json`
- `tests/stage8-remediation-integrity.json`
- `tests/stage8-remediation-release-results.json`
- `tests/stage8-remediation-results.json`
- `tests/stage8-remediation-starting-inventory.json`
- `tests/stage8-remediation-validation-notes.json`
- `tests/stress-build-results.json`
- `tests/stress-engine-results.json`
- `tests/stress-firefox-results.json`
- `tests/stress-regression-results.json`
- `tests/stress-results.json`
- `tests/stress-validation-notes.json`
- `tests/ui-polish-before-results.json`
- `tests/ui-polish-firefox-results.json`
- `tests/ui-polish-first-firefox-results.json`
- `tests/ui-polish-gate-results.json`
- `tests/ui-polish-historical-suite-index.json`
- `tests/ui-polish-integrity.json`
- `tests/ui-polish-nested-limit-evidence.json`
- `tests/ui-polish-regression-results.json`
- `tests/ui-polish-release-results.json`
- `tests/ui-polish-results.json`
- `tests/ui-polish-starting-inventory.json`
- `tests/ui-polish-validation-notes.json`
- `tests/ui-polish-viewport-results.json`
- `tests/ux-build-results.json`
- `tests/ux-firefox-results.json`
- `tests/ux-regression-results.json`
- `tests/ux-results.json`
- `tests/ux-stage6-integrity.json`
- `tests/ux-strict-runtime-results.json`

Exactly three tracked files were restored by writing the bytes returned by read-only `git show HEAD:<path>`. No unrelated tracked file was restored. Parsed JSON differs only at `runtime.deno`: current archived `2.9.8` -> tracked baseline `2.9.7`.

| Restored file | Archived pre-cleanup SHA-256 | Restored tracked SHA-256 |
| --- | --- | --- |
| `tests/idna-probe-results.json` | `44c2d1ca85547fa92fe1b8f4e2cf375ccd0a898dd5845952427a279b053cb16a` | `435530c3da2e40afe0cf18ea5453fe4f1ca8ba069921c8239c652701aeeaa994` |
| `tests/idna-review-results.json` | `149b2b78fc6493cd114b0626b049dda90d9c4927a1e69c716dc5dd57fb289876` | `6b01e048062d6643a5d14dc3d50d1296d357f3d39d830b92bb9805b0c3aea88b` |
| `tests/unit-results.json` | `ad45359e3fb369f148ce19ddf53fd46d3a298b72d6995a985e93f36e73766239` | `3d3abf3a8cdc89a4cc3ab498c87c10bc949cfbd1987be080b339239111435ed4` |

## 4. Preserved source, data and historical tests

- All **455** other pre-cleanup source/evidence files retain their original bytes; the three restored files match their existing tracked baseline. All 126 removed receipts remain absent.
- All **91** changed permanent test executables are unchanged. No similar runner was deleted, consolidated, edited or rebaselined.
- All **30** controlled historical inputs are unchanged. These comprise 14 source-boundary JSON fixtures, seven inventory JSON fixtures, six result-named baselines and three calibration/synthetic data fixtures.
- In particular, the F-01 embedded-result regressions and F-02 CLI/imported generator/runtime tests remain intact.
- All **30 data files** in the repository and all seven identified license/notice/rights files remain byte-identical, including existing Unicode inputs and approved Majestic/PSL/index/foundation snapshots.
- The original independent audit, remediation and reverification reports remain unchanged; their standalone evidence ZIPs were verified and copied, not rewritten.

Exact retained result-named historical baselines:

- `tests/automatic-build-results.json`
- `tests/comparison-build-results.json`
- `tests/reference-build-results.json`
- `tests/stress-integrity.json`
- `tests/stress-strict-results.json`
- `tests/stage7-integrity.json`

The other controlled inputs are enumerated exactly in the first-commit list and archival MANIFEST.json. Historical tests still reconstruct their reviewed source interfaces through the unchanged hash-checked boundary chain; those restored-interface passes are not claimed as current UI proof.

## 5. Proposed first commit: 173 files

The exact technical implementation proposal contains **173 changed files**, over the unchanged committed baseline: application source, pinned data/notices, build/workflow safeguards, all permanent tests/fixtures and 12 current guidance/product documents. This exact file set was reproduced in a fresh isolated local clone and successfully built/tested, without the 126 removed receipts or the 28 historical documents. No files were staged or committed in either checkout. The clone uses a detached baseline; the original branch/main were untouched.

**This is a technical allocation, not permission to publish the two path-bearing baseline files. Resolve section 7 first.** Keep data, generators, manifests, application and their regression dependencies together; do not manufacture partial stage commits that break input/hash correspondence.

- `.github/workflows/deploy-pages.yml`
- `AGENTS.md`
- `AUTOMATIC_FINDINGS.md`
- `COMPARISONS.md`
- `DEPLOYMENT.md`
- `DESIGN_NOTES.md`
- `DISTRIBUTION_RIGHTS.md`
- `EDITORIAL_STYLE_GUIDE.md`
- `LOOKALIKES.md`
- `README.md`
- `REFERENCE_DATA.md`
- `RELEASE_CANDIDATE.md`
- `UPDATES_AND_ROLLBACK.md`
- `data/lookalikes/NOTICE.txt`
- `data/lookalikes/index.json`
- `data/lookalikes/manifest.json`
- `data/popular-domains/NOTICE.txt`
- `data/popular-domains/provenance.json`
- `data/popular-domains/records.json`
- `data/popular-domains/source.csv`
- `data/popular-domains/source.json`
- `data/public-suffix/LICENSE.txt`
- `data/public-suffix/NOTICE.txt`
- `data/public-suffix/compiled.json`
- `data/public-suffix/public_suffix_list.dat`
- `data/public-suffix/source.json`
- `data/public-suffix/test_psl.txt`
- `data/reference-foundation.json`
- `deno.json`
- `src/automatic-ui.js`
- `src/automatic.css`
- `src/comparisons.js`
- `src/domain-boundaries.js`
- `src/embedded-ui.js`
- `src/embedded.js`
- `src/lookalikes.js`
- `src/presentation.js`
- `src/reference-data.js`
- `src/results-presentation.js`
- `src/template.html`
- `src/ui.js`
- `tests/acceptance-build.py`
- `tests/acceptance-firefox.mjs`
- `tests/acceptance-inventory.json`
- `tests/acceptance-inventory.py`
- `tests/acceptance-regressions.py`
- `tests/acceptance-results.mjs`
- `tests/acceptance-source-boundaries.json`
- `tests/automatic-build-results.json`
- `tests/automatic-build.py`
- `tests/automatic-contract.mjs`
- `tests/automatic-firefox.mjs`
- `tests/automatic-regressions.py`
- `tests/automatic-source-boundaries.json`
- `tests/automatic-ui.mjs`
- `tests/comparison-benchmark.mjs`
- `tests/comparison-build-results.json`
- `tests/comparison-build.py`
- `tests/comparison-compatibility.mjs`
- `tests/comparison-dom.mjs`
- `tests/comparison-support.mjs`
- `tests/comparisons.mjs`
- `tests/data/lookalikes/calibration-source.csv`
- `tests/data/lookalikes/calibration-source.json`
- `tests/data/lookalikes/synthetic.json`
- `tests/dom-support.mjs`
- `tests/embedded-provenance-benchmark.mjs`
- `tests/embedded-provenance-build.py`
- `tests/embedded-provenance-dom.mjs`
- `tests/embedded-provenance-source-boundaries.json`
- `tests/embedded-provenance.mjs`
- `tests/final-copy-build.py`
- `tests/final-copy-cases.mjs`
- `tests/final-copy-firefox.mjs`
- `tests/final-copy-inventory.json`
- `tests/final-copy-inventory.py`
- `tests/final-copy-regressions.py`
- `tests/final-copy-results.mjs`
- `tests/final-copy-source-boundaries.json`
- `tests/final-ux-firefox.mjs`
- `tests/final-ux-regressions.py`
- `tests/final-ux-results.mjs`
- `tests/final-ux-screenshots.mjs`
- `tests/final-ux-source-boundaries.json`
- `tests/followup-build.py`
- `tests/followup-firefox.mjs`
- `tests/followup-inventory.json`
- `tests/followup-inventory.py`
- `tests/followup-regressions.py`
- `tests/followup-results.mjs`
- `tests/followup-source-boundaries.json`
- `tests/harness.mjs`
- `tests/http-structure-build.py`
- `tests/http-structure-cases.mjs`
- `tests/http-structure-firefox.mjs`
- `tests/http-structure-inventory.json`
- `tests/http-structure-inventory.py`
- `tests/http-structure-regressions.py`
- `tests/http-structure-results.mjs`
- `tests/http-structure-source-boundaries.json`
- `tests/licensing-firefox.mjs`
- `tests/licensing-offline.mjs`
- `tests/licensing-resolution.py`
- `tests/lookalike-benchmark.mjs`
- `tests/lookalike-calibration.mjs`
- `tests/lookalike-corpus.mjs`
- `tests/lookalike-fixtures.mjs`
- `tests/lookalikes.mjs`
- `tests/messaging-build.py`
- `tests/messaging-firefox.mjs`
- `tests/messaging-inventory.json`
- `tests/messaging-inventory.py`
- `tests/messaging-regressions.py`
- `tests/messaging-results.mjs`
- `tests/messaging-source-boundaries.json`
- `tests/prominence-build.py`
- `tests/prominence-cases.mjs`
- `tests/prominence-firefox.mjs`
- `tests/prominence-inventory.json`
- `tests/prominence-inventory.py`
- `tests/prominence-regressions.py`
- `tests/prominence-results.mjs`
- `tests/prominence-source-boundaries.json`
- `tests/reference-benchmark.mjs`
- `tests/reference-build-results.json`
- `tests/reference-build.mjs`
- `tests/reference-foundation.mjs`
- `tests/reference-foundation.py`
- `tests/stage7-firefox.mjs`
- `tests/stage7-integrity.json`
- `tests/stage7-regressions.py`
- `tests/stage7-release.py`
- `tests/stage7-rollback.mjs`
- `tests/stage7-source-boundaries.json`
- `tests/stage8-cases.mjs`
- `tests/stage8-firefox.mjs`
- `tests/stage8-generators.py`
- `tests/stage8-regressions.py`
- `tests/stage8-results.mjs`
- `tests/stage8-source-boundaries.json`
- `tests/stress-build.py`
- `tests/stress-cases.mjs`
- `tests/stress-engine.mjs`
- `tests/stress-firefox.mjs`
- `tests/stress-integrity.json`
- `tests/stress-inventory.json`
- `tests/stress-inventory.py`
- `tests/stress-regressions.py`
- `tests/stress-results.mjs`
- `tests/stress-source-boundaries.json`
- `tests/stress-strict-results.json`
- `tests/ui-polish-cases.mjs`
- `tests/ui-polish-firefox.mjs`
- `tests/ui-polish-regressions.py`
- `tests/ui-polish-results.mjs`
- `tests/ui-polish-source-boundaries.json`
- `tests/ux-bidi.mjs`
- `tests/ux-build.py`
- `tests/ux-firefox.mjs`
- `tests/ux-regressions.py`
- `tests/ux-results.mjs`
- `tests/ux-source-boundaries.json`
- `tools/build.py`
- `tools/extract_lookalike_calibration.py`
- `tools/extract_majestic.py`
- `tools/generate_lookalike_index.mjs`
- `tools/generate_reference_data.mjs`
- `tools/lookalike_data_lib.mjs`
- `tools/reference_assets.py`
- `tools/reference_data_lib.mjs`
- `tools/release_candidate.py`
- `tools/release_gate.py`
- `tools/verify_release.py`

## 6. Proposed documentation commit: 29 files

The following **29 files** are proposed for a separate, closely following documentation/evidence commit. Six path-bearing originals need the public-copy decision below; the list is not a recommendation to publish those six unchanged. Their authoritative originals are already preserved privately. Documentation links should be reviewed if the commits are separated. A single coherent implementation/documentation commit remains an alternative after privacy decisions.

- `FINAL_ACCEPTANCE_UI_POLISH.md`
- `STAGE2_REVIEW.md`
- `STAGE3_REVIEW.md`
- `STAGE4_REVIEW.md`
- `STAGE5_REVIEW.md`
- `STAGE5_VALIDATION_RESOLUTION.md`
- `STAGE6_ACCEPTANCE_REVIEW.md`
- `STAGE6_FINAL_COPY_REVIEW.md`
- `STAGE6_FINAL_COPY_SCREENSHOTS.md`
- `STAGE6_FINAL_UX_REVIEW.md`
- `STAGE6_FINAL_UX_SCREENSHOTS.md`
- `STAGE6_FOLLOWUP_REVIEW.md`
- `STAGE6_HTTP_STRUCTURE_REVIEW.md`
- `STAGE6_HTTP_STRUCTURE_SCREENSHOTS.md`
- `STAGE6_MANUAL_CHECKLIST.md`
- `STAGE6_MESSAGING_REVIEW.md`
- `STAGE6_PROMINENCE_REVIEW.md`
- `STAGE6_PROMINENCE_SCREENSHOTS.md`
- `STAGE6_REVIEW.md`
- `STAGE6_STRESS_REVIEW.md`
- `STAGE6_STRESS_SCREENSHOTS.md`
- `STAGE6_UX_BEFORE_AFTER.md`
- `STAGE6_UX_REVIEW.md`
- `STAGE7_LICENSING_RESOLUTION.md`
- `STAGE7_RELEASE_HARDENING.md`
- `STAGE8_INDEPENDENT_SECURITY_AUDIT.md`
- `STAGE8_REMEDIATION_HANDOFF.md`
- `STAGE8_REVERIFICATION.md`
- `PRECOMMIT_CLEANUP_HANDOFF.md`

## 7. Publication/privacy classification and precise remaining proposal

The original 19 path-bearing files now divide as follows:

| Classification | Count | Completed handling / remaining action |
| --- | ---: | --- |
| A. Required 77 release inputs | 0 | No personal home-directory paths found in those inputs or the source archive. |
| B. Required historical baseline JSON | 2 | Retained unchanged. Two metadata fields identified below need an explicit public-copy decision. |
| C. Current public product/guidance docs | 0 | No personal home-directory paths found in the 12 current documents. This new handoff uses environment-neutral paths. |
| D. Historical review/audit documents | 6 | Retained unchanged and archived. Recommend reviewed public derivatives or archive-only summaries, not publication of unnecessary machine paths. |
| E. Generated receipts | 11 | Among the 126 archived/removed receipts; no longer in the proposed commit set. |

Remaining exact files and affected metadata:

| File | Classification | Specific proposal; not implemented |
| --- | --- | --- |
| `tests/automatic-build-results.json` | B | Its only home path is the descriptive `/checks/2/name` value. A narrowly labelled public derivative can replace the repository prefix with `<repository>`, preserving the consumed `developmentManifest` exactly. Archive original/hash and verify all historical regressions after separately authorized editing. |
| `tests/stage7-integrity.json` | B | Its only home path is `/repository`. A public derivative can use `<repository>` while preserving the consumed `candidateManifest` exactly. Retain the archived original/hash; verify dependent licensing/history checks without weakening assertions. |
| `STAGE4_REVIEW.md` | D | Preserve authoritative original in the private archive. Before public inclusion, prepare an explicitly labelled derivative replacing machine paths with environment-neutral locations, preserving findings/dates/verdicts/source hashes, and recording the original document SHA-256. Keep internal evidence ZIPs private; publish only a deliberately reviewed screenshot/evidence subset if useful. |
| `STAGE5_REVIEW.md` | D | Preserve authoritative original in the private archive. Before public inclusion, prepare an explicitly labelled derivative replacing machine paths with environment-neutral locations, preserving findings/dates/verdicts/source hashes, and recording the original document SHA-256. Keep internal evidence ZIPs private; publish only a deliberately reviewed screenshot/evidence subset if useful. |
| `STAGE7_RELEASE_HARDENING.md` | D | Preserve authoritative original in the private archive. Before public inclusion, prepare an explicitly labelled derivative replacing machine paths with environment-neutral locations, preserving findings/dates/verdicts/source hashes, and recording the original document SHA-256. Keep internal evidence ZIPs private; publish only a deliberately reviewed screenshot/evidence subset if useful. |
| `STAGE8_INDEPENDENT_SECURITY_AUDIT.md` | D | Preserve authoritative original in the private archive. Before public inclusion, prepare an explicitly labelled derivative replacing machine paths with environment-neutral locations, preserving findings/dates/verdicts/source hashes, and recording the original document SHA-256. Keep internal evidence ZIPs private; publish only a deliberately reviewed screenshot/evidence subset if useful. |
| `STAGE8_REMEDIATION_HANDOFF.md` | D | Preserve authoritative original in the private archive. Before public inclusion, prepare an explicitly labelled derivative replacing machine paths with environment-neutral locations, preserving findings/dates/verdicts/source hashes, and recording the original document SHA-256. Keep internal evidence ZIPs private; publish only a deliberately reviewed screenshot/evidence subset if useful. |
| `STAGE8_REVERIFICATION.md` | D | Preserve authoritative original in the private archive. Before public inclusion, prepare an explicitly labelled derivative replacing machine paths with environment-neutral locations, preserving findings/dates/verdicts/source hashes, and recording the original document SHA-256. Keep internal evidence ZIPs private; publish only a deliberately reviewed screenshot/evidence subset if useful. |

The proposed two metadata substitutions do not touch consumed manifests, engine evidence or any of the 77 release inputs. They are recommendations only: **no baseline JSON, historical document or audit evidence was silently sanitized in this cleanup**. The changed bytes/derivative hashes and dependent tests must be reviewed if that follow-up is authorized. Do not delete these required baseline files.

The six historical documents are not required to build the runtime or reproduce the mandatory historical test chain; the isolated 173-file run demonstrated that distinction. For documents with useful release/audit conclusions, prefer clear public derivatives; archive-only treatment requires updating current-document links rather than leaving broken references. No historical verdict or independent authorship should be misrepresented.

No common private-key, GitHub/AWS/Slack-token patterns or credential-file names were found in the retained source set. Credential-like URLs in security/privacy fixtures are synthetic test data. Pattern scans are not proof that all possible secrets are absent. Temporary screenshot references and local-only evidence links also need publication review; the 303 discovered images now have a durable private copy.

## 8. Ignore/output policy: recommendations only

`.gitignore` is unchanged. It already excludes macOS metadata, Python caches/environments, dependency directories, logs, environment files and IDE metadata. No broad JSON/results/audit exclusion was added.

For later authorized work: use an explicit outside-repository report directory, or a narrowly anchored `/.local-evidence/` (alternatively `/test-output/`) after commands can route disposable outputs there. Do not introduce both without need. Existing tests that write to tests/ can continue to run in disposable copies as done here. Preserve the six result-named baselines, source-boundary snapshots, message inventories and permanent fixture directories. An ignore rule does not suppress tracked report modifications. Do not consolidate the test system as part of release hygiene.

## 9. Fresh validation of the cleaned proposed file set

The isolated checkout starts at the existing baseline and receives exactly the 173 proposed implementation files. It contains no removed receipt before testing, no 28 historical documents, no user-repository metadata copy, and no dependency on an uncommitted source-only file omitted from that list. Source comparison found the exact 173 intended changes before execution. Fresh report writes remain outside the original repository.

Strict executable SHA-256: `b73737579d5a84c160e3316487594783fa5c15f4e13252a6a07050b755317f1a`; runtime tuple: Deno **2.9.7**, V8 **15.0.245.2-rusty**, TypeScript **6.0.3**. The installed Deno 2.9.8 binary was retained unchanged and used for actual wrong-runtime rejection. The historical child-command PATH used isolated 2.9.7; release negative checks deliberately retained the installed wrong runtime. Locked dependencies were already cached; no source snapshot or dependency refresh was needed.

| Fresh check | Outcome |
| --- | --- |
| Double build and source-correspondence verifier | PASS; all eight outputs byte-identical to each other and accepted artifacts |
| Mandatory release gate | **14/14 groups PASS** |
| Stage 8 supported embedded-result regression | **76/76**, **1,804/1,804 assertions** |
| Current final-copy/privacy/accessibility DOM | **36/36**, **930/930 assertions** |
| Current UI polish DOM | **52/52**, **922/922 assertions** |
| Full preserved historical chain through UI-polish wrapper | **PASS**; original boundary assertions retained |
| Stage 7 release rejection/reproduction suite | **17/17 PASS**, including entire approved original-million identity and selected subset |
| Dedicated F-02 generator suite | **10/10 PASS**, including actual installed wrong runtime |
| Foundation and index reproduction | PASS; strict outputs equal current pins |
| Foundation / official PSL | **162/162** |
| Current matcher | **27/27** |
| Core / Unicode | **108,664/108,664** |
| Reference, embedded provenance, comparisons, compatibility | **70/70**, **34/34**, **56/56**, **8/8** |
| Worker and hosted controls | **25/25**, **64/64** |

The initial Stage 7 run omitted its optional original-CSV argument and passed 16 checks; after locating/hash-checking the retained original, the full suite was rerun with that argument and passed 17. Both receipts are archived; counts are not added. Nested historical/current receipts also overlap and are not additive.

No native Firefox, VoiceOver, physical-device or live Actions/Pages run was performed for this file-only cleanup. Prior accepted browser evidence is preserved, not relabelled as newly executed. Original manual/platform acceptance limits remain.

## 10. Candidate digest, datasets and packaging

- Candidate release remains `3.3.0-rc.1-c60cdd0c2515f03e`.
- Approved release inputs: **77/77 intact**.
- Original source-input digest remains **`e4ce06a26b57c2ec38794ce1fb5aaeda3c6bb9f0cfb1f97e76e6260d8344fcbb`**.
- All eight rebuilt artifact hashes match the accepted UI-polish package. No source, matching, data, notices, policy or generator pin was refreshed.
- The companion source archive contains exactly the 77 allowlisted files, including nine deliberately selected test source files. No execution receipt, internal stage report, personal home-directory path or unsafe archive entry was found.
- Hosted/standalone runtime files and worker contain no local home/temporary path. Runtime packaging and repository publication are separate reviews.
- Public-suffix preferred source, transformations and licensing notices remain accessible as before; none was removed for hygiene.
- The new handoff and private archive are outside the 77-input set; this cleanup does not alter source digest or release bytes.

| Artifact | SHA-256 |
| --- | --- |
| `NOTICES.txt` | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `SHA256SUMS` | `fead3e1725290ed293de24a20f5aed9ac392f9ef4152977cfe754bc21c229ce1` |
| `build-manifest.json` | `c6e2843f0a8534f00f592f8b051cb9203d443dff3f88ab457e92ecb95f58abd2` |
| `site/.nojekyll` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `site/index.html` | `c60cdd0c2515f03e24791297b6203ec6c61adf3cdbcc1cc663fa208fc1ac7ac5` |
| `site/sw.js` | `f84b2fa4a74005f8b7d3a77a642a2ff191ba24db30a56eb11929397dc6e31ab3` |
| `source-materials.zip` | `f741179c58c3dc3136c30857e8d1a4079cde10e5dcaabd594145d9b303c04ebf` |
| `standalone/Offline_URL_Inspector.html` | `6d19bdae9be145251e14407e78eb6d4c9ef90253016be07129ce5052a86a0153` |

## 11. Deployment and Git safety

The local `.github/workflows/deploy-pages.yml` is unchanged from the accepted candidate: its only trigger is `workflow_dispatch`. It has no push, pull-request, tag, schedule or workflow-run trigger. The verify job requires main, explicit authorization, an exact commit and accepted source digest; all prerequisite jobs must pass before the candidate site is uploaded/deployed. Pushing the development branch does not automatically trigger this local workflow.

The currently committed baseline workflow is older: main pushes affecting site/** or the workflow path can deploy, and manual dispatch is available without the new guards. Development-branch pushes do not match that old main filter either. Local uncommitted safeguards are not yet active on main/GitHub. Live Pages publishing settings/external integrations remain unverified; the earlier public API 404 is not proof that Pages is disabled. No Actions run, repository setting, remote branch, protection or Pages state was changed or invoked in this cleanup.

Original branch, HEAD, main and index checks are repeated after handoff creation. A detached isolated clone was used only for file-set reproduction and tests. No branch/worktree was deleted. No staging or commit was performed in either checkout.

## 12. Final review recommendation and pending decisions

**READY FOR INDEPENDENT FINAL-DIFF REVIEW** of the exact cleanup and preserved implementation. Evidence, byte identity, strict regression chain and release gates support that review.

**Not ready for public staging as-is:** decide and authorize the two metadata-only baseline derivatives and six historical-document publication treatments. They remain unchanged locally for transparent review. Also review temporary/public evidence links and confirm live Pages configuration before any separately authorized push/release. These are publication decisions, not detected regressions in the accepted application.

Completed: durable verified preservation; exactly 126 receipt removals; three tracked baseline restorations; preservation checks; isolated proposed-first-commit validation; privacy classification/proposal; this handoff.

Recommended only: privacy derivatives/archive-only public summaries, narrow future output routing/ignore rule, final independent diff review, and eventual commit structure. No cleanup beyond the explicitly authorized set, no runner refactor and no release promotion was performed. Stop for user review.
