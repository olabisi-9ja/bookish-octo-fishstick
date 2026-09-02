/**
 * Formatting utilities — ported from PWA src/utils/format.ts
 */

/** Generate a nanoid-style short ID with a prefix. */
export function nid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Generate a 4-digit PIN code. */
export function pinCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Generate a payment reference code. */
export function refCode(): string {
  return `CMT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Format Naira amount: ₦1,500 */
export function naira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/** Full name from first + last. */
export function fullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`;
}

/** Short display name: "Adebayo K." */
export function displayName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName[0]}.`;
}

/** Initials from first + last name. */
export function initialsOf(first: string, last: string): string {
  return `${(first[0] || '').toUpperCase()}${(last[0] || '').toUpperCase()}`;
}

/** Deterministic avatar color from a name string. */
export function initialsAvatarColor(name: string): string {
  const palette = [
    '#155942', '#1e7386', '#2b6e4f', '#1d6e53', '#3d5f8a',
    '#7a5c1f', '#23626d', '#5c7186', '#8a5a2b', '#4a6741',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

/** Normalize a Nigerian phone number to 11-digit format. */
export function normalizeNgPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) {
    return '0' + digits.slice(3);
  }
  if (digits.startsWith('+234')) {
    return '0' + digits.slice(4);
  }
  return digits;
}

/** Format phone for display: 0803 111 2841 */
export function formatPhone(phone: string): string {
  const d = normalizeNgPhone(phone);
  if (d.length !== 11) return phone;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

/** Truncate text with ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trim() + '…';
}

/** Pluralize: "1 seat" vs "2 seats" */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + 's'}`;
}

/** Format distance: "24.3 km" */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

/** Format duration: "45 min" or "1h 15min" */
export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
