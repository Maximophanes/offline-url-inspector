# Offline URL Inspector · v3.3.0 release hardening

Stable published release: **v3.2.0**. The local **3.3.0-rc.1** remains on `dev/v3.3.0-automatic-lookalikes`; development work is local, unstaged and uncommitted. The Stage 8 independent audit is complete, and both original findings were independently verified resolved.

The [original adverse audit](STAGE8_INDEPENDENT_SECURITY_AUDIT.md), [remediation handoff](STAGE8_REMEDIATION_HANDOFF.md) and [independent reverification](STAGE8_REVERIFICATION.md) retain their historical scope. Subsequent [targeted UI polish](FINAL_ACCEPTANCE_UI_POLISH.md) and independent final-diff technical checks passed. The latter report is privately retained as `FINAL_DIFF_INDEPENDENT_REVIEW.md` (SHA-256 `6d79feeaccee191fa97843e954f3bbded1616b758e3464693a614d3ae3ef2250`), with the conditional verdict **READY FOR CONTROLLED DEVELOPMENT-BRANCH COMMIT AFTER DOCUMENTED PRIVACY DECISIONS**. The [publication resolution](PRECOMMIT_PUBLICATION_RESOLUTION.md) records the authorized corrections and verification; independent publication-diff verification remains the next review step. A controlled development-branch commit requires those publication corrections, passing verification and separate user authorization.

Manual headful Firefox and keyboard-only acceptance, VoiceOver, physical/mobile and other-browser checks, actual OS file-picker/download and backup-file round trips, and the other documented platform/deployment gaps remain open. A development-branch commit does not imply final release approval. **No v3.3.0 release or deployment is authorized.**

The [focused Stage 7 licensing resolution](STAGE7_LICENSING_RESOLUTION.md) supersedes the earlier licensing blocker: **READY FOR INDEPENDENT AUDIT**. This is readiness for a separately authorized audit, not final release or deployment acceptance.

Automatic offline comparisons use 9,570 normalized popular-domain references from the approved Majestic snapshot and the pinned ICANN/PRIVATE Public Suffix List. They combine verified Unicode resemblance, ASCII visual similarity, structural-domain evidence and conservative spelling suggestions. Personal Reference Domains and Expected Hostname remain optional and distinct comparison sources. Original and recovered embedded addresses retain explicit scope, occurrence provenance and coverage limits; recovered text is never a confirmed redirect. Neither popularity nor absent resemblance establishes safety, ownership or intent. Inspection makes no destination, DNS or reputation request.

Use [the candidate instructions](RELEASE_CANDIDATE.md) to build both editions outside this checkout and verify complete source/artifact correspondence. The root `site/`, `standalone/`, `build-manifest.json` and `SHA256SUMS` remain the preserved v3.2.0 artifacts. Current tests and limitations, including native-browser scope, distribution-rights review and unresolved acceptance, are in [the Stage 7 handoff](STAGE7_RELEASE_HARDENING.md). Read [AGENTS.md](AGENTS.md), [the presentation contract](AUTOMATIC_FINDINGS.md), [data provenance](REFERENCE_DATA.md) and [distribution rights](DISTRIBUTION_RIGHTS.md). The approved visual identity is one combined Blackberry & Amethyst palette.

The following versioned sections are historical reports, including their former candidate identities, branch names and manual-test gaps.

# Offline URL Inspector · Version 3.2.0 local candidate

Current corrected candidate: **3.2.0-a67e4b13dd5fa5cd**. The three approved audit corrections recover encoded whole fragments and remaining relative-reference interpretations, support committed candidates in the release verifier, and remove pathological/redundant preprocessing. Native URL authority, original results, privacy boundaries and the established presentation remain preserved.

Newly executed: **109,827 full-suite checks / 130,743 assertions**, zero failures; **27 correction checks / 841 assertions**, **146 embedded checks / 533 assertions**, and **18 verifier cases**. The largest dotted-host benchmark's combined median changed from about 2,568 ms to 57 ms in Deno, including initialization. This is not native Firefox timing or a hard deadline guarantee.

The post-audit snapshot-fixture follow-up changes tests and evidence only; production bytes and the candidate identity are unchanged. See [the correction handoff and exact scope](AUDIT_CORRECTIONS.md). Earlier browser observations remain bound to their older candidate hashes; corrected-candidate native Firefox/manual checks remain required. The highlight/@ presentation itself is unchanged; its historical evidence is in [the highlight report](HOSTNAME_HIGHLIGHT_REVIEW.md).

Changes remain local, unstaged and uncommitted on `dev/v3.2.0-embedded-url-analysis` over HEAD `90649ff263a2d938010079dcf6b3fe1cb84724f3`. Main and Draft PR #2 are unchanged. Nothing was pushed, merged, published or deployed.

