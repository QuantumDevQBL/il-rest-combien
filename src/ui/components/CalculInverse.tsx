import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Section } from './Section';
import { Input } from './Input';
import { JOURS_FACTURES_REFERENCE } from '../constants';
import { couleurs, spacing, type } from '../theme';
import { formatMontant } from '../utils/format';

interface CalculInverseProps {
  objectifNetMensuel: string;
  onChangeObjectif: (value: string) => void;
  caRequis: number | null;
  tjmRequis: number | null;
}

export function CalculInverse({
  objectifNetMensuel,
  onChangeObjectif,
  caRequis,
  tjmRequis,
}: CalculInverseProps) {
  return (
    <Section title="Objectif de revenu">
      <Text style={styles.explanation}>
        Combien dois-tu facturer pour atteindre un revenu net cible ?
      </Text>
      <Input
        label="Revenu net mensuel visé"
        value={objectifNetMensuel}
        onChangeText={onChangeObjectif}
        placeholder="0"
        suffix="€"
        accessibilityLabel="Revenu net mensuel visé, en euros"
      />

      {caRequis !== null && (
        <View style={styles.resultContainer}>
          <View style={styles.resultLine}>
            <Text style={styles.resultLabel}>CA annuel requis</Text>
            <Text style={styles.resultAmount}>{formatMontant(caRequis)}</Text>
          </View>
          <View style={styles.resultLine}>
            <Text style={styles.resultLabel}>CA mensuel moyen</Text>
            <Text style={styles.resultAmount}>
              {formatMontant(caRequis / 12)}
            </Text>
          </View>
          {tjmRequis !== null && (
            <View style={styles.resultLine}>
              <Text style={styles.resultLabel}>
                TJM indicatif — base {JOURS_FACTURES_REFERENCE} jours facturés par an
              </Text>
              <Text style={styles.resultAmount}>
                {formatMontant(tjmRequis)}
              </Text>
            </View>
          )}
        </View>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  explanation: {
    ...type.mention,
    marginBottom: spacing.md,
  },
  resultContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: couleurs.ligne,
  },
  resultLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultLabel: {
    ...type.corps,
    color: couleurs.encre,
  },
  resultAmount: {
    ...type.montant,
    color: couleurs.reste,
  },
});
