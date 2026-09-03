/** Naira formatting: ₦1,500 */
export function naira(value: number) {
  return `₦${Math.round(value).toLocaleString('en-NG')}`;
}

export function nairaShort(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return `₦${Math.round(value)}`;
}

export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function initialsOf(first: string, last: string) {
  return `${(first[0] ?? '').toUpperCase()}${(last[0] ?? '').toUpperCase()}`;
}

export function fullName(u: { firstName: string; lastName: string }) {
  return `${u.firstName} ${u.lastName}`.trim();
}

export function formatClock(minutes: number): string {
  const wrapped = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h24 = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function parseClock(label: string): number {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 7 * 60;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

export function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const r = minutes % 60;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}

export function relativeTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(delta / 60000));
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function prettyPhone(phone: string) {
  const n = phone.replace(/\D/g, '');
  if (n.length === 11) return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  if (n.length === 13 && n.startsWith('234')) return `0${n.slice(3, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  return phone;
}

export function normalizeNgPhone(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) return `0${digits.slice(3)}`;
  if (digits.length === 11 && digits.startsWith('0')) return digits;
  if (digits.length === 10) return `0${digits}`;
  return digits;
}

export function initialsAvatarColor(name: string) {
  const palette = ['#155942', '#1e7386', '#2b6e4f', '#3d5f8a', '#7a5c1f', '#1d6e53', '#5c7186', '#23626d'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function pinCode() {
  return String(1000 + Math.floor(Math.random() * 9000));
}

export function refCode() {
  return `CMT-${Math.random().toString(36).slice(2, 6).toUpperCase()}${String(Date.now()).slice(-4)}`;
}

export function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}
