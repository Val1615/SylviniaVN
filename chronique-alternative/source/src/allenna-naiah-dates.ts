import type { ChoiceData, DialogueLine } from "./game-data";
import { AL, C, NA, P, T, TRIO, W } from "./allenna-naiah-kit";
import type { ANSceneData } from "./allenna-naiah-scenes";

/**
 * Trois rendez-vous autonomes à trois, jouables dans n’importe quel ordre après Q7.
 * Chacun : introduction (mémoire des autres soirées, orientation de Q7),
 * trois branches avec suite propre, contribution de {player}, puis une fin qui
 * propose de prolonger (extension intime non graphique) ou de rentrer.
 * Aucun état de GROUP_DATES n’est modifié : tout vit dans l’état AN.
 */

export type ANDateId = "group-date-allenna-naiah-lake" | "group-date-allenna-naiah-relay" | "group-date-allenna-naiah-home";
export const AN_DATE_IDS: readonly ANDateId[] = ["group-date-allenna-naiah-lake", "group-date-allenna-naiah-relay", "group-date-allenna-naiah-home"];
export const AN_DATE_SHORT: Record<ANDateId, "lake" | "relay" | "home"> = {
  "group-date-allenna-naiah-lake": "lake", "group-date-allenna-naiah-relay": "relay", "group-date-allenna-naiah-home": "home",
};
export const AN_DATE_BRANCHES: Record<ANDateId, readonly [string, string, string]> = {
  "group-date-allenna-naiah-lake": ["barque", "rive", "lucioles"],
  "group-date-allenna-naiah-relay": ["table", "des", "pluie"],
  "group-date-allenna-naiah-home": ["cuisine", "objets", "toit"],
};
export const AN_DATE_TITLES: Record<ANDateId, string> = {
  "group-date-allenna-naiah-lake": "Le lac de brume",
  "group-date-allenna-naiah-relay": "La halte du Fleuve bleu",
  "group-date-allenna-naiah-home": "Un seuil pour trois",
};
export const AN_BRANCH_TITLES: Record<string, string> = {
  barque: "La barque sans rames", rive: "Les pieds dans l’eau", lucioles: "Le conte des lucioles",
  table: "La table commune", des: "Les dés du relais", pluie: "La pluie sur le toit",
  cuisine: "Le repas à six mains", objets: "Les objets du seuil", toit: "La nuit au-dessus du logis",
};

export type ANDateContext = {
  done: readonly ANDateId[];
  orientation?: "partenariat" | "confiance" | "complicite";
  /** Rendez-vous déjà vécus avec leur branche, pour les rappels. */
  branches: Readonly<Partial<Record<ANDateId, string>>>;
  /** Prolongation possible (affection et confiance suffisantes chez les deux, ou dev). */
  eligible: boolean;
  home?: { name: string; location: string; spot: string; background?: string; keepsakes: readonly string[] };
};

const ext = (date: ANDateId, branch: string) => `an-ext:${AN_DATE_SHORT[date]}:${branch}`;

function ending(date: ANDateId, branch: string, ctx: ANDateContext, lines: DialogueLine[], prolong: [string, DialogueLine[]], rest: [string, DialogueLine[]], close: [string, DialogueLine[]]): { intro: DialogueLine[]; choices: ChoiceData[] } {
  const id = `${date}-${branch}`;
  const choices: ChoiceData[] = ctx.eligible
    ? [
        C(`${id}-prolonger`, prolong[0], "audace", prolong[1], { al: { affection: 1 }, na: { trust: 1 } }, { launchesIntimacy: ext(date, branch) }),
        C(`${id}-attendre`, rest[0], "sangFroid", rest[1], { al: { trust: 1 }, na: { trust: 1 } }),
      ]
    : [C(`${id}-rentrer`, close[0], "sangFroid", close[1], { al: { trust: 1 }, na: { affection: 1 } })];
  return { intro: lines, choices };
}

/* ======================================================================== */
/* Le lac de brume                                                          */
/* ======================================================================== */

