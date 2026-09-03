/**
 * Driver onboarding, step 1 — Upload your driver's license (Figma 103:497).
 *
 * Entered from role selection. The five driver frames are separate routes so
 * each step is linkable and the back gesture steps back through the flow.
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { spacing } from '@comuta/tokens';
import { AuthHeading, AuthScreen, ButtonLarge, Wordmark } from '../../components/figma/Auth';
import { UploadTile } from '../../components/figma/UploadTile';

/** Figma repeats this hint under every two-sided document upload. */
const HINT = 'Make sure all four corners are visible and the text is easy to read.';

export default function DriverLicence() {
  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Upload your driver's license"
        subtitle="This confirms you're licensed to drive in Nigeria."
      />
      <View style={styles.fields}>
        <UploadTile
          label="Upload a clear photo of the front of your driver's license"
          hint={HINT}
        />
        <UploadTile label="Now upload the back of your driver's license" hint={HINT} />
        <ButtonLarge label="Continue" onPress={() => router.push('/(auth)/vehicle-details')} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing[4], width: '100%' } });
