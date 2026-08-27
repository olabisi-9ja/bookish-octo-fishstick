import { useState } from 'react';
import {
  ArrowRight, BadgeCheck, Calculator, CalendarDays, CarFront, Check, CheckCircle2, ChevronRight,
  Clock3, Coins, ExternalLink, HeartHandshake, LocateFixed, MapPin, Menu, Navigation, Repeat2,
  Route, Search, ShieldCheck, Sparkles, Star, Users, X, Zap,
} from 'lucide-react';
import Brand from './components/Brand';
import FigmaSpecViewer from './FigmaSpecViewer';
import { Avatar, VerifiedBadge } from './components/UI';
import { CorridorMapArtwork } from './product/shared';
import { formatNaira } from './platform';

type Props = {
  onNavigate: (path: string) => void;
  onOpenApp: () => void;
  onOpenOps: () => void;
};

export default function Landing({ onNavigate, onOpenApp, onOpenOps }: Props) {
  const [menu, setMenu] = useState(false);
  const [calcDays, setCalcDays] = useState(5);
  const [calcSeats, setCalcSeats] = useState(3);
  const [figmaOpen, setFigmaOpen] = useState(false);

  // Economic calculations (Section 35)
  const pricePerSeat = 1500;
  const weeklyRecovery = calcDays * calcSeats * pricePerSeat;
  const monthlyRecovery = weeklyRecovery * 4;

  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenu(false);
    onNavigate(path);
  };

  return (
    <main className="landing comuta-landing">
      {/* Announcement */}
      <div className="announcement">
        <span><Sparkles size={14} /> COMUTA is now live across Ikorodu ↔ Victoria Island corridor</span>
        <button onClick={onOpenApp}>
          <span>View Available Trips</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Header */}
      <header className="site-header">
        <a href="/" className="logo-link" onClick={go('/')}>
          <Brand tagline />
        </a>

        <nav className={menu ? 'open' : ''}>
          <a href="/how-it-works" onClick={go('/how-it-works')}>How it works</a>
          <a href="/safety" onClick={go('/safety')}>Safety & Hubs</a>
          <a href="/drivers" onClick={go('/drivers')}>Drive & Recover Costs</a>
          <button className="nav-spec" onClick={() => setFigmaOpen(true)}>
            ❖ Figma Spec
          </button>
          <button className="nav-ops" onClick={onOpenOps}>
            Operations Demo
          </button>
          <div className="mobile-nav-actions">
            <button className="btn btn-light" onClick={onOpenApp}>Log in</button>
            <button className="btn btn-primary" onClick={onOpenApp}>Open App</button>
          </div>
        </nav>

        <div className="header-actions">
          <button className="text-button" onClick={() => setFigmaOpen(true)}>
            ❖ Figma Spec
          </button>
          <button className="btn btn-outline btn-small" onClick={onOpenOps}>
            Ops Dashboard
          </button>
          <button className="btn btn-primary btn-small" onClick={onOpenApp}>
            Open COMUTA <ArrowRight size={16} />
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Hero Section (Section 21 Build Spec) */}
      <section className="hero comuta-hero">
        <div className="page-width hero-inner-grid">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <Sparkles size={14} />
              <span>TRANSIT PHILOSOPHY</span>
            </div>

            {/* Locked Hero Headline */}
            <h1 className="hero-title">
              Your commute.<br />
              Shared. Simpler.
            </h1>

            {/* Locked Supporting Copy */}
            <p className="hero-supporting-copy">
              Ride with people already making your journey.
              Book ahead, know your seat, and travel with verified drivers.
            </p>

            {/* CTAs */}
            <div className="hero-cta-group">
              <button className="btn btn-primary cta-main" onClick={onOpenApp}>
                <span>Find your route</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-outline cta-secondary"
                onClick={() => {
                  sessionStorage.setItem('comuta.initial_mode', 'driver');
                  onOpenApp();
                }}
              >
                <CarFront size={17} />
                <span>Share your commute</span>
              </button>
            </div>

            {/* Philosophy quote */}
            <div className="philosophy-quote-strip">
              <blockquote>“My daily commute is already taken care of.”</blockquote>
              <small>Not: “Find a driver right now.”</small>
            </div>
          </div>

          {/* Hero Corridor Preview Card */}
          <div className="hero-preview-col">
            <div className="hero-interactive-card">
              <div className="hic-head">
                <span className="live-dot" />
                <strong>FEATURED LAUNCH CORRIDOR</strong>
                <span className="corridor-status-tag">Morning Window · 7:00 AM</span>
              </div>

              <div className="hic-map-box">
                <CorridorMapArtwork
                  fromLabel="Ikorodu Hub"
                  toLabel="Victoria Island Hub"
                />
              </div>

              <div className="hic-featured-match">
                <div className="hfm-time">
                  <strong>7:00 AM</strong>
                  <span>~8:05 AM arrival</span>
                </div>
                <div className="hfm-driver">
                  <strong>Adebayo K. <BadgeCheck size={14} className="verified-badge-icon" /></strong>
                  <span>Verified · <strong>98% completion</strong></span>
                  <small>Toyota Corolla · ABC 123 XY</small>
                </div>
                <div className="hfm-price">
                  <strong>₦1,500</strong>
                  <small>/ seat</small>
                  <span className="badge-seats">2 seats left</span>
                </div>
              </div>

              <button className="btn btn-primary btn-block" onClick={onOpenApp}>
                <span>Reserve seat on this commute ➔</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Storytelling: Plan → Match → Reserve → Commute (Section 21) */}
      <section className="visual-storytelling page-width">
        <div className="section-head text-center">
          <span className="section-eyebrow">HOW IT WORKS</span>
          <h2>The COMUTA Commute Cycle</h2>
          <p>Built as a reliable transportation calendar, not an on-demand taxi app.</p>
        </div>

        <div className="storytelling-steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon"><CalendarDays size={24} /></div>
            <h3>Plan</h3>
            <p>Choose your origin hub (e.g. Ikorodu Hub Main Gate), destination, and preferred arrival window.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon"><Users size={24} /></div>
            <h3>Match</h3>
            <p>Compare verified drivers already driving your route. Review their 98%+ on-time completion rates.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon"><ShieldCheck size={24} /></div>
            <h3>Reserve</h3>
            <p>Lock your seat with transparent Paystack payment and receive your 4-digit trip PIN (`4827`).</p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon"><Navigation size={24} /></div>
            <h3>Commute</h3>
            <p>Meet at the designated well-lit hub gate, verify the PIN, track live on the map, and arrive calmly.</p>
          </div>
        </div>
      </section>

      {/* Driver Acquisition & Economics Calculator (Section 35) */}
      <section className="driver-economics-section">
        <div className="page-width de-grid">
          <div className="de-copy">
            <div className="eyebrow-pill"><Coins size={14} /><span>FOR DRIVERS</span></div>
            <h2>Turn your empty seats into commute savings.</h2>
            <p>
              You're already driving Ikorodu to Victoria Island every weekday.
              Why carry empty seats when verified colleagues and neighbours are heading the exact same way?
            </p>

            <ul className="de-bullets">
              <li><CheckCircle2 size={16} /><span>Not gig driving — you drive your own schedule and route</span></li>
              <li><CheckCircle2 size={16} /><span>T-8 commitment guarantees passengers know you're coming</span></li>
              <li><CheckCircle2 size={16} /><span>Direct bank settlement every Friday to cover fuel and maintenance</span></li>
            </ul>

            <button
              className="btn btn-primary"
              onClick={() => {
                sessionStorage.setItem('comuta.initial_mode', 'driver');
                onOpenApp();
              }}
            >
              <span>Publish your commute route ➔</span>
            </button>
          </div>

          {/* Calculator Card */}
          <div className="economics-calculator-card">
            <div className="ecc-header">
              <Calculator size={20} />
              <div>
                <h3>Commute Cost Recovery Calculator</h3>
                <small>Based on Ikorodu ↔ VI standard seat contribution (₦1,500)</small>
              </div>
            </div>

            <div className="ecc-controls">
              <div className="ecc-field">
                <div className="ecc-lbl"><span>Days commuting per week:</span><strong>{calcDays} days</strong></div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={calcDays}
                  onChange={(e) => setCalcDays(parseInt(e.target.value, 10))}
                />
              </div>

              <div className="ecc-field">
                <div className="ecc-lbl"><span>Empty seats shared:</span><strong>{calcSeats} seats</strong></div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={calcSeats}
                  onChange={(e) => setCalcSeats(parseInt(e.target.value, 10))}
                />
              </div>
            </div>

            <div className="ecc-output-box">
              <div className="output-row">
                <span>Weekly Fuel Recovery</span>
                <strong>{formatNaira(weeklyRecovery)}</strong>
              </div>
              <div className="output-row highlight">
                <span>Estimated Monthly Offset</span>
                <strong className="monthly-val">{formatNaira(monthlyRecovery)}</strong>
              </div>
              <small className="calc-note">Direct deposit to your Nigerian bank account every Friday.</small>
            </div>
          </div>
        </div>
      </section>

      {/* Designated Well-Lit Hubs Section */}
      <section className="hubs-network-section page-width">
        <div className="section-head text-center">
          <span className="section-eyebrow">NETWORK ARCHITECTURE</span>
          <h2>Designated, Well-Lit Pickup Hubs</h2>
          <p>Never wonder where to stand. Verified waiting bays at major transit gateways.</p>
        </div>

        <div className="hubs-card-grid">
          <div className="hub-info-card">
            <MapPin size={22} className="hub-icon" />
            <h3>Ikorodu Hub</h3>
            <p>Main Gate · Well-lit pickup point & verified waiting bay</p>
            <span className="hub-corridor-tag">Expressway Gateway</span>
          </div>

          <div className="hub-info-card">
            <MapPin size={22} className="hub-icon" />
            <h3>Victoria Island Hub</h3>
            <p>Ozumba Mbadiwe & Sterling Towers · Commuter drop-off</p>
            <span className="hub-corridor-tag">Financial District</span>
          </div>

          <div className="hub-info-card">
            <MapPin size={22} className="hub-icon" />
            <h3>Ikeja Hub</h3>
            <p>Maryland Mall & Allen Avenue Transit Junction</p>
            <span className="hub-corridor-tag">Mainland Commercial</span>
          </div>

          <div className="hub-info-card">
            <MapPin size={22} className="hub-icon" />
            <h3>Berger Hub</h3>
            <p>Lagos-Ibadan Expressway Interchange Bay</p>
            <span className="hub-corridor-tag">Inbound Gateway</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="page-width footer-grid">
          <div>
            <Brand tagline />
            <p className="footer-tagline">
              Nigeria’s corridor-based shared commute platform. Your daily commute is already taken care of.
            </p>
          </div>

          <div>
            <h4>Platform</h4>
            <a onClick={onOpenApp}>Find a commute</a>
            <a onClick={onOpenApp}>Offer empty seats</a>
            <a onClick={() => setFigmaOpen(true)}>Figma build spec</a>
            <a onClick={onOpenOps}>Operations control</a>
          </div>

          <div>
            <h4>Corridors</h4>
            <a onClick={onOpenApp}>Ikorodu ↔ Victoria Island</a>
            <a onClick={onOpenApp}>Berger ↔ Victoria Island</a>
            <a onClick={onOpenApp}>Ikeja ↔ Victoria Island</a>
            <a onClick={onOpenApp}>Ajah ↔ Victoria Island</a>
          </div>

          <div>
            <h4>Trust & Legal</h4>
            <a href="/safety" onClick={go('/safety')}>Safety & Hub verification</a>
            <a href="/privacy" onClick={go('/privacy')}>Privacy (NDPR compliant)</a>
            <a href="/terms" onClick={go('/terms')}>Terms of service</a>
            <a href="/help" onClick={go('/help')}>Help centre</a>
          </div>
        </div>

        <div className="page-width footer-bottom">
          <span>© 2026 COMUTA Technologies Ltd. All rights reserved.</span>
          <span className="ndpr"><ShieldCheck size={13} /> NDPR Verified · Bank-grade Paystack Escrow</span>
        </div>
      </footer>

      {/* Figma Specification Viewer Modal */}
      {figmaOpen && (
        <FigmaSpecViewer
          onClose={() => setFigmaOpen(false)}
          onOpenRider={onOpenApp}
          onOpenDriver={onOpenApp}
          onOpenOps={onOpenOps}
        />
      )}
    </main>
  );
}
