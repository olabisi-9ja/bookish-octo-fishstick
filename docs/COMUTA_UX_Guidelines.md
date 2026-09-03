# COMUTA — UX Guidelines & Flow Audit

*Based on: current Figma design system, exported onboarding/KYC screens, and the COMUTA PRD (Aug 2026). Figma itself is auth-walled so this works from the exported frames — send fresh exports if the flow has moved on.*

---

## 1. What's already right — keep these as hard rules

Your existing auth/KYC flow already does several things Uber, Bolt, and Lyft treat as non-negotiable. Lock these in as system rules, not just this-screen decisions:

| Pattern | Where you're doing it | Rule to formalize |
|---|---|---|
| One primary CTA per screen | Every screen — single dark-green filled button at the bottom | Never show two filled buttons of equal visual weight on one screen |
| Progressive KYC disclosure | ID type → document upload → selfie, in separate steps, not one long form | Never ask for more than one verification artifact per screen |
| Explicit pending/review state | "We're reviewing your details" screen with document icon | Every async backend step (KYC, driver approval) gets its own state screen — never let the user land on a blank or ambiguous screen |
| Role branch after core identity | Verify identity → **role select** → driver-only steps (license, vehicle, commute route) | Don't ask driver-only questions before you know the user is a driver |
| Localized document types | ID dropdown: NIN, Int'l Passport, Driver's License, Voter's Card | Right call — matches what a Nigerian rider/driver actually holds |

---

## 2. Screen-by-screen audit of the current flow

### Splash → Onboarding
Two splash frames are still blank in the export. Given COMUTA's core differentiator is *pre-booked, corridor-based, verified* commuting (not spontaneous ride-hailing), the onboarding carousel should say that explicitly — don't default to generic "book a ride" copy. Uber/Bolt/Lyft all use onboarding to set expectations before the account exists (Lyft's health-commitment screen is a good model: policy stated once, upfront, so it's never a surprise mid-flow). Use your 2–3 onboarding slides for:
1. "Ride with people already making your commute" — the P2P model, in one line.
2. "Every driver and vehicle is verified" — trust, stated before it's asked for.
3. "Book ahead, pay upfront, know your seat" — sets the pre-booked expectation so users don't open the app expecting instant pickup like Uber.

### Create account / Login
Both screens correctly show Google/Apple continue buttons above the email/phone form — good, reduces KYC drop-off at step one. Two issues to fix:
- **Button hierarchy is inconsistent across frames.** Some show "Continue with Apple" filled dark, others filled lime. Pick one: social auth buttons should be *secondary* weight (white/outline, per your button-large spec), and the single dark-green button should be reserved for the primary form action ("Create account" / "Log in"). Right now both variants exist in the design system with no rule for when to use which — that ambiguity will produce inconsistent screens as the team builds more of them.
- **No error/validation state was in the export.** Add: inline field error (red, matching your red ramp), and a full-screen error (network failure, duplicate account) — Lyft's payment-error screen is the right model: name the exact problem, don't say "something went wrong."

### OTP (email + phone)
Boxes + single "Continue" button, correctly split into two variants for email vs phone. Missing, based on the export:
- **Resend/fallback affordance.** Uber's OTP screen keeps "Resend code" and a voice-call fallback visible without scrolling — this single addition measurably reduces auth abandonment. Right now if the SMS doesn't arrive, there's no visible next step.
- **Auto-advance + auto-read.** Not verifiable from a static export, but flag it for engineering: digit boxes should auto-advance on input and support SMS autofill on both platforms.

### Reset password
Present as two frames (request → new password). Fine as-is. Confirm the success state routes back to Login, not silently — a brief confirmation screen (or toast) before the redirect avoids the "did that work?" moment.

### Identity verification (5 "Veri..." frames)
This is the strongest part of the current flow — dropdown-driven ID type selection, then contextual upload cards per document. One structural fix:
- **Upload cards need three visible states**, not just empty/idle: idle, uploading (progress), and confirmed (thumbnail + "Change" link). The export only shows the idle state. Bolt's driver-arrival screen shows how much a filled-in confirmed state builds confidence — apply the same to "ID front uploaded ✓" before letting the user proceed.
- The red helper text under the dropdown (visible in several frames) should be reserved for actual errors — if it's persistent instructional copy, move it to gray, not red. Red should mean "something is wrong," always.

### Role selection
Clean two-button choice (dark "Continue as Driver" / lime "Continue as Rider," based on the design system swatch). This is the branch point — make sure copy on each button states the *consequence* ("Continue as Driver — you'll verify your license and vehicle next"), not just the label. One extra tap of clarity here saves drop-off two screens later when the driver-only steps arrive unannounced.

