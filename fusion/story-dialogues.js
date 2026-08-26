(function registerSylviniaStoryDialogues() {
  "use strict";

  if (window.SylviniaStoryDialogues) return;

  const NAMES = {
    hylee: "Hylee",
    remerii: "Remerii",
    iriana: "Iriana",
    valurn: "Valurn",
    naiah: "Naïah",
    draven: "Draven",
    lineva: "Lineva",
    saidin: "Saidin",
    amanea: "Amanea",
    bellirith: "Bellirith",
  };

  const POV_LINES = {
    Hylee: {
      open: [
        "Attends… je veux comprendre avant qu’on reparte.",
        "J’ai peut-être une idée. Elle est encore un peu bancale, mais elle existe.",
        "On peut prendre cinq minutes ? Les vraies, pas les cinq minutes de Remerii qui en durent trente secondes.",
        "Je ne promets pas que ce sera élégant. Seulement que je vais essayer.",
        "Il y a quelque chose qui m’échappe, et ça commence sérieusement à m’agacer.",
        "Bon. Si je pose une question idiote, personne ne la grave dans un livre, d’accord ?",
      ],
      lucidite: [
        "Une seconde. Il y a un détail qui ne colle pas.",
        "Je veux reprendre depuis le début. Pas la version pratique : ce qui s’est vraiment passé.",
        "Si on sépare ce qu’on sait de ce qu’on suppose, il reste peut-être une réponse.",
      ],
      audace: [
        "Bon, j’essaie. Si ça tourne mal, j’assumerai le bruit.",
        "Personne ne bouge ? Très bien. Je commence.",
        "J’en ai assez de tourner autour. Voilà ce que je propose.",
      ],
      sangfroid: [
        "On respire. Ensuite seulement, on décide.",
        "Pas besoin de gagner cette minute. Il faut surtout ne pas l’abîmer.",
        "Commençons par ce qui peut être réglé sans ajouter un problème au problème.",
      ],
      resonance: [
        "La magie réagit. Laisse-moi juste un instant pour l’écouter.",
        "Je sens quelque chose ici. Ce n’est pas une réponse… plutôt une direction.",
        "Si j’arrête de forcer, la trame devient plus claire. Enfin, je crois.",
      ],
    },
    Valurn: {
      open: [
        "Voilà une situation admirablement conçue : aucun bon choix, et tout le monde prêt à juger le mauvais.",
        "J’allais prendre une décision raisonnable. Heureusement, personne n’était là pour assister à cette faiblesse.",
        "Voyons ce que cette charmante catastrophe essaie de me vendre.",
      ],
      observer: ["Avant de jeter une pièce, vérifions si le puits a un fond.", "Les mensonges ont une posture. Celui-ci boite.", "Attendons encore une respiration : quelqu’un va se trahir."],
      agir: ["Assez admiré le désastre. À mon tour de l’améliorer.", "Je prends la responsabilité. Et les compliments, s’il en reste.", "La prudence a eu sa chance. Elle l’a gaspillée."],
      temporiser: ["Une porte entrouverte est plus utile qu’un ennemi acculé.", "Remettons le duel à l’instant où je serai certain de gagner.", "Je peux offrir du temps. Pas l’oubli."],
    },
    Draven: {
      open: [
        "Bon. On arrête de contempler le problème et on lui donne un nom.",
        "J’ai vu des plans moins bordéliques survivre à de pires officiers.",
        "S’il faut choisir, on choisit. S’il faut réparer, on répare.",
      ],
      observer: ["Montrez-moi les faits. Les beaux discours iront se faire foutre après.", "On vérifie les lignes, les hommes, puis les issues.", "Quelqu’un cache une erreur. Trouvons-la avant qu’elle tue."],
      agir: ["C’est moi qui tranche. Notez mon nom si vous cherchez un responsable.", "On bouge maintenant. Les excuses marcheront derrière.", "Pas glorieux, mais faisable. Ça me suffit."],
      temporiser: ["On ne recule pas. On se donne l’espace de frapper juste.", "Une nuit de plus vaut mieux qu’un cimetière bien ponctuel.", "Gardez la porte ouverte. Les vivants passent mieux par là."],
    },
    Iriana: {
      open: [
        "Une décision prise trop vite devient souvent le problème de quelqu’un de moins puissant.",
        "Il est instructif de constater tout ce qu’une pièce révèle lorsque chacun croit n’être pas observé.",
        "Je n’ai pas besoin d’une réponse agréable. J’ai besoin d’une réponse utilisable.",
      ],
      observer: ["La première version est trop commode. Je souhaite voir ce qu’elle dissimule.", "Les intentions comptent moins que les conséquences. Examinons-les.", "Attendons. Le prochain geste sera probablement plus honnête que le discours."],
      agir: ["Très bien. Je prends cette décision et ce qu’elle coûtera.", "Nous n’obtiendrons rien de plus en feignant l’hésitation.", "Que cela plaise ou non, voici la direction que je retiens."],
      temporiser: ["Je laisse une issue. N’y voyez pas une faiblesse.", "Nous reprendrons cette conversation lorsque chacun pourra encore entendre l’autre.", "Un délai n’est utile que s’il prépare une décision. Celui-ci le fera."],
    },
  };

  const VOICES = {
    remerii: {
      open: [
        "Je reconnais ce regard. Il précède généralement une idée courageuse, discutable, ou les deux.",
        "Tu peux poser la question, Hylee. La dévisager ne la rendra pas moins indiscrète.",
        "Je t’écoute. Et je me réserve le droit de corriger les trois premières conclusions.",
        "Si tu attends mon autorisation, nous risquons d’y passer la soirée.",
        "Tu as déjà décidé d’insister. Épargne-nous au moins le théâtre de l’hésitation.",
      ],
      lucidite: ["Remerii relève légèrement le menton. « Enfin une question précise. J’allais finir par croire que je t’avais mal formée. »", "« C’est exact. Et suffisamment gênant pour mériter que nous le vérifiions deux fois. »", "« Tu as vu le défaut. Bien. Maintenant, ne tombe pas amoureuse de ta première explication. »"],
      audace: ["Un sourire bref fend sa réserve. « C’est téméraire. J’aurais préféré trouver l’idée mauvaise. »", "« Voilà qui manque délicieusement de prudence. Continue avant que je ne retrouve la mienne. »", "« Je proteste par principe. Dans les faits… avance. »"],
      sangfroid: ["Ses épaules descendent d’un souffle. « Merci. J’étais sur le point de confondre efficacité et précipitation. »", "« D’accord. Une chose après l’autre — et personne ne transforme son épuisement en vertu. »", "« C’est raisonnable. Ne prends pas cet aveu pour une habitude. »"],
      resonance: ["Remerii cesse aussitôt de plaisanter. « Décris-moi la sensation. Pas ce que tu crois qu’elle signifie. »", "« Je la perçois aussi. Plus faible… mais tu n’es pas en train de l’inventer. »", "« Alors écoute-la. Je surveille tout ce qui pourrait décider de répondre. »"],
      motion: ["Elle croise les bras, mais son pied cesse de battre la mesure : elle ne cherche plus à partir.", "Le sarcasme reste au coin de ses lèvres ; son regard, lui, devient attentif.", "Elle replace une mèche derrière son oreille, ce petit geste trop précis qui trahit sa nervosité.", "Son expression demeure digne. Sa main, posée près de celle d’Hylee, l’est beaucoup moins."],
      close: ["« Ne me fais pas regretter d’avoir été honnête. Enfin… pas avant demain. »", "« Nous en reparlerons. Ce n’est pas une menace, même si j’en ai soigné la formulation. »", "« Viens. Avant que l’univers ne nous offre un second problème pour récompenser nos efforts. »"],
    },
    iriana: {
      open: [
        "Vous avez toute mon attention. C’est une ressource plus rare que ne le prétend l’étiquette.",
        "Poursuivez. Je souhaite savoir jusqu’où vous êtes arrivée sans que l’on vous guide.",
        "Vous posez cette question comme si vous ignoriez qu’elle est politiquement dangereuse.",
        "Je vous écoute, Hylee. Ne confondez pas cette permission avec une indulgence.",
      ],
      lucidite: ["Iriana ne répond pas tout de suite. « Votre observation est exacte. Votre conclusion, en revanche, reste à prouver. »", "« Voilà le détail que mes conseillers avaient commodément oublié. Continuez. »", "« Vous apprenez à regarder derrière la mise en scène. C’est utile — et rarement confortable. »"],
      audace: ["Un sourcil se lève. « Vous venez donc réellement de proposer cela devant moi. Je vous reconnais au moins cette constance. »", "« C’est insolent. Ce n’est pas nécessairement faux. »", "« Très bien. J’autorise l’essai ; vous en porterez le mérite comme la faute. »"],
      sangfroid: ["« Une retenue opportune. La cour gagnerait à comprendre que tout silence n’est pas une reddition. »", "« Nous attendrons. Pas par peur : parce que l’instant suivant nous sera plus favorable. »", "« Votre calme est plus utile que les certitudes de la moitié de cette salle. »"],
      resonance: ["Iriana observe la magie plutôt qu’Hylee. « Je ne la perçois pas ainsi. Montrez-moi ce que vous avez senti. »", "« Une intuition humaine au milieu de tant de certitudes sylviniennes… L’ironie ne m’échappe pas. »", "« Ne forcez rien. La magie de l’Empire mord lorsqu’elle se croit interrogée. »"],
      motion: ["Son visage ne livre presque rien ; seule la pression de son pouce contre sa bague impériale change.", "Elle incline la tête d’un angle infime, comme si Hylee venait de déplacer une pièce qu’elle n’avait pas prévue.", "Le masque princier tient. Son regard, plus fatigué, apparaît une seconde derrière lui.", "Elle lisse un pli inexistant de sa manche avant de répondre."],
      close: ["« Cette conversation n’a pas eu lieu. Vous pouvez néanmoins vous en souvenir. »", "« Gardez cette conclusion pour vous. Elle sera plus utile intacte. »", "« Vous pouvez disposer… ou rester encore une minute. Je n’ai pas tranché. »"],
    },
    valurn: {
      open: [
        "Tu as cette expression dangereuse : celle de quelqu’un qui s’apprête à demander une réponse sincère.",
        "Je peux t’offrir la vérité, un mensonge élégant ou une anecdote embarrassante. Les tarifs varient.",
        "Pose ta question. J’ai laissé ma dignité dans une autre veste.",
        "Tu cherches le fond de ma pensée ? J’espère que tu as apporté une corde.",
      ],
      lucidite: ["Valurn sourit sans montrer les dents. « Bien vu. Je déteste quand mes meilleurs mensonges meurent d’un détail. »", "« Tu viens de retirer l’ornement. Il ne reste que la partie la moins flatteuse. »", "« Exact. Ne prends pas cet instant de lucidité pour une invitation à fouiller partout. »"],
      audace: ["Il éclate d’un rire bref. « Enfin. Une mauvaise idée qui a assez de panache pour mériter sa chance. »", "« Voilà pourquoi je t’apprécie : tu sautes avant de demander si le sol a signé son accord. »", "« Fais-le. Je nierai t’avoir encouragée si le plafond nous tombe dessus. »"],
      sangfroid: ["Son sourire perd un peu de sa provocation. « Cruellement raisonnable. Tu ruines tous mes effets. »", "« D’accord. Nous gardons le couteau sur la table sans être obligés de le planter. »", "« Prendre son temps face à moi est vexant… et plutôt judicieux. »"],
      resonance: ["La plaisanterie s’éteint dans ses yeux. « Si tu sens les Calciterres, recule d’un pas avant de leur répondre. »", "« Ce frisson n’est pas à toi. Très mauvaise nouvelle, mais excellente intuition. »", "« Écoute, oui. Mais ne promets rien à ce qui te répond. »"],
      motion: ["Il fait tourner une pièce entre ses doigts ; elle disparaît lorsqu’une question approche trop près.", "Son rictus tient une seconde de trop, puis devient simplement fatigué.", "Il se penche comme pour confier une plaisanterie et laisse finalement passer un silence.", "La flamme de ses yeux se resserre, seule marque qu’il a été touché."],
      close: ["« Voilà. Une vérité presque entière. Ne deviens pas exigeante. »", "« Si quelqu’un demande, j’ai été héroïque et remarquablement bien coiffé. »", "« Nous arrêterons là, avant que je ne commette l’imprudence de devenir sérieux. »"],
    },
    naiah: {
      open: [
        "Oh, cette tête-là ! Tu vas essayer de me comprendre. J’adore quand les gens se donnent des objectifs impossibles.",
        "Pose ta question. Je promets de répondre à quelque chose qui lui ressemble.",
        "Tu hésites ? C’est dommage, j’avais déjà préparé trois mensonges et une vérité très vexante.",
        "Je t’écoute. Enfin, je t’observe t’écouter. C’est souvent plus drôle.",
      ],
      lucidite: ["Naïah plisse les yeux, ravie. « Ah. Tu as trouvé la ficelle. Maintenant devine ce qu’elle fait tomber. »", "« C’est presque ça. Tu veux un indice ou tu préfères te tromper avec panache ? »", "« Bien vu. Je vais devoir changer de piège, celui-ci te connaît trop bien. »"],
      audace: ["Elle applaudit une fois. « Oui ! Enfin quelqu’un qui choisit la porte marquée “mauvaise idée”. »", "« Fais-le. Je veux voir le visage que tu feras juste après. »", "« D’accord, mais si ça explose, je raconte que c’était ton plan. Parce que ce sera vrai. »"],
      sangfroid: ["Naïah gonfle les joues. « C’est terriblement adulte comme réponse. Je suis déçue… et un peu impressionnée. »", "« Tu ne m’offres même pas une réaction ? Quelle avarice. »", "« Très bien. On attend. Mais je garde le droit de m’ennuyer bruyamment. »"],
      resonance: ["Son sourire se fige. « Tu l’as sentie aussi ? Bon. On va éviter de toucher ce qui respire sans poumons. »", "« La forêt parle toujours. Le vrai jeu consiste à savoir quand elle ment. »", "« Écoute mieux : sous la magie, il y a quelqu’un qui retient son souffle. »"],
      motion: ["Elle tourne autour d’Hylee comme si la conversation était un objet dont elle cherchait le mécanisme.", "Ses jambes cessent de se balancer. Chez Naïah, cette immobilité vaut un aveu d’inquiétude.", "Elle sourit encore, mais ses yeux calculent déjà trois conséquences de plus.", "Une ombre grimpe sur son poignet puis se retire, rappelée à l’ordre sans un mot."],
      close: ["« Tu peux garder cette réponse. Je t’en donnerai une différente la prochaine fois. »", "« Ne prends pas cet instant au sérieux. Moi, peut-être que si. »", "« Allez, viens. J’ai promis de ne rien voler pendant au moins dix minutes. Il en reste deux. »"],
    },
    draven: {
      open: [
        "Si tu veux parler, parle. Les détours sont utiles sur une carte, rarement dans une conversation.",
        "J’ai cinq minutes avant qu’un imbécile transforme une consigne simple en catastrophe.",
        "Tu as une question ? Pose-la. Je grogne aussi quand la réponse est oui.",
        "Bon. Qu’est-ce qui te travaille ? Et ne me réponds pas “rien”, j’ai déjà élevé une fille.",
      ],
      lucidite: ["Draven suit le raisonnement du doigt. « Là. C’est là que leur plan commence à sentir la merde. »", "« Exact. Les chiffres mentent moins bien quand on leur demande qui va porter les blessés. »", "« Bien vu. On corrige avant qu’un officier transforme ça en tradition. »"],
      audace: ["Il laisse échapper un rire grave. « Ça, c’est une décision. Probablement mauvaise, mais au moins elle tient debout. »", "« D’accord. Tu passes devant ; je m’assure que personne ne te plante dans le dos. »", "« Enfin quelqu’un qui agit. J’allais finir par lancer la table. »"],
      sangfroid: ["Sa mâchoire se desserre. « Oui. On fait proprement. Ça changera de d’habitude. »", "« Pas de héros inutile. On règle l’urgent, puis le reste. »", "« Tu as raison. La colère attendra ; elle n’a jamais raté un rendez-vous. »"],
      resonance: ["Il fronce les sourcils. « Je ne sens rien, mais j’ai appris à ne pas mépriser ce qui sauve une patrouille. Guide-nous. »", "« De la magie. Parfait. Comme si les problèmes ordinaires manquaient de dents. »", "« Si ton instinct dit de reculer, je fais reculer les hommes. Tu m’expliqueras après. »"],
      motion: ["Il frotte sa barbe, le regard fixé sur le problème plutôt que sur Hylee.", "Ses doigts tapent une marche militaire contre son brassard, puis s’arrêtent.", "Il grogne ; cette fois, le son ressemble davantage à un accord qu’à une menace.", "Son visage reste fermé, mais il décale une caisse pour offrir à Hylee une place près de lui."],
      close: ["« Ça reste entre nous. Pas parce que j’en ai honte : parce que je n’ai pas envie de l’expliquer deux fois. »", "« Allez. On retourne empêcher les autres de mourir avec enthousiasme. »", "« Tu poses de bonnes questions. C’est agaçant. Continue. »"],
    },
    saidin: {
      open: [
        "Voilà une question qui arrive presque au moment où tu es prête à entendre sa réponse.",
        "Je pourrais répondre simplement. Ce serait toutefois te priver de l’erreur qui t’apprendra le plus.",
        "Tu demandes ce qui s’est passé. Je me demande plutôt ce que cet événement vient de changer.",
        "Certaines réponses ne sont obscures que parce qu’on les regarde depuis trop près.",
      ],
      lucidite: ["Saidin sourit. « Tu as placé les événements dans le bon ordre. Ils ne s’y sont pourtant pas produits. »", "« Excellente question. Conserve-la ; la première réponse serait trop petite. »", "« Ce détail est une charnière. Évite simplement d’ouvrir la porte avant d’avoir vu ce qu’elle soutient. »"],
      audace: ["« Tu choisis le chemin court. Il est plus long, naturellement. »", "« Essaie. L’échec t’apprendra peut-être ce que ma prudence ne saurait formuler. »", "« Une initiative imprudente peut devenir juste lorsqu’elle est prise pour la bonne personne. »"],
      sangfroid: ["« Attendre n’est pas renoncer. C’est parfois permettre à la bonne question de te rejoindre. »", "« Bien. Le temps cesse de te pousser dès que tu cesses de lui tourner le dos. »", "« Tu n’as pas besoin de résoudre aujourd’hui ce qui exige que tu sois différente demain. »"],
      resonance: ["Ses yeux suivent une vibration invisible. « Elle te reconnaît. Cela ne signifie pas encore qu’elle te connaît. »", "« Nomme ce que tu ressens après l’avoir ressenti. L’ordre est important. »", "« La magie se souvient parfois de personnes qui ne se souviennent pas d’elle. »"],
      motion: ["Il ferme le livre avant la fin de la page, comme s’il savait déjà quels mots allaient suivre.", "Son regard se porte un instant derrière Hylee, vers quelque chose qui n’est pas encore arrivé.", "Il laisse le silence achever une phrase qu’il n’a volontairement pas prononcée.", "Un reflet argenté traverse ses yeux ; la lumière du lieu suffit presque à l’expliquer."],
      close: ["« Tu comprendras. Je n’ai pas dit bientôt. »", "« Garde cette pièce du puzzle. Elle n’appartient pas encore à l’image que tu imagines. »", "« Nous avons assez parlé du passé pour qu’il commence à nous écouter. Marchons. »"],
    },
    lineva: {
      open: [
        "Si c’est pour parler de Forthaven comme d’une jolie forteresse, tu peux repartir.",
        "Je t’écoute. Mais fais court : les remparts ne se gardent pas avec de bonnes intentions.",
        "Tu veux savoir ce que j’en pense ? D’accord. Tu risques juste de ne pas aimer la réponse.",
      ],
      observer: ["Lineva suit son regard. « Oui. Ça, les rapports l’oublient toujours. »", "« Pas mal. Mon père aurait mis deux cartes et trois jurons pour arriver au même point. »", "« Tu as vu le défaut. Maintenant demande-toi qui gagne à le laisser là. »"],
      agir: ["« Enfin. On fait quelque chose et on comptera les bleus après. »", "« Ça me va. Pas élégant, pas idiot : exactement ce qu’il faut. »", "« Tu prends ce côté. Si tu ralentis, je te porte et je m’en plaindrai tout le trajet. »"],
      temporiser: ["« Je déteste attendre. Mais je déteste davantage enterrer des gens pressés. »", "« Une heure. Pas plus. Après, on tranche. »", "« D’accord. On laisse une sortie — pas une excuse. »"],
      motion: ["Elle ajuste une sangle déjà serrée, peu habituée à rester immobile pendant une confidence.", "Son regard part vers les remparts ; lorsqu’il revient, la défiance a perdu un peu de terrain.", "Elle souffle par le nez, presque amusée malgré elle.", "Ses épaules restent carrées, mais sa voix descend d’un ton."],
      close: ["« Ne répète pas ça à mon père. Il deviendrait sentimental, ce serait insupportable. »", "« Bon. Assez parlé. Mes mains ont besoin d’un problème plus simple. »", "« Tu peux revenir. Ça ne veut pas dire que je t’attendrai. »"],
    },
    amanea: {
      open: [
        "Vous souhaitez comprendre une décision que l’Empire qualifie de monstrueuse. Commencez par oublier le confort de ses mots.",
        "Je n’exige pas votre approbation. Seulement que vous regardiez ce que mes ennemis préfèrent laisser hors du cadre.",
        "Parlez. Une question honnête m’est moins pénible qu’une révérence mensongère.",
      ],
      observer: ["Amanea soutient le regard. « Vous voyez la blessure. Ne supposez pas encore connaître celui qui tenait la lame. »", "« Exact. La version impériale tient parce qu’elle retire les morts du calcul. »", "« Continuez. Peu de visiteurs acceptent d’observer après avoir trouvé un coupable commode. »"],
      agir: ["« Alors agissez. La vertu qui ne quitte jamais les salons n’a sauvé personne ici. »", "« C’est brutal. Peut-être nécessaire. Je jugerai sur ce que vous protégerez. »", "« Vous acceptez donc le prix d’une décision, pas seulement son apparence. Bien. »"],
      temporiser: ["« Une pause n’est pas une paix. Mais elle peut empêcher les innocents d’en payer l’illusion. »", "« Je vous accorde ce délai. Ne l’offrez pas ensuite à ceux qui l’utiliseront contre nous. »", "« Attendre, soit. À condition que personne ne confonde votre retenue avec l’oubli. »"],
      motion: ["Sa fierté demeure intacte ; la fatigue apparaît pourtant dans la façon dont sa main quitte l’accoudoir.", "La Reine Noire tourne légèrement le visage, non pour fuir la question mais pour reprendre le contrôle de sa réponse.", "Les flammes proches se courbent puis se stabilisent avec sa respiration."],
      close: ["« Vous n’avez pas toute l’histoire. Pour une fois, vous savez au moins qu’elle existe. »", "« Gardez vos conclusions provisoires. Les certitudes ont déjà fait assez de dégâts dans ma famille. »", "« Nous nous arrêterons ici. Le reste doit être mérité, pas arraché. »"],
    },
    bellirith: {
      open: ["Tu regardes les traces comme si elles allaient s’excuser. Elles n’ont pas été élevées aussi poliment.", "Tu reviens chercher une explication ? Certaines morsures sont plus honnêtes que les réponses.", "Je savais que tu regarderais derrière toi. Tu as toujours préféré les pièges qui portent mon parfum."],
      observer: ["Bellirith sourit sans chaleur. « Tu me connais encore assez pour trouver la couture. Pas assez pour savoir ce qu’elle retient. »", "« Regarde mieux. La colère n’est jamais la seule chose que je laisse derrière moi. »", "« Tu as trouvé mon signe. Ne t’imagine pas qu’il t’était destiné par tendresse. »"],
      agir: ["« Voilà le frère que je reconnais : il avance quand la prudence lui demande enfin des comptes. »", "« Essaie donc. J’aimerais savoir si ton courage survit à une seconde vérité. »", "« Fais-le. Cette fois, ne promets rien que tu comptes abandonner. »"],
      temporiser: ["« Tu demandes du temps à quelqu’un que tu as déjà laissé attendre. L’ironie est presque élégante. »", "« Garde ta porte ouverte. Je déciderai si elle mérite encore d’être franchie. »", "« Attends, si tu veux. Mais ne transforme pas encore ton silence en bonté. »"],
      motion: ["Son sourire se fait tranchant ; la blessure qu’il protège reste invisible.", "Elle ne s’approche pas. La distance entre eux suffit à occuper toute la scène.", "Ses doigts effleurent la marque puis se retirent avant le contact."],
      close: ["« Tu peux partir. Cette fois, au moins, nous savons tous les deux que c’est un choix. »", "« Garde cette réponse. Elle te fera moins mal que la suivante. »", "« Nous n’avons rien réparé. C’est déjà plus honnête que d’habitude. »"],
    },
    generic: {
      open: ["Il faut décider avant que la situation ne se décide toute seule.", "Personne ne semble certain de la bonne méthode, seulement du peu de temps disponible.", "Le problème paraît modeste jusqu’à ce que quelqu’un tente réellement de le résoudre."],
      lucidite: ["Le détail isolé replace le reste dans un ordre enfin exploitable.", "Une question précise fait tomber l’explication la plus commode.", "En distinguant les faits des suppositions, une solution cesse de se cacher."],
      audace: ["L’initiative surprend assez pour entraîner ceux qui attendaient une permission.", "Le premier geste ne règle pas tout, mais donne enfin une direction au groupe.", "L’idée est risquée ; elle a au moins le mérite d’exister au bon moment."],
      sangfroid: ["La tension baisse d’un cran et chacun recommence à entendre les autres.", "Traiter l’urgence avant l’orgueil rend soudain la situation moins impossible.", "Quelques respirations suffisent à empêcher la peur de choisir."],
      resonance: ["La magie répond par une vibration discrète, plus proche d’un avertissement que d’un ordre.", "Le lieu renvoie une émotion étrangère qui guide le prochain geste.", "Lorsque Hylee cesse de forcer, deux sensations jusque-là confondues se séparent."],
      observer: ["Les gestes contredisent la première version et révèlent l’enjeu réel.", "Une hésitation minuscule indique exactement où reprendre les faits.", "Le silence finit par livrer ce que le discours protégeait."],
      agir: ["La décision donne au problème une forme concrète, donc enfin attaquable.", "Le mouvement force chacun à quitter ses hypothèses pour répondre au réel.", "Quelqu’un prend la responsabilité ; le reste peut enfin avancer."],
      temporiser: ["La retenue préserve une issue sans prétendre résoudre le conflit.", "Le délai laisse l’émotion perdre assez de force pour qu’une décision reste possible.", "Personne ne gagne, mais personne n’est encore condamné à perdre."],
      motion: ["Autour d’eux, le lieu continue de vivre et donne à la décision un poids très ordinaire.", "Un objet change de main, une chaise racle le sol ; la scène avance enfin.", "Le silence qui suit n’est pas vide : chacun y vérifie ce qu’il est prêt à faire."],
      close: ["Le moment se referme sans effacer ce qu’il vient de déplacer.", "Il reste des questions, mais elles ont désormais un endroit où revenir.", "La suite du récit attend ; cette décision, elle, accompagnera ceux qui la reprennent."],
    },
  };

  const PATCHES = {};
  const ADDITIONS = {};

  function key(periodId, spotId, activityId) {
    return `${periodId}:${spotId}:${activityId}`;
  }

  function stableIndex(value, length) {
    let hash = 0;
    String(value || "").split("").forEach(function each(character) {
      hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
    });
    return Math.abs(hash) % Math.max(1, length);
  }

  function beat(speaker, text) {
    return { speaker, text };
  }

  function add(periodId, spotId, definition) {
    const spotKey = `${periodId}:${spotId}`;
    ADDITIONS[spotKey] = ADDITIONS[spotKey] || [];
    ADDITIONS[spotKey].push({
      kind: "confession",
      eyebrow: "Conversation personnelle",
      prompt: "Comment Hylee ouvre-t-elle cette conversation ?",
      noStats: true,
      hiddenTitle: "Une conversation attend encore",
      ...definition,
    });
  }

  function patch(periodId, spotId, activityId, definition) {
    PATCHES[key(periodId, spotId, activityId)] = definition;
  }

  function personalChoices(first, second, third) {
    return {
      lucidite: { label: first, note: "Poser une question précise sans prétendre connaître déjà la réponse." },
      audace: { label: second, note: "Nommer directement ce qui paraît difficile à dire." },
      sangfroid: { label: third, note: "Laisser à l’autre le choix du rythme et de la profondeur." },
    };
  }

  /* Retours explicites sur les chapitres : ils ne se confondent plus avec les confidences. */
  patch("forestier-avant-depart", "salle", "dernier-service", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    title: "Ce que le départ change vraiment",
    intro: "Le feu du camp baisse. Hylee revient sur la décision qui l’emmène vers Al’Gratal et sur la facilité avec laquelle Remerii a présenté ce voyage comme une simple étape.",
    prompt: "Que demande Hylee à Remerii avant de reprendre la route ?",
    choiceText: personalChoices("Lui demander si elle la voit vraiment comme son apprentie", "Affirmer qu’elle choisit elle aussi cette route", "Avouer ce que ce nouveau départ lui fait craindre"),
  });
  patch("algratal-preparatifs", "palais", "requetes-introduction", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    title: "Ce qu’Iriana attend réellement d’elles",
    intro: "La réunion est terminée, mais Iriana conserve les requêtes sous sa main. Hylee lui demande enfin ce que la princesse pense de la mission, au-delà des ordres qu’elle vient de donner.",
    prompt: "Jusqu’où Hylee pousse-t-elle Iriana à quitter son rôle officiel ?",
    choiceText: personalChoices("Demander ce que la mission peut réellement changer", "Lui demander pourquoi elle a choisi deux humaines", "Écouter les réserves qu’elle ne dira pas au Conseil"),
  });
  patch("camp-avant-croisee", "feu", "apres-cauchemar", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      sangfroid: { label: "Dire ce qui lui fait encore peur", note: "Nommer la peur sans lui laisser décider de la suite." },
      lucidite: { label: "Distinguer le cauchemar de l’avertissement", note: "Reprendre ce qui appartient au passé et ce qui menace encore." },
      resonance: { label: "Décrire comment sa magie a réagi", note: "Parler de la sensation avant d’en chercher le sens." },
    },
  });
  patch("miraldas-apres-saidin", "bibliotheque", "question-saidin", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Demander ce que l’épreuve mesurait vraiment", note: "Refuser de confondre réussite et objectif du test." },
      audace: { label: "Exiger la partie que Saidin a retenue", note: "Le pousser à quitter, un instant, son avance habituelle." },
      resonance: { label: "Décrire ce que l’épreuve a réveillé", note: "L’interroger à partir de la trace laissée dans la magie." },
    },
  });
  patch("miraldas-matin-libre", "terrasse", "apres-proximite", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      sangfroid: { label: "Nommer la nuit sans la dramatiser", note: "Reconnaître le moment sans exiger qu’il résolve tout." },
      lucidite: { label: "Demander ce que cela change entre elles", note: "Distinguer le désir d’avancer de la peur de mal comprendre." },
      resonance: { label: "Écouter ce que leur magie en a gardé", note: "Laisser la sensation commune précéder les mots." },
    },
  });
  patch("algratal-avant-expedition", "toits", "parler-temps", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Demander ce que Saidin avait prévu", note: "Séparer ses calculs de ce qu’il prétend pressentir." },
      sangfroid: { label: "Demander ce qu’ils peuvent encore changer", note: "Ramener la conversation vers les décisions présentes." },
      resonance: { label: "Questionner la sensation laissée par la route", note: "Comparer son intuition à celle du vieux mage." },
    },
  });
  patch("geoles-apres-capture", "cellule", "parler-groupe", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Reconstituer le moment où le plan a cédé", "Refuser qu’un seul porte toute la faute", "Demander ce dont chacun a besoin maintenant"),
  });
  patch("algratal-groupe-retour", "infirmerie", "bilan", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Demander ce que les geôles ont révélé", "Nommer la phrase qui a blessé", "Commencer par ce qui peut encore être réparé"),
  });
  patch("bal-entracte-groupe", "alcove", "pacte-bal", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Comparer ce que la cour essaie d’obtenir", "Refuser de jouer le couple qu’elle attend", "Fixer une règle pour traverser le bal ensemble"),
  });
  patch("bal-entre-duels", "balcon", "verifier-naiah", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Lui demander ce que le duel a réellement touché", note: "Distinguer sa colère de la blessure qu’elle protège." },
      sangfroid: { label: "Rester sans exiger qu’elle se confie", note: "Lui offrir une présence qu’elle ne contrôle pas par un jeu." },
      resonance: { label: "Décrire ce que ses ombres ont laissé paraître", note: "Parler de la magie sans prétendre lire ses pensées." },
    },
  });
  patch("algratal-matin-apres-bal", "galerie", "conseiller-masque", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: personalChoices("Comparer ce qu’ils ont observé du conseiller", "Dire pourquoi son masque l’inquiète", "Demander ce que Draven n’a pas dit au groupe"),
  });
  patch("algratal-apres-conseil", "balcon", "avant-guerre", {
    kind: "debrief",
    eyebrow: "Retour sur le chapitre",
    choiceText: {
      lucidite: { label: "Reprendre les décisions du Conseil une à une", note: "Séparer le plan officiel de ses angles morts." },
      audace: { label: "Dire ce qu’Hylee refuse d’emporter en silence", note: "Ne pas laisser l’urgence confisquer leur vérité." },
      sangfroid: { label: "Parler de ce qu’elles feront si le plan cède", note: "Préparer une issue sans transformer la peur en certitude." },
      resonance: { label: "Comparer ce que leur magie pressent", note: "Écouter ensemble la tension qui traverse la ville." },
    },
  });

  /* Mini-jeux contextuels, facultatifs et jamais bloquants. */
  patch("miraldas-matin-libre", "atelier", "tri-cristaux", {
    kind: "minigame",
    eyebrow: "Atelier · Mini-jeu",
    miniGame: {
      type: "pattern",
      title: "Accorder les cristaux",
      instruction: "Mémorisez l’ordre des quatre résonances, puis reproduisez-le.",
      symbols: ["◇", "○", "△", "□"],
      reward: { stats: { resonance: 1 } },
    },
  });
  patch("geoles-apres-capture", "barreaux", "etudier-runes", {
    kind: "minigame",
    eyebrow: "Observation · Mini-jeu",
    miniGame: {
      type: "pattern",
      title: "Retenir le cycle des runes",
      instruction: "Observez le cycle de la serrure avant qu’il ne s’efface, puis reproduisez-le.",
      symbols: ["◐", "◇", "⌁", "○"],
      reward: { stats: { lucidite: 1 } },
    },
  });
  patch("bal-entre-duels", "piste", "choisir-danse", {
    kind: "minigame",
    eyebrow: "Danse · Mini-jeu de rythme",
    miniGame: {
      type: "rhythm",
      title: "Trouver le même tempo",
      instruction: "Touchez au moment où la pulsation s’illumine. Une erreur change la danse, elle ne l’interrompt pas.",
      beats: 8,
      reward: { relationships: { remerii: { affection: 1, trust: 1 } } },
    },
  });
  patch("algratal-apres-conseil", "infirmerie", "preparer-soins", {
    kind: "minigame",
    eyebrow: "Préparatifs · Mini-jeu",
    miniGame: {
      type: "pattern",
      title: "Composer les nécessaires",
      instruction: "Mémorisez l’ordre de rangement pour que chaque soigneur trouve le bon outil dans l’urgence.",
      symbols: ["✚", "◫", "◌", "⌁"],
      reward: { resources: { supplies: 1 } },
    },
  });

  /* Confidences canoniques : aucun désir n’est ajouté, y compris dans les scènes romantiques. */
  add("forestier-avant-depart", "chambre", {
    id: "confidence-remerii-apprendre",
    title: "Ce que Remerii attend d’une apprentie",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’elle redoute", "Refuser d’être seulement protégée", "Lui laisser formuler ses règles"),
    opening: [
      beat("Narrateur", "Les paquetages sont presque prêts. Remerii vérifie une troisième fois la même attache, trop appliquée pour que le problème soit réellement la corde."),
      beat("Hylee", "Tu sais que je fais mes sacs toute seule depuis presque deux ans."),
      beat("Remerii", "Je nourris cet espoir avec une patience remarquable."),
      beat("Hylee", "Ce n’est pas ce que je voulais dire. Maintenant que je suis vraiment ton apprentie… qu’est-ce que tu attends de moi ?"),
      beat("Narrateur", "Les doigts de Remerii restent immobiles sur le nœud. Pour une fois, elle ne possède pas de réponse préparée."),
      beat("Remerii", "Que tu survives assez longtemps pour me désobéir pour de bonnes raisons. Le reste s’enseigne."),
    ],
    resolution: "Remerii ne transforme pas la route en serment. Elle admet seulement qu’elle n’apprend pas à Hylee à suivre ses pas, mais à choisir les siens sans se perdre.",
  });

  add("algratal-preparatifs", "palais", {
    id: "confidence-iriana-observer",
    title: "Pourquoi Iriana observe avant de parler",
    speaker: "Iriana",
    relation: "iriana",
    availableFrom: 1,
    requiresRelation: { id: "iriana", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("L’interroger sur ce qu’elle a remarqué", "Lui demander si elle manipule tout le monde", "Attendre qu’elle retire elle-même le masque"),
    opening: [
      beat("Narrateur", "La galerie s’est vidée. Iriana regarde encore la porte par laquelle chaque conseiller est parti, comme si leurs dos parlaient mieux que leurs visages."),
      beat("Hylee", "Vous saviez déjà ce qu’ils allaient demander, n’est-ce pas ?"),
      beat("Iriana", "Je savais ce qu’ils voulaient obtenir. Ce qu’ils accepteraient de sacrifier était moins certain."),
      beat("Hylee", "Vous faites ça avec tout le monde ?"),
      beat("Narrateur", "Le regard d’Iriana revient sur elle, précis mais dépourvu de la cruauté qu’Hylee y attendait."),
      beat("Iriana", "Non. Certaines personnes méritent qu’on les écoute avant de décider à quoi elles servent."),
    ],
    resolution: "Iriana ne renonce pas à observer Hylee. Elle lui accorde cependant une différence importante : elle accepte désormais que ses surprises ne soient pas nécessairement des erreurs.",
  });

  add("algratal-preparatifs", "appartements", {
    id: "confidence-remerii-retour",
    title: "Mir’Aldas avant Hylee",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Demander ce qui a changé là-bas", "Lui demander pourquoi elle est partie", "L’assurer qu’elle n’a pas à tout raconter"),
    opening: [
      beat("Narrateur", "Sur la carte, Remerii suit du doigt un ancien chemin vers Mir’Aldas puis l’efface de la paume."),
      beat("Hylee", "Tu connais une route plus courte."),
      beat("Remerii", "Je connais une route plus ancienne. Ce n’est pas toujours la même chose."),
      beat("Hylee", "Tu vivais là-bas avant l’auberge ?"),
      beat("Narrateur", "Remerii sourit comme on referme doucement une porte qui grince."),
      beat("Remerii", "J’y ai été brillante, insupportable et beaucoup trop jeune pour qu’on me laisse l’être. Dans cet ordre variable."),
    ],
    resolution: "Hylee n’obtient ni le récit de la malédiction ni celui du départ. Elle découvre une Remerii prodige, entourée d’adultes qui avaient cessé de voir l’enfant bien avant qu’elle ne le soit plus.",
  });

  add("camp-avant-croisee", "feu", {
    id: "confidence-remerii-peur",
    title: "La peur que Remerii reconnaît",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander si elle a connu cette peur", "Lui dire qu’elle n’est pas obligée d’être infaillible", "Rester près d’elle sans exiger de récit"),
    opening: [
      beat("Narrateur", "Le cauchemar d’Hylee a laissé le camp trop silencieux. Remerii remue les braises avec une branche déjà consumée."),
      beat("Hylee", "Quand je me suis réveillée… tu n’avais pas l’air surprise."),
      beat("Remerii", "J’ai une certaine expérience des nuits qui refusent de rester dans le passé."),
      beat("Hylee", "Les tiennes ?"),
      beat("Narrateur", "La branche casse entre les doigts de Remerii. Elle observe les deux morceaux avant de les déposer dans le feu."),
      beat("Remerii", "Disons que je sais ce que l’on ressent lorsque sa propre magie cesse d’être un refuge."),
    ],
    resolution: "Remerii ne nomme pas encore la malédiction. Elle offre quelque chose de plus modeste et de plus rare : la certitude qu’elle ne parle pas à Hylee depuis un lieu intact.",
  });

  add("miraldas-apres-saidin", "bibliotheque", {
    id: "confidence-saidin-remerii-enfant",
    title: "Remerii avant d’être une prodige",
    speaker: "Saidin",
    relation: "saidin",
    availableFrom: 1,
    requiresRelation: { id: "saidin", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Demander comment Remerii apprenait", "L’accuser gentiment d’être fier d’elle", "Le laisser choisir le souvenir"),
    opening: [
      beat("Narrateur", "Saidin retrouve dans un traité une marge couverte d’une écriture minuscule et rageusement régulière."),
      beat("Hylee", "C’est l’écriture de Remerii ?"),
      beat("Saidin", "Celle de Remerii à onze ans. Elle annotait les erreurs des auteurs avant de terminer leurs livres."),
      beat("Hylee", "Elle devait être insupportable."),
      beat("Saidin", "Absolument. J’étais très fier."),
      beat("Narrateur", "Il tourne la page. Un petit dessin de dragon dort entre deux formules, presque effacé par le temps."),
    ],
    resolution: "Saidin raconte une enfant brillante qui voulait tout comprendre avant le lendemain. Il évite soigneusement l’instant où les autres ont cessé de la traiter comme une enfant.",
  });

  add("miraldas-apres-saidin", "residence", {
    id: "confidence-remerii-prodige",
    title: "Quand l’admiration devient une cage",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 8 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander qui venait dans cette chambre", "Dire que le talent n’annule pas le droit d’être aidée", "Lui proposer de refermer la porte"),
    opening: [
      beat("Narrateur", "La chambre de Mir’Aldas porte encore les marques claires des étagères retirées. Remerii sait exactement ce qui se trouvait sur chacune."),
      beat("Hylee", "Tout le monde te connaissait ici."),
      beat("Remerii", "Tout le monde connaissait ce que je savais faire."),
      beat("Hylee", "Ce n’est pas pareil."),
      beat("Narrateur", "Remerii la regarde longuement. Sa réponse préparée disparaît avant d’atteindre ses lèvres."),
      beat("Remerii", "Non. Et j’ai mis beaucoup trop d’années à comprendre pourquoi je me sentais seule au milieu de leur admiration."),
    ],
    resolution: "Pour la première fois, Remerii décrit Mir’Aldas sans seulement parler de magie : la cité fut aussi l’endroit où son talent avait pris toute la place qu’aurait dû occuper la personne.",
  });

  add("miraldas-matin-libre", "patisserie", {
    id: "confidence-remerii-ordinaire",
    title: "Une habitude qui pourrait durer",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 10 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander pourquoi cela la trouble", "Proposer d’en faire une tradition", "Profiter du silence sans le définir"),
    opening: [
      beat("Narrateur", "Une miette reste au coin des lèvres de Remerii. Hylee la lui signale ; elle l’essuie avec une dignité si excessive qu’elle devient comique."),
      beat("Hylee", "On pourrait refaire ça."),
      beat("Remerii", "Acheter une pâtisserie ? Je pense pouvoir intégrer l’exercice à ton programme."),
      beat("Hylee", "Non. Être là sans courir vers une catastrophe."),
      beat("Narrateur", "La tasse de Remerii s’immobilise à mi-chemin. Son sourire revient plus lentement."),
      beat("Remerii", "C’est une habitude dangereuse. On finit par désirer qu’elle dure."),
    ],
    resolution: "Elles ne donnent aucun nom à ce moment. Leurs mains restent pourtant proches sur la table, et Remerii ne trouve aucune raison urgente de consulter l’heure.",
  });

  add("algratal-avant-expedition", "camp-forthaven", {
    id: "confidence-draven-forthaven",
    title: "Forthaven au-delà de ses remparts",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 1,
    requiresRelation: { id: "draven", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce que les cartes oublient", "Demander ce qui lui manque de la ville", "Le laisser choisir un souvenir simple"),
    opening: [
      beat("Narrateur", "Draven replie une carte de Forthaven dont les bords ont été réparés plusieurs fois. Une tache ronde recouvre une partie du port."),
      beat("Hylee", "C’est une position stratégique ?"),
      beat("Draven", "C’était une chope. Ma fille avait huit ans et l’équilibre d’un bélier ivre."),
      beat("Hylee", "Vous avez gardé la carte ?"),
      beat("Draven", "Elle est encore lisible. Et personne n’a le droit de rire."),
      beat("Narrateur", "Il grogne avant même qu’Hylee sourie, ce qui ne fait qu’aggraver son cas."),
    ],
    resolution: "Forthaven cesse d’être seulement une citadelle assiégée. Draven parle de quais bruyants, de tavernes trop pleines et d’une enfant qui courait sur les remparts avant de savoir ce qu’ils coûtaient.",
  });

  add("algratal-avant-expedition", "marche", {
    id: "confidence-valurn-calciterres",
    title: "Ce que les Calciterres apprennent aux enfants",
    speaker: "Valurn",
    relation: "valurn",
    availableFrom: 1,
    requiresRelation: { id: "valurn", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Demander ce qu’il reconnaît ici", "Lui demander s’il a déjà eu peur", "Le laisser plaisanter avant de répondre"),
    opening: [
      beat("Narrateur", "Valurn rejette un fruit trop mûr après l’avoir pesé sans y penser comme une pierre de survie."),
      beat("Hylee", "Tu vérifies toujours la nourriture comme ça ?"),
      beat("Valurn", "Une enfance heureuse, pleine de leçons pratiques : le rouge peut être du jus, du poison ou un avertissement parental."),
      beat("Hylee", "Et tu as appris comment ?"),
      beat("Valurn", "En goûtant. J’étais un enfant charmant, mais statistiquement imprudent."),
      beat("Narrateur", "Il plaisante. Sa main repose pourtant le fruit avec une prudence qui appartient encore au garçon des Calciterres."),
    ],
    resolution: "Valurn transforme son enfance en spectacle, puis laisse passer entre deux plaisanteries l’image d’un monde où survivre comptait davantage qu’être protégé.",
  });

  add("algratal-avant-expedition", "palais", {
    id: "confidence-iriana-cage",
    title: "Les règles qui protègent et enferment",
    speaker: "Iriana",
    relation: "iriana",
    availableFrom: 1,
    requiresRelation: { id: "iriana", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander qui a écrit ses règles", "Lui demander ce qu’elle ferait sans protocole", "Reconnaître que certaines protections étouffent"),
    opening: [
      beat("Narrateur", "Un maître de cérémonie corrige la position de deux chaises, salue Iriana et repart. Elle attend qu’il disparaisse avant de remettre l’une exactement comme avant."),
      beat("Hylee", "C’était volontaire ?"),
      beat("Iriana", "Une victoire mesquine. J’en cultive quelques-unes pour rester supportable."),
      beat("Hylee", "Qui vous a appris toutes ces règles ?"),
      beat("Narrateur", "Les doigts d’Iriana se referment sur le dossier de la chaise."),
      beat("Iriana", "Ma grand-mère m’a appris que chaque geste visible pouvait devenir une arme contre l’Empire. Elle a oublié de préciser ce qu’il restait lorsqu’aucun geste n’était plus à moi."),
    ],
    resolution: "Iriana ne condamne pas encore Tia. Elle admet seulement que la protection impériale a parfois la forme exacte d’une cage parfaitement polie.",
  });

  add("algratal-avant-expedition", "appartements", {
    id: "confidence-naiah-tests",
    title: "Pourquoi Naïah pousse jusqu’à la rupture",
    speaker: "Naïah",
    relation: "naiah",
    availableFrom: 1,
    requiresRelation: { id: "naiah", min: 2 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui dire qu’elle étudie les réactions", "Lui rendre l’une de ses provocations", "Refuser de jouer sans l’abandonner"),
    opening: [
      beat("Narrateur", "Naïah déplace chaque objet de la chambre d’un doigt vers la gauche. Hylee la regarde atteindre le vase avant de l’arrêter."),
      beat("Hylee", "Pourquoi ?"),
      beat("Naïah", "Pour savoir combien de temps tu mets à remarquer que quelque chose cloche."),
      beat("Hylee", "Tu fais ça avec tout le monde."),
      beat("Naïah", "Bien sûr. Les gens expliquent très bien qui ils sont quand on touche au mauvais vase."),
      beat("Narrateur", "Elle remet celui-ci à sa place exacte. Elle avait mémorisé la chambre avant même de commencer son jeu."),
    ],
    resolution: "Naïah reconnaît à demi-mot qu’elle provoque pour mesurer le danger avant qu’il ne la surprenne. Elle préfère être détestée pour un piège contrôlé que blessée par une réaction inconnue.",
  });

  add("algratal-avant-expedition", "toits", {
    id: "confidence-saidin-temps",
    title: "Une longueur d’avance",
    speaker: "Saidin",
    relation: "saidin",
    availableFrom: 1,
    requiresRelation: { id: "saidin", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’il avait prévu", "Lui demander de parler au présent", "Accepter qu’il ne livre qu’une partie"),
    opening: [
      beat("Narrateur", "Saidin regarde une tour dont la cloche n’a pas encore sonné. Il compte silencieusement jusqu’à trois ; le bronze résonne."),
      beat("Hylee", "Vous saviez."),
      beat("Saidin", "Je savais qu’elle était en retard. Prédire les habitudes est moins impressionnant que prédire l’avenir, mais plus fiable."),
      beat("Hylee", "Et pour notre expédition ? Habitude ou avenir ?"),
      beat("Narrateur", "Le sourire de Saidin s’efface juste assez pour rendre la question plus lourde."),
      beat("Saidin", "Une route dont j’ai déjà vu trop d’issues et pas encore celle que vous choisirez."),
    ],
    resolution: "Saidin refuse d’expliquer son rapport au temps. Il admet néanmoins que son avance n’est pas une maîtrise : parfois, savoir qu’un danger approche signifie seulement l’attendre plus longtemps.",
  });

  add("geoles-apres-capture", "barreaux", {
    id: "confidence-saidin-remords",
    title: "Ce qu’un mentor ne peut pas empêcher",
    speaker: "Saidin",
    relation: "saidin",
    availableFrom: 1,
    requiresRelation: { id: "saidin", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander pourquoi il surveille Remerii", "Dire qu’il ne peut pas tout prévoir", "Partager le silence de la cellule"),
    opening: [
      beat("Narrateur", "De l’autre côté des barreaux, Remerii dort enfin. Saidin n’a pas détourné les yeux depuis plusieurs minutes."),
      beat("Hylee", "Vous pensez qu’elle va disparaître si vous cessez de la regarder ?"),
      beat("Saidin", "Non. J’ai déjà commis l’erreur inverse : croire que voir le danger suffisait à l’empêcher."),
      beat("Hylee", "Sa malédiction ?"),
      beat("Narrateur", "Il ne confirme pas. Sa main se ferme autour d’un anneau ancien, caché sous sa manche."),
      beat("Saidin", "Il existe des blessures qu’un mentor arrive trop tard pour prévenir, puis trop tôt pour accepter qu’il ne peut les porter à la place de l’élève."),
    ],
    resolution: "Hylee comprend que la vigilance de Saidin n’est pas seulement mystérieuse. Elle est faite d’une faute qu’il ne nomme pas et d’une affection paternelle qu’il ne sait pas davantage avouer.",
  });

  add("algratal-groupe-retour", "cour", {
    id: "confidence-naiah-faim",
    title: "Ce que la faim n’oublie pas",
    speaker: "Naïah",
    relation: "naiah",
    availableFrom: 1,
    requiresRelation: { id: "naiah", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander pourquoi elle cache toujours de la nourriture", "Lui voler une bouchée pour inverser le jeu", "Lui offrir sans demander d’explication"),
    opening: [
      beat("Narrateur", "Naïah fait disparaître un petit pain dans sa manche alors qu’un second est déjà entre ses dents."),
      beat("Hylee", "Tu sais qu’il y aura encore à manger demain ?"),
      beat("Naïah", "C’est une théorie très optimiste. J’aime vérifier expérimentalement."),
      beat("Hylee", "Tu as souvent manqué ?"),
      beat("Narrateur", "Naïah mord plus lentement. Son regard cherche aussitôt une plaisanterie derrière Hylee et n’en trouve pas."),
      beat("Naïah", "Assez pour me souvenir de chaque personne qui a donné sans réclamer quelque chose après."),
    ],
    resolution: "Naïah ne raconte pas encore l’exil. Elle laisse pourtant comprendre pourquoi une tartelette offerte autrefois par Hylee occupe dans sa mémoire une place que le geste ne semblait pas mériter.",
  });

  add("bal-entracte-groupe", "buffet", {
    id: "confidence-valurn-bhaal",
    title: "Un père dont Valurn porte encore la voix",
    speaker: "Valurn",
    relation: "valurn",
    availableFrom: 0,
    requiresRelation: { id: "valurn", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander qui lui a appris à mépriser la faiblesse", "Nommer son père sans détour", "Lui laisser une sortie par l’humour"),
    opening: [
      beat("Narrateur", "Un noble félicite Valurn pour son ‘sang puissant’ avant de s’éloigner. Le sourire du demi-démon reste en place, devenu parfaitement vide."),
      beat("Hylee", "Ça t’arrive souvent ?"),
      beat("Valurn", "D’être complimenté ? Constamment. Par des imbéciles ? Avec une régularité admirable."),
      beat("Hylee", "Il parlait de ton père."),
      beat("Narrateur", "La coupe s’arrête près de ses lèvres. Pour une seconde, l’humour ne vient pas."),
      beat("Valurn", "Mon père appelait ‘héritage’ tout ce qu’il voulait m’empêcher de choisir."),
    ],
    resolution: "Valurn n’offre aucun récit complet des Calciterres. Il reconnaît seulement que sa provocation est aussi une manière de parler avec sa propre voix avant que celle de son père ne le fasse à sa place.",
  });

  add("bal-entre-duels", "couloir", {
    id: "confidence-draven-famille",
    title: "La famille qui attend à Forthaven",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 0,
    requiresRelation: { id: "draven", min: 4 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’il leur écrirait", "Lui demander pourquoi il parle si peu de sa femme", "L’écouter sans corriger ses regrets"),
    opening: [
      beat("Narrateur", "Draven a retourné sa décoration, mais garde dans la poche intérieure une lettre jamais commencée."),
      beat("Hylee", "Pour Lineva ?"),
      beat("Draven", "Pour elle et sa mère. Enfin… c’était l’idée."),
      beat("Hylee", "Qu’est-ce qui bloque ?"),
      beat("Draven", "La première phrase. Après ‘je vais bien’, tout ressemble à un mensonge ou à un ordre."),
      beat("Narrateur", "Il lisse le papier avec un pouce calleux. Hylee détourne les yeux, lui laissant l’espace de chercher une première phrase qui ne ressemble pas à un rapport."),
    ],
    resolution: "Draven parle d’une épouse patiente et de toutes les fois où il a promis de rentrer plus tôt. Hylee n’entend pas une confession héroïque, seulement un homme qui ne sait pas écrire ‘vous me manquez’ sans se sentir désarmé.",
  });

  add("algratal-matin-apres-bal", "galerie", {
    id: "confidence-draven-lineva",
    title: "Lineva avant l’armure",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 1,
    requiresRelation: { id: "draven", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander quand Lineva a commencé à combattre", "Lui demander s’il voulait vraiment cette vie pour elle", "Le laisser raconter le souvenir à sa manière"),
    opening: [
      beat("Narrateur", "Dans le tableau, un général victorieux pose devant une enfant sage. Draven le regarde comme une insulte personnelle."),
      beat("Hylee", "Lineva n’était pas sage ?"),
      beat("Draven", "À six ans, elle a mordu un instructeur parce qu’il lui avait dit de regarder les garçons s’entraîner."),
      beat("Hylee", "Vous étiez fier."),
      beat("Draven", "J’étais convoqué. J’ai attendu d’être dehors pour être fier."),
      beat("Narrateur", "Son rire tombe vite. Le portrait lui rappelle aussi combien de fois il n’était pas là pour voir la suite."),
    ],
    resolution: "Draven raconte les chutes, les genoux ouverts et l’obstination de Lineva. Il avoue espérer qu’elle le dépasse surtout là où lui n’a jamais su gouverner sans se cacher derrière l’armure.",
  });

  add("algratal-matin-apres-bal", "cuisine", {
    id: "confidence-naiah-amanea",
    title: "La question que Naïah transforme en colère",
    speaker: "Naïah",
    relation: "naiah",
    availableFrom: 1,
    requiresRelation: { id: "naiah", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’elle voudrait comprendre", "Refuser sa plaisanterie sur Amanea", "Lui laisser le droit de ne pas savoir"),
    opening: [
      beat("Narrateur", "Naïah découpe une pomme en quartiers d’une régularité parfaite, puis les dispose comme une couronne avant de la détruire morceau par morceau."),
      beat("Hylee", "Tu penses encore à elle."),
      beat("Naïah", "À la pomme ? Oui, notre relation est passionnelle."),
      beat("Hylee", "À Amanea."),
      beat("Narrateur", "Le couteau s’enfonce dans la planche. Naïah sourit, mais ne tire pas tout de suite sur le manche."),
      beat("Naïah", "Je pense surtout à toutes les bonnes raisons qu’une mère peut avoir de ne jamais regarder sa fille. J’en suis à zéro, c’est frustrant."),
    ],
    resolution: "La colère reste intacte. Dessous, Hylee aperçoit pourtant une question d’enfant que Naïah n’a jamais cessé de poser : qu’avait-elle fait avant même de savoir parler pour mériter d’être ignorée ?",
  });

  add("algratal-apres-conseil", "archives", {
    id: "confidence-iriana-devoir",
    title: "Ce qu’Iriana choisirait sans témoin",
    speaker: "Iriana",
    relation: "iriana",
    availableFrom: 1,
    requiresRelation: { id: "iriana", min: 6 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander quelle carte est la sienne", "Lui demander de choisir contre l’Empire", "Lui rappeler qu’elle peut encore hésiter"),
    opening: [
      beat("Narrateur", "Deux cartes couvrent la table : l’offensive approuvée par le Conseil et les voies de repli annotées de la main d’Iriana."),
      beat("Hylee", "Laquelle montre ce que vous voulez vraiment ?"),
      beat("Iriana", "Vous supposez qu’une héritière possède le luxe d’un désir distinct de sa fonction."),
      beat("Hylee", "Je suppose surtout que vous avez quand même dessiné la seconde."),
      beat("Narrateur", "Iriana pose la paume sur les itinéraires secrets. Le geste ressemble moins à une prise de possession qu’à une protection."),
      beat("Iriana", "Je veux que l’Empire survive. Je commence seulement à douter que cela signifie toujours obéir à ceux qui prétendent l’incarner."),
    ],
    resolution: "Iriana ne se déclare ni rebelle ni alliée. Elle reconnaît une fracture plus dangereuse : pour la première fois, son devoir envers les personnes et son devoir envers l’institution ne lui paraissent plus identiques.",
  });

  add("algratal-apres-conseil", "caserne", {
    id: "confidence-draven-retour",
    title: "Le retour que Draven imagine encore",
    speaker: "Draven",
    relation: "draven",
    availableFrom: 1,
    requiresRelation: { id: "draven", min: 8 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qui l’attend après la guerre", "Lui faire promettre de rentrer", "Refuser une promesse impossible"),
    opening: [
      beat("Narrateur", "Draven vérifie une selle qui n’a aucun défaut. Derrière lui, les soldats parlent de ce qu’ils feront en rentrant."),
      beat("Hylee", "Et vous ?"),
      beat("Draven", "Je vais dormir deux jours, manger quelque chose qui n’a pas voyagé dans une caisse et me faire engueuler par ma famille."),
      beat("Hylee", "Vous souriez."),
      beat("Draven", "Ma femme dira que j’ai maigri. Lineva dira que je ralentis. Elles auront tort toutes les deux, évidemment."),
      beat("Narrateur", "Il décrit cette scène avec une simplicité qui serre la gorge. Pour quelques secondes, la guerre paraît n’être qu’un trajet pénible avant le retour."),
    ],
    resolution: "Draven n’avoue pas craindre la mort. Il avoue craindre plus profondément de revenir trop tard pour retrouver sa famille telle qu’il l’a laissée. Hylee n’essaie pas de transformer cette peur en promesse impossible.",
  });

  add("algratal-apres-conseil", "balcon", {
    id: "confidence-remerii-demain",
    title: "Si demain leur échappe",
    speaker: "Remerii",
    relation: "remerii",
    availableFrom: 1,
    requiresRelation: { id: "remerii", min: 14 },
    approaches: ["lucidite", "audace", "sangfroid"],
    choiceText: personalChoices("Lui demander ce qu’elle n’a jamais dit", "Lui prendre la main sans détour", "Refuser les adieux anticipés"),
    opening: [
      beat("Narrateur", "Sous le balcon, Al’Gratal prépare la guerre. Remerii compte les lanternes qui s’éteignent comme si chacune représentait une heure de moins."),
      beat("Hylee", "Tu veux encore vérifier mon équipement ?"),
      beat("Remerii", "Non. J’ai déjà vérifié deux fois. Trois, si l’on compte la vérification que tu n’as pas remarquée."),
      beat("Hylee", "Alors pourquoi tu es venue ?"),
      beat("Narrateur", "Remerii ouvre la bouche, la referme, puis abandonne enfin l’élégance de sa réponse."),
      beat("Remerii", "Parce que je ne veux pas que notre dernière conversation éventuelle concerne l’état de tes bottes."),
    ],
    resolution: "Elles ne prononcent aucun adieu et ne promettent pas l’impossible. Remerii laisse simplement sa main dans celle d’Hylee assez longtemps pour que le silence dise ce que la guerre n’aura pas le droit d’effacer.",
  });

  function normaliseSpeaker(value) {
    const speaker = String(value || "Narrateur");
    return speaker === "Narrator" ? "Narrateur" : speaker;
  }

  function profileFor(spot, definition, perspective) {
    const perspectiveId = String(perspective || "Hylee").toLowerCase();
    const spotCharacter = String((spot && spot.character) || "").toLowerCase();
    if (spotCharacter && spotCharacter !== perspectiveId && !(perspectiveId === "hylee" && spotCharacter === "hylee")) return spotCharacter;
    const speaker = String(definition.speaker || "").toLowerCase();
    const named = Object.keys(NAMES).find(function find(id) { return speaker === id || speaker === NAMES[id].toLowerCase(); });
    if (named && named !== perspectiveId) return named;
    return "generic";
  }

  function interlocutorName(profileId, definition, perspective) {
    if (profileId !== "generic") return NAMES[profileId] || normaliseSpeaker(definition.speaker);
    const speaker = normaliseSpeaker(definition.speaker);
    if (speaker !== "Narrateur" && speaker.toLowerCase() !== String(perspective || "").toLowerCase()) return speaker;
    return null;
  }

  function pick(list, seed) {
    const values = Array.isArray(list) && list.length ? list : [""];
    return values[stableIndex(seed, values.length)];
  }

  function generatedOpening(context) {
    const definition = context.definition;
    const perspective = context.perspective || "Hylee";
    const profileId = profileFor(context.spot, definition, perspective);
    const profile = VOICES[profileId] || VOICES.generic;
    const other = interlocutorName(profileId, definition, perspective);
    const seed = `${context.periodId}:${context.spot.id}:${definition.id}:open`;
    const povProfile = POV_LINES[perspective] || POV_LINES.Hylee;
    const sequence = [beat("Narrateur", definition.intro)];
    if (other) {
      sequence.push(beat(perspective, pick(povProfile.open, `${seed}:pov`)));
      sequence.push(beat(other, pick(profile.open, `${seed}:other`)));
      sequence.push(beat("Narrateur", pick(profile.motion || VOICES.generic.motion, `${seed}:motion`)));
    } else {
      sequence.push(beat(perspective, pick(povProfile.open, `${seed}:pov`)));
      sequence.push(beat("Narrateur", pick(VOICES.generic.motion, `${seed}:motion`)));
      sequence.push(beat(perspective, perspective === "Hylee" ? "D’accord. Voyons ce que je peux réellement faire." : "Il est temps de choisir ce qui mérite d’être fait."));
    }
    return sequence;
  }

  function generatedOutcome(context, choice) {
    const definition = context.definition;
    const perspective = context.perspective || "Hylee";
    const profileId = profileFor(context.spot, definition, perspective);
    const profile = VOICES[profileId] || VOICES.generic;
    const other = interlocutorName(profileId, definition, perspective);
    const seed = `${context.periodId}:${context.spot.id}:${definition.id}:${choice.id}`;
    const povProfile = POV_LINES[perspective] || POV_LINES.Hylee;
    const choiceLine = pick(povProfile[choice.id] || POV_LINES.Hylee[choice.id] || [choice.label], `${seed}:choice`);
    const customResponse = definition.responses && definition.responses[choice.id];
    const responseLine = customResponse || pick(profile[choice.id] || VOICES.generic[choice.id], `${seed}:response`);
    const sequence = [beat(perspective, choiceLine)];
    if (other) sequence.push(beat(other, responseLine));
    else sequence.push(beat("Narrateur", responseLine));
    sequence.push(beat("Narrateur", pick(profile.motion || VOICES.generic.motion, `${seed}:motion`)));
    sequence.push(beat("Narrateur", definition.resolution));
    const close = pick(profile.close || VOICES.generic.close, `${seed}:close`);
    sequence.push(beat(other || perspective, close));
    return sequence;
  }

  function patchDefinition(periodId, spotId, definition) {
    const patchValue = PATCHES[key(periodId, spotId, definition.id)] || {};
    return {
      ...definition,
      ...patchValue,
      choiceText: { ...(definition.choiceText || {}), ...(patchValue.choiceText || {}) },
      responses: { ...(definition.responses || {}), ...(patchValue.responses || {}) },
    };
  }

  function enrichActivity(context) {
    const definition = context.definition;
    const activity = { ...context.activity };
    activity.opening = (definition.opening || generatedOpening(context)).map(function map(entry) {
      return typeof entry === "string" ? beat("Narrateur", entry) : { speaker: normaliseSpeaker(entry.speaker), text: String(entry.text || "") };
    }).filter(function filter(entry) { return entry.text; });
    activity.miniGame = definition.miniGame || null;
    activity.hiddenTitle = definition.hiddenTitle || null;
    activity.summary = definition.resolution || "Ce moment laisse une trace dans la suite du voyage.";
    activity.choices = (activity.choices || []).map(function map(choice) {
      const outcomes = definition.outcomes && definition.outcomes[choice.id];
      return {
        ...choice,
        response: definition.resolution || choice.response,
        outcome: (outcomes || generatedOutcome(context, choice)).map(function mapBeat(entry) {
          return typeof entry === "string" ? beat("Narrateur", entry) : { speaker: normaliseSpeaker(entry.speaker), text: String(entry.text || "") };
        }).filter(function filter(entry) { return entry.text; }),
      };
    });
    return activity;
  }

  window.SylviniaStoryDialogues = {
    version: 1,
    additions: ADDITIONS,
    patchDefinition,
    enrichActivity,
  };
})();
