import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { couleurs, spacing, type } from '../theme';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    ...type.eyebrow,
    color: couleurs.encreFaible,
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
  },
  content: {
    backgroundColor: couleurs.papier,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: couleurs.ligne,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
