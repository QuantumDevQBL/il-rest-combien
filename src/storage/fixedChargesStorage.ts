import AsyncStorage from '@react-native-async-storage/async-storage';
import { FixedCharge, FixedChargesStorage } from '../domain/pilotage';

const FIXED_CHARGES_STORAGE_KEY = 'charges-fixes-storage';

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
    return { version: 1, charges: [] };
  }

  const storage = value as Record<string, unknown>;
  const charges = Array.isArray(storage.charges) ? storage.charges.filter(isValidCharge) : [];

  return {
    version: 1,
    charges,
  };
}

export async function loadFixedChargesStorage(): Promise<FixedChargesStorage> {
  const rawValue = await AsyncStorage.getItem(FIXED_CHARGES_STORAGE_KEY);
  if (!rawValue) {
    return { version: 1, charges: [] };
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return normalizeStorage(parsed);
  } catch {
    return { version: 1, charges: [] };
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
}

export async function deleteFixedCharge(id: string): Promise<FixedCharge[]> {
  const storage = await loadFixedChargesStorage();
  storage.charges = storage.charges.filter((charge) => charge.id !== id);
  await saveFixedChargesStorage(storage);
  return listFixedCharges();
}
