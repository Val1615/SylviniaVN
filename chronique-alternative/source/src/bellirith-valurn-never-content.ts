import type { DialogueLine } from "./game-data";
import type { BVActor, BVBeat, BVNeverState, BVNpcClaim, BVNpcTruth, BVPhase, BVPlayerClaim, BVPlayerTruth, BVTheme, BVTier, BVTruthCtx } from "./bellirith-valurn-never-game";

/**
 * Banque éditoriale du « Je n’ai jamais ». Chaque affirmation est écrite à la main,
 * avec sa vérité pour chacun des trois convives et ses réactions.
 * La vérité du joueur se calcule depuis la sauvegarde ; à défaut, aveu volontaire.
 */

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const B = (text: string, mood = "teasing"): DialogueLine => ({ speaker: "Bellirith", text, mood });
const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

const F: BVPhase[] = ["facade"];
const FP: BVPhase[] = ["facade", "piques"];
const PQ: BVPhase[] = ["piques"];
const PR: BVPhase[] = ["piques", "retombee"];
const R: BVPhase[] = ["retombee"];
const ALL: BVPhase[] = ["facade", "piques", "retombee"];

/* Lecture de la sauvegarde ------------------------------------------------- */

const has = (flag: string) => (ctx: BVTruthCtx) => ctx.flags.includes(flag);
const any = (...flags: string[]) => (ctx: BVTruthCtx) => flags.some((flag) => ctx.flags.includes(flag));
const prefix = (start: string) => (ctx: BVTruthCtx) => ctx.flags.some((flag) => flag.startsWith(start));
const stage = (character: string, min: number) => (ctx: BVTruthCtx) => (ctx.relationships[character]?.stage || 0) >= min;
const dated = (character: string) => (ctx: BVTruthCtx) => ctx.dateHistory.some((id) => id.includes(character));
const intimateWithAnyone = (ctx: BVTruthCtx) => ctx.flags.some((flag) => flag.startsWith("date-intimate:") || flag.startsWith("home-intimate:")) || ctx.flags.includes("bellirith-has-slept");
const datedAnyone = (ctx: BVTruthCtx) => ctx.dateHistory.length > 0 || ctx.groupDateHistory.length > 0;
const groupDated = (ctx: BVTruthCtx) => ctx.groupDateHistory.length > 0;
const both = (...tests: ((ctx: BVTruthCtx) => boolean)[]) => (ctx: BVTruthCtx) => tests.every((test) => test(ctx));
const not = (test: (ctx: BVTruthCtx) => boolean) => (ctx: BVTruthCtx) => !test(ctx);

/* Les quêtes de Valurn : il était présent, il sait. */
const VQ = {
  anyQuest: prefix("valurn-q1-choice:"),
  rules: has("valurn-q1-choice:rules"), turned: has("valurn-q1-choice:turned"), risks: has("valurn-q1-choice:risks"), coop: has("valurn-q1-choice:coop"),
  cover: has("valurn-q2-method:cover"), diversion: has("valurn-q2-method:diversion"), refusedSale: has("valurn-q2-method:refused"), salon: has("valurn-q2-method:salon"),
  bluff: has("valurn-q3-deal:bluff"), parallel: has("valurn-q3-deal:parallel"), proof: has("valurn-q3-deal:proof"), favour: has("valurn-q3-deal:favour"),
  odileNamed: any("valurn-q4-odile:exposed", "valurn-q4-odile:pressed"), odileShielded: any("valurn-q4-odile:shielded", "valurn-q4-odile:second-chance"), odileAny: prefix("valurn-q4-odile:"),
  accused: has("valurn-q5-reaction:accused"), admired: has("valurn-q5-reaction:admired"), repaired: has("valurn-q5-reaction:repaired"), turnedBack: has("valurn-q5-reaction:turned"), reaction: prefix("valurn-q5-reaction:"),
  sourceKept: has("valurn-q6:source-kept"), q6: prefix("valurn-q6:"),
  outcome: prefix("valurn-outcome:"), contremarche: has("valurn-outcome:contremarche"), revelation: has("valurn-outcome:revelation"), accord: has("valurn-outcome:accord"),
  helpAccepted: has("valurn-help:accepted"), helpDeferred: has("valurn-help:deferred"),
  market: has("valurn-market-done"),
};

/* Ce que Bellirith a vécu avec le joueur : elle était là, elle sait. */
const BQ = {
  gave: has("bellirith-trend:ceded"), stood: any("bellirith-has-resisted", "bellirith-trend:resisted", "cross-bv-stood-up"),
  night: has("bellirith-has-slept"), favorite: has("bellirith-favorite"), intrusion: prefix("bellirith-intrusion:"),
  q1: prefix("bv-q1:"), q1Mirror: has("bv-q1:mirror"), q1Third: has("bv-q1:third"), q1Her: has("bv-q1:bellirith"), q1Him: has("bv-q1:valurn"),
  sharedTaste: has("bv-q2-shared-b:taste"), sharedCards: has("bv-q2-shared-b:cards"), sharedRefused: has("bv-q2-shared-b:refused"), sharedArrival: has("bv-q2-shared-b:arrival"),
  vialHer: has("bv-q1-vial:bellirith"),
};
const VS = { name: has("bv-q2-shared-v:name"), sleep: has("bv-q2-shared-v:sleep"), rules: has("bv-q2-shared-v:rules"), returned: has("bv-q2-shared-v:returned"), vial: has("bv-q1-vial:valurn") };

/* Ce qui s’est passé ce soir. */
const ev = {
  playerHitBellirith: (n: number) => (s: BVNeverState) => s.attacks["player>bellirith"] >= n,
  playerHitValurn: (n: number) => (s: BVNeverState) => s.attacks["player>valurn"] >= n,
  playerDrank: (n: number) => (s: BVNeverState) => s.drinks.player >= n,
  playerDry: (s: BVNeverState) => s.log.length >= 9 && s.drinks.player === 0,
  admitted: (s: BVNeverState) => s.log.some((entry) => entry.answer === "acknowledge"),
  dodged: (s: BVNeverState) => s.log.some((entry) => entry.answer === "dodge" || entry.answer === "deny"),
  emptyShot: (s: BVNeverState) => s.log.some((entry) => entry.drinkers.length === 0 && entry.speaker !== "player" && entry.claimId !== ""),
  playerMissed: (s: BVNeverState) => s.log.some((entry) => entry.speaker === "player" && entry.target !== "none" && !entry.drinkers.includes(entry.target as BVActor)),
  allDrank: (s: BVNeverState) => s.log.some((entry) => entry.drinkers.length === 3),
  bellirithDrankMost: (s: BVNeverState) => s.drinks.bellirith >= s.drinks.valurn + 2,
  valurnDrankMost: (s: BVNeverState) => s.drinks.valurn >= s.drinks.bellirith + 2,
  playerIgnoredBoth: (s: BVNeverState) => s.log.filter((entry) => entry.speaker === "player").length >= 3 && s.attacks["player>bellirith"] + s.attacks["player>valurn"] === 0,
  selfHit: (s: BVNeverState) => s.log.some((entry) => entry.speaker !== "player" && entry.drinkers.includes(entry.speaker)),
};

type T3 = [BVNpcTruth, BVNpcTruth, BVPlayerTruth];
type Extra = Partial<Pick<BVNpcClaim, "why" | "ask" | "requires" | "evening" | "save" | "ifPlayerDrinks" | "ifPlayerDry" | "mood" | "tags">>;
const nb = (id: string, target: BVActor, tier: BVTier, phases: BVPhase[], text: string, truth: T3, lines: DialogueLine[], extra: Extra = {}): BVNpcClaim =>
  ({ id, speaker: "bellirith", target, tier, phases, text, truth: { bellirith: truth[0], valurn: truth[1], player: truth[2] }, lines, tags: [], mood: "teasing", ...extra });
const nv = (id: string, target: BVActor, tier: BVTier, phases: BVPhase[], text: string, truth: T3, lines: DialogueLine[], extra: Extra = {}): BVNpcClaim =>
  ({ id, speaker: "valurn", target, tier, phases, text, truth: { bellirith: truth[0], valurn: truth[1], player: truth[2] }, lines, tags: [], mood: "charming", ...extra });

type PT = [boolean, boolean, boolean | ((ctx: BVTruthCtx, state: BVNeverState) => boolean)];
type PExtra = Partial<Pick<BVPlayerClaim, "why" | "requires" | "save" | "ifPlayerDrinks" | "tags" | "phases">>;
const pc = (id: string, target: BVPlayerClaim["target"], theme: BVTheme, intensity: 0 | 1 | 2 | 3, pace: -1 | 0 | 1, text: string, truth: PT, lines: DialogueLine[], extra: PExtra = {}): BVPlayerClaim =>
  ({ id, target, theme, intensity, pace, text, truth: { bellirith: truth[0], valurn: truth[1], player: truth[2] }, lines, tags: [], phases: intensity >= 2 ? PR : intensity === 1 ? ALL : FP, ...extra });

/* ------------------------------------------------------------------------ */
/* Transitions (aucun tour consommé)                                         */
/* ------------------------------------------------------------------------ */

export const BV_TRANSITIONS: Record<BVPhase, DialogueLine[]> = {
  facade: [
    N("Bellirith remplit les trois verres d’une main, sans regarder, et ne renverse pas une goutte. Elle tient à ce que vous l’ayez remarqué."),
    N("Valurn change de fauteuil, puis revient au premier, en déclarant que le second était trop près du feu et trop loin de la bouteille."),
    N("Quelqu’un passe dans la galerie et ralentit devant la porte. Bellirith lui adresse un sourire si large qu’il repart en courant."),
    N("Le piano craque dans son coin, comme pour réclamer son tour. Valurn lui répond d’une révérence."),
  ],
  piques: [
    N("Les verres se remplissent plus vite. Les rires deviennent plus courts, et chaque phrase commence par un regard."),
    N("Bellirith ôte ses bagues une à une et les aligne sur le guéridon, comme on range des armes avant une négociation sérieuse."),
    N("Valurn retourne son verre d’un quart de tour vers la gauche avant de boire. Bellirith le voit faire et sourit sans rien dire."),
    N("Une bûche s’effondre dans l’âtre. Personne ne se lève pour la remettre en place ; personne ne veut quitter la table le premier."),
  ],
  revelations: [
    N("Le feu baisse. Personne ne l’alimente. Le salon devient plus petit autour des trois verres."),
    N("Valurn pose sa canne en travers de ses genoux et la tient à deux mains, comme on tient la barre d’un bateau."),
    N("Bellirith ne regarde plus que son frère. Elle n’a pas touché à ses bagues depuis longtemps."),
    N("Le silence revient entre deux phrases et s’installe, chaque fois un peu plus longtemps."),
  ],
  retombee: [
    N("Quelqu’un se ressert. Le geste est maladroit, presque timide, comme si la bouteille pouvait encore mordre."),
    N("Bellirith remet une bague, une seule. Valurn fait semblant de ne pas comprendre ce que ça veut dire."),
    N("La fenêtre laisse entrer un peu d’air frais. Il sent la pierre mouillée et le jasmin des jardins."),
    N("Valurn se surprend à rire d’une phrase qu’il n’a pas comprise. Il décide qu’il la comprendra demain."),
  ],
};

/* ------------------------------------------------------------------------ */
/* Réparties selon le résultat (b = Bellirith, v = Valurn, p = joueur)       */
/* ------------------------------------------------------------------------ */

export const BV_RESULT_RETORTS: Record<string, DialogueLine[]> = {
  none: [
    N("Personne ne boit. Le silence qui suit a quelque chose de comique, comme une flèche tirée dans une pièce vide."),
    B("Personne. Tu as visé le plafond, et le plafond n’a rien à se reprocher.", "smirk"),
    V("Aucune gorgée. Je propose qu’on encadre cette affirmation et qu’on l’accroche au-dessus du piano, en souvenir d’un tir parfaitement inutile.", "amused"),
  ],
  b: [
    V("Elle boit seule. Je vais m’en souvenir avec une tendresse indécente.", "amused"),
    N("Bellirith boit seule, lentement, en vous regardant par-dessus le bord du verre comme si c’était vous qui deviez avoir honte."),
  ],
  v: [
    B("Lui seul. Je sens monter en moi une joie que je qualifierais de pure.", "smirk"),
    N("Valurn boit seul. Il repose son verre avec le soin d’un homme qui range une pièce à conviction."),
  ],
  p: [
    B("Toi tout seul ! Je l’adore, cette phrase. Je la ferai graver.", "teasing"),
    V("Vous voilà seul face à la bouteille. N’ayez crainte, elle a vu pire.", "charming"),
  ],
  bv: [
    N("Bellirith et Valurn boivent en même temps, du même geste, et se fusillent du regard en s’en apercevant."),
    V("La famille boit d’une seule gorgée. C’est la seule chose que nous faisons encore ensemble avec grâce.", "amused"),
  ],
  bp: [
    B("Toi et moi. Nous voilà complices. Il déteste ça, regarde-le.", "seductive"),
    V("Ils boivent ensemble. Je me sens exclu, et c’est très reposant.", "charming"),
  ],
  vp: [
    V("Vous et moi. Je savais que nous finirions du même côté de la bouteille.", "charming"),
    B("Mon frère et toi, le même verre levé. Je vais faire semblant de ne pas trouver ça charmant.", "teasing"),
  ],
  bvp: [
    N("Les trois verres se lèvent ensemble. Pendant une seconde, la table entière est d’accord sur quelque chose, et c’est sur ce qu’elle a de pire."),
    B("Tout le monde ! J’aime quand la vertu quitte la pièce en même temps que le vin.", "seductive"),
    V("Nous sommes tous coupables. C’est la seule égalité que cette ville ait jamais connue.", "amused"),
  ],
};

