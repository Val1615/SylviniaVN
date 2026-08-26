(function registerSylviniaStoryMoments() {
  "use strict";

  if (window.SylviniaStoryMoments) return;

  const moments = {};

  function add(periodId, spotId, definition) {
    const key = `${periodId}:${spotId}`;
    moments[key] = moments[key] || [];
    moments[key].push({
      eyebrow: "Moment supplémentaire",
      prompt: "Quelle place donner à ce moment ?",
      ...definition,
    });
  }

  /* Chapitre I · Campement sur la route d’Al’Gratal */
  add("forestier-avant-depart", "salle", {
    id: "plus-conseils-habitués",
    title: "Les trois versions du même itinéraire",
    speaker: "Remerii",
    intro: "La carte de Remerii, les notes prises à Al’Gratal deux ans plus tôt et l’intuition magique d’Hylee proposent trois chemins différents. Remerii prétend qu’elle n’est pas contrariée par cette concurrence.",
    resolution: "Elles conservent la route la plus sûre et notent les deux autres comme replis. Hylee n’a pas seulement suivi une leçon : son observation a réellement changé leur trajet.",
    relation: "remerii",
    approaches: ["lucidite", "audace", "sangfroid"],
  });
  add("forestier-avant-depart", "chambre", {
    id: "plus-place-dans-le-sac",
    title: "Une place pour ce qu’elles trouveront",
    speaker: "Hylee",
    intro: "Une fois le sac refermé, Hylee remarque qu’elle a laissé volontairement une poche vide. Remerii veut savoir si c’est un oubli ou une forme très optimiste d’organisation.",
    resolution: "La poche reste vide pour ce que la route leur fera découvrir. Remerii juge l’idée peu rigoureuse, puis déplace discrètement une fiole afin de lui laisser davantage de place.",
    relation: "remerii",
    approaches: ["resonance", "lucidite", "audace"],
  });
  add("forestier-avant-depart", "lisiere", {
    id: "plus-bruits-derriere",
    title: "Les bruits qui suivent le camp",
    speaker: "Narrateur",
    intro: "Depuis le sentier, Hylee distingue les pas de Remerii, le bois humide dans le feu et une troisième cadence qui s’arrête chaque fois qu’elle tend l’oreille.",
    resolution: "La présence ne franchit pas le cercle du camp. Hylee apprend à ne pas transformer chaque mystère de la forêt en menace, sans renoncer pour autant à la prudence.",
    approaches: ["sangfroid", "resonance", "audace"],
  });

  /* Chapitre II · Al’Gratal */
  add("algratal-preparatifs", "marche", {
    id: "plus-marchand-insistant",
    title: "Une humaine n’est pas une servante",
    speaker: "Marchand sylvinien",
    intro: "Un marchand tend ses paquets à Hylee sans même la regarder, certain qu’elle accompagne Remerii pour les porter. Remerii attend une seconde avant de corriger l’erreur.",
    resolution: "Le marchand reprend ses paquets avec une raideur offensée. La scène paraît minuscule à l’échelle d’Al’Gratal, mais Hylee décide elle-même de la trace qu’elle lui laisse.",
    relation: "remerii",
    approaches: ["audace", "sangfroid", "lucidite"],
  });
  add("algratal-preparatifs", "palais", {
    id: "plus-pli-mal-adresse",
    title: "Le pli remis à la mauvaise personne",
    speaker: "Iriana",
    intro: "Un page essoufflé confie à Hylee un pli destiné à une intendante. Iriana a vu l’erreur, mais lui laisse quelques secondes pour décider comment la réparer.",
    resolution: "Le pli rejoint son destinataire sans incident. Plus que la méthode, Iriana retient qu’Hylee n’a ni paniqué ni profité d’un accès qui ne lui appartenait pas.",
    relation: "iriana",
    approaches: ["lucidite", "sangfroid", "audace"],
  });
  add("algratal-preparatifs", "avenues", {
    id: "plus-coursier-perdu",
    title: "Le coursier qui ne sait plus lire la ville",
    speaker: "Jeune coursier",
    intro: "Un coursier humain tourne depuis trop longtemps autour de la même place. Les enseignes magiques d’Al’Gratal changent selon celui qui les regarde et aucune ne semble vouloir l’aider.",
    resolution: "Hylee découvre un passage de service absent des plans officiels. En guidant le coursier, elle apprend aussi comment les humains circulent dans une ville qui ne les a pas pris en compte.",
    approaches: ["lucidite", "resonance", "audace"],
  });
  add("algratal-preparatifs", "appartements", {
    id: "plus-repas-refroidi",
    title: "Un repas oublié sur les cartes",
    speaker: "Remerii",
    intro: "Le plateau livré depuis une heure refroidit près des cartes de Mir’Aldas. Remerii prétend qu’elle mangera après avoir vérifié un dernier itinéraire — exactement comme lors des trois vérifications précédentes.",
    resolution: "Les cartes restent incomplètes, mais le repas est partagé. Hylee comprend que prendre soin de Remerii exige parfois de lui opposer une limite très ordinaire.",
    relation: "remerii",
    approaches: ["audace", "sangfroid", "lucidite"],
  });

  /* Chapitre III · Campement */
  add("camp-avant-croisee", "feu", {
    id: "plus-main-fatiguee",
    title: "La main qui tremble près du feu",
    speaker: "Hylee",
    intro: "En ravivant les braises, Remerii laisse sa main trembler une seule fois. Elle la retire aussitôt, comme si la fatigue pouvait être annulée avant d’avoir été vue.",
    resolution: "Remerii n’avoue pas avoir veillé. Elle accepte pourtant qu’Hylee prenne le prochain tour, ce qui revient presque au même entre elles.",
    relation: "remerii",
    approaches: ["lucidite", "sangfroid", "audace"],
  });
  add("camp-avant-croisee", "lisiere", {
    id: "plus-traces-autour-camp",
    title: "Des traces qui tournent sans approcher",
    speaker: "Narrateur",
    intro: "De petites empreintes font deux fois le tour du camp avant de repartir vers Mir’Aldas. Ni animal affamé ni éclaireur, leur régularité ressemble à une curiosité prudente.",
    resolution: "Hylee ne découvre pas qui observait le camp, mais elle apprend à reconnaître la frontière entre une menace et une présence qui hésite encore.",
    approaches: ["lucidite", "resonance", "sangfroid"],
  });
  add("camp-avant-croisee", "bagages", {
    id: "plus-fiole-fendue",
    title: "La fiole fendue",
    speaker: "Narrateur",
    intro: "Une fiole de soin s’est fendue entre deux couvertures. Il reste assez de produit pour être utile, à condition de le transvaser sans contaminer le reste des provisions.",
    resolution: "La perte est limitée et le paquetage réorganisé. Ce petit accident révèle les objets que chacun avait rangés trop vite pour ne pas parler du cauchemar.",
    approaches: ["lucidite", "sangfroid", "resonance"],
  });

  /* Route Valurn · Calciterres */
  add("calciterres-apres-valurn", "ruines", {
    id: "plus-signe-bellirith",
    title: "Le signe gravé après son départ",
    speaker: "Valurn",
    intro: "Sur une pierre qu’il avait déjà examinée, Valurn découvre une entaille récente. Le trait n’était pas là avant sa rencontre avec Bellirith et ressemble trop à une invitation pour être innocent.",
    resolution: "Il comprend que Bellirith ne lui demande pas de revenir : elle veut seulement qu’il sache qu’un chemin reste ouvert dans les deux sens.",
    relation: "bellirith",
  });
  add("calciterres-apres-valurn", "camp", {
    id: "plus-deux-versions-rapport",
    title: "Deux versions du même rapport",
    speaker: "Narrateur",
    intro: "Valurn rédige deux conclusions. L’une rassurera Iriana ; l’autre lui permettra de prendre la bonne décision. Elles ne racontent pas exactement la même vérité.",
    resolution: "Une seule version est scellée. L’autre brûle lentement, mais Valurn en conserve chaque phrase.",
    relation: "iriana",
  });
  add("calciterres-apres-valurn", "route", {
    id: "plus-patrouille-lointaine",
    title: "Une patrouille sur la mauvaise route",
    speaker: "Valurn",
    intro: "Des lanternes impériales avancent hors de l’itinéraire habituel. Être reconnu expliquerait sa présence ; rester invisible permettrait de découvrir ce qu’elles cherchent ici.",
    resolution: "Valurn choisit ce que l’Empire saura de son retour — et ce que lui-même apprendra de cette patrouille déplacée.",
  });

  /* Route Draven · Forthaven */
  add("forthaven-apres-draven", "quais", {
    id: "plus-caisse-civile",
    title: "La caisse marquée pour la ville basse",
    speaker: "Quartier-maître",
    intro: "Une caisse de médicaments destinée à la ville basse a été chargée avec le détachement. La reprendre affaiblit l’expédition ; l’emporter prive des familles qui l’attendent déjà.",
    resolution: "Draven fait inscrire la décision et son responsable. À Forthaven, même un choix nécessaire doit rester une dette visible.",
    relation: "lineva",
  });
  add("forthaven-apres-draven", "remparts", {
    id: "plus-releve-silencieuse",
    title: "Une relève de garde sans discours",
    speaker: "Lineva",
    intro: "Un jeune garde refuse de quitter son poste malgré sa fièvre. Lineva pourrait l’ordonner ; elle attend de voir si Draven saura lui parler sans transformer l’épuisement en honte.",
    resolution: "Le garde finit par céder sa place. Il ne part pas vaincu : quelqu’un lui a rappelé qu’un rempart tient aussi parce que ses défenseurs reviennent le lendemain.",
    relation: "lineva",
  });
  add("forthaven-apres-draven", "salle-guerre", {
    id: "plus-marque-effacee",
    title: "La marque effacée de la carte",
    speaker: "Draven",
    intro: "Une position abandonnée a disparu de la carte officielle, comme si les soldats perdus avec elle n’avaient jamais existé. Le greffier invoque un simple besoin de lisibilité.",
    resolution: "La marque retrouve sa place, plus petite mais intacte. Une carte de guerre doit guider les vivants sans effacer le prix déjà payé.",
    relation: "lineva",
  });

  /* Chapitre V · Mir’Aldas */
  add("miraldas-apres-saidin", "dome", {
    id: "plus-cristal-curieux",
    title: "Le cristal qui suit Hylee",
    speaker: "Narrateur",
    intro: "Un cristal d’éclairage change légèrement de couleur chaque fois qu’Hylee passe sous lui. Deux apprentis le remarquent et commencent à la suivre pour vérifier leur théorie.",
    resolution: "Le phénomène n’est ni dangereux ni tout à fait banal. Hylee gagne surtout le droit étrange d’être observée ici comme une énigme magique plutôt que comme une humaine déplacée.",
    approaches: ["resonance", "lucidite", "audace"],
  });
  add("miraldas-apres-saidin", "bibliotheque", {
    id: "plus-livre-retourne",
    title: "Le livre qui refuse son rayon",
    speaker: "Saidin",
    intro: "Chaque fois que Saidin replace un petit traité sans titre, celui-ci réapparaît sur la table d’Hylee. Le vieux mage soutient que la bibliothèque manque simplement de discipline.",
    resolution: "Le traité contient une annotation destinée à quelqu’un qui ne pouvait pas encore la lire. Saidin ne confirme rien, mais cesse enfin d’essayer de ranger le livre.",
    relation: "saidin",
    approaches: ["lucidite", "resonance", "sangfroid"],
  });
  add("miraldas-apres-saidin", "atelier", {
    id: "plus-outil-remerii",
    title: "Un outil réglé pour une ancienne habitude",
    speaker: "Remerii",
    intro: "Remerii saisit un focaliseur et le règle sans réfléchir selon une méthode qu’elle n’utilise plus. Saidin reconnaît le geste depuis l’autre bout de l’atelier, mais garde le silence.",
    resolution: "Hylee aperçoit un fragment de la Remerii qui a vécu ici. Elle peut le laisser exister sans exiger immédiatement toute l’histoire qui l’accompagne.",
    relation: "remerii",
    approaches: ["lucidite", "sangfroid", "resonance"],
  });
  add("miraldas-apres-saidin", "residence", {
    id: "plus-voisine-reconnait",
    title: "Quelqu’un se souvient de Remerii",
    speaker: "Ancienne voisine",
    intro: "Une mage âgée reconnaît Remerii dans le couloir et l’appelle par un surnom que Hylee n’a jamais entendu. La joie de la femme se heurte aussitôt à la réserve de Remerii.",
    resolution: "La conversation reste brève, mais le surnom demeure. Pour Hylee, Mir’Aldas gagne une nouvelle couche : celle d’une vie de Remerii qui ne tournait pas encore autour d’elle.",
    relation: "remerii",
    approaches: ["sangfroid", "lucidite", "audace"],
  });

  /* Chapitre VI · Matin libre à Mir’Aldas */
  add("miraldas-matin-libre", "patisserie", {
    id: "plus-derniere-tartelette",
    title: "La dernière tartelette",
    speaker: "Remerii",
    intro: "Il ne reste qu’une tartelette encore chaude. Remerii affirme avec un sérieux parfait qu’un partage inégal serait une faute stratégique majeure.",
    resolution: "La négociation devient absurdement solennelle. Ce rire minuscule donne au matin une douceur que ni l’une ni l’autre n’avait prévue.",
    relation: "remerii",
    approaches: ["audace", "lucidite", "sangfroid"],
  });
  add("miraldas-matin-libre", "terrasse", {
    id: "plus-notes-au-vent",
    title: "Des notes confiées au vent",
    speaker: "Narrateur",
    intro: "Une rafale arrache les notes d’une apprentie et les disperse autour de la terrasse. Certaines feuilles réagissent à la magie et refusent obstinément de se laisser attraper.",
    resolution: "Les pages sont récupérées dans un ordre différent, révélant par hasard un lien que leur autrice n’avait pas vu entre deux formules.",
    approaches: ["resonance", "audace", "lucidite"],
  });
  add("miraldas-matin-libre", "atelier", {
    id: "plus-sort-debutant",
    title: "Le sort qui gonfle au lieu de briller",
    speaker: "Jeune apprenti",
    intro: "Le globe lumineux d’un débutant absorbe la clarté de l’atelier au lieu d’en produire. Il supplie Hylee de l’aider avant le retour de son instructrice.",
    resolution: "Le sort est dissipé sans explosion. Hylee mesure le chemin parcouru en découvrant qu’elle peut désormais rassurer quelqu’un avec les mots que Remerii employait autrefois pour elle.",
    approaches: ["sangfroid", "lucidite", "resonance"],
  });

  /* Chapitre VII · Forêt Interdite, perspective Valurn */
  add("foret-apres-pacte", "clairiere", {
    id: "plus-offrande-animale",
    title: "Une offrande déposée à distance",
    speaker: "Naïah",
    intro: "Un petit animal laisse un objet brillant à la limite de la clairière avant de disparaître. Naïah y voit un message ; Valurn, une coïncidence peut-être trop élégante.",
    resolution: "L’objet n’a presque aucune valeur, mais la manière dont il est accepté ou refusé dit à Naïah si Valurn comprend les règles silencieuses de la forêt.",
    relation: "naiah",
  });
  add("foret-apres-pacte", "ruines", {
    id: "plus-racine-fragment",
    title: "La racine autour du fragment",
    speaker: "Valurn",
    intro: "Une racine s’est refermée autour d’un fragment magique comme une main. La couper libérerait l’objet ; la laisser pourrait permettre à la forêt de l’absorber.",
    resolution: "Le choix révèle moins la nature du fragment que la façon dont Valurn considère désormais ce territoire : ressource, menace ou volonté étrangère.",
    relation: "naiah",
  });
  add("foret-apres-pacte", "lisiere", {
    id: "plus-pas-derriere",
    title: "Des pas qui s’arrêtent avec les siens",
    speaker: "Narrateur",
    intro: "Quelque chose suit Valurn jusqu’à la lisière et s’immobilise chaque fois qu’il se retourne. L’allure est trop légère pour Naïah, trop régulière pour une bête.",
    resolution: "La présence ne franchit jamais la limite de la forêt. Valurn repart avec la certitude inconfortable qu’un témoin a choisi de le laisser partir.",
  });

  /* Chapitre VIII · Préparatifs à Al’Gratal */
  add("algratal-avant-expedition", "camp-forthaven", {
    id: "plus-pari-recrues",
    title: "Le pari des nouvelles recrues",
    speaker: "Draven",
    intro: "Deux soldats parient discrètement sur le temps qu’Hylee tiendra pendant l’expédition. Draven entend tout et lui laisse décider si elle veut répondre elle-même.",
    resolution: "Le pari change de nature : il ne porte plus sur l’échec d’Hylee, mais sur la première recrue qui osera encore la sous-estimer devant elle.",
    relation: "draven",
    approaches: ["audace", "sangfroid", "lucidite"],
  });
  add("algratal-avant-expedition", "palais", {
    id: "plus-sceau-manquant",
    title: "Le sceau qui manque au dernier ordre",
    speaker: "Iriana",
    intro: "Un ordre urgent est prêt, mais le sceau de l’intendance a disparu. Attendre retardera le convoi ; contourner la procédure exposera Iriana à une accusation de favoritisme.",
    resolution: "La solution retenue laisse une trace vérifiable. Iriana apprécie moins la rapidité que le fait de ne pas devoir choisir entre efficacité et légitimité.",
    relation: "iriana",
    approaches: ["lucidite", "sangfroid", "audace"],
  });
  add("algratal-avant-expedition", "marche", {
    id: "plus-connaissance-valurn",
    title: "Le vendeur qui connaît trop bien Valurn",
    speaker: "Valurn",
    intro: "Un vendeur salue Valurn par un titre qu’il n’a jamais utilisé devant le groupe. Puis il prétend s’être trompé de personne avec un empressement peu convaincant.",
    resolution: "Hylee obtient une réponse, mais pas forcément la vérité entière. Valurn comprend surtout qu’elle commence à reconnaître ses esquives favorites.",
    relation: "valurn",
    approaches: ["lucidite", "audace", "sangfroid"],
  });
  add("algratal-avant-expedition", "appartements", {
    id: "plus-bruit-palais-naiah",
    title: "Trop de murs pour Naïah",
    speaker: "Naïah",
    intro: "Naïah ouvre successivement la fenêtre, la porte puis de nouveau la fenêtre. Le palais est trop silencieux au loin et beaucoup trop bruyant de près.",
    resolution: "Hylee l’aide à trouver un endroit où les sons ont un sens. Naïah ne remercie pas directement, mais cesse enfin de chercher une sortie.",
    relation: "naiah",
    approaches: ["resonance", "sangfroid", "audace"],
  });
  add("algratal-avant-expedition", "toits", {
    id: "plus-message-sans-destinataire",
    title: "Le message sans destinataire",
    speaker: "Saidin",
    intro: "Saidin trouve sous une tuile un billet codé qui ne lui est pas destiné. Il pourrait le remettre aux gardes, le lire ou le replacer exactement où il était.",
    resolution: "Le billet continue — ou non — son voyage. Hylee découvre au passage que Saidin traite parfois la curiosité comme une responsabilité plutôt que comme un droit.",
    relation: "saidin",
    approaches: ["lucidite", "sangfroid", "audace"],
  });

  /* Chapitre IX · Geôles d’Akuhn’Nabad */
  add("geoles-apres-capture", "cellule", {
    id: "plus-froid-partage",
    title: "Le froid que Remerii ne peut pas chasser",
    speaker: "Remerii",
    intro: "La pierre aspire la chaleur et lancer un sort attirerait immédiatement les gardes. Remerii rapproche sa cape d’Hylee comme si ce geste n’avait rien d’une inquiétude.",
    resolution: "Elles trouvent une chaleur dérisoire mais suffisante. Dans la cellule, cette proximité devient une forme de résistance que les geôliers ne peuvent pas confisquer.",
    relation: "remerii",
    approaches: ["sangfroid", "resonance", "lucidite"],
  });
  add("geoles-apres-capture", "barreaux", {
    id: "plus-rythme-clefs",
    title: "Le rythme du trousseau de clefs",
    speaker: "Saidin",
    intro: "Chaque garde porte le même trousseau, mais aucun ne le fait sonner de la même façon. Saidin commence à reconnaître leurs rondes sans avoir besoin de les voir.",
    resolution: "Le bruit des clefs devient une horloge clandestine. Le groupe sait désormais quand parler, quand observer et quand feindre le sommeil.",
    relation: "saidin",
    approaches: ["lucidite", "sangfroid", "resonance"],
  });
  add("geoles-apres-capture", "couloir", {
    id: "plus-ration-tombee",
    title: "Une ration tombée hors de portée",
    speaker: "Naïah",
    intro: "Un garde laisse tomber une ration entre deux cellules et refuse de revenir sur ses pas. Naïah pourrait l’atteindre, mais seulement en révélant une partie de son agilité.",
    resolution: "Le groupe gagne peut-être un repas, peut-être une information sur l’attention des gardes. Dans les geôles, même un morceau de pain peut devenir une décision stratégique.",
    relation: "naiah",
    approaches: ["audace", "lucidite", "sangfroid"],
  });

  /* Chapitre X-I · Akuhn’Nabad, perspective Iriana */
  add("akuhn-iriana-apres-audience", "terrasse", {
    id: "plus-flamme-eteinte",
    title: "Une flamme verte qui refuse de reprendre",
    speaker: "Iriana",
    intro: "L’un des feux rituels de la terrasse s’éteint au passage d’Iriana. Un serviteur obscurci détourne les yeux, comme si le phénomène avait une signification qu’il ne pouvait pas commenter.",
    resolution: "Iriana obtient une explication partielle. À Akuhn’Nabad, même la lumière semble savoir à quelle lignée elle s’adresse.",
    relation: "amanea",
  });
  add("akuhn-iriana-apres-audience", "rues", {
    id: "plus-enfant-escorte",
    title: "L’enfant qui compte les gardes",
    speaker: "Narrateur",
    intro: "Un enfant obscurci suit l’escorte du regard et compte tout haut chacun des gardes. Il s’arrête sur Iriana, incapable de décider si elle est prisonnière ou invitée.",
    resolution: "La réponse d’Iriana circule plus vite que l’escorte. Pour quelques passants, elle devient ce qu’elle a choisi de paraître pendant cette seconde.",
    relation: "amanea",
  });
  add("akuhn-iriana-apres-audience", "archives", {
    id: "plus-page-sans-encre",
    title: "La page qui n’est vide que pour elle",
    speaker: "Iriana",
    intro: "Un registre paraît blanc sous les yeux d’Iriana, alors que le scribe obscurci affirme y lire plusieurs noms. L’enchantement distingue manifestement ses lecteurs.",
    resolution: "Iriana ne brise pas la protection, mais en comprend la règle. Le registre lui refuse ses mots tout en lui révélant ce qu’il cherche à protéger.",
    relation: "amanea",
  });
  add("akuhn-iriana-apres-audience", "appartements", {
    id: "plus-the-amanea",
    title: "Le thé choisi par Amanea",
    speaker: "Amanea",
    intro: "Un plateau arrive avec deux infusions : l’une appréciée par Iriana enfant, l’autre par l’adulte qu’Amanea suppose qu’elle est devenue. Aucun message n’accompagne le choix.",
    resolution: "La tasse retenue tient lieu de réponse. Entre les deux femmes, même une boisson peut devenir une question sur le temps perdu.",
    relation: "amanea",
  });

  /* Chapitre X-G · Retour à Al’Gratal */
  add("algratal-groupe-retour", "infirmerie", {
    id: "plus-main-pendant-soin",
    title: "Rester pendant que les soigneurs travaillent",
    speaker: "Soigneuse",
    intro: "Une soigneuse demande à Hylee d’empêcher Remerii de bouger pendant qu’elle referme une blessure. Remerii assure qu’elle n’a besoin d’aucune surveillance.",
    resolution: "Le soin s’achève sous une protestation de moins en moins convaincante. Hylee découvre que tenir une main peut être plus difficile que lancer un sort.",
    relation: "remerii",
    approaches: ["sangfroid", "audace", "resonance"],
  });
  add("algratal-groupe-retour", "cour", {
    id: "plus-oiseaux-naiah",
    title: "Les oiseaux qui refusent le palais",
    speaker: "Naïah",
    intro: "Des oiseaux se posent sur tous les toits sauf celui de la cour intérieure. Naïah remarque leur évitement et cherche ce que les enchantements du palais dissimulent aux animaux.",
    resolution: "La cause paraît bénigne, mais le détour des oiseaux offre à Naïah une nouvelle façon de lire l’architecture impériale.",
    relation: "naiah",
    approaches: ["resonance", "lucidite", "sangfroid"],
  });
  add("algratal-groupe-retour", "chambres", {
    id: "plus-voix-derriere-cloisons",
    title: "Le groupe derrière les cloisons",
    speaker: "Narrateur",
    intro: "À travers les murs, Hylee reconnaît une dispute étouffée, un rire de Valurn et les pas lourds de Draven. Personne n’est vraiment seul, même portes fermées.",
    resolution: "Elle choisit une porte à laquelle frapper — ou le silence de sa propre chambre. Ce choix discret détermine avec qui la nuit se termine réellement.",
    approaches: ["lucidite", "audace", "sangfroid"],
  });

  /* Chapitre XI-I · Coffret, perspective Iriana */
  add("akuhn-iriana-coffret", "piano", {
    id: "plus-note-faussée",
    title: "La seule note qui sonne faux",
    speaker: "Iriana",
    intro: "Toutes les touches répondent avec justesse sauf une, trop grave d’un demi-ton. Le défaut paraît volontaire et correspond à une mesure qu’Amanea jouait autrefois.",
    resolution: "La fausse note devient un repère. Iriana comprend que le piano ne conserve pas seulement une musique, mais peut-être une manière de retrouver ce qui a été caché.",
    relation: "amanea",
  });
  add("akuhn-iriana-coffret", "bureau", {
    id: "plus-deux-routes",
    title: "Deux routes tracées vers le même lieu",
    speaker: "Narrateur",
    intro: "Deux itinéraires mènent au même point sur la carte. L’un porte les annotations d’Amanea, l’autre celles d’une main inconnue qui semble avoir anticipé chacune de ses décisions.",
    resolution: "Iriana ne choisit pas encore une route. Elle relève surtout les endroits où les deux tracés cessent de raconter la même histoire.",
    relation: "amanea",
  });
  add("akuhn-iriana-coffret", "coffret", {
    id: "plus-objet-sans-nom",
    title: "L’objet sans étiquette",
    speaker: "Iriana",
    intro: "Au fond du coffret repose une petite pièce de métal sans inscription, la seule qu’Amanea n’ait pas expliquée. Sa forme évoque une clef dont il manquerait la serrure.",
    resolution: "L’objet reste muet, mais sa place exacte dans le coffret prouve qu’il comptait. Iriana en mémorise le poids avant de décider s’il doit être déplacé.",
    relation: "amanea",
  });

  /* Chapitre XI-G · Entracte du bal */
  add("bal-entracte-groupe", "alcove", {
    id: "plus-minute-sans-regard",
    title: "Une minute hors des regards",
    speaker: "Remerii",
    intro: "Dans l’alcôve, Remerii relâche enfin ses épaules. Elle demande à Hylee si sa tenue la gêne, mais son regard cherche manifestement une réponse à une autre question.",
    resolution: "La pause dure moins d’une minute. Elle suffit pourtant à rendre au bal sa vraie mesure : ce qu’elles choisissent de partager entre deux apparitions publiques.",
    relation: "remerii",
    approaches: ["lucidite", "audace", "sangfroid"],
  });
  add("bal-entracte-groupe", "balcon", {
    id: "plus-etiquette-naiah",
    title: "Naïah et l’art inutile de tenir un verre",
    speaker: "Naïah",
    intro: "Naïah observe trois nobles tenir leur verre de trois façons différentes et exige de savoir laquelle évitera qu’on lui parle. Hylee n’est pas certaine que cette variante existe.",
    resolution: "Elles inventent leur propre code. Il n’empêche personne d’approcher, mais leur donne au moins une raison de rire lorsqu’un noble se trompe complètement.",
    relation: "naiah",
    approaches: ["lucidite", "audace", "sangfroid"],
  });
  add("bal-entracte-groupe", "buffet", {
    id: "plus-epice-inconnue",
    title: "L’épice que Valurn prétend reconnaître",
    speaker: "Valurn",
    intro: "Valurn identifie avec assurance une épice rare, puis hésite juste avant de goûter le plat. Son sourire indique qu’il espère que personne n’a remarqué.",
    resolution: "Le mystère culinaire devient un duel de mauvaise foi. Hylee apprend surtout à distinguer l’assurance véritable de la performance favorite de Valurn.",
    relation: "valurn",
    approaches: ["lucidite", "audace", "sangfroid"],
  });

  /* Chapitre XII-I · Après le souvenir, perspective Iriana */
  add("akuhn-apres-souvenir", "sol", {
    id: "plus-trace-poussiere",
    title: "Une empreinte dans la poussière du coffret",
    speaker: "Iriana",
    intro: "Sous le coffret, la poussière dessine l’empreinte d’un objet plus large qui occupait autrefois cette place. Quelqu’un a retiré une partie du souvenir avant son arrivée.",
    resolution: "L’absence acquiert une forme précise. Iriana ne sait pas encore ce qui manque, mais elle sait désormais quelle question poser sans révéler ce qu’elle a vu.",
    relation: "amanea",
  });
  add("akuhn-apres-souvenir", "fenetre", {
    id: "plus-reflet-amanea",
    title: "Un reflet qui arrive une seconde trop tard",
    speaker: "Narrateur",
    intro: "Dans la vitre, le reflet d’Iriana reproduit son mouvement avec un imperceptible retard. Pendant une seconde, la silhouette porte la cape d’Amanea plutôt que ses vêtements.",
    resolution: "Le reflet redevient normal. Iriana doit décider si elle vient de voir une trace magique, un avertissement ou la fatigue donner un visage à ce qu’elle redoute.",
    relation: "amanea",
  });

  /* Chapitre XII-G · Entre les duels */
  add("bal-entre-duels", "piste", {
    id: "plus-main-apres-danse",
    title: "La main de Remerii après la danse",
    speaker: "Hylee",
    intro: "Lorsque la musique s’interrompt, les doigts de Remerii restent une seconde de trop autour de ceux d’Hylee. Elle les retire avant que le geste puisse être commenté.",
    resolution: "Rien n’est dit devant la cour. Le choix d’Hylee transforme pourtant cette seconde en maladresse oubliée, en promesse discrète ou en question laissée ouverte.",
    relation: "remerii",
    approaches: ["resonance", "audace", "sangfroid"],
  });
  add("bal-entre-duels", "balcon", {
    id: "plus-paris-duel",
    title: "Les paris que Naïah entend depuis le balcon",
    speaker: "Naïah",
    intro: "Des invités parient sur le prochain duel en réduisant chaque combattante à son peuple, sa tenue ou sa réputation. Naïah comprend assez de mots pour savoir qu’elle est l’un des sujets.",
    resolution: "Hylee et Naïah choisissent si ces paris méritent une réponse. Leur complicité se construit aussi dans la manière de refuser le rôle écrit par les spectateurs.",
    relation: "naiah",
    approaches: ["audace", "sangfroid", "lucidite"],
  });
  add("bal-entre-duels", "couloir", {
    id: "plus-medaille-draven",
    title: "La décoration que Draven a retournée",
    speaker: "Draven",
    intro: "Draven porte une décoration de Forthaven tournée contre sa veste, symbole invisible face au tissu. Il prétend l’avoir fixée ainsi par erreur.",
    resolution: "La médaille n’est pas remise à l’endroit sans raison. Hylee comprend qu’au milieu du faste impérial, Draven refuse peut-être d’exhiber une victoire payée par trop d’absents.",
    relation: "draven",
    approaches: ["lucidite", "sangfroid", "audace"],
  });

  /* Chapitre XIII-I · Avant le retour, perspective Iriana */
  add("akuhn-avant-retour-iriana", "salon-musique", {
    id: "plus-melodie-reprise",
    title: "La mélodie qui recommence seule",
    speaker: "Iriana",
    intro: "Après qu’Iriana s’éloigne du piano, trois notes se rejouent sans qu’aucune touche ne bouge. Elles appartiennent à la chanson d’Amanea, mais pas à son refrain.",
    resolution: "Iriana mémorise la mesure. La musique semble moins chercher à la retenir qu’à lui confier quelque chose avant son départ.",
    relation: "amanea",
  });
  add("akuhn-avant-retour-iriana", "antichambre", {
    id: "plus-destination-officielle",
    title: "La destination qu’il faut inscrire",
    speaker: "Intendant obscurci",
    intro: "Le registre du portail exige une destination officielle. Écrire Al’Gratal est exact ; écrire le palais révèle davantage que ce qu’Iriana souhaite laisser aux archives d’Akuhn’Nabad.",
    resolution: "La formule choisie respecte la vérité sans forcément offrir tout son itinéraire. La diplomatie se joue parfois dans l’espace laissé entre deux noms.",
    relation: "amanea",
  });
  add("akuhn-avant-retour-iriana", "terrasse", {
    id: "plus-phrase-a-amanea",
    title: "La phrase qu’Iriana pourrait encore laisser",
    speaker: "Narrateur",
    intro: "Avant de rejoindre le portail, Iriana dispose d’un messager fiable et de quelques lignes. Elle peut écrire à Amanea — à condition d’accepter que l’absence de message soit elle aussi une réponse.",
    resolution: "Les mots sont envoyés, modifiés ou gardés. Dans chaque cas, Iriana choisit ce qu’Amanea emportera de leur rencontre après son départ.",
    relation: "amanea",
  });

  /* Chapitre XIII-G · Matin après le bal */
  add("algratal-matin-apres-bal", "chambres", {
    id: "plus-rumeurs-couloir",
    title: "Les rumeurs déjà levées",
    speaker: "Remerii",
    intro: "Deux serviteurs ralentissent devant la porte en évoquant les danses de la veille. Remerii assure ne pas se soucier des rumeurs tout en écoutant beaucoup trop attentivement.",
    resolution: "Hylee décide si elle dédramatise, provoque ou protège ce moment. Les rumeurs restent dehors ; ce qu’elles en pensent demeure entre elles.",
    relation: "remerii",
    approaches: ["sangfroid", "audace", "lucidite"],
  });
  add("algratal-matin-apres-bal", "galerie", {
    id: "plus-portrait-victoire",
    title: "Un portrait de victoire qui irrite Draven",
    speaker: "Draven",
    intro: "Une fresque représente une bataille impériale sans blessés, sans boue et presque sans ennemis. Draven s’arrête devant avec le mépris réservé aux mensonges très coûteux.",
    resolution: "La discussion ne change pas la fresque. Elle révèle toutefois ce que Draven refuse de laisser devenir beau lorsqu’il parle de guerre.",
    relation: "draven",
    approaches: ["lucidite", "audace", "sangfroid"],
  });
  add("algratal-matin-apres-bal", "cuisine", {
    id: "plus-dejeuner-naiah",
    title: "Le petit-déjeuner selon Naïah",
    speaker: "Naïah",
    intro: "Naïah a assemblé dans la même assiette des fruits, une viande froide et une pâtisserie impériale. Un cuisinier regarde cette combinaison comme une déclaration de guerre.",
    resolution: "Le repas échappe au protocole et devient un moment de partage. Naïah découvre que certaines règles de cour peuvent être vaincues simplement en continuant de manger.",
    relation: "naiah",
    approaches: ["audace", "sangfroid", "lucidite"],
  });

  /* Chapitre XIV · Après le conseil */
  add("algratal-apres-conseil", "caserne", {
    id: "plus-ordre-mal-compris",
    title: "L’ordre que chacun a compris autrement",
    speaker: "Draven",
    intro: "Trois chefs d’escouade ont interprété la même consigne de trois manières différentes. Les corriger brutalement gagnerait du temps aujourd’hui et en ferait perdre demain.",
    resolution: "L’ordre est reformulé depuis le terrain plutôt que depuis la table du conseil. Draven retient surtout ceux qui ont osé signaler l’ambiguïté avant qu’elle coûte des vies.",
    relation: "draven",
    approaches: ["lucidite", "audace", "sangfroid"],
  });
  add("algratal-apres-conseil", "infirmerie", {
    id: "plus-blesse-debout",
    title: "Le blessé qui veut retourner à son poste",
    speaker: "Soigneur",
    intro: "Un soldat à peine bandé tente de rejoindre sa section, persuadé que se reposer revient à abandonner les autres. Les soigneurs ont besoin d’aide pour le convaincre sans l’humilier.",
    resolution: "Le soldat reste à l’infirmerie avec une tâche utile à accomplir. Hylee découvre qu’empêcher quelqu’un de se briser peut exiger autant de fermeté que l’envoyer combattre.",
    approaches: ["sangfroid", "lucidite", "audace"],
  });
  add("algratal-apres-conseil", "balcon", {
    id: "plus-ville-se-prepare",
    title: "La ville qui comprend avant les annonces",
    speaker: "Remerii",
    intro: "Depuis le balcon, Hylee et Remerii voient les marchés fermer plus tôt et les patrouilles doubler. Al’Gratal sait déjà qu’une crise approche, même si le palais n’a encore rien déclaré.",
    resolution: "Elles parlent moins du plan que de ceux qui vivront sous ses conséquences. Le conseil impérial retrouve soudain des fenêtres, des rues et des visages.",
    relation: "remerii",
    approaches: ["lucidite", "resonance", "sangfroid"],
  });
  add("algratal-apres-conseil", "archives", {
    id: "plus-annotation-arrachee",
    title: "L’annotation arrachée du registre",
    speaker: "Iriana",
    intro: "Une page du registre militaire porte la trace nette d’une annotation retirée récemment. Le texte principal reste intact, mais quelqu’un a voulu supprimer la manière dont il devait être interprété.",
    resolution: "La copie discrète des traces de plume ne reconstitue pas encore les mots. Elle suffit cependant à prouver que le document officiel a été volontairement nettoyé.",
    relation: "iriana",
    approaches: ["lucidite", "sangfroid", "audace"],
  });

  window.SylviniaStoryMoments = moments;
})();
