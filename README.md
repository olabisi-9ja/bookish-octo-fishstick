# PadiGo

A polished, responsive product prototype for **Nigeria's trusted recurring carpool network**.

The repository currently presents three connected product surfaces:

- **Marketing website** at `/` — positioning, commute search, popular corridors, recurring-carpool education, communities, safety, and driver acquisition.
- **Rider/driver product** at `/app` — one responsive application with a role switcher, mobile bottom navigation, desktop shell, ride discovery, booking/payment flow, live trip, safety centre, communities, driver offers, passenger requests, and earnings.
- **Operations centre** at `/ops` — live marketplace health, active trips, safety review, corridor liquidity, conversion funnel, verification queue, finance and support signals.

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
| `/` | Marketing website |
| `/app` | Responsive rider/driver app |
| `/ops` | Admin and operations centre |

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

The product is ready to connect to the proposed NestJS/PostGIS/Redis services. Payment, identity, live location, messaging and emergency actions are intentionally demonstrated without initiating real external transactions or emergency calls.
