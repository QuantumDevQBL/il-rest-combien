# Recette v1 — checklist de test manuel

But : valider à la main, sur un vrai téléphone (via Expo Go ou un build
preview EAS), que tout fonctionne avant de déclarer la v1 prête et de passer
au build de production / soumission stores.

Coché par un humain, pas par un test automatisé — les 149 tests unitaires et
le `expo export` déjà vérifiés couvrent la logique et la compilation, pas le
rendu réel ni le ressenti tactile.

Pour lancer l'app à tester, voir `audit/comment-tester-en-local.md`.

---

## 1. Premier lancement / Onboarding

- [ ] Au tout premier lancement (app fraîchement installée), les 3 slides
      d'onboarding s'affichent
- [ ] Le swipe entre slides fonctionne, les points de progression suivent
- [ ] Bouton « Suivant » avance, « Commencer » sur le dernier slide termine
      l'onboarding
- [ ] Bouton « Passer » (en haut à droite) saute directement à l'accueil
- [ ] Après un `kill` complet et relance de l'app, l'onboarding n'apparaît
      plus (déjà vu)

## 2. Accueil / Calculateur

- [ ] Saisie d'un chiffre d'affaires valide → bouton « Calculer mon net »
      actif, mène à l'écran Résultat
- [ ] Message d'erreur clair si CA vide, négatif ou non numérique
- [ ] Changement d'activité (Micro BNC / BIC services / BIC vente) change le
      résultat en conséquence
- [ ] Historique des simulations accessible et correct (bouton historique)

## 3. Résultat

- [ ] Onglet **Résumé** : net mensuel, reste sur 100€, taux de prélèvement
      cohérents avec le CA saisi
- [ ] Onglet **Détail** : décompte (cotisations, CFP, impôt, option fiscale)
      lisible et cohérent avec le résumé
- [ ] Onglet **Alertes** : plafond micro / franchise TVA signalés si le CA
      saisi s'en approche ou les dépasse
- [ ] Modale **Calcul inverse** : objectif net mensuel → CA requis calculé,
      cohérent en le réinjectant dans le calculateur direct
- [ ] Modale **Détail** (si distincte du tab) s'ouvre et se ferme proprement
- [ ] Bouton retour/reset ramène à l'accueil sans planter

## 4. Réglages

- [ ] Champ « Charges fixes annuelles » : modification répercutée sur le
      résultat après recalcul
- [ ] Situation familiale (célibataire/couple), enfants à charge, parent
      isolé : le toggle parent isolé ne s'active que si pertinent
- [ ] Autres revenus du foyer, RFR N-2, parts fiscales N-2 : acceptés et
      pris en compte dans l'impôt au barème
- [ ] Bouton de réinitialisation des paramètres fonctionne

## 5. StatusBar / thème visuel

- [ ] La barre de statut (heure, batterie en haut de l'écran) est **lisible**
      sur fond clair, sur tout l'app (régression du bug audité : elle était
      en style clair sur fond clair, illisible)
- [ ] Écran de démarrage (splash) : logo et texte visibles, transition
      propre vers l'app

## 6. Pilotage — accès premium

- [ ] Sans abonnement actif : appuyer sur l'onglet Pilotage affiche l'écran
      verrouillé (avantages listés, offres mensuel/annuel)
- [ ] Idem en cliquant sur la carte « Pilotage » depuis l'écran Résultat
- [ ] Achat sandbox (compte de test store) : le paiement aboutit, l'onglet
      Pilotage devient accessible immédiatement après achat
- [ ] Bouton « Restaurer mes achats » fonctionne (à tester en désinstallant/
      réinstallant l'app avec le même compte test)

## 7. Pilotage — une fois débloqué

- [ ] État vide : message d'invitation à ajouter le premier mois
- [ ] Ajout d'un mois encaissé → apparaît dans l'historique, disponible
      estimé et projection annuelle se mettent à jour
- [ ] Modification et suppression d'un mois fonctionnent
- [ ] **Charges fixes récurrentes** (nouvelle fonctionnalité) :
  - [ ] État vide : message d'invitation, pas de section charges affichée
  - [ ] Ajout d'une charge (intitulé + montant mensuel) → apparaît dans la
        liste, total annuel affiché correct (montant × 12)
  - [ ] Modifier une charge existante met à jour le total
  - [ ] Supprimer une charge la retire de la liste et recalcule le total
  - [ ] Une fois au moins une charge ajoutée, le disponible estimé / les
        réserves de Pilotage utilisent ce total (pas le champ manuel des
        Réglages)
- [ ] Objectif de revenu : définir, modifier, supprimer ; progression et CA
      requis cohérents
- [ ] Alertes de Pilotage (seuils, retard sur objectif) s'affichent quand
      pertinent

## 8. Cas limites à tester explicitement

- [ ] CA à 0 € : pas de crash, résultat cohérent (tout à 0)
- [ ] CA très élevé (> plafond micro) : alerte de dépassement affichée
- [ ] Calcul inverse avec un objectif irréaliste (ex. 500 000 €/mois) : pas
      de crash, pas de chiffre absurde silencieux (cf. correctif dichotomie)
- [ ] Rotation d'écran / mode sombre du téléphone : l'app reste utilisable
      (l'app est forcée en thème clair, à vérifier que ça ne casse rien)
- [ ] Perte de connexion réseau : le calculateur et Pilotage restent
      utilisables (tout est local), seul l'achat d'abonnement nécessite le
      réseau

## 9. Après la recette

Une fois toutes les cases cochées sans anomalie bloquante :
1. Build de test partageable : `eas build --profile preview` (voir
   `audit/comment-tester-en-local.md`) pour un tour de test élargi
   (au-delà de ton propre téléphone) si souhaité.
2. Build de production : `eas build --profile production`
3. Soumission : `eas submit`

Toute anomalie trouvée pendant la recette → décrire précisément (écran,
action, résultat attendu vs obtenu) pour correction avant de rebuild.
