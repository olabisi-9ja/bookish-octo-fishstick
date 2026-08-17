import { useState } from 'react';
import {
  ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, ChevronDown, Clock3, Coins,
  HeartHandshake, LocateFixed, MapPin, Menu, Repeat2, Route, Search, ShieldCheck,
  Sparkles, Star, Users, X, Zap, Building2, GraduationCap, Home,
} from 'lucide-react';
import Brand from './components/Brand';
import { Avatar, VerifiedBadge } from './components/UI';
import { rides, formatNaira } from './data';

type Props = { onNavigate: (path: string) => void; onOpenApp: () => void; onOpenOps: () => void };

export default function Landing({ onNavigate, onOpenApp, onOpenOps }: Props) {
  const [menu, setMenu] = useState(false);
  const [tripType, setTripType] = useState<'ride' | 'offer'>('ride');
  const [from, setFrom] = useState('Ajah, Lagos');
  const [to, setTo] = useState('Victoria Island');

  const search = () => onOpenApp();
  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenu(false);
    onNavigate(path);
  };

  return (
    <main className="landing">
      <div className="announcement">
        <span><Sparkles size={14} /> PadiGo is opening selected Lagos corridors</span>
        <button onClick={onOpenApp}>Join the early community <ArrowRight size={14} /></button>
      </div>
      <header className="site-header">
        <a href="/" className="logo-link" onClick={go('/')}><Brand /></a>
        <nav className={menu ? 'open' : ''}>
          <a href="/how-it-works" onClick={go('/how-it-works')}>How it works</a>
          <a href="/safety" onClick={go('/safety')}>Safety</a>
          <a href="/communities" onClick={go('/communities')}>Communities</a>
          <a href="/drivers" onClick={go('/drivers')}>Drive with PadiGo</a>
          <button className="nav-ops" onClick={onOpenOps}>Operations demo</button>
          <div className="mobile-nav-actions">
            <button className="btn btn-light" onClick={onOpenApp}>Log in</button>
            <button className="btn btn-primary" onClick={onOpenApp}>Get started</button>
          </div>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={onOpenApp}>Log in</button>
          <button className="btn btn-primary btn-small" onClick={onOpenApp}>Get PadiGo <ArrowRight size={16} /></button>
          <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content page-width">
          <div className="hero-copy">
            <div className="eyebrow light">Built for everyday Lagos commutes</div>
            <h1>Your route.<br />Your people.<br /><em>Your commute.</em></h1>
            <p>Match with verified people heading your way, share the cost, and turn your daily route into a commute you can count on.</p>
            <div className="hero-trust">
              <div className="avatar-stack"><Avatar initials="AO" color="#cc795c" size={38} /><Avatar initials="TN" color="#7160a5" size={38} /><Avatar initials="DL" color="#347968" size={38} /><span className="more-avatar">+2k</span></div>
              <div><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><span>People building better commutes</span></div>
            </div>
          </div>

          <div className="search-card">
            <div className="search-tabs">
              <button className={tripType === 'ride' ? 'active' : ''} onClick={() => setTripType('ride')}><Search size={17} /> Find a ride</button>
              <button className={tripType === 'offer' ? 'active' : ''} onClick={() => setTripType('offer')}><CarFront size={17} /> Offer a ride</button>
            </div>
            <div className="search-card-body">
              <div className="route-inputs">
                <label>
                  <span>Leaving from</span>
                  <div className="input-shell"><span className="route-pin from" /><input value={from} onChange={(e) => setFrom(e.target.value)} /><LocateFixed size={18} /></div>
                </label>
                <span className="route-line" />
                <label>
                  <span>Going to</span>
                  <div className="input-shell"><MapPin size={18} className="to-pin" /><input value={to} onChange={(e) => setTo(e.target.value)} /></div>
                </label>
              </div>
              <div className="search-grid">
                <label><span>When</span><div className="input-shell"><CalendarDays size={17} /><input defaultValue="Tomorrow" /><ChevronDown size={16} /></div></label>
                <label><span>Departure</span><div className="input-shell"><Clock3 size={17} /><input defaultValue="7:00 AM" /><ChevronDown size={16} /></div></label>
              </div>
              <label className="repeat-check"><span className="check-box"><Check size={13} /></span><span><strong>Make it my regular commute</strong><small>Get matched automatically every weekday</small></span></label>
              <button className="btn btn-primary btn-block" onClick={search}>{tripType === 'ride' ? 'Find people going my way' : 'Share my empty seats'} <ArrowRight size={18} /></button>
              <p className="card-note"><ShieldCheck size={14} /> Identity verified community · Secure payments</p>
            </div>
          </div>
        </div>
        <div className="corridor-strip">
          <span>Live corridors</span>
          <button onClick={onOpenApp}>Ajah <ArrowRight size={13} /> VI</button>
          <button onClick={onOpenApp}>Ikeja <ArrowRight size={13} /> VI</button>
          <button onClick={onOpenApp}>Yaba <ArrowRight size={13} /> Lekki</button>
          <span className="live-tag"><i /> 68 seats tomorrow</span>
        </div>
      </section>

      <section className="proof page-width">
        <p className="section-kicker">A smarter way to move together</p>
        <div className="proof-grid">
          <div><strong>96%</strong><span>top route match</span></div>
          <div><strong>₦38k</strong><span>potential monthly savings</span></div>
          <div><strong>6</strong><span>verification signals</span></div>
          <div><strong>4.9<span>/5</span></strong><span>community trust rating</span></div>
        </div>
      </section>

      <section className="how-section page-width" id="how">
        <div className="section-heading centered">
          <div className="eyebrow"><Route size={15} /> Built around your routine</div>
          <h2>Your daily journey,<br />finally working <em>for you.</em></h2>
          <p>Not another taxi app. PadiGo helps the same people going the same way build reliable, repeatable carpools.</p>
        </div>
        <div className="how-grid">
          <article>
            <span className="step-number">01</span><div className="icon-tile mint"><MapPin /></div>
            <h3>Set your route once</h3><p>Tell us where you start, where you're going, and the time window that works for you.</p>
            <span className="micro-example"><i /> Ajah <ArrowRight size={13} /> Victoria Island</span>
          </article>
          <article>
            <span className="step-number">02</span><div className="icon-tile yellow"><Users /></div>
            <h3>Meet your best matches</h3><p>Compare route overlap, verified profiles, community context, timing and price at a glance.</p>
            <div className="match-bubbles"><span>96% match</span><span>Same workplace</span></div>
          </article>
          <article>
            <span className="step-number">03</span><div className="icon-tile peach"><Repeat2 /></div>
            <h3>Make it your commute</h3><p>Book once or build a recurring group with people you enjoy travelling with.</p>
            <span className="micro-example"><CalendarDays size={14} /> Monday to Friday · 7:00 AM</span>
          </article>
        </div>
      </section>

      <section className="commute-feature">
        <div className="page-width feature-grid">
          <div className="phone-stage">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="phone">
              <div className="phone-top"><span>9:41</span><span>● ● ▰</span></div>
              <div className="phone-body">
                <div className="mini-head"><Brand compact /><span className="mini-avatar">OO</span></div>
                <p className="mini-greeting">GOOD MORNING, OLABISI</p>
                <h4>Your commute is looking good.</h4>
                <div className="phone-commute-card">
                  <div className="phone-route-map"><span className="map-road r1"/><span className="map-road r2"/><i className="point p1"/><i className="point p2"/><span className="map-car">⌁</span></div>
                  <div className="mini-route"><span><i /> Ajah</span><b>→</b><span><i /> Victoria Island</span></div>
                  <div className="mini-ride-row"><Avatar initials="AB" color="#cf7652" size={34} /><div><strong>Ade's carpool</strong><small>7:05 AM · 2 seats</small></div><strong>₦1,500</strong></div>
                  <button onClick={onOpenApp}>View my commute</button>
                </div>
                <div className="mini-community"><Users size={18} /><span><strong>8 people</strong> from your area are going your way</span></div>
              </div>
              <div className="phone-nav"><span className="active">⌂<small>Home</small></span><span>⌕<small>Explore</small></span><span>◇<small>Trips</small></span><span>○<small>Profile</small></span></div>
            </div>
            <div className="floating-save"><Coins size={20} /><span><small>YOU'LL SAVE THIS MONTH</small><strong>₦38,400</strong></span></div>
            <div className="floating-match"><BadgeCheck size={20} /><span><strong>New route match</strong><small>96% compatible</small></span></div>
          </div>
          <div className="feature-copy">
            <div className="eyebrow light"><Repeat2 size={15} /> The recurring advantage</div>
            <h2>Don't find a ride.<br /><em>Find your people.</em></h2>
            <p>The best commute isn't a new driver every morning. It's a trusted group who know the route, the time, and each other.</p>
            <ul>
              <li><span><Check /></span><div><strong>Your routine, remembered</strong><small>Set a weekday pattern once and let PadiGo keep matching.</small></div></li>
              <li><span><Check /></span><div><strong>Familiar faces, less uncertainty</strong><small>Build a regular group from your area, office, estate or school.</small></div></li>
              <li><span><Check /></span><div><strong>Reliable savings, every week</strong><small>Split verified trip costs without surprise surge pricing.</small></div></li>
            </ul>
            <button className="btn btn-lime" onClick={onOpenApp}>Build my commute <ArrowRight size={18} /></button>
          </div>
        </div>
      </section>

      <section className="routes-section page-width">
        <div className="section-heading-row">
          <div><div className="eyebrow"><Zap size={15} /> Moving tomorrow morning</div><h2>Popular Lagos routes</h2></div>
          <button className="link-button" onClick={onOpenApp}>Explore all rides <ArrowRight size={16} /></button>
        </div>
        <div className="ride-card-grid">
          {rides.map((ride, i) => (
            <article className="public-ride-card" key={ride.id}>
              <div className={`route-visual route-${i + 1}`}>
                <span className="route-street s1"/><span className="route-street s2"/><span className="route-street s3"/>
                <svg viewBox="0 0 320 105"><path d={i === 1 ? 'M20 76 C80 100 115 15 190 42 S250 83 300 25' : 'M20 78 C82 62 95 22 168 42 S230 90 302 28'} /><circle cx="20" cy="78" r="5"/><circle cx="302" cy="28" r="5"/></svg>
                <span className="match-pill">{ride.match}% match</span>
              </div>
              <div className="ride-card-content">
                <div className="ride-driver"><Avatar initials={ride.initials} color={ride.avatarColor} size={43} /><div><strong>{ride.driver}</strong><span><Star size={13} fill="currentColor" /> {ride.rating} · {ride.trips} trips</span></div><VerifiedBadge /></div>
                <div className="route-title"><strong>{ride.from}</strong><ArrowRight size={17}/><strong>{ride.to}</strong></div>
                <div className="ride-meta"><span><Clock3 /> {ride.time}</span><span><CarFront /> {ride.seats} seats</span><span><Repeat2 /> {ride.recurring ? 'Weekdays' : 'Tomorrow'}</span></div>
                <div className="ride-price"><span><small>Per seat</small><strong>{formatNaira(ride.price)}</strong></span><button onClick={onOpenApp}>View ride <ArrowRight size={15}/></button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="community-section" id="communities">
        <div className="page-width community-grid">
          <div className="community-copy">
            <div className="eyebrow"><HeartHandshake size={15}/> Trust starts with context</div>
            <h2>Strangers become<br /><em>your community.</em></h2>
            <p>Choose matches from groups you already have something in common with, without mistaking affiliation for verification.</p>
            <div className="community-types">
              <span><Building2/>Workplaces</span><span><Home/>Estates</span><span><GraduationCap/>Campuses</span><span><Users/>Associations</span>
            </div>
            <button className="btn btn-dark" onClick={onOpenApp}>Find my community <ArrowRight size={17}/></button>
          </div>
          <div className="community-board">
            <div className="board-head"><span>COMMUNITIES NEAR YOUR ROUTE</span><span><i/> Lagos</span></div>
            <div className="community-card c1"><span className="community-logo">ST</span><div><strong>PadiGo at Sterling</strong><small>Workplace · 428 members</small></div><span className="join-chip">12 routes</span></div>
            <div className="community-card c2"><span className="community-logo">LG</span><div><strong>Lekki Gardens</strong><small>Estate · 216 members</small></div><span className="join-chip">8 routes</span></div>
            <div className="community-card c3"><span className="community-logo">VT</span><div><strong>VI Tech Circle</strong><small>Professional · 1,200 members</small></div><span className="join-chip">26 routes</span></div>
            <div className="board-note"><BadgeCheck size={16}/><span>Membership is one trust signal. Every driver and vehicle is verified separately.</span></div>
          </div>
        </div>
      </section>

      <section className="safety-section" id="safety">
        <div className="page-width safety-grid">
          <div>
            <div className="eyebrow light"><ShieldCheck size={15}/> Safety, designed in</div>
            <h2>Know who you're<br />riding with.</h2>
            <p>Safety isn't a button added at the end. It's identity, vehicle, trip and response systems working together from signup to arrival.</p>
            <button className="btn btn-lime" onClick={onOpenApp}>See our safety standard <ArrowRight size={17}/></button>
          </div>
          <div className="safety-cards">
            <article><span><BadgeCheck/></span><div><h3>Layered verification</h3><p>Identity, selfie, licence, vehicle and community signals shown clearly.</p></div></article>
            <article><span><LocateFixed/></span><div><h3>Live trip protection</h3><p>Shareable tracking, pickup confirmation and route deviation signals.</p></div></article>
            <article><span><ShieldCheck/></span><div><h3>Human safety response</h3><p>SOS connects trip context to your contacts and PadiGo operations.</p></div></article>
          </div>
        </div>
      </section>

      <section className="driver-cta page-width" id="drivers">
        <div className="driver-pattern" />
        <div className="driver-copy"><div className="eyebrow light"><CarFront size={15}/> Already going that way?</div><h2>Your empty seats can<br />help pay for the journey.</h2><p>Share your regular route with verified riders. You set the schedule, seats and fair cost contribution.</p><button className="btn btn-white" onClick={onOpenApp}>Offer a ride <ArrowRight size={17}/></button></div>
        <div className="earn-card"><span className="earn-label">THIS WEEK</span><strong>₦24,600</strong><small>Cost contributions from 9 shared seats</small><div className="earn-bars"><i/><i/><i/><i/><i className="high"/><i className="med"/><i/></div><div className="earn-foot"><span>Mon</span><span>Sun</span></div></div>
      </section>

      <footer>
        <div className="page-width footer-main">
          <div className="footer-brand"><Brand inverse/><p>Trusted recurring carpools for the routes Nigerians travel every day.</p><span>Lagos, Nigeria 🇳🇬</span></div>
          <div><h4>Ride</h4><a onClick={onOpenApp}>Find a ride</a><a onClick={onOpenApp}>My commute</a><a href="/communities" onClick={go('/communities')}>Communities</a><a href="/safety" onClick={go('/safety')}>Safety</a></div>
          <div><h4>Drive</h4><a href="/drivers" onClick={go('/drivers')}>Offer a ride</a><a href="/drivers" onClick={go('/drivers')}>Driver requirements</a><a onClick={onOpenApp}>Earnings</a><a href="/safety" onClick={go('/safety')}>Verification</a></div>
          <div><h4>PadiGo</h4><a href="/about" onClick={go('/about')}>About</a><a href="/help" onClick={go('/help')}>Help centre</a><a onClick={onOpenOps}>Operations</a><a href="/help" onClick={go('/help')}>Contact</a></div>
        </div>
        <div className="page-width footer-bottom"><span>© 2026 PadiGo Technologies Ltd.</span><div><a href="/privacy" onClick={go('/privacy')}>Privacy</a><a href="/terms" onClick={go('/terms')}>Terms</a><a href="/help" onClick={go('/help')}>Accessibility</a></div><span className="ndpr"><ShieldCheck size={13}/> Privacy by design</span></div>
      </footer>
    </main>
  );
}
