import { useState } from 'react';
import {
  Apple, ArrowRight, BadgeCheck, CarFront, CheckCircle2, Menu, Phone, Play, ScanLine,
  Search, ShieldCheck, Sparkles, X,
} from 'lucide-react';
import Brand, { Mark } from './Brand';

/* ──────────────────────────────────────────────────────────────────────────
   Comuta marketing site — shared UI used by the landing page and every
   marketing/company page so the redesigned experience stays consistent.
   ────────────────────────────────────────────────────────────────────────── */

type NavigateProps = {
  onNavigate: (path: string) => void;
  onOpenApp: () => void;
  onOpenOps: () => void;
};

/* ── Branded, deterministic QR-style mark (prototype-safe, no API key) ── */
const QR_SIZE = 25;

function buildQrMatrix() {
  const matrix: boolean[][] = Array.from({ length: QR_SIZE }, () => Array(QR_SIZE).fill(false));
  const pseudo = (x: number, y: number) => {
    const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return v - Math.floor(v) > 0.5;
  };
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      const inFinder = (x < 8 && y < 8) || (x >= QR_SIZE - 8 && y < 8) || (x < 8 && y >= QR_SIZE - 8);
      if (!inFinder && (x === 6 || y === 6)) {
        matrix[y][x] = x % 2 === y % 2;
      } else if (!inFinder) {
        matrix[y][x] = pseudo(x, y);
      }
    }
  }
  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        matrix[oy + y][ox + x] = x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(QR_SIZE - 7, 0);
  drawFinder(0, QR_SIZE - 7);
  return matrix;
}

const QR_MATRIX = buildQrMatrix();

