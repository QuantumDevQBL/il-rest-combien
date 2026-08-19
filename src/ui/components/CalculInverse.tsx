import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../design-system';
import { JOURS_FACTURES_REFERENCE } from '../constants';
import { colors, spacing, typography } from '../theme';
import { formatMontant } from '../utils/format';
import { Input } from './Input';

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
    <Card style={styles.card}>
      <Text style={styles.title}>Objectif de revenu</Text>
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
                TJM indicatif — base {JOURS_FACTURES_REFERENCE} jours/an
              </Text>
              <Text style={styles.resultAmount}>
                {formatMontant(tjmRequis)}
              </Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  explanation: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    marginBottom: spacing.md,
  },
  resultContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultLabel: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  resultAmount: {
    ...typography.amount,
    color: colors.primary,
  },
});
