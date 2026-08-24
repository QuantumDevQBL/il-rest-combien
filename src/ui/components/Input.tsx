import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  accessibilityLabel?: string;
  error?: string;
  helper?: string;
  suffix?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'numeric',
  accessibilityLabel,
  error,
  helper,
  suffix,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const labelId = label ? `${label}-label` : undefined;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label} nativeID={labelId}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.inputContainerFocused : undefined,
          error ? styles.inputContainerError : undefined,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.inkTertiary}
          keyboardType={keyboardType}
          accessibilityLabel={accessibilityLabel ?? label ?? 'Champ de saisie'}
          accessibilityLabelledBy={labelId}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.inkSecondary,
    marginBottom: spacing.xxs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  inputContainerFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  inputContainerError: {
    borderColor: colors.negative,
    backgroundColor: colors.negativeLight,
  },
  input: {
    flex: 1,
    ...typography.amount,
    color: colors.ink,
    paddingVertical: spacing.sm,
  },
  suffix: {
    ...typography.amount,
    color: colors.inkTertiary,
    marginLeft: spacing.xs,
  },
  helper: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginTop: spacing.xxs,
  },
  error: {
    ...typography.caption,
    color: colors.negative,
    marginTop: spacing.xxs,
  },
});
