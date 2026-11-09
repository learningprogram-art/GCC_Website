# CLAUDE.md — Reidius Infra website
Next.js (App Router) website for Reidius Infra, a Jaipur construction and
architecture company. **These rules are mandatory for every change.**

## 1. The structure standard is binding

[`ReactNextJsStructure.md`](ReactNextJsStructure.md) is the architecture
standard for this repo: folder layout, layer rules, naming, the "where does
new code go" decision table, and the conversion and new-feature
checklists. Read it before writing code and follow it exactly. When this
file and the reference disagree, this file wins (it records the
project-specific decisions in §10). Never create a new top-level folder
under `src/`. If a file does not clearly fit, stop and ask.

## 2. Stack

In use: **Next.js 16** (App Router, Turbopack) · React 19 · TypeScript
strict · **Tailwind CSS v4** (tokens in `@theme`) · shadcn/ui (Radix) ·
lucide-react · **React Bits** animated components (via `motion`) ·
**Redux Toolkit** + react-redux (client state and RTK Query writes) ·
**next-intl** (English + Hindi, §10) · `next/font/local` · `next/image`.

Approved but not installed yet. Install each one the first time real code
needs it, never "for later": TanStack Query, Zod, React Hook Form, Sonner.

**Ask before** adding any dependency not listed above, and before adding a
top-level folder.

## 3. Where code goes (this project)

```
src/app/                  ROUTES ONLY: thin page.tsx files, layouts, not-found, global-error, sitemap, robots
  [locale]/layout.tsx       root layout per language (<html lang>, fonts, client text, site-wide scripts)
  [locale]/(main)/layout.tsx  site shell: Navbar + <main> + Footer
  [locale]/(main)/error.tsx   error boundary for every page (keeps the shell, offers a retry)
  [locale]/(main)/<route>/page.tsx  `await setPageLocale(params); return <XxxPage />` + generateMetadata/revalidate re-exports, nothing else
  [locale]/(main)/<route>/loading.tsx  only on routes rendered per request (see §7 "Loading states")
src/proxy.ts               next-intl language detection/redirects (Next 16 name for middleware)
src/features/<feature>/    home, about, blog, career, contact, faqs, legal, projects, refer
  pages/<page>/<page>.page.tsx          composition only, Server Component
  pages/<page>/<page>.skeleton.tsx      loading UI for that page, when it has one (§7)
  pages/<page>/components/<role>/       sections/ banners/ cards/ forms/ sheets/ buttons/
  components/  hooks/  store/           feature-wide pieces (store/: `.slice.ts`, `.api.ts`)
  index.ts                              the only thing app/ imports from
src/components/ui/         shadcn primitives: CLI-managed (`npx shadcn@latest add`)
src/components/shared/     reused by 2+ features, grouped by kind (see §4)
src/components/animations/ React Bits animations (see §7)
src/hooks/                 global client hooks (use-media-query.ts)
src/lib/                   utils.ts (cn), validators/, constants/, helpers/, i18n/ (routing, navigation, messages, locale-params)
src/data/                  public-supabase.ts (cached anon reads), read-failure.ts, repositories/ (shared reads), services/ (RTK Query)
src/providers/             store.ts (Redux store), store-hooks.ts, store-provider.tsx (root layout), page-messages.tsx (feature text for client components)
src/config/                site.ts (metadata defaults), fonts.ts (next/font)
src/styles/globals.css     design tokens: the single source of truth
src/assets/                fonts/ images/<page>/ icons/ svg/ content/<feature>/ content/i18n/{en,hi}/<namespace>.json (all page text)
src/types/                 shared TS types (team, project-category, job-opening, legal)
public/                    fixed-URL files only (favicon, og-image.jpg); the portfolio PDF comes from the admin (`SiteInfo.portfolioUrl`)
figma-raw/                 (repo root) raw Figma exports waiting to be converted (§8); delete after use
```