### Driver-only steps (license, vehicle info, selfie, commute route)
Matches PRD §17.2 (Driver Verification) closely — license, vehicle authorization, selfie/liveness. Two gaps against the PRD:
- **Vehicle info form has no field for seat capacity**, which the Route Management spec (§17.4) requires per route. Either collect it here or explicitly defer it to route creation — don't leave it undefined between the two flows.
- **"Where do you usually commute?" is a single free-text-feeling screen.** Given the whole business model is corridor density (Ikorodu–Island first), this should be a structured origin/destination picker against your curated hub list, not open text — it's also your earliest signal for whether a driver matches the launch corridor at all. Treat it as a qualification step, not just a preference.

### Final "reviewing" screen
Good pattern (see §1). Add a visible timeframe if you have one ("Usually within 24 hours") — an open-ended "we'll review it" is the #1 place KYC flows lose people to uninstalls.

---

## 3. Principles to carry into the screens that don't exist yet

Pulled from what makes Uber/Bolt/Lyft work, adapted to COMUTA's pre-booked/corridor model (which is meaningfully different — you're not doing on-demand matching):

**Route search should be map-first, list-second.** Like Bolt's booking screen — map on top showing the corridor and hub pins, results panel as a bottom sheet with a drag handle underneath. Since COMUTA trips are pre-booked and recurring, the map's job is to build confidence in the hub locations, not to show live driver positions like Uber's home screen does.

**Surface trust signals at the point of choice, not after.** When a rider picks a trip, show driver reliability score, vehicle, and community status *in the results list* — same information density as Bolt's live-trip screen (photo, plate, ETA in one row), just moved earlier because COMUTA riders are choosing a trip, not waiting for an assigned one.

**Driver commitment (T-8 confirmation) needs its own first-class screen and notification**, not a buried settings toggle. This is a system COMUTA leans on that Uber/Bolt don't have — treat the confirmation moment with the same visual weight as a booking confirmation: full-screen, single action, countdown visible if the deadline is close.

**Live tracking + trusted-contact share, modeled on Uber's active-trip screen.** One persistent action (Share trip / SOS) reachable without navigating away from the live map, for the whole duration of the trip — this is a safety requirement in the PRD (§17.6), not just a nice-to-have.

**Merge rating + report into one post-trip screen**, the way Bolt merges rating and tip. For COMUTA, that's rating + optional incident flag in one screen — don't make "report a problem" a separate flow buried in settings.

**Saved hubs, not saved addresses.** Uber's "Saved Places" pattern applies, but COMUTA's version should be saved *hubs* (from the curated list) plus saved *routes* (home corridor, work corridor) — since freeform pickup isn't the product.

**Empty states always keep a next action.** "No upcoming trips" should still surface "Search your route" — same logic as Uber's empty Activity tab.

---

## 4. Screen gap list, mapped to PRD MVP scope (§50)

Prioritized by what blocks a working pilot on the Ikorodu–Island corridor:

1. Route/seat search results (map + list, trust signals visible)
2. Hub selection / hub detail (photo, safety notes, pin)
3. Seat booking → Paystack payment (single flow, payment before confirmation per PRD)
4. Booking confirmation + pre-departure reminder screen
5. Driver: T-8 confirmation screen (time-boxed, single action)
6. Live trip tracking + Share trip / SOS
7. Trip completion → rating + incident report (merged)
8. Driver: publish route (recurring vs one-off, hub, seats, price, departure time — matches §17.4 exactly)
9. Driver: reliability/commitment score view
10. No-show / cancellation / refund flow (8-hour cutoff, per Appendix A)

---

## 5. Design-system gaps to close before scaling the screen count

- **Button hierarchy rule**: define primary (dark green filled) vs secondary (outline/white) vs tertiary (text-only) usage — currently ambiguous between dark-green and lime-filled buttons.
- **Semantic color mapping**: you have six color ramps (teal/green, lime, teal-grey, near-black neutral, grey neutral, red) but no documented mapping of *which ramp means what* (success, warning, info, error, disabled). Write this down now — it's the difference between a consistent app and a designer guessing per screen.
- **Component states**: every input, upload card, and button needs idle/focus/error/disabled/loading states specified once, reused everywhere — the export only shows idle states.
- **Status badges**: the PRD's KYC state machine (Pending → Under Review → Verified → Active → Restricted → Suspended) needs a matching badge component now, since it'll surface in-app (verification status) and in admin.
