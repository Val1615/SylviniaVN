import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { InvitationTemplate, KnowledgeEntry, LetterTemplate, SecretConversation } from "./heritages-data";

/*
 * Refonte Bellirith · monde vivant (confidences, courriers, invitations).
 *
 * Canon : seuls les faits sourcés sont employés (Tome II : talisman, « une
 * jolie pierre enfermée dans du métal », la demande de rester cachée, les
 * soldats de l’Empire, « Je pensais pouvoir revenir » ; Bible : Bhaal père
 * commun, rivalité ancienne et personnelle avec Valurn). La pierre de stase,
 * l’artefact de scellement et leur chronologie sont retirés (spec §32/§55).
 *
 * Confidences : débloquées par le DÉSIR (20/40/60/80, spec §28), en deux
 * couches (A offerte / B poussée par une observation précise qui exige de la
 * Lucidité ou une connaissance apprise auprès de Valurn, spec §29-30). Deux
 * paliers seulement emploient la tentative de détournement vers le sexe
 * (spec §31) : le joueur peut s’y laisser prendre (intimité, couche B fermée)
 * ou revenir à la phrase (désir en hausse, couche B ouverte).
 */

const L = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, ...(mood ? { mood } : {}) });
const N = (text: string): DialogueLine => L("Narration", text);
const P = (text: string): DialogueLine => L("{player}", text);
const B = (text: string, mood?: string): DialogueLine => L("Bellirith", text, mood);
const V = (text: string, mood?: string): DialogueLine => L("Valurn", text, mood);

type ChoiceOptions = Pick<ChoiceData, "requires" | "requiresKnowledge" | "followUp" | "launchesIntimacy">;
const C = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects, options: ChoiceOptions = {}): ChoiceData => ({
  id, text, stat, response, effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } }, ...options,
});

export const BELLIRITH_CONFIDENCE_DESIRE = { 20: 20, 40: 40, 60: 60, 80: 80 } as const;
export const BELLIRITH_PUSH_LUCIDITY = { 20: 8, 40: 10, 60: 12, 80: 14 } as const;
export const BELLIRITH_CONFIDENCE_DEFLECTION_DATE = "bellirith-free-confidence";

export const BELLIRITH_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "knows_bellirith_bhaal_family", title: "Le même père", summary: "Bellirith et Valurn partagent Bhaal pour père. Leur famille démoniaque n’a jamais rien eu de sain ni de simple.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_valurn_personal", title: "Plus qu’une rivalité", summary: "Entre Bellirith et Valurn, la rivalité publique recouvre quelque chose de bien plus personnel que ce qu’ils laissent voir.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_before_hate", title: "Avant la haine", summary: "Bellirith et Valurn ont été très proches, y compris charnellement. Elle connaît certaines de ses faiblesses depuis très longtemps.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_provocations_real", title: "Pas du théâtre", summary: "Certaines provocations de Bellirith envers Valurn ne sont pas un spectacle : elle vise des endroits qu’elle connaît pour les avoir aimés.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_saelis", title: "Saëlis", summary: "À Saëlis, Bellirith règne par le désir. Elle y prend un plaisir réel et tient le désir pour une force politique autant que personnelle.", people: ["bellirith"] },
  { id: "knows_bellirith_valurn_fear", title: "La seule humiliation qui compte", summary: "Bellirith redoute de voir Valurn regagner de l’influence. Une humiliation venue de lui la touche bien plus qu’elle ne le voudrait.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_promise", title: "Une promesse", summary: "Il y a eu, un jour, une promesse entre Valurn et Bellirith. Elle refuse d’en dire davantage.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_missing_piece", title: "Le trou dans le récit", summary: "Entre l’ancienne proximité de Valurn et Bellirith et leur haine actuelle, il manque quelque chose. Elle n’est pas prête à le raconter.", people: ["bellirith", "valurn"] },
];

/** Connaissances Valurn de remplacement : faits du Tome II uniquement. */
export const VALURN_BELLIRITH_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "knows_valurn_old_promise", title: "La protection confiée", summary: "Valurn confia autrefois à Bellirith une protection — un talisman, « une jolie pierre enfermée dans du métal » — et lui demanda de rester cachée pendant qu’il partait.", people: ["valurn", "bellirith"] },
  { id: "knows_valurn_did_not_return", title: "Je pensais pouvoir revenir", summary: "Des soldats de l’Empire sont venus. Valurn n’est pas revenu à temps. « Je pensais pouvoir revenir » : il n’en dit pas davantage.", people: ["valurn", "bellirith"] },
];

// ─── Confidences Bellirith ────────────────────────────────────────────────

