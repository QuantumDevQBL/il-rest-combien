import { ResultatMicro } from '../../engine/types';
import { PilotageProjection, PilotageReserves } from './types';

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(value, 1));
}

export function buildReserves(
  projection: PilotageProjection,
  projectedAnnualResult: ResultatMicro | null,
  annualFixedCharges: number
): PilotageReserves {
  if (!projectedAnnualResult || projection.projectedAnnualRevenue === null || projection.projectedAnnualRevenue <= 0) {
    const fixedChargesReserve = annualFixedCharges * (projection.elapsedMonths / 12);
    return {
      contributionsReserve: 0,
      taxReserve: 0,
      fixedChargesReserve,
      totalReserve: fixedChargesReserve,
      estimatedAvailable: projection.revenueYtd - fixedChargesReserve,
      revenueProgressRatio: 0,
    };
  }

  const revenueProgressRatio = clampRatio(projection.revenueYtd / projection.projectedAnnualRevenue);
  const contributionsReserve = projectedAnnualResult.totalPrelevementsSociaux * revenueProgressRatio;
  const taxReserve = projectedAnnualResult.impotRetenu * revenueProgressRatio;
  const fixedChargesReserve = annualFixedCharges * (projection.elapsedMonths / 12);
  const totalReserve = contributionsReserve + taxReserve + fixedChargesReserve;

  return {
    contributionsReserve,
    taxReserve,
    fixedChargesReserve,
    totalReserve,
    estimatedAvailable: projection.revenueYtd - totalReserve,
    revenueProgressRatio,
  };
}
