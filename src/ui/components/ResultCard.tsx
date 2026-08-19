import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar } from '../design-system';
import { colors, shadows, spacing, typography } from '../theme';
import { formatMontant, formatMontantBrut, formatPourcentage } from '../utils/format';
import { ResultatMicro } from '../../engine/types';

interface ResultCardProps {
  result: ResultatMicro;
}

export function ResultCard({ result }: ResultCardProps) {
  const netMensuel = result.revenuNetDisponible / 12;

  return (
    <Card variant="accent" style={[styles.card, shadows.lg]}>
      <Text style={styles.eyebrow}>Net disponible</Text>
      <Text style={styles.amount}>{formatMontantBrut(result.revenuNetDisponible)} €</Text>
      <Text style={styles.subtitle}>soit {formatMontant(netMensuel)} / mois</Text>

      <View style={styles.barContainer}>
        <ProgressBar
          segments={[
            { ratio: result.tauxPrelevementGlobal, color: 'rgba(255,255,255,0.5)' },
            { ratio: 1 - result.tauxPrelevementGlobal, color: colors.surface },
          ]}
          height={10}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Reste sur 100 € : {formatMontantBrut(result.resteSurCent)} €
        </Text>
        <Text style={styles.footerText}>
          Prélèvements : {formatPourcentage(result.tauxPrelevementGlobal)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.overline,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.sm,
  },
  amount: {
    ...typography.hero,
    color: colors.surface,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xxs,
  },
  barContainer: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.sm,
  },
  footerText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
});
