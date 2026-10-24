# Current Stage 6 design principles

[AGENTS.md](AGENTS.md) is the concise standing development guidance; [AUTOMATIC_FINDINGS.md](AUTOMATIC_FINDINGS.md) defines the current results hierarchy. Preserve the single combined Blackberry & Amethyst palette. The status pill now sits at the right of the inspection-action row; updates remain below. Completed negatives are quiet and qualified, while unsupported eligibility is distinct from interrupted analysis. Useful technical summaries and advanced diagnostics have separate direct disclosures. Help covers offline popular-domain comparisons and the pinned ICANN/PRIVATE PSL.

The [Stage 6 reference and messaging review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_MESSAGING_REVIEW.md) records the later saved-reference priority correction and diagnostic consolidation. Independent collapsed disclosure defaults were already working and remain preserved. The named systematic validation requirement lives in AGENTS.md.

The [subsequent manual-acceptance review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_ACCEPTANCE_REVIEW.md) records the previous source attribution, verified Unicode identities, dual hostname labels, scoped coverage and removal of serialized state displays. Palette, typography, native disclosure defaults and decoding boundaries remain preserved.

The [focused acceptance follow-up](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_FOLLOWUP_REVIEW.md) records the preceding concise character explanations, text cues beside readable Unicode, syntax-only userinfo wording and one ordinary embedded finding per hostname. Existing style rules and native disclosure defaults remain unchanged.

The [warning hierarchy and spacing review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_PROMINENCE_REVIEW.md) records current universal secondary caution styling, uncapped security warnings, distinct information/limitations and the 22px/20px Unicode representation gap. The approved single combined Blackberry & Amethyst palette remains unchanged; there are no separate themes or switch.

The [consolidated stress review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_STRESS_REVIEW.md) records the current versioned tenant-edge structural correction and layperson refinement: one hostname finding with separate mechanism thoughts, one generic advice location, readable recovered Unicode, direct @ hostname explanations, and proportional port information. Existing palette and spacing remain preserved.

The later [HTTP/structure review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_HTTP_STRUCTURE_REVIEW.md) preserves that matching policy and refines presentation: independent HTTP cautions retain the existing compact secondary caution style beside stronger identity findings. Ordinary structural copy explains the different-domain relationship; exact PSL boundaries remain technical. No CSS, palette, spacing or disclosure changes are introduced.

The [final copy review](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/STAGE6_FINAL_COPY_REVIEW.md) records the narrow acceptance refinements: advice follows the caution evidence, short headings use a primary/consecutive-group scope label, and individual accessible names retain scope and hostname. Existing warning priority, palette, interactions and disclosure behavior remain; no new panel is added.

The versioned notes below describe historical interfaces and verification, including the earlier offline-status placement. They do not override current guidance or claim current browser acceptance.

# Version 3.1.2 complete editorial and interface refinement

The Blackberry & Amethyst appearance is preserved. The Georgia title, full ten-second animation, gradients and reduced-motion rules remain byte-identical; approved obsolete-code cleanup removes only unused base-CSS rules. No new title/page/pill animation was introduced.

The permanent [editorial guide](EDITORIAL_STYLE_GUIDE.md) and [copy audit](COPY_AUDIT.md) cover ordinary and conditional strings. Main findings explain observations before methods. Main hostname descriptors stay inline at desktop widths; narrow technical rows use smaller muted second lines. One bottom Raw Diagnostic Records disclosure preserves the original ordered records. Original text, official names, code points, mapping sequences and diagnostic levels/codes/order remain; raw technical prose moves deeper.

Ordinary Unicode has neutral lilac emphasis. A directly supported comparison character or invisible control keeps contextual caution. Character resemblance is combined in one row; UTS #39 mappings display actual sequences once, with mapped names expandable and complete character objects retained internally. ASCII observations use separated bordered groups and paged locations; completed small lists do not get redundant progress.

Reference errors sit near their field; backup/import/clear feedback sits by those controls. Visible Success/Information/Caution/Error labels avoid color-only meaning. Structured import previews show complete additions/removals/final lists. Protected-storage help distinguishes the current readable list from unreadable/different saved bytes.

Desktop offline controls occupy their own top row: updates at left, a compact violet pill at right. Update feedback occupies a full left-aligned row with a semantic dot, short title and optional explanation. Offline access details expands independently below it; semantic paragraphs use the full panel width. The initial cache label is neutral while verification runs; Preparing is reserved for installation. Update feedback has reserved space and no longer remains stuck on preparation after installation finishes. The primary result, cache and update statuses are separate live regions; full diagnostics are not live.

