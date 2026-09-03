/**
 * COMUTA landing page.
 *
 * Structure studied from Lyft, Bolt and Uber's landing pages, then adapted to
 * what COMUTA actually sells. What was taken, and what deliberately was not:
 *
 *  - Uber  -> a real, working entry point sitting IN the hero. Uber asks
 *             "pickup / dropoff / now". COMUTA is pre-booked, so ours asks
 *             "from / to / which day" and searches seats, not cars.
 *             Also the 3-card explainer row and the sticky mobile CTA bar.
 *  - Lyft  -> alternating rider / earner bands on tinted backgrounds, the
 *             horizontally scrolling option cards (ours are live corridors,
 *             not ride tiers), and the paired rider/driver app blocks.
 *  - Bolt  -> giving ONE differentiating feature a full-bleed band of its own
 *             ("Meet Bolt 7"). Ours is the T-8 confirmation promise.
 *
 * What none of them have, and COMUTA needs: a section explaining what this
 * replaces. Ride-hailing is a familiar model; a pre-booked shared commute is
 * not, so the page has to teach it before it can sell it.
 *
 * Brand: every colour is a Figma token from design/design-tokens.json
 * (primary-*, accent-*, ntl-*, nv-*). No new palette is invented here. The
 * marketing page is not one of the 38 designed Figma screens, so the LAYOUT is
 * composed here, while the ramps, type scale and button hierarchy stay the
 * design system's. Display roles use tightened leading rather than the M3 flat
 * 1.5, which is an app-UI value and reads wrong at 57px on a web hero.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  ChevronRight,
  Clock3,
  MapPin,
  Repeat,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { SiteFooter } from '../../components/brand/SiteFooter';
import { PublicNav } from './PublicNav';
import { Button } from '../../components/ui/Button';
import { InstallPrompt } from '../../components/ui/InstallPrompt';
import { useComuta } from '../../store';
import { DURATION, EASE } from '../../constants';
import { RECURRENCE, priceBand, recommendedSeatPrice, taxiFare } from '../../constants';
import { hubDistanceKm, estimateDurationMin } from '../../utils/geo';
import type { Hub, Trip } from '../../types';
import { naira, durationLabel } from '../../utils/format';
import { addDaysISO } from '../../utils/dates';

const APP_STORE_LINK = 'https://apps.apple.com/ng/app/comuta/id0000000000';
const GOOGLE_PLAY_LINK = 'https://play.google.com/store/apps/details?id=com.comuta.app';

const FEATURED_TRIP_IDS = ['t_ikvi_0700', 't_ajvi_0700', 't_lekvi_0715', 't_ikevi_0630'];

/** Working days a typical Lagos commuter makes the same trip in a month. */
const COMMUTE_DAYS_PER_MONTH = 22;

function matchHub(hubs: Hub[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return hubs.find((h) => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q)) ?? null;
}

/**
 * Scroll reveal. Transform-only on purpose: content must never depend on an
 * IntersectionObserver having fired to be readable. A fade-from-zero hides the
 * page from crawlers, from anchor-link jumps and from anyone scrolling fast -
 * unacceptable on a page whose job is to explain an unfamiliar model.
 */
const fade = {
  initial: { y: 18 },
  whileInView: { y: 0 },
  viewport: { once: true, amount: 0.05 as const },
  transition: { duration: DURATION.expressive, ease: EASE },
};

