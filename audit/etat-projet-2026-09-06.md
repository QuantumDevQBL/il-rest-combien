# Audit complet d'état — Il reste combien

Date : 6 septembre 2026
Commit audité : `21ac471` (master, synchronisé avec origin)
Projet : `fr.quantumdev.restevraiment` — app React Native / Expo SDK 54
But du document : point de reprise complet pour un agent (Claude Code ou autre) ou un développeur humain.

---

## 1. Résumé exécutif

L'application est **fonctionnelle et testée** : moteur fiscal validé, UI mobile refaite entre le 26 et le 29 août, abonnements RevenueCat et analytics PostHog câblés avec dégradation gracieuse. Les vérifications automatisées passent : **125 tests / 12 suites au vert, 0 erreur TypeScript**.

Le code est globalement sain, mais l'audit révèle :

- **2 bugs UX réels** (onboarding débranché, StatusBar illisible sur thème clair)
- **2 suites de tests fantômes** (exclues du run Jest par un `testMatch` trop restrictif)
- **1 doublon d'événement analytics** (`paywall_viewed` émis deux fois)
- **3 incertitudes de calcul fiscal** (plafonnement QF parent isolé, ordre décote/taux effectif VL, échec silencieux de la dichotomie inverse)
- **du dead code** (écran paywall modal jamais importé, événements analytics jamais émis)
- **du millésime 2026 codé en dur** partout, sans mécanisme de revue annuelle

Le projet **n'est pas encore soumis aux stores**. Le chemin critique reste administratif (création des apps, abonnements, clés) + validation visuelle sur appareil réel.

---

## 2. Vérifications effectuées lors de l'audit

```bash
npm test -- --watchAll=false   # 12 suites, 125 tests, tous passés
npm run typecheck              # 0 erreur (strict: true)
```

