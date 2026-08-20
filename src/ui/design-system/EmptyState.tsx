import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from './tokens';

interface EmptyStateProps {
  icon?: React.ReactNode;
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function EmptyState({ icon, iconName = 'calculator', title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ?? <Ionicons name={iconName} size={56} color={colors.primary} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.ink,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
