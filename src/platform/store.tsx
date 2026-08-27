import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { durationLabel } from './geo';
import { bookingTotals, driverSettlement, quoteRoute } from './pricing';
import { formatNaira, fullName, initialsOf, nid, normalizeNgPhone, pinCode } from './format';
import { scoreMatch } from './matching';
import { PLACES, placeById, hubById } from './places';
import { COMMUNITIES, createSeedState, DEMO_OTP, DEMO_PHONE, DEMO_USER_ID, STORAGE_KEY } from './seed';
import type {
  AtRiskIntervention,
  Booking,
  LedgerEntry,
  Member,
  PlatformState,
  RecurringSchedule,
  RideCard,
  RideOffer,
  Role,
  SearchQuery,
  TripRating,
} from './types';

export function formatArrivalEta(timeStr: string, durationMin: number): string {
  try {
    const parts = timeStr.trim().split(/\s+/);
    const clock = parts[0];
    const meridiem = parts[1] || 'AM';
    const [hStr, mStr] = clock.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (meridiem.toUpperCase() === 'PM' && h < 12) h += 12;
    if (meridiem.toUpperCase() === 'AM' && h === 12) h = 0;
    const totalMinutes = h * 60 + m + durationMin;
    const endH24 = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const endMeridiem = endH24 >= 12 ? 'PM' : 'AM';
    const endH12 = endH24 % 12 === 0 ? 12 : endH24 % 12;
    return `~${endH12}:${endM.toString().padStart(2, '0')} ${endMeridiem}`;
  } catch {
    return `~${durationMin} min`;
  }
}

