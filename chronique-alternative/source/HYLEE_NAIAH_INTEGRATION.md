# Hylee / Naïah — série croisée

La série est accessible depuis **Journal → Croisées** après l’Acte I et les cinq premières scènes personnelles de chacune. Elle fonctionne en amitié, avec un désir à zéro et sans logement jusqu’à l’invitation finale.

| Étape | Rencontre | Initiative / conséquence |
| --- | --- | --- |
| 0 | Ça me rappelle Hylee | Naïah demande une occasion de revoir son ancienne amie. |
| 1 | Quelques minutes | Une première halte écourtée, avec leur familiarité toujours présente. |
| 2 | Trop vouloir refaire comme avant | L’ancien parcours ne correspond plus aux envies d’Hylee. |
| 3 | Près de l’Auberge | Hylee fuit ; trois issues exclusives pour sa mère. |
| 4 | Retrouver Hylee | Enquête, retrouvailles et vérité, sans réconciliation immédiate. |
| 5 | Un endroit à moi | Rendez-vous autonome : Hylee dirige le jeu au petit lac. |
| 5 | Une seule chose | Rendez-vous autonome : Naïah propose une activité et accepte les choix d’Hylee. |
| 5 | Ce soir, c’est toi | Rendez-vous autonome au logis (logis requis) : cuisine, jeu ou musique, et le joueur mène la soirée. |

À partir de l’étape 5, les trois rendez-vous sont **indépendants** : aucun ordre imposé, aucun prérequis entre eux, aucune référence de l’un à l’autre, désir 0 suffisant pour les vivre. Chaque rendez-vous accompli ajoute 1 à la progression (8 = les trois). Les flags `cross-hn-hylee-date-complete`, `cross-hn-naiah-date-complete` et `cross-hn-home-date-complete` sont calculés d’après les rendez-vous réellement joués ; `cross-hn-world-friendship` est posé dès que deux rendez-vous ont eu lieu, `cross-hn-series-complete` quand les trois sont faits.

## Continuations intimes (sex-friends)

- Chaque rendez-vous propose, **uniquement si Hylee ET Naïah ont un désir ≥ 25**, un dernier choix de bascule (`dateOutcome: "great"`) : au lac, Hylee relance une manche à gages ; dans la clairière, Naïah « oublie » de ranger le dernier fil ; au logis, le joueur annonce une dernière partie à ses règles. Refuser (« Pas ce soir » / « Rester complices ce soir ») ne coûte rien.
- Les contextes `group-date-hylee-naiah-place`, `-one` et `-home` passent par `isManualGroupIntimacy` (`hylee-naiah-group-intimacy.ts`). L’ancien `group-date-hylee-naiah` n’est conservé qu’en compatibilité (`legacyOnly`).
- Écriture manuelle : `hylee-naiah-intimacy-place.ts` (H1–H3), `hylee-naiah-intimacy-one.ts` (N1–N3), `hylee-naiah-intimacy-home.ts` (L1–L3), soit 27 routes (9 branches × femme / homme / intersexe) × 4 modes, 12 séquences minimum par mode, 1000+ mots en explicite.
- Un mini-jeu par rendez-vous (4 manches × 3 options, sans morale) ; l’issue discordante mène à une bataille (eau, fils, coussins) et la scène continue.
- Le sort de la mère ajoute une trace légère dans un chapitre de chaque route (`HYLEE_NAIAH_MOTHER_TRACES`).
- CG et sprites intimes : uniquement les ressources existantes `hylee_naiah_reveal` / `hylee_naiah_post_orgasm` et les humeurs intimes déjà dessinées. Aucun drapeau de romance à trois ; une relecture n’écrit aucun drapeau.

## Mode développeur

Options → Mode développeur : « Préparer toutes les relations » (désir 80), « Installer un logis de test », puis dans la ligne « Hylee & Naïah » choisir le sort de la mère (tuée / mémoire effacée / état végétatif) pour ouvrir directement les trois rendez-vous. « Accès direct aux scènes intimes → Rendez-vous à trois » liste aussi les trois continuations Hylee / Naïah en mode souvenir.

