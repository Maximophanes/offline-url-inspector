# GitHub Actions historical-regression follow-up

24 October 2026. **Minimal local CI-harness correction; no workflow dispatched or deployment performed.** This section supersedes the packaging identity below for the corrected source. The original promotion receipt is preserved as history.

The failed [run 40132008010](https://github.com/Maximophanes/offline-url-inspector/actions/runs/40132008010/job/120985511652) used merged main commit `ab526eb13cbe3a928f871d7472545608efb74df2`. The local development checkout at `cc4b0677a3e4e814fd282ea856225f86b44de754` had the identical Git tree (`ec1d8c72f125337e7f1e7bdfb3c452526f64712e`), so it was retained for the local patch. This task issued no Git writes and retained the checkout/index. During work, local main/origin/main were externally refreshed from the stable baseline to the merged main commit; HEAD stayed on the original development commit. Read-only GitHub records confirm that final integrity, all 16 gate groups and all 32 promotion tests passed; historical regression failed, receipt/Pages uploads were skipped, and the deploy job was skipped. No nested artifact survived that run.

**Most likely cause:** historical harnesses explicitly require `/private/tmp`, a macOS path not provisioned by the Ubuntu workflow. A local fault-injection run with that parent absent reproduced the same outer failure. It also confirmed that Stage 7 tried to read an uncreated result file, masking the original temporary-directory error. With the directory provisioned, the complete chain passed. This confirms a harness/environment failure mode, not the exact hidden cause on the terminated GitHub runner. Another Linux-specific issue remains possible until hosted verification; there is no evidence here of an inspection-engine regression. The original logs alone cannot establish the missing directory's state.

## Exact correction

- `.github/workflows/deploy-pages.yml`: provision `/private/tmp` with `sudo install -d -m1777` immediately before the historical chain. This supplies the legacy harness environment while retaining every historical assertion. All triggers, authorization, commit/digest checks, permissions, action pins, upload/deploy dependencies and update safeguards remain unchanged.
- `tests/stage7-regressions.py`: preserve the original child error when its result report is missing; missing reports still fail even if a child returns zero.
- `tests/release-promotion-regressions.py`: print bounded nested failure fields directly to Actions output. Omit inputs/environment and full report dumps; redact URLs and home usernames, remove terminal controls, and prefix lines to prevent fixture text becoming workflow commands.
- `tests/release-promotion-source-boundaries.json`: update only the current workflow hash. Every previous source/hash and historical assertion remains intact.
- `FINAL_VERSION_PROMOTION.md`: this follow-up; excluded from release inputs.

## Focused results

- Before correction: absent-parent fault injection failed with the original outer summary. After diagnostics correction, the same fault still failed and printed the original `FileNotFoundError` directly.
- After provisioning the test temp parent with mode 1777: the entire promotion → UI/import → Stage 8 → Stage 7 → Stage 6 → original historical chain passed, including the original 20-command execution. These are local macOS tests with a controlled missing/provisioned-parent simulation, not native Linux execution. No test was removed, skipped or forced to pass.
- All **32/32** existing promotion checks passed. Independent builds matched all eight output bytes; the normal final verifier rebuilt and passed. Workflow YAML and all seven shell blocks passed syntax checks.
- Focused diagnostic tests passed for deep reports, missing-result rejection with zero/nonzero child exits, original-error retention, URL/home redaction, input/environment omission, terminal-control removal, command-prefix safety and bounded output. The 16 engine/release-gate groups already passed in the real failed run; they were not rerun as a new broad audit.
- Runtime/UI/data sources, preserved v3.2.0 outputs and storage behavior are unchanged. Nothing was staged, committed, pushed, merged, tagged or published.

## Corrected identity

The final release ID remains **`3.3.0-115f53cf7e4f7d21`**, because both HTML editions and the worker are byte-identical. Four of the same 84 enumerated release inputs changed: the workflow and the three test/boundary files above. Use the new source digest, not the previous `6376e063…` input.

| Current local identity | SHA-256 |
|---|---|
| Source-input inventory | `ce487ccf6621af3fc345c2814af90acdbc7f3fbf481ac72acf45f95ae5c831b3` |
| `source-materials.zip` | `84a8f1baaf044f06235161f4e108b88620d25d8567dbc96304c14cb6fbadc1c2` |
| `build-manifest.json` | `94755d19a8fe058881a15de9be1239e610a6cdb330a4a1659bea2b9cfd68ca57` |
| `SHA256SUMS` | `f7162a60487b67de796e136bd69dd9a139735a0708047cc1cbf60047f3b25e99` |

The other five output hashes in the historical receipt remain valid. Local packaging used Python 3.15.0 / zlib 1.2.12; the failed Linux runner recorded Python 3.14.4 / zlib 1.3.1. Accept the real runner's newly built packaging receipt rather than assuming cross-toolchain ZIP/manifest equality.

## Remaining hosted check and shortest safe path

Review this local patch and its new digest, then separately authorize getting it committed onto current main. A **new**, explicitly authorized dispatch must bind that new commit and digest. Re-running the old failed run uses its old source and is not the correction path. The existing workflow couples successful verification to deployment, so the new dispatch can publish automatically when all checks pass; it was deliberately not invoked here. Native Ubuntu/GitHub-hosted verification of this patch remains necessary. If verification must precede deployment permission, use a separate verification-only environment/job, not the already-authorized deployment run. The existing published v3.2.0 files remain untouched.

---

# Historical original final-version promotion receipt

# Final v3.3.0 version promotion preparation

24 October 2026. **Local implementation and verification passed. Publication/deployment is not authorized.**

Starting commit: `f41c5e391619bb73176168045e9c7aaef93410dc`, on `dev/v3.3.0-automatic-lookalikes`. Its independently verified RC was `3.3.0-rc.1-85f424f1dcdbc82d`, source-input SHA-256 `46920aaa3bf541a314a87c1b7fa9775c73070489f43e3e372f0590b9eb7986fd`. That identity was reproduced before editing. PR #3 was checked read-only before and after preparation: open, Draft, same head and base.

## Modifications

| Files | Change |
|---|---|
| `tools/build.py` | Explicit, mutually exclusive `--final-release` mode builds version 3.3.0 from source; retains `--release-candidate` and historical stable/default guards. Both release modes require fresh outside-checkout output. |
| `tools/release_candidate.py` | Shared RC/final packaging with strict separate identities, final offline notice scope, rebuilt source archive and checksums. Adds executable-version and direct worker/source correspondence checks. No previous integrity check was removed. |
| `tools/verify_release.py` | Explicit `--release-root` requires final identity; `--candidate-root` requires RC. Neither mode can refresh historical checksums. |
| `tools/release_gate.py` | Explicit final/RC mode; retains every prerequisite and adds current UI-polish/import-preview suites. |
| `.github/workflows/deploy-pages.yml` | Builds `--final-release` into `final`, verifies/gates `--release-root`, rejects incorrect final metadata/digest, runs promotion and preserved-history tests, uploads only that run's `final/site`. Full-history checkout supplies commits needed by historical checks; a shallow checkout was insufficient. |
| `tests/release-promotion.py` | 32 deterministic-build, mode-separation, packaging/authorization rejection, runtime/data preservation, rollback compatibility and workflow checks. |
| `tests/release-promotion-regressions.py`, `tests/release-promotion-source-boundaries.json` | Outer hash-checked restoration of six release-engineering interfaces to the accepted RC in disposable copies. Original historical tests, pins and reports remain unchanged. Current final verification/UI/import checks run against final bytes. |
| `FINAL_RELEASE.md`, `RELEASE_CANDIDATE.md` | Separate final and retained RC instructions, metadata, build/authorization distinction and acceptance scope. |
| `DEPLOYMENT.md`, `UPDATES_AND_ROLLBACK.md` | Final workflow contract, preserved safeguards, v3.2.0 matched-set recovery and unperformed hosted gates. |
| `README.md`, `CHANGELOG.md` | Current final-preparation status and user-reported manual acceptance; older versioned evidence remains historical. |
| `FINAL_VERSION_PROMOTION.md` | This handoff; excluded from build inputs to avoid a self-referential digest. |

The input inventory grows from 77 to **84** files: six existing release inputs changed, 71 remain identical, and seven are newly enumerated: `FINAL_RELEASE.md`, `DEPLOYMENT.md`, `UPDATES_AND_ROLLBACK.md`, existing `tests/import-preview-results.mjs`, and the three promotion test/boundary files. README/changelog and this receipt do not affect artifact construction. The companion source archive retains an explicit allowlist; the complete Git checkout remains necessary for the full historical gate.

## New exact identity

- Version: **3.3.0**; release: **`3.3.0-115f53cf7e4f7d21`**.
- Source-input SHA-256: **`6376e063d35775b4f744e881518a13b6c9f18e77e889384ac733d9821916a17b`**.
- Manifest: `releaseVersion: "3.3.0"`, `buildKind: "final"`, `releaseCandidate: false`, `developmentOnly: false`, `releasePreparationOnly: true`, `publicationAuthorized: false`; no `candidateVersion` field.
- Local toolchain: Python **3.15.0**, zlib **1.2.12**; strict Deno **2.9.7**, V8 **15.0.245.2-rusty**, TypeScript **6.0.3**.

| Output | SHA-256 |
|---|---|
| `site/index.html` | `115f53cf7e4f7d2133073985b6e4c59a179012051faaa760d0a95c67b2616ef5` |
| `site/sw.js` | `3686406787c38c76d2df61ebdab20bba41402d07f747aad5b5534bd7e9dec27a` |
| `site/.nojekyll` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `standalone/Offline_URL_Inspector.html` | `ebca33532c4401cb302016a38dd5a4c996afaacefa135fc8a7992b772df6687f` |
| `NOTICES.txt` | `07187bb4f52d6502b0b1ec9b8f39dcecc7b4e1ff29fb17c3f45d83d259708a1b` |
| `source-materials.zip` | `84779c2a311c0abdd98f607d4d30c98ebb20403110a2240cbd764a1cf30d4c0a` |
| `build-manifest.json` | `ac7011b9b97d9a93772dfdce3b2630377208f1fedd7aad47d2a29c40363a234a` |
| `SHA256SUMS` | `01bab5dfbfdd26ccd46126bca8111d015170bdd7f694ae7ae88cbc615369af61` |

The final executable differs from the rebuilt RC executable only in APP version, in both editions. Styles and inert analysis data are identical. Visible version, CSP, full HTML hashes, worker identity and legal scope are rebuilt together; no RC artifact was renamed. The RC path still independently builds and verifies, with its current packaging-input identity distinct from the original committed RC receipt.

## Executed verification

| Check | Result |
|---|---|
| Two independent final builds and source-correspondence verifier rebuild | All eight outputs byte-identical; passed. |
| Build using only extracted `source-materials.zip` | All eight outputs byte-identical to final bundle; passed. |
| Full mandatory final gate | **16/16 prerequisite groups passed**, zero failures. Includes strict foundation/index reproduction; 162 PSL/foundation, 27 matcher, 36 final-copy, 76 Stage 8 embedded, 52 current UI-polish, 48 import-preview, 108,664 core/Unicode, 70 reference, 34 provenance, 56 comparison, 8 compatibility, 25 worker and 64 hosted-control checks; generator negatives also passed. Counts overlap historical execution and must not be added into one total. |
| Promotion suite | **32/32 passed**. Rejects renamed RCs, opposite verifier modes, forged authorization, stale/mixed/extra/missing/symlinked outputs, duplicate/recomputed checksums, changed notices, source identity/runtime mismatches and failed release prerequisites. |
| Existing Stage 7 release suite on separately rebuilt RC outputs | **17/17 passed**, including double data generation and complete approved million-row CSV/subset verification. |
| Stage 8 generator suite with actual installed Deno 2.9.8 negative | **10/10 passed**; unapproved binary wrote zero output files. Existing runtime guards/pins remain intact. |
| Promotion → accepted UI/import → Stage 8 → Stage 7 → Stage 6 → earlier historical regression chain | Passed, including original complete 20-command historical execution. Hash-checked source restoration happens only in temporary copies; no assertion, fixture or pin was relaxed. Nested counts overlap. |
| Workflow parsing | Valid YAML; all seven shell scripts passed syntax checks. Manual final-only route, immutable action pins and authorization guards checked locally. No Actions run was dispatched. |
| Packaging/licensing/privacy integrity | Exact 84-entry source archive and eight-file distribution; offline Majestic/CC BY notices, MPL license and exact PSL sources present in both HTML editions; no local machine paths in either HTML. No snapshot or license notice was repinned. |
| Repository preservation | All 49 `src/`/`data/` files equal the accepted commit. All pre-existing files outside the ten listed tracked edits remain identical. Index, HEAD, main and origin/main unchanged; nothing staged. Whitespace check passed. |

Raw receipts are retained outside the repository with the final eight-file bundle: `final-gate.json`, `release-promotion.json`, `release-tests.json`, `runtime-negative.json`, `final-history.json`, `archive-reproduction.json`, `final-verification.json` and `preservation.json`. A fresh standalone preview is the bundle's `standalone/Offline_URL_Inspector.html`.

## Preserved update/rollback compatibility

Stable v3.2.0 is `3.2.0-a67e4b13dd5fa5cd` at `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Its root hosted/standalone outputs, manifest and checksums remain byte-identical. `src/sw.js`, `src/hosted.js` and `src/references.js` also match that baseline. Final worker bytes are exactly the unchanged template with the new final release and complete HTML hash substituted.

Fixed project scope, atomic complete-HTML caching, reviewed activation/reload, retained previous cache, schema 1, `offline-url-inspector:reference-domains`, import/export protections and user references are preserved. Approved Majestic/PSL/Unicode sources, derived data, hashes and matching policies are unchanged. Rollback still requires the archived matched v3.2.0 HTML/worker set and separate authorization; the forward final-only workflow deliberately rejects old release identity. Do not rebuild current sources and label them v3.2.0 or clear reference storage. Passing source/asset checks and lifecycle simulations does not establish a live upgrade/rollback rehearsal.

## Acceptance and remaining gates

The user reports successful macOS backup import/export round trip, keyboard-only navigation, macOS VoiceOver and physical-device testing of the verified RC. These manual passes are recorded as user-provided acceptance, not newly performed tests. No application layout, runtime source or inspection behavior changed during promotion. Final-version native/manual acceptance was not rerun.

1. Review and accept this exact final source inventory, artifact set and local diff. Any enumerated input change requires a rebuild and new identity.
2. Actual GitHub-hosted Linux/toolchain reproduction, action execution, environment approvals/protection/settings enforcement and production Pages checks remain **UNPERFORMED**. Python/zlib can affect source-archive bytes; cross-platform equality has not been established. Review the real runner's receipt and accept its exact outputs before deployment.
3. Live v3.2.0 → final v3.3.0 update, retained-cache recovery and controlled rollback on Pages remain **UNPERFORMED**. Unperformed browser/platform coverage remains unclaimed.
4. Commit, push, merge, tagging, publication and deployment each remain subject to separate authorization. The workflow still has only manual dispatch, main-only execution, exact commit/digest binding, default-false authorization, read-only verification credentials, dependent deployment, environment approval boundary and moved-main rejection. Pushing the development branch cannot trigger deployment.

Everything remains local, unstaged and uncommitted on the existing branch; stable main and PR #3 Draft status are unchanged. **Ready for review of the prepared final-version build; no publication or deployment approval is implied.**
