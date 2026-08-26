import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { FadeInView } from '../components/FadeInView';
import { PressableScale } from '../components/PressableScale';
import { MetricPill } from '../components/MetricPill';
import { Button, Card, Icon, ProgressBar } from '../design-system';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { getActivityLabel } from '../mapping';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { PremiumIntroSource, trackEvent } from '../utils/analytics';
import { formatMontant } from '../utils/format';
import { hapticImpact } from '../utils/haptics';

interface ResultScreenProps {
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenInverse: () => void;
  onOpenDetail: () => void;
  onOpenPilotage?: (source: PremiumIntroSource) => void;
}

interface SummaryCardProps {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
}

function SummaryCard({ label, value, tone = 'default' }: SummaryCardProps) {
  return (
    <View style={[styles.summaryCard, tone === 'accent' && styles.summaryCardAccent]}>
      <Text style={[styles.summaryLabel, tone === 'accent' && styles.summaryLabelAccent]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, tone === 'accent' && styles.summaryValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

export function ResultScreen({
  onReset,
  onOpenSettings,
  onOpenHistory,
  onOpenInverse,
  onOpenDetail,
  onOpenPilotage,
}: ResultScreenProps) {
  const { result, form } = useCalculatorContext();
  const trackedResultRef = useRef<string | null>(null);

  useEffect(() => {
    if (result) {
      void hapticImpact();
    }
  }, [result]);

  useEffect(() => {
    if (!result) {
      return;
    }

    const nextKey = [
      result.caAnnuelHT,
      result.revenuNetDisponible,
      result.impotRetenu,
      result.totalPrelevementsSociaux,
    ].join(':');

    if (trackedResultRef.current === nextKey) {
      return;
    }

    trackedResultRef.current = nextKey;
    void trackEvent('result_viewed');
  }, [result]);

  if (!result) return null;

  const netMensuel = result.revenuNetDisponible / 12;
  const tauxPrelevement = result.tauxPrelevementGlobal * 100;
  const estimationLabel = form.label.trim() || getActivityLabel(form.activity);
  const scenarioLabel =
    result.estEligibleVL === null
      ? 'Comparaison d’impôt disponible avec votre RFR N-2'
      : result.scenarioLePlusFavorable === 'VL'
        ? 'Versement libératoire retenu'
        : 'Barème progressif retenu';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.activityBlock}>
          <Text style={styles.eyebrow}>Résultat estimé</Text>
          <Text style={styles.activityLabel}>{estimationLabel}</Text>
          <Text style={styles.activityCa}>CA {formatMontant(result.caAnnuelHT)}</Text>
        </View>
        <View style={styles.headerActions}>
          <PressableScale
            onPress={onReset}
            scale={0.88}
            accessibilityRole="button"
            accessibilityLabel="Accueil"
          >
            <View style={styles.iconButton}>
              <Icon name="home" size={20} color={colors.inkSecondary} />
            </View>
          </PressableScale>
          <PressableScale
            onPress={onOpenHistory}
            scale={0.88}
            accessibilityRole="button"
            accessibilityLabel="Historique"
          >
            <View style={styles.iconButton}>
              <Icon name="time" size={20} color={colors.inkSecondary} />
            </View>
          </PressableScale>
          <PressableScale
            onPress={onOpenSettings}
            scale={0.88}
            accessibilityRole="button"
            accessibilityLabel="Paramètres fiscaux"
          >
            <View style={styles.iconButton}>
              <Icon name="settings" size={20} color={colors.inkSecondary} />
            </View>
          </PressableScale>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={0}>
          <Card variant="accent" style={styles.heroCard}>
            <Text style={styles.heroLabel}>Ce qu’il vous reste vraiment par mois</Text>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>€</Text>
              <AnimatedCounter
                value={netMensuel}
                style={styles.heroAmount}
                formatter={(value) => Math.round(value).toLocaleString('fr-FR')}
              />
            </View>
            <Text style={styles.heroCaption}>
              après cotisations, impôt et charges fixes
            </Text>

            <View style={styles.progressContainer}>
              <ProgressBar
                segments={[
                  {
                    ratio: result.totalPrelevementsSociaux / result.caAnnuelHT,
                    color: '#F43F5E',
                  },
                  { ratio: result.impotRetenu / result.caAnnuelHT, color: '#8B5CF6' },
                  {
                    ratio: result.revenuNetDisponible / result.caAnnuelHT,
                    color: colors.primary,
                  },
                ]}
                height={10}
              />
            </View>

            <View style={styles.heroFooter}>
              <View style={styles.heroFooterItem}>
                <Text style={styles.heroFooterLabel}>Vous gardez</Text>
                <Text style={styles.heroFooterValue}>{formatMontant(result.resteSurCent)} / 100 €</Text>
              </View>
              <View style={styles.heroFooterItem}>
                <Text style={styles.heroFooterLabel}>Prélèvements</Text>
                <Text style={styles.heroFooterValue}>{tauxPrelevement.toFixed(1)} %</Text>
              </View>
            </View>
          </Card>
        </FadeInView>

        <FadeInView delay={100}>
          <View style={styles.summaryGrid}>
            <SummaryCard label="Net annuel estimé" value={formatMontant(result.revenuNetDisponible)} />
            <SummaryCard label="Impôt retenu" value={formatMontant(result.impotRetenu)} />
            <SummaryCard
              label="Cotisations + CFP"
              value={formatMontant(result.totalPrelevementsSociaux)}
            />
            <SummaryCard label="Option fiscale" value={scenarioLabel} tone="accent" />
          </View>
        </FadeInView>

        <FadeInView delay={150}>
          <View style={styles.pillsRow}>
            <MetricPill label="Mensuel" value={formatMontant(netMensuel)} variant="success" />
            <MetricPill label="Annuel" value={formatMontant(result.revenuNetDisponible)} variant="secondary" />
            <MetricPill label="Sur 100 €" value={formatMontant(result.resteSurCent)} variant="alert" />
          </View>
        </FadeInView>

        <FadeInView delay={220}>
          <Card style={styles.pilotageCard}>
            <View style={styles.pilotageHeader}>
              <View style={styles.pilotageCopy}>
                <Text style={styles.pilotageTitle}>Pilotage</Text>
                <Text style={styles.pilotageText}>
                  Suivez ce que vous avez encaissé, ce qu’il faut réserver, et ce
                  que vous pouvez réellement garder.
                </Text>
              </View>
              <View style={styles.pilotageBadge}>
                <Icon name="statsChart" size={18} color={colors.primary} />
              </View>
            </View>
            {onOpenPilotage ? (
              <Button
                label="Ouvrir Pilotage"
                onPress={() => onOpenPilotage('monthly_tracking')}
                variant="primary"
                size="md"
              />
            ) : null}
          </Card>
        </FadeInView>

        <FadeInView delay={260}>
          <Comparaison result={result} />
        </FadeInView>

        <FadeInView delay={320}>
          <Alertes result={result} />
        </FadeInView>

        <FadeInView delay={360}>
          <Card style={styles.actionsIntroCard}>
            <Text style={styles.actionsIntroTitle}>Approfondir si besoin</Text>
            <Text style={styles.actionsIntroText}>
              Le résultat principal reste au-dessus. Les actions ci-dessous servent
              seulement à détailler ou préparer la suite.
            </Text>
          </Card>
        </FadeInView>

        <FadeInView delay={420}>
          <View style={styles.actionsContainer}>
            <PressableScale onPress={onOpenDetail} scale={0.97} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="statsChart" size={22} color={colors.primary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Voir le détail</Text>
                <Text style={styles.actionDescription}>Décompte poste par poste</Text>
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

        <FadeInView delay={460}>
          <Card style={styles.hypothesesCard}>
            <View style={styles.hypothesesHeader}>
              <Icon name="informationCircle" size={18} color={colors.inkTertiary} />
              <Text style={styles.hypothesesTitle}>Hypothèses</Text>
            </View>
            <Text style={styles.hypothesesText}>
              Micro-entreprise, France métropolitaine, barèmes 2026. Professions
              réglementées Cipav non couvertes. CFE non incluse.
            </Text>
          </Card>
        </FadeInView>

        <FadeInView delay={520}>
          <PressableScale onPress={onReset} scale={0.97}>
            <Text style={styles.resetText}>Nouvelle simulation</Text>
          </PressableScale>
        </FadeInView>
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
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  activityBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  activityLabel: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  activityCa: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginTop: spacing.xxs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  heroCard: {
    ...shadows.primaryGlow,
    paddingVertical: spacing.md,
  },
  heroLabel: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  heroCurrency: {
    ...typography.h2,
    color: colors.surface,
    marginRight: spacing.xs,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  heroAmount: {
    ...typography.display,
    color: colors.surface,
  },
  heroCaption: {
    ...typography.bodySmall,
    color: colors.surface,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroFooterItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  heroFooterLabel: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.85,
    marginBottom: spacing.xxs,
  },
  heroFooterValue: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginTop: spacing.sm,
  },
  summaryCard: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  summaryCardAccent: {
    width: '100%',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginBottom: spacing.xxs,
  },
  summaryLabelAccent: {
    color: colors.primary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 72,
  },
  summaryValueAccent: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    color: colors.primaryDark,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  pilotageCard: {
    marginBottom: spacing.lg,
  },
  pilotageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  pilotageCopy: {
    flex: 1,
  },
  pilotageTitle: {
    ...typography.h2,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  pilotageText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 18,
  },
  pilotageBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsIntroCard: {
    marginBottom: spacing.lg,
  },
  actionsIntroTitle: {
    ...typography.h3,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  actionsIntroText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 20,
  },
  hypothesesCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
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
    lineHeight: 18,
  },
  actionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
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
    fontWeight: '700',
  },
});