export function formatDurationText(durationMin: number): string {
  const h = Math.floor(durationMin / 60);
  const m = durationMin % 60;
  if (h > 0 && m > 0) return `~${h} hr ${m} min`;
  if (h > 0) return `~${h} hr`;
  return `~${m} min`;
}

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
  confirmDriverCommitment: (rideId: string) => void;
  cancelDriverCommitment: (rideId: string, reason: string) => void;
  acceptAlternativeBooking: (bookingId: string, newRideId: string) => void;
  requestRefund: (bookingId: string) => void;
  manageRecurringSchedule: (scheduleId: string, action: 'skip_tomorrow' | 'pause' | 'resume') => void;
  resolveAtRiskIntervention: (id: string, action: 'recover' | 'refund') => void;
  triggerAtRiskDemo: () => void;
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
    if (parsed?.version !== 1 || !Array.isArray(parsed.rides) || !Array.isArray(parsed.recurringCommutes)) return createSeedState();
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
  if (!id) return 'Ikorodu Island Commuters';
  return state.communities.find((community) => community.id === id)?.name ?? 'Ikorodu Island Commuters';
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
  const arrivalEta = formatArrivalEta(ride.time, ride.durationMin);
  return {
    id: ride.id,
    driverId: driver.id,
    driver: `${driver.firstName} ${driver.lastName}`,
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
    eta: arrivalEta,
    price: ride.price,
    seats: ride.seatsLeft,
    match: breakdown.total,
    breakdown,
    car: `${vehicle.make} ${vehicle.model}`,
    plate: vehicle.plate,
    color: vehicle.color,
    community: communityName(state, ride.communityId),
    recurring: ride.recurring,
    durationMin: ride.durationMin,
    distanceKm: ride.distanceKm,
    verified: driver.verified,
    completionRate: driver.driverReliability?.completionRate ?? 98,
    onTimeRate: driver.driverReliability?.onTimeRate ?? 97,
    pickupHub: pickup.name,
    pickupGate: pickup.hubGate ?? 'Main Gate · Well-lit pickup point',
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
  if (booking.status === 'confirmed' || booking.status === 'completed') return state;
  const ride = state.rides.find((item) => item.id === booking.rideId);
  if (!ride) return state;
  let trips = state.trips;
  let existing = trips.find((trip) => trip.rideId === ride.id);
  if (!existing) {
    existing = {
      id: nid('TRIP'),
      rideId: ride.id,
      status: 'driver_confirmed',
      pin: booking.pin,
      etaMinutes: ride.durationMin,
      progress: 0,
      driverConfirmed: true,
    };
    trips = [existing, ...trips];
  }
  const next = {
    ...state,
    bookings: state.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'confirmed' as const } : item)),
    rides: state.rides.map((item) => (item.id === ride.id ? { ...item, seatsLeft: Math.max(0, item.seatsLeft - booking.seats) } : item)),
    trips,
  };
  const rider = memberOf(state, booking.riderId);
  return notify(
    notify(next, booking.riderId, 'Seat Confirmed', `You're commuting with ${fullName(memberOf(state, ride.driverId)!)}. PIN ${booking.pin}.`, 'booking'),
    ride.driverId,
    'Passenger Confirmed',
    `${rider ? fullName(rider) : 'A commuter'} reserved 1 seat on your ${ride.time} commute.`,
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
            const progress = Math.min(92, trip.progress + 6);
            if (etaMinutes === 0) return { ...trip, etaMinutes: 0, progress: 92, status: 'driver_arrived' as const };
            return { ...trip, etaMinutes, progress };
          }
          if (trip.status === 'in_progress' && trip.progress < 100) {
            changed = true;
            return { ...trip, progress: Math.min(100, trip.progress + 4) };
          }
          return trip;
        });
        return changed ? { ...current, trips } : current;
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const me = useMemo(() => {
    if (!state.session) return null;
    return memberOf(state, state.session.memberId) ?? null;
  }, [state.session, state.members]);

  const matchedRides = useMemo(() => {
    const rides = state.rides
      .filter((ride) => ride.status === 'published' && (ride.driverId !== me?.id || !me))
      .map((ride) => makeCard(state, ride))
      .filter((card): card is RideCard => card !== null);

    if (state.search.sort === 'earliest') {
      return [...rides].sort((a, b) => a.time.localeCompare(b.time));
    }
    if (state.search.sort === 'price') {
      return [...rides].sort((a, b) => a.price - b.price);
    }
    return [...rides].sort((a, b) => b.match - a.match);
  }, [state.rides, state.vehicles, state.members, state.search, me]);

  const riderBookings = useMemo(() => {
    if (!me) return [];
    return state.bookings.filter((b) => b.riderId === me.id);
  }, [state.bookings, me]);

  const driverRides = useMemo(() => {
    if (!me) return [];
    return state.rides.filter((r) => r.driverId === me.id);
  }, [state.rides, me]);

  const pendingRequestCount = useMemo(() => {
    if (!me) return 0;
    const myRideIds = new Set(driverRides.map((r) => r.id));
    return state.bookings.filter((b) => myRideIds.has(b.rideId) && b.status === 'requested').length;
  }, [driverRides, state.bookings, me]);

  const unreadCount = useMemo(() => {
    if (!me) return 0;
    return state.notifications.filter((n) => n.memberId === me.id && !n.read).length;
  }, [state.notifications, me]);

  const availableBalance = useMemo(() => {
    if (!me) return 0;
    return ledgerSum(state.ledger, me.id, 'completed');
  }, [state.ledger, me]);

  const pendingBalance = useMemo(() => {
    if (!me) return 0;
    return ledgerSum(state.ledger, me.id, 'pending');
  }, [state.ledger, me]);

  const api: PlatformApi = {
    state,
    me,
    matchedRides,
    unreadCount,
    riderBookings,
    driverRides,
    pendingRequestCount,
    availableBalance,
    pendingBalance,
    login: (phone, otp) => {
      const normalized = normalizeNgPhone(phone);
      if (otp !== DEMO_OTP) return { ok: false, isNew: false, message: 'Invalid OTP. Use 4827 for this preview.' };
      let member = state.members.find((m) => m.phone === normalized);
      let isNew = false;
      if (!member) {
        isNew = true;
        member = {
          id: nid('usr'),
          firstName: 'Commuter',
          lastName: 'Member',
          phone: normalized,
          initials: 'CM',
          avatarColor: '#1c604c',
          rating: 5,
          trips: 0,
          verified: false,
          communityIds: ['com_ikorodu'],
          emergencyContacts: [],
        };
      }
      setState((current) => ({
        ...current,
        members: isNew ? [member!, ...current.members] : current.members,
        session: {
          memberId: member!.id,
          role: 'rider',
          onboarded: !isNew,
          driverOnboarded: Boolean(member!.licenceNumber),
        },
      }));
      return { ok: true, isNew, message: 'Welcome to COMUTA.' };
    },
    completeProfile: (firstName, lastName, email) => {
      if (!me) return;
      setState((current) => ({
        ...current,
        members: current.members.map((m) =>
          m.id === me.id
            ? {
                ...m,
                firstName,
                lastName,
                email,
                initials: initialsOf(firstName, lastName),
                verified: true,
              }
            : m,
        ),
        session: current.session ? { ...current.session, onboarded: true } : current.session,
      }));
    },
    addEmergencyContact: (name, phone, relation) => {
      if (!me) return;
      setState((current) => ({
        ...current,
        members: current.members.map((m) =>
          m.id === me.id ? { ...m, emergencyContacts: [{ name, phone, relation }, ...m.emergencyContacts] } : m,
        ),
      }));
    },
    logout: () => setState((current) => ({ ...current, session: null })),
    resetDemo: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(createSeedState());
    },
    setRole: (role) => {
      setState((current) => {
        if (!current.session) return current;
        return { ...current, session: { ...current.session, role } };
      });
    },
    completeDriverOnboarding: (input) => {
      if (!me) return;
      const vehicleId = nid('veh');
      const vehicle = {
        id: vehicleId,
        driverId: me.id,
        make: input.make,
        model: input.model,
        color: input.color,
        plate: input.plate,
        seats: 4,
        year: 2020,
      };
      setState((current) => ({
        ...current,
        vehicles: [vehicle, ...current.vehicles],
        members: current.members.map((m) =>
          m.id === me.id
            ? {
                ...m,
                licenceNumber: input.licenceNumber,
                bankName: input.bankName,
                bankLast4: input.bankLast4,
                driverReliability: {
                  overallScore: 98,
                  completionRate: 98,
                  onTimeRate: 97,
                  lateCancellations: 0,
                  noShows: 0,
                  tips: ['You are in good standing!'],
                },
              }
            : m,
        ),
        session: current.session ? { ...current.session, driverOnboarded: true, role: 'driver' } : current.session,
      }));
    },
    setSearch: (patch) => setState((current) => ({ ...current, search: { ...current.search, ...patch } })),
    requestSeat: (rideId) => {
      if (!me) return { ok: false, message: 'Please sign in to reserve.' };
      const ride = state.rides.find((r) => r.id === rideId);
      if (!ride || ride.seatsLeft < 1) return { ok: false, message: 'No seats left on this commute.' };
      const pin = pinCode();
      const booking: Booking = {
        id: nid('BKG'),
        rideId,
        riderId: me.id,
        seats: 1,
        amount: ride.price,
        protectionFee: 0,
        discount: 0,
        total: ride.price,
        status: 'confirmed',
        pin,
        pickupNote: 'Ikorodu Hub Main Gate',
        pickupHub: 'Ikorodu Hub',
        dropoffHub: 'Victoria Island Hub',
        createdAt: new Date().toISOString(),
        ratedByRider: false,
        ratedByDriver: false,
      };
      setState((current) => {
        let trips = current.trips;
        let existingTrip = trips.find((t) => t.rideId === ride.id);
        if (!existingTrip) {
          existingTrip = {
            id: nid('TRIP'),
            rideId: ride.id,
            status: 'driver_confirmed',
            pin,
            etaMinutes: ride.durationMin,
            progress: 0,
            driverConfirmed: true,
          };
          trips = [existingTrip, ...trips];
        }
        return notify(
          {
            ...current,
            bookings: [booking, ...current.bookings],
            rides: current.rides.map((r) => (r.id === rideId ? { ...r, seatsLeft: r.seatsLeft - 1 } : r)),
            trips,
            ledger: [
              {
                id: nid('led'),
                memberId: me.id,
                type: 'ride_payment',
                amount: -ride.price,
                status: 'completed',
                reference: booking.id,
                note: `COMUTA seat · ${ride.time}`,
                createdAt: new Date().toISOString(),
              },
              ...current.ledger,
            ],
          },
          me.id,
          'Seat Confirmed',
          `Your seat from Ikorodu Hub to Victoria Island Hub is confirmed. PIN ${pin}.`,
          'booking',
        );
      });
      return { ok: true, booking, message: 'Seat confirmed' };
    },
    payBooking: (bookingId) => {
      setState((current) => confirmBooking(current, bookingId));
      return { ok: true, message: 'Payment confirmed via Paystack.' };
    },
    cancelBooking: (bookingId) => {
      setState((current) => {
        const booking = current.bookings.find((b) => b.id === bookingId);
        if (!booking) return current;
        const ride = current.rides.find((r) => r.id === booking.rideId);
        return notify(
          {
            ...current,
            bookings: current.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)),
            rides: ride
              ? current.rides.map((r) => (r.id === ride.id ? { ...r, seatsLeft: r.seatsLeft + booking.seats } : r))
              : current.rides,
            ledger: [
              {
                id: nid('led'),
                memberId: booking.riderId,
                type: 'refund',
                amount: booking.total,
                status: 'completed',
                reference: booking.id,
                note: 'Commute refund processed',
                createdAt: new Date().toISOString(),
              },
              ...current.ledger,
            ],
          },
          booking.riderId,
          'Commute Cancelled',
          `${formatNaira(booking.total)} refunded to your payment method.`,
          'booking',
        );
      });
    },
    acceptRequest: (bookingId) => {
      setState((current) => {
        const booking = current.bookings.find((b) => b.id === bookingId);
        if (!booking) return current;
        return notify(
          {
            ...current,
            bookings: current.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' as const } : b)),
          },
          booking.riderId,
          'Commute Request Accepted',
          'Your driver accepted your commute seat.',
          'booking',
        );
      });
    },
    declineRequest: (bookingId) => {
      setState((current) => {
        const booking = current.bookings.find((b) => b.id === bookingId);
        if (!booking) return current;
        return notify(
          {
            ...current,
            bookings: current.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'declined' as const } : b)),
          },
          booking.riderId,
          'Commute Request Declined',
          'The driver was unable to accept this request.',
          'booking',
        );
      });
    },
    publishRide: (input) => {
      if (!me) throw new Error('Not signed in');
      const vehicle = state.vehicles.find((v) => v.driverId === me.id) ?? state.vehicles[0];
      const from = placeById(input.fromId);
      const to = placeById(input.toId);
      const ride: RideOffer = {
        id: `CM-${Math.floor(1000 + Math.random() * 8999)}`,
        driverId: me.id,
        vehicleId: vehicle.id,
        fromId: input.fromId,
        toId: input.toId,
        pickupId: input.pickupId,
        dropoffId: input.dropoffId,
        time: input.time,
        durationMin: 65,
        distanceKm: 34.2,
        price: input.price,
        seats: input.seats,
        seatsLeft: input.seats,
        recurring: input.recurring,
        days: input.days,
        communityId: me.communityIds[0] ?? 'com_ikorodu',
        status: 'published',
        when: input.when,
        confirmedByDriver: false,
        t8Deadline: '11:00 PM',
      };
      setState((current) =>
        notify(
          { ...current, rides: [ride, ...current.rides] },
          me.id,
          'Commute Published',
          `${from.name} → ${to.name} at ${input.time} is now open for bookings.`,
          'system',
        ),
      );
      return ride;
    },
    startNavigation: (tripId) => {
      setState((current) => ({
        ...current,
        trips: current.trips.map((trip) =>
          trip.id === tripId
            ? { ...trip, status: 'driver_en_route', etaMinutes: 32, progress: 15, startedAt: new Date().toISOString() }
            : trip,
        ),
      }));
    },
    verifyPin: (tripId, pin) => {
      const trip = state.trips.find((t) => t.id === tripId);
      if (!trip) return { ok: false, message: 'Trip not found.' };
      if (pin.trim() !== trip.pin && pin.trim() !== '4827') {
        return { ok: false, message: 'Trip PIN does not match.' };
      }
      setState((current) => ({
        ...current,
        trips: current.trips.map((t) => (t.id === tripId ? { ...t, status: 'in_progress', progress: 30 } : t)),
      }));
      return { ok: true, message: 'PIN verified. Commute started.' };
    },
    completeTrip: (tripId) => {
      setState((current) => {
        const trip = current.trips.find((t) => t.id === tripId);
        if (!trip) return current;
        const ride = current.rides.find((r) => r.id === trip.rideId);
        const driverId = ride?.driverId;
        const completedTrip = { ...trip, status: 'completed' as const, progress: 100, completedAt: new Date().toISOString() };
        const settlement = driverId
          ? {
              id: nid('led'),
              memberId: driverId,
              type: 'settlement' as const,
              amount: 4500,
              status: 'completed' as const,
              reference: tripId,
              note: 'Commute completed · 3 seats settled',
              createdAt: new Date().toISOString(),
            }
          : null;
        return {
          ...current,
          trips: current.trips.map((t) => (t.id === tripId ? completedTrip : t)),
          bookings: current.bookings.map((b) => (b.rideId === trip.rideId ? { ...b, status: 'completed' } : b)),
          ledger: settlement ? [settlement, ...current.ledger] : current.ledger,
        };
      });
    },
    sendMessage: (tripId, text) => {
      if (!me) return;
      setState((current) => ({
        ...current,
        messages: [
          ...current.messages,
          { id: nid('msg'), tripId, fromId: me.id, text, at: new Date().toISOString() },
        ],
      }));
    },
    markNotificationsRead: () => {
      if (!me) return;
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((n) => (n.memberId === me.id ? { ...n, read: true } : n)),
      }));
    },
    triggerSos: (tripId, kind, note) => {
      if (!me) return;
      setState((current) => ({
        ...current,
        emergencies: [
          ...current.emergencies,
          { id: nid('emg'), tripId, memberId: me.id, kind, note, at: new Date().toISOString(), status: 'open' },
        ],
      }));
    },
    rateTrip: (tripId, stars, tags, comment) => {
      if (!me) return;
      const trip = state.trips.find((t) => t.id === tripId);
      const ride = trip ? state.rides.find((r) => r.id === trip.rideId) : undefined;
      const toId = ride ? (me.id === ride.driverId ? DEMO_USER_ID : ride.driverId) : 'usr_adebayo';
      setState((current) => ({
        ...current,
        ratings: [
          ...current.ratings,
          { id: nid('rat'), tripId, fromId: me.id, toId, stars, tags, comment, at: new Date().toISOString() },
        ],
        bookings: current.bookings.map((b) => (b.rideId === trip?.rideId ? { ...b, ratedByRider: true } : b)),
      }));
    },
    withdraw: (amount) => {
      if (!me) return { ok: false, message: 'Sign in to request payout.' };
      if (amount <= 0 || amount > availableBalance) {
        return { ok: false, message: 'Requested amount exceeds available balance.' };
      }
      setState((current) => ({
        ...current,
        ledger: [
          {
            id: nid('led'),
            memberId: me.id,
            type: 'withdrawal',
            amount: -amount,
            status: 'completed',
            reference: nid('OUT'),
            note: `Cost recovery transfer · ${me.bankName ?? 'Bank'} ••${me.bankLast4 ?? '0294'}`,
            createdAt: new Date().toISOString(),
          },
          ...current.ledger,
        ],
      }));
      return { ok: true, message: 'Transfer queued successfully.' };
    },
    joinCommunity: (communityId) => {
      if (!me) return;
      setState((current) => ({
        ...current,
        members: current.members.map((m) =>
          m.id === me.id ? { ...m, communityIds: Array.from(new Set([...m.communityIds, communityId])) } : m,
        ),
      }));
    },
    verifyIdentity: () => {
      if (!me) return;
      setState((current) => ({
        ...current,
        members: current.members.map((m) => (m.id === me.id ? { ...m, verified: true } : m)),
      }));
    },
    confirmDriverCommitment: (rideId) => {
      setState((current) => {
        const rides = current.rides.map((r) => (r.id === rideId ? { ...r, confirmedByDriver: true } : r));
        const trips = current.trips.map((t) => (t.rideId === rideId ? { ...t, driverConfirmed: true, status: 'driver_confirmed' as const } : t));
        const ride = current.rides.find((r) => r.id === rideId);
        const next = { ...current, rides, trips };
        if (ride) {
          return notify(
            next,
            ride.driverId,
            'Commitment Confirmed',
            'You are committed for tomorrow’s 7:00 AM commute. Your passengers have been notified.',
            'trip',
          );
        }
        return next;
      });
    },
    cancelDriverCommitment: (rideId, reason) => {
      setState((current) => {
        const rides = current.rides.map((r) => (r.id === rideId ? { ...r, status: 'cancelled' as const, confirmedByDriver: false } : r));
        const trips = current.trips.map((t) => (t.rideId === rideId ? { ...t, status: 'at_risk' as const, atRiskReason: reason } : t));
        const affectedBookings = current.bookings.map((b) => (b.rideId === rideId ? { ...b, status: 'at_risk' as const } : b));
        const atRiskInterventions = [
          {
            id: nid('ATRISK'),
            driverId: 'usr_adebayo',
            driverName: 'Adebayo K.',
            route: 'Ikorodu Hub → Victoria Island Hub',
            time: '7:00 AM',
            issue: `Driver reported: ${reason}`,
            status: 'open' as const,
            passengers: 3,
            alternativeDriver: 'Ifeoma N. (6:45 AM) or Musa L. (7:15 AM)',
          },
          ...current.atRiskInterventions,
        ];
        return notify(
          { ...current, rides, trips, bookings: affectedBookings, atRiskInterventions },
          DEMO_USER_ID,
          'Something changed with your commute',
          'Your driver can no longer make this commute. We’re finding another option.',
          'recovery',
        );
      });
    },
    acceptAlternativeBooking: (bookingId, newRideId) => {
      setState((current) => {
        const newRide = current.rides.find((r) => r.id === newRideId);
        const driver = newRide ? memberOf(current, newRide.driverId) : null;
        return notify(
          {
            ...current,
            bookings: current.bookings.map((b) =>
              b.id === bookingId ? { ...b, rideId: newRideId, status: 'confirmed' as const, alternativeOffered: true } : b,
            ),
            rides: current.rides.map((r) =>
              r.id === newRideId ? { ...r, seatsLeft: Math.max(0, r.seatsLeft - 1) } : r,
            ),
          },
          DEMO_USER_ID,
          'Alternative Commute Confirmed',
          `You're now matched with ${driver ? fullName(driver) : 'your alternative verified driver'}. You're still covered!`,
          'booking',
        );
      });
    },
    requestRefund: (bookingId) => {
      setState((current) => {
        const booking = current.bookings.find((b) => b.id === bookingId);
        if (!booking) return current;
        return notify(
          {
            ...current,
            bookings: current.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'refunded' as const } : b)),
            ledger: [
              {
                id: nid('led'),
                memberId: booking.riderId,
                type: 'refund',
                amount: booking.total,
                status: 'completed',
                reference: booking.id,
                note: 'Instant refund for cancelled commute',
                createdAt: new Date().toISOString(),
              },
              ...current.ledger,
            ],
          },
          booking.riderId,
          'Refund Processed',
          `₦${booking.total.toLocaleString()} was immediately credited back.`,
          'payment',
        );
      });
    },
    manageRecurringSchedule: (scheduleId, action) => {
      setState((current) => ({
        ...current,
        recurringCommutes: current.recurringCommutes.map((item) => {
          if (item.id !== scheduleId) return item;
          if (action === 'skip_tomorrow') return { ...item, status: 'skipped_tomorrow' };
          if (action === 'pause') return { ...item, status: 'paused' };
          return { ...item, status: 'active' };
        }),
      }));
    },
    resolveAtRiskIntervention: (id, action) => {
      setState((current) => ({
        ...current,
        atRiskInterventions: current.atRiskInterventions.map((item) =>
          item.id === id ? { ...item, status: action === 'recover' ? 'recovered' : 'refunded' } : item,
        ),
      }));
    },
    triggerAtRiskDemo: () => {
      setState((current) => {
        const heroBooking = current.bookings.find((b) => b.id === 'BKG-HERO-01');
        if (!heroBooking) return current;
        return notify(
          {
            ...current,
            bookings: current.bookings.map((b) => (b.id === 'BKG-HERO-01' ? { ...b, status: 'at_risk' as const } : b)),
            trips: current.trips.map((t) =>
              t.id === 'TRIP-HERO-01' ? { ...t, status: 'at_risk' as const, atRiskReason: 'Emergency vehicle mechanical check' } : t,
            ),
          },
          DEMO_USER_ID,
          'Something changed with your commute',
          'Your driver can no longer make this commute. We are finding another option.',
          'recovery',
        );
      });
    },
    toCard: (ride) => makeCard(state, ride),
    memberById: (id) => memberOf(state, id),
    rideById: (id) => state.rides.find((r) => r.id === id),
    tripForRide: (rideId) => state.trips.find((t) => t.rideId === rideId),
    bookingsForRide: (rideId) => state.bookings.filter((b) => b.rideId === rideId),
    walletFor: (memberId) => ({
      available: ledgerSum(state.ledger, memberId, 'completed'),
      pending: ledgerSum(state.ledger, memberId, 'pending'),
      entries: state.ledger.filter((l) => l.memberId === memberId),
    }),
  };

  return <PlatformContext.Provider value={api}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used inside PlatformProvider');
  return ctx;
}
