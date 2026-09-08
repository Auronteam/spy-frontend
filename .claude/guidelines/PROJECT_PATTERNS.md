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

# Architecture

Same layering as `AI_GUIDELINES.md` (components render, hooks manage
state/effects, services/api do data logic), applied here as:

- **Pages** (`src/pages/<feature>/<feature>-page.tsx`) — the route target.
  Composes the feature's hooks and components; does not fetch data or hold
  business logic itself.
- **Feature hooks** (`src/pages/<feature>/hooks/`) — state, effects, and
  TanStack Query usage for that feature. Call into `src/api/*`, never `fetch`
  directly.
- **Feature components** (`src/pages/<feature>/components/`) — presentational
  pieces local to one feature (a table row, a filter bar). Promoted to
  `src/components/` only once actually reused across features.
- **`src/api/<resource>/`** — the data-fetching layer. One file per backend
  resource, thin wrapper functions over `apiFetch`/`apiFetchText`/
  `apiFetchRaw` (see Error Handling below). Components and hooks never call
  `fetch()` themselves.
- **`src/lib/`** — framework-agnostic utilities (`cn`, cookie/token helpers,
  route constants, the `apiFetch` wrapper itself, error classes).

---

# Project Structure

```
src/
├── pages/<feature>/          # one folder per route: profiles, content, logs, categories, settings, login
│   ├── <feature>-page.tsx    # route target — the only file imported by router.tsx
│   ├── components/           # feature-local components
│   ├── hooks/                # feature-local hooks (TanStack Query lives here)
│   ├── types.ts              # feature-local domain types (if any)
│   └── utils/                # feature-local pure helpers (if any)
├── api/<resource>/           # data-fetching per backend resource (index.ts)
│   └── dto.ts / adapters.ts  # only where the wire shape needs adapting — see API System below
├── components/                # shared, cross-feature UI
│   ├── ui/                   # shadcn primitives — treat as generated, edit sparingly
│   ├── nav.tsx                # TopNav
│   └── stat-card.tsx          # etc. — anything used by 2+ features lands here
├── components/errors/         # PageError, QueryPageGuard
├── contexts/                  # React Context providers (auth-context.tsx)
├── router/                    # createBrowserRouter config, ProtectedRoute/GuestRoute, DashboardLayout
├── providers/                  # app-level providers mounted once in App.tsx (QueryProvider, SentryInit)
├── lib/                       # framework-agnostic utilities
│   ├── api-fetch.ts           # the fetch wrapper — see Error Handling
│   ├── client-auth.ts         # cookie token read/write/clear, Authorization header building
│   ├── routes.ts              # ROUTES const — every path lives here, never a raw string literal
│   ├── utils.ts                # cn(), date/size formatters
│   └── errors/                # ApiError, Sentry lazy wrapper, notifyError
└── config/                    # env var access (BACKEND_BASE from VITE_API_URL)
```

**File naming:** kebab-case for every filename, components included
(`stat-card.tsx`, `log-files-list.tsx`) — matches the `spy` monorepo's own
rule. **Known gap:** the hooks under `pages/profiles/hooks/` and
`pages/content/hooks/` are still camelCase (`useProfileActions.ts` etc.) —
inherited as-is from the Next.js migration. Don't copy that pattern into new
files (new hooks are kebab-case, e.g. `use-log-stream.ts`); renaming the old
ones is a separate cleanup, not something to do incidentally while touching
unrelated code.

