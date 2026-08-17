import { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Banknote, Bell, CalendarDays, Camera,
  CarFront, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Coins, CreditCard, FileCheck2, Headphones, Heart, History, Home, LocateFixed,
  LogOut, Map, MapPin, Menu, MessageCircle, Navigation, Phone, Plus, ReceiptText, Repeat2,
  Route, Search, Settings, Shield, ShieldCheck, SlidersHorizontal, Star, TrendingUp, User,
  Users, WalletCards, X, Zap,
} from 'lucide-react';
import Brand from './components/Brand';
import { Avatar, Modal, Stepper, Toast, VerifiedBadge } from './components/UI';
import { communities, formatNaira, rides, type Ride } from './data';

type Props = { onExit: () => void; onOps: () => void };
type RiderTab = 'home' | 'explore' | 'trips' | 'communities' | 'profile';
type DriverTab = 'home' | 'rides' | 'requests' | 'earnings' | 'profile';

const riderNavigation = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'trips', label: 'Trips', icon: Route },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
] as const;
const driverNavigation = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'rides', label: 'My rides', icon: CarFront },
  { id: 'requests', label: 'Requests', icon: Users },
  { id: 'earnings', label: 'Earnings', icon: WalletCards },
  { id: 'profile', label: 'Profile', icon: User },
] as const;

export default function ProductApp({ onExit, onOps }: Props) {
  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [riderTab, setRiderTab] = useState<RiderTab>('home');
  const [driverTab, setDriverTab] = useState<DriverTab>('home');
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [sosOpen, setSosOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [requestStatus, setRequestStatus] = useState<'pending' | 'accepted'>('pending');

  const currentTab = role === 'rider' ? riderTab : driverTab;
  const nav = role === 'rider' ? riderNavigation : driverNavigation;
  const setTab = (id: string) => {
    if (role === 'rider') setRiderTab(id as RiderTab); else setDriverTab(id as DriverTab);
    setMenu(false);
  };
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };
  const switchRole = (next: 'rider' | 'driver') => {
    setRole(next);
    setMenu(false);
  };
  const openBooking = (ride: Ride) => { setSelectedRide(ride); setBookingStep(1); };
  const closeRide = () => { setSelectedRide(null); setBookingStep(0); };

  return (
    <div className="product-app">
      <aside className={`app-sidebar ${menu ? 'mobile-open' : ''}`}>
        <div className="app-side-head"><button onClick={onExit}><Brand /></button><button className="close-side" onClick={() => setMenu(false)}><X /></button></div>
        <div className="role-switcher">
          <button className={role === 'rider' ? 'active' : ''} onClick={() => switchRole('rider')}><User size={15}/> Rider</button>
          <button className={role === 'driver' ? 'active' : ''} onClick={() => switchRole('driver')}><CarFront size={15}/> Driver</button>
        </div>
        <nav className="app-nav">
          <span className="nav-label">YOUR PADIGO</span>
          {nav.map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={19}/><span>{label}</span>{id === 'requests' && <i className="nav-count">2</i>}</button>)}
          <span className="nav-label lower">SUPPORT</span>
          <button onClick={() => notify('Help centre opened')}><CircleHelp size={19}/><span>Help centre</span></button>
          <button onClick={onOps}><ShieldCheck size={19}/><span>Operations demo</span></button>
        </nav>
        <div className="sidebar-safety"><span><ShieldCheck size={19}/></span><div><strong>Safety centre</strong><small>Trip support is available</small></div><ChevronRight size={17}/></div>
        <div className="side-profile"><Avatar initials="OO" color="#d87753" size={40}/><div><strong>Olabisi O.</strong><small><BadgeCheck size={12} fill="currentColor"/> Identity verified</small></div><ChevronDown size={16}/></div>
      </aside>
      {menu && <div className="side-scrim" onClick={() => setMenu(false)} />}

      <section className="app-workspace">
        <header className="app-topbar">
          <div className="app-mobile-brand"><button onClick={() => setMenu(true)}><Menu /></button><Brand /></div>
          <div className="topbar-left"><span className="network-dot"/><span>Good morning, Olabisi</span><small>·</small><span>Monday, 17 August</span></div>
          <div className="topbar-actions">
            {role === 'rider' ? <button className="quick-action" onClick={() => setSearchOpen(true)}><Search size={17}/> Find a ride</button> : <button className="quick-action" onClick={() => setOfferOpen(true)}><Plus size={17}/> Offer a ride</button>}
            <button className="icon-button notification"><Bell size={19}/><i/></button>
            <button className="mobile-avatar"><Avatar initials="OO" color="#d87753" size={36}/></button>
          </div>
        </header>

        <div className="app-page">
          {role === 'rider' ? (
            <>
              {riderTab === 'home' && <RiderHome onSearch={() => setSearchOpen(true)} onRide={openBooking} onTrips={() => setRiderTab('trips')} />}
              {riderTab === 'explore' && <ExploreRides onRide={openBooking} onSearch={() => setSearchOpen(true)} />}
              {riderTab === 'trips' && <TripsView onSos={() => setSosOpen(true)} notify={notify} />}
              {riderTab === 'communities' && <CommunitiesView notify={notify} />}
              {riderTab === 'profile' && <ProfileView role={role} onSwitch={() => switchRole('driver')} onExit={onExit} />}
            </>
          ) : (
            <>
              {driverTab === 'home' && <DriverHome onOffer={() => setOfferOpen(true)} onRequests={() => setDriverTab('requests')} onTrip={() => setDriverTab('rides')} />}
              {driverTab === 'rides' && <DriverRides onOffer={() => setOfferOpen(true)} onSos={() => setSosOpen(true)} notify={notify} />}
              {driverTab === 'requests' && <RequestsView status={requestStatus} onAccept={() => {setRequestStatus('accepted'); notify('Tobi has been added to your ride');}} notify={notify} />}
              {driverTab === 'earnings' && <EarningsView notify={notify} />}
              {driverTab === 'profile' && <ProfileView role={role} onSwitch={() => switchRole('rider')} onExit={onExit} />}
            </>
          )}
        </div>
        <MobileNav nav={nav} current={currentTab} setTab={setTab} />
      </section>

      <FindRideModal open={searchOpen} onClose={() => setSearchOpen(false)} onResults={() => {setSearchOpen(false); setRiderTab('explore'); notify('12 matching rides found');}} />
      <OfferRideModal open={offerOpen} onClose={() => setOfferOpen(false)} onDone={() => {setOfferOpen(false); notify('Your recurring ride is now live'); setDriverTab('rides');}} />
      <RideBookingModal ride={selectedRide} step={bookingStep} setStep={setBookingStep} onClose={closeRide} onDone={() => {closeRide(); notify('Seat confirmed with Ade for tomorrow'); setRiderTab('trips');}} />
      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
      <Toast visible={!!toast} message={toast}/>
    </div>
  );
}

