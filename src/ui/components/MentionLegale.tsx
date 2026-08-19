import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { couleurs, spacing, type } from '../theme';

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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  text: {
    ...type.mention,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
