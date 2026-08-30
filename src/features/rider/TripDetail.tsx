import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Car as CarIcon, Clock, MapPin, Users } from 'lucide-react';
import { Page, Avatar, StatusChip, TRIP_STATUS_TONE, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { ComutaMap } from '../../components/map/ComutaMap';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { naira, durationLabel } from '../../utils/format';
import { longDayLabel } from '../../utils/dates';
import { TRIP_STATUS_LABEL } from '../../constants';
import { DURATION } from '../../constants';

export function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const [trip, setTrip] = useState<TripWithMeta | null>(null);

  useEffect(() => {
    if (id) tripService.getTrip(id).then(setTrip);
  }, [id]);

  if (!trip) {
    return (
      <Page>
        <div className="space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </Page>
    );
  }

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const hub = hubs.find((h) => h.id === trip.pickupHubId);

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Trip details</h1>
        <StatusChip label={TRIP_STATUS_LABEL[trip.status]} tone={TRIP_STATUS_TONE[trip.status]} dot />
      </div>

      {/* Route summary */}
      <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-extrabold tracking-tight text-onsurface">
            {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
          </p>
          <span className="text-[16px] font-extrabold text-forest-900">{naira(trip.pricePerSeat)}</span>
        </div>
        <p className="mt-1 text-[13px] font-semibold text-variant">
          {longDayLabel(trip.date)} · {trip.departureTime}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-faint">
          <Clock size={13} /> ~{durationLabel(trip.durationMin)} · {trip.distanceKm} km
        </div>
        <ComutaMap from={from} to={to} height={150} className="mt-3" label={false} />
      </div>

      {/* Driver */}
      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-faint">Driver</h2>
        <div className="mt-3 flex items-center gap-3">
          <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={48} />
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-[15px] font-extrabold text-onsurface">
              {trip.driverName}
              <BadgeCheck size={15} className="text-forest-700" aria-label="Verified" />
            </p>
            <p className="text-[12px] font-semibold text-variant">
              Verified driver · {trip.completionRate}% completion · {trip.onTimeRate}% on time
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle */}
      <section className="mt-3 rounded-2xl border border-line bg-white p-4">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-faint">Vehicle</h2>
        <div className="mt-2 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2">
            <CarIcon size={19} className="text-forest-700" />
          </span>
          <p className="text-[14px] font-extrabold text-onsurface">
            {trip.vehicle.color} {trip.vehicle.make} {trip.vehicle.model}
          </p>
          <span className="ml-auto font-mono text-[13px] font-bold text-variant">{trip.vehicle.plate}</span>
        </div>
      </section>

      {/* Pickup */}
      <section className="mt-3 rounded-2xl border border-line bg-white p-4">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-faint">Pickup</h2>
        <div className="mt-2 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2">
            <MapPin size={19} className="text-forest-700" />
          </span>
          <div>
            <p className="text-[14px] font-extrabold text-onsurface">{hub?.name}</p>
            <p className="text-[12.5px] font-semibold text-variant">{hub?.address}</p>
            <p className="mt-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-[12px] font-semibold text-variant">{hub?.safetyNote}</p>
          </div>
        </div>
      </section>

      {/* Availability + price */}
      <section className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold text-variant">
          <Users size={15} /> {trip.seatsLeft} seat{trip.seatsLeft === 1 ? '' : 's'} left
        </span>
        <span className="text-[14px] font-extrabold text-onsurface">
          {naira(trip.pricePerSeat)} <span className="text-[12px] font-bold text-faint">/ seat</span>
        </span>
      </section>

      <div className="mt-5 space-y-2 pb-2">
        <Button
          block
          disabled={trip.seatsLeft === 0}
          onClick={() => navigate(`/app/rider/book/${trip.id}`)}
        >
          Reserve 1 seat · {naira(trip.pricePerSeat)}
        </Button>
        {trip.seatsLeft === 0 && <p className="text-center text-[12.5px] font-semibold text-faint">This trip is full.</p>}
      </div>
    </Page>
  );
}
