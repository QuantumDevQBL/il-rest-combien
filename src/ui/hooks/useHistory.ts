import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityChoice } from '../mapping';

const HISTORY_STORAGE_KEY = 'historique-simulations';
const MAX_HISTORY_ITEMS = 50;

export interface HistoryItem {
  id: string;
  date: string;
  label: string;
  activity: ActivityChoice;
  caAnnuelHT: number;
  revenuNetDisponible: number;
  scenarioLePlusFavorable: 'BAREME' | 'VL';
}

export interface HistoryState {
  items: HistoryItem[];
  isLoading: boolean;
}

export interface HistoryActions {
  addItem: (item: Omit<HistoryItem, 'id' | 'date'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useHistory(): HistoryState & HistoryActions {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(HISTORY_STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as HistoryItem[];
            setItems(parsed);
          } catch {
            setItems([]);
          }
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (newItems: HistoryItem[]) => {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newItems));
  }, []);

  const addItem = useCallback(
    async (item: Omit<HistoryItem, 'id' | 'date'>) => {
      const newItem: HistoryItem = {
        ...item,
        id: generateId(),
        date: new Date().toISOString(),
      };
      const newItems = [newItem, ...items].slice(0, MAX_HISTORY_ITEMS);
      setItems(newItems);
      await persist(newItems);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const newItems = items.filter((i) => i.id !== id);
      setItems(newItems);
      await persist(newItems);
    },
    [items, persist]
  );

  const clearHistory = useCallback(async () => {
    setItems([]);
    await persist([]);
  }, [persist]);

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    clearHistory,
  };
}
