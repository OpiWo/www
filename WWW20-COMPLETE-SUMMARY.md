# WWW20 Complete Summary

## Milestone: Home page — hero, trending topics, platform stats, header/footer

**Status:** Complete
**Commit:** `feat(WWW20): home page — hero, trending topics, header/footer`
**Branch:** main — pushed, Vercel auto-deploying

---

## What was built

### New files (19 total)

#### Layout
- `components/www/layout/Header.tsx` — Sticky translucent nav (`backdrop-blur-md bg-background/80 border-b border-border/40`). Logo (light/dark variants), Topics nav link with active state, LocaleSwitcher, ThemeToggle, Sign In button. Hides nav links on mobile.
- `components/www/layout/Footer.tsx` — Full-width dark footer (`bg-foreground text-background`). OpiWo wordmark ("Opi" light / "Wo" amber), tagline, Platform nav links (Topics, Sign In, Join), Community placeholders (Twitter/Discord), copyright with current year.
- `components/www/layout/MobileNav.tsx` — Sheet drawer (base-ui Dialog). Logo at top, Topics nav link, LocaleSwitcher + ThemeToggle, Sign In + Join CTA buttons. Opens via hamburger icon in Header.

#### Shared components
- `components/www/shared/LocaleSwitcher.tsx` — Ghost button "EN" with DropdownMenu. Shows "English" as selected. Future-proof for additional locales.
- `components/www/shared/ThemeToggle.tsx` — Ghost icon button. Sun (dark mode) / Moon (light mode). Uses `useTheme()` from next-themes. Mounted guard prevents hydration flash.
- `components/www/shared/EmptyState.tsx` — Centered card with optional icon, title, description, action.
- `components/www/shared/PageError.tsx` — Full-page error state with AlertCircle icon, message, optional retry button.
- `components/www/shared/LoadingSpinner.tsx` — Centered Loader2 with animate-spin.

#### Home sections
- `components/www/home/HeroSection.tsx` — Full-height hero with:
  - Ambient amber radial gradient background (`oklch(0.769 0.18 67 / 0.07)`)
  - Subtle 48px grid texture overlay
  - Decorative abstract opinion bar visualisation (right side, desktop only) — 5 animated bars showing fake opinion distribution percentages, animating in with Framer Motion
  - Eyebrow badge with pulsing amber dot
  - Staggered Framer Motion entrance (opacity+y) with 0.12s delay between each element
  - Hero heading (`text-5xl md:text-7xl font-bold tracking-tighter`), subtitle, dual CTAs (primary amber "Explore Topics" + outline "Join for free")

- `components/www/home/StatsBanner.tsx` — Horizontal stats band with border-y. Three stat items (5,200+ members, 340+ topics, 28,000+ opinions) with large amber number + muted label. Scroll-triggered fade-in via `whileInView`.

- `components/www/home/TrendingTopics.tsx` — Client component with TanStack Query + ISR initialData. Scroll-triggered section header. Responsive grid (1→2→3 cols). 6-skeleton loading state. EmptyState fallback. Staggered card entrance via `whileInView`.

#### Topic card
- `components/www/topics/TopicCard.tsx` — Card with Framer Motion `whileHover` scale(1.02) + shadow lift. Language badge (font-mono, uppercase), published date, title (line-clamp-2), description (line-clamp-2), tag badges (up to 3 + overflow count). Links to `/topics/{id}` via next-intl Link.

#### Data layer
- `types/topics.types.ts` — `Topic` and `TopicsResponse` interfaces
- `lib/api/topics.api.ts` — `listTopics(params)` using axiosInstance
- `hooks/useTopics.ts` — TanStack Query hook with `initialData` support and 60s staleTime
- `lib/i18n/navigation.ts` — next-intl `createNavigation()` exporting `Link`, `redirect`, `usePathname`, `useRouter`

#### Updated files
- `app/[locale]/page.tsx` — Converted to ISR async Server Component (`revalidate = 60`). Fetches trending topics server-side with try/catch fallback to `[]`. Assembles HeroSection → StatsBanner → TrendingTopics.
- `app/[locale]/layout.tsx` — Wraps children in `min-h-screen flex flex-col` with Header above `<main>` and Footer below.
- `messages/en.json` — Added: `common.language_english`, `footer.*` (tagline, nav_heading, community_heading, copyright), `home.hero_eyebrow`, `home.hero_bars_label`, `home.trending_eyebrow`.

---

## Design decisions

**Direction:** Refined editorial data-forward minimalism. Linear precision meets Stripe warmth.

**Memorable element:** Abstract opinion distribution bars as decorative hero visual — reinforces the "data-driven opinions" brand at a glance, using the same visual language as actual topic results charts.

**Amber discipline:** Used only for CTAs (primary Button), stat values in StatsBanner, eyebrow label text, active nav states, and the "Wo" in the footer wordmark. Not used as backgrounds.

**Framer Motion:** Entrance animations on hero (staggered), stats (scroll-triggered per-item), topics grid (staggered whileInView), bar animations in hero visual. Card hover is scale+y lift. No over-animation.

---

## Acceptance criteria

- [x] `frontend-design` skill invoked before building
- [x] `npm run build` passes — zero TypeScript errors
- [x] Header + Footer render on every page via locale layout
- [x] HeroSection has Framer Motion staggered entrance animation
- [x] TrendingTopics renders 6 cards (or EmptyState if no data)
- [x] StatsBanner shows 3 platform stats with scroll-triggered animation
- [x] All UI strings from `messages/en.json` — zero hardcoded user-visible text
- [x] TopicCard links to `/topics/{id}` via next-intl Link
- [x] Mobile responsive — MobileNav drawer for small screens
- [x] Dark mode — all components use CSS variable tokens
- [x] ISR: home page `revalidate = 60`, server fetch with try/catch fallback
- [x] Committed `feat(WWW20): home page — hero, trending topics, header/footer`
- [x] Pushed to main — Vercel auto-deploying

---

## Next milestone

**WWW30** — Topic list page: browse all published topics, filter by tag/language/option set, SSR rendering, infinite scroll or pagination.
