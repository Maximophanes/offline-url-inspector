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

Automated checks calculate declared text/semantic color contrast against the principal surfaces (at least 4.5:1), control-border contrast against fields (at least 3:1), and a low-power title-color sample. They check reduced-motion/focus/state rules and native disclosure structure. These are not a full accessibility certification. In-app browser previews at 1100 × 1000 and 390 × 844 had no horizontal page overflow, including a 2,072-character URL with its original text expanded. Screenshots are in `preview/`. Actual Firefox, screen-reader, 200% zoom, OS reduced-motion, and all interactive contrast states remain manual checks.
