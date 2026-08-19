# Moteur de calcul micro-entreprise — spécification v2

**Document unique. Source de vérité. Kimi code contre ce document, sans interprétation.**

Périmètre v1 : micro-entreprise uniquement. EURL et SASU hors périmètre.
Constantes : exclusivement importées depuis `src/data/baremes-2026.ts`. Aucune valeur en dur, aucune valeur inventée.

Stack : Expo managed + React Native + TypeScript strict.
Contraintes : zéro backend, zéro appel réseau, zéro tracking, 100 % offline.

---

## 0. Principe fondamental

En micro-entreprise, **l'assiette des cotisations sociales et de l'impôt est le chiffre d'affaires encaissé**, pas le bénéfice.

Les charges réelles ne sont déductibles nulle part. L'abattement forfaitaire est réputé les couvrir.

Les charges fixes saisies par l'utilisateur interviennent **uniquement à la dernière ligne**. Elles ne touchent ni les cotisations, ni l'assiette IR.

Toute implémentation qui soustrait les charges avant le calcul des cotisations ou de l'IR est fausse.

---

## 1. Entrées

| Champ | Type | Règle |
|---|---|---|
| `activite` | `'BIC_VENTE' \| 'BIC_PRESTATION' \| 'BNC' \| 'CIPAV'` | Détermine cotisations, CFP, abattement, taux VL |
| `modeSaisieCA` | `'DIRECT' \| 'TJM'` | Voir §2 |
| `caAnnuelHT` | `number \| null` | Requis si `modeSaisieCA === 'DIRECT'` |
| `tjm` | `number \| null` | Requis si `modeSaisieCA === 'TJM'` |
| `joursFactures` | `number \| null` | Requis si `modeSaisieCA === 'TJM'` |
| `chargesFixesAnnuelles` | `number` | Défaut 0. N'intervient qu'en §9 |
| `situationFamiliale` | `'celibataire' \| 'couple'` | |
| `nbEnfants` | `number` | Entier ≥ 0, défaut 0 |
| `parentIsole` | `boolean` | Défaut false. Voir §5 |
| `autresRevenusNetsImposablesFoyer` | `number` | Défaut 0. **Net imposable**, pas brut |
| `rfrN2Foyer` | `number \| null` | RFR du **foyer**, tel qu'il figure sur l'avis d'imposition |
| `nbPartsN2` | `number \| null` | Défaut : `nbParts` courant. Voir §7 |
| `moisDebutActivite` | `number \| null` | 1-12. Null = année pleine. Voir §11 |

**Règle d'ergonomie contraignante :** ne jamais demander à l'utilisateur une valeur qu'il devrait calculer lui-même. Le RFR par part, le nombre de parts et l'abattement sont dérivés en interne.

---

## 2. Étape 0 — Détermination du CA

```
si modeSaisieCA === 'TJM' :
    caAnnuelHT = tjm × joursFactures
sinon :
    caAnnuelHT = caAnnuelHT (saisi)
```

Le CA est **toujours hors taxes**, quelle que soit la méthode de saisie.

Point de vigilance UI : au-delà du seuil de franchise TVA, l'utilisateur facture avec TVA et son réflexe est de saisir du TTC. La TVA collectée est neutre (encaissée puis reversée) et n'entre jamais dans aucun calcul. Le libellé du champ doit porter « HT » explicitement.

---

## 3. Étape 1 — Prélèvements sociaux

```
cotisationsSociales      = caAnnuelHT × TAUX_COTISATIONS[activite]
cfp                      = caAnnuelHT × TAUX_CFP[activite]
totalPrelevementsSociaux = arrondiEuro(cotisationsSociales) + arrondiEuro(cfp)
```

Mapping :

