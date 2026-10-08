# Bellirith & Naïah · « L’anomalie » : intégration

Série croisée de la Chronique Alternative : six étapes (Q1 à Q6), le mini-jeu « Les Trois Réponses », trois intimités optionnelles et le rendez-vous final « Regarde-moi ».

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `src/bellirith-naiah-cross-quest.ts` | Clé `bellirith-naiah`, titres, objectifs, drapeaux, déblocage, hydratation, avancement, mini-jeu, intimités, effets |
| `src/bellirith-naiah-minigame.ts` | Les Trois Réponses : 3 réponses, cycle, 6 manches (essai + hors échelle), état sérialisable, clôtures, petit bonus |
| `src/bellirith-naiah-scenes.ts` | Q1 à Q6 (variantes selon l’histoire avec Bellirith et les intimités vécues) |
| `src/bellirith-naiah-date.ts` | Rendez-vous final « Regarde-moi » et trois moments libres d’après-série |
| `src/bellirith-naiah-kit.ts` | Aides d’écriture, `BN_FORM = "bellirith-as-amanea"` |
| `src/bellirith-naiah-intimacy*.ts` | Trois scènes intimes en 4 modes × 3 corps, visuels (CG, sprites) |
| `src/bellirith-naiah-ui.tsx` | Dossier du Journal, modale du mini-jeu, modale intime, bloc développeur |
| `src/bellirith-naiah.css` | Mini-jeu responsive (830×525 → 1920×1080), manche hors échelle, forme |
| `scripts/validate-bellirith-naiah-cross.mjs` | Validateur §81 (`npm run test:bn-cross`, inclus dans `npm test`) |
| `scripts/e2e/shots_bn.py`, `scripts/e2e/saves/save-bn.json` | Captures Playwright |

`page.tsx` reçoit : hydratation (`id === BN_KEY ? hydrateBN`), déblocage dans `evolveCrossQuests` + notification, `startBNScene` / `openBNDialogue` (reprise au point de contrôle, distribution restaurée), `startBNMoment`, `startBNMinigame` / `setBNMinigameState` / `finishBNMinigame`, `startBNIntimacy` / `closeBNIntimacy`, la musique portée par une réplique (`DialogueLine.music`), l’atténuation de la musique pendant la manche hors échelle, le sprite de la forme dans `DialogueOverlay`, le dossier dans le Journal (onglet « Croisées ») et le bloc développeur.

## Déblocage

Les quatre conditions, toutes requises : acte I terminé (`main-story-act-1-complete` ou `main-story-complete`), Naïah à l’étape 5, Bellirith à l’étape 5, les deux rencontrées. Entrée de journal : « Quêtes croisées · Bellirith & Naïah · L’anomalie ».

## Étapes

| Étape | Scène | Lieu | Musique |
| --- | --- | --- | --- |
| 0 | Q1 « L’anomalie » | Auberge forestière | `midnight-waltz` (joueuse) |
| 1 | Q2 « Tu simules » · intimité optionnelle « Les coussins volés » | Ruines interdites | `bellirith-encounter` · scène : `star-night-soft` |
| 2 | Q3 « Les Trois Réponses » puis la partie (l’étape n’avance qu’à la fin de la partie) | Salle de bal d’Al’Gratal | `infernal-trade` |
| 3 | Q4 « Jusqu’où ? » · intimité optionnelle « La barque » | Halte du Fleuve bleu | `marble-moon` · scène : `two-stars-night` |
| 4 | Q5 « Même là ? » · grande scène « Même là ? » | Appartements du palais | `two-stars-night` · scène : `intimate` (plus chaude) |
| 5 | Q6 « Quelque chose d’autre » (révélation : Amanea) | Clairière des Échos | `captive` |
| 6 | Rendez-vous final « Regarde-moi » | Sanctuaire interdit | `midnight-waltz`, puis `unbroken-ice` (froide) dès la métamorphose |
| 7 | Série accomplie · moments libres « Celle-là, tu la joues. » | | |

Refus et report : Q2 et Q4 proposent accepter / plus tard / refuser ; Q5 accepter / refuser. « Plus tard » laisse l’intimité dans le dossier jusqu’à Q5 ; le refus ne coûte rien. Interrompre Q5 (« Interrompre ici ») ouvre la scène de la porte, où la chute est entendue depuis le couloir. Aucune intimité après le rendez-vous final, et aucune dans les moments libres.

