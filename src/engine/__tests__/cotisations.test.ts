import { calculerPrelevementsSociaux } from '../cotisations';

describe('calculerPrelevementsSociaux', () => {
  it('calcule les cotisations BIC prestation avec nature libérale', () => {
    const result = calculerPrelevementsSociaux(50_000, 'BIC_PRESTATION', 'liberale');
    expect(result.cotisationsSociales).toBe(Math.round(50_000 * 0.212));
    expect(result.cfp).toBe(Math.round(50_000 * 0.002));
    expect(result.totalPrelevementsSociaux).toBe(
      Math.round(50_000 * 0.212) + Math.round(50_000 * 0.002)
    );
  });

  it('calcule les cotisations BIC vente avec nature commerciale', () => {
    const result = calculerPrelevementsSociaux(80_000, 'BIC_VENTE', 'commerciale');
    expect(result.cotisationsSociales).toBe(Math.round(80_000 * 0.123));
    expect(result.cfp).toBe(Math.round(80_000 * 0.001));
  });

  it('calcule les cotisations BNC avec nature libérale', () => {
    const result = calculerPrelevementsSociaux(40_000, 'BNC', 'liberale');
    expect(result.cotisationsSociales).toBe(Math.round(40_000 * 0.256));
    expect(result.cfp).toBe(Math.round(40_000 * 0.002));
  });

  it('calcule les cotisations BIC prestation avec nature artisanale', () => {
    const result = calculerPrelevementsSociaux(60_000, 'BIC_PRESTATION', 'artisanale');
    expect(result.cotisationsSociales).toBe(Math.round(60_000 * 0.212));
    expect(result.cfp).toBe(Math.round(60_000 * 0.003));
  });

  it('retourne zéro pour un CA nul, sans cotisation minimale', () => {
    const result = calculerPrelevementsSociaux(0, 'BNC', 'liberale');
    expect(result.cotisationsSociales).toBe(0);
    expect(result.cfp).toBe(0);
    expect(result.totalPrelevementsSociaux).toBe(0);
  });

  it('arrondit cotisations et CFP séparément', () => {
    const result = calculerPrelevementsSociaux(1_000, 'BNC', 'liberale');
    expect(result.cotisationsSociales).toBe(256);
    expect(result.cfp).toBe(2);
    expect(result.totalPrelevementsSociaux).toBe(258);
  });
});
