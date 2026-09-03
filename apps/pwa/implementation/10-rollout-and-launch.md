# 10 — Rollout & Launch

## Strategy: pilot-first, narrow corridor, closed group

Lagos is not a "launch everywhere and see" market — **mobility trust is earned corridor-by-corridor**. COMUTA's plan:

1. **Prove operations** on one corridor (Ikorodu → Victoria Island) with a small, vetted driver set and invited rider groups.
2. **Show safety & reliability numbers** (T-8 confirmations, on-time %, incident response).
3. **Then open the corridor** to the public and expand corridor-by-corridor (Ajah → VI, Lekki Phase 1 → VI, Ikeja → VI).

## Phase gate: pilot go / no-go

| Gate | Pillar | Evidence required |
| --- | --- | --- |
| G1 | **Safety** | 0 critical incidents; 2 SOS drills completed; vetting + insurance in place |
| G2 | **Supply quality** | ≥ 85% T-8 confirmations across 4 weeks; ≥ 90% on-time departure |
| G3 | **Demand** | ≥ 60 completed trips/week for 4 consecutive weeks; ≥ 40% repeat riders |
| G4 | **Economics** | Unit economics for pilot trip (revenue vs. payouts + fees + ops) favorable or loss capped at defined budget |
| G5 | **Operations** | Support SLA met; refund SLA ≤ 24h; escalation rota staffed |
| G6 | **Compliance** | Legal/NDPR/payments sign-off; store review package complete |

**No gate met → stay in pilot and fix; two gates missed after 6 weeks → corridor change or pause (funding protects PR, not real users).**

## Launch sequence

### Pre-pilot (weeks -3 to 0)
- [ ] Driver vetting complete (10–15 drivers), training + T&Cs signed
- [ ] Hubs operational: marshals, cameras/lighting, signage, contact line
- [ ] Rider group invites (estates/companies/communities on corridor); waitlist live
- [ ] Pricing locked (see [03 — Product Scope](03-product-scope.md)); promo code for pilot
- [ ] Support playbook, escalation tree, SOS drill #1
- [ ] Backend + mobile staging validated; rollback tested; monitoring dashboards live

### Pilot (weeks 1–8)
- [ ] Daily ops check: confirmations, no-shows, incidents, payments
- [ ] Weekly retro: rider/driver feedback → backlog (feedback visible to users)
- [ ] SOS drill #2 by week 4
- [ ] Metrics dashboard published weekly to leadership
- [ ] Gate review at week 4 (G1–G3) and week 8 (all gates)

### Public corridor rollout (post-gate)
- [ ] Open registration on corridor; no invite code
- [ ] Marketing: corridor-specific campaign (Ikorodu–VI corridors, targeting), driver referral
- [ ] Ops scale: more drivers, support coverage expansion

### Expansion waves
- Wave 2: Ajah → VI, Lekki Phase 1 → VI
- Wave 3: Ikeja → VI, Yaba and east-west corridors
- Each corridor repeats the same gate: **vetting → hubs → closed group → gate → open**

## Metrics to track (pilot dashboard)

| KPI | Definition | Target (pilot) |
| --- | --- | --- |
| Completed trips / week | Bookings with trip status `completed` | ≥ 60 |
| T-8 confirmation rate | Trips confirmed by 11 PM ÷ published | ≥ 85% |
| On-time departure rate | Departed ≤ 5 min of scheduled | ≥ 90% |
| Cancellation/refund rate | Cancelled bookings ÷ booked | ≤ 10% |
| Repeat rider rate | Riders with ≥ 2 trips/month | ≥ 40% |
| Booking-to-completion | Completed ÷ booked | ≥ 80% |
| Driver retention | Active drivers after 60 days | ≥ 70% |
| Cost per completed trip | Ops cost ÷ completed trips | Monitored, cap fixed |
| Incident response time | SOS → acknowledged | ≤ 2 min |
| NPS (rider + driver) | Post-trip survey | ≥ 40 |

## Legal & compliance checklist (before public launch)

- [ ] NDPR privacy policy; data retention schedule; consent for location, KYC data
- [ ] Driver-operator agreements; passenger indemnity/insurance verification
- [ ] Payment terms; refund policy; Paystack merchant agreement
- [ ] Background-location disclosures for app stores; store review package
- [ ] Terms of service for riders/drivers; acceptable use; safety rules (hubs, PIN, no cash)
- [ ] Accessibility statement (WCAG 2.1 AA)