- A component used by one page goes in that page's `components/<role>/`.
  When a second feature needs it, move it to `components/shared/<kind>/`
  and don't copy it.
- Naming: kebab-case files; suffixes `.page.tsx`, `.section.tsx`,
  `.slice.ts`, `.api.ts`, `.content.ts`, `.validators.ts`. PascalCase named exports.
  `export default` only in `app/` route files.
- Imports: the `@/` alias across features and relative paths inside one
  feature. `app/` imports features only through their `index.ts`.

## 4. Reuse before you build

Check these first. Extend them with a variant or prop instead of writing a
near-duplicate.

| Need | Use |
|---|---|
| Buttons | `components/shared/buttons/`: `BaseButton` (variants `solid`/`outline`/`accent`/`white`; Next `Link` for internal `href`, `<a>` for external/downloads, `<button>` otherwise), `BlackButton`, `WhiteButton`, `YellowButton`, `PrimaryButton` (home-style CTA), `DownloadPortfolioButton` (variants `default`/`compact`/`plain`/`tile`), `BookCallButton` (navbar "Book" + FREE badge), `WatchButton` (Watch / Watch-Pause), `CarouselArrowButton` (tones `dark`/`muted`/`floating`) |
| Form fields | `components/shared/inputs/`: `FormField`, `PhoneField` |
| Enquiry form | `components/shared/forms/contact-form.tsx` |
| Page chrome | `components/shared/layout/`: `Navbar`, `Footer` (already in the `(main)` layout, never add them to pages) |
| Content width | `PageContainer` (1280px, 16/50px gutters; `as="section"`/`"header"` for landmarks) |
| Horizontal card rows | `EdgeScroller` (starts on the page gutter, bleeds off-screen while scrolling) |
| Team member card | `components/shared/cards/team-member-card.tsx` + `icons/linkedin-badge.tsx` |
| FAQ block | `components/shared/layout/faq-section.tsx` |
| CTA banner | `components/shared/banners/talk-to-experts.tsx` |
| Empty/404/error state | `components/shared/feedback/`: `PageState` (+ `PAGE_STATE_ACTION`), `NotFoundState` |
| Loading placeholders | `components/shared/feedback/skeleton.tsx`: `Skeleton`, `SkeletonText` (pass the real text classes) |
| Failed public read | `readFailed()` from `data/read-failure.ts` (throw at runtime, list fallback only during build) |
| Social, YouTube and LinkedIn links | `siteConfig` in `config/site.ts`: `social` (footer icons, JSON-LD `sameAs`), `youtubeVideos` (home video IDs), `linkedinSearchUrl`. Never write these URLs in a component |
| Class merging | `cn()` from `lib/utils.ts` |
| Validation | `lib/validators/form.validators.ts` |
| Mobile check | `useIsMobile()` / `useMediaQuery()` from `hooks/use-media-query.ts` |
| Carousel arrows state | `useScrollEdges()` from `hooks/use-scroll-edges.ts` |
| YouTube video | `components/shared/media/`: `YouTubeWatch` (thumbnail → player), `YouTubeEmbed` (the youtube-nocookie iframe) |
| Modal UI | `@radix-ui/react-dialog` directly: one `DialogPrimitive.Content` that is a bottom sheet below `md` and a centred dialog from `md`, by classes only (see `refer/.../sheets/referral-form-modal.tsx`, `shared/forms/contact-dialog.tsx`) |

## 5. Design tokens (colors, typography, spacing)

- All colors, font sizes, weights, line-heights, spacing outliers and radii
  live in `src/styles/globals.css` under `@theme`, prefixed `rd-`. Use the
  generated classes: `bg-rd-accent`, `text-rd-base`, `font-rd-medium`,
  `leading-rd-loose`, `rounded-rd-md`, `gap-rd-sm`.
