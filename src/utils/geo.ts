import type { Hub } from '../types';

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function estimateDurationMin(distanceKm: number) {
  const traffic = distanceKm > 18 ? 1.55 : 1.4;
  return Math.max(18, Math.round((distanceKm / 28) * 60 * traffic));
}

export function hubDistanceKm(a: Hub, b: Hub) {
  return Math.round(haversineKm(a, b) * 10) / 10;
}

export function distanceLabel(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

/**
 * A simple corridor polyline (two-segment curve) between two hubs.
 * The real app will replace this with a Mapbox/Google route; the ComutaMap
 * component keeps this abstraction so parents never change.
 */
export function routePolyline(a: Hub, b: Hub) {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  // control points give the route a believable road-like bend
  return [
    [a.lng, a.lat] as const,
    [a.lng + dx * 0.5 + dy * 0.22, a.lat + dy * 0.5 - dx * 0.22] as const,
    [b.lng, b.lat] as const,
  ];
}

export function fitBounds(points: Array<[number, number]>, pad = 0.05) {
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const lngPad = Math.max((maxLng - minLng) * pad, 0.01);
  const latPad = Math.max((maxLat - minLat) * pad, 0.008);
  return {
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
  };
}
