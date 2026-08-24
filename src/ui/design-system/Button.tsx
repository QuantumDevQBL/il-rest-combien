import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { PressableScale } from '../components/PressableScale';
import { colors, radius, shadows, spacing, typography } from './tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  icon,
}: ButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scale={0.97}
      style={[
        styles.base,
        styles[size],
        styles[variant],
        variant === 'primary' && !disabled && styles.primaryShadow,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon}
      <Text style={[styles.text, styles[`${variant}Text` as const], styles[`${size}Text` as const]]}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xxl,
    minHeight: 52,
    gap: spacing.sm,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 7,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.negativeLight,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    ...typography.body,
    fontWeight: '800',
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.ink,
  },
  ghostText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.negative,
  },
});
