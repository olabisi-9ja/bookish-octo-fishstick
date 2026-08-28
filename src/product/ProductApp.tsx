import { useEffect, useState } from 'react';
import {
  Bell, CarFront, ChevronDown, ChevronRight, CircleHelp, Home, Menu, Plus, Route, Search,
  ShieldCheck, User, Users, WalletCards, X,
} from 'lucide-react';
import Brand from '../components/Brand';
import { Avatar, Toast } from '../components/UI';
import { fullName, greetingFor, longDate, searchPlaces, usePlatform, type RideCard } from '../platform';
import { ChatDrawer, HelpDrawer, NotificationsDrawer, SafetyDrawer, WalletDrawer } from './Drawers';
import { DriverHome, DriverRides, EarningsView, RequestsView } from './DriverViews';
import {
  DriverOnboardModal, FindRideModal, OfferRideModal, PinModal, RatingModal, ReceiptModal,
  RideBookingModal, SosModal,
} from './Modals';
import { CommunitiesView, ExploreRides, ProfileView, RiderHome, TripsView } from './RiderViews';
import { MobileNav } from './shared';

type Props = { path: string; onNavigate: (path: string) => void; onExit: () => void; onOps: () => void };
type RiderTab = 'home' | 'explore' | 'trips' | 'communities' | 'profile';
type DriverTab = 'home' | 'rides' | 'requests' | 'earnings' | 'profile';

const riderTabs: RiderTab[] = ['home', 'explore', 'trips', 'communities', 'profile'];
const driverTabs: DriverTab[] = ['home', 'rides', 'requests', 'earnings', 'profile'];

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

const readProductPath = (path: string) => {
  const parts = path.split('/').filter(Boolean);
  const role = parts[1] === 'driver' ? 'driver' : 'rider';
  const requested = parts[2] ?? 'home';
  const tab = role === 'rider'
    ? (riderTabs.includes(requested as RiderTab) ? requested as RiderTab : 'home')
    : (driverTabs.includes(requested as DriverTab) ? requested as DriverTab : 'home');
  return { role, tab } as const;
};

