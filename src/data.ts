export type Ride = {
  id: string;
  driver: string;
  initials: string;
  avatarColor: string;
  rating: number;
  trips: number;
  from: string;
  pickup: string;
  to: string;
  time: string;
  eta: string;
  price: number;
  seats: number;
  match: number;
  car: string;
  plate: string;
  community: string;
  recurring: boolean;
};

export const rides: Ride[] = [
  {
    id: 'PG-2841', driver: 'Ade Bamidele', initials: 'AB', avatarColor: '#db6b46', rating: 4.9, trips: 184,
    from: 'Ajah', pickup: 'Sangotedo, Novare Mall', to: 'Victoria Island', time: '7:05 AM', eta: '42 mins',
    price: 1500, seats: 2, match: 96, car: 'Toyota Corolla · Silver', plate: 'APP 412 GH', community: 'PadiGo at Sterling', recurring: true,
  },
  {
    id: 'PG-3027', driver: 'Ifeoma Nwosu', initials: 'IN', avatarColor: '#7656b8', rating: 4.8, trips: 96,
    from: 'Ajah', pickup: 'Abraham Adesanya', to: 'Victoria Island', time: '6:55 AM', eta: '47 mins',
    price: 1350, seats: 1, match: 91, car: 'Honda Accord · Black', plate: 'KJA 208 FT', community: 'Lekki Gardens', recurring: true,
  },
  {
    id: 'PG-1913', driver: 'Musa Lawal', initials: 'ML', avatarColor: '#257769', rating: 4.9, trips: 231,
    from: 'Sangotedo', pickup: 'Monastery Road', to: 'Oniru', time: '7:15 AM', eta: '39 mins',
    price: 1250, seats: 3, match: 87, car: 'Kia Rio · Blue', plate: 'GGE 774 BX', community: 'VI Tech Circle', recurring: false,
  },
];

export const communities = [
  { name: 'PadiGo at Sterling', type: 'Workplace', members: '428', routes: 12, color: '#d8f3e5', initials: 'ST' },
  { name: 'Lekki Gardens', type: 'Estate', members: '216', routes: 8, color: '#fff0cd', initials: 'LG' },
  { name: 'VI Tech Circle', type: 'Professional', members: '1.2k', routes: 26, color: '#ece4ff', initials: 'VT' },
  { name: 'UNILAG Community', type: 'University', members: '863', routes: 19, color: '#e1efff', initials: 'UL' },
];

export const formatNaira = (value: number) => `₦${value.toLocaleString('en-NG')}`;
