import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { DateScene } from "./date-scenes";

/**
 * Valurn · deux rendez-vous publics, trois branches de nature différente chacun.
 * La branche est choisie au premier choix et enregistrée par le drapeau
 * `valurn-date-branch:<rendez-vous>:<branche>` (le dernier choix remplace le précédent).
 * Chaque branche : cinq temps non intimes, une fin propre. L'intimité reste une
 * proposition séparée, jamais une récompense automatique.
 */

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const T = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({
  id, text, stat, response, effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } }, dateOutcome: "great",
});

export type ValurnDateBeat = { intro: DialogueLine[]; choices: ChoiceData[] };
const B = (intro: DialogueLine[], choices: ChoiceData[]): ValurnDateBeat => ({ intro, choices });
export const VALURN_DATE_IDS = ["date-valurn-forestier", "date-valurn-river"] as const;
export const VALURN_DATE_BRANCHES: Record<string, string[]> = {
  "date-valurn-forestier": ["tournoi", "imposture", "fond"],
  "date-valurn-river": ["imprevus", "etoiles", "braise"],
  home: ["cabinet", "reception", "cartes"],
};
const branch = (dateId: string, id: string) => `valurn-date-branch:${dateId}:${id}`;

export const VALURN_DATES: DateScene[] = [
  {
    id: "date-valurn-forestier", character: "valurn", title: "Le pari qui ne rapporte rien", type: "Auberge, jeux et habitués",
    description: "Une table réservée au Forestier, des habitués qui reconnaissent Valurn et un défi qu'il ne peut pas ignorer.",
    location: "forestier", spot: "forestier-inn", period: "soirée", unlockStage: 5, minAffection: 22, minTrust: 22, minDesire: 20, mood: "charming",
    intro: [
      N("La grande salle du Forestier sent la bière tiède et le pain grillé. Valurn a réservé une table près de la cheminée et s'est fait servir avant votre arrivée, ce qui ne l'empêche pas de faire signe pour une seconde tournée."),
      V("Je vous préviens : on me connaît, ici. Pas en bien. J'ai gagné un tonneau l'an dernier et je ne l'ai jamais réclamé, ce qui a rendu tout le monde nerveux."),
      T("Hubert", "Saël ! Tu reviens perdre ton tonneau ?", "amused"),
      N("Hubert, le tenancier, pose deux bols de soupe sans qu'on les ait commandés. Au fond, trois habitués jouent aux osselets sur un tonneau retourné. L'un d'eux lève la tête et désigne Valurn du menton."),
      T("Habitué", "Le démon de la ville. On joue la soirée, ou tu as peur des gens qui comptent sur leurs doigts ?", "neutral"),
      V("Il me provoque. Je dois répondre, c'est une question d'hygiène morale. Mais vous choisissez comment nous passons la soirée.", "amused"),
    ],
    choices: [
      Q("dvf-tournoi", "Accepter le tournoi d'osselets contre les habitués, en équipe.", "audace", [
        P("On joue. Ensemble. Contre eux."),
        V("En équipe ? Vous voulez partager ma défaite ? C'est d'un romantisme inquiétant.", "charming"),
        N("Hubert inscrit vos noms à la craie sur l'ardoise des paris. Quelqu'un mise déjà contre vous."),
      ], { affection: 2, flags: [branch("date-valurn-forestier", "tournoi")] }),
      Q("dvf-imposture", "Lui proposer d'inventer chacun une fausse identité et de la tenir toute la soirée.", "lucidite", [
        P("Ce soir, vous n'êtes pas Valurn. Et moi non plus, je ne suis pas moi."),
        V("Une imposture. Vous savez parler à mon cœur, qui est un faussaire de premier ordre.", "amused"),
        N("Vous avez trois minutes pour vous inventer. Valurn emprunte un chapeau à un client endormi."),
      ], { affection: 2, trust: 1, flags: [branch("date-valurn-forestier", "imposture")] }),
      Q("dvf-fond", "Refuser le défi et prendre la petite table du fond, à l'abri du bruit.", "sangFroid", [
        P("Laissons-les jouer. Je préfère la table du fond, et vous en face."),
        V("Vous me privez d'une humiliation publique. Je ne sais pas si je dois vous remercier.", "neutral"),
        N("Il refuse poliment l'habitué, qui le traite de lâche. Valurn s'incline comme devant un compliment et vous suit."),
      ], { trust: 2, flags: [branch("date-valurn-forestier", "fond")] }),
    ],
    intimacySetting: { background: "/assets/backgrounds/forestier_room.webp", replaceProfile: true, opening: [], closing: [] },
  },
  {
    id: "date-valurn-river", character: "valurn", title: "Un feu sans pacte", type: "Halte au bord du fleuve",
    description: "Une nuit à la Halte du Fleuve bleu, au retour d'une course de Valurn, avec un feu au silex et aucune urgence.",
    location: "river-halt", spot: "river-halt", period: "soirée", unlockStage: 5, minAffection: 24, minTrust: 24, minDesire: 20, mood: "neutral",
    intro: [
      N("Valurn revient d'une course pour un correspondant de la route impériale. Il a proposé de faire halte ici plutôt que de rentrer de nuit. La rive est large, l'eau sombre, et quelques charrettes dorment plus loin sous des bâches."),
      V("J'ai apporté de quoi manger, un silex et une couverture. Pas de flamme de pacte ce soir. Je veux savoir si je sais encore faire du feu comme tout le monde."),
      N("Il frappe le silex. Trois fois. Rien. Une quatrième. Une étincelle meurt dans l'herbe humide."),
      V("C'est un silex défectueux. Je le ferai savoir au marchand. Par écrit.", "annoyed"),
      N("Le feu finit par prendre, petit et têtu. Valurn s'assied devant, satisfait comme s'il venait de gagner un procès."),
      V("Voilà. Une nuit entière devant nous, aucun rendez-vous, aucune mise. Que fait-on d'une nuit pareille ?"),
    ],
    choices: [
      Q("dvr-imprevus", "Remarquer que le sac de provisions est ouvert, et que quelque chose a déjà mangé le pain.", "lucidite", [
        P("Valurn. Votre sac est ouvert. Il n'y a plus de pain."),
        V("Comment ça, plus de pain ? Il y avait du pain, du fromage et une tarte aux poires qui m'a coûté une fortune.", "surprised"),
        N("Des traces de petites pattes mènent vers les roseaux. La nuit des imprévus commence."),
      ], { affection: 2, flags: [branch("date-valurn-river", "imprevus")] }),
      Q("dvr-etoiles", "Proposer un marché des étoiles : chacun vend un souvenir, une chanson ou une minute de silence.", "audace", [
        P("Faisons un marché. Mais on ne vend rien de réel. Des souvenirs, des chansons, une minute de silence."),
        V("Un marché sans marchandise. Vous voulez me faire pleurer de jalousie professionnelle.", "charming"),
        N("Il étale la couverture comme un comptoir et pose dessus une pierre plate : l'étal est ouvert."),
      ], { affection: 3, flags: [branch("date-valurn-river", "etoiles")] }),
      Q("dvr-braise", "Ne rien organiser. Garder le feu, et parler.", "sangFroid", [
        P("Rien. On garde le feu et on parle, jusqu'à ce que l'un de nous s'endorme."),
        V("Aucun jeu ? Vous êtes sans pitié. J'accepte, à condition que ce soit vous qui vous endormiez en premier.", "neutral"),
        N("Il ajoute une branche au feu, s'adosse à une souche et vous laisse la meilleure place."),
      ], { trust: 3, flags: [branch("date-valurn-river", "braise")] }),
    ],
    intimacySetting: { background: "/assets/backgrounds/camp.webp", replaceProfile: true, opening: [], closing: [] },
  },
];