- **Never** use a raw hex/rgb value, and never use an arbitrary color or
  font-size in a component. If a design value is missing, add a token to
  `globals.css` first. When the new token is a `text-*` color or font size,
  also add its key to the `extendTailwindMerge` lists in `src/lib/utils.ts`.
  Otherwise `cn()` silently drops one of two `text-rd-*` classes.
- Known `cn()` limitation: `leading-rd-*`, `rounded-rd-*`, `font-rd-*` and
  `font-switzer` are not registered with tailwind-merge, so an override such as
  `leading-[23px]` passed to a component that already sets `leading-rd-tight`
  does not replace it (the stylesheet order decides). Registering them changes
  rendered spacing in many existing components, so it needs a design review
  before it is switched on.
- Fonts are self-hosted through `next/font/local` in `src/config/fonts.ts`:
  Switzer variable (normal and italic, weights 100–900) on every page. **No Google Fonts**,
  no `@import` of remote CSS.
- No inline `style={}` except a truly dynamic per-instance value.

## 6. Responsive: mobile and desktop are separate designs

- Build and verify every component at **375px, 768px, 1280px, 1580px and 1920px**.
  Mobile-first classes, then `md:` for desktop. `md`, `lg` and `xl` all start at
  **1280px** (`@theme` in `globals.css`): below 1280 is the mobile design, 1280 and up
  the desktop design.
- Set font size, line height, spacing and padding **explicitly per
  breakpoint** (`text-rd-sm md:text-rd-xl`). Desktop scaling below preserves
  those design proportions; it does not replace the separate mobile layout.
- When Figma's mobile and desktop layouts differ in arrangement (not just
  size), render two blocks (`md:hidden` / `hidden md:block`) instead of
  forcing one layout to stretch.
- Modal-style UI: centred dialog on desktop, bottom sheet on mobile, chosen with
  CSS breakpoints only: one Radix `Dialog` styled as a bottom sheet below `md:` and centred
  from `md:` (see `referral-form-modal.tsx`), so no JS mobile check is needed.
- Navigation: hamburger panel below `md:`, inline links above. Never both.

### Desktop scaling — 1280px Figma baseline

- **One rule.** From 1280px up the root size is `calc(100vw / 80)` with no cap (16px at
  1280, 24px at 1920, 32px at 2560), so every desktop page is the 1280 design scaled to
  the screen width: a wider screen or browser zoom-out changes nothing. Below 1280px
  (narrow window, zoom-in, tablet, phone) the mobile design is shown at the browser's
  own root size, because the desktop breakpoints start at 1280 too. Same split as the
  LevelUp web app (desktop from `xl` = 1280).
- JS that mirrors the split uses 1280 as well: `useIsMobile()` is `(max-width: 1279px)`,
  and `matchMedia` checks are `(min-width: 1280px)`. Image `sizes` hints treat
  everything below 1280 as the mobile layout.
- Because rem and `vw` scale together above 1280, `vw` and rem sizes agree; no width
  caps, `min()` limits or page frames are needed.
- `postcss-pxtorem` runs after Tailwind and converts CSS design lengths to rem
  with `rootValue: 16`. Keep writing the original Figma pixel values in CSS and
  Tailwind classes. Do not add another desktop scale or compensating width cap.
- Media queries, viewport units, zero lengths, the `html` root rule, and infinite
  pill radii are excluded from conversion. Do not change this setup without a
  request to change the site's scaling behavior.
- Inline styles and runtime CSS bypass PostCSS: use `rem(designPixels)` from
  `@/lib/helpers/rem` for dimensions, fonts, shadows and animation distances.
  For numeric animation APIs, use `getRootScale()` inside client callbacks.
  DOM measurements (`getBoundingClientRect`, `offsetWidth`, scroll distances)
  already contain the scale: never multiply them again.
- ESLint (`no-restricted-syntax` in `eslint.config.mjs`, same rule set as LevelUp)
  rejects px in inline styles, Motion props, `CSSProperties` constants and numeric
  icon `size={}` props. Don't silence it unless the value really is real-screen px.