function lake(ctx: ANDateContext): ANSceneData {
  const D: ANDateId = "group-date-allenna-naiah-lake";
  const first = ctx.done.length === 0;
  const relayBranch = ctx.branches["group-date-allenna-naiah-relay"];
  return {
    id: D, title: AN_DATE_TITLES[D], location: "forbidden", spot: "forbidden-crossroads", cast: TRIO, music: "star-night-soft", character: "naiah", period: "soirée",
    background: "/assets/cross/hylee-naiah-search/route_river.webp",
    intro: [
      T("Le lac de brume n’apparaît sur aucune carte parce qu’il ne reste jamais au même endroit. Ce soir, Naïah l’a installé au creux d’une combe, entre deux pins couchés ; l’eau y est noire et lisse, et la brume en lèche la surface sans jamais la toucher.", TRIO),
      W(first,
        NA("Premier rendez-vous officiel. J’ai rangé la forêt. Tu as vu ? Il n’y a plus une seule ronce sur le chemin. C’est épuisant d’être accueillante.", "laugh"),
        W(Boolean(relayBranch),
          NA("Après la halte du fleuve, j’ai voulu te montrer de l’eau qui ne coule nulle part. Elle reste où je lui dis de rester. Contrairement à certaines.", "smirk"),
          NA("Encore une soirée à trois. Je commence à prendre des habitudes, et je déteste prendre des habitudes. Approche.", "smirk"))),
      T("Allenna est arrivée par le sentier que sa sœur a fait pousser pour elle, sans armure, une cape grise sur une chemise de lin. Elle tient à la main une lanterne qu’elle n’a pas allumée."),
      AL(W(ctx.orientation === "partenariat", "J’ai prévenu ma patrouille que je serais en reconnaissance. Ce qui est vrai. Je reconnais le terrain.", "Je n’ai prévenu personne. C’est une sensation étrange. Agréable, je crois."), "shy"),
      NA("Elle a apporté une lanterne dans ma forêt. Comme si je ne savais pas faire de la lumière.", "smirk"),
      T("Naïah souffle sur ses doigts. Trois lucioles se décrochent de sa paume, montent, et viennent se poser sur la lanterne éteinte d’Allenna, qui se met à briller d’un vert très doux."),
      AL("…Merci.", "smile"),
      NA("Ne t’habitue pas.", "neutral"),
    ],
    choices: [
      C(`${D}-barque`, "Monter dans la vieille barque échouée sur la rive, qui n’a plus de rames", "audace", [
        P("Il y a une barque. Elle n’a pas de rames, mais elle a trois places."),
        NA("Elle n’a pas besoin de rames. Elle a moi.", "smirk"),
      ], { na: { affection: 2 }, al: { affection: 1 } }, { followUp: [
        { intro: [
          T("La barque glisse sans bruit vers le milieu du lac, poussée par un courant que personne ne voit. Allenna s’assoit à la poupe, dos droit, mains sur les genoux, comme sur un banc de conseil."),
          NA("Tu peux t’adosser, tu sais. Le lac ne va pas te faire un rapport.", "laugh"),
          T("Sous la surface, des poissons d’illusion se mettent à tourner, argentés, lents, et chacun porte sur le flanc une petite tache violette. Allenna les suit des yeux malgré elle."),
          AL("Il y en avait de semblables dans le bassin du palais. Tu passais des heures à les compter.", "troubled"),
          NA("Je les comptais parce qu’ils changeaient de nombre. Personne ne me croyait.", "neutral"),
        ], choices: [
          C(`${D}-barque-croire`, "Dire à Naïah que vous, vous l’auriez crue", "resonance", [
            P("Moi, je t’aurais crue. Et j’aurais demandé lequel disparaissait."),
            NA("Le plus gros. Toujours le plus gros. Il allait se cacher sous la fontaine.", "laugh"),
            AL("…Il y avait une grille sous la fontaine. Il passait dans le bassin des cuisines.", "thinking"),
            NA("Tu le savais ?", "angry"),
            AL("Je l’ai découvert l’année dernière. J’ai pensé à toi.", "shy"),
          ], { na: { trust: 2, affection: 1 }, al: { affection: 1 }, bond: 1 }),
          C(`${D}-barque-adosser`, "Vous adosser contre le bord et laisser la barque dériver sans parler", "sangFroid", [
            T("Vous vous adossez. Au bout d’un long moment, Allenna fait de même, avec la lenteur de quelqu’un qui retire une pièce d’armure dont elle avait oublié le poids."),
            T("Naïah, entre vous deux, ramène ses genoux contre elle et pose le menton dessus. Personne ne parle. La barque tourne sur elle-même comme une aiguille qui a renoncé au nord."),
          ], { al: { trust: 2 }, na: { trust: 1 } }),
        ] },
        ending(D, "barque", ctx, [
          T("La barque revient seule vers la rive quand la lune passe derrière les pins. Naïah saute la première, sans se mouiller les pieds ; Allenna, elle, met une botte dans l’eau, et ne dit rien."),
          NA("J’ai un abri sous le saule, au bord. Des couvertures, un feu qui ne fume pas. On n’est pas obligés de rentrer.", "neutral"),
          AL("Personne n’est obligé de rien. Je le précise parce que c’est la règle.", "neutral"),
        ], ["Rester sous le saule, si elles en ont envie toutes les deux", [
          P("Je reste, si vous le voulez toutes les deux. Dites-le, l’une et l’autre."),
          NA("Je le veux. Pour la présence. Le reste, je verrai.", "neutral"),
          AL("Je le veux aussi.", "shy"),
        ]], ["Proposer de garder cette envie pour une autre nuit", [
          P("Pas ce soir. Je veux garder cette barque intacte dans ma tête. On aura d’autres nuits."),
          AL("Une autre nuit, alors. Je note.", "smile"),
          NA("Elle note tout. Même les promesses qu’on ne fait pas.", "smirk"),
        ]], ["Raccompagner Allenna jusqu’au sentier et souhaiter bonne nuit à Naïah", [
          P("Je raccompagne Allenna jusqu’au sentier. Bonne nuit, Naïah. Merci pour le lac."),
          NA("Le lac te remercie aussi. Il ne le dira pas, il est timide.", "smirk"),
        ]]),
      ] }),
      C(`${D}-rive`, "Retirer vos bottes et marcher dans l’eau froide au bord de la rive", "sangFroid", [
        P("L’eau doit être glacée. Je veux savoir à quel point."),
        AL("C’est une très mauvaise idée.", "stern"),
        NA("C’est donc une excellente idée. Bottes, commandante.", "laugh"),
      ], { na: { affection: 1 }, al: { trust: 1 } }, { followUp: [
        { intro: [
          T("L’eau mord les chevilles, puis devient étrangement douce, comme si le lac s’excusait. Naïah marche à côté de vous, ses pieds nus ne laissant presque aucune onde."),
          T("Allenna reste sur la rive, bottes aux pieds, bras croisés. Puis elle s’assoit, défait ses lacets avec une méthode d’intendante, aligne ses bottes côte à côte, et entre dans l’eau d’un pas réglementaire."),
          AL("Elle est froide.", "stern"),
          NA("Quelle découverte. Je vais la faire graver sur un monument.", "smirk"),
          T("Allenna lui répond par une gerbe d’eau, d’un geste si rapide que vous ne l’avez pas vu venir. Naïah reste figée, trempée de la tête aux épaules, la bouche ouverte."),
        ], choices: [
          C(`${D}-rive-camp`, "Prendre le parti de Naïah et arroser Allenna à votre tour", "audace", [
            P("Naïah, je suis avec toi."),
            T("La bataille dure trois minutes et n’a aucun vainqueur. À la fin, Allenna rit, vraiment, un rire bref et rauque qu’elle cache aussitôt dans sa manche."),
            NA("Elle a ri. Témoin. Tu es témoin.", "laugh"),
          ], { na: { affection: 2 }, al: { affection: 2 }, bond: 1 }),
          C(`${D}-rive-cape`, "Sortir de l’eau et tendre votre cape à Naïah, qui grelotte en riant", "resonance", [
            P("Viens. Tu claques des dents."),
            T("Naïah s’enroule dans votre cape jusqu’au nez. Allenna, sans un mot, ajoute la sienne par-dessus, puis s’assoit à côté d’elle pour lui frotter le dos, vite et fort, comme on réchauffe une recrue."),
            NA("Tu frottes comme si tu voulais me poncer.", "smirk"),
            AL("Ça marche, non ?", "smile"),
          ], { na: { trust: 2 }, al: { affection: 1 }, bond: 1 }),
        ] },
        ending(D, "rive", ctx, [
          T("Vos pieds sèchent près d’un feu sans fumée que Naïah a allumé d’un claquement de doigts. Les capes humides fument doucement sur une branche."),
          AL("Nous devrions rentrer. Logiquement.", "neutral"),
          NA("Logiquement. Sous le saule, il y a des couvertures sèches et de la place pour trois. Logiquement aussi.", "smirk"),
        ], ["Accepter les couvertures sèches, si chacune le souhaite vraiment", [
          P("Les couvertures, si vous le souhaitez toutes les deux. Personne ne reste par politesse."),
          AL("Je reste par choix.", "shy"),
          NA("Moi, je reste parce que c’est chez moi. Et parce que oui.", "neutral"),
        ]], ["Remercier et garder la suite pour une prochaine fois", [
          P("Je préfère rentrer les pieds secs et le cœur plein. La suite attendra une autre lune."),
          NA("Les pieds secs. Tu es d’un romantisme…", "laugh"),
          AL("C’est sage.", "smile"),
        ]], ["Rentrer avant que le froid ne revienne", [
          P("Je rentre avant que le lac ne change d’avis. Merci à toutes les deux."),
          AL("Je vous raccompagne jusqu’à la lisière.", "neutral"),
        ]]),
      ] }),
      C(`${D}-lucioles`, "Demander à Naïah ce que racontent les lucioles qui dorment sur l’eau", "resonance", [
        P("Elles dorment sur l’eau. Elles racontent quelque chose, non ?"),
        NA("Tout raconte quelque chose. Celles-là racontent une vieille histoire. Tu veux la voir ?", "thinking"),
        AL("Elle demande ton accord. Elle ne le faisait jamais, avant.", "neutral"),
      ], { na: { trust: 2 }, al: { trust: 1 } }, { followUp: [
        { intro: [
          T("Vous acceptez. Naïah plonge les mains dans l’eau ; les lucioles se lèvent toutes ensemble et dessinent, au-dessus du lac, deux petites silhouettes qui courent dans un couloir de pierre noire."),
          NA("Celle qui court devant, c’est moi. Celle qui suit avec une épée en bois trop grande, c’est l’héritière, à huit ans, qui croit qu’on la poursuit.", "laugh"),
          AL("On nous poursuivait. Le maître d’armes.", "stern"),
          NA("Parce que tu avais caché son épée dans la citerne.", "smirk"),
          AL("C’est toi qui l’avais cachée.", "angry"),
          NA("Détail.", "laugh"),
          T("Les silhouettes de lumière s’arrêtent au bout du couloir, essoufflées, et se prennent la main. Puis elles s’éteignent, une luciole après l’autre."),
        ], choices: [
          C(`${D}-lucioles-demander`, "Demander à Allenna si elle se souvient de la suite", "lucidite", [
            P("Et après ? Le maître d’armes vous a trouvées ?"),
            AL("Il nous a trouvées. J’ai dit que c’était moi. Elle n’a rien dit.", "troubled"),
            NA("Je n’ai rien dit parce que j’avais huit ans et que j’étais lâche. Je te le dis maintenant. Merci.", "sad"),
            T("Allenna ne répond pas. Elle tend la main vers sa sœur, s’arrête à mi-chemin, et laisse finalement sa paume posée sur la mousse entre elles deux. Naïah y pose deux doigts."),
          ], { al: { trust: 2, affection: 1 }, na: { trust: 2 }, bond: 2 }),
          C(`${D}-lucioles-applaudir`, "Applaudir doucement le spectacle, pour laisser le souvenir sur une note légère", "audace", [
            T("Vous applaudissez trois fois, à mi-voix. Naïah se lève et salue comme une actrice de foire, une main sur le cœur."),
            NA("Merci, merci. Prochaine représentation : la fois où elle est tombée dans le bassin aux poissons.", "laugh"),
            AL("Il n’y aura pas de prochaine représentation.", "stern"),
            NA("Il y en aura une la semaine prochaine.", "smirk"),
          ], { na: { affection: 2 }, al: { affection: 1 } }),
        ] },
        ending(D, "lucioles", ctx, [
          T("La dernière luciole s’est posée sur l’épaule d’Allenna. Elle ne la chasse pas."),
          NA("Je pourrais en raconter d’autres. Sous le saule, au chaud. Ou pas. Je ne sais pas ce que tu veux.", "thinking"),
          AL("Elle parle de toi. Et un peu de moi.", "shy"),
        ], ["Rester écouter les autres histoires, à trois, sous le saule", [
          P("Raconte-les-moi sous le saule. Allenna, tu… vous restez aussi ?"),
          AL("Je reste. Et vous pouvez me tutoyer, ce soir. Seulement ce soir.", "shy"),
          NA("Seulement ce soir. Elle dit ça depuis qu’elle a six ans.", "smirk"),
        ]], ["Garder les histoires suivantes pour une autre veillée", [
          P("Garde les autres pour une prochaine fois. J’aime l’idée qu’il en reste."),
          NA("Une réserve d’histoires. Tu caches bien ta ruse.", "smirk"),
        ]], ["Saluer les lucioles et rentrer par le sentier", [
          P("Merci pour le conte. Je rentre avec, dans ma poche."),
          NA("Ne l’écrase pas en t’asseyant.", "laugh"),
        ]]),
      ] }),
    ],
    beats: [],
  };
}

