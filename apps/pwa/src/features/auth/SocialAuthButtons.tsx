/**
 * Official "Sign in with Google" and "Sign in with Apple" buttons.
 *
 * The artwork is served straight from the providers, no custom styling:
 *   - Google: the light themed standard button image hosted on
 *     developers.google.com (the same asset shown in Google's own
 *     branding guidelines).
 *   - Apple: a button rendered by Apple's official button service
 *     (appleid.cdn-apple.com/appleid/button).
 *
 * These are prototype buttons: the live OAuth flows arrive with the real
 * backend, so clicking one shows a short note instead of pretending to
 * start a sign-in. aria-labels keep them usable for screen readers.
 */
import { useState } from 'react';
import { Info } from 'lucide-react';

const GOOGLE_BUTTON_SRC = 'https://developers.google.com/static/identity/gsi/web/images/standard-button-white.png';
const APPLE_BUTTON_SRC = 'https://appleid.cdn-apple.com/appleid/button?type=sign-in&color=black&border_radius=5&width=240&height=44';

export function SocialAuthButtons() {
  const [hint, setHint] = useState(false);
  const note = () => setHint(true);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={note}
        aria-label="Sign in with Google"
        className="tap flex h-11 w-full items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-line transition hover:ring-forest-600"
      >
        <img src={GOOGLE_BUTTON_SRC} alt="" className="h-full w-full object-contain" loading="lazy" />
      </button>
      <button
        type="button"
        onClick={note}
        aria-label="Sign in with Apple"
        className="tap flex h-11 w-full items-center justify-center overflow-hidden rounded-lg bg-black transition hover:bg-[#1f2937]"
      >
        <img src={APPLE_BUTTON_SRC} alt="" className="h-full w-full object-contain" loading="lazy" />
      </button>
      {hint && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-[12.5px] font-semibold leading-relaxed text-variant">
          <Info size={15} className="mt-0.5 shrink-0 text-forest-700" />
          Google and Apple sign in are part of the live release. Use your email or phone number for now.
        </p>
      )}
    </div>
  );
}
