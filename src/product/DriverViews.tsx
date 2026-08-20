import { useState } from 'react';
import {
  ArrowRight, BadgeCheck, Banknote, CalendarDays, CarFront, Check, CheckCircle2, ChevronRight,
  Clock3, Coins, FileCheck2, MessageCircle, Navigation, Plus, Repeat2, Shield, Star, TrendingUp,
  Users,
} from 'lucide-react';
import { Avatar } from '../components/UI';
import { formatNaira, fullName, greetingFor, usePlatform } from '../platform';
import { PageHeading, whenCopy } from './shared';

type DriverProps = {
  onOffer: () => void;
  onRequests: () => void;
  onTrip: () => void;
  onSos: () => void;
  notify: (s: string) => void;
  onChat: (tripId: string) => void;
  onPin: (tripId: string) => void;
  onWallet: () => void;
};

export function DriverHome({ onOffer, onRequests, onTrip, onChat, onWallet }: Pick<DriverProps, 'onOffer' | 'onRequests' | 'onTrip' | 'onChat' | 'onWallet'>) {
  const { me, availableBalance, pendingRequestCount, driverRides, bookingsForRide, memberById, tripForRide } = usePlatform();
  const next = driverRides.find((ride) => ride.status === 'published');
  const passengers = next ? bookingsForRide(next.id).filter((booking) => booking.status === 'paid' || booking.status === 'accepted') : [];
  const trip = next ? tripForRide(next.id) : undefined;
  const expected = passengers.reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <>
      <PageHeading
        eyebrow="DRIVER MODE · ONLINE"
        title={`${greetingFor()}, ${me?.firstName || 'driver'}.`}
        subtitle={next ? `Your next shared commute has ${passengers.length} confirmed passenger${passengers.length === 1 ? '' : 's'}.` : 'Publish a recurring route to start filling seats.'}
        action={<button className="btn btn-primary" onClick={onOffer}><Plus size={17} /> Offer a ride</button>}
      />
      <div className="driver-stat-grid">
        <div className="main-driver-stat">
          <span>AVAILABLE BALANCE</span>
          <strong>{formatNaira(availableBalance)}</strong>
          <small>Next payout · Friday</small>
          <button onClick={onWallet}>View earnings <ArrowRight size={15} /></button>
          <Coins />
        </div>
        <div><span>THIS WEEK</span><strong>{formatNaira(24600)}</strong><small><TrendingUp size={13} /> 18% from last week</small></div>
        <div><span>SEATS FILLED</span><strong>{passengers.length} <em>/ {next?.seats ?? 3}</em></strong><small>{next ? `${Math.round((passengers.length / next.seats) * 100)}% utilisation` : 'Publish a ride'}</small></div>
        <div><span>DRIVER RATING</span><strong>{me?.rating ?? 5} <Star size={19} fill="currentColor" /></strong><small>From {me?.trips ?? 0} trips</small></div>
      </div>
      <div className="driver-dashboard-grid">
        {next ? (
          <section className="driver-next-trip">
            <div className="dnt-head">
              <span><i />NEXT RIDE · {whenCopy(next.when).toUpperCase()}</span>
              <button onClick={onTrip}>View details <ChevronRight size={15} /></button>
            </div>
            <div className="dnt-route">
              <span className="dnt-time">{next.time.replace(' AM', '').replace(' PM', '')}<small>{next.time.includes('PM') ? 'PM' : 'AM'}</small></span>
              <div>
                <span><i />{next.fromId === 'vi' ? 'Sterling Towers, VI' : 'Pickup'}</span>
                <em />
                <span><i />{next.toId === 'ajah' ? 'Novare Mall, Ajah' : 'Drop-off'}</span>
              </div>
              <span className="dnt-repeat"><Repeat2 />{next.recurring ? 'Weekdays' : 'One time'}</span>
            </div>
            <div className="passengers-head">
              <span>PASSENGERS · {passengers.length} OF {next.seats} SEATS</span>
              <span>{formatNaira(expected)} expected</span>
            </div>
            {passengers.map((booking) => {
              const rider = memberById(booking.riderId);
              if (!rider) return null;
              return (
                <div className="passenger-row" key={booking.id}>
                  <div>
                    <Avatar initials={rider.initials} color={rider.avatarColor} size={43} photo={rider.photo} />
                    <span>
                      <strong>{fullName(rider)} <BadgeCheck size={13} fill="currentColor" /></strong>
                      <small>Pickup · {booking.pickupNote ?? 'Shared after confirmation'}</small>
                    </span>
                  </div>
                  <span>{booking.seats} seat</span>
                  {trip && <button onClick={() => onChat(trip.id)}><MessageCircle size={17} /></button>}
                </div>
              );
            })}
            <button className="btn btn-dark btn-block" onClick={onTrip}><Navigation size={17} /> Prepare for trip</button>
          </section>
        ) : (
          <section className="driver-next-trip">
            <div className="dnt-head"><span>NO LIVE ROUTE</span></div>
            <p style={{ padding: 16 }}>Offer the journey you already make. Set seats, a fair contribution, and start receiving requests.</p>
            <button className="btn btn-dark btn-block" onClick={onOffer}>Offer a ride</button>
          </section>
        )}
        <aside>
          <section className="request-nudge">
            <div>
              <span>{pendingRequestCount}</span>
              <div><strong>New seat requests</strong><small>Waiting for your review</small></div>
            </div>
            <button onClick={onRequests}>Review requests <ArrowRight size={15} /></button>
          </section>
          <section className="performance-card">
            <div className="dash-section-head"><div><h3>Driver quality</h3><p>Last 30 days</p></div><strong>Excellent</strong></div>
            <div className="quality-row"><span>On time pickup</span><b>96%</b><i><em style={{ width: '96%' }} /></i></div>
            <div className="quality-row"><span>Acceptance rate</span><b>89%</b><i><em style={{ width: '89%' }} /></i></div>
            <div className="quality-row"><span>Low cancellation</span><b>98%</b><i><em style={{ width: '98%' }} /></i></div>
          </section>
          <section className="docs-card"><FileCheck2 /><div><strong>Documents up to date</strong><small>Insurance due in 93 days</small></div><ChevronRight /></section>
        </aside>
      </div>
    </>
  );
}

