import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, CalendarCheck, Download, MapPin, Repeat, ShieldCheck, Star, Users } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Avatar } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { InstallPrompt } from '../../components/ui/InstallPrompt';
import { ComutaMap } from '../../components/map/ComutaMap';
import { useComuta } from '../../store';
import { DURATION, EASE } from '../../constants';

/** Real voices from the corridors COMUTA serves. */
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

const DRIVER_STORIES = [
  {
    quote: 'I drive to the Island every morning anyway. Now three people cover my fuel and the bridge toll. My commute basically pays for itself.',
    name: 'Adebayo K.',
    detail: 'Driver, Ikorodu → Victoria Island · 4 seats',
    color: '#7a5c1f',
  },
  {
    quote: 'At first I was worried about strangers in my car. But everyone is verified, and the trip PIN thing made my wife comfortable.',
    name: 'Ifeoma N.',
    detail: 'Driver, Ikeja → Victoria Island',
    color: '#3d5f8a',
  },
];

export function Landing() {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const from = hubs.find((h) => h.id === 'hub_ikorodu');
  const to = hubs.find((h) => h.id === 'hub_vi');
  const [progress, setProgress] = useState(0);
  const [showPill, setShowPill] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setProgress(0.05);
      const iv = setInterval(() => {
        setProgress((p) => {
          if (p >= 0.55) {
            clearInterval(iv);
            return 0.55;
          }
          return p + 0.012;
        });
      }, 90);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (progress >= 0.3 && !showPill) setShowPill(true);
  }, [progress, showPill]);

  return (
    <div className="min-h-dvh bg-surface text-onsurface">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line-soft bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Logo size={28} />
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="tap rounded-xl px-4 py-2 text-[13.5px] font-bold text-forest-900 hover:bg-surface-2">
              Log in
            </button>
            <Button size="md" onClick={() => navigate('/signup')}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 78% 8%, rgba(189,242,63,0.12), transparent 36%), radial-gradient(circle at 12% 80%, rgba(30,115,134,0.10), transparent 40%)' }} />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-2 lg:pt-20">
          <div>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.standard, ease: EASE }} className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-[12.5px] font-extrabold text-lime-700">
              Planned shared commuting in Lagos
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: DURATION.standard, ease: EASE }} className="mt-5 text-[42px] font-extrabold leading-[1.02] tracking-tight text-forest-900 sm:text-[56px]">
              Your commute.
              <br />
              Shared. <span className="text-lime-600">Simpler.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: DURATION.standard, ease: EASE }} className="mt-5 max-w-md text-[16px] leading-relaxed text-variant">
              Ride with people already making your journey. Book ahead, know your seat, and travel with verified drivers, at a fraction of the cost.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: DURATION.standard, ease: EASE }} className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/app/rider/plan')}>
                Find your route <ArrowRight size={17} />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/app/driver/routes/new')}>
                Share your commute
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: DURATION.standard }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <div className="flex -space-x-2.5">
                {RIDER_STORIES.map((s) => (
                  <Avatar key={s.name} initials={s.name.split(' ').map((p) => p[0]).join('')} color={s.color} size={34} />
                ))}
              </div>
              <div>
                <p className="flex items-center gap-1 text-[13px] font-extrabold text-onsurface">
                  4.8 <Star size={13} className="fill-lime-600 text-lime-600" /> rider rating
                </p>
                <p className="text-[12px] font-semibold text-variant">Ikorodu, Lekki, Ajah, Ikeja and VI commuters ride daily</p>
              </div>
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: DURATION.expressive, ease: EASE }} className="relative">
            <div className="rounded-3xl border border-line bg-white p-4 shadow-lift">
              <ComutaMap from={from} to={to} vehicleProgress={progress} height={280} routeAnimate />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-extrabold text-onsurface">Ikorodu → Victoria Island</p>
                  <p className="text-[12px] font-semibold text-variant">Tomorrow · 7:00 AM · ₦1,500 / seat</p>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1.5 text-[11.5px] font-extrabold text-forest-800">
                  Adebayo K. · Toyota Corolla
                </span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={showPill ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="absolute -right-2 -top-3 rounded-2xl bg-forest-900 px-4 py-3 text-white shadow-lift"
            >
              <p className="flex items-center gap-1.5 text-[12px] font-extrabold text-lime-500"><Users size={13} /> 3 seats shared</p>
              <p className="mt-0.5 text-[13.5px] font-extrabold">₦1,500 / seat</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Commuter voices */}
      <section className="border-y border-line-soft bg-white py-12 lg:py-16">
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

      {/* How it works */}
      <Section title="How COMUTA works" kicker="Plan → Book → Ride">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard n="01" icon={<CalendarCheck size={20} />} title="Plan your commute" body="Choose your corridor, day and time. See every verified driver making that exact journey." />
          <StepCard n="02" icon={<BadgeCheck size={20} />} title="Know your ride" body="Compare drivers by reliability, on-time record, vehicle and price. Reserve your seat in seconds." />
          <StepCard n="03" icon={<ShieldCheck size={20} />} title="Travel protected" body="Meet at a safe hub, confirm your trip PIN, and share your live trip with people you trust." />
        </div>
      </Section>

      {/* Shared-seat model */}
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

      {/* Reliability */}
      <Section title="Reliability you can plan around" kicker="Trust, built in">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard icon={<BadgeCheck size={20} />} title="Verified people & vehicles" body="Drivers, IDs and vehicles are checked before the first trip. Ratings and completion rates are public." />
          <StepCard icon={<MapPin size={20} />} title="Safe hubs only" body="Every pickup happens at an approved, monitored hub. Never a random street corner." />
          <StepCard icon={<ShieldCheck size={20} />} title="Bookings are protected" body="If your driver can't make the trip, we find another option or refund you. No dead ends." />
        </div>
      </Section>

      {/* Recurring routes */}
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

      {/* Who COMUTA is for */}
      <Section title="Who COMUTA is for" kicker="Everyday people, everyday routes">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard icon={<Users size={20} />} title="Office commuters" body="Ikorodu, Lekki, Ajah or Ikeja to the Island every weekday. Same route, same time, same people." />
          <StepCard icon={<CalendarCheck size={20} />} title="Parents & families" body="Know your pickup hub, share your live trip with family, and never wait at a random corner." />
          <StepCard icon={<Repeat size={20} />} title="Drivers going anyway" body="You're already making the trip. Fill empty seats and recover fuel, tolls and wear." />
        </div>
      </Section>

      {/* Safety */}
      <Section title="Safety that's calm, not scary" kicker="Safety">
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard icon={<ShieldCheck size={20} />} title="Trip PIN" body="A private code confirms the vehicle before you enter. Only your driver sees it." />
          <StepCard icon={<Users size={20} />} title="Live trip sharing" body="Share your route with trusted contacts for the whole journey. You can stop sharing any time." />
          <StepCard icon={<BadgeCheck size={20} />} title="SOS, when you need it" body="One clear emergency action with your location, trip and vehicle details ready for support." />
        </div>
      </Section>

      {/* Driver cost recovery */}
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

      {/* Install / use */}
      <Section dark>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-extrabold tracking-tight text-white">Keep your commute one tap away</h2>
          <p className="mt-3 text-[15px] text-white/70">
            COMUTA installs like an app on your phone. Fast, offline-friendly, and built around your daily journey.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/signup')}>
              <Download size={17} /> Install COMUTA
            </Button>
            <Button size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/15" onClick={() => navigate('/login')}>
              Log in
            </Button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-line-soft bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 md:flex-row">
          <Logo size={26} />
          <p className="text-[12.5px] font-semibold text-faint">Planned shared commuting for Lagos. © {new Date().getFullYear()} COMUTA</p>
          <div className="flex gap-5 text-[13px] font-bold text-variant">
            <button className="tap hover:text-forest-900">Safety</button>
            <button className="tap hover:text-forest-900">Drivers</button>
            <button className="tap hover:text-forest-900">Help</button>
          </div>
        </div>
      </footer>
      <InstallPrompt />
    </div>
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
