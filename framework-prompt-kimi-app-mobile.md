# Framework de prompt — Kimi Code

## Projet : calculateur de rentabilité freelance FR

**Objectif réel du projet :** documenter le pipeline complet dev → soumission → publication → premiers euros. L'app est le prétexte. Le livrable de valeur, c'est ta doc du parcours.

**Stack imposée :** Expo (managed workflow) + React Native + TypeScript
**Contraintes non négociables :** zéro backend, zéro appel réseau, zéro IA, zéro tracking, fonctionnement 100 % offline.

Pourquoi ces contraintes : sans réseau ni tracking, le formulaire *Sécurité des données* de Google Play se remplit en trois clics avec « aucune donnée collectée ». C'est la différence entre une publication en 3 jours et un aller-retour de review de trois semaines.

---

## RÈGLE D'OR — à ne jamais relâcher

**Kimi ne produit aucune valeur de barème, taux, seuil ou plafond. Jamais.**

Un LLM hallucine des taux URSSAF avec un aplomb total. Si tu publies une app de calcul fiscal sous ton nom civil (rappel : ton compte store est à ton état civil) avec des taux inventés, tu prends un risque réputationnel réel pour zéro bénéfice.

L'architecture impose donc :

- `src/engine/` → la logique de calcul pure, écrite par Kimi
- `src/data/baremes-2026.ts` → un fichier de constantes typées, **squelette généré par Kimi, valeurs saisies par toi**, chacune avec sa source en commentaire

Chaque constante porte un commentaire `// source: <URL officielle> — consulté le <date>`.

---

## PROMPT 0 — Cadrage (à envoyer en premier, une seule fois)

> Tu es un développeur React Native senior. On construit ensemble une application mobile.
>
> **Projet :** un calculateur de rentabilité pour freelances français. L'utilisateur saisit ses paramètres (statut juridique, CA visé ou TJM, jours travaillés, charges fixes) et l'app calcule son revenu net réel après cotisations et impôts.
>
> **Stack imposée :** Expo managed workflow, React Native, TypeScript strict.
>
> **Contraintes absolues :**
> - Aucun backend, aucune API, aucun appel réseau
> - Aucune bibliothèque d'analytics, de tracking ou de publicité
> - Fonctionnement intégralement hors ligne
> - Aucune donnée personnelle ne quitte l'appareil
>
> **Architecture imposée :**
> - `src/engine/` : logique de calcul pure, aucune dépendance à React, entièrement testable
> - `src/data/` : constantes fiscales et sociales, isolées du moteur
> - `src/ui/` : composants d'affichage
>
> **Règle que tu dois respecter sans exception :** tu n'inventes aucun taux, aucun seuil, aucun plafond, aucun barème. Quand une valeur chiffrée réglementaire est nécessaire, tu déclares une constante nommée et typée avec la valeur `null` et un commentaire `// À RENSEIGNER — source: `. Je remplirai moi-même depuis les sources officielles.
>
> Ne code rien pour l'instant. Réponds-moi avec : l'arborescence de fichiers que tu proposes, et la liste exhaustive des constantes réglementaires dont le moteur aura besoin.

**Pourquoi commencer comme ça :** tu obtiens la liste des valeurs à aller chercher avant d'avoir une ligne de code. Tu peux paralléliser — Kimi code pendant que tu collectes les barèmes.

---

## PROMPT 1 — Moteur de calcul + tests

> Implémente maintenant `src/engine/` uniquement. Pas d'UI, pas de composant React.
>
> Le moteur doit exposer une fonction pure par statut juridique, chacune prenant un objet d'entrée typé et retournant un objet de résultat typé détaillant chaque poste (CA, cotisations, impôt, net disponible).
>
> Écris en parallèle les tests unitaires (Jest) qui couvrent : le cas nominal, les bornes de seuils, et les entrées invalides.
>
> Les constantes viennent exclusivement de `src/data/`. Tu ne les redéfinis nulle part ailleurs et tu n'en inventes aucune.

---

## PROMPT 2 — UI

> Construis maintenant l'interface. Un seul écran principal : formulaire de saisie en haut, résultats détaillés en dessous, recalcul en temps réel.
>
> Contraintes : composants React Native natifs uniquement, pas de librairie UI tierce. Le design doit rester sobre et lisible. L'UI ne contient aucune logique de calcul — elle appelle le moteur.
>
> Ajoute en bas d'écran une mention permanente : « Estimation indicative. Ne constitue pas un conseil fiscal ou comptable. »

**Cette mention n'est pas cosmétique.** Elle te protège juridiquement et elle évite les questions de review sur les apps touchant à la fiscalité.

---

## PROMPT 3 — Persistance

> Ajoute la sauvegarde locale des paramètres de l'utilisateur avec AsyncStorage.
>
> Rien d'autre n'est stocké. Aucun identifiant, aucune donnée nominative, aucun historique envoyé où que ce soit.

---

## PROMPT 4 — Préparation store

> Prépare l'app pour une publication sur Google Play :
> - configuration `app.json` complète (nom, slug, version, versionCode, package android en reverse-domain)
> - icône et splash screen aux formats requis
> - liste des permissions Android déclarées — je veux qu'elle soit vide
> - commandes EAS Build pour générer un AAB de production
>
> Dis-moi explicitement quelles permissions Expo ajoute par défaut et comment les retirer.

**Point d'attention :** Expo ajoute parfois des permissions par défaut (INTERNET notamment). Une permission non justifiée déclenche des questions dans la déclaration Play. Vise zéro.

---

## Règles d'itération

1. **Un prompt = un objectif.** Ne demande jamais « fais l'UI et le calcul et les tests ». Tu perds le contrôle de la revue.
2. **Le moteur avant l'UI, toujours.** Si les calculs sont faux, une belle UI ne sert à rien.
3. **Les tests avant l'écran.** C'est ce qui te permet de vérifier les barèmes sans lancer l'app.
4. **Ne laisse jamais Kimi « corriger » un fichier de `src/data/`.** Si un test échoue, c'est le moteur qui est faux ou ta constante qui est mauvaise — pas à l'IA de trancher.
5. **Quand ça part en vrille, relance depuis Prompt 0.** Plus rapide que de débattre avec le contexte pollué.

---

## Ce que tu dois collecter toi-même

Sources officielles uniquement, aucun blog, aucun comparateur :

| Donnée | Source |
|---|---|
| Taux de cotisations micro-entreprise (BNC / BIC) | urssaf.fr |
| Seuils de CA micro-entreprise | service-public.fr / BOFiP |
| Abattements forfaitaires micro | BOFiP |
| Versement libératoire — conditions et taux | service-public.fr |
| Barème de l'impôt sur le revenu | impots.gouv.fr |
| Taux IS et seuil du taux réduit | impots.gouv.fr |
| Cotisations TNS (gérant EURL) | urssaf.fr |
| Cotisations assimilé salarié (président SASU) | urssaf.fr |
| Seuils et taux de TVA (franchise en base) | impots.gouv.fr |

Note la date de consultation à côté de chaque valeur. Les barèmes changent au 1er janvier — c'est ta contrainte de maintenance annuelle, et accessoirement ton argument futur si tu passes un jour sur un modèle récurrent.

---

## Ordre d'exécution

1. Vérifier / corriger l'adresse sur le DUNS
2. Ouvrir la Play Console (25 $, compte organisation, nom légal exact)
3. Prompt 0 → collecte des barèmes en parallèle
4. Prompts 1 à 4
5. Build AAB, test interne, soumission
6. **Documenter chaque friction rencontrée** ← c'est ça, le vrai livrable
