import { buildAlerts } from './alerts';
import { buildProjection } from './projection';
import { buildReserves } from './reserves';
import { BuildPilotageSummaryParams, PilotageSummary } from './types';

export function buildPilotageSummary(params: BuildPilotageSummaryParams): PilotageSummary | null {
  const {
    currentMonth,
    entries,
    annualFixedCharges,
    activity,
    projectedAnnualResult,
  } = params;

  if (entries.length === 0) {
    return null;
  }

  const projection = buildProjection(entries, currentMonth);
  const reserves = buildReserves(projection, projectedAnnualResult, annualFixedCharges);
  const alerts = buildAlerts({
    activity,
    currentMonth,
    entries,
    projection,
    estimatedAvailable: reserves.estimatedAvailable,
  });

  return {
    revenueYtd: projection.revenueYtd,
    projectedAnnualRevenue: projection.projectedAnnualRevenue,
    projectionIsProvisional: projection.projectionIsProvisional,
    projectedAnnualNet: projectedAnnualResult?.revenuNetDisponible ?? null,
    projectedMonthlyNet:
      projectedAnnualResult !== null
        ? projectedAnnualResult.revenuNetDisponible / 12
        : null,
    contributionsReserve: reserves.contributionsReserve,
    taxReserve: reserves.taxReserve,
    fixedChargesReserve: reserves.fixedChargesReserve,
    totalReserve: reserves.totalReserve,
    estimatedAvailable: reserves.estimatedAvailable,
    alerts,
  };
}
