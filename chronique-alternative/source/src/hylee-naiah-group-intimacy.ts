import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { GroupIntimacyRoute } from "./group-dates";
import type { IntimacyGame, IntimacyGameOption } from "./intimacy-games";
import { A, H, N, P, buildHNRoutes, type HNMotherOutcome, type HNRoute } from "./hylee-naiah-intimacy-shared";
import { HYLEE_NAIAH_PLACE_SEEDS } from "./hylee-naiah-intimacy-place";
import { HYLEE_NAIAH_ONE_SEEDS } from "./hylee-naiah-intimacy-one";
import { HYLEE_NAIAH_HOME_SEEDS } from "./hylee-naiah-intimacy-home";

/**
 * Hylee / Naïah / {player} — continuations intimes des trois rendez-vous autonomes.
 * « Un endroit à moi » (lac), « Une seule chose » (clairière), « Ce soir, c’est toi » (logis).
 * Ton : jeu, défi, provocation, alliances mouvantes. Aucune romance de trio.
 */
export const HYLEE_NAIAH_INTIMACY_CONTEXT_IDS = [
  "group-date-hylee-naiah-place",
  "group-date-hylee-naiah-one",
  "group-date-hylee-naiah-home",
] as const;
export type HyleeNaiahIntimacyContext = (typeof HYLEE_NAIAH_INTIMACY_CONTEXT_IDS)[number];

export const HYLEE_NAIAH_INTIMACY_MIN_DESIRE = 25;

export const HYLEE_NAIAH_MANUAL_ROUTES: Record<HyleeNaiahIntimacyContext, Record<PlayerSex, HNRoute[]>> = {
  "group-date-hylee-naiah-place": buildHNRoutes("group-date-hylee-naiah-place", HYLEE_NAIAH_PLACE_SEEDS),
  "group-date-hylee-naiah-one": buildHNRoutes("group-date-hylee-naiah-one", HYLEE_NAIAH_ONE_SEEDS),
  "group-date-hylee-naiah-home": buildHNRoutes("group-date-hylee-naiah-home", HYLEE_NAIAH_HOME_SEEDS),
};

export function isHyleeNaiahManualContext(id: string): boolean {
  return (HYLEE_NAIAH_INTIMACY_CONTEXT_IDS as readonly string[]).includes(id);
}

const O = (id: string, label: string, score: 0 | 1 | 2, ...lines: DialogueLine[]): IntimacyGameOption => ({ id, label, score, lines });

