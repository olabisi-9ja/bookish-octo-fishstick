/**
 * COMUTA mobile store — single source of truth for UI state.
 *
 * Uses Zustand with MMKV persistence (replaces localStorage from PWA).
 * Services in `src/services` are the only layer that mutates this store,
 * mirroring how API calls would work later.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './storage';
import type {
  AppNotification,
  AppState,
  Booking,
  DayIndex,
  DriverProfile,
  Incident,
  Payment,
  PayoutRecord,
  RecurringRoute,
  Settings,
  SupportTicket,
  Trip,
  TripStatus,
  TrustedContact,
  User,
  Vehicle,
  VerificationStatus,
} from '../types';
import { buildSeed, shiftSeedDates } from '../data/seed';
import { nid, pinCode, refCode } from '../utils/format';
import { addDaysISO, todayISO } from '../utils/dates';

const STORAGE_KEY = 'comuta.mobile.v1';

// ─── MMKV storage adapter for Zustand ────────────────────────

// storage comes from ./storage

// ─── Store interface ─────────────────────────────────────────

interface ComutaStore extends AppState {
  // lifecycle
  clearAll: () => void;
  refreshCalendar: () => void;
  // auth
  setSession: (session: AppState['session']) => void;
  setUserVerification: (userId: string, status: VerificationStatus) => void;
  completeKyc: (userId: string) => void;
  completeDriverOnboarding: (userId: string) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, patch: Partial<User>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  setDriverProfile: (profile: DriverProfile) => void;
  // notifications
  pushNotification: (userId: string, title: string, body: string, kind: AppNotification['kind']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  // trips
  updateTrip: (tripId: string, patch: Partial<Trip>) => void;
  addTrip: (trip: Trip) => void;
  // bookings
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, patch: Partial<Booking>) => void;
  addPayment: (payment: Payment) => void;
  // routes
  addRoute: (route: RecurringRoute) => void;
  updateRoute: (routeId: string, patch: Partial<RecurringRoute>) => void;
  deleteRoute: (routeId: string) => void;
  // safety
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, patch: Partial<Incident>) => void;
  // support
  addTicket: (ticket: SupportTicket) => void;
  replyTicket: (ticketId: string, from: 'user' | 'support', text: string) => void;
  // contacts & settings
  addTrustedContact: (c: TrustedContact) => void;
  removeTrustedContact: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addPayout: (p: PayoutRecord) => void;
  setActiveTrip: (tripId?: string) => void;
}

function seed() {
  const state = buildSeed();
  return shiftSeedDates(state);
}

function notify(
  _state: ComutaStore,
  userId: string,
  title: string,
  body: string,
  kind: AppNotification['kind'],
): AppNotification {
  return { id: nid('ntf'), userId, title, body, kind, read: false, at: new Date().toISOString() };
}

// ─── Create store ────────────────────────────────────────────

export const useComuta = create<ComutaStore>()(
  persist(
    (set, get) => ({
      ...seed(),

      clearAll: () => {
        storage.clearAll();
        set({ ...seed() });
      },

      refreshCalendar: () => {
        const shifted = shiftSeedDates(get());
        if (shifted !== get()) set({ ...shifted });
      },

      setSession: (session) => set({ session }),

      setUserVerification: (userId, status) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, verificationStatus: status } : u)),
        })),

      completeKyc: (userId) =>
        set((s) => ({
          session: s.session?.userId === userId ? { ...s.session, kycComplete: true } : s.session,
        })),

      completeDriverOnboarding: (userId) =>
        set((s) => ({
          session: s.session?.userId === userId ? { ...s.session, driverOnboarded: true, role: 'driver' } : s.session,
          users: s.users.map((u) => (u.id === userId ? { ...u, role: 'driver' } : u)),
        })),

      addUser: (user) => set((s) => ({ users: [...s.users, user] })),

      updateUser: (userId, patch) =>
        set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)) })),

      addVehicle: (vehicle) => set((s) => ({ vehicles: [vehicle, ...s.vehicles] })),

      setDriverProfile: (profile) =>
        set((s) => ({ driverProfiles: { ...s.driverProfiles, [profile.userId]: profile } })),

      pushNotification: (userId, title, body, kind) =>
        set((s) => ({ notifications: [notify(s, userId, title, body, kind), ...s.notifications] })),

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

      markAllNotificationsRead: (userId) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)) })),

      updateTrip: (tripId, patch) =>
        set((s) => ({ trips: s.trips.map((t) => (t.id === tripId ? { ...t, ...patch } : t)) })),

      addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),

      addBooking: (booking) => set((s) => ({ bookings: [booking, ...s.bookings] })),

      updateBooking: (bookingId, patch) =>
        set((s) => ({ bookings: s.bookings.map((b) => (b.id === bookingId ? { ...b, ...patch } : b)) })),

      addPayment: (payment) => set((s) => ({ payments: [payment, ...s.payments] })),

      addRoute: (route) => set((s) => ({ routes: [route, ...s.routes] })),

      updateRoute: (routeId, patch) =>
        set((s) => ({ routes: s.routes.map((r) => (r.id === routeId ? { ...r, ...patch } : r)) })),

      deleteRoute: (routeId) => set((s) => ({ routes: s.routes.filter((r) => r.id !== routeId) })),

      addIncident: (incident) => set((s) => ({ incidents: [incident, ...s.incidents] })),

      updateIncident: (id, patch) =>
        set((s) => ({ incidents: s.incidents.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),

      addTicket: (ticket) => set((s) => ({ tickets: [ticket, ...s.tickets] })),

      replyTicket: (ticketId, from, text) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status: from === 'user' ? t.status : t.status === 'open' ? 'in_progress' : t.status,
                  messages: [...t.messages, { id: nid('msg'), from, text, at: new Date().toISOString() }],
                }
              : t,
          ),
        })),

      addTrustedContact: (c) => set((s) => ({ trustedContacts: [...s.trustedContacts, c] })),

      removeTrustedContact: (id) =>
        set((s) => ({ trustedContacts: s.trustedContacts.filter((c) => c.id !== id) })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addPayout: (p) => set((s) => ({ payouts: [p, ...s.payouts] })),

      setActiveTrip: (tripId) => set({ activeTripId: tripId }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => storage),
      version: 1,
      partialize: (s) => {
        const {
          clearAll,
          refreshCalendar,
          setSession,
          setUserVerification,
          completeKyc,
          completeDriverOnboarding,
          addUser,
          updateUser,
          addVehicle,
          setDriverProfile,
          pushNotification,
          markNotificationRead,
          markAllNotificationsRead,
          updateTrip,
          addTrip,
          addBooking,
          updateBooking,
          addPayment,
          addRoute,
          updateRoute,
          deleteRoute,
          addIncident,
          updateIncident,
          addTicket,
          replyTicket,
          addTrustedContact,
          removeTrustedContact,
          updateSettings,
          addPayout,
          setActiveTrip,
          ...rest
        } = s;
        return rest;
      },
    },
  ),
);

/** Action helpers (re-exports so services don't need the store import). */
export function newBookingId() {
  return nid('b');
}
export function newTripPin() {
  return pinCode();
}
export function newReference() {
  return refCode();
}
