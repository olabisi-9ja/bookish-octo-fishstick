type IllustrationProps = {
  className?: string;
  size?: number;
  animated?: boolean;
};

export function ConfirmedBookingIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div className={`comuta-illustration booking-confirmed-anim ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Seat Confirmed">
        {/* Subtle geometric background grid representing Lagos corridor */}
        <circle cx="100" cy="100" r="85" fill="#E8F4EE" />
        <circle cx="100" cy="100" r="70" fill="#D2EDE0" opacity="0.6" />
        
        {/* Road line from Ikorodu to VI */}
        <path d="M40 140 Q100 120 160 140" stroke="#1C604C" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 140 Q100 120 160 140" stroke="#CCF06A" strokeWidth="2" strokeDasharray="6 6" />

        {/* Origin Hub */}
        <circle cx="45" cy="138" r="7" fill="#0C392C" />
        <circle cx="45" cy="138" r="3" fill="#CCF06A" />

        {/* Destination Hub */}
        <circle cx="155" cy="138" r="7" fill="#0C392C" />
        <circle cx="155" cy="138" r="3" fill="#CCF06A" />

        {/* Car / Seat lock box */}
        <g className="car-seat-lock">
          <rect x="70" y="55" width="60" height="52" rx="14" fill="#0C392C" />
          <rect x="76" y="61" width="48" height="24" rx="8" fill="#1C604C" />
          {/* Seat Icon */}
          <path d="M92 78V68a8 8 0 0 1 16 0v10" stroke="#CCF06A" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="88" y="78" width="24" height="6" rx="3" fill="#CCF06A" />
        </g>

        {/* Success checkmark badge with pop animation */}
        <g className="confirm-badge-anim">
          <circle cx="132" cy="62" r="16" fill="#CCF06A" stroke="#0C392C" strokeWidth="3" />
          <path d="M125 62l5 5 9-10" stroke="#0C392C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Corridor text dots */}
        <text x="100" y="172" textAnchor="middle" fill="#1C604C" fontSize="11" fontWeight="700" fontFamily="DM Sans, sans-serif" letterSpacing="0.05em">
          IKORODU ➔ VICTORIA ISLAND
        </text>
      </svg>
    </div>
  );
}

export function DriverCommitmentIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <div className={`comuta-illustration driver-commit-anim ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Driver Committed">
        <circle cx="90" cy="90" r="75" fill="#EBF6F0" />
        {/* Steering wheel & road geometry */}
        <circle cx="90" cy="90" r="50" stroke="#0C392C" strokeWidth="6" strokeDasharray="30 8" />
        <circle cx="90" cy="90" r="22" fill="#1C604C" />
        <circle cx="90" cy="90" r="10" fill="#CCF06A" />
        <path d="M68 90h-24M136 90h-24M90 112v24" stroke="#0C392C" strokeWidth="6" strokeLinecap="round" />
        
        {/* Verified Shield Badge */}
        <g className="driver-shield-anim">
          <path d="M135 45c0 0-14-2-22-12-8 10-22 12-22 12 0 20 12 34 22 38 10-4 22-18 22-38z" fill="#CCF06A" stroke="#0C392C" strokeWidth="3" />
          <path d="M106 48l6 6 12-13" stroke="#0C392C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

export function RecoveryIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div className={`comuta-illustration recovery-fade-anim ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Route Recovery">
        <circle cx="100" cy="100" r="85" fill="#FDF3E7" />
        
        {/* Old interrupted route (fading) */}
        <path d="M35 120 C 70 80, 110 80, 165 120" stroke="#D1D5DB" strokeWidth="3" strokeDasharray="5 5" opacity="0.6" />
        <circle cx="100" cy="90" r="10" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
        <path d="M96 86l8 8M104 86l-8 8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />

        {/* Alternative fresh route (pulsing in green) */}
        <path d="M35 130 C 70 145, 125 145, 165 130" stroke="#1C604C" strokeWidth="4" strokeLinecap="round" />
        <path d="M35 130 C 70 145, 125 145, 165 130" stroke="#CCF06A" strokeWidth="2" strokeDasharray="6 4" />

        {/* Origin Hub */}
        <circle cx="35" cy="125" r="7" fill="#0C392C" />
        {/* Destination Hub */}
        <circle cx="165" cy="125" r="7" fill="#0C392C" />

        {/* Shield Guarantee */}
        <g transform="translate(78, 30)">
          <rect width="44" height="44" rx="22" fill="#0C392C" />
          <path d="M16 22l4 4 8-9" stroke="#CCF06A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <text x="100" y="175" textAnchor="middle" fill="#0C392C" fontSize="11" fontWeight="800" fontFamily="DM Sans, sans-serif">
          YOU'RE STILL COVERED
        </text>
      </svg>
    </div>
  );
}

export function EmptyRoadIllustration({ className = '', size = 180 }: IllustrationProps) {
  return (
    <div className={`comuta-illustration empty-road-anim ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="No Trips Yet">
        <circle cx="100" cy="100" r="85" fill="#F4F5F1" />
        {/* Clean corridor road vanishing towards horizon */}
        <path d="M92 40 L40 165 h120 L108 40 Z" fill="#E5E7EB" />
        <path d="M100 45 v115" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="8 6" />
        {/* Sun over horizon */}
        <circle cx="100" cy="40" r="14" fill="#FDE047" opacity="0.8" />
        {/* Hub marker on the road */}
        <circle cx="100" cy="110" r="12" fill="#0C392C" />
        <circle cx="100" cy="110" r="5" fill="#CCF06A" />
      </svg>
    </div>
  );
}

export function HubSafetyIllustration({ className = '', size = 160 }: IllustrationProps) {
  return (
    <div className={`comuta-illustration hub-safety-anim ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hub Safety">
        <circle cx="90" cy="90" r="75" fill="#E8F4EE" />
        {/* Hub Gate & Lighting pole */}
        <rect x="50" y="60" width="80" height="70" rx="8" fill="#0C392C" />
        <rect x="58" y="75" width="64" height="55" rx="4" fill="#1C604C" />
        <path d="M90 75v55" stroke="#E8F4EE" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Well-lit lamp beacon */}
        <path d="M90 35 L75 55 h30 Z" fill="#FDE047" opacity="0.9" />
        <circle cx="90" cy="35" r="5" fill="#0C392C" />
        
        {/* Verification badge */}
        <circle cx="125" cy="55" r="14" fill="#CCF06A" stroke="#0C392C" strokeWidth="2.5" />
        <path d="M119 55l4 4 8-9" stroke="#0C392C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
