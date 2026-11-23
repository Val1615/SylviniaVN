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
| `s04M1`…`s04M5` | `good`, `mid`, `bad` | Manches du duel `c17_m1`…`c17_m5` | Jauges (`Vitalité d’Amanea`, `Puissance révélée`, `Temps gagné`), issues `c17_mN_r`, `c17_revelation`, `c17_duel_bilan`. La défaite reste obligatoire. |
| `finalePerspective` | `remerii`, `draven`, `iriana` | `c18_carrefour` | Insertion des scènes de point de vue (`go` redirigé). |
| `finaleSeenDraven`, `finaleSeenIriana` | `true` | `c18_carrefour` | `c19_bilan` (points de vue vécus). |
| `s06Posture` | `tenir`, `reculer` | `c18_dp_crevasse` | `c18_dp_crevasse_r`, `c18_dp_grotte_r`. |
| `s06LinevaWords` | `promesse`, `mere`, `fierte` | `c18_dp_lineva` | `c18_dp_echo`, `c18_dp_adieu`. La réplique du roman « Je rentre bientôt… » est toujours dite. |
| `s06Plan` | `courir`, `combattre` | `c18_dp_grotte` | `c18_dp_grotte_r`. |
| `s07Maitrise` | `lire`, `frapper` | `c18_ip_maitrise` | `c18_ip_maitrise_r`. |
| `s07Flux` | `accord`, `force` | `c18_ip_flux` | `c18_ip_flux_r`, `c18_ip_renversement_r`. |
| `s07Renversement` | `retenir`, `question` | `c18_ip_renversement` | `c18_ip_renversement_r`. |
| `s08Reponse` | `seule`, `main` | `c18_choix_hylee` | `c18_reponse_hylee`, `c19_promesse`. |
| `s08Brulure` | `true` | `c18_choix_arcane` (« L’attraper au vol ») | Boucle sans blocage : retour au choix. |
| `s08Arcane` | `accueillie` | `c18_choix_arcane` (« La laisser venir ») | Suite canonique. |

## Flags de progression

| Flag | Posé en entrant dans |
|---|---|
| `s02PorteNoireComplete` | `c17_moisson` |
| `s03TransformationComplete` | `c17_valurn_surgit` |
| `s04DuelComplete` | `c17_trois` |
| `s05TragedieComplete`, `chapter17Complete` | `c17_fin` (débloque la carte « Chapitre XVIII ») |
| `s06DravenComplete`, `s07IrianaComplete` | `c18_gardien` (passage du tronc commun) |
| `s08BlizzardComplete`, `chapter18Complete` | `c18_fin` (débloque la carte « Épilogue ») |
| `tome1Complete` | `c19_bilan` |

## Garanties vérifiées

- Aucune impasse : 75 parcours automatiques (5 combinaisons de déblocage × 15 politiques de choix) atteignent `c19_fin`, puis le menu. Les 177 scènes et les 41 options de choix (19 scènes de choix) ont toutes été visitées.
- Sans déblocage, le carrefour n’affiche que « Poursuivre : Remerii / Hylee ».
- Un seul point de vue optionnel par partie ; l’autre se rejoue depuis la carte « Chapitre XVIII » du menu des chapitres.
- Les flags de choix ne conditionnent jamais le texte du roman : seules les scènes ajoutées varient.
