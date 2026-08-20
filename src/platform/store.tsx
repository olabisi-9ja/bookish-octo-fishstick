import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { durationLabel } from './geo';
import { bookingTotals, driverSettlement, quoteRoute } from './pricing';
import { formatNaira, fullName, initialsOf, nid, normalizeNgPhone, pinCode } from './format';
import { scoreMatch } from './matching';
import { PLACES, placeById } from './places';
import { COMMUNITIES, createSeedState, DEMO_OTP, DEMO_PHONE, DEMO_USER_ID, STORAGE_KEY } from './seed';
import type {
  Booking,
  LedgerEntry,
  Member,
  PlatformState,
  RideCard,
  RideOffer,
  Role,
  SearchQuery,
  TripRating,
} from './types';

const SIMULATED_DRIVERS = new Set(['usr_ade', 'usr_ifeoma', 'usr_musa', 'usr_dami', 'usr_chidi', 'usr_seyi', 'usr_tolu']);

type PlatformApi = {
  state: PlatformState;
  me: Member | null;
  matchedRides: RideCard[];
  unreadCount: number;
  riderBookings: Booking[];
  driverRides: RideOffer[];
  pendingRequestCount: number;
  availableBalance: number;
  pendingBalance: number;
  login: (phone: string, otp: string) => { ok: boolean; isNew: boolean; message: string };
  completeProfile: (firstName: string, lastName: string, email?: string) => void;
  addEmergencyContact: (name: string, phone: string, relation: string) => void;
  logout: () => void;
  resetDemo: () => void;
  setRole: (role: Role) => void;
  completeDriverOnboarding: (input: { licenceNumber: string; make: string; model: string; color: string; plate: string; bankName: string; bankLast4: string }) => void;
  setSearch: (patch: Partial<SearchQuery>) => void;
  requestSeat: (rideId: string) => { ok: boolean; booking?: Booking; message: string };
  payBooking: (bookingId: string) => { ok: boolean; message: string };
  cancelBooking: (bookingId: string) => void;
  acceptRequest: (bookingId: string) => void;
  declineRequest: (bookingId: string) => void;
  publishRide: (input: { fromId: string; toId: string; pickupId: string; dropoffId: string; time: string; seats: number; price: number; recurring: boolean; days: number[]; when: RideOffer['when'] }) => RideOffer;
  startNavigation: (tripId: string) => void;
  verifyPin: (tripId: string, pin: string) => { ok: boolean; message: string };
  completeTrip: (tripId: string) => void;
  sendMessage: (tripId: string, text: string) => void;
  markNotificationsRead: () => void;
  triggerSos: (tripId: string, kind: 'unsafe' | 'sos' | 'report', note: string) => void;
  rateTrip: (tripId: string, stars: number, tags: string[], comment: string) => void;
  withdraw: (amount: number) => { ok: boolean; message: string };
  joinCommunity: (communityId: string) => void;
  verifyIdentity: () => void;
  toCard: (ride: RideOffer) => RideCard | null;
  memberById: (id: string) => Member | undefined;
  rideById: (id: string) => RideOffer | undefined;
  tripForRide: (rideId: string) => PlatformState['trips'][number] | undefined;
  bookingsForRide: (rideId: string) => Booking[];
  walletFor: (memberId: string) => { available: number; pending: number; entries: LedgerEntry[] };
};

const PlatformContext = createContext<PlatformApi | null>(null);

function loadState(): PlatformState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as PlatformState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.rides)) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

function memberOf(state: PlatformState, id: string) {
  return state.members.find((member) => member.id === id);
}

function vehicleOf(state: PlatformState, id: string) {
  return state.vehicles.find((vehicle) => vehicle.id === id);
}

function communityName(state: PlatformState, id?: string) {
  if (!id) return 'Open network';
  return state.communities.find((community) => community.id === id)?.name ?? 'Open network';
}

