import { useState } from 'react';
import {
  ArrowRight, BadgeCheck, Check, CheckCircle2, ChevronRight, Copy, ExternalLink, Eye,
  FileCode, Layers, Layout, Palette, ShieldCheck, Sparkles, Wand2, X,
} from 'lucide-react';
import {
  ConfirmedBookingIllustration, DriverCommitmentIllustration, EmptyRoadIllustration,
  HubSafetyIllustration, RecoveryIllustration,
} from './components/Illustrations';

type PageTab =
  | '00-cover'
  | '01-foundations'
  | '02-components'
  | '03-illustrations'
  | '04-auth'
  | '05-rider'
  | '06-driver'
  | '07-shared'
  | '08-ops'
  | '09-web'
  | '10-flows';

const figmaPages = [
  { id: '00-cover', num: '00', title: 'Cover / UX Principles' },
  { id: '01-foundations', num: '01', title: 'Foundations' },
  { id: '02-components', num: '02', title: 'Components' },
  { id: '03-illustrations', num: '03', title: 'Illustrations' },
  { id: '04-auth', num: '04', title: 'Mobile / Auth' },
  { id: '05-rider', num: '05', title: 'Mobile / Rider' },
  { id: '06-driver', num: '06', title: 'Mobile / Driver' },
  { id: '07-shared', num: '07', title: 'Mobile / Shared' },
  { id: '08-ops', num: '08', title: 'Operations Dashboard' },
  { id: '09-web', num: '09', title: 'Public Web' },
  { id: '10-flows', num: '10', title: 'Prototype / User Flows' },
] as const;

