import type { ChoiceData, DialogueLine, Effects, RouteScene, StatKey } from "./game-data";

/**
 * Valurn Saël · Acte I · « Les trois mensonges du grand parieur ».
 * Sept quêtes autonomes ouvertes après `campaign-imperial-audience`.
 * Créations CA : réseau d'informateurs, Odile Varrasque, Corvin Lisse,
 * maison Halbrecht, Dame Ysolde Vayre, Bram, Maître Péronne, Hesse.
 * Voir docs/VALURN_SOURCE_REGISTER.md. Aucun lieu verrouillé : tout se joue
 * à Al'Gratal.
 */

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const T = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({
  id, text, stat, response, effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } },
});

export const VALURN_QUEST_IDS = ["valurn-q1", "valurn-q2", "valurn-q3", "valurn-q4", "valurn-q5", "valurn-q6", "valurn-q7"] as const;
export type ValurnQuestId = typeof VALURN_QUEST_IDS[number];

/** Anciennes scènes valurn-0..4 : remplacées, jamais confondues avec le nouveau fil. */
export const VALURN_LEGACY_ROUTE_IDS = ["valurn-0", "valurn-1", "valurn-2", "valurn-3", "valurn-4"] as const;

/** Nombre de quêtes du nouveau fil réellement vécues, dans l'ordre. */
export function valurnQuestStage(history: readonly string[]) {
  let stage = 0;
  while (stage < VALURN_QUEST_IDS.length && history.includes(VALURN_QUEST_IDS[stage])) stage += 1;
  return stage;
}

const scene = (stage: number, title: string, background: string, intro: DialogueLine[], choices: ChoiceData[], cast: string[] = ["valurn"]): RouteScene => ({
  id: VALURN_QUEST_IDS[stage], character: "valurn", stage, dayMin: 3, title, location: "algratal", background, mood: "charming", intro, choices, cast,
});

