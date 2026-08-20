import {
  ArrowRight, BadgeCheck, ChevronRight, Home, Repeat2, ShieldCheck, Star, Users, Zap,
} from 'lucide-react';
import { Avatar } from '../components/UI';
import { formatNaira, type RideCard, type Trip } from '../platform';

export function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
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

export function SparkIcon() {
  return <span className="spark-icon"><Zap size={15} /></span>;
}

export function tripStatusLabel(status: Trip['status']) {
  switch (status) {
    case 'driver_en_route': return 'DRIVER EN ROUTE';
    case 'driver_arrived': return 'DRIVER HAS ARRIVED';
    case 'in_progress': return 'TRIP IN PROGRESS';
    case 'completed': return 'COMPLETED';
    case 'cancelled': return 'CANCELLED';
    default: return 'SCHEDULED';
  }
}

export function whenCopy(when: 'today' | 'tomorrow' | 'friday') {
  if (when === 'today') return 'Today';
  if (when === 'friday') return 'Friday';
  return 'Tomorrow';
}

export function CompactRide({ ride, onClick }: { ride: RideCard; onClick: () => void }) {
  return (
    <button className="compact-ride" onClick={onClick}>
      <div className="compact-match"><strong>{ride.match}%</strong><span>match</span></div>
      <Avatar initials={ride.initials} color={ride.avatarColor} size={48} photo={ride.photo} />
      <div className="compact-driver">
        <strong>{ride.driver} {ride.verified && <BadgeCheck size={14} fill="currentColor" />}</strong>
        <span><Star size={12} fill="currentColor" /> {ride.rating} · {ride.car}</span>
        <small><Users size={12} />{ride.community}</small>
      </div>
      <div className="compact-route">
        <strong>{ride.time}</strong>
        <span>{ride.from} <ArrowRight size={12} /> {ride.to}</span>
        <small><Repeat2 size={12} /> {ride.recurring ? 'Every weekday' : 'Single ride'}</small>
      </div>
      <div className="compact-price">
        <strong>{formatNaira(ride.price)}</strong>
        <span>per seat</span>
        <small>{ride.seats} left</small>
      </div>
      <ChevronRight size={20} />
    </button>
  );
}

export function ResultRide({ ride, onClick }: { ride: RideCard; onClick: () => void }) {
  return (
    <article className="result-ride" onClick={onClick}>
      <div className="result-left">
        <div className="result-time"><strong>{ride.time}</strong><span>{ride.eta}</span></div>
        <div className="result-line"><i /><em /><i /></div>
        <div className="result-locations">
          <div><strong>{ride.pickup}</strong><span>Pickup · near your start</span></div>
          <div><strong>{ride.dropoff}</strong><span>Arrival · short walk to your destination</span></div>
        </div>
      </div>
      <div className="result-person">
        <Avatar initials={ride.initials} color={ride.avatarColor} size={48} photo={ride.photo} />
        <div>
          <strong>{ride.driver}{ride.verified && <BadgeCheck size={14} fill="currentColor" />}</strong>
          <span><Star size={12} fill="currentColor" /> {ride.rating} · {ride.trips} trips</span>
          <small>{ride.car}</small>
        </div>
      </div>
      <div className="result-chips">
        <span><Users size={13} />{ride.community}</span>
        {ride.recurring && <span><Repeat2 size={13} />Weekday regular</span>}
        {ride.verified && <span><ShieldCheck size={13} />Fully verified</span>}
      </div>
      <div className="result-value">
        <span className="big-match">{ride.match}%<small>match</small></span>
        <strong>{formatNaira(ride.price)}<small>/ seat</small></strong>
        <span>{ride.seats} seats left</span>
        <button>View ride <ChevronRight size={15} /></button>
      </div>
    </article>
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

export function MobileNav({ nav, current, setTab }: { nav: readonly { id: string; label: string; icon: typeof Home }[]; current: string; setTab: (id: string) => void }) {
  return (
    <nav className="mobile-bottom-nav">
      {nav.map(({ id, label, icon: Icon }) => (
        <button key={id} className={current === id ? 'active' : ''} onClick={() => setTab(id)}>
          <Icon size={20} />
          <span>{label}</span>
          {id === 'requests' && <i />}
        </button>
      ))}
    </nav>
  );
}
