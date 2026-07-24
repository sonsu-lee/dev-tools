# Dev Tools Product Design

## 1. Product summary

`dev-tools` is a collection of small, focused developer utilities that run in
the browser. The first release contains one tool: **URL Component Encoder**.

The tool accepts one string and displays the exact result of JavaScript's
`encodeURIComponent()` function. Its initial use case is converting a generated
database password into a value that can safely occupy one URL component, but
the product language remains provider- and database-agnostic.

The first release has one job:

> Convert a sensitive string into an encoded URL component without storing or
> transmitting either value.

The interface copy is English. The design document and engineering
documentation may remain Korean or English.

## 2. Product principles

### Local by construction

The original string and encoded result never leave the current browser tab.
The product does not ask the user to trust a privacy promise alone; its
architecture and production security policy prevent application-initiated
network transmission after the page has loaded.

### One obvious workflow

The first screen is the tool. There is no dashboard, onboarding, account,
sidebar, tool catalog, history, or settings screen. A user can paste, inspect,
copy, and leave without learning the product.

### Honest language

The interface calls the operation **URL component encoding**, not encryption
or secret protection. It states that URL encoding is reversible and that the
encoded result is as sensitive as the original value.

### Explicit destruction

After a successful copy, the original and encoded values are immediately
removed from the UI state and DOM. A copy failure retains both values so the
user can retry or copy manually.

### Expansion without premature navigation

Future tools may be added as independent routes. The first release does not
show empty navigation or placeholder tools. A tool index is introduced only
when a second tool exists.

## 3. Scope

### Included

- A single-line string input.
- The exact `encodeURIComponent(input)` result.
- Original and encoded values masked by default.
- Momentary reveal controls for both values.
- Live, synchronous encoding as the input changes.
- An explicit copy action.
- Immediate clearing after a successful copy.
- A manual clear action.
- Clear security and reversibility notices.
- Keyboard operation, responsive layout, visible focus, and screen-reader
  status announcements.
- Production security headers and a test that verifies no network request is
  triggered by entering, revealing, encoding, copying, or clearing a value.

### Excluded

- `decodeURIComponent()` or any decode mode.
- Full URL parsing, validation, or construction.
- RFC 3986 post-processing beyond the browser's exact
  `encodeURIComponent()` output.
- AWS-, database-, or Secret Manager-specific fields and presets.
- Batch or multiline conversion.
- Conversion history, favorites, saved values, shareable URLs, accounts, or
  cloud sync.
- Server Actions, Route Handlers, application APIs, databases, or background
  jobs.
- Analytics, session replay, error-reporting SDKs, advertising, or runtime
  third-party scripts.
- A theme selector. The first release uses one dark theme.

## 4. Encoding contract

The transformation is intentionally small and auditable:

```ts
encodeURIComponent(input)
```

The product preserves the user's string exactly. It does not trim whitespace,
normalize Unicode, replace spaces with `+`, or silently repair malformed
Unicode.

Expected behavior includes:

| Original | Encoded |
| --- | --- |
| `hello world` | `hello%20world` |
| `p@ss:word` | `p%40ss%3Aword` |
| `a/b?c=d&e` | `a%2Fb%3Fc%3Dd%26e` |
| `한글` | `%ED%95%9C%EA%B8%80` |
| `AZaz09-_.!~*'()` | `AZaz09-_.!~*'()` |

`encodeURIComponent()` leaves `A-Z a-z 0-9 - _ . ! ~ * ' ( )` unchanged.
The product must not claim strict RFC 3986 encoding because that would require
additional encoding for `! ' ( ) *`.

A lone UTF-16 surrogate causes `encodeURIComponent()` to throw `URIError`.
The tool reports this as an invalid Unicode sequence and keeps the original
input unchanged. It must not call `toWellFormed()` because silently replacing
characters would alter a secret.

## 5. Security model

### Protected data

Both the original string and encoded output are treated as secrets. Encoding
is reversible and does not reduce the sensitivity of the value.

### Trust boundary

The application protects against accidental transmission or persistence by
its own code. It does not claim protection from:

- A compromised operating system or browser.
- Malicious or over-privileged browser extensions.
- Clipboard managers, remote desktop software, screen recording, or
  screenshots.
- A compromised deployment account, source repository, dependency, or build.
- Another person who can view the user's screen or clipboard.

The UI communicates this boundary without turning the primary workflow into a
security policy page.

