import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { FadeInView } from '../components/FadeInView';
import { PressableScale } from '../components/PressableScale';
import { BottomSheet } from '../components/BottomSheet';
import { MetricPill } from '../components/MetricPill';
import { ProgressBar, Card, Icon } from '../design-system';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { MentionLegale } from '../components/MentionLegale';
import { getActivityLabel } from '../mapping';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { formatMontant } from '../utils/format';
import { hapticImpact } from '../utils/haptics';

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
  const { result, form } = useCalculatorContext();

  useEffect(() => {
    if (result) {
      void hapticImpact();
    }
  }, [result]);

  if (!result) return null;

  const netMensuel = result.revenuNetDisponible / 12;
  const tauxPrelevement = result.tauxPrelevementGlobal * 100;
  const estimationLabel = form.label.trim() || getActivityLabel(form.activity);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Icon name="cash" size={18} color={colors.background} />
          </View>
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
              <Icon name="time" size={22} color={colors.ink} />
            </View>
          </PressableScale>
          <PressableScale
            onPress={onOpenSettings}
            scale={0.9}
            accessibilityRole="button"
            accessibilityLabel="Paramètres fiscaux"
          >
            <View style={styles.iconButton}>
              <Icon name="settings" size={22} color={colors.ink} />
            </View>
          </PressableScale>
        </View>
      </View>

      <View style={styles.main} pointerEvents="box-none">
        <FadeInView delay={0}>
          <Card variant="glass" style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroLabel}>{estimationLabel}</Text>
              <Text style={styles.heroCa}>CA {formatMontant(result.caAnnuelHT)}</Text>
            </View>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>€</Text>
              <AnimatedCounter
                value={result.revenuNetDisponible}
                style={styles.heroAmount}
                formatter={(v) => Math.round(v).toLocaleString('fr-FR')}
              />
            </View>
            <Text style={styles.heroMonthly}>soit {formatMontant(netMensuel)} / mois</Text>

            <View style={styles.progressContainer}>
              <ProgressBar
                segments={[
                  { ratio: result.totalPrelevementsSociaux / result.caAnnuelHT, color: colors.secondary },
                  { ratio: result.impotRetenu / result.caAnnuelHT, color: colors.alert },
                  { ratio: result.revenuNetDisponible / result.caAnnuelHT, color: colors.success },
                ]}
                height={10}
              />
            </View>

            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>
                Sur 100 € : {formatMontant(result.resteSurCent)}
              </Text>
              <Text style={styles.heroFooterText}>
                Prélèvements : {tauxPrelevement.toFixed(1)} %
              </Text>
            </View>
          </Card>
        </FadeInView>

        <FadeInView delay={100}>
          <View style={styles.pillsRow}>
            <MetricPill
              label="Cotisations"
              value={formatMontant(result.totalPrelevementsSociaux)}
              variant="secondary"
            />
            <MetricPill
              label="Impôt"
              value={formatMontant(result.impotRetenu)}
              variant="alert"
            />
            <MetricPill
              label="Sur 100 €"
              value={formatMontant(result.resteSurCent)}
              variant="success"
            />
          </View>
        </FadeInView>
      </View>

      <BottomSheet collapsedHeight={220} expandedHeight={620}>
        <FadeInView delay={150}>
          <Comparaison result={result} />
        </FadeInView>

        <FadeInView delay={250}>
          <Alertes result={result} />
        </FadeInView>

        <FadeInView delay={300}>
          <Card style={styles.hypothesesCard}>
            <View style={styles.hypothesesHeader}>
              <Icon name="informationCircle" size={18} color={colors.inkTertiary} />
              <Text style={styles.hypothesesTitle}>Hypothèses</Text>
            </View>
            <Text style={styles.hypothesesText}>
              Micro-entreprise · France métropolitaine · barèmes 2026. Professions réglementées (Cipav) non couvertes. CFE non incluse.
            </Text>
          </Card>
        </FadeInView>

        <FadeInView delay={400}>
          <View style={styles.actionsContainer}>
            <PressableScale onPress={onOpenDetail} scale={0.97} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="statsChart" size={22} color={colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Voir le détail</Text>
                <Text style={styles.actionDescription}>Décompte complet poste par poste</Text>
              </View>
              <Icon name="arrowForward" size={18} color={colors.inkTertiary} />
            </PressableScale>

            <PressableScale onPress={onOpenInverse} scale={0.97} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="swapHorizontal" size={22} color={colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Objectif de revenu</Text>
                <Text style={styles.actionDescription}>Combien facturer pour gagner X € ?</Text>
              </View>
              <Icon name="arrowForward" size={18} color={colors.inkTertiary} />
            </PressableScale>
          </View>
        </FadeInView>

        <FadeInView delay={450}>
          <PressableScale onPress={onReset} scale={0.97}>
            <Text style={styles.resetText}>Nouvelle simulation</Text>
          </PressableScale>
        </FadeInView>

        <MentionLegale />
      </BottomSheet>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
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
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  main: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  heroCard: {
    ...shadows.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroLabel: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  heroCa: {
    ...typography.caption,
    color: colors.inkTertiary,
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
    marginTop: spacing.lg,
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
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  hypothesesCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceElevated,
  },
  hypothesesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hypothesesTitle: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginLeft: spacing.xs,
  },
  hypothesesText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
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
