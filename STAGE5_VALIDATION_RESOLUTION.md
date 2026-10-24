# Stage 5 validation discrepancy resolved

The unmodified foundation and matcher suites both pass completely under the pinned Deno 2.9.7. A fresh Deno 2.9.8 control reproduces the exact previous failures. All three are caused exclusively by the runtime identity difference; none was skipped and no genuine code/data failure was found.

## Exact three nonpassing tests

| Suite and exact test name | Actual 2.9.8 failure and cause | Deno 2.9.7 result |
|---|---|---|
| Foundation: `fresh generation matches every current asset byte for byte` | `Unreviewed normalization runtime; review differences before regenerating source pins`. The strict guard at `tools/reference_data_lib.mjs:57` rejects 2.9.8 before generation. | Pass. All four foundation outputs reproduce existing pinned hashes. |
| Foundation: `rehashing a shortened subset still fails completeness validation` | `Unexpected error Unreviewed normalization runtime; review differences before regenerating source pins`. The test expects `/Incomplete/`, but the runtime guard rejects first. | Pass. The same shortened/rehashed fixture is rejected for `Incomplete approved rank selection`, confirmed by a separate probe. |
| Matcher: `two complete generations match approved index bytes` | Strict generated-manifest string comparison fails. A recursive comparison identifies exactly one differing field: `generator.runtime.deno` is `2.9.8` rather than `2.9.7`. Index bytes already agree. | Pass. Both repeated generation outputs and approved index/manifest bytes agree exactly. |

Test locations are `tests/reference-foundation.mjs:54`, `tests/reference-foundation.mjs:62` and `tests/lookalikes.mjs:55`. The matcher generator records actual `Deno.version` at `tools/lookalike_data_lib.mjs:16`; no version was spoofed.

## Fresh controlled execution

| Runtime | Foundation | Matcher | Strict index `--check` |
|---|---:|---:|---|
| Installed Deno 2.9.8, isolated control | 160/162 tests | 118/119 tests | Fails on runtime metadata |
| Pinned Deno 2.9.7, isolated executable | **162/162 tests; 49,099 assertions** | **119/119 tests; 38,859 assertions** | **Pass** |

The pinned run has zero failed tests/assertions and no skips: 281 tests and 87,958 assertions across these two suites. The normal assertion harness was used unchanged. The 2.9.7 generated reports also reproduce the existing historical report bytes exactly, but these results come from fresh execution, not reuse of those reports.

Both runtimes used the same byte-identical copy of the current development checkout. Tests were invoked directly with an explicit absolute executable path:

```text
<runtime>/deno run --cached-only --no-prompt --allow-read=. --allow-write=tests tests/reference-foundation.mjs
<runtime>/deno run --cached-only --no-prompt --allow-read=. --allow-write=tests tests/lookalikes.mjs
<runtime>/deno run --cached-only --no-prompt --allow-read=. tools/generate_lookalike_index.mjs --check
```

These are the existing task bodies with isolation flags; no test, generator, pin or assertion was edited. Separate temporary DENO_DIR caches and `DENO_NO_UPDATE_CHECK=1` prevented changes to the user's runtime cache and background update checks. No network permission was granted to either test suite. A diagnostic probe called the existing generators directly to capture exact rejection reasons and compare manifest fields; it did not bypass any guard.

## Verified temporary runtime

The macOS ARM executable came from the [official immutable Deno v2.9.7 release](https://github.com/denoland/deno/releases/tag/v2.9.7). The downloaded archive and checksum files matched the official release API asset sizes/digests; the extracted executable matched the publisher's separate binary checksum.

- Archive SHA-256: `5cd46d6268f6f78f5d88bdc7159d20bd44cdaa4b3303474839f87ec6fe7ae25c`.
- Executable SHA-256: `b73737579d5a84c160e3316487594783fa5c15f4e13252a6a07050b755317f1a`.
- Executed identity: Deno 2.9.7 / V8 `15.0.245.2-rusty` / TypeScript 6.0.3.

It was downloaded/extracted only into this task's temporary audit directory, with no installer, Homebrew operation, PATH edit, shell-profile change or runtime upgrade/downgrade. The temporary executable, caches and checkout copy were removed after verification; complete suite reports, commands, probes, runtime identity and preservation hashes are retained in `tests/comparison-runtime-resolution-results.json`.

## Preservation and conclusion

All 352 pre-existing inventoried repository files remain byte-identical, including production code, data snapshots, manifests/hashes, assertions, pins, historical reports and Stage 2–5 development work. The main Deno symlink, resolved 2.9.8 executable and its SHA-256 remain unchanged. Branch remains `dev/v3.3.0-automatic-lookalikes`; HEAD, local main and local origin/main remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`.

Only this report and `tests/comparison-runtime-resolution-results.json` were added. Existing Stage 5 handoff/integrity files remain historical and unchanged; this resolution supplies the later pinned-runtime evidence. No production correction was necessary. Deno 2.9.8 remains unsupported for pinned generation under the existing strict rules; this work does not change that policy. No commit, push, merge, deployment or Stage 6 work occurred. Work stops after this report.
