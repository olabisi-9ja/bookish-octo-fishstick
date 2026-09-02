/** Mock driver service  -  commitments, publishing, passengers, operations. */
import { useComuta } from '../store';
import type { Trip } from '../types';
import { nid, pinCode } from '../utils/format';
import { addMinutesToClock, minutesUntil, todayISO } from '../utils/dates';
import { estimateDurationMin } from '../utils/geo';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export interface PassengerRow {
  bookingId: string;
  name: string;
  initials: string;
  avatarColor: string;
  verified: boolean;
  seats: number;
  hubName: string;
  pin: string;
  paid: boolean;
  rating?: number;
}

export const driverService = {
  /** Trips the driver has published, upcoming first. */
  myTrips(driverId: string) {
    return useComuta
      .getState()
      .trips.filter((t) => t.driverId === driverId)
      .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime));
  },

  /** The driver's next commitment (soonest upcoming trip). */
  nextCommitment(driverId: string) {
    const trips = this.myTrips(driverId).filter((t) => !['completed', 'cancelled'].includes(t.status));
    return trips[0] ?? null;
  },

  /** Confirm a trip (T-8 commitment). */
  async confirmTrip(tripId: string, driverId: string): Promise<{ ok: boolean }> {
    await delay(650);
    useComuta.getState().updateTrip(tripId, { driverConfirmed: true, status: 'confirmed' });
    useComuta
      .getState()
      .pushNotification(driverId, 'Commute confirmed', 'You confirmed your commute. Your passengers have been notified.', 'trip');
    return { ok: true };
  },

  /** Decline a trip with a reason. */
  async declineTrip(tripId: string, driverId: string, reason: string): Promise<{ ok: boolean }> {
    await delay(500);
    useComuta.getState().updateTrip(tripId, { driverConfirmed: false, status: 'at_risk' });
    useComuta
      .getState()
      .pushNotification(driverId, 'Commute released', 'Your passengers have been notified and COMUTA is finding alternatives.', 'trip');
    void reason;
    return { ok: true };
  },

  /** Publish a one-off or recurring commute. */
  async publishCommute(input: {
    driverId: string;
    fromId: string;
    toId: string;
    pickupHubId: string;
    date?: string;
    time: string;
    seats: number;
    pricePerSeat: number;
    routeId?: string;
  }): Promise<{ ok: boolean; trip?: Trip; error?: string }> {
    await delay(700);
    const { hubs } = useComuta.getState();
    const from = hubs.find((h) => h.id === input.fromId);
    const to = hubs.find((h) => h.id === input.toId);
    if (!from || !to) return { ok: false, error: 'Choose valid hubs.' };
    const distanceKm = estimateDistance(from.lat, from.lng, to.lat, to.lng);
    const durationMin = estimateDurationMin(distanceKm);
    const date = input.date ?? todayISO();
    const trip: Trip = {
      id: nid('t'),
      routeId: input.routeId,
      driverId: input.driverId,
      fromId: input.fromId,
      toId: input.toId,
      pickupHubId: input.pickupHubId,
      date,
      departureTime: input.time,
      arrivalTime: addMinutesToClock(input.time, durationMin),
      durationMin,
      distanceKm: Math.round(distanceKm * 10) / 10,
      pricePerSeat: input.pricePerSeat,
      seatsTotal: input.seats,
      seatsLeft: input.seats,
      driverConfirmed: false,
      status: 'confirmation_pending',
      pin: pinCode(),
      createdAt: new Date().toISOString(),
    };
    useComuta.getState().addTrip(trip);
    return { ok: true, trip };
  },

  /** Passengers booked onto one of the driver's trips. */
  passengers(tripId: string): PassengerRow[] {
    const state = useComuta.getState();
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) return [];
    return state.bookings
      .filter((b) => b.tripId === tripId && b.status !== 'cancelled')
      .map((b) => {
        const rider = state.users.find((u) => u.id === b.riderId);
        const hub = state.hubs.find((h) => h.id === trip.pickupHubId);
        return {
          bookingId: b.id,
          name: rider ? `${rider.firstName} ${rider.lastName}` : 'Rider',
          initials: rider?.photoInitials ?? '??',
          avatarColor: rider?.avatarColor ?? '#155942',
          verified: rider?.verificationStatus === 'verified',
          seats: b.seats,
          hubName: hub?.name ?? 'Hub',
          pin: b.pin,
          paid: b.paymentStatus === 'successful',
          rating: b.rating,
        };
      });
  },

  /** Driver operations on a live trip. */
  async startTrip(tripId: string): Promise<{ ok: boolean }> {
    await delay(500);
    useComuta.getState().updateTrip(tripId, { status: 'in_transit' });
    useComuta.getState().setActiveTrip(tripId);
    return { ok: true };
  },

  async completeTrip(tripId: string): Promise<{ ok: boolean }> {
    await delay(500);
    useComuta.getState().updateTrip(tripId, { status: 'completed' });
    const state = useComuta.getState();
    state.bookings
      .filter((b) => b.tripId === tripId && b.status !== 'cancelled')
      .forEach((b) => state.updateBooking(b.id, { status: 'completed' }));
    state.setActiveTrip(undefined);
    return { ok: true };
  },

  async arrivePickup(tripId: string): Promise<{ ok: boolean }> {
    await delay(400);
    useComuta.getState().updateTrip(tripId, { status: 'pickup' });
    return { ok: true };
  },

  /** Confirm-by countdown: minutes until tonight 11:00 PM. */
  confirmDeadline(): { label: string; expired: boolean } {
    const now = new Date();
    const deadline = new Date(now);
    deadline.setHours(23, 0, 0, 0);
    const mins = Math.round((deadline.getTime() - now.getTime()) / 60000);
    if (mins <= 0) return { label: 'Passed', expired: true };
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return { label: h ? `${h}h ${m}m` : `${m}m`, expired: false };
  },

  minutesToDeparture(trip: Trip) {
    return minutesUntil(trip.date, trip.departureTime);
  },
};

function estimateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s))) * 1.18;
}
