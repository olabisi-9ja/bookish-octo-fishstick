/**
 * COMUTA mock data seed.
 * Deterministic local data that makes the PWA behave like a live backend.
 * Dates are generated relative to "today" so the demo stays fresh; the store
 * re-seeds the calendar when the device date changes.
 */
import type {
  AppNotification,
  AppState,
  Booking,
  DriverProfile,
  Hub,
  PayoutRecord,
  RecurringRoute,
  Trip,
  TrustedContact,
  User,
  Vehicle,
} from '../types';
import { todayISO, addDaysISO, nextWeekdayISO, toISODate } from '../utils/dates';
import { estimateDurationMin } from '../utils/geo';

const T = {
  test: 'usr_test',
  rider2: 'usr_rider2',
  driver: 'usr_ade',
  musa: 'usr_musa',
  ifeoma: 'usr_ifeoma',
  dami: 'usr_dami',
  amaka: 'usr_amaka',
  chidi: 'usr_chidi',
  tobi: 'usr_tobi',
};

export const HUB_IKORODU = 'hub_ikorodu';
export const HUB_VI = 'hub_vi';
export const HUB_LEKKI = 'hub_lekki';
export const HUB_AJAH = 'hub_ajah';
export const HUB_IKEJA = 'hub_ikeja';
export const HUB_YABA = 'hub_yaba';

export const HUBS: Hub[] = [
  { id: HUB_IKORODU, name: 'Ikorodu Hub', area: 'Ikorodu', city: 'Lagos', lat: 6.6194, lng: 3.5105, address: 'Main Gate, Ikorodu Road', safetyNote: 'Well-lit, staffed pickup point under camera coverage.' },
  { id: HUB_VI, name: 'Victoria Island Hub', area: 'Victoria Island', city: 'Lagos', lat: 6.435, lng: 3.425, address: 'Ozumba Mbadiwe Avenue', safetyNote: 'Security desk and waiting area beside the main gate.' },
  { id: HUB_LEKKI, name: 'Lekki Phase 1 Hub', area: 'Lekki', city: 'Lagos', lat: 6.4474, lng: 3.4722, address: 'Admiralty Way, Lekki Phase 1', safetyNote: 'Covered shelter with CCTV at the roundabout.' },
  { id: HUB_AJAH, name: 'Ajah Hub', area: 'Ajah', city: 'Lagos', lat: 6.4515, lng: 3.575, address: 'Abraham Adesanya Estate Gate', safetyNote: 'Estate security at the gate and parking bay.' },
  { id: HUB_IKEJA, name: 'Ikeja Hub', area: 'Ikeja', city: 'Lagos', lat: 6.6018, lng: 3.3515, address: 'Allen Avenue, by the bus stop', safetyNote: 'Busy commercial area, uniformed marshal on duty.' },
  { id: HUB_YABA, name: 'Yaba Hub', area: 'Yaba', city: 'Lagos', lat: 6.5095, lng: 3.371, address: 'Herbert Macaulay Way', safetyNote: 'Monitored bay opposite the tech cluster.' },
  { id: 'hub_chevron', name: 'Chevron Hub', area: 'Lekki', city: 'Lagos', lat: 6.4412, lng: 3.536, address: 'Chevron Estate Gate', safetyNote: 'Estate security desk at the main gate.' },
  { id: 'hub_oniru', name: 'Oniru Hub', area: 'Victoria Island', city: 'Lagos', lat: 6.434, lng: 3.44, address: 'Oniru Market Junction', safetyNote: 'Staffed shelter next to the market.' },
  { id: 'hub_sangotedo', name: 'Sangotedo Hub', area: 'Sangotedo', city: 'Lagos', lat: 6.4642, lng: 3.5579, address: 'Novare Mall, Sangotedo', safetyNote: 'Mall security and pickup lane.' },
];

