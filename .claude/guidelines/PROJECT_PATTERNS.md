# Project-Specific Patterns

These rules describe conventions actually established in this codebase
(`spy-frontend`). They complement the general `AI_GUIDELINES.md` — both sets
are mandatory. Where this file says a system isn't built yet, that's a real
gap, not an oversight — don't assume it exists just because it would be
natural to have it.

`spy-frontend` is a Vite + React 19 SPA, the Cloudflare-hosted replacement
for the `spy` monorepo's old Next.js frontend (`apps/web`). No SSR/SSO — the
whole app lives behind a login, so a plain client-rendered SPA is enough.
Deployed to Cloudflare Workers (static assets + `wrangler.jsonc`), talking to
the `spy` monorepo's backend on Hetzner over plain `fetch`.

---

# Language

English only, everywhere in this repository — code, identifiers, comments,
commit messages, and any committed docs/markdown (`docs/*.md` included). No
Russian, even in something that starts as a scratch note if it ends up
committed. This is about what lands in the repo, not the chat with the user.

**Exception:** the user-facing FAQ page content (`src/pages/faq/faq-page-data.ts`
and the FAQ page subtitle) is written in Ukrainian on purpose — it's the one
place addressed to the team in their language. Identifiers and everything
else in that feature stay English.

Communication with the user is the opposite: every report, plan, summary,
question, and answer in the chat MUST be written in Russian, always.

---

# Architecture

Same layering as `AI_GUIDELINES.md` (components render, hooks manage
state/effects, services/api do data logic), applied here as:

- **Pages** (`src/pages/<feature>/<feature>-page.tsx`) — the route target.
  Composes the feature's hooks and components; does not fetch data or hold
  business logic itself.
- **Feature hooks** (`src/pages/<feature>/hooks/`) — state, effects, and
  TanStack Query usage for that feature. Call into `src/api/*`, never `fetch`
  directly. Promoted to `src/hooks/` only once actually reused across
  features (e.g. `useVisionFolders`/`useVisionProfiles`, used by both
  Profiles and Logs).
- **Feature components** (`src/pages/<feature>/components/`) — presentational
  pieces local to one feature (a table row, a filter bar). Promoted to
  `src/components/` only once actually reused across features.
- **`src/api/<resource>/`** — the data-fetching layer. One file per backend
  resource, thin wrapper functions over `apiFetch`/`apiFetchText`
  (see Error Handling below). Components and hooks never call
  `fetch()` themselves.
- **`src/lib/`** — framework-agnostic utilities (`cn`, cookie/token helpers,
  route constants, the `apiFetch` wrapper itself, error classes).

---

# Project Structure

```
src/
├── pages/<feature>/          # one folder per route: profiles, content, logs, categories, settings, faq, login
│   ├── <feature>-page.tsx    # route target — the only file imported by router.tsx
│   ├── components/           # feature-local components
│   ├── hooks/                # feature-local hooks (TanStack Query lives here)
│   ├── types.ts              # feature-local UI types (if any)
│   └── utils/                # feature-local pure helpers (if any)
├── api/<resource>/           # data-fetching per backend resource (index.ts)
│   ├── types.ts              # domain types used only by this resource and its one feature page
│   └── dto.ts / adapters.ts  # only where the wire shape needs adapting — see API System below
├── components/                # shared, cross-feature UI
│   ├── ui/                   # shadcn primitives — treat as generated, edit sparingly
│   ├── nav.tsx                # TopNav
│   └── stat-card.tsx          # etc. — anything used by 2+ features lands here
├── components/errors/         # PageError, QueryPageGuard
├── hooks/                     # shared, cross-feature hooks — same "2+ features" rule as components/
├── contexts/                  # React Context providers (auth-context.tsx)
├── router/                    # createBrowserRouter config, ProtectedRoute/GuestRoute, DashboardLayout, session-verify error screen
├── providers/                  # app-level providers mounted once in App.tsx (QueryProvider, SentryInit)
├── types/                     # shared domain types used by 2+ features (profile.ts, auth.ts, ...)
├── lib/                       # framework-agnostic utilities
│   ├── api-fetch.ts           # the fetch wrapper — see Error Handling
│   ├── client-auth.ts         # cookie token read/write/clear, Authorization header building
│   ├── routes.ts              # ROUTES const — every path lives here, never a raw string literal
│   ├── utils.ts                # cn(), formatDate()
│   └── errors/                # ApiError, Sentry lazy wrapper, notifyError
└── config/                    # env var access (BACKEND_BASE from VITE_API_URL)
```

