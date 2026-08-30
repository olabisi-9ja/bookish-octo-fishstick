import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BadgeCheck, Bell, Car as CarIcon, CheckCircle2, Clock, MapPin, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import { Page, Avatar, StatusChip, TRIP_STATUS_TONE, Skeleton, Sheet } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { ComutaMap } from '../../components/map/ComutaMap';
import { DriverCancelledArt, AlternativeArt, TripCompleteArt } from '../../components/illustrations/Illustrations';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { bookingService } from '../../services/bookingService';
import { safetyService } from '../../services/safetyService';
import { useComuta } from '../../store';
import { naira, durationLabel, prettyPhone } from '../../utils/format';
import { dayLabel, leaveByTime, minutesUntil } from '../../utils/dates';
import { TRIP_STATUS_LABEL } from '../../constants';
import { DURATION, EASE } from '../../constants';
import { ActiveTrip } from './ActiveTrip';
import { PickupView } from './Pickup';

/** One screen, driven by trip status — the state machine made visible. */
export function TripScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripWithMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!id) return;
    const t = await tripService.getTrip(id);
    setTrip(t);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !trip) {
    return (
      <Page>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-44 w-full" />
        <Skeleton className="mt-3 h-64 w-full" />
      </Page>
    );
  }

  if (['departed', 'in_transit'].includes(trip.status)) {
    return <ActiveTrip tripId={trip.id} />;
  }

  if (trip.status === 'pickup') {
    return <PickupView trip={trip} onBack={() => navigate(-1)} />;
  }

  if (trip.status === 'completed') return <Completion tripId={trip.id} onDone={() => navigate('/app/rider/history')} />;

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      {trip.status === 'at_risk' ? (
        <AtRisk trip={trip} onRefresh={reload} />
      ) : trip.status === 'cancelled' ? (
        <Cancelled trip={trip} />
      ) : (
        <Upcoming trip={trip} onRefresh={reload} />
      )}
    </Page>
  );
}

function TripFacts({ trip }: { trip: TripWithMeta }) {
  const hubs = useComuta((s) => s.hubs);
  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const hub = hubs.find((h) => h.id === trip.pickupHubId);
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-[17px] font-extrabold tracking-tight text-onsurface">
          {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
        </p>
        <span className="text-[15px] font-extrabold text-forest-900">{naira(trip.pricePerSeat)}</span>
      </div>
      <p className="mt-1 text-[13px] font-semibold text-variant">
        {dayLabel(trip.date)} · {trip.departureTime} · ~{durationLabel(trip.durationMin)}
      </p>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-surface-2 p-3">
        <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={40} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[13.5px] font-extrabold text-onsurface">
            {trip.driverName} <BadgeCheck size={14} className="text-forest-700" />
          </p>
          <p className="text-[11.5px] font-semibold text-variant">
            {trip.vehicle.color} {trip.vehicle.make} {trip.vehicle.model} · <span className="font-mono">{trip.vehicle.plate}</span>
          </p>
        </div>
        <MapPin size={16} className="shrink-0 text-forest-700" />
      </div>
      <p className="mt-3 text-[12px] font-semibold text-variant">
        Pickup: <span className="font-extrabold text-onsurface">{hub?.name}</span> · {hub?.address}
      </p>
      <ComutaMap from={from} to={to} height={130} className="mt-3" label={false} />
    </div>
  );
}

