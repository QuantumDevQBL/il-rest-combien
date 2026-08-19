import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { formatMontant, formatPourcentage } from '../utils/format';
import { ResultatMicro } from '../../engine/types';

interface RepartitionChartProps {
  result: ResultatMicro;
}

function LegendItem({
  color,
  label,
  amount,
  ratio,
}: {
  color: string;
  label: string;
  amount: number;
  ratio: number;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.legendText}>
        <Text style={styles.legendLabel}>{label}</Text>
        <Text style={styles.legendAmount}>
          {formatMontant(amount)} · {formatPourcentage(ratio)}
        </Text>
      </View>
    </View>
  );
}

export function RepartitionChart({ result }: RepartitionChartProps) {
  const { totalPrelevementsSociaux, impotRetenu, revenuNetDisponible, caAnnuelHT } = result;

  const ratioSociaux = totalPrelevementsSociaux / caAnnuelHT;
  const ratioImpot = impotRetenu / caAnnuelHT;
  const ratioNet = revenuNetDisponible / caAnnuelHT;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Répartition du chiffre d'affaires</Text>
      <ProgressBar
        segments={[
          { ratio: ratioSociaux, color: colors.negative },
          { ratio: ratioImpot, color: colors.alert },
          { ratio: ratioNet, color: colors.primary },
        ]}
        height={16}
      />
      <View style={styles.legend}>
        <LegendItem
          color={colors.negative}
          label="Cotisations et CFP"
          amount={totalPrelevementsSociaux}
          ratio={ratioSociaux}
        />
        <LegendItem
          color={colors.alert}
          label="Impôt sur le revenu"
          amount={impotRetenu}
          ratio={ratioImpot}
        />
        <LegendItem
          color={colors.primary}
          label="Net disponible"
          amount={revenuNetDisponible}
          ratio={ratioNet}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  legend: {
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    ...typography.bodySmall,
    color: colors.ink,
  },
  legendAmount: {
    ...typography.caption,
    color: colors.inkSecondary,
  },
});
