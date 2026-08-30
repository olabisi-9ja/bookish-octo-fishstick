import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Download,
  LocateFixed,
  MapPin,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { SiteFooter } from '../../components/brand/SiteFooter';
import { PublicNav } from './PublicNav';
import { Avatar } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { InstallPrompt } from '../../components/ui/InstallPrompt';
import { useComuta } from '../../store';
import { DURATION, EASE } from '../../constants';
import { priceBand, recommendedSeatPrice, taxiFare } from '../../constants';
import { hubDistanceKm, estimateDurationMin } from '../../utils/geo';
import type { Hub } from '../../types';
import { naira, durationLabel } from '../../utils/format';
import { addDaysISO } from '../../utils/dates';

/* ------------------------------------------------------------------ */
/* Real voices from the corridors COMUTA serves.                       */
/* ------------------------------------------------------------------ */
const RIDER_STORIES = [
  {
    quote: 'I used to spend almost ₦40k a month on danfo and quick rides. Now I share my Ikorodu to VI commute with the same three people every morning.',
    name: 'Oluwaseun A.',
    detail: 'Rider, Ikorodu → Victoria Island · 7:00 AM',
    color: '#155942',
  },
  {
    quote: 'The driver confirm thing is the part I love. I know by 11pm if tomorrow is happening. No more standing on the road hoping.',
    name: 'Chiamaka O.',
    detail: 'Rider, Lekki Phase 1 → Victoria Island',
    color: '#1e7386',
  },
  {
    quote: 'My mum tracks my trip from her phone. It used to drive her mad when I took okada at night. Now she just checks COMUTA.',
    name: 'Tunde B.',
    detail: 'Rider, Ajah → Victoria Island',
    color: '#2b6e4f',
  },
];

const CORRIDORS: { from: string; to: string; label: string }[] = [
  { from: 'hub_ikorodu', to: 'hub_vi', label: 'Ikorodu' },
  { from: 'hub_ajah', to: 'hub_vi', label: 'Ajah' },
  { from: 'hub_lekki', to: 'hub_vi', label: 'Lekki' },
  { from: 'hub_ikeja', to: 'hub_vi', label: 'Ikeja' },
];

const FEATURED_TRIP_IDS = ['t_ikvi_0700', 't_ajvi_0700', 't_lekvi_0715', 't_ikevi_0630'];

const DEPARTURES = ['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '5:00 PM', '6:00 PM'];

function matchHub(hubs: Hub[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    hubs.find((h) => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q)) ?? null
  );
}