Final focused in-app evidence is in `tests/interface-browser-preview.json` and [FINAL_INTERFACE_REVIEW.md](https://github.com/Maximophanes/offline-url-inspector/blob/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/FINAL_INTERFACE_REVIEW.md). Earlier editorial evidence is in `tests/editorial-browser-preview.json`. Desktop document coordinates remain fixed when offline help expands; the pill measured about 106 pixels wide. Expanded character records fit at 390 and 320 pixels without horizontal overflow. Native Firefox, screen readers, 200% zoom, OS reduced motion and frame-by-frame repainting remain manual checks. The user reports the earlier persistent startup bug is fixed; this pass preserves that behavior.

The sections below are historical design notes for earlier versions, not additional claims about current native Firefox verification.

---

# Version 3.1.1 targeted corrections

The header edge came from `.masthead::before`: its `inset:-30px -14px -20px` bounded a radial gradient whose left/top edges were still nontransparent. The resulting glow was clipped by the header-sized box. That pseudo-element is removed, and the same restrained illumination is a page-level background layer that fades to transparent, with no internal header rectangle. Palette and panel layout remain.

The primary hover combined a normal gradient, a solid hover fill, a `background` transition and a one-pixel translation. V3.1.1 keeps normal/hover gradients, avoids transitioning the unsupported gradient shorthand, and removes primary hover/pressed movement. Border/shadow/color changes and inset pressed feedback remain. Three real in-app pointer-entry/exit/click cycles confirmed the same rectangle, no transform, and consistent inside/outside gradients; this is not frame-by-frame Firefox video verification.

The approved Georgia title rule and full `titleNeonFlicker` keyframes are byte-identical to V3.1.0, checked in `tests/polish-baseline.json`/`tests/polish.mjs`. New native dialog and radio controls use the established plum surfaces, violet borders, muted raspberry destructive actions, focus states and reduced-motion rules. Modal layout was observed at 1100 px and 390 px; the narrow dialog measured 354 px and stayed within the viewport.

The following design foundation is retained from V3.1.0.

## Blackberry & Amethyst design foundation

The two user-specified tracker files were read as design references only. Their captured hashes are checked during release verification; neither file was edited or included in this package. No game content, tracker logic, assets, storage, or deployment code was imported.

The inspector selectively adapts:

- Layered radial illumination over a near-black vertical background, plus subtly tinted panel gradients and hairline borders.
- Georgia-based title typography and the actual `titleNeonFlicker` timing landmarks: 0/21.6/100, 22.4, 23.2, 24.8, 25.6, 28, 29.6, 31.6, 33.6, 35.6, and 37.6 percent of a 10-second cycle.
- Stable illumination, two brief dips/recoveries, a longer low-power phase, then gradual recovery. Lilac dip colors stay brighter than the trackers’ burgundy dips to keep this utility's title readable. Only color, opacity, and shadow animate; no font/position metrics change.
- 160 ms border/shadow/color feedback, with restrained secondary-control movement, slight button hover lift/pressed feedback, and restrained disclosure hover/rotation. Native summary toggling and keyboard semantics remain intact.

The inspector uses no external fonts or assets. Palette tokens are centralized in `src/base.css`; disclosure/results details are in `src/v3.css`. A reduced-motion override disables animations, transitions, and hover transforms. Monospaced URL/character text disables ligatures and isolates direction. Warning wording and labels accompany semantic colors.

Technical hierarchy is explicit: major Reference Domains and Technical Details panels; five subordinate technical categories; smaller character and diagnostic records. No JavaScript height-animation system replaces native details. Expanded panels retain their DOM nodes; inspection does not move focus away from the input. At the last character page, a focused “Show next” control transfers focus to the first new record before disappearing.

Automated checks calculate declared text/semantic color contrast against the principal surfaces (at least 4.5:1), control-border contrast against fields (at least 3:1), and a low-power title-color sample. They check reduced-motion/focus/state rules and native disclosure structure. These are not a full accessibility certification. In-app browser previews at 1100 × 1000 and 390 × 844 had no horizontal page overflow, including a 2,072-character URL with its original text expanded. Historical screenshots remain in the [pre-cleanup preview tree](https://github.com/Maximophanes/offline-url-inspector/tree/d4c7772d6fd928746e9c2ab5c8ac3f97818312f5/preview). Actual Firefox, screen-reader, 200% zoom, OS reduced-motion, and all interactive contrast states remain manual checks.
