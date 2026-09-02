/**
 * COMUTA public site footer.
 * Restores the footer design from the previously live marketing site
 * (dark forest panel, brand column + Ride / Drive / Comuta columns and a
 * bottom bar with legal links and the NDPR badge) with the current site
 * map: no Communities or Operations pages, real public pages for Safety,
 * Drivers, About, How it works, Help, Privacy and Terms.
 */
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

const RIDE_LINKS = [
  { label: 'Find a ride', to: '/app/rider/plan' },
  { label: 'My commute', to: '/app/rider/home' },
  { label: 'Recurring routes', to: '/app/rider/routes' },
  { label: 'Safety', to: '/safety' },
];

const DRIVE_LINKS = [
  { label: 'Offer a ride', to: '/drivers' },
  { label: 'Driver requirements', to: '/drivers#requirements' },
  { label: 'Earnings', to: '/app/driver/earnings' },
  { label: 'Verification', to: '/safety' },
];

const COMUTA_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Help centre', to: '/help' },
  { label: 'Contact', to: '/help#contact' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h4 className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/80">{title}</h4>
      {links.map((l) => (
        <Link
          key={l.label}
          to={l.to}
          className="text-[13px] font-semibold text-white/55 transition-colors hover:text-white"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#031b13] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-10 gap-y-12 px-5 py-14 md:grid-cols-[2fr_repeat(3,1fr)] md:gap-x-16 md:py-[70px]">
        <div className="col-span-2 md:col-span-1">
          <Logo inverse size={30} />
          <p className="mt-[18px] max-w-[280px] text-[13px] leading-[1.65] text-white/55">
            Trusted recurring carpools for the routes Nigerians travel every day.
          </p>
          <span className="mt-3 block text-[11px] font-bold text-lime-500">Lagos, Nigeria 🇳🇬</span>
        </div>
        <FooterColumn title="Ride" links={RIDE_LINKS} />
        <FooterColumn title="Drive" links={DRIVE_LINKS} />
        <FooterColumn title="Comuta" links={COMUTA_LINKS} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 text-[11px] font-semibold text-white/45">
          <span>© {year} Comuta Technologies Ltd.</span>
          <div className="flex gap-5">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link to="/help" className="transition-colors hover:text-white">Accessibility</Link>
          </div>
          <span className="flex items-center gap-1.5 text-lime-500">
            <ShieldCheck size={13} /> Privacy by design
          </span>
        </div>
      </div>
    </footer>
  );
}
