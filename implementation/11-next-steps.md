# 11 — Next Steps

## Immediate (this week)

| # | Action | Owner | Output |
| --- | --- | --- | --- |
| 1 | Share/sign off this implementation package | Product lead → leadership | Decisions on 01: vendor, corridor, team |
| 2 | **Demo the prototype** to stakeholders (30 min): login `test@comuta.app` / `ComutaTest123!`, full rider loop + driver loop | Product/Eng | Confidence + spec feedback |
| 3 | Run the full quality gate once and record results (`npm run typecheck && npm run build && npm run smoke`) | Eng | Green baseline before Phase 1 |
| 4 | Confirm team capacity: who builds Phase 1 backend, who builds Phase 2 mobile | Leadership | Staffing decision |
| 5 | Lock vendor decision: Supabase vs self-hosted NestJS; Mapbox vs Google; SMS provider | Eng lead | Architecture spec finalized |

## Week 2–4

| # | Action | Owner |
| --- | --- | --- |
| 6 | Scaffold monorepo (`services/api`, `packages/contracts`, `infrastructure/docker`, `monitoring`) | Backend |
| 7 | Write `packages/contracts` v1: auth, hubs, routes, trips, bookings, payments, safety | Backend |
| 8 | Choose + start pilot corridor ops prep (hub partners, driver pipeline) | Ops |
| 9 | Start mobile workspace + Expo app skeleton (M1 in [07](07-mobile-implementation.md)) | Mobile |

## Month 2+

- Phase 1 sprint increments (auth → search → booking → payments → safety)
- Phase 2 milestones M2–M5 (auth, search, booking, driver, active trip)
- Weekly pilot ops if Phase 3 authorized
- Monthly leadership gate review with KPI dashboard

## Key dependencies / blockers to note

- **Team capacity** — Phase 1 and 2 can run in parallel only with ≥ 2 engineers.
- **Vendor contracts** (Paystack, SMS, maps, hosting) — start sign-ups this week; test accounts take time.
- **Legal** — NDPR, driver agreements, payment policy and app-store review materials should start now, not at submission time.
- **Decision on pilot corridor** — everything in Phase 3 depends on it.