const father: SecretConversation = {
  id: "secret-bellirith-father",
  character: "bellirith",
  tier: 20,
  minDesire: BELLIRITH_CONFIDENCE_DESIRE[20],
  title: "Les mauvaises manières de Bhaal",
  intro: [
    N("Bellirith vous attire dans une embrasure, assez près pour que son parfum fasse le reste du travail. Puis, au lieu de vous embrasser, elle vous tend un jeton de jeu en os noir, gravé d’une couronne grossière."),
    B("Tu résistes trop bien. C’est vexant, alors je change d’arme. Voilà un cadeau : un morceau de moi. Ne le perds pas, j’en distribue très peu.", "teasing"),
    P("Un jeton ?"),
    B("Le jeton de Bhaal. Notre père. Il les distribuait à ses enfants comme d’autres donnent des bonbons, sauf qu’il fallait les lui rendre en fin de soirée, avec intérêts.", "smirk"),
    P("Notre ?"),
    B("Valurn et moi. Même père, et quel père. Un démon qui considérait l’affection comme une dette et ses enfants comme un portefeuille. Nous avons appris très tôt à mentir élégamment : c’était ça ou payer.", "amused"),
    N("Elle fait rouler le jeton sur le dos de ses doigts avec une dextérité d’escroc. Son sourire reste parfait. Il est même un peu trop parfait."),
    B("Voilà. Tu sais maintenant que j’ai une famille, qu’elle est épouvantable, et que mon frère et moi en sommes les deux plus beaux produits. Cela devrait suffire à te rendre curieux·se. La curiosité, c’est la moitié du chemin jusqu’à mon lit.", "seductive"),
    N("Une seule chose accroche : quand elle a dit « mon frère et moi », elle a d’abord commencé à dire « nous », puis s’est reprise, comme si le mot avait été trop chaud dans sa bouche."),
  ],
  choices: [
    C("sbf20-accept", "Prendre le jeton et accepter ce qu’elle a choisi de donner.", "sangFroid", [
      N("Vous refermez la main sur le jeton. Il est tiède, de la chaleur de ses doigts."),
      P("Merci. Je le garde. Je ne te demanderai pas les intérêts."),
      B("Tu ne me demandes rien ? Même pas comment on survit à un père pareil ?", "surprised"),
      P("Tu as choisi ce que tu voulais me donner. C’est déjà beaucoup pour une démone qui distribue très peu."),
      N("Bellirith vous regarde une seconde de trop. Puis elle reprend la pose, la hanche contre la pierre, la voix plus basse."),
      B("Prudent·e. C’est presque pire que tes refus. Je vais devoir trouver autre chose pour te faire tomber.", "teasing"),
    ], { affection: 3, desire: 2 }),
    C("sbf20-push-word", "Relever le « nous » qu’elle a ravalé avant de dire « mon frère et moi ».", "lucidite", [
      P("Tu as commencé à dire « nous ». Puis tu as dit « mon frère et moi », comme on recule d’un pas."),
      N("Le jeton s’arrête net entre ses doigts."),
      B("Tu écoutes les mots que je ne dis pas. C’est une très mauvaise habitude. Qui te l’a apprise, que j’aille la tuer ?", "cold"),
      P("Tu ne réponds pas."),
      B("Nous. Oui. Il y a eu un « nous ». Deux enfants qui volaient les jetons de leur père pour les rendre chacun à la place de l’autre. Qui savaient exactement de quelle couleur devenaient les yeux de l’autre avant une punition.", "thoughtful"),
      B("Les gens croient que Valurn et moi nous détestons comme deux grands démons se disputent un trône. C’est tellement plus personnel que ça. C’est ce qui rend la chose si amusante. Et si fatigante.", "away"),
      N("Elle remet le jeton dans votre main et referme vos doigts dessus, un peu trop fort."),
      B("Voilà. Tu as eu le petit supplément. Ne t’habitue pas : la prochaine fois, je te le ferai payer en baisers.", "smirk"),
    ], { affection: 1, trust: 3, desire: 4, knowledge: ["knows_bellirith_valurn_personal"] }, { requires: { stat: "lucidite", value: BELLIRITH_PUSH_LUCIDITY[20] } }),
    C("sbf20-push-valurn", "Lui dire que Valurn parle de Bhaal exactement avec le même sourire qu’elle.", "resonance", [
      P("Valurn m’a parlé de Bhaal. Il avait ton sourire. Le même. Celui qui arrive à l’heure et ne reste pas pour la suite."),
      N("Bellirith rit, très fort, très vite. Le rire s’arrête avant d’avoir fini."),
      B("Il t’a parlé de notre père ? Avec ses cartes, je parie. Il fait toujours brûler le roi pour qu’on le trouve tragique.", "cold"),
      B("Le même sourire. Évidemment. On l’a appris devant le même miroir, à la même table, sous la même main. Il l’a gardé pour séduire. Moi, pour mordre.", "thoughtful"),
      P("Vous étiez proches."),
      B("Nous étions tout ce que l’autre avait. Ça ne se dissout pas parce qu’on se met à se détester. Ça se transforme en quelque chose de beaucoup plus personnel qu’une rivalité. Ne le lui répète pas : il en serait insupportablement flatté.", "away"),
    ], { trust: 3, desire: 4, knowledge: ["knows_bellirith_valurn_personal"] }, { requiresKnowledge: ["knows_valurn_bhaal_childhood"] }),
  ],
  reveals: ["knows_bellirith_bhaal_family"],
};

