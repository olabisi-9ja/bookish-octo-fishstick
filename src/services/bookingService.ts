/** Mock booking service. */
import { useComuta, newBookingId, newTripPin } from '../store';
import type { Booking } from '../types';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const bookingService = {
  /**
   * Reserve seats on a trip. Decrements availability, creates the booking
   * and notifies the driver  -  exactly what the real backend would do.
   */
  async createBooking(input: {
    riderId: string;
    tripId: string;
    seats: number;
    amount: number;
  }): Promise<{ ok: boolean; booking?: Booking; error?: string }> {
    await delay(700);
    const state = useComuta.getState();
    const trip = state.trips.find((t) => t.id === input.tripId);
    if (!trip) return { ok: false, error: 'This trip is no longer available.' };
    if (trip.seatsLeft < input.seats) {
      return { ok: false, error: `Only ${trip.seatsLeft} seat${trip.seatsLeft === 1 ? '' : 's'} left on this trip.` };
    }
    const booking: Booking = {
      id: newBookingId(),
      tripId: input.tripId,
      riderId: input.riderId,
      seats: input.seats,
      amount: input.amount,
      total: input.amount * input.seats,
      paymentStatus: 'pending',
      status: 'confirmed',
      pin: newTripPin(),
      createdAt: new Date().toISOString(),
    };
    state.addBooking(booking);
    state.updateTrip(input.tripId, { seatsLeft: trip.seatsLeft - input.seats });
    state.pushNotification(
      trip.driverId,
      'New booking on your commute',
      `${input.seats} seat${input.seats === 1 ? '' : 's'} reserved on your ${trip.departureTime} trip. Confirm before 11:00 PM.`,
      'booking',
    );
    return { ok: true, booking };
  },

  async cancelBooking(bookingId: string, riderId: string): Promise<{ ok: boolean; error?: string }> {
    await delay(450);
    const state = useComuta.getState();
    const booking = state.bookings.find((b) => b.id === bookingId && b.riderId === riderId);
    if (!booking) return { ok: false, error: 'Booking not found.' };
    const trip = state.trips.find((t) => t.id === booking.tripId);
    state.updateBooking(bookingId, { status: 'cancelled', refundRequested: true });
    if (trip) state.updateTrip(trip.id, { seatsLeft: trip.seatsLeft + booking.seats });
    state.pushNotification(riderId, 'Booking cancelled', 'Your seat was released. Your refund is being processed.', 'booking');
    return { ok: true };
  },

  async requestRefund(bookingId: string, riderId: string): Promise<{ ok: boolean }> {
    await delay(500);
    useComuta.getState().updateBooking(bookingId, { refundRequested: true });
    return { ok: true };
  },

  async rateTrip(bookingId: string, stars: number, comment?: string): Promise<{ ok: boolean }> {
    await delay(400);
    useComuta.getState().updateBooking(bookingId, { rated: true, rating: stars, ratingComment: comment });
    return { ok: true };
  },
};