function makeCard(state: PlatformState, ride: RideOffer): RideCard | null {
  const driver = memberOf(state, ride.driverId);
  const vehicle = vehicleOf(state, ride.vehicleId);
  const from = placeById(ride.fromId);
  const to = placeById(ride.toId);
  const pickup = placeById(ride.pickupId);
  const dropoff = placeById(ride.dropoffId);
  const origin = placeById(state.search.fromId);
  const dest = placeById(state.search.toId);
  if (!driver || !vehicle) return null;
  const breakdown = scoreMatch(origin, dest, pickup, dropoff, from, to, ride, driver, state.search);
  return {
    id: ride.id,
    driverId: driver.id,
    driver: fullName(driver),
    initials: driver.initials,
    avatarColor: driver.avatarColor,
    photo: driver.photo,
    rating: driver.rating,
    trips: driver.trips,
    from: from.name,
    pickup: pickup.name,
    to: to.name,
    dropoff: dropoff.name,
    time: ride.time,
    eta: durationLabel(ride.durationMin),
    price: ride.price,
    seats: ride.seatsLeft,
    match: breakdown.total,
    breakdown,
    car: `${vehicle.make} ${vehicle.model} · ${vehicle.color}`,
    plate: vehicle.plate,
    community: communityName(state, ride.communityId),
    recurring: ride.recurring,
    durationMin: ride.durationMin,
    distanceKm: ride.distanceKm,
    verified: driver.verified,
  };
}

function notify(state: PlatformState, memberId: string, title: string, body: string, kind: PlatformState['notifications'][number]['kind']): PlatformState {
  return {
    ...state,
    notifications: [
      { id: nid('nt'), memberId, title, body, kind, read: false, at: new Date().toISOString() },
      ...state.notifications,
    ],
  };
}

function ledgerSum(entries: LedgerEntry[], memberId: string, status: LedgerEntry['status']) {
  return entries.filter((entry) => entry.memberId === memberId && entry.status === status).reduce((sum, entry) => sum + entry.amount, 0);
}

