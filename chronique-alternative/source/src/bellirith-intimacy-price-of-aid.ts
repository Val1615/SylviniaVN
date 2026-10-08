import { A, B, M, P, W, X, XB, SLEPT, type AuthoredRoute } from "./bellirith-intimacy-kit";

/*
 * Diversion II — « Le salon des miroirs » (Al’Gratal, la veille du départ
 * pour Akuhn’Nabad). Première diversion possible : Bellirith dirige tout,
 * découvre les réactions de {player} et décide seule de la fin.
 */
export const PRICE_OF_AID_ROUTE: AuthoredRoute = {
  id: "bellirith-mirrors",
  context: "bellirith-diversion-price-of-aid",
  text: "Le salon des miroirs",
  detail: "Elle a tourné tous les miroirs vers un seul divan. Vous n’aurez plus rien à décider : c’était le prix de votre « oui ».",
  visual: { revealChapter: 3, postOrgasmChapter: 11 },
  chapters: [
    A(
      "Elle ne vous emmène pas dans ses appartements. Elle vous fait passer par l’escalier des domestiques, par un couloir qui sent l’amidon et la cire, puis pousse une porte que vous auriez prise pour celle d’un placard. Derrière, un petit salon d’apparat que plus personne n’utilise, tendu de soie lie-de-vin.",
      "Il y a des miroirs partout. Une douzaine au moins, de toutes les tailles, en pied, ovales, ébréchés, dorés. Et tous, sans exception, ont été tournés vers le même divan bas, au centre de la pièce.",
      B("J’ai réquisitionné cette pièce il y a trois jours. Un intendant voulait y entreposer des chaises. Je lui ai expliqué qu’il préférait ne pas le faire.", "smirk"),
      P("Trois jours. Tu savais que je viendrais ?"),
      B("Non. J’espérais. C’est beaucoup plus amusant, et beaucoup moins confortable.", "teasing"),
      "Elle referme la porte d’un coup de hanche et s’y adosse, les bras croisés, pour vous regarder découvrir la pièce comme on regarde quelqu’un déballer un cadeau.",
      B("Une règle, une seule. Tu as pris une décision ce soir : me suivre. C’était la dernière. À partir d’ici, c’est moi qui choisis.", "seductive"),
    ),
    A(
      "Elle passe derrière vous sans vous toucher. Dans les miroirs, une douzaine de Bellirith font le même pas, une douzaine de vous retiennent le même souffle. Puis les reflets cessent d’obéir.",
      "L’un d’eux montre votre nuque, de très près. Un autre la courbe de votre dos. Un troisième ne montre que vos yeux, et vos yeux, dans ce miroir-là, ne regardent qu’elle.",
      B("Je ne fais rien d’autre que montrer. Tu vois ? Ils disent tous la même chose, et aucun ne parle de lettre de mission.", "teasing"),
      P("Iriana doit être en train de la relire."),
      B("Ligne par ligne. Avec ce petit pli entre les sourcils qu’elle croit invisible.", "smirk"),
      B("Et toi, tu es ici. Je t’entends penser à elle. C’est charmant. Ça ne durera pas.", "seductive"),
      "Un parfum de miel brûlé et de jasmin monte autour de vous, d’abord à peine, comme une pièce qu’on aurait chauffée longtemps à l’avance.",
    ),
    M(
      [
        "Bellirith défait les attaches de votre veste une à une, sans hâte, en vous regardant dans le miroir plutôt qu’en face. Quand vous levez la main vers sa taille, elle la rattrape et la repose sur le cadre doré derrière vous.",
        B("Les mains là. Tu toucheras quand je l’aurai décidé.", "teasing"),
        "Ses lèvres se posent sous votre oreille, puis un peu plus bas. Chaque baiser est un pas de plus vers une destination qu’elle seule connaît.",
      ],
      [
        "Bellirith défait les attaches de votre veste une à une, sans hâte, en vous regardant dans le miroir plutôt qu’en face. Quand vous levez la main vers sa taille, elle la rattrape et la repose sur le cadre doré derrière vous.",
        B("Les mains là. Tu toucheras quand je l’aurai décidé. Pas avant. Si tu triches, je recommence depuis le premier bouton.", "teasing"),
        "La chemise suit la veste. Ses doigts glissent sur votre peau comme on lit une page en relief : le creux de la clavicule, les côtes, la ligne du ventre. Elle s’arrête à chaque endroit où votre respiration change, et elle sourit dans le miroir chaque fois.",
        B("Tu es bavard·e, pour quelqu’un qui ne dit rien.", "smirk"),
      ],
      [
        "Bellirith défait les attaches de votre veste une à une, sans hâte, en vous regardant dans le miroir plutôt qu’en face. Quand vous levez la main vers sa taille, elle la rattrape et la repose sur le cadre doré derrière vous.",
        B("Les mains là. Tu toucheras quand je l’aurai décidé. Si tu triches, je recommence depuis le premier bouton, et j’en ai cousu quelques-uns de plus pendant que tu ne regardais pas.", "teasing"),
        "La chemise suit la veste, puis la ceinture, puis le reste, et elle ne se presse pour rien. Elle s’agenouille pour vos bottes avec l’aisance de quelqu’un qui sait exactement l’effet de cette posture, et remonte le long de vos jambes avec les paumes, lentement, jusqu’aux hanches.",
        X(
          "Quand vous êtes nue devant elle et devant ses douze reflets, elle recule d’un pas pour mieux voir. Ses yeux s’attardent sur vos seins, sur le pli de votre aine, sur la manière dont vos cuisses se serrent malgré vous.",
          "Quand vous êtes nu devant elle et devant ses douze reflets, elle recule d’un pas pour mieux voir. Ses yeux descendent sans pudeur jusqu’à votre virilité déjà à demi dressée, et elle hausse un sourcil ravi.",
          "Quand vous êtes nu·e devant elle et devant ses douze reflets, elle recule d’un pas pour mieux voir. Son regard s’arrête sur votre vigueur à demi dressée, puis sur la chaleur juste en dessous, et elle a l’air d’une joueuse qui découvre qu’on lui a donné deux cartes maîtresses au lieu d’une.",
        ),
        B("Regarde-toi. Non, pas moi. Toi. Tu as l’air de quelqu’un qui a très envie de désobéir.", "seductive"),
      ],
      [
        "Bellirith défait votre veste bouton après bouton, et pose vos mains sur le cadre d’un miroir avec l’interdiction formelle de les en retirer.",
      ],
    ),
    M(
      [
        "Elle recule jusqu’au divan et ne quitte pas vos yeux. Sa robe pourpre tient par un seul ruban, et elle le tire comme on ouvre un rideau de théâtre.",
        "Dans les miroirs, la soie glisse douze fois. Vous ne savez plus où regarder ; elle rit doucement de votre embarras.",
        B("Tu vois ? C’est ça, la seule vraie magie. Le reste n’est que décor.", "smirk"),
      ],
      [
        "Elle recule jusqu’au divan et ne quitte pas vos yeux. Sa robe pourpre tient par un seul ruban, et elle le tire comme on ouvre un rideau de théâtre.",
        "La soie glisse le long de ses épaules, de ses hanches, et tombe à ses pieds sans un bruit. Dans les miroirs, la scène se répète douze fois, sous douze angles différents, et chacun est plus injuste que le précédent.",
        B("Respire, {player}. Je préfère que tu restes conscient·e pour la suite.", "teasing"),
        "Le parfum monte d’un ton. Il réveille une envie que vous aviez déjà, et elle souffle dessus comme sur une braise, jusqu’à ce qu’elle vous chauffe le visage.",
      ],
      [
        "Elle recule jusqu’au divan et ne quitte pas vos yeux. Sa robe pourpre tient par un seul ruban, et elle le tire comme on ouvre un rideau de théâtre.",
        "La soie glisse le long de ses épaules, de ses hanches, et tombe à ses pieds sans un bruit. Sa peau a des reflets de braise sous la lumière des lampes. Ses seins sont lourds et hauts, ses hanches pleines, et elle se tient nue comme d’autres se tiennent couronnées.",
        "Dans les miroirs, la scène se répète douze fois sous douze angles. Elle les a orientés pour cela : où que vous tourniez la tête, vous la trouvez.",
        B("Respire. Je préfère que tu restes conscient·e pour la suite. J’ai prévu de longues choses.", "teasing"),
        "Son aura s’ouvre comme un éventail. Elle ne crée rien en vous ; elle trouve l’envie que vous aviez déjà et souffle dessus. Votre peau devient une surface trop sensible, l’air lui-même semble vous effleurer.",
      ],
      [
        "Elle tire le ruban de sa robe. Les miroirs font le reste. La chronique détourne les yeux à votre place.",
      ],
    ),
    M(
      [
        "Elle vous fait asseoir au bord du divan et s’installe à genoux derrière vous. Ses mains parcourent vos épaules, votre nuque, votre dos, et elle commente à mi-voix chaque frisson qu’elle obtient.",
        B("Là. Ça, c’est intéressant. Je reviendrai ici.", "thoughtful"),
      ],
      [
        "Elle vous fait asseoir au bord du divan et s’installe à genoux derrière vous. Ses mains parcourent votre nuque, vos épaules, votre ventre, et elle commente à mi-voix chaque frisson qu’elle obtient, comme une cartographe qui annote une carte.",
        B("Là, ta respiration s’arrête. Ici, tu tournes la tête vers la gauche. Toujours vers la gauche. Tu le savais ?", "thoughtful"),
        P("Non."),
        B("Maintenant, si. Et moi aussi. C’est beaucoup plus grave pour toi.", "smirk"),
        "Ses doigts descendent, s’attardent là où vous voudriez qu’ils restent, puis repartent ailleurs, juste quand vous alliez le demander.",
      ],
      [
        "Elle vous fait asseoir au bord du divan et s’installe à genoux derrière vous, ses seins contre votre dos, son menton sur votre épaule. Ainsi, vous voyez tout dans le grand miroir en face : ses mains, votre corps, votre visage qui la trahit.",
        "Ses paumes parcourent votre nuque, vos épaules, votre ventre. Elle commente à mi-voix chaque frisson qu’elle obtient, comme une cartographe qui annote une carte.",
        B("Là, ta respiration s’arrête. Ici, tu tournes la tête vers la gauche. Toujours vers la gauche. Tu le savais ?", "thoughtful"),
        P("Non."),
        B("Maintenant, si. Et moi aussi. C’est beaucoup plus grave pour toi.", "smirk"),
        X(
          "Sa main descend entre vos cuisses et se pose sur votre chaleur, à plat, sans bouger. Juste le poids. Vous sentez votre propre pouls battre contre sa paume, et elle le sent aussi. Puis un doigt trouve votre perle de plaisir et l’effleure une fois, une seule, avant de repartir vers votre genou.",
          "Sa main descend le long de votre ventre et se referme autour de votre virilité, sans bouger. Juste le poids, la chaleur, la promesse. Vous vous durcissez entièrement contre sa paume, et elle le sent, et elle le dit. Puis elle desserre les doigts et repart vers votre genou.",
          "Sa main descend le long de votre ventre, se referme une seconde autour de votre vigueur, puis glisse plus bas, sur votre chaleur, comme pour vérifier les deux réponses. Elle ne bouge pas. Elle écoute votre pouls battre à deux endroits à la fois, puis repart vers votre genou avec un petit rire satisfait.",
        ),
        B("Pas encore. Tu n’as pas assez attendu pour moi.", "teasing"),
      ],
      [
        "Elle s’installe derrière vous et prend, lentement, l’inventaire de vos frissons. Elle les nomme tous. Vous ne pouvez rien lui cacher.",
      ],
    ),
    M(
      [
        "Elle se penche à votre oreille, et sa voix seule suffit à vous faire fermer les yeux.",
        B("Dis-moi ce que tu veux. Non : ne le dis pas. Je préfère le deviner, c’est plus humiliant pour toi.", "teasing"),
        "Elle le devine. Ses lèvres, ses mains, son parfum : tout arrive exactement où vous l’attendiez, une seconde trop tard pour que vous ayez l’impression d’avoir eu le choix.",
      ],
      [
        "Elle se penche à votre oreille et sa voix descend d’une octave.",
        B("Je vais te montrer ce que je fais vraiment. Pas ce qu’on raconte de moi dans les couloirs. Ce que je fais.", "seductive"),
        "Son aura se resserre autour de vous comme une étoffe chaude. Elle ne fabrique rien ; elle trouve votre envie, déjà trop grande, et la fait tourner dans la lumière, la rend plus nette, plus lourde, presque insupportable.",
        "Puis elle s’arrête. Tout s’arrête : ses mains, le parfum, la chaleur. Vous restez suspendu·e au bord de quelque chose, haletant·e, et elle vous regarde dans le miroir avec une immense satisfaction.",
        P("Tu es cruelle."),
        B("Je suis précise. J’y tiens, même si l’effet est le même.", "smirk"),
      ],
      [
        "Elle se penche à votre oreille et sa voix descend d’une octave.",
        B("Je vais te montrer ce que je fais vraiment. Pas ce qu’on raconte de moi dans les couloirs. Ce que je fais.", "seductive"),
        "Son aura se resserre autour de vous comme une étoffe chaude. Elle ne fabrique rien ; elle trouve votre envie, déjà trop grande, et la fait tourner dans la lumière. Chaque caresse arrive avec un écho, comme si votre peau se souvenait de la précédente au moment même où la suivante commence.",
        X(
          "Ses doigts reviennent entre vos cuisses, glissent dans votre chaleur devenue humide, remontent sur votre perle de plaisir et y tracent des cercles lents, parfaitement réguliers. Vos hanches se soulèvent d’elles-mêmes. Elle les accompagne d’abord, puis ralentit au moment exact où vous alliez basculer.",
          "Sa main se referme de nouveau sur votre virilité dressée et la parcourt de la racine au sommet, lentement, avec une pression qui change à chaque passage, comme si elle accordait un instrument. Vos hanches poussent d’elles-mêmes. Elle les accompagne, puis ralentit au moment exact où vous alliez basculer.",
          "Une de ses mains se referme sur votre vigueur dressée, l’autre glisse dans votre chaleur devenue humide, et elle les fait travailler sur deux rythmes différents qui ne se rejoignent jamais tout à fait. Vos hanches ne savent plus quoi suivre. Elle ralentit les deux en même temps, au moment exact où vous alliez basculer.",
        ),
        "Tout s’arrête : ses mains, le parfum, la chaleur. Vous restez suspendu·e au bord, haletant·e, les doigts crispés sur le cadre doré, et elle vous regarde dans le miroir avec une immense satisfaction.",
        P("Tu es cruelle."),
        B("Je suis précise. J’y tiens, même si l’effet est le même.", "smirk"),
      ],
      [
        "Son aura s’ouvre. Elle vous mène jusqu’au bord, puis s’arrête net, très contente d’elle.",
      ],
    ),
    M(
      [
        B("À quoi penserait Iriana, si elle te voyait ?", "teasing"),
        P("Qu’elle avait raison de se méfier de toi."),
        B("Elle a toujours raison. C’est son défaut le plus attachant.", "smirk"),
        "Elle vous embrasse enfin, longuement, et il n’est plus question d’Iriana, ni de lettres, ni de rien.",
      ],
      [
        B("À quoi penserait Iriana, si elle te voyait ?", "teasing"),
        P("Qu’elle avait raison de se méfier de toi."),
        B("Elle a toujours raison. C’est son défaut le plus attachant.", "smirk"),
        "Elle vous allonge sur le divan et descend le long de votre corps, sans se presser, avec la bouche cette fois. Il y a des miroirs jusqu’au plafond, évidemment, et vous y voyez ses cheveux se répandre sur votre ventre.",
        "Ce qu’elle fait ensuite vous arrache un son que vous ne vous connaissiez pas. Elle relève la tête juste assez pour vous sourire.",
        B("Encore un. Je les collectionne.", "seductive"),
      ],
      [
        B("À quoi penserait Iriana, si elle te voyait ?", "teasing"),
        P("Qu’elle avait raison de se méfier de toi."),
        B("Elle a toujours raison. C’est son défaut le plus attachant.", "smirk"),
        "Elle vous allonge sur le divan et descend le long de votre corps avec la bouche. Il y a des miroirs jusqu’au plafond, évidemment, et vous y voyez ses cheveux se répandre sur votre ventre, puis plus bas.",
        X(
          "Elle écarte vos cuisses de ses deux mains et pose sa bouche sur votre chaleur. Sa langue trouve votre perle de plaisir sans la chercher, l’enveloppe, la quitte, revient. Elle prend son temps comme d’autres prennent possession d’un territoire, et chaque fois que vous approchez du sommet, elle remonte embrasser l’intérieur de votre cuisse.",
          "Elle prend votre virilité dans sa bouche, lentement, centimètre par centimètre, en vous regardant faire dans le miroir. Sa langue s’enroule au sommet, ses lèvres descendent, remontent. Elle prend son temps comme d’autres prennent possession d’un territoire, et chaque fois que vous approchez du sommet, elle vous relâche pour embrasser l’intérieur de votre cuisse.",
          "Elle prend votre vigueur dans sa bouche, lentement, pendant que deux de ses doigts reviennent dans votre chaleur, en mesure. Sa langue et sa main se répondent. Elle prend son temps comme d’autres prennent possession d’un territoire, et chaque fois que vous approchez du sommet, elle vous relâche pour embrasser l’intérieur de votre cuisse.",
        ),
        "Ce qu’elle fait vous arrache un son que vous ne vous connaissiez pas. Elle relève la tête juste assez pour vous sourire.",
        B("Encore un. Je les collectionne.", "seductive"),
      ],
      [
        "Elle vous demande à quoi penserait Iriana. Vous répondez. Elle rit, puis vous allonge sur le divan, et la chronique la laisse descendre seule.",
      ],
    ),
    M(
      [
        "Vous prononcez son nom. Elle s’arrête, attentive, comme si elle avait attendu ce moment depuis trois jours.",
        B("Demande mieux.", "teasing"),
        P("S’il te plaît."),
        B("Voilà. C’était si difficile ?", "seductive"),
      ],
      [
        "Vous prononcez son nom, sans la moindre protestation dans la voix. Elle s’arrête, la tête levée, attentive, comme si elle avait attendu ce moment depuis trois jours.",
        B("Demande mieux.", "teasing"),
        P("Bellirith… s’il te plaît."),
        B("Tu ne sais même pas ce que tu demandes. C’est ça que je préfère.", "seductive"),
        "Elle reprend. Plus lentement d’abord, pour que vous compreniez qu’elle a entendu, puis exactement comme il faut.",
      ],
      [
        "Vous prononcez son nom, sans la moindre protestation dans la voix. Elle s’arrête, la tête levée, la bouche luisante, attentive, comme si elle avait attendu ce moment depuis trois jours.",
        B("Demande mieux.", "teasing"),
        P("Bellirith… s’il te plaît."),
        B("Tu ne sais même pas ce que tu demandes. C’est ça que je préfère.", "seductive"),
        "Elle reprend. Plus lentement d’abord, pour que vous compreniez qu’elle a entendu, puis exactement comme il faut, sans plus jamais ralentir. Son aura épouse votre souffle et le précède, si bien que vous ne savez plus si c’est elle qui suit votre plaisir ou votre plaisir qui la suit.",
      ],
      [
        "Vous prononcez son nom. Elle exige que vous le demandiez mieux. Vous le demandez mieux.",
      ],
    ),
    M(
      [
        "Le plaisir vous traverse comme une vague tiède, longue, qui vous laisse sans force contre les coussins. Elle remonte se coucher près de vous et regarde votre visage dans le miroir avec une attention presque studieuse.",
        B("Voilà ce que tu fais quand tu n’as plus de mots. Je voulais le savoir depuis la salle d’audience.", "thoughtful"),
      ],
      [
        "Le plaisir vous emporte d’un coup. Les miroirs tremblent, ou c’est vous ; vous ne savez plus. Elle vous tient à travers, une main sur votre ventre, comme on tient un cheval qui s’emballe, sans chercher à le retenir.",
        B("Voilà ce que tu fais quand tu n’as plus de mots. Je voulais le savoir depuis la salle d’audience.", "thoughtful"),
        "Elle remonte se coucher contre vous et regarde votre visage dans le miroir avec une attention presque studieuse, comme si elle mémorisait quelque chose pour plus tard.",
      ],
      [
        X(
          "Le plaisir vous emporte d’un coup. Votre chaleur se resserre en vagues autour de rien, vos cuisses se referment sur ses épaules, et elle ne vous lâche pas : sa langue reste sur votre perle de plaisir jusqu’au bout, jusqu’à ce que la dernière secousse vous laisse sans force.",
          "Le plaisir vous emporte d’un coup. Vous jouissez dans sa bouche, les doigts perdus dans ses cheveux, et elle ne vous lâche pas : elle vous garde jusqu’au bout, jusqu’à ce que la dernière secousse vous laisse sans force contre les coussins.",
          "Le plaisir vous emporte d’un coup, des deux côtés à la fois. Votre vigueur se libère contre sa langue tandis que votre chaleur se resserre autour de ses doigts, et elle ne vous lâche pas : elle vous garde jusqu’au bout, jusqu’à ce que la dernière secousse vous laisse sans force.",
        ),
        "Les miroirs tremblent, ou c’est vous. Elle remonte se coucher contre votre flanc, essuie sa lèvre du pouce, et regarde votre visage dans le miroir avec une attention presque studieuse.",
        B("Voilà ce que tu fais quand tu n’as plus de mots. Je voulais le savoir depuis la salle d’audience.", "thoughtful"),
      ],
      [
        "Le plaisir vous emporte. Les miroirs tremblent. Elle a l’air de quelqu’un qui vient de lire une page qu’elle cherchait depuis longtemps.",
      ],
    ),
    M(
      [
        "Vous retirez enfin vos mains du cadre. Elle hausse un sourcil, mais ne vous arrête pas. Vous l’embrassez, et pour une fois c’est vous qui la faites taire.",
        B("Une manche. Je t’accorde une manche, parce que tu l’as gagnée.", "smirk"),
        "Elle vous laisse la découvrir à votre tour, un peu, et ses soupirs ne sont plus tout à fait une mise en scène.",
      ],
      [
        "Vous retirez enfin vos mains du cadre. Elle hausse un sourcil, ouvre la bouche pour vous le reprocher, et vous l’embrassez avant qu’elle ait trouvé la phrase.",
        B("Tricheur·se.", "angry"),
        P("Tu m’as dit que je toucherais quand tu l’aurais décidé. Tu viens de le décider. Je l’ai vu dans le miroir."),
        "Elle rit malgré elle, et ce rire-là n’est pas élégant. Elle vous laisse la renverser sur le divan, vous laisse descendre le long de sa gorge, de ses seins, de son ventre. Une manche. Elle vous accorde une manche.",
        B("Profite. Ça ne se reproduira pas.", "seductive"),
      ],
      [
        "Vous retirez enfin vos mains du cadre. Elle hausse un sourcil, ouvre la bouche pour vous le reprocher, et vous l’embrassez avant qu’elle ait trouvé la phrase.",
        B("Tricheur·se.", "angry"),
        P("Tu m’as dit que je toucherais quand tu l’aurais décidé. Tu viens de le décider. Je l’ai vu dans le miroir."),
        "Elle rit malgré elle, et ce rire-là n’est pas élégant. Elle vous laisse la renverser sur le divan, vous laisse prendre un sein dans votre bouche, puis l’autre, sentir ses pointes durcir sous votre langue. Votre main descend sur son ventre et trouve sa chaleur, brûlante, déjà prête.",
        "Elle vous accorde une manche. Ses hanches viennent à la rencontre de vos doigts, sa respiration se brise pour de bon, et pendant quelques secondes elle oublie de regarder dans les miroirs.",
        B("Profite. Ça ne se reproduira pas.", "seductive"),
      ],
      [
        "Vous lâchez le cadre et l’embrassez. Elle vous accorde une manche, en précisant qu’elle ne se reproduira pas.",
      ],
    ),
    M(
      [
        "Elle reprend la main, bien sûr. Elle vous rallonge sous elle d’un geste et s’installe sur vous, front contre front, et c’est elle qui donne le rythme jusqu’à ce que le monde se réduise à sa voix.",
        B("Regarde-moi. Pas les miroirs. Moi.", "seductive"),
        "Elle atteint son propre plaisir avec un rire étouffé, comme si elle venait de gagner un pari contre elle-même.",
      ],
      [
        "Elle reprend la main, bien sûr. D’une pression sur votre épaule, elle vous rallonge sous elle et s’installe à califourchon sur vous, et c’est elle, de nouveau, qui donne le rythme.",
        B("Regarde-moi. Pas les miroirs. Moi.", "seductive"),
        "Elle bouge lentement, puis moins lentement. Son aura se répand dans toute la pièce, et vous sentez son désir à elle pour la première fois, brûlant, et qui lui échappe un peu.",
        "Elle atteint son plaisir avec un rire étouffé, la tête renversée, et les douze miroirs se voilent de rose pendant une seconde, comme une respiration.",
      ],
      [
        "Elle reprend la main, bien sûr. D’une pression sur votre épaule, elle vous rallonge sous elle et s’installe à califourchon sur vos hanches.",
        X(
          "Elle s’ajuste contre vous, sa chaleur contre la vôtre, et commence à bouger en longs mouvements glissés. Vos deux perles de plaisir se trouvent, se perdent, se retrouvent ; elle guide votre main entre vous pour que vos doigts fassent le reste.",
          "Elle prend votre virilité d’une main, la guide en elle et descend lentement, jusqu’au bout, avec un long soupir appliqué. Puis elle ne bouge plus. Elle attend que vous la suppliiez du regard, et seulement alors elle commence à onduler.",
          "Elle prend votre vigueur d’une main, la guide en elle et descend lentement, jusqu’au bout. De l’autre main, elle revient chercher votre chaleur, comme pour ne rien laisser de vous inoccupé, et commence à onduler sur deux rythmes qui finissent par n’en faire qu’un.",
        ),
        B("Regarde-moi. Pas les miroirs. Moi.", "seductive"),
        "Elle bouge lentement, puis moins lentement. Son aura se répand dans toute la pièce, et vous sentez son désir à elle pour la première fois, brûlant, et qui lui échappe un peu.",
        "Elle jouit avec un rire étouffé, la tête renversée, son corps se resserrant autour du vôtre, et les douze miroirs se voilent de rose pendant une seconde, comme une respiration. Le plaisir vous reprend avec elle, plus lent, plus profond, comme si elle l’avait décidé pour vous deux.",
      ],
      [
        "Elle reprend la main et le rythme. Les douze miroirs se voilent de rose quand elle atteint son plaisir.",
      ],
    ),
    A(
      "Elle se relève la première. Elle ne s’attarde pas contre vous, ne vous demande pas si c’était bien, ne fait aucun commentaire sur ce qu’elle a vu. Elle ramasse sa robe, la passe d’un geste, renoue le ruban.",
      B("Tu es libre. Je t’ai rendu·e presque entier·e, comme promis.", "smirk"),
      P("Presque ?"),
      B("Je garde quelques détails. L’endroit où ta respiration s’arrête. Le côté où tu tournes la tête. Le son que tu as fait quand j’ai ralenti la deuxième fois.", "teasing"),
      W(SLEPT, [
        B("Je les ai comparés à ceux de la dernière fois. Tu as changé. Pas beaucoup. Assez pour que je revienne vérifier.", "thoughtful"),
      ], [
        B("C’est la première fois que je les entends. Ce ne sera pas la dernière, si tu continues à ouvrir les mauvaises portes.", "thoughtful"),
      ]),
    ),
    A(
      "Les miroirs, un à un, reprennent des reflets ordinaires. Il ne reste plus qu’une pièce encombrée, une soie lie-de-vin froissée et une fenêtre où la nuit est déjà bien avancée.",
      B("Tu as dit mon nom comme une question, tout à l’heure. La prochaine fois, je veux que ce soit une réponse.", "seductive"),
      "Elle ouvre la porte et s’efface pour vous laisser passer, avec la politesse exagérée d’une hôtesse qui vient de vous ruiner au jeu.",
    ),
  ],
};