Component/props/hook rules (arrow functions, named exports, `<ComponentName>Props`,
150-line guidance, etc.) are the general `AI_GUIDELINES.md` rules — nothing
project-specific to add there.

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
} as const;
```

**Guard components** (`src/router/`) replace what used to be Next's
`middleware.ts` + a server-side `getServerAuth()` — both are now purely
client-side:

- **`GuestRoute`** — wraps `/login`. If already authenticated, redirects to
  `/profiles` (admin) or `/content` (user); otherwise renders the route.
- **`ProtectedRoute`** — wraps everything else. Redirects to `/login` if
  unauthenticated. Takes an optional `allowedRoles` prop for role-gating; the
  router nests it twice — once bare (any authenticated user, currently just
  `/content`) and once with `allowedRoles={['admin']}` around
  `/profiles`, `/logs`, `/categories`, `/settings`.
- **`DashboardLayout`** — the shared chrome (`TopNav` + `<Outlet/>`) for every
  authenticated route.
- **`RootRedirect`** — the `index` route element; sends to `/profiles` or
  `/content` by role, replacing the old root `page.tsx`'s redirect logic.

Both guards read auth state from `useAuth()` (`src/contexts/auth-context.tsx`)
and render nothing but a `<Spinner/>` while the initial cookie-verify request
is in flight (`isLoading`).

---

# Error Handling System

- **`ApiError`** (`src/lib/errors/api-error.ts`) — the one error type all API
  failures normalize to. Carries `status`/`code`/`details` parsed from the
  backend's `{ error: { code, message, details } }` contract. `isApiError()`
  checks `instanceof` first, then falls back to a structural `__apiError`
  marker (protects against the class getting duplicated across bundle
  chunks, where `instanceof` across different module copies can lie).
- **`apiFetch` / `apiFetchText` / `apiFetchRaw`** (`src/lib/api-fetch.ts`) —
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

**Known gap:** no `queryCache.onError` hook yet — a throw inside a `queryFn`
that isn't a network/`apiFetch` failure (a bug in the function itself) isn't
currently reported to Sentry. Planned, not built.

---

# API System

- One file per backend resource under `src/api/<resource>/index.ts`, named
  exports for each operation (`fetchPosts`, `login`, `verifyToken`,
  `createCategory`, ...). Components and hooks call these — never `fetch()`
  or `apiFetch()` directly from a component/hook.
- Every function goes through `apiFetch`/`apiFetchText`/`apiFetchRaw` — see
  Error Handling above for what that buys automatically (auth header,
  timeout, 401 handling, Sentry reporting).
- **DTO + adapter, applied selectively, not blanket:** where the backend
  entity genuinely returns snake_case that would otherwise leak into a
  domain type, there's a `dto.ts` (wire shape) + `adapters.ts` (mapper
  function) pair — e.g. `src/api/db/dto.ts`'s `PostDto` →
  `src/api/db/adapters.ts`'s `mapPostDtoToPost` → the camelCase `Post` type
  in `src/pages/content/types.ts`. Where there's no case mismatch (e.g.
  `Category` — `slug`/`title`/`protected`, already flat), the wire shape
  *is* the domain type, used as-is — don't invent a DTO layer for a
  resource that doesn't need one just for consistency.
- **No Zod / runtime response validation.** Deliberate choice, not an
  oversight — this is a small app with one team controlling both frontend
  and backend, so a full schema-validation layer is overhead without much
  payoff. The DTO type itself is the single point of control if a backend
  field changes; if a resource's contract turns out to need real runtime
  validation later, that's a deliberate decision to revisit, not a default.
- Auth token: read from a plain (non-`httpOnly`) cookie via
  `getClientAuthToken()`/`setClientAuthToken()`/`clearClientAuthToken()`
  (`src/lib/client-auth.ts`) and sent as an explicit `Authorization` header —
  never relied on as a browser-auto-included request cookie, since the
  backend is a different origin from the frontend.

---

# Caching System (TanStack Query)

- `QueryClientProvider` is set up once, in `src/providers/query-provider.tsx`,
  mounted at the `App.tsx` root above the router (so route guards and every
  page can use `useQuery`/`useMutation`). Current defaults: only
  `mutations.onError` → `notifyError` (see Error Handling).
- **Query keys are inline arrays at each call site** right now (e.g.
  `['posts', page, pageSize, filters]`, `['vision', 'profiles', folderId]`) —
  there is **no `queryKeys` factory yet**. Don't assume one exists; don't
  invent one for a single call site either — this is a known, deliberate
  gap (planned hardening pass), not something to silently fix mid-feature.
- **`skipToken` for conditionally-disabled queries**, not `enabled: false` +
  a non-null assertion on the query param — e.g. `useVisionProfiles`,
  `useProfileLogFiles`. This is the established style here; keep using it
  for any new query that depends on a value that might not exist yet.
- **Known gap:** no explicit `retry`/`staleTime`/`refetchOnWindowFocus`
  defaults — the app runs on TanStack's stock settings (3 retries with
  backoff, refetch on window focus), which don't really suit an internal
  tool where several pages already poll on their own schedule. On the list
  for the same hardening pass as the queryKeys factory.

---

# Styling Principles

- Tailwind + shadcn/ui, style **"new-york"**, `baseColor` **"zinc"**
  (`components.json`) — CSS variables defined in `src/index.css` (`:root` for
  light, `.dark` for dark), matching a design mockup built for this app
  ("Spy Console" branding). Don't introduce a different base color or hand-roll
  colors outside the CSS variable palette.
- `cn()` (`src/lib/utils.ts` — `clsx` + `tailwind-merge`) for any conditional
  or merged `className`; never string-concatenate classes manually.
- Reusable design-system pieces beyond shadcn's stock primitives:
  - **`StatCard`** (`src/components/stat-card.tsx`) — the label + big number
    (+ optional colored dot) card pattern used for summary stats rows.
  - **`Badge`'s `success`/`info` variants** (`src/components/ui/badge.tsx`) —
    green/blue status pills, added on top of shadcn's stock
    default/secondary/destructive/outline set for domain status states
    (e.g. "Connected"/"Running").
- No inline styles, no arbitrary Tailwind values without a comment explaining
  why (inherited from the general `AI_GUIDELINES.md` rule — nothing looser
  here).
