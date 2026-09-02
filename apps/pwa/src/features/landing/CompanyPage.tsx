/**
 * Public company and product pages: How it works, Safety, Drivers, About,
 * Help centre, Privacy and Terms. One template with per-page content (the
 * same approach the previously live marketing site used) so every footer
 * link and sitemap entry resolves to a real, readable page.
 * Tailwind-only, no legacy CSS ported.
 */
import { useEffect, useState, type ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  Headphones,
  HeartHandshake,
  LocateFixed,
  MapPin,
  Repeat,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { PublicNav } from './PublicNav';
import { SiteFooter } from '../../components/brand/SiteFooter';
import { LottieAnimation, LOTTIE } from '../../components/brand/LottieArt';
import { Button } from '../../components/ui/Button';

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>;
type ProofItem = { value: string; label: string };
type PageCard = { icon: Icon; title: string; text: string; points: string[] };
type FaqItem = { q: string; a: string };

type PageData = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  proof: ProofItem[];
  sectionKicker: string;
  sectionTitle: string;
  sectionIntro: string;
  cards: PageCard[];
  calloutTitle: string;
  calloutText: string;
  action: string;
  actionTo: string;
  faq?: FaqItem[];
  requirements?: { title: string; intro: string; items: string[] };
};

const PAGES: Record<string, PageData> = {
  '/how-it-works': {
    eyebrow: 'THE COMUTA METHOD',
    title: 'A dependable commute starts with',
    accent: 'a route you already travel.',
    intro:
      'COMUTA compares complete routes, timing, recurrence and trust so riders and drivers can form carpools that work beyond a single journey.',
    proof: [
      { value: '35%', label: 'route compatibility' },
      { value: '20%', label: 'pickup proximity' },
      { value: '10%', label: 'recurring fit' },
      { value: '8%', label: 'trust, rating and price' },
    ],
    sectionKicker: 'BUILT FOR RECURRING TRAVEL',
    sectionTitle: 'From route to regular carpool',
    sectionIntro: 'The product is built around scheduled travel and repeatable routines, not instant ride requests.',
    cards: [
      {
        icon: MapPin,
        title: 'Set your complete route',
        text: 'Add where you start, where you are going, your preferred time and the seats you need.',
        points: ['Flexible pickup radius', 'Arrival time preference', 'Weekday recurrence'],
      },
      {
        icon: Route,
        title: 'Compare ranked matches',
        text: 'See route overlap, walking distance, verification and contribution together.',
        points: ['Clear match score', 'Verified profiles', 'Transparent seat price'],
      },
      {
        icon: Repeat,
        title: 'Build a regular group',
        text: 'Confirm once, repeat when it works and keep control of each scheduled booking.',
        points: ['Recurring schedule', 'Familiar commuters', 'Trip by trip control'],
      },
    ],
    calloutTitle: 'See the whole rider journey',
    calloutText: 'Search a Lagos corridor, inspect a verified match and complete the representative booking flow.',
    action: 'Find a route match',
    actionTo: '/app/rider/plan',
  },
  '/safety': {
    eyebrow: 'SAFETY AT EVERY STAGE',
    title: 'Trust is built before',
    accent: 'anyone enters the car.',
    intro:
      'COMUTA combines identity checks, vehicle review, trip controls and a responsive safety team so every safety signal has context and a clear owner.',
    proof: [
      { value: '6', label: 'verification signals' },
      { value: '24/7', label: 'trip safety access' },
      { value: '1 tap', label: 'trip sharing' },
      { value: 'Live', label: 'route monitoring' },
    ],
    sectionKicker: 'PROTECTION AT EVERY STAGE',
    sectionTitle: 'Layered protection for shared journeys',
    sectionIntro: 'Verification, live tracking and human response work together across the whole journey.',
    cards: [
      {
        icon: BadgeCheck,
        title: 'Know who is travelling',
        text: 'Profiles show phone, identity, selfie, licence, vehicle and safety checks clearly.',
        points: ['Identity and liveness', 'Driver licence review', 'Vehicle document checks'],
      },
      {
        icon: LocateFixed,
        title: 'Stay connected in transit',
        text: 'Live location, trip sharing, masked contact and route monitoring remain available during the journey.',
        points: ['Live trip tracking', 'Route deviation review', 'Emergency contacts'],
      },
      {
        icon: ShieldCheck,
        title: 'Reach a human response team',
        text: 'SOS and incident reports send trip context to the safety team for structured follow through.',
        points: ['Safety case timeline', 'Blocking and reports', 'Team escalation'],
      },
    ],
    calloutTitle: 'Safety tools are inside every active trip',
    calloutText: 'Open the rider experience to view live tracking, sharing, communication and the safety centre.',
    action: 'Open safety tools',
    actionTo: '/app/rider/safety',
  },
  '/drivers': {
    eyebrow: 'DRIVE WITH COMUTA',
    title: 'Share the journey you are',
    accent: 'already making.',
    intro:
      'COMUTA helps verified drivers fill empty seats on scheduled routes, manage trusted passenger requests and receive transparent cost contributions.',
    proof: [
      { value: '3', label: 'sample seats per trip' },
      { value: '₦24.6k', label: 'sample weekly contribution' },
      { value: '4.9', label: 'sample driver rating' },
      { value: 'Weekly', label: 'payout schedule' },
    ],
    sectionKicker: 'BUILT FOR RECURRING TRAVEL',
    sectionTitle: 'Driver control from setup to payout',
    sectionIntro: 'Drivers choose the route, schedule, seat count and fair contribution before reviewing every passenger request.',
    cards: [
      {
        icon: FileCheck2,
        title: 'Complete driver verification',
        text: 'Submit identity, liveness, licence, vehicle documents and payout details for review.',
        points: ['Document status', 'Vehicle approval', 'Bank account validation'],
      },
      {
        icon: CalendarDays,
        title: 'Publish a recurring route',
        text: 'Choose travel days, departure time, available seats and a reasonable route contribution.',
        points: ['Flexible time window', 'Passenger preferences', 'Reusable schedules'],
      },
      {
        icon: Banknote,
        title: 'Manage trips and earnings',
        text: 'Review requests, control each trip and follow settlement through to driver payout.',
        points: ['Passenger approval', 'Earnings statement', 'Payout exceptions'],
      },
    ],
    requirements: {
      title: 'Driver requirements',
      intro: 'Before your first route goes live, every driver completes the same checklist. It keeps the network predictable and safe for everyone.',
      items: [
        'Valid Nigerian driver\u2019s licence and a government-issued ID',
        'Private vehicle with roadworthiness certificate and valid insurance',
        'Vehicle documents reviewed and approved before publishing',
        'Identity and liveness verification completed',
        'A smartphone with the COMUTA app and a stable data connection',
        'Commitment to the schedules you publish and a fair cost contribution',
      ],
    },
    calloutTitle: 'Try the complete driver workspace',
    calloutText: 'Switch to driver mode to publish a ride, review requests and inspect earnings.',
    action: 'Start as a driver',
    actionTo: '/signup',
  },
  '/about': {
    eyebrow: 'WHY COMUTA',
    title: 'Building better commutes',
    accent: 'one corridor at a time.',
    intro:
      'COMUTA is a Nigerian recurring carpool marketplace designed around verified people, constrained launch corridors and the journeys commuters make every week.',
    proof: [
      { value: '1', label: 'city at launch' },
      { value: 'Selected', label: 'initial corridors' },
      { value: 'Scheduled', label: 'core journey type' },
      { value: 'Shared', label: 'cost model' },
    ],
    sectionKicker: 'A FOCUSED MARKETPLACE',
    sectionTitle: 'A focused marketplace approach',
    sectionIntro: 'Reliable supply and demand matter more than launching everywhere at once.',
    cards: [
      {
        icon: Route,
        title: 'Corridor focus',
        text: 'Launch where recurring demand, time windows and destination clusters can create useful density.',
        points: ['Lagos first', 'Measured expansion', 'Route health monitoring'],
      },
      {
        icon: HeartHandshake,
        title: 'Trust before scale',
        text: 'Verification, ratings and safety operations are part of the product foundation.',
        points: ['Visible trust signals', 'Structured incidents', 'Human review'],
      },
      {
        icon: CarFront,
        title: 'Shared journeys',
        text: 'The marketplace supports planned cost sharing rather than positioning every driver as a taxi.',
        points: ['Fair contributions', 'Existing journeys', 'Recurring groups'],
      },
    ],
    calloutTitle: 'Experience the marketplace',
    calloutText: 'Move between rider and driver views to see how the system connects.',
    action: 'Open COMUTA',
    actionTo: '/signup',
  },
  '/help': {
    eyebrow: 'COMUTA SUPPORT',
    title: 'Get help with your',
    accent: 'account, ride or safety.',
    intro: 'Find the right support path for bookings, payments, verification, driver documents and active trip concerns.',
    proof: [
      { value: '24/7', label: 'safety access' },
      { value: '1', label: 'case timeline' },
      { value: 'Live', label: 'trip context' },
      { value: 'Secure', label: 'account support' },
    ],
    sectionKicker: 'CHOOSE THE HELP YOU NEED',
    sectionTitle: 'Support paths that match the problem',
    sectionIntro: 'Urgent trip concerns use safety tools. Account and payment questions use standard support.',
    cards: [
      {
        icon: Headphones,
        title: 'Ride and booking support',
        text: 'Get help with a request, cancellation, receipt, refund status or completed trip.',
        points: ['Booking status', 'Cancellation review', 'Receipt access'],
      },
      {
        icon: FileCheck2,
        title: 'Verification support',
        text: 'Understand pending checks and update identity, licence or vehicle documents.',
        points: ['Document guidance', 'Review status', 'Profile corrections'],
      },
      {
        icon: ShieldCheck,
        title: 'Safety support',
        text: 'Use the safety centre during a trip or report an incident with the relevant journey context.',
        points: ['SOS access', 'Incident reports', 'Block a member'],
      },
    ],
    faq: [
      {
        q: 'How do I book a seat?',
        a: 'Search your corridor and date, compare verified drivers, pick a seat and pay the fare contribution. Your booking is confirmed once the driver accepts and you receive your trip PIN.',
      },
      {
        q: 'What happens if my driver does not confirm?',
        a: 'Trips must be confirmed by the night before departure. If a driver cannot confirm, COMUTA looks for another option on your route and you can rebook or get a full refund.',
      },
      {
        q: 'How does verification work?',
        a: 'Identity, liveness, licence and vehicle documents are checked before anyone can drive. Riders verify identity and payment details before booking.',
      },
      {
        q: 'Can I cancel a booking?',
        a: 'Yes, from the trip screen. Cancellations before the driver confirms are refunded in full; later cancellations follow the refund policy shown in your booking summary.',
      },
      {
        q: 'What is cost recovery for drivers?',
        a: 'Drivers share the cost of a journey they already make. Each passenger contribution is set by the driver, and the earnings statement shows what is owed and when payouts are due.',
      },
      {
        q: 'Is my trip tracked?',
        a: 'Live trips are trackable and shareable with trusted contacts, and monitored for route deviations. SOS connects you to the safety team with your trip context attached.',
      },
    ],
    calloutTitle: 'Open your account support area',
    calloutText: 'The app includes profile, verification and active trip safety controls.',
    action: 'Go to my account',
    actionTo: '/app/rider/support',
  },
  '/privacy': {
    eyebrow: 'PRIVACY',
    title: 'Your information should',
    accent: 'serve your journey.',
    intro:
      'COMUTA is designed to collect the information needed for matching, verification, payments and safety while keeping access controlled and accountable.',
    proof: [
      { value: 'NDPR', label: 'privacy principles' },
      { value: 'Scoped', label: 'staff access' },
      { value: 'Logged', label: 'admin actions' },
      { value: 'Encrypted', label: 'sensitive data' },
    ],
    sectionKicker: 'PRIVACY BY DESIGN',
    sectionTitle: 'Privacy by design',
    sectionIntro: 'This prototype demonstrates the controls the production platform should enforce.',
    cards: [
      {
        icon: CheckCircle2,
        title: 'Purpose limited collection',
        text: 'Route, identity and payment information should only be used for clear marketplace functions.',
        points: ['Consent records', 'Retention schedules', 'Data minimisation'],
      },
      {
        icon: ShieldCheck,
        title: 'Controlled access',
        text: 'Role permissions, audit logs and encryption protect sensitive identity and trip information.',
        points: ['Least privilege', 'Security logging', 'Encrypted storage'],
      },
      {
        icon: Users,
        title: 'Member controls',
        text: 'People should be able to review settings, block members and request account support.',
        points: ['Privacy settings', 'Blocked users', 'Data requests'],
      },
    ],
    calloutTitle: 'Review privacy controls in profile',
    calloutText: 'Open the profile subpage to see the representative privacy and data settings.',
    action: 'Open profile',
    actionTo: '/app/rider/account',
  },
  '/terms': {
    eyebrow: 'TERMS OF USE',
    title: 'Clear expectations for',
    accent: 'every shared journey.',
    intro:
      'COMUTA members agree to provide accurate information, follow approved trip rules and use the marketplace for legitimate shared journeys.',
    proof: [
      { value: 'Clear', label: 'booking states' },
      { value: 'Visible', label: 'trip rules' },
      { value: 'Fair', label: 'cancellation process' },
      { value: 'Reviewed', label: 'disputes' },
    ],
    sectionKicker: 'MARKETPLACE RESPONSIBILITIES',
    sectionTitle: 'Core marketplace responsibilities',
    sectionIntro: 'Final legal terms require review by Nigerian counsel before public launch.',
    cards: [
      {
        icon: Users,
        title: 'Member conduct',
        text: 'Riders and drivers must communicate respectfully, follow safety requirements and maintain accurate profiles.',
        points: ['Accurate identity', 'Respectful conduct', 'No account sharing'],
      },
      {
        icon: Clock3,
        title: 'Booking and cancellation',
        text: 'Each request follows explicit acceptance, payment, cancellation and refund states.',
        points: ['Seat confirmation', 'Cancellation window', 'Refund status'],
      },
      {
        icon: ShieldCheck,
        title: 'Safety and disputes',
        text: 'Members can report incidents and provide evidence for structured safety team review.',
        points: ['Incident records', 'Fair investigation', 'Account action'],
      },
    ],
    calloutTitle: 'See the booking lifecycle',
    calloutText: 'Use the rider flow to compare a ride, request a seat and review the payment summary.',
    action: 'View a sample booking',
    actionTo: '/app/rider/plan',
  },
};

