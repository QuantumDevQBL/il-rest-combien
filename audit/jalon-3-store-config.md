# Jalon 3 - Store Config

## Identifiants app

- Nom: `Il reste combien`
- Slug Expo: `reste-vraiment`
- iOS bundle identifier: `fr.quantumdev.restevraiment`
- Android package: `fr.quantumdev.restevraiment`
- EAS project id: `0d4a754b-679b-4c29-95cb-8ea8ea497090`

## Variables d'environnement

Fichier local:

```bash
cp .env.example .env
```

Variables attendues:

- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`

Remarques:

- `EXPO_PUBLIC_POSTHOG_HOST` peut rester `https://eu.i.posthog.com`
- aucune cle ne doit etre hardcodee dans le repo
- si une cle manque, l'application continue de fonctionner
- PostHog et RevenueCat deviennent simplement indisponibles

## PostHog

Evenements produits deja envoyes par l'app:

- `first_open`
- `simulation_completed`
- `result_viewed`
- `monthly_tracking_clicked`
- `projection_clicked`
- `reserve_clicked`
- `premium_intro_viewed`
- `premium_intro_closed`
- `paywall_viewed`
- `purchase_started`
- `purchase_completed`
- `purchase_cancelled`
- `purchase_failed`
- `restore_started`
- `restore_completed`
- `restore_failed`
- `pilotage_opened`
- `pilotage_summary_viewed`
- `projection_viewed`
- `monthly_revenue_entry_created`
- `monthly_revenue_entry_updated`
- `monthly_revenue_entry_deleted`
- `pilotage_objective_created`
- `pilotage_objective_updated`
- `pilotage_objective_deleted`
- `pilotage_objective_viewed`
- `alert_prediction_viewed`

Proprietes volontairement limitees:

- `app_version`
- `platform`
- `source`
- `plan`

Donnees interdites:

- CA
- net
- impots
- foyer
- email
- nom
- contenu de simulation

## RevenueCat

Facade utilisee dans l'app:

- `src/ui/subscription/revenueCat.ts`

Entitlement metier attendu:

- `pilotage`

Offering attendue:

- offering courante avec deux packages:
  - mensuel
  - annuel

Produits stores a creer:

- Android abonnement mensuel `pilotage_monthly`
- Android abonnement annuel `pilotage_annual`
- iOS abonnement mensuel `pilotage_monthly`
- iOS abonnement annuel `pilotage_annual`

Presentation produit dans l'app:

- annuel prioritaire
- mensuel secondaire
- prix localises recuperes via le store quand disponibles

Comportement utilisateur:

- utilisateur RevenueCat anonyme
- pas d'auth
- pas de backend maison
- restauration compatible avec transfert vers une nouvelle App User ID

## App Store Connect

1. Creer l'app `Il reste combien`
2. Verifier le bundle id `fr.quantumdev.restevraiment`
3. Ajouter le capability In-App Purchase si necessaire
4. Creer le groupe d'abonnements `Pilotage`
5. Creer les abonnements auto-renouvelables:
   - `pilotage_monthly`
   - `pilotage_annual`
6. Configurer les prix:
   - mensuel cible: `4,99 EUR`
   - annuel cible: `39,99 EUR`
7. Renseigner les metadonnees store des produits
8. Associer les produits dans RevenueCat
9. Tester avec un compte Sandbox Apple sur une development build

## Google Play Console

1. Creer l'application `Il reste combien`
2. Verifier le package `fr.quantumdev.restevraiment`
3. Activer Google Play Billing
4. Creer les abonnements:
   - `pilotage_monthly`
   - `pilotage_annual`
5. Configurer les prix:
   - mensuel cible: `4,99 EUR`
   - annuel cible: `39,99 EUR`
6. Completer les fiches produit
7. Associer les produits dans RevenueCat
8. Tester avec un compte test Google Play sur une development build

## RevenueCat Dashboard

1. Creer le projet `Il reste combien`
2. Ajouter l'app iOS `fr.quantumdev.restevraiment`
3. Ajouter l'app Android `fr.quantumdev.restevraiment`
4. Recuperer les cles publiques SDK:
   - iOS
   - Android
5. Creer l'entitlement `pilotage`
6. Importer ou rattacher les produits:
   - `pilotage_monthly`
   - `pilotage_annual`
7. Creer une offering courante avec:
   - package mensuel
   - package annuel
8. Attacher l'entitlement `pilotage` aux deux produits
9. Regler le comportement de restauration:
   - `Transfer to new App User ID`

## EAS / builds

Profils existants:

- `development`
- `preview`
- `production`

Commandes utiles:

```bash
npx expo start --dev-client
npx eas build --profile development --platform android
npx eas build --profile development --platform ios
npx eas build --profile production --platform android
npx eas build --profile production --platform ios
```

## Validation attendue avant test global

- variables `.env` definies
- cles PostHog valides
- cles RevenueCat valides
- entitlement `pilotage` visible dans RevenueCat
- packages mensuel et annuel visibles dans l'offering courante
- produits stores crees des deux cotes
- development build installee sur appareil reel
