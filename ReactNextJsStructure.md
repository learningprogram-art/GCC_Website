# Next.js Project Structure Standard

Official folder structure and coding rules for every Next.js (App Router) project we build. Written for developers and AI agents.

**Stack:** Next.js 15+ (App Router), React 19, TypeScript (strict), Tailwind CSS, shadcn/ui, Lucide icons, React Bits (animated components), TanStack Query, Zustand, Zod, React Hook Form, next-intl, Sonner (toasts).

---

## Starter prompt (paste at the start of an AI session)

> Follow `NextJsStructure.md` exactly. Stack: Next.js App Router + TypeScript + Tailwind + shadcn/ui + Lucide + React Bits. Files in `app/` are thin route files that only render a page component from `features/`. Pages are Server Components by default; add `"use client"` only to the smallest interactive component. Data is read in server code through `data/repositories` and `data/services` (marked `server-only`); mutations use Server Actions in `features/<f>/actions`. Put every new file where the decision table says and never create a new top-level folder under `src/`. No hardcoded colors, strings or URLs; no private secret in `NEXT_PUBLIC_*`. If code already exists, migrate it using "Converting existing code" without changing behavior.

---

## 1. Architecture at a glance

```
app/**/page.tsx  (thin route)  ->  features/<feature>/pages   composition, Server Component by default
                                          |
                     +--------------------+--------------------+
                     v                                         v
       server: data/repositories, data/services     client: features/<f>/hooks + store
       (`server-only`, read secrets)                 (interactive state only)
                     |                                         |
                     v                                         v
                data/models (Zod schema + types)      features/<f>/actions  ("use server" mutations)
```

Reads happen on the server. Interactive UI is a small client component. Mutations go through Server Actions (or `app/api` route handlers for webhooks and third parties).

Dependency direction is one-way: `features -> data -> lib`. `data/`, `lib/` and `components/ui|shared` never import from `features/`.

---

## 2. Folder structure

```
project-root/
├── next.config.ts
├── middleware.ts                # auth redirect, locale detection
├── tsconfig.json  components.json  eslint.config.mjs  .prettierrc
├── .env.example                 # documents every variable; real values in .env.local
├── public/                      # static files served as-is: favicon, manifest, robots, og images
├── tests/                       # mirrors src/ paths
└── src/
    ├── app/                     # ROUTES ONLY. no business logic
    │   ├── layout.tsx           # <html>, fonts, providers, global overlays
    │   ├── globals.css          # -> imports styles/globals.css
    │   ├── not-found.tsx  error.tsx  loading.tsx
    │   ├── [locale]/            # only if URL-based i18n is used
    │   │   ├── (auth)/
    │   │   │   ├── login/page.tsx
    │   │   │   └── onboarding/page.tsx
    │   │   └── (main)/
    │   │       ├── layout.tsx               # shell with navigation
    │   │       ├── page.tsx                 # home
    │   │       ├── kundli/page.tsx
    │   │       ├── cart/page.tsx
    │   │       └── orders/[orderId]/page.tsx
    │   └── api/                 # route handlers: webhooks, third-party callbacks
    │       └── payment/webhook/route.ts
    ├── features/
    │   └── <feature>/
    │       ├── pages/
    │       │   └── <page-name>/
    │       │       ├── <page-name>.page.tsx     # Server Component by default
    │       │       └── components/              # used ONLY by this page, grouped by role
    │       │           ├── sections/  sheets/  headers/  banners/  forms/  cards/
    │       ├── components/                      # shared by several pages of THIS feature
    │       ├── hooks/                           # use-<name>.ts (client-side queries/UI logic)
    │       ├── store/                           # <name>.store.ts (Zustand, UI state only)
    │       ├── actions/                         # <name>.actions.ts ("use server" mutations)
    │       ├── schemas/                         # <name>.schema.ts (Zod form/action schemas)
    │       └── index.ts
    ├── data/
    │   ├── models/<domain>/<name>.model.ts
    │   ├── repositories/<domain>/<name>.repository.ts     # import "server-only"
    │   └── services/
    │       ├── http-client.ts                             # import "server-only"
    │       └── <provider>/
    │           ├── endpoints.ts
    │           └── <name>.service.ts
    ├── services/                # platform integrations
    │   ├── firebase/  (firebase-client.ts, firebase-admin.ts)
    │   ├── payment/   (payment-service.ts, razorpay-service.ts)
    │   └── analytics/
    ├── components/
    │   ├── ui/                  # shadcn/ui primitives (generated, keep close to upstream)
    │   ├── shared/              # our reusable components used by 2+ features, by kind
    │   │   ├── buttons/  inputs/  cards/  banners/  profile/  policy/  layout/
    │   │   └── feedback/        # skeleton, empty-state, error-state, loader
    │   └── animations/
    │       ├── react-bits/      # vendored React Bits components (do not edit; "use client")
    │       └── <name>.tsx       # our wrappers: reduced-motion + tokens
    ├── providers/               # client providers mounted in app/layout.tsx
    │   ├── app-providers.tsx  query-provider.tsx  theme-provider.tsx  toaster.tsx
    ├── hooks/                   # global, feature-agnostic client hooks
    ├── lib/
    │   ├── utils.ts             # cn() and tiny generic helpers
    │   ├── constants/  exceptions/  formatters/  validators/  storage/  helpers/
    ├── config/
    │   ├── env.ts               # Zod-validated env (server and client parts separated)
    │   ├── site.ts              # site name, urls, metadata defaults
    │   └── query-client.ts
    ├── i18n/
    │   ├── routing.ts  request.ts
    │   └── messages/  (en.json, hi.json, hinglish.json)
    ├── styles/
    │   └── globals.css          # Tailwind import, @theme tokens, shadcn CSS variables
    ├── assets/                  # imported by code (hashed by the bundler)
    │   ├── animations/  fonts/  icons/  images/  svg/
    │   └── content/<page-or-feature>/
    └── types/                   # global.d.ts
```

