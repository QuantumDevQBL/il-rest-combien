import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from './tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'accent' | 'glass';
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], variant === 'default' && shadows.md, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  default: {
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 0,
  },
  accent: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  glass: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
