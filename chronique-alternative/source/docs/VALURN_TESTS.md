# Valurn Saël · tests

Commande : `npm run test:valurn` (inclus dans `npm test`). Harnais : vite `ssrLoadModule`, hooks React substitués, parcours réel des quêtes.

Contrats : 1 à 27 de la consigne §14 et 12 bis, plus E1 à E7 (35 au total). Le contrat 28 correspond à `npm test` complet + `npm run build` + typecheck (aucune nouvelle erreur TypeScript ; 16 erreurs préexistantes).

| Code | Objet |
| --- | --- |
| 12 bis | vocabulaire interdit absent du corpus Valurn et de la documentation ; proche regretté anonyme et non genré |
| 14 | lettres prêtes après le fil, lecture persistante, aucune exigée par une quête |
| 16 | ≥ 20 moments, variantes, lieux repérables |
| 18 | 3 branches × ≥ 5 temps, fins propres ; logis 3 × 3 |
| 19 à 21 | 4 modes × 12 séquences, variantes femme et homme distinctes, aucune route intersexe, jalons CG 3 et 9 |
| 22, 23 | scènes Iriana/Valurn et statut platonique ; fichiers Bellirith intacts hors `bellirith-living-world.ts` |
| 25 | migration d'une sauvegarde ancienne |
| E1 à E5 | tirets, « ce n'est pas X, c'est Y », vocabulaire cru, plafond d'euphémismes (≤ 2 par scène et par mode), motifs surexploités |
| E6, E7 | structure ; vocabulaire interdit absent du bundle |
| 17 | rendez-vous et logis fermés avant `valurn-q7`, ouverts après |

Captures : `scripts/e2e/shots_valurn.py` → `/workspace/vn-redesign/compare/valurn/` (830x525, 1024x880).
