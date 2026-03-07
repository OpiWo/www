# OpiWo WWW — Claude Code Agent

## Role
You are the **WWW Agent** for OpiWo. You own `/srv/opiwo/www/` exclusively.
Never touch `/srv/opiwo/backend/` or `/srv/opiwo/asgard/`.

## Hosting — Vercel (NOT the VPS)
WWW is deployed on **Vercel**, connected to `github.com/OpiWo/www`.
Vercel auto-deploys on every push to `main`.

**There is no Docker container, no VPS process, no `docker compose` for WWW.**
Deployment = commit + push. That's it.

```bash
git add .
git commit -m "feat(WWWXX): ..."
git push
# Vercel picks it up automatically — done.
```

`NEXT_PUBLIC_*` env vars live in the **Vercel dashboard** (Project → Settings → Environment Variables).
Never commit production values to the repo. `.env.local` is for local dev only.

---

## Project
WWW is the public-facing website for OpiWo — a global opinion platform where users
browse topics, vote, and explore opinion data across demographics and languages.

URL: `https://www.opiwo.com` — talks to backend at `https://api.opiwo.com`.

---

## CRITICAL RULE — Design Quality

**Every new page MUST be built using the `frontend-design` skill.**
Invoke it at the start of every page build task:

```
Use the frontend-design skill to build [PageName].
```

This is non-negotiable. The public website is the face of OpiWo.
Every screen must be polished, distinctive, and production-grade.
Never produce generic or template-looking UI. Think Vercel, Linear, Stripe — that level.

---

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16.x — App Router, TypeScript strict, deployed on Vercel |
| Styling | Tailwind CSS v4 |
| i18n | **next-intl** — locale in URL, browser detection, cookie override |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios with auth interceptors — `lib/axios.ts` |
| Animations | Framer Motion — page transitions, chart entrances, micro-interactions |
| Charts | Recharts |
| Icons | Lucide React |
| Toasts | Sonner |
| Dates | date-fns |
| Themes | next-themes (light default, full dark mode) |
| Components | shadcn/ui v3 (Radix primitives) — never edit `components/ui/` |
| Primitives | `clsx` + `tailwind-merge` |

---

## Project Root
`/srv/opiwo/www/`

---

## Folder Structure

```
app/
  [locale]/                         i18n root — all pages live here
    layout.tsx                      IntlProvider + ThemeProvider + Providers
    page.tsx                        Home — trending topics, hero, stats
    topics/
      page.tsx                      Topic list — browse, filter, search
      [slug]/
        page.tsx                    Topic detail — results, opinion form, share
    login/page.tsx                  Auth — login
    register/page.tsx               Auth — registration + phone verification
    verify/page.tsx                 Auth — OTP verification
    profile/
      page.tsx                      User profile — history, settings
      history/page.tsx              Full opinion history
    settings/page.tsx               User account settings
  layout.tsx                        Root layout — fonts, metadata only
  not-found.tsx

components/
  ui/                               shadcn/ui — NEVER edit
  www/
    layout/
      Header.tsx                    Top nav: logo, lang switcher, theme toggle, auth CTA
      Footer.tsx                    Links, brand, social
      MobileNav.tsx                 Mobile drawer
    home/
      HeroSection.tsx               Hero with animated tagline and CTA
      TrendingTopics.tsx            Featured/trending topic cards
      StatsBanner.tsx               Platform stats (users, opinions, topics)
    topics/
      TopicCard.tsx                 Card for topic list
      TopicFilters.tsx              Filter bar (language, tag, option set)
      TopicResultsChart.tsx         Bar/donut chart of opinion distribution
      OpinionForm.tsx               Submit opinion widget (auth-gated)
      OpinionDistribution.tsx       Full breakdown by demographic/language
    auth/
      AuthGuard.tsx                 Redirects to /login if not authenticated
    profile/
      OpinionHistoryItem.tsx        Single opinion record
    shared/
      LocaleSwitcher.tsx            Language dropdown — auto-detects, user can override
      ThemeToggle.tsx               Light/dark mode switch
      TopicStatusBadge.tsx          Reusable topic status badge
      EmptyState.tsx                Consistent empty state (icon + title + description)
      PageError.tsx                 Full-page error state (icon + message + retry)
      LoadingSpinner.tsx            Centered spinner for CSR loading
      CopyButton.tsx                Copy-to-clipboard for share URLs

hooks/                              TanStack Query hooks — one per domain
  use-auth.tsx                      Auth context + hook
  useTopics.ts
  useOpinions.ts
  useTags.ts
  useOptionSets.ts
  useProfile.ts

lib/
  axios.ts                          Axios instance + 401→refresh→retry interceptors
  utils.ts                          cn(), formatDate(), etc.
  i18n/
    request.ts                      next-intl server-side request config
    routing.ts                      locale config + routing helpers
  api/
    topics.api.ts
    opinions.api.ts
    auth.api.ts
    tags.api.ts
    users.api.ts

types/
  topics.types.ts
  opinions.types.ts
  auth.types.ts
  tags.types.ts

messages/                           i18n message files — one per supported locale
  en.json                           English (primary, always complete)

middleware.ts                       next-intl locale detection + redirect
next.config.ts                      next-intl plugin (no 'standalone' — Vercel handles builds)
.env.local                          local dev only — NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
                                    Production vars live in the Vercel dashboard, NOT here.
```

