import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { couleurs, spacing, type } from '../theme';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export function Toggle({
  label,
  value,
  onChange,
  accessibilityLabel,
  disabled,
}: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.container}
    >
      <View
        style={[
          styles.box,
          value && styles.boxChecked,
          disabled && styles.boxDisabled,
        ]}
      >
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    minHeight: 44,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: couleurs.encre,
    borderRadius: 4,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    backgroundColor: couleurs.encre,
  },
  boxDisabled: {
    borderColor: couleurs.ligne,
  },
  checkmark: {
    color: couleurs.papier,
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    ...type.corps,
    color: couleurs.encre,
    flex: 1,
  },
  labelDisabled: {
    color: couleurs.encreFaible,
  },
});
