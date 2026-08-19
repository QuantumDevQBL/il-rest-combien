# Règles de calcul — moteur micro-entreprise

**Source de vérité pour l'implémentation du moteur. Kimi code contre ce document.**

Périmètre v1 : micro-entreprise uniquement. EURL et SASU hors périmètre.
Constantes : exclusivement importées depuis `src/data/baremes-2026.ts`. Aucune valeur en dur.

---

## 1. Principe fondamental

En micro-entreprise, **l'assiette des cotisations sociales et de l'impôt est le chiffre d'affaires encaissé**, pas le bénéfice.

Conséquence : les charges réelles du freelance ne sont déductibles nulle part dans le calcul fiscal et social. L'abattement forfaitaire est réputé les couvrir.

Les charges fixes saisies par l'utilisateur interviennent **uniquement à la dernière ligne**, pour calculer ce qui lui reste réellement. Elles ne touchent ni les cotisations, ni l'assiette IR.

Toute implémentation qui soustrait les charges avant le calcul des cotisations ou de l'IR est fausse.

---

## 2. Entrées

| Champ | Type | Règle |
|---|---|---|
| `activite` | `'BIC_VENTE' \| 'BIC_PRESTATION' \| 'BNC' \| 'CIPAV'` | Détermine taux de cotisations, CFP, abattement, taux VL |
| `caAnnuelHT` | `number` | **HT.** Rejeter si < 0 |
| `chargesFixesAnnuelles` | `number` | Défaut 0. N'intervient qu'en étape 7 |
| `situationFamiliale` | `'celibataire' \| 'couple'` | |
| `nbEnfants` | `number` | Défaut 0 |
| `autresRevenusNetsImposablesFoyer` | `number` | Défaut 0. **Net imposable**, après abattement 10 % si salarié |
| `rfrN2Foyer` | `number \| null` | RFR du **foyer** tel qu'il figure sur l'avis d'imposition. Pas « par part » |

**Ne jamais demander à l'utilisateur une valeur qu'il doit calculer lui-même.** Le RFR par part est dérivé en interne.

---

## 3. Étape 1 — Prélèvements sociaux

```
cotisationsSociales = caAnnuelHT × TAUX_COTISATIONS[activite]
cfp                 = caAnnuelHT × TAUX_CFP[activite]
totalPrelevementsSociaux = cotisationsSociales + cfp
```

Mapping :

| activite | cotisations | CFP | abattement | taux VL |
|---|---|---|---|---|
| BIC_VENTE | `COTISATIONS_MICRO_BIC_VENTE` | `CFP_VENTE` | `ABATTEMENT_MICRO_BIC_VENTE` | `VERSEMENT_LIBERATOIRE_BIC_VENTE` |
| BIC_PRESTATION | `COTISATIONS_MICRO_BIC_PRESTATION` | `CFP_BIC_PRESTATION` | `ABATTEMENT_MICRO_BIC_PRESTATION` | `VERSEMENT_LIBERATOIRE_BIC_PRESTATION` |
| BNC | `COTISATIONS_MICRO_BNC` | `CFP_BNC` | `ABATTEMENT_MICRO_BNC` | `VERSEMENT_LIBERATOIRE_BNC` |
| CIPAV | `COTISATIONS_MICRO_CIPAV` | `CFP_BNC` | `ABATTEMENT_MICRO_BNC` | `VERSEMENT_LIBERATOIRE_BNC` |

CIPAV : même traitement fiscal que le BNC, seul le taux de cotisations diffère.

---

## 4. Étape 2 — Revenu imposable

```
revenuMicroAbattu = caAnnuelHT × (1 − ABATTEMENT[activite])
revenuImposableFoyer = revenuMicroAbattu + autresRevenusNetsImposablesFoyer
```

L'abattement est forfaitaire et ne se cumule avec aucune déduction de frais réels.

---

## 5. Étape 3 — Nombre de parts

```
partsBase = situationFamiliale === 'couple' ? 2 : 1
partsEnfants = les 2 premiers enfants → 0,5 chacun
               à partir du 3e         → 1 chacun
nbParts = partsBase + partsEnfants
```

