# LES CHRONIQUES DE SYLVINIA
## Documentation de production — Générique de fin du Tome I

**Destinataire :** GrokBot / équipe de développement du VN  
**Commanditaire et direction créative :** Le Chroniqueur Vagabond  
**Statut :** cahier des charges autonome pour une création originale et son intégration, novembre 2026  
**Dépôt :** https://github.com/Val1615/SylviniaVN  
**Approche :** conception originale à partir du Visual Novel actuellement en ligne et de ses ressources. Ce document est le seul cahier des charges du générique ; aucune maquette HTML externe n’est nécessaire.

---

## 1. Mission et périmètre

Intégrer un véritable générique de fin au **mode Histoire du Tome I**, après la dernière scène de l'épilogue. Il ne doit pas être une simple liste de noms : il clôt l'œuvre, restitue au joueur les moments significatifs de son propre parcours et crédite précisément la production.

Le générique comporte une ouverture frontale, puis un défilement continu **du bas vers le haut**. Il comporte quatre actes, dont un seul est narrativement personnalisé : **Votre Chronique**. Les images de fond accompagnent l'ensemble du générique, pas uniquement cet acte. Le rendu s'adapte automatiquement à l'orientation de l'écran.

### Liberté de conception et méthode de travail

Partir d’une page blanche pour la conception du générique, tout en réutilisant les composants, les conventions graphiques et les services du VN actuel lorsqu’ils sont adaptés. Ne pas chercher à reproduire une interface ou une implémentation préexistante. Étudier d’abord le véritable jeu, son identité graphique, ses assets, son moteur de sauvegarde et son gestionnaire audio ; proposer ensuite une mise en scène originale, cohérente et directement intégrée. Les choix de structure de code, d’animation, de cadrage, de composition et de transitions sont laissés à GrokBot dans le respect des exigences fonctionnelles et artistiques ci-dessous.

Les tableaux, textes et exemples techniques constituent des repères de conception, pas des limites créatives. En particulier, les timings, proportions, chemins et schémas indicatifs ne doivent pas empêcher une meilleure solution adaptée au jeu. Les intitulés de crédits validés, le sens de défilement, l’ordre des actes, la personnalisation fidèle au parcours, les deux ambiances et le thème musical provisoire sont en revanche des exigences à respecter.

### Décisions fermes

- Utiliser exclusivement le pseudonyme **Le Chroniqueur Vagabond** pour l'auteur ; ne jamais afficher son identité civile.
- Mettre en œuvre les deux directions artistiques validées : **Panoramas** en paysage, **Au-delà des cendres** en portrait.
- Ouvrir sur le titre frontal « Les Chroniques de Sylvinia », puis seulement commencer les crédits.
- Rassembler les souvenirs du voyage et les hommages aux personnages dans « Votre Chronique » ; ne pas ajouter une galerie fixe parallèle qui répéterait les souvenirs.
- Les crédits de production arrivent après cette rétrospective, vers la fin.
- Utiliser provisoirement la **musique du menu principal du VN actuel**, et non `ending.mp3`.
- Ne pas intégrer les coulisses de création à ce stade. Ne pas inventer d'anciens designs ou de citations du roman.
- Ne pas modifier le scénario, les routes, les seuils, les combats ni les conditions de déblocage existants pour faire fonctionner le générique.

Les durées, le nombre de souvenirs, les tailles typographiques et les noms techniques proposés ci-dessous sont des réglages de départ, à ajuster en fonction du rendu réel.

## 2. Séquencement général

| Partie | Contenu | Nature | Durée indicative |
|---|---|---|---|
| Ouverture | Titre frontal, Tome I | Fixe | 9 s |
| I. Le silence après la tempête | Auteur et création originale | Fixe | 35 s |
| II. Votre Chronique | Souvenirs, décisions, personnages, épreuves et conclusion personnelle | Conditionnelle | 165 s |
| III. Derrière les Chroniques | Conception, développement, illustrations, cinématiques, bande originale | Fixe | 105 s |
| IV. Un monde qui continue de vivre | Mot de l'auteur, remerciements, fin et éventuelle amorce de suite | Fixe | 46 s |

