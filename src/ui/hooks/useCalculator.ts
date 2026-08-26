import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculerCARequis,
  calculerMicroEntreprise,
} from '../../engine/micro-entreprise';
import { ResultatMicro, ValidationError } from '../../engine/types';
import { JOURS_FACTURES_REFERENCE } from '../constants';
import { CalculatorForm, DEFAULT_FORM } from '../types';
import { buildBaseInputs, buildDirectInputs } from '../utils/calculatorInputs';
import { parseMontantSaisi } from '../utils/format';

const STORAGE_KEY = 'parametres-utilisateur';

export interface CalculatorState {
  form: CalculatorForm;
  result: ResultatMicro | null;
  error: ValidationError | null;
  caRequis: number | null;
  tjmRequis: number | null;
}

export interface CalculatorActions {
  setFormField: <K extends keyof CalculatorForm>(
    field: K,
    value: CalculatorForm[K]
  ) => void;
  resetForm: () => void;
}

export function useCalculator(initialForm?: Partial<CalculatorForm>): CalculatorState & CalculatorActions {
  const [form, setForm] = useState<CalculatorForm>({
    ...DEFAULT_FORM,
    ...initialForm,
  });
  const [result, setResult] = useState<ResultatMicro | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  const [caRequis, setCaRequis] = useState<number | null>(null);
  const [tjmRequis, setTjmRequis] = useState<number | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as CalculatorForm;
            setForm({ ...DEFAULT_FORM, ...parsed });
          } catch {
            // Ignore corrupted local data.
          }
        }
      })
      .finally(() => {
        hasLoadedRef.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(form)).catch(() => {
      // Local persistence is optional.
    });
  }, [form]);

  const setFormField = useCallback(
    <K extends keyof CalculatorForm>(field: K, value: CalculatorForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(DEFAULT_FORM);
  }, []);

  useEffect(() => {
    try {
      const inputs = buildDirectInputs(form, parseMontantSaisi(form.caAnnuelHT));
      const newResult = calculerMicroEntreprise(inputs);
      setResult(newResult);
      setError(null);
    } catch (err) {
      setResult(null);
      if (err instanceof ValidationError) {
        setError(err);
      } else {
        setError(null);
      }
    }
  }, [form]);

  useEffect(() => {
    const objectifMensuel = parseMontantSaisi(form.objectifNetMensuel);
    if (objectifMensuel === null || objectifMensuel <= 0) {
      setCaRequis(null);
      setTjmRequis(null);
      return;
    }

    try {
      const baseInputs = buildBaseInputs(form);
      const objectifAnnuel = objectifMensuel * 12;
      const { caRequis: ca, tjm } = calculerCARequis(
        objectifAnnuel,
        baseInputs,
        JOURS_FACTURES_REFERENCE
      );
      setCaRequis(ca);
      setTjmRequis(tjm);
    } catch {
      setCaRequis(null);
      setTjmRequis(null);
    }
  }, [form]);

  return useMemo(
    () => ({
      form,
      result,
      error,
      caRequis,
      tjmRequis,
      setFormField,
      resetForm,
    }),
    [form, result, error, caRequis, tjmRequis, setFormField, resetForm]
  );
}
