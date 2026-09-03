/**
 * Official "Sign in with Google" and "Sign in with Apple" buttons.
 *
 * These are the providers' own button components, not lookalikes and not
 * screenshots of them:
 *
 *   - Apple  — `AppleAuthentication.AppleAuthenticationButton` wraps UIKit's
 *              `ASAuthorizationAppleIDButton`. Apple draws it, so it always
 *              satisfies the Human Interface Guidelines (mark, corner radius,
 *              type, and the localised label) and updates with the OS.
 *              iOS only; Apple ships no Android or web equivalent.
 *   - Google — `GoogleSigninButton` from Google's own Sign-In SDK, which
 *              renders the platform button from Google's bundled assets to
 *              their branding guidelines.
 *
 * Both are native components: they render in a development build, not in a
 * plain web preview. `SocialAuthButtons` therefore degrades explicitly — on a
 * platform where a provider ships no official button, nothing is drawn for it
 * rather than a homemade imitation, which is exactly what the branding rules
 * forbid.
 *
 * Placement and spacing follow the Figma auth frames (46:9, 58:197, 58:256);
 * the button artwork itself is the provider's.
 */
import { Platform, StyleSheet, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { radii, spacing } from '@comuta/tokens';

/** Figma's auth frames size these at the 362px content width, 44px tall. */
const BUTTON_WIDTH = 362;
const BUTTON_HEIGHT = 44;

export type SocialAuthButtonsProps = {
  /** "signin" renders "Sign in with…", "signup" renders "Sign up with…". */
  intent?: 'signin' | 'signup';
  onGoogle: () => void;
  onApple: (credential: AppleAuthentication.AppleAuthenticationCredential) => void;
  onError?: (error: unknown) => void;
};

export function SocialAuthButtons({
  intent = 'signin',
  onGoogle,
  onApple,
  onError,
}: SocialAuthButtonsProps) {
  const appleLabel =
    intent === 'signup'
      ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
      : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN;

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      onApple(credential);
    } catch (e) {
      // The user dismissing the sheet is a normal outcome, not a failure.
      if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') return;
      onError?.(e);
    }
  };

  return (
    <View style={styles.stack}>
      <GoogleSigninButton
        style={styles.google}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={onGoogle}
      />

      {/* Apple ships this button on iOS only. */}
      {Platform.OS === 'ios' ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={appleLabel}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={radii.md}
          style={styles.apple}
          onPress={signInWithApple}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing[3], alignItems: 'center' },
  google: { width: BUTTON_WIDTH, height: 48 },
  apple: { width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
});