Cible initiale : environ **6 minutes**, avec une marge de 5 à 7 minutes selon le nombre de souvenirs et la lisibilité. Ne pas accélérer artificiellement le défilement pour imposer une durée fixe. L'ouverture est statique ; les actes I à IV constituent une seule bande de crédits continue. Les séparateurs d'actes sont des cartons inscrits dans la bande, pas des écrans nécessitant un clic. Le dernier carton peut rester immobile quelques secondes.

## 3. Direction artistique et comportement responsive

### 3.1 Ouverture frontale

- Afficher au centre, sur toute la surface disponible, « Les Chroniques de » puis « SYLVINIA » en titrage monumental et « TOME I » plus discret.
- Entrée en fondu (environ 2,5 s), maintien puis disparition douce. Ornements fins, dorures patinées, particules discrètes. Pas de menu de sélection avant la projection dans le jeu.
- Le titre apparaît avant toute ligne de crédit, sans être emporté par le défilement. Le premier bloc entre par le bas après sa disparition.

### 3.2 Écran large : Panoramas

- Utiliser une composition asymétrique : texte défilant dans la zone gauche (environ 40–45 % de largeur) ; scène cinématographique dominante sur la droite.
- L'image peut couvrir l'écran entier, avec un dégradé sombre côté texte. Préserver les visages et les points d'intérêt par un cadrage configurable.
- Fondus enchaînés, léger mouvement de caméra, aucune déformation d'asset. Éviter les surimpressions de cartes et les panneaux opaques massifs.

### 3.3 Écran vertical : Au-delà des cendres

- Texte centré, dans une colonne adaptée à la largeur du téléphone. Fond sombre, cendres et braises lentes, images du VN fondues dans la pénombre.
- Conserver les scènes personnalisées en portrait : ne pas les remplacer systématiquement par un fond noir. Recadrer selon les zones d'intérêt ; lorsque le recadrage détruit la composition, préférer une image contenue sur fond prolongé/assombri.
- Réduire les effets sur petits écrans et appareils modestes ; respecter les zones sûres et éviter le texte sous les barres système.

### 3.4 Typographie et continuité

Titres d'actes nettement plus imposants que les départements ; intitulés de postes plus petits que les noms crédités. Utiliser la typographie du VN ou une serif compatible, or clair, ivoire et tons cendre. Hiérarchie indicative : titres 42–80 px sur grand écran, 28–48 px en portrait ; noms 26–40 px ; texte courant 16–22 px, à adapter. Prévoir des espacements généreux entre actes, des séparateurs ornés, une longueur de ligne confortable et un voile qui maintient la lisibilité.

Le changement d'orientation (y compris Fold ouvert/fermé et redimensionnement de fenêtre) ne relance ni le générique, ni la musique, ni la sélection de souvenirs. Préserver l'identifiant du bloc en cours et sa position relative dans la zone de lecture après recalcul des hauteurs. Ne jamais modifier l'ordre du texte.

Le défilement est lent, uniforme et du bas vers le haut. Calculer le mouvement à partir du temps écoulé réel ; arrêter l'horloge pendant une pause ou lorsque l'écran de jeu n'est plus actif. Les transitions du fond ne doivent pas se déclencher à chaque ligne : une image ou un petit groupe d'images par bloc de sens.

## 4. Acte I — Le silence après la tempête

Faire respirer la fin de l'épilogue. Fonds fixes à l'échelle de tous les joueurs : Al’gratal après les événements, paysage calme, traces de la bataille, ciel voilé. Utiliser des scènes déjà communes au parcours ou des panoramas sans divulgation de routes optionnelles.

**Texte de référence :**

> CRÉATION ORIGINALE  
> Imaginé, écrit et réalisé par  
> **Le Chroniqueur Vagabond**  
> Création de l'univers, de la mythologie et des personnages  
> Écriture du roman original et direction narrative  
> Direction créative, artistique et musicale  
> Conception du jeu et supervision de la production

