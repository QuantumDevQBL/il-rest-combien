import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from './tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'accent';
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  default: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 0,
  },
  accent: {
    backgroundColor: colors.primary,
  },
});
