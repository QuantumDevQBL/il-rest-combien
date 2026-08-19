import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculerCARequis,
  calculerMicroEntreprise,
} from '../../engine/micro-entreprise';
import {
  InputsMicroEntreprise,
  ResultatMicro,
  ValidationError,
} from '../../engine/types';
import { JOURS_FACTURES_REFERENCE } from '../constants';
import { getActivityConfig } from '../mapping';
import { CalculatorForm, DEFAULT_FORM } from '../types';
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

function parseNombreEnfants(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
}

/**
 * Construit les paramètres communs au moteur (hors mode de saisie du CA).
 * Peut lever une ValidationError si un champ autre que le CA est invalide.
 */
function buildBaseInputs(
  form: CalculatorForm
): Omit<
  InputsMicroEntreprise,
  'modeSaisieCA' | 'caAnnuelHT' | 'tjm' | 'joursFactures'
> {
  const { activite, natureActivite } = getActivityConfig(form.activity);

  const chargesFixes = parseMontantSaisi(form.chargesFixesAnnuelles);
  if (chargesFixes !== null && (chargesFixes < 0 || !Number.isFinite(chargesFixes))) {
    throw new ValidationError(
      'chargesFixesAnnuelles',
      'Les charges fixes doivent être positives ou nulles.'
    );
  }

  const autresRevenus = parseMontantSaisi(form.autresRevenus);
  if (autresRevenus !== null && (autresRevenus < 0 || !Number.isFinite(autresRevenus))) {
    throw new ValidationError(
      'autresRevenusNetsImposablesFoyer',
      'Les autres revenus du foyer doivent être positifs ou nuls.'
    );
  }

  const rfrN2 = parseMontantSaisi(form.rfrN2);
  if (rfrN2 !== null && (rfrN2 < 0 || !Number.isFinite(rfrN2))) {
    throw new ValidationError('rfrN2Foyer', 'Le RFR N-2 doit être positif ou nul.');
  }

  const partsFiscalesN2 = parseMontantSaisi(form.partsFiscalesN2);
  if (partsFiscalesN2 !== null && (partsFiscalesN2 <= 0 || !Number.isFinite(partsFiscalesN2))) {
    throw new ValidationError(
      'partsFiscalesN2',
      'Le nombre de parts fiscales N-2 doit être strictement positif.'
    );
  }

  return {
    activite,
    natureActivite,
    chargesFixesAnnuelles: chargesFixes ?? 0,
    situationFamiliale: form.situationFamiliale,
    nbEnfants: parseNombreEnfants(form.nbEnfants),
    parentIsole: form.parentIsole,
    autresRevenusNetsImposablesFoyer: autresRevenus ?? 0,
    rfrN2Foyer: rfrN2,
    partsFiscalesN2,
    moisDebutActivite: null,
  };
}

function formToInputs(form: CalculatorForm): InputsMicroEntreprise {
  const base = buildBaseInputs(form);
  const ca = parseMontantSaisi(form.caAnnuelHT);

  return {
    ...base,
    modeSaisieCA: 'DIRECT',
    caAnnuelHT: ca,
    tjm: null,
    joursFactures: null,
  };
}

export function useCalculator(): CalculatorState & CalculatorActions {
  const [form, setForm] = useState<CalculatorForm>(DEFAULT_FORM);
  const [result, setResult] = useState<ResultatMicro | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  const [caRequis, setCaRequis] = useState<number | null>(null);
  const [tjmRequis, setTjmRequis] = useState<number | null>(null);
  const hasLoadedRef = useRef(false);

  // Chargement depuis AsyncStorage au montage
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
            // Ignorer les données corrompues
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

  // Persistance à chaque changement de formulaire
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(form)).catch(() => {
      // Silencieux — la persistance est un confort, pas une obligation
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

  // Calcul principal
  useEffect(() => {
    try {
      const inputs = formToInputs(form);
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

  // Calcul inverse — indépendant de la validité du CA saisi
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
