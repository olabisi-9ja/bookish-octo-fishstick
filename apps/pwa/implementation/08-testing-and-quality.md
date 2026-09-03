# 08 — Testing & Quality

## Quality policy

- **Strict TypeScript across the whole repo** (`tsc -b`) — the CI gate today.
- **Server-render smoke suite over every screen** (`npm run smoke`) — catches runtime crashes that type-checking can't.
- **The bar for shipping:** typecheck + smoke + build + preview all green in the PR.
- Phase 1+ adds unit tests per domain service, integration tests against a test database, and Playwright E2E for the core loops.

## Current automated suite

| Gate | Command | What it covers | Status |
| --- | --- | --- | --- |
| Type-check | `npm run typecheck` | All `src/` with strict settings | ✅ |
| SSR smoke | `node scripts/smoke.mjs` | Renders every screen (public, auth, rider, driver) server-side; catches crashes | ✅ |
| Service smoke | `node scripts/smoke-services.mjs` | Exercises mock service flows | ✅ |
| Build | `npm run build` | `tsc -b && vite build` production bundle + PWA | ✅ |
| Preview | `npm run preview` | Serve production build | ✅ |

> Run all of these before every demo and before every PR merge: `npm run typecheck && npm run build && npm run smoke`.

## Manual test matrix (must run before each release/demo)

### Auth & onboarding
- [ ] Sign up → OTP (`4827`) → KYC → role select → home
- [ ] Login with seeded `test@comuta.app` / `ComutaTest123!`
- [ ] Forgot password flow
- [ ] Verification rejection path renders correctly

### Rider core loop
- [ ] Plan commute → search → sort by Best match / Earliest / Lowest price
- [ ] Open trip detail → check driver trust, vehicle, hub, price band
- [ ] Reserve seat → review → payment → "You're booked." confirmation
- [ ] New booking appears in Upcoming with `confirmation_pending`
- [ ] At-risk trip → "Something changed" → alternatives / refund
- [ ] Pickup: PIN `4827` → confirm → live map → share trip → SOS
- [ ] Rate driver on a completed trip; rating persists after reload

### Driver loop
- [ ] Login `driver@comuta.app` → next commute with 2 passengers + T-8 deadline
- [ ] Confirm trip → passengers notified message
- [ ] Publish a commute; recurring route appears; pause/skip/cancel work
- [ ] Reliability stats and earnings/payouts render correctly

### Platform
- [ ] Install PWA (Add to Home Screen) → opens standalone
- [ ] Offline: load previously visited screen without network → offline banner shows
- [ ] Reduced motion preference respected
- [ ] Keyboard-only navigation through booking flow; focus-visible visible
- [ ] 44px touch targets on mobile viewport
- [ ] Reset via Account → Developer options; seed reloads correctly
- [ ] `npm run smoke` passes after any feature change

## Test data

- Seeded accounts (see [02 — Current Status](02-current-status.md)) cover: verified rider, second rider, driver, at-risk trip, completed history, recurring routes, notifications, support ticket.
- Seed dates are **relative to today** (`src/data/seed.ts` `shiftSeedDates`) so demos never show stale dates.

## Known gaps / to add in Phase 1

| Gap | Plan |
| --- | --- |
| No unit tests on services/store | Vitest; test each service contract (auth, booking, payment, safety) |
| No E2E browser automation | Playwright: signup→book→pay→confirm→trip; driver publish→confirm→payout |
| Mock services have no error taxonomy | Define error contract in `packages/contracts` (codes, retryable flags) |
| No load test | k6 on booking endpoint under concurrent seat contention |
| No accessibility audit tool | axe-core in CI as part of Playwright |

## Accessibility baseline (already implemented in UI)

- Focus-visible styles; keyboard navigation
- 44px touch targets
- Reduced-motion support (motion system in `src/constants`)
- ARIA labels/semantics on interactive components; skeletons during load
- Color palette contrast-conscious (brand tokens in `src/index.css`)

## Definition of Done (per feature)

1. Type-check passes; smoke suite extended with the new screen.
2. Manual matrix item checked (or automated equivalent).
3. No console errors in dev and production builds.
4. Design tokens/motion follow the brand system — no ad-hoc colors in components.
5. Loading/empty/error states covered, not just happy path.
6. Accessibility pass: keyboard + screen-reader sanity.
7. Docs updated (this folder when behavior/pricing/architecture changes).