Use `public/` only for files that must keep a fixed URL. Everything else is imported from `assets/` so Next.js can optimize it.

---

## 3. Worked example: the Kundli feature

```
src/app/[locale]/(main)/kundli/page.tsx          # export default: <KundliPage />   (3 lines)
src/features/kundli/
├── pages/
│   └── kundli/
│       ├── kundli.page.tsx                      # Server Component: awaits kundliService.fetch(...)
│       └── components/
│           ├── sections/   chart/  overview/  dasha/  gochar/  ashtakvarga/  sade-sati/
│           ├── ai/         prashna/             # "use client" widgets (chat, interactive chart)
│           └── common/
├── hooks/use-kundli-ai.ts                       # client chat mutation
├── store/kundli.store.ts                        # selected chart tab, selected profile id
├── actions/save-chart.actions.ts                # "use server"
├── schemas/birth-details.schema.ts
└── index.ts
src/data/models/explore/kundli.model.ts
src/data/services/astro-backend/(endpoints.ts, kundli.service.ts)
src/data/repositories/profile/profile.repository.ts
```

Other feature folders in this product: `auth`, `home`, `shop` (cart, orders, order-details), `profile`, `reports`, `settings`, `notifications`.

---

## 4. Layer rules

### 4.1 `app/` (routing only)
- A `page.tsx` renders one component from `features/<f>/pages`: `export default function Page() { return <KundliPage />; }`. Params and search params are read there and passed down as props.
- `layout.tsx` mounts providers, fonts, global overlays. Route groups `(auth)` and `(main)` give each area its own layout.
- Every route segment with data has a `loading.tsx` (skeleton) and, where useful, an `error.tsx`. Use `notFound()` for missing resources.
- `app/api/**/route.ts` is only for webhooks and third-party callbacks. Internal mutations use Server Actions.

### 4.2 Server vs client components
- Everything is a Server Component by default (pages, sections, static widgets).
- Add `"use client"` only to the smallest component that needs state, effects, event handlers or browser APIs. Never mark a whole page as client.
- Server Components fetch data by calling repositories/services directly with `await`. Pass plain serializable props into client components.
- Client components read server data passed as props; use TanStack Query only for data that must refresh or paginate on the client.

### 4.3 `data/models`
- The Zod schema is the source of truth: `export const kundliSchema = z.object({...}); export type Kundli = z.infer<typeof kundliSchema>;`
- Provide `fromApi(raw)` and `toApi(model)` when shapes differ. Parse every external response.

