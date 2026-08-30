import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/brand/Logo';
import { DURATION, EASE } from '../constants';

export function AuthLayout({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-surface lg:flex-row">
      {/* Brand panel (desktop) */}
      <div className="relative hidden overflow-hidden bg-forest-900 lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 28% 20%, rgba(39,132,101,0.55), transparent 46%), radial-gradient(circle at 85% 80%, rgba(189,242,63,0.14), transparent 42%), linear-gradient(160deg, #041F17 0%, #0A251C 60%, #0F4431 100%)',
          }}
        />
        <div className="relative z-10">
          <Logo inverse />
        </div>
        <div className="relative z-10 max-w-md">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-lime-500">Planned shared commuting</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white">
            Your commute.
            <br />
            Shared. <span className="text-lime-500">Simpler.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Ride with people already making your journey. Book ahead, know your seat, and travel with verified drivers.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-[13px] font-semibold text-white/55">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" /> Lagos · Ikorodu → Victoria Island
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" /> Verified drivers &amp; hubs
          </span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex min-h-dvh flex-1 items-center justify-center px-5 py-8 safe-b">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, ease: EASE }}
          className={`w-full ${narrow ? 'max-w-sm' : 'max-w-md'}`}
        >
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
