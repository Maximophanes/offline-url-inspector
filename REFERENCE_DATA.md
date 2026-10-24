# v3.3.0 reference data policy

The approved foundation below is now used by the automatic matcher, orchestration and Stage 6 interface. Its immutable component manifest intentionally retains `foundation-only` schema metadata; the final build manifest separately declares active automatic matching/UI. Those fields are not a claim that the completed app is dormant. No snapshot, tier, pin, normalization or matching policy changed in Stage 7. The older build/default-verifier statements below describe their original foundation checkpoint. Current builds use [FINAL_RELEASE.md](FINAL_RELEASE.md); licensing and exact offline source packaging are assessed in [DISTRIBUTION_RIGHTS.md](DISTRIBUTION_RIGHTS.md). Runtime data remain bundled in both HTML files, with no online lookup or automatic refresh.

## Preserved foundation implementation and provenance

# v3.3.0 Stage 2: offline reference and PSL foundation

This stage implements data preparation and domain boundaries. It does not implement automatic lookalike matching or new findings/UI. Majestic is the sole popular-domain provider. No Google account, cloud query, runtime refresh, new dependency or inspected-destination request is involved.

## Approved source snapshots

The Stage 1 files were still available and their complete identities were checked before reuse.

| Input | Identity |
|---|---|
| Majestic original | 79,648,765 bytes; 1,000,000 complete ordered ranks |
| Majestic original SHA-256 | `a5bafba77ae3586dac6ad563a3f374c2f18baca9297b9c7e5137022f0356ea8a` |
| Majestic selected subset | 176,483 bytes; 10,000 original rank/hostname pairs, header and LF CSV |
| Subset SHA-256 | `01ddd1c4da949fb9d8c4a12b3ae4ca2dce22f9f6048764693553a65664cf5f55` |
| PSL official distribution | `2026-10-20_08-40-56_UTC`; 338,010 bytes |
| PSL upstream commit | `5dd321ffe02039e2431382a095cf80e27ff5eb94` |
| PSL raw SHA-256 | `8228e4bdac6024c058a1e67859157e468a2613b826b53de0e5cae298e1b70755` |
| PSL upstream Git blob | `30b18ab3c21f96dd1c4a7b4adb9b16ed9e2b30aa` after removing exactly the added VERSION/COMMIT publication block |
| Unicode | Existing 18.0.0, UTS #39 revision 34 LTR scope; data SHA-256 `806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1` |

`data/popular-domains/source.json` retains source URLs, Stage 1 retrieval time, CSV Last-Modified/ETag, the original checksum, extraction rules and license notice hash. The landing page labels its generation October 22, while the actual CSV Last-Modified is October 21 05:00:20 GMT. These are separate publisher signals; the checksum identifies the reused CSV. No historical identity was fabricated and no second snapshot was combined with it.

The complete 80 MB input is not added to Git. `source.csv` contains original GlobalRank and Domain fields, without IDNA rewriting. `tools/extract_majestic.py` checks the full original hash, size, schema and every ordered rank before reproducing that subset. Normal builds need only the approved committed subset.

## PSL behavior

`src/domain-boundaries.js` applies the published longest-rule algorithm, wildcard matching, exception precedence and default `*` rule, retaining ICANN/PRIVATE provenance. Both sections are enabled by default. Disabling PRIVATE is explicit and tested; production reference generation uses both sections.

The factory copies compiled rules into bounded private maps. Lookup accepts a bare hostname, not an arbitrary URL. The existing Inspector/native URL path owns normalization and IDNA round trips. No competing parser or IDNA table was introduced.

Statuses are `ok`, `suffix-only`, `unknown-suffix`, `single-label`, `ip`, `invalid` and asset-level `unavailable`. Unknown TLDs still get the official algorithm's default suffix/registrable result, but remain ineligible as approximate references. A non-null registrableDomain alone is not an eligibility decision: callers must inspect status.

Canonical fields omit one terminal root dot; `trailingDot`, `publicSuffixFQDN` and `registrableDomainFQDN` preserve it separately. The result includes full ASCII/readable hostnames, suffix, registrable domain, subdomain, actual prevailing rule and section, wildcard/exception flags and normalization-change evidence. IP forms are identified after native parsing, including shortened IPv4 forms. Whitespace, credentials, ports, paths, percent escapes, invisibles, malformed Punycode and DNS syntax/length failures are rejected rather than repaired.

The pinned official fixture file contains 78 active cases and its original public-domain/CC0 notice. It is parsed as fixture data, not executed. Additional independent cases cover private tenants, root dots, exclusion semantics, exception precedence over a longer exact rule, and wildcard bases that must not become implicit exact rules.

