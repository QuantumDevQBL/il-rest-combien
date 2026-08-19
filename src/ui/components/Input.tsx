import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { couleurs, spacing, type } from '../theme';

interface InputProps {
  label: string;
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

  return (
    <View style={styles.container}>
      <Text style={styles.label} nativeID={`${label}-label`}>
        {label}
      </Text>
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
          placeholderTextColor={couleurs.encreFaible}
          keyboardType={keyboardType}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityLabelledBy={`${label}-label`}
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
    marginVertical: spacing.sm,
  },
  label: {
    ...type.label,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: couleurs.ligne,
    borderRadius: 4,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: couleurs.encre,
  },
  inputContainerError: {
    borderColor: couleurs.ponction,
  },
  input: {
    flex: 1,
    ...type.montant,
    color: couleurs.encre,
    paddingVertical: spacing.md,
  },
  suffix: {
    ...type.montant,
    color: couleurs.encreFaible,
    marginLeft: spacing.sm,
  },
  helper: {
    ...type.mention,
    marginTop: spacing.xs,
  },
  error: {
    ...type.mention,
    color: couleurs.ponction,
    marginTop: spacing.xs,
  },
});
