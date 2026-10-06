# Hylee / Naïah — série croisée

La série est accessible depuis **Journal → Croisées** après l’Acte I et les cinq premières scènes personnelles de chacune. Elle fonctionne en amitié, avec un désir à zéro et sans logement jusqu’à l’invitation finale.

| Étape | Rencontre | Initiative / conséquence |
| --- | --- | --- |
| 0 | Ça me rappelle Hylee | Naïah demande une occasion de revoir son ancienne amie. |
| 1 | Quelques minutes | Une première halte écourtée, avec leur familiarité toujours présente. |
| 2 | Trop vouloir refaire comme avant | L’ancien parcours ne correspond plus aux envies d’Hylee. |
| 3 | Près de l’Auberge | Hylee fuit ; trois issues exclusives pour sa mère. |
| 4 | Retrouver Hylee | Enquête, retrouvailles et vérité, sans réconciliation immédiate. |
| 5 | Un endroit à moi | Hylee dirige une rencontre au petit lac. |
| 6 | Une seule chose | Naïah propose une activité et accepte les choix d’Hylee. |
| 7 | La prochaine fois | Le joueur accueille une soirée au logis ; elles organisent leur prochaine sortie. |

La progression atteint 8 à l’achèvement. Leur amitié reprend avant l’achat du logis : le flag `cross-hn-world-friendship` est posé après la rencontre de Naïah.

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

Les variantes romantiques sont facultatives et non explicites, réservées à une configuration Hylee / Naïah déjà vécue et aux seuils relationnels correspondants. La voie amicale reste toujours disponible. Aucune continuation sexuelle nouvelle n’a été ajoutée.

## Validation

Depuis `chronique-alternative/source` :

```sh
npm ci
npm test
npm run build
```

`npm run test:hn-cross` exerce les quatre scénarios dans les trois issues, les replis, les anciennes sauvegardes, une série complète dans chaque branche avec rechargement après chaque choix, les trois activités au logis et les relectures sans modification de partie. Il vérifie aussi la disparition d’Hylee avant le choix concernant sa mère.

Vérification navigateur effectuée sur le build de production en 1440 × 900, 412 × 915, 830 × 525 et 960 × 600 avec texte à 140 % et interface à 125 %. Ouverture depuis le Journal, didacticiel automatique, confinement du focus, Tab / Maj+Tab, Escape, sauvegarde d’un indice et reprise ont été contrôlés, avec Reduced Motion. Aucun débordement horizontal de la modale ni erreur JavaScript observé.

Les avertissements Vite sur les ressources publiques et la taille du bundle restent présents ; ces ressources sont servies par le site et ne sont pas intégrées au bundle JavaScript. Les fichiers `build/chronique.js` et `build/chronique.css` ont été reconstruits.
