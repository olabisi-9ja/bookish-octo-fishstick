import { haversineKm } from './geo';
import type { Place } from './types';

export const PRICING = {
  base: 400,
  perKm: 45,
  perMin: 8,
  protection: 120,
  minimum: 800,
  platformRate: 0.09,
  carpoolShare: 0.62,
};

export function estimateDurationMin(distanceKm: number) {
  const traffic = distanceKm > 18 ? 1.55 : 1.4;
  return Math.max(18, Math.round((distanceKm / 28) * 60 * traffic));
}

export function taxiFare(distanceKm: number, durationMin: number) {
  const raw = PRICING.base + distanceKm * PRICING.perKm + durationMin * PRICING.perMin + PRICING.protection;
  return Math.max(PRICING.minimum, Math.round(raw / 50) * 50);
}

export function recommendedSeatPrice(distanceKm: number, durationMin: number) {
  const taxi = taxiFare(distanceKm, durationMin);
  const seat = taxi * PRICING.carpoolShare;
  return Math.max(900, Math.round(seat / 50) * 50);
}

export function priceBand(seat: number) {
  return { low: Math.max(800, seat - 200), high: seat + 150 };
}

export function quoteRoute(from: Place, to: Place) {
  const distanceKm = Math.round(haversineKm(from, to) * 10) / 10;
  const durationMin = estimateDurationMin(distanceKm);
  const seat = recommendedSeatPrice(distanceKm, durationMin);
  const band = priceBand(seat);
  return { distanceKm, durationMin, seat, band, taxi: taxiFare(distanceKm, durationMin) };
}

export function bookingTotals(seat: number) {
  const protectionFee = PRICING.protection;
  const discount = protectionFee;
  const total = seat;
  return { amount: seat, protectionFee, discount, total };
}

export function driverSettlement(seat: number) {
  const commission = Math.round(seat * PRICING.platformRate);
  return { commission, net: seat - commission };
}

export function corridorHeat(fromArea: string, toArea: string, time: string) {
  const key = `${fromArea}→${toArea}`.toLowerCase();
  const morning = /AM/i.test(time) && !/11:|10:/.test(time);
  if (key.includes('ajah') && key.includes('victoria')) return morning ? 1.18 : 1.08;
  if (key.includes('ikeja') && key.includes('victoria')) return morning ? 1.1 : 1.04;
  if (key.includes('yaba') && key.includes('lekki')) return 1.06;
  return 1;
}
