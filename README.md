# PadiGo

**PadiGo** is Nigeria's trusted recurring carpool network: *Your people. Your route. Half the cost.*

This repository is a working web MVP of the rider app, driver app and operations centre, with a client-side marketplace engine (matching, pricing, bookings, trip PIN, chat, SOS and an immutable wallet ledger).

- **Marketing website** at `/`
- **Product** at `/app` — phone/OTP auth, rider + driver workspaces
- **Operations centre** at `/ops`

### Demo login

Continue as **Olabisi**, or sign in with any Nigerian number. Prototype OTP is always **`4827`**.

## Run locally

```bash
npm install
npm run dev
```

The Vite server binds to `0.0.0.0:4173`.

```bash
npm run build
npm run preview
```

## Product paths

| Path | Surface |
| --- | --- |
| `/` | Marketing home |
| `/how-it-works` | Product method and matching |
| `/safety` | Verification and trip safety |
| `/communities` | Trusted community networks |
| `/drivers` | Driver proposition and workflow |
| `/about`, `/help`, `/privacy`, `/terms` | Company, support and policy pages |
| `/app/rider/home` | Rider home |
| `/app/rider/explore` | Ranked ride matches |
| `/app/rider/trips` | Active and scheduled trips |
| `/app/rider/communities` | Rider communities |
| `/app/rider/profile` | Rider profile and trust |
| `/app/driver/home` | Driver home |
| `/app/driver/rides` | Driver schedule and trip controls |
| `/app/driver/requests` | Passenger requests |
| `/app/driver/earnings` | Earnings, settlements and payouts |
| `/app/driver/profile` | Driver profile and verification |
| `/ops/control-centre` | Operations overview |
| `/ops/live-trips`, `/ops/analytics`, `/ops/reports` | Monitoring and intelligence |
| `/ops/users`, `/ops/drivers`, `/ops/vehicles`, `/ops/trips`, `/ops/bookings` | Marketplace operations |
| `/ops/communities`, `/ops/pricing`, `/ops/promotions` | Community and growth operations |
| `/ops/verification`, `/ops/safety`, `/ops/disputes` | Trust and safety operations |
| `/ops/payments`, `/ops/refunds`, `/ops/payouts` | Finance operations |
| `/ops/settings`, `/ops/audit-logs` | Platform controls and accountability |

## Interactive flows

### Rider

1. Select **Find a ride**.
2. Confirm Ajah → Victoria Island and a recurring schedule.
3. Compare route matches in **Explore**.
4. Open a driver, inspect verification and vehicle details.
5. Request a seat, choose payment, and reach confirmation.
6. Open **Trips** for live tracking, masked communication, sharing and safety tools.

### Driver

1. Switch to **Driver** in the sidebar or profile.
2. Select **Offer a ride**.
3. Complete route, recurring schedule, seats and contribution.
4. Review incoming passenger requests.
5. Inspect upcoming rides and earnings/payout activity.

### Operations

Open `/ops` to review live trips, route-deviation alerts, corridor demand/supply, verification applications, payment signals and marketplace conversion.

## Design direction

PadiGo deliberately avoids looking like a generic instant-ride clone. The visual system uses:

- deep forest green for trust and operational confidence;
- fresh lime for shared-route and live-state emphasis;
- warm orange for human/community accents;
- cream and soft greys for an approachable Nigerian commuter product;
- route-first cards, explicit verification signals and recurring-commute language throughout.

The UI is original, with product-pattern inspiration drawn from leading mobility platforms while retaining PadiGo's own positioning: **Your route. Your people. Your commute.**

## Technical notes

- React + TypeScript + Vite
- Responsive/PWA-ready web application
- Lucide icon system
- URL-based surface switching with browser history support
- Local deterministic data for the prototype, with interaction state modelled in React
- CSS-generated map and route previews to avoid exposing API keys in the client prototype

The product is ready to connect to the proposed NestJS, PostGIS and Redis services. Payment, identity, live location, messaging and emergency actions are intentionally demonstrated without initiating real external transactions or emergency calls.

## Cross platform mobile

The production mobile client should be one Expo and React Native application for iOS and Android, with protected Rider and Driver route groups and a verified role switch. It should reuse API contracts and design tokens rather than wrapping the website or attempting to share DOM components.

The implementation architecture, native capability choices, backend boundaries, navigation map and delivery sequence are documented in [`docs/cross-platform-mobile.md`](docs/cross-platform-mobile.md).
