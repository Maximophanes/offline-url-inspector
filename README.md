# Offline URL Inspector · Version 3.1.2

A complete editorial and interface refinement of the existing 3.1.2 development work, built on the user-verified 3.1.1 baseline. Findings explain the observation before the implementation. Ordinary Unicode stays neutral, genuine warnings retain their severity, and complete original evidence remains available. Blackberry & Amethyst, the Georgia title and its approved animation are preserved.

Development remains on `dev/v3.1.2` in `Maximophanes/offline-url-inspector`. Changes are uncommitted for GitHub Desktop review. No commit, push, merge, pull request, release, publication, settings change or change to `main` was made.

## Use either edition

Open `standalone/Offline_URL_Inspector.html` directly for a self-contained offline application. The hosted build is in `site/` and uses `/offline-url-inspector/`. For a local preview:

```sh
python3 tools/serve.py
```

Open `http://127.0.0.1:8765/offline-url-inspector/`. Paste a copied link, optionally enter an expected hostname, and choose **Inspect without opening** or press **⌘ Return / Ctrl Enter**. Inspection never visits the destination. The manual expected hostname takes priority; saved references can still be evaluated separately.

Technical Details retains Input & Normalization, Character Details, URL Components, Reference Comparisons and the Full Diagnostic Log. Hostname descriptors use deliberate second lines. Actual mapping sequences, original case, code points/names, diagnostic codes/levels/order and every ASCII location remain accessible. Multi-character or whole-hostname resemblance never invents a one-to-one character match. Exact matches concern the hostname, not the entire URL or website safety.

**Offline ready** describes a verified application copy. The top row puts updates on the left and a compact violet pill on the right; an independent details panel expands underneath. General guidance covers browser profiles and isolated sessions. The user reports that earlier 3.1.2 work fixed persistent cached-startup preparation; this pass preserves it and removes the unnecessary Preparing label during fast local verification. See [offline startup review](OFFLINE_STARTUP_REVIEW.md).

## References and compatibility

Reference normalization, matching, storage schema/key and backup format are unchanged. Version 3.1.1 schema-1 records load without rewriting them under `offline-url-inspector:reference-domains`. Only explicitly managed reference hostnames are saved. Inspected links, credentials and expected-host text are not persisted by the app. Single-label names and IP addresses remain exact-only.

**Export Backup** saves the readable list shown in the app; it cannot preserve an unreadable or different protected saved record. Clear/Replace warnings explain that distinction. Storage feedback distinguishes loaded data, readable storage without a tested write, successful writes, failed writes, temporary changes and protected/conflicting data. A successful write does not guarantee long-term file:// persistence. GitHub Pages projects on the same github.io hostname share a security origin despite different paths.

## Editorial standard and validation

[EDITORIAL_STYLE_GUIDE.md](EDITORIAL_STYLE_GUIDE.md) is the permanent writing standard. [COPY_AUDIT.md](COPY_AUDIT.md) records every major ordinary and conditional message family, changes, preserved technical terms and verification limits. `tests/copy-inventory.json` supplies source lines/hashes and literal candidates across all ten runtime-copy sources.

**109,580 checks and 122,882 assertions passed, zero failures.** The complete available suite ran once after application changes settled. It includes 52 editorial acceptance checks, all 33 core diagnostic families, 139 unchanged complete pre-audit inspection objects and 56 hosted lifecycle checks. [Test results](TEST_RESULTS.md) distinguish source/DOM simulations, actual loopback HTTP and actual in-app browser observations.

The in-app review covers expanded evidence, errors, import review/cancellation, updates, 1100/390/320-pixel layouts and cached reopening/reload with the server stopped. **Final real Firefox verification remains pending.** See the [Firefox checklist](FIREFOX_CHECKLIST.md) for native 200% zoom, reduced motion, screen readers, file policies, Containers and full disconnected-network checks.

## Build and test

Both editions are generated from `src/` with pinned Unicode 18.0.0 data. There are no external runtime dependencies, fonts or analytics. Python and Deno are development tools.

```sh
deno cache --lock=deno.lock tests/dom.mjs tests/dom-v3.mjs tests/refinement.mjs tests/polish.mjs tests/clarity.mjs tests/editorial.mjs
python3 tools/verify_data.py
python3 tools/build.py
python3 tools/audit_copy.py --check
python3 tools/test_all.py
```

The runner owns loopback port 8765. Targeted tasks are defined in `deno.json`. Regenerate the copy inventory with `python3 tools/audit_copy.py` when source copy changes. Builds recompute exact CSP/HTML/release hashes without regenerating Unicode data. `SHA256SUMS` inventories files excluding itself and Git metadata.

Core/reference/data algorithms are unchanged. Worker logic is unchanged; only its plaintext 503 recovery message was edited. A strict test restores that one literal and requires the original complete worker hash. Full RTL visual comparison, ownership/reputation/content/redirect checks, public-suffix inference, permanent storage/cache guarantees and comprehensive phishing detection remain outside scope. The 19 documented native Deno IDNA discrepancies remain unchanged; see [IDNA review](IDNA_REVIEW.md).

See [changelog](CHANGELOG.md), [security review](SECURITY_REVIEW.md), [deployment](DEPLOYMENT.md), [updates and rollback](UPDATES_AND_ROLLBACK.md), [design notes](DESIGN_NOTES.md), [Unicode data](UNICODE_DATA.md) and [optional shortcuts](SHORTCUTS.md).