const beforeHate: SecretConversation = {
  id: "secret-bellirith-before-hate",
  character: "bellirith",
  tier: 40,
  minDesire: BELLIRITH_CONFIDENCE_DESIRE[40],
  title: "Ce que je sais de lui",
  intro: [
    N("Bellirith a volé une bouteille du cellier de Valurn. Elle le dit avant même de vous servir, avec une fierté d’enfant et une précision d’archiviste."),
    B("Il cache le bon vin derrière le mauvais depuis trois siècles. Il croit que personne ne le sait. Je le sais. Je sais aussi qu’il ne dort jamais du côté de la porte, qu’il déteste qu’on lui touche la nuque par surprise et qu’il ment mieux quand il a froid.", "smirk"),
    P("Tu le connais très bien."),
    B("Je le connais intimement. Au sens où tu l’entends, et au sens où tu ne l’entends pas encore.", "seductive"),
    N("Elle vous tend un verre, s’assied sur l’accoudoir de votre fauteuil et laisse sa cuisse contre votre épaule, comme on pose une carte sur la table."),
    B("Oui, nous avons couché ensemble. Souvent. Bien. Ne fais pas cette tête : nous sommes des démons, les Calciterres ne vendent pas de morale au détail. Il y a eu une époque où nous étions si proches qu’on ne savait plus lequel des deux mentait pour l’autre.", "amused"),
    B("Voilà ce que je t’offre ce soir : mon frère, son vin, et la certitude que je sais exactement où appuyer pour lui faire mal. C’est un trésor, chéri·e. Peu de gens l’ont eu.", "teasing"),
    N("Elle sourit. Mais en parlant de cette époque, elle a dit « il y a eu », et sa main s’est refermée sur le pied du verre comme sur une poignée de porte."),
  ],
  choices: [
    C("sbb40-accept", "Trinquer à ce qu’elle a donné, sans aller chercher plus loin.", "sangFroid", [
      P("À son vin. Et à toi, qui le voles mieux qu’il ne le cache."),
      N("Vos verres se touchent. Bellirith boit en vous regardant par-dessus le bord, avec cette attention précise qui ne la quitte plus depuis quelque temps."),
      B("Tu ne demandes pas pourquoi c’est fini ?", "surprised"),
      P("Tu me le dirais ?"),
      B("Non. Mais j’aurais aimé que tu essaies, pour avoir le plaisir de refuser.", "teasing"),
    ], { affection: 3, desire: 2 }),
    C("sbb40-push", "Lui faire remarquer qu’elle parle de lui au présent pour ses faiblesses, et au passé pour tout le reste.", "lucidite", [
      P("Ses faiblesses, tu les dis au présent. Il ne dort jamais du côté de la porte. Mais tout le reste, tu le dis au passé."),
      N("Bellirith pose son verre. Lentement. Elle ne vous a pas quitté·e des yeux."),
      B("Tu sais ce qui est terrifiant chez toi ? Ce n’est pas que tu refuses. C’est que tu écoutes.", "cold"),
      B("D’accord. Quand je le provoque devant Iriana, quand je lui vole son vin, quand je lui rappelle à voix haute la façon dont il gémissait… ce n’est pas toujours du théâtre. Parfois je vise un endroit précis, que j’ai connu tendre. Je sais qu’il saigne encore là. Je vérifie.", "away"),
      P("Pour lui faire mal ?"),
      B("Pour savoir s’il saigne encore. Ce n’est pas la même chose. Ne me demande pas laquelle des deux réponses me ferait plaisir.", "thoughtful"),
    ], { trust: 4, desire: 4, knowledge: ["knows_bellirith_provocations_real"] }, { requires: { stat: "lucidite", value: BELLIRITH_PUSH_LUCIDITY[40] } }),
    C("sbb40-near", "Revenir sur ce « il y a eu » qui lui a fait serrer le verre.", "audace", [
      P("« Il y a eu une époque. » Tu as serré ton verre en le disant."),
      N("Bellirith ne répond pas. Elle se laisse glisser de l’accoudoir jusque sur vos genoux, d’un seul mouvement souple, et pose le bout de ses doigts sur votre bouche."),
      B("Chut. Tu deviens ennuyeux·se, et tu es beaucoup trop joli·e pour ça.", "seductive"),
      N("Son aura s’ouvre comme une fenêtre sur une nuit d’été. Le miel brûlé, le jasmin, la chaleur de sa cuisse contre la vôtre. Elle embrasse le coin de votre mâchoire, puis votre cou, très lentement, et chaque baiser efface un peu plus la question."),
      B("Tu préfères parler de mon frère, ou découvrir ce que j’ai appris avec lui ?", "seductive"),
    ], { desire: 1 }, { followUp: [{
      intro: [N("Sa bouche s’arrête juste sous votre oreille. Elle attend. Elle sait exactement ce qu’elle vient de faire : changer de sujet en changeant de terrain.")],
      choices: [
        C("sbb40-yield", "Se laisser détourner : l’embrasser et laisser la question où elle est.", "audace", [
          N("Vous tournez la tête et prenez sa bouche. Bellirith sourit contre vos lèvres, victorieuse, et la question reste derrière vous comme un manteau oublié sur une chaise."),
          B("Voilà. Beaucoup mieux. On parlera de lui une autre fois. Ou jamais. Ce soir, tu es à moi.", "seductive"),
        ], { affection: 2 }, { launchesIntimacy: BELLIRITH_CONFIDENCE_DEFLECTION_DATE }),
        C("sbb40-return", "Refuser le détour, doucement, et revenir à sa phrase.", "sangFroid", [
          N("Vous posez la main sur sa nuque, sans l’attirer. Vous la gardez simplement là, à distance de baiser."),
          P("C’est très tentant. Mais je préfère entendre la fin de ta phrase."),
          N("Bellirith se fige. Personne, visiblement, ne lui a jamais préféré une phrase. Elle cherche une réplique, n’en trouve aucune, et c’est peut-être la première fois que vous la voyez démunie."),
          B("Tu es insupportable.", "cold"),
          B("Il y a eu une époque où je lui confiais tout, et il me confiait tout, et nous étions si bien emmêlés qu’on ne savait plus où finissait l’un. Quand je le provoque aujourd’hui, je vise ces endroits-là. Ce n’est pas du théâtre. C’est de la mémoire.", "away"),
          N("Elle ne descend pas de vos genoux. Elle reste là, très droite, à vous regarder comme une énigme qu’elle n’a pas commandée."),
          B("Je te désirais déjà. Maintenant, tu m’agaces. C’est beaucoup plus dangereux pour toi.", "thoughtful"),
        ], { trust: 4, desire: 5, knowledge: ["knows_bellirith_provocations_real"] }),
      ],
    }] }),
  ],
  reveals: ["knows_bellirith_before_hate"],
};

