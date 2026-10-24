# Local v3.3.0 release candidate

Stable published release remains v3.2.0. Stage 6 is accepted for development. Stage 7 prepares **3.3.0-rc.1**, targeting v3.3.0; Stage 8, commits, publication and deployment need separate authorization.

```sh
python3 -B tools/build.py --release-candidate --output-root /private/tmp/oui-330-rc1
python3 -B tools/verify_release.py --candidate-root /private/tmp/oui-330-rc1
python3 -B tools/release_gate.py --candidate-root /private/tmp/oui-330-rc1 --deno /path/to/verified/deno-2.9.7
```

Use a fresh empty outside-repository directory. Builds are offline, Python standard library only. Python/zlib versions affect archive encoding and are recorded by the Stage 7 runner; compare artifacts under the same toolchain, and investigate differences across toolchains. Runtime HTML is self-contained. No npm/Deno package is needed by the app. Deno 2.9.7 / V8 15.0.245.2-rusty / TypeScript 6.0.3 is strictly required for data verification; another global Deno is not a substitute. Tests use the existing locked Happy DOM dependency; pre-cache it through the lockfile before offline testing.

The manifest binds both HTML editions, exact CSP hashes, the hosted worker, `.nojekyll`, notices and source archive. SHA256SUMS covers every artifact and the manifest; it excludes itself. The source input inventory is explicit and hashed. A working-tree input digest is **not a Git commit**. The stable baseline remains separately identified. After any candidate source change rebuild and rerun verification; after Stage 8 audit the exact committed input inventory and verify it still matches before authorizing release. A final v3.3.0 build/version change requires its own exact artifact verification and acceptance.

Hosted deployment uses only `site/index.html`, `site/sw.js`, `site/.nojekyll` from the verified candidate, never the stale stable `site` directory in this development tree. The source/notices companion archive is retained for audit/download distribution; full PSL source is additionally in each HTML. The companion archive supplies build and data-reproduction sources; the full reviewed Git checkout is required for the mandatory regression gate. Tests, review reports, screenshots, macOS/editor/Git metadata, private files, previews and the full-million source CSV are excluded from runtime deployment. Historical source manifests retain their original component-stage flags; the build manifest accurately declares active matching/UI availability without repinning them.

Use [DISTRIBUTION_RIGHTS.md](DISTRIBUTION_RIGHTS.md) for licensing evidence and remaining interpretation caveats and [STAGE7_RELEASE_HARDENING.md](STAGE7_RELEASE_HARDENING.md) for executed checks, exact paths/hashes, unresolved acceptance and release strategy. The [focused licensing resolution](STAGE7_LICENSING_RESOLUTION.md) supersedes the original Stage 7 licensing blocker and records refreshed package hashes; historical Stage 7 receipts remain intact. This document does not authorize deployment.
