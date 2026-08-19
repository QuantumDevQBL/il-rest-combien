# Publication Google Play — séquence d'exécution

**Pour toi, pas pour Kimi.** Ordre optimisé pour que rien n'attende.

Contexte : compte organisation, D-U-N-S 277331551, app payante à 0,99 € ou 1,99 €.

---

## Avant toute chose — deux vérifications bloquantes

**1. L'adresse du DUNS.** 97 rue Deslandes, Tours 37000. Si ce n'est plus exact, corrige via `https://www.dnb.com/de-de/upik-en/contact-upik.html` **et attends la propagation** avant de créer le compte. Google recoupe avec la base D&B ; une divergence fait échouer la vérification d'identité.

**2. Le nom légal.** À l'inscription tu saisis `BALOHE LACOURREGE QUENTIN FRANCIS HENRI`, exactement comme dans la base D&B. Pas « QuantumDev ». Le nom commercial affiché sur la fiche store se paramètre après, séparément.

Une saisie incohérente fait perdre les 25 $ sans remboursement.

---

## Étape 1 — Play Console (jour 1)

25 $, paiement unique. `play.google.com/console`

Type de compte : **organisation**. Tu fournis le DUNS. Google vérifie sous quelques jours à quelques semaines.

> **Pourquoi organisation et pas personnel :** les comptes personnels créés après le 13 novembre 2023 doivent réaliser un test fermé avec au moins 12 testeurs inscrits pendant 14 jours consécutifs avant de pouvoir demander l'accès en production. Les comptes organisation en sont exemptés. C'est deux semaines de délai et une chasse aux testeurs que tu évites entièrement.

Si Google te bascule quand même en personnel malgré le DUNS, tu retombes sur cette contrainte. Ce n'est pas fatal, mais ça décale ton planning — anticipe-le avant d'annoncer une date.

---

## Étape 2 — Profil de paiement marchand (jour 1, en parallèle)

**Obligatoire pour une app payante, et c'est le poste le plus lent après la vérification d'identité.** Ne le laisse pas pour la fin.

- Création du profil de paiement Google
- Informations fiscales (numéro de TVA intracommunautaire si tu en as un, sinon statut de non-assujetti)
- Coordonnées bancaires — un IBAN au nom de l'entité déclarée
- Vérification par micro-dépôt ou justificatif selon les cas

Sans ce profil validé, tu peux publier une app gratuite mais pas fixer un prix.

---

## Étape 3 — Politique de confidentialité (jour 1, 30 minutes)

**URL publique obligatoire**, y compris pour une app qui ne collecte rien. Pas de PDF, pas de Google Doc : une page HTML accessible sans authentification.

Tu as `quantumdev.fr`. Crée `quantumdev.fr/privacy/calculateur-micro/`.

Contenu minimal, et dans ton cas il est court :

- Aucune donnée personnelle n'est collectée
- Aucune donnée n'est transmise à un serveur
- Les paramètres saisis sont stockés localement sur l'appareil et supprimés avec l'application
- Aucun service tiers, aucun analytics, aucune publicité
- Contact : une adresse email valide et relevée

**Utilise `quentin@quantumdev.fr`, pas l'adresse Gmail.** C'est visible publiquement sur la fiche store.

---

## Étape 4 — Pendant que la vérification tourne : le build

Rien ne dépend de Google ici. C'est là que Kimi travaille.

```
eas build --platform android --profile production
```

Points de contrôle avant de builder :

| Vérification | Attendu |
|---|---|
| Permissions dans le manifest | **Aucune**. Expo ajoute parfois `INTERNET` par défaut — retire-la, l'app est offline |
| `versionCode` | Entier, incrémenté à chaque upload. Une valeur déjà utilisée est rejetée |
| Package name | `fr.quantumdev.calculateurmicro` ou équivalent. **Immuable après publication** |
| Target API level | Google impose un niveau minimum pour les nouvelles apps. Vérifie l'exigence en vigueur dans la Play Console — un SDK Expo récent le couvre normalement |
| Signature | Laisse Play App Signing gérer la clé. Ne signe pas manuellement |

