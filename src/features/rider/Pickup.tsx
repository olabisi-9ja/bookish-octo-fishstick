import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BadgeCheck, Car as CarIcon, MapPin, ShieldCheck } from 'lucide-react';
import { Page, Avatar, StatusChip, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { ComutaMap } from '../../components/map/ComutaMap';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { dayLabel } from '../../utils/dates';
import { DURATION, EASE } from '../../constants';

/** Meet your driver — trip PIN is the star. */
export function Pickup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripWithMeta | null>(null);

  useEffect(() => {
    if (id) tripService.getTrip(id).then(setTrip);
  }, [id]);

  return <PickupView trip={trip} onBack={() => navigate(-1)} />;
}

/** Shared pickup view (also rendered by the trip state machine). */
export function PickupView({ trip, onBack }: { trip: TripWithMeta | null; onBack: () => void }) {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const [atPickup, setAtPickup] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!trip) {
    return (
      <Page>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-64 w-full" />
      </Page>
    );
  }

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const hub = hubs.find((h) => h.id === trip.pickupHubId);
  const alreadyAt = atPickup || trip.status === 'pickup';

  const arrive = async () => {
    setBusy(true);
    await tripService.markAtPickup(trip.id);
    setAtPickup(true);
    setBusy(false);
  };

  const confirm = async () => {
    setBusy(true);
    await tripService.confirmPickup(trip.id);
    navigate(`/app/rider/trip/${trip.id}`, { replace: true });
  };

  return (
    <Page>
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">{alreadyAt ? 'Your driver is here' : 'Meet your driver'}</h1>
        <StatusChip label={dayLabel(trip.date)} tone="neutral" />
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <p className="text-[16px] font-extrabold text-onsurface">{hub?.name}</p>
        <p className="mt-0.5 text-[12.5px] font-semibold text-variant">{hub?.address}</p>
        <ComutaMap from={from} to={hub} height={140} className="mt-3" label={false} />
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
        <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={46} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[15px] font-extrabold text-onsurface">
            {trip.driverName} <BadgeCheck size={14} className="text-forest-700" />
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-variant">
            <CarIcon size={13} /> {trip.vehicle.color} {trip.vehicle.make} {trip.vehicle.model} · <span className="font-mono">{trip.vehicle.plate}</span>
          </p>
        </div>
      </div>

      {/* PIN */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: EASE }}
        className="mt-4 rounded-2xl border-2 border-forest-900 bg-forest-900 p-5 text-center text-white shadow-lift"
      >
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-lime-500">
          <ShieldCheck size={13} /> Trip PIN — confirm this before entering
        </p>
        <p className="mt-2 font-mono text-[44px] font-bold tracking-[0.18em] text-white">{trip.pin}</p>
        <p className="mt-1 text-[12px] font-semibold text-white/60">Only enter a vehicle whose driver shows this exact code.</p>
      </motion.div>

      {!alreadyAt ? (
        <Button block className="mt-5" loading={busy} onClick={arrive}>
          <MapPin size={16} /> I'm at pickup
        </Button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.standard, ease: EASE }}>
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-lime-500/60 bg-lime-50 p-4">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-500" />
            <p className="text-[13.5px] font-bold text-lime-700">
              {trip.driverName} is at the pickup point. Match the vehicle before entering.
            </p>
          </div>
          <Button block className="mt-4" loading={busy} onClick={confirm}>
            Confirm pickup
          </Button>
        </motion.div>
      )}
    </Page>
  );
}