Un warning `act()` persiste dans `useOnboarding` (effet de l'onboarding débranché, voir §5.1).

---

## 3. Ce qui fonctionne (confirmé par l'audit)

### Moteur fiscal (`src/engine/`) et pilotage (`src/domain/pilotage/`)

- Calcul cotisations + CFP, abattements BIC/BNC, IR (barème, QF, décote), comparaison barème / versement libératoire, calcul inverse par dichotomie, prorata année 1, alertes plafond micro / franchise TVA.
- Constantes 2026 centralisées dans `src/data/baremes-2026.ts`, chaque valeur sourcée et datée.
- Couche pilotage (projection, réserves, objectifs, alertes) pure et testée.
- Tests de référence croisés avec les simulateurs officiels Urssaf et impots.gouv.fr.

### UI mobile (`src/ui/`)

- Écrans : Accueil, Résultat, Pilotage (+ locked), Onboarding (voir §5.1).
- Navigation : stack racine + bottom tabs (Accueil / Résultat / Pilotage) + 4 modales en `transparentModal`.
- Design system à tokens (`src/ui/design-system/tokens.ts`), composants réutilisables, animations.
- Tests d'intégration UI sérieux : navigation end-to-end (gating premium inclus), Home, Result, Pilotage, modales, onboarding, SubscriptionContext.

### Monétisation et analytics

- RevenueCat (`src/ui/subscription/revenueCat.ts`) : entitlement `pilotage`, achat, restore, listener temps réel, prix fallback, dégradation gracieuse sans clé API ou sur web.
- PostHog (`src/ui/analytics/posthogClient.ts`) : lazy singleton, 27 événements typés, aucun crash sans clé.
- Funnel d'achat complet tracké (started/completed/cancelled/failed, restore).

### Infrastructure

- Expo SDK 54 / RN 0.81, TypeScript strict, builds EAS (development / preview / production).
- Plugin `withRemovePermissions` : seule permission Android = `INTERNET`.
- `.env.example` documenté, aucune clé hardcodée.

---

## 4. Anomalies fiscales (à traiter avec prudence — ne pas « réparer » sans source officielle)

1. **Plafonnement QF parent isolé incomplet** (`src/engine/ir.ts:37-56`) : la première demi-part de parent isolé devrait bénéficier d'une majoration doublée (3 614 € au lieu de 1 807 €). `PLAFOND_QUOTIENT_FAMILIAL_QUART_PART` est exporté mais jamais utilisé. Risque : IR surestimé pour ces foyers.
2. **Ordre décote / taux effectif VL non certifié** (`src/engine/micro-entreprise.ts:246`) : TODO en cours. Le taux effectif est calculé post-décote, plausible mais non croisé avec les simulateurs officiels.
3. **Dichotomie inverse sans détection d'échec** (`src/engine/inverse.ts:32-46`) : si l'objectif de net est inatteignable même après élargissement des bornes, le calcul retourne un résultat silencieusement faux. Ajouter une erreur ou un flag.
4. **Prorata année 1 approximatif** (`src/engine/micro-entreprise.ts:57,363-364`) : février fixé à 28 jours, années bissextiles ignorées, seuil majoré TVA non proratisé.
5. **CFE et abattement micro minimum absents** (documenté honnêtement dans `baremes-2026.ts`) : signalé dans les textes, pas un bug caché.
6. **Millésime 2026 figé** : `SEUIL_VERSEMENT_LIBERATOIRE_RFR_2027` existe mais n'est pas branché ; pas de sélecteur d'année. Revue fiscale annuelle obligatoire.

---

## 5. Bugs et risques applicatifs (par priorité)

### 5.1 Priorité haute

1. **Onboarding débranché** (`src/ui/navigation/AppNavigator.tsx:183-197`, `src/ui/hooks/useOnboarding.ts`) : `OnboardingScreen` n'est rendu nulle part, `hasSeenOnboarding` n'est jamais lu et `markAsSeen()` est appelé dès le chargement. Décider : réactiver le flux onboarding ou supprimer l'écran (386 lignes) et le hook.
2. **StatusBar illisible** (`App.tsx:23`) : `style="light"` sur un thème clair (`background: #F3F6F9`) → texte blanc sur fond clair. Reste d'un ancien thème sombre (splash `#050505` aussi). Passer à `style="dark"`.
3. **Tests fantômes** (`jest.config.js:12`) : `testMatch: ['**/src/ui/__tests__/**/*.test.tsx']` exclut `analytics.test.ts` et `mapping.test.ts` (en `.ts`). Corriger en `*.test.{ts,tsx}`.
4. **Doublon `paywall_viewed`** (`AppNavigator.tsx:100-108` + `:154-163`) : navigation depuis l'écran résultat vers l'onglet Pilotage déclenche `openPaywall('result')` puis le listener `tabPress` rappelle `openPaywall('pilotage_tab')` → deux événements, la source `'result'` est écrasée.

### 5.2 Priorité moyenne

5. **Dead code** : `src/ui/modals/PilotagePaywallModal.tsx` (345 lignes) jamais importé — le paywall réel est `PilotageLockedScreen`. Le supprimer.
6. **Événements analytics jamais émis** (`src/ui/utils/analytics.ts:14-18`) : `premium_intro_viewed/closed`, `monthly_tracking_clicked`, `projection_clicked`, `reserve_clicked` — vestiges d'une itération. Émettre les events ou nettoyer l'union.
7. **Erreurs non-`ValidationError` avalées silencieusement** (`src/ui/hooks/useCalculator.ts:94-96`, `src/ui/utils/calculatorInputs.ts:90-91`) : un bug moteur serait invisible. Ajouter au minimum un log.
8. **Storage sans migrations** (`src/storage/pilotageStorage.ts`) : `version` écrite mais ignorée ; aucun verrou read-modify-write. Le form calculateur est persisté hors couche storage (`useCalculator.ts`, clé `'parametres-utilisateur'`), écrit à chaque frappe.
9. **versionCode figé à 1** (`eas.json` / `app.json`) : ajouter `appVersionSource` ou `autoIncrement` avant la première release.

### 5.3 Cosmétique / dette

- Messages d'alerte pilotage sans accents (`src/domain/pilotage/alerts.ts`) mélangés au reste du code accentué.
- Constantes exportées mortes : bloc IS complet, `PASS`/`PMSS`, `TVA_TAUX_*` (« À CONFIRMER »), `ACRE_*`, `QUART_PART`.
- Fins de ligne CRLF résiduelles dans `App.tsx`, `jest.setup.ts`, `test-utils.tsx` ; `.tmp-expo-web.log` en racine.
- Cible web Expo : `dist/` généré mais l'onglet Pilotage y est toujours verrouillé (`ensureConfigured()` renvoie `false` sur web) — résidu de dev, pas un produit.

### 5.4 Dossier `app/` (landing page web)

App web parallèle active (Vite + Tailwind + shadcn, landing page « Il reste combien ? », dernier commit le 2026-08-24). 72 fichiers trackés (~678 K). Pollution limitée (`package-lock.json` et node_modules séparés, `.gitignore` propre) mais réelle : `name: "my-app"` générique, `README.md` encore le template Vite. À clarifier stratégiquement (garder comme landing, ou sortir du repo).

---

## 6. Éléments manquants avant mise en ligne

Côté code, rien de bloquant au-delà des priorités hautes ci-dessus. Côté plateformes (voir `audit/jalon-3-store-config.md` pour le détail) :

- [ ] `.env` local avec les 4 clés (`cp .env.example .env`)
- [ ] Google Play Console : app créée, Play Billing, abonnements `pilotage_monthly` (4,99 €) / `pilotage_annual` (39,99 €)
- [ ] App Store Connect : app créée, capability IAP, groupe `Pilotage`, mêmes abonnements
- [ ] RevenueCat : projet, apps, entitlement `pilotage`, offering courante (mensuel + annuel), restauration `Transfer to new App User ID`
- [ ] Build `development` testé sur appareil réel avec compte de test store
- [ ] Vérification visuelle sur petit écran Android avant build production
- [ ] Build `production` (AAB) + versionning

---

## 7. Recommandations pour le repreneur (Claude Code)

### Règles d'or

1. **Ne pas toucher au moteur fiscal** sans anomalie métier documentée et source officielle (impots.gouv.fr / Urssaf / BOFiP).
2. Traiter les corrections §5.1 dans l'ordre, **un commit par correction**.
3. Relancer `npm test -- --watchAll=false` et `npm run typecheck` après chaque commit.
4. Valider le rendu sur appareil/simulateur (`npx expo start`) avant tout build EAS — l'audit ne couvre pas le rendu visuel réel.
5. La landing `app/` et la cible web Expo ne sont pas la priorité.

### Ordre de travail suggéré

1. `StatusBar` → commit
2. `testMatch` Jest + vérifier que `analytics.test.ts` et `mapping.test.ts` passent → commit
3. Doublon `paywall_viewed` → commit
4. Décision onboarding (réactiver ou purger) → commit
5. Purge dead code (`PilotagePaywallModal`, events fantômes) → commit
6. Log des erreurs avalées → commit
7. Point séparé, avec prudence fiscale : §4 (au minimum la détection d'échec de la dichotomie, qui est sûre à ajouter)

---

## 8. Fichiers et modules clés

| Fichier / dossier | Rôle |
| ----------------- | ---- |
| `src/engine/` | Moteur fiscal — pur, testé, validé. Source de vérité. |
| `src/data/baremes-2026.ts` | Constantes fiscales 2026 sourcées et datées. |
| `src/domain/pilotage/` | Projection, réserves, objectifs, alertes. |
| `src/storage/pilotageStorage.ts` | Persistance AsyncStorage (pas de migrations). |
| `src/ui/` | Écrans, modales, design-system, navigation, contextes. |
| `src/ui/subscription/revenueCat.ts` | Facade abonnement `pilotage`. |
| `src/ui/analytics/posthogClient.ts` | Singleton analytics. |
| `src/ui/hooks/useCalculator.ts` | State form + branchement moteur (2 recalculs par frappe). |
| `app.json` / `eas.json` | Config Expo et profils de build. |
| `plugins/withRemovePermissions.js` | Android minimal-privilège. |
| `audit/` | Cadrage et audits (ce document est le plus récent). |
| `app/` | Landing page web parallèle (hors périmètre mobile). |

---

## 9. Verdict

**Code : prêt pour la phase de finition** (§5.1 puis §5.2), puis test sur appareil réel.
**Produit : prêt côté app**, en attente côté stores (§6).
**Ne pas publier** avant : corrections priorité haute, validation visuelle sur appareil cible, et configuration des abonnements sur les deux plateformes.