const saelis: SecretConversation = {
  id: "secret-bellirith-saelis",
  character: "bellirith",
  tier: 60,
  minDesire: BELLIRITH_CONFIDENCE_DESIRE[60],
  title: "Les néons de Saëlis",
  intro: [
    N("Bellirith ouvre la main. Au creux de sa paume, une ville minuscule s’allume : des tours de verre pourpre, des rues de néon rose, des terrasses où des silhouettes se frôlent sans jamais se presser."),
    B("Saëlis. Ma ville. Là-bas, personne ne fait semblant de ne pas avoir envie. On négocie les traités au lit, on renverse les ministres d’un regard, et quand quelqu’un désire trop fort quelque chose, on le lui donne… avec une facture.", "seductive"),
    P("Et tu règnes sur tout ça."),
    B("Je règne parce que je sais ce que chacun veut avant qu’il ose le savoir. Le désir est la seule force politique honnête, chéri·e. L’or ment, la peur s’use, la loyauté se vend. Le désir, lui, revient toujours frapper à la même porte.", "smirk"),
    B("Et j’aime ça. Ne crois pas une seconde que je joue un rôle. Être Bellirith est la chose la plus délicieuse qui me soit arrivée.", "teasing"),
    N("Elle fait tourner la ville dans sa paume. Une tour, au centre, reste éteinte. Elle la cache du pouce sans y penser — ou en y pensant beaucoup."),
    B("Valurn trouve Saëlis vulgaire. Valurn trouve vulgaire tout ce qui fonctionne sans lui.", "cold"),
  ],
  choices: [
    C("sbs60-accept", "Lui demander de vous montrer une rue de Saëlis, une seule, sa préférée.", "resonance", [
      P("Montre-moi ta rue préférée."),
      N("Bellirith hausse un sourcil, puis souffle sur sa paume. Une ruelle s’allonge, bordée de lanternes, où deux silhouettes dansent sans musique."),
      B("La rue des Paris Perdus. On y joue sa nuit aux dés. Les perdants paient en baisers, les gagnants aussi, c’est ce qui rend le jeu si populaire.", "amused"),
      P("Elle te ressemble."),
      B("Tout Saëlis me ressemble. C’est le principe d’une capitale.", "smirk"),
    ], { affection: 3, desire: 2 }),
    C("sbs60-push", "Lui demander pourquoi la tour du centre reste éteinte, et pourquoi elle l’a cachée en prononçant le nom de Valurn.", "lucidite", [
      P("La tour du milieu est éteinte. Tu l’as cachée avec ton pouce au moment exact où tu as dit son nom."),
      N("La ville s’éteint d’un coup dans sa main. Il ne reste que sa paume nue et le parfum, plus amer."),
      B("Le Conseil des Plaisirs. Il est vide depuis que la moitié de mes ministres se demandent si Valurn ne reviendrait pas, avec ses sourires et son sang de Bhaal, prendre ce que j’ai construit.", "cold"),
      B("Il m’a déjà humiliée une fois. Une seule. Je ne te dirai pas comment. Mais toutes les autres humiliations de mon existence, je les ai rendues au centuple et j’ai oublié jusqu’aux noms. La sienne, je la sens encore quand il entre dans une pièce.", "away"),
      N("Elle referme la main. Ses ongles marquent sa paume."),
      B("Voilà. Tu sais que j’ai peur de mon frère. Profite, chéri·e. Ça n’arrivera plus.", "thoughtful"),
    ], { trust: 4, desire: 5, knowledge: ["knows_bellirith_valurn_fear"] }, { requires: { stat: "lucidite", value: BELLIRITH_PUSH_LUCIDITY[60] } }),
    C("sbs60-near", "Lui dire qu’elle a dit « vulgaire » deux fois, et que c’était le mot de Valurn, pas le sien.", "audace", [
      P("Tu as dit « vulgaire » deux fois. Ce n’est pas ton mot. C’est le sien."),
      N("Bellirith éteint Saëlis d’un claquement de doigts et vous pousse en arrière, une main à plat sur votre poitrine, jusqu’à ce que votre dos rencontre le mur."),
      B("Tu sais ce qui est vulgaire ? Parler de mon frère quand je suis à un souffle de ta bouche.", "seductive"),
      N("Son aura vous enveloppe, chaude, précise, cherchant ce qui en vous a déjà envie et le trouvant sans effort. Elle glisse une jambe entre les vôtres et vous embrasse au bord des lèvres, sans les prendre, juste assez pour que tout le reste devienne flou."),
    ], { desire: 1 }, { followUp: [{
      intro: [N("Elle se recule d’un cheveu. Ses yeux brillent de néon. Elle a choisi le terrain où elle gagne toujours, et elle attend que vous la suiviez.")],
      choices: [
        C("sbs60-yield", "Se laisser détourner : la laisser gagner cette manche.", "audace", [
          N("Vous cédez. Elle le sent avant que vous bougiez, et son sourire devient celui d’une reine qui récupère sa couronne."),
          B("Sage décision. Saëlis récompense toujours les gens qui savent quand se taire.", "seductive"),
        ], { affection: 2 }, { launchesIntimacy: BELLIRITH_CONFIDENCE_DEFLECTION_DATE }),
        C("sbs60-return", "Rester contre le mur, et répéter doucement : « C’était son mot. »", "sangFroid", [
          P("C’était son mot, Bellirith."),
          N("Elle ne recule pas. Elle reste contre vous, immobile, son souffle sur votre bouche. Puis elle laisse tomber son front contre votre épaule, une seconde, comme on pose un fardeau trop lourd pour être nommé."),
          B("Il disait que Saëlis était vulgaire. Que j’étais vulgaire. Il le disait en riant, devant tout le monde, et tout le monde riait avec lui. C’est la seule humiliation que je n’ai jamais réussi à rendre.", "away"),
          B("Et maintenant il est assis à la table d’une impératrice, à reprendre de l’influence sourire après sourire. Et une partie de moi a peur. Peur, chéri·e. De mon petit frère.", "cold"),
          N("Elle se redresse, et il n’y a plus aucune trace de ce qu’elle vient de dire sur son visage. Sauf ses yeux, qui vous regardent comme on regarde quelqu’un qui a gagné une manche sans tricher."),
          B("Tu m’as refusé ma bouche pour une phrase. Je te jure que tu vas le regretter de la plus délicieuse des façons.", "thoughtful"),
        ], { trust: 4, desire: 6, knowledge: ["knows_bellirith_valurn_fear"] }),
      ],
    }] }),
  ],
  reveals: ["knows_bellirith_saelis"],
};

