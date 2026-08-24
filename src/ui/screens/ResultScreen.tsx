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

interface ProgressRowProps {
  label: string;
  value: string;
  ratio: number;
  color: string;
}

function ProgressRow({ label, value, ratio, color }: ProgressRowProps) {
  const safeRatio = Math.max(0, Math.min(1, ratio));
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressRowHeader}>
        <Text style={styles.progressRowLabel}>{label}</Text>
        <Text style={styles.progressRowValue}>{value}</Text>
      </View>
      <View style={styles.progressRowTrack}>
        <View style={[styles.progressRowFill, { width: `${safeRatio * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
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

  const rows: ProgressRowProps[] = [
    {
      label: 'Chiffre d\'affaires',
      value: formatMontant(result.caAnnuelHT),
      ratio: 1,
      color: colors.ink,
    },
    {
      label: 'Cotisations sociales',
      value: `−${formatMontant(result.cotisationsSociales)}`,
      ratio: result.cotisationsSociales / result.caAnnuelHT,
      color: '#F43F5E',
    },
    {
      label: 'Formation professionnelle',
      value: `−${formatMontant(result.cfp)}`,
      ratio: result.cfp / result.caAnnuelHT,
      color: '#F59E0B',
    },
    {
      label: 'Impôt provisionné',
      value: `−${formatMontant(result.impotRetenu)}`,
      ratio: result.impotRetenu / result.caAnnuelHT,
      color: '#8B5CF6',
    },
    {
      label: 'Reste à vivre',
      value: formatMontant(result.revenuNetDisponible),
      ratio: result.revenuNetDisponible / result.caAnnuelHT,
      color: colors.primary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.activityBlock}>
          <Text style={styles.activityLabel}>{estimationLabel}</Text>
          <Text style={styles.activityCa}>CA {formatMontant(result.caAnnuelHT)}</Text>
        </View>
        <View style={styles.headerActions}>
          <PressableScale
            onPress={onOpenHistory}
            scale={0.9}
            accessibilityRole="button"
            accessibilityLabel="Historique"
          >
            <View style={styles.iconButton}>
              <Icon name="time" size={22} color={colors.inkSecondary} />
            </View>
          </PressableScale>
          <PressableScale
            onPress={onOpenSettings}
            scale={0.9}
            accessibilityRole="button"
            accessibilityLabel="Paramètres fiscaux"
          >
            <View style={styles.iconButton}>
              <Icon name="settings" size={22} color={colors.inkSecondary} />
            </View>
          </PressableScale>
        </View>
      </View>

      <View style={styles.main} pointerEvents="box-none">
        <FadeInView delay={0}>
          <Card variant="accent" style={styles.heroCard}>
            <Text style={styles.heroLabel}>Reste à vivre ce mois-ci</Text>
            <View style={styles.heroAmountRow}>
              <Text style={styles.heroCurrency}>€</Text>
              <AnimatedCounter
                value={netMensuel}
                style={styles.heroAmount}
                formatter={(v) => Math.round(v).toLocaleString('fr-FR')}
              />
            </View>
            <View style={styles.heroTrend}>
              <Icon name="trendingUp" size={14} color={colors.surface} />
              <Text style={styles.heroTrendText}>
                soit {formatMontant(result.revenuNetDisponible)} / an
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <ProgressBar
                segments={[
                  { ratio: result.totalPrelevementsSociaux / result.caAnnuelHT, color: '#F43F5E' },
                  { ratio: result.impotRetenu / result.caAnnuelHT, color: '#8B5CF6' },
                  { ratio: result.revenuNetDisponible / result.caAnnuelHT, color: colors.primary },
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
          <View style={styles.rowsCard}>
            {rows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={150}>
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
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  activityBlock: {
    flex: 1,
    marginRight: spacing.sm,
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
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
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
    ...shadows.primaryGlow,
  },
  heroLabel: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.9,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  heroCurrency: {
    ...typography.h2,
    color: colors.surface,
    marginRight: spacing.xs,
    marginTop: spacing.sm,
    opacity: 0.9,
  },
  heroAmount: {
    ...typography.display,
    color: colors.surface,
  },
  heroTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  heroTrendText: {
    ...typography.bodySmall,
    color: colors.surface,
    opacity: 0.9,
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
    color: colors.surface,
    opacity: 0.8,
  },
  rowsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  progressRow: {
    marginBottom: spacing.sm,
  },
  progressRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  progressRowLabel: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  progressRowValue: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '800',
  },
  progressRowTrack: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
  },
  progressRowFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
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
    lineHeight: 20,
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
  },
});
