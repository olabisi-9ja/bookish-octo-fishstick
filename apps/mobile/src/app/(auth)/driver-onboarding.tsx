import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, CheckCircle, Car, CreditCard } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useComuta } from '../../store';

type DriverStep = 'licence' | 'vehicle' | 'documents' | 'bank' | 'pending';

export default function DriverOnboarding() {
  const router = useRouter();
  const session = useComuta((s) => s.session);
  const [step, setStep] = useState<DriverStep>('licence');
  const [licenceUploaded, setLicenceUploaded] = useState(false);
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleSeats, setVehicleSeats] = useState('4');
  const [docsUploaded, setDocsUploaded] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const completeOnboarding = async () => {
    if (!session?.userId) return;
    setLoading(true);
    // Add vehicle
    const vehicleId = `veh_${Math.random().toString(36).slice(2, 8)}`;
    useComuta.getState().addVehicle({
      id: vehicleId,
      ownerId: session.userId,
      make: vehicleMake || 'Toyota',
      model: vehicleModel || 'Corolla',
      color: vehicleColor || 'Silver',
      plate: vehiclePlate || 'NEW 001 XX',
      seats: Number(vehicleSeats) || 4,
      year: Number(vehicleYear) || 2020,
    });
    // Set driver profile
    useComuta.getState().setDriverProfile({
      userId: session.userId,
      licenceNumber: `LAG-${Math.floor(10000000 + Math.random() * 90000000)}`,
      vehicleId,
      completedTrips: 0,
      completionRate: 100,
      onTimeRate: 100,
      lateCancellations: 0,
      noShows: 0,
      monthlyTrips: 0,
      monthlyPassengers: 0,
      monthlyRecovered: 0,
    });
    useComuta.getState().completeDriverOnboarding(session.userId);
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(driver)/home');
  };

  const stepLabels = ['Licence', 'Vehicle', 'Documents', 'Bank'];
  const stepKeys: DriverStep[] = ['licence', 'vehicle', 'documents', 'bank'];
  const currentStepIndex = stepKeys.indexOf(step);

  if (step === 'pending') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContent}>
          <CheckCircle size={64} color={colors.forest[600]} />
          <Text style={styles.successTitle}>You're all set!</Text>
          <Text style={styles.successSubtitle}>Your driver profile is active. Start publishing commutes and earn from your daily drive.</Text>
          <Button label="Start driving" onPress={() => router.replace('/(driver)/home')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
        <ArrowLeft size={24} color={colors.onsurface} />
      </Pressable>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Progress */}
          <View style={styles.progressRow}>
            {stepLabels.map((label, i) => (
              <View key={label} style={styles.progressItem}>
                <View style={[styles.progressDot, i <= currentStepIndex && styles.progressDotActive]} />
                <Text style={[styles.progressLabel, i <= currentStepIndex && styles.progressLabelActive]}>{label}</Text>
              </View>
            ))}
          </View>

          {step === 'licence' && (
            <>
              <Text style={styles.title}>Driver's licence</Text>
              <Text style={styles.subtitle}>Upload the front and back of your valid driver's licence.</Text>
              <Pressable
                onPress={() => { setLicenceUploaded(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.uploadCard, licenceUploaded && styles.uploadCardDone]}
              >
                {licenceUploaded ? (
                  <View style={styles.uploadDoneRow}><CheckCircle size={24} color={colors.forest[600]} /><Text style={styles.uploadDoneText}>Licence uploaded</Text></View>
                ) : (
                  <View style={styles.uploadContent}><Camera size={24} color={colors.forest[600]} /><Text style={styles.uploadLabel}>Tap to upload licence</Text></View>
                )}
              </Pressable>
              <Button label="Continue" onPress={() => setStep('vehicle')} disabled={!licenceUploaded} />
            </>
          )}

          {step === 'vehicle' && (
            <>
              <Text style={styles.title}>Vehicle details</Text>
              <Text style={styles.subtitle}>Tell us about the vehicle you'll use for shared commutes.</Text>
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}><Input label="Make" value={vehicleMake} onChangeText={setVehicleMake} placeholder="e.g. Toyota" /></View>
                <View style={{ flex: 1 }}><Input label="Model" value={vehicleModel} onChangeText={setVehicleModel} placeholder="e.g. Corolla" /></View>
              </View>
              <Input label="Licence plate" value={vehiclePlate} onChangeText={setVehiclePlate} placeholder="e.g. ABC 123 XY" autoCapitalize="characters" />
              <View style={styles.rowFields}>
                <View style={{ flex: 1 }}><Input label="Color" value={vehicleColor} onChangeText={setVehicleColor} placeholder="e.g. Silver" /></View>
                <View style={{ flex: 1 }}><Input label="Year" value={vehicleYear} onChangeText={setVehicleYear} placeholder="e.g. 2020" keyboardType="number-pad" /></View>
              </View>
              <Input label="Available seats" value={vehicleSeats} onChangeText={setVehicleSeats} placeholder="4" keyboardType="number-pad" helperText="Number of seats you can offer to riders." />
              <Button label="Continue" onPress={() => setStep('documents')} disabled={!vehicleMake || !vehicleModel || !vehiclePlate} />
            </>
          )}

          {step === 'documents' && (
            <>
              <Text style={styles.title}>Vehicle documents</Text>
              <Text style={styles.subtitle}>Upload your vehicle registration and proof of insurance.</Text>
              <Pressable
                onPress={() => { setDocsUploaded(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.uploadCard, docsUploaded && styles.uploadCardDone]}
              >
                {docsUploaded ? (
                  <View style={styles.uploadDoneRow}><CheckCircle size={24} color={colors.forest[600]} /><Text style={styles.uploadDoneText}>Documents uploaded</Text></View>
                ) : (
                  <View style={styles.uploadContent}><Car size={24} color={colors.forest[600]} /><Text style={styles.uploadLabel}>Tap to upload documents</Text></View>
                )}
              </Pressable>
              <Button label="Continue" onPress={() => setStep('bank')} disabled={!docsUploaded} />
            </>
          )}

          {step === 'bank' && (
            <>
              <Text style={styles.title}>Bank details</Text>
              <Text style={styles.subtitle}>Where should we send your earnings? You can change this later.</Text>
              <Input label="Bank name" value={bankName} onChangeText={setBankName} placeholder="e.g. Access Bank" />
              <Input label="Account number" value={accountNumber} onChangeText={setAccountNumber} placeholder="10-digit account number" keyboardType="number-pad" maxLength={10} />
              <Button label="Complete setup" onPress={completeOnboarding} loading={loading} disabled={!bankName || accountNumber.length < 10} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  backButton: { paddingHorizontal: spacing[5], paddingVertical: spacing[3] },
  scroll: { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[8], gap: spacing[2] },
  progressItem: { alignItems: 'center', gap: 6, flex: 1 },
  progressDot: { width: '100%', height: 4, borderRadius: 2, backgroundColor: colors.lineSoft },
  progressDotActive: { backgroundColor: colors.forest[600] },
  progressLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.faint },
  progressLabelActive: { color: colors.forest[600] },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, marginBottom: spacing[2] },
  subtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, marginBottom: spacing[6], lineHeight: 22 },
  uploadCard: { borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', borderRadius: radii.xl, padding: spacing[6], marginBottom: spacing[6], backgroundColor: colors.white, alignItems: 'center' },
  uploadCardDone: { borderStyle: 'solid', borderColor: colors.forest[100], backgroundColor: colors.forest[50] },
  uploadContent: { alignItems: 'center', gap: 8 },
  uploadLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.bodyMedium, color: colors.muted },
  uploadDoneRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  uploadDoneText: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.forest[700] },
  rowFields: { flexDirection: 'row', gap: spacing[3] },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[8], gap: spacing[4] },
  successTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, textAlign: 'center' },
  successSubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, textAlign: 'center', lineHeight: 22, marginBottom: spacing[6] },
});