- Size icons with CSS classes or rem styles (never `size={20}` or an SVG
  `width`/`height` attribute alone). SVG viewBox coordinates and image
  intrinsic width/height are geometry, not CSS sizes; preserve them when CSS
  already controls the rendered dimensions.
- Keep `vh`/`svh`/`dvh` pin heights and scroll progress in actual viewport units.
  Never apply CSS `zoom` or a page-wrapper transform. The existing managing
  animation's local fit divides out the root scale to avoid double scaling.
- Image `sizes` hints must account for larger desktop rendering, rather than
  claiming the image stops growing at its 1280px design width.
- Validate page families at 1280, 1920 and 2560 (all must look like the 1280 design),
  and the mobile design at 375/390, 768 and 1024. Run `scripts/scale-audit.js` (usage in its
  header): it lists every element that does not grow 1.5x from 1280 to 1920. Check header/footer, forms, overlays, horizontal overflow and pinned
  animations. Run typecheck, lint and build. Physical screen resolution and
  device-pixel ratio are not layout widths; use the browser's CSS viewport.
- Proportional viewport scaling cancels browser zoom while the viewport stays at or
  above 1280px. Zooming in past that boundary switches to the mobile design. Preserve user font preferences below the desktop breakpoint;
  never disable browser zoom. Different viewport heights reveal different
  amounts of the page even when horizontal proportions match.

## 7. Performance and rendering

- **Server Components by default.** Add `"use client"` only to the smallest
  component that needs state, effects, handlers or browser APIs. Pull
  the interactive bit into its own file, as `open-referral-form-button.tsx`
  and `copy-map-link-button.tsx` do, so the section stays server-rendered.
- Hooks must be SSR-safe: no `window`/`document` during render.
- Images: always `next/image` with a static import from `src/assets`. Use
  `fill` + `sizes` for full-bleed or cover images, add `sizes` for large
  responsive images, and `preload` only for the above-the-fold hero. Convert
  supplied PNG/JPG to WebP first (`cwebp -q 82 in.png -o out.webp`) and
  delete the source.
- Animations: **React Bits** components (built on `motion`). Keep them in
  `components/animations/` as client components that respect
  `prefers-reduced-motion`: `MotionPreferences` (root layout) makes every
  `motion` animation follow the setting; scroll-linked scenes and CSS
  animations still need their own `motion-reduce:` handling. Unmodified vendored
  React Bits code goes in `components/animations/react-bits/`. Otherwise
  use Tailwind `transition`/`duration`/`ease` utilities. Don't add
  animation nobody asked for.
- Every page exports `metadata` (title and description). Defaults live in
  `config/site.ts`.

### Loading, error and not-found states

- `loading.tsx` only on routes rendered **per request** (today: the blog index,
  `blog/(index)/`, and the article sheet). Static/ISR pages already ship their
  data in the HTML and are prefetched by `Link`; a `loading.tsx` there puts the
  skeleton in front of the content in the static HTML (a flash on first load,
  later LCP, duplicate headings). Scope a skeleton with a route group when its
  segment also contains static routes.
- Skeletons mirror the real page: reuse its static sections as-is and its
  container/spacing classes, and draw only data-backed parts with `Skeleton` /
  `SkeletonText`. Keep a single `h1` (render the static title as `p` in the
  skeleton). Name them `<page>.skeleton.tsx` next to the page and export them
  from the feature `index.ts`.
- Failed public reads throw (`readFailed`): `(main)/error.tsx` shows the retry
  state inside the site shell, and a static page keeps serving its last good
  render. `global-error.tsx` covers a failing root layout. Missing records call
  `notFound()`.

### Shared entrance animation pattern

- `ScrollReveals` in the main layout uses one IntersectionObserver for the site.
  Add `data-reveal` to an existing heading, card or list item; no layout wrapper,
  per-card effect, scroll listener or full-page client conversion is needed.