export const HYLEE_NAIAH_INTIMACY_GAMES: Record<HyleeNaiahIntimacyContext, IntimacyGame> = {
  "group-date-hylee-naiah-place": {
    title: "La dernière manche du lac",
    instruction: "La piste d’Hylee fond, mais la partie n’est pas finie. Chaque choix change la manche suivante : provoquez, trichez, retournez les ombres.",
    beats: [
      {
        prompt: "Une ombre file sous la piste et dévie votre disque.",
        detail: "Naïah regarde le ciel avec une innocence très étudiée. Hylee a vu.",
        options: [
          O("hn-lake-shadow-call", "Dénoncer la triche en riant et réclamer un gage", 2, P("Tricheuse. Gage."), A("Quel gage ? Je n’ai rien fait. Mon ombre agit seule."), H("Alors ton ombre retire ta manche.", "teasing")),
          O("hn-lake-shadow-watch", "Faire semblant de rien pour voir jusqu’où elle ose", 1, N("Naïah ose. Le disque suivant d’Hylee fait un détour complet par la berge. Hylee se tourne lentement vers elle."), H("Je vais te noyer.", "angry")),
          O("hn-lake-shadow-jump", "Relancer aussitôt sans commenter", 0, N("Votre disque file droit. Naïah, privée de spectateurs, range son ombre en boudant."), A("Tu n’as aucun sens du spectacle.")),
        ],
      },
      {
        prompt: "Hylee perd sa manche d’un pouce.",
        detail: "Elle déteste perdre sur sa propre piste. Encore plus devant Naïah.",
        options: [
          O("hn-lake-loss-dare", "La provoquer : revanche, mais à vos conditions", 2, P("Revanche. Et cette fois, le perdant retire ce que les deux autres choisissent."), H("Tu viens de signer ta défaite.", "determined"), A("J’adore quand vous vous battez pour moi.")),
          O("hn-lake-loss-gift", "Lui offrir votre disque pour la manche suivante", 1, H("La charité, maintenant ? Donne.", "teasing"), N("Elle le prend, le soupèse et vous le rend avec un sourire carnassier.")),
          O("hn-lake-loss-score", "Annoncer le score bien fort", 0, N("Hylee vous lance un regard noir et part bouder trois pas plus loin. Naïah applaudit."), A("Trois pas. Elle s’améliore.")),
        ],
      },
      {
        prompt: "Un ruban d’ombre s’enroule à la cheville d’Hylee.",
        detail: "Naïah tire doucement. Hylee vous cherche du regard.",
        options: [
          O("hn-lake-ribbon-freeze", "Faire signe à Hylee de geler la racine pendant que vous attrapez le ruban", 2, N("Le givre fige la jonction ; le ruban vous tombe dans la main et se tourne vers sa créatrice."), A("Non. Non, pas ça.", "laugh"), H("Si. Exactement ça.", "teasing")),
          O("hn-lake-ribbon-pull", "Tirer vous-même sur le ruban", 1, N("Le ruban résiste, s’étire, et Naïah se retrouve à jouer à la corde contre vous en riant."), A("Je gagne toujours à la corde.")),
          O("hn-lake-ribbon-wait", "Laisser Hylee s’en débrouiller", 0, N("Hylee se débrouille : elle tombe assise dans l’eau peu profonde et éclabousse tout le monde."), H("Merci pour ton aide inestimable.", "angry")),
        ],
      },
      {
        prompt: "La piste fond en filets jusqu’au bassin.",
        detail: "Il reste un disque, trois joueurs et beaucoup de comptes à régler.",
        options: [
          O("hn-lake-last-pledge", "Proposer une dernière manche : le perdant paie un gage choisi par les deux autres", 2, A("Les deux autres ? Donc une alliance. J’en suis."), H("Moi aussi. Contre toi.", "teasing"), N("Personne ne sait plus contre qui il joue. Personne ne veut arrêter.")),
          O("hn-lake-last-splash", "Pousser tout le monde dans l’eau", 1, N("Hylee tombe, Naïah tombe, et vous suivez, tirés par deux mains vengeresses."), H("Tu vas le regretter.", "teasing")),
          O("hn-lake-last-tidy", "Ramasser les disques", 0, N("Vous ramassez deux disques. Le troisième est dans la main de Naïah, qui refuse de le rendre."), A("Viens le chercher.")),
        ],
      },
    ],
    results: {
      attuned: [N("La dernière manche n’a plus de règles ; il ne reste que trois joueurs trempés de soleil, et un gage que personne n’a encore payé."), H("Le gage n’est pas terminé.", "determined"), A("Il ne fait que commencer.")],
      searching: [N("La partie tourne à la bataille de bord de lac, moitié jeu, moitié vengeance. Les rires ne retombent pas."), A("Je déclare un match nul, puis une revanche.")],
      discordant: [N("La manche se transforme en bataille d’eau franche. Vous finissez trempés tous les trois sur la couverture, essoufflés, et personne n’a envie de rentrer."), H("Bon. On a perdu la piste. Il reste le saule.", "teasing")],
    },
  },
  "group-date-hylee-naiah-one": {
    title: "Le fil détourné",
    instruction: "Naïah a promis une seule chose. Elle va tricher sur la définition. Tirez, détournez, surenchérissez : le fil appartient à qui le tient.",
    beats: [
      {
        prompt: "Un fil d’ombre s’enroule à votre poignet et Naïah tire la première.",
        detail: "Hylee a le même fil au poignet et le regarde avec méfiance.",
        options: [
          O("hn-one-pull-back", "Tirer en retour, d’un coup sec", 2, N("Naïah vacille vers vous, surprise. Hylee éclate de rire."), A("Personne ne tire en retour ! Ce n’est pas dans le dessin !"), H("Un fil a deux bouts.", "teasing")),
          O("hn-one-pull-follow", "Vous laisser tirer jusqu’à elle", 1, N("Vous arrivez contre Naïah, qui vous embrasse la joue comme une remise de médaille."), A("Docile. C’est presque décevant.")),
          O("hn-one-pull-cut", "Défaire le nœud de votre poignet", 0, N("Le fil se défait et file rejoindre celui d’Hylee, qui se retrouve doublement attachée."), H("Merci beaucoup.", "angry")),
        ],
      },
      {
        prompt: "Naïah lance une fausse piste : trois doubles d’elle dans les fougères.",
        detail: "Hylee vous fait un clin d’œil. Elle sait déjà laquelle est la vraie. Peut-être.",
        options: [
          O("hn-one-decoy-wink", "Suivre le clin d’œil d’Hylee", 2, N("Hylee vous mène droit derrière le troisième arbre. Naïah y est, accroupie, les doigts en l’air."), A("Elle m’a trahie avec un clin d’œil. Un seul."), H("Il en fallait un.", "teasing")),
          O("hn-one-decoy-false", "Suivre exprès la mauvaise piste", 1, N("Le double se dissout dans vos bras. Naïah, ravie, se montre pour se moquer de vous, et Hylee l’attrape au vol.")),
          O("hn-one-decoy-none", "Ne suivre personne et vous asseoir", 0, N("Naïah, vexée qu’on ne la cherche pas, finit par revenir s’asseoir à côté de vous."), A("Tu as gâché un très beau cache-cache.")),
        ],
      },
      {
        prompt: "Une ombre de Naïah rampe vers la cheville d’Hylee.",
        detail: "Hylee ne l’a pas vue. Vous si.",
        options: [
          O("hn-one-turn-help", "Aider Hylee à retourner l’ombre contre sa créatrice", 2, N("Hylee gèle, vous tirez ; l’ombre change de maîtresse et file chatouiller les côtes de Naïah."), A("Traîtresse ! Ombre ingrate !", "laugh")),
          O("hn-one-turn-warn", "Avertir Hylee d’un mot", 1, H("Je l’avais vue.", "teasing"), N("Elle ne l’avait pas vue. Elle saute quand même par-dessus avec beaucoup d’élégance.")),
          O("hn-one-turn-watch", "Regarder ce que ça donne", 0, N("Hylee se retrouve suspendue par une cheville, la tête en bas, en train de jurer."), A("Ça donne ça.")),
        ],
      },
      {
        prompt: "Naïah annonce une règle rétroactive : tout ce qui s’est passé compte double pour elle.",
        detail: "Hylee croise les bras. Elle attend votre réponse.",
        options: [
          O("hn-one-rule-counter", "Surenchérir avec votre propre règle rétroactive", 2, P("Alors j’en ajoute une : chaque ombre utilisée compte pour celle qui l’a reçue."), A("C’est une règle écrite contre moi !"), H("Adoptée.", "teasing")),
          O("hn-one-rule-protest", "Contester la règle avec véhémence", 1, A("Contestation enregistrée. Rejetée."), H("Tu ne peux pas être juge et partie.", "teasing"), A("Je peux tout être.")),
          O("hn-one-rule-accept", "Accepter sans discuter", 0, N("Naïah, privée de dispute, invente aussitôt une troisième règle pour compenser."), A("Il faut bien que quelqu’un s’amuse.")),
        ],
      },
    ],
    results: {
      attuned: [N("Le fil n’appartient plus à personne. Naïah le regarde passer de main en main avec un ravissement de joueuse qui vient de trouver plus fort qu’elle."), A("Une seule chose. J’ai dit une seule chose."), H("Et tu as menti.", "teasing")],
      searching: [N("Les règles changent plus vite qu’on ne peut les écrire. Hylee et Naïah se disputent sur leur validité, et vous écoutez en souriant, le fil autour du poignet.")],
      discordant: [N("Le jeu s’emmêle en une bataille de fils et de feuilles mortes. Vous finissez tous les trois dans l’herbe, couverts de brindilles, à rire sans pouvoir vous arrêter."), A("Bon. On recommence, mais autrement.")],
    },
  },
  "group-date-hylee-naiah-home": {
    title: "Le terrain du joueur",
    instruction: "Chez vous, c’est à vous d’ouvrir. Hylee profitera de chaque hésitation, Naïah cherchera votre stratégie. Le décor est à vous : servez-vous-en.",
    beats: [
      {
        prompt: "La table est débarrassée. Elles attendent toutes les deux que vous ouvriez.",
        detail: "Hylee au bout du canapé, Naïah dans le fauteuil comme sur un trône.",
        options: [
          O("hn-home-open-hylee", "Provoquer Hylee d’abord : elle répond toujours", 2, N("Vous l’attirez au milieu du tapis. Elle répond avant d’avoir fini d’être surprise."), H("Mauvaise idée. Je réponds toujours.", "determined"), A("Intéressant. Pourquoi elle ?")),
          O("hn-home-open-naiah", "Provoquer Naïah d’abord", 1, A("Moi ? Tu commences par l’imprévisible ? Audacieux."), N("Hylee profite de l’instant pour vous voler la place que vous visiez sur le canapé.")),
          O("hn-home-open-wait", "Attendre de voir qui craque", 0, N("Personne ne craque. Naïah finit par vous lancer un coussin."), A("Tu as perdu ton tour.")),
        ],
      },
      {
        prompt: "Il faut choisir le terrain.",
        detail: "Canapé, tapis, fauteuil : chacun a ses avantages, et Naïah les a déjà tous évalués.",
        options: [
          O("hn-home-ground-sofa", "Le canapé, où tout le monde tient mal", 2, N("Trois corps, deux places et demie. Les coudes se cognent, les genoux s’emmêlent, et personne ne veut céder un pouce."), H("C’est ma place.", "teasing"), A("C’était.")),
          O("hn-home-ground-rug", "Le tapis devant la lampe", 1, N("Hylee s’allonge, Naïah s’assied sur ses jambes, et vous découvrez que votre tapis glisse sur le parquet."), A("Ce tapis est un traître. Je l’adore.")),
          O("hn-home-ground-bed", "Directement la chambre", 0, A("Tu as sauté trois cases. Je proteste pour la forme."), H("Elle proteste. Elle vient quand même.", "teasing")),
        ],
      },
      {
        prompt: "Naïah claque des doigts : la lampe s’éteint.",
        detail: "Dans le noir, quelque chose de frais rampe vers Hylee.",
        options: [
          O("hn-home-lamp-relight", "Rallumer d’un geste et la surprendre en flagrant délit", 2, P("Chez moi, la lumière, c’est moi."), A("Règle domestique autoritaire !", "angry"), N("Hylee l’attrape par la cheville avant qu’elle se cache.")),
          O("hn-home-lamp-dark", "Profiter du noir pour changer de place", 1, N("Quand la lampe se rallume, vous êtes entre elles deux, et aucune ne sait comment."), H("Comment tu as fait ça ?", "surprised")),
          O("hn-home-lamp-grope", "Chercher la lampe à tâtons", 0, N("Vous trouvez le pied de la table avec votre tibia, puis la lampe. Naïah rit de bon cœur."), A("Ton propre logis. Bravo.")),
        ],
      },
      {
        prompt: "Naïah se penche vers vous : « Cap ou pas cap ? »",
        detail: "Hylee hausse un sourcil. Elle attend de voir si vous allez surenchérir.",
        options: [
          O("hn-home-dare-raise", "Cap, et surenchérir aussitôt", 2, P("Cap. Et toi, cap de ne pas utiliser une seule ombre jusqu’à minuit ?"), A("C’est cruel. C’est inhumain. Cap.", "laugh"), H("Elle va tenir quatre minutes.", "teasing")),
          O("hn-home-dare-yes", "Cap, simplement", 1, A("Bien. Le défi viendra quand tu ne t’y attendras pas."), H("Tu viens de lui signer un chèque en blanc.", "teasing")),
          O("hn-home-dare-no", "Pas cap, juste pour voir sa tête", 0, N("Naïah ouvre la bouche, la referme, puis se tourne vers Hylee."), A("Toi, alors. Tu es cap ?"), H("Toujours.", "determined")),
        ],
      },
    ],
    results: {
      attuned: [N("Votre logis est devenu un terrain de jeu dont vous connaissez chaque latte. Hylee vous regarde comme une adversaire à sa mesure ; Naïah, comme une énigme qu’elle a très envie de résoudre."), A("Alors ? Ta partie. Tes règles."), H("Ou ton hésitation. Je prends les deux.", "teasing")],
      searching: [N("Le jeu hésite encore entre la soirée d’amis et autre chose. Hylee tranche d’un regard, Naïah d’un sourire.")],
      discordant: [N("La soirée dégénère en bataille de coussins dans toute la pièce. Quand elle s’achève, vous êtes tous les trois à bout de souffle sur le canapé, et personne ne fait mine de partir."), H("Bon. Tu as perdu. On reste quand même.", "teasing")],
    },
  },
};

