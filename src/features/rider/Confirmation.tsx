import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { Page, Skeleton, StatusChip } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { BookingSuccessArt } from '../../components/illustrations/Illustrations';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { longDayLabel } from '../../utils/dates';

/** The signature COMUTA moment — car travels the route, checkmark pops, "You're booked." */
export function Confirmation() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const session = useComuta((s) => s.session);
  const [trip, setTrip] = useState<TripWithMeta | null>(null);

  useEffect(() => {
    if (id) tripService.getTrip(id).then(setTrip);
  }, [id]);

  if (!trip) {
    return (
      <Page>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="mt-4 h-24 w-full" />
      </Page>
    );
  }

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const booking = session ? tripService.bookingFor(session.userId, trip.id) : undefined;

  return (
    <Page className="flex flex-col items-center px-2 pt-6 text-center">
      <div className="w-full max-w-[300px]">
        <BookingSuccessArt />
      </div>

      <h1 className="mt-2 text-[30px] font-extrabold tracking-tight text-onsurface">You're booked.</h1>
      <p className="mt-2 text-[15px] font-bold text-onsurface">
        {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
      </p>
      <p className="mt-1 text-[13.5px] text-variant">
        {longDayLabel(trip.date)} · {trip.departureTime} · {naira(booking?.total ?? trip.pricePerSeat)}
      </p>

      <div className="mt-6 w-full space-y-2">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-4 text-left">
          <div>
            <p className="text-[13px] font-extrabold text-onsurface">Seat 1 confirmed</p>
            <p className="text-[12px] font-semibold text-variant">Payment successful · {trip.driverName}</p>
          </div>
          <StatusChip label="Paid" tone="green" dot />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-4 text-left">
          <div>
            <p className="text-[13px] font-extrabold text-onsurface">Driver confirmation pending</p>
            <p className="text-[12px] font-semibold text-variant">Your driver confirms by 11:00 PM today</p>
          </div>
          <StatusChip label="Pending" tone="amber" dot pulse />
        </div>
      </div>

      <p className="mt-4 text-[12.5px] font-semibold leading-relaxed text-variant">
        We'll notify you the moment your driver confirms. If they can't make it, we find another option or refund you.
      </p>

      <div className="mt-6 flex w-full gap-3">
        <Button block onClick={() => navigate(`/app/rider/trip/${trip.id}`)}>
          View trip
        </Button>
        <Button variant="secondary" className="w-32" onClick={() => navigate(`/app/rider/trip/${trip.id}?share=1`)}>
          <Share2 size={16} /> Share
        </Button>
      </div>
    </Page>
  );
}
