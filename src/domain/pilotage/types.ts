import { ResultatMicro, ActiviteMicro } from '../../engine/types';

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface MonthlyRevenueEntry {
  year: number;
  month: Month;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface PilotageStorage {
  version: 1;
  entries: MonthlyRevenueEntry[];
}

export type PilotageAlertKind =
  | 'projection_provisional'
  | 'negative_available'
  | 'tva_threshold'
  | 'micro_threshold';

export interface PilotageAlert {
  kind: PilotageAlertKind;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
}

export interface PilotageProjection {
  revenueYtd: number;
  projectedAnnualRevenue: number | null;
  projectionIsProvisional: boolean;
  averageMonthlyRevenue: number | null;
  completedMonthsCount: number;
  remainingFutureMonths: number;
  elapsedMonths: number;
}

export interface PilotageReserves {
  contributionsReserve: number;
  taxReserve: number;
  fixedChargesReserve: number;
  totalReserve: number;
  estimatedAvailable: number;
  revenueProgressRatio: number;
}

export interface PilotageSummary {
  revenueYtd: number;
  projectedAnnualRevenue: number | null;
  projectionIsProvisional: boolean;
  projectedAnnualNet: number | null;
  projectedMonthlyNet: number | null;
  contributionsReserve: number;
  taxReserve: number;
  fixedChargesReserve: number;
  totalReserve: number;
  estimatedAvailable: number;
  alerts: PilotageAlert[];
}

export interface BuildPilotageSummaryParams {
  currentMonth: Month;
  currentYear: number;
  entries: MonthlyRevenueEntry[];
  annualFixedCharges: number;
  activity: ActiviteMicro;
  projectedAnnualResult: ResultatMicro | null;
}