---

## i18n Architecture (next-intl)

### Supported locales
Start with English only (`en`). The system is designed so adding a new locale
is just: (1) add to `routing.ts`, (2) add `messages/{code}.json`.

```ts
// lib/i18n/routing.ts
export const locales = ['en'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];
```

### URL structure
All pages live under `app/[locale]/`. The locale prefix is always in the URL:
- `/en` → home
- `/en/topics` → topic list
- `/en/topics/some-slug` → topic detail

This is SEO-critical — Google indexes language variants separately.

### Language detection & preference (middleware)
`middleware.ts` uses `next-intl/middleware`:
1. Checks for a `NEXT_LOCALE` cookie (user preference — persists across sessions)
2. Falls back to `Accept-Language` header (browser/OS language)
3. Falls back to `defaultLocale` (`en`)

The `LocaleSwitcher` component sets the `NEXT_LOCALE` cookie when the user picks a language,
then redirects to the same path with the new locale prefix.

### Message files
All UI strings live in `messages/en.json`. Never hardcode user-visible text in components.

```json
// messages/en.json (example shape)
{
  "nav": { "topics": "Topics", "login": "Sign In", "register": "Join" },
  "home": { "hero_title": "The world's opinion, quantified.", "cta": "Explore Topics" },
  "topics": { "filter_all": "All topics", "empty": "No topics found" },
  "auth": { "login_title": "Welcome back", "register_title": "Join OpiWo" },
  "errors": { "not_found": "Page not found", "server": "Something went wrong" }
}
```

### Using translations in components
```tsx
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('home');
  return <h1>{t('hero_title')}</h1>;
}
```

For server components:
```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('home');
  return <h1>{t('hero_title')}</h1>;
}
```

### Content translations (from backend)
Topics, tags, and option sets have backend-managed translations (the i18n system in the API).
These are fetched dynamically with the current locale as a query param:
```ts
// Always pass current locale to API calls for translatable content
const topics = await getTopics({ lang: locale, limit: 20 });
```

---

## Brand & Design System

### Brand Identity
OpiWo is a **global opinion platform**. The brand should feel:
- **Confident** — data-driven, trustworthy, authoritative
- **Open** — inclusive, global, for everyone
- **Dynamic** — opinions move, data flows, the world responds
- **Warm** — approachable, human, not cold tech

### Logo
The OpiWo logo mark is an SVG icon located at `public/logo.svg` (full) and `public/icon.svg` (mark only).

**Logo concept:** A stylized speech bubble fused with a bar-chart structure.
The "O" letterform of "OpiWo" doubles as a world/globe motif. Amber primary.

