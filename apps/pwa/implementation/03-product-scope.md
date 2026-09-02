# 03 — Product Scope

## The product in one sentence

COMUTA is a **planned shared-commuting marketplace**: verified drivers publish scheduled seat supply on recurring corridors; riders book ahead with certainty instead of hailing.

## Who it is for

| Persona | Need | COMUTA answer |
| --- | --- | --- |
| **Daily commuter** (rider) | Predictable, affordable, safe ride to work | Booked seat, verified driver, hub pickup, protected booking |
| **Driver with spare seats** | Recover part of travel cost without becoming a taxi | Scheduled recurring route, booked passengers, T-8 commitment, payout per trip |
| **Fleet / company / estate** | Reliable employee/resident mobility | Corridor routes from approved hubs; monitored, staffed pickups |
| **Operations (internal)** | Vetting, monitoring, incident handling | Driver vetting funnel, support console, safety escalation (Phase 3+) |

## Corridors in scope (v1)

| Corridor (from → to) | Status |
| --- | --- |
| Ikorodu → Victoria Island | **Pilot corridor (recommended)** |
| Ajah → Victoria Island | Launch wave 2 |
| Lekki Phase 1 → Victoria Island | Launch wave 2 |
| Ikeja → Victoria Island | Launch wave 3 |
| Yaba, Chevron, Oniru, Sangotedo hubs | Expansion (hub network grows with corridors) |

Hubs are **approved only** — verified, monitored, staffed locations (see `src/data/seed.ts`). No random street pickups.

## Price model (current prototype constants — `src/constants/index.ts`)

```
recommended price = max(₦900, base ₦400 + ₦40/km + duration-min × ₦4)
platform rate     = 9%
solo taxi compare = max(₦800, ₦400 + ₦45/km + duration-min × ₦8 + ₦120 protection)
```

- Prices are **per seat**, rounded to ₦50.
- Live pricing/back-end rules (dynamic bands, commissions, surge on events) are Phase 1 design work — the current formula is a placeholder that has been used to shape the UI.

## Journey states (product truth)

- **Trip**: `scheduled → confirmation_pending → confirmed → (at_risk) → pickup → departed → in_transit → completed → cancelled`
- **Payment**: `pending → processing → successful / failed → refunded`
- **Verification**: `pending → under_review → verified / rejected`
- **Booking**: `confirmed → cancelled / completed / refunded`

## Safety model (non-negotiable scope items)

1. **Approved hubs only** — every pickup/drop-off at a verified monitored location.
2. **Driver commitment (T-8)** — drivers confirm by 11:00 PM the night before, so riders can plan around certainty.
3. **Recovery, not dead ends** — if a driver drops, booking is protected: alternatives or full refund.
4. **Trip PIN, live sharing, SOS** — visible, calm, immediate safety; route-deviation detection.
5. **Verified identity + vehicle** — KYC/ID validation, licence + vehicle registration before a driver can publish.

## Explicitly OUT of scope (v1) — kept out on purpose

- ❌ General on-demand hailing (Uber/Bolt clone territory) — **we do not do this.**
- ❌ Communities/"Circles" or social feeds between riders.
- ❌ Rider-to-rider chat (driver-rider trip chat is Phase 2+, scoped in [07](07-mobile-implementation.md)).
- ❌ Demo-account UI — test accounts are seed data only, never surfaced in product.
- ❌ Multi-city expansion before the Lagos pilot works.
- ❌ Ride-hailing for one-off ad-hoc trips; recurring scheduled supply first.

## Success criteria at pilot (Phase 3)

| Metric | Pilot target |
| --- | --- |
| Weekly completed trips on Ikorodu → VI | ≥ 60 |
| On-time departure rate | ≥ 90% |
| Driver confirmation rate by T-8 | ≥ 85% |
| Cancellation/refund rate | ≤ 10% |
| Repeat rider usage (2+ trips/month) | ≥ 40% |
| Safety incidents | 0 critical; all SOS escalated within 2 min |
