import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily, fontSize, spacing, radii } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-verify when complete
    if (value && index === OTP_LENGTH - 1) {
      const fullCode = newCode.join('');
      if (fullCode.length === OTP_LENGTH) {
        verifyCode(fullCode);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const verifyCode = async (fullCode: string) => {
    setLoading(true);
    const result = await authService.verifyOtp(fullCode);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Invalid code.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Continue to KYC
    router.replace('/(auth)/kyc');
  };

  const resendCode = async () => {
    if (resendTimer > 0) return;
    await authService.sendOtp('mock');
    setResendTimer(60);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Back button */}
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
        <ArrowLeft size={24} color={colors.onsurface} />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Verify your account</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code we sent to your email or phone number.
        </Text>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputs.current[i] = ref; }}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                error ? styles.otpBoxError : null,
              ]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor={colors.forest[600]}
              textContentType="oneTimeCode"
              autoComplete={i === 0 ? 'sms-otp' : undefined}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Resend */}
        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>
              Resend code in {resendTimer}s
            </Text>
          ) : (
            <Pressable onPress={resendCode}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.voiceCall}>Didn't get it? Try voice call</Text>

        <View style={styles.cta}>
          <Button
            label="Verify"
            onPress={() => verifyCode(code.join(''))}
            loading={loading}
            disabled={code.join('').length < OTP_LENGTH}
          />
        </View>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.wrongEmail}>Wrong email or phone? Go back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  backButton: { paddingHorizontal: spacing[5], paddingVertical: spacing[3] },
  content: { flex: 1, paddingHorizontal: spacing[6], paddingTop: spacing[4] },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, marginBottom: spacing[2] },
  subtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, marginBottom: spacing[8], lineHeight: 22 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: spacing[4] },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.lg,
    textAlign: 'center',
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.onsurface,
    backgroundColor: colors.white,
  },
  otpBoxFilled: { borderColor: colors.forest[600], borderWidth: 2 },
  otpBoxError: { borderColor: colors.red[500] },
  errorText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.red[500], textAlign: 'center', marginBottom: spacing[4] },
  resendContainer: { alignItems: 'center', marginBottom: spacing[2] },
  resendTimer: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted },
  resendLink: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.forest[700] },
  voiceCall: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.teal[600], textAlign: 'center', marginBottom: spacing[8] },
  cta: { marginBottom: spacing[6] },
  wrongEmail: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.muted, textAlign: 'center' },
});
