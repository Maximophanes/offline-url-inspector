# Review of the 19 retained IDNA discrepancies

All 19 original findings were reproduced and individually reviewed for Version 3 and preserved unchanged by the Version 3.1 UI refinement. The application IDNA implementation was **not changed** to eliminate them. Native parsing remains authoritative for the destination represented by the installed runtime/browser.

## Findings

Every rejected source contains at least one of four Georgian capitals. Replacing **only** those capitals with their official mappings makes the same Deno parser produce the official expected ASCII result in **all 19 cases**. The rest of each source remains unchanged, including combining characters, variation selectors, other scripts, and Unicode separators.

| Original | Code point | Official mapping | Code point |
|---|---|---|---|
| Ⴀ | U+10A0 | ⴀ | U+2D00 |
| Ⴌ | U+10AC | ⴌ | U+2D0C |
| Ⴎ | U+10AE | ⴎ | U+2D0E |
| Ⴚ | U+10BA | ⴚ | U+2D1A |

The same mappings appear in the official [Unicode 16 table](https://www.unicode.org/Public/idna/16.0.0/IdnaMappingTable.txt), [Unicode 17 table](https://www.unicode.org/Public/17.0.0/idna/IdnaMappingTable.txt), and [Unicode 18 table](https://www.unicode.org/Public/18.0.0/idna/IdnaMappingTable.txt). Full-source hashes and reviewed rows are in `tests/idna-mapping-history.json`. Older-version material is development evidence only; runtime data remains Unicode 18.0.0 unchanged.

| Original vector lines | Count | Reduced trigger | Current result |
|---|---:|---|---|
| 627, 628 | 2 | U+10A0 | Native rejects capital; mapping alone yields expected hostname |
| 925, 926, 928, 932, 935, 938 | 6 | U+10AE | Same |
| 1314, 1315, 1317, 1319, 1322, 1323, 1327, 1329 | 8 | U+10AC | Same |
| 1994, 1995, 1999 | 3 | U+10BA | Same |

Independent **ICU 78.3** UTS #46 conversion produced the exact official expected output for every original source, with zero `UErrorCode` failures and zero `UIDNAInfo.errors`. Options enabled bidi checking, contextual joiner checking, and nontransitional ToASCII (`4 | 8 | 16`); STD3 was not enabled. `tools/review_idna_icu.py` reproduces this evidence with an installed ICU library. Results are in `tests/idna-icu-results.json`.

Minimal native probes also reject each capital in an otherwise ordinary `.invalid` hostname while accepting its mapped form. Deno's `node:url.domainToASCII` returns an empty string on those capitals too; this corroborates runtime behavior but is **not an independent implementation**. Deno reports version 2.9.7, V8 15.0.245.2-rusty, and ICU 78.3. This does not establish which internal component causes its URL rejection.

## Corrected interpretation

The evidence supports a **native runtime Georgian mapping interoperability discrepancy**. It is not explained simply by mappings first appearing in Unicode 18: the same rows existed in 16/17. It does not demonstrate that all 19 sources are invalid under UTS #46: official success vectors and independent ICU contradict that conclusion.

The V2 report tentatively mentioned raw greater-than syntax and newer-version differences. Reduced probes correct that explanation: `>` plus U+0338 parses like `≯`, and `=` plus U+0338 parses like `≠` in this runtime. A Georgian capital occurs in both early rejected cases, and mapping only that capital resolves them. The current report does not attribute those failures to raw greater-than syntax.

No application-specific parsing defect was found in these 19 cases. The app reports native rejection and does not invent a destination or a negative confusables verdict. This limits support for otherwise valid IDN spellings in that runtime, but does not justify overriding browser parsing with predicted destinations. No substantial architectural change was necessary or undertaken.

Firefox-specific behavior is **unknown**: earlier agent attempts never created a test session, and the unchanged known failure was not retried for V3 or V3.1. The user-reported successful V2.1 manual examples did not cover these 19 vectors. Deno results must not be labeled observed Firefox behavior. The evidence does not pinpoint the native library/algorithm branch or establish behavior in every browser/version; further component diagnosis is deferred rather than guessed.

## Reproduce

```sh
deno task test:idna
python3 tools/review_idna_icu.py --library /opt/homebrew/opt/icu4c/lib/libicuuc.78.dylib --suffix 78
```

The first command runs 64 cases/checks and records each original string, mapped-only outcome, native result, and application handling in `tests/idna-review-results.json`. The second runs 19 independent output/error checks; provide the appropriate installed ICU library and symbol suffix on another machine. Neither tool changes the app, Unicode data, or destination parser.

The original 300-vector probe still reports **281 matches and 19 discrepancies** in this runtime. Its passing application tests require honest native-result reporting, not agreement with every official vector. This sample is not a full UTS #46 conformance suite. The [WHATWG URL Standard](https://url.spec.whatwg.org/#concept-domain-to-ascii) defines browser domain processing through Unicode ToASCII with URL-specific parameters; full installed-browser conformance is outside this utility's claim.