### 4.4 `data/repositories` and `data/services` (server only)
- Start each file with `import "server-only"` so a client import fails at build time.
- Repositories own database access; services own external REST APIs. Endpoint paths are constants in `endpoints.ts`.
- `http-client.ts` sets shared headers (API key from server env, `Accept-Language`), checks `response.ok` before `json()`, and throws an `AppError` on failure.
- Batch writes are chunked (Firestore: 500 max, use 400).
- Use `fetch` caching options deliberately: `next: { revalidate: N }` for slow-changing data, `cache: "no-store"` for user-specific data.

### 4.5 `features/<feature>/actions`
- `"use server"` files. Each action: validate input with the Zod schema, check the session, call a repository/service, `revalidatePath` / `revalidateTag`, return a typed result `{ ok: true, data } | { ok: false, error }`. Never throw raw errors to the client.

### 4.6 `features/<feature>/hooks` and `store`
- Only for client components. Hooks compose TanStack Query and the feature store. UI-only state (selected tab, draft, chat messages) is Zustand; server data is never copied into a store.
- Forms: React Hook Form + the Zod schema from `schemas/`, submitting to a Server Action.

### 4.7 `components/`
- `ui/`: shadcn/ui primitives added with the CLI. Change design through tokens and variants, not by rewriting the file.
- `shared/`: our reusable components grouped by kind. A component moves here the moment a second feature needs it.
- `animations/react-bits/`: vendored React Bits code (client components). Never edit it; wrap it in `animations/<name>.tsx` to add `prefers-reduced-motion` handling and token colors. Load heavy effects with `next/dynamic`.
- Icons: `lucide-react` only, imported by name. Custom brand SVGs live in `assets/icons` or `assets/svg`.

### 4.8 Styling (Tailwind + tokens)
- All colors, radii, spacing and fonts are tokens in `styles/globals.css` (`@theme` and shadcn CSS variables). Components use token classes (`bg-primary`, `text-muted-foreground`), never raw hex or arbitrary values.
- Merge classes with `cn()`; build variants with `cva`. Dark mode uses the `dark` class with both themes defined in the token file.
- Fonts through `next/font`, images through `next/image` with explicit `width`/`height` or `fill` + `sizes`.

### 4.9 Environment and secrets
- `config/env.ts` validates variables with Zod at startup and exports two objects: `serverEnv` (private) and `clientEnv` (only `NEXT_PUBLIC_*`).
- A private key is read only in server files. If a browser needs the result, expose it through a Server Action or route handler.

### 4.10 `i18n`
- next-intl. Keys are `area.section.name`, lowercase snake_case; placeholders `{name}`. Every key exists in `en`, `hi` and `hinglish`; a parity test fails the build on a missing key.
- Server Components use `getTranslations`; client components use `useTranslations`.

### 4.11 SEO and metadata
- Each page exports `generateMetadata` (title, description, Open Graph). Shared defaults live in `config/site.ts`.

---

## 5. Naming rules

- Folders and files: `kebab-case`. Component exports: `PascalCase`. Hooks: `use-<name>.ts` exporting `useName`.
- Suffixes: `.page.tsx`, `.section.tsx`, `.store.ts`, `.schema.ts`, `.actions.ts`, `.model.ts`, `.repository.ts`, `.service.ts`.
- Reserved Next.js file names (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `middleware.ts`) exist only inside `app/` (and `middleware.ts` at `src/`).
- Folder vocabulary is fixed and plural for groups: `pages/`, `components/`, `hooks/`, `actions/`, `models/`, `repositories/`, `services/`.
- Path alias `@/` maps to `src/`. Relative imports only inside one feature. Import a feature through its `index.ts`, not its internals. Do not export server-only modules from a barrel that client code imports.
- Spell names correctly. A file name becomes permanent once imported in many places.

---

## 6. Where does new code go? (decision table)

