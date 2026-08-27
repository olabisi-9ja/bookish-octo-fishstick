# COMUTA

> **“My daily commute is already taken care of.”**  
> *Not: “Find a driver right now.”*

**COMUTA** is Nigeria’s corridor-based shared commute platform designed for scheduled, predictable daily travel between major Lagos transit hubs (featuring the flagship **Ikorodu Hub ↔ Victoria Island Hub** arterial corridor).

---

## 1. Product Architecture

COMUTA is built as **three experiences on one design system**:

1. **Mobile Application (Single codebase, Rider + Driver modes)**
   - **Rider Mode**: Home, Plan commute, Search (Available trips with 35–40% corridor map), Trip detail, Booking review, Paystack payment, Confirmed illustration, Meet driver / Pickup (Trip PIN `4827`), Active trip (ETA 32 min, SOS & Share), Completion, Recurring commute calendar subscription, and At-risk recovery.
   - **Driver Mode**: Home, T-8 Commitment (deadline countdown & "You're committed" motion), Publish commute, Passenger management, Pickup PIN verification, 98% Operational reliability, and Cost recovery ledger.
   - **Shared Core**: Auth, NIN KYC, Safety, Escrow payments, and Trip states.
2. **Operations Dashboard (Operations-First)**
   - Answering *“What needs intervention?”*: 12 active trips, 3 at-risk trips, 7 unconfirmed drivers, 2 incidents, 4 failed payments.
   - Live corridor dispatch map, at-risk recovery workbench, and 7 navigation families (Operations, Marketplace, Money, Safety, Quality, Intelligence, Configuration).
3. **Public Web Platform**
   - Hero: *"Your commute. Shared. Simpler."*
   - Visual storytelling: *Plan → Match → Reserve → Commute*
   - Driver acquisition with interactive Cost Recovery Calculator (*“Turn your empty seats into commute savings”*)
   - Designated well-lit hub directory and safety center.

---

## 2. Core Commute Journey

$$\text{Plan} \longrightarrow \text{Compare} \longrightarrow \text{Trust} \longrightarrow \text{Reserve} \longrightarrow \text{Confirm} \longrightarrow \text{Prepare} \longrightarrow \text{Pickup} \longrightarrow \text{Track} \longrightarrow \text{Complete} \longrightarrow \text{Repeat}$$

---

## 3. Figma File Structure & Build Spec (Embedded ❖)

The application includes a built-in **Figma Spec & Design System Inspector** accessible directly from the top navigation bar, mapping all 10 pages:

```text
00 — Cover / UX Principles
01 — Foundations (Colors, Typography, Spacing, Radius, Elevation, Motion)
02 — Components (Buttons, Inputs, Cards, Chips, Status, Bottom Sheets, Navigation, Maps, Trip Cards)
03 — Illustrations (Geometric minimal SVG library: Mobility, People, Trust, States, Safety)
04 — Mobile / Auth (Splash, Onboarding, Login, Signup, OTP 4827, KYC, Role)
05 — Mobile / Rider (Home, Planning, Search, Trip, Booking, Payment, Pickup, Active Trip, Completion, Recurring)
06 — Mobile / Driver (Home, Publish, Routes, Bookings, T-8, Pickup, Active Trip, Reliability, Cost Recovery)
07 — Mobile / Shared (Notifications, Safety, Support, Recovery Philosophy)
08 — Operations Dashboard (Intervention Queue, 7 Navigation Families)
09 — Public Web (Brand, Visual Storytelling, Economics Calculator, Hubs)
10 — Prototype / User Flows (Interactive MVP Spines)
```

---

## 4. Key Interactions & Signatures

- **Trip Card Hierarchy (3-Second Decision Rule)**:
  `TIME (7:00 AM ~8:05 AM) → TRUST (Adebayo K. · 98% completion) → VEHICLE (Toyota Corolla · ABC 123 XY) → PRICE (₦1,500/seat) → AVAILABILITY (2 seats left)`
- **T-8 Driver Commitment**: Evening confirmation with countdown timer before 11:00 PM cutoff, triggering verified lock or immediate passenger recovery.
- **COMUTA Recovery Philosophy**: *“Don't report a failure without presenting the next action.”* If a driver is delayed or cancels, old route fades, verified alternative is presented with 1-click reassignment or instant refund.
- **Designated Well-Lit Hubs**: Gate-specific meeting points (e.g. Ikorodu Hub Main Gate) with 4-digit departure PIN (`4827`).

---

## 5. Development & Running Locally

```bash
npm install
npm run dev
```

The Vite dev server binds to `0.0.0.0:4173` or `0.0.0.0:5173`.

```bash
npm run typecheck
npm run build
npm run preview
```
