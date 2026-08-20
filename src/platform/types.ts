export type Role = 'rider' | 'driver';

export type Place = {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
};

export type Community = {
  id: string;
  name: string;
  type: string;
  members: string;
  routes: number;
  color: string;
  initials: string;
};

export type EmergencyContact = {
  name: string;
  phone: string;
  relation: string;
};

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  initials: string;
  avatarColor: string;
  photo?: string;
  rating: number;
  trips: number;
  verified: boolean;
  communityIds: string[];
  emergencyContacts: EmergencyContact[];
  licenceNumber?: string;
  bankName?: string;
  bankLast4?: string;
  cardLast4?: string;
};

export type Vehicle = {
  id: string;
  driverId: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  seats: number;
  year: number;
};

export type RideOffer = {
  id: string;
  driverId: string;
  vehicleId: string;
  fromId: string;
  toId: string;
  pickupId: string;
  dropoffId: string;
  time: string;
  durationMin: number;
  distanceKm: number;
  price: number;
  seats: number;
  seatsLeft: number;
  recurring: boolean;
  days: number[];
  communityId?: string;
  status: 'published' | 'cancelled' | 'completed';
  when: 'today' | 'tomorrow' | 'friday';
};

export type BookingStatus =
  | 'requested'
  | 'declined'
  | 'accepted'
  | 'paid'
  | 'cancelled'
  | 'completed'
  | 'refunded';

export type Booking = {
  id: string;
  rideId: string;
  riderId: string;
  seats: number;
  amount: number;
  protectionFee: number;
  discount: number;
  total: number;
  status: BookingStatus;
  pin: string;
  pickupNote?: string;
  createdAt: string;
  ratedByRider: boolean;
  ratedByDriver: boolean;
};

export type TripStatus =
  | 'scheduled'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type Trip = {
  id: string;
  rideId: string;
  status: TripStatus;
  pin: string;
  etaMinutes: number;
  progress: number;
  startedAt?: string;
  completedAt?: string;
};

export type ChatMessage = {
  id: string;
  tripId: string;
  fromId: string;
  text: string;
  at: string;
};

export type AppNotification = {
  id: string;
  memberId: string;
  title: string;
  body: string;
  kind: 'booking' | 'trip' | 'safety' | 'payment' | 'community' | 'system';
  read: boolean;
  at: string;
};

export type LedgerType =
  | 'ride_payment'
  | 'protection_fee'
  | 'refund'
  | 'tip'
  | 'bonus'
  | 'commission'
  | 'settlement'
  | 'withdrawal'
  | 'adjustment';

export type LedgerEntry = {
  id: string;
  memberId: string;
  type: LedgerType;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  note: string;
  createdAt: string;
};

export type EmergencyEvent = {
  id: string;
  tripId: string;
  memberId: string;
  kind: 'unsafe' | 'sos' | 'report';
  note: string;
  at: string;
  status: 'open' | 'acknowledged' | 'closed';
};

export type TripRating = {
  id: string;
  tripId: string;
  fromId: string;
  toId: string;
  stars: number;
  tags: string[];
  comment: string;
  at: string;
};

export type SearchQuery = {
  fromId: string;
  toId: string;
  time: string;
  seats: number;
  recurring: boolean;
  sort: 'match' | 'price' | 'time';
  verifiedOnly: boolean;
  recurringOnly: boolean;
  communityOnly: boolean;
};

export type MatchBreakdown = {
  route: number;
  pickup: number;
  destination: number;
  time: number;
  rating: number;
  price: number;
  total: number;
};

export type RideCard = {
  id: string;
  driverId: string;
  driver: string;
  initials: string;
  avatarColor: string;
  photo?: string;
  rating: number;
  trips: number;
  from: string;
  pickup: string;
  to: string;
  dropoff: string;
  time: string;
  eta: string;
  price: number;
  seats: number;
  match: number;
  breakdown: MatchBreakdown;
  car: string;
  plate: string;
  community: string;
  recurring: boolean;
  durationMin: number;
  distanceKm: number;
  verified: boolean;
};

export type Session = {
  memberId: string;
  role: Role;
  onboarded: boolean;
  driverOnboarded: boolean;
};

export type PlatformState = {
  version: 1;
  session: Session | null;
  members: Member[];
  vehicles: Vehicle[];
  rides: RideOffer[];
  bookings: Booking[];
  trips: Trip[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  ledger: LedgerEntry[];
  emergencies: EmergencyEvent[];
  ratings: TripRating[];
  communities: Community[];
  search: SearchQuery;
};