---

## 6. Étape 4 — Impôt sur le revenu (fonction réutilisable)

Cette fonction est appelée **plusieurs fois** avec des paramètres différents. L'isoler.

```
calculerIR(revenuImposable, nbParts) :

  1. quotient = revenuImposable / nbParts
  2. irParPart = application de TRANCHES_IR au quotient, tranche par tranche
  3. irBrut = irParPart × nbParts
  4. plafonnement du quotient familial (voir 6.1)
  5. décote (voir 6.2)
  → retourne l'IR final
```

### 6.1 Plafonnement du quotient familial

Le plafonnement compare deux calculs :

```
irSansAvantage = calcul du barème avec partsBase uniquement (1 ou 2)
avantageQF = irSansAvantage − irBrut
demiPartsSupp = (nbParts − partsBase) / 0,5
avantageMax = demiPartsSupp × PLAFOND_QUOTIENT_FAMILIAL_DEMI_PART

si avantageQF > avantageMax :
    irApresPlafonnement = irSansAvantage − avantageMax
sinon :
    irApresPlafonnement = irBrut
```

**Ce qui est plafonné est l'avantage en euros, pas le nombre de parts.**

### 6.2 Décote

Appliquée **après** le plafonnement du QF, **avant** toute réduction ou crédit d'impôt.

```
seuil    = celibataire ? DECOTE_IR_SEUIL_CELIBATAIRE : DECOTE_IR_SEUIL_COUPLE
forfait  = celibataire ? DECOTE_IR_FORFAIT_CELIBATAIRE : DECOTE_IR_FORFAIT_COUPLE

si irApresPlafonnement < seuil :
    decote = max(0, forfait − DECOTE_IR_TAUX × irApresPlafonnement)
    irFinal = max(0, irApresPlafonnement − decote)
sinon :
    irFinal = irApresPlafonnement
```

L'IR ne peut jamais être négatif.

---

## 7. Étape 5 — Éligibilité au versement libératoire

Deux conditions cumulatives :

```
rfrParPart = rfrN2Foyer / nbParts
conditionRFR = rfrN2Foyer !== null && rfrParPart <= SEUIL_VERSEMENT_LIBERATOIRE_RFR_2026
conditionCA  = caAnnuelHT <= PLAFOND_MICRO[activite]

estEligibleVL = conditionRFR && conditionCA
```

Si `rfrN2Foyer` est null → `estEligibleVL = null` (inconnu, pas false). L'UI affiche « renseigne ton RFR pour comparer ».

Diviser le RFR du foyer par le nombre de parts est équivalent à la majoration légale de 50 % par demi-part.

---

## 8. Étape 6 — Comparaison barème / VL

**C'est ici que se trouve le piège principal. Ne pas simplifier.**

Le VL ne remplace pas seulement l'impôt sur le revenu micro : il **sort ce revenu de l'assiette imposable du foyer**. Mais le revenu micro abattu reste retenu pour déterminer le **taux effectif** appliqué aux autres revenus (CGI art. 197 C).

### Scénario A — barème progressif

```
impotScenarioBareme = calculerIR(revenuImposableFoyer, nbParts)
totalScenarioBareme = impotScenarioBareme
```

### Scénario B — versement libératoire

```
versementLiberatoire = caAnnuelHT × TAUX_VL[activite]

si autresRevenusNetsImposablesFoyer === 0 :
    impotAutresRevenus = 0
sinon :
    // règle du taux effectif
    irTotalTheorique = calculerIR(revenuImposableFoyer, nbParts)
    tauxEffectif = irTotalTheorique / revenuImposableFoyer
    impotAutresRevenus = autresRevenusNetsImposablesFoyer × tauxEffectif

totalScenarioVL = versementLiberatoire + impotAutresRevenus
```

### Comparaison

```
si estEligibleVL === true :
    scenarioLePlusFavorable = totalScenarioVL < totalScenarioBareme ? 'VL' : 'BAREME'
    ecartEuros = |totalScenarioBareme − totalScenarioVL|
sinon :
    scenarioLePlusFavorable = 'BAREME'  // seul disponible
```

