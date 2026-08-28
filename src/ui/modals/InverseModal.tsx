import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Input } from '../components/Input';
import { ModalContainer } from '../components/ModalContainer';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Card, Icon } from '../design-system';
import { JOURS_FACTURES_REFERENCE } from '../constants';
import { colors, spacing, typography } from '../theme';
import { formatMontant, parseMontantSaisi } from '../utils/format';

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
      <Card style={styles.introCard}>
        <Text style={styles.introTitle}>Objectif mensuel</Text>
        <Text style={styles.intro}>
          Indique le net mensuel que tu souhaites. On calcule le chiffre d'affaires a
          facturer.
        </Text>
      </Card>

      <Input
        label="Objectif net mensuel"
        value={form.objectifNetMensuel}
        onChangeText={(value) => setFormField('objectifNetMensuel', value)}
        placeholder="0"
        suffix="EUR"
        helper="Apres cotisations, impot et charges fixes."
      />

      {hasResult ? (
        <View style={styles.results}>
          <Card variant="glass" style={styles.heroCard}>
            <Text style={styles.heroLabel}>Chiffre d'affaires annuel requis</Text>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>EUR</Text>
              <AnimatedCounter
                value={caRequis}
                style={styles.heroAmount}
                formatter={(value) => Math.round(value).toLocaleString('fr-FR')}
              />
            </View>
            <Text style={styles.heroSubtitle}>
              soit {formatMontant(caRequis / 12)} / mois en moyenne
            </Text>
          </Card>

          {tjmRequis !== null ? (
            <Card style={styles.tjmCard}>
              <View style={styles.tjmHeader}>
                <View style={styles.tjmTitleRow}>
                  <Icon name="briefcase" size={20} color={colors.primary} />
                  <Text style={styles.tjmTitle}>TJM indicatif</Text>
                </View>
                <Text style={styles.tjmAmount}>{formatMontant(tjmRequis)}</Text>
              </View>
              <Text style={styles.tjmCaption}>
                Base {JOURS_FACTURES_REFERENCE} jours factures par an
              </Text>
            </Card>
          ) : null}
        </View>
      ) : null}

      {!hasResult && hasValidObjective ? (
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            Complete les parametres fiscaux pour obtenir une estimation du chiffre
            d'affaires requis.
          </Text>
        </Card>
      ) : null}
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  introCard: {
    gap: spacing.xxs,
  },
  introTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  intro: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    lineHeight: 20,
  },
  results: {
    gap: spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  heroLabel: {
    ...typography.overline,
    color: colors.inkTertiary,
    marginBottom: spacing.sm,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  heroCurrency: {
    ...typography.h3,
    color: colors.primary,
  },
  heroAmount: {
    ...typography.hero,
    color: colors.ink,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.inkSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  tjmCard: {
    gap: spacing.xs,
  },
  tjmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  tjmTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  tjmTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '700',
  },
  tjmAmount: {
    ...typography.amountLarge,
    color: colors.primary,
    textAlign: 'right',
  },
  tjmCaption: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  infoCard: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  infoText: {
    ...typography.body,
    color: colors.ink,
  },
});
