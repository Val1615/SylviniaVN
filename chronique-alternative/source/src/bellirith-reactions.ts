import type { AmbientDialogue } from "./ambient-dialogues";
import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

/*
 * Spec §49 : Valurn et Iriana reconnaissent progressivement le phénomène
 * Bellirith. Quelques moments libres conditionnés à l’historique d’intrusions
 * (flags), sans grande scène : Valurn reconnaît la méthode de sa sœur, se moque
 * si l’on cède toujours, devient sérieux quand une opération est détournée ;
 * Iriana est agacée par le manque de fiabilité et reconnaît un schéma, sans
 * jalousie romantique automatique. Aucun effet de relecture : ce sont des
 * moments libres ordinaires.
 */

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const V = (text: string, mood = "neutral"): DialogueLine => ({ speaker: "Valurn", text, mood });
const I = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Iriana", text, mood });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({
  id, text, stat, response, effects: { ...effects, stats: { [stat]: 1 } },
});
const S = (id: string, title: string, prompt: string, choices: ChoiceData[], options: Partial<AmbientDialogue>): AmbientDialogue => ({ id, title, prompt, choices, ...options });

export const VALURN_BELLIRITH_REACTIONS: AmbientDialogue[] = [
  S("valurn-bellirith-methode", "La méthode de sa sœur", "Valurn fait tourner son verre sans boire. « Le pire moment, le meilleur décor, et une phrase qu’on ne peut pas refuser poliment. C’est sa méthode. Elle l’utilisait déjà quand nous étions jeunes. Ce qui est nouveau, c’est qu’elle l’utilise sur vous, et seulement sur vous. »", [
    Q("vbr-methode-l", "Lui demander ce que cela signifie, chez elle.", "lucidite", [V("Que vous l’amusez. C’est la chose la plus dangereuse qui puisse vous arriver avec ma sœur, et la plus rare.", "away"), P("Plus dangereuse que de l’ennuyer ?"), V("Ceux qui l’ennuient, elle les oublie. Ceux qui l’amusent, elle les garde. Je parle d’expérience.", "amused")], { trust: 3 }),
    Q("vbr-methode-a", "« Vous êtes jaloux de ne plus être sa cible préférée ? »", "audace", [V("Jaloux ?", "annoyed"), N("Il pose son verre avec une précision exagérée."), V("Je suis soulagé. Quelques siècles de cette attention suffisent à n’importe qui. Prenez la relève. Je vous souhaite du courage.", "amused")], { affection: 2 }),
    Q("vbr-methode-s", "Lui demander comment on lui résiste.", "sangFroid", [V("On ne lui résiste pas. On choisit autre chose, au bon moment, et on le dit clairement.", "neutral"), V("Elle n’en sera pas vexée. Elle sera intéressée. C’est pire, mais c’est plus honnête.", "away")], { trust: 2, affection: 1 }),
  ], { requiresFlags: ["bellirith-intrusion:01:seen"], mood: "neutral" }),

  S("valurn-bellirith-moquerie", "Le registre de Valurn", "Valurn vous accueille avec une politesse trop parfaite pour être sincère. « Je tiens un compte. Ne me demandez pas lequel. Disons que ma sœur vous a détourné·e plus souvent que je n’ai réussi à vous faire écouter un rapport complet. »", [
    Q("vbr-moq-a", "« Elle propose des activités plus intéressantes que vos rapports. »", "audace", [V("C’est indiscutable. Mes rapports n’ont jamais promis de bain chaud.", "amused"), V("Mais ils ont le mérite de ne pas vous laisser au petit matin avec l’air d’un soldat qui ne sait plus à quelle armée il appartient.", "charming")], { affection: 2 }),
    Q("vbr-moq-l", "Lui demander si cela l’inquiète vraiment.", "lucidite", [V("M’inquiéter ? Non. Vous êtes adulte, elle aussi, plus ou moins.", "neutral"), V("Ce qui m’inquiète, c’est qu’elle ait appris exactement à quelle heure vous dites oui. Elle finira par s’en servir pour autre chose que le plaisir.", "away")], { trust: 3 }),
    Q("vbr-moq-s", "Lui répondre que vous le savez, et que vous l’assumez.", "sangFroid", [P("Je sais ce que je fais quand je la suis."), V("Vous le savez après. Pendant, j’ai des doutes.", "amused"), V("Mais vous l’assumez. C’est plus que la plupart. Je vous retire un point de mon compte.", "charming")], { trust: 2, affection: 1 }),
  ], { requiresFlags: ["bellirith-trend:ceded"], mood: "amused" }),

  S("valurn-bellirith-serieux", "Une opération détournée", "Valurn ne sourit pas. « L’armée est partie sans vous à sa tête. Je ne vous fais pas la morale : je connais ma sœur, et je sais ce que c’est que d’avoir envie de la suivre. Mais elle a choisi ce soir-là exprès. Elle commence à toucher aux choses qui comptent. »", [
    Q("vbr-ser-l", "Lui demander ce qu’il pense qu’elle cherche.", "lucidite", [V("À savoir jusqu’où vous la suivrez. Une heure ? Une nuit ? Une guerre ?", "away"), V("Elle ne veut pas que vous perdiez. Elle veut savoir ce qui pèse plus lourd qu’elle. Ne lui donnez pas la réponse par accident.", "neutral")], { trust: 4 }),
    Q("vbr-ser-a", "« C’était mon choix, pas le sien. »", "audace", [V("Oui. Et c’est exactement pour ça qu’elle recommencera.", "annoyed"), V("Je ne vous demande pas de regretter. Je vous demande de savoir, la prochaine fois, ce que vous laissez derrière la porte.", "neutral")], { trust: 2, affection: 1 }),
    Q("vbr-ser-s", "Lui promettre de rattraper ce qui a été manqué.", "sangFroid", [V("Iriana a déjà tout rattrapé. C’est ce qui la rend si fatigante et si indispensable.", "amused"), V("Rattrapez autre chose : sa confiance. Elle se rattrape moins vite qu’une armée.", "away")], { trust: 3 }),
  ], { requiresFlags: ["bellirith-intrusion:04:accepted", "bellirith-intrusion:04:live"], mood: "neutral" }),

  S("valurn-bellirith-refus", "Elle parle de vous", "Valurn vous rejoint, l’air d’un homme qui a perdu un pari contre lui-même. « Vous lui avez dit non. Plusieurs fois. Elle m’en parle. À moi. Elle ne m’a pas parlé de quelqu’un avec cette voix-là depuis très longtemps. »", [
    Q("vbr-ref-l", "Lui demander quelle voix.", "lucidite", [V("Celle d’une joueuse qui vient de trouver un adversaire et qui fait semblant d’être agacée.", "away"), V("Ne vous y trompez pas : elle n’abandonnera pas. Elle a simplement décidé que ça valait la peine de prendre son temps.", "neutral")], { trust: 3 }),
    Q("vbr-ref-a", "« Vous avez l’air presque fier de moi. »", "audace", [V("Fier ? J’ai l’air de quelqu’un qui a passé des siècles à perdre contre elle et qui vous regarde gagner des manches.", "amused"), V("Disons que c’est instructif. Et légèrement vexant.", "charming")], { affection: 3 }),
    Q("vbr-ref-s", "Lui dire que vous la désirez quand même.", "sangFroid", [P("Je ne lui dis pas non parce que je ne veux pas."), V("Je sais. Elle aussi. C’est précisément ce qui la rend folle.", "amused")], { trust: 2, affection: 1 }),
  ], { requiresFlags: ["bellirith-trend:resisted"], mood: "away" }),
];

