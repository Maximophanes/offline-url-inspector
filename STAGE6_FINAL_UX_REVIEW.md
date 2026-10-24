# Final Stage 6 UX refinement review

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

Completed on **dev/v3.3.0-automatic-lookalikes**. Stable public release: **v3.2.0**. HEAD, main and origin/main remain `664cc58bf67a2127d0523adec9f1d80c6edd656e`. Nothing was staged, committed, pushed, merged or deployed. Stage 7/8 have not begun.

## 1. Exact changed files

Relative to this refinement’s independently captured **387-file** starting state, nine existing files changed:

- `AUTOMATIC_FINDINGS.md`
- `DESIGN_NOTES.md`
- `README.md`
- `src/automatic-ui.js`
- `src/automatic.css`
- `src/results-presentation.js`
- `src/template.html`
- `src/ui.js`
- `tests/harness.mjs`

Fourteen files were created:

- `AGENTS.md`
- `STAGE6_FINAL_UX_REVIEW.md`
- `STAGE6_FINAL_UX_SCREENSHOTS.md`
- `tests/final-ux-firefox-results.json`
- `tests/final-ux-firefox.mjs`
- `tests/final-ux-integrity.json`
- `tests/final-ux-regression-results.json`
- `tests/final-ux-regressions.py`
- `tests/final-ux-results.json`
- `tests/final-ux-results.mjs`
- `tests/final-ux-screenshot-results.json`
- `tests/final-ux-screenshots.mjs`
- `tests/final-ux-source-boundaries.json`
- `tests/final-ux-strict-runtime-results.json`

No starting file was deleted. The larger Git diff also contains earlier authorized Stage 2–6 work. All earlier datasets, matching/extraction modules, storage/presentation engine, fixtures, result reports, pins and public stable artifacts remain byte-identical. The harness adds an exact whole-file-hash-bound reversal layer for these presentation edits; earlier assertions and pins remain intact. Historical test outputs are written only in disposable copies.

## 2. Offline Ready layout

The status pill shares the inspection-action row, centered with its buttons and aligned with the URL field’s right edge. Native Firefox at 1100px measured zero right-edge and center differences. Updates remain below; Offline access details remains independently collapsed. Actions wrap with full labels at 320px. Hosted status becomes “Offline ready” through the existing verification; standalone says “Standalone · Offline ready”. Service-worker registration, cache verification and update activation code are unchanged.

## 3. Completed neutral result

`https://example.com/` shows **“No lookalike warnings found”**, followed by “No notable hostname resemblance was detected by the supported checks. This does not verify that the website is safe.” The actual hostname remains prominent. This result uses a quieter 17px heading without a caution border; meaningful cautions retain 23px headings and their colored border. Popular-domain membership never establishes safety.

## 4. Unsupported eligibility

`https://example.test/` shows **“Automatic comparisons unavailable”** and “Automatic lookalike comparisons aren’t available for .test addresses.” This is neutral, with no repeated coverage notice or completed-negative claim. Matcher eligibility is unchanged. Missing/corrupt data and interrupted matching still show “Some checks could not be completed”. Unsupported RTL visual comparisons are qualified even if other comparison classes complete.

## 5. Technical Details simplification

Technical Details appears only for useful alternate spelling, an explicitly supplied expected hostname, supported comparison evidence, personal matches or embedded-address groups. Advanced diagnostics is a separate direct disclosure labeled as potentially private. Neutral and unsupported-only results omit the empty technical parent. Complete diagnostics remain lazy and clear on close/reinspection; exact embedded values retain their further intentional reveal. Microsoft, Unicode, structural and embedded lookalike cautions retain precedence over ordinary character observations.

## 6. Understanding Your Results

The section is collapsed by default. Two short opening paragraphs explain offline comparisons and uncertainty. Optional limitations and glossary cover the bundled Majestic popular-domain list, its incomplete coverage, differing eligibility, and the pinned offline PSL’s **ICANN and PRIVATE** rules. They explicitly exclude ownership, registration-status, availability and legitimacy conclusions. Separate manual full-hostname semantics, remote-content/redirect limits, RTL/bidi visual limits and browser-IDNA differences remain clear.

The starting Stage 6 source already mentioned a PSL. This refinement expands and reconciles the remaining help; it does not claim that the obsolete “no PSL” sentence remained in the starting source.

## 7. Your Reference Domains (Optional)

The renamed header retains the saved count. The introduction explains that built-in checks need no saved references, the list is incomplete, users can add personally important or missing sites, and neither comparison verifies safety. Healthy empty-storage success messages are omitted. Unavailable storage, unreadable/conflicting data, migration/recovery, write failures and unsaved changes retain meaningful notices. CRUD, normalization, limits, import/export, Clear All, schema and storage key are preserved. Built-in references never enter personal storage automatically.

