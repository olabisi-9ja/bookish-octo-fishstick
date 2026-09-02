/**
 * Geo/distance utilities — ported from PWA src/utils/geo.ts
 */

/** Haversine distance between two lat/lng points in km. */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Estimate road distance from haversine (×1.18 road factor). */
export function estimateRoadDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  return haversineKm(lat1, lng1, lat2, lng2) * 1.18;
}

/** Estimate driving duration in minutes from distance. */
export function estimateDurationMin(distanceKm: number): number {
  // Lagos traffic: ~20–30 km/h average → use 25 km/h
  return Math.round((distanceKm / 25) * 60);
}

/** Format lat/lng for debug display. */
export function formatCoord(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
}