function confirmBooking(state: PlatformState, bookingId: string): PlatformState {
  const booking = state.bookings.find((item) => item.id === bookingId);
  if (!booking) return state;
  if (booking.status === 'paid' || booking.status === 'completed') return state;
  const ride = state.rides.find((item) => item.id === booking.rideId);
  if (!ride) return state;
  let trips = state.trips;
  let existing = trips.find((trip) => trip.rideId === ride.id);
  if (!existing) {
    existing = { id: nid('TRIP'), rideId: ride.id, status: 'scheduled', pin: booking.pin, etaMinutes: ride.durationMin, progress: 0 };
    trips = [existing, ...trips];
  }
  const next = {
    ...state,
    bookings: state.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'paid' as const } : item)),
    rides: state.rides.map((item) => (item.id === ride.id ? { ...item, seatsLeft: Math.max(0, item.seatsLeft - booking.seats) } : item)),
    trips,
  };
  const rider = memberOf(state, booking.riderId);
  return notify(
    notify(next, booking.riderId, 'Seat confirmed', `You're riding with ${fullName(memberOf(state, ride.driverId)!)}. PIN ${booking.pin}.`, 'booking'),
    ride.driverId,
    'Passenger confirmed',
    `${rider ? fullName(rider) : 'A rider'} paid for ${booking.seats} seat on ${ride.id}.`,
    'booking',
  );
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlatformState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => {
        let changed = false;
        const trips = current.trips.map((trip) => {
          if (trip.status === 'driver_en_route') {
            changed = true;
            const etaMinutes = Math.max(0, trip.etaMinutes - 1);
            const progress = Math.min(92, trip.progress + 8);
            if (etaMinutes === 0) return { ...trip, etaMinutes: 0, progress: 92, status: 'driver_arrived' as const };
            return { ...trip, etaMinutes, progress };
          }
          if (trip.status === 'in_progress' && trip.progress < 100) {
            changed = true;
            return { ...trip, progress: Math.min(100, trip.progress + 6) };
          }
          return trip;
        });
        return changed ? { ...current, trips } : current;
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const api = useMemo<PlatformApi>(() => {
    const me = state.session ? memberOf(state, state.session.memberId) ?? null : null;

    const matchedRides = state.rides
      .filter((ride) => ride.status === 'published' && ride.seatsLeft > 0 && ride.driverId !== me?.id)
      .map((ride) => makeCard(state, ride))
      .filter((card): card is RideCard => !!card)
      .filter((card) => card.match >= 32)
      .filter((card) => !state.search.verifiedOnly || card.verified)
      .filter((card) => !state.search.recurringOnly || card.recurring)
      .filter((card) => !state.search.communityOnly || (me && memberOf(state, card.driverId)?.communityIds.some((id) => me.communityIds.includes(id))))
      .sort((a, b) => {
        if (state.search.sort === 'price') return a.price - b.price;
        if (state.search.sort === 'time') return a.time.localeCompare(b.time);
        return b.match - a.match;
      });

    const riderBookings = me ? state.bookings.filter((booking) => booking.riderId === me.id) : [];
    const driverRides = me ? state.rides.filter((ride) => ride.driverId === me.id) : [];
    const pendingRequestCount = state.bookings.filter((booking) => booking.status === 'requested' && driverRides.some((ride) => ride.id === booking.rideId)).length;
    const unreadCount = me ? state.notifications.filter((item) => item.memberId === me.id && !item.read).length : 0;
    const availableBalance = me ? ledgerSum(state.ledger, me.id, 'completed') : 0;
    const pendingBalance = me ? ledgerSum(state.ledger, me.id, 'pending') : 0;

    const updateMe = (patch: Partial<Member>) => {
      if (!me) return;
      setState((current) => ({
        ...current,
        members: current.members.map((member) => (member.id === me.id ? { ...member, ...patch } : member)),
      }));
    };

    return {
      state,
      me,
      matchedRides,
      unreadCount,
      riderBookings,
      driverRides,
      pendingRequestCount,
      availableBalance,
      pendingBalance,
      memberById: (id) => memberOf(state, id),
      rideById: (id) => state.rides.find((ride) => ride.id === id),
      tripForRide: (rideId) => state.trips.find((trip) => trip.rideId === rideId),
      bookingsForRide: (rideId) => state.bookings.filter((booking) => booking.rideId === rideId),
      toCard: (ride) => makeCard(state, ride),
      walletFor: (memberId) => ({
        available: ledgerSum(state.ledger, memberId, 'completed'),
        pending: ledgerSum(state.ledger, memberId, 'pending'),
        entries: state.ledger.filter((entry) => entry.memberId === memberId),
      }),
      login: (phone, otp) => {
        const normalized = normalizeNgPhone(phone);
        if (normalized.length < 11) return { ok: false, isNew: false, message: 'Enter a valid Nigerian phone number.' };
        if (otp !== DEMO_OTP && otp !== '0000') return { ok: false, isNew: false, message: 'That code is incorrect. Use 4827 for this prototype.' };
        const existing = state.members.find((member) => normalizeNgPhone(member.phone) === normalized);
        if (existing) {
          setState((current) => ({
            ...current,
            session: {
              memberId: existing.id,
              role: 'rider',
              onboarded: true,
              driverOnboarded: existing.id === DEMO_USER_ID || !!existing.licenceNumber,
            },
          }));
          return { ok: true, isNew: false, message: `Welcome back, ${existing.firstName}.` };
        }
        const member: Member = {
          id: nid('usr'),
          firstName: '',
          lastName: '',
          phone: normalized,
          initials: 'PG',
          avatarColor: '#d87753',
          rating: 5,
          trips: 0,
          verified: false,
          communityIds: [],
          emergencyContacts: [],
          cardLast4: '2048',
        };
        setState((current) => ({
          ...current,
          members: [...current.members, member],
          session: { memberId: member.id, role: 'rider', onboarded: false, driverOnboarded: false },
        }));
        return { ok: true, isNew: true, message: 'Account created. Tell us your name.' };
      },
      completeProfile: (firstName, lastName, email) => {
        if (!me) return;
        updateMe({ firstName, lastName, email, initials: initialsOf(firstName, lastName) });
        setState((current) => ({ ...current, session: current.session ? { ...current.session, onboarded: current.session.onboarded } : current.session }));
      },
      addEmergencyContact: (name, phone, relation) => {
        if (!me) return;
        updateMe({ emergencyContacts: [...me.emergencyContacts, { name, phone, relation }] });
        setState((current) => ({ ...current, session: current.session ? { ...current.session, onboarded: true } : current.session }));
      },
      logout: () => setState((current) => ({ ...current, session: null })),
      resetDemo: () => {
        const fresh = createSeedState();
        localStorage.removeItem(STORAGE_KEY);
        setState(fresh);
      },
      setRole: (role) => setState((current) => ({ ...current, session: current.session ? { ...current.session, role } : current.session })),
      completeDriverOnboarding: (input) => {
        if (!me) return;
        const vehicleId = nid('veh');
        setState((current) => ({
          ...current,
          session: current.session ? { ...current.session, driverOnboarded: true, role: 'driver' } : current.session,
          members: current.members.map((member) =>
            member.id === me.id
              ? { ...member, licenceNumber: input.licenceNumber, bankName: input.bankName, bankLast4: input.bankLast4, verified: true }
              : member,
          ),
          vehicles: [
            ...current.vehicles.filter((vehicle) => vehicle.driverId !== me.id),
            { id: vehicleId, driverId: me.id, make: input.make, model: input.model, color: input.color, plate: input.plate, seats: 4, year: 2019 },
          ],
        }));
      },
      setSearch: (patch) => setState((current) => ({ ...current, search: { ...current.search, ...patch } })),
      requestSeat: (rideId) => {
        if (!me) return { ok: false, message: 'Sign in to request a seat.' };
        const ride = state.rides.find((item) => item.id === rideId);
        if (!ride) return { ok: false, message: 'That ride is no longer available.' };
        if (ride.seatsLeft < 1) return { ok: false, message: 'This ride is full.' };
        const existing = state.bookings.find((booking) => booking.rideId === rideId && booking.riderId === me.id && booking.status !== 'cancelled' && booking.status !== 'declined');
        if (existing) return { ok: false, booking: existing, message: 'You already have a booking on this ride.' };
        const totals = bookingTotals(ride.price);
        const booking: Booking = {
          id: nid('BKG'),
          rideId,
          riderId: me.id,
          seats: 1,
          ...totals,
          status: 'requested',
          pin: pinCode(),
          createdAt: new Date().toISOString(),
          ratedByRider: false,
          ratedByDriver: false,
        };
        setState((current) =>
          notify(
            { ...current, bookings: [booking, ...current.bookings] },
            ride.driverId,
            'New seat request',
            `${fullName(me)} requested a seat on ${ride.id}.`,
            'booking',
          ),
        );
        if (SIMULATED_DRIVERS.has(ride.driverId)) {
          window.setTimeout(() => {
            setState((current) => {
              const latest = current.bookings.find((item) => item.id === booking.id);
              if (!latest || latest.status === 'cancelled' || latest.status === 'declined') return current;
              return {
                ...current,
                bookings: current.bookings.map((item) => (item.id === booking.id ? { ...item, status: 'accepted' } : item)),
              };
            });
          }, 1400);
        }
        return { ok: true, booking, message: 'Request sent. Waiting for the driver.' };
      },
      payBooking: (bookingId) => {
        if (!me) return { ok: false, message: 'Sign in required.' };
        const booking = state.bookings.find((item) => item.id === bookingId);
        if (!booking) return { ok: false, message: 'Booking not found.' };
        if (booking.status === 'paid' || booking.status === 'completed') return { ok: true, message: 'This seat is already confirmed.' };
        const ride = state.rides.find((item) => item.id === booking.rideId);
        if (!ride) return { ok: false, message: 'Ride not found.' };
        const payment: LedgerEntry = {
          id: nid('led'),
          memberId: me.id,
          type: 'ride_payment',
          amount: -booking.total,
          status: 'completed',
          reference: booking.id,
          note: `Seat on ${ride.id}`,
          createdAt: new Date().toISOString(),
        };
        setState((current) => confirmBooking({ ...current, ledger: [payment, ...current.ledger] }, bookingId));
        return { ok: true, message: 'Payment held until the trip is completed.' };
      },
      cancelBooking: (bookingId) => {
        setState((current) => {
          const booking = current.bookings.find((item) => item.id === bookingId);
          if (!booking) return current;
          const ride = current.rides.find((item) => item.id === booking.rideId);
          const refund =
            booking.status === 'paid'
              ? {
                  id: nid('led'),
                  memberId: booking.riderId,
                  type: 'refund' as const,
                  amount: booking.total,
                  status: 'completed' as const,
                  reference: booking.id,
                  note: 'Cancellation refund',
                  createdAt: new Date().toISOString(),
                }
              : null;
          return notify(
            {
              ...current,
              bookings: current.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'cancelled' } : item)),
              rides:
                booking.status === 'paid' && ride
                  ? current.rides.map((item) => (item.id === ride.id ? { ...item, seatsLeft: item.seatsLeft + booking.seats } : item))
                  : current.rides,
              ledger: refund ? [refund, ...current.ledger] : current.ledger,
            },
            booking.riderId,
            'Booking cancelled',
            refund ? `${formatNaira(booking.total)} has been returned to you.` : 'Your seat request was cancelled.',
            'booking',
          );
        });
      },
      acceptRequest: (bookingId) => {
        setState((current) => {
          const booking = current.bookings.find((item) => item.id === bookingId);
          if (!booking) return current;
          return notify(
            {
              ...current,
              bookings: current.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'accepted' } : item)),
            },
            booking.riderId,
            'Request accepted',
            'Your seat was accepted. Complete payment to confirm.',
            'booking',
          );
        });
      },
      declineRequest: (bookingId) => {
        setState((current) => {
          const booking = current.bookings.find((item) => item.id === bookingId);
          if (!booking) return current;
          return notify(
            {
              ...current,
              bookings: current.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'declined' } : item)),
            },
            booking.riderId,
            'Request declined',
            'The driver declined this seat request.',
            'booking',
          );
        });
      },
      publishRide: (input) => {
        if (!me) throw new Error('Not signed in');
        const vehicle = state.vehicles.find((item) => item.driverId === me.id);
        const from = placeById(input.fromId);
        const to = placeById(input.toId);
        const quote = quoteRoute(from, to);
        const ride: RideOffer = {
          id: `PG${Math.floor(8000 + Math.random() * 1999)}`,
          driverId: me.id,
          vehicleId: vehicle?.id ?? 'veh_olabisi',
          fromId: input.fromId,
          toId: input.toId,
          pickupId: input.pickupId,
          dropoffId: input.dropoffId,
          time: input.time,
          durationMin: quote.durationMin,
          distanceKm: quote.distanceKm,
          price: input.price,
          seats: input.seats,
          seatsLeft: input.seats,
          recurring: input.recurring,
          days: input.days,
          communityId: me.communityIds[0],
          status: 'published',
          when: input.when,
        };
        setState((current) => notify({ ...current, rides: [ride, ...current.rides] }, me.id, 'Ride published', `${from.name} → ${to.name} is now live.`, 'system'));
        return ride;
      },
      startNavigation: (tripId) => {
        setState((current) => ({
          ...current,
          trips: current.trips.map((trip) =>
            trip.id === tripId ? { ...trip, status: 'driver_en_route', etaMinutes: Math.max(trip.etaMinutes, 8), progress: Math.max(trip.progress, 12), startedAt: new Date().toISOString() } : trip,
          ),
        }));
      },
      verifyPin: (tripId, pin) => {
        const trip = state.trips.find((item) => item.id === tripId);
        if (!trip) return { ok: false, message: 'Trip not found.' };
        if (pin.trim() !== trip.pin) return { ok: false, message: 'That PIN does not match.' };
        setState((current) => ({
          ...current,
          trips: current.trips.map((item) => (item.id === tripId ? { ...item, status: 'in_progress', progress: Math.max(item.progress, 20), startedAt: new Date().toISOString() } : item)),
        }));
        return { ok: true, message: 'PIN matched. Trip started.' };
      },
      completeTrip: (tripId) => {
        setState((current) => {
          const trip = current.trips.find((item) => item.id === tripId);
          if (!trip) return current;
          const ride = current.rides.find((item) => item.id === trip.rideId);
          const paid = current.bookings.filter((booking) => booking.rideId === trip.rideId && booking.status === 'paid');
          const settlements: LedgerEntry[] = [];
          if (ride) {
            for (const booking of paid) {
              const { commission, net } = driverSettlement(booking.amount);
              settlements.push({
                id: nid('led'),
                memberId: ride.driverId,
                type: 'settlement',
                amount: net,
                status: 'completed',
                reference: booking.id,
                note: `Seat settlement · ${ride.id}`,
                createdAt: new Date().toISOString(),
              });
              settlements.push({
                id: nid('led'),
                memberId: ride.driverId,
                type: 'commission',
                amount: -commission,
                status: 'completed',
                reference: booking.id,
                note: 'PadiGo service fee',
                createdAt: new Date().toISOString(),
              });
            }
          }
          return {
            ...current,
            trips: current.trips.map((item) => (item.id === tripId ? { ...item, status: 'completed', progress: 100, completedAt: new Date().toISOString() } : item)),
            bookings: current.bookings.map((booking) => (booking.rideId === trip.rideId && booking.status === 'paid' ? { ...booking, status: 'completed' } : booking)),
            rides: current.rides.map((item) => (item.id === trip.rideId ? { ...item, status: 'completed' } : item)),
            ledger: [...settlements, ...current.ledger],
            members: current.members.map((member) =>
              member.id === ride?.driverId || paid.some((booking) => booking.riderId === member.id)
                ? { ...member, trips: member.trips + 1 }
                : member,
            ),
          };
        });
      },
      sendMessage: (tripId, text) => {
        if (!me || !text.trim()) return;
        setState((current) => ({
          ...current,
          messages: [...current.messages, { id: nid('msg'), tripId, fromId: me.id, text: text.trim(), at: new Date().toISOString() }],
        }));
      },
      markNotificationsRead: () => {
        if (!me) return;
        setState((current) => ({
          ...current,
          notifications: current.notifications.map((item) => (item.memberId === me.id ? { ...item, read: true } : item)),
        }));
      },
      triggerSos: (tripId, kind, note) => {
        if (!me) return;
        setState((current) =>
          notify(
            {
              ...current,
              emergencies: [
                { id: nid('sos'), tripId, memberId: me.id, kind, note, at: new Date().toISOString(), status: 'open' },
                ...current.emergencies,
              ],
            },
            me.id,
            'Safety team alerted',
            'Live trip context was sent to PadiGo Safety and your emergency contact.',
            'safety',
          ),
        );
      },
      rateTrip: (tripId, stars, tags, comment) => {
        if (!me) return;
        const trip = state.trips.find((item) => item.id === tripId);
        if (!trip) return;
        const ride = state.rides.find((item) => item.id === trip.rideId);
        if (!ride) return;
        const toId = me.id === ride.driverId ? state.bookings.find((booking) => booking.rideId === ride.id)?.riderId ?? ride.driverId : ride.driverId;
        const rating: TripRating = { id: nid('rt'), tripId, fromId: me.id, toId, stars, tags, comment, at: new Date().toISOString() };
        setState((current) => ({
          ...current,
          ratings: [rating, ...current.ratings],
          bookings: current.bookings.map((booking) => {
            if (booking.rideId !== ride.id) return booking;
            if (booking.riderId === me.id) return { ...booking, ratedByRider: true };
            if (me.id === ride.driverId) return { ...booking, ratedByDriver: true };
            return booking;
          }),
        }));
      },
      withdraw: (amount) => {
        if (!me) return { ok: false, message: 'Sign in required.' };
        if (amount <= 0 || amount > availableBalance) return { ok: false, message: 'Not enough available balance.' };
        const entry: LedgerEntry = {
          id: nid('led'),
          memberId: me.id,
          type: 'withdrawal',
          amount: -amount,
          status: 'completed',
          reference: nid('OUT'),
          note: `Payout to ${me.bankName ?? 'your bank'} ·••${me.bankLast4 ?? '0000'}`,
          createdAt: new Date().toISOString(),
        };
        setState((current) => ({ ...current, ledger: [entry, ...current.ledger] }));
        return { ok: true, message: `${formatNaira(amount)} is on its way to your bank.` };
      },
      joinCommunity: (communityId) => {
        if (!me) return;
        if (me.communityIds.includes(communityId)) return;
        updateMe({ communityIds: [...me.communityIds, communityId] });
      },
      verifyIdentity: () => updateMe({ verified: true }),
    };
  }, [state]);

  return <PlatformContext.Provider value={api}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const value = useContext(PlatformContext);
  if (!value) throw new Error('usePlatform must be used inside PlatformProvider');
  return value;
}

export { COMMUNITIES, DEMO_OTP, DEMO_PHONE, DEMO_USER_ID, PLACES, placeById };