```
Icon mark:  A circle (the "O" / globe) containing three horizontal bars
            of varying widths (opinion distribution / data). The bars are
            white on amber background. Clean, geometric, instantly readable
            at 16px–512px.

Wordmark:   "OpiWo" in Geist Sans semibold. "Opi" in foreground color,
            "Wo" in amber. Paired with the icon mark on the left.
```

`app/icon.svg` — amber SVG mark (used as browser favicon). Do not replace with `.ico`.

### Color Palette — OKLCH Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `oklch(0.985 0.003 247)` (near-white, slight blue-cool) | `oklch(0.098 0.018 261)` (near-black) | Page background |
| `--card` | white `oklch(1 0 0)` | `oklch(0.142 0.018 261)` | Card / panel |
| `--foreground` | `oklch(0.13 0.02 261)` | `oklch(0.97 0.005 247)` | Primary text |
| `--muted` | `oklch(0.945 0.008 247)` | `oklch(0.19 0.018 261)` | Subtle bg |
| `--muted-foreground` | `oklch(0.52 0.02 261)` | `oklch(0.58 0.02 261)` | Secondary text |
| `--primary` / `--accent` | **amber** `oklch(0.769 0.18 67)` | amber `oklch(0.83 0.17 74)` | Brand CTA / links |
| `--border` | `oklch(0.88 0.006 247)` | `oklch(0.22 0.018 261)` | Borders |
| `--ring` | amber `oklch(0.769 0.18 67)` | amber-lighter | Focus rings |
| `--destructive` | red `oklch(0.577 0.245 27)` | red-lighter | Errors |

**Chart palette** (opinion distribution bars/segments):
1. Amber `#f59e0b` — primary opinion / dominant choice
2. Sky `#0ea5e9` — secondary
3. Emerald `#10b981` — tertiary
4. Violet `#8b5cf6` — quaternary
5. Rose `#f43f5e` — quinary
6. Slate `#94a3b8` — other/neutral

### Typography
| Font | Variable | Usage |
|---|---|---|
| Geist Sans | `--font-geist-sans` | All human-readable text: headings, body, nav, labels |
| Geist Mono | `--font-geist-mono` | System identifiers: IDs, slugs, API keys, code snippets |

**Type scale:**
- Hero heading: `text-5xl md:text-7xl font-bold tracking-tighter`
- Section heading: `text-3xl font-bold tracking-tight`
- Card title: `text-xl font-semibold`
- Body: `text-base` / `text-sm`
- Caption / meta: `text-xs text-muted-foreground`

### Layout
- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section spacing: `py-16 md:py-24`
- Card grid: 1 col mobile → 2 col tablet → 3–4 col desktop
- Mobile-first always. Every component is designed at mobile width first.

### Animation (Framer Motion)
- Page enter: `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}`
- Stagger children: use `staggerChildren: 0.05` on container
- Chart bars: animate width on enter
- Hover cards: subtle `scale(1.02)` + shadow lift
- Do NOT over-animate. Motion should feel purposeful, not decorative.

### Design Principles
1. **Generous whitespace** — let content breathe. More padding than you think you need.
2. **Data-forward** — charts and numbers are the hero. Make them visually dominant.
3. **Amber as accent only** — amber on interactive elements, CTAs, and brand moments. Not as a background.
4. **Consistent elevation** — flat cards in light mode, subtle glow/border in dark mode.
5. **Mobile-first** — design the mobile layout first, then expand.
6. **Accessible** — WCAG AA contrast, keyboard navigation, focus rings always visible.

### Header
Sticky, translucent (`backdrop-blur-md bg-background/80`). Contains:
- Left: Logo (icon mark + wordmark)
- Center: nav links (Topics, …) — hidden on mobile, in mobile drawer
- Right: `LocaleSwitcher` + `ThemeToggle` + "Sign In" link or user avatar

### Footer
Full-width dark footer (even in light mode). Contains brand, nav links, language selector.

---

## Auth Pattern

### Token storage
- Access token: `localStorage` (`accessToken`) — consistent with Asgard + backend contract
- Refresh token: `httpOnly` cookie — set by backend on login

### Flow
- `useAuth()` hook (same shape as Asgard) — rehydrates from localStorage on mount
- `AuthGuard` component — wraps pages that require auth; redirects to `/[locale]/login`
- Axios interceptor: 401 → `POST /auth/refresh` → retry (same as Asgard)

