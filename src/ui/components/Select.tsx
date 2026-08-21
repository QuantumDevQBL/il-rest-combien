import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, radius, spacing, typography } from '../theme';

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  accessibilityLabel,
}: SelectProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label} nativeID={`${label}-label`}>
        {label}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue as T)}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityLabelledBy={`${label}-label`}
          testID={accessibilityLabel ?? label}
          style={styles.picker}
          itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
        >
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
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
  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    minHeight: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  picker: {
    ...typography.body,
    color: colors.ink,
  },
  pickerItem: {
    fontSize: 16,
    height: 120,
  },
});