/* ------------------------------------------------------------------ */
/* Landing                                                            */
/* ------------------------------------------------------------------ */
export function Landing() {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const trips = useComuta((s) => s.trips);
  const users = useComuta((s) => s.users);
  const vehicles = useComuta((s) => s.vehicles);
  const driverProfiles = useComuta((s) => s.driverProfiles);

  const [mode, setMode] = useState<'ride' | 'drive'>('ride');
  const [from, setFrom] = useState('Ikorodu');
  const [to, setTo] = useState('Victoria Island');
  const [when, setWhen] = useState('Tomorrow');
  const [departure, setDeparture] = useState('7:00 AM');
  const [recurring, setRecurring] = useState(true);
  const [showPrice, setShowPrice] = useState(false);

  const tomorrow = addDaysISO(1);

  const quote = useMemo(() => {
    const f = matchHub(hubs, from);
    const t = matchHub(hubs, to);
    if (!f || !t || f.id === t.id) return null;
    const km = hubDistanceKm(f, t);
    const min = estimateDurationMin(km);
    const seat = recommendedSeatPrice(km, min);
    const band = priceBand(seat);
    return { km, min, band, taxi: taxiFare(km, min) };
  }, [hubs, from, to]);

  const seatsTomorrow = trips
    .filter((t) => t.date === tomorrow && !['cancelled', 'completed', 'at_risk'].includes(t.status))
    .reduce((a, t) => a + t.seatsLeft, 0);

  const featured = useMemo(
    () =>
      FEATURED_TRIP_IDS.map((id) => {
        const trip = trips.find((t) => t.id === id);
        if (!trip) return null;
        const driver = users.find((u) => u.id === trip.driverId);
        const profile = driverProfiles[trip.driverId];
        const vehicle = profile ? vehicles.find((v) => v.id === profile.vehicleId) : undefined;
        return { trip, driver, profile, vehicle };
      }).filter((x): x is NonNullable<typeof x> => !!x),
    [trips, users, vehicles, driverProfiles],
  );

  const search = () => {
    const f = matchHub(hubs, from);
    const t = matchHub(hubs, to);
    const params = new URLSearchParams();
    if (f) params.set('from', f.id);
    if (t) params.set('to', t.id);
    if (when === 'Today') params.set('date', new Date().toISOString().slice(0, 10));
    if (recurring) params.set('recurring', '1');
    const qs = params.toString();
    navigate(`/app/rider/plan${qs ? `?${qs}` : ''}`);
  };

  const goCorridor = (fromId: string, toId: string) =>
    navigate(`/app/rider/plan?from=${fromId}&to=${toId}`);

  return (
    <div className="min-h-dvh bg-surface text-onsurface">
      {/* Nav */}
      <PublicNav />

      {/* ---- Split-action hero: functional ride search + driver earning panel ---- */}
      <section className="relative flex min-h-[780px] items-center overflow-hidden bg-forest-950 text-white">
        {/* Live hero photograph: commuters on the corridor */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat [background-position:64%_center] md:[background-position:center_42%]"
          style={{ backgroundImage: "url('/images/padigo-commuters.jpg')" }}
          role="img"
          aria-label="Commuters heading out on a Lagos route at dawn"
        />
        {/* Brand tint so the photo sits inside the forest-green palette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 73% 32%, rgba(28,110,84,.30), transparent 46%), linear-gradient(120deg, rgba(4,31,23,.55) 0%, rgba(10,51,37,.35) 100%)',
          }}
        />
        {/* Legibility overlay for the hero copy and cards */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(102deg, rgba(4,27,21,.92) 0%, rgba(6,33,25,.82) 38%, rgba(5,32,24,.42) 66%, rgba(5,32,24,.18) 100%), linear-gradient(0deg, rgba(4,27,21,.55), transparent 55%)',
          }}
        />

        <div className="relative z-[3] mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-28 pt-16 lg:grid-cols-[1fr_0.9fr] lg:pt-20">
          {/* Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.standard, ease: EASE }}
              className="mb-5 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-lime-500"
            >
              <Sparkles size={14} /> Built for everyday Lagos commutes
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: DURATION.standard, ease: EASE }}
              className="text-[46px] font-extrabold leading-[1.02] tracking-tight sm:text-[64px] lg:text-[70px]"
            >
              Your route.
              <br />
              Your people.
              <br />
              <span className="text-lime-500">Your commute.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: DURATION.standard, ease: EASE }}
              className="mt-4 text-[15px] font-bold tracking-wide text-lime-400"
            >
              Share the journey. Split the cost. Know your ride.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: DURATION.standard, ease: EASE }}
              className="mt-3 max-w-[560px] text-[17px] leading-relaxed text-white/75"
            >
              Match with verified people heading your way, share the cost, and turn your daily route into a commute you can count on.
            </motion.p>

            {/* Audience switch */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: DURATION.standard, ease: EASE }}
              className="mt-7 grid max-w-[440px] grid-cols-2 gap-1.5 rounded-2xl border border-white/15 bg-white/10 p-1.5"
              role="tablist"
              aria-label="Choose how you want to use COMUTA"
            >
              <button
                role="tab"
                aria-selected={mode === 'ride'}
                onClick={() => setMode('ride')}
                className={`tap flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-bold transition-colors ${
                  mode === 'ride' ? 'bg-lime-500 text-forest-950 shadow-[0_8px_22px_rgba(189,242,63,.22)]' : 'text-white/80 hover:text-white'
                }`}
              >
                <Search size={16} /> I want a ride
              </button>
              <button
                role="tab"
                aria-selected={mode === 'drive'}
                onClick={() => setMode('drive')}
                className={`tap flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-bold transition-colors ${
                  mode === 'drive' ? 'bg-lime-500 text-forest-950 shadow-[0_8px_22px_rgba(189,242,63,.22)]' : 'text-white/80 hover:text-white'
                }`}
              >
                <CarFront size={16} /> I want to earn
              </button>
            </motion.div>
          </div>

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: DURATION.expressive, ease: EASE }}
            className="relative z-[3]"
          >
            {mode === 'ride' ? (
              <RideCard
                from={from}
                to={to}
                onFrom={setFrom}
                onTo={setTo}
                when={when}
                onWhen={setWhen}
                departure={departure}
                onDeparture={setDeparture}
                recurring={recurring}
                onRecurring={setRecurring}
                showPrice={showPrice}
                onTogglePrice={() => setShowPrice((v) => !v)}
                quote={quote}
                onSearch={search}
              />
            ) : (
              <DriveCard onEarn={() => navigate('/app/driver/routes/new')} />
            )}
          </motion.div>
        </div>

        {/* Corridor strip */}
        <div className="absolute inset-x-0 bottom-0 z-[4] flex h-14 items-center justify-center gap-7 border-t border-white/10 bg-forest-950/85 backdrop-blur">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-lime-500">Popular corridors</span>
          {CORRIDORS.map((c) => (
            <button
              key={c.label}
              onClick={() => goCorridor(c.from, c.to)}
              className="tap flex items-center gap-2 text-[12.5px] font-bold text-white hover:text-lime-500"
            >
              {c.label} <ArrowRight size={13} /> VI
            </button>
          ))}
          <span className="ml-3 text-[11.5px] font-bold text-white/60">{seatsTomorrow} seats tomorrow</span>
        </div>
      </section>

      {/* ---- Proof strip ---- */}
      <section className="border-b border-line-soft bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 md:grid-cols-4">
          <ProofStat to={4.8} format={(v) => `${v.toFixed(1)}`} label="rider rating" />
          <ProofStat to={96} format={(v) => `${Math.round(v)}%`} label="top route match" />
          <ProofStat to={38} format={(v) => `₦${Math.round(v)}k`} label="potential monthly savings" />
          <ProofStat to={4.9} format={(v) => `${v.toFixed(1)}/5`} label="rider trust rating" />
        </div>
      </section>

      {/* ---- Commuter voices ---- */}
      <section className="border-b border-line-soft bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-lime-600">Commuter voices</p>
          <h2 className="mt-2 max-w-2xl text-[30px] font-extrabold tracking-tight text-forest-900 lg:text-[36px]">
            Built for the people who actually make this journey every day.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {RIDER_STORIES.map((s) => (
              <figure key={s.name} className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6">
                <blockquote className="text-[15px] font-semibold leading-relaxed text-onsurface">“{s.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line-soft pt-4">
                  <Avatar initials={s.name.split(' ').map((p) => p[0]).join('')} color={s.color} size={38} />
                  <div>
                    <p className="text-[13.5px] font-extrabold text-onsurface">{s.name}</p>
                    <p className="text-[11.5px] font-semibold text-variant">{s.detail}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <Section title="How COMUTA works" kicker="Plan → Book → Ride">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard n="01" icon={<CalendarCheck size={20} />} title="Plan your commute" body="Choose your corridor, day and time. See every verified driver making that exact journey." />
          <StepCard n="02" icon={<BadgeCheck size={20} />} title="Know your ride" body="Compare drivers by reliability, on-time record, vehicle and price. Reserve your seat in seconds." />
          <StepCard n="03" icon={<ShieldCheck size={20} />} title="Travel protected" body="Meet at a safe hub, confirm your trip PIN, and share your live trip with people you trust." />
        </div>
      </Section>

      {/* ---- Popular routes ---- */}
      <Section title="Popular Lagos routes" kicker="Moving tomorrow morning">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ trip, driver, profile, vehicle }) => (
            <PublicRideCard
              key={trip.id}
              trip={trip}
              driverName={driver ? `${driver.firstName} ${driver.lastName[0]}.` : 'COMUTA driver'}
              initials={driver?.photoInitials ?? 'CD'}
              color={driver?.avatarColor ?? '#155942'}
              rating={driver && profile ? Math.min(5, 4.7 + (profile.completionRate - 95) * 0.05).toFixed(1) : '4.8'}
              tripsCount={profile?.completedTrips ?? 0}
              match={Math.min(99, Math.round(((profile?.completionRate ?? 98) + (profile?.onTimeRate ?? 97)) / 2))}
              vehicleLabel={vehicle ? `${vehicle.make} ${vehicle.model}` : 'Toyota Corolla'}
              onOpen={() => goCorridor(trip.fromId, trip.toId)}
            />
          ))}
        </div>
      </Section>

      {/* ---- Shared-seat model ---- */}
      <Section dark title="Split the cost of every seat" kicker="The shared-seat model">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-line-soft pb-4">
              <p className="text-[15px] font-extrabold text-onsurface">Your trip, shared</p>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-extrabold text-variant">4 seats</span>
            </div>
            {[
              { label: 'Solo ride', value: '≈ ₦6,000', you: false },
              { label: 'Shared with 1', value: '≈ ₦1,500', you: true },
              { label: 'Shared with 3', value: '≈ ₦1,500 + ₦4,500 back', you: false },
            ].map((r) => (
              <div key={r.label} className={`flex items-center justify-between border-b border-line-soft py-3.5 last:border-0 ${r.you ? '' : 'opacity-70'}`}>
                <p className="text-[13.5px] font-bold text-onsurface">{r.label}</p>
                <p className={`text-[13.5px] font-extrabold ${r.you ? 'text-forest-900' : 'text-variant'}`}>{r.value}</p>
              </div>
            ))}
            <p className="mt-3 rounded-xl bg-lime-50 px-3 py-2.5 text-[12.5px] font-bold text-lime-700">
              Drivers recover up to ₦18,500 a month by sharing seats they already travel with.
            </p>
          </div>
          <div>
            <h3 className="text-[26px] font-extrabold tracking-tight text-white">One commute, several passengers. Everyone pays less.</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              COMUTA matches you with people travelling the same corridor at the same time. Instead of four people paying for four separate rides, you share one predictable journey.
            </p>
            <figure className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <blockquote className="text-[15px] font-semibold leading-relaxed text-white/90">“I drive to the Island every morning anyway. Now three people cover my fuel and the bridge toll.”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <Avatar initials="AK" color="#7a5c1f" size={38} />
                <div>
                  <p className="text-[13.5px] font-extrabold text-white">Adebayo K., driver</p>
                  <p className="text-[11.5px] font-semibold text-white/60">Ikorodu → Victoria Island · recovered ₦18,500 last month</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      {/* ---- Who COMUTA is for ---- */}
      <Section title="Who COMUTA is for" kicker="Everyday people, everyday routes">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard icon={<Users size={20} />} title="Office commuters" body="Ikorodu, Lekki, Ajah or Ikeja to the Island every weekday. Same route, same time, same people." />
          <StepCard icon={<CalendarCheck size={20} />} title="Parents & families" body="Know your pickup hub, share your live trip with family, and never wait at a random corner." />
          <StepCard icon={<Repeat size={20} />} title="Drivers going anyway" body="You're already making the trip. Fill empty seats and recover fuel, tolls and wear." />
        </div>
      </Section>

      {/* ---- Reliability ---- */}
      <Section title="Reliability you can plan around" kicker="Trust, built in">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard icon={<BadgeCheck size={20} />} title="Verified people & vehicles" body="Drivers, IDs and vehicles are checked before the first trip. Ratings and completion rates are public." />
          <StepCard icon={<MapPin size={20} />} title="Safe hubs only" body="Every pickup happens at an approved, monitored hub. Never a random street corner." />
          <StepCard icon={<ShieldCheck size={20} />} title="Bookings are protected" body="If your driver can't make the trip, we find another option or refund you. No dead ends." />
        </div>
      </Section>

      {/* ---- Recurring routes ---- */}
      <Section dark title="Make it a routine" kicker="Recurring routes">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-[26px] font-extrabold tracking-tight text-white">The same commute, every day. Already booked for you.</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Save your regular journey once. COMUTA keeps an eye on it, books your seat each day, and tells you the moment your driver confirms, so you can plan around certainty.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-white">Ikorodu → Victoria Island</p>
              <span className="rounded-full bg-lime-500 px-2.5 py-1 text-[11px] font-extrabold text-forest-950">Mon – Fri</span>
            </div>
            <div className="mt-4 space-y-2 text-[13px] font-semibold text-white/70">
              <p className="flex items-center justify-between"><span>7:00 AM departure</span><span className="text-white">✓ booked</span></p>
              <p className="flex items-center justify-between"><span>Driver confirmation</span><span className="text-lime-500">✓ confirmed</span></p>
              <p className="flex items-center justify-between"><span>Seat 1 · ₦1,500</span><span className="text-white">✓ secured</span></p>
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
              <Avatar initials="OA" color="#155942" size={36} />
              <div>
                <p className="text-[13px] font-extrabold text-white">Oluwaseun A.</p>
                <p className="text-[11.5px] text-white/55">Rides this route every weekday</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Safety ---- */}
      <Section title="Safety that's calm, not scary" kicker="Safety">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard icon={<ShieldCheck size={20} />} title="Trip PIN" body="A private code confirms the vehicle before you enter. Only your driver sees it." />
          <StepCard icon={<Users size={20} />} title="Live trip sharing" body="Share your route with trusted contacts for the whole journey. You can stop sharing any time." />
          <StepCard icon={<BadgeCheck size={20} />} title="SOS, when you need it" body="One clear emergency action with your location, trip and vehicle details ready for support." />
        </div>
      </Section>

      {/* ---- Driver cost recovery ---- */}
      <Section title="Drive your own commute. Recover the cost." kicker="For drivers">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <StepCard icon={<Repeat size={20} />} title="Share empty seats" body="Publish your existing commute. You're going anyway. Passengers cover part of the journey." />
            <StepCard icon={<Users size={20} />} title="Know your passengers" body="Verified riders with NIN-backed identities. No surprises at pickup." />
            <StepCard icon={<BadgeCheck size={20} />} title="Keep your standing" body="Reliability that rewards consistency. The more trips you complete, the more bookings you get." />
          </div>
          <figure className="flex flex-col justify-between rounded-3xl bg-forest-900 p-6 text-white lg:col-span-2">
            <blockquote className="max-w-xl text-[19px] font-semibold leading-relaxed">
              “At first I was worried about strangers in my car. But everyone is verified, and the trip PIN thing made my wife comfortable.”
            </blockquote>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <figcaption className="flex items-center gap-3">
                <Avatar initials="IN" color="#3d5f8a" size={42} />
                <div>
                  <p className="text-[14px] font-extrabold">Ifeoma N., driver</p>
                  <p className="text-[12px] text-white/60">Ikeja → Victoria Island · 11 trips this month</p>
                </div>
              </figcaption>
              <Button size="md" variant="lime" onClick={() => navigate('/app/driver/routes/new')}>
                Start sharing your commute <ArrowRight size={16} />
              </Button>
            </div>
          </figure>
        </div>
      </Section>

      {/* ---- Install / use ---- */}
      <Section dark>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-lime-500">Your commute. Shared. Simpler.</p>
          <h2 className="mt-3 text-[32px] font-extrabold tracking-tight text-white">Keep your commute one tap away</h2>
          <p className="mt-3 text-[15px] text-white/70">
            COMUTA installs like an app on your phone. Fast, offline-friendly, and built around your daily journey.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/signup')}>
              <Download size={17} /> Install COMUTA
            </Button>
            <Button size="lg" variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate('/login')}>
              Log in
            </Button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <SiteFooter />
      <InstallPrompt />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero cards                                                          */