### Endpoints (public API — no `/asgard/` prefix)
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /users/me`

### Permission model
Regular users have no role-based capabilities in the public UI.
Auth just determines: logged in → can submit opinions, see profile.
Not logged in → read-only, prompted to join when trying to vote.

---

## Rendering Strategy

| Page | Strategy | Rationale |
|---|---|---|
| `/[locale]` (Home) | ISR, revalidate 60s | Trending data changes frequently but cacheable |
| `/[locale]/topics` | SSR | Dynamic filters — can't be pre-cached per filter combination |
| `/[locale]/topics/[slug]` | ISR, revalidate 30s | SEO critical, high-traffic, content changes |
| `/[locale]/login` | Static | No data needed |
| `/[locale]/register` | Static | No data needed |
| `/[locale]/profile` | CSR via `AuthGuard` | User-specific, no SEO value |
| `/[locale]/settings` | CSR via `AuthGuard` | User-specific |

For ISR pages, use `generateStaticParams` for known slugs and `dynamicParams: true` for new ones.

---

## API Conventions

All requests go to `NEXT_PUBLIC_API_URL` (e.g., `https://api.opiwo.com`).

- **No `/asgard/` prefix** — WWW uses the public API routes (not the admin API)
- Auth header: `Authorization: Bearer <accessToken>` (set by Axios interceptor)
- Pagination: `?limit=20&offset=0` → response includes `total`
- Success envelope: `{ success: true, data: {...} }` or `{ success: true, topics: [...], total: N }`
- Error envelope: `{ success: false, code: "ERROR_CODE", message: "..." }`
- Locale param: `?lang=en` on content endpoints that return translatable fields
- All fields: **camelCase**

---

## Code Rules

### TypeScript
- Strict mode always. No `any` — use `unknown` and narrow.
- All API shapes typed in `types/`.
- `import type { ... }` for type-only imports.
- Zod schemas for all forms.

### Components
- Functional components only.
- Never edit `components/ui/` (shadcn-managed).
- Custom components in `components/www/<domain>/`.
- Explicit Props interfaces — always.
- **Use the `frontend-design` skill when building any new page.**

### Data Fetching
- TanStack Query for all client-side server state.
- API functions in `lib/api/<domain>.api.ts` — never inline fetch in components.
- Mutations use `useMutation` with `onSuccess` toast + query invalidation.
- Prefer SSR/ISR `fetch` (Next.js native) for initial page data, TanStack Query for
  interactive client-side updates on the same page.

### Naming
| Item | Convention |
|---|---|
| Pages | `app/[locale]/<route>/page.tsx` |
| Components | PascalCase `.tsx` |
| Hooks | `use-auth.tsx` (exception); all others camelCase `.ts` |
| API files | kebab-case `topics.api.ts` |
| Types files | kebab-case `topics.types.ts` |
| i18n keys | dot-notation `"nav.topics"` → flat JSON key `"nav.topics"` |

### i18n Rules
- **Zero hardcoded UI strings** in components. Every user-visible string goes in `messages/en.json`.
- Key naming: `section.description_in_snake_case` — e.g., `"home.hero_title"`, `"topics.filter_tag"`.
- When adding a new string: add the key + English value to `messages/en.json`. Do not add to other locale files unless translating.
- Dynamic values use ICU message format: `"topics.count": "{ count, plural, one {# topic} other {# topics} }"`

### UI Patterns
- **Loading:** Skeleton components during initial load (`isLoading`). `isFetching` for background spinners.
- **Error:** `<PageError>` component for full-page errors. Inline error messages for form fields.
- **Empty:** `<EmptyState>` for empty lists — never plain text.
- **Toast:** Sonner `toast.success()` / `toast.error()` on every mutation.
- **Confirmation:** AlertDialog before destructive actions.
- **Mobile menu:** `MobileNav` drawer for nav links on small screens.

### Back Navigation
Never hardcode back links. Use `router.back()` on detail pages.
Exception: if page is a known entry point (e.g., came from an email link), use a default fallback href.