export const VALURN_QUESTS: RouteScene[] = [
  scene(0, "La première mise", "market", [
    N("Au Grand Marché, l'odeur de cannelle et de cuir mouillé monte des étals. Valurn est assis sur le comptoir d'un marchand d'épices, ce que le marchand n'a manifestement pas autorisé."),
    V("Vous voilà. J'avais parié que vous mettriez moins de trois jours à revenir traîner près des puissants. J'ai perdu : vous êtes venu·e au marché."),
    T("Maître Péronne", "Messire Saël, mon comptoir n'est pas un banc.", "annoyed"),
    V("Il l'est devenu par usage, Péronne. C'est ainsi que naît le droit coutumier.", "amused"),
    N("Il descend tout de même, époussette un manteau impeccable et vous rejoint d'un pas qui occupe toute l'allée."),
    V("Au palais, j'ai regardé votre fragment trop longtemps. Iriana l'a remarqué. Vous aussi. J'y ai reconnu une grammaire que je fréquente, et aucune phrase. Cela m'agace."),
    V("Mais je ne vous ai pas fait venir pour le fragment. Je n'ai rien de sérieux à vous en dire, et je déteste parler pour remplir un silence."),
    N("Il sort trois billets pliés de sa manche. Trois écritures, trois papiers, trois récits d'une même vente : une caisse de sel noir passée la veille par le Croissant."),
    V("Trois personnes m'ont vendu ce matin la même transaction. Le marchand, le porteur, le témoin. Chacune jure une heure différente, un acheteur différent, un prix différent."),
    P("Quelqu'un ment."),
    V("Deux, au minimum. Et l'un de ces billets est passé par mes propres gens. Je voudrais savoir lequel avant que le reste de mon réseau apprenne que je me pose la question."),
    T("Hesse", "Il vous a dit qu'il me doit encore trois amandes ?", "amused"),
    N("La marchande de fruits secs de l'étal voisin ne baisse pas la voix. Péronne, lui, a les bras croisés et ne regarde pas Valurn."),
    V("Hesse m'adore. Péronne me tolère pour des raisons fiscales. Vous voyez : une réputation est un tissu de malentendus soigneusement entretenus."),
    V("Voici mon offre. Vous avez un visage que mes contacts ne connaissent pas. Prêtez-le-moi quelques jours. En échange, je lis pour vous ce que je sais lire en matière démoniaque, je vous ouvre deux ou trois portes du marché, et nous partagerons ce qu'il y aura à gagner."),
    V("Je ne vous promets pas de vous renvoyer chez vous. Je ne sais même pas où se trouve chez vous. Je trouve honnête de le préciser avant que vous ne l'espériez.", "neutral"),
    N("Il pose un denier sur le comptoir de Péronne, entre les trois billets."),
    V("Et un petit pari pour commencer, puisque nous sommes au marché : dites-moi lequel de ces trois papiers m'a menti. Si vous trouvez, la pièce est à vous."),
  ], [
    Q("vq1-rules", "Jouer selon ses règles et chercher le coup caché dans les billets.", "lucidite", [
      N("Vous étalez les trois billets côte à côte. L'encre diffère, le papier aussi. Sur deux d'entre eux, au pli inférieur, la même petite entaille en V a été faite à l'ongle."),
      P("Le porteur et le témoin ne se connaissent pas, d'après leurs récits. Pourtant leurs billets ont été pliés par la même main."),
      N("Valurn se penche. Pendant une fraction de seconde, il ne bouge plus du tout."),
      V("C'est un signe de transmission. Le mien. Mes gens marquent ainsi ce qu'ils me font passer.", "surprised"),
      P("Alors deux de vos propres gens vous ont vendu deux histoires incompatibles."),
      V("Ou quelqu'un connaît mon signe. Les deux possibilités sont insultantes. La seconde est plus intéressante."),
      N("Il fait glisser le denier vers vous du bout de l'index, sans cérémonie."),
      V("Vous avez gagné. Ne prenez pas l'habitude : j'ai horreur des partenaires qui gagnent en public."),
    ], { trust: 4, affection: 2, coins: 1, flags: ["valurn-q1-choice:rules"], knowledge: ["knows_valurn_network_mark"] }),
    Q("vq1-coop", "Refuser le pari, mais accepter une coopération aux termes clairs.", "sangFroid", [
      P("Je ne parie pas. Mais je veux bien regarder vos billets, si nous fixons maintenant ce que chacun y met."),
      V("Une personne qui négocie les termes avant le plaisir. Péronne, prenez des notes, il existe encore des gens sérieux.", "amused"),
      T("Maître Péronne", "Je n'ai jamais refusé un contrat qu'il fallait lire deux fois.", "neutral"),
      P("Je regarde, je vous dis ce que je vois. Vous ne donnez mon nom à personne, et je peux arrêter quand je veux."),
      V("Accordé. Je note que vous ne demandez rien pour vous. C'est soit très noble, soit très bien calculé."),
      N("Vous examinez les billets. Valurn vous laisse faire, mains dans le dos, et c'est vous qui trouvez la double entaille au pli du papier."),
      V("Mon propre signe. Sur deux récits qui se contredisent. Vous voyez pourquoi il me fallait quelqu'un que mes gens ne connaissent pas.", "neutral"),
    ], { trust: 6, flags: ["valurn-q1-choice:coop"], knowledge: ["knows_valurn_network_mark"] }),
    Q("vq1-turn", "Retourner le défi devant les marchands : à lui de deviner lequel de vous deux ment.", "audace", [
      P("Nouvelle règle. Je vous dis une chose vraie et une chose fausse sur ces billets. Si vous vous trompez, vous payez les amandes de Hesse."),
      T("Hesse", "Avec les intérêts.", "amused"),
      V("Vous retournez la table devant témoins. Péronne, c'est de l'incitation au désordre.", "amused"),
      P("Ces deux-là ont été pliés par la même main. Et celui-ci a été écrit avant l'aube."),
      N("Valurn regarde les billets, puis vous. Il hésite assez longtemps pour que Hesse commence à compter sur ses doigts."),
      V("Le pliage est vrai. L'heure est fausse : l'encre a coulé, elle a été écrite sous la pluie de midi."),
      P("Raté. Les deux sont vraies. Il a plu avant l'aube aussi."),
      N("Hesse éclate de rire. Valurn sort trois piécettes et les lui tend avec une révérence de cour."),
      V("Vous venez de me faire perdre devant une créancière. Je vous en voudrai jusqu'au déjeuner. Le pliage, en revanche, est mon signe de transmission. Et c'est beaucoup moins drôle.", "annoyed"),
    ], { affection: 5, trust: 2, flags: ["valurn-q1-choice:turned"], knowledge: ["knows_valurn_network_mark"] }),
    Q("vq1-risks", "Demander d'abord le détail des risques de cette mission.", "lucidite", [
      P("Avant de regarder quoi que ce soit : qui risque quoi, si je mets mon nez là-dedans ?"),
      V("Excellente question, rarement posée. Vous, presque rien : on vous prendra pour un·e curieux·se. Mes informateurs, davantage, si je me trompe sur l'un d'eux."),
      P("Et vous ?"),
      V("Ma réputation. Elle est solide, mais elle vit de l'idée que je sais avant les autres. Si l'on apprend que je me fais vendre des fables par mes propres gens, elle se dévalue comme une monnaie de province.", "neutral"),
      N("Il le dit sans plaisanterie. Puis il vous tend les billets, comme on tend une pièce dont on vient d'avouer la valeur."),
      N("Vous trouvez, au pli, la double entaille en V. Valurn hoche la tête une seule fois."),
      V("Mon signe. Vous savez maintenant ce que vous risquez à le reconnaître."),
    ], { trust: 5, affection: 1, flags: ["valurn-q1-choice:risks"], knowledge: ["knows_valurn_network_mark"] }),
  ]),

  scene(1, "Un homme de relations", "ballroom", [
    N("La réception de Dame Ysolde Vayre occupe trois salons d'un hôtel de la rue des Tanneurs. La petite noblesse d'Al'Gratal y vend des chevaux, des mariages et des rumeurs, dans cet ordre selon l'heure."),
    V("Règle de la soirée : on ne pose aucune question. On laisse les gens répondre à celles qu'ils croient deviner."),
    P("Et qu'est-ce que je cherche ?"),
    V("Deux choses. Qui a acheté le sel noir, et par quel intermédiaire. Quelqu'un ici le sait, et sera ravi de nous le dire si nous avons l'air de nous en moquer."),
    N("Dame Vayre vient à lui les mains tendues et le regard d'une collectionneuse devant une pièce rare."),
    T("Dame Vayre", "Messire Saël ! Je dis partout que vous êtes mon démon apprivoisé. Personne ne me croit.", "amused"),
    V("Personne n'a tort, madame. Vous êtes d'une cruauté exquise.", "charming"),
    N("Plus loin, un homme en drap gris foncé ne le quitte pas des yeux. Valurn vous le désigne sans tourner la tête."),
    V("Le sire Aubrel. Il me hait poliment depuis que j'ai lu un contrat qu'il aurait préféré qu'on lise moins bien. Je lui dois une politesse parfaite. Ça le rend fou.", "neutral"),
    N("Valurn passe d'un groupe à l'autre. On le reçoit en curiosité ici, en danger là. Il traite les deux avec la même grâce, et vous remarquez qu'il sait le prénom des enfants de chacun."),
    V("À vous. Je reste près de la cheminée. Si je viens vous chercher, c'est que vous êtes en train de perdre."),
  ], [
    Q("vq2-salon", "Mener une conversation mondaine habile avec Dame Vayre.", "lucidite", [
      N("Vous complimentez le cristal, puis la chance de Dame Vayre d'avoir encore du sel noir à ses tables, par les temps qui courent."),
      T("Dame Vayre", "N'est-ce pas ? Halbrecht m'en a trouvé, alors que tout le monde jurait que les caisses avaient brûlé au Croissant.", "amused"),
      P("Halbrecht. On dit que leurs commis sont plus vifs que leurs patrons."),
      T("Dame Vayre", "Le jeune Lisse, surtout. Il facture tout, même les nouvelles. Un prix scandaleux, d'ailleurs.", "neutral"),
      N("Deux renseignements, sans une seule question. Valurn, de loin, lève à peine son verre vers vous."),
      V("Halbrecht. Corvin Lisse. Deux noms, zéro question, et Dame Vayre croit avoir mené la conversation. Je suis jaloux.", "amused"),
    ], { trust: 4, affection: 3, flags: ["valurn-q2-method:salon"], knowledge: ["knows_valurn_halbrecht_lead"] }),
    Q("vq2-cover", "Se faire passer, avec son accord, pour son associé·e commercial·e.", "audace", [
      P("Présentez-moi comme votre associé·e. Je vous laisserai la parole quand on me demandera des chiffres."),
      V("Mon associé·e. Vous mesurez le scandale ? Personne ne croira que j'accepte de partager.", "amused"),
      N("Il joue le jeu. Vous aussi. Le sire Aubrel, piqué, ne résiste pas à l'envie de vous mettre en garde."),
      T("Sire Aubrel", "Méfiez-vous. Il vous vendra votre propre ombre. Demandez donc à Halbrecht ce qu'il paie pour les fuites de ses correspondants.", "annoyed"),
      P("Halbrecht achète les fuites de Valurn ?"),
      T("Sire Aubrel", "Par un jeune commis, Lisse. Tout le monde le sait. Sauf lui, apparemment.", "neutral"),
      N("Aubrel vient de vous donner, par rancune, ce qu'il n'aurait jamais donné par politesse. Valurn admire la manœuvre et vous le dit à voix basse, avant d'ajouter qu'elle l'a fait passer pour un imbécile devant un ennemi."),
      V("Efficace. Coûteux pour mon amour-propre. Je vous enverrai la facture d'orgueil.", "annoyed"),
    ], { affection: 4, trust: 2, desire: 1, flags: ["valurn-q2-method:cover"], knowledge: ["knows_valurn_halbrecht_lead"] }),
    Q("vq2-diversion", "Provoquer une diversion sociale pour écouter ce qui se dit dans le salon voisin.", "audace", [
      N("Vous renversez, avec un aplomb remarquable, la pyramide de pâtes de fruits de Dame Vayre. Trois salons se tournent vers le désastre."),
      N("Dans le salon vide, deux intendants comparent leurs achats à voix basse. Vous entendez « Halbrecht », puis « le petit Lisse, celui qui a des papiers de Saël »."),
      V("Vous avez détruit le dessert de notre hôtesse.", "surprised"),
      P("Et entendu deux noms."),
      V("Méthode lamentable. Résultat admirable. Je vais devoir la flatter jusqu'à minuit pour la pyramide. Vous me devez une soirée de mensonges mondains.", "amused"),
    ], { affection: 4, trust: 1, flags: ["valurn-q2-method:diversion"], knowledge: ["knows_valurn_halbrecht_lead"] }),
    Q("vq2-refuse", "Refuser de sacrifier la réputation d'une jeune invitée qu'on propose comme monnaie d'échange.", "sangFroid", [
      N("Un convive vous propose un marché : il dira qui achète les papiers de Valurn si vous confirmez une rumeur sur la fille d'un drapier, assise seule près de la fenêtre."),
      P("Non. Je ne connais rien d'elle, et vous non plus apparemment."),
      T("Convive", "Dommage. C'était un prix modeste.", "annoyed"),
      N("Valurn arrive, sans hâte. Il a tout entendu."),
      V("C'était un prix modeste, en effet. Je l'aurais peut-être payé.", "neutral"),
      N("Il ne s'excuse pas de le dire. Il va pourtant s'asseoir près de la fille du drapier, parle chevaux avec elle dix minutes, et revient avec un nom qu'elle lui a donné de bon cœur : Corvin Lisse, de la maison Halbrecht, qui courtise son père pour ses livres de compte."),
      V("Plus lent. Plus propre. Je ne suis pas sûr d'aimer que vous ayez raison.", "annoyed"),
    ], { trust: 6, flags: ["valurn-q2-method:refused"], knowledge: ["knows_valurn_halbrecht_lead"] }),
  ]),

  scene(2, "Les mauvaises fréquentations", "alcove", [
    N("Valurn loue à l'année une petite pièce au-dessus d'un relieur, rue du Croissant. Des cartes, des registres, une fenêtre trop étroite et une chaise dont il affirme qu'elle a mordu un client."),
    N("Sur la table, une lettre à l'encre roussie. Le papier sent la pierre chaude. Valurn la tient du bout des doigts."),
    V("Un correspondant des Calciterres. Il s'appelle Thazran. Il vend des choses vraies à des prix faux et des choses fausses à des prix honnêtes. C'est le seul démon que je connaisse qui tienne une comptabilité.", "neutral"),
    V("Je lui ai demandé qui, de l'autre côté, connaît mon signe de transmission. Voici sa réponse."),
    N("Il vous la lit. La lettre commence par « Au fils de Bhaal, qui écrit comme sa mère et paie comme son père ». La suite est un prix."),
    V("Il a doublé son tarif. Ce qui veut dire qu'il sait qu'on me vend, et qu'il sait que je le sais. Quelqu'un d'autre lui a déjà acheté la même réponse.", "annoyed"),
    P("Et votre père ?"),
    V("Mon père n'a rien à voir avec cette affaire. Thazran le cite comme on montre un couteau sur la table : pour qu'on le voie, pas pour s'en servir.", "neutral"),
    V("Je dois répondre ce soir. Ce que je paierai, il le racontera à d'autres. Votre avis m'intéresse, puisque vous n'avez aucune raison de le craindre."),
  ], [
    Q("vq3-favour", "Payer avec une faveur précisément délimitée.", "sangFroid", [
      P("Offrez-lui une faveur. Une seule, écrite, avec ce qu'elle exclut."),
      V("Avec Thazran, une faveur mal rédigée devient un héritage. Dictez, je vous écoute.", "neutral"),
      N("Vous rédigez à deux : une lecture de contrat, une seule, à faire avant la fin de l'hiver, sans engagement de Valurn envers un tiers."),
      V("Il va détester. Il va accepter. Il aime trop être détesté par quelqu'un qui écrit bien."),
      N("La réponse arrive avant minuit, sur le même papier roussi : un nom de relais, et une phrase. « L'intermédiaire ne vend pas pour l'or. Demande-toi ce qu'il rachète. »"),
    ], { trust: 5, flags: ["valurn-q3-deal:favour"], knowledge: ["knows_valurn_thazran_contact", "knows_valurn_double_broker"] }),
    Q("vq3-proof", "Exiger une preuve avant tout échange.", "lucidite", [
      P("Demandez-lui une preuve d'abord. Un détail que seul votre vendeur peut connaître."),
      V("Il va me traiter de petit comptable.", "amused"),
      P("Vous l'êtes, ce soir."),
      N("Thazran répond qu'il veut bien prouver, à condition d'être payé pour la preuve. Valurn rit pour la première fois de la soirée, vraiment, la tête en arrière."),
      V("Il me facture la preuve de la marchandise. Je l'adore. Je le paierai en cuivre, ce qui est une insulte qu'il comprendra."),
      N("La preuve arrive : la copie d'un de vos billets du marché, avec la double entaille. Et une note : « L'intermédiaire est double. Il ne vend pas pour l'or. »"),
    ], { trust: 4, affection: 2, coins: -3, flags: ["valurn-q3-deal:proof"], knowledge: ["knows_valurn_thazran_contact", "knows_valurn_double_broker"] }),
    Q("vq3-bluff", "Feindre de déjà connaître le secret pour tester la source.", "audace", [
      P("Répondez-lui que vous savez déjà qui c'est, et que vous lui écrivez seulement pour savoir s'il ment."),
      V("Mentir à Thazran sur ce que je sais. C'est indécent. C'est exactement mon genre d'indécence.", "charming"),
      N("La réponse de Thazran est courte et vexée. Il ne baisse pas son prix, mais il corrige une chose que Valurn n'avait pas écrite : « Tu te trompes de sexe pour ton intermédiaire, fils de Bhaal. C'est un garçon, et il ne vend pas pour l'or. »"),
      V("Il vient de me donner la moitié de la réponse pour le plaisir de me corriger. Ma famille a de très mauvais défauts. Celui-là est utile.", "amused"),
      N("Il replie la lettre lentement. Thazran le croira menteur un moment. Cela aura un prix plus tard."),
    ], { affection: 4, trust: 2, flags: ["valurn-q3-deal:bluff", "valurn-thazran-irritated"], knowledge: ["knows_valurn_thazran_contact", "knows_valurn_double_broker"] }),
    Q("vq3-parallel", "Renoncer à cette information trop chère et chercher une piste parallèle.", "lucidite", [
      P("Ne payez pas. S'il a vendu la même réponse à quelqu'un d'autre, quelqu'un d'autre l'a reçue. Par un courrier."),
      V("Vous voulez que je laisse Thazran sans client. Il va écrire à toute la famille.", "annoyed"),
      N("Vous descendez chez le relieur. Il tient le registre des plis du quartier. Un pli roussi, sentant la pierre chaude, est passé trois jours plus tôt pour un commis de Halbrecht."),
      V("Moins cher et plus lent. Thazran va m'en vouloir de ne pas l'avoir payé. Bon. Il m'en voulait déjà.", "neutral"),
      N("Le relieur ajoute, sans qu'on lui demande rien, que le commis a payé en nature : un service rendu, pas une pièce."),
    ], { trust: 5, coins: 2, flags: ["valurn-q3-deal:parallel", "valurn-thazran-irritated"], knowledge: ["knows_valurn_thazran_contact", "knows_valurn_double_broker"] }),
  ]),

  scene(3, "Ce que vaut une faveur", "streets", [
    N("La piste du pli mène à un comptoir de courrier du Croissant, tenu par une relieuse aux manches tachées d'encre bleue. Elle reconnaît Valurn avant qu'il ait passé la porte et ne se lève pas."),
    T("Odile", "Saël. Tu viens réclamer ?", "neutral"),
    V("Je viens acheter du papier, Odile. Ta colle sent toujours le poisson ?", "neutral"),
    N("Elle s'appelle Odile Varrasque. Valurn connaît le nom de son chat, la marque de son encre et le prénom de son frère, Jory, qu'il prononce avec une prudence que vous ne lui avez jamais entendue."),
    V("Il y a quatre ans, Jory devait de l'argent à des gens qui ne prennent pas l'argent. Odile m'a demandé de l'aider. Je l'ai fait. Elle m'a demandé ce qu'elle me devait. Je lui ai dit : rien pour l'instant.", "neutral"),
    T("Odile", "Rien pour l'instant. Tu sais combien de nuits j'ai mal dormi avec ce « pour l'instant » ?", "annoyed"),
    N("Sur le comptoir, un registre de plis. Une page a été grattée puis réécrite. Vous la voyez. Valurn aussi."),
    T("Odile", "Oui. J'ai modifié deux de tes billets avant de les faire passer. Un commis de Halbrecht savait où était Jory. Il m'a demandé les copies de tes plis en échange de son silence.", "away"),
    V("Tu aurais pu me le dire.", "neutral"),
    T("Odile", "Pour que tu règles ça à ta façon ? Que tu m'achètes encore ? Je ne voulais pas te devoir deux fois.", "annoyed"),
    N("Elle a mis son frère à l'abri. Elle a aussi envoyé des récits faux dans un réseau où d'autres gens risquent leur peau. Valurn la regarde longtemps. Il pourrait lui rappeler sa dette. Il ne le fait pas. Pas encore."),
    V("Que faisons-nous d'elle, {player} ? Je vous préviens : je ferai ce qui m'arrange, mais je vous écoute."),
  ], [
    Q("vq4-shield", "La protéger en cherchant une preuve de rechange contre le commis.", "lucidite", [
      P("Laissons Odile hors du dossier. Le commis a forcément laissé d'autres traces que ses billets."),
      V("Plus long. Je déteste plus long.", "annoyed"),
      N("Vous passez l'après-midi avec Odile dans ses registres. Valurn reste debout près de la porte, puis finit par s'asseoir, puis par recoller lui-même une reliure."),
      T("Odile", "Tu fais ça mal.", "amused"),
      V("Je fais ça avec panache. C'est une autre école.", "amused"),
      N("Vers le soir, vous trouvez un reçu de Halbrecht pour des « copies de correspondance ». Payé à un tiers. Odile n'apparaît nulle part."),
    ], { trust: 6, affection: 2, flags: ["valurn-q4-odile:shielded"], knowledge: ["knows_valurn_odile"] }),
    Q("vq4-chance", "Lui laisser une chance de rectifier elle-même ses billets.", "sangFroid", [
      P("Odile peut corriger ce qu'elle a falsifié. Elle sait exactement quoi."),
      T("Odile", "Et je le fais pourquoi ? Pour lui ?", "annoyed"),
      P("Pour les gens qui ont cru ces billets. Pas pour lui."),
      N("Elle vous regarde, puis Valurn, qui ne dit rien et prend soudain un intérêt vif pour une pile d'enveloppes."),
      T("Odile", "D'accord. Deux billets. Je les refais. Et ensuite je ne te dois plus rien, Saël.", "neutral"),
      V("Tu ne me devais rien. Je te laissais seulement le croire.", "neutral"),
      N("C'est dit trop vite pour être une gentillesse et trop bas pour être une plaisanterie. Odile ne répond pas."),
    ], { trust: 5, affection: 3, flags: ["valurn-q4-odile:second-chance"], knowledge: ["knows_valurn_odile"] }),
    Q("vq4-expose", "Exposer publiquement la contradiction pour couper court aux fuites.", "audace", [
      P("Le plus rapide, c'est de dire au réseau que deux billets étaient faux, et par qui."),
      V("Le plus rapide, et le plus visible.", "neutral"),
      T("Odile", "Fais-le. Au moins ce sera fini.", "away"),
      N("Valurn fait circuler un mot avant la nuit. Les billets sont désavoués, Odile nommée. Deux de ses clients reprennent leurs plis le lendemain."),
      V("Le réseau sait qu'il y a eu une fuite. Il sait aussi que je l'ai trouvée. Odile paie la note. Je ne prétendrai pas que c'était gratuit.", "neutral"),
    ], { trust: 2, affection: -1, flags: ["valurn-q4-odile:exposed"], knowledge: ["knows_valurn_odile"], relationshipEffects: { iriana: { trust: 1 } } }),
    Q("vq4-press", "Faire pression sur elle pour obtenir tout de suite le nom du commis.", "audace", [
      P("Odile, le nom. Maintenant. Sinon, Valurn n'aura aucune raison de taire votre rôle."),
      N("Valurn ne vous contredit pas. Il vous laisse porter la menace, ce qui est pire."),
      T("Odile", "Corvin Lisse. Commis chez Halbrecht. Contents ?", "annoyed"),
      N("Elle vous rend la monnaie d'une pièce que vous ne lui aviez pas donnée et ferme le registre."),
      V("Nous avons gagné une journée. Nous avons perdu Odile pour un bon moment. C'est souvent le prix, ce genre de journée.", "neutral"),
    ], { trust: 1, affection: -2, flags: ["valurn-q4-odile:pressed"], knowledge: ["knows_valurn_odile"] }),
  ]),

  scene(4, "La partie truquée", "market", [
    N("Le salon de négociation de la maison Halbrecht donne sur le Grand Marché. Les fenêtres sont hautes, les chaises basses : tout est fait pour qu'on se sente petit en vendant."),
    N("Valurn a obtenu une table pour la séance d'échange de midi. Il y pose un registre relié de cuir. À l'intérieur, sept offres rédigées par différents courtiers, chacune avec son prix et sa source."),
    V("Voici le jeu. Ces gens vendent tout ce qui circule sur notre affaire. Certaines offres sont vraies, d'autres fausses, et les plus dangereuses sont vraies et mènent à une mauvaise conclusion."),
    V("Vous composez une offre avec ce que vous voulez acheter, vous choisissez qui protéger, et vous la présentez. Si elle ne tient pas, nous recommencerons. Je n'aime pas perdre, mais j'adore les revanches."),
    N("Corvin Lisse est assis à l'autre bout du salon. Jeune, élégant, avec la politesse fatiguée de quelqu'un qui doit plaire à trop de monde. Il ne regarde pas Valurn."),
    V("Comment voulez-vous jouer ? Choisissez une manière. Elle changera ce que vous verrez dans le registre."),
  ], [
    Q("vq5-lucidite", "Recouper minutieusement chaque affirmation avant d'acheter.", "lucidite", [
      P("Lentement. On vérifie chaque source contre les autres avant de payer quoi que ce soit."),
      V("La méthode des greffiers et des gens qui vivent vieux. Allez-y. Je ferai semblant de ne pas m'ennuyer.", "amused"),
    ], { trust: 2, flags: ["valurn-q5-approach:lucidite"] }),
    Q("vq5-audace", "Contre-bluffer : faire croire au salon qu'on sait déjà tout.", "audace", [
      P("On fait croire qu'on sait déjà. Ceux qui mentent vont paniquer et baisser leurs prix."),
      V("Ah. Enfin quelqu'un qui joue comme on joue chez moi. Attention : ceux qui disent vrai vont paniquer aussi.", "charming"),
    ], { affection: 2, flags: ["valurn-q5-approach:audace"] }),
    Q("vq5-sangfroid", "Négocier avec des limites claires et protéger les sources.", "sangFroid", [
      P("On négocie, mais avec une règle : aucune offre qui expose quelqu'un sans preuve."),
      V("Une règle morale dans un salon d'échange. C'est comme apporter une soupe dans un duel. Voyons si elle reste chaude.", "neutral"),
    ], { trust: 2, flags: ["valurn-q5-approach:sangfroid"] }),
  ]),

  scene(5, "Une longueur d’avance", "throne_room", [
    N("Deux jours après le salon, Valurn vous fait chercher dans la galerie couverte du palais, là où les courtiers attendent qu'on les reçoive. Il marche vite, ce qui chez lui est un aveu."),
    V("La maison Halbrecht a sorti une vieille formule. Une clause d'exclusivité que j'avais écrite pour eux il y a six ans, quand nous étions encore polis. Ils l'utilisent pour revendiquer mes propres correspondants.", "annoyed"),
    V("Quelqu'un a lu mes vieux contrats mieux que moi. C'est humiliant et assez beau."),
    N("Maître Halbrecht en personne, un homme lourd aux bagues fines, attend au bout de la galerie avec ses papiers."),
    T("Maître Halbrecht", "Saël. On dit que vous avez toujours une longueur d'avance. Aujourd'hui, c'est moi qui ai lu la page suivante.", "amused"),
    V("Vous avez surtout lu la page que j'ai écrite, Halbrecht. C'est flatteur.", "charming"),
    N("Trois messages vous attendent sur un banc : l'un de Thazran, l'un d'Odile, l'un d'un correspondant de Halbrecht qui prétend trahir son maître. Ils se contredisent sur l'heure où la clause a été déposée."),
  ], [
    Q("vq6-source", "Préserver une source malgré la provocation de Halbrecht.", "sangFroid", [
      T("Maître Halbrecht", "Donnez-moi le nom de votre relieuse et je retire la clause.", "neutral"),
      P("Non. Vous retirerez la clause parce qu'elle est mal datée, pas parce qu'on vous a vendu quelqu'un."),
      V("Vous venez de refuser un marché que j'aurais peut-être accepté. Je vous regarde faire et je ne sais pas si je dois vous remercier ou vous licencier.", "neutral"),
      N("Halbrecht replie ses papiers sans conclure. Il reviendra. Odile, elle, ne saura jamais qu'on l'a mise sur la table."),
    ], { trust: 6, flags: ["valurn-q6:source-kept"] }),
    Q("vq6-expose", "Exposer la contradiction de dates entre les trois messages.", "lucidite", [
      P("Les trois messages ne sont pas d'accord sur l'heure. Celui du traître de Halbrecht est daté d'avant le dépôt de la clause. Il ne pouvait pas la connaître."),
      T("Maître Halbrecht", "Un détail de greffe.", "annoyed"),
      V("Les détails de greffe, Halbrecht, sont ce qui sépare les marchands des voleurs. Vous m'avez appris cela vous-même, il y a six ans.", "charming"),
      N("La clause tient. Mais Halbrecht a perdu son faux traître, et Valurn sait désormais lequel des trois messages dit vrai."),
    ], { trust: 5, affection: 2, flags: ["valurn-q6:contradiction-exposed"] }),
    Q("vq6-arbiter", "Refuser de devenir l'arbitre de leur affrontement personnel.", "sangFroid", [
      P("Je ne vais pas trancher entre vous deux. Votre vieille querelle, vous la réglerez sans moi."),
      V("Vous me laissez seul face à lui. C'est très cruel. C'est aussi ce que je vous aurais conseillé.", "amused"),
      N("Valurn perd la manche : la clause tient pour la saison. Il le reconnaît d'un mot sec, salue Halbrecht et revient vers vous avec un plan déjà différent."),
      V("Nous perdons un correspondant. Nous gardons tous les autres. Et Halbrecht vient de me montrer comment il lit. Je lui en suis presque reconnaissant.", "neutral"),
    ], { trust: 4, affection: 1, flags: ["valurn-q6:no-arbiter", "valurn-q6-lost-round"] }),
    Q("vq6-reliable", "Identifier le message le plus fiable et l'emporter.", "lucidite", [
      N("Vous relisez les trois messages. Celui d'Odile est le plus court, le plus sec, le seul sans compliment. Il donne une heure, un témoin et ne demande rien."),
      P("Celui d'Odile. Elle n'a rien à y gagner."),
      V("Elle n'a jamais rien à y gagner avec moi. C'est son grand défaut.", "neutral"),
      N("Valurn s'appuie sur ce billet devant Halbrecht. La clause est suspendue jusqu'à vérification. Victoire partielle, et Valurn la savoure comme une victoire entière."),
    ], { trust: 5, affection: 2, flags: ["valurn-q6:reliable-message"] }),
  ]),

  scene(6, "Une dette que l’on ne réclame pas", "alcove", [
    N("La pièce au-dessus du relieur. Il pleut. Sur la table : le reçu de Halbrecht, les billets corrigés, la clause, et Corvin Lisse, assis sur la chaise qui mord, que Valurn a fait venir sans le menacer."),
    N("Odile est là aussi, debout près de la fenêtre, bras croisés."),
    T("Corvin", "Je n'ai pas vendu pour l'argent. Halbrecht tient la dette de ma mère. Chaque billet de Saël que je lui apporte efface un mois.", "away"),
    V("Et chaque billet de moi que tu apportes met quelqu'un en danger. Nous avons tous une mère, Corvin. Certains ont même eu la chance de la garder.", "neutral"),
    N("Le mot tombe sans être expliqué. Personne ne le relève."),
    V("Voici où nous en sommes. La fuite est connue. Halbrecht est l'acheteur. Corvin est le vendeur. Odile a été le premier maillon, de force. Le portail, la cour et ma famille n'ont rien à voir avec ceci : c'est une petite affaire de marchands, et elle fait autant de mal qu'une grande.", "neutral"),
    V("Trois façons d'en finir. Toutes coûtent quelque chose. Je choisirai, mais je veux votre voix d'abord."),
  ], [
    Q("vq7-accord", "Un accord négocié : Corvin répare les informations, la confidentialité est gardée.", "sangFroid", [
      P("Corvin corrige ce qu'il a vendu, sous votre contrôle, et cesse. En échange, personne ne sait rien."),
      T("Corvin", "Et Halbrecht ?", "away"),
      V("Halbrecht continuera de croire qu'il t'achète. Tu lui vendras ce que j'écris. Et si un jour tu recommences, je l'apprendrai par Odile, qui ne m'aime pas assez pour me mentir.", "neutral"),
      T("Odile", "C'est vrai.", "neutral"),
      N("Corvin signe. La fuite est fermée. Une créance demeure entre Valurn et lui, invisible, de celles qui peuvent se réveiller."),
    ], { trust: 5, affection: 2, flags: ["valurn-outcome:accord"], knowledge: ["knows_valurn_market_outcome"], relationshipEffects: { iriana: { trust: 1 } } }),
    Q("vq7-reveal", "Une révélation contrôlée : présenter les preuves aux parties concernées.", "lucidite", [
      P("On montre les preuves à ceux qui ont été trompés. Tous. Y compris le fait que vous avez vous-même semé de fausses pistes."),
      V("Y compris cela. Vous ne lâchez rien, vous.", "annoyed"),
      N("Il le fait. Trois lettres partent le soir même. La quatrième, à Iriana, il la rédige deux fois."),
      V("Ma réputation va perdre un peu de son lustre. Deux correspondants vont cesser d'écrire. Halbrecht va chercher à me nuire au grand jour, ce qui est plus honnête de sa part.", "neutral"),
      T("Odile", "Et Corvin ?", "neutral"),
      V("Corvin ira raconter à Halbrecht qu'il a été démasqué. C'est vrai. Et la dette de sa mère, je l'ai rachetée ce matin. Ne me regardez pas comme ça, c'était un placement.", "away"),
    ], { trust: 7, affection: 1, flags: ["valurn-outcome:revelation"], knowledge: ["knows_valurn_market_outcome"], relationshipEffects: { iriana: { trust: 3 }, bellirith: { trust: 1 } } }),
    Q("vq7-counter", "Un contre-marché agressif : prendre Halbrecht à son propre jeu.", "audace", [
      P("Halbrecht achète vos billets. Vendez-lui-en un dernier. Un vrai, qui le ruine."),
      V("Ah. Vous parlez enfin ma langue maternelle.", "charming"),
      N("En trois jours, Valurn fait passer par Corvin un renseignement exact et piégé : un lot de sel noir que Halbrecht rachète trop cher, juste avant que le prix s'effondre. La maison perd la saison."),
      T("Corvin", "Il saura que c'était moi.", "away"),
      V("Oui. Tu es libre de sa dette, et grillé chez tous ses amis. Je n'ai pas dit que ce serait doux.", "neutral"),
      N("Odile part sans dire au revoir. C'est un effet de la victoire, et Valurn le sait."),
    ], { affection: 4, trust: 1, desire: 1, coins: 8, flags: ["valurn-outcome:contremarche"], knowledge: ["knows_valurn_market_outcome"], relationshipEffects: { iriana: { trust: -1 } } }),
  ]),
];

