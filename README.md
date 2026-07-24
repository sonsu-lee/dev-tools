# next-template

A single Next.js application template for small products deployed on Vercel.
The app, UI, and server entry points live in one project without a workspace
or a separate backend service.

## Stack

- Next.js canary with React Compiler
- React 19
- TypeScript 7
- StyleX
- TanStack Query
- XState
- Oxfmt and Oxlint
- pnpm 11

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- Corepack

The exact pnpm release is declared in `package.json`.

## Start

```bash
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm format
pnpm format:check
pnpm lint
pnpm lint:fix
pnpm typecheck
```

All commands run directly against the root application. There is no Turbo
task layer, workspace filter, or internal package build.

## Structure

```text
src/
├── app/       # App Router pages, layouts, providers, and server entry points
├── examples/  # Compile-checked reference implementations
└── lib/       # Shared application primitives
```

The starter page stays intentionally small. The profile flow under
`src/examples` demonstrates how TanStack Query and XState can work together
without becoming part of the default route.

## Server boundaries

Keep product code inside Next.js until a concrete requirement justifies
another boundary:

- Use Server Components for server-side reads used during rendering.
- Use Server Actions for mutations initiated by the application UI.
- Use Route Handlers for public HTTP APIs, webhooks, callbacks, and file
  responses.
- Import shared server logic directly from Server Components instead of
  calling the application's own Route Handlers over HTTP.

If an API grows enough to need shared HTTP middleware, versioned routing, or
portable handlers, mount Hono from a catch-all Route Handler such as
`src/app/api/[[...route]]/route.ts`. Hono is not installed by default.

Vercel Cron Jobs and Queues should be added when the product needs scheduled
or durable background work. They are intentionally not preconfigured in the
base template.

## Conventions

- [StyleX authoring](docs/agent-references/stylex-authoring.md)
- [Frontend state and data flow](docs/frontend/state-management.md)

TanStack Query owns server data and cache state. XState owns local UI state,
workflows, and editable drafts. Keep values derived for rendering out of both
stores when they can be computed from their source.

## Deploy

Import the repository into [Vercel](https://vercel.com/new) as a standard
Next.js project. The repository root is the application root, so no monorepo
root-directory or workspace configuration is required.
