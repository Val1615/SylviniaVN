# Les Chroniques de Sylvinia - Visual Novel

**État : bêta jouable**  
**Build courant : v0.210**  
**Fichier principal : `index.html`**  
**Fonction du README : historique cumulatif du projet**

Ce README doit conserver l'historique des mises à jour. Lors d'un patch, il faut ajouter une entrée au changelog, pas remplacer le document par un simple résumé du dernier correctif.

---

## Contenu du build actuel

```text
index.html
README.md
assets/audio/chapter11/la_complainte_imperiale_instru.mp3
assets/audio/chapter11/la_complainte_imperiale.mp3
assets/video/chapter11/piano_iriana_sd.mp4
assets/images/backgrounds/iriana/*.png
assets/images/keyscenes/chapter11_i/*.png
assets/images/chapter_select/chapter_11_i.png
assets/images/chapter_select/chapter_11_g.png
assets/images/chapter_select/chapter_12_i.png
```

Projet web statique, recommandé sur GitHub Pages ou serveur local.

---

## État jouable

| Clé | Affichage | Titre / fonction | État |
|---|---|---|---|
| `intro` | Introduction | L'Auberge du Forestier | Jouable |
| `ch1` | Chapitre I | Une convocation impériale | Jouable |
| `ch2` | Chapitre II | Sur la route d'Al'Gratal | Jouable |
| `ch3` | Chapitre III | Préparatifs pour une nouvelle aventure | Jouable |
| `ch4` | Chapitre IV | Croisée des récits | Jouable, routes Valurn / Draven |
| `ch5` | Chapitre V | Une rencontre hors du temps | Jouable |
| `ch6` | Chapitre VI | Parenthèse à Mir'Aldas | Jouable |
| `ch7` | Chapitre VII | Du Chaos aux Ombres | Jouable |
| `ch8` | Chapitre VIII | Un sombre conseiller | Jouable |
| `ch9` | Chapitre IX | L'heure du départ | Jouable |
| `ch10` | Chapitre X | Deux perspectives | Jouable, bifurcation Iriana / Groupe |
| `ch11_i` | Chapitre XI_I | Amie ou ennemie ? | En développement |
| `ch11_g` | Chapitre XI_G | Le Bal des Élus | En développement |
| `ch12_i` | Chapitre XII_I | Le souvenir d'Amanea | En développement |

---

## Règles de développement

- Le dernier `index.html` livré est la source technique de vérité.
- Le Tome 1 reste la source canonique narrative.
- Ne pas couper le texte canon.
- Les choix ajoutent variations, conséquences, souvenirs, objets ou scènes bonus.
- Fournir `index.html` et un ZIP.
- Dans le ZIP, garder `index.html` et `README.md` sans suffixe de version.
- Les sprites doivent disparaître pendant les CG / images clés.
- Les images clés doivent tomber sur le moment narratif exact.
- Le Lien Remerii ne doit pas revenir dans le HUD principal.
- Le Codex doit être complété à chaque ajout d'entrée, musique, image ou chapitre.
- Le README doit rester cumulatif.

---

## Systèmes actifs

Valeurs :

```text
Audace
Sang-froid
Lucidité
Résonance
```

Le Lien Remerii est dans `Progression > Regard de Remerii`.

Progression : valeurs, Regard de Remerii, inventaire, souvenirs, Carnet du Némésis.

Codex : Entrées, Images, Musiques, Site.

Mode développeur : code `161598`. Il ouvre les chapitres, contourne les prérequis, affiche les effets, ouvre le Codex, permet le retour et ajoute une recherche de scène depuis v0.209.

---

## Routes récentes

### Chapitre X-I : L'Impératrice Noire

Route Iriana. Iriana découvre les geôles d'Akuhn'Nabad, les extractions d'âme, Amanea et une facette plus nuancée des Obscurcis. Le fragment `ch10` est réservé à cette route.

### Chapitre X-G : Les Geôles de la Cité Noire

Route Groupe. Hylee, Remerii, Valurn, Draven et Naïah sont prisonniers. Valurn négocie, Bellirith déstabilise le groupe, la fracture Hylee / Remerii est renforcée, puis le groupe passe par les archives et revient face à Tia.

### Chapitre XI_I : Amie ou ennemie ?

Route Iriana. Quartiers privés d'Amanea, piano, complainte impériale, tension familiale, coffret, journal, reflet d'Amanea, fin avec révélation des fragments lisibles et teasing de la mèche magique.

Règle audio / vidéo actuelle :

```text
c11i_004 : démarrage instrumental
c11i_011 : démarrage version chantée
c11i_013 -> c11i_song_final : vidéo bannière uniquement
```

Images clés XI_I :

