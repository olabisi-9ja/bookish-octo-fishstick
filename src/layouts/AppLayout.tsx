import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Bell,
  Car,
  CircleDollarSign,
  Clock,
  Home,
  Route as RouteIcon,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Logo } from '../components/brand/Logo';
import { Avatar } from '../components/ui/Misc';
import { notificationService } from '../services/notificationService';
import { useComuta } from '../store';
import { DURATION } from '../constants';
import { OfflineBanner } from './OfflineBanner';

const RIDER_NAV = [
  { to: '/app/rider/home', label: 'Home', icon: Home },
  { to: '/app/rider/trips', label: 'Trips', icon: Clock },
  { to: '/app/rider/routes', label: 'Routes', icon: RouteIcon },
  { to: '/app/rider/safety', label: 'Safety', icon: ShieldCheck },
  { to: '/app/rider/account', label: 'Account', icon: User },
];

const DRIVER_NAV = [
  { to: '/app/driver/home', label: 'Home', icon: Home },
  { to: '/app/driver/routes', label: 'Routes', icon: RouteIcon },
  { to: '/app/driver/trips', label: 'Trips', icon: Clock },
  { to: '/app/driver/reliability', label: 'Reliability', icon: ShieldCheck },
  { to: '/app/driver/account', label: 'Account', icon: User },
];

function NavItems({ mode, onNavigate }: { mode: 'rider' | 'driver'; onNavigate?: () => void }) {
  const items = mode === 'rider' ? RIDER_NAV : DRIVER_NAV;
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-bold transition-colors tap ${
              isActive ? 'bg-forest-900 text-white' : 'text-variant hover:bg-surface-2 hover:text-forest-900'
            }`
          }
        >
          <item.icon size={19} strokeWidth={2.2} />
          {item.label}
        </NavLink>
      ))}
    </>
  );
}

export function AppLayout({ mode, context }: { mode: 'rider' | 'driver'; context?: string }) {
  const session = useComuta((s) => s.session);
  const user = useComuta((s) => s.users.find((u) => u.id === s.session?.userId));
  const unread = session ? notificationService.unreadCount(session.userId) : 0;
  const navigate = useNavigate();
  const nav = mode === 'rider' ? RIDER_NAV : DRIVER_NAV;
  const notificationsTo = `/app/${mode}/notifications`;

  return (
    <div className="min-h-dvh bg-surface">
      <OfflineBanner />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line-soft bg-white px-4 py-6 lg:flex">
        <button onClick={() => navigate(`/app/${mode}/home`)} className="px-2 text-left">
          <Logo size={30} />
        </button>
        <div className="mt-8 flex flex-col gap-1">
          <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-faint">
            {mode === 'rider' ? 'Rider' : 'Driver'}
          </p>
          <NavItems mode={mode} />
        </div>
        {mode === 'driver' && (
          <NavLink
            to="/app/driver/earnings"
            className={({ isActive }) =>
              `mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-bold transition-colors tap ${
                isActive ? 'bg-forest-900 text-white' : 'text-variant hover:bg-surface-2 hover:text-forest-900'
              }`
            }
          >
            <CircleDollarSign size={19} strokeWidth={2.2} />
            Earnings
          </NavLink>
        )}
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
          <Avatar initials={user?.photoInitials ?? '??'} color={user?.avatarColor ?? '#155942'} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-extrabold text-onsurface">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </p>
            <p className="text-[11px] font-semibold text-faint">{mode === 'rider' ? 'Rider' : 'Driver'}</p>
          </div>
          <button
            onClick={() => navigate(notificationsTo)}
            className="relative grid h-9 w-9 place-items-center rounded-full bg-white text-variant shadow-sm"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[9px] font-extrabold text-white">
                {unread}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile shell */}
      <div className="lg:pl-60">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line-soft bg-surface/90 px-4 py-3 backdrop-blur lg:hidden safe-t">
          <div className="flex items-center gap-2.5">
            <Logo size={26} wordmark={false} />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-faint">{context ?? (mode === 'rider' ? 'Rider' : 'Driver')}</p>
              <p className="text-[15px] font-extrabold leading-tight tracking-tight text-onsurface">
                {user ? `${user.firstName} ${user.lastName}` : 'COMUTA'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(notificationsTo)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-variant"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[9px] font-extrabold text-white">
                  {unread}
                </span>
              )}
            </button>
            <button onClick={() => navigate(`/app/${mode}/account`)} aria-label="Account">
              <Avatar initials={user?.photoInitials ?? '??'} color={user?.avatarColor ?? '#155942'} size={38} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-4 lg:px-8 lg:pt-8 lg:pb-10">
          <Outlet />
        </div>

        {/* Mobile bottom navigation */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line-soft bg-white/95 backdrop-blur lg:hidden safe-b"
          aria-label="Primary"
        >
          <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold tap ${
                    isActive ? 'text-forest-900' : 'text-faint'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId={`nav-dot-${mode}`}
                        className="absolute top-0 h-0.5 w-8 rounded-full bg-lime-500"
                        transition={{ duration: DURATION.standard }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function ModeSwitch({ mode }: { mode: 'rider' | 'driver' }) {
  const navigate = useNavigate();
  const other = mode === 'rider' ? 'driver' : 'rider';
  return (
    <button
      onClick={() => navigate(`/app/${other}/home`)}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] font-bold text-variant hover:border-forest-600 hover:text-forest-900 tap"
    >
      <Car size={16} />
      {mode === 'rider' ? 'Switch to Driver mode' : 'Switch to Rider mode'}
    </button>
  );
}

export function ModeSwitchInline({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
