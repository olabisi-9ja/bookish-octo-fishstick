# COMUTA — Complete Screen Inventory

*Scoped from the PRD's MVP definition (§50), logical modules (§24), and user journeys (§5). Screens tagged **(V1.5+)** or **(V2+)** aren't launch-blocking — sequence them after the corridor pilot is stable.*

---

## 1. Mobile App (React Native — Rider + Driver modes, one codebase)

### 1.1 Pre-auth
- [ ] Splash
- [ ] Onboarding carousel (3 slides: model, trust, pre-booked expectation)
- [ ] Create account
- [ ] Login
- [ ] OTP verification — phone
- [ ] OTP verification — email
- [ ] Forgot password — request
- [ ] Reset password — new password
- [ ] Reset success

### 1.2 Identity verification (shared, then branches)
- [ ] ID type selection
- [ ] Document upload — front
- [ ] Document upload — back
- [ ] Selfie / liveness capture
- [ ] Role selection (Continue as Rider / Continue as Driver)
- [ ] KYC pending / under review
- [ ] KYC rejected / resubmit *(gap in current export)*
- [ ] KYC verified confirmation

### 1.3 Driver-only onboarding
- [ ] Driver's licence upload/confirm
- [ ] Vehicle details form (make, model, plate, color, year, **seat capacity**)
- [ ] Vehicle documents (registration, insurance, authorization)
- [ ] Commute qualification — origin/destination hub picker against corridor
- [ ] Driver application submitted / review state

### 1.4 Rider — search & booking
- [ ] Rider home (search bar, saved routes, active promos)
- [ ] Origin/destination hub picker
- [ ] Departure time/window picker
- [ ] Search results (map + list, trust signals visible)
- [ ] Trip detail (driver, vehicle, reliability score, price, seats left)
- [ ] Seat count selection
- [ ] Booking summary / review
- [ ] Paystack payment
- [ ] Payment processing state
- [ ] Payment failed / retry
- [ ] Booking confirmed
- [ ] Pre-departure reminder ("time to leave")

### 1.5 Trip day (rider + driver shared views)
- [ ] Hub arrival / vehicle-PIN confirmation
- [ ] Live trip tracking (map, ETA)
- [ ] Share trip (trusted-contact selector)
- [ ] SOS / emergency
- [ ] Route-deviation alert
- [ ] Trip completed
- [ ] Rating + incident report (merged, one screen)
- [ ] Trip receipt / history detail

### 1.6 Rider account
- [ ] Saved hubs / saved routes
- [ ] Upcoming trips / booking history
- [ ] Receipts list
- [ ] Profile / edit profile
- [ ] Payment methods
- [ ] Trusted contacts management
- [ ] Notification preferences
- [ ] Help / support center
- [ ] Support ticket / chat
- [ ] Settings (appearance, language, account)
- [ ] Logout confirmation
- [ ] Delete account

### 1.7 Driver — operating screens
- [ ] Driver home (publish CTA, upcoming trips, earnings snapshot)
- [ ] Publish route — one-off (corridor, hub, seats, price, time)
- [ ] Publish route — recurring (days, time, skip-day controls)
- [ ] Manage published routes (edit/pause/cancel)
- [ ] Incoming booking notification
- [ ] **T-8 confirmation screen** (confirm/decline, countdown visible)
- [ ] Passenger list for a trip (verified badges, pickup hub)
- [ ] Start trip / active-trip driver view
- [ ] End trip / mark complete
- [ ] Reliability score detail (completion, on-time, cancellation rate)
- [ ] Earnings / payout history
- [ ] Payout account setup (bank details)
- [ ] Cancel a scheduled trip (reliability-impact warning shown)
- [ ] Report rider no-show

### 1.8 Community layer **(V2+)**
- [ ] Join/create a Circle
- [ ] Circle-filtered route search
- [ ] Circle members list
- [ ] Circle admin controls

### 1.9 System states
- [ ] Offline / no connection
- [ ] Force update
- [ ] Maintenance mode
- [ ] Generic empty/error states

---

## 2. Admin / Ops Dashboard (internal web tool)

Mapped to the logical modules (Identity, KYC, Vehicles, Hubs, Routes, Bookings, Payments, Trips, Safety, Reliability, Support, Analytics, Admin).

### 2.1 Access
- [ ] Admin login (separate RBAC)
- [ ] Roles & permissions management

### 2.2 Overview
- [ ] Dashboard home (active trips, at-risk trips, today's bookings, open incidents)

### 2.3 Identity & verification
- [ ] Users list (riders + drivers) + detail view
- [ ] KYC manual review queue (document viewer, approve/reject)
- [ ] Driver verification detail (licence, vehicle docs)
- [ ] Vehicles list + detail

### 2.4 Network
- [ ] Hubs management (create/edit, map view)
- [ ] Routes list (templates + occurrences) + detail
- [ ] Live trips map (all active trips)
- [ ] Trip detail (timeline, location history, passengers)
- [ ] At-risk trips queue (unconfirmed past T-8, needs recovery)

### 2.5 Money
- [ ] Bookings list + detail
- [ ] Transactions list + detail
- [ ] Refunds queue
- [ ] Ledger overview
- [ ] Driver payouts (batch/process)

### 2.6 Safety
- [ ] Incidents list + detail (evidence, trip/user linkage)
- [ ] SOS / live emergency alert view
- [ ] Appeals / case review

### 2.7 Quality
- [ ] Reliability scoring dashboard (per driver, per route)
- [ ] Support tickets list + detail

### 2.8 Reporting
- [ ] Analytics — funnels (search → booking → completion → repeat), utilization, reliability trends
- [ ] Audit log viewer

### 2.9 Config
- [ ] Platform settings (cutoff windows, pricing defaults, corridor definitions)
- [ ] Notification center (manual/broadcast push)

### 2.10 Later **(V2+)**
- [ ] Communities/Circles management
- [ ] Business/organization account management

---

## 3. Webapp (Next.js — marketing, SEO, acquisition)

Per PRD launch scope: *"Marketing, route demand capture, safety, driver acquisition, help/legal."* This is not the transactional app — no booking/payment happens here at launch.

### 3.1 Core marketing
- [ ] Homepage (value prop, corridor coverage, app download CTA)
- [ ] How it works — rider
- [ ] How it works — become a driver
- [ ] Safety page (verification, live tracking, SOS explained)
- [ ] Pricing/economics explainer

### 3.2 Acquisition
- [ ] Driver acquisition landing page (cost-savings pitch, sign-up CTA)
- [ ] Route/corridor coverage page (Ikorodu–Island detail)
- [ ] Route demand capture form ("request this corridor" waitlist)
- [ ] App download page (store links + QR)

### 3.3 Trust & support
- [ ] Help center / FAQ
- [ ] Contact / support
- [ ] About / team
- [ ] Terms of Service
- [ ] Privacy Policy

### 3.4 Growth **(V2+)**
- [ ] Business/corporate landing page (COMUTA Business)
- [ ] Campus landing page (COMUTA Campus)
- [ ] Blog / SEO content hub
- [ ] Press/media kit

### 3.5 System
- [ ] 404 / error page

---

## Screen count summary

| Surface | Launch (V1) | Later (V1.5+/V2+) |
|---|---|---|
| Mobile app | ~65 | ~4 (Circles) |
| Admin dashboard | ~26 | ~2 (Circles/Business accounts) |
| Webapp | ~14 | ~4 (Business/Campus/Blog/Press) |

The T-8 driver confirmation screen and the at-risk-trips ops queue are the two screens the whole reliability model depends on — build and test those before anything else beyond core auth/booking.
