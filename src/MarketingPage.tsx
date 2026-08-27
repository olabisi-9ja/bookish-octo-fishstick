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
    eyebrow: 'THE COMUTA METHOD',
    title: 'A dependable commute starts with',
    accent: 'a route you already travel.',
    intro: 'COMUTA matches commuters along scheduled Lagos arterial corridors. From Ikorodu Hub to Victoria Island, riders and drivers form dependable shared journeys with verified 98%+ reliability.',
    proof: [{value:'98%',label:'driver completion target'}, {value:'T-8',label:'commitment verification'}, {value:'100%',label:'well-lit hub gates'}, {value:'4827',label:'PIN departure check'}],
    sectionTitle: 'From corridor to daily calendar routine',
    sectionIntro: 'The product is built around scheduled travel and repeatable routines, not instant ride requests.',
    cards: [
      {icon:MapPin,title:'Select designated transit hubs',text:'Choose verified departure hubs such as Ikorodu Hub Main Gate with dedicated waiting bays.',points:['Well-lit pickup points','Designated waiting bays','Corridor-aligned flow']},
      {icon:Route,title:'Compare 3-second decision cards',text:'Instantly evaluate time, 98% driver completion score, verified vehicle plate and fair seat cost.',points:['Clear departure & ETA','Verified trust scores','Transparent seat contribution']},
      {icon:Repeat2,title:'Build a recurring schedule',text:'Reserve Monday to Friday once and let COMUTA manage your morning transport subscription.',points:['Automated seat lock','Skip tomorrow anytime','Pause or resume with 1 tap']},
    ],
    calloutTitle:'See the whole rider journey',calloutText:'Explore the Ikorodu ➔ Victoria Island corridor and test the full MVP booking flow.',action:'Find available trips',
  },
  '/safety': {
    eyebrow: 'SAFETY & TRUST AT EVERY STAGE',
    title: 'Trust is built before you ever reach',
    accent: 'the pickup hub gate.',
    intro: 'COMUTA combines national identity checks (NIN), driver license review, verified vehicle plates, well-lit hub waiting bays, and active corridor tracking so every commute is safe and accountable.',
    proof: [{value:'100%',label:'NIN & ID checked'}, {value:'T-8',label:'driver commitment check'}, {value:'4-digit',label:'PIN verification'}, {value:'24/7',label:'corridor operations'}],
    sectionTitle: 'Safety engineered across the entire spine',
    sectionIntro: 'From reservation to drop-off, active safeguards protect both riders and drivers.',
    cards: [
      {icon:FileCheck2,title:'Automated commuter verification',text:'Every commuter undergoes NIN verification, biometric checks, and emergency contact assignment.',points:['NIN identity match','Emergency contact sync','Corridor history']},
      {icon:MapPin,title:'Designated well-lit pickup hubs',text:'No standing in dark or isolated bus stops. Pickups happen at verified hubs with designated bays.',points:['Ikorodu Hub Main Gate','Victoria Island Transit Bay','Security monitored areas']},
      {icon:ShieldCheck,title:'Active trip monitoring & SOS',text:'Corridor deviations are flagged in real time, and instant SOS alerts trigger operations dispatch.',points:['Live route tracking','Direct operations hotline','Emergency contact broadcast']},
    ],
    calloutTitle:'Inspect safety in live operations',calloutText:'Open the COMUTA Operations Centre to review active safety cases and live corridor monitoring.',action:'Open operations demo',
  },
  '/drivers': {
    eyebrow: 'DRIVE WITH COMUTA',
    title: 'Turn your daily empty seats into',
    accent: 'commute cost recovery.',
    intro: 'COMUTA helps verified drivers fill empty seats on scheduled routes, manage trusted passenger requests, and receive transparent weekly settlements to offset fuel and maintenance.',
    proof: [{value:'₦90k',label:'avg monthly recovery'}, {value:'3',label:'seats filled'}, {value:'98%',label:'completion standard'}, {value:'Friday',label:'direct bank payouts'}],
    sectionTitle: 'Commuting, not gig-driving',
    sectionIntro: 'You drive your normal daily route on your own schedule. Empty seats simply help cover your costs.',
    cards: [
      {icon:CarFront,title:'Drive your own routine',text:'Publish your morning departure time once and commute with familiar neighbours and colleagues.',points:['Your usual corridor','No wandering off-route','Set your seat availability']},
      {icon:Banknote,title:'Predictable cost offset',text:'Receive fair seat contributions settled directly to your Nigerian bank account every Friday.',points:['Automatic payment collection','Zero cash awkwardness','Transparent balance tracking']},
      {icon:Clock3,title:'Signature T-8 commitment',text:'Confirm your commute by 11:00 PM the evening before. Build an elite 98%+ reliability score.',points:['Build passenger trust','Tier 1 commuter status','Priority seat booking']},
    ],
    calloutTitle:'Calculate your savings',calloutText:'See how much fuel and maintenance cost you can recover this month on COMUTA.',action:'Publish a commute',
  },
  '/communities': {
    eyebrow: 'CORRIDOR CIRCLES',
    title: 'Commute with neighbours, colleagues',
    accent: 'and familiar faces.',
    intro: 'COMUTA organizes verified commuters by corridors, estates, and corporate business districts so you ride with trusted peers.',
    proof: [{value:'1,400+',label:'corridor members'}, {value:'4.9',label:'average rating'}, {value:'34',label:'daily departures'}, {value:'100%',label:'verified profiles'}],
    sectionTitle: 'Shared commuting built on trust',
    sectionIntro: 'Corridor circles provide social familiarity while preserving rigorous platform safety.',
    cards: [
      {icon:Building2,title:'Workplace circles',text:'Connect with colleagues commuting from Mainland hubs to Victoria Island, Marina, and Oniru.',points:['Verified corporate domains','Coordinated arrival times','Consistent carpool groups']},
      {icon:Home,title:'Estate & hub networks',text:'Coordinate morning departures directly from major residential communities like Ikorodu Hub.',points:['Neighbourhood trust','Shared gateway pickups','Calm, predictable mornings']},
      {icon:GraduationCap,title:'Alumni & professional networks',text:'Commute with verified professionals and alumni across the Third Mainland arterial corridor.',points:['Professional networking','Quiet, comfortable rides','Accountable etiquette']},
    ],
    calloutTitle:'Join a corridor network',calloutText:'Find shared commute circles along your daily Lagos route.',action:'Find your route',
  },
};

