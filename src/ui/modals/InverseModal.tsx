import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ModalContainer } from '../components/ModalContainer';
import { Input } from '../components/Input';
import { Card, Icon } from '../design-system';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { colors, spacing, typography } from '../theme';
import { formatMontant, parseMontantSaisi } from '../utils/format';
import { JOURS_FACTURES_REFERENCE } from '../constants';

interface InverseModalProps {
  onClose: () => void;
}

export function InverseModal({ onClose }: InverseModalProps) {
  const { form, caRequis, tjmRequis, setFormField } = useCalculatorContext();

  const objectifMensuel = parseMontantSaisi(form.objectifNetMensuel);
  const hasValidObjective = objectifMensuel !== null && objectifMensuel > 0;
  const hasResult = hasValidObjective && caRequis !== null;

  return (
    <ModalContainer title="Objectif de revenu" onClose={onClose}>
      <Text style={styles.intro}>
        Indique le net mensuel que tu souhaites. On calcule le chiffre d'affaires à facturer.
      </Text>

      <Input
        label="Objectif net mensuel"
        value={form.objectifNetMensuel}
        onChangeText={(value) => setFormField('objectifNetMensuel', value)}
        placeholder="0"
        suffix="€"
        helper="Après cotisations, impôt et charges fixes."
      />

      {hasResult ? (
        <View style={styles.results}>
          <Card variant="glass" style={styles.heroCard}>
            <Text style={styles.heroLabel}>Chiffre d'affaires annuel requis</Text>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>€</Text>
              <AnimatedCounter
                value={caRequis}
                style={styles.heroAmount}
                formatter={(v) => Math.round(v).toLocaleString('fr-FR')}
              />
            </View>
            <Text style={styles.heroSubtitle}>
              soit {formatMontant(caRequis / 12)} / mois en moyenne
            </Text>
          </Card>

          {tjmRequis !== null && (
            <Card style={styles.tjmCard}>
              <View style={styles.tjmHeader}>
                <Icon name="briefcase" size={22} color={colors.primary} />
                <Text style={styles.tjmTitle}>TJM indicatif</Text>
              </View>
              <Text style={styles.tjmAmount}>{formatMontant(tjmRequis)}</Text>
              <Text style={styles.tjmCaption}>
                Base {JOURS_FACTURES_REFERENCE} jours facturés par an
              </Text>
            </Card>
          )}
        </View>
      ) : hasValidObjective ? (
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            Complète les paramètres fiscaux pour obtenir une estimation du chiffre d'affaires requis.
          </Text>
        </Card>
      ) : null}
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  results: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  heroLabel: {
    ...typography.overline,
    color: colors.inkTertiary,
    marginBottom: spacing.sm,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  heroCurrency: {
    ...typography.h2,
    color: colors.primary,
    marginRight: spacing.xs,
    marginTop: spacing.sm,
  },
  heroAmount: {
    ...typography.hero,
    color: colors.ink,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.inkSecondary,
    marginTop: spacing.sm,
  },
  tjmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tjmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tjmTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '700',
  },
  tjmAmount: {
    ...typography.amountLarge,
    color: colors.primary,
  },
  tjmCaption: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginTop: spacing.xxs,
  },
  infoCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  infoText: {
    ...typography.body,
    color: colors.ink,
  },
});
