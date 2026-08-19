/**
 * Barèmes et constantes réglementaires — millésime 2026 (France métropolitaine).
 *
 * Valeurs renseignées le 18/08/2026 à partir des sources officielles citées.
 *
 * ⚠️ SECTIONS 7 (TNS) ET 8 (SASU) : volontairement laissées à null.
 *    La structure d'origine (un taux unique par cotisation) ne correspond pas
 *    à la réalité réglementaire — voir les commentaires de ces sections.
 *
 * ⚠️ MAINTENANCE : ce fichier est daté. Les barèmes changent au 1er janvier.
 *    Prévoir une revue annuelle en janvier/février (la loi de finances est
 *    généralement promulguée en décembre, mais la LF 2026 ne l'a été que le
 *    19 février 2026).
 */

// =============================================================================
// Types
// =============================================================================

export interface TrancheIR {
  limite: number | null; // seuil supérieur de la tranche (null = dernière tranche)
  taux: number; // taux marginal, en décimal
}

/** Plafond du RÉGIME micro : détermine si on reste micro-entrepreneur. */
export interface PlafondRegimeMicro {
  plafond: number;
}

/** Seuils de FRANCHISE EN BASE de TVA : déterminent si on facture la TVA. */
export interface SeuilsFranchiseTVA {
  seuilBase: number;
  seuilMajore: number;
}

// -----------------------------------------------------------------------------
// NOTE SUR LA STRUCTURE D'ORIGINE
//
// Le squelette initial définissait un type unique `SeuilsMicro { plafond, alerte }`
// avec un commentaire « alerte = généralement 50 % du plafond ».
//
// Ce champ `alerte` n'a aucune existence réglementaire. Il a été supprimé.
//
// La confusion à éviter est ailleurs, et elle est la plus fréquente chez les
// micro-entrepreneurs : le plafond du RÉGIME micro (203 100 € / 83 600 €) et le
// seuil de FRANCHISE DE TVA (85 000 € / 37 500 €) sont deux mécaniques distinctes.
// On peut dépasser le second en restant micro-entrepreneur. D'où deux types séparés.
// -----------------------------------------------------------------------------

// =============================================================================
// 1. Micro-entreprise — cotisations sociales
// =============================================================================
// Taux globaux appliqués sur le CA encaissé (maladie, retraite, invalidité,
// allocations familiales, CSG-CRDS). La CFP s'y ajoute (section 1 bis).

/** Cotisations sociales BNC (libéral régime général) — en décimal. */
export const COTISATIONS_MICRO_BNC: number = 0.256; // source: urssaf.fr / service-public.fr — consulté le 18/08/2026
// Hausse au 1er janvier 2026 : passage de 24,6 % (2025) à 25,6 %.
// Dernière étape du calendrier de transfert vers la retraite complémentaire du régime général.

/** Cotisations sociales BIC vente de marchandises / hébergement — en décimal. */
export const COTISATIONS_MICRO_BIC_VENTE: number = 0.123; // source: urssaf.fr — consulté le 18/08/2026

/** Cotisations sociales BIC prestation de services — en décimal. */
export const COTISATIONS_MICRO_BIC_PRESTATION: number = 0.212; // source: urssaf.fr — consulté le 18/08/2026

/** Cotisations sociales professions libérales réglementées CIPAV — en décimal. */
export const COTISATIONS_MICRO_CIPAV: number = 0.232; // source: urssaf.fr — consulté le 18/08/2026

// =============================================================================
// 1 bis. Contribution à la formation professionnelle (CFP)
// =============================================================================
// La CFP dépend de la NATURE de l'activité, pas de la catégorie fiscale.
// Nature commerciale : 0,1 % — source: urssaf.fr
// Nature libérale : 0,2 % — source: urssaf.fr
// Nature artisanale : 0,3 % — source: urssaf.fr

