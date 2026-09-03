/**
 * Role selection — Figma node 99:437.
 *
 * Two stacked choice cards. The rider card is primary with a hairline outline;
 * the driver card is the accent. Each carries a 30px icon, a title-small label
 * and a body-small line of detail, all centred.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { SvgProps } from 'react-native-svg';
import { semantic, radii, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import { AuthHeading, AuthScreen, Wordmark } from '../../components/figma/Auth';
import Seatbelt from '../../../assets/figma/icon-seatbelt.svg';
import TruckDriver from '../../../assets/figma/icon-truck-driver.svg';

/** Figma draws both role icons at 30px. */
const ICON_SIZE = 30;

export default function RoleSelect() {
  return (
    <AuthScreen>
      <StatusBar style="dark" />
      <Wordmark />
      <AuthHeading
        title="Want to give rides too?"
        subtitle="You're already set up to book rides. Add driving to earn back your fuel costs."
      />

      <View style={styles.choices}>
        <RoleCard
          Icon={Seatbelt}
          title="Just riding for now"
          detail="You can start booking rides right away."
          background={semantic.primary}
          foreground={semantic.onPrimary}
          outlined
          onPress={() => router.replace('/(rider)/ride')}
        />
        <RoleCard
          Icon={TruckDriver}
          title="I want to drive too"
          detail="You'll need to upload your license and vehicle details next."
          background={semantic.accent}
          foreground={semantic.primary}
          onPress={() => router.push('/(auth)/driver-onboarding')}
        />
      </View>
    </AuthScreen>
  );
}

function RoleCard({
  Icon,
  title,
  detail,
  background,
  foreground,
  outlined,
  onPress,
}: {
  Icon: React.FC<SvgProps>;
  title: string;
  detail: string;
  background: string;
  foreground: string;
  outlined?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: background },
        outlined && styles.cardOutlined,
        pressed && styles.cardPressed,
      ]}
    >
      <Icon width={ICON_SIZE} height={ICON_SIZE} color={foreground} />
      <Type variant="titleSmall" color={foreground}>
        {title}
      </Type>
      <Type variant="bodySmall" color={foreground} style={styles.detail}>
        {detail}
      </Type>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  choices: { gap: spacing[4], width: '100%' },
  card: {
    width: '100%',
    gap: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: radii.md,
  },
  cardOutlined: { borderWidth: 1, borderColor: semantic.outline },
  cardPressed: { opacity: 0.85 },
  detail: { textAlign: 'center' },
});
