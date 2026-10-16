# macOS Shortcuts · open the inspector, then paste

The practical integration is a launcher. Copy the actual hyperlink destination in Firefox, Mail, or Messages; invoke the shortcut; then explicitly paste into the inspector. The shortcut never receives, reads, opens, or transmits the copied destination.

Automatic cross-application insertion into a Firefox page is not assumed. Clipboard APIs have browser-specific permission/user-activation restrictions, and opening a URL does not provide a safe standard mechanism for injecting clipboard contents into an unrelated page. Avoid AppleScript UI scripting, Accessibility/Automation permissions, clipboard listeners, browser extensions, and query/fragment transport merely to save a paste. See [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

## Hosted launcher

After deployment and manual Firefox verification:

1. Open **Shortcuts** on macOS and create a new shortcut named **Open URL Inspector**.
2. Add the **URL** action. Enter the literal fixed address `https://USERNAME.github.io/offline-url-inspector/`, replacing `USERNAME` with your GitHub account. Do not put a clipboard variable, Shortcut Input, query, or fragment into this field.
3. Add **Open URLs**, using the output of the URL action. This opens the inspector in the default browser. If you want Firefox, make Firefox the default browser or open the fixed bookmark in Firefox. Do not assume the action can inject text into it.
4. In the shortcut's details, choose **Add Keyboard Shortcut** and select an available combination that does not conflict with another app/system shortcut.
5. Copy a link destination, invoke the shortcut, focus the inspector's link field, press **⌘ V**, and then **⌘ Return** (or Ctrl Enter on Windows/Linux). The inspected destination remains text.

The two actions contain only the fixed inspector address. Do not add **Get Clipboard**, **Open Clipboard**, **Run JavaScript**, or “open the copied URL.” No permissions beyond ordinary launching/pasting are part of this workflow. There is no automatic clipboard read on page load; the user initiates paste.

Apple documents [URL and Open URLs actions](https://support.apple.com/en-sg/guide/shortcuts-mac/apd68802640c/mac) and [keyboard-shortcut setup](https://support.apple.com/en-ie/guide/shortcuts-mac/-apd163eb9f95/mac). UI names can vary by macOS release. The shortcut was not built or executed in the user's Shortcuts app during this task; verify the fixed URL before using it. No signed/importable `.shortcut` file is supplied because this simple setup needs only these two standard actions.

## Standalone launcher and fallback

Keep `standalone/Offline_URL_Inspector.html` in a stable folder. In Shortcuts, use a **File** action to select that specific local HTML file, followed by **Open File**. Select Firefox in Open File if the installed action offers an app choice; otherwise set the file's Finder **Get Info → Open with** application to Firefox, or open it directly from Firefox. Assign a keyboard shortcut through the shortcut's details.

The selected file is the inspector, never the copied destination. Do not use clipboard text as a file/URL input. If your installed Shortcuts actions do not offer reliable local opening, keep a Firefox bookmark to the local inspector instead of introducing privileged automation. Copy the destination, open the bookmarked inspector, paste, and inspect. This also works when hosted caches have been removed or the network is unavailable.

Hosted app visits can appear in ordinary browser history as the fixed inspector URL. The workflow never puts the inspected URL in that history URL. OS clipboard history/managers, browser session restoration, and user-selected screenshots/exports are outside the inspector's control.

## Version 3.1 / 3.1.1 inspection shortcut

Command Return/Enter on macOS and Control Enter on Windows/Linux now work in either inspection field and ordinary non-editing page regions. The handler does not take over reference-domain editing, import review, dialogs, unrelated form fields/contenteditable areas, repeated/composing keystrokes, or unrelated modifier combinations. The launcher itself is unchanged: it opens only the fixed inspector URL, then you paste explicitly.
