/**
 * COMUTA illustration system  -  flat geometric forms in the brand palette.
 * Used for onboarding, empty states, success, failure, verification, recovery.
 * Derived from the brand board: deep green + lime + muted green/teal ramps.
 */
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { DURATION, EASE } from '../../constants';

const GREEN = '#0A251C';
const LIME = '#BDF23F';
const TEAL = '#1E7386';
const SAND = '#F0F4F4';
const NEUTRAL = '#D8E0E4';
const RED = '#C74435';

function Frame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 220 160" role="img" aria-hidden="true" className={`w-full ${className}`} style={{ maxWidth: 260 }}>
      {children}
    </svg>
  );
}

function RoadBase() {
  return (
    <>
      <rect x="0" y="118" width="220" height="42" fill={SAND} />
      <rect x="0" y="120" width="220" height="4" fill={NEUTRAL} />
      <rect x="0" y="152" width="220" height="8" fill="#E3EAE8" />
      <line x1="0" y1="139" x2="220" y2="139" stroke="#fff" strokeWidth="3" strokeDasharray="10 12" />
    </>
  );
}

/** Onboarding 1  -  car with passengers on a shared route. */
export function CommuteIllustration() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      {/* route line + hubs */}
      <motion.path
        d="M 14 96 Q 70 58 108 80 T 206 54"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.story, ease: EASE }}
      />
      <circle cx="14" cy="96" r="5" fill={GREEN} />
      <circle cx="108" cy="80" r="4" fill={LIME} />
      <circle cx="206" cy="54" r="5" fill={GREEN} />
      {/* buildings */}
      <rect x="26" y="38" width="26" height="52" rx="3" fill="#DCE6E4" />
      <rect x="34" y="44" width="4" height="4" rx="1" fill="#fff" />
      <rect x="42" y="44" width="4" height="4" rx="1" fill="#fff" />
      <rect x="34" y="54" width="4" height="4" rx="1" fill="#fff" />
      <rect x="42" y="54" width="4" height="4" rx="1" fill="#fff" />
      <rect x="150" y="20" width="30" height="42" rx="3" fill="#E9F8C8" />
      <rect x="188" y="30" width="20" height="34" rx="3" fill="#DCE6E4" />
      {/* car */}
      <g transform="translate(92 108)">
        <rect x="0" y="6" width="44" height="15" rx="6" fill={GREEN} />
        <path d="M 8 6 L 12 -4 L 32 -4 L 38 6 Z" fill={GREEN} />
        <rect x="12" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <rect x="23" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <circle cx="10" cy="21" r="5.5" fill="#1A1A1A" />
        <circle cx="34" cy="21" r="5.5" fill="#1A1A1A" />
        <circle cx="10" cy="21" r="2" fill="#fff" />
        <circle cx="34" cy="21" r="2" fill="#fff" />
      </g>
      {/* passengers */}
      <circle cx="104" cy="100" r="6" fill="#D9EFE4" />
      <circle cx="104" cy="92" r="5" fill={TEAL} />
      <circle cx="118" cy="100" r="6" fill="#E7F9C0" />
      <circle cx="118" cy="92" r="5" fill={GREEN} />
    </Frame>
  );
}

/** Onboarding 2  -  verified driver, shield, vehicle. */
export function VerifyIllustration() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      <rect x="18" y="30" width="34" height="40" rx="4" fill="#DCE6E4" />
      <rect x="168" y="24" width="30" height="46" rx="4" fill="#E9F8C8" />
      {/* shield */}
      <motion.g
        initial={rm ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: DURATION.standard, ease: EASE }}
      >
        <path d="M 110 18 L 134 26 L 134 56 Q 134 84 110 96 Q 86 84 86 56 L 86 26 Z" fill={GREEN} />
        <path d="M 110 30 L 126 35 L 126 52 Q 126 70 110 80 Q 94 70 94 52 L 94 35 Z" fill={LIME} />
        <path d="M 101 55 L 108 63 L 119 49" stroke={GREEN} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      {/* driver */}
      <circle cx="62" cy="86" r="10" fill="#D9EFE4" />
      <rect x="50" y="94" width="24" height="26" rx="8" fill={TEAL} />
      <circle cx="62" cy="86" r="3.5" fill={GREEN} />
      {/* car */}
      <g transform="translate(150 108)">
        <rect x="0" y="6" width="44" height="15" rx="6" fill={GREEN} />
        <path d="M 8 6 L 12 -4 L 32 -4 L 38 6 Z" fill={GREEN} />
        <rect x="12" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <rect x="23" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <circle cx="10" cy="21" r="5.5" fill="#1A1A1A" />
        <circle cx="34" cy="21" r="5.5" fill="#1A1A1A" />
      </g>
    </Frame>
  );
}

