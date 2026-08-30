/**
 * COMUTA motion-art layer.
 * High quality vector animations served from the official LottieFiles CDN.
 * These give the public landing page a living, human feel without heavy
 * GIFs or photographic assets. Respects prefers-reduced-motion.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { createElement } from 'react';

export const LOTTIE = {
  carBlue: 'https://assets9.lottiefiles.com/packages/lf20_kqfglvmb.json',
  carRed: 'https://assets6.lottiefiles.com/packages/lf20_gdzapmjf.json',
  carYellow: 'https://assets9.lottiefiles.com/datafiles/HN7OcWNnoqje6iXIiZdWzKxvLIbfeCGTmvXmEm1h/data.json',
} as const;

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

  if (reduced || !ready) return <span className={className} style={style} aria-label={label} />;

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
