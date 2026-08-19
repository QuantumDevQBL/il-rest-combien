import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Section } from './Section';
import { Input } from './Input';
import { couleurs, spacing, type } from '../theme';
import { extractFieldErrors } from '../utils/errors';
import { ValidationError } from '../../engine/types';

interface ImpotSectionProps {
  rfrN2: string;
  partsFiscalesN2: string;
  onChangeRfr: (value: string) => void;
  onChangeParts: (value: string) => void;
  error: ValidationError | null;
}

export function ImpotSection({
  rfrN2,
  partsFiscalesN2,
  onChangeRfr,
  onChangeParts,
  error,
}: ImpotSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const errors = extractFieldErrors(error);

  return (
    <Section title="Impôt — deux options">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        accessibilityRole="button"
        accessibilityLabel={
          expanded
            ? 'Replier la section impôt'
            : 'Déplier la section impôt'
        }
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>
          {expanded
            ? 'Masquer les options d\'imposition'
            : 'Comparer barème et versement libératoire'}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.explanation}>
            Pour comparer le barème progressif et le versement libératoire,
            renseigne les données de ton avis d'imposition 2025 (revenus 2024).
          </Text>
          <Input
            label="Revenu fiscal de référence N-2"
            value={rfrN2}
            onChangeText={onChangeRfr}
            placeholder="0"
            suffix="€"
            accessibilityLabel="Revenu fiscal de référence N-2, en euros"
            error={errors.rfrN2Foyer}
          />
          <Input
            label="Nombre de parts fiscales N-2"
            value={partsFiscalesN2}
            onChangeText={onChangeParts}
            placeholder="1"
            accessibilityLabel="Nombre de parts fiscales figurant sur l'avis d'imposition N-2"
            error={errors.partsFiscalesN2}
            helper="Distinct du nombre de parts calculé sur la situation actuelle."
          />
        </View>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
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
  explanation: {
    ...type.mention,
    marginBottom: spacing.md,
  },
});