### Data lifecycle

1. The raw value exists only in the input element and in-memory workflow
   context.
2. The encoded output is derived synchronously from the raw value. It is not
   stored as a second long-lived draft.
3. Reveal state is temporary and resets when the control loses focus, the
   document becomes hidden, or the workflow is cleared.
4. A successful clipboard write clears the raw value before displaying the
   success status.
5. `pagehide` and `visibilitychange` clear the workflow.
6. No user value is placed in a URL, query string, fragment, cookie,
   `localStorage`, `sessionStorage`, IndexedDB, cache API, service worker,
   console message, exception report, or form submission.

The application cannot reliably clear the operating system clipboard after
the user leaves. The success message therefore says that the screen was
cleared, not that every copy of the value was destroyed.

### Network and runtime policy

The production application:

- Uses HTTPS through Vercel.
- Has no Server Action, Route Handler, or application API for this tool.
- Loads no runtime asset from a third-party origin.
- Uses self-hosted application assets and fonts.
- Includes no analytics, session replay, tracking pixel, tag manager,
  advertising, or remote error-reporting SDK.
- Registers no service worker.
- Does not prefetch unrelated routes.
- Enforces a Content Security Policy on production responses.

The production application uses a per-request nonce generated by a Next.js
Proxy. The page is dynamically rendered so Next.js can apply the nonce to its
framework scripts and styles. This gives up static optimization, ISR, and PPR,
but avoids the experimental SRI implementation and provides one explicit CSP
strategy. The Proxy and dynamic render see only the initial page request; user
input remains entirely in the client after hydration.

The enforced production policy is:

```text
default-src 'self'
script-src 'self' 'nonce-{per-request}' 'strict-dynamic'
style-src 'self' 'nonce-{per-request}'
img-src 'self'
font-src 'self'
connect-src 'none'
form-action 'none'
frame-ancestors 'none'
base-uri 'none'
object-src 'none'
upgrade-insecure-requests
```

The production policy must not include `unsafe-inline`, `unsafe-eval`, wildcard
script origins, or third-party script origins. Development may use the minimum
additional same-origin, WebSocket, and `unsafe-eval` permissions required for
hot reload; those permissions must not ship to production.

Additional response headers:

```text
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

## 6. Information architecture

The first release is one responsive page:

```text
/
├── product mark: dev/tools
├── security status: Local only
├── title: URL component encoder
├── short explanation
├── original value field
├── transformation operator: encodeURIComponent()
├── encoded value field and copy action
├── inline workflow status
└── security and reversibility note
```

There is no site navigation in the first release. The product mark is not a
link to a separate empty home page.

When a second tool is implemented, `/` becomes the tool index and each tool
gets a stable route. This later change is not represented visually until the
second tool is ready.

## 7. Interaction design

### Initial state

- Focus begins in the original value field.
- Both fields are visually empty.
- Copy and clear actions are disabled.
- The `Local only` indicator is visible without interaction.
- Supporting text reads: “Processed in this tab. Nothing is stored or sent.”

### Editing

- Input is single-line and masked.
- Autocomplete, autocorrect, automatic capitalization, and spellcheck are
  disabled.
- Pasting or typing updates the encoded result immediately.
- The result is derived from the raw input and is never editable.
- Empty input produces empty output and no error.
- Leading and trailing whitespace are preserved.

### Reveal

- Original and encoded values have separate press-and-hold reveal controls.
- Releasing the pointer or key, moving focus away, hiding the document, or
  clearing the workflow restores masking.
- Reveal controls have accessible names that describe which value they expose.
- A persistent “show values” preference is not stored.

### Copy

- Copy is enabled only when a non-empty input has a valid encoded result.
- The user explicitly activates the copy action; the application never writes
  to the clipboard automatically.
- During the clipboard operation, duplicate copy actions are disabled.
- On success:
  1. The original value is cleared.
  2. The derived encoded value disappears.
  3. Reveal state resets.
  4. Focus returns to the original input.
  5. A polite live-region message reads “Copied and cleared.”
- On failure:
  1. The values remain masked and in place.
  2. The message reads “Clipboard access failed. Reveal the result to copy it
     manually.”
  3. Focus remains on the copy control while the polite live region announces
     the failure.

### Clear

- Clear removes both values by clearing their single raw source.
- Clear resets reveal, error, copy, and success states.
- Clear returns focus to the original input.

### Page lifecycle

- When the document becomes hidden or receives `pagehide`, the workflow clears
  immediately.
- Returning through browser history displays an empty workflow.

## 8. Workflow architecture

The existing repository assigns local UI state and workflows to XState.
Therefore, the encoder uses a small machine flow rather than component-owned
React state.

### Machine ownership

The machine context contains:

- The raw editable string.
- Momentary reveal flags.

The encoded value and Unicode error are derived in the machine selector or a
pure utility. Clipboard status is represented by the machine state. None of
these values is copied into machine context.

### States

```text
editing
  ├── input.changed ────────────────> editing
  ├── reveal.started / ended ───────> editing
  ├── clear.requested ──────────────> editing (empty)
  └── copy.requested ───────────────> copying

