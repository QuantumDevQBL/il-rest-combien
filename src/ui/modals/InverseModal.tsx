import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Input } from '../components/Input';
import { Button, Card, Icon } from '../design-system';
import { PressableScale } from '../components/PressableScale';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { colors, radius, spacing, typography } from '../theme';
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Objectif de revenu</Text>
          <PressableScale onPress={onClose} scale={0.9}>
            <View style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.ink} />
            </View>
          </PressableScale>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
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
                  <AnimatedNumber
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
                    <Icon name="briefcase" size={24} color={colors.primary} />
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
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Fermer" onPress={onClose} variant="primary" size="lg" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  intro: {
    ...typography.body,
    color: colors.inkSecondary,
    marginBottom: spacing.xl,
  },
  results: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.infoLight,
    borderColor: colors.info,
  },
  infoText: {
    ...typography.body,
    color: colors.ink,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
});
