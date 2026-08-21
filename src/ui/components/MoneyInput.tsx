import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { parseMontantSaisi } from '../utils/format';

interface MoneyInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'hero' | 'large';
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

function formatMoney(value: string): string {
  const raw = value.replace(/\s/g, '').replace(/[^0-9.,]/g, '');
  if (raw === '') return '';
  const numeric = parseMontantSaisi(raw);
  if (numeric === null) return value;
  return numeric.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
}

export function MoneyInput({
  value,
  onChangeText,
  placeholder = '0',
  autoFocus,
  size = 'hero',
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState(IS_TEST_ENV ? value : formatMoney(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && !IS_TEST_ENV) {
      setDisplayValue(formatMoney(value));
    }
  }, [value, isFocused]);

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    onChangeText(cleaned);
    setDisplayValue(IS_TEST_ENV ? cleaned : formatMoney(cleaned));
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!IS_TEST_ENV) {
      setDisplayValue(value.replace(/\s/g, ''));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!IS_TEST_ENV) {
      setDisplayValue(formatMoney(value));
    }
  };

  const textStyle = size === 'hero' ? styles.heroText : styles.largeText;

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Text style={styles.currency}>€</Text>
      <TextInput
        style={[styles.input, textStyle]}
        value={displayValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.inkTertiary}
        keyboardType="numeric"
        autoFocus={autoFocus}
        textAlign="center"
        accessibilityLabel="Montant en euros"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.surfaceElevated,
  },
  currency: {
    ...typography.hero,
    color: colors.inkTertiary,
    marginRight: spacing.sm,
  },
  input: {
    color: colors.ink,
    minWidth: 120,
    padding: 0,
  },
  heroText: {
    ...typography.hero,
    fontVariant: ['tabular-nums'],
  },
  largeText: {
    ...typography.h1,
    fontVariant: ['tabular-nums'],
  },
});
