export interface FixedCharge {
  id: string;
  label: string;
  monthlyAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FixedChargesStorage {
  version: 1;
  charges: FixedCharge[];
}

/**
 * Total annuel des charges fixes récurrentes, utilisé partout où le
 * calculateur et le Pilotage attendent un montant annuel unique
 * (chargesFixesAnnuelles).
 */
export function sumAnnualFixedCharges(charges: FixedCharge[]): number {
  return charges.reduce((total, charge) => total + charge.monthlyAmount, 0) * 12;
}

export function sumMonthlyFixedCharges(charges: FixedCharge[]): number {
  return charges.reduce((total, charge) => total + charge.monthlyAmount, 0);
}
