import { useState } from 'react';
import {
  ArrowRight, BadgeCheck, CalendarDays, Camera, CarFront, Check, CheckCircle2, ChevronRight,
  Clock3, Coins, CreditCard, Heart, LocateFixed, LogOut, MapPin, MessageCircle, Phone, Plus,
  ReceiptText, Repeat2, Search, Settings, Shield, ShieldCheck, SlidersHorizontal, Star, TrendingUp,
  User, Users, WalletCards,
} from 'lucide-react';
import { Avatar, VerifiedBadge } from '../components/UI';
import { formatNaira, fullName, greetingFor, longDate, placeById, usePlatform, type RideCard } from '../platform';
import { CompactRide, MapArtwork, PageHeading, ResultRide, SparkIcon, tripStatusLabel, whenCopy } from './shared';

type RiderProps = {
  onSearch: () => void;
  onRide: (ride: RideCard) => void;
  onTrips: () => void;
  onChat: (tripId: string) => void;
  onSos: () => void;
  onWallet: () => void;
  onSwitch: () => void;
  onExit: () => void;
  notify: (message: string) => void;
  onReceipt: (bookingId: string) => void;
  onRate: (tripId: string) => void;
};

export function RiderHome({ onSearch, onRide, onTrips, onChat }: Pick<RiderProps, 'onSearch' | 'onRide' | 'onTrips' | 'onChat'>) {
  const { me, matchedRides, riderBookings, rideById, memberById, tripForRide, toCard, joinCommunity, state } = usePlatform();
  const from = placeById(state.search.fromId);
  const to = placeById(state.search.toId);
  const upcoming = riderBookings.find((booking) => booking.status === 'paid' || booking.status === 'accepted' || booking.status === 'requested');
  const upcomingRide = upcoming ? rideById(upcoming.rideId) : undefined;
  const upcomingCard = upcomingRide ? toCard(upcomingRide) : null;
  const upcomingDriver = upcomingRide ? memberById(upcomingRide.driverId) : undefined;
  const trip = upcomingRide ? tripForRide(upcomingRide.id) : undefined;
  const top = matchedRides.slice(0, 2);

  return (
    <>
      <PageHeading
        eyebrow={`${longDate().toUpperCase()}`}
        title={`${greetingFor()}, ${me?.firstName || 'there'}.`}
        subtitle={`${matchedRides.length} verified people are travelling your way around ${state.search.time}.`}
        action={<button className="btn btn-primary app-heading-btn" onClick={onSearch}><Search size={17} /> Find a ride</button>}
      />
      <div className="dashboard-grid">
        <div className="dash-main">
          <section className="usual-commute-card">
            <div className="usual-card-top"><span><Repeat2 size={15} /> YOUR USUAL COMMUTE</span><button onClick={onSearch}>Manage <ChevronRight size={15} /></button></div>
            <div className="usual-route">
              <div className="usual-points">
                <span><i />Home<small>{from.area}, Lagos</small></span>
                <em />
                <span><i />Work<small>{to.area}</small></span>
              </div>
              <div className="usual-time">
                <span><CalendarDays />Monday to Friday</span>
                <span><Clock3 />{usePlatform().state.search.time}</span>
                <span><User />{usePlatform().state.search.seats} seat</span>
              </div>
            </div>
            <div className="usual-bottom">
              <div className="mini-stack">
                {top.map((ride) => <Avatar key={ride.id} initials={ride.initials} color={ride.avatarColor} size={33} photo={ride.photo} />)}
              </div>
              <span><strong>{matchedRides.length} verified people</strong> are travelling this route</span>
              <button onClick={onSearch}>Find my carpool <ArrowRight size={16} /></button>
            </div>
          </section>
          <section className="dash-section">
            <div className="dash-section-head">
              <div><h2>Best matches for you</h2><p>Ranked by route overlap, pickup, timing and trust</p></div>
              <button onClick={onSearch}>See all {matchedRides.length} <ArrowRight size={15} /></button>
            </div>
            <div className="compact-rides">
              {top.length ? top.map((ride) => <CompactRide ride={ride} key={ride.id} onClick={() => onRide(ride)} />) : (
                <div className="empty-note">No matches yet. Search a Lagos corridor to see ranked rides.</div>
              )}
            </div>
          </section>
        </div>
        <aside className="dash-aside">
          {upcomingCard && upcomingDriver && upcoming && upcomingRide ? (
            <section className="next-trip-card">
              <div className="next-trip-top"><span><i />{tripStatusLabel(trip?.status ?? 'scheduled')} · {whenCopy(upcomingRide.when).toUpperCase()}</span><button onClick={onTrips}>•••</button></div>
              <div className="tiny-map">
                <span className="tm-road one" /><span className="tm-road two" />
                <svg viewBox="0 0 280 100"><path d="M15 76 C65 50 95 80 133 43 S215 10 266 34" /><circle cx="15" cy="76" r="5" /><circle cx="266" cy="34" r="5" /></svg>
                <span className="map-label ml-one">{upcomingCard.from}</span>
                <span className="map-label ml-two">{upcomingCard.to}</span>
              </div>
              <div className="next-driver">
                <Avatar initials={upcomingDriver.initials} color={upcomingDriver.avatarColor} size={46} photo={upcomingDriver.photo} />
                <div>
                  <strong>{fullName(upcomingDriver)} <BadgeCheck size={14} fill="currentColor" /></strong>
                  <small><Star size={12} fill="currentColor" /> {upcomingDriver.rating} · {upcomingCard.car.split(' · ')[0]}</small>
                </div>
                {trip && <button onClick={() => onChat(trip.id)}><MessageCircle size={18} /></button>}
              </div>
              <div className="next-route">
                <div><i /><span><small>PICKUP · {upcomingRide.time}</small><strong>{upcomingCard.pickup}</strong></span></div>
                <em />
                <div><i /><span><small>ARRIVAL</small><strong>{upcomingCard.dropoff}</strong></span></div>
              </div>
              <button className="btn btn-dark btn-block" onClick={onTrips}>View trip details <ArrowRight size={16} /></button>
            </section>
          ) : (
            <section className="next-trip-card empty-trip">
              <div className="next-trip-top"><span>NO CONFIRMED RIDE YET</span></div>
              <p>Search your corridor and request a seat. Drivers on Comuta accept in seconds during this demo.</p>
              <button className="btn btn-dark btn-block" onClick={onSearch}>Find a ride</button>
            </section>
          )}
          <section className="saving-card">
            <div className="saving-icon"><Coins /></div>
            <div>
              <span>THIS MONTH</span>
              <strong>{formatNaira(28400)}</strong>
              <small>saved versus solo ride-hailing</small>
            </div>
            <TrendingUp size={21} />
          </section>
          <section className="community-nudge">
            <div><Users size={19} /><strong>Your workplace is on Comuta</strong></div>
            <p>Join 428 verified Sterling commuters.</p>
            <button onClick={() => joinCommunity('com_sterling')}>View community <ArrowRight size={14} /></button>
          </section>
        </aside>
      </div>
    </>
  );
}

