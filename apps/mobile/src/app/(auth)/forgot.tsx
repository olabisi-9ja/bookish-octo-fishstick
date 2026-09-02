import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect } from 'react-native-svg';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Input, PasswordInput } from '../../components/ui/Input';
import { authService } from '../../services/authService';

function ComutaLogo({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
      <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
      <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
    </Svg>
  );
}

type Step = 'identify' | 'otp' | 'newPassword' | 'done';
type InputMode = 'email' | 'phone';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identify');
  const [inputMode, setInputMode] = useState<InputMode>('email');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleSendOtp = async () => {
    setError('');
    if (!identifier.trim()) {
      setError(inputMode === 'email' ? 'Enter your email address.' : 'Enter your phone number.');
      return;
    }
    setLoading(true);
    const result = await authService.resetPassword(identifier);
    setLoading(false);
    if (!result.ok) { setError(result.error || 'Failed to send code.'); return; }
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the full 6-digit code.'); return; }
    setLoading(true);
    const result = await authService.verifyOtp(code);
    setLoading(false);
    if (!result.ok) { setError(result.error || 'Invalid code.'); return; }
    setStep('newPassword');
  };

  const handleSetPassword = async () => {
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords don\'t match.'); return; }
    setLoading(true);
    const result = await authService.setNewPassword(identifier, newPassword);
    setLoading(false);
    if (!result.ok) { setError(result.error || 'Failed.'); return; }
    setStep('done');
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Done screen ──
  if (step === 'done') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Logo header */}
        <View style={styles.logoHeader}>
          <View style={styles.logoRow}>
            <ComutaLogo size={28} />
            <Text style={styles.logoText}>Comuta</Text>
          </View>
        </View>
        <View style={styles.successContainer}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.successIcon}>
            <Svg width={80} height={80} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="48" fill={colors.forest[50]} />
              <Circle cx="50" cy="50" r="38" fill={colors.forest[100]} />
              <Rect x="30" y="45" width="18" height="4" rx="2" fill={colors.forest[600]} transform="rotate(-45, 39, 47)" />
              <Rect x="42" y="40" width="28" height="4" rx="2" fill={colors.forest[600]} transform="rotate(45, 56, 42)" />
            </Svg>
          </Animated.View>
          <Text style={styles.successTitle}>Password reset</Text>
          <Text style={styles.successSubtitle}>Your password has been changed. Log in with your new credentials.</Text>
          <Button label="Log in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Logo header */}
      <View style={styles.logoHeader}>
        <View style={styles.logoRow}>
          <ComutaLogo size={28} />
          <Text style={styles.logoText}>Comuta</Text>
        </View>
      </View>

      {/* Back button */}
      <Pressable onPress={() => {
        if (step === 'identify') router.back();
        else if (step === 'otp') setStep('identify');
        else if (step === 'newPassword') setStep('otp');
      }} style={styles.backButton} hitSlop={12}>
        <ArrowLeft size={24} color={colors.onsurface} />
      </Pressable>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Step: Identify */}
          {step === 'identify' && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.subtitle}>
                Enter your email or phone number and we'll send you a reset link.
              </Text>

              {/* Email / Phone toggle */}
              <View style={styles.toggleRow}>
                <Pressable
                  style={[styles.toggleTab, inputMode === 'email' && styles.toggleTabActive]}
                  onPress={() => { setInputMode('email'); setIdentifier(''); setError(''); }}
                >
                  <Text style={[styles.toggleText, inputMode === 'email' && styles.toggleTextActive]}>Email</Text>
                </Pressable>
                <Pressable
                  style={[styles.toggleTab, inputMode === 'phone' && styles.toggleTabActive]}
                  onPress={() => { setInputMode('phone'); setIdentifier(''); setError(''); }}
                >
                  <Text style={[styles.toggleText, inputMode === 'phone' && styles.toggleTextActive]}>Phone Number</Text>
                </Pressable>
              </View>

              {inputMode === 'email' ? (
                <Input
                  label="Email"
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              ) : (
                <Input
                  label="Phone Number"
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="+234 XXX XXXX"
                  keyboardType="phone-pad"
                />
              )}

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={{ marginTop: spacing[4] }}>
                <Button label="Send OTP code" onPress={handleSendOtp} loading={loading} />
              </View>
            </Animated.View>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={styles.title}>Enter the code</Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to {inputMode === 'email' ? 'your email' : 'your phone number'}. Enter it below to reset your password.
              </Text>

              {/* OTP input boxes */}
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    style={[styles.otpBox, digit && styles.otpBoxFilled]}
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, i)}
                    onKeyPress={(e) => handleOtpKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <Pressable style={styles.resendRow}>
                <Text style={styles.resendText}>
                  Didn't get a code? <Text style={styles.resendLink}>Resend</Text>
                </Text>
              </Pressable>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={{ marginTop: spacing[4] }}>
                <Button label="Verify code" onPress={handleVerifyOtp} loading={loading} />
              </View>
            </Animated.View>
          )}

          {/* Step: New Password */}
          {step === 'newPassword' && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={styles.title}>Set a new password</Text>
              <Text style={styles.subtitle}>
                Choose a new password for your account.
              </Text>

              <PasswordInput
                label="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
              />
              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your new password"
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={{ marginTop: spacing[4] }}>
                <Button label="Reset password" onPress={handleSetPassword} loading={loading} />
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  // Logo header
  logoHeader: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: fontFamily.bold, fontSize: fontSize.titleMedium, color: colors.forest[900] },

  // Back
  backButton: { paddingHorizontal: spacing[5], paddingVertical: spacing[2] },

  // Content
  scroll: { paddingHorizontal: spacing[6], paddingTop: spacing[2], paddingBottom: spacing[8] },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, marginBottom: spacing[2] },
  subtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, marginBottom: spacing[6], lineHeight: 22 },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    padding: 4,
    marginBottom: spacing[5],
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  toggleTabActive: {
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  toggleText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
  },
  toggleTextActive: {
    color: colors.forest[900],
    fontFamily: fontFamily.semibold,
  },

  // OTP
  otpRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
    justifyContent: 'center',
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.headlineMedium,
    color: colors.onsurface,
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: colors.forest[600],
    backgroundColor: colors.forest[50],
  },

  // Resend
  resendRow: { alignItems: 'center', marginBottom: spacing[4] },
  resendText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted },
  resendLink: { fontFamily: fontFamily.semibold, color: colors.forest[600] },

  // Error
  errorText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.red[500], marginBottom: spacing[4], textAlign: 'center' },

  // Success
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[8], gap: spacing[4] },
  successIcon: { marginBottom: spacing[4] },
  successTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface },
  successSubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, textAlign: 'center', marginBottom: spacing[6], lineHeight: 22 },
});
