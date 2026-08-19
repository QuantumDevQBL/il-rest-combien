import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from './tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'accent' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], variant === 'default' && shadows.sm, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  default: {
    borderWidth: 0,
  },
  filled: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 0,
  },
  accent: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.secondaryLight,
    borderWidth: 0,
  },
});
