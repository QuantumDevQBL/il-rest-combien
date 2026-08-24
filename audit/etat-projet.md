# Audit d'état — Calculateur de rentabilité micro-entreprise

Date : 24 août 2026
Projet : `fr.quantumdev.restevraiment` (nom de code « Reste vraiment »)
Commit : `471564e`

---

## 1. Résumé exécutif

Le moteur fiscal est complet, testé et correct. L'interface utilisateur n'a pas été livrée de manière utilisable sur mobile. Le dernier build Android compile mais présente des problèmes de rendu qui bloquent l'utilisation.

Le projet n'est pas prêt pour la publication.

---

## 2. Ce qui fonctionne

### Moteur fiscal (`src/engine/`)

- Calcul des cotisations sociales micro-entreprise selon les barèmes 2026.
- Contribution à la formation professionnelle (CFP) par nature d'activité.
- Abattements forfaitaires BIC/BNC.
- Impôt sur le revenu : barème progressif, quotient familial plafonné, décote.
- Comparaison barème progressif / versement libératoire avec règle du taux effectif.
- Calcul inverse par dichotomie (objectif de net → CA requis).
- Prorata année 1 et alertes plafond micro / franchise TVA.
- 107 tests passent, dont 4 cas de référence croisés avec les simulateurs officiels Urssaf et impots.gouv.fr.
- TypeScript : 0 erreur.

### Infrastructure

- Dépôt Git initialisé, historique propre.
- Configuration Expo / EAS fonctionnelle.
- Build EAS preview Android généré avec succès : `340e458a-fd8b-418d-b44b-a42faa9c2e5d`.
- Plugin de retrait des permissions Android opérationnel (pas de permission déclarée).

---

## 3. Ce qui ne fonctionne pas

### Interface utilisateur

- Rendu mobile non satisfaisant : disposition des vignettes d'activité incorrecte (affichage en colonne au lieu d'une grille 2×2, cartes trop petites, icônes et textes qui débordent sur certains appareils).
- Expérience perçue comme datée, non premium, non « app-like ».
- Navigation et historique non intuitifs.
- Pas de cohérence visuelle globale.

### Qualité UI

- Plusieurs refontes itératives n'ont pas résolu les problèmes de rendu.
- Absence de retour visuel fiable (pas de captures d'écran systématiques du rendu sur l'appareil cible).
- Tests UI existants mais ne garantissent pas le rendu visuel réel.

---

## 4. Éléments manquants pour une mise en ligne

- Design system validé et stable.
- Onboarding clair et concis.
- Écran d'accueil mobile-first sans scroll obligatoire.
- Historique accessible et utilisable.
- Libellés explicites et aides contextuelles.
- Mention légale permanente.
- Assets graphiques définitifs (icônes, splash screen).
- Tests sur plusieurs tailles d'écran.
- Passage en production AAB.

---

## 5. Causes de l'échec de livraison UI

1. **Compétences mal calibrées** : l'agent a tenté de réaliser un design premium et une UX mobile native sans avoir l'expertise ou la méthode pour y parvenir.
2. **Itérations à l'aveugle** : corrections successives sans visualisation préalable du rendu réel sur l'appareil cible.
3. **Mauvaise gestion des attentes** : promesses de refontes « premium » non tenues.
4. **Temps perdu** : 6 jours de tentatives successives sans aboutir à un résultat satisfaisant.

---

## 6. Recommandations pour une reprise

### Si une autre IA reprend

- Ne pas toucher au moteur fiscal sans justification métier explicite.
- Partir d'une maquette ou d'une référence visuelle concrète fournie par l'utilisateur.
- Tester visuellement sur l'appareil cible avant chaque build EAS.
- Privilégier une UI simple et fonctionnelle à une UI "premium" non maîtrisée.
- Utiliser `npx expo start --web` ou un simulateur local pour valider le rendu avant de builder.

### Si un humain reprend

- Embaucher un designer mobile pour la direction artistique.
- Séparer clairement le rôle du développeur backend/moteur et du développeur frontend mobile.
- Le moteur actuel peut servir de base solide, mais l'UI doit être entièrement refaite.

---

## 7. Fichiers et modules clés

| Fichier / dossier | Rôle |
| ----------------- | ---- |
| `src/engine/` | Moteur fiscal — fonctionnel et testé. |
| `src/data/` | Constantes fiscales 2026. |
| `src/ui/` | Composants React Native — à reprendre ou refondre. |
| `app.json` | Configuration Expo (nom, slug, package Android). |
| `eas.json` | Profils de build EAS. |
| `plugins/withRemovePermissions.js` | Retrait des permissions Android. |
| `src/engine/__tests__/reference-officielle.test.ts` | Cas de référence croisés. |

---

## 8. Commandes de validation actuelles

```bash
npm test -- --watchAll=false
npm run typecheck
```

Les deux passent au moment de l'audit.

---

## 9. Décision recommandée

Ne pas publier l'application en l'état. Refondre l'UI avec une compétence dédiée avant toute soumission au Play Store.
