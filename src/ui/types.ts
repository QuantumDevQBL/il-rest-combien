import { ActivityChoice } from './mapping';

export interface CalculatorForm {
  label: string;
  activity: ActivityChoice;
  caAnnuelHT: string;
  chargesFixesAnnuelles: string;
  situationFamiliale: 'celibataire' | 'couple';
  nbEnfants: string;
  parentIsole: boolean;
  autresRevenus: string;
  rfrN2: string;
  partsFiscalesN2: string;
  objectifNetMensuel: string;
}

export const DEFAULT_FORM: CalculatorForm = {
  label: '',
  activity: 'PROFESSION_LIBERALE',
  caAnnuelHT: '',
  chargesFixesAnnuelles: '',
  situationFamiliale: 'celibataire',
  nbEnfants: '0',
  parentIsole: false,
  autresRevenus: '',
  rfrN2: '',
  partsFiscalesN2: '1',
  objectifNetMensuel: '',
};
