/**
 * Driver onboarding, step 4 — Take a selfie to confirm it's you (Figma 103:609).
 *
 * The frame specifies an upload tile, not a live camera capture, so that is
 * what this builds. Liveness capture is a separate screen in the inventory and
 * has no frame yet.
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { spacing } from '@comuta/tokens';
import { AuthHeading, AuthScreen, ButtonLarge, Wordmark } from '../../components/figma/Auth';
import { UploadTile } from '../../components/figma/UploadTile';

export default function Selfie() {
  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Take a selfie to confirm it's you"
        subtitle="This is matched against your license photo for everyone's safety."
      />
      <View style={styles.fields}>
        <UploadTile
          label="Upload a clear, recent photo of your face"
          hint="Make sure your face is clearly visible, with no sunglasses or hats."
        />
        <ButtonLarge label="Continue" onPress={() => router.push('/(auth)/payout')} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing[4], width: '100%' } });
