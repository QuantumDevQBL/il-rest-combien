# Spécification UI — calculateur micro-entreprise

**À lire après `moteur-micro-entreprise-v2.md`. L'UI n'implémente aucune logique de calcul : elle appelle le moteur.**

Stack : React Native / Expo, composants natifs uniquement. Aucune librairie UI tierce.

---

## Direction visuelle

Le sujet, c'est l'argent que tu ne verras jamais : la part du CA qui part avant d'arriver sur ton compte. L'univers visuel de référence n'est pas l'app fintech, c'est **le relevé** — avis d'imposition, échéancier URSSAF, décompte. Des chiffres alignés, une colonne qui descend, un solde en bas.

L'app assume cette froideur documentaire au lieu de la maquiller en tableau de bord coloré. Une seule chose est chaude : le résultat.

### Tokens

```typescript
export const couleurs = {
  encre:       '#16181D',  // texte principal, fond des blocs de résultat
  encreFaible: '#5A6070',  // labels, mentions
  papier:      '#FBFAF7',  // fond d'écran
  ligne:       '#E3E1DB',  // séparateurs, bordures de champs
  ponction:    '#8B3A2F',  // ce qui est prélevé — cotisations, impôt
  reste:       '#1F6B4A',  // ce qui reste — net disponible
  alerte:      '#A8741A',  // seuils franchis
};
```

Le rouge et le vert ne sont pas décoratifs : ils encodent la seule distinction qui compte dans l'app — ce qui part et ce qui reste. Ils ne servent à rien d'autre. Aucun autre accent, aucun dégradé.

### Typographie

Trois rôles, polices système pour rester offline sans assets :

| Rôle | Famille | Usage |
|---|---|---|
| Chiffres | `monospace` (Roboto Mono sur Android) | **Tous** les montants, sans exception |
| Texte | `System` | Labels, explications, mentions |
| Accent | `System`, poids 700, `letterSpacing: 1.5`, majuscules | Eyebrows de section |

Le monospace sur les montants n'est pas un effet de style : il aligne les chiffres en colonne, ce qui rend la lecture d'un décompte possible. C'est la raison d'être du choix.

Échelle :

```typescript
export const type = {
  compteur:  { fontSize: 56, fontFamily: 'monospace', fontWeight: '300' },
  montant:   { fontSize: 17, fontFamily: 'monospace' },
  titre:     { fontSize: 20, fontWeight: '600' },
  corps:     { fontSize: 15 },
  label:     { fontSize: 13, color: couleurs.encreFaible },
  eyebrow:   { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  mention:   { fontSize: 11, color: couleurs.encreFaible, lineHeight: 16 },
};
```

Espacement sur une base de 4 : `4, 8, 12, 16, 24, 32, 48`.

---

## Élément signature — le compteur

En haut de la zone résultat, sur fond `encre`, un seul chiffre en très grand :

```
┌────────────────────────────────────────┐
│  SUR 100 € FACTURÉS                    │
│                                        │
│         54,20 €                        │
│         dans ta poche                  │
│                                        │
│  ────────────────────────────────      │
│  45,80 € de cotisations et d'impôt     │
└────────────────────────────────────────┘
```

C'est `resteSurCent` du moteur. C'est le chiffre que l'utilisateur retient, cite, et éventuellement partage.

Animation au recalcul : interpolation du nombre sur 400 ms, `Easing.out(Easing.cubic)`. Une seule animation dans toute l'app. Respecter `AccessibilityInfo.isReduceMotionEnabled()` — si actif, transition immédiate.

Ne pas ajouter de camembert, de barre de progression ou de jauge. Le chiffre suffit.

---

## Écran unique — structure

Un seul `ScrollView`. Pas de navigation, pas d'onglets, pas de menu.

```
┌────────────────────────────────────────┐
│  Ce qu'il te reste vraiment            │  titre
│  Micro-entreprise · barèmes 2026       │  label
├────────────────────────────────────────┤
│                                        │
│  [ COMPTEUR ]                          │  fond encre
│                                        │
├────────────────────────────────────────┤
│  TON ACTIVITÉ                          │  eyebrow
│  ┌──────────────────────────────────┐  │
│  │ Type d'activité      [sélecteur] │  │
│  │ Chiffre d'affaires HT  [ 50 000 ]│  │
│  │   ○ Montant annuel  ○ TJM × jours│  │
│  │ Charges fixes / an     [  3 000 ]│  │
│  └──────────────────────────────────┘  │
│                                        │
│  TON FOYER                             │  eyebrow
│  ┌──────────────────────────────────┐  │
│  │ Situation          [Seul·e ▾]    │  │
│  │ Enfants à charge      [   0   ]  │  │
│  │ □ Je vis seul·e avec mes enfants │  │
│  │ Autres revenus du foyer [   0  ] │  │
│  └──────────────────────────────────┘  │
│                                        │
│  IMPÔT — DEUX OPTIONS         [déplier]│  eyebrow + toggle
│  ┌──────────────────────────────────┐  │
│  │ Revenu fiscal de référence       │  │
│  │ (avis d'imposition 2025) [     ] │  │
│  └──────────────────────────────────┘  │
│                                        │
├────────────────────────────────────────┤
│  LE DÉCOMPTE                           │  eyebrow
│                                        │
│  Chiffre d'affaires        50 000 €    │
│  ─────────────────────────────────     │
│  Cotisations sociales     −12 800 €    │  ponction
│  Formation pro                −100 €    │  ponction
│  Impôt sur le revenu       −2 940 €    │  ponction
│  Charges fixes             −3 000 €    │  ponction
│  ═════════════════════════════════     │
│  Il te reste               31 160 €    │  reste, gras
│                                        │
├────────────────────────────────────────┤
│  [ Comparaison barème / VL ]           │  si RFR renseigné
│  [ Alertes de seuils ]                 │  si franchis
│  [ Ce qui n'est pas compté ]           │  repliable
│  [ Mention légale permanente ]         │
└────────────────────────────────────────┘
```