export const TEST_USERS: User[] = [
  { id: T.test, firstName: 'Oluwaseun', lastName: 'Adeyemi', email: 'test@comuta.app', phone: '08031112841', password: 'ComutaTest123!', role: 'rider', verificationStatus: 'verified', idType: 'NIN', photoInitials: 'OA', avatarColor: '#155942', createdAt: '2026-06-01T08:00:00Z' },
  { id: T.rider2, firstName: 'Chiamaka', lastName: 'Obi', email: 'rider@comuta.app', phone: '08051234021', password: 'ComutaTest123!', role: 'rider', verificationStatus: 'verified', idType: 'NIN', photoInitials: 'CO', avatarColor: '#1e7386', createdAt: '2026-06-03T10:00:00Z' },
  { id: T.driver, firstName: 'Adebayo', lastName: 'Kolawole', email: 'driver@comuta.app', phone: '08024411182', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'AK', avatarColor: '#2b6e4f', createdAt: '2026-05-20T09:00:00Z' },
  { id: T.musa, firstName: 'Musa', lastName: 'Lawal', email: 'musa.lawal@comuta.app', phone: '07062391104', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'ML', avatarColor: '#1d6e53', createdAt: '2026-05-18T09:00:00Z' },
  { id: T.ifeoma, firstName: 'Ifeoma', lastName: 'Nwosu', email: 'ifeoma.nwosu@comuta.app', phone: '08132209041', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'IN', avatarColor: '#3d5f8a', createdAt: '2026-05-22T09:00:00Z' },
  { id: T.dami, firstName: 'Damilola', lastName: 'James', email: 'damilola.james@comuta.app', phone: '08093324410', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'DJ', avatarColor: '#7a5c1f', createdAt: '2026-05-25T09:00:00Z' },
  { id: T.amaka, firstName: 'Amaka', lastName: 'Eze', email: 'amaka.eze@comuta.app', phone: '08051182293', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'AE', avatarColor: '#23626d', createdAt: '2026-05-28T09:00:00Z' },
  { id: T.chidi, firstName: 'Chidi', lastName: 'Okafor', email: 'chidi.okafor@comuta.app', phone: '08126673901', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'CO', avatarColor: '#5c7186', createdAt: '2026-06-02T09:00:00Z' },
  { id: T.tobi, firstName: 'Tobi', lastName: 'Nwankwo', email: 'tobi.nwankwo@comuta.app', phone: '08126673990', password: 'ComutaTest123!', role: 'driver', verificationStatus: 'verified', idType: "Driver's licence", photoInitials: 'TN', avatarColor: '#8a5a2b', createdAt: '2026-06-04T09:00:00Z' },
];

export const VEHICLES: Vehicle[] = [
  { id: 'veh_ade', ownerId: T.driver, make: 'Toyota', model: 'Corolla', color: 'Silver', plate: 'ABC 123 XY', seats: 4, year: 2019 },
  { id: 'veh_musa', ownerId: T.musa, make: 'Toyota', model: 'Camry', color: 'Black', plate: 'KJA 204 XT', seats: 4, year: 2018 },
  { id: 'veh_ifeoma', ownerId: T.ifeoma, make: 'Honda', model: 'Accord', color: 'White', plate: 'LND 882 QR', seats: 4, year: 2020 },
  { id: 'veh_dami', ownerId: T.dami, make: 'Toyota', model: 'Sienna', color: 'Grey', plate: 'AAA 104 YZ', seats: 6, year: 2021 },
  { id: 'veh_amaka', ownerId: T.amaka, make: 'Hyundai', model: 'Elantra', color: 'Blue', plate: 'KTU 778 MJ', seats: 4, year: 2019 },
  { id: 'veh_chidi', ownerId: T.chidi, make: 'Toyota', model: 'Corolla', color: 'Red', plate: 'EKY 229 PL', seats: 4, year: 2017 },
  { id: 'veh_tobi', ownerId: T.tobi, make: 'Kia', model: 'Rio', color: 'Silver', plate: 'FKJ 556 NB', seats: 4, year: 2018 },
];

