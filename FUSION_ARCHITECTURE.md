# Fusion du Visual Novel et du Dating Sim

## Décision structurante

Le Visual Novel reste la base du jeu fusionné.

Le Dating Sim est traité comme un projet donneur : ses systèmes, ses données et ses interfaces sont transférés progressivement vers le VN. Les chapitres, scènes, choix, musiques, illustrations, statistiques, objets et entrées de Codex déjà présents ne sont pas reconstruits dans une autre technologie.

Cette décision évite deux risques :

- devoir réintégrer plus de 1,5 Go d’assets et des dizaines de milliers de lignes de scènes dans une nouvelle application ;
- créer deux sauvegardes incompatibles qui donneraient seulement l’illusion d’un jeu unique.

## Premier jalon réalisé

Une première période libre est branchée entre la fin du chapitre II et le début du chapitre III.

Le parcours devient :

1. fin du chapitre II ;
2. choix entre commencer directement le chapitre III ou explorer Al’Gratal ;
3. période libre courte de deux activités maximum ;
4. reprise du chapitre III avec les gains et souvenirs conservés.

La période propose un périmètre volontairement limité :

- Grand Marché ;
- Galerie du palais ;
- Avenues impériales ;
- Appartements d’hôtes, accessibles en soirée.

Les personnages présents respectent la situation du récit. Remerii et Iriana peuvent être rencontrées ; Valurn et Draven, déjà repartis vers leurs propres routes, ne sont pas artificiellement disponibles.

## Ce que le prototype vérifie

Le premier jalon ne sert pas seulement à afficher un nouveau menu. Il vérifie les communications essentielles entre les deux formes de jeu :

- les activités utilisent directement Audace, Lucidité, Sang-froid, Résonance et Lien Remerii ;
- les gains sont écrits dans la sauvegarde principale du VN ;
- une structure relationnelle persistante compatible avec celle du Dating Sim est ajoutée ;
- une confiance propre à Iriana peut désormais évoluer ;
- quitter vers le menu pendant le temps libre puis reprendre restaure la période ;
- le temps libre terminé ne peut pas être exploité indéfiniment pour accumuler les mêmes gains ;
- les données restent conservées lorsqu’un chapitre est lancé depuis la sélection des chapitres ;
- les choix effectués ajoutent des échos au début du chapitre III ;
- une conversation avec Remerii débloque une réponse supplémentaire dans la première discussion du chapitre III.

## État partagé

Le VN conserve ses données historiques à leur emplacement actuel. La fusion ajoute un espace dédié sans casser les anciennes sauvegardes :

```js
state.storyWorld = {
  version: 1,
  mode: "story",
  activePeriod: "algratal-preparatifs" | null,
  completedPeriods: [],
  relationships: {
    remerii: {
      affection: 0,
      trust: 0,
      desire: 0,
      stage: 0,
      met: false,
      gifts: 0
    },
    iriana: {
      affection: 0,
      trust: 0,
      desire: 0,
      stage: 0,
      met: false,
      gifts: 0
    }
  },
  periodRuns: {},
  history: []
};
```

Cette forme reprend le modèle relationnel du Dating Sim afin que les futurs contenus puissent partager les mêmes outils. Le `state.stats.lien` historique reste la valeur canonique utilisée par les chapitres existants pour Remerii.

## Frontière technique

Le fichier principal du VN reste intact autant que possible. Le nouveau système est chargé à la fin de la page :

```text
index.html
fusion/
  story-world.css
  story-world.js
tests/
  story-world.test.cjs
```

Le module de fusion :

- ajoute le choix de temps libre à la scène `c2_45` ;
- intercepte uniquement sa destination spéciale ;
- affiche une interface plein écran au-dessus du VN ;
- réutilise le registre d’assets `A` du VN ;
- réutilise la fonction `save()` du VN ;
- rend la main au moteur de scènes avec `go("c3_01")` ;
- ajoute les conséquences au registre de scènes `S`.

Aucun asset n’est dupliqué pour ce jalon.

## Règles d’une période libre du Mode Histoire

Chaque période doit déclarer :

- une scène d’entrée et une scène de reprise ;
- un lieu principal imposé par le chapitre ;
- une durée ou un nombre d’activités maximum ;
- les sous-lieux réellement accessibles ;
- les personnages présents et leurs occupations ;
- les activités disponibles selon le créneau ;
- les gains maximaux autorisés ;
- les drapeaux et souvenirs pouvant influencer les chapitres ;
- la conduite à tenir si le joueur quitte ou recharge la partie.

Une période libre ne doit jamais :

