import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityGrid } from '../components/ActivityGrid';
import { FadeInView } from '../components/FadeInView';
import { Input } from '../components/Input';
import { LogoHeader } from '../components/LogoHeader';
import { MoneyInput } from '../components/MoneyInput';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Button, Card } from '../design-system';
import { ACTIVITY_OPTIONS, ActivityChoice, getActivityLabel } from '../mapping';
import { colors, spacing, typography } from '../theme';
import { trackEvent } from '../utils/analytics';
import { formatMontant, parseMontantSaisi } from '../utils/format';
import { hapticSelection } from '../utils/haptics';

interface HomeScreenProps {
  onCalculate: () => void;
  onOpenHistory?: () => void;
}

export function HomeScreen({ onCalculate, onOpenHistory }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
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
        <LogoHeader onHistory={onOpenHistory} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeInView duration={300} style={styles.contentInner}>
            <View style={styles.heroBlock}>
              <Text style={styles.eyebrow}>Simulation</Text>
              <Text style={styles.stepTitle}>Le vrai net, avant de le depenser.</Text>
              <Text style={styles.stepSubtitle}>
                Entrez votre CA, choisissez votre activite, puis obtenez votre vrai net.
              </Text>
            </View>

            <Card style={styles.mainCard}>
              <View style={styles.inputBlock}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionLabel}>CA annuel HT estime</Text>
                  {previewAmount ? <Text style={styles.inlineBadge}>{previewAmount}</Text> : null}
                </View>
                <MoneyInput
                  value={form.caAnnuelHT}
                  onChangeText={(value) => setFormField('caAnnuelHT', value)}
                  placeholder="0"
                  size="hero"
                />
                <Text style={styles.amountHint}>
                  Le chiffre principal reste au centre du premier ecran.
                </Text>
              </View>

              <Input
                label="Nom de l'estimation"
                value={form.label}
                onChangeText={(value) => setFormField('label', value)}
                placeholder="Ex : Projet client A"
                keyboardType="default"
              />
            </Card>

            <View style={styles.activitySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Activite</Text>
                <Text style={styles.inlineBadge}>{selectedActivityLabel}</Text>
              </View>
              <ActivityGrid selected={form.activity} onSelect={handleActivitySelect} />
              <Text style={styles.activityHint}>{selectedActivityDescription}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Simulation Free complete</Text>
              <Text style={styles.infoText}>Net, detail, impot et alertes essentielles.</Text>
            </View>
          </FadeInView>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
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
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  contentInner: {
    gap: spacing.md,
  },
  heroBlock: {
    gap: spacing.xxs,
  },
  mainCard: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.ink,
  },
  stepSubtitle: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
  },
  inlineBadge: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  inputBlock: {
    gap: spacing.xs,
  },
  activitySection: {
    gap: spacing.sm,
  },
  amountHint: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  activityHint: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  infoRow: {
    paddingHorizontal: spacing.xs,
    gap: spacing.xxs,
  },
  infoTitle: {
    ...typography.caption,
    color: colors.ink,
    fontWeight: '800',
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});
