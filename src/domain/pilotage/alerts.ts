import {
  PLAFOND_MICRO_BIC_PRESTATION,
  PLAFOND_MICRO_BIC_VENTE,
  PLAFOND_MICRO_BNC,
  TVA_FRANCHISE_BASE_PRESTATION,
  TVA_FRANCHISE_BASE_VENTE,
} from '../../data/baremes-2026';
import { ActiviteMicro } from '../../engine/types';
import {
  MonthlyRevenueEntry,
  Month,
  PilotageAlert,
  PilotageObjectiveSummary,
  PilotageProjection,
} from './types';

const MONTH_LABELS: Record<Month, string> = {
  1: 'janvier',
  2: 'fevrier',
  3: 'mars',
  4: 'avril',
  5: 'mai',
  6: 'juin',
  7: 'juillet',
  8: 'aout',
  9: 'septembre',
  10: 'octobre',
  11: 'novembre',
  12: 'decembre',
};

const MICRO_THRESHOLDS: Record<ActiviteMicro, number> = {
  BIC_VENTE: PLAFOND_MICRO_BIC_VENTE.plafond,
  BIC_PRESTATION: PLAFOND_MICRO_BIC_PRESTATION.plafond,
  BNC: PLAFOND_MICRO_BNC.plafond,
  CIPAV: PLAFOND_MICRO_BNC.plafond,
};

const TVA_THRESHOLDS: Record<ActiviteMicro, number> = {
  BIC_VENTE: TVA_FRANCHISE_BASE_VENTE.seuilBase,
  BIC_PRESTATION: TVA_FRANCHISE_BASE_PRESTATION.seuilBase,
  BNC: TVA_FRANCHISE_BASE_PRESTATION.seuilBase,
  CIPAV: TVA_FRANCHISE_BASE_PRESTATION.seuilBase,
};

function estimateThresholdMonth(
  threshold: number,
  currentMonth: Month,
  projection: PilotageProjection,
  entries: MonthlyRevenueEntry[]
): string | null {
  if (projection.projectedAnnualRevenue === null || projection.averageMonthlyRevenue === null) {
    return null;
  }

  if (projection.revenueYtd >= threshold) {
    const latestMonth = entries.reduce<Month>((latest, entry) => {
      return entry.month > latest ? entry.month : latest;
    }, currentMonth);
    return MONTH_LABELS[latestMonth];
  }

  if (projection.averageMonthlyRevenue <= 0) {
    return null;
  }

  const monthsNeeded = Math.ceil(
    (threshold - projection.revenueYtd) / projection.averageMonthlyRevenue
  );
  const estimatedMonth = Math.min(12, currentMonth + monthsNeeded) as Month;
  return MONTH_LABELS[estimatedMonth];
}

export function buildAlerts(params: {
  activity: ActiviteMicro;
  currentMonth: Month;
  entries: MonthlyRevenueEntry[];
  projection: PilotageProjection;
  estimatedAvailable: number;
  objective: PilotageObjectiveSummary | null;
}): PilotageAlert[] {
  const { activity, currentMonth, entries, projection, estimatedAvailable, objective } = params;
  const alerts: PilotageAlert[] = [];

  if (projection.projectedAnnualRevenue === null) {
    return alerts;
  }

  if (projection.projectionIsProvisional) {
    alerts.push({
      kind: 'projection_provisional',
      severity: 'info',
      title: 'Projection provisoire',
      message: 'Projection indicative basee sur votre mois en cours.',
    });
  }

  if (estimatedAvailable < 0) {
    alerts.push({
      kind: 'negative_available',
      severity: 'danger',
      title: 'Disponible estime negatif',
      message: 'Vos reserves estimees depassent le CA deja encaisse.',
    });
  }

  const tvaThreshold = TVA_THRESHOLDS[activity];
  if (projection.projectedAnnualRevenue > tvaThreshold) {
    const month = estimateThresholdMonth(tvaThreshold, currentMonth, projection, entries);
    alerts.push({
      kind: 'tva_threshold',
      severity: 'warning',
      title: 'Seuil de TVA projete',
      message: month
        ? `Au rythme actuel, vous atteindriez le seuil de TVA en ${month}.`
        : 'Au rythme actuel, vous atteindriez le seuil de TVA cette annee.',
    });
  }

  const microThreshold = MICRO_THRESHOLDS[activity];
  if (projection.projectedAnnualRevenue > microThreshold) {
    const month = estimateThresholdMonth(microThreshold, currentMonth, projection, entries);
    alerts.push({
      kind: 'micro_threshold',
      severity: 'warning',
      title: 'Plafond micro projete',
      message: month
        ? `Au rythme actuel, vous depasseriez le plafond micro en ${month}.`
        : 'Au rythme actuel, vous depasseriez le plafond micro cette annee.',
    });
  }

  if (
    objective &&
    objective.annualRevenueGap !== null &&
    objective.annualRevenueGap > 0 &&
    objective.progressRatio !== null &&
    objective.progressRatio < 0.9
  ) {
    alerts.push({
      kind: 'objective_gap',
      severity: objective.remainingFutureMonths === 0 ? 'danger' : 'warning',
      title: 'Objectif a rattraper',
      message:
        objective.remainingMonthlyEffort !== null
          ? `Au rythme actuel, il manque ${Math.round(objective.remainingMonthlyEffort)} EUR de CA par mois pour atteindre votre objectif.`
          : 'Au rythme actuel, votre projection reste sous votre objectif annuel.',
    });
  }

  return alerts;
}
