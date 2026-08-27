import { useState } from 'react';
import {
  AlertTriangle, ArrowRight, BadgeCheck, Calendar, CalendarDays, CarFront, Check, CheckCircle2,
  ChevronDown, ChevronRight, Clock3, CreditCard, Heart, HelpCircle, Info, KeyRound, LocateFixed,
  MapPin, MessageCircle, Navigation, Phone, Plus, RefreshCw, Repeat2, RotateCcw, Search,
  Share2, Shield, ShieldAlert, ShieldCheck, Siren, SlidersHorizontal, Sparkles, Star, User, Users,
  X,
} from 'lucide-react';
import { Avatar, Modal } from '../components/UI';
import {
  ConfirmedBookingIllustration, EmptyRoadIllustration, HubSafetyIllustration, RecoveryIllustration,
} from '../components/Illustrations';
import {
  formatArrivalEta, formatDurationText, formatNaira, fullName, greetingFor, longDate, placeById,
  usePlatform, type Booking, type RideCard,
} from '../platform';
import { ComutaTripCard, CorridorMapArtwork, PageHeading, tripStatusLabel, whenCopy } from './shared';

type RiderProps = {
  onSearch: () => void;
  onPlan: () => void;
  onRide: (ride: RideCard) => void;
  onTrips: () => void;
  onPickup: () => void;
  onActiveTrip: () => void;
  onManageRecurring: () => void;
  onAtRiskDemo: () => void;
  onChat: (tripId: string) => void;
  onSos: () => void;
  onWallet: () => void;
  onSwitch: () => void;
  onExit: () => void;
  notify: (message: string) => void;
  onReceipt: (bookingId: string) => void;
  onRate: (tripId: string) => void;
  onViewBooking: (bookingId: string) => void;
};

/**
 * 3. Rider Home
 * Answers: "What is happening with my commute?"
 * Header: Good morning, Olabisi / Plan your next commute
 * Next Commute Card: Hero element (Ikorodu → Victoria Island, Tomorrow · 7:00 AM, CONFIRMED)
 * Plan a commute: FROM Ikorodu Hub, TO Victoria Island Hub, Find shared trips
 * Your routes: Ikorodu → Island, Mon · Tue · Wed · Thu · Fri 7:00 AM, VIEW
 * Recent trips: compact
 */
