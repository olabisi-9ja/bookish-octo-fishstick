/**
 * Create an account — Figma nodes 46:9 (email) and 58:197 (phone).
 *
 * The two frames are the same screen with the segmented control flipped, so
 * they are one route here; `method` picks which identifier field shows.
 *
 * Divergence from the frames, at the user's instruction: Figma draws its own
 * "Continue with Google" / "Continue with Apple" buttons, but the providers
 * require their own button artwork. `SocialAuthButtons` renders Apple's and
 * Google's official components in that slot instead.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import { semantic, spacing } from '@comuta/tokens';
import {
  AuthFooterLink,
  AuthHeading,
  AuthScreen,
  ButtonLarge,
  Field,
  LabelledDivider,
  LegalNote,
  SegmentedPair,
  Wordmark,
} from '../../components/figma/Auth';
import { SocialAuthButtons } from '../../components/figma/SocialAuthButtons';

const METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
] as const;

type Method = (typeof METHODS)[number]['value'];

/** Figma 58:162 — shown under both password fields. */
const PASSWORD_RULE = 'At least 8 characters, with a number and a letter.';

export default function Signup() {
  const [method, setMethod] = useState<Method>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [reveal, setReveal] = useState(false);

  const submit = () => router.push('/(auth)/otp');

  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading title="Welcome to Comuta" subtitle="Sign in to book or post a ride." />

      <View style={styles.body}>
        <SocialAuthButtons
          intent="signup"
          onGoogle={submit}
          onApple={submit}
        />

        <LabelledDivider label="or sign up with" />

        <View style={styles.form}>
          <SegmentedPair options={METHODS} value={method} onChange={setMethod} />

          {method === 'email' ? (
            <Field
              label="Email Address"
              placeholder="you@example.com"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
            />
          ) : (
            <Field
              label="Phone Number"
              placeholder="0801 234 5678"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="phone-pad"
              autoComplete="tel"
              inputMode="tel"
            />
          )}

          <Field
            label="Password"
            placeholder="Create a password"
            hint={PASSWORD_RULE}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!reveal}
            autoCapitalize="none"
            autoComplete="new-password"
            trailing={<RevealToggle on={reveal} onToggle={() => setReveal((v) => !v)} />}
          />

          <Field
            label="Confirm password"
            placeholder="Re-enter your password"
            hint={PASSWORD_RULE}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!reveal}
            autoCapitalize="none"
            autoComplete="new-password"
            trailing={<RevealToggle on={reveal} onToggle={() => setReveal((v) => !v)} />}
          />

          <View style={styles.submitGroup}>
            <ButtonLarge label="Create account" onPress={submit} />
            <LegalNote>
              By continuing, you agree to Comuta&apos;s Terms of Service and Privacy Policy.
            </LegalNote>
          </View>

          <AuthFooterLink
            prompt="An account already exists with this email/phone."
            action="Log In"
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>
      </View>
    </AuthScreen>
  );
}

function RevealToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const Icon = on ? EyeOff : Eye;
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={spacing[2]}
      accessibilityRole="button"
      accessibilityLabel={on ? 'Hide password' : 'Show password'}
    >
      <Icon size={20} color={semantic.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing[5] },
  form: { gap: spacing[4] },
  submitGroup: { gap: spacing[2], alignItems: 'center' },
});