## 8. Expected Hostname

Help now reads: “Optional: enter the hostname you expected. Automatic lookalike checks run even when this field is empty.” Expected-target semantics and actual comparison precedence are unchanged.

## 9. Persistent guidance

New [AGENTS.md](AGENTS.md) records all eleven requested principles and instructs future tasks to reread it after compaction. DESIGN_NOTES.md points to current guidance and labels earlier layouts as historical. README.md identifies current local Stage 6 work while preserving prior reports as history. AUTOMATIC_FINDINGS.md documents completed, unsupported and interrupted states and direct advanced access.

## 10. Native Firefox

**Firefox 158.0.1 on macOS**, headless with an isolated temporary profile: **46/46 checks passed** across standalone `file://` and loopback-hosted editions. Coverage includes alignment, status differences, 320px reflow, actual 200%/400% tab zoom, strong/weak findings, keyboard/focus, private evidence, licenses, reference controls, and cached reload after stopping the local server. No inspected-destination requests or unexpected browser-page errors were observed.

Real zoom changed a 1280px viewport to 640px/320px, with devicePixelRatio 2/4 and matching document widths. A temporary zoom-only helper was removed after each operation; the app has no extension dependency. Both editions use the approved **single combined Blackberry & Amethyst palette**; no separate second theme or selector exists.

[The screenshot gallery](STAGE6_FINAL_UX_SCREENSHOTS.md) provides **28 matched native before/after section captures** using identical inputs and fresh storage, plus narrow and zoom evidence. Browser process stderr contains platform/sandbox/crash-reporter warnings; expected favicon CSP blocks were separated from unexpected page errors. This is not a warning-free-process claim.

Reference round trips exercised UI CRUD, reviewed import, confirmation and engine export serialization. OS file-picker/download acceptance, VoiceOver and physical-device acceptance were not performed.

## 11. Automated checks and strict runtime

- **60/60** prior current UI tests, 312 assertions, plus **29/29** final refinement tests, 196 assertions: **89 UI tests / 508 assertions**, zero failures.
- **10/10** isolated build checks: deterministic bytes, CSP, complete data/notices, worker binding and public artifact preservation.
- Seven current analysis suites: **109,056 tests**, zero failures (unit, references, differential, provenance, coordinator, worker and hosted bootstrap).
- **37/37 aggregate regression commands**, including the unchanged prior complete 28-command historical runner. Historical presentation is reconstructed exactly for original literal assertions; those assertions are not repinned to current UI.
- Fresh official hash-verified **Deno 2.9.7**: foundation **162/162**, 49,099 assertions; matcher **119/119**, 38,859 assertions; strict index `--check` passed. No failures or skips.

Index SHA-256 remains `7cd6bec6f74549177c508468b8f061618d1f90916664621d28df5f1dbb5dc526`. Strict rules, datasets, generator/runtime pins, release verifier and deployment workflow remain unchanged. The installed Deno remains 2.9.8 with its original hash. The temporary 2.9.7 runtime/archive/cache/source copy and isolated Firefox profile/zoom helper were removed; evidence and previews remain.

Reproduce current acceptance without overwriting historical reports:

```sh
python3 -B tools/build.py --automatic-ui-preview --output-root /private/tmp/oui-final-review
python3 -B tests/final-ux-regressions.py --development-root /private/tmp/oui-final-review
```

An initial wrapper assertion expected one occurrence of a read-only git-show expression; the unchanged nested runner also contains it. The wrapper was corrected to account for both occurrences, preserving original test assertions. All product checks then passed.

## 12. Preview and remaining concerns

Open the tested standalone preview — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/003-Offline_URL_Inspector.html` (SHA-256 `a8cfd2a5119ef9c73c9d379ef276928147e087210bf162389f73f4c8655030a2`).

Exact URL:

```text
file:///private/tmp/oui-stage6-final-piep38_v/preview/standalone/Offline_URL_Inspector.html
```

The tested preview matches the repeated build manifest. The local hosted bundle is `/private/tmp/oui-stage6-final-piep38_v/preview/site/`; no test server remains running. Before sources/builds, screenshots and logs remain in the review folder. Temporary-folder retention is controlled by the operating system.

No known product failure remains from this refinement. Existing engine eligibility/RTL limitations and previously documented one-time initialization cost remain. VoiceOver, physical devices and OS file-picker/download acceptance remain unverified as stated above. All changes are local, unstaged and uncommitted. Stage 7/8 and release work await separate authorization.