| activite | cotisations | CFP | abattement | taux VL |
|---|---|---|---|---|
| `BIC_VENTE` | `COTISATIONS_MICRO_BIC_VENTE` | `CFP_VENTE` | `ABATTEMENT_MICRO_BIC_VENTE` | `VL_BIC_VENTE` |
| `BIC_PRESTATION` | `COTISATIONS_MICRO_BIC_PRESTATION` | `CFP_BIC_PRESTATION` | `ABATTEMENT_MICRO_BIC_PRESTATION` | `VL_BIC_PRESTATION` |
| `BNC` | `COTISATIONS_MICRO_BNC` | `CFP_BNC` | `ABATTEMENT_MICRO_BNC` | `VL_BNC` |
| `CIPAV` | `COTISATIONS_MICRO_CIPAV` | `CFP_BNC` | `ABATTEMENT_MICRO_BNC` | `VL_BNC` |

CIPAV : même traitement fiscal que le BNC, seul le taux de cotisations diffère.

**Règle absolue :** en micro, CA = 0 → cotisations = 0. Il n'existe **aucune cotisation minimale forfaitaire**, contrairement au régime TNS. Ne pas en inventer.

**ACRE hors périmètre v1.** Le dispositif change au 01/07/2026 et la constante correspondante est marquée `[CONTESTÉ]` dans `baremes-2026.ts`. Ne pas l'implémenter. Afficher dans l'UI : « ACRE non prise en compte ».

---

## 4. Étape 2 — Revenu imposable

```
revenuMicroAbattu    = caAnnuelHT × (1 − ABATTEMENT[activite])
revenuImposableFoyer = revenuMicroAbattu + autresRevenusNetsImposablesFoyer
```

L'abattement est forfaitaire et exclusif de toute déduction de frais réels.

---

## 5. Étape 3 — Nombre de parts

```
partsBase = situationFamiliale === 'couple' ? 2 : 1

partsEnfants = 0
pour i de 1 à nbEnfants :
    partsEnfants += (i <= 2) ? 0.5 : 1

partsParentIsole = (parentIsole && situationFamiliale === 'celibataire' && nbEnfants > 0) ? 1 : 0

nbParts = partsBase + partsEnfants + partsParentIsole
```

**Parent isolé (case T) :** un célibataire, divorcé ou veuf vivant seul avec au moins un enfant à charge bénéficie d'une part supplémentaire. L'omettre produit un résultat faux pour une part importante des utilisateurs.

**Hors périmètre v1, à afficher :** garde alternée (quarts de part), rattachement d'enfant majeur, demi-part invalidité, demi-part ancien combattant.

---

## 6. Étape 4 — Impôt sur le revenu (fonction isolée et réutilisable)

Cette fonction est appelée **plusieurs fois** avec des paramètres différents. L'isoler impérativement dans `src/engine/ir.ts`.

```
calculerIR(revenuImposable, nbParts, partsBase, situationFamiliale) :

  1. quotient = revenuImposable / nbParts
  2. irParPart = application marginale de TRANCHES_IR au quotient
  3. irBrut = irParPart × nbParts
  4. plafonnement du quotient familial (§6.1)
  5. décote (§6.2)
  6. arrondi à l'euro
  → retourne l'IR final
```

### 6.1 Plafonnement du quotient familial

```
irSansAvantage = barème appliqué avec partsBase uniquement
avantageQF     = irSansAvantage − irBrut
demiPartsSupp  = (nbParts − partsBase) / 0.5
avantageMax    = demiPartsSupp × PLAFOND_QF_DEMI_PART

si avantageQF > avantageMax :
    irApresPlafonnement = irSansAvantage − avantageMax
sinon :
    irApresPlafonnement = irBrut
```

**Ce qui est plafonné est l'avantage en euros, pas le nombre de parts.**

### 6.2 Décote

Appliquée **après** le plafonnement du QF, **avant** toute réduction ou crédit d'impôt.

```
seuil   = celibataire ? DECOTE_SEUIL_CELIBATAIRE   : DECOTE_SEUIL_COUPLE
forfait = celibataire ? DECOTE_FORFAIT_CELIBATAIRE : DECOTE_FORFAIT_COUPLE

si irApresPlafonnement < seuil :
    decote  = max(0, forfait − DECOTE_TAUX × irApresPlafonnement)
    irFinal = max(0, irApresPlafonnement − decote)
sinon :
    irFinal = irApresPlafonnement
```

