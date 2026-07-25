# Dev Tools

[한국어](README.ko.md)

Dev Tools is a collection of focused developer utilities that run in the browser. It currently provides a URL component encoder that returns the same result as JavaScript's `encodeURIComponent()`.

URL encoding is reversible. It is not encryption.

## URL component encoder

The URL component encoder keeps values private while you work:

- Masks the input and result by default
- Processes the input and result only in the current tab's memory
- Never writes values to URLs, cookies, or browser storage and never sends them to the application server
- Clears the displayed values immediately after a successful copy
- Preserves and reveals the values after a failed copy so you can copy the result manually
- Preserves the input and reports an error when it contains Unicode that `encodeURIComponent()` cannot process

After a copy, the browser and operating system manage the system clipboard. The application cannot guarantee when the copied value expires or is deleted.

## Run the application locally

Install these prerequisites:

- Node.js `^20.19.0` or `>=22.12.0`
- Corepack

Enable Corepack, install the dependencies, and start the development server:

```bash
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify the application

Run the project checks:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

`pnpm test` builds the production application, then uses Chromium to verify functionality, clipboard failure handling, the Content Security Policy (CSP) and security headers, browser storage and network use, axe accessibility checks, and the layout at `320` CSS px.

## Repository structure

The repository separates the application, product contracts, and end-to-end tests:

```text
src/
├── app/                  # Pages, layouts, and global styles
├── features/url-encoder/ # URL encoder interface and client behavior
└── proxy.ts              # Per-request nonce and Content Security Policy

docs/
├── domains/url-encoder/contract.md # Product behavior and security contract
└── frontend/state-management.md    # Frontend state-management standard

tests/e2e/                # Playwright functional, security, and accessibility tests
```

The URL encoder uses React state because it needs only a few independent, local user interface states. Its encoded result and error remain derived directly from the input.

Consider XState when a product requirement introduces multi-step state transitions or shared workflows. Consider TanStack Query when a product requirement introduces server data, caching, or freshness management. Neither package is a default dependency; install one only for a concrete product requirement. See the [frontend state and data flow standard](docs/frontend/state-management.md).

## Security and observability boundary

In production, Next.js Proxy creates a nonce for each request and applies a strict CSP. The policy retains `connect-src 'self'`, `object-src 'none'`, and `frame-ancestors 'none'`. The application uses no external runtime assets or server-side application programming interface (API) for transformations.

The nonce requires dynamic rendering. The server provides the initial document and self-hosted static assets. After the page is ready, input, reveal, copy, and clear operations never create network requests that contain user values. Vercel's default Web Analytics and Speed Insights components send same-origin pageview and performance data, but never send the input or encoded result.

See the [URL component encoder contract](docs/domains/url-encoder/contract.md) for product and security requirements and the [design specification](design.md) for visual requirements.

## Deploy with Vercel

GitHub Actions runs formatting, linting, type checking, the build, and Playwright tests. The Vercel Git integration creates a Preview deployment for each pull request and a Production deployment after a merge to `main`. This repository does not need Vercel command-line interface (CLI) deployment jobs, tokens, or artifact handoffs.
