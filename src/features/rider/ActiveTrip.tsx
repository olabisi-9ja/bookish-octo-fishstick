import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertTriangle, ArrowLeft, BadgeCheck, Car as CarIcon, LifeBuoy, MapPin, Phone, Share2, ShieldAlert, Users } from 'lucide-react';
import { Avatar, StatusChip, Sheet, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { ComutaMap } from '../../components/map/ComutaMap';
import { SafetyArt } from '../../components/illustrations/Illustrations';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { safetyService } from '../../services/safetyService';
import { useComuta } from '../../store';
import { naira, durationLabel, prettyPhone } from '../../utils/format';
import { dayLabel } from '../../utils/dates';
import { DURATION, EASE } from '../../constants';

/** Map-first live trip with a bottom sheet: ETA, driver, vehicle, share + SOS. */
export function ActiveTrip({ tripId }: { tripId: string }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hubs = useComuta((s) => s.hubs);
  const session = useComuta((s) => s.session);
  const trustedContacts = useComuta((s) => s.trustedContacts);
  const [trip, setTrip] = useState<TripWithMeta | null>(null);
  const [progress, setProgress] = useState(0.08);
  const [shareOpen, setShareOpen] = useState(params.get('share') === '1');
  const [sosOpen, setSosOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [deviation, setDeviation] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    tripService.getTrip(tripId).then(setTrip);
  }, [tripId]);

  // vehicle moves along the route while live
  useEffect(() => {
    if (!trip || trip.status !== 'in_transit') return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 0.9) {
          clearInterval(t);
          return 0.9;
        }
        return p + 0.004;
      });
    }, 800);
    return () => clearInterval(t);
  }, [trip?.status, tripId]);

  // demo the route-deviation alert once
  useEffect(() => {
    if (!trip || trip.status !== 'in_transit') return;
    const t = setTimeout(() => setDeviation(true), 22000);
    return () => clearTimeout(t);
  }, [trip?.status, tripId]);

  if (!trip) {
    return (
      <div className="min-h-dvh">
        <Skeleton className="h-80 w-full rounded-none" />
      </div>
    );
  }

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const remaining = Math.max(8, Math.round(trip.durationMin * (1 - progress)));

  return (
    <div className="relative min-h-dvh">
      {/* Map */}
      <div className="fixed inset-x-0 top-0 z-0 h-[58dvh]">
        <ComutaMap from={from} to={to} vehicleProgress={progress} height="100%" routeAnimate className="rounded-none border-0" />
      </div>
      <button
        onClick={() => navigate(`/app/rider/trip/${trip.id}`)}
        className="absolute left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-forest-900 shadow-lift backdrop-blur tap"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Deviation alert */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={deviation ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: DURATION.standard, ease: EASE }}
        className={`fixed inset-x-4 top-16 z-20 rounded-2xl border border-amber-200 bg-white p-4 shadow-lift ${deviation ? '' : 'pointer-events-none opacity-0'}`}
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="text-[13.5px] font-extrabold text-onsurface">Something looks different</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-variant">
              Your vehicle appears to have moved away from the planned route. We're monitoring the trip.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                onClick={() => setDeviation(false)}
                className="rounded-lg bg-surface-2 px-3 py-1.5 text-[12px] font-bold text-forest-900 tap"
              >
                Contact support
              </button>
              <button onClick={() => setSosOpen(true)} className="rounded-lg bg-red-100 px-3 py-1.5 text-[12px] font-bold text-red-700 tap">
                SOS
              </button>
            </div>
          </div>
          <button onClick={() => setDeviation(false)} className="tap p-1 text-[13px] font-bold text-faint" aria-label="Dismiss">
            ✕
          </button>
        </div>
      </motion.div>

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-10 rounded-t-3xl bg-surface p-5 pb-28 shadow-sheet lg:bottom-6 lg:left-1/2 lg:mx-auto lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:rounded-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16px] font-extrabold tracking-tight text-onsurface">
              {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
            </p>
            <p className="mt-0.5 text-[12.5px] font-semibold text-variant">
              {dayLabel(trip.date)} · {trip.departureTime}
            </p>
          </div>
          <StatusChip label={`${remaining} min remaining`} tone="lime" dot pulse />
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
          <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={42} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[14px] font-extrabold text-onsurface">
              {trip.driverName} <BadgeCheck size={14} className="text-forest-700" />
            </p>
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-variant">
              <CarIcon size={13} /> {trip.vehicle.color} {trip.vehicle.make} {trip.vehicle.model} · <span className="font-mono">{trip.vehicle.plate}</span>
            </p>
          </div>
          <span className="text-[13px] font-extrabold text-forest-900">{naira(trip.pricePerSeat)}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => setShareOpen(true)}>
            <Share2 size={16} /> Share trip
          </Button>
          <Button variant="destructive" onClick={() => setSosOpen(true)}>
            <ShieldAlert size={16} /> SOS
          </Button>
        </div>
        <p className="mt-3 text-center text-[11.5px] font-semibold text-faint">
          PIN <span className="font-mono font-bold text-onsurface">{trip.pin}</span> — confirm before entering the vehicle
        </p>
      </div>

      {/* Share trip */}
      <Sheet open={shareOpen} onClose={() => setShareOpen(false)} title="Share your trip">
        <p className="text-[13.5px] text-variant">Let someone you trust follow your live trip.</p>
        <div className="mt-4 space-y-2">
          {trustedContacts.map((c) => (
            <button
              key={c.id}
              onClick={async () => {
                if (!session) return;
                setSharing(true);
                await safetyService.shareTrip(trip.id, session.userId, 'contact');
                setSharing(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-3 text-left hover:border-forest-600 tap"
            >
              <Avatar initials={c.name.split(' ').map((p) => p[0]).join('').slice(0, 2)} color="#1e7386" size={38} />
              <div className="flex-1">
                <p className="text-[14px] font-extrabold text-onsurface">{c.name}</p>
                <p className="text-[12px] font-semibold text-variant">{c.relation} · {prettyPhone(c.phone)}</p>
              </div>
            </button>
          ))}
        </div>
        <Button
          block
          variant="secondary"
          className="mt-3"
          loading={sharing}
          onClick={async () => {
            if (!session) return;
            setSharing(true);
            await safetyService.shareTrip(trip.id, session.userId, 'link');
            setSharing(false);
          }}
        >
          Share link
        </Button>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-lime-500" />
          <p className="text-[12.5px] font-bold text-forest-900">Trip sharing active</p>
          <span className="ml-auto text-[11.5px] font-semibold text-faint">Live</span>
        </div>
      </Sheet>

      {/* SOS */}
      {sosOpen && !sosSent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest-950/60 backdrop-blur-sm sm:items-center" onClick={() => setSosOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.standard, ease: EASE }}
            className="w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-lift sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-[170px]">
              <SafetyArt />
            </div>
            <h2 className="mt-4 text-center text-[19px] font-extrabold tracking-tight text-onsurface">Emergency assistance</h2>
            <p className="mt-1.5 text-center text-[13.5px] text-variant">Are you sure you need emergency help right now?</p>
            <div className="mt-5 space-y-2.5">
              <Button
                block
                variant="destructive"
                onClick={async () => {
                  if (!session) return;
                  await safetyService.triggerSOS(trip.id, session.userId, 'Rider pressed SOS during trip');
                  setSosSent(true);
                }}
              >
                <Phone size={16} /> Call emergency support
              </Button>
              <Button block variant="secondary" onClick={() => setSosOpen(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {sosSent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest-950/70 backdrop-blur-sm sm:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.standard, ease: EASE }}
            className="w-full max-w-sm rounded-t-3xl bg-white p-6 text-center shadow-lift sm:rounded-3xl"
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-600">
              <LifeBuoy size={28} className="text-white" />
            </span>
            <h2 className="mt-4 text-[20px] font-extrabold tracking-tight text-onsurface">Help is on the way</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-variant">
              Our emergency line has your trip details: {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}, driver {trip.driverName}, vehicle {trip.vehicle.plate}.
            </p>
            <div className="mt-4 rounded-xl bg-surface-2 p-3 text-left text-[12.5px] font-semibold text-variant">
              <p className="flex items-center gap-2"><MapPin size={13} className="text-forest-700" /> Current location shared with support</p>
              <p className="mt-1.5 flex items-center gap-2"><Phone size={13} className="text-forest-700" /> Emergency line: 0800 COMUTA (0800 266 882)</p>
            </div>
            <Button block className="mt-5" onClick={() => setSosSent(false)}>
              I'm safe
            </Button>
          </motion.div>
        </div>
      )}

      {/* passenger count hint */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-bold text-forest-900 shadow-lift backdrop-blur">
        <Users size={13} /> {Math.max(1, trip.seatsTotal - trip.seatsLeft)} riders
      </div>
    </div>
  );
}