const gap: SecretConversation = {
  id: "secret-bellirith-gap",
  character: "bellirith",
  tier: 80,
  minDesire: BELLIRITH_CONFIDENCE_DESIRE[80],
  title: "Le trou dans le récit",
  intro: [
    N("Ce soir, Bellirith ne vous séduit pas. C’est si rare que vous vous en apercevez avant elle. Elle est assise sur le rebord d’une fenêtre, les jambes repliées, et regarde la ville comme on regarde un jeu dont on connaît trop bien les règles."),
    B("Tu veux savoir comment on passe d’un « nous » à ça ? D’un frère qu’on embrasse à un frère qu’on veut voir à genoux ?", "thoughtful"),
    P("Si tu veux me le dire."),
    B("Il y a eu une promesse. Il me l’a faite. Ou je l’ai crue. Je ne sais plus laquelle de ces deux phrases je déteste le plus.", "away"),
    N("Elle tourne une bague à son doigt, une bague que vous ne lui aviez jamais vue. Elle s’en aperçoit, et la retire, et la range dans sa manche."),
    B("C’est tout. C’est tout ce que tu auras ce soir, et c’est déjà plus que ce qu’a jamais eu Iriana.", "cold"),
  ],
  choices: [
    C("sbg80-accept", "Accepter la limite, et rester simplement près d’elle à la fenêtre.", "sangFroid", [
      N("Vous vous asseyez sur l’autre rebord, sans la toucher. La ville bruit en dessous. Vous ne dites rien pendant un long moment."),
      B("Tu ne poses pas de question.", "surprised"),
      P("Tu m’as dit que c’était tout."),
      B("Je mens souvent.", "smirk"),
      P("Pas ce soir."),
      N("Bellirith rit, un petit rire presque normal. Puis elle tend le pied et le pose contre votre genou, comme une signature au bas d’un contrat qu’elle n’a pas lu."),
    ], { affection: 3, trust: 2, desire: 2 }),
    C("sbg80-push-valurn", "Lui dire que Valurn vous a parlé d’un talisman, et d’une promesse de protection.", "lucidite", [
      P("Valurn m’a parlé d’une protection. D’un talisman. Il m’a dit qu’il pensait pouvoir revenir."),
      N("Bellirith ne bouge pas. Puis elle descend de la fenêtre, très lentement, et vient se planter devant vous."),
      B("Il t’a dit ça. À toi. Il t’a raconté sa version, avec sa voix de remords bien rangée, et tu l’as écouté.", "cold"),
      B("Sa version a des trous. La mienne aussi. Entre l’homme qui me tenait la main et celui que je veux voir ramper, il manque quelque chose. Et je ne te le donnerai pas ce soir. Ni à toi, ni à lui, ni à personne.", "away"),
      P("Je ne te le demande pas."),
      B("Si. Tu le demandes avec tes yeux. Et le pire, c’est que j’ai failli répondre.", "thoughtful"),
      N("Elle se détourne. À la porte, elle s’arrête, sans se retourner."),
      B("Reviens demain. Je serai odieuse. Ça nous fera du bien à tous les deux.", "smirk"),
    ], { trust: 5, desire: 4, knowledge: ["knows_bellirith_missing_piece"] }, { requiresKnowledge: ["knows_valurn_old_promise"] }),
    C("sbg80-push-ring", "Lui demander pourquoi elle a caché cette bague dès qu’elle a parlé de promesse.", "lucidite", [
      P("La bague. Tu l’as rangée dès que tu as dit « promesse »."),
      N("Bellirith vous regarde longtemps. Puis elle sort la bague de sa manche et la pose sur le rebord, entre vous deux. Un anneau simple, usé, sans pierre."),
      B("Elle ne veut rien dire. Elle n’a rien à voir avec lui. Je l’ai gagnée aux dés à Saëlis il y a cent ans.", "cold"),
      P("Tu mens."),
      B("Oui.", "away"),
      N("Elle reprend la bague. Ses doigts tremblent, très légèrement, et elle déteste visiblement que vous l’ayez vu."),
      B("Entre ce que nous étions et ce que nous sommes, il y a un trou. Je ne te dirai pas ce qu’il y a dedans. Pas parce que tu ne le mérites pas. Parce que si je le dis à voix haute, il deviendra vrai une seconde fois.", "thoughtful"),
    ], { trust: 5, desire: 4, knowledge: ["knows_bellirith_missing_piece"] }, { requires: { stat: "lucidite", value: BELLIRITH_PUSH_LUCIDITY[80] } }),
  ],
  reveals: ["knows_bellirith_promise"],
};

export const BELLIRITH_CONFIDENCES: SecretConversation[] = [father, beforeHate, saelis, gap];

// ─── Confidences Valurn réécrites (faits du Tome II uniquement) ─────────────

const valurnProtection: SecretConversation = {
  id: "secret-valurn-protection",
  character: "valurn",
  tier: 60,
  title: "Une jolie pierre enfermée dans du métal",
  intro: [
    N("Valurn joue avec un petit objet sans valeur, un galet poli serti dans une monture de fer, acheté à un colporteur pour trois sous. Il le fait passer d’un doigt à l’autre sans jamais le regarder."),
    P("C’est un porte-bonheur ?"),
    V("C’est une imitation. L’original était plus joli. Une pierre enfermée dans du métal, et assez de mots tendres autour pour qu’on y croie.", "amused"),
    N("Le galet s’immobilise entre son index et son majeur."),
    V("Je l’ai donné à Bellirith, autrefois. Une protection. Je lui ai demandé de rester cachée pendant que je partais. Je lui ai dit que ça suffirait.", "away"),
    P("Ça a suffi ?"),
    V("Vous êtes délicieusement direct·e quand vous voulez me faire saigner sans en avoir l’air.", "smirk"),
    N("Il pose l’imitation sur la table, entre vous, comme on dépose une pièce à conviction qu’on n’a pas le courage de commenter."),
    V("Bellirith pense que je savais que c’était inutile. Je pense que je l’espérais utile. Aucun de nous deux n’a jamais réussi à convaincre l’autre, et la conversation dure depuis assez longtemps pour avoir des petits-enfants.", "thoughtful"),
  ],
  choices: [
    C("svp60-l", "Lui demander pourquoi il fallait qu’elle reste cachée, au lieu de partir avec lui.", "lucidite", [
      P("Pourquoi ne l’avez-vous pas emmenée ?"),
      V("Parce que si elle m’avait suivi, nous serions morts tous les deux. C’est ce que je me suis dit. C’est ce que je me dis encore les jours où j’ai besoin de dormir.", "away"),
      P("Et les autres jours ?"),
      V("Les autres jours, je me demande si je ne voulais pas surtout qu’elle ne me suive pas.", "thoughtful"),
      N("Il reprend le galet et le fait disparaître dans sa manche, d’un geste de prestidigitateur qui n’amuse personne."),
      V("Ne lui répétez jamais cette phrase. Elle l’a déjà dite elle-même, mieux que moi.", "smirk"),
    ], { trust: 8, affection: 2 }),
    C("svp60-s", "Ne pas trancher entre les deux versions, et lui laisser l’imitation.", "sangFroid", [
      N("Vous repoussez le galet vers lui, sans un mot de jugement."),
      P("Je ne choisirai pas entre votre version et la sienne. Je n’étais pas là."),
      V("Quelle frustrante neutralité. J’espérais au moins une condamnation, pour me sentir important.", "amused"),
      P("Vous l’êtes déjà assez à ses yeux."),
      N("Le sourire de Valurn vacille. Il range l’imitation, puis la ressort, puis vous la tend."),
      V("Gardez-la. Si un jour Bellirith la voit dans vos mains, regardez bien son visage. Vous apprendrez en une seconde ce que je n’arrive pas à dire en trois siècles.", "thoughtful"),
    ], { trust: 7, affection: 3 }),
  ],
  reveals: ["knows_valurn_old_promise"],
};