**Nommage imposé :** `scenarioLePlusFavorable`, pas `regimeChoisi`. `totalScenarioBareme` / `totalScenarioVL`, pas `impotOptimal`. L'app compare, elle ne recommande pas.

---

## 9. Étape 7 — Revenu net disponible

```
impotRetenu = scenarioLePlusFavorable === 'VL' ? totalScenarioVL : totalScenarioBareme

revenuNetDisponible = caAnnuelHT
                    − totalPrelevementsSociaux
                    − impotRetenu
                    − chargesFixesAnnuelles
```

**Seul endroit où `chargesFixesAnnuelles` intervient.**

Note : si `autresRevenusNetsImposablesFoyer > 0`, l'impôt retenu porte sur le foyer entier, pas seulement sur l'activité freelance. L'afficher explicitement dans l'UI, sinon le net disponible paraît anormalement bas.

---

## 10. Étape 8 — Seuils franchis (sorties informatives)

Deux mécaniques **distinctes**. Ne jamais les confondre dans le code ni dans l'UI.

```
// Régime micro — détermine si on reste micro-entrepreneur
depassePlafondMicro = caAnnuelHT > PLAFOND_MICRO[activite]

// Franchise TVA — détermine si on doit facturer la TVA
seuilsTVA = activite === 'BIC_VENTE' ? TVA_FRANCHISE_BASE_VENTE : TVA_FRANCHISE_BASE_PRESTATION
depasseSeuilBaseTVA   = caAnnuelHT > seuilsTVA.seuilBase
depasseSeuilMajoreTVA = caAnnuelHT > seuilsTVA.seuilMajore
```

Messages UI :
- seuil de base dépassé → TVA due à partir du 1er janvier suivant
- seuil majoré dépassé → TVA due dès le 1er jour du mois de dépassement
- plafond micro dépassé → sortie du régime après **deux** années consécutives

---

## 11. Validation des entrées

Rejeter avec une erreur typée :
- `caAnnuelHT < 0`
- `chargesFixesAnnuelles < 0`
- `nbEnfants < 0` ou non entier
- `autresRevenusNetsImposablesFoyer < 0`
- `rfrN2Foyer < 0`

`caAnnuelHT === 0` est valide → tout à zéro.

---

## 12. Hypothèses à afficher dans l'UI

- Année pleine. Prorata année 1 affiché en information, pas intégré au calcul.
- CFE non intégrée (montant communal, due à partir de la 2e année).
- Aucune réduction ni crédit d'impôt pris en compte.
- Autres revenus du foyer : montant **net imposable**, pas brut.
- CA saisi **hors taxes**.
- Mention permanente : « Estimation indicative. Ne constitue pas un conseil fiscal ou comptable. »

---

## 13. Tests attendus

**Unitaires**
1. CA négatif → erreur
2. CA = 0 → toutes sorties à zéro
3. Cotisations BIC prestation = CA × (taux + CFP)
4. Abattement BNC = 34 %
5. IR nul sous le seuil de la 1re tranche
6. Décote au voisinage du seuil (juste en dessous / juste au-dessus)
7. Plafonnement QF déclenché et non déclenché
8. VL éligible / non éligible / RFR null
9. **Charges fixes : cotisations et IR strictement identiques avec et sans charges ; seul le net disponible change**
10. **Avec `autresRevenusFoyer > 0` : le montant du VL est inchangé, mais `totalScenarioVL` augmente** (taux effectif)

**Référence croisée** — 4 cas figés, valeurs vérifiées à la main :
- cotisations et VL → simulateur Urssaf (auto-entrepreneur)
- IR barème → simulateur impots.gouv.fr

Le simulateur Urssaf ne calcule pas l'IR. Deux outils, deux passes.

---

## 14. Ordre d'implémentation

1. `calculerIR()` isolée + ses tests (barème, plafonnement QF, décote)
2. Prélèvements sociaux + tests
3. Éligibilité VL + tests
4. Comparaison des deux scénarios + tests taux effectif
5. Net disponible + seuils
6. Cas de référence croisés

Ne pas passer à l'étape suivante tant que les tests de l'étape courante ne passent pas.
