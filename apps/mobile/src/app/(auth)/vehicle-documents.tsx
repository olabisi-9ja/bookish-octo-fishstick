/**
 * Driver onboarding, step 3 — Confirm your vehicle documents (Figma 103:584).
 *
 * The frame's heading still reads "Upload your driver's license", carried over
 * from the previous step, while its subtitle and both upload tiles are about
 * vehicle registration. Built to what the screen actually collects; the frame
 * name ("Confirm your vehicle documents") agrees. Recorded in
 * design/figma-manifest.json.
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { spacing } from '@comuta/tokens';
import { AuthHeading, AuthScreen, ButtonLarge, Wordmark } from '../../components/figma/Auth';
import { UploadTile } from '../../components/figma/UploadTile';

const HINT = 'Make sure all four corners are visible and the text is easy to read.';

export default function VehicleDocuments() {
  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Confirm your vehicle documents"
        subtitle={
          "Upload your vehicle registration or proof of ownership. If the vehicle isn't " +
          'registered in your name, you can upload an authorization letter instead.'
        }
      />
      <View style={styles.fields}>
        <UploadTile
          label="Upload a clear photo of your vehicle registration document"
          hint={HINT}
        />
        <UploadTile
          label="Vehicle not registered in your name? Upload an authorization letter instead"
          hint={HINT}
        />
        <ButtonLarge label="Continue" onPress={() => router.push('/(auth)/selfie')} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing[4], width: '100%' } });