/* ------------------------------------------------------------------------ */
/* Bellirith vise Valurn : 4 paliers × 4                                     */
/* ------------------------------------------------------------------------ */

const ASK = "ask" as const;

const BELLIRITH_ON_VALURN: BVNpcClaim[] = [
  nb("b-v-0a", "valurn", 0, FP, "Je n’ai jamais porté une perruque pour entrer dans un bal où l’on ne m’avait pas invitée.", [false, false, false], [
    V("Une perruque ? Tu me confonds avec ton propre passé. Je suis entré par la fenêtre, comme un homme honnête.", "amused"),
    B("Par la fenêtre. Il le dit avec fierté. Retiens ce détail, {player}, il servira.", "smirk"),
  ]),
  nb("b-v-0b", "valurn", 0, FP, "Je n’ai jamais perdu ma chemise à un pari stupide.", [false, false, false], [
    V("C’était un manteau. Ma chemise, je l’ai gardée, et ma dignité aussi, à peu près.", "charming"),
    B("Il chipote sur la nature du vêtement. C’est comme ça qu’on reconnaît un homme qui a vraiment perdu.", "teasing"),
  ]),
  nb("b-v-0c", "valurn", 0, FP, "Je n’ai jamais été jalouse d’un chat.", [true, false, false], [
    N("Valurn ne bouge pas. Bellirith, elle, lève son verre et boit, l’air de quelqu’un qui découvre trop tard la direction du vent."),
    V("Le chat roux. Celui qui dormait sur mes genoux et refusait les tiens. Tu lui as fait la tête pendant une saison entière.", "amused"),
    B("Il me regardait de haut. Je ne supporte pas qu’on me regarde de haut quand on mesure un pied.", "angry"),
  ]),
  nb("b-v-0d", "valurn", 0, FP, "Je n’ai jamais fait semblant de comprendre une pièce de théâtre jusqu’au dernier acte.", [true, true, ASK], [
    N("Deux verres se vident, celui de Bellirith puis celui de Valurn. Ils se regardent, offensés de se trouver dans le même camp."),
    V("La tragédie des trois reines. Nous sommes sortis en jurant qu’elle était profonde.", "charming"),
    B("Elle était longue. Profonde, je ne sais pas, j’ai dormi pendant la partie importante.", "smirk"),
  ], { ask: "Avez-vous déjà fait semblant de comprendre une pièce jusqu’au bout ?", ifPlayerDrinks: [B("Toi aussi ! Nous sommes une famille d’imposteurs culturels, maintenant.", "teasing")], ifPlayerDry: [V("Vous avez compris toutes les pièces que vous avez vues. Je vous en veux un peu.", "amused")] }),

  nb("b-v-1a", "valurn", 1, FP, "Je n’ai jamais tourné mon verre d’un quart de tour avant de boire.", [false, true, false], [
    N("Valurn suspend son geste, le verre déjà tourné d’un quart vers la gauche. Il le contemple, puis boit, résigné."),
    V("C’est pour lire le cristal.", "neutral"),
    B("C’est pour vérifier que personne n’a bu à cet endroit avant lui. Il a toujours eu peur des bords partagés.", "smirk"),
  ]),
  nb("b-v-1b", "valurn", 1, FP, "Je n’ai jamais compté mes pièces par la tranche, comme si chaque face pouvait me trahir.", [false, true, false], [
    V("Une pièce a deux faces et une tranche. La tranche est la seule qui ne ment jamais. J’appelle ça de l’honnêteté.", "charming"),
    B("C’est de la méfiance qui s’est acheté un joli costume.", "teasing"),
  ]),
  nb("b-v-1c", "valurn", 1, ALL, "Je n’ai jamais mangé une confiserie que je détestais pour que quelqu’un d’autre ne la mange pas.", [false, true, false], [
    V("Tu parles des violettes. Je les mange parce que tu les laisses sur le plateau des autres. C’est un service public.", "amused"),
    B("Il les mange depuis toujours. Il fait la grimace à chaque fois. Personne ne lui a jamais demandé de le faire.", "thoughtful"),
    N("La phrase reste suspendue une seconde de trop, puis Bellirith la chasse d’un geste de la main."),
  ]),
  nb("b-v-1d", "valurn", 1, FP, "Je n’ai jamais tenu un carnet de paris pour noter ceux que je perds.", [false, true, false], [
    V("On apprend davantage de ses défaites que de ses victoires. J’ai donc beaucoup appris.", "charming"),
    B("Il a des carnets entiers. Des bibliothèques. On pourrait chauffer un palais avec ses erreurs.", "smirk"),
  ]),

  nb("b-v-2a", "valurn", 2, PR, "Je n’ai jamais vendu la même information deux fois dans la même soirée.", [false, true, false], [
    V("Deux fois ? C’est une calomnie. Trois fois, et à des acheteurs qui ne se parlaient pas.", "amused"),
    B("Il corrige à la hausse. C’est sa façon d’avouer.", "teasing"),
  ]),
  nb("b-v-2b", "valurn", 2, PR, "Je n’ai jamais renvoyé un croupier parce qu’il me battait trop souvent.", [false, true, false], [
    N("Valurn boit avec la gravité d’un homme qui assume un crime de goût."),
    V("Il me lisait. On ne garde pas à son service un homme qui lit dans votre jeu.", "neutral"),
    B("Il l’a fait engager par un rival, pour le faire perdre à son tour. Je trouve ça presque admirable.", "smirk"),
  ]),
  nb("b-v-2c", "valurn", 2, PR, "Je n’ai jamais perdu deux correspondants parce qu’un dossier a été rendu public.", [false, true, (ctx) => VQ.revelation(ctx)], [
    V("Tout le monde le sait. C’était le prix d’une conclusion propre. Je l’ai payé sans me plaindre, sauf à voix haute.", "neutral"),
    B("Il s’est plaint pendant trois semaines. J’ai des témoins.", "teasing"),
  ], { requires: VQ.revelation, save: true, why: "Vous étiez là quand les preuves de l’affaire Halbrecht sont devenues publiques.", ifPlayerDrinks: [V("Et vous étiez de la partie. Ma sœur oublie toujours que les conclusions propres se signent à plusieurs.", "charming")] }),
  nb("b-v-2d", "valurn", 2, PR, "Je n’ai jamais vu quelqu’un cesser de m’adresser la parole après une victoire que j’avais gagnée trop bien.", [true, true, (ctx) => VQ.contremarche(ctx)], [
    N("Les deux démons boivent. Ils ne se regardent pas, chacun occupé de son propre souvenir."),
    V("Odile ne me parle plus. Elle a raison, et je lui écris quand même, chaque saison, des lettres qu’elle ne lit pas.", "away"),
    B("Moi, la liste est trop longue. Je ne la tiens plus.", "cold"),
  ], { requires: VQ.contremarche, save: true, why: "Le contre-marché contre Halbrecht vous a coûté le silence d’Odile, à vous aussi.", ifPlayerDrinks: [B("Toi aussi. Bienvenue au club des gens qui gagnent mal.", "teasing")] }),

  nb("b-v-3a", "valurn", 3, PR, "Je n’ai jamais appris par cœur les goûts de quelqu’un que je prétends ne plus connaître.", [true, true, false], [
    N("Bellirith boit la première. Valurn ensuite. Ils reposent leurs verres en même temps, et le bruit du cristal est le même."),
    V("Les fraises tièdes. Jamais froides.", "neutral"),
    B("Le vin coupé d’eau quand il veut garder la tête claire. Il croit que personne ne voit la carafe.", "cold"),
  ]),
  nb("b-v-3b", "valurn", 3, PQ, "Je n’ai jamais regretté une partie que j’avais gagnée.", [false, true, false], [
    N("Valurn boit sans un mot. Son sourire reste en place, mais il a cessé de travailler."),
    B("Tu vois, {player} ? Il ne répond pas. Quand il ne répond pas, c’est que j’ai visé juste.", "smirk"),
  ]),
  nb("b-v-3c", "valurn", 3, PQ, "Je n’ai jamais souri pour qu’on ne me demande pas pourquoi je ne dormais plus.", [false, true, false], [
    V("Je dors très bien. Je dors simplement à des heures que les gens honnêtes ne fréquentent pas.", "neutral"),
    B("Il boit en disant qu’il dort. C’est ce que j’appelle une réponse complète.", "thoughtful"),
  ]),
  nb("b-v-3d", "valurn", 3, PQ, "Je n’ai jamais cru que l’élégance pouvait remplacer des excuses.", [false, true, false], [
    V("L’élégance accompagne les excuses. Elle les rend supportables. C’est déjà beaucoup.", "neutral"),
    B("Boire en faisant la leçon. Toute ma jeunesse tient dans cette image.", "cold"),
  ]),
];

/* ------------------------------------------------------------------------ */
/* Bellirith vise le joueur                                                  */
/* ------------------------------------------------------------------------ */

