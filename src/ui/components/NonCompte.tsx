import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { couleurs, spacing, type } from '../theme';

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
    <View style={styles.container}>
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
        <Text style={styles.toggleText}>Ce qui n'est pas compté</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          {items.map((item, index) => (
            <Text key={index} style={styles.item}>
              • {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: couleurs.ligne,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  toggleText: {
    ...type.corps,
    color: couleurs.encre,
  },
  chevron: {
    ...type.corps,
    color: couleurs.encreFaible,
  },
  content: {
    paddingTop: spacing.md,
  },
  item: {
    ...type.mention,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
});
