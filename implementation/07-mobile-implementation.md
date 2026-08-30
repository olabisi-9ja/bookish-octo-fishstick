# 07 — Mobile Implementation

**Source strategy:** [`docs/cross-platform-mobile.md`](../docs/cross-platform-mobile.md) is the authoritative mobile plan; this page turns it into a concrete build spec for Phase 2 and adds the acceptance checklist.

## Recommendation (unchanged)

Build **one Expo + React Native app** (iOS + Android) with a runtime role switch between Rider and Driver. Keep the operations product as a separate React web app. **Do not** package the website in a WebView — the PWA is the interaction reference only; native navigation, maps, permissions, notifications and background location require a native client.

## Monorepo shape (shared with Phase 1)

```text
apps/
  mobile/               Expo + React Native (Expo Router, TypeScript)
  admin/                React + Vite ops console (Phase 4)
services/
  api/                  NestJS API + Socket.IO gateway
packages/
  contracts/            API schemas, event names, state enums   ← shared source of truth
  domain/               Pure validation + formatting
  design-tokens/        Colors, spacing, typography, icons
  api-client/           Generated typed client (web + mobile)
  analytics/            Event catalogue
infrastructure/
  docker/               Local PostgreSQL, PostGIS, Redis
  terraform/            Hosted environments
  monitoring/           Logs, traces, alerts, dashboards
```

**Share:** contracts, domain types, design tokens. **Do not share:** React DOM components with React Native.

## Stack

- Expo + TypeScript + Expo Router; React Native (iOS + Android)
- TanStack Query (server state, retries); Zustand (small session/flow state only)
- React Hook Form + Zod (onboarding, ride forms)
- Expo SecureStore (refresh tokens, device secrets)
- Expo Notifications (push); Expo Location + Task Manager (background location, permission-gated)
- React Native Maps (routes, pickup points, active trips)
- Socket.IO client (trip events, chat, safety)
- Sentry (crashes, traces); EAS Build / Submit / Update

## Navigation model

```text
(auth)          phone → otp → profile → emergency-contact → identity-verification

(rider)         home → search → matches → ride/[rideId] → checkout/[bookingId]
                → trips → trip/[tripId] → profile

(driver)        home → onboarding → offer → requests → rides
                → trip/[tripId] → earnings → payouts → profile

(shared)        notifications → chat/[tripId] → safety/[tripId] → settings → support
```

Rider and Driver are route groups in one app. A verified account switches roles without reinstalling. Driver screens stay guarded until onboarding is approved.

## Build order (delivery milestones)

| # | Milestone | Acceptance |
| --- | --- | --- |
| M1 | Workspace, contracts, api-client wired | Mobile builds; typed API calls hit mocked-but-shape-correct responses |
| M2 | Auth: phone + OTP + profile + role switch | Real device OTP; session persists; role switch works |
| M3 | Rider search → matches → ride detail → checkout | Ranked matches from API; seat inventory correct; purchase flow completes |
| M4 | Driver onboarding → publish → requests | Driver creates recurring route; request arrives; T-8 flow works |
| M5 | Active trip + realtime + safety | Live map updates; chat; share; SOS creates case; deviation alert |
| M6 | History, ratings, receipts, earnings, payouts | Receipts match Paystack; payout status events |
| M7 | Offline, a11y, analytics, release hardening | Offline mode for reads; Sentry; audit events |
| M8 | Device testing (low-memory Android + current iPhone) | No crashes on both; battery drain acceptable |
| M9 | Store submission materials | Privacy policy, background-location consent, screenshots, policy review |

## Permissions & location (strict rules)

- **Foreground location only** during search and pickup selection.
- **Background location only** when a **driver starts an active trip**; explain why before the OS prompt.
- Battery-aware intervals; signed trip-room access; server-side deviation checks; automatic location shutdown at terminal trip state.
- SOS: send active trip, member, latest coordinates and emergency contacts to the API **before** offering a phone-call action.

## Payments on mobile

- API creates Paystack transactions; mobile opens the approved payment experience (widget/redirect) and **waits for backend confirmation** — a successful client redirect alone never marks a booking paid.
- Confirm Apple/Google policy compatibility for shared-transport external payment flow before store submission.

## Release management

- Dev/staging/prod app identifiers; secrets out of the Expo bundle.
- CI: typecheck → tests → build both platforms → publish preview builds for approved PRs.
- Production: staged rollout, crash monitoring, documented rollback path.
- Training/ops: internal TestFlight + Play internal testing before pilot distribution.

## Open questions (engineering lead to resolve in Phase 2)

1. Exact permission strategy for drivers on low-power Android devices (location interval/thresholds).
2. Chat scope: driver–rider only vs. group trip chat — safety moderation rules.
3. Map provider final choice (Mapbox licensing vs Google) — and offline map fallback behavior.
4. SSO/biometrics (FaceID/Android Biometric) timeline.