function Timeline({ steps }: { steps: { label: string; done: boolean; current?: boolean }[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => (
        <li key={s.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            {s.done ? (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-forest-700">
                <CheckCircle2 size={14} className="text-white" />
              </span>
            ) : s.current ? (
              <span className="relative grid h-6 w-6 place-items-center">
                <span className="absolute h-6 w-6 animate-ping rounded-full bg-lime-500/50" />
                <span className="relative h-6 w-6 rounded-full border-2 border-lime-500 bg-white" />
              </span>
            ) : (
              <span className="h-6 w-6 rounded-full border-2 border-line bg-white" />
            )}
            {i < steps.length - 1 && <span className={`my-1 w-0.5 flex-1 ${s.done ? 'bg-forest-700' : 'bg-line'}`} />}
          </div>
          <p className={`pb-5 text-[13.5px] font-bold ${s.done ? 'text-onsurface' : s.current ? 'text-forest-900' : 'text-faint'}`}>
            {s.label}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Scheduled / confirmed / awaiting driver states. */
function Upcoming({ trip, onRefresh }: { trip: TripWithMeta; onRefresh: () => void }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const session = useComuta((s) => s.session);
  const contacts = useComuta((s) => s.trustedContacts);
  const booking = session ? tripService.bookingFor(session.userId, trip.id) : undefined;
  const minsToDeparture = minutesUntil(trip.date, trip.departureTime);
  const confirmed = trip.driverConfirmed;
  const preDeparture = minsToDeparture > 0 && minsToDeparture < 12 * 60;
  const leaveBy = leaveByTime(trip.date, trip.departureTime, 40);
  const shareOpen = params.get('share') === '1';

  const steps = useMemo(
    () => [
      { label: 'Booking confirmed', done: true },
      { label: 'Driver confirmed', done: confirmed, current: !confirmed && !preDeparture },
      { label: 'Pickup', done: false, current: false },
      { label: 'Departure', done: false },
      { label: 'Arrival', done: false },
    ],
    [confirmed, preDeparture],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Your trip</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-variant">
            {TRIP_STATUS_LABEL[trip.status]}
          </p>
        </div>
        <StatusChip
          label={confirmed ? 'Confirmed' : 'Awaiting driver'}
          tone={confirmed ? 'green' : trip.status === 'confirmation_pending' ? 'amber' : TRIP_STATUS_TONE[trip.status]}
          dot
          pulse={!confirmed}
        />
      </div>

      <div className="mt-4">
        <TripFacts trip={trip} />
      </div>

      {preDeparture && (
        <div className="mt-3 rounded-2xl border border-forest-100 bg-forest-50 p-4">
          <p className="flex items-center gap-2 text-[13px] font-extrabold text-forest-900">
            <Bell size={15} /> Your commute is {dayLabel(trip.date).toLowerCase()}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-[12.5px] font-semibold text-forest-800">
            <span className="flex items-center gap-1.5"><Clock size={13} /> Leave by {leaveBy}</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} /> Meet at {trip.pickupHubId === 'hub_ikorodu' ? 'Ikorodu Hub' : 'the hub'}</span>
            <span className="flex items-center gap-1.5"><CarIcon size={13} /> {trip.vehicle.color} {trip.vehicle.model}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> PIN before entering</span>
          </div>
          <Button block variant="secondary" className="mt-4" onClick={() => navigate(`/app/rider/pickup/${trip.id}`)}>
            View pickup
          </Button>
        </div>
      )}

      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-faint">Trip timeline</h2>
        <div className="mt-3">
          <Timeline steps={steps} />
        </div>
      </section>

      <div className="mt-4 flex gap-3">
        {booking && (
          <Button
            variant="secondary"
            className="flex-1"
            onClick={async () => {
              await bookingService.cancelBooking(booking.id, session!.userId);
              onRefresh();
            }}
          >
            Cancel booking
          </Button>
        )}
        <Button variant="secondary" className="flex-1" onClick={() => setParams({ share: '1' })}>
          Share trip
        </Button>
      </div>

      {/* Share sheet (upcoming trips) */}
      <Sheet open={shareOpen} onClose={() => setParams({})} title="Share your trip">
        <p className="text-[13.5px] text-variant">Let someone you trust follow your trip details.</p>
        <div className="mt-4 space-y-2">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={async () => {
                if (session) await safetyService.shareTrip(trip.id, session.userId, 'contact');
                setParams({});
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-3 text-left hover:border-forest-600 tap"
            >
              <Avatar initials={c.name.split(' ').map((p) => p[0]).join('').slice(0, 2)} color="#1e7386" size={38} />
              <div>
                <p className="text-[14px] font-extrabold text-onsurface">{c.name}</p>
                <p className="text-[12px] font-semibold text-variant">{c.relation}</p>
              </div>
            </button>
          ))}
        </div>
        <Button
          block
          variant="secondary"
          className="mt-3"
          onClick={async () => {
            if (session) await safetyService.shareTrip(trip.id, session.userId, 'link');
            setParams({});
          }}
        >
          Share link
        </Button>
      </Sheet>
    </div>
  );
}

/** Something changed — driver hasn't confirmed. Booking protected. */
function AtRisk({ trip, onRefresh }: { trip: TripWithMeta; onRefresh: () => void }) {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const session = useComuta((s) => s.session);
  const booking = session ? tripService.bookingFor(session.userId, trip.id) : undefined;

  return (
    <div>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Something changed</h1>
      <div className="mx-auto mt-4 max-w-[240px]">
        <DriverCancelledArt />
      </div>
      <p className="mt-2 text-center text-[15px] font-bold text-onsurface">Your driver hasn't confirmed this commute.</p>
      <p className="mt-1.5 text-center text-[13.5px] text-variant">
        {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')} · {dayLabel(trip.date)} · {trip.departureTime}
      </p>

      <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-lime-500/60 bg-lime-50 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime-500">
          <ShieldCheck size={18} className="text-forest-950" />
        </span>
        <p className="text-[13.5px] font-bold leading-snug text-lime-700">
          Booking protected — we're checking for another option. If nothing is found, you get a full refund.
        </p>
      </div>

      <div className="mt-5 space-y-2.5">
        <Button block onClick={() => navigate(`/app/rider/trip/${trip.id}/alt`)}>
          View alternatives
        </Button>
        <Button
          block
          variant="secondary"
          onClick={async () => {
            if (booking) {
              await bookingService.requestRefund(booking.id, session!.userId);
              onRefresh();
            }
          }}
        >
          <RefreshCw size={15} /> Request refund
        </Button>
      </div>
    </div>
  );
}

/** Alternative trip found (recovery). */
export function AlternativeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const [alt, setAlt] = useState<TripWithMeta | null>(null);
  const [switching, setSwitching] = useState(false);
  const session = useComuta((s) => s.session);

  useEffect(() => {
    // The recovery service picks the best alternative on the same corridor.
    if (id) {
      tripService.getTrip(id).then(async (current) => {
        if (!current) return;
        const options = await tripService.searchCorridor(current.fromId, current.toId);
        const next = options.find((o) => o.id !== current.id && o.seatsLeft > 0);
        setAlt(next ?? null);
      });
    }
  }, [id]);

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="mx-auto max-w-[240px]">
        <AlternativeArt />
      </div>
      <h1 className="mt-3 text-center text-[22px] font-extrabold tracking-tight text-onsurface">We found another option</h1>
      <p className="mt-1.5 text-center text-[13.5px] text-variant">Same corridor, verified driver, your seat is protected.</p>

      {!alt ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-center">
          <p className="text-[14px] font-bold text-onsurface">Checking for alternatives…</p>
          <p className="mt-1 text-[13px] text-variant">This usually takes a few seconds.</p>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-extrabold text-onsurface">
              {hubs.find((h) => h.id === alt.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === alt.toId)?.name.replace(' Hub', '')}
            </p>
            <span className="text-[15px] font-extrabold text-forest-900">{naira(alt.pricePerSeat)}</span>
          </div>
          <p className="mt-1 text-[12.5px] font-semibold text-variant">
            {dayLabel(alt.date)} · {alt.departureTime}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Avatar initials={alt.driverInitials} color={alt.avatarColor} size={38} />
            <div className="flex-1">
              <p className="flex items-center gap-1 text-[13.5px] font-extrabold text-onsurface">
                {alt.driverName} <BadgeCheck size={13} className="text-forest-700" />
              </p>
              <p className="text-[11.5px] font-semibold text-variant">Verified · {alt.completionRate}% completion</p>
            </div>
            <StatusChip label="Available" tone="green" dot />
          </div>
        </div>
      )}

      {alt && session && (
        <div className="mt-4 space-y-2.5">
          <Button
            block
            loading={switching}
            onClick={async () => {
              setSwitching(true);
              await bookingService.requestRefund(id!, session.userId);
              const res = await bookingService.createBooking({ riderId: session.userId, tripId: alt.id, seats: 1, amount: alt.pricePerSeat });
              setSwitching(false);
              if (res.ok && res.booking) navigate(`/app/rider/confirmation/${alt.id}?booking=${res.booking.id}`, { replace: true });
            }}
          >
            Switch to this trip
          </Button>
          <Button block variant="secondary" onClick={() => navigate(`/app/rider/trip/${id}`)}>
            Get a refund
          </Button>
        </div>
      )}
    </Page>
  );
}

function Cancelled({ trip }: { trip: TripWithMeta }) {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">This trip was cancelled</h1>
      <p className="mt-1.5 text-[13.5px] text-variant">
        {dayLabel(trip.date)} · {trip.departureTime} · {trip.driverName}
      </p>
      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <p className="text-[13.5px] font-bold text-onsurface">Refund processed</p>
        <p className="mt-1 text-[13px] text-variant">
          {naira(trip.pricePerSeat)} was returned to your payment method. It usually appears within 1–3 working days.
        </p>
      </div>
      <Button block className="mt-5" onClick={() => navigate('/app/rider/plan')}>
        Find another commute
      </Button>
    </div>
  );
}

