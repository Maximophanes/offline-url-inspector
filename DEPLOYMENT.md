# v3.3.0 candidate deployment safeguards

The published application remains v3.2.0. This local workflow change is not deployed and has not run on GitHub. No repository setting was changed. The old contract below is historical.

The proposed workflow removes automatic push deployment. Manual dispatch must run on `main`, explicitly authorize deployment, and supply the exact checked-out commit and accepted source-input digest. It builds a fresh outside-checkout candidate, verifies source/artifact correspondence and strict Deno 2.9.7 data reproduction, then runs mandatory core, storage, provenance, comparison, presentation/privacy/accessibility, worker and update regressions. Failure prevents artifact upload and the dependent deployment job. It uploads only that run's newly built three-file hosted directory. The old root `site/` is never a deployment input. No other run's artifact is selected.

Verification has only `contents: read`; checkout does not persist credentials. Only the dependent `github-pages` environment deployment job receives `pages: write` and `id-token: write`. The concurrency group prevents simultaneous Pages deployments. The receipt records the dispatch commit, input digest, complete manifest/checksums and gate results. The RC version is deliberate; promotion to a final v3.3.0 version requires separate exact-build acceptance.

Required user configuration after independent audit: retain Pages' Actions publishing source; protect `main`; require appropriate review/status checks; configure the `github-pages` environment for the authorized branch and required reviewers (including preventing self-approval where supported). A dispatch checkbox/digest proves what was requested, **not that a human audit or legal approval occurred**. Environment approval is an external control. Local tests cannot establish GitHub-hosted enforcement. Action release tags were resolved through the official GitHub repositories and pinned to immutable commits in this workflow; independent review of those actions remains required. The Linux Deno archive is pinned to the checksum published with the official 2.9.7 release, verified before extraction/execution. `ubuntu-latest` is a moving build environment; archive determinism must be reproduced on the actual runner and accepted before promotion. No actions, settings or live deployment were invoked here.

Reference source materials/notices are available offline inside each HTML. Preserve the complete candidate bundle for download/audit distribution. Do not publish only a worker or mix releases. See [RELEASE_CANDIDATE.md](RELEASE_CANDIDATE.md), [distribution rights](DISTRIBUTION_RIGHTS.md) and [the Stage 7 handoff](STAGE7_RELEASE_HARDENING.md).

[GitHub documents](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) the build/deploy dependency, Pages token permissions and environment requirements. [Environment protections](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) require repository-side configuration and may depend on plan/visibility.

## Historical deployment contract

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
