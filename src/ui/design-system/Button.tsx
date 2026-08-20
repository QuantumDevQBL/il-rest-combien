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
        variant === 'primary' && !pressed && !disabled && shadows.glow,
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
    borderRadius: radius.full,
    minHeight: 56,
    gap: spacing.sm,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 60,
  },
  primary: {
    backgroundColor: colors.primary,
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
    opacity: 0.45,
  },
  text: {
    ...typography.body,
    fontWeight: '800',
  },
  mdText: {
    fontSize: 15,
  },
  lgText: {
    fontSize: 17,
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
