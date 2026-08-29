import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { PressableScale } from './PressableScale';

export interface SegmentedTabOption<T extends string> {
  key: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  value: T;
  options: SegmentedTabOption<T>[];
  onChange: (value: T) => void;
}

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
}: SegmentedTabsProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option.key === value;

        return (
          <PressableScale
            key={option.key}
            onPress={() => onChange(option.key)}
            scale={0.98}
            style={styles.pressable}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
          >
            <View style={[styles.item, isActive && styles.itemActive]}>
              <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xxs,
    padding: spacing.xxs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressable: {
    flex: 1,
  },
  item: {
    minHeight: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  itemActive: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    fontWeight: '800',
  },
  labelActive: {
    color: colors.surface,
  },
});
