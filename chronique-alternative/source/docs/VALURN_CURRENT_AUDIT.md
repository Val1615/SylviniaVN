# Valurn Saël · audit de l'existant (avant refonte, origin/main 804d2f1)

| Élément | État avant | Décision |
| --- | --- | --- |
| Scènes `valurn-0` à `valurn-4` | arc linéaire « dette / vérité », confidences de dette et de retour | remplacées par 7 quêtes `valurn-q1` à `valurn-q7` ; anciennes scènes migrées (drapeaux `valurn-legacy-scene:N`, `valurn-legacy-arc`) |
| Confidences `knows_valurn_old_promise`, `did_not_return` | suggéraient le contenu du secret de continuité | neutralisées (résumés vagues) ; aucune confidence Valurn ne les accorde plus |
| `VALURN_BELLIRITH_CONFIDENCES` | révélaient l'ancienne promesse | vidées ; `sbg80-push-valurn` réécrit, exige `knows_valurn_bellirith_past` |
| `valurn-after-truth` (social) | révélation du secret | supprimée |
| `shared-valurn-bellirith` | formules allusives (« même fin », « cessé d'être drôle ») | neutralisées, scène conservée |
| Lettres `letter-valurn-debt/truth`, invitation `invite-valurn-market` | ancienne intrigue | réécrites dans `valurn-living-world.ts` (mêmes identifiants conservés quand utile à la sauvegarde) |
| Rendez-vous Valurn | deux scènes courtes sans branches | `date-valurn-forestier`, `date-valurn-river` : 3 branches × 5 temps ; logis : 3 branches × 3 manches |
| Intimité Valurn | profil générique | 9 continuités × 12 séquences × 4 modes × 3 morphologies |
| Moments libres | 3 choix de résonance pouvant suggérer de la magie | remplacés (cartes, pièce, ombre) ; 8 moments ajoutés |
| Seuils de lien | `BOND_THRESHOLDS` 6 paliers | `[0,5,14,26,40,48,56]`, stade Valurn calculé sur les quêtes (`valurnQuestStage`), plafonné à 5 |
