# Audit des flags · Final du Tome I (Chapitres XVII, XVIII, Épilogue)

Tous les flags vivent dans `state.flags` et sont enregistrés dans la sauvegarde `sylvinia_vn_v82`, sans changer son format. Aucun flag ne modifie les valeurs (stats) : rien ne peut être « farmé » en rejouant.

## Flags lus (posés par les chapitres précédents)

| Flag | Posé par | Rôle dans le final |
|---|---|---|
| `s01AssaultComplete` | S01, arrivée sur `c16_s01_fin` | Débloque la carte « Chapitre XVII ». |
| `chapter4DComplete` + un de `c10gHyleeBetweenDravenValurn`, `c11gSeenDravenCourt`, `c15WalkedWithDraven` | Route Draven (IV-D), puis X-G, XI-G ou XV | Affiche « Point de vue : Draven » au carrefour. Ajoute le souvenir de la cour de Forthaven (`c18_dp_echo`). |
| `chapter13IComplete` + un de `c13iReadTiaNarrative`, `c13iRepeatedTiaPattern`, `c13iHeldAmaneaWhole`, `c13iPromisedNotToForget`, `c13iTruthWithoutDefense` | Route Iriana (XIII-I) | Affiche « Point de vue : Iriana » au carrefour. |
| `state.devMode` | Options développeur | Affiche toutes les options du carrefour. |

## Flags posés

| Flag | Valeurs | Posé à | Lu à |
|---|---|---|---|
| `s02Regard` | `demendras`, `remerii` | `c17_choix_regard` | Variante immédiate. |
| `s02Adieu` | `confiance`, `peur` | `c17_choix_adieu` | `c18_reponse_hylee`, `c19_promesse`. |
| `s04M1`…`s04M5`, `s04Qte` | `good`, `mid`, `bad` (+ `parade` en M3), `ok` | Manches `c17_m1`…`c17_m5`, QTE `c17_qte` | Jauges du duel S04, issues `c17_mN_r`, Game Over `c17_gameover_a/b`, `c17_duel_bilan`. Remis à zéro par « Réessayer le duel ». |
| `finalePerspective` | `remerii`, `draven`, `iriana` | `c18_carrefour` | En-têtes et cartons. |
| `finaleSeenDraven`, `finaleSeenIriana` | `true` | `c18_carrefour` | `c19_bilan` (points de vue vécus). |
| `c18PlayedDraven`, `c18PlayedIriana`, `c18PlayedRemerii` | `true` | `c18_s06_fin`, `c18_s07_fin`, `c18_fin` | Mention « (déjà jouée) » au carrefour. Conservés après une relecture. |
| `finaleReplay` | `{scene, flags}` | Carte « Chapitre XVIII » d’une partie terminée | Copie de la vraie partie, restaurée à la fin de la relecture ; supprimée ensuite. |
| `s06Posture` | `tenir`, `reculer`, `charger` | `c18_dp_crevasse` | Jauges S06, `c18_dp_crevasse_r`, `c18_dp_grotte_r`, durée du QTE. |
| `s06LinevaWords` | `promesse`, `mere`, `fierte` | `c18_dp_lineva` | `c18_dp_echo`, `c18_dp_adieu`, +1 endurance. |
| `s06Plan` | `combattre`, `courir` | `c18_dp_grotte` | `c18_dp_grotte_r`, Game Over horde. |
| `s06Voute` | `ok` | QTE `c18_dp_voute` | Effondrement réussi. |
| `s07Maitrise` | `lire`, `frapper`, `attendre` | `c18_ip_maitrise` | Jauges S07, `c18_ip_maitrise_r`. |
| `s07Garde` | `esprit`, `regard`, `lacher` | `c18_ip_domination` | Game Over `c18_ip_gameover_brisee`, durée du QTE, option « Tresser les trois forces ». |
| `s07Flux` | `accord` | QTE `c18_ip_flux` | `c18_ip_flux_r`. |
| `s07Renversement` | `retenir`, `mort`, `question`, `tresse` | `c18_ip_renversement` | `c18_ip_renversement_r`. |
| `s08Gardien` | `rempart`, `assaut`, `tout` | `c18_bh_blizzard` | Jauges S08, Game Over blizzard. |
| `s08Reponse` | `seule`, `main` | `c18_choix_hylee` | `c18_reponse_hylee`, `c18_bh_sync_r`, durée du QTE, `c19_promesse`. |
| `s08Brulure` | `true` | `c18_choix_arcane` (« L’attraper au vol ») | Boucle sans blocage : retour au choix. |
| `s08Arcane` | `accueillie` | `c18_choix_arcane` (« La laisser venir ») | Suite canonique vers le QTE. |
| `s08Sync` | `ok` | QTE `c18_bh_sync` | Flux d’Arcane. |
| `s08Dragon` | `portail`, `gorge`, `tenir` | `c18_bh_dragon` | Game Over Bhaal / blizzard, `c18_bh_dragon_r`. |

## Flags de progression

| Flag | Posé en entrant dans |
|---|---|
| `s02PorteNoireComplete` | `c17_moisson` |
| `s03TransformationComplete` | `c17_valurn_surgit` |
| `s04DuelComplete` | `c17_trois` |
| `s05TragedieComplete`, `chapter17Complete` | `c17_fin` (débloque la carte « Chapitre XVIII ») |
| `s06DravenComplete` | `c18_s06_fin` (fin de la branche Draven) |
| `s07IrianaComplete` | `c18_s07_fin` (fin de la branche Iriana) |
| `s08BlizzardComplete`, `chapter18Complete` | `c18_fin` (débloque la carte « Épilogue ») |
| `tome1Complete` | `c19_bilan` |

## Garanties vérifiées (v0.419)

- `tools/finale-gen/traverse.py` : 154 parcours (5 profils × routes du carrefour × 14 politiques de choix, QTE réussis ou expirés au hasard) atteignent tous `c19_fin` puis le menu. 263 Game Over provoqués, tous repris sur la scène de départ du duel avec jauges remises à zéro et flags antérieurs intacts. Toutes les scènes du final sont visitées.
- Profils : sans déblocage, seule l’option S08 ; Draven seul : S06 ou S08, jamais S07 ; Iriana seule : S07 ou S08, jamais S06 ; les deux / dev : S06, S07, S08, et S06 → S08 sans S07, S07 → S08 sans S06.
- Union des textes lus sur l’ensemble des parcours : 1 365 paragraphes sur 1 365.
- `tools/finale-gen/duels_e2e.py` : QTE en temps réel, Game Over et reprise dans l’interface, sauvegarde/rechargement en plein duel aux trois formats, pause des QTE hors de l’écran de jeu, relecture sans corruption de la vraie partie.
- Les flags de choix ne conditionnent jamais le texte du roman : seules les scènes ajoutées varient.
