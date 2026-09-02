# 06 — Backend Integration Spec

**Purpose:** define the Phase 1 API surface that replaces the mocked services in `src/services/*`, plus third-party integrations. Versioned under `/v1`. All request/response schemas live in `packages/contracts` and are generated into a typed client consumed by web and mobile.

> Migration rule: **no UI changes to swap mock → real.** Each service in `src/services/*` becomes a thin HTTP client with the same method signatures (now async, already async). UI never imports storage or endpoints directly.

---

## Integration map (current mock → target)

| Domain | Now (`src/services/`) | Phase 1 target |
| --- | --- | --- |
| Auth | `authService` (local accounts, fixed OTP) | Auth endpoints + SMS OTP provider; remove `TEST_ACCOUNTS`/`MOCK_OTP` from prod |
| Trips | `tripService` (search/detail/upcoming/history) | `/trips`, `/search`, `/hubs`, `/routes` |
| Bookings | `bookingService` | `/bookings` (seat-safe, idempotent) |
| Payments | `paymentService` (mock checkout) | Paystack transaction create + webhook verify + refunds |
| Routes/recurring | `routeService` | `/routes` CRUD + schedule generation |
| Drivers | `driverService` (commitments, publish, manifest) | `/driver/*` endpoints, T-8 job in BullMQ |
| Notifications | `notificationService` | Notification service + push (Expo/APNs/FCM) |
| Safety | `safetyService` (SOS, share, deviation) | `/safety/*` + Socket.IO events, escalation |
| Support | `supportService` | `/support` tickets + threads |
| Earnings | (in driver flow) | `/earnings`, `/payouts` (Paystack transfers) |

---

## Endpoint groups (draft)

### Auth & identity
```
POST /v1/auth/otp/send          { phone }                 → requestId, expiresIn
POST /v1/auth/otp/verify        { phone, otp }            → accessToken, refreshToken, user
POST /v1/auth/refresh                                           → new tokens
POST /v1/auth/logout
GET  /v1/me                                                      → user, role, verification
POST /v1/me/kyc                  { idType, idNumber, details }   → under_review
POST /v1/me/emergency-contact    { name, phone, relation }
```

### Hubs, routes & trips
```
GET  /v1/hubs                     → approved hubs (with geo)
GET  /v1/routes?corridor=…        → recurring routes
POST /v1/routes                   → create recurring route (driver)
PATCH /v1/routes/:id              → pause/skip/cancel
GET  /v1/trips/search             { fromHub, toHub, date, time } → ranked matches
GET  /v1/trips/:id                → trip + driver trust + vehicle + availability
POST /v1/trips/:id/confirm        → driver T-8 confirmation
GET  /v1/trips/upcoming | /history
```

### Bookings & payments
```
POST /v1/bookings                 { tripId, seats }        → 409 if inventory gone (server-authoritative)
GET  /v1/bookings/:id
POST /v1/bookings/:id/cancel      → refund initiated
POST /v1/payments/initialize      { bookingId }            → Paystack authorization_url
POST /v1/payments/webhook/paystack                          → verify + mark paid (only success path)
POST /v1/payments/:id/refund
GET  /v1/payments/:id
```

Rules: number of seats **never** trusted from client; booking locked with `SELECT … FOR UPDATE` / unique constraint; idempotency key on create; payment success only on server-side webhook verification. Client redirects are informational.

### Driver & earnings
```
POST /v1/driver/trips              → publish
GET  /v1/driver/trips/:id          → passenger manifest + per-rider PINs
GET  /v1/driver/reliability
GET  /v1/driver/earnings
GET  /v1/driver/payouts
POST /v1/driver/payouts/request
```

### Safety & realtime (Socket.IO, room-based, server-authorized)
```
room join:  trip:{tripId}        (members only)
events: booking.status.changed | trip.status.changed | passenger.request.received |
        driver.location.updated | route.deviation.detected | chat.message.created |
        safety.case.updated | payout.status.changed

POST /v1/safety/share    { tripId, contacts[] }
POST /v1/safety/sos      { tripId, coords, note }   → creates open case, escalates ops, notifies contacts
```

### Notifications & support
```
GET  /v1/notifications            → inbox (typed kinds, paginated)
POST /v1/notifications/read
POST /v1/support/tickets
POST /v1/support/tickets/:id/messages
```

---

## Backend authority — what the server decides (never the client)

- Matching scores and candidate ranking
- Seat inventory and concurrent reservation
- Booking/trip/payment state transitions
- Payment amounts, settlement, payout decisions
- Verification status and role permissions
- Safety case creation, priority and escalation

---

## Third-party integrations

| Vendor | Use | Key notes |
| --- | --- | --- |
| **Supabase** or **self-hosted NestJS + PostgreSQL/PostGIS** | Choose as core backend | Supabase = fastest to pilot; NestJS = more control. Decision needed (see 01) |
| **Paystack** | Payments, refunds, transfers | Verify via webhook; idempotency; NGN; test keys in dev; never bundle secret keys |
| **Mapbox** (recommended) or Google Maps | Geocoding, route geometry, ETA, live map | Swap `ComutaMap` only; keep SVG abstraction for fallback offline |
| **SMS provider** (Termii/Twilio) | OTP + notifications | Pilot: Termii or Twilio; rate-limit and cost-capped |
| **Expo Notifications / FCM / APNs** | Push | Tokens in SecureStore on mobile; mapping server-side |
| **Sentry** | Crash + perf | Web and mobile |
| **PostGIS / Redis / BullMQ** | Geo queries, queues/jobs | T-8 reminders, payment reconciliation, notification fan-out |
| **Terraform + Docker** | Environments | `infrastructure/` from day one |

---

## Environment & secrets

- `.env` is git-ignored; `.env.example` committed. Secrets live only in server env (Paystack keys, SMS keys, signing material).
- Environments: `development` → `staging` → `production` (separate app IDs/keys on mobile).
- Public config (maps key, API base URL) may be injected at build time; nothing sensitive ever ships to clients.
- CI runs typecheck → unit tests → integration tests → build → deploy staging; production via staged rollout with rollback.

## Contract-first workflow

1. Edit schema in `packages/contracts` (OpenAPI/Zod).
2. `npm run generate` → typed client for web + mobile.
3. Backend implements against test fixtures generated from the contract.
4. PR CI fails if client and server schemas drift.
