/**
 * Mock authentication service — ported from PWA src/services/authService.ts.
 * Replace this module with real API calls later.
 */
import { useComuta } from '../store';
import { MOCK_OTP, TEST_ACCOUNTS } from '../constants';
import type { AuthSession, Role, User, VerificationStatus } from '../types';
import { fullName, initialsAvatarColor, initialsOf, normalizeNgPhone } from '../utils/format';

const delay = (ms = 550) => new Promise((r) => setTimeout(r, ms));

export interface AuthResult {
  ok: boolean;
  error?: string;
  session?: AuthSession;
}

function toAuthSession(user: User, role: Role): AuthSession {
  return { userId: user.id, role };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    await delay();
    const user = useComuta
      .getState()
      .users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return { ok: false, error: 'No account found with this email.' };
    if (user.password !== password) return { ok: false, error: 'Incorrect password. Try again.' };
    useComuta.getState().setSession({
      userId: user.id,
      role: user.role,
      onboarded: true,
      kycComplete: user.verificationStatus === 'verified',
      driverOnboarded: user.role === 'driver',
    });
    return { ok: true, session: toAuthSession(user, user.role) };
  },

  async signup(input: { firstName: string; lastName: string; email: string; phone: string; password: string }): Promise<AuthResult> {
    await delay();
    const { users, addUser } = useComuta.getState();
    const email = input.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: 'An account with this email already exists. Log in instead.' };
    }
    const phone = normalizeNgPhone(input.phone);
    if (users.some((u) => normalizeNgPhone(u.phone) === phone)) {
      return { ok: false, error: 'This phone number is already registered.' };
    }
    const name = `${input.firstName} ${input.lastName}`;
    const user: User = {
      id: `usr_${Math.random().toString(36).slice(2, 8)}`,
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      phone,
      password: input.password,
      role: 'rider',
      verificationStatus: 'pending',
      photoInitials: initialsOf(input.firstName, input.lastName),
      avatarColor: initialsAvatarColor(name),
      createdAt: new Date().toISOString(),
    };
    addUser(user);
    return { ok: true, session: toAuthSession(user, 'rider') };
  },

  async sendOtp(identifier: string): Promise<{ ok: boolean; error?: string }> {
    await delay(400);
    if (!identifier.trim()) return { ok: false, error: 'Enter your email or phone number.' };
    return { ok: true };
  },

  async verifyOtp(code: string): Promise<{ ok: boolean; error?: string }> {
    await delay(600);
    if (code === MOCK_OTP) return { ok: true };
    return { ok: false, error: 'That code doesn\'t match. Check and try again.' };
  },

  async resetPassword(emailOrPhone: string): Promise<{ ok: boolean; error?: string }> {
    await delay(500);
    const q = emailOrPhone.trim().toLowerCase();
    const exists = useComuta
      .getState()
      .users.some((u) => u.email.toLowerCase() === q || normalizeNgPhone(u.phone) === normalizeNgPhone(q));
    if (!exists) return { ok: false, error: 'No account found with that email or phone.' };
    return { ok: true };
  },

  async setNewPassword(identifier: string, password: string): Promise<{ ok: boolean; error?: string }> {
    await delay(500);
    const q = identifier.trim().toLowerCase();
    const user = useComuta
      .getState()
      .users.find((u) => u.email.toLowerCase() === q || normalizeNgPhone(u.phone) === normalizeNgPhone(q));
    if (!user) return { ok: false, error: 'Account not found.' };
    useComuta.getState().updateUser(user.id, { password });
    return { ok: true };
  },

  switchMode(role: Role) {
    const { session } = useComuta.getState();
    if (!session) return;
    const user = useComuta.getState().users.find((u) => u.id === session.userId);
    useComuta.getState().setSession({
      ...session,
      role,
      driverOnboarded: role === 'driver' ? session.driverOnboarded || user?.role === 'driver' : session.driverOnboarded,
    });
  },

  logout() {
    useComuta.getState().setSession(null);
  },

  refresh() {
    useComuta.getState().refreshCalendar();
  },

  clearLocalState() {
    useComuta.getState().clearAll();
  },

  async submitVerification(userId: string, idType: string, _fileName: string): Promise<{ status: VerificationStatus }> {
    await delay(1600);
    useComuta.getState().setUserVerification(userId, 'verified');
    useComuta.getState().completeKyc(userId);
    const user = useComuta.getState().users.find((u) => u.id === userId);
    if (user) {
      useComuta.getState().pushNotification(userId, 'Identity verified', `Your ${idType} was verified. You're cleared to book.`, 'system');
      useComuta.getState().updateUser(userId, { idType: idType as User['idType'], verificationStatus: 'verified' });
    }
    return { status: 'verified' };
  },

  accountName(userId: string) {
    const user = useComuta.getState().users.find((u) => u.id === userId);
    return user ? fullName(user) : '';
  },

  getUser(userId: string) {
    return useComuta.getState().users.find((u) => u.id === userId) ?? null;
  },

  getSeededRider() {
    return TEST_ACCOUNTS.primary;
  },
};
