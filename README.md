# Offline URL Inspector · Version 3.2.0 local candidate

Current candidate **3.2.0-cf634806f70b4b3c** adds the approved targeted hostname highlight and embedded-URL @ explanation to the successful two-part results. Reliable recovered hostnames stand out as inert monospaced lilac text on subtle dark purple; comparison targets and uncertain references are not indiscriminately highlighted.

The embedded caution now says **“The text before @ is not the website’s hostname.”** It names the actual embedded hostname without exposing raw userinfo or assuming credentials. No redirect or whole-link safety verdict is produced. Existing Technical Details, private evidence, counts, severity, parser/extractor/comparison algorithms, storage, worker/offline logic and CSP policy are preserved.

Work remains unstaged and uncommitted on `dev/v3.2.0-embedded-url-analysis`; main and the published v3.1.2 release are untouched. No deferred decoder, dataset, storage or network feature was added.

Newly executed validation: **146 embedded checks / 533 assertions**, including 21 new targeted checks; **109,782 full-suite checks / 129,884 assertions**, zero failures. Actual in-app browser validation passed 22 cases at measured 1280/390 px widths, including A/B, long-host wrapping, privacy, keyboard and reset. No new native Firefox or VoiceOver pass is claimed. The user reports the preceding candidate's representative, seven additional and encoded-@ Firefox scenarios passed manual review.

See the [targeted handoff](HOSTNAME_HIGHLIGHT_REVIEW.md), [current tests](TEST_RESULTS.md) and [preceding editorial snapshot](EMBEDDED_EDITORIAL_REVIEW.md). The existing Python build regenerates both editions and CSP/build identities. `python3 -B tools/verify_release.py` verifies the settled source/artifacts/checksums.

## Historical Version 3.1.2 documentation

The text below records the preceding development/review history. Its statements about then-uncommitted v3.1.2 development are historical; the verified stable baseline was subsequently merged at `d9aed1dc333bb51d2126fa79059a839292b36615`.

# Offline URL Inspector · Version 3.1.2

A complete editorial and interface refinement of the existing 3.1.2 development work, built on the user-verified 3.1.1 baseline. Findings explain the observation before the implementation. Ordinary Unicode stays neutral, genuine warnings retain their severity, and complete original evidence remains available. Blackberry & Amethyst, the Georgia title and its approved animation are preserved.

Development remains on `dev/v3.1.2` in `Maximophanes/offline-url-inspector`. Changes are uncommitted for GitHub Desktop review. No commit, push, merge, pull request, release, publication, settings change or change to `main` was made.

## Use either edition

Open `standalone/Offline_URL_Inspector.html` directly for a self-contained offline application. The hosted build is in `site/` and uses `/offline-url-inspector/`. For a local preview:

```sh
python3 tools/serve.py
```

Open `http://127.0.0.1:8765/offline-url-inspector/`. Paste a copied link, optionally enter an expected hostname, and choose **Inspect without opening** or press **⌘ Return / Ctrl Enter**. Inspection never visits the destination. The manual expected hostname takes priority; saved references can still be evaluated separately.

The focused [Technical Details review](TECHNICAL_DETAILS_REVIEW.md) covers balanced character-count spacing, contextual comparison methods without redundant raw panels, and extraction details shown only for uncertain/failed attribution. Current verification used targeted regressions; engine/data sources and the version are unchanged.

Technical Details retains Input & Normalization, Character Details, URL Components, Reference Comparisons and the Full Diagnostic Log. Main hostname descriptors stay inline at desktop widths; narrow technical rows keep deliberate smaller second lines. One collapsed Raw Diagnostic Records section follows the ordinary findings. Actual mapping sequences, original case, code points/names, diagnostic codes/levels/order and every ASCII location remain accessible. Multi-character or whole-hostname resemblance never invents a one-to-one character match. Exact matches concern the hostname, not the entire URL or website safety.

**Offline ready** describes a verified application copy. The top row puts updates on the left and a compact violet pill on the right; an independent details panel expands underneath. General guidance covers browser profiles and isolated sessions. The user reports that earlier 3.1.2 work fixed persistent cached-startup preparation; this pass preserves it and removes the unnecessary Preparing label during fast local verification. See [offline startup review](OFFLINE_STARTUP_REVIEW.md).

