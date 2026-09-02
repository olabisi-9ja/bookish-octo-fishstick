import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect } from 'react-native-svg';
import { ArrowLeft, Camera, Upload, ChevronDown, CheckCircle, Clock, FileText } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';
import { ID_TYPES } from '../../constants';

type KycStep = 'idType' | 'document' | 'selfie' | 'pending' | 'complete';

export default function KycScreen() {
  const router = useRouter();
  const session = useComuta((s) => s.session);
  const [step, setStep] = useState<KycStep>('idType');
  const [selectedIdType, setSelectedIdType] = useState<string>('');
  const [showIdPicker, setShowIdPicker] = useState(false);
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const needsBackSide = selectedIdType === "Driver's licence" || selectedIdType === 'International passport';

  const handleSubmit = async () => {
    if (!session?.userId) return;
    setLoading(true);
    await authService.submitVerification(session.userId, selectedIdType, 'mock.jpg');
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep('complete');
  };

  // Success / complete state
  if (step === 'complete') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContent}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={colors.forest[600]} />
          </View>
          <Text style={styles.successTitle}>Identity verified</Text>
          <Text style={styles.successSubtitle}>
            You're all set. Your identity has been confirmed and you can now book commutes.
          </Text>
          <Button
            label="Continue"
            onPress={() => router.replace('/(auth)/role-select')}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Pending review state
  if (step === 'pending') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContent}>
          <View style={styles.pendingIcon}>
            <Clock size={56} color={colors.amber[500]} />
          </View>
          <Text style={styles.successTitle}>We're reviewing your details</Text>
          <Text style={styles.successSubtitle}>
            This usually takes less than 24 hours. We'll notify you as soon as your identity is confirmed.
          </Text>
          <Button
            label="Got it"
            onPress={() => {
              // In mock mode, auto-verify
              handleSubmit();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with logo */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ArrowLeft size={24} color={colors.onsurface} />
        </Pressable>
        <View style={styles.logoRow}>
          <Svg width={28} height={28} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
            <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
            <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
          </Svg>
          <Text style={styles.logoText}>Comuta</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {['ID type', 'Document', 'Selfie'].map((label, i) => {
            const stepIndex = ['idType', 'document', 'selfie'].indexOf(step);
            return (
              <View key={label} style={styles.progressItem}>
                <View style={[styles.progressDot, i <= stepIndex && styles.progressDotActive]} />
                <Text style={[styles.progressLabel, i <= stepIndex && styles.progressLabelActive]}>{label}</Text>
              </View>
            );
          })}
        </View>

        {/* Step 1: ID type selection */}
        {step === 'idType' && (
          <>
            <Text style={styles.title}>Verify your identity</Text>
            <Text style={styles.subtitle}>Select the type of government-issued ID you'll upload.</Text>

            <Pressable
              onPress={() => setShowIdPicker(!showIdPicker)}
              style={[styles.selectBox, showIdPicker && styles.selectBoxOpen]}
            >
              <Text style={[styles.selectText, !selectedIdType && styles.selectPlaceholder]}>
                {selectedIdType || 'Select ID type'}
              </Text>
              <ChevronDown size={20} color={colors.muted} />
            </Pressable>

            {showIdPicker && (
              <View style={styles.optionsList}>
                {ID_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setSelectedIdType(type);
                      setShowIdPicker(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={[styles.optionItem, selectedIdType === type && styles.optionItemSelected]}
                  >
                    <FileText size={18} color={selectedIdType === type ? colors.forest[600] : colors.muted} />
                    <Text style={[styles.optionText, selectedIdType === type && styles.optionTextSelected]}>{type}</Text>
                    {selectedIdType === type && <CheckCircle size={18} color={colors.forest[600]} />}
                  </Pressable>
                ))}
              </View>
            )}

            {/* Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Note:</Text>
              <Text style={styles.noteText}>
                Your ID is encrypted and only used to verify your identity. It won't be shown to other users.
              </Text>
            </View>

            <View style={styles.ctaBottom}>
              <Button
                label="Continue"
                onPress={() => setStep('document')}
                disabled={!selectedIdType}
              />
            </View>
          </>
        )}

        {/* Step 2: Document upload */}
        {step === 'document' && (
          <>
            <Text style={styles.title}>Upload your {selectedIdType}</Text>
            <Text style={styles.subtitle}>
              Take a clear photo or upload from your gallery. Make sure all text is readable.
            </Text>

            {/* Front side */}
            <Pressable
              onPress={() => { setFrontUploaded(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.uploadCard, frontUploaded && styles.uploadCardDone]}
            >
              {frontUploaded ? (
                <View style={styles.uploadDoneContent}>
                  <CheckCircle size={24} color={colors.forest[600]} />
                  <View>
                    <Text style={styles.uploadDoneTitle}>Front side uploaded</Text>
                    <Pressable onPress={() => setFrontUploaded(false)}>
                      <Text style={styles.uploadChangeText}>Change</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadContent}>
                  <View style={styles.uploadIconCircle}>
                    <Camera size={24} color={colors.forest[600]} />
                  </View>
                  <Text style={styles.uploadTitle}>Front side</Text>
                  <Text style={styles.uploadHint}>Tap to capture or upload</Text>
                </View>
              )}
            </Pressable>

            {/* Back side (conditional) */}
            {needsBackSide && (
              <Pressable
                onPress={() => { setBackUploaded(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.uploadCard, backUploaded && styles.uploadCardDone]}
              >
                {backUploaded ? (
                  <View style={styles.uploadDoneContent}>
                    <CheckCircle size={24} color={colors.forest[600]} />
                    <View>
                      <Text style={styles.uploadDoneTitle}>Back side uploaded</Text>
                      <Pressable onPress={() => setBackUploaded(false)}>
                        <Text style={styles.uploadChangeText}>Change</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <View style={styles.uploadIconCircle}>
                      <Upload size={24} color={colors.forest[600]} />
                    </View>
                    <Text style={styles.uploadTitle}>Back side</Text>
                    <Text style={styles.uploadHint}>Tap to capture or upload</Text>
                  </View>
                )}
              </Pressable>
            )}

            <View style={styles.ctaBottom}>
              <Button
                label="Continue"
                onPress={() => setStep('selfie')}
                disabled={!frontUploaded || (needsBackSide && !backUploaded)}
              />
            </View>
          </>
        )}

        {/* Step 3: Selfie */}
        {step === 'selfie' && (
          <>
            <Text style={styles.title}>Take a selfie</Text>
            <Text style={styles.subtitle}>
              We'll match your face against your ID to confirm your identity. Look straight at the camera in good lighting.
            </Text>

            <Pressable
              onPress={() => { setSelfieUploaded(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.selfieCard, selfieUploaded && styles.uploadCardDone]}
            >
              {selfieUploaded ? (
                <View style={styles.uploadDoneContent}>
                  <CheckCircle size={24} color={colors.forest[600]} />
                  <View>
                    <Text style={styles.uploadDoneTitle}>Selfie captured</Text>
                    <Pressable onPress={() => setSelfieUploaded(false)}>
                      <Text style={styles.uploadChangeText}>Retake</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.selfieContent}>
                  <View style={styles.selfieCircle}>
                    <Camera size={32} color={colors.forest[600]} />
                  </View>
                  <Text style={styles.uploadTitle}>Tap to take selfie</Text>
                </View>
              )}
            </Pressable>

            <View style={styles.ctaBottom}>
              <Button
                label="Submit verification"
                onPress={() => setStep('pending')}
                disabled={!selfieUploaded}
                loading={loading}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[3] },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.forest[900] },
  backButton: { padding: 4 },
  scroll: { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[8], gap: spacing[4] },
  progressItem: { alignItems: 'center', gap: 6 },
  progressDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: colors.lineSoft },
  progressDotActive: { backgroundColor: colors.forest[600] },
  progressLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.faint },
  progressLabelActive: { color: colors.forest[600] },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, marginBottom: spacing[2] },
  subtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, marginBottom: spacing[6], lineHeight: 22 },
  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, borderWidth: 1.5, borderColor: colors.line, borderRadius: radii.lg, paddingHorizontal: spacing[4], backgroundColor: colors.white, marginBottom: spacing[4] },
  selectBoxOpen: { borderColor: colors.forest[600], borderWidth: 2 },
  selectText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  selectPlaceholder: { color: colors.faint },
  optionsList: { marginBottom: spacing[6], borderRadius: radii.lg, backgroundColor: colors.white, ...shadows.soft, overflow: 'hidden' },
  optionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing[4], paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  optionItemSelected: { backgroundColor: colors.forest[50] },
  optionText: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  optionTextSelected: { fontFamily: fontFamily.medium, color: colors.forest[700] },
  uploadCard: { borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', borderRadius: radii.xl, padding: spacing[6], marginBottom: spacing[4], backgroundColor: colors.white, alignItems: 'center' },
  uploadCardDone: { borderStyle: 'solid', borderColor: colors.forest[100], backgroundColor: colors.forest[50] },
  uploadContent: { alignItems: 'center', gap: 8 },
  uploadIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.forest[50], alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  uploadTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  uploadHint: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  uploadDoneContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  uploadDoneTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.forest[700] },
  uploadChangeText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.teal[600], marginTop: 2 },
  selfieCard: { borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', borderRadius: radii.xl, padding: spacing[8], marginBottom: spacing[6], backgroundColor: colors.white, alignItems: 'center' },
  selfieContent: { alignItems: 'center', gap: 12 },
  selfieCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.forest[50], alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.forest[100] },
  ctaBottom: { marginTop: spacing[4] },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[8], gap: spacing[4] },
  successIcon: { marginBottom: spacing[4] },
  pendingIcon: { marginBottom: spacing[4] },
  successTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, textAlign: 'center' },
  successSubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, textAlign: 'center', lineHeight: 22, marginBottom: spacing[6] },
  noteBox: { backgroundColor: colors.red[50], borderRadius: radii.lg, padding: spacing[4], marginTop: spacing[4], marginBottom: spacing[2] },
  noteLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.red[500], marginBottom: 4 },
  noteText: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.red[600], lineHeight: 18 },
});