export function ExploreRides({ onRide, onSearch }: { onRide: (ride: RideCard) => void; onSearch: () => void }) {
  const { matchedRides, state, setSearch } = usePlatform();
  const from = placeById(state.search.fromId);
  const to = placeById(state.search.toId);
  return (
    <>
      <PageHeading
        eyebrow={`${matchedRides.length} RIDES FOUND`}
        title={`${from.name} to ${to.name}`}
        subtitle={`Around ${state.search.time} · ${state.search.seats} passenger · ranked by the matching engine`}
        action={<button className="btn btn-outline" onClick={onSearch}><Search size={17} /> Change search</button>}
      />
      <div className="results-layout">
        <section className="results-list">
          <div className="filter-bar">
            <button className={state.search.verifiedOnly || state.search.recurringOnly || state.search.communityOnly ? 'active' : ''}><SlidersHorizontal size={15} /> All filters</button>
            <button className={state.search.verifiedOnly ? 'active' : ''} onClick={() => setSearch({ verifiedOnly: !state.search.verifiedOnly })}>Verified only</button>
            <button className={state.search.recurringOnly ? 'active' : ''} onClick={() => setSearch({ recurringOnly: !state.search.recurringOnly })}>Recurring</button>
            <button className={state.search.communityOnly ? 'active' : ''} onClick={() => setSearch({ communityOnly: !state.search.communityOnly })}>Community</button>
            <label>Sort: <select value={state.search.sort} onChange={(e) => setSearch({ sort: e.target.value as typeof state.search.sort })}>
              <option value="match">Best match</option>
              <option value="price">Lowest price</option>
              <option value="time">Earliest</option>
            </select></label>
          </div>
          <div className="results-note">
            <SparkIcon />
            <span><strong>Matching live.</strong> Scores combine route overlap (40%), pickup (20%), destination (15%), time (10%), rating (5%) and price (10%).</span>
          </div>
          {matchedRides.map((ride) => <ResultRide key={ride.id} ride={ride} onClick={() => onRide(ride)} />)}
          {!matchedRides.length && <div className="empty-note">No rides match those filters. Try a wider time window or another corridor.</div>}
        </section>
        <aside className="results-map">
          <div className="fake-map full">
            <MapArtwork />
            {matchedRides.slice(0, 4).map((ride, index) => (
              <div key={ride.id} className={`map-price mp${index + 1}`}>{formatNaira(ride.price)}</div>
            ))}
            <div className="map-route-label">{from.area.toUpperCase()} → {to.area.toUpperCase()}</div>
            <button className="map-locate"><LocateFixed size={18} /></button>
          </div>
        </aside>
      </div>
    </>
  );
}