const FORESTIER: Record<string, ValurnDateBeat[]> = {
  tournoi: [
    B([N("Première manche. Les habitués s'appellent Gorn, Pétronille et le vieux Abel. Ils lancent les osselets avec une précision de notaires. Valurn lance avec élégance et rate tout."), V("C'est une stratégie. Je les endors.", "amused")], [
      Q("dvft-0a", "Observer comment Pétronille fait toujours tomber ses osselets sur le côté plat.", "lucidite", [N("Vous remarquez qu'elle souffle sur sa paume avant chaque lancer. Vous l'imitez. Ça marche, une fois sur deux."), V("Vous trichez par imitation. C'est la forme la plus honnête de la triche.", "charming")], { trust: 2 }),
      Q("dvft-0b", "Jouer franchement, sans technique, en riant de vos ratés.", "audace", [N("Vous ratez tout aussi, avec enthousiasme. Gorn finit par vous expliquer la règle qu'il a inventée exprès contre vous."), V("Il vous adore. C'est très mauvais pour nous.", "amused")], { affection: 2 }),
    ]),
    B([N("Deuxième manche. Valurn glisse un osselet dans sa manche avec une habileté que seule vous avez vue. Pétronille le regarde fixement."), V("Ne dites rien. Je suis en train de perdre avec dignité.", "neutral")], [
      Q("dvft-1a", "Le dénoncer gentiment devant tout le monde.", "audace", [P("Il a un osselet dans la manche."), N("Rires. Abel exige une fouille. Valurn retourne sa manche : elle est vide. L'osselet est dans votre poche, glissé pendant que vous parliez."), V("Je ne triche jamais deux fois de la même manière. Nous voilà complices, et toute l'accusation retombe sur vous.", "charming")], { affection: 3, desire: 1 }),
      Q("dvft-1b", "Lui prendre discrètement l'osselet et le remettre en jeu.", "sangFroid", [N("Vous rendez l'osselet au tonneau. Valurn soupire comme un homme qu'on oblige à gagner honnêtement."), V("Vous me condamnez à mon talent véritable. Il est mince.", "annoyed")], { trust: 3 }),
    ]),
    B([N("Troisième manche. Vous êtes menés. Hubert annonce que le perdant chante. Valurn devient soudain très concentré."), T("Gorn", "Le démon a peur de chanter !", "amused")], [
      Q("dvft-2a", "Proposer une alliance à Abel contre Gorn.", "lucidite", [N("Abel accepte, pour le plaisir de voir Gorn perdre. Trois contre deux, la manche bascule."), V("Vous avez fait de la politique dans une auberge. Iriana serait fière, et moi je suis un peu effrayé.", "amused")], { trust: 2, affection: 1 }),
      Q("dvft-2b", "Accepter la défaite et proposer de chanter à sa place.", "sangFroid", [N("Vous perdez. Vous chantez. Mal. La salle reprend le refrain par charité."), V("Vous m'avez sauvé du pire, et vous avez fait le pire avec un courage admirable.", "charming")], { affection: 3 }),
    ]),
    B([N("La partie se termine, gagnée ou perdue, peu importe à la fin. Gorn paie une tournée en grognant. Pétronille vient vous trouver, sans Valurn."), T("Pétronille", "Il ne vient jamais avec quelqu'un. D'habitude, il joue seul et il perd exprès pour qu'on le laisse revenir.", "neutral")], [
      Q("dvft-3a", "Lui demander pourquoi il perd exprès.", "lucidite", [T("Pétronille", "Pour qu'on ne le craigne pas. Ici, c'est le seul endroit où on ne le craint pas. Ne le lui répétez pas."), N("Valurn revient avec deux chopes et vous regarde comme s'il savait exactement ce qu'on vient de vous dire.")], { trust: 3 }),
      Q("dvft-3b", "Lui répondre que ce soir, il ne perdait pas exprès.", "audace", [T("Pétronille", "Non. Ce soir, il perdait vraiment. Il avait l'air content."), N("Elle retourne à ses osselets. Valurn arrive, méfiant : « Qu'est-ce qu'elle vous a vendu ? »")], { affection: 2 }),
    ]),
    B([N("Il est tard. L'ardoise des paris porte vos deux noms barrés, puis réécrits. Hubert vous tend l'osselet de la soirée, celui qui a voyagé dans votre poche."), V("Gardez-le. C'est un trophée volé. Ce sont les meilleurs.")], [
      Q("dvft-4a", "Lui proposer une revanche, un autre soir, avec les mêmes habitués.", "audace", [V("Oui. Je reviendrai perdre avec vous. C'est le pari le moins rentable de ma vie, et je le prends.", "charming"), N("Il inscrit à la craie, sous vos noms : « à suivre ». Hubert efface le tonneau qu'il n'a jamais réclamé.")], { affection: 4, trust: 2, flags: ["valurn-date-forestier-end:revanche"] }),
      Q("dvft-4b", "Garder l'osselet et le remercier pour la soirée, simplement.", "sangFroid", [V("Ne me remerciez pas. J'ai triché, perdu, et vous avez chanté. C'était parfait.", "neutral"), N("Il vous raccompagne jusqu'à la porte. Dehors, il fait froid. Il ne s'en plaint pas.")], { trust: 4, flags: ["valurn-date-forestier-end:osselet"] }),
    ]),
  ],
  imposture: [
    B([N("Valurn est devenu Messire Orbe, marchand de lunettes d'Al'Gratal, myope et veuf trois fois. Vous devez être quelqu'un. Hubert vous regarde avec le soupçon d'un tenancier qui a vu toutes les impostures."), V("Présentez-vous. Je vous écoute avec le plus grand intérêt, je ne vous connais pas du tout.", "charming")], [
      Q("dvfi-0a", "Devenir son associé en affaires de lunettes, plus compétente que lui.", "audace", [P("Je m'occupe de la vente. C'est moi qui vends. Lui, il casse les lunettes."), V("Calomnie ! Je les casse avec art.", "amused"), N("Deux clients s'approchent, sérieusement intéressés par des lunettes qui n'existent pas.")], { affection: 2 }),
      Q("dvfi-0b", "Jouer l'inspection des auberges venue vérifier la soupe.", "lucidite", [P("Inspection des auberges. On m'a signalé une soupe suspecte."), N("Hubert croise les bras. Il entre dans le jeu, terrible. Valurn rit si fort qu'il manque perdre son chapeau.")], { affection: 2, trust: 1 }),
    ]),
    B([N("Un client, un vrai marchand de verre, commence à poser des questions techniques à Messire Orbe. Valurn n'a aucune idée de ce qu'est un verre biconvexe."), V("Le verre biconvexe… est une question philosophique.", "surprised")], [
      Q("dvfi-1a", "Le sauver en inventant une explication délirante.", "audace", [P("Biconvexe, c'est quand le verre a deux opinions."), N("Le marchand vous regarde longtemps. Puis il note. Il a l'air convaincu. Valurn a les larmes aux yeux.")], { affection: 3 }),
      Q("dvfi-1b", "Le laisser se débattre seul, pour voir.", "sangFroid", [N("Valurn s'enfonce, superbement, dans une théorie des lentilles qui finit sur la tristesse des miroirs. Le marchand lui achète une consultation."), V("Vous m'avez laissé seul face à lui et j'ai gagné de l'argent. Je ne sais pas quoi en conclure.", "amused")], { trust: 2, coins: 2 }),
    ]),
    B([N("L'imposture dérape : le marchand veut passer commande. Cinquante paires. Avec acompte. Il sort sa bourse."), V("Bon. Nous avons un problème de réussite.", "neutral")], [
      Q("dvfi-2a", "Interrompre le jeu et avouer la vérité au marchand.", "sangFroid", [P("Monsieur, nous jouions. Il n'y a pas de lunettes. Pardon."), N("Le marchand rougit, puis rit, puis paie une tournée pour sauver la face. Valurn vous regarde avec une sorte de respect inquiet."), V("Vous savez arrêter un jeu. Moi, jamais. C'est une compétence que je n'ai pas.", "neutral")], { trust: 4 }),
      Q("dvfi-2b", "Pousser plus loin : accepter la commande et lui renvoyer l'acompte demain avec une lettre d'excuse signée Orbe.", "audace", [N("Vous prenez l'acompte, inscrivez l'adresse. Valurn signe « Orbe » d'une main tremblante de bonheur."), V("Demain, je rends l'argent avec une lettre de veuf ruiné. Ce sera mon chef-d'œuvre.", "charming")], { affection: 3, flags: ["valurn-orbe-letter"] }),
    ]),
    B([N("Le chapeau emprunté retourne à son propriétaire, toujours endormi. Valurn redevient Valurn, d'un geste, comme on retire un gant."), V("Vous savez ce qui est fascinant ? Ce soir, personne ne m'a demandé ce que je savais. On m'a demandé des lunettes.")], [
      Q("dvfi-3a", "Lui demander s'il aime être quelqu'un d'autre.", "lucidite", [V("J'aime ne pas être attendu. Orbe ne doit rien à personne, ne connaît personne, ne sait rien. C'est très reposant de ne rien savoir.", "neutral")], { trust: 3 }),
      Q("dvfi-3b", "Lui dire que vous préférez Valurn à Orbe.", "audace", [V("Vous avez tort, Orbe était veuf trois fois, il a de l'expérience. Mais merci.", "charming")], { affection: 3, desire: 1 }),
    ]),
    B([N("Hubert vous rend une chope oubliée et un regard qui dit qu'elle n'a rien cru. Dehors, la lanterne de l'auberge grésille."), V("Je vous dois une revanche d'identité. La prochaine fois, je choisis la vôtre.")], [
      Q("dvfi-4a", "Accepter, à condition de choisir la sienne aussi.", "audace", [V("Marché conclu. J'ai déjà peur.", "amused"), N("Il vous laisse le chapeau d'un autre client, oublié sur le banc, et refuse de vous dire à qui il appartient.")], { affection: 4, flags: ["valurn-date-forestier-end:identite"] }),
      Q("dvfi-4b", "Le remercier d'avoir su s'arrêter quand il fallait.", "sangFroid", [V("C'est vous qui avez su. Moi, j'ai suivi. Ça m'arrive rarement, je le note.", "neutral"), N("Il marche avec vous jusqu'au chemin, sans chapeau, sans nom d'emprunt.")], { trust: 4, flags: ["valurn-date-forestier-end:arret"] }),
    ]),
  ],
  fond: [
    B([N("La table du fond est petite et bancale. Valurn la cale avec un osselet volé à Gorn. Le bruit de la salle arrive étouffé, comme une mer."), V("Règle de cette table : on pose des questions, on n'est pas obligé de répondre. Je commence. Qu'est-ce que vous détestez manger ?")], [
      Q("dvff-0a", "Répondre franchement, avec une histoire.", "sangFroid", [P("Les navets. Une auberge entière m'en a servi pendant trois jours."), V("Les navets sont des pommes de terre qui ont perdu la foi. Je comprends votre traumatisme.", "amused")], { affection: 2, trust: 1 }),
      Q("dvff-0b", "Lui retourner la question avant de répondre.", "lucidite", [V("Moi ? Les fruits trop sucrés. Ils mentent sur leur prix.", "neutral"), N("Il répond vite. C'est la première fois que vous l'entendez répondre vite à quelque chose.")], { trust: 2 }),
    ]),
    B([N("La soupe refroidit. Valurn vous interroge sur votre manière de jouer, de choisir une route, de mentir quand il le faut. Il écoute vraiment, les coudes sur la table."), V("Dites-moi une chose de ce monde qui vous étonne encore. Pas une chose grave. Une chose bête.")], [
      Q("dvff-1a", "Lui parler des chats d'Al'Gratal qui dorment sur les étals.", "audace", [V("Les chats d'Al'Gratal sont des fonctionnaires. Ils ont un syndicat. Je n'ai jamais pu acheter leur silence.", "amused")], { affection: 3 }),
      Q("dvff-1b", "Lui parler de la façon dont les gens se saluent ici, trop longtemps.", "lucidite", [V("Trois formules, minimum. J'ai mis un an à les apprendre et je les utilise toutes mal, exprès.", "neutral")], { trust: 2, affection: 1 }),
    ]),
    B([N("Il vous raconte des voyages. Une ville où l'on vend l'eau au poids, une cour où il a été pris pour un ambassadeur, une nuit perdu dans un champ de pierres qui chantaient. Il ne parle ni de son père ni de sa famille."), V("Vous ne me demandez rien sur ma famille. Les gens me demandent toujours.", "neutral")], [
      Q("dvff-2a", "Lui dire que ce soir, ça ne vous intéresse pas.", "sangFroid", [V("Ce soir. Je note la précision. Vous négociez de façon redoutable.", "charming"), N("Il se détend d'une manière que vous ne lui connaissiez pas, les épaules plus basses.")], { trust: 4 }),
      Q("dvff-2b", "Lui demander plutôt quel voyage il referait.", "lucidite", [V("Le champ de pierres. Je n'ai jamais compris ce qu'elles chantaient. J'aimerais y retourner avec quelqu'un qui ne me croit pas.", "neutral")], { affection: 2, trust: 2 }),
    ]),
    B([N("La salle se vide. Hubert éteint les lampes une à une en vous regardant comme deux meubles qu'il faudra déplacer. Valurn sort une carte de sa poche, une seule, et la pose face cachée."), V("Dernière question. Vous la retournez si vous voulez savoir ce que je n'ai pas osé demander.")], [
      Q("dvff-3a", "Retourner la carte.", "audace", [N("Elle est blanche. Au dos, de son écriture : « Est-ce que vous reviendrez ? »"), V("C'est une question bête. Je l'ai écrite avant d'arriver, au cas où.", "neutral")], { affection: 3, desire: 1 }),
      Q("dvff-3b", "La laisser face cachée et lui dire de la poser à voix haute.", "sangFroid", [V("À voix haute ? C'est cruel.", "annoyed"), N("Il hésite, puis la pose. « Est-ce que vous reviendrez ? » C'est dit simplement, sans jeu."), V("Voilà. C'était plus difficile que prévu.", "neutral")], { trust: 4 }),
    ]),
    B([N("La porte de l'auberge grince. Dehors, les étoiles et le froid. Valurn garde la carte blanche entre deux doigts."), V("Rien ne vous oblige de répondre. C'est la règle de la table.")], [
      Q("dvff-4a", "Répondre oui.", "sangFroid", [V("Bien. Je ne vais pas en faire un contrat. Je vais seulement le savoir.", "neutral"), N("Il glisse la carte dans votre poche, où elle restera longtemps.")], { trust: 4, affection: 3, flags: ["valurn-date-forestier-end:carte"] }),
      Q("dvff-4b", "Répondre par une autre question : « Et vous ? »", "audace", [V("Moi ? Je suis déjà en train de réserver la table.", "charming"), N("Il rentre dans l'auberge parler à Hubert. Vous l'entendez marchander une table « pour une date que je ne connais pas encore ».")], { affection: 4, flags: ["valurn-date-forestier-end:question"] }),
    ]),
  ],
};