/* ------------------------------------------------------------------ */
function RideCard({
  from,
  to,
  onFrom,
  onTo,
  when,
  onWhen,
  departure,
  onDeparture,
  recurring,
  onRecurring,
  showPrice,
  onTogglePrice,
  quote,
  onSearch,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  when: string;
  onWhen: (v: string) => void;
  departure: string;
  onDeparture: (v: string) => void;
  recurring: boolean;
  onRecurring: (v: boolean) => void;
  showPrice: boolean;
  onTogglePrice: () => void;
  quote: { km: number; min: number; band: { low: number; high: number }; taxi: number } | null;
  onSearch: () => void;
}) {
  const inputCls =
    'flex min-h-[50px] w-full items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 text-ink focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/15';
  return (
    <div className="overflow-hidden rounded-3xl bg-white text-onsurface shadow-[0_40px_90px_rgba(4,27,21,.42)]">
      <div className="bg-gradient-to-b from-[#f1f7f2] to-transparent px-6 pt-6">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-forest-700">Book your commute</p>
        <h3 className="mt-2 text-[23px] font-extrabold leading-tight tracking-tight text-forest-900">
          See real people <span className="text-forest-600">going your way.</span>
        </h3>
      </div>
      <div className="p-6 pt-5">
        <div className="relative">
          <label className="block">
            <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#77807c]">Leaving from</span>
            <div className={inputCls}>
              <span className="mx-0.5 h-2.5 w-2.5 rounded-full border-[3px] border-forest-700" aria-hidden />
              <input
                value={from}
                onChange={(e) => onFrom(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[#24312d] outline-none"
                placeholder="Ikorodu"
                aria-label="Leaving from"
              />
              <LocateFixed size={17} className="text-faint" />
            </div>
          </label>
          <div className="ml-[17px] h-6 border-l-2 border-dashed border-line" aria-hidden />
          <label className="block">
            <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#77807c]">Going to</span>
            <div className={inputCls}>
              <MapPin size={15} className="ml-0.5 text-lime-600" />
              <input
                value={to}
                onChange={(e) => onTo(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[#24312d] outline-none"
                placeholder="Victoria Island"
                aria-label="Going to"
              />
            </div>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label>
            <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#77807c]">When</span>
            <div className={`${inputCls} min-h-[46px]`}>
              <CalendarCheck size={16} className="text-faint" />
              <select value={when} onChange={(e) => onWhen(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#24312d] outline-none" aria-label="When">
                <option>Today</option>
                <option>Tomorrow</option>
              </select>
              <ChevronDown size={15} className="text-faint" />
            </div>
          </label>
          <label>
            <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#77807c]">Departure</span>
            <div className={`${inputCls} min-h-[46px]`}>
              <Clock3 size={16} className="text-faint" />
              <select value={departure} onChange={(e) => onDeparture(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#24312d] outline-none" aria-label="Departure">
                {DEPARTURES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={15} className="text-faint" />
            </div>
          </label>
        </div>

        <button onClick={() => onRecurring(!recurring)} className="mt-4 flex w-full items-start gap-2.5 text-left tap" aria-pressed={recurring}>
          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${recurring ? 'border-forest-800 bg-forest-800 text-white' : 'border-line bg-white text-white'}`}>
            {recurring && <Check size={13} />}
          </span>
          <span>
            <strong className="block text-[12.5px] text-[#28352f]">Make it my regular commute</strong>
            <small className="block text-[10.5px] font-medium text-[#75807b]">Get matched automatically every weekday</small>
          </span>
        </button>

        <button onClick={onTogglePrice} className="mt-4 inline-flex items-center gap-2 text-[12px] font-extrabold text-forest-700 tap">
          {showPrice ? <ChevronDown size={14} /> : <Zap size={14} />} {showPrice ? 'Hide estimated prices' : 'See prices before signing up'}
        </button>

        {showPrice && (
          <div className="mt-3 rounded-xl border border-dashed border-[#cbd8d0] bg-[#f4f8f3] px-4 py-3 text-[12px] text-[#3f4d48]">
            {quote ? (
              <>
                <strong className="text-[16px] font-extrabold tracking-tight text-forest-900">
                  {naira(quote.band.low)} - {naira(quote.band.high)}
                </strong>{' '}
                per seat · about {durationLabel(quote.min)}
                <small className="mt-1 block text-[#75807b]">
                  {quote.km.toFixed(0)} km route · vs {naira(quote.taxi)} by taxi · no surge pricing
                </small>
              </>
            ) : (
              <small className="text-[#75807b]">Start typing a Lagos route like “Ikorodu” or “Victoria Island” to see a per-seat estimate.</small>
            )}
          </div>
        )}

        <Button block className="mt-4" onClick={onSearch}>
          Find people going my way <ArrowRight size={17} />
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-[#5e6c76]">
          <ShieldCheck size={13} className="text-forest-700" /> Identity verified members · Secure payments
        </p>
      </div>
    </div>
  );
}

function DriveCard({ onEarn }: { onEarn: () => void }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white text-onsurface shadow-[0_40px_90px_rgba(4,27,21,.42)]">
      <div className="bg-gradient-to-b from-[#eef7e0] to-transparent px-6 pt-6">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-lime-700">Drive & earn</p>
        <h3 className="mt-2 text-[23px] font-extrabold leading-tight tracking-tight text-forest-900">
          Your empty seats can <span className="text-lime-700">pay for the road.</span>
        </h3>
      </div>
      <div className="p-6 pt-5">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-lime-700/15 bg-gradient-to-br from-[#e8fbd0] to-[#eef8f2] px-5 py-4">
          <div>
            <small className="block text-[8px] font-extrabold uppercase tracking-[0.14em] text-lime-700">This week</small>
            <strong className="mt-1 block text-[28px] font-extrabold leading-none tracking-tight text-forest-950">₦24,600</strong>
            <span className="text-[9.5px] font-semibold text-[#6f8068]">from 9 shared seats</span>
          </div>
          <div className="flex h-11 items-end gap-1.5">
            {[45, 62, 96, 74, 56].map((h, i) => (
              <span key={i} className={`w-2 rounded-t ${h === 96 ? 'bg-lime-600' : 'bg-[#b7d7cb]'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <ul className="mt-4 space-y-2.5">
          {['You set the route & schedule', 'Verified riders only', 'Weekly, transparent payouts'].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[12.5px] font-bold text-[#33403a]">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-lime-100 text-lime-700">
                <Check size={13} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#e2e8e0] bg-white px-3.5 py-3 text-[11.5px] font-extrabold text-forest-900">
          <span className="flex items-center gap-1.5">
            <i className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Ikorodu
          </span>
          <ArrowRight size={14} />
          <span className="flex items-center gap-1.5">
            <i className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Victoria Island
          </span>
          <em className="ml-auto text-[9.5px] font-bold not-italic text-[#8a938e]">184 trips shared</em>
        </div>

        <Button block variant="lime" className="mt-4" onClick={onEarn}>
          <CarFront size={17} /> Register as a driver <ArrowRight size={17} />
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-[#5e6c76]">
          <BadgeCheck size={13} className="text-lime-700" /> 6 verification signals · Weekly settlement
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function ProofStat({ to, format, label }: { to: number; format: (v: number) => string; label: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to);
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setVal(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to]);

  return (
    <div className="text-center">
      <p ref={ref} className="text-[40px] font-extrabold tracking-tight text-forest-900">
        {format(val)}
      </p>
      <p className="mt-1 text-[12px] font-semibold text-variant">{label}</p>
    </div>
  );
}

function PublicRideCard({
  trip,
  driverName,
  initials,
  color,
  rating,
  tripsCount,
  match,
  vehicleLabel,
  onOpen,
}: {
  trip: { fromId: string; toId: string; departureTime: string; seatsLeft: number; routeId?: string; pricePerSeat: number };
  driverName: string;
  initials: string;
  color: string;
  rating: string;
  tripsCount: number;
  match: number;
  vehicleLabel: string;
  onOpen: () => void;
}) {
  const hubs = useComuta((s) => s.hubs);
  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      <div className="relative h-28 overflow-hidden bg-surface-2">
        <span className="absolute -left-6 top-4 h-10 w-32 rotate-[18deg] rounded-full bg-line-soft" />
        <span className="absolute -right-4 top-10 h-8 w-28 -rotate-[14deg] rounded-full bg-line-soft" />
        <svg viewBox="0 0 320 105" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M20 78 C82 62 95 22 168 42 S230 90 302 28" fill="none" stroke="#C9D6D2" strokeWidth="13" strokeLinecap="round" />
          <path d="M20 78 C82 62 95 22 168 42 S230 90 302 28" fill="none" stroke="#0A251C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="78" r="6" fill="#0A251C" stroke="#fff" strokeWidth="2" />
          <circle cx="302" cy="28" r="6" fill="#BDF23F" stroke="#fff" strokeWidth="2" />
        </svg>
        <span className="absolute left-3 top-3 rounded-full bg-forest-900 px-2.5 py-1 text-[11px] font-extrabold text-lime-500">{match}% match</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} color={color} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-extrabold text-onsurface">{driverName}</p>
            <p className="flex items-center gap-1 text-[11.5px] font-semibold text-variant">
              <Star size={12} className="fill-lime-600 text-lime-600" /> {rating} · {tripsCount} trips
            </p>
          </div>
          <BadgeCheck size={17} className="shrink-0 text-forest-700" aria-label="Verified driver" />
        </div>
        <p className="mt-3 flex items-center gap-2 text-[14px] font-extrabold text-onsurface">
          <span>{from?.name.replace(' Hub', '')}</span>
          <ArrowRight size={14} className="shrink-0 text-faint" />
          <span>{to?.name.replace(' Hub', '')}</span>
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-bold text-variant">
          <span className="flex items-center gap-1"><Clock3 size={12} /> {trip.departureTime}</span>
          <span className="flex items-center gap-1"><CarFront size={12} /> {trip.seatsLeft} seats</span>
          <span className="flex items-center gap-1"><Repeat size={12} /> {trip.routeId ? 'Mon–Fri' : 'Tomorrow'}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
          <span>
            <small className="block text-[9.5px] font-bold uppercase tracking-wider text-faint">Per seat</small>
            <strong className="text-[15px] font-extrabold tracking-tight text-forest-900">{naira(trip.pricePerSeat)}</strong>
          </span>
          <Button size="sm" variant="secondary" onClick={onOpen}>
            View ride <ArrowRight size={14} />
          </Button>
        </div>
      </div>
      <p className="px-4 pb-4 text-[10.5px] font-semibold text-faint">{vehicleLabel} · verified</p>
    </article>
  );
}

function Section({ title, kicker, dark = false, children }: { title?: string; kicker?: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <section className={dark ? 'bg-forest-950 py-16 lg:py-20' : 'bg-surface py-16 lg:py-20'}>
      <div className="mx-auto max-w-6xl px-5">
        {kicker && <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-lime-600">{kicker}</p>}
        {title && (
          <h2 className={`mt-2 max-w-xl text-[30px] font-extrabold tracking-tight lg:text-[36px] ${dark ? 'text-white' : 'text-forest-900'}`}>
            {title}
          </h2>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function StepCard({ icon, title, body, n }: { icon: React.ReactNode; title: string; body: string; n?: string }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-900 text-lime-500">{icon}</span>
        {n && <span className="text-[28px] font-extrabold tracking-tight text-line-soft">{n}</span>}
      </div>
      <h3 className="mt-4 text-[17px] font-extrabold tracking-tight text-onsurface">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-variant">{body}</p>
    </div>
  );
}
