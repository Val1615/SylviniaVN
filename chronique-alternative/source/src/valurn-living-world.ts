import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { InvitationTemplate, KnowledgeEntry, LetterTemplate, SecretConversation, SecretTier } from "./heritages-data";

/**
 * Valurn · vie périphérique : connaissances, confidences, courriers, invitations.
 * Les confidences éclairent les quêtes après coup et ne les débloquent jamais.
 * La confidence 60 ne nomme ni ne situe la personne regrettée.
 */

const L = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const N = (text: string): DialogueLine => L("Narration", text);
const P = (text: string): DialogueLine => L("{player}", text);
const V = (text: string, mood = "charming"): DialogueLine => L("Valurn", text, mood);
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({
  id, text, stat, response, effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } },
});
const S = (tier: SecretTier, id: string, title: string, intro: DialogueLine[], choices: ChoiceData[], reveals: string[], extra: Partial<SecretConversation> = {}): SecretConversation => ({
  id, character: "valurn", tier, title, intro, choices, reveals, spots: ["algratal-market", "algratal-palace-audience", "algratal-palace-council", "algratal-streets", "algratal-palace-quarters", "forestier-inn"], ...extra,
});

export const VALURN_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "knows_valurn_network_mark", title: "Le signe de transmission", summary: "Les gens de Valurn marquent d'une double entaille au pli les billets qu'ils lui font passer. Deux récits incompatibles portaient ce signe.", people: ["valurn"] },
  { id: "knows_valurn_halbrecht_lead", title: "La maison Halbrecht", summary: "Des courtiers concurrents d'Al'Gratal achètent des nouvelles par un jeune commis, Corvin Lisse.", people: ["valurn"] },
  { id: "knows_valurn_thazran_contact", title: "Un correspondant des Calciterres", summary: "Thazran vend des renseignements à Valurn et l'appelle « fils de Bhaal » pour lui rappeler qu'il ne choisit pas ses créanciers.", people: ["valurn"] },
  { id: "knows_valurn_double_broker", title: "Un intermédiaire double", summary: "Le vendeur des billets de Valurn ne travaille pas pour l'or : quelqu'un le tient.", people: ["valurn"] },
  { id: "knows_valurn_odile", title: "Odile Varrasque", summary: "Relieuse et courrière du Croissant. Valurn l'a aidée autrefois sans rien réclamer ; elle a modifié deux de ses billets pour protéger son frère.", people: ["valurn"] },
  { id: "knows_valurn_seeded_leads", title: "Les fausses pistes", summary: "Au salon de Halbrecht, Valurn avait lui-même semé deux fausses offres pour piéger le revendeur, au risque d'un innocent.", people: ["valurn"] },
  { id: "knows_valurn_market_outcome", title: "La fuite fermée", summary: "L'affaire des billets de Valurn est close. La manière choisie a laissé des traces chez ses correspondants.", people: ["valurn"] },
  { id: "knows_valurn_iriana_table", title: "Une place à la table", summary: "Valurn parle d'Iriana comme d'une égale qu'il ne possède pas, et de leurs désaccords comme d'une part de ce qui les lie.", people: ["valurn", "iriana"] },
  { id: "knows_valurn_unnamed_regret", title: "Une personne qu'il connaissait", summary: "Valurn reconnaît avoir regretté une ancienne décision prise à la place d'un proche. Il n'en dit pas davantage.", people: ["valurn"] },
  { id: "knows_valurn_current_accountability", title: "Ce qu'il choisit aujourd'hui", summary: "Devant un refus qu'il a provoqué, Valurn a choisi de laisser l'autre décider des suites, sans s'en absoudre.", people: ["valurn"] },
  { id: "knows_valurn_bad_client", title: "Le mauvais client", summary: "Valurn a un jour vendu très cher un renseignement exact à un client qui l'a utilisé de la manière la plus ridicule possible.", people: ["valurn"] },
  { id: "knows_valurn_client_memory", title: "Les noms qu'on n'oublie pas", summary: "Valurn retient les habitudes minuscules de clients qu'il ne reverra jamais. Il prétend que c'est du calcul.", people: ["valurn"] },
  { id: "knows_valurn_mortal_tastes", title: "Les plaisirs du mortel", summary: "Musique de bal, étoffes bien coupées, pâtisseries épicées et pièces de théâtre ratées : Valurn a des goûts, et il les défend mal.", people: ["valurn"] },
  { id: "knows_valurn_knowledge_limit", title: "La limite du savoir", summary: "Valurn admet qu'une ressemblance démoniaque dans votre fragment reste une ressemblance, pas une origine.", people: ["valurn"] },
];

