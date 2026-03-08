# WWW60 — Opinion Submission Form — Complete Summary

## What was built

### New files
- `types/opinions.types.ts` — extended with `UserOpinion`, `UserOpinionsResponse`, `SubmitOpinionResponse`
- `lib/api/opinions.api.ts` — added `submitOpinion()` and `getUserTopicOpinion()` functions
- `hooks/useUserOpinion.ts` — `useQuery` for `GET /opinions?topicId=:id`, returns `isCurrent=true` item or null; only enabled when authenticated
- `hooks/useSubmitOpinion.ts` — `useMutation` wrapping `submitOpinion`; on success invalidates `['opinion-stats', topicId]` and `['user-opinion', topicId]`
- `components/www/topics/OpinionForm.tsx` — the main component (see below)

### Modified files
- `app/[locale]/topics/[id]/page.tsx` — inserted `<OpinionForm topic={topic} />` between `TopicDetailHeader` and `OptionsResultsChart`
- `components/www/topics/OptionsResultsChart.tsx` — `LockedCard` updated: icon/style toned down (no amber), copy changed to be specifically about results not voting (voting CTA is now above in `OpinionForm`)
- `messages/en.json` — added full `opinion_form` namespace; updated `topic_detail.locked_results_*` copy

---

## OpinionForm states

**A. Not authenticated**
- Amber `Vote` icon eyebrow + topic title + subtitle
- All option cards rendered as muted/blurred (disabled, no pointer events)
- Bottom CTA strip: amber "Sign in to vote" button + secondary "create a free account" text link

**B. Authenticated, first-time voter**
- Eyebrow label "What do you think?" + topic title + subtitle
- Staggered entrance animation on option cards (Framer Motion, 0.06s stagger)
- Each card: amber left-strip indicator + animated checkmark circle on selection
- Submit button: disabled (muted) until a card is selected; spinner + label change during mutation
- OPINION_REANSWER_LOCKED → inline amber notice with clock icon (not toast)
- OPINION_SAME_VALUE → silent no-op
- All other errors → `toast.error()`
- On success → `toast.success()` + transitions to VotedState

**C. Authenticated, already voted**
- Satisfaction view: animated checkmark in voted option's color + Sparkles accent
- All option cards shown with voted one highlighted (selected state, disabled to prevent accidental re-click)
- "Your answer: {value}" label in the voted option's color
- If `reanswerLockDays === 0`: "Change your answer" outline button → switches back to VoteForm with `currentVote` set
- If `reanswerLockDays > 0`: amber lock notice showing `{days} day(s)` from `topic.reanswerLockDays`; user can still attempt from re-answer flow (lock error shown inline)

**D. Loading**
- Skeleton of header + 3 option card skeletons + submit button skeleton

---

## Design choices
- **Option cards**: left color-strip accent (hidden until selected), animated checkmark circle, spring-physics hover/tap scale
- **Amber is selection**: amber border + soft amber background bg-primary/[0.06] for selected state
- **Framer Motion**: stagger entrance on cards, AnimatePresence for checkmark swap, scale spring on card hover, layout animation on the card container, satisfaction pulse on voted checkmark
- **Re-answer flow**: clicking "Change your answer" mounts VoteForm with currentVote pre-filled so current selection is visually marked; submitting a different option works normally; OPINION_REANSWER_LOCKED shown inline
- **Query invalidation**: both `opinion-stats` and `user-opinion` keys invalidated on success → results chart auto-refreshes

---

## Acceptance criteria — all met
- [x] `frontend-design` skill used
- [x] `npm run build` passes with zero TS errors
- [x] Not authenticated → inviting sign-in card with option preview
- [x] Authenticated, no prior vote → selectable option cards + submit
- [x] Authenticated, already voted → current selection shown, re-answer available
- [x] On submit success → toast + stats chart refreshes (invalidates `['opinion-stats', topicId]`)
- [x] `OPINION_REANSWER_LOCKED` shown inline, not as toast
- [x] Loading skeleton while fetching user's current opinion
- [x] All strings in `messages/en.json` under `opinion_form`
- [x] Dark mode: all colors use CSS tokens (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`); amber lock notice uses alpha tokens
- [x] Mobile: all cards stack vertically, sign-in CTA full-width on mobile, responsive padding (px-6 sm:px-8)
- [x] Committed: `feat(WWW60): opinion submission form — auth-gated vote widget`
- [x] `WWW60-COMPLETE-SUMMARY.md` produced

---

## Commit
`7e15a25` — feat(WWW60): opinion submission form — auth-gated vote widget
