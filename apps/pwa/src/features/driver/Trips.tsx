import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, BadgeCheck, Car as CarIcon, CheckCircle2, MapPin, Users } from 'lucide-react';
import { Page, Avatar, StatusChip, Skeleton, Sheet } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { ComutaMap } from '../../components/map/ComutaMap';
import { driverService } from '../../services/driverService';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { dayLabel } from '../../utils/dates';
import { DURATION, EASE } from '../../constants';
import type { Trip } from '../../types';

export function DriverTrips() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const trips = session ? driverService.myTrips(session.userId) : [];
  const upcoming = trips.filter((t) => !['completed', 'cancelled'].includes(t.status));
  const past = trips.filter((t) => ['completed', 'cancelled'].includes(t.status));
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Trips</h1>

      <div className="mt-4 flex gap-1 rounded-xl bg-surface-2 p-1" role="tablist">
        <button role="tab" aria-selected={tab === 'upcoming'} onClick={() => setTab('upcoming')} className={`flex-1 rounded-lg py-2 text-[13px] font-bold tap ${tab === 'upcoming' ? 'bg-white text-forest-900 shadow-sm' : 'text-variant'}`}>
          Upcoming ({upcoming.length})
        </button>
        <button role="tab" aria-selected={tab === 'past'} onClick={() => setTab('past')} className={`flex-1 rounded-lg py-2 text-[13px] font-bold tap ${tab === 'past' ? 'bg-white text-forest-900 shadow-sm' : 'text-variant'}`}>
          Past ({past.length})
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {(tab === 'upcoming' ? upcoming : past).map((t) => (
          <TripRow key={t.id} trip={t} />
        ))}
        {(tab === 'upcoming' ? upcoming : past).length === 0 && (
          <div className="rounded-2xl border border-line bg-white px-6 py-10 text-center">
            <p className="text-[15px] font-extrabold text-onsurface">No trips here yet</p>
            <p className="mt-1 text-[13px] text-variant">Publish a commute to get started.</p>
            <Button size="md" variant="secondary" className="mt-4" onClick={() => navigate('/app/driver/routes/new')}>
              Publish a commute
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}

function TripRow({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const passengers = driverService.passengers(trip.id);
  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);

  return (
    <button
      onClick={() => navigate(`/app/driver/trips/${trip.id}`)}
      className="w-full rounded-2xl border border-line-soft bg-white p-4 text-left shadow-soft tap"
    >
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-extrabold text-onsurface">
          {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
        </p>
        <StatusChip
          label={trip.status === 'confirmed' ? 'Confirmed' : trip.status === 'confirmation_pending' ? 'Awaiting confirm' : trip.status === 'in_transit' ? 'In transit' : trip.status === 'completed' ? 'Completed' : trip.status === 'at_risk' ? 'Released' : 'Scheduled'}
          tone={trip.status === 'confirmed' ? 'green' : trip.status === 'in_transit' ? 'lime' : trip.status === 'completed' ? 'green' : trip.status === 'at_risk' ? 'red' : 'amber'}
          dot
        />
      </div>
      <p className="mt-1 text-[12.5px] font-semibold text-variant">
        {dayLabel(trip.date)} · {trip.departureTime} · {trip.seatsTotal} seats
      </p>
      <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2.5">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-variant">
          <Users size={13} /> {passengers.length} passenger{passengers.length === 1 ? '' : 's'} · {trip.seatsLeft} seats left
        </span>
        <span className="text-[12.5px] font-extrabold text-forest-900">{naira(trip.pricePerSeat)}/seat</span>
      </div>
    </button>
  );
}

/** Driver trip detail  -  passengers, T-8 confirmation, live controls. */
export function DriverTripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const trip = useComuta((s) => s.trips.find((t) => t.id === id));
  const [confirming, setConfirming] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [confirmDone, setConfirmDone] = useState(false);
  const [starting, setStarting] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  if (!trip) {
    return (
      <Page>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="mt-3 h-64 w-full" />
      </Page>
    );
  }

  void tick;
  const passengers = driverService.passengers(trip.id);
  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const hub = hubs.find((h) => h.id === trip.pickupHubId);
  const deadline = driverService.confirmDeadline();

  const confirm = async () => {
    if (!sessionCheck()) return;
    setConfirming(true);
    await driverService.confirmTrip(trip.id, useComuta.getState().session!.userId);
    setConfirming(false);
    setConfirmDone(true);
  };

  const decline = async () => {
    await driverService.declineTrip(trip.id, useComuta.getState().session!.userId, declineReason || "Schedule conflict");
    setDeclineOpen(false);
  };

  const sessionCheck = () => !!useComuta.getState().session;

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold tracking-tight text-onsurface">
          {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
        </h1>
        <StatusChip
          label={trip.driverConfirmed ? 'Confirmed' : trip.status === 'at_risk' ? 'Released' : 'Confirmation pending'}
          tone={trip.driverConfirmed ? 'green' : trip.status === 'at_risk' ? 'red' : 'amber'}
          dot
        />
      </div>
      <p className="mt-1 text-[13px] font-semibold text-variant">
        {dayLabel(trip.date)} · {trip.departureTime}
      </p>

      <div className="mt-3">
        <ComutaMap from={from} to={to} height={140} label={false} />
      </div>

      {/* Confirmation card */}
      {!trip.driverConfirmed && trip.status !== 'at_risk' && (
        <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <p className="text-[14px] font-extrabold text-amber-600">Confirm this commute</p>
          <p className="mt-1 text-[12.5px] font-semibold text-variant">
            {passengers.length} rider{passengers.length === 1 ? '' : 's'} booked. Confirm by <span className="font-mono font-bold text-onsurface">{deadline.expired ? 'passed' : deadline.label}</span> so they can plan.
          </p>
          {confirmDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATION.standard, ease: EASE }}
              className="mt-3 flex items-center gap-2 rounded-xl bg-forest-900 p-3 text-white"
            >
              <CheckCircle2 size={20} className="text-lime-500" />
              <div>
                <p className="text-[13.5px] font-extrabold">Confirmed</p>
                <p className="text-[11.5px] text-white/60">Your passengers have been notified.</p>
              </div>
            </motion.div>
          ) : (
            <div className="mt-3 space-y-2">
              <Button block size="md" loading={confirming} onClick={confirm}>
                Confirm trip
              </Button>
              <Button block size="md" variant="ghost" className="text-red-600" onClick={() => setDeclineOpen(true)}>
                I can't make this trip
              </Button>
            </div>
          )}
        </div>
      )}
      {trip.status === 'at_risk' && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-[14px] font-extrabold text-red-700">This commute was released</p>
          <p className="mt-1 text-[12.5px] text-variant">Your passengers were notified and COMUTA is finding alternatives.</p>
        </div>
      )}

      {/* Passengers */}
      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-faint">Your passengers</h2>
        {passengers.length === 0 ? (
          <p className="mt-3 py-2 text-center text-[13px] text-variant">No bookings yet. Share your commute to attract riders.</p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {passengers.map((p) => (
              <div key={p.bookingId} className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
                <Avatar initials={p.initials} color={p.avatarColor} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[13.5px] font-extrabold text-onsurface">
                    {p.name} {p.verified && <BadgeCheck size={13} className="text-forest-700" />}
                  </p>
                  <p className="text-[11.5px] font-semibold text-variant">
                    {p.seats} seat{p.seats > 1 ? 's' : ''} · {p.hubName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[15px] font-bold text-forest-900">{p.pin}</p>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-faint">Trip PIN</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pickup info */}
      <section className="mt-3 flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2">
          <MapPin size={18} className="text-forest-700" />
        </span>
        <div>
          <p className="text-[14px] font-extrabold text-onsurface">{hub?.name}</p>
          <p className="text-[12px] font-semibold text-variant">{hub?.address}</p>
        </div>
      </section>

      {/* Live controls */}
      {trip.driverConfirmed && ['confirmed', 'scheduled', 'pickup', 'departed', 'in_transit'].includes(trip.status) && (
        <div className="mt-4 space-y-2.5">
          {trip.status !== 'in_transit' ? (
            <Button
              block
              variant="lime"
              loading={starting}
              onClick={async () => {
                setStarting(true);
                if (trip.status === 'scheduled' || trip.status === 'confirmed') {
                  await driverService.arrivePickup(trip.id);
                }
                await driverService.startTrip(trip.id);
                navigate('/app/driver/trips', { replace: true });
              }}
            >
              <CarIcon size={17} /> Start trip
            </Button>
          ) : (
            <Button
              block
              variant="secondary"
              onClick={async () => {
                await driverService.completeTrip(trip.id);
                navigate('/app/driver/trips', { replace: true });
              }}
            >
              End trip
            </Button>
          )}
          <Button block variant="ghost" className="text-red-600" onClick={() => navigate('/app/driver/reliability')}>
            Report issue
          </Button>
        </div>
      )}

      {/* Decline sheet */}
      <Sheet open={declineOpen} onClose={() => setDeclineOpen(false)} title="I can't make this trip">
        <p className="text-[13.5px] text-variant">Tell us why so we can protect your riders and your reliability.</p>
        <div className="mt-4 space-y-2">
          {['Vehicle issue', 'Emergency', 'Schedule conflict', 'Not profitable'].map((r) => (
            <button
              key={r}
              onClick={() => setDeclineReason(r)}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[13.5px] font-bold tap ${declineReason === r ? 'border-forest-900 bg-forest-50 text-forest-900' : 'border-line bg-white text-variant'}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${declineReason === r ? 'bg-forest-900' : 'bg-line'}`} />
              {r}
            </button>
          ))}
        </div>
        <Button block variant="destructive" className="mt-4" disabled={!declineReason} onClick={decline}>
          Release this commute
        </Button>
        <Button block variant="ghost" className="mt-2" onClick={() => setDeclineOpen(false)}>
          Keep it
        </Button>
      </Sheet>
    </Page>
  );
}
