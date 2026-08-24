import React from 'react';
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
import { LogoHeader } from '../components/LogoHeader';
import { MoneyInput } from '../components/MoneyInput';
import { Input } from '../components/Input';
import { PressableScale } from '../components/PressableScale';
import { Button, Icon, IconName } from '../design-system';
import { hapticSelection } from '../utils/haptics';
import { ACTIVITY_OPTIONS, ActivityChoice } from '../mapping';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { parseMontantSaisi } from '../utils/format';

interface HomeScreenProps {
  onCalculate: () => void;
  onOpenHistory?: () => void;
}

const ACTIVITY_ICONS: Record<ActivityChoice, IconName> = {
  VENTE_MARCHANDISES: 'cart',
  PRESTATION_COMMERCIALE: 'business',
  PRESTATION_ARTISANALE: 'construct',
  PROFESSION_LIBERALE: 'briefcase',
};

export function HomeScreen({ onCalculate, onOpenHistory }: HomeScreenProps) {
  const { form, setFormField } = useCalculatorContext();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 380 || height < 760;

  const handleActivitySelect = (activity: ActivityChoice) => {
    void hapticSelection();
    setFormField('activity', activity);
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
          <View style={styles.heroBlock}>
            <Text style={styles.stepTitle}>Quelle est ton activité ?</Text>
            <Text style={styles.stepSubtitle}>
              Choisis ton métier, saisis ton chiffre d&apos;affaires HT, puis calcule.
            </Text>
          </View>

          <View style={styles.grid}>
            {ACTIVITY_OPTIONS.map((option) => {
              const isSelected = form.activity === option.value;
              return (
                <PressableScale
                  key={option.value}
                  onPress={() => handleActivitySelect(option.value)}
                  scale={0.97}
                  style={[styles.activityItem, isCompact && styles.activityItemCompact]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={option.label}
                >
                  <View
                    style={[
                      styles.activityCard,
                      isSelected && styles.activityCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        isSelected && styles.iconCircleSelected,
                      ]}
                    >
                      <Icon
                        name={ACTIVITY_ICONS[option.value]}
                        size={isCompact ? 24 : 28}
                        color={isSelected ? colors.surface : colors.primary}
                      />
                    </View>
                    <Text style={[styles.activityLabel, isSelected && styles.activityLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={styles.activityDescription}>{option.description}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>

          <View style={styles.inputSection}>
            <MoneyInput
              value={form.caAnnuelHT}
              onChangeText={(value) => setFormField('caAnnuelHT', value)}
              placeholder="0"
              size="hero"
            />
            <Text style={styles.amountHint}>Chiffre d&apos;affaires annuel HT</Text>

            <Input
              label="Nom de l'estimation"
              value={form.label}
              onChangeText={(value) => setFormField('label', value)}
              placeholder="Ex : Client A"
              keyboardType="default"
              helper="Facultatif. Sert seulement à retrouver la simulation."
            />
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
    paddingBottom: spacing.lg,
  },
  heroBlock: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  activityItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  activityItemCompact: {
    marginBottom: spacing.sm,
  },
  activityCard: {
    minHeight: 152,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  activityCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
  },
  activityLabel: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xxs,
  },
  activityLabelSelected: {
    color: colors.primaryDark,
  },
  activityDescription: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    textAlign: 'center',
    minHeight: 32,
  },
  inputSection: {
    marginTop: 'auto',
  },
  amountHint: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  footer: {
    paddingTop: spacing.md,
  },
});