copying
  ├── clipboard success ────────────> copied (raw value cleared)
  └── clipboard failure ────────────> copyFailed (raw value retained)

copied
  ├── input.changed ────────────────> editing
  └── status timeout ───────────────> editing

copyFailed
  ├── copy.requested ───────────────> copying
  ├── input.changed ────────────────> editing
  └── clear.requested ──────────────> editing (empty)

any state
  └── document.hidden / pagehide ───> editing (empty)
```

Clipboard access is injected through a stable adapter and invoked with an
XState promise actor. Tests replace this adapter with deterministic success
and failure implementations.

### Component boundary

- The App Router page and non-interactive shell remain Server Components.
- One focused Client Component owns the machine actor and encoder UI.
- A dependency-free pure function owns the encoding contract.
- A machine-flow module owns legal transitions and the editable draft.
- A clipboard adapter owns the browser Clipboard API boundary.
- Presentational components receive derived view data and intention-revealing
  commands; they do not access a raw actor reference.

TanStack Query is not used because the feature has no server data or cache.

## 9. Visual direction

The direction combines:

- Linear's precision and low-noise dark surfaces.
- Raycast's focused, keyboard-friendly utility interaction.
- 1Password's explicit treatment of sensitive, copyable values.

The result should feel like a small precision instrument, not a marketing
landing page or a generic admin dashboard.

### Palette

| Token | Value | Use |
| --- | --- | --- |
| Void | `#08090A` | Page background |
| Panel | `#101113` | Primary work surface |
| Raised | `#17181B` | Inputs and encoded output |
| Line | `#292B2F` | Hairline boundaries |
| Text | `#F7F8F8` | Primary text |
| Muted | `#8A8F98` | Labels and supporting text |
| Signal | `#C9F05A` | Local status, focus, success, encoded markers |
| Danger | `#F97066` | Invalid input and copy failure |

Signal color is sparse. It marks facts and actions, not decoration. There are
no large gradients, colored glows, or multicolor illustrations.

### Typography

- Geist Sans is used for interface text.
- Geist Mono is used for raw values, encoded values,
  `encodeURIComponent()`, keyboard hints, and status metadata.
- Fonts are bundled and served from the application origin.
- Headings use moderate weight and tight tracking rather than oversized bold
  marketing typography.

### Layout

- A compact top bar contains `dev/tools` on the left and `Local only` on the
  right.
- The main work surface is centered with a maximum width of `760px`.
- Desktop uses one vertical column. The source and result are not placed side
  by side because horizontal space should be spent on long encoded strings.
- Mobile preserves the same order and keeps primary controls at least `44px`
  high.
- The main work surface uses a 12px radius. Inputs and buttons use an 8px
  radius. All surfaces use one-pixel borders and tonal separation instead of
  drop shadows.

### Signature element

The literal `encodeURIComponent()` operator sits between the source and
result. When the result is revealed, valid `%XX` triplets receive the Signal
color while unchanged characters remain neutral. This makes the transformation
legible without adding charts or decorative graphics.

### Motion

- Motion is limited to focus, copy, clear, and status transitions.
- Focus, hover, and status transitions use a 150ms duration.
- Clearing values is immediate; secret text does not animate across the page.
- `prefers-reduced-motion` removes non-essential transitions.

## 10. Content design

Primary UI copy:

```text
dev/tools
Local only

URL component encoder
Encode a string with JavaScript’s encodeURIComponent().

Original value
Encoded value
encodeURIComponent()

Copy encoded value
Clear

Processed in this tab. Nothing is stored or sent.
URL encoding is reversible. It is not encryption.

Copied and cleared.
Clipboard access failed. Reveal the result to copy it manually.
This string contains an invalid Unicode sequence and cannot be encoded.
```

