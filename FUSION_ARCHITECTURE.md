# Fusion du Visual Novel et du Dating Sim

## État actuel

Sylvinia propose désormais les deux expériences prévues dans la vision de fusion :

- **Mode Histoire** : le Visual Novel canonique de Hylee, enrichi de périodes libres entre les chapitres.
- **Chronique Alternative** : le Dating Sim d’origine, conservé comme Mode libre autonome avec création de personnage, voyages, horaires, relations, romances, jobs, inventaire, journal, codex et sauvegardes.

Le menu principal contient cinq volets coulissants. Le volet **Chronique Alternative** ouvre directement le second mode et celui-ci dispose d’un bouton permanent pour revenir au Mode Histoire.

## Mode Histoire : couverture narrative

Le moteur générique couvre tous les chapitres actuellement présents, du chapitre I au chapitre XIV, y compris les branches Valurn, Draven, Iriana et Groupe.

| Contenu | Quantité |
|---|---:|
| Périodes libres | 19 |
| Sous-lieux contextuels | 62 |
| Activités et scènes facultatives | 145 |
| Confidences relationnelles | 21 |
| Retours sur les chapitres | 12 |
| Mini-jeux contextuels | 4 |
| Approches proposées au joueur | 438 |

Les transitions urgentes ne proposent qu’un créneau court. Les respirations narratives plus calmes offrent jusqu’à quatre activités. Une période peut toujours être ignorée afin de reprendre immédiatement le chapitre suivant.

## Cohérence des sprites

Le Mode Histoire n’utilise jamais les sprites indépendants du Dating Sim.

Chaque sous-lieu indique une `visualScene` appartenant au VN. Au moment de l’affichage, le moteur lit directement :

- le décor de cette scène dans le registre `S` ;
- le sprite exact du personnage présent dans `scene.chars` ;
- sa position à l’écran ;
- le remappage officiel des tenues de bal lorsqu’il est actif.

Si une scène illustrative ne contient pas le personnage attendu, le moteur recherche une scène compatible du même chapitre, puis utilise la scène d’entrée ou de reprise comme solution de repli. Les apparences du Dating Sim restent réservées à la Chronique Alternative.

## Progression persistante

Le moteur ajoute un espace versionné dans la sauvegarde principale du VN :

```js
state.storyWorld = {
  version: 4,
  mode: "story",
  activePeriod: null,
  completedPeriods: [],
  relationships: {
    remerii: { affection: 0, trust: 0, desire: 0, stage: 0, met: false },
    iriana: { affection: 0, trust: 0, desire: 0, stage: 0, met: false },
    valurn: { affection: 0, trust: 0, desire: 0, stage: 0, met: false }
  },
  resources: {
    coins: 0,
    supplies: 0,
    items: []
  },
  periodRuns: {},
  history: []
};
```

Les activités peuvent modifier :

- Audace, Lucidité, Sang-froid et Résonance ;
- le Lien canonique avec Remerii ;
- affection et confiance pour les personnages ; les conversations canoniques n’ajoutent aucun désir hors de la relation avec Remerii ;
- pièces et provisions ;
- inventaire, drapeaux narratifs et historique.

La relation avec Remerii alimente aussi `state.stats.lien`, ce qui permet aux gains du monde libre d’ouvrir les choix déjà conditionnés par le VN. Les relations des autres personnages sont conservées pour les variantes présentes et futures.

## Interface du monde libre canonique

Le temps libre est présenté comme une scène du Visual Novel et non plus comme un tableau de bord :

- le décor occupe tout l’écran et reste lisible ;
- les sprites issus du chapitre restent visibles au-dessus du dialogue ;
- le texte, les situations et les choix utilisent le cadre or et la composition du HUD du VN ;
- les statistiques deviennent de petites pastilles discrètes ;
- les lieux, relations, ressources et le journal sont réunis dans un tiroir latéral replié par défaut ;
- la barre inférieure permet d’ouvrir directement une section, revenir au menu ou reprendre le récit.

Choisir un lieu replie automatiquement le tiroir. Sur téléphone, le cadre narratif et la liste de choix possèdent chacun leur propre défilement afin de préserver au moins la moitié supérieure de l’illustration.

