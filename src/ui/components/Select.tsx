import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { couleurs, spacing, type } from '../theme';

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
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: couleurs.ligne,
    borderRadius: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
  picker: {
    color: couleurs.encre,
  },
  pickerItem: {
    fontSize: 15,
    height: 120,
  },
});
