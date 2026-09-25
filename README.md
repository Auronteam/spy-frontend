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
- shadcn/ui (style "new-york", baseColor "zinc" — see `src/index.css`)
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

## Features

- **Add profile** (Profiles page) — creates a Vision profile with a correct
  Android antidetect fingerprint (device type, WebGL/Canvas/Audio/Client
  Rects noise) via the backend's `POST /vision/profiles`, instead of doing
  it by hand in the Vision desktop app. Optional proxy (`ip:port:user:pass`,
  registered in Vision automatically) and cookies (paste JSON or drop the
  account's cookie file) fields cover the rest of what manual setup used to
  need — see `spy` repo's `docs/profile-setup.md` for what "correct" means
  and `docs/api.md` for the endpoint contract.
  Components: `src/pages/profiles/components/add-profile-dialog.tsx`,
  `cookies-dropzone.tsx`; hook: `src/pages/profiles/hooks/use-create-profile.ts`.
- **Proxy country** (Profiles page) — the Proxy column and the edit dialog
  show each profile's proxy as flag + country code + `ip:port` (e.g.
  "🇵🇱 PL · 130.49.19.157:62497"), with the full country name in a tooltip.
  The country is the proxy's exit country from Vision's own geo check, sent
  by the backend as `proxy.country`; it's `null` until Vision has checked the
  proxy, shown as "country unknown". Component:
  `src/pages/profiles/components/proxy-info.tsx`; flag/name helpers:
  `src/lib/country.ts`.

## Status

Past the initial scaffold (Phase 1) — routing, auth, and the core pages
(Profiles, Content, Logs, Categories, Settings stub) are built and in use.
See the `spy` repo's migration plan for what's still outstanding.