---

## Règles de comportement

**Recalcul en temps réel.** À chaque frappe. Le moteur est synchrone et instantané, aucun debounce nécessaire.

**Aucun champ obligatoire sauf le CA.** Tout le reste a un défaut valide. L'app doit donner un résultat dès la première saisie.

**Clavier numérique** (`keyboardType="numeric"`) sur tous les champs de montant. Formatage avec séparateur de milliers à la perte de focus, pas pendant la frappe.

**Le RFR est optionnel et replié par défaut.** Tant qu'il est vide, afficher : « Renseigne ton revenu fiscal de référence pour comparer les deux options d'imposition. » Ne pas bloquer, ne pas alerter.

**Le décompte est toujours visible en entier.** Aucun poste masqué. C'est le cœur de l'app : montrer où part l'argent.

---

## Bloc comparaison — seulement si `estEligibleVL !== null`

```
┌────────────────────────────────────────┐
│  IMPÔT — DEUX OPTIONS                  │
│                                        │
│  Barème progressif          2 940 €    │
│  Versement libératoire      1 100 €    │
│  ────────────────────────────────      │
│  Écart                      1 840 €    │
│                                        │
│  Le versement libératoire coûte moins  │
│  cher dans ta situation.               │
└────────────────────────────────────────┘
```

Les deux montants sont affichés côte à côte, avec le même poids visuel. **Ne pas mettre en avant le moins cher par la couleur, la taille ou une pastille « recommandé ».** Le moteur compare, il ne conseille pas.

Si `estEligibleVL === false` : afficher uniquement le barème et la raison — « Ton revenu fiscal de référence dépasse le seuil : le versement libératoire n'est pas accessible cette année. »

---

## Alertes de seuils

Affichées seulement si franchies. Fond `papier`, bordure gauche 3px `alerte`.

| Condition | Texte |
|---|---|
| `depasseSeuilBaseTVA` | « Tu dépasses le seuil de franchise de TVA. Tu devras la facturer à partir du 1er janvier prochain. » |
| `depasseSeuilMajoreTVA` | « Tu dépasses le seuil majoré de TVA. Elle est due dès le 1er jour du mois de dépassement. » |
| `depassePlafondMicro` | « Tu dépasses le plafond du régime micro. La sortie n'intervient qu'après deux années consécutives de dépassement. » |

Ne jamais confondre les deux mécaniques dans le texte : le plafond micro décide du régime, le seuil TVA décide de la facturation.

---

## Bloc « ce qui n'est pas compté » — replié par défaut

Liste sèche, sans excuse :

- CFE — montant fixé par ta commune, due à partir de la 2e année
- ACRE — exonération de début d'activité
- Réductions et crédits d'impôt
- Mutuelle, prévoyance, retraite complémentaire facultative
- Activité mixte (vente + prestation)

Et si `moisDebutActivite` est renseigné : « Première année : ton plafond est ramené à X €. »

---

## Mention légale

En bas, permanente, non repliable, `type.mention` :

> Estimation indicative. Ne constitue pas un conseil fiscal ou comptable.
> Barèmes 2026 — sources : urssaf.fr, impots.gouv.fr, service-public.fr.

---

## Accessibilité — plancher non négociable

- Contraste : `encre` sur `papier` = ratio élevé ; vérifier `ponction` et `reste` sur `papier` à 4,5:1 minimum
- `accessibilityLabel` sur chaque champ, avec l'unité (« Chiffre d'affaires annuel hors taxes, en euros »)
- Les montants du décompte annoncés en toutes lettres par le lecteur d'écran, pas « moins douze mille huit cents »
- Zones tactiles ≥ 44×44
- Fonctionne à `fontScale` 1.3 sans écrasement du compteur

---

## Persistance

`AsyncStorage`, une seule clé : `parametres-utilisateur`, contenant l'objet d'entrée complet.

Aucun historique, aucun identifiant, aucune donnée nominative. Rien ne quitte l'appareil.

Rechargement au démarrage ; si la clé est absente, valeurs par défaut.

---

## Ce qu'il ne faut pas faire

- Pas de graphique, camembert ou jauge — le décompte en colonne est plus lisible
- Pas d'onboarding, pas d'écran de bienvenue — l'app s'ouvre sur le calcul
- Pas de bouton « Calculer » — le recalcul est continu
- Pas de mode sombre en v1 — une seule palette, exécutée correctement
- Pas de partage ou d'export en v1
