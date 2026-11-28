# Générique de fin du Tome I · v0.432 « La course de Hylee »

Consigne de l’auteur (évolution du générique), appliquée sur le générique existant : Votre Chronique conditionnée, accélérer / passer, transition depuis l’épilogue, passerelle menu / CA, Ma Chronique, « Revoir le générique » et verrou de fin de jeu restent en place.

## Composition en trois couches

1. **Course de Hylee** (`.gq-course`) : vidéo plein écran permanente, deux lecteurs au plus, muets, jamais relancés sur un changement d’acte, d’illustration ou d’orientation.
2. **Illustrations** (`.gq-bg`) : souvenirs et portraits par-dessus la vidéo, en position latérale (droite en paysage, bandeau haut en portrait), bords estompés.
3. **Texte et interface** : titre, cartons, défilement, commandes.

Sans aucune vidéo lisible (fichier absent, mouvement réduit, appareil très faible), le générique revient au rendu par illustrations plein écran.

## Chronologie (mesurée à 1024x880, ×1)

| Section | Mise en scène | Durée |
|---|---|---|
| Transition depuis l’épilogue | voile, deux lignes, trait de lumière | ≈ 13 s |
| Titre frontal | Les Chroniques de Sylvinia · Tome I | 7 s |
| I · À l’origine des Chroniques | titre puis 8 cartons gauche/droite (≈ 4,25 s chacun), carton central « Un jeu du Chroniqueur Vagabond », respiration | ≈ 47 s |
| II · Avec la participation de… | 12 faux crédits avec portrait, puis « Vous » | ≈ 53 s |
| III · Votre Chronique | rétrospective conditionnée (partie de test : 17 chapitres, 41 rubriques) | ≈ 212 s, variable |
| IV · Derrière les Chroniques | vrais crédits par département | ≈ 50 s |
| V · Un monde qui continue de vivre | mot de l’auteur, merci, Fin du Tome I, maintien 7 s | ≈ 40 s + 7 s |
| Finale · Le dernier sourire | V06 seule, une fois, sans texte ni illustration | ≈ 15,6 s |
| Passerelle | menu principal ou Chronique Alternative | au choix |

Total sur la partie de test : ≈ 7 min 25 s à ×1 (bande défilante 355 s).

## Vidéos (assets/video/generique/, byte-identiques)

| ID | Fichier | Moment |
|---|---|---|
| V01 | V01_forets_humaines.mp4 | titre frontal et acte I |
| V02 | V02_forets_sylviniennes.mp4 | dès « Avec la participation de… » |
| V03 | V03_miraldas.mp4 | à 40 % de Votre Chronique |
| V04 | V04_foret_interdite.mp4 | à 72 % de Votre Chronique |
| V05 | V05_champ_de_bataille.mp4 | à « Telle fut votre chronique », jusqu’aux remerciements |
| V06 | V06_surplomb.mp4 | finale, non bouclée |

Règles : une étape à la fois, jamais de retour en arrière, 14 s minimum par boucle, fondu court masqué par une brume. Un clip absent est sauté (la boucle précédente continue). Sans V06 : image fixe sobre 5 s puis passerelle.

## Réglages

Tout est dans `fusion/story-generique-credits.js` :
- `cartons.timing` : durées des cartons (fondu, maintien, battement, carton final, respiration) ;
- `course.cues` : ancres des changements de boucle (bloc ou fraction de Votre Chronique) ;
- `course.timing` : fondu, durée minimale par boucle, délai de chargement, entrée et maintien de V06, repli ;
- `course.cadrage` : object-position / object-fit par orientation (surcharge possible par clip) ;
- `course.voiles` : opacités des voiles de contraste et des illustrations.


## Musique

Thème original de l’auteur, `assets/audio/generique_tome1.mp3` (clé `music_generique`, 3 min 39,8 s), à la place de la musique du menu.

Elle commence avec le titre frontal (préchargée pendant le prélude) et accompagne le générique jusqu’au dernier sourire, sans relance lors des changements de vidéo ou d’orientation. Comme le générique dure plus longtemps que la piste, celle-ci boucle par un fondu enchaîné de 4 s, amorcé 5,5 s avant la fin du fichier pour éviter la queue silencieuse, la nouvelle boucle commençant à 0,5 s (attaque de la phrase).

À la fin de V06, le thème du générique s’éteint. À la passerelle, le thème du menu reprend, sans double lecture. Si la musique est désactivée, aucun son n’est imposé, y compris la piste vidéo. Pause et reprise restent synchronisées. Tous les réglages sont dans `fusion/story-generique-credits.js` (`track` et `music`).


## Illustrations et stabilité (v0.433–v0.434)

En paysage, les souvenirs occupent environ 38 % de la largeur, à droite, autour de Hylee. En portrait, un bandeau haut. Un masque elliptique très progressif fond l’image dans la course, sans bord net, avec une légère transparence, pour qu’elle émerge comme un souvenir. Tant que la course est visible, les petites vignettes du défilement sont masquées pour éviter le double emploi.

Les boucles V01 à V05 se raccordent par un fondu entre les deux lecteurs, pour éviter le flash d’une reprise native. Un changement d’orientation ne bascule que hors d’une zone morte autour du format carré (écran de Fold déplié).