/** You're here — trip completed, rate your driver. */
function Completion({ tripId, onDone }: { tripId: string; onDone: () => void }) {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const session = useComuta((s) => s.session);
  const [trip, setTrip] = useState<TripWithMeta | null>(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    tripService.getTrip(tripId).then(setTrip);
  }, [tripId]);

  const submit = async () => {
    const booking = session ? tripService.bookingFor(session.userId, tripId) : undefined;
    if (!booking) {
      onDone();
      return;
    }
    setSubmitting(true);
    await bookingService.rateTrip(booking.id, stars || 5, comment.trim() || undefined);
    setSubmitting(false);
    setDone(true);
    setTimeout(onDone, 700);
  };

  if (!trip) return <Page><Skeleton className="h-64 w-full" /></Page>;

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);

  return (
    <Page className="flex flex-col items-center pt-4 text-center">
      <div className="mx-auto max-w-[240px]">
        <TripCompleteArt />
      </div>
      <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-onsurface">You're here</h1>
      <p className="mt-1 text-[14px] font-semibold text-variant">
        {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')} · Trip completed
      </p>

      {!done ? (
        <div className="mt-7 w-full rounded-2xl border border-line bg-white p-5 shadow-soft">
          <p className="text-[15px] font-extrabold text-onsurface">Rate your driver</p>
          <div className="mt-3 flex justify-center gap-1.5" role="radiogroup" aria-label="Driver rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStars(s)}
                aria-label={`${s} star${s > 1 ? 's' : ''}`}
                className={`grid h-12 w-12 place-items-center rounded-xl tap ${s <= stars ? 'bg-lime-100' : 'bg-surface-2'}`}
              >
                <Star size={24} className={s <= stars ? 'fill-lime-600 text-lime-600' : 'text-faint'} />
              </button>
            ))}
          </div>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything we should know? (optional)"
            className="mt-4 h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-[13.5px] font-medium outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30"
          />
          <Button block className="mt-4" loading={submitting} onClick={submit}>
            Done
          </Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: DURATION.standard, ease: EASE }} className="mt-7">
          <p className="text-[16px] font-extrabold text-forest-900">Thanks for the rating.</p>
          <p className="mt-1 text-[13px] text-variant">See you on the next commute.</p>
        </motion.div>
      )}
      <Button block variant="ghost" className="mt-4" onClick={() => navigate('/app/rider/home')}>
        Back to home
      </Button>
    </Page>
  );
}

