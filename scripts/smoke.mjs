/**
 * Dev smoke test — server-renders every screen to catch runtime crashes.
 * Components are rendered directly (guards are trivial redirect logic).
 * Run: node scripts/smoke.mjs
 */
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React, { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';

const win = new Window({ url: 'http://localhost/' });
globalThis.window = win;
globalThis.document = win.document;
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true });
globalThis.localStorage = win.localStorage;

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

const screens = [
  // public
  ['Landing', '/src/features/landing/Landing.tsx', 'Landing'],
  ['Splash', '/src/features/auth/Splash.tsx', 'Splash'],
  ['Onboarding', '/src/features/auth/Onboarding.tsx', 'Onboarding'],
  ['Login', '/src/features/auth/Login.tsx', 'Login'],
  ['Signup', '/src/features/auth/Signup.tsx', 'Signup'],
  ['Otp', '/src/features/auth/Otp.tsx', 'Otp'],
  ['ForgotPassword', '/src/features/auth/ForgotPassword.tsx', 'ForgotPassword'],
  ['Kyc', '/src/features/auth/Kyc.tsx', 'Kyc'],
  ['RoleSelect', '/src/features/auth/RoleSelect.tsx', 'RoleSelect'],
  ['DriverOnboarding', '/src/features/auth/RoleSelect.tsx', 'DriverOnboarding'],
  // rider
  ['RiderHome', '/src/features/rider/Home.tsx', 'RiderHome'],
  ['Plan', '/src/features/rider/Plan.tsx', 'Plan'],
  ['Search', '/src/features/rider/Search.tsx', 'Search'],
  ['TripDetail', '/src/features/rider/TripDetail.tsx', 'TripDetail'],
  ['BookingFlow', '/src/features/rider/BookingFlow.tsx', 'BookingFlow'],
  ['Payment', '/src/features/rider/Payment.tsx', 'Payment'],
  ['Confirmation', '/src/features/rider/Confirmation.tsx', 'Confirmation'],
  ['TripScreen (upcoming)', '/src/features/rider/TripScreens.tsx', 'TripScreen'],
  ['TripScreen (at-risk)', '/src/features/rider/TripScreens.tsx', 'TripScreen'],
  ['AlternativeScreen', '/src/features/rider/TripScreens.tsx', 'AlternativeScreen'],
  ['Pickup', '/src/features/rider/Pickup.tsx', 'Pickup'],
  ['History', '/src/features/rider/History.tsx', 'History'],
  ['MyRoutes', '/src/features/rider/Routes.tsx', 'MyRoutes'],
  ['NewRoute', '/src/features/rider/Routes.tsx', 'NewRoute'],
  ['RouteDetailPage', '/src/features/rider/Routes.tsx', 'RouteDetailPage'],
  ['Account', '/src/features/rider/Account.tsx', 'Account'],
  ['PaymentMethods', '/src/features/rider/Account.tsx', 'PaymentMethods'],
  ['TrustedContacts', '/src/features/rider/Account.tsx', 'TrustedContacts'],
  ['SettingsPage', '/src/features/rider/Account.tsx', 'SettingsPage'],
  ['Safety', '/src/features/rider/Safety.tsx', 'Safety'],
  ['Notifications', '/src/features/rider/Notifications.tsx', 'Notifications'],
  ['Support', '/src/features/rider/Support.tsx', 'Support'],
  ['NewTicket', '/src/features/rider/Support.tsx', 'NewTicket'],
  ['TicketDetail', '/src/features/rider/Support.tsx', 'TicketDetail'],
  // driver
  ['DriverHome', '/src/features/driver/Home.tsx', 'DriverHome'],
  ['PublishCommute', '/src/features/driver/Publish.tsx', 'PublishCommute'],
  ['DriverRoutes', '/src/features/driver/Routes.tsx', 'DriverRoutes'],
  ['DriverRouteDetail', '/src/features/driver/Routes.tsx', 'DriverRouteDetail'],
  ['DriverTrips', '/src/features/driver/Trips.tsx', 'DriverTrips'],
  ['DriverTripDetail', '/src/features/driver/Trips.tsx', 'DriverTripDetail'],
  ['DriverReliability', '/src/features/driver/Reliability.tsx', 'DriverReliability'],
  ['DriverEarnings', '/src/features/driver/Reliability.tsx', 'DriverEarnings'],
  ['DriverAccount', '/src/features/driver/Reliability.tsx', 'DriverAccount'],
  // live trip
  ['ActiveTrip', '/src/features/rider/ActiveTrip.tsx', 'ActiveTrip'],
];

const entryFor = (label) =>
  label === 'TripScreen (upcoming)'
    ? ['/x/t_ikvi_0700']
    : label === 'TripScreen (at-risk)' || label === 'AlternativeScreen'
      ? ['/x/t_ikvi_0800']
      : label === 'DriverTripDetail' || label === 'ActiveTrip'
        ? ['/x/t_ikvi_0700']
        : label === 'DriverRouteDetail' || label === 'RouteDetailPage'
          ? ['/x/rt_ade_mf', '/x/rt_test_mf']
          : label === 'TicketDetail'
            ? ['/x/tk_1']
            : label === 'Search'
              ? ['/x?from=hub_ikorodu&to=hub_vi&date=2026-08-31&time=7:00%20AM']
              : ['/x'];

const allowEmpty = new Set(['Account', 'DriverAccount']); // gate on session: null render is intended

let failures = 0;
for (const [label, file, exportName] of screens) {
  try {
    const mod = await server.ssrLoadModule(file);
    const Comp = mod[exportName];
    const html = renderToString(createElement(MemoryRouter, { initialEntries: entryFor(label) }, createElement(Comp)));
    if (html.length === 0 && !allowEmpty.has(label)) { console.log('EMPTY', label); failures++; }
    else console.log('ok  ', label, `(${html.length}b)`);
  } catch (e) {
    failures++;
    console.log('FAIL', label, '->', String(e?.message ?? e).split('\n')[0].slice(0, 220));
  }
}
console.log(failures === 0 ? '\nALL SCREENS RENDERED' : `\n${failures} FAILURES`);
await server.close();
process.exit(failures === 0 ? 0 : 1);
