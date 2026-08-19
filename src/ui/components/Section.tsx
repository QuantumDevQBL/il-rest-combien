import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../design-system';
import { colors, spacing, typography } from '../theme';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Card>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.overline,
    color: colors.inkSecondary,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
  },
});
