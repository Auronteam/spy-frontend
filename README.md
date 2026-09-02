# spy-frontend

Vite + React 19 + TanStack Query + shadcn/ui. Replaces the Next.js frontend that
used to live in the `spy` monorepo (`apps/web`) — see that repo's migration plan
for the full rationale and phase breakdown.

Work happens on feature branches merged via pull request — `main` is not
pushed to directly.

## Stack

- Vite, React 19, TypeScript (strict)
- `react-router-dom` for routing
- `@tanstack/react-query` for server state
- shadcn/ui (style "new-york", baseColor "neutral" — matches the old frontend's
  design tokens exactly, see `src/index.css`)
- `@sentry/react`, `sonner` for error tracking / toasts

## Getting started

```bash
cp .env.example .env.local   # set VITE_API_URL to your backend
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — typecheck + production build
- `pnpm typecheck` — typecheck only
- `pnpm lint` / `pnpm lint:fix`
- `pnpm format` / `pnpm format:check`

## Status

Scaffold only (Phase 1 of the migration plan) — dependencies, build tooling,
and design tokens are in place. Routing, auth, and the actual pages come in
follow-up branches.