/** Second temps de chaque quête : la conséquence, et ce que vous laissez paraître. */
export type ValurnRelationBeat = { intro: DialogueLine[]; choices: ChoiceData[] };

const done = (quest: number, choices: ChoiceData[]) => choices.map((choice) => ({
  ...choice, effects: { ...choice.effects, flags: [...(choice.effects.flags || []), `valurn-q${quest}-done`] },
}));

export const VALURN_RELATION_BEATS: Record<string, ValurnRelationBeat> = {
  "valurn-q1": {
    intro: [
      N("Péronne a rangé ses épices, Hesse compte ses amandes. Valurn plie les trois billets dans une enveloppe neutre et vous la tend."),
      V("Gardez-les. Si l'on me fouille, je préfère qu'on ne trouve rien. Si l'on vous fouille, on trouvera une personne qui collectionne les mauvais papiers. C'est presque une couverture."),
      V("Alors ? Associé·e, client·e, ou simple badaud qui repart avec mon denier ?", "amused"),
    ],
    choices: done(1, [
      Q("vq1b-partner", "« Associé·e. Pour cette affaire, et on verra ensuite. »", "audace", [
        V("Pour cette affaire. Vous savez déjà mettre des limites à mon enthousiasme. Très bien. Je vous ferai chercher pour la réception de Dame Vayre.", "charming"),
      ], { affection: 2, flags: ["valurn-help:accepted"] }),
      Q("vq1b-limited", "« Je regarde vos papiers. Je ne promets rien d'autre. »", "sangFroid", [
        V("Ce qui est exactement ce que je vous ai demandé. Vous êtes la seule personne de ce marché qui ne surenchérisse pas. Je m'en méfie déjà.", "neutral"),
      ], { trust: 2, flags: ["valurn-help:accepted"] }),
      Q("vq1b-later", "« Pas encore. Je reviendrai si l'affaire m'intéresse toujours. »", "lucidite", [
        V("Vous refusez. Je vous laisse l'enveloppe quand même : ce serait vulgaire de la reprendre.", "neutral"),
        N("Il ne vous retient pas. Vous savez où le trouver : le marché, le matin. La réception de Dame Vayre a lieu dans quelques jours, et il vous y réserve une place sans le dire."),
      ], { trust: 1, flags: ["valurn-help:deferred"] }),
    ]),
  },
  "valurn-q2": {
    intro: [
      N("Minuit passé. Vous sortez par l'escalier de service, parce que Valurn refuse de « croiser Aubrel deux fois dans la même soirée, par hygiène ». La rue des Tanneurs sent le cuir et la pluie."),
      V("On m'a demandé trois fois ce soir à qui j'appartenais. À la princesse, à Halbrecht, à mon père. J'ai répondu trois choses différentes. Aucune n'était vraie."),
      V("J'ai une chaise à la cour. Je n'ai pas de place. Les deux me conviennent, d'ailleurs. La chaise, je peux la reculer."),
    ],
    choices: done(2, [
      Q("vq2b-ask", "Lui demander ce qu'Iriana sait de cette affaire.", "lucidite", [
        V("Ce que je lui en dis, plus ce qu'elle devine, ce qui fait à peu près tout. Elle ne me demande jamais de comptes. Elle les tient.", "neutral"),
      ], { trust: 2 }),
      Q("vq2b-tease", "« Pour quelqu'un qui n'appartient à personne, vous connaissez beaucoup de prénoms d'enfants. »", "audace", [
        V("C'est de la stratégie. Les enfants grandissent et héritent.", "annoyed"),
        N("Il dit cela sans vous regarder. Vous n'êtes pas sûr·e qu'il le croie."),
      ], { affection: 3 }),
      Q("vq2b-silence", "Marcher avec lui jusqu'au Croissant sans rien ajouter.", "sangFroid", [
        N("Vous marchez. Il reprend son rythme ordinaire au bout de la rue. Devant sa porte, il s'arrête, se retourne à moitié."),
        V("Merci pour la pyramide. Ou pour l'avoir épargnée, je ne sais plus ce que vous avez fait. Bonne nuit."),
      ], { trust: 2, affection: 1 }),
    ]),
  },
  "valurn-q3": {
    intro: [
      N("La lettre de Thazran brûle doucement dans la cheminée, comme Valurn l'a voulu. Il regarde le papier se tordre, puis vous."),
      V("Il m'appelle fils de Bhaal pour me rappeler que je ne choisis pas mes créanciers. Ici, à Al'Gratal, on m'appelle conseiller. Je préfère ce titre, il me ment plus gentiment.", "neutral"),
      V("Notre intermédiaire ne vend pas pour l'or. Quelqu'un le tient. Ce qui veut dire qu'il pourrait être aussi coincé que moi, ou aussi coupable. Je n'ai pas encore décidé ce que je préfère."),
    ],
    choices: done(3, [
      Q("vq3b-father", "Lui demander s'il craint plus Thazran ou ce que Thazran pourrait raconter à son père.", "lucidite", [
        V("Thazran ne raconte rien à mon père. Il n'oserait pas. Mon père n'écoute personne, ce qui rend les commérages inutiles chez nous.", "neutral"),
        N("C'est une plaisanterie. Il ne rit pas."),
      ], { trust: 3 }),
      Q("vq3b-ally", "« Vous n'êtes pas seul à lire ce courrier. »", "sangFroid", [
        V("Je sais. C'est bien ce qui m'inquiète : je commence à aimer avoir un témoin.", "charming"),
      ], { affection: 2, trust: 1 }),
      Q("vq3b-bargain", "Proposer de traquer l'intermédiaire avant qu'il ne disparaisse.", "audace", [
        V("Demain. Je connais un comptoir du Croissant par où passent tous les plis du quartier. Je connais aussi la personne qui le tient. C'est ce qui m'ennuie.", "neutral"),
      ], { trust: 2 }),
    ]),
  },
  "valurn-q4": {
    intro: [
      N("Dehors, Valurn s'arrête devant la vitrine d'un pâtissier, achète un petit gâteau au miel et le fait porter au comptoir d'Odile sans mot, sans nom."),
      P("Elle saura que c'est vous."),
      V("Bien sûr. Le gâteau dit seulement que je n'ai rien réclamé aujourd'hui. Demain, je ne promets rien.", "neutral"),
      V("Vous m'avez vu hésiter. J'aurais préféré que non."),
    ],
    choices: done(4, [
      Q("vq4b-name", "Nommer ce que vous avez vu : il connaît sa vie mieux qu'un créancier.", "lucidite", [
        V("Je connais la vie de tous mes débiteurs. C'est mon métier.", "neutral"),
        P("Vous ne connaissez pas le nom du chat de tous vos débiteurs."),
        V("Non. Celui-là s'appelle Comptable. C'est moi qui l'ai baptisé. Ne le répétez pas.", "amused"),
      ], { trust: 3, affection: 1 }),
      Q("vq4b-push", "Lui dire qu'il aurait dû réclamer sa dette plus tôt et éviter tout cela.", "audace", [
        V("Peut-être. Réclamer, c'est décider à sa place de quoi elle a les moyens. Je l'ai déjà fait avec d'autres. Ce n'était pas toujours une réussite.", "neutral"),
        N("Il remonte son col et change de sujet. La conversation suivante porte sur les pâtissiers et dure trois rues."),
      ], { trust: 2 }),
      Q("vq4b-gift", "Ajouter un second gâteau, à votre nom.", "sangFroid", [
        V("Vous lui faites un cadeau sans contrat. Vous corrompez tout le quartier.", "amused"),
      ], { affection: 3 }),
    ]),
  },
  "valurn-q6": {
    intro: [
      N("Halbrecht parti, la galerie se vide. Valurn reste assis sur un banc de pierre, les jambes allongées comme s'il occupait un salon."),
      V("Il m'a lu. C'est très désagréable, d'être lu. Je comprends mieux pourquoi les gens me détestent.", "amused"),
      V("Une chose encore. La personne qui a déposé cette clause pour Halbrecht est un vendeur, pas un maître. Le maître, c'est la dette qui le tient. Et je crois savoir où il dort."),
    ],
    choices: done(6, [
      Q("vq6b-together", "« On y va ensemble. »", "audace", [
        V("Évidemment ensemble. Vous croyez que je vais affronter des sentiments sans témoin ?", "charming"),
      ], { affection: 2 }),
      Q("vq6b-plan", "Lui demander ce qu'il compte faire du vendeur avant de décider.", "lucidite", [
        V("Je ne sais pas encore. C'est la première fois depuis longtemps que je vous le dis sans mentir.", "neutral"),
      ], { trust: 3 }),
      Q("vq6b-odile", "Insister pour qu'Odile soit présente à la conclusion.", "sangFroid", [
        V("Elle viendra si elle veut. Je ne la convoquerai pas. Elle a assez répondu à mes convocations pour une vie.", "neutral"),
      ], { trust: 2, flags: ["valurn-q7-odile-invited"] }),
    ]),
  },
  "valurn-q7": {
    intro: [
      N("Corvin parti, Odile partie, il ne reste que la pluie et la chaise qui mord. Valurn ouvre la fenêtre, ce qui ne sert à rien, puis la referme."),
      V("C'est fini. Ou suspendu, ce qui chez les marchands revient au même."),
    ],
    choices: done(7, [
      Q("vq7b-stay", "Rester encore un peu, sans parler de l'affaire.", "sangFroid", [
        V("Vous savez rester sans demander de récompense. Je ne sais toujours pas quoi faire de ça.", "neutral"),
        N("Il sort deux tasses ébréchées, du thé noir, et vous racontez l'un à l'autre la pire soirée mondaine de votre vie. La sienne est plus longue et contient un éléphant."),
      ], { affection: 3, trust: 2 }),
      Q("vq7b-judge", "Lui dire franchement ce que vous pensez de son choix.", "lucidite", [
        V("Allez-y. J'ai l'habitude d'être jugé. D'ordinaire, c'est par des gens moins bien informés.", "neutral"),
        N("Vous le lui dites. Il écoute jusqu'au bout. Il conteste deux points, en accorde un, et ne s'excuse de rien."),
      ], { trust: 4 }),
      Q("vq7b-toast", "Porter un toast au prochain mensonge du grand parieur.", "audace", [
        V("Au prochain. Je vous préviens : il sera excellent.", "amused"),
      ], { affection: 4 }),
    ]),
  },
};

