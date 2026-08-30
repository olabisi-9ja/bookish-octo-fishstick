# COMUTA — Implementation Folder

This folder contains the complete implementation package for **COMUTA — Planned Shared Commuting**, the Lagos carpool marketplace. It is the working reference for engineering, product, and leadership: what is built today, what gets built next, and how we get there.

## Contents

| # | Document | What it covers |
| --- | --- | --- |
| 01 | [Executive Summary](01-executive-summary.md) | One-page briefing: the idea, where we are, what we need next |
| 02 | [Current Status](02-current-status.md) | What is implemented today, with evidence and test accounts |
| 03 | [Product Scope](03-product-scope.md) | What COMUTA is and is not; scope guardrails |
| 04 | [Implementation Plan](04-implementation-plan.md) | Phased plan with deliverables, exit criteria and effort |
| 05 | [Technical Architecture](05-technical-architecture.md) | Current stack, repo structure, domain model, state machines |
| 06 | [Backend Integration Spec](06-backend-integration-spec.md) | API surface: auth, trips, bookings, payments, maps, safety |
| 07 | [Mobile Implementation](07-mobile-implementation.md) | Native iOS/Android app plan (Expo + React Native) |
| 08 | [Testing & Quality](08-testing-and-quality.md) | Quality gates, test matrix, acceptance criteria |
| 09 | [Risk Register](09-risk-register.md) | Top risks and mitigations |
| 10 | [Rollout & Launch](10-rollout-and-launch.md) | Pilot-first go-to-market, metrics, launch checklist |
| 11 | [Next Steps](11-next-steps.md) | Immediate actions, owners, timing |

## How to use this folder

- **Leadership** — read `01`, `10` and `11` for the decision briefing.
- **Engineering** — work from `04`, `05`, `06`, `07`, `08`.
- **Product / QA** — use `03`, `08`, and the test accounts in `02`.
- **Every document cites the actual repository** (`src/`, `docs/`, `scripts/`, `public/`) so claims can be verified against code.

## Source of truth

- Repository: `bookish-octo-fishstick` (COMUTA platform) — branch `arena/01a05408-bookish-octo-fishstick`
- Existing planning doc: [`docs/cross-platform-mobile.md`](../docs/cross-platform-mobile.md) — the mobile strategy this package builds on.
- README: [`README.md`](../README.md) — run instructions, brand, structure and product concept.