## 5. Acte II — Votre Chronique

### 5.1 Intention et texte d'ouverture

Faire revivre au joueur **sa** version du Tome I. Les événements canoniques peuvent servir de repères communs, mais les décisions, relations, points de vue et souvenirs doivent être sélectionnés selon sa partie. Il ne s'agit pas de noter ses performances, de désigner une bonne fin ou de refaire le récit exhaustif.

> **VOTRE CHRONIQUE**  
> Je vous ai offert un monde.  
> Vous lui avez donné votre propre histoire.  
> Souvenez-vous…

Le texte est original, au passé et à la deuxième personne du pluriel (« vous »). Il doit rappeler un choix concret et, uniquement lorsque le jeu l'établit, ses conséquences. Il ne doit pas prétendre connaître les motivations du joueur. Les images correspondantes sont le fond principal pendant la lecture de chaque souvenir.

### 5.2 Sous-sections de référence

| Bloc | Contenu possible | Traitement |
|---|---|---|
| Les premiers pas | Formation, gardien de la forêt, arrivée à Al’gratal | Décisions fondatrices, prudence, curiosité |
| Les liens tissés | Souvenirs de Remerii, confidences, serments, rencontres et moments de tension | Relations et scènes vécues |
| Les épreuves | Duels, crises magiques, découvertes, événements marquants | Choix significatifs et issues confirmées |
| Les destins croisés | Routes individuelles, moments rares, points de vue | Seulement si les scènes ont été vécues |
| Les derniers choix | Adieux, Draven/Iriana si joués, Hylee et Remerii, blizzard, Bhaal | Conclusion du parcours |

Conserver l'ordre narratif des événements sélectionnés, même si les catégories servent à équilibrer le contenu. Si une sous-section ne possède aucun souvenir admissible, l'omettre sans afficher de liste vide. Les personnages apparaissent au fil des moments qui les concernent ; aucune obligation d'afficher toute la distribution dans cette partie.

Conclure par une phrase sobre : « Telle fut votre chronique. » Une synthèse symbolique des quatre valeurs (Audace, Lucidité, Sang-froid, Résonance) est envisageable en complément, mais n'est pas obligatoire. Si elle est retenue, utiliser les valeurs et règles effectives du moteur, aucune échelle arbitraire, aucun jugement moral ni diagnostic de personnalité. Les statistiques ne remplacent jamais les souvenirs.

### 5.3 Audit préalable du moteur narratif (obligatoire)

Le dépôt contient déjà des informations exploitables : `state.flags`, `state.memories`, `state.stats`, historique de scènes, routes et récompenses. L'existence et la sémantique de chaque champ doivent être revérifiées dans **l'index actuel et les modules réellement chargés**, car `extracted.js` est une extraction antérieure.

Recenser les flags depuis l'introduction jusqu'à l'épilogue : lieux de pose, valeurs possibles, lieu de lecture, moment de validation, reset, relecture, choix exclusifs ou cumulables, preuves de scène vécue. Pour chaque entrée, vérifier l'asset correspondant et le contexte exact de son illustration. Ne pas confondre un prérequis, un déblocage de route et son accomplissement. Ne pas déduire qu'un joueur a vu une scène parce qu'il possède un chapitre débloqué.

Produire un manifeste auditable (JSON ou module JS) et un tableau de correspondance lisible. Viser à terme une banque de 60–100 souvenirs potentiels si le contenu réel le permet ; privilégier d'abord un noyau validé et représentatif. Ce nombre n'est pas un quota artificiel.

### 5.4 Flags et souvenirs déjà identifiés : point de départ

Les valeurs finales ci-dessous proviennent du fichier `docs/production/finale_flags_audit.md` (audit v0.419) consulté précédemment ; les premiers chapitres proviennent de `extracted.js`. Il faut confirmer leur validité dans la version livrée. Les textes proposés ne sont pas des citations du roman.

