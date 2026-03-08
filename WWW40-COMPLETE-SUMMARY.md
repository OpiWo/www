# WWW40 Complete Summary — Topic Detail Page

**Milestone:** WWW40
**Commit:** `feat(WWW40): topic detail page — results chart, demographics, ISR`
**Status:** Complete

---

## What was built

### Page
- `app/[locale]/topics/[id]/page.tsx` — ISR server component (`revalidate: 30`)
  - Fetches topic via native `fetch()` with `{ next: { revalidate: 30 } }`
  - Calls `notFound()` for missing, hidden, or non-published topics
  - Passes `initialTopic` as prop to all client components
  - Generates `<head>` metadata (title + OG) from topic data

### New Types
- `types/topics.types.ts` — extended with `TopicOption`, `TopicDetail`, `TopicDetailResponse`
- `types/opinions.types.ts` — `OpinionStatOption`, `OpinionStats`, `OpinionStatsResponse`
- `types/analytics.types.ts` — `DemographicsResponse`, `HistoricalResponse` + nested types

### New API Functions
- `lib/api/topics.api.ts` — added `getTopic(id, lang?)`
- `lib/api/opinions.api.ts` — `getOpinionStats(topicId)` → `GET /topics/:id/opinions/stats`
- `lib/api/analytics.api.ts` — `getDemographics(topicId)`, `getHistorical(topicId, period)`

### New Hooks
- `hooks/useTopic.ts` — wraps `getTopic`, supports `initialData`
- `hooks/useOpinionStats.ts` — fetches stats only when `enabled` (auth-gated)
- `hooks/useAnalytics.ts` — `useDemographics`, `useHistorical` with period support

### New Components
- `components/www/topics/TopicDetailHeader.tsx` — title, description, tags, date, language badge, share button (clipboard copy with amber lock/check feedback)
- `components/www/topics/OptionsResultsChart.tsx` — animated horizontal bar chart using Recharts; locked card with frosted-glass overlay + sign-in CTA when unauthenticated
- `components/www/topics/DemographicsPanel.tsx` — tabbed demographic breakdown (gender/country/age); horizontal Recharts bar charts per option; auth-gated
- `components/www/topics/HistoricalChart.tsx` — stacked area chart over time (weekly/monthly/yearly period toggle); auth-gated

### i18n
- 27 new strings added to `messages/en.json` under `topic_detail` namespace
- Zero hardcoded user-visible strings in any component

---

## Design Decisions

- **Data-forward editorial** aesthetic — amber rule accent, generous whitespace, numbers as heroes
- **Locked state pattern** — frosted glass overlay with amber lock icon + amber CTA; no redirect, no redirect disruption
- **Chart palette** — amber/sky/emerald/violet/rose/slate in order per option
- **Framer Motion** — staggered entrance on header and results chart; bar widths animated on mount
- **Mobile-first** — single column at 375px, stacked layout throughout

---

## Acceptance Criteria

- [x] `frontend-design` skill used at session start
- [x] `npm run build` passes with zero TypeScript errors
- [x] Topic fetched SSR with ISR 30s revalidate
- [x] `notFound()` called for missing/hidden/non-published topics
- [x] Opinion stats shown when authenticated, locked card when not
- [x] Demographics and historical tabs shown when authenticated, locked when not
- [x] Recharts animated bar chart for results
- [x] All strings in `messages/en.json` under `topic_detail`
- [x] Loading skeleton on all async sections
- [x] Mobile layout works at 375px (single column)
- [x] Dark mode works (all CSS uses design tokens)
- [x] Committed: `feat(WWW40): topic detail page — results chart, demographics, ISR`
- [x] Pushed to `main` → Vercel auto-deploy triggered
- [x] `WWW40-COMPLETE-SUMMARY.md` produced