/** Onboarding 3  -  book ahead, know your seat. */
export function BookAheadIllustration() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      {/* route */}
      <motion.path
        d="M 20 96 L 78 84 L 78 40 L 150 40"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.expressive, ease: EASE }}
      />
      <circle cx="20" cy="96" r="5" fill={GREEN} />
      <circle cx="78" cy="84" r="4" fill={LIME} />
      {/* calendar */}
      <g transform="translate(118 22)">
        <rect x="0" y="0" width="64" height="64" rx="10" fill="#fff" stroke={NEUTRAL} />
        <rect x="0" y="0" width="64" height="16" rx="10" fill={GREEN} />
        <rect x="0" y="8" width="64" height="8" fill={GREEN} />
        <rect x="10" y="24" width="10" height="8" rx="2" fill={SAND} />
        <rect x="26" y="24" width="10" height="8" rx="2" fill={SAND} />
        <rect x="10" y="38" width="10" height="8" rx="2" fill={SAND} />
        <rect x="26" y="38" width="10" height="8" rx="2" fill={LIME} />
        <circle cx="47" cy="52" r="8" fill={LIME} />
        <path d="M 43 52 L 46 55 L 51 49" stroke={GREEN} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* seat */}
      <g transform="translate(170 96)">
        <rect x="0" y="4" width="26" height="20" rx="7" fill={TEAL} />
        <rect x="4" y="0" width="10" height="6" rx="3" fill={TEAL} />
        <circle cx="10" cy="24" r="3" fill={TEAL} />
        <circle cx="20" cy="24" r="3" fill={TEAL} />
      </g>
      <circle cx="150" cy="40" r="5" fill={GREEN} />
    </Frame>
  );
}

/** Booking success  -  car travels the route, then a checkmark. */
export function BookingSuccessArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      <motion.path
        d="M 16 98 Q 80 66 112 88 T 204 60"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.story, ease: EASE }}
      />
      <circle cx="16" cy="98" r="5" fill={GREEN} />
      <circle cx="204" cy="60" r="5" fill={GREEN} />
      {/* moving car */}
      <motion.g
        initial={rm ? false : { x: 6, y: 0 }}
        animate={{ x: 92, y: -18 }}
        transition={{ duration: DURATION.story, ease: EASE }}
      >
        <g transform="translate(60 108)">
          <rect x="0" y="6" width="44" height="15" rx="6" fill={GREEN} />
          <path d="M 8 6 L 12 -4 L 32 -4 L 38 6 Z" fill={GREEN} />
          <rect x="12" y="-2" width="8" height="7" rx="3" fill="#fff" />
          <rect x="23" y="-2" width="8" height="7" rx="3" fill="#fff" />
          <circle cx="10" cy="21" r="5.5" fill="#1A1A1A" />
          <circle cx="34" cy="21" r="5.5" fill="#1A1A1A" />
        </g>
      </motion.g>
      {/* checkmark */}
      <motion.g
        initial={rm ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: DURATION.story - 0.15, type: 'spring', stiffness: 320, damping: 18 }}
      >
        <circle cx="204" cy="60" r="16" fill={LIME} />
        <path d="M 197 60 L 202 66 L 211 55" stroke={GREEN} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Frame>
  );
}

/** Payment failure  -  dashed card + alert. */
export function PaymentFailureArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      <motion.g
        initial={rm ? false : { y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DURATION.standard, ease: EASE }}
      >
        <rect x="52" y="38" width="116" height="70" rx="12" fill="#fff" stroke={RED} strokeWidth="2" strokeDasharray="6 5" />
        <rect x="52" y="38" width="116" height="16" rx="12" fill={RED} />
        <rect x="52" y="46" width="116" height="8" fill={RED} />
        <rect x="66" y="66" width="34" height="6" rx="3" fill={NEUTRAL} />
        <rect x="66" y="80" width="22" height="6" rx="3" fill={NEUTRAL} />
        <motion.circle
          cx="150"
          cy="52"
          r="12"
          fill={RED}
          initial={rm ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 16 }}
        />
        <path d="M 145.5 47.5 L 154.5 56.5 M 154.5 47.5 L 145.5 56.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </motion.g>
    </Frame>
  );
}

/** No upcoming trips  -  road into the distance. */
export function NoTripsArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <circle cx="178" cy="38" r="14" fill="#E9F8C8" />
      {/* vanishing road */}
      <path d="M 70 160 L 102 74 L 118 74 L 150 160 Z" fill="#fff" />
      <path d="M 104 74 L 116 74 L 130 160 L 90 160 Z" fill={NEUTRAL} opacity="0.6" />
      <line x1="110" y1="74" x2="110" y2="160" stroke={LIME} strokeWidth="3" strokeDasharray="8 10" />
      <rect x="0" y="140" width="220" height="20" fill="#E3EAE8" />
      <rect x="18" y="52" width="30" height="34" rx="3" fill="#DCE6E4" />
      <rect x="172" y="64" width="26" height="28" rx="3" fill="#DCE6E4" />
    </Frame>
  );
}

