# Sylvinia VN - v0.91.0

## Contenu de cette version

Cette archive contient le HTML mis à jour du Visual Novel ainsi que les assets nécessaires au Chapitre III.

### Correctif principal

Les décors du Chapitre III ont été réintégrés dans l’archive, dans le dossier :

`assets/images/chapter3/`

Ils sont référencés comme des arrière-plans de scène, au même titre que les autres bannières/décors du VN.

Décors inclus :

- `c3_algratal_marche.png`
- `c3_boutique_vetements.png`
- `c3_atelier_arcanique.png`
- `c3_boutique_fournitures.png`
- `c3_porte_sud.png`
- `c3_foret_route.png`
- `c3_clairiere_gelee.png`
- `c3_camp_nuit.png`

### Images clés incluses

- Arrivée à Al’Gratal
- Robe / miroir
- Bâton en cerisier noir
- Carnet de voyage renforcé
- Glacialis 1
- Glacialis 2
- Test de Remerii
- Medig
- Confession au feu
- Cauchemar
- Fin du Chapitre III : Mir’Aldas sous son dôme arcanique pourpre

### Sprites inclus

Les sprites post-Glacialis d’Hylee sont inclus dans :

`assets/sprites/chapter3/`

Le basculement vers ces sprites commence après la scène de Glacialis.

## Fichier principal

Ouvrir :

`index.html`

## Note

Cette version conserve la structure du VN existant. Les nouveaux assets sont fournis séparément pour éviter d’alourdir inutilement les anciens dossiers déjà présents dans le projet principal.


## Mise à jour v092
- Remplacement de l'image clé de l'intervention / test de Remerii.
- Correction du sprite `hylee2_angry`.
- Le réveil après le cauchemar utilise désormais le sprite `hylee2_sad`.


Mise à jour v094
- Correction critique : les sprites post-Glacialis de Hylee ne remplacent plus les sprites des chapitres I, II ni du début du chapitre III.
- Le basculement automatique ne se fait qu'à partir de c3_24, puis pour les chapitres suivants.
- c3_04 repasse sur un sprite pré-transformation.

- v0.95: sprites post-Glacialis de Hylee remplacés par les sprites validés par l’utilisateur (C3_24 et après), avec détourage PNG transparent.


- v0.96: ajout des sprites `hylee2_teasing` (taquin) et `hylee2_furious` (furieuse) dans `assets/sprites/chapter3/`, disponibles après la transformation post-Glacialis pour les scènes futures.
- v0.96: correction de l’ambiance musicale du passage « Fragment du vieux journal » (c3_53 / c3_54) et de la fin du chapitre III (c3_55).


- v0.97: remplacement du passage des ombres du Chapitre III par un duel interactif en 3 manches, utilisant les mécaniques du duel du Chapitre I : HUD Stabilité/Fatigue/Lecture, réactions, choix verrouillés, gains de valeurs et résultat dynamique. Le duel force désormais l’usage de Glacialis avant la transformation de c3_24.


- v0.98: duel des ombres du chapitre III recalibré. Stabilité initiale à 10, Fatigue initiale à 0. Les deux premières manches coûtent chacune 5 Stabilité et ajoutent 5 Fatigue, ce qui force la troisième manche à ne laisser qu’une option jouable : Glacialis Absoluta.
- v0.98: le nom du sort a été corrigé en `Glacialis Absoluta` dans la mécanique de duel et l’écran de résultat.


- v0.99 : dynamique de Lien Remerii ajoutée. Certains choix rares, contraires à la personnalité de Remerii (précipitation, désobéissance directe, fascination du danger ou défiance brusque), font maintenant perdre 1 point de Lien Remerii. Cela concerne des choix ciblés des chapitres I, II et III, sans toucher aux choix stratégiques validés.

## Mise à jour v100
- Correction du duel des ombres du Chapitre III : l’animation de transition se lance maintenant au début du combat, comme pour le duel du Chapitre I.
- L’animation est réinitialisée à chaque entrée dans `c3_22`, sans bloquer la reprise en cours de duel.


## Mise à jour 0.100 — Duel des ombres, manche 1
- Intégration de 5 nouvelles images clés pour la manche 1 du test de Remerii.
- Correspondance : Situation, Barrière de glace, Roulade sous l’attaque, Observation de la vraie ombre, Appel instinctif à Remerii.
- Les visuels sont reliés au combat du chapitre III et déverrouillables dans le codex.

## Mise à jour complémentaire

- Ajout des 5 images clés de la manche 2 du duel des ombres (situation + 4 choix) et branchement dans le chapitre 3.


## Mise à jour 0.101 — Bâton de l’Atelier Arcanique
- Correction de la branche du bâton : le bâton en cerisier noir accordé n’est désormais obtenu que via le choix stratégique « laisser le bâton répondre avant de le choisir ».
- Les autres choix de l’Atelier Arcanique mènent à une nouvelle scène où Hylee reçoit un Bâton d’apprentie renforcé, plus classique, sans bonus de Résonance.
- Ajout de l’objet `baton_apprenti_renforce` dans la progression.
- Correction du codex de l’Atelier Arcanique pour refléter les deux variantes possibles.

## Mise à jour v0.103 — Musiques du chapitre III

Trois nouveaux morceaux Suno ont été intégrés au projet dans `assets/audio/` :

- `c3_shopping_capitale.mp3` — **Shopping dans la capitale**
  - utilisé pour le marché d’Al’Gratal, la boutique du tailleur, l’Atelier Arcanique et la boutique de fournitures.
- `c3_combat_ombres.mp3` — **Combat des Ombres**
  - utilisé pour le duel des ombres, Glacialis Absoluta et le silence de verre qui suit.
- `c3_the_unborn.mp3` — **The Unborn**
  - utilisé pour le cauchemar du petit frère et le réveil brutal.

Les trois musiques ont été ajoutées au codex musical afin d’être déverrouillées comme les autres pistes.


## Mise à jour v0.104 — Mode développeur renforcé
- Le mode développeur déverrouille désormais toutes les entrées, images et musiques du Codex, y compris lorsqu’une sauvegarde déjà en mode dev est rechargée après une mise à jour.
- Le mode développeur ignore désormais les prérequis de valeurs sur les choix classiques.
- Le mode développeur ignore aussi les prérequis internes des duels, dont le duel d’entraînement et le duel des ombres du chapitre III.
- Les gains de valeurs restent affichés sur chaque choix en mode développeur.
