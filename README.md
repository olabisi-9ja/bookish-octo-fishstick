# COMUTA — Planned Shared Commuting

**COMUTA** is a planned shared-commuting platform for Lagos: *Your commute. Shared. Simpler.*

Ride with people already making your journey. Book ahead, know your seat, and travel with verified drivers — at a fraction of the cost of riding alone.

This repository is a **production-quality, frontend-only PWA prototype**. Everything runs locally in the browser with mocked services and persisted `localStorage` state — no database, payments, maps, auth or notification backend required yet. Integration points are clearly isolated so Supabase, Paystack, Mapbox/Google Maps, push notifications and real auth can be plugged in later without rewriting the UI.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:4173
```

Production build + installable PWA:

```bash
npm run build
npm run preview
```

Other scripts: `npm run typecheck`, `npm run smoke` (server-render smoke test over every route).

## Local development accounts (seeded, never shown in the UI)

| Email | Password | Role | What you get |
| --- | --- | --- | --- |
| `test@comuta.app` | `ComutaTest123!` | Rider (primary) | Verified rider with a confirmed next commute (Ikorodu → VI, tomorrow 7:00 AM, driver Adebayo K.), a second pending-confirmation trip, an **at-risk trip** (driver hasn't confirmed → recovery flow), completed trip history, a saved recurring route, trusted contacts, notifications and a resolved support ticket |
| `rider@comuta.app` | `ComutaTest123!` | Rider | Second rider — also booked on the at-risk trip |
| `driver@comuta.app` | `ComutaTest123!` | Driver | Verified driver (Adebayo K., Toyota Corolla ABC 123 XY) with published routes, tomorrow's commute with 2 riders, a T-8 confirmation deadline, reliability stats, cost recovery and payout history |

Mock OTP for every verification step is **`4827`**. Any other email + password creates a fresh local account (sign up → OTP → KYC → role selection).

> These accounts exist only in `src/data/seed.ts` and `src/services/authService.ts` (see the `TEST_ACCOUNTS` constant). They are deliberately **not** shown anywhere in the product UI.

### Try the full rider loop

1. Log in with `test@comuta.app` / `ComutaTest123!` → Rider home shows **Your next commute**.
2. **Plan a commute** (Ikorodu Hub → Victoria Island Hub, Tomorrow, 7:00 AM) → **Find available trips**.
3. Compare trip cards (sort by Best match / Earliest / Lowest price), open a trip, check driver trust + vehicle + hub, **Reserve 1 seat** → review → **Continue to payment** → Pay.
4. Enjoy the **"You're booked."** animation → trip is now in **Upcoming** → driver confirmation pending.
5. Open the at-risk trip (`8:00 AM`, Ikorodu → VI) to see **"Something changed"** → **View alternatives** → switch trip or request a refund.
6. On the confirmed trip, use **Pickup** → PIN `4827` → **I'm at pickup** → **Confirm pickup** → **live map** with Share trip and SOS.
7. Completed trips let you **rate your driver**; everything lands in **Trips → Completed**.
8. **Routes** shows your saved recurring route with pause/skip/cancel; **Account → Developer options** resets the prototype.

### Try the driver loop

Log in with `driver@comuta.app` / `ComutaTest123!` → Driver home shows **your next commute** with 2 passengers and the **confirm-by-11:00-PM** deadline. Open the trip → **Confirm trip** → "Confirmed — your passengers have been notified." Check **Reliability**, **Earnings** (cost recovery + payouts), **Publish a commute**, and manage passenger PINs.

---

## Product concept

> **Plan → Compare → Trust → Reserve → Confirm → Prepare → Pickup → Track → Complete → Repeat**

COMUTA is a planned shared-commuting product — **not** an Uber/Bolt clone:

- **Recurring corridors first**: Ikorodu → Victoria Island, Ajah → VI, Lekki → VI, Ikeja → VI.
- **Approved hubs only** — every pickup happens at a verified, monitored location.
- **Driver commitment (T-8)** — drivers confirm by 11:00 PM so riders can plan around certainty.
- **Recovery, not dead ends** — if a driver drops out, the booking is protected: alternatives or refund.
- **Trip PIN, live sharing, SOS** — safety is visible, calm and immediate.
- No Communities/Circles, no social feed, no chat between riders, no demo-account UI.

## Brand

- **Primary** deep forest green `#0A251C`, **accent** COMUTA lime `#BDF23F`, muted green/teal ramps, soft neutral surfaces `#F9FBFB` / `#F0F4F4`, error red ramp.
- **Typography** — Degular (fallback Manrope, loaded from Google Fonts).
- The mark — dark green circle with white + lime bars — is used for splash, auth, landing and app icon; authenticated screens stay quiet and journey-first.
- Illustration system is flat, geometric and mobility-specific (onboarding, empty states, success, failure, recovery, safety) — no stock SaaS imagery.

