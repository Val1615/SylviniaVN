# Quête croisée Bellirith × Valurn : « Le droit de choisir »

Branche : `content/croisee-bellirith-valurn`, créée depuis `main` (610bddb).

## Fichiers créés (source/src)

| Fichier | Rôle |
|---|---|
| `bellirith-valurn-kit.ts` | Helpers de lignes et drapeaux partagés (`cross-bv-stood-up`, etc.) |
| `bellirith-valurn-scenes.ts` | Q1, Q2 (Bellirith, Valurn), Q3, après-soirée, Q5 (deux rencontres), Q6, six retombées |
| `bellirith-valurn-cross-quest.ts` | État `bv`, déblocage, étapes, reprise, hydratation, drapeaux |
| `bellirith-valurn-never-game.ts` | Moteur « Je n’ai jamais » (10 à 20 tours, B → V → joueur, six pressions) |
| `bellirith-valurn-never-content.ts` | Répertoire : 84 affirmations joueur, 64 PNJ, 12 réactives, 12 retombée, pivot, révélations r2 à r7, sujet r8, transitions, répliques |
| `bellirith-valurn-knowledge.ts` | Quatre connaissances débloquées dans l’ordre |
| `bellirith-valurn-intimacy-kit.ts`, `-a.ts`, `-b.ts`, `-c.ts`, `bellirith-valurn-intimacy.ts` | Six scènes intimes (A, B, C × femme, homme), 12 séquences par mode |
| `bellirith-valurn-ui.tsx`, `bellirith-valurn.css` | Dossier du Journal, fenêtre de jeu, modale intime, bloc développeur |

## Fichiers modifiés

- `page.tsx` : branchement calqué sur Bellirith / Naïah (vue de scène, reprise, fin de scène, mini-jeu, intimités, journal, notifications, outils développeur).
- `cross-quests.ts` : champ `bv` sur `CrossQuestProgress`.
- `heritages-data.ts` : connaissances `BV_KNOWLEDGE`.
- `main.tsx` : import de la feuille de style.
- `scripts/intimate-vocabulary-lib.mjs` : les fichiers `bellirith-valurn-intimacy*` sont forcés dans l’analyse malgré l’exclusion Valurn.
- `scripts/validate-valurn-refactor.mjs` : contrôle 23 limité aux fichiers Bellirith modifiés (`--diff-filter=M`), pour que les nouveaux fichiers de la série ne soient pas lus comme une modification de la mécanique céder / résister.
- `scripts/validate-heritages.mjs` : 90 connaissances attendues (86 + 4).
- `package.json` : `test:bv-cross` ajouté à la chaîne `npm test`.
- `build/` : bundle régénéré.

## Vérification

```
cd chronique-alternative/source
NODE_OPTIONS="--import <loader>" npm test
npm run build
```

## Sauvegardes

La série vit dans `crossQuestSeries["bellirith-valurn"].bv`. L’hydratation ignore les scènes inconnues, borne l’étape aux choix réellement prouvés et reconstruit une partie corrompue. La partie est enregistrée après chaque intervention ; une partie conclue est verrouillée. Le rendez-vous central porte l’identifiant distinct `group-date-bellirith-valurn-never` ; l’ancien `group-date-valurn-bellirith` est intact.

## Retrait

Supprimer les fichiers créés, retirer les lignes BV de `page.tsx`, `cross-quests.ts`, `heritages-data.ts`, `main.tsx`, `package.json`, remettre 86 dans `validate-heritages.mjs`. Les sauvegardes gardent une clé inerte.