- Pattern: 24 design-pixel rise + fade, 550ms ease-out, 70ms stagger capped at
  210ms. CSS motion tokens live in `globals.css`; shared cadence constants live
  in `lib/constants/animation.ts`. Reuse these rather than adding timings.
- Reveal each element once when it enters the viewport. Nested headings inherit
  their card's entrance. Streamed content, route changes and filtered cards are
  registered automatically; hidden mobile/desktop variants wait until visible.
- Keep pinned construction, mission, story, map and carousel transforms under
  their existing controllers. Do not apply entrance markers to sticky wrappers
  or layout-measurement sentinels. `data-reveal-skip` excludes a subtree.
- Use `CountUp` from `components/animations/count-up.tsx` for marketing metrics.
  Pass the exact final string (`400+`, `12K+`, `30.4 Lakh`). Dates, prices in forms,
  phone numbers and live calculator results must remain static.
- Both effects preserve server-rendered content, support reduced motion, retain
  accessible final values and avoid changing final typography or geometry.
  Use existing exact-value design tokens; career copy lives in
  `assets/content/career/career.content.ts`.

## 8. Main workflow: Figma raw code → components

The usual task: the user pastes **raw Figma-to-code output for a whole
page**, once for desktop and once for mobile. Turn it into proper components
under this structure. The raw code is a structural reference only: never
ship its classes, absolute positioning or placeholder images as-is.

### 8.1 Inputs, and what to ask for

| Input | Required? | If missing |
|---|---|---|
| Page name / route (e.g. `about` → `/about`) | Yes | Ask |
| **Number of components** the page splits into | Yes | **Ask before writing any code:** "How many components is this page divided into? (list their names if you have them)" |
| Raw desktop code + raw mobile code | Yes | Ask for the missing breakpoint. Never invent mobile from desktop |
| Figma node links / screenshots per component | Recommended | Proceed from the raw code and say exact values are unconfirmed |
| Real images (PNG/JPG/SVG) | When the design has photos | Use a neutral placeholder block and list it as a gap. Never hotlink `placehold.co` |

The raw files go in `figma-raw/<page>.desktop.raw` and
`figma-raw/<page>.mobile.raw` at the repo root. They use a `.raw` extension
so TypeScript, ESLint and Next ignore them. Delete each raw file once its
page is converted and verified.

### 8.2 Step 1: split into components, then confirm the plan

1. Find the N components in the raw code by their visible copy and visual
   blocks. The raw code is one flat tree, not sectioned. Skip the header,
   footer and announcement bar, which are already `Navbar`/`Footer` in the
   `(main)` layout.
2. If the raw code does not split cleanly into the given N, ask. Don't
   merge or split on your own.
3. Before coding, reply with a short plan table:

   | # | Component | File | Server/Client | Mobile vs desktop |
   |---|---|---|---|---|
   | 1 | `AboutHero` | `features/about/pages/about/components/sections/about-hero.section.tsx` | Server | different layout |

   - Use an existing shared component from §4 when one fits, and say
     "reuse `TalkToExperts`" in the plan instead of rebuilding it.
   - A block that appears on 2+ pages goes to `components/shared/<kind>/`.
   - Mark each component "same layout, resized" (one component with `md:`
     classes) or "different layout" (separate `md:hidden` / `hidden md:block`
     blocks).

   Proceed straight to Step 2 unless the user asked to review the plan
   first or something is ambiguous.

### 8.3 Step 2: convert each component

Get exact values from the Figma node when one is given. Otherwise take them
from the raw code. Then map every class onto project tokens:

