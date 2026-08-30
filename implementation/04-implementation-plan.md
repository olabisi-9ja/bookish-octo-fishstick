# 04 — Implementation Plan

This is the master plan. It extends the existing mobile strategy in [`docs/cross-platform-mobile.md`](../docs/cross-platform-mobile.md) into a full implementation roadmap. Phases are sequenced by dependency, not by calendar; durations are engineering estimates for a small senior team (2–3 engineers + part-time design).

---

## Phase 0 — Prototype (COMPLETE)

| Item | Status |
| --- | --- |
| Frontend PWA (rider + driver + landing) | ✅ Done |
| Mock services facade for all domains | ✅ Done |
| Design system, brand, illustrations, motion | ✅ Done |
| PWA installability + offline shell | ✅ Done |
| 23-screen SSR smoke suite | ✅ Done |
| Mobile strategy document | ✅ Done (`docs/`) |

**Exit criteria met:** a reviewer can log in, complete the full rider loop and full driver loop, and describe the product from the screens. No further investment in mock fidelity — next work is real infrastructure.

---

## Phase 1 — Backend & API ("single source of truth")

**Goal:** replace mocked services with a real API and database, without rewriting the UI. UI depends on `src/services/*` facades only, so interface-compatible HTTP clients slot in behind the same functions.

### Deliverables
1. **Monorepo foundation** — `services/api` (NestJS or Supabase functions), `packages/contracts` (shared schemas/enums), `packages/domain` (validation/formatting), `packages/api-client` (typed client), `infrastructure/docker` (PostgreSQL + PostGIS + Redis), `infrastructure/terraform` (hosted envs), `infrastructure/monitoring`.
2. **Identity & auth** — email + phone OTP (SMS provider), session/refresh handling, password policy, KYC verification workflow (NIN / licence / voter card / passport), role & guard rules. Remove `TEST_ACCOUNTS` and `MOCK_OTP` from production build.
3. **Domain APIs (versioned `/v1`)** — hubs, routes, trips, bookings, seat inventory (concurrency-safe), payments, driver commitments (T-8), safety, earnings/payouts, notifications, support.
4. **State authority** — server-enforced: matching/ranking, seat reservation, booking & trip transitions, payment amounts/settlement, verification status, permissions, safety escalations. Client never decides these.
5. **Realtime** — Socket.IO gateway with authorized rooms: booking status changed, passenger request received, trip status changed, driver location updated, chat message created, route deviation detected, safety case updated, payout status changed.
6. **Payments (real)** — Paystack popup/redirect, server-side verification via webhook, idempotency keys, refunds, reconciliation jobs; payout scheduling for drivers.
7. **Maps (real)** — Mapbox/Google: geocoding hubs/corridors, route geometry, ETA/price hints; `ComutaMap` component swap only.
8. **Ops seed** — minimal admin surface for vetting, hub management, incident triage (full ops console is Phase 4).

### Exit criteria
- Rider and driver loops work **live across two devices** (create account → book → confirm → pay → trip → payout) with the same database.
- Seat reservation is provably race-safe (concurrent booking test).
- Payment webhook is the only way a booking becomes paid; mock checkout removed.
- `contracts` package is the single schema source; generated typed client used by web (and later mobile).
- Postman/OpenAPI spec exported; every endpoint has tests.

**Duration estimate: 8–12 weeks** (1 full-stack + 1 backend/DevOps, design part-time).

---

## Phase 2 — Native Mobile App (Expo + React Native)

**Goal:** one iOS/Android app with runtime role switch (rider/driver), native maps, push, permissions, background location. **Do not** wrap the website in a WebView.

### Deliverables (from `docs/cross-platform-mobile.md`)
1. **Workspace + shared contracts** first (Phase 1 `packages/contracts` reused).
2. Auth: phone + OTP, profile, emergency contact, identity verification.
3. Rider: home, search, matches, ride details, checkout, trips, trip detail, profile.
4. Driver: home, onboarding, publish ride, passenger requests, rides, trip detail, earnings, payouts.
5. Active trip: native map, Socket.IO trip events, chat, sharing, SOS.
6. History, ratings, receipts, earnings, payouts.
7. Offline handling, accessibility, analytics, release monitoring (Sentry), EAS Build/Submit/Update.
8. Device testing on low-memory Android + current iPhones.
9. Privacy, background-location and store-review materials.
10. Internal test → constrained Lagos corridor pilot.

### Engineering guardrails
- TanStack Query for server state; Zustand only for small session/flow state; RHF + Zod for forms.
- Expo SecureStore for tokens; Expo Notifications; Expo Location + Task Manager (foreground only during search/pickup; background only during active driver trips with clear pre-prompt).
- Native maps via React Native Maps; no shared React DOM components (share contracts/domain/design tokens only).
- Apple/Google payment-policy check before store submission.

**Duration estimate: 10–14 weeks** (1 mobile engineer; can start in parallel with Phase 1 as soon as contracts are set).

---

## Phase 3 — Pilot: Ikorodu → Victoria Island corridor

**Goal:** a live, closed-group, real-money service on one corridor — proof of operations, not scale.

### Deliverables
1. Recruit + vet 10–15 drivers (identity, licence, vehicle, T&Cs, training, insurance).
2. Stand up 2–4 approved hubs with marshals/camera (Ikorodu Hub, VI Hub, maybe Yaba/Oniru).
3. Rider acquisition: employee/estate groups on the corridor (invite codes), not open marketing.
4. Live support + safety escalation rota; 2-minute SOS response target.
5. Pricing policy locked (see [03](03-product-scope.md)); promotional pricing for pilot.
6. Pilot metrics dashboard (see `10 — Rollout & Launch`).
7. Weekly retro → iteration cadence.

### Exit criteria
- ≥ 60 completed trips/week for 4 consecutive weeks.
- ≥ 85% T-8 confirmations; on-time ≥ 90%; refunds ≤ 10%.
- Zero critical safety incidents; SOS drill passed at least twice.

**Duration estimate: 6–8 weeks** (mostly ops; engineering is bug-fix/hardening).

---

## Phase 4 — Scale

1. Additional corridors (Ajah → VI, Lekki → VI, then Ikeja → VI).
2. **Ops console** at production quality: vetting pipeline, hub management, incident triage, driver analytics, refunds, support macros.
3. Growth: referral/invite loops, corporate/estate plans, seasonal pricing, waitlist mechanics.
4. Data: metrics warehouse, experimentation, churn/repeat-rate analysis.
5. Security hardening: pen-test, SOC2-style process start, backup/DR drills.

---

## Cross-cutting workstreams (run throughout)

| Workstream | Responsibility | Notes |
| --- | --- | --- |
| Contracts & API | Backend | Single source of schema truth; generated clients |
| Design system | Design | Tokens shared across web/mobile; brand in `src/index.css` |
| QA & automation | All | Smoke suite grows; add Playwright E2E in Phase 1 |
| Security & compliance | Ops/legal | Data protection, vetting, payments, background-location consents |
| Analytics | Product | Event catalogue in `packages/analytics`; pilot KPIs first |
| Release management | Engineering | Dev/staging/prod; EAS; staged rollouts; rollback path |

---

## Dependency summary

```text
Phase 0 (done)
   │
   ├──► Phase 1 (backend) ──► Phase 3 (pilot) ──► Phase 4 (scale)
   │              ▲
   └──► Phase 2 (mobile) ────┘   (needs contracts from Phase 1)
```

Mobile and backend both derive from `packages/contracts`; nothing else is coupled across platforms.
