import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

/* Flat vector avatar used everywhere (marketing, rider, driver, ops).
   No photographic asset is loaded: the person is drawn as clean vector art so
   the brand stays consistent and free of AI-generated imagery. */
const SKINS = ['#f1cdad', '#e8b68f', '#d69a6c', '#c98859'];
const HAIRS = ['#2d2320', '#4a3427', '#201d1b', '#6d4a2f'];
const SHIRTS = ['#ffffff', '#eef8f2', '#e7f9c0', '#dcf0f4'];

function hashFrom(initials: string) {
  let h = 0;
  for (let i = 0; i < initials.length; i += 1) h = (h * 31 + initials.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ initials, color = '#1c6e54', size = 44 }: { initials: string; color?: string; size?: number; photo?: string }) {
  const h = hashFrom(initials);
  const skin = SKINS[h % SKINS.length];
  const hair = HAIRS[(h >> 3) % HAIRS.length];
  const shirt = SHIRTS[(h >> 6) % SHIRTS.length];
  return (
    <span className="avatar flat-avatar" style={{ background: color, width: size, height: size }} role="img" aria-label={initials}>
      <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
        <path d="M8 48C8 35 14.5 28.5 24 28.5C33.5 28.5 40 35 40 48Z" fill={shirt} opacity="0.95" />
        <path d="M18 29.5C20 31.5 20 37 24 37C28 37 28 31.5 30 29.5C28.2 28.7 26.1 28.2 24 28.2C21.9 28.2 19.8 28.7 18 29.5Z" fill="rgba(4,31,23,.18)" />
        <circle cx="24" cy="19" r="10" fill={skin} />
        <path d="M14.5 18.5C14.2 13.5 18 9.6 24 9.6C30 9.6 33.8 13.5 33.5 18.5C31.4 14.6 28 14.3 24 14.3C20 14.3 16.6 14.6 14.5 18.5Z" fill={hair} />
        <circle cx="24" cy="17.7" r="1.8" fill="rgba(4,31,23,.22)" />
      </svg>
      <span className="flat-avatar-initials">{initials}</span>
    </span>
  );
}

export function VerifiedBadge({ text = 'Verified' }: { text?: string }) {
  return <span className="verified-badge"><CheckCircle2 size={13} fill="currentColor" />{text}</span>;
}

export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-card ${wide ? 'wide' : ''}`}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return <div className={`toast ${visible ? 'show' : ''}`}><CheckCircle2 size={18} />{message}</div>;
}

export function Stepper({ active, total }: { active: number; total: number }) {
  return <div className="stepper">{Array.from({ length: total }).map((_, i) => <span key={i} className={i < active ? 'active' : ''} />)}</div>;
}

/* ---- Animated stat counter ----
   Counts the leading number from 0 to its target once it scrolls into view.
   Preserves prefix/suffix so values like "₦38k", "4.9/5" and "24/7" still read
   naturally. Non-numeric strings (e.g. "Live", "Weekly") stay static. */
const STAT_RE = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/;

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function StatCounter({ value, className = '' }: { value: string; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const match = STAT_RE.exec(value);
  const prefix = match?.[1] ?? value;
  const rawNum = match?.[2];
  const suffix = match?.[3] ?? '';
  const target = rawNum ? Number(rawNum) : 0;
  const decimals = rawNum?.includes('.') ? (rawNum.split('.')[1]?.length ?? 0) : 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || !rawNum) return;
    let frame = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, rawNum, target]);

  return (
    <span ref={ref} className={(className || 'stat-counter').trim()} aria-label={value}>
      {prefix}
      {rawNum ? current.toFixed(decimals) : value}
      {rawNum ? suffix : ''}
    </span>
  );
}
