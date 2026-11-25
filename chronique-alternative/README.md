# Chronique Alternative

Ce dossier contient le Mode libre de Sylvinia, adapté à partir du Dating Sim d’origine pour fonctionner comme une seconde expérience du même jeu.

- `index.html` et `build/` : version statique ouverte par le cinquième bouton du menu principal.
- `assets/` : décors, sprites et musiques du Dating Sim d’origine.
- `source/` : sources React du mode, conservées pour permettre son évolution.

La Chronique Alternative possède volontairement sa propre sauvegarde locale. Elle ne modifie pas la progression canonique de Hylee dans le Mode Histoire.

Les scènes intimes sont adaptées au personnage et au sexe choisi pour le protagoniste :

- 9 personnages romançables ;
- 3 directions exclusives par personnage et par sexe ;
- 81 routes finales distinctes au total ;
- 4 séquences narratives par route, déclinées selon le réglage d’intimité.

## Système de Logis

La rubrique `Sac` est devenue `Biens`, avec deux espaces : l’inventaire et le patrimoine immobilier.

- 4 villes immobilières accessibles selon la progression : Al’Gratal, Forthaven, Mir’Aldas et Akuhn’Nabad ;
- 5 gammes par ville, soit 20 logements et 20 décors dédiés ;
- achat, revente et échange avec reprise à 75 % du prix réellement payé ;
- remises de 5 % par palier de 10 en confiance, plafonnées à 50 %, auprès d’Iriana, Draven/Lineva, Saidin/Remerii ou Amanea ;
- 3 objets exposés, comprenant les curiosités du marché, un souvenir d’histoire et un cadeau de visite propre à chaque personnage ;
- logement affiché comme sous-lieu réel sur la carte ;
- invitation de plusieurs personnages à vivre sur place ;
- 4 moments domestiques propres à chacun des 10 personnages et 6 scènes de cohabitation croisée ;
- un long rendez-vous au logis propre à chacun, avec commentaire de la ville, de la gamme et des trois objets, trois tons possibles et un mini-jeu unique ;
- 3 rendez-vous à trois conditionnels, écrits pour leurs dynamiques précises ;
- 81 routes intimes domestiques supplémentaires : 3 choix propres aux 9 personnages et aux 3 sexes du protagoniste, chacun développé en 6 séquences sans recycler les routes publiques.

Les scènes intimes domestiques de Lineva, Iriana, Saidin et Amanea nécessitent respectivement un logement à Forthaven, Al’Gratal, Mir’Aldas et Akuhn’Nabad.

## Jeu de rythme intime (prototype)

Une seule scène pour l'instant : Hylee, intimité au logis, parcours homme, mood « audacieuse », réglage Explicite. Après la séquence d'intensification, le jeu remplace la séquence du climax écrit puis rend la main à l'après-climax (CG post-orgasme).

- cadence régulière qui suit les va-et-vient, sans aucun calage musical : un coup par battement, tempo stable dans chaque position et accélération par paliers (56, 76, 98 puis 122 coups par minute en Normal), puis une montée finale jusqu'à 150 vers l'apogée ; environ 74 secondes en quatre positions : elle mène (lent et profond), dos tourné, renversée, face à face ;
- trois notes : toucher (coup), appui long (rester au fond un ou deux battements, sans casser la pulsation) et glissé (changement de position) ;
- justesse Parfait, Bien ou Raté ; la jauge de plaisir ne fait que monter, un raté déclenche un son sourd et une taquinerie d'Hylee ;
- bruitages CC0 (`assets/audio/rythme/`, crédits dans `SOURCES.md`) : claquement varié à chaque coup réussi, note humide quand on reste au fond, de rares souffles et soupirs hors combo, gémissements et halètements réservés aux paliers de combo, draps aux changements de position, éclat à l'apogée ; volume séparé et interrupteur ;
- l'interface réagit en rythme et de plus en plus fort avec le plaisir : pulsation discrète au début, puis halo du couloir, jauge et couloir qui battent, vignette rose-rouge sur les bords, léger zoom de l'image sur chaque coup, jugements plus marqués, culmination à l'apogée ; le centre de l'image reste dégagé ; réglages « Effets réduits », « Image en rythme », « Secousses » et « Vibration » ;
- enchaînements (combo) : compteur discret ×N près de la cible ; paliers à 8, 16 et 24 coups réussis d'affilée, puis tous les 12 ; chaque palier déclenche un gémissement d'Hylee (espacés d'au moins 3,5 s), un double battement rose de l'interface (triple dès le troisième palier), une onde rose qui part de la cible, l'inscription « COMBO ×N » à gauche du couloir et un bonus de jauge de 1,5 point (plafonné à 9) ; un raté ou un appui lâché brise le combo ;
- secousse à chaque coup réussi : poussée brève puis rebond, verticale quand elle mène et renversée, en profondeur de dos et face à face ; pleine sur le sprite, plus légère sur la CG et le décor ; amplitude qui monte avec la jauge et le combo, plus forte à l'apogée, plafonnée à 2 % de la hauteur d'écran (le sprite ne sort jamais du cadre) ; réduite en « Effets réduits », coupée par « Secousses » ;
- sprite intime robuste : un échec de chargement (réseau instable) montre la dernière image bien chargée ou l'humeur de repli, puis retente l'image voulue ; les humeurs d'Hylee sont préchargées au lancement du jeu ;
- lignes courtes qui accompagnent les coups et répliques d'Hylee qui montent en intensité, en plus des trois paliers par position ; la justesse finale choisit l'une des trois conclusions (Embrasement, Accord, Tâtonnement) ;
- difficultés Doux, Normal et Intense (même cadence, tempo et tolérance différents), mode auto pour lire sans jouer, décalage des coups réglable, musique de fond à volume réglable, « Lire la version écrite » pour garder le texte d'origine ;
- pause (Échap ou bouton), « Reprendre plus tard » et sauvegarde continue dans `sylvinia_ca_rythme_v1`, séparée de la partie ;
- clavier (Espace, J ou F, flèches) et tactile (toucher, garder le doigt, balayer) ;
- accès direct : Options, Session, Mode développeur, « Lancer le jeu de rythme ».

Sources : `source/src/rhythm-intimacy.ts` (textes, modifiables depuis le Studio), `rhythm-intimacy-engine.ts` (cadence et score), `rhythm-intimacy-sfx.ts` (bruitages), `rhythm-intimacy-ui.tsx`, `rhythm-intimacy.css`. Test : `npm run test:rhythm`, parcours navigateur `scripts/e2e/rythme_e2e.py`, visibilité du sprite sur une partie complète `scripts/e2e/rythme_sprite.py` (`FAIL=1` simule un réseau en panne), captures figées du combo et de la secousse `scripts/e2e/rythme_planche_v3.py`. Les bruitages se refabriquent avec `scripts/rythme-sons-build.py`.

Le retour vers le Mode Histoire est volontairement limité à l’écran titre et aux options afin de ne pas encombrer le mode libre.

Pour reconstruire la version statique :

```bash
cd chronique-alternative/source
npm install
npm test
npm run build
```
