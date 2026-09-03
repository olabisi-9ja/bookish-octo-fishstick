/**
 * Driver onboarding, step 5 — Where should we send your earnings? (103:679).
 *
 * Two fields in the frame carry copy from the vehicle screen: the first is
 * labelled "Vehicle make and model" with placeholder "e.g. Toyota Corolla",
 * and "Account holder name" is placeheld "e.g. LND-234-AB". On a bank-details
 * form both are plainly copy-paste slips, so the labels and placeholders here
 * describe the field the screen is collecting. Recorded in
 * design/figma-manifest.json for the designer to confirm.
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

export default function Payout() {
  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Where should we send your earnings?"
        subtitle="Add your bank details to receive payouts after each ride."
      />
      <View style={styles.fields}>
        <Field
          label="Bank name"
          placeholder="e.g. Guaranty Trust Bank"
          autoCapitalize="words"
        />
        <Field
          label="Account number"
          placeholder="0123456789"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={10}
        />
        <Field
          label="Account holder name"
          placeholder="e.g. Ade Kolawole"
          hint="This must match the name on your license."
          autoCapitalize="words"
        />
        <ButtonLarge
          label="Finish setup"
          onPress={() => router.replace('/(auth)/documents-review')}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing[4], width: '100%' } });
