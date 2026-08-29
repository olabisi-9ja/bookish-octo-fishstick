import { useRef, useState, type ReactNode } from 'react';
import { useElementScroll } from '../hooks/useScrollProgress';
import { Avatar } from './UI';
import { LottieAnimation, LOTTIE } from './LottieArt';

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/* - Word-by-word highlight as the reader scrolls - */
export function ManifestoHighlight({ text }: { text: string }) {
  const { ref, progress } = useElementScroll<HTMLParagraphElement>();
  const words = text.split(' ');
  const highlightIndex = Math.floor(progress * words.length * 1.7);
  return (
    <p ref={ref} className="manifesto-text">
      {words.map((word, i) => (
        <span key={i} className={i < highlightIndex ? 'lit' : ''}>{word} </span>
      ))}
    </p>
  );
}

/* - Content sharpens into focus while crossing the viewport - */
export function BlurReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, progress } = useElementScroll<HTMLDivElement>();
  const p = clamp((progress - 0.12) / 0.33);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        filter: `blur(${(1 - p) * 10}px)`,
        opacity: 0.2 + p * 0.8,
        transform: `scale(${1.05 - p * 0.05})`,
        willChange: 'filter, transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

/* - Letters converge into one word as you scroll (carpool energy) - */
export function SpreadWord({ word = 'TOGETHER' }: { word?: string }) {
  const { ref, progress } = useElementScroll<HTMLDivElement>();
  const t = clamp((progress - 0.15) / 0.5);
  const spread = 1 - t;
  const chars = word.split('');
  return (
    <div ref={ref} className="spread-word" aria-label={word} role="img">
      {chars.map((char, i) => {
        const offset = (i - (chars.length - 1) / 2) * spread * 34;
        return (
          <span key={i} aria-hidden="true" style={{ transform: `translateX(${offset}px)`, opacity: 0.22 + t * 0.78 }}>
            {char}
          </span>
        );
      })}
    </div>
  );
}

/* - Animated LottieFiles rail: motion cards that glide with scroll - */
const RAIL: { label: string; src: string; wide?: boolean; tint: string }[] = [
  { label: 'Ade · 184 trips shared', src: LOTTIE.carBlue, tint: '#eef8f2' },
  { label: 'Tolu · Ajah crew', src: LOTTIE.carRed, tint: '#eef6f8' },
  { label: 'The Lekki Sunrise Crew · 11 months strong', src: LOTTIE.carYellow, wide: true, tint: '#eef8f2' },
  { label: 'Chidi · Yaba → Lekki', src: LOTTIE.carCity, tint: '#eef1f4' },
  { label: 'Ifeoma · drives weekdays', src: LOTTIE.person, tint: '#eef8f2' },
  { label: 'Seyi · UNILAG community', src: LOTTIE.carBlue, tint: '#eef6f8' },
];

export function PhotoRail() {
  const { ref, progress } = useElementScroll<HTMLDivElement>();
  const translateX = -(progress * 22);
  return (
    <div ref={ref} className="photo-rail">
      <div className="photo-rail-track" style={{ transform: `translateX(${translateX}%)` }}>
        {RAIL.map((item) => (
          <figure key={item.label} className={`rail-card ${item.wide ? 'wide' : ''}`} style={{ background: item.tint }}>
            <LottieAnimation
              src={item.src}
              label={item.label}
              speed={0.82}
              background="transparent"
              style={{ width: '100%', height: '100%' }}
            />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* - Dock-style magnification for the flat vector member avatars - */
type Face = { initials: string; name: string; color: string };

function FaceDockItem({ initials, name, color, mouseX }: Face & { mouseX: number | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  let scale = 1;
  if (mouseX !== null && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const dist = Math.abs(mouseX - (rect.left + rect.width / 2));
    scale = Math.max(1, 1.5 - dist / 105);
  }
  return (
    <span
      ref={ref}
      className="face-dock-item"
      title={name}
      style={{ transform: `scale(${scale})`, zIndex: scale > 1.02 ? 5 : 1 }}
    >
      <Avatar initials={initials} color={color} size={38} />
    </span>
  );
}

export function FaceDock({ faces }: { faces: Face[] }) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  return (
    <div
      className="face-dock"
      onMouseMove={(e) => setMouseX(e.clientX)}
      onMouseLeave={() => setMouseX(null)}
    >
      {faces.map((face) => (
        <FaceDockItem key={face.name} {...face} mouseX={mouseX} />
      ))}
    </div>
  );
}
