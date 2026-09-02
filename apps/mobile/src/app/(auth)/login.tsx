import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect } from 'react-native-svg';
import { Mail, Phone } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Input, PasswordInput } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';

type InputMode = 'email' | 'phone';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    const identifier = mode === 'email' ? email : phone;
    if (!identifier.trim()) {
      setError(`Enter your ${mode === 'email' ? 'email' : 'phone number'}.`);
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setLoading(true);
    const result = await authService.login(
      mode === 'email' ? email : `${phone}@phone.comuta.app`,
      password
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Login failed.');
      return;
    }
    // Navigate based on session state
    const session = useComuta.getState().session;
    if (session) {
      if (!session.kycComplete) {
        router.replace('/(auth)/kyc');
      } else if (session.role === 'driver' && session.driverOnboarded) {
        router.replace('/(driver)/home');
      } else {
        router.replace('/(rider)/home');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Svg width={40} height={40} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
              <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
              <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
            </Svg>
            <Text style={styles.logoText}>Comuta</Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue.</Text>

          {/* Social auth — secondary weight */}
          <Button
            label="Continue with Google"
            variant="secondary"
            onPress={() => {}}
            icon={<Text style={styles.socialIcon}>G</Text>}
            style={styles.socialButton}
          />
          <Button
            label="Continue with Apple"
            variant="secondary"
            onPress={() => {}}
            icon={<Text style={styles.socialIcon}></Text>}
            style={styles.socialButton}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or log in with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Mode toggle */}
          <View style={styles.modeToggle}>
            <Pressable
              onPress={() => setMode('email')}
              style={[styles.modeButton, mode === 'email' && styles.modeButtonActive]}
            >
              <Mail size={16} color={mode === 'email' ? colors.forest[900] : colors.muted} />
              <Text style={[styles.modeLabel, mode === 'email' && styles.modeLabelActive]}>
                Email
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('phone')}
              style={[styles.modeButton, mode === 'phone' && styles.modeButtonActive]}
            >
              <Phone size={16} color={mode === 'phone' ? colors.forest[900] : colors.muted} />
              <Text style={[styles.modeLabel, mode === 'phone' && styles.modeLabelActive]}>
                Phone Number
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          {mode === 'email' ? (
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          ) : (
            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="0803 123 4567"
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          )}

          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {/* Forgot password */}
          <Pressable onPress={() => router.push('/(auth)/forgot')} style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login CTA */}
          <Button label="Log in" onPress={handleLogin} loading={loading} />

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>New to Comuta? </Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: spacing[6], paddingTop: spacing[4], paddingBottom: spacing[8] },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing[8] },
  logoText: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.forest[900] },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, marginBottom: spacing[2] },
  subtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, marginBottom: spacing[6] },
  socialButton: { marginBottom: spacing[3] },
  socialIcon: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.forest[900] },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing[5], gap: spacing[3] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.lineSoft },
  dividerText: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.faint },
  modeToggle: { flexDirection: 'row', marginBottom: spacing[5], gap: spacing[2], backgroundColor: colors.surface2, borderRadius: radii.lg, padding: 4 },
  modeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: radii.md },
  modeButtonActive: { backgroundColor: colors.white, shadowColor: colors.forest[900], shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  modeLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.muted },
  modeLabelActive: { color: colors.forest[900] },
  forgotButton: { alignSelf: 'flex-end', marginBottom: spacing[5], marginTop: -spacing[2] },
  forgotText: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.forest[700] },
  errorText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.red[500], marginBottom: spacing[4], textAlign: 'center' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing[6] },
  signupText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted },
  signupLink: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.forest[700] },
});
