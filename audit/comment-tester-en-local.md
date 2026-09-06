# Comment tester l'app sur son téléphone

Contexte : le développement se fait dans un environnement cloud isolé (Claude
Code on the web), qui ne peut pas atteindre un téléphone physique — pas le
même réseau, pas d'ADB, et le mode tunnel Expo (ngrok) ne passe pas la
politique réseau sortante de cet environnement. Le test se fait donc en
local, sur ta machine.

## Ce qu'il faut (une seule fois)

- Node.js installé
- L'app **Expo Go** sur le téléphone (Android : Play Store, iOS : App Store)
- Pas besoin d'ADB, pas besoin de compte développeur Android/Apple pour ce
  mode de test — ADB ne sert que pour un build natif (`expo run:android`) ou
  un émulateur, pas pour Expo Go.

## À chaque nouvelle version à tester

```bash
git fetch origin claude/audit-dernier-commit-j3uyrt
git checkout claude/audit-dernier-commit-j3uyrt
git pull
npm install
npx expo start
```

Puis :
- **Téléphone et PC sur le même Wi-Fi** → scanner le QR code affiché dans le
  terminal avec l'appareil photo (iOS) ou l'app Expo Go (Android).
- **Pas sur le même réseau** (4G sur le tel, filaire sur le PC...) → lancer
  `npx expo start --tunnel` à la place. Ça passe par un tunnel public, donc
  ça marche même sur des réseaux différents (toujours sans ADB).

Aucune clé `.env` n'est nécessaire pour tester : RevenueCat (abonnements) et
PostHog (analytics) sont conçus pour se dégrader proprement sans clé
configurée (aucun crash, juste les fonctionnalités correspondantes désactivées).

## Vérification côté développement (déjà faite avant chaque commit)

Avant de pousser un commit, chaque changement passe par :
```bash
npm test -- --watchAll=false   # suite de tests
npm run typecheck              # 0 erreur TypeScript
npx expo export --platform android   # le bundle compile réellement (pas juste les mocks de test)
```
Ça ne remplace pas un test réel sur téléphone (rendu visuel, interactions
tactiles, permissions), mais ça garantit que ce qui arrive sur la branche ne
casse pas la compilation ni la logique testée.

Note sur l'abonnement Pilotage : le tester réellement (achat, restauration)
nécessite un produit d'abonnement configuré côté Play Console / App Store
Connect et un compte de test store — sans ça, l'écran verrouillé et les
offres s'affichent mais l'achat n'aboutira pas.

## Recette avant v1

Avant de déclarer l'app prête pour la mise en ligne, dérouler la checklist de
test manuel : `audit/recette-v1.md`. Elle couvre chaque écran et les cas
limites, pas seulement le chemin heureux.

## Vers la publication (une fois la recette passée)

1. Build de test élargi (partageable, sans Expo Go) :
   `eas build --profile preview`
2. Build de production : `eas build --profile production`
3. Soumission : `eas submit`

Ces commandes nécessitent un compte Expo/EAS connecté (`eas login`) — à faire
sur ta machine, pas depuis cet environnement.