export const CFP_COMMERCIALE: number = 0.001; // source: urssaf.fr — consulté le 18/08/2026
export const CFP_LIBERALE: number = 0.002; // source: urssaf.fr — consulté le 18/08/2026
export const CFP_ARTISANALE: number = 0.003; // source: urssaf.fr — consulté le 18/08/2026

// =============================================================================
// 2. Micro-entreprise — abattements forfaitaires (assiette IR)
// =============================================================================

export const ABATTEMENT_MICRO_BNC: number = 0.34; // source: BOFiP / service-public.fr — consulté le 18/08/2026
export const ABATTEMENT_MICRO_BIC_VENTE: number = 0.71; // source: BOFiP / service-public.fr — consulté le 18/08/2026
export const ABATTEMENT_MICRO_BIC_PRESTATION: number = 0.5; // source: BOFiP / service-public.fr — consulté le 18/08/2026

// Abattement minimum de 305 € : à vérifier dans le CGI art. 50-0 si le moteur
// doit gérer les très petits CA.
export const ABATTEMENT_MICRO_MINIMUM: number | null = null; // À VÉRIFIER — source:  — consulté le

// =============================================================================
// 3. Micro-entreprise — plafonds de chiffre d'affaires du RÉGIME
// =============================================================================
// Plafonds révisés au 1er janvier 2026 (révision triennale, applicable 2026-2028).
// Anciennes valeurs : 188 700 € et 77 700 €.

export const PLAFOND_MICRO_BIC_VENTE: PlafondRegimeMicro = {
  plafond: 203100, // source: urssaf.fr / service-public.fr — consulté le 18/08/2026
};

export const PLAFOND_MICRO_BIC_PRESTATION: PlafondRegimeMicro = {
  plafond: 83600, // source: urssaf.fr / service-public.fr — consulté le 18/08/2026
};

export const PLAFOND_MICRO_BNC: PlafondRegimeMicro = {
  plafond: 83600, // source: urssaf.fr / service-public.fr — consulté le 18/08/2026
};

/**
 * Règle de sortie du régime : le dépassement une seule année est toléré (on
 * reste micro l'année suivante). La sortie intervient au 1er janvier suivant
 * DEUX années civiles consécutives de dépassement.
 *
 * Première année d'activité : plafond proratisé — plafond × (jours d'activité / 365).
 * Le prorata s'applique aussi aux seuils de TVA.
 */
export const ANNEES_DEPASSEMENT_AVANT_SORTIE: number = 2; // source: service-public.fr — consulté le 18/08/2026

// =============================================================================
// 4. Versement libératoire de l'impôt sur le revenu
// =============================================================================

export const VERSEMENT_LIBERATOIRE_BIC_VENTE: number = 0.01; // source: service-public.fr / urssaf.fr — consulté le 18/08/2026
export const VERSEMENT_LIBERATOIRE_BIC_PRESTATION: number = 0.017; // source: service-public.fr / urssaf.fr — consulté le 18/08/2026
export const VERSEMENT_LIBERATOIRE_BNC: number = 0.022; // source: service-public.fr / urssaf.fr — consulté le 18/08/2026

/**
 * Seuil de RFR par part de quotient familial ouvrant droit à l'option.
 *
 * ⚠️ PIÈGE : le RFR retenu est celui de l'année N-2, et le seuil correspond à
 * la limite supérieure de la 2e tranche du barème de l'année N-1. Il est donc
 * DÉCALÉ par rapport au barème IR de la section 5.
 *
 * Pour une option applicable en 2026 → RFR 2024 ≤ 29 315 € par part.
 * Pour une option applicable en 2027 → RFR 2025 ≤ 29 579 € par part.
 *
 * Le seuil est majoré de 50 % par demi-part supplémentaire.
 * L'option se demande à l'Urssaf au plus tard le 30 septembre pour l'année suivante.
 */