export function DriverRides({ onOffer, onSos, notify, onPin, onChat }: Pick<DriverProps, 'onOffer' | 'onSos' | 'notify' | 'onPin' | 'onChat'>) {
  const { driverRides, bookingsForRide, tripForRide, startNavigation, toCard, memberById } = usePlatform();
  const [tab, setTab] = useState<'upcoming' | 'recurring' | 'completed'>('upcoming');
  const upcoming = driverRides.filter((ride) => ride.status === 'published');
  const completed = driverRides.filter((ride) => ride.status === 'completed');
  const active = upcoming[0];
  const activeTrip = active ? tripForRide(active.id) : undefined;
  const activeCard = active ? toCard(active) : null;
  const people = active ? bookingsForRide(active.id).filter((booking) => booking.status === 'paid' || booking.status === 'accepted') : [];

  return (
    <>
      <PageHeading eyebrow="DRIVER SCHEDULE" title="My rides" subtitle="Manage recurring routes and upcoming journeys." action={<button className="btn btn-primary" onClick={onOffer}><Plus size={17} /> Offer a ride</button>} />
      <div className="trip-tabs">
        <button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>Upcoming <span>{upcoming.length}</span></button>
        <button className={tab === 'recurring' ? 'active' : ''} onClick={() => setTab('recurring')}>Recurring routes</button>
        <button className={tab === 'completed' ? 'active' : ''} onClick={() => setTab('completed')}>Completed</button>
      </div>
      {tab === 'upcoming' && active && activeCard && (
        <section className="driver-active-ride">
          <div className="dar-top">
            <span><i />{activeTrip?.status === 'driver_en_route' ? 'NAVIGATION LIVE' : `STARTING · ${whenCopy(active.when).toUpperCase()}`}</span>
            <small>Trip #{active.id}</small>
          </div>
          <div className="dar-content">
            <div className="dar-route">
              <strong>{active.time.replace(' AM', '').replace(' PM', '')} <small>{active.time.includes('PM') ? 'PM' : 'AM'}</small></strong>
              <div>
                <span><i />{activeCard.from}</span>
                <em />
                <span><i />{activeCard.to}</span>
              </div>
              <div><small>EST. EARNINGS</small><b>{formatNaira(people.reduce((sum, booking) => sum + booking.amount, 0))}</b></div>
            </div>
            <div className="dar-people">
              <span>PASSENGERS</span>
              <div className="mini-stack">
                {people.map((booking) => {
                  const rider = memberById(booking.riderId);
                  return rider ? <Avatar key={booking.id} initials={rider.initials} color={rider.avatarColor} size={38} photo={rider.photo} /> : null;
                })}
              </div>
              <p>{people.length} confirmed · {active.seatsLeft} seat{active.seatsLeft === 1 ? '' : 's'} open</p>
            </div>
            <div className="dar-actions">
              <button className="btn btn-dark" onClick={() => {
                if (activeTrip) {
                  startNavigation(activeTrip.id);
                  notify('Navigation is live. Head to pickup.');
                }
              }}><Navigation />Start navigation</button>
              {activeTrip && <button className="btn btn-outline" onClick={() => onPin(activeTrip.id)}>Enter ride PIN</button>}
              <button className="btn btn-outline" onClick={onSos}><Shield />Safety tools</button>
              {activeTrip && <button className="btn btn-outline" onClick={() => onChat(activeTrip.id)}><MessageCircle />Chat</button>}
            </div>
          </div>
        </section>
      )}
      {(tab === 'upcoming' ? upcoming.slice(1) : tab === 'completed' ? completed : upcoming.filter((ride) => ride.recurring)).map((ride) => {
        const card = toCard(ride);
        const booked = bookingsForRide(ride.id).filter((booking) => booking.status === 'paid' || booking.status === 'accepted');
        return (
          <section className="schedule-row" key={ride.id}>
            <div className="schedule-date"><strong>{whenCopy(ride.when).slice(0, 3).toUpperCase()}</strong><span>{ride.time}</span></div>
            <div className="schedule-route">
              <strong>{card?.from} → {card?.to}</strong>
              <span><Clock3 /> {ride.time} · <Repeat2 /> {ride.recurring ? 'Recurring' : 'One time'}</span>
            </div>
            <div className="mini-stack">
              {booked.slice(0, 3).map((booking) => {
                const rider = memberById(booking.riderId);
                return rider ? <Avatar key={booking.id} initials={rider.initials} color={rider.avatarColor} size={32} photo={rider.photo} /> : null;
              })}
            </div>
            <span className="seat-status">{booked.length}/{ride.seats} seats</span>
            <strong>{formatNaira(booked.reduce((sum, booking) => sum + booking.amount, 0) || ride.price * ride.seats)}</strong>
            <button>•••</button>
          </section>
        );
      })}
    </>
  );
}