- rendre le reste du monde accessible sans justification ;
- ressusciter ou téléporter un personnage absent ;
- suspendre artificiellement une urgence narrative ;
- donner davantage de progression qu’un chapitre principal ;
- imposer un job sans cohérence avec la situation de Hylee ;
- devenir obligatoire lorsque le rythme exige un enchaînement direct.

## Roadmap de migration

### Jalon 1 — Moteur de temps libre

Statut : prototype fonctionnel.

- période courte à Al’Gratal ;
- navigation entre sous-lieux ;
- créneaux limités ;
- scènes facultatives ;
- effets persistants ;
- reprise et sauvegarde ;
- première conséquence au chapitre III.

### Jalon 2 — Contrat commun de progression

- formaliser les adaptateurs entre les clés du VN et celles du Dating Sim ;
- étendre les relations à Iriana, Naïah, Valurn et Allenna lorsqu’elles deviennent pertinentes ;
- permettre aux objets, conversations et événements libres d’ouvrir des variantes de chapitres ;
- ajouter un journal des événements secondaires ;
- différencier clairement confiance, proximité, complicité et romance ;
- préparer les migrations de sauvegarde par version.

### Jalon 3 — Bibliothèque de périodes libres

- identifier chaque intervalle narratif du VN ;
- classer les transitions en enchaînement immédiat, temps court, journée libre ou période prolongée ;
- créer les périodes adaptées sans en placer après chaque chapitre ;
- transférer progressivement les conversations, activités et petits événements utiles du Dating Sim ;
- introduire des suites secondaires invisibles si leur première scène n’a pas été déclenchée.

### Jalon 4 — Jobs du Mode Histoire

- sélectionner uniquement les jobs cohérents avec Hylee et le lieu ;
- limiter leur fréquence et leur rendement ;
- relier certains accès à la confiance d’un personnage ;
- réutiliser les variantes déjà créées pour éviter les répétitions ;
- conserver les jobs complets et réguliers comme pilier de la Chronique Alternative.

### Jalon 5 — Chronique Alternative

- ajouter le choix des deux modes au menu principal ;
- transférer le créateur de personnage ;
- reprendre les voyages libres, calendriers, présences, romances, jobs et fils narratifs du Dating Sim ;
- isoler la chronologie alternative de la sauvegarde du Mode Histoire ;
- partager les lieux, sprites, musiques, composants d’interface et règles relationnelles ;
- permettre la poursuite indéfinie après les principaux événements.

### Jalon 6 — Modularisation progressive du VN

Le `index.html` actuel dépasse cinquante mille lignes et contient une longue succession de correctifs historiques. Une réécriture globale serait trop risquée.

La modularisation doit donc suivre les fonctionnalités réellement touchées :

- extraire d’abord le moteur de sauvegarde et les adaptateurs de progression ;
- extraire ensuite le registre des périodes libres ;
- déplacer les nouveaux chapitres vers des fichiers de données sans convertir immédiatement les anciens ;
- centraliser progressivement les registres d’assets, de musiques et de scènes ;
- conserver des tests de non-régression pour les anciens chapitres.

## Stratégie d’assets

À court terme, les périodes libres réutilisent les chemins déjà connus du VN. Le Dating Sim peut fournir des variantes plus légères lorsque le VN ne possède pas de décor approprié.

À moyen terme, il faudra :

- établir un manifeste commun ;
- identifier les doublons visuels et musicaux ;
- conserver une seule identité par asset partagé ;
- distinguer les assets propres au Mode Histoire et à la Chronique Alternative ;
- éviter de recopier l’intégralité du dépôt VN dans l’application du Dating Sim.

Le poids des assets n’empêche pas la fusion, mais impose une distribution propre. Le code est léger comparé aux médias ; le problème principal est donc l’organisation et le chargement, pas la logique du jeu.

## Validation minimale avant chaque ajout

Chaque nouveau jalon doit vérifier :

- démarrage du VN sans erreur JavaScript ;
- anciennes sauvegardes encore chargeables ;
- nouvelle sauvegarde restaurée après rechargement ;
- statistiques et relations non perdues au changement de chapitre ;
- absence de répétition exploitable des récompenses ;
- cohérence des personnages présents ;
- comportement mobile et clavier ;
- reprise correcte du récit principal ;
- fonctionnement sans dépendance réseau une fois les assets installés.

Le test `tests/story-world.test.cjs` couvre déjà le branchement de la période, deux activités, les effets, la reprise après le menu, la fin de période, la conséquence au chapitre III et la conservation des données lors du lancement d’un chapitre.
