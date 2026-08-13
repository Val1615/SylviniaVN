import type { PlayerSex } from "./date-scenes";

export type AdvancedGroupRole = "first" | "second" | "shared";
export type AdvancedGroupRawLine = string | [speaker: string, text: string, mood?: string];

type GroupSceneCatalog = Record<string, Record<PlayerSex, Record<AdvancedGroupRole, AdvancedGroupRawLine[]>>>;

const scene = (...entries: AdvancedGroupRawLine[]): AdvancedGroupRawLine[] => entries;
const P = (text: string): AdvancedGroupRawLine => ["{player}", text];
const C = (speaker: string, text: string, mood?: string): AdvancedGroupRawLine => [speaker, text, mood];

/** Un passage explicite distinct pour chacune des 54 routes à trois. */
export const GROUP_EXPLICIT_SCENES: GroupSceneCatalog = {
  "group-date-hylee-remerii": {
    femme: {
      first: scene(
        "Hylee s’allonge entre vos jambes et pose sa bouche contre votre intimité humide, tandis que Remerii s’installe derrière elle. La mage ouvre la tenue d’Hylee et glisse ses doigts entre ses lèvres de velours ; chaque mouvement de langue qui stimule votre perle de plaisir reçoit ainsi une pression sur le point de feu d’Hylee, reliant vos réactions au lieu de créer deux couples séparés.",
        C("Hylee", "Je veux garder son rythme sur moi pendant que je trouve le tien… Si l’une de vous change, dites-le avant que je perde complètement le fil.", "determined"),
        C("Remerii", "Je ne corrigerai rien. Je suivrai ce que votre corps lui apprend et ce qu’elle me demande en retour.", "calm"),
        "Vous placez une main dans les cheveux d’Hylee et l’autre sur celle de Remerii. Hylee vous conduit à l’orgasme sans quitter votre intimité, puis jouit à son tour lorsque la mage reprend exactement le geste que vos tremblements avaient accéléré ; Remerii vous laisse ensuite l’attirer vers sa propre bouche afin que la circulation ne s’arrête à aucune des deux conclusions.",
      ),
      second: scene(
        "Remerii vous fait asseoir au bord de la table, une jambe sur son épaule, et applique sa langue sur votre point de feu pendant que deux doigts glissent en vous. Hylee se place derrière la mage, embrasse sa nuque puis presse sa propre intimité contre la cuisse de Remerii ; le givre suit leurs mouvements et vous montre exactement comment votre plaisir trouble simultanément leurs deux corps.",
        C("Remerii", "Hylee, gardez cette pression. Et vous… dites-moi si mes doigts doivent rester ainsi ou chercher un angle plus profond.", "calm"),
        C("Hylee", "Tu viens encore de donner deux consignes dans la même phrase. Je vais t’interrompre comme promis.", "teasing"),
        "Le baiser d’Hylee brise la méthode au moment où vous réclamez davantage. Remerii accélère sans pouvoir commenter, Hylee frotte son point de feu contre elle et votre orgasme les fait toutes deux perdre le rythme ; la mage vous ramène ensuite contre Hylee, laissant celle-ci choisir comment sa bouche et vos doigts prolongeront ensemble le plaisir de celle qui avait commencé.",
      ),
      shared: scene(
        "Vous formez un triangle allongé : vos jambes entrelacées à celles d’Hylee dans un ciseau serré, Remerii agenouillée entre vos épaules. Elle caresse alternativement vos deux perles de plaisir pendant que vos bassins frottent leurs lèvres de velours l’une contre l’autre ; après le premier orgasme, vous pivotez toutes trois afin que Remerii prenne votre place dans le ciseau et qu’Hylee guide vos mains sur elle.",
        P("La lanterne change de couleur avec celle qui reçoit deux attentions. Personne ne garde le centre plus longtemps qu’elle ne le souhaite."),
        C("Hylee", "Alors je veux voir Remerii perdre sa mesure en bleu… et toi en argent, juste après.", "teasing"),
        "La rotation devient votre langage commun. Remerii jouit sous le frottement d’Hylee et vos doigts, puis conserve une main sur chacune de vous pendant que vos positions changent encore ; le dernier orgasme n’appartient pas à une finale collective, mais à la personne dont les deux autres ont choisi de maintenir le geste jusqu’au bout.",
      ),
    },
    homme: {
      first: scene(
        "Hylee s’agenouille entre vos jambes, prend votre sexe dressé dans sa bouche et garde une main autour de sa base. Remerii vient derrière elle, ouvre ses cuisses et caresse son intimité humide ; lorsque Hylee vous accueille plus profondément, la mage glisse deux doigts en elle, si bien que ses gémissements vibrent directement contre votre membre viril.",
        C("Hylee", "Remerii… ne ralentis surtout pas quand il bouge ses hanches. Je veux sentir les deux rythmes se rejoindre.", "determined"),
        C("Remerii", "Je vous entends comme une partenaire, pas comme une élève. Demandez encore lorsque vous voudrez davantage.", "calm"),
        "Vous annoncez chaque poussée et Hylee les accueille avec une audace croissante. Votre orgasme survient pendant que Remerii maintient son point de feu ; la cryomancienne jouit presque aussitôt, neige sur les épaules, puis vous aide à relever Remerii sur le lit afin que vos mains et la bouche d’Hylee donnent enfin à la mage la place active qu’elle avait refusé de prendre seule.",
      ),
      second: scene(
        "Remerii vient vous chevaucher face à face et guide votre membre viril dans son écrin de chair. Hylee s’agenouille derrière elle, soutient ses hanches et caresse sa perle de plaisir à chaque descente ; vous embrassez Hylee au-dessus de l’épaule de la mage, transformant la précision des mouvements de Remerii en une étreinte où les trois bouches restent accessibles.",
        C("Remerii", "Je règle la profondeur. Hylee garde le contact extérieur. Vous choisissez la cadence… Voilà une méthode à trois que je n’avais pas prévue.", "smirk"),
        C("Hylee", "Et si tu recommences à l’expliquer, je change le rythme avec mes doigts jusqu’à ce que tu oublies la phrase.", "teasing"),
        "Hylee tient sa promesse. Remerii perd sa diction, accélère sur vous et jouit lorsque ses deux partenaires maintiennent exactement leurs gestes ; elle se retire seulement après l’avoir demandé, puis aide Hylee à venir vous chevaucher à son tour, ses doigts restant entre vos deux bassins pour que le changement de femme ne transforme jamais la troisième en spectatrice.",
      ),
      shared: scene(
        "Hylee se place à quatre pattes devant Remerii et vous accueille lentement en elle tandis que la mage l’embrasse et stimule sa perle de plaisir. Une de vos mains rejoint l’intimité de Remerii, qui reste agenouillée face à Hylee ; après l’orgasme de la cryomancienne, les deux femmes inversent leurs places et Remerii vous chevauche pendant qu’Hylee maintient son givre autour de vos trois points de contact.",
        P("Pas un relais où l’une attend. Celle qui ne reçoit pas la pénétration garde un geste sur chacun des deux autres."),
        C("Remerii", "Une circulation continue, donc. Hylee, votre main sur lui ; la sienne sur moi. Et cette fois je ne compte aucune reprise."),
        "Les deux configurations possèdent des rythmes entièrement différents : Hylee vive et joueuse, Remerii profonde et méthodique jusqu’à ce que son plaisir la désordonne. Vous jouissez pendant la seconde chevauchée, mais Hylee garde sa bouche sur la mage et Remerii ses doigts sur vous, prolongeant le cercle jusqu’à ce que les trois corps aient réellement terminé.",
      ),
    },
    intersexe: {
      first: scene(
        "Hylee vous demande de choisir deux symboles gravés dans la glace : bouche, frottement ou pénétration. Elle suit les deux que vous désignez pendant que Remerii s’installe contre son dos et stimule Hylee d’une main ; l’autre main de la mage reste sur votre hanche, prête à modifier la position afin que votre intimité réelle — et non une supposition — organise la profondeur et l’angle.",
        C("Hylee", "Je commence avec ce que tu viens de choisir. Si ton corps change d’avis, le symbole fond et on en dessine un autre.", "soft"),
        C("Remerii", "Et je suivrai Hylee sans faire de votre réponse une donnée définitive. Trois corps, trois corrections toujours possibles."),
        "Vous faites effectivement fondre un symbole au milieu de la scène. Hylee adapte sa bouche et son bassin, Remerii change la pression qu’elle lui donne et vos plaisirs retrouvent une circulation nouvelle ; votre orgasme arrive sous une configuration qui n’existait pas au début, puis vous guidez toutes deux vers Remerii afin que la mage reçoive à son tour deux gestes choisis au présent.",
      ),
      second: scene(
        "Remerii vous installe sur le côté et vous demande de guider sa bouche, ses doigts ou son bassin vers ce que vous souhaitez recevoir. Hylee s’allonge face à vous, une main sur votre point de feu et l’autre dans l’intimité de Remerii ; chaque mouvement de la mage sur votre corps est troublé par la cryomancienne, qui remplace l’ancienne relation de leçon par un désir formulé sans détour.",
        C("Remerii", "Votre anatomie ne décide d’aucun rôle. Votre main indique mon geste ; la voix d’Hylee indique le sien. Je n’ai besoin de rien déduire."),
        C("Hylee", "Moi, je déduis seulement qu’elle va bientôt oublier de parler. Tu veux m’aider à vérifier ?", "teasing"),
        "Vous augmentez ensemble la pression sur Remerii jusqu’à lui arracher un oui brisé, tandis qu’elle maintient sur vous la stimulation que vous avez choisie. La mage jouit sans retirer sa main ni sa bouche ; elle revient ensuite à votre rythme et Hylee se place contre votre autre flanc, de sorte que votre orgasme reste reçu par deux partenaires actives et non par une observatrice et une exécutante.",
      ),
      shared: scene(
        "Vous dessinez avec la lanterne trois zones mobiles : recevoir, donner, changer. Chaque personne y entre avec le geste adapté à son corps — ciseau, frottement, bouche ou pénétration consentie — puis en sort dès qu’une autre demande apparaît. Hylee garde les transitions visibles dans le givre ; Remerii s’assure qu’aucune configuration ne devient une obligation de symétrie.",
        P("Nos gestes n’ont pas besoin de se ressembler. Ce qui doit être égal, c’est la liberté de demander une position entièrement différente."),
        C("Remerii", "Alors aucune répétition obligatoire. Hylee reçoit selon son corps, vous selon le vôtre, et je formulerai le mien sans les prendre pour modèle."),
        "Les trois scènes physiques s’enchaînent sans se copier. Hylee jouit dans un frottement de givre, Remerii dans la pénétration ou la pression qu’elle a choisie, puis elles adaptent ensemble bouche et mains à votre désir singulier ; le dernier éclat de la lanterne marque trois plaisirs distincts, reliés par le regard et non par une anatomie supposée commune.",
      ),
    },
  },

  "group-date-valurn-bellirith": {
    femme: {
      first: scene(
        "Valurn vous fait allonger sur la table du tournoi et prend place entre vos cuisses. Sa langue rejoint votre perle de plaisir tandis que ses doigts glissent en vous ; Bellirith s’agenouille derrière lui, prend son membre viril dans sa main et règle ses caresses sur vos réactions, transformant chaque gémissement de Valurn contre votre intimité en un point qu’elle prétend aussitôt avoir marqué.",
        C("Valurn", "Bellirith essaie de me déconcentrer. Dites-lui donc que ma bouche reste exactement là où vous la voulez.", "charming"),
        C("Bellirith", "Sa constance est touchante. Voyons si elle survit quand je cesse d’être charitable.", "seductive"),
        "La rivalité accélère sans vous réduire au prix. Vous ordonnez à Bellirith de garder une pression précise et à Valurn de ne plus changer de rythme ; votre orgasme les force tous deux à obéir à la même demande, puis vous les faites échanger leurs hauteurs pour que Bellirith vous reçoive entre ses cuisses tandis que Valurn maintient son plaisir au lieu de revendiquer votre conclusion.",
      ),
      second: scene(
        "Bellirith vous attire à califourchon sur sa cuisse nue et fait glisser deux doigts dans votre intimité pendant que votre perle de plaisir frotte sa peau. Valurn se place derrière elle, embrasse sa nuque puis stimule son point de feu d’une main ; Bellirith doit ainsi conserver votre cadence alors que son rival s’applique à fissurer chaque expression séduisante qu’elle lui oppose.",
        C("Bellirith", "Il espère me faire perdre votre rythme. Ce serait presque inquiétant si je ne sentais pas déjà votre corps me réclamer davantage."),
        C("Valurn", "Je ne veux pas qu’elle échoue. Je veux qu’elle réussisse en cessant enfin de prétendre que cela ne lui coûte rien."),
        "Vous poussez Bellirith à formuler sa propre demande et augmentez le frottement sur sa cuisse. Elle vous conduit à l’orgasme au moment où Valurn la fait jouir sous sa main ; aucun des deux ne peut s’attribuer le double résultat, et vous les obligez à s’embrasser avant de reprendre une nouvelle position où vos doigts restent le seul arbitre accepté.",
      ),
      shared: scene(
        "Vous chevauchez Valurn face à face après avoir guidé son membre viril dans votre intimité humide. Bellirith se place derrière vous, une main sur votre perle de plaisir et l’autre entre les cuisses de Valurn ; lorsque votre première montée ralentit, vous quittez le membre de l’homme pour entrelacer vos jambes à celles de Bellirith dans un ciseau, Valurn utilisant sa bouche sur elle et ses doigts sur vous.",
        P("La prochaine personne qui parle de score perd le droit de choisir la position suivante."),
        C("Bellirith", "Je n’ai besoin d’aucun score. Son visage quand je presse ici vaut déjà tous les trophées.", "smirk"),
        "Valurn répond par un geste plutôt qu’une réplique. Bellirith jouit contre votre bassin, vous revenez ensuite sur le membre viril encore dressé tandis qu’elle garde ses doigts entre vous ; vos trois orgasmes arrivent dans des configurations différentes, et la seule victoire consiste à voir les deux rivaux demeurer actifs après avoir eux-mêmes cédé.",
      ),
    },
    homme: {
      first: scene(
        "Valurn s’agenouille devant vous et prend votre sexe dressé dans sa bouche, sa main poursuivant la base. Bellirith s’allonge sous son bassin, accueille son membre viril entre ses lèvres de velours et le guide en elle ; les mouvements de Valurn vous donnent ainsi du plaisir tout en pénétrant la femme, qui garde ses doigts sur sa propre perle et le provoque à chaque ralentissement.",
        C("Valurn", "Elle prétend mener depuis dessous. J’aimerais beaucoup vous entendre confirmer lequel de nous vous fait réellement perdre pied."),
        C("Bellirith", "Continue à parler. Chaque mot modifie délicieusement l’angle avec lequel tu me remplis.", "seductive"),
        "Vous refusez de trancher et imposez la cadence commune. Valurn conserve votre membre entre ses lèvres, Bellirith règle ses hanches et vous jouissez pendant que leur rivalité les conduit à une intensité qu’aucun ne peut feindre ; elle atteint ensuite l’orgasme autour de Valurn, qui reste actif malgré son propre plaisir et reçoit votre main comme une troisième reprise.",
      ),
      second: scene(
        "Bellirith s’installe à quatre pattes sur la table et vous guide derrière elle. Votre membre viril entre lentement dans son écrin de chair tandis que Valurn se couche face à elle ; elle prend son membre dans sa bouche et il maintient deux doigts sur sa perle de plaisir, transformant chacune de vos pénétrations en une réaction qu’elle ne peut cacher ni à l’homme devant elle ni à vous.",
        C("Bellirith", "Deux témoins, aucun charme et cette position scandaleusement lisible… Faites donc de votre mieux pour me faire perdre toute dignité."),
        C("Valurn", "Sa dignité survivra. Son sourire, en revanche, vient déjà de déclarer forfait."),
        "Vous gardez la profondeur que Bellirith réclame, Valurn la pression extérieure qu’elle ne peut plus commenter. Son orgasme contracte son intimité autour de vous et coupe sa bouche du membre de Valurn ; vous la soutenez pendant qu’il reprend ses caresses sur vous, puis vos rôles se croisent jusqu’à ce que les deux hommes aient reçu chacun une attention directe plutôt qu’un simple spectacle.",
      ),
      shared: scene(
        "Bellirith s’assied entre vous et Valurn, une jambe sur chacune de vos cuisses. Elle prend vos deux membres virils dans ses mains et les frotte alternativement contre son intimité humide ; lorsqu’elle choisit le premier à accueillir, l’autre homme maintient sa perle de plaisir et embrasse son rival au-dessus de son épaule, empêchant la pénétration de transformer la scène en duel de possession.",
        P("Elle choisit le corps qu’elle reçoit et le moment où elle change. Celui qui attend ne disparaît pas : il s’occupe d’elle et de l’autre."),
        C("Bellirith", "Enfin une compétition où ma décision ne devient pas le trophée. Valurn, garde ta main. Toi… entre maintenant."),
        "La rotation suit sa voix. Bellirith jouit pendant le second contact, mais ses mains restent sur les deux hommes ; Valurn et vous poursuivez ensuite dans une position latérale choisie entre vous, tandis qu’elle distribue bouche et doigts avec une expérience réelle. Les trois conclusions ont ainsi des formes différentes et aucun classement possible.",
      ),
    },
    intersexe: {
      first: scene(
        "Valurn vous demande de désigner le contact qu’il doit mener pendant que Bellirith le distrait. Vous choisissez sa bouche sur votre point de feu et précisez la pénétration ou le frottement que votre intimité accepte ; Bellirith se place contre son dos, stimule son membre viril et garde une main sur vous, afin que la provocation traverse les trois corps plutôt que de viser une performance isolée.",
        C("Valurn", "Je connais cent manières de feindre l’assurance. Celle-ci n’en fait pas partie : dites-moi simplement si ma bouche reste au bon endroit."),
        C("Bellirith", "Il devient presque séduisant lorsqu’il cesse de se croire mystérieux. Ne le rassurez pas trop vite."),
        "Vous répondez par une indication précise et modifiez la position lorsque votre corps le demande. Valurn s’adapte sans détour, Bellirith accélère sur lui et votre orgasme fait perdre leurs deux masques en même temps ; vous reprenez ensuite le jeu sur Bellirith selon le contact qu’elle formule, Valurn continuant à vous toucher pour que personne ne quitte le cercle après avoir joui.",
      ),
      second: scene(
        "Bellirith vous installe face au miroir neutre et demande comment son corps doit rencontrer le vôtre : langue, main, frottement ou pénétration. Valurn vient derrière elle et suit ses réactions réelles pendant qu’elle accomplit votre choix ; chaque fois qu’il la pousse vers le plaisir, Bellirith doit vous demander si elle conserve encore la pression exacte plutôt que de sauver sa pose.",
        C("Bellirith", "Je peux être troublée et rester attentive. Ne laissez surtout pas son sourire vous convaincre que l’un exclut l’autre."),
        C("Valurn", "Je souris seulement parce qu’elle vient de vous demander la même chose deux fois. Voilà une sincérité historiquement rare."),
        "Vous confirmez, puis exigez un changement propre à votre corps. Bellirith l’adopte sans charme, Valurn l’accompagne d’une caresse sur elle et la chaîne de réactions vous conduit tous trois vers des plaisirs distincts ; son orgasme se reflète sans retouche, le vôtre sans catégorie imposée, celui de Valurn dans la main que vous avez choisie de lui offrir.",
      ),
      shared: scene(
        "Vous tracez trois marques sur la table : donner, recevoir, surprendre. Chacun y choisit une posture adaptée — Bellirith peut accueillir une pénétration ou un frottement, Valurn recevoir une bouche ou un corps, vous définir entièrement votre propre intimité. La personne hors de la marque centrale doit garder une main sur les deux autres, ce qui transforme leur rivalité en relais physique.",
        P("Aucun de vous ne gagne en devinant mon corps. Vous gagnez seulement le droit de continuer en écoutant sa prochaine demande."),
        C("Valurn", "Enfin une règle qui rend la triche inutile. Bellirith, je vous laisse la première surprise — uniquement parce que je prépare mieux."),
        "Les surprises restent toutes différentes : Bellirith choisit une position sans charme, Valurn une pénétration ou un frottement sans pari, vous une configuration qu’aucun des deux n’avait anticipée. Les orgasmes interrompent la compétition à trois moments distincts, mais chacun continue d’employer bouche, mains ou paroles jusqu’à ce que le dernier corps ait réellement terminé.",
      ),
    },
  },

  "group-date-iriana-valurn": {
    femme: {
      first: scene(
        "Iriana vous installe contre les coussins de l’alcôve et vient s’agenouiller entre vos cuisses. Sa langue rejoint votre perle de plaisir tandis que ses doigts pénètrent votre intimité selon votre demande ; Valurn se place derrière elle, ouvre sa robe et glisse son membre viril en Iriana par mouvements retenus, laissant l’Impératrice conduire votre plaisir tout en choisissant la profondeur qu’elle reçoit.",
        C("Iriana", "Je ne transmettrai aucune consigne à votre place. Dites-moi directement ce que ma bouche doit garder… Valurn entendra la demande qui le concerne.", "calm"),
        C("Valurn", "Une audience où chacun plaide pour son propre désir. J’ignorais que la réforme institutionnelle pouvait avoir cet angle.", "charming"),
        "Votre demande et celle d’Iriana fixent deux rythmes différents. Elle vous fait jouir sans interrompre le mouvement qu’elle reçoit, puis se redresse contre Valurn et atteint son orgasme sous vos doigts réunis ; l’homme garde ensuite sa main sur elle pendant qu’Iriana vous attire vers son membre, redistribuant le pouvoir sans transformer votre plaisir en faveur impériale.",
      ),
      second: scene(
        "Valurn s’allonge entre vos jambes et pose sa bouche sur votre intimité humide, ses doigts maintenant votre point de feu lorsqu’il reprend son souffle. Iriana vient s’asseoir au-dessus de son visage, tournée vers vous ; elle guide sa propre intimité contre sa langue tout en se penchant pour vous embrasser, de sorte que Valurn doit écouter deux corps et que vous gardez une main sur chacune de ses réactions.",
        C("Valurn", "Deux femmes capables de me donner des ordres contradictoires. Je commence à comprendre pourquoi cette soirée exigeait la suppression du protocole."),
        C("Iriana", "Ce ne sont pas des ordres. Si vous ne percevez plus la différence, nous changeons immédiatement de position.", "smirk"),
        "Valurn confirme la différence et reprend avec une attention dépourvue de plaisanterie. Sa main vous conduit à l’orgasme pendant que sa bouche fait perdre à Iriana toute posture publique ; vous descendez ensuite entre eux, utilisez vos doigts sur la femme et votre bouche sur l’homme, prouvant que celle qui vient de jouir peut rester l’actrice d’une nouvelle configuration.",
      ),
      shared: scene(
        "Vous vous asseyez sur Valurn et accueillez son membre viril en vous, tandis qu’Iriana se place derrière votre dos. Sa main caresse votre perle de plaisir et l’autre guide les doigts de Valurn vers sa propre intimité ; lorsque vous ralentissez, Iriana prend votre place au-dessus de lui et vous vous agenouillez devant elle, bouche sur son point de feu, gardant les trois corps dans le même changement de préséance.",
        P("La personne au-dessus choisit la cadence, celle entre ses cuisses choisit la pression, et Valurn n’interprète aucun silence comme une permission."),
        C("Iriana", "Une règle remarquablement précise pour une soirée sans protocole. Je l’adopte parce qu’elle circule avec nous.", "calm"),
        "Votre chevauchée se termine dans votre orgasme ; celle d’Iriana dans un plaisir plus lent, soutenu par votre langue. Valurn jouit ensuite sous ses mouvements pendant que vous gardez vos doigts sur elle, et l’Impératrice refuse de se retirer avant d’avoir accompagné votre corps dans une dernière reprise choisie, sans dette ni rang.",
      ),
    },
    homme: {
      first: scene(
        "Iriana s’agenouille entre vos jambes devant le fauteuil privé et prend votre sexe dressé dans sa bouche. Valurn vient derrière elle, guide son membre viril entre ses lèvres de velours et la pénètre lentement ; chaque poussée fait glisser la bouche d’Iriana plus profondément sur vous, mais elle garde une main levée pour imposer l’arrêt immédiat si l’un des deux rythmes cesse de lui convenir.",
        C("Iriana", "Valurn règle sa profondeur avec ma main gauche. Vous annoncez vos mouvements à ma droite. Aucun de vous ne parle pour l’autre."),
        C("Valurn", "Je reconnais là une organisation impériale étonnamment stimulante. Et, pour une fois, parfaitement volontaire."),
        "Les deux hommes suivent ses signes sans chercher à les comparer. Votre orgasme arrive dans sa bouche alors que Valurn maintient la pénétration qu’elle réclame ; Iriana jouit peu après, prise entre vos mains et son bassin, puis vous fait échanger de place seulement si Valurn formule lui-même le désir de recevoir une attention que vous acceptez de lui donner.",
      ),
      second: scene(
        "Valurn vous fait asseoir face à lui et réunit vos membres virils dans une main lubrifiée, alternant pression commune et caresses distinctes. Iriana s’agenouille derrière lui, glisse ses doigts dans son intimité préparée et garde l’autre main sur votre cuisse ; la provocation de Valurn se brise chaque fois que la profondeur choisie par l’Impératrice rend son propre rythme moins régulier.",
        C("Valurn", "Elle croit me rendre incapable de vous distraire. C’est adorablement optimiste… Iriana, gardez pourtant exactement cet angle."),
        C("Iriana", "Voilà enfin une demande sans détour. Continuez votre main ; je continuerai la mienne.", "smirk"),
        "Vous accélérez ensemble sans synchroniser artificiellement vos orgasmes. Valurn cède d’abord sous la pénétration et le frottement de vos deux sexes, mais garde sa paume active autour de vous jusqu’à votre propre conclusion ; Iriana reçoit ensuite vos deux attentions dans une position qu’elle choisit, refusant que son rôle de meneuse la prive de devenir le centre.",
      ),
      shared: scene(
        "Iriana s’allonge entre vous et Valurn, une jambe autour de chaque homme. Elle guide le membre qu’elle souhaite accueillir dans son intimité humide, tandis que l’autre maintient sa perle de plaisir et prend le sexe de son rival dans une main libre ; au changement, Iriana reste celle qui décide de l’entrée et vous vous embrassez au-dessus d’elle plutôt que de transformer l’alternance en compétition.",
        P("Le changement n’est pas une manche. Iriana choisit si elle veut un autre corps, et celui qui se retire continue à toucher les deux autres."),
        C("Iriana", "Exactement. Mon désir n’est ni un scrutin ni une récompense. Valurn, votre main reste là ; vous, rapprochez-vous maintenant."),
        "Iriana jouit pendant la seconde pénétration, mais retient vos deux mains contre elle jusqu’à ce que ses contractions ralentissent. Vous et Valurn poursuivez ensuite côte à côte, bouche et doigts distribués selon vos demandes, tandis qu’elle veille à ce que chacun atteigne son orgasme dans une posture différente et également choisie.",
      ),
    },
    intersexe: {
      first: scene(
        "Iriana vous demande de formuler la manière exacte dont elle doit mener : bouche sur le point de feu, doigts dans l’intimité choisie, frottement ou pénétration adaptée. Valurn se place derrière elle et attend sa propre invitation avant de la toucher ; lorsqu’il commence, Iriana conserve votre rythme malgré les réactions qui traversent son corps et vous laisse corriger toute hypothèse au milieu de la scène.",
        C("Iriana", "Votre corps n’est pas un article de protocole. Vous rédigez chaque demande au présent ; je ne conserverai que celle que vous confirmez encore."),
        C("Valurn", "Et je découvre avec émotion qu’une règle peut devenir séduisante lorsqu’elle interdit précisément de deviner."),
        "Vous changez de contact et Iriana s’adapte sans défendre le premier choix. Valurn lui donne du plaisir tandis qu’elle vous conduit vers le vôtre, puis vous choisissez une position où vos mains rejoignent les siennes sur lui ; les trois orgasmes empruntent des voies différentes, mais chacun garde le pouvoir d’interrompre ou de redessiner la suivante.",
      ),
      second: scene(
        "Valurn s’installe devant vous et vous demande quel rôle son corps doit prendre sans se fier au vôtre. Vous choisissez un échange de bouche et de mains avant une éventuelle pénétration donnée ou reçue ; Iriana vient à son côté, touche simultanément son membre viril et le point de feu que vous lui désignez, faisant de sa précision un lien entre vous plutôt qu’une autorité centrale.",
        C("Valurn", "Je renonce à deviner. Dites-moi ce que vous voulez me donner, puis ce que vous voulez que je demande en retour."),
        C("Iriana", "Et laissez chaque réponse pouvoir différer. L’égalité de cette soirée ne réclame aucune symétrie anatomique."),
        "Vous composez une position entièrement propre à vos deux corps, Iriana maintenant le contact qui empêche l’un de disparaître pendant que l’autre reçoit. Valurn jouit sous un geste qu’il a nommé sans feinte ; il reprend ensuite une caresse différente sur vous, guidé par votre voix, tandis qu’Iriana reçoit votre main libre et atteint une conclusion qui n’imite aucune des deux premières.",
      ),
      shared: scene(
        "Vous déposez trois cartes vierges sur le drap et y inscrivez chacun un désir corporel, sans nom de rôle. Iriana choisit une position où elle peut recevoir selon sa propre anatomie, Valurn une autre où il peut donner ou accueillir, et vous une troisième qui définit bouche, frottement ou pénétration sans supposition. Les cartes tournent, mais leur contenu ne doit jamais être reproduit à l’identique.",
        P("Nous partageons l’initiative, pas une obligation de copier le geste précédent. Chaque corps obtient sa propre scène au centre des deux autres."),
        C("Valurn", "Trois règles différentes et aucune faille à exploiter. Je suis presque offensé… et tout à fait convaincu."),
        "Les configurations se succèdent comme trois aveux. Iriana perd son contrôle selon le désir qu’elle a écrit, Valurn son masque selon le sien, puis ils adaptent ensemble leurs mains, leurs bouches et leurs bassins à votre carte ; aucun orgasme ne survient dans la même pose, et personne ne doit payer son plaisir en reproduisant celui de l’autre.",
      ),
    },
  },

  "group-date-hylee-naiah": {
    femme: {
      first: scene(
        "Hylee vous allonge sous un fil de givre réel et pose sa bouche contre votre intimité humide. Naïah s’installe derrière elle, fait disparaître tous ses doubles puis glisse deux doigts dans l’intimité d’Hylee ; la cryomancienne garde sa langue sur votre perle de plaisir tandis que la brume colore les mouvements que Naïah lui donne, sans ajouter la moindre sensation inventée.",
        C("Hylee", "Le fil tient. Je te sens vraiment, et je sens Naïah… Garde ta main sur moi quand j’accélère sur elle.", "determined"),
        C("Naïah", "Un seul corps chacune. Trois réactions impossibles à truquer. C’est beaucoup plus vertigineux que mes meilleurs reflets."),
        "Vous guidez Hylee jusqu’à votre orgasme, puis utilisez vos doigts sur elle pendant que Naïah maintient la profondeur choisie. Le givre éclate lorsque Hylee jouit entre vous ; elle se retourne ensuite pour prendre la perle de plaisir de Naïah sous sa langue, vous laissant soutenir ses hanches afin que la troisième conclusion reste aussi réelle que les deux premières.",
      ),
      second: scene(
        "Naïah vous invite à vous asseoir contre un arbre marqué comme réel et s’agenouille entre vos cuisses. Sa langue suit votre point de feu, ses doigts glissent en vous, tandis qu’Hylee se place derrière elle et presse sa propre intimité fraîche contre la cuisse de Naïah ; un unique reflet au-dessus montre les trois corps sans en modifier les angles ni les réactions.",
        C("Naïah", "Regarde l’image seulement si tu veux vérifier la position. Pour savoir si ça te plaît, parle-moi — le reflet n’a pas ton souffle."),
        C("Hylee", "Et lui n’a pas ma main. Naïah, garde sa cadence pendant que je trouve la tienne.", "soft"),
        "La brume devient blanche lorsque vos plaisirs se rapprochent, mais aucun effet ne les provoque. Naïah vous fait jouir sous sa bouche pendant qu’Hylee la conduit au bord contre sa cuisse ; vous échangez ensuite les places avec la cryomancienne, Naïah gardant une main sur chacune afin que le reflet ne raconte jamais une scène où l’une aurait disparu.",
      ),
      shared: scene(
        "Vous nouez vos trois poignets avec le ruban réel puis formez un ciseau à trois temps : vos lèvres de velours contre celles d’Hylee, Hylee contre Naïah, puis Naïah contre vous. La personne hors du frottement utilise bouche et doigts sur les deux autres, et le reflet change d’angle à chaque rotation sans embellir les corps ni fabriquer leurs sensations.",
        P("Le ruban reste assez lâche pour que chacune puisse sortir. La rotation s’arrête dès qu’une personne veut garder sa position plus longtemps."),
        C("Naïah", "Je vote pour rester quand Hylee fait cette neige-là… mais c’est son oui, pas mon vote, qui décide."),
        "Hylee confirme et la pression augmente. Les orgasmes arrivent dans trois rotations distinctes : givre contre votre bassin, brume réelle sous la bouche d’Hylee, puis vos doigts entre les deux femmes enlacées ; le ruban ne casse jamais, parce qu’il suit les mouvements au lieu de les emprisonner.",
      ),
    },
    homme: {
      first: scene(
        "Hylee s’agenouille devant vous et prend votre membre viril dans sa bouche, le froid de ses doigts rendant chaque caresse plus nette. Naïah vient derrière elle, glisse une main dans son intimité humide et garde l’autre sur votre hanche ; la brume souligne le trajet réel de la langue d’Hylee tandis que chaque poussée annoncée presse la cryomancienne contre les doigts de Naïah.",
        C("Hylee", "Aucun double. Si je perds le rythme, c’est parce qu’elle me trouble vraiment… pas parce qu’une illusion le fait à ma place.", "teasing"),
        C("Naïah", "Je confirme. Et j’ai l’intention de rendre cette preuve de plus en plus difficile à prononcer."),
        "Hylee accueille vos mouvements sans quitter le fil de givre, Naïah maintient son point de feu et votre orgasme les traverse comme un signal partagé. La cryomancienne jouit peu après contre sa main ; vous l’aidez ensuite à allonger Naïah dans la neige qui ne fond pas, vos doigts et sa bouche donnant à l’illusionniste un plaisir dont aucune brume ne peut revendiquer l’origine.",
      ),
      second: scene(
        "Naïah vous fait asseoir dans la mousse et prend votre sexe dressé entre ses lèvres, sans double ni bouche inventée. Hylee s’installe face à elle, ouvre ses cuisses et guide la main libre de Naïah vers sa perle de plaisir ; vous caressez l’intimité d’Hylee au-dessus du visage de Naïah, créant un cercle où la bouche qui vous stimule reçoit elle-même les réactions réelles de la cryomancienne.",
        C("Naïah", "Je pourrais donner l’impression d’avoir quatre mains. Mais sentir les vôtres hésiter, choisir puis recommencer… c’est infiniment mieux."),
        C("Hylee", "Alors garde seulement celle-ci sur moi. L’autre sait déjà parfaitement quoi faire.", "determined"),
        "Naïah approfondit sa bouche à votre demande tandis que vos doigts et ceux d’Hylee la touchent à leur tour. Votre orgasme arrive le premier, celui d’Hylee sous la main de Naïah, puis l’illusionniste jouit entre vos deux bouches rapprochées ; la brume reste transparente, incapable de cacher qui a donné chaque sensation.",
      ),
      shared: scene(
        "Hylee vous accueille en elle à quatre pattes tandis que Naïah l’embrasse face à face et maintient des doigts sur sa perle de plaisir. Une de vos mains stimule Naïah entre ses cuisses ; après l’orgasme d’Hylee, la brume tourne comme un rideau de théâtre mais révèle simplement un changement réel : Naïah vient vous chevaucher, Hylee gardant son givre et sa bouche sur elle.",
        P("Une seule transition magique : le décor tourne, pas nos corps. Nous annonçons nous-mêmes chaque entrée, chaque retrait et chaque reprise."),
        C("Naïah", "Je peux accepter une règle aussi peu spectaculaire… surtout si Hylee garde exactement sa langue là où elle est."),
        "Les deux pénétrations possèdent des rythmes différents, celui d’Hylee curieux et progressif, celui de Naïah joueur puis soudain sincère. Vous jouissez pendant la seconde chevauchée ; Hylee et vous maintenez le plaisir de Naïah jusqu’au bout, puis celle-ci utilise sa bouche réelle pour accompagner le dernier frisson de la cryomancienne.",
      ),
    },
    intersexe: {
      first: scene(
        "Hylee dessine sur votre peau trois traces de givre correspondant aux contacts que vous acceptez. Elle suit la première avec sa bouche, la deuxième avec ses doigts et attend votre demande avant de transformer la troisième en frottement ou pénétration ; Naïah touche Hylee et garde un reflet parfaitement fidèle pour que vous puissiez vérifier chaque main sans qu’aucun double intervienne.",
        C("Hylee", "Si une trace ne convient plus, tu la fais fondre. Je n’essaierai pas de sauver le dessin au détriment de ton plaisir.", "soft"),
        C("Naïah", "Et moi je garde l’image honnête, même quand vos deux visages deviennent beaucoup plus intéressants que mon décor."),
        "Vous effacez une trace et en déplacez une autre. Hylee adapte ses gestes, Naïah maintient sur elle une pression qui ne perturbe jamais votre nouvelle demande et votre orgasme survient dans une configuration entièrement redessinée ; vous faites ensuite pivoter le reflet vers Naïah, afin que l’illusionniste reçoive deux attentions aussi réelles que celle qu’elle vient d’observer.",
      ),
      second: scene(
        "Naïah vous présente trois reflets correspondant non à des corps, mais à des postures : assis pour le frottement, allongé pour la bouche, latéral pour une pénétration éventuelle. Vous choisissez la position et définissez vous-même le contact ; Hylee s’unit au dos de Naïah, stimulant son intimité tout en gardant sa main froide sur votre point de feu.",
        C("Naïah", "L’image propose une géométrie, jamais une anatomie. Le geste réel viendra seulement de ce que tu nous dis maintenant."),
        C("Hylee", "Et si la géométrie devient inconfortable, on casse le reflet avant que tu aies besoin de te justifier.", "determined"),
        "La posture choisie évolue sans magie lorsque votre désir change. Naïah vous donne du plaisir avec le contact précis que vous avez nommé, Hylee la conduit à l’orgasme et garde simultanément une caresse sur vous ; après votre propre conclusion, vous fermez le triangle autour d’Hylee pour lui rendre une scène construite selon ses mots plutôt que selon le reflet précédent.",
      ),
      shared: scene(
        "Le ruban réel relie vos poignets pendant que trois configurations apparaissent dans la brume : frottement partagé, pénétration donnée ou reçue, échange de bouches. Chacun choisit une image différente et la transforme selon son corps ; Hylee refroidit seulement les points de contact demandés, Naïah éclaire seulement les gestes confirmés, et vous imposez qu’aucune posture ne serve de modèle à la suivante.",
        P("Trois images, trois désirs distincts. Nous ne rejouons pas le plaisir de la personne précédente : nous construisons celui qui correspond à la suivante."),
        C("Hylee", "Alors ma neige n’indique pas un chemin unique. Elle garde seulement la trace de ce que chacune a choisi."),
        "Naïah jouit dans une position sans double, Hylee dans un contact où le givre reste extérieur, puis elles réunissent leurs mains et leurs bouches autour de votre choix particulier. Les trois orgasmes laissent des traces différentes dans la brume, et le ruban prouve que la continuité venait du lien plutôt que de gestes répétés.",
      ),
    },
  },

  "group-date-remerii-iriana": {
    femme: {
      first: scene(
        "Remerii vous allonge en travers du banc de piano et s’agenouille entre vos jambes. Sa langue maintient une mesure régulière sur votre perle de plaisir tandis que ses doigts glissent en vous ; Iriana vient derrière elle, ouvre sa tenue et caresse l’intimité de la mage en contrepoint, ajoutant une pression inattendue chaque fois que Remerii menace de transformer votre souffle en cadence prévisible.",
        C("Remerii", "Iriana, je vous demande de garder ce geste… et vous, de me dire si ma bouche doit suivre ou résister à sa mesure.", "calm"),
        C("Iriana", "Je ne suis pas votre métronome. Je peux cependant devenir la raison pour laquelle vous cesserez enfin de compter.", "smirk"),
        "Vous choisissez de conserver deux rythmes distincts. Remerii vous fait jouir sans rompre sa précision, mais perd la sienne lorsque les doigts d’Iriana la conduisent à l’orgasme ; vous les attirez ensuite toutes deux sur le banc, la mage suivant votre intimité tandis que vous prenez celle d’Iriana sous votre bouche, créant une seconde mesure où la première voix a réellement changé.",
      ),
      second: scene(
        "Iriana s’assied face à vous sur le banc, glisse sa cuisse entre les vôtres et maintient deux doigts dans votre intimité pendant que votre point de feu frotte sa peau. Remerii s’agenouille derrière l’Impératrice, suit ses lèvres de velours avec une précision qu’elle refuse pourtant de commenter ; chaque réaction d’Iriana modifie involontairement le rythme qu’elle vous donne.",
        C("Iriana", "Je veux rester attentive à vous même lorsque sa bouche me trouble. Si ma main ralentit, dites-le-moi — ne demandez pas à Remerii de parler à ma place."),
        C("Remerii", "Je peux écouter sans corriger. Et continuer sans transformer votre plaisir en une démonstration."),
        "Vous guidez directement la main d’Iriana et sentez sa posture céder sous Remerii. Vos orgasmes se répondent sans simultanéité parfaite : le vôtre sur sa cuisse, le sien sous la bouche de la mage ; Iriana se retourne ensuite et attire Remerii entre vous, utilisant ses propres doigts pour offrir à la femme précise un plaisir que ni votre voix ni la sienne ne dirige seule.",
      ),
      shared: scene(
        "Vous vous installez toutes trois autour du banc, une cuisse glissée entre celles de la femme suivante. Les points de feu frottent contre des jambes différentes tandis que chaque main pénètre ou caresse l’intimité située à sa droite ; au quatrième mouvement, vous changez de sens, Remerii perdant sa structure et Iriana abandonnant toute préséance dans une rotation qui ne garde jamais la même femme au centre.",
        P("Pas de voix principale. Celle qui jouit ne quitte pas la partition : sa bouche ou sa main reste sur la suivante jusqu’à la dernière note."),
        C("Iriana", "Une mesure où céder ne vous retire pas le droit d’agir. Voilà une liberté que je souhaite conserver."),
        "Remerii jouit la première et continue pourtant ses doigts sur vous ; votre orgasme vous traverse sous la main d’Iriana, mais votre bouche reste contre elle. L’Impératrice cède enfin dans un cri sans protocole, soutenue par deux femmes déjà essoufflées qui maintiennent exactement les gestes qu’elle a demandés plutôt que de chercher un accord final spectaculaire.",
      ),
    },
    homme: {
      first: scene(
        "Remerii s’agenouille devant vous, prend votre sexe dressé dans sa bouche et accompagne sa base d’une main régulière. Iriana vient derrière elle, ouvre ses cuisses et glisse deux doigts dans son intimité humide ; lorsque la mage vous accueille plus profondément, l’Impératrice maintient sa perle de plaisir, transformant chaque mouvement méthodique en une note que Remerii peine à garder parfaitement droite.",
        C("Remerii", "Je peux conserver son rythme et le vôtre… à condition que vous formuliez les changements séparément."),
        C("Iriana", "Ou vous pouvez accepter qu’une respiration brisée reste une réponse complète. Votre bouche, elle, vient de le comprendre."),
        "Vous annoncez une poussée mesurée, Iriana une pression plus ferme. Remerii accomplit les deux jusqu’à ce que votre orgasme la fasse gémir contre votre membre ; elle jouit ensuite sous la main d’Iriana, puis vous attire tous deux près du piano afin que vos mains et sa bouche donnent à l’Impératrice une conclusion improvisée qu’aucune partition n’avait préparée.",
      ),
      second: scene(
        "Iriana vient vous chevaucher sur le banc et guide votre membre viril dans son écrin de chair. Remerii s’installe derrière elle, caresse sa perle de plaisir et garde une main autour de votre base à chaque remontée ; l’Impératrice choisit la profondeur, vous la cadence, tandis que la mage maintient un contrepoint qui n’appartient entièrement à aucun de vous.",
        C("Iriana", "Je mène cette position parce que je la désire, pas parce que mon rang l’exige. Remerii, ne corrigez surtout pas le mouvement lorsque je l’accélère."),
        C("Remerii", "Je n’y vois rien à corriger. Seulement deux partenaires qui viennent de rendre toute notation impossible.", "smirk"),
        "Iriana accélère jusqu’à jouir autour de vous, ses mains mêlées à celles de Remerii. Elle descend ensuite du banc sans quitter le cercle et vous aide à placer la mage face à vous ; Remerii reçoit une pénétration ou une attention adaptée à son désir pendant qu’Iriana garde sa bouche sur elle et ses doigts sur vous, prolongeant votre propre orgasme au sein d’une nouvelle mesure.",
      ),
      shared: scene(
        "Remerii s’allonge sur le banc tandis qu’Iriana s’assied au-dessus de son visage. Vous entrez lentement dans l’intimité humide de la mage, une main maintenant la perle de plaisir d’Iriana pendant que la bouche de Remerii s’en occupe aussi ; après l’orgasme de la mage, elles inversent leurs places et Iriana vous accueille, Remerii gardant ses doigts entre vos deux bassins.",
        P("Les deux pénétrations n’ont ni la même cadence ni la même fonction. Chacune choisit ce qu’elle reçoit ; celle qui vient de jouir continue à donner."),
        C("Remerii", "Une alternance sans équivalence forcée. Iriana, votre rythme restera le vôtre — pas une reprise du mien."),
        "Remerii avait réclamé une profondeur lente ; Iriana choisit des mouvements plus courts et un frottement extérieur plus ferme. Vous jouissez pendant la seconde configuration, mais les deux femmes maintiennent leur propre plaisir par bouche et mains ; la partition se termine sur trois conclusions distinctes, aucune réduite à l’accompagnement d’une autre.",
      ),
    },
    intersexe: {
      first: scene(
        "Remerii vous présente trois notes correspondant à la bouche, au frottement et à la pénétration éventuelle. Vous composez vous-même leur ordre selon votre corps ; Iriana s’installe derrière la mage et lui donne du plaisir sans perturber votre première demande, puis modifie sa caresse lorsque vous annoncez une nouvelle mesure plutôt que de supposer que votre anatomie impose la suivante.",
        C("Remerii", "Votre partition peut changer à chaque reprise. Je lirai seulement la note que vous me désignez maintenant."),
        C("Iriana", "Et je veillerai à ce que sa précision reste une écoute, jamais une raison de défendre une interprétation devenue fausse."),
        "Vous changez deux fois la structure. Remerii adapte bouche, doigts et bassin tandis qu’Iriana maintient sur elle une attention qui rend son propre plaisir visible ; votre orgasme naît de la troisième version, puis vous retournez la partition afin que la mage formule une scène entièrement différente pour elle-même, reçue par deux partenaires et non reproduite à partir de votre corps.",
      ),
      second: scene(
        "Iriana retire les mentions de rôle d’une partition et vous demande d’écrire seulement ce que vous voulez recevoir. Elle place ses mains, sa bouche ou son bassin selon vos mots ; Remerii la touche simultanément et compte uniquement les demandes clairement renouvelées, pas les mouvements de votre corps qu’elle pourrait être tentée d’interpréter comme une continuité automatique.",
        C("Iriana", "Je peux conduire un geste et céder sous un autre. Aucun de ces états ne décidera de celui qui suit."),
        C("Remerii", "La mesure appartient à la voix qui la formule. Je resterai partenaire, même lorsque mon attention se trouble."),
        "Votre position évolue selon votre désir singulier et Iriana conserve le contact malgré l’orgasme que Remerii lui donne. Elle reprend ensuite votre rythme jusqu’au bout ; vous vous placez enfin toutes trois face à face pour que la mage reçoive bouche, doigts ou pénétration selon sa propre demande, concluant un contrepoint où aucune anatomie n’a servi de règle universelle.",
      ),
      shared: scene(
        "Trois feuilles blanches reçoivent trois configurations différentes. Remerii choisit une géométrie précise mais un geste libre, Iriana une posture sans préséance, vous une rencontre adaptée à votre intimité. Chaque personne occupe tour à tour le centre tandis que les deux autres ajustent bouche, mains, frottement ou pénétration à sa demande, sans jamais reprendre la scène précédente.",
        P("Le contrepoint ne vaut que si chaque voix reste reconnaissable. Trois corps, trois plaisirs, aucune copie paresseuse sous prétexte d’égalité."),
        C("Iriana", "Alors nous conserverons la même attention, jamais la même forme par obligation."),
        "La première conclusion naît d’une cadence précise, la deuxième d’une improvisation audacieuse, la troisième d’une posture que vous redéfinissez en cours de route. Remerii et Iriana continuent chacune à toucher les deux autres après avoir joui ; le silence final n’uniformise rien, il laisse simplement coexister les trois expériences entières.",
      ),
    },
  },

  "group-date-naiah-bellirith": {
    femme: {
      first: scene(
        "Naïah vous allonge au centre des ruines redevenues réelles et pose sa bouche sur votre intimité humide. Bellirith s’installe derrière elle, caresse son point de feu et garde l’autre main sur votre cuisse ; la brume ne fait qu’éclairer la langue de Naïah, tandis que Bellirith retire chaque pose séduisante de l’illusionniste en maintenant des doigts dans son intimité.",
        C("Naïah", "Un seul vrai geste sur toi, un seul vrai geste sur moi… Bellirith, ne change pas seulement parce que la lumière devient jolie."),
        C("Bellirith", "Je regarde ton corps, pas ton décor. Et il vient de réclamer exactement le contraire d’une pause."),
        "Naïah vous fait jouir sous sa bouche pendant que Bellirith la conduit à une réaction impossible à embellir. Vous relevez ensuite l’illusionniste et vous placez entre les jambes de Bellirith ; Naïah conserve une main sur votre intimité et l’autre sur celle de sa rivale, transformant la vérité de votre plaisir en une chaîne plutôt qu’en une démonstration.",
      ),
      second: scene(
        "Bellirith vous fait asseoir devant un miroir sans charme et s’agenouille entre vos cuisses. Sa langue trouve votre perle de plaisir, ses doigts glissent en vous, tandis que Naïah vient derrière elle et remplace chaque lumière flatteuse par une brume transparente ; ses mains suivent l’intimité de Bellirith jusqu’à lui faire perdre le sourire qu’elle utilisait encore comme dernier masque.",
        C("Bellirith", "Je peux continuer sur vous même lorsqu’elle me trouble. Mais dites-moi si mon rythme devient une performance plutôt qu’une attention."),
        C("Naïah", "Je te le dirai aussi si ton visage recommence à mentir. Pour l’instant… il est délicieusement honnête."),
        "Votre voix maintient Bellirith sur le geste exact et vous jouissez pendant qu’elle cède sous Naïah. La séductrice n’a plus de sourire lorsqu’elle se tourne vers sa rivale ; vous glissez vos doigts entre leurs deux corps et elles atteignent chacune l’orgasme dans une position visible, sans miroir amélioré ni sensation inventée.",
      ),
      shared: scene(
        "Vous entrelacez vos jambes à celles de Naïah dans un ciseau tandis que Bellirith se place au-dessus de vos bassins, ses doigts alternant entre vos deux points de feu. Après l’orgasme de Naïah, Bellirith prend sa place dans le frottement et l’illusionniste utilise sa bouche sur vous deux ; la troisième rotation vous place hors du ciseau mais vos mains restent sur les deux femmes.",
        P("Chaque masque retiré change la personne au centre. Celle qui vient de jouir ne quitte pas la scène : elle devient celle qui révèle le plaisir suivant."),
        C("Bellirith", "Une rivalité où montrer son vrai visage offre davantage de pouvoir que le cacher. Naïah, je crains que tu aies enfin inventé un jeu intéressant."),
        "Naïah rit, puis perd toute plaisanterie sous vos doigts. Bellirith jouit contre votre bassin, vous sous la bouche de l’illusionniste et Naïah entre vos deux mains réunies ; les trois masques tombent à des instants distincts, protégés par celles qui restent actives plutôt qu’exposés à un public.",
      ),
    },
    homme: {
      first: scene(
        "Naïah s’agenouille devant vous et prend votre sexe dressé dans sa bouche, sans double ni sensation magique. Bellirith vient derrière elle, glisse ses doigts dans son intimité humide et garde une main sur votre hanche ; la brume révèle les mouvements réels de Naïah tandis que chaque réaction que Bellirith lui arrache vibre directement autour de votre membre.",
        C("Naïah", "Si je ralentis, demande-moi si c’est ton plaisir ou le mien qui l’exige. Elle adore brouiller les preuves."),
        C("Bellirith", "Je ne brouille rien. Je retire seulement le masque qui lui faisait croire qu’elle pouvait tout faire sans trembler."),
        "Vous formulez la demande et Naïah reprend plus profondément. Votre orgasme survient tandis que Bellirith maintient son point de feu ; l’illusionniste jouit contre sa main, puis vous vous placez tous deux autour de Bellirith, votre bouche et celle de Naïah transformant sa confiance de scène en réactions qu’aucun charme ne soutient.",
      ),
      second: scene(
        "Bellirith se place à quatre pattes devant le miroir neutre et vous guide derrière elle. Votre membre viril entre lentement dans son écrin de chair, tandis que Naïah s’allonge face à elle et maintient sa perle de plaisir sous sa langue ; le reflet montre chaque pénétration réelle et chaque fois que le sourire de Bellirith disparaît sans qu’aucune magie ne puisse le redessiner.",
        C("Bellirith", "Je vous interdis de rendre cette image plus belle, Naïah. S’il me fait perdre toute grâce, je veux voir exactement ce qu’il obtient."),
        C("Naïah", "Je n’ajoute rien. Mais ton vrai visage vient de rendre le miroir beaucoup plus intéressant."),
        "Vous gardez la cadence demandée, Naïah la pression extérieure. Bellirith jouit autour de votre membre, puis vous vous retirez seulement lorsqu’elle le formule ; elle prend ensuite Naïah entre ses cuisses et vous garde par la main et la bouche, offrant à sa rivale un plaisir réel pendant que votre propre orgasme reçoit encore deux attentions.",
      ),
      shared: scene(
        "Naïah vous chevauche face à face et vous accueille en elle pendant que Bellirith s’agenouille derrière son dos, doigts sur sa perle de plaisir. Après l’orgasme de l’illusionniste, Bellirith vient prendre sa place au-dessus de vous ; Naïah reste entre vos deux torses, bouche sur la femme et main autour de votre base, rendant la seconde pénétration entièrement différente de la première.",
        P("L’une choisit la réalité de son rythme, l’autre la vérité de son visage. Personne ne transforme le changement de corps en comparaison."),
        C("Naïah", "Je garde ses réactions honnêtes."),
        C("Bellirith", "Et moi, je garde son décor incapable de mentir. Pour une fois, nos talents servent la même chose."),
        "Naïah avait choisi des mouvements rapides et joueurs ; Bellirith ralentit pour soutenir votre regard jusqu’à ce que sa pose se dissolve. Vous jouissez sous la seconde chevauchée, mais les deux femmes poursuivent leurs mains et leurs bouches l’une sur l’autre, chacune atteignant un plaisir qui porte la signature de sa propre vulnérabilité.",
      ),
    },
    intersexe: {
      first: scene(
        "Naïah fait apparaître des symboles de posture sans leur associer aucune anatomie. Vous choisissez celui qui permet à sa bouche, ses doigts ou son bassin de rencontrer votre point de feu selon vos mots ; Bellirith touche simultanément Naïah sans charme et garde une main sur vous, vérifiant que l’illusionniste ne remplace jamais votre demande par une version plus spectaculaire.",
        C("Naïah", "Je dessine seulement l’espace. C’est toi qui décides ce que nos corps y font vraiment."),
        C("Bellirith", "Et moi je m’assure qu’elle ne confonde pas beauté et vérité. Pour l’instant, votre plaisir lui donne une leçon remarquable."),
        "Vous modifiez le contact et Naïah dissipe aussitôt l’ancien symbole. Bellirith adapte sa pression sur elle, votre orgasme arrive dans une configuration redessinée, puis vous prenez toutes deux la séductrice entre vos mains ; elle choisit un geste sans miroir ni modèle, et sa conclusion ne ressemble ni à la vôtre ni à celle de Naïah.",
      ),
      second: scene(
        "Bellirith vous invite à composer la position devant un miroir dépourvu de charme. Vous guidez sa bouche, sa main ou son bassin selon votre intimité et nommez l’éventuelle pénétration ou le frottement désiré ; Naïah reste derrière elle, touche son corps réel et maintient la brume assez claire pour que chaque changement demeure attribuable à la personne qui l’accomplit.",
        C("Bellirith", "Je ne vous offrirai pas le geste que votre apparence semble appeler. Je veux celui que votre voix me confie, même s’il ruine toute mon élégante préparation."),
        C("Naïah", "Elle vient de préférer une vérité à sa mise en scène. Profite : c’est plus rare qu’une éclipse violette."),
        "Bellirith suit votre demande jusqu’à votre orgasme, son propre masque tombant sous les mains de Naïah. Vous échangez ensuite les hauteurs, mais pas les gestes : la séductrice formule un désir entièrement différent, reçu par vous deux, puis Naïah choisit une troisième configuration sans double qui donne à chacune une conclusion physique unique.",
      ),
      shared: scene(
        "Vous placez trois fragments de masque au sol et associez chacun à une configuration choisie par la personne concernée. Naïah demande un contact sans illusion, Bellirith une posture sans angle flatteur, vous bouche, frottement ou pénétration selon votre corps réel. Les deux partenaires hors du fragment central doivent rester engagées avec la personne au centre et entre elles.",
        P("Nous ne cherchons pas trois versions d’une même scène. Nous cherchons trois vérités physiques que les deux autres peuvent accompagner sans les réécrire."),
        C("Bellirith", "Alors mon désir n’aura pas à ressembler au vôtre pour mériter la même attention. Voilà une règle dangereusement séduisante."),
        "Chaque fragment produit une posture, une réaction et un orgasme distincts. La brume de Naïah ne cache rien, le talent de Bellirith n’embellit rien, et votre propre choix n’est jamais traduit par leur anatomie ; lorsque le dernier masque se brise, trois corps différents restent reliés par des mains qui ont appris à ne pas répéter paresseusement le geste précédent.",
      ),
    },
  },
};

export function groupExplicitScene(pairId: string, sex: PlayerSex, role: AdvancedGroupRole): AdvancedGroupRawLine[] {
  const selected = GROUP_EXPLICIT_SCENES[pairId]?.[sex]?.[role];
  if (!selected) throw new Error(`Scène explicite à trois manquante : ${pairId}/${sex}/${role}`);
  return selected;
}
