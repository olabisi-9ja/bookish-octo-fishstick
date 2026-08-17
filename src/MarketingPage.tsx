import type { ComponentType } from 'react';
import {
  ArrowRight, BadgeCheck, Banknote, Building2, CalendarDays, CarFront, CheckCircle2,
  Clock3, FileCheck2, GraduationCap, Headphones, HeartHandshake, Home, LocateFixed,
  MapPin, Repeat2, Route, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import Brand from './components/Brand';

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>;
type PageCard = { icon: Icon; title: string; text: string; points: string[] };
type PageData = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  proof: { value: string; label: string }[];
  sectionTitle: string;
  sectionIntro: string;
  cards: PageCard[];
  calloutTitle: string;
  calloutText: string;
  action: string;
};

type Props = {
  path: string;
  onNavigate: (path: string) => void;
  onOpenApp: () => void;
  onOpenOps: () => void;
};

const pages: Record<string, PageData> = {
  '/how-it-works': {
    eyebrow: 'THE PADIGO METHOD',
    title: 'A dependable commute starts with',
    accent: 'a route you already travel.',
    intro: 'PadiGo compares complete routes, timing, recurrence and trust context so riders and drivers can form carpools that work beyond a single journey.',
    proof: [{value:'35%',label:'route compatibility'}, {value:'20%',label:'pickup proximity'}, {value:'10%',label:'recurring fit'}, {value:'8%',label:'trust, rating and price'}],
    sectionTitle: 'From route to regular carpool',
    sectionIntro: 'The product is built around scheduled travel and repeatable routines, not instant ride requests.',
    cards: [
      {icon:MapPin,title:'Set your complete route',text:'Add where you start, where you are going, your preferred time and the seats you need.',points:['Flexible pickup radius','Arrival time preference','Weekday recurrence']},
      {icon:Route,title:'Compare ranked matches',text:'See route overlap, walking distance, community context, verification and contribution together.',points:['Clear match score','Verified profiles','Transparent seat price']},
      {icon:Repeat2,title:'Build a regular group',text:'Confirm once, repeat when it works and keep control of each scheduled booking.',points:['Recurring schedule','Familiar commuters','Trip by trip control']},
    ],
    calloutTitle:'See the whole rider journey',calloutText:'Search a Lagos corridor, inspect a verified match and complete the representative booking flow.',action:'Find a route match',
  },
  '/safety': {
    eyebrow: 'SAFETY AT EVERY STAGE',
    title: 'Trust is built before',
    accent: 'anyone enters the car.',
    intro: 'PadiGo combines identity checks, vehicle review, trip controls and human operations so every safety signal has context and a clear owner.',
    proof: [{value:'6',label:'verification signals'}, {value:'24/7',label:'trip safety access'}, {value:'1 tap',label:'trip sharing'}, {value:'Live',label:'route monitoring'}],
    sectionTitle: 'Layered protection for shared journeys',
    sectionIntro: 'Community membership adds context, but it never replaces identity, driver or vehicle verification.',
    cards: [
      {icon:BadgeCheck,title:'Know who is travelling',text:'Profiles show phone, identity, selfie, licence, vehicle and community checks clearly.',points:['Identity and liveness','Driver licence review','Vehicle document checks']},
      {icon:LocateFixed,title:'Stay connected in transit',text:'Live location, trip sharing, masked contact and route monitoring remain available during the journey.',points:['Live trip tracking','Route deviation review','Emergency contacts']},
      {icon:ShieldCheck,title:'Reach a human response team',text:'SOS and incident reports send trip context to safety operations for structured follow through.',points:['Safety case timeline','Blocking and reports','Operations escalation']},
    ],
    calloutTitle:'Safety tools are inside every active trip',calloutText:'Open the rider experience to view live tracking, sharing, communication and the safety centre.',action:'Open safety tools',
  },
  '/communities': {
    eyebrow: 'TRUSTED NETWORKS',
    title: 'Your route can begin with',
    accent: 'people in your circles.',
    intro: 'Workplaces, estates, campuses, churches, companies and associations help commuters discover useful context without weakening independent verification.',
    proof: [{value:'428',label:'sample workplace members'}, {value:'12',label:'active workplace routes'}, {value:'100%',label:'verified member goal'}, {value:'7',label:'community types'}],
    sectionTitle: 'Context that improves matching',
    sectionIntro: 'Communities improve discovery and trust while the matching engine still prioritises route and timing compatibility.',
    cards: [
      {icon:Building2,title:'Workplaces and companies',text:'Colleagues can discover shared corridors and verified departure windows around office schedules.',points:['Company email checks','Private route boards','Commute coordinators']},
      {icon:Home,title:'Estates and neighbourhoods',text:'Residents can start near a familiar gate and form repeatable groups for common destinations.',points:['Resident approval','Pickup meeting points','Local community rules']},
      {icon:GraduationCap,title:'Campuses and associations',text:'Students, alumni, churches and professional groups can organise trusted recurring travel.',points:['Invite codes','Membership review','Group reporting controls']},
    ],
    calloutTitle:'Find a community along your route',calloutText:'Explore verified groups, route activity and seat availability in the rider experience.',action:'Explore communities',
  },
  '/drivers': {
    eyebrow: 'DRIVE WITH PADIGO',
    title: 'Share the journey you are',
    accent: 'already making.',
    intro: 'PadiGo helps verified drivers fill empty seats on scheduled routes, manage trusted passenger requests and receive transparent cost contributions.',
    proof: [{value:'3',label:'sample seats per trip'}, {value:'₦24.6k',label:'sample weekly contribution'}, {value:'4.9',label:'sample driver rating'}, {value:'Weekly',label:'payout schedule'}],
    sectionTitle: 'Driver control from setup to payout',
    sectionIntro: 'Drivers choose the route, schedule, seat count and fair contribution before reviewing every passenger request.',
    cards: [
      {icon:FileCheck2,title:'Complete driver verification',text:'Submit identity, liveness, licence, vehicle documents and payout details for review.',points:['Document status','Vehicle approval','Bank account validation']},
      {icon:CalendarDays,title:'Publish a recurring route',text:'Choose travel days, departure time, available seats and a reasonable route contribution.',points:['Flexible time window','Passenger preferences','Reusable schedules']},
      {icon:Banknote,title:'Manage trips and earnings',text:'Review requests, control each trip and follow settlement through to driver payout.',points:['Passenger approval','Earnings statement','Payout exceptions']},
    ],
    calloutTitle:'Try the complete driver workspace',calloutText:'Switch to driver mode to publish a ride, review requests and inspect earnings.',action:'Open driver mode',
  },
  '/about': {
    eyebrow: 'WHY PADIGO',
    title: 'Building better commutes',
    accent: 'one corridor at a time.',
    intro: 'PadiGo is a Nigerian recurring carpool marketplace designed around verified people, constrained launch corridors and the journeys commuters make every week.',
    proof: [{value:'1',label:'city at launch'}, {value:'Selected',label:'initial corridors'}, {value:'Scheduled',label:'core journey type'}, {value:'Shared',label:'cost model'}],
    sectionTitle: 'A focused marketplace approach',
    sectionIntro: 'Reliable supply and demand matter more than launching everywhere at once.',
    cards: [
      {icon:Route,title:'Corridor focus',text:'Launch where recurring demand, time windows and destination clusters can create useful density.',points:['Lagos first','Measured expansion','Route health monitoring']},
      {icon:HeartHandshake,title:'Trust before scale',text:'Verification, communities, ratings and safety operations are part of the product foundation.',points:['Visible trust signals','Structured incidents','Human review']},
      {icon:CarFront,title:'Shared journeys',text:'The marketplace supports planned cost sharing rather than positioning every driver as a taxi.',points:['Fair contributions','Existing journeys','Recurring groups']},
    ],
    calloutTitle:'Experience the marketplace',calloutText:'Move between rider, driver and operations views to see how the system connects.',action:'Open PadiGo',
  },
  '/help': {
    eyebrow: 'PADIGO SUPPORT',
    title: 'Get help with your',
    accent: 'account, ride or safety.',
    intro: 'Find the right support path for bookings, payments, verification, driver documents and active trip concerns.',
    proof: [{value:'24/7',label:'safety access'}, {value:'1',label:'case timeline'}, {value:'Live',label:'trip context'}, {value:'Secure',label:'account support'}],
    sectionTitle: 'Choose the help you need',
    sectionIntro: 'Urgent trip concerns use safety tools. Account and payment questions use standard support.',
    cards: [
      {icon:Headphones,title:'Ride and booking support',text:'Get help with a request, cancellation, receipt, refund status or completed trip.',points:['Booking status','Cancellation review','Receipt access']},
      {icon:FileCheck2,title:'Verification support',text:'Understand pending checks and update identity, licence or vehicle documents.',points:['Document guidance','Review status','Profile corrections']},
      {icon:ShieldCheck,title:'Safety support',text:'Use the safety centre during a trip or report an incident with the relevant journey context.',points:['SOS access','Incident reports','Block a member']},
    ],
    calloutTitle:'Open your account support area',calloutText:'The product prototype includes profile, verification and active trip safety controls.',action:'Go to my account',
  },
  '/privacy': {
    eyebrow: 'PRIVACY',
    title: 'Your information should',
    accent: 'serve your journey.',
    intro: 'PadiGo is designed to collect the information needed for matching, verification, payments and safety while keeping access controlled and accountable.',
    proof: [{value:'NDPR',label:'privacy principles'}, {value:'Scoped',label:'staff access'}, {value:'Logged',label:'admin actions'}, {value:'Encrypted',label:'sensitive data'}],
    sectionTitle: 'Privacy by design',
    sectionIntro: 'This prototype demonstrates the controls the production platform should enforce.',
    cards: [
      {icon:CheckCircle2,title:'Purpose limited collection',text:'Route, identity and payment information should only be used for clear marketplace functions.',points:['Consent records','Retention schedules','Data minimisation']},
      {icon:ShieldCheck,title:'Controlled access',text:'Role permissions, audit logs and encryption protect sensitive identity and trip information.',points:['Least privilege','Security logging','Encrypted storage']},
      {icon:Users,title:'Member controls',text:'People should be able to review settings, block members and request account support.',points:['Privacy settings','Blocked users','Data requests']},
    ],
    calloutTitle:'Review privacy controls in profile',calloutText:'Open the profile subpage to see the representative privacy and data settings.',action:'Open profile',
  },
  '/terms': {
    eyebrow: 'TERMS OF USE',
    title: 'Clear expectations for',
    accent: 'every shared journey.',
    intro: 'PadiGo members agree to provide accurate information, follow approved trip rules and use the marketplace for legitimate shared journeys.',
    proof: [{value:'Clear',label:'booking states'}, {value:'Visible',label:'trip rules'}, {value:'Fair',label:'cancellation process'}, {value:'Reviewed',label:'disputes'}],
    sectionTitle: 'Core marketplace responsibilities',
    sectionIntro: 'Final legal terms require review by Nigerian counsel before public launch.',
    cards: [
      {icon:Users,title:'Member conduct',text:'Riders and drivers must communicate respectfully, follow safety requirements and maintain accurate profiles.',points:['Accurate identity','Respectful conduct','No account sharing']},
      {icon:Clock3,title:'Booking and cancellation',text:'Each request follows explicit acceptance, payment, cancellation and refund states.',points:['Seat confirmation','Cancellation window','Refund status']},
      {icon:ShieldCheck,title:'Safety and disputes',text:'Members can report incidents and provide evidence for structured operations review.',points:['Incident records','Fair investigation','Account action']},
    ],
    calloutTitle:'See the booking lifecycle',calloutText:'Use the rider flow to compare a ride, request a seat and review the payment summary.',action:'View a sample booking',
  },
};