/* ======================================================================== */
/* La halte du Fleuve bleu                                                  */
/* ======================================================================== */

function relay(ctx: ANDateContext): ANSceneData {
  const D: ANDateId = "group-date-allenna-naiah-relay";
  const lakeBranch = ctx.branches["group-date-allenna-naiah-lake"];
  return {
    id: D, title: AN_DATE_TITLES[D], location: "river-halt", spot: "river-halt", cast: TRIO, music: "forestier-ost", character: "allenna", period: "soirée",
    background: "/assets/backgrounds/forestier_inn.webp",
    intro: [
      T("La halte du Fleuve bleu tient dans une grange de pierre où s’arrêtent les convois des montagnes. On y mange à de longues tables, sous des poutres noircies où pendent des lanternes et des bottes de sauge.", TRIO),
      T("Naïah n’y est jamais entrée. Elle se tient sur le seuil, capuche baissée sur ses cheveux bleu nuit, et regarde la salle comme une forêt dont elle ne connaîtrait aucun arbre."),
      AL("Personne ici ne connaît ton visage. Les convoyeurs ne regardent que leur assiette et le temps qu’il fera demain.", "neutral"),
      NA("Ils regardent aussi la commandante obscurcie qui vient de s’asseoir près du feu. Discrétion parfaite.", "smirk"),
      W(lakeBranch === "lucioles",
        AL("Tu m’as montré des lucioles qui se souviennent. Ce soir, je te montre une salle qui oublie tout dès que les gens repartent. C’est reposant.", "smile"),
        AL("J’ai choisi cet endroit parce qu’on peut en sortir par trois portes. Je l’avoue. C’est aussi parce que le pain y est bon.", "neutral")),
      T("L’aubergiste pose devant vous trois bols de soupe d’orge, un pain rond et un pichet de cidre sans demander. Naïah fixe la soupe comme une énigme."),
      NA("Ça se mange avec quoi ?", "thinking"),
      P("Une cuillère. Elle est à côté de ta main."),
      NA("Je sais ce qu’est une cuillère. Je demandais par politesse.", "angry"),
    ],
    choices: [
      C(`${D}-table`, "Rester à la grande table commune, au milieu des convoyeurs", "audace", [
        P("On reste à la grande table. Tu voulais voir des gens qui ne te connaissent pas."),
        NA("Je voulais les voir de loin. Enfin. Soit.", "neutral"),
      ], { na: { trust: 1 }, al: { affection: 1 } }, { followUp: [
        { intro: [
          T("Une convoyeuse aux mains énormes vous demande d’où vous venez. Naïah répond « de la forêt », très sérieusement. La femme hoche la tête, comme si c’était un village comme un autre."),
          T("On parle de la crue de l’an dernier, d’un mulet qui ouvre les portes avec ses dents, du prix du sel. Naïah écoute tout, le menton dans la main, avec une concentration qu’elle réserve d’ordinaire aux runes."),
          AL("Elle n’a jamais mangé à une table de gens ordinaires. Au palais, on mangeait seules, servies, en silence.", "troubled"),
          T("Allenna l’a murmuré à votre seule intention, sans quitter sa sœur des yeux. Naïah, à cet instant, éclate de rire à une histoire de mulet."),
        ], choices: [
          C(`${D}-table-histoire`, "Raconter vous aussi une histoire à la tablée, pour que Naïah n’ait pas à parler", "audace", [
            P("Moi, j’ai connu un cheval qui refusait de traverser les ponts le mardi."),
            T("La tablée s’esclaffe, vous interroge, conteste le mardi. Naïah vous jette un regard bref, un remerciement qu’elle n’aurait jamais formulé, puis renchérit sur le cheval avec une mauvaise foi magnifique."),
          ], { na: { affection: 2, trust: 1 }, al: { affection: 1 } }),
          C(`${D}-table-sel`, "Laisser Naïah poser ses propres questions sur le prix du sel, et l’écouter apprendre", "lucidite", [
            T("Vous vous taisez. Naïah demande pourquoi le sel coûte plus cher en hiver, puis pourquoi les routes gèlent, puis pourquoi les convois ne passent pas par la forêt. La convoyeuse répond à tout, ravie."),
            NA("Parce que la forêt mange les convois. C’est vrai, ça ?", "thinking"),
            AL("C’était vrai. Ça l’est moins.", "smile"),
          ], { na: { trust: 2 }, al: { trust: 1 }, bond: 1 }),
        ] },
        ending(D, "table", ctx, [
          T("La salle se vide peu à peu. L’aubergiste propose une chambre sous le toit, la seule libre, avec un grand lit et un banc sous la fenêtre."),
          AL("Une chambre, trois personnes. Je peux dormir sur le banc. J’ai dormi sur pire.", "neutral"),
          NA("Ou on monte, et on voit. Sans plan. Je sais que tu détestes ça.", "smirk"),
        ], ["Monter dans la chambre sous le toit, à condition que chacune le veuille", [
          P("On monte. Et on redescend dès que l’une de vous le souhaite, sans explication."),
          AL("Accordé.", "shy"),
          NA("Accordé, dit la commandante. Moi je dis oui, simplement.", "neutral"),
        ]], ["Proposer de garder la chambre pour une prochaine halte", [
          P("Gardons cette chambre pour une autre halte. Ce soir, la table me suffit."),
          AL("La prochaine halte. Elle existera. Je la planifie déjà.", "smile"),
        ]], ["Prendre congé et laisser les deux sœurs à leurs chambres séparées", [
          P("Je vous laisse à vos chambres. Merci pour la soupe et le mulet."),
          NA("Le mulet te salue.", "laugh"),
        ]]),
      ] }),
      C(`${D}-des`, "Accepter l’invitation d’une table de joueurs de dés, près de l’âtre", "audace", [
        P("Ils jouent aux dés, près de l’âtre. On s’assoit ?"),
        AL("Naïah ne joue pas aux dés.", "stern"),
        NA("Naïah joue à tout. Naïah gagne à tout.", "smirk"),
      ], { na: { affection: 2 } }, { followUp: [
        { intro: [
          T("Trois parties plus tard, Naïah a gagné onze fois. Les joueurs commencent à se regarder entre eux. Allenna fixe les dés avec une intensité de juge."),
          AL("Les dés ne retombent pas six onze fois de suite.", "stern"),
          NA("Ils sont peut-être fatigués de tomber sur autre chose.", "smirk"),
          T("Sous la table, vous sentez le fragment frémir une fois contre votre poitrine. Le prochain dé, en l’air, laisse derrière lui un filament violet que personne d’autre ne semble voir."),
        ], choices: [
          C(`${D}-des-rendre`, "Souffler à Naïah de perdre la prochaine partie, et de rendre les gains", "lucidite", [
            P("Perds la prochaine. Et rends-leur leurs pièces en disant que tu as eu de la chance."),
            NA("Tu me demandes d’être honnête dans une auberge. Quelle cruauté.", "angry"),
            T("Elle perd pourtant, avec un soupir théâtral, et rend tout en riant. Les joueurs, soulagés, lui offrent un cidre. Allenna se détend d’un cran entier."),
            AL("Merci.", "smile"),
          ], { al: { trust: 2 }, na: { trust: 1 }, bond: 1 }),
          C(`${D}-des-allenna`, "Proposer à Allenna de jouer contre sa sœur, sans magie, à mains nues", "audace", [
            P("Allenna, joue contre elle. Dés de l’auberge, gobelet transparent, et j’arbitre."),
            T("La partie dure dix minutes, silencieuse, intense. Allenna gagne. Naïah la regarde longuement, puis éclate d’un rire qu’on entend jusqu’aux écuries."),
            NA("Tu as triché.", "laugh"),
            AL("J’ai compté. C’est différent.", "smirk"),
          ], { al: { affection: 2 }, na: { affection: 2 }, bond: 2 }),
        ] },
        ending(D, "des", ctx, [
          T("Les joueurs sont partis se coucher. Il reste un fond de cidre, les dés de l’auberge et trois chaises tirées près des braises."),
          NA("La chambre du haut a un grand lit et une fenêtre ronde. Je l’ai vue en montant voler un coussin.", "smirk"),
          AL("Tu as volé un coussin ?", "stern"),
          NA("Emprunté. C’est toi qui m’as appris le mot.", "laugh"),
        ], ["Monter, si l’envie est partagée, et rapporter le coussin en passant", [
          P("On monte, si vous en avez envie toutes les deux. Et on rapporte le coussin."),
          NA("Le coussin vient avec nous. Il a mérité.", "neutral"),
          AL("Je monte. Je le veux.", "shy"),
        ]], ["Remettre la suite à une autre halte, en gardant les dés en souvenir", [
          P("Une autre fois. Je garde un dé, en souvenir de la défaite de Naïah."),
          NA("Garde-le. Je le ferai rouler sur six depuis la forêt.", "smirk"),
        ]], ["Souhaiter bonne nuit et regagner votre propre chambre", [
          P("Bonne nuit, toutes les deux. Personne ne triche jusqu’à demain matin."),
          AL("Je surveille.", "smirk"),
        ]]),
      ] }),
      C(`${D}-pluie`, "Monter tout de suite dans la chambre sous le toit, quand la pluie commence", "sangFroid", [
        P("La pluie commence. Prenons la chambre du haut avant les convoyeurs, et écoutons-la tomber."),
        NA("Écouter la pluie. Enfin quelqu’un qui sait s’amuser.", "laugh"),
      ], { na: { trust: 1 }, al: { trust: 1 } }, { followUp: [
        { intro: [
          T("La chambre est étroite, boisée, avec une lucarne ronde sur laquelle la pluie tambourine. Allenna inspecte la porte, la fenêtre, le plancher, puis s’assoit enfin sur le bord du lit, raide comme une sentinelle."),
          T("Naïah s’allonge en travers du tapis, bras en croix, et regarde les poutres. La pluie redouble. Une goutte passe par une fente du toit et tombe pile sur son front."),
          NA("Le toit me déteste. C’est réciproque.", "angry"),
          AL("Je peux le réparer. Il me faudrait une planche et de la poix.", "neutral"),
          NA("Tu peux surtout t’allonger cinq minutes sans réparer le monde.", "smirk"),
        ], choices: [
          C(`${D}-pluie-seau`, "Poser le bol de soupe vide sous la fuite, et vous allonger sur le tapis à côté de Naïah", "resonance", [
            T("Vous placez le bol sous la fente. La goutte se met à y sonner, toutes les quatre secondes, comme une horloge humide. Vous vous allongez à côté de Naïah."),
            T("Après un long moment, Allenna retire ses bottes et s’allonge de l’autre côté. Trois respirations, une lucarne, et la note claire du bol."),
            AL("C’est absurde.", "smile"),
            NA("C’est merveilleux.", "neutral"),
          ], { na: { affection: 2 }, al: { trust: 2 }, bond: 1 }),
          C(`${D}-pluie-question`, "Demander à Allenna à quoi ressemblaient les nuits de pluie au palais", "lucidite", [
            P("Au palais, quand il pleuvait, vous faisiez quoi ?"),
            AL("Les leçons continuaient. Mais Naïah faisait pleuvoir à l’intérieur, dans la salle d’études. Juste au-dessus du précepteur.", "smirk"),
            NA("Je l’avais oublié, celle-là.", "laugh"),
            AL("Moi non. C’est un de mes meilleurs souvenirs. Je n’avais pas le droit de rire, alors je l’ai gardé.", "shy"),
          ], { al: { affection: 2 }, na: { trust: 2 }, bond: 2 }),
        ] },
        ending(D, "pluie", ctx, [
          T("La pluie ralentit. La note du bol s’espace. Il fait doux sous les poutres, et personne n’a allumé la chandelle."),
          AL("Nous pourrions dormir ici. Tous les trois. Ce serait raisonnable, avec cette route trempée.", "shy"),
          NA("Elle invente une raison raisonnable. J’adore quand elle fait ça.", "smirk"),
        ], ["Rester, et décider ensemble de ce que sera cette nuit", [
          P("Je reste. Et on décide à trois de ce que sera la nuit, pas à pas."),
          NA("Pas à pas. J’aime ce rythme.", "neutral"),
          AL("Moi aussi.", "shy"),
        ]], ["Préférer garder la nuit simple, chacun dans son coin de chambre", [
          P("Restons simples, ce soir. Chacun son coin, et la pluie pour tout le monde."),
          AL("Simple. C’est bien aussi.", "smile"),
        ]], ["Descendre dormir dans la salle commune, pour leur laisser la chambre", [
          P("Je descends près du feu. La chambre est à vous deux."),
          NA("Tu nous laisses seules ensemble. Quel courage.", "smirk"),
        ]]),
      ] }),
    ],
    beats: [],
  };
}

