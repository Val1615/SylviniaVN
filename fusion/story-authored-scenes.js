(function registerSylviniaAuthoredStoryScenes() {
  "use strict";

  if (window.SylviniaAuthoredStoryScenes) return;

  const scenes = {};

  function beat(speaker, text) {
    return { speaker, text };
  }

  function add(id, opening, branches, ending) {
    if (scenes[id]) throw new Error(`Scène de temps libre déclarée deux fois : ${id}`);
    scenes[id] = {
      opening: (opening || []).map(function map(entry) { return beat(entry[0], entry[1]); }),
      branches: Object.fromEntries(Object.entries(branches || {}).map(function map(entry) {
        return [entry[0], (entry[1] || []).map(function mapBeat(item) { return beat(item[0], item[1]); })];
      })),
      ending: (ending || []).map(function map(entry) { return beat(entry[0], entry[1]); }),
    };
  }

  /* Les scènes sont regroupées par séquences canoniques.
     Chaque branche possède ses propres gestes, interruptions et conséquences.
     Aucun dialogue passe-partout n’est ajouté par le moteur. */

  window.SylviniaAuthoredStoryScenes = { version: 1, scenes, add };
})();

(function registerMirAldasScenes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("miraldas-apres-saidin:dome:premiers-reperes", [
    ["Narrateur", "Pour la première fois depuis leur arrivée, personne ne conduit Hylee vers une audience. Elle peut enfin s'arrêter au milieu de la place."],
    ["Hylee", "Je crois que cette flèche indique un atelier."],
    ["Remerii", "Elle indique que l'atelier accepte les visiteurs. La flèche seule signifie généralement : entrez si vous aimez être expulsée."],
    ["Hylee", "C'est accueillant, une fois qu'on connaît la menace."],
    ["Narrateur", "Un apprenti manque de la heurter, s'excuse et reprend sa course sans s'étonner de voir une humaine sous le Dôme."],
  ], {
    lucidite: [
      ["Hylee", "Les symboles sur les portes changent selon l'heure, c'est ça ?"],
      ["Remerii", "Selon l'heure, le risque et l'humeur du propriétaire. Le troisième critère est le moins réglementé."],
      ["Narrateur", "Hylee note les signes stables et cesse de suivre ceux qui clignotent avec trop d'enthousiasme."],
    ],
    resonance: [
      ["Hylee", "Les passages ouverts vibrent plus doucement. Je peux les sentir avant de lire le symbole."],
      ["Remerii", "Utilise tes yeux aussi. Mir'Aldas adore récompenser une intuition juste par un accident très instructif."],
      ["Narrateur", "Hylee compare son ressenti aux marques et corrige deux erreurs avant de les transformer en certitudes."],
    ],
    sangfroid: [
      ["Narrateur", "Hylee se place près d'une fontaine et regarde les habitants circuler."],
      ["Hylee", "Les apprentis attendent que la bordure devienne bleue. Et personne ne coupe devant les porteurs de cristaux."],
      ["Remerii", "Dix minutes ici et tu respectes déjà mieux les usages que certains Archimages."],
    ],
  }, [
    ["Narrateur", "Au bout d'un moment, la place cesse de lui paraître codée. Elle devient une ville avec ses raccourcis, ses impatients et ses portes à éviter."],
    ["Hylee", "Je peux choisir où aller maintenant ?"],
    ["Remerii", "Oui. Je me réserve seulement le droit de sauver tes sourcils."],
  ]);

  add("miraldas-apres-saidin:dome:plus-cristal-curieux", [
    ["Narrateur", "Le cristal suspendu au-dessus d'une arcade passe du bleu au rose lorsque Hylee s'approche."],
    ["Hylee", "Tu as vu ?"],
    ["Premier apprenti", "Il était bleu depuis six mois."],
    ["Second apprenti", "Repasse dessous."],
    ["Hylee", "J'ignorais avoir accepté une expérience."],
    ["Premier apprenti", "Nous non plus. C'est ce qui la rend intéressante."],
  ], {
    resonance: [
      ["Narrateur", "Hylee lève la paume et effleure la trame sans toucher le cristal. La lumière descend vers ses doigts."],
      ["Hylee", "Il cherche la source de froid dans ma magie."],
      ["Second apprenti", "Ou il te trouve jolie. Nos instruments manquent parfois de sérieux."],
    ],
    lucidite: [
      ["Hylee", "Est-ce qu'il réagit à tout le monde ou seulement depuis l'épreuve ?"],
      ["Premier apprenti", "Seulement à toi. Attends, cette phrase sonne beaucoup plus inquiétante à voix haute."],
      ["Narrateur", "Ils comparent l'heure, la température et les enchantements actifs avant de retenir l'hypothèse la plus simple."],
    ],
    audace: [
      ["Hylee", "Très bien. Puisqu'il veut jouer..."],
      ["Narrateur", "Elle traverse trois fois l'arcade, de plus en plus vite. Le cristal passe du rose au violet, puis éclate d'une lumière blanche."],
      ["Remerii", "L'expérience est terminée avant que tu ne lui apprennes à applaudir."],
    ],
  }, [
    ["Narrateur", "Le cristal retrouve son bleu dès qu'Hylee s'éloigne, puis produit une dernière lueur rose dans son dos."],
    ["Hylee", "Il l'a refait exprès."],
    ["Remerii", "Félicitations. Tu viens d'être adoptée par un luminaire."],
  ]);

  add("miraldas-apres-saidin:bibliotheque:question-saidin", [
    ["Narrateur", "Saidin feuillette un ouvrage relié de cuir pâle. Hylee attend qu'il lève les yeux. Il tourne encore deux pages."],
    ["Saidin", "La question ne deviendra pas plus facile si tu la polis davantage."],
    ["Hylee", "Tu savais que j'allais venir ?"],
    ["Saidin", "Tu viens de le faire. Je dispose donc d'une certitude remarquable."],
    ["Hylee", "Très drôle. Je voulais parler de l'épreuve."],
  ], {
    lucidite: [
      ["Hylee", "Qu'est-ce que tu cherchais vraiment quand tu nous as mises à l'épreuve ?"],
      ["Saidin", "La chose que vous protégeriez lorsque réussir et protéger cesseraient d'être le même choix."],
      ["Hylee", "Et tu l'as trouvée ?"],
      ["Saidin", "J'ai trouvé une réponse. La prochaine épreuve dira si elle vous appartenait."],
    ],
    audace: [
      ["Hylee", "Tu connaissais l'issue avant de commencer ?"],
      ["Saidin", "J'en connaissais plusieurs. Celle que tu as choisie était la seule que je ne pouvais pas choisir à ta place."],
      ["Hylee", "C'est une manière très élégante de dire non."],
      ["Saidin", "Alors tu progresses aussi en rhétorique."],
    ],
    resonance: [
      ["Hylee", "Pourquoi la magie a-t-elle réagi avant que je décide ?"],
      ["Saidin", "Parce que ton corps avait déjà reconnu ce que ton esprit discutait encore."],
      ["Hylee", "Donc la magie savait ?"],
      ["Saidin", "Elle a ressenti. Ne lui offre pas trop vite le privilège de savoir."],
    ],
  }, [
    ["Narrateur", "Saidin referme enfin le livre. Son index reste entre les pages."],
    ["Saidin", "Tu voulais une réponse complète. Tu repars avec la question exacte. Elle te sera plus utile."],
    ["Hylee", "Un jour, je réussirai à te faire répondre normalement."],
    ["Saidin", "Ce jour-là, l'une de nous deux devra s'inquiéter."],
  ]);

  add("miraldas-apres-saidin:bibliotheque:plus-livre-retourne", [
    ["Narrateur", "Saidin range un petit traité sans titre. À peine s'est-il retourné que le livre réapparaît devant Hylee."],
    ["Hylee", "Il vient de bouger."],
    ["Saidin", "Il refuse son rayon depuis longtemps. Nous avons cessé de nous disputer en public."],
    ["Narrateur", "Il le remet à sa place. Le livre revient avec un claquement vexé."],
    ["Hylee", "Je crois qu'il a gagné."],
  ], {
    lucidite: [
      ["Hylee", "Il revient toujours sur cette table ou seulement quand je suis là ?"],
      ["Saidin", "Excellente distinction."],
      ["Narrateur", "Hylee change de table. Le traité la rejoint au troisième pas."],
    ],
    resonance: [
      ["Narrateur", "Hylee pose deux doigts sur la couverture. Une impatience étrangère lui remonte le bras."],
      ["Hylee", "Il veut être ouvert à une page précise."],
      ["Saidin", "Alors évitons de contrarier davantage un livre qui sait marcher."],
    ],
    sangfroid: [
      ["Hylee", "Je ne l'ouvre pas avant de savoir ce qu'il contient."],
      ["Saidin", "Une prudence sensée. Le livre, lui, trouve cette qualité exaspérante."],
      ["Narrateur", "Les pages frémissent, puis s'immobilisent sous sa main."],
    ],
  }, [
    ["Narrateur", "Le traité s'ouvre sur une annotation ancienne : Pour celle qui entendra le givre avant de savoir le nommer."],
    ["Hylee", "C'était écrit pour Remerii ?"],
    ["Saidin", "C'était écrit avant que la bonne lectrice n'arrive."],
    ["Narrateur", "Cette fois, il laisse le livre sur la table."],
  ]);

  add("miraldas-apres-saidin:bibliotheque:confidence-saidin-remerii-enfant", [
    ["Narrateur", "Une marge du traité porte un minuscule dessin de dragon coiffé d'un chapeau ridicule."],
    ["Hylee", "C'est toi qui as dessiné ça ?"],
    ["Saidin", "J'ai commis des erreurs plus graves, rarement avec autant de couleurs."],
    ["Hylee", "Remerii ?"],
    ["Saidin", "Elle avait neuf ans et une opinion définitive sur mes couvre-chefs."],
  ], {
    lucidite: [
      ["Hylee", "Elle était déjà aussi douée ?"],
      ["Saidin", "Oui. Elle était aussi bruyante, impatiente et couverte d'encre la moitié du temps. Les gens ont préféré retenir le talent."],
      ["Hylee", "Elle ne raconte jamais la partie couverte d'encre."],
    ],
    audace: [
      ["Hylee", "Tu étais son maître ou son père ?"],
      ["Narrateur", "Le sourire de Saidin se calme. Il tourne le traité pour regarder le dessin à l'endroit."],
      ["Saidin", "J'ai souvent choisi le premier mot parce qu'il exigeait moins de courage."],
    ],
    sangfroid: [
      ["Hylee", "Raconte-moi seulement un bon souvenir."],
      ["Saidin", "Elle a gelé toutes les serrures de cette aile pour prouver qu'un règlement était mal rédigé."],
      ["Hylee", "Ça a fonctionné ?"],
      ["Saidin", "Le règlement fut corrigé. Les serrures, beaucoup plus tard."],
    ],
  }, [
    ["Narrateur", "Hylee suit du doigt le chapeau du dragon sans toucher l'encre."],
    ["Saidin", "Avant que Mir'Aldas ne voie une prodige, il y avait une enfant qui posait ses bottes pleines de boue sur mes livres."],
    ["Hylee", "Je garderai celle-là."],
    ["Saidin", "Elle prétendra que j'exagère. Tu sauras alors qu'elle s'en souvient."],
  ]);

  add("miraldas-apres-saidin:atelier:ajuster-baton", [
    ["Narrateur", "Le bâton de cerisier noir bourdonne entre les mains d'Hylee. Une étincelle saute chaque fois qu'elle respire trop fort."],
    ["Hylee", "Il n'était pas aussi susceptible hier."],
    ["Remerii", "Hier, il ne se trouvait pas sous le Dôme avec une propriétaire surexcitée."],
    ["Hylee", "Je suis concentrée."],
    ["Narrateur", "Une seconde étincelle brûle le coin d'un chiffon."],
    ["Remerii", "Avec une intensité remarquable."],
  ], {
    lucidite: [
      ["Hylee", "Le cristal central répond avant les bagues. Le décalage vient de là."],
      ["Remerii", "Desserre la deuxième bague d'un quart de tour. Un quart, pas ton estimation enthousiaste d'un quart."],
      ["Narrateur", "Le bourdonnement descend jusqu'à devenir régulier."],
    ],
    resonance: [
      ["Hylee", "Je vais ralentir mon flux jusqu'à trouver sa vibration."],
      ["Remerii", "Je maintiens la matrice. Si tu sens qu'elle tire, tu lâches."],
      ["Narrateur", "Le bois se réchauffe, puis accepte le rythme d'Hylee sans projeter d'étincelle."],
    ],
    sangfroid: [
      ["Hylee", "On coupe tout et on reprend depuis le montage."],
      ["Remerii", "Tu viens de renoncer à gagner du temps. Saidin sera insupportablement fier."],
      ["Hylee", "Ne lui dis pas. J'ai une réputation à construire."],
    ],
  }, [
    ["Narrateur", "Hylee lève le bâton. Le cerisier noir répond par une lueur nette qui ne déborde pas sur ses doigts."],
    ["Remerii", "Il n'est pas plus puissant. Il a simplement cessé de transformer chacune de tes émotions en annonce publique."],
    ["Hylee", "Je me sens jugée par mon propre bâton."],
  ]);

  add("miraldas-apres-saidin:atelier:plus-outil-remerii", [
    ["Narrateur", "Remerii saisit un focaliseur et règle les trois anneaux d'un seul geste. Saidin relève les yeux depuis l'autre bout de l'atelier."],
    ["Saidin", "Tu places encore l'anneau d'orage en premier."],
    ["Remerii", "Cette méthode fonctionne."],
    ["Saidin", "Je n'ai pas dit le contraire."],
    ["Narrateur", "Remerii repose l'outil un peu trop soigneusement."],
  ], {
    lucidite: [
      ["Hylee", "Pourquoi cet ordre ?"],
      ["Remerii", "Parce que je travaillais autrefois avec des flux plus rapides. Mon corps s'en souvient, même lorsque ce n'est plus utile."],
      ["Narrateur", "Elle reprend le réglage selon la méthode actuelle, sans effacer le premier geste."],
    ],
    sangfroid: [
      ["Hylee", "Tu veux que je termine ?"],
      ["Remerii", "Non. Reste simplement là pendant que mes mains cessent de vivre deux ans en arrière."],
      ["Narrateur", "Hylee attend. Saidin retourne à son ouvrage."],
    ],
    resonance: [
      ["Hylee", "Le focaliseur réagit encore à ton ancien réglage."],
      ["Remerii", "Les objets ont l'indécence de conserver des habitudes que leurs propriétaires ont dû perdre."],
      ["Hylee", "On peut lui en apprendre une autre."],
    ],
  }, [
    ["Narrateur", "Les anneaux finissent par s'aligner sous les doigts de Remerii."],
    ["Remerii", "Tu peux poser la question, un jour. Aujourd'hui, je préfère te montrer comment on calibre celui-ci."],
    ["Hylee", "Marché conclu."],
  ]);

  add("miraldas-apres-saidin:residence:remettre-clefs", [
    ["Narrateur", "La clé tourne sans résistance. Aucune poussière ne tombe lorsque Remerii ouvre la porte."],
    ["Hylee", "Quelqu'un entretient la chambre."],
    ["Remerii", "Mir'Aldas conserve les logements de certains anciens élèves."],
    ["Hylee", "Tous les anciens élèves ont des draps propres et du thé récent ?"],
    ["Remerii", "Tu deviens pénible avec une efficacité remarquable."],
  ], {
    lucidite: [
      ["Hylee", "Tu savais que la clé fonctionnerait."],
      ["Remerii", "Je savais que Saidin ne laisserait pas la serrure être changée. Le reste relève de son goût théâtral."],
      ["Narrateur", "Une tasse ébréchée attend encore sur l'étagère, exactement à sa place."],
    ],
    sangfroid: [
      ["Hylee", "Je peux prendre l'autre chambre si tu préfères rester seule ici."],
      ["Remerii", "Reste. Si les souvenirs deviennent envahissants, nous leur imposerons des règles de cohabitation."],
      ["Narrateur", "Elle ouvre les volets et laisse entrer les lumières de la ville."],
    ],
    audace: [
      ["Hylee", "Alors montre-moi la Remerii qui vivait ici."],
      ["Remerii", "La formulation est dangereusement vaste."],
      ["Hylee", "Commence par la cachette à biscuits."],
      ["Narrateur", "Remerii regarde aussitôt vers une latte du plancher et se trahit."],
    ],
  }, [
    ["Narrateur", "Elles posent leurs sacs dans une chambre qui accueille Remerii sans lui demander d'expliquer son absence."],
    ["Remerii", "Tu peux utiliser le bureau. Évite seulement le tiroir du bas."],
    ["Hylee", "Les biscuits ?"],
    ["Remerii", "Une correspondance privée. Les biscuits sont derrière la troisième latte."],
  ]);

  add("miraldas-apres-saidin:residence:plus-voisine-reconnait", [
    ["Voisine", "Remerii ?"],
    ["Narrateur", "Une mage âgée s'immobilise dans le couloir, une corbeille de linge contre la hanche."],
    ["Remerii", "Maîtresse Deliane."],
    ["Deliane", "Tu es revenue et personne n'a pensé à me prévenir."],
    ["Remerii", "J'espérais précisément profiter de cette négligence."],
    ["Narrateur", "Deliane l'étreint avant qu'elle puisse reculer, puis se tourne vers Hylee avec un sourire ravi."],
  ], {
    sangfroid: [
      ["Hylee", "Je m'appelle Hylee. Je peux repasser si vous avez besoin d'un moment."],
      ["Remerii", "Tu restes. Elle raconterait des horreurs dès que tu aurais le dos tourné."],
      ["Deliane", "Je peux parfaitement les raconter devant toi."],
    ],
    lucidite: [
      ["Hylee", "Vous la connaissiez quand elle étudiait ici ?"],
      ["Deliane", "Je l'ai surtout connue quand elle prétendait ne jamais avoir faim et vidait mes réserves de miel."],
      ["Remerii", "Cette source manque gravement d'impartialité."],
    ],
    audace: [
      ["Hylee", "J'accepte toute anecdote embarrassante. Je paie comptant."],
      ["Deliane", "Elle chantait pour mémoriser ses formules."],
      ["Remerii", "Hylee, si tu tiens à cette chambre, tu vas interrompre cette négociation."],
    ],
  }, [
    ["Narrateur", "Deliane repart après avoir imposé un dîner pour le lendemain, avec ou sans l'accord de Remerii."],
    ["Hylee", "Tu chantais ?"],
    ["Remerii", "Je vais t'enseigner un sort d'oubli."],
    ["Hylee", "Tu ne connais pas ma chanson préférée."],
  ]);

  add("miraldas-apres-saidin:residence:confidence-remerii-prodige", [
    ["Narrateur", "Dans le tiroir du bureau, Hylee trouve une invitation adressée à Remerii alors âgée de onze ans. Le texte lui demande une démonstration devant le Conseil."],
    ["Hylee", "Onze ans ? Ils t'ont vraiment fait présenter tes travaux devant tous ces mages ?"],
    ["Remerii", "Ils étaient très fiers. Moi aussi, au début."],
    ["Narrateur", "Elle reprend la lettre, mais ne la range pas."],
    ["Remerii", "Après quelques démonstrations, les invitations ont cessé de mentionner les repas, les jeux ou les autres enfants."],
  ], {
    lucidite: [
      ["Hylee", "Ils ne t'invitaient plus, ils invitaient ce que tu savais faire."],
      ["Narrateur", "Remerii plie la lettre sur une ancienne marque."],
      ["Remerii", "Voilà. Une phrase nette, et terriblement difficile à contredire."],
    ],
    audace: [
      ["Hylee", "Et Saidin a laissé faire ?"],
      ["Remerii", "Il a essayé d'être mon rempart. Je lui en ai voulu chaque fois qu'il réussissait, parce que je voulais encore impressionner les gens derrière lui."],
      ["Hylee", "Tu étais une enfant."],
      ["Remerii", "Je sais. J'ai mis longtemps à m'accorder cette circonstance atténuante."],
    ],
    sangfroid: [
      ["Hylee", "Tu n'es pas obligée de finir ce soir."],
      ["Remerii", "Je peux finir cette partie."],
      ["Narrateur", "Elle s'assoit au bord du bureau et garde le silence jusqu'à ce que sa voix redevienne stable."],
      ["Remerii", "Le plus dur fut de découvrir que je ne savais plus qui m'aimait lorsque je ne réussissais rien."],
    ],
  }, [
    ["Hylee", "Moi, je t'aime bien quand tu rates quelque chose."],
    ["Remerii", "Quelle déclaration bouleversante."],
    ["Hylee", "Tu deviens furieuse, tu pinces les lèvres et tu recommences jusqu'à gagner. C'est très toi."],
    ["Narrateur", "Remerii tente de répondre avec dignité. Un rire bref la trahit avant les mots."],
  ]);

  add("miraldas-matin-libre:patisserie:petit-dejeuner", [
    ["Narrateur", "Hylee pose deux pièces sur le comptoir avant que Remerii puisse commander."],
    ["Remerii", "Que fais-tu ?"],
    ["Hylee", "Je paie le petit déjeuner."],
    ["Remerii", "Tu annonces cela avec le ton d'une personne qui prépare une rébellion fiscale."],
    ["Hylee", "Laisse-moi savourer mon indépendance."],
  ], {
    audace: [
      ["Hylee", "Et je choisis pour toi. La tartelette aux poires."],
      ["Remerii", "Tu abuses déjà de ton nouveau pouvoir."],
      ["Narrateur", "Elle mord pourtant dans la tartelette avant même de retirer ses gants."],
    ],
    lucidite: [
      ["Hylee", "Tu m'as offert celle qui me faisait envie hier. La poire, c'est celle que tu regardes depuis que nous sommes entrées."],
      ["Remerii", "Je comparais la cuisson."],
      ["Hylee", "Bien sûr."],
      ["Narrateur", "La pâtissière cache un sourire en servant la poire."],
    ],
    sangfroid: [
      ["Hylee", "On peut aussi partager. Je n'essaie pas de tenir un compte."],
      ["Remerii", "Heureusement. Tes calculs comporteraient beaucoup trop de tartelettes."],
      ["Narrateur", "Elle pousse l'assiette entre elles et coupe la pâtisserie en deux parts inégales."],
    ],
  }, [
    ["Narrateur", "Le repas disparaît au milieu d'une discussion sur la route et d'un débat beaucoup trop sérieux concernant la meilleure pâte."],
    ["Hylee", "Je paierai encore la prochaine fois."],
    ["Remerii", "Nous verrons. Ta fortune vient de perdre deux pièces et toute mesure."],
  ]);

  add("miraldas-matin-libre:patisserie:plus-derniere-tartelette", [
    ["Pâtissière", "Il n'en reste qu'une."],
    ["Narrateur", "La dernière tartelette aux pommes repose au centre du plateau. Hylee et Remerii la regardent en même temps."],
    ["Hylee", "Je te la laisse."],
    ["Remerii", "Cette générosité immédiate est suspecte."],
    ["Hylee", "J'ai peut-être déjà commandé autre chose."],
  ], {
    audace: [
      ["Narrateur", "Hylee attrape la tartelette et mord dedans avant que Remerii ne réagisse."],
      ["Hylee", "Trop tard."],
      ["Remerii", "Je viens donc de former une voleuse de pâtisseries."],
      ["Narrateur", "Hylee lui tend la moitié restante."],
    ],
    lucidite: [
      ["Hylee", "On la coupe. Tu prendras le côté avec le plus de pommes, puisque tu vas le mesurer de toute façon."],
      ["Remerii", "Je comptais seulement vérifier l'équité de la découpe."],
      ["Pâtissière", "Je peux apporter une règle."],
    ],
    sangfroid: [
      ["Hylee", "Prends-la. J'ai envie de goûter celle au miel."],
      ["Remerii", "Tu n'es pas en train de te sacrifier ?"],
      ["Hylee", "Pour une tartelette ? J'ai des ambitions héroïques plus raisonnables."],
    ],
  }, [
    ["Narrateur", "La dernière tartelette finit partagée, officiellement ou par une succession de bouchées volées."],
    ["Remerii", "Je refuse que cette scène soit racontée comme une victoire."],
    ["Hylee", "Alors je parlerai d'une reddition délicieuse."],
  ]);

  add("miraldas-matin-libre:patisserie:confidence-remerii-ordinaire", [
    ["Narrateur", "La boutique se vide. Remerii essuie une miette du bout de son gant et regarde la rue s'éveiller."],
    ["Remerii", "Je ne me souvenais pas que Mir'Aldas pouvait être aussi calme."],
    ["Hylee", "Tu venais ici avant ?"],
    ["Remerii", "Souvent. Je mangeais vite, puis je repartais avant que quelqu'un ne me demande une démonstration."],
    ["Hylee", "Aujourd'hui, personne ne t'a demandé de sauver la magie."],
  ], {
    lucidite: [
      ["Hylee", "Ça te manque, d'être ici sans objectif ?"],
      ["Remerii", "Je n'ai jamais appris à le faire. Même mes promenades possédaient un programme."],
      ["Hylee", "On peut commencer par rester jusqu'à ce que le thé refroidisse."],
    ],
    audace: [
      ["Hylee", "Alors on reviendra. Et la prochaine fois, tu n'apportes aucun livre."],
      ["Remerii", "Tu imposes beaucoup de conditions à une invitation."],
      ["Hylee", "Oui. J'ai étudié auprès d'une experte."],
      ["Narrateur", "Remerii lève sa tasse pour cacher son sourire."],
    ],
    sangfroid: [
      ["Hylee", "On n'a pas besoin d'en faire une promesse. C'est juste un bon matin."],
      ["Remerii", "Merci."],
      ["Narrateur", "Le mot sort sans ornement. Remerii le laisse exister et reprend une gorgée."],
    ],
  }, [
    ["Narrateur", "Elles restent assez longtemps pour voir la pâtissière retourner l'enseigne de la boutique."],
    ["Remerii", "Je crois que nous venons de perdre du temps."],
    ["Hylee", "C'était bien ?"],
    ["Remerii", "Terriblement. Il faudra vérifier si l'effet se reproduit."],
  ]);

  add("miraldas-matin-libre:terrasse:apres-proximite", [
    ["Narrateur", "Hylee retrouve la terrasse encore humide de rosée. La nuit précédente lui revient par gestes isolés, une main gardée trop longtemps, une phrase arrêtée avant sa fin."],
    ["Hylee", "Tout paraissait plus facile dans le noir."],
    ["Narrateur", "Elle s'assoit sur le rebord bas et laisse ses pieds battre doucement la pierre."],
    ["Hylee", "Plus facile, mais pas moins vrai."],
  ], {
    sangfroid: [
      ["Narrateur", "Hylee reprend chaque souvenir sans lui ajouter la suite qu'elle espère."],
      ["Hylee", "Je peux attendre qu'on en parle ensemble. Je n'ai pas besoin de décider pour nous deux."],
      ["Narrateur", "Cette pensée calme enfin l'agitation qui l'a suivie jusqu'ici."],
    ],
    lucidite: [
      ["Hylee", "Remerii a reculé quand elle a eu peur, puis elle est revenue. C'est ça que je dois retenir."],
      ["Narrateur", "Elle distingue la tendresse de ses propres attentes et refuse de les confondre."],
      ["Hylee", "Pour une fois, je peux ne pas courir devant."],
    ],
    resonance: [
      ["Narrateur", "La trame garde une chaleur légère autour de la balustrade. Hylee la reconnaît sans chercher à la retenir."],
      ["Hylee", "La magie aussi a de la mémoire."],
      ["Narrateur", "Elle retire sa main avant que le souvenir ne devienne un sort."],
    ],
  }, [
    ["Narrateur", "Lorsque Hylee se relève, la nuit conserve sa place et le matin la sienne."],
    ["Hylee", "Bon. Maintenant, je vais trouver quelque chose à manger avant de transformer mes sentiments en catastrophe magique."],
  ]);

  add("miraldas-matin-libre:terrasse:plus-notes-au-vent", [
    ["Narrateur", "Des feuillets se sont échappés d'une sacoche et tournent au-dessus de la terrasse. Chaque page porte des annotations de Remerii."],
    ["Hylee", "Évidemment, même ses notes refusent de tomber dans le désordre."],
    ["Narrateur", "Une rafale emporte la plus haute vers le bord du Dôme."],
    ["Hylee", "D'accord, vous avez gagné. Je viens vous chercher."],
  ], {
    resonance: [
      ["Narrateur", "Hylee suit les courants magiques et crée un contre-flux assez doux pour ramener les pages."],
      ["Hylee", "Une par une. Pas de panique."],
      ["Narrateur", "La dernière se pose sur son nez. Elle décide de compter cela comme une réussite."],
    ],
    audace: [
      ["Narrateur", "Hylee grimpe sur le rebord et saute pour saisir la feuille la plus éloignée."],
      ["Remerii", "Hylee !"],
      ["Narrateur", "Une prise magique la ramène sur la terrasse avant que ses bottes ne retrouvent la pierre."],
      ["Hylee", "J'avais presque réussi."],
    ],
    lucidite: [
      ["Hylee", "Elles tournent autour du même point. Il suffit de bloquer la sortie."],
      ["Narrateur", "Elle tend sa cape entre deux colonnes. Les feuilles viennent s'y plaquer sans qu'aucune ne franchisse le bord."],
      ["Remerii", "Une solution rustique, mais irréprochable."],
    ],
  }, [
    ["Narrateur", "Remerii récupère les feuillets et vérifie leur ordre."],
    ["Hylee", "Tu pourrais commencer par demander si je vais bien."],
    ["Remerii", "Je t'ai rattrapée avant même de vérifier la pagination. Mes priorités sont limpides."],
  ]);

  add("miraldas-matin-libre:atelier:tri-cristaux", [
    ["Maître d'atelier", "Bleus à gauche, chauds au centre, instables dans les coffrets gris. Si l'un chante, appelez-moi."],
    ["Hylee", "Et s'il siffle ?"],
    ["Maître d'atelier", "Courez d'abord. La question ensuite."],
    ["Narrateur", "Quatre paniers attendent Hylee. Deux cristaux ont déjà changé de couleur depuis le début des consignes."],
    ["Hylee", "Je sens que cette matinée va être très éducative."],
  ], {
    lucidite: [
      ["Narrateur", "Hylee classe d'abord les cristaux stables et laisse les cas douteux à distance."],
      ["Hylee", "Celui-ci est froid, mais sa vibration correspond au groupe chaud."],
      ["Maître d'atelier", "Piège classique. Vous venez d'épargner une table."],
    ],
    resonance: [
      ["Narrateur", "Elle ferme les yeux une seconde et distingue les vibrations par couches."],
      ["Hylee", "Les deux violets se répondent. Il faut les séparer."],
      ["Narrateur", "Le bourdonnement s'arrête dès que l'un rejoint un coffret isolé."],
    ],
    sangfroid: [
      ["Narrateur", "Un cristal se met à siffler. Hylee pose le panier, recule et lève la main."],
      ["Hylee", "J'applique la partie course avec une grande dignité."],
      ["Maître d'atelier", "Excellente décision. La dignité est facultative."],
    ],
  }, [
    ["Narrateur", "Les coffrets sont fermés et marqués avant l'arrivée des apprentis."],
    ["Maître d'atelier", "Aucun sourcil perdu. Vous êtes réembauchée quand vous voulez."],
    ["Hylee", "Je vais inscrire ça sur mon parcours de mage."],
  ]);

  add("miraldas-matin-libre:atelier:plus-sort-debutant", [
    ["Narrateur", "Un jeune apprenti tente de créer une sphère lumineuse. Le sort gonfle à chaque essai et flotte désormais au-dessus de lui tel un ballon impatient."],
    ["Apprenti", "Elle devait tenir dans ma main."],
    ["Hylee", "J'ai déjà obtenu un glaçon de la taille d'une chaise en visant un verre."],
    ["Apprenti", "Ça m'aide un peu."],
    ["Narrateur", "La sphère heurte le plafond et recommence à descendre."],
  ], {
    sangfroid: [
      ["Hylee", "Ne la repousse pas. Coupe seulement l'alimentation."],
      ["Narrateur", "L'apprenti desserre ses doigts. La lumière rétrécit par à-coups jusqu'à tenir dans ses paumes."],
      ["Apprenti", "Je croyais devoir la contrôler."],
    ],
    lucidite: [
      ["Hylee", "Tu alimentes aussi le contour. Garde le centre et laisse les bords se dissiper."],
      ["Narrateur", "Il modifie la formule. Une pluie d'étincelles inoffensives remplace l'enveloppe trop large."],
      ["Apprenti", "C'était dans la deuxième ligne."],
      ["Hylee", "Les deuxièmes lignes sont sournoises."],
    ],
    resonance: [
      ["Hylee", "Écoute son rythme. Elle grossit chaque fois que tu retiens ton souffle."],
      ["Apprenti", "Je retiens mon souffle parce qu'elle grossit."],
      ["Hylee", "Oui, c'est un cercle très agaçant. Respire avec moi."],
    ],
  }, [
    ["Narrateur", "La sphère finit par tenir au-dessus d'une seule main."],
    ["Apprenti", "Merci. Tu enseignes ici ?"],
    ["Hylee", "Non, je fais encore les erreurs avant de les expliquer."],
  ]);
})();