| Donnée | Interprétation / condition minimale |
|---|---|
| `wolfApproach` | Attitude face au gardien ; valeur `still` repérée : rester immobile. Auditer les autres valeurs. |
| `gateReaction` | Réaction aux portes d'Al’gratal ; `down`, `fists` repérées. |
| `remeriiSeSouviendraAssurance`, `remeriiSeSouviendraMaitrise`, `remeriiSeSouviendraPatience` | Souvenirs de Remerii ; regrouper les choix redondants. |
| `batonCerisierAccorde`, `remeriiSeSouviendraBaton` | Événement du bâton ; vérifier si les deux flags sont nécessaires. |
| `medigSerment`, `remeriiSeSouviendraMedig` | Serment et souvenir associé ; une seule entrée narrative. |
| `state.memories` | Identifiants de souvenirs reconnus par le catalogue de progression ; mapper les entrées, pas les clés brutes. |
| `s02Regard` | `demendras` / `remerii` ; regard au moment du choix. |
| `s02Adieu` | `confiance` / `peur` ; adieux et réponse du final. |
| `c18PlayedDraven`, `s06DravenComplete` | Vérifier les preuves de route réellement jouée dans la partie d'origine ; ne pas prendre le simple déblocage. |
| `s06LinevaWords` | `promesse` / `mere` / `fierte` ; paroles de Draven à Lineva, si route vécue. |
| `s06Posture`, `s06Plan`, `s06Voute` | Décisions du parcours Draven ; retenir seulement les plus pertinentes, après validation de la route. |
| `c18PlayedIriana`, `s07IrianaComplete` | Même règle pour le parcours Iriana. |
| `s07Maitrise`, `s07Garde` | Ex. `esprit` / `regard` / `lacher` pour la garde ; vérifier les textes exacts. |
| `s07Renversement` | `retenir` / `mort` / `question` / `tresse` ; texte adapté à la variante effectivement jouée. |
| `s08Reponse` | `seule` / `main` ; réponse d'Hylee à Remerii. |
| `s08Gardien`, `s08Dragon` | `rempart` / `assaut` / `tout` ; `portail` / `gorge` / `tenir` ; ne pas interpréter sans lire la scène de résolution. |
| `s08Arcane`, `s08Sync` | Flux d'Arcane, valeurs `accueillie` et `ok` ; événements communs si aucune variation narrative réelle. |
| `s04M1`…`s04M5`, `s04Qte` | Données de duel, réinitialisées au retry ; ne retenir que l'issue validée, jamais chaque manche. |
| `tome1Complete` | Marque la complétion à `c19_bilan` dans l'audit ; ne pas lancer le générique avant la dernière scène de l'épilogue. |

Attention : l'audit mentionne `finaleReplay`, qui restaure les flags de la partie originale après une relecture. Les marqueurs `c18Played…` peuvent persister après relecture. Ne pas les utiliser isolément si leur provenance est ambiguë. La sélection doit être fondée sur une capture de la vraie partie, non sur un état temporaire ou développeur.

### 5.5 Catalogue et moteur de sélection

Créer un module séparé de l'affichage, maintenable sans réécrire le lecteur de crédits. Schéma indicatif d'une entrée :

```json
{
  "id": "finale_hylee_main",
  "chapterOrder": 1808,
  "group": "s08_reponse",
  "category": "derniers_choix",
  "requires": {"flags": {"s08Reponse": "main", "s08BlizzardComplete": true}},
  "title": "Une main dans la tempête",
  "text": "Face à la tempête, vous avez choisi de ne pas avancer seule.",
  "backgrounds": ["assets/images/keyscenes/chapter18-s08/s08_20_hylee_soutient_remerii.webp"],
  "priority": 90,
  "adult": false
}
```

Exemple de structure, **pas une correspondance image/scène définitivement validée**. Contrôler que cette image est bien commune à la variante `main` avant adoption ; remplacer sinon par un asset exact ou un décor neutre confirmé. Pour la variante `seule`, créer une entrée du même groupe avec une condition exclusive et un texte distinct : « Face à la tempête, vous avez choisi de puiser dans votre propre force. »