export const IRIANA_BELLIRITH_REACTIONS: AmbientDialogue[] = [
  S("iriana-bellirith-fiabilite", "La lettre annotée", "Iriana range des lettres sans lever les yeux. « Hier soir, j’ai attendu une réponse qui n’est jamais venue. Je ne vous demande pas où vous étiez. Je le sais, tout le palais le sait, et ce n’est pas la question. La question, c’est : sur qui puis-je compter quand je dois compter ? »", [
    Q("ibr-fia-l", "Lui proposer une règle claire pour les prochaines missions.", "lucidite", [P("Quand c’est vital, vous me le dites en ces termes. Et je reste."), I("Vital. Vous voulez un mot de passe pour ne pas vous laisser distraire.", "stern"), I("…C’est absurde, et c’est utile. Très bien. Je l’emploierai rarement. Ne m’obligez pas à l’employer souvent.", "calm")], { trust: 4 }),
    Q("ibr-fia-a", "« Vous êtes jalouse, Altesse ? »", "audace", [I("Jalouse ?", "stern"), N("Elle pose enfin sa plume."), I("Je suis princesse, pas jalouse. Ce que vous faites de vos nuits vous regarde. Ce que vous faites de mes réunions me regarde, moi.", "smirk")], { affection: 1, trust: -1 }),
    Q("ibr-fia-s", "Reconnaître le manquement sans vous justifier.", "sangFroid", [P("J’aurais dû être là. Je n’y étais pas."), I("Merci de ne pas inventer une excuse. J’en ai entendu de très bonnes, venant de gens moins utiles que vous.", "calm"), I("La prochaine fois, prévenez-moi. Même avec une seule ligne. Même mal écrite.", "neutral")], { trust: 3 }),
  ], { requiresFlags: ["bellirith-intrusion:02:accepted", "bellirith-intrusion:02:live"], mood: "stern" }),

  S("iriana-bellirith-schema", "Un schéma", "Iriana a déplié une carte de ses rendez-vous de la semaine et y a tracé, au crayon, trois petites croix roses. « J’ai remarqué un schéma. Chaque fois qu’une décision importante approche, Bellirith apparaît, et vous disparaissez. Je ne vous reproche rien. Je constate. C’est mon métier. »", [
    Q("ibr-sch-l", "Lui demander si elle pense que Bellirith le fait exprès.", "lucidite", [I("Évidemment. Elle choisit ses moments comme un général choisit ses champs de bataille.", "smirk"), I("Ce qui m’intéresse, c’est ce qu’elle cherche à retarder. Ou qui. Je vais y réfléchir. Vous, essayez d’y penser avant, plutôt qu’après.", "calm")], { trust: 3 }),
    Q("ibr-sch-a", "Lui suggérer d’ajouter une croix pour la prochaine fois.", "audace", [I("Vous me demandez de planifier vos absences ?", "stern"), P("Au moins, vous serez prévenue."), I("…C’est la proposition la plus insolente qu’on m’ait faite cette semaine. Je la note. Je ne la valide pas.", "smirk")], { affection: 2 }),
    Q("ibr-sch-s", "Lui promettre de briser le schéma.", "sangFroid", [I("Ne me promettez rien. Montrez-le-moi.", "calm"), I("Je garde la carte. Si la prochaine croix n’apparaît pas, je la brûlerai avec plaisir.", "neutral")], { trust: 2, affection: 1 }),
  ], { requiresFlags: ["bellirith-trend:ceded"], mood: "calm" }),

  S("iriana-bellirith-resistance", "Le registre des refus", "Iriana vous intercepte dans un couloir, un dossier sous le bras. « On me rapporte que vous avez refusé Bellirith. Plusieurs fois. Les servantes en parlent comme d’une curiosité astronomique. Je voulais vérifier par moi-même que vous existiez vraiment. »", [
    Q("ibr-res-a", "« Vous êtes impressionnée ? »", "audace", [I("Pas du tout.", "smirk"), N("Une demi-seconde passe."), I("Un peu. Ne le répétez à personne, j’ai une réputation de femme que rien n’impressionne.", "calm")], { affection: 3 }),
    Q("ibr-res-l", "Lui faire remarquer que vous êtes toujours resté·e à la table.", "lucidite", [P("Chaque fois, j’ai choisi la table. Votre table."), I("Je sais. J’ai compté.", "calm"), I("Cela ne fait pas de vous un saint. Cela fait de vous quelqu’un sur qui je peux compter. C’est plus rare.", "neutral")], { trust: 4 }),
    Q("ibr-res-s", "Lui dire que ce n’était pas facile.", "sangFroid", [P("Ce n’était pas facile."), I("Je m’en doute. Elle n’a pas l’habitude de rendre les choses faciles.", "smirk"), I("C’est pour cela que je vous remercie. Une seule fois. Ne vous y habituez pas.", "calm")], { trust: 3, affection: 1 }),
  ], { requiresFlags: ["bellirith-trend:resisted"], mood: "smirk" }),
];