export function valurnRelationBeat(sceneId: string): ValurnRelationBeat | undefined {
  return VALURN_RELATION_BEATS[sceneId];
}

/** Statut relationnel lu par la conclusion et les moments ultérieurs. */
export type ValurnStanding = "amant" | "rival" | "partenaire" | "ami" | "distant";

export function valurnStanding(flags: readonly string[], relation: { affection: number; trust: number; desire: number }): ValurnStanding {
  if (flags.some((flag) => flag.startsWith("date-intimate:date-valurn") || flag === "home-intimate:valurn")) return "amant";
  if (flags.includes("valurn-q5-reaction:turned")) return "rival";
  if (relation.affection + relation.trust < 24) return "distant";
  if (flags.includes("valurn-help:accepted") && relation.trust >= relation.affection) return "partenaire";
  return "ami";
}

const STANDING_COMMENT: Record<ValurnStanding, DialogueLine[]> = {
  amant: [V("Et vous. Ne croyez pas que je mélange les affaires et vos draps. Je les sépare avec un soin qui m'épuise.", "charming")],
  rival: [V("Vous avez retourné mes méthodes contre moi au salon. Je ne l'ai pas oublié. Je ne vous le pardonne pas non plus, ce qui est une marque d'estime.", "annoyed")],
  partenaire: [V("Associé·e. Je vous dois une part. Ne la refusez pas, c'est la seule dette que j'aime payer.", "neutral")],
  ami: [V("Vous savez ce qui est le plus étrange ? Je n'ai rien à vous vendre. Je ne sais pas quoi faire de mes mains.", "neutral")],
  distant: [V("Vous m'avez prêté vos yeux, et rien d'autre. C'est très bien ainsi. Je déteste les gens qui en donnent trop.", "neutral")],
};