`python3 -B tools/verify_release.py` verifies the settled working candidate. `--candidate <commit-or-ref>` additionally binds the expected checked-out commit. Builds/checksums must be refreshed after authorized changes before final verification.

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

On the current v3.3.0 development branch, use the Stage 6 outside-repository preview commands below. The stable build/test commands in this section describe v3.2.0; the development-source guard intentionally refuses to overwrite or mislabel those artifacts.

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

## Local v3.3.0 Stage 2 foundation

The Stage 2 foundation adds a pinned, offline Majestic/PSL pipeline and boundary module. Its top-10,000 source selection produces 9,570 normalized registrable domains, with 883 in the restricted top-1,000 tier. Automatic matching and its UI were outside that stage. Existing v3.2.0 application artifacts remain unchanged; opt-in Stage 2 previews build outside the repository. See the [implementation handoff](STAGE2_REVIEW.md) and [data contract, reproduction, attribution and limitations](REFERENCE_DATA.md). Work remains local and uncommitted.

## Local v3.3.0 Stage 3 engine

Stage 3 adds a separate dormant matching engine, reproducible indexes, explicit coverage/resource limits and a disjoint 10,000-domain calibration corpus. Application startup and UI remain unchanged. See the [engine interface and calibration review](LOOKALIKES.md) and [Stage 3 handoff](STAGE3_REVIEW.md). Changes remain local, unstaged and uncommitted.

## Local v3.3.0 Stage 4 provenance

Stage 4 preserves repeated nested parent-child relationships while reusing native parsing, and separates source occurrences from alternative interpretation entries. See the [occurrence contract, bounds, validation and handoff](STAGE4_REVIEW.md). Current-source builds require `--provenance-preview` and an outside-repository output root; `deno task test:provenance-build` verifies both editions and stable historical reproduction. Public v3.2.0 files remain unchanged. Automatic orchestration and UI integration remain deferred.

## Local v3.3.0 Stage 5 orchestration

Stage 5 composes original/embedded hostname matching, manual and personal-reference evidence, shared budgets and occurrence attachments behind an explicit structured API. See the [comparison contract](COMPARISONS.md) and [18-point handoff, validation scope and runtime-generation limitation](STAGE5_REVIEW.md). `--comparison-preview` packages the local API/index outside the repository without initializing it or adding automatic findings to the displayed UI. Public v3.2.0 artifacts and existing matching/data policies remain unchanged; Stage 6 requires separate authorization.


## Local v3.3.0 Stage 6 automatic findings

Stage 6 now selects one primary result from the strongest meaningful original, manual and embedded findings. Strong lookalikes lead with a caution and their concrete mechanism. Ordinary results omit empty reports and duplicate hostname forms; concise Technical Details and deliberate advanced diagnostics retain the full evidence. Underlying manual classifications and the single combined Blackberry & Amethyst palette remain preserved. The focused UX correction supersedes the earlier supplemental-only layout.

```sh
python3 -B tools/build.py --automatic-ui-preview --output-root /private/tmp/oui-stage6-preview
deno task test:final-copy
python3 -B tests/final-copy-regressions.py --development-root /private/tmp/oui-stage6-preview
```

`test:final-copy`, `test:http-structure`, `test:stress`, `test:prominence`, `test:followup`, `test:acceptance`, `test:messaging`, `test:ux` and `test:automatic-ui` create an isolated checkout/preview, verify exact data/CSP/worker binding and run current message-level DOM checks; earlier result reports are written only in the disposable copy. The first command creates a separate persistent development preview for local review. `python3 -B tests/final-copy-inventory.py --check` verifies the current message inventory. No runtime dependencies or downloads are introduced. Strict foundation/matcher/index reproduction continues to require checksum-verified isolated Deno 2.9.7; the installed 2.9.8 and all strict pins remain unchanged. The current presentation-only regression runner verifies the unchanged inputs and preserves the successful strict report without rerunning generation.

Earlier Stage 2/4/5 build instructions are historical. Current presentation sources require `--automatic-ui-preview`. The Stage 6 regression runner reconstructs exact historical builds only in disposable copies, retaining the original assertions and result fixtures. Public v3.2.0 distribution files remain byte-identical.

See [the focused Stage 6 UX handoff and remaining acceptance gaps](STAGE6_UX_REVIEW.md), [native before/after screenshots](STAGE6_UX_BEFORE_AFTER.md), and [current presentation contract](AUTOMATIC_FINDINGS.md). The [initial 18-point handoff](STAGE6_REVIEW.md) and its checklist remain historical evidence from before this correction. Work remains local and uncommitted. Stage 7 release hardening and Stage 8 final acceptance have not begun.
