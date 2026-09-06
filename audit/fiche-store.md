# Fiche store — App Store Connect & Google Play Console

Contenu prêt à copier-coller. Longueurs vérifiées (script Python, comptage
Unicode réel, pas une estimation) contre les limites de chaque champ.

---

## Nom de l'app (30 caractères max, les deux stores)

```
Il reste combien ?
```
18 caractères.

## Sous-titre — App Store uniquement (30 caractères max)

```
Calculateur micro-entreprise
```
28 caractères. (Google Play n'a pas de champ sous-titre séparé — le nom
suffit, la description courte fait le reste.)

## Description courte — Google Play uniquement (80 caractères max)

```
Calculez votre vrai revenu net en micro-entreprise, et pilotez votre activité.
```
78 caractères.

## Texte promotionnel — App Store uniquement (170 caractères max, modifiable à tout moment sans review)

```
Nouveau : suivez vos charges fixes récurrentes et affinez votre disponible réel avec Pilotage.
```
94 caractères.

## Description longue (4000 caractères max, les deux stores)

```
Votre chiffre d'affaires n'est pas votre revenu. Il reste combien ? vous montre en quelques secondes ce qu'il vous reste vraiment après cotisations et impôt, pour arrêter de deviner.

CE QUE VOUS OBTENEZ IMMÉDIATEMENT
• Votre net mensuel et annuel, calculé sur les barèmes 2026
• Le détail complet : cotisations sociales, CFP, abattement, impôt
• Comparaison barème progressif vs versement libératoire pour choisir le plus avantageux
• Calcul inverse : fixez un revenu net visé, obtenez le chiffre d'affaires à réaliser
• Alertes automatiques avant de dépasser les plafonds micro-entreprise ou le seuil de franchise en base de TVA
• Historique de vos simulations

POUR QUI
Micro-entrepreneurs en vente de marchandises, prestations commerciales ou artisanales, et professions libérales (BIC et BNC).

PILOTAGE — POUR ALLER PLUS LOIN
Un espace dédié pour suivre votre activité mois après mois, pas juste un résultat ponctuel :
• Encaissements mensuels et projection de votre chiffre d'affaires annuel
• Réserves estimées pour vos cotisations, votre impôt et vos charges fixes
• Vos charges fixes récurrentes (loyer, assurance, abonnements...) suivies individuellement, pour un disponible calculé au plus juste
• Objectif de revenu net et effort restant pour l'atteindre
• Alertes personnalisées basées sur votre rythme réel

VOS DONNÉES RESTENT LES VÔTRES
Chiffre d'affaires, charges et historique sont stockés uniquement sur votre téléphone. Aucune donnée financière n'est envoyée à nos serveurs.

Un calcul complet et gratuit, un pilotage mensuel en option pour celles et ceux qui veulent vraiment maîtriser leur trésorerie.
```
1625 caractères.

## Mots-clés — App Store uniquement (100 caractères max, séparés par virgules sans espace)

```
micro-entreprise,auto-entrepreneur,cotisations,impot,revenu,BNC,BIC,TVA,liberatoire,pilotage,budget
```
99 caractères. Ne pas répéter les mots déjà dans le nom/sous-titre (Apple les indexe déjà) — c'est fait ici (« micro-entreprise » y figure une fois mais le champ est de toute façon quasi plein, pas la peine de le retirer pour 1 caractère).

## Notes de version — v1 (les deux stores)

```
Première version : calcul du net micro-entreprise (BIC/BNC), comparaison barème vs versement libératoire, calcul inverse, alertes de plafonds, historique. Pilotage (option) : suivi mensuel, réserves, charges fixes récurrentes, objectif de revenu.
```

## Catégorie

- **App Store** : Finance (catégorie secondaire possible : Productivité)
- **Google Play** : Finance

## Classification d'âge

Tout public / 4+ — aucun contenu sensible, pas de fonction sociale, pas de contenu généré par d'autres utilisateurs.

## URLs à renseigner

- **URL de support** : à définir (mailto:contact@quantumdev.fr fonctionne en attendant une vraie page de support)
- **URL marketing** : la landing page une fois déployée
- **Politique de confidentialité** (obligatoire) : `<domaine>/confidentialite` une fois la landing déployée

---

## Formulaire de confidentialité — App Store (« App Privacy »)

⚠️ Les libellés exacts des cases à cocher évoluent parfois côté Apple —
vérifier contre le formulaire réel au moment de la soumission. Mapping basé
sur ce que l'app collecte réellement (vérifié dans le code, voir
`audit/comment-tester-en-local.md` et la politique de confidentialité) :

| Catégorie Apple | Collecté ? | Détail |
|---|---|---|
| Données de contact | Non | — |
| Informations financières | Non | CA, charges, historique restent sur l'appareil, jamais transmis |
| Localisation | Non | — |
| Contenu utilisateur | Non | — |
| Identifiants | Oui — non lié à l'identité | Identifiant anonyme d'abonné RevenueCat |
| Données d'achat | Oui — non lié à l'identité | Statut d'abonnement, historique d'achat (via RevenueCat/store) |
| Données d'usage | Oui — non lié à l'identité | Événements PostHog : nom d'événement, plateforme, version app — jamais de montant |
| Diagnostic | Non (pas de crash reporting configuré actuellement) | — |
| Suivi (tracking, au sens App Tracking Transparency) | Non | Aucun identifiant publicitaire, aucun tracking cross-app |

## Formulaire de confidentialité — Google Play (« Data safety »)

| Catégorie Google | Collecté ? | Partagé avec un tiers ? | Détail |
|---|---|---|---|
| Informations financières | Non | — | CA, charges, historique restent sur l'appareil |
| Achats | Oui | Traité par Google Play / RevenueCat (prestataires de service, pas de partage publicitaire) | Statut et historique d'abonnement |
| Activité dans l'application | Oui | Traité par PostHog (prestataire de service) | Événements d'usage anonymes, sans montant |
| Identifiants d'appareil ou autres identifiants | Oui | Traité par RevenueCat | Identifiant anonyme d'abonné |

Répondre « Oui » à la question « Les données sont-elles chiffrées en
transit ? » (HTTPS/TLS, cf. politique de confidentialité) et « Oui, les
utilisateurs peuvent demander la suppression de leurs données » (contact
email fourni dans la politique).

---

## Ce qui reste à faire côté comptes (pas du code)

- [ ] Créer l'app dans App Store Connect et Google Play Console
- [ ] Renseigner ces textes tels quels
- [ ] Screenshots (générés une fois l'app stable — je peux les préparer si tu me dis sur quel device/simulateur les prendre)
- [ ] Configurer les produits d'abonnement (`pilotage_monthly`, `pilotage_annual`) des deux côtés + dans RevenueCat
- [ ] Remplir les formulaires de confidentialité ci-dessus dans les consoles réelles
