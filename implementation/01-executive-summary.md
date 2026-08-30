# 01 — Executive Summary

> **COMUTA — Your commute. Shared. Simpler.** A planned shared-commuting marketplace for Lagos commuters. Riders book verified seats on recurring corridor trips; drivers publish scheduled routes and commit by 11:00 PM (T-8). No hailing, no surge, no unexpected cars.

---

## The opportunity

- Lagos commuters repeat the same journeys every day on the same corridors (Ikorodu → Victoria Island, Ajah → VI, Lekki → VI, Ikeja → VI).
- Solo travel is expensive and unplanned. COMUTA turns daily repetition into a **scheduled, bookable supply** — riders plan ahead, know their seat, and travel with verified drivers at a fraction of solo cost.
- Core differentiators: **approved hubs only** (verified, monitored pickups), **driver commitment at T-8**, **protected bookings** (alternatives or refund if a driver drops), and **visible safety** (trip PIN, live sharing, SOS).

## Where we are today

- ✅ **Frontend-only PWA prototype is complete and demonstrable.** Full rider loop (plan → search → compare → book → pay → pickup → live trip → rate), full driver loop (publish → confirm → passengers → reliability → earnings), public marketing site, onboarding/KYC/OTP, safety, notifications, support.
- ✅ **Production-quality engineering baseline**: React 19 + TypeScript + Vite, Tailwind v4, Zustand persistence, React Router v7, PWA installability, 23 screens smoke-tested, strict type-checking, deterministic seeded data.
- ✅ **Mobile strategy documented** (`docs/cross-platform-mobile.md`): one Expo + React Native app for iOS/Android with rider/driver role switch.
- ⏳ **Not yet built**: real backend (database, API, auth), real payments, real maps, push notifications, native mobile app, and production operations tooling.

## What we are asking for (decisions needed)

| # | Decision | Why it matters | Deadline driver |
| --- | --- | --- | --- |
| 1 | **Approve Phase 1 — Backend build** (identity, trips, bookings) | Everything else depends on a single source of truth; mobile cannot ship without it | Month 1 |
| 2 | **Approve Phase 2 — Native mobile app** (Expo) | Primary usage is on phones; PWA alone limits installs, maps, push and store credibility | Month 2–3 |
| 3 | **Confirm pilot corridor** (recommended: Ikorodu → VI) and pilot city partners/hubs | Scope control for launch; determines ops, pricing and safety setup | Before Phase 1 ends |
| 4 | **Confirm vendor choices** (Supabase or self-hosted PostgreSQL/NestJS; Paystack; Mapbox/Google Maps) | Locked contracts drive API spec and timeline | Month 1 |
| 5 | **Legal/compliance sign-off** (payments, driver vetting, data protection, background location) | Store submission and pilot launch cannot proceed without it | Phase 2 |

## Plan at a glance

| Phase | Name | Outcome | Indicative duration |
| --- | --- | --- | --- |
| 0 | Prototype (frontend PWA) | **Done** — demonstrable end-to-end flow | Complete |
| 1 | Backend & API | Real accounts, trips, bookings, payments, trust data | 8–12 weeks |
| 2 | Native mobile app | Expo app: rider + driver in one package | 10–14 weeks (parallel with 1) |
| 3 | Pilot (Ikorodu → VI) | Live, closed-group service with real drivers & payments | 6–8 weeks |
| 4 | Scale | More corridors, ops console, growth loops | Ongoing |

## Cost framing

Exact budget needs a staffing decision, but the shape is:

- **Phase 1–2 (build)**: small senior team — 1 backend/full-stack, 1 mobile (or 1 cross-platform engineer), 1 designer (part-time), 1 product/ops lead.
- **Phase 3 (pilot)**: adds operations — driver vetting, hub marshals, support coverage, insurance/legal.
- Ongoing: cloud, SMS/OTP, maps, payment fees — all volume-based and low at pilot scale.

**The single most important thing to note:** the prototype removes product risk. The remaining risk is **operational and market risk**, not build risk — so the next investment should go into a **real backend + real mobile app + a narrow, well-run corridor pilot.**
