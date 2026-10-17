> Version 3.1.2 retains Version 3.1.1's storage key, schema 1 and reference engine. Worker logic is unchanged; only plaintext 503 recovery prose differs. No migration is needed. Startup now checks existing cache state first and uses bounded lifecycle/status waits; see OFFLINE_STARTUP_REVIEW.md. Work remains uncommitted on dev/v3.1.2, with no deployment performed.

# Updates, storage compatibility, and rollback

## Build a future release

1. Keep the approved prior Git revision and matching deployed `site/` set. Export references from the browser before changing storage formats or troubleshooting site data.
2. Work on the development branch in the existing source repository; keep published main unchanged until explicit approval. Preserve the fixed application ID, project path, and stable reference-storage key. Change `VERSION` in `tools/build.py` for the new app release; audit any worker/cache/schema changes.
3. Edit `src/`, then run `python3 tools/verify_data.py` and `python3 tools/build.py`. Ordinary builds preserve the pinned Unicode JSON. Do not regenerate unchanged tables or edit generated CSP hashes. A Unicode update needs the additional review in [UNICODE_DATA.md](UNICODE_DATA.md).
4. Run targeted checks while developing and `python3 tools/test_all.py` before delivery. Run the manual Firefox checklist for both editions, especially offline/updates. Keep actual browser evidence separate from simulations. Update release documentation/reports/checksums.
5. After user review and approval, use the existing repository and Pages workflow to deploy the complete generated `site/index.html`, `site/sw.js`, and `.nojekyll` together. Preserve previous releases outside the deployed root for rollback.

The worker embeds the complete HTML SHA-256 and a release cache ID of `version-<HTML hash prefix>`. Editing either generated asset independently breaks that pairing. A transient mismatch during deployment causes installation to fail rather than accepting a mixed release. The previously active worker/cache remains available; retry after the complete deployment reaches the origin.

## What users see during an update

The app first discovers and verifies existing exact-scope registration/cache state, without awaiting a fresh registration. New uncached online contexts register the fixed worker; the app also offers **Check for Updates** and checks after coming online. There is no recurring background polling timer. The new worker first fetches and verifies the one complete HTML asset. It does not call `skipWaiting` during installation.

A waiting release displays **Apply update and reload**. Inspection continues in the current complete document. Choosing Apply requests activation; if the page contains URL text, results-related input, a reference edit, or an import preview, it asks for confirmation that current text and unapplied changes will be cleared. Saved references remain. The app never serializes sensitive current work to make a reload convenient.

Before activation, the waiting worker rechecks its release cache. If it was evicted, it can fetch and verify only its fixed expected asset while online. If recovery fails, activation is refused and the current page stays open. If activation does not complete, the page shows a retry message. Only the tab that explicitly requested the update reloads automatically on controller change. Other open tabs retain their current complete document; reload them when ready.

The active release cache and one previous application-owned cache are retained. That previous cache is a recovery aid, not a permanent archive or an automatic downgrade feature. Browsers and users can delete caches at any time. Worker cleanup ignores sibling projects and never clears reference storage.

## Stable storage and portable export contract

Storage key, unchanged across ordinary app releases:

```text
offline-url-inspector:reference-domains
```

The storage record and exported file use the same exact schema:

```json
{
  "application": "offline-url-inspector",
  "schemaVersion": 1,
  "references": [
    "amazon.com",
    "xn--caf-dma.invalid"
  ]
}
```

Only normalized ASCII hostnames are exported. Maximum 100 entries, 128 KiB JSON, and 2,048 input characters per entry. Unicode hostnames normalize consistently with the expected-host parser. No timestamps, machine identifiers, inspected URLs, tokens, credentials, queries, or browser-history data are included.

Schema 1 is the V3 / V3.1 compatibility contract. Later code should continue reading and exporting it where possible; ordinary application version changes must not rename the storage key. A future format change requires an explicit tested migration that retains every valid entry, plus an intentional portable export compatibility policy. Unknown future schemas must be preserved untouched; V3 cannot promise to interpret an unknown format. New valid schema-1 exports can transfer between standalone and hosted editions through reviewed Import.

V3 implements and tests one historical-format migration: draft/test schema 0 has exactly `application`, `schemaVersion: 0`, and `domains`. It is normalized into schema 1 without dropping valid entries. This is not data from V2.1, which had no Reference Domains feature. Invalid entries cause protection of the original record rather than a partial silent migration. A failed migration write keeps valid entries available for the session and preserves the original saved bytes.

Session-only data is not saved automatically later. If storage fails, Export before closing. Invalid/unsupported saved data or a stale-tab conflict enters protected mode; current edits do not overwrite those bytes. Use a reviewed Replace or confirmed Clear only after preserving any original record you need. A normal Export exports the current valid session list, not an unreadable protected raw record. To preserve such a record, copy the exact application-key value from Firefox Storage Inspector to a local text file before replacing it. Do not paste that value into other websites or public issue reports.

## Failure and recovery

| Situation | Expected behavior and recovery |
|---|---|
| Offline or interrupted new installation | Incomplete new cache is removed; old complete cache remains. Continue using the open app/old worker, then retry online. |
| HTML/worker mismatch or HTTP error | New installation refuses activation. Confirm that both matching assets are deployed, then check updates. |
| Cache quota/API unavailable | No offline promise. Analysis still works in the loaded page; keep/export references and use the standalone file. |
| Active cache deleted, online | Worker attempts to restore only its exact expected application asset. If the server now has a different release, check for the matching new worker. |
| Active cache deleted, offline | Navigation returns explicit plaintext 503 recovery instructions. The downloaded standalone HTML is the independent fallback. |
| Waiting cache deleted | Apply retries complete verified caching online; offline refusal leaves current work open. |
| Browser storage cleared/private session ended | References may be gone. Import your exported backup; the app cannot reconstruct deleted data. |
| Current worker prevents online recovery | Export references from an open app if possible. In Firefox `about:debugging#/runtime/this-firefox`, locate the exact inspector registration and unregister **only** the worker scoped to `/offline-url-inspector/`. Reopen the fixed app URL online. UI wording may vary. |

Do not clear all `USERNAME.github.io` site data/caches to repair this one project: that can remove references and other projects' data. Unregistering a worker does not itself require deleting localStorage. If deleting caches manually is necessary, select only names beginning `offline-url-inspector:/offline-url-inspector/:release:`. Keep the standalone copy available before troubleshooting.

## Controlled rollback

Restore the previous **matched** `index.html` and `sw.js` together from the approved prior Git revision or archived release in this repository. Do not combine an older HTML with a newer worker or rely on changing only a display version. The old generated worker contains its old expected HTML hash. After the reverted deployment is complete, check updates and choose the reviewed reload. Its valid existing cache may be reused; otherwise it must be downloaded and verified.

If a stuck registration cannot recover, unregister only the project worker as above, then load the restored app online. Do not clear reference storage. If the newer release introduced a schema the older version cannot read, export a compatible backup **before** downgrading, or keep the newer standalone edition to recover it. V3 protects unsupported stored schemas instead of erasing them. Version-controlled matched source/build revisions, rather than the single retained previous cache, are the reliable rollback material.

Worker update/install/waiting semantics follow the [Service Worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers). This package's failure behavior was simulated; confirm it in Firefox before relying on a hosted release.
