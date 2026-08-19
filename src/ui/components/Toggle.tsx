import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

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
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.container,
        (pressed || disabled) && styles.containerDisabled,
      ]}
    >
      <View
        style={[
          styles.track,
          value && styles.trackChecked,
          disabled && styles.trackDisabled,
        ]}
      >
        <View
          style={[
            styles.thumb,
            value && styles.thumbChecked,
            disabled && styles.thumbDisabled,
          ]}
        />
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
    marginVertical: spacing.xs,
    minHeight: 44,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    padding: 2,
    marginRight: spacing.md,
  },
  trackChecked: {
    backgroundColor: colors.primary,
  },
  trackDisabled: {
    backgroundColor: colors.surfaceSecondary,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbChecked: {
    transform: [{ translateX: 20 }],
  },
  thumbDisabled: {
    backgroundColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.ink,
    flex: 1,
  },
  labelDisabled: {
    color: colors.inkTertiary,
  },
});
