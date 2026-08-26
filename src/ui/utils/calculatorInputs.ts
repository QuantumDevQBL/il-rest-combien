import { calculerMicroEntreprise } from '../../engine/micro-entreprise';
import {
  InputsMicroEntreprise,
  ResultatMicro,
  ValidationError,
} from '../../engine/types';
import { getActivityConfig } from '../mapping';
import { CalculatorForm } from '../types';
import { parseMontantSaisi } from './format';

function parseNombreEnfants(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
}

export function buildBaseInputs(
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

export function buildDirectInputs(
  form: CalculatorForm,
  annualRevenue: number | null
): InputsMicroEntreprise {
  return {
    ...buildBaseInputs(form),
    modeSaisieCA: 'DIRECT',
    caAnnuelHT: annualRevenue,
    tjm: null,
    joursFactures: null,
  };
}

export function calculateProjectedResult(
  form: CalculatorForm,
  annualRevenue: number | null
): ResultatMicro | null {
  if (annualRevenue === null || !Number.isFinite(annualRevenue) || annualRevenue < 0) {
    return null;
  }

  try {
    return calculerMicroEntreprise(buildDirectInputs(form, annualRevenue));
  } catch {
    return null;
  }
}
