<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# studio-space

Next.js 16 App Router + React 19 + Tailwind v4 + shadcn `base-nova` (Base UI primitives).
Currently a create-next-app shell (one page at `src/app/page.tsx`) plus a generated component library under `src/components/ui`. There is no backend, test suite, database, or env setup yet; `README.md` is still the untouched create-next-app text.

## Commands

Use npm (`package-lock.json` is the only lockfile; there is no pnpm/yarn workspace).

- `npm run dev` — Turbopack dev server on `:3000`. Also regenerates the managed block above and `next-env.d.ts`.
- `npm run lint` — ESLint flat config. It currently exits 1 with two pre-existing `react-hooks/set-state-in-effect` errors: `src/components/ui/carousel.tsx:98` and `src/hooks/use-mobile.ts:14`. Don't attribute them to your change unless you touched those files.
- `npm run build` — production build (Turbopack); it also runs TypeScript.
- `npx tsc --noEmit` — quick typecheck; there is no `typecheck` script.
- Suggested verification: `npm run lint` → `npx tsc --noEmit` → `npm run build`.
- If the build warns about a `package-lock.json` in a parent directory, that is Turbopack workspace-root detection. It is harmless unless module resolution actually breaks.

## Framework configuration

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`.
- With Cache Components, data is dynamic by default: put uncached/dynamic reads under `<Suspense>` or the dev overlay/build will flag a blocking route. Use `"use cache"` for cached work. Do not add `runtime` route exports — Cache Components requires the Node.js runtime.
- Typed routes are enabled. Use generated global types such as `LayoutProps<"/">` / `PageProps` (see `src/app/layout.tsx`) instead of hand-writing route prop types. Run dev or build after adding routes so `.next/types` regenerates.
- Tailwind v4 is CSS-first: there is no `tailwind.config.*`. Theme tokens live in `src/app/globals.css`, and Tailwind is compiled through the `@tailwindcss/turbopack` loader configured in `next.config.ts`. Add new tokens there with `@theme inline`.
- React Compiler is on; do not add `useMemo`/`useCallback` by default.

## Component conventions

- `src/components/ui/*` is shadcn registry output for the `base-nova` style. Prefer `npx shadcn@latest add <name>` (shadcn 4.23 is installed) over hand-copying upstream components.
- Import `cn` directly from the `cn` package. `src/lib/utils.ts` only re-exports it, unlike stock shadcn's `@/lib/utils` convention.
- Primitives come from `@base-ui/react/*`, plus `@shadcn/react/*` for newer pieces such as `questionnaire` and `message-scroller`. The local pattern is: export function wrappers, set `data-slot`/`data-*` state attributes, define variants with `cva`, and merge `className` through `cn`.
- Generated component files use no semicolons and double quotes, while create-next-app files use semicolons. No formatter/Prettier config exists — match the file you are editing and avoid repo-wide reformatting.

## Custom code

- Syntax highlighting lives in `src/lib/highlighter.tsx`: shiki core with the JavaScript regex engine and lazily loaded languages. To support a language, add it to `languages` and, when needed, `aliases`. Styling relies on the `--shiki-light` / `--shiki-dark` CSS variables and `dark:` classes.
- `src/hooks/use-highlighted-code.ts` tokenizes streamed code incrementally using shiki grammar state. Preserve the incremental and trailing-line behavior when changing code-block rendering.