const valurnReturn: SecretConversation = {
  id: "secret-valurn-return",
  character: "valurn",
  tier: 80,
  title: "Je pensais pouvoir revenir",
  intro: [
    N("Valurn ne fait aucun tour de cartes, ce soir. Il n’a même pas de verre. Il regarde ses mains posées à plat sur la table comme deux pièces d’un jeu qu’il ne sait plus jouer."),
    V("Les soldats sont venus. Ceux de l’Empire. Elle tenait la protection que je lui avais donnée. Je n’étais pas là.", "away"),
    N("Il ne vous laisse pas le temps de répondre."),
    V("Je pensais pouvoir revenir. C’est la phrase. Je la répète depuis si longtemps qu’elle a pris la forme exacte de ma bouche.", "thoughtful"),
    P("Et Bellirith ? Qu’est-ce qu’elle dit ?"),
    V("Qu’en réalité, j’espérais seulement pouvoir supporter de ne pas le faire.", "cold"),
    N("Il sourit, enfin. C’est le sourire le plus laid que vous lui ayez jamais vu, parce qu’il ne cherche à séduire personne."),
    V("Je ne vous dirai pas ce qui s’est passé ensuite. Ce n’est pas mon histoire à raconter. C’est la sienne, et elle a payé assez cher pour avoir le droit de la garder.", "away"),
  ],
  choices: [
    C("svr80-l", "Refuser de lui offrir une absolution, sans le condamner à sa place.", "lucidite", [
      P("Je ne vais pas vous dire que ce n’était pas votre faute."),
      V("Merci. Les gens qui me le disent me donnent envie de mordre.", "smirk"),
      P("Ni que c’était entièrement la vôtre. Je n’en sais pas assez. Elle, si."),
      N("Valurn hoche la tête, une fois, lentement. Il retourne ses mains, paumes vers le haut, vides."),
      V("C’est la réponse la plus juste qu’on m’ait jamais faite. Elle est insupportable. Restez encore un peu.", "thoughtful"),
    ], { trust: 10 }),
    C("svr80-s", "Lui demander s’il compte un jour l’écouter raconter sa version à elle.", "sangFroid", [
      P("Est-ce que vous la laisserez raconter sa version, un jour ? En entier ?"),
      V("Si elle le veut. Ce qui suppose qu’elle cesse d’abord de vouloir m’arracher les yeux, ce qui suppose que je cesse de le mériter.", "amused"),
      N("L’humour retombe aussitôt, faute de combustible."),
      V("Oui. Si elle le veut, je l’écouterai jusqu’au bout, sans plaisanter. C’est la seule promesse que je me sente encore capable de tenir avec elle.", "away"),
    ], { trust: 9, affection: 1 }),
  ],
  reveals: ["knows_valurn_did_not_return"],
};

export const VALURN_BELLIRITH_CONFIDENCES: SecretConversation[] = [valurnProtection, valurnReturn];

// ─── Courriers ──────────────────────────────────────────────────────────────

