/**
 * Set a new password — Figma node 65:241.
 *
 * Reached from the OTP screen when it is running the reset flow.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import { semantic, spacing } from '@comuta/tokens';
import {
  AuthHeading,
  AuthScreen,
  ButtonLarge,
  Field,
  Wordmark,
} from '../../components/figma/Auth';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [reveal, setReveal] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;

  const toggle = (
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
  );

  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Set a new password"
        subtitle="Choose a new password for your account."
      />

      <View style={styles.form}>
        <Field
          label="New password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!reveal}
          autoCapitalize="none"
          autoComplete="new-password"
          trailing={toggle}
        />
        <Field
          label="Confirm new password"
          placeholder="Re-enter new password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!reveal}
          autoCapitalize="none"
          autoComplete="new-password"
          error={mismatch ? 'Passwords do not match.' : undefined}
          trailing={toggle}
        />
        <ButtonLarge
          label="Reset password"
          onPress={() => router.replace('/(auth)/password-reset-done')}
          disabled={password.length === 0 || mismatch}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing[4] },
});