export function RequestsView({ notify, onChat }: { notify: (s: string) => void; onChat: (tripId: string) => void }) {
  const { driverRides, bookingsForRide, memberById, toCard, acceptRequest, declineRequest, tripForRide } = usePlatform();
  const [tab, setTab] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const all = driverRides.flatMap((ride) => bookingsForRide(ride.id).map((booking) => ({ booking, ride, card: toCard(ride), rider: memberById(booking.riderId) })));
  const pending = all.filter((row) => row.booking.status === 'requested');
  const accepted = all.filter((row) => row.booking.status === 'accepted' || row.booking.status === 'paid' || row.booking.status === 'completed');
  const declined = all.filter((row) => row.booking.status === 'declined');
  const list = tab === 'accepted' ? accepted : tab === 'declined' ? declined : pending;

  return (
    <>
      <PageHeading eyebrow="PASSENGER REQUESTS" title="Seat requests" subtitle="Review verified people who want to join your routes." />
      <div className="request-filter">
        <button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>Pending <span>{pending.length}</span></button>
        <button className={tab === 'accepted' ? 'active' : ''} onClick={() => setTab('accepted')}>Accepted</button>
        <button className={tab === 'declined' ? 'active' : ''} onClick={() => setTab('declined')}>Declined</button>
      </div>
      <div className="request-list">
        {list.map((row) => {
          const rider = row.rider;
          const card = row.card;
          if (!rider || !card) return null;
          const trip = tripForRide(row.ride.id);
          const acceptedState = row.booking.status !== 'requested' && row.booking.status !== 'declined';
          return (
            <section className={`request-card ${acceptedState ? 'accepted' : ''}`} key={row.booking.id}>
              <div className="request-route-head">
                <span><CalendarDays />{whenCopy(row.ride.when).toUpperCase()} · {row.ride.time}</span>
                <span>{card.from} <ArrowRight /> {card.to}</span>
              </div>
              <div className="request-person">
                <Avatar initials={rider.initials} color={rider.avatarColor} size={62} photo={rider.photo} />
                <div>
                  <h3>{fullName(rider)} <BadgeCheck size={16} fill="currentColor" /></h3>
                  <p><Star size={13} fill="currentColor" />{rider.rating} · {rider.trips} completed trips</p>
                  <div>
                    <span><Users />{card.community}</span>
                    <span><ShieldCheckIcon />Identity verified</span>
                  </div>
                </div>
                <div className="request-match"><strong>{card.match}%</strong><span>route match</span></div>
              </div>
              <div className="request-pickup">
                <div><small>PICKUP</small><strong>{row.booking.pickupNote ?? card.pickup}</strong><span>+4 min to your route</span></div>
                <div><small>ARRIVAL</small><strong>{card.dropoff}</strong><span>On your route</span></div>
                <div><small>SEATS</small><strong>{row.booking.seats} seat</strong><span>{formatNaira(row.booking.total)}</span></div>
              </div>
              <div className="request-actions">
                {row.booking.status === 'requested' ? (
                  <>
                    <button className="btn btn-outline" onClick={() => { declineRequest(row.booking.id); notify('Request declined'); }}>Decline</button>
                    <button className="btn btn-primary" onClick={() => { acceptRequest(row.booking.id); notify(`${rider.firstName} has been added to your ride`); }}><Check />Accept {rider.firstName}</button>
                  </>
                ) : (
                  <span className="accepted-message"><CheckCircle2 />{rider.firstName} is {row.booking.status} on this ride</span>
                )}
                {trip && <button className="text-button" onClick={() => onChat(trip.id)}><MessageCircle />Message</button>}
              </div>
            </section>
          );
        })}
        {!list.length && <div className="empty-note">No requests in this queue.</div>}
      </div>
    </>
  );
}

function ShieldCheckIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></svg>;
}

export function EarningsView({ notify, onWallet }: { notify: (s: string) => void; onWallet: () => void }) {
  const { availableBalance, pendingBalance, me, walletFor, withdraw } = usePlatform();
  const wallet = me ? walletFor(me.id) : { entries: [] as ReturnType<typeof walletFor>['entries'] };
  const bars = [42, 64, 38, 81, 70, 94, 52];
  const entries = wallet.entries.filter((entry) => entry.type === 'settlement' || entry.type === 'withdrawal').slice(0, 6);

  return (
    <>
      <PageHeading
        eyebrow="DRIVER FINANCES"
        title="Earnings"
        subtitle="Transparent cost contributions, settlements and payouts."
        action={<button className="btn btn-primary" onClick={() => {
          const result = withdraw(availableBalance);
          notify(result.message);
        }}><Banknote />Withdraw funds</button>}
      />
      <section className="earnings-hero">
        <div><span>AVAILABLE TO WITHDRAW</span><strong>{formatNaira(availableBalance)}</strong><small><CheckCircle2 />All trips reconciled</small></div>
        <div><span>PENDING</span><strong>{formatNaira(Math.max(0, pendingBalance))}</strong><small>From upcoming trips</small></div>
        <div><span>PAID OUT</span><strong>{formatNaira(Math.abs(wallet.entries.filter((entry) => entry.type === 'withdrawal').reduce((sum, entry) => sum + entry.amount, 0)))}</strong><small>To {me?.bankName ?? 'your bank'} ·••{me?.bankLast4 ?? '0000'}</small></div>
      </section>
      <div className="earnings-grid">
        <section className="earnings-chart">
          <div className="dash-section-head"><div><h2>Earnings activity</h2><p>This week</p></div><select><option>This week</option><option>This month</option></select></div>
          <div className="bar-chart">{bars.map((h, i) => <div key={i}><span style={{ height: `${h}%` }} className={i === 5 ? 'active' : ''}><em>{i === 5 ? '₦6.8k' : ''}</em></span><small>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</small></div>)}</div>
          <div className="chart-summary">
            <span><small>GROSS CONTRIBUTIONS</small><strong>₦27,000</strong></span>
            <i />
            <span><small>PADIGO SERVICE</small><strong>−₦2,400</strong></span>
            <i />
            <span><small>YOUR EARNINGS</small><strong>₦24,600</strong></span>
          </div>
        </section>
        <aside className="payout-card">
          <span>NEXT AUTOMATIC PAYOUT</span>
          <h3>Friday</h3>
          <strong>{formatNaira(availableBalance)}</strong>
          <div>
            <span>GT</span>
            <p><strong>{me?.bankName ?? 'Guaranty Trust Bank'}</strong><small>{me ? fullName(me) : ''} · ••{me?.bankLast4 ?? '0294'}</small></p>
            <BadgeCheck />
          </div>
          <button className="btn btn-outline btn-block" onClick={onWallet}>Manage payout account</button>
        </aside>
      </div>
      <section className="transactions">
        <div className="dash-section-head"><div><h2>Recent transactions</h2><p>All contributions, fees and payouts</p></div><button onClick={() => notify('Statement downloaded')}>Download statement</button></div>
        {entries.map((entry) => (
          <div className="transaction-row" key={entry.id}>
            <span className={entry.type === 'withdrawal' ? 'payout-icon' : ''}>{entry.type === 'withdrawal' ? <Banknote /> : <CarFront />}</span>
            <div>
              <strong>{entry.note}</strong>
              <small>{new Date(entry.createdAt).toLocaleDateString('en-GB')} · {entry.reference}</small>
            </div>
            <span className={entry.type === 'withdrawal' ? 'paid-tag' : 'settled-tag'}>{entry.status}</span>
            <strong className={entry.amount < 0 ? 'debit' : ''}>{entry.amount < 0 ? '−' : '+'}{formatNaira(Math.abs(entry.amount))}</strong>
            <ChevronRight />
          </div>
        ))}
      </section>
    </>
  );
}