```text
c11i_002 -> c11i_003 : cg_xi_i_quartiers_entree.png
c11i_008 -> c11i_009 : cg_xi_i_avant_musique.png
c11i_011 -> c11i_012 : cg_xi_i_piano_intro.png
c11i_019 -> c11i_020 : cg_xi_i_apres_chanson.png
c11i_024 -> c11i_025 : cg_xi_i_coffret_iriana_seule.png
c11i_027 -> c11i_028 : cg_xi_i_reflet_amanea.png
```

Note importante : quand Iriana fouille le coffret, Amanea est déjà partie. Ne pas placer d'image avec Amanea physiquement présente pour cette fouille.

### Chapitre XI_G : Le Bal des Élus

Route Groupe. Invitation impériale, préparation au bal, tensions Hylee / Remerii, arrivée à la cour sylvinienne, Valurn, Draven, Saidin, Ellion, Riven, Aldecian, Yelna.

### Chapitre XII_I : Le souvenir d'Amanea

Route Iriana. La mèche réagit, puis le souvenir d'Amanea / Allenna est traité dans un chapitre séparé afin que XI_I se conclue proprement.

---

## Interface actuelle

- Chapitres indisponibles grisés dans la sélection.
- XI_I, XI_G et XII_I marqués `EN DÉVELOPPEMENT`.
- Les couleurs de route ajoutées par erreur ont été retirées.
- La bibliothèque de chapitres doit rester neutre.
- Recherche de scène ajoutée dans les options sous le mode développeur.

---

## Historique cumulatif

### v0.91 à v0.104 : ancien socle

- Ancien README centré sur le Chapitre III.
- Base du VN web avec menu, Introduction, premiers chapitres, Codex, Progression, choix, sauvegarde et premières images.

### Socle jusqu'au Chapitre III

- Introduction séparée dans `Aventure`.
- Chapitres I, II et III intégrés.
- Valeurs Audace, Sang-froid, Lucidité, Résonance.
- Ajout du bâton en cerisier noir, robe bleue, confession de Remerii, test de Remerii, Plume blanche de Medig.
- Premiers objets, souvenirs, fragments, images et musiques du Codex.

### Chapitres IV à VII

- Chapitre IV à routes Valurn / Draven.
- Route Valurn : Calciterres, Bellirith, tension infernale.
- Route Draven : Forthaven, Lineva, responsabilités de Draven.
- Chapitre V : Mir'Aldas, Saidin, bibliothèque, Épreuve du Cadran.
- Chapitre VI : parenthèse à Mir'Aldas, relation Hylee / Remerii.
- Chapitre VII : Naïah, pacte, duels, Forêt Interdite.
- Ajout progressif des sprites, décors, musiques, images clés et entrées Codex.

### v0.152

- Lien Remerii retiré du HUD principal et déplacé dans `Regard de Remerii`.

### v0.153

- Harmonisation des choix à deux valeurs : seconde valeur à environ 50 %.

### v0.168 à v0.177

- Intégration et stabilisation du Chapitre VIII.
- Sélection de chapitre, accès après Chapitre VII, décors, images clés, musiques et Codex.
- Dialogues retravaillés au format VN.

### v0.178 à v0.186

- Intégration et polissage du Chapitre IX.
- Départ vers la Forêt Interdite, Naïah guide le groupe, Akuhn'Nabad, Alamma, capture et séparation d'Iriana.
- Images clés, musiques, Codex et Regard de Remerii clarifié.
- Musique III du Chapitre IX corrigée avec `infernal_trade.mp3`.

### v0.187

- Intégration de la route Iriana du Chapitre X : `L'Impératrice Noire`.

### v0.190 à v0.193

- Réparation du choix de perspective du Chapitre X.
- Choix explicite entre Iriana et le groupe.
- Route verrouillée hors mode développeur.
- Mode développeur utilisable pour tester les deux routes.

### v0.194

- Repositionnement des images Valurn / Obscurci sur `c10g_065` à `c10g_081`.
- Sprites retirés pendant ces images clés.

### v0.195

- Valeurs déplafonnées.
- Fin de l'ancien plafond à 45.

### v0.196

- Fracture Hylee / Remerii renforcée dans la route Groupe.
- Hylee ressent mieux l'impact de la douleur.
- Remerii ne sait pas comment répondre.
- Perte unique de Lien Remerii : `-15`.

### v0.197

- Ajout de choix supplémentaires dans la route Groupe pour faire intervenir Hylee plus souvent.

### v0.198

- Polissage des transitions après les choix supplémentaires de la route Groupe.

### v0.199

- Ajout du Chapitre XI_I : `Amie ou ennemie ?`.
- Accès uniquement après la route Iriana.
- Transition depuis `c10_end`.
- Choix classiques, prérequis, bonus et stratégiques.
- Scène bonus liée à `amanea_respecte_lucidite_iriana`.
- Entrées Codex : quartiers privés d'Amanea, piano des Farae, journal d'Amanea, dernier combat Tia / Amanea, Allenna.
- Souvenirs liés à Iriana, Amanea et Allenna.