export function TripsView({ onSos, notify, onChat, onReceipt, onRate }: Pick<RiderProps, 'onSos' | 'notify' | 'onChat' | 'onReceipt' | 'onRate'>) {
  const { riderBookings, rideById, memberById, toCard, tripForRide, cancelBooking } = usePlatform();
  const [tab, setTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const rows = riderBookings.map((booking) => {
    const ride = rideById(booking.rideId);
    const card = ride ? toCard(ride) : null;
    const driver = ride ? memberById(ride.driverId) : undefined;
    const trip = ride ? tripForRide(ride.id) : undefined;
    return { booking, ride, card, driver, trip };
  }).filter((row) => row.ride && row.card);
  const upcoming = rows.filter((row) => ['requested', 'accepted', 'paid'].includes(row.booking.status));
  const past = rows.filter((row) => row.booking.status === 'completed');
  const cancelled = rows.filter((row) => row.booking.status === 'cancelled' || row.booking.status === 'declined');
  const live = upcoming.find((row) => row.trip && ['driver_en_route', 'driver_arrived', 'in_progress'].includes(row.trip.status));
  const list = tab === 'past' ? past : tab === 'cancelled' ? cancelled : upcoming.filter((row) => row !== live);

  return (
    <>
      <PageHeading eyebrow="YOUR JOURNEYS" title="Your trips" subtitle="Track, message, share and rate every shared commute." />
      <div className="trip-tabs">
        <button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>Upcoming <span>{upcoming.length}</span></button>
        <button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>Past</button>
        <button className={tab === 'cancelled' ? 'active' : ''} onClick={() => setTab('cancelled')}>Cancelled</button>
      </div>
      {tab === 'upcoming' && live?.card && live.driver && live.ride && live.trip && (
        <section className="active-trip-panel">
          <div className="active-map">
            <MapArtwork />
            <div className="driver-marker" style={{ left: `${18 + live.trip.progress * 0.55}%`, top: `${68 - live.trip.progress * 0.5}%` }}><CarFront size={18} /></div>
            <div className="pickup-marker">You</div>
            <div className="active-eta">
              <span>{tripStatusLabel(live.trip.status)}</span>
              <strong>{live.trip.status === 'in_progress' ? `${Math.max(1, 100 - live.trip.progress)}%` : `${live.trip.etaMinutes} min`}</strong>
              <small>PIN {live.booking.pin}</small>
            </div>
            <button className="recenter"><LocateFixed /></button>
          </div>
          <div className="trip-detail-side">
            <div className="trip-status"><span><i />{tripStatusLabel(live.trip.status)}</span><small>Trip #{live.ride.id}</small></div>
            <div className="trip-driver-large">
              <Avatar initials={live.driver.initials} color={live.driver.avatarColor} size={56} photo={live.driver.photo} />
              <div>
                <h3>{fullName(live.driver)} <BadgeCheck size={16} fill="currentColor" /></h3>
                <p><Star size={13} fill="currentColor" />{live.driver.rating} · {live.card.car}</p>
                <strong>{live.card.plate}</strong>
              </div>
            </div>
            <div className="trip-actions">
              <button onClick={() => onChat(live.trip!.id)}><MessageCircle /><span>Message</span></button>
              <button onClick={() => notify('Masked call started')}><Phone /><span>Call</span></button>
              <button onClick={() => notify('Secure trip link copied')}><Heart /><span>Share trip</span></button>
              <button className="danger" onClick={onSos}><Shield /><span>Safety</span></button>
            </div>
            <div className="trip-route-detail">
              <div><span className="trip-time">{live.ride.time.replace(' AM', '').replace(' PM', '')}</span><i /><span><small>PICKUP</small><strong>{live.card.pickup}</strong><em>{live.card.from}</em></span></div>
              <b />
              <div><span className="trip-time">ETA</span><i /><span><small>ARRIVAL</small><strong>{live.card.dropoff}</strong><em>{live.card.to}</em></span></div>
            </div>
            <div className="pin-chip"><span>SHOW THIS PIN TO START</span><strong>{live.booking.pin}</strong></div>
            <div className="trip-paid">
              <ReceiptText size={18} />
              <span><small>{live.booking.status.toUpperCase()}</small><strong>{formatNaira(live.booking.total)}</strong></span>
              <button onClick={() => onReceipt(live.booking.id)}>View receipt</button>
            </div>
          </div>
        </section>
      )}
      {list.map((row) => (
        <section className="later-trip" key={row.booking.id}>
          <div>
            <CalendarDays />
            <span>
              <small>{row.ride ? whenCopy(row.ride.when).toUpperCase() : ''} · {row.ride?.time}</small>
              <strong>{row.card?.from} → {row.card?.to}</strong>
            </span>
          </div>
          <div className="later-driver">
            <Avatar initials={row.driver?.initials ?? 'PG'} color={row.driver?.avatarColor} size={37} photo={row.driver?.photo} />
            <span><strong>{row.driver ? fullName(row.driver) : 'Driver'}</strong><small>{row.card?.car} · {row.card?.plate}</small></span>
          </div>
          <span className="confirmed-tag"><Check />{row.booking.status}</span>
          <strong>{formatNaira(row.booking.total)}</strong>
          {tab === 'upcoming' && <button className="text-button" onClick={() => { cancelBooking(row.booking.id); notify('Booking cancelled'); }}>Cancel</button>}
          {tab === 'past' && row.trip && !row.booking.ratedByRider && <button className="text-button" onClick={() => onRate(row.trip!.id)}>Rate</button>}
        </section>
      ))}
      {!list.length && tab !== 'upcoming' && <div className="empty-note">Nothing in this list yet.</div>}
      {tab === 'upcoming' && !live && !list.length && <div className="empty-note">No upcoming trips. Find a ride to get started.</div>}
    </>
  );
}

export function CommunitiesView({ notify }: { notify: (s: string) => void }) {
  const { state, me, joinCommunity } = usePlatform();
  const mine = state.communities.filter((community) => me?.communityIds.includes(community.id));
  const primary = mine[0] ?? state.communities[0];
  const discover = state.communities.filter((community) => community.id !== primary.id);
  return (
    <>
      <PageHeading
        eyebrow="TRUSTED NETWORKS"
        title="Your communities"
        subtitle="Find familiar context along every route."
        action={<button className="btn btn-primary" onClick={() => notify('Ask your workplace admin for an invite code.')}><Plus size={17} /> Join a community</button>}
      />
      <section className="my-community-hero">
        <div>
          <div className="community-large-logo">{primary.initials}</div>
          <span className="community-verified"><BadgeCheck size={15} fill="currentColor" /> Verified {primary.type.toLowerCase()}</span>
        </div>
        <div>
          <span>YOUR PRIMARY COMMUNITY</span>
          <h2>{primary.name}</h2>
          <p>Ride with verified people who already share your context.</p>
          <div>
            <small>{primary.members} members</small>
            <small>{primary.routes} active routes</small>
            <small>64 rides this week</small>
          </div>
        </div>
        <button onClick={() => { joinCommunity(primary.id); notify(`${primary.name} is now your community`); }}>Open community <ArrowRight size={16} /></button>
      </section>
      <div className="community-stats">
        <div><Users /><span><small>PEOPLE ON YOUR ROUTE</small><strong>38</strong></span></div>
        <div><CarFront /><span><small>SEATS TOMORROW</small><strong>14</strong></span></div>
        <div><Coins /><span><small>AVG. SEAT COST</small><strong>₦1,420</strong></span></div>
        <div><ShieldCheck /><span><small>VERIFIED MEMBERS</small><strong>100%</strong></span></div>
      </div>
      <section className="discover-communities">
        <div className="dash-section-head"><div><h2>Discover communities</h2><p>Groups near your home, work and route</p></div></div>
        <div className="community-discover-grid">
          {discover.map((community) => (
            <article key={community.id} style={{ '--community-color': community.color } as React.CSSProperties}>
              <div className="community-art"><span>{community.initials}</span><Users /></div>
              <span>{community.type.toUpperCase()}</span>
              <h3>{community.name}</h3>
              <p>{community.members} members · {community.routes} active routes</p>
              <button onClick={() => { joinCommunity(community.id); notify(`Request sent to ${community.name}`); }}>
                {me?.communityIds.includes(community.id) ? 'Joined' : 'Request to join'} <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function ProfileView({ role, onSwitch, onExit, onWallet }: { role: 'rider' | 'driver'; onSwitch: () => void; onExit: () => void; onWallet: () => void }) {
  const { me, verifyIdentity, resetDemo } = usePlatform();
  if (!me) return null;
  const strength = Math.min(100, 55 + (me.verified ? 20 : 0) + (me.emergencyContacts.length ? 15 : 0) + (me.email ? 10 : 0));
  return (
    <>
      <PageHeading eyebrow="ACCOUNT" title="Profile & trust" subtitle="Manage your identity, preferences and safety settings." />
      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-photo">
            <Avatar initials={me.initials} color={me.avatarColor} size={94} photo={me.photo} />
            <button><Camera size={15} /></button>
          </div>
          <h2>{fullName(me) || 'New member'}</h2>
          <p><Star size={14} fill="currentColor" /> {me.rating} · {me.trips} shared trips</p>
          <VerifiedBadge text={me.verified ? 'Identity verified' : 'Verification pending'} />
          <div className="profile-completion">
            <span><strong>Profile strength</strong><em>{strength}%</em></span>
            <i><b style={{ width: `${strength}%` }} /></i>
            <small>{me.emergencyContacts.length ? 'Add a second emergency contact to reach 100%' : 'Add an emergency contact to strengthen your profile'}</small>
          </div>
        </section>
        <section className="profile-settings">
          <h3>Trust & verification</h3>
          <div className="verification-grid">
            <Verification label="Phone number" status="Verified" />
            <Verification label={me.idType ?? "National identity"} status={me.verified ? 'Verified' : 'Action needed'} />
            <Verification label="Selfie & liveness" status={me.verified ? 'Verified' : 'Pending'} />
            <Verification label="Community" status={`${me.communityIds.length} joined`} />
            {role === 'driver' && (
              <>
                <Verification label="Driver licence" status={me.licenceNumber ? 'Verified' : 'Pending'} />
                <Verification label="Vehicle" status={me.licenceNumber ? 'Verified' : 'Pending'} />
              </>
            )}
          </div>
          {!me.verified && <button className="btn btn-primary" onClick={verifyIdentity} style={{ marginTop: 12 }}>Complete identity check</button>}
          <h3>Account settings</h3>
          <div className="settings-list">
            <Setting icon={<User />} title="Personal information" sub={`${fullName(me)}${me.location ? ` · ${me.location}` : ""} · ${me.phone}`} />
            <Setting icon={<Shield />} title="Safety & emergency contacts" sub={me.emergencyContacts[0] ? `${me.emergencyContacts[0].name} · ${me.emergencyContacts[0].relation}` : 'Add a contact'} />
            <button onClick={onWallet}><span><WalletCards /></span><p><strong>Wallet and payouts</strong><small>{role === 'driver' ? `${me.bankName ?? 'Bank'} ·•• ${me.bankLast4 ?? '0000'}` : `Visa ·•• ${me.cardLast4 ?? '2048'}`}</small></p><ChevronRight size={17} /></button>
            <Setting icon={<CreditCard />} title="Payment methods" sub={`Visa ·•• ${me.cardLast4 ?? '2048'}`} />
            <Setting icon={<Settings />} title="Privacy & data" sub="Location, blocked users and data controls" />
          </div>
          <div className="profile-actions">
            <button className="btn btn-outline" onClick={onSwitch}>{role === 'rider' ? <CarFront /> : <User />} Switch to {role === 'rider' ? 'driver' : 'rider'} mode</button>
            <button className="text-danger" onClick={onExit}><LogOut size={17} /> Sign out</button>
          </div>
        </section>
      </div>
    </>
  );
}

function Verification({ label, status }: { label: string; status: string }) {
  return <div><span><CheckCircle2 size={17} /></span><p><strong>{label}</strong><small>{status}</small></p><ChevronRight size={16} /></div>;
}
function Setting({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return <button><span>{icon}</span><p><strong>{title}</strong><small>{sub}</small></p><ChevronRight size={17} /></button>;
}