const BELLIRITH_ON_PLAYER: BVNpcClaim[] = [
  nb("b-p-0a", "player", 0, FP, "Je n’ai jamais dormi avec mes bottes aux pieds.", [false, true, ASK], [
    N("Valurn boit, à la surprise générale, y compris la sienne."),
    V("Une auberge de la route impériale. Des puces. Je refusais de leur laisser mes chaussettes.", "amused"),
  ], { ask: "Avez-vous déjà dormi bottes aux pieds ?", ifPlayerDrinks: [B("Je le savais. Tu as une tête à dormir prêt à fuir.", "teasing")], ifPlayerDry: [B("Raté. Tu te déchausses avant de dormir. Comme c’est civilisé.", "smirk")] }),
  nb("b-p-0b", "player", 0, FP, "Je n’ai jamais parlé à un cheval comme à un confident.", [false, false, ASK], [
    B("Allons. Tout le monde a raconté sa vie à un cheval. Ils ne répètent rien et ils mangent des pommes, c’est le confident idéal.", "teasing"),
  ], { ask: "Avez-vous déjà confié vos pensées à un cheval ?", ifPlayerDrinks: [V("Vous buvez. J’ai soudain très envie de connaître ce cheval.", "charming")], ifPlayerDry: [B("Personne ? Pas même un âne ? Tu me déçois énormément.", "smirk")] }),
  nb("b-p-0c", "player", 0, FP, "Je n’ai jamais volé une pâtisserie dans les cuisines du palais.", [true, false, ASK], [
    N("Bellirith boit, très vite, avant que quiconque ait pu réagir. Le verre est vide avant la fin de sa propre phrase."),
    B("Je voulais voir si quelqu’un oserait l’avouer avant moi. Personne. Lâches.", "smirk"),
  ], { ask: "Avez-vous déjà chapardé une pâtisserie aux cuisines du palais ?", ifPlayerDrinks: [B("Complice ! Nous irons ensemble la prochaine fois. Ils font une tarte aux coings qui mérite un crime.", "seductive")] }),
  nb("b-p-0d", "player", 0, FP, "Je n’ai jamais rougi devant une statue.", [false, false, ASK], [
    V("Les statues de la galerie d’audience sont très dénudées. Je comprendrais.", "amused"),
  ], { ask: "Avez-vous déjà rougi devant une statue ?", ifPlayerDrinks: [B("Laquelle ? Je veux un nom, une salle et un étage.", "seductive")], ifPlayerDry: [B("Rien ? Il faudra que je t’emmène voir l’Archer du jardin d’hiver. Tu changeras d’avis.", "teasing")] }),

  nb("b-p-1a", "player", 1, FP, "Je n’ai jamais pris le parti de Valurn devant moi.", [false, false, (ctx) => BQ.q1Him(ctx)], [
    V("Il est possible que ma sœur se vise elle-même avec cette phrase. On attend de voir.", "amused"),
  ], { requires: BQ.q1, save: true, why: "Sous l’auvent d’Ysaure, vous avez rattrapé la commande avec Valurn.", ifPlayerDrinks: [B("Voilà. Je l’ai gardé pour ce soir. Tu as choisi la parfumeuse et mon frère. Je ne t’en veux pas ; je t’observe.", "teasing")], ifPlayerDry: [B("Non ? Tu ne l’as jamais choisi contre moi ? Il faudra que je vérifie de plus près.", "seductive")] }),
  nb("b-p-1b", "player", 1, FP, "Je n’ai jamais refusé un secret à une démone qui me le demandait gentiment.", [false, false, (ctx) => BQ.sharedRefused(ctx)], [
    V("Gentiment. Le mot est audacieux.", "amused"),
  ], { requires: prefix("bv-q2-shared-b:"), save: true, why: "Dans la Salle des Élus, vous lui avez refusé votre petit secret.", ifPlayerDrinks: [B("Dans ma propre salle de bal. J’en rêve encore, la nuit, avec une rancune délicieuse.", "seductive")], ifPlayerDry: [B("Tu m’as donné quelque chose, ce jour-là. Je le garde. Je ne te dirai pas où.", "teasing")] }),
  nb("b-p-1c", "player", 1, FP, "Je n’ai jamais serré les dents en perdant aux cartes.", [true, true, (ctx) => BQ.sharedCards(ctx)], [
    N("Valurn et Bellirith boivent, sans même chercher à se défendre."),
    V("Toute la famille serre les dents. C’est héréditaire.", "charming"),
  ], { requires: prefix("bv-q2-shared-b:"), save: true, why: "Vous lui avez avoué détester perdre, même contre une chaise.", ifPlayerDrinks: [B("Tu l’avais avoué, je n’ai rien inventé. J’adore les aveux qu’on peut vérifier.", "seductive")] }),
  nb("b-p-1d", "player", 1, ALL, "Je n’ai jamais regardé la bouteille plus souvent que les gens assis autour.", [false, true, ASK], [
    V("Je regarde la bouteille parce qu’elle est la seule à ne pas me juger.", "amused"),
  ], { ask: "Avez-vous surveillé la bouteille plus que les convives, ce soir ?", ifPlayerDrinks: [B("Honnête. J’aime les honnêtes qui ont soif.", "teasing")], ifPlayerDry: [B("Non, tu nous regardes, nous. Tu es une personne très dangereuse.", "seductive")] }),

  nb("b-p-2a", "player", 2, PR, "Je n’ai jamais cédé à une démone qui savait exactement ce que je voulais.", [false, false, (ctx) => BQ.gave(ctx)], [
    V("À la santé de toutes les personnes qui viennent de se sentir visées.", "amused"),
  ], { requires: BQ.intrusion, save: true, why: "Lors de ses visites, vous avez cédé à Bellirith.", ifPlayerDrinks: [B("Je m’en souviens. Je m’en souviens très bien. Ne rougis pas, c’était un très bon souvenir.", "seductive")], ifPlayerDry: [B("Jamais ? Non, en effet. Tu as toujours préféré me compliquer la vie. C’est ce que j’aime chez toi.", "seductive")] }),
  nb("b-p-2b", "player", 2, PR, "Je n’ai jamais dit non à une démone et dormi tranquille ensuite.", [false, false, (ctx) => BQ.stood(ctx)], [
    V("Il dort tranquille. Regarde-le, il a l’air reposé. C’est une insulte personnelle.", "amused"),
  ], { requires: BQ.stood, save: true, why: "Vous avez déjà tenu tête à Bellirith, et vous avez dormi ensuite.", ifPlayerDrinks: [B("Bois. Tu l’as fait, et tu le referas. C’est exactement pour ça que tu es assis là.", "seductive")] }),
  nb("b-p-2c", "player", 2, PR, "Je n’ai jamais humilié une famille entière devant une parfumeuse.", [true, true, (ctx) => BQ.q1Mirror(ctx)], [
    N("Bellirith et Valurn boivent ensemble. Ils se sont humiliés l’un l’autre devant Hesterel, après tout."),
  ], { requires: BQ.q1, save: true, why: "Sous l’auvent d’Ysaure, vous les avez comparés devant Dame Hesterel.", ifPlayerDrinks: [B("Les trois ! Nous avons tous humilié cette famille. Elle s’en remettra, elle a de l’entraînement.", "teasing")], ifPlayerDry: [V("Vous n’avez humilié personne ce jour-là. Nous nous en sommes très bien chargés tout seuls.", "amused")] }),
  nb("b-p-2d", "player", 2, PR, "Je n’ai jamais flirté avec deux personnes assises à la même table.", [true, true, ASK], [
    B("Je bois. Évidemment que je bois. Je bois même pour les tables où je n’étais pas.", "seductive"),
    V("Ma sœur est là, et l’autre personne aussi. Il fallait bien boire.", "charming"),
  ], { ask: "Avez-vous déjà flirté avec deux personnes à la même table ?", ifPlayerDrinks: [B("Avec nous ? Ce soir ? Dis-le. Dis-le, que je puisse le lui répéter tous les jours.", "seductive")], ifPlayerDry: [V("Pas encore. La soirée est jeune.", "amused")] }),

  nb("b-p-3a", "player", 3, PQ, "Je n’ai jamais passé une nuit avec la femme qui vous parle.", [false, false, (ctx) => BQ.night(ctx)], [
    V("Je vais regarder le plafond pendant cette affirmation. Il est très beau, ce plafond.", "away"),
  ], { requires: BQ.night, save: true, why: "Vous avez passé une nuit avec Bellirith.", ifPlayerDrinks: [B("Bois, oui. Et n’essaie pas d’avoir l’air coupable ; tu n’y arrives pas, tu as l’air content.", "seductive")] }),
  nb("b-p-3b", "player", 3, PQ, "Je n’ai jamais été le préféré de quelqu’un qui collectionne les gens.", [false, false, (ctx) => BQ.favorite(ctx)], [
    V("Ma sœur collectionne les gens comme d’autres les flacons vides. Les préférés finissent sur la cheminée.", "neutral"),
  ], { requires: BQ.favorite, save: true, why: "Bellirith a fait de vous son favori.", ifPlayerDrinks: [B("Sur la cheminée, oui. À la meilleure place, près du feu. Tu ne t’es pas plaint.", "seductive")] }),
  nb("b-p-3c", "player", 3, PQ, "Je n’ai jamais offert un parfum pour voir ce que l’autre allait en faire.", [false, false, (ctx) => BQ.vialHer(ctx)], [
    N("Bellirith tend légèrement le poignet. L’ambre gris, cuir chaud et poivre, monte entre les trois verres."),
  ], { requires: BQ.vialHer, save: true, why: "Vous lui avez offert le flacon d’ambre gris d’Ysaure.", ifPlayerDrinks: [B("Et voilà ce que j’en ai fait. Je l’ai porté ce soir. Tu peux en conclure ce que tu veux ; tu en concluras trop, j’espère.", "seductive")] }),
  nb("b-p-3d", "player", 3, PQ, "Je n’ai jamais rencontré quelqu’un que je n’arrivais pas à lire.", [true, true, ASK], [
    N("Les yeux sur vous, Bellirith boit. Valurn aussi, en regardant la même chose."),
    B("Je ne te lis pas, {player}. Je l’avoue. C’est pour ça que tu es là, et c’est pour ça que je n’arrive pas à m’ennuyer.", "thoughtful"),
  ], { ask: "Avez-vous déjà rencontré quelqu’un que vous n’arriviez pas à lire ?", ifPlayerDrinks: [V("Lequel de nous deux ? Ne répondez pas, je préfère imaginer.", "charming")], ifPlayerDry: [B("Tu nous lis, alors. Tous les deux. C’est très impoli.", "teasing")] }),
];

/* ------------------------------------------------------------------------ */
/* Valurn vise Bellirith                                                     */
/* ------------------------------------------------------------------------ */

const VALURN_ON_BELLIRITH: BVNpcClaim[] = [
  nv("v-b-0a", "bellirith", 0, FP, "Je n’ai jamais chanté faux exprès pour faire fuir un invité.", [true, false, false], [
    N("Sans la moindre honte, Bellirith boit et fredonne trois notes atroces pour illustrer."),
    B("Le baron de Selve. Il est resté jusqu’au deuxième couplet. Un héros, à sa façon.", "smirk"),
  ]),
  nv("v-b-0b", "bellirith", 0, FP, "Je n’ai jamais séduit un capitaine de garde pour un laissez-passer et échoué.", [false, false, false], [
    B("Échoué ? Je n’échoue pas. Il m’a demandé si je cherchais ma mère, et j’ai obtenu le laissez-passer par pitié. C’est un succès.", "angry"),
    V("Elle ne boit pas. Techniquement, elle a raison. Moralement, nous savons tous ce qui s’est passé.", "amused"),
  ]),
  nv("v-b-0c", "bellirith", 0, FP, "Je n’ai jamais pleuré à un mariage.", [false, true, ASK], [
    N("Bellirith ne bouge pas. C’est Valurn qui boit, et qui s’en aperçoit une seconde trop tard."),
    B("Toi ? À un mariage ? Lequel ? Je veux le nom des mariés, de la musique et du traiteur.", "seductive"),
    V("Un client. Une très belle cérémonie. Le vin était mauvais, j’étais vulnérable.", "annoyed"),
  ], { ask: "Avez-vous déjà pleuré à un mariage ?", ifPlayerDrinks: [V("Vous aussi. Voilà, ma sœur, je ne suis plus seul. Nous sommes deux âmes délicates.", "charming")] }),
  nv("v-b-0d", "bellirith", 0, FP, "Je n’ai jamais perdu une partie de cartes contre une chaise.", [true, false, (ctx) => ctx.flags.includes("cross-bv-02-b-done")], [
    B("Elle trichait ! Elle gardait ses cartes contre le dossier !", "angry"),
    V("Une chaise. Ma sœur a perdu contre un meuble, et elle le défend encore.", "amused"),
  ], { why: "À la Salle des Élus, vous avez joué à la place de la chaise, et perdu deux mains.", ifPlayerDrinks: [B("Toi, tu as perdu en étant la chaise. C’est pire. Bois deux fois, si tu as de l’honneur.", "teasing")] }),

  nv("v-b-1a", "bellirith", 1, FP, "Je n’ai jamais pris la deuxième violette d’un plateau pour cacher que je déteste la première.", [true, false, false], [
    B("Cette famille a des obsessions malsaines pour les confiseries. Je bois par lassitude.", "smirk"),
  ]),
  nv("v-b-1b", "bellirith", 1, ALL, "Je n’ai jamais fait sécher des fleurs entre les pages d’un livre que je n’ai pas lu.", [true, false, false], [
    N("Lentement, Bellirith porte le verre à ses lèvres. Elle vous regarde par-dessus le verre, comme pour vous interdire de trouver ça charmant."),
    B("Les livres étaient ennuyeux. Les fleurs leur donnaient une raison d’exister.", "cold"),
  ]),
  nv("v-b-1c", "bellirith", 1, ALL, "Je n’ai jamais connu tous les couplets d’une chanson que je jure détester.", [true, true, ASK], [
    N("Ils boivent tous les deux. Bellirith le dévisage. Valurn hausse les épaules."),
    V("Je la connais parce que tu la chantais dans toutes les pièces où j’essayais de lire.", "charming"),
  ], { ask: "Connaissez-vous par cœur une chanson que vous prétendez détester ?", ifPlayerDrinks: [B("Laquelle ? Chante-la. Non, ne la chante pas. Si, chante-la.", "seductive")] }),
  nv("v-b-1d", "bellirith", 1, PR, "Je n’ai jamais porté un parfum offert par quelqu’un que je voulais intriguer.", [true, false, false], [
    B("Je porte ce que je veux. Si quelqu’un s’en trouve intrigué, c’est un effet secondaire.", "seductive"),
    V("Ambre gris, cuir chaud, poivre. J’étais sous l’auvent quand le flacon a changé de main.", "amused"),
  ], { requires: BQ.vialHer, save: true }),

  nv("v-b-2a", "bellirith", 2, PR, "Je n’ai jamais dû cent vingt pièces à un joaillier depuis l’automne.", [true, false, false], [
    B("Cent dix-huit. Il arrondit pour me nuire.", "angry"),
    V("Je les ai payées. Le joaillier croit que c’est toi. Tu me dois deux pièces et une humiliation.", "charming"),
    N("Bellirith ouvre la bouche, la referme. Pour une fois, elle n’a rien.", ),
  ]),
  nv("v-b-2b", "bellirith", 2, PR, "Je n’ai jamais passé une nuit avec une personne assise à cette table, puis m’en suis vantée.", [true, false, (ctx) => BQ.night(ctx)], [
    B("Je ne me suis pas vantée. J’ai informé.", "seductive"),
    V("Trois fois. Dans trois salons différents. Avec des gestes.", "amused"),
  ], { requires: BQ.night, save: true, why: "Vous avez passé une nuit avec Bellirith, et elle l’a fait savoir.", ifPlayerDrinks: [N("Vous buvez aussi. Bellirith vous adresse un clin d’œil appuyé, Valurn un regard de condoléance.")] }),
  nv("v-b-2c", "bellirith", 2, PQ, "Je n’ai jamais fait semblant de ne pas attendre quelqu’un, en occupant la meilleure place de la salle.", [true, false, false], [
    B("Je n’attendais pas. J’occupais la salle. C’est une activité à part entière.", "cold"),
    V("Elle boit en niant. Je vous apprends à lire cette famille : le verre dit vrai, la bouche fait de la décoration.", "charming"),
  ]),
  nv("v-b-2d", "bellirith", 2, PQ, "Je n’ai jamais mis quelqu’un au défi de me dire non, en espérant qu’il oserait.", [true, false, false], [
    B("Oh. Tu me connais mieux que je ne le pensais. C’est dégoûtant.", "seductive"),
    N("Elle vous regarde en buvant. Le regard dure exactement le temps de la gorgée."),
  ]),

  nv("v-b-3a", "bellirith", 3, PQ, "Je n’ai jamais gardé une rancune au chaud parce qu’elle me tenait compagnie.", [true, false, false], [
    N("D’un trait, Bellirith vide son verre. Le cristal tinte contre ses dents."),
    B("Elle me tient très bien compagnie. Mieux que toi.", "cold"),
  ]),
  nv("v-b-3b", "bellirith", 3, PQ, "Je n’ai jamais cherché quelqu’un des yeux dans une salle avant de m’asseoir.", [true, true, ASK], [
    N("Ils boivent tous les deux. Ni l’un ni l’autre ne dit qui il cherchait."),
  ], { ask: "Avez-vous déjà cherché quelqu’un des yeux avant de vous asseoir ?", ifPlayerDrinks: [B("Qui ? Non. Ne dis rien. Laisse-moi croire que c’était moi.", "seductive")], ifPlayerDry: [V("Vous entrez dans une salle sans chercher personne. Je vous envie.", "neutral")] }),
  nv("v-b-3c", "bellirith", 3, PQ, "Je n’ai jamais menti sur mes goûts pour plaire à quelqu’un que j’aimais.", [true, false, false], [
    B("Les violettes. J’ai prétendu les aimer pendant un an pour quelqu’un qui les adorait. Tu connais la suite : il les mange encore.", "thoughtful"),
    V("Ça, je l’ignorais.", "surprised"),
    B("Je sais. C’était tout l’intérêt.", "cold"),
  ]),
  nv("v-b-3d", "bellirith", 3, PQ, "Je n’ai jamais refusé une main tendue pour ne pas avoir à la lâcher plus tard.", [true, false, false], [
    N("Bellirith ne répond pas. Elle boit, repose le verre et ne le regarde plus."),
    V("Je bois aussi, en solidarité. Non. Je ne bois pas. Pardon.", "away"),
  ]),
];

