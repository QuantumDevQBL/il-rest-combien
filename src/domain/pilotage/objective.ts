import { PilotageObjectiveSummary, PilotageProjection } from './types';

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export function buildObjectiveSummary(params: {
  projection: PilotageProjection;
  objectiveNetMonthly: number | null;
  requiredAnnualRevenue: number | null;
}): PilotageObjectiveSummary | null {
  const { projection, objectiveNetMonthly, requiredAnnualRevenue } = params;

  if (
    objectiveNetMonthly === null ||
    objectiveNetMonthly <= 0 ||
    requiredAnnualRevenue === null ||
    requiredAnnualRevenue <= 0
  ) {
    return null;
  }

  const projectedAnnualRevenue = projection.projectedAnnualRevenue;
  const annualRevenueGap =
    projectedAnnualRevenue === null ? requiredAnnualRevenue : requiredAnnualRevenue - projectedAnnualRevenue;
  const progressRatio =
    projectedAnnualRevenue === null ? 0 : clampRatio(projectedAnnualRevenue / requiredAnnualRevenue);
  const progressPercent = progressRatio * 100;
  const remainingMonthlyEffort =
    annualRevenueGap > 0
      ? projection.remainingFutureMonths > 0
        ? annualRevenueGap / projection.remainingFutureMonths
        : null
      : 0;

  return {
    objectiveNetMonthly,
    requiredAnnualRevenue,
    projectedAnnualRevenue,
    annualRevenueGap,
    progressRatio,
    progressPercent,
    remainingMonthlyEffort,
    isProvisional: projection.projectionIsProvisional,
    isReached: annualRevenueGap <= 0 && annualRevenueGap >= -1,
    isExceeded: annualRevenueGap < -1,
    remainingFutureMonths: projection.remainingFutureMonths,
  };
}
