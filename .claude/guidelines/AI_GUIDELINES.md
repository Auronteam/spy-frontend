# AI Guidelines

These instructions are mandatory for AI assistant working with this repository.

If there is a conflict between generated code and these rules,
these rules have priority.

AI assists but does not make architectural or business decisions.

# Architecture Principles

- The codebase follows clear responsibility boundaries:
  - Components render UI and orchestrate behavior.
  - Hooks manage state, side effects, and reusable logic.
  - Services contain pure, synchronous business and data-processing logic.
- Simple, local logic MAY remain in a component if it stays readable and isolated.

# Component Rules

## Component Definition

- Components MUST be defined as arrow functions.
- Components MUST be exported as named exports (`export const`).
- Exception: page-level components (route targets) MAY use `export default` if required by the router.
- The React namespace MUST NOT be imported.
- Only required named imports are allowed (e.g. `Fragment`, `memo`, `ReactNode`).

## Component Responsibility

- One component = one responsibility.
- Components MUST NOT combine unrelated concerns (e.g. UI rendering + data fetching + modal control).

## Props and Typing

- If a component accepts props, an interface MUST be declared.
- The interface:
    - is declared in the same file
    - is placed above the component
    - is named <ComponentName>Props
- Props MUST be destructured directly in the function parameters.
- React.FC MUST NOT be used.
- children MUST be explicitly typed if used.

## Component Size

- A component file SHOULD NOT exceed 150 lines (including JSX).
- Exceeding this limit is a signal to refactor, not an instruction to split automatically.

## Logic Inside Components

- A component MAY contain:
    - up to 1–2 simple hooks (e.g. useState)
    - minimal, non-interacting logic.
- Logic MUST be extracted into a custom hook if:
    - hooks interact with each other
    - useEffect contains non-trivial logic
    - the logic is reusable or affects component behavior significantly

## Data Files

- Static, default, or mock data MUST be placed in a separate file.
- The file MUST:
    - be located next to the component,
    - be named <ComponentName>Data.ts.

## Data Fetching

- Components MUST NOT perform data fetching directly.
- API calls and side effects MUST be handled in hooks and/or services.

# Styling & Tailwind Usage Rules

## Tailwind & Existing Styles Only
- Use only Tailwind utility classes; inline styles and custom CSS inside components are not allowed.
- Always use project design tokens (colors, radii, spacing) and existing global utility classes.
- Do not hardcode values or create new style combinations without necessity. Any exception must include an explanation.

## Consistent & Readable
- Use standard Tailwind scales for spacing, sizing, and typography.
- Keep class lists clear, logical, and maintainable; split by purpose if needed (layout, spacing, colors, typography).
- Avoid long or arbitrary class combinations unless justified.

## No New Styles Without Reason
- Do not introduce new colors, shadows, hover effects, animations, or other design changes independently.
- Any deviation from existing styles must include a clear explanation.

# Custom Hooks Rules

## Purpose & Constraints
- Hooks manage local state, side effects, and reusable logic.
- Leave simple, component-specific effects in the component; extract complex, reusable, or interdependent effects to hooks.
- Do not directly modify global component state outside the hook.
- API calls and side effects must go through services.
- Effects must be predictable, self-contained, and must not modify the DOM or UI directly.
- Hooks may return an object containing state, functions, and error/loading indicators as needed.

## Naming
- Hook names must start with `use` and clearly describe their purpose.
- One hook should have one responsibility.

## Reuse, Composition & Readability
- Extract logic used in multiple components to hooks.
- Hooks should be composable, focused, and handle one responsibility.
- Keep hooks concise (ideally under 150 lines) with related state and effects grouped logically.
- Split into multiple hooks if effects or states are complex or interdependent.

# TypeScript & Typing Rules

## Strict Typing Principles
- All variables, state, function parameters, and return values must be explicitly typed.
- Usage of `any` is not allowed.
- Use union types or enums for fixed sets of values instead of generic `string` or `number`.
- Generics must be properly typed and applied consistently.

## Type Assertions (`as`)
- `as X` MUST NOT be used to force a type past a mismatch the compiler is
  correctly flagging. A cast that isn't backed by an actual runtime check or a
  real narrowing is a red flag, not a fix.
- Before writing `as X`, check whether real narrowing already gets you there for
  free — a type guard/predicate (`(x): x is T => ...`), `instanceof`, a
  discriminated union, or plain control-flow narrowing (e.g. an `if`/ternary on
  a literal union) — and use that instead of asserting.
- If a value's shape genuinely cannot be proven statically (parsed JSON,
  `unknown` from an external response, a library's overly generic type), validate
  the shape at runtime before treating it as that type — don't assert blindly
  over unvalidated data.
- If the same cast keeps showing up at a call site because the surrounding
  function's own parameter/return type is wider than what's actually ever
  passed, narrow that type at the source instead of casting around it every time
  it's used.
- Narrow exceptions are fine when there is truly no alternative — e.g. a generic
  helper returning `undefined as T` for a documented no-body/204 response, or a
  library's own generic type system forcing an assertion (react-hook-form's
  `Path<T>` for a field name it can't statically know). Keep these minimal and
  obvious from context; don't use them as precedent for casts that do have a
  real narrowing available.

## Component Props
- Component props must always be defined using an `interface`.
- The interface must be declared inside the component file.
- The interface name must follow the pattern `<ComponentName>Props`.
- Component props interfaces are never reused, even if their structure looks identical.
- Child components follow the same rule: `<ChildComponentName>Props`.

## Type vs Interface
- `interface` is used only for component props.
- `type` is used for all other type definitions (unions, aliases, utility types).

## File Structure
- Component-specific types (e.g. props) stay inside the component file.
- Shared types that are actually reused (e.g. for hooks, services, API models) may be extracted:
  - to a local `types.ts` near the feature, or
  - to a global `src/types/` directory.

## Additional Guidelines
- Use `readonly` and optional properties (`?`) where appropriate.
- Avoid unnecessary nesting; split complex structures into smaller, readable type aliases.


# Service Rules

## Purpose & Purity
- Services contain pure, synchronous business and data-processing logic.
- Services must be framework-agnostic and independent from UI and React.
- Service functions must be pure:
  - do not mutate input arguments,
  - always return new values,
  - produce the same output for the same input.

## Constraints
- Services MUST NOT:
  - perform asynchronous operations,
  - make API calls,
  - access React, hooks, or the DOM,
  - read from or write to external state (localStorage, cookies, environment variables),
  - cause side effects.

Note: these constraints apply to `apps/web` services. `apps/backend` does not have React/DOM concerns, but the same purity/single-responsibility spirit applies to its `services/` layer — see the `monorepo-standards` skill for backend-specific layering rules.

## Function Definition
- Services MUST export named functions using `export function`.
- Arrow functions are not allowed in services.

## Responsibilities & Reuse
- Services handle data transformation, validation, formatting, and calculations.
- Complex or non-trivial processing logic MUST be extracted from components into services.
- Services should be created only when there is a clear need; do not extract shared services prematurely.
- If a service function is used only by one feature, it SHOULD be placed in a `service.ts` file next to that feature.

## TypeScript
- All service functions must be fully typed.
- Input parameters and return values must be explicitly defined.
- Usage of `any` is not allowed.
- Hooks must be fully typed with clear interfaces for parameters and return values.

