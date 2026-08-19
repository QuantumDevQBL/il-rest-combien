import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from './tokens';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'alert' | 'info' | 'error';
}

const VARIANTS = {
  success: { bg: colors.primaryLight, text: colors.primary },
  alert: { bg: colors.alertLight, text: colors.alert },
  info: { bg: colors.infoLight, text: colors.info },
  error: { bg: colors.negativeLight, text: colors.negative },
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
    fontWeight: '700',
  },
});
