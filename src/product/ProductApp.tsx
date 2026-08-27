import { useEffect, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bell, Calendar, CarFront, CheckCircle2, ChevronDown,
  ChevronRight, CircleHelp, ExternalLink, Eye, Home, Layers, Layout, MapPin, Menu, Monitor,
  Plus, RefreshCw, Repeat2, Route, Search, Shield, ShieldCheck, Smartphone, Sparkles, User,
  Users, WalletCards, X,
} from 'lucide-react';
import Brand from '../components/Brand';
import FigmaSpecViewer from '../FigmaSpecViewer';
import { Avatar, Toast } from '../components/UI';
import {
  formatNaira, fullName, greetingFor, longDate, usePlatform, type RideCard,
} from '../platform';
import {
  ActiveTripView, AtRiskRecoveryView, BookingReviewView, PaymentFlowView, PickupView,
  PlanCommuteView, RecurringCommuteView, RiderAccountView, RiderHome, SearchResultsView,
  TripCompletionView, TripDetailView,
} from './RiderViews';
import {
  DriverCommitmentView, DriverEarningsView, DriverHome, DriverPublishView,
  DriverReliabilityView, DriverTripNavView,
} from './DriverViews';
import { MobileNav } from './shared';

type Props = {
  path: string;
  onNavigate: (path: string) => void;
  onExit: () => void;
  onOps: () => void;
};

