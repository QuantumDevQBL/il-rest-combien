import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from './tokens';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'info' | 'danger' | 'alert';
}

const VARIANTS = {
  primary: { bg: colors.primaryLight, text: colors.primary },
  success: { bg: colors.successLight, text: colors.success },
  info: { bg: colors.secondaryLight, text: colors.secondary },
  danger: { bg: colors.negativeLight, text: colors.negative },
  alert: { bg: colors.alertLight, text: colors.alert },
};

export function Badge({ label, variant = 'info' }: BadgeProps) {
  const theme = VARIANTS[variant];
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.text, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  text: {
    ...typography.caption,
    fontWeight: '900',
  },
});
