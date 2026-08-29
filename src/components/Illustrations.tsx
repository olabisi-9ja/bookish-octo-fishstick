/* Comuta flat-vector illustration library.
   These replace photographic/AI imagery with clean 2D vector art in the brand
   palette (forest green, lime, teal), used across the public marketing pages. */

type SceneProps = { className?: string };

/* - Carpool crew illustration (voice section + app download ambience) - */
export function CarpoolCrewArt({ className = '' }: SceneProps) {
  return (
    <svg className={className} viewBox="0 0 500 360" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flat vector illustration of a Comuta carpool crew smiling together on their morning commute">
      <rect width="500" height="360" rx="22" fill="#0a3325" />
      <circle cx="420" cy="52" r="64" fill="#bdf23f" opacity="0.13" />
      <circle cx="420" cy="52" r="38" fill="#bdf23f" opacity="0.4" />
      <path d="M0 286H500V246C420 252 330 214 240 214C150 214 70 252 0 246V286Z" fill="#155942" opacity="0.5" />
      <g fill="#1c6e54" opacity="0.55">
        <rect x="30" y="120" width="44" height="120" rx="6" />
        <rect x="86" y="84" width="48" height="156" rx="6" />
        <rect x="146" y="132" width="40" height="108" rx="6" />
        <rect x="408" y="92" width="52" height="150" rx="6" />
      </g>
      <rect x="120" y="286" width="260" height="44" rx="12" fill="#041f17" />
      <path d="M130 288H300" stroke="#bdf23f" strokeWidth="5" strokeDasharray="10 12" />

      <g transform="translate(125 150)">
        <path d="M14 136H226C234 136 238 140 238 150V168H8V150C8 140 10 136 14 136Z" fill="#f3f6f7" />
        <path d="M14 136C34 112 62 96 92 96H150C181 96 209 112 226 136Z" fill="#0a3325" stroke="#bdf23f" strokeWidth="5" />
        <rect x="68" y="106" width="32" height="20" rx="5" fill="#2b8ca0" opacity="0.9" />
        <rect x="128" y="106" width="32" height="20" rx="5" fill="#2b8ca0" opacity="0.9" />
        <circle cx="44" cy="166" r="22" fill="#041f17" stroke="#fff" strokeWidth="6" />
        <circle cx="200" cy="166" r="22" fill="#041f17" stroke="#fff" strokeWidth="6" />
        <circle cx="82" cy="126" r="11" fill="#f1cdad" />
        <path d="M71 126C71 117 75 112 82 112C89 112 93 117 93 126C89 120 85 119 82 119C79 119 75 120 71 126Z" fill="#6d4a2f" />
        <circle cx="124" cy="126" r="11" fill="#d69a6c" />
        <path d="M113 126C113 117 117 112 124 112C131 112 135 117 135 126C131 120 127 119 124 119C121 119 117 120 113 126Z" fill="#2d2320" />
        <circle cx="166" cy="126" r="11" fill="#e8b68f" />
        <path d="M155 126C155 117 159 112 166 112C173 112 177 117 177 126C173 120 169 119 166 119C163 119 159 120 155 126Z" fill="#4a3427" />
        <rect x="34" y="124" width="28" height="24" rx="8" fill="#bdf23f" opacity="0.96" />
        <rect x="184" y="124" width="28" height="24" rx="8" fill="#bdf23f" opacity="0.96" />
      </g>

      <g fill="#155942">
        <path d="M430 300L430 214" stroke="#155942" strokeWidth="12" strokeLinecap="round" />
        <path d="M430 214C404 202 391 180 391 168C412 178 430 180 430 186C430 180 448 178 469 168C469 180 456 202 430 214Z" fill="#1c6e54" />
      </g>
    </svg>
  );
}

/* - Flat illustration used by the community photo rail -
   Variants: route, crew, campus, workplace, estate, corridor */
const RAIL_PALETTE = {
  route: { bg: '#eef8f2', accent: '#1c6e54', soft: '#bdf23f' },
  crew: { bg: '#eef6f8', accent: '#155e6e', soft: '#2b8ca0' },
  campus: { bg: '#eef1f4', accent: '#37474f', soft: '#4d616d' },
  workplace: { bg: '#eef8f2', accent: '#0a3325', soft: '#bdf23f' },
  estate: { bg: '#eef6f8', accent: '#155942', soft: '#2b8ca0' },
  corridor: { bg: '#eef8f2', accent: '#1c6e54', soft: '#bdf23f' },
} as const;

