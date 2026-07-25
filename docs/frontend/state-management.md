# Frontend state and data flow

Choose state tools by ownership. XState and TanStack Query are not installed by
default; add them only when a concrete product feature needs them.

## Ownership

- Use React `useState` for trivial leaf-local UI state, such as an input or
  disclosure toggle.
- Use XState for editable drafts and workflows with multi-step or legal
  transitions, retries, cancellation, or concurrent work.
- Use TanStack Query for server data, cache ownership, freshness, loading,
  errors, and refetching.
- Keep values derived for rendering derived from their source rather than
  storing another copy.

Never mirror query data, status, or errors into machine context. A draft may
be initialized from loaded data, but same-resource refetches must not silently
replace a user's in-progress edits.

## Queries and workflows

When TanStack Query is installed, define each resource's key and query
function once with `queryOptions`, then reuse those options for hooks and
`QueryClient` operations.

Keep React hooks at component boundaries. If a machine owns asynchronous
timing and outcome, use an XState `fromPromise` actor: pass its `signal` to
signal-aware work, and model results with `onDone` and failures with `onError`.
Stopping that actor aborts signal-aware work and discards late outcomes. When a
server read belongs in the shared cache, call a `QueryClient` adapter from the
actor so the result and failure can drive the workflow.

Inject stable API and query clients through a flow factory closure. Do not put
service objects in machine context or recreate clients and flows on every
render.

## Component boundaries

Let parent components own query loading and error states. Mount a workflow
child only after its data is available, and key that child by resource identity
when a new resource must start a new workflow. Do not key it by an object
reference or update time, which would discard drafts during ordinary refetches.
