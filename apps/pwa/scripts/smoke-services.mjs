/** Service-layer end-to-end check: auth → search → book → pay → confirm → refund. */
import { createServer } from 'vite';
import { Window } from 'happy-dom';
const win = new Window({ url: 'http://localhost/' });
globalThis.window = win; globalThis.document = win.document;
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true });
globalThis.localStorage = win.localStorage;
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { authService } = await server.ssrLoadModule('/src/services/authService.ts');
const { tripService } = await server.ssrLoadModule('/src/services/tripService.ts');
const { bookingService } = await server.ssrLoadModule('/src/services/bookingService.ts');
const { paymentService } = await server.ssrLoadModule('/src/services/paymentService.ts');
const { driverService } = await server.ssrLoadModule('/src/services/driverService.ts');
const { routeService } = await server.ssrLoadModule('/src/services/routeService.ts');
const { useComuta } = await server.ssrLoadModule('/src/store/index.ts');

let failures = 0;
const check = (label, cond) => { console.log(cond ? 'ok  ' : 'FAIL', label); if (!cond) failures++; };

// 1) login rider
const login = await authService.login('test@comuta.app', 'ComutaTest123!');
check('rider login', login.ok && login.session?.role === 'rider');
check('password rejected', !(await authService.login('test@comuta.app', 'wrong')).ok);
check('unknown account', !(await authService.login('nobody@x.com', 'x')).ok);

// 2) driver login
const dlogin = await authService.login('driver@comuta.app', 'ComutaTest123!');
check('driver login', dlogin.ok && dlogin.session?.role === 'driver');

// switch back to rider for booking
authService.switchMode('rider');

// 3) search trips for tomorrow Ikorodu → VI
const dates = await server.ssrLoadModule('/src/utils/dates.ts');
const tomorrow = dates.addDaysISO(1);
const results = await tripService.searchTrips({ fromId: 'hub_ikorodu', toId: 'hub_vi', date: tomorrow, time: '7:00 AM' });
check('search returns trips', results.length >= 3);
check('search excludes at-risk', !results.some((t) => t.status === 'at_risk'));

// 4) book a seat on a pending trip (t_ikvi_0730)
const trip = results.find((t) => t.id === 't_ikvi_0730');
const before = trip.seatsLeft;
const book = await bookingService.createBooking({ riderId: useComuta.getState().session.userId, tripId: trip.id, seats: 1, amount: trip.pricePerSeat });
check('booking created', book.ok && !!book.booking);
const after = useComuta.getState().trips.find((t) => t.id === trip.id).seatsLeft;
check('seats decremented', after === before - 1);

// 5) pay
const pay = await paymentService.pay({ bookingId: book.booking.id, riderId: useComuta.getState().session.userId, amount: book.booking.total, method: 'Paystack' });
check('payment successful', pay.ok && pay.payment?.status === 'successful');

// 6) upcoming includes the new booking
const upcoming = await tripService.getUpcomingTrips(useComuta.getState().session.userId);
check('upcoming contains new trip', upcoming.some((u) => u.booking.id === book.booking.id));

// 7) driver confirms a trip
const confirm = await driverService.confirmTrip('t_ikvi_0730', 'usr_ifeoma');
const t = useComuta.getState().trips.find((x) => x.id === 't_ikvi_0730');
check('driver confirmed', confirm.ok && t.driverConfirmed && t.status === 'confirmed');

// 8) driver passengers on tomorrow's 7AM
const pax = driverService.passengers('t_ikvi_0700');
check('driver sees 2 passengers', pax.length === 2 && pax[0].pin === '4827');

// 9) driver publishes a commute
const pub = await driverService.publishCommute({ driverId: 'usr_ade', fromId: 'hub_ikorodu', toId: 'hub_vi', pickupHubId: 'hub_ikorodu', date: tomorrow, time: '6:00 AM', seats: 4, pricePerSeat: 1500 });
check('publish commute', pub.ok && !!pub.trip);

// 10) cancel + refund
const cancel = await bookingService.cancelBooking(book.booking.id, useComuta.getState().session.userId);
check('cancel booking', cancel.ok);
check('seats restored', useComuta.getState().trips.find((x) => x.id === trip.id).seatsLeft === before);

// 11) create recurring route
const route = await routeService.createRoute({ ownerId: useComuta.getState().session.userId, fromId: 'hub_ikorodu', toId: 'hub_vi', days: [1,2,3,4,5], time: '7:00 AM', seats: 1, pricePerSeat: 1500 });
check('route created', route.ok && route.route?.id);

// 12) notification produced by booking
const ntf = useComuta.getState().notifications.find((n) => n.userId === 'usr_ifeoma' && n.kind === 'booking');
check('driver notified', !!ntf);

// 13) OTP + reset
const otp = await authService.verifyOtp('4827');
check('otp ok', otp.ok);
check('otp wrong', !(await authService.verifyOtp('0000')).ok);
const reset = await authService.setNewPassword('rider@comuta.app', 'NewPass123!');
check('password reset', reset.ok);
const relogin = await authService.login('rider@comuta.app', 'NewPass123!');
check('relogin with new password', relogin.ok);
await authService.setNewPassword('rider@comuta.app', 'ComutaTest123!');

console.log(failures === 0 ? '\nALL SERVICE CHECKS PASSED' : `\n${failures} FAILURES`);
await server.close();
process.exit(failures ? 1 : 0);