| Raw code | Convert to |
|---|---|
| `absolute` + `left-[…] top-[…]` layout | normal flow: `flex`/`grid` + `gap-*`. Keep `absolute` only for real overlaps and decorations |
| `font-['Archivo']` / `font-['Garnett_Medium']` / `font-['Garnett_Semibold']` | `font-switzer` with the appropriate `font-rd-*` weight |
| Generic colors (`text-black`, `bg-zinc-100`, `text-sky-900`, `bg-yellow-300`…) | the `rd-*` color token with the **same hex** (in `styles/globals.css`). No exact match → add a token (§5) |
| Generic sizes (`text-sm`, `text-3xl`, `text-[26px]`…) | the `text-rd-*` token with the **same px** (12 xs · 13 footer-mobile · 14 sm · 16 base · 18 md · 20 lg · 22 xl · 24 2xl · 26 3xl · 32 4xl · 70 hero). Tailwind's default names do **not** equal ours (`text-3xl` = 30px ≠ `text-rd-3xl` = 26px), so match on px |
| `font-medium` / `font-semibold`… | `font-rd-medium` / `font-rd-semibold`… |
| `leading-*`, `rounded-*`, 15/22/42/70px spacing | `leading-rd-*`, `rounded-rd-*` (4/8/12/16/40px), `*-rd-sm/md/lg/xl` |
| Flat `div` text | semantic tags: `h1`–`h3`, `p`, `ul/li`, `button`, `a`/`Link` |
| Icon placeholder div pairs (`size-4 bg-zinc-300` + `size-3 bg-zinc-900`) | the matching `lucide-react` icon, or the exported SVG from Figma in `assets/icons/` |
| `<img src="https://placehold.co/…">` | a real asset in `src/assets/images/<page>/` (WebP) via `next/image`, or a placeholder block listed as a gap |
| Repeated blocks (cards, list rows) | a typed data array + `.map()`, one small subcomponent |
| Copy text | keep the exact wording from the design; fix obvious export typos only if the user confirms |

- Write the mobile classes first, then override with `md:` for desktop
  (§6). Font size, line height and padding are set per breakpoint.
- Buttons, fields and forms come from `components/shared/` (§4). Never
  hand-style a button that `BaseButton`/`BlackButton`/`WhiteButton`/`YellowButton`
  already covers.
- Only an interactive leaf gets `"use client"` (§7).

### 8.4 Step 3: assemble, verify, clean up

1. Add the components in order in `features/<page>/pages/<page>/<page>.page.tsx`
   with `metadata`, export them through the feature `index.ts`, and add the
   thin route in `app/[locale]/(main)/<route>/page.tsx`; all text goes in the en + hi language files (§10).
2. Run `npm run typecheck`, `npm run lint` and `npm run build`, then compare
   against the design in the browser at 375px and 1280/1440px.
3. Delete the used `figma-raw/` files and update the Status table (§11).
4. In the reply, list what couldn't be matched exactly: missing images,
   unconfirmed colors, placeholder content.

## 9. General workflow rules

- **Design source of truth is Figma.** Load the `figma-design-to-code` skill
  before any Figma MCP call, and match spacing, type and color exactly using
  tokens. If the Figma Dev Mode MCP server is unreachable, say so and build
  from the user's screenshots or Inspect values. Don't guess silently.
- Change only what the task asks. Delete code your change replaces; leave
  no dead code, no commented-out code and no unused files, exports or
  dependencies.
- Accessibility: semantic HTML, real `<button>`/`<a>`/`<Link>`, `alt` on
  every image (`alt=""` + `aria-hidden` for decoration), visible focus
  states, labels tied to inputs.
- **Before calling work done:** `npm run typecheck`, `npm run lint` and
  `npm run build` must all pass, and the change must be checked in the
  browser at mobile and desktop widths.

