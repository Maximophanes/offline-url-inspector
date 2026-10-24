# Offline URL Inspector · v3.3.0

Offline URL Inspector v3.3.0 is deployed at [maximophanes.github.io/offline-url-inspector](https://maximophanes.github.io/offline-url-inspector/). `main` is the maintenance branch. Changes, commits, pushes and production deployments require the applicable user authorization.

Paste a copied link, optionally enter an Expected Hostname, and choose **Inspect without opening** or press **⌘ Return / Ctrl Enter**. Inspection never contacts the destination, DNS or reputation services. It does not establish ownership, reputation, a confirmed redirect or website safety.

Automatic offline comparisons use 9,570 normalized popular-domain references from the approved Majestic snapshot and the pinned ICANN/PRIVATE Public Suffix List. Verified Unicode resemblance, ASCII visual similarity, structural-domain evidence and conservative spelling suggestions retain their separate proof methods. Personal Reference Domains and Expected Hostname remain optional, distinct comparison sources. Original and recovered embedded addresses retain their scope, occurrence provenance and coverage limits.

## Editions and maintenance

The hosted edition uses the fixed `/offline-url-inspector/` project path. The standalone edition is one self-contained HTML file that can be opened directly, without a server or service worker. Neither edition has external runtime packages, fonts or analytics.

Use [FINAL_RELEASE.md](FINAL_RELEASE.md) for current builds and focused checks, and [DEPLOYMENT.md](DEPLOYMENT.md) for the manually authorized Pages workflow. Build current v3.3.0 outputs into a fresh directory outside this checkout. Builds package existing pinned data; they do not regenerate it.

The committed `site/`, `standalone/`, `build-manifest.json` and `SHA256SUMS` are deliberately retained **v3.2.0 rollback materials** from commit `664cc58bf67a2127d0523adec9f1d80c6edd656e`. They are not the deployed v3.3.0 output. Do not overwrite them with a current build or deploy them through the forward-release workflow. The complete final hosted recovery copy is retained privately outside Git in the maintainer's URL Insp. Archives folder.

## Reference Domains and offline storage

Reference Domains use schema 1 and the unchanged `offline-url-inspector:reference-domains` storage key. Only explicitly managed reference hostnames are saved. Inspected links, credentials and Expected Hostname text are not persisted by the app. Single-label names and IP addresses remain exact-only.

**Export Backup** saves the current readable reference list; it cannot preserve an unreadable or different protected saved record. Import previews, deliberate Replace/Clear confirmations and protected-storage safeguards remain unchanged. Keep backups before troubleshooting browser storage. File origins, private sessions and browser eviction can affect persistence; projects on the same GitHub Pages hostname share an origin.

**Offline ready** describes a verified cached application copy. An uncached offline profile cannot install the hosted app. Updates use deliberate Apply Update controls and preserve saved references. See [updates, recovery and rollback](UPDATES_AND_ROLLBACK.md).

## Project references

- [Presentation contract](AUTOMATIC_FINDINGS.md), [comparisons](COMPARISONS.md), [lookalike methods](LOOKALIKES.md), [editorial standard](EDITORIAL_STYLE_GUIDE.md) and [design history](DESIGN_NOTES.md).
- [Reference data and provenance](REFERENCE_DATA.md), [distribution rights](DISTRIBUTION_RIGHTS.md), [Unicode data](UNICODE_DATA.md) and [IDNA limitations](IDNA_REVIEW.md).
- [Firefox checks](FIREFOX_CHECKLIST.md), [optional shortcuts](SHORTCUTS.md), [changelog](CHANGELOG.md) and [maintenance instructions](AGENTS.md).

Historical stage reports and screenshots remain in Git history. Existing historical regression scripts and receipts preserve their original assertions; they are not mandatory maintenance or deployment gates. `COPY_AUDIT.md` remains because the existing editorial regression reads it. Choose tests according to the change rather than replaying every development stage. Automated DOM/worker checks do not establish native-browser, screen-reader or physical-device acceptance.
