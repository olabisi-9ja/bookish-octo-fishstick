/**
 * OTP verification — Figma nodes 65:76 and 65:185 (email), 65:157 and 65:213
 * (phone).
 *
 * The four frames are one screen: the channel changes the heading, the
 * destination shown in the subtitle, and the "Wrong …?" label. It is chosen by
 * the `channel` search param, defaulting to email.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { semantic, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import {
  AuthHeading,
  AuthScreen,
  ButtonLarge,
  Wordmark,
} from '../../components/figma/Auth';
import { OTP_LENGTH, OtpInput } from '../../components/figma/OtpInput';

type Channel = 'email' | 'phone';

const COPY: Record<Channel, { title: string; wrong: string; fallback: string }> = {
  email: { title: 'Verify your email', wrong: 'Wrong Email?', fallback: '[email]' },
  phone: {
    title: 'Verify your phone number',
    wrong: 'Wrong number?',
    fallback: '[phone number]',
  },
};

export default function Otp() {
  const params = useLocalSearchParams<{ channel?: Channel; destination?: string }>();
  const channel: Channel = params.channel === 'phone' ? 'phone' : 'email';
  const copy = COPY[channel];

  const [code, setCode] = useState('');
  const complete = code.length === OTP_LENGTH;

  const verify = () => router.push('/(auth)/kyc');

  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title={copy.title}
        subtitle={`Enter the ${OTP_LENGTH}-digit code we sent to ${params.destination ?? copy.fallback}`}
      />

      <View style={styles.body}>
        <View style={styles.codeGroup}>
          <OtpInput value={code} onChange={setCode} onComplete={verify} autoFocus />
          <InlineAction
            prompt="Didn't get a code?"
            action="Resend"
            onPress={() => setCode('')}
            align="flex-end"
          />
        </View>

        <View style={styles.submitGroup}>
          <ButtonLarge label="Verify and continue" onPress={verify} disabled={!complete} />
          <InlineAction
            prompt={copy.wrong}
            action="Go back"
            onPress={() => router.back()}
            align="center"
          />
        </View>
      </View>
    </AuthScreen>
  );
}

/** Label-then-link row; Figma uses it right-aligned and centred on this screen. */
function InlineAction({
  prompt,
  action,
  onPress,
  align,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
  align: 'flex-end' | 'center';
}) {
  return (
    <View style={[styles.inlineRow, { justifyContent: align }]}>
      <Type variant="labelSmall" color={semantic.onSurface}>
        {prompt}
      </Type>
      <Pressable onPress={onPress} accessibilityRole="link" hitSlop={spacing[2]}>
        <Type variant="titleSmall" color={semantic.primary}>
          {action}
        </Type>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing[4] },
  codeGroup: { gap: spacing[1] },
  submitGroup: { gap: spacing[2], alignItems: 'center' },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    width: '100%',
  },
});