Commands: `npm run dev` (http://localhost:3000) · `npm run build` ·
`npm run start` · `npm run lint` · `npm run typecheck`.

## 10. Project decisions (deviations from the reference)

- **English + Hindi with next-intl** (`src/lib/i18n/`). English keeps unprefixed URLs (`/about`), Hindi is
  `/hi/about` (`localePrefix: "as-needed"`). First visit follows the browser language; the last language opened
  is remembered in the `NEXT_LOCALE` cookie. Both languages are statically generated.
  - **Hindi is currently hidden** (`HINDI_PUBLIC = false` in `lib/i18n/routing.ts`): no switch or prompt, no
    browser-language redirect, `/hi/...` redirects to English, and sitemap/hreflang list English only. Keep writing
    both languages; set it to `true` to launch Hindi.
  - **Never hard-code visible text.** Every string (incl. `alt`, `aria-label`, placeholders, errors, metadata) goes
    in `assets/content/i18n/en/<namespace>.json` **and** `hi/<namespace>.json`: `common`, `layout`, `forms`, and
    one per feature. Keys are typed from the English file; `npm run lint` runs `scripts/check-translations.mjs`
    (missing/extra keys, placeholder mismatch, no arrays: lists are objects keyed by id, order in code).
    ESLint fails on text typed into JSX or into `alt`/`aria-label`/`placeholder`/`title`; only names and sample
    values that are the same in every language are allowed (`SAME_IN_EVERY_LANGUAGE` in `eslint.config.mjs`).
    Services return error keys, not sentences; the form shows them through its language file.
  - Server Components: `getTranslations`; client: `useTranslations`. `common`/`layout`/`forms` reach the browser on
    every page; a page whose client components read its feature namespace wraps its content in `PageMessages`.
  - Links, redirects and routers come from `@/lib/i18n/navigation` (ESLint blocks `next/link` and the
    `next/navigation` router/redirect). Click-delegation selectors use `linkSelector(href)`.
  - Every route calls `setPageLocale(params)`; metadata uses `generateMetadata` + `pageMetadata({ …, locale })`
    (hreflang/canonical per language; `translated: false` for pages whose content is admin English only).
  - Admin (CMS) content stays English for now and is marked `lang="en"` on Hindi pages.
  - Hindi copy is transcreated marketing Hindi (tone, glossary: `HINDI_PLAN.md` §6) and approved by the
    company's Hindi reviewer. Hindi letters use Noto Sans Devanagari (`config/fonts.ts`), loaded on Hindi pages only.
- `data/repositories/` owns shared cached reads (team, careers, project
  categories). Feature services own their domain reads; new shared database
  reads belong in `data/`. Every public read reports failure through
  `readFailed()` (`data/read-failure.ts`) instead of returning empty data.
  Add providers or middleware only when a real requirement needs them.
- **Redux Toolkit replaces Zustand** (reference §4.6). Page data is still read
  on the server and never copied into the store. The store holds client state
  shared by several components (`features/<f>/store/<name>.slice.ts`, read with
  `useAppSelector`/`useAppDispatch` from `providers/store-hooks.ts`), and every
  client-side write is an RTK Query mutation injected into `websiteApi`
  (`data/services/website-api.ts`). State used by one component stays `useState`.
- The referral form's open state is URL-driven (`/refer`, `/refer/form`,
  `/refer/form/success`) through `useReferralFormRoute`. The modal is
  mounted in `app/[locale]/(main)/refer/layout.tsx` so it survives those navigations.

## 11. Status

