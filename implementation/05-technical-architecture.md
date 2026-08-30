# 05 — Technical Architecture

## Current architecture (Phase 0)

```text
Browser / PWA (React 19 + TypeScript + Vite)
      │
      ├── src/features/*        UI screens (auth, rider, driver, landing)
      ├── src/components/*      brand, ui, illustrations, map (ComutaMap)
      ├── src/layouts/*         AuthLayout, AppLayout, OfflineBanner
      ├── src/store/            Zustand store — single UI source of truth
      │                         persisted to localStorage ("comuta.pwa.v2")
      ├── src/services/*        MOCK backend facade — the ONLY mutation layer
      └── src/data/seed.ts      deterministic seed (relative dates, auto-refresh)
```

**Key principle:** every domain interaction goes through a service (`authService`, `tripService`, `bookingService`, `paymentService`, `routeService`, `driverService`, `notificationService`, `safetyService`, `supportService`). The UI never touches storage directly. This is exactly the seam where real HTTP clients replace mocks in Phase 1.

## Tech stack (locked for Phase 0, carries forward)

| Concern | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript (strict) | Type-safe domain model; strict CI gate |
| Build | Vite | Fast dev, PWA plugin, SSR middleware for smoke tests |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/index.css`) | Brand tokens, design consistency |
| Routing | React Router v7 | Multi-page public site + guarded app routes |
| State | Zustand + `persist` | Single source, minimal boilerplate |
| Motion | Motion (Framer Motion) | COMUTA duration/easing system (`src/constants`) |
| Icons | lucide-react | Consistent stroke set |
| PWA | vite-plugin-pwa (Workbox) | Installable, offline shell, precache, navigate fallback |
| Maps | `ComutaMap` (SVG corridor abstraction) | Swappable with Mapbox/Google at one component boundary |
| Testing | Node SSR smoke suite + `happy-dom` | Catches runtime crashes per screen |

## Repository map

```text
src/
  App.tsx                 Router + guards (auth, KYC, driver)
  index.css               Tailwind theme — brand tokens, motion, a11y
  types/index.ts          Domain model — mirrors future API contracts
  constants/index.ts      Motion, status labels, pricing, test accounts
  data/seed.ts            Deterministic mock data
  store/index.ts          Zustand store (persisted)
  services/               Mock facade — swap point for real APIs
  components/             brand/ ui/ illustrations/ map/
  layouts/                AuthLayout, AppLayout (mobile bottom nav + desktop sidebar)
  features/               auth/ rider/ driver/ landing/
  utils/                  dates.ts, format.ts, geo.ts (distance/duration estimates)
scripts/
  smoke.mjs               SSR smoke across routes
  smoke-services.mjs      Service-layer smoke
  dbg2.mjs                Debug helper
public/
  manifest.webmanifest    PWA manifest + shortcuts
  sitemap.xml, robots.txt Public SEO
  icons/                  PNG + maskable icons
docs/
  cross-platform-mobile.md  Mobile strategy (source for Phase 2)
```

## Domain model (current types — `src/types/index.ts`)

Core entities: `User`, `Vehicle`, `DriverProfile`, `Hub`, `RecurringRoute`, `Trip`, `Booking`, `Payment`, `AppNotification`, `TrustedContact`, `Incident`, `SupportTicket`, `SearchQuery`, `PayoutRecord`.

```text
User 1─N Booking N─1 Trip N─1 DriverProfile 1─1 User
                        │
            Hub (from/to) ── RecurringRoute ── Trips
Vehicle 1─1 DriverProfile
Payment 1─1 Booking      PayoutRecord N─1 DriverProfile
Incident N─1 Trip        SupportTicket N─1 User
TrustedContact N─1 User  AppNotification N─1 User
```

This model is deliberately shaped like the future API contract so the migration is mechanical: type → schema, service → endpoint, store → server state.

## State machines (client currently mirrors; server must own in Phase 1)

```text
Trip:        scheduled → confirmation_pending → confirmed
                      ↘ at_risk ↘                ↘ pickup → departed → in_transit → completed
                      ↘ cancelled
Payment:     pending → processing → successful | failed → refunded
Verification: pending → under_review → verified | rejected
Booking:     confirmed → cancelled | completed | refunded
```

## Target architecture (Phase 1–2)

```text
┌── Web PWA (React/Vite) ───────────────┐   ┌── Mobile (Expo RN) ───────────────┐
│  features/ components/                │   │  Expo Router groups (rider/driver) │
│  api-client (generated from OpenAPI)  │   │  api-client (same generated client)│
└──────────────┬────────────────────────┘   └──────────────┬────────────────────┘
               │  HTTPS JSON            Socket.IO │
┌──────────────▼──────────────────────────────────▼────────┐
│  services/api  (NestJS) — auth, trips, bookings, payments│
│  contracts/domain shared packages, idempotency, guards   │
└──────┬──────────────────────────┬─────────────────────────┘
       │                          │ (BullMQ jobs)
┌──────▼──────────┬───────────────▼─────────────────────────┐
│ PostgreSQL+     │ Redis   │ Paystack │ SMS/OTP │ Mapbox / │
│ PostGIS         │ queues  │ webhooks │ provider │ Google   │
└─────────────────┴─────────┴──────────┴──────────┴──────────┘
```

## Non-functional requirements (target)

| Area | Target |
| --- | --- |
| Availability | 99.5% during pilot hours (05:00–22:00 WAT); 99.9% post-pilot |
| Latency | API p95 < 300 ms excluding maps; booking mutation < 800 ms |
| Consistency | No double seat booking — DB constraint + idempotency keys |
| Security | TLS only; secrets in env, never in client bundle; OWASP Top-10 review; pen test before pilot |
| Privacy | NDPR-compliant; data minimization; background-location consent & kill-switch |
| Observability | Logs/traces/metrics + dashboards in `infrastructure/monitoring`; Sentry on mobile |
| Accessibility | WCAG 2.1 AA; 44px targets; reduced motion; focus-visible (already in Phase 0) |
| Offline | PWA shell offline; mobile offline queue for non-critical actions |
