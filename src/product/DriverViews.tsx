import { useEffect, useState } from 'react';
import {
  AlertTriangle, ArrowRight, BadgeCheck, Calendar, CalendarDays, CarFront, Check, CheckCircle2,
  ChevronRight, Clock3, Coins, DollarSign, HelpCircle, Navigation, Phone, Plus, RefreshCw,
  Repeat2, Shield, ShieldCheck, Star, TrendingUp, Users, WalletCards, X,
} from 'lucide-react';
import { Avatar } from '../components/UI';
import { DriverCommitmentIllustration } from '../components/Illustrations';
import { formatNaira, fullName, greetingFor, usePlatform } from '../platform';
import { CorridorMapArtwork } from './shared';

type DriverProps = {
  onPublish: () => void;
  onCommitment: () => void;
  onTripNav: () => void;
  onReliability: () => void;
  onEarnings: () => void;
  onSwitchMode: () => void;
  onBack: () => void;
  notify: (s: string) => void;
};

/**
 * 16. Driver Home Screen
 * "Your commute is organized and your empty seats are helping cover the cost."
 * Header: Good morning
 * Your next commute: Ikorodu → Victoria Island / Tomorrow · 7:00 AM
 * Passenger summary: 3 / 4 seats booked
 * Cost recovery: ₦4,500 This month
 * Primary CTA: Publish a commute
 */
export function DriverHome({
  onPublish,
  onCommitment,
  onTripNav,
  onReliability,
  onEarnings,
  onSwitchMode,
}: Pick<DriverProps, 'onPublish' | 'onCommitment' | 'onTripNav' | 'onReliability' | 'onEarnings' | 'onSwitchMode'>) {
  const { me, state, confirmDriverCommitment } = usePlatform();
  const nextCommute = state.rides.find((r) => r.driverId === me?.id) ?? state.rides[0];
  const isConfirmed = nextCommute.confirmedByDriver;

  const [secondsLeft, setSecondsLeft] = useState(6138); // 01:42:18
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="driver-home-container">
      {/* Header */}
      <header className="driver-home-header">
        <div className="driver-greeting">
          <span className="mode-tag">DRIVER MODE</span>
          <h1>Good morning, {me?.firstName || 'Adebayo'}</h1>
          <p className="philosophy-sub">
            Your commute is organized and your empty seats are helping cover the cost.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onPublish}>
          <Plus size={16} />
          <span>Publish commute</span>
        </button>
      </header>

      {/* T-8 Commitment Alert Card (Signature COMUTA interaction) */}
      <section className={`driver-t8-banner ${isConfirmed ? 'committed' : 'pending'}`}>
        <div className="t8-badge-strip">
          <span className="t8-tag">T-8 COMMITMENT</span>
          <span className="t8-deadline">
            {isConfirmed ? '✓ COMMITTED FOR TOMORROW' : `CONFIRM WITHIN ${formattedCountdown}`}
          </span>
        </div>

        <div className="t8-info-row">
          <div>
            <h3>Ikorodu ➔ Victoria Island</h3>
            <p>Tomorrow · 7:00 AM departure · 3 passengers counting on you</p>
          </div>
          <button
            className={`btn ${isConfirmed ? 'btn-light' : 'btn-lime'}`}
            onClick={onCommitment}
          >
            {isConfirmed ? 'View commitment' : 'Confirm commitment'}
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Your next commute Card */}
      <section className="driver-next-card">
        <div className="dnc-head">
          <span className="eyebrow-label">YOUR NEXT COMMUTE</span>
          <span className="status-badge live">SCHEDULED</span>
        </div>

        <div className="dnc-route">
          <h2>Ikorodu Hub ➔ Victoria Island Hub</h2>
          <div className="dnc-time">
            <Clock3 size={15} />
            <span>Tomorrow · 7:00 AM (Pickup: Main Gate)</span>
          </div>
        </div>

        {/* Passenger Summary: 3 / 4 seats booked */}
        <div className="passenger-summary-box">
          <div className="ps-top">
            <strong>3 / 4 seats booked</strong>
            <span>₦4,500 contribution</span>
          </div>
          <div className="passenger-avatar-stack">
            <div className="avatar-chip"><Avatar initials="OO" color="#0C392C" size={32} /><span>Olabisi O. (PIN 4827)</span></div>
            <div className="avatar-chip"><Avatar initials="TN" color="#7059a3" size={32} /><span>Tobi N. (PIN 7721)</span></div>
            <div className="avatar-chip"><Avatar initials="AE" color="#cc7955" size={32} /><span>Amaka E. (PIN 3390)</span></div>
          </div>
        </div>

        <div className="dnc-actions">
          <button className="btn btn-primary" onClick={onTripNav}>
            <Navigation size={16} />
            <span>Start pickup navigation</span>
          </button>
          <button className="btn btn-outline" onClick={onCommitment}>
            <span>Manage passengers</span>
          </button>
        </div>
      </section>

      {/* Driver Metrics: Cost Recovery & Reliability */}
      <div className="driver-metrics-grid">
        {/* Cost Recovery Card */}
        <div className="metric-box cost-recovery" onClick={onEarnings} role="button" tabIndex={0}>
          <div className="mb-top">
            <span>COST RECOVERY</span>
            <Coins size={18} />
          </div>
          <strong className="mb-val">₦4,500</strong>
          <p className="mb-sub">This month from shared seats</p>
          <span className="view-link">View settlement ledger <ChevronRight size={13} /></span>
        </div>

        {/* Driver Reliability Card (98%) */}
        <div className="metric-box reliability" onClick={onReliability} role="button" tabIndex={0}>
          <div className="mb-top">
            <span>COMUTA RELIABILITY</span>
            <ShieldCheck size={18} />
          </div>
          <strong className="mb-val">98%</strong>
          <p className="mb-sub">Top tier · 98% completion · 97% on-time</p>
          <span className="view-link">View reliability breakdown <ChevronRight size={13} /></span>
        </div>
      </div>
    </div>
  );
}