Variantes : `bellirith-has-slept`, `bellirith-favorite`, `bellirith-has-resisted`, intimités vécues, résultat de la partie, Q5 vécue ou quittée.

## Les Trois Réponses

ASSUMER, SIMULER, RETOURNER. SIMULER bat ASSUMER, RETOURNER bat SIMULER, ASSUMER bat RETOURNER. Bellirith annonce la réponse qu’elle lit ; jouer celle qui la bat donne la manche à Naïah. Manche 1 : essai guidé. Manche 6 : « SIGNAL HORS ÉCHELLE » (aucune réponse attendue, animations coupées, désaturation, musique à 15 %, Bellirith ne sourit plus). Aucune défaite ne bloque ; le résultat colore la suite et accorde un petit bonus (jamais de désir pour Naïah). La partie est sauvegardée à chaque coup et reprise à l’identique ; la relecture travaille sur un état local.

## Intimités (mots, min/moy/max sur les 3 corps)

| Scène | Tendre | Suggestif | Explicite | Fondu au noir |
| --- | --- | --- | --- | --- |
| « Les coussins volés » (10 séquences) | 619 | 720 | 1052/1060/1069 | 232 |
| « La barque » (9 séquences) | 579 | 625 | 879/887/896 | 184 |
| « Même là ? » (14 séquences) | 866 | 1009 | 1250/1258/1265 | 243 |

Q5 est vue de l’extérieur : aucune pensée intérieure, aucune jauge de désir. Naïah prend l’initiative ; son « Oui » est dit, puis réaffirmé (« Oui. Je le dis, et je le pense. ») avant l’exception. La chute « Mais tu ne ressens toujours rien ! » est suivie d’une précision, puis du rire de Naïah.

Exception de pénétration : uniquement en Q5, uniquement en mode explicite, uniquement par Bellirith, qui façonne son corps de succube (« Je peux être ce qu’il faut. »), « sans forcer », prête à tout arrêter au premier mot. Les deux autres scènes ne pénètrent jamais Naïah ; le joueur n’a de contact génital qu’avec Bellirith.

## Sprites

Les six PNG intimes de Bellirith (`assets/sprites-intimate/bellirith/`, copiés avec `cp`, aucune retouche) : `teasing`, `haughty`, `inviting`, `hungry`, `sultry`, `smug`. Mode explicite uniquement, après la révélation : 16 routes dédiées de Bellirith (pistes par route), ses deux rendez-vous à trois (Valurn, Naïah) et les trois scènes BN. Naïah garde ses sprites ; la forme du rendez-vous final utilise le sprite standard d’Amanea, sous l’identité de Bellirith.

## Amanea

Jamais dans la distribution (`bellirith-as-amanea` est un emplacement de rendu), jamais nommée dans le dossier, les objectifs ou le mini-jeu, nommée pour la première fois au cœur de Q6. Aucune relation ni aucun drapeau Amanea / Naïah n’est modifié ; le journal n’écrit jamais qu’Amanea est venue. Sous la forme, Bellirith dit au plus « Naïah. ».

## Drapeaux

`cross-bn-started`, `-simulation-discovered`, `-minigame-complete`, `-first-intimacy`, `-limit-intimacy`, `-penetration-exception`, `-anomaly-detected`, `-amanea-form-seen`, `-final-date-complete`, `-series-complete`, dérivés de l’état (`bnFlags`).

## Sauvegarde

Format v18 inchangé. `hydrateBN` filtre les choix inconnus, invalide un point de contrôle ou une partie corrompus, ne fabrique aucun choix et ramène une étape 7 sans rendez-vous final vécu à l’étape 6 (aucune complétion automatique).

## Mode développeur

Options → Session → « Bellirith / Naïah » : démarrer, placer à une étape, marquer accomplie, effacer (seules actions qui écrivent) ; ouvrir chaque scène, Q5 directement, le rendez-vous final, les moments libres ; lancer la partie, forcer une manche, la manche hors échelle, rejouer une manche et tester les trois réponses ; ouvrir chaque intimité dans chacun des quatre modes. Les ouvertures sont des souvenirs : aucun gain, aucun temps, aucune mutation.

## Tests

`npm test` (inclut `test:bn-cross`), `npm run build`. Captures : `scripts/e2e/shots_bn.py`.
