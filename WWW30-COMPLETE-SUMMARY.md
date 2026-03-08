# WWW30 Complete Summary — Topics List Page

## What was built

### Page
- `app/[locale]/topics/page.tsx` — SSR Server Component. Fetches topics, tags, and option sets in parallel server-side using `Promise.all`. Accepts `tag`, `optionSet`, and `lang` URL search params. Passes `initialData` to client components. Uses `cache: 'no-store'` for topics (dynamic filters), `revalidate: 300` for tags/option-sets.

### Components
- `components/www/topics/TopicFilters.tsx` — `'use client'`. Manages URL param state using next-intl `useRouter` + `usePathname`. Hydrates filter dropdowns with server-fetched data, then updates from TanStack Query. Updates URL params on filter change; clears cursor on filter reset.
- `components/www/topics/TopicFiltersBar.tsx` — `'use client'`. Pure UI filter bar with three base-ui `Select` dropdowns (tag, option set, language). Pill-style with amber active border/background when a filter is active. Animated amber pulse dot when any filter is active. AnimatePresence for reset button appear/disappear.
- `components/www/topics/TopicsList.tsx` — `'use client'`. Uses `useTopicsInfinite` with `initialData` from SSR. Re-keyed on filter change (AnimatePresence mode="wait") for smooth filter transition. Staggered Framer Motion card entrance. "Load more" amber outline rounded button. Skeleton loading state, EmptyState with MessageSquare icon.

### Hooks (new/updated)
- `hooks/useTags.ts` — `useQuery` wrapping `listTags`, key: `['tags', { lang }]`, staleTime: 5 minutes.
- `hooks/useOptionSets.ts` — `useQuery` wrapping `listOptionSets`, key: `['option-sets']`, staleTime: 5 minutes.
- `hooks/useTopics.ts` — Added `useTopicsInfinite` with `useInfiniteQuery` (cursor-based). Existing `useTopics` unchanged.

### API functions (new)
- `lib/api/tags.api.ts` — `listTags(lang?)` → `GET /tags`
- `lib/api/option-sets.api.ts` — `listOptionSets()` → `GET /option-sets`

### Types (new)
- `types/tags.types.ts` — `Tag`, `TagsResponse`
- `types/option-sets.types.ts` — `OptionSet`, `OptionSetsResponse`

### i18n keys added to `messages/en.json`
Added under `topics`: `filter_tag`, `filter_option_set`, `filter_language`, `filter_all_tags_label`, `filter_all_option_sets_label`, `filter_all_languages_label`, `filter_reset`, `loading_more`, `empty_title_filtered`, `empty_description_filtered`, `topic_count`.

## Design decisions
- **Filter bar**: Pill-style selects (rounded-full) with amber accent on active state (`border-primary/60 bg-primary/5`). Amber pulse dot animates in when any filter is active — editorial signal that the page is filtered.
- **Grid transitions**: `AnimatePresence mode="wait"` keyed on filter combination — when filters change, old grid fades out, new grid fades/staggers in.
- **Load more**: Amber outline rounded button, centered below the grid, shows Loader2 spinner while fetching next page.
- **SSR + client hydration**: Topics initial page SSR'd with active filters; TanStack Query takes over for pagination. Tags/option-sets SSR'd and passed as `initialTags`/`initialOptionSets` to avoid dropdown flash.
- **base-ui Select compatibility**: `onValueChange` handler typed as `(value: string | null) => void` to match base-ui's `SelectPrimitive.Root` generic signature.

## Acceptance criteria
- [x] `npm run build` passes with zero TS errors
- [x] Topics list renders with SSR initial data
- [x] Tag, option set, and language filters update URL params and re-fetch
- [x] "Load more" appends next page of topics
- [x] EmptyState shown when no topics match filters
- [x] All UI strings in `messages/en.json`
- [x] TopicCard links to `/topics/{id}` via next-intl Link (existing component)
- [x] Committed `feat(WWW30): topics list page — browse, filter, SSR`, pushed to main
- [x] WWW30-COMPLETE-SUMMARY.md produced

## Commit
`8e79802` — `feat(WWW30): topics list page — browse, filter, SSR`
