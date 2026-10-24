# Import-preview wording adjustment

2026-10-24 12:54 PDT. Local review candidate only; no staging, commit, push, merge or deployment.

## Change and preserved behavior

The preview already calculates single-label names from `importPlan.final`. Only its explanatory sentence changed:

- Before: “1 single-label hostname in this preview: plan. This name may identify a private-network service and can only be matched exactly.”
- After: “The resulting list contains 1 single-label hostname: plan. This name may identify a local-network service and can only be matched exactly.”
- Plural example: “The resulting list contains 2 single-label hostnames: plan, desk. These names may identify local-network services and can only be matched exactly.”
- Zero: the existing empty, hidden guidance remains empty and hidden. No unnecessary zero-count message is added.

The count and hostname list remain dynamic, using the final normalized, deduplicated resulting list for both Merge and Replace. No plan calculations, parsing, matching, storage, schema, confirmation behavior, HTML structure, styling or other user-facing sentence changed. Existing other single-label help/confirmation text remains untouched as requested.

## Exact files

- `src/ui.js`: one production line, changing only this import-preview sentence.
- `tests/import-preview-results.mjs`: 48 current-runtime DOM cases in standalone and hosted editions.
- `tests/import-preview-source-boundaries.json`: the exact prior/current UI hashes and the one reviewed line replacement.
- `tests/ui-polish-regressions.py`: run the new tests against the actual current runtime, then restore only that sentence in copied source with both whole-file hashes checked before running the unchanged historical chain.
- `IMPORT_PREVIEW_WORDING_REVIEW.md`: this record.

No original historical assertion, expected hash, fixture or runner step was removed or repinned. The two new test/fixture files belong to the full repository test checkout, like existing historical fixtures; the scoped source ZIP remains a 77-input reproduction archive, not the complete regression checkout.

## Verification

| Fresh check | Result |
| --- | --- |
| Focused current-runtime import preview | **48/48**, **2,884/2,884 assertions**, both editions |
| Same focused cases against the old runtime | 44 expected wording failures, four unchanged zero-guidance cases pass |
| Current UI-polish suite | **52/52**, **922/922 assertions** |
| Full preserved historical chain | **PASS**, including original single-label/editorial assertions |
| Mandatory release gate | **14/14 groups PASS** |
| Release reproduction/rejection suite | **17/17 PASS**, including original million-row identity/subset check |
| Exact boundary checks | Prior HEAD bytes reproduced; extra bytes, unrelated edit and incorrect prior hash rejected |
| Candidate build/verifier | All eight outputs identical across two fresh builds; source-correspondence verifier passes |

Focused cases cover retained-only and incoming-only names, mixed and multiple names, empty backups, zero names, duplicates and normalization, Unicode single labels, IP exclusions, repeated Merge/Replace toggles, preview additions/removals/final list, no preview storage writes, Replace cancellation/confirmation, application/export schema and failed-write session fallback. Both editions retain text-only rendering, the same small/hidden classes and no destination requests.

These are simulated DOM and automated checks; no new native Firefox, real file-dialog, VoiceOver or visual-layout acceptance is claimed. The user reported successful manual import/export acceptance before this optional wording adjustment. No CSS or template byte changed. Nested/current/historical test counts overlap and are not a summed total.

## Candidate identity

Starting branch: `dev/v3.3.0-automatic-lookalikes`; clean committed baseline `5c80154475335c15711561d7bcccd8b34925ecd3`. Local main and origin/main remain stable baseline `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Earlier private archive paths were not needed: the old candidate was freshly rebuilt from the committed source before editing.

Input count remains **77**. Exactly two release inputs changed:

| Input | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `src/ui.js` | `972bc713b0a55b7d1a3b004951cc03bed076e3a94959b8235c0a144c2fc9a978` | `468eb401fd6a3391a60477fa2bb506634d4e9027080d5535febe8e4d60bc225f` |
| `tests/ui-polish-regressions.py` | `ad7e996976806d72d7f388fb81f4d0431ff4c173e00b559dbb46715178c688fe` | `31876d9bea997ce293435bd431242f2c546578cd3fb47bea9b5b677c9367a2bc` |

Previous source-input digest: `e4ce06a26b57c2ec38794ce1fb5aaeda3c6bb9f0cfb1f97e76e6260d8344fcbb`.

New source-input digest: **`46920aaa3bf541a314a87c1b7fa9775c73070489f43e3e372f0590b9eb7986fd`**.

New runtime release: **`3.3.0-rc.1-85f424f1dcdbc82d`**; version remains 3.3.0-rc.1, not final release approval. Approved Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3 remains enforced. No data or generator pin changed.

| Artifact | New SHA-256 |
| --- | --- |
| `NOTICES.txt` | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `SHA256SUMS` | `3246009d425816fb77fd512e3a6a3c24310acc5da9fd77ce309804bb23a2ce07` |
| `build-manifest.json` | `b216a0635eb0f85cb8d86c083de6cbbf86cac30fa8306cd3c6380a68e38b176a` |
| `site/.nojekyll` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `site/index.html` | `85f424f1dcdbc82df91f7f2a4adb639dbb69c288c4e139af33a87fc1d6eeb6f8` |
| `site/sw.js` | `fd0e4dbaa32538b0feb94fc6677ccc7d677f11b81fa528dddea8919acbfb574f` |
| `source-materials.zip` | `1f29a19477a566cbabeb36c069fcec9c02e5360d187a03c85b8141f71181eea6` |
| `standalone/Offline_URL_Inspector.html` | `a4dde392b3ecbfe266597aea6473512dfefe3d18ff70ac049723fac6fa95493a` |

HTML/script/CSP, worker pairing/release identity, source ZIP, manifest and checksums change as expected. NOTICES.txt and .nojekyll remain identical to the baseline. Stable root v3.2.0 artifacts remain untouched. The new source digest supersedes the previous candidate identity for this wording change; prior independent verdicts remain historical and do not automatically approve these new bytes.

Fresh standalone, all eight artifacts and full receipts are retained in the external local artifact directory named `import-preview-wording-20261024T194823Z`; the final chat provides the local preview link. No generated receipt or preview is added to the repository.

All five changes remain local, unstaged and uncommitted. Stop for user review.