/* Traces très légères du destin de la mère d’Hylee : elles colorent un instant,
 * sans transformer la scène en drame ni la suspendre. */
export const HYLEE_NAIAH_MOTHER_TRACES: Record<HyleeNaiahIntimacyContext, Record<HNMotherOutcome, DialogueLine[]>> = {
  "group-date-hylee-naiah-place": {
    killed: [N("Au milieu des rires, Hylee s’arrête une seconde, le regard sur l’eau. Naïah ne fait pas de plaisanterie. Elle attend, simplement, une main posée sur la couverture près de la sienne."), H("Ne t’arrête pas pour moi. Je suis là.", "soft"), A("Je sais. Je vérifiais que tu le savais aussi.", "thinking"), H("Bien. Où en étions-nous ? Ah oui. Je gagnais.", "teasing")],
    "memory-erased": [N("Naïah lève un doigt vers la surface du bassin, prête à y dessiner un reflet plus flatteur. Hylee lui attrape le poignet."), H("Pas le lac. Laisse-le comme il est.", "determined"), A("Je laisse. Je me rattraperai sur vous deux.", "smirk")],
    vegetative: [N("Une ombre de Naïah s’approche de votre poignet, puis recule d’elle-même, par réflexe. Hylee la rattrape et la repose là où elle allait."), H("Là. Elle reste là. Continue.", "soft"), A("… Bien. Où en étions-nous ? Ah oui. Je gagnais.", "smirk")],
  },
  "group-date-hylee-naiah-one": {
    killed: [N("Le fil noir glisse entre les doigts de Naïah. Hylee le regarde un instant de trop. Naïah le laisse tomber dans l’herbe et en prend un autre, sans commentaire."), H("Tu n’étais pas obligée.", "soft"), A("Je préfère le rouge. Il te met en colère plus vite.", "smirk")],
    "memory-erased": [N("Naïah s’apprête à changer la couleur des feuilles au-dessus de vous. Hylee secoue la tête, une fois."), H("Les arbres, tu les laisses. Le reste, fais ce que tu veux.", "teasing"), A("Le reste. Note bien qu’elle a dit le reste.", "smirk")],
    vegetative: [N("Naïah tend la main vers vous avec une ombre, s’arrête à mi-chemin, et termine le geste avec sa vraie main. Hylee le remarque et sourit en coin."), H("Les deux marchent. Tu peux utiliser les deux.", "soft"), A("Je sais. Je choisissais la plus efficace.", "smirk")],
  },
  "group-date-hylee-naiah-home": {
    killed: [N("Hylee s’immobilise devant la lampe, une seconde, comme quelqu’un qui se souvient d’une autre pièce. Naïah vient s’asseoir sur l’accoudoir à côté d’elle, sans rien dire, jusqu’à ce qu’Hylee lui pousse l’épaule."), H("Tu prends toute la place.", "teasing"), A("C’est mon talent principal.", "smirk")],
    "memory-erased": [N("Naïah regarde le mur nu au-dessus du canapé avec l’air de quelqu’un qui va y accrocher une illusion de tableau. Hylee lui pince la hanche."), H("C’est chez {player}. Tu ne redécores pas.", "determined"), A("Même un tout petit paysage ?", "smirk"), H("Même.", "teasing")],
    vegetative: [N("Dans le passage étroit entre la table et le canapé, Naïah garde un instant ses ombres serrées contre elle. Hylee lui prend la main et la pose sur votre épaule."), H("Ici, pas besoin de prévenir. C’est chez {player}, et {player} n’a pas reculé.", "soft"), A("Alors je ne préviendrai plus jamais.", "smirk")],
  },
};