/** No saved routes  -  calendar + road. */
export function NoRoutesArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <g transform="translate(76 40)">
        <rect x="0" y="0" width="68" height="68" rx="12" fill="#fff" stroke={NEUTRAL} />
        <rect x="0" y="0" width="68" height="18" rx="12" fill={GREEN} />
        <rect x="0" y="9" width="68" height="9" fill={GREEN} />
        <rect x="10" y="28" width="12" height="9" rx="2" fill={SAND} />
        <rect x="28" y="28" width="12" height="9" rx="2" fill={SAND} />
        <rect x="10" y="44" width="12" height="9" rx="2" fill={SAND} />
        <rect x="28" y="44" width="12" height="9" rx="2" fill={LIME} />
        <rect x="46" y="44" width="12" height="9" rx="2" fill={SAND} />
      </g>
      <motion.path
        d="M 40 152 C 60 130 120 120 180 128"
        fill="none"
        stroke={TEAL}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.expressive, ease: EASE }}
      />
      <circle cx="40" cy="152" r="5" fill={GREEN} />
      <circle cx="180" cy="128" r="5" fill={LIME} />
    </Frame>
  );
}

/** No available trip  -  map pin on dashed route. */
export function NoTripArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <path d="M 20 40 L 60 40 L 60 100 L 120 100" fill="none" stroke={NEUTRAL} strokeWidth="6" />
      <path d="M 20 40 L 60 40 L 60 100 L 120 100" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
      <path d="M 130 40 L 170 40 L 170 100 L 200 100" fill="none" stroke={NEUTRAL} strokeWidth="6" />
      <g transform="translate(100 96)">
        <path d="M 0 0 C -18 -16 -18 -40 0 -40 C 18 -40 18 -16 0 0 Z" fill={GREEN} />
        <circle cx="0" cy="-20" r="9" fill="#fff" />
        <circle cx="0" cy="-20" r="5" fill={LIME} />
      </g>
      <circle cx="140" cy="100" r="5" fill={TEAL} />
      <circle cx="196" cy="100" r="5" fill={GREEN} />
    </Frame>
  );
}

/** Driver cancelled  -  broken route with a gap. */
export function DriverCancelledArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      <path d="M 24 92 Q 70 70 96 78" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M 124 78 Q 160 70 196 92" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
      <motion.circle
        cx="110"
        cy="78"
        r="9"
        fill={RED}
        initial={rm ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
      />
      <path d="M 106.5 74.5 L 113.5 81.5 M 113.5 74.5 L 106.5 81.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="92" r="5" fill={GREEN} />
      <circle cx="196" cy="92" r="5" fill={GREEN} />
      {/* separated car */}
      <g transform="translate(46 108)">
        <rect x="0" y="6" width="44" height="15" rx="6" fill={RED} />
        <path d="M 8 6 L 12 -4 L 32 -4 L 38 6 Z" fill={RED} />
        <rect x="12" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <rect x="23" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <circle cx="10" cy="21" r="5.5" fill="#1A1A1A" />
        <circle cx="34" cy="21" r="5.5" fill="#1A1A1A" />
      </g>
    </Frame>
  );
}

/** Alternative found  -  two routes converging into a check. */
export function AlternativeArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      <path d="M 16 96 Q 60 80 96 84" fill="none" stroke={NEUTRAL} strokeWidth="3" strokeLinecap="round" />
      <path d="M 16 110 Q 60 96 96 84" fill="none" stroke={NEUTRAL} strokeWidth="3" strokeLinecap="round" />
      <motion.path
        d="M 96 84 Q 150 70 200 88"
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.expressive, ease: EASE }}
      />
      <circle cx="16" cy="96" r="5" fill={GREEN} />
      <circle cx="16" cy="110" r="5" fill={GREEN} />
      <motion.g
        initial={rm ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
      >
        <circle cx="200" cy="88" r="13" fill={LIME} />
        <path d="M 194 88 L 199 94 L 207 83" stroke={GREEN} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Frame>
  );
}