/* ======================================================================== */
/* Un seuil pour trois                                                      */
/* ======================================================================== */

function home(ctx: ANDateContext): ANSceneData {
  const D: ANDateId = "group-date-allenna-naiah-home";
  const h = ctx.home;
  const inAkuhn = h?.location === "akuhn";
  const hasCup = Boolean(h?.keepsakes.includes("keepsake-naiah"));
  const hasGauntlet = Boolean(h?.keepsakes.includes("keepsake-allenna"));
  return {
    id: D, title: AN_DATE_TITLES[D], location: h?.location || "algratal", spot: h?.spot || "", cast: TRIO, music: "wild-calm", character: "allenna", period: "soirée",
    background: h?.background,
    intro: [
      T(`${h?.name || "Votre logis"} n’a jamais reçu les deux sœurs en même temps. Ce soir, vous avez rangé deux fois, puis défait la moitié du rangement pour qu’on ne voie pas que vous aviez rangé.`, TRIO),
      W(inAkuhn,
        T("Allenna a fait entrer Naïah par la cour arrière, à la nuit tombée, sous une cape d’intendance. La relève du quartier a été confiée à un officier qui lui doit trois services. Rien de cela n’est dit ; tout se lit dans la façon dont elle referme le verrou."),
        T("Naïah est arrivée par la fenêtre, évidemment. Allenna par la porte, évidemment, et avec cinq minutes d’avance.")),
      NA(W(inAkuhn, "Me voilà dans la Cité, chez toi, avec la bénédiction de la commandante. Si quelqu’un me l’avait prédit, je l’aurais transformé en champignon.", "Ton logis sent le bois ciré et l’inquiétude. Tu as rangé, n’est-ce pas ?"), "smirk"),
      AL(W(hasGauntlet, "Vous avez gardé le gantelet. Accroché au mur. Comme un trophée.", "C’est petit. C’est propre. On peut le défendre."), W(hasGauntlet, "shy", "neutral")),
      W(hasCup,
        T("Naïah s’arrête devant l’étagère. Sa tasse ébréchée y est posée, bien en vue. Elle ne dit rien. Elle la tourne de quelques degrés, pour que l’ébréchure regarde la fenêtre."),
        T("Naïah fait le tour de chaque pièce en touchant tout, les dossiers de chaise, les poignées, les livres, comme pour apprendre le logis par les doigts.")),
    ],
    choices: [
      C(`${D}-cuisine`, "Cuisiner ensemble, à trois, avec ce que vous avez", "audace", [
        P("J’ai des légumes, des œufs, un fromage dur et beaucoup d’optimisme. On cuisine ensemble ?"),
        AL("Je m’occupe des couteaux.", "neutral"),
        NA("Personne ne laisse la commandante s’approcher des épices.", "smirk"),
      ], { al: { affection: 1 }, na: { affection: 1 } }, { followUp: [
        { intro: [
          T("Allenna découpe les légumes en cubes parfaits, tous de la même taille, à une vitesse qui fait peur. Naïah, perchée sur le plan de travail, goûte chaque ingrédient cru et rend un verdict."),
          NA("Le poireau, oui. Le navet, il a vécu une vie triste. Le fromage est mon nouvel ami.", "laugh"),
          AL("Elle ne cuisine pas. Elle commente.", "stern"),
          NA("Et toi, tu cuisines comme on dresse un camp. Ta dernière soupe avait la couleur d’une rivière en crue. Tout le monde a survécu, je te l’accorde.", "smirk"),
          AL("Elle nourrissait.", "stern"),
        ], choices: [
          C(`${D}-cuisine-arbitre`, "Prendre la poêle et confier à chacune une tâche précise : Allenna le feu, Naïah l’assaisonnement", "lucidite", [
            P("Allenna, le feu, tu le tiens mieux que personne. Naïah, le sel et les herbes, au goût. Moi, je remue et j’empêche les meurtres."),
            T("Le résultat est une omelette épaisse, dorée, un peu trop salée d’un côté, parfaite de l’autre. Vous la coupez en trois parts inégales que personne ne conteste."),
            AL("C’est mangeable. Et beau.", "smile"),
            NA("Note-le dans ton registre. Première victoire culinaire de la famille.", "laugh"),
          ], { al: { trust: 1, affection: 1 }, na: { affection: 1 }, bond: 1 }),
          C(`${D}-cuisine-illusion`, "Demander à Naïah si elle peut rendre le plat d’Allenna joli, juste pour le dressage", "resonance", [
            P("Naïah, tu peux rendre ça joli ? Juste l’allure. Le goût, on garde celui d’Allenna."),
            T("Naïah passe la main au-dessus du ragoût brunâtre. La surface se couvre de petites fleurs violettes d’illusion qui s’ouvrent lentement et sentent, vaguement, le printemps."),
            AL("Elle a mis des fleurs sur ma soupe.", "troubled"),
            NA("J’ai mis des fleurs sur ta soupe. C’est le plus beau cadeau que je t’aie jamais fait. Mange.", "smirk"),
          ], { na: { affection: 2 }, al: { affection: 1 }, bond: 1 }),
        ] },
        ending(D, "cuisine", ctx, [
          T("Les assiettes sont vides, la vaisselle attendra demain. Un feu bas danse dans l’âtre, et le banc est assez large pour trois si personne ne tient à ses coudes."),
          AL(W(inAkuhn, "La relève change à l’aube. D’ici là, cette maison est la plus sûre de la Cité. J’y ai veillé.", "D’ici à l’aube, rien ne nous attend nulle part. Je l’ai vérifié."), "neutral"),
          NA("Elle dit qu’on peut rester. En langage militaire.", "smirk"),
        ], ["Proposer de prolonger la soirée près du feu, si toutes deux le désirent", [
          P("Restez. Près du feu, ou plus loin, comme vous voudrez. Dites-moi chacune si c’est oui."),
          AL("Oui.", "shy"),
          NA("Oui. À ma façon.", "neutral"),
        ]], ["Garder ce repas comme un souvenir entier, sans rien y ajouter ce soir", [
          P("Ce repas me suffit pour ce soir. Je veux le garder entier."),
          NA("Entier. Comme l’omelette. Enfin, presque.", "laugh"),
        ]], ["Raccompagner chacune à sa porte", [
          P("Je vous raccompagne. Toi par la fenêtre, j’imagine."),
          NA("Évidemment.", "smirk"),
        ]]),
      ] }),
      C(`${D}-objets`, "Leur faire visiter le logis par les objets que vous avez gardés", "resonance", [
        P("Chaque objet ici a une histoire. Certaines vous concernent."),
        NA("Une visite guidée. J’adore. Commence par le plus embarrassant.", "smirk"),
      ], { na: { trust: 1 }, al: { trust: 1 } }, { followUp: [
        { intro: [
          T("Vous leur montrez le banc acheté à un marchand qui pleurait, la carte annotée par trois mains différentes, le caillou rond ramassé le jour de votre arrivée. Allenna écoute chaque histoire comme un rapport. Naïah les commente toutes."),
          W(hasCup,
            NA("Et ma tasse. Tu l’as mise à la meilleure place. Tu sais qu’elle ne sert à rien ? Elle fuit.", "neutral"),
            NA("Il manque quelque chose de moi, ici. Je trouverai quoi.", "thinking")),
          W(hasGauntlet,
            AL("Mon gantelet est plus haut que sa tasse.", "smirk"),
            AL("Je n’ai rien laissé ici. C’est une erreur que je corrigerai.", "neutral")),
          NA("La hauteur n’est pas un classement, commandante.", "smirk"),
        ], choices: [
          C(`${D}-objets-place`, "Leur proposer de choisir chacune un endroit pour un futur objet de l’autre", "audace", [
            P("Choisissez chacune un endroit, ici, pour un objet que l’autre apportera un jour."),
            T("Allenna désigne le rebord de la fenêtre, là où la lumière tombe le matin. Naïah choisit, sans hésiter, le clou juste à côté de la porte, celui où l’on accroche ce qu’on emporte en sortant."),
            NA("Comme ça, elle le verra en partant. Et elle aura envie de revenir.", "neutral"),
            AL("…D’accord.", "shy"),
          ], { al: { affection: 2 }, na: { affection: 2 }, bond: 2 }),
          C(`${D}-objets-carte`, "Leur montrer la carte annotée, et la page qui manque encore", "lucidite", [
            P("Il reste un blanc, en haut à droite. Personne n’a encore su quoi y mettre."),
            NA("Un lac. Mon lac. Il bouge, alors dessine-le en pointillés.", "laugh"),
            AL("Et la halte du fleuve. Avec les trois portes.", "smile"),
            T("Vous les laissez dessiner. Le résultat est faux, illisible et parfaitement à sa place."),
          ], { al: { trust: 1 }, na: { trust: 1 }, bond: 1 }),
        ] },
        ending(D, "objets", ctx, [
          T("La visite s’achève dans la chambre, faute d’autre pièce. Le lit est grand, la fenêtre entrouverte, et les deux sœurs se tiennent sur le seuil, chacune d’un côté du chambranle."),
          NA("C’est la dernière salle du musée ?", "smirk"),
          AL("Naïah.", "stern"),
          NA("Je demande. Je ne présume pas. Tu vois, j’ai appris.", "neutral"),
        ], ["Les inviter à entrer, si elles le veulent toutes les deux, et rien de plus que ce qu’elles voudront", [
          P("Entrez, si vous le voulez. Ce qu’on fera ensuite, on le décidera ensemble, et chacune peut s’arrêter quand elle veut."),
          AL("Je le veux.", "shy"),
          NA("J’entre. Je choisirai ma place.", "neutral"),
        ]], ["Refermer doucement la visite et remettre la chambre à plus tard", [
          P("La dernière salle restera fermée ce soir. Elle n’ira nulle part."),
          AL("Elle n’ira nulle part. Moi non plus.", "smile"),
        ]], ["Proposer un dernier thé au salon avant le départ", [
          P("Un dernier thé, et je vous rends à vos nuits."),
          NA("Avec du sucre. Beaucoup.", "smirk"),
        ]]),
      ] }),
      C(`${D}-toit`, "Monter sur le toit, ou au plus haut point du logis, pour regarder la nuit", "sangFroid", [
        P("Il y a un endroit d’où l’on voit tout le ciel. On y monte ?"),
        AL(W(inAkuhn, "Les feux verts de la Cité, vus d’en haut. Je ne les ai jamais regardés pour le plaisir.", "On voit loin, de là-haut. C’est un bon poste."), "neutral"),
      ], { al: { trust: 1 }, na: { affection: 1 } }, { followUp: [
        { intro: [
          T("Le toit est tiède encore du soleil de la journée. Vous vous asseyez tous les trois contre la cheminée, couverture sur les genoux."),
          W(inAkuhn,
            T("En contrebas, les feux verts de la Cité Noire brûlent en lignes régulières. Naïah les regarde longtemps, sans rien dire, puis désigne une tour, au nord, celle des anciens appartements des enfants."),
            T("Au-dessus, les étoiles sont si nombreuses que Naïah se met à les compter à voix basse, puis abandonne, vexée, à quarante-trois.")),
          NA(W(inAkuhn, "Ma fenêtre était là. Troisième en partant du haut. Elle est murée, maintenant.", "Quarante-trois. Il en manque. Quelqu’un les a déplacées."), W(inAkuhn, "sad", "angry")),
          AL(W(inAkuhn, "Je l’ai fait murer. Pour que personne d’autre n’y dorme.", "Personne n’a déplacé les étoiles, Naïah."), W(inAkuhn, "troubled", "smirk")),
        ], choices: [
          C(`${D}-toit-silence`, "Ne rien ajouter, et tirer la couverture un peu plus vers elles deux", "sangFroid", [
            T("Vous tirez la couverture. Naïah se rapproche d’un cran, sans quitter le ciel des yeux. Allenna laisse son épaule contre celle de sa sœur, et aucune ne s’écarte."),
            W(inAkuhn,
              NA("Tu l’as fait murer pour moi.", "sad"),
              NA("Tu ne crois jamais à mes étoiles.", "smirk")),
            AL(W(inAkuhn, "Oui.", "J’y crois un peu."), "shy"),
          ], { al: { affection: 2 }, na: { affection: 2 }, bond: 2 }),
          C(`${D}-toit-etoile`, "Proposer de nommer une étoile chacun, pour la retrouver plus tard depuis n’importe où", "audace", [
            P("Une étoile chacun. Comme ça, la forêt, la Cité et ici, on regarde le même endroit."),
            NA("La petite rouge, là. Elle a l’air de mauvaise humeur. C’est la mienne.", "laugh"),
            AL("Celle du nord, qui ne bouge pas. Elle sert à se repérer.", "neutral"),
            NA("Évidemment. La commandante a choisi une étoile utile.", "smirk"),
          ], { na: { affection: 1, trust: 1 }, al: { affection: 1 }, bond: 1 }),
        ] },
        ending(D, "toit", ctx, [
          T("La fraîcheur monte. La couverture ne suffit plus pour trois, et personne n’a envie de redescendre seul."),
          AL("La chambre est juste en dessous. Elle est chaude.", "shy"),
          NA("Elle propose. Elle a vraiment proposé. Je veux une cloche.", "laugh"),
        ], ["Redescendre ensemble, si l’envie est la même chez chacune", [
          P("Descendons. Ensemble, si vous en avez envie, et chacune à son rythme."),
          NA("Mon rythme est lent. Je préviens.", "neutral"),
          AL("Le mien aussi.", "shy"),
        ]], ["Rester encore un peu sur le toit, et laisser la nuit décider de finir seule", [
          P("Encore un peu ici. Juste le ciel. La chambre attendra une autre fois."),
          AL("Le ciel, alors.", "smile"),
        ]], ["Proposer de redescendre chacun dormir", [
          P("Il fait froid. Chacun son lit, et on se retrouve au petit matin."),
          NA("Au petit matin. Je te ferai le petit déjeuner. Non. Allenna le fera. Non. Toi.", "laugh"),
        ]]),
      ] }),
    ],
    beats: [],
  };
}

export function anDateScene(id: ANDateId, ctx: ANDateContext): ANSceneData {
  return id === "group-date-allenna-naiah-lake" ? lake(ctx) : id === "group-date-allenna-naiah-relay" ? relay(ctx) : home(ctx);
}

/** Branche réellement choisie dans un rendez-vous, à partir des choix enregistrés. */
export function anBranchFromPicks(id: ANDateId, picks: readonly string[]): string | undefined {
  return AN_DATE_BRANCHES[id].find((branch) => picks.includes(`${id}-${branch}`));
}
