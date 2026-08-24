# Cadrage V1 produit mobile — Reste vraiment

Date : 24 août 2026
Projet : `fr.quantumdev.restevraiment`
Statut : document de cadrage actif pour la reprise

---

## 1. But produit

Construire une application mobile simple et utile pour les freelances en micro-entreprise qui veulent répondre rapidement à une question :

**"Sur ce chiffre d'affaires, combien il me reste vraiment après cotisations et impôt ?"**

La V1 ne doit pas chercher à couvrir tous les cas fiscaux ni à impressionner par le design. Elle doit être :

- rapide à comprendre ;
- crédible sur le calcul ;
- agréable à utiliser sur téléphone ;
- exploitable en moins de 30 secondes.

---

## 2. Utilisateur cible

### Cible principale

Freelance ou indépendant en micro-entreprise, en France, qui :

- facture seul ;
- veut estimer son net réel ;
- n'a pas envie d'ouvrir un simulateur administratif lourd ;
- utilise surtout son téléphone.

### Cible exclue de la V1

- cabinets comptables ;
- cas multi-activité complexes ;
- professions réglementées Cipav ;
- utilisateurs qui veulent une simulation fiscale exhaustive de foyer.

---

## 3. Promesse de la V1

En moins d'une minute, l'utilisateur peut :

1. choisir son type d'activité ;
2. saisir son CA annuel HT ;
3. voir immédiatement :
   - son net mensuel estimé ;
   - son net annuel estimé ;
   - la part absorbée par les prélèvements ;
   - l'option fiscale la plus favorable quand l'information est disponible.

---

## 4. Parcours principal

Le parcours principal V1 doit être le plus court possible :

1. Onboarding très court ou skippable.
2. Écran d'entrée :
   - choix activité ;
   - saisie CA ;
   - CTA clair.
3. Écran résultat :
   - net mensuel ;
   - net annuel ;
   - ratio "reste sur 100 €" ;
   - détail secondaire accessible ;
   - paramètres avancés non prioritaires.

Tout le reste est secondaire.

---

## 5. Ce qui doit absolument être dans la V1

- Moteur fiscal actuel conservé comme source de vérité.
- 4 catégories d'activité actuelles.
- Saisie directe du CA annuel HT.
- Résultat principal lisible sans effort.
- Accès à l'historique simple.
- Paramètres avancés accessibles mais non imposés.
- Mention légale visible.
- App stable sur petits écrans Android.

---

## 6. Ce qui sort explicitement de la V1

Pour éviter de casser l'UX, ces sujets ne pilotent pas la V1 :

- design "premium" ambitieux ;
- personnalisation poussée ;
- cas Cipav ;
- configuration fiscale détaillée dès l'entrée ;
- dashboards complexes ;
- comparaisons multiples sur un même écran ;
- logique web parallèle sous `app/` ;
- fonctionnalités non essentielles au calcul de net.

---

## 7. Principes UX à suivre

### Priorité 1 : vitesse

L'utilisateur doit comprendre l'écran principal en quelques secondes.

### Priorité 2 : hiérarchie

Une seule information dominante par écran.

### Priorité 3 : progressivité

Les options complexes doivent rester secondaires, jamais bloquer le flux.

### Priorité 4 : robustesse mobile

Pas de dépendance à un rendu "parfait" fragile. Les layouts doivent tenir sur des téléphones compacts.

### Priorité 5 : crédibilité

Le ton doit être clair, concret, sans jargon administratif inutile.

---

## 8. Architecture produit cible

### Écran 1 — Entrée

Objectif : lancer une simulation sans friction.

Contenu prioritaire :

- activité ;
- montant du CA ;
- bouton calculer.

Contenu secondaire :

- nom facultatif de la simulation ;
- historique ;
- rappel de périmètre.

### Écran 2 — Résultat

Objectif : comprendre la réponse immédiatement.

Contenu prioritaire :

- net mensuel ;
- net annuel ;
- prélèvements globaux ;
- reste sur 100 €.

Contenu secondaire :

- comparaison barème / versement libératoire ;
- alertes TVA / plafond ;
- détail complet ;
- objectif de revenu ;
- paramètres fiscaux.

### Modales / écrans secondaires

Ils servent à approfondir, pas à porter l'app.

---

## 9. Décisions de reprise

Pour la suite des jalons :

1. Ne pas refactorer le moteur fiscal sans anomalie métier explicite.
2. Traiter `src/ui/` comme le vrai chantier.
3. Simplifier au lieu d'ajouter.
4. Valider chaque étape par tests et rendu local.
5. Faire un commit par jalon produit, pas par micro-changement.

---

## 10. Jalons validés pour la reprise

### Jalon 1 — Cadrage V1

But :
fixer le périmètre produit et la promesse.

### Jalon 2 — Entrée mobile

But :
rendre l'entrée dans l'app rapide, claire, robuste.

### Jalon 3 — Résultat principal

But :
faire du résultat l'écran le plus utile de l'app.

### Jalon 4 — Paramètres avancés

But :
garder la profondeur métier sans polluer le flux principal.

### Jalon 5 — Cohérence finale

But :
uniformiser textes, composants, états et comportements.

---

## 11. Critère de réussite V1

La V1 est réussie si un freelance peut ouvrir l'app, saisir un CA, comprendre son net réel et repartir avec une réponse fiable sans se perdre dans l'interface.
