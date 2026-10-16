# Offline URL Inspector · Version 3.1.1

**Blackberry & Amethyst:** focused final polish on the user-verified Version 3.1.0 baseline. URL/Unicode/ASCII analysis, reference algorithms and storage schema, service-worker source/scope, and atomic cache architecture are unchanged. Hosted status/check feedback and custom consent controls were refined. Previous releases and both Silent Hill tracker references remain unchanged. Nothing has been published.

## Open the standalone edition

Extract the ZIP and open **`standalone/Offline_URL_Inspector.html` in Firefox**. This complete HTML file needs no installation, server, service worker, package dependencies, or network connection for analysis.

1. Copy the actual link destination from any browser, email, message, or other source.
2. Paste it into **URL to inspect**. Optionally enter an **Expected hostname**; it takes priority over saved references.
3. Click **Inspect without opening**, press **⌘ Return/Enter** on macOS, or **Ctrl Enter** on Windows/Linux. The shortcut works in either inspection field or ordinary page areas, with guards for unrelated editing, references, import review, and dialogs.
4. Read the primary finding, actual ASCII/Punycode hostname, readable hostname, and separate comparison result. Expand **Technical Details** for all evidence.

The approved theme uses a Georgia title with the trackers’ 10-second flicker timing, lilac/violet light, plum panels, clear button feedback, and native disclosures. Reduced motion makes the title static and disables transitions. URL and character text stays monospaced with ligatures disabled. The example buttons retain their original sample URLs.

## Results and references

**Technical Details** groups Input & Normalization, Character Details, URL Components, Reference Comparisons, and the Full Diagnostic Log. ASCII observations stay within Character Details. Identical original/readable character evidence is combined with both sources labeled; mapped or normalized differences remain visible. Every original diagnostic explanation and analysis level remains available in a compact expandable record.

Reference Domains are comparison targets you add manually, not a trust database. Add/edit/remove, confirmed clear, and reviewed Merge/Replace import retain their storage semantics. **Export Backup** and **Import Backup** use the same portable schema-1 JSON and filename. Merge is the default native radio choice; Replace and Clear use custom modal confirmations with safe cancellation and focus handling. Exact matches, subdomains, embedded text, visual similarities, and spelling similarities remain distinct. No inspected domain is added automatically.

**Storage remains compatible with V3.0.0 / V3.1.0:** stable key `offline-url-inspector:reference-domains`, internal `schemaVersion: 1`, and the same portable JSON backup. Existing V3 records load without rewriting entries. Use Export for backups; browser cleanup/private sessions can remove data, and `file://` persistence is not standardized. Storage messages distinguish readable storage, verified writes, unavailable storage and saving failures. New or edited single-label hostnames receive contextual confirmation, remain supported exactly as entered, and are not assigned a guessed suffix. Imported single labels are described in the review as a batch. See [UPDATES_AND_ROLLBACK.md](UPDATES_AND_ROLLBACK.md).

## Hosted edition

`site/` contains only `index.html`, `sw.js`, and `.nojekyll` for the future separate repository **offline-url-inspector**, at `/offline-url-inspector/`. The complete application remains a single inline HTML asset. Its matching worker verifies the new release hash, uses only the project scope, waits for a reviewed reload, and preserves reference storage. It caches only the application asset, never inspected URLs. Offline readiness is announced only after cache verification.

Normal app startup/update requests are expected; pasted destinations are never requested. Browser cache removal can break hosted offline startup; keep the standalone fallback. GitHub project paths share an origin: other apps under the same `USERNAME.github.io` can access reference storage. Namespacing avoids accidental collisions, not hostile access. See [DEPLOYMENT.md](DEPLOYMENT.md) and [SECURITY_REVIEW.md](SECURITY_REVIEW.md). No repository was created or changed.

## Validation and limits

**109,454 checks and 118,210 assertions passed, with zero failures.** See [TEST_RESULTS.md](TEST_RESULTS.md) for scope and individual reports. Targeted tests cover shortcuts and their editing guards, native disclosure behavior, diagnostic completeness across all retained fixtures, character presentation, stored V3 compatibility, contrast targets, CSP hashes, and the preserved functional suites. The complete available regression/conformance suite was run after the final changes.

The hosted UI and modified interactions were inspected in the **Codex in-app browser**, with desktop/narrow screenshots in `preview/` and observations in `tests/browser-preview.json`. Repeated actual hover/click cycles retained the primary button’s gradient and exact hit area. Dialog focus wrapping, Escape, cancellation/acceptance, native radio keyboard operation, file import, reviewed reloads, saved references, successful/failed update feedback, and cached startup with the local server stopped were observed. This was not Firefox or a fully disconnected internet test.

The user’s nine successful V3.1 Firefox/macOS test groups are recorded as baseline evidence. **Final V3.1.1 Firefox verification is pending.** The known agent-environment native startup failure was not retried without changed conditions. Use the focused [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md).

This tool does not certify website safety or detect every phishing technique. Full RTL visual comparison is unavailable. Native IDNA/runtime differences, including the 19 reviewed Deno discrepancies, remain unchanged. No ownership/content/reputation/redirect lookup or Public Suffix List is provided. See [IDNA_REVIEW.md](IDNA_REVIEW.md), [UNICODE_DATA.md](UNICODE_DATA.md), and the remaining limits in the security review.

## Package and maintenance

| Location | Contents |
|---|---|
| `standalone/` | Complete offline HTML |
| `site/` | GitHub Pages files only |
| `src/` | Shared analysis, reference, presentation/UI, theme, template, hosted lifecycle, worker |
| `data/` | Pinned Unicode 18 sources, unchanged derived JSON, manifest, full license |
| `tests/` | Fixtures, automated tests, functional pins and reports |
| `tools/` | Deterministic builder, local server, data verifier, test runner |
| `preview/` | Actual in-app desktop/mobile screenshots |
| `build-manifest.json`, `SHA256SUMS` | Release/data hashes and packaged file checksums |

From the extracted project directory, with Python 3.10+ and Deno installed:

```sh
deno cache tests/dom.mjs tests/dom-v3.mjs tests/refinement.mjs tests/polish.mjs
python3 tools/verify_data.py
python3 tools/build.py
python3 tools/test_all.py
```

The dependency-cache command uses the network only on a fresh development machine; Happy DOM 20.8.4 is locked and is never a runtime HTML dependency. This run used Deno 2.9.7. The runner owns a loopback server on port 8765. For a separate manual preview use `python3 tools/serve.py`, then open `http://127.0.0.1:8765/offline-url-inspector/`; stop it before the full runner. Individual tasks are in `deno.json`.

Normal builds verify and reuse the existing Unicode JSON; they do not regenerate unchanged tables. Edit source and rebuild both editions together so CSP and worker hashes stay correct. Verify an extracted package with `shasum -a 256 -c SHA256SUMS`.

See [CHANGELOG.md](CHANGELOG.md), [DESIGN_NOTES.md](DESIGN_NOTES.md), [SHORTCUTS.md](SHORTCUTS.md), and [UPDATES_AND_ROLLBACK.md](UPDATES_AND_ROLLBACK.md) for the design changes, optional launcher, maintenance, and rollback instructions.
