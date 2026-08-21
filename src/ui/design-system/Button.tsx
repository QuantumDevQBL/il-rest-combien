import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
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
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        variant === 'primary' && !pressed && !disabled && shadows.md,
        (pressed || disabled) && styles.disabled,
      ]}
    >
      {icon}
      <Text style={[styles.text, styles[`${variant}Text` as const], styles[`${size}Text` as const]]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
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
  secondary: {
    backgroundColor: colors.surfaceElevated,
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
    color: colors.background,
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