const ICON_TILES = ['bg-forest-100 text-forest-700', 'bg-lime-100 text-lime-700', 'bg-[#dcf0f4] text-[#155e6e]'];

function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="border-t border-line-soft bg-surface py-14 lg:py-20" id="faq">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-forest-700">COMMON QUESTIONS</p>
          <h2 className="mt-3 text-[30px] font-extrabold tracking-tight text-forest-900 lg:text-[38px]">Frequently asked questions</h2>
        </div>
        <div className="mx-auto mt-8 max-w-[760px] divide-y divide-line-soft rounded-3xl border border-line bg-white">
          {items.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="text-[15px] font-extrabold text-onsurface">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-variant transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && <p className="px-6 pb-5 text-[14px] leading-relaxed text-variant">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBlock() {
  return (
    <section className="border-t border-line-soft bg-white py-14 lg:py-16" id="contact">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-forest-700">CONTACT</p>
          <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-forest-900">Talk to a person</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-variant">
            Account and booking questions get a reply within one business day. Safety issues are treated immediately.
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-surface p-6">
          <p className="text-[13px] font-extrabold text-onsurface">Support email</p>
          <p className="mt-1 text-[15px] font-bold text-forest-700">support@comuta.app</p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-variant">Include your trip or booking reference when you write in.</p>
        </div>
        <div className="rounded-3xl border border-line bg-surface p-6">
          <p className="text-[13px] font-extrabold text-onsurface">During an active trip</p>
          <p className="mt-1 text-[14px] leading-relaxed text-variant">
            Use the in-app safety centre. It attaches your trip context, location and trusted contacts to every report.
          </p>
        </div>
      </div>
    </section>
  );
}

function Requirements({ title, intro, items }: { title: string; intro: string; items: string[] }) {
  return (
    <section className="border-t border-line-soft bg-white py-14 lg:py-16" id="requirements">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-forest-700">BEFORE YOU PUBLISH</p>
          <h2 className="mt-3 text-[30px] font-extrabold tracking-tight text-forest-900 lg:text-[36px]">{title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-variant">{intro}</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-[820px] gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-forest-700" />
              <p className="text-[13.5px] font-bold leading-relaxed text-onsurface">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyPage() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const page = PAGES[pathname] ?? PAGES['/about'];

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = `https://comuta.app${pathname}`;
  }, [pathname, hash]);

  return (
    <div className="min-h-dvh bg-surface text-onsurface">
      <PublicNav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-forest-950 text-white">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 82% 48%, rgba(189,242,63,.13), transparent 31%)' }}
          />
          <div className="pointer-events-none absolute -right-[120px] -top-[150px] h-[570px] w-[570px] rounded-full border border-lime-500/15" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-[30px] -top-[60px] h-[390px] w-[390px] rounded-full border border-lime-500/20" aria-hidden="true" />
          <div className="relative z-[2] mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.7fr] lg:gap-24 lg:py-24">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-lime-500">
                <Sparkles size={14} /> {page.eyebrow}
              </p>
              <h1 className="mt-5 max-w-[780px] text-[40px] font-extrabold leading-[1.06] tracking-tight sm:text-[52px] lg:text-[58px]">
                {page.title} <br /> <span className="text-lime-500">{page.accent}</span>
              </h1>
              <p className="mt-6 max-w-[680px] text-[16px] leading-[1.7] text-white/70">{page.intro}</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button variant="lime" onClick={() => navigate(page.actionTo)}>
                  {page.action} <ArrowRight size={17} />
                </Button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="border-b border-white/30 pb-0.5 text-[13.5px] font-bold text-white transition-colors hover:border-white"
                >
                  Back to home
                </button>
              </div>
            </div>
            {/* Route card */}
            <div className="mx-auto w-full max-w-[420px] rotate-[1.5deg] rounded-[22px] bg-white p-6 text-onsurface shadow-[0_25px_70px_rgba(0,0,0,.28)]">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-forest-700">COMUTA ROUTE NETWORK</p>
              <div className="mt-4 h-[150px] overflow-hidden rounded-[15px] bg-[#edf1e9]" aria-hidden="true">
                <LottieAnimation src={LOTTIE.carBlue} speed={0.82} label="Animated COMUTA car between Ajah and Victoria Island" style={{ width: '100%', height: '100%' }} />
              </div>
              <div className="mt-4 flex items-center justify-between text-[15px] font-extrabold">
                <span>Ajah</span>
                <ArrowRight size={17} className="text-forest-700" />
                <span>Victoria Island</span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-[12px] font-bold text-forest-700">
                <BadgeCheck size={15} /> Verified people on a recurring route
              </p>
              <p className="mt-2 flex items-center gap-2 text-[11.5px] font-semibold text-variant">
                <Repeat size={14} /> Monday to Friday · 7:00 AM
              </p>
            </div>
          </div>
        </section>

        {/* Proof strip overlapping the hero */}
        <div className="relative z-[4] mx-auto -mt-10 max-w-6xl px-5">
          <div className="grid grid-cols-2 rounded-2xl border border-line bg-white shadow-[0_14px_40px_rgba(10,51,37,.09)] md:grid-cols-4">
            {page.proof.map((p, i) => (
              <div
                key={p.label}
                className={`px-5 py-6 lg:px-7 lg:py-7 ${i === 0 ? '' : 'border-l border-line-soft'} ${
                  i < 2 ? 'border-b border-line-soft md:border-b-0' : ''
                }`}
              >
                <span className="block text-[28px] font-extrabold leading-none tracking-tight text-forest-700 lg:text-[40px]">{p.value}</span>
                <span className="mt-2 block text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-variant">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section cards */}
        <section className="py-14 lg:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-[700px] text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-forest-700">{page.sectionKicker}</p>
              <h2 className="mt-3 text-[30px] font-extrabold tracking-tight text-forest-900 lg:text-[40px]">{page.sectionTitle}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-variant">{page.sectionIntro}</p>
            </div>
            <div className="mt-10 grid gap-[18px] md:grid-cols-3">
              {page.cards.map(({ icon: Icon, title, text, points }, i) => (
                <article key={title} className="rounded-[18px] border border-line bg-white p-7 shadow-[0_9px_30px_rgba(10,51,37,.05)]">
                  <span className={`grid h-[50px] w-[50px] place-items-center rounded-[14px] ${ICON_TILES[i % ICON_TILES.length]}`}>
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-extrabold tracking-tight text-onsurface">{title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-variant">{text}</p>
                  <ul className="mt-5 grid gap-2.5 border-t border-line-soft pt-4">
                    {points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-[12.5px] font-bold text-onsurface">
                        <CheckCircle2 size={15} className="shrink-0 text-forest-700" /> {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {page.requirements && <Requirements {...page.requirements} />}
        {page.faq && <Faq items={page.faq} />}
        {page.faq && <ContactBlock />}

        {/* Callout */}
        <section className="py-4 pb-16 lg:pb-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[25px] bg-forest-900 p-8 text-white md:flex-row md:items-center md:p-12">
              <div className="pointer-events-none absolute -right-[70px] -top-[110px] h-[280px] w-[280px] rounded-full border border-lime-500/15" aria-hidden="true" />
              <div className="relative z-[2]">
                <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-lime-500">
                  <ShieldCheck size={14} /> Verified recurring carpools
                </p>
                <h2 className="mt-3 max-w-[560px] text-[26px] font-extrabold tracking-tight lg:text-[31px]">{page.calloutTitle}</h2>
                <p className="mt-2 max-w-[680px] text-[14.5px] leading-relaxed text-white/65">{page.calloutText}</p>
              </div>
              <Button variant="lime" className="relative z-[2] shrink-0" onClick={() => navigate(page.actionTo)}>
                {page.action} <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
