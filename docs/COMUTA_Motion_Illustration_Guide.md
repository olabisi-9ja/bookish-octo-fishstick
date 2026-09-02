# COMUTA — Motion & Illustration Guide

Uber/Bolt/Lyft don't use motion and illustration as decoration — they use it to do two jobs: soften moments that would otherwise feel bureaucratic (KYC, permissions, empty states), and communicate state change on moments that matter (booking confirmed, driver arriving, payment processed). Apply the same logic here, not "add animation everywhere."

---

## 1. Where illustration earns its place

Use illustration only where there's no live data on screen — the moment it shares space with a map, a price, or a countdown, it competes with information the user actually needs.

**Good candidates (mostly your current blank/placeholder screens):**
- Onboarding carousel (3 slides) — your biggest opportunity right now, currently blank
- Empty states — "No upcoming trips," "No saved routes," "No notifications"
- Permission requests — location, notifications, camera (for selfie/document capture)
- Success states — KYC verified, booking confirmed, trip completed
- Error/failure states — payment failed, no drivers on this route yet
- Safety education — the "how live tracking works" or SOS explainer, once

**Never illustrate:**
- Live trip tracking / map screens
- Search results, booking summary, anything with a price or countdown
- The T-8 driver confirmation screen — this needs urgency and clarity, not charm

## 2. Illustration style rules

- **Two-tone, on-brand.** Use your dark green + lime green pairing as the illustration palette — same restraint as Lyft's single-accent-color character illustrations. Don't introduce new illustration colors outside your existing ramps.
- **One system, reused everywhere.** Pick one illustration language (flat geometric, rounded character, or line-art) and build a small component library from it — 8–10 reusable figures/scenes cover most empty/success/onboarding states. Inconsistent illustration styles read as unfinished faster than inconsistent UI does.
- **Local, not generic.** Lagos commute cues (danfo-adjacent color blocking, okada silhouettes, familiar road/hub shapes) will read as "built for us" in a way stock-style global illustration won't — this is a real differentiator for a Nigeria-first product, use it.
- **Illustration is not filler.** If a screen doesn't need one to reduce anxiety or explain something, skip it — a plain, well-typeset empty state is better than a forced illustration.

## 3. Where motion earns its place

Three categories, each with a different job:

### Micro-interactions (150–250ms) — every screen
Button press states, tab switches, toggle/checkbox feedback, input focus. These should be near-instant and consistent system-wide — set once as a shared easing/duration token, don't hand-tune per screen.

### Transitions (250–400ms) — between screens/states
- Bottom sheet expand/collapse (search results, trip detail) — spring physics, not linear, matching the drag-handle pattern already in your screens
- Card → detail transitions (trip list item expanding into trip detail) — a shared-element transition here makes the search → book flow feel connected instead of like separate pages
- Screen push/pop — standard platform transitions are fine; don't override with custom ones unless it's a moment that matters (see below)

### Meaningful state-change moments — a handful of screens, done well
This is where Bolt and Uber actually spend their motion budget, and where COMUTA should too:
- **Booking confirmed** — a deliberate checkmark/success animation, not just a static icon swap
- **KYC review submitted** — your existing "reviewing" screen icon is a good candidate for a subtle loop (slow pulse or rotate on the refresh glyph) rather than static
- **Payment processing** — a clear "working" state distinct from a generic spinner, so users don't wonder if the app froze
- **T-8 confirmation countdown** — a progress ring or bar showing time remaining, updating live. This should feel *purposeful*, not playful — it's a deadline, not a game.
- **Live trip tracking** — the driver's position on the map should interpolate smoothly between location updates, never jump. This is a trust signal disguised as a technical detail.
- **SOS button** — deliberate, weighty press feedback (longer hold + haptic + visible confirmation), never bouncy or cute. Safety actions should feel serious.

## 4. What NOT to animate

- Anything on the live map beyond smooth position interpolation — no decorative pulsing pins, no bouncing markers
- Prices, countdowns, or seat-availability numbers — these need to be scannable, not entertaining
- The T-8 confirmation CTA itself — make it obvious and static; save motion for the countdown, not the button
- Loading states longer than ~2 seconds shouldn't rely on a single looping animation alone — pair with a skeleton screen so the layout doesn't feel empty

## 5. Build approach (React Native + Expo, per your stack)

| Need | Tool | Why |
|---|---|---|
| Illustration-based animations (success checkmarks, empty-state loops, onboarding) | **Lottie** (`lottie-react-native`) | Designers export from After Effects/Figma; lightweight, works with Expo |
| UI micro-interactions (bottom sheets, button press, screen transitions) | **React Native Reanimated** | Runs on the native thread — stays smooth on lower-end Android devices, which matters for your target market |
| Simple fades/opacity/scale | RN's built-in `Animated` API | No need to reach for Reanimated on trivial cases |
| Avoid | GIFs, heavy Lottie files (>200KB), JS-thread-driven animation on scroll | Frame drops on budget devices are worse than no animation |

## 6. Sequencing — do this first

Given finite design time, spend it here in order:

1. **Onboarding carousel illustrations** (3 slides) — currently blank, highest visibility, sets brand tone immediately
2. **KYC pending/success states** — softens the most bureaucratic part of your flow
3. **Booking confirmed + trip completed animations** — the emotional high points of the core loop
4. **T-8 countdown treatment** — functionally critical, do this carefully even though it's not "delightful" motion
5. **Empty states** (no trips, no saved routes) — cheap to build once the illustration system exists, high frequency of appearance
6. Bottom sheet / card transitions — polish pass once the above are solid

Everything else (SOS weight, live-map interpolation, micro-interaction tokens) is a system-level engineering decision more than a design one — define the rules once in your design system and apply them everywhere, rather than treating each screen as a one-off.