| I am adding... | It goes in |
|---|---|
| A new URL | `app/[locale]/(group)/<path>/page.tsx` (thin) + component in `features/<f>/pages/<name>/` |
| A page's own UI | `features/<f>/pages/<name>/components/<role>/` |
| UI shared by pages of one feature | `features/<f>/components/` |
| UI shared by 2+ features | `components/shared/<kind>/` |
| A shadcn primitive | `npx shadcn@latest add <name>` -> `components/ui/` |
| An animated effect | `components/animations/react-bits/` + wrapper in `components/animations/` |
| Reading data for a page | `data/repositories` or `data/services`, called from the Server Component |
| A mutation (form submit, button) | `features/<f>/actions/<name>.actions.ts` |
| Client interaction logic | `features/<f>/hooks/use-<name>.ts` |
| UI-only client state | `features/<f>/store/<name>.store.ts` |
| Form validation | `features/<f>/schemas/<name>.schema.ts` |
| A data shape | `data/models/<domain>/<name>.model.ts` |
| A webhook / third-party callback | `app/api/<name>/route.ts` |
| Auth redirect / locale detection | `src/middleware.ts` |
| Color, radius, font size | `styles/globals.css` tokens |
| A user-visible string | `i18n/messages/en.json`, `hi.json`, `hinglish.json` (same key) |
| An env value | `.env.local` + declared in `config/env.ts` (server or client part) |
| Firebase / payment / analytics wiring | `services/<area>/` |
| A small pure function | `lib/helpers`, `lib/formatters`, `lib/validators` |
| An image / icon / animation file | matching `src/assets/` folder (or `public/` if a fixed URL is required) |

---

## 7. Patterns to copy

Thin route file:

```tsx
// app/[locale]/(main)/kundli/page.tsx
import { KundliPage } from "@/features/kundli";
export { generateMetadata } from "@/features/kundli";
export default function Page(props: { searchParams: Promise<{ profile?: string }> }) {
  return <KundliPage searchParams={props.searchParams} />;
}
```

Server page reading data:

```tsx
// features/kundli/pages/kundli/kundli.page.tsx
export async function KundliPage({ searchParams }: Props) {
  const { profile } = await searchParams;
  const kundli = await kundliService.fetch(profile);
  return <KundliChart data={kundli} />;   // client widget inside receives serializable props
}
```

Server Action:

```ts
"use server";
export async function saveChart(input: unknown): Promise<ActionResult<Chart>> {
  const parsed = saveChartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "common.invalid_input" };
  const chart = await profileRepository.saveChart(parsed.data);
  revalidatePath(ROUTES.profile);
  return { ok: true, data: chart };
}
```

---

## 8. Converting existing code

Use this when a project already has code and must adopt the structure. Change locations and names only; do not change behavior in the same commit.

1. **Inventory**: list every file and tag it: route, page, component, hook, store, model, API call, helper, asset.
2. **Create the empty skeleton** from section 2.
3. **Move by tag**, one feature at a time:
   - route files stay in `app/` but shrink to render one component; the body moves to `features/<f>/pages/<name>/`
   - components used once -> that page's `components/<role>/`; used by several pages -> `features/<f>/components/`; used by several features -> `components/shared/<kind>/`
   - `fetch` / SDK calls in components or `useEffect` -> `data/services` / `data/repositories`, called from a Server Component
   - client-side form submits and API mutations -> Server Actions in `features/<f>/actions`
   - `useState` server-data caches -> remove; fetch on the server or use TanStack Query
   - global/context state -> Zustand (UI state)
   - hardcoded strings -> i18n keys; hardcoded colors -> tokens; secrets in `NEXT_PUBLIC_*` -> server env
4. **Mark boundaries**: keep files server by default; add `"use client"` only where hooks or handlers are used; add `import "server-only"` to repositories and services.
5. **Rename** to `kebab-case` with the suffix rules in section 5, fix imports to the `@/` alias.
6. **Run** `tsc --noEmit`, lint, tests and `next build` after each feature; commit per feature.
7. **Stop and ask** if a file does not clearly fit a tag; do not invent a new folder.

---

## 9. New-feature checklist

1. Model (Zod schema + `fromApi`) exists.
2. Repository/service method exists, is `server-only`, and throws `AppError`.
3. Route file in `app/` is thin; the page lives in `features/<f>/pages`.
4. Page is a Server Component; `"use client"` only on interactive leaves.
5. `loading.tsx` shows a skeleton; empty and error states exist; `generateMetadata` is set.
6. Mutations are Server Actions that validate with Zod and revalidate the affected path or tag.
7. Strings added to all three message files; parity test passes.
8. No hardcoded colors, strings or URLs; no private secret in `NEXT_PUBLIC_*`.
9. Components used by a second feature moved to `components/shared/`.
10. `tsc --noEmit`, lint, tests and `next build` pass.
