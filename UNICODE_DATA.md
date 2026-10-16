# Unicode data and attribution

Runtime data: **Unicode 18.0.0**, with the existing **UTS #39 revision 34 LTR fast path**. Versions 3.1 and 3.1.1 preserve the exact approved V2.1 derived JSON and source pins. No unchanged tables were regenerated for the V3.1 or V3.1.1 refinements. Runtime analysis never downloads Unicode data.

Derived JSON SHA-256:

```text
806135e914efe7978ca23124b2ad4472b5643adbb766dc1ab799b3ca1c7a5dc1
```

`data/unicode-data.json` is embedded into both HTML editions. `data/unicode-data.sha256` pins its bytes. `data/manifest.json` records exact source URLs and SHA-256 values for all 12 raw sources/license files. `build-manifest.json` records the data hash and generated application hashes. The HTML includes source attribution and the full license.

## Sources and use

| Source | Purpose |
|---|---|
| [UTS #39 revision 34](https://www.unicode.org/reports/tr39/tr39-34.html) | Confusable comparison specification |
| [confusables.txt](https://www.unicode.org/Public/18.0.0/security/confusables.txt) | Prototype confusable mappings |
| [UnicodeData.txt](https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt) | Names, canonical decomposition, combining classes, categories |
| [Scripts.txt](https://www.unicode.org/Public/18.0.0/ucd/Scripts.txt), [ScriptExtensions.txt](https://www.unicode.org/Public/18.0.0/ucd/ScriptExtensions.txt), [PropertyValueAliases.txt](https://www.unicode.org/Public/18.0.0/ucd/PropertyValueAliases.txt) | Script sets and names |
| [DerivedCoreProperties.txt](https://www.unicode.org/Public/18.0.0/ucd/DerivedCoreProperties.txt) | Default-ignorable properties |
| [DerivedBidiClass.txt](https://www.unicode.org/Public/18.0.0/ucd/extracted/DerivedBidiClass.txt) | Bidi classes, including unassigned-range defaults |
| [NormalizationTest.txt](https://www.unicode.org/Public/18.0.0/ucd/NormalizationTest.txt) | Independent official normalization fixtures |
| [IdnaMappingTable.txt](https://www.unicode.org/Public/18.0.0/idna/IdnaMappingTable.txt), [IdnaTestV2.txt](https://www.unicode.org/Public/18.0.0/idna/IdnaTestV2.txt) | IDNA mapping observations and interoperability fixtures |
| [ReadMe.txt](https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt) | Release provenance |
| [Unicode License V3](https://www.unicode.org/license.txt) | Attribution/permission text, preserved locally as `data/LICENSE.txt` |

Unicode data © 1991–2026 Unicode, Inc. The precise bundled license text and checksums govern the included copy; do not replace it silently if the live unversioned license URL changes.

## Coverage and limits

The core computes canonical normalization using pinned tables and performs the existing UTS #39 LTR fast path. It does **not** implement the complete visual bidi-skeleton algorithm. RTL visual comparison is unavailable and is reported as such, rather than interpreted as “no confusables.” Skeletons are comparison keys, not valid destination URLs.

Native URL parsing remains authoritative for the represented destination. The bundled IDNA mapping table supports explanation; it is not a replacement browser URL parser. A reviewed 300-vector sample still has 19 native Deno discrepancies. Independent ICU matches all 19 official outputs. See [IDNA_REVIEW.md](IDNA_REVIEW.md). The official normalization/mapping checks and those honest-discrepancy assertions are not a claim of complete browser UTS #46 conformance.

Names are shown where supported, with fallback descriptions for code points without explicit names. Non-ASCII highlighting and confusable mappings do not establish malicious intent. ASCII visual observations include separate retained font-dependent heuristics; those are not all Unicode confusable mappings.

## Maintenance

Normal offline verification/build:

```sh
python3 tools/verify_data.py
python3 tools/build.py
```

`verify_data.py --download` is a development-only restore operation: it requests the manifest's exact URLs, compares each checksum before writing that file, and fails on a mismatch. It is never called by the app and does not automatically select “latest.” Existing local files make normal builds and tests independent of those servers.

For an intentional future Unicode update:

1. Review the new Unicode/UTS #39/IDNA versions, specification changes, bidi requirements, license, and relevant security notes from official sources. Do not merely change a version label.
2. Preserve the old source archive and manifests. Acquire the new official files into a separate development copy; review their new URLs/hashes and provenance before updating `data/manifest.json`.
3. Update explicit version guards and embedded version references in the generator, builder, core/UI, tests, and documentation. V3.1 intentionally checks `18.0.0`; it will refuse an unreviewed data-version substitution.
4. After that review, run `python3 tools/generate_unicode_data.py --reviewed` to deliberately regenerate the derived JSON and its SHA-256 pin. Inspect the output/diff and data characteristics; the flag is an explicit maintenance acknowledgement, not automated verification of your review.
5. Run full official normalization/confusable fixtures, independent Punycode/IDNA probes, regression/differential checks, and real-browser/manual cases for both editions. Review changed expectations rather than deriving every expected result from the same new implementation.
6. Rebuild both editions and worker together, update attribution/reports/checksums, archive and deploy through the reviewed update process. Record newly introduced or unresolved limitations accurately.

Changing a derived checksum merely to make a build pass defeats the review guard. Preserve the exact V2.1 dataset unless a deliberate reviewed data release is needed.
