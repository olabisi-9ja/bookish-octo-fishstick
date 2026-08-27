import type { CSSProperties } from 'react';

type BrandProps = {
  inverse?: boolean;
  compact?: boolean;
  style?: CSSProperties;
  tagline?: boolean;
};

export function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand-mark ${inverse ? 'inverse' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" role="img" fill="none">
        {/* Geometric corridor path connecting origin hub to destination hub */}
        <circle cx="8" cy="20" r="4.5" fill="currentColor" opacity={inverse ? '0.9' : '0.85'} />
        <circle cx="32" cy="20" r="5" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="20" r="2" fill="currentColor" />
        <path
          d="M12.5 20h14.5"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="1 0"
        />
        {/* Forward directional arc */}
        <path
          d="M22 14.5l5.5 5.5-5.5 5.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Brand({ inverse = false, compact = false, style, tagline = false }: BrandProps) {
  return (
    <span className={`brand ${inverse ? 'inverse' : ''}`} style={style}>
      <Mark inverse={inverse} />
      {!compact && (
        <span className="brand-text">
          <span className="brand-name">COMUTA</span>
          {tagline && <small className="brand-sub">Daily commute, taken care of</small>}
        </span>
      )}
    </span>
  );
}
