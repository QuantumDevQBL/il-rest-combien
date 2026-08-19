import { useEffect, useRef } from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { useHistory } from './useHistory';

/**
 * Synchronise automatiquement les résultats du calculateur avec l'historique.
 * N'ajoute un élément que si le résultat est valide et que le CA a changé.
 */
export function useHistorySync(): void {
  const { result, form } = useCalculatorContext();
  const { addItem } = useHistory();
  const lastCaRef = useRef<number | null>(null);

  useEffect(() => {
    if (!result) return;

    const ca = result.caAnnuelHT;
    if (ca <= 0) return;
    if (lastCaRef.current === ca) return;

    lastCaRef.current = ca;

    void addItem({
      activity: form.activity,
      caAnnuelHT: ca,
      revenuNetDisponible: result.revenuNetDisponible,
      scenarioLePlusFavorable: result.scenarioLePlusFavorable,
    });
  }, [result, form.activity, addItem]);
}
