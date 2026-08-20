import { COMMUNITIES, formatNaira, type RideCard } from './platform';
import { createSeedState } from './platform/seed';
import { placeById } from './platform/places';
import { durationLabel } from './platform/geo';
import { scoreMatch } from './platform/matching';
import { fullName } from './platform/format';

export type Ride = RideCard;
export { formatNaira };

const seed = createSeedState();

export const rides: Ride[] = seed.rides
  .filter((ride) => ['PG2841', 'PG3027', 'PG1913'].includes(ride.id))
  .map((ride) => {
    const driver = seed.members.find((member) => member.id === ride.driverId)!;
    const vehicle = seed.vehicles.find((item) => item.id === ride.vehicleId)!;
    const from = placeById(ride.fromId);
    const to = placeById(ride.toId);
    const pickup = placeById(ride.pickupId);
    const dropoff = placeById(ride.dropoffId);
    const breakdown = scoreMatch(placeById('ajah'), placeById('vi'), pickup, dropoff, from, to, ride, driver, seed.search);
    return {
      id: ride.id,
      driverId: driver.id,
      driver: fullName(driver),
      initials: driver.initials,
      avatarColor: driver.avatarColor,
      photo: driver.photo,
      rating: driver.rating,
      trips: driver.trips,
      from: from.name,
      pickup: pickup.name,
      to: to.name,
      dropoff: dropoff.name,
      time: ride.time,
      eta: durationLabel(ride.durationMin),
      price: ride.price,
      seats: ride.seatsLeft,
      match: breakdown.total,
      breakdown,
      car: `${vehicle.make} ${vehicle.model} · ${vehicle.color}`,
      plate: vehicle.plate,
      community: seed.communities.find((community) => community.id === ride.communityId)?.name ?? '',
      recurring: ride.recurring,
      durationMin: ride.durationMin,
      distanceKm: ride.distanceKm,
      verified: driver.verified,
    };
  });

export const communities = COMMUNITIES.map(({ name, type, members, routes, color, initials }) => ({
  name,
  type,
  members,
  routes,
  color,
  initials,
}));
