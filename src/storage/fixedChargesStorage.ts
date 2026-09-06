import AsyncStorage from '@react-native-async-storage/async-storage';
import { FixedCharge, FixedChargesStorage } from '../domain/pilotage';
import { createLock } from './withLock';

const FIXED_CHARGES_STORAGE_KEY = 'charges-fixes-storage';
const CURRENT_VERSION = 1;
const withLock = createLock();

function isValidCharge(value: unknown): value is FixedCharge {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const charge = value as Record<string, unknown>;
  return (
    typeof charge.id === 'string' &&
    typeof charge.label === 'string' &&
    typeof charge.monthlyAmount === 'number' &&
    typeof charge.createdAt === 'string' &&
    typeof charge.updatedAt === 'string'
  );
}

function normalizeStorage(value: unknown): FixedChargesStorage {
  if (!value || typeof value !== 'object') {
    return { version: CURRENT_VERSION, charges: [] };
  }

  const storage = value as Record<string, unknown>;

  if (storage.version !== undefined && storage.version !== CURRENT_VERSION && __DEV__) {
    // Aucune migration n'existe encore : signalé pour qu'un futur changement
    // de schéma ne soit pas silencieusement mal interprété comme la v1.
    console.warn(
      `[fixedChargesStorage] version de stockage inattendue (${String(storage.version)}), ` +
        `attendu ${CURRENT_VERSION}. Les données sont réinterprétées comme la v1 ; ` +
        'ajouter une vraie migration si un nouveau schéma existe.'
    );
  }

  const charges = Array.isArray(storage.charges) ? storage.charges.filter(isValidCharge) : [];

  return {
    version: CURRENT_VERSION,
    charges,
  };
}

export async function loadFixedChargesStorage(): Promise<FixedChargesStorage> {
  const rawValue = await AsyncStorage.getItem(FIXED_CHARGES_STORAGE_KEY);
  if (!rawValue) {
    return { version: CURRENT_VERSION, charges: [] };
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return normalizeStorage(parsed);
  } catch {
    return { version: CURRENT_VERSION, charges: [] };
  }
}

export async function saveFixedChargesStorage(storage: FixedChargesStorage): Promise<void> {
  await AsyncStorage.setItem(FIXED_CHARGES_STORAGE_KEY, JSON.stringify(storage));
}

export async function listFixedCharges(): Promise<FixedCharge[]> {
  const storage = await loadFixedChargesStorage();
  return storage.charges.slice().sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export async function upsertFixedCharge(
  charge: { id?: string; label: string; monthlyAmount: number }
): Promise<FixedCharge[]> {
  return withLock(async () => {
    const storage = await loadFixedChargesStorage();
    const existingIndex = charge.id
      ? storage.charges.findIndex((item) => item.id === charge.id)
      : -1;
    const now = new Date().toISOString();
    const nextCharge: FixedCharge = {
      id: charge.id ?? `${now}-${Math.random().toString(36).slice(2, 8)}`,
      label: charge.label,
      monthlyAmount: charge.monthlyAmount,
      createdAt: existingIndex >= 0 ? storage.charges[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      storage.charges[existingIndex] = nextCharge;
    } else {
      storage.charges.push(nextCharge);
    }

    await saveFixedChargesStorage(storage);
    return listFixedCharges();
  });
}

export async function deleteFixedCharge(id: string): Promise<FixedCharge[]> {
  return withLock(async () => {
    const storage = await loadFixedChargesStorage();
    storage.charges = storage.charges.filter((charge) => charge.id !== id);
    await saveFixedChargesStorage(storage);
    return listFixedCharges();
  });
}
