/**
 * Date utilities — ported from PWA src/utils/dates.ts
 * Adapted for React Native (no DOM dependencies).
 */

/** Today as ISO date string "YYYY-MM-DD" */
export function todayISO(): string {
  return toISODate(new Date());
}

/** Convert a Date to ISO date string */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Add N days to today and return ISO date */
export function addDaysISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Next occurrence of a given weekday, at least `minDaysAhead` days from now. */
export function nextWeekdayISO(weekday: number, minDaysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + minDaysAhead);
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
  return toISODate(d);
}

/** Minutes from now until a specific date+time. */
export function minutesUntil(isoDate: string, clockLabel: string): number {
  const [h, m] = parseClock(clockLabel);
  const target = new Date(`${isoDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
  return Math.round((target.getTime() - Date.now()) / 60000);
}

/** Add minutes to a clock label and return new label. */
export function addMinutesToClock(clock: string, extra: number): string {
  const [h, m] = parseClock(clock);
  let total = h * 60 + m + extra;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h12 = Math.floor(total / 60) % 12 || 12;
  const suffix = Math.floor(total / 60) >= 12 ? 'PM' : 'AM';
  return `${h12}:${String(total % 60).padStart(2, '0')} ${suffix}`;
}

/** Parse "7:00 AM" → [7, 0] (24h) */
export function parseClock(label: string): [number, number] {
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return [7, 0]; // safe fallback
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return [hours, Number(match[2])];
}

/** Format a date for display: "Tomorrow", "Today", "Mon, 2 Sep" */
export function friendlyDate(isoDate: string): string {
  const today = todayISO();
  const tomorrow = addDaysISO(1);
  if (isoDate === today) return 'Today';
  if (isoDate === tomorrow) return 'Tomorrow';
  const d = new Date(isoDate + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

/** Format ISO timestamp to relative time: "2 hours ago", "Just now" */
export function relativeTime(isoTimestamp: string): string {
  const now = Date.now();
  const then = new Date(isoTimestamp).getTime();
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return friendlyDate(isoTimestamp.slice(0, 10));
}

/** Time-aware greeting */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Clock label to the 24-hour form the Figma date pill draws: "6:00 AM" → "6:00",
 * "10:30 PM" → "22:30" (118:137, 247:365).
 */
export function toClock24(label: string): string {
  const [h, m] = parseClock(label);
  return `${h}:${String(m).padStart(2, '0')}`;
}

/**
 * Clock label to the compact form the results subtitle draws:
 * "6:00 AM" → "6:00am" (247:433).
 */
export function toClockCompact(label: string): string {
  return label.replace(/\s*(AM|PM)$/i, (_, suffix: string) => suffix.toLowerCase());
}