## Selection and actual counts

GlobalRank measures Majestic's referring-subnet ranking. It is not measured visits, legitimacy, ownership, reputation or threat probability. Cutoffs apply before normalization. Exclusions and merges are not topped up from later ranks.

| Raw cutoff | Selected rows | Accepted rows | Suffix-only excluded | Duplicate accepted rows merged | Distinct registrable domains |
|---|---:|---:|---:|---:|---:|
| 1,000 | 1,000 | 949 | 51 | 66 | 883 |
| 5,000 | 5,000 | 4,826 | 174 | 112 | 4,714 |
| 10,000 | 10,000 | 9,710 | 290 | 140 | 9,570 |

The current selected source has no other exclusion reasons. Synthetic tests cover invalid names, IPs, single-label and unknown/suffix-only cases independently. Platform apexes such as github.io/blogspot.com/pages.dev are excluded because they are public suffixes under the required PRIVATE policy. Tenants remain distinct; subdomains of the same tenant can merge. Do not bypass this policy by falling back silently to ICANN-only boundaries.

The top-1,000 spelling tier is the 883 normalized records whose minimum source GlobalRank is <=1000. Its matching policy and false-positive calibration remain Stage 3 work. The <=5000 configuration has been measured; <=50000 is not bundled or normalized in this stage. Current size evidence does not require changing the approved cutoffs.

## Data contract, version 1

`data/reference-foundation.json` is the canonical manifest. It binds the sole provider, original and subset identities, PSL version/commit/blob/hash, Unicode hash/scope, policies, generator/extractor/module hashes, normalization runtime, counts, licenses and every derived asset's exact size/hash. It declares `status: foundation-only`, `automaticMatchingAvailable: false` and `indexFormatVersion: null`. No matching index is represented as implemented.

`data/public-suffix/compiled.json` has schema 1, kind `public-suffix-rules`, the raw PSL and Unicode hashes, and two sorted arrays of canonical A-label rules, `rules.ICANN` and `rules.PRIVATE`. It contains all 10,396 normalized rules, including the 311 wildcards and 8 exceptions.

`data/popular-domains/records.json` has schema 1, kind `popular-domain-records`, the provider/source/subset/PSL/Unicode hashes, normalization/selection policy IDs, rank cutoffs, a fields descriptor and compact immutable runtime tuples:

```text
[asciiDomain, globalRank, sourceRowCount, publicSuffixASCII, section]
```

`section` is `I` or `P`. The tuple's zero-based array index is its deterministic ID. `globalRank` is the minimum original rank among its contributing rows; spelling membership is derived from that value, not a claimed probability. Readable forms remain available through the existing Inspector and in development provenance.

`data/popular-domains/provenance.json` is build-only. Each ID/domain retains its readable form, minimum rank and all original source hostnames/ranks/data-row ordinals, normalized full hostname, applied rule/section and whether normalization changed it. Excluded rows retain their original hostname/rank/ordinal and reason. Every one of the 10,000 selected rows appears exactly once as accepted provenance or an exclusion. This 2,434,792-byte file is deliberately not embedded into HTML.

Ordering is ASCII/code-unit domain order, with increasing source-row order inside records. JSON uses sorted keys, no insignificant spaces, ASCII escaping, HTML-safe `<`/`>`/`&` escapes, UTF-8 and one terminal LF. No wall-clock generation timestamp or moving HEAD enters derived assets. Input metadata is pinned. Generator/runtime identity is explicit: Deno 2.9.7 / V8 15.0.245.2-rusty. Another runtime must be reviewed before accepting different normalization; the generator fails rather than mislabeling its environment. Existing documented Deno/browser IDNA differences are not reclassified as application defects.

## Integrity and loading

`tools/reference_assets.py` independently checks bounded file sizes, exact inventories, source/derived/license hashes, source-manifest agreement, generator identities and counts. Normal builds perform these offline checks.

The dormant `ReferenceData.load()` checks bounded JSON lengths and SHA-256 before parsing. It verifies schema, source/PSL/Unicode pins, complete record counts, ordering, ranks and tier consistency, then revalidates each registrable domain against the actual runtime and pinned PSL. It returns frozen records and a boundary service whose maps are private. It does not inspect user URLs, produce matches, write storage, fetch, navigate or add references.

Failures return unavailable with `missing`, `corrupt`, `unsupported-schema`, `incompatible-psl`, `incompatible-unicode`, `normalization-incompatible` or `integrity-unavailable` reasons. A missing WebCrypto API cannot produce a quiet successful empty database. The original/manual inspector does not depend on this loader. Matching-index compatibility is future work.

