# Current corrected candidate

Current local candidate: **3.2.0-a67e4b13dd5fa5cd**. The authorized decoding-dispatch, release-verifier and preprocessing corrections are documented in [AUDIT_CORRECTIONS.md](AUDIT_CORRECTIONS.md). They preserve original outputs and the highlight/@ presentation. Source and generated identities changed; earlier browser evidence remains historical. Main and Draft PR #2 are unchanged; corrections are local, unstaged and uncommitted.

## Historical original implementation snapshot

The report below records the preceding `3.2.0-d7d14671be5e4b26` build. Its wording, counts, screenshots and unavailable narrow-viewport observations are historical. The refined candidate has actual measured 390 px browser evidence; native Firefox/accessibility gates remain separate.

# Version 3.2.0 embedded URL analysis — local candidate review

Review date: 2026-10-21. Release identifier: `3.2.0-d7d14671be5e4b26`.

## 1. Branch, baseline and status

Repository: Maximophanes/offline-url-inspector. Branch: `dev/v3.2.0-embedded-url-analysis`. HEAD and untouched stable main: `d9aed1dc333bb51d2126fa79059a839292b36615`. The clean baseline was verified against GitHub main and all 242 baseline checksums before branch creation. The branch did not previously exist. Candidate changes are intentionally uncommitted and unstaged for review. No push, merge, pull request, settings change or publication was performed.

## 2. Implemented capabilities

A separate pure analyzer processes submitted and browser-normalized path, query and fragment representations. It discovers explicit HTTP(S) values, literal path URL suffixes, encoded path segments, up to two strict percent-decoding layers, fragment parameters/routes, nested complete URL components, subordinate parameter-like strings, and several ordered occurrences. Query/fragment work is scheduled fairly. A substring-heavy value yields after each match.

Absolute URL candidates require an explicit HTTP(S) scheme and native parsing without a base. Protocol-relative and relative references stay unresolved. A relative reference's parameter-like data can contain a separately extractable absolute URL; that does not resolve its base. Recovered URL parentage describes data nesting, never a redirect chain.

## 3. Files and purposes

| Files | Purpose |
|---|---|
| `src/embedded.js` | Pure bounded discovery, provenance, coverage states and existing hostname comparisons |
| `src/embedded-ui.js` | Scoped notices, evidence classification, private-value reveal and pagination |
| `src/embedded.css` | Scoped wrapping, isolation and focus rules using the established visual system |
| `src/ui.js` | Supplemental render/reset hooks only |
| `src/template.html` | Supporting notice and Technical Details subsection |
| `tools/build.py` | Version 3.2.0 and shared supplemental modules/styles in both editions |
| `tools/audit_copy.py`, `COPY_AUDIT.md`, `tests/copy-inventory.json` | Traceability for new copy families |
| `tests/embedded.mjs`, `tests/embedded-results.json` | New discovery, adversarial, model, DOM and privacy checks |
| `tests/embedded-benchmark.mjs`, `tests/embedded-benchmark.json` | Reproducible synthetic timing and memory observations |
| `tests/embedded-browser-preview.json`, `preview/v3.2.0-embedded-*.jpg` | Actual in-app browser observations and screenshots |
| `deno.json`, `tools/test_all.py` | Include the new suite and expose the benchmark task |
| `tests/editorial.mjs`, `tests/refinement.mjs`, `tests/clarity.mjs` | Only approved version-label and added-category expectations |
| Generated HTML, worker identity, manifest, checksums, result records | Normal candidate build and verification outputs |
| `tools/verify_release.py`, documentation | Repeatable artifact/baseline verification and review guidance |

The established core, references, presentation helpers, hosted controller, worker source, original CSS, Unicode data, lockfile and deployment workflow remain byte-identical to the stable baseline. Original fixture files and historical baseline hashes were not repinned.

## 4. Representative supported cases

| Input | Result |
|---|---|
| `https://example.test/go?next=https%3A%2F%2Fother.test` | Query address recovered after one decoding layer |
| `https://example.test/#next=https%3A%2F%2Fother.test` | Fragment address recovered with equivalent coverage |
| `https://example.test/#/login?next=https%3A%2F%2Fother.test` | Relative route and separate absolute address; fragment provenance |
| `https://example.test/out/https%3A%2F%2Fother.test` | Encoded path-segment address |
| `https://example.test/?next=https%253A%252F%252Fother.test` | Two layers, both recorded |
| Same query with Expected Hostname `example.test` | Original exact match plus an independent off-host notice |
| `https://example.test/?q=hello%20world#section` | Complete within supported scope; no supported embedded URLs identified |
| `https://example.test/#qs=r-[opaque-data]` | Unknown/unsupported interpretation; neutral limitation |
| `https://example.test/?next=https%25253A%25252F%25252Fother.test` | Partial analysis; further decoding withheld |

## 5. Unsupported cases