export const BELLIRITH_LETTERS: LetterTemplate[] = [
  {
    id: "letter-bellirith-preferred", character: "bellirith", subject: "Une préférence regrettable",
    delivery: "L’enveloppe sent le miel brûlé et le jasmin. Le cachet est un baiser de rouge, appliqué avec une précision vexée.",
    minDay: 1, minStage: 1, requiresFlags: ["bellirith-has-resisted"],
    body: [
      "Je viens de passer une heure à dresser la liste de tout ce que tu m’as préféré·e jusqu’ici. Une lettre. Un capitaine qui sent le cheval. Une carte avec des flèches. Une impératrice qui relit des virgules.",
      "J’ai d’abord trouvé ça vexant. Puis amusant. Puis — et c’est là que tu deviens un problème — intéressant.",
      "Personne ne me dit non avec cette tête-là. Tu avais envie. Je l’ai senti. Tu es parti·e quand même. Je veux comprendre comment on fabrique quelqu’un comme toi, et je compte bien démonter le mécanisme pièce par pièce.",
      "Ne te réjouis pas trop vite : je ne suis pas blessée. Je suis motivée. C’est bien pire.",
    ],
    signature: "B. — qui vient de trouver un nouveau passe-temps",
    replies: [
      { id: "bel-pref-tease", label: "Répondre que la carte avait de très jolies flèches.", response: "La réponse arrive le soir même : « Je vais faire dessiner des flèches sur ma robe. On verra bien laquelle tu suis. »", effects: { desire: 3, affection: 1 } },
      { id: "bel-pref-honest", label: "Avouer que ce n’était pas facile de partir.", response: "« Je sais. C’est exactement pour ça que je vais recommencer. Prépare-toi à des refus beaucoup plus difficiles. »", effects: { desire: 4 } },
    ],
  },
  {
    id: "letter-bellirith-favorite", character: "bellirith", subject: "À mon favori",
    delivery: "Pas d’enveloppe. Le billet a été glissé sous votre oreiller, plié en quatre, et l’oreiller sent encore son parfum.",
    minDay: 1, minStage: 1, requiresFlags: ["bellirith-has-slept", "bellirith-favorite"],
    body: [
      "Mon favori,",
      "Oui, j’ai écrit le mot. Non, ce n’est pas une déclaration. J’ai eu trois cent quatre-vingt-dix favoris, tu es simplement le plus récent, et pour l’instant le plus amusant.",
      "Je sais maintenant exactement à quel moment ton souffle se coince, de quel côté tu tournes la tête quand tu ne veux pas qu’on te voie céder, et ce qui se passe quand je te parle très bas juste avant. Je compte m’en servir. Souvent. Aux pires moments.",
      "Garde ce billet. Relis-le pendant les conseils de guerre. Essaie de rester concentré·e.",
    ],
    signature: "B.",
    replies: [
      { id: "bel-fav-counter", label: "Répondre que vous aussi, vous avez pris des notes.", response: "« Des notes ? Sur moi ? Voilà qui est beaucoup trop ambitieux pour une seule nuit. Viens me montrer tes brouillons. »", effects: { affection: 3, desire: 1 } },
      { id: "bel-fav-dry", label: "Rappeler que vous avez des conseils de guerre à tenir.", response: "« Je sais. C’est précisément le principe. »", effects: { affection: 2 } },
    ],
  },
  {
    id: "letter-bellirith-aftertaste", character: "bellirith", subject: "Un arrière-goût",
    delivery: "L’enveloppe a été cachetée avec du miel. Littéralement. Vos doigts collent.",
    minDay: 1, minStage: 1, requiresFlags: ["bellirith-has-slept"], excludesFlags: ["bellirith-favorite"],
    body: [
      "Tu as laissé un arrière-goût. C’est inhabituel. D’ordinaire, mes amants s’oublient avant le petit déjeuner.",
      "Je ne te demande rien. Je te signale simplement qu’une partie de moi a déjà prévu la prochaine fois, et qu’elle a très mauvais esprit.",
    ],
    signature: "B.",
    replies: [
      { id: "bel-after-yes", label: "Répondre que vous attendez la prochaine fois.", response: "« Tu ne l’attendras pas. Elle viendra te chercher au mauvais moment, comme toutes les bonnes choses. »", effects: { affection: 3 } },
      { id: "bel-after-no", label: "Prévenir qu’il n’y aura pas forcément de prochaine fois.", response: "« Délicieux. Voilà qui va me tenir éveillée. »", effects: { desire: 3 } },
    ],
  },
  {
    id: "letter-bellirith-correction", character: "bellirith", subject: "Erratum",
    delivery: "Un billet court, d’une écriture penchée. Un seul mot est souligné trois fois.",
    minDay: 1, minStage: 1, requiresKnowledge: ["knows_bellirith_valurn_personal"],
    body: [
      "Correction à notre dernière conversation : j’ai dit que Valurn et moi étions « tout ce que l’autre avait ». C’était faux. Nous avions aussi un chat. Il s’appelait Dette. Il a vécu quarante ans et il préférait Valurn, le traître.",
      "Voilà. Tu as un détail supplémentaire minuscule et parfaitement inutile. Je te l’offre pour te punir : tu écoutes beaucoup trop bien, et j’ai besoin que tu saches que je l’ai remarqué.",
    ],
    signature: "B. — qui n’aime pas qu’on l’écoute à ce point",
    replies: [
      { id: "bel-corr-cat", label: "Demander des nouvelles du descendant de Dette.", response: "« Il n’y a pas de descendant. Il y a une statue de Dette dans ma salle du trône à Saëlis. Valurn ne le sait pas. Tu es la deuxième personne au monde à l’apprendre. »", effects: { trust: 3, desire: 2 } },
      { id: "bel-corr-listen", label: "Répondre que vous continuerez à écouter.", response: "« Je m’en doutais. C’est absolument insupportable. Continue. »", effects: { desire: 3, trust: 1 } },
    ],
  },
  {
    id: "letter-bellirith-act-end-resisted", character: "bellirith", subject: "Tu choisiras le soir",
    delivery: "Une lettre longue, pour elle. Le papier est rose pâle, presque sage. Presque.",
    minDay: 1, minStage: 1, requiresFlags: ["campaign-coalition-preparation", "bellirith-trend:resisted"],
    body: [
      "Je t’ai proposé mon lit, mes bains, une victoire, une information, une ville entière dans le creux de ma main. Tu as dit non à tout, avec cet air d’en avoir terriblement envie qui me rend folle.",
      "Alors j’arrête. Pas de jouer : de choisir le moment. La prochaine fois, ce sera toi qui viendras. Tu choisiras le soir. Tu choisiras « maintenant ». Et je verrai enfin ce que tu vaux quand tu ne fuis plus.",
      "Je t’attendrai. Ne fais pas de bruit, je ne veux pas avoir l’air d’attendre.",
    ],
    signature: "Bellirith",
    replies: [
      { id: "bel-end-res-come", label: "Répondre : « Bientôt. »", response: "« Bientôt n’est pas un jour, c’est une torture. Merci. »", effects: { desire: 3, affection: 2 } },
      { id: "bel-end-res-tease", label: "Répondre que vous la ferez peut-être attendre encore un peu.", response: "« Tu es cruel·le. Je t’adore. Je te déteste. Les deux m’allaient très bien avant toi. »", effects: { desire: 4 } },
    ],
  },
  {
    id: "letter-bellirith-act-end-ceded", character: "bellirith", subject: "Ce soir, viens toi",
    delivery: "Trois lignes sur une carte de jeu : la dame de cœur, à laquelle quelqu’un a dessiné des cornes.",
    minDay: 1, minStage: 1, requiresFlags: ["campaign-coalition-preparation", "bellirith-trend:ceded"],
    body: [
      "Jusqu’ici, je suis venue te chercher, et tu m’as suivie. Chaque fois. C’était charmant. C’était facile.",
      "La prochaine fois, je ne viendrai pas. Viens, toi. Choisis le soir. Je veux savoir ce que tu fais quand ce n’est pas moi qui tire sur la laisse.",
    ],
    signature: "B. — qui croit déjà connaître la réponse",
    replies: [
      { id: "bel-end-ced-surprise", label: "Répondre : « Tu vas être surprise. »", response: "« J’en doute. Mais j’adore qu’on essaie. »", effects: { desire: 4, affection: 1 } },
      { id: "bel-end-ced-soon", label: "Répondre que vous viendrez.", response: "« Évidemment. »", effects: { affection: 3 } },
    ],
  },
  {
    id: "letter-bellirith-act-end-mixed", character: "bellirith", subject: "Je ne sais plus",
    delivery: "Le cachet a été appliqué, gratté, puis réappliqué. Bellirith a hésité. Cela se voit.",
    minDay: 1, minStage: 1, requiresFlags: ["campaign-coalition-preparation", "bellirith-trend:mixed"],
    body: [
      "Une fois tu me suis, une fois tu me laisses seule avec mon parfum et ma robe trop belle. Je ne sais plus ce que tu vas faire. Personne ne me fait ça.",
      "Alors choisis, toi. Le soir, l’heure, le lieu. Viens me surprendre. Ou ne viens pas, et je saurai au moins ça.",
    ],
    signature: "B.",
    replies: [
      { id: "bel-end-mix-come", label: "Répondre que vous viendrez, quand vous l’aurez décidé.", response: "« Voilà exactement le genre de phrase qui m’empêche de dormir. Merci beaucoup. »", effects: { desire: 3, affection: 2 } },
      { id: "bel-end-mix-guess", label: "Répondre qu’elle n’a qu’à deviner.", response: "« Je déteste deviner. J’adore deviner. Tu vois ce que tu me fais ? »", effects: { desire: 4 } },
    ],
  },
];