Le joueur peut quitter vers le menu à tout moment. La période reprend au même endroit au chargement de la sauvegarde. Une activité terminée ne peut pas être répétée pour exploiter ses récompenses.

## Conséquences sur les chapitres

À la reprise du récit :

- les statistiques modifiées sont immédiatement disponibles pour les prérequis du VN ;
- le Lien Remerii et les relations persistent ;
- les objets rejoignent l’inventaire canonique ;
- un écho narratif rappelle les activités récentes dans la scène d’ouverture suivante ;
- les drapeaux détaillés permettent d’écrire ensuite des variantes de dialogue plus spécifiques.

Le moteur conserve également les données du monde libre lorsqu’un chapitre est lancé depuis l’écran de sélection.

## Chronique Alternative

La Chronique Alternative est une adaptation statique du Dating Sim React d’origine. Elle fonctionne sous GitHub Pages sans serveur applicatif.

```text
chronique-alternative/
  index.html              version jouable publiée
  build/                  JavaScript et CSS compilés
  assets/                 sprites, portraits, lieux, cartes et musiques
  source/                 sources React conservées
```

Elle garde ses propres clés de sauvegarde locale (`sylvinia-liens-*`). Cette séparation est volontaire : la chronologie libre et le personnage créé ne doivent pas modifier la sauvegarde canonique de Hylee.

Pour reconstruire le mode :

```bash
cd chronique-alternative/source
npm install
npm run build
```

Le build adapte automatiquement les chemins d’assets afin qu’ils fonctionnent aussi bien à la racine d’un serveur local que sous le sous-dossier GitHub Pages du dépôt.

## Organisation des fichiers de fusion

```text
index.html
fusion/
  game-modes.js           navigation entre les deux modes
  story-moments.js        62 situations supplémentaires propres à chaque lieu
  story-dialogues.js      séquences VN, voix, confidences, débriefings et mini-jeux
  story-periods.js        contenu des 19 périodes libres
  story-world.js          moteur générique et sauvegarde
  story-world.css         interface du Mode Histoire
tests/
  game-modes.test.cjs
  story-world.test.cjs
```

Le VN historique reste dans `index.html`. Le nouveau contenu est volontairement isolé dans `fusion/` afin de ne pas réécrire les dizaines de milliers de lignes déjà validées.

## Règles de conception

Une période libre doit toujours respecter :

- le lieu et la perspective du chapitre ;
- les personnages réellement présents ;
- la tenue et le sprite de la scène VN correspondante ;
- l’urgence du récit et un nombre limité de créneaux ;
- des gains modestes mais utiles ;
- une sortie directe vers le chapitre suivant ;
- une reprise sûre après sauvegarde.

Elle ne doit pas téléporter un personnage, ouvrir artificiellement tout le continent, imposer un job incohérent ou laisser le monde attendre une catastrophe pendant une durée indéfinie.

## Validation

Les tests automatisés vérifient notamment :

- l’enregistrement des 19 périodes et de leurs portes de chapitre ;
- la présence d’au moins deux situations dans chacun des 62 lieux ;
- les quatre écrans d’amorce et cinq écrans de conséquence minimum de chaque scène ;
- les seuils relationnels des 21 confidences et l’absence de désir hors récit romantique ;
- les 12 retours explicites sur les événements des chapitres et les 4 mini-jeux non bloquants ;
- l’ouverture repliée et la navigation du tiroir de gestion ;
- la reprise d’une période active après retour au menu ;
- l’application des statistiques, relations, ressources et objets ;
- le verrou relationnel du triage impérial d’Iriana ;
- la réutilisation exacte des sprites du VN et des tenues de bal ;
- la fin d’une période et le retour au chapitre suivant ;
- les échos narratifs ;
- la conservation des données lors du changement de chapitre ;
- l’ouverture de la Chronique Alternative par le cinquième bouton.

La version statique du Dating Sim est également reconstruite et ses pages, scripts, styles et principaux assets sont contrôlés par un serveur HTTP local avant publication.
