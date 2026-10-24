# Stage 6 UX: native Firefox before and after

**Evidence portability.** The former local-only image, preview and evidence links below are now plain-text private archive/member references with verified hashes. These artifacts are not distributed in the public repository and are not public downloads. Historical observations retain their original scope.

The same five synthetic URLs were inspected in actual Firefox 158.0.1 at 1100px and 100% zoom. Technical Details was collapsed. Heights measure the result card, not the full page. Only presentation changed; the analyzed data and pinned reference snapshots are unchanged.

| Case | Before primary | After primary | Result height before → after | Reduction |
|---|---|---|---|---|
| ordinary | No unusual hostname characters identified | Check this is the address you intended | 876 → 272 px | 69.0% |
| ascii | No unusual hostname characters identified | Possible lookalike website | 974 → 307 px | 68.5% |
| unicode | Internationalized hostname | Possible lookalike website | 974 → 307 px | 68.5% |
| structural | No unusual hostname characters identified | Misleading hostname structure | 993 → 330 px | 66.7% |
| nested | No unusual hostname characters identified | Possible lookalike inside this URL | 1254 → 484 px | 61.4% |

The embedded fixture deliberately includes repeated parents, credentials and a token. The ordinary result retains the important lookalike, sign-in-text warning, concise counts and one depth limitation; the synthetic secrets remain concealed.

## Original ASCII lookalike

Before: a reassuring character-only primary sits above the supported specific warning.

Before: rnicrosoft.com — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/283-before-ascii.png` (SHA-256 `99f7989e6ca4b381711bfbc50a7fc11f17fd802dcf8a8d8fda9561036e28ec0a`)

After: the specific caution and rn/m explanation are the primary result.

After: rnicrosoft.com — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/275-after-standalone-ascii.png` (SHA-256 `c45d36f9f24f7ede1ec4d79733e5b8b4d50d350cfb9011a11abcbaa8bdec6810`)

## Ordinary address

Before: ordinary address — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/285-before-ordinary.png` (SHA-256 `80e87c26c1723dcb045756e61f9cd6c54e9b08c1f1a50e0127498784cfbde8cf`)

After: ordinary address — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/277-after-standalone-ordinary.png` (SHA-256 `8cdb03748b8ad2dbf0b842af2d757808172de8396c57a5ab11f60a9f180e9b44`)

## Repeated nested addresses

Before: nested addresses — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/284-before-nested.png` (SHA-256 `085fd2aecc53f060940c20e9fc553a0a5ff0adc1ff9278b51d986bff25d276aa`)

After: nested addresses — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/276-after-standalone-nested.png` (SHA-256 `cb5ee3b1b3fa30a93de4d8a5cf3e5e629e13b45c34fa8b32c80e918f120926c3`)

## Native narrow and actual zoom evidence

Both file and loopback editions pass real 200% and 400% Firefox tab zoom and 320px reflow. At 1280px physical viewport, measured innerWidth/devicePixelRatio were 640/2 and 320/4. This uses Firefox tab zoom, not CSS scaling. A temporary zoom-only helper was confined to the disposable profile and uninstalled after each operation.

After: native Firefox 200 percent zoom — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/281-after-standalone-zoom-2.png` (SHA-256 `c0bc41c85d972f087129e792d452578b408ad9cf29a2e76ae9608af9714fda21`)

After: native Firefox 400 percent zoom — private evidence `referenced-visual-evidence.tar.gz:visual-evidence/282-after-standalone-zoom-4.png` (SHA-256 `2ec4b4bf106247769dfb410574780a7465e36b4692fd7b3315ec0334f946e423`)

Screenshots are retained outside the repository next to the local preview. They use synthetic fixtures; no user browsing history or real private URL was inspected. File paths/hashes and the complete 28-check native result are in `tests/ux-firefox-results.json`. VoiceOver and physical-device acceptance were not performed.

The local preview is Offline_URL_Inspector.html — private evidence `historical-local-artifacts.tar.gz:historical-artifacts/009-Offline_URL_Inspector.html` (SHA-256 `8b21c2fd0e6d1ec611abb5502be026cd51593917da478ff3e85a5dbc5ccbbf05`). Exact URL: `file:///private/tmp/oui-stage6-ux-2mqphape/preview/standalone/Offline_URL_Inspector.html`.
