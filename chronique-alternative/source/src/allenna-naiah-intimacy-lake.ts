import { AL, NA, P, T } from "./allenna-naiah-kit";
import type { ANExtension } from "./allenna-naiah-intimacy-types";

const BG = "/assets/cross/hylee-naiah-search/route_river.webp";

/* Lac · après la barque sans rames */
const barque: ANExtension = {
  id: "an-ext:lake:barque", date: "lake", branch: "barque", title: "Sous le saule, après la barque", background: BG, music: "intimate",
  seqs: [
    { title: "L’abri du saule", lines: [
      T("Les branches du saule tombent jusqu’à l’eau et ferment l’abri comme un rideau de perles vertes. Dedans, trois couvertures, un feu bas qui ne fume pas, et l’odeur du lac encore accrochée à vos manches."),
      NA("Je l’ai aménagé l’an dernier pour les nuits où la forêt ronfle trop fort. Personne n’y est jamais entré.", "neutral"),
      AL("Alors nous sommes les premières visiteuses.", "shy"),
    ] },
    { title: "Ce que chacune veut", lines: [
      P("Avant tout : on dit ce qu’on veut, et on peut changer d’avis à chaque instant. Allenna ?"),
      AL("Rester près de vous. Être touchée, peut-être, si je le demande. Ne pas être regardée trop longtemps, au début.", "shy"),
      P("Naïah ?"),
      NA("Rester là. Tenir des mains. Choisir moi-même où je pose les miennes. Et partir faire un tour au bord de l’eau quand j’en aurai envie, sans que personne s’en vexe.", "neutral"),
    ] },
    { title: "Les règles de Naïah", lines: [
      NA("Et une chose encore : ce qui se passera entre vous deux vous appartient. Je ne regarde pas, je ne commente pas. Pour une fois.", "smirk"),
      AL("Tu n’es pas obligée de rester.", "neutral"),
      NA("Je sais. C’est pour ça que je reste.", "neutral"),
    ] },
    { title: "La boucle de la chemise", lines: [
      T("Allenna défait sa cape et la plie en quatre, avec une précision qui trahit l’inquiétude. Ses doigts s’arrêtent sur la première boucle de sa chemise et y restent."),
      AL("Je ne sais pas faire ça sans plan. Le moindre geste me paraît une manœuvre.", "troubled"),
      T("Naïah, assise en tailleur près du feu, regarde ostensiblement les flammes, comme si elles lui racontaient une histoire passionnante."),
    ] },
    { title: "Votre initiative", lines: [
      T("Elle attend, sans vous le demander, que quelqu’un fasse le premier pas à sa place, ou lui en laisse la liberté."),
    ], options: [
      { id: "o1", label: "Lui tendre la main, paume ouverte, et attendre qu’elle la prenne", response: [
        P("Rien ne presse. Ma main est là."),
        T("Allenna la regarde un long moment, puis y pose la sienne, les doigts raides d’abord, puis moins."),
      ] },
      { id: "o2", label: "Défaire votre propre chemise en premier, pour qu’elle ne soit pas seule à se découvrir", response: [
        T("Vous défaites vos premiers boutons, lentement, sans la quitter des yeux. L’égalité du geste la désarme plus que n’importe quelle parole."),
      ] },
      { id: "o3", label: "Lui proposer de commencer par s’allonger, simplement, tout habillés", response: [
        P("Allongeons-nous comme ça, d’abord. Habillés. On verra ensuite."),
        T("Un soupir de soulagement lui échappe, si net qu’elle en rit, bas."),
      ] },
    ] },
    { title: "La première détente", lines: [], after: {
      o1: [T("Elle porte votre main à sa joue, puis à la naissance de son cou, là où bat un pouls rapide de cavalière qui vient de franchir une rivière. Elle la laisse là, le temps d’apprendre ce que ça fait.")],
      o2: [AL("Vous avez une cicatrice ici. Je ne l’avais jamais vue.", "thinking"), T("Elle la suit du bout de l’index, sérieuse, comme on relit une carte. Puis, d’un geste décidé, elle défait sa première boucle à son tour.")],
      o3: [T("Allongée sur le dos, les yeux dans les branches, Allenna laisse sa main glisser vers la vôtre sur la couverture. Ses épaules descendent d’un doigt, puis de deux.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah quitte le feu sans bruit et vient s’asseoir derrière sa sœur. Elle ne demande rien ; elle montre, d’un mouvement de tête, les cheveux d’Allenna, et attend la réponse."),
      AL("…Oui.", "shy"),
      T("Elle défait la tresse militaire, mèche par mèche, et refait à la place une tresse lâche, irrégulière, entremêlée d’un fil de brume violette qui luit doucement dans la pénombre."),
      NA("Voilà. Tu ressembles à quelqu’un qui a le droit de se reposer.", "neutral"),
    ] },
    { title: "Le poids qui tombe", lines: [
      T("Quelque chose cède chez Allenna, d’un coup. Elle se laisse aller en arrière, contre l’épaule de sa sœur, et ferme les yeux."),
      AL("Je n’ai pas dormi contre toi depuis nos huit ans.", "sad"),
      NA("Tu donnais des coups de pied. J’espère que tu as progressé.", "smirk"),
    ] },
    { title: "Près, tout près", veiled: true, lines: [
      T("Le feu baisse encore. La brume du lac glisse sous les branches et vous enveloppe d’un silence de coton."),
    ], romance: [
      NA("Je vais dire bonsoir aux grenouilles. Longtemps. Elles bavardent beaucoup.", "smirk"),
      T("Naïah se lève et disparaît derrière le rideau du saule, vers l’eau. Allenna rouvre les yeux. Elle vous regarde, cette fois, sans détourner les siens."),
      T("Son baiser a le goût du cidre de la halte et de la fumée froide. Ses mains, qui savent tout du maniement d’une lame, ne savent rien de votre dos, et l’apprennent avec une lenteur appliquée, vertèbre après vertèbre."),
      T("La chemise de lin glisse de ses épaules. Elle frissonne, moins à cause de l’air que de votre regard, qu’elle soutient pourtant, la mâchoire têtue, jusqu’à ce que la tête lui tourne et qu’elle cache son rire au creux de votre cou."),
    ], friendship: [
      T("Allenna se tourne sur le côté, face à vous, sa sœur dans son dos. Elle pose son front contre le vôtre, simplement, et reste ainsi. Naïah passe un bras par-dessus elle pour vous tenir l’épaule, comme on retient une barque contre le courant."),
      AL("C’est assez. C’est exactement assez.", "smile"),
    ] },
    { title: "La bifurcation", lines: [
      T("Plus tard, une grenouille saute dans l’eau tout près, et le bruit vous fait sursauter tous les trois."),
    ], options: [
      { id: "geste", label: "Remonter la couverture sur elles deux, d’un geste sans parole", response: [T("Vous tirez la couverture jusqu’aux épaules d’Allenna, puis jusqu’à celles de Naïah, revenue sans bruit s’asseoir au bord.")] },
      { id: "confidence", label: "Avouer à voix basse que vous aviez peur de cette soirée", response: [P("J’avais peur de mal faire. De tout gâcher, entre vous deux."), NA("Tu as fait une omelette de nos peurs. Elle est très réussie.", "laugh")] },
      { id: "ralentir", label: "Proposer de ralentir, de juste respirer ensemble un moment", response: [P("On peut juste respirer, maintenant. Rien d’autre."), AL("Oui. Respirer.", "neutral")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [T("Naïah se glisse sous le bord de la couverture, du côté de sa sœur. Elle lui prend la main et dessine, du bout du doigt, de petits cercles sur ses phalanges, un vieux jeu d’enfance dont Allenna se souvient aussitôt.")],
      confidence: [AL("Moi aussi. J’avais préparé trois issues de repli. Je n’en ai utilisé aucune.", "shy"), T("Naïah rit dans l’ombre, et pose sa tête contre l’épaule de sa sœur, puis tend la main pour serrer la vôtre.")],
      ralentir: [T("Trois respirations s’accordent peu à peu, celle d’Allenna la plus lente, celle de Naïah la plus légère. La vôtre trouve sa place entre elles deux, sans effort.")],
    }, romance: [AL("Reste. Ce matin, quand je me réveillerai, je veux que tu sois là.", "shy")], friendship: [AL("Merci d’avoir laissé la soirée être ce qu’elle voulait être.", "smile")] },
    { title: "Au matin, la barque", lines: [], after: {
      geste: [T("L’aube trouve la couverture tirée jusqu’aux trois mentons. Dehors, la barque sans rames est revenue toute seule se ranger contre la rive, bien alignée, comme si Allenna l’avait amarrée en dormant.")],
      confidence: [T("Au réveil, Naïah est déjà dehors, pieds dans l’eau. Elle vous montre la barque du menton : on y a gravé, cette nuit, trois petits traits côte à côte. Personne n’avoue l’avoir fait.")],
      ralentir: [T("Vous êtes la dernière personne à vous réveiller. Allenna fait chauffer de l’eau sur le feu de Naïah, et Naïah lui explique, très sérieusement, que le feu préfère qu’on lui parle. Elles se disputent à voix basse pour ne pas vous réveiller.")],
    } },
  ],
};

/* Lac · après les pieds dans l’eau */
const rive: ANExtension = {
  id: "an-ext:lake:rive", date: "lake", branch: "rive", title: "Les couvertures sèches", background: BG, music: "intimate",
  seqs: [
    { title: "Les capes qui fument", lines: [
      T("Sous le saule, les couvertures sentent la lavande sauvage et un peu la fumée. Les capes trempées pendent à une branche basse et gouttent dans le noir, une note régulière, presque amicale."),
      NA("Personne ne garde ses vêtements mouillés sous mes couvertures. C’est la seule loi de ma forêt.", "smirk"),
      AL("Tu viens de l’inventer.", "stern"),
    ] },
    { title: "Les trois accords", lines: [
      P("On se change, chacun dans son coin. Ensuite, on décide. Allenna, qu’est-ce que tu veux, toi ?"),
      AL("Me réchauffer. Contre vous. Et que personne ne me regarde me changer.", "shy"),
      NA("Moi, je veux être au milieu. Pour le chaud, et pour vous avoir de chaque côté.", "neutral"),
      P("Alors c’est ce qu’on fait. Et si quelqu’un veut autre chose, ou moins, il le dit."),
    ] },
    { title: "Le dos tourné", lines: [
      NA("Je me retourne. Vous aussi. Tout le monde regarde un arbre différent. Et on compte jusqu’à cinquante.", "laugh"),
      T("Vous vous changez en comptant à voix haute, trois voix décalées. Allenna arrive à cinquante la première, évidemment ; Naïah triche et saute de vingt à quarante."),
    ] },
    { title: "La raideur de la recrue", lines: [
      T("Enroulée dans une couverture jusqu’au menton, Allenna s’allonge au bord de l’abri, le plus loin possible du centre, aussi droite qu’à l’inspection."),
      AL("Je suis bien ici.", "stern"),
      NA("Tu es au bord d’une flaque.", "smirk"),
    ] },
    { title: "Votre initiative", lines: [
      T("Naïah s’est installée au milieu, comme promis. Entre vous et Allenna, il reste un espace de la largeur d’une épée."),
    ], options: [
      { id: "o1", label: "Lui demander si elle accepte que vous lui réchauffiez les pieds", response: [P("Tes pieds sont glacés, je les ai sentis tout à l’heure. Je peux ?"), AL("…Oui. Vous pouvez.", "shy")] },
      { id: "o2", label: "Vous rapprocher seulement de Naïah, et laisser Allenna venir d’elle-même", response: [T("Vous vous rapprochez de Naïah, sans un regard pour l’autre bord. Au bout d’un moment, la couverture d’Allenna glisse d’un pouce vers le centre, puis d’un autre.")] },
      { id: "o3", label: "Raconter à mi-voix la bataille d’eau, pour la faire rire", response: [P("Tu as vu la tête de Naïah, trempée ? J’ai cru qu’elle allait te transformer en grenouille."), AL("Elle y a pensé. Je l’ai vu.", "smirk")] },
    ] },
    { title: "Le bord qui se rapproche", lines: [], after: {
      o1: [T("Vous prenez ses pieds entre vos mains sous la couverture. Elle se raidit, puis s’abandonne d’un coup, avec un petit son étranglé qui ressemble à un rire et qu’elle désavouera toute sa vie.")],
      o2: [T("Quand elle arrive enfin contre le dos de sa sœur, Allenna ne dit rien. Naïah non plus. Elle tend juste un bras en arrière, et Allenna le prend.")],
      o3: [T("Elle rit enfin, la tête dans la couverture. Le rire la fait rouler vers le centre, et elle ne retourne pas au bord.")],
    } },
    { title: "Le geste de Naïah", lines: [
      NA("Donnez-moi vos mains. Toutes les deux.", "neutral"),
      T("Elle prend votre main droite et la gauche d’Allenna, les croise sur sa propre poitrine, au-dessus de la couverture, et les tient là, enfermées dans les siennes, comme deux oiseaux qu’on protège du froid."),
      NA("Voilà. Là, je suis bien. Exactement là.", "neutral"),
    ] },
    { title: "La recrue dépose les armes", lines: [
      T("Peu à peu, la respiration d’Allenna se cale sur celle de sa sœur. Ses doigts, sous ceux de Naïah, effleurent les vôtres, puis s’y nouent."),
      AL("Je pourrais m’endormir. Ici. Sans sentinelle.", "troubled"),
      NA("La sentinelle, c’est moi. Je ne dors jamais vraiment.", "smirk"),
    ] },
    { title: "Plus près que prévu", veiled: true, lines: [
      T("Le feu crépite. Une goutte tombe d’une cape, puis une autre, puis plus rien."),
    ], romance: [
      NA("Je vais vérifier que le lac ne s’est pas sauvé. Prenez votre temps. Vraiment.", "smirk"),
      T("Naïah se faufile hors de la couverture et disparaît derrière le rideau de saule. Allenna ne lâche pas votre main. Elle la tire, doucement, jusqu’à ce que vous soyez face à face, sans plus personne entre vous."),
      T("Ses lèvres sont froides, d’abord, puis plus du tout. La couverture glisse de son épaule ; sa peau a gardé une fraîcheur de lac qui s’efface sous vos paumes, à mesure que vous la parcourez, sans hâte, comme on réchauffe une main trop longtemps restée dehors."),
      T("Elle vous rend chaque caresse avec une sorte d’étonnement grave, comme si elle découvrait une langue qu’elle comprenait depuis toujours sans l’avoir jamais parlée."),
    ], friendship: [
      T("Allenna pose sa tête contre l’épaule de Naïah, et sa main libre sur votre bras, au-dessus de la couverture. Vous restez ainsi, trois corps tièdes en rang, comme des chiots dans une caisse de paille."),
      NA("On est ridicules.", "laugh"),
      AL("On est au chaud.", "smile"),
    ] },
    { title: "La bifurcation", lines: [
      T("Un vent froid passe sous les branches. Le feu se couche, presque éteint."),
    ], options: [
      { id: "geste", label: "Vous lever pour raviver le feu, nu-pieds sur la mousse", response: [T("Vous vous levez, ajoutez deux branches. Le feu repart. Quand vous revenez, deux bras s’ouvrent en même temps pour vous laisser une place.")] },
      { id: "confidence", label: "Dire ce que vous a fait la bataille d’eau, ce rire d’Allenna", response: [P("Ton rire, tout à l’heure, dans l’eau. Je le garderai longtemps."), AL("Je ne ris pas souvent. Vous l’avez eu gratuitement.", "shy")] },
      { id: "ralentir", label: "Fermer les yeux et laisser le froid passer sans rien faire", response: [T("Vous fermez les yeux. Le froid passe, comme une bête curieuse qui renifle l’abri et repart.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [NA("Tu as les pieds gelés. À ton tour.", "smirk"), T("Naïah pose vos pieds froids contre les siens, sans un frisson, comme si le froid lui était un vieil ami.")],
      confidence: [NA("Moi aussi, je le garde. Je le mettrai dans une luciole, pour les jours où elle sera insupportable.", "laugh")],
      ralentir: [T("Quand vous rouvrez les yeux, Naïah est assise, genoux contre la poitrine, et veille sur vous deux en fredonnant un air que vous ne connaissez pas.")],
    }, romance: [AL("Tu as les mains chaudes, maintenant. Garde-les là.", "shy")], friendship: [AL("C’est la première fois que j’ai chaud depuis la frontière.", "smile")] },
    { title: "Les capes sèches", lines: [], after: {
      geste: [T("Au matin, le feu brûle encore. Les capes ont séché dans la nuit, raides et tièdes. Allenna les plie toutes les trois, la vôtre comprise, et la vôtre plus soigneusement que les autres.")],
      confidence: [T("À l’aube, Naïah vous réveille avec une luciole posée sur le nez. Dedans, si on la regarde de très près, on voit une gerbe d’eau et quelqu’un qui rit.")],
      ralentir: [T("Au réveil, la couverture ne couvre plus que vous, mais pas pour longtemps : deux voix discutent dehors de la meilleure manière de faire sécher des bottes. Aucune des deux n’a raison.")],
    } },
  ],
};

/* Lac · après le conte des lucioles */
const lucioles: ANExtension = {
  id: "an-ext:lake:lucioles", date: "lake", branch: "lucioles", title: "Les histoires sous le saule", background: BG, music: "intimate",
  seqs: [
    { title: "La lanterne verte", lines: [
      T("La lanterne d’Allenna, toujours habitée par les trois lucioles de Naïah, pend à une branche du saule. Sa lumière verte tremble sur les couvertures, sur les mains, sur les visages."),
      NA("Les histoires se racontent allongé. C’est une règle ancienne. Je viens de la trouver dans un livre que je n’ai pas écrit.", "smirk"),
    ] },
    { title: "Avant la première histoire", lines: [
      P("On s’allonge, et chacune me dit jusqu’où elle veut aller ce soir. Moi, je veux tout ce que vous voudrez, rien de plus."),
      AL("Je veux qu’on me tutoie. Et qu’on me touche, peut-être, si l’envie vient. Pas encore.", "shy"),
      NA("Moi, je raconte. Je reste. Je décide de mes mains. Si je pars, ce sera pour revenir.", "neutral"),
    ] },
    { title: "Une histoire comme condition", lines: [
      NA("Et j’ai une condition : chaque fois que la commandante rougit, je raconte une histoire embarrassante sur elle.", "laugh"),
      AL("Alors je ne rougirai pas.", "stern"),
      NA("Elle a déjà rougi. Première histoire.", "smirk"),
    ] },
    { title: "La pudeur au tutoiement", lines: [
      T("Allenna s’allonge sur le dos, les mains croisées sur le ventre d’une couverture, comme un gisant de chapelle."),
      AL("Tu… Tu peux t’approcher. Je ne sais pas encore quoi faire de mes bras.", "troubled"),
      T("Le « tu » lui coûte, vous le voyez. Elle le prononce pourtant, et ne le reprend pas."),
    ] },
    { title: "Votre initiative", lines: [
      T("Naïah a commencé une histoire de bassin et de poissons. Allenna l’écoute en fixant les branches."),
    ], options: [
      { id: "o1", label: "Vous allonger contre Allenna et poser votre tête sur son épaule", response: [T("Vous posez la tête sur son épaule. Ses bras croisés se défont, l’un d’eux vient se refermer autour de vous, d’abord avec précaution, puis avec une assurance qui la surprend elle-même.")] },
      { id: "o2", label: "Lui demander de vous raconter, elle, une histoire de Naïah enfant", response: [P("À ton tour. Une histoire sur elle."), AL("Elle avait peur des escaliers en colimaçon. Elle les descendait sur les fesses.", "smirk"), NA("MENTEUSE.", "angry")] },
      { id: "o3", label: "Prendre sa main sous la couverture, sans rien dire", response: [T("Vous trouvez sa main sous la couverture. Elle la serre, fort, comme on serre la main d’une recrue avant la première bataille, puis desserre peu à peu.")] },
    ] },
    { title: "La lumière qui change", lines: [], after: {
      o1: [AL("C’est… agréable. Je ne m’attendais pas à ce que ce soit simplement agréable.", "shy")],
      o2: [T("Naïah se venge aussitôt par une histoire de bassin aux poissons. Allenna en rit si fort qu’elle s’étouffe, et c’est vous qu’elle agrippe pour reprendre son souffle.")],
      o3: [NA("Vous vous tenez la main sous ma couverture. Je le sais. Les lucioles me disent tout.", "smirk")],
    } },
    { title: "Le geste de Naïah", lines: [
      NA("Fermez les yeux. Tous les deux. Je vous montre quelque chose, si vous voulez bien que j’entre un tout petit peu.", "thinking"),
      AL("Oui.", "neutral"),
      P("Oui."),
      T("Derrière vos paupières, une prairie de lucioles s’allume, immense, silencieuse. Vous savez que c’est la même pour Allenna, parce que sa main tressaille dans la vôtre au même instant."),
      NA("C’est ce que je voyais, la nuit, quand je n’arrivais pas à dormir, au palais. Je ne l’ai jamais montré à personne.", "neutral"),
    ] },
    { title: "L’héritière s’abandonne", lines: [
      T("Quand la prairie s’éteint, Allenna garde les yeux fermés. Son visage a perdu une tension que vous ne lui aviez jamais vu quitter."),
      AL("Merci, Naïah.", "sad"),
      NA("Tu pleures ? C’est la deuxième histoire, ça.", "smirk"),
      AL("Je ne pleure pas.", "smile"),
    ] },
    { title: "Au plus près", veiled: true, lines: [
      T("La lanterne baisse. Les lucioles, dedans, s’endorment l’une après l’autre."),
    ], romance: [
      NA("Je vais remettre les lucioles au lac. Elles ont travaillé, elles ont droit à leur nuit.", "neutral"),
      T("Naïah décroche la lanterne et sort, laissant l’abri dans une pénombre bleue. Allenna se tourne vers vous. Elle cherche votre bouche à tâtons, la trouve, et y reste longtemps."),
      T("Ses doigts défont vos vêtements avec la gravité d’une première fois qu’elle aurait trop longtemps repoussée. Elle demande, à chaque bouton, d’un regard ; vous répondez, à chaque bouton, d’un baiser."),
      T("Quand vos peaux se trouvent enfin, elle a ce souffle tremblé de quelqu’un qui plonge dans une eau dont il ne connaît pas la profondeur, et qui découvre qu’il sait nager."),
    ], friendship: [
      T("Allenna se blottit contre vous, le front contre votre épaule. Naïah, de l’autre côté, raconte encore, plus bas, une histoire dont elle oublie la fin à mesure, et que personne ne lui réclame."),
    ] },
    { title: "La bifurcation", lines: [
      T("Quelque part dans la nuit, Naïah revient sans bruit et s’assoit à l’entrée de l’abri, la lanterne éteinte sur les genoux."),
    ], options: [
      { id: "geste", label: "Lui faire signe de revenir sous la couverture, entre vous deux", response: [T("Vous soulevez le bord de la couverture. Naïah hésite, puis s’y glisse, et Allenna, sans ouvrir les yeux, se décale pour lui faire de la place.")] },
      { id: "confidence", label: "Lui demander la fin de l’histoire du bassin, celle qu’elle n’a jamais racontée", response: [P("Et le gros poisson ? Tu l’as revu ?"), NA("Il est dans ce lac. Je l’ai sauvé du bassin des cuisines la nuit où je suis partie. Personne ne le sait. Même pas elle.", "sad")] },
      { id: "ralentir", label: "Laisser la nuit se taire, sans plus d’histoires", response: [T("Vous ne dites rien. Naïah non plus. Pour la première fois de la soirée, personne ne raconte rien.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [NA("Je suis au milieu. Encore. Je crois que c’est ma place.", "neutral")],
      confidence: [AL("Je le savais. J’ai vu le bassin vide le lendemain. Je n’ai rien dit à personne.", "shy"), T("Naïah se tourne vers sa sœur, bouche ouverte, sans rien trouver à répondre. C’est la première fois que vous la voyez à court de mots.")],
      ralentir: [T("Le silence a un goût de mousse et de lac. On entend, très loin, une chouette qui se trompe d’heure.")],
    }, romance: [AL("Tu peux me tutoyer demain aussi. Et après-demain.", "shy")], friendship: [AL("C’était la plus belle histoire de la soirée. Celle où personne ne parle.", "smile")] },
    { title: "Le gros poisson", lines: [], after: {
      geste: [T("Au matin, vous vous réveillez au milieu d’un nœud de bras et de couvertures dont il est impossible de savoir à qui appartient quoi. Naïah ronfle, très légèrement. Allenna prétendra le contraire.")],
      confidence: [T("À l’aube, Naïah vous emmène tous les deux au bord du lac. Un très gros poisson argenté passe sous la surface, lent, avec une tache violette sur le flanc. Allenna lui fait un salut militaire.")],
      ralentir: [T("La lanterne est de nouveau allumée quand vous ouvrez les yeux. Une seule luciole est revenue dedans. Elle refuse de partir.")],
    } },
  ],
};

export const AN_LAKE_EXTENSIONS: ANExtension[] = [barque, rive, lucioles];
