import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { FadeInView } from '../components/FadeInView';
import { PressableScale } from '../components/PressableScale';
import { ProgressBar, Badge, Card, Icon } from '../design-system';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { MentionLegale } from '../components/MentionLegale';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { formatMontant } from '../utils/format';

interface ResultScreenProps {
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenInverse: () => void;
  onOpenDetail: () => void;
}

export function ResultScreen({
  onReset,
  onOpenSettings,
  onOpenHistory,
  onOpenInverse,
  onOpenDetail,
}: ResultScreenProps) {
  const { result } = useCalculatorContext();

  if (!result) return null;

  const netMensuel = result.revenuNetDisponible / 12;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Il reste combien ?</Text>
        </View>
        <View style={styles.headerActions}>
          <PressableScale
            onPress={onOpenHistory}
            scale={0.9}
            accessibilityRole="button"
            accessibilityLabel="Historique"
          >
            <View style={styles.iconButton}>
              <Icon name="time" size={24} color={colors.ink} />
            </View>
          </PressableScale>
          <PressableScale
            onPress={onOpenSettings}
            scale={0.9}
            accessibilityRole="button"
            accessibilityLabel="Paramètres fiscaux"
          >
            <View style={styles.iconButton}>
              <Icon name="settings" size={24} color={colors.ink} />
            </View>
          </PressableScale>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={0}>
          <Card variant="glass" style={styles.heroCard}>
            <Text style={styles.heroLabel}>Il te reste</Text>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>€</Text>
              <AnimatedNumber
                value={result.revenuNetDisponible}
                style={styles.heroAmount}
                formatter={(v) =>
                  Math.round(v).toLocaleString('fr-FR')
                }
              />
            </View>
            <Text style={styles.heroMonthly}>soit {formatMontant(netMensuel)} / mois</Text>

            <View style={styles.progressContainer}>
              <ProgressBar
                segments={[
                  { ratio: result.totalPrelevementsSociaux / result.caAnnuelHT, color: colors.info },
                  { ratio: result.impotRetenu / result.caAnnuelHT, color: colors.alert },
                  { ratio: result.revenuNetDisponible / result.caAnnuelHT, color: colors.success },
                ]}
                height={12}
              />
            </View>

            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>
                Sur 100 € : {formatMontant(result.resteSurCent)}
              </Text>
              <Text style={styles.heroFooterText}>
                Prélèvements : {(result.tauxPrelevementGlobal * 100).toFixed(1)} %
              </Text>
            </View>
          </Card>
        </FadeInView>

        <FadeInView delay={100}>
          <Comparaison result={result} />
        </FadeInView>

        <FadeInView delay={200}>
          <Alertes result={result} />
        </FadeInView>

        <FadeInView delay={300}>
          <View style={styles.actionsContainer}>
            <PressableScale onPress={onOpenDetail} scale={0.97} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="statsChart" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Voir le détail</Text>
                <Text style={styles.actionDescription}>Décompte complet poste par poste</Text>
              </View>
              <Icon name="arrowForward" size={20} color={colors.inkTertiary} />
            </PressableScale>

            <PressableScale onPress={onOpenInverse} scale={0.97} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="swapHorizontal" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Objectif de revenu</Text>
                <Text style={styles.actionDescription}>Combien facturer pour gagner X € ?</Text>
              </View>
              <Icon name="arrowForward" size={20} color={colors.inkTertiary} />
            </PressableScale>
          </View>
        </FadeInView>

        <FadeInView delay={400}>
          <PressableScale onPress={onReset} scale={0.97}>
            <Text style={styles.resetText}>Nouvelle simulation</Text>
          </PressableScale>
        </FadeInView>

        <MentionLegale />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  logo: {
    ...typography.h3,
    color: colors.ink,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
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
    paddingBottom: spacing.xxxl,
  },
  heroCard: {
    marginBottom: spacing.lg,
    ...shadows.lg,
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
    ...typography.display,
    color: colors.ink,
  },
  heroMonthly: {
    ...typography.body,
    color: colors.inkSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  progressContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroFooterText: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  actionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSolid,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(245, 183, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  actionDescription: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  resetText: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