/** Séquences de la route pour le mode choisi, avec la trace légère de la mère si l’issue est connue. */
export function hyleeNaiahRouteChapters(route: GroupIntimacyRoute, contextId: string, mode: IntimacyMode, outcome?: HNMotherOutcome): DialogueLine[][] {
  const chapters = route.chapters[mode];
  const hnRoute = route as Partial<HNRoute>;
  if (!outcome || !isHyleeNaiahManualContext(contextId) || !hnRoute.motherTraceChapter) return chapters;
  const trace = HYLEE_NAIAH_MOTHER_TRACES[contextId as HyleeNaiahIntimacyContext][outcome];
  const at = hnRoute.motherTraceChapter[mode];
  return chapters.map((chapter, index) => index === at ? [...chapter, ...trace] : chapter);
}

const BANNED_ANATOMY = /\b(?:chatte|bite|pénis|penis|vagin|anus|testicules?|clitoris|vulve|verge|phallus|couilles?)\b/iu;
const STATED_ORIENTATION = /asexu|aromanti|sans désir sexuel|n[’']éprouve (?:aucun|pas de) désir/iu;
/** Naïah ne doit jamais être pénétrée ni ciblée génitalement. */
const NAIAH_TARGETED = /(?:en|dans) Naïah|(?:chaleur|perle de plaisir|sexe|intimité|entrejambe|cuisses?) (?:de|à) Naïah|Naïah (?:jouit|gémit de plaisir)/iu;
const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];

