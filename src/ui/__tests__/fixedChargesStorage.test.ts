import {
  deleteFixedCharge,
  loadFixedChargesStorage,
  saveFixedChargesStorage,
  upsertFixedCharge,
} from '../../storage/fixedChargesStorage';
import { resetAsyncStorage } from './__mocks__/async-storage';

beforeEach(() => {
  resetAsyncStorage();
});

describe('fixedChargesStorage', () => {
  it('does not lose an update when two upserts race (read-modify-write lock)', async () => {
    await Promise.all([
      upsertFixedCharge({ label: 'Loyer', monthlyAmount: 500 }),
      upsertFixedCharge({ label: 'Assurance', monthlyAmount: 60 }),
    ]);

    const final = await loadFixedChargesStorage();
    expect(final.charges).toHaveLength(2);
    expect(final.charges.some((c) => c.label === 'Loyer' && c.monthlyAmount === 500)).toBe(true);
    expect(final.charges.some((c) => c.label === 'Assurance' && c.monthlyAmount === 60)).toBe(true);
  });

  it('warns in dev and falls back safely on an unexpected stored version', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await saveFixedChargesStorage({
      version: 2 as unknown as 1,
      charges: [],
    });

    const loaded = await loadFixedChargesStorage();

    expect(loaded.version).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('version de stockage inattendue'));

    warnSpy.mockRestore();
  });

  it('deletes the right charge even when racing an unrelated upsert', async () => {
    const [charge] = await upsertFixedCharge({ label: 'Loyer', monthlyAmount: 500 });

    await Promise.all([
      deleteFixedCharge(charge.id),
      upsertFixedCharge({ label: 'Assurance', monthlyAmount: 60 }),
    ]);

    const final = await loadFixedChargesStorage();
    expect(final.charges.some((c) => c.label === 'Loyer')).toBe(false);
    expect(final.charges.some((c) => c.label === 'Assurance')).toBe(true);
  });
});
