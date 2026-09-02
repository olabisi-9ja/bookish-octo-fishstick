/**
 * Sticky nav shared by every public COMUTA page (landing + company pages).
 *
 * Splits by audience the way Lyft, Bolt and Uber all do - the two sides of a
 * marketplace want different pages, and burying "drive" inside a menu costs
 * driver signups. Auth stays hard right, product links centre.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';

const LINKS = [
  { label: 'Ride', to: '/how-it-works' },
  { label: 'Drive', to: '/drivers' },
  { label: 'Safety', to: '/safety' },
  { label: 'Help', to: '/help' },
];

export function PublicNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-nv-90 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <button type="button" onClick={() => navigate('/')} aria-label="COMUTA home" className="tap shrink-0">
          <Logo size={28} />
        </button>

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl px-3 py-2 text-[14px] font-bold text-nv-30 transition-colors hover:bg-ntl-95 hover:text-primary-base"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="tap hidden rounded-xl px-4 py-2 text-[13.5px] font-bold text-primary-base hover:bg-ntl-95 sm:block"
          >
            Log in
          </button>
          <Button size="md" onClick={() => navigate('/signup')}>
            Get started
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="tap rounded-xl p-2 text-primary-base hover:bg-ntl-95 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Primary mobile" className="border-t border-nv-90 bg-white px-5 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-[15px] font-bold text-nv-30 hover:bg-ntl-95 hover:text-primary-base"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-3 text-[15px] font-bold text-primary-base hover:bg-ntl-95 sm:hidden"
          >
            Log in
          </Link>
        </nav>
      )}
    </header>
  );
}