Algorithme demandé :

1. Lire une capture immuable de la partie Histoire terminée ; normaliser les types et données absentes.
2. Filtrer les entrées selon les valeurs exactes, la provenance, les scènes effectivement vécues et le statut de validation. Une clé absente n'est pas équivalente à une valeur négative.
3. Dédupliquer par groupe d'événements ; ne garder qu'une variante exclusive. Une entrée composite peut lire plusieurs flags ou souvenirs.
4. Classer par pertinence narrative, importance, diversité des personnages et rareté réellement établie, jamais par moralité. Sélection déterministe, avec identifiant stable comme dernier critère de tri.
5. Viser 10–16 souvenirs, répartis entre le début, les relations, les épreuves, les routes et le final. Ajuster selon la longueur des textes. Ne pas remplir artificiellement les places avec des événements non prouvés.
6. Trier selon l'ordre narratif (et l'ordre réel de visite pour les branches si disponible). Construire un tableau unique de blocs texte/fonds.
7. Si la sauvegarde ancienne ne contient pas assez de preuves, afficher une rétrospective plus courte et des événements communs confirmés. Ne jamais inventer un choix. Le générique fixe doit rester accessible.

Prévoir une politique de contenu : utiliser des visuels narratifs non explicites, notamment pour les souvenirs de relations. Le crédit « Illustrations pour public adulte » n'implique pas d'afficher ces illustrations dans le générique. Respecter les options de contenu existantes.

## 6. Acte III — Derrière les Chroniques

Cette partie est fixe. Organiser en véritables départements, avec un grand carton distinct pour chacun. Les attributions ci-dessous sont confirmées par le créateur. Distinguer les responsabilités de l'auteur et les contributions assistées par IA. Ne pas présenter les outils comme des employés ou un studio partenaire. Garder la graphie exacte des noms.

| Département / poste affiché | Attribution | Précisions à afficher |
|---|---|---|
| CONCEPTION & DÉVELOPPEMENT | | Contributions assistées par IA |
| Assistance à la direction technique et créative | **ChatGPT** | Conception technique et fonctionnelle ; prototypage du jeu et des interfaces ; préparation des consignes de production ; supervision de la cohérence narrative et visuelle ; vérification et assurance qualité. |
| Développement principal et intégration technique | **GrokBot** | Programmation avancée des fonctionnalités ; réalisation et intégration de l'interface graphique ; mise en œuvre des consignes de production et des travaux de prototypage. |
| ILLUSTRATIONS | | Production graphique |
| Production graphique principale | **ChatGPT** | Personnages, décors, sprites, scènes clés et recherches visuelles. |
| Illustrations pour public adulte | **Grok Imagine** | Production des illustrations destinées à un public adulte. |
| CINÉMATIQUES | | Production vidéo |
| Production cinématique et animation | **Grok Imagine & Seedance** | Génération vidéo, animation et mise en mouvement des scènes. |
| BANDE ORIGINALE | | Production musicale |
| Composition musicale originale | **Le Chroniqueur Vagabond** | Compositions personnelles. |
| Production musicale assistée par IA | **Suno** | Création de morceaux de la bande originale avec assistance générative. |

La musique du VN est un ensemble de compositions personnelles et de productions avec Suno : ne pas attribuer toute la bande originale à l'un ou l'autre. Si un inventaire piste par piste est ajouté plus tard, il devra être fourni ou validé par le créateur. Ne pas ajouter de poste, outil, nom de personne ou attribution non confirmés.

Fond : panoramas et scènes emblématiques représentatives du travail graphique, sans coulisses ni illustrations explicites. Garder une image stable sur plusieurs crédits contigus d'un même département.

## 7. Acte IV — Un monde qui continue de vivre

Revenir progressivement à une ambiance contemplative. Utiliser des scènes communes de fin, des paysages ou un visuel de transition déjà validé. Préserver l'esprit d'un livre qui se referme.

