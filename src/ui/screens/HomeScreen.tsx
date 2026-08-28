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
import { ActivityGrid } from '../components/ActivityGrid';
import { FadeInView } from '../components/FadeInView';
import { Input } from '../components/Input';
import { LogoHeader } from '../components/LogoHeader';
import { MoneyInput } from '../components/MoneyInput';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Button, Card } from '../design-system';
import { ACTIVITY_OPTIONS, ActivityChoice, getActivityLabel } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { trackEvent } from '../utils/analytics';
import { formatMontant, parseMontantSaisi } from '../utils/format';
import { hapticSelection } from '../utils/haptics';

interface HomeScreenProps {
  onCalculate: () => void;
  onOpenHistory?: () => void;
}

export function HomeScreen({ onCalculate, onOpenHistory }: HomeScreenProps) {
  const { form, result, setFormField } = useCalculatorContext();

  const handleActivitySelect = (activity: ActivityChoice) => {
    void hapticSelection();
    setFormField('activity', activity);
  };

  const handleCalculate = () => {
    if (result) {
      void trackEvent('simulation_completed');
    }
    onCalculate();
  };

  const parsedAmount = parseMontantSaisi(form.caAnnuelHT);
  const canCalculate = parsedAmount !== null && parsedAmount > 0;
  const selectedActivityLabel = getActivityLabel(form.activity);
  const selectedActivityDescription =
    ACTIVITY_OPTIONS.find((option) => option.value === form.activity)?.description ?? '';
  const previewAmount = parsedAmount && parsedAmount > 0 ? formatMontant(parsedAmount) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LogoHeader onHistory={onOpenHistory} showTagline />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeInView duration={350} style={styles.stack}>
            <View style={styles.heroBlock}>
              <Text style={styles.eyebrow}>Simulation</Text>
              <Text style={styles.stepTitle}>Le vrai net, avant de le depenser.</Text>
              <Text style={styles.stepSubtitle}>
                Entrez votre CA, choisissez votre activite, puis obtenez tout de suite
                votre vrai net.
              </Text>
            </View>

            <Card style={styles.mainCard}>
              <View style={styles.inputBlock}>
                <Text style={styles.sectionLabel}>CA annuel HT</Text>
                <Text style={styles.sectionHint}>Saisissez directement votre estimation.</Text>
                <MoneyInput
                  value={form.caAnnuelHT}
                  onChangeText={(value) => setFormField('caAnnuelHT', value)}
                  placeholder="0"
                  size="hero"
                />
                <Text style={styles.amountHint}>CA annuel HT estime</Text>
              </View>

              <View style={styles.activitySection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionLabel}>Activite</Text>
                  <Text style={styles.inlineBadge}>{selectedActivityLabel}</Text>
                </View>
                <ActivityGrid selected={form.activity} onSelect={handleActivitySelect} />
                <Text style={styles.activityHint}>{selectedActivityDescription}</Text>
              </View>
              <Input
                label="Nom de l'estimation"
                value={form.label}
                onChangeText={(value) => setFormField('label', value)}
                placeholder="Ex : Projet client A"
                keyboardType="default"
                helper="Optionnel."
              />
            </Card>

            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Simulation Free complete</Text>
              <Text style={styles.infoText}>
                Net, cotisations, impot, detail et alertes essentielles.
              </Text>
              {previewAmount ? (
                <Text style={styles.infoHighlight}>
                  {selectedActivityLabel} · {previewAmount}
                </Text>
              ) : null}
            </Card>
          </FadeInView>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Calculer mon net"
            onPress={handleCalculate}
            disabled={!canCalculate}
            variant="primary"
            size="lg"
          />
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  stack: {
    gap: spacing.xs,
  },
  heroBlock: {
    marginBottom: spacing.xs,
  },
  mainCard: {
    gap: spacing.sm,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
  },
  sectionHint: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  inlineBadge: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  inputBlock: {
    gap: spacing.xs,
  },
  activitySection: {
    gap: spacing.xs,
  },
  amountHint: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
  },
  activityHint: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
  },
  infoTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  infoHighlight: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});
