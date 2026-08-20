import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ActivityCard } from '../components/ActivityCard';
import { PressableScale } from '../components/PressableScale';
import { FadeInView } from '../components/FadeInView';
import { Button } from '../design-system';
import { ActivityChoice, ACTIVITY_OPTIONS } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { parseMontantSaisi } from '../utils/format';

interface HomeScreenProps {
  onCalculate: () => void;
}

const ACTIVITY_ICONS: Record<ActivityChoice, 'bag' | 'business' | 'hammer' | 'briefcase'> = {
  VENTE_MARCHANDISES: 'bag',
  PRESTATION_COMMERCIALE: 'business',
  PRESTATION_ARTISANALE: 'hammer',
  PROFESSION_LIBERALE: 'briefcase',
};

export function HomeScreen({ onCalculate }: HomeScreenProps) {
  const { form, setFormField } = useCalculatorContext();
  const [step, setStep] = useState<'activity' | 'revenue'>('activity');
  const [displayAmount, setDisplayAmount] = useState(form.caAnnuelHT);

  const handleActivitySelect = (activity: ActivityChoice) => {
    setFormField('activity', activity);
    setStep('revenue');
  };

  const handleAmountChange = (value: string) => {
    setDisplayAmount(value);
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

  const parsedAmount = parseMontantSaisi(displayAmount);
  const canCalculate = parsedAmount !== null && parsedAmount > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Il reste combien ?</Text>
          <Text style={styles.tagline}>Calculateur micro-entreprise 2026</Text>
        </View>

        <View style={styles.content}>
          {step === 'activity' ? (
            <FadeInView key="activity" duration={300}>
              <Text style={styles.stepTitle}>Quelle est ton activité ?</Text>
              <Text style={styles.stepSubtitle}>
                Choisis la catégorie qui correspond le mieux à ton métier.
              </Text>

              <View style={styles.cardsContainer}>
                {ACTIVITY_OPTIONS.map((option) => (
                  <ActivityCard
                    key={option.value}
                    label={option.label}
                    description={getActivityDescription(option.value)}
                    icon={ACTIVITY_ICONS[option.value]}
                    selected={form.activity === option.value}
                    onPress={() => handleActivitySelect(option.value)}
                  />
                ))}
              </View>

              <Text style={styles.tip}>
                Professions réglementées (Cipav) : bientôt disponibles.
              </Text>
            </FadeInView>
          ) : (
            <FadeInView key="revenue" duration={300}>
              <PressableScale onPress={handleBack} scale={0.95} style={styles.backButton}>
                <Text style={styles.backText}>← Retour</Text>
              </PressableScale>

              <Text style={styles.stepTitle}>Ton chiffre d'affaires annuel</Text>
              <Text style={styles.stepSubtitle}>
                Saisis le montant HT que tu prévois de facturer cette année.
              </Text>

              <View style={styles.amountContainer}>
                <Text style={styles.currency}>€</Text>
                <TextInput
                  style={styles.amountInput}
                  value={displayAmount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor={colors.inkTertiary}
                  keyboardType="numeric"
                  autoFocus
                  textAlign="center"
                />
              </View>

              <Text style={styles.amountHint}>
                Hors taxes, charges non déduites
              </Text>

              <View style={styles.spacer} />

              <Button
                label="Calculer"
                onPress={handleCalculate}
                disabled={!canCalculate}
                variant="primary"
                size="lg"
              />
            </FadeInView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getActivityDescription(value: ActivityChoice): string {
  switch (value) {
    case 'VENTE_MARCHANDISES':
      return 'Commerce, revente, e-commerce';
    case 'PRESTATION_COMMERCIALE':
      return 'Services, conseil, accompagnement';
    case 'PRESTATION_ARTISANALE':
      return 'Artisanat, travaux manuels';
    case 'PROFESSION_LIBERALE':
      return 'Libérale non réglementée';
  }
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  logo: {
    ...typography.h2,
    color: colors.ink,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginTop: spacing.xxs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stepTitle: {
    ...typography.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.inkSecondary,
    marginBottom: spacing.xl,
  },
  cardsContainer: {
    marginTop: spacing.sm,
  },
  tip: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSolid,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xl,
  },
  currency: {
    ...typography.hero,
    color: colors.inkTertiary,
    marginRight: spacing.sm,
  },
  amountInput: {
    ...typography.hero,
    color: colors.ink,
    minWidth: 120,
  },
  amountHint: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  spacer: {
    flex: 1,
  },
});
