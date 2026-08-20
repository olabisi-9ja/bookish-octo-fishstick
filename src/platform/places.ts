import type { Place } from './types';

export const PLACES: Place[] = [
  { id: 'ajah', name: 'Ajah', area: 'Ajah', city: 'Lagos', lat: 6.4698, lng: 3.5719 },
  { id: 'sangotedo', name: 'Sangotedo', area: 'Sangotedo', city: 'Lagos', lat: 6.4642, lng: 3.5579 },
  { id: 'novare', name: 'Novare Mall, Sangotedo', area: 'Sangotedo', city: 'Lagos', lat: 6.461, lng: 3.5565 },
  { id: 'adesanya', name: 'Abraham Adesanya Estate Gate', area: 'Ajah', city: 'Lagos', lat: 6.4515, lng: 3.575 },
  { id: 'monastery', name: 'Monastery Road', area: 'Sangotedo', city: 'Lagos', lat: 6.458, lng: 3.541 },
  { id: 'vi', name: 'Victoria Island', area: 'Victoria Island', city: 'Lagos', lat: 6.4281, lng: 3.4219 },
  { id: 'oniru', name: 'Oniru', area: 'Victoria Island', city: 'Lagos', lat: 6.434, lng: 3.44 },
  { id: 'ozumba', name: 'Ozumba Mbadiwe, VI', area: 'Victoria Island', city: 'Lagos', lat: 6.437, lng: 3.415 },
  { id: 'sterling', name: 'Sterling Towers, Marina', area: 'Victoria Island', city: 'Lagos', lat: 6.435, lng: 3.401 },
  { id: 'ikeja', name: 'Ikeja', area: 'Ikeja', city: 'Lagos', lat: 6.6018, lng: 3.3515 },
  { id: 'yaba', name: 'Yaba', area: 'Yaba', city: 'Lagos', lat: 6.5095, lng: 3.371 },
  { id: 'lekki', name: 'Lekki Phase 1', area: 'Lekki', city: 'Lagos', lat: 6.4474, lng: 3.4722 },
  { id: 'berger', name: 'Berger', area: 'Ojodu', city: 'Lagos', lat: 6.634, lng: 3.337 },
  { id: 'ikorodu', name: 'Ikorodu', area: 'Ikorodu', city: 'Lagos', lat: 6.6194, lng: 3.5105 },
  { id: 'chevron', name: 'Chevron Estate', area: 'Lekki', city: 'Lagos', lat: 6.4412, lng: 3.536 },
  { id: 'lawschool', name: 'Nigerian Law School, VI', area: 'Victoria Island', city: 'Lagos', lat: 6.426, lng: 3.416 },
  { id: 'oniru-market', name: 'Oniru Market', area: 'Victoria Island', city: 'Lagos', lat: 6.4315, lng: 3.438 },
  { id: 'unilag', name: 'University of Lagos', area: 'Akoka', city: 'Lagos', lat: 6.5158, lng: 3.3891 },
  { id: 'lekki-gardens', name: 'Lekki Gardens', area: 'Ajah', city: 'Lagos', lat: 6.467, lng: 3.585 },
];

export function placeById(id: string) {
  return PLACES.find((place) => place.id === id) ?? PLACES[0];
}

export function searchPlaces(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return PLACES.slice(0, 8);
  return PLACES.filter(
    (place) =>
      place.name.toLowerCase().includes(q) ||
      place.area.toLowerCase().includes(q) ||
      place.city.toLowerCase().includes(q),
  );
}