L'IR ne peut jamais être négatif.

### 6.3 Arrondis — obligatoire

Sans cette règle, les tests de référence croisés (§14) ne passeront jamais.

```
arrondiEuro(x) = Math.round(x)   // à l'euro le plus proche
```

- Cotisations sociales et CFP : arrondies **séparément** à l'euro, puis additionnées
- IR : arrondi à l'euro en toute fin de `calculerIR()`, après décote
- Versement libératoire : arrondi à l'euro
- Aucun arrondi intermédiaire dans le calcul du barème par tranches

---

## 7. Étape 5 — Éligibilité au versement libératoire

```
partsPourRFR = nbPartsN2 ?? nbParts
rfrParPart   = rfrN2Foyer / partsPourRFR

estEligibleVL =
    rfrN2Foyer === null            → null   (inconnu)
    rfrParPart <= SEUIL_VL_RFR_2026 → true
    sinon                           → false
```

**`nbPartsN2` :** le RFR retenu est celui de N-2, apprécié avec le nombre de parts de **cette année-là**. Un enfant né depuis fausse le test. Champ optionnel, fallback sur `nbParts`.

**Ne pas inclure le dépassement du plafond micro dans ce test.** Dépasser le plafond ne fait pas perdre le VL immédiatement : la sortie du régime n'intervient qu'après **deux années civiles consécutives** de dépassement. Traiter en avertissement séparé (§10), pas en condition d'éligibilité.

Si `estEligibleVL === null`, l'UI affiche : « Renseigne ton revenu fiscal de référence pour comparer les deux options. »

---

## 8. Étape 6 — Comparaison barème / VL

**Piège principal. Ne pas simplifier en `min(a, b)`.**

Le VL ne remplace pas seulement l'impôt sur le revenu micro : il **sort ce revenu de l'assiette imposable du foyer**. Mais le revenu micro abattu reste retenu pour déterminer le **taux effectif** appliqué aux autres revenus (CGI art. 197 C).

### Scénario A — barème progressif

```
totalScenarioBareme = calculerIR(revenuImposableFoyer, nbParts, partsBase, situationFamiliale)
```

### Scénario B — versement libératoire

```
versementLiberatoire = arrondiEuro(caAnnuelHT × TAUX_VL[activite])

si autresRevenusNetsImposablesFoyer === 0 :
    impotAutresRevenus = 0
sinon :
    irTotalTheorique   = calculerIR(revenuImposableFoyer, nbParts, partsBase, situationFamiliale)
    tauxEffectif       = irTotalTheorique / revenuImposableFoyer
    impotAutresRevenus = arrondiEuro(autresRevenusNetsImposablesFoyer × tauxEffectif)

totalScenarioVL = versementLiberatoire + impotAutresRevenus
```

**Point d'ambiguïté à documenter dans le code :** `irTotalTheorique` est ici pris après décote. L'administration calcule le taux effectif sur l'impôt résultant du barème ; l'ordre exact d'application de la décote dans ce calcul mérite vérification si tu vises l'exactitude au centime. Laisser un commentaire `// TODO vérifier ordre décote / taux effectif` plutôt que trancher silencieusement.

### Comparaison

```
si estEligibleVL === true :
    scenarioLePlusFavorable = totalScenarioVL < totalScenarioBareme ? 'VL' : 'BAREME'
    ecartEuros = abs(totalScenarioBareme − totalScenarioVL)
sinon :
    scenarioLePlusFavorable = 'BAREME'
    ecartEuros = null
```

**Nommage imposé :** `scenarioLePlusFavorable`, jamais `regimeChoisi`. `totalScenarioBareme` / `totalScenarioVL`, jamais `impotOptimal`. L'app compare, elle ne recommande pas.

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

Si `autresRevenusNetsImposablesFoyer > 0`, l'impôt retenu porte sur le foyer entier. L'afficher explicitement, sinon le net disponible paraît anormalement bas.

### 9.1 Taux de prélèvement global