(function registerValurnAndDravenRoutes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("calciterres-apres-valurn:ruines:traces-bellirith", [
    ["Narrateur", "Valurn revient sur ses pas. La poussière a déjà recouvert leurs traces, sauf un cercle parfaitement propre autour d’une pierre noire."],
    ["Valurn", "Subtil. Presque assez pour que je croie à un hasard."],
    ["Narrateur", "Une marque de Bellirith apparaît sous la pierre. Le trait est frais."],
    ["Valurn", "Tu me laisses partir et tu signes le chemin. Nous avons décidément une définition familiale de la liberté."],
  ], {
    observer: [
      ["Narrateur", "Il examine les bords sans toucher le symbole. La gravure indique une direction, puis s’interrompt avant la dernière branche."],
      ["Valurn", "Tu veux que je choisisse la fin. Quelle délicatesse."],
    ],
    agir: [
      ["Narrateur", "Valurn presse deux doigts contre la marque. Une chaleur brutale lui traverse la main."],
      ["Valurn", "Oui, tu es toujours fâchée. Le message manquait de précision."],
    ],
    temporiser: [
      ["Narrateur", "Il couvre le symbole d’une poignée de cendre sans le détruire."],
      ["Valurn", "Je sais où regarder. Tu peux cesser de crier dans la pierre."],
    ],
  }, [
    ["Narrateur", "La trace confirme que Bellirith garde un accès aux ruines."],
    ["Valurn", "Aucune poursuite, aucun adieu. Tu deviens raisonnable, ma chère, c’est inquiétant."],
    ["Narrateur", "Il reprend la route avec la certitude qu’elle peut le retrouver."],
  ]);

  add("calciterres-apres-valurn:ruines:plus-signe-bellirith", [
    ["Narrateur", "Une entaille traverse une pierre qu’il avait inspectée avant la rencontre. Elle n’existait pas une heure plus tôt."],
    ["Valurn", "Tu aurais pu écrire. Les civilisations avancées utilisent parfois du papier."],
    ["Narrateur", "Le signe appartient à un ancien langage démoniaque. Il signifie passage, avec une nuance réservée aux invitations dangereuses."],
    ["Valurn", "Évidemment. Tu n’as jamais su inviter quelqu’un sans menacer sa peau."],
  ], {
    observer: [
      ["Narrateur", "Une seconde entaille, plus fine, précise que le passage fonctionne dans les deux sens."],
      ["Valurn", "Tu veux surtout que je sache que ma porte possède désormais une poignée de ton côté."],
    ],
    agir: [
      ["Narrateur", "Il complète le signe d’un trait moqueur qui transforme l’invitation en défi."],
      ["Valurn", "Voilà. Si tu me surveilles encore, tu auras au moins quelque chose de joli à lire."],
    ],
    temporiser: [
      ["Narrateur", "Il mémorise la gravure et n’y ajoute rien. Répondre donnerait déjà trop d’importance au geste."],
      ["Valurn", "Je garde ton invitation. Ne réserve pas la chambre."],
    ],
  }, [
    ["Narrateur", "Le chemin reste ouvert. Bellirith n’a pas demandé son retour."],
    ["Valurn", "Elle exige seulement que je pense à elle en partant. Une victoire modeste et très bien choisie."],
    ["Narrateur", "Son sourire s’efface dès qu’il tourne le dos à la pierre."],
  ]);

  add("calciterres-apres-valurn:camp:rapport", [
    ["Narrateur", "Valurn tient la plume au-dessus du rapport destiné à Iriana. La première phrase attend depuis plusieurs minutes."],
    ["Valurn", "Princesse, les Calciterres demeurent charmantes et tout le monde souhaite notre mort. Voilà, rapport terminé."],
    ["Narrateur", "Il rature la ligne. Iriana voudra des faits, puis cherchera ce qu’il a protégé entre eux."],
    ["Valurn", "L’honnêteté serait tellement plus simple si elle n’était pas lue par une manipulatrice compétente."],
  ], {
    observer: [
      ["Narrateur", "Il décrit les ruines, les forces présentes et la route de Bellirith. Il retire chaque hypothèse impossible à défendre."],
      ["Valurn", "Des faits propres. Elle soupçonnera immédiatement une dissimulation."],
    ],
    agir: [
      ["Narrateur", "Il écrit la menace en toutes lettres et recommande une réponse rapide."],
      ["Valurn", "Elle voulait une décision. Elle aura aussi le plaisir d’en porter la faute."],
    ],
    temporiser: [
      ["Narrateur", "Il signale le danger, garde le nom de Bellirith et demande une journée avant toute opération."],
      ["Valurn", "Assez de vérité pour survivre, pas assez pour qu’elle se précipite dans mon passé."],
    ],
  }, [
    ["Narrateur", "Le rapport est scellé avec une cire sombre."],
    ["Valurn", "Elle le lira trois fois, puis prétendra avoir compris à la première."],
    ["Narrateur", "Il range le document contre son cœur, faute de poche moins symbolique."],
  ]);

  add("calciterres-apres-valurn:camp:plus-deux-versions-rapport", [
    ["Narrateur", "Deux conclusions reposent devant Valurn. La première rassure Iriana. La seconde lui donne les moyens d’agir."],
    ["Valurn", "Le confort ou l’utilité. Elle déteste qu’on lui impose ce genre de choix, raison supplémentaire de le faire."],
    ["Narrateur", "Dans la version rassurante, Bellirith reste isolée. Dans l’autre, elle possède encore des relais."],
    ["Valurn", "Et dans aucune, je n’explique pourquoi elle m’a parlé. Il faut conserver un peu d’élégance."],
  ], {
    observer: [
      ["Narrateur", "Valurn compare les deux textes mot à mot et repère la phrase qui trahit sa peur."],
      ["Valurn", "Celle-ci disparaît. Iriana collectionne déjà trop de mes faiblesses."],
    ],
    agir: [
      ["Narrateur", "Il scelle la version utile, avec les risques et les noms qu’il peut confirmer."],
      ["Valurn", "Elle me reprochera de l’inquiéter. C’est une activité qui lui réussit très bien."],
    ],
    temporiser: [
      ["Narrateur", "Il fusionne les textes, garde l’alerte et retire toute recommandation immédiate."],
      ["Valurn", "Je lui offre une nuit de réflexion. Profitons de ce miracle avant qu’il ne soit interdit."],
    ],
  }, [
    ["Narrateur", "Une conclusion est pliée. L’autre brûle au bord du feu."],
    ["Valurn", "Adieu, mensonge confortable. Tu étais très bien écrit."],
    ["Narrateur", "Il regarde les dernières lignes noircir et les retient malgré lui."],
  ]);

  add("calciterres-apres-valurn:route:detour", [
    ["Narrateur", "Une ancienne cache des Saël se trouve derrière un pan de roche. Valurn n’en avait parlé à personne."],
    ["Valurn", "Voyons si mon passé a eu la courtoisie de rester fermé."],
    ["Narrateur", "Le sceau répond encore à son sang. Une marque récente borde pourtant la serrure."],
    ["Valurn", "Bien sûr. Même mes secrets reçoivent des visiteurs quand je m’absente."],
  ], {
    observer: [
      ["Narrateur", "Il suit la poussière et trouve une empreinte partielle, trop large pour Bellirith."],
      ["Valurn", "Un admirateur. J’espère qu’il a apprécié le décor."],
    ],
    agir: [
      ["Narrateur", "Valurn ouvre la cache d’un geste sec. Une lame piégée racle sa manche et se fiche dans la roche."],
      ["Valurn", "Voilà un accueil plus conforme aux traditions familiales."],
    ],
    temporiser: [
      ["Narrateur", "Il désarme le sceau extérieur et attend. Aucun second mécanisme ne se déclenche."],
      ["Valurn", "Patience, tu vois ? Je mûris de manière tragique."],
    ],
  }, [
    ["Narrateur", "Les provisions sont intactes. Un symbole récent apparaît sous la caisse du fond."],
    ["Valurn", "Quelqu’un entretient donc encore ce réseau."],
    ["Narrateur", "Il emporte le nécessaire et laisse un signe différent à l’intrus."],
  ]);

  add("calciterres-apres-valurn:route:plus-patrouille-lointaine", [
    ["Narrateur", "Des lanternes impériales progressent loin de la route autorisée. La patrouille avance sans chant ni bannière."],
    ["Valurn", "Des soldats discrets dans les Calciterres. J’aurais dû rester couché."],
    ["Narrateur", "Être reconnu expliquerait sa présence. Rester caché lui permettrait de découvrir leur destination."],
    ["Valurn", "Choisir entre la confiance impériale et une information volée, voilà qui me ressemble davantage."],
  ], {
    observer: [
      ["Narrateur", "Valurn suit les lanternes depuis les hauteurs. Les soldats cherchent une borne ancienne et évitent les ruines principales."],
      ["Valurn", "Ils possèdent une carte que je n’ai jamais donnée. Intéressant."],
    ],
    agir: [
      ["Narrateur", "Il rejoint la route à découvert, mains visibles et sourire déjà prêt."],
      ["Valurn", "Messieurs, vous êtes perdus avec une remarquable discipline. Puis-je compliquer la situation ?"],
    ],
    temporiser: [
      ["Narrateur", "Il efface sa signature magique et laisse la patrouille passer. Le dernier soldat marque discrètement un arbre."],
      ["Valurn", "Merci pour l’indice. Je tâcherai de ne pas le rendre."],
    ],
  }, [
    ["Narrateur", "Valurn apprend leur direction et choisit ce que l’Empire saura de sa présence."],
    ["Valurn", "Une promenade productive, personne ne m’a encore poignardé."],
    ["Narrateur", "Il s’éloigne avant de tenter davantage sa chance."],
  ]);

  add("forthaven-apres-draven:quais:chargement", [
    ["Narrateur", "La barge arrive après la tombée du jour. Plusieurs sacs de grain ont pris l’eau et l’un d’eux répand déjà une odeur aigre sur les planches."],
    ["Intendant", "Cent trente-sept sacs utilisables. Quarante-deux à trier. Dix-neuf perdus."],
    ["Lineva", "Tu viens de me donner trois nombres et toujours aucun repas."],
    ["Intendant", "Deux jours pour la garnison. Moins si nous maintenons les cuisines civiles."],
    ["Lineva", "On maintient les cuisines. Maintenant, trouve-moi des chiffres qui permettent aux gens de survivre jusqu’au troisième jour."],
  ], {
    observer: [
      ["Narrateur", "Lineva fait ouvrir les sacs gonflés par l’humidité. Sous la première couche saine, deux lots ont déjà noirci."],
      ["Lineva", "Ceux-là partent au feu. Je préfère annoncer une ration courte qu’envoyer la moitié de la ville à l’infirmerie."],
    ],
    agir: [
      ["Lineva", "Ouvre les réserves des officiers et verse-les au stock commun. Même pain pour tout le monde à partir de ce soir."],
      ["Intendant", "Le commandement va protester."],
    ],
    temporiser: [
      ["Lineva", "Aucune distribution avant le retour des registres de cuisine. Je veux le nombre de bouches, pas le nombre prévu le mois dernier."],
      ["Narrateur", "Des coureurs partent vers les quartiers. La file gronde, puis se calme lorsque Lineva reste sur place avec elle."],
    ],
  }, [
    ["Narrateur", "Trois coups de cloche éclatent du côté sud. Les guetteurs ont vu les morts bouger près de la chaussée."],
    ["Lineva", "Affiche les rations avant que la rumeur le fasse à notre place. Et garde-moi un sac pour les cuisines du rempart."],
    ["Narrateur", "Elle quitte le port au pas de course. Derrière elle, l’intendant inscrit la même mesure à côté des soldats, des officiers et des civils."],
  ]);

  add("forthaven-apres-draven:quais:plus-caisse-civile", [
    ["Narrateur", "La caisse contient des poudres contre la fièvre, des désinfectants et six fioles capables de ralentir la nécrose."],
    ["Soigneuse des remparts", "Mes blessés ont touché les morts-vivants. Sans ces fioles, je vais perdre des bras avant l’aube."],
    ["Soigneuse des réfugiés", "J’ai trente enfants avec la même fièvre. La faim les vide plus vite que je ne peux les hydrater."],
    ["Lineva", "Vous auriez pu choisir une nuit où une seule de vous avait raison."],
    ["Narrateur", "Aucune des deux femmes ne sourit. Lineva tire la caisse entre elles et ouvre le registre."],
  ], {
    observer: [
      ["Narrateur", "Lineva fait lire chaque diagnostic à voix haute. Deux traitements demandés aux remparts peuvent être remplacés par des produits encore en stock."],
      ["Lineva", "Les fioles irremplaçables suivent les blessés contaminés. Le reste va aux réfugiés, avec la liste exacte."],
    ],
    agir: [
      ["Lineva", "Deux tables. Vous partagez tout devant moi, dose par dose. Aucun flacon ne disparaît dans une manche ou un placard."],
      ["Soigneuse des remparts", "Cela nous laissera trop peu des deux côtés."],
    ],
    temporiser: [
      ["Lineva", "Vous avez dix minutes pour me donner les noms et les urgences. Si vous voulez la caisse entière, prouvez que l’autre service peut attendre."],
      ["Narrateur", "Les deux soigneuses se penchent sur leurs listes et commencent enfin à chercher des remplacements ensemble."],
    ],
  }, [
    ["Narrateur", "Deux lots quittent l’entrepôt sous escorte. La caisse vide reste au milieu du sol."],
    ["Soigneuse des réfugiés", "Et si les réserves restent vides ?"],
    ["Lineva", "Alors on cherchera encore. Demain, vous me dites qui a répondu au traitement et qui manque de quoi tenir."],
  ]);

  add("forthaven-apres-draven:remparts:lineva", [
    ["Narrateur", "Le parchemin de communication a refroidi sous la veste de Lineva. La voix de Draven, resté au palais d’Al’Gratal, résonne encore dans sa tête."],
    ["Capitaine", "Mouvement au sud. Deux groupes sortent du cimetière et un troisième longe la chaussée."],
    ["Lineva", "Combien ?"],
    ["Capitaine", "Assez pour tester la porte. Peut-être davantage dans le bois."],
    ["Lineva", "Le parchemin est fermé. Parle-moi de ceux qui sont devant nos murs."],
  ], {
    observer: [
      ["Narrateur", "Lineva suit les lanternes ennemies. Le groupe le plus visible ralentit chaque fois que les archers changent de position."],
      ["Lineva", "Ils nous regardent. Garde les réserves hors du parapet et double les guetteurs sur la poterne."],
    ],
    agir: [
      ["Lineva", "Deux sections à la porte sud. Pieux, huile et cordes de retraite. Je veux la position tenue avant qu’ils atteignent le fossé."],
      ["Capitaine", "Cela vide la tour est."],
    ],
    temporiser: [
      ["Lineva", "On ne mord pas à leur première feinte. Une section prête dans l’escalier, aucune torche supplémentaire sur le mur."],
      ["Narrateur", "Les soldats attendent dans l’ombre pendant que les silhouettes mortes cherchent une réaction."],
    ],
  }, [
    ["Narrateur", "Les morts s’arrêtent hors de portée, puis se dispersent vers l’est. Une reconnaissance, pour cette fois."],
    ["Capitaine", "Et le détachement promis à votre père ?"],
    ["Lineva", "Il partira. Alors cette nuit, nous apprenons à tenir sans lui et sans eux."],
  ]);

  add("forthaven-apres-draven:remparts:plus-releve-silencieuse", [
    ["Narrateur", "Un jeune garde s’agrippe au parapet lorsque la relève arrive. La fièvre a rougi son visage jusque sous le casque."],
    ["Lineva", "Depuis quand tes jambes tremblent ?"],
    ["Jeune garde", "Elles ne tremblent pas, Commandante. Le mur vibre."],
    ["Lineva", "Le mur a donc aussi vomi derrière la citerne ?"],
    ["Narrateur", "Le garçon baisse les yeux. En contrebas, les morts raclent leurs armes contre les pierres."],
  ], {
    observer: [
      ["Lineva", "Reprends ton rapport depuis le dernier changement de torche."],
      ["Narrateur", "Il mélange deux mouvements ennemis et oublie le signal de la tour voisine. Sa propre voix lui retire son dernier argument."],
    ],
    agir: [
      ["Lineva", "Tu descends maintenant. Si je te revois sur ce mur avant l’avis d’une soigneuse, tu récureras les latrines avec ta belle armure."],
      ["Jeune garde", "Oui, Commandante."],
    ],
    temporiser: [
      ["Lineva", "Assieds-toi jusqu’à la relève. Tu lui donnes ton rapport, puis tu descends avec elle."],
      ["Jeune garde", "Je peux encore servir assis."],
    ],
  }, [
    ["Jeune garde", "On manque déjà de monde."],
    ["Lineva", "Justement. Reviens vivant reprendre ta place demain."],
    ["Narrateur", "La relève l’emmène vers l’infirmerie. Lineva prend elle-même son créneau jusqu’à l’arrivée d’un remplaçant."],
  ]);

  add("forthaven-apres-draven:salle-guerre:replis", [
    ["Narrateur", "Une nouvelle croix noire apparaît dans la ville basse. Les morts ont franchi une cour et poussent les habitants vers trois rues trop étroites."],
    ["Capitaine", "Si nous fermons la rue des Tanneurs, nous tenons le carrefour."],
    ["Lineva", "Combien de civils derrière la barricade ?"],
    ["Greffier", "Le registre en compte quarante-sept. Il date d’hier."],
    ["Lineva", "Alors la carte ignore déjà ceux que nous allons enfermer. On recommence."],
  ], {
    observer: [
      ["Narrateur", "Lineva superpose le registre des réfugiés à celui des puits encore sains. Une ruelle oubliée rejoint la cour des Tanneurs."],
      ["Lineva", "Ouvrez cette sortie et placez deux hommes au croisement. La barricade attend leur signal."],
    ],
    agir: [
      ["Lineva", "J’envoie six soldats chercher les retardataires. Ils ont dix minutes, puis ils reviennent, même si quelqu’un crie encore derrière eux."],
      ["Capitaine", "Six soldats peuvent nous manquer au carrefour."],
    ],
    temporiser: [
      ["Lineva", "Montez la barricade sans poser la traverse. Les archers gagnent du temps, les civils gardent une issue."],
      ["Narrateur", "Le capitaine transmet l’ordre avec un délai précis et trois signaux de fermeture."],
    ],
  }, [
    ["Narrateur", "Le dernier groupe recensé traverse le carrefour pendant que les premières mains mortes apparaissent au bout de la rue."],
    ["Lineva", "Fermez. Personne ne rouvre sans mon ordre, même si ça frappe de l’autre côté."],
    ["Narrateur", "La traverse tombe. Dans la salle, personne ne demande combien de personnes le registre a pu oublier."],
  ]);

  add("forthaven-apres-draven:salle-guerre:plus-marque-effacee", [
    ["Narrateur", "Le village de Sorneval a disparu de la carte. Une trace grise marque encore l’endroit où le greffier a frotté le charbon."],
    ["Lineva", "Qui a ordonné de le rayer ?"],
    ["Greffier", "Aucun signal depuis quatre jours. Les morts ont traversé toute la vallée."],
    ["Réfugiée", "Ma sœur connaît des caves sous le moulin. Ils peuvent tenir là-dessous."],
    ["Lineva", "Peuvent, ou tiennent ? J’ai besoin de la différence avant d’envoyer des gens mourir."],
  ], {
    observer: [
      ["Narrateur", "Lineva fait reprendre les récits séparément. Le moulin, le puits couvert et le passage sous la grange reviennent dans les trois versions."],
      ["Lineva", "Nous avons une piste. Inscris les accès et le nombre maximal de survivants."],
    ],
    agir: [
      ["Lineva", "Six éclaireurs à l’aube, avec un cor et aucune obligation d’entrer dans le village. Ils confirment d’abord les signes de vie."],
      ["Greffier", "Je prépare l’ordre de mission."],
    ],
    temporiser: [
      ["Lineva", "Remets Sorneval sur la carte avec la mention contact perdu. Aucune promesse de secours tant que la route reste fermée."],
      ["Réfugiée", "Au moins, vous ne les appelez plus morts."],
    ],
  }, [
    ["Narrateur", "Sorneval retrouve sa place, entouré d’un cercle rouge et de trois points d’interrogation."],
    ["Lineva", "Une carte sert à décider où risquer les vivants. Elle n’a pas le droit de tuer les absents par facilité."],
    ["Narrateur", "Le greffier range la gomme. La réfugiée reste devant le nom jusqu’à ce qu’on lui apporte une chaise."],
  ]);
})();

