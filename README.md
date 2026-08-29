# Comuta

**Comuta** is Nigeria's trusted recurring carpool network: *Your route. Your people. Your commute.*

This repository is a working web MVP of the rider app, driver app and operations centre, with a client-side marketplace engine (matching, pricing, bookings, trip PIN, chat, SOS and an immutable wallet ledger).

- **Marketing website** at `/`
- **Product** at `/app`, phone/OTP auth, rider + driver workspaces
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

## Brand system

### Identity

- **Name:** Comuta (suggestive of "commute"); movement, efficiency, everyday mobility.
- **Logo:** a dark forest green circle holding two vertical bars, one white, one vibrant lime green, symbolising a road, a pathway and an abstract "C". The mark lives in `src/components/Brand.tsx` and the app icon in `public/comuta-icon.svg`.

### Colour palette

| Role | Tokens | Meaning |
| --- | --- | --- |
| Primary, Dark Forest Green | `--forest-950…500`, legacy `--green-950…600` | Trust, stability, nature |
| Accent, Vibrant Lime Green | `--lime`, `--lime-600`, `--lime-soft` | Energy, growth, freshness |
| Supporting, Teal / Blue-gray | `--teal-700…50`, `--slate-700…100` | Technology, calm |
| Supporting, Black / Gray | `--ink`, `--muted`, `--line`, `--cream`, `--sand` | Sophistication |
| Alerts, Red scale | `--red-700…50` | Warnings, safety, SOS |

All surfaces draw from these tokens in `src/styles.css`; alert and warning states use the red scale, live/route accents use the lime accent, and secondary data accents use teal/blue-gray.

### Typography

One highly legible, clean geometric sans-serif, **Manrope** (400-800), carries every text role:

| Role | Token | Usage |
| --- | --- | --- |
| Display | `--font-display` | Hero and manifest statements |
| Headline | `--font-headline` | Section titles |
| Title | `--font-title` | Card and panel titles, wordmark |
| Body | `--font-body` | Paragraphs, controls |
| Caption | `--font-caption` | Uppercase kickers, labels, metadata |

### UI elements

- Minimalist, rounded-corner buttons with a single primary action per screen. The onboarding flow is driven by a consistent **Continue** button.
- Social sign-in options (**Continue with Apple**, **Continue with Google**) alongside phone sign-in in the auth flow.
- Clean, rounded input fields for **ID type** and **Location** during profile setup, plus phone, name and emergency-contact fields.
- Rounded corners throughout (cards, chips, modals, inputs) for a calm, frictionless feel.
- Official **App Store** and **Google Play** badges in the mobile download section, linked to the launch listing. The badge artwork is served unmodified from Apple's and Google's official asset services per their marketing guidelines (set `APP_STORE_LINK` / `GOOGLE_PLAY_LINK` in `src/components/MarketingUi.tsx` once live).
- A flat vector illustration system (`src/components/Illustrations.tsx` plus `public/images/illustrations/commute-hero.svg`) replaces photographic / AI-generated imagery on the public pages. People are drawn as clean 2D vector avatars, corridors and carpool crews appear as flat scenes, and all cards use the brand palette.

### Brand values

- **Trust & Security**, dark forest palette, identity/ID-type verification, location context, layered safety signals.
- **Simplicity & Clarity**, minimal UI, generous whitespace, one geometric typeface, immediate answers.
- **Sustainability & Vitality**, deep forest green with vibrant lime accents.
- **Efficiency & Mobility**, the name and the road-like bars in the mark communicate movement, speed and effortless navigation.
- **Modernity & Innovation**, geometric logo, social sign-in, structured token scales, contemporary components.
- **Professionalism & Versatility**, organized colour scales and a fixed type hierarchy keep the brand consistent across web, PWA and (future) mobile.

The UI is original, with product-pattern inspiration drawn from leading mobility platforms while retaining Comuta's own positioning: **Your route. Your people. Your commute.**

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
