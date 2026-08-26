import { MonthlyRevenueEntry, Month, PilotageProjection } from './types';

function sumRevenue(entries: MonthlyRevenueEntry[]): number {
  return entries.reduce((total, entry) => total + entry.revenue, 0);
}

export function buildProjection(
  entries: MonthlyRevenueEntry[],
  currentMonth: Month
): PilotageProjection {
  const revenueYtd = sumRevenue(entries);
  const completedEntries = entries.filter((entry) => entry.month < currentMonth);
  const currentMonthEntry = entries.find((entry) => entry.month === currentMonth) ?? null;
  const completedMonthsCount = completedEntries.length;
  const remainingFutureMonths = 12 - currentMonth;
  const elapsedMonths = currentMonth;

  if (entries.length === 0) {
    return {
      revenueYtd,
      projectedAnnualRevenue: null,
      projectionIsProvisional: false,
      averageMonthlyRevenue: null,
      completedMonthsCount,
      remainingFutureMonths,
      elapsedMonths,
    };
  }

  if (completedEntries.length > 0) {
    const averageMonthlyRevenue = revenueYtd === 0 ? 0 : sumRevenue(completedEntries) / completedEntries.length;

    return {
      revenueYtd,
      projectedAnnualRevenue: revenueYtd + averageMonthlyRevenue * remainingFutureMonths,
      projectionIsProvisional: false,
      averageMonthlyRevenue,
      completedMonthsCount,
      remainingFutureMonths,
      elapsedMonths,
    };
  }

  if (currentMonthEntry) {
    return {
      revenueYtd,
      projectedAnnualRevenue: revenueYtd + currentMonthEntry.revenue * remainingFutureMonths,
      projectionIsProvisional: true,
      averageMonthlyRevenue: currentMonthEntry.revenue,
      completedMonthsCount,
      remainingFutureMonths,
      elapsedMonths,
    };
  }

  return {
    revenueYtd,
    projectedAnnualRevenue: null,
    projectionIsProvisional: false,
    averageMonthlyRevenue: null,
    completedMonthsCount,
    remainingFutureMonths,
    elapsedMonths,
  };
}