(function registerChaptersOneToThree() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("forestier-avant-depart:salle:dernier-service", [
    ["Narrateur", "Le feu baisse. Remerii replie la carte, puis la rouvre dès qu’Hylee s’assoit en face d’elle."],
    ["Hylee", "Tu vas finir par l’user avant qu’on atteigne Al’Gratal."],
    ["Remerii", "Une carte compétente supporte plusieurs lectures."],
    ["Hylee", "Et une apprentie compétente a le droit de savoir où tu comptes l’emmener ?"],
    ["Narrateur", "Remerii garde deux doigts sur l’itinéraire. Son regard quitte enfin le papier."],
  ], {
    lucidite: [
      ["Hylee", "Tu me présentes toujours le trajet. Jamais ce que tu attends de moi pendant le trajet."],
      ["Remerii", "Observer, demander, recommencer quand tu échoues. Et m’arrêter lorsque je décide que dormir est facultatif."],
      ["Hylee", "La dernière règle sert surtout à toi."],
    ],
    audace: [
      ["Hylee", "Je viens avec toi parce que je le veux. Alors donne-moi une partie de la carte."],
      ["Remerii", "Voilà une revendication remarquablement tardive."],
      ["Narrateur", "Elle pousse pourtant la carte jusqu’au milieu du tapis et laisse Hylee tracer la première étape."],
    ],
    sangfroid: [
      ["Hylee", "J’ai envie d’y aller. J’ai aussi peur de redevenir celle qui suit sans comprendre."],
      ["Remerii", "Alors dis-le dès que tu te sens perdue. Je préfère une question pénible à une obéissance silencieuse."],
      ["Narrateur", "Hylee hoche la tête. La franchise lui rend le départ plus léger."],
    ],
  }, [
    ["Remerii", "Al’Gratal reste notre destination. Pour le reste, nous déciderons à deux."],
    ["Narrateur", "Hylee prend la carte. Remerii lui laisse aussi le crayon."],
  ]);

  add("forestier-avant-depart:salle:plus-conseils-habitués", [
    ["Narrateur", "Trois itinéraires occupent la couverture posée entre elles. Remerii a marqué le sien d’un trait bleu très net."],
    ["Hylee", "Le bleu, c’est la route de l’archimage. Les notes au charbon, la route de celle qui était déjà venue. Et mes petits points…"],
    ["Remerii", "La route de quelqu’un qui a choisi de dessiner sur une carte officielle."],
    ["Hylee", "Tu préfères que je dessine sur tes manches ?"],
    ["Remerii", "Je préfère soudain beaucoup les petits points."],
  ], {
    lucidite: [
      ["Hylee", "Ton chemin longe la rivière. Après la pluie, ce passage risque d’être noyé."],
      ["Remerii", "Mes notes datent de la saison sèche. Voilà une lacune que j’aurais dû voir."],
      ["Narrateur", "Elle corrige le trait bleu sans chercher d’excuse."],
    ],
    audace: [
      ["Hylee", "On prend mon chemin jusqu’à la borne, puis le tien. On saura vite si mon intuition raconte n’importe quoi."],
      ["Remerii", "Tu proposes donc une expérience avec nos pieds pour instruments de mesure."],
      ["Hylee", "Ils ont survécu à deux ans de tes détours. Ils sont qualifiés."],
    ],
    sangfroid: [
      ["Hylee", "On garde le chemin sec en route principale et les deux autres en repli."],
      ["Remerii", "Prudent, clair et vexant pour mon amour des solutions parfaites."],
      ["Narrateur", "Remerii annote les replis. Son écriture se détend au fil des lignes."],
    ],
  }, [
    ["Hylee", "Donc mes petits points restent ?"],
    ["Remerii", "Ils restent. N’en profite pas pour illustrer les montagnes."],
  ]);

  add("forestier-avant-depart:chambre:faire-le-sac", [
    ["Narrateur", "Hylee place les fioles dans les poches latérales. Remerii les déplace au centre. Hylee les remet à gauche."],
    ["Remerii", "Tu viens réellement de défaire mon rangement sous mes yeux."],
    ["Hylee", "Ton rangement exige de vider le sac pour soigner une coupure."],
    ["Remerii", "Il protège mieux le verre."],
    ["Hylee", "Il protège surtout ton besoin de classer le monde."],
  ], {
    lucidite: [
      ["Hylee", "Les soins sur le dessus, la nourriture au fond, les fioles entre deux tissus. Regarde, rien ne cogne."],
      ["Remerii", "Tu as testé ?"],
      ["Narrateur", "Hylee secoue le sac. Aucun tintement. Remerii pince les lèvres, privée de son objection préférée."],
    ],
    sangfroid: [
      ["Hylee", "On le porte chacune cinq minutes. Celle qui souffre le moins gagne le rangement."],
      ["Remerii", "Une méthode empirique. J’accepte, uniquement parce qu’elle me donnera raison."],
      ["Narrateur", "Au bout de trois minutes, Remerii replace discrètement une couverture sous les fioles."],
    ],
    resonance: [
      ["Hylee", "Je peux givrer légèrement les compartiments. Les fioles resteront en place."],
      ["Remerii", "Légèrement, Hylee. Nous transportons des remèdes, pas une collection de glaçons."],
      ["Hylee", "Tu vois ? Tu sais être utile pendant que je range."],
    ],
  }, [
    ["Narrateur", "Le sac se ferme enfin. Remerii tire une dernière fois sur la sangle, sans modifier l’intérieur."],
    ["Remerii", "Je reconnais que ta méthode fonctionne. Tu peux savourer cette phrase jusqu’à demain matin."],
  ]);

  add("forestier-avant-depart:chambre:plus-place-dans-le-sac", [
    ["Narrateur", "Une poche reste vide au sommet du sac. Remerii y glisse deux doigts, vérifie le fond, puis regarde Hylee."],
    ["Remerii", "Tu as oublié quelque chose."],
    ["Hylee", "J’ai laissé de la place."],
    ["Remerii", "Pour de l’air ? Nous en trouverons sur la route."],
    ["Hylee", "Pour ce qu’on ne connaît pas encore."],
  ], {
    resonance: [
      ["Hylee", "Un cristal, une plume, une pierre qui chante. On trouve toujours quelque chose."],
      ["Remerii", "La dernière pierre qui chantait a hurlé trois nuits dans mes bagages."],
      ["Hylee", "Elle avait du caractère."],
    ],
    lucidite: [
      ["Hylee", "Si on récupère un ingrédient fragile, il faudra l’isoler. Cette poche sera prête."],
      ["Remerii", "Voilà une justification raisonnable arrivée après la décision."],
      ["Narrateur", "Elle mesure l’espace du regard et déplace une fiole vers son propre sac."],
    ],
    audace: [
      ["Hylee", "Je parie qu’elle sera remplie avant Al’Gratal."],
      ["Remerii", "Par quoi ?"],
      ["Hylee", "Si je le savais, ce pari serait profondément ennuyeux."],
    ],
  }, [
    ["Narrateur", "La poche demeure ouverte et disponible. Remerii lui accorde même quelques centimètres de plus."],
    ["Remerii", "Très bien. En revanche, aucune pierre bruyante."],
  ]);

  add("forestier-avant-depart:chambre:confidence-remerii-apprendre", [
    ["Narrateur", "Remerii vérifie la même attache pour la troisième fois. Hylee pose sa main sur le nœud avant qu’elle recommence."],
    ["Hylee", "Je sais faire mes sacs depuis deux ans."],
    ["Remerii", "Je m’efforce de croire que ces deux années ont produit quelques résultats."],
    ["Hylee", "Je parle de nous. Maintenant que tu me présentes comme ton apprentie, tu attends quoi de moi ?"],
    ["Narrateur", "Remerii lâche la corde. Sa réponse lui demande plus de réflexion que le trajet entier."],
  ], {
    lucidite: [
      ["Hylee", "Qu’est-ce qui te ferait dire que tu t’es trompée en me prenant avec toi ?"],
      ["Remerii", "Te voir renoncer à penser dès que j’ai parlé. Je peux enseigner une technique. Je ne veux pas fabriquer mon écho."],
      ["Hylee", "Tu n’aurais jamais supporté une deuxième toi."],
    ],
    audace: [
      ["Hylee", "Je refuse d’être gardée derrière toi chaque fois que ça devient dangereux."],
      ["Remerii", "Et moi, je refuse de confondre courage et empressement à mourir."],
      ["Hylee", "Alors apprends-moi à rester devant sans mourir."],
    ],
    sangfroid: [
      ["Hylee", "Donne-moi tes règles. Je te dirai celles que je peux réellement tenir."],
      ["Remerii", "Tu demandes déjà à négocier ton apprentissage."],
      ["Narrateur", "Une fierté discrète traverse son visage avant qu’elle énumère trois règles simples."],
    ],
  }, [
    ["Remerii", "Je veux que tu survives assez longtemps pour me désobéir pour de bonnes raisons."],
    ["Hylee", "D’accord. Je commencerai par tes sacs."],
  ]);

  add("forestier-avant-depart:lisiere:dire-au-revoir", [
    ["Narrateur", "Hylee rejoint la première borne du sentier. Le camp reste visible derrière elle, éclairé par une seule flamme."],
    ["Hylee", "Deux ans, et j’ai encore besoin de regarder derrière moi."],
    ["Narrateur", "Elle touche le pendentif caché sous sa tunique. Aucun ordre ne lui demande d’avancer."],
    ["Hylee", "Bon. Alors cette fois, je choisis."],
  ], {
    sangfroid: [
      ["Narrateur", "Elle énumère ce qu’elle sait faire aujourd’hui, monter un camp, tenir une veille, reconnaître plusieurs pièges magiques."],
      ["Hylee", "Je ne suis plus celle qui est sortie de l’auberge. Ça devrait compter."],
      ["Narrateur", "Sa respiration ralentit. Elle tourne le dos à la borne sans se presser."],
    ],
    resonance: [
      ["Narrateur", "Hylee ouvre sa perception. La forêt lui renvoie le feu, la présence de Remerii et le fil de la route."],
      ["Hylee", "Je vous entends. Je viens quand même."],
      ["Narrateur", "Quelques feuilles frémissent. Elle sourit à cette réponse incertaine."],
    ],
    audace: [
      ["Narrateur", "Elle dépasse la borne de dix pas, puis quinze, juste pour sentir le départ sous ses pieds."],
      ["Hylee", "Al’Gratal, j’arrive. Essaie de ne pas être trop décevante."],
      ["Narrateur", "Un rire lui échappe. Elle revient chercher son sac avant que Remerii ne s’inquiète."],
    ],
  }, [
    ["Narrateur", "Le sentier n’offre aucune garantie. Hylee retourne au camp avec une décision qui lui appartient."],
    ["Hylee", "Demain, je marche devant au moins jusqu’au premier croisement."],
  ]);

  add("forestier-avant-depart:lisiere:plus-bruits-derriere", [
    ["Narrateur", "Une troisième cadence accompagne Hylee depuis la lisière. Deux pas, un arrêt, puis le froissement d’une fougère."],
    ["Hylee", "Je t’entends."],
    ["Narrateur", "Le bois se tait. Au camp, Remerii continue de ranger sans avoir remarqué le manège."],
    ["Hylee", "Enfin, j’espère que je t’entends. Parler seule aux buissons serait gênant."],
  ], {
    sangfroid: [
      ["Narrateur", "Hylee recule jusqu’à garder le feu dans son champ de vision. Elle attend sans sortir d’arme."],
      ["Hylee", "Tu peux rester là. Moi aussi."],
      ["Narrateur", "La cadence reprend plus loin, désormais régulière."],
    ],
    resonance: [
      ["Narrateur", "Elle effleure la trame. Une curiosité animale lui répond, vive et prudente."],
      ["Hylee", "Tu voulais seulement voir qui partait ?"],
      ["Narrateur", "Une petite forme bondit entre deux racines, puis disparaît avant qu’elle l’identifie."],
    ],
    audace: [
      ["Narrateur", "Hylee avance brusquement vers le bruit. Une créature détale et lui projette de la terre sur les bottes."],
      ["Hylee", "Très courageux ! Reviens le dire en face !"],
      ["Narrateur", "Un cri aigu lui répond au loin. Hylee décide de le prendre pour une insulte."],
    ],
  }, [
    ["Narrateur", "La présence garde ses distances. Hylee rejoint le feu avec de la boue sur les bottes et aucune blessure."],
    ["Remerii", "Dois-je demander ?"],
  ]);

  add("algratal-preparatifs:marche:provisions", [
    ["Narrateur", "Trois nécessaires de voyage sont alignés sur l’étal. Le marchand vante les coutures du premier, le prestige du deuxième et évite soigneusement de parler du troisième."],
    ["Hylee", "Pourquoi celui-là vibre quand je m’approche ?"],
    ["Marchand sylvinien", "Une propriété décorative."],
    ["Remerii", "Les décorations mordent rarement les clients."],
    ["Narrateur", "Le nécessaire frémit encore. Le marchand éloigne lentement ses doigts."],
  ], {
    lucidite: [
      ["Hylee", "La boucle est enchantée, le tissu ne l’est pas. Quelqu’un a remplacé une pièce."],
      ["Remerii", "Et l’enchantement absorbe la chaleur. Charmant pour des provisions."],
      ["Marchand sylvinien", "Je peux vous proposer le modèle solide avec une remise."],
    ],
    resonance: [
      ["Hylee", "Il ne cherche pas à me blesser. Il essaie de se fixer à ma magie."],
      ["Remerii", "Pose-le. Nous n’adoptons aucun bagage parasite aujourd’hui."],
      ["Hylee", "Aujourd’hui seulement ?"],
    ],
    audace: [
      ["Hylee", "Je prends le solide au prix du troisième, puisque je viens d’éviter à votre étal un incident."],
      ["Marchand sylvinien", "C’est une négociation singulière."],
      ["Remerii", "Elle devient moins singulière si j’appelle l’inspection arcanique."],
    ],
  }, [
    ["Narrateur", "Le nécessaire solide change de mains. Remerii vérifie les coutures pendant que Hylee savoure leur victoire."],
    ["Remerii", "Tu as très bien négocié. Tâche de rester modeste au moins jusqu’au prochain étal."],
  ]);

  add("algratal-preparatifs:marche:plus-marchand-insistant", [
    ["Narrateur", "Un marchand dépose trois paquets dans les bras d’Hylee sans interrompre sa discussion avec Remerii."],
    ["Marchand sylvinien", "Votre servante pourra porter le reste jusqu’à la porte nord."],
    ["Hylee", "Votre quoi ?"],
    ["Remerii", "Je vous conseille de la regarder avant de répondre. Son expression est très instructive."],
    ["Narrateur", "Le marchand découvre enfin Hylee derrière sa pile de tissus."],
  ], {
    audace: [
      ["Hylee", "Je peux porter ça. Jusqu’au comptoir d’en face, par exemple."],
      ["Narrateur", "Elle y dépose les paquets sous le regard ravi d’une concurrente."],
      ["Marchand sylvinien", "Vous n’aviez aucun droit de faire cela."],
    ],
    sangfroid: [
      ["Hylee", "Je voyage avec Remerii. Si vous voulez un porteur, demandez-lui son prix avant de lui remplir les bras."],
      ["Narrateur", "Le marchand récupère ses biens un à un. Chaque paquet alourdit son embarras."],
      ["Remerii", "Une formulation irréprochable. J’aurais été moins charitable."],
    ],
    lucidite: [
      ["Hylee", "Vous m’avez entendue parler de magie il y a une minute. Vous avez quand même décidé que j’étais sa servante."],
      ["Marchand sylvinien", "Je me suis mépris."],
      ["Hylee", "Oui. Essayez de comprendre sur quoi."],
    ],
  }, [
    ["Narrateur", "Le marchand reprend ses paquets. Hylee garde les bras croisés jusqu’à ce qu’il présente de vraies excuses."],
    ["Remerii", "Tu t’en es très bien sortie. Je regrette presque de ne pas avoir participé."],
  ]);

  add("algratal-preparatifs:palais:requetes-introduction", [
    ["Narrateur", "Iriana maintient trois requêtes séparées sous ses doigts. Une citerne fissurée, des remèdes bloqués et un noble qui exige l’abattage d’un arbre bruyant."],
    ["Hylee", "Un arbre bruyant ?"],
    ["Iriana", "Il perd ses feuilles sur une toiture en cuivre. Son propriétaire considère ce phénomène comme une attaque personnelle."],
    ["Hylee", "Et vous avez besoin de moi pour choisir ?"],
    ["Iriana", "J’ai déjà choisi. Je souhaite savoir si vous remarquerez pourquoi."],
  ], {
    lucidite: [
      ["Hylee", "Les remèdes d’abord. La citerne peut être isolée quelques heures. L’arbre survivra au scandale."],
      ["Iriana", "Vous avez lu les conséquences avant les titres. C’est plus rare qu’il ne faudrait."],
      ["Hylee", "Vous auriez pu le dire au Conseil."],
    ],
    sangfroid: [
      ["Hylee", "On envoie une équipe légère aux remèdes et une autre sécuriser la citerne. Le noble attend."],
      ["Iriana", "Il enverra trois protestations."],
      ["Hylee", "Alors on les rangera avec les feuilles."],
    ],
    audace: [
      ["Hylee", "Je vais chercher la livraison médicale moi-même. Votre palais a assez de gens pour la citerne."],
      ["Iriana", "Vous venez d’attribuer une mission à ma garde."],
      ["Hylee", "Vous vouliez une réponse utilisable."],
    ],
  }, [
    ["Narrateur", "Iriana inscrit l’ordre retenu et tend deux billets scellés à un page."],
    ["Iriana", "Je connaissais la priorité. Votre manière d’y parvenir m’intéressait davantage."],
  ]);

  add("algratal-preparatifs:palais:plus-pli-mal-adresse", [
    ["Narrateur", "Un page essoufflé tend un pli à Hylee, prononce un nom inconnu et repart avant qu’elle puisse le rappeler."],
    ["Hylee", "Je viens d’être promue intendante ?"],
    ["Iriana", "La promotion serait brève. Ce sceau appartient aux cuisines militaires."],
    ["Hylee", "Vous avez vu l’erreur tout de suite."],
    ["Iriana", "Je voulais observer la suite."],
  ], {
    lucidite: [
      ["Hylee", "Le ruban porte une trace de farine. La destinataire travaille près des offices."],
      ["Iriana", "Vous utilisez les indices disponibles. Continuez par l’escalier de service."],
      ["Narrateur", "Hylee retrouve l’intendante avant que le page ne remarque sa faute."],
    ],
    sangfroid: [
      ["Hylee", "Je vais attendre son retour ici. Le pli restera fermé."],
      ["Iriana", "Une solution lente et sûre."],
      ["Hylee", "Vous dites cela avec beaucoup de déception."],
    ],
    audace: [
      ["Hylee", "Je vais demander mon chemin aux gardes. Quelqu’un finira bien par connaître cette intendante."],
      ["Iriana", "Vous annoncerez donc dans toute la galerie qu’un courrier impérial a été mal distribué."],
      ["Hylee", "Le page apprendra peut-être à attendre une réponse."],
    ],
  }, [
    ["Narrateur", "Le pli rejoint sa destinataire intact. Iriana récupère le reçu et le range sans commentaire."],
    ["Hylee", "Vous pourriez simplement dire que je n’ai rien cassé."],
  ]);

  add("algratal-preparatifs:palais:confidence-iriana-observer", [
    ["Narrateur", "La galerie s’est vidée. Iriana regarde encore les portes empruntées par les conseillers."],
    ["Hylee", "Vous les observez même quand ils partent."],
    ["Iriana", "Les courtisans contrôlent leur visage devant moi. Leur dos reçoit moins d’éducation."],
    ["Hylee", "Et moi, vous m’observez depuis quand ?"],
    ["Iriana", "Depuis avant que vous ne commenciez à vous en apercevoir."],
  ], {
    lucidite: [
      ["Hylee", "Vous cherchez surtout le moment où les gens oublient leur rôle."],
      ["Iriana", "Oui. Une personne révèle davantage en récupérant son manteau qu’en prêtant serment."],
      ["Narrateur", "Elle offre cette réponse sans détourner la question vers Hylee."],
    ],
    audace: [
      ["Hylee", "Alors dites-moi ce que vous avez conclu sur moi."],
      ["Iriana", "Vous avez peur de décevoir Remerii et beaucoup moins peur de me déplaire. Ce déséquilibre pourrait devenir utile."],
      ["Hylee", "Je ne sais pas si je dois prendre ça pour un compliment."],
    ],
    sangfroid: [
      ["Hylee", "Je suppose que vous ne répondez jamais avant d’avoir vu assez."],
      ["Iriana", "Je réponds lorsque le silence cesse de m’apprendre quelque chose."],
      ["Narrateur", "Hylee attend. Iriana finit par sourire, prise à son propre jeu."],
    ],
  }, [
    ["Iriana", "Votre spontanéité produit des erreurs. Elle produit aussi des événements que mes calculs n’avaient pas prévus."],
    ["Hylee", "Je vais choisir d’entendre la deuxième partie."],
  ]);

  add("algratal-preparatifs:avenues:ville-vivante", [
    ["Narrateur", "Hylee quitte les avenues officielles et suit l’odeur du pain. Derrière une bannière impériale, deux cuisiniers se disputent une marmite."],
    ["Cuisinière", "Si tu ajoutes encore du sel, tu la manges seul."],
    ["Hylee", "Pardon. Je cherchais la rue des appartements d’hôtes."],
    ["Cuisinier", "Alors tu es perdue depuis au moins trois escaliers."],
    ["Narrateur", "La capitale cesse soudain d’avoir la voix unique de ses gardes."],
  ], {
    lucidite: [
      ["Hylee", "Les livreurs passent par ici pour éviter les grandes marches, c’est ça ?"],
      ["Cuisinière", "Enfin quelqu’un qui regarde les roues des chariots plutôt que les statues."],
      ["Narrateur", "Elle lui indique un passage court et lui fait promettre de ne pas le montrer aux nobles."],
    ],
    resonance: [
      ["Narrateur", "Hylee suit les petites lampes enchantées qui changent de couleur au passage des employés."],
      ["Hylee", "Elles savent où chacun travaille."],
      ["Cuisinier", "Et elles savent surtout qui vole les desserts. Évite les rouges."],
    ],
    sangfroid: [
      ["Hylee", "Je peux revenir par la grande avenue. J’ai encore du temps."],
      ["Cuisinière", "Tu peux aussi manger quelque chose avant de repartir te perdre."],
      ["Narrateur", "Une tranche de pain chaud lui est imposée avec une générosité brusque."],
    ],
  }, [
    ["Narrateur", "Hylee rejoint les appartements par un couloir de service, du pain à la main et deux nouveaux noms en mémoire."],
    ["Hylee", "Al’Gratal est déjà beaucoup mieux sans les discours."],
  ]);

  add("algratal-preparatifs:avenues:plus-coursier-perdu", [
    ["Narrateur", "Un jeune coursier traverse la place pour la troisième fois. Il tient son billet à l’envers et fixe les enseignes mouvantes avec rancune."],
    ["Hylee", "Qu'est-ce que tu cherches ?"],
    ["Jeune coursier", "La rue des Verriers. Elle était là il y a une minute."],
    ["Hylee", "La rue a bougé ?"],
    ["Jeune coursier", "Les lettres. Elles changent quand je les regarde."],
  ], {
    lucidite: [
      ["Hylee", "Elles réagissent à la magie sylvinienne. Regarde les numéros gravés sous les plaques."],
      ["Jeune coursier", "Je pensais que c’était de la décoration."],
      ["Narrateur", "Ils reconstituent le chemin avec les chiffres et trouvent la rue derrière une colonnade."],
    ],
    resonance: [
      ["Hylee", "Je vais essayer de lire l’enchantement. Reste près de moi."],
      ["Narrateur", "Les enseignes cessent de se brouiller lorsque Hylee maintient un mince fil de magie entre eux."],
      ["Jeune coursier", "Tu pourrais faire ça pour toute la ville ?"],
    ],
    audace: [
      ["Hylee", "On demande à quelqu’un. Au pire, on aura l’air perdus à deux."],
      ["Jeune coursier", "J’essayais précisément d’éviter cette partie."],
      ["Hylee", "Trop tard, je viens de faire de grands signes au garde."],
    ],
  }, [
    ["Narrateur", "Le billet arrive à temps. Le coursier montre à Hylee le passage de service qui contourne les enseignes."],
    ["Jeune coursier", "Garde-le pour toi. Les rues officielles aiment compliquer la vie."],
  ]);

  add("algratal-preparatifs:appartements:retour-miraldas", [
    ["Narrateur", "Les cartes de Mir’Aldas débordent de la table. Remerii vérifie les distances sans jamais toucher le dessin du Dôme."],
    ["Hylee", "Tu parles de Mir’Aldas depuis le jour où je t’ai rencontrée. Maintenant qu’on y va, tu as l’air de chercher une sortie."],
    ["Remerii", "Je cherche un itinéraire."],
    ["Hylee", "Tu viens de mesurer trois fois le même pont."],
    ["Narrateur", "Remerii repose la règle. Son silence confirme au moins cette partie."],
  ], {
    lucidite: [
      ["Hylee", "Tu sais ce qui t’attend là-bas. Moi, je découvre tout. Dis-moi seulement ce qui risque de te faire mal."],
      ["Remerii", "Les gens qui se souviennent de ce que j’étais. Et ceux qui prétendront ne pas s’en souvenir."],
      ["Narrateur", "Elle prononce la phrase d’un ton égal, puis replie trop soigneusement un coin de carte."],
    ],
    audace: [
      ["Hylee", "Si quelqu’un te traite mal, je lui dirai ce que j’en pense."],
      ["Remerii", "Ton soutien me touche. Ton sens diplomatique m’inquiète davantage."],
      ["Hylee", "Je peux commencer poliment."],
    ],
    sangfroid: [
      ["Hylee", "On peut prévoir une première journée tranquille. Aucun ancien collègue, aucune cérémonie."],
      ["Remerii", "Tu viens d’organiser mon retour sans me demander la permission."],
      ["Hylee", "J’ai appris auprès des meilleurs."],
    ],
    resonance: [
      ["Hylee", "Quand je touche le dessin du Dôme, ta magie réagit."],
      ["Remerii", "Elle reconnaît un lieu où j’ai laissé trop de moi."],
      ["Narrateur", "Hylee retire sa main. Remerii la reprend et la pose elle-même sur la carte."],
    ],
  }, [
    ["Remerii", "Je rentrerai. Et tu seras avec moi. Voilà les deux faits utiles pour ce soir."],
    ["Narrateur", "La règle reste sur le côté. Elles parlent enfin du retour plutôt que du trajet."],
  ]);

  add("algratal-preparatifs:appartements:plus-repas-refroidi", [
    ["Narrateur", "Un plateau refroidit près des cartes. Remerii déplace la soupe pour dérouler un nouvel itinéraire."],
    ["Hylee", "Elle va finir par geler toute seule. Ce serait humiliant pour toi."],
    ["Remerii", "J’allais manger après cette vérification."],
    ["Hylee", "Tu as dit ça avant les deux précédentes."],
    ["Narrateur", "Remerii cherche une défense dans ses notes. Aucune carte ne lui en fournit."],
  ], {
    audace: [
      ["Narrateur", "Hylee roule la carte et pose le bol à sa place."],
      ["Remerii", "Tu viens de prendre une décision très autoritaire."],
      ["Hylee", "Mange. Tu pourras rédiger ma sanction avec le dessert."],
    ],
    sangfroid: [
      ["Hylee", "Dix minutes. Ensuite je t’aide à vérifier le reste."],
      ["Remerii", "Tu négocies une pause avec mon propre travail."],
      ["Hylee", "Et je t’offre de la compagnie. Mon marché est excellent."],
    ],
    lucidite: [
      ["Hylee", "Tu relis parce que Mir’Aldas t’inquiète. Une quatrième lecture ne changera pas ça."],
      ["Remerii", "Cette remarque aurait gagné à être moins exacte."],
      ["Narrateur", "Elle attire enfin le plateau vers elle."],
    ],
  }, [
    ["Narrateur", "Elles partagent le repas directement au-dessus d’une carte devenue nappe."],
    ["Remerii", "La soupe est froide."],
  ]);

  add("algratal-preparatifs:appartements:confidence-remerii-retour", [
    ["Narrateur", "Remerii retire de son sac une vieille clef de Mir’Aldas. Le métal porte la marque de ses doigts."],
    ["Hylee", "Tu l’as gardée pendant tout ce temps ?"],
    ["Remerii", "J’oublie parfois de jeter les objets inutiles."],
    ["Hylee", "Tu ne l’as jamais oubliée, celle-là."],
    ["Narrateur", "La clef disparaît dans la paume de Remerii. Elle renonce pourtant à la ranger."],
  ], {
    lucidite: [
      ["Hylee", "Tu avais une maison, des habitudes, des gens qui te connaissaient. Pourquoi tu n’en parles jamais ?"],
      ["Remerii", "Parce qu’ils connaissaient surtout l’élève brillante. J’ignore combien d’entre eux sauraient parler à la femme revenue."],
      ["Hylee", "Moi, je la connais un peu."],
    ],
    audace: [
      ["Hylee", "Fais-moi visiter ta ville. Les endroits que tu aimais, pas ceux qu’on montre aux visiteurs."],
      ["Remerii", "Tu risques de découvrir une jeunesse moins fascinante que prévu."],
      ["Hylee", "Parfait. J’ai déjà assez de mystères avec Saidin."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux garder les souvenirs difficiles. Raconte-moi seulement une journée normale."],
      ["Remerii", "Une journée normale… J’achetais des biscuits au citron après les cours et je prétendais que c’était pour étudier plus tard."],
      ["Narrateur", "Son sourire arrive sans permission et reste quelques secondes."],
    ],
  }, [
    ["Remerii", "Je te montrerai la pâtisserie, si elle existe encore."],
    ["Hylee", "Tu vois ? La clef sert déjà à quelque chose."],
  ]);

  add("camp-avant-croisee:feu:apres-cauchemar", [
    ["Narrateur", "Hylee se réveille avant l’aube. Remerii est assise près des braises, un livre fermé sur les genoux."],
    ["Hylee", "Tu n’as pas lu une seule page."],
    ["Remerii", "J’apprécie la couverture."],
    ["Hylee", "Tu montes la garde depuis mon cauchemar."],
    ["Narrateur", "Remerii pose le livre. Elle ne tente plus de nier."],
  ], {
    sangfroid: [
      ["Hylee", "J’ai encore peur de me rendormir. Je peux le dire sans que tu me surveilles jusqu’à demain."],
      ["Remerii", "Tu peux. Et je peux rester jusqu’à ce que cette peur baisse un peu."],
      ["Narrateur", "Hylee se rapproche du feu. Remerii lui tend la couverture qu’elle gardait près d’elle."],
    ],
    lucidite: [
      ["Hylee", "Le cauchemar mélangeait mon frère, le Dôme et quelque chose qui m’appelait. Je veux séparer tout ça."],
      ["Remerii", "Commence par les détails qui t’appartiennent. Nous examinerons le reste ensuite."],
      ["Hylee", "Tu dis cela depuis combien d’heures dans ta tête ?"],
    ],
    resonance: [
      ["Hylee", "Ma magie a réagi avant que je me réveille. Elle essayait de repousser le rêve."],
      ["Remerii", "Alors décris le froid. Sa direction, son rythme, l’endroit où il a commencé."],
      ["Narrateur", "La voix professorale revient, rassurante parce qu’Hylee la connaît par cœur."],
    ],
  }, [
    ["Remerii", "Tu n’as rien montré qui me donne envie de partir."],
    ["Narrateur", "Le cauchemar garde ses questions. Il perd toutefois le droit de les isoler l’une de l’autre."],
  ]);

  add("camp-avant-croisee:feu:plus-main-fatiguee", [
    ["Narrateur", "Remerii tend la main vers une bûche. Ses doigts tremblent, puis se referment aussitôt contre sa paume."],
    ["Hylee", "Je l’ai vu."],
    ["Remerii", "Tu as vu une main bouger."],
    ["Hylee", "Une main qui a veillé toute la nuit pendant que sa propriétaire admirait une couverture de livre."],
    ["Narrateur", "Remerii lui adresse un regard fatigué, encore assez précis pour protester."],
  ], {
    lucidite: [
      ["Hylee", "Tes yeux piquent, ta magie décroche par moments et tu viens de manquer le bois. Tu as besoin de dormir."],
      ["Remerii", "Ton diagnostic manque de délicatesse."],
      ["Hylee", "J’ai eu un excellent professeur."],
    ],
    sangfroid: [
      ["Hylee", "Je prends la prochaine veille. Tu restes à portée de voix si j’ai besoin de toi."],
      ["Remerii", "Une heure."],
      ["Hylee", "Deux. Je sais négocier aussi."],
    ],
    audace: [
      ["Narrateur", "Hylee retire le livre des genoux de Remerii et le pose hors de portée."],
      ["Remerii", "Tu abuses dangereusement de mon épuisement."],
      ["Hylee", "Tu pourras te venger après une sieste."],
    ],
  }, [
    ["Narrateur", "Remerii s’allonge près du feu avec une mauvaise grâce très étudiée."],
    ["Remerii", "Réveille-moi au moindre bruit. Un vrai bruit, Hylee."],
  ]);

  add("camp-avant-croisee:feu:confidence-remerii-peur", [
    ["Narrateur", "Une braise éclate. Remerii sursaute et resserre aussitôt sa prise sur le livre fermé."],
    ["Hylee", "Tu as eu peur."],
    ["Remerii", "J’ai réagi à un bruit soudain."],
    ["Hylee", "Tu emploies toujours des mots plus longs quand tu veux cacher quelque chose."],
    ["Narrateur", "Remerii regarde le feu. Sa réplique suivante tarde assez pour devenir une réponse."],
  ], {
    lucidite: [
      ["Hylee", "Tu connaissais ce genre de cauchemar avant moi ?"],
      ["Remerii", "Je connais le moment où l’on se réveille persuadée d’avoir perdu ce qu’on devait protéger."],
      ["Hylee", "Qui avais-tu peur de perdre ?"],
    ],
    audace: [
      ["Hylee", "Arrête de faire semblant que seule ma peur compte ici."],
      ["Remerii", "Tu choisis une méthode très agressive pour offrir du réconfort."],
      ["Hylee", "Elle fonctionne. Tu me réponds enfin."],
    ],
    sangfroid: [
      ["Hylee", "Tu n’es pas obligée de raconter. Tu peux simplement rester assise avec moi."],
      ["Narrateur", "Remerii relâche ses doigts autour du livre et pose sa main sur la couverture entre elles."],
      ["Remerii", "Cette proposition me paraît acceptable."],
    ],
  }, [
    ["Remerii", "Certaines peurs reviennent lorsque quelqu’un compte assez pour les réveiller."],
    ["Narrateur", "Elle ne précise rien. Hylee comprend néanmoins pourquoi Remerii est restée près du feu."],
  ]);

  add("camp-avant-croisee:lisiere:ecouter-dome", [
    ["Narrateur", "Une lueur violette filtre entre les arbres. Hylee ferme les yeux et sent une pression régulière contre sa magie."],
    ["Hylee", "Tu es loin, pourtant tu prends déjà toute la place."],
    ["Narrateur", "Medig hulule depuis une branche et incline la tête vers la lumière."],
    ["Hylee", "Oui, je parle au Dôme. Tu peux garder ça pour toi."],
  ], {
    resonance: [
      ["Narrateur", "Hylee laisse le courant magique effleurer ses défenses. Une multitude de signatures circulent derrière la barrière."],
      ["Hylee", "Il y a tellement de monde là-dedans…"],
      ["Narrateur", "Son vertige cède la place à une curiosité vive."],
    ],
    lucidite: [
      ["Hylee", "La pulsation revient toujours après six respirations. Le Dôme vérifie la forêt."],
      ["Narrateur", "Elle note le rythme sur un morceau de papier pour le comparer aux explications de Remerii."],
      ["Hylee", "Pour une fois, je veux lui apporter une observation avant la leçon."],
    ],
    sangfroid: [
      ["Narrateur", "La pression devient trop forte. Hylee recule et rouvre les yeux avant que sa magie ne s’y accroche."],
      ["Hylee", "D’accord. On fera connaissance de l’intérieur."],
      ["Narrateur", "Medig descend d’une branche, visiblement satisfait de cette prudence."],
    ],
  }, [
    ["Narrateur", "Hylee rejoint le camp avec un rythme en mémoire et l’impatience de franchir enfin le Dôme."],
    ["Hylee", "Demain, tu me laisseras entrer. Enfin, j’espère."],
  ]);

  add("camp-avant-croisee:lisiere:plus-traces-autour-camp", [
    ["Narrateur", "De petites empreintes font le tour du camp. Elles s’arrêtent près des sacs, repartent vers le feu, puis gagnent la lisière."],
    ["Hylee", "Tu étais curieux, toi."],
    ["Narrateur", "Aucune griffe n’a franchi la ligne de cendre. Rien ne manque."],
    ["Hylee", "Ou très poli."],
  ], {
    lucidite: [
      ["Narrateur", "Hylee compare la profondeur des traces. La créature marchait lentement et ne portait aucun poids."],
      ["Hylee", "Elle observait. Elle ne chassait pas."],
      ["Narrateur", "Une touffe de poils clairs reste accrochée à une racine, sans donner de réponse définitive."],
    ],
    resonance: [
      ["Narrateur", "Une magie légère persiste dans les pas, proche des enchantements du Dôme."],
      ["Hylee", "Quelqu’un de Mir’Aldas t’a envoyé ?"],
      ["Narrateur", "La trace s’efface sous ses doigts avant qu’elle puisse la suivre davantage."],
    ],
    sangfroid: [
      ["Narrateur", "Hylee avertit Remerii et renforce simplement la ligne de cendre pour la prochaine nuit."],
      ["Remerii", "Tu ne pars pas à sa poursuite ?"],
      ["Hylee", "Je progresse. Lentement, profite."],
    ],
  }, [
    ["Narrateur", "Les empreintes repartent vers Mir’Aldas. Elles laissent derrière elles une question, aucune menace immédiate."],
    ["Hylee", "On finira peut-être par se rencontrer de jour."],
  ]);

  add("camp-avant-croisee:bagages:lever-camp", [
    ["Narrateur", "Cordes, couvertures et ustensiles couvrent encore la moitié du camp. La route attend déjà."],
    ["Hylee", "Si on jette tout dans les sacs, Remerii va le sentir à deux kilomètres."],
    ["Remerii", "Je suis juste derrière toi."],
    ["Hylee", "Voilà, la démonstration est faite."],
    ["Narrateur", "Remerii lui laisse l’organisation avec une méfiance amusée."],
  ], {
    lucidite: [
      ["Hylee", "On commence par ce qui doit sécher. Le reste sera réparti pendant ce temps."],
      ["Remerii", "Logique. Tu as même pensé aux cordes humides."],
      ["Hylee", "Je me souviens encore de l’odeur du dernier sac."],
    ],
    sangfroid: [
      ["Hylee", "Une zone pour chaque paquetage. Personne ne ferme son sac avant la vérification commune."],
      ["Narrateur", "Le travail avance sans course inutile. Même les cendres sont dispersées correctement."],
      ["Remerii", "Je pourrais m’habituer à te voir commander un camp."],
    ],
    audace: [
      ["Hylee", "Je prends les couvertures et la cuisine. Tu effaces les traces magiques."],
      ["Remerii", "Tu viens de me donner un ordre."],
      ["Hylee", "Oui. Essaie, c’est reposant d’obéir parfois."],
    ],
  }, [
    ["Narrateur", "Le camp disparaît sans laisser d’objet ni foyer chaud derrière lui."],
    ["Remerii", "Travail propre. Je n’ajouterai aucune réserve, savoure également cet exploit."],
  ]);

  add("camp-avant-croisee:bagages:plus-fiole-fendue", [
    ["Narrateur", "Une odeur d’herbes monte d’une couverture. Une fiole s’est fendue et le remède s’infiltre déjà dans le tissu."],
    ["Hylee", "Oh non. Il en reste encore."],
    ["Remerii", "Alors ne bouge pas le paquet. Le verre est peut-être dans le pli."],
    ["Hylee", "Je voulais finir vite."],
    ["Remerii", "Le remède préfère que tu finisses avec tous tes doigts."],
  ], {
    lucidite: [
      ["Hylee", "La fissure est sur le côté. Je peux transvaser par le bouchon sans toucher le verre."],
      ["Narrateur", "Remerii maintient le tissu pendant qu’Hylee récupère presque tout le liquide."],
      ["Remerii", "Bien. Maintenant, nous cherchons pourquoi elle s’est cassée."],
    ],
    sangfroid: [
      ["Hylee", "On isole la couverture, on met des gants et on reprend lentement."],
      ["Remerii", "Voilà une phrase que j’aimerais entendre plus souvent."],
      ["Hylee", "Ne t’habitue pas trop vite."],
    ],
    resonance: [
      ["Hylee", "Je peux figer le remède juste assez pour retirer les morceaux."],
      ["Remerii", "Une pellicule seulement. Si tu congèles les plantes, elles perdront leur effet."],
      ["Narrateur", "Le froid d’Hylee retient le liquide pendant que Remerii extrait le verre."],
    ],
  }, [
    ["Narrateur", "Le remède est sauvé et les fioles sont replacées entre deux couches de tissu."],
    ["Hylee", "Je suppose que tu vas revoir mon rangement."],
  ]);
})();

