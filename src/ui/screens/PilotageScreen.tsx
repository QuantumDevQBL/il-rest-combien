import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  buildPilotageSummary,
  buildProjection,
  Month,
  MonthlyRevenueEntry,
  PilotageAlert,
} from '../../domain/pilotage';
import {
  deleteMonthlyRevenueEntry,
  listMonthlyRevenueEntries,
  upsertMonthlyRevenueEntry,
} from '../../storage/pilotageStorage';
import { EmptyState, Button, Card, Icon } from '../design-system';
import { ModalContainer } from '../components/ModalContainer';
import { Input } from '../components/Input';
import { PressableScale } from '../components/PressableScale';
import { useCalculatorContext } from '../context/CalculatorContext';
import { getActivityConfig } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { trackEvent } from '../utils/analytics';
import { calculateProjectedResult } from '../utils/calculatorInputs';
import { formatMontant, parseMontantSaisi } from '../utils/format';

const MONTH_LABELS = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Aoû',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
] as const;

interface PilotageScreenProps {
  onOpenSettings: () => void;
}

interface EntryDraft {
  month: Month;
  revenue: string;
  existing?: MonthlyRevenueEntry | null;
}

function SummaryMetric({
  label,
  value,
  featured = false,
  negative = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
  negative?: boolean;
}) {
  return (
    <Card variant={featured ? 'accent' : 'default'} style={styles.metricCard}>
      <Text style={[styles.metricLabel, featured && styles.metricLabelFeatured]}>{label}</Text>
      <Text
        style={[
          styles.metricValue,
          featured && styles.metricValueFeatured,
          negative && styles.metricValueNegative,
        ]}
      >
        {value}
      </Text>
    </Card>
  );
}

function AlertCard({ alert }: { alert: PilotageAlert }) {
  const isWarning = alert.kind === 'projection_provisional';

  return (
    <Card
      style={[
        styles.alertCard,
        isWarning ? styles.alertCardWarning : styles.alertCardDanger,
      ]}
    >
      <View style={styles.alertRow}>
        <Icon
          name={isWarning ? 'informationCircle' : 'warning'}
          size={18}
          color={isWarning ? colors.alert : colors.negative}
        />
        <Text style={styles.alertText}>{alert.message}</Text>
      </View>
    </Card>
  );
}