### v0.200

- Ajout du Chapitre XI_G : `Le Bal des Élus`.
- Accès uniquement après la route Groupe.
- Transition depuis `c10g_end`.
- Carte XI_G ajoutée et verrouillée hors mode développeur.
- Entrées Codex : Bal des Élus, cour sylvinienne, Ellion, Riven, Aldecian, Yelna.
- Pas de fragment ajouté pour XI_G.

### v0.201

- Correction de mise en page XI_G.
- Répliques avec guillemets.
- Indications de ton en italique au-dessus des répliques.
- Correction des champs `speaker` pour Aldecian Vareth et Ellion Valendil.

### v0.202

- Rééquilibrage des choix de XI_I et XI_G.
- Choix stratégiques réduits et rendus plus importants.
- XI_G conserve deux grands stratégiques : pacte silencieux Hylee / Remerii et graine de trahison de Valurn.
- Anciens stratégiques faibles reclassés.
- Salves de choix rééquilibrées.
- Souvenirs stratégiques accordés seulement si le choix est pris.

### v0.203

- Redécoupage de la route Iriana du Chapitre X.
- Scènes `c10_` trop longues divisées en battements plus courts.
- Aucun contenu canon supprimé.

### v0.204

- Ajout des disclaimers de développement pour XI_I et XI_G.
- Scènes `c11i_disclaimer` et `c11g_disclaimer`.
- Badges `EN DÉVELOPPEMENT` ajoutés.

### v0.205

- Retrait des couleurs spécifiques appliquées par erreur aux cartes.
- Chapitre X plus vert, XI_I plus bleu, XI_G plus orange.
- Retour au style neutre.

### v0.206

- Nouvelle version des paroles de la complainte impériale.
- Iriana chante les passages indiqués entre parenthèses dans la consigne source, Amanea chante le reste.
- Marqueurs de structure retirés de l'affichage joueur.
- Ajout de l'audio instrumental et chanté.
- Instrumental prévu dès `c11i_004`.
- Version chantée prévue dès `c11i_011`.
- Ajout au Codex musical.

### v0.207

- Nouveaux décors de la route Iriana intégrés.
- Donjon, couloir, salle de guerre / étude, salon au piano, salle du trône, terrasse d'Akuhn'Nabad.
- Anciens décors remplacés.
- Ajout de la vidéo bannière piano.
- Regroupement de `c11i_013` et `c11i_014`.
- Correction après mauvais build ayant masqué XI.
- Restauration du build complet XI_I + XI_G.
- Correction audio / vidéo : instrumental `c11i_004` à `c11i_010`, chanté `c11i_011` à `c11i_song_final`, vidéo `c11i_013` à `c11i_song_final`.

### v0.208

- Restauration des sprites quand il ne restait que le décor.
- Correction du sprite d'Iriana de `c11i_018` à `c11i_020`.
- Reflet d'Amanea avec transparence et halo vert.
- Choix du reflet allongés.
- Choix du souvenir Tia / Amanea allongés.
- Fin de XI_I coupée avant le souvenir.
- Création de XII_I pour le souvenir d'Amanea / Allenna.
- Notification : fragments du Carnet du Némésis lisibles en fin de XI_I.
- Ajout de `c12i_000`, `c12i_end`, carte XII_I, déverrouillage XII_I.

### v0.209

- Intégration courte des images clés XI_I.
- Images placées sur 1 à 2 scènes maximum.
- Image piano avant vidéo : `c11i_011` à `c11i_012`.
- Vidéo conservée uniquement de `c11i_013` à `c11i_song_final`.
- Chapitres indisponibles grisés.
- XII_I marqué `EN DÉVELOPPEMENT` comme XI_I et XI_G.
- Recherche de scène ajoutée dans les options sous le mode développeur.
- Codex complété : entrées, images, musiques XI_I / XII_I.
- README restauré comme historique cumulatif.

### v0.210

- Reprise du bon build fourni par l'utilisateur : `index(55).html`.
- Application des 3 vignettes validées dans l'onglet de sélection :
  - `chapter_11_i.png` pour `ch11_i` / Chapitre XI_I ;
  - `chapter_11_g.png` pour `ch11_g` / Chapitre XI_G ;
  - `chapter_12_i.png` pour `ch12_i` / Chapitre XII_I.
- Conservation du style neutre des cartes, sans couleur spécifique par route.
- Extension de la neutralisation visuelle à `chapter12ICard`.
- Aucun changement appliqué à la vidéo du piano ni aux scènes de jeu.

---

## Points de vigilance

- Ne pas repartir d'un mauvais build.
- Ne pas casser XI_I / XI_G / XII_I.
- Ne pas toucher à la vidéo du piano sans demande.
- Ne pas laisser une CG trop longtemps.
- Ne pas afficher les sprites pendant une CG.
- Garder le Codex synchronisé.
- Garder ce README comme historique.

