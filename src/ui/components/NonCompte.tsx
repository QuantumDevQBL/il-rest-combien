import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Icon } from '../design-system';
import { colors, spacing, typography } from '../theme';

export function NonCompte() {
  const [expanded, setExpanded] = useState(false);

  const items = [
    'CFE — montant fixé par ta commune, due à partir de la 2e année',
    'ACRE — exonération de début d\'activité',
    'Réductions et crédits d\'impôt',
    'Mutuelle, prévoyance, retraite complémentaire facultative',
    'Activité mixte (vente + prestation)',
  ];

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        accessibilityRole="button"
        accessibilityLabel={
          expanded
            ? 'Replier ce qui n\'est pas compté'
            : 'Déplier ce qui n\'est pas compté'
        }
        style={styles.toggle}
      >
        <View style={styles.toggleText}>
          <Text style={styles.title}>Ce qui n'est pas compté</Text>
          <Text style={styles.subtitle}>
            Charges et dispositifs non pris en compte dans cette estimation.
          </Text>
        </View>
        <Icon
          name={expanded ? 'chevronUp' : 'chevronDown'}
          size={20}
          color={colors.inkSecondary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  toggleText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.caption,
    color: colors.inkSecondary,
    marginTop: spacing.xxs,
  },
  content: {
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  bullet: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginRight: spacing.sm,
  },
  itemText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 20,
    flex: 1,
  },
});