export default function ProductApp({ path, onNavigate, onExit, onOps }: Props) {
  const { me, state, setRole, matchedRides, logout, triggerAtRiskDemo } = usePlatform();

  // Mode: Rider or Driver
  const [mode, setMode] = useState<'rider' | 'driver'>('rider');

  // Screen within mode
  type RiderScreen =
    | 'home'
    | 'plan'
    | 'search'
    | 'trip-detail'
    | 'booking'
    | 'payment'
    | 'pickup'
    | 'active-trip'
    | 'completion'
    | 'recurring'
    | 'at-risk'
    | 'account';

  type DriverScreen =
    | 'home'
    | 'publish'
    | 'commitment'
    | 'nav'
    | 'reliability'
    | 'earnings'
    | 'account';

  const [riderScreen, setRiderScreen] = useState<RiderScreen>('home');
  const [driverScreen, setDriverScreen] = useState<DriverScreen>('home');

  // Selected ride for detail/booking flow
  const [selectedRide, setSelectedRide] = useState<RideCard>(matchedRides[0]);

  // Mobile Device Frame view toggle (lets reviewer see realistic phone bezel or full layout)
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Figma Spec Viewer modal
  const [figmaOpen, setFigmaOpen] = useState(false);

  // Notifications drawer / toast
  const [toast, setToast] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modeSwitchSheet, setModeSwitchSheet] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const handleSelectRide = (ride: RideCard) => {
    setSelectedRide(ride);
    setRiderScreen('trip-detail');
  };

  const handleStartAtRiskRecovery = () => {
    triggerAtRiskDemo();
    setRiderScreen('at-risk');
  };

  // Nav definitions
  const riderNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: Search },
    { id: 'pickup', label: 'Pickup', icon: MapPin },
    { id: 'recurring', label: 'Recurring', icon: Repeat2 },
    { id: 'account', label: 'Account', icon: User },
  ] as const;

  const driverNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'commitment', label: 'T-8', icon: ShieldCheck },
    { id: 'publish', label: 'Publish', icon: Plus },
    { id: 'reliability', label: 'Reliability', icon: Sparkles },
    { id: 'account', label: 'Account', icon: User },
  ] as const;

  return (
    <div className={`comuta-product-container ${isPhoneFrame ? 'phone-frame-active' : ''}`}>
      {/* Top Universal App Navigation Bar */}
      <header className="product-universal-bar">
        <div className="bar-left">
          <button className="logo-btn" onClick={onExit} aria-label="COMUTA home">
            <Brand compact={false} />
          </button>

          {/* Mode Switcher Pill */}
          <div className="mode-segmented-pill">
            <button
              className={`mode-btn ${mode === 'rider' ? 'active' : ''}`}
              onClick={() => {
                setMode('rider');
                setRole('rider');
                setRiderScreen('home');
              }}
            >
              <User size={14} />
              <span>Rider Mode</span>
            </button>
            <button
              className={`mode-btn ${mode === 'driver' ? 'active' : ''}`}
              onClick={() => {
                setMode('driver');
                setRole('driver');
                setDriverScreen('home');
              }}
            >
              <CarFront size={14} />
              <span>Driver Mode</span>
            </button>
          </div>
        </div>

        {/* Screen Jump Selector (MVP Spine quick access) */}
        <div className="spine-screen-selector">
          <span className="spine-tag">SCREEN:</span>
          {mode === 'rider' ? (
            <select
              value={riderScreen}
              onChange={(e) => setRiderScreen(e.target.value as RiderScreen)}
              className="screen-select-dropdown"
            >
              <option value="home">01. Rider Home</option>
              <option value="plan">02. Plan Commute</option>
              <option value="search">03. Available Trips (Corridor Map)</option>
              <option value="trip-detail">04. Trip Details (Adebayo K.)</option>
              <option value="booking">05. Review Booking</option>
              <option value="payment">06. Paystack Payment & Confirmed</option>
              <option value="pickup">07. Meet Driver (PIN 4827)</option>
              <option value="active-trip">08. Active Trip (Map & SOS)</option>
              <option value="completion">09. Trip Complete & Receipt</option>
              <option value="recurring">10. Recurring Commute (Skip/Pause)</option>
              <option value="at-risk">11. At-Risk Recovery Flow</option>
              <option value="account">12. Account & KYC</option>
            </select>
          ) : (
            <select
              value={driverScreen}
              onChange={(e) => setDriverScreen(e.target.value as DriverScreen)}
              className="screen-select-dropdown"
            >
              <option value="home">01. Driver Home</option>
              <option value="commitment">02. T-8 Commitment Screen (Signature)</option>
              <option value="publish">03. Publish Commute</option>
              <option value="nav">04. Passenger Pickup & PIN Verification</option>
              <option value="reliability">05. Driver Reliability (98%)</option>
              <option value="earnings">06. Cost Recovery Ledger</option>
              <option value="account">07. Driver Account</option>
            </select>
          )}
        </div>

        <div className="bar-right">
          {/* Viewport Frame Toggle */}
          <button
            className={`tool-btn ${isPhoneFrame ? 'active' : ''}`}
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            title={isPhoneFrame ? 'Switch to Full Width view' : 'Switch to Mobile Phone Frame view'}
          >
            {isPhoneFrame ? <Monitor size={15} /> : <Smartphone size={15} />}
            <span>{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>

          {/* Figma Build Spec Viewer */}
          <button className="tool-btn figma-btn" onClick={() => setFigmaOpen(true)}>
            <span className="figma-mark">❖</span>
            <span>Figma Spec</span>
          </button>

          {/* Operations Dashboard */}
          <button className="tool-btn ops-btn" onClick={onOps}>
            <ShieldCheck size={15} />
            <span>Ops Centre</span>
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Wrapper */}
      <div className="device-stage-wrapper">
        <main className={`mobile-device-shell ${isPhoneFrame ? 'with-bezel' : 'full-viewport'}`}>
          {isPhoneFrame && (
            <div className="phone-notch-bar">
              <span className="notch-time">07:00</span>
              <span className="notch-island" />
              <div className="notch-icons">
                <span className="signal">●●●</span>
                <span className="wifi">5G</span>
                <span className="battery">100%</span>
              </div>
            </div>
          )}

          {/* Body Screen Rendering */}
          <div className="mobile-screen-viewport">
            {mode === 'rider' ? (
              <>
                {riderScreen === 'home' && (
                  <RiderHome
                    onPlan={() => setRiderScreen('plan')}
                    onRide={handleSelectRide}
                    onPickup={() => setRiderScreen('pickup')}
                    onActiveTrip={() => setRiderScreen('active-trip')}
                    onManageRecurring={() => setRiderScreen('recurring')}
                    onAtRiskDemo={handleStartAtRiskRecovery}
                  />
                )}

                {riderScreen === 'plan' && (
                  <PlanCommuteView
                    onBack={() => setRiderScreen('home')}
                    onFindTrips={() => setRiderScreen('search')}
                  />
                )}

                {riderScreen === 'search' && (
                  <SearchResultsView
                    onBack={() => setRiderScreen('plan')}
                    onSelectRide={handleSelectRide}
                  />
                )}

                {riderScreen === 'trip-detail' && (
                  <TripDetailView
                    ride={selectedRide}
                    onBack={() => setRiderScreen('search')}
                    onReserve={() => setRiderScreen('booking')}
                  />
                )}

                {riderScreen === 'booking' && (
                  <BookingReviewView
                    ride={selectedRide}
                    onBack={() => setRiderScreen('trip-detail')}
                    onProceedToPay={() => setRiderScreen('payment')}
                  />
                )}

                {riderScreen === 'payment' && (
                  <PaymentFlowView
                    ride={selectedRide}
                    onBack={() => setRiderScreen('booking')}
                    onComplete={() => setRiderScreen('pickup')}
                  />
                )}

                {riderScreen === 'pickup' && (
                  <PickupView
                    onBack={() => setRiderScreen('home')}
                    onTripStart={() => setRiderScreen('active-trip')}
                  />
                )}

                {riderScreen === 'active-trip' && (
                  <ActiveTripView
                    onBack={() => setRiderScreen('home')}
                    onComplete={() => setRiderScreen('completion')}
                    onSos={() => notify('SOS alert transmitted to COMUTA Operations & contacts.')}
                  />
                )}

                {riderScreen === 'completion' && (
                  <TripCompletionView
                    onDone={() => setRiderScreen('home')}
                  />
                )}

                {riderScreen === 'recurring' && (
                  <RecurringCommuteView
                    onBack={() => setRiderScreen('home')}
                  />
                )}

                {riderScreen === 'at-risk' && (
                  <AtRiskRecoveryView
                    onBack={() => setRiderScreen('home')}
                    onResolved={() => {
                      notify("You're still covered! Commute updated.");
                      setRiderScreen('home');
                    }}
                  />
                )}

                {riderScreen === 'account' && (
                  <RiderAccountView
                    onLogout={() => {
                      logout();
                      onExit();
                    }}
                    onSwitchMode={() => {
                      setMode('driver');
                      setRole('driver');
                      setDriverScreen('home');
                    }}
                  />
                )}
              </>
            ) : (
              /* Driver Mode Screens */
              <>
                {driverScreen === 'home' && (
                  <DriverHome
                    onPublish={() => setDriverScreen('publish')}
                    onCommitment={() => setDriverScreen('commitment')}
                    onTripNav={() => setDriverScreen('nav')}
                    onReliability={() => setDriverScreen('reliability')}
                    onEarnings={() => setDriverScreen('earnings')}
                    onSwitchMode={() => {
                      setMode('rider');
                      setRole('rider');
                      setRiderScreen('home');
                    }}
                  />
                )}

                {driverScreen === 'commitment' && (
                  <DriverCommitmentView
                    onBack={() => setDriverScreen('home')}
                    onCancelled={() => {
                      notify('Cancellation logged. COMUTA recovery dispatch initiated.');
                      setDriverScreen('home');
                    }}
                  />
                )}

                {driverScreen === 'publish' && (
                  <DriverPublishView
                    onBack={() => setDriverScreen('home')}
                    onPublished={() => {
                      notify('Commute published successfully.');
                      setDriverScreen('home');
                    }}
                  />
                )}

                {driverScreen === 'nav' && (
                  <DriverTripNavView
                    onBack={() => setDriverScreen('home')}
                    onComplete={() => {
                      notify('Commute completed. ₦4,500 credited to cost recovery balance.');
                      setDriverScreen('home');
                    }}
                  />
                )}

                {driverScreen === 'reliability' && (
                  <DriverReliabilityView
                    onBack={() => setDriverScreen('home')}
                  />
                )}

                {driverScreen === 'earnings' && (
                  <DriverEarningsView
                    onBack={() => setDriverScreen('home')}
                  />
                )}

                {driverScreen === 'account' && (
                  <RiderAccountView
                    onLogout={() => {
                      logout();
                      onExit();
                    }}
                    onSwitchMode={() => {
                      setMode('rider');
                      setRole('rider');
                      setRiderScreen('home');
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* Bottom App Navigation */}
          <MobileNav
            nav={mode === 'rider' ? riderNav : driverNav}
            current={mode === 'rider' ? riderScreen : driverScreen}
            setTab={(id) => {
              if (mode === 'rider') setRiderScreen(id as RiderScreen);
              else setDriverScreen(id as DriverScreen);
            }}
          />
        </main>
      </div>

      {/* Figma Build Specification & Design System Inspector Modal */}
      {figmaOpen && (
        <FigmaSpecViewer
          onClose={() => setFigmaOpen(false)}
          onOpenRider={() => {
            setFigmaOpen(false);
            setMode('rider');
            setRiderScreen('home');
          }}
          onOpenDriver={() => {
            setFigmaOpen(false);
            setMode('driver');
            setDriverScreen('home');
          }}
          onOpenOps={() => {
            setFigmaOpen(false);
            onOps();
          }}
        />
      )}

      <Toast visible={!!toast} message={toast} />
    </div>
  );
}