/* ------------------------------------------------------------------------ */
/* Valurn vise le joueur                                                     */
/* ------------------------------------------------------------------------ */

const VALURN_ON_PLAYER: BVNpcClaim[] = [
  nv("v-p-0a", "player", 0, FP, "Je n’ai jamais parié sur l’ordre de sortie de courtisans.", [false, true, (ctx) => ctx.flags.includes("bv-q2v:bet")], [
    V("Par honnêteté, cette fois. C’est rare, prenez des notes.", "charming"),
  ], { requires: has("cross-bv-02-v-done"), save: true, why: "Dans la galerie d’audience, vous avez parié contre Valurn sur le garçon au chapeau.", ifPlayerDrinks: [V("Et vous avez gagné. Je n’en dors plus. J’exagère. J’en dors moins.", "amused")] }),
  nv("v-p-0b", "player", 0, FP, "Je n’ai jamais mangé debout au milieu d’un marché.", [true, true, ASK], [
    B("Tout le monde l’a fait. Même l’Impératrice, je l’ai vue, elle avait une brochette.", "teasing"),
  ], { ask: "Avez-vous déjà mangé debout au milieu d’un marché ?", ifPlayerDry: [V("Jamais ? Vous vous asseyez pour manger une pomme ? Je suis bouleversé.", "surprised")] }),
  nv("v-p-0c", "player", 0, FP, "Je n’ai jamais égaré une lettre que je devais absolument remettre.", [false, false, ASK], [
    V("Je pose la question pour un ami. L’ami, c’est moi, et la lettre était adressée au chancelier.", "amused"),
  ], { ask: "Avez-vous déjà égaré une lettre importante ?", ifPlayerDrinks: [B("On se fera un club. Valurn le présidera, il a l’expérience.", "smirk")] }),
  nv("v-p-0d", "player", 0, FP, "Je n’ai jamais trouvé que cette ville parlait trop fort.", [false, false, ASK], [
    B("Cette ville ne parle pas trop fort. Elle dit trop peu de choses vraies, c’est tout.", "thoughtful"),
  ], { ask: "Avez-vous déjà trouvé Al’Gratal trop bruyante ?", ifPlayerDrinks: [V("Bruyante, oui. Et pourtant vous êtes resté. J’en tire des conclusions flatteuses.", "charming")] }),

  nv("v-p-1a", "player", 1, FP, "Je n’ai jamais gagné un pari au Grand Marché contre quelqu’un qui croyait avoir l’avantage.", [false, true, (ctx) => VQ.rules(ctx)], [
    V("J’ai bu. Évidemment. J’ai gagné tous ceux qui comptent.", "charming"),
  ], { requires: VQ.anyQuest, save: true, why: "Au Grand Marché, vous avez gagné le pari du sel noir.", ifPlayerDrinks: [V("Contre moi, en plus. Je m’en souviens comme d’une très belle défaite.", "amused")] }),
  nv("v-p-1b", "player", 1, FP, "Je n’ai jamais aidé un apprenti au lieu d’aider le client qui payait.", [false, false, (ctx) => any("bv-q1:third", "bv-q1-vial:lio")(ctx)], [
    B("Le petit Lio. Il sent l’ambre gris, maintenant. Tout le quartier croit qu’il fréquente des duchesses.", "teasing"),
  ], { requires: BQ.q1, save: true, why: "Rue des Bassines, vous avez choisi Lio plutôt que Dame Hesterel.", ifPlayerDrinks: [V("Je l’ai vu faire. J’ai trouvé ça d’une inefficacité magnifique.", "charming")] }),
  nv("v-p-1c", "player", 1, PR, "Je n’ai jamais refusé de miser ma nuit de sommeil.", [false, false, (ctx) => VS.sleep(ctx)], [
    B("Tu dors ? Toutes les nuits ? Comme les gens normaux ? Je vais changer ça.", "seductive"),
  ], { requires: prefix("bv-q2-shared-v:"), save: true, why: "Vous avez dit à Valurn que vous ne parieriez jamais votre sommeil.", ifPlayerDrinks: [V("Vous me l’aviez dit dans la galerie. Je n’ai rien oublié ; je n’oublie jamais les mises qu’on refuse.", "neutral")] }),
  nv("v-p-1d", "player", 1, FP, "Je n’ai jamais choisi un camp dans une querelle de famille.", [true, true, (ctx) => any("bv-q1:bellirith", "bv-q1:valurn")(ctx)], [
    N("Bellirith et Valurn boivent avant même la fin de la phrase. Ils ont l’habitude."),
  ], { requires: BQ.q1, save: true, why: "Sous l’auvent d’Ysaure, vous avez pris le parti de l’un des deux.", ifPlayerDrinks: [B("Et tu as choisi. Je sais lequel. Je ne l’oublierai pas, dans un sens ou dans l’autre.", "seductive")], ifPlayerDry: [V("Vous n’avez choisi personne. C’est la plus fine façon de choisir tout le monde.", "charming")] }),

  nv("v-p-2a", "player", 2, PR, "Je n’ai jamais refusé de vendre la réputation de quelqu’un, même pour une bonne cause.", [false, false, (ctx) => VQ.refusedSale(ctx)], [
    V("Je ne bois pas. Je vends des réputations depuis très longtemps ; c’est un métier comme un autre, en plus élégant.", "neutral"),
  ], { requires: prefix("valurn-q2-method:"), save: true, why: "À la réception de Dame Vayre, vous avez refusé de vendre une réputation.", ifPlayerDrinks: [V("Vous l’avez fait devant moi. Ça m’a coûté une soirée et ça m’a appris quelque chose. Je ne sais pas encore quoi.", "away")], ifPlayerDry: [B("Tu l’as vendue, alors. Celle de qui ? Non, laisse, je préfère imaginer pire.", "teasing")] }),
  nv("v-p-2b", "player", 2, PR, "Je n’ai jamais remis à sa place un intermédiaire trop gourmand.", [true, false, (ctx) => VQ.bluff(ctx)], [
    B("Une fois par semaine, je remets quelqu’un à sa place. C’est mon exercice.", "smirk"),
  ], { requires: prefix("valurn-q3-deal:"), save: true, why: "Vous avez corrigé Thazran, qui en est resté vexé.", ifPlayerDrinks: [V("Thazran m’en parle encore. Il vous appelle « la personne ». Avec une majuscule.", "amused")] }),
  nv("v-p-2c", "player", 2, PR, "Je n’ai jamais protégé une source qui m’avait mis en danger.", [false, true, (ctx) => VQ.odileShielded(ctx)], [
    V("Ça m’est arrivé, une fois ou deux. Il m’arrive d’être un imbécile utile.", "neutral"),
  ], { requires: VQ.odileAny, save: true, why: "Au comptoir du Croissant, vous avez protégé Odile.", ifPlayerDrinks: [B("Toi aussi, alors. Les imbéciles utiles se reconnaissent entre eux, paraît-il.", "teasing")] }),
  nv("v-p-2d", "player", 2, PR, "Je n’ai jamais reproché en face à quelqu’un ses fausses pistes.", [true, false, (ctx) => VQ.accused(ctx)], [
    B("Je le fais à chaque phrase qu’il prononce. C’est un sport.", "smirk"),
  ], { requires: VQ.reaction, save: true, why: "Après la partie truquée, vous avez reproché à Valurn ses fausses pistes.", ifPlayerDrinks: [V("Et vous aviez raison. Je l’ai su tout de suite. J’ai attendu trois jours pour l’admettre, par élégance.", "neutral")] }),

  nv("v-p-3a", "player", 3, PQ, "Je n’ai jamais nommé quelqu’un devant tout un réseau pour fermer un dossier.", [false, true, (ctx) => VQ.odileNamed(ctx)], [
    N("Valurn boit. Il ne commente pas. Pour une fois, il n’a rien d’élégant à ajouter."),
  ], { requires: VQ.odileAny, save: true, why: "Odile a été nommée devant le réseau, par vous ou sous votre pression.", ifPlayerDrinks: [V("Nous l’avons fait ensemble. Je ne vous en charge pas. Je ne m’en décharge pas non plus.", "away")] }),
  nv("v-p-3b", "player", 3, PQ, "Je n’ai jamais fait perdre une saison entière à quelqu’un qui le méritait.", [true, true, (ctx) => VQ.contremarche(ctx)], [
    B("Le mérite est une notion très surestimée. Je bois quand même.", "smirk"),
  ], { requires: VQ.outcome, save: true, why: "Le contre-marché a fait perdre la saison à Halbrecht.", ifPlayerDrinks: [V("Halbrecht ne vous pardonnera pas. C’est une excellente recommandation.", "charming")], ifPlayerDry: [V("Vous avez choisi une autre conclusion. Plus coûteuse pour moi, plus propre pour tout le monde.", "neutral")] }),
  nv("v-p-3c", "player", 3, PQ, "Je n’ai jamais accepté l’aide de Valurn en me demandant ce qu’elle allait me coûter.", [false, false, (ctx) => VQ.helpAccepted(ctx)], [
    B("Il se vise lui-même. Il adore. Il se trouve passionnant.", "teasing"),
  ], { requires: prefix("valurn-help:"), save: true, why: "Vous avez accepté l’aide de Valurn.", ifPlayerDrinks: [V("Elle ne vous a rien coûté. C’est ce qui inquiète tout le monde.", "charming")], ifPlayerDry: [V("Vous l’avez gardée en réserve. Je respecte ça. Je le déteste, mais je le respecte.", "amused")] }),
  nv("v-p-3d", "player", 3, PQ, "Je n’ai jamais gardé pour moi un avis que personne n’avait demandé, alors qu’il aurait tout changé.", [false, false, ASK], [
    V("Je ne vous connais pas assez pour deviner celui-là. C’est la première phrase de la soirée que je lance sans savoir où elle tombera.", "neutral"),
  ], { ask: "Avez-vous déjà gardé pour vous un avis qui aurait tout changé ?", ifPlayerDrinks: [B("Tu boirais pour ça ? Alors tu en as un en ce moment. Je le sens. Garde-le, il mûrit.", "thoughtful")], ifPlayerDry: [V("Vous dites ce que vous pensez quand ça compte. C’est très dangereux, à cette table.", "amused")] }),
];

export const BV_NPC_CLAIMS: BVNpcClaim[] = [...BELLIRITH_ON_VALURN, ...BELLIRITH_ON_PLAYER, ...VALURN_ON_BELLIRITH, ...VALURN_ON_PLAYER];

/* ------------------------------------------------------------------------ */
/* Affirmations qui réagissent à la soirée elle-même                         */
/* ------------------------------------------------------------------------ */

const missed = (actor: BVActor) => (s: BVNeverState) => s.log.some((entry) => entry.speaker === actor && entry.target !== "none" && entry.claimId !== "" && !entry.drinkers.includes(entry.target as BVActor));
const targetedMost = (actor: BVActor) => (s: BVNeverState) => s.log.filter((entry) => entry.target === actor).length >= 3;