Copy uses sentence case and names the action consistently. The product avoids
claims such as “100% secure,” “zero knowledge,” or “encrypted.”

## 11. Accessibility

- All functionality is keyboard operable.
- Focus order follows the visual order.
- Focus indicators meet WCAG contrast requirements and do not rely on color
  alone.
- Input labels remain visible; placeholders do not replace labels.
- Copy success and failure are announced through a polite live region.
- Masked values are not exposed as plain text in accessible names.
- Revealed code can wrap and remains selectable at 200% zoom.
- Text and interactive colors meet WCAG AA contrast.
- Touch targets are at least 44 by 44 CSS pixels.
- Reduced-motion and forced-colors modes receive explicit verification.

## 12. Error handling

| Condition | Behavior |
| --- | --- |
| Empty input | Empty output; copy and clear disabled |
| Valid string | Encoded output derived immediately |
| Lone surrogate | Inline invalid-Unicode message; copy disabled; input retained |
| Clipboard unavailable or denied | Values retained; manual-copy guidance shown |
| Document hidden or page leaves | Values and reveal state cleared |
| Unexpected internal error | Generic local error without logging the input |

No error message interpolates the original or encoded secret.

## 13. Verification strategy

### Encoding contract

- Unit tests cover ASCII, spaces, URL delimiters, Korean text, emoji, preserved
  characters, leading and trailing whitespace, empty input, and lone
  surrogates.
- Tests compare results directly with the expected
  `encodeURIComponent()` output.

### Workflow

- Machine tests cover editing, reveal, clear, copy success, copy failure,
  invalid Unicode, duplicate-copy prevention, `visibilitychange`, and
  `pagehide`.
- Copy-success tests prove the clipboard receives the encoded value before the
  raw source is cleared.
- Copy-failure tests prove the raw value is retained.

### Browser behavior

- An integration test types a sentinel secret and verifies that no subsequent
  fetch, XHR, beacon, WebSocket, form submission, or navigation contains the
  original or encoded value.
- A production-response test verifies the required CSP and security headers.
- A storage test verifies the sentinel does not appear in URL state, cookies,
  local storage, session storage, or IndexedDB.
- A lifecycle test verifies the value is gone after the tab is hidden or
  restored through browser history.

### Quality gates

- Formatting, linting, type checking, and production build pass.
- Keyboard-only operation covers the full workflow.
- Mobile layout is verified at `320px` width.
- Desktop layout is verified at `1440px` width.
- Reduced-motion and forced-colors checks pass.

## 14. Success criteria

The first release is ready when:

1. A user can paste any valid single-line JavaScript string and receive the
   exact `encodeURIComponent()` result.
2. A successful copy places only the encoded value on the clipboard and
   immediately removes both values from the application.
3. A failed copy retains the values and provides a manual recovery path.
4. No product action transmits or persistently stores either value.
5. Production security headers enforce the documented restrictions.
6. The security and reversibility boundaries are visible and accurate.
7. The workflow is fully operable by keyboard and works at mobile and desktop
   sizes.
8. The page follows the approved Linear-inspired precision-instrument visual
   direction without introducing navigation for unbuilt tools.

## 15. Reference set

- [Linear](https://linear.app/) — precision, hierarchy, dark surfaces.
- [Linear on Refero Styles](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1)
  — palette, typography, borders, and spacing analysis.
- [Raycast](https://www.raycast.com/) — keyboard-first utility interactions.
- [1Password Password Generator](https://1password.com/password-generator)
  — sensitive result and copy interaction.
- [SaaSFrame Copy to Clipboard](https://www.saasframe.io/patterns/copy-to-clipboard)
  — real product copy patterns.
- [SaaSFrame Text Fields](https://www.saasframe.io/patterns/text-field)
  — input and focus patterns.
- [SaaSFrame Calculators](https://www.saasframe.io/patterns/calculator)
  — compact input-to-output structures.
- [Transform.tools](https://transform.tools/) — single-purpose developer
  transformation tools.
- [CyberChef](https://gchq.github.io/CyberChef/) — transparent browser-based
  transformations.
- [MDN `encodeURIComponent()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
  — exact transformation behavior and malformed-Unicode error behavior.
- [Next.js Content Security Policy guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx)
  — nonce generation, dynamic rendering, and strict CSP integration.
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
  — defense-in-depth requirements for script, form, and framing restrictions.
