/**
 * Official provider buttons — web build.
 *
 * The native file next to this one uses Apple's and Google's native button
 * components, which do not exist in a browser. Since the Expo app is also the
 * installable PWA, the web build renders the providers' own *web* buttons
 * rather than leaving the slot empty or drawing an imitation:
 *
 *   - Google — Google Identity Services. `google.accounts.id.renderButton`
 *              draws the button from Google's own assets, so it always matches
 *              their branding guidelines and localises itself.
 *   - Apple   — Sign in with Apple JS. `AppleID.auth.renderButton` draws
 *              Apple's official button.
 *
 * Both SDKs need a client ID issued alongside the backend. Until those exist
 * the slot renders a short note instead, because a provider button that cannot
 * complete a sign-in is worse than none.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { semantic, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';
import type { SocialAuthButtonsProps } from './SocialAuthButtons';

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.EXPO_PUBLIC_APPLE_CLIENT_ID;

const GOOGLE_SDK = 'https://accounts.google.com/gsi/client';
const APPLE_SDK =
  'https://appleid.cdn-apple.com/appleid/scripts/appleid/1/en_US/appleid.auth.js';

/** Figma sizes the auth buttons at the 362px content width. */
const BUTTON_WIDTH = 362;

/** Loads a provider SDK once, resolving when it is ready. */
function useScript(src: string, enabled: boolean) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') setReady(true);
      else existing.addEventListener('load', () => setReady(true), { once: true });
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.addEventListener('load', () => {
      el.dataset.loaded = 'true';
      setReady(true);
    });
    document.head.appendChild(el);
  }, [src, enabled]);
  return ready;
}

export function SocialAuthButtons({ intent = 'signin', onGoogle, onApple }: SocialAuthButtonsProps) {
  const configured = !!GOOGLE_CLIENT_ID || !!APPLE_CLIENT_ID;
  const googleReady = useScript(GOOGLE_SDK, !!GOOGLE_CLIENT_ID);
  const appleReady = useScript(APPLE_SDK, !!APPLE_CLIENT_ID);

  const googleSlot = useRef<View>(null);
  const appleSlot = useRef<View>(null);

  useEffect(() => {
    const g = (globalThis as { google?: any }).google;
    if (!googleReady || !g || !GOOGLE_CLIENT_ID) return;
    const host = googleSlot.current as unknown as HTMLElement | null;
    if (!host) return;
    g.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      // The ID token goes to the backend once it exists; the screen only needs
      // to know the sign-in succeeded, which matches the native contract.
      callback: () => onGoogle(),
    });
    g.accounts.id.renderButton(host, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: intent === 'signup' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: BUTTON_WIDTH,
    });
  }, [googleReady, intent, onGoogle]);

  useEffect(() => {
    const a = (globalThis as { AppleID?: any }).AppleID;
    if (!appleReady || !a || !APPLE_CLIENT_ID) return;
    a.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: 'name email',
      redirectURI: globalThis.location?.origin,
      usePopup: true,
    });
    const host = appleSlot.current as unknown as HTMLElement | null;
    if (host) a.auth.renderButton();
    const onSuccess = (e: Event) => onApple((e as CustomEvent).detail as never);
    document.addEventListener('AppleIDSignInOnSuccess', onSuccess);
    return () => document.removeEventListener('AppleIDSignInOnSuccess', onSuccess);
  }, [appleReady, onApple]);

  if (!configured) {
    return (
      <View style={styles.note} accessibilityRole="summary">
        <Type variant="labelSmall" color={semantic.onSurfaceVariant} style={styles.noteText}>
          Google and Apple sign-in render here once their client IDs are issued with
          the backend. Use your email or phone number for now.
        </Type>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {GOOGLE_CLIENT_ID ? <View ref={googleSlot} style={styles.slot} /> : null}
      {APPLE_CLIENT_ID ? (
        <View
          ref={appleSlot}
          style={styles.slot}
          // Sign in with Apple JS looks these up by attribute.
          {...{
            id: 'appleid-signin',
            'data-color': 'black',
            'data-border': 'true',
            'data-type': intent === 'signup' ? 'sign-up' : 'sign-in',
            'data-width': String(BUTTON_WIDTH),
            'data-height': '44',
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing[3], alignItems: 'center', width: '100%' },
  slot: { width: '100%', maxWidth: BUTTON_WIDTH, minHeight: 44 },
  note: {
    width: '100%',
    backgroundColor: semantic.surfaceContainer,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  noteText: { textAlign: 'center' },
});