export const BV_NPC_EVENING: BVNpcClaim[] = [
  nb("eve-b-1", "player", 1, PR, "Je n’ai jamais visé deux fois la même femme dans la même soirée.", [false, false, (_ctx, s) => s.attacks["player>bellirith"] >= 2], [
    B("Deux fois. Trois, peut-être. J’ai compté chaque flèche, et je les ai toutes gardées.", "seductive"),
  ], { evening: ev.playerHitBellirith(2), why: "Vous avez visé Bellirith plusieurs fois ce soir.", ifPlayerDrinks: [V("Il boit pour s’être acharné sur toi. Je n’ai jamais vu de déclaration plus élégante.", "amused")] }),
  nb("eve-b-2", "valurn", 1, PR, "Je n’ai jamais bu plus que ma sœur à un jeu qu’elle a inventé.", [false, true, false], [
    V("Ce jeu est truqué par nature. Je le savais en entrant. Je bois avec lucidité.", "neutral"),
    B("Il boit avec lucidité. Il dit ça à chaque fois qu’il perd.", "smirk"),
  ], { evening: ev.valurnDrankMost }),
  nb("eve-b-3", "player", 1, PR, "Je n’ai jamais passé la moitié d’une soirée sans boire une seule goutte.", [false, false, (_ctx, s) => s.drinks.player === 0], [
    B("Regarde-le. Sec comme une pierre de gué. Tu nous as laissés couler tout seuls.", "teasing"),
  ], { evening: ev.playerDry, why: "Vous n’avez pas encore bu une seule fois ce soir.", ifPlayerDrinks: [V("Le voilà forcé de boire pour avoir été trop sage. Ma sœur a inventé la morale inversée.", "amused")] }),
  nb("eve-b-4", "player", 2, PR, "Je n’ai jamais avoué une chose que personne ne pouvait prouver.", [false, false, (_ctx, s) => s.log.some((entry) => entry.answer === "acknowledge")], [
    B("Tu as avoué tout à l’heure. Personne ne t’y obligeait. C’était la chose la plus excitante de la soirée.", "seductive"),
  ], { evening: ev.admitted, why: "Plus tôt ce soir, vous avez reconnu de vous-même un fait que rien ne prouvait.", ifPlayerDrinks: [V("Et il recommence. Ma sœur, tu viens d’apprendre à quelqu’un que l’honnêteté se paie en verres.", "charming")] }),
  nb("eve-b-5", "player", 1, PR, "Je n’ai jamais esquivé une question en souriant.", [true, false, (_ctx, s) => s.log.some((entry) => entry.answer === "dodge" || entry.answer === "deny")], [
    B("Je bois, évidemment. Je ne réponds jamais autrement.", "smirk"),
  ], { evening: ev.dodged, why: "Vous avez esquivé ou nié une question plus tôt dans la soirée.", ifPlayerDrinks: [V("Vous avez souri en esquivant, tout à l’heure. Elle l’a vu. Elle voit tout ce qu’elle sait faire elle-même.", "amused")] }),
  nb("eve-b-6", "player", 2, PR, "Je n’ai jamais bu en même temps que vous deux, ce soir.", [true, true, true], [
    N("Les trois verres se lèvent de nouveau. C’est déjà arrivé une fois ; c’est précisément ce que la phrase voulait dire."),
    B("Voilà. Deux fois. Nous devenons une tradition.", "seductive"),
  ], { evening: ev.allDrank, why: "Plus tôt ce soir, les trois verres se sont levés ensemble." }),
  nv("eve-v-1", "player", 1, PR, "Je n’ai jamais pris pour cible un homme sans défense, plusieurs fois, dans la même soirée.", [false, false, (_ctx, s) => s.attacks["player>valurn"] >= 2], [
    V("Je parle de moi, évidemment. Sans défense. Regardez cette mine.", "charming"),
  ], { evening: ev.playerHitValurn(2), why: "Vous avez visé Valurn plusieurs fois ce soir.", ifPlayerDrinks: [B("Sans défense ! Il a des canines, des avocats et une cave. Bois, {player}, mais bois en riant.", "teasing")] }),
  nv("eve-v-2", "bellirith", 1, PR, "Je n’ai jamais perdu à mon propre jeu.", [(s) => s.drinks.bellirith > s.drinks.valurn, (s) => s.drinks.valurn > s.drinks.bellirith, false], [
    V("Compte les verres, ma sœur. Les verres ne flattent personne.", "amused"),
  ], { evening: ev.bellirithDrankMost }),
  nv("eve-v-3", "player", 2, PR, "Je n’ai jamais bu davantage que ce que j’étais prêt à avouer.", [false, true, (_ctx, s) => s.drinks.player >= 3], [
    V("Je bois aussi. Je n’avoue jamais autant que je bois. C’est une question d’hygiène.", "neutral"),
  ], { evening: ev.playerDrank(3), why: "Vous avez déjà bu plusieurs fois ce soir.", ifPlayerDrinks: [B("Encore un verre sans explication. Je commence à aimer ton silence liquide.", "seductive")] }),
  nv("eve-v-4", "player", 1, PR, "Je n’ai jamais regardé deux démons se dévorer en prenant des notes.", [false, false, (_ctx, s) => s.attacks["player>bellirith"] + s.attacks["player>valurn"] === 0], [
    V("Vous n’avez visé personne. Vous nous regardez. Je soupçonne un livre en préparation.", "amused"),
  ], { evening: ev.playerIgnoredBoth, why: "Vous n’avez encore visé ni Bellirith ni Valurn ce soir.", ifPlayerDrinks: [B("Les silencieux sont les pires. Ils se souviennent de tout.", "teasing")] }),
  nv("eve-v-5", "player", 1, PR, "Je n’ai jamais visé quelqu’un ce soir en manquant complètement ma cible.", [missed("bellirith"), missed("valurn"), (_ctx, s) => missed("player")(s)], [
    V("Je vise large pour que tout le monde puisse participer. C’est démocratique.", "charming"),
  ], { evening: ev.playerMissed, why: "Une de vos affirmations ciblées n’a pas fait boire la personne visée.", ifPlayerDrinks: [B("Ta flèche de tout à l’heure. Elle est encore plantée dans le mur. Je l’ai trouvée charmante.", "teasing")] }),
  nv("eve-v-6", "bellirith", 2, PR, "Je n’ai jamais été la cible préférée de quelqu’un, ce soir.", [targetedMost("bellirith"), targetedMost("valurn"), false], [
    V("Les verres ont parlé. Personne ne s’en plaindra, ma sœur adore être visée.", "amused"),
  ], { evening: (s) => targetedMost("bellirith")(s) || targetedMost("valurn")(s) }),
];

/* ------------------------------------------------------------------------ */
/* Après le choc : affirmations de la retombée                               */
/* ------------------------------------------------------------------------ */

export const BV_NPC_FALLOUT: BVNpcClaim[] = [
  nb("fall-b-1", "valurn", 0, R, "Je n’ai jamais eu envie de rire avec toi, ce soir.", [true, false, false], [
    N("Le verre de Bellirith se lève, et le geste a quelque chose d’une reddition. Elle le sait."),
    B("Le papillon n’est pas encore entré. Je triche, je bois d’avance.", "thoughtful"),
  ]),
  nb("fall-b-2", "player", 1, R, "Je n’ai jamais trouvé quelqu’un plus intéressant que ma propre colère.", [true, false, false], [
    B("Ce soir, oui. Toi. Ne te vante pas, la concurrence était faible.", "seductive"),
  ]),
  nb("fall-b-3", "valurn", 1, R, "Je n’ai jamais oublié à quoi ressemblait ton rire.", [true, false, false], [
    V("Mon verre reste où il est. Moi, je l’avais oublié. Je viens de m’en souvenir.", "away"),
  ]),
  nb("fall-b-4", "player", 1, R, "Je n’ai jamais eu envie qu’un inconnu reste jusqu’à la fin.", [true, true, ASK], [
    N("Les deux démons boivent. Ils évitent soigneusement de vous regarder en même temps."),
  ], { ask: "Avez-vous déjà voulu qu’un presque inconnu reste jusqu’au bout ?", ifPlayerDrinks: [B("Nous ? Tu voulais que nous restions ? Comme c’est imprudent.", "seductive")] }),
  nb("fall-b-5", "player", 2, R, "Je n’ai jamais accepté une invitation en promettant de faire boire tout le monde avant minuit.", [false, false, (ctx) => has("bv-accept:taquine")(ctx)], [
    B("Minuit est passé depuis longtemps. Tu as tenu parole, à peu près. Je t’accorde le « à peu près ».", "teasing"),
  ], { requires: prefix("bv-accept:"), save: true, why: "À la Cloche Fêlée, vous aviez promis de les faire boire tous les deux avant minuit.", ifPlayerDrinks: [V("Il l’avait promis à la Cloche Fêlée. Je l’avais noté. J’ai perdu ce pari-là aussi.", "amused")] }),
  nb("fall-b-6", "valurn", 0, R, "Je n’ai jamais bu de l’eau à cette table.", [false, false, false], [
    N("Personne ne boit. Bellirith regarde la carafe d’eau sur la console comme on regarde une idée qu’on aura plus tard."),
  ]),
  nv("fall-v-1", "bellirith", 0, R, "Je n’ai jamais cessé de compter jusqu’à douze avant de faire une bêtise.", [false, true, false], [
    V("Jusqu’à douze. Toujours. Ça ne m’a jamais empêché d’en faire, seulement de m’en souvenir avec précision.", "neutral"),
  ]),
  nv("fall-v-2", "player", 1, R, "Je n’ai jamais été aussi bien écouté par quelqu’un qui ne me devait rien.", [false, true, false], [
    V("À votre santé, du coup. C’est la seule dette que je contracte volontiers.", "charming"),
  ]),
  nv("fall-v-3", "bellirith", 1, R, "Je n’ai jamais trouvé que ma sœur chantait faux.", [false, true, false], [
    V("Je bois parce que je mens. Elle chante juste. Elle chante juste exprès pour qu’on la croie quand elle chante faux.", "away"),
    B("Ne me fais pas de compliment ce soir. Je ne saurais pas où le ranger.", "cold"),
  ]),
  nv("fall-v-4", "player", 2, R, "Je n’ai jamais accepté une invitation par simple amitié.", [false, false, (ctx) => has("bv-accept:amicale")(ctx)], [
    V("Je pose la question pour comprendre ce que vous faites encore ici. Ça m’échappe, et ça me plaît.", "charming"),
  ], { requires: prefix("bv-accept:"), save: true, why: "À la Cloche Fêlée, vous avez accepté sans arrière-pensée.", ifPlayerDrinks: [B("Par amitié. Il est venu par amitié. Valurn, ça existe donc.", "thoughtful")] }),
  nv("fall-v-5", "player", 1, R, "Je n’ai jamais voulu qu’une soirée dure plus longtemps que prévu.", [true, true, ASK], [
    N("Ils boivent tous les deux, sans se consulter. Le geste les étonne, puis les amuse."),
  ], { ask: "Avez-vous voulu que cette soirée-ci dure plus longtemps ?", ifPlayerDrinks: [V("Alors nous sommes trois. Je vais fermer la porte à clef et jeter la clef par la fenêtre.", "amused")] }),
  nv("fall-v-6", "bellirith", 1, R, "Je n’ai jamais posé ma veste sur quelqu’un qui dormait, en espérant qu’il ne le saurait jamais.", [false, true, false], [
    B("Toi ? Sur qui ?", "thoughtful"),
    V("Personne. Une chaise. Elle avait froid.", "away"),
  ]),
];

/* ------------------------------------------------------------------------ */
/* Le pivot : une affirmation sur l’abandon, et Valurn boit                  */
/* ------------------------------------------------------------------------ */

const PIVOT_AFTERMATH: DialogueLine[] = [
  N("Bellirith ne bouge pas. Son sourire reste en place, mais quelque chose derrière lui vient de s’éteindre, comme une lampe qu’on souffle dans la pièce d’à côté."),
  N("C’est Valurn qui boit. Il porte le verre à ses lèvres sans le regarder, sans regarder personne, et l’avale lentement, sans un seul de ses gestes de théâtre."),
  N("Vous comprenez que la phrase ne visait pas cet endroit-là, et qu’elle y est arrivée quand même."),
];

export const BV_PIVOT_CLAIMS: BVPlayerClaim[] = [
  pc("pivot-1", "bellirith", "confiance", 3, 0, "Je n’ai jamais laissé derrière moi quelqu’un qui comptait sur mon retour.", [false, true, false], [
    ...PIVOT_AFTERMATH,
    B("Voilà. C’est presque élégant, quand quelqu’un d’autre trouve la phrase.", "cold"),
  ], { phases: PQ }),
  pc("pivot-2", "valurn", "confiance", 3, 0, "Je n’ai jamais manqué à une promesse faite à quelqu’un de ma famille.", [false, true, false], [
    ...PIVOT_AFTERMATH,
    B("Tu as visé juste, {player}. Plus juste que tu ne le crois. Regarde-le boire.", "cold"),
  ], { phases: PQ }),
  pc("pivot-3", "none", "confiance", 3, 0, "Je n’ai jamais abandonné quelqu’un en croyant le protéger.", [false, true, false], [
    ...PIVOT_AFTERMATH,
    B("En croyant le protéger. Comme c’est joliment dit. Il a dû l’entendre souvent, dans sa propre tête.", "cold"),
  ], { phases: PQ }),
  pc("pivot-4", "bellirith", "confiance", 3, 0, "Je n’ai jamais choisi de ne pas revenir.", [false, true, false], [
    ...PIVOT_AFTERMATH,
    B("Choisi. Tu as dit « choisi ». Tu ne pouvais pas savoir. Lui, si.", "cold"),
  ], { phases: PQ }),
];

export const BV_PIVOT_FORCED: BVBeat = {
  id: "r1", speaker: "bellirith", mood: "seductive", drinkers: ["valurn"],
  text: "Je n’ai jamais fait attendre quelqu’un qui croyait en moi, en lui jurant que je reviendrais.",
  lines: [
    B("Ça, c’est pour toi, {player}. Tu as l’air de quelqu’un qui fait attendre les gens.", "teasing"),
    N("Vous ne buvez pas. Bellirith non plus. Elle attend de voir votre verre bouger, ravie de son coup, et c’est le verre de Valurn qui se lève."),
    N("Il boit sans un mot, lentement, sans la moindre de ses élégances. Le sourire de Bellirith reste à sa place, mais quelque chose derrière lui s’arrête."),
    B("Oh. Je ne te visais pas. Tu t’es servi tout seul.", "cold"),
  ],
};

export const BV_PIVOT_SILENCE: BVBeat = {
  id: "r1b", speaker: "valurn", mood: "away", drinkers: [],
  text: "Je n’ai jamais… Non. Je passe.",
  lines: [
    N("Valurn repose son verre, plein. Il a commencé une phrase qui ne voulait pas finir. Personne ne lui reproche d’avoir passé son tour ; personne n’en a envie."),
    B("Il passe. Retiens ce moment, {player}. Il n’a jamais passé un tour de sa vie.", "cold"),
  ],
};

/* ------------------------------------------------------------------------ */
/* Les vérités dont on boit : ordre de découverte inaltérable                */
/* ------------------------------------------------------------------------ */

