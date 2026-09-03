/**
 * Verify your identity — Figma nodes 73:303 (empty), 91:222 (NIN),
 * 99:327 (International Passport), 99:255 (Driver's Licence), 99:397 (Voter's
 * Card).
 *
 * Five frames, one screen: the ID-type dropdown decides what is asked for
 * below it. The frame root is `justify-between`, so the encryption note is
 * pinned to the bottom of the viewport rather than following the form.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLUMN_MAX_WIDTH, semantic, spacing } from '@comuta/tokens';
import { AuthHeading, ButtonLarge, Field, GUTTER, Wordmark } from '../../components/figma/Auth';
import { Dropdown, type DropdownOption } from '../../components/figma/Dropdown';
import { NoteCard } from '../../components/figma/NoteCard';
import { UploadTile } from '../../components/figma/UploadTile';
import { useBreakpoint } from '../../components/layout/Responsive';

type IdType = 'nin' | 'passport' | 'licence' | 'voter';

const ID_TYPES: readonly DropdownOption<IdType>[] = [
  { value: 'nin', label: 'National ID (NIN)' },
  { value: 'passport', label: 'International Passport' },
  { value: 'licence', label: "Driver's License Number" },
  { value: 'voter', label: "Voter's Card" },
];

/** Figma repeats this hint under every two-sided document upload. */
const TWO_SIDED_HINT = 'Make sure all four corners are visible and the text is easy to read.';

const NOTE =
  "Your ID is encrypted and only used to verify your identity. It won't be shown to other users.";

export default function Kyc() {
  const [idType, setIdType] = useState<IdType | null>(null);
  const { isWide } = useBreakpoint();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.stack, isWide && styles.stackWide]}>
          <Wordmark />
          <AuthHeading
            title="Verify your identity"
            subtitle={'This keeps everyone on Comuta safe. \nIt only takes a minute.'}
          />

          <Dropdown
            label="Select ID type"
            placeholder="Click drop down to select your ID type"
            options={ID_TYPES}
            value={idType}
            onChange={setIdType}
          />

          {idType ? <IdTypeFields idType={idType} /> : null}
        </View>
      </ScrollView>

      {/* Pinned to the frame bottom — the root frame is justify-between. */}
      <View style={[styles.note, isWide && styles.noteWide]}>
        <NoteCard body={NOTE} />
      </View>
    </View>
  );
}

/** The part of the frame that changes with the selected ID type. */
function IdTypeFields({ idType }: { idType: IdType }) {
  const advance = () => router.push('/(auth)/role-select');

  if (idType === 'nin') {
    return (
      <View style={styles.fields}>
        <Field
          label="NIN number"
          placeholder="Enter your 11-digit NIN"
          hint="You can find this on your NIN slip or the NIMC app."
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={11}
        />
        <ButtonLarge label="Continue" onPress={advance} />
      </View>
    );
  }

  if (idType === 'passport') {
    return (
      <View style={styles.fields}>
        <UploadTile
          label="Upload a clear photo of your passport's photo page"
          hint="Make sure your photo, name, and passport number are clearly visible"
        />
        <ButtonLarge label="Continue" onPress={advance} />
      </View>
    );
  }

  const noun = idType === 'licence' ? "driver's license" : "Voter's Card";
  return (
    <View style={styles.fields}>
      <UploadTile
        label={`Upload a clear photo of the front of your ${noun}`}
        hint={TWO_SIDED_HINT}
      />
      <UploadTile label={`Now upload the back of your ${noun}`} hint={TWO_SIDED_HINT} />
      <ButtonLarge label="Continue" onPress={advance} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface },
  content: { paddingHorizontal: GUTTER, paddingTop: 60, paddingBottom: spacing[5] },
  contentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] },
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },
  fields: { gap: spacing[4], width: '100%' },
  note: { paddingHorizontal: GUTTER, paddingBottom: 60 },
  noteWide: { alignSelf: 'center', width: '100%', maxWidth: COLUMN_MAX_WIDTH + GUTTER * 2 },
});
