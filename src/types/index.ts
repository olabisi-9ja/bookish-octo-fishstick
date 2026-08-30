/**
 * COMUTA domain model  -  frontend types.
 * These mirror the future API contracts (Supabase/Postgres) so the mocked
 * services can later be swapped for real HTTP calls without touching the UI.
 */

export type Role = 'rider' | 'driver';

export type TripStatus =
  | 'scheduled'
  | 'confirmation_pending'
  | 'confirmed'
  | 'at_risk'
  | 'pickup'
  | 'departed'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'refunded';

/** 0 = Sunday … 6 = Saturday */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type IdType = 'NIN' | "Driver's licence" | "Voter's card" | 'International passport';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Plain text only in the mock auth service  -  never in a real backend. */
  password: string;
  role: Role;
  verificationStatus: VerificationStatus;
  idType?: IdType;
  photoInitials: string;
  avatarColor: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  seats: number;
  year: number;
}

export interface DriverProfile {
  userId: string;
  licenceNumber: string;
  vehicleId: string;
  completedTrips: number;
  completionRate: number; // 0-100
  onTimeRate: number; // 0-100
  lateCancellations: number;
  noShows: number;
  monthlyTrips: number;
  monthlyPassengers: number;
  monthlyRecovered: number; // naira recovered this month
}

export interface Hub {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  address: string;
  safetyNote: string;
}

export interface RecurringRoute {
  id: string;
  ownerId: string;
  fromId: string;
  toId: string;
  days: DayIndex[];
  time: string; // "7:00 AM"
  recurring: boolean;
  seats: number;
  pricePerSeat: number;
  active: boolean;
  paused: boolean;
  createdAt: string;
}

export interface Trip {
  id: string;
  routeId?: string; // recurring route it belongs to (driver's own route)
  driverId: string;
  fromId: string;
  toId: string;
  pickupHubId: string;
  date: string; // ISO date "2026-08-31"
  departureTime: string; // "7:00 AM"
  arrivalTime: string;
  durationMin: number;
  distanceKm: number;
  pricePerSeat: number;
  seatsTotal: number;
  seatsLeft: number;
  driverConfirmed: boolean;
  status: TripStatus;
  pin: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  tripId: string;
  riderId: string;
  seats: number;
  amount: number; // per seat
  total: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  pin: string;
  rated?: boolean;
  rating?: number;
  ratingComment?: string;
  refundRequested?: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  riderId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: 'trip' | 'booking' | 'payment' | 'safety' | 'route' | 'system';
  read: boolean;
  at: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface Incident {
  id: string;
  tripId: string;
  userId: string;
  kind: 'sos' | 'deviation' | 'report';
  note: string;
  at: string;
  status: 'open' | 'acknowledged' | 'closed';
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  tripRef?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: { id: string; from: 'user' | 'support'; text: string; at: string }[];
}

export interface SearchQuery {
  fromId: string;
  toId: string;
  date: string; // ISO date
  time: string; // "7:00 AM"
}

export interface PayoutRecord {
  id: string;
  driverId: string;
  amount: number;
  status: 'pending' | 'completed';
  method: string;
  note: string;
  createdAt: string;
}

export interface Settings {
  language: string;
  appearance: 'light' | 'dark' | 'system';
  pushNotifications: boolean;
  emailNotifications: boolean;
  shareTripDefault: boolean;
}

export interface AppState {
  seededDay: string;
  session: {
    userId: string;
    role: Role;
    onboarded: boolean; // finished onboarding + auth
    kycComplete: boolean;
    driverOnboarded: boolean;
  } | null;
  users: User[];
  vehicles: Vehicle[];
  driverProfiles: Record<string, DriverProfile>;
  hubs: Hub[];
  trips: Trip[];
  bookings: Booking[];
  payments: Payment[];
  routes: RecurringRoute[];
  notifications: AppNotification[];
  incidents: Incident[];
  tickets: SupportTicket[];
  trustedContacts: TrustedContact[];
  payouts: PayoutRecord[];
  settings: Settings;
  activeTripId?: string;
}

export interface AuthSession {
  userId: string;
  role: Role;
}
