import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Car as CarIcon, Clock, MapPin } from 'lucide-react';
import { Page, Avatar, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { Stepper } from '../../components/ui/Inputs';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { naira, durationLabel } from '../../utils/format';
import { longDayLabel } from '../../utils/dates';

/** Seat selection + booking summary (two steps on one screen flow). */
export function BookingFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const [trip, setTrip] = useState<TripWithMeta | null>(null);
  const [seats, setSeats] = useState(1);
  const [step, setStep] = useState<'seat' | 'summary'>('seat');

  useEffect(() => {
    if (id) tripService.getTrip(id).then(setTrip);
  }, [id]);

  if (!trip) {
    return (
      <Page>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-48 w-full" />
        <Skeleton className="mt-3 h-24 w-full" />
      </Page>
    );
  }

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const hub = hubs.find((h) => h.id === trip.pickupHubId);
  const total = trip.pricePerSeat * seats;

  const continueToPayment = () => navigate(`/app/rider/payment/${trip.id}`, { state: { seats, total } });

  if (step === 'summary') {
    return (
      <Page>
        <button onClick={() => setStep('seat')} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
          <ArrowLeft size={16} /> Edit seats
        </button>
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Review your commute</h1>

        <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-extrabold text-onsurface">
              {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
            </p>
            <span className="text-[16px] font-extrabold text-forest-900">{naira(total)}</span>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-variant">{longDayLabel(trip.date)} · {trip.departureTime} · ~{durationLabel(trip.durationMin)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12.5px] font-semibold text-variant">
            <span className="flex items-center gap-1.5"><MapPin size={13} /> Pickup at {hub?.name}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> Leave by 6:20 AM</span>
          </div>
        </div>

        <section className="mt-3 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center gap-3">
            <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={40} />
            <div className="flex-1">
              <p className="flex items-center gap-1 text-[14px] font-extrabold text-onsurface">
                {trip.driverName} <BadgeCheck size={14} className="text-forest-700" />
              </p>
              <p className="text-[12px] font-semibold text-variant">Verified · {trip.completionRate}% completion</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3 text-[13px] font-semibold text-variant">
            <CarIcon size={15} />
            {trip.vehicle.color} {trip.vehicle.make} {trip.vehicle.model} · <span className="font-mono">{trip.vehicle.plate}</span>
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between text-[13.5px] font-semibold text-variant">
            <span>{seats} seat{seats > 1 ? 's' : ''} × {naira(trip.pricePerSeat)}</span>
            <span className="font-extrabold text-onsurface">{naira(total)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line-soft pt-2 text-[13.5px] font-semibold text-variant">
            <span>Booking protection</span>
            <span className="text-forest-700">Included</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line-soft pt-2 text-[14px] font-extrabold text-onsurface">
            <span>Total</span>
            <span>{naira(total)}</span>
          </div>
          <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-[11.5px] font-semibold leading-relaxed text-variant">
            Free cancellation until the driver confirms. If your driver can't make the trip, we find another option or refund you.
          </p>
        </section>

        <Button block className="mt-5" onClick={continueToPayment}>
          Continue to payment <ArrowRight size={16} />
        </Button>
      </Page>
    );
  }

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Reserve your seat</h1>
      <p className="mt-1 text-[13.5px] text-variant">{from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')} · {longDayLabel(trip.date)} · {trip.departureTime}</p>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-soft">
        <p className="text-[13px] font-extrabold uppercase tracking-wider text-faint">Seats</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <Stepper value={seats} onChange={setSeats} max={Math.min(4, trip.seatsLeft)} />
          <div className="text-right">
            <p className="text-[22px] font-extrabold tracking-tight text-forest-900">{naira(trip.pricePerSeat * seats)}</p>
            <p className="text-[12px] font-semibold text-variant">{naira(trip.pricePerSeat)} per seat</p>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] font-semibold text-variant">{trip.seatsLeft} seat{trip.seatsLeft === 1 ? '' : 's'} left on this trip.</p>
      </div>

      <Button block className="mt-6" onClick={() => setStep('summary')}>
        Continue <ArrowRight size={16} />
      </Button>
    </Page>
  );
}