const Q1_AUDIENCE_MEMORY: [string, DialogueLine][] = [
  ["audience-methodical", V("Iriana vous a trouvé·e méthodique. Pour elle, c'est presque une déclaration d'amitié. Je voulais voir si c'était contagieux.", "amused")],
  ["audience-independent", V("Vous avez rappelé à Iriana que vous n'étiez pas son émissaire. J'ai passé une excellente soirée en y repensant.", "amused")],
  ["audience-saidin-question", V("Vous avez demandé ce que Saidin savait. Personne ne pose cette question à voix haute au palais. J'ai trouvé ça rafraîchissant, comme une gifle.", "amused")],
];

/** Variantes contextuelles du fil : mémoire de l'audience, intrusion Bellirith, campagne tardive, statut final. */
export function valurnRouteVariant(route: RouteScene, flags: readonly string[], relation: { affection: number; trust: number; desire: number }): RouteScene {
  if (route.id === "valurn-q1") {
    const memory = Q1_AUDIENCE_MEMORY.find(([flag]) => flags.includes(flag))?.[1];
    const extra: DialogueLine[] = [];
    if (memory) extra.push(memory);
    if (flags.includes("bellirith-intrusion:01:seen")) extra.push(V("Et l'on m'a dit que ma sœur était passée vous saluer après l'audience. Ne me racontez rien. Elle me le racontera mieux, et plus faux.", "neutral"));
    if (flags.includes("main-story-act-1-complete")) extra.push(V("Le portail, la guerre, les Obscurcis : vous avez eu une saison chargée. Ceci est une affaire de marchands. Ça vous reposera.", "amused"));
    return extra.length ? { ...route, intro: [...route.intro.slice(0, 6), ...extra, ...route.intro.slice(6)] } : route;
  }
  if (route.id === "valurn-q6") {
    const bellirith = flags.includes("bellirith-intrusion:01:seen");
    const extra: DialogueLine[] = bellirith ? [
      N("Une silhouette s'appuie à une colonne, plus loin. Bellirith regarde Halbrecht ranger ses papiers, puis son frère, avec l'expression de quelqu'un qui a vu cette partie mille fois."),
      T("Bellirith", "Il va te dire qu'il a lu la page suivante, et tu vas répondre qu'il a lu la tienne. Tu fais toujours cette réplique, mon cher frère.", "teasing"),
      V("Parce qu'elle fonctionne toujours, chère sœur.", "annoyed"),
      T("Bellirith", "Elle fonctionne quand on ne la connaît pas. Halbrecht la connaît. Moi aussi. Bonne chance.", "smirk"),
      N("Elle s'éloigne vers ses propres affaires sans un regard pour vous. Valurn la suit des yeux une seconde, puis revient au problème."),
    ] : flags.includes("iv-informed") ? [
      N("Un billet d'Iriana l'attendait à l'entrée de la galerie. Il le lit, le plie, le range."),
      V("Iriana me fait savoir que Halbrecht a demandé une audience. Elle ajoute : « Ne vous faites pas battre par un homme qui sent la cire. » C'est sa manière d'être affectueuse.", "amused"),
    ] : [
      N("Un correspondant de Valurn, un vieux greffier, lui glisse en passant un mot plié en quatre. Valurn le lit et rit sans joie."),
      V("Il me prévient que Halbrecht connaît mes répliques habituelles. On ne devrait jamais avoir d'habitudes. C'est la première chose que les autres apprennent de vous.", "annoyed"),
    ];
    return { ...route, intro: [...route.intro, ...extra] };
  }
  if (route.id === "valurn-q7") {
    const standing = valurnStanding(flags, relation);
    const odile = flags.includes("valurn-q4-odile:exposed") || flags.includes("valurn-q4-odile:pressed")
      ? [T("Odile", "Je suis venue parce que je préfère entendre ce qu'on décide de moi. Pas parce que je te pardonne, Saël.", "annoyed")]
      : [T("Odile", "Je suis venue. Ne fais pas de discours.", "neutral")];
    const reaction = flags.includes("valurn-q5-reaction:accused")
      ? [V("Vous m'avez reproché mes fausses pistes au salon. Je les ai rangées. Ce soir, tout ce qui est sur la table est vrai. Vérifiez.", "neutral")]
      : flags.includes("valurn-q5-reaction:repaired")
        ? [V("Bram a retrouvé sa place au marché, grâce à vous. Il m'a fait savoir qu'il ne me saluerait plus jamais. C'est équitable.", "neutral")]
        : [];
    return {
      ...route,
      intro: [...route.intro.slice(0, 2), ...odile, ...route.intro.slice(2), ...reaction],
      choices: route.choices.map((choice) => ({ ...choice, response: [...choice.response, ...STANDING_COMMENT[standing]] })),
    };
  }
  return route;
}

