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
import { Button, Icon } from '../design-system';
import { hapticSelection } from '../utils/haptics';
import { ActivityChoice } from '../mapping';
import { colors, spacing, typography } from '../theme';
import { parseMontantSaisi } from '../utils/format';

interface HomeScreenProps {
  onCalculate: () => void;
  onOpenHistory?: () => void;
}

export function HomeScreen({ onCalculate, onOpenHistory }: HomeScreenProps) {
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LogoHeader onHistory={onOpenHistory} showTagline />

        <View style={styles.content}>
          {step === 'activity' ? (
            <FadeInView key="activity" duration={350} style={styles.stepContainer}>
              <View style={styles.headerText}>
                <Text style={styles.stepTitle}>Quelle est ton activité ?</Text>
                <Text style={styles.stepSubtitle}>
                  Choisis la catégorie qui correspond à ton métier.
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

                <Text style={styles.stepTitle}>Ton chiffre d'affaires</Text>
                <Text style={styles.stepSubtitle}>
                  Montant HT prévu cette année.
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
  },
  stepContainer: {
    flex: 1,
  },
  headerText: {
    marginBottom: spacing.md,
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
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  tipWrapper: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  tip: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
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
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.md,
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
    paddingBottom: spacing.lg,
  },
});
