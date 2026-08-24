import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
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
import { Button } from '../design-system';
import { hapticSelection } from '../utils/haptics';
import { ActivityChoice } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { parseMontantSaisi } from '../utils/format';

interface HomeScreenProps {
  onCalculate: () => void;
}

function getCurrentMonthLabel(): string {
  const date = new Date();
  const month = date.toLocaleDateString('fr-FR', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

export function HomeScreen({ onCalculate }: HomeScreenProps) {
  const { form, setFormField } = useCalculatorContext();
  const [step, setStep] = useState<'activity' | 'revenue'>('activity');

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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LogoHeader />

        <View style={styles.content}>
          {step === 'activity' ? (
            <FadeInView key="activity" duration={300} style={styles.stepContainer}>
              <View style={styles.greetingRow}>
                <View>
                  <Text style={styles.greeting}>Bonjour 👋</Text>
                  <Text style={styles.month}>{getCurrentMonthLabel()}</Text>
                </View>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>RC</Text>
                </View>
              </View>

              <View style={styles.headerText}>
                <Text style={styles.stepTitle}>Quelle est ton activité ?</Text>
                <Text style={styles.stepSubtitle}>
                  Choisis la catégorie qui correspond le mieux à ton métier.
                </Text>
              </View>

              <View style={styles.gridWrapper}>
                <ActivityGrid
                  selected={form.activity}
                  onSelect={handleActivitySelect}
                />
              </View>

              <View style={styles.tipWrapper}>
                <Text style={styles.tip}>
                  Professions réglementées (Cipav) : bientôt disponibles.
                </Text>
              </View>
            </FadeInView>
          ) : (
            <FadeInView key="revenue" duration={300} style={styles.stepContainer}>
              <View style={styles.headerText}>
                <PressableScale
                  onPress={handleBack}
                  scale={0.95}
                  style={styles.backButton}
                >
                  <Text style={styles.backText}>← Retour</Text>
                </PressableScale>

                <Text style={styles.stepTitle}>Ton chiffre d'affaires</Text>
                <Text style={styles.stepSubtitle}>
                  Saisis le montant HT prévu pour cette année.
                </Text>
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
                    label="Nom de l'estimation (optionnel)"
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
  },
  stepContainer: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  month: {
    ...typography.h3,
    color: colors.ink,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '800',
  },
  headerText: {
    marginBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.inkSecondary,
  },
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  tipWrapper: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  tip: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  amountHint: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  labelInput: {
    marginTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