const RIVER: Record<string, ValurnDateBeat[]> = {
  imprevus: [
    B([N("Les traces mènent aux roseaux. Une loutre, très fière, est assise sur la tarte aux poires. Elle vous regarde comme un créancier."), V("Elle a mangé mon pain. Elle est assise sur ma tarte. Je vais négocier.", "annoyed")], [
      Q("dvri-0a", "Le laisser négocier avec la loutre.", "audace", [N("Valurn s'accroupit et propose à la loutre le fromage en échange de la tarte. La loutre prend le fromage, garde la tarte, et plonge."), V("Elle m'a eu. Une loutre. Je ne raconterai jamais ça à Thazran.", "annoyed")], { affection: 3 }),
      Q("dvri-0b", "Récupérer ce qui reste pendant qu'il la distrait.", "lucidite", [N("Vous sauvez la moitié de la tarte et le fromage. La loutre emporte le pain par principe."), V("Vous avez dépouillé une loutre. Je suis très impressionné.", "charming")], { trust: 2, affection: 1 }),
    ]),
    B([N("Le vent tourne. La pluie arrive par le fleuve, en rideau, sans prévenir. Le feu tremble."), V("Le feu. Mon feu. Que j'ai fait sans pacte. Il va mourir sous mes yeux.", "surprised")], [
      Q("dvri-1a", "Tendre la couverture au-dessus du feu à deux.", "sangFroid", [N("Vous tenez chacun un coin, bras levés, sous l'averse. Le feu survit. Vous, beaucoup moins. Valurn ruisselle et rit."), V("Je suis trempé et je n'ai jamais été aussi fier d'un feu.", "amused")], { affection: 3, trust: 1 }),
      Q("dvri-1b", "Courir chercher une bâche sous les charrettes voisines.", "audace", [N("Un charretier endormi vous prête une bâche contre un bout de tarte, payable plus tard. Valurn plante deux bâtons et tend la toile avec un savoir-faire inattendu."), V("J'ai dormi dehors plus souvent que je ne le dis.", "neutral")], { trust: 2, affection: 2 }),
    ]),
    B([N("La pluie cesse. Tout est mouillé, sauf le feu et un coin de couverture. Valurn frotte ses bottes, mécontent."), V("Je suis un démonologue respecté. Je viens d'être battu par une loutre et un nuage.")], [
      Q("dvri-2a", "Lui proposer de faire sécher ses bottes près du feu, et ses chaussettes, et sa dignité.", "audace", [N("Il retire ses bottes avec une solennité de cour. Ses chaussettes ont des trous."), V("Vous n'avez rien vu. Je l'exige.", "annoyed")], { affection: 3, desire: 1 }),
      Q("dvri-2b", "Lui raconter votre pire nuit de voyage pour qu'il se sente moins seul.", "sangFroid", [V("La vôtre est pire. Je me sens beaucoup mieux, merci.", "amused")], { trust: 3 }),
    ]),
    B([N("Il reste la moitié de la tarte, écrasée. Vous la partagez avec les doigts. Valurn mange lentement, comme si c'était un festin de palais."), V("C'est la meilleure tarte de ma vie. Je refuse d'expliquer pourquoi.")], [
      Q("dvri-3a", "Lui dire que c'est parce qu'il l'a perdue puis reprise.", "lucidite", [V("Peut-être. Ou parce que je l'ai partagée avec quelqu'un qui a dépouillé une loutre. Les deux.", "neutral")], { trust: 3 }),
      Q("dvri-3b", "Lui voler le dernier morceau.", "audace", [V("Vous êtes pire que la loutre.", "amused"), N("Il vous laisse faire, sans lutter, et c'est peut-être le plus beau compliment de la soirée.")], { affection: 3 }),
    ]),
    B([N("Le ciel se dégage. Le fleuve brille. Vous êtes trempés, rassasiés à moitié, et Valurn n'a jamais eu l'air aussi peu élégant."), V("Rien ne s'est passé comme prévu. C'est la meilleure soirée que j'aie organisée, et je n'ai rien organisé.")], [
      Q("dvri-4a", "Proposer de dormir là, sous la bâche, à deux.", "sangFroid", [V("Sous une bâche empruntée, près d'une loutre hostile. Oui. Je n'ai jamais eu de meilleure offre.", "charming"), N("Vous dormez dos contre dos. Au matin, la loutre a laissé une arête de poisson devant le feu, en paiement.")], { affection: 4, trust: 2, flags: ["valurn-date-river-end:bache"] }),
      Q("dvri-4b", "Rentrer de nuit, à pied, en chantant pour éloigner les loutres.", "audace", [V("Je ne connais aucune chanson contre les loutres. Je vais en composer une.", "amused"), N("Il en compose trois. Toutes sont mauvaises. Vous les connaissez par cœur en arrivant.")], { affection: 4, flags: ["valurn-date-river-end:chanson"] }),
    ]),
  ],
  etoiles: [
    B([N("L'étal est ouvert. Valurn vend en premier : « Une minute de silence absolu. Rare. Je n'en ai jamais eu de ma vie. » Il demande trois souvenirs en échange."), V("Vous achetez ? C'est une affaire.")], [
      Q("dvre-0a", "Acheter sa minute de silence, payée d'un souvenir d'enfance que vous inventez.", "audace", [N("Vous payez avec un souvenir inventé, très beau. Il le sait. Il accepte. La minute de silence dure quarante secondes : il craque avant."), V("Je vous rembourse vingt secondes. Je suis un commerçant honnête.", "amused")], { affection: 3 }),
      Q("dvre-0b", "Marchander : une demi-minute contre une chanson.", "lucidite", [N("Vous chantez une chanson à moitié. Il garde le silence une demi-minute, entière. Vous l'entendez respirer."), V("C'était plus long que prévu. Le silence, je veux dire.", "neutral")], { trust: 2, affection: 1 }),
    ]),
    B([N("À votre tour de vendre. Valurn s'assied en client exigeant, une main sur la hanche. Il veut un horizon."), V("Vendez-moi un horizon. Je paie bien. Je paie en anecdotes inavouables.")], [
      Q("dvre-1a", "Lui vendre la ligne du fleuve à l'aube, qu'il ne verra pas puisqu'il dort tard.", "audace", [V("Vous me vendez quelque chose que je ne verrai jamais. C'est du génie commercial.", "charming"), N("Il paie avec une anecdote : la fois où il a été pris pour un ambassadeur et a signé un traité de pêche.")], { affection: 3 }),
      Q("dvre-1b", "Lui vendre un horizon de votre monde dont vous ne vous souvenez qu'à moitié.", "sangFroid", [P("Une ligne de toits, quelque part. Je ne sais plus où. Elle était orange, le soir."), N("Il ne plaisante pas. Il paie avec la seule chose qu'il garde sur lui sans raison : un bouton d'argent sans manteau."), V("Gardez-le. Il n'a jamais servi à rien. Comme votre horizon. Ils iront bien ensemble.", "neutral")], { trust: 4 }),
    ]),
    B([N("Les enchères montent. Valurn met en vente « la vérité sur la tarte aux poires ». Vous découvrez que le marché devient révélateur : il ne vend que des choses légères, et les vend très cher."), V("Qui dit mieux ? Un souvenir ? Un aveu ? Une plaisanterie sur Iriana que je ne répéterai jamais ?")], [
      Q("dvre-2a", "Changer les règles : désormais, on ne peut vendre que ce qu'on regretterait de perdre.", "lucidite", [V("Vous changez les règles en cours de partie. C'est illégal, et c'est moi qui ai inventé l'illégalité ici.", "annoyed"), N("Il réfléchit longtemps. Puis il met en vente : « Le droit de me voir perdre aux cartes. » Il ne plaisante qu'à moitié.")], { trust: 4 }),
      Q("dvre-2b", "Surenchérir de façon absurde pour la vérité sur la tarte.", "audace", [N("Vous offrez trois étoiles, un fleuve et une loutre. Il accepte. La vérité : il avait goûté la tarte dans la boutique, et l'avait trouvée si bonne qu'il en avait mangé une entière avant de venir."), V("Vous avez payé cher pour une gourmandise. J'aime vos priorités.", "amused")], { affection: 3 }),
    ]),
    B([N("Le marché ferme. Valurn compte les gains sur ses doigts : une chanson, un horizon, un faux souvenir, une demi-minute. Il refait le compte deux fois."), V("Je suis riche. Je ne peux rien acheter avec. C'est une fortune parfaitement inutile.")], [
      Q("dvre-3a", "Lui dire que c'est peut-être la seule fortune qu'on ne peut pas lui voler.", "sangFroid", [V("On peut tout voler. Mais il faudrait savoir ce que c'est, et je ne vous le dirai pas.", "neutral")], { trust: 3 }),
      Q("dvre-3b", "Lui proposer de tout rejouer, demain, à l'envers.", "audace", [V("À l'envers ? Vous achetez, je vends ce que vous m'avez vendu ? C'est vertigineux. J'accepte.", "charming")], { affection: 3 }),
    ]),
    B([N("La nuit tourne. Les étoiles sont toutes à leur place, sauf une qui file et que personne ne vend."), V("Celle-là, on la laisse. Elle n'est à personne.")], [
      Q("dvre-4a", "Lui offrir quand même la filante, gratuitement.", "sangFroid", [V("Gratuitement. Vous me faites un cadeau sans valeur marchande. Je vais devoir le garder.", "neutral"), N("Il tend la main vers le ciel, fait semblant de la ranger dans sa poche, et ne plaisante pas en le faisant.")], { affection: 4, trust: 2, flags: ["valurn-date-river-end:filante"] }),
      Q("dvre-4b", "Lui réclamer un dernier paiement : la vraie raison de cette halte.", "lucidite", [V("La vraie raison ? Je ne voulais pas rentrer seul. Voilà. C'était trop cher, je vous le facture.", "neutral"), N("Il rit, après. Pas avant.")], { trust: 4, flags: ["valurn-date-river-end:raison"] }),
    ]),
  ],
  braise: [
    B([N("Le feu prend sa taille de croisière. Valurn retire ses gants, les pose sur une pierre et tend les mains vers la chaleur comme quelqu'un qui n'en a pas l'habitude."), V("Parlez-moi de quelque chose que vous aimez ici. Pas ce que vous devez aimer. Ce que vous aimez.")], [
      Q("dvrb-0a", "Lui parler du pain du matin à Al'Gratal.", "sangFroid", [V("Le pain du matin. Le boulanger de la rue du Croissant ouvre à l'aube et le vend en chantant faux. Je le connais. Il me fait crédit. C'est le seul.", "neutral")], { affection: 2, trust: 2 }),
      Q("dvrb-0b", "Lui parler des inconnus qui vous saluent sans raison.", "lucidite", [V("Ici, les gens saluent. Chez moi, quand on vous saluait, c'était un avertissement. J'ai mis longtemps à rendre les saluts sans chercher le piège.", "neutral")], { trust: 3 }),
    ]),
    B([N("Il raconte une ville lointaine où les ponts se paient en chansons, et les deux fois où il a dû chanter pour rentrer. Il imite le péager. Il est très drôle, et il le sait."), V("Et vous ? Vous avez voyagé ? Avant ? Je ne demande pas d'où. Seulement si vous avez vu des ponts.")], [
      Q("dvrb-1a", "Lui avouer que vous ne vous en souvenez pas, mais que vous avez l'impression d'en avoir vu beaucoup.", "sangFroid", [V("Alors vous êtes comme moi devant votre fragment : la grammaire, pas la phrase. C'est une bonne compagnie, l'incertitude, quand on la partage.", "neutral")], { trust: 4 }),
      Q("dvrb-1b", "Inventer un pont absurde pour le faire rire.", "audace", [P("Un pont qui ne laisse passer que les gens tristes."), V("On s'y bousculerait. J'en connais trois qui y vivraient.", "amused")], { affection: 3 }),
    ]),
    B([N("Un hibou traverse. Le fleuve fait un bruit de conversation lointaine. Valurn se tait longtemps, ce qui ne lui arrive presque jamais."), V("C'est étrange. D'habitude, le silence me démange. Ici, il est à sa place.")], [
      Q("dvrb-2a", "Ne pas répondre, et rester dans ce silence avec lui.", "sangFroid", [N("Vous ne dites rien. Il ne dit rien. Le feu parle pour vous deux, en craquant."), V("Merci de ne pas avoir rempli.", "neutral")], { trust: 4 }),
      Q("dvrb-2b", "Lui demander ce qui le démange d'habitude.", "lucidite", [V("Le sentiment de manquer quelque chose. Une nouvelle, un marché, une porte. Ici, il n'y a rien à manquer. C'est reposant comme une défaite qu'on n'a pas à payer.", "neutral")], { trust: 3, affection: 1 }),
    ]),
    B([N("Il est très tard. La braise rougit. Valurn la regarde, puis vous."), V("Je vais vous dire une chose sans plaisanter, et ensuite je plaisanterai, pour compenser. J'aime votre façon d'écouter. Voilà.")], [
      Q("dvrb-3a", "Lui dire ce que vous aimez chez lui, aussi simplement.", "audace", [P("J'aime quand vous vous trompez et que vous continuez quand même."), V("C'est très injuste de me dire ça près d'un feu. Je n'ai nulle part où cacher ma tête.", "neutral")], { affection: 4, desire: 1 }),
      Q("dvrb-3b", "Attendre la plaisanterie promise.", "lucidite", [V("La plaisanterie… J'ai oublié. C'est la première fois de ma vie. C'est dangereux, ce que vous faites.", "amused")], { affection: 2, trust: 2 }),
    ]),
    B([N("La dernière braise tient encore. Valurn y pose une brindille, pour voir si elle prendra. Elle prend, à peine."), V("Elle tiendra jusqu'à l'aube, si personne ne la regarde trop.")], [
      Q("dvrb-4a", "Veiller la braise à deux jusqu'au matin.", "sangFroid", [V("À deux. Je vous préviens, je ronfle quand je suis heureux. On m'a dit.", "charming"), N("Il ne ronfle pas. Ou vous dormez avant de l'entendre. Au matin, la braise est encore tiède.")], { trust: 4, affection: 3, flags: ["valurn-date-river-end:veille"] }),
      Q("dvrb-4b", "Couvrir la braise de cendre pour qu'elle survive au voyage du retour.", "lucidite", [V("Vous voulez l'emporter ? Elle va mourir dans votre poche.", "surprised"), N("Vous la couvez dans une boîte de métal. Elle survit jusqu'à Al'Gratal. Valurn rallume sa lampe avec, sans rien dire, et la garde allumée trois jours.")], { trust: 3, affection: 3, flags: ["valurn-date-river-end:boite"] }),
    ]),
  ],
};

export function valurnDateBeat(sceneId: string, round: number, picks: readonly string[] = []): ValurnDateBeat | undefined {
  const table = sceneId === "date-valurn-forestier" ? FORESTIER : sceneId === "date-valurn-river" ? RIVER : undefined;
  if (!table) return undefined;
  const first = picks[0] || "";
  const key = first.split("-").pop() || "";
  return table[key]?.[round];
}

export const VALURN_DATE_BEATS = { FORESTIER, RIVER };