```
tauxPrelevementGlobal = (totalPrelevementsSociaux + impotRetenu) / caAnnuelHT
resteSurCent          = 100 × (1 − tauxPrelevementGlobal)
```

C'est la sortie la plus lisible : « sur 100 € facturés, il te reste X € ». À afficher en gros, avant le détail.

---

## 10. Étape 8 — Seuils franchis (sorties informatives)

Deux mécaniques **distinctes**. Ne jamais les confondre, ni dans le code ni dans l'UI.

```
// Régime micro — détermine si on reste micro-entrepreneur
depassePlafondMicro = caAnnuelHT > PLAFOND_MICRO[activite].plafond

// Franchise TVA — détermine si on doit facturer la TVA
seuilsTVA = activite === 'BIC_VENTE' ? TVA_FRANCHISE_VENTE : TVA_FRANCHISE_PRESTATION
depasseSeuilBaseTVA   = caAnnuelHT > seuilsTVA.seuilBase
depasseSeuilMajoreTVA = caAnnuelHT > seuilsTVA.seuilMajore
```

Messages UI :
- seuil de base dépassé → TVA due à compter du 1er janvier suivant
- seuil majoré dépassé → TVA due dès le 1er jour du mois de dépassement
- plafond micro dépassé → sortie du régime après **deux** années consécutives, pas immédiatement

---

## 11. Étape 9 — Prorata année 1 (sortie informative uniquement)

```
si moisDebutActivite !== null :
    joursActivite   = jours entre le 1er du mois de début et le 31/12
    plafondProratise = PLAFOND_MICRO[activite].plafond × (joursActivite / 365)
    seuilTVAProratise = seuilsTVA.seuilBase × (joursActivite / 365)
```

**N'entre pas dans le calcul principal.** Affiché comme information : « Première année, ton plafond est ramené à X € ». Le prorata s'applique aussi aux seuils de TVA.

---

## 12. Calcul inverse — « quel CA pour atteindre X € net ? »

Fonction séparée, `src/engine/inverse.ts`. C'est la question que se pose réellement un freelance.

```
calculerCARequis(netVise, autresParametres) :
    recherche par dichotomie sur caAnnuelHT
    borne basse = netVise
    borne haute = netVise × 3
    critère d'arrêt : |net calculé − netVise| < 1 €, ou 40 itérations
    → retourne le CA requis, et le TJM correspondant si joursFactures fourni
```

La fonction directe étant monotone croissante, la dichotomie converge toujours. Ne pas tenter de formule fermée : la décote et le plafonnement du QF la rendent non inversible analytiquement.

---

## 13. Validation des entrées

Rejeter avec une erreur typée (`ValidationError` avec un champ `champ` et un `message`) :

- `caAnnuelHT < 0` ou non fini
- `tjm < 0`, `joursFactures < 0` ou `> 366`
- `chargesFixesAnnuelles < 0`
- `nbEnfants < 0` ou non entier
- `autresRevenusNetsImposablesFoyer < 0`
- `rfrN2Foyer < 0`
- `nbPartsN2 <= 0`
- `moisDebutActivite` hors [1, 12]
- `modeSaisieCA === 'TJM'` sans `tjm` ou sans `joursFactures`
- `modeSaisieCA === 'DIRECT'` sans `caAnnuelHT`

`caAnnuelHT === 0` est **valide** → toutes les sorties à zéro.

**Activité mixte hors périmètre v1** (vente + prestation simultanées, avec plafond global et sous-plafond). Rejeter ou ne pas proposer l'option.

---

## 14. Tests attendus

### Unitaires