export default function ProductApp({ path, onNavigate, onExit, onOps }: Props) {
  const { me, state, setRole, setSearch, logout, unreadCount, pendingRequestCount } = usePlatform();
  const initialPath = readProductPath(path);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideCard | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [sosOpen, setSosOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [chatTripId, setChatTripId] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [pinTripId, setPinTripId] = useState<string | null>(null);
  const [ratingTripId, setRatingTripId] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('comuta.search');
    if (!raw) return;
    sessionStorage.removeItem('comuta.search');
    try {
      const parsed = JSON.parse(raw) as { from?: string; to?: string; tripType?: string };
      const fromHit = searchPlaces(parsed.from ?? '')[0];
      const toHit = searchPlaces(parsed.to ?? '')[0];
      if (fromHit && toHit) {
        usePlatform; // keep import live for typecheck of hook usage above
      }
      if (parsed.tripType === 'offer') {
        setRole('driver');
        onNavigate('/app/driver/home');
        setOfferOpen(true);
      } else {
        onNavigate('/app/rider/explore');
        setSearchOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const role = initialPath.role;
  const currentTab = initialPath.tab;
  const nav = role === 'rider' ? riderNavigation : driverNavigation;

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const goTab = (nextRole: 'rider' | 'driver', id: string) => {
    setRole(nextRole);
    onNavigate(`/app/${nextRole}/${id}`);
    setMenu(false);
  };

  const switchRole = (next: 'rider' | 'driver') => {
    if (next === 'driver' && state.session && !state.session.driverOnboarded) {
      setOnboardOpen(true);
      return;
    }
    goTab(next, 'home');
  };

  const openBooking = (ride: RideCard) => { setSelectedRide(ride); setBookingStep(1); };
  const closeRide = () => { setSelectedRide(null); setBookingStep(0); };

  const liveTripId = state.trips.find((trip) => ['driver_en_route', 'driver_arrived', 'in_progress'].includes(trip.status))?.id;

  return (
    <div className="product-app">
      <aside className={`app-sidebar ${menu ? 'mobile-open' : ''}`}>
        <div className="app-side-head">
          <button onClick={onExit}><Brand /></button>
          <button className="close-side" onClick={() => setMenu(false)}><X /></button>
        </div>
        <div className="role-switcher">
          <button className={role === 'rider' ? 'active' : ''} onClick={() => switchRole('rider')}><User size={15} /> Rider</button>
          <button className={role === 'driver' ? 'active' : ''} onClick={() => switchRole('driver')}><CarFront size={15} /> Driver</button>
        </div>
        <nav className="app-nav">
          <span className="nav-label">YOUR COMUTA</span>
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => goTab(role, id)}>
              <Icon size={19} />
              <span>{label}</span>
              {id === 'requests' && pendingRequestCount > 0 && <i className="nav-count">{pendingRequestCount}</i>}
            </button>
          ))}
          <span className="nav-label lower">SUPPORT</span>
          <button onClick={() => setHelpOpen(true)}><CircleHelp size={19} /><span>Help centre</span></button>
          <button onClick={onOps}><ShieldCheck size={19} /><span>Operations demo</span></button>
        </nav>
        <button className="sidebar-safety" onClick={() => setSafetyOpen(true)}>
          <span><ShieldCheck size={19} /></span>
          <div><strong>Safety centre</strong><small>Trip support is available</small></div>
          <ChevronRight size={17} />
        </button>
        <div className="side-profile">
          <Avatar initials={me?.initials ?? 'CT'} color={me?.avatarColor} size={40} photo={me?.photo} />
          <div>
            <strong>{me ? fullName(me) : 'Guest'}</strong>
            <small>{me?.verified ? 'Identity verified' : 'Verification pending'}</small>
          </div>
          <ChevronDown size={16} />
        </div>
      </aside>
      {menu && <div className="side-scrim" onClick={() => setMenu(false)} />}

      <section className="app-workspace">
        <header className="app-topbar">
          <div className="app-mobile-brand"><button onClick={() => setMenu(true)}><Menu /></button><Brand /></div>
          <div className="topbar-left">
            <span className="network-dot" />
            <span>{greetingFor()}, {me?.firstName ?? 'there'}</span>
            <small>·</small>
            <span>{longDate()}</span>
          </div>
          <div className="topbar-actions">
            {role === 'rider'
              ? <button className="quick-action" onClick={() => setSearchOpen(true)}><Search size={17} /> Find a ride</button>
              : <button className="quick-action" onClick={() => setOfferOpen(true)}><Plus size={17} /> Offer a ride</button>}
            <button className="icon-button notification" onClick={() => setNotifOpen(true)}>
              <Bell size={19} />
              {unreadCount > 0 && <i />}
            </button>
            <button className="mobile-avatar"><Avatar initials={me?.initials ?? 'CT'} color={me?.avatarColor} size={36} photo={me?.photo} /></button>
          </div>
        </header>

        <div className="app-page">
          {role === 'rider' ? (
            <>
              {currentTab === 'home' && <RiderHome onSearch={() => setSearchOpen(true)} onRide={openBooking} onTrips={() => goTab('rider', 'trips')} onChat={setChatTripId} />}
              {currentTab === 'explore' && <ExploreRides onRide={openBooking} onSearch={() => setSearchOpen(true)} />}
              {currentTab === 'trips' && (
                <TripsView
                  onSos={() => setSosOpen(true)}
                  notify={notify}
                  onChat={setChatTripId}
                  onReceipt={setReceiptId}
                  onRate={setRatingTripId}
                />
              )}
              {currentTab === 'communities' && <CommunitiesView notify={notify} />}
              {currentTab === 'profile' && (
                <ProfileView
                  role={role}
                  onSwitch={() => switchRole('driver')}
                  onExit={() => { logout(); onExit(); }}
                  onWallet={() => setWalletOpen(true)}
                />
              )}
            </>
          ) : (
            <>
              {currentTab === 'home' && (
                <DriverHome
                  onOffer={() => setOfferOpen(true)}
                  onRequests={() => goTab('driver', 'requests')}
                  onTrip={() => goTab('driver', 'rides')}
                  onChat={setChatTripId}
                  onWallet={() => setWalletOpen(true)}
                />
              )}
              {currentTab === 'rides' && (
                <DriverRides
                  onOffer={() => setOfferOpen(true)}
                  onSos={() => setSosOpen(true)}
                  notify={notify}
                  onPin={setPinTripId}
                  onChat={setChatTripId}
                />
              )}
              {currentTab === 'requests' && <RequestsView notify={notify} onChat={setChatTripId} />}
              {currentTab === 'earnings' && <EarningsView notify={notify} onWallet={() => setWalletOpen(true)} />}
              {currentTab === 'profile' && (
                <ProfileView
                  role={role}
                  onSwitch={() => switchRole('rider')}
                  onExit={() => { logout(); onExit(); }}
                  onWallet={() => setWalletOpen(true)}
                />
              )}
            </>
          )}
        </div>
        <MobileNav nav={nav} current={currentTab} setTab={(id) => goTab(role, id)} />
      </section>

      <FindRideModal open={searchOpen} onClose={() => setSearchOpen(false)} onResults={() => { setSearchOpen(false); goTab('rider', 'explore'); notify('Matching complete'); }} />
      <OfferRideModal open={offerOpen} onClose={() => setOfferOpen(false)} onDone={() => { setOfferOpen(false); notify('Your recurring ride is now live'); goTab('driver', 'rides'); }} />
      <RideBookingModal
        ride={selectedRide}
        step={bookingStep}
        setStep={setBookingStep}
        onClose={closeRide}
        notify={notify}
        onDone={() => { closeRide(); notify('Seat confirmed'); goTab('rider', 'trips'); }}
      />
      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} tripId={liveTripId ?? chatTripId ?? state.trips[0]?.id} />
      <PinModal tripId={pinTripId} open={!!pinTripId} onClose={() => setPinTripId(null)} notify={notify} />
      <RatingModal tripId={ratingTripId} open={!!ratingTripId} onClose={() => setRatingTripId(null)} notify={notify} />
      <ReceiptModal bookingId={receiptId} open={!!receiptId} onClose={() => setReceiptId(null)} />
      <DriverOnboardModal open={onboardOpen} onClose={() => setOnboardOpen(false)} onDone={() => { setOnboardOpen(false); notify('Driver profile submitted'); goTab('driver', 'home'); }} />
      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ChatDrawer tripId={chatTripId} open={!!chatTripId} onClose={() => setChatTripId(null)} />
      <WalletDrawer open={walletOpen} onClose={() => setWalletOpen(false)} />
      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SafetyDrawer open={safetyOpen} onClose={() => setSafetyOpen(false)} onSos={() => { setSafetyOpen(false); setSosOpen(true); }} />
      <Toast visible={!!toast} message={toast} />
    </div>
  );
}