export const SEUIL_VERSEMENT_LIBERATOIRE_RFR_2026: number = 29315; // source: service-public.fr — consulté le 18/08/2026
export const SEUIL_VERSEMENT_LIBERATOIRE_RFR_2027: number = 29579; // source: service-public.fr — consulté le 18/08/2026
export const MAJORATION_SEUIL_VL_PAR_DEMI_PART: number = 0.5; // source: service-public.fr — consulté le 18/08/2026

// =============================================================================
// 5. Impôt sur le revenu — barème 2026 (revenus 2025)
// =============================================================================
// Barème fixé par la loi de finances pour 2026 (loi n° 2026-103 du 19 février 2026).
// Indexation sur l'inflation : + 0,9 %.
// Seuils exprimés PAR PART de quotient familial.

export const TRANCHES_IR: readonly TrancheIR[] = [
  { limite: 11600, taux: 0.0 }, // source: service-public.gouv.fr — consulté le 18/08/2026
  { limite: 29579, taux: 0.11 }, // source: service-public.gouv.fr — consulté le 18/08/2026
  { limite: 84577, taux: 0.3 }, // source: service-public.gouv.fr — consulté le 18/08/2026
  { limite: 181917, taux: 0.41 }, // source: service-public.gouv.fr — consulté le 18/08/2026
  { limite: null, taux: 0.45 }, // source: service-public.gouv.fr — consulté le 18/08/2026
];

/**
 * Décote (CGI art. 197).
 * Formule : décote = somme forfaitaire − (45,25 % × impôt brut).
 * Elle ne s'applique que si l'impôt brut est inférieur au seuil de déclenchement.
 *
 * ⚠️ Beaucoup de sites secondaires publient encore 889 € / 1 470 € : ce sont les
 * valeurs 2025. Les valeurs ci-dessous sont celles publiées par economie.gouv.fr
 * pour l'imposition 2026 des revenus 2025.
 */
export const DECOTE_IR_FORFAIT_CELIBATAIRE: number = 897; // source: economie.gouv.fr — consulté le 18/08/2026
export const DECOTE_IR_FORFAIT_COUPLE: number = 1483; // source: economie.gouv.fr — consulté le 18/08/2026
export const DECOTE_IR_TAUX: number = 0.4525; // source: economie.gouv.fr — consulté le 18/08/2026

/** Seuils d'impôt brut en dessous desquels la décote s'applique. */
export const DECOTE_IR_SEUIL_CELIBATAIRE: number = 1982; // source: economie.gouv.fr — consulté le 18/08/2026
export const DECOTE_IR_SEUIL_COUPLE: number = 3277; // source: economie.gouv.fr — consulté le 18/08/2026

/**
 * Plafonnement des effets du quotient familial.
 * ⚠️ Le squelette d'origine demandait un « nombre maximal de parts fiscales » —
 * cette notion n'existe pas. Ce qui est plafonné, c'est l'AVANTAGE EN EUROS
 * procuré par chaque demi-part supplémentaire.
 */
export const PLAFOND_QUOTIENT_FAMILIAL_DEMI_PART: number = 1807; // source: economie.gouv.fr — consulté le 18/08/2026
export const PLAFOND_QUOTIENT_FAMILIAL_QUART_PART: number = 904; // source: economie.gouv.fr — consulté le 18/08/2026

// =============================================================================
// 6. Impôt sur les sociétés
// =============================================================================

export const TAUX_IS_NORMAL: number = 0.25; // source: service-public.fr / CGI art. 219 — consulté le 18/08/2026
export const TAUX_IS_REDUIT: number = 0.15; // source: service-public.fr / CGI art. 219 — consulté le 18/08/2026

/** Fraction de bénéfice imposable au taux réduit. */
export const SEUIL_IS_REDUIT: number = 42500; // source: CGI art. 219 — consulté le 18/08/2026
// Un amendement au PLF 2026 proposait de porter ce seuil à 100 000 € : NON retenu
// dans la loi de finances promulguée. Le seuil reste à 42 500 €.