/**
 * 10. Driver Commitment (T-8 Screen) — Signature COMUTA interaction!
 * "Your trip is tomorrow"
 * "You have passengers counting on this commute."
 * Route: Ikorodu → Victoria Island
 * Time: 7:00 AM
 * Passengers: 3 riders
 * Deadline: Confirm by 11:00 PM (or countdown: Confirm within 01:42:18)
 * CTA: Confirm trip
 * Secondary: I can't make this trip
 */
export function DriverCommitmentView({
  onBack,
  onCancelled,
}: {
  onBack: () => void;
  onCancelled: () => void;
}) {
  const { confirmDriverCommitment, cancelDriverCommitment, state } = usePlatform();
  const [committed, setCommitted] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');

  const [secondsLeft, setSecondsLeft] = useState(6138); // 01:42:18
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleConfirm = () => {
    confirmDriverCommitment('CM-DRV-01');
    confirmDriverCommitment('CM-IKR-01');
    setCommitted(true);
  };

  const handleCancel = () => {
    cancelDriverCommitment('CM-IKR-01', reason || 'Emergency vehicle maintenance');
    setCancelling(false);
    onCancelled();
  };

  if (committed) {
    return (
      <div className="commitment-confirmed-screen">
        <div className="cc-card">
          <DriverCommitmentIllustration size={170} />
          <span className="pill-committed">✓ COMMITTED</span>
          <h1>You're committed</h1>
          <h2>Ikorodu ➔ Victoria Island</h2>
          <p className="cc-sub">
            Tomorrow · 7:00 AM · 3 riders notified.
            Thank you for keeping Lagos commuting dependable.
          </p>
          <div className="passenger-confirmed-list">
            <div><CheckCircle2 size={16} /><span>Olabisi O. (Seat 1)</span></div>
            <div><CheckCircle2 size={16} /><span>Tobi N. (Seat 2)</span></div>
            <div><CheckCircle2 size={16} /><span>Amaka E. (Seat 3)</span></div>
          </div>
          <button className="btn btn-primary btn-block cta-large" onClick={onBack}>
            Return to driver home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-commitment-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>T-8 Commitment</h2>
          <p>Confirm your morning commute</p>
        </div>
      </header>

      <div className="commitment-card">
        <div className="t8-urgency-banner">
          <Clock3 size={18} />
          <span>Confirm within <strong>{formattedCountdown}</strong></span>
        </div>

        <div className="commitment-header-text">
          <h1>Your trip is tomorrow</h1>
          <p className="reassurance-lead">
            You have passengers counting on this commute to get to work on time.
          </p>
        </div>

        <div className="commute-details-table">
          <div className="cdt-row">
            <span>Route</span>
            <strong>Ikorodu ➔ Victoria Island</strong>
          </div>
          <div className="cdt-row">
            <span>Time</span>
            <strong>7:00 AM</strong>
          </div>
          <div className="cdt-row">
            <span>Passengers</span>
            <strong>3 riders</strong>
          </div>
          <div className="cdt-row">
            <span>Deadline</span>
            <strong className="deadline-highlight">Confirm by 11:00 PM</strong>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="commitment-actions">
          <button className="btn btn-primary btn-block cta-large" onClick={handleConfirm}>
            <Check size={18} />
            <span>Confirm trip</span>
          </button>

          <button
            className="btn btn-outline btn-block btn-cancel-trip"
            onClick={() => setCancelling(true)}
          >
            I can't make this trip
          </button>
        </div>
      </div>

      {/* Cancellation confirmation modal */}
      {cancelling && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Unable to make this trip?</h3>
            <p>
              Please let us know why. COMUTA will immediately initiate our
              <strong> At-Risk recovery workflow</strong> to re-seat your 3 passengers with other
              verified drivers so they aren't stranded.
            </p>
            <textarea
              className="cancel-reason-input"
              rows={3}
              placeholder="e.g. Vehicle unexpected mechanical issue, illness..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="modal-actions-dual">
              <button className="btn btn-outline" onClick={() => setCancelling(false)}>
                Back
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>
                Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 17. Driver Publishing Screen
 * Publish a commute:
 * FROM: Ikorodu Hub
 * TO: Victoria Island Hub
 * DEPARTURE: 7:00 AM
 * SEATS: 3 available
 * CONTRIBUTION: ₦1,500 / seat
 * Schedule: One-off | Recurring
 * Publish commute button
 */
export function DriverPublishView({
  onBack,
  onPublished,
}: {
  onBack: () => void;
  onPublished: () => void;
}) {
  const { publishRide } = usePlatform();
  const [fromHub, setFromHub] = useState('Ikorodu Hub');
  const [toHub, setToHub] = useState('Victoria Island Hub');
  const [time, setTime] = useState('7:00 AM');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState(1500);
  const [schedule, setSchedule] = useState<'one-off' | 'recurring'>('recurring');

  const handlePublish = () => {
    publishRide({
      fromId: 'ikorodu-hub',
      toId: 'vi-hub',
      pickupId: 'ikorodu-hub',
      dropoffId: 'vi-hub',
      time,
      seats,
      price,
      recurring: schedule === 'recurring',
      days: [1, 2, 3, 4, 5],
      when: 'tomorrow',
    });
    onPublished();
  };

  return (
    <div className="driver-publish-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Publish a commute</h2>
          <p>Share your daily route & recover fuel costs</p>
        </div>
      </header>

      <div className="publish-form-card">
        {/* FROM */}
        <div className="form-item">
          <label className="input-group-label">FROM</label>
          <div className="corridor-pill-input">
            <span className="hub-dot-indicator origin" />
            <select value={fromHub} onChange={(e) => setFromHub(e.target.value)}>
              <option value="Ikorodu Hub">Ikorodu Hub (Main Gate)</option>
              <option value="Berger Hub">Berger Hub</option>
              <option value="Ikeja Hub">Ikeja Hub</option>
            </select>
          </div>
        </div>

        {/* TO */}
        <div className="form-item">
          <label className="input-group-label">TO</label>
          <div className="corridor-pill-input">
            <span className="hub-dot-indicator destination" />
            <select value={toHub} onChange={(e) => setToHub(e.target.value)}>
              <option value="Victoria Island Hub">Victoria Island Hub</option>
              <option value="Lekki Phase 1 Hub">Lekki Phase 1 Hub</option>
              <option value="Marina Hub">Marina Hub</option>
            </select>
          </div>
        </div>

        {/* DEPARTURE */}
        <div className="form-item">
          <label className="input-group-label">DEPARTURE</label>
          <div className="corridor-pill-input">
            <Clock3 size={16} />
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="6:30 AM">6:30 AM</option>
              <option value="6:45 AM">6:45 AM</option>
              <option value="7:00 AM">7:00 AM</option>
              <option value="7:15 AM">7:15 AM</option>
              <option value="7:30 AM">7:30 AM</option>
            </select>
          </div>
        </div>

        {/* SEATS & CONTRIBUTION */}
        <div className="split-form-row">
          <div className="form-item">
            <label className="input-group-label">SEATS</label>
            <div className="number-stepper">
              <button
                type="button"
                onClick={() => setSeats(Math.max(1, seats - 1))}
              >
                −
              </button>
              <strong>{seats} available</strong>
              <button
                type="button"
                onClick={() => setSeats(Math.min(4, seats + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="form-item">
            <label className="input-group-label">CONTRIBUTION</label>
            <div className="price-input-box">
              <span>₦</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 1500)}
                step={50}
              />
              <small>/ seat</small>
            </div>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="form-item">
          <label className="input-group-label">SCHEDULE</label>
          <div className="trip-type-tabs">
            <button
              className={`tab-btn ${schedule === 'one-off' ? 'active' : ''}`}
              onClick={() => setSchedule('one-off')}
              type="button"
            >
              One-off
            </button>
            <button
              className={`tab-btn ${schedule === 'recurring' ? 'active' : ''}`}
              onClick={() => setSchedule('recurring')}
              type="button"
            >
              Recurring (Mon–Fri)
            </button>
          </div>
        </div>
      </div>

      <div className="fixed-bottom-bar">
        <button className="btn btn-primary btn-block cta-large" onClick={handlePublish}>
          <span>Publish commute</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * 18. Driver Reliability Screen
 * Do not make this another generic star rating.
 * Your COMUTA reliability: 98%
 * Completion: 98%
 * On-time: 97%
 * Late cancellations: 1
 * No-shows: 0
 * How to improve: Short actionable guidance
 */
export function DriverReliabilityView({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="driver-reliability-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Operational Reliability</h2>
          <p>Your performance & corridor score</p>
        </div>
      </header>

      <div className="reliability-main-card">
        <div className="score-hero-circle">
          <span className="score-lbl">YOUR COMUTA RELIABILITY</span>
          <strong className="score-num">98%</strong>
          <span className="badge-tier">Tier 1 · Verified Commuter</span>
        </div>

        {/* Metrics Grid */}
        <div className="reliability-metrics-list">
          <div className="rml-item">
            <span>Completion</span>
            <strong className="good">98%</strong>
          </div>
          <div className="rml-item">
            <span>On-time</span>
            <strong className="good">97%</strong>
          </div>
          <div className="rml-item">
            <span>Late cancellations</span>
            <strong>1</strong>
          </div>
          <div className="rml-item">
            <span>No-shows</span>
            <strong className="good">0</strong>
          </div>
        </div>

        <div className="divider" />

        {/* How to improve */}
        <div className="improve-guidance-box">
          <h3>How to improve</h3>
          <ul className="guidance-list">
            <li>
              <CheckCircle2 size={16} />
              <span>Confirm morning trips before the 11:00 PM T-8 deadline.</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Arrive at Ikorodu Hub Main Gate 5 minutes before scheduled departure.</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Always verify the 4-digit trip PIN before pulling out of the bay.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Driver Pickup Navigation & Active Trip
 */
export function DriverTripNavView({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { verifyPin, completeTrip } = usePlatform();
  const [pinInput, setPinInput] = useState('');
  const [verifiedRiders, setVerifiedRiders] = useState<string[]>([]);
  const [tripStarted, setTripStarted] = useState(false);

  const handleVerify = () => {
    if (pinInput === '4827' || pinInput.length === 4) {
      setVerifiedRiders([...verifiedRiders, 'Olabisi O.']);
      setPinInput('');
      setTripStarted(true);
    }
  };

  return (
    <div className="driver-nav-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>{tripStarted ? 'Active commute' : 'Pickup at Ikorodu Hub'}</h2>
          <p>Destination: Victoria Island Hub</p>
        </div>
      </header>

      <div className="driver-nav-body">
        <div className="driver-nav-map">
          <CorridorMapArtwork
            fromLabel="Ikorodu Hub (Main Gate)"
            toLabel="Victoria Island Hub"
            showVehicle={tripStarted}
            vehicleProgress={tripStarted ? 60 : 5}
          />
        </div>

        <div className="nav-control-panel">
          {!tripStarted ? (
            <div className="pin-input-group">
              <label>Enter passenger trip PIN to depart:</label>
              <div className="pin-row">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 4827"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="pin-box-input"
                />
                <button className="btn btn-primary" onClick={handleVerify}>
                  Verify PIN & Start
                </button>
              </div>
              <small className="help-text">Riders have their PIN on their booking screen.</small>
            </div>
          ) : (
            <div className="active-nav-status">
              <div className="ans-header">
                <span className="live-dot" />
                <strong>Corridor commute in progress</strong>
                <span>ETA 32 min</span>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  completeTrip('TRIP-DRV-01');
                  completeTrip('TRIP-HERO-01');
                  onComplete();
                }}
              >
                Complete commute & Settle ₦4,500
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Driver Finance / Cost Recovery Ledger
 */
export function DriverEarningsView({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="driver-finance-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2>Cost Recovery & Earnings</h2>
          <p>Commute fuel & maintenance offset</p>
        </div>
      </header>

      <div className="finance-card">
        <div className="balance-hero">
          <span>AVAILABLE FOR SETTLEMENT</span>
          <strong>₦4,500</strong>
          <small>Next payout: Friday to GTBank ••0294</small>
        </div>

        <div className="ledger-history">
          <h3>Recent settlements</h3>
          <div className="lh-item">
            <div>
              <strong>Ikorodu ➔ Victoria Island (3 seats)</strong>
              <small>Yesterday · 7:00 AM</small>
            </div>
            <strong className="positive">+₦4,500</strong>
          </div>
          <div className="lh-item">
            <div>
              <strong>Victoria Island ➔ Ikorodu (2 seats)</strong>
              <small>Last week</small>
            </div>
            <strong className="positive">+₦3,000</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
