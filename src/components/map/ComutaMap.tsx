/**
 * ComutaMap — a believable frontend map abstraction.
 *
 * Until Mapbox/Google Maps is wired in, this renders a stylised SVG map with
 * hub markers, the planned route corridor and (optionally) a moving vehicle.
 * Parent screens never change when the implementation is swapped.
 */
import { useId, useMemo } from 'react';
import { motion } from 'motion/react';
import { Car } from 'lucide-react';
import type { Hub } from '../../types';
import { fitBounds, routePolyline } from '../../utils/geo';
import { DURATION, EASE } from '../../constants';

export function MapPin({ x, y, label, color = '#0A251C', size = 20 }: { x: number; y: number; label?: string; color?: string; size?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={size / 2 + 4} fill="#fff" opacity={0.95} />
      <circle r={size / 2} fill={color} stroke="#fff" strokeWidth={2.5} />
      {label && (
        <g transform={`translate(0, ${size + 8})`}>
          <rect x={-label.length * 3.4 - 8} y={-11} width={label.length * 6.8 + 16} height={22} rx={11} fill="#0A251C" />
          <text textAnchor="middle" y={4} fill="#fff" fontSize={11} fontWeight={800} fontFamily="inherit">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function StreetGrid({ bounds, seed }: { bounds: ReturnType<typeof fitBounds>; seed: number }) {
  const rnd = seededRandom(seed);
  const lines = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    const lngSpan = bounds.maxLng - bounds.minLng;
    const latSpan = bounds.maxLat - bounds.minLat;
    // vertical-ish streets
    for (let i = 0; i < 6; i++) {
      const x = bounds.minLng + rnd() * lngSpan;
      out.push({ x1: x, y1: bounds.minLat - latSpan * 0.4, x2: x + (rnd() - 0.5) * lngSpan * 0.12, y2: bounds.maxLat + latSpan * 0.4, major: rnd() > 0.65 });
    }
    // horizontal-ish streets
    for (let i = 0; i < 6; i++) {
      const y = bounds.minLat + rnd() * latSpan;
      out.push({ x1: bounds.minLng - lngSpan * 0.4, y1: y, x2: bounds.maxLng + lngSpan * 0.4, y2: y + (rnd() - 0.5) * latSpan * 0.1, major: rnd() > 0.65 });
    }
    // a couple of diagonal avenues
    for (let i = 0; i < 2; i++) {
      out.push({
        x1: bounds.minLng + rnd() * lngSpan,
        y1: bounds.minLat + rnd() * latSpan,
        x2: bounds.maxLng,
        y2: bounds.maxLat,
        major: true,
      });
    }
    return out;
  }, [bounds, rnd]);

  return (
    <g stroke="#DCE6E4" strokeLinecap="round" fill="none">
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={l.major ? 5 : 3} opacity={l.major ? 0.9 : 0.55} />
      ))}
    </g>
  );
}

function CarGlyph({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <rect x={-15} y={-8} width={30} height={15} rx={6} fill="#0A251C" />
      <rect x={-7} y={-14} width={15} height={8} rx={4} fill="#0A251C" />
      <rect x={-5} y={-12} width={11} height={5} rx={2.5} fill="#BDF23F" />
      <circle cx={-9} cy={8} r={4} fill="#111" />
      <circle cx={9} cy={8} r={4} fill="#111" />
      <circle cx={-9} cy={8} r={1.6} fill="#fff" />
      <circle cx={9} cy={8} r={1.6} fill="#fff" />
    </g>
  );
}

export interface ComutaMapProps {
  from?: Hub;
  to?: Hub;
  extraHubs?: Hub[];
  /** 0..1 position of the vehicle along the route. */
  vehicleProgress?: number;
  routeAnimate?: boolean;
  className?: string;
  height?: number | string;
  label?: boolean;
}

export function ComutaMap({
  from,
  to,
  extraHubs = [],
  vehicleProgress,
  routeAnimate = false,
  className = '',
  height = 260,
  label = true,
}: ComutaMapProps) {
  const seedId = useId();
  const seed = useMemo(() => seedId.split('').reduce((a, c) => a + c.charCodeAt(0), 7), [seedId]);

  if (!from || !to) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-surface-2 ${className}`}
        style={{ height }}
        role="img"
        aria-label="Map unavailable"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-faint">
          <Car size={26} strokeWidth={1.6} />
          <p className="text-sm font-semibold">Map preview unavailable</p>
        </div>
      </div>
    );
  }

  const poly = routePolyline(from, to);
  const bounds = fitBounds(poly.flatMap((p) => [[p[1], p[0]]] as [number, number][]));
  const lngSpan = bounds.maxLng - bounds.minLng;
  const latSpan = bounds.maxLat - bounds.minLat;

  const toX = (lng: number) => ((lng - bounds.minLng) / lngSpan) * 100;
  const toY = (lat: number) => 100 - ((lat - bounds.minLat) / latSpan) * 100;

  const pathD = `M ${toX(poly[0][0])} ${toY(poly[0][1])} Q ${toX(poly[1][0])} ${toY(poly[1][1])} ${toX(poly[2][0])} ${toY(poly[2][1])}`;

  // vehicle position along the quadratic curve (approx via interpolation on the control net)
  const vp = vehicleProgress ?? 0;
  const p0 = { x: toX(poly[0][0]), y: toY(poly[0][1]) };
  const p1 = { x: toX(poly[1][0]), y: toY(poly[1][1]) };
  const p2 = { x: toX(poly[2][0]), y: toY(poly[2][1]) };
  const t = Math.min(1, Math.max(0, vp));
  const qx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const qy = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-line-soft bg-[#EDF2F0] ${className}`}
      style={{ height }}
      role="img"
      aria-label={`Map from ${from.name} to ${to.name}`}
    >
      <svg viewBox={`0 0 100 100`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="100" height="100" fill="#EDF2F0" />
        <StreetGrid bounds={bounds} seed={seed} />
        {/* water hint */}
        <ellipse cx={92} cy={12} rx={26} ry={18} fill="#DCEEF0" opacity={0.9} />

        {/* route line */}
        <path d={pathD} fill="none" stroke="#C9D6D2" strokeWidth={5} strokeLinecap="round" />
        <motion.path
          d={pathD}
          fill="none"
          stroke="#0A251C"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={1}
          initial={routeAnimate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: routeAnimate ? DURATION.expressive : 0, ease: EASE }}
        />
        <path d={pathD} fill="none" stroke="#BDF23F" strokeWidth={5} strokeLinecap="round" opacity={0.5} strokeDasharray="1.5 3.2" />

        {/* extra hubs */}
        {extraHubs.map((h) => (
          <MapPin key={h.id} x={toX(h.lng)} y={toY(h.lat)} size={7} color="#8BA0AE" />
        ))}

        {/* origin + destination */}
        <MapPin x={p0.x} y={p0.y} color="#0A251C" size={9} label={label ? from.name.replace(' Hub', '') : undefined} />
        <MapPin x={p2.x} y={p2.y} color="#BDF23F" size={9} label={label ? to.name.replace(' Hub', '') : undefined} />

        {/* vehicle */}
        {vehicleProgress !== undefined && <CarGlyph x={qx} y={qy} angle={angle} />}
      </svg>
      {vehicleProgress !== undefined && (
        <span className="absolute bottom-2 right-2 rounded-full bg-forest-900/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          Live
        </span>
      )}
    </div>
  );
}
