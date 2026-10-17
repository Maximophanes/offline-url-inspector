# Existing GitHub Pages deployment contract

Repository: `Maximophanes/offline-url-inspector`. The user reports Version 3.1.1 is published at `https://maximophanes.github.io/offline-url-inspector/`. This task leaves Version 3.1.2 uncommitted on `dev/v3.1.2` for review. It does not publish, push, merge, create releases/PRs, change settings or modify `main`.

The existing `.github/workflows/deploy-pages.yml` remains unchanged. It deploys the `site/` directory using GitHub Pages Actions on matching `main` pushes (paths `site/**` or the workflow), and offers `workflow_dispatch`. It includes hidden files in the artifact. Use the existing repository/workflow after the user approves the release; do not create a replacement repository or change Pages to a root branch deployment.

## Local validation

```sh
python3 tools/build.py
python3 tools/serve.py
```

Open `http://127.0.0.1:8765/offline-url-inspector/`. The server binds only to loopback, serves the fixed project assets and avoids logging submitted query strings. Stop it before `python3 tools/test_all.py`, which owns port 8765. The standalone file can be opened directly and needs no worker/server.

## Fixed hosting contract

| Item | Value |
|---|---|
| Project path and worker scope | `/offline-url-inspector/` |
| Worker URL | `/offline-url-inspector/sw.js` |
| Complete cached application | `/offline-url-inspector/index.html` only |
| Deployment directory | `site/` (`index.html`, `sw.js`, `.nojekyll`) |
| Independent offline fallback | `standalone/Offline_URL_Inspector.html` |

Build both editions from shared sources. Deploy the matching generated HTML and worker together only after approval; the worker rejects an incomplete/mismatched release rather than accepting partial application bytes. Never hand-edit generated CSP hashes or broaden the worker scope. Keep an approved prior matched file set in version history for rollback.

Hosted status verifies an existing exact-scope cache before reporting Offline ready. Containers/profiles can isolate registrations and storage; an uncached offline context cannot download the app. Clearing caches can remove availability. Reference storage uses schema 1 and the same key as Version 3.1.1; no migration is needed. Other projects on the same GitHub Pages origin can access origin storage regardless of project path.

Only fixed application resources load/update; submitted destinations are never contacted. Exact inline CSP hashes, complete worker release hashes and real loopback HTTP checks passed. Actual Version 3.1.2 Firefox/live Pages checks remain pending until explicitly performed. Local server or in-app cache tests do not establish a live deployment. Use FIREFOX_CHECKLIST.md, SECURITY_REVIEW.md and UPDATES_AND_ROLLBACK.md.