export const DRIVER_PROFILES: Record<string, DriverProfile> = {
  [T.driver]: { userId: T.driver, licenceNumber: 'LAG-20491832', vehicleId: 'veh_ade', completedTrips: 214, completionRate: 98, onTimeRate: 97, lateCancellations: 1, noShows: 0, monthlyTrips: 12, monthlyPassengers: 31, monthlyRecovered: 18500 },
  [T.musa]: { userId: T.musa, licenceNumber: 'LAG-11820344', vehicleId: 'veh_musa', completedTrips: 168, completionRate: 99, onTimeRate: 98, lateCancellations: 0, noShows: 0, monthlyTrips: 10, monthlyPassengers: 26, monthlyRecovered: 14200 },
  [T.ifeoma]: { userId: T.ifeoma, licenceNumber: 'LAG-90331120', vehicleId: 'veh_ifeoma', completedTrips: 142, completionRate: 97, onTimeRate: 96, lateCancellations: 2, noShows: 1, monthlyTrips: 9, monthlyPassengers: 22, monthlyRecovered: 12800 },
  [T.dami]: { userId: T.dami, licenceNumber: 'LAG-22110984', vehicleId: 'veh_dami', completedTrips: 89, completionRate: 96, onTimeRate: 95, lateCancellations: 1, noShows: 1, monthlyTrips: 7, monthlyPassengers: 30, monthlyRecovered: 11900 },
  [T.amaka]: { userId: T.amaka, licenceNumber: 'LAG-77341022', vehicleId: 'veh_amaka', completedTrips: 121, completionRate: 98, onTimeRate: 97, lateCancellations: 0, noShows: 0, monthlyTrips: 11, monthlyPassengers: 28, monthlyRecovered: 15600 },
  [T.chidi]: { userId: T.chidi, licenceNumber: 'LAG-55883311', vehicleId: 'veh_chidi', completedTrips: 64, completionRate: 97, onTimeRate: 96, lateCancellations: 1, noShows: 0, monthlyTrips: 8, monthlyPassengers: 19, monthlyRecovered: 9600 },
  [T.tobi]: { userId: T.tobi, licenceNumber: 'LAG-11024455', vehicleId: 'veh_tobi', completedTrips: 41, completionRate: 99, onTimeRate: 98, lateCancellations: 0, noShows: 0, monthlyTrips: 6, monthlyPassengers: 14, monthlyRecovered: 7800 },
};

function makeTrip(
  id: string,
  driverId: string,
  fromId: string,
  toId: string,
  pickupHubId: string,
  date: string,
  departureTime: string,
  seatsTotal: number,
  pricePerSeat: number,
  status: Trip['status'],
  driverConfirmed: boolean,
  seatsLeft: number,
  routeId?: string,
  pin = '4827',
): Trip {
  const distanceKm = estimateDistance(fromId, toId);
  const durationMin = estimateDurationMin(distanceKm);
  return {
    id,
    routeId,
    driverId,
    fromId,
    toId,
    pickupHubId,
    date,
    departureTime,
    arrivalTime: addMinutes(departureTime, durationMin),
    durationMin,
    distanceKm: Math.round(distanceKm * 10) / 10,
    pricePerSeat,
    seatsTotal,
    seatsLeft,
    driverConfirmed,
    status,
    pin,
    createdAt: new Date().toISOString(),
  };
}

function addMinutes(clock: string, extra: number) {
  const [h, m] = parseClock(clock);
  let total = h * 60 + m + extra;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h12 = Math.floor(total / 60) % 12 || 12;
  const suffix = Math.floor(total / 60) >= 12 ? 'PM' : 'AM';
  return `${h12}:${String(total % 60).padStart(2, '0')} ${suffix}`;
}

function parseClock(label: string): [number, number] {
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)!;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return [hours, Number(match[2])];
}

function estimateDistance(fromId: string, toId: string) {
  const a = HUBS.find((h) => h.id === fromId)!;
  const b = HUBS.find((h) => h.id === toId)!;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s))) * 1.18; // road factor
}

