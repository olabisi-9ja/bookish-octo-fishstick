/** Date helpers used by the seed and the mock services. */

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function isoToDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function dayLabel(iso: string, now = new Date()) {
  const d = isoToDate(iso);
  const today = toISODate(now);
  const tomorrow = addDaysISO(1);
  if (iso === today) return 'Today';
  if (iso === tomorrow) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function longDayLabel(iso: string) {
  return isoToDate(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function nextWeekdayISO(targetDay: number, minDaysAhead = 0) {
  const d = new Date();
  d.setDate(d.getDate() + minDaysAhead);
  while (d.getDay() !== targetDay) d.setDate(d.getDate() + 1);
  return toISODate(d);
}

export function isPast(iso: string, time: string) {
  const d = isoToDate(iso);
  const [h, m] = parseClockParts(time);
  d.setHours(h, m, 0, 0);
  return d.getTime() < Date.now();
}

function parseClockParts(label: string): [number, number] {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return [7, 0];
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return [hours, Number(match[2])];
}

/** Minutes until a datetime, negative if already past. */
export function minutesUntil(iso: string, time: string) {
  const d = isoToDate(iso);
  const [h, m] = parseClockParts(time);
  d.setHours(h, m, 0, 0);
  return Math.round((d.getTime() - Date.now()) / 60000);
}

export function leaveByTime(iso: string, departure: string, bufferMin: number) {
  const [h, m] = parseClockParts(departure);
  let total = h * 60 + m - bufferMin;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h12 = Math.floor(total / 60) % 12 || 12;
  const suffix = Math.floor(total / 60) >= 12 ? 'PM' : 'AM';
  return `${h12}:${String(total % 60).padStart(2, '0')} ${suffix}`;
}

export function addMinutesToClock(clock: string, extra: number) {
  const [h, m] = parseClockParts(clock);
  let total = h * 60 + m + extra;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h12 = Math.floor(total / 60) % 12 || 12;
  const suffix = Math.floor(total / 60) >= 12 ? 'PM' : 'AM';
  return `${h12}:${String(total % 60).padStart(2, '0')} ${suffix}`;
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