/**
 * Conditions cumulatives d'accès au taux réduit (à implémenter côté moteur) :
 *  - CA ≤ 10 M€
 *  - capital entièrement libéré
 *  - capital détenu à ≥ 75 % par des personnes physiques
 */
export const SEUIL_CA_IS_REDUIT: number = 10000000; // source: CGI art. 219 — consulté le 18/08/2026
export const SEUIL_DETENTION_PERSONNES_PHYSIQUES: number = 0.75; // source: CGI art. 219 — consulté le 18/08/2026

// =============================================================================
// 7. EURL / Travailleur non salarié (TNS)  —  NON RENSEIGNÉ, VOIR CI-DESSOUS
// =============================================================================
/**
 * ⚠️ LA STRUCTURE D'ORIGINE EST INEXPLOITABLE EN L'ÉTAT.
 *
 * Le squelette prévoyait un taux unique par cotisation (`TNS_COTISATION_MALADIE_TAUX:
 * number`). Ça ne correspond à aucune réalité réglementaire :
 *
 *  - Maladie-maternité : taux PROGRESSIF selon le revenu (nul en bas de barème,
 *    croissant par paliers exprimés en fraction de PASS).
 *  - Retraite de base : taux plein sous plafond + taux réduit déplafonné au-delà.
 *  - Retraite complémentaire : par TRANCHES de revenu, avec des taux distincts.
 *  - CSG/CRDS : assiette spécifique (revenu + cotisations réintégrées), pas le
 *    revenu net.
 *  - Allocations familiales : taux progressif de 0 % à un taux plein selon le revenu.
 *
 * Remplir des `number` uniques ici produirait une app qui calcule faux avec l'air
 * d'avoir raison — exactement ce qu'on cherche à éviter.
 *
 * CE QU'IL FAUT FAIRE :
 *   1. Remplacer chaque constante par un barème de type
 *      `{ seuilBas: number, seuilHaut: number | null, taux: number }[]`
 *      exprimé en fraction de PASS.
 *   2. Récupérer les barèmes sur urssaf.fr, rubrique « travailleurs indépendants ».
 *   3. Croiser avec le simulateur officiel Urssaf pour valider le moteur sur 3 ou 4
 *      cas de revenu.
 *
 * En attendant, ces constantes restent à null et le moteur ne doit PAS exposer
 * le statut EURL dans l'UI.
 */
export const TNS_BAREMES_A_STRUCTURER: null = null;

/** ACRE : le dispositif a changé au 1er juillet 2026 — à vérifier avant implémentation. */
export const ACRE_TAUX_EXONERATION_AVANT_01072026: number = 0.5; // source: urssaf.fr — consulté le 18/08/2026
export const ACRE_TAUX_EXONERATION_APRES_01072026: number = 0.25; // source: urssaf.fr — À CONFIRMER, sources divergentes (25 % ou 75 %) — consulté le 18/08/2026
// ⚠️ Deux sources donnent des valeurs contradictoires pour l'ACRE post-01/07/2026.
//    Ne pas implémenter l'ACRE sans avoir tranché sur urssaf.fr directement.

// =============================================================================
// 8. SASU / Président assimilé salarié  —  NON RENSEIGNÉ, VOIR CI-DESSOUS
// =============================================================================
/**
 * ⚠️ CERTAINES DE CES CONSTANTES N'ONT PAS DE VALEUR UNIVERSELLE.
 *
 *  - AT/MP : taux propre à chaque entreprise, notifié par la CARSAT selon le code
 *    risque et la sinistralité. Il n'existe pas de « taux AT/MP français ».
 *  - Prévoyance : dépend de la convention collective applicable et du contrat souscrit.
 *  - Formation professionnelle : dépend de l'effectif.
 *  - Retraite complémentaire Agirc-Arrco : par tranches (T1 sous PASS, T2 de 1 à 8
 *    PASS), avec taux d'appel — pas un taux unique.
 *  - Chômage : le président de SASU n'est PAS affilié à l'assurance chômage. La
 *    constante `EMPLOYEUR_COTISATION_CHOMAGE_TAUX` n'a pas lieu d'être ici.
 *
 * CE QU'IL FAUT FAIRE :
 *   Soit tu factorises avec un taux global de charges paramétrable par l'utilisateur
 *   (approche honnête : « environ X % du brut, ajustable »), soit tu implémentes le
 *   détail Agirc-Arrco par tranches. La première option est largement suffisante
 *   pour un calculateur d'ordre de grandeur, et beaucoup plus défendable.
 */
