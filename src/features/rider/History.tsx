import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Page, Avatar, StatusChip, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { dayLabel } from '../../utils/dates';
import type { Booking } from '../../types';

type Tab = 'upcoming' | 'completed' | 'cancelled';

export function History() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const hubs = useComuta((s) => s.hubs);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [upcoming, setUpcoming] = useState<{ trip: TripWithMeta; booking: Booking }[] | null>(null);
  const [history, setHistory] = useState<{ trip: TripWithMeta; booking: Booking }[] | null>(null);

  useEffect(() => {
    if (!session) return;
    tripService.getUpcomingTrips(session.userId).then(setUpcoming);
    tripService.getHistory(session.userId).then(setHistory);
  }, [session]);

  const loading = !upcoming || !history;
  const cancelled = (history ?? []).filter((h) => h.trip.status === 'cancelled');
  const completed = (history ?? []).filter((h) => h.trip.status === 'completed');

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Trips</h1>

      <div className="mt-4 flex gap-1 rounded-xl bg-surface-2 p-1" role="tablist">
        {(
          [
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg py-2 text-[13px] font-bold tap ${tab === t.id ? 'bg-white text-forest-900 shadow-sm' : 'text-variant'}`}
          >
            {t.label}
            {t.id === 'upcoming' && upcoming && upcoming.length > 0 && (
              <span className="ml-1 text-[11px] text-faint">({upcoming.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : tab === 'upcoming' ? (
          upcoming.length === 0 ? (
            <EmptyTrips onPlan={() => navigate('/app/rider/plan')} />
          ) : (
            upcoming.map(({ trip, booking }) => (
              <button
                key={booking.id}
                onClick={() => navigate(`/app/rider/trip/${trip.id}`)}
                className="w-full rounded-2xl border border-line-soft bg-white p-4 text-left shadow-soft tap"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-extrabold text-onsurface">
                    {hubs.find((h) => h.id === trip.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === trip.toId)?.name.replace(' Hub', '')}
                  </p>
                  <StatusChip
                    label={trip.status === 'confirmed' ? 'Confirmed' : trip.status === 'at_risk' ? 'At risk' : 'Awaiting driver'}
                    tone={trip.status === 'confirmed' ? 'green' : trip.status === 'at_risk' ? 'red' : 'amber'}
                    dot
                  />
                </div>
                <p className="mt-1 text-[12.5px] font-semibold text-variant">
                  {dayLabel(trip.date)} · {trip.departureTime} · {trip.driverName}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-forest-900">{naira(booking.total)}</span>
                  <span className="text-[12.5px] font-extrabold text-forest-700">View trip →</span>
                </div>
              </button>
            ))
          )
        ) : tab === 'completed' ? (
          completed.length === 0 ? (
            <EmptyTrips onPlan={() => navigate('/app/rider/plan')} />
          ) : (
            completed.map(({ trip, booking }) => (
              <div key={booking.id} className="rounded-2xl border border-line-soft bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-extrabold text-onsurface">
                    {hubs.find((h) => h.id === trip.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === trip.toId)?.name.replace(' Hub', '')}
                  </p>
                  <StatusChip label="Completed" tone="green" dot />
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={30} />
                  <p className="text-[12.5px] font-semibold text-variant">
                    {trip.driverName} · {dayLabel(trip.date)} · {trip.departureTime}
                  </p>
                  <span className="ml-auto text-[13px] font-extrabold text-forest-900">{naira(booking.total)}</span>
                </div>
                {booking.rated ? (
                  <p className="mt-2.5 rounded-lg bg-surface-2 px-3 py-2 text-[12px] font-semibold text-variant">
                    You rated {booking.rating}★ {booking.ratingComment ? ` -  ${booking.ratingComment}”` : ''}
                  </p>
                ) : (
                  <Button size="sm" variant="secondary" className="mt-2.5" onClick={() => navigate(`/app/rider/trip/${trip.id}`)}>
                    Rate your driver
                  </Button>
                )}
              </div>
            ))
          )
        ) : cancelled.length === 0 ? (
          <EmptyTrips onPlan={() => navigate('/app/rider/plan')} />
        ) : (
          cancelled.map(({ trip, booking }) => (
            <div key={booking.id} className="rounded-2xl border border-line-soft bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-extrabold text-onsurface">
                  {hubs.find((h) => h.id === trip.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === trip.toId)?.name.replace(' Hub', '')}
                </p>
                <StatusChip label="Cancelled" tone="neutral" />
              </div>
              <p className="mt-1 text-[12.5px] font-semibold text-variant">
                {dayLabel(trip.date)} · {trip.departureTime} · {trip.driverName}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-bold text-forest-700">
                <CheckCircle2 size={13} /> Refunded {naira(booking.total)}
              </p>
            </div>
          ))
        )}
      </div>
    </Page>
  );
}

function EmptyTrips({ onPlan }: { onPlan: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-6 py-10 text-center">
      <XCircle size={34} className="mx-auto text-faint" />
      <p className="mt-3 text-[15px] font-extrabold text-onsurface">No trips here</p>
      <p className="mt-1 text-[13px] text-variant">Plan a commute and your trips will show up.</p>
      <Button size="md" variant="secondary" className="mt-4" onClick={onPlan}>
        Find a commute
      </Button>
    </div>
  );
}

