import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
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
    <View>
      <Text style={styles.sectionTitle}>Le décompte</Text>

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
      <Line label="Il te reste" amount={result.revenuNetDisponible} isTotal />

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
  sectionTitle: {
    ...typography.overline,
    color: colors.inkSecondary,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
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
    ...typography.body,
    color: colors.ink,
  },
  labelTotal: {
    ...typography.h3,
  },
  amount: {
    ...typography.amount,
    color: colors.ink,
  },
  amountTotal: {
    ...typography.amountLarge,
    color: colors.primary,
  },
  amountPonction: {
    color: colors.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  separatorDouble: {
    height: 2,
    backgroundColor: colors.ink,
    marginVertical: spacing.md,
  },
  monthlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  monthlyLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
  },
  monthlyAmount: {
    ...typography.amount,
    color: colors.inkSecondary,
  },
});
