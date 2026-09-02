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

type InputMode = 'email' | 'phone';

export default function Signup() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>('email');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!firstName.trim() || !lastName.trim()) { setError('Enter your full name.'); return; }
    const identifier = mode === 'email' ? email : phone;
    if (!identifier.trim()) { setError(`Enter your ${mode}.`); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords don\'t match.'); return; }

    setLoading(true);
    const result = await authService.signup({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: mode === 'email' ? email.trim() : `${phone.replace(/\D/g, '')}@phone.comuta.app`,
      phone: mode === 'phone' ? phone : '08000000000',
      password,
    });
    setLoading(false);
    if (!result.ok) { setError(result.error || 'Sign up failed.'); return; }
    router.push('/(auth)/otp');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Svg width={40} height={40} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
              <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
              <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
            </Svg>
            <Text style={styles.logoText}>Comuta</Text>
          </View>

          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Book or post rides in few clicks.</Text>

          {/* Social auth */}
          <Button label="Continue with Google" variant="secondary" onPress={() => {}} icon={<Text style={styles.socialIcon}>G</Text>} style={styles.socialButton} />
          <Button label="Continue with Apple" variant="secondary" onPress={() => {}} icon={<Text style={styles.socialIcon}></Text>} style={styles.socialButton} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Mode toggle */}
          <View style={styles.modeToggle}>
            <Pressable onPress={() => setMode('email')} style={[styles.modeButton, mode === 'email' && styles.modeButtonActive]}>
              <Mail size={16} color={mode === 'email' ? colors.forest[900] : colors.muted} />
              <Text style={[styles.modeLabel, mode === 'email' && styles.modeLabelActive]}>Email</Text>
            </Pressable>
            <Pressable onPress={() => setMode('phone')} style={[styles.modeButton, mode === 'phone' && styles.modeButtonActive]}>
              <Phone size={16} color={mode === 'phone' ? colors.forest[900] : colors.muted} />
              <Text style={[styles.modeLabel, mode === 'phone' && styles.modeLabelActive]}>Phone Number</Text>
            </Pressable>
          </View>

          {/* Name fields */}
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Input label="First name" value={firstName} onChangeText={setFirstName} placeholder="e.g. Ade" autoCapitalize="words" />
            </View>
            <View style={styles.nameField}>
              <Input label="Last name" value={lastName} onChangeText={setLastName} placeholder="e.g. Kolawole" autoCapitalize="words" />
            </View>
          </View>

          {mode === 'email' ? (
            <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          ) : (
            <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="0803 123 4567" keyboardType="phone-pad" />
          )}

          <PasswordInput label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" helperText="At least 8 characters, with a number and a letter." />
          <PasswordInput label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button label="Create account" onPress={handleSignup} loading={loading} />

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to Comuta's{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>An account already exists with this email/phone. </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
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
  nameRow: { flexDirection: 'row', gap: spacing[3] },
  nameField: { flex: 1 },
  errorText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.red[500], marginBottom: spacing[4], textAlign: 'center' },
  terms: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted, textAlign: 'center', marginTop: spacing[4], lineHeight: 18 },
  termsLink: { color: colors.forest[700], fontFamily: fontFamily.medium },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing[4], flexWrap: 'wrap' },
  loginText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted },
  loginLink: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.forest[700] },
});