/** Dossier de Journal : problème, objectif, lieu, indice, dernière conséquence, étape suivante. */
export type ValurnJournalEntry = { title: string; problem: string; objective: string; place: string; clue: string; consequence: string; next: string };

const JOURNAL: Record<ValurnQuestId, Omit<ValurnJournalEntry, "consequence">> = {
  "valurn-q1": { title: "La première mise", problem: "Trois récits contradictoires d'une même vente de sel noir circulent dans le réseau de Valurn.", objective: "Retrouver Valurn au Grand Marché et examiner ses billets.", place: "Al'Gratal · Grand Marché, le matin", clue: "Aucun pour l'instant.", next: "Décider si vous l'aidez." },
  "valurn-q2": { title: "Un homme de relations", problem: "Il faut savoir qui a acheté le sel noir, et par qui, sans poser de question frontale.", objective: "Accompagner Valurn à la réception de Dame Vayre.", place: "Al'Gratal · Salle d'audience du palais (réception de la rue des Tanneurs), en soirée", clue: "Deux billets portent le signe de transmission de Valurn.", next: "Recueillir deux renseignements à la réception." },
  "valurn-q3": { title: "Les mauvaises fréquentations", problem: "Un correspondant des Calciterres a doublé son prix : quelqu'un d'autre a déjà acheté la même réponse.", objective: "Aider Valurn à répondre à Thazran.", place: "Al'Gratal · Grand Marché, cabinet au-dessus du relieur, le matin", clue: "La maison Halbrecht et son commis, Corvin Lisse.", next: "Négocier ou contourner la réponse de Thazran." },
  "valurn-q4": { title: "Ce que vaut une faveur", problem: "La fuite passe par un comptoir de courrier du Croissant.", objective: "Rencontrer la personne qui tient ce comptoir.", place: "Al'Gratal · Rues et ruelles, l'après-midi", clue: "L'intermédiaire est double et ne vend pas pour l'or.", next: "Décider ce que vous faites d'Odile Varrasque." },
  "valurn-q5": { title: "La partie truquée", problem: "Sept offres contradictoires circulent au salon d'échange de Halbrecht.", objective: "Composer une offre fiable et choisir qui protéger.", place: "Al'Gratal · Grand Marché, salon de Halbrecht, le matin", clue: "Odile a falsifié deux billets sous la contrainte.", next: "Jouer la séance d'échange." },
  "valurn-q6": { title: "Une longueur d'avance", problem: "Halbrecht retourne contre Valurn une vieille clause qu'il avait écrite.", objective: "Retrouver Valurn dans la galerie du palais.", place: "Al'Gratal · Salle d'audience du palais, en soirée", clue: "Valurn avait semé lui-même une partie des fausses pistes.", next: "Démêler trois messages contradictoires." },
  "valurn-q7": { title: "Une dette que l'on ne réclame pas", problem: "Le vendeur est identifié ; reste à décider comment fermer la fuite.", objective: "Rejoindre Valurn au cabinet du Croissant pour la conclusion.", place: "Al'Gratal · Rues et ruelles, comptoir du Croissant, l'après-midi", clue: "Halbrecht tient le vendeur par une dette.", next: "Choisir avec Valurn la manière d'en finir." },
};