export function QrMark({ size = 190 }: { size?: number }) {
  const cell = size / QR_SIZE;
  return (
    <svg className="com-qr-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Comuta app download code">
      <rect width={size} height={size} rx="10" fill="#fff" />
      {QR_MATRIX.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill="#0a3325"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

/* ── Sticky, shared header with bolt-style audience split in nav/actions ── */
export function SiteHeader({ onNavigate, onOpenApp, onOpenOps }: NavigateProps) {
  const [menu, setMenu] = useState(false);
  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenu(false);
    onNavigate(path);
  };

  return (
    <div className="com-header-wrap">
      <div className="announcement">
        <span><Sparkles size={14} /> Comuta is opening selected Lagos corridors</span>
        <button onClick={onOpenApp}>Join the early community <ArrowRight size={14} /></button>
      </div>
      <header className="site-header">
        <a href="/" className="logo-link" onClick={go('/')}><Brand /></a>
        <nav className={menu ? 'open' : ''}>
          <a href="/how-it-works" onClick={go('/how-it-works')}>How it works</a>
          <a href="/drivers" onClick={go('/drivers')}>Drive &amp; earn</a>
          <a href="/safety" onClick={go('/safety')}>Safety</a>
          <a href="/communities" onClick={go('/communities')}>Communities</a>
          <button className="nav-ops" onClick={() => { setMenu(false); onOpenOps(); }}>Operations demo</button>
          <div className="mobile-nav-actions">
            <button className="btn btn-light" onClick={onOpenApp}>Log in</button>
            <button className="btn btn-primary" onClick={onOpenApp}>Get started</button>
          </div>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={onOpenApp}>Log in</button>
          <button className="btn btn-primary btn-small" onClick={onOpenApp}>Get Comuta <ArrowRight size={16} /></button>
          <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        </div>
      </header>
    </div>
  );
}

/* ── Ride / Drive segmentation banner (Bolt-style split conversion) ── */
export function AudienceBanner({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section className="com-audience-banner page-width">
      <div className="com-audience-heading">
        <div className="com-eyebrow">
          <Sparkles size={15} /> Choose your path
        </div>
        <h2>One app. <em>Two ways to move.</em></h2>
      </div>
      <div className="com-audience-grid">
        <article className="com-audience-card">
          <span className="com-audience-icon ride"><Search size={24} /></span>
          <div>
            <h3>I want a ride</h3>
            <p>Compare verified commuters on your route, see prices before you book, and build a week that runs itself.</p>
          </div>
          <button className="btn btn-primary" onClick={onOpenApp}>Find a ride <ArrowRight size={17} /></button>
        </article>
        <article className="com-audience-card">
          <span className="com-audience-icon drive"><CarFront size={24} /></span>
          <div>
            <h3>I want to earn</h3>
            <p>Turn the empty seats you already drive into reliable weekly contribution — you set the schedule and the fare.</p>
          </div>
          <button className="btn btn-lime" onClick={onOpenApp}>Start earning <ArrowRight size={17} /></button>
        </article>
      </div>
    </section>
  );
}

/* ── Mobile-first conversion close: large QR + store steps ── */
export function AppDownload({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section className="com-app-section">
      <div className="com-app-orbit one" />
      <div className="com-app-orbit two" />
      <div className="page-width com-app-inner">
        <div className="com-app-copy">
          <div className="com-eyebrow light"><Phone size={15} /> Your commute, in your pocket</div>
          <h2>Download the app.<br /><em>Start moving together.</em></h2>
          <p>Scan the code, verify once, and you're ready to ride or drive the same trusted corridors — no paper, no confusion.</p>
          <div className="com-app-steps">
            <div className="com-app-step"><span><ScanLine size={21} /></span><div><strong>Scan the code</strong><small>Use your phone camera or the button below.</small></div></div>
            <div className="com-app-step"><span><BadgeCheck size={21} /></span><div><strong>Verify your identity</strong><small>One quick check and your trust profile is live.</small></div></div>
            <div className="com-app-step"><span><CheckCircle2 size={21} /></span><div><strong>Ride or drive</strong><small>Find matches, share costs and manage every trip.</small></div></div>
          </div>
          <div className="com-app-store-row">
            <button className="btn btn-lime" onClick={onOpenApp}>Text me a download link <ArrowRight size={17} /></button>
            <span className="com-store-small">or scan the code on the right →</span>
          </div>
        </div>
        <div className="com-app-phone">
          <div className="com-qr-wrap">
            <QrMark size={188} />
            <span>SCAN TO GET COMUTA</span>
          </div>
          <div className="com-qr-note">
            <span className="com-store-pill"><Apple size={17} /> App Store</span>
            <span className="com-store-pill"><Play size={17} /> Google Play</span>
            <span className="com-qr-safety"><ShieldCheck size={14} /> Security built in</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Shared, consistent footer across every public page ── */
export function SiteFooter({ onNavigate, onOpenApp, onOpenOps }: NavigateProps) {
  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(path);
  };
  return (
    <footer>
      <div className="page-width footer-main">
        <div className="footer-brand">
          <Brand inverse />
          <p>Trusted recurring carpools for the routes Nigerians travel every day.</p>
          <span>Lagos, Nigeria 🇳🇬</span>
        </div>
        <div>
          <h4>Ride</h4>
          <a onClick={onOpenApp}>Find a ride</a>
          <a onClick={onOpenApp}>My commute</a>
          <a href="/communities" onClick={go('/communities')}>Communities</a>
          <a href="/safety" onClick={go('/safety')}>Safety</a>
        </div>
        <div>
          <h4>Drive</h4>
          <a href="/drivers" onClick={go('/drivers')}>Offer a ride</a>
          <a href="/drivers" onClick={go('/drivers')}>Driver requirements</a>
          <a onClick={onOpenApp}>Earnings</a>
          <a href="/safety" onClick={go('/safety')}>Verification</a>
        </div>
        <div>
          <h4>Comuta</h4>
          <a href="/about" onClick={go('/about')}>About</a>
          <a href="/help" onClick={go('/help')}>Help centre</a>
          <a onClick={onOpenOps}>Operations</a>
          <a href="/help" onClick={go('/help')}>Contact</a>
        </div>
      </div>
      <div className="page-width footer-bottom">
        <span>© 2026 Comuta Technologies Ltd.</span>
        <div>
          <a href="/privacy" onClick={go('/privacy')}>Privacy</a>
          <a href="/terms" onClick={go('/terms')}>Terms</a>
          <a href="/help" onClick={go('/help')}>Accessibility</a>
        </div>
        <span className="ndpr"><ShieldCheck size={13} /> Privacy by design</span>
      </div>
    </footer>
  );
}

export function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="com-lockup">
      <Brand inverse={inverse} />
      <span className="com-lockup-mark"><Mark inverse={inverse} /></span>
    </div>
  );
}
