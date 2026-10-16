# Rapport de validation : Allenna × Naïah

## Tests automatiques (réels, 15/10/2026)
- La commande `NODE_OPTIONS="--import /tmp/tsc/register.mjs" npm test` sort avec le code 0. Les 32 suites passent, y compris test:intimate-vocabulary, test:bv-cross, test:vie et la nouvelle test:an-cross.
- `test:an-cross` passe ses 20 contrôles : AN1 à AN8, MG1 à MG3, DT1, EX1, EX2, ST1 à ST3, UI1, IN1 et AS1.
- Volumes mesurés : 9 scènes, 286 choix, 14 indices, 7 hypothèses vraies et 3 fausses, 3 rendez-vous de 3 branches chacun, 9 extensions totalisant 108 séquences. Les 900 répliques de plus de 24 caractères sont toutes uniques.
- tsc : 16 erreurs, toutes déjà présentes dans la base. Le travail n'en ajoute aucune.
- Sauvegardes : le contrôle AN6 recharge une sauvegarde v18 au jour 400, sans série AN puis avec une série en cours. AN5 vérifie qu'une progression corrompue ou mensongère est nettoyée.
- Assets : le sha256 de tous les fichiers de `assets/` est identique avant et après le build.
- Build : `vite build` réussit, et `build/` est commité.

## Matrice de tests manuels
| Cas | 830×525 | 1024×880 | 880×1024 |
|---|---|---|---|
| Enquête : ouverture, sélection d'indices, hypothèses | OK (capture) | OK (capture) | OK, onglets portrait (capture) |
| En-tête de l'enquête non tronqué | Corrigé pendant la session | OK | Corrigé |
| Rendez-vous du lac, dialogue et sprites | | OK (capture) | |
| Dossier dans le Journal, onglet Croisées | | OK (capture) | |
| Erreurs JS de page | aucune | aucune | aucune |

Non vérifiés à l'œil, mais couverts par les tests automatiques : les extensions complètes, la reprise sur point de contrôle, et les modes Histoire et Classique.

## Adaptations et écarts par rapport au pack
1. **Extensions à trois et règles de Naïah.** Le pack décrit des extensions sensuelles à trois. Les règles permanentes l'emportent : Naïah n'éprouve jamais de désir, son orientation n'est jamais nommée, et elle n'est jamais pénétrée (l'exception Bellirith ne s'applique pas ici). Elle participe par la tendresse, la présence et des gestes qu'elle choisit. Dans la ligne romance, la séquence 9, la plus intime, est voilée : Naïah annonce d'elle-même qu'elle s'éloigne, et seuls Allenna et le joueur restent. Les effets de Naïah n'ont aucune statistique de désir. Ces points sont vérifiés par EX2.
2. **Consentement.** Chaque extension commence par un accord explicite des trois personnages (EX1). On peut arrêter à tout moment.
3. **Texte du joueur.** Le joueur peut être une femme ou un homme, et aucun utilitaire de genre n'existe. Toutes les répliques adressées au joueur sont donc neutres.
4. **Q6 à l'aube.** Amanea consulte les archives à l'aube. Q6 se déroule donc dans l'aile de transit et l'escalier gardé, jamais dans les mêmes salles qu'elle.
5. **Lineva.** Une allusion à sa soupe a été retirée, pour ne pas multiplier le gag de sa mauvaise cuisine.
6. **Tellia.** Son nom n'apparaît qu'en Q5, sans pronom genré, sans identité et sans motif.
7. **Enquête à 830×525.** Le bouton « Confronter » se trouve sous la ligne de flottaison, dans un panneau qu'on fait défiler.

## Inférences de lore sans source
- L'enfance de Naïah au palais : le bassin aux poissons, le maître d'armes.
- La fontaine déplacée, l'ancienne rune de garde, la fenêtre murée.
- Le dépôt de la citerne, la poterne des fondeurs, la voie de service des fondateurs.
- Tellia, création du pack, sans détails ajoutés.
- Les détails du lac de brume, de la halte (table, dés, pluie) et du logis (cuisine, objets, toit).