**File naming:** kebab-case for every filename, components included
(`stat-card.tsx`, `log-files-list.tsx`) — matches the `spy` monorepo's own
rule. **Known gap:** some hooks under `pages/profiles/hooks/`,
`pages/content/hooks/` and `src/hooks/` are still camelCase
(`useScannerActions.ts`, `useVisionFolders.ts` etc.) —
inherited as-is from the Next.js migration. Don't copy that pattern into new
files (new hooks are kebab-case, e.g. `use-log-stream.ts`); renaming the old
ones is a separate cleanup, not something to do incidentally while touching
unrelated code.

Component/props/hook rules (arrow functions, named exports, `<ComponentName>Props`,
150-line guidance, etc.) are the general `AI_GUIDELINES.md` rules. The one
project-specific addition: hooks are declared with `export function` and an
explicit result `type` (e.g. `UseScannerActionsResult`).

**Docs vs. audit notes:** `docs/` is for human-readable project
documentation, committed to git. Audit findings, followups, and other
working notes for us are not project docs — they live in `.claude/audits/`,
which is gitignored and never committed.

---

# Routing System

`react-router-dom` v7, via `createBrowserRouter` (`src/router/router.tsx`) —
not a JSX `<BrowserRouter>` tree. Every path is a constant in `ROUTES`
(`src/lib/routes.ts`, `as const`); route elements and any `navigate()`/`Link`
call use `ROUTES.x`, never a string literal.

```ts
export const ROUTES = {
    login: '/login',
    profiles: '/profiles',
    content: '/content',
    logs: '/logs',
    categories: '/categories',
    settings: '/settings',
    faq: '/faq',
} as const;
```

**Guard components** (`src/router/`) replace what used to be Next's
`middleware.ts` + a server-side `getServerAuth()` — both are now purely
client-side:

- **`GuestRoute`** — wraps `/login`. If already authenticated, redirects to
  `/profiles` (admin) or `/content` (user); otherwise renders the route.
- **`ProtectedRoute`** — wraps everything else. Redirects to `/login` if
  unauthenticated. Takes an optional `allowedRoles` prop for role-gating; the
  router nests it twice — once bare (any authenticated user, currently
  `/content` and `/faq`) and once with `allowedRoles={['admin']}` around
  `/profiles`, `/logs`, `/categories`, `/settings`.
- **`DashboardLayout`** — the shared chrome (`TopNav` + `<Outlet/>`) for every
  authenticated route.
- **`RootRedirect`** — the `index` route element; sends to `/profiles` or
  `/content` by role, replacing the old root `page.tsx`'s redirect logic.

