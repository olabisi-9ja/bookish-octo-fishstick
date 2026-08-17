import type { CSSProperties } from 'react';

type BrandProps = { inverse?: boolean; compact?: boolean; style?: CSSProperties };

export function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand-mark ${inverse ? 'inverse' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 42 42" role="img">
        <path d="M9.5 12.2c2.7-4.4 6.8-6.7 11.5-6.7 7.7 0 13.8 6.4 13.8 14.2 0 7.9-5.7 14.1-13.7 16.8-8-2.8-13.9-8.9-13.9-16.8 0-1.2.1-2.4.4-3.5" />
        <path d="M11 21.2h7.4l3.3-7.4 3.2 14.3 3.1-6.9h4.7" />
        <circle cx="9.3" cy="12.4" r="3.2" />
      </svg>
    </span>
  );
}

export default function Brand({ inverse = false, compact = false, style }: BrandProps) {
  return (
    <span className={`brand ${inverse ? 'inverse' : ''}`} style={style}>
      <Mark inverse={inverse} />
      {!compact && <span>Padi<span className="brand-go">Go</span></span>}
    </span>
  );
}
