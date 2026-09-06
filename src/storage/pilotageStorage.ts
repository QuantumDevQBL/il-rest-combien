import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonthlyRevenueEntry, PilotageStorage } from '../domain/pilotage';
import { createLock } from './withLock';

const PILOTAGE_STORAGE_KEY = 'pilotage-storage';
const CURRENT_VERSION = 1;
const withLock = createLock();

function isValidEntry(value: unknown): value is MonthlyRevenueEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.year === 'number' &&
    typeof entry.month === 'number' &&
    typeof entry.revenue === 'number' &&
    typeof entry.createdAt === 'string' &&
    typeof entry.updatedAt === 'string'
  );
}

function normalizeStorage(value: unknown): PilotageStorage {
  if (!value || typeof value !== 'object') {
    return { version: CURRENT_VERSION, entries: [] };
  }

  const storage = value as Record<string, unknown>;

  if (storage.version !== undefined && storage.version !== CURRENT_VERSION && __DEV__) {
    // Aucune migration n'existe encore : signalé pour qu'un futur changement
    // de schéma ne soit pas silencieusement mal interprété comme la v1.
    console.warn(
      `[pilotageStorage] version de stockage inattendue (${String(storage.version)}), ` +
        `attendu ${CURRENT_VERSION}. Les données sont réinterprétées comme la v1 ; ` +
        'ajouter une vraie migration si un nouveau schéma existe.'
    );
  }

  const entries = Array.isArray(storage.entries)
    ? storage.entries.filter(isValidEntry)
    : [];

  return {
    version: CURRENT_VERSION,
    entries,
  };
}

export async function loadPilotageStorage(): Promise<PilotageStorage> {
  const rawValue = await AsyncStorage.getItem(PILOTAGE_STORAGE_KEY);
  if (!rawValue) {
    return { version: CURRENT_VERSION, entries: [] };
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return normalizeStorage(parsed);
  } catch {
    return { version: CURRENT_VERSION, entries: [] };
  }
}

export async function savePilotageStorage(storage: PilotageStorage): Promise<void> {
  await AsyncStorage.setItem(PILOTAGE_STORAGE_KEY, JSON.stringify(storage));
}

export async function listMonthlyRevenueEntries(): Promise<MonthlyRevenueEntry[]> {
  const storage = await loadPilotageStorage();
  return storage.entries
    .slice()
    .sort((left, right) => {
      if (left.year !== right.year) {
        return left.year - right.year;
      }

      return left.month - right.month;
    });
}

export async function upsertMonthlyRevenueEntry(
  entry: Omit<MonthlyRevenueEntry, 'createdAt' | 'updatedAt'> & Partial<Pick<MonthlyRevenueEntry, 'createdAt'>>
): Promise<MonthlyRevenueEntry[]> {
  return withLock(async () => {
    const storage = await loadPilotageStorage();
    const existingIndex = storage.entries.findIndex(
      (item) => item.year === entry.year && item.month === entry.month
    );
    const now = new Date().toISOString();
    const nextEntry: MonthlyRevenueEntry = {
      ...entry,
      createdAt:
        existingIndex >= 0
          ? storage.entries[existingIndex].createdAt
          : entry.createdAt ?? now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      storage.entries[existingIndex] = nextEntry;
    } else {
      storage.entries.push(nextEntry);
    }

    await savePilotageStorage(storage);
    return listMonthlyRevenueEntries();
  });
}

export async function deleteMonthlyRevenueEntry(
  year: number,
  month: MonthlyRevenueEntry['month']
): Promise<MonthlyRevenueEntry[]> {
  return withLock(async () => {
    const storage = await loadPilotageStorage();
    storage.entries = storage.entries.filter(
      (entry) => !(entry.year === year && entry.month === month)
    );
    await savePilotageStorage(storage);
    return listMonthlyRevenueEntries();
  });
}
