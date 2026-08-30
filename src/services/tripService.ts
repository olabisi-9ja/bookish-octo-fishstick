/** Mock trip service — search, detail, upcoming and history. */
import { useComuta } from '../store';
import type { Booking, SearchQuery, Trip } from '../types';
import { addMinutesToClock, minutesUntil } from '../utils/dates';
import { estimateDurationMin } from '../utils/geo';
import { recommendedSeatPrice } from '../constants';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export type TripWithMeta = Trip & {
  driverName: string;
  driverInitials: string;
  avatarColor: string;
  vehicle: { make: string; model: string; color: string; plate: string; seats: number };
  completionRate: number;
  onTimeRate: number;
};

function attachMeta(trip: Trip): TripWithMeta {
  const { users, vehicles, driverProfiles, hubs } = useComuta.getState();
  const driver = users.find((u) => u.id === trip.driverId);
  const vehicle = vehicles.find((v) => v.id === driverProfiles[trip.driverId]?.vehicleId) ?? vehicles[0];
  const hub = hubs.find((h) => h.id === trip.pickupHubId);
  const profile = driverProfiles[trip.driverId];
  return {
    ...trip,
    driverName: driver ? `${driver.firstName} ${driver.lastName[0]}.` : 'COMUTA driver',
    driverInitials: driver?.photoInitials ?? 'CD',
    avatarColor: driver?.avatarColor ?? '#155942',
    vehicle: vehicle
      ? { make: vehicle.make, model: vehicle.model, color: vehicle.color, plate: vehicle.plate, seats: vehicle.seats }
      : { make: 'Toyota', model: 'Corolla', color: 'Silver', plate: 'ABC 123 XY', seats: 4 },
    completionRate: profile?.completionRate ?? 98,
    onTimeRate: profile?.onTimeRate ?? 97,
  };
}

export const tripService = {
  /** Search published trips for a corridor/date/time. */
  async searchTrips(query: SearchQuery): Promise<TripWithMeta[]> {
    await delay(800);
    const { trips } = useComuta.getState();
    const qTime = query.time || '7:00 AM';
    return trips
      .filter((t) => t.fromId === query.fromId && t.toId === query.toId && t.date === query.date)
      .filter((t) => !['cancelled', 'at_risk', 'completed'].includes(t.status) && t.seatsLeft > 0)
      .sort((a, b) => {
        const aDiff = Math.abs(minutesUntil(a.date, a.departureTime) - minutesUntil(a.date, qTime));
        const bDiff = Math.abs(minutesUntil(b.date, b.departureTime) - minutesUntil(b.date, qTime));
        return aDiff - bDiff;
      })
      .map(attachMeta);
  },

  /** Search across the nearest matching corridor (for hub search UX). */
  async searchCorridor(fromId: string, toId: string): Promise<TripWithMeta[]> {
    await delay(500);
    const { trips } = useComuta.getState();
    return trips
      .filter((t) => t.fromId === fromId && t.toId === toId)
      .filter((t) => !['cancelled', 'at_risk', 'completed'].includes(t.status) && t.seatsLeft > 0)
      .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime))
      .map(attachMeta);
  },

  async getTrip(id: string): Promise<TripWithMeta | null> {
    await delay(200);
    const trip = useComuta.getState().trips.find((t) => t.id === id);
    return trip ? attachMeta(trip) : null;
  },

  getTripSync(id: string): TripWithMeta | null {
    const trip = useComuta.getState().trips.find((t) => t.id === id);
    return trip ? attachMeta(trip) : null;
  },

  /** Trips the rider has booked, upcoming first. */
  async getUpcomingTrips(riderId: string): Promise<{ trip: TripWithMeta; booking: Booking }[]> {
    await delay(350);
    const { bookings, trips } = useComuta.getState();
    return bookings
      .filter((b) => b.riderId === riderId && b.status !== 'cancelled')
      .map((b) => ({ booking: b, trip: trips.find((t) => t.id === b.tripId)! }))
      .filter((x) => x.trip)
      .filter((x) => !['completed', 'cancelled'].includes(x.trip.status))
      .sort((a, b) => a.trip.date.localeCompare(b.trip.date) || a.trip.departureTime.localeCompare(b.trip.departureTime))
      .map((x) => ({ booking: x.booking, trip: attachMeta(x.trip) }));
  },

  /** Completed + cancelled trip history for a rider. */
  async getHistory(riderId: string): Promise<{ trip: TripWithMeta; booking: Booking }[]> {
    await delay(300);
    const { bookings, trips } = useComuta.getState();
    return bookings
      .filter((b) => b.riderId === riderId)
      .map((b) => ({ booking: b, trip: trips.find((t) => t.id === b.tripId)! }))
      .filter((x) => x.trip)
      .filter((x) => ['completed', 'cancelled'].includes(x.trip.status))
      .sort((a, b) => b.trip.date.localeCompare(a.trip.date) || b.trip.departureTime.localeCompare(a.trip.departureTime))
      .map((x) => ({ booking: x.booking, trip: attachMeta(x.trip) }));
  },

  /** The rider's next single trip. */
  async getNextTrip(riderId: string): Promise<{ trip: TripWithMeta; booking: Booking } | null> {
    const upcoming = await this.getUpcomingTrips(riderId);
    return upcoming[0] ?? null;
  },

  /** Booking linked to a trip for a rider. */
  bookingFor(riderId: string, tripId: string) {
    return useComuta.getState().bookings.find((b) => b.riderId === riderId && b.tripId === tripId);
  },

  /** Rider arrives at pickup — trip moves to pickup state. */
  async markAtPickup(tripId: string) {
    await delay(300);
    useComuta.getState().updateTrip(tripId, { status: 'pickup' });
    return { ok: true };
  },

  /** Rider confirms pickup (PIN verified) — trip departs. */
  async confirmPickup(tripId: string) {
    await delay(400);
    useComuta.getState().updateTrip(tripId, { status: 'departed' });
    return { ok: true };
  },

  /** Quote for a corridor (used by the plan screen before searching). */
  async quote(fromId: string, toId: string): Promise<{ distanceKm: number; durationMin: number; seat: number }> {
    await delay(200);
    const { hubs } = useComuta.getState();
    const from = hubs.find((h) => h.id === fromId)!;
    const to = hubs.find((h) => h.id === toId)!;
    const distanceKm = estimateDistance(from.lat, from.lng, to.lat, to.lng);
    const durationMin = estimateDurationMin(distanceKm);
    return { distanceKm: Math.round(distanceKm * 10) / 10, durationMin, seat: recommendedSeatPrice(distanceKm, durationMin) };
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

export function tripStateAt(trip: Trip, booking: Booking) {
  // Derived state machine helpers for UI rendering
  const minutesToDeparture = minutesUntil(trip.date, trip.departureTime);
  const now = Date.now();
  const departureMs = trip.date ? 0 : 0;
  void departureMs;
  void now;
  return { minutesToDeparture };
}

export { addMinutesToClock };
