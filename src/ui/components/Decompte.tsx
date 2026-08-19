import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { couleurs, spacing, type } from '../theme';
import { formatMontant } from '../utils/format';
import { ResultatMicro } from '../../engine/types';

interface DecompteProps {
  result: ResultatMicro;
}

function Line({
  label,
  amount,
  isTotal,
  isPonction,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
  isPonction?: boolean;
}) {
  return (
    <View style={[styles.line, isTotal && styles.lineTotal]}>
      <Text style={[styles.label, isTotal && styles.labelTotal]}>{label}</Text>
      <Text
        style={[
          styles.amount,
          isTotal && styles.amountTotal,
          isPonction && styles.amountPonction,
        ]}
      >
        {isPonction ? `−${formatMontant(Math.abs(amount))}` : formatMontant(amount)}
      </Text>
    </View>
  );
}

export function Decompte({ result }: DecompteProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Le décompte</Text>

      <Line label="Chiffre d'affaires" amount={result.caAnnuelHT} />
      <View style={styles.separator} />

      <Line
        label="Cotisations sociales"
        amount={result.cotisationsSociales}
        isPonction
      />
      <Line label="Formation pro" amount={result.cfp} isPonction />
      <Line label="Impôt sur le revenu" amount={result.impotRetenu} isPonction />
      <Line
        label="Charges fixes"
        amount={result.chargesFixesAnnuelles}
        isPonction
      />

      <View style={styles.separatorDouble} />
      <Line
        label="Il te reste"
        amount={result.revenuNetDisponible}
        isTotal
      />

      <View style={styles.monthlyContainer}>
        <Text style={styles.monthlyLabel}>Soit par mois</Text>
        <Text style={styles.monthlyAmount}>
          {formatMontant(result.revenuNetDisponible / 12)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: couleurs.papier,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
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
  lineTotal: {
    paddingVertical: spacing.md,
  },
  label: {
    ...type.corps,
    color: couleurs.encre,
  },
  labelTotal: {
    ...type.titre,
  },
  amount: {
    ...type.montant,
    color: couleurs.encre,
  },
  amountTotal: {
    ...type.montant,
    fontWeight: '700',
    color: couleurs.reste,
  },
  amountPonction: {
    color: couleurs.ponction,
  },
  separator: {
    height: 1,
    backgroundColor: couleurs.ligne,
    marginVertical: spacing.sm,
  },
  separatorDouble: {
    height: 2,
    backgroundColor: couleurs.encre,
    marginVertical: spacing.md,
  },
  monthlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: couleurs.ligne,
  },
  monthlyLabel: {
    ...type.label,
  },
  monthlyAmount: {
    ...type.montant,
    color: couleurs.encreFaible,
  },
});
