/**
 * Log in — Figma nodes 58:256 (phone) and 62:314 (email).
 *
 * Same shell as signup with a shorter form: one identifier, one password, and
 * a right-aligned "Forgot password?" in the error colour.
 *
 * Divergence from the frames, at the user's instruction: the provider buttons
 * are Apple's and Google's official components rather than the ones drawn in
 * Figma. See SocialAuthButtons.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import { semantic, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import {
  AuthFooterLink,
  AuthHeading,
  AuthScreen,
  ButtonLarge,
  Field,
  LabelledDivider,
  SegmentedPair,
  Wordmark,
} from '../../components/figma/Auth';
import { SocialAuthButtons } from '../../components/figma/SocialAuthButtons';

const METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
] as const;

type Method = (typeof METHODS)[number]['value'];

export default function Login() {
  const [method, setMethod] = useState<Method>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);

  const submit = () => router.replace('/(rider)/home');

  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading title="Welcome back" subtitle="Log in to continue." />

      <View style={styles.body}>
        <SocialAuthButtons intent="signin" onGoogle={submit} onApple={submit} />

        <LabelledDivider label="or log in with" />

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

          <View style={styles.passwordGroup}>
            <Field
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!reveal}
              autoCapitalize="none"
              autoComplete="current-password"
              trailing={
                <Pressable
                  onPress={() => setReveal((v) => !v)}
                  hitSlop={spacing[2]}
                  accessibilityRole="button"
                  accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
                >
                  {reveal ? (
                    <EyeOff size={20} color={semantic.onSurfaceVariant} />
                  ) : (
                    <Eye size={20} color={semantic.onSurfaceVariant} />
                  )}
                </Pressable>
              }
            />
            <Pressable
              onPress={() => router.push('/(auth)/forgot')}
              accessibilityRole="link"
              hitSlop={spacing[2]}
              style={styles.forgotWrap}
            >
              <Type variant="labelSmall" color={semantic.error}>
                Forgot password?
              </Type>
            </Pressable>
          </View>

          <ButtonLarge label="Log in" onPress={submit} />

          <AuthFooterLink
            prompt="New to Comuta?"
            action="Sign up"
            onPress={() => router.replace('/(auth)/signup')}
          />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing[5] },
  form: { gap: spacing[4] },
  passwordGroup: { gap: spacing[1] },
  forgotWrap: { alignSelf: 'flex-end' },
});