Le livrable est un **AAB**, pas un APK. Le format APK n'est plus accepté pour les nouvelles applications.

---

## Étape 5 — Fiche store

Ce qu'il faut préparer, à faire pendant l'attente :

- **Titre** : 30 caractères max
- **Description courte** : 80 caractères — c'est ce qui s'affiche en liste, c'est le texte qui convertit
- **Description longue** : 4000 caractères max
- **Icône** : 512×512 PNG 32 bits
- **Bannière** : 1024×500
- **Captures d'écran** : minimum 2, format téléphone. Prends-les sur un vrai rendu, pas sur un mockup marketing
- **Catégorie** : Finance
- **Coordonnées** : email `@quantumdev.fr`, URL de la politique de confidentialité

Sur la description : ton app calcule des barèmes 2026 post-réforme que la plupart des concurrents n'ont pas intégrés. Dis-le. C'est ton seul argument de différenciation réel.

---

## Étape 6 — Déclarations obligatoires

Trois formulaires, tous bloquants.

**Sécurité des données.** C'est là que ton architecture offline paie : tu coches « aucune donnée collectée », « aucune donnée partagée ». Trois clics, aucune justification à fournir. Toute librairie d'analytics t'aurait fait entrer dans un questionnaire de vingt écrans avec obligation de déclarer les finalités.

**Classification du contenu (IARC).** Questionnaire automatisé. Un calculateur fiscal ressort en catégorie « Tout public » sans difficulté.

**Contenu publicitaire.** Réponse : non.

---

## Étape 7 — Prix

Fixe le prix **avant** la première publication en production. Passer de gratuit à payant est impossible après coup : il faudrait republier sous un autre package name.

À 0,99 € : Google prélève 15 % dans le cadre du Small Business Program (à activer explicitement si tu ne l'as pas fait), soit environ 0,84 € net par vente. Le prix affiché est TTC — la TVA du pays de l'acheteur est gérée par Google, qui agit comme fournisseur.

---

## Étape 8 — Test interne avant production

Ce n'est pas le test fermé obligatoire (dont tu es exempté). C'est ton propre contrôle.

Publie sur la piste **test interne**, installe sur ton téléphone via le lien, et vérifie :

- Le calcul sur tes 4 cas de référence, sur l'appareil réel
- La persistance : ferme et rouvre l'app
- Le rendu à `fontScale` élevé
- Le mode avion — l'app doit fonctionner à l'identique

Puis promotion vers production.

---

## Étape 9 — Ce que tu documentes

C'est le livrable qui a de la valeur au-delà de l'app.

À chaque étape, note : la durée réelle, ce qui a bloqué, ce que la doc Google ne disait pas, le délai de review.

Trois angles exploitables ensuite :

1. Un post LinkedIn sur le parcours réel, chiffres à l'appui
2. Un argumentaire quand un client te demandera une app mobile — tu auras fait le circuit
3. Une prestation « publication store » facturable, parce que la friction que tu vas rencontrer, tes clients ne veulent pas la vivre

---

## Ordre récapitulatif

| Jour | Action | Dépend de |
|---|---|---|
| J0 | Vérifier l'adresse DUNS | — |
| J1 | Créer la Play Console (25 $) | Adresse DUNS correcte |
| J1 | Lancer le profil de paiement marchand | Compte créé |
| J1 | Publier la page de politique de confidentialité | — |
| J1→J5 | Développement avec Kimi | — |
| J5 | Préparer icône, captures, descriptions | App fonctionnelle |
| J6 | Build AAB | Code terminé |
| J6 | Upload en test interne | AAB + compte vérifié |
| J7 | Déclarations, prix, fiche store | — |
| J8 | Promotion en production | Tout ce qui précède |
| J8→J11 | Review Google | — |

Le chemin critique n'est pas le code : c'est la vérification d'identité et le profil de paiement. Lance-les en premier.