export const BV_REVEAL_BEATS: Record<"r2" | "r3" | "r4" | "r5" | "r6" | "r7", BVBeat> = {
  r2: {
    id: "r2", speaker: "bellirith", mood: "cold", drinkers: ["bellirith"],
    text: "Je n’ai jamais serré contre moi un porte-bonheur qu’on m’avait donné pour que je reste sagement cachée.",
    lines: [
      N("Bellirith boit. Elle boit à sa propre phrase, les yeux plantés dans ceux de son frère, et repose le verre avec une douceur qui fait plus de bruit qu’un coup."),
      B("Tu veux savoir, {player} ? Puisque tu es là. Un talisman. Une jolie pierre sertie dans du métal, et des mots très tendres pour l’accompagner. « Garde-le contre toi. Tant que tu le tiens, ils ne te verront pas. Reste là. Je reviens. »", "cold"),
      B("Un camouflage. Une petite merveille pour se faire oublier des soldats. Je l’ai tenu contre mon cœur pendant qu’ils fouillaient. Je l’ai tenu quand ils m’ont trouvée. Je le tenais encore quand j’ai compris qu’il ne viendrait pas.", "cold"),
      V("Bellirith.", "away"),
      B("Il a toujours eu un goût exquis pour les babioles inutiles. Celle-là était la plus jolie de toutes.", "smirk"),
      N("Valurn ouvre la bouche. Il la referme. Son verre est vide et il ne le remplit pas."),
    ],
  },
  r3: {
    id: "r3", speaker: "valurn", mood: "away", drinkers: ["valurn", "bellirith"], knowledge: "bellirith-wanted-humanity",
    text: "Je n’ai jamais connu quelqu’un qui voulait être humain plus que tout au monde.",
    lines: [
      N("Valurn boit à sa propre affirmation. Bellirith aussi, d’un geste sec, comme on signe un document qu’on n’a pas envie de relire."),
      V("Elle était à moitié de chaque côté, à l’époque. Une moitié de notre père, une moitié d’autre chose, de plus tiède. Elle détestait la première. Elle passait ses nuits à essayer de la faire taire.", "neutral"),
      B("Je voulais avoir froid quand il faisait froid. Je voulais qu’on me désire sans que je l’aie demandé à l’air de la pièce. Je voulais une vie qui finisse. C’était une ambition très modeste, et il la connaissait par cœur.", "thoughtful"),
      V("On a entendu parler d’un objet. Une pièce ancienne qui canalisait le Chaos, qui le stabilisait. Nous en avons tiré une conclusion très optimiste.", "neutral"),
      B("Nous ? J’ai tiré la conclusion. Tu as dit « peut-être ». Tu disais toujours « peut-être » quand tu voulais que je sois heureuse sans rien promettre.", "cold"),
      B("Je pensais qu’il me rendrait maîtresse de ce que j’étais. Qu’avec lui je pourrais devenir plus humaine. Peut-être tout à fait. On rêve grand quand on a peu de temps.", "thoughtful"),
      V("Et notre père regardait tout ça de loin, avec ce sourire qu’il réserve aux enfants qui se croient discrets.", "away"),
      N("Pendant quelques instants, ils ne se battent plus. Ils se souviennent, chacun d’un côté de la table, de la même pièce, de la même lumière, de la même confiance."),
    ],
  },
  r4: {
    id: "r4", speaker: "bellirith", mood: "cold", drinkers: ["valurn"], knowledge: "bv-talisman-transfer",
    text: "Je n’ai jamais menti sur ce que faisait l’objet que je mettais dans la main de quelqu’un.",
    lines: [
      N("Bellirith a lancé la phrase comme on jette un gant, sûre de sa cible et de son effet. Valurn boit. Mais il boit autrement, et elle le voit."),
      B("Tu bois pour quoi ? Pour la pierre ? Pour le métal ? Il était très laid, ce métal.", "teasing"),
      V("Le talisman ne cachait rien du tout.", "neutral"),
      N("Le silence tombe d’un coup, net, comme une lame dans une planche."),
      V("Les soldats de l’Empire nous encerclaient. Je l’avais prévu. J’avais un plan. Toi, tu attirais leurs yeux ; moi, je passais par l’ouverture pour prendre l’objet. Ensuite je déclenchais le talisman, et il te sortait de là. Il te déplaçait. Ailleurs. Loin d’eux. Jusqu’à moi.", "neutral"),
      B("Il me déplaçait.", "cold"),
      V("C’était un talisman de transfert. Il fonctionnait. Je t’ai dit qu’il te cachait, parce que si tu avais su qu’il pouvait t’emporter, tu ne serais pas restée assez longtemps pour servir de diversion.", "neutral"),
      B("Tu m’as menti pour que je reste à la bonne place. Comme une pièce sur un plateau.", "angry"),
      V("Oui.", "away"),
      B("Il aurait pu me sortir de là. À n’importe quel moment.", "cold"),
      V("Oui.", "away"),
      N("Bellirith rit, très bas. Ce rire-là ne ressemble à aucun de ceux de la soirée."),
    ],
  },
  r5: {
    id: "r5", speaker: "valurn", mood: "neutral", drinkers: ["valurn"], knowledge: "bv-artifact-actual-effect",
    text: "Je n’ai jamais volé quelque chose pour découvrir, en m’en servant, qu’il ne pouvait pas faire ce qu’on espérait.",
    lines: [
      N("Valurn boit à sa propre phrase. Il ne cherche plus à faire boire personne d’autre."),
      V("Je l’ai pris. L’objet. Ça a marché, le vol. Tout le plan a marché jusque-là.", "neutral"),
      V("Et je m’en suis servi. Sur moi. Je voulais savoir avant de te le donner. Il stabilisait le Chaos, vraiment. Le bruit dans la tête s’est calmé. Pour la première fois depuis toujours, j’ai su exactement ce que j’étais.", "away"),
      V("Il ne changeait rien à ce que nous sommes. Rien. Il apaisait la nature. Il ne l’enlevait pas. Je ne le savais pas avant. Je l’ai appris en le tenant.", "neutral"),
      B("Tu l’as essayé avant moi.", "cold"),
      V("Oui.", "away"),
      B("Évidemment. Même mon espoir, tu l’as goûté le premier.", "angry"),
      N("Elle détourne les yeux vers le feu. Vous voyez ses doigts se crisper sur le pied du verre, puis se détendre, un par un, par pure volonté."),
    ],
  },
  r6: {
    id: "r6", speaker: "bellirith", mood: "thoughtful", drinkers: ["valurn"], knowledge: "bv-abandon-chosen",
    text: "Je n’ai jamais tenu le moyen de sauver quelqu’un et décidé de ne pas m’en servir.",
    lines: [
      B("Attends. Tu avais l’objet. Tu avais le talisman. Tu allais le déclencher. Tu allais venir me chercher, et quelque chose t’en a empêché. C’est ça ? Dis-moi que c’est ça.", "thoughtful"),
      N("Il y a, une seconde, dans sa voix, quelque chose de très jeune, qui espère."),
      N("Valurn boit."),
      V("Rien ne m’en a empêché. Je pouvais l’activer. J’ai choisi de ne pas le faire.", "neutral"),
      V("Je savais que l’objet ne te rendrait jamais humaine. Je savais que tu passerais ta vie à le chercher autrement, à mi-chemin, en te déchirant chaque nuit. Je me suis dit qu’en perdant ta part humaine, tu souffrirais moins qu’en t’accrochant à un espoir impossible.", "neutral"),
      V("Je l’ai décidé seul. Ce n’était pas à moi.", "away"),
      B("Tu ne vas pas me dire que je l’aurais voulu.", "cold"),
      V("Non. Tu ne l’aurais pas voulu.", "away"),
      B("Je voulais vivre entre deux. Je voulais me déchirer, si c’était ma façon de rester moi. Je voulais rater toute seule.", "angry"),
      N("Personne ne remplit les verres. Le talisman aurait fonctionné. Il le dit, elle l’entend, et rien de ce qui viendra ensuite n’y changera rien."),
    ],
  },
  r7: {
    id: "r7", speaker: "valurn", mood: "away", drinkers: ["bellirith"],
    text: "Je n’ai jamais fait de ma colère l’endroit où je range ce que j’ai perdu.",
    lines: [
      N("Bellirith boit. Lentement. Une fissure fine comme un cheveu court dans le cristal et s’arrête sous son pouce. L’air sent le miel brûlé et le jasmin devenu amer."),
      V("Ta haine. Elle tient au chaud la femme d’avant. Si tu me pardonnais, il ne te resterait plus rien d’elle.", "neutral"),
      B("Tu crois que c’est l’abandon, qui me brûle ? On m’a abandonnée cent fois depuis. Je m’en remets toujours très bien, avec quelqu’un de joli et une bouteille de mieux.", "seductive"),
      B("Tu m’as pris le choix. Tu as décidé ce que je devais devenir, comme on décide de la couleur d’un salon. Je serais peut-être morte entre deux natures. Mais c’est moi qui serais morte. C’était à moi.", "cold"),
      V("Je sais.", "away"),
      B("Tu sais. Tu le sais depuis des siècles et tu l’as tenu au chaud, toi aussi. Nous avons chacun notre cheminée.", "cold"),
      N("Elle fait tourner une de ses bagues pour avoir quelque chose de froid sous les doigts. Puis elle se tourne vers vous, et son sourire revient, intact, cruel, vivant."),
      B("À toi, {player}. Le jeu continue. Personne ici n’a le droit de devenir sérieux trop longtemps.", "seductive"),
    ],
  },
};

/* ------------------------------------------------------------------------ */
/* Les affirmations du joueur                                                */
/* La vérité du joueur vient de sa sauvegarde ; sinon il est cru sur parole. */
/* ------------------------------------------------------------------------ */

const sv = (test: (ctx: BVTruthCtx) => boolean) => (ctx: BVTruthCtx) => test(ctx);

const HUMOUR: BVPlayerClaim[] = [
  pc("p-hu-1", "none", "humour", 0, 1, "Je n’ai jamais dansé sur une table.", [true, true, false], [B("Sur une table, sous une table, et une fois sur un lustre. Le lustre s’en souvient mieux que moi.", "teasing"), V("La table était à moi. Je l’ai fait vernir depuis.", "amused")]),
  pc("p-hu-2", "valurn", "humour", 0, 1, "Je n’ai jamais changé trois fois de tenue avant de sortir.", [true, true, false], [V("Trois ? Quel ascète. Je m’arrête généralement à la cinquième, par épuisement des miroirs.", "charming")]),
  pc("p-hu-3", "bellirith", "humour", 0, 0, "Je n’ai jamais fait semblant de connaître une chanson.", [false, true, false], [V("Tout le monde chantait, j’ai fait les lèvres. Personne ne regarde les lèvres d’un homme qui chante faux.", "amused"), B("Moi, je les regardais.", "smirk")]),
  pc("p-hu-4", "none", "humour", 0, 1, "Je n’ai jamais mangé le dessert de quelqu’un d’autre en lui laissant croire qu’il l’avait fini.", [true, false, false], [B("Il était distrait. Et la crème était fouettée à la perfection. Je n’ai aucun remords, rien que des souvenirs sucrés.", "seductive")]),
  pc("p-hu-5", "valurn", "humour", 0, 0, "Je n’ai jamais parlé à un miroir pour répéter un compliment.", [false, true, false], [V("Pour vérifier son effet. C’est de la méthode. Le miroir n’a jamais protesté.", "charming"), B("Le miroir n’ose plus.", "teasing")]),
  pc("p-hu-6", "bellirith", "humour", 0, 1, "Je n’ai jamais perdu une chaussure en quittant un bal.", [true, false, false], [B("Une seule ? On voit que tu as quitté des bals ennuyeux. Moi, j’ai perdu les deux, un bracelet et un vicomte.", "teasing")]),
  pc("p-hu-7", "none", "humour", 1, 0, "Je n’ai jamais menti sur mon âge.", [true, true, false], [N("Ils lèvent leur verre avec un ensemble parfait. Vous n’oserez jamais leur demander de combien.")]),
  pc("p-hu-8", "valurn", "humour", 0, 1, "Je n’ai jamais confondu deux personnes en les saluant.", [false, true, false], [V("Une comtesse et sa tante. Je les ai complimentées pour la mauvaise robe. Elles ne s’adressent plus la parole, et je n’y suis pour rien.", "amused")]),
  pc("p-hu-9", "bellirith", "humour", 0, 0, "Je n’ai jamais fait rougir un garde en lui demandant l’heure.", [true, false, false], [B("Tous. Ils rougissent tous, à heure fixe, comme une horloge bien réglée.", "seductive")]),
  pc("p-hu-10", "none", "humour", 0, 1, "Je n’ai jamais caché un verre de vin dans un pot de fleurs.", [true, true, false], [V("Les plantes du palais sont très bien nourries. Elles ont toutes un léger accent du Sud.", "amused")]),
  pc("p-hu-11", "valurn", "humour", 0, 0, "Je n’ai jamais joué une partie de cartes en trichant si mal que tout le monde l’a vu.", [true, false, false], [B("Une fois. J’avais six reines. Personne n’a rien dit, j’ai trouvé ça très galant.", "teasing"), V("C’était ma partie. J’ai dit quelque chose. On ne m’a pas cru.", "annoyed")]),
  pc("p-hu-12", "bellirith", "humour", 1, 1, "Je n’ai jamais lancé une rumeur juste pour voir jusqu’où elle irait.", [true, true, false], [B("Jusqu’à Al’Gratal et retour, en trois jours. J’étais très fière d’elle.", "smirk"), V("Elle parlait de moi. J’ai dû l’aider pour qu’elle revienne plus vite.", "charming")]),
  pc("p-hu-13", "none", "humour", 0, 0, "Je n’ai jamais été mis à la porte d’une boutique.", [false, true, sv(VQ.refusedSale)], [V("Rien qu’une. J’avais simplement demandé ce que coûtait le marchand lui-même.", "amused")], { why: "Vous avez refusé net une vente pendant les affaires de Valurn ; on vous a raccompagné." , save: true }),
  pc("p-hu-14", "valurn", "humour", 1, 0, "Je n’ai jamais été jaloux d’un chat.", [false, true, false], [V("Il dormait sur les genoux d’une personne remarquable, en ne faisant strictement rien. J’étais ulcéré.", "annoyed"), B("Le chat avait meilleur goût que toi.", "teasing")]),
];

