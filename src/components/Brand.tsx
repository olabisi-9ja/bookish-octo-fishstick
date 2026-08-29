import type { CSSProperties } from 'react';

type BrandProps = { inverse?: boolean; compact?: boolean; style?: CSSProperties };

/**
 * Comuta mark: a dark forest green circle holding two vertical bars -
 * one white, one lime, evoking a road, a pathway and an abstract "C".
 */
export function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand-mark ${inverse ? 'inverse' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <circle className="mark-bg" cx="24" cy="24" r="24" />
        <rect className="mark-bar-a" x="16.2" y="13" width="6.8" height="22" rx="3.4" />
        <rect className="mark-bar-b" x="25" y="13" width="6.8" height="22" rx="3.4" />
      </svg>
    </span>
  );
}

export default function Brand({ inverse = false, compact = false, style }: BrandProps) {
  return (
    <span className={`brand ${inverse ? 'inverse' : ''}`} style={style}>
      <Mark inverse={inverse} />
      {!compact && <span>Comuta</span>}
    </span>
  );
}
