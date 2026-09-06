import { FixedCharge, sumAnnualFixedCharges, sumMonthlyFixedCharges } from './fixedCharges';

function charge(monthlyAmount: number, id = 'x'): FixedCharge {
  return {
    id,
    label: 'Charge',
    monthlyAmount,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('sumMonthlyFixedCharges / sumAnnualFixedCharges', () => {
  it('returns 0 for an empty list', () => {
    expect(sumMonthlyFixedCharges([])).toBe(0);
    expect(sumAnnualFixedCharges([])).toBe(0);
  });

  it('sums the monthly amounts and annualizes them (x12)', () => {
    const charges = [charge(500, 'loyer'), charge(60, 'assurance'), charge(15, 'abonnement')];

    expect(sumMonthlyFixedCharges(charges)).toBe(575);
    expect(sumAnnualFixedCharges(charges)).toBe(575 * 12);
  });
});