| Page | Route | State |
|---|---|---|
| Home | `/` | Built (Figma 8597:8269 / 8597:9108). Testimonials, projects (`status`, `show_on_home`) and team from Supabase; journey section is a scroll-driven isometric build drawing; contractor YouTube link and journey stages 2–5 copy pending |
| About | `/about` | Built. Placeholder team roster and photos, Mission animation deferred |
| Contact | `/contact` | Built |
| Refer | `/refer` (+ `/form`, `/form/success`) | Built. Submissions saved to the admin panel's `referrals` table (`data/services/referrals.api.ts`; table from the admin repo's `supabase/10_referrals.sql`) |
| FAQs | `/faqs` (`/faq` redirects) | Built |
| Privacy Policy / Terms | `/privacy-policy`, `/terms-and-conditions` | Built |
| Career | `/career` | Built: hero, openings (real `job_openings` rows only, empty state otherwise), culture videos, application form (`/career/thank-you` is a tracking URL that redirects to `/career` on reload), why-special |
| Projects (Architecture, Interior, Residential, Commercial) | `/projects`, `/projects/[category]`, `/projects/[category]/[project]` | Built. Data comes from the admin panel's Supabase (`project_categories`, `projects`); static pages; SEO metadata, JSON-LD and `sitemap.xml` included |
| Blog | `/blog` (`?category=&q=&page=`), `/blog/[slug]` | Built. Data from the admin panel's Supabase RPCs (`get_blog_page`, `get_blog_post`, `get_blog_sitemap`), cached; filters/paging load in place (no scroll jump). Articles open in a bottom sheet over the index on desktop and mobile (Figma design): `blog/@modal/(.)[slug]` intercepts clicks from the index, `blog/[slug]` serves direct links as index + open sheet (server-rendered for SEO); OG/Twitter share tags, Article JSON-LD and `sitemap.xml` included |
| Consult form, Calculator | — | Not built. `/calculator` redirects temporarily to `/contact`; other links fall through to `not-found` |

Public data is cached for 1 hour (`CONTENT_CACHE_SECONDS`) and refreshed at
once when the CMS saves (tag revalidation, see CACHING.md). Update this table
when a page is built.

## Performance and reuse decisions

- All pages use the home Switzer family and cream `rd-page-bg` / `rd-cream`
  canvas. Keep intentionally contrasting cards and section backgrounds.
- Use `PageContainer` for the 1280px design width with 16px mobile / 50px
  desktop gutters. Pass local spacing via `className`; full-bleed scenes stay
  outside this wrapper. No extra scaling or nested containers.
- Use `PrimaryButton` for the home-style CTA and `BaseButton` for its other
  color variants. Internal routes use Next
  Link, downloads and external URLs keep native anchor behavior.
- Founder/team data comes from `data/repositories/team/team.repository.ts`
  on the server, in parallel, cached with the other public content (1 hour, CMS revalidation).
  Pass data into interactive leaves; never fetch team data on mount.
- `toTeamCard` maps database records once consistently. `TeamMemberCard` and
  `LinkedInBadge` are shared; category gallery/cards live under
  `features/projects/components/category/`, reused for every project category.
- The home project strip reuses the already-fetched `projects` array. Do not
  issue a second browser query for the same list. Featured cards have stable
  project keys so filter changes run the shared entrance animation.
- Blog filters prefetch on hover/focus; current results stay visible while a
  transition loads. Do not eagerly prefetch every filter combination.
- Raster assets are WebP, grouped by feature. Preserve native source dimensions
  and alpha; do not enlarge low-resolution files and call them genuine 4x.
  Request an original 4x export when detail is missing. Keep vector SVGs.
- Preload only above-the-fold assets. Managing/journey animation frames prepare
  near their section; offscreen images use responsive Next Image loading.
- See PERFORMANCE.md for the audit, verification and source-resolution limits.

## SEO and tracking

- Canonical domain is `https://reidiusinfra.in`; target Jaipur. Central identity
  is `config/site.ts`; use `pageMetadata` for titles/canonicals/social defaults.
- Preserve real CMS project locations and article attribution. Never fabricate
  authors, awards, reviews or proof points for SEO. Keep CMS share-image
  overrides with hero/cover/card fallbacks and publicly fetchable absolute URLs.
- Keep one document-level GTM bootstrap and noscript fallback. Do not add GA4
  again in application code when configured through GTM.
- Keep articles in server HTML, noindex submission/success states, and update
  the sitemap for new public routes. See SEO.md for verification/go-live steps.

## Public content caching

Follow [CACHING.md](CACHING.md). Server public reads use the anonymous cached client
in `data/public-supabase.ts`; private data and writes use the ordinary client.
Keep new public content tags synchronized with the CMS refresh adapter. Never place
administrator tokens in public cache entries or add Supabase CDN configuration.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
