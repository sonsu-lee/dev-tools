# Dev Tools design

The initial screen is a focused developer utility that transforms one string with JavaScript's `encodeURIComponent()`. The [URL component encoder contract](docs/domains/url-encoder/contract.md) is the normative source for product behavior.

## Product principles

The interface and implementation follow these principles:

- Complete input, review, copy, and clear operations on one screen
- Never send the input to a server, URL, browser storage, or log
- Never describe URL encoding as encryption
- Do not create navigation or a dashboard for tools that do not exist

## Interface layout

The initial screen uses this content and control order:

```text
dev/tools                                      Local only

URL component encoder
Encode a string with JavaScript’s encodeURIComponent().

Original value
[ masked input ]

Encoded value
[ masked result ]

[ Show values ]                         [ Clear ] [ Copy ]

[ status ]

Your input is processed in this tab and is not sent to our server
or browser storage. Copying places the encoded value on your
system clipboard.

URL encoding is reversible. It is not encryption.
```

- The first version accepts one single-line string.
- Mask the original and encoded values by default.
- One **Show values** control reveals or hides both values.
- Copying does not require revealing the values.
- After a successful copy, clear the values and return focus to the input.
- After a failed copy, preserve the values and explain how to copy manually.
- Do not clear values only because the user changes tabs.

## Visual direction

Use Linear's precise dark interface as the foundation. Apply Apple Liquid Glass material principles only to secondary surfaces. Do not copy Apple UI Kit assets, icons, components, or the San Francisco font.

The color and surface tokens are:

| Token | Value | Use |
| --- | --- | --- |
| Void | `#08090A` | Page background |
| Panel | `#101113` | Work panel |
| Raised | `#17181B` | Input and result |
| Decorative line | `#292B2F` | Decorative divider |
| Control boundary | `#666970` | Control boundary |
| Text | `#F7F8F8` | Primary text |
| Muted | `#8A8F98` | Secondary text |
| Signal | `#C9F05A` | Focus and primary action |
| Danger | `#F97066` | Error |
| Glass fill | `rgba(23, 24, 27, 0.72)` | Secondary surfaces |

Apply glass only to **Local only**, **Show values**, **Clear**, and status surfaces. Keep the main panel, input, result, **Copy** button, focus indicator, and error surfaces opaque.

Use only this effect in environments that support it:

```css
backdrop-filter: blur(16px) saturate(115%);
```

Without blur, the interface must preserve the same meaning, contrast, focus indication, and functionality. Do not use nested backdrop filters, WebGL, Canvas, sensors, cursor-tracking reflections, or JavaScript refraction effects.

## Accessibility requirements

The interface targets Web Content Accessibility Guidelines (WCAG) 2.2 Level AA:

- Maintain a contrast ratio of at least `4.5:1` for regular text.
- Maintain a contrast ratio of at least `3:1` for control boundaries and focus indicators.
- Show focus with a `2px` Signal outline and a `2px` gap.
- Give every button a target size of at least `44 × 44` CSS px.
- Keep the input label visible.
- Allow users to select the result in its revealed state.
- Announce success and failure with `role="status"` and never rely on color alone.
- Prevent horizontal scrolling at `320` CSS px.
- Preserve all content and functionality at `200%` zoom.

Use opaque default surfaces for these user preferences:

- `prefers-reduced-transparency: reduce`
- `prefers-contrast: more`
- `forced-colors: active`
- `prefers-reduced-motion: reduce`

## Design references

- [Linear](https://linear.app/)
- [Raycast](https://www.raycast.com/)
- [1Password Password Generator](https://1password.com/password-generator)
- [Apple Human Interface Guidelines: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple Design Resources License](https://developer.apple.com/support/downloads/terms/apple-design-resources/Apple-Design-Resources-License-20230621-English.pdf)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/)
