# 02 — Current Status

**Verifiable claim:** the repository today is a working, frontend-only PWA prototype of the full COMUTA product, with mocked services and `localStorage` persistence. All feature claims below can be verified by running the app (`npm run dev`) or the smoke tests (`npm run typecheck`, `npm run smoke`).

---

## What is built and demonstrable

### Public website (marketing + auth)
- Landing page with split-action hero (Ride / Drive), value props, corridor map.
- Company pages: `/about`, `/safety`, `/drivers`, `/help`, `/how-it-works`, `/privacy`, `/terms` (`src/features/landing/CompanyPage.tsx`).
- Shared sticky public nav and live-site footer (`PublicNav.tsx`, `SiteFooter.tsx`).
- `public/sitemap.xml`, `public/robots.txt` for crawlability.

### Authentication & onboarding
- Splash, login, sign-up, forgot password, OTP verification, KYC (ID type + details), role selection (rider/driver) (`src/features/auth/`).
- Verification state machine: `pending → under_review → verified / rejected`.
- Local accounts only (mock); OTP is fixed at `4827` for all steps.

### Rider experience
- Home with next commute, journey timeline, quick actions.
- **Plan** a journey (hub → hub, date, time) → **Search** results with sort (best match / earliest / lowest price) → **Trip detail** (driver trust, vehicle, hub, pricing band) → **Reserve** → **Review** → **Payment** (mock Paystack checkout) → **"You're booked."** confirmation.
- **Trip state machine in UI**: `confirmation_pending → confirmed → at_risk → pickup → departed → in_transit → completed → cancelled`.
- **Recovery flow**: at-risk trip → "Something changed" → view alternatives / request refund.
- **Pickup**: PIN entry (`4827`) → "I'm at pickup" → confirm pickup.
- **Live trip**: map, share trip, SOS, route deviation handling.
- **History**: completed trips with driver rating + comment.
- **Routes**: saved recurring routes with pause / skip / cancel.
- **Account**: profile, trusted contacts, safety, notifications, support, developer reset.

### Driver experience
- Driver home with next commute, passenger manifest, T-8 confirmation deadline.
- Confirm trip → "Confirmed — your passengers have been notified."
- Publish a commute (recurring routes), manage routes, see passengers + per-passenger PINs.
- Reliability dashboard (completion rate, on-time rate, late cancellations, no-shows).
- Earnings: cost recovery + payout history, monthly stats.

### Safety & support
- Trip sharing (link to trusted contacts), SOS, route-deviation monitoring (`safetyService`).
- Help centre categories + support tickets with thread (`supportService`).
- Notifications inbox with typed kinds (`trip | booking | payment | safety | route | system`).

### Platform quality
- **PWA**: installable, offline shell, precached assets, `navigateFallback` → `index.html`; manifest + icons + shortcuts.
- **Mobile-first** with desktop sidebar layout; 44px touch targets; focus-visible styles; reduced-motion support; skeletons/loading states; offline banner.
- **Accessible branding**: dark forest green `#0A251C`, COMUTA lime `#BDF23F`, neutral surfaces; Degular/Manrope type; flat geometric illustration system.
- **Motion system**: durations `0.12 / 0.2 / 0.3 / 0.6 / 0.9s` with shared easing (`src/constants`).

---

## Test accounts (seed data — never shown in UI)

| Email | Password | Role | Notes |
| --- | --- | --- | --- |
| `test@comuta.app` | `ComutaTest123!` | Rider (primary) | Seeded next commute, at-risk trip, history, recurring routes, trusted contacts, notifications, resolved ticket |
| `rider@comuta.app` | `ComutaTest123!` | Rider | Also booked on the at-risk trip |
| `driver@comuta.app` | `ComutaTest123!` | Driver | Verified driver, published routes, passengers, T-8 deadline, reliability, payouts |

Mock OTP for every verification step: **`4827`**.

## Verification commands

```bash
npm install
npm run typecheck   # strict TypeScript, must pass
npm run smoke       # SSR smoke test over every route + services
npm run dev         # http://localhost:4173
npm run build && npm run preview   # production build + preview
```

## Known limitations (by design, must be stated honestly)

1. **No real backend** — all data lives in `localStorage` (key `comuta.pwa.v2`). Data is not shared between devices, sessions or users.
2. **No real payments** — mock Paystack checkout; no charge, no webhooks, no reconciliation.
3. **No real maps** — `ComutaMap` renders an SVG corridor abstraction, not GeoJSON/Mapbox/Google tiles.
4. **No real auth** — email/password stored locally (plain text **in the mock only**, never in production); no phone OTP, no biometrics.
5. **No push notifications** — in-app only.
6. **No production ops console** — driver vetting, hub management, support and analytics exist only as product concepts.
7. **No native app** — the PWA is the only client today.

## Quality state

| Gate | Status |
| --- | --- |
| `tsc -b` strict | ✅ Passes (per repo CI convention) |
| SSR smoke across all routes | ✅ Implemented (`scripts/smoke.mjs`, `smoke-services.mjs`) |
| Build + preview | ✅ Implemented |
| Manual E2E (documented) | ⚠️ See [08 — Testing & Quality](08-testing-and-quality.md) — needs a defined manual matrix |

> Note: at the time of writing, the smoke scripts exist and are wired into `npm run smoke`; they should be run on every PR and again before any demo.
