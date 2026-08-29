import { useMemo, useState } from 'react';
import {
  ArrowRight, BadgeCheck, Building2, CalendarDays, CarFront, Check, ChevronDown, Clock3,
  Coins, GraduationCap, HeartHandshake, Home, LocateFixed, MapPin, Quote, Repeat2, Route,
  Search, ShieldCheck, Sparkles, Star, Users, Zap,
} from 'lucide-react';
import { Avatar, VerifiedBadge } from './components/UI';
import { CarpoolCrewArt } from './components/Illustrations';
import { AppDownload, AudienceBanner, SiteFooter, SiteHeader } from './components/MarketingUi';
import { BlurReveal, FaceDock, ManifestoHighlight, PhotoRail, SpreadWord } from './components/ScrollEffects';
import { rides, formatNaira } from './data';
import { quoteRoute, searchPlaces } from './platform';

type Props = { onNavigate: (path: string) => void; onOpenApp: () => void; onOpenOps: () => void };

export default function Landing({ onNavigate, onOpenApp, onOpenOps }: Props) {
  const [mode, setMode] = useState<'ride' | 'drive'>('ride');
  const [from, setFrom] = useState('Ajah, Lagos');
  const [to, setTo] = useState('Victoria Island');
  const [recurring, setRecurring] = useState(true);
  const [showPrice, setShowPrice] = useState(false);

  const quote = useMemo(() => {
    const fromPlace = searchPlaces(from)[0];
    const toPlace = searchPlaces(to)[0];
    if (!fromPlace || !toPlace || fromPlace.id === toPlace.id) return null;
    return quoteRoute(fromPlace, toPlace);
  }, [from, to]);

  const search = () => {
    sessionStorage.setItem('comuta.search', JSON.stringify({ from, to, tripType: mode === 'drive' ? 'offer' : 'ride' }));
    onOpenApp();
  };
  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(path);
  };

  return (
    <main className="landing">
      <SiteHeader onNavigate={onNavigate} onOpenApp={onOpenApp} onOpenOps={onOpenOps} />

      {/* ---- Split-action hero: functional ride search + driver earning panel ---- */}
      <section className="com-hero">
        <div className="com-hero-bg" />
        <div className="com-hero-overlay" />
        <div className="com-hero-grid page-width">
          <div className="com-hero-copy">
            <div className="com-eyebrow light"><Sparkles size={15} /> Built for everyday Lagos commutes</div>
            <h1 className="com-hero-title">Your route.<br />Your people.<br /><em>Your commute.</em></h1>
            <p className="com-hero-lead">Match with verified people heading your way, share the cost, and turn your daily route into a commute you can count on.</p>

            <div className="com-audience-switch">
              <button className={mode === 'ride' ? 'active' : ''} onClick={() => setMode('ride')}><Search size={16} /> I want a ride</button>
              <button className={mode === 'drive' ? 'active' : ''} onClick={() => setMode('drive')}><CarFront size={16} /> I want to earn</button>
            </div>

            <div className="com-hero-trust">
              <div className="avatar-stack"><Avatar initials="Tolu" color="#1c6e54" size={38} /><Avatar initials="Chidi" color="#155e6e" size={38} /><Avatar initials="Amaka" color="#37474f" size={38} /><Avatar initials="Seyi" color="#6f8f0e" size={38} /><span className="more-avatar">+2k</span></div>
              <div className="com-trust-copy"><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><span>Trusted by 2,000+ commuters building better routines</span></div>
            </div>

            <div className="com-hero-flags">
              <span><ShieldCheck size={15} /> Identity-verified network</span>
              <span><Coins size={15} /> No surge pricing</span>
              <span><Repeat2 size={15} /> Recurring by design</span>
            </div>
          </div>

          <div className="com-hero-panel">
            {mode === 'ride' ? (
              <div className="com-card">
                <div className="com-card-head">
                  <span className="com-card-eyebrow">BOOK YOUR COMMUTE</span>
                  <h3>See real people <em>going your way.</em></h3>
                </div>
                <div className="com-card-body">
                  <div className="com-route-stack">
                    <label>
                      <span className="com-field-label">Leaving from</span>
                      <div className="com-input"><span className="com-route-pin" /><input value={from} onChange={(e) => setFrom(e.target.value)} /><LocateFixed size={18} /></div>
                    </label>
                    <span className="com-route-line" />
                    <label>
                      <span className="com-field-label">Going to</span>
                      <div className="com-input"><MapPin size={18} className="com-route-to-pin" /><input value={to} onChange={(e) => setTo(e.target.value)} /></div>
                    </label>
                  </div>
                  <div className="com-grid-2">
                    <label><span className="com-field-label">When</span><div className="com-input compact"><CalendarDays size={17} /><input defaultValue="Tomorrow" /><ChevronDown size={16} /></div></label>
                    <label><span className="com-field-label">Departure</span><div className="com-input compact"><Clock3 size={17} /><input defaultValue="7:00 AM" /><ChevronDown size={16} /></div></label>
                  </div>
                  <label className="com-recurring-row" onClick={() => setRecurring(!recurring)}>
                    <span className={`com-checkbox ${recurring ? 'checked' : ''}`}>{recurring && <Check size={13} />}</span>
                    <span><strong>Make it my regular commute</strong><small>Get matched automatically every weekday</small></span>
                  </label>
                  <button className="com-price-toggle" onClick={() => setShowPrice(!showPrice)}>
                    {showPrice ? <ChevronDown size={15} /> : <Zap size={15} />} {showPrice ? 'Hide estimated prices' : 'See prices before signing up'}
                  </button>
                  {showPrice && (
                    <div className="com-price-preview">
                      {quote ? (
                        <>
                          <strong>{formatNaira(quote.band.low)} - {formatNaira(quote.band.high)}</strong> per seat · about {quote.durationMin} min
                          <small>{quote.distanceKm} km route · vs {formatNaira(quote.taxi)} by taxi · no surge pricing</small>
                        </>
                      ) : (
                        <small>Start typing a Lagos route like “Ajah” or “Victoria Island” to see a per-seat estimate.</small>
                      )}
                    </div>
                  )}
                  <button className="btn btn-primary btn-block" onClick={search}>{mode === 'ride' ? 'Find people going my way' : 'Start earning'} <ArrowRight size={18} /></button>
                  <p className="com-card-note"><ShieldCheck size={14} /> Identity verified community · Secure payments</p>
                </div>
              </div>
            ) : (
              <div className="com-card drive">
                <div className="com-card-head drive">
                  <span className="com-card-eyebrow">DRIVE &amp; EARN</span>
                  <h3>Your empty seats can <em>pay for the road.</em></h3>
                </div>
                <div className="com-card-body">
                  <div className="com-drive-highlight">
                    <div><small>THIS WEEK</small><strong>₦24,600</strong><span>from 9 shared seats</span></div>
                    <div className="com-drive-bars"><i /><i /><i className="high" /><i /><i /></div>
                  </div>
                  <ul className="com-drive-list">
                    <li><span><Check /></span><strong>You set the route &amp; schedule</strong></li>
                    <li><span><Check /></span><strong>Verified riders only</strong></li>
                    <li><span><Check /></span><strong>Weekly, transparent payouts</strong></li>
                  </ul>
                  <div className="com-drive-route"><span><i /> Ajah</span><ArrowRight size={15} /><span><i /> Victoria Island</span><em>184 trips shared</em></div>
                  <button className="btn btn-lime btn-block" onClick={() => search()}><CarFront size={18} /> Register as a driver <ArrowRight size={18} /></button>
                  <p className="com-card-note"><BadgeCheck size={14} /> 6 verification signals · Weekly settlement</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="com-corridor-strip">
          <span>Live corridors</span>
          <button onClick={onOpenApp}>Ajah <ArrowRight size={13} /> VI</button>
          <button onClick={onOpenApp}>Ikeja <ArrowRight size={13} /> VI</button>
          <button onClick={onOpenApp}>Yaba <ArrowRight size={13} /> Lekki</button>
          <span className="live-tag"><i /> 68 seats tomorrow</span>
        </div>
      </section>

      {/* ---- Proof strip ---- */}
      <section className="com-proof">
        <div className="page-width">
          <p className="section-kicker">A smarter way to move together</p>
          <div className="com-proof-grid">
            <div className="com-proof-item"><strong>96%</strong><span>top route match</span></div>
            <div className="com-proof-item"><strong>₦38k</strong><span>potential monthly savings</span></div>
            <div className="com-proof-item"><strong>6</strong><span>verification signals</span></div>
            <div className="com-proof-item"><strong>4.9<span>/5</span></strong><span>community trust rating</span></div>
          </div>
        </div>
      </section>

      {/* ---- Targeted audience choice ---- */}
      <section className="com-choice page-width" id="choices">
        <div className="com-section-heading centered">
          <div className="com-eyebrow"><Zap size={15} /> Built for the way you travel</div>
          <h2>Pick your lane. <em>We'll do the rest.</em></h2>
          <p>Whether you come to ride, to earn, or to bring your people together, Comuta is one trusted network.</p>
        </div>
        <div className="com-choice-grid">
          <article className="com-choice-card ride">
            <span className="com-choice-icon"><Search size={24} /></span>
            <div className="com-choice-card-copy"><h3>Ride with Comuta</h3><p>Compare complete routes, verified profiles and transparent per-seat prices before you book.</p></div>
            <button className="btn btn-primary" onClick={onOpenApp}>Find a ride <ArrowRight size={17} /></button>
          </article>
          <article className="com-choice-card drive">
            <span className="com-choice-icon"><CarFront size={24} /></span>
            <div className="com-choice-card-copy"><h3>Drive &amp; earn</h3><p>You're already going that way. Set your seats, schedule and contribution once, then get paid weekly.</p></div>
            <button className="btn btn-lime" onClick={onOpenApp}>Start earning <ArrowRight size={17} /></button>
          </article>
          <article className="com-choice-card community">
            <span className="com-choice-icon"><Users size={24} /></span>
            <div className="com-choice-card-copy"><h3>Build your community</h3><p>Workplaces, estates and campuses get private route boards with the same independent verification.</p></div>
            <button className="btn btn-dark" onClick={() => onNavigate('/communities')}>Explore communities <ArrowRight size={17} /></button>
          </article>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="how-section page-width" id="how">
        <div className="section-heading centered">
          <div className="eyebrow"><Route size={15} /> Built around your routine</div>
          <h2>Your daily journey,<br />finally working <em>for you.</em></h2>
          <p>Not another taxi app. Comuta helps the same people going the same way build reliable, repeatable carpools.</p>
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

      {/* ---- Recurring advantage ---- */}
      <section className="commute-feature">
        <div className="page-width feature-grid">
          <div className="phone-stage">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="phone">
              <div className="phone-top"><span>9:41</span><span>● ● ▰</span></div>
              <div className="phone-body">
                <div className="mini-head"><BrandLight /><span className="mini-avatar">OO</span></div>
                <p className="mini-greeting">GOOD MORNING, OLABISI</p>
                <h4>Your commute is looking good.</h4>
                <div className="phone-commute-card">
                  <div className="phone-route-map"><span className="map-road r1"/><span className="map-road r2"/><i className="point p1"/><i className="point p2"/><span className="map-car">⌁</span></div>
                  <div className="mini-route"><span><i /> Ajah</span><b>→</b><span><i /> Victoria Island</span></div>
                  <div className="mini-ride-row"><Avatar initials="AB" color="#d96e4b" size={34} /><div><strong>Ade's carpool</strong><small>7:05 AM · 2 seats</small></div><strong>₦1,500</strong></div>
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
              <li><span><Check /></span><div><strong>Your routine, remembered</strong><small>Set a weekday pattern once and let Comuta keep matching.</small></div></li>
              <li><span><Check /></span><div><strong>Familiar faces, less uncertainty</strong><small>Build a regular group from your area, office, estate or school.</small></div></li>
              <li><span><Check /></span><div><strong>Reliable savings, every week</strong><small>Split verified trip costs without surprise surge pricing.</small></div></li>
            </ul>
            <button className="btn btn-lime" onClick={onOpenApp}>Build my commute <ArrowRight size={18} /></button>
          </div>
        </div>
      </section>

      {/* ---- Popular routes ---- */}
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

      {/* ---- Community ---- */}
      <section className="community-section" id="communities">
        <div className="page-width community-grid">
          <div className="community-copy">
            <div className="eyebrow"><HeartHandshake size={15}/> Trust starts with context</div>
            <h2>Strangers become<br /><em>your community.</em></h2>
            <p>Choose matches from groups you already have something in common with, without mistaking affiliation for verification.</p>
            <div className="community-types">
              <span><Building2/>Workplaces</span><span><Home/>Estates</span><span><GraduationCap/>Campuses</span><span><Users/>Associations</span>
            </div>
            <button className="btn btn-dark" onClick={() => onNavigate('/communities')}>Find my community <ArrowRight size={17}/></button>
          </div>
          <div className="community-board">
            <div className="board-head"><span>COMMUNITIES NEAR YOUR ROUTE</span><span><i/> Lagos</span></div>
            <div className="community-card c1"><span className="community-logo">ST</span><div><strong>Comuta at Sterling</strong><small>Workplace · 428 members</small></div><span className="join-chip">12 routes</span></div>
            <div className="community-card c2"><span className="community-logo">LG</span><div><strong>Lekki Gardens</strong><small>Estate · 216 members</small></div><span className="join-chip">8 routes</span></div>
            <div className="community-card c3"><span className="community-logo">VT</span><div><strong>VI Tech Circle</strong><small>Professional · 1,200 members</small></div><span className="join-chip">26 routes</span></div>
            <div className="board-note"><BadgeCheck size={16}/><span>Membership is one trust signal. Every driver and vehicle is verified separately.</span></div>
          </div>
        </div>
      </section>

      {/* ---- Safety ---- */}
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
            <article><span><ShieldCheck/></span><div><h3>Human safety response</h3><p>SOS connects trip context to your contacts and Comuta operations.</p></div></article>
          </div>
        </div>
      </section>

      {/* ---- Stories ---- */}
      <section className="voices-section page-width" id="stories">
        <div className="section-heading centered">
          <div className="eyebrow"><Quote size={15} /> Loved by everyday commuters</div>
          <BlurReveal>
            <h2>Real people. Real routes.<br />Every single <em>morning.</em></h2>
          </BlurReveal>
          <p>Behind every seat on Comuta is a neighbour, a colleague or a coursemate. Here's what sharing the road actually feels like.</p>
        </div>
        <PhotoRail />
        <div className="voices-grid">
          <article className="voice-card">
            <div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div>
            <blockquote>"I was spending almost ₦110k a month on ride-hailing. Now I split my Ajah run with three neighbours from my estate, and we take turns buying puff-puff on Fridays."</blockquote>
            <div className="voice-person"><Avatar initials="TA" color="#d96e4b" size={44} /><div><strong>Tolu Adeyemi</strong><small>Rider · Ajah → Victoria Island</small></div><VerifiedBadge /></div>
          </article>
          <figure className="voice-photo">
            <CarpoolCrewArt />
            <div className="photo-bubble"><Avatar initials="IN" color="#155e6e" size={30} /><span>We're outside Novare Mall 🚗 saved you the window seat!</span></div>
            <figcaption><span className="crew-chip"><Users size={13} /> The Lekki Sunrise Crew</span><span>Same four people, weekdays at 6:45 AM, for 11 months running.</span></figcaption>
          </figure>
          <article className="voice-card">
            <div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div>
            <blockquote>"Same three faces every morning, so there's nothing to negotiate at 6 AM. My mum follows the live trip link, and she knows my crew by name now."</blockquote>
            <div className="voice-person"><Avatar initials="CO" color="#37474f" size={44} /><div><strong>Chidi Okafor</strong><small>Rider · Yaba → Lekki Phase 1</small></div><VerifiedBadge /></div>
          </article>
        </div>
        <div className="voices-trust">
          <FaceDock faces={[
            { initials: 'AB', color: '#d96e4b', name: 'Ade B. · Verified driver' },
            { initials: 'AE', color: '#c98a5a', name: 'Amaka E. · Verified rider' },
            { initials: 'SO', color: '#155942', name: 'Seyi O. · Verified rider' },
            { initials: 'ML', color: '#155e6e', name: 'Musa L. · Verified driver' },
            { initials: 'TA', color: '#37474f', name: 'Tolu A. · Verified rider' },
          ]} />
          <p><strong>4.9/5 average trust rating</strong> from 1,200+ ride reviews last month. Every face above is an identity-verified member.</p>
          <button className="btn btn-primary" onClick={onOpenApp}>Join your commute crew <ArrowRight size={17} /></button>
        </div>
      </section>

      <div className="together-band" aria-hidden="true">
        <SpreadWord word="TOGETHER" />
        <p>One city. One route. One crew at a time.</p>
      </div>

      {/* ---- Driver recruitment ---- */}
      <section className="driver-cta page-width" id="drivers">
        <div className="driver-pattern" />
        <div className="driver-copy"><div className="eyebrow light"><CarFront size={15}/> Already going that way?</div><h2>Your empty seats can<br />help pay for the journey.</h2><p>Share your regular route with verified riders. You set the schedule, seats and fair cost contribution.</p><button className="btn btn-white" onClick={onOpenApp}>Offer a ride <ArrowRight size={17}/></button><div className="driver-voice"><Avatar initials="AB" color="#d96e4b" size={40}/><span>"My fuel money halves itself every week, and the gist in traffic isn't bad either."<b>Ade B. · Shares his Ajah → VI route, 184 trips</b></span></div></div>
        <div className="earn-card"><span className="earn-label">THIS WEEK</span><strong>₦24,600</strong><small>Cost contributions from 9 shared seats</small><div className="earn-bars"><i/><i/><i/><i/><i className="high"/><i className="med"/><i/></div><div className="earn-foot"><span>Mon</span><span>Sun</span></div></div>
      </section>

      {/* ---- Manifesto ---- */}
      <section className="manifesto-section">
        <div className="page-width">
          <div className="eyebrow light"><Sparkles size={15} /> Why Comuta exists</div>
          <ManifestoHighlight text="Every morning, millions of Lagosians crawl through the same traffic, on the same routes, in half-empty cars. Comuta exists to change that, matching neighbours, colleagues and coursemates seat by seat, so the city moves together and nobody rides alone." />
        </div>
      </section>

      {/* ---- Ride / Drive close + mobile-first conversion ---- */}
      <AudienceBanner onOpenApp={onOpenApp} />
      <AppDownload onOpenApp={onOpenApp} />
      <SiteFooter onNavigate={onNavigate} onOpenApp={onOpenApp} onOpenOps={onOpenOps} />
    </main>
  );
}

function BrandLight() {
  return (
    <span className="mini-brand">
      <svg viewBox="0 0 48 48" width="18" height="18"><circle cx="24" cy="24" r="24" fill="#0a3325" /><rect x="16.2" y="13" width="6.8" height="22" rx="3.4" fill="#fff" /><rect x="25" y="13" width="6.8" height="22" rx="3.4" fill="#bdf23f" /></svg>
    </span>
  );
}
