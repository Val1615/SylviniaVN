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

- carte écrite à la main, mesure par mesure, sur `intimate.mp3` (129,5 BPM), 76 secondes en quatre positions : elle mène (lent), dos tourné, renversée, face à face jusqu'à l'apogée ;
- trois notes : toucher (coup), appui long (rester au fond, ralentir) et glissé (changement de position) ;
- justesse Parfait, Bien ou Raté ; la jauge de plaisir ne fait que monter, un raté déclenche une taquinerie d'Hylee ;
- trois paliers par position débloquent des lignes qui décrivent l'acte, la justesse finale choisit l'une des trois conclusions (Embrasement, Accord, Tâtonnement) ;
- difficultés Doux, Normal et Intense, mode auto pour lire sans jouer, décalage audio réglable, « Lire la version écrite » pour garder le texte d'origine ;
- pause (Échap ou bouton), « Reprendre plus tard » et sauvegarde continue dans `sylvinia_ca_rythme_v1`, séparée de la partie ;
- clavier (Espace, J ou F, flèches) et tactile (toucher, garder le doigt, balayer) ;
- accès direct : Options, Session, Mode développeur, « Lancer le jeu de rythme ».

Sources : `source/src/rhythm-intimacy.ts` (textes, modifiables depuis le Studio), `rhythm-intimacy-engine.ts` (carte et score), `rhythm-intimacy-ui.tsx`, `rhythm-intimacy.css`. Test : `npm run test:rhythm`, parcours navigateur `scripts/e2e/rythme_e2e.py`.

Le retour vers le Mode Histoire est volontairement limité à l’écran titre et aux options afin de ne pas encombrer le mode libre.

Pour reconstruire la version statique :

```bash
cd chronique-alternative/source
npm install
npm test
npm run build
```
