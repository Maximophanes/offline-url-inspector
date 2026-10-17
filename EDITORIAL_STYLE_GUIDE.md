# Editorial style guide

This is the permanent copy standard for Offline URL Inspector, established in Version 3.1.2. Follow it when adding or changing application text. Update `COPY_AUDIT.md`, the copy inventory and representative state tests when a message family changes.

## Audience and voice

Write for intelligent people who may not know Unicode or cybersecurity terminology. Explain the finding first, its significance second, and an available next step when one is needed. Use concise, professional, conversational English. Preserve wording that already works. Do not make every field sound like a specification, diagnostic console or test report.

Use sentence case for explanatory text and field labels; retain established product/disclosure names and approved controls such as Technical Details, Reference Domains, Inspect without opening, Unicode lookalike, ASCII lookalike and Check for Updates. Use natural contractions when they improve a sentence. Do not abbreviate a hostname or replace an inspected character to make the copy look cleaner.

## Findings and certainty

Keep these states distinct:

- A supported comparison found a match or resemblance.
- A supported comparison found no match.
- No notable characters were identified.
- The comparison was unavailable.
- The input was invalid, or a result is uncertain.

An unavailable visual check is not a negative finding. Unicode, an internationalized name, a mapping or a font-dependent resemblance is not proof of malicious intent. Do not invent a brand, positional character substitution or one-to-one match from whole-label/whole-hostname evidence.

An exact **hostname** match compares hostname identity only. It does not compare the scheme, port, path or query, and does not verify content, ownership, reputation or website safety. Give the relevant scope clarification in the match finding; keep the full limitations in Understanding Your Results. Do not repeat the same disclaimer in every neighboring field.

## Terminology contract

| Term | Meaning and presentation rule |
|---|---|
| Original URL | The complete submitted text. Keep the input unchanged, including case, controls and spacing. A shortened technical display must say where the full text remains. |
| Original Hostname | The source spelling identified by the authority scanner; label uncertain extraction explicitly. |
| Decoded Hostname / (percent encoding) | The hostname after percent decoding and the browser preprocessing already modeled by the scanner. It is not a decoded complete URL or a Punycode decoding claim. |
| Readable Hostname / (Unicode) | The validated readable representation. Do not fabricate it if Punycode/IDNA validation fails. |
| Actual Hostname / (ASCII / Punycode) | The browser parser's hostname representation. Punycode is an encoding, not a danger category. |
| Expected hostname | The user's explicit comparison target; it takes priority. |
| Saved reference domain | A deliberately saved comparison target, checked separately where applicable; not a trust database. |
| Exact match | Hostname identity after the existing normalization rules, not URL equivalence. |
| Subdomain | A relationship identified from hostname sections and dot boundaries; not ownership or registrable-domain inference. |
| Name inside a different hostname | Text occurs within a longer name but is not a parent/subdomain relationship. |
| Spelling similarity | The existing spelling-distance result, distinct from visual resemblance. |
| Potential visual resemblance | A supported Unicode or finite ASCII heuristic result, with the actual method preserved in deeper evidence. |
| Unavailable comparison | A check could not be completed; no negative resemblance or safety conclusion follows. |

Format parenthetical hostname descriptors as a smaller, muted, nonbreaking second line. This applies to generated character rows as well as static labels. Hostname values must wrap without hiding a distinguishing suffix.

Explain ASCII/Unicode/Punycode briefly at their first general presentation. Explain IDNA, UTS #39, normalization, DNS labels, public suffixes and registrable domains once in contextual or subordinate help. Keep precise technical names in advanced evidence. CSP remains a policy mechanism, not a user-facing safety verdict; do not invent a browser certification claim.

## Evidence and diagnostics

Preserve diagnostic code, level, category, trigger, order, comparison classification and underlying values. Prefer presentation helpers over editing the security-sensitive engine or reference store. Raw Unicode names, code points, mapping sequences, normalization information and original diagnostic prose are evidence, not material to rewrite casually.

Use a concise title and the actual severity in each collapsed log entry. An expanded entry gives a short plain-language explanation. Put original prose, codes and processing details in clearly labeled Technical evidence. Do not turn the log into a second primary findings panel.

Preserve multi-character mappings. Present UTS #39 mapping sequences once, using actual glyphs/code points; names and raw records can sit deeper. A character's IDNA rule need not describe the normalization of an entire sequence. Mark unverified outcomes rather than asserting preservation. Keep official Unicode names verbatim.

