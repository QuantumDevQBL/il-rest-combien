import { buildAlerts } from './alerts';
import { buildObjectiveSummary } from './objective';
import { PilotageProjection } from './types';

const baseProjection: PilotageProjection = {
  revenueYtd: 20000,
  projectedAnnualRevenue: 48000,
  projectionIsProvisional: false,
  averageMonthlyRevenue: 4000,
  completedMonthsCount: 5,
  remainingFutureMonths: 7,
  elapsedMonths: 8,
};

describe('buildObjectiveSummary', () => {
  it('returns null when no valid objective is provided', () => {
    expect(
      buildObjectiveSummary({
        projection: baseProjection,
        objectiveNetMonthly: null,
        requiredAnnualRevenue: null,
      })
    ).toBeNull();
  });

  it('builds progress and remaining effort from the existing required CA', () => {
    const summary = buildObjectiveSummary({
      projection: baseProjection,
      objectiveNetMonthly: 3000,
      requiredAnnualRevenue: 60000,
    });

    expect(summary).not.toBeNull();
    expect(summary?.requiredAnnualRevenue).toBe(60000);
    expect(summary?.annualRevenueGap).toBe(12000);
    expect(summary?.remainingMonthlyEffort).toBeCloseTo(12000 / 7, 5);
    expect(summary?.isReached).toBe(false);
    expect(summary?.isExceeded).toBe(false);
  });

  it('marks the objective as exceeded when projection is above target', () => {
    const summary = buildObjectiveSummary({
      projection: baseProjection,
      objectiveNetMonthly: 3000,
      requiredAnnualRevenue: 45000,
    });

    expect(summary?.isExceeded).toBe(true);
    expect(summary?.remainingMonthlyEffort).toBe(0);
  });

  it('keeps a positive gap with no monthly effort when no future month remains', () => {
    const summary = buildObjectiveSummary({
      projection: {
        ...baseProjection,
        remainingFutureMonths: 0,
      },
      objectiveNetMonthly: 3000,
      requiredAnnualRevenue: 60000,
    });

    expect(summary?.annualRevenueGap).toBe(12000);
    expect(summary?.remainingMonthlyEffort).toBeNull();
  });
});

describe('buildAlerts objective gap', () => {
  it('adds an objective alert when projection remains materially below target', () => {
    const objective = buildObjectiveSummary({
      projection: baseProjection,
      objectiveNetMonthly: 3000,
      requiredAnnualRevenue: 60000,
    });

    const alerts = buildAlerts({
      activity: 'BNC',
      currentMonth: 8,
      entries: [],
      projection: baseProjection,
      estimatedAvailable: 1000,
      objective,
    });

    expect(alerts.some((alert) => alert.kind === 'objective_gap')).toBe(true);
  });
});
