/**
 * Expanding select — Figma component `dropdown` 91:105 / `dropdownIdType`
 * 91:129, as instanced at 91:170 on the KYC frame.
 *
 * The frame draws it open, with the trigger row and every option sharing one
 * rounded surface-variant panel. Collapsed, only the trigger row shows.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { semantic, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';
import Caret from '../../../assets/figma/icon-caret-down.svg';

/** Figma draws the caret at 18px. */
const CARET_SIZE = 18;

export type DropdownOption<T extends string> = { value: T; label: string };

export function Dropdown<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: readonly DropdownOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.field}>
      <Type variant="titleSmall" color={semantic.primary}>
        {label}
      </Type>

      <View style={styles.panel}>
        <Pressable
          onPress={() => setOpen((v) => !v)}
          accessibilityRole="combobox"
          accessibilityLabel={label}
          accessibilityState={{ expanded: open }}
          style={styles.trigger}
        >
          <Type
            variant="bodySmall"
            color={selected ? semantic.primary : semantic.onTertiaryContainer}
          >
            {selected ? selected.label : placeholder}
          </Type>
          {/* Figma rotates the caret 180 degrees while the list is open. */}
          <View style={open ? styles.caretOpen : undefined}>
            <Caret width={CARET_SIZE} height={CARET_SIZE} />
          </View>
        </Pressable>

        {open
          ? options.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: opt.value === value }}
                style={styles.option}
              >
                <Type variant="bodySmall" color={semantic.primary}>
                  {opt.label}
                </Type>
              </Pressable>
            ))
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing[1], width: '100%' },
  panel: {
    width: '100%',
    backgroundColor: semantic.surfaceVariant,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
  },
  caretOpen: { transform: [{ rotate: '180deg' }] },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
  },
});
