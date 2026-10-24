# Authorized GitHub Pages deployment

Offline URL Inspector v3.3.0 is deployed. Maintenance uses `main` and the existing `.github/workflows/deploy-pages.yml`. There is no automatic push deployment.

Production deployment requires an explicit user decision, an exact reviewed 40-character commit on `main`, and its accepted final-build source-input digest. Dispatch also requires `authorize_deployment: true`. Preparing a build or passing checks does not grant authorization.

The verification job checks dispatch/checkout identity, installs checksum-pinned official Deno 2.9.7, caches frozen development dependencies and builds `--final-release` into a fresh runner-temporary directory. It verifies source/artifact correspondence, current functional/data/worker prerequisites, final metadata and the accepted source digest, then runs focused package/workflow rejection checks. Historical stage reconstruction and RC promotion are not required. See [FINAL_RELEASE.md](FINAL_RELEASE.md).

Only that run's newly verified `final/site` directory is uploaded. `include-hidden-files: true` preserves its empty `.nojekyll` file with the supported Pages uploader. The committed root `site/` remains the v3.2.0 rollback set and is never a forward-deployment input.

Verification has `contents: read`; checkouts do not persist credentials. The dependent deployment job alone receives `pages: write` and `id-token: write`. It uses the existing `github-pages` environment, rechecks that `main` still equals the dispatched commit after any approval wait, and deploys the same run's artifact. The concurrency group prevents simultaneous Pages deployments. All actions use immutable official release commit pins.

Keep Pages configured to publish through Actions and retain the existing environment protections. A dispatch checkbox does not establish who approved a change; environment protection remains a repository-side control. Local structural checks do not verify GitHub settings or exercise deployment. GitHub documents [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [environment protections](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

The verification receipt retains the final build manifest, checksums, current gate results and focused package/workflow results. Actions artifacts expire; preserve a compact durable hosted recovery copy and its verification receipt for each deployment that needs recovery support.

Publish a matching HTML/worker set. Preserve the complete source/notices bundle when distributing builds; each HTML also contains offline notices and the exact PSL source. Retain the fixed application path and worker scope `/offline-url-inspector/`. See [distribution rights](DISTRIBUTION_RIGHTS.md) and [updates and rollback](UPDATES_AND_ROLLBACK.md). Rollback requires separate authorization and a matched prior set; it is not a forward v3.3.0 build.
