import type { TripStatus, VerificationStatus, PaymentStatus } from '../types';

/**
 * Motion durations (seconds) — the COMUTA motion system.
 * Subtle, confident, restrained.
 */
export const DURATION = {
  instant: 0.12,
  fast: 0.2,
  standard: 0.3,
  expressive: 0.6,
  story: 0.9,
} as const;

export const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Local development/test accounts — seeded by the mock auth service only.
 * NEVER rendered in the product UI. Replace `authService` with a real
 * auth backend and delete this block when that happens.
 */
export const TEST_ACCOUNTS = {
  primary: { email: 'test@comuta.app', password: 'ComutaTest123!', role: 'rider' },
  rider: { email: 'rider@comuta.app', password: 'ComutaTest123!', role: 'rider' },
  driver: { email: 'driver@comuta.app', password: 'ComutaTest123!', role: 'driver' },
} as const;

/** Mock OTP used by the frontend-only auth service. */
export const MOCK_OTP = '4827';

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  scheduled: 'Scheduled',
  confirmation_pending: 'Awaiting driver',
  confirmed: 'Confirmed',
  at_risk: 'At risk',
  pickup: 'At pickup',
  departed: 'Departed',
  in_transit: 'In transit',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  pending: 'Verification pending',
  under_review: 'Under review',
  verified: 'Verified',
  rejected: 'Verification rejected',
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  successful: 'Successful',
  failed: 'Failed',
  refunded: 'Refunded',
};

export const ID_TYPES = ['NIN', "Driver's licence", "Voter's card", 'International passport'] as const;

export const RECURRENCE = { base: 400, perKm: 40, protection: 120, minimum: 900, platformRate: 0.09 } as const;

export function recommendedSeatPrice(distanceKm: number, durationMin: number) {
  const raw = RECURRENCE.base + distanceKm * RECURRENCE.perKm + durationMin * 4;
  return Math.max(RECURRENCE.minimum, Math.round(raw / 50) * 50);
}

/** Rough solo-trip fare for the same corridor (used for comparison). */
export function taxiFare(distanceKm: number, durationMin: number) {
  const raw = RECURRENCE.base + distanceKm * 45 + durationMin * 8 + RECURRENCE.protection;
  return Math.max(800, Math.round(raw / 50) * 50);
}

/** Per-seat price band shown before booking. */
export function priceBand(seat: number) {
  return { low: Math.max(800, seat - 200), high: seat + 150 };
}

/** Days of the week labels */
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAY_LABELS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