No Base64/Base64URL, JSON extraction, decompression, encryption, proprietary payload decoding, JavaScript interpretation, popular-domain dataset or PSL integration. Non-HTTP(S) schemes are recognized without executing or interpreting their contents. HTML entities are not silently rewritten, semicolons are not universal separators, relative bases are not fabricated, and arbitrary text is never passed through assumed-HTTPS input preparation as a discovered destination.

General application semantics remain unknown even when supported data extraction is complete. A routine unsupported payload is neutral, not a phishing verdict. Unsupported format coverage is stated in the section even when a value cannot be identified as any particular encoding.

## 6. Parsing and encoding safeguards

Native top-level parsing remains authoritative and unchanged. Component slicing uses the existing preprocessing index map; the UI reports descriptive provenance rather than exact offsets. Original input stays in its established location. Browser-normalized differences remain labeled. Parameter order, encoded names, repeated values, empty names, missing equals and explicit empty values are retained in the supplemental model. Each pair splits at its first equals sign and literal ampersands; decoded separators cannot change outer boundaries. Literal-plus and form-style interpretations retain their respective provenance.

Malformed escapes, invalid UTF-8, unpaired surrogates, ambiguous substrings, incomplete addresses and exhausted limits cannot be silently repaired into complete results. No truncated value is validated as complete. Derivation history and processing limits are shared through nesting.

## 7. Evidence and warning behavior

Facts concern supplied text, decoding and normalized hostname relationships. Candidate boundaries and redirect-like naming conventions are qualified inferences. Server/client navigation, intent, ownership and reputation are unknown. No destination is selected as final. Repeated differing address values carry an application-selection ambiguity.

Ordinary encoding, different hostnames and names such as redirect_uri are informational. Existing visual/spelling comparisons and unavailable states are reused. IP/single-label comparisons are exact-only. No registrable-domain or ownership inference is made.

Coverage states are Complete within supported scope, Partial analysis, Unavailable, and Unknown or unsupported interpretation. Partial/unavailable/unsupported qualifications appear beside the original findings, not exclusively in the log. Exact initial-hostname matches are preserved and cannot suppress those notices.

## 8. Interface and privacy

The new subsection uses the approved Blackberry & Amethyst disclosures and rows. It shows hostname, source, evidence class, actual decoding layers, scheme/effective port and contextual comparisons. Original presentation helpers and existing primary conclusions are unchanged.

Full source/recovered/normalized values and parameter names are created as inert text only on explicit reveal, removed on close, and discarded from the view on reinspection. Concealment is not secret detection. Candidate rows are paged five at a time, with keyboard focus retained; extra saved-reference comparison evidence is paged lazily. Control/bidi display uses existing visible escapes and isolated text. There are no destination links or Open buttons.

The analyzer has no DOM, I/O, navigation or storage access. Rendering has no executable HTML sink. New inspections do not enter application storage, exports, navigation attributes, history, worker messages, cache keys or routine logs. Tests use synthetic sentinels. CSP remains restrictive; no new worker, policy relaxation, dependency or network capability was added. Worker behavior, scope, reference storage schema and update controller are unchanged. Generated worker release/hash constants change with the ordinary build.

## 9. Resource limits and benchmarks

Limits retain the approved numeric starting values: 32,768 input UTF-16 units; 8,192 per analyzed value; transformation/nesting depth 3; percent layers 2; 128 parameter/segment entries per component shared across representations/nesting; 128 analysis nodes; 131,072 aggregate charged text units; 32 occurrences; 16 full hostname/authority analyses; 256 expensive comparisons; 100 ms cooperative deadline.

The 16-analysis cap counts distinct authority spellings conservatively, so it never processes more than 16 distinct normalized hostnames. Text accounting charges queued views, recovered values and normalized URL serializations. Payloads are not duplicated into cache keys. Metadata, Unicode tables, browser objects and DOM/runtime overhead are bounded separately by counts; this is not a JavaScript heap cap. The time check cannot preempt an operation already running.

Final standalone Deno/V8 benchmark: 50 timed iterations per scenario after five warmups. Input parsing precedes the timed supplemental call; DOM rendering is excluded. Timing is environment-specific.

| Scenario | p50 ms | p95 ms | Maximum ms | Observed status |
|---|---:|---:|---:|---|
| ordinary | 0.024 | 0.044 | 0.085 | complete |
| encoded-query-and-fragment | 0.223 | 0.68 | 2.914 | complete |
| nested | 0.173 | 0.233 | 0.281 | complete |
| two-layers | 0.077 | 0.096 | 0.185 | complete |
| malformed | 0.02 | 0.028 | 0.052 | partial |
| large-value | 1.38 | 1.878 | 1.975 | partial |
| many-parameters | 1.13 | 1.47 | 1.531 | partial |
| candidate-saturation | 1.1 | 1.402 | 1.486 | partial |
| comparison-saturation | 6.071 | 6.721 | 8.009 | partial |
| unicode-and-invisibles | 0.196 | 0.306 | 0.451 | complete |
| maximum-accepted-input | 1.758 | 2.077 | 2.284 | partial |