## État et intégration

- `game.crossQuestSeries["hylee-naiah"].hn` conserve les choix, le checkpoint de conversation, l’issue de la mère, l’enquête et les rencontres accomplies. Les anciennes sauvegardes sans cette clé restent compatibles.
- `hylee-search.ts` contient le moteur indépendant de React : quatre scénarios cohérents, trois catégories de quatre cartes, indices pondérés, sources ciblées, huit actions et repli à trois instabilités. Le repli conserve scénario, indices, notes et hypothèse.
- `hylee-naiah-ui.tsx` présente le dossier partagé et la modale `{ kind: "hylee-search" }`, avec didacticiel en quatre pages, reprise, clavier, Escape et restauration du focus.
- `hylee-naiah-cross-quest.ts` et `hylee-naiah-dates.ts` contiennent les scènes et les réponses écrites pour chaque choix. Les gains sont appliqués une fois ; reprendre une réponse ne répète pas ses effets.
- Les relectures de scènes, de rencontres et du mini-jeu ne changent ni l’horloge, ni les relations, ni les flags, ni les résultats canoniques.

Les huit illustrations proviennent du prototype HTML fourni, converties en WebP sous `chronique-alternative/assets/cross/hylee-naiah-search/`. Les manifestations utilisent ces ressources avec des traitements CSS ; aucun HTML autonome ni HUD parallèle n’est embarqué.

## Continuité

Ressources consultées : la Bible maîtresse V1.1, le Tome 1, le Tome 2-1 et les routes personnelles actuelles du dépôt. Hylee a quitté l’Auberge avec l’aide de Remerii ; le père a été emmené par les gardes et la mère est toujours vivante au début de cette série. Les révélations futures du Tome 2 ne sont pas anticipées.

La mère peut être tuée, perdre les souvenirs qui la ramèneraient à Hylee ou subir une lésion mentale après l’interruption du sort. Une seule issue persiste. La menace de Naïah dans la première branche et sa peur pour le joueur dans la troisième ne sont pas transformées en plaisanteries. Les retrouvailles et les rencontres suivantes rappellent l’issue retenue.

La voie amicale reste toujours disponible : chaque rendez-vous se conclut sans intimité (rire, conversation, activité inachevée, objet insignifiant volé puis rendu par Naïah, rangement avec Hylee). Les continuations intimes décrites plus haut sont facultatives et ne forment pas une romance à trois.

## Validation

Depuis `chronique-alternative/source` :

```sh
npm ci
npm test
npm run build
```

`npm run test:hn-cross` exerce les quatre scénarios dans les trois issues, les replis, les anciennes sauvegardes, une série complète dans chaque branche avec rechargement après chaque choix, les trois activités au logis, les trois rendez-vous dans un ordre libre, la bascule intime à désir 25 (absente avec un seul désir suffisant), le refus sans coût et les relectures (y compris intimes) sans modification de partie. `npm run test:group-intimacy` exécute aussi `validateHyleeNaiahIntimacy()` (27 routes, 12+ séquences, mots minimums, voix, vocabulaire interdit, Naïah jamais cible génitale). Il vérifie aussi la disparition d’Hylee avant le choix concernant sa mère.

Vérification navigateur effectuée sur le build de production en 1440 × 900, 412 × 915, 830 × 525 et 960 × 600 avec texte à 140 % et interface à 125 %. Ouverture depuis le Journal, didacticiel automatique, confinement du focus, Tab / Maj+Tab, Escape, sauvegarde d’un indice et reprise ont été contrôlés, avec Reduced Motion. Aucun débordement horizontal de la modale ni erreur JavaScript observé.

Les avertissements Vite sur les ressources publiques et la taille du bundle restent présents ; ces ressources sont servies par le site et ne sont pas intégrées au bundle JavaScript. Les fichiers `build/chronique.js` et `build/chronique.css` ont été reconstruits.
