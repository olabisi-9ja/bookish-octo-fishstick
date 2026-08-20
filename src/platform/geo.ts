import type { Place } from './types';

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineKm(a: Pick<Place, 'lat' | 'lng'>, b: Pick<Place, 'lat' | 'lng'>): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export function parseClock(label: string): number {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 7 * 60;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

export function formatClock(minutes: number): string {
  const wrapped = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours24 = Math.floor(wrapped / 60);
  const mins = wrapped % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, '0')} ${suffix}`;
}

export function addMinutes(label: string, extra: number) {
  return formatClock(parseClock(label) + extra);
}

export function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}
