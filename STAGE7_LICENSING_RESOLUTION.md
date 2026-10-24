# Stage 7 licensing resolution — v3.3.0

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

23 October 2026. **READY FOR INDEPENDENT AUDIT.** The approved snapshot is the publicly licensed daily Majestic Million CSV, with a documented attributed reuse path. The earlier blanket licensing blocker is withdrawn for audit readiness. This is technical licensing-compliance analysis, not professional legal advice, a worldwide warranty of rights, final release acceptance or deployment permission. Stage 8 has not begun.

## Authoritative sources verified

| Official source | Verified evidence and relevance |
|---|---|
| [Majestic Million download page](https://majestic.com/reports/majestic-million) | Links the CSV download and CC BY 3.0 license. The acquisition-time saved page independently contains the same association. |
| [Daily CSV announcement, 1 October 2012](https://blog.majestic.com/development/majestic-million-csv-daily/) | Identifies the recurring downloadable CSV, Majestic 12 and CC BY 3.0 Unported. Its earlier Christmas release is described separately. |
| [CC BY 3.0 deed](https://creativecommons.org/licenses/by/3.0/) and [legal code](https://creativecommons.org/licenses/by/3.0/legalcode) | Reproduction, adaptation and redistribution, including commercial use, subject to attribution, license/notices, change identification and other terms. No additional restrictions. The legal code controls. |
| [One-off announcement, 25 December 2011](https://blog.majestic.com/case-studies/million/) | Describes a snapshot generated 22 December 2011, Excel/TXT downloads and CC BY-SA 3.0. This is a different acquisition path/asset. |
| [Daily-list mirroring announcement, 22 November 2016](https://blog.majestic.com/development/alexa-top-1-million-sites-retired-heres-majestic-million/) | Additional publisher authorization: expressly invites attributed mirroring so others can download/query the list. This directly supports intended public redistribution beyond a bare license label. |
| [Majestic general terms](https://majestic.com/company/terms) | Broad site-material rules and separate subscription conditions were reviewed in context, rather than silently ignored. |
| [CC database-rights FAQ](https://creativecommons.org/faq/#how-does-the-treatment-of-sui-generis-database-rights-vary-in-prior-versions-of-cc-licenses) | Retains the distinction that 3.0 Unported does not expressly license sui generis database rights; public publisher reuse permission is evaluated separately. |
| [Official PSL distribution](https://publicsuffix.org/list/), [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/) and [Mozilla FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) | PSL source/modified forms, source availability, notices and larger-work treatment are reviewed independently from Majestic. |

The cited pages were read during this follow-up. No new CSV, PSL or matching database was downloaded. Structured evidence is in `tests/licensing-resolution-evidence.json`. No publisher was contacted and no terms were accepted on the user's behalf.

## Snapshot-to-license applicability

The following chain was reverified from retained acquisition evidence and actual bytes:

1. Recorded source page: `https://majestic.com/reports/majestic-million`.
2. Requested and final CSV URL: `https://downloads.majestic.com/majestic_million.csv`; filename `majestic_million.csv`.
3. Recorded acquisition time: **2026-10-22T02:43:51.752169+00:00** (21 October in Pacific time). The response Date is 22 October 02:43:54 GMT; Last-Modified is **21 October 2026 05:00:20 GMT**, ETag `"4bf57fd-65e529fb7a305"`.
4. Exact original: **79,648,765 bytes, 1,000,000 complete ordered ranks**, SHA-256 `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a`.
5. Saved acquisition page: **335,681 bytes**, SHA-256 `47ed2572ca8d3582f0982d9a294681942b2f28d18a8f2e16ee1d27f6df434803`. Its actual HTML links both the CSV and the CC BY 3.0 URI in its Export/License area. The page's October 22 generation label is not substituted for the CSV's October 21 Last-Modified.
6. Full CSV identity/schema/rank verification and `tools/extract_majestic.py --check` reproduced the approved **176,483-byte / 10,000-row** two-column subset, SHA-256 `01ddd1c4da949fb9d8c4a12b3ae4ca2dce22f9f6048764693553a65664cf5f55`. The command checks rather than writes.
7. The pinned manifests bind that subset and original identity to **9,570 normalized reference domains**, provenance and the existing matching index. Those files and hashes are unchanged in this follow-up.

The retained full CSV is `/private/tmp/offline-url-inspector-v330-stage1-2q9ntuv9/majestic_million.csv`. Its acquisition record and saved page are also copied into `/private/tmp/oui-stage7-license-okovwkif` as `original-acquisition.json` and `original-licensed-download-page.html`. Hashes bind the retained evidence together; they are not a publisher signature. There is no original packet capture/request-header transcript. The recorded public download route is not a subscription/API endpoint, and the evidence contains no subscription contract or authenticated acquisition requirement; absence of an unrecorded request header is not independently proven.

**Applicability finding:** the approved input is the licensed recurring public CSV. Nothing in its recorded acquisition links it to the 2011 static Excel/TXT release. No retroactive relicensing, inferred 2011 generation date, inherited ShareAlike obligation or new snapshot was assumed. A hostname's appearance in an older factual list does not itself establish that our file was copied under that older asset's license.

## Permitted transformation and attribution compliance

CC BY 3.0 legal-code section 3 supplies the copyright reproduction/adaptation/distribution grant. The app conservatively treats its output as transformed data, preserving credit rather than relying on a factual-data exception. Raw rank selection, suffix-only exclusion, native normalization, deduplication and generated comparison keys/indexes are compatible with the permitted adaptation/distribution path. There is no condition forbidding a 9,570-domain subset or imposing ShareAlike on it. This conclusion relies on the identified public grant and permission, not an assertion that 1% of a database is legally insubstantial.

| Obligation / concern | Verified implementation |
|---|---|
| Identify creator/provider and work | Pinned notices identify **Majestic / The Majestic Million**. The supporting official CSV announcement identifies Majestic 12; current attribution uses its publisher brand. |
| Identify source | Official dataset and download URLs are present in the notice, source metadata and source archive. |
| Applicable license | **CC BY 3.0**, with deed and legal-code URIs; no substitution of BY-SA or CC 4.0. |
| Identify relevant modifications | Original rank cutoff, selection, normalization/deduplication and generated comparison keys/spelling buckets are described across the source/index notices and provenance. Current documentation additionally explains suffix-only exclusions and counts. |
| Preserve notices/disclaimers | Both HTML editions retain the exact pinned notices, including no endorsement and popularity limitations; archive/NOTICES copies are checked against source bytes. |
| License availability | Readable CC license URIs are provided. Section 4(a) permits a copy **or URI**; fetching the full CC text at runtime is unnecessary. Offline notices remain readable without network access. |
| No implied endorsement | Explicit no-Majestic-endorsement statement remains; no logo, trust endorsement or maliciousness verdict was added. |
| Downstream rights | No NC, ND, ShareAlike, payment, account or no-redistribution term is added to the covered data. The third-party data license is distinguished from independently authored app code and this project's deployment authorization. |
| No technological restriction | Dataset/index JSON and source materials remain readable/copyable; the source ZIP is not encrypted. CSP and integrity checks constrain app execution/updates, not extraction or lawful reuse of the covered data. |

The existing pinned notice is already adequate; changing it would unnecessarily change trusted notice hashes and derived source manifests. No source/data notice, pin, dataset, engine, runtime UI or build/workflow code was edited. The ordinary inspection interface still has no legal panel or extra message.

The exact prior 9,570-record data/provenance/index bytes remain unchanged. Full-million data are not added to the application or repository. No comprehensive ownership/trademark clearance is asserted for listed domain names, and none is required to claim that Majestic endorses the app because the app makes no such claim.

## Additional terms and residual legal interpretation

The general site terms are not a license to use all Majestic materials. Their commercial-use language requires a license; the current data-specific CC grant supplies one for this particular public CSV. Subscription/API clauses are not assumed to govern a different publicly licensed download merely because the same provider offers subscription services. No contrary CSV-specific reservation, no-derivatives condition or separately evidenced acquisition contract was located. This is the reasoned scope reading used for technical readiness, not a finding that general terms can never matter. Access-frequency instructions are preserved; no fresh CSV retrieval or application polling occurred.

The earlier Stage 7 report overextended a genuine generic CC-version caveat into an automatic pre-audit blocker. CC's FAQ does **not** say that 3.0 Unported expressly includes the 4.0 sui generis grant, and this follow-up does not invent that grant. However, it also does not show that Majestic withholds ordinary reuse of the very daily list it expressly publishes for reuse and invites others to mirror. The official 2012 adaptation-oriented release and the 2016 attributed mirroring invitation are materially relevant publisher evidence.

**FACT:** the identified asset carries the BY license and explicit public redistribution encouragement. **INFERENCE:** attributed transformed reuse of that public list follows the publisher's communicated permission, sufficient to proceed to independent audit. **RESIDUAL UNCERTAINTY:** no separate clause using the words “sui generis database rights,” jurisdiction-specific court ruling or universal rights warranty was found. This interpretation is presented for the independent reviewer to assess; it is not disguised as adjudicated legal clearance.

No bespoke permission is demanded solely because it was not individually requested. Conversely, a later demonstrated contrary reservation, materially different acquisition contract, third-party right or independent review finding would reopen the issue. No concrete unresolved conflict requiring a new permission was identified on the current evidence. The distinction between public BY permission and a universal legal guarantee remains explicit.

## PSL / Mozilla obligations remain separate

Majestic's BY grant does not license PSL material. The approved PSL raw list, complete MPL 2.0 text, notices, source commit/blob identity, ICANN/PRIVATE sections and transformed rules remain unchanged. Both HTML editions retain exact preferred raw PSL source and transformation materials offline, with full license/notice disclosures. The source archive includes the corresponding raw/derived source, manifests and reproduction sources. MPL sections 3.1–3.4 and Mozilla's FAQ support the existing source-availability/larger-work approach; independently authored app code was not silently relicensed. The separate CC0 fixture notice remains intact.

Fresh focused tests compare the actual bundled PSL notice, full MPL text and every existing source-availability input to current source bytes. There is no new missing-source or altered-notice finding. Final independent review of compiled-data/larger-work treatment remains an ordinary acceptance item, along with the existing audit/browser/deployment checks. It is not replaced by Majestic's licensing resolution.

## Exact changes and refreshed packages

Four existing documents changed:

- `DISTRIBUTION_RIGHTS.md`
- `README.md`
- `RELEASE_CANDIDATE.md`
- `STAGE7_RELEASE_HARDENING.md`

`DISTRIBUTION_RIGHTS.md` replaces the automatic blocker with the scoped evidence-based path and retained caveat. README and candidate instructions link to the current resolution. The original Stage 7 handoff has a clearly marked superseding note; its original verdict, artifact hashes, historical findings and test evidence are preserved below that note. Old machine-readable Stage 7 receipts are unchanged and remain bound to their original snapshot.

New report/tests/evidence:

- `STAGE7_LICENSING_RESOLUTION.md`
- `tests/licensing-firefox.mjs`
- `tests/licensing-offline.mjs`
- `tests/licensing-resolution-evidence.json`
- `tests/licensing-resolution-firefox-results.json`
- `tests/licensing-resolution-gate-results.json`
- `tests/licensing-resolution-integrity.json`
- `tests/licensing-resolution-offline-results.json`
- `tests/licensing-resolution-results.json`
- `tests/licensing-resolution-starting-inventory.json`
- `tests/licensing-resolution.py`

Candidate root: `/private/tmp/oui-stage7-license-okovwkif/one`; independent repeat: `/private/tmp/oui-stage7-license-okovwkif/two`. Runtime release ID remains `3.3.0-rc.1-0af3824ff7dd5cb8` because both HTML editions and worker are unchanged. **The complete package has a new identity:** source input digest `30037cdc15185edeb644fcf875e22245dbc5c782af420a8a005f66c30fbc393f`. Only `DISTRIBUTION_RIGHTS.md` and `RELEASE_CANDIDATE.md` changed within the 70-input candidate allowlist. The corrected assessment is included in `NOTICES.txt` and `source-materials.zip`; the old complete package is retained rather than overwritten. Audit the new full manifest/input identity, not just the unchanged runtime ID.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `NOTICES.txt` | 32246 | `352b3a39b590ea64855adb34c151d4e1314b86da00c102141a62ffa87a917b4c` |
| `source-materials.zip` | 2799705 | `0a7ba1e47a59ea2a43f3acf021e2430200a5d196bcb1c31e8ec38b3a1e02479c` |
| `site/.nojekyll` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `site/index.html` | 4053647 | `0af3824ff7dd5cb8bd72e4262c66fcbb41bca3b7e15e79c0b02660ececb96f43` |
| `site/sw.js` | 4153 | `864682c766cbe67d5762214b52e56b866ec6f49dbe06b6a311e7cae44d82f704` |
| `standalone/Offline_URL_Inspector.html` | 4041587 | `b17a482ea5b914b6c9e9e58d55ef96c2acba6fc7b37b1898fb14a646fed9ad0f` |
| `build-manifest.json` | 16520 | `5389ebcc0daa108f917e7c7762ae61e2f298f6c15fb1e44d34b0994a76b3d14b` |
| `SHA256SUMS` | 595 | `cd970635c3d6d5aed6c3192c215a6b3f21f17e094009e32efdfc23cbe4eb296c` |

Standalone preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/016-Offline_URL_Inspector.html` (SHA-256 `b17a482ea5b914b6c9e9e58d55ef96c2acba6fc7b37b1898fb14a646fed9ad0f`) · Source archive — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/015-source-materials.zip` (SHA-256 `0a7ba1e47a59ea2a43f3acf021e2430200a5d196bcb1c31e8ec38b3a1e02479c`) · Manifest — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/014-build-manifest.json` (SHA-256 `5389ebcc0daa108f917e7c7762ae61e2f298f6c15fb1e44d34b0994a76b3d14b`). Temporary local files may eventually be removed by OS cleanup; nothing was published.

## Verification results

| Executed check | Result |
|---|---|
| Original CSV/page/acquisition-to-source applicability | Exact existing hashes and the same page's download/license association reverified; complete million-row input and selected subset checked without writing. |
| Focused distribution/verifier tests | **10/10 passed.** Two builds agree across all eight outputs, full source/artifact rebuild correspondence, runtime/data preservation, both-edition attribution, PSL source/MPL and archive checks. Missing NOTICES, absent source archive and altered inline license despite recomputed inventories were rejected. |
| Generated DOM offline legal disclosures | **6/6 cases, 46/46 assertions.** Both editions expose attribution/license/source, no inspection required, collapsed text cleanup and no network/navigation call. |
| Native Firefox | **6/6 passed** in native headless Firefox 158.0.1. Actual standalone file and loopback hosted disclosures, mounted text cleanup, hosted cached reload after the server stopped, zero additional served requests, no external destination requests or unexpected page errors. Expected favicon CSP blocks remain recorded separately. |
| Existing Stage 7 mandatory gate | **12/12 command groups passed again** with isolated strict Deno 2.9.7, including existing data `--check`, foundation/PSL, current matcher, core Unicode, references/storage, provenance, comparisons/compatibility, current findings/privacy/accessibility, worker lifecycle and hosted controls. |
| Preservation | All original `src/`, `data/`, build/verifier/workflow code, previous assertions/reports, stable editions, root stable manifests and installed Deno remain unchanged. Four documentation exceptions are enumerated; no starting file was deleted. |

No source dataset generation/write/refresh was requested or performed. The release gate's offline `--check` commands and existing tests recompute expected data in memory as integrity checks; they do not replace source datasets. The original 17 Stage 7 checks and broad historical chain were not rewritten or reinterpreted as fresh executions; their files and applicable runtime bytes remain preserved. Focused current verifier negatives and the entire current mandatory gate were rerun because the package/assessment changed. The full historical UI/performance/zoom/upgrade/rollback suites were not needlessly repeated for documentation-only inputs. The old native-tested HTML/worker hashes match the refreshed bundle exactly, and fresh legal-specific native checks supplement that identity evidence.

No native headful, VoiceOver, physical-device, file-picker or live GitHub Actions/Pages acceptance is claimed. The disposable browser/profile and fixed loopback server were stopped; candidates and evidence remain outside the repository. `tests/licensing-resolution-integrity.json` records all starting/final hashes and preservation checks.

## Updated Stage 7 verdict

**READY FOR INDEPENDENT AUDIT.** The identified daily CSV has an applicable public BY reuse grant, traceable acquisition evidence, conforming transformations/attribution and unobstructed downstream data rights. Explicit publisher mirroring permission strengthens the interpretation. No concrete contrary restriction or missing notice/source item was found that warrants continuing the earlier automatic licensing blocker.

The unresolved possibility of a jurisdiction-specific interpretation is stated rather than converted into a demand for bespoke permission or a claim of universal legal clearance. Stage 8 must still independently review the exact future immutable candidate, its licensing reasoning and preserved source-availability treatment. All earlier independent/manual/runner/deployment acceptance items remain open. A working-tree input digest is not a Git commit, and audit readiness does not authorize deployment.

Branch `dev/v3.3.0-automatic-lookalikes`, HEAD and stable main remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`. All development changes remain local, unstaged and uncommitted. No Stage 8 work, staging, commit, push, PR, merge, release or deployment occurred. Stop for user review.
