import { useRef, useState, type ReactNode } from 'react';
import { useElementScroll } from '../hooks/useScrollProgress';

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/* ── Word-by-word highlight as the reader scrolls ── */
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

/* ── Content sharpens into focus while crossing the viewport ── */
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

/* ── Letters converge into one word as you scroll (carpool energy) ── */
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

/* ── Photo strip that glides sideways with the page ── */
const RAIL = [
  { src: '/images/people/ade.jpg', label: 'Ade · 184 trips shared' },
  { src: '/images/people/tolu.jpg', label: 'Tolu · Ajah crew' },
  { src: '/images/people/carpool-crew.jpg', label: 'The Lekki Sunrise Crew · 11 months strong', wide: true },
  { src: '/images/people/chidi.jpg', label: 'Chidi · Yaba → Lekki' },
  { src: '/images/people/ifeoma.jpg', label: 'Ifeoma · drives weekdays' },
  { src: '/images/people/seyi.jpg', label: 'Seyi · UNILAG community' },
  { src: '/images/people/amaka.jpg', label: 'Amaka · VI Tech Circle' },
  { src: '/images/people/musa.jpg', label: 'Musa · 231 trips shared' },
];

export function PhotoRail() {
  const { ref, progress } = useElementScroll<HTMLDivElement>();
  const translateX = -(progress * 22);
  return (
    <div ref={ref} className="photo-rail">
      <div className="photo-rail-track" style={{ transform: `translateX(${translateX}%)` }}>
        {RAIL.map((item) => (
          <figure key={item.label} className={`rail-card ${item.wide ? 'wide' : ''}`}>
            <img src={item.src} alt={item.label} loading="lazy" />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ── Dock-style magnification for the verified member faces ── */
type Face = { src: string; name: string };

function FaceDockItem({ src, name, mouseX }: Face & { mouseX: number | null }) {
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
      <img src={src} alt={name} loading="lazy" />
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