/** Trip complete  -  destination pin with check. */
export function TripCompleteArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <RoadBase />
      <motion.path
        d="M 24 110 Q 80 88 140 76 T 200 60"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.expressive, ease: EASE }}
      />
      <circle cx="24" cy="110" r="5" fill={GREEN} />
      <motion.g
        initial={rm ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 280, damping: 16 }}
      >
        <path d="M 200 28 C 176 28 176 64 200 64 C 224 64 224 28 200 28 Z" fill={LIME} />
        <circle cx="200" cy="40" r="4" fill={GREEN} />
        <path d="M 192 55 L 197 62 L 209 50" stroke={GREEN} strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
      <g transform="translate(58 112)">
        <rect x="0" y="6" width="44" height="15" rx="6" fill={GREEN} />
        <path d="M 8 6 L 12 -4 L 32 -4 L 38 6 Z" fill={GREEN} />
        <rect x="12" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <rect x="23" y="-2" width="8" height="7" rx="3" fill="#fff" />
        <circle cx="10" cy="21" r="5.5" fill="#1A1A1A" />
        <circle cx="34" cy="21" r="5.5" fill="#1A1A1A" />
      </g>
    </Frame>
  );
}

/** Safety  -  shield + SOS. */
export function SafetyArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <rect x="30" y="30" width="36" height="44" rx="4" fill="#DCE6E4" />
      <rect x="154" y="26" width="32" height="48" rx="4" fill="#E9F8C8" />
      <motion.g
        initial={rm ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: DURATION.standard, ease: EASE }}
      >
        <path d="M 110 16 L 138 25 L 138 60 Q 138 90 110 104 Q 82 90 82 60 L 82 25 Z" fill={GREEN} />
        <path d="M 110 30 L 128 36 L 128 56 Q 128 76 110 88 Q 92 76 92 56 L 92 36 Z" fill="#fff" opacity="0.92" />
        <path d="M 101 57 L 108 65 L 119 48" stroke={LIME} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <g transform="translate(20 108)">
        <rect x="0" y="6" width="44" height="15" rx="6" fill={GREEN} />
        <path d="M 8 6 L 12 -4 L 32 -4 L 38 6 Z" fill={GREEN} />
        <circle cx="10" cy="21" r="5.5" fill="#1A1A1A" />
        <circle cx="34" cy="21" r="5.5" fill="#1A1A1A" />
      </g>
      <rect x="158" y="116" width="42" height="26" rx="13" fill={RED} />
      <text x="179" y="134" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="inherit">
        SOS
      </text>
    </Frame>
  );
}

/** Offline  -  cloud slash + phone. */
export function OfflineArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <g transform="translate(66 30)">
        <rect x="0" y="14" width="88" height="112" rx="16" fill="#fff" stroke={NEUTRAL} />
        <rect x="0" y="14" width="88" height="18" rx="16" fill={GREEN} />
        <rect x="0" y="23" width="88" height="9" fill={GREEN} />
        <rect x="22" y="58" width="44" height="5" rx="2.5" fill={NEUTRAL} />
        <rect x="34" y="72" width="20" height="5" rx="2.5" fill={NEUTRAL} />
        <rect x="34" y="104" width="20" height="4" rx="2" fill={GREEN} />
      </g>
      <g transform="translate(150 40)">
        <path d="M 6 34 C 2 30 2 22 8 18 C 14 14 22 14 26 18 C 30 22 30 30 26 34" fill="none" stroke={NEUTRAL} strokeWidth="4" strokeLinecap="round" />
        <path d="M 12 34 L 24 34" stroke={NEUTRAL} strokeWidth="4" strokeLinecap="round" />
        <circle cx="18" cy="40" r="3" fill={TEAL} />
      </g>
      <motion.line
        x1="138"
        y1="26"
        x2="196"
        y2="60"
        stroke={RED}
        strokeWidth="4"
        strokeLinecap="round"
        initial={rm ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: DURATION.fast }}
      />
    </Frame>
  );
}

/** Generic error  -  alert circle. */
export function ErrorArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <motion.circle
        cx="110"
        cy="80"
        r="34"
        fill={RED}
        initial={rm ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      />
      <rect x="105" y="64" width="10" height="22" rx="4" fill="#fff" />
      <circle cx="110" cy="95" r="4.5" fill="#fff" />
      <rect x="24" y="36" width="30" height="38" rx="4" fill="#DCE6E4" />
      <rect x="166" y="42" width="26" height="32" rx="4" fill="#DCE6E4" />
    </Frame>
  );
}

/** Verification success (KYC)  -  badge with check. */
export function VerificationSuccessArt() {
  const rm = useReducedMotion();
  return (
    <Frame>
      <rect width="220" height="160" fill={SAND} />
      <motion.g
        initial={rm ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      >
        <circle cx="110" cy="80" r="42" fill={GREEN} />
        <circle cx="110" cy="80" r="30" fill={LIME} />
        <path d="M 94 80 L 105 92 L 126 68" stroke={GREEN} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <rect x="30" y="40" width="28" height="34" rx="4" fill="#DCE6E4" />
      <rect x="162" y="36" width="28" height="38" rx="4" fill="#E9F8C8" />
    </Frame>
  );
}