export function buildSeed(now = new Date()): AppState {
  const today = toISODate(now);
  const tomorrow = addDaysISO(1);
  const dayAfter = addDaysISO(2);
  const yesterday = addDaysISO(-1);
  const mon = nextWeekdayISO(1, 3); // next Monday at least 3 days ahead

  const priceIKVI = 1500;
  const priceAJVI = 1350;
  const priceLEKVI = 900;
  const priceIKEVI = 1600;

  // ---- Available trips (search results) ----
  const trips: Trip[] = [
    // Tomorrow: Ikorodu → VI corridor
    makeTrip('t_ikvi_0630', T.musa, HUB_IKORODU, HUB_VI, HUB_IKORODU, tomorrow, '6:30 AM', 4, priceIKVI, 'confirmed', true, 3),
    makeTrip('t_ikvi_0700', T.driver, HUB_IKORODU, HUB_VI, HUB_IKORODU, tomorrow, '7:00 AM', 4, priceIKVI, 'confirmed', true, 2, 'rt_ade_mf', '4827'),
    makeTrip('t_ikvi_0730', T.ifeoma, HUB_IKORODU, HUB_VI, HUB_IKORODU, tomorrow, '7:30 AM', 3, 1400, 'confirmation_pending', false, 3),
    makeTrip('t_ikvi_0800', T.dami, HUB_IKORODU, HUB_VI, HUB_IKORODU, tomorrow, '8:00 AM', 3, 1300, 'at_risk', false, 1),
    makeTrip('t_ikvi_1700', T.driver, HUB_VI, HUB_IKORODU, HUB_VI, tomorrow, '5:00 PM', 4, priceIKVI, 'confirmation_pending', false, 4, 'rt_ade_eve'),
    // Day after: same corridor
    makeTrip('t_ikvi_0700_d2', T.driver, HUB_IKORODU, HUB_VI, HUB_IKORODU, dayAfter, '7:00 AM', 4, priceIKVI, 'scheduled', false, 4, 'rt_ade_mf'),
    makeTrip('t_ikvi_0645_d2', T.musa, HUB_IKORODU, HUB_VI, HUB_IKORODU, dayAfter, '6:45 AM', 4, priceIKVI, 'scheduled', false, 4),
    // Next Monday recurring
    makeTrip('t_ikvi_0700_mon', T.driver, HUB_IKORODU, HUB_VI, HUB_IKORODU, mon, '7:00 AM', 4, priceIKVI, 'scheduled', false, 4, 'rt_ade_mf'),
    // Ajah → VI
    makeTrip('t_ajvi_0700', T.amaka, HUB_AJAH, HUB_VI, HUB_AJAH, tomorrow, '7:00 AM', 4, priceAJVI, 'confirmed', true, 3),
    makeTrip('t_ajvi_0745', T.chidi, HUB_AJAH, HUB_VI, HUB_AJAH, tomorrow, '7:45 AM', 3, 1300, 'confirmation_pending', false, 2),
    // Lekki → VI
    makeTrip('t_lekvi_0715', T.tobi, HUB_LEKKI, HUB_VI, HUB_LEKKI, tomorrow, '7:15 AM', 4, priceLEKVI, 'confirmation_pending', false, 3),
    makeTrip('t_lekvi_0800', T.chidi, HUB_LEKKI, HUB_VI, HUB_LEKKI, tomorrow, '8:00 AM', 4, priceLEKVI, 'scheduled', false, 4),
    // Ikeja → VI
    makeTrip('t_ikevi_0630', T.ifeoma, HUB_IKEJA, HUB_VI, HUB_IKEJA, tomorrow, '6:30 AM', 4, priceIKEVI, 'confirmed', true, 2),
    makeTrip('t_ikevi_0700', T.musa, HUB_IKEJA, HUB_VI, HUB_IKEJA, tomorrow, '7:00 AM', 4, priceIKEVI, 'confirmation_pending', false, 4),
    // Yesterday completed (history)
    makeTrip('t_ikvi_done', T.driver, HUB_IKORODU, HUB_VI, HUB_IKORODU, yesterday, '7:00 AM', 4, priceIKVI, 'completed', true, 2, 'rt_ade_mf'),
    makeTrip('t_ajvi_done', T.amaka, HUB_AJAH, HUB_VI, HUB_AJAH, yesterday, '7:00 AM', 4, priceAJVI, 'completed', true, 1),
    // A cancelled trip in history
    makeTrip('t_ikvi_cancelled', T.ifeoma, HUB_IKORODU, HUB_VI, HUB_IKORODU, addDaysISO(-3), '7:30 AM', 3, 1400, 'cancelled', false, 0),
  ];

  const day = 24 * 60 * 60 * 1000;
  const at = (offsetDays: number, hour: number, min = 0) =>
    new Date(Date.now() - offsetDays * day - (new Date().getHours() * 60 + new Date().getMinutes() - hour * 60 - min) * 60 * 1000).toISOString();

  // ---- Bookings ----
  const bookings: Booking[] = [
    // Primary test rider  -  next commute, confirmed
    { id: 'b_next', tripId: 't_ikvi_0700', riderId: T.test, seats: 1, amount: priceIKVI, total: priceIKVI, paymentStatus: 'successful', status: 'confirmed', pin: '4827', createdAt: at(1, 18) },
    // Rider2 also on the same trip (so the driver sees 2 passengers)
    { id: 'b_next2', tripId: 't_ikvi_0700', riderId: T.rider2, seats: 1, amount: priceIKVI, total: priceIKVI, paymentStatus: 'successful', status: 'confirmed', pin: '4827', createdAt: at(1, 19) },
    // Rider2 on the at-risk trip
    { id: 'b_atrisk', tripId: 't_ikvi_0800', riderId: T.rider2, seats: 1, amount: 1300, total: 1300, paymentStatus: 'successful', status: 'confirmed', pin: '4827', createdAt: at(1, 20) },
    // Primary test rider on the at-risk trip too (demo of the recovery flow)
    { id: 'b_atrisk_test', tripId: 't_ikvi_0800', riderId: T.test, seats: 1, amount: 1300, total: 1300, paymentStatus: 'successful', status: 'confirmed', pin: '4827', createdAt: at(1, 20, 30) },
    // Primary test rider  -  pending confirmation trip on Lekki corridor
    { id: 'b_lekki', tripId: 't_lekvi_0715', riderId: T.test, seats: 1, amount: priceLEKVI, total: priceLEKVI, paymentStatus: 'successful', status: 'confirmed', pin: '4827', createdAt: at(1, 21) },
    // History  -  completed yesterday (rated)
    { id: 'b_done', tripId: 't_ikvi_done', riderId: T.test, seats: 1, amount: priceIKVI, total: priceIKVI, paymentStatus: 'successful', status: 'completed', pin: '4827', rated: true, rating: 5, ratingComment: 'Smooth, on time as always.', createdAt: at(2, 18) },
    // History  -  completed (unrated, for driver rating)
    { id: 'b_done2', tripId: 't_ajvi_done', riderId: T.test, seats: 1, amount: priceAJVI, total: priceAJVI, paymentStatus: 'successful', status: 'completed', pin: '4827', createdAt: at(3, 18) },
    // History  -  cancelled with refund
    { id: 'b_cancelled', tripId: 't_ikvi_cancelled', riderId: T.test, seats: 1, amount: 1400, total: 1400, paymentStatus: 'refunded', status: 'cancelled', pin: '4827', refundRequested: true, createdAt: at(4, 12) },
  ];

  // ---- Recurring routes ----
  const routes: RecurringRoute[] = [
    { id: 'rt_test_mf', ownerId: T.test, fromId: HUB_IKORODU, toId: HUB_VI, days: [1, 2, 3, 4, 5], time: '7:00 AM', recurring: true, seats: 1, pricePerSeat: priceIKVI, active: true, paused: false, createdAt: at(20, 9) },
    { id: 'rt_test_sat', ownerId: T.test, fromId: HUB_LEKKI, toId: HUB_VI, days: [6], time: '9:00 AM', recurring: true, seats: 1, pricePerSeat: priceLEKVI, active: true, paused: true, createdAt: at(15, 9) },
    { id: 'rt_ade_mf', ownerId: T.driver, fromId: HUB_IKORODU, toId: HUB_VI, days: [1, 2, 3, 4, 5], time: '7:00 AM', recurring: true, seats: 4, pricePerSeat: priceIKVI, active: true, paused: false, createdAt: at(40, 9) },
    { id: 'rt_ade_eve', ownerId: T.driver, fromId: HUB_VI, toId: HUB_IKORODU, days: [1, 2, 3, 4, 5], time: '5:00 PM', recurring: true, seats: 4, pricePerSeat: priceIKVI, active: true, paused: false, createdAt: at(38, 9) },
    { id: 'rt_musa', ownerId: T.musa, fromId: HUB_IKEJA, toId: HUB_VI, days: [1, 2, 3, 4, 5], time: '7:00 AM', recurring: true, seats: 4, pricePerSeat: priceIKEVI, active: true, paused: false, createdAt: at(30, 9) },
  ];

  // ---- Notifications ----
  const notifications: AppNotification[] = [
    { id: 'ntf_1', userId: T.test, title: 'Your driver confirmed tomorrow’s trip', body: 'Adebayo K. confirmed your Ikorodu → Victoria Island commute for tomorrow at 7:00 AM.', kind: 'trip', read: false, at: at(0, 9, 30) },
    { id: 'ntf_2', userId: T.test, title: 'Payment successful', body: 'You paid ₦1,500 for one seat on tomorrow’s commute. Your seat is secured.', kind: 'payment', read: false, at: at(1, 18, 5) },
    { id: 'ntf_3', userId: T.test, title: 'Booking confirmed', body: 'Your Ikorodu → Victoria Island trip is booked. We’ll let you know as soon as your driver confirms.', kind: 'booking', read: true, at: at(1, 18, 4) },
    { id: 'ntf_4', userId: T.driver, title: '2 riders booked your commute', body: 'Your 7:00 AM Ikorodu → Victoria Island trip tomorrow has 2 confirmed passengers.', kind: 'trip', read: false, at: at(1, 19, 10) },
    { id: 'ntf_5', userId: T.driver, title: 'Confirm by 11:00 PM', body: 'Confirm tomorrow’s commute before 11:00 PM so your passengers can plan.', kind: 'trip', read: false, at: at(0, 8, 0) },
  ];

  const trustedContacts: TrustedContact[] = [
    { id: 'tc_1', name: 'Funmi Adeyemi', phone: '0805 441 2290', relation: 'Mother' },
    { id: 'tc_2', name: 'Tunde Adeyemi', phone: '0812 334 5567', relation: 'Brother' },
    { id: 'tc_3', name: 'Ngozi Obi', phone: '0903 221 8876', relation: 'Friend' },
  ];

  const payouts: PayoutRecord[] = [
    { id: 'po_1', driverId: T.driver, amount: 13650, status: 'pending', method: 'Access Bank •••• 4412', note: 'Settlement, 12 shared trips (August)', createdAt: at(0, 7, 0) },
    { id: 'po_2', driverId: T.driver, amount: 12400, status: 'completed', method: 'Access Bank •••• 4412', note: 'Settlement, 11 shared trips (July)', createdAt: at(31, 7, 0) },
    { id: 'po_3', driverId: T.driver, amount: 10850, status: 'completed', method: 'Access Bank •••• 4412', note: 'Settlement, 9 shared trips (June)', createdAt: at(61, 7, 0) },
  ];

  return {
    seededDay: today,
    // The app starts logged out  -  the tester signs in with the seeded accounts.
    session: null,
    users: TEST_USERS,
    vehicles: VEHICLES,
    driverProfiles: DRIVER_PROFILES,
    hubs: HUBS,
    trips,
    bookings,
    payments: [],
    routes,
    notifications,
    incidents: [],
    tickets: [
      {
        id: 'tk_1',
        userId: T.test,
        subject: 'Change pickup hub',
        description: 'I would like to be picked up at the Oniru Hub instead for next week.',
        tripRef: 't_ikvi_0700',
        status: 'resolved',
        createdAt: at(6, 12),
        messages: [
          { id: 'm1', from: 'user', text: 'I would like to be picked up at the Oniru Hub instead for next week.', at: at(6, 12) },
          { id: 'm2', from: 'support', text: 'Thanks, Oluwaseun. Your driver has been notified and your pickup point is updated for next week’s trips.', at: at(6, 13) },
        ],
      },
    ],
    trustedContacts,
    payouts,
    settings: { language: 'English', appearance: 'light', pushNotifications: true, emailNotifications: true, shareTripDefault: true },
  };
}

/** Shift scheduled trip dates forward when the device day changes. */
export function shiftSeedDates(state: AppState): AppState {
  const today = todayISO();
  if (state.seededDay === today) return state;
  const from = new Date(state.seededDay + 'T00:00:00');
  const to = new Date(today + 'T00:00:00');
  const deltaDays = Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
  if (!Number.isFinite(deltaDays) || deltaDays <= 0) return { ...state, seededDay: today };
  const keep = new Set(['completed', 'cancelled']);
  const trips = state.trips.map((t) => {
    if (keep.has(t.status)) return t;
    const d = new Date(t.date + 'T00:00:00');
    d.setDate(d.getDate() + deltaDays);
    return { ...t, date: todayISOFromDate(d) };
  });
  return { ...state, seededDay: today, trips };
}

function todayISOFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