export function PilotageScreen({ onOpenSettings }: PilotageScreenProps) {
  const { form } = useCalculatorContext();
  const [entries, setEntries] = useState<MonthlyRevenueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState<EntryDraft | null>(null);
  const openedRef = useRef(false);
  const viewedSummaryRef = useRef<string | null>(null);

  const now = new Date();
  const currentMonth = (now.getMonth() + 1) as Month;
  const currentYear = now.getFullYear();

  useEffect(() => {
    if (!openedRef.current) {
      openedRef.current = true;
      void trackEvent('pilotage_opened');
    }

    listMonthlyRevenueEntries()
      .then((storedEntries) => {
        setEntries(storedEntries.filter((entry) => entry.year === currentYear));
      })
      .finally(() => setIsLoading(false));
  }, [currentYear]);

  const projection = useMemo(
    () => buildProjection(entries, currentMonth),
    [entries, currentMonth]
  );
  const projectedAnnualResult = useMemo(
    () => calculateProjectedResult(form, projection?.projectedAnnualRevenue ?? null),
    [form, projection]
  );
  const annualFixedCharges = parseMontantSaisi(form.chargesFixesAnnuelles) ?? 0;
  const activity = getActivityConfig(form.activity).activite;

  const summary = useMemo(
    () =>
      buildPilotageSummary({
        currentMonth,
        currentYear,
        entries,
        annualFixedCharges,
        activity,
        projectedAnnualResult,
      }),
    [activity, annualFixedCharges, currentMonth, currentYear, entries, projectedAnnualResult]
  );

  useEffect(() => {
    if (!summary) {
      return;
    }

    const summaryKey = [
      summary.revenueYtd,
      summary.totalReserve,
      summary.estimatedAvailable,
      summary.projectedAnnualRevenue,
    ].join(':');

    if (viewedSummaryRef.current === summaryKey) {
      return;
    }

    viewedSummaryRef.current = summaryKey;
    void trackEvent('pilotage_summary_viewed');
    void trackEvent('projection_viewed');
  }, [summary]);

  const availableMonths = useMemo(() => {
    const usedMonths = new Set(entries.map((entry) => entry.month));

    return Array.from({ length: currentMonth }, (_, index) => (index + 1) as Month).filter(
      (month) => !usedMonths.has(month)
    );
  }, [currentMonth, entries]);

  const openCreateModal = () => {
    const fallbackMonth = availableMonths[availableMonths.length - 1];
    if (!fallbackMonth) {
      return;
    }

    setDraft({
      month: fallbackMonth,
      revenue: '',
      existing: null,
    });
  };

  const openEditModal = (entry: MonthlyRevenueEntry) => {
    setDraft({
      month: entry.month,
      revenue: String(entry.revenue),
      existing: entry,
    });
  };

  const closeDraft = () => setDraft(null);

  const saveDraft = async () => {
    if (!draft) {
      return;
    }

    const revenue = parseMontantSaisi(draft.revenue);
    if (revenue === null) {
      return;
    }

    const nextEntries = await upsertMonthlyRevenueEntry({
      year: currentYear,
      month: draft.month,
      revenue,
    });

    setEntries(nextEntries.filter((entry) => entry.year === currentYear));
    await trackEvent(
      draft.existing ? 'monthly_revenue_entry_updated' : 'monthly_revenue_entry_created'
    );
    closeDraft();
  };

  const deleteEntry = async (entry: MonthlyRevenueEntry) => {
    const nextEntries = await deleteMonthlyRevenueEntry(entry.year, entry.month);
    setEntries(nextEntries.filter((item) => item.year === currentYear));
    await trackEvent('monthly_revenue_entry_deleted');
  };

  const sortedEntries = [...entries].sort((left, right) => right.month - left.month);
  const draftRevenue = draft ? parseMontantSaisi(draft.revenue) : null;
  const canSaveDraft = draft !== null && draftRevenue !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Pilotage</Text>
          <Text style={styles.title}>Ce que vous pouvez réellement garder</Text>
        </View>
        <PressableScale onPress={onOpenSettings} scale={0.9} accessibilityLabel="Paramètres">
          <View style={styles.iconButton}>
            <Icon name="settings" size={20} color={colors.inkSecondary} />
          </View>
        </PressableScale>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Card>
            <Text style={styles.loadingText}>Chargement du pilotage…</Text>
          </Card>
        ) : null}

        {!isLoading && entries.length === 0 ? (
          <Card>
            <EmptyState
              iconName="stats-chart"
              title="Commencez votre suivi mensuel"
              description="Ajoutez votre premier mois encaissé pour voir ce qu’il faut réserver et ce qui reste disponible."
            />
            <Button label="Ajouter un mois" onPress={openCreateModal} />
          </Card>
        ) : null}

        {!isLoading && summary ? (
          <>
            <View style={styles.metricStack}>
              <SummaryMetric
                label="Disponible estimé"
                value={formatMontant(summary.estimatedAvailable)}
                featured
                negative={summary.estimatedAvailable < 0}
              />
              <View style={styles.metricRow}>
                <SummaryMetric label="Encaissé" value={formatMontant(summary.revenueYtd)} />
                <SummaryMetric label="À réserver" value={formatMontant(summary.totalReserve)} />
              </View>
            </View>

            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Projection annuelle</Text>
                {summary.projectionIsProvisional ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Indicative</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>CA annuel projeté</Text>
                <Text style={styles.summaryLineValue}>
                  {formatMontant(summary.projectedAnnualRevenue)}
                </Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Net annuel projeté</Text>
                <Text style={styles.summaryLineValue}>
                  {formatMontant(summary.projectedAnnualNet)}
                </Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Net mensuel projeté</Text>
                <Text style={styles.summaryLineValue}>
                  {formatMontant(summary.projectedMonthlyNet)}
                </Text>
              </View>
              {summary.projectionIsProvisional ? (
                <Text style={styles.helperText}>
                  Projection indicative basée sur votre mois en cours.
                </Text>
              ) : null}
            </Card>

            {summary.alerts.length > 0 ? (
              <View style={styles.alertsSection}>
                <Text style={styles.sectionTitle}>Alertes</Text>
                <View style={styles.alertsStack}>
                  {summary.alerts.map((alert) => (
                    <AlertCard key={`${alert.kind}-${alert.message}`} alert={alert} />
                  ))}
                </View>
              </View>
            ) : null}

            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Historique mensuel</Text>
                <Button label="Ajouter" onPress={openCreateModal} size="md" />
              </View>
              <View style={styles.historyStack}>
                {sortedEntries.map((entry) => (
                  <View key={`${entry.year}-${entry.month}`} style={styles.historyItem}>
                    <View>
                      <Text style={styles.historyMonth}>
                        {MONTH_LABELS[entry.month - 1]} {entry.year}
                      </Text>
                      <Text style={styles.historyRevenue}>{formatMontant(entry.revenue)}</Text>
                    </View>
                    <View style={styles.historyActions}>
                      <PressableScale
                        onPress={() => openEditModal(entry)}
                        scale={0.96}
                        accessibilityLabel={`Modifier ${MONTH_LABELS[entry.month - 1]}`}
                      >
                        <Text style={styles.linkText}>Modifier</Text>
                      </PressableScale>
                      <PressableScale
                        onPress={() => void deleteEntry(entry)}
                        scale={0.96}
                        accessibilityLabel={`Supprimer ${MONTH_LABELS[entry.month - 1]}`}
                      >
                        <Text style={styles.deleteText}>Supprimer</Text>
                      </PressableScale>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </>
        ) : null}
      </ScrollView>

      {draft ? (
        <ModalContainer
          title={draft.existing ? 'Modifier un mois' : 'Ajouter un mois'}
          onClose={closeDraft}
        >
          {!draft.existing ? (
            <View style={styles.monthPicker}>
              {availableMonths.map((month) => (
                <PressableScale
                  key={month}
                  onPress={() =>
                    setDraft((current) => (current ? { ...current, month } : current))
                  }
                  scale={0.98}
                  style={styles.monthPickerItem}
                >
                  <View
                    style={[
                      styles.monthPill,
                      draft.month === month && styles.monthPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthPillText,
                        draft.month === month && styles.monthPillTextSelected,
                      ]}
                    >
                      {MONTH_LABELS[month - 1]}
                    </Text>
                  </View>
                </PressableScale>
              ))}
            </View>
          ) : (
            <Card variant="filled" style={styles.lockedMonthCard}>
              <Text style={styles.lockedMonthText}>
                {MONTH_LABELS[draft.month - 1]} {currentYear}
              </Text>
            </Card>
          )}

          <Input
            label="CA encaissé"
            value={draft.revenue}
            onChangeText={(value) =>
              setDraft((current) => (current ? { ...current, revenue: value } : current))
            }
            placeholder="0"
            suffix="€"
          />

          <View style={styles.modalActions}>
            <Button label="Annuler" onPress={closeDraft} variant="secondary" />
            <Button
              label="Enregistrer"
              onPress={() => void saveDraft()}
              disabled={!canSaveDraft}
            />
          </View>
        </ModalContainer>
      ) : null}
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
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
    maxWidth: 280,
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
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  loadingText: {
    ...typography.body,
    color: colors.inkSecondary,
    textAlign: 'center',
  },
  metricStack: {
    gap: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginBottom: spacing.xs,
  },
  metricLabelFeatured: {
    color: colors.surface,
    opacity: 0.88,
  },
  metricValue: {
    ...typography.h1,
    color: colors.ink,
  },
  metricValueFeatured: {
    ...typography.displaySmall,
    color: colors.surface,
  },
  metricValueNegative: {
    color: colors.negative,
  },
  sectionCard: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.ink,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    backgroundColor: colors.alertLight,
  },
  badgeText: {
    ...typography.caption,
    color: colors.alert,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryLineLabel: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  summaryLineValue: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.alert,
    marginTop: spacing.xs,
  },
  alertsSection: {
    gap: spacing.sm,
  },
  alertsStack: {
    gap: spacing.sm,
  },
  alertCard: {
    paddingVertical: spacing.sm,
  },
  alertCardWarning: {
    backgroundColor: colors.alertLight,
    borderColor: colors.alert,
  },
  alertCardDanger: {
    backgroundColor: colors.negativeLight,
    borderColor: colors.negative,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  alertText: {
    ...typography.bodySmall,
    color: colors.ink,
    flex: 1,
  },
  historyStack: {
    gap: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  historyMonth: {
    ...typography.body,
    color: colors.ink,
  },
  historyRevenue: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    marginTop: spacing.xxs,
  },
  historyActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  deleteText: {
    ...typography.bodySmall,
    color: colors.negative,
    fontWeight: '700',
  },
  monthPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  monthPickerItem: {
    width: '22%',
  },
  monthPill: {
    minHeight: 42,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthPillText: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '700',
  },
  monthPillTextSelected: {
    color: colors.surface,
  },
  lockedMonthCard: {
    marginBottom: spacing.md,
  },
  lockedMonthText: {
    ...typography.body,
    color: colors.ink,
    textAlign: 'center',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