**Mot de l'auteur (texte proposé comme base rédactionnelle) :**

> Sylvinia est née de mon imagination, mais c'est en la partageant qu'elle prend véritablement vie.  
> Merci d'avoir consacré une partie de votre temps à explorer ce monde, à rencontrer ses personnages et à vivre leur histoire.  
> Puissent ces souvenirs vous accompagner au-delà de ces dernières pages.

Puis « À vous, joueurs et lecteurs » ; « Merci. » ; **FIN DU TOME I** ; « Mais pas de son histoire… ».

L'éventuelle amorce post-générique doit rester courte et ne rien inventer du Tome II. Le dépôt contient `hylee2_teasing.png`, une ressource éventuelle à examiner ; ne l'utiliser en production qu'après contrôle de sa pertinence et de l'absence de divulgation non souhaitée. À défaut, conserver un simple carton « À suivre… ». Après le dernier écran, retour au menu principal. Un accès aux Chroniques Alternatives peut être proposé via les mécanismes existants, sans lancer un nouveau parcours automatiquement.

## 8. Ressources visuelles et synchronisation

Utiliser les fichiers du dépôt, résolus par le registre d'assets ou par des chemins relatifs au jeu. Privilégier les ressources locales du jeu et son registre d’assets ; ne pas ajouter de dépendance à un hébergement externe pour des fichiers déjà disponibles dans le dépôt. Aucune génération d'image supplémentaire requise.

Quelques ressources identifiées dans l'arborescence GitHub (vérifier le fichier, le cadrage et le contexte dans la version actuelle) :

| Usage | Chemin relatif |
|---|---|
| Al’gratal | `assets/images/algratal_panorama.png` |
| Mir’Aldas | `assets/images/chapter6/c6_miraldas_nuit.png` |
| Akuhn’Nabad | `assets/images/keyscenes/chapter9/c9_key_akuhn_panorama.png` |
| Couronnement (si vécu) | `assets/images/keyscenes/chapter12/group/c12g_key_tia_couronnement_large.png` |
| Porte Noire | `assets/images/backgrounds/finale/bg_porte_noire_plaine.png` |
| Souvenir d'Amanea (si vécu) | `assets/images/keyscenes/chapter18-amanea/amanea_11b_sous_les_constellations.png` |
| Dragon du blizzard | `assets/images/keyscenes/chapter18-s08/s08_18_le_dragon_prend_forme.webp` |
| Retour à Al’gratal | `assets/images/keyscenes/chapter19-s09/s09_01_algratal_sous_le_ciel_voile.webp` |

En production, chaque entrée possède des images compatibles avec ses conditions. Une scène de route optionnelle ne doit pas non plus apparaître dans les actes fixes chez un joueur qui ne l'a pas vue. Les panoramas neutres et scènes canoniques vérifiées assurent la continuité visuelle universelle.

Synchroniser le fond avec le bloc qui approche de la zone centrale de lecture ; prévoir une zone de stabilité/hystérésis pour éviter les oscillations. Fondu de 1,5 à 3 s, une à trois images maximum par souvenir, maintien suffisamment long pour lire le texte. Précharger le prochain petit groupe de fonds, jamais toute la banque ; libérer les anciens médias. Si un asset manque, garder le fond valide ou basculer vers un décor neutre sombre. Pas d'écran blanc, d'icône d'image cassée ni de blocage. Une rotation ou un retour d'onglet ne doit pas provoquer une avalanche de chargements. Prévoir une réduction des particules/mouvements selon les préférences et la charge.

## 9. Musique — thème du menu principal (provisoire)

**Utiliser la musique réellement jouée dans le menu principal du VN actuel.** Dans `extracted.js`, la clé `music_menu` correspond à `assets/audio/menu.mp3` et est libellée « Menu principal ». Le dépôt contient aussi `assets/audio/title/title_intro_theme.mp3` : ne pas confondre un thème d'introduction avec le fond musical du menu. Vérifier le lecteur audio et le mapping actuels, réutiliser la clé officielle plutôt que créer une copie de la piste.

