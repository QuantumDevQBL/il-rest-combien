import {
  DECOTE_IR_FORFAIT_CELIBATAIRE,
  DECOTE_IR_FORFAIT_COUPLE,
  DECOTE_IR_SEUIL_CELIBATAIRE,
  DECOTE_IR_SEUIL_COUPLE,
  DECOTE_IR_TAUX,
  PLAFOND_QUOTIENT_FAMILIAL_DEMI_PART,
  TRANCHES_IR,
} from '../data/baremes-2026';
import { SituationFamiliale } from './types';
import { arrondiEuro } from './arrondi';

function calculerIRBrut(revenuImposable: number, nbParts: number): number {
  if (revenuImposable <= 0 || nbParts <= 0) {
    return 0;
  }

  const quotient = revenuImposable / nbParts;
  let irParPart = 0;
  let seuilPrecedent = 0;

  for (const tranche of TRANCHES_IR) {
    const limite = tranche.limite ?? Infinity;
    if (quotient <= seuilPrecedent) {
      break;
    }
    const base = Math.min(quotient, limite) - seuilPrecedent;
    if (base > 0) {
      irParPart += base * tranche.taux;
    }
    seuilPrecedent = limite;
  }

  return irParPart * nbParts;
}

function plafonnerQuotientFamilial(
  irBrut: number,
  revenuImposable: number,
  nbParts: number,
  partsBase: number
): number {
  const demiPartsSupp = (nbParts - partsBase) / 0.5;
  if (demiPartsSupp <= 0) {
    return irBrut;
  }

  const irSansAvantage = calculerIRBrut(revenuImposable, partsBase);
  const avantageQF = irSansAvantage - irBrut;
  const avantageMax = demiPartsSupp * PLAFOND_QUOTIENT_FAMILIAL_DEMI_PART;

  if (avantageQF > avantageMax) {
    return irSansAvantage - avantageMax;
  }
  return irBrut;
}

function appliquerDecote(
  ir: number,
  situationFamiliale: SituationFamiliale
): number {
  const seuil =
    situationFamiliale === 'couple'
      ? DECOTE_IR_SEUIL_COUPLE
      : DECOTE_IR_SEUIL_CELIBATAIRE;
  const forfait =
    situationFamiliale === 'couple'
      ? DECOTE_IR_FORFAIT_COUPLE
      : DECOTE_IR_FORFAIT_CELIBATAIRE;

  if (ir < seuil) {
    const decote = Math.max(0, forfait - DECOTE_IR_TAUX * ir);
    return Math.max(0, ir - decote);
  }

  return ir;
}

/**
 * Calcule l'impôt sur le revenu final pour un foyer.
 *
 * @param revenuImposable - Revenu imposable du foyer, en euros.
 * @param nbParts - Nombre de parts fiscales du foyer.
 * @param partsBase - Nombre de parts de base (1 ou 2).
 * @param situationFamiliale - 'celibataire' ou 'couple'.
 * @returns Impôt sur le revenu final, arrondi à l'euro.
 */
export function calculerIR(
  revenuImposable: number,
  nbParts: number,
  partsBase: number,
  situationFamiliale: SituationFamiliale
): number {
  const irBrut = calculerIRBrut(revenuImposable, nbParts);
  const irApresPlafonnement = plafonnerQuotientFamilial(
    irBrut,
    revenuImposable,
    nbParts,
    partsBase
  );
  const irFinal = appliquerDecote(irApresPlafonnement, situationFamiliale);
  return arrondiEuro(irFinal);
}