/* ================================================================== */
/* Landing                                                            */
/* ================================================================== */
export function Landing() {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const trips = useComuta((s) => s.trips);
  const users = useComuta((s) => s.users);
  const vehicles = useComuta((s) => s.vehicles);
  const driverProfiles = useComuta((s) => s.driverProfiles);

  const [from, setFrom] = useState('Ikorodu');
  const [to, setTo] = useState('Victoria Island');
  const [when, setWhen] = useState<'today' | 'tomorrow'>('tomorrow');
  const [recurring, setRecurring] = useState(true);

  /*
   * The sticky mobile bar repeats the hero's own "Find seats" button, so
   * while the planner is on screen the two sit stacked on top of each other.
   * Uber only reveals its bar once the form has scrolled away; this does the
   * same. Defaults to hidden, and stays hidden if IntersectionObserver is
   * missing, because a duplicate button is worse than no sticky bar.
   */
  const planner = useRef<HTMLDivElement>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const el = planner.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setShowStickyCta(!entry.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tomorrow = addDaysISO(1);

  /** Live seat quote for whatever corridor is in the hero inputs. */
  const quote = useMemo(() => {
    const f = matchHub(hubs, from);
    const t = matchHub(hubs, to);
    if (!f || !t || f.id === t.id) return null;
    const km = hubDistanceKm(f, t);
    const min = estimateDurationMin(km);
    const seat = recommendedSeatPrice(km, min);
    return { km, min, seat, band: priceBand(seat), taxi: taxiFare(km, min) };
  }, [hubs, from, to]);

  const seatsTomorrow = trips
    .filter((t) => t.date === tomorrow && !['cancelled', 'completed', 'at_risk'].includes(t.status))
    .reduce((a, t) => a + t.seatsLeft, 0);

  const featured = useMemo(
    () =>
      FEATURED_TRIP_IDS.flatMap((id) => {
        const trip: Trip | undefined = trips.find((t) => t.id === id);
        if (!trip) return [];
        const driver = users.find((u) => u.id === trip.driverId);
        const profile = driverProfiles[trip.driverId];
        const vehicle = profile ? vehicles.find((v) => v.id === profile.vehicleId) : undefined;
        return [{ trip, driverName: driver?.firstName, vehicleMake: vehicle?.make }];
      }),
    [trips, users, vehicles, driverProfiles],
  );

  /** One seat price for the whole page, from the same model as the hero quote. */
  const seatPrice = quote?.seat ?? 2800;

  const hubArea = (id: string) => hubs.find((h) => h.id === id)?.area ?? '';

  const search = () => {
    const f = matchHub(hubs, from);
    const t = matchHub(hubs, to);
    const params = new URLSearchParams();
    if (f) params.set('from', f.id);
    if (t) params.set('to', t.id);
    params.set('date', when === 'today' ? new Date().toISOString().slice(0, 10) : tomorrow);
    if (recurring) params.set('recurring', '1');
    navigate('/app/rider/plan?' + params.toString());
  };

  const goCorridor = (fromId: string, toId: string) =>
    navigate('/app/rider/plan?from=' + fromId + '&to=' + toId);

  return (
    <div className="min-h-dvh bg-white text-ntl-10">
      <PublicNav />

      {/* ============================================================ */}
      {/* HERO - deep forest, with the seat search living inside it     */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-primary-base text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #16503d 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[13px] font-semibold text-primary-70">
              <MapPin size={14} aria-hidden /> Lagos · Ikorodu &#8646; Island
            </span>

            <h1 className="mt-5 text-[40px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[52px] lg:text-[57px]">
              Book your seat,
              <br />
              not a whole car.
            </h1>

            <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.6] text-white/70">
              Verified Lagos drivers are already making your commute. Reserve a seat on the run you
              take every weekday, at a fare that is fixed before you travel.
            </p>

            {/* the working entry point: Uber's idea, our model */}
            <div ref={planner} className="mt-8 rounded-2xl bg-white p-3 text-ntl-10 shadow-lift sm:p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <HeroField label="From" value={from} onChange={setFrom} hubs={hubs} />
                <HeroField label="To" value={to} onChange={setTo} hubs={hubs} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl bg-ntl-95 p-1" role="group" aria-label="Travel day">
                  {(['today', 'tomorrow'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setWhen(d)}
                      aria-pressed={when === d}
                      className={
                        'rounded-lg px-3.5 py-2 text-[13px] font-bold capitalize transition-colors ' +
                        (when === d
                          ? 'bg-white text-primary-base shadow-sm'
                          : 'text-nv-40 hover:text-primary-base')
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setRecurring((r) => !r)}
                  aria-pressed={recurring}
                  className={
                    'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] font-bold transition-colors ' +
                    (recurring
                      ? 'border-primary-30 bg-primary-95 text-primary-20'
                      : 'border-nv-90 text-nv-40 hover:border-nv-70')
                  }
                >
                  <Repeat size={14} aria-hidden /> Every weekday
                </button>

                <Button size="lg" className="ml-auto w-full sm:w-auto" onClick={search}>
                  Find seats <ArrowRight size={17} aria-hidden />
                </Button>
              </div>

              {quote && (
                <p className="mt-3 border-t border-nv-95 pt-3 text-[13px] text-nv-40">
                  Seats on this corridor usually run{' '}
                  <strong className="font-bold text-primary-base">
                    {naira(quote.band.low)}&ndash;{naira(quote.band.high)}
                  </strong>{' '}
                  &middot; about {durationLabel(quote.min)} &middot; {quote.km.toFixed(1)} km
                </p>
              )}
            </div>

            {seatsTomorrow > 0 && (
              <p className="mt-4 flex items-center gap-2 text-[14px] text-white/60">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-50 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-base" />
                </span>
                {seatsTomorrow} seats open on tomorrow&rsquo;s runs
              </p>
            )}
          </div>

          <HeroVisual price={seatPrice} />
        </div>

        <div className="relative border-t border-white/10">
          <ul className="mx-auto grid max-w-6xl gap-x-8 gap-y-3 px-5 py-5 text-[13.5px] text-white/65 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <BadgeCheck size={15} />, label: 'Identity-verified drivers' },
              { icon: <Wallet size={15} />, label: 'Fare fixed before you travel' },
              { icon: <Clock3 size={15} />, label: 'Free cancellation up to 8 hours' },
              { icon: <ShieldCheck size={15} />, label: 'Lit, staffed pickup hubs' },
            ].map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <span className="text-accent-base" aria-hidden>
                  {f.icon}
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS                                                  */}
      {/* ============================================================ */}
      <Section>
        <motion.div {...fade}>
          <SectionHead
            title="A seat on a trip that was already happening"
            sub="COMUTA does not send a car to you. It finds people whose commute you share, and puts you in a seat on it."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                n: '01',
                icon: <MapPin size={20} />,
                title: 'Pick your corridor',
                body: 'Choose the hub you leave from and the hub you are heading to. Hubs are fixed, lit and staffed, never a roadside pickup.',
              },
              {
                n: '02',
                icon: <CalendarCheck size={20} />,
                title: 'Reserve your seat',
                body: 'Pay upfront at a fare that cannot move. Book a single morning, or set it to repeat every weekday and stop thinking about it.',
              },
              {
                n: '03',
                icon: <BadgeCheck size={20} />,
                title: 'Your driver confirms',
                body: 'Eight hours before departure your driver confirms the run, so you know the night before whether tomorrow is happening.',
              },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-nv-90 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-95 text-primary-30"
                    aria-hidden
                  >
                    {s.icon}
                  </span>
                  <span className="font-mono text-[13px] font-medium text-nv-40">{s.n}</span>
                </div>
                <h3 className="mt-5 text-[20px] font-bold text-primary-base">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-nv-40">{s.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* THE T-8 PROMISE - one feature, its own band                   */}
      {/* ============================================================ */}
      <section className="bg-primary-base py-16 text-white lg:py-24">
        <motion.div {...fade} className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-base px-3 py-1.5 text-[12.5px] font-bold uppercase tracking-wide text-primary-base">
                <Sparkles size={13} aria-hidden /> The T-8 promise
              </span>
              <h2 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-[-0.015em] sm:text-[44px]">
                You will know by tonight.
              </h2>
              <p className="mt-5 max-w-[46ch] text-[16.5px] leading-[1.6] text-white/70">
                Every COMUTA driver has to confirm their run eight hours before it departs. Miss the
                window and the trip is reassigned, not left to chance. It is the difference between a
                commute you can plan around and one you have to hope for.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="lime" size="lg" onClick={() => navigate('/how-it-works')}>
                  See how it works
                </Button>
                <Button
                  variant="tertiary"
                  size="lg"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/safety')}
                >
                  Safety standards <ArrowRight size={16} aria-hidden />
                </Button>
              </div>
            </div>

            <ol className="grid gap-3">
              {[
                { t: 'When you book', d: 'Seat reserved, fare locked, driver notified.', accent: false },
                { t: 'Up to 8 hours before', d: 'Change your mind and cancel for free.', accent: false },
                { t: 'T-8, the night before', d: 'Driver confirms. You get the go-ahead.', accent: true },
                { t: 'Departure', d: 'Meet at the hub. PIN verified. The seat is yours.', accent: false },
              ].map((row) => (
                <li
                  key={row.t}
                  className={
                    'flex items-start gap-4 rounded-2xl border p-5 ' +
                    (row.accent
                      ? 'border-accent-base bg-accent-base/10'
                      : 'border-white/10 bg-white/[0.04]')
                  }
                >
                  <span
                    className={
                      'mt-1 h-2.5 w-2.5 shrink-0 rounded-full ' +
                      (row.accent ? 'bg-accent-base' : 'bg-white/25')
                    }
                    aria-hidden
                  />
                  <div>
                    <p
                      className={
                        'text-[15px] font-bold ' + (row.accent ? 'text-accent-base' : 'text-white')
                      }
                    >
                      {row.t}
                    </p>
                    <p className="mt-0.5 text-[14px] leading-[1.55] text-white/60">{row.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* LIVE CORRIDORS - option carousel, on real seed trips          */}
      {/* ============================================================ */}
      <Section tinted>
        <motion.div {...fade}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead
              align="left"
              title="Corridors running this week"
              sub="Real departures on the routes COMUTA serves today."
            />
            <button
              type="button"
              onClick={() => navigate('/app/rider/plan')}
              className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-primary-30 hover:text-primary-20"
            >
              See every corridor <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3">
            {featured.map(({ trip, driverName, vehicleMake }) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => goCorridor(trip.fromId, trip.toId)}
                className="min-w-[280px] max-w-[300px] flex-1 snap-start rounded-2xl border border-nv-90 bg-white p-5 text-left transition-shadow hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-primary-95 px-2.5 py-1 font-mono text-[12.5px] font-medium text-primary-20">
                    {trip.departureTime}
                  </span>
                  {trip.driverConfirmed && (
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-primary-30">
                      <BadgeCheck size={14} aria-hidden /> Confirmed
                    </span>
                  )}
                </div>

                <p className="mt-4 text-[18px] font-bold leading-tight text-primary-base">
                  {hubArea(trip.fromId)} <span className="text-nv-50" aria-hidden>&rarr;</span> {hubArea(trip.toId)}
                </p>
                <p className="mt-1 text-[13.5px] text-nv-40">
                  Arrives {trip.arrivalTime} &middot; {durationLabel(trip.durationMin)}
                </p>

                <div className="mt-4 flex items-end justify-between border-t border-nv-95 pt-4">
                  <div>
                    <p className="text-[22px] font-bold text-primary-base">{naira(trip.pricePerSeat)}</p>
                    <p className="text-[12.5px] text-nv-40">per seat</p>
                  </div>
                  <div className="text-right">
                    <p className="inline-flex items-center gap-1 text-[13px] font-bold text-primary-30">
                      <Users size={14} aria-hidden /> {trip.seatsLeft} left
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-nv-40">
                      {driverName ?? 'Driver'}
                      {vehicleMake ? ' · ' + vehicleMake : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* WHAT IT REPLACES - the references do not need this. We do.    */}
      {/* ============================================================ */}
      {quote && (
        <Section>
          <motion.div {...fade}>
            <SectionHead
              title="What a month of commuting costs you"
              sub={
                'Based on the ' + from + ' to ' + to + ' corridor, ' + COMMUTE_DAYS_PER_MONTH +
                ' working days, one way each morning.'
              }
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <CostCard
                label="Ride-hailing"
                amount={quote.taxi * COMMUTE_DAYS_PER_MONTH}
                per={naira(quote.taxi) + ' a trip'}
                notes={['Surges when you need it most', 'A different stranger every day', 'No guarantee at 6 AM']}
              />
              <CostCard
                label="COMUTA"
                amount={quote.seat * COMMUTE_DAYS_PER_MONTH}
                per={naira(quote.seat) + ' a seat'}
                notes={['Fare fixed before you travel', 'The same verified driver', 'Confirmed 8 hours ahead']}
                highlight
                saving={(quote.taxi - quote.seat) * COMMUTE_DAYS_PER_MONTH}
              />
              <CostCard
                label="Driving yourself"
                per="Fuel, parking, hours"
                notes={['Two hours a day in traffic', 'Parking on the Island', 'Wear, fuel and your attention']}
              />
            </div>
            <p className="mt-5 text-[12.5px] text-nv-40">
              Estimates from COMUTA&rsquo;s own pricing model for this corridor. Your fare is always
              shown and locked before you pay.
            </p>
          </motion.div>
        </Section>
      )}

      {/* ============================================================ */}
      {/* DRIVE AND EARN - the second audience                          */}
      {/* ============================================================ */}
      <section className="bg-accent-base py-16 text-primary-base lg:py-24">
        <motion.div
          {...fade}
          className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2 lg:items-center lg:gap-14"
        >
          <Figure
            src="/images/driver-earning.jpg"
            alt="A driver in a white shirt at the wheel, on his way through the city."
          />

          <div>
            <span className="text-[12.5px] font-bold uppercase tracking-wide text-primary-20/70">
              Drive with COMUTA
            </span>
            <h2 className="mt-3 text-[34px] font-bold leading-[1.12] tracking-[-0.015em] sm:text-[44px]">
              You are already making this trip.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[16.5px] leading-[1.6] text-primary-20">
              You drive to the Island every morning with three empty seats. Publish them, choose who
              rides, and let the trip you were taking anyway pay for itself.
            </p>
            <ul className="mt-7 grid gap-3">
              {[
                'Keep ' + Math.round((1 - RECURRENCE.platformRate) * 100) + '% of every seat you sell',
                'You set the route, the time and the seat count',
                'Riders are identity-verified before they can book',
                'Paid out to your bank, not held back',
              ].map((l) => (
                <li key={l} className="flex items-start gap-2.5 text-[15px] font-medium">
                  <BadgeCheck size={18} className="mt-0.5 shrink-0 text-primary-30" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-primary-base p-6 text-white">
              <p className="font-mono text-[38px] font-medium leading-none text-accent-base">
                {naira(Math.round(seatPrice * 3 * COMMUTE_DAYS_PER_MONTH * (1 - RECURRENCE.platformRate)))}
              </p>
              <p className="mt-2 text-[13.5px] leading-[1.55] text-white/60">
                a month before fuel &mdash; three seats at {naira(seatPrice)},{' '}
                {COMMUTE_DAYS_PER_MONTH} working days, after COMUTA&rsquo;s{' '}
                {Math.round(RECURRENCE.platformRate * 100)}% share.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/signup?role=driver')}>
                Start earning
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/drivers')}>
                Driver requirements
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* SAFETY                                                        */}
      {/* ============================================================ */}
      <Section tinted>
        <motion.div {...fade} className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <SectionHead
              align="left"
              title="Everyone in the car has a name"
              sub="Sharing a commute only works if you know exactly who you are sharing it with. Verification is not a badge here, it is the entry requirement."
            />

            <ul className="mt-8 grid gap-5">
              {[
              {
                icon: <BadgeCheck size={19} />,
                t: 'Verified identity',
                d: 'NIN or licence, checked against a live selfie, for riders and drivers alike.',
              },
              {
                icon: <MapPin size={19} />,
                t: 'Hub pickups only',
                d: 'Fixed points with lighting, shelter and staff. No roadside flag-downs.',
              },
              {
                icon: <ShieldCheck size={19} />,
                t: 'Trusted contacts',
                d: 'Share a live trip with someone who is waiting for you to arrive.',
              },
              {
                icon: <Clock3 size={19} />,
                t: 'PIN at pickup',
                d: 'A code only you and your driver hold confirms you are in the right car.',
              },
              ].map((c) => (
                <li key={c.t} className="flex items-start gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-95 text-primary-30"
                    aria-hidden
                  >
                    {c.icon}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-primary-base">{c.t}</h3>
                    <p className="mt-1 text-[14px] leading-[1.55] text-nv-40">{c.d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Button size="lg" onClick={() => navigate('/safety')}>
                Our safety standards
              </Button>
            </div>
          </div>

          <Figure
            src="/images/rider-smiling.jpg"
            alt="A rider relaxed in the passenger seat on the way in to work."
          />
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* BUSINESS                                                      */}
      {/* ============================================================ */}
      <Section>
        <motion.div {...fade} className="overflow-hidden rounded-3xl border border-nv-90 bg-primary-99">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wide text-primary-30">
                <Building2 size={14} aria-hidden /> COMUTA for business
              </span>
              <h2 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-primary-base sm:text-[34px]">
                Get your team to work, without the allowance argument
              </h2>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-nv-40">
                Sponsor seats on the corridors your staff already commute. One invoice, real
                attendance data, and people who arrive able to work.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate('/about')}>
                  Talk to us
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/how-it-works')}>
                  How it works
                </Button>
              </div>
            </div>
            <Figure
              src="/images/lagos-street.jpg"
              alt="Morning traffic on a main road into Lagos, seen from above."
            />
          </div>
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* GET THE APP                                                   */}
      {/* ============================================================ */}
      <Section tinted>
        <motion.div {...fade}>
          <SectionHead
            title="Get the app"
            sub="Your commute, your driver and your seat, in your pocket."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <AppCard
              kind="Rider app"
              title="Book, track and repeat your commute"
              bullets={[
                'Reserve a seat in under a minute',
                'Live trip sharing with someone you trust',
                'Recurring weekday routes',
              ]}
              cta="Sign up to ride"
              onCta={() => navigate('/signup')}
            />
            <AppCard
              kind="Driver app"
              title="Publish seats and get paid"
              bullets={[
                'Publish the run you already make',
                'Confirm at T-8 in one tap',
                'Earnings and payouts in one place',
              ]}
              cta="Start earning"
              onCta={() => navigate('/signup?role=driver')}
              accent
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <StoreLink href={APP_STORE_LINK} label="Download on the App Store" />
            <StoreLink href={GOOGLE_PLAY_LINK} label="Get it on Google Play" />
          </div>
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* SIGN UP - the page's closing argument                         */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden bg-primary-base text-white">
        <img
          src="/images/lagos-commuters.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.18]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-base via-primary-base/85 to-primary-base/40"
        />
        <motion.div {...fade} className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="max-w-[42ch]">
            <h2 className="text-[34px] font-bold leading-[1.12] tracking-[-0.015em] sm:text-[44px]">
              Tomorrow morning is already being planned.
            </h2>
            <p className="mt-5 text-[16.5px] leading-[1.6] text-white/70">
              Creating an account is free and takes a minute. Verify once, then book the seat you
              need the night before you need it &mdash; or publish the seats you are already driving.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="lime" size="lg" onClick={() => navigate('/signup')}>
                Create your free account <ArrowRight size={17} aria-hidden />
              </Button>
              <Button
                variant="tertiary"
                size="lg"
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/signup?role=driver')}
              >
                Sign up to drive
              </Button>
            </div>
            <p className="mt-5 text-[13.5px] text-white/50">
              Already with us?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-bold text-accent-base underline underline-offset-4"
              >
                Log in
              </button>
            </p>
          </div>
        </motion.div>
      </section>

      {/* sticky mobile CTA, Uber's persistent bar - only once the hero
          planner is out of view, so the two never stack */}
      <div
        className={
          'sticky bottom-0 z-20 border-t border-nv-90 bg-white/95 p-3 backdrop-blur transition-opacity duration-200 lg:hidden ' +
          (showStickyCta ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
        aria-hidden={!showStickyCta}
      >
        <Button block size="lg" onClick={search}>
          Find seats <ArrowRight size={17} aria-hidden />
        </Button>
      </div>

      <InstallPrompt />
      <SiteFooter />
    </div>
  );
}

/* ================================================================== */
/* Pieces                                                             */
/* ================================================================== */

function Section({ children, tinted = false }: { children: React.ReactNode; tinted?: boolean }) {
  return (
    <section className={'py-16 lg:py-24 ' + (tinted ? 'bg-ntl-99' : 'bg-white')}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

function SectionHead({
  title,
  sub,
  align = 'center',
}: {
  title: string;
  sub?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-[34ch] text-center' : 'max-w-[46ch]'}>
      <h2 className="text-balance text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-primary-base sm:text-[36px]">
        {title}
      </h2>
      {sub && (
        <p className={
          'mt-4 text-[16px] leading-[1.6] text-nv-40 ' + (align === 'center' ? 'mx-auto max-w-[52ch]' : '')
        }>
          {sub}
        </p>
      )}
    </div>
  );
}

/** Hub input backed by a datalist of the real hubs in the store. */
function HeroField({
  label,
  value,
  onChange,
  hubs,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hubs: Hub[];
}) {
  const listId = 'hubs-' + label.toLowerCase();
  return (
    <label className="flex items-center gap-2.5 rounded-xl bg-ntl-95 px-3.5 py-3">
      <MapPin size={15} className="shrink-0 text-nv-40" aria-hidden />
      <span className="sr-only">{label}</span>
      <input
        value={value}
        list={listId}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full bg-transparent text-[15px] font-semibold text-primary-base outline-none placeholder:font-normal placeholder:text-nv-50"
      />
      <datalist id={listId}>
        {hubs.map((h) => (
          <option key={h.id} value={h.area}>
            {h.name}
          </option>
        ))}
      </datalist>
    </label>
  );
}

/**
 * One photograph, treated the same way everywhere: fixed ratio so the grid
 * never shifts as images arrive, cover-cropped, and lazy below the fold.
 * Every call passes a real alt - these carry meaning, they are not decoration.
 */
const PHOTO: Record<string, { w: number; h: number }> = {
  '/images/hero-rideshare.jpg': { w: 1400, h: 933 },
  '/images/driver-earning.jpg': { w: 1400, h: 2100 },
  '/images/rider-smiling.jpg': { w: 1400, h: 933 },
  '/images/lagos-street.jpg': { w: 1200, h: 1800 },
  '/images/lagos-commuters.jpg': { w: 1400, h: 1120 },
  '/images/padigo-commuters.jpg': { w: 1312, h: 816 },
};

export function Figure({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const dim = PHOTO[src];
  const portrait = dim ? dim.h > dim.w : false;
  return (
    <img
      src={src}
      alt={alt}
      width={dim?.w}
      height={dim?.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={
        'h-auto w-full rounded-3xl ' +
        (portrait ? 'mx-auto max-w-[420px] ' : '') +
        className
      }
    />
  );
}

/**
 * Hero visual. Uber puts an illustration beside its planner and Lyft leads
 * with photography; photography is the right call here, because the thing
 * being sold is who is in the car. The confirmed-seat card overlaps the
 * photograph so the proof sits on top of the promise.
 */
function HeroVisual({ price }: { price: number }) {
  return (
    <div className="mx-auto w-full max-w-[430px] lg:max-w-[470px]">
      <Figure
        src="/images/hero-rideshare.jpg"
        alt="A driver at the wheel while a rider settles into the back seat of a car."
        eager
      />
      <div className="-mt-10 px-3">
        <HeroPreview price={price} />
      </div>
    </div>
  );
}

/** Static product preview: a confirmed seat, the way the app shows it. */
function HeroPreview({ price }: { price: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.story, ease: EASE, delay: 0.1 }}
      className="mx-auto w-full max-w-[340px] rounded-3xl bg-white p-5 text-ntl-10 shadow-lift"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-95 px-2.5 py-1 text-[12px] font-bold text-primary-20">
          <BadgeCheck size={13} /> Driver confirmed
        </span>
        <span className="font-mono text-[12px] text-nv-40">T-8 &middot; 10:41 PM</span>
      </div>

      <p className="mt-5 text-[22px] font-bold leading-tight text-primary-base">
        Ikorodu <span className="text-nv-50" aria-hidden>&rarr;</span> Victoria Island
      </p>
      <p className="mt-1 text-[13.5px] text-nv-40">
        Tomorrow &middot; departs 7:00 AM &middot; arrives 8:20 AM
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-ntl-99 p-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-30 text-[14px] font-bold text-white">
          AO
        </span>
        <div className="min-w-0">
          <p className="text-[14.5px] font-bold text-primary-base">Adebayo O.</p>
          <p className="truncate text-[12.5px] text-nv-40">Toyota Corolla</p>
        </div>
        <span className="ml-auto rounded-lg bg-white px-2.5 py-1.5 font-mono text-[13px] font-medium text-primary-20">
          4827
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-nv-95 pt-4">
        <div>
          <p className="text-[20px] font-bold text-primary-base">{naira(price)}</p>
          <p className="text-[12px] text-nv-40">seat 3 of 4 &middot; paid</p>
        </div>
        <span className="rounded-xl bg-accent-base px-3 py-2 text-[13px] font-bold text-primary-base">
          Seat confirmed
        </span>
      </div>
    </motion.div>
  );
}

function CostCard({
  label,
  amount,
  per,
  notes,
  highlight = false,
  saving,
}: {
  label: string;
  amount?: number;
  per: string;
  notes: string[];
  highlight?: boolean;
  saving?: number;
}) {
  return (
    <div
      className={
        'rounded-2xl border p-6 ' +
        (highlight ? 'border-primary-30 bg-primary-95' : 'border-nv-90 bg-white')
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className={'text-[14px] font-bold ' + (highlight ? 'text-primary-20' : 'text-nv-40')}>
          {label}
        </p>
        {highlight && saving !== undefined && saving > 0 && (
          <span className="rounded-lg bg-primary-base px-2 py-1 text-[11.5px] font-bold text-accent-base">
            Save {naira(saving)}
          </span>
        )}
      </div>
      <p className="mt-3 text-[30px] font-bold leading-none text-primary-base">
        {amount === undefined ? '—' : naira(amount)}
      </p>
      <p className="mt-1.5 text-[13px] text-nv-40">{per}</p>
      <ul className="mt-5 grid gap-2 border-t border-nv-95 pt-5">
        {notes.map((n) => (
          <li key={n} className="text-[13.5px] leading-[1.5] text-nv-40">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppCard({
  kind,
  title,
  bullets,
  cta,
  onCta,
  accent = false,
}: {
  kind: string;
  title: string;
  bullets: string[];
  cta: string;
  onCta: () => void;
  accent?: boolean;
}) {
  return (
    <div
      className={
        'rounded-3xl p-7 ' + (accent ? 'bg-accent-base text-primary-base' : 'bg-primary-base text-white')
      }
    >
      <p
        className={
          'text-[12.5px] font-bold uppercase tracking-wide ' +
          (accent ? 'text-primary-20/70' : 'text-primary-70')
        }
      >
        {kind}
      </p>
      <h3 className="mt-3 text-[23px] font-bold leading-[1.2]">{title}</h3>
      <ul className="mt-5 grid gap-2.5">
        {bullets.map((b) => (
          <li
            key={b}
            className={'flex items-start gap-2.5 text-[14.5px] ' + (accent ? 'text-primary-20' : 'text-white/70')}
          >
            <ChevronRight size={16} className="mt-0.5 shrink-0" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <Button variant={accent ? 'primary' : 'lime'} size="lg" onClick={onCta}>
          {cta}
        </Button>
      </div>
    </div>
  );
}

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-xl border border-nv-90 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary-base hover:border-nv-70"
    >
      {label}
    </a>
  );
}