export function hyleeNaiahWordCount(chapters: DialogueLine[][]): number {
  return chapters.flat().reduce((total, line) => total + line.text.trim().split(/\s+/u).filter(Boolean).length, 0);
}

export function validateHyleeNaiahIntimacy(): { routes: number; sequences: number; explicitWords: { min: number; max: number; avg: number } } {
  const ids = new Set<string>();
  const labels = new Set<string>();
  const explicitWords: number[] = [];
  let routes = 0;
  let sequences = 0;
  for (const context of HYLEE_NAIAH_INTIMACY_CONTEXT_IDS) {
    const bySex = HYLEE_NAIAH_MANUAL_ROUTES[context];
    const branches = new Set<string>();
    for (const sex of SEXES) {
      const list = bySex[sex];
      if (list.length !== 3) throw new Error(`${context}/${sex}: trois routes manuelles requises`);
      for (const route of list) {
        if (!route.manual) throw new Error(`${route.id}: route non manuelle`);
        if (ids.has(route.id)) throw new Error(`${route.id}: identifiant dupliqué`);
        if (labels.has(route.text)) throw new Error(`${route.id}: libellé dupliqué`);
        if (route.text.includes("{player}") || route.detail.includes("{player}")) throw new Error(`${route.id}: {player} interdit dans le libellé`);
        ids.add(route.id); labels.add(route.text); branches.add(route.hnBranch);
        for (const mode of MODES) {
          const chapters = route.chapters[mode];
          if (!chapters || chapters.length < 12) throw new Error(`${route.id}/${mode}: douze séquences minimum`);
          if (chapters.some((chapter) => chapter.length === 0)) throw new Error(`${route.id}/${mode}: séquence vide`);
          const keys = chapters.map((chapter) => JSON.stringify(chapter));
          if (new Set(keys).size !== keys.length) throw new Error(`${route.id}/${mode}: séquence dupliquée`);
          const words = hyleeNaiahWordCount(chapters);
          const minimum = mode === "explicite" ? 1000 : mode === "suggestif" ? 450 : mode === "tendre" ? 250 : 150;
          if (words < minimum) throw new Error(`${route.id}/${mode}: ${words} mots, minimum ${minimum}`);
          if (mode === "explicite") explicitWords.push(words);
          const climax = route.progression?.playerClimaxChapter[mode];
          if (climax === undefined || climax >= chapters.length) throw new Error(`${route.id}/${mode}: culmination hors séquence`);
          if (route.motherTraceChapter[mode] >= chapters.length) throw new Error(`${route.id}/${mode}: trace maternelle hors séquence`);
          const speakers = new Set(chapters.flat().map((line) => line.speaker));
          if (!speakers.has("Hylee") || !speakers.has("Naïah") || !speakers.has("{player}")) throw new Error(`${route.id}/${mode}: les trois voix doivent parler`);
          for (const line of chapters.flat()) {
            if (BANNED_ANATOMY.test(line.text)) throw new Error(`${route.id}/${mode}: vocabulaire anatomique interdit`);
            if (STATED_ORIENTATION.test(line.text)) throw new Error(`${route.id}/${mode}: orientation de Naïah énoncée`);
            if (NAIAH_TARGETED.test(line.text)) throw new Error(`${route.id}/${mode}: Naïah ciblée génitalement`);
          }
          sequences += chapters.length;
        }
        const explicit = route.chapters.explicite.flat().map((line) => line.text).join(" ");
        if (!/hilare et sans défense/u.test(explicit)) throw new Error(`${route.id}: la revanche sur Naïah manque`);
        routes += 1;
      }
    }
    if (branches.size !== 3) throw new Error(`${context}: trois branches distinctes requises`);
    const game = HYLEE_NAIAH_INTIMACY_GAMES[context];
    if (!game || game.beats.length !== 4 || game.beats.some((beat) => beat.options.length !== 3)) throw new Error(`${context}: mini-jeu 4 × 3 requis`);
    if (game.beats.some((beat) => [...beat.options.map((option) => option.score)].sort().join() !== "0,1,2")) throw new Error(`${context}: chaque temps du mini-jeu doit offrir les scores 0, 1 et 2`);
    for (const outcome of ["killed", "memory-erased", "vegetative"] as HNMotherOutcome[]) {
      if (!HYLEE_NAIAH_MOTHER_TRACES[context][outcome]?.length) throw new Error(`${context}/${outcome}: trace maternelle manquante`);
    }
  }
  const avg = Math.round(explicitWords.reduce((a, b) => a + b, 0) / explicitWords.length);
  return { routes, sequences, explicitWords: { min: Math.min(...explicitWords), max: Math.max(...explicitWords), avg } };
}
