# 09 — Risk Register

Ranked by **impact × likelihood**. Review at every phase gate.

| # | Risk | Likelihood | Impact | Mitigation | Owner | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | **Supply doesn't materialize** — not enough drivers/passengers on the pilot corridor to hit volume | High | Critical | Closed-group pilot with partner estates/companies; driver recruitment with guarantees (fuel support for pilot); weekly supply check; fallback corridor ready (Ajah → VI) | Ops lead | 3 |
| R2 | **State/data loss between client & server during migration** (existing localStorage data vs real accounts) | Medium | High | Ship a one-time migration/`v2 → v3` store upgrade; keep mock facade until backend stable; explicit "prototype data will reset" messaging in staging | Backend | 1 |
| R3 | **Seat oversell / double booking** if concurrency isn't handled server-side | Medium | Critical (trust) | DB constraint + row lock + idempotency; integration test for concurrent booking; auto-compensation (refund + alternative) | Backend | 1 |
| R4 | **Driver no-show / drop after T-8** | Medium | High | At-risk state + recovery flow already in UI; penalty + reliability scoring; auto-reassign from waitlist; refund SLA (≤ 24h) | Product/Ops | 1–3 |
| R5 | **Payment settlement delays or disputes** (Paystack webhooks, refunds, driver payouts) | Medium | High | Webhook-first verification; reconciliation job; SLA for refunds/payouts; support macros; monitor failure rates | Backend/Finance | 1 |
| R6 | **Safety incident (SOS failure, deviation miss, hub incident)** | Low | Critical | Server-side deviation checks; SOS escalation + drill (2×/pilot); hub marshals/cameras; insurance; rapid on-call; post-incident review | Ops | 3 |
| R7 | **Regulatory / compliance** (transport, payments, NDPR, background location, driver vetting) | Medium | High | Legal review before pilot; data-protection policy; consent UX; store-review package early (Phase 2 M9); licensed/insured operators only | Ops/Legal | 2–3 |
| R8 | **Mobile store rejection** (external payments policy, location permissions, identity KYC) | Medium | High | Apple/Google policy pre-check (documents as deliverable); alternate flows designed; fallback to PWA distribution during pilot | Mobile lead | 2 |
| R9 | **SCOPE CREEP** — adding on-demand, chat, communities, multi-city before pilot works | High | High | This document is the contract: no features outside [03 — Product Scope](03-product-scope.md) until pilot exits criteria are met | Product lead | All |
| R10 | **PWA-only distribution failure** (install friction, no push, maps limitations) | Medium | Medium | Phase 2 mobile app is planned; meanwhile PWA install prompt, offline shell, SMS fallback | Mobile lead | 2 |
| R11 | **Map/network dependency** (routing, ETAs, live tracking) | Medium | Medium | Multiple providers (Mapbox + fallback); route fallback to straight-line/corridor abstraction (current `ComutaMap`); retry + offline cache | Backend | 1–2 |
| R12 | **Data privacy breach** (PII, identity documents, location history) | Low | Critical | Encryption at rest/in transit; least-privilege access; secrets out of clients; pen-test before pilot; retention policy; incident runbook | Security | 1–3 |
| R13 | **Metric misalignment** — building before validating willingness-to-pay | Medium | High | Pilot deliberately narrow; price experiments in pilot; go/no-go gates on KPI (see [10](10-rollout-and-launch.md)) | Product lead | 3 |
| R14 | **Ops capacity** — support/vetting not staffed for recovery behavior | Medium | High | Playbook + SLAs before driver onboarding; trained ops rota during pilot hours | Ops lead | 3 |
| R15 | **Battery/location reliability** on low-end Android drivers | Medium | Medium | Battery-aware intervals; Task Manager; in-app health monitoring; driver incentives for device quality | Mobile lead | 2 |

## Escalation & reporting cadence

- Risks re-scored at each phase gate; top 5 reviewed with leadership monthly.
- Every pilot safety incident gets a post-incident review within 72h.
- Phase exit = documented evidence, not vibes (metrics from Phase 3 dashboard).
