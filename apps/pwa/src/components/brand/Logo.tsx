/**
 * COMUTA mark  -  dark green circle holding two vertical bars
 * (one white, one lime): a road, a pathway, an abstract "C".
 */
export function Mark({ size = 34, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ flex: '0 0 auto' }}>
      <circle cx="24" cy="24" r="24" fill={inverse ? '#FFFFFF' : '#0A251C'} />
      <rect x="16.2" y="13" width="6.8" height="22" rx="3.4" fill={inverse ? '#0A251C' : '#FFFFFF'} />
      <rect x="25" y="13" width="6.8" height="22" rx="3.4" fill="#BDF23F" />
    </svg>
  );
}

export function Logo({
  inverse = false,
  size = 34,
  wordmark = true,
  className = '',
}: {
  inverse?: boolean;
  size?: number;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 select-none ${className}`}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <Mark size={size} inverse={inverse} />
      {wordmark && (
        <span
          className={`font-extrabold tracking-tight ${inverse ? 'text-white' : 'text-forest-900'}`}
          style={{ fontSize: size * 0.68, letterSpacing: '-0.04em' }}
        >
          COMUTA
        </span>
      )}
    </span>
  );
}
