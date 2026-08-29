import { useEffect, useState, type CSSProperties } from 'react';

/* Comuta motion-art layer.
   High quality vector animations served from the official LottieFiles CDN.
   These replace static/custom illustrations so the public marketing pages feel
   alive without loading heavy GIFs or photographic assets. */

export const LOTTIE = {
  carBlue: 'https://assets9.lottiefiles.com/packages/lf20_kqfglvmb.json',
  carRed: 'https://assets6.lottiefiles.com/packages/lf20_gdzapmjf.json',
  carYellow: 'https://assets9.lottiefiles.com/datafiles/HN7OcWNnoqje6iXIiZdWzKxvLIbfeCGTmvXmEm1h/data.json',
  carCity: 'https://assets2.lottiefiles.com/packages/lf20_mDnmhAgZkb.json',
  person: 'https://assets5.lottiefiles.com/packages/lf20_awP420Zf8l.json',
} as const;

export function LottieAnimation({
  src,
  className = '',
  speed = 1,
  background = 'transparent',
  loop = true,
  autoplay = true,
  style,
  label,
}: {
  src: string;
  className?: string;
  speed?: number;
  background?: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
  label?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load the official LottieFiles web player only when an animation is on screen.
    import('@lottiefiles/lottie-player')
      .then(() => setReady(true))
      .catch(() => setReady(false));
  }, []);

  if (!ready) return <span className={className} style={style} aria-label={label} />;

  return (
    <lottie-player
      className={className}
      src={src}
      background={background}
      speed={speed}
      loop={loop}
      autoplay={autoplay}
      preserveAspectRatio="xMidYMid meet"
      aria-label={label}
      role="img"
      style={style}
    />
  );
}

/* Large emblematic scene used in the testimonials / voice section. */
export function CarpoolScene({ className = '' }: { className?: string }) {
  return (
    <div className={`com-lottie-scene ${className}`}>
      <LottieAnimation
        src={LOTTIE.carYellow}
        label="Animated Comuta carpool car"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

/* Animated partner/traveller visual for the community and driver sections. */
export function PersonScene({ className = '' }: { className?: string }) {
  return (
    <div className={`com-lottie-scene ${className}`}>
      <LottieAnimation
        src={LOTTIE.person}
        label="Animated verified commuter"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
