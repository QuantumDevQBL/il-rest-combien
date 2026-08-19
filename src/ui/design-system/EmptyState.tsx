import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from './tokens';
import { Icon } from './Icon';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ?? <Icon name="calculator" size={48} color={colors.inkTertiary} />}
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
    marginTop: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
