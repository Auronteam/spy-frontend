---
name: react-local
description: Activate project-local conventions for spy-frontend (folder structure, routing, error handling, API/DTO layer, TanStack Query, styling)
---

You are working inside the **spy-frontend** codebase. Apply these
project-specific conventions strictly, in addition to the general
`/react-developer` rules.

The guideline is loaded in your context:
- **PROJECT_PATTERNS** (`.claude/guidelines/PROJECT_PATTERNS.md`) — project
  structure, file naming, routing (`react-router-dom` v7 + route guards),
  error handling (`apiFetch`, `ApiError`, Sentry), the API layer (`src/api/*`,
  selective DTO+adapter pattern), TanStack Query usage and known gaps, and
  styling (Tailwind + shadcn "new-york"/zinc, the Spy Console design system).

For general, project-agnostic React/TypeScript rules (components, hooks,
services, styling), use `/react-developer` instead.
