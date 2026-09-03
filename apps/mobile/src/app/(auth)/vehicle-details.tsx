/**
 * Driver onboarding, step 2 — Tell us about your vehicle (Figma 103:534).
 *
 * NOTE: the frame has no seat-capacity field, but the product needs one — a
 * driver publishes seats, so capacity bounds every trip they can post. It is
 * deliberately not invented here; it needs a Figma frame. Tracked in
 * design/figma-manifest.json under `gaps`.
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { spacing } from '@comuta/tokens';
import {
  AuthHeading,
  AuthScreen,
  ButtonLarge,
  Field,
  Wordmark,
} from '../../components/figma/Auth';

export default function VehicleDetails() {
  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Tell us about your vehicle"
        subtitle="This helps riders recognize your car at pickup."
      />
      <View style={styles.fields}>
        <Field
          label="Vehicle make and model"
          placeholder="e.g. Toyota Corolla"
          autoCapitalize="words"
        />
        <Field label="Vehicle color" placeholder="e.g. Silver" autoCapitalize="words" />
        <Field
          label="License plate number"
          placeholder="e.g. LND-234-AB"
          autoCapitalize="characters"
        />
        <Field
          label="Year"
          placeholder="e.g. 2015"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={4}
        />
        <ButtonLarge
          label="Continue"
          onPress={() => router.push('/(auth)/vehicle-documents')}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing[4], width: '100%' } });