## References and compatibility

The focused Reference Domains follow-up groups the approved introduction and storage status, removes empty feedback space, distinguishes empty/overlength imported hostnames, and shows technical errors only when they add context. See [review and current focused checks](REFERENCE_DOMAINS_REVIEW.md). The earlier full-suite figures below describe the committed interface checkpoint; the Unicode suite was not rerun for this follow-up.

Reference normalization, matching, storage schema/key and backup format are unchanged. Version 3.1.1 schema-1 records load without rewriting them under `offline-url-inspector:reference-domains`. Only explicitly managed reference hostnames are saved. Inspected links, credentials and expected-host text are not persisted by the app. Single-label names and IP addresses remain exact-only.

**Export Backup** saves the readable list shown in the app; it cannot preserve an unreadable or different protected saved record. Clear/Replace warnings explain that distinction. Storage feedback distinguishes loaded data, readable storage without a tested write, successful writes, failed writes, temporary changes and protected/conflicting data. A successful write does not guarantee long-term file:// persistence. GitHub Pages projects on the same github.io hostname share a security origin despite different paths.

## Editorial standard and validation

[EDITORIAL_STYLE_GUIDE.md](EDITORIAL_STYLE_GUIDE.md) is the permanent writing standard. [COPY_AUDIT.md](COPY_AUDIT.md) records every major ordinary and conditional message family, changes, preserved technical terms and verification limits. `tests/copy-inventory.json` supplies source lines/hashes and literal candidates across all ten runtime-copy sources.

**Previous committed interface checkpoint: 109,600 checks and 128,867 assertions passed, zero failures.** The complete available suite ran once after application changes settled. It includes 52 editorial acceptance checks, all 33 core diagnostic families, 139 unchanged complete pre-audit inspection objects, 64 hosted lifecycle checks and 12 final-interface checks. [Test results](TEST_RESULTS.md) distinguish source/DOM simulations, actual loopback HTTP and actual in-app browser observations.

The final in-app review covers desktop 1100 px, tablet 768 px, mobile 390 px, expanded evidence, all four requested update layouts, CSS 200% magnification and 550 px reflow. See [focused interface review](FINAL_INTERFACE_REVIEW.md). Earlier cached-reopening observations are retained as historical evidence. **Final real Firefox verification remains pending.** See the [Firefox checklist](FIREFOX_CHECKLIST.md) for native 200% zoom, reduced motion, screen readers, file policies, Containers and full disconnected-network checks.

## Build and test

Both editions are generated from `src/` with pinned Unicode 18.0.0 data. There are no external runtime dependencies, fonts or analytics. Python and Deno are development tools.

```sh
deno cache --lock=deno.lock tests/dom.mjs tests/dom-v3.mjs tests/refinement.mjs tests/polish.mjs tests/clarity.mjs tests/editorial.mjs tests/interface.mjs
python3 tools/verify_data.py
python3 tools/build.py
python3 tools/audit_copy.py --check
python3 tools/test_all.py
```

The runner owns loopback port 8765. Targeted tasks are defined in `deno.json`. Regenerate the copy inventory with `python3 tools/audit_copy.py` when source copy changes. Builds recompute exact CSP/HTML/release hashes without regenerating Unicode data. `SHA256SUMS` inventories files excluding itself and Git metadata.

Core/reference/data algorithms are unchanged. Worker logic is unchanged; only its plaintext 503 recovery message was edited. A strict test restores that one literal and requires the original complete worker hash. Full RTL visual comparison, ownership/reputation/content/redirect checks, public-suffix inference, permanent storage/cache guarantees and comprehensive phishing detection remain outside scope. The 19 documented native Deno IDNA discrepancies remain unchanged; see [IDNA review](IDNA_REVIEW.md).

See [changelog](CHANGELOG.md), [security review](SECURITY_REVIEW.md), [deployment](DEPLOYMENT.md), [updates and rollback](UPDATES_AND_ROLLBACK.md), [design notes](DESIGN_NOTES.md), [Unicode data](UNICODE_DATA.md) and [optional shortcuts](SHORTCUTS.md).
