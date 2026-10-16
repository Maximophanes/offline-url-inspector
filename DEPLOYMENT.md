# GitHub Pages setup · prepare now, publish after approval

All files are prepared locally. No repository was created, modified, or pushed. This project must stay independent of every existing repository and GitHub Pages project.

## Local preview first

From the extracted V3.1.1 project directory:

```sh
python3 tools/build.py
python3 tools/serve.py
```

Open `http://127.0.0.1:8765/offline-url-inspector/` in Firefox. This loopback server deliberately simulates the intended project path, serves only the application resources, and does not log request/query strings. Stop with Control-C. Do not use `file://` to test the hosted service worker; use the standalone edition for direct local files.

The automated release checks verified real HTTP responses, MIME types, hashes, and relative worker paths on this server. Registration, caching, updates, and failures were tested in simulations. Real Firefox offline operation remains a manual verification step; a local server response is not proof of successful live GitHub Pages deployment.

## Create the separate repository when approved

1. In the intended GitHub account, create a **new, empty repository named `offline-url-inspector`**. Do not use an existing checkout or existing project. Public Pages availability depends on repository visibility and the account's GitHub plan.
2. Copy **the contents of `site/`** into the new repository root: `index.html`, `sw.js`, and the hidden `.nojekyll`. Do not upload the containing `site` folder as an extra path level. Finder hides dotfiles; Command-Shift-Period reveals `.nojekyll`.
3. Commit the complete matching file set to the repository's `main` branch. Keep this full source ZIP separately as the maintenance source. The source/data/tests do not need to be public for static serving.
4. In that repository's **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save. Follow the current [GitHub publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
5. After GitHub reports a successful deployment, open **`https://USERNAME.github.io/offline-url-inspector/`**, replacing `USERNAME` with the account. Preserve the trailing slash. Wait for **Offline ready**; then run [FIREFOX_CHECKLIST.md](FIREFOX_CHECKLIST.md).

This guide intentionally does not provide commands that might operate in an unrelated current repository. The only deployment files are the three files in `site/`. Do not commit personal reference exports, copied links, credentials, browser profiles, local paths, or temporary test output. Deployment file scans passed; there is no new repository history to audit because no repository has been created.

## Path and hosting contract

| Item | Required value |
|---|---|
| Public project path | `/offline-url-inspector/` |
| Worker URL | `/offline-url-inspector/sw.js` |
| Worker scope | `/offline-url-inspector/` |
| Cached asset | `/offline-url-inspector/index.html` only |
| Standalone fallback | Downloaded `standalone/Offline_URL_Inspector.html` |

Do not register `/sw.js`, use a root scope, or copy an existing project's worker. Scope guards refuse the wrong project path. No `Service-Worker-Allowed` header is needed for a worker inside its own directory. HTTPS is required for hosted worker use; browsers make an exception for loopback development. See [MDN service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

Both HTML editions contain all their own analysis code, styles, and Unicode data. Hosted registration uses a relative worker URL, with exact scope/path checks. The worker performs only a fixed application-asset fetch. Initial page/worker loading and later update checks are ordinary hosting requests; pasted destinations and reference lists are not sent to GitHub.

GitHub project repositories share the `USERNAME.github.io` origin. Their localStorage is not isolated by project path. Namespacing avoids accidental key collisions only. The inspector never clears an entire origin or touches sibling projects. A dedicated hostname is an optional future privacy improvement; it is not required for V3.1.

The package includes meta CSP hashes but no arbitrary response-header configuration. Do not assume a `_headers` file, meta `frame-ancestors`, or an unconfigured reporting endpoint will add protections on GitHub Pages. See [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for enforceable policies and hosting limits. No backend, analytics, external fonts, third-party runtime libraries, PWA installation, or remote Unicode API is required.

Use [UPDATES_AND_ROLLBACK.md](UPDATES_AND_ROLLBACK.md) for every later release. Deploy the matched HTML and worker together; never hand-edit generated code without rebuilding its hashes.
