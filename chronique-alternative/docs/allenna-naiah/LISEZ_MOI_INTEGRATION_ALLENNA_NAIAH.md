# Intégration Allenna × Naïah

Branche `feat/allenna-naiah`, partie de `main` e6dde93. Rien n'est fusionné.

## Contenu
- La quête croisée commence après la révélation du leurre, en fin d'Acte I. Elle compte Q1 à Q7 et deux moments facultatifs, m1 et m2. Les fichiers sont `src/allenna-naiah-scenes.ts` et `src/allenna-naiah-scenes-b.ts`.
- Le mini-jeu « Les fils sous la cendre » (`src/allenna-naiah-minigame.ts`) contient 14 indices, dont 6 visibles au départ. Il propose 7 hypothèses vraies, dont H7 qui est facultative, et 3 fausses. Il y a 3 niveaux d'indice et aucun minuteur. On peut le rejouer sans effet.
- Trois rendez-vous se jouent dans n'importe quel ordre : le lac, la halte du Fleuve bleu et le logis. Chacun a 3 branches (`src/allenna-naiah-dates.ts`).
- Il y a 9 extensions à trois de 12 séquences chacune (`src/allenna-naiah-intimacy-*.ts`). La séquence 5 offre 3 initiatives, la séquence 10 une bifurcation à 3 options. Chaque extension a une variante romance et une variante amitié. On peut s'arrêter à tout moment avec « Arrêter ici », et un point de reprise est sauvegardé.
- Tellia reste en arrière-plan. Il n'y a que des drapeaux : `knows_tellia_name` et `has_tellia_portal_document` sont posés en Q5. Le bordereau n'apparaît dans le Journal qu'après Q5. Voir ACTE_II_TELLIA_HOOKS.md.
- Interface (`src/allenna-naiah-ui.tsx` et `src/allenna-naiah.css`) : le dossier du Journal s'affiche dans l'onglet Croisées. Le mini-jeu est responsive, avec des onglets en portrait. Le bloc développeur se trouve dans Options, Session.
- `page.tsx` reçoit l'hydratation, le déblocage, les enchaînements Q3 → Q4 → enquête → Q5 → Q6, la musique et les modales. `cross-quests.ts` reçoit le champ facultatif `an`.

## Conditions
- Déblocage : Acte I accompli avec le leurre révélé, Allenna et Naïah connues.
- Garde Amanea : la forêt est fermée quand Amanea y séjourne, et la halte quand elle voyage. Amanea n'apparaît jamais dans le casting de la quête.
- Rendez-vous : affection et confiance d'au moins 20 avec Allenna et avec Naïah. Le mode développeur lève ce seuil.

## Ressources réemployées
Aucun asset n'a été créé ni modifié : le sha256 de `assets/` est identique avant et après.
- Décors : refuge_ruins, route_river, akuhn.webp, deep_archives, forestier_inn, forestier_room et le décor du logis du joueur.
- Musiques : forbidden, tension, infiltration, captive, wild-calm, star-night-soft, forestier-ost et intimate.
- Sprites : uniquement les sprites standards d'Allenna et de Naïah, sans CG.

## Tests
`NODE_OPTIONS="--import /tmp/tsc/register.mjs" npm test` lance 32 suites, dont la nouvelle `test:an-cross` (`scripts/validate-an-cross.mjs`, 20 contrôles).
