/**
 * Mock payment service  -  models Paystack-style checkout locally.
 * The UI never pretends a real charge happened; swap this module for a real
 * Paystack integration later (popup → verify → webhook).
 */
import { useComuta } from '../store';
import type { Payment, PaymentStatus } from '../types';
import { nid, refCode } from '../utils/format';

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms));

export interface PayInput {
  bookingId: string;
  riderId: string;
  amount: number;
  method: string;
}

export const paymentService = {
  async pay(input: PayInput): Promise<{ ok: boolean; payment?: Payment; error?: string }> {
    // Simulate gateway processing
    await delay(900);
    const payment: Payment = {
      id: nid('pay'),
      bookingId: input.bookingId,
      riderId: input.riderId,
      amount: input.amount,
      method: input.method,
      status: 'successful',
      reference: refCode(),
      createdAt: new Date().toISOString(),
    };
    useComuta.getState().addPayment(payment);
    useComuta.getState().updateBooking(input.bookingId, { paymentStatus: 'successful' });
    useComuta.getState().pushNotification(
      input.riderId,
      'Payment successful',
      `You paid ${formatNaira(input.amount)}. Your seat is secured on this commute.`,
      'payment',
    );
    return { ok: true, payment };
  },

  /** Mark a payment/booking refunded (mock). */
  async refund(bookingId: string): Promise<{ ok: boolean }> {
    await delay(600);
    useComuta.getState().updateBooking(bookingId, { paymentStatus: 'refunded' });
    return { ok: true };
  },

  /** Create a processing record  -  used by the payment screen before completing. */
  begin(amount: number, method: string): { ref: string } {
    return { ref: refCode() };
  },

  statusFor(bookingId: string): PaymentStatus {
    return useComuta.getState().bookings.find((b) => b.id === bookingId)?.paymentStatus ?? 'pending';
  },
};

function formatNaira(v: number) {
  return `₦${Math.round(v).toLocaleString('en-NG')}`;
}
