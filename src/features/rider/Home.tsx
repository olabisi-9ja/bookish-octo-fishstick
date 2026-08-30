import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, CheckCircle2, Clock, MapPin, Search, Sparkles } from 'lucide-react';
import { Page, StatusChip, Skeleton, Avatar } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { InstallPrompt } from '../../components/ui/InstallPrompt';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { routeService } from '../../services/routeService';
import { useComuta } from '../../store';
import { naira, greetingFor } from '../../utils/format';
import { dayLabel, longDayLabel } from '../../utils/dates';
import { DURATION, EASE } from '../../constants';
import type { Booking } from '../../types';

interface NextCommute {
  trip: TripWithMeta;
  booking: Booking;
}

export function RiderHome() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const user = useComuta((s) => s.users.find((u) => u.id === s.session?.userId));
  const hubs = useComuta((s) => s.hubs);
  const [next, setNext] = useState<NextCommute | null>(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<NextCommute[]>([]);

  const myRoutes = session ? routeService.myRoutes(session.userId) : [];
  const primaryRoute = myRoutes.find((r) => r.active && !r.paused);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const n = await tripService.getNextTrip(session.userId);
      setNext(n);
      const hist = await tripService.getHistory(session.userId);
      setRecent(hist.filter((h) => h.trip.status === 'completed').slice(0, 2));
      setLoading(false);
    })();
  }, [session]);

  const nextTrip = next?.trip;
  const nextFrom = hubs.find((h) => h.id === nextTrip?.fromId);
  const nextTo = hubs.find((h) => h.id === nextTrip?.toId);

  return (
    <Page>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-variant">{greetingFor()}</p>
          <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">
            {user ? `${user.firstName} ${user.lastName}` : ''}
          </h1>
        </div>
      </div>

      {/* Next commute */}
      {loading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : next ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, ease: EASE }}
          className="mt-5 overflow-hidden rounded-3xl bg-forest-900 p-5 text-white shadow-lift"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime-500">Your next commute</p>
            <StatusChip
              label={next.trip.status === 'confirmed' ? 'Confirmed' : nextTrip?.status === 'at_risk' ? 'Needs attention' : 'Awaiting driver'}
              tone={next.trip.status === 'confirmed' ? 'lime' : nextTrip?.status === 'at_risk' ? 'red' : 'amber'}
              dot
            />
          </div>
          <h2 className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight">
            {nextFrom?.name.replace(' Hub', '')} → {nextTo?.name.replace(' Hub', '')}
          </h2>
          <div className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-white/70">
            <Calendar size={14} />
            {longDayLabel(nextTrip!.date)} · {nextTrip!.departureTime}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <Avatar initials={nextTrip!.driverInitials} color={nextTrip!.avatarColor} size={40} />
            <div className="flex-1">
              <p className="text-[13.5px] font-extrabold">{nextTrip!.driverName}</p>
              <p className="text-[11.5px] font-semibold text-white/60">
                {nextTrip!.vehicle.color} {nextTrip!.vehicle.make} {nextTrip!.vehicle.model} · {nextTrip!.vehicle.plate}
              </p>
            </div>
            <span className="text-[15px] font-extrabold text-lime-500">{naira(nextTrip!.pricePerSeat)}</span>
          </div>

          <Button
            variant={next.trip.status === 'at_risk' ? 'lime' : 'secondary'}
            className="mt-4 w-full bg-white/95 text-forest-900 hover:bg-white"
            onClick={() => navigate(`/app/rider/trip/${next.trip.id}`)}
          >
            {next.trip.status === 'at_risk' ? 'We’re finding another option' : 'View trip'}
            <ArrowRight size={16} />
          </Button>
        </motion.section>
      ) : (
        <section className="mt-5 rounded-3xl border border-line-soft bg-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-forest-700" />
            <p className="text-[14px] font-extrabold text-onsurface">Plan your first commute</p>
          </div>
          <p className="mt-1.5 text-[13px] text-variant">Book a shared trip and know your seat before you leave.</p>
          <Button block className="mt-4" onClick={() => navigate('/app/rider/plan')}>
            Find a commute
          </Button>
        </section>
      )}

      {/* Plan a commute */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, delay: 0.08, ease: EASE }}
        className="mt-6"
      >
        <h2 className="text-[16px] font-extrabold tracking-tight text-onsurface">Plan a commute</h2>
        <button
          onClick={() => navigate('/app/rider/plan')}
          className="mt-3 w-full rounded-2xl border border-line bg-white p-4 text-left shadow-soft transition-shadow hover:shadow-lift tap"
        >
          <div className="flex items-center gap-2 text-[13px] font-bold text-faint">
            <Search size={15} /> Where are you going?
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex flex-col gap-2.5">
              <span className="h-2 w-2 rounded-full bg-forest-900" />
              <span className="ml-[3px] h-0.5 w-px flex-1 bg-line" />
              <span className="h-2 w-2 rounded-full bg-lime-500" />
            </div>
            <div className="flex-1 space-y-3.5">
              <p className="text-[15px] font-extrabold text-onsurface">Ikorodu Hub</p>
              <p className="text-[15px] font-extrabold text-onsurface">Victoria Island Hub</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] font-bold text-variant">
              <Clock size={12} /> Tomorrow · 7:00 AM
            </span>
          </div>
        </button>
        <Button block variant="secondary" className="mt-3" onClick={() => navigate('/app/rider/plan')}>
          Find shared trips
        </Button>
      </motion.section>

      {/* Your routes */}
      {primaryRoute && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, delay: 0.14, ease: EASE }}
          className="mt-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold tracking-tight text-onsurface">Your routes</h2>
            <button onClick={() => navigate('/app/rider/routes')} className="text-[13px] font-extrabold text-forest-700 tap">
              View all
            </button>
          </div>
          <button
            onClick={() => navigate(`/app/rider/routes/${primaryRoute.id}`)}
            className="mt-3 flex w-full items-center justify-between rounded-2xl border border-line bg-white p-4 text-left shadow-soft tap"
          >
            <div>
              <p className="text-[15px] font-extrabold text-onsurface">
                {hubs.find((h) => h.id === primaryRoute.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === primaryRoute.toId)?.name.replace(' Hub', '')}
              </p>
              <p className="mt-1 text-[12.5px] font-semibold text-variant">
                {primaryRoute.days.map((d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]).join(' · ')} · {primaryRoute.time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-extrabold text-forest-900">{naira(primaryRoute.pricePerSeat)} / trip</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-extrabold text-forest-700">
                View route <ArrowRight size={12} />
              </p>
            </div>
          </button>
        </motion.section>
      )}

      {/* Recent trips */}
      {recent.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, delay: 0.2, ease: EASE }}
          className="mt-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold tracking-tight text-onsurface">Recent trips</h2>
            <button onClick={() => navigate('/app/rider/history')} className="text-[13px] font-extrabold text-forest-700 tap">
              View all
            </button>
          </div>
          <div className="mt-3 space-y-2.5">
            {recent.map(({ trip, booking }) => (
              <button
                key={booking.id}
                onClick={() => navigate(`/app/rider/trip/${trip.id}`)}
                className="flex w-full items-center gap-3 rounded-2xl border border-line-soft bg-white p-3.5 text-left tap"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest-50">
                  <CheckCircle2 size={18} className="text-forest-700" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-extrabold text-onsurface">
                    {hubs.find((h) => h.id === trip.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === trip.toId)?.name.replace(' Hub', '')}
                  </p>
                  <p className="text-[11.5px] font-semibold text-variant">{dayLabel(trip.date)} · {trip.departureTime} · {trip.driverName}</p>
                </div>
                <span className="text-[13px] font-extrabold text-forest-900">{naira(booking.total)}</span>
              </button>
            ))}
          </div>
        </motion.section>
      )}
      <InstallPrompt compact />
    </Page>
  );
}
