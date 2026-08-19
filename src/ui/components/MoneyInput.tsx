import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface MoneyInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  error?: string;
  helper?: string;
  autoFocus?: boolean;
}

export function MoneyInput({
  value,
  onChangeText,
  placeholder = '0',
  accessibilityLabel,
  error,
  helper,
  autoFocus,
}: MoneyInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.inputContainerFocused : undefined,
          error ? styles.inputContainerError : undefined,
        ]}
      >
        <Text style={styles.currency}>€</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.inkTertiary}
          keyboardType="numeric"
          accessibilityLabel={accessibilityLabel ?? 'Montant en euros'}
          autoFocus={autoFocus}
        />
      </View>
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    minHeight: 80,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputContainerError: {
    borderColor: colors.negative,
    backgroundColor: colors.negativeLight,
  },
  currency: {
    ...typography.h1,
    color: colors.inkTertiary,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.hero,
    color: colors.ink,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  helper: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.negative,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