export default function FigmaSpecViewer({
  onClose,
  onOpenRider,
  onOpenDriver,
  onOpenOps,
}: {
  onClose: () => void;
  onOpenRider: () => void;
  onOpenDriver: () => void;
  onOpenOps: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PageTab>('00-cover');
  const [copied, setCopied] = useState(false);

  const copySpec = () => {
    navigator.clipboard?.writeText('COMUTA — Product UX/UI Direction Locked Specification');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="figma-viewer-overlay">
      <div className="figma-viewer-container">
        {/* Top bar */}
        <header className="figma-header">
          <div className="figma-brand-group">
            <span className="figma-icon-badge">❖</span>
            <div>
              <div className="title-line">
                <h2>COMUTA — Figma Build Specification</h2>
                <span className="locked-tag">DIRECTION LOCKED</span>
              </div>
              <p>Master UX/UI Architecture, Design Tokens & 366-Screen Taxonomy</p>
            </div>
          </div>

          <div className="figma-actions">
            <button className="btn btn-outline btn-small" onClick={copySpec}>
              {copied ? '✓ Copied spec link' : 'Copy build spec'}
            </button>
            <button className="figma-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Horizontal Page Tabs (00 to 10) */}
        <nav className="figma-page-tabs">
          {figmaPages.map((page) => (
            <button
              key={page.id}
              className={`f-tab ${activeTab === page.id ? 'active' : ''}`}
              onClick={() => setActiveTab(page.id as PageTab)}
            >
              <span className="tab-num">{page.num}</span>
              <span className="tab-name">{page.title}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="figma-tab-body">
          {activeTab === '00-cover' && (
            <div className="f-pane cover-pane">
              <div className="hero-quote-card">
                <span className="quote-eyebrow">PRODUCT PHILOSOPHY</span>
                <blockquote>
                  “My daily commute is already taken care of.”
                </blockquote>
                <p className="not-quote">NOT: “Find a driver right now.”</p>
              </div>

              <div className="core-journey-strip">
                <span className="cj-label">CORE COMMUTE JOURNEY</span>
                <div className="cj-steps">
                  {['Plan', 'Compare', 'Trust', 'Reserve', 'Confirm', 'Prepare', 'Pickup', 'Track', 'Complete', 'Repeat'].map(
                    (step, idx, arr) => (
                      <span key={step} className="cj-step">
                        <strong>{step}</strong>
                        {idx < arr.length - 1 && <span className="arrow">➔</span>}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="architecture-three-surfaces">
                <div className="surface-card">
                  <span className="sc-tag">SURFACE 1</span>
                  <h3>Mobile Application</h3>
                  <p>Single codebase with seamless Rider and Driver modes. Shared authentication, KYC, payments, and trip states.</p>
                  <div className="surface-actions">
                    <button className="btn btn-light btn-small" onClick={onOpenRider}>Launch Rider Mode</button>
                    <button className="btn btn-light btn-small" onClick={onOpenDriver}>Launch Driver Mode</button>
                  </div>
                </div>

                <div className="surface-card">
                  <span className="sc-tag">SURFACE 2</span>
                  <h3>Operations Dashboard</h3>
                  <p>Operations-first control center answering “What needs intervention?” with live corridor tracking and at-risk recovery.</p>
                  <button className="btn btn-light btn-small" onClick={onOpenOps}>Launch Operations</button>
                </div>

                <div className="surface-card">
                  <span className="sc-tag">SURFACE 3</span>
                  <h3>Public Web Platform</h3>
                  <p>Brand storytelling, route discovery, corridor demand capture, driver economics calculator, and safety center.</p>
                  <button className="btn btn-light btn-small" onClick={onClose}>View Public Web</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === '01-foundations' && (
            <div className="f-pane foundations-pane">
              <h3>Design System Foundations</h3>
              <p>Core tokens ensuring consistent scale, contrast, and elevation across all devices.</p>

              <div className="token-category">
                <h4>Color Palette</h4>
                <div className="color-swatches">
                  <div className="swatch" style={{ background: '#0C392C' }}>
                    <strong>#0C392C</strong><span>Forest 900 (Primary Brand)</span>
                  </div>
                  <div className="swatch" style={{ background: '#1C604C' }}>
                    <strong>#1C604C</strong><span>Forest 700 (Surfaces)</span>
                  </div>
                  <div className="swatch" style={{ background: '#CCF06A', color: '#0C392C' }}>
                    <strong>#CCF06A</strong><span>Lime (Active & Live State)</span>
                  </div>
                  <div className="swatch" style={{ background: '#F7F6EF', color: '#17221E' }}>
                    <strong>#F7F6EF</strong><span>Warm Cream (Background)</span>
                  </div>
                  <div className="swatch" style={{ background: '#17221E' }}>
                    <strong>#17221E</strong><span>Deep Ink (Typography)</span>
                  </div>
                  <div className="swatch" style={{ background: '#C7473E' }}>
                    <strong>#C7473E</strong><span>Alert Red (At-Risk / SOS)</span>
                  </div>
                </div>
              </div>

              <div className="token-category">
                <h4>Typography Scale</h4>
                <div className="type-spec-list">
                  <div className="type-row">
                    <span className="type-name">Hero / Display</span>
                    <strong style={{ fontSize: '32px', fontWeight: 800 }}>Your commute. Shared. Simpler.</strong>
                    <small>Manrope 800 · 32–40px · −1.2px</small>
                  </div>
                  <div className="type-row">
                    <span className="type-name">Section Title</span>
                    <strong style={{ fontSize: '20px', fontWeight: 800 }}>Ikorodu Hub ➔ Victoria Island Hub</strong>
                    <small>Manrope 700 · 20–24px</small>
                  </div>
                  <div className="type-row">
                    <span className="type-name">Body / Detail</span>
                    <span style={{ fontSize: '15px' }}>Ride with people already making your journey. Book ahead, know your seat.</span>
                    <small>DM Sans 400/500 · 15px · 1.5</small>
                  </div>
                </div>
              </div>

              <div className="token-category">
                <h4>Motion Hierarchy (Section 23)</h4>
                <div className="motion-grid">
                  <div className="motion-card">
                    <strong>Level 1 — Micro</strong>
                    <span>120–180ms</span>
                    <small>Button presses, toggles, seat selection scale</small>
                  </div>
                  <div className="motion-card">
                    <strong>Level 2 — Transition</strong>
                    <span>200–400ms</span>
                    <small>Bottom sheets, modal cards, corridor tabs</small>
                  </div>
                  <div className="motion-card">
                    <strong>Level 3 — Story / State</strong>
                    <span>500–1200ms</span>
                    <small>Booking confirmation lock, T-8 checkmark, recovery crossfade</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '02-components' && (
            <div className="f-pane components-pane">
              <h3>Figma Component Library</h3>
              <p>Reusable master components mapped to the production UI.</p>

              <div className="component-showcase-grid">
                <div className="comp-item">
                  <span className="comp-label">Trip Card (Section 6)</span>
                  <div className="mock-box">
                    <div className="demo-trip-card">
                      <div className="dtc-time"><strong>7:00 AM</strong><span>~8:05 AM</span></div>
                      <div className="dtc-driver">
                        <span>Adebayo K.</span>
                        <small className="pill">Verified · 98% completion</small>
                      </div>
                      <div className="dtc-car">Toyota Corolla · ABC 123 XY</div>
                      <div className="dtc-price"><strong>₦1,500 / seat</strong><span className="seats">2 seats left</span></div>
                    </div>
                  </div>
                  <small>Strict 3-second decision hierarchy: TIME ➔ TRUST ➔ VEHICLE ➔ PRICE ➔ AVAILABILITY</small>
                </div>

                <div className="comp-item">
                  <span className="comp-label">Hub Marker & Bay Tag</span>
                  <div className="mock-box">
                    <div className="hub-marker-demo">
                      <span className="dot" />
                      <div><strong>Ikorodu Hub</strong><small>Main Gate · Well-lit pickup point</small></div>
                    </div>
                  </div>
                  <small>Clear designated waiting bays for verified commuter pickups</small>
                </div>

                <div className="comp-item">
                  <span className="comp-label">Trip PIN Verification Box</span>
                  <div className="mock-box">
                    <div className="pin-demo-box">
                      <span>TRIP PIN</span>
                      <strong>4827</strong>
                      <small>Driver verifies before departure</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '03-illustrations' && (
            <div className="f-pane illustrations-pane">
              <h3>COMUTA Illustration Library (Section 22)</h3>
              <p>Geometric, minimal, modern, slightly human, Nigerian urban context. No childish cartoon aesthetic.</p>

              <div className="illustration-gallery-grid">
                <div className="ill-card">
                  <ConfirmedBookingIllustration size={140} />
                  <strong>Booking Confirmed</strong>
                  <small>Seat locks into place with corridor progress checkmark</small>
                </div>

                <div className="ill-card">
                  <DriverCommitmentIllustration size={140} />
                  <strong>Driver Commitment (T-8)</strong>
                  <small>Steering wheel geometry with verified commuter shield</small>
                </div>

                <div className="ill-card">
                  <RecoveryIllustration size={140} />
                  <strong>Route Recovery</strong>
                  <small>Fading cancelled path with verified alternative reassurance</small>
                </div>

                <div className="ill-card">
                  <EmptyRoadIllustration size={140} />
                  <strong>Empty Corridor</strong>
                  <small>Serene morning Lagos road vanishing towards horizon</small>
                </div>

                <div className="ill-card">
                  <HubSafetyIllustration size={140} />
                  <strong>Hub Safety</strong>
                  <small>Well-lit gateway beacon with verified bay access</small>
                </div>
              </div>
            </div>
          )}

          {activeTab === '05-rider' && (
            <div className="f-pane flow-pane">
              <h3>Mobile Rider MVP Spine (Section 26)</h3>
              <p>Core Rider Journey: Home ➔ Plan ➔ Search ➔ Trip Detail ➔ Booking ➔ Payment ➔ Confirmed ➔ Pickup ➔ Active Trip ➔ Complete</p>
              
              <div className="spine-steps-vertical">
                <div className="spine-step-row">
                  <span className="step-badge">1</span>
                  <div>
                    <strong>Rider Home (Section 3)</strong>
                    <p>Header "Good morning, Olabisi", Hero Next Commute Card ("Ikorodu ➔ Victoria Island, Tomorrow 7:00 AM, CONFIRMED"), Plan a commute input, Your routes, Recent trips.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">2</span>
                  <div>
                    <strong>Plan a Commute (Section 4)</strong>
                    <p>Transportation planning interface: FROM Ikorodu Hub, TO Victoria Island Hub, WHEN Tomorrow | 7:00 AM, TRIP TYPE One-off | Recurring, Fixed bottom CTA.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">3</span>
                  <div>
                    <strong>Available Trips / Search Results (Section 5 & 6)</strong>
                    <p>Top bar, 35-40% Corridor map showing Ikorodu Hub ──── route ──── Victoria Island Hub, 4 shared trips, Earliest / Best match filters, strict 3-second decision cards.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">4</span>
                  <div>
                    <strong>Trip Detail (Section 7)</strong>
                    <p>7:00 AM ~8:05 AM (~1 hr 5 min), Adebayo K. (98% completion, 97% on-time, VERIFIED), Toyota Corolla Silver ABC 123 XY, Ikorodu Hub Main Gate, Fixed Reserve CTA.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">5</span>
                  <div>
                    <strong>Booking Review & Payment (Sections 8 & 9)</strong>
                    <p>Ikorodu Hub ↓ Victoria Island Hub, Adebayo K., ₦1,500 with Paystack, disabled "Processing…" button state, and Confirmed illustration.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">6</span>
                  <div>
                    <strong>Pickup Experience & Active Trip (Sections 12 & 13)</strong>
                    <p>Meet your driver at Main Gate, Toyota Corolla Silver ABC 123 XY, Trip PIN 4827, live corridor map with ETA 32 min, persistent Share trip & SOS.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">7</span>
                  <div>
                    <strong>Trip Completion & Recurring Route (Sections 14 & 15)</strong>
                    <p>"You're here", 5-star rating, optional issue report, receipt breakdown, and transportation subscription manager with "Skip tomorrow".</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '06-driver' && (
            <div className="f-pane flow-pane">
              <h3>Mobile Driver MVP Spine (Section 26)</h3>
              <p>Core Driver Journey: Home ➔ Publish ➔ Booking received ➔ T-8 confirmation ➔ Passenger list ➔ Active trip ➔ Complete</p>

              <div className="spine-steps-vertical">
                <div className="spine-step-row">
                  <span className="step-badge">1</span>
                  <div>
                    <strong>Driver Home (Section 16)</strong>
                    <p>“Your commute is organized and your empty seats are helping cover the cost.” Next commute, 3/4 seats booked, Cost recovery ₦4,500 this month, Publish a commute CTA.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">2</span>
                  <div>
                    <strong>T-8 Commitment Screen (Section 10)</strong>
                    <p>Signature interaction: "Your trip is tomorrow. You have passengers counting on this commute." Route Ikorodu ➔ Victoria Island, 7:00 AM, 3 riders, Confirm by 11:00 PM (or countdown 01:42:18). Confirm trip ➔ checkmark ➔ "You're committed".</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">3</span>
                  <div>
                    <strong>Driver Publishing (Section 17)</strong>
                    <p>FROM Ikorodu Hub, TO Victoria Island Hub, 7:00 AM, 3 seats, ₦1,500/seat, One-off | Recurring schedule.</p>
                  </div>
                </div>

                <div className="spine-step-row">
                  <span className="step-badge">4</span>
                  <div>
                    <strong>Driver Reliability System (Section 18)</strong>
                    <p>Operational score: 98% reliability, 98% completion, 97% on-time, 1 late cancellation, 0 no-shows, actionable tips.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '07-shared' && (
            <div className="f-pane shared-pane">
              <h3>Shared Architecture & Recovery Philosophy</h3>
              <div className="philosophy-highlight-box">
                <h4>Section 11: Signature Recovery Philosophy</h4>
                <p className="quote">“Don’t report a failure without presenting the next action.”</p>
                <p>Never show a dead-end "Driver cancelled". Instead: "Something changed. Your driver can no longer make this commute. We're finding another option." with [View alternatives] or [Request instant refund].</p>
              </div>

              <div className="screen-inventory-table">
                <h4>Master Mobile Screen Scope (210 screens/states)</h4>
                <ul>
                  <li><strong>01-14 Entry & Auth:</strong> Splash, Onboarding 1-4, Phone OTP (4827), Email, Forgot password</li>
                  <li><strong>15-26 KYC & Identity:</strong> NIN entry, Driver license upload, Vehicle registration, Verification approved/retry</li>
                  <li><strong>27-30 Role & Switch:</strong> Ride / Ride+Drive selector, switch mode sheet</li>
                  <li><strong>31-42 Planning & Demand:</strong> Hub selector, Recurring schedule, Route request for unmet demand</li>
                  <li><strong>43-51 Search & Matches:</strong> Available trips corridor map, 3-second hierarchy cards, Driver trust profile</li>
                  <li><strong>52-61 Booking & Pay:</strong> Seat selector, Paystack checkout, Processing state, Confirmed motion</li>
                  <li><strong>62-72 Commitment & At-Risk:</strong> T-8 deadline countdown, At-risk alert, Alternative driver reassignment, Refund processing</li>
                  <li><strong>73-82 Pre-Departure & Pickup:</strong> Hub gate instructions, Meet driver, Trip PIN (4827), Driver arrived</li>
                  <li><strong>83-95 Active Trip:</strong> 80%+ map, live route progress, persistent Share trip & SOS</li>
                  <li><strong>96-105 Completion & History:</strong> "You're here", 5-star rating, Receipt breakdown, Trip history</li>
                  <li><strong>106-118 Recurring Routes:</strong> Commute subscription calendar, Skip tomorrow, Pause route, Weekly overview</li>
                  <li><strong>119-134 Account & Settings:</strong> Trusted contacts, Emergency relations, NDPR data privacy</li>
                  <li><strong>135-210 Driver Mode:</strong> Home, Publish route, T-8 commitment, Reliability, Cost recovery, Payouts</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === '08-ops' && (
            <div className="f-pane ops-pane">
              <h3>Operations Dashboard Architecture (Section 19 & 20)</h3>
              <p>Operations-first command center answering: “What needs intervention?”</p>

              <div className="ops-intervention-checklist">
                <div className="oil-item"><strong>12</strong><span>Active trips on corridors</span></div>
                <div className="oil-item danger"><strong>3</strong><span>At-risk trips (driver alerts)</span></div>
                <div className="oil-item warn"><strong>7</strong><span>Unconfirmed drivers (T-8 check)</span></div>
                <div className="oil-item danger"><strong>2</strong><span>Safety incidents under review</span></div>
                <div className="oil-item"><strong>4</strong><span>Failed payments requiring follow-up</span></div>
              </div>

              <div className="seven-families-grid">
                <div className="family-card"><strong>1. Operations</strong><span>Overview, Live trips, At-risk trips, Alerts</span></div>
                <div className="family-card"><strong>2. Marketplace</strong><span>Users, Drivers, Vehicles, Hubs, Routes, Bookings, Trips</span></div>
                <div className="family-card"><strong>3. Money</strong><span>Transactions, Refunds, Payouts, Ledger, Reconciliation</span></div>
                <div className="family-card"><strong>4. Safety</strong><span>Incidents, SOS, Appeals</span></div>
                <div className="family-card"><strong>5. Quality</strong><span>Reliability, Support</span></div>
                <div className="family-card"><strong>6. Intelligence</strong><span>Analytics, Demand, Utilization</span></div>
                <div className="family-card"><strong>7. Configuration</strong><span>Platform settings, Notifications, Admins, Audit logs</span></div>
              </div>
            </div>
          )}

          {activeTab === '09-web' && (
            <div className="f-pane web-pane">
              <h3>Public Web App Architecture (Section 21, 34–37)</h3>
              <p>Sells the idea of shared commuting and captures corridor demand.</p>

              <div className="web-blueprint-grid">
                <div className="wb-card">
                  <h4>Hero Proposition</h4>
                  <strong># Your commute. Shared. Simpler.</strong>
                  <p>Ride with people already making your journey. Book ahead, know your seat, and travel with verified drivers.</p>
                  <small>CTAs: Find your route · Share your commute</small>
                </div>

                <div className="wb-card">
                  <h4>Visual Storytelling</h4>
                  <strong>Plan ➔ Match ➔ Reserve ➔ Commute</strong>
                  <p>Step-by-step corridor walkthrough explaining why scheduled commuting beats instant taxi-hailing for reliability.</p>
                </div>

                <div className="wb-card">
                  <h4>Driver Economics Calculator</h4>
                  <strong>Turn your empty seats into commute savings</strong>
                  <p>Calculates fuel offset (e.g. ₦4,500/week or ₦18,000/month) for Lagos drivers driving Ikorodu ↔ VI or Berger ↔ VI.</p>
                </div>

                <div className="wb-card">
                  <h4>Hub & Corridor Safety</h4>
                  <strong>Designated Well-Lit Pickup Hubs</strong>
                  <p>Main gate waiting bays, masked calling, PIN verification (4827), and live corridor trip monitoring.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === '10-flows' && (
            <div className="f-pane flows-pane">
              <h3>Interactive Prototype User Flows</h3>
              <p>Launch live test flows directly in the application:</p>

              <div className="prototype-launch-grid">
                <div className="pl-card" onClick={onOpenRider} role="button" tabIndex={0}>
                  <span className="badge-flow">FLOW A</span>
                  <h4>Rider Complete Spine</h4>
                  <p>Home ➔ Plan ➔ Available Trips ➔ Trip Detail ➔ Booking Review ➔ Paystack ➔ Confirmed ➔ Pickup ➔ Active Trip ➔ Arrive</p>
                  <button className="btn btn-primary btn-block">Launch Rider Flow ➔</button>
                </div>

                <div className="pl-card" onClick={onOpenDriver} role="button" tabIndex={0}>
                  <span className="badge-flow">FLOW B</span>
                  <h4>Driver Commitment & Publishing</h4>
                  <p>Driver Home ➔ T-8 Screen ("Confirm within 01:42:18") ➔ Confirm Checkmark Motion ➔ Publish Commute ➔ PIN verification</p>
                  <button className="btn btn-primary btn-block">Launch Driver Flow ➔</button>
                </div>

                <div className="pl-card" onClick={onOpenOps} role="button" tabIndex={0}>
                  <span className="badge-flow">FLOW C</span>
                  <h4>Operations At-Risk Recovery</h4>
                  <p>Intervention Overview ➔ At-Risk Table ➔ Dispatch Recover Workbench ➔ Reassign Backup Supply ➔ Resolve</p>
                  <button className="btn btn-primary btn-block">Launch Operations ➔</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
