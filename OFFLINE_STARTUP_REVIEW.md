# Version 3.1.2 offline startup and reload investigation

## Current editorial follow-up

The user now reports that the earlier 3.1.2 persistent offline-startup problem is fixed. Preserve that implementation. General app guidance now refers to browser profiles/isolated sessions; Container-specific instructions remain in the Firefox checklist.

The previous transition assigned Preparing while local registration/cache lookup was pending. Initial markup and this lookup now use neutral **Offline access**; only actual installation uses Preparing. **Offline ready still requires a strict verified reply.** No timer, cache verification or scope boundary was weakened. A separate feedback-state fix clears stale “Preparing the new version…” after installation completes. Readiness and update feedback are idempotent, avoiding repeated identical announcements.

The independent disclosure expands below top-row update controls/pill. Document-coordinate browser measurements show no control repositioning; normal browser scrolling to clicked controls is separate. Current in-app cached new-tab/reload, offline analysis and failed-check observations with the local server stopped are recorded in `tests/editorial-browser-preview.json`. They do not establish full disconnection or Firefox frame timing. Hosted tests cover 56 cases / 159 assertions, including startup deadlines, unsaved-reference consent and transition/announcement states.

Worker lifecycle/integrity remains exact; only its plaintext 503 recovery prose changed. Restoring that single literal reproduces its original whole-file hash.

## Confirmed application defect and scope of the diagnosis

In Version 3.1.1, `HostedOffline.start()` awaited `serviceWorker.register()` before querying any cache. It used `getRegistration()` only if registration rejected. A registration promise that remained pending therefore prevented both local registration discovery and every `GET_CACHE_STATUS` message. The initial “Preparing offline access…” text had no deadline. `refresh()` also retried recursively if worker references changed while replies were pending.

A controlled probe evaluated the original `HEAD` source with an existing valid registration and a deliberately delayed registration promise. Before that promise settled, it made one registration call, zero existing-registration lookups and zero cache-status requests; preparation remained unchanged. Resolving the promise allowed “Offline ready.” This reproduces an application ordering defect. **It does not establish which operation actually stalled in the user's Firefox session:** no Firefox lifecycle trace was captured here.

MDN documents that [registration can issue a worker-script network request and recommends checking an existing registration first](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#description). [getRegistration()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/getRegistration) retrieves local registration information for a document URL; the app additionally checks the exact returned scope.

## Implemented fix

- Discover the existing exact `/offline-url-inspector/` registration first. When present, verify its active worker directly without a new `register()` call. An active registration does not need a document controller to answer.
- A controller with the exact application worker URL can answer while registration discovery is delayed. Neither registration existence nor controller presence alone establishes readiness; only a strict boolean `ready: true` status reply does. The unchanged worker verifies its complete cached HTML hash before replying.
- Bound discovery to 1.5 seconds, registration/update operations to 6 seconds, and status messages to 3 seconds. Close message ports on completion/failure. A browser operation can still complete after its UI timeout; its late promise result cannot assert success. Real worker/controller lifecycle events can trigger rediscovery and verification.
- Coalesce overlapping refreshes, with at most two snapshot attempts per refresh instead of recursive status polling. Installation preparation has a 12-second display deadline, followed by a bounded cache check. Late successful activation can still restore verified readiness.
- Attach online/controller/worker listeners and update controls before awaiting discovery. An uncached loaded page can retry preparation after returning online. Known-offline startup skips registration/update network work. Existing online return visits also reuse the local registration.
- Keep update-check feedback separate from cache status. Failed/timed-out checks release the busy button and preserve the current page and do not change references already saved in browser storage. Session-only changes are not promised saved. Reviewed-update confirmation, waiting-worker identity checks, activation timeout, and the worker's independent verification before activation remain.

These deadlines do not cancel browser-managed downloads or guarantee scheduling while a tab is suspended. No recurring polling loop or destination fetch was added. Containers/profiles retain their own browser-controlled storage and registrations; the app never bridges them. An uncached offline context normally cannot load the app at all.

## Reload/flicker findings

The 3.1.1 template hid the update panel and offline disclosure until asynchronous startup completed. Revealing them introduced a real application-controlled layout change. Version 3.1.2 renders hosted controls in the initial HTML, places them beneath the shortcut, uses a content-sized pill and reserves feedback space, and aligns the control tops. The disabled update button becomes usable after fixed-context validation. This removes that source of startup movement without hiding the document.

Source review found no automatic startup focus/scroll operation, background-height animation, external font/image loading, or unconditional service-worker reload. The only automatic reload remains behind explicitly requested update activation. Initial reference rendering does not inspect or persist a pasted URL. Native scroll restoration was left intact; no `scrollRestoration = 'manual'`, forced scroll, overlay, artificial delay or loading animation was added. [Browser scroll restoration](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration) and full-document repaint can affect repeated reloads; attributing the reported Firefox effect to either remains a hypothesis.

The approved Georgia title rules, complete ten-second neon keyframes, page gradients and reduced-motion override are byte-identical. Reconstructing the document starts its CSS animation again; the intentional title flicker is retained. No tracker code, storage, worker, or game functionality was copied.

Actual Codex in-app browser observations are recorded in `tests/v312-browser-preview.json`: cached startup/new tab with the server stopped, repeated settled reloads, unchanged references, failed-update recovery, responsive layout and stable inspection-card height across update feedback. These are **not Firefox**, full internet-disconnection tests, Container-isolation tests, or frame-by-frame flicker measurements. No claim is made that every Firefox reload flash has been eliminated. Follow `FIREFOX_CHECKLIST.md` before approving publication.