export const VALURN_CONFIDENCES: SecretConversation[] = [
  S(20, "secret-valurn-bhaal", "Le nom sur la carte", [
    N("Valurn bat un jeu de cartes de la cour. Le roi de flammes porte un sceau qu'il recouvre machinalement du pouce chaque fois qu'il le croise."),
    P("Ce sceau vous gêne."),
    V("Il me suit. C'est différent. Celui-là, c'est celui de mon père. Bhaal. Les imprimeurs d'ici le trouvent décoratif.", "neutral"),
    V("Chez nous, les règles étaient simples. Il les écrivait. Elles s'appliquaient à tout le monde sauf à lui. Et chaque règle avait une seconde lecture, que l'on découvrait en la payant."),
    V("Alors j'ai appris à lire. Les clauses, les silences, les endroits où un mot pèse plus que les autres. Je lui dois mon métier. C'est la seule dette que je refuse de solder, par principe.", "amused"),
    N("Il retourne le roi face contre la table."),
    V("Thazran m'appelle fils de Bhaal pour me faire baisser les yeux. Ça marche moins qu'avant. Un peu moins."),
  ], [
    Q("sva20-a", "Inventer une règle qui s'applique d'abord à celui qui l'écrit.", "audace", [
      P("Nouvelle règle de votre jeu : celui qui écrit une règle la subit le premier."),
      V("Mon père aurait brûlé la table. Puis le règlement. Puis vous, par souci de cohérence.", "amused"),
      V("Je la garde. Je vais même l'appliquer. Ce soir, au moins."),
    ], { affection: 4, trust: 2 }),
    Q("sva20-l", "Remarquer qu'il se sert lui-même de l'héritage qu'il conteste.", "lucidite", [
      P("Vous détestez ses règles, et vous en vivez. Vous lisez les contrats comme il vous a appris."),
      V("Oui. C'est très désagréable à entendre de votre bouche. Plus juste qu'agréable.", "annoyed"),
      V("Je prends ses armes. Je n'ai pas trouvé mieux. Si vous en avez d'autres, je suis client."),
    ], { trust: 5 }),
    Q("sva20-s", "Écouter, sans lui dire qu'il ne ressemble pas à son père.", "sangFroid", [
      N("Vous ne dites rien. Ni qu'il est différent, ni qu'il est pareil. Il attend une absolution qui ne vient pas."),
      V("Merci. Les gens qui me disent que je ne suis pas comme lui me donnent toujours envie de leur prouver le contraire.", "neutral"),
    ], { trust: 4, affection: 2 }),
  ], ["knows_valurn_bhaal_childhood"]),

  S(40, "secret-valurn-table", "Une place à la table", [
    N("Une lettre d'Iriana dépasse de la poche de Valurn, cachetée de cire grise. Il la lit devant vous, sans gêne, et rit deux fois."),
    V("Elle m'écrit que mon dernier rapport est « brillant, inutilisable et légèrement insultant ». Elle a raison sur les trois points.", "amused"),
    P("Qu'est-ce que vous êtes, l'un pour l'autre ?"),
    V("Des gens qui se lisent. Elle me trouve dangereux et utile. Je la trouve compétente au point de m'énerver, et contradictoire au point de me plaire.", "neutral"),
    V("Nous avons un accord. Il est libre. Ni elle ni moi ne possédons l'autre, ce qui ne veut pas dire que rien ne nous tient. Nous nous disputons souvent. C'est même ce que je préfère.", "neutral"),
    V("On m'a demandé un jour où était ma place. J'ai répondu : là où l'on me laisse une chaise et où je peux la reculer. Iriana me laisse la chaise. Elle ne me demande pas de rester assis."),
  ], [
    Q("sva40-mutual", "Parler de leurs liens comme de choix réciproques.", "sangFroid", [
      P("Donc elle vous choisit, et vous la choisissez. Chaque fois."),
      V("Chaque fois. C'est épuisant, et je n'en voudrais pas d'autre forme.", "neutral"),
    ], { trust: 4, affection: 2 }),
    Q("sva40-dispute", "Lui demander un désaccord concret avec Iriana.", "lucidite", [
      P("Un désaccord. Un vrai."),
      V("Les prisonniers. Elle veut des procès lisibles. Moi, je veux savoir avant qu'on juge. Elle dit que je confonds la vérité et ma curiosité. Elle n'a pas complètement tort.", "neutral"),
      V("Et elle refuse que je lise ses lettres à voix haute en imitant les expéditeurs. Celui-là, je le gagnerai."),
    ], { trust: 5 }),
    Q("sva40-possess", "Le pousser sur ses propres possessivités.", "audace", [
      P("Et vous ? Vous n'avez jamais voulu qu'elle soit à vous ?"),
      V("Si. Les mauvais soirs. Je me trouve alors ridicule et je vais perdre de l'argent aux cartes, ce qui me calme.", "annoyed"),
      V("Quelqu'un qui me connaissait bien disait que je collectionne ce que je crains de perdre. Je n'aime pas qu'on ait raison sur moi avant moi."),
    ], { affection: 3, trust: 3 }),
  ], ["knows_valurn_iriana_table"]),

  S(60, "secret-valurn-regret", "Une personne que je connaissais", [
    N("Il pleut sur le Croissant. Valurn parle de Corvin, d'Odile, de la façon dont il a « arrangé » les choses. Il parle bien. Vous l'arrêtez."),
    P("Vous décidez toujours de ce qui convient aux autres. Vous l'avez fait avec Odile. Avec Bram. Avec moi, au salon."),
    V("C'est mon talent. Je vois plus loin. On me paie pour ça.", "amused"),
    N("Il cherche la suite de la phrase. Il ne la trouve pas tout de suite."),
    V("J'ai été absolument certain, une fois, de rendre service à quelqu'un. Quelqu'un de proche. J'ai trouvé mon raisonnement admirable.", "neutral"),
    V("Je le trouve encore assez bon, certains jours. Ce n'est pas mieux.", "away"),
    V("Je ne raconte pas la suite.", "away"),
  ], [
    Q("sva60-silence", "Respecter son silence.", "sangFroid", [
      N("Vous ne demandez rien. Il hoche la tête, une fois."),
      V("Bien. Vous êtes la première personne qui ne m'a pas demandé qui."),
      N("Il reprend un ton plus léger au bout d'un moment, parle de la pluie, des gouttières d'Al'Gratal, du prix du sel. Le reste reste où il l'a laissé."),
    ], { trust: 7 }),
    Q("sva60-mirror", "Lui opposer une décision qu'il a prise à votre place pendant l'enquête.", "lucidite", [
      P("Au salon, vous avez décidé que je jouerais sans savoir. Ça ressemble à ça ?"),
      V("Ça y ressemble. En plus petit. Vous en êtes sorti·e intact·e.", "neutral"),
      P("Et si je ne l'avais pas été ?"),
      V("Alors j'aurais eu deux regrets au lieu d'un. Vous voyez, je compte encore.", "away"),
    ], { trust: 6, affection: 1 }),
    Q("sva60-present", "Lui demander seulement ce qu'il changerait aujourd'hui, dans une situation semblable.", "sangFroid", [
      P("Pas le passé. Aujourd'hui, si c'était à refaire avec quelqu'un de proche, vous feriez quoi ?"),
      V("Je demanderais. Je déteste demander. On vous répond des choses que vous n'aviez pas prévues.", "neutral"),
      V("Mais je demanderais."),
    ], { trust: 6, affection: 2 }),
  ], ["knows_valurn_unnamed_regret"]),

  S(80, "secret-valurn-accountability", "Ce que je choisis aujourd’hui", [
    N("Valurn vous attend au Grand Marché avec une lettre ouverte. Il ne la lit pas à voix haute. Il vous la tend."),
    N("Elle vient d'un ancien correspondant, un greffier qu'il a protégé pendant l'affaire. Le greffier refuse de reprendre affaire avec lui. Il écrit : « Vous m'avez sauvé sans me demander mon avis. Je préfère être perdu à ma façon. »"),
    V("J'ai déjà rédigé trois réponses. La première le menace poliment. La deuxième lui rappelle tout ce que je lui ai évité. La troisième est un chef-d'œuvre de culpabilisation.", "annoyed"),
    V("Elles fonctionneraient toutes les trois. Je le sais. Je l'ai bien formé."),
    P("Et vous allez en envoyer une ?"),
    V("Je n'ai pas encore décidé. C'est pour ça que vous êtes ici. Je veux un témoin, au cas où je choisirais mal.", "neutral"),
  ], [
    Q("sva80-terms", "L'aider à proposer des conditions qui respectent son refus.", "lucidite", [
      P("Écrivez-lui ce qu'il peut vous demander s'il change d'avis. Rien d'autre."),
      N("Vous écrivez à deux. Trois lignes. Valurn en efface une, la réécrit, l'efface encore."),
      V("« Si vous avez besoin de moi, vous savez où je joue. Je ne viendrai pas. » C'est tout. C'est affreusement court.", "neutral"),
      V("Je l'envoie. Je vais le regretter avant midi, et je ne la reprendrai pas."),
    ], { trust: 8, flags: ["valurn-accountability"] }),
    Q("sva80-after", "Lui demander ce qu'il fera si le refus dure.", "sangFroid", [
      P("Et si le greffier ne revient jamais ?"),
      V("Alors je perdrai un bon greffier. Et je continuerai à savoir qu'il avait raison. Les deux sont supportables. Le second moins.", "neutral"),
      N("Il déchire les trois brouillons, un par un, et n'écrit rien. Le silence aussi est une réponse, dit-il, quand on n'en abuse pas."),
    ], { trust: 7, affection: 1, flags: ["valurn-accountability"] }),
    Q("sva80-side", "Prendre son parti, sans maquiller ce qu'il a fait.", "audace", [
      P("Vous l'avez sauvé sans lui demander. Il a le droit de vous en vouloir. Et moi, je reste de votre côté."),
      V("Les deux à la fois ? Vous êtes d'une malhonnêteté morale très rafraîchissante.", "amused"),
      V("Non. Vous avez raison. On peut avoir tort et compagnie. C'est nouveau pour moi, la compagnie."),
    ], { affection: 4, trust: 5, flags: ["valurn-accountability"] }),
  ], ["knows_valurn_current_accountability"]),

  S(20, "secret-valurn-bad-client", "Le mauvais client", [
    N("Valurn grimace devant un vendeur de cages à oiseaux. Vous lui demandez pourquoi. Il soupire comme un homme qui va perdre un procès."),
    V("Il y a trois ans, j'ai vendu à un baron le nom exact de l'amant de sa femme. Très cher. Information parfaite."),
    V("Il a provoqué l'amant en duel. L'amant était le maître d'armes du baron. Le baron a perdu une oreille, sa femme et son maître d'armes le même après-midi.", "annoyed"),
    V("Et il est venu me demander un remboursement. Pour défaut de conseil. Il a gagné devant le tribunal des marchands. J'ai dû payer, avec intérêts, en cages à oiseaux. C'était sa monnaie."),
  ], [
    Q("svbc-laugh", "Rire franchement.", "audace", [
      N("Vous riez. Il tient bon trois secondes, puis rit aussi, à contrecœur."),
      V("Je déteste perdre. Je déteste encore plus que ce soit drôle.", "amused"),
    ], { affection: 4 }),
    Q("svbc-lesson", "Lui demander s'il prévient maintenant ses clients de ce qu'ils risquent.", "lucidite", [
      V("Je leur fais signer une clause d'oreilles. C'est très efficace.", "amused"),
    ], { trust: 3, affection: 1 }),
  ], ["knows_valurn_bad_client"]),

  S(40, "secret-valurn-limit", "La limite du savoir", [
    N("Il vous demande à revoir votre fragment, à la lumière du jour. Il le tourne longtemps, puis vous le rend sans un mot d'esprit."),
    V("Je vais vous décevoir, et je déteste ça plus que vous. J'y reconnais des structures que je connais. Des formes qu'on trouve dans certains pactes."),
    V("Ça ne veut pas dire que votre portail vient de chez nous. Une ressemblance, c'est une ressemblance. Les escrocs se ressemblent aussi entre eux, et ils ne sont pas tous cousins.", "neutral"),
    V("Si quelqu'un vous jure qu'il sait d'où vous venez en regardant ça, c'est qu'il veut vous vendre quelque chose. Même moi."),
  ], [
    Q("svlm-thanks", "Le remercier de ne pas inventer de réponse.", "sangFroid", [
      V("Ne me remerciez pas. Je refuse seulement de me tromper en public.", "neutral"),
    ], { trust: 5 }),
    Q("svlm-push", "Lui demander ce qu'il faudrait pour en savoir plus.", "lucidite", [
      V("Un texte de comparaison que je n'ai pas, et quelqu'un de plus savant que moi que je n'aime pas. Les deux sont loin. Je vous le dirai si l'un des deux s'approche.", "neutral"),
    ], { trust: 4, affection: 1 }),
  ], ["knows_valurn_knowledge_limit"]),

  S(60, "secret-valurn-names", "Les noms qu’on n’oublie pas", [
    N("Au marché, une vieille femme passe sans le voir. Valurn murmure : « Deux sucres, jamais de lait, une fille à Forthaven, déteste le mot cher. »"),
    P("Vous la connaissez ?"),
    V("Je lui ai vendu une adresse il y a six ans. Une seule fois. Je ne la reverrai sans doute jamais.", "neutral"),
    V("Je retiens tout. Le chien de l'un, la toux d'un autre, la couleur qu'un troisième déteste. C'est utile. On ne sait jamais qui reviendra."),
    P("Et ceux qui ne reviennent pas ?"),
    V("Je les retiens quand même. Ne me demandez pas pourquoi. Je dirai que c'est du calcul.", "away"),
  ], [
    Q("svnm-calc", "« C'est du calcul, alors. »", "audace", [
      V("Exactement. Merci de me croire si mal.", "amused"),
    ], { affection: 3, trust: 1 }),
    Q("svnm-me", "Lui demander ce qu'il retiendra de vous.", "sangFroid", [
      V("Que vous lisez les pliures avant l'encre. Et que vous ne finissez jamais votre pain. Je ne sais pas encore quoi faire du second.", "charming"),
    ], { affection: 3, desire: 1 }),
    Q("svnm-why", "Lui faire remarquer qu'il prête attention à des gens qui ne lui rapporteront rien.", "lucidite", [
      V("Vous voulez que j'avoue une tendresse. Je n'avoue rien. Je collectionne.", "neutral"),
    ], { trust: 4 }),
  ], ["knows_valurn_client_memory"]),

  S(60, "secret-valurn-pleasures", "Les plaisirs du mortel", [
    N("Valurn vous traîne dans une petite salle de théâtre du Croissant où l'on joue une pièce effroyable. Il a payé deux places au premier rang."),
    V("Je viens tous les mois. Les comédiens sont mauvais avec une sincérité admirable. Personne ne ment, ici, sauf le texte."),
    V("J'aime la musique de bal, les étoffes bien coupées, les pâtisseries qui font pleurer, et les pièces ratées. Chez moi, on ne gaspillait rien. Ici, je gaspille avec méthode.", "amused"),
    N("Sur scène, un acteur oublie son texte et improvise un duel avec un rideau. Valurn applaudit seul, debout."),
  ], [
    Q("svpl-taste", "Défendre un goût à vous, aussi peu raisonnable.", "audace", [
      P("Moi, j'aime les chansons tristes jouées trop vite."),
      V("C'est abject. Vous m'en chanterez une. Nous comparerons nos hontes.", "charming"),
    ], { affection: 4, desire: 1 }),
    Q("svpl-why", "Lui demander ce qu'il trouve dans les pièces ratées.", "lucidite", [
      V("Le moment où quelqu'un se trompe devant tout le monde et continue. J'admire. Je ne sais pas le faire.", "neutral"),
    ], { trust: 4, affection: 1 }),
    Q("svpl-stay", "Rester jusqu'à la fin et applaudir avec lui.", "sangFroid", [
      N("Vous vous levez aussi. Deux personnes debout dans une salle vide. Le comédien salue, bouleversé."),
      V("Vous venez de faire le plus beau jour de sa carrière. C'est très irresponsable.", "amused"),
    ], { affection: 3, trust: 2 }),
  ], ["knows_valurn_mortal_tastes"]),
];