1. CA négatif → `ValidationError`
2. CA = 0 → toutes les sorties à zéro, aucune cotisation minimale
3. Mode TJM : `caAnnuelHT === tjm × joursFactures`
4. Cotisations BIC prestation = `arrondiEuro(CA × taux) + arrondiEuro(CA × cfp)`
5. Abattement BNC = 34 %
6. IR nul sous le seuil de la 1re tranche
7. Décote au voisinage du seuil : juste en dessous, juste au-dessus
8. Plafonnement QF déclenché et non déclenché
9. **Parent isolé : célibataire + 1 enfant + case T = 2 parts, contre 1,5 sans**
10. VL éligible / non éligible / `rfrN2Foyer` null → `estEligibleVL === null`
11. `nbPartsN2` différent de `nbParts` → change le résultat d'éligibilité
12. **Charges fixes : cotisations et IR strictement identiques avec et sans ; seul le net disponible change**
13. **`autresRevenusFoyer > 0` : `versementLiberatoire` inchangé, mais `totalScenarioVL` augmente** (taux effectif)
14. Dépassement plafond micro n'invalide pas `estEligibleVL`
15. Calcul inverse : `calculerCARequis(calculerNet(CA)) ≈ CA` à 1 € près

### Référence croisée — 4 cas figés

Valeurs à vérifier à la main avant écriture des tests. **Deux outils, deux passes** :
- cotisations et VL → simulateur auto-entrepreneur Urssaf
- IR barème → simulateur impots.gouv.fr

| Cas | Activité | CA | Situation | Enfants | Parent isolé | Autres revenus | RFR N-2 foyer |
|---|---|---|---|---|---|---|---|
| A | BNC | 50 000 € | célibataire | 0 | non | 0 | 25 000 € |
| B | BIC prestation | 35 000 € | couple | 1 | non | 30 000 € | 40 000 € |
| C | BIC vente | 80 000 € | célibataire | 0 | non | 0 | 35 000 € |
| D | BNC | 20 000 € | célibataire | 2 | **oui** | 0 | 15 000 € |

Le cas D teste spécifiquement le parent isolé et la décote. Le cas B teste le taux effectif.

---

## 15. Sorties du moteur

```typescript
interface ResultatMicro {
  // Chiffre d'affaires
  caAnnuelHT: number;

  // Prélèvements sociaux
  cotisationsSociales: number;
  cfp: number;
  totalPrelevementsSociaux: number;

  // Assiette fiscale
  revenuMicroAbattu: number;
  revenuImposableFoyer: number;
  nbParts: number;

  // Impôt — les deux scénarios, toujours
  totalScenarioBareme: number;
  versementLiberatoire: number | null;
  totalScenarioVL: number | null;
  estEligibleVL: boolean | null;
  scenarioLePlusFavorable: 'BAREME' | 'VL';
  ecartEuros: number | null;

  // Résultat
  impotRetenu: number;
  chargesFixesAnnuelles: number;
  revenuNetDisponible: number;
  tauxPrelevementGlobal: number;
  resteSurCent: number;

  // Alertes
  depassePlafondMicro: boolean;
  depasseSeuilBaseTVA: boolean;
  depasseSeuilMajoreTVA: boolean;

  // Prorata année 1 (informatif)
  plafondProratise: number | null;
  seuilTVAProratise: number | null;
}
```

---

## 16. Hypothèses à afficher dans l'UI

- Année pleine ; prorata année 1 en information seulement
- CFE non intégrée (montant communal, due à partir de la 2e année)
- ACRE non prise en compte
- Aucune réduction ni crédit d'impôt
- Autres revenus du foyer : **net imposable**, pas brut
- CA saisi **hors taxes**
- Activité unique (pas de mixte)
- Mention permanente : « Estimation indicative. Ne constitue pas un conseil fiscal ou comptable. »

---

## 17. Ordre d'implémentation

1. `arrondiEuro()` + `calculerIR()` isolée + ses tests (barème, plafonnement QF, décote, parent isolé)
2. Prélèvements sociaux + tests
3. Éligibilité VL + tests
4. Comparaison des deux scénarios + tests taux effectif
5. Net disponible, taux global, seuils
6. Calcul inverse + test de réciprocité
7. Cas de référence croisés

**Ne pas passer à l'étape suivante tant que les tests de l'étape courante ne passent pas.**

Livrer les **tests avant le code** dans chaque réponse, pour permettre la revue de la logique métier avant l'implémentation.
