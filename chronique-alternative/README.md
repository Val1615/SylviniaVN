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

Le retour vers le Mode Histoire est volontairement limité à l’écran titre et aux options afin de ne pas encombrer le mode libre.

Pour reconstruire la version statique :

```bash
cd chronique-alternative/source
npm install
npm run test:intimacy
npm run build
```