export const SASU_BAREMES_A_STRUCTURER: null = null;

/** Plafond annuel de la Sécurité sociale — celui-ci est bien une valeur unique. */
export const PASS: number = 48060; // source: urssaf.fr, arrêté du 22/12/2025 (JO 23/12/2025) — consulté le 18/08/2026
export const PMSS: number = 4005; // source: urssaf.fr, arrêté du 22/12/2025 — consulté le 18/08/2026

// =============================================================================
// 9. TVA
// =============================================================================
/**
 * Seuils de franchise en base — INCHANGÉS en 2026.
 *
 * Contexte à connaître : la loi de finances 2025 avait introduit un seuil unique
 * à 25 000 €. Cette réforme a été suspendue, puis définitivement supprimée par la
 * loi du 3 novembre 2025, puis écartée du PLF 2026. Beaucoup d'articles en ligne
 * relaient encore des seuils qui n'existent pas.
 *
 * Dépassement du seuil de base : la franchise est conservée jusqu'à la fin de
 * l'année. Dépassement du seuil MAJORÉ : TVA due dès le 1er jour du mois de
 * dépassement.
 */
export const TVA_FRANCHISE_BASE_VENTE: SeuilsFranchiseTVA = {
  seuilBase: 85000, // source: service-public.fr (fiche vérifiée 01/01/2026) — consulté le 18/08/2026
  seuilMajore: 93500, // source: service-public.fr — consulté le 18/08/2026
};

/** Prestations de services — s'applique aux BIC prestation ET aux BNC. */
export const TVA_FRANCHISE_BASE_PRESTATION: SeuilsFranchiseTVA = {
  seuilBase: 37500, // source: service-public.fr — consulté le 18/08/2026
  seuilMajore: 41250, // source: service-public.fr — consulté le 18/08/2026
};

/**
 * Taux de TVA.
 * ⚠️ NON VÉRIFIÉS PAR RECHERCHE — valeurs stables depuis janvier 2014.
 *    À confirmer sur impots.gouv.fr avant mise en production.
 */
export const TVA_TAUX_NORMAL: number = 0.2; // À CONFIRMER — source:  — consulté le
export const TVA_TAUX_INTERMEDIAIRE: number = 0.1; // À CONFIRMER — source:  — consulté le
export const TVA_TAUX_REDUIT: number = 0.055; // À CONFIRMER — source:  — consulté le
export const TVA_TAUX_PARTICULIER: number = 0.021; // À CONFIRMER — source:  — consulté le

// =============================================================================
// 10. Point de vigilance hors périmètre du squelette
// =============================================================================
/**
 * FLAT TAX / PFU sur les dividendes (pertinent si tu implémentes la SASU) :
 * une source secondaire évoque un passage des prélèvements sociaux de 17,2 % à
 * 18,6 %, portant le PFU de 30 % à 31,4 %. NON CONFIRMÉ par une source officielle.
 * À trancher sur impots.gouv.fr avant toute implémentation.
 *
 * CFE : due par la plupart des micro-entrepreneurs à partir de la 2e année, montant
 * fixé par la commune. Impossible à encoder en dur, mais son absence du calcul est
 * une source d'écart importante pour l'utilisateur. À mentionner dans l'UI.
 */