const done = (n: number) => `valurn-q${n}-done`;

export const VALURN_LETTERS: LetterTemplate[] = [
  {
    id: "letter-valurn-scandal", character: "valurn", subject: "Une proposition scandaleuse", delivery: "Un billet glissé dans le cornet d'amandes que Hesse vous tend au marché.", minDay: 3, minStage: 0, requiresFlags: [done(1)],
    body: ["J'ai deux paris en cours et je ne parviens pas à les départager. Le premier : Péronne a teint sa barbe. Le second : le chat du relieur sait lire.", "Vous êtes la seule personne d'Al'Gratal sans intérêt dans l'une ou l'autre affaire. Tranchez. Je ne paierai rien, mais je vous en voudrai avec élégance."],
    signature: "Valurn, parieur en détresse",
    replies: [
      { id: "vls-provoke", label: "Répondre que vous pariez sur les deux, et que vous ouvrez les mises.", response: "Il répond : « Vous ouvrez un marché sur mes marchés. C'est de la concurrence déloyale et je suis ému. »", effects: { affection: 3 } },
      { id: "vls-analyse", label: "Démontrer, preuves à l'appui, que le chat ne sait pas lire mais que Péronne ment.", response: "Un second billet : « Votre démonstration est irréfutable. Péronne nie tout. Le chat aussi. »", effects: { trust: 2, affection: 1 } },
      { id: "vls-refuse", label: "Refuser avec esprit : vous ne jugez pas les barbes.", response: "« Lâcheté magnifique. Je l'encadre. »", effects: { trust: 2 } },
    ],
  },
  {
    id: "letter-valurn-accounts", character: "valurn", subject: "Le compte est bon", delivery: "Un état comptable relié de ruban, apporté par un garçon de courses très fier de sa mission.", minDay: 4, minStage: 0, requiresFlags: [done(2)],
    body: ["Ci-joint votre part de la réception de Dame Vayre : trois deniers et le souvenir d'un sire Aubrel humilié.", "Je précise, par goût du détail, que votre part réelle était de deux deniers. J'en ai ajouté un. Ou j'ai négocié plus que je ne vous l'ai dit. Je vous laisse deviner laquelle de ces deux phrases est vraie."],
    signature: "Valurn, comptable approximatif", attachedItem: undefined,
    replies: [
      { id: "vla-accept", label: "Accepter la part sans poser de question.", response: "« Vous acceptez mes cadeaux sans enquête. C'est dangereux, et j'aime ça. »", effects: { affection: 2, coins: 3 } },
      { id: "vla-audit", label: "Exiger le détail exact des comptes.", response: "Un second état arrive, d'une précision maniaque. Il avait bien négocié plus. Il vous verse la différence, sans un mot d'esprit.", effects: { trust: 4, coins: 4 } },
      { id: "vla-terms", label: "Proposer de nouvelles conditions pour les prochaines affaires.", response: "« Moitié-moitié, comptes ouverts. Vous me ruinez en transparence. Accepté. »", effects: { trust: 3, flags: ["valurn-open-books"] } },
    ],
  },
  {
    id: "letter-valurn-debt", character: "valurn", subject: "Dette inexistante", delivery: "Une carte vierge, retrouvée dans votre poche. Valurn a toujours eu les doigts plus agiles que les gens qu'il croise.", minDay: 5, minStage: 0, requiresFlags: [done(4)],
    body: ["Vous m'avez aidé chez Odile. J'aurais pu vous envoyer une pièce, une promesse ou un contrat tordu.", "Je vous envoie une carte vierge. Écrivez ce que vous voulez dessus, ou rien. Si vous ne répondez pas, je survivrai avec une élégance offensante."],
    signature: "Valurn",
    replies: [
      { id: "valurn-free", label: "Garder la carte vierge, sans rien y écrire.", response: "Une seconde carte arrive : « Vous gardez le vide. Première règle respectée. Inquiétant. »", effects: { trust: 3, affection: 2 } },
      { id: "valurn-bluff", label: "Écrire une fausse clause au dos pour le provoquer.", response: "Il renvoie la carte barrée de rouge : « Très mauvais contrat. Excellente conversation. »", effects: { affection: 4 } },
      { id: "valurn-odile", label: "Écrire : « Pour Odile, pas pour moi. »", response: "Il ne répond pas. Le lendemain, Hesse vous dit qu'il a fait réparer la gouttière du comptoir d'Odile, sans signer.", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-valurn-correspondent", character: "valurn", subject: "Un correspondant charmant", delivery: "Une copie d'une lettre de Thazran, annotée dans les marges à l'encre verte.", minDay: 5, minStage: 0, requiresFlags: [done(3)], excludesFlags: ["valurn-thazran-irritated"],
    body: ["Copie conforme. Thazran : « Ta faveur est rédigée comme une prison bien éclairée. J'accepte, fils de Bhaal. » [En marge : il adore les prisons bien éclairées.]", "Thazran : « Ton associé a une écriture d'humain. Garde-le. » [En marge : c'est un compliment, chez lui. Ne lui répondez surtout pas.]"],
    signature: "Valurn, annotateur",
    replies: [
      { id: "vlc-answer", label: "Lui répondre quand même, à Thazran, par une politesse parfaite.", response: "Valurn transmet. Thazran répond : « Insolence humaine. Prix doublé la prochaine fois. » Valurn ajoute : « Il vous aime. »", effects: { affection: 3, flags: ["valurn-thazran-knows-player"] } },
      { id: "vlc-silence", label: "Suivre son conseil et ne pas répondre.", response: "« Sage. Les correspondants démoniaques sont comme les chats : ils viennent quand on ne les appelle pas. »", effects: { trust: 3 } },
    ],
  },
  {
    id: "letter-valurn-correspondent-sour", character: "valurn", subject: "Un correspondant charmant", delivery: "Une copie d'une lettre de Thazran, roussie au coin, annotée à l'encre verte.", minDay: 5, minStage: 0, requiresFlags: [done(3), "valurn-thazran-irritated"],
    body: ["Copie conforme. Thazran : « Tu m'as fait travailler pour rien, fils de Bhaal. Ta mère payait mieux. » [En marge : elle ne l'a jamais payé. C'est une manière de parler.]", "Thazran : « Je retiens. » [En marge : il retient tout. Moi aussi. Nous sommes une famille de comptables.]"],
    signature: "Valurn, un peu vexé",
    replies: [
      { id: "vlcs-repair", label: "Proposer de payer Thazran pour solder l'irritation.", response: "« Vous voulez acheter la paix avec un démon. Charmant, et vain. Il garde la rancune ET l'argent. Je refuse, pour votre bien. »", effects: { trust: 3 } },
      { id: "vlcs-laugh", label: "Répondre que la rancune d'un comptable est un compliment.", response: "« Je lui transmettrai. Il la classera. »", effects: { affection: 3 } },
    ],
  },
  {
    id: "letter-valurn-evening", character: "valurn", subject: "Une soirée interrompue", delivery: "Un billet laissé à l'accueil de votre auberge, plié en forme d'oiseau maladroit.", minDay: 4, minStage: 0, requiresFlags: ["valurn-invite-declined"],
    body: ["Vous n'êtes pas venu·e. Je ne vous le reproche pas. J'ai bu votre part, ce qui était une forme de deuil raisonnable.", "Une autre fois, si vous voulez. Je ne fixe pas la date. Je déteste attendre, mais je peux apprendre, à condition qu'on ne me regarde pas faire."],
    signature: "Valurn",
    replies: [
      { id: "vle-yes", label: "Répondre qu'une autre fois vous plairait.", response: "« Noté. Sans date. Sans pénalité. Je deviens méconnaissable. »", effects: { affection: 3 } },
      { id: "vle-friend", label: "Répondre en ami·e : vous aviez autre chose, et ce n'est rien.", response: "« Rien, donc. J'aime beaucoup ce rien. »", effects: { trust: 3 } },
      { id: "vle-tease", label: "Répondre que vous aimiez l'idée de le faire attendre.", response: "« Cruel. Continuez. »", effects: { affection: 2, desire: 2 } },
    ],
  },
  {
    id: "letter-valurn-truth", character: "valurn", subject: "Aucune formulation avantageuse", delivery: "Le pli arrive par messager ordinaire, sans cachet ni parfum. Détail inhabituel chez Valurn.", minDay: 8, minStage: 0, requiresKnowledge: ["knows_valurn_current_accountability"], requiresFlags: ["valurn-accountability"],
    body: ["J'ai cherché une manière d'écrire ce que j'ai fait à mes correspondants pendant cette affaire. Bram, Odile, le greffier. Une manière qui me rende habile, ou nécessaire, ou drôle.", "Je n'en ai pas trouvé. J'ai pris des décisions à leur place. Certaines étaient bonnes. Je continuerai d'en prendre. Je vous écris pour qu'au moins une personne sache que je le sais."],
    signature: "Valurn",
    replies: [
      { id: "valurn-no-absolution", label: "Le savoir n'efface rien. Il permet de faire autrement la prochaine fois.", response: "Il répond : « Une perspective atrocement adulte. Je vais tenter de la supporter. »", effects: { trust: 5 } },
      { id: "valurn-witness", label: "Répondre simplement : « Je le sais aussi. »", response: "Pas de réponse. Le lendemain, au marché, il vous salue de loin sans plaisanter. C'est rare.", effects: { trust: 4, affection: 2 } },
    ],
  },
  // Courriers réactifs à la conclusion de la quête 7.
  {
    id: "letter-valurn-after-accord", character: "valurn", subject: "Une créance qui dort", delivery: "Un billet très court, sur papier de Halbrecht. Valurn trouve cela drôle.", minDay: 6, minStage: 0, requiresFlags: ["valurn-outcome:accord"],
    body: ["Corvin m'apporte chaque semaine ce que je lui dicte. Halbrecht paie pour mes mensonges. Tout le monde est content, sauf moi, qui m'ennuie.", "Si un jour il recommence, je le saurai. Je n'ai rien d'autre à vous dire, je voulais seulement que vous sachiez que la porte est fermée à clé, pas murée."],
    signature: "Valurn",
    replies: [
      { id: "vlaa-watch", label: "Lui conseiller de ne pas laisser cette créance dormir trop longtemps.", response: "« Les créances dorment mieux que moi. Mais j'entends. »", effects: { trust: 3 } },
      { id: "vlaa-ok", label: "Le féliciter de son ennui.", response: "« Merci. L'ennui est ma récompense la plus coûteuse. »", effects: { affection: 2 } },
    ],
  },
  {
    id: "letter-valurn-after-revelation", character: "valurn", subject: "Deux chaises vides", delivery: "Une lettre longue, ce qui ne lui ressemble pas, apportée en main propre par Hesse.", minDay: 6, minStage: 0, requiresFlags: ["valurn-outcome:revelation"],
    body: ["Deux correspondants ont cessé d'écrire. Halbrecht m'a fait traiter de menteur au marché aux grains, ce qui est exact et désagréable. Iriana m'a envoyé un mot : « Enfin. »", "Je ne sais pas encore si j'ai bien fait. Je sais que tout le monde, maintenant, sait ce que je vaux. C'est une sensation curieuse, comme marcher sans manteau."],
    signature: "Valurn, sans manteau",
    replies: [
      { id: "vlar-proud", label: "Lui dire que vous êtes fier·e de lui.", response: "« N'écrivez pas ce genre de choses. Je vais devoir les relire. »", effects: { affection: 3, trust: 2 } },
      { id: "vlar-cost", label: "Reconnaître avec lui que ce choix a coûté.", response: "« Oui. Merci de ne pas dire le contraire. »", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-valurn-after-counter", character: "valurn", subject: "La saison de Halbrecht", delivery: "Un billet de victoire, sur un papier trop beau, avec un post-scriptum plus petit que le reste.", minDay: 6, minStage: 0, requiresFlags: ["valurn-outcome:contremarche"],
    body: ["Halbrecht a vendu ses entrepôts d'hiver. Je suis d'une humeur insupportable et j'ai commandé trois gilets.", "P.-S. Odile ne m'ouvre plus. Corvin a quitté la ville. Je ne regrette rien, je vous le dis pour que vous le sachiez, pas pour que vous me croyiez."],
    signature: "Valurn, triomphant",
    replies: [
      { id: "vlac-ps", label: "Ne répondre qu'au post-scriptum.", response: "Il ne répond pas. Un gilet arrive chez vous, à votre taille, sans billet.", effects: { trust: 3, affection: 2 } },
      { id: "vlac-win", label: "Le féliciter pour la victoire, sans détour.", response: "« Enfin quelqu'un qui sait applaudir. »", effects: { affection: 3 } },
    ],
  },
  // Courriers de tiers : fragments du monde, sans indice réservé au mini-jeu.
  {
    id: "letter-valurn-hesse", character: "valurn", subject: "Trois amandes", delivery: "Un cornet de papier gras, griffonné au dos par Hesse, la marchande de fruits secs.", minDay: 4, minStage: 0, requiresFlags: [done(1)],
    body: ["Messire Saël vous a choisi·e. Je préviens : il ne paie jamais ses amandes, mais il connaît le nom de ma fille et il lui a trouvé un apprentissage chez un orfèvre.", "Ne lui dites pas que je vous l'ai dit. Il dirait que c'était un placement."],
    signature: "Hesse, fruits secs, allée des Épices",
    replies: [
      { id: "vlh-pay", label: "Payer à Hesse les trois amandes de Valurn.", response: "Hesse rit et vous rend une poignée de figues : « Maintenant vous êtes deux à me devoir. »", effects: { affection: 2, coins: -1 } },
      { id: "vlh-keep", label: "Garder le secret.", response: "Hesse hoche la tête quand vous repassez. Une alliance de marché, muette.", effects: { trust: 2 } },
    ],
  },
  {
    id: "letter-valurn-odile", character: "valurn", subject: "Pour l'associé·e de Saël", delivery: "Un pli relié à la main, colle de poisson comprise, déposé par la relieuse du Croissant.", minDay: 5, minStage: 0, requiresFlags: [done(4)],
    body: ["Je ne sais pas ce que vous êtes pour lui, et je ne veux pas le savoir. Jory va bien. Il travaille aux docks de Forthaven sous un autre nom.", "Le chat s'appelle Comptable. C'est Saël qui l'a baptisé. Si vous le répétez, je nierai."],
    signature: "O. Varrasque, reliures et plis",
    replies: [
      { id: "vlo-thanks", label: "La remercier pour Jory, simplement.", response: "Pas de réponse. Votre prochain carnet, acheté chez elle, est relié gratuitement.", effects: { trust: 3 } },
      { id: "vlo-cat", label: "Demander des nouvelles du chat.", response: "Elle répond par un dessin du chat, très mauvais, signé « Comptable ».", effects: { affection: 2 } },
    ],
  },
  {
    id: "letter-valurn-corvin", character: "valurn", subject: "Sans formule", delivery: "Un billet sans cachet, glissé sous votre porte. L'écriture tremble un peu.", minDay: 7, minStage: 0, requiresFlags: [done(7)], excludesFlags: ["valurn-outcome:contremarche"],
    body: ["Ma mère est sortie du registre de Halbrecht. Je ne sais pas encore si je dois quelque chose à Saël, et je crois qu'il ne le sait pas non plus.", "Je vous écris parce que vous étiez dans la pièce. C'est tout."],
    signature: "C. Lisse",
    replies: [
      { id: "vlcv-free", label: "Lui répondre qu'il ne doit rien à personne.", response: "Corvin ne répond pas. Valurn, en l'apprenant, dit seulement : « Vous lui avez fait le cadeau que je n'ai pas su faire. »", effects: { trust: 3 } },
    ],
  },
];

const IL = (speaker: string, text: string, mood?: string) => L(speaker, text, mood);

export const VALURN_INVITATIONS: InvitationTemplate[] = [
  {
    id: "invite-valurn-market", character: "valurn", title: "Un pari sans mise", message: "Valurn vous cherche au Grand Marché pour départager des objets parfaitement inutiles.", location: "algratal", spot: "algratal-market", period: "matin", minDay: 4, minStage: 0, expiresAfter: 6, requiresFlags: [done(1)],
    declineText: "Valurn achète tout le lot et vous écrit qu'il vous en veut, avec une tendresse administrative. Rien d'autre.", declineEffects: { flags: ["valurn-invite-declined"] },
    intro: [
      N("Sur un étal de bric-à-brac, Valurn a aligné trois objets : une cuillère qui prédit la pluie, une clochette qui refuse de sonner, un dé à sept faces."),
      V("Le marchand prétend que la cuillère prédit la pluie. Elle ne la prédit que lorsqu'elle est mouillée. C'est d'une exactitude scandaleuse.", "amused"),
      IL("Marchand", "Le dé est garanti. Il tombe toujours sur une face.", "neutral"),
      V("Choisissez. Je n'achète que ce que vous désignez. Aucune mise. Je veux juste voir comment vous choisissez quand rien ne compte."),
    ],
    choices: [
      Q("ivm-a", "Choisir la clochette et lui inventer une fonction.", "audace", [P("La clochette détecte les conversations ennuyeuses. Regardez : elle se tait."), V("Elle se tait parce que vous parlez. C'est donc un compliment. Je la prends.", "charming"), N("Il paie le marchand double, pour le spectacle.")], { affection: 3 }),
      Q("ivm-l", "Renégocier : obtenir le dé en échange de la cuillère.", "lucidite", [N("Dix minutes d'arguments absurdes. Le marchand cède, épuisé, et vous donne le dé contre la cuillère et un sourire."), V("Vous avez fait un mauvais commerce avec un talent exceptionnel. Je suis jaloux.", "amused")], { trust: 2, affection: 1 }),
      Q("ivm-s", "Renverser le jeu : lui demander lequel il regretterait de laisser.", "sangFroid", [V("La question est déloyale. La clochette. Elle me ressemble : très décorative, et elle ne répond pas quand on l'appelle.", "neutral"), N("Il l'achète. Vous la retrouverez, plus tard, posée sur sa table de travail.")], { trust: 3 }),
    ],
  },
  {
    id: "invite-valurn-client", character: "valurn", title: "Le client invisible", message: "Un billet : « Comptoir des Trois Bougies, ce soir. Un faux acheteur rôde parmi les vrais. Trouvez-le avant moi. »", location: "algratal", spot: "algratal-streets", period: "soirée", minDay: 5, minStage: 0, expiresAfter: 6, requiresFlags: [done(2)],
    declineText: "Valurn vous écrit le lendemain qu'il a trouvé le faux acheteur tout seul, et que c'était beaucoup moins drôle. Pas un mot de plus.", declineEffects: { flags: ["valurn-invite-declined"] },
    intro: [
      N("Le comptoir des Trois Bougies est bondé. Valurn vous attend au bout du comptoir, dos au mur, avec deux bols de bouillon."),
      V("Quelqu'un ici se fait passer pour un acheteur de soieries. Il n'achètera rien : il écoute. Je sais qui l'envoie. Je ne sais pas lequel c'est."),
      V("Jeu d'enfants. Personne n'est en danger. Le premier qui le trouve choisit le dessert."),
    ],
    choices: [
      Q("ivc-talk", "Engager la conversation avec les acheteurs jusqu'à trouver celui qui ne connaît rien aux soieries.", "lucidite", [N("Vous parlez de trames avec trois personnes. La quatrième confond la soie et le lin, puis se tait trop vite."), V("Vous l'avez fait parler de tissu. C'est cruel. Le dessert est à vous.", "amused")], { trust: 3 }),
      Q("ivc-clue", "Repérer ses chaussures : trop propres pour un marchand qui vient du port.", "lucidite", [V("Les chaussures. Évidemment. Je regardais les mains. Je déteste perdre au détail.", "annoyed"), N("Il commande deux desserts, par rancune.")], { trust: 2, affection: 2 }),
      Q("ivc-trap", "Lui tendre un piège comique : annoncer très fort une vente de soie fictive à prix ridicule.", "audace", [N("Un seul client se retourne, carnet en main. Les vrais marchands éclatent de rire."), V("Vous venez de ruiner sa soirée et la réputation de la soie. Magnifique.", "charming")], { affection: 4 }),
    ],
  },
  {
    id: "invite-valurn-revenge", character: "valurn", title: "La revanche que tu n'as pas demandée", message: "« Terrasse de l'auberge du Forestier. J'ai perdu une partie, ou vous croyez que je l'ai perdue. Je viens en chercher une autre. »", location: "forestier", spot: "forestier-inn", period: "apres-midi", minDay: 6, minStage: 0, expiresAfter: 8, requiresFlags: [done(5)],
    declineText: "Il répond : « Vous refusez ma revanche. Je la garde au chaud. Elle ne refroidit pas. » Et c'est tout.", declineEffects: { flags: ["valurn-invite-declined"] },
    intro: [
      N("Sur la terrasse du Forestier, Valurn a disposé un jeu de palets de bois et trois pâtisseries au piment. Il porte des gants de cuir, ce qui est déjà une provocation."),
      V("Au salon, vous m'avez eu. Ou pas. Peu importe. Je veux une revanche que vous n'avez pas demandée, sur un terrain que je ne connais pas."),
      V("Palets ou pâtisseries. Le perdant porte le panier jusqu'à la route."),
    ],
    choices: [
      Q("ivr-palets", "Les palets, en plein air.", "audace", [N("Il lance mal, avec beaucoup de style. Vous gagnez de deux points. Il exige une troisième manche, la perd aussi."), V("Je porte le panier. Ne le racontez à personne, surtout pas à Hesse.", "annoyed")], { affection: 4 }),
      Q("ivr-pastries", "Le défi gastronomique.", "sangFroid", [N("Deux pâtisseries chacun. À la troisième, il pleure sans perdre son sourire. Vous aussi."), V("Égalité. Nous portons le panier à deux. C'est une humiliation partagée, ma préférée.", "amused")], { affection: 3, trust: 1 }),
      Q("ivr-decline", "Refuser la partie et proposer simplement de marcher jusqu'à la rivière.", "sangFroid", [V("Vous refusez ma revanche et m'offrez une promenade. Je ne sais jamais quoi faire de vous.", "neutral"), N("Vous marchez. Il ne parle pas du salon. Vous non plus.")], { trust: 3 }),
    ],
  },
];
