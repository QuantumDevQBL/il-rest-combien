import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function MentionLegale() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Estimation indicative. Ne constitue pas un conseil fiscal ou comptable.
      </Text>
      <Text style={styles.text}>
        Barèmes 2026 — sources : urssaf.fr, impots.gouv.fr, service-public.fr.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  text: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