const CONSEQUENCES: [string, string][] = [
  ["valurn-outcome:accord", "Accord négocié : Corvin répare ses billets en secret, une créance demeure."],
  ["valurn-outcome:revelation", "Révélation contrôlée : les preuves sont publiques, Valurn perd deux correspondants."],
  ["valurn-outcome:contremarche", "Contre-marché : Halbrecht perd la saison, Odile ne parle plus à Valurn."],
  ["valurn-q6:source-kept", "Vous avez refusé de livrer Odile à Halbrecht."],
  ["valurn-q6:contradiction-exposed", "Vous avez démasqué le faux traître de Halbrecht."],
  ["valurn-q6:no-arbiter", "Vous avez refusé d'arbitrer : Valurn a perdu la manche."],
  ["valurn-q6:reliable-message", "Le billet d'Odile a suspendu la clause."],
  ["valurn-q5-reaction:accused", "Vous avez reproché à Valurn ses fausses pistes."],
  ["valurn-q5-reaction:admired", "Vous avez salué l'audace de son stratagème."],
  ["valurn-q5-reaction:repaired", "Vous avez exigé qu'il répare le tort fait à Bram."],
  ["valurn-q5-reaction:turned", "Vous avez retourné ses méthodes contre lui."],
  ["valurn-q4-odile:shielded", "Odile reste hors du dossier."],
  ["valurn-q4-odile:second-chance", "Odile corrige elle-même ses billets."],
  ["valurn-q4-odile:exposed", "Odile a été nommée devant le réseau."],
  ["valurn-q4-odile:pressed", "Odile a donné le nom sous la pression."],
  ["valurn-q3-deal:favour", "Thazran a été payé d'une faveur délimitée."],
  ["valurn-q3-deal:proof", "Thazran a fourni une preuve, payée en cuivre."],
  ["valurn-q3-deal:bluff", "Thazran s'est laissé corriger, vexé."],
  ["valurn-q3-deal:parallel", "Vous avez trouvé la piste par le registre du relieur."],
  ["valurn-q2-method:salon", "Dame Vayre a parlé sans s'en rendre compte."],
  ["valurn-q2-method:cover", "Aubrel a parlé par rancune."],
  ["valurn-q2-method:diversion", "La pyramide de Dame Vayre n'a pas survécu."],
  ["valurn-q2-method:refused", "Vous avez refusé de vendre une réputation."],
  ["valurn-help:deferred", "Vous avez remis votre réponse à plus tard."],
  ["valurn-q1-choice:rules", "Vous avez gagné le pari du marché."],
  ["valurn-q1-choice:coop", "Vous avez fixé les termes avant de jouer."],
  ["valurn-q1-choice:turned", "Valurn a perdu trois piécettes devant Hesse."],
  ["valurn-q1-choice:risks", "Vous connaissez les risques de l'affaire."],
];

export function valurnJournalEntry(history: readonly string[], flags: readonly string[]): ValurnJournalEntry | undefined {
  const stage = valurnQuestStage(history);
  const consequence = CONSEQUENCES.find(([flag]) => flags.includes(flag))?.[1] || "Aucune pour l'instant.";
  if (stage >= VALURN_QUEST_IDS.length) {
    return { title: "Les trois mensonges du grand parieur", problem: "La fuite est fermée, d'une manière ou d'une autre.", objective: "Aucun objectif imposé. Valurn reste au Grand Marché et au palais.", place: "Al'Gratal", clue: "L'affaire est close.", consequence, next: "Moments libres, courriers et rendez-vous restent ouverts." };
  }
  if (stage === 5 && history.includes("valurn-q5") && !flags.includes("valurn-market-done")) {
    return { ...JOURNAL["valurn-q5"], objective: "Reprendre le registre de la séance d'échange depuis ce Journal.", next: "Terminer la séance : aucune décision n'est perdue.", consequence };
  }
  return { ...JOURNAL[VALURN_QUEST_IDS[stage]], consequence };
}