const fallback = pages['/about'];

export default function MarketingPage({ path, onNavigate, onOpenApp, onOpenOps }: Props) {
  const page = pages[path] ?? fallback;
  const go = (next: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(next);
  };
  return <main className="marketing-page">
    <header className="info-header">
      <a href="/" onClick={go('/')}><Brand /></a>
      <nav>
        <a href="/how-it-works" onClick={go('/how-it-works')}>How it works</a>
        <a href="/safety" onClick={go('/safety')}>Safety</a>
        <a href="/communities" onClick={go('/communities')}>Communities</a>
        <a href="/drivers" onClick={go('/drivers')}>Drivers</a>
      </nav>
      <button className="btn btn-primary btn-small" onClick={onOpenApp}>Open PadiGo <ArrowRight size={16}/></button>
    </header>

    <section className="info-hero">
      <div className="info-orbit one"/><div className="info-orbit two"/>
      <div className="page-width info-hero-inner">
        <div>
          <span className="info-eyebrow"><Sparkles size={14}/>{page.eyebrow}</span>
          <h1>{page.title}<br/><em>{page.accent}</em></h1>
          <p>{page.intro}</p>
          <div className="info-actions"><button className="btn btn-lime" onClick={onOpenApp}>{page.action}<ArrowRight size={17}/></button><a href="/" onClick={go('/')}>Back to home</a></div>
        </div>
        <div className="info-route-card">
          <span>PADIGO ROUTE NETWORK</span>
          <div className="route-line-art"><i/><b/><i/><em/></div>
          <div><strong>Ajah</strong><ArrowRight/><strong>Victoria Island</strong></div>
          <p><BadgeCheck size={15}/>Verified people on a recurring route</p>
          <small><Repeat2 size={14}/>Monday to Friday · 7:00 AM</small>
        </div>
      </div>
    </section>

    <section className="info-proof page-width">
      {page.proof.map(item=><div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
    </section>

    <section className="info-content page-width">
      <div className="info-section-heading"><span>BUILT FOR RECURRING TRAVEL</span><h2>{page.sectionTitle}</h2><p>{page.sectionIntro}</p></div>
      <div className="info-card-grid">{page.cards.map(({icon:Icon,title,text,points})=><article key={title}><span><Icon size={24}/></span><h3>{title}</h3><p>{text}</p><ul>{points.map(point=><li key={point}><CheckCircle2 size={15}/>{point}</li>)}</ul></article>)}</div>
    </section>

    <section className="info-callout page-width">
      <div><span><ShieldCheck/>VERIFIED RECURRING CARPOOLS</span><h2>{page.calloutTitle}</h2><p>{page.calloutText}</p></div>
      <button className="btn btn-lime" onClick={onOpenApp}>{page.action}<ArrowRight size={17}/></button>
    </section>

    <footer className="info-footer">
      <div className="page-width"><div><Brand inverse/><p>Trusted recurring carpools for the routes Nigerians travel every day.</p></div><div><a href="/about" onClick={go('/about')}>About</a><a href="/help" onClick={go('/help')}>Help centre</a><a href="/privacy" onClick={go('/privacy')}>Privacy</a><a href="/terms" onClick={go('/terms')}>Terms</a><button onClick={onOpenOps}>Operations</button></div></div>
    </footer>
  </main>;
}
