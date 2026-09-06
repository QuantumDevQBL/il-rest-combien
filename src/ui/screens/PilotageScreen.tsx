import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DimensionValue, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  buildPilotageSummary,
  buildProjection,
  FixedCharge,
  Month,
  MonthlyRevenueEntry,
  PilotageAlert,
  sumAnnualFixedCharges,
} from '../../domain/pilotage';
import {
  deleteFixedCharge,
  listFixedCharges,
  upsertFixedCharge,
} from '../../storage/fixedChargesStorage';
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
  'Fev',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Aou',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

interface PilotageScreenProps {
  onOpenSettings: () => void;
  onGoToSimulation?: () => void;
}

interface EntryDraft {
  month: Month;
  revenue: string;
  existing?: MonthlyRevenueEntry | null;
}

interface ChargeDraft {
  id?: string;
  label: string;
  monthlyAmount: string;
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

function InlineMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.inlineMetric}>
      <Text style={styles.inlineMetricLabel}>{label}</Text>
      <Text style={styles.inlineMetricValue}>{value}</Text>
    </View>
  );
}

function CompactRow({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  return (
    <View style={styles.compactRow}>
      <Text style={styles.compactRowLabel}>{label}</Text>
      <Text
        style={[
          styles.compactRowValue,
          tone === 'success' && styles.compactRowValueSuccess,
          tone === 'warning' && styles.compactRowValueWarning,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function AlertCard({ alert }: { alert: PilotageAlert }) {
  const isInfo = alert.kind === 'projection_provisional';

  return (
    <Card
      style={[styles.alertCard, isInfo ? styles.alertCardWarning : styles.alertCardDanger]}
    >
      <View style={styles.alertRow}>
        <Icon
          name={isInfo ? 'informationCircle' : 'warning'}
          size={18}
          color={isInfo ? colors.alert : colors.negative}
        />
        <View style={styles.alertCopy}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      </View>
    </Card>
  );
}

export function PilotageScreen({ onOpenSettings, onGoToSimulation }: PilotageScreenProps) {
  const { form, setFormField, caRequis } = useCalculatorContext();
  const [entries, setEntries] = useState<MonthlyRevenueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState<EntryDraft | null>(null);
  const [fixedCharges, setFixedCharges] = useState<FixedCharge[]>([]);
  const [chargeDraft, setChargeDraft] = useState<ChargeDraft | null>(null);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [objectiveDraft, setObjectiveDraft] = useState('');
  const openedRef = useRef(false);
  const viewedSummaryRef = useRef<string | null>(null);
  const viewedObjectiveRef = useRef<string | null>(null);
  const viewedAlertsRef = useRef<string | null>(null);

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

    void listFixedCharges().then(setFixedCharges);
  }, [currentYear]);

  const projection = useMemo(
    () => buildProjection(entries, currentMonth),
    [entries, currentMonth]
  );
  const projectedAnnualResult = useMemo(
    () => calculateProjectedResult(form, projection.projectedAnnualRevenue),
    [form, projection.projectedAnnualRevenue]
  );
  const annualFixedCharges =
    fixedCharges.length > 0
      ? sumAnnualFixedCharges(fixedCharges)
      : parseMontantSaisi(form.chargesFixesAnnuelles) ?? 0;
  const objectiveNetMonthly = parseMontantSaisi(form.objectifNetMensuel);
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
        objectiveNetMonthly,
        requiredAnnualRevenue: caRequis,
      }),
    [
      activity,
      annualFixedCharges,
      caRequis,
      currentMonth,
      currentYear,
      entries,
      objectiveNetMonthly,
      projectedAnnualResult,
    ]
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

  useEffect(() => {
    const objective = summary?.objective;
    if (!objective) {
      return;
    }

    const objectiveKey = [
      objective.objectiveNetMonthly,
      objective.requiredAnnualRevenue,
      objective.projectedAnnualRevenue,
      objective.progressPercent,
      objective.annualRevenueGap,
    ].join(':');

    if (viewedObjectiveRef.current === objectiveKey) {
      return;
    }

    viewedObjectiveRef.current = objectiveKey;
    void trackEvent('pilotage_objective_viewed');
  }, [summary]);

  useEffect(() => {
    if (!summary || summary.alerts.length === 0) {
      return;
    }

    const alertKey = summary.alerts.map((alert) => `${alert.kind}:${alert.severity}`).join('|');
    if (viewedAlertsRef.current === alertKey) {
      return;
    }

    viewedAlertsRef.current = alertKey;
    void trackEvent('alert_prediction_viewed');
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

  const openCreateChargeModal = () => setChargeDraft({ label: '', monthlyAmount: '' });

  const openEditChargeModal = (charge: FixedCharge) => {
    setChargeDraft({
      id: charge.id,
      label: charge.label,
      monthlyAmount: String(charge.monthlyAmount),
    });
  };

  const closeChargeDraft = () => setChargeDraft(null);

  const saveChargeDraft = async () => {
    if (!chargeDraft) {
      return;
    }

    const label = chargeDraft.label.trim();
    const monthlyAmount = parseMontantSaisi(chargeDraft.monthlyAmount);
    if (!label || monthlyAmount === null || monthlyAmount < 0) {
      return;
    }

    const wasEditing = Boolean(chargeDraft.id);
    const nextCharges = await upsertFixedCharge({
      id: chargeDraft.id,
      label,
      monthlyAmount,
    });

    setFixedCharges(nextCharges);
    await trackEvent(wasEditing ? 'fixed_charge_updated' : 'fixed_charge_created');
    closeChargeDraft();
  };

  const deleteCharge = async (charge: FixedCharge) => {
    const nextCharges = await deleteFixedCharge(charge.id);
    setFixedCharges(nextCharges);
    await trackEvent('fixed_charge_deleted');
  };

  const openObjectiveModal = () => {
    setObjectiveDraft(form.objectifNetMensuel);
    setIsObjectiveModalOpen(true);
  };

  const closeObjectiveModal = () => setIsObjectiveModalOpen(false);

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

  const saveObjective = async () => {
    const previousObjective = parseMontantSaisi(form.objectifNetMensuel);
    const nextObjective = parseMontantSaisi(objectiveDraft);

    setFormField('objectifNetMensuel', objectiveDraft);
    setIsObjectiveModalOpen(false);

    if (nextObjective === null || nextObjective <= 0) {
      if (previousObjective !== null && previousObjective > 0) {
        await trackEvent('pilotage_objective_deleted');
      }
      return;
    }

    await trackEvent(
      previousObjective !== null && previousObjective > 0
        ? 'pilotage_objective_updated'
        : 'pilotage_objective_created'
    );
  };

  const deleteObjective = async () => {
    const previousObjective = parseMontantSaisi(form.objectifNetMensuel);
    setFormField('objectifNetMensuel', '');
    setObjectiveDraft('');
    setIsObjectiveModalOpen(false);

    if (previousObjective !== null && previousObjective > 0) {
      await trackEvent('pilotage_objective_deleted');
    }
  };

  const sortedEntries = [...entries].sort((left, right) => right.month - left.month);
  const draftRevenue = draft ? parseMontantSaisi(draft.revenue) : null;
  const canSaveDraft = draft !== null && draftRevenue !== null;
  const chargeDraftAmount = chargeDraft ? parseMontantSaisi(chargeDraft.monthlyAmount) : null;
  const canSaveCharge =
    chargeDraft !== null &&
    chargeDraft.label.trim().length > 0 &&
    chargeDraftAmount !== null &&
    chargeDraftAmount >= 0;
  const objectiveDraftValue = parseMontantSaisi(objectiveDraft);
  const canSaveObjective =
    objectiveDraft.trim().length === 0 || objectiveDraftValue !== null;
  const objective = summary?.objective ?? null;
  const objectiveProgressPercent =
    objective?.progressPercent !== null && objective?.progressPercent !== undefined
      ? Math.round(objective.progressPercent)
      : 0;
  const objectiveProgressBarWidth = `${Math.min(Math.max(objectiveProgressPercent, 0), 100)}%` as DimensionValue;
  const hasEntries = entries.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Pilotage</Text>
          <Text style={styles.title}>Ce que vous pouvez reellement garder</Text>
        </View>
        <View style={styles.headerActions}>
          {onGoToSimulation ? (
            <Button label="Simuler" onPress={onGoToSimulation} variant="secondary" size="md" />
          ) : null}
          <PressableScale onPress={onOpenSettings} scale={0.9} accessibilityLabel="Parametres">
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
        {isLoading ? (
          <Card>
            <Text style={styles.loadingText}>Chargement du pilotage...</Text>
          </Card>
        ) : null}

        {!isLoading && entries.length === 0 ? (
          <Card>
            <EmptyState
              iconName="stats-chart"
              title="Commencez votre suivi mensuel"
              description="Ajoutez votre premier mois encaisse pour voir ce qu'il faut reserver et ce qui reste disponible."
            />
            <Button label="Ajouter un mois" onPress={openCreateModal} />
          </Card>
        ) : null}

        {!isLoading && summary ? (
          <>
            <View style={styles.metricStack}>
              <SummaryMetric
                label="Disponible estime"
                value={formatMontant(summary.estimatedAvailable)}
                featured
                negative={summary.estimatedAvailable < 0}
              />
              <Card style={styles.metricsDetailCard}>
                <View style={styles.metricsDetailRow}>
                  <InlineMetric label="Encaisse" value={formatMontant(summary.revenueYtd)} />
                  <InlineMetric label="A reserver" value={formatMontant(summary.totalReserve)} />
                </View>
              </Card>
            </View>

            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.sectionEyebrow}>Projection</Text>
                  <Text style={styles.sectionTitle}>Projection annuelle</Text>
                </View>
                {summary.projectionIsProvisional ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Indicative</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.compactGroup}>
                <CompactRow
                  label="CA annuel projete"
                  value={formatMontant(summary.projectedAnnualRevenue)}
                />
                <CompactRow
                  label="Net annuel projete"
                  value={formatMontant(summary.projectedAnnualNet)}
                />
                <CompactRow
                  label="Net mensuel projete"
                  value={formatMontant(summary.projectedMonthlyNet)}
                  tone="success"
                />
              </View>
              {summary.projectionIsProvisional ? (
                <Text style={styles.helperText}>
                  Projection indicative basee sur votre mois en cours.
                </Text>
              ) : null}
            </Card>

            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.sectionEyebrow}>Budget</Text>
                  <Text style={styles.sectionTitle}>Charges fixes recurrentes</Text>
                </View>
                <Button label="Ajouter" onPress={openCreateChargeModal} size="md" />
              </View>

              {fixedCharges.length === 0 ? (
                <Text style={styles.bodyText}>
                  Ajoutez vos charges recurrentes (loyer, assurance, abonnements...) pour un
                  disponible et des reserves calcules au plus juste.
                </Text>
              ) : (
                <>
                  <View style={styles.historyStack}>
                    {fixedCharges.map((charge) => (
                      <View key={charge.id} style={styles.historyItem}>
                        <View>
                          <Text style={styles.historyMonth}>{charge.label}</Text>
                          <Text style={styles.historyRevenue}>
                            {formatMontant(charge.monthlyAmount)} / mois
                          </Text>
                        </View>
                        <View style={styles.historyActions}>
                          <PressableScale
                            onPress={() => openEditChargeModal(charge)}
                            scale={0.96}
                            accessibilityLabel={`Modifier ${charge.label}`}
                          >
                            <Text style={styles.linkText}>Modifier</Text>
                          </PressableScale>
                          <PressableScale
                            onPress={() => void deleteCharge(charge)}
                            scale={0.96}
                            accessibilityLabel={`Supprimer ${charge.label}`}
                          >
                            <Text style={styles.deleteText}>Supprimer</Text>
                          </PressableScale>
                        </View>
                      </View>
                    ))}
                  </View>
                  <CompactRow
                    label="Total annuel"
                    value={formatMontant(sumAnnualFixedCharges(fixedCharges))}
                    tone="success"
                  />
                  <Text style={styles.helperText}>
                    Ce total remplace le montant saisi dans les parametres pour vos reserves et
                    votre disponible estime.
                  </Text>
                </>
              )}
            </Card>

            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.sectionEyebrow}>Decision</Text>
                  <Text style={styles.sectionTitle}>Objectif</Text>
                </View>
                <Button
                  label={objective ? 'Modifier' : 'Definir'}
                  onPress={openObjectiveModal}
                  size="md"
                />
              </View>

              {objective ? (
                <>
                  <View style={styles.compactGroup}>
                    <CompactRow
                      label="Objectif net mensuel"
                      value={formatMontant(objective.objectiveNetMonthly)}
                    />
                    <CompactRow
                      label="CA annuel necessaire"
                      value={formatMontant(objective.requiredAnnualRevenue)}
                    />
                    <CompactRow
                      label="CA annuel projete"
                      value={formatMontant(objective.projectedAnnualRevenue)}
                      tone={
                        objective.isReached || objective.isExceeded ? 'success' : 'default'
                      }
                    />
                  </View>

                  <View style={styles.progressBlock}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.summaryLineLabel}>Progression</Text>
                      <Text style={styles.progressValue}>{objectiveProgressPercent}%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: objectiveProgressBarWidth }]} />
                    </View>
                  </View>

                  {objective.isExceeded ? (
                    <Text style={styles.successText}>
                      Votre projection depasse deja l'objectif de revenu.
                    </Text>
                  ) : null}
                  {objective.isReached && !objective.isExceeded ? (
                    <Text style={styles.successText}>
                      Votre projection atteint l'objectif de revenu.
                    </Text>
                  ) : null}
                  {!objective.isReached && !objective.isExceeded && objective.isProvisional ? (
                    <Text style={styles.helperText}>
                      Projection indicative. Ajoutez un mois termine pour confirmer votre rythme.
                    </Text>
                  ) : null}
                  {!objective.isReached &&
                  !objective.isExceeded &&
                  !objective.isProvisional &&
                  objective.remainingMonthlyEffort !== null ? (
                    <Text style={styles.helperText}>
                      Il manque {formatMontant(objective.annualRevenueGap)} de CA annuel. Effort
                      restant: {formatMontant(objective.remainingMonthlyEffort)} par mois.
                    </Text>
                  ) : null}
                  {!objective.isReached &&
                  !objective.isExceeded &&
                  objective.remainingMonthlyEffort === null ? (
                    <Text style={styles.alertHelperText}>
                      Aucun mois futur restant pour rattraper la projection cette annee.
                    </Text>
                  ) : null}
                </>
              ) : (
                <View style={styles.objectiveEmptyState}>
                  <Text style={styles.bodyText}>
                    Definissez un objectif net mensuel pour voir le CA a atteindre et l'effort
                    restant.
                  </Text>
                </View>
              )}
            </Card>

            {summary.alerts.length > 0 ? (
              <Card style={styles.sectionCard}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.sectionEyebrow}>Attention</Text>
                  <Text style={styles.sectionTitle}>Alertes</Text>
                </View>
                <View style={styles.alertsStack}>
                  {summary.alerts.map((alert) => (
                    <AlertCard key={`${alert.kind}-${alert.message}`} alert={alert} />
                  ))}
                </View>
              </Card>
            ) : null}

            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBlock}>
                  <Text style={styles.sectionEyebrow}>Suivi</Text>
                  <Text style={styles.sectionTitle}>Historique mensuel</Text>
                </View>
                <View style={styles.historyHeaderActions}>
                  <Text style={styles.historyCount}>{sortedEntries.length} mois</Text>
                  <Button label="Ajouter" onPress={openCreateModal} size="md" />
                </View>
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
                    style={[styles.monthPill, draft.month === month && styles.monthPillSelected]}
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
            label="CA encaisse"
            value={draft.revenue}
            onChangeText={(value) =>
              setDraft((current) => (current ? { ...current, revenue: value } : current))
            }
            placeholder="0"
            suffix="EUR"
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

      {chargeDraft ? (
        <ModalContainer
          title={chargeDraft.id ? 'Modifier une charge' : 'Ajouter une charge'}
          onClose={closeChargeDraft}
        >
          <Input
            label="Intitule"
            value={chargeDraft.label}
            onChangeText={(value) =>
              setChargeDraft((current) => (current ? { ...current, label: value } : current))
            }
            placeholder="Loyer, assurance, abonnement..."
          />
          <Input
            label="Montant mensuel"
            value={chargeDraft.monthlyAmount}
            onChangeText={(value) =>
              setChargeDraft((current) =>
                current ? { ...current, monthlyAmount: value } : current
              )
            }
            placeholder="0"
            suffix="EUR"
          />
          <View style={styles.modalActions}>
            {chargeDraft.id ? (
              <Button
                label="Supprimer"
                onPress={() => {
                  const existing = fixedCharges.find((charge) => charge.id === chargeDraft.id);
                  if (existing) {
                    void deleteCharge(existing);
                  }
                  closeChargeDraft();
                }}
                variant="secondary"
              />
            ) : (
              <Button label="Annuler" onPress={closeChargeDraft} variant="secondary" />
            )}
            <Button
              label="Enregistrer"
              onPress={() => void saveChargeDraft()}
              disabled={!canSaveCharge}
            />
          </View>
        </ModalContainer>
      ) : null}

      {isObjectiveModalOpen ? (
        <ModalContainer
          title={objective ? 'Modifier l objectif' : 'Definir un objectif'}
          onClose={closeObjectiveModal}
        >
          <Text style={styles.bodyText}>
            Indiquez le net mensuel que vous voulez reellement garder.
          </Text>
          <Input
            label="Objectif net mensuel"
            value={objectiveDraft}
            onChangeText={setObjectiveDraft}
            placeholder="0"
            suffix="EUR"
            helper="Le Pilotage reutilise le calcul existant pour estimer le CA necessaire."
          />
          <View style={styles.modalActions}>
            {objective ? (
              <Button
                label="Supprimer"
                onPress={() => void deleteObjective()}
                variant="secondary"
              />
            ) : (
              <Button label="Annuler" onPress={closeObjectiveModal} variant="secondary" />
            )}
            <Button
              label="Enregistrer"
              onPress={() => void saveObjective()}
              disabled={!canSaveObjective}
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.inkSecondary,
    textAlign: 'center',
  },
  metricStack: {
    gap: spacing.xs,
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
  metricsDetailCard: {
    paddingVertical: spacing.sm,
  },
  metricsDetailRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inlineMetric: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inlineMetricLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginBottom: spacing.xxs,
  },
  inlineMetricValue: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  sectionCard: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitleBlock: {
    flex: 1,
  },
  sectionEyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xxs,
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
    gap: spacing.md,
  },
  summaryLineLabel: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    flex: 1,
  },
  summaryLineValue: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    textAlign: 'right',
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
  },
  compactRowValueSuccess: {
    color: colors.primary,
  },
  compactRowValueWarning: {
    color: colors.alert,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.alert,
    marginTop: spacing.xs,
  },
  alertHelperText: {
    ...typography.bodySmall,
    color: colors.negative,
    marginTop: spacing.xs,
  },
  bodyText: {
    ...typography.body,
    color: colors.inkSecondary,
  },
  objectiveEmptyState: {
    gap: spacing.sm,
  },
  progressBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressValue: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  successText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  alertsStack: {
    gap: spacing.xs,
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
  alertCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  alertTitle: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '800',
  },
  alertText: {
    ...typography.bodySmall,
    color: colors.ink,
    flex: 1,
  },
  historyStack: {
    gap: spacing.xs,
  },
  historyCount: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    fontWeight: '700',
  },
  historyHeaderActions: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
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
    gap: spacing.sm,
    marginTop: spacing.xxs,
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