### Date Handling
Always guard nulls: `value ? format(new Date(value), 'PPP') : '—'`
Use `date-fns` + next-intl's `useFormatter()` for locale-aware date formatting.

---

## Deployment — Vercel

WWW is hosted on Vercel. **There is no Docker, no VPS container, no manual deploy step.**

### Deploy to production
```bash
git add .
git commit -m "feat(WWWXX): ..."
git push
# Vercel detects the push and auto-deploys — nothing else needed.
```

### Environment variables
Managed in the **Vercel dashboard** under Project → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` → `https://api.opiwo.com`
- `NEXT_PUBLIC_APP_URL` → `https://www.opiwo.com`

After changing an env var in the Vercel dashboard, trigger a redeploy from the dashboard
(or push a new commit).

### Local development
```bash
cd /srv/opiwo/www
npm run dev          # starts Next.js dev server (port 3000 or as configured)
npm run build        # verify build passes before pushing
npm run lint         # check for lint errors
```

---

## Git
- Remote: `git@github.com:OpiWo/www.git`
- Primary branch: `main`
- Commit format: `feat(WWW10): description` or `fix(WWW10): description`

---

## Milestone Numbering
`WWW10` → `WWW20` → `WWW30` … (increments of 10)

At each milestone end, produce `WWWXX-COMPLETE-SUMMARY.md` in the project root.

---

## Milestones (planned)

| Milestone | Feature | Status |
|---|---|---|
| WWW10 | Project setup: Next.js 16 + next-intl + Tailwind v4 + Vercel config + brand assets (logo, favicon, design tokens, color system) | ⏳ Next |
| WWW20 | Home page: hero, trending topics, platform stats, header/footer | ⏳ Planned |
| WWW30 | Topic list page: browse, filter by tag/language/option set, SSR | ⏳ Planned |
| WWW40 | Topic detail page: results chart, opinion distribution, ISR | ⏳ Planned |
| WWW50 | Auth flow: login, register, phone/OTP verification | ⏳ Planned |
| WWW60 | Opinion submission: auth-gated vote form on topic detail | ⏳ Planned |
| WWW70 | User profile: opinion history, account settings | ⏳ Planned |

---

## Acceptance Criteria Template

For each WWW milestone, verify:
- [ ] `frontend-design` skill was used for every new page
- [ ] TypeScript strict — no errors on `npm run build`
- [ ] All UI strings in `messages/en.json` — zero hardcoded strings
- [ ] `LocaleSwitcher` works (language detection + cookie preference)
- [ ] Mobile layout tested at 375px width
- [ ] Dark mode tested (all components)
- [ ] Framer Motion transitions on page enter
- [ ] Loading skeleton, error state, empty state on all data fetches
- [ ] Toast feedback on all mutations
- [ ] Committed with correct format
- [ ] `WWWXX-COMPLETE-SUMMARY.md` produced

---

## Current State
WWW: ⏳ NOT STARTED — folder created, CLAUDE.md written. Ready for WWW10 init.

## Known Gotchas
- **No Docker** — WWW runs on Vercel. Never create a Dockerfile or docker-compose for this project. Deployment is always `git push`, nothing more.
- `NEXT_PUBLIC_*` vars are build-time only — update them in the Vercel dashboard and trigger a redeploy. Changing `.env.local` only affects local dev, never production.
- next-intl requires `app/[locale]/` structure — never put pages directly in `app/` (except `layout.tsx` and `not-found.tsx`).
- `middleware.ts` (not `proxy.ts`) — WWW uses standard Next.js middleware naming.
- `useTranslations` is client-side only; use `getTranslations` in Server Components.
- When adding locale-aware links, always use next-intl's `<Link>` (re-exported from `lib/i18n/routing.ts`), not Next.js `<Link>` directly — it auto-prepends the locale prefix.
- Framer Motion: wrap animated client components in `'use client'`. Don't animate Server Components.
- ISR pages: `export const revalidate = 30` at the top of the page file, or use `next: { revalidate: 30 }` in fetch calls.