export default function MarketingPage({ path, onNavigate, onOpenApp, onOpenOps }: Props) {
  const data = pages[path] ?? pages['/how-it-works'];

  const go = (target: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate(target);
  };

  return (
    <div className="marketing-page">
      <header className="site-header">
        <a href="/" className="logo-link" onClick={go('/')}><Brand tagline /></a>
        <nav>
          <a href="/how-it-works" onClick={go('/how-it-works')}>How it works</a>
          <a href="/safety" onClick={go('/safety')}>Safety & Hubs</a>
          <a href="/drivers" onClick={go('/drivers')}>For Drivers</a>
          <a href="/communities" onClick={go('/communities')}>Corridors</a>
          <button className="nav-ops" onClick={onOpenOps}>Operations Demo</button>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={onOpenApp}>Log in</button>
          <button className="btn btn-primary btn-small" onClick={onOpenApp}>Open COMUTA <ArrowRight size={16} /></button>
        </div>
      </header>

      <main className="page-width mkt-body">
        <div className="mkt-hero">
          <span className="eyebrow">{data.eyebrow}</span>
          <h1>{data.title} <em>{data.accent}</em></h1>
          <p className="lead">{data.intro}</p>
          <div className="proof-strip">
            {data.proof.map((p) => (
              <div key={p.label} className="proof-item">
                <strong>{p.value}</strong>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="mkt-cards-section">
          <div className="mkt-cards-head">
            <h2>{data.sectionTitle}</h2>
            <p>{data.sectionIntro}</p>
          </div>
          <div className="mkt-cards-grid">
            {data.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="mkt-card">
                  <div className="mkt-card-icon"><Icon size={24} /></div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <ul>
                    {card.points.map((pt) => (
                      <li key={pt}><CheckCircle2 size={15} /><span>{pt}</span></li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mkt-callout">
          <div>
            <h3>{data.calloutTitle}</h3>
            <p>{data.calloutText}</p>
          </div>
          <button className="btn btn-primary cta-large" onClick={onOpenApp}>
            <span>{data.action}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-bottom">
          <span>© 2026 COMUTA Technologies Ltd. “My daily commute is already taken care of.”</span>
          <span className="ndpr"><ShieldCheck size={13} /> NDPR Compliant · Verified Corridor Mobility</span>
        </div>
      </footer>
    </div>
  );
}
