# URL component encoder contract

This document defines the behavior and security boundaries that the URL component encoder must preserve. When this contract changes, update the related implementation and tests in the same commit.

## User goal

A developer wants to paste a string and copy the same result as JavaScript's `encodeURIComponent()`. The input must not remain on the application server or in browser storage.

## Product scope

The first version transforms one single-line string.

Do not add these features:

- Decoding
- Full URL parsing or assembly
- Additional RFC 3986 transformations
- Amazon Web Services (AWS)-specific fields
- History, accounts, or synchronization
- A server-side application programming interface (API) for transformations

## Transformation behavior

The normative transformation is:

```ts
encodeURIComponent(input)
```

Do not trim the input or normalize Unicode. Do not replace spaces with `+` or additionally encode `!`, `'`, `(`, `)`, or `*`.

These examples define the expected results:

| Input | Result |
| --- | --- |
| `hello world` | `hello%20world` |
| `p@ss:word` | `p%40ss%3Aword` |
| `한글` | `%ED%95%9C%EA%B8%80` |
| `🔐` | `%F0%9F%94%90` |

If `encodeURIComponent()` throws a `URIError`, preserve the original value, disable copying, and report invalid Unicode.

## Interaction behavior

The interface follows these interaction requirements:

- Mask the original and encoded values by default.
- Use **Show values** to reveal or hide both values together.
- Use **Copy** to write the encoded result to the system clipboard without requiring the user to reveal the values.
- After a successful copy, clear the original and displayed result, then return focus to the input.
- After a failed copy, preserve the values and reveal the result for manual copying.
- Use **Clear** to clear the values and return focus to the input.
- Clear any previous success or error message when the input changes.
- Do not clear values only because the user changes tabs.

Derive the encoded result and error directly from the original value. Do not store them as separate state.

## Security and privacy boundary

Never place the original or encoded value in:

- A URL path, query, or hash
- Cookies
- `localStorage`, `sessionStorage`, IndexedDB, Cache Storage
- Network requests or WebSockets
- The console, analytics tools, or remote error collection

Input, reveal, copy, and clear operations must not create a network request that contains the original or encoded value. Allow Vercel's default Web Analytics and Speed Insights requests only when they contain neither value.

Production uses Next.js's official per-request nonce pattern with a strict Content Security Policy (CSP). Apply the nonce to `script-src` and `style-src`. Retain `connect-src 'self'`, `object-src 'none'`, and `frame-ancestors 'none'`. Other security headers include `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and a restrictive `Permissions-Policy`.

**Copy** transfers the result to the system clipboard. After the value reaches the clipboard, the browser and operating system manage its lifetime. The application cannot guarantee when the value expires or is deleted. URL encoding is not encryption.

## Accessibility requirements

The interface follows these accessibility requirements:

- Make every function available from the keyboard.
- Keep labels and focus indicators visible.
- Announce success and failure through a polite live region.
- Give each button a target size of at least `44 × 44` CSS px.
- Maintain contrast ratios of at least `4.5:1` for regular text and `3:1` for functional boundaries and focus indicators.
- Preserve functionality and information at `320` CSS px and `200%` zoom.
- Respect user preferences for motion, transparency, contrast, and forced colors.

The [design specification](../../../design.md) defines the visual requirements.

## Acceptance criteria

The implementation must satisfy these criteria:

- The reference examples match `encodeURIComponent()`.
- A successful copy removes the values.
- A failed copy or Unicode error preserves the values.
- **Show values** and **Clear** work from the keyboard.
- Network requests and browser storage never contain the original or encoded value.
- Production responses include the CSP and required security headers.
- The default axe checks and `320` CSS px checks pass.
- A Vercel deployment requires no application environment variables.