// ─── Invitations ───────────────────────────────────────────────────────────

export const BELLIRITH_INVITATIONS: InvitationTemplate[] = [
  {
    // Ancien « Une soirée sans aura » : l’identifiant est conservé pour les
    // sauvegardes, l’axe devient un défi assumé (spec §37).
    id: "invite-bellirith-mask", character: "bellirith", title: "Le pari de la salle de musique",
    message: "Bellirith parie qu’elle fera avouer un désir à chaque diplomate de la salle de musique avant minuit, sans toucher personne. Elle vous veut comme arbitre. Ou comme adversaire. Elle vous laisse choisir.",
    location: "akuhn", spot: "akuhn-music-room", period: "soirée", minDay: 12, minStage: 2, expiresAfter: 5,
    declineText: "Bellirith répond par un billet : « Lâche. Je gagnerai sans arbitre, ce qui est beaucoup moins drôle. » Le pari a lieu sans vous ; trois diplomates démissionnent le lendemain.",
    intro: [
      N("La salle de musique d’Akuhn’Nabad bourdonne de délégués en habits de cour. Bellirith trône sur le rebord du clavecin, une coupe à la main, et compte les invités du bout de son escarpin."),
      L("Bellirith", "Dix-sept diplomates. Dix-sept secrets. Je les fais tous avouer avant minuit, à voix haute, sans poser la main sur personne. Tu arbitres.", "teasing"),
      L("Bellirith", "Ou tu joues contre moi. Si tu en fais avouer un seul avant que j’en aie fait avouer cinq, je te dois une faveur. Une vraie. Si je gagne… tu me la dois, toi.", "seductive"),
      N("Elle laisse échapper une volute d’aura, juste assez pour qu’un vieux plénipotentiaire, à l’autre bout de la salle, renverse son verre en regardant la nuque d’un traducteur."),
      L("Bellirith", "Un. Je commence sans toi, chéri·e. Le temps tourne.", "smirk"),
    ],
    choices: [
      C("ibm-judge", "Arbitrer, et surveiller de très près qu’elle ne triche pas.", "lucidite", [
        N("Vous vous asseyez près d’elle, carnet en main. Pendant deux heures, vous la regardez travailler : un regard, une phrase, un silence placé au bon endroit, et des secrets qui tombent comme des fruits mûrs."),
        L("Bellirith", "Quatorze. Tu as contesté deux fois. Les deux fois, tu avais raison. C’est très mauvais pour mon humeur et très bon pour mon intérêt.", "thoughtful"),
        L("{player}", "Tu as utilisé ton aura sur le quinzième."),
        L("Bellirith", "Évidemment. Je suis une démone du Désir, pas une nonne. Le pari ne disait pas « sans être moi ».", "amused"),
      ], { affection: 3, desire: 3 }),
      C("ibm-rival", "Jouer contre elle, et faire avouer un désir à quelqu’un avant elle.", "audace", [
        N("Vous traversez la salle jusqu’à l’ambassadrice la plus raide, et vous lui demandez simplement ce qu’elle ferait si personne ne la regardait. Elle rougit. Elle répond. Bellirith, de l’autre côté de la salle, en lâche sa coupe."),
        L("Bellirith", "Tu as… sans aura. Sans parfum. Avec une question. C’est révoltant.", "surprised"),
        L("{player}", "Tu me dois une faveur."),
        L("Bellirith", "Je te dois une faveur. Choisis-la avec soin. Je compte bien te la faire regretter.", "seductive"),
      ], { affection: 2, desire: 5 }),
      C("ibm-prize", "Lui proposer d’arrêter le jeu tout de suite et de régler le prix ailleurs.", "resonance", [
        L("{player}", "Et si on sautait directement à la partie où quelqu’un doit quelque chose à l’autre ?"),
        N("Bellirith pose sa coupe. Les dix-sept diplomates cessent d’exister pour elle."),
        L("Bellirith", "Tu viens de choisir. Toi. C’est d’une impolitesse délicieuse. Viens.", "seductive"),
      ], { affection: 3 }, { launchesIntimacy: "bellirith-free" }),
    ],
  },
  catchupInvitation("01", "Une sœur dans l’embrasure", "Un billet sans signature, parfumé de miel brûlé et de jasmin : « Mon frère a une nouvelle curiosité et il a oublié de me la présenter. Salle du Conseil, quand il te plaira. Je suis patiente. C’est faux, mais l’effort est sincère. »", "algratal", "algratal-palace-council", "soirée"),
  catchupInvitation("02", "La lettre peut attendre", "« Tu m’as manqué une première fois. Je t’offre une seconde chance de m’éviter. Salle du Conseil, quand tu veux. » — B.", "algratal", "algratal-palace-council", "apres-midi"),
  catchupInvitation("03", "Le courrier de minuit", "« Akuhn’Nabad, la salle de guerre. Tu y as oublié quelque chose : moi. Je t’attends, sans date limite. Je déteste ça. » — B.", "akuhn", "akuhn-war-room", "soirée"),
  catchupInvitation("04", "Ce que la Lumière ne célèbre pas", "« La victoire a eu lieu sans moi. Viens corriger ça, quand tu voudras. Salle d’audience. » — B.", "algratal", "algratal-palace-audience", "matin"),
];

function catchupInvitation(id: "01" | "02" | "03" | "04", title: string, message: string, location: string, spot: string, period: InvitationTemplate["period"]): InvitationTemplate {
  return {
    id: `invite-bellirith-catchup-${id}`,
    character: "bellirith",
    title,
    message,
    location,
    spot,
    period,
    minDay: 1,
    minStage: 0,
    persistent: true,
    catchup: id,
    declineText: "",
    // La scène réelle est construite par bellirith-intrusions.ts en mode rattrapage.
    intro: [],
    choices: [],
  };
}
