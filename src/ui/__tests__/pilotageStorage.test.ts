import {
  deleteMonthlyRevenueEntry,
  loadPilotageStorage,
  savePilotageStorage,
  upsertMonthlyRevenueEntry,
} from '../../storage/pilotageStorage';
import { resetAsyncStorage } from './__mocks__/async-storage';

beforeEach(() => {
  resetAsyncStorage();
});

describe('pilotageStorage', () => {
  it('does not lose an update when two upserts race (read-modify-write lock)', async () => {
    const [afterJuly, afterAugust] = await Promise.all([
      upsertMonthlyRevenueEntry({ year: 2026, month: 7, revenue: 4000 }),
      upsertMonthlyRevenueEntry({ year: 2026, month: 8, revenue: 4500 }),
    ]);

    // Both calls resolve with the storage as it stood right after their own
    // write; what matters is that neither write got silently overwritten by
    // the other. Read the final persisted state to check that.
    void afterJuly;
    void afterAugust;

    const final = await loadPilotageStorage();
    expect(final.entries).toHaveLength(2);
    expect(final.entries.some((e) => e.month === 7 && e.revenue === 4000)).toBe(true);
    expect(final.entries.some((e) => e.month === 8 && e.revenue === 4500)).toBe(true);
  });

  it('warns in dev and falls back safely on an unexpected stored version', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await savePilotageStorage({
      // Simulates a future/foreign schema version.
      version: 2 as unknown as 1,
      entries: [],
    });

    const loaded = await loadPilotageStorage();

    expect(loaded.version).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('version de stockage inattendue'));

    warnSpy.mockRestore();
  });

  it('deletes the right entry even when racing an unrelated upsert', async () => {
    await upsertMonthlyRevenueEntry({ year: 2026, month: 1, revenue: 1000 });

    await Promise.all([
      deleteMonthlyRevenueEntry(2026, 1),
      upsertMonthlyRevenueEntry({ year: 2026, month: 2, revenue: 2000 }),
    ]);

    const final = await loadPilotageStorage();
    expect(final.entries.some((e) => e.month === 1)).toBe(false);
    expect(final.entries.some((e) => e.month === 2 && e.revenue === 2000)).toBe(true);
  });
});