function MobileNav({ nav, current, setTab }: { nav: readonly { id: string; label: string; icon: typeof Home }[]; current: string; setTab: (id: string) => void }) {
  return <nav className="mobile-bottom-nav">{nav.map(({id,label,icon:Icon}) => <button key={id} className={current===id?'active':''} onClick={() => setTab(id)}><Icon size={20}/><span>{label}</span>{id==='requests'&&<i/>}</button>)}</nav>;
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="app-page-heading"><div>{eyebrow && <span className="app-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

function RiderHome({ onSearch, onRide, onTrips }: { onSearch: () => void; onRide: (r: Ride) => void; onTrips: () => void }) {
  return <>
    <PageHeading eyebrow="MONDAY · 17 AUGUST" title="Your commute, sorted." subtitle="Twelve people are travelling your way tomorrow morning." action={<button className="btn btn-primary app-heading-btn" onClick={onSearch}><Search size={17}/> Find a ride</button>}/>
    <div className="dashboard-grid">
      <div className="dash-main">
        <section className="usual-commute-card">
          <div className="usual-card-top"><span><Repeat2 size={15}/> YOUR USUAL COMMUTE</span><button>Manage <ChevronRight size={15}/></button></div>
          <div className="usual-route">
            <div className="usual-points"><span><i/>Home<small>Ajah, Lagos</small></span><em/><span><i/>Work<small>Victoria Island</small></span></div>
            <div className="usual-time"><span><CalendarDays/>Monday to Friday</span><span><Clock3/>7:00 AM</span><span><User/>1 seat</span></div>
          </div>
          <div className="usual-bottom"><div className="mini-stack"><Avatar initials="AB" color="#cf7652" size={33}/><Avatar initials="IN" color="#6d58a4" size={33}/><Avatar initials="ML" color="#3c7b6e" size={33}/></div><span><strong>12 verified people</strong> are travelling this route</span><button onClick={onSearch}>Find my carpool <ArrowRight size={16}/></button></div>
        </section>
        <section className="dash-section">
          <div className="dash-section-head"><div><h2>Best matches for you</h2><p>Tomorrow · leaving around 7:00 AM</p></div><button onClick={onSearch}>See all 12 <ArrowRight size={15}/></button></div>
          <div className="compact-rides">{rides.slice(0,2).map(r => <CompactRide ride={r} key={r.id} onClick={() => onRide(r)}/>)}</div>
        </section>
      </div>
      <aside className="dash-aside">
        <section className="next-trip-card">
          <div className="next-trip-top"><span><i/>UPCOMING · TOMORROW</span><button>•••</button></div>
          <div className="tiny-map"><span className="tm-road one"/><span className="tm-road two"/><svg viewBox="0 0 280 100"><path d="M15 76 C65 50 95 80 133 43 S215 10 266 34"/><circle cx="15" cy="76" r="5"/><circle cx="266" cy="34" r="5"/></svg><span className="map-label ml-one">Ajah</span><span className="map-label ml-two">VI</span></div>
          <div className="next-driver"><Avatar initials="AB" color="#cf7652" size={46}/><div><strong>Ade Bamidele <BadgeCheck size={14} fill="currentColor"/></strong><small><Star size={12} fill="currentColor"/> 4.9 · Toyota Corolla</small></div><button><MessageCircle size={18}/></button></div>
          <div className="next-route"><div><i/><span><small>PICKUP · 6:55 AM</small><strong>Novare Mall, Sangotedo</strong></span></div><em/><div><i/><span><small>ARRIVAL · 7:42 AM</small><strong>Ozumba Mbadiwe, VI</strong></span></div></div>
          <button className="btn btn-dark btn-block" onClick={onTrips}>View trip details <ArrowRight size={16}/></button>
        </section>
        <section className="saving-card"><div className="saving-icon"><Coins/></div><div><span>AUGUST SAVINGS</span><strong>₦28,400</strong><small>compared with solo rides</small></div><TrendingUp size={21}/></section>
        <section className="community-nudge"><div><Users size={19}/><strong>Your workplace is on PadiGo</strong></div><p>Join 428 verified Sterling commuters.</p><button>View community <ArrowRight size={14}/></button></section>
      </aside>
    </div>
  </>;
}

function CompactRide({ ride, onClick }: { ride: Ride; onClick: () => void }) {
  return <button className="compact-ride" onClick={onClick}>
    <div className="compact-match"><strong>{ride.match}%</strong><span>match</span></div>
    <Avatar initials={ride.initials} color={ride.avatarColor} size={48}/>
    <div className="compact-driver"><strong>{ride.driver} <BadgeCheck size={14} fill="currentColor"/></strong><span><Star size={12} fill="currentColor"/> {ride.rating} · {ride.car}</span><small><Users size={12}/>{ride.community}</small></div>
    <div className="compact-route"><strong>{ride.time}</strong><span>{ride.from} <ArrowRight size={12}/> {ride.to}</span><small><Repeat2 size={12}/> {ride.recurring ? 'Every weekday' : 'Single ride'}</small></div>
    <div className="compact-price"><strong>{formatNaira(ride.price)}</strong><span>per seat</span><small>{ride.seats} left</small></div>
    <ChevronRight size={20}/>
  </button>;
}

function ExploreRides({ onRide, onSearch }: { onRide: (r: Ride) => void; onSearch: () => void }) {
  const [sort, setSort] = useState('Best match');
  const allRides = useMemo(() => [...rides, {...rides[0], id:'PG4388', driver:'Damilola James', initials:'DJ', match:83, price:1100, time:'7:25 AM', community:'Chevron Estate', avatarColor:'#bd8352'}], []);
  return <>
    <PageHeading eyebrow="12 RIDES FOUND" title="Ajah to Victoria Island" subtitle="Tomorrow, 18 August · Around 7:00 AM · 1 passenger" action={<button className="btn btn-outline" onClick={onSearch}><Search size={17}/> Change search</button>}/>
    <div className="results-layout">
      <section className="results-list">
        <div className="filter-bar"><button className="active"><SlidersHorizontal size={15}/> All filters</button><button>Verified only</button><button>Recurring</button><button>Community</button><label>Sort: <select value={sort} onChange={e=>setSort(e.target.value)}><option>Best match</option><option>Lowest price</option><option>Earliest</option></select></label></div>
        <div className="results-note"><SparkIcon/><span><strong>Great route!</strong> Most drivers need less than a 6 minute detour to pick you up.</span></div>
        {allRides.map(ride => <ResultRide key={ride.id} ride={ride} onClick={() => onRide(ride)}/>) }
      </section>
      <aside className="results-map"><div className="fake-map full"><MapArtwork/><div className="map-price mp1">₦1,500</div><div className="map-price mp2">₦1,350</div><div className="map-price mp3">₦1,250</div><div className="map-price mp4">₦1,100</div><div className="map-route-label">LEKKI EPE EXPRESSWAY</div><button className="map-locate"><LocateFixed size={18}/></button></div></aside>
    </div>
  </>;
}

function SparkIcon(){ return <span className="spark-icon"><Zap size={15}/></span> }

function ResultRide({ ride, onClick }: { ride: Ride; onClick: () => void }) {
  return <article className="result-ride" onClick={onClick}>
    <div className="result-left"><div className="result-time"><strong>{ride.time}</strong><span>{ride.eta}</span></div><div className="result-line"><i/><em/><i/></div><div className="result-locations"><div><strong>{ride.pickup}</strong><span>Pickup · 6 min walk from you</span></div><div><strong>{ride.to}</strong><span>Arrival · 4 min walk to work</span></div></div></div>
    <div className="result-person"><Avatar initials={ride.initials} color={ride.avatarColor} size={48}/><div><strong>{ride.driver}<BadgeCheck size={14} fill="currentColor"/></strong><span><Star size={12} fill="currentColor"/> {ride.rating} · {ride.trips} trips</span><small>{ride.car}</small></div></div>
    <div className="result-chips"><span><Users size={13}/>{ride.community}</span>{ride.recurring&&<span><Repeat2 size={13}/>Weekday regular</span>}<span><ShieldCheck size={13}/>Fully verified</span></div>
    <div className="result-value"><span className="big-match">{ride.match}%<small>match</small></span><strong>{formatNaira(ride.price)}<small>/ seat</small></strong><span>{ride.seats} seats left</span><button>View ride <ChevronRight size={15}/></button></div>
  </article>;
}

function TripsView({ onSos, notify }: { onSos: () => void; notify: (s:string) => void }) {
  return <>
    <PageHeading eyebrow="ACTIVE NOW" title="Your trips" subtitle="Track, manage and revisit every shared journey." />
    <div className="trip-tabs"><button className="active">Upcoming <span>2</span></button><button>Past</button><button>Cancelled</button></div>
    <section className="active-trip-panel">
      <div className="active-map"><MapArtwork/><div className="driver-marker"><CarFront size={18}/></div><div className="pickup-marker">OO</div><div className="active-eta"><span>DRIVER ARRIVING IN</span><strong>6 min</strong><small>6:49 AM</small></div><button className="recenter"><LocateFixed/></button></div>
      <div className="trip-detail-side">
        <div className="trip-status"><span><i/>DRIVER EN ROUTE</span><small>Trip #PG2841</small></div>
        <div className="trip-driver-large"><Avatar initials="AB" color="#cf7652" size={56}/><div><h3>Ade Bamidele <BadgeCheck size={16} fill="currentColor"/></h3><p><Star size={13} fill="currentColor"/>4.9 · Toyota Corolla · Silver</p><strong>APP 412 GH</strong></div></div>
        <div className="trip-actions"><button onClick={() => notify('Trip chat opened')}><MessageCircle/><span>Message</span></button><button onClick={() => notify('Masked call started')}><Phone/><span>Call</span></button><button onClick={() => notify('Secure trip link copied')}><Heart/><span>Share trip</span></button><button className="danger" onClick={onSos}><Shield/><span>Safety</span></button></div>
        <div className="trip-route-detail"><div><span className="trip-time">6:55</span><i/><span><small>PICKUP</small><strong>Novare Mall main entrance</strong><em>Sangotedo, Lagos</em></span></div><b/><div><span className="trip-time">7:42</span><i/><span><small>ARRIVAL</small><strong>Sterling Towers</strong><em>Marina, Victoria Island</em></span></div></div>
        <div className="trip-co-riders"><span>RIDING WITH YOU</span><div><div className="mini-stack"><Avatar initials="TN" color="#7059a3" size={34}/><Avatar initials="DJ" color="#377c6d" size={34}/></div><p><strong>Tobi and Dami</strong><small>Both identity verified</small></p><VerifiedBadge text="Verified"/></div></div>
        <div className="trip-paid"><ReceiptText size={18}/><span><small>PAID</small><strong>₦1,500</strong></span><button>View receipt</button></div>
      </div>
    </section>
    <section className="later-trip"><div><CalendarDays/><span><small>FRIDAY, 21 AUGUST · 5:30 PM</small><strong>Victoria Island → Ajah</strong></span></div><div className="later-driver"><Avatar initials="IN" color="#7059a3" size={37}/><span><strong>Ifeoma Nwosu</strong><small>Honda Accord · KJA 208 FT</small></span></div><span className="confirmed-tag"><Check/>Confirmed</span><strong>₦1,350</strong><ChevronRight/></section>
  </>;
}

function MapArtwork(){return <><span className="fm-road r1"/><span className="fm-road r2"/><span className="fm-road r3"/><span className="fm-water"/><span className="fm-block b1"/><span className="fm-block b2"/><span className="fm-block b3"/><svg className="fm-route" viewBox="0 0 600 500"><path d="M44 430 C130 394 105 292 201 275 S300 320 360 208 S480 150 550 72"/></svg></>}

function CommunitiesView({ notify }: { notify: (s:string) => void }) {
  return <>
    <PageHeading eyebrow="TRUSTED NETWORKS" title="Your communities" subtitle="Find familiar context along every route." action={<button className="btn btn-primary" onClick={() => notify('Community code entry opened')}><Plus size={17}/> Join a community</button>}/>
    <section className="my-community-hero"><div><div className="community-large-logo">ST</div><span className="community-verified"><BadgeCheck size={15} fill="currentColor"/> Verified workplace</span></div><div><span>YOUR PRIMARY COMMUNITY</span><h2>PadiGo at Sterling</h2><p>Ride with verified colleagues across Lagos.</p><div><small>428 members</small><small>12 active routes</small><small>64 rides this week</small></div></div><button onClick={() => notify('Community opened')}>Open community <ArrowRight size={16}/></button></section>
    <div className="community-stats"><div><Users/><span><small>PEOPLE ON YOUR ROUTE</small><strong>38</strong></span></div><div><CarFront/><span><small>SEATS TOMORROW</small><strong>14</strong></span></div><div><Coins/><span><small>AVG. SEAT COST</small><strong>₦1,420</strong></span></div><div><ShieldCheck/><span><small>VERIFIED MEMBERS</small><strong>100%</strong></span></div></div>
    <section className="discover-communities"><div className="dash-section-head"><div><h2>Discover communities</h2><p>Groups near your home, work and route</p></div><button>See all</button></div><div className="community-discover-grid">{communities.slice(1).map(c=><article key={c.name} style={{'--community-color':c.color} as React.CSSProperties}><div className="community-art"><span>{c.initials}</span><Users/></div><span>{c.type.toUpperCase()}</span><h3>{c.name}</h3><p>{c.members} members · {c.routes} active routes</p><button onClick={() => notify(`Request sent to ${c.name}`)}>Request to join <ArrowRight size={14}/></button></article>)}</div></section>
  </>;
}

function ProfileView({ role, onSwitch, onExit }: { role: 'rider'|'driver'; onSwitch:()=>void; onExit:()=>void }) {
  return <>
    <PageHeading eyebrow="ACCOUNT" title="Profile & trust" subtitle="Manage your identity, preferences and safety settings." />
    <div className="profile-layout">
      <section className="profile-card"><div className="profile-photo"><Avatar initials="OO" color="#d87753" size={94}/><button><Camera size={15}/></button></div><h2>Olabisi Ojo</h2><p><Star size={14} fill="currentColor"/> 4.9 · 28 shared trips</p><VerifiedBadge text="Identity verified"/><div className="profile-completion"><span><strong>Profile strength</strong><em>85%</em></span><i><b/></i><small>Add a second emergency contact to reach 100%</small></div></section>
      <section className="profile-settings">
        <h3>Trust & verification</h3>
        <div className="verification-grid"><Verification label="Phone number" status="Verified"/><Verification label="National identity" status="Verified"/><Verification label="Selfie & liveness" status="Verified"/><Verification label="Community" status="1 verified"/>{role==='driver'&&<><Verification label="Driver licence" status="Verified"/><Verification label="Vehicle" status="Verified"/></>}</div>
        <h3>Account settings</h3>
        <div className="settings-list"><Setting icon={<User/>} title="Personal information" sub="Name, phone and profile photo"/><Setting icon={<Shield/>} title="Safety & emergency contacts" sub="1 contact · Add another"/><Setting icon={<CreditCard/>} title="Payments and payouts" sub={role==='driver'?'GTBank ·•• 0294':'Visa ·•• 2048'}/><Setting icon={<Bell/>} title="Notifications" sub="Push, SMS and email"/><Setting icon={<Settings/>} title="Privacy & data" sub="Location, blocked users and data controls"/></div>
        <div className="profile-actions"><button className="btn btn-outline" onClick={onSwitch}>{role==='rider'?<CarFront/>:<User/>} Switch to {role==='rider'?'driver':'rider'} mode</button><button className="text-danger" onClick={onExit}><LogOut size={17}/> Sign out</button></div>
      </section>
    </div>
  </>;
}
function Verification({label,status}:{label:string;status:string}){return <div><span><CheckCircle2 size={17}/></span><p><strong>{label}</strong><small>{status}</small></p><ChevronRight size={16}/></div>}
function Setting({icon,title,sub}:{icon:React.ReactNode;title:string;sub:string}){return <button><span>{icon}</span><p><strong>{title}</strong><small>{sub}</small></p><ChevronRight size={17}/></button>}

function DriverHome({ onOffer, onRequests, onTrip }: { onOffer:()=>void;onRequests:()=>void;onTrip:()=>void }) {
  return <>
    <PageHeading eyebrow="DRIVER MODE · ONLINE" title="Good morning, Olabisi." subtitle="Your next shared commute has 2 confirmed passengers." action={<button className="btn btn-primary" onClick={onOffer}><Plus size={17}/> Offer a ride</button>}/>
    <div className="driver-stat-grid"><div className="main-driver-stat"><span>AVAILABLE BALANCE</span><strong>₦46,850</strong><small>Next payout · Friday, 21 Aug</small><button>View earnings <ArrowRight size={15}/></button><Coins/></div><div><span>THIS WEEK</span><strong>₦24,600</strong><small><TrendingUp size={13}/> 18% from last week</small></div><div><span>SEATS FILLED</span><strong>9 <em>/ 12</em></strong><small>75% utilisation</small></div><div><span>DRIVER RATING</span><strong>4.9 <Star size={19} fill="currentColor"/></strong><small>From 84 ratings</small></div></div>
    <div className="driver-dashboard-grid">
      <section className="driver-next-trip"><div className="dnt-head"><span><i/>NEXT RIDE · TODAY</span><button onClick={onTrip}>View details <ChevronRight size={15}/></button></div><div className="dnt-route"><span className="dnt-time">5:30<small>PM</small></span><div><span><i/>Sterling Towers, VI</span><em/><span><i/>Novare Mall, Ajah</span></div><span className="dnt-repeat"><Repeat2/>Weekdays</span></div><div className="passengers-head"><span>PASSENGERS · 2 OF 3 SEATS</span><span>₦2,850 expected</span></div><div className="passenger-row"><div><Avatar initials="TN" color="#7059a3" size={43}/><span><strong>Tobi Nwankwo <BadgeCheck size={13} fill="currentColor"/></strong><small>Pickup · Law School, VI</small></span></div><span>1 seat</span><button><MessageCircle size={17}/></button></div><div className="passenger-row"><div><Avatar initials="DJ" color="#397c6c" size={43}/><span><strong>Dami James <BadgeCheck size={13} fill="currentColor"/></strong><small>Pickup · Oniru Market</small></span></div><span>1 seat</span><button><MessageCircle size={17}/></button></div><button className="btn btn-dark btn-block" onClick={onTrip}><Navigation size={17}/> Prepare for trip</button></section>
      <aside><section className="request-nudge"><div><span>2</span><div><strong>New seat requests</strong><small>For your next 3 rides</small></div></div><button onClick={onRequests}>Review requests <ArrowRight size={15}/></button></section><section className="performance-card"><div className="dash-section-head"><div><h3>Driver quality</h3><p>Last 30 days</p></div><strong>Excellent</strong></div><div className="quality-row"><span>On time pickup</span><b>96%</b><i><em style={{width:'96%'}}/></i></div><div className="quality-row"><span>Acceptance rate</span><b>89%</b><i><em style={{width:'89%'}}/></i></div><div className="quality-row"><span>Low cancellation</span><b>98%</b><i><em style={{width:'98%'}}/></i></div></section><section className="docs-card"><FileCheck2/><div><strong>Documents up to date</strong><small>Insurance due in 93 days</small></div><ChevronRight/></section></aside>
    </div>
  </>;
}

function DriverRides({onOffer,onSos,notify}:{onOffer:()=>void;onSos:()=>void;notify:(s:string)=>void}){
  return <><PageHeading eyebrow="DRIVER SCHEDULE" title="My rides" subtitle="Manage recurring routes and upcoming journeys." action={<button className="btn btn-primary" onClick={onOffer}><Plus size={17}/> Offer a ride</button>}/><div className="trip-tabs"><button className="active">Upcoming <span>4</span></button><button>Recurring routes</button><button>Completed</button></div><section className="driver-active-ride"><div className="dar-top"><span><i/>STARTING IN 2 HRS 14 MIN</span><small>Trip #PG8824</small></div><div className="dar-content"><div className="dar-route"><strong>5:30 <small>PM</small></strong><div><span><i/>Victoria Island</span><em/><span><i/>Ajah</span></div><div><small>EST. EARNINGS</small><b>₦2,850</b></div></div><div className="dar-people"><span>PASSENGERS</span><div className="mini-stack"><Avatar initials="TN" color="#7059a3" size={38}/><Avatar initials="DJ" color="#397c6c" size={38}/></div><p>2 confirmed · 1 seat open</p></div><div className="dar-actions"><button className="btn btn-dark" onClick={()=>notify('Navigation is ready')}><Navigation/>Start navigation</button><button className="btn btn-outline" onClick={onSos}><Shield/>Safety tools</button></div></div></section>{[1,2,3].map((x)=><section className="schedule-row" key={x}><div className="schedule-date"><strong>{x===1?'TUE':'WED'}</strong><span>{18+x} AUG</span></div><div className="schedule-route"><strong>{x%2?'Ajah → Victoria Island':'Victoria Island → Ajah'}</strong><span><Clock3/> {x%2?'7:00 AM':'5:30 PM'} · <Repeat2/> Recurring</span></div><div className="mini-stack"><Avatar initials="TN" color="#7059a3" size={32}/><Avatar initials={x===3?'AB':'DJ'} color="#397c6c" size={32}/></div><span className="seat-status">{x===2?'3/3 full':'2/3 seats'}</span><strong>₦{x===2?'4,200':'2,850'}</strong><button>•••</button></section>)}</>;
}

function RequestsView({status,onAccept,notify}:{status:'pending'|'accepted';onAccept:()=>void;notify:(s:string)=>void}){
  return <><PageHeading eyebrow="PASSENGER REQUESTS" title="Seat requests" subtitle="Review verified people who want to join your routes."/><div className="request-filter"><button className="active">Pending <span>{status==='pending'?2:1}</span></button><button>Accepted</button><button>Declined</button></div><div className="request-list"><section className={`request-card ${status==='accepted'?'accepted':''}`}><div className="request-route-head"><span><CalendarDays/>TOMORROW · 7:00 AM</span><span>Ajah <ArrowRight/> Victoria Island</span></div><div className="request-person"><Avatar initials="TN" color="#7059a3" size={62}/><div><h3>Tobi Nwankwo <BadgeCheck size={16} fill="currentColor"/></h3><p><Star size={13} fill="currentColor"/>4.8 · 17 completed trips</p><div><span><Users/>PadiGo at Sterling</span><span><ShieldCheck/>Identity verified</span></div></div><div className="request-match"><strong>94%</strong><span>route match</span></div></div><div className="request-pickup"><div><small>PICKUP</small><strong>Abraham Adesanya Estate Gate</strong><span>+4 min to your route</span></div><div><small>ARRIVAL</small><strong>Sterling Towers, Marina</strong><span>On your route</span></div><div><small>SEATS</small><strong>1 seat</strong><span>₦1,500</span></div></div><div className="request-actions">{status==='pending'?<><button className="btn btn-outline" onClick={()=>notify('Request declined')}>Decline</button><button className="btn btn-primary" onClick={onAccept}><Check/>Accept Tobi</button></>:<span className="accepted-message"><CheckCircle2/>Tobi is confirmed on this ride</span>}<button className="text-button"><MessageCircle/>Message first</button></div></section><section className="request-card compact-request"><div className="request-route-head"><span><CalendarDays/>FRIDAY · 5:30 PM</span><span>Victoria Island <ArrowRight/> Ajah</span></div><div className="request-person"><Avatar initials="AE" color="#cc7955" size={53}/><div><h3>Amaka Eze <BadgeCheck size={16} fill="currentColor"/></h3><p><Star size={13} fill="currentColor"/>4.9 · Lekki Gardens</p></div><div className="request-match"><strong>88%</strong><span>route match</span></div></div><div className="request-actions"><button className="btn btn-outline">Decline</button><button className="btn btn-primary" onClick={()=>notify('Amaka has been added')}>Accept request</button></div></section></div></>;
}

function EarningsView({notify}:{notify:(s:string)=>void}){
 const bars=[42,64,38,81,70,94,52];
 return <><PageHeading eyebrow="DRIVER FINANCES" title="Earnings" subtitle="Transparent cost contributions, settlements and payouts." action={<button className="btn btn-primary" onClick={()=>notify('Payout request submitted')}><Banknote/>Withdraw funds</button>}/><section className="earnings-hero"><div><span>AVAILABLE TO WITHDRAW</span><strong>₦46,850</strong><small><CheckCircle2/>All trips reconciled</small></div><div><span>PENDING</span><strong>₦6,700</strong><small>From 3 upcoming trips</small></div><div><span>PAID OUT THIS MONTH</span><strong>₦81,400</strong><small>To GTBank ·••0294</small></div></section><div className="earnings-grid"><section className="earnings-chart"><div className="dash-section-head"><div><h2>Earnings activity</h2><p>11 to 17 August 2026</p></div><select><option>This week</option><option>This month</option></select></div><div className="bar-chart">{bars.map((h,i)=><div key={i}><span style={{height:`${h}%`}} className={i===5?'active':''}><em>{i===5?'₦6.8k':''}</em></span><small>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</small></div>)}</div><div className="chart-summary"><span><small>GROSS CONTRIBUTIONS</small><strong>₦27,000</strong></span><i/><span><small>PADIGO SERVICE</small><strong>−₦2,400</strong></span><i/><span><small>YOUR EARNINGS</small><strong>₦24,600</strong></span></div></section><aside className="payout-card"><span>NEXT AUTOMATIC PAYOUT</span><h3>Friday, 21 August</h3><strong>₦46,850</strong><div><span>GT</span><p><strong>Guaranty Trust Bank</strong><small>Olabisi Ojo · ••0294</small></p><BadgeCheck/></div><button className="btn btn-outline btn-block">Manage payout account</button></aside></div><section className="transactions"><div className="dash-section-head"><div><h2>Recent transactions</h2><p>All contributions, fees and payouts</p></div><button>Download statement</button></div>{['Ajah → Victoria Island','Victoria Island → Ajah','Weekly payout','Ajah → Victoria Island'].map((x,i)=><div className="transaction-row" key={i}><span className={i===2?'payout-icon':''}>{i===2?<Banknote/>:<CarFront/>}</span><div><strong>{x}</strong><small>{i===2?'14 August 2026 · GTBank ••0294':`${16-i} August 2026 · Trip #PG-${8824-i}`}</small></div><span className={i===2?'paid-tag':'settled-tag'}>{i===2?'Paid':'Settled'}</span><strong className={i===2?'debit':''}>{i===2?'−₦32,700':`+₦${[2850,4200,0,2700][i].toLocaleString()}`}</strong><ChevronRight/></div>)}</section></>;
}

function FindRideModal({open,onClose,onResults}:{open:boolean;onClose:()=>void;onResults:()=>void}){
 const [recurring,setRecurring]=useState(true);
 return <Modal open={open} onClose={onClose} wide><div className="flow-modal-head"><span className="flow-icon"><Search/></span><div><span>FIND A RIDE</span><h2>Where are you headed?</h2><p>We'll compare route overlap, timing and trust to find your best matches.</p></div></div><div className="flow-route-fields"><label><span>LEAVING FROM</span><div><i className="dot start"/><input defaultValue="Ajah, Lagos"/><LocateFixed/></div></label><em/><label><span>GOING TO</span><div><i className="dot end"/><input defaultValue="Victoria Island, Lagos"/><MapPin/></div></label></div><div className="modal-form-grid"><label><span>DATE</span><div className="input-shell"><CalendarDays/><input defaultValue="Tomorrow, 18 August"/><ChevronDown/></div></label><label><span>DEPARTURE WINDOW</span><div className="input-shell"><Clock3/><input defaultValue="6:45 AM to 7:15 AM"/><ChevronDown/></div></label><label><span>PASSENGERS</span><div className="input-shell"><User/><input defaultValue="1 passenger"/><ChevronDown/></div></label></div><button className={`recurring-toggle ${recurring?'on':''}`} onClick={()=>setRecurring(!recurring)}><span><Repeat2/><div><strong>Make this a recurring commute</strong><small>Every Monday to Friday</small></div></span><i><em/></i></button><div className="flow-modal-foot"><span><ShieldCheck/>Only verified people appear in results</span><button className="btn btn-primary" onClick={onResults}>Find matching rides <ArrowRight/></button></div></Modal>
}

function OfferRideModal({open,onClose,onDone}:{open:boolean;onClose:()=>void;onDone:()=>void}){
 const [step,setStep]=useState(1); const [seats,setSeats]=useState(3); const [price,setPrice]=useState(1500);
 const close=()=>{setStep(1);onClose()};
 return <Modal open={open} onClose={close} wide><div className="flow-modal-head"><span className="flow-icon"><CarFront/></span><div><span>OFFER A RIDE · STEP {step} OF 3</span><h2>{step===1?'Share where you’re going':step===2?'Set your schedule':'Seats and contribution'}</h2><p>{step===1?'Your route stays private until a passenger is confirmed.':step===2?'Create a single journey or make it your regular route.':'We recommend a fair contribution based on route cost.'}</p></div></div><Stepper active={step} total={3}/>{step===1&&<div className="flow-route-fields offer-fields"><label><span>STARTING FROM</span><div><i className="dot start"/><input defaultValue="Ajah, Lagos"/><LocateFixed/></div></label><em/><label><span>GOING TO</span><div><i className="dot end"/><input defaultValue="Victoria Island, Lagos"/><MapPin/></div></label><div className="route-preview-mini"><MapArtwork/><span>47 min · 28.6 km</span></div></div>}{step===2&&<div className="schedule-form"><div className="frequency"><button>One time</button><button className="active"><Repeat2/>Recurring</button></div><label><span>TRAVEL DAYS</span><div className="day-pills">{['M','T','W','T','F','S','S'].map((d,i)=><button className={i<5?'active':''} key={i}>{d}</button>)}</div></label><div className="modal-form-grid two"><label><span>DEPARTURE TIME</span><div className="input-shell"><Clock3/><input defaultValue="7:00 AM"/></div></label><label><span>STARTING</span><div className="input-shell"><CalendarDays/><input defaultValue="18 August 2026"/></div></label></div><label className="flexible-check"><i><Check/></i><span><strong>I'm flexible by 15 minutes</strong><small>More riders can match with your route</small></span></label></div>}{step===3&&<div className="seat-price-form"><div><span>AVAILABLE SEATS</span><div className="counter"><button onClick={()=>setSeats(Math.max(1,seats-1))}>−</button><strong>{seats}</strong><button onClick={()=>setSeats(Math.min(4,seats+1))}>+</button></div><small>Your vehicle is approved for 4 passengers.</small></div><div><span>CONTRIBUTION PER SEAT</span><div className="price-input"><b>₦</b><input value={price} onChange={e=>setPrice(Number(e.target.value))}/><span>/ seat</span></div><small className="recommended"><CheckCircle2/>Recommended range: ₦1,300 to ₦1,650</small></div><div className="earning-estimate"><span><Coins/></span><div><small>ESTIMATED WEEKLY CONTRIBUTION</small><strong>{formatNaira(price*seats*5)}</strong><p>Before PadiGo's service fee · if all seats are filled</p></div></div></div>}<div className="flow-modal-foot"><button className="text-button" onClick={()=>step===1?close():setStep(step-1)}><ChevronLeft/> {step===1?'Cancel':'Back'}</button><button className="btn btn-primary" onClick={()=>step<3?setStep(step+1):onDone()}>{step<3?'Continue':'Publish recurring ride'} <ArrowRight/></button></div></Modal>
}

function RideBookingModal({ride,step,setStep,onClose,onDone}:{ride:Ride|null;step:number;setStep:(n:number)=>void;onClose:()=>void;onDone:()=>void}){
 if(!ride)return null;
 return <Modal open={!!ride} onClose={onClose} wide>{step===1&&<><div className="ride-modal-head"><div><span>{ride.match}% ROUTE MATCH</span><h2>{ride.from} to {ride.to}</h2><p>Tomorrow · {ride.time} · {ride.eta}</p></div><div className="match-ring"><strong>{ride.match}</strong><small>MATCH</small></div></div><div className="ride-modal-map"><MapArtwork/><div className="rm-start">A</div><div className="rm-end">VI</div><span>+ 5 min driver detour</span></div><div className="ride-modal-grid"><section><h4>YOUR DRIVER</h4><div className="ride-modal-driver"><Avatar initials={ride.initials} color={ride.avatarColor} size={60}/><div><h3>{ride.driver}<BadgeCheck fill="currentColor"/></h3><p><Star fill="currentColor"/> {ride.rating} · {ride.trips} completed trips</p><span>{ride.community}</span></div><ChevronRight/></div><div className="verification-list"><span><CheckCircle2/>Identity verified</span><span><CheckCircle2/>Driver licence</span><span><CheckCircle2/>Vehicle verified</span><span><CheckCircle2/>Phone verified</span></div></section><section><h4>VEHICLE</h4><div className="vehicle-visual"><CarFront/><div><strong>{ride.car}</strong><span>Plate · {ride.plate}</span></div><b>{ride.seats} seats</b></div><div className="ride-rules"><ShieldCheck/><span><strong>PadiGo Safety Standard</strong><small>Trip is tracked and includes SOS support.</small></span></div></section></div><div className="ride-modal-route"><div><i/><span><small>PICKUP · {ride.time}</small><strong>{ride.pickup}</strong><em>Exact location is shared after confirmation</em></span></div><b/><div><i/><span><small>ARRIVAL · 7:48 AM</small><strong>{ride.to}</strong><em>4 minute walk to your destination</em></span></div></div><div className="booking-bar"><div><small>ONE SEAT</small><strong>{formatNaira(ride.price)}</strong><span>Secure payment · free cancellation for 10 min</span></div><button className="btn btn-primary" onClick={()=>setStep(2)}>Request this seat <ArrowRight/></button></div></>}{step===2&&<><div className="flow-modal-head"><span className="flow-icon"><CreditCard/></span><div><span>SECURE CHECKOUT</span><h2>Confirm and pay</h2><p>Your payment is held until the trip is completed.</p></div></div><div className="checkout-layout"><section><div className="checkout-trip"><div><span>TOMORROW · {ride.time}</span><strong>{ride.from} <ArrowRight/> {ride.to}</strong><small>1 seat with {ride.driver}</small></div><Avatar initials={ride.initials} color={ride.avatarColor}/></div><h4>PAYMENT METHOD</h4><button className="payment-method active"><span className="visa-box">VISA</span><div><strong>Visa ending in 2048</strong><small>Expires 09/28</small></div><CheckCircle2 fill="currentColor"/></button><button className="payment-method"><span className="bank-box">▣</span><div><strong>Pay with bank transfer</strong><small>Instant secure transfer</small></div><ChevronRight/></button><button className="add-payment"><Plus/>Add another payment method</button></section><aside className="order-summary"><h3>Payment summary</h3><div><span>Seat contribution</span><strong>{formatNaira(ride.price)}</strong></div><div><span>PadiGo protection fee</span><strong>₦120</strong></div><div className="promo"><span>Promo credit</span><strong>−₦120</strong></div><hr/><div className="total"><span>Total</span><strong>{formatNaira(ride.price)}</strong></div><p><ShieldCheck/>Payment is encrypted and held securely until your trip is completed.</p></aside></div><div className="flow-modal-foot"><button className="text-button" onClick={()=>setStep(1)}><ChevronLeft/>Back</button><button className="btn btn-primary" onClick={()=>setStep(3)}><ShieldCheck/>Pay {formatNaira(ride.price)}</button></div></>}{step===3&&<div className="booking-success"><span className="success-ring"><Check/></span><span className="success-label">SEAT CONFIRMED</span><h2>You're riding with {ride.driver.split(' ')[0]}!</h2><p>Tomorrow at {ride.time}. We'll remind you when it's time to leave.</p><div className="success-ticket"><div><span><small>FROM</small><strong>{ride.from}</strong></span><ArrowRight/><span><small>TO</small><strong>{ride.to}</strong></span></div><div><span><CalendarDays/>Tomorrow, 18 Aug</span><span><Clock3/>{ride.time}</span><span><User/>1 seat</span></div><div><Avatar initials={ride.initials} color={ride.avatarColor}/><span><strong>{ride.driver}</strong><small>{ride.car}</small></span><b>{ride.plate}</b></div></div><div className="success-actions"><button className="btn btn-outline"><CalendarDays/>Add to calendar</button><button className="btn btn-primary" onClick={onDone}>View my trip <ArrowRight/></button></div><small className="success-note">Booking ID · {ride.id} · Receipt sent to your email</small></div>}</Modal>
}

function SosModal({open,onClose}:{open:boolean;onClose:()=>void}){
 const [armed,setArmed]=useState(false);
 return <Modal open={open} onClose={()=>{setArmed(false);onClose()}}><div className="sos-modal"><span className="sos-shield"><Shield/></span><span>PADIGO SAFETY</span><h2>{armed?'Help request ready':'Do you need help?'}</h2><p>{armed?'Your live location and trip details are ready to send to PadiGo Safety and your emergency contact.':'Choose an option below. Emergency actions share your live trip context with our safety team.'}</p>{armed?<><div className="sos-location"><LocateFixed/><span><strong>Live location captured</strong><small>Updated just now · Trip #PG2841</small></span><CheckCircle2/></div><button className="btn btn-danger btn-block" onClick={()=>setArmed(false)}><Phone/>Call emergency services</button><button className="btn btn-dark btn-block" onClick={()=>setArmed(false)}><Headphones/>Alert PadiGo Safety</button></>:<div className="sos-options"><button onClick={()=>setArmed(true)}><AlertTriangle/><span><strong>I feel unsafe</strong><small>Alert safety operations now</small></span><ChevronRight/></button><button><Phone/><span><strong>Call emergency services</strong><small>Use your phone to place the call</small></span><ChevronRight/></button><button><MessageCircle/><span><strong>Report a trip issue</strong><small>Support for non urgent issues</small></span><ChevronRight/></button></div>}<button className="sos-cancel" onClick={()=>{setArmed(false);onClose()}}>I'm okay, close safety centre</button></div></Modal>
}