export function RiderHome({
  onPlan,
  onRide,
  onPickup,
  onActiveTrip,
  onManageRecurring,
  onAtRiskDemo,
}: Pick<RiderProps, 'onPlan' | 'onRide' | 'onPickup' | 'onActiveTrip' | 'onManageRecurring' | 'onAtRiskDemo'>) {
  const { me, matchedRides, riderBookings, state } = usePlatform();

  // Find the primary upcoming commute
  const nextBooking = riderBookings.find(
    (b) => b.status === 'confirmed' || b.status === 'paid' || b.status === 'at_risk',
  );
  const isAtRisk = nextBooking?.status === 'at_risk';
  const heroTrip = matchedRides[0];

  return (
    <div className="rider-home-container">
      {/* Header: Good morning, Olabisi / Plan your next commute */}
      <header className="rider-home-header">
        <div className="greeting-stack">
          <span className="commute-date-pill">{longDate().toUpperCase()}</span>
          <h1>Good morning, {me?.firstName || 'Olabisi'}</h1>
          <p className="sub-prompt">Plan your next commute</p>
        </div>
        <button className="plan-trigger-btn" onClick={onPlan}>
          <Search size={18} />
          <span>Plan commute</span>
        </button>
      </header>

      {/* At-risk recovery banner if triggered */}
      {isAtRisk && (
        <div className="at-risk-callout" onClick={onAtRiskDemo}>
          <div className="ar-icon"><AlertTriangle size={20} /></div>
          <div className="ar-content">
            <strong>Something changed with tomorrow’s trip</strong>
            <p>Your driver can no longer make this commute. We're finding another option.</p>
          </div>
          <button className="btn btn-lime btn-small">View alternatives <ArrowRight size={14} /></button>
        </div>
      )}

      {/* NEXT COMMUTE CARD (HERO ELEMENT) */}
      <section className="next-commute-hero">
        <div className="hero-badge-row">
          <span className="eyebrow-label">NEXT COMMUTE</span>
          <span className={`status-pill ${isAtRisk ? 'at-risk' : 'confirmed'}`}>
            {isAtRisk ? 'ACTION NEEDED' : 'CONFIRMED'}
          </span>
        </div>

        <div className="hero-corridor-title">
          <h2>Ikorodu ➔ Victoria Island</h2>
          <div className="hero-time-stamp">
            <Clock3 size={15} />
            <span>Tomorrow · 7:00 AM</span>
            <span className="dot-sep">·</span>
            <span className="eta-stamp">~8:05 AM arrival</span>
          </div>
        </div>

        <div className="hero-driver-strip">
          <Avatar initials="AK" color="#0C392C" size={44} photo="/images/people/ade.jpg" />
          <div className="driver-meta">
            <strong>Adebayo K. <BadgeCheck size={14} className="badge-icon" /></strong>
            <span>Toyota Corolla · Silver · ABC 123 XY</span>
            <small>Pickup: Ikorodu Hub (Main Gate)</small>
          </div>
          <div className="pin-box">
            <small>TRIP PIN</small>
            <strong>4827</strong>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onPickup}>
            <MapPin size={16} />
            <span>Meet driver / Pickup</span>
          </button>
          <button className="btn btn-outline" onClick={onActiveTrip}>
            <Navigation size={16} />
            <span>Live route track</span>
          </button>
          <button className="btn-text-simulate" onClick={onAtRiskDemo} title="Test the signature recovery interaction">
            Simulate recovery scenario
          </button>
        </div>
      </section>

      {/* PLAN A COMMUTE */}
      <section className="plan-commute-card">
        <div className="pcc-head">
          <div>
            <h3>Plan a commute</h3>
            <p>Choose where and when you want to travel.</p>
          </div>
        </div>
        <div className="pcc-inputs">
          <div className="pcc-field">
            <span className="field-tag">FROM</span>
            <div className="field-val">
              <span className="dot origin" />
              <strong>Ikorodu Hub</strong>
              <small>Main Gate</small>
            </div>
          </div>
          <div className="pcc-field">
            <span className="field-tag">TO</span>
            <div className="field-val">
              <span className="dot destination" />
              <strong>Victoria Island Hub</strong>
              <small>Ozumba Mbadiwe / Sterling</small>
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-block pcc-cta" onClick={onPlan}>
          <Search size={18} />
          <span>Find shared trips</span>
        </button>
      </section>

      {/* YOUR ROUTES */}
      <section className="your-routes-card">
        <div className="yrc-head">
          <div>
            <h3>Your routes</h3>
            <p>Saved recurring schedules</p>
          </div>
          <button className="btn-manage" onClick={onManageRecurring}>
            Manage <ChevronRight size={15} />
          </button>
        </div>
        <div className="route-strip">
          <div className="route-details">
            <strong>Ikorodu ➔ Island</strong>
            <span>Mon · Tue · Wed · Thu · Fri</span>
            <small>7:00 AM departure · ₦1,500 / trip</small>
          </div>
          <button className="btn btn-light btn-small" onClick={onManageRecurring}>
            VIEW
          </button>
        </div>
      </section>

      {/* RECENT TRIPS (COMPACT) */}
      <section className="recent-trips-compact">
        <div className="rtc-head">
          <h3>Recent trips</h3>
          <span className="sub-count">Last 30 days</span>
        </div>
        <div className="recent-list">
          <div className="recent-item">
            <div className="ri-icon"><CheckCircle2 size={16} /></div>
            <div className="ri-details">
              <strong>Ikorodu Hub ➔ Victoria Island Hub</strong>
              <span>Friday, 21 Aug · 7:00 AM · Adebayo K.</span>
            </div>
            <span className="ri-price">₦1,500</span>
          </div>
          <div className="recent-item">
            <div className="ri-icon"><CheckCircle2 size={16} /></div>
            <div className="ri-details">
              <strong>Victoria Island Hub ➔ Ikorodu Hub</strong>
              <span>Thursday, 20 Aug · 5:30 PM · Musa L.</span>
            </div>
            <span className="ri-price">₦1,350</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * 4. Plan a Commute Screen
 * Don't make this feel like an Uber pickup screen.
 * The user isn't requesting a car. They're PLANNING TRANSPORTATION.
 * Screen: Plan a commute / Choose where and when you want to travel.
 * FROM: Ikorodu Hub
 * TO: Victoria Island Hub
 * WHEN: Tomorrow | 7:00 AM
 * TRIP TYPE: One-off | Recurring
 * Find available trips (fixed near bottom)
 */
export function PlanCommuteView({
  onBack,
  onFindTrips,
}: {
  onBack: () => void;
  onFindTrips: () => void;
}) {
  const [fromHub, setFromHub] = useState('Ikorodu Hub');
  const [toHub, setToHub] = useState('Victoria Island Hub');
  const [day, setDay] = useState('Tomorrow');
  const [time, setTime] = useState('7:00 AM');
  const [tripType, setTripType] = useState<'one-off' | 'recurring'>('recurring');

  return (
    <div className="plan-commute-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Plan a commute</h2>
          <p>Choose where and when you want to travel.</p>
        </div>
      </header>

      <div className="plan-form-card">
        {/* FROM */}
        <div className="corridor-selector-block">
          <label className="input-group-label">FROM</label>
          <div className="corridor-pill-input">
            <span className="hub-dot-indicator origin" />
            <select
              value={fromHub}
              onChange={(e) => setFromHub(e.target.value)}
              className="hub-select"
            >
              <option value="Ikorodu Hub">Ikorodu Hub (Main Gate)</option>
              <option value="Berger Hub">Berger Hub (Expressway Interchange)</option>
              <option value="Ikeja Hub">Ikeja Hub (Maryland Mall)</option>
              <option value="Yaba Hub">Yaba Hub (Commercial Ave)</option>
              <option value="Ajah Hub">Ajah Hub (Novare Mall)</option>
            </select>
          </div>
          <small className="hub-clarifier">Well-lit designated waiting bay</small>
        </div>

        {/* TO */}
        <div className="corridor-selector-block">
          <label className="input-group-label">TO</label>
          <div className="corridor-pill-input">
            <span className="hub-dot-indicator destination" />
            <select
              value={toHub}
              onChange={(e) => setToHub(e.target.value)}
              className="hub-select"
            >
              <option value="Victoria Island Hub">Victoria Island Hub (Sterling / Ozumba)</option>
              <option value="Lekki Phase 1 Hub">Lekki Phase 1 Hub (Admiralty Way)</option>
              <option value="Ikeja Hub">Ikeja Hub (Maryland / Allen)</option>
              <option value="Marina Hub">Marina Hub (Financial District)</option>
            </select>
          </div>
          <small className="hub-clarifier">Direct drop-off at transit gateway</small>
        </div>

        {/* WHEN */}
        <div className="when-selector-block">
          <label className="input-group-label">WHEN</label>
          <div className="when-split">
            <div className="date-select-box">
              <CalendarDays size={16} />
              <select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Friday">Friday</option>
                <option value="Monday">Next Monday</option>
              </select>
            </div>
            <div className="time-select-box">
              <Clock3 size={16} />
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="6:30 AM">6:30 AM</option>
                <option value="6:45 AM">6:45 AM</option>
                <option value="7:00 AM">7:00 AM</option>
                <option value="7:15 AM">7:15 AM</option>
                <option value="7:30 AM">7:30 AM</option>
                <option value="8:00 AM">8:00 AM</option>
              </select>
            </div>
          </div>
        </div>

        {/* TRIP TYPE */}
        <div className="trip-type-block">
          <label className="input-group-label">TRIP TYPE</label>
          <div className="trip-type-tabs">
            <button
              className={`tab-btn ${tripType === 'one-off' ? 'active' : ''}`}
              onClick={() => setTripType('one-off')}
              type="button"
            >
              One-off
            </button>
            <button
              className={`tab-btn ${tripType === 'recurring' ? 'active' : ''}`}
              onClick={() => setTripType('recurring')}
              type="button"
            >
              <Repeat2 size={14} />
              <span>Recurring (Mon–Fri)</span>
            </button>
          </div>
          <p className="type-caption">
            {tripType === 'recurring'
              ? 'Seats reserved every weekday automatically. Skip or pause anytime.'
              : 'Single journey reservation for the selected morning.'}
          </p>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed-bottom-bar">
        <button className="btn btn-primary btn-block cta-large" onClick={onFindTrips}>
          <Search size={18} />
          <span>Find available trips</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 5. Search Results / Available Trips Screen
 * Top: Available trips / Ikorodu → Victoria Island / Tomorrow
 * Map: Approximately 35–40% of screen. Show: Ikorodu Hub ────── route ────── Victoria Island Hub.
 * Bottom results: 4 shared trips. Filters: Earliest, Best match.
 * Trip Card: TIME → TRUST → VEHICLE → PRICE → AVAILABILITY
 */
export function SearchResultsView({
  onSelectRide,
  onBack,
}: {
  onSelectRide: (ride: RideCard) => void;
  onBack: () => void;
}) {
  const { matchedRides } = usePlatform();
  const [filter, setFilter] = useState<'match' | 'earliest'>('match');

  // Filter 4 shared trips
  const displayedTrips = [...matchedRides]
    .sort((a, b) => {
      if (filter === 'earliest') return a.time.localeCompare(b.time);
      return b.match - a.match;
    })
    .slice(0, 4);

  return (
    <div className="available-trips-screen">
      {/* Top Header */}
      <header className="search-results-topbar">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div className="search-summary-text">
          <h1>Available trips</h1>
          <p className="corridor-sub">Ikorodu ➔ Victoria Island · Tomorrow</p>
        </div>
        <span className="verified-count-tag">
          <ShieldCheck size={14} />
          <span>Verified only</span>
        </span>
      </header>

      {/* 35–40% Corridor Map */}
      <section className="results-map-section">
        <CorridorMapArtwork
          fromLabel="Ikorodu Hub"
          toLabel="Victoria Island Hub"
        />
      </section>

      {/* Bottom Results Sheet */}
      <section className="results-bottom-sheet">
        <div className="sheet-header">
          <div className="sheet-title-group">
            <h2>{displayedTrips.length} shared trips</h2>
            <span>Seats available for tomorrow's morning commute</span>
          </div>

          {/* Filters: Earliest | Best match */}
          <div className="filter-pill-group">
            <button
              className={`filter-chip ${filter === 'earliest' ? 'active' : ''}`}
              onClick={() => setFilter('earliest')}
            >
              <Clock3 size={13} />
              <span>Earliest</span>
            </button>
            <button
              className={`filter-chip ${filter === 'match' ? 'active' : ''}`}
              onClick={() => setFilter('match')}
            >
              <Sparkles size={13} />
              <span>Best match</span>
            </button>
          </div>
        </div>

        {/* 4 Trip Cards */}
        <div className="trips-card-list">
          {displayedTrips.map((ride) => (
            <ComutaTripCard
              key={ride.id}
              ride={ride}
              onClick={() => onSelectRide(ride)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * 7. Trip Detail Screen
 * Header: Trip details
 * Trip summary: 7:00 AM, Ikorodu → Victoria Island, ~1 hr 5 min · Tomorrow
 * Your driver: Adebayo K., 98% completion, 97% on-time, VERIFIED
 * Vehicle & pickup: Toyota Corolla, ABC 123 XY · Silver, Ikorodu Hub Main Gate (Well-lit pickup point)
 * Booking CTA: Reserve 1 seat · ₦1,500 (fixed visible)
 */
export function TripDetailView({
  ride,
  onBack,
  onReserve,
}: {
  ride: RideCard;
  onBack: () => void;
  onReserve: () => void;
}) {
  const durationText = formatDurationText(ride.durationMin);

  return (
    <div className="trip-detail-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Trip details</h2>
          <p>Review corridor schedule & driver trust profile</p>
        </div>
      </header>

      <div className="detail-scrollable">
        {/* Trip summary */}
        <section className="detail-card summary-card">
          <div className="summary-time-row">
            <strong className="summary-departure">{ride.time}</strong>
            <span className="summary-eta">{ride.eta}</span>
          </div>
          <h3 className="summary-route">Ikorodu Hub ➔ Victoria Island Hub</h3>
          <div className="summary-meta-badges">
            <span><Clock3 size={14} /> {durationText}</span>
            <span className="dot-sep">·</span>
            <span><Calendar size={14} /> Tomorrow morning</span>
            <span className="dot-sep">·</span>
            <span className="seat-avail-tag">{ride.seats} seats remaining</span>
          </div>
        </section>

        {/* Your driver */}
        <section className="detail-card driver-trust-card">
          <h4 className="card-section-label">YOUR DRIVER</h4>
          <div className="driver-profile-row">
            <Avatar initials={ride.initials} color={ride.avatarColor} size={52} photo={ride.photo} />
            <div className="driver-info">
              <div className="name-verify-line">
                <h3>{ride.driver}</h3>
                <span className="badge-verified-tag">
                  <BadgeCheck size={14} />
                  <span>VERIFIED</span>
                </span>
              </div>
              <p className="driver-sub-text">Verified Lagos commuter on this corridor</p>
            </div>
          </div>

          <div className="reliability-metric-grid">
            <div className="rm-box">
              <strong className="rm-val">{ride.completionRate ?? 98}%</strong>
              <span className="rm-lbl">Completion</span>
            </div>
            <div className="rm-box">
              <strong className="rm-val">{ride.onTimeRate ?? 97}%</strong>
              <span className="rm-lbl">On-time</span>
            </div>
            <div className="rm-box">
              <strong className="rm-val">{ride.trips}</strong>
              <span className="rm-lbl">Trips completed</span>
            </div>
          </div>
        </section>

        {/* Vehicle & pickup */}
        <section className="detail-card vehicle-pickup-card">
          <h4 className="card-section-label">VEHICLE & PICKUP</h4>
          
          <div className="vehicle-row">
            <CarFront size={22} className="card-icon" />
            <div>
              <strong>{ride.car}</strong>
              <p>{ride.color ?? 'Silver'} · Plate: <span className="plate-chip">{ride.plate}</span></p>
            </div>
          </div>

          <div className="pickup-hub-row">
            <MapPin size={22} className="card-icon" />
            <div>
              <strong>Ikorodu Hub</strong>
              <p>Main Gate</p>
              <span className="well-lit-tag">
                <Check size={12} />
                <span>Well-lit pickup point & commuter waiting bay</span>
              </span>
            </div>
          </div>
        </section>

        {/* Commitment guarantee notice */}
        <section className="detail-card commitment-notice-card">
          <ShieldCheck size={20} className="notice-shield" />
          <div>
            <strong>COMUTA Driver Commitment Guarantee</strong>
            <p>Driver Adebayo K. must confirm by 11:00 PM tonight. If anything changes, COMUTA automatically re-seats you or issues an instant refund.</p>
          </div>
        </section>
      </div>

      {/* Booking CTA (Fixed visible) */}
      <div className="fixed-bottom-bar">
        <button className="btn btn-primary btn-block cta-large" onClick={onReserve}>
          <span>Reserve 1 seat · {formatNaira(ride.price)}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * 8. Booking Review Screen
 * Review booking:
 * Your commute: Ikorodu Hub ↓ Victoria Island Hub, Tomorrow 7:00 AM
 * Driver: Adebayo K.
 * Seat: 1 seat
 * Price: ₦1,500
 * Cancellation policy: Short, expandable explanation.
 * CTA: Continue to payment
 */
export function BookingReviewView({
  ride,
  onBack,
  onProceedToPay,
}: {
  ride: RideCard;
  onBack: () => void;
  onProceedToPay: () => void;
}) {
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <div className="booking-review-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Review booking</h2>
          <p>Confirm commute details before payment</p>
        </div>
      </header>

      <div className="review-card">
        {/* Your commute */}
        <div className="review-section">
          <span className="review-sublabel">YOUR COMMUTE</span>
          <div className="commute-path-display">
            <div className="point-item">
              <span className="dot origin" />
              <strong>Ikorodu Hub (Main Gate)</strong>
            </div>
            <div className="path-arrow">↓</div>
            <div className="point-item">
              <span className="dot destination" />
              <strong>Victoria Island Hub (Sterling / Ozumba)</strong>
            </div>
          </div>
          <div className="commute-time-badge">
            <CalendarDays size={15} />
            <span>Tomorrow · 7:00 AM departure</span>
          </div>
        </div>

        <div className="divider" />

        {/* Driver */}
        <div className="review-section-row">
          <span className="review-sublabel">DRIVER</span>
          <div className="driver-val">
            <Avatar initials={ride.initials} color={ride.avatarColor} size={32} photo={ride.photo} />
            <strong>{ride.driver}</strong>
          </div>
        </div>

        {/* Seat */}
        <div className="review-section-row">
          <span className="review-sublabel">SEAT</span>
          <strong>1 seat</strong>
        </div>

        {/* Price */}
        <div className="review-section-row price-highlight">
          <span className="review-sublabel">PRICE</span>
          <strong className="total-val">{formatNaira(ride.price)}</strong>
        </div>

        <div className="divider" />

        {/* Cancellation policy (Short, expandable explanation) */}
        <div className="cancellation-policy-toggle">
          <button
            type="button"
            className="policy-accordion-btn"
            onClick={() => setPolicyOpen(!policyOpen)}
          >
            <span>Cancellation policy</span>
            <ChevronDown size={16} className={policyOpen ? 'rotate-180' : ''} />
          </button>
          {policyOpen && (
            <div className="policy-content">
              <p>
                Cancel anytime up to 2 hours before departure for a 100% instant refund.
                If your driver cannot make the trip during the T-8 commitment check, you will be
                automatically reassigned to the next verified driver or refunded immediately.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA: Continue to payment */}
      <div className="fixed-bottom-bar">
        <button className="btn btn-primary btn-block cta-large" onClick={onProceedToPay}>
          <span>Continue to payment</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * 9. Payment Screen & Confirmation
 * Pay: ₦1,500 / COMUTA trip
 * Payment method: Paystack
 * CTA: Pay ₦1,500
 * Processing state: Button becomes "Processing…" (disabled to prevent repeat press)
 * Success:
 * Seat confirmed / Ikorodu → Victoria Island / Tomorrow · 7:00 AM
 * Your driver will confirm their commitment before the trip.
 * View trip CTA with subtle COMUTA illustration/motion!
 */
export function PaymentFlowView({
  ride,
  onBack,
  onComplete,
}: {
  ride: RideCard;
  onBack: () => void;
  onComplete: () => void;
}) {
  const { payBooking, state, requestSeat } = usePlatform();
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handlePay = () => {
    if (processing || confirmed) return;
    setProcessing(true);

    // Simulate Paystack transaction handoff
    setTimeout(() => {
      requestSeat(ride.id);
      setProcessing(false);
      setConfirmed(true);
    }, 1200);
  };

  if (confirmed) {
    return (
      <div className="payment-success-screen">
        <div className="success-content-card">
          {/* Subtle COMUTA illustration/motion */}
          <ConfirmedBookingIllustration size={190} />

          <div className="success-text-group">
            <span className="success-pill">CONFIRMED</span>
            <h1>Seat confirmed</h1>
            <h2 className="corridor-name">Ikorodu ➔ Victoria Island</h2>
            <p className="schedule-detail">Tomorrow · 7:00 AM departure</p>
            <div className="commitment-reassurance">
              <Info size={16} />
              <p>Your driver will confirm their commitment before the trip.</p>
            </div>
          </div>

          <div className="trip-pin-pill">
            <small>YOUR TRIP PIN</small>
            <strong>4827</strong>
          </div>

          <button className="btn btn-primary btn-block cta-large" onClick={onComplete}>
            <span>View trip</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} disabled={processing} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Pay</h2>
          <p>Secure corridor contribution</p>
        </div>
      </header>

      <div className="payment-card">
        <div className="amount-display-box">
          <span className="pay-tag">COMUTA trip</span>
          <strong className="amount-big">{formatNaira(ride.price)}</strong>
          <small>Ikorodu Hub ➔ Victoria Island Hub</small>
        </div>

        <div className="payment-method-box">
          <span className="pm-label">Payment method</span>
          <div className="paystack-option selected">
            <div className="pm-icon"><CreditCard size={20} /></div>
            <div className="pm-details">
              <strong>Paystack</strong>
              <small>Debit Card, Bank Transfer, or USSD</small>
            </div>
            <CheckCircle2 size={20} className="pm-check" />
          </div>
        </div>

        <div className="security-assurance">
          <ShieldCheck size={16} />
          <span>Protected by COMUTA Escrow. Funds are released after trip completion.</span>
        </div>
      </div>

      <div className="fixed-bottom-bar">
        <button
          className="btn btn-primary btn-block cta-large"
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? (
            <span className="processing-state">
              <RefreshCw size={18} className="spinner" />
              <span>Processing…</span>
            </span>
          ) : (
            <span>Pay {formatNaira(ride.price)}</span>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * 12. Pickup Experience Screen
 * "Where exactly am I supposed to go?"
 * Screen: Meet your driver
 * Ikorodu Hub · Main Gate
 * Toyota Corolla · Silver · ABC 123 XY · Adebayo K.
 * Verification: Your trip PIN: 4827 (Driver confirms this PIN before departure)
 */
export function PickupView({
  onBack,
  onTripStart,
}: {
  onBack: () => void;
  onTripStart: () => void;
}) {
  const [atPickup, setAtPickup] = useState(false);

  return (
    <div className="pickup-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Meet your driver</h2>
          <p>Departure: Tomorrow · 7:00 AM</p>
        </div>
      </header>

      <div className="pickup-card">
        {/* Hub location */}
        <div className="hub-location-header">
          <div className="hl-icon"><MapPin size={24} /></div>
          <div>
            <span className="hub-tag">DESIGNATED PICKUP POINT</span>
            <h3>Ikorodu Hub</h3>
            <p className="gate-desc">Main Gate · Well-lit pickup point</p>
          </div>
        </div>

        <div className="divider" />

        {/* Vehicle & Driver */}
        <div className="driver-vehicle-group">
          <div className="veh-card">
            <span className="veh-name">Toyota Corolla</span>
            <span className="veh-detail">Silver · <strong className="plate">ABC 123 XY</strong></span>
          </div>

          <div className="driver-chip">
            <Avatar initials="AK" color="#0C392C" size={40} photo="/images/people/ade.jpg" />
            <div>
              <strong>Adebayo K.</strong>
              <small>Verified driver · 98% completion</small>
            </div>
            <span className="badge-verified"><ShieldCheck size={14} /></span>
          </div>
        </div>

        <div className="divider" />

        {/* Verification: Your trip PIN */}
        <div className="pin-verification-box">
          <span className="pin-title">YOUR TRIP PIN</span>
          <div className="pin-code-huge">4827</div>
          <p className="pin-instruction">Driver confirms this PIN before departure.</p>
        </div>
      </div>

      <div className="pickup-actions-footer">
        <button
          className={`btn ${atPickup ? 'btn-light' : 'btn-primary'} btn-block`}
          onClick={() => setAtPickup(!atPickup)}
        >
          <Check size={18} />
          <span>{atPickup ? 'You marked: "I am at pickup"' : "I'm at pickup"}</span>
        </button>

        <button className="btn btn-dark btn-block" onClick={onTripStart}>
          <Navigation size={18} />
          <span>Driver has arrived ➔ Open active trip</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 13. Active Trip Screen
 * Almost entirely map!
 * Top: Ikorodu → Victoria Island / ETA 32 min
 * Map: Vehicle moving along route
 * Persistent actions: Share trip / SOS (never hidden inside menus)
 */
export function ActiveTripView({
  onBack,
  onComplete,
  onSos,
}: {
  onBack: () => void;
  onComplete: () => void;
  onSos: () => void;
}) {
  const [shared, setShared] = useState(false);

  return (
    <div className="active-trip-screen">
      {/* Top Banner */}
      <div className="active-top-bar">
        <button className="back-btn-light" onClick={onBack} aria-label="Back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div className="active-corridor-info">
          <h2>Ikorodu ➔ Victoria Island</h2>
          <div className="eta-live">
            <span className="live-pulse" />
            <strong>ETA 32 min</strong>
            <span className="dot-sep">·</span>
            <span>On Third Mainland Bridge</span>
          </div>
        </div>
      </div>

      {/* Almost Entirely Map with moving vehicle */}
      <div className="active-map-canvas">
        <CorridorMapArtwork
          fromLabel="Ikorodu Hub"
          toLabel="Victoria Island Hub"
          showVehicle
          vehicleProgress={55}
        />
      </div>

      {/* Persistent bottom safety bar */}
      <div className="active-persistent-bar">
        <div className="driver-mini-info">
          <Avatar initials="AK" color="#0C392C" size={36} photo="/images/people/ade.jpg" />
          <div>
            <strong>Adebayo K.</strong>
            <small>Toyota Corolla · ABC 123 XY</small>
          </div>
        </div>

        {/* Persistent actions: Share trip and SOS */}
        <div className="safety-action-buttons">
          <button
            className={`btn-safety-share ${shared ? 'shared' : ''}`}
            onClick={() => setShared(!shared)}
          >
            <Share2 size={16} />
            <span>{shared ? 'Trip Shared' : 'Share trip'}</span>
          </button>

          <button className="btn-safety-sos" onClick={onSos}>
            <ShieldAlert size={16} />
            <span>SOS</span>
          </button>
        </div>

        <button className="btn btn-primary btn-block btn-small arrive-demo-btn" onClick={onComplete}>
          <span>Simulate arrival at destination ➔</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 14. Trip Completion Screen
 * You're here / Ikorodu → Victoria Island
 * Rate your driver: ★★★★★
 * Anything we should know? Report an issue (optional)
 * CTA: Done → Trip receipt
 */
export function TripCompletionView({
  onDone,
}: {
  onDone: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [reported, setReported] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  return (
    <div className="completion-screen">
      <div className="completion-card">
        <div className="arrival-badge">
          <CheckCircle2 size={36} />
        </div>
        
        <h1 className="here-title">You're here</h1>
        <h2 className="corridor-arrival">Ikorodu ➔ Victoria Island</h2>
        <p className="arrival-sub">Victoria Island Hub · Sterling Towers Bay</p>

        {/* Rate your driver */}
        <div className="driver-rating-box">
          <span className="rating-prompt">Rate your driver</span>
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                <Star size={28} fill={star <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <span className="driver-target">Adebayo K. · Toyota Corolla ABC 123 XY</span>
        </div>

        {/* Anything we should know? Report an issue */}
        <div className="report-issue-toggle">
          <button
            type="button"
            className="text-link-issue"
            onClick={() => setReported(!reported)}
          >
            {reported ? '✓ Issue reported to COMUTA Safety' : 'Anything we should know? Report an issue'}
          </button>
        </div>

        <div className="completion-actions">
          <button className="btn btn-outline btn-block" onClick={() => setReceiptOpen(true)}>
            View trip receipt
          </button>
          <button className="btn btn-primary btn-block cta-large" onClick={onDone}>
            Done
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptOpen && (
        <Modal open onClose={() => setReceiptOpen(false)}>
          <div className="receipt-modal-content">
            <header className="receipt-head">
              <h3>Trip receipt</h3>
              <p>COMUTA Corridor Commute</p>
            </header>
            <div className="receipt-breakdown">
              <div className="rb-row"><span>Route</span><strong>Ikorodu ➔ Victoria Island</strong></div>
              <div className="rb-row"><span>Pickup Hub</span><span>Main Gate</span></div>
              <div className="rb-row"><span>Driver</span><span>Adebayo K.</span></div>
              <div className="rb-row"><span>Vehicle</span><span>Toyota Corolla (ABC 123 XY)</span></div>
              <div className="rb-row"><span>Seat contribution</span><strong>₦1,500</strong></div>
              <div className="rb-row"><span>Platform fee</span><span>₦0 (Included)</span></div>
              <div className="divider" />
              <div className="rb-row total"><span>Total paid</span><strong>₦1,500</strong></div>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => setReceiptOpen(false)}>
              Close receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/**
 * 15. Recurring Commute Screen
 * Transportation subscription / calendar, not taxi app:
 * My commute / Ikorodu → Victoria Island / Mon–Fri · 7:00 AM / ₦1,500 / trip
 * Manage: Skip tomorrow, Pause route, Edit schedule
 */
export function RecurringCommuteView({
  onBack,
}: {
  onBack: () => void;
}) {
  const { state, manageRecurringSchedule } = usePlatform();
  const commute = state.recurringCommutes[0] ?? {
    id: 'REC-01',
    fromHub: 'Ikorodu Hub',
    toHub: 'Victoria Island Hub',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    time: '7:00 AM',
    price: 1500,
    status: 'active' as const,
    driverName: 'Adebayo K.',
    driverCar: 'Toyota Corolla · ABC 123 XY',
  };

  const isSkipped = commute.status === 'skipped_tomorrow';
  const isPaused = commute.status === 'paused';

  return (
    <div className="recurring-commute-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>My commute</h2>
          <p>Transportation calendar subscription</p>
        </div>
      </header>

      <div className="subscription-card">
        <div className="sub-header-row">
          <span className="sub-badge">RECURRING COMMUTE</span>
          <span className={`sub-status ${isPaused ? 'paused' : isSkipped ? 'skipped' : 'active'}`}>
            {isPaused ? 'PAUSED' : isSkipped ? 'SKIPPED TOMORROW' : 'ACTIVE'}
          </span>
        </div>

        <h1 className="sub-corridor-title">{commute.fromHub} ➔ {commute.toHub}</h1>

        <div className="schedule-calendar-strip">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
            <span key={day} className="day-chip active">{day}</span>
          ))}
          <span className="time-badge">{commute.time}</span>
        </div>

        <div className="sub-financial-row">
          <div>
            <span className="sf-lbl">Cost per commute</span>
            <strong className="sf-val">{formatNaira(commute.price)} / trip</strong>
          </div>
          <div>
            <span className="sf-lbl">Preferred driver</span>
            <strong className="sf-val">{commute.driverName}</strong>
          </div>
        </div>

        <div className="divider" />

        {/* Manage buttons: Skip tomorrow, Pause route, Edit schedule */}
        <div className="manage-button-group">
          <button
            className={`btn ${isSkipped ? 'btn-dark' : 'btn-outline'} btn-block`}
            onClick={() =>
              manageRecurringSchedule(commute.id, isSkipped ? 'resume' : 'skip_tomorrow')
            }
          >
            <RotateCcw size={16} />
            <span>{isSkipped ? 'Undo: Resume tomorrow' : 'Skip tomorrow'}</span>
          </button>

          <button
            className={`btn ${isPaused ? 'btn-primary' : 'btn-outline'} btn-block`}
            onClick={() =>
              manageRecurringSchedule(commute.id, isPaused ? 'resume' : 'pause')
            }
          >
            <RefreshCw size={16} />
            <span>{isPaused ? 'Resume route' : 'Pause route'}</span>
          </button>

          <button className="btn btn-light btn-block">
            <CalendarDays size={16} />
            <span>Edit schedule & departure time</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 11. At-Risk Experience Screen
 * "Something changed"
 * "Your driver can no longer make this commute. We're finding another option."
 * View alternatives | Request refund
 * Signature recovery philosophy: "Don't report a failure without presenting the next action."
 */
export function AtRiskRecoveryView({
  onBack,
  onResolved,
}: {
  onBack: () => void;
  onResolved: () => void;
}) {
  const { acceptAlternativeBooking, requestRefund, state } = usePlatform();
  const [recovering, setRecovering] = useState(false);
  const [recoveredDriver, setRecoveredDriver] = useState<string | null>(null);

  const handleAlternative = () => {
    setRecovering(true);
    setTimeout(() => {
      acceptAlternativeBooking('BKG-HERO-01', 'CM-IKR-02');
      setRecovering(false);
      setRecoveredDriver('Ifeoma N.');
    }, 900);
  };

  const handleRefund = () => {
    requestRefund('BKG-HERO-01');
    onResolved();
  };

  return (
    <div className="at-risk-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Commute protection</h2>
          <p>COMUTA Active Recovery</p>
        </div>
      </header>

      <div className="at-risk-card">
        {/* Signature Recovery Illustration */}
        <RecoveryIllustration size={170} />

        <div className="at-risk-message">
          <span className="at-risk-pill">ACTION IN PROGRESS</span>
          <h1>Something changed</h1>
          <p className="lead-reason">
            Your driver Adebayo K. can no longer make tomorrow’s 7:00 AM commute.
          </p>
          <strong className="recovery-pledge">
            We're finding another option for your journey.
          </strong>
        </div>

        {recoveredDriver ? (
          <div className="recovery-success-box">
            <CheckCircle2 size={24} className="check-success" />
            <div>
              <strong>You're still covered!</strong>
              <p>Reassigned to verified driver {recoveredDriver} (6:45 AM, Toyota Corolla, ₦1,500). Trip PIN remains 4827.</p>
            </div>
            <button className="btn btn-primary btn-block" onClick={onResolved}>
              View updated commute ➔
            </button>
          </div>
        ) : (
          <div className="recovery-options-grid">
            <button
              className="btn btn-primary btn-block cta-large"
              onClick={handleAlternative}
              disabled={recovering}
            >
              {recovering ? (
                <span>Reassigning driver…</span>
              ) : (
                <span>View alternatives (Ifeoma N. · 6:45 AM)</span>
              )}
            </button>

            <button className="btn btn-outline btn-block" onClick={handleRefund}>
              Request instant refund (₦1,500)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 13. Rider Account Screen
 */
export function RiderAccountView({
  onLogout,
  onSwitchMode,
}: {
  onLogout: () => void;
  onSwitchMode: () => void;
}) {
  const { me } = usePlatform();

  return (
    <div className="rider-account-screen">
      <header className="screen-header">
        <div>
          <h2>Account & Trust</h2>
          <p>Manage your profile, verification and preferences</p>
        </div>
      </header>

      <div className="account-card">
        <div className="user-profile-header">
          <Avatar initials="OO" color="#0C392C" size={60} />
          <div>
            <h3>{me?.firstName} {me?.lastName}</h3>
            <p>{me?.phone}</p>
            <span className="badge-verified-tag"><ShieldCheck size={14} /><span>ID VERIFIED</span></span>
          </div>
        </div>

        <div className="divider" />

        <div className="account-nav-list">
          <button className="account-nav-item" onClick={onSwitchMode}>
            <CarFront size={18} />
            <div><strong>Switch to Driver mode</strong><small>Recover commute costs with empty seats</small></div>
            <ChevronRight size={18} />
          </button>
          <div className="account-nav-item">
            <ShieldCheck size={18} />
            <div><strong>Identity & KYC verification</strong><small>National Identity Number (NIN) verified</small></div>
            <span className="status-done">Verified</span>
          </div>
          <div className="account-nav-item">
            <CreditCard size={18} />
            <div><strong>Payment methods</strong><small>Paystack Card •••• 2048</small></div>
            <ChevronRight size={18} />
          </div>
          <div className="account-nav-item">
            <Phone size={18} />
            <div><strong>Trusted contacts</strong><small>Funmi Ojo (Sister)</small></div>
            <ChevronRight size={18} />
          </div>
          <button className="account-nav-item logout" onClick={onLogout}>
            <span>Log out of COMUTA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
