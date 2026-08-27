import {
  ArrowRight, BadgeCheck, CheckCircle2, ChevronRight, Clock3, Home, MapPin, Repeat2,
  Shield, ShieldCheck, Sparkles, Star, Users,
} from 'lucide-react';
import { Avatar } from '../components/UI';
import { formatNaira, type RideCard, type Trip } from '../platform';

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="app-page-heading">
      <div>
        {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * 35–40% Corridor Map for Search Results / Active Trip
 * Purpose: "I understand where this trip goes." (Not busy turn-by-turn navigation)
 */
export function CorridorMapArtwork({
  fromLabel = 'Ikorodu Hub',
  toLabel = 'Victoria Island Hub',
  interactive = false,
  showVehicle = false,
  vehicleProgress = 40,
}: {
  fromLabel?: string;
  toLabel?: string;
  interactive?: boolean;
  showVehicle?: boolean;
  vehicleProgress?: number;
}) {
  return (
    <div className="corridor-map-container" aria-label={`Corridor map from ${fromLabel} to ${toLabel}`}>
      {/* Soft Lagos Lagoon / Water backdrop */}
      <div className="map-water-layer" />
      {/* Landmass shapes for Mainland and Island */}
      <div className="map-land-mainland" />
      <div className="map-land-island" />
      
      {/* SVG Corridor Route */}
      <svg className="corridor-svg" viewBox="0 0 420 220" preserveAspectRatio="none">
        {/* Background shadow path */}
        <path
          d="M 60 45 C 130 50, 190 100, 240 140 C 280 170, 320 180, 365 175"
          fill="none"
          stroke="rgba(12, 57, 44, 0.15)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Main corridor arterial line */}
        <path
          d="M 60 45 C 130 50, 190 100, 240 140 C 280 170, 320 180, 365 175"
          fill="none"
          stroke="#0C392C"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Active transit flow dashes */}
        <path
          d="M 60 45 C 130 50, 190 100, 240 140 C 280 170, 320 180, 365 175"
          fill="none"
          stroke="#CCF06A"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          className="active-corridor-flow"
        />
      </svg>

      {/* Origin Hub Marker */}
      <div className="hub-marker origin">
        <div className="hub-pulse" />
        <span className="hub-dot" />
        <div className="hub-tooltip">
          <strong>{fromLabel}</strong>
          <small>Main Gate · Well-lit pickup</small>
        </div>
      </div>

      {/* Corridor mid bridge label */}
      <div className="corridor-bridge-tag">
        <span>Third Mainland Corridor</span>
      </div>

      {/* Destination Hub Marker */}
      <div className="hub-marker destination">
        <span className="hub-dot destination" />
        <div className="hub-tooltip right">
          <strong>{toLabel}</strong>
          <small>Sterling Towers / Marina Bay</small>
        </div>
      </div>

      {/* Dynamic vehicle marker if in active trip mode */}
      {showVehicle && (
        <div
          className="corridor-vehicle-marker"
          style={{
            left: `${20 + (vehicleProgress / 100) * 65}%`,
            top: `${25 + (vehicleProgress / 100) * 55}%`,
          }}
        >
          <div className="vehicle-puck">
            <svg viewBox="0 0 24 24" fill="#CCF06A" width="14" height="14">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Standard COMUTA Trip Card
 * Strict 3-second decision hierarchy:
 * TIME → TRUST → VEHICLE → PRICE → AVAILABILITY
 */
export function ComutaTripCard({
  ride,
  onClick,
  selected = false,
}: {
  ride: RideCard;
  onClick: () => void;
  selected?: boolean;
}) {
  const completion = ride.completionRate ?? 98;
  const isAdebayo = ride.driver.toLowerCase().includes('adebayo');

  return (
    <article
      className={`comuta-trip-card ${selected ? 'selected' : ''} ${isAdebayo ? 'hero-match' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-top-row">
        {/* 1. TIME: 7:00 AM ~8:05 AM */}
        <div className="hierarchy-time">
          <strong className="dep-time">{ride.time}</strong>
          <span className="arr-time">{ride.eta}</span>
        </div>

        {/* 4. PRICE: ₦1,500 / seat */}
        <div className="hierarchy-price">
          <strong className="seat-price">{formatNaira(ride.price)}</strong>
          <small className="price-sub">/ seat</small>
        </div>
      </div>

      <div className="card-middle-row">
        {/* 2. TRUST: Adebayo K. · Verified · 98% completion */}
        <div className="hierarchy-trust">
          <div className="driver-name-row">
            <span className="driver-name">{ride.driver}</span>
            {ride.verified && (
              <span className="verified-pill">
                <ShieldCheck size={13} />
                <span>Verified · <strong>{completion}% completion</strong></span>
              </span>
            )}
          </div>
          
          {/* 3. VEHICLE: Toyota Corolla · ABC 123 XY */}
          <div className="hierarchy-vehicle">
            <span>{ride.car}</span>
            <span className="bullet">·</span>
            <span className="plate-badge">{ride.plate}</span>
          </div>
        </div>
      </div>

      <div className="card-bottom-row">
        <div className="route-context-pill">
          <MapPin size={12} />
          <span>{ride.pickupHub ?? 'Ikorodu Hub'} ➔ {ride.to}</span>
        </div>

        {/* 5. AVAILABILITY: 2 seats left */}
        <div className="hierarchy-availability">
          <span className={`seats-badge ${ride.seats <= 1 ? 'urgent' : ''}`}>
            {ride.seats} seat{ride.seats === 1 ? '' : 's'} left
          </span>
          <span className="view-cta">
            <span>Select</span>
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function MapArtwork() {
  return (
    <>
      <span className="fm-road r1" />
      <span className="fm-road r2" />
      <span className="fm-road r3" />
      <span className="fm-water" />
      <span className="fm-block b1" />
      <span className="fm-block b2" />
      <span className="fm-block b3" />
      <svg className="fm-route" viewBox="0 0 600 500">
        <path d="M44 430 C130 394 105 292 201 275 S300 320 360 208 S480 150 550 72" />
      </svg>
    </>
  );
}

export function MatchMeter({ ride }: { ride: RideCard }) {
  const rows: [string, number, number][] = [
    ['Route overlap', ride.breakdown.route, 40],
    ['Pickup proximity', ride.breakdown.pickup, 20],
    ['Destination', ride.breakdown.destination, 15],
    ['Time window', ride.breakdown.time, 10],
    ['Driver rating', ride.breakdown.rating, 5],
    ['Fair price', ride.breakdown.price, 10],
  ];
  return (
    <div className="match-meter">
      <header>
        <strong>{ride.match}%</strong>
        <span>Why this ride ranked here</span>
      </header>
      {rows.map(([label, value, max]) => (
        <div key={label} className="match-row">
          <span>{label}</span>
          <b>{value}/{max}</b>
          <i><em style={{ width: `${(value / max) * 100}%` }} /></i>
        </div>
      ))}
    </div>
  );
}

export function tripStatusLabel(status: Trip['status']) {
  switch (status) {
    case 'driver_confirmed':
      return 'DRIVER CONFIRMED';
    case 'driver_en_route':
      return 'DRIVER EN ROUTE';
    case 'driver_arrived':
      return 'DRIVER AT HUB';
    case 'in_progress':
      return 'TRIP IN PROGRESS';
    case 'completed':
      return 'COMPLETED';
    case 'cancelled':
      return 'CANCELLED';
    case 'at_risk':
      return 'ACTION NEEDED';
    default:
      return 'CONFIRMED';
  }
}

export function whenCopy(when: 'today' | 'tomorrow' | 'friday') {
  if (when === 'today') return 'Today';
  if (when === 'friday') return 'Friday';
  return 'Tomorrow';
}

export function MobileNav({
  nav,
  current,
  setTab,
}: {
  nav: readonly { id: string; label: string; icon: typeof Home }[];
  current: string;
  setTab: (id: string) => void;
}) {
  return (
    <nav className="mobile-bottom-nav">
      {nav.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={current === id ? 'active' : ''}
          onClick={() => setTab(id)}
        >
          <Icon size={20} />
          <span>{label}</span>
          {id === 'requests' && <i />}
        </button>
      ))}
    </nav>
  );
}