export type RailVariant = keyof typeof RAIL_PALETTE;

export function RailArtwork({ variant = 'route', className = '' }: SceneProps & { variant?: RailVariant }) {
  const p = RAIL_PALETTE[variant];
  const isCrew = variant === 'crew';
  return (
    <svg className={className} viewBox="0 0 220 200" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comuta flat vector illustration">
      <rect width="220" height="200" fill={p.bg} />
      <circle cx="186" cy="24" r="42" fill={p.soft} opacity="0.3" />
      <circle cx="186" cy="24" r="22" fill={p.soft} opacity="0.6" />
      {isCrew ? (
        <>
          <g transform="translate(34 72)">
            <path d="M6 92H158C164 92 167 96 167 105V112H0V105C0 96 2 92 6 92Z" fill="#fff" stroke={p.accent} strokeWidth="4" />
            <path d="M6 92C20 66 42 50 62 50H102C122 50 144 66 158 92Z" fill={p.accent} />
            <rect x="52" y="60" width="22" height="15" rx="4" fill={p.soft} />
            <rect x="104" y="60" width="22" height="15" rx="4" fill={p.soft} />
            <circle cx="34" cy="116" r="14" fill="#041f17" stroke="#fff" strokeWidth="5" />
            <circle cx="136" cy="116" r="14" fill="#041f17" stroke="#fff" strokeWidth="5" />
            <circle cx="60" cy="73" r="8" fill="#d69a6c" />
            <path d="M52 73C52 66 55 63 60 63C65 63 68 66 68 73C65 69 62 68 60 68C58 68 56 69 52 73Z" fill="#2d2320" />
            <circle cx="92" cy="73" r="8" fill="#e8b68f" />
            <path d="M84 73C84 66 87 63 92 63C97 63 100 66 100 73C97 69 94 68 92 68C90 68 87 69 84 73Z" fill="#4a3427" />
          </g>
        </>
      ) : (
        <>
          <g fill={p.accent} opacity="0.75">
            <rect x="18" y="58" width="40" height="102" rx="6" />
            <rect x="70" y="34" width="46" height="126" rx="6" />
            <rect x="128" y="72" width="42" height="88" rx="6" />
          </g>
          <g fill={p.soft} opacity="0.9">
            <rect x="82" y="48" width="9" height="9" rx="2" />
            <rect x="96" y="48" width="9" height="9" rx="2" />
            <rect x="82" y="66" width="9" height="9" rx="2" />
            <rect x="96" y="66" width="9" height="9" rx="2" />
            <rect x="28" y="72" width="9" height="9" rx="2" />
            <rect x="42" y="72" width="9" height="9" rx="2" />
          </g>
          <path d="M10 174C40 164 80 156 120 150C150 145 178 140 212 132" stroke={p.soft} strokeWidth="5" strokeLinecap="round" />
          <circle cx="10" cy="174" r="6" fill={p.accent} />
          <circle cx="212" cy="132" r="6" fill={p.accent} />
        </>
      )}
    </svg>
  );
}

/* - Small flat route card used beside the app download phone - */
export function RouteLineArt({ className = '' }: SceneProps) {
  return (
    <svg className={className} viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flat vector route diagram between Ajah and Victoria Island">
      <rect width="320" height="150" rx="14" fill="#eef8f2" />
      <path d="M24 126C80 100 92 52 150 64C210 76 226 116 300 38" stroke="#1c6e54" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 16" />
      <path d="M24 126C80 100 92 52 150 64C210 76 226 116 300 38" stroke="#bdf23f" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 16" opacity="0.6" />
      <circle cx="24" cy="126" r="10" fill="#2b8ca0" stroke="#fff" strokeWidth="4" />
      <circle cx="300" cy="38" r="10" fill="#1c6e54" stroke="#fff" strokeWidth="4" />
      <rect x="18" y="14" width="76" height="24" rx="12" fill="#0a3325" />
      <circle cx="36" cy="26" r="5" fill="#bdf23f" />
      <path d="M48 26H78" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
