import { clamp, haversineKm, parseClock } from './geo';
import { quoteRoute } from './pricing';
import type { MatchBreakdown, Member, Place, RideOffer, SearchQuery } from './types';

const WEIGHTS = {
  route: 40,
  pickup: 20,
  destination: 15,
  time: 10,
  rating: 5,
  price: 10,
};

function proximityScore(km: number, maxKm: number) {
  return clamp(1 - km / maxKm);
}

function timeScore(searchTime: string, rideTime: string) {
  const delta = Math.abs(parseClock(searchTime) - parseClock(rideTime));
  if (delta <= 10) return 1;
  if (delta <= 20) return 0.85;
  if (delta <= 35) return 0.6;
  if (delta <= 50) return 0.35;
  return clamp(1 - delta / 90);
}

export function scoreMatch(
  searchFrom: Place,
  searchTo: Place,
  pickupPlace: Place,
  dropoffPlace: Place,
  driverOrigin: Place,
  driverDest: Place,
  ride: RideOffer,
  driver: Member,
  search: SearchQuery,
): MatchBreakdown {
  const driverKm = Math.max(haversineKm(driverOrigin, driverDest), 1);
  const viaRider =
    haversineKm(driverOrigin, searchFrom) +
    haversineKm(searchFrom, searchTo) +
    haversineKm(searchTo, driverDest);
  const detour = Math.max(0, viaRider - driverKm);
  const route = clamp(1 - detour / Math.max(driverKm, 8));

  const pickupKm = haversineKm(searchFrom, pickupPlace);
  const destKm = haversineKm(searchTo, dropoffPlace);
  const pickup = proximityScore(pickupKm, 8);
  const destination = proximityScore(destKm, 8);
  const time = timeScore(search.time, ride.time);
  const rating = clamp((driver.rating - 4) / 1);
  const fair = quoteRoute(searchFrom, searchTo).seat;
  const price = clamp(1 - Math.abs(ride.price - fair) / Math.max(fair, 1));

  const raw =
    route * WEIGHTS.route +
    pickup * WEIGHTS.pickup +
    destination * WEIGHTS.destination +
    time * WEIGHTS.time +
    rating * WEIGHTS.rating +
    price * WEIGHTS.price;

  const communityBoost = search.communityOnly && ride.communityId ? 3 : 0;
  const total = Math.round(clamp((raw + communityBoost) / 100, 0, 1) * 100);

  return {
    route: Math.round(route * WEIGHTS.route),
    pickup: Math.round(pickup * WEIGHTS.pickup),
    destination: Math.round(destination * WEIGHTS.destination),
    time: Math.round(time * WEIGHTS.time),
    rating: Math.round(rating * WEIGHTS.rating),
    price: Math.round(price * WEIGHTS.price),
    total,
  };
}

export { WEIGHTS as MATCH_WEIGHTS };