const RELATIONS: BVPlayerClaim[] = [
  pc("p-re-1", "bellirith", "relations", 1, 0, "Je n’ai jamais oublié le prénom de quelqu’un avec qui j’avais passé la nuit.", [true, false, false], [B("Oublié ? Je ne l’ai jamais demandé. C’est plus honnête, et ça fait gagner du temps le matin.", "seductive")]),
  pc("p-re-2", "valurn", "relations", 1, 0, "Je n’ai jamais écrit une lettre d’amour sans l’envoyer.", [false, true, false], [V("Plusieurs. Elles sont mieux écrites que celles que j’ai envoyées. Les destinataires y ont gagné.", "away")]),
  pc("p-re-3", "none", "relations", 1, 1, "Je n’ai jamais embrassé quelqu’un pour faire enrager une tierce personne.", [true, true, false], [N("Deux verres. Bellirith et Valurn se regardent, et vous comprenez qu’il s’agissait peut-être de la même tierce personne."), B("Ne demande pas, {player}.", "smirk")]),
  pc("p-re-4", "bellirith", "relations", 2, 0, "Je n’ai jamais été amoureux d’une personne qui ne s’en est jamais doutée.", [false, true, false], [V("Elle ne s’en est jamais doutée. C’était très reposant, pour elle.", "away"), B("Tu me caches des choses.", "thoughtful")]),
  pc("p-re-5", "valurn", "relations", 1, 1, "Je n’ai jamais rompu par écrit.", [true, true, false], [B("Par écrit, par messager, une fois par perroquet. Il répétait mal, ça a duré trois semaines de plus.", "teasing")]),
  pc("p-re-6", "none", "relations", 1, 0, "Je n’ai jamais eu de rendez-vous galant à cette cour.", [true, true, sv(datedAnyone)], [B("Ça dépend de ce qu’on appelle galant. Moi, j’appelle galant tout ce qui finit tard.", "seductive")], { why: "Votre sauvegarde garde la trace d’au moins un rendez-vous.", save: true, ifPlayerDrinks: [V("Il boit. Je ne demanderai pas avec qui. Je le saurai demain matin, comme tout le monde.", "amused")] }),
  pc("p-re-7", "bellirith", "relations", 2, 0, "Je n’ai jamais passé la nuit avec quelqu’un de cette cour.", [true, true, sv(intimateWithAnyone)], [B("De cette cour. Quelle précision charmante. Je bois à la cour tout entière.", "seductive")], { why: "Votre sauvegarde garde la trace d’une nuit partagée.", save: true, ifPlayerDrinks: [V("Je retiens mes questions avec un héroïsme qu’on ne me reconnaîtra jamais.", "charming")] }),
  pc("p-re-8", "valurn", "relations", 1, 0, "Je n’ai jamais pardonné quelqu’un uniquement parce qu’il était beau.", [true, false, false], [B("Uniquement ? C’est la seule raison valable. Les autres raisons sont des excuses pour les laids.", "teasing")]),
  pc("p-re-9", "none", "relations", 0, 0, "Je n’ai jamais présenté un amant à ma famille.", [false, false, false], [B("Ma famille, c’est lui. Et notre père. Je ne présente rien à notre père. Il trouve tout lui-même.", "cold")]),
  pc("p-re-10", "bellirith", "relations", 1, 1, "Je n’ai jamais donné un faux nom pour séduire quelqu’un.", [true, true, false], [V("« Comte d’Orvelle ». Il n’existe pas. Il a pourtant beaucoup de succès.", "charming")]),
  pc("p-re-11", "valurn", "relations", 2, 0, "Je n’ai jamais eu besoin d’être rassuré au milieu de la nuit.", [false, true, false], [V("Par quelqu’un qui m’a dit que le bruit venait du vent. Le bruit venait de moi.", "away")]),
  pc("p-re-12", "none", "relations", 1, 0, "Je n’ai jamais été invité deux fois au même rendez-vous à plusieurs.", [false, false, sv((ctx) => ctx.groupDateHistory.length >= 2)], [B("Deux fois. Tu deviens une habitude de cette cour, {player}.", "teasing")], { why: "Votre sauvegarde compte plusieurs rendez-vous à plusieurs.", save: true }),
  pc("p-re-13", "bellirith", "relations", 1, 0, "Je n’ai jamais été le préféré de quelqu’un sans l’avoir cherché.", [false, false, sv(BQ.favorite)], [B("Tu sais pourquoi tu bois, toi. Moi aussi.", "seductive")], { why: "Bellirith a fait de vous son préféré.", save: true, requires: (ctx) => BQ.favorite(ctx) }),
  pc("p-re-14", "valurn", "relations", 0, 1, "Je n’ai jamais confié un secret à quelqu’un que je connaissais depuis moins d’une semaine.", [false, false, sv(prefix("bv-q2-shared-v:"))], [V("Vous l’avez fait. À moi. Je l’ai gardé ; il est encore tiède.", "charming")], { why: "Dans la galerie, vous avez confié une petite chose à Valurn.", save: true }),
];

const MARCHES: BVPlayerClaim[] = [
  pc("p-ma-1", "valurn", "marches", 1, 0, "Je n’ai jamais acheté quelque chose uniquement pour qu’un autre ne l’ait pas.", [true, true, false], [V("C’est la seule bonne raison d’acheter quoi que ce soit.", "charming"), B("Il a acheté un cheval pour qu’un baron ne l’ait pas. Le cheval le déteste.", "teasing")]),
  pc("p-ma-2", "bellirith", "marches", 1, 1, "Je n’ai jamais marchandé en souriant pour faire baisser un prix.", [true, false, false], [B("Je souris, le prix tombe, le marchand aussi. Tout le monde y trouve son compte.", "seductive")]),
  pc("p-ma-3", "none", "marches", 0, 0, "Je n’ai jamais fait une affaire avec Valurn.", [false, false, sv(VQ.anyQuest)], [V("Il boit. Je l’ai toujours dit : on ne sort jamais de chez moi les mains vides. On en sort avec un verre.", "amused")], { why: "Vous avez traité avec Valurn pendant ses affaires.", save: true }),
  pc("p-ma-4", "valurn", "marches", 1, 0, "Je n’ai jamais signé un contrat sans le lire.", [true, false, false], [B("Lire, c’est pour ceux qui ont l’intention de respecter. Je signe les yeux fermés, c’est plus élégant.", "smirk")]),
  pc("p-ma-5", "valurn", "marches", 1, 0, "Je n’ai jamais bluffé à une table de négociation.", [false, true, sv(VQ.bluff)], [V("Tout le temps. Le bluff est une forme de politesse. Il épargne aux gens la vérité.", "charming")], { why: "Vous avez bluffé lors d’un marché de Valurn.", save: true, ifPlayerDrinks: [V("Il a bluffé avec moi. Et il a bien bluffé. Je bois à son mensonge.", "amused")] }),
  pc("p-ma-6", "none", "marches", 1, 0, "Je n’ai jamais protégé quelqu’un qui m’avait trahi.", [false, true, sv(VQ.odileShielded)], [V("Vous l’avez fait. Je l’ai vu. Ça m’a coûté de l’argent et une bonne opinion de moi-même.", "neutral")], { why: "Vous avez protégé Odile malgré sa faute.", save: true }),
  pc("p-ma-7", "none", "marches", 2, 0, "Je n’ai jamais livré un nom pour finir une affaire.", [true, true, sv(VQ.odileNamed)], [N("Valurn boit le premier. Bellirith suit, un peu plus tard, avec un léger haussement d’épaules.")], { why: "Vous avez livré Odile pendant l’affaire de Valurn.", save: true, ifPlayerDrinks: [V("Vous buvez aussi. Vous avez livré un nom. Nous sommes trois à bien dormir quand même.", "neutral")] }),
  pc("p-ma-8", "valurn", "marches", 0, 1, "Je n’ai jamais gardé une source secrète alors qu’on me la demandait.", [false, true, sv(VQ.sourceKept)], [V("Un marchand ne donne pas ses sources. Il donne des parfums.", "charming")], { why: "Vous avez tu votre source quand Valurn la demandait.", save: true }),
  pc("p-ma-9", "bellirith", "marches", 1, 0, "Je n’ai jamais vendu un objet en mentant sur son histoire.", [true, true, false], [B("Une simple fourchette. Je l’ai vendue comme la fourchette d’une impératrice. Elle l’était presque, elle avait servi.", "teasing")]),
  pc("p-ma-10", "valurn", "marches", 2, 0, "Je n’ai jamais fait passer un profit avant une personne.", [false, true, false], [V("Je n’en suis pas fier. Mais je n’en suis plus aussi fier qu’avant de ne pas être fier.", "away")]),
  pc("p-ma-11", "none", "marches", 0, 0, "Je n’ai jamais fait un détour par un marché juste pour sentir les épices.", [true, false, false], [B("Le safran. Le poivre long. Les cardamomes. J’y vais pour qu’on me regarde respirer.", "seductive")]),
  pc("p-ma-12", "valurn", "marches", 1, 0, "Je n’ai jamais accepté d’aide en jurant que c’était la dernière fois.", [false, true, sv(VQ.helpAccepted)], [V("Je jure toujours que c’est la dernière. Le serment fait partie de l’aide.", "charming")], { why: "Vous avez accepté l’aide de Valurn.", save: true }),
  pc("p-ma-13", "bellirith", "marches", 0, 1, "Je n’ai jamais tenu les comptes de quelqu’un d’autre.", [true, false, sv(BQ.q1)], [B("Les comptes de famille, {player}. Tu étais là. Tu as vu qui tenait la plume.", "smirk")], { why: "Au marché, vous vous êtes mêlé des comptes de famille.", save: true }),
  pc("p-ma-14", "none", "marches", 1, 1, "Je n’ai jamais gagné un pari que j’aurais dû perdre.", [true, true, false], [V("C’était un pari contre ma sœur. Elle me l’a fait payer de manière très créative.", "amused")]),
];

const CONFIANCE: BVPlayerClaim[] = [
  pc("p-co-1", "bellirith", "confiance", 2, 0, "Je n’ai jamais gardé un cadeau de quelqu’un que j’ai voulu détester.", [true, true, false], [N("Les deux verres se lèvent. Aucun ne dit de quel cadeau il s’agit."), B("Il était laid, en plus.", "cold")]),
  pc("p-co-2", "valurn", "confiance", 2, 0, "Je n’ai jamais dit « je reviens » sans le penser.", [false, false, false], [N("Personne ne boit. Valurn regarde son verre comme s’il avait fait quelque chose de mal en restant plein."), V("Je le pensais. Toujours. C’est bien ça le problème.", "away")]),
  pc("p-co-3", "none", "confiance", 1, 0, "Je n’ai jamais caché quelque chose à quelqu’un pour le protéger.", [true, true, ASK_PLAYER()], [B("Pour le protéger ? Pour se protéger soi, souvent.", "cold")]),
  pc("p-co-4", "bellirith", "confiance", 1, 0, "Je n’ai jamais tenu tête à quelqu’un qui avait l’habitude qu’on lui cède.", [false, false, sv(BQ.stood)], [B("Tu l’as fait. À moi. Je m’en souviens comme d’un parfum.", "seductive")], { why: "Vous avez déjà tenu tête à Bellirith.", save: true, ifPlayerDrinks: [V("Il lui a tenu tête. Et il est encore là. Je l’engage comme garde du corps.", "amused")] }),
  pc("p-co-5", "bellirith", "confiance", 1, 0, "Je n’ai jamais cédé à un caprice en sachant que c’en était un.", [true, false, sv(BQ.gave)], [B("Les caprices sont faits pour qu’on y cède. Sinon ce sont des principes.", "smirk")], { why: "Vous avez déjà cédé à Bellirith.", save: true }),
  pc("p-co-6", "valurn", "confiance", 2, 0, "Je n’ai jamais regretté une décision prise à la place de quelqu’un.", [true, true, false], [N("Les deux verres se lèvent. Ils se regardent par-dessus le cristal et ne se disent rien.")], { phases: PR }),
  pc("p-co-7", "none", "confiance", 1, 0, "Je n’ai jamais dormi d’un sommeil vraiment tranquille dans ce palais.", [false, true, false], [V("Le palais respire, la nuit. Je l’entends.", "away")]),
  pc("p-co-8", "bellirith", "confiance", 1, 1, "Je n’ai jamais demandé pardon en premier.", [false, true, false], [B("Lui oui. Il demande pardon en premier pour avoir le dernier mot.", "cold")]),
  pc("p-co-9", "valurn", "confiance", 1, 0, "Je n’ai jamais menti à quelqu’un que j’admirais.", [true, true, false], [V("Surtout à eux. Les autres ne méritent pas l’effort.", "charming")]),
  pc("p-co-10", "none", "confiance", 0, 0, "Je n’ai jamais tenu une promesse faite sur un coup de tête.", [true, true, false], [B("J’ai promis d’apprendre la harpe, un soir. J’en joue, maintenant. Très mal, mais j’en joue.", "teasing")]),
  pc("p-co-11", "valurn", "confiance", 2, 0, "Je n’ai jamais fait confiance à quelqu’un qui m’avait déjà menti.", [true, false, false], [B("Une fois. Il le sait.", "cold"), V("Je le sais.", "away")]),
  pc("p-co-12", "none", "confiance", 1, -1, "Je n’ai jamais eu peur de ce que je pourrais devenir.", [true, true, false], [N("Deux verres. Lents, cette fois. Le feu craque, et personne n’en profite pour plaisanter.")], { phases: PR }),
  pc("p-co-13", "valurn", "confiance", 1, 0, "Je n’ai jamais aidé quelqu’un sans qu’il le sache.", [false, true, false], [V("C’est ma forme préférée. On n’a pas besoin de supporter la gratitude.", "charming")]),
  pc("p-co-14", "bellirith", "confiance", 0, 0, "Je n’ai jamais goûté au flacon que quelqu’un m’offrait au marché.", [false, false, sv(any("bv-q1-vial:bellirith", "bv-q1-vial:valurn"))], [B("Tu y as goûté. Il était bon, avoue.", "teasing")], { why: "Au marché, vous avez goûté au flacon tendu.", save: true }),
];

