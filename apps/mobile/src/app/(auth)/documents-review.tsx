/**
 * "We're reviewing your documents" — Figma node 103:708.
 *
 * Also named "Reset Password - Phone" in Figma; it is the KYC pending state at
 * the end of driver onboarding.
 */
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { semantic } from '@comuta/tokens';
import Icon from '../../../assets/figma/icon-file-check.svg';
import { StatusScreen } from '../../components/figma/StatusScreen';

export default function DocumentsReview() {
  return (
    <>
      <StatusBar style="dark" />
      <StatusScreen
        Icon={Icon}
        title="We're reviewing your documents"
        body="This usually takes less than 24 hours. We'll notify you once you're approved to start posting rides."
        bodyColor={semantic.onPrimaryContainer}
        actionLabel="Continue"
        onAction={() => router.replace('/(rider)/ride')}
      />
    </>
  );
}
