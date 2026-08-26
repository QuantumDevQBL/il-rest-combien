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
import { ActivityGrid } from '../components/ActivityGrid';
import { LogoHeader } from '../components/LogoHeader';
import { MoneyInput } from '../components/MoneyInput';
import { Input } from '../components/Input';
import { FadeInView } from '../components/FadeInView';
import { Button, Icon } from '../design-system';
import { trackEvent } from '../utils/analytics';
import { hapticSelection } from '../utils/haptics';
import { ActivityChoice, getActivityLabel } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { formatMontant, parseMontantSaisi } from '../utils/format';

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
          <FadeInView duration={350} style={styles.stepContainer}>
            <View style={styles.heroBlock}>
              <Text style={styles.eyebrow}>Calculateur micro-entreprise</Text>
              <Text style={styles.stepTitle}>Le vrai net, avant de le dépenser.</Text>
              <Text style={styles.stepSubtitle}>
                Choisissez votre activité, indiquez votre CA, et obtenez tout de
                suite ce que vous pouvez réellement garder.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Activité</Text>
              <ActivityGrid selected={form.activity} onSelect={handleActivitySelect} />
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Activité</Text>
                <Text style={styles.summaryValue}>{selectedActivityLabel}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>CA saisi</Text>
                <Text style={styles.summaryValue}>{previewAmount ?? 'À renseigner'}</Text>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <MoneyInput
                value={form.caAnnuelHT}
                onChangeText={(value) => setFormField('caAnnuelHT', value)}
                placeholder="0"
                size="hero"
              />
              <Text style={styles.amountHint}>CA annuel HT estimé</Text>
            </View>

            <View style={styles.labelInput}>
              <Input
                label="Nom de l'estimation"
                value={form.label}
                onChangeText={(value) => setFormField('label', value)}
                placeholder="Ex : Projet client A"
                keyboardType="default"
                helper="Optionnel, pour retrouver cette simulation."
              />
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Icon name="flash" size={18} color={colors.primary} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Calcul local, sans compte</Text>
                <Text style={styles.tip}>
                  Le résultat Free reste complet: net, prélèvements, détail et
                  alertes essentielles.
                </Text>
              </View>
            </View>
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
  stepContainer: {
    gap: spacing.md,
  },
  heroBlock: {
    marginBottom: spacing.xs,
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
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
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
    marginTop: spacing.xs,
  },
  amountHint: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  labelInput: {
    marginTop: spacing.xs,
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});