(function registerForestPactAndExpeditionScenes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("foret-apres-pacte:clairiere:termes-pacte", [
    ["Naïah", "Avant que tu partes, on révise."],
    ["Valurn", "J'espérais un adieu émouvant. Je me suis même préparé à pleurer avec distinction."],
    ["Naïah", "Tu as obtenu une guide. Pas une servante, pas un bouclier et surtout pas quelqu'un à envoyer devant pour vérifier si ça mord."],
    ["Valurn", "J'avais compris la partie sur les morsures."],
    ["Naïah", "Je vérifie. Les gens comprennent beaucoup de choses jusqu'au moment où ça les arrange moins."],
  ], {
    observer: [
      ["Narrateur", "Valurn regarde la branche qu'elle fait tourner entre ses doigts. Elle attend une objection précise."],
      ["Valurn", "Tu choisis le chemin et tu peux interrompre le voyage. En échange, tu annonces un danger avant de me regarder marcher dedans."],
      ["Naïah", "Une fois. Après, ça devient une expérience scientifique."],
    ],
    agir: [
      ["Valurn", "Mes conditions : tu ne fouilles pas dans mes affaires et tu ne disparais pas au milieu d'un combat pour voir ce que je fais."],
      ["Naïah", "Tu ranges tes affaires ?"],
      ["Valurn", "Je savais que cette négociation révélerait des incompatibilités profondes."],
    ],
    temporiser: [
      ["Valurn", "Donne-moi plutôt les trois erreurs qui te feraient partir."],
      ["Naïah", "Me mentir mal, toucher aux arbres marqués et prononcer le mot confiance avec ta tête actuelle."],
      ["Valurn", "Je vais donc devoir trouver une autre tête."],
    ],
  }, [
    ["Narrateur", "Naïah grave trois encoches sur le bois, puis tend la branche à Valurn."],
    ["Naïah", "Si tu oublies, je te frappe avec le règlement."],
    ["Valurn", "Une administration enfin efficace."],
    ["Narrateur", "Le pacte tient désormais dans des limites que chacun a prononcées devant l'autre."],
  ]);

  add("foret-apres-pacte:clairiere:plus-offrande-animale", [
    ["Narrateur", "Un petit animal au pelage gris dépose un bouton de cuivre à la limite de la clairière."],
    ["Valurn", "Je ne voudrais pas vexer ton ambassadeur, mais son cadeau vient probablement d'une veste."],
    ["Naïah", "Il te donne ce qu'il a trouvé. La forêt veut voir si tu prends tout ce qui brille."],
    ["Valurn", "Elle me connaît déjà si bien."],
    ["Narrateur", "L'animal s'assoit à distance et fixe sa main."],
  ], {
    observer: [
      ["Narrateur", "Valurn examine le sol. Une seconde empreinte s'arrête près du bouton, plus lourde et récente."],
      ["Valurn", "Le cadeau sert aussi à me faire baisser les yeux."],
      ["Naïah", "Tu apprends. Lentement, mais ça reste attendrissant."],
    ],
    agir: [
      ["Narrateur", "Valurn ramasse le bouton et laisse à sa place une pièce sans valeur dans les Calciterres."],
      ["Valurn", "Un échange. Je tiens à ma réputation de marchand douteux."],
      ["Naïah", "Il va l'enterrer. J'aime déjà son jugement."],
    ],
    temporiser: [
      ["Narrateur", "Valurn s'accroupit sans toucher l'objet et attend que l'animal s'approche."],
      ["Valurn", "Je peux être patient."],
      ["Naïah", "Tu peux rester immobile. Ne confonds pas les exploits."],
    ],
  }, [
    ["Narrateur", "Le bouton finit dans la poche de Valurn ou retourne à son messager. Naïah retient surtout qu'il a regardé avant de prendre."],
    ["Valurn", "Est-ce que chaque promenade comporte un examen ?"],
    ["Naïah", "Seulement quand tu crois qu'il n'y en a pas."],
  ]);

  add("foret-apres-pacte:ruines:marque-chaos", [
    ["Narrateur", "Sous la mousse, une marque du Chaos palpite à l'approche de Valurn."],
    ["Valurn", "Je ne te connais pas, ce qui ne t'empêche manifestement pas de connaître mon sang."],
    ["Naïah", "Ne la touche pas."],
    ["Valurn", "Tu viens de rendre l'idée beaucoup plus séduisante."],
    ["Naïah", "Je peux aussi te casser les doigts. Pour diminuer la tentation."],
  ], {
    observer: [
      ["Narrateur", "Valurn suit les lignes sans entrer dans le cercle. Deux glyphes ont été ajoutés bien après les autres."],
      ["Valurn", "Quelqu'un a réparé le sceau avec une magie plus jeune."],
      ["Naïah", "Quelqu'un qui tenait à garder ce qui dort dessous."],
    ],
    agir: [
      ["Narrateur", "Il approche une lame du bord. La marque mord le métal et le noircit jusqu'à la garde."],
      ["Valurn", "Voilà une réponse franche."],
      ["Naïah", "Je t'avais proposé la version avec tes doigts intacts."],
    ],
    temporiser: [
      ["Valurn", "Je relève le dessin et nous laissons le reste dormir."],
      ["Naïah", "Tu peux vraiment repartir sans ouvrir ?"],
      ["Valurn", "J'aurai besoin de plusieurs témoins pour défendre cette rumeur."],
    ],
  }, [
    ["Narrateur", "Le relevé rejoint la poche intérieure de Valurn. Le sceau continue de battre sous la pierre."],
    ["Naïah", "Tu reviendras."],
    ["Valurn", "Probablement. La curiosité est l'un de mes vices les moins coûteux."],
  ]);

  add("foret-apres-pacte:ruines:plus-racine-fragment", [
    ["Narrateur", "Une racine épaisse serre un fragment violet entre ses fibres. La lumière tente de s'échapper à chaque mouvement du bois."],
    ["Valurn", "La forêt collectionne donc les objets dangereux."],
    ["Naïah", "Elle a commencé avant moi. Je lui ai seulement appris à mieux les cacher."],
    ["Narrateur", "Le fragment répond faiblement à la magie de Valurn."],
  ], {
    observer: [
      ["Narrateur", "Il suit la racine jusqu'à une pierre fendue. Le bois draine lentement l'énergie du fragment."],
      ["Valurn", "Elle le neutralise."],
      ["Naïah", "Ou elle le mange. Les deux solutions me conviennent."],
    ],
    agir: [
      ["Narrateur", "Valurn glisse sa lame sous une fibre. La racine se resserre et des épines apparaissent autour de son poignet."],
      ["Naïah", "Encore un peu et elle te garde aussi."],
      ["Valurn", "Je suis flatté, mais déjà engagé dans une relation compliquée avec cette forêt."],
    ],
    temporiser: [
      ["Valurn", "Je peux lui laisser son repas et revenir vérifier ce qu'il en reste."],
      ["Naïah", "Tu demandes la permission à une racine ?"],
      ["Valurn", "Je tiens à varier les personnes qui me refusent quelque chose."],
    ],
  }, [
    ["Narrateur", "Valurn marque discrètement l'emplacement sans arracher le fragment."],
    ["Naïah", "Tu commences à comprendre que tout ici ne t'attend pas."],
    ["Valurn", "Je le savais. J'espérais seulement être l'exception la mieux habillée."],
  ]);

  add("foret-apres-pacte:lisiere:au-revoir", [
    ["Narrateur", "La brume s'ouvre sur les terres impériales. Naïah s'arrête deux pas avant la limite."],
    ["Valurn", "Tu ne viens pas admirer ma sortie ? Je l'avais répétée."],
    ["Naïah", "Je t'ai déjà vu marcher. Il reste beaucoup de travail."],
    ["Narrateur", "Aucun des deux ne bouge pendant quelques secondes."],
    ["Valurn", "Notre prochain rendez-vous aura donc lieu quand tu auras besoin de quelque chose."],
    ["Naïah", "Ou quand je m'ennuierai. C'est plus dangereux."],
  ], {
    observer: [
      ["Valurn", "Tu as prévu de me suivre dès que je tournerai le dos."],
      ["Naïah", "J'avais prévu de te laisser croire que je le ferais."],
      ["Narrateur", "Son sourire confirme seulement qu'elle avait prévu cette réponse aussi."],
    ],
    agir: [
      ["Valurn", "La prochaine fois, apporte des tartelettes et une menace plus originale."],
      ["Naïah", "La prochaine fois, apporte quelqu'un de plus intéressant."],
      ["Valurn", "Tu places la barre à une hauteur cruelle."],
    ],
    temporiser: [
      ["Valurn", "Je ne vais pas te demander quand nous nous reverrons."],
      ["Naïah", "Bien. J'aurais menti."],
      ["Valurn", "Alors je me contenterai de garder du vin pour deux."],
    ],
  }, [
    ["Narrateur", "Valurn franchit la lisière. La brume se referme derrière lui."],
    ["Naïah", "Valurn."],
    ["Narrateur", "Il se retourne. Elle a déjà disparu."],
    ["Valurn", "Un adieu impeccable. Presque insultant."],
  ]);

  add("foret-apres-pacte:lisiere:plus-pas-derriere", [
    ["Narrateur", "Des pas légers accompagnent Valurn. Ils s'arrêtent à chaque fois qu'il ralentit."],
    ["Valurn", "Naïah, si tu essaies d'être discrète, ton sens du rythme te trahit."],
    ["Narrateur", "Aucune réponse. Une branche craque sur sa gauche, puis une autre plus loin."],
    ["Valurn", "Et si tu n'es pas Naïah, je te préviens : elle déteste qu'on copie ses plaisanteries."],
  ], {
    observer: [
      ["Narrateur", "Valurn regarde les ombres au sol plutôt que les arbres. Une silhouette basse passe derrière lui sans forme nette."],
      ["Valurn", "Ni une bête, ni une enfant. Tu compliques les présentations."],
      ["Narrateur", "La silhouette recule lorsque la lumière atteint la lisière."],
    ],
    agir: [
      ["Narrateur", "Valurn pivote et projette une flamme au-dessus du sentier. La lumière révèle trois traces, puis plus rien."],
      ["Valurn", "Je voulais seulement voir ton visage."],
      ["Narrateur", "Un souffle amusé traverse les feuilles, trop grave pour Naïah."],
    ],
    temporiser: [
      ["Narrateur", "Il continue sans se retourner et modifie volontairement son allure."],
      ["Valurn", "Si tu me suis jusqu'à l'Empire, tu devras remplir des formulaires."],
      ["Narrateur", "Les pas cessent net, ce qui lui arrache un rire malgré la tension."],
    ],
  }, [
    ["Narrateur", "La présence reste derrière la frontière invisible de la forêt."],
    ["Valurn", "Tu pouvais m'arrêter. Tu as préféré regarder."],
    ["Narrateur", "Il reprend la route en gardant cette décision dans un coin de son esprit."],
  ]);

  add("algratal-avant-expedition:camp-forthaven:aider-camp", [
    ["Draven", "Ces listes disent que nous avons reçu douze tentes. J'en vois huit."],
    ["Intendant", "Le registre impérial en confirme douze."],
    ["Hylee", "Peut-être que quatre sont très bien cachées."],
    ["Draven", "Si elles savent se cacher seules, je les recrute comme éclaireuses."],
    ["Narrateur", "Deux chariots attendent encore d'être ouverts et les soldats déplacent les mêmes caisses depuis une heure."],
  ], {
    lucidite: [
      ["Hylee", "Les numéros sautent de sept à douze. Les quatre caisses manquantes n'ont jamais quitté le dépôt."],
      ["Draven", "Enfin un chiffre qui avoue quelque chose."],
      ["Intendant", "Je fais envoyer un chariot."],
    ],
    audace: [
      ["Hylee", "On ouvre les deux chariots et on refait l'inventaire devant tout le monde."],
      ["Draven", "Vous avez entendu. Et celui qui déplace encore une caisse sans la noter la portera jusqu'à Akuhn'Nabad."],
      ["Narrateur", "Les cordes sont coupées avec un empressement soudain."],
    ],
    sangfroid: [
      ["Hylee", "On arrête les déplacements cinq minutes. Une personne lit, une personne compte, les autres ne touchent plus à rien."],
      ["Draven", "Simple. Presque insultant pour les quinze idiots qui n'y ont pas pensé."],
      ["Narrateur", "Le camp se fige, puis l'inventaire commence enfin à correspondre au terrain."],
    ],
  }, [
    ["Narrateur", "Les tentes manquantes sont retrouvées au dépôt et les fournitures reçoivent un marquage unique."],
    ["Draven", "Garde cette liste. Elle vaut davantage que le parchemin officiel."],
    ["Hylee", "Je la protège au péril de ma vie."],
    ["Draven", "Évite. J'ai déjà assez de rapports à écrire."],
  ]);

  add("algratal-avant-expedition:camp-forthaven:plus-pari-recrues", [
    ["Première recrue", "Trois jours avant qu'elle demande à rentrer."],
    ["Seconde recrue", "Deux. La forêt ne fait pas de faveur aux apprenties."],
    ["Draven", "Vous parlez assez fort pour perdre votre solde sans même placer la mise."],
    ["Narrateur", "Les deux soldats se raidissent. Draven regarde Hylee et attend."],
    ["Hylee", "Je peux répondre ?"],
    ["Draven", "Je comptais être généreux et te laisser choisir leur douleur."],
  ], {
    audace: [
      ["Hylee", "Je parie dix pièces que je serai encore debout quand l'un de vous me demandera de l'aide."],
      ["Première recrue", "Dix ?"],
      ["Draven", "Acceptez. J'ai envie de voir combien coûte votre stupidité."],
    ],
    sangfroid: [
      ["Hylee", "Gardez vos pièces. Sur le terrain, regardez ce que je fais avant de décider ce que je vaux."],
      ["Narrateur", "La seconde recrue baisse les yeux la première."],
      ["Draven", "Vous venez de recevoir une leçon gratuite. Profitez-en, les suivantes seront physiques."],
    ],
    lucidite: [
      ["Hylee", "Vous pariez sur moi parce que vous avez peur de la mission ou parce que je suis humaine ?"],
      ["Narrateur", "Le silence répond avant eux."],
      ["Hylee", "D'accord. Au moins, je sais quel pari je veux gagner."],
    ],
  }, [
    ["Première recrue", "On peut changer la mise ?"],
    ["Draven", "Oui. Maintenant, vous pariez sur lequel de vous deux s'excusera le premier."],
    ["Narrateur", "La plaisanterie circule dans le camp. Elle vise désormais les recrues, pas la place d'Hylee dans l'expédition."],
  ]);

  add("algratal-avant-expedition:camp-forthaven:confidence-draven-forthaven", [
    ["Narrateur", "Draven plante un piquet d'un coup de masse et vérifie la tension de la toile."],
    ["Hylee", "Tu fais toujours ça toi-même ?"],
    ["Draven", "Quand une tente me tombe dessus, je préfère savoir qui insulter."],
    ["Hylee", "Forthaven te manque ?"],
    ["Narrateur", "Il teste une seconde corde avant de répondre."],
  ], {
    lucidite: [
      ["Hylee", "Quand tu en parles, tu cites les quais, les remparts, les réserves. Jamais ce que tu aimes là-bas."],
      ["Draven", "J'aime que les portes grincent toujours au même endroit. J'aime les tavernes trop bruyantes et les gens qui me disent quand je déconne."],
      ["Hylee", "C'est déjà plus vivant qu'un rapport."],
    ],
    audace: [
      ["Hylee", "Tu pourrais simplement dire que tu veux rentrer."],
      ["Draven", "Je veux rentrer."],
      ["Narrateur", "Il hausse les épaules, presque contrarié par la facilité de l'aveu."],
      ["Draven", "Voilà. N'en fais pas une chanson."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux me raconter un endroit. Pas l'Amiral, juste toi."],
      ["Draven", "Il y a un escalier derrière l'arsenal. Au coucher du soleil, on voit tout le port. Ma femme m'y apportait à manger quand je refusais de quitter les rondes."],
      ["Narrateur", "Sa main reste posée sur la corde sans la retendre."],
    ],
  }, [
    ["Draven", "Forthaven tient parce que des gens s'y lèvent chaque matin. Les murs sont seulement la partie facile à dessiner."],
    ["Hylee", "Tu me montreras l'escalier ?"],
    ["Draven", "Si on rentre avec assez de jambes pour le monter."],
    ["Narrateur", "Il lui tend la masse et passe au piquet suivant."],
  ]);

  add("algratal-avant-expedition:palais:triage-imperial", [
    ["Narrateur", "Trois piles couvrent le bureau d'Iriana. Une quatrième se forme déjà dans les bras d'un secrétaire."],
    ["Iriana", "Urgent, important, ou rédigé par quelqu'un qui pense que son nom remplace les deux."],
    ["Hylee", "Et la quatrième pile ?"],
    ["Iriana", "Les requêtes dont l'auteur souhaite que je devine le problème. Je les trouve particulièrement stimulantes."],
    ["Narrateur", "Elle pousse le sceau de triage vers Hylee."],
  ], {
    lucidite: [
      ["Hylee", "Cette demande de grain mentionne une fête, mais la quantité nourrit un quartier entier."],
      ["Iriana", "Le quartier accueille les familles du détachement. Placez-la avec le ravitaillement militaire et ne corrigez pas le titre."],
      ["Hylee", "Pour que l'auteur puisse sauver les apparences ?"],
      ["Iriana", "Pour qu'il recommence la prochaine fois."],
    ],
    sangfroid: [
      ["Hylee", "Je traite d'abord les demandes qui expirent aujourd'hui. Les titres attendront."],
      ["Iriana", "Vous venez de reléguer deux ducs sous une livraison de couvertures."],
      ["Hylee", "Les ducs ont déjà des couvertures."],
      ["Narrateur", "Iriana incline la tête et lui remet la pile suivante."],
    ],
    audace: [
      ["Hylee", "Celle-ci demande vingt gardes pour déplacer une statue. Je refuse."],
      ["Iriana", "Vous ne disposez pas de cette autorité."],
      ["Hylee", "Alors je la place devant toi avec un mot très gros : non."],
      ["Iriana", "Une méthode administrativement discutable. Gardez le mot."],
    ],
  }, [
    ["Narrateur", "La pile urgente diminue. Les requêtes liées au départ atteignent enfin les bureaux capables d'agir."],
    ["Iriana", "Vous avez épargné deux heures à mes secrétaires et offensé une statue."],
    ["Hylee", "Je supporte le poids de cette faute."],
    ["Narrateur", "Iriana lui laisse le sceau pour la pile suivante."],
  ]);

  add("algratal-avant-expedition:palais:plus-sceau-manquant", [
    ["Secrétaire", "Le convoi attend. Sans le sceau de l'intendance, les portes ne s'ouvriront pas."],
    ["Iriana", "L'intendant a quitté le palais il y a une heure."],
    ["Hylee", "On peut le faire revenir ?"],
    ["Iriana", "Oui. Le convoi perdra la lumière du jour et sa route sûre."],
    ["Narrateur", "L'ordre porte déjà la signature d'Iriana. Il lui manque seulement la preuve que la procédure a été suivie."],
  ], {
    lucidite: [
      ["Hylee", "Le registre mentionne son adjoint. Il peut apposer un contre-sceau en cas d'absence."],
      ["Secrétaire", "Personne ne lui confie jamais cette fonction."],
      ["Iriana", "Alors il sera ravi de découvrir aujourd'hui pourquoi elle existe."],
    ],
    sangfroid: [
      ["Hylee", "On consigne l'heure, les témoins et l'absence de l'intendant. Puis on demande au poste de garde de valider le passage."],
      ["Iriana", "La route conservera une trace complète de l'exception."],
      ["Narrateur", "Le secrétaire prépare un feuillet au lieu de chercher un raccourci invisible."],
    ],
    audace: [
      ["Hylee", "Appose ton sceau personnel et joins un ordre de vérification au retour."],
      ["Iriana", "On m'accusera de contourner mon propre appareil."],
      ["Hylee", "Oui, avec un convoi arrivé à temps et des registres qu'ils pourront vérifier."],
      ["Narrateur", "Iriana prend la cire sans détourner les yeux d'Hylee."],
    ],
  }, [
    ["Narrateur", "Le document part avec deux signatures et une exception impossible à dissimuler."],
    ["Iriana", "La vitesse attire moins mon estime que les décisions capables de survivre à leur examen."],
    ["Hylee", "Ça ressemble presque à un compliment."],
    ["Iriana", "Vous gâchez déjà l'instant."],
  ]);

  add("algratal-avant-expedition:palais:confidence-iriana-cage", [
    ["Narrateur", "Un maître d'étiquette entre, replace le poignet d'Iriana d'un geste familier et corrige l'angle de son menton."],
    ["Maître d'étiquette", "Votre Altesse se fatigue. Cela se voit."],
    ["Iriana", "Merci d'avoir signalé cette faute de goût."],
    ["Narrateur", "Il s'incline et sort. Iriana garde la posture exacte jusqu'à ce que la porte se referme."],
    ["Hylee", "Il fait souvent ça ?"],
  ], {
    lucidite: [
      ["Hylee", "Tu l'as laissé corriger ton poignet alors que tu connaissais déjà la position."],
      ["Iriana", "Le geste le rassure. Un serviteur rassuré rapporte une princesse docile."],
      ["Hylee", "Tu utilises même la règle qui t'enferme."],
      ["Iriana", "Je préfère connaître chaque barreau."],
    ],
    audace: [
      ["Hylee", "Tu pourrais lui dire d'arrêter."],
      ["Iriana", "Je le pourrais. Demain, ma grand-mère recevrait trois témoignages sur mon instabilité."],
      ["Hylee", "C'est absurde."],
      ["Iriana", "L'absurde devient une arme très sérieuse lorsqu'une cour entière accepte de le répéter."],
    ],
    sangfroid: [
      ["Hylee", "Tu veux t'asseoir autrement pendant qu'il ne regarde pas ?"],
      ["Narrateur", "Iriana la fixe, puis ramène une jambe sous elle dans le fauteuil."],
      ["Iriana", "Vous ne raconterez jamais cela."],
      ["Hylee", "Je ne sais pas de quoi tu parles."],
    ],
  }, [
    ["Iriana", "Ces règles m'ont protégée. Elles m'ont aussi appris à disparaître sans quitter une pièce."],
    ["Narrateur", "Elle défait enfin le bouton trop serré de sa manche."],
    ["Iriana", "Ne prenez pas ce relâchement pour une victoire. Considérez-le comme une expérience sous surveillance."],
    ["Hylee", "Très bien. Je surveille."],
  ]);

  add("algratal-avant-expedition:marche:dernier-achat", [
    ["Marchand", "Huit pièces la fiole. Les brumes se sont épaissies, vous comprenez."],
    ["Valurn", "Hier, elles coûtaient quatre pièces et les brumes étaient déjà d'une humeur exécrable."],
    ["Marchand", "La demande a changé."],
    ["Hylee", "La peur aussi, visiblement."],
    ["Narrateur", "Remerii vérifie le sceau de protection pendant que Valurn sourit au vendeur avec une douceur peu rassurante."],
  ], {
    lucidite: [
      ["Hylee", "Trois fioles portent le même numéro de lot que celles vendues hier. Leur coût n'a pas changé."],
      ["Valurn", "Tu entends ? Même tes mensonges possèdent une comptabilité."],
      ["Marchand", "Six pièces."],
    ],
    audace: [
      ["Hylee", "Quatre pièces ou nous expliquons à tout le marché que le sceau de la deuxième fiole est fissuré."],
      ["Marchand", "Vous menacez ma réputation ?"],
      ["Valurn", "Elle t'offre l'occasion de la conserver. Je trouve ça presque tendre."],
    ],
    sangfroid: [
      ["Hylee", "Nous prenons seulement deux fioles aujourd'hui. Le reste viendra d'un autre atelier."],
      ["Narrateur", "Elle se détourne. Le marchand les rappelle avant le troisième pas."],
      ["Valurn", "La dignité commerciale tient rarement plus loin que le client."],
    ],
  }, [
    ["Narrateur", "Le groupe repart avec des fioles sûres et assez de pièces pour compléter les provisions."],
    ["Valurn", "Tu négocies bien. Encore quelques années et tu ruineras des gens avec grâce."],
    ["Hylee", "Je préférerais acheter des tartelettes."],
    ["Valurn", "Toutes les grandes ambitions commencent modestement."],
  ]);

  add("algratal-avant-expedition:marche:plus-connaissance-valurn", [
    ["Vendeur", "Seigneur Saël. Je ne pensais pas vous revoir à Al'Gratal."],
    ["Narrateur", "Valurn ne perd pas son sourire. Il cesse seulement de cligner des yeux."],
    ["Valurn", "Vous me confondez avec un parent respectable. C'est vexant pour nous deux."],
    ["Vendeur", "Pardonnez-moi. Une ressemblance."],
    ["Hylee", "Une ressemblance avec le nom exact ?"],
  ], {
    lucidite: [
      ["Hylee", "Il a regardé ta main avant de parler. Il a reconnu ta bague, pas ton visage."],
      ["Valurn", "Tu deviens dangereusement attentive."],
      ["Narrateur", "Le vendeur recule d'un pas et cache ses propres doigts sous le comptoir."],
    ],
    audace: [
      ["Hylee", "Qui est Seigneur Saël ?"],
      ["Valurn", "Un homme charmant, selon les personnes qu'il a payées pour le dire."],
      ["Hylee", "Et selon toi ?"],
      ["Valurn", "Un nom que j'ai laissé dans les Calciterres avec plusieurs mauvaises habitudes."],
    ],
    sangfroid: [
      ["Hylee", "On peut partir. Il a déjà compris qu'il avait trop parlé."],
      ["Valurn", "Tu renonces à l'interrogatoire ?"],
      ["Hylee", "Je préfère te poser la question quand tu n'auras pas un public à divertir."],
      ["Narrateur", "Son sourire vacille, touché juste derrière la plaisanterie."],
    ],
  }, [
    ["Valurn", "Saël est un titre ancien. Il ouvrait des portes dont je préfère aujourd'hui vérifier les gonds."],
    ["Hylee", "C'est toute la réponse ?"],
    ["Valurn", "Pour cette rue, oui. Trouve un meilleur vin et je deviendrai peut-être moins prudent."],
  ]);

  add("algratal-avant-expedition:marche:confidence-valurn-calciterres", [
    ["Narrateur", "Un enfant démoniaque chaparde une pomme et disparaît entre deux étals. Valurn suit sa course jusqu'à la ruelle."],
    ["Hylee", "Tu vas prévenir le marchand ?"],
    ["Valurn", "Pour une pomme ? Il survivra à cette tragédie."],
    ["Hylee", "Tu faisais pareil ?"],
    ["Valurn", "Non. J'étais un enfant exemplaire. Je volais des choses plus chères."],
  ], {
    lucidite: [
      ["Hylee", "Tu regardes surtout s'il est poursuivi."],
      ["Valurn", "Dans les Calciterres, un enfant qui court seul apprend vite qui compte ses pas."],
      ["Hylee", "Ton père ?"],
      ["Valurn", "Mon père comptait tout. Les fautes, les dettes, les marques de faiblesse."],
    ],
    audace: [
      ["Hylee", "Tu avais peur de lui ?"],
      ["Valurn", "Constamment. J'ai ensuite donné à cette peur de très belles vestes et un excellent vocabulaire."],
      ["Narrateur", "Il plaisante encore, mais ses doigts ont cessé de jouer avec sa pièce."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux garder le reste."],
      ["Valurn", "Quelle déception. J'avais préparé une enfance édifiante avec trois monstres et une morale."],
      ["Hylee", "Tu me la raconteras quand tu n'auras plus besoin de la rendre drôle."],
      ["Narrateur", "Il la regarde sans trouver immédiatement une réplique."],
    ],
  }, [
    ["Narrateur", "L'enfant ressort de la ruelle et tend la moitié de la pomme à une plus petite silhouette."],
    ["Valurn", "Là-bas, partager pouvait vous affaiblir aux yeux des autres. Certains le faisaient quand même."],
    ["Hylee", "Toi aussi ?"],
    ["Valurn", "Je t'ai déjà offert du vin. Ne deviens pas avide de preuves."],
  ]);

  add("algratal-avant-expedition:appartements:retrouvailles-naiah", [
    ["Narrateur", "Hylee ouvre la porte de sa chambre et trouve Naïah allongée en travers du lit, une pomme dans chaque main."],
    ["Hylee", "Tu aurais pu frapper."],
    ["Naïah", "J'ai frappé. Personne n'a répondu, alors j'ai utilisé une méthode plus efficace."],
    ["Hylee", "J'étais derrière la porte."],
    ["Naïah", "Tu vois ? La méthode a fonctionné."],
    ["Narrateur", "Elle lance une pomme à Hylee sans quitter son oreiller."],
  ], {
    lucidite: [
      ["Hylee", "Tu n'es pas venue seulement pour voler mon lit."],
      ["Naïah", "J'ai aussi volé les pommes."],
      ["Hylee", "Naïah."],
      ["Naïah", "Je voulais vérifier si tu me parlerais encore pareil après avoir vu ma forêt."],
    ],
    audace: [
      ["Hylee", "Décale-toi. Si tu envahis mon lit, tu partages la couverture."],
      ["Naïah", "Tu n'as même pas peur ?"],
      ["Hylee", "J'ai peur pour mes pommes."],
      ["Narrateur", "Naïah se pousse, visiblement satisfaite par cette priorité."],
    ],
    resonance: [
      ["Hylee", "Tes ombres touchent toutes les sorties."],
      ["Naïah", "Elles aiment savoir comment partir."],
      ["Hylee", "Elles peuvent rester. Toi aussi."],
      ["Narrateur", "Une ombre quitte lentement la poignée de la fenêtre."],
    ],
  }, [
    ["Naïah", "Alors, raconte. Qu'est-ce qui t'est arrivé pendant que je devenais mystérieuse et redoutable ?"],
    ["Hylee", "Tu étais déjà redoutable à l'auberge."],
    ["Naïah", "Oui, mais personne ne respectait mon travail."],
    ["Narrateur", "La mission attend quelques minutes pendant qu'elles échangent enfin des histoires inutiles."],
  ]);

  add("algratal-avant-expedition:appartements:plus-bruit-palais-naiah", [
    ["Narrateur", "Naïah ouvre la fenêtre, la referme, traverse la chambre et ouvre la porte."],
    ["Hylee", "Tu cherches quelque chose ?"],
    ["Naïah", "Un endroit qui ne chuchote pas derrière les murs."],
    ["Narrateur", "Dans le couloir, des pas se multiplient. Par la fenêtre, la magie du palais bourdonne sans pause."],
    ["Naïah", "Comment vous dormez ici ? Tout ment à voix basse."],
  ], {
    resonance: [
      ["Hylee", "La vieille galerie a un courant d'air naturel. La magie y passe moins."],
      ["Naïah", "Tu connais un trou dans le palais ?"],
      ["Hylee", "Je préfère dire une respiration architecturale."],
      ["Naïah", "Tu fréquentes trop Iriana."],
    ],
    sangfroid: [
      ["Hylee", "Choisis un bruit. Je fermerai les autres avec un écran léger."],
      ["Naïah", "La cour. Les soldats ne savent pas mentir avec leurs bottes."],
      ["Narrateur", "Hylee atténue le couloir et laisse entrer les appels du camp par la fenêtre."],
    ],
    audace: [
      ["Hylee", "Viens, on monte sur le toit."],
      ["Naïah", "C'est interdit ?"],
      ["Hylee", "Je n'ai pas vérifié."],
      ["Naïah", "Tu apprends tellement vite."],
    ],
  }, [
    ["Narrateur", "Elles trouvent un endroit où chaque son possède une origine visible."],
    ["Naïah", "Je vais rester un peu."],
    ["Hylee", "Je n'allais pas te chasser."],
    ["Naïah", "Je sais. C'est pour ça que je l'annonce au lieu de disparaître."],
  ]);

  add("algratal-avant-expedition:appartements:confidence-naiah-tests", [
    ["Narrateur", "Naïah fait tenir une cuillère en équilibre au bord d'une tasse. Chaque fois qu'Hylee la rattrape, elle la repousse un peu plus loin."],
    ["Hylee", "Tu essaies de la faire tomber ou de voir combien de fois je vais la sauver ?"],
    ["Naïah", "Les deux. Tu as mis longtemps à demander."],
    ["Hylee", "Tu fais ça avec tout le monde."],
    ["Naïah", "Les cuillères ? Rarement."],
  ], {
    lucidite: [
      ["Hylee", "Tu pousses jusqu'à trouver le moment où les gens arrêtent de faire semblant."],
      ["Naïah", "Avant, ils sourient, promettent, expliquent. Après, ils montrent ce qu'ils voulaient vraiment."],
      ["Hylee", "Et si tu les pousses toi-même jusqu'au bord ?"],
      ["Narrateur", "La cuillère vacille entre elles."],
    ],
    audace: [
      ["Hylee", "Tu veux ma vraie réaction ? Ça m'énerve. Et je resterai quand même."],
      ["Naïah", "Tu pourrais partir pour me donner une leçon."],
      ["Hylee", "Tu transformerais ça en preuve que tu avais raison."],
      ["Naïah", "Tu deviens très agaçante."],
    ],
    sangfroid: [
      ["Hylee", "Je ne vais pas rattraper la cuillère cette fois."],
      ["Narrateur", "Naïah attend. Au dernier instant, sa propre ombre retient le manche."],
      ["Hylee", "Tu ne voulais pas vraiment qu'elle tombe."],
      ["Naïah", "Je voulais savoir si toi, tu le voulais."],
    ],
  }, [
    ["Naïah", "Quand quelqu'un supporte trois pièges, je peux croire qu'il restera peut-être devant le quatrième."],
    ["Hylee", "Tu pourrais aussi demander."],
    ["Naïah", "C'est beaucoup moins fiable et affreusement adulte."],
    ["Narrateur", "Elle remet la cuillère dans la tasse au lieu de la pousser encore."],
  ]);

  add("algratal-avant-expedition:toits:parler-temps", [
    ["Narrateur", "Saidin observe les routes qui quittent Al'Gratal. Depuis le toit, elles se croisent avant de disparaître sous les murs."],
    ["Hylee", "Tu vois vraiment plusieurs futurs quand tu regardes une route ?"],
    ["Saidin", "Je vois surtout plusieurs voyageurs persuadés d'être les seuls à choisir."],
    ["Hylee", "C'est encore une réponse qui refuse de s'asseoir."],
    ["Saidin", "Les réponses assises voyagent mal."],
  ], {
    lucidite: [
      ["Hylee", "Demain, quelle décision ferme le plus de chemins ?"],
      ["Saidin", "Celle que vous prendrez en croyant pouvoir la corriger plus tard."],
      ["Hylee", "Tu sais laquelle ?"],
      ["Saidin", "J'en crains plusieurs. La crainte ressemble parfois au savoir lorsqu'on la regarde de loin."],
    ],
    sangfroid: [
      ["Hylee", "Alors je ne te demande pas une prédiction. Dis-moi seulement ce qu'il faut protéger."],
      ["Saidin", "Votre capacité à vous parler après avoir eu peur."],
      ["Narrateur", "Il répond sans détour, ce qui inquiète Hylee davantage que ses énigmes."],
    ],
    resonance: [
      ["Hylee", "La magie autour de toi tire dans plusieurs directions."],
      ["Saidin", "Elle se souvient de décisions qui n'ont pas encore trouvé leur place."],
      ["Hylee", "Tu pourrais parler plus simplement."],
      ["Saidin", "Je pourrais aussi te donner tort plus clairement."],
    ],
  }, [
    ["Saidin", "Connaître une issue ne donne aucun droit sur les pas qui y conduisent."],
    ["Hylee", "C'est pour ça que tu nous laisses choisir même quand tu penses savoir ?"],
    ["Saidin", "Surtout lorsque je pense savoir."],
    ["Narrateur", "En bas, un chariot prend une route que Saidin n'avait pas regardée."],
  ]);

  add("algratal-avant-expedition:toits:plus-message-sans-destinataire", [
    ["Narrateur", "Saidin retire un billet plié sous une tuile. Aucun nom n'apparaît sur la face extérieure."],
    ["Hylee", "C'est pour toi ?"],
    ["Saidin", "Non."],
    ["Hylee", "Comment tu le sais sans l'ouvrir ?"],
    ["Saidin", "La personne qui l'a caché comptait trois cheminées depuis l'est. Je suis arrivé par l'ouest."],
    ["Hylee", "Tu comptes les cheminées quand tu marches sur les toits ?"],
  ], {
    lucidite: [
      ["Hylee", "La tuile porte une marque de craie. Quelqu'un viendra le chercher ce soir."],
      ["Saidin", "Alors le billet possède déjà un itinéraire. Notre curiosité ne lui en donnera pas un meilleur."],
      ["Narrateur", "Il le replace au millimètre près."],
    ],
    sangfroid: [
      ["Hylee", "On peut prévenir les gardes sans déplacer le message."],
      ["Saidin", "Ils surveilleront le destinataire, l'expéditeur et probablement trois innocents."],
      ["Hylee", "Tu proposes quoi ?"],
      ["Saidin", "D'attendre de savoir si le danger existe avant de lui fournir une escorte."],
    ],
    audace: [
      ["Hylee", "Je veux vérifier s'il annonce une attaque."],
      ["Saidin", "Alors ouvre-le en acceptant que son secret devienne ta responsabilité."],
      ["Narrateur", "Hylee déplie le bord. Le billet contient une heure, un lieu et le mot pain."],
      ["Hylee", "Je m'attendais à pire."],
    ],
  }, [
    ["Narrateur", "Le billet continue son voyage, intact ou refermé avec soin."],
    ["Saidin", "La curiosité demande rarement la permission. La responsabilité commence juste après."],
    ["Hylee", "Et le pain ?"],
    ["Saidin", "Il arrivera peut-être à l'heure. C'est déjà beaucoup pour un message."],
  ]);

  add("algratal-avant-expedition:toits:confidence-saidin-temps", [
    ["Narrateur", "Saidin sort une montre sans aiguilles. Il l'ouvre, écoute le mécanisme et la referme."],
    ["Hylee", "Elle ne donne pas l'heure."],
    ["Saidin", "Elle me rappelle seulement qu'il y en a une."],
    ["Hylee", "Tu fais toujours ça, parler une seconde avant que les autres comprennent. C'est volontaire ?"],
    ["Saidin", "Au début, non."],
  ], {
    lucidite: [
      ["Hylee", "Tu perçois le temps autrement ?"],
      ["Saidin", "Je remarque parfois l'écho avant le bruit. Cela ne signifie pas que je connais la main qui frappera."],
      ["Hylee", "Ça doit être épuisant."],
      ["Saidin", "Seulement les jours qui arrivent plusieurs fois."],
    ],
    audace: [
      ["Hylee", "Combien de choses savais-tu sur moi avant notre rencontre ?"],
      ["Narrateur", "Ses yeux s'arrêtent enfin sur elle, sans leur sourire habituel."],
      ["Saidin", "Assez pour te chercher. Trop peu pour te reconnaître sans te laisser parler."],
      ["Hylee", "Toujours aussi clair."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux ne pas répondre. J'aimerais seulement savoir si ça te fait peur."],
      ["Saidin", "Oui."],
      ["Narrateur", "Le mot tombe entre eux, simple et sans protection."],
      ["Saidin", "La peur m'empêche parfois de confondre une avance avec une permission."],
    ],
  }, [
    ["Hylee", "Alors pourquoi rester toujours un pas devant ?"],
    ["Saidin", "Pour pouvoir me retourner lorsque quelqu'un trébuche."],
    ["Narrateur", "Il range la montre et descend du toit sans attendre qu'elle lui demande combien de chutes il a déjà vues."],
  ]);
})();

(function registerPrisonAndSplitRouteScenes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("geoles-apres-capture:cellule:parler-groupe", [
    ["Draven", "On nous a pris sans combat. Quelqu'un veut m'expliquer comment ?"],
    ["Valurn", "Avec des chaînes, plusieurs gardes et une hospitalité locale très ferme."],
    ["Draven", "Je n'ai pas besoin de ton numéro."],
    ["Remerii", "Et nous n'avons pas besoin que vous choisissiez un responsable avant d'avoir compris le piège."],
    ["Narrateur", "Dans l'espace trop étroit, chaque regard cherche déjà une faute à saisir."],
    ["Hylee", "On va se faire leur travail si on continue."],
  ], {
    sangfroid: [
      ["Hylee", "On commence par les blessés. Ensuite, chacun raconte exactement ce qu'il a vu."],
      ["Draven", "Bien. Valurn, garde tes effets pour la version courte."],
      ["Valurn", "Je souffre déjà suffisamment."],
      ["Narrateur", "Les voix descendent d'un ton lorsque les faits remplacent les reproches."],
    ],
    lucidite: [
      ["Hylee", "Le piège s'est refermé avant que Naïah donne le signal. Ils connaissaient notre trajet."],
      ["Saidin", "Ou ils connaissaient l'endroit où tous les trajets possibles devaient se rejoindre."],
      ["Draven", "Voilà deux hypothèses. On garde les deux jusqu'à pouvoir en tuer une."],
    ],
    audace: [
      ["Hylee", "Si vous cherchez quelqu'un à accuser, prenez-moi. C'est moi qui ai insisté pour continuer."],
      ["Remerii", "Non."],
      ["Narrateur", "Le mot claque plus fort que la voix de Draven."],
      ["Remerii", "Tu ne vas pas te rendre responsable de toutes les décisions que des adultes ont prises avec toi."],
    ],
  }, [
    ["Narrateur", "Personne ne pardonne la capture. Le groupe reconstitue pourtant la dernière heure sans se déchirer."],
    ["Draven", "Les comptes attendront la sortie."],
    ["Valurn", "J'apprécie les disputes programmées. Cela donne un objectif au lendemain."],
    ["Hylee", "D'abord, on trouve le lendemain."],
  ]);

  add("geoles-apres-capture:cellule:plus-froid-partage", [
    ["Narrateur", "Le froid monte de la pierre et traverse les vêtements. Remerii rapproche sa cape des épaules d'Hylee."],
    ["Hylee", "Tu vas avoir froid."],
    ["Remerii", "Je suis cryomancienne."],
    ["Hylee", "Tu trembles."],
    ["Remerii", "La cape tremble. Son tissu manque de tenue."],
    ["Narrateur", "Elle refuse cependant de reprendre le pan qu'elle vient de céder."],
  ], {
    sangfroid: [
      ["Hylee", "On s'assoit dos au mur, serrées l'une contre l'autre. Personne ne gagne en dignité, tout le monde garde ses doigts."],
      ["Remerii", "Ton pragmatisme devient brutal."],
      ["Narrateur", "Elle s'installe malgré sa protestation et cale la cape autour d'elles."],
    ],
    resonance: [
      ["Hylee", "Je peux retenir la chaleur sous le tissu sans lancer de sort complet."],
      ["Remerii", "Un fil seulement. Les runes surveillent les variations."],
      ["Narrateur", "Une tiédeur minuscule s'installe entre leurs paumes."],
    ],
    lucidite: [
      ["Hylee", "La pierre est plus froide près des angles. Le milieu du mur garde un peu de chaleur."],
      ["Remerii", "Alors nous déplaçons tout le monde de deux pas avant que Draven ne décide de combattre le sol."],
      ["Draven", "Je vous entends."],
    ],
  }, [
    ["Narrateur", "La chaleur reste faible, mais leurs tremblements s'espacent."],
    ["Remerii", "Si tu racontes que j'ai partagé ma cape, je nierai avec beaucoup d'autorité."],
    ["Hylee", "Je dirai qu'elle a glissé toute seule."],
    ["Narrateur", "Remerii serre un peu plus le tissu autour d'elle."],
  ]);

  add("geoles-apres-capture:barreaux:etudier-runes", [
    ["Narrateur", "La barrière change de couleur après chaque test. Le froid la rend opaque, la magie temporelle ralentit son pouls, le Chaos multiplie ses lignes."],
    ["Saidin", "Elle apprend."],
    ["Hylee", "Une serrure qui apprend à nous arrêter ?"],
    ["Valurn", "J'aurais préféré une porte stupide. Nous aurions eu davantage en commun."],
    ["Remerii", "Chaque essai répété renforce sa réponse. Nous n'aurons qu'une tentative utile."],
  ], {
    lucidite: [
      ["Hylee", "Après une réaction, la rune centrale s'éteint avant les autres."],
      ["Saidin", "Pendant deux battements."],
      ["Hylee", "Trois si le test vient du côté opposé."],
      ["Narrateur", "Saidin lui laisse la craie et Hylee note le cycle elle-même."],
    ],
    resonance: [
      ["Narrateur", "Hylee approche sa main sans libérer de sort. La rune froide suit son souffle."],
      ["Hylee", "Elle anticipe l'intention magique, pas le mouvement."],
      ["Saidin", "Alors une main vide pourrait l'occuper pendant qu'une autre agit."],
    ],
    sangfroid: [
      ["Hylee", "On arrête les tests et on la regarde revenir à son état de départ."],
      ["Remerii", "Une attente utile. J'allais commencer à prendre son obstination personnellement."],
      ["Narrateur", "Après une minute, une ligne reste sombre plus longtemps que les autres."],
    ],
  }, [
    ["Narrateur", "Hylee mémorise le moment où la rune centrale se retrouve seule."],
    ["Saidin", "Nous n'avons pas encore une sortie."],
    ["Hylee", "On a l'instant où elle pourrait en devenir une."],
    ["Saidin", "Tu viens de comprendre pourquoi je collectionne les instants."],
  ]);

  add("geoles-apres-capture:barreaux:plus-rythme-clefs", [
    ["Narrateur", "Un trousseau tinte au bout du couloir, quatre coups rapides, une pause, puis un choc plus sourd."],
    ["Saidin", "Le garde boite légèrement de la jambe gauche."],
    ["Hylee", "Tu l'as vu ?"],
    ["Saidin", "Non. Sa troisième clef frappe son ceinturon lorsqu'il compense son pas."],
    ["Narrateur", "Un autre trousseau approche avec un rythme régulier et beaucoup plus lent."],
  ], {
    lucidite: [
      ["Hylee", "Le premier repasse toutes les douze minutes. Le second ne vient qu'après deux rondes."],
      ["Saidin", "Et lequel regarde réellement dans les cellules ?"],
      ["Hylee", "Le second. Le premier compte sur le bruit des clefs pour nous prévenir."],
    ],
    sangfroid: [
      ["Narrateur", "Hylee ferme les yeux et laisse passer trois rondes avant de parler."],
      ["Hylee", "Il y a un intervalle sans aucun trousseau juste après le changement de garde."],
      ["Saidin", "Quarante-sept secondes. Une petite éternité bien placée."],
    ],
    resonance: [
      ["Hylee", "Les runes vibrent une seconde avant chaque ouverture."],
      ["Saidin", "La prison annonce donc les gardes avant leurs clefs."],
      ["Narrateur", "Hylee apprend à reconnaître cette vibration sous les autres bruits."],
    ],
  }, [
    ["Narrateur", "Les trousseaux deviennent une horloge que les geôliers ignorent avoir offerte."],
    ["Valurn", "J'admire votre capacité à transformer un bruit agaçant en espoir méthodique."],
    ["Saidin", "L'espoir survit mieux lorsqu'il sait compter."],
  ]);

  add("geoles-apres-capture:barreaux:confidence-saidin-remords", [
    ["Narrateur", "Remerii s'assoupit enfin contre le mur. Saidin garde les yeux sur sa main blessée."],
    ["Hylee", "Tu la regardes depuis qu'on est entrés."],
    ["Saidin", "Je vérifie qu'elle respire."],
    ["Hylee", "Elle respire."],
    ["Saidin", "Je le sais."],
    ["Narrateur", "Il ne détourne pourtant pas les yeux."],
  ], {
    lucidite: [
      ["Hylee", "Tu cherches le moment où tu aurais pu éviter tout ça."],
      ["Saidin", "J'en trouve toujours un. Puis un autre avant lui. Le passé est généreux avec les coupables."],
      ["Hylee", "Tu n'as pas causé le piège."],
      ["Saidin", "La cause n'épuise pas la responsabilité."],
    ],
    audace: [
      ["Hylee", "Tu ne peux pas la protéger de tout."],
      ["Saidin", "Je le sais depuis longtemps. Mon corps reçoit encore la nouvelle avec retard."],
      ["Narrateur", "Ses doigts se ferment autour de sa manche avant de se relâcher."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux veiller avec moi. Sans chercher tout de suite une faute à réparer."],
      ["Saidin", "Une proposition raisonnable dans un lieu qui ne l'est pas."],
      ["Narrateur", "Ils restent côte à côte, attentifs au souffle de Remerii et au passage des gardes."],
    ],
  }, [
    ["Saidin", "Un mentor enseigne à tomber sans mourir. Il oublie parfois qu'il devra ensuite regarder la chute."],
    ["Hylee", "Elle s'est relevée avant. Elle se relèvera encore."],
    ["Saidin", "Oui. Ma peur ne lui retire pas cette force."],
    ["Narrateur", "Il cesse enfin de compter chaque respiration."],
  ]);

  add("geoles-apres-capture:couloir:ecouter-cite", [
    ["Naïah", "Ils changent les cuisines de service."],
    ["Hylee", "Comment tu peux savoir ça d'ici ?"],
    ["Naïah", "Les chariots vides repartent à droite. Les pleins descendent. Et quelqu'un crie depuis dix minutes parce qu'il manque des oignons."],
    ["Draven", "Une armée ennemie avec des oignons. Terrifiant."],
    ["Naïah", "Une ville. Les armées ne disputent pas le prix des légumes pendant une relève."],
  ], {
    lucidite: [
      ["Hylee", "Les gardes ont des horaires, les repas circulent, les ouvriers se plaignent. Tout continue autour de nous."],
      ["Naïah", "Oui. Ils n'attendaient pas notre capture pour commencer à exister."],
      ["Draven", "L'Empire nous a envoyé infiltrer une cité qu'il décrit encore comme un repaire."],
    ],
    resonance: [
      ["Hylee", "Je sens des protections partout, mais aussi des foyers, des ateliers, des enfants qui lancent des sorts."],
      ["Naïah", "Garde ça pour toi. Draven va finir par demander un plan d'urbanisme."],
      ["Draven", "Un plan tout court me suffirait."],
    ],
    sangfroid: [
      ["Hylee", "On écoute sans décider tout de suite ce que ça prouve."],
      ["Naïah", "Tu deviens prudente au pire moment. J'avais préparé une conclusion scandaleuse."],
      ["Hylee", "Tu peux la garder pour quand on aura vu les rues."],
    ],
  }, [
    ["Narrateur", "Les sons ordinaires continuent de traverser les murs noirs."],
    ["Naïah", "Ils ont des rondes, des écoles et une cuisinière qui va tuer quelqu'un pour ses oignons."],
    ["Hylee", "Ça change déjà quelque chose."],
    ["Naïah", "Oui. Ça rend leurs mensonges plus intéressants et les nôtres beaucoup moins confortables."],
  ]);

  add("geoles-apres-capture:couloir:plus-ration-tombee", [
    ["Narrateur", "Un morceau de pain tombe du plateau d'un garde et glisse hors de portée des barreaux."],
    ["Garde", "Dommage."],
    ["Narrateur", "Il poursuit sa ronde. Naïah fixe le pain, puis l'angle mort entre deux runes."],
    ["Naïah", "Je peux l'avoir."],
    ["Hylee", "Sans montrer comment ?"],
    ["Naïah", "Tu demandes beaucoup à un morceau de pain."],
  ], {
    audace: [
      ["Narrateur", "Son bras s'étire entre les barreaux tandis qu'une ombre file jusqu'au pain et le ramène d'un coup."],
      ["Valurn", "Discret, élégant et entièrement visible depuis la cellule d'en face."],
      ["Naïah", "Ils ont applaudi avec les yeux."],
    ],
    lucidite: [
      ["Hylee", "Le garde l'a laissé tomber après avoir regardé notre porte. Il teste notre portée."],
      ["Naïah", "Alors on lui offre une mauvaise mesure."],
      ["Narrateur", "Elle tend la main, échoue volontairement et attend que ses pas disparaissent."],
    ],
    sangfroid: [
      ["Naïah", "Je le laisse."],
      ["Hylee", "Tu as faim."],
      ["Naïah", "J'ai aussi envie qu'il ignore ce que je peux faire. Pour une fois, la deuxième faim gagne."],
      ["Narrateur", "Elle détourne les yeux du pain avec une colère parfaitement silencieuse."],
    ],
  }, [
    ["Narrateur", "Le groupe obtient une ration ou une information sur la façon dont les gardes les observent."],
    ["Naïah", "S'ils essaient encore, j'espère qu'ils choisiront du fromage."],
    ["Hylee", "Tu partagerais ?"],
    ["Naïah", "Cette question menace notre amitié."],
  ]);

  add("akuhn-iriana-apres-audience:terrasse:regarder-ville", [
    ["Narrateur", "Sous la terrasse, Akuhn'Nabad s'étend bien au-delà du palais. Des écoles ferment leurs portes, des marchands rangent leurs étals et une ronde laisse passer un convoi de soins."],
    ["Iriana", "On m'a enseigné à reconnaître un camp d'insurgés."],
    ["Garde obscurcie", "Et qu'observez-vous ?"],
    ["Iriana", "Une capitale. Le constat ne vaut pas encore approbation."],
    ["Garde obscurcie", "Personne ne vous a demandé de nous aimer."],
  ], {
    observer: [
      ["Narrateur", "Iriana suit les mouvements de la ronde. Les soldats protègent les rues plutôt que le palais."],
      ["Iriana", "Votre dispositif est tourné vers l'extérieur et les quartiers civils."],
      ["Garde obscurcie", "La reine dort derrière des murs. Les enfants, non."],
    ],
    agir: [
      ["Iriana", "Je veux descendre dans les rues."],
      ["Garde obscurcie", "Votre escorte sera visible."],
      ["Iriana", "Je suis une princesse impériale dans la capitale d'Amanea. Toute tentative de discrétion serait insultante pour leur intelligence."],
    ],
    temporiser: [
      ["Narrateur", "Iriana garde ses questions et observe jusqu'à la fin de la relève."],
      ["Garde obscurcie", "Vous ne notez rien ?"],
      ["Iriana", "J'évite de transformer trop vite ce que je vois en argument pour ce que je croyais déjà."],
    ],
  }, [
    ["Narrateur", "Une cloche annonce la fermeture des ateliers. La ville répond par des gestes habituels, pas par la panique d'une forteresse assiégée."],
    ["Iriana", "L'Empire a choisi des mots qui rendaient cette population plus facile à condamner."],
    ["Garde obscurcie", "Vous venez seulement de rencontrer les personnes placées derrière ces mots."],
  ]);

  add("akuhn-iriana-apres-audience:terrasse:plus-flamme-eteinte", [
    ["Narrateur", "Une flamme verte s'éteint lorsque Iriana passe devant le brasero. Le serviteur chargé des feux baisse aussitôt les yeux."],
    ["Iriana", "Rallumez-la."],
    ["Serviteur", "Elle refusera, Altesse."],
    ["Iriana", "Une flamme possède donc une opinion sur ma présence."],
    ["Serviteur", "Elle reconnaît certaines lignées."],
  ], {
    observer: [
      ["Narrateur", "Iriana examine les autres brasiers. Leur lumière s'incline tous dans la direction opposée au palais impérial."],
      ["Iriana", "Elle reconnaît les Farae et rejette la branche impériale."],
      ["Serviteur", "Elle se souvient de celle qui l'a allumée."],
    ],
    agir: [
      ["Narrateur", "Iriana approche sa propre Lumière. La flamme verte recule, puis mord le bord doré de son sort."],
      ["Iriana", "Elle ne manque pas d'assurance."],
      ["Serviteur", "Elle a été élevée ici."],
    ],
    temporiser: [
      ["Iriana", "Laissez-la éteinte."],
      ["Serviteur", "La reine le remarquera."],
      ["Iriana", "C'est peut-être la raison pour laquelle le feu a choisi cet instant."],
    ],
  }, [
    ["Narrateur", "Le serviteur remplace les herbes sans tenter de rallumer le brasier."],
    ["Iriana", "Amanea entretient donc des feux capables de me juger."],
    ["Serviteur", "La reine préfère les choses qui répondent franchement."],
    ["Narrateur", "Iriana retient la phrase autant que le phénomène."],
  ]);

  add("akuhn-iriana-apres-audience:rues:incident-marche", [
    ["Première commerçante", "Ton auvent dépasse encore sur mon emplacement."],
    ["Second commerçant", "Ton emplacement avance chaque semaine."],
    ["Enfant", "C'est la princesse de Lumière !"],
    ["Narrateur", "La dispute s'interrompt. Les deux commerçants se tournent vers Iriana, chacun espérant soudain un arbitrage favorable."],
    ["Iriana", "Je visite votre rue depuis trois minutes et vous souhaitez déjà me confier son cadastre."],
  ], {
    observer: [
      ["Narrateur", "Iriana regarde les marques au sol. Une ligne plus ancienne se trouve sous l'auvent du second marchand."],
      ["Iriana", "Vous avez tous les deux déplacé la frontière. L'une par habitude, l'autre pour suivre."],
      ["Première commerçante", "Elle observe vite."],
    ],
    agir: [
      ["Iriana", "Reculez chaque étal d'une largeur de main et laissez le passage libre."],
      ["Second commerçant", "Vous donnez des ordres ici ?"],
      ["Iriana", "Vous m'avez demandé de trancher. Il est tard pour découvrir que la réponse peut vous déplaire."],
    ],
    temporiser: [
      ["Iriana", "Qui règle normalement ce conflit ?"],
      ["Première commerçante", "La doyenne du quartier. Elle revient demain."],
      ["Iriana", "Alors vous survivrez une nuit sans transformer ma visite en précédent juridique."],
    ],
  }, [
    ["Narrateur", "L'enfant reprend son compte des gardes pendant que les marchands déplacent leurs paniers."],
    ["Enfant", "Elle parle exactement comme la reine."],
    ["Iriana", "Vous devriez apprendre à choisir vos comparaisons avec davantage de prudence."],
    ["Narrateur", "Le rire de la commerçante suit l'escorte dans la rue."],
  ]);

  add("akuhn-iriana-apres-audience:rues:plus-enfant-escorte", [
    ["Enfant", "Un, deux, trois, quatre gardes. Et toi."],
    ["Iriana", "Votre arithmétique est irréprochable."],
    ["Enfant", "Tu es une prisonnière ?"],
    ["Garde obscurcie", "Continue ton chemin."],
    ["Iriana", "Laissez-le. La question possède au moins le mérite d'être directe."],
  ], {
    observer: [
      ["Iriana", "À votre avis ?"],
      ["Enfant", "Les prisonniers marchent au milieu. Les invités aussi quand on ne leur fait pas confiance."],
      ["Iriana", "Votre observation me paraît plus exacte que les deux réponses disponibles."],
    ],
    agir: [
      ["Iriana", "Je suis une invitée qui choisit encore où poser les pieds."],
      ["Enfant", "Alors pourquoi les gardes choisissent-ils la rue ?"],
      ["Narrateur", "Iriana accorde à la question un silence plus long qu'elle ne le souhaitait."],
    ],
    temporiser: [
      ["Iriana", "Je déciderai après avoir vu où l'on m'autorise à aller."],
      ["Enfant", "Les adultes mettent toujours longtemps à savoir s'ils sont enfermés."],
      ["Garde obscurcie", "Va retrouver ta mère."],
    ],
  }, [
    ["Narrateur", "L'enfant s'éloigne en annonçant aux passants qu'Iriana n'a pas encore choisi son statut."],
    ["Garde obscurcie", "La rumeur fera le tour du quartier."],
    ["Iriana", "Alors j'espère que votre reine appréciera la précision de ses citoyens."],
  ]);

  add("akuhn-iriana-apres-audience:archives:registres", [
    ["Archiviste", "Arrivées, adoptions, changements de nom. Les registres militaires restent fermés."],
    ["Iriana", "Je n'ai demandé que les fonds publics."],
    ["Archiviste", "Votre réputation pose souvent des questions avant vous."],
    ["Narrateur", "Iriana ouvre le premier volume. Plusieurs noms portent une mention impériale : décédé, disparu, traître."],
    ["Iriana", "Ils vivent ici."],
  ], {
    observer: [
      ["Narrateur", "Elle compare les dates. Certains ont rejoint la cité des années après leur disparition officielle."],
      ["Iriana", "L'Empire n'a pas toujours menti sur leur sort. Il a simplement cessé de chercher."],
      ["Archiviste", "Pour beaucoup, cette nuance a duré jusqu'à notre porte."],
    ],
    agir: [
      ["Iriana", "Je veux une copie de ces pages."],
      ["Archiviste", "Pour corriger vos archives ou pour compléter vos listes ?"],
      ["Iriana", "Si je réponds corriger, vous ne me croirez pas. Préparez une copie qui ne mette personne en danger."],
    ],
    temporiser: [
      ["Iriana", "Je noterai seulement les chiffres."],
      ["Archiviste", "Vous renoncez aux noms ?"],
      ["Iriana", "Je renonce à emporter l'adresse de personnes que mon escorte appelle encore des fugitifs."],
    ],
  }, [
    ["Narrateur", "Le total dépasse tout ce qu'Iriana avait imaginé. Chaque colonne correspond à quelqu'un que l'Empire avait rayé."],
    ["Archiviste", "Akuhn'Nabad fut un exil pour certains. Pour d'autres, le premier lieu qui les compta encore parmi les vivants."],
    ["Iriana", "Je comprends pourquoi vous tenez les registres."],
  ]);

  add("akuhn-iriana-apres-audience:archives:plus-page-sans-encre", [
    ["Narrateur", "Iriana tourne une page blanche. L'archiviste fronce les sourcils."],
    ["Archiviste", "Vous ne voyez rien ?"],
    ["Iriana", "Si vous tentez une plaisanterie, elle manque de préparation."],
    ["Archiviste", "Douze noms apparaissent ici."],
    ["Narrateur", "Sous un angle différent, Iriana distingue seulement la pression des lettres sur le papier."],
  ], {
    observer: [
      ["Iriana", "L'enchantement refuse la Lumière impériale, pas ma personne. Le texte réagit à mon sceau."],
      ["Archiviste", "Les deux ont rarement voyagé séparément jusqu'ici."],
      ["Narrateur", "Iriana retire sa bague. Une initiale apparaît, puis s'efface."],
    ],
    agir: [
      ["Narrateur", "Iriana diffuse une lueur très faible sous la page. L'encre cachée absorbe le sort sans se révéler."],
      ["Archiviste", "Insister effacera les noms."],
      ["Iriana", "Une protection qui détruit son contenu avant de le livrer. Votre méfiance a été instruite par de bons professeurs."],
    ],
    temporiser: [
      ["Iriana", "Lisez-moi seulement la nature des entrées. Aucun nom."],
      ["Archiviste", "Enfants déplacés. Familles protégées. Deux témoins."],
      ["Narrateur", "Elle accepte la limite sans demander qui témoignerait contre l'Empire."],
    ],
  }, [
    ["Narrateur", "La page reste blanche pour Iriana et lisible pour ceux qu'elle protège."],
    ["Iriana", "Elle me refuse les mots, mais m'indique exactement ce que vous craignez."],
    ["Archiviste", "Alors elle vous a dit assez."],
  ]);

  add("akuhn-iriana-apres-audience:appartements:message-amanea", [
    ["Narrateur", "Le billet d'Amanea tient en une phrase : Demain, nous parlerons sans cour."],
    ["Iriana", "Elle donne à une convocation la forme d'une faveur."],
    ["Servante", "La reine n'attend pas nécessairement de réponse."],
    ["Iriana", "Elle attend toujours une réponse. Le silence en serait simplement une qu'elle pourrait interpréter seule."],
    ["Narrateur", "Iriana prend une feuille et laisse la plume au-dessus du premier mot."],
  ], {
    observer: [
      ["Iriana", "Écrivez : J'écouterai ce que vous acceptez enfin de dire."],
      ["Servante", "Cela ressemble à un reproche."],
      ["Iriana", "Vous êtes très observatrice."],
    ],
    agir: [
      ["Iriana", "Écrivez : Je viendrai. Aucune escorte dans la pièce."],
      ["Servante", "La reine décidera de la sécurité."],
      ["Iriana", "Alors elle saura avant demain que je décide aussi de la conversation."],
    ],
    temporiser: [
      ["Narrateur", "Iriana replie la feuille restée vide."],
      ["Iriana", "Dites-lui que j'ai reçu son message."],
      ["Servante", "Rien de plus ?"],
      ["Iriana", "Elle connaît la valeur de ce que je retiens."],
    ],
  }, [
    ["Narrateur", "La servante repart avec quelques mots ou une absence soigneusement choisie."],
    ["Iriana", "Amanea tente déjà de fixer le terrain de demain."],
    ["Narrateur", "Iriana déplace elle-même le fauteuil placé face à la porte avant de se préparer à dormir."],
  ]);

  add("akuhn-iriana-apres-audience:appartements:plus-the-amanea", [
    ["Narrateur", "Le plateau du soir porte deux théières. L'une diffuse l'odeur douce qu'Iriana aimait enfant. L'autre contient une infusion amère réservée aux longues audiences."],
    ["Servante", "La reine a choisi les deux."],
    ["Iriana", "Naturellement. Elle préfère poser une question sans risquer d'en être tenue responsable."],
    ["Servante", "Laquelle dois-je servir ?"],
    ["Narrateur", "Iriana reconnaît dans ce choix une attention que sa colère aurait préféré ne pas voir."],
  ], {
    observer: [
      ["Iriana", "Mélangez-les."],
      ["Servante", "Le goût risque d'être étrange."],
      ["Iriana", "Il le sera moins que la prétention de choisir entre l'enfant qu'elle a connue et l'adulte qu'elle imagine."],
    ],
    agir: [
      ["Iriana", "L'infusion amère."],
      ["Narrateur", "Elle boit sans sucre et garde le visage impassible malgré la première gorgée."],
      ["Servante", "La reine demandera laquelle vous avez retenue."],
      ["Iriana", "Dites-lui que j'ai terminé la tasse."],
    ],
    temporiser: [
      ["Iriana", "Laissez les deux. Je choisirai lorsque personne n'attendra d'en tirer une conclusion."],
      ["Servante", "Elles refroidiront."],
      ["Iriana", "Ce serait une conséquence remarquablement honnête."],
    ],
  }, [
    ["Narrateur", "Une tasse reste vide. L'autre porte la trace du choix d'Iriana."],
    ["Iriana", "Elle se souvient donc encore de ce goût."],
    ["Narrateur", "Le constat l'atteint davantage que l'amertume du thé."],
  ]);

  add("algratal-groupe-retour:infirmerie:bilan", [
    ["Soigneuse", "Vous restez assises toutes les deux. Je reviens avec les bandages."],
    ["Narrateur", "Dès qu'elle sort, Remerii se relève."],
    ["Hylee", "Elle vient de dire assises."],
    ["Remerii", "Elle ne connaît pas encore l'étendue de mes compétences."],
    ["Hylee", "Elle a surtout vu l'étendue de ta blessure."],
    ["Narrateur", "Remerii se rassoit, contrariée d'avoir été comprise si vite."],
  ], {
    lucidite: [
      ["Hylee", "Dans la cellule, tu as parlé à tout le monde sauf à moi."],
      ["Remerii", "Parce que si je t'avais demandé comment tu allais, j'aurais dû accepter ta réponse."],
      ["Hylee", "Je n'allais pas bien."],
      ["Remerii", "Moi non plus."],
    ],
    audace: [
      ["Hylee", "Je suis en colère contre Iriana. Et contre toi quand tu décides seule de ce que je peux supporter."],
      ["Narrateur", "Remerii ouvre la bouche, puis referme la défense déjà prête."],
      ["Remerii", "La première colère est légitime. La seconde aussi, ce qui m'agace davantage."],
    ],
    sangfroid: [
      ["Hylee", "On n'a pas besoin de régler le groupe ce soir. Je veux seulement savoir si nous pouvons nous parler."],
      ["Remerii", "Oui."],
      ["Narrateur", "Sa main cherche celle d'Hylee sur le banc, avec une discrétion inutile dans la pièce vide."],
    ],
  }, [
    ["Narrateur", "La soigneuse revient et trouve enfin ses deux patientes assises."],
    ["Soigneuse", "Un miracle."],
    ["Remerii", "Une négociation temporaire."],
    ["Hylee", "On garde les grandes disputes pour après les bandages."],
  ]);

  add("algratal-groupe-retour:infirmerie:plus-main-pendant-soin", [
    ["Soigneuse", "Tenez-lui l'avant-bras. Si elle bouge encore, la suture sera de travers."],
    ["Remerii", "Je ne bouge pas."],
    ["Soigneuse", "Votre sang est sur trois coussins."],
    ["Hylee", "Donne-moi ta main."],
    ["Remerii", "Cette mise en scène me paraît excessive."],
    ["Narrateur", "Elle tend pourtant les doigts."],
  ], {
    sangfroid: [
      ["Hylee", "Regarde-moi. Inspire quand elle passe l'aiguille, expire après."],
      ["Remerii", "Je sais respirer."],
      ["Hylee", "Alors montre-moi."],
      ["Narrateur", "Remerii obéit et sa main cesse progressivement d'écraser celle d'Hylee."],
    ],
    audace: [
      ["Hylee", "Tu peux me broyer les doigts. Je me plaindrai plus tard."],
      ["Remerii", "Je refuse de transformer ta mauvaise idée en méthode de soin."],
      ["Narrateur", "L'aiguille passe. Remerii serre brusquement, puis marmonne une excuse à peine audible."],
    ],
    resonance: [
      ["Hylee", "Je vais faire circuler un peu de chaleur dans ma paume. Rien qui touche ta blessure."],
      ["Remerii", "Très léger. Les soigneurs n'apprécient pas les patientes qui modifient leur protocole."],
      ["Soigneuse", "Enfin une chose sensée dite sur ce banc."],
    ],
  }, [
    ["Soigneuse", "Terminé."],
    ["Narrateur", "Remerii garde la main d'Hylee pendant que la soigneuse coupe le fil."],
    ["Hylee", "Tu peux la lâcher."],
    ["Remerii", "Je vérifie seulement que je ne l'ai pas abîmée."],
  ]);

  add("algratal-groupe-retour:cour:retrouver-corps", [
    ["Narrateur", "Hylee fait trois pas dans la cour et vérifie malgré elle la distance jusqu'à la porte."],
    ["Naïah", "Tu comptes les sorties."],
    ["Hylee", "Non."],
    ["Naïah", "Alors tu comptes très mal autre chose."],
    ["Narrateur", "Naïah lui lance une petite balle de cuir. Hylee la reçoit contre la poitrine."],
    ["Naïah", "On joue jusqu'à ce que ton corps comprenne qu'aucun mur ne va se fermer."],
  ], {
    sangfroid: [
      ["Hylee", "Doucement. Mes côtes ont voté contre ton enthousiasme."],
      ["Naïah", "Tes côtes manquent d'ambition."],
      ["Narrateur", "Elles commencent par des passes courtes, régulières, jusqu'à ce que les épaules d'Hylee descendent."],
    ],
    resonance: [
      ["Hylee", "Je vais suivre la balle par sa vibration plutôt qu'avec les yeux."],
      ["Naïah", "Je vais tricher plutôt qu'avec les règles."],
      ["Narrateur", "Une ombre dévie la passe. Hylee rit avant de pouvoir se crisper."],
    ],
    audace: [
      ["Hylee", "Si je t'attrape, tu prends ma place au prochain soin."],
      ["Naïah", "Si tu m'attrapes, je te laisse croire que c'était possible."],
      ["Narrateur", "Naïah part en courant et Hylee la suit entre les colonnes."],
    ],
  }, [
    ["Narrateur", "Après quelques minutes, Hylee traverse la cour sans vérifier chaque porte."],
    ["Naïah", "Tu respires mieux."],
    ["Hylee", "Tu pouvais simplement me proposer de marcher."],
    ["Naïah", "Et perdre une occasion de te lancer quelque chose ?"],
  ]);

  add("algratal-groupe-retour:cour:plus-oiseaux-naiah", [
    ["Naïah", "Regarde les oiseaux."],
    ["Hylee", "Ils sont sur le toit."],
    ["Naïah", "Sur tous les toits, sauf celui-ci."],
    ["Narrateur", "Les moineaux contournent la cour intérieure et se posent plus loin, même lorsque des miettes restent au sol."],
    ["Naïah", "Le palais leur dit quelque chose que vous n'entendez plus."],
  ], {
    resonance: [
      ["Hylee", "Il y a une trame fine au-dessus de nous. Elle repousse les petites présences magiques."],
      ["Naïah", "Une moustiquaire pour espions ailés."],
      ["Hylee", "Ou pour familiers. Elle ne semble pas dangereuse."],
    ],
    lucidite: [
      ["Hylee", "Les plumes se hérissent près des gargouilles. L'enchantement vient de là."],
      ["Narrateur", "Naïah grimpe sur la fontaine pour voir l'une des pierres gravées."],
      ["Naïah", "Protection impériale contre les animaux curieux. Je me sens personnellement visée."],
    ],
    sangfroid: [
      ["Hylee", "On ne touche à rien avant de savoir si l'alarme est liée."],
      ["Naïah", "Tu deviens raisonnable depuis les geôles. J'espère que ça passe."],
      ["Narrateur", "Elle descend tout de même de la fontaine et mémorise les marques."],
    ],
  }, [
    ["Narrateur", "Elles découvrent un ancien écran destiné à détourner les familiers des fenêtres du palais."],
    ["Naïah", "Les oiseaux savent où la cour cache ses oreilles."],
    ["Hylee", "Tu vas les suivre ?"],
    ["Naïah", "Évidemment. Eux au moins ne remplissent pas de registre."],
  ]);

  add("algratal-groupe-retour:cour:confidence-naiah-faim", [
    ["Narrateur", "Naïah ramasse une pâtisserie abandonnée sur un plateau de service et la glisse dans sa manche."],
    ["Hylee", "Tu peux la manger. Personne ne va te la prendre."],
    ["Naïah", "Je sais."],
    ["Narrateur", "Elle garde pourtant la pâtisserie cachée et en choisit une seconde."],
    ["Hylee", "Tu faisais déjà ça à l'auberge."],
  ], {
    lucidite: [
      ["Hylee", "Tu gardes la première même quand tu as de quoi manger maintenant."],
      ["Naïah", "Maintenant change vite. Une manche pleine reste plus fiable qu'un repas promis."],
      ["Hylee", "Tu as manqué de nourriture longtemps ?"],
      ["Naïah", "Assez pour savoir dormir sans sentir mon ventre."],
    ],
    audace: [
      ["Hylee", "Prends tout le plateau si tu veux."],
      ["Naïah", "Je n'en veux pas autant."],
      ["Hylee", "Alors tu n'as pas besoin de prouver que tu peux le voler."],
      ["Narrateur", "Naïah retire lentement la première pâtisserie de sa manche."],
    ],
    sangfroid: [
      ["Hylee", "Je n'ai rien vu. Garde-la pour plus tard."],
      ["Naïah", "Tu pourrais me dire qu'il y en aura demain."],
      ["Hylee", "Tu ne me croirais pas encore."],
      ["Naïah", "Bonne réponse."],
    ],
  }, [
    ["Narrateur", "Naïah partage finalement la seconde pâtisserie et conserve la première dans sa poche."],
    ["Naïah", "Les tartelettes que tu m'avais données étaient encore chaudes."],
    ["Hylee", "Tu t'en souviens ?"],
    ["Naïah", "Je me souviens de tout ce qui arrive sans prix."],
  ]);

  add("algratal-groupe-retour:chambres:invitation-bal", [
    ["Narrateur", "Les invitations dorées attendent sur chaque lit. Remerii lit la sienne avec l'attention réservée aux menaces écrites correctement."],
    ["Valurn", "Un bal après une captivité. L'Empire possède un sens admirable du rétablissement."],
    ["Draven", "Je n'irai pas danser."],
    ["Naïah", "Tu as peur qu'on te marche sur les pieds ?"],
    ["Draven", "J'ai peur de répondre quand ça arrivera."],
    ["Hylee", "On pourrait y aller ensemble."],
  ], {
    lucidite: [
      ["Hylee", "La cour veut nous voir séparés, décider qui blâme qui, puis utiliser le reste."],
      ["Remerii", "Entrer ensemble ne règle rien entre nous."],
      ["Hylee", "Non. Ça les empêche seulement de choisir la version à notre place."],
    ],
    audace: [
      ["Hylee", "On y va, on mange leur buffet, on survit à leurs questions et Naïah ne vole qu'une chose."],
      ["Naïah", "Je refuse les quotas."],
      ["Valurn", "J'accepte ce plan pour sa rigueur stratégique."],
    ],
    sangfroid: [
      ["Hylee", "Personne n'est obligé de sourire ni de pardonner ce soir. On se retrouve seulement avant d'entrer."],
      ["Draven", "Ça me va. Si je pars, je préviens."],
      ["Remerii", "Et si l'un de nous se retrouve acculé, les autres interviennent."],
    ],
  }, [
    ["Narrateur", "Les invitations restent des obligations, mais le groupe fixe ses propres règles avant de les accepter."],
    ["Naïah", "Pour la chose à voler, une couronne compte comme une seule ?"],
    ["Iriana", "J'étais précisément sur le point de regretter de vous avoir invitée."],
  ]);

  add("algratal-groupe-retour:chambres:plus-voix-derriere-cloisons", [
    ["Narrateur", "Une dispute étouffée traverse la cloison de gauche. Plus loin, Valurn rit et Draven marche avec assez de poids pour annoncer chaque demi-tour."],
    ["Hylee", "Tout le monde est réveillé."],
    ["Narrateur", "Sa propre chambre offre enfin du silence. Après les geôles, ce calme lui paraît à la fois précieux et trop vaste."],
    ["Hylee", "Je pourrais rester ici."],
  ], {
    lucidite: [
      ["Narrateur", "Hylee reconnaît la voix de Remerii derrière la première porte. Elle ne se dispute pas, elle répète une formule jusqu'à l'épuisement."],
      ["Hylee", "Remerii ? C'est moi."],
      ["Narrateur", "La formule s'arrête. Le verrou s'ouvre quelques secondes plus tard."],
    ],
    audace: [
      ["Narrateur", "Hylee frappe chez Valurn sans attendre de trouver une excuse."],
      ["Valurn", "Entre. Je débattais avec une bouteille, elle gagnait par manque d'arguments."],
      ["Hylee", "J'ai besoin d'un rire qui ne vient pas d'un geôlier."],
    ],
    sangfroid: [
      ["Narrateur", "Hylee ferme sa porte, allume une petite lampe et s'assoit contre le bois."],
      ["Hylee", "Je les entends. Ça suffit pour ce soir."],
      ["Narrateur", "Les bruits familiers derrière les cloisons empêchent le silence de redevenir celui d'une cellule."],
    ],
  }, [
    ["Narrateur", "La nuit se termine auprès d'une voix choisie ou dans une solitude qui ne ressemble plus à un abandon."],
    ["Hylee", "Demain, on affronte le bal."],
    ["Narrateur", "Quelqu'un répond derrière le mur, sans avoir entendu toute la phrase."],
  ]);
})();

(function registerCoffretAndBallInterludeScenes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("akuhn-iriana-coffret:piano:reprendre-melodie", [
    ["Narrateur", "Iriana s'assoit devant le piano après le départ d'Amanea. Le banc conserve encore une légère chaleur."],
    ["Iriana", "Elle savait que je reconnaîtrais cette mélodie."],
    ["Narrateur", "Ses doigts trouvent les premières notes apprises dans l'enfance, puis s'arrêtent à l'endroit où la version d'Amanea avait bifurqué."],
    ["Iriana", "Et elle savait que je chercherais la différence."],
  ], {
    observer: [
      ["Narrateur", "Iriana rejoue seulement la phrase commune aux deux versions. La dernière corde continue de vibrer après les autres."],
      ["Iriana", "La variation commence précisément là où nos souvenirs cessent de coïncider."],
      ["Narrateur", "Elle mémorise l'intervalle sans tenter de le compléter."],
    ],
    agir: [
      ["Narrateur", "Iriana reprend la variation d'Amanea et impose sa propre résolution aux dernières mesures."],
      ["Iriana", "Tu ne seras pas la seule à décider de la fin."],
      ["Narrateur", "L'accord final résonne trop vivement dans la pièce vide."],
    ],
    temporiser: [
      ["Narrateur", "Iriana garde les mains au-dessus des touches sans les abaisser."],
      ["Iriana", "La musique donne l'illusion d'une intimité qu'aucune de nous n'a encore méritée."],
      ["Narrateur", "Elle referme doucement le clavier."],
    ],
  }, [
    ["Narrateur", "Le piano ne révèle aucun secret. Il confirme un langage partagé avant que les titres et les condamnations ne prennent toute la place."],
    ["Iriana", "Une preuve sentimentale reste une preuve médiocre."],
    ["Narrateur", "Elle conserve pourtant la mélodie avec davantage de soin que plusieurs rapports."],
  ]);

  add("akuhn-iriana-coffret:piano:plus-note-faussée", [
    ["Narrateur", "Une touche répond un demi-ton trop bas. Toutes les autres sont parfaitement accordées."],
    ["Iriana", "Un défaut isolé dans l'instrument d'Amanea. L'hypothèse de la négligence devient presque insultante."],
    ["Narrateur", "La note fausse appartient à la mesure qu'Amanea a modifiée."],
    ["Iriana", "Tu as placé un repère."],
  ], {
    observer: [
      ["Narrateur", "Iriana ouvre le panneau et découvre un fil sombre attaché au marteau de la touche."],
      ["Iriana", "L'altération est mécanique, donc volontaire et reproductible."],
      ["Narrateur", "Le fil disparaît dans le bois en direction du coffret."],
    ],
    agir: [
      ["Narrateur", "Elle frappe la note trois fois au rythme de la chanson. Un déclic répond sous le bureau."],
      ["Iriana", "Enfin une réponse qui accepte de se montrer."],
      ["Narrateur", "Un tiroir avance de quelques millimètres, puis se bloque."],
    ],
    temporiser: [
      ["Iriana", "Je ne déclencherai pas un mécanisme inconnu avant d'avoir inspecté la pièce."],
      ["Narrateur", "Elle marque la touche avec un grain de cire invisible depuis l'entrée."],
      ["Iriana", "Le piano attendra. Il paraît avoir attendu longtemps."],
    ],
  }, [
    ["Narrateur", "La fausse note devient un repère entre la musique, le bureau et le coffret."],
    ["Iriana", "Amanea n'a rien laissé au hasard. Même ses défauts obéissent."],
    ["Narrateur", "Cette rigueur lui paraît beaucoup trop familière."],
  ]);

  add("akuhn-iriana-coffret:bureau:cartes", [
    ["Narrateur", "Trois rapports reposent exactement au bord du bureau, tournés vers le fauteuil d'Iriana."],
    ["Iriana", "Oubliés, bien entendu."],
    ["Narrateur", "Le premier décrit des convois humanitaires. Le deuxième recense les attaques impériales. Le troisième établit les pertes civiles des deux camps."],
    ["Iriana", "Elle a préparé l'ordre de lecture."],
  ], {
    observer: [
      ["Narrateur", "Iriana examine les plis et la poussière. Seul le troisième rapport a été consulté récemment."],
      ["Iriana", "Les deux premiers construisent l'accusation. Le dernier l'oblige à reconnaître aussi ses propres morts."],
      ["Narrateur", "Amanea a choisi de laisser visible le document le moins favorable à sa propagande."],
    ],
    agir: [
      ["Narrateur", "Iriana change l'ordre des dossiers et place les pertes obscurcies en premier."],
      ["Iriana", "Voyons si elle remarquera que j'ai refusé sa progression."],
      ["Narrateur", "Elle ajoute une marque discrète sur la page où les chiffres ne concordent pas."],
    ],
    temporiser: [
      ["Narrateur", "Iriana lit les titres et laisse les dossiers fermés."],
      ["Iriana", "Lire ce qu'elle a exposé reste déjà une réponse à sa mise en scène."],
      ["Narrateur", "Elle relève les dates avant de s'éloigner du bureau."],
    ],
  }, [
    ["Narrateur", "Iriana sépare mentalement les faits vérifiables de ceux qu'Amanea a disposés pour orienter son regard."],
    ["Iriana", "Elle me montre une vérité et choisit son cadre. La cour impériale l'a bien formée malgré elle."],
    ["Narrateur", "Elle emporte seulement les questions qu'aucun dossier n'avait anticipées."],
  ]);

  add("akuhn-iriana-coffret:bureau:plus-deux-routes", [
    ["Narrateur", "Deux tracés relient Akuhn'Nabad au même point de la Forêt Interdite. L'encre noire appartient à Amanea. Le second itinéraire est noté d'une main inconnue."],
    ["Iriana", "Chaque détour d'Amanea y est anticipé."],
    ["Narrateur", "Les annotations inconnues précèdent parfois de plusieurs jours les corrections de la Reine Noire."],
    ["Iriana", "Quelqu'un prévoyait ses décisions ou les provoquait."],
  ], {
    observer: [
      ["Narrateur", "Iriana compare les pressions de plume. L'autre main hésite seulement près des anciens sites liés aux Farae."],
      ["Iriana", "La personne connaissait la région et redoutait certains lieux."],
      ["Narrateur", "Une peur personnelle se dessine derrière la précision militaire."],
    ],
    agir: [
      ["Narrateur", "Iriana superpose une feuille fine et copie uniquement les divergences."],
      ["Iriana", "Une carte volée serait une faute diplomatique. Une liste de questions demeure un outil de conversation."],
      ["Narrateur", "Elle replie la copie dans sa manche."],
    ],
    temporiser: [
      ["Iriana", "Amanea a peut-être laissé cette carte pour me faire chercher une troisième personne."],
      ["Narrateur", "Elle refuse le rôle prévu et mémorise seulement le premier point de rupture."],
      ["Iriana", "Elle devra prononcer elle-même le nom."],
    ],
  }, [
    ["Narrateur", "Les routes mènent au même lieu, mais elles racontent deux décisions incompatibles."],
    ["Iriana", "La divergence importe davantage que la destination."],
    ["Narrateur", "Elle replace les cartes dans l'ordre exact où elle les a trouvées."],
  ]);

  add("akuhn-iriana-coffret:coffret:ancrage", [
    ["Narrateur", "La mèche pulse au fond du coffret. Chaque battement attire les pensées d'Iriana vers une émotion qui ne lui appartient pas encore."],
    ["Iriana", "Une mémoire étrangère cherchera à parler avec ma voix."],
    ["Narrateur", "Elle inspecte la pièce et choisit ce qui pourra la ramener au présent."],
    ["Iriana", "Je n'entrerai pas sans laisser une porte derrière moi."],
  ], {
    observer: [
      ["Narrateur", "Iriana retient trois détails : la cire sous son pouce, la couture de sa manche, le bruit irrégulier d'une bougie."],
      ["Iriana", "Des sensations sans histoire. Amanea ne pourra pas les confondre avec les siennes."],
      ["Narrateur", "Elle les répète jusqu'à pouvoir les retrouver les yeux fermés."],
    ],
    agir: [
      ["Narrateur", "Iriana retire sa bague impériale et la serre dans sa paume."],
      ["Iriana", "Je suis Iriana Farae. Héritière de l'Empire, témoin de cette mémoire, propriétaire de mes décisions."],
      ["Narrateur", "Les arêtes du sceau impriment sa peau."],
    ],
    temporiser: [
      ["Narrateur", "Elle éloigne la mèche et attend que son souffle retrouve un rythme régulier."],
      ["Iriana", "L'urgence appartient à celle qui a préparé le coffret. Je conserverai mon propre temps."],
      ["Narrateur", "Le battement magique ralentit avec elle."],
    ],
  }, [
    ["Narrateur", "L'ancrage paraît infime devant la force contenue dans la mèche."],
    ["Iriana", "Infime suffit, pourvu qu'il soit mien."],
    ["Narrateur", "Elle approche enfin la main du souvenir."],
  ]);

  add("akuhn-iriana-coffret:coffret:plus-objet-sans-nom", [
    ["Narrateur", "Sous la mèche repose une pièce de métal sombre. Elle tient entre deux doigts et possède les dents d'une clef dont la tige aurait été brisée."],
    ["Iriana", "Aucune étiquette. Aucun emplacement décrit dans le journal."],
    ["Narrateur", "Le velours est plus usé sous cet objet que sous tous les autres."],
    ["Iriana", "Tu l'as souvent pris en main, Amanea."],
  ], {
    observer: [
      ["Narrateur", "Iriana examine les bords. Une trace claire indique qu'une seconde moitié s'y emboîtait."],
      ["Iriana", "Une clef partagée, ou volontairement rendue inutilisable."],
      ["Narrateur", "Le métal se réchauffe lorsqu'elle prononce le nom d'Amanea."],
    ],
    agir: [
      ["Narrateur", "Iriana soulève la pièce. Une pulsation traverse le coffret et la mélodie du piano résonne derrière elle."],
      ["Iriana", "Tu voulais que je la touche avant le souvenir."],
      ["Narrateur", "Elle en mémorise le poids avant de la reposer."],
    ],
    temporiser: [
      ["Iriana", "Un objet inexpliqué placé au centre d'un piège émotionnel restera exactement où il est."],
      ["Narrateur", "Elle glisse une feuille sous le métal pour en relever le contour sans contact."],
      ["Iriana", "La prudence possède parfois une forme très précise."],
    ],
  }, [
    ["Narrateur", "La pièce reste muette, mais son emplacement prouve qu'Amanea lui accordait une valeur intime."],
    ["Iriana", "Je demanderai ce qu'elle ouvre lorsqu'elle ne pourra plus prétendre que je ne l'ai pas vue."],
    ["Narrateur", "Le coffret pulse une nouvelle fois sous sa main."],
  ]);

  add("bal-entracte-groupe:alcove:pacte-bal", [
    ["Narrateur", "Derrière le rideau de l'alcôve, la musique baisse enfin. Remerii vérifie aussitôt le reflet de la salle dans une carafe."],
    ["Hylee", "Tu surveilles encore qui nous regarde ?"],
    ["Remerii", "Deux conseillers, une duchesse et un homme qui tient son verre depuis dix minutes sans boire."],
    ["Hylee", "Peut-être qu'il n'aime pas le vin."],
    ["Remerii", "Alors sa présence à la cour est encore plus suspecte."],
    ["Narrateur", "Elles rient bas, puis le silence ramène ce qui reste tendu entre elles."],
  ], {
    lucidite: [
      ["Hylee", "Ils attendent que l'une de nous s'éloigne pour décider que les geôles nous ont séparées."],
      ["Remerii", "Nous n'avons aucune obligation de leur offrir une conclusion."],
      ["Hylee", "On reste proches sans jouer un bonheur parfait."],
      ["Remerii", "Enfin une stratégie de cour que je peux respecter."],
    ],
    audace: [
      ["Hylee", "Je pourrais retourner dans la salle à ton bras et sourire à l'homme au verre."],
      ["Remerii", "Cruel. Il devra choisir entre boire et prendre des notes."],
      ["Narrateur", "Remerii lui offre son bras avec une élégance ouvertement provocatrice."],
    ],
    sangfroid: [
      ["Hylee", "On ne décide rien ici. Si l'une a besoin d'air, elle le dit. L'autre ne l'interprète pas."],
      ["Remerii", "Une règle raisonnable, au milieu d'une soirée qui les punit."],
      ["Narrateur", "Ses épaules se relâchent enfin contre le dossier."],
    ],
  }, [
    ["Remerii", "Nos désaccords nous appartiennent. La cour devra trouver un autre divertissement."],
    ["Hylee", "Valurn porte une veste neuve. Ils survivront."],
    ["Narrateur", "Elles quittent l'alcôve sans masquer leur fatigue ni laisser les regards la définir."],
  ]);

  add("bal-entracte-groupe:alcove:plus-minute-sans-regard", [
    ["Narrateur", "Le rideau retombe. Remerii pose une main sur son corsage et prend enfin une vraie inspiration."],
    ["Remerii", "Ta tenue ne te gêne pas ?"],
    ["Hylee", "Un peu aux épaules. Pourquoi ?"],
    ["Remerii", "Aucune raison particulière."],
    ["Narrateur", "Son regard descend vers les mains d'Hylee, puis remonte beaucoup trop vite."],
  ], {
    lucidite: [
      ["Hylee", "Tu veux savoir si je regrette d'être venue avec toi."],
      ["Remerii", "Je voulais vérifier ton confort vestimentaire."],
      ["Hylee", "Je ne regrette pas."],
      ["Narrateur", "Remerii cesse de lisser le même pli de sa manche."],
    ],
    audace: [
      ["Hylee", "La tenue va mieux quand tu me regardes comme ça."],
      ["Remerii", "Hylee."],
      ["Hylee", "Quoi ? Je réponds précisément."],
      ["Narrateur", "La couleur qui monte aux joues de Remerii ruine toute tentative de réprimande."],
    ],
    sangfroid: [
      ["Hylee", "Je vais bien. Toi, tu as besoin d'une minute sans tenir ton dos droit."],
      ["Remerii", "Ma posture est irréprochable."],
      ["Hylee", "Pose ta tête là et continue à le prétendre."],
      ["Narrateur", "Remerii cède une seconde contre son épaule."],
    ],
  }, [
    ["Narrateur", "Des pas approchent derrière le rideau. Remerii se redresse, mais garde les doigts d'Hylee dans les siens."],
    ["Remerii", "Une minute exactement."],
    ["Hylee", "Tu comptes ?"],
    ["Remerii", "Je conserve des normes, même dans la faiblesse."],
  ]);

  add("bal-entracte-groupe:balcon:lecture-naiah", [
    ["Naïah", "La femme en vert chasse le vieux monsieur à plume. Le couple près de la porte fuit tout le monde. Et l'homme derrière la colonne pense que personne ne voit son couteau."],
    ["Hylee", "Tu as compris tout ça en regardant la salle ?"],
    ["Naïah", "Non. J'ai inventé la moitié pour voir laquelle tu croirais."],
    ["Hylee", "Le couteau ?"],
    ["Naïah", "Lui, il est vrai. Regarde son coude."],
  ], {
    lucidite: [
      ["Hylee", "Il protège son côté gauche, mais observe la sortie de service. Il attend quelqu'un."],
      ["Naïah", "Ou il veut qu'on le pense. Tu progresses."],
      ["Hylee", "Laquelle des deux ?"],
      ["Naïah", "Je n'ai pas décidé. C'est ça qui est amusant."],
    ],
    resonance: [
      ["Hylee", "La magie s'accumule près de la femme en vert. Elle porte plusieurs charmes d'influence."],
      ["Naïah", "Voilà pourquoi tout le monde rit une seconde trop tard à ses plaisanteries."],
      ["Hylee", "On devrait prévenir quelqu'un."],
      ["Naïah", "On devrait d'abord voir qui refuse de rire."],
    ],
    audace: [
      ["Hylee", "On descend et on demande directement à l'homme pourquoi il a un couteau."],
      ["Naïah", "Enfin une activité de bal adaptée à mes goûts."],
      ["Hylee", "On demande. On ne le vole pas."],
      ["Naïah", "Tu détruis toujours la meilleure partie du plan."],
    ],
  }, [
    ["Narrateur", "Naïah lui indique les groupes dangereux, les alliés possibles et les personnes réellement seules."],
    ["Hylee", "Tu lis la cour mieux qu'Iriana."],
    ["Naïah", "Iriana cherche qui va gagner. Moi, je cherche qui mordra avant."],
  ]);

  add("bal-entracte-groupe:balcon:plus-etiquette-naiah", [
    ["Naïah", "Regarde. Celle-ci tient son verre par le pied, lui par le bord, et l'autre ne le lâche jamais. Laquelle empêche les gens de venir parler ?"],
    ["Hylee", "Aucune. Le verre sert surtout à boire."],
    ["Naïah", "Alors toute cette soirée manque d'efficacité."],
    ["Narrateur", "Elle reproduit la posture la plus raide et prend un air impérial féroce."],
    ["Naïah", "Et comme ça ?"],
  ], {
    lucidite: [
      ["Hylee", "Le verre vide signifie qu'on attend de partir. Le plein, qu'on veut rester. Tu gardes le tien à moitié."],
      ["Naïah", "Pour dire que je peux m'enfuir ou le jeter."],
      ["Hylee", "Personne ne connaît ce code."],
      ["Naïah", "Ils apprendront vite."],
    ],
    audace: [
      ["Hylee", "Tiens-le à l'envers."],
      ["Naïah", "Le vin va tomber."],
      ["Hylee", "Oui, et personne ne viendra parler de trop près."],
      ["Narrateur", "Naïah contemple cette solution avec un respect nouveau."],
    ],
    sangfroid: [
      ["Hylee", "Pose-le et dis que tu veux être seule."],
      ["Naïah", "Avec des mots ? Devant des nobles ?"],
      ["Hylee", "Tu peux ajouter ton sourire inquiétant."],
      ["Naïah", "Voilà une concession acceptable."],
    ],
  }, [
    ["Narrateur", "Elles inventent trois positions : secours, ennui et extraction urgente du buffet."],
    ["Naïah", "Si je le tiens comme ça, tu viens immédiatement."],
    ["Hylee", "Tu viens de le poser sur ta tête."],
    ["Naïah", "Impossible à mal interpréter."],
  ]);

  add("bal-entracte-groupe:buffet:rumeur", [
    ["Noble", "Forthaven aurait perdu la moitié de ses remparts. Draven cache l'état réel de la ville pour garder son siège au Conseil."],
    ["Valurn", "Une rumeur si mal assaisonnée au milieu d'un buffet pareil. Quelle tristesse."],
    ["Hylee", "Tu sais si c'est faux ?"],
    ["Valurn", "Je sais surtout qui souhaite que Draven se défende en public."],
    ["Narrateur", "Le noble se rapproche, convaincu de parler assez bas."],
  ], {
    lucidite: [
      ["Hylee", "Il cite une attaque récente, mais les remparts étaient déjà réparés quand nous sommes partis."],
      ["Valurn", "Corriger la date suffit. La rumeur s'effondrera sans que Draven ait à la toucher."],
      ["Narrateur", "Hylee pose innocemment la question au noble, qui perd aussitôt son assurance."],
    ],
    audace: [
      ["Hylee", "Je peux lui dire que j'y étais."],
      ["Valurn", "Dis-le assez fort pour que les trois personnes qui l'écoutent prétendent l'avoir toujours su."],
      ["Narrateur", "Hylee intervient et le cercle change immédiatement de sujet."],
    ],
    sangfroid: [
      ["Hylee", "Si on l'attaque, il se posera en victime. On peut laisser quelqu'un d'autre répéter la correction."],
      ["Valurn", "Excellent. Une vérité qui arrive d'une source qu'il ne peut pas accuser."],
      ["Narrateur", "Valurn glisse l'information à une dame connue pour ne jamais garder un secret."],
    ],
  }, [
    ["Narrateur", "La rumeur continue de circuler, privée de sa date et de sa certitude."],
    ["Valurn", "Nous ne l'avons pas tuée. Nous lui avons seulement donné un propriétaire embarrassant."],
    ["Hylee", "Tu as l'air très heureux."],
    ["Valurn", "J'adore la justice quand elle porte une belle tenue."],
  ]);

  add("bal-entracte-groupe:buffet:plus-epice-inconnue", [
    ["Valurn", "Safran des Calciterres. Très rare, légèrement euphorisant et interdit dans quatre royaumes."],
    ["Narrateur", "Il approche sa fourchette du plat, puis suspend le geste."],
    ["Hylee", "Tu viens d'inventer tout ça."],
    ["Valurn", "Je suis blessé par ce manque de confiance."],
    ["Hylee", "Tu ne veux pas goûter."],
    ["Valurn", "J'accorde au cuisinier un instant pour admirer son œuvre."],
  ], {
    lucidite: [
      ["Hylee", "L'étiquette du plat indique racine de soleil. Et tu lis très bien."],
      ["Valurn", "Je protégeais le mystère culinaire de cette soirée."],
      ["Hylee", "Tu as peur que ce soit fort."],
      ["Narrateur", "Il prend enfin une bouchée sous son regard."],
    ],
    audace: [
      ["Hylee", "On goûte ensemble."],
      ["Valurn", "Si nous mourons, arrange-toi pour tomber avec élégance."],
      ["Narrateur", "Ils mordent au même instant. Valurn tousse le premier."],
      ["Hylee", "Très euphorisant."],
    ],
    sangfroid: [
      ["Hylee", "On demande au serveur."],
      ["Valurn", "Tu veux introduire un professionnel dans notre duel de mauvaise foi ?"],
      ["Serveur", "C'est du poivre rouge, monsieur."],
      ["Valurn", "Je déteste déjà cet homme."],
    ],
  }, [
    ["Narrateur", "Hylee termine sa bouchée pendant que Valurn cherche dignement de l'eau."],
    ["Valurn", "Je maintiens mon identification initiale."],
    ["Hylee", "Même les quatre royaumes ?"],
    ["Valurn", "Surtout eux. Leur cuisine manque de courage."],
  ]);

  add("bal-entracte-groupe:buffet:confidence-valurn-bhaal", [
    ["Narrateur", "Un père corrige sèchement la posture de son fils près du buffet. Le garçon se tait avant même que la phrase soit terminée."],
    ["Valurn", "Cette scène manque d'originalité."],
    ["Hylee", "Ton père faisait ça ?"],
    ["Valurn", "Bhaal préférait corriger les pensées. La posture suivait naturellement."],
    ["Narrateur", "Il choisit une nouvelle coupe sans boire celle qu'il tient."],
  ], {
    lucidite: [
      ["Hylee", "Tu plaisantes chaque fois que tu utilises son nom."],
      ["Valurn", "Ma voix arrive avant la sienne. C'est l'objectif."],
      ["Hylee", "Tu l'entends encore ?"],
      ["Valurn", "Seulement quand je doute. Il possède un goût remarquable pour les entrées tardives."],
    ],
    audace: [
      ["Hylee", "Tu lui ressembles ?"],
      ["Narrateur", "La flamme dans les yeux de Valurn se resserre."],
      ["Valurn", "Chaque fois que je fais du mal en appelant cela une leçon. La différence tient dans le moment où je décide d'arrêter."],
      ["Hylee", "Tu y arrives ?"],
      ["Valurn", "Pas toujours."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux laisser le garçon tranquille et rester ici."],
      ["Valurn", "Tu m'épargnes une intervention héroïque ?"],
      ["Hylee", "Je t'épargne le rôle que cette scène vient de choisir pour toi."],
      ["Narrateur", "Il repose enfin la coupe vide."],
    ],
  }, [
    ["Valurn", "J'ai appris très tôt que provoquer le premier permettait de garder le contrôle de la blessure."],
    ["Hylee", "Et quand tu n'as pas envie de contrôler ?"],
    ["Valurn", "Je trouve quelqu'un devant qui le silence ne ressemble pas à une défaite."],
    ["Narrateur", "Il reste avec elle jusqu'à ce que le père et le fils quittent la salle."],
  ]);

  add("akuhn-apres-souvenir:sol:reprendre-souffle", [
    ["Narrateur", "Iriana revient au présent à genoux près du coffret. La peine d'Amanea traverse encore sa poitrine avec une intimité insupportable."],
    ["Iriana", "La cire sous mon pouce."],
    ["Narrateur", "Elle trouve le sceau de sa bague, la couture de sa manche et le claquement irrégulier de la bougie."],
    ["Iriana", "Je suis Iriana."],
  ], {
    observer: [
      ["Narrateur", "Elle nomme chaque sensation avant d'examiner l'émotion qui la suit."],
      ["Iriana", "Cette peur vient d'Amanea. Ma colère, elle, m'appartient."],
      ["Narrateur", "La distinction ne diminue aucune des deux. Elle les remet à leur place."],
    ],
    agir: [
      ["Narrateur", "Iriana ferme le coffret et l'éloigne d'un geste sec."],
      ["Iriana", "Tu ne continueras pas à parler dans ma tête sans ma permission."],
      ["Narrateur", "Le battement magique s'arrête sous le couvercle."],
    ],
    temporiser: [
      ["Narrateur", "Elle reste immobile jusqu'à pouvoir respirer sans retrouver le souffle d'Amanea dans le sien."],
      ["Iriana", "Je déciderai plus tard ce que cette mémoire change."],
      ["Narrateur", "Pour une fois, elle refuse d'exiger d'elle-même une conclusion immédiate."],
    ],
  }, [
    ["Narrateur", "La pièce retrouve ses limites. La mémoire reste entière, mais elle cesse de recouvrir chaque objet."],
    ["Iriana", "Je l'ai vue. Je ne l'ai pas vécue."],
    ["Narrateur", "Elle se relève en s'appuyant sur le bureau plutôt que sur le coffret."],
  ]);

  add("akuhn-apres-souvenir:sol:plus-trace-poussiere", [
    ["Narrateur", "Sous le coffret, une empreinte plus large apparaît dans la poussière. Un autre objet occupait cette place récemment."],
    ["Iriana", "Le souvenir a été préparé avant mon arrivée."],
    ["Narrateur", "Deux angles nets indiquent un second coffret ou un livre épais."],
    ["Iriana", "Amanea m'a montré une sélection, pas ses archives."],
  ], {
    observer: [
      ["Narrateur", "Iriana suit les traces de doigts jusqu'au bord du bureau. L'objet a été emporté vers la porte, pas rangé dans la pièce."],
      ["Iriana", "Quelqu'un l'a retiré après avoir nettoyé le reste."],
      ["Narrateur", "La précipitation a laissé une ligne de poussière sur le tapis."],
    ],
    agir: [
      ["Narrateur", "Elle mesure l'empreinte avec le ruban de sa manche et note les dimensions dans la marge d'un feuillet."],
      ["Iriana", "Je ne demanderai pas quel objet manque. Je demanderai qui l'a déplacé."],
      ["Narrateur", "La formulation protège ce qu'elle sait déjà."],
    ],
    temporiser: [
      ["Iriana", "Une absence trop visible peut être un nouvel appât."],
      ["Narrateur", "Elle ne touche pas la trace et mémorise la position des meubles."],
      ["Iriana", "Amanea devra choisir si elle souhaite que je la remarque ouvertement."],
    ],
  }, [
    ["Narrateur", "Le vide prend une forme, un poids probable et une direction."],
    ["Iriana", "Une mémoire choisie reste capable de dire vrai. Elle ne devient pas complète pour autant."],
    ["Narrateur", "Cette prudence lui rend une part de son jugement."],
  ]);

  add("akuhn-apres-souvenir:fenetre:regarder-present", [
    ["Narrateur", "Iriana ouvre la fenêtre. Dans les rues, une patrouille escorte des soigneurs et deux enfants courent après une lanterne."],
    ["Iriana", "La ville existait avant cette mémoire. Elle continuera après elle."],
    ["Narrateur", "Amanea enfant, Amanea blessée et la reine qui gouverne aujourd'hui refusent encore de former une seule réponse."],
    ["Iriana", "Comprendre une origine ne juge pas tout ce qui l'a suivie."],
  ], {
    observer: [
      ["Narrateur", "Iriana compare la discipline des rondes aux ordres décrits dans les rapports."],
      ["Iriana", "Elle protège réellement cette population. Elle l'utilise aussi pour soutenir une guerre."],
      ["Narrateur", "Les deux faits restent visibles ensemble."],
    ],
    agir: [
      ["Narrateur", "Elle demande du papier et rédige les premières questions pour leur prochaine conversation."],
      ["Iriana", "Je ne l'absoudrai pas avec sa douleur. Je ne nierai plus cette douleur pour faciliter ma condamnation."],
      ["Narrateur", "La première question porte sur les civils, la seconde sur l'Empire."],
    ],
    temporiser: [
      ["Narrateur", "Iriana observe la ville sans préparer d'argument."],
      ["Iriana", "Je peux laisser les faits exister une nuit sans les enrôler."],
      ["Narrateur", "Une décision modeste, et difficile pour quelqu'un formé à toujours conclure."],
    ],
  }, [
    ["Narrateur", "Les feux verts tracent les rues du présent sous sa fenêtre."],
    ["Iriana", "Amanea choisit encore aujourd'hui. Moi aussi."],
    ["Narrateur", "Elle quitte enfin la vitre sans refermer les volets."],
  ]);

  add("akuhn-apres-souvenir:fenetre:plus-reflet-amanea", [
    ["Narrateur", "Le reflet d'Iriana reproduit son mouvement avec un léger retard. Pendant une seconde, la silhouette porte la cape d'Amanea."],
    ["Iriana", "Assez."],
    ["Narrateur", "Le reflet tourne la tête après elle. Aucun sort visible ne relie la vitre au coffret."],
    ["Iriana", "Montre-toi ou disparais."],
  ], {
    observer: [
      ["Narrateur", "Iriana lève une main, puis change brusquement de mouvement. Le reflet d'Amanea répète le premier geste."],
      ["Iriana", "Une rémanence de la mémoire. Elle rejoue, elle n'observe pas."],
      ["Narrateur", "Le retard diminue à mesure que sa respiration se calme."],
    ],
    agir: [
      ["Narrateur", "Iriana pose sa paume contre la vitre. La cape sombre se fragmente autour de son bras."],
      ["Iriana", "Tu ne prendras pas mon visage."],
      ["Narrateur", "Une onde froide traverse le verre et l'image redevient la sienne."],
    ],
    temporiser: [
      ["Narrateur", "Iriana recule hors du reflet et attend sans lui offrir de nouveau mouvement."],
      ["Narrateur", "La silhouette d'Amanea reste seule une seconde, puis s'efface avec la flamme d'une bougie."],
      ["Iriana", "Une menace aurait insisté. Un souvenir, lui, s'épuise."],
    ],
  }, [
    ["Narrateur", "La vitre reflète de nouveau les vêtements clairs d'Iriana et la pièce réelle derrière elle."],
    ["Iriana", "Fatigue, magie ou avertissement. Je garderai les trois hypothèses."],
    ["Narrateur", "Elle couvre le miroir avant de quitter la pièce."],
  ]);
})();

(function registerBallAndIrianaDepartureScenes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("bal-entre-duels:piste:choisir-danse", [
    ["Narrateur", "Les musiciens reprennent place. Remerii tend la main à Hylee, puis attend avant de l'entraîner sur la piste."],
    ["Remerii", "Cette fois, j'aimerais savoir à quoi tu penses avant le premier pas."],
    ["Hylee", "Tu crains une nouvelle improvisation ?"],
    ["Remerii", "Je crains surtout que tu appelles improvisation ce que les professeurs de danse nomment un accident."],
    ["Hylee", "J'ai trois idées. Deux sont presque raisonnables."],
  ], {
    audace: [
      ["Hylee", "Un défi. On leur montre qu'une humaine peut suivre ta danse et t'obliger à suivre la sienne."],
      ["Remerii", "Tu proposes donc de provoquer la cour entière avec une chorégraphie."],
      ["Hylee", "Quand tu le dis comme ça, mon idée devient excellente."],
      ["Narrateur", "Remerii resserre sa prise avec un sourire qui accepte déjà le duel."],
    ],
    sangfroid: [
      ["Hylee", "Une trêve. Pas de démonstration, pas de message secret. On respire pendant une musique."],
      ["Narrateur", "Remerii regarde la piste, puis revient à Hylee."],
      ["Remerii", "Je crois que j'avais oublié qu'une danse pouvait servir uniquement à danser."],
    ],
    lucidite: [
      ["Hylee", "On commence sur tes pas. À la reprise, tu me laisses choisir. La cour verra une démonstration, nous saurons que c'est une conversation."],
      ["Remerii", "Une structure lisible et une marge d'imprévu contrôlée."],
      ["Hylee", "Tu peux simplement dire que ça te plaît."],
      ["Remerii", "Je pourrais. Je préfère conserver un peu de mystère."],
    ],
  }, [
    ["Narrateur", "La musique donne le signal. Remerii avance sans avoir à deviner ce qu'Hylee attend d'elle."],
    ["Remerii", "Ne regarde pas tes pieds."],
    ["Hylee", "Je vérifie qu'ils sont toujours d'accord."],
    ["Narrateur", "Elles entrent sur la piste en riant assez bas pour garder ce moment entre elles."],
  ]);

  add("bal-entre-duels:piste:plus-main-apres-danse", [
    ["Narrateur", "La dernière note s'éteint. Remerii garde les doigts d'Hylee une seconde après le salut."],
    ["Hylee", "La musique est finie."],
    ["Remerii", "Je l'avais remarqué."],
    ["Narrateur", "Elle retire sa main, puis ajuste inutilement le bracelet d'Hylee."],
    ["Hylee", "Tu peux aussi dire que tu n'avais pas envie de lâcher."],
  ], {
    resonance: [
      ["Hylee", "Ta magie est encore dans ma paume."],
      ["Remerii", "Un résidu de la danse."],
      ["Hylee", "Il remonte quand tu me touches."],
      ["Narrateur", "Remerii reprend brièvement sa main pour vérifier, avec une rigueur peu convaincante."],
    ],
    audace: [
      ["Hylee", "Alors reprends-la."],
      ["Narrateur", "Elle tend la main devant toute la salle."],
      ["Remerii", "Tu n'as vraiment peur de rien."],
      ["Hylee", "Si. J'avance quand même."],
      ["Narrateur", "Remerii entrelace leurs doigts avant que la cour ne réclame une nouvelle révérence."],
    ],
    sangfroid: [
      ["Hylee", "On peut garder cette seconde sans lui demander ce qu'elle promet."],
      ["Remerii", "Voilà une proposition d'une maturité presque inquiétante."],
      ["Narrateur", "Son pouce effleure une dernière fois les phalanges d'Hylee avant de se retirer."],
    ],
  }, [
    ["Narrateur", "Les danseurs suivants envahissent la piste et les séparent de quelques pas."],
    ["Remerii", "Nous reprendrons cette conversation dans un lieu où personne n'évalue notre maintien."],
    ["Hylee", "Avec ou sans musique ?"],
    ["Remerii", "Je n'ai pas encore décidé."],
  ]);

  add("bal-entre-duels:balcon:verifier-naiah", [
    ["Narrateur", "Naïah s'appuie sur la balustrade, parfaitement immobile. En bas, Valurn traverse la salle sans lever les yeux vers elle."],
    ["Hylee", "Je peux rester ?"],
    ["Naïah", "Tu es déjà là. Ce serait fatigant de te jeter par-dessus."],
    ["Hylee", "Tu vas bien ?"],
    ["Naïah", "Question paresseuse. Essaie mieux."],
  ], {
    lucidite: [
      ["Hylee", "Ce que tu as vu dans ses souvenirs a changé la façon dont tu le regardes."],
      ["Naïah", "J'ai surtout appris que les gens peuvent transformer leur lâcheté en sacrifice lorsqu'ils racontent assez bien."],
      ["Hylee", "Tu parles de lui ?"],
      ["Naïah", "Je parle d'une leçon. Laisse-lui encore son nom."],
    ],
    sangfroid: [
      ["Hylee", "Tu n'as rien à m'expliquer. Je voulais seulement que tu ne sois pas seule par obligation."],
      ["Narrateur", "Naïah tapote deux fois la pierre à côté d'elle."],
      ["Naïah", "Tu peux être silencieuse ici. Ailleurs, ça te va moins bien."],
    ],
    resonance: [
      ["Hylee", "Tes ombres tirent toutes vers la salle, mais toi tu restes ici."],
      ["Naïah", "Elles veulent savoir ce qu'il fait. Moi, je sais déjà ce qu'il a fait."],
      ["Narrateur", "Une ombre revient se lover autour de son poignet."],
    ],
  }, [
    ["Narrateur", "Hylee reste près d'elle sans chercher le détail que Naïah protège."],
    ["Naïah", "Tu pourras reposer la question un jour."],
    ["Hylee", "Mieux formulée ?"],
    ["Naïah", "Beaucoup mieux. Je suis exigeante quand je vais mal."],
  ]);

  add("bal-entre-duels:balcon:plus-paris-duel", [
    ["Noble", "Cinq pièces sur la sauvage. Elle trichera avant la troisième mesure."],
    ["Autre noble", "Dix sur la mage humaine. Elle tombera avant."],
    ["Naïah", "Ils parient sur nous avec de très mauvaises cotes."],
    ["Hylee", "Tu veux qu'on leur dise ?"],
    ["Naïah", "Je veux surtout savoir lequel pleurera le plus en perdant."],
  ], {
    audace: [
      ["Hylee", "On mise nous-mêmes. Tout sur toi après la quatrième mesure."],
      ["Naïah", "Et je triche à la cinquième, juste pour préserver leur réputation."],
      ["Narrateur", "Hylee dépose les pièces devant les nobles. Leur conversation s'étrangle net."],
    ],
    sangfroid: [
      ["Hylee", "On les laisse perdre sans leur offrir une scène."],
      ["Naïah", "Cruel. Ils ne sauront même pas à quel moment ils ont été humiliés."],
      ["Narrateur", "Elle mémorise leurs visages et se détourne ostensiblement."],
    ],
    lucidite: [
      ["Hylee", "Celui qui prend les mises cherche à orienter le duel. Il parle aux musiciens entre chaque pari."],
      ["Naïah", "Enfin quelque chose de plus intéressant que les insultes."],
      ["Narrateur", "Elles suivent son regard jusqu'au chef d'orchestre et repèrent le signal prévu."],
    ],
  }, [
    ["Naïah", "Ils pensent que je suis imprévisible parce qu'ils ne me connaissent pas."],
    ["Hylee", "Tu es imprévisible même quand on te connaît."],
    ["Naïah", "Oui, mais toi tu le dis avec respect."],
    ["Narrateur", "Elles retournent vers la salle en connaissant au moins le jeu placé derrière le duel."],
  ]);

  add("bal-entre-duels:couloir:draven-repit", [
    ["Narrateur", "Draven s'est réfugié près d'une fenêtre de service. Il tient une coupe pleine qu'il n'a manifestement pas choisie."],
    ["Hylee", "Tu te caches ?"],
    ["Draven", "Je protège la cour d'une réponse sincère."],
    ["Narrateur", "Dans la salle, un noble rit beaucoup trop fort."],
    ["Draven", "Encore une minute et je lui explique la différence entre une campagne militaire et son dîner."],
  ], {
    sangfroid: [
      ["Narrateur", "Hylee s'appuie au mur sans poser de question."],
      ["Draven", "Tu n'es pas obligée de me tenir compagnie."],
      ["Hylee", "Je sais."],
      ["Narrateur", "Le bruit du bal passe devant eux sans entrer dans leur silence."],
    ],
    lucidite: [
      ["Hylee", "Ils veulent te faire réagir pour pouvoir raconter que Forthaven manque de discipline."],
      ["Draven", "Je sais. Le savoir n'empêche pas leurs voix de me donner envie de casser du mobilier."],
      ["Hylee", "La petite table a l'air fragile."],
      ["Draven", "Ne m'encourage pas."],
    ],
    audace: [
      ["Hylee", "Donne-moi la coupe. Je vais leur dire que l'Amiral reviendra quand la conversation aura gagné en intelligence."],
      ["Draven", "Tu veux déclencher un incident diplomatique à ma place ?"],
      ["Hylee", "Je diversifie mes compétences."],
      ["Narrateur", "Un rire grave lui échappe avant qu'il récupère son sérieux."],
    ],
  }, [
    ["Narrateur", "Draven attend que sa mâchoire se desserre et remet la coupe sur un plateau."],
    ["Draven", "Bon. Je peux rentrer sans tuer personne."],
    ["Hylee", "Une réussite très élégante."],
    ["Draven", "Ne va pas trop loin."],
  ]);

  add("bal-entre-duels:couloir:plus-medaille-draven", [
    ["Hylee", "Ta médaille est à l'envers."],
    ["Draven", "Erreur de bouton."],
    ["Hylee", "Le ruban aussi est retourné."],
    ["Draven", "Erreur complète, alors."],
    ["Narrateur", "Il pose le pouce sur le revers métallique sans chercher à le remettre en place."],
  ], {
    lucidite: [
      ["Hylee", "Elle commémore quelle bataille ?"],
      ["Draven", "La passe de l'Est. Les peintres ont retenu la charge. Moi, je me souviens surtout des hommes qu'on a sortis de la boue après."],
      ["Hylee", "Tu ne veux pas l'exhiber ici."],
      ["Draven", "Pas devant des gens qui trouvent la boue inconvenante."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux la garder comme ça. Je ne dirai rien."],
      ["Draven", "Je n'en ai pas honte."],
      ["Hylee", "Je sais. Tu refuses seulement qu'ils choisissent ce qu'elle signifie."],
      ["Narrateur", "Il retire enfin sa main du revers."],
    ],
    audace: [
      ["Hylee", "Alors enlève-la."],
      ["Draven", "C'est une décoration officielle."],
      ["Hylee", "Portée à l'envers pour ne pas mentir. Tu peux aussi assumer jusqu'au bout."],
      ["Narrateur", "Draven détache la médaille et la glisse dans sa poche."],
    ],
  }, [
    ["Draven", "Une victoire n'efface pas ceux qui n'en sont pas revenus."],
    ["Hylee", "Tu leur parles encore ?"],
    ["Draven", "À chaque fois qu'un imbécile me demande si la bataille était belle."],
    ["Narrateur", "Il retourne vers le bal sans remettre la décoration."],
  ]);

  add("bal-entre-duels:couloir:confidence-draven-famille", [
    ["Narrateur", "Draven sort une feuille pliée de sa poche intérieure. Seuls les mots Je vais bien occupent la première ligne."],
    ["Hylee", "Pour Lineva ?"],
    ["Draven", "Pour elle et sa mère. C'était le projet."],
    ["Hylee", "Tu bloques après trois mots ?"],
    ["Draven", "Après ça, tout sonne faux ou ressemble à un ordre. Mangez bien. Fermez les portes. Ne vous inquiétez pas. Des conneries."],
  ], {
    lucidite: [
      ["Hylee", "Qu'est-ce que tu voudrais leur dire si la lettre ne devait pas être bonne ?"],
      ["Draven", "Que la maison me manque. Le bruit de Lineva dans l'escalier. Sa mère qui déplace mes affaires et prétend qu'elles étaient déjà là."],
      ["Hylee", "Écris ça."],
      ["Draven", "Tu prends des risques avec ma réputation."],
    ],
    audace: [
      ["Hylee", "Tu parles souvent de Lineva. Presque jamais de ta femme."],
      ["Draven", "Parce qu'elle m'attend depuis assez longtemps sans que j'utilise sa patience pour faire de beaux discours."],
      ["Hylee", "Elle aimerait peut-être quand même apparaître dans la lettre."],
      ["Narrateur", "Draven regarde le vide après Je vais bien."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux commencer par vous me manquez. Personne ne te demande d'expliquer tout le reste."],
      ["Draven", "Trois autres mots."],
      ["Narrateur", "Il les écrit lentement, puis cache le papier sous sa paume."],
      ["Draven", "Pas un mot à Valurn."],
    ],
  }, [
    ["Narrateur", "La lettre ne devient pas un rapport. Elle reste maladroite, courte et enfin adressée aux personnes qui l'attendent."],
    ["Draven", "Ma femme dira que j'aurais pu écrire plus tôt."],
    ["Hylee", "Elle aura raison ?"],
    ["Draven", "Évidemment. Inutile de prendre ce ton satisfait."],
  ]);

  add("akuhn-avant-retour-iriana:salon-musique:touche", [
    ["Narrateur", "La touche brisée repose dans un linge sombre. Sa magie réagit chaque fois qu'un garde passe dans le couloir."],
    ["Iriana", "Un objet assez sensible pour trahir sa présence au premier contrôle."],
    ["Narrateur", "La cape d'Iriana possède trois doublures protégées, toutes prévues pour des documents plutôt que pour une preuve enchantée."],
    ["Iriana", "Amanea m'a enseigné à craindre ce palais. J'utiliserai cette leçon pour le quitter."],
  ], {
    observer: [
      ["Narrateur", "Iriana teste les coutures avec une étincelle de Lumière. La doublure près de l'épaule absorbe le signal sans le renvoyer."],
      ["Iriana", "Les gardes chercheront aux manches et à la ceinture. Une princesse ne porte rien elle-même au-dessus du cœur, selon leur protocole."],
      ["Narrateur", "Elle glisse la touche sous l'insigne impérial."],
    ],
    agir: [
      ["Narrateur", "Iriana enveloppe la touche dans son propre sceau magique. La Lumière recouvre la signature d'Amanea."],
      ["Iriana", "Ils percevront mon autorité avant de chercher ce qu'elle protège."],
      ["Narrateur", "La dissimulation est audacieuse précisément parce qu'elle reste visible."],
    ],
    temporiser: [
      ["Iriana", "Je ne la porterai pas pendant la première inspection."],
      ["Narrateur", "Elle la cache dans le double fond de son écritoire et prévoit de la reprendre après le contrôle des bagages."],
      ["Iriana", "Deux gestes risqués valent parfois mieux qu'un seul geste attendu."],
    ],
  }, [
    ["Narrateur", "La touche disparaît dans une protection adaptée à la méthode de contrôle du palais."],
    ["Iriana", "Elle ne deviendra ni un trophée devant le Conseil ni une preuve abandonnée ici."],
    ["Narrateur", "Elle rabat sa cape et rejoint l'escorte."],
  ]);

  add("akuhn-avant-retour-iriana:salon-musique:plus-melodie-reprise", [
    ["Narrateur", "Iriana s'éloigne du piano. Trois notes se jouent derrière elle sans qu'aucune touche ne bouge."],
    ["Iriana", "La chanson ne comporte pas cette mesure."],
    ["Narrateur", "Les notes reprennent, séparées cette fois par une pause régulière."],
    ["Iriana", "Un code, à la dernière minute. Tu restes fidèle à toi-même."],
  ], {
    observer: [
      ["Narrateur", "Iriana compare les intervalles au rythme des feux rituels. Chaque note correspond à une terrasse différente."],
      ["Iriana", "Elle désigne un trajet hors des couloirs officiels."],
      ["Narrateur", "La dernière note pointe vers la sortie des serviteurs."],
    ],
    agir: [
      ["Narrateur", "Iriana répond sur le clavier avec la fin impériale de la chanson."],
      ["Narrateur", "Le piano reprend une seule note, plus douce, puis se tait."],
      ["Iriana", "Message reçu. Réponse refusée."],
    ],
    temporiser: [
      ["Narrateur", "Elle ne touche pas l'instrument et mémorise la séquence complète."],
      ["Iriana", "Un message urgent survivra jusqu'à Al'Gratal. Un piège aussi."],
      ["Narrateur", "Elle note les trois sons par leur position plutôt que leur nom."],
    ],
  }, [
    ["Narrateur", "La mélodie ne la retient pas. Elle lui confie un dernier élément à emporter."],
    ["Iriana", "Je déciderai loin de cette pièce si tu cherchais à m'aider ou à guider encore mes pas."],
    ["Narrateur", "Le piano reste silencieux lorsqu'elle franchit la porte."],
  ]);

  add("akuhn-avant-retour-iriana:antichambre:dernier-message", [
    ["Messager", "Une dernière dépêche pour la reine ?"],
    ["Iriana", "Tout ce que j'écris pourra être lu devant son Conseil."],
    ["Messager", "Tout ce que vous n'écrivez pas aussi."],
    ["Narrateur", "Iriana reconnaît dans cette réponse une franchise que les messagers impériaux apprendraient à éviter."],
    ["Iriana", "Donnez-moi une feuille."],
  ], {
    observer: [
      ["Iriana", "Écrivez : J'ai vu ce que vous vouliez me montrer. Je parlerai aussi de ce que vous avez choisi de cacher."],
      ["Messager", "La reine y verra une menace."],
      ["Iriana", "Elle y verra une observation. Sa réaction lui appartient."],
    ],
    agir: [
      ["Iriana", "Écrivez : Je m'opposerai à la guerre tant qu'une autre voie restera ouverte. Ne m'obligez pas à défendre l'Empire contre vous."],
      ["Messager", "Vous lui confiez votre limite."],
      ["Iriana", "Je lui indique où commencera ma réponse."],
    ],
    temporiser: [
      ["Iriana", "Aucun message officiel."],
      ["Messager", "Elle interprétera le silence."],
      ["Iriana", "Elle interprète déjà chaque mot. Je refuse seulement d'ajouter une pièce à son dossier diplomatique."],
    ],
  }, [
    ["Narrateur", "La dépêche part ou la feuille retourne vierge à la pile."],
    ["Iriana", "Je ne promets aucune paix. Je refuse également de parler comme si la guerre avait déjà gagné."],
    ["Messager", "Je transmettrai exactement ce que vous avez choisi."],
  ]);

  add("akuhn-avant-retour-iriana:antichambre:plus-destination-officielle", [
    ["Intendant obscurci", "Destination du portail ?"],
    ["Iriana", "Al'Gratal."],
    ["Intendant obscurci", "Quartier d'arrivée requis."],
    ["Narrateur", "Écrire palais impérial révélerait le lieu exact où la preuve sera remise. Une fausse destination invaliderait les garanties du portail."],
    ["Iriana", "Votre formulaire possède une curiosité très bien organisée."],
  ], {
    observer: [
      ["Iriana", "Les autres entrées mentionnent une porte de ville, pas un bâtiment."],
      ["Intendant obscurci", "La porte nord suffit si votre relais peut vous y recevoir."],
      ["Iriana", "Alors inscrivez Porte nord, transfert sous escorte impériale."],
    ],
    agir: [
      ["Iriana", "Palais impérial. Je signerai moi-même la ligne."],
      ["Intendant obscurci", "Vous acceptez que cette destination reste dans nos archives."],
      ["Iriana", "Je vous offre une information exacte et inutile. Le palais aurait été votre première hypothèse."],
    ],
    temporiser: [
      ["Iriana", "Inscrivez Délégation Farae, Al'Gratal. Le protocole définira le point de remise après le passage."],
      ["Intendant obscurci", "La formule est recevable."],
      ["Iriana", "Elle existe pour les situations où la précision sert davantage l'observateur que le voyageur."],
    ],
  }, [
    ["Narrateur", "Le registre reçoit une destination vraie sans offrir nécessairement l'itinéraire qui suivra."],
    ["Intendant obscurci", "Vous maniez nos procédures rapidement."],
    ["Iriana", "Une règle écrite révèle toujours ce que son auteur voulait empêcher."],
  ]);

  add("akuhn-avant-retour-iriana:terrasse:promesse", [
    ["Narrateur", "Les feux d'Akuhn'Nabad s'étendent sous Iriana. Elle pourrait revenir devant eux à la tête d'une armée."],
    ["Iriana", "Le Conseil parlera de nécessité. Tia parlera de Lumière. Chacun choisira un mot capable d'effacer les visages."],
    ["Narrateur", "Elle cherche une limite qui survivra à la peur, aux ordres et à sa propre colère."],
    ["Iriana", "Je dois décider avant qu'ils ne décident quelle héritière je serai."],
  ], {
    observer: [
      ["Narrateur", "Iriana regarde les quartiers civils, les rondes et les écoles qu'elle a vus de près."],
      ["Iriana", "Je refuserai toute attaque qui ne distingue pas la cité de son armée."],
      ["Narrateur", "La limite devient concrète : des rues, des portes et des personnes à protéger."],
    ],
    agir: [
      ["Iriana", "Je m'opposerai publiquement à une offensive totale, même si Tia me condamne devant le Conseil."],
      ["Narrateur", "Prononcer la phrase seule ne réduit pas son prix."],
      ["Iriana", "Une limite gardée secrète offre surtout du confort à celle qui la trahit."],
    ],
    temporiser: [
      ["Iriana", "Je ne promets pas de protéger Amanea contre les conséquences de ses actes."],
      ["Narrateur", "Elle laisse la phrase se poser avant la suivante."],
      ["Iriana", "Je promets d'examiner chaque ordre avant de lui prêter mon obéissance."],
    ],
  }, [
    ["Narrateur", "La limite ne résout ni la guerre ni la fracture des Farae."],
    ["Iriana", "Elle me donnera au moins un endroit où rester lorsque tous demanderont d'avancer."],
    ["Narrateur", "Au loin, le portail commence à s'ouvrir."],
  ]);

  add("akuhn-avant-retour-iriana:terrasse:plus-phrase-a-amanea", [
    ["Narrateur", "Un messager fiable attend près de la porte. Iriana dispose d'une feuille et de quelques minutes avant le portail."],
    ["Iriana", "La dépêche officielle appartient aux deux royaumes. Cette phrase n'appartiendrait qu'à nous."],
    ["Narrateur", "Elle écrit Amanea, puis reste devant le nom."],
    ["Iriana", "Un nom sans titre. Voilà déjà une imprudence."],
  ], {
    observer: [
      ["Iriana", "J'ai entendu ta musique avant de comprendre ta colère."],
      ["Narrateur", "Elle relit la phrase et ne lui ajoute ni pardon ni accusation."],
      ["Messager", "Je la remettrai en main propre."],
    ],
    agir: [
      ["Iriana", "La prochaine fois, parle-moi avant de décider ce que je suis capable de comprendre."],
      ["Narrateur", "La formulation possède toute la dureté d'un ordre et toute la fragilité d'une demande."],
      ["Iriana", "Qu'elle choisisse la partie qu'elle entendra."],
    ],
    temporiser: [
      ["Narrateur", "Iriana plie la feuille sans achever la phrase et la garde dans sa manche."],
      ["Messager", "Rien pour la reine ?"],
      ["Iriana", "Pas encore. Certains mots méritent mieux qu'une fuite avant un portail."],
    ],
  }, [
    ["Narrateur", "Le billet part, change de forme ou demeure auprès d'Iriana."],
    ["Iriana", "Le silence ne sera pas une punition. Les mots ne seront pas une absolution."],
    ["Narrateur", "Elle rejoint l'escorte avec ce choix, plus personnel que toutes ses dépêches."],
  ]);
})();

(function registerMorningAndWarEveScenes() {
  "use strict";
  const add = window.SylviniaAuthoredStoryScenes.add;

  add("algratal-matin-apres-bal:chambres:lendemain-remerii", [
    ["Narrateur", "La lumière du matin trouve les vêtements du bal sur deux fauteuils et une chaussure d'Hylee sous le lit."],
    ["Hylee", "Je la cherchais."],
    ["Remerii", "Depuis ton oreiller ? Une méthode peu mobile."],
    ["Narrateur", "Remerii a déjà remis ses cheveux en ordre. Ses doigts reviennent pourtant sans cesse sur le même bouton de sa manche."],
    ["Hylee", "Tu vas continuer à parler de ma chaussure pour éviter de parler de la nuit ?"],
    ["Remerii", "J'espérais gagner au moins jusqu'au thé."],
  ], {
    lucidite: [
      ["Hylee", "Je ne te demande pas de donner un nom à tout. Je veux savoir si tu regrettes."],
      ["Narrateur", "Remerii cesse de toucher son bouton."],
      ["Remerii", "Non. J'ai peur de ce que cela change, et davantage encore de prétendre que rien n'a changé."],
      ["Hylee", "On peut commencer par cette vérité-là."],
    ],
    audace: [
      ["Hylee", "Moi, j'ai envie de t'embrasser avant le thé."],
      ["Remerii", "Ta maîtrise des transitions reste désastreuse."],
      ["Hylee", "C'est un refus ?"],
      ["Narrateur", "Remerii répond en se penchant vers elle, puis murmure contre ses lèvres."],
      ["Remerii", "C'est une critique de forme."],
    ],
    sangfroid: [
      ["Hylee", "Si tu as besoin de temps, prends-le. Je ne vais pas disparaître parce que le matin est arrivé."],
      ["Remerii", "Je préférerais que tu ne formules pas cela avec autant de justesse avant mon premier thé."],
      ["Narrateur", "Elle s'assoit au bord du lit, assez près pour que leurs épaules se touchent."],
    ],
    resonance: [
      ["Hylee", "Notre magie se cherche encore."],
      ["Remerii", "Je la sens. Elle a moins de pudeur que nous."],
      ["Narrateur", "Le froid de Remerii et la chaleur d'Hylee se rencontrent entre leurs mains sans former de sort."],
      ["Hylee", "On pourrait lui emprunter un peu de franchise."],
    ],
  }, [
    ["Narrateur", "Elles ne fixent ni règle définitive ni promesse trop grande pour ce matin."],
    ["Remerii", "La nuit a eu lieu. Ce matin aussi."],
    ["Hylee", "Et le thé ?"],
    ["Remerii", "Il devient urgent, surtout si nous poursuivons cette conversation."],
  ]);

  add("algratal-matin-apres-bal:chambres:plus-rumeurs-couloir", [
    ["Premier serviteur", "Elles ont quitté la piste ensemble."],
    ["Seconde servante", "Elles y sont aussi entrées ensemble. Tu appelles cela une révélation ?"],
    ["Narrateur", "Les voix ralentissent devant la porte. Remerii, penchée sur sa tasse, ne bouge plus."],
    ["Hylee", "Tu les écoutes."],
    ["Remerii", "Je vérifie le niveau de discrétion du personnel impérial. Il est décevant."],
  ], {
    sangfroid: [
      ["Hylee", "Laisse-les passer. Ils ne savent rien de plus que ce qu'ils ont vu."],
      ["Remerii", "Ce qu'ils ont vu leur suffira pour inventer le reste."],
      ["Hylee", "Le reste est à nous."],
      ["Narrateur", "Remerii boit enfin sa gorgée sans quitter la porte des yeux."],
    ],
    audace: [
      ["Hylee", "Je peux ouvrir et leur demander s'ils veulent vérifier une information."],
      ["Remerii", "Tu n'oserais pas."],
      ["Narrateur", "Hylee pose déjà la main sur la poignée."],
      ["Remerii", "Hylee, rassieds-toi. Je retire immédiatement le défi implicite."],
    ],
    lucidite: [
      ["Hylee", "Ils parlent de la danse, pas de cette chambre. Ils cherchent une histoire mondaine, pas notre vérité."],
      ["Remerii", "Voilà qui devrait me rassurer."],
      ["Hylee", "Ça ne te rassure pas ?"],
      ["Remerii", "Un peu. Je déteste que tu l'aies compris avant moi."],
    ],
  }, [
    ["Narrateur", "Les serviteurs reprennent leur marche et la rumeur s'éloigne avec eux."],
    ["Remerii", "La cour peut garder notre sortie de piste. Elle n'aura pas le matin."],
    ["Hylee", "Surtout pas avant qu'on retrouve ma deuxième chaussure."],
  ]);

  add("algratal-matin-apres-bal:galerie:conseiller-masque", [
    ["Draven", "L'homme près de Tia. Tu l'as vu quitter la galerie est ?"],
    ["Hylee", "Masque gris, bague noire, une main toujours dans sa manche."],
    ["Draven", "Saidin a vu la même bague aux geôles."],
    ["Narrateur", "Draven s'arrête entre deux portraits et vérifie que les serviteurs sont assez loin."],
    ["Draven", "On compare les faits. Pas les peurs."],
  ], {
    lucidite: [
      ["Hylee", "Il boitait légèrement au bal. Le garde dont les clefs sonnaient dans les geôles aussi."],
      ["Draven", "Une coïncidence utile, pas encore une identité."],
      ["Hylee", "Sa main cachée pourrait porter une blessure ou une marque."],
      ["Narrateur", "Draven ajoute les deux détails sans les relier par un trait définitif."],
    ],
    sangfroid: [
      ["Hylee", "On garde l'information entre nous jusqu'à vérifier la bague."],
      ["Draven", "Oui. Accuser un conseiller de Tia sans preuve nous ferait sortir du Conseil avant d'avoir ouvert la bouche."],
      ["Narrateur", "Il replie la note et la range derrière sa plaque d'armure."],
    ],
    audace: [
      ["Hylee", "On peut provoquer une nouvelle rencontre et voir s'il reconnaît Saidin."],
      ["Draven", "Risqué."],
      ["Hylee", "Faisable ?"],
      ["Draven", "Avec trois sorties, deux témoins et Valurn loin de l'improvisation."],
    ],
  }, [
    ["Narrateur", "Les souvenirs du bal et des geôles forment une piste cohérente, encore trop fragile pour une accusation."],
    ["Draven", "On apporte des faits au Conseil. Les soupçons restent dans nos poches."],
    ["Hylee", "Avec la note ?"],
    ["Draven", "Dans une autre poche. J'aime l'organisation."],
  ]);

  add("algratal-matin-apres-bal:galerie:plus-portrait-victoire", [
    ["Narrateur", "Une fresque montre une charge impériale sous un ciel propre. Aucun blessé, aucun cheval tombé, aucune boue ne trouble la victoire."],
    ["Draven", "Regarde-moi cette saloperie."],
    ["Hylee", "Les soldats ont tous la même armure."],
    ["Draven", "Et la même taille. Plus pratique pour oublier qu'ils avaient des noms."],
    ["Narrateur", "Il s'approche du cartouche doré avec un mépris tranquille."],
  ], {
    lucidite: [
      ["Hylee", "Le texte mentionne la victoire, pas le nombre de survivants."],
      ["Draven", "Douze hommes sur quarante-deux sont rentrés. Le peintre en a mis soixante pour remplir la colline."],
      ["Hylee", "Tu y étais ?"],
      ["Draven", "J'ai aidé à compter les douze."],
    ],
    audace: [
      ["Hylee", "On devrait écrire le vrai nombre sous le titre."],
      ["Draven", "Tu as de la craie ?"],
      ["Hylee", "Tu es sérieux ?"],
      ["Draven", "J'attends seulement de savoir si ton courage possède du matériel."],
    ],
    sangfroid: [
      ["Hylee", "Qu'est-ce que tu voudrais voir à la place ?"],
      ["Draven", "Le lendemain. Les survivants qui portent les autres. Les familles devant la porte. La partie qui empêche de trouver ça beau."],
      ["Narrateur", "Sa voix reste égale, ce qui donne plus de poids aux mots."],
    ],
  }, [
    ["Draven", "Une bataille peut être nécessaire. Elle ne devient pas propre parce qu'un peintre retire le sang."],
    ["Hylee", "Tu devrais raconter la vraie version."],
    ["Draven", "Je le fais. Les gens préfèrent souvent regarder le mur."],
  ]);

  add("algratal-matin-apres-bal:galerie:confidence-draven-lineva", [
    ["Narrateur", "Sous la fresque, un général victorieux pose avec une enfant immobile. Draven ricane en voyant la petite silhouette."],
    ["Hylee", "Lineva était sage, enfant ?"],
    ["Draven", "À six ans, elle a mordu un instructeur parce qu'il lui avait dit de regarder les garçons s'entraîner."],
    ["Hylee", "Tu étais fier."],
    ["Draven", "J'étais convoqué. J'ai attendu d'être dehors pour être fier."],
    ["Narrateur", "Son rire retombe devant le portrait."],
  ], {
    lucidite: [
      ["Hylee", "Quand a-t-elle commencé à se battre pour de vrai ?"],
      ["Draven", "Trop tôt. D'abord contre des mannequins, puis contre tous ceux qui pensaient pouvoir la ménager."],
      ["Hylee", "Tu l'as entraînée ?"],
      ["Draven", "Quand j'étais là. Cette précision compte plus que je ne l'aimerais."],
    ],
    audace: [
      ["Hylee", "Tu voulais vraiment cette vie pour elle ?"],
      ["Draven", "Je voulais qu'elle puisse choisir sans dépendre de quelqu'un pour rester en vie. J'ai parfois confondu ça avec lui apprendre ma guerre."],
      ["Hylee", "Elle t'en veut ?"],
      ["Draven", "Souvent. Elle a de bonnes raisons et un talent familial pour les exprimer fort."],
    ],
    sangfroid: [
      ["Hylee", "Raconte-moi un souvenir où elle ne porte pas d'armure."],
      ["Draven", "Elle avait huit ans, les deux genoux ouverts et un chien volé sous son manteau. Elle prétendait l'avoir recruté."],
      ["Hylee", "Tu l'as gardé ?"],
      ["Draven", "Douze ans. Il obéissait encore moins qu'elle."],
    ],
  }, [
    ["Draven", "Elle me dépassera. Pas seulement avec une lame."],
    ["Hylee", "Ça te fait peur ?"],
    ["Draven", "Ça me rend fier. La peur vient de tout ce qu'elle devra traverser pour y arriver."],
    ["Narrateur", "Il quitte le portrait avant que l'enfant peinte puisse devenir un autre regret."],
  ]);

  add("algratal-matin-apres-bal:cuisine:repas-naiah", [
    ["Narrateur", "Naïah mange debout près de la table de travail. Elle a choisi le coin d'où elle voit les deux portes."],
    ["Hylee", "Je peux m'asseoir ?"],
    ["Naïah", "Si tu ne demandes pas ce que j'ai vu."],
    ["Hylee", "D'accord."],
    ["Naïah", "Tu acceptes trop vite. C'est suspect."],
    ["Hylee", "Je peux repartir, si ça te rassure."],
    ["Naïah", "Assieds-toi."],
  ], {
    sangfroid: [
      ["Narrateur", "Hylee prend une tranche de pain et mange sans remplir le silence."],
      ["Naïah", "Tu es vraiment capable de ne rien demander."],
      ["Hylee", "Je fais un effort immense. Respecte mon sacrifice."],
      ["Narrateur", "Naïah pousse le pot de confiture vers elle."],
    ],
    lucidite: [
      ["Hylee", "Je veux savoir comment tu vas, pas utiliser ce que tu as vu."],
      ["Naïah", "Les deux questions se ressemblent beaucoup pour quelqu'un qui collecte des réponses."],
      ["Hylee", "Alors tu peux répondre seulement à la première."],
      ["Naïah", "Je suis furieuse. Et j'ai faim. La deuxième chose se soigne mieux."],
    ],
    resonance: [
      ["Hylee", "Tes ombres restent calmes ici."],
      ["Naïah", "La cuisine ne leur ment pas. Un couteau coupe, un feu brûle, le pain remplit le ventre."],
      ["Hylee", "On peut rester avec les choses simples."],
      ["Narrateur", "Naïah déchire une seconde part et la pose devant elle."],
    ],
  }, [
    ["Narrateur", "Le repas se termine sans confession arrachée ni question déguisée."],
    ["Naïah", "Tu reviendras demander plus tard."],
    ["Hylee", "Oui."],
    ["Naïah", "Bien. J'aurais détesté que tu deviennes raisonnable pour toujours."],
  ]);

  add("algratal-matin-apres-bal:cuisine:plus-dejeuner-naiah", [
    ["Cuisinier", "La pâtisserie ne se mange pas avec la viande froide."],
    ["Naïah", "Regarde-moi."],
    ["Narrateur", "Elle pose un morceau de viande sur la crème, ajoute deux baies et mord sous le regard horrifié du cuisinier."],
    ["Hylee", "C'est bon ?"],
    ["Naïah", "Je n'ai pas encore décidé. Lui, par contre, souffre beaucoup."],
  ], {
    audace: [
      ["Hylee", "Donne-moi la même chose."],
      ["Cuisinier", "Mademoiselle..."],
      ["Hylee", "Avec davantage de baies."],
      ["Narrateur", "Naïah lève sa fourchette pour saluer cette trahison collective du protocole."],
    ],
    sangfroid: [
      ["Hylee", "Tu peux manger ce que tu veux sans le transformer en duel."],
      ["Naïah", "Alors comment savoir si c'est meilleur ?"],
      ["Hylee", "Au goût."],
      ["Naïah", "Méthode simpliste. Je vais l'essayer."],
    ],
    lucidite: [
      ["Hylee", "Tu as choisi exactement les trois plats que le cuisinier surveillait."],
      ["Naïah", "Il leur accordait beaucoup trop d'importance. Je l'aide à s'en libérer."],
      ["Cuisinier", "Je vous entends."],
      ["Naïah", "L'aide commence déjà."],
    ],
  }, [
    ["Narrateur", "Le cuisinier finit par retourner à ses casseroles en marmonnant. Naïah continue de manger sans cacher la nourriture."],
    ["Naïah", "La viande gagne avec les baies. La crème n'avait rien demandé."],
    ["Hylee", "Une conclusion scientifique."],
    ["Naïah", "Je publierai mes travaux après le dessert."],
  ]);

  add("algratal-matin-apres-bal:cuisine:confidence-naiah-amanea", [
    ["Narrateur", "Naïah coupe une pomme en quartiers identiques, les dispose en couronne, puis détruit la forme morceau par morceau."],
    ["Hylee", "Tu penses encore à Amanea."],
    ["Naïah", "À la pomme. Notre relation est intense et se termine mal pour elle."],
    ["Hylee", "Naïah."],
    ["Narrateur", "Le couteau s'enfonce dans la planche. Son sourire reste en place, sa main non."],
    ["Naïah", "Je cherche une bonne raison pour qu'une mère ne regarde jamais sa fille. J'en suis toujours à zéro."],
  ], {
    lucidite: [
      ["Hylee", "Si elle répondait honnêtement, qu'est-ce que tu voudrais comprendre ?"],
      ["Naïah", "Ce que j'avais fait. Avant même de savoir parler, qu'est-ce qui était déjà mauvais chez moi ?"],
      ["Hylee", "Rien."],
      ["Naïah", "Tu réponds à sa place. C'est gentil et complètement inutile."],
    ],
    audace: [
      ["Naïah", "Peut-être qu'elle me trouvait simplement très laide."],
      ["Hylee", "Arrête."],
      ["Narrateur", "La fermeté surprend Naïah davantage qu'une plaisanterie."],
      ["Hylee", "Tu peux la haïr sans retourner son silence contre toi."],
      ["Naïah", "Je peux. Je n'ai pas dit que je savais le faire."],
    ],
    sangfroid: [
      ["Hylee", "Tu as le droit de ne pas savoir. Et de trouver ça insupportable."],
      ["Naïah", "Je préfère une réponse affreuse à un vide."],
      ["Hylee", "Alors je resterai avec toi dans le vide jusqu'à ce qu'une vraie réponse existe."],
      ["Narrateur", "Naïah retire enfin le couteau de la planche."],
    ],
  }, [
    ["Naïah", "Si je la dépasse, elle devra bien me regarder."],
    ["Hylee", "Tu voudrais qu'elle te regarde ou qu'elle perde ?"],
    ["Narrateur", "Naïah prend le dernier quartier de pomme et ne le mange pas."],
    ["Naïah", "Aujourd'hui, je ne sais pas."],
  ]);

  add("algratal-apres-conseil:caserne:preparation-combat", [
    ["Draven", "Le Conseil a dessiné l'assaut. Maintenant, on dessine la partie où les gens survivent."],
    ["Narrateur", "Il pose une carte vierge à côté du plan officiel. Les points de soin, les replis et les routes civiles n'y figurent pas encore."],
    ["Hylee", "Ils ont oublié tout ça ?"],
    ["Draven", "Ils l'ont appelé logistique pour pouvoir l'oublier avec un mot propre."],
    ["Narrateur", "Des officiers attendent autour de la table, crayons prêts."],
  ], {
    lucidite: [
      ["Hylee", "Les deux replis empruntent le même pont. S'il tombe, les blessés restent du mauvais côté."],
      ["Draven", "On ouvre une voie par le verger et on place des cordes avant l'aube."],
      ["Officier", "Le passage ralentira les chariots."],
      ["Draven", "Moins qu'un pont au fond de la rivière."],
    ],
    audace: [
      ["Hylee", "On peut préparer un point de soin mobile derrière la seconde ligne au lieu d'attendre les retours."],
      ["Draven", "Plus exposé, beaucoup plus rapide."],
      ["Hylee", "Remerii et moi pouvons protéger le déplacement."],
      ["Draven", "Alors on lui donne deux itinéraires et l'ordre de partir avant d'avoir besoin d'héroïsme."],
    ],
    sangfroid: [
      ["Hylee", "On commence par les civils, puis les blessés, puis les unités capables de couvrir le repli."],
      ["Draven", "Exact. Les combattants valides attendent leur tour pour une fois."],
      ["Narrateur", "Les flèches se placent sur la carte dans un ordre qui privilégie ceux qui avancent le moins vite."],
    ],
  }, [
    ["Narrateur", "Le plan gagne trois sorties, deux points de rassemblement et des responsables nommés."],
    ["Draven", "Personne ne chantera cette carte. Tant mieux, elle aura le temps de servir."],
    ["Hylee", "Je la trouve plutôt belle."],
    ["Draven", "Ne dis jamais ça d'un plan de retraite devant mes officiers."],
  ]);

  add("algratal-apres-conseil:caserne:plus-ordre-mal-compris", [
    ["Premier chef", "Repli au signal rouge."],
    ["Deuxième chef", "Maintien jusqu'au second signal."],
    ["Troisième cheffe", "Couverture de la retraite, puis repli libre."],
    ["Draven", "Vous avez reçu la même foutue consigne."],
    ["Narrateur", "Les trois officiers tiennent chacun une copie identique."],
    ["Hylee", "Alors le problème est peut-être la consigne."],
  ], {
    lucidite: [
      ["Hylee", "Le mot engagement change de sens selon leur position. Il faut nommer l'unité qui décroche en premier."],
      ["Draven", "Écrivez : l'aile gauche se replie au premier rouge, le centre couvre jusqu'au second."],
      ["Narrateur", "Les trois chefs répètent l'ordre avec la même compréhension cette fois."],
    ],
    audace: [
      ["Hylee", "Fais-leur jouer la scène avec des pions. La contradiction apparaîtra immédiatement."],
      ["Draven", "Vous avez entendu. Et celui qui rit remplacera son pion sur le terrain demain."],
      ["Narrateur", "Au troisième mouvement, deux unités occupent la même voie de retraite."],
    ],
    sangfroid: [
      ["Hylee", "Chacun explique ce qu'il ferait sans être interrompu. Ensuite seulement, on réécrit."],
      ["Draven", "Ça évitera de punir le premier qui a eu le courage d'avouer qu'il n'avait pas compris."],
      ["Narrateur", "La colère quitte la table assez longtemps pour laisser apparaître l'ambiguïté."],
    ],
  }, [
    ["Draven", "Un ordre mal compris tue mieux qu'une mauvaise lame. La prochaine fois, vous le signalez avant de fabriquer trois vérités."],
    ["Troisième cheffe", "Oui, Amiral."],
    ["Hylee", "Tu ne vas pas les punir ?"],
    ["Draven", "Pour avoir empêché une catastrophe ? Je garde les punitions pour ceux qui cachent leurs erreurs."],
  ]);

  add("algratal-apres-conseil:caserne:confidence-draven-retour", [
    ["Narrateur", "Draven vérifie une selle déjà inspectée deux fois. Autour de lui, les soldats parlent de leurs projets après la campagne."],
    ["Hylee", "Et toi ?"],
    ["Draven", "Je dors deux jours, je mange quelque chose qui n'a pas voyagé dans une caisse et je me fais engueuler par ma famille."],
    ["Hylee", "Tu souris."],
    ["Draven", "Ma femme dira que j'ai maigri. Lineva dira que je ralentis. Elles auront tort toutes les deux."],
    ["Narrateur", "Il resserre encore la même sangle."],
  ], {
    lucidite: [
      ["Hylee", "Tu parles du retour comme d'une scène déjà prête."],
      ["Draven", "C'est plus simple que d'imaginer ce qui aura changé pendant mon absence."],
      ["Hylee", "Tu crains de rentrer trop tard."],
      ["Draven", "Je crains de retrouver la bonne maison et de ne plus reconnaître la vie dedans."],
    ],
    audace: [
      ["Hylee", "Promets-moi de rentrer."],
      ["Draven", "Non."],
      ["Narrateur", "La réponse est immédiate, sans dureté."],
      ["Draven", "Je te promets de ne pas chercher une belle mort et de faire tout ce que je peux pour revenir. Personne d'honnête ne peut promettre le reste."],
    ],
    sangfroid: [
      ["Hylee", "Je ne te demande pas de promettre. Raconte encore l'escalier derrière l'arsenal."],
      ["Draven", "Au coucher du soleil, Lineva y pose ses bottes sur la rambarde. Sa mère apporte trop à manger et prétend que c'est pour tout le monde."],
      ["Narrateur", "Il lâche enfin la sangle et laisse le souvenir tenir sans garantie."],
    ],
  }, [
    ["Draven", "Je n'ai pas peur de mourir autant que de revenir après que tout le monde aura appris à vivre sans moi."],
    ["Hylee", "Alors rentre pour rencontrer ceux qu'ils seront devenus."],
    ["Narrateur", "Draven hoche la tête et confie la selle à un palefrenier."],
    ["Draven", "D'accord. Mais je commence par survivre à demain."],
  ]);

  add("algratal-apres-conseil:infirmerie:preparer-soins", [
    ["Intendante médicale", "Un nécessaire par escouade. Huit bandages, deux fioles de soin, une pâte pour brûlures et aucun objet inutile."],
    ["Hylee", "Qui décide ce qui est inutile ?"],
    ["Intendante médicale", "Le poids du sac après trois heures de marche."],
    ["Narrateur", "Des fournitures couvrent la table. Plusieurs fioles se ressemblent assez pour devenir dangereuses dans l'obscurité."],
    ["Hylee", "Très bien. On rend chaque sac utilisable par quelqu'un qui tremble."],
  ], {
    lucidite: [
      ["Hylee", "Les fioles de soin et les antidotes ont le même bouchon. On ajoute une encoche différente."],
      ["Intendante médicale", "Une pour le soin, deux pour l'antidote. Lisible avec des gants et sans lumière."],
      ["Narrateur", "Hylee marque chaque bouchon avant de le ranger."],
    ],
    sangfroid: [
      ["Hylee", "On prépare un sac complet, on le pèse, puis on reproduit. Sinon chaque table improvisera sa propre version."],
      ["Intendante médicale", "Enfin quelqu'un qui résiste à l'envie de tout mettre partout."],
      ["Narrateur", "Le modèle circule entre les soigneurs et le rythme se stabilise."],
    ],
    resonance: [
      ["Hylee", "Je peux sceller les produits sensibles avec une vibration qui change s'ils sont contaminés."],
      ["Intendante médicale", "Fais-le sur les fioles rares. Les autres doivent rester ouvrables par un soldat sans magie."],
      ["Narrateur", "Une lueur discrète rejoint les bouchons concernés."],
    ],
  }, [
    ["Narrateur", "Les nécessaires sont fermés, pesés et répartis par unité."],
    ["Intendante médicale", "Demain, personne ne saura qui a préparé ces sacs."],
    ["Hylee", "Tant qu'ils savent les ouvrir."],
    ["Narrateur", "Elle passe au suivant sans attendre de cérémonie."],
  ]);

  add("algratal-apres-conseil:infirmerie:plus-blesse-debout", [
    ["Soldat", "Ma section part à l'aube."],
    ["Soigneur", "Et toi, tu tiens à peine debout."],
    ["Narrateur", "Le soldat tente de remettre son plastron malgré les bandages qui entourent ses côtes."],
    ["Soldat", "Ils auront besoin de moi."],
    ["Hylee", "Ils auront besoin que tu puisses respirer."],
  ], {
    sangfroid: [
      ["Hylee", "Assieds-toi une minute. Dis-moi ce que ta section attend de toi, exactement."],
      ["Soldat", "Je tiens l'inventaire des carreaux."],
      ["Hylee", "Alors fais-le ici et prépare les caisses avant leur départ."],
      ["Narrateur", "Il s'assoit sans avoir l'impression d'être retiré de la mission."],
    ],
    lucidite: [
      ["Hylee", "Si tu pars, quelqu'un devra te porter avant midi. Combien de personnes ta section perdra pour ça ?"],
      ["Narrateur", "Le soldat regarde son plastron, puis le brancard voisin."],
      ["Soldat", "Deux."],
      ["Hylee", "Reste et rends-les disponibles."],
    ],
    audace: [
      ["Hylee", "Donne-moi le plastron."],
      ["Soldat", "Pardon ?"],
      ["Hylee", "Si tu peux me le reprendre sans grimacer, tu pars."],
      ["Narrateur", "Il tire une fois, lâche et jure sous la douleur."],
      ["Hylee", "Tu peux maintenant m'insulter assis."],
    ],
  }, [
    ["Narrateur", "Le soldat reste à l'infirmerie et commence à répartir les munitions depuis une table."],
    ["Soldat", "Je ne vous remercie pas."],
    ["Hylee", "Tu le feras quand tes côtes arrêteront de voter contre toi."],
    ["Soigneur", "Je la réutiliserai, celle-là."],
  ]);

  add("algratal-apres-conseil:balcon:avant-guerre", [
    ["Narrateur", "Sous le balcon, les lanternes s'éteignent une à une. Remerii les compte depuis plusieurs minutes."],
    ["Hylee", "Tu veux vérifier mon équipement une quatrième fois ?"],
    ["Remerii", "Non. J'ai déjà effectué la quatrième vérification pendant que tu aidais à l'infirmerie."],
    ["Hylee", "Alors pourquoi tu m'as demandé de venir ?"],
    ["Narrateur", "Remerii ouvre la bouche, la referme et abandonne la réponse élégante."],
    ["Remerii", "Je refuse que notre dernière conversation éventuelle concerne l'état de tes bottes."],
  ], {
    lucidite: [
      ["Hylee", "Qu'est-ce que tu retiens depuis le Conseil ?"],
      ["Remerii", "Que j'ai peur. Que je te fais confiance. Et que ces deux vérités se disputent chacune de mes décisions."],
      ["Hylee", "Demain, demande-moi avant de choisir pour moi."],
      ["Remerii", "Oui. Même lorsque cela me terrifiera."],
    ],
    audace: [
      ["Hylee", "Je t'aime. Voilà ce que je refuse d'emporter en silence."],
      ["Narrateur", "La maîtrise de Remerii cède entièrement pendant une respiration."],
      ["Remerii", "Tu choisis vraiment tes instants avec une cruauté spectaculaire."],
      ["Hylee", "Tu peux répondre demain."],
      ["Remerii", "Je t'aime aussi. Je refuse de laisser la guerre fixer le délai."],
    ],
    sangfroid: [
      ["Hylee", "Pas d'adieu, pas de promesse impossible. On se dit seulement ce dont on aura besoin demain."],
      ["Remerii", "Ta voix, si la magie devient trop forte. Ta main, si la mienne tremble."],
      ["Hylee", "Et toi près de moi, sans prétendre que tu dois tout porter."],
    ],
    resonance: [
      ["Hylee", "Accorde ta magie à la mienne maintenant. Demain, on pourra se retrouver même dans le chaos."],
      ["Remerii", "Un fil d'ancrage. Aucune prise sur la volonté de l'autre."],
      ["Narrateur", "Leurs paumes se rejoignent et une vibration froide, familière, se fixe entre elles."],
    ],
  }, [
    ["Narrateur", "Aucune phrase ne garantit l'aube suivante. Elles cessent pourtant de protéger les mots du risque de les perdre."],
    ["Remerii", "Tes bottes restent dans un état lamentable."],
    ["Hylee", "Voilà. Maintenant, cette conversation peut survivre à ton inspection."],
    ["Narrateur", "Remerii garde sa main jusqu'à l'extinction de la dernière lanterne."],
  ]);

  add("algratal-apres-conseil:balcon:plus-ville-se-prepare", [
    ["Narrateur", "Les marchés ferment plus tôt. Des familles chargent des couvertures sur des charrettes tandis que les patrouilles doublent aux carrefours."],
    ["Hylee", "Le palais n'a encore rien annoncé."],
    ["Remerii", "Une ville remarque quand ses soldats cessent de rentrer dîner."],
    ["Narrateur", "Une boulangère distribue les invendus à une file qui se forme sans ordre officiel."],
    ["Hylee", "Ils se préparent quand même."],
  ], {
    lucidite: [
      ["Hylee", "Les quartiers près de la porte nord évacuent déjà les enfants. Quelqu'un leur a transmis l'itinéraire."],
      ["Remerii", "Probablement un capitaine qui préfère une sanction à des familles prises dans les colonnes."],
      ["Hylee", "J'espère qu'Iriana le découvrira après leur départ."],
    ],
    resonance: [
      ["Hylee", "La peur traverse toute la ville. Elle se concentre près des portes, puis revient vers le palais."],
      ["Remerii", "Ne la prends pas toute en toi. Elle appartient à des milliers de personnes et aucune ne t'a demandé de la porter."],
      ["Narrateur", "Hylee relâche la trame et garde seulement les points où la panique risque de devenir dangereuse."],
    ],
    sangfroid: [
      ["Hylee", "On pourrait descendre aider une heure, sans uniforme ni discours."],
      ["Remerii", "La boulangère aura probablement davantage d'ordres à nous donner que le Conseil."],
      ["Hylee", "Ça nous changera."],
    ],
  }, [
    ["Narrateur", "Le plan militaire retrouve des fenêtres allumées, des étals fermés et les visages de ceux qui resteront."],
    ["Remerii", "Les conseils parlent toujours de protéger la capitale. Ils devraient parfois la regarder depuis un balcon."],
    ["Hylee", "Ou descendre acheter du pain."],
  ]);

  add("algratal-apres-conseil:balcon:confidence-remerii-demain", [
    ["Narrateur", "Remerii compte les lanternes qui s'éteignent sous le balcon. Hylee attend qu'elle arrive au bout de la rue."],
    ["Hylee", "Tu voulais me parler avant l'aube."],
    ["Remerii", "J'avais préparé plusieurs formulations. Elles avaient toutes l'air d'un adieu ou d'un cours de sécurité."],
    ["Hylee", "Tu peux commencer au milieu."],
    ["Remerii", "Je ne veux plus que la peur décide combien de vérité je te donne."],
    ["Narrateur", "Elle pose ses deux mains sur la balustrade pour qu'Hylee ne voie pas encore leur tremblement."],
  ], {
    lucidite: [
      ["Hylee", "Quelle vérité n'as-tu jamais dite ?"],
      ["Remerii", "Que lorsque je t'enseigne, une partie de moi attend toujours l'instant où tu n'auras plus besoin de moi."],
      ["Hylee", "Ça te fait peur ?"],
      ["Remerii", "Oui. Et j'ai honte d'avoir parfois ralenti tes choix pour retarder cet instant."],
    ],
    audace: [
      ["Narrateur", "Hylee prend ses mains et les retourne paumes vers le haut."],
      ["Hylee", "Tu n'as pas besoin d'être utile pour que je revienne vers toi."],
      ["Remerii", "Je connais cette idée. La croire demande encore de l'entraînement."],
      ["Hylee", "Alors on s'entraîne maintenant."],
    ],
    sangfroid: [
      ["Hylee", "Je refuse qu'on parle comme si l'une de nous était déjà morte."],
      ["Remerii", "Je n'essayais pas de dire adieu."],
      ["Hylee", "Alors reste ici, avec moi, et dis seulement ce qui est vrai cette nuit."],
      ["Narrateur", "Remerii quitte enfin la balustrade et vient se placer contre elle."],
    ],
  }, [
    ["Remerii", "Cette nuit, je t'aime. J'ai peur. Je partirai quand même à tes côtés."],
    ["Hylee", "Moi aussi."],
    ["Narrateur", "Aucune d'elles ne cherche à rendre la phrase plus belle. Leurs mains restent jointes jusqu'au premier appel de la caserne."],
  ]);

  add("algratal-apres-conseil:archives:routes-cachees", [
    ["Narrateur", "La carte du Conseil envoie l'armée par la route centrale. Sous elle, une copie annotée par Iriana ouvre deux replis absents du plan officiel."],
    ["Hylee", "Pourquoi les cacher ?"],
    ["Iriana", "Parce que le conseiller qui a supprimé ces routes siège encore à la table."],
    ["Saidin", "Et parce qu'une issue connue de tous cesse rapidement d'en être une."],
    ["Narrateur", "Valurn referme la porte de la salle derrière lui."],
  ], {
    lucidite: [
      ["Hylee", "La route centrale croise deux points marqués sur la carte d'Amanea. Le Conseil nous envoie là où elle nous attend."],
      ["Iriana", "Ou là où quelqu'un veut que les deux armées se rencontrent."],
      ["Saidin", "Les intentions divergent. Le lieu, lui, demeure dangereusement commun."],
    ],
    sangfroid: [
      ["Hylee", "On copie les replis sans emporter les annotations d'Iriana. Si la salle est fouillée, elle garde sa position."],
      ["Iriana", "Vous protégez mon déni possible."],
      ["Hylee", "Je protège les routes. Votre déni se débrouillera très bien seul."],
      ["Narrateur", "Valurn étouffe un rire devant le regard d'Iriana."],
    ],
    audace: [
      ["Hylee", "On avertit Draven maintenant et il prépare les deux voies sans demander l'autorisation du Conseil."],
      ["Iriana", "Il engagera sa responsabilité."],
      ["Valurn", "Elle cherche à dire qu'elle approuve sans laisser le mot devenir témoin."],
      ["Iriana", "Je cherche surtout combien de temps vous survivriez sans commenter."],
    ],
  }, [
    ["Narrateur", "Une copie dépouillée conserve les divergences et rejoint les documents de terrain."],
    ["Saidin", "Deux cartes valent mieux qu'une certitude lorsqu'elles mentent à des endroits différents."],
    ["Hylee", "Tu pourrais dire qu'on a bien fait."],
    ["Saidin", "Vous le saurez après avoir emprunté la route qui reste."],
  ]);

  add("algratal-apres-conseil:archives:plus-annotation-arrachee", [
    ["Narrateur", "Une bande irrégulière longe la marge du registre militaire. Quelqu'un a arraché une annotation sans toucher au texte principal."],
    ["Iriana", "Le document officiel reste intact. Seule la manière de l'interpréter a disparu."],
    ["Hylee", "On peut retrouver les mots ?"],
    ["Iriana", "Pas entièrement. Assez, peut-être, pour prouver qu'ils existaient."],
    ["Narrateur", "La lumière rasante révèle la pression de la plume sur la page suivante."],
  ], {
    lucidite: [
      ["Hylee", "Je distingue évacuation et avant l'assaut. L'annotation concernait les civils."],
      ["Iriana", "Le plan initial prévoyait donc un délai que le Conseil a supprimé."],
      ["Narrateur", "Elle recopie uniquement les fragments lisibles et marque chaque lacune."],
    ],
    sangfroid: [
      ["Hylee", "On ne force pas une phrase avec ce qu'on espère trouver. On relève les traits, puis quelqu'un d'autre les lira."],
      ["Iriana", "Vous venez de résister à une conclusion politiquement très utile."],
      ["Hylee", "C'est difficile. Je vais m'en remettre."],
    ],
    audace: [
      ["Hylee", "On apporte le registre entier devant le Conseil avant qu'une autre page disparaisse."],
      ["Iriana", "Celui qui a arraché la note saura alors que nous l'avons vue."],
      ["Hylee", "Et il devra agir plus vite. Nous aussi."],
      ["Narrateur", "Iriana referme le registre et pèse le risque sans le dissimuler."],
    ],
  }, [
    ["Narrateur", "Les traces de plume sont copiées avec leurs vides. Elles prouvent une intervention sans inventer le texte perdu."],
    ["Iriana", "Quelqu'un a voulu préserver l'ordre tout en retirant sa limite."],
    ["Hylee", "Demain, on remet la limite sur le terrain."],
  ]);

  add("algratal-apres-conseil:archives:confidence-iriana-devoir", [
    ["Narrateur", "Deux cartes couvrent la table. L'offensive approuvée porte le sceau du Conseil. Les replis secrets portent l'écriture d'Iriana."],
    ["Hylee", "Laquelle montre ce que vous voulez vraiment ?"],
    ["Iriana", "Vous supposez qu'une héritière possède un désir distinct de sa fonction."],
    ["Hylee", "Vous avez quand même dessiné la seconde."],
    ["Narrateur", "Iriana pose la paume sur les voies de repli et protège l'encre de sa manche."],
    ["Iriana", "Je veux que l'Empire survive. Je doute désormais que cela signifie obéir à tous ceux qui prétendent l'incarner."],
  ], {
    lucidite: [
      ["Hylee", "Quelle carte est la vôtre ?"],
      ["Iriana", "Celle qui ramène des soldats, protège les civils et laisse encore une voie pour parler à Amanea."],
      ["Hylee", "C'est la seconde."],
      ["Iriana", "Vous aviez déjà votre réponse. Vous vouliez m'entendre la revendiquer."],
    ],
    audace: [
      ["Hylee", "Alors choisissez contre l'Empire s'il ordonne le pire."],
      ["Iriana", "Ne confondez pas l'Empire avec ceux qui occupent sa table cette nuit."],
      ["Hylee", "Eux le feront quand ils exigeront votre obéissance."],
      ["Narrateur", "Iriana ne répond pas immédiatement. Sa main reste sur la carte clandestine."],
    ],
    sangfroid: [
      ["Hylee", "Vous pouvez encore hésiter. La carte ne disparaîtra pas parce que vous n'avez pas décidé ce soir."],
      ["Iriana", "L'hésitation est rarement offerte aux héritières comme une vertu."],
      ["Hylee", "Prenez-la comme un outil."],
      ["Narrateur", "Le coin de la bouche d'Iriana bouge à peine."],
    ],
  }, [
    ["Iriana", "Mon devoir envers les personnes et mon devoir envers l'institution ne suivent plus la même route."],
    ["Hylee", "Laquelle choisirez-vous ?"],
    ["Iriana", "Demain, je commencerai par empêcher qu'on détruise la première au nom de la seconde."],
    ["Narrateur", "Elle replie elle-même la carte secrète et la confie à Hylee."],
  ]);
})();
