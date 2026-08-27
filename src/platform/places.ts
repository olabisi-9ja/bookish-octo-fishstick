import type { Place, Hub } from './types';

export const HUBS: Hub[] = [
  {
    id: 'ikorodu-hub',
    name: 'Ikorodu Hub',
    corridor: 'Ikorodu ↔ Victoria Island Expressway',
    area: 'Ikorodu',
    gateInfo: 'Main Gate · Well-lit pickup point & verified commuter waiting bay',
    lighting: 'well-lit',
    lat: 6.6194,
    lng: 3.5105,
    verified: true,
  },
  {
    id: 'vi-hub',
    name: 'Victoria Island Hub',
    corridor: 'Victoria Island / Marina Financial District',
    area: 'Victoria Island',
    gateInfo: 'Ozumba Mbadiwe & Sterling Towers · Commuter drop-off point',
    lighting: 'well-lit',
    lat: 6.4281,
    lng: 3.4219,
    verified: true,
  },
  {
    id: 'ikeja-hub',
    name: 'Ikeja Hub',
    corridor: 'Mainland Commercial Corridor',
    area: 'Ikeja',
    gateInfo: 'Maryland Mall / Allen Avenue Transit Point',
    lighting: 'well-lit',
    lat: 6.6018,
    lng: 3.3515,
    verified: true,
  },
  {
    id: 'lekki-hub',
    name: 'Lekki Phase 1 Hub',
    corridor: 'Lekki-Epe Expressway',
    area: 'Lekki Phase 1',
    gateInfo: 'Admiralty Way Entrance Bay',
    lighting: 'well-lit',
    lat: 6.4474,
    lng: 3.4722,
    verified: true,
  },
  {
    id: 'yaba-hub',
    name: 'Yaba Hub',
    corridor: 'Yaba Tech / Herbert Macaulay Corridor',
    area: 'Yaba',
    gateInfo: 'Commercial Avenue & UNILAG Junction',
    lighting: 'well-lit',
    lat: 6.5095,
    lng: 3.371,
    verified: true,
  },
  {
    id: 'berger-hub',
    name: 'Berger Hub',
    corridor: 'Lagos-Ibadan Expressway Gateway',
    area: 'Ojodu Berger',
    gateInfo: 'Berger Bus Stop Interchange Bay',
    lighting: 'standard',
    lat: 6.634,
    lng: 3.337,
    verified: true,
  },
  {
    id: 'ajah-hub',
    name: 'Ajah Hub',
    corridor: 'Lekki-Ajah Corridor',
    area: 'Ajah',
    gateInfo: 'Novare Mall & Jubilee Bridge Hub',
    lighting: 'well-lit',
    lat: 6.4698,
    lng: 3.5719,
    verified: true,
  },
];

export const PLACES: Place[] = [
  {
    id: 'ikorodu-hub',
    name: 'Ikorodu Hub',
    area: 'Ikorodu',
    city: 'Lagos',
    lat: 6.6194,
    lng: 3.5105,
    isHub: true,
    hubGate: 'Main Gate · Well-lit pickup point',
  },
  {
    id: 'vi-hub',
    name: 'Victoria Island Hub',
    area: 'Victoria Island',
    city: 'Lagos',
    lat: 6.4281,
    lng: 3.4219,
    isHub: true,
    hubGate: 'Ozumba Mbadiwe / Sterling Towers',
  },
  {
    id: 'ikeja-hub',
    name: 'Ikeja Hub',
    area: 'Ikeja',
    city: 'Lagos',
    lat: 6.6018,
    lng: 3.3515,
    isHub: true,
    hubGate: 'Maryland / Allen Junction',
  },
  {
    id: 'lekki-hub',
    name: 'Lekki Phase 1 Hub',
    area: 'Lekki Phase 1',
    city: 'Lagos',
    lat: 6.4474,
    lng: 3.4722,
    isHub: true,
    hubGate: 'Admiralty Way Hub',
  },
  {
    id: 'yaba-hub',
    name: 'Yaba Hub',
    area: 'Yaba',
    city: 'Lagos',
    lat: 6.5095,
    lng: 3.371,
    isHub: true,
    hubGate: 'Commercial Avenue',
  },
  {
    id: 'berger-hub',
    name: 'Berger Hub',
    area: 'Ojodu Berger',
    city: 'Lagos',
    lat: 6.634,
    lng: 3.337,
    isHub: true,
    hubGate: 'Berger Interchange',
  },
  {
    id: 'ajah-hub',
    name: 'Ajah Hub',
    area: 'Ajah',
    city: 'Lagos',
    lat: 6.4698,
    lng: 3.5719,
    isHub: true,
    hubGate: 'Novare Mall Main Gate',
  },
  { id: 'oniru', name: 'Oniru Hub', area: 'Victoria Island', city: 'Lagos', lat: 6.434, lng: 3.44, isHub: true, hubGate: 'Oniru Market Point' },
  { id: 'sangotedo', name: 'Sangotedo Hub', area: 'Sangotedo', city: 'Lagos', lat: 6.4642, lng: 3.5579, isHub: true, hubGate: 'Monastery Road' },
  { id: 'chevron', name: 'Chevron Hub', area: 'Lekki', city: 'Lagos', lat: 6.4412, lng: 3.536, isHub: true, hubGate: 'Chevron Estate Gate' },
  { id: 'unilag', name: 'UNILAG Gate Hub', area: 'Akoka', city: 'Lagos', lat: 6.5158, lng: 3.3891, isHub: true, hubGate: 'University Main Gate' },
];

export function placeById(id: string): Place {
  return PLACES.find((place) => place.id === id) ?? PLACES[0];
}

export function hubById(id: string): Hub | undefined {
  return HUBS.find((h) => h.id === id);
}

export function searchPlaces(query: string): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) return PLACES.slice(0, 8);
  return PLACES.filter(
    (place) =>
      place.name.toLowerCase().includes(q) ||
      place.area.toLowerCase().includes(q) ||
      place.city.toLowerCase().includes(q) ||
      (place.hubGate && place.hubGate.toLowerCase().includes(q)),
  );
}
