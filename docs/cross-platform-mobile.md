# Comuta cross platform mobile plan

## Recommendation

Build one Expo and React Native application for iOS and Android with a runtime role switch between Rider and Driver. Keep the operations product as a separate React web application.

Do not package the existing website inside a WebView. The current responsive product is the interaction reference, while the mobile client should use native navigation, maps, permissions, notifications and background location.

## Proposed monorepo shape

```text
apps/
  mobile/              Expo and React Native app
  admin/               React and Vite operations app
services/
  api/                 NestJS API and Socket.IO gateway
packages/
  contracts/           API schemas, event names and state enums
  domain/              Shared pure validation and formatting
  design-tokens/       Colours, spacing, typography and icon rules
  api-client/          Generated typed API client
  analytics/           Shared event catalogue
infrastructure/
  docker/              Local PostgreSQL, PostGIS and Redis
  terraform/           Hosted environments
  monitoring/          Logs, traces, alerts and dashboards
docs/
```

Share contracts, domain types and design tokens. Do not share React DOM components with React Native. Native screens need accessible touch targets, platform navigation and mobile permission handling.

## Mobile stack

- Expo with TypeScript and Expo Router
- React Native for iOS and Android
- TanStack Query for server state and retries
- Zustand for small amounts of local session and flow state
- React Hook Form with Zod schemas for onboarding and ride forms
- Expo SecureStore for refresh tokens and device secrets
- Expo Notifications for push messaging
- Expo Location and Task Manager for permitted background trip location
- React Native Maps for routes, pickup points and active trips
- Socket.IO client for trip events, chat and safety status
- Sentry for crashes and performance traces
- EAS Build, Submit and Update for release management

## Navigation model

```text
(auth)
  phone
  otp
  profile
  emergency-contact
  identity-verification

(rider)
  home
  search
  matches
  ride/[rideId]
  checkout/[bookingId]
  trips
  trip/[tripId]
  profile

(driver)
  home
  onboarding
  offer
  requests
  rides
  trip/[tripId]
  earnings
  payouts
  profile

(shared)
  notifications
  chat/[tripId]
  safety/[tripId]
  settings
  support
```

Rider and Driver are route groups in one application. A verified account can switch roles without installing a second app. Driver only screens remain guarded until onboarding is approved.

## Backend authority

The mobile application presents state but never becomes the source of truth for:

- matching scores and candidate ranking
- seat inventory and concurrent seat reservation
- booking and trip state transitions
- payment amounts, settlement and payout decisions
- verification status
- permissions and account restrictions
- safety case creation and escalation

The NestJS API should enforce idempotency, state transition guards, role checks and transaction boundaries. PostgreSQL and PostGIS own durable marketplace and route data. Redis and BullMQ handle expiring requests, reminders, payment reconciliation and notification jobs.

## Mobile API boundaries

Start with versioned endpoints for authentication, profiles, verification, hubs, routes, trips, bookings, payments, driver commitments, safety, earnings and notifications. Generate the TypeScript client from an OpenAPI contract so web and mobile consume the same request and response definitions.

Socket.IO rooms should be authorised by the API. Suggested event families include:

- booking status changed
- passenger request received
- trip status changed
- driver location updated
- chat message created
- route deviation detected
- safety case updated
- payout status changed

## Payments

The API creates Paystack transactions and verifies callbacks. The mobile client opens the approved payment experience and waits for backend confirmation. A successful client redirect is not enough to mark a booking paid.

Use Apple and Google policies to confirm that shared transport payments remain eligible for the intended external payment flow before store submission.

## Location and safety

Request foreground location during search and pickup selection. Request background location only when a driver starts an active trip and explain the reason before the operating system prompt.

Use battery aware location intervals, signed trip room access, server side deviation checks and automatic location shutdown when the trip reaches a terminal state. SOS should send the active trip, member, latest coordinates and emergency contacts to the API before offering a phone call action.

## Delivery order

1. Create the workspace and shared API contracts.
2. Implement authentication, role switching and protected route groups.
3. Build Rider search, match details, booking and payment confirmation.
4. Build Driver onboarding, ride publishing and passenger requests.
5. Add active trip maps, Socket.IO, chat, sharing and safety controls.
6. Add history, ratings, receipts, earnings and payouts.
7. Add offline handling, accessibility, analytics and release monitoring.
8. Run device testing on representative lower memory Android devices and current iPhones.
9. Complete privacy, background location and store review materials.
10. Release to internal testing, then a constrained Lagos corridor pilot.

## Environments and releases

Use development, staging and production application identifiers. Keep secrets out of the Expo bundle. Public configuration can be injected at build time, while Paystack secrets, identity provider keys and signing material remain in the API environment.

CI should typecheck, test, build both platforms and publish preview builds for approved pull requests. Production releases should use staged rollout, crash monitoring and a documented rollback path.

## Immediate next implementation milestone

The first native milestone should deliver phone and OTP authentication, rider home, ride search, ranked matches, ride details and the role switch shell using mocked typed API responses. In parallel, establish the NestJS authentication, profile, ride and matching contracts so the client is not coupled to temporary local data.
