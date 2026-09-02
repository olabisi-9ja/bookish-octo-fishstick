/**
 * COMUTA motion-art layer.
 * High quality vector animations served from the official LottieFiles CDN.
 * These give the public landing page a living, human feel without heavy
 * GIFs or photographic assets. Respects prefers-reduced-motion.
 *
 * When the player is not ready yet, the CDN is unreachable or the user
 * prefers reduced motion, a static COMUTA car illustration is shown so
 * the hero never loses its centerpiece image.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { createElement } from 'react';

export const LOTTIE = {
  carBlue: 'https://assets9.lottiefiles.com/packages/lf20_kqfglvmb.json',
  carRed: 'https://assets6.lottiefiles.com/packages/lf20_gdzapmjf.json',
  carYellow: 'https://assets9.lottiefiles.com/datafiles/HN7OcWNnoqje6iXIiZdWzKxvLIbfeCGTmvXmEm1h/data.json',
} as const;

/** Static side-view COMUTA car in the brand palette (fallback art). */
export function ComutaCar({ label }: { label?: string }) {
  return (
    <svg viewBox="0 0 560 430" width="100%" height="100%" role="img" aria-label={label}>
      <ellipse cx="285" cy="352" rx="215" ry="16" fill="#041f17" opacity=".3" />
      <rect x="70" y="238" width="420" height="62" rx="26" fill="#155942" />
      <rect x="70" y="240" width="420" height="9" rx="4.5" fill="#BDF23F" opacity=".9" />
      <rect x="196" y="176" width="168" height="66" rx="22" fill="#0f4431" />
      <rect x="208" y="188" width="52" height="40" rx="10" fill="#0A251C" />
      <rect x="268" y="188" width="84" height="40" rx="10" fill="#0A251C" />
      <circle cx="150" cy="300" r="34" fill="#041f17" />
      <circle cx="150" cy="300" r="14" fill="#eef8f2" />
      <circle cx="410" cy="300" r="34" fill="#041f17" />
      <circle cx="410" cy="300" r="14" fill="#eef8f2" />
    </svg>
  );
}

export function LottieAnimation({
  src,
  className = '',
  speed = 1,
  style,
  label,
}: {
  src: string;
  className?: string;
  speed?: number;
  style?: CSSProperties;
  label?: string;
}) {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    import('@lottiefiles/lottie-player')
      .then(() => alive && setReady(true))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [reduced]);

  if (reduced || !ready) {
    return (
      <span className={className} style={style}>
        <ComutaCar label={label} />
      </span>
    );
  }

  return createElement('lottie-player', {
    className,
    src,
    speed,
    loop: true,
    autoplay: true,
    preserveAspectRatio: 'xMidYMid meet',
    style,
    'aria-label': label,
    role: 'img',
  });
}
