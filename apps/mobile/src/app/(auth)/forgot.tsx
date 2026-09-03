/**
 * Reset your password — Figma nodes 62:368 (email) and 65:48 (phone).
 *
 * Same shell as the rest of auth: the segmented control picks which identifier
 * is asked for, and the action sends an OTP rather than a link despite the
 * subtitle's wording, which is what the button says.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { spacing } from '@comuta/tokens';
import {
  AuthHeading,
  AuthScreen,
  ButtonLarge,
  Field,
  SegmentedPair,
  Wordmark,
} from '../../components/figma/Auth';

const METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
] as const;

type Method = (typeof METHODS)[number]['value'];

export default function Forgot() {
  const [method, setMethod] = useState<Method>('email');
  const [identifier, setIdentifier] = useState('');

  const send = () =>
    router.push({ pathname: '/(auth)/otp', params: { channel: method, flow: 'reset' } });

  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Reset your password"
        subtitle="Enter your email or phone number and we'll send you a reset link."
      />

      <View style={styles.form}>
        <SegmentedPair options={METHODS} value={method} onChange={setMethod} />

        {method === 'email' ? (
          <Field
            label="Email"
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

        <ButtonLarge label="Send OTP code" onPress={send} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing[4] },
});