**Page routes are lazy-loaded** via the route `lazy` option, keeping the
pages' named exports: `lazy: () => import('@/pages/x/x-page').then(m => ({
Component: m.XPage }))` (in `NAV_ITEMS` and for `/login` in `router.tsx`).
Guards and `DashboardLayout` stay eager; the top-level routes set
`HydrateFallback: FullScreenSpinner` for the initial chunk load.

Both guards read auth state from `useAuth()` (`src/contexts/auth-context.tsx`)
and render `FullScreenSpinner` while the initial cookie-verify request is in
flight (`isLoading`). The stored token is cleared only when `/auth/verify`
answers 401 (the backend's response for every invalid-token case); any other
failure (5xx, network error, timeout) keeps the token and sets `verifyError`,
and both guards then render `SessionVerifyError` (`src/router/`) with a Retry
that re-runs the verification via `retry()` from the context.

---

# Error Handling System

- **`ApiError`** (`src/lib/errors/api-error.ts`) — the one error type all API
  failures normalize to. Carries `status`/`code`/`details` parsed from the
  backend's `{ error: { code, message, details } }` contract. `isApiError()`
  checks `instanceof` first, then falls back to a structural `__apiError`
  marker (protects against the class getting duplicated across bundle
  chunks, where `instanceof` across different module copies can lie).
- **`apiFetch` / `apiFetchText`** (`src/lib/api-fetch.ts`) —
  the single chokepoint for every backend call. Handles, in one place:
  - attaching `Authorization: Bearer <token>` from the cookie
    (`authHeaders()`)
  - a 30s request timeout via `AbortController`, merged with any
    caller-supplied `signal` through `AbortSignal.any([...])` (so e.g.
    TanStack Query's own cancellation still works)
  - 401 → `forceLogout()` (clears the cookie, hard-redirects to `/login`) and
    returns a Promise that never resolves, so the caller can't render a stale
    UI state before the redirect actually happens
  - parsing the error body into `ApiError` and reporting it to Sentry via
    `captureError`, **except** statuses in `SENTRY_EXCLUDED_STATUSES` (401,
    403, 422, 503 — expected states, not backend bugs) or a call's own
    `silentErrorStatuses` option
- **`notifyError`** (`src/lib/errors/notify-error.ts`) — the user-facing side:
  `toast.error(...)`, with a friendlier message for 403. `QueryProvider`'s
  `mutations.onError` default calls this for every mutation automatically —
  a mutation only needs its own `onError` if it wants to do something
  *besides* the toast.
- **`QueryPageGuard` + `PageError`** (`src/components/errors/`) — the shared
  loading/error wrapper for a page-level query, instead of repeating
  `isError ? <PageError/> : children` on every page.
- **Sentry** (`src/lib/errors/sentry.ts` + `sentry-factory.ts`) — lazy-loaded
  behind a dynamic `import()` so `@sentry/react` (~45KB gzip) stays out of the
  main bundle; `initSentry()` is called once from `SentryInit`
  (`src/providers/`), mounted at the `App.tsx` root. Never import
  `sentry-factory.ts` directly.

`QueryProvider` also sets a `queryCache.onError` hook: a throw inside a
`queryFn` that isn't a network/`apiFetch` failure (a bug in the function
itself, not caught by `isApiError`) is reported to Sentry via `captureError`.

---

# API System

- One file per backend resource under `src/api/<resource>/index.ts`, named
  exports for each operation (`fetchPosts`, `login`, `verifyToken`,
  `createCategory`, ...). Components and hooks call these — never `fetch()`
  or `apiFetch()` directly from a component/hook.
- Every function goes through `apiFetch`/`apiFetchText` — see
  Error Handling above for what that buys automatically (auth header,
  timeout, 401 handling, Sentry reporting).
- **DTO + adapter, applied selectively, not blanket:** where the backend
  entity genuinely returns snake_case that would otherwise leak into a
  domain type, there's a `dto.ts` (wire shape) + `adapters.ts` (mapper
  function) pair — e.g. `src/api/db/dto.ts`'s `PostDto` →
  `src/api/db/adapters.ts`'s `mapPostDtoToPost` → the camelCase `Post` type
  in `src/api/db/types.ts`. Where there's no case mismatch (e.g.
  `Category` — `slug`/`title`/`protected`, already flat), the wire shape
  *is* the domain type, used as-is — don't invent a DTO layer for a
  resource that doesn't need one just for consistency.
- **No Zod / runtime response validation.** Deliberate choice, not an
  oversight — this is a small app with one team controlling both frontend
  and backend, so a full schema-validation layer is overhead without much
  payoff. The DTO type itself is the single point of control if a backend
  field changes; if a resource's contract turns out to need real runtime
  validation later, that's a deliberate decision to revisit, not a default.
- **Where domain types live:** a type used only by one resource and its
  single feature page goes in `src/api/<resource>/types.ts` (`Post`,
  `LogFile`); a type used by 2+ features goes in `src/types/<name>.ts`
  (`Profile`, `VisionFolder`); purely UI/feature-local types stay in
  `src/pages/<feature>/types.ts`. Nothing outside `src/pages/` imports from
  `src/pages/`.
- Auth token: read from a plain (non-`httpOnly`) cookie via
  `getClientAuthToken()`/`setClientAuthToken()`/`clearClientAuthToken()`
  (`src/lib/client-auth.ts`) and sent as an explicit `Authorization` header —
  never relied on as a browser-auto-included request cookie, since the
  backend is a different origin from the frontend.

---

# Caching System (TanStack Query)

- `QueryClientProvider` is set up once, in `src/providers/query-provider.tsx`,
  mounted at the `App.tsx` root above the router (so route guards and every
  page can use `useQuery`/`useMutation`). Defaults: `mutations.onError` →
  `notifyError` (see Error Handling); queries get `refetchOnWindowFocus:
  false`, `staleTime: 30_000`, `gcTime: 5 * 60_000`, and `retry` that skips
  retrying 4xx `ApiError`s (client mistakes won't fix themselves) but retries
  once on everything else (5xx/network) — tuned for an internal tool where
  several pages already poll on their own schedule.
- **`queryKeys` factory** (`src/lib/query-keys.ts`) — every `queryKey` goes
  through it (`queryKeys.vision.profiles(folderId)`,
  `queryKeys.logs.content(profileId, file)`, ...), grouped by resource. Don't
  reintroduce inline array keys at a call site; add a new entry to the
  factory instead, following the existing per-resource shape.
- **`mutationKeys` factory** (same file) — per-profile keys for the scanner
  and Vision run/stop mutations. Their pending flags are read from the
  mutation cache (`useIsMutating({ mutationKey }) > 0`) rather than the
  mutation's own `isPending`, so a table row that remounts mid-action (paging,
  search) still shows it as in progress. `onSuccess` handlers return the
  invalidation promise so the mutation stays pending until dependent queries
  have refetched.
- **`skipToken` for conditionally-disabled queries**, not `enabled: false` +
  a non-null assertion on the query param — e.g. `useVisionProfiles`,
  `useProfileLogFiles`, `useSelectedProfileScanner`. Use `null` as the single
  "nothing selected" value for such params. This is the established style here; keep using it
  for any new query that depends on a value that might not exist yet.

---

# Styling Principles

- Tailwind + shadcn/ui, style **"new-york"**, `baseColor` **"zinc"**
  (`components.json`) — CSS variables defined in `src/index.css` under
  `:root` (light only; there is no dark theme), matching a design mockup built
  for this app ("Spy Console" branding). Don't introduce a different base color
  or hand-roll colors outside the CSS variable palette.
- **Status tokens** — `success`/`info`/`warning`, each with `DEFAULT`,
  `foreground`, `strong`, `muted` and `border` shades (CSS variables in
  `src/index.css`, mapped in `tailwind.config.ts`): e.g. `bg-success`,
  `text-success-strong`, `bg-success-muted`, `border-success-border`. Use
  these instead of raw palette classes like `bg-green-600`/`text-green-700`.
- `cn()` (`src/lib/utils.ts` — `clsx` + `tailwind-merge`) for any conditional
  or merged `className`; never string-concatenate classes manually.
- Reusable design-system pieces beyond shadcn's stock primitives:
  - **`StatCard`** (`src/components/stat-card.tsx`) — the label + big number
    (+ optional colored dot) card pattern used for summary stats rows.
  - **`Badge`'s `success`/`info`/`warning` variants**
    (`src/components/ui/badge.tsx`) — status pills built on the status
    tokens, added on top of shadcn's stock
    default/secondary/destructive/outline set for domain status states
    (e.g. "Connected"/"Running").
  - **`Button`'s `success` variant** (`src/components/ui/button.tsx`) — a
    solid `bg-success` button for positive actions.
- No inline styles, no arbitrary Tailwind values without a comment explaining
  why (inherited from the general `AI_GUIDELINES.md` rule — nothing looser
  here). Prefer the nearest standard scale value; when a mockup value has no
  scale equivalent (grid templates, viewport-based dialog sizes), add a named
  key under `theme.extend` in `tailwind.config.ts` (e.g. `grid-cols-cards`,
  `max-h-log-viewer`, `aspect-thumb`) instead of an inline `[...]` value.
