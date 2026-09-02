import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { DURATION, EASE } from '../../constants';
import type { TripStatus, PaymentStatus, VerificationStatus } from '../../types';

/* ---------------- Avatar ---------------- */
export function Avatar({
  initials,
  color,
  size = 40,
  ring = false,
}: {
  initials: string;
  color: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full font-extrabold text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.36,
        boxShadow: ring ? '0 0 0 2px #fff, 0 0 0 4px #BDF23F' : undefined,
      }}
    >
      {initials}
    </span>
  );
}

/* ---------------- Status chip ---------------- */
type Tone = 'green' | 'neutral' | 'amber' | 'red' | 'teal' | 'lime';

const toneStyles: Record<Tone, string> = {
  green: 'bg-forest-100 text-forest-800',
  neutral: 'bg-surface-2 text-variant border border-line',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-700',
  teal: 'bg-teal-50 text-teal-700 border border-teal-100',
  lime: 'bg-lime-100 text-lime-700',
};

export function StatusChip({ label, tone = 'neutral', dot = false }: { label: string; tone?: Tone; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${toneStyles[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {label}
    </span>
  );
}

export const TRIP_STATUS_TONE: Record<TripStatus, Tone> = {
  scheduled: 'neutral',
  confirmation_pending: 'amber',
  confirmed: 'green',
  at_risk: 'red',
  pickup: 'teal',
  departed: 'teal',
  in_transit: 'lime',
  completed: 'green',
  cancelled: 'neutral',
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, Tone> = {
  pending: 'neutral',
  processing: 'amber',
  successful: 'green',
  failed: 'red',
  refunded: 'neutral',
};

export const VERIFICATION_STATUS_TONE: Record<VerificationStatus, Tone> = {
  pending: 'neutral',
  under_review: 'amber',
  verified: 'green',
  rejected: 'red',
};

/* ---------------- Skeletons ---------------- */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate- rounded-lg bg-line-soft ${className}`} />;
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line-soft bg-white p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-3 h-5 w-40" />
      <div className="mt-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/* ---------------- Bottom sheet ---------------- */
export function Sheet({
  open,
  onClose,
  children,
  title,
  grabber = true,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  grabber?: boolean;
  maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="fixed inset-0 z-40 bg-forest-950/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: DURATION.standard, ease: EASE }}
            className={`fixed inset-x-0 bottom-0 z-50 mx-auto rounded-t-3xl bg-white shadow-sheet safe-b ${maxWidth}`}
          >
            {grabber && <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line" aria-hidden />}
            {title && (
              <div className="flex items-center justify-between px-5 pt-3 pb-1">
                <h2 className="text-lg font-extrabold tracking-tight text-onsurface">{title}</h2>
                <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-variant" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="max-h-[82vh] overflow-y-auto px-5 pb-6 pt-2 no-scrollbar">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Page transition ---------------- */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: DURATION.fast, ease: EASE }}
      className={className}
    >
      {children}
    </motion.main>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {icon}
      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-onsurface">{title}</h3>
      {body && <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-variant">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