Hashes bind data to trusted reviewed metadata; they do not independently authenticate a publisher or protect against replacement of the entire application.

## Offline generation and build commands

Run from the repository root, with existing Python and Deno. No dependency installation or network access is needed:

```sh
deno run --cached-only --allow-read=. --allow-write=data tools/generate_reference_data.mjs --write
deno run --cached-only --allow-read=. tools/generate_reference_data.mjs --check
python3 -B tools/extract_majestic.py /path/to/the/pinned/majestic_million.csv --check
```

The extraction command is optional when verifying an archived full CSV; normal generation works from committed approved inputs alone. It never downloads a CSV or changes an expected hash.

Ordinary `python3 -B tools/build.py` continues to emit byte-identical v3.2.0 application assets while validating this foundation. Opt-in preview builds embed the dormant modules/data/licenses and identify themselves as `3.3.0-stage2`:

```sh
python3 -B tools/build.py --reference-foundation --output-root /private/tmp/oui-stage2-preview
```

Preview mode refuses any output root inside this repository. The committed site/standalone artifacts and matched v3.2.0 worker remain unchanged. Both preview editions are self-contained, preserve the existing CSP restrictions/CSS, and use matched complete-hosted-document worker hashes. No new visible feature, data initialization, automatic comparison or runtime data request is activated.

The old release verifier is unchanged. It has explicit v3.2 candidate-branch/baseline assumptions and is not the Stage 2 verification entry point. Root SHA256SUMS and historical release reports remain v3.2 records; they are not claimed to inventory new Stage 2 files. Broader verifier/release-policy changes remain deferred.

## Explicit manual refresh

1. Deliberately download the official Majestic CSV outside the repository. Retain actual retrieval/header evidence and compute its full SHA-256. A changed hash means a different snapshot; do not reuse old date/header claims.
2. Use the extraction tool's explicit `--candidate-dir`, `--expected-original-sha256` and timezone-aware `--retrieved-at` options to validate the complete new file and produce an unapproved candidate outside the repository. Candidate mode cannot overwrite repository inputs and does not approve its output.
3. Review rank/domain changes, source completeness, exclusions, private-boundary behavior, license notices and size. Separately approve the new subset/source metadata; do not change a pin merely to silence a failure. Candidate metadata is not accepted directly as a release source manifest.
4. Refresh the PSL only through a separate reviewed snapshot decision. Preserve its exact raw file, MPL notice, version/commit/blob, official fixtures and licenses. Never silently replace the currently pinned snapshot.
5. Regenerate offline, compare deterministic output twice, run focused and applicable existing regressions, and review both editions before any later release action. Ordinary builds perform no retrieval.

## Licensing and source availability

Majestic attribution/change/license notices are in `data/popular-domains/NOTICE.txt`, including CC BY 3.0 source and legal-code links. PSL raw notices are preserved; the complete MPL 2.0 text and a source/modification notice accompany it. Official fixtures preserve their separate CC0 notice. These notice/license files are hashed in the data manifest and included as inert JSON in both opt-in preview editions.

The proposed standalone treatment is compiled MPL-covered PSL data plus exact preferred source/modifications and reproduction information. Mozilla FAQ Q16 permits aggregation of executable/minified covered material with other code without automatically relicensing that other source. Applying this to the final compiled table/HTML is an interpretation, not verified legal clearance. No whole-application relicensing was performed. Before distribution, provide an immutable source archive/reference for the exact raw PSL and derived source, keep notices, and review final packaging. This local uncommitted preview is not a distribution recommendation.

Sources: [Majestic](https://majestic.com/reports/majestic-million), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/legalcode), [PSL distribution](https://publicsuffix.org/list/), [algorithm](https://github.com/publicsuffix/list/wiki/Format), [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/), [Mozilla FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).

## Focused validation and limits

```sh
deno task test:reference-foundation
deno task test:reference-build
deno task test:reference-benchmark
```

The build suite makes all mutated fixtures and both repeat-build roots disposable. It checks default v3.2 byte preservation, complete source-row/tuple identities, truncation even after updating a damaged subset's hash, independent input/build integrity, license inventory, CSP and matched worker identities. Trusted generated app code is exercised under the existing cached Happy DOM dependency; complete before/after objects are compared in the same realm because native error wording differs from Deno. Nothing is masked or repinned to accommodate that wording.

Fresh reports are `tests/reference-foundation-results.json`, `tests/reference-build-results.json`, `tests/reference-preview-results.json` and `tests/reference-benchmark-results.json`. The benchmark has ten same-process Deno samples; it does not measure native Firefox, cold-page initialization, browser heap or a future matching engine. The previous memory/timing budgets remain provisional.
