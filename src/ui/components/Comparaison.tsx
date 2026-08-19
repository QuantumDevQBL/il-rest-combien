import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { couleurs, spacing, type } from '../theme';
import { formatMontant } from '../utils/format';
import { ResultatMicro } from '../../engine/types';

interface ComparaisonProps {
  result: ResultatMicro;
}

export function Comparaison({ result }: ComparaisonProps) {
  if (result.estEligibleVL === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Impôt — deux options</Text>
        <Text style={styles.message}>
          Renseigne ton revenu fiscal de référence pour comparer les deux options
          d'imposition.
        </Text>
      </View>
    );
  }

  if (result.estEligibleVL === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Impôt — deux options</Text>
        <Text style={styles.message}>
          Ton revenu fiscal de référence dépasse le seuil : le versement libératoire
          n'est pas accessible cette année.
        </Text>
        <View style={styles.line}>
          <Text style={styles.label}>Barème progressif</Text>
          <Text style={styles.amount}>
            {formatMontant(result.totalScenarioBareme)}
          </Text>
        </View>
      </View>
    );
  }

  const vlGagnant = result.scenarioLePlusFavorable === 'VL';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impôt — deux options</Text>

      <View style={styles.line}>
        <Text style={styles.label}>Barème progressif</Text>
        <Text style={styles.amount}>
          {formatMontant(result.totalScenarioBareme)}
        </Text>
      </View>

      <View style={styles.line}>
        <Text style={styles.label}>Versement libératoire</Text>
        <Text style={styles.amount}>
          {formatMontant(result.totalScenarioVL)}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.line}>
        <Text style={styles.label}>Écart</Text>
        <Text style={styles.amount}>{formatMontant(result.ecartEuros)}</Text>
      </View>

      <Text style={styles.conclusion}>
        {vlGagnant
          ? `Dans cette simulation, le versement libératoire réduit l'impôt estimé de ${formatMontant(result.ecartEuros)}.`
          : `Dans cette simulation, le barème progressif est plus favorable de ${formatMontant(result.ecartEuros)}.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: couleurs.papier,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: couleurs.ligne,
  },
  title: {
    ...type.eyebrow,
    color: couleurs.encreFaible,
    marginBottom: spacing.lg,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    ...type.corps,
    color: couleurs.encre,
  },
  amount: {
    ...type.montant,
    color: couleurs.encre,
  },
  separator: {
    height: 1,
    backgroundColor: couleurs.ligne,
    marginVertical: spacing.sm,
  },
  message: {
    ...type.corps,
    color: couleurs.encreFaible,
    lineHeight: 22,
  },
  conclusion: {
    ...type.corps,
    marginTop: spacing.lg,
    lineHeight: 22,
  },
});
