import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ActivityGrid } from '../components/ActivityGrid';
import { LogoHeader } from '../components/LogoHeader';
import { MoneyInput } from '../components/MoneyInput';
import { Input } from '../components/Input';
import { PressableScale } from '../components/PressableScale';
import { FadeInView } from '../components/FadeInView';
import { Button, Icon } from '../design-system';
import { hapticSelection } from '../utils/haptics';
import { ActivityChoice, getActivityLabel } from '../mapping';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { formatMontant, parseMontantSaisi } from '../utils/format';

interface HomeScreenProps {
  onCalculate: () => void;
  onOpenHistory?: () => void;
}

export function HomeScreen({ onCalculate, onOpenHistory }: HomeScreenProps) {
  const { form, setFormField } = useCalculatorContext();
  const [step, setStep] = useState<'activity' | 'revenue'>('activity');
  const { height } = useWindowDimensions();
  const isCompact = height < 760;

  const handleActivitySelect = (activity: ActivityChoice) => {
    void hapticSelection();
    setFormField('activity', activity);
    setStep('revenue');
  };

  const handleAmountChange = (value: string) => {
    setFormField('caAnnuelHT', value);
  };

  const handleBack = () => {
    Keyboard.dismiss();
    setStep('activity');
  };

  const handleCalculate = () => {
    Keyboard.dismiss();
    onCalculate();
  };

  const parsedAmount = parseMontantSaisi(form.caAnnuelHT);
  const canCalculate = parsedAmount !== null && parsedAmount > 0;
  const selectedActivityLabel = getActivityLabel(form.activity);
  const previewAmount = parsedAmount && parsedAmount > 0 ? formatMontant(parsedAmount) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LogoHeader onHistory={onOpenHistory} showTagline />

        <View style={styles.content}>
          {step === 'activity' ? (
            <FadeInView key="activity" duration={350} style={styles.stepContainer}>
              <View style={styles.heroBlock}>
                <Text style={styles.eyebrow}>Simulation micro-entreprise</Text>
                <Text style={styles.stepTitle}>Quelle est ton activité ?</Text>
                <Text style={styles.stepSubtitle}>
                  En moins d&apos;une minute, tu vois ce qu&apos;il te reste vraiment
                  après charges et impôt.
                </Text>
              </View>

              <View style={styles.progressCard}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Étape 1 sur 2</Text>
                  <Text style={styles.progressMeta}>Choix du métier</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, styles.progressFillHalf]} />
                </View>
              </View>

              <View style={styles.gridWrapper}>
                <ActivityGrid selected={form.activity} onSelect={handleActivitySelect} />
              </View>

              <View style={[styles.tipCard, isCompact && styles.tipCardCompact]}>
                <View style={styles.tipIcon}>
                  <Icon name="flash" size={18} color={colors.primary} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Pensé pour aller vite</Text>
                  <Text style={styles.tip}>
                    Base 2026 fiable, calcul local, et aucun compte à créer.
                  </Text>
                </View>
              </View>
            </FadeInView>
          ) : (
            <FadeInView key="revenue" duration={350} style={styles.stepContainer}>
              <View style={styles.headerText}>
                <PressableScale
                  onPress={handleBack}
                  scale={0.95}
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel="Retour à la sélection d'activité"
                >
                  <Icon name="arrowBack" size={16} color={colors.primary} />
                  <Text style={styles.backText}>Retour</Text>
                </PressableScale>

                <Text style={styles.eyebrow}>Étape 2 sur 2</Text>
                <Text style={styles.stepTitle}>Ton chiffre d&apos;affaires</Text>
                <Text style={styles.stepSubtitle}>
                  Indique ton CA annuel HT prévu. L&apos;estimation se mettra sur le
                  bon régime pour {selectedActivityLabel.toLowerCase()}.
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Activité</Text>
                  <Text style={styles.summaryValue}>{selectedActivityLabel}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Simulation</Text>
                  <Text style={styles.summaryValue}>
                    {previewAmount ?? 'Prête à saisir'}
                  </Text>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <MoneyInput
                  value={form.caAnnuelHT}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  autoFocus
                  size="hero"
                />
                <Text style={styles.amountHint}>
                  Hors taxes, charges non déduites
                </Text>

                <View style={styles.labelInput}>
                  <Input
                    label="Nom de l'estimation"
                    value={form.label}
                    onChangeText={(value) => setFormField('label', value)}
                    placeholder="Ex : Projet client A"
                    keyboardType="default"
                    helper="Pour retrouver cette simulation dans l'historique."
                  />
                </View>
              </View>

              <View style={styles.footer}>
                <Button
                  label="Calculer"
                  onPress={handleCalculate}
                  disabled={!canCalculate}
                  variant="primary"
                  size="lg"
                />
              </View>
            </FadeInView>
          )}
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  stepContainer: {
    flex: 1,
  },
  heroBlock: {
    marginBottom: spacing.md,
  },
  headerText: {
    marginBottom: spacing.md,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    ...typography.h1,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.inkSecondary,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.primary,
  },
  progressMeta: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  progressFillHalf: {
    width: '50%',
  },
  gridWrapper: {
    flex: 1,
    alignSelf: 'stretch',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  tipCardCompact: {
    marginTop: spacing.xs,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  tip: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: spacing.xxs,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginBottom: spacing.xxs,
  },
  summaryValue: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  amountHint: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  labelInput: {
    marginTop: spacing.xs,
  },
  footer: {
    paddingTop: spacing.sm,
  },
});
