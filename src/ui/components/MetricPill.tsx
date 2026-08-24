import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface MetricPillProps {
  label: string;
  value: string;
  variant?: 'default' | 'alert' | 'success' | 'secondary' | 'primary';
  style?: StyleProp<ViewStyle>;
}

const VARIANTS = {
  default: { valueColor: colors.ink },
  alert: { valueColor: colors.alert },
  success: { valueColor: colors.success },
  secondary: { valueColor: colors.secondary },
  primary: { valueColor: colors.primary },
};

export function MetricPill({ label, value, variant = 'default', style }: MetricPillProps) {
  const theme = VARIANTS[variant];
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: theme.valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  label: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  value: {
    ...typography.amountLarge,
  },
});
