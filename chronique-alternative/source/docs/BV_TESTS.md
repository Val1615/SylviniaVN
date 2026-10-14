# Bellirith × Valurn : tests

Commande : `npm run test:bv-cross` (dans `npm test`). 80 contrôles, 450 parties simulées (3 profils de sauvegarde × 150 graines, réponses reconnaître / nier / esquiver alternées).

| Point §14 | Contrôle |
|---|---|
| 1-4 déblocage, nouvelle partie | BV03-BV08, BV13 |
| 5-8 durée, ordre, tours complets | BV23-BV26, BV72, BV73 |
| 9-10, 13 options | BV27, BV28 |
| 11-12 cibles PNJ | BV74 |
| 14-17 nombre de buveurs, répliques | BV39, BV75 |
| 18-25 pression, précision, connaissances | BV35, BV40, BV47, BV48 |
| 26-27 aveu volontaire | BV41, BV47 |
| 28 reprise | BV44, BV45, BV46 |
| 29-43 canon et révélations | BV29-BV33, BV64-BV66, BV71, BV79, BV80 |
| 44-47 fins et transition | BV16, BV22, BV76, BV77 |
| 48-55 intimités | BV49-BV58 |
| 56-58 épilogues, style | BV42, BV43, BV76 |
| 59 non-régression | BV01, BV02, BV78, suites existantes |
| 60 interface | BV67-BV70, captures 830×525 et 1024×880 |
| écriture | BV59-BV63, `test:intimate-vocabulary` |

Contrôles de vocabulaire : `test:intimate-vocabulary` couvre désormais les intimités BV (euphémismes ≤ 2 par scène, formules figées ≤ 1, termes crus interdits). BV51-BV54 ajoutent positions (une par séquence, distinctes) et longueur (moyenne ≥ 90 mots, au moins 6 séquences ≥ 110 mots).