## Tech

- React + TypeScript + Vite
- Tailwind CSS v4 (`@theme` tokens in `src/index.css`)
- React Router v7 (route map below)
- Zustand (persisted to `localStorage`, key `comuta.pwa.v2`)
- Motion (Framer Motion) with the COMUTA motion durations in `src/constants`
- lucide-react icons
- `vite-plugin-pwa` — installable, offline shell, precached assets, offline fallback (`navigateFallback` → `index.html`)

## Structure

```text
src/
  App.tsx                  Router + guards (auth, KYC, driver)
  index.css                Tailwind theme — brand tokens, motion, a11y
  types/                   Domain model (mirrors future API contracts)
  constants/               Motion durations, status labels, test accounts
  data/seed.ts             Deterministic mock data (relative dates, auto-refresh)
  store/                   Zustand store — single source of truth, persisted
  services/                Mock backend facade (swap for real APIs later)
    authService, tripService, bookingService, paymentService,
    routeService, driverService, notificationService,
    safetyService, supportService
  components/              brand/ ui/ illustrations/ map/ (ComutaMap)
  layouts/                 AuthLayout, AppLayout (mobile bottom nav + desktop sidebar)
  features/
    auth/                  Splash, onboarding, login, signup, OTP, reset, KYC, roles
    rider/                 Home, plan, search, trip detail, booking, payment,
                           confirmation, trip state machine, pickup, live trip,
                           history, routes, account, safety, notifications, support
    driver/                Home, publish, routes, trips + passengers, confirmation,
                           reliability, earnings, account
    landing/               Marketing site (web = storytelling)
scripts/
  smoke.mjs                SSR smoke test across all routes
  smoke-driver.mjs         SSR smoke test for driver screens
public/
  manifest.webmanifest     PWA manifest + shortcuts
  icons/                   Generated PNG icons (192/512 + maskable)
```

### Trip state machine (visible in the UI)

`confirmation_pending → confirmed → pickup → departed → in_transit → completed`, plus `at_risk` (driver hasn't confirmed / dropped) and `cancelled`. Payments: `pending → processing → successful / failed → refunded`. Verification: `pending → under_review → verified / rejected`.

## Integration points (later)

| Area | Now | Later |
| --- | --- | --- |
| Auth | `authService` (local accounts) | Supabase / real auth, biometrics |
| Trips & bookings | `tripService` / `bookingService` (local state) | NestJS / Supabase API |
| Payments | `paymentService` (mock Paystack checkout) | Paystack popup + webhooks |
| Maps | `ComutaMap` (SVG corridor abstraction) | Mapbox / Google Maps (swap one component) |
| Notifications | `notificationService` (local) | Push notifications |
| Safety | `safetyService` (mock SOS/share) | Real emergency integration |

The PWA is mobile-first with a desktop sidebar layout, reduced-motion support, focus-visible styles, 44px touch targets, skeletons and offline banner.