- Lancer la musique au début du titre frontal, après une transition audio douce depuis la dernière scène de l'épilogue.
- Réutiliser le gestionnaire audio global, le volume, le réglage de musique et le comportement muet du jeu. Ne pas imposer de son au joueur ni créer deux pistes concurrentes. Si la désactivation du thème de menu est un réglage distinct, conserver sa sémantique et faire respecter au minimum le réglage général de musique.
- Maintenir une continuité sonore sur les quatre actes, sans redémarrage lors d'un changement d'image ou d'orientation. Si la piste est plus courte, utiliser la boucle disponible ou un raccord discret ; pas de changement arbitraire de morceau.
- Prévoir pause/reprise et sortie sans audio fantôme ; si le navigateur bloque l'autoplay, démarrer à la prochaine interaction autorisée. En cas d'échec, continuer silencieusement.
- Fondu de fin vers le menu. Si le thème est déjà en cours, le gestionnaire peut conserver la lecture et rétablir les paramètres du menu sans doublon.
- La piste doit rester configurable pour accueillir ultérieurement un thème de crédits original, sans refonte du générique. Pas d'OST nouvelle à produire dans cette mission.

## 10. Intégration, sauvegarde et accès ultérieur

1. Repérer le vrai point de sortie de l'épilogue (l'audit identifie `c19_fin` puis le menu). Capturer la partie canonique une fois le Tome I validé, mais démarrer la projection uniquement après la dernière scène ; ne pas couper les dernières lignes du roman.
2. Utiliser un écran/état dédié au générique. Il ne doit pas être traité comme une scène de choix et ne doit modifier ni stats, ni flags narratifs, ni inventaire, ni récompenses. En quittant, restaurer proprement le menu, les gestionnaires et l'audio.
3. Enregistrer une capture versionnée et légère de la chronique : identifiant de parcours, version de catalogue, valeurs et souvenirs strictement nécessaires, liste ordonnée d'entrées sélectionnées (et variantes ou texte résolu). L'emplacement et le format définitifs suivent l'architecture de sauvegarde actuelle. Préserver la compatibilité des sauvegardes existantes ; ne pas réutiliser une clé de flag narrative pour y stocker cette capture.
4. Ne jamais écraser cette chronique par une relecture de chapitre, un mode développeur, une partie de Chroniques Alternatives ou un duel réessayé. Nouvelle vraie partie terminée : créer sa propre capture selon le système de sauvegardes du VN. Si aucun historique fiable n'est disponible pour une ancienne partie, proposer un générique de base sans fausse personnalisation.
5. Prévoir, après complétion, un accès **Ma Chronique** dans Progression (ou l'emplacement équivalent du VN actuel), qui relit la capture sans recalcul à partir de flags modifiés depuis. Dans le générique, le titre de l'acte reste **Votre Chronique**.
6. Autoriser à tout moment la pause, la reprise, l'accès plein écran lorsque disponible et le passage du générique via confirmation discrète si nécessaire. Au passage, enregistrer la complétion normalement et garder l'accès ultérieur. Contrôles de navigation temporelle/vitesse et sélection d'acte utiles en développement ; éviter une interface d'atelier visible en permanence dans la projection finale. Pas de choix d'orientation manuel requis pour le joueur.
7. Aucun appel réseau à une IA au moment du générique ; sélection locale, déterministe, données de sauvegarde privées. Les textes de crédits sont des données de production, pas des requêtes génératives.

## 11. Plan de réalisation et vérifications raisonnables

**Lot A — conception originale du lecteur et du contenu fixe.** Étudier le VN actuel et réaliser un nouvel écran intégré : ouverture, défilement, quatre actes, fonds, orientation, audio du menu, retour au menu. Concevoir le conteneur narratif de Votre Chronique comme partie native de ce lecteur. Aucun placeholder de choix fictif en production.

**Lot B — catalogue de souvenirs.** Auditer les chapitres et le final, écrire les variantes réellement conditionnelles, associer les assets, documenter les preuves de visite et les données manquantes. Mettre en place la capture et la sélection locale.

**Lot C — intégration finale.** Accès Ma Chronique, finition visuelle, continuité sonore, correction des régressions et compte rendu. Les tests doivent rester ciblés et progressifs : ne pas immobiliser le développement par un cycle de tests exhaustif à chaque petite modification.

### Matrice minimale de recette

| Cas | Résultat attendu |
|---|---|
| Parcours sans branche optionnelle | Pas de scènes Draven/Iriana optionnelles, conclusion commune et choix réellement prouvés. |
| Branche Draven jouée | Souvenir Draven et variante de Lineva corrects, pas d'Iriana si absente. |
| Branche Iriana jouée | Souvenir Iriana et variante de maîtrise/renversement corrects. |
| Deux branches vécues | Les deux présentes si prouvées et pertinentes ; ordre cohérent, pas de doublon. |
| Deux réponses `s08Reponse` | Textes différents et visuels compatibles ; une seule entrée par groupe. |
| Retry de duel / relecture de chapitre | Pas de souvenir d'échec annulé ; capture originale inchangée. |
| Sauvegarde ancienne ou flags absents | Pas d'erreur ni d'interprétation fictive ; rétrospective raccourcie. |
| Paysage, portrait, Fold et rotation en cours | Mise en page correcte, même bloc et même musique, sans recommencement. |
| Fond indisponible / audio bloqué / musique coupée | Mode dégradé lisible et silencieux si nécessaire ; générique non bloqué. |
| Pause, reprise, passage, retour menu | Défilement et audio propres ; complétion et sauvegardes intactes. |
| Nouveau parcours / réouverture de Ma Chronique | Isolation des parties, restitution stable des souvenirs sélectionnés. |

Effectuer quelques vérifications unitaires du sélecteur avec des états synthétiques, puis un smoke test d'intégration et un contrôle visuel aux formats large et vertical. Utiliser les fixtures et outils déjà présents dans le dépôt lorsque possible. Ne pas déclarer un test réussi sans l'avoir exécuté. Si un problème ne concerne pas ce lot, le documenter plutôt que réécrire tout le moteur.

## 12. Livrables attendus et critères de validation

- Code intégré au VN, compatible avec son architecture actuelle ; module de sélection et données de crédits séparés dans la mesure du possible.
- Catalogue des souvenirs, mapping des flags/scènes/assets, indication des conditions non vérifiées et décisions de repli.
- Générique complet, adaptatif, du bas vers le haut, titre frontal, grands titres d'actes, fonds dans les quatre actes, crédits exacts, thème du menu.
- Capture de la partie terminée et accès ultérieur à la chronique personnelle sans corruption des sauvegardes.
- Compte rendu court : fichiers changés, déclencheur réel, piste audio retenue, nombre de souvenirs validés, scénarios testés, limitations et travaux restant à faire.

**Règle d'or :** les scènes fixes racontent Sylvinia en tant qu'œuvre ; Votre Chronique raconte Sylvinia en tant qu'expérience du joueur. Aucun souvenir personnalisé ne doit être affiché sans preuve qu'il appartient à cette partie.

### Sources et limites de cette consigne

- Audit du final : https://github.com/Val1615/SylviniaVN/blob/main/docs/production/finale_flags_audit.md
- Extraction du moteur : https://github.com/Val1615/SylviniaVN/blob/main/extracted.js
- Jeu actuel à contrôler avant intégration : https://github.com/Val1615/SylviniaVN/blob/main/index.html

L'audit complet de l'index actuel n'a pas été réalisé ici : les données de flags et chemins recensées constituent un point de départ, pas une certification de la dernière version. Les intitulés de crédits et les grandes décisions artistiques sont validés ; les valeurs de minutage, seuils de sélection, texte de liaison et API techniques sont des propositions de mise en œuvre. Aucune modification du dépôt n'a été effectuée dans le cadre de cette documentation.
