import { ACTIVITY_OPTIONS, getActivityConfig, getActivityLabel } from '../mapping';

describe('Activity mapping', () => {
  it('maps vente de marchandises to BIC_VENTE + commerciale', () => {
    const config = getActivityConfig('VENTE_MARCHANDISES');
    expect(config.activite).toBe('BIC_VENTE');
    expect(config.natureActivite).toBe('commerciale');
  });

  it('maps prestation commerciale to BIC_PRESTATION + commerciale', () => {
    const config = getActivityConfig('PRESTATION_COMMERCIALE');
    expect(config.activite).toBe('BIC_PRESTATION');
    expect(config.natureActivite).toBe('commerciale');
  });

  it('maps prestation artisanale to BIC_PRESTATION + artisanale', () => {
    const config = getActivityConfig('PRESTATION_ARTISANALE');
    expect(config.activite).toBe('BIC_PRESTATION');
    expect(config.natureActivite).toBe('artisanale');
  });

  it('maps profession liberale to BNC + liberale', () => {
    const config = getActivityConfig('PROFESSION_LIBERALE');
    expect(config.activite).toBe('BNC');
    expect(config.natureActivite).toBe('liberale');
  });

  it('throws on unknown activity choice', () => {
    expect(() =>
      getActivityConfig('UNKNOWN' as never)
    ).toThrow();
  });

  it('provides human-readable labels for all options', () => {
    for (const option of ACTIVITY_OPTIONS) {
      expect(getActivityLabel(option.value)).toBe(option.label);
    }
  });

  it('does not expose invalid combinations', () => {
    const combinations = ACTIVITY_OPTIONS.map((o) => ({
      activite: o.activite,
      nature: o.natureActivite,
    }));

    // L'ancienne combinaison BIC_PRESTATION + liberale ne doit pas être accessible
    expect(combinations).not.toContainEqual({
      activite: 'BIC_PRESTATION',
      nature: 'liberale',
    });
  });
});