The report records per-batch heap-used/RSS deltas, including negative heap deltas from garbage collection. These are observations over 50 calls, not peak or retained per-inspection memory. No browser heap/timing result is claimed. Deterministic work/size caps remain the primary protection.

## 10. Automated validation

`python3 tools/test_all.py`: **109,720 checks / 129,614 assertions passed, zero failures**, including the new 84 checks / 263 assertions. The current available suite includes Unicode conformance, independent ICU diagnostics, differential complete-result pins, DOM/storage/privacy, worker/hosted simulations and actual loopback HTTP/CSP checks. `python3 tools/verify_data.py` verified all pinned Unicode source files.

All 139 original inspection/reference result fixtures and original diagnostic classifications, levels, values and ordering remain pinned. Only version labels and the approved sixth Technical Details category changed existing UI expectations. An initial path-hint false unsupported state was fixed and now has dedicated negative tests. Shared text accounting also has a saturation regression.

Happy DOM executes trusted generated application code with synthetic text inputs; its simulations are not a browser sandbox, visual test or Firefox evidence. The full suite's optional Firefox harness was not requested because no geckodriver endpoint was available; native UI access was separately denied.

## 11. Actual browser and offline validation

Ten actual hosted in-app browser scenarios passed: encoded query plus exact match, fragment route, path address, benign input, opaque payload, decoding-depth limit, excessive value, conflicting values, Unicode reference resemblance and ASCII reference resemblance. Separate actual checks verified keyboard reveal/close, secret absence before reveal, long-value wrapping, 5/10/12 pagination and focus, and stale-state removal.

Reviewed local updates retained two synthetic saved references. With the isolated preview server stopped, both cached reload and a new cached tab reached Offline ready and retained those references; a new fragment address was analyzed successfully. These are real in-app observations with the application server unavailable, not full internet disconnection or Firefox certification. The browser executable script and style hashes are checked against the candidate manifest in the browser report.

## 12. Baseline compatibility

The stable commit and main reference remain unchanged. `Inspector.inspect`, reference normalization/comparison/storage/import/export, original presentation helpers, Unicode data, old fixture expectations and worker/controller source remain unchanged. No original core diagnostic was edited or appended. Supplemental results are computed independently. Both editions include the same new analysis/presentation modules and restrictive CSP.

## 13. Candidate artifacts

- `standalone/Offline_URL_Inspector.html`: SHA-256 `39db3057801a699a65654655ac92fb4f0f7988f65ae7cf664847dc1f6a6fec87`
- `site/index.html`: SHA-256 `d7d14671be5e4b2661501b2a925abb6c00d39d943ea778784863bec86c265f88`
- `site/sw.js`: unchanged source behavior with new release/hash constants
- `build-manifest.json` and `SHA256SUMS`: candidate identity and file inventory

`tools/verify_release.py` checks protected baseline files, current-source bundle correspondence, exact CSP/artifact identities and checksums. No release or deployment is created.

## 14. Known limits and outstanding risks

- Native Firefox Computer Use was denied; geckodriver was absent from PATH. No native Firefox assertion passed or is claimed.
- The in-app browser's URL policy blocked file://. Native standalone-file behavior remains a manual gate; source/DOM/CSP checks passed.
- Viewport override requests did not change the measured 1280 px width. Actual mobile rendering remains unverified; only source wrapping and actual desktop long-value rendering were checked.
- Native screen readers, native zoom, reduced-motion preferences and full network disconnection remain manual checks.
- Browser network-event tracing was unavailable. No-destination sinks are checked statically and through guarded simulated DOM; in-app console inspection returned no messages.
- Extraction is deliberately incomplete for unsupported formats, excessive inputs and uncertain boundaries. No URL-only inspection can establish application behavior or whole-link safety.

## 15. Decisions for review

Review the candidate's exact-match supplemental wording, neutral unsupported-payload treatment, private-value reveal, resource-limit notices and desktop screenshot. Complete native Firefox, standalone file, narrow-screen and accessibility checks before release approval. Any new decoder, PSL/popular-domain work, networking, policy/storage/worker change, commit or release action requires separate authorization.

## 16. Release-readiness recommendation

Ready for local candidate review. Hold publication/merge/commit approval until the outstanding native-browser, standalone-file and mobile/accessibility gates have been reviewed. No release-related action is authorized by this report.

## Reproduce local checks

```sh
python3 tools/verify_data.py
python3 tools/build.py
python3 tools/audit_copy.py --check
python3 tools/test_all.py
deno task test:embedded-benchmark
python3 -B tools/verify_release.py
```

After intentionally updating candidate reports/artifacts, refresh the checksum inventory with `python3 -B tools/verify_release.py --refresh-checksums`. Keep the working tree uncommitted for review.