const SURPRISE: BVPlayerClaim[] = [
  pc("p-su-1", "valurn", "surprise", 0, 1, "Je n’ai jamais pleuré à l’opéra.", [false, true, false], [V("Au deuxième acte de « La Fille des Saules ». Tout le monde pleure. Moi, j’ai seulement eu une poussière très douloureuse.", "away"), B("Il pleure à chaque fois. Je vais avec lui pour le regarder.", "teasing")]),
  pc("p-su-2", "bellirith", "surprise", 0, 0, "Je n’ai jamais eu peur d’une araignée.", [true, false, false], [B("Une seule. Elle était énorme, et elle me regardait comme si j’étais en retard.", "thoughtful"), V("Je l’ai sortie par la fenêtre. Elle me doit encore un service.", "amused")]),
  pc("p-su-3", "none", "surprise", 0, 1, "Je n’ai jamais cuisiné un repas entier.", [false, true, false], [V("Un ragoût. Il était immangeable et tout le monde l’a terminé. C’est le pouvoir de l’intimidation.", "charming")]),
  pc("p-su-4", "valurn", "surprise", 0, 0, "Je n’ai jamais appris un poème par cœur pour impressionner quelqu’un.", [true, true, false], [B("Douze vers. J’ai récité les six premiers. Il s’est endormi au septième.", "teasing")]),
  pc("p-su-5", "bellirith", "surprise", 0, 0, "Je n’ai jamais dormi dans une écurie.", [true, true, false], [B("Ensemble, en plus. Il pleuvait. Les chevaux ronflaient. Je ne lui ai jamais dit que c’était lui.", "teasing")]),
  pc("p-su-6", "none", "surprise", 0, 1, "Je n’ai jamais su nager.", [true, false, false], [V("Ma sœur ne sait pas nager. Elle flotte par orgueil.", "amused"), B("Je flotte par conviction.", "smirk")]),
  pc("p-su-7", "valurn", "surprise", 0, 0, "Je n’ai jamais gardé une lettre pendant des années sans l’ouvrir.", [false, true, false], [V("Elle est encore dans un tiroir. Je ne veux pas savoir ce qu’elle dit ; je veux savoir qu’elle existe.", "away")]),
  pc("p-su-8", "bellirith", "surprise", 0, 1, "Je n’ai jamais appris à jouer d’un instrument.", [true, true, false], [B("La harpe. Mal. Il joue du piano, mieux, et ça m’énerve encore.", "smirk")]),
  pc("p-su-9", "none", "surprise", 0, 0, "Je n’ai jamais grimpé sur un toit pour regarder les étoiles.", [true, true, false], [N("Deux verres en même temps, et deux sourires que vous n’auriez pas cru possibles ce soir.")]),
  pc("p-su-10", "valurn", "surprise", 0, 1, "Je n’ai jamais eu de surnom d’enfance que je déteste.", [true, true, false], [B("Je ne le dirai pas.", "smirk"), V("Elle ne le dira pas parce qu’elle sait que je dirais le sien.", "amused")]),
  pc("p-su-11", "bellirith", "surprise", 1, 0, "Je n’ai jamais fait tomber une couronne.", [false, true, false], [V("La couronne d’un duc. Elle a roulé sous l’estrade, et j’ai mis très longtemps à la retrouver.", "charming")]),
  pc("p-su-12", "none", "surprise", 0, 0, "Je n’ai jamais été surpris par un orage loin de tout abri.", [true, true, false], [B("J’aime ça. On sent tout. On ne choisit rien.", "thoughtful")]),
  pc("p-su-13", "valurn", "surprise", 0, 1, "Je n’ai jamais eu de plante à moi.", [false, true, false], [V("Une fougère. Elle s’appelle Madame. Elle a survécu à trois déménagements et à une tentative d’empoisonnement de ma sœur.", "charming"), B("Elle me regardait de travers.", "teasing")]),
  pc("p-su-14", "bellirith", "surprise", 0, 0, "Je n’ai jamais écrit dans un journal intime.", [true, false, false], [B("Il fait trois volumes. Tu y es déjà, {player}. Page de gauche.", "seductive")]),
];

const LIBRE: BVPlayerClaim[] = [
  pc("p-li-1", "none", "libre", 0, 0, "Je n’ai jamais eu envie de partir sans rien dire à personne.", [true, true, false], [B("Envie, souvent. Fait, une seule fois. Ce n’était pas moi qui partais.", "cold")], { phases: PR }),
  pc("p-li-2", "bellirith", "libre", 1, 1, "Je n’ai jamais choisi une robe pour qu’on me regarde partir.", [true, false, false], [B("Le dos. Tout est dans le dos. L’entrée, c’est pour les amateurs.", "seductive")]),
  pc("p-li-3", "valurn", "libre", 1, 0, "Je n’ai jamais regardé quelqu’un dormir.", [false, true, false], [V("Une fois. Il fallait bien que quelqu’un veille. Elle a ronflé. Je ne le dirai jamais.", "away"), B("Tu viens de le dire.", "smirk")]),
  pc("p-li-4", "none", "libre", 0, 1, "Je n’ai jamais bu à cette table avant ce soir.", [true, true, false], [V("Nous y avons bu, il y a très longtemps. La table était plus haute. Ou nous étions plus petits.", "away")]),
  pc("p-li-5", "bellirith", "libre", 1, 0, "Je n’ai jamais fait une promesse en l’air pour finir une conversation.", [true, true, false], [B("Une conversation qui ne finit pas est une agression.", "teasing")]),
  pc("p-li-6", "valurn", "libre", 1, 1, "Je n’ai jamais arrangé une soirée pour avoir l’air d’y arriver par hasard.", [true, true, false], [V("Ce soir, par exemple. Nous sommes tous les deux arrivés par hasard, exactement au même moment.", "amused")]),
  pc("p-li-7", "none", "libre", 0, 0, "Je n’ai jamais accepté une invitation à boire avec deux démons.", [false, false, true], [B("Et le voilà qui boit à sa propre phrase. Je l’adore.", "seductive")], { why: "Vous êtes assis à cette table." }),
  pc("p-li-8", "bellirith", "libre", 0, 1, "Je n’ai jamais été vexé qu’on ne remarque pas mon parfum.", [true, false, false], [B("Ambre, poivre rose, et une note dont je garde le nom. Si tu ne l’as pas remarqué, je bois pour toi.", "seductive")]),
  pc("p-li-9", "valurn", "libre", 1, 0, "Je n’ai jamais joué à ce jeu en trichant.", [true, true, false], [N("Ils lèvent leur verre sans honte et sans hésiter."), V("Pas ce soir. Ce soir je n’ai pas besoin de tricher, je perds tout seul.", "amused")]),
  pc("p-li-10", "none", "libre", 0, -1, "Je n’ai jamais eu envie que la soirée s’arrête.", [false, false, false], [N("Personne ne boit. Bellirith remplit les verres, et le geste suffit comme réponse.")], { phases: PR }),
  pc("p-li-11", "bellirith", "libre", 1, 0, "Je n’ai jamais trouvé quelqu’un plus beau en colère.", [true, true, false], [B("Lui. Il devient élégant quand il est furieux. Il ne le sait pas, et j’y veille.", "teasing")]),
  pc("p-li-12", "valurn", "libre", 0, 0, "Je n’ai jamais fait semblant d’être ivre pour quitter une table.", [false, true, false], [V("Très utile. Et très reposant. Ce soir, je ne fais pas semblant.", "amused")]),
  pc("p-li-13", "none", "libre", 1, 0, "Je n’ai jamais choisi ma place à table pour être près de quelqu’un.", [true, true, false], [B("Ce soir ? Évidemment. Tu crois que je me suis assise là pour le feu ?", "seductive")]),
  pc("p-li-14", "bellirith", "libre", 0, 1, "Je n’ai jamais tenu un pari jusqu’au bout pour ne pas perdre la face.", [true, false, false], [B("Une nuit entière sur le rebord d’une fontaine. En robe de bal. En hiver. J’ai gagné.", "smirk")]),
];

function ASK_PLAYER(): (ctx: BVTruthCtx, state: BVNeverState) => boolean {
  // Le joueur prononce la phrase : il affirme de lui-même ne pas l’avoir fait.
  return () => false;
}

export const BV_PLAYER_CLAIMS: BVPlayerClaim[] = [...HUMOUR, ...RELATIONS, ...MARCHES, ...CONFIANCE, ...SURPRISE, ...LIBRE];

/* Retombée : le joueur peut aider la table à respirer. */
export const BV_PLAYER_FALLOUT: BVPlayerClaim[] = [
  pc("pf-1", "none", "libre", 0, -1, "Je n’ai jamais bu un verre d’eau au milieu d’un jeu à boire.", [false, false, false], [N("Personne ne boit. Bellirith tend le bras vers la carafe et la pose au milieu, sans un mot.")], { phases: R }),
  pc("pf-2", "valurn", "humour", 0, 0, "Je n’ai jamais vu un papillon de nuit gagner une partie.", [false, false, false], [V("Il gagnera celle-ci. Il est le seul à n’avoir rien avoué.", "amused")], { phases: R }),
  pc("pf-3", "bellirith", "humour", 0, 0, "Je n’ai jamais ri au milieu d’une dispute.", [true, true, false], [B("Ce soir, presque. Garde ça pour toi.", "thoughtful")], { phases: R }),
  pc("pf-4", "none", "confiance", 1, -1, "Je n’ai jamais eu envie de recommencer une soirée depuis le début.", [false, false, false], [V("Pas celle-ci. Celle-ci, je veux la finir.", "away")], { phases: R }),
  pc("pf-5", "valurn", "libre", 0, 0, "Je n’ai jamais oublié de manger un jour de fête.", [false, true, false], [V("Aujourd’hui. Je bois, et je vais chercher les gâteaux.", "amused")], { phases: R }),
  pc("pf-6", "bellirith", "libre", 0, 0, "Je n’ai jamais trouvé le feu de cette pièce trop chaud.", [false, false, false], [B("Jamais trop chaud. Jamais assez. Ce feu me ressemble.", "seductive")], { phases: R }),
  pc("pf-7", "none", "surprise", 0, -1, "Je n’ai jamais regardé l’aube depuis cette fenêtre.", [true, true, false], [N("Deux verres. Lents. Vous ne leur demandez pas avec qui.")], { phases: R }),
  pc("pf-8", "none", "relations", 0, 0, "Je n’ai jamais été content d’être assis à une table précise.", [false, false, ASK_PLAYER()], [B("Tu n’as rien bu. Je décide que c’est un mensonge très poli.", "teasing")], { phases: R }),
];

/* La parole revient au joueur : sa vie à lui, prise dans la sauvegarde. */
export const BV_SUBJECT_CLAIMS: BVPlayerClaim[] = [
  pc("subj-1", "none", "libre", 1, 0, "Je n’ai jamais été aimé par quelqu’un de cette cour.", [false, false, sv((ctx) => Object.values(ctx.relationships).some((rel) => (rel?.stage || 0) >= 4))], [B("À toi, {player}. Bois ou ne bois pas. Nous regardons.", "seductive")], { why: "Votre sauvegarde montre au moins une relation très avancée.", save: true, phases: ALL }),
  pc("subj-2", "none", "libre", 1, 0, "Je n’ai jamais eu de rendez-vous qui se soit bien passé.", [false, false, sv(datedAnyone)], [V("Et la soirée revient à vous. Elle n’aurait pas dû vous quitter.", "charming")], { why: "Vous avez eu au moins un rendez-vous.", save: true, phases: ALL }),
  pc("subj-3", "none", "libre", 1, 0, "Je n’ai jamais partagé un rendez-vous à plusieurs.", [false, false, sv(groupDated)], [B("À plusieurs. Tu as de l’entraînement, alors.", "teasing")], { why: "Vous avez déjà connu un rendez-vous à plusieurs.", save: true, phases: ALL }),
  pc("subj-4", "none", "libre", 1, 0, "Je n’ai jamais tenu tête à quelqu’un qui me plaisait.", [false, false, sv(BQ.stood)], [B("Moi, entre autres. Bois, {player}. C’est toi qu’on regarde, maintenant.", "seductive")], { why: "Vous avez tenu tête à Bellirith.", save: true, phases: ALL }),
  pc("subj-5", "none", "libre", 1, 0, "Je n’ai jamais mené une affaire de bout en bout.", [false, false, sv(VQ.outcome)], [V("Avec moi. Jusqu’au bout. Vous avez le droit de vous en vanter ce soir.", "charming")], { why: "Vous avez mené les affaires de Valurn jusqu’à leur issue.", save: true, phases: ALL }),
  pc("subj-6", "none", "libre", 0, 0, "Je n’ai jamais passé une soirée dont je me souviendrai demain.", [false, false, true], [B("Tu bois. Bien. Moi aussi, je me souviendrai.", "thoughtful"), V("Et moi, j’en garderai une version plus flatteuse.", "amused")], { why: "Vous êtes ici ce soir.", phases: ALL }),
];
