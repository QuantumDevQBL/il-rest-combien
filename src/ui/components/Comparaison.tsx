import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Card } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { formatMontant } from '../utils/format';
import { ResultatMicro } from '../../engine/types';

interface ComparaisonProps {
  result: ResultatMicro;
}

export function Comparaison({ result }: ComparaisonProps) {
  if (result.estEligibleVL === null) {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>Impôt — deux options</Text>
        <Text style={styles.message}>
          Renseigne ton revenu fiscal de référence pour comparer les deux options
          d'imposition.
        </Text>
      </Card>
    );
  }

  if (result.estEligibleVL === false) {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>Impôt — deux options</Text>
        <Text style={styles.message}>
          Ton revenu fiscal de référence dépasse le seuil : le versement libératoire
          n'est pas accessible cette année.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Barème progressif retenu</Text>
          <Text style={styles.amount}>
            {formatMontant(result.totalScenarioBareme)}
          </Text>
        </View>
      </Card>
    );
  }

  const vlGagnant = result.scenarioLePlusFavorable === 'VL';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Impôt — deux options</Text>
        <Badge
          label={vlGagnant ? 'VL gagnant' : 'Barème gagnant'}
          variant={vlGagnant ? 'success' : 'info'}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Barème progressif</Text>
        <Text style={styles.amount}>
          {formatMontant(result.totalScenarioBareme)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Versement libératoire</Text>
        <Text style={styles.amount}>
          {formatMontant(result.totalScenarioVL)}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>Écart</Text>
        <Text style={styles.amount}>{formatMontant(result.ecartEuros)}</Text>
      </View>

      <Text style={styles.conclusion}>
        {vlGagnant
          ? `Dans cette simulation, le versement libératoire réduit l'impôt estimé de ${formatMontant(result.ecartEuros)}.`
          : `Dans cette simulation, le barème progressif est plus favorable de ${formatMontant(result.ecartEuros)}.`}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.ink,
  },
  amount: {
    ...typography.amount,
    color: colors.ink,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  message: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 22,
  },
  conclusion: {
    ...typography.bodySmall,
    marginTop: spacing.md,
    lineHeight: 22,
    color: colors.inkSecondary,
  },
});
