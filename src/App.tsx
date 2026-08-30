import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useComuta } from './store';
import { authService } from './services/authService';
import { AppLayout } from './layouts/AppLayout';
import { Splash } from './features/auth/Splash';
import { Onboarding } from './features/auth/Onboarding';
import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { Otp } from './features/auth/Otp';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { Kyc } from './features/auth/Kyc';
import { RoleSelect, DriverOnboarding } from './features/auth/RoleSelect';
import { Landing } from './features/landing/Landing';
import { RiderHome } from './features/rider/Home';
import { Plan } from './features/rider/Plan';
import { Search } from './features/rider/Search';
import { TripDetail } from './features/rider/TripDetail';
import { BookingFlow } from './features/rider/BookingFlow';
import { Payment } from './features/rider/Payment';
import { Confirmation } from './features/rider/Confirmation';
import { TripScreen, AlternativeScreen } from './features/rider/TripScreens';
import { Pickup } from './features/rider/Pickup';
import { History } from './features/rider/History';
import { MyRoutes, NewRoute, RouteDetailPage } from './features/rider/Routes';
import { Account, PaymentMethods, TrustedContacts, SettingsPage } from './features/rider/Account';
import { Safety } from './features/rider/Safety';
import { Notifications } from './features/rider/Notifications';
import { Support, NewTicket, TicketDetail } from './features/rider/Support';
import { DriverHome } from './features/driver/Home';
import { PublishCommute } from './features/driver/Publish';
import { DriverRoutes, DriverRouteDetail } from './features/driver/Routes';
import { DriverTrips, DriverTripDetail } from './features/driver/Trips';
import { DriverReliability, DriverEarnings, DriverAccount } from './features/driver/Reliability';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function Boot() {
  const session = useComuta((s) => s.session);
  // keep the demo calendar fresh across days
  useEffect(() => {
    authService.refresh();
  }, []);
  void session;
  return null;
}

/** Redirect /app to the correct role home. */
function AppEntry() {
  const session = useComuta((s) => s.session);
  if (!session) return <Navigate to="/login" replace />;
  return <Navigate to={session.role === 'driver' ? '/app/driver/home' : '/app/rider/home'} replace />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const session = useComuta((s) => s.session);
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireKyc({ children }: { children: React.ReactNode }) {
  const session = useComuta((s) => s.session);
  if (session && !session.kycComplete) return <Navigate to="/kyc" replace />;
  return <>{children}</>;
}

function RequireDriver({ children }: { children: React.ReactNode }) {
  const session = useComuta((s) => s.session);
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== 'driver' || !session.driverOnboarded) return <Navigate to="/driver/onboarding" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const session = useComuta((s) => s.session);
  if (session?.onboarded && session.kycComplete) {
    return <Navigate to={session.role === 'driver' ? '/app/driver/home' : '/app/rider/home'} replace />;
  }
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <>
      <Boot />
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
        <Route path="/verify" element={<Otp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset/new" element={<ForgotPassword />} />
        <Route path="/kyc" element={<RequireAuth><Kyc /></RequireAuth>} />
        <Route path="/role" element={<RequireAuth><RoleSelect /></RequireAuth>} />
        <Route path="/driver/onboarding" element={<RequireAuth><DriverOnboarding /></RequireAuth>} />

        {/* App entry */}
        <Route path="/app" element={<AppEntry />} />

        {/* Rider */}
        <Route
          path="/app/rider"
          element={
            <RequireAuth>
              <RequireKyc>
                <AppLayout mode="rider" context="Rider" />
              </RequireKyc>
            </RequireAuth>
          }
        >
          <Route index element={<RiderHome />} />
          <Route path="home" element={<RiderHome />} />
          <Route path="plan" element={<Plan />} />
          <Route path="search" element={<Search />} />
          <Route path="trip/:id" element={<TripScreen />} />
          <Route path="trip/:id/alt" element={<AlternativeScreen />} />
          <Route path="book/:id" element={<BookingFlow />} />
          <Route path="payment/:id" element={<Payment />} />
          <Route path="confirmation/:id" element={<Confirmation />} />
          <Route path="pickup/:id" element={<Pickup />} />
          <Route path="history" element={<History />} />
          <Route path="routes" element={<MyRoutes />} />
          <Route path="routes/new" element={<NewRoute />} />
          <Route path="routes/:id" element={<RouteDetailPage />} />
          <Route path="account" element={<Account />} />
          <Route path="account/payments" element={<PaymentMethods />} />
          <Route path="account/contacts" element={<TrustedContacts />} />
          <Route path="account/settings" element={<SettingsPage />} />
          <Route path="safety" element={<Safety />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="support/new" element={<NewTicket />} />
          <Route path="support/:id" element={<TicketDetail />} />
        </Route>

        {/* Driver */}
        <Route
          path="/app/driver"
          element={
            <RequireDriver>
              <AppLayout mode="driver" context="Driver" />
            </RequireDriver>
          }
        >
          <Route index element={<DriverHome />} />
          <Route path="home" element={<DriverHome />} />
          <Route path="routes" element={<DriverRoutes />} />
          <Route path="routes/new" element={<PublishCommute />} />
          <Route path="routes/:id" element={<DriverRouteDetail />} />
          <Route path="trips" element={<DriverTrips />} />
          <Route path="trips/:id" element={<DriverTripDetail />} />
          <Route path="reliability" element={<DriverReliability />} />
          <Route path="earnings" element={<DriverEarnings />} />
          <Route path="account" element={<DriverAccount />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
