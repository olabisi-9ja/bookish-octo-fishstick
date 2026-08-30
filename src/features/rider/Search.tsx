import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { TripCardSkeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { ComutaMap } from '../../components/map/ComutaMap';
import { NoTripArt } from '../../components/illustrations/Illustrations';
import { TripCard } from './TripCard';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { dayLabel } from '../../utils/dates';
import { DURATION, EASE } from '../../constants';

type Sort = 'match' | 'time' | 'price';

export function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const fromId = params.get('from') ?? 'hub_ikorodu';
  const toId = params.get('to') ?? 'hub_vi';
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '7:00 AM';
  const [sort, setSort] = useState<Sort>('match');
  const [trips, setTrips] = useState<TripWithMeta[] | null>(null);
  const [failed, setFailed] = useState(false);

  const from = hubs.find((h) => h.id === fromId);
  const to = hubs.find((h) => h.id === toId);

  useEffect(() => {
    let alive = true;
    setTrips(null);
    setFailed(false);
    tripService
      .searchTrips({ fromId, toId, date, time })
      .then((r) => alive && setTrips(r))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [fromId, toId, date, time]);

  const sorted = useMemo(() => {
    if (!trips) return null;
    const copy = [...trips];
    if (sort === 'time') copy.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    if (sort === 'price') copy.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    if (sort === 'match') {
      copy.sort((a, b) => {
        // best match = nearest to requested time, confirmed drivers first, then price
        const timeA = Math.abs(parseTime(a.departureTime) - parseTime(time));
        const timeB = Math.abs(parseTime(b.departureTime) - parseTime(time));
        return timeA - timeB || Number(b.driverConfirmed) - Number(a.driverConfirmed) || a.pricePerSeat - b.pricePerSeat;
      });
    }
    return copy;
  }, [trips, sort, time]);

  return (
    <div className="flex min-h-dvh flex-col lg:min-h-0">
      {/* Map */}
      <div className="relative">
        <ComutaMap from={from} to={to} height={280} routeAnimate className="rounded-none border-0 lg:rounded-2xl" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-forest-900 shadow-lift backdrop-blur tap"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-3 left-4 right-4 rounded-2xl bg-white/95 p-3 shadow-lift backdrop-blur">
          <p className="text-[13px] font-extrabold text-onsurface">
            {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
          </p>
          <p className="text-[12px] font-semibold text-variant">
            {date ? dayLabel(date) : ''} · {time}
          </p>
        </div>
      </div>

      {/* Sheet */}
      <div className="flex-1 rounded-t-3xl bg-surface px-4 pb-28 pt-4 lg:rounded-none lg:px-0 lg:pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-[19px] font-extrabold tracking-tight text-onsurface">
            Available trips
            {sorted && <span className="text-variant"> — {sorted.length}</span>}
          </h1>
          <div className="flex items-center gap-1 rounded-xl bg-surface-2 p-1" role="tablist" aria-label="Sort trips">
            {(
              [
                { id: 'match', label: 'Best match' },
                { id: 'time', label: 'Earliest' },
                { id: 'price', label: 'Lowest price' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={sort === s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-bold tap ${sort === s.id ? 'bg-white text-forest-900 shadow-sm' : 'text-variant'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {failed && (
            <div className="rounded-2xl border border-line bg-white p-5 text-center">
              <p className="text-[14px] font-bold text-onsurface">We couldn't find trips right now.</p>
              <p className="mt-1 text-[13px] text-variant">Check your connection and try again.</p>
              <Button block variant="secondary" className="mt-4" onClick={() => navigate(0)}>
                Try again
              </Button>
            </div>
          )}
          {!failed && sorted === null && (
            <>
              <TripCardSkeleton />
              <TripCardSkeleton />
              <TripCardSkeleton />
            </>
          )}
          {!failed && sorted?.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.standard, ease: EASE }}>
              <div className="mx-auto max-w-[220px] pt-2">
                <NoTripArt />
              </div>
              <h2 className="text-center text-[17px] font-extrabold text-onsurface">No shared trip yet</h2>
              <p className="mx-auto mt-1.5 max-w-xs text-center text-[13.5px] text-variant">
                No driver has published this corridor for {date ? dayLabel(date) : 'that day'}. We can watch it for you.
              </p>
              <Button block className="mt-5" onClick={() => navigate('/app/rider/plan')}>
                Request this route
              </Button>
            </motion.div>
          )}
          {sorted?.map((t, i) => <TripCard key={t.id} trip={t} index={i} />)}
        </div>
      </div>
    </div>
  );
}

function parseTime(label: string) {
  const m = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}