ASCII observations use separate groups: potential resemblance, observed tokens, recorded source/positions and count. Count original/decoded and readable locations according to the existing evidence, with each source labeled. Page long location lists; show progress only while truncated. Do not add “2 of 2 shown” beneath a complete two-location list. State font dependence once per section, not once per group. Relevant substitutions belong in the primary comparison; unrelated observations remain advanced.

## Dynamic grammar and errors

Handle zero, one and many explicitly. Use “No existing references will be removed,” “1 new reference will be added” and “2 new references will be added.” Never generate `target(s)`, `reference(s)`, `1 additions` or `1 removals`.

For errors, explain what failed, what the action did not change when known, and a practical next step. Never claim “no changes” when an earlier independent action changed the list. Never claim an export was saved to disk merely because a download was prepared.

Keep reference-entry errors by the reference field and backup/import/clear feedback by the backup controls. Preserve useful raw errors behind Technical error details. Use native modal safe defaults, Escape, focus restoration and existing duplicate-action guards. Single-label guidance substitutes the real normalized hostname, never guesses a suffix, and keeps Edit Hostname / Add as Entered.

Import previews are structured: mode, additions, removals, final count, pending status and complete hostname lists. “Duplicate or already saved entries” describes the actual plan count, including replacement cases; do not relabel that count as only discarded duplicates.

## Storage, updates and recovery

Distinguish loaded data, read access without a tested write, successful writes, failed writes, session-only data and protected/conflicting data. A successful write is not a permanence guarantee. Preserve the schema/key/export contract and all conflict/import safeguards. Keep local-file storage caveats separate from hosted same-origin boundaries.

The cache pill describes the **application's offline copy**, never the inspected URL. Its initial label may be neutral while verification runs; only a verified worker reply can say Offline ready. Preparing describes actual preparation, not every quick local lookup. Do not conceal failed or timed-out verification.

Keep update-check feedback separate. An update failure does not establish that a specific server was unreachable, or that new reference changes were saved. Retain the current page when an update fails. Warn that session-only references can be lost on reload; do not promise persistence for them. Reviewed activation, hash checks, scope and fixed application-resource requests remain unchanged.

General guidance says browser profiles or isolated sessions, not a Firefox-specific feature. Keep Firefox Container details in the manual checklist. Last-resort worker recovery must name only the inspector scope and warn about shared-origin data; it must not recommend clearing an entire origin as the default repair.

## Visual semantics and accessibility

| State | Visible treatment |
|---|---|
| Ordinary Unicode / informational evidence | Neutral plum/lilac; names and code points remain available. |
| Supported lookalike or hidden-character evidence | Contextual emphasis, supported by the finding; never color alone. |
| Core `alert` | Warning; retain the original level and classification. |
| Core `warn` | Caution; do not silently promote or demote it. |
| Core `note` or `info` | Information. |
| Successful reference operation | Success label and distinct treatment inside reference management, not a URL safety label. |
| Failed form/backup operation | Error label near its control; saved-data state remains explicit. |

Announce the primary result, rather than the entire diagnostic subtree. Keep independent cache and update statuses, and update text only when it changes. Associate field errors using descriptions/invalid state without moving focus unexpectedly. Preserve native disclosures, focus rings, keyboard shortcuts and modal semantics. Allow normal disclosure expansion while keeping the top offline controls in their own row. Reserve space for short update feedback; do not add a loading overlay or alter the approved title animation.

Audit long hostnames, narrow layouts, 200% zoom, reduced motion and screen-reader behavior. Distinguish source/DOM assertions from actual browser evidence; report real Firefox and accessibility limits honestly.

## Legal, privacy and final review

Preserve the full Unicode license, Unicode 18.0.0 attribution, pinned-source information, genuine IDNA/RTL limits and the absence of comprehensive phishing detection. The app requests its own fixed resources when hosted; it never requests inspected destinations. The app does not persist inspected URLs, while browsers/OS session restoration can retain form data independently. GitHub Pages paths on the same github.io hostname share a security origin; a different path or namespaced key is not storage isolation.

Review the whole rendered flow—Input → Inspection → Primary Finding → Technical Details → References → Help—after reviewing each family. Remove adjacent duplication, conflicting terms, inaccurate scope and unnecessary threat styling. Complete the source inventory and relevant regression checks before the final full-suite run. Keep simulated checks, actual browser observations and pending manual verification separate.
