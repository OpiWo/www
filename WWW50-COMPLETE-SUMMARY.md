# WWW50 — Auth Flow — Complete Summary

## What was built

### Core auth infrastructure

**`types/auth.types.ts`** (new)
- `User`, `UserProfile`, `VerifyOtpResponse` (union type), `CompleteRegistrationPayload`

**`lib/api/auth.api.ts`** (new)
- `authApi.requestOtp(contact)` — POST /auth/request-otp
- `authApi.verifyOtp(contact, otp)` — POST /auth/verify-otp
- `authApi.completeRegistration(payload)` — POST /auth/complete-registration
- `authApi.refreshToken()` — POST /auth/refresh
- `authApi.logout()` — POST /auth/logout
- `authApi.getMe()` — GET /users/me

**`lib/axios.ts`** (updated)
- Added 401 → refresh → retry interceptor with request queuing
- On 401: tries POST /auth/refresh, stores new token, retries original request
- On refresh failure: clears localStorage, dispatches `auth:logout` event

**`hooks/use-auth.tsx`** (rewritten from stub)
- Real `AuthProvider` with `user: User | null`, `isLoading: boolean`
- `login(accessToken)` — stores token, fetches /users/me, updates state
- `logout()` — calls API, clears localStorage, resets state
- `refreshToken()` — calls API, stores new token
- Mount effect: rehydrates from localStorage → tries /users/me → falls back to refresh
- Listens to `auth:logout` event from axios interceptor

### Pages

**`app/[locale]/login/page.tsx`** (new)
- Redirects to home if already logged in
- Renders `<LoginFlow />` — the 3-step auth flow

**`app/[locale]/register/page.tsx`** (new)
- Server-side redirect to /login (registration is inline in login flow)

**`app/[locale]/verify/page.tsx`** (new)
- Server-side redirect to /login

### Auth components (`components/www/auth/`)

**`LoginFlow.tsx`** — orchestrator component
- Manages step state: `'phone' | 'otp' | 'register'`
- Framer Motion `AnimatePresence` with slide transitions between steps
- Desktop: split-panel layout (42% side panel + form panel)
- Mobile: compact amber header strip + form below

**`AuthSidePanel.tsx`** — left side panel (desktop only)
- Dark background with amber glow effects and dot-grid texture
- Animated opinion distribution bars (Framer Motion spring animation)
- Step-aware heading/sub-text that transitions on step change
- Progress dots that animate width between steps

**`PhoneStep.tsx`** — step 1
- React Hook Form + Zod validation (international phone format)
- Toast errors for API error codes (AUTH_INVALID_CONTACT, AUTH_TOO_MANY_REQUESTS, AUTH_OTP_DELIVERY_FAILED)
- Loading state on submit button

**`OtpStep.tsx`** — step 2
- 6 individual character inputs with auto-advance on type
- Backspace navigation (clears current cell or moves to previous)
- Paste handler (parses and fills all 6 cells)
- Verify button disabled until all 6 digits filled
- Handles login success (stores token, redirects home) and registration required (passes token to step 3)
- Resend code button with loading state

**`RegisterStep.tsx`** — step 3
- Display name field (required, 2–50 chars, Zod validated)
- Collapsible demographics section (birth year, gender select, country code)
- Per-field error mapping from API error codes
- On success: calls login(), redirects home with toast

### Updated components

**`components/www/layout/Header.tsx`**
- Shows skeleton during `isLoading`
- When logged in: user avatar button + DropdownMenu (Profile link, Sign Out)
- When logged out: "Sign In" button → /login
- Passes `user`, `onLogout`, `isLoading` to MobileNav

**`components/www/layout/MobileNav.tsx`**
- Auth-aware: shows user displayName + logout button in drawer when logged in
- Shows Login/Register buttons when logged out

### i18n

Added to `messages/en.json` under `auth` namespace:
- All step labels, form labels, placeholders, hints
- All error codes mapped to human-readable strings
- 40+ new keys covering the complete auth flow

## Design aesthetic

Split-panel layout inspired by premium SaaS auth screens:
- Left (desktop): dark foreground-colored panel, amber glow ambients, animated opinion distribution bars with spring physics, step-aware copy transitions
- Right: clean white/dark form with generous spacing
- Mobile: compact amber strip header + full-width form
- OTP cells: 6 individual bordered inputs with amber focus ring glow
- Typography: `font-mono` for step counters and code cells, serif-weight headings

## Acceptance criteria

- [x] `frontend-design` skill used
- [x] `npm run build` passes with zero TS errors
- [x] Phone → OTP → login flow wired end-to-end
- [x] Phone → OTP → registration form → account creation wired end-to-end
- [x] `useAuth()` returns real user after login
- [x] Auth state persists on page refresh (rehydrates from localStorage)
- [x] 401 interceptor retries with refreshed token (with request queue)
- [x] Header shows displayName when logged in, Sign In link when not
- [x] `/login` redirects to home if already logged in
- [x] `/register` and `/verify` redirect to `/login`
- [x] All strings in `messages/en.json`
- [x] Toast feedback on all errors and success events
- [x] Loading states on all async buttons
- [x] Dark mode supported (design tokens used throughout)
- [x] Mobile layout handled (375px: single-column with amber header strip)
- [x] Committed: `feat(WWW50): auth flow — phone OTP login, registration, AuthProvider`

## Files changed

| File | Action |
|---|---|
| `types/auth.types.ts` | Created |
| `lib/api/auth.api.ts` | Created |
| `lib/axios.ts` | Updated (401 interceptor) |
| `hooks/use-auth.tsx` | Rewritten |
| `app/[locale]/login/page.tsx` | Created |
| `app/[locale]/register/page.tsx` | Created |
| `app/[locale]/verify/page.tsx` | Created |
| `components/www/auth/LoginFlow.tsx` | Created |
| `components/www/auth/AuthSidePanel.tsx` | Created |
| `components/www/auth/PhoneStep.tsx` | Created |
| `components/www/auth/OtpStep.tsx` | Created |
| `components/www/auth/RegisterStep.tsx` | Created |
| `components/www/layout/Header.tsx` | Updated |
| `components/www/layout/MobileNav.tsx` | Updated |
| `messages/en.json` | Updated (40+ new auth strings) |
