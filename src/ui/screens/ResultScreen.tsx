import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alertes } from '../components/Alertes';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Comparaison } from '../components/Comparaison';
import { FadeInView } from '../components/FadeInView';
import { PressableScale } from '../components/PressableScale';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Button, Card, Icon, ProgressBar } from '../design-system';
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

type ResultTabKey = 'summary' | 'details' | 'alerts';

function SummaryMetric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
}) {
  return (
    <View style={[styles.summaryMetric, tone === 'accent' && styles.summaryMetricAccent]}>
      <Text style={[styles.summaryMetricLabel, tone === 'accent' && styles.summaryMetricLabelAccent]}>
        {label}
      </Text>
      <Text style={[styles.summaryMetricValue, tone === 'accent' && styles.summaryMetricValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.miniMetric}>
      <Text style={styles.miniMetricLabel}>{label}</Text>
      <Text style={styles.miniMetricValue}>{value}</Text>
    </View>
  );
}

function CompactRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <View style={styles.compactRow}>
      <Text style={styles.compactRowLabel}>{label}</Text>
      <Text style={[styles.compactRowValue, emphasize && styles.compactRowValueAccent]}>{value}</Text>
    </View>
  );
}

function ShortcutCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: 'statsChart' | 'swapHorizontal';
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scale={0.97} style={styles.shortcutCard}>
      <View style={styles.shortcutIcon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.shortcutCopy}>
        <Text style={styles.shortcutTitle}>{title}</Text>
        <Text style={styles.shortcutDescription}>{description}</Text>
      </View>
      <Icon name="arrowForward" size={18} color={colors.inkTertiary} />
    </PressableScale>
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
  const [activeTab, setActiveTab] = useState<ResultTabKey>('summary');

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

  if (!result) {
    return null;
  }

  const netMensuel = result.revenuNetDisponible / 12;
  const tauxPrelevement = result.tauxPrelevementGlobal * 100;
  const estimationLabel = form.label.trim() || getActivityLabel(form.activity);
  const scenarioLabel =
    result.estEligibleVL === null
      ? 'Comparer avec votre RFR N-2'
      : result.scenarioLePlusFavorable === 'VL'
        ? 'Versement liberatoire retenu'
        : 'Bareme progressif retenu';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.activityBlock}>
          <Text style={styles.eyebrow}>Resultat estime</Text>
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
            accessibilityLabel="Parametres fiscaux"
          >
            <View style={styles.iconButton}>
              <Icon name="settings" size={20} color={colors.inkSecondary} />
            </View>
          </PressableScale>
        </View>
      </View>

      <View style={styles.tabsWrap}>
        <SegmentedTabs
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { key: 'summary', label: 'Resume' },
            { key: 'details', label: 'Detail' },
            { key: 'alerts', label: 'Alertes' },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={0}>
          <Card variant="accent" style={styles.heroCard}>
            <Text style={styles.heroLabel}>Ce qu'il vous reste vraiment par mois</Text>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>EUR</Text>
              <AnimatedCounter
                value={netMensuel}
                style={styles.heroAmount}
                formatter={(value) => Math.round(value).toLocaleString('fr-FR')}
              />
            </View>
            <Text style={styles.heroCaption}>apres cotisations, impot et charges fixes</Text>

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
          </Card>
        </FadeInView>

        {activeTab === 'summary' ? (
          <>
            <FadeInView delay={80}>
              <Card style={styles.summaryCard}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionEyebrow}>Lecture rapide</Text>
                    <Text style={styles.sectionTitle}>L'essentiel de votre simulation</Text>
                  </View>
                </View>

                <SummaryMetric label="Mensuel" value={formatMontant(netMensuel)} tone="accent" />

                <View style={styles.miniMetricRow}>
                  <MiniMetric label="Net annuel" value={formatMontant(result.revenuNetDisponible)} />
                  <MiniMetric
                    label="Cotisations + CFP"
                    value={formatMontant(result.totalPrelevementsSociaux)}
                  />
                </View>

                <View style={styles.miniMetricRow}>
                  <MiniMetric
                    label="Vous gardez"
                    value={`${formatMontant(result.resteSurCent)} / 100 EUR`}
                  />
                  <MiniMetric
                    label="Prelevements"
                    value={`${tauxPrelevement.toFixed(1)} %`}
                  />
                </View>
              </Card>
            </FadeInView>

            <FadeInView delay={120}>
              <Card style={styles.pilotageCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.pilotageCopy}>
                    <Text style={styles.sectionEyebrow}>Pilotage</Text>
                    <Text style={styles.sectionTitle}>Pilotez ce que vous pouvez vraiment garder</Text>
                    <Text style={styles.pilotageText}>
                      Un espace dedie pour suivre votre CA, vos reserves et votre disponible estime.
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
          </>
        ) : null}

        {activeTab === 'details' ? (
          <>
            <FadeInView delay={80}>
              <Card style={styles.summaryCard}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionEyebrow}>Detail</Text>
                    <Text style={styles.sectionTitle}>Decompte de votre resultat</Text>
                  </View>
                </View>

                <View style={styles.compactGroup}>
                  <CompactRow label="Impot retenu" value={formatMontant(result.impotRetenu)} />
                  <CompactRow
                    label="Prelevements globaux"
                    value={`${tauxPrelevement.toFixed(1)} %`}
                    emphasize
                  />
                  <CompactRow label="Option fiscale" value={scenarioLabel} />
                </View>
              </Card>
            </FadeInView>

            <FadeInView delay={120}>
              <Card style={styles.toolsCard}>
                <Text style={styles.sectionEyebrow}>Approfondir</Text>
                <Text style={styles.sectionTitle}>Aller plus loin si besoin</Text>
                <View style={styles.shortcutsStack}>
                  <ShortcutCard
                    icon="statsChart"
                    title="Voir le detail"
                    description="Decompte poste par poste"
                    onPress={onOpenDetail}
                  />
                  <ShortcutCard
                    icon="swapHorizontal"
                    title="Objectif de revenu"
                    description="Combien facturer pour gagner X EUR ?"
                    onPress={onOpenInverse}
                  />
                </View>
              </Card>
            </FadeInView>

            <FadeInView delay={160}>
              <Card style={styles.hypothesesCard}>
                <View style={styles.hypothesesHeader}>
                  <Icon name="informationCircle" size={18} color={colors.inkTertiary} />
                  <Text style={styles.hypothesesTitle}>Hypotheses</Text>
                </View>
                <Text style={styles.hypothesesText}>
                  Micro-entreprise, France metropolitaine, baremes 2026. Professions
                  reglementees Cipav non couvertes. CFE non incluse.
                </Text>
              </Card>
            </FadeInView>
          </>
        ) : null}

        {activeTab === 'alerts' ? (
          <>
            <FadeInView delay={80}>
              <Alertes result={result} />
            </FadeInView>

            <FadeInView delay={120}>
              <Comparaison result={result} />
            </FadeInView>
          </>
        ) : null}
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
    paddingBottom: spacing.xs,
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
  tabsWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  heroCurrency: {
    ...typography.h3,
    color: colors.surface,
    opacity: 0.92,
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  sectionEyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.ink,
  },
  summaryCard: {
    gap: spacing.md,
  },
  summaryMetric: {
    minHeight: 88,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  summaryMetricAccent: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  summaryMetricLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  summaryMetricLabelAccent: {
    color: colors.primaryDark,
  },
  summaryMetricValue: {
    ...typography.h2,
    color: colors.ink,
    fontWeight: '800',
  },
  summaryMetricValueAccent: {
    color: colors.primaryDark,
  },
  miniMetricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  miniMetric: {
    flex: 1,
    minHeight: 76,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'space-between',
  },
  miniMetricLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  miniMetricValue: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '800',
  },
  compactGroup: {
    gap: spacing.xs,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  compactRowLabel: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    flex: 1,
  },
  compactRowValue: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    textAlign: 'right',
    flexShrink: 1,
  },
  compactRowValueAccent: {
    color: colors.primary,
  },
  pilotageCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
    gap: spacing.md,
  },
  pilotageCopy: {
    flex: 1,
  },
  pilotageText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  pilotageBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolsCard: {
    gap: spacing.md,
  },
  shortcutsStack: {
    gap: spacing.sm,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.sm + spacing.xxs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortcutIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  shortcutCopy: {
    flex: 1,
  },
  shortcutTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  shortcutDescription: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  hypothesesCard: {
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
});
