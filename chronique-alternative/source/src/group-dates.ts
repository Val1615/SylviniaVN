import type { ChoiceData, DialogueLine, Effects, PeriodKey, StatKey } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyGame, IntimacyGameOption } from "./intimacy-games";

export type GroupDateScene = {
  id: string;
  characters: [string, string];
  title: string;
  type: string;
  description: string;
  dynamic: string;
  location: string;
  spot: string;
  period: PeriodKey;
  minStage: number;
  minAffection: number;
  minTrust: number;
  minDesire: number;
  mood: string;
  intro: DialogueLine[];
  choices: ChoiceData[];
  intimacySetting: { opening: string[]; closing: string[] };
};

export type GroupIntimacyRoute = {
  id: string;
  text: string;
  detail: string;
  chapters: Record<IntimacyMode, DialogueLine[][]>;
};

type RawLine = string | DialogueLine | [speaker: string, text: string, mood?: string];
type SexText = Record<PlayerSex, string>;
type SexLines = Record<PlayerSex, RawLine[]>;
type GroupRole = "first" | "second" | "shared";

type GroupRouteSeed = {
  id: string;
  labels: SexText;
  detail: string;
  opening: RawLine[];
  tender: RawLine[];
  suggestive: RawLine[];
  explicit: SexLines;
  ellipse: RawLine[];
  closing: RawLine[];
};

type PairRouteData = {
  agreement: RawLine[];
  deepening: Record<GroupRole, RawLine[]>;
  escalation: Record<GroupRole, RawLine[]>;
  continuations: Record<GroupRole, {
    tender: RawLine[];
    suggestive: RawLine[];
    explicitFlavor: RawLine[];
    ellipse: RawLine[];
  }>;
  aftercare: Record<GroupRole, RawLine[]>;
  routes: GroupRouteSeed[];
};

const line = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const N = (text: string): DialogueLine => line("Narration", text);
const C = (speaker: string, text: string, mood?: string): DialogueLine => line(speaker, text, mood);
const P = (text: string): DialogueLine => line("{player}", text);
const rawLines = (raw: RawLine[]): DialogueLine[] => raw.map((entry) => typeof entry === "string"
  ? N(entry)
  : Array.isArray(entry) ? line(entry[0], entry[1], entry[2]) : entry);
const sexText = (femme: string, homme: string, intersexe: string): SexText => ({ femme, homme, intersexe });
const sexLines = (femme: RawLine[], homme: RawLine[], intersexe: RawLine[]): SexLines => ({ femme, homme, intersexe });

function groupChoice(
  id: string,
  text: string,
  stat: StatKey,
  response: DialogueLine[],
  outcome: "great" | "good" | "awkward",
  firstEffects: Effects,
  secondCharacter: string,
  secondEffects: Partial<Pick<Effects, "affection" | "trust" | "desire">>,
): ChoiceData {
  return {
    id,
    text,
    stat,
    response,
    dateOutcome: outcome,
    effects: {
      ...firstEffects,
      stats: { ...(firstEffects.stats || {}), [stat]: 1 },
      relationshipEffects: { ...(firstEffects.relationshipEffects || {}), [secondCharacter]: secondEffects },
    },
  };
}

export const GROUP_DATES: GroupDateScene[] = [
  {
    id: "group-date-hylee-remerii",
    characters: ["hylee", "remerii"],
    title: "Une expérience sans sujet d’étude",
    type: "Atelier et dîner improvisé",
    description: "Aider Hylee et Remerii à fabriquer une lanterne de givre, puis empêcher le projet de redevenir une leçon.",
    dynamic: "Hylee cherche une place d’égale ; Remerii apprend à conseiller sans reprendre la conduite. Leur ancienne relation de mentore et d’élève devient une complicité adulte.",
    location: "miraldas", spot: "miraldas-atelier", period: "soirée",
    minStage: 4, minAffection: 34, minTrust: 32, minDesire: 22, mood: "soft",
    intro: [
      N("Hylee a préparé trois blocs de glace. Remerii a préparé quatorze instruments, deux protocoles et une liste intitulée « ne pas transformer le rendez-vous en cours ».") ,
      C("Hylee", "Si elle prononce le mot calibrage plus de deux fois, tu as le droit de lui confisquer la baguette.", "teasing"),
      C("Remerii", "Cette clause a été imposée sans négociation. J’en reconnais néanmoins la pertinence.", "smirk"),
      N("Elles se tournent vers vous en même temps. La lanterne attend ; la question véritable est de savoir comment vous prendrez place dans un lien qui existait longtemps avant votre arrivée."),
    ],
    choices: [
      groupChoice("ghr-equal", "Donner une tâche distincte à chacun·e, puis assembler les trois créations sans désigner de maître.", "lucidite", [N("Votre givre, la matrice de Remerii et votre propre lumière refusent d’abord de s’emboîter. Hylee propose la solution que Remerii n’avait pas vue ; la mage l’adopte sans la corriger."), C("Remerii", "Trois compétences. Aucune hiérarchie. Je reconnais que le résultat est plus élégant.", "calm"), C("Hylee", "Et personne ne m’a félicitée comme une élève. Je crois que j’aime beaucoup cette soirée.", "soft")], "great", { affection: 8, trust: 8, desire: 4 }, "remerii", { affection: 7, trust: 9, desire: 4 }),
      groupChoice("ghr-chaos", "Lancer un défi absurde : la plus belle lanterne en dix minutes, avec droit de sabotage affectueux.", "audace", [N("Le givre vole, une rune change de couleur et votre manche se retrouve mystérieusement collée à celle de Remerii. Hylee revendique deux sabotages et nie le troisième."), C("Hylee", "Nous avons toutes triché. C’est donc parfaitement équitable.", "teasing"), C("Remerii", "Je demande une revanche dans un environnement moins inflammable.", "smirk")], "great", { affection: 10, trust: 5, desire: 6 }, "remerii", { affection: 8, trust: 5, desire: 6 }),
      groupChoice("ghr-memory", "Demander à chacune ce que l’autre lui a appris sans jamais l’avoir formulé.", "resonance", [C("Hylee", "Remerii m’a appris qu’on peut partir sans fuir. Elle ne me l’a jamais dit comme ça."), C("Remerii", "Hylee m’a appris qu’aider quelqu’un ne donne aucun droit sur ce qu’il devient."), N("Elles gardent ensuite chacune une de vos mains. La lanterne reste inachevée, mais la soirée trouve exactement son centre.")], "great", { affection: 8, trust: 10, desire: 3, confluence: 2 }, "remerii", { affection: 7, trust: 10, desire: 3 }),
    ],
    intimacySetting: {
      opening: ["Remerii ferme l’atelier ; Hylee fait monter autour de la table un givre opaque qui vous soustrait aux fenêtres. Aucune des deux ne s’avance avant que vous ayez confirmé vouloir rester avec elles.", "La lanterne terminée éclaire trois sièges rapprochés. Remerii demande comment partager l’initiative ; Hylee propose que personne ne soit réduit à regarder les deux autres."],
      closing: ["La lanterne survit à la nuit, irrégulière et lumineuse. Hylee la place entre vos trois mains ; Remerii renonce à mesurer sa durée tant que vous restez ensemble autour d’elle."],
    },
  },
  {
    id: "group-date-valurn-bellirith",
    characters: ["valurn", "bellirith"],
    title: "Le tournoi sans public",
    type: "Duel de séduction",
    description: "Transformer la rivalité de Valurn et Bellirith en trois épreuves où vous refusez d’être un simple trophée.",
    dynamic: "Valurn provoque pour découvrir ce qui résiste ; Bellirith séduit pour prouver qu’elle n’a besoin d’aucun charme. Leur rivalité est brillante, compétitive et dangereusement amusée.",
    location: "algratal", spot: "algratal-ballroom", period: "soirée",
    minStage: 4, minAffection: 34, minTrust: 30, minDesire: 28, mood: "smirk",
    intro: [
      N("Valurn a tracé trois lignes de craie sur le parquet. Bellirith a déplacé les chandelles pour que chaque ligne lui offre le meilleur éclairage. Aucun des deux n’avoue avoir préparé la salle."),
      C("Valurn", "Trois manches. Aucun sort de désir, aucune lecture de pensée, aucune mauvaise foi excessive.", "charming"),
      C("Bellirith", "Il vient de s’éliminer avec la troisième règle. Nous pouvons donc commencer par ma victoire.", "smirk"),
      P("Je ne serai ni arbitre décoratif, ni prix remis au gagnant."),
      N("Leur attention se fixe sur vous. Pour la première fois, le défi devient réellement intéressant."),
    ],
    choices: [
      groupChoice("gvb-referee", "Imposer une règle : chaque provocation doit être suivie d’une vérité que son auteur préférerait cacher.", "lucidite", [C("Valurn", "Je déteste l’excellente qualité de cette règle."), C("Bellirith", "Moi, j’adore déjà la façon dont elle va lui nuire."), N("Les sourires restent acérés, mais les aveux commencent à percer : jalousie, fascination, crainte d’être le premier à devenir sincère.")], "great", { affection: 7, trust: 9, desire: 6 }, "bellirith", { affection: 7, trust: 9, desire: 6 }),
      groupChoice("gvb-third", "Entrer dans le duel et voler successivement l’avantage à Valurn puis à Bellirith.", "audace", [N("Vous interrompez la tirade de Valurn par un baiser, puis laissez Bellirith attendre le sien jusqu’à ce que son sourire se fissure. Ils protestent ensemble — preuve éclatante que vous venez de prendre la tête."), C("Bellirith", "La cible vient de devenir concurrente.", "seductive"), C("Valurn", "Enfin une soirée correctement dangereuse.", "charming")], "great", { affection: 9, trust: 5, desire: 9 }, "bellirith", { affection: 9, trust: 5, desire: 9 }),
      groupChoice("gvb-truce", "Leur demander ce qu’ils admirent réellement chez leur rival avant d’autoriser la prochaine manche.", "sangFroid", [C("Bellirith", "Il voit les pièges avant qu’ils deviennent élégants. C’est insupportable."), C("Valurn", "Elle transforme sa peur en spectacle avant que quiconque puisse l’utiliser. C’est presque admirable."), N("La trêve ne dure qu’une minute, mais leurs regards ont changé lorsqu’ils reviennent vers vous.")], "good", { affection: 6, trust: 8, desire: 5 }, "bellirith", { affection: 6, trust: 8, desire: 5 }),
    ],
    intimacySetting: {
      opening: ["Les portes de la salle de bal se verrouillent. Bellirith retire elle-même ses charmes ; Valurn pose ses cartes face cachée et promet de ne lire aucun désir qu’on ne lui aura pas formulé.", "Vous établissez le mot qui arrête toute compétition. Ensuite seulement, les trois lignes de craie deviennent un terrain où l’initiative peut se gagner, se céder et se reprendre sans jamais mettre le consentement en jeu."],
      closing: ["Au matin, Valurn et Bellirith recommencent à discuter du score. Vous retournez la feuille : au dos, ils ont chacun écrit que la seule règle importante fut respectée — personne n’est devenu un trophée."],
    },
  },
  {
    id: "group-date-iriana-valurn",
    characters: ["iriana", "valurn"],
    title: "Une audience scandaleusement privée",
    type: "Dîner hors protocole",
    description: "Inviter Iriana et Valurn à une table où chaque règle de cour doit justifier son existence ou disparaître.",
    dynamic: "Iriana connaît les conséquences de chaque geste ; Valurn teste les règles pour vérifier lesquelles la protègent et lesquelles l’emprisonnent. Ils se défient parce qu’ils se comprennent trop bien.",
    location: "algratal", spot: "algratal-palace-quarters", period: "soirée",
    minStage: 4, minAffection: 36, minTrust: 34, minDesire: 24, mood: "calm",
    intro: [N("La table ne comporte que trois couverts. Iriana a congédié le service ; Valurn a tout de même inspecté le vin, davantage par habitude de contrarier que par inquiétude."), C("Iriana", "Une soirée sans protocole ne signifie pas une soirée sans attention."), C("Valurn", "Et une soirée attentive ne signifie pas que nous devons nous ennuyer avec discipline."), N("Ils vous laissent décider quelle règle survivra au premier plat.")],
    choices: [
      groupChoice("giv-names", "Bannir les titres, mais conserver le droit de demander une pause sans justification.", "sangFroid", [N("Valurn appelle Iriana par son prénom avec une prudence qu’il déguise mal. Elle lui répond sans rang, puis vous remercie d’avoir conservé la seule règle qui protège réellement la soirée."), C("Iriana", "La liberté n’est pas l’absence de limites. C’est pouvoir choisir celles qui nous gardent.", "calm")], "great", { affection: 8, trust: 9, desire: 4 }, "valurn", { affection: 7, trust: 9, desire: 5 }),
      groupChoice("giv-dares", "Transformer chaque règle abandonnée en un défi choisi par la personne qu’elle contraignait.", "audace", [N("Iriana abandonne l’interdiction de manger avec les doigts et vous donne une pâtisserie à partager. Valurn renonce à son droit de détourner chaque question et répond franchement à la suivante."), C("Valurn", "Cette méthode de gouvernement mérite une extension nocturne.", "charming")], "great", { affection: 9, trust: 6, desire: 8 }, "valurn", { affection: 8, trust: 6, desire: 8 }),
      groupChoice("giv-consequence", "Leur demander quelle conséquence ils craignent réellement de cette proximité.", "lucidite", [C("Iriana", "Que le monde transforme un choix privé en faiblesse publique."), C("Valurn", "Qu’elle pense devoir encore payer pour l’avoir fait."), N("La table se tait. Vous ne promettez pas l’impossible ; vous leur offrez seulement une soirée qui ne deviendra ni arme ni dette.")], "great", { affection: 7, trust: 11, desire: 3 }, "valurn", { affection: 7, trust: 10, desire: 4 }),
    ],
    intimacySetting: { opening: ["Iriana ferme la porte elle-même. Valurn verse trois verres d’eau plutôt qu’un nouveau vin, puis chacun formule ce qu’il désire et ce qu’il ne souhaite pas partager.", "Le protocole conservé tient en trois règles : demander avant de changer la position d’un corps, laisser chacun répondre pour soi, interrompre sans devoir réparer l’ego des deux autres."], closing: ["Iriana rouvre la porte sans remettre immédiatement son titre. Valurn lui offre une révérence volontairement imparfaite ; elle lui répond de même, puis garde votre main jusqu’au bout du couloir."] },
  },
  {
    id: "group-date-hylee-naiah",
    characters: ["hylee", "naiah"],
    title: "La vérité sous trois reflets",
    type: "Promenade dans les brumes",
    description: "Traverser une clairière où Naïah matérialise les souvenirs d’Hylee, à condition que personne ne confonde une image et une vérité.",
    dynamic: "Naïah provoque pour libérer ce qui se cache ; Hylee a besoin de savoir que le jeu peut s’arrêter. Leur complicité devient forte lorsque l’illusion révèle sans décider à leur place.",
    location: "forbidden", spot: "forbidden-sanctuary", period: "soirée",
    minStage: 4, minAffection: 33, minTrust: 34, minDesire: 22, mood: "smirk",
    intro: [N("Trois sentiers identiques quittent la clairière. Naïah jure que deux sont illusoires ; Hylee affirme que le troisième l’est probablement aussi."), C("Naïah", "Le rendez-vous consiste à choisir le mensonge le plus intéressant."), C("Hylee", "Ou à refuser de jouer tant qu’elle ne nous dit pas où finit la falaise."), N("Vous pouvez soutenir la prudence, le jeu ou la vérité qui existe entre les deux.")],
    choices: [
      groupChoice("ghn-anchor", "Nouer vos trois poignets d’un ruban réel avant de choisir un sentier illusoire.", "sangFroid", [N("La route change quatre fois ; le ruban, jamais. Hylee finit par rire lorsqu’une pluie monte vers le ciel, et Naïah renonce à masquer sa joie de l’avoir rassurée."), C("Naïah", "Un ancrage qui n’empêche pas de jouer. Je prends note.", "smirk")], "great", { affection: 8, trust: 10, desire: 4 }, "naiah", { affection: 8, trust: 9, desire: 5 }),
      groupChoice("ghn-mirror", "Demander à chaque reflet de montrer un désir plutôt qu’un souvenir douloureux.", "resonance", [N("Hylee se voit construire un refuge qui n’est pas une prison. Naïah se voit aimée sans devoir rester fascinante. Votre propre reflet demeure flou, mais leurs deux mains le rejoignent."), C("Hylee", "Pour une fois, l’image ne me dit pas ce que je crains. Elle me demande ce que je veux.", "soft")], "great", { affection: 9, trust: 8, desire: 5, confluence: 2 }, "naiah", { affection: 9, trust: 8, desire: 5 }),
      groupChoice("ghn-chase", "Défier Naïah de vous surprendre sans jamais séparer Hylee de vous.", "audace", [N("Les arbres tournent, le sol devient eau puis verre, mais vos doigts restent mêlés à ceux d’Hylee. Elle finit par créer sa propre fausse neige pour tromper Naïah à son tour."), C("Hylee", "Elle n’avait pas précisé que nous ne pouvions pas tricher ensemble.", "teasing")], "great", { affection: 10, trust: 6, desire: 7 }, "naiah", { affection: 9, trust: 6, desire: 8 }),
    ],
    intimacySetting: { opening: ["Naïah dissipe tous les doubles qu’elle n’a pas explicitement nommés. Hylee fait apparaître un fil de givre entre vos trois mains : s’il casse, tout s’arrête et la brume disparaît.", "Vous confirmez vouloir garder un seul corps pour chacun, un seul reflet au plafond pour voir les positions et aucune sensation créée par magie. Le jeu peut alors devenir intense sans cesser d’être lisible."], closing: ["La brume revient seulement pour vous couvrir lorsque vous quittez la clairière. Le ruban réel et le fil de givre restent noués ensemble, preuve que l’illusion et l’ancrage ont appris à partager la même nuit."] },
  },
  {
    id: "group-date-remerii-iriana",
    characters: ["remerii", "iriana"],
    title: "La partition sans préséance",
    type: "Duo musical à trois",
    description: "Composer avec Remerii et Iriana une pièce où la première voix ne commande pas les suivantes.",
    dynamic: "Remerii cherche une structure juste ; Iriana veut quitter les gestes appris par devoir. Leur respect devient désir lorsqu’elles peuvent se corriger sans s’ordonner.",
    location: "algratal", spot: "algratal-music-room", period: "soirée",
    minStage: 4, minAffection: 35, minTrust: 35, minDesire: 21, mood: "calm",
    intro: [N("Remerii a apporté une partition à trois voix. Iriana a barré les mentions « principale », « soutien » et « accompagnement » avant votre arrivée."), C("Remerii", "La hiérarchie musicale n’est pas nécessairement politique."), C("Iriana", "Alors vous ne verrez aucun inconvénient à ce que nous la supprimions."), N("Elles vous cèdent la première note afin de ne pas avoir à choisir laquelle des deux doit mener.")],
    choices: [
      groupChoice("gri-cycle", "Faire tourner la mélodie principale toutes les quatre mesures.", "lucidite", [N("Chaque voix devient tour à tour centre, soutien puis surprise. Remerii découvre une structure mobile ; Iriana découvre qu’elle peut conduire sans rester responsable de toute la pièce."), C("Remerii", "L’alternance produit un équilibre étonnamment stable."), C("Iriana", "Et personne n’y demeure prisonnier. Gardons-la.")], "great", { affection: 8, trust: 9, desire: 4 }, "iriana", { affection: 8, trust: 9, desire: 4 }),
      groupChoice("gri-improv", "Retourner la partition et improviser en répondant seulement aux respirations.", "resonance", [N("La première minute trébuche. La seconde devient une conversation où Remerii abandonne ses corrections et où Iriana rit lorsqu’une note trop haute la surprend."), C("Remerii", "Je ne contrôle plus l’ensemble."), C("Iriana", "Moi non plus. C’est précisément pourquoi il nous appartient.", "smirk")], "great", { affection: 9, trust: 7, desire: 6, confluence: 2 }, "iriana", { affection: 9, trust: 7, desire: 6 }),
      groupChoice("gri-silence", "Terminer par une mesure de silence où chacune garde le contact avec les deux autres.", "sangFroid", [N("Vos trois mains demeurent sur le clavier tandis que la dernière vibration s’éteint. Remerii ne compte pas ; Iriana ne conclut pas. Le silence devient un choix commun plutôt qu’une absence."), C("Iriana", "Cette mesure-ci n’appartient à aucune salle d’audience.", "calm")], "great", { affection: 7, trust: 10, desire: 4 }, "iriana", { affection: 7, trust: 10, desire: 4 }),
    ],
    intimacySetting: { opening: ["Remerii ferme le clavier et pose la partition hors de portée. Iriana retire son diadème, puis chacune nomme ce qu’elle souhaite donner, recevoir et garder pour elle.", "Vous décidez qu’aucune voix ne parlera au nom d’une autre. L’initiative circulera comme la mélodie : offerte, acceptée, puis rendue avant qu’elle ne devienne une obligation."], closing: ["La partition reste blanche au matin. Remerii écrit seulement trois prénoms sur la couverture ; Iriana ajoute une mesure vide à la fin, afin que personne d’autre ne prétende conclure la nuit."] },
  },
  {
    id: "group-date-naiah-bellirith",
    characters: ["naiah", "bellirith"],
    title: "Le bal des masques retirés",
    type: "Jeu d’illusions sans charme",
    description: "Laisser Naïah créer le décor et Bellirith habiter la scène, puis découvrir ce qu’elles deviennent lorsque vous retirez tout masque.",
    dynamic: "Naïah transforme le réel pour éprouver les désirs ; Bellirith transforme son image pour survivre au regard. Elles s’admirent, se méfient et se défient à révéler la première vérité.",
    location: "forbidden", spot: "forbidden-ruins", period: "soirée",
    minStage: 4, minAffection: 34, minTrust: 32, minDesire: 27, mood: "seductive",
    intro: [N("Les ruines ressemblent à une salle de bal abandonnée. Naïah affirme n’avoir ajouté que le plafond ; Bellirith affirme n’avoir enchanté que les chandelles. Les deux mentent probablement avec élégance."), C("Naïah", "Nous retirons un masque à chaque danse."), C("Bellirith", "Et la personne qui n’en a plus choisit lequel des deux autres devra tomber ensuite."), P("À condition que le dernier visage ne devienne pas une dette."), N("Leur sourire simultané vaut accord.")],
    choices: [
      groupChoice("gnb-name", "Nommer à voix haute chaque illusion et chaque charme avant de l’accepter.", "lucidite", [N("La robe de Bellirith devient lumière ; Naïah annonce la modification. Le sol se change en eau ; vous demandez à retrouver la pierre. Le jeu gagne en sensualité parce que plus rien ne doit être subi pour rester merveilleux."), C("Bellirith", "La transparence est donc capable d’être séduisante. Voilà qui menace ma profession.", "smirk")], "great", { affection: 8, trust: 9, desire: 5 }, "bellirith", { affection: 8, trust: 9, desire: 5 }),
      groupChoice("gnb-truth", "Demander un désir sans image à Naïah, puis une peur sans sourire à Bellirith.", "resonance", [C("Naïah", "Je veux être suivie même lorsque le chemin ne change plus."), C("Bellirith", "J’ai peur que mon visage au repos ressemble à une absence."), N("Vous leur répondez sans flatterie. La salle perd deux lustres et gagne deux mains serrées contre les vôtres.")], "great", { affection: 8, trust: 10, desire: 4, confluence: 2 }, "bellirith", { affection: 8, trust: 10, desire: 4 }),
      groupChoice("gnb-stage", "Prendre le contrôle de la scène et leur interdire toute magie pendant une danse.", "audace", [N("Naïah trébuche sur une pierre qu’elle aurait pu effacer. Bellirith manque un pas sans charme pour le dissimuler. Elles rient, vous renversent ensemble au dernier tour et réclament immédiatement une revanche."), C("Naïah", "Sans magie, tu restes dangereusement intéressant·e."), C("Bellirith", "Et nous, terriblement réelles.", "seductive")], "great", { affection: 9, trust: 6, desire: 8 }, "bellirith", { affection: 9, trust: 6, desire: 8 }),
    ],
    intimacySetting: { opening: ["Naïah dissipe les doubles ; Bellirith retire ses charmes. Vous vérifiez ensemble qu’il reste exactement trois corps, aucune sensation magique et un seul décor que chacun peut faire disparaître.", "Un masque de brume flotte près de la porte. Le toucher signifie ralentir ; le briser met fin à toute la scène. Cette règle visible permet à la rivalité de reprendre sans confusion."], closing: ["Lorsque les ruines retrouvent leur vraie forme, personne ne cherche à reconstruire la salle de bal. Naïah et Bellirith marchent de chaque côté de vous, sans masque, assez proches pour que leurs épaules se heurtent encore."] },
  },
];

const O = (id: string, label: string, score: 0 | 1 | 2, ...lines: DialogueLine[]): IntimacyGameOption => ({ id, label, score, lines });

export const GROUP_INTIMACY_GAMES: Record<string, IntimacyGame> = {
  "group-date-hylee-remerii": {
    title: "La lanterne à trois souffles",
    instruction: "Hylee maintient le givre, Remerii règle la rune et vous alimentez la lumière. Répondez sans laisser une personne prendre tout le contrôle.",
    beats: [
      { prompt: "Le givre gagne trop vite sur la rune.", detail: "Hylee veut ralentir ; Remerii veut recalibrer immédiatement.", options: [O("hr-listen", "Demander à Hylee de donner le rythme et à Remerii de le suivre une mesure", 2, N("Remerii attend le signal d’Hylee. La glace s’arrondit sans étouffer la rune et Hylee redresse les épaules.")), O("hr-fix", "Laisser Remerii corriger seule", 0, N("La rune se stabilise, mais Hylee retire ses mains comme une élève dont on vient de reprendre l’exercice.")), O("hr-hold", "Maintenir votre lumière pendant qu’elles négocient", 1, N("La lanterne résiste assez longtemps pour qu’elles trouvent un compromis, encore un peu raide."))] },
      { prompt: "La lumière se divise en deux couleurs.", detail: "Chacune suppose que l’autre a commis une erreur.", options: [O("hr-mix", "Mêler les couleurs sans chercher laquelle est correcte", 2, N("La lumière devient irisée. Remerii oublie son diagnostic et Hylee fait tourner la lanterne entre vos trois mains.")), O("hr-choose", "Choisir la couleur d’Hylee", 0, N("Hylee sourit, puis voit Remerii se retirer d’une étape qui devait pourtant rester partagée.")), O("hr-swap", "Leur faire échanger leurs outils", 1, N("Le changement les oblige à considérer le travail de l’autre, même si la lanterne vacille encore."))] },
      { prompt: "Remerii recommence à compter.", detail: "Hylee se tait au sixième chiffre.", options: [O("hr-kiss", "Remplacer le septième chiffre par un baiser à chacune", 2, N("Le compte s’interrompt. Hylee rit contre votre joue ; Remerii prétend que la nouvelle méthode manque de reproductibilité.")), O("hr-joke", "Demander si la liste autorise les nombres impairs", 1, N("Remerii soupire, Hylee sourit et le rythme se détend sans disparaître tout à fait.")), O("hr-obey", "Suivre le compte jusqu’au bout", 0, N("La lanterne devient parfaite et le moment, beaucoup moins vivant."))] },
      { prompt: "Il faut fermer la lanterne.", detail: "La dernière jonction exige trois gestes simultanés.", options: [O("hr-three", "Compter avec vos respirations plutôt qu’avec des chiffres", 2, N("Vos souffles se rejoignent. La lumière se ferme autour de trois empreintes différentes et aucune ne disparaît.")), O("hr-command", "Donner un ordre précis à chacune", 1, N("La jonction tient, mais vous sentez que la réussite vous a brièvement replacé·e au-dessus d’elles.")), O("hr-alone", "Finir vous-même", 0, N("La lumière vous obéit et laisse deux mains inutilement ouvertes près de la vôtre."))] },
    ],
    results: { attuned: [N("La lanterne bat au rythme de trois souffles. Hylee et Remerii se rapprochent de vous sans perdre le contact l’une avec l’autre."), C("Remerii", "Équilibre confirmé."), C("Hylee", "Et personne n’a dû devenir plus petit pour y entrer.", "soft")], searching: [N("La lanterne vacille, mais garde les traces de vos trois gestes. Vous devrez encore apprendre à partager la conduite."), C("Hylee", "On peut continuer. En parlant un peu plus vite quand quelque chose se ferme.")], discordant: [N("La lanterne s’éteint. Remerii pose l’instrument ; Hylee défait le givre et vous ramenez ensemble le moment à une proximité simple."), C("Remerii", "Nous ne poursuivrons qu’après avoir retrouvé trois places entières.")] },
  },
  "group-date-valurn-bellirith": {
    title: "Le score impossible",
    instruction: "Valurn et Bellirith tentent chacun de vous faire choisir leur geste. Distribuez les points sans laisser la rivalité remplacer l’écoute.",
    beats: [
      { prompt: "Valurn vole le premier baiser.", detail: "Bellirith réclame une pénalité et prépare déjà sa riposte.", options: [O("vb-return", "Embrasser Bellirith puis demander à Valurn s’il accepte l’égalité", 2, N("Valurn accepte d’un signe ; Bellirith transforme l’égalité en invitation plutôt qu’en revanche.")), O("vb-point", "Accorder le point à Valurn", 0, N("Bellirith sourit trop parfaitement. La manche suivante risque déjà de viser la victoire plutôt que vous.")), O("vb-cancel", "Annuler le point et recommencer", 1, N("Ils protestent ensemble, puis consentent à repartir sur une base plus claire."))] },
      { prompt: "Bellirith s’approche sans charme.", detail: "Valurn affirme que son expérience constitue encore un avantage déloyal.", options: [O("vb-truth", "Demander à Bellirith ce qu’elle veut, pas ce qu’elle sait faire", 2, C("Bellirith", "Vous embrasser jusqu’à oublier s’il nous regarde."), N("Valurn cesse de plaisanter ; la vérité vient de rendre la manche plus intense.")), O("vb-skill", "La laisser démontrer son avantage", 1, N("Le geste est brillant, mais Bellirith attend encore de savoir s’il vous a réellement atteint·e.")), O("vb-mock", "Rire avec Valurn", 0, N("La rivalité se retourne contre elle. Bellirith recule avant que la scène ne devienne cruelle."))] },
      { prompt: "Ils vous demandent simultanément de choisir.", detail: "Deux mains restent ouvertes, chacune de votre côté.", options: [O("vb-both", "Prendre les deux mains et changer la règle", 2, P("Je choisis la scène, pas un vainqueur."), N("Leurs doigts se referment sur les vôtres ; le score perd enfin son pouvoir.")), O("vb-valurn", "Choisir Valurn", 0, N("Bellirith accepte avec grâce, mais la configuration à trois vient de se réduire à un duel perdu.")), O("vb-pause", "Exiger une pause avant de répondre", 1, N("Ils reculent aussitôt. La pause protège votre place, même si la tension doit être reconstruite."))] },
      { prompt: "La dernière manche n’a plus d’arbitre.", detail: "Ils attendent que vous inventiez une conclusion.", options: [O("vb-surrender", "Leur demander de perdre volontairement un geste chacun", 2, N("Valurn cède l’initiative ; Bellirith renonce à embellir sa réaction. Leurs deux défaites deviennent une confiance offerte.")), O("vb-draw", "Déclarer le match nul", 1, N("Ils acceptent, vaguement frustrés, puis se rapprochent malgré tout.")), O("vb-winner", "Vous déclarer seul·e gagnant·e", 0, N("Le trait d’humour rétablit une hiérarchie au moment précis où le jeu devait la dissoudre."))] },
    ],
    results: { attuned: [N("La feuille de score brûle dans une flamme minuscule. Valurn et Bellirith vous encadrent, toujours rivaux mais enfin attentifs au même moment."), C("Valurn", "Aucun vainqueur."), C("Bellirith", "Trois personnes terriblement motivées. C’est mieux.", "seductive")], searching: [N("Quelques points restent disputés, mais vous avez empêché la rivalité de décider à votre place."), C("Valurn", "Nous pouvons apprendre une compétition où la cible vote encore.")], discordant: [N("Le duel se durcit. Vous arrêtez la manche et chacun revient à une distance où la parole peut réparer ce que le score brouillait."), C("Bellirith", "Reprenons lorsque nous saurons tous trois pourquoi nous jouons.")] },
  },
  "group-date-iriana-valurn": {
    title: "Trois règles à conserver",
    instruction: "Iriana écrit une règle, Valurn tente de la détourner et vous décidez si elle protège une personne ou seulement une habitude.",
    beats: [
      { prompt: "Règle une : demander avant tout changement de position.", detail: "Valurn prétend qu’un regard devrait suffire.", options: [O("iv-words", "Conserver la question, même lorsque le regard paraît clair", 2, N("Iriana approuve ; Valurn teste la règle à voix haute et découvre que la réponse ajoute davantage de tension qu’elle n’en retire.")), O("iv-look", "Accepter le regard comme réponse", 0, N("Le premier changement passe, mais l’ambiguïté fragilise immédiatement le suivant.")), O("iv-sign", "Définir un geste explicite qui vaut demande", 1, N("Le signe fonctionne, à condition que chacun reste capable de le voir."))] },
      { prompt: "Règle deux : aucun titre.", detail: "Iriana hésite lorsque Valurn emploie seulement son prénom.", options: [O("iv-check", "Lui demander si cette vulnérabilité reste souhaitée", 2, C("Iriana", "Oui. Continuez à m’appeler ainsi."), N("Valurn répète son prénom sans ironie ; la règle devient un choix renouvelé.")), O("iv-tease", "Laisser Valurn insister", 0, N("Sa provocation atteint une zone qu’Iriana n’avait pas encore accepté d’ouvrir.")), O("iv-title", "Rétablir le titre par prudence", 1, N("Iriana se détend, mais une partie de la liberté promise se referme avec lui."))] },
      { prompt: "Règle trois : chacun parle pour son propre désir.", detail: "Iriana devine ce que Valurn veut ; il devine ce qu’elle retient.", options: [O("iv-say", "Leur demander de formuler eux-mêmes", 2, N("Les deux phrases sont plus simples et plus vulnérables que leurs analyses. Elles peuvent enfin recevoir une réponse.")), O("iv-translate", "Traduire leurs regards", 0, N("Vous devenez l’intermédiaire d’un désir qui devrait rester à chacun.")), O("iv-one", "N’interroger qu’Iriana", 1, N("Iriana parle franchement, mais Valurn demeure provisoirement hors de l’équilibre."))] },
      { prompt: "Une règle doit disparaître.", detail: "Ils vous laissent choisir laquelle.", options: [O("iv-none", "Refuser : aucune règle protectrice n’a besoin de mourir", 2, N("Valurn rit puis reconnaît que le véritable défi consiste à rester intense à l’intérieur de limites claires.")), O("iv-titles", "Supprimer définitivement les titres", 1, N("La proximité gagne en chaleur, même si Iriana demande de conserver ce choix comme réversible.")), O("iv-consent", "Supprimer la demande verbale", 0, N("Iriana et Valurn s’immobilisent. Vous revenez immédiatement sur ce choix avant de poursuivre quoi que ce soit."))] },
    ],
    results: { attuned: [N("Les trois règles restent visibles et deviennent des appuis plutôt que des barrières. Iriana et Valurn se rapprochent de vous sans avoir à se méfier l’un de l’autre."), C("Iriana", "La sécurité n’a rien retiré au désir."), C("Valurn", "Elle lui a donné de meilleurs endroits où jouer.")], searching: [N("Deux règles tiennent, la troisième devra être reformulée. Vous poursuivez seulement après avoir retrouvé une compréhension commune.")], discordant: [N("Le détournement a pris le dessus sur la protection. Vous arrêtez le jeu et reconstruisez les règles avant d’envisager la suite."), C("Iriana", "Aucune intensité ne justifie de devenir illisible.")] },
  },
  "group-date-hylee-naiah": {
    title: "Le fil, le reflet et la brume",
    instruction: "Hylee maintient un fil de givre réel ; Naïah modifie un unique reflet. Gardez leurs deux langages lisibles sans privilégier la peur ni l’illusion.",
    beats: [
      { prompt: "Le reflet montre un mouvement qui n’a pas encore eu lieu.", detail: "Hylee serre le fil ; Naïah affirme qu’il ne s’agit que d’une proposition.", options: [O("hn-ask", "Demander à Hylee si elle veut essayer le mouvement réel", 2, N("Hylee observe, réfléchit puis accepte avec une modification. Naïah adapte aussitôt l’image.")), O("hn-follow", "Imiter immédiatement le reflet", 0, N("Le fil craque. Naïah dissipe l’image avant que la proposition ne devienne pression.")), O("hn-clear", "Effacer le reflet", 1, N("Hylee se détend, mais Naïah perd l’unique langage magique que vous aviez accepté."))] },
      { prompt: "Le fil de givre devient trop froid.", detail: "Hylee ne s’en est pas encore aperçue.", options: [O("hn-name", "Le dire et poser la main de Naïah sur le fil", 2, N("Naïah réchauffe la brume ; Hylee réduit son sort. Leur magie se corrige sans compétition.")), O("hn-endure", "Attendre que Hylee le remarque", 0, N("Le froid devient douleur avant que votre silence ne soit compris.")), O("hn-drop", "Lâcher le fil", 1, N("Tout s’arrête correctement, mais la confiance doit être renouée avant de reprendre."))] },
      { prompt: "Naïah propose un second reflet.", detail: "La règle initiale n’en autorisait qu’un.", options: [O("hn-no", "Refuser sans accuser son envie", 2, P("J’aime l’idée. Pas ce soir, pas sans redéfinir toute la scène."), N("Naïah incline la tête et garde un seul reflet, visiblement touchée que la limite n’efface pas votre désir.")), O("hn-yes", "Accepter pour lui faire plaisir", 0, N("Hylee regarde le second corps apparaître et le fil se fissure aussitôt.")), O("hn-later", "Promettre d’en reparler", 1, N("Le reflet ne vient pas. La promesse laisse pourtant une petite attente ouverte."))] },
      { prompt: "Le fil et le reflet doivent disparaître.", detail: "Il ne restera que vos trois corps réels.", options: [O("hn-together", "Leur demander de dissiper leur magie en se tenant la main", 2, N("Givre et brume fondent au même rythme. Hylee et Naïah restent reliées par leurs doigts avant de revenir vers vous.")), O("hn-first", "Faire disparaître la brume d’abord", 1, N("La réalité revient, mais Naïah se retrouve seule à abandonner son langage avant Hylee.")), O("hn-keep", "Conserver les deux magies", 0, N("La scène reste belle, mais vous refusez le moment de vérité que toutes trois aviez préparé."))] },
    ],
    results: { attuned: [N("Il ne reste qu’une marque humide du fil et le reflet de trois corps réels. Hylee et Naïah vous rejoignent sans peur ni masque."), C("Hylee", "Je vois où nous sommes."), C("Naïah", "Et j’ai encore envie d’y rester.")], searching: [N("La magie a parfois brouillé vos places, mais le fil n’a pas rompu. Vous prenez le temps de reformuler avant de continuer.")], discordant: [N("Le fil casse. Naïah dissipe tout ; Hylee revient contre vous et la scène se termine dans une étreinte sans magie."), C("Naïah", "Une limite respectée vaut mieux qu’une illusion réussie.")] },
  },
  "group-date-remerii-iriana": {
    title: "Le contrepoint des trois mains",
    instruction: "Une main donne le rythme, une seconde le transforme, la troisième vérifie qu’aucune voix n’est reléguée à l’accompagnement.",
    beats: [
      { prompt: "Remerii impose une mesure régulière.", detail: "Iriana la suit parfaitement mais ne propose encore rien.", options: [O("ri-invite", "Demander à Iriana de briser volontairement la mesure", 2, N("Iriana décale un geste. Remerii le suit au lieu de le corriger, et la nouvelle cadence devient commune.")), O("ri-praise", "Féliciter leur synchronisation", 1, N("La mesure reste belle, mais Iriana demeure enfermée dans l’exécution parfaite.")), O("ri-faster", "Demander à Remerii d’accélérer", 0, N("La maîtrise augmente tandis que l’espace laissé à Iriana diminue."))] },
      { prompt: "Iriana prend la conduite sans l’annoncer.", detail: "Remerii hésite entre suivre et corriger.", options: [O("ri-confirm", "Confirmer le changement puis inviter Remerii à répondre", 2, N("Iriana conserve le rythme une mesure ; Remerii invente une variation et personne ne perd sa place.")), O("ri-let", "Laisser faire sans parler", 1, N("Le changement fonctionne, mais la règle d’annonce devient moins fiable.")), O("ri-stop", "Rendre immédiatement la conduite à Remerii", 0, N("Iriana retire sa main, renvoyée malgré elle au rôle d’accompagnement."))] },
      { prompt: "Vos trois rythmes divergent.", detail: "La structure ne suffit plus à vous garder ensemble.", options: [O("ri-breathe", "Revenir à trois respirations audibles", 2, N("Les gestes ralentissent et se retrouvent sur vos souffles plutôt que sur une autorité extérieure.")), O("ri-count", "Demander à Remerii de compter", 1, N("La cohérence revient, mais au prix d’un centre à nouveau unique.")), O("ri-lead", "Accélérer pour qu’elles vous suivent", 0, N("La divergence devient une course où deux personnes doivent rattraper la troisième."))] },
      { prompt: "La dernière mesure doit rester inachevée.", detail: "Personne ne doit imposer la conclusion.", options: [O("ri-touch", "Garder vos trois mains en contact et laisser le silence décider", 2, N("Aucun geste final ne domine. La proximité continue au-delà de la mesure et devient une invitation partagée.")), O("ri-kiss", "Embrasser Iriana puis Remerii", 1, N("La conclusion est tendre, quoique votre ordre crée une petite préséance.")), O("ri-flourish", "Improviser un final spectaculaire", 0, N("Le final vous place au centre et transforme leurs deux voix en public."))] },
    ],
    results: { attuned: [N("Le contrepoint s’achève sans voix principale. Remerii et Iriana gardent chacune une de vos mains, puis joignent les leurs au-dessus."), C("Remerii", "Structure mobile, équilibre maintenu."), C("Iriana", "Liberté maintenue. Voilà la mesure importante.")], searching: [N("La partition porte encore une hiérarchie par endroits, mais vous avez su la reconnaître et ralentir.")], discordant: [N("Une voix a pris trop de place. Vous terminez la musique, replacez les trois mains côte à côte et choisissez de parler avant de rejouer."), C("Remerii", "Un accord imparfait n’oblige jamais à poursuivre la pièce.")] },
  },
  "group-date-naiah-bellirith": {
    title: "Trois visages, aucun masque",
    instruction: "Naïah modifie le décor, Bellirith modifie son expression. Identifiez ce qui reste un jeu choisi et ce qui commence à cacher une personne.",
    beats: [
      { prompt: "Bellirith sourit sans que ses yeux suivent.", detail: "Naïah prétend que le masque est joli malgré tout.", options: [O("nb-pause", "Demander à Bellirith ce qu’elle protège", 2, C("Bellirith", "La peur d’être moins désirable si je dois réfléchir."), N("Naïah dissipe un lustre. Le sourire peut enfin devenir une réponse plutôt qu’une obligation.")), O("nb-admire", "Complimenter le masque", 0, N("Bellirith le renforce et s’éloigne derrière la perfection que vous venez de récompenser.")), O("nb-joke", "Demander à Naïah un sourire assorti", 1, N("La plaisanterie détend la scène sans répondre complètement à ce que Bellirith cachait."))] },
      { prompt: "Naïah change le sol en eau.", detail: "Bellirith perd l’équilibre et rit trop vite.", options: [O("nb-stone", "Rendre la pierre et vérifier ses chevilles", 2, N("Naïah dissipe l’eau sans discuter. Bellirith accepte votre main et admet que la surprise avait dépassé son plaisir.")), O("nb-catch", "Rattraper Bellirith sans arrêter l’illusion", 1, N("Elle reste en sécurité dans vos bras, même si Naïah doit encore deviner si le jeu peut continuer.")), O("nb-laugh", "Rire avec Naïah", 0, N("Bellirith se redresse seule et la rivalité devient brièvement une exclusion."))] },
      { prompt: "Elles tentent de vous impressionner en même temps.", detail: "Le décor et la posture deviennent presque impossibles à lire.", options: [O("nb-off", "Demander cinq respirations sans aucune magie", 2, N("Tout s’éteint. Naïah et Bellirith restent là, essoufflées et réelles, puis se rapprochent sans artifice.")), O("nb-more", "Les encourager à continuer", 0, N("La scène devient spectaculaire au point de dissimuler les trois personnes qui devaient l’habiter.")), O("nb-one", "Choisir l’illusion de Naïah", 1, N("Le décor demeure ; Bellirith retire son charme, mais l’équilibre se déplace vers une seule magie."))] },
      { prompt: "Le masque d’arrêt flotte près de la porte.", detail: "Naïah et Bellirith vous demandent qui doit pouvoir le briser.", options: [O("nb-all", "Chacun, à n’importe quel moment, sans vote", 2, N("Le masque se divise en trois fragments identiques qui suivent chacun de vos poignets.")), O("nb-player", "Vous seul·e", 0, N("Vous devenez responsable de limites que les deux autres doivent également pouvoir poser.")), O("nb-majority", "Deux personnes sur trois", 0, N("La règle transforme un arrêt individuel en décision collective et vous la rejetez avant de poursuivre."))] },
    ],
    results: { attuned: [N("Les trois fragments restent intacts. Naïah et Bellirith retirent pourtant leurs artifices, choisissant de poursuivre avec leurs corps et leurs visages réels."), C("Bellirith", "Aucun public."), C("Naïah", "Aucun masque obligatoire. Je crois que nous sommes prêtes.")], searching: [N("Quelques artifices restent difficiles à lire. Vous en retirez la moitié et continuez seulement avec ceux que chacun peut nommer.")], discordant: [N("Un fragment se brise. Toute magie disparaît ; vous accueillez l’arrêt sans débat et terminez la soirée dans une proximité non sexuelle."), C("Bellirith", "Une scène interrompue peut rester une confiance réussie.")] },
  },
};

export function groupIntimacyGameResult(pairId: string, score: number): DialogueLine[] {
  const game = GROUP_INTIMACY_GAMES[pairId];
  if (!game) return [];
  const maximum = game.beats.length * 2;
  if (score >= maximum - 1) return game.results.attuned;
  if (score >= Math.ceil(maximum / 2)) return game.results.searching;
  return game.results.discordant;
}

const PAIR_BODIES: Record<string, { first: string; second: string; firstFemale: boolean; secondFemale: boolean }> = {
  "group-date-hylee-remerii": { first: "Hylee", second: "Remerii", firstFemale: true, secondFemale: true },
  "group-date-valurn-bellirith": { first: "Valurn", second: "Bellirith", firstFemale: false, secondFemale: true },
  "group-date-iriana-valurn": { first: "Iriana", second: "Valurn", firstFemale: true, secondFemale: false },
  "group-date-hylee-naiah": { first: "Hylee", second: "Naïah", firstFemale: true, secondFemale: true },
  "group-date-remerii-iriana": { first: "Remerii", second: "Iriana", firstFemale: true, secondFemale: true },
  "group-date-naiah-bellirith": { first: "Naïah", second: "Bellirith", firstFemale: true, secondFemale: true },
};

function protagonistBody(sex: PlayerSex, giver: string, companion: string): string {
  if (sex === "femme") return `${giver} s’installe entre vos cuisses, embrasse leur intérieur puis pose sa bouche sur votre vulve. Sa langue maintient une pression nette sur votre clitoris tandis qu’un doigt, puis deux après votre accord, pénètrent votre vagin. ${companion} reste contre votre flanc, vous embrasse et garde une main sur ${giver} : les trois corps demeurent engagés dans le même mouvement plutôt que séparés en deux scènes.`;
  if (sex === "homme") return `${giver} referme sa main lubrifiée autour de votre pénis, masse le gland puis le prend dans sa bouche après votre accord. Sa main poursuit la base au rythme de ses lèvres tandis que ${companion} vous embrasse, caresse votre torse et garde un contact continu avec ${giver} : personne n’est réduit à attendre son tour.`;
  return `${giver} vous demande de désigner l’organe externe que vous souhaitez voir stimulé et, s’il existe une ouverture que vous voulez inclure, de préciser comment. Sa bouche suit exactement votre indication ; ses doigts massent la zone voisine ou vous pénètrent seulement à votre demande. ${companion} vous embrasse et touche ${giver} en même temps, de sorte que votre anatomie réelle organise une scène à trois sans être remplacée par une supposition.`;
}

function npcBody(name: string, female: boolean, actor: string): string {
  return female
    ? `${actor} écarte les cuisses de ${name}, embrasse son ventre puis pose sa bouche sur sa vulve. La langue reste sur son clitoris tandis que les doigts la pénètrent seulement après un oui audible ; ${name} guide ensuite la cadence d’une main au lieu de laisser son plaisir être deviné.`
    : `${actor} prend le pénis de ${name} dans une main lubrifiée, masse le gland puis le prend dans sa bouche après son accord. La langue accompagne chaque va-et-vient tandis que l’autre main soutient ses hanches ; ${name} indique sans détour la pression et le moment où accélérer.`;
}

function groupExplicit(pairId: string, role: GroupRole): SexLines {
  const pair = PAIR_BODIES[pairId];
  const build = (sex: PlayerSex): RawLine[] => {
    if (role === "first") return [
      protagonistBody(sex, pair.first, pair.second),
      npcBody(pair.first, pair.firstFemale, pair.second),
      `Le plaisir circule ainsi sans isoler personne : ${pair.first} garde le geste choisi sur votre corps pendant que ${pair.second} stimule ${pair.first}. Vous pouvez toucher et embrasser les deux, demander un changement ou arrêter l’ensemble d’un seul mot. Lorsque votre orgasme approche, vous le dites ; la cadence reste identique jusqu’aux contractions, puis ralentit graduellement sans rompre le contact entre vous trois.`,
    ];
    if (role === "second") return [
      protagonistBody(sex, pair.second, pair.first),
      npcBody(pair.second, pair.secondFemale, pair.first),
      `La position fait de ${pair.second} le point de rencontre : ${pair.second} maintient votre stimulation tandis que ${pair.first} lui donne du plaisir. Vos mains passent de l’un à l’autre et chacun reste capable de parler. À l’approche de l’orgasme de ${pair.second}, ${pair.first} conserve exactement la pression demandée ; le vôtre est ensuite accompagné sans compétition, jusqu’à ce que les trois corps ralentissent ensemble.`,
    ];
    return [
      npcBody(pair.first, pair.firstFemale, "Vous"),
      protagonistBody(sex, pair.second, pair.first),
      `Vous donnez ainsi du plaisir à ${pair.first} pendant que ${pair.second} vous en donne, puis vous changez la configuration après une question explicite : ${pair.first} rejoint votre corps et vous vous tournez vers ${pair.second}. Chaque orgasme reçoit le même rythme jusqu’au bout, sans exigence de simultanéité ni classement ; celui ou celle qui vient de jouir reste actif·ve par ses mains, sa bouche ou ses paroles auprès des deux autres.`,
    ];
  };
  return { femme: build("femme"), homme: build("homme"), intersexe: build("intersexe") };
}

const PAIR_ROUTE_DATA: Record<string, PairRouteData> = {
  "group-date-hylee-remerii": {
    agreement: ["Vous placez la lanterne sur la table et définissez trois signes visibles : ralentir, changer, arrêter. Remerii les répète avec sérieux ; Hylee ajoute que n’importe qui peut interrompre l’ensemble sans avoir à protéger les deux autres de sa déception.", ["Remerii", "Trois consentements actifs, à renouveler à chaque changement de position.", "calm"], ["Hylee", "Et trois personnes qui peuvent encore rire sans que cela signifie automatiquement oui.", "soft"]],
    deepening: {
      first: ["Hylee prend la première initiative, mais demande à Remerii de garder une main sur elle pendant qu’elle vient vers vous. L’ancien réflexe de chercher une approbation devient autre chose lorsque Remerii répond par une caresse plutôt que par une correction."],
      second: ["Remerii choisit la position et explique seulement ce qui concerne votre confort. Hylee l’interrompt par un baiser avant que la méthode n’envahisse le moment ; vous demandez à Remerii si cette interruption lui plaît, et son oui arrive plus vite que son analyse."],
      shared: ["Vous vous installez en triangle, genoux et épaules en contact. La main d’Hylee rejoint la vôtre sur Remerii ; celle de Remerii revient sur Hylee, et la circulation du geste prouve qu’aucune relation plus ancienne ne condamne la troisième personne à observer."],
    },
    escalation: {
      first: ["Le givre d’Hylee dessine ses déplacements sur votre peau. Remerii le fait fondre derrière elle avec sa bouche et ses paumes, transformant chaque trace en un geste qui relie vos trois corps."],
      second: ["Remerii annonce une variation, Hylee répond à votre souffle et vous confirmez laquelle garder. La précision de l’une et l’intuition de l’autre cessent de rivaliser : elles se vérifient mutuellement sans parler à votre place."],
      shared: ["Vos vêtements quittent la scène au rythme d’une règle simple : la personne aidée par deux mains demande elle-même ce qu’elle veut en faire. Hylee ose davantage ; Remerii improvise ; vous demeurez le troisième centre et non l’arbitre."],
    },
    continuations: {
      first: { tender: ["Hylee vous couvre de baisers pendant que Remerii lui masse la nuque et vous tient la main. La tendresse forme un cercle où chaque personne donne, reçoit et vérifie le regard des deux autres."], suggestive: ["Hylee descend sur votre corps tandis que Remerii ouvre lentement la tenue d’Hylee. Vous pouvez suivre chaque bouche et chaque main ; la lanterne irisée accélère avec les trois respirations."], explicitFlavor: ["Le givre souligne la cadence de la bouche et des doigts d’Hylee sur vous ; Remerii maintient le plaisir d’Hylee avec une précision qui se trouble chaque fois que vos réactions répondent aux siennes. Hylee ne cherche plus l’approbation de sa mentore : elle lui demande franchement de ne pas ralentir."], ellipse: ["Hylee tire le rideau de givre seulement après vos trois accords. La lanterne conserve les silhouettes séparées tandis que la chronique laisse la chambre garder leurs gestes."] },
      second: { tender: ["Remerii vous embrasse lentement ; Hylee chauffe ses mains contre vos deux peaux avant chaque nouvelle caresse. Aucune instruction ne remplace la question posée au présent."], suggestive: ["Les doigts de Remerii découvrent votre corps pendant qu’Hylee défait sa tenue et embrasse son épaule. Sa phrase se brise ; Hylee sourit sans triompher d’avoir enfin rendu la mage silencieuse."], explicitFlavor: ["Remerii garde la stimulation exacte que vous demandez pendant qu’Hylee lui donne du plaisir. Chaque fois que la voix de Remerii perd sa mesure, elle serre votre main plutôt que de reprendre le contrôle ; Hylee reçoit ce signal comme celui d’une amante adulte, pas d’une élève récompensée."], ellipse: ["Remerii éteint les instruments, Hylee opacifie les fenêtres et vous confirmez encore la position de chacun. La chronique se retire avant que les trois souffles ne deviennent une seule mesure."] },
      shared: { tender: ["Vous échangez des baisers dans toutes les directions jusqu’à ce qu’Hylee oublie de demander qui mène et que Remerii oublie de répondre. Le partage lui-même devient votre seule structure."], suggestive: ["Vos mains changent de corps sur des indications claires. Hylee rit lorsque Remerii improvise ; Remerii l’embrasse pour lui prouver que l’écart n’était pas une erreur."], explicitFlavor: ["Vous faites jouir Hylee et Remerii à tour de rôle, chacune restant engagée dans le plaisir de l’autre et dans le vôtre. Aucun geste ne rejoue une leçon : Hylee formule, Remerii reçoit, puis leurs rôles changent parce qu’elles le demandent."], ellipse: ["La lanterne se divise en trois lueurs égales. Elles se rapprochent, vos trois signes restent visibles, puis le givre couvre doucement le regard du récit."] },
    },
    aftercare: {
      first: ["Remerii vérifie vos réactions tandis qu’Hylee fait fondre le givre et vous apporte de l’eau. Vous demandez aussi à Hylee ce qu’elle a ressenti lorsque Remerii la touchait : sa réponse fière reçoit un baiser, pas une évaluation."],
      second: ["Hylee enveloppe Remerii et vous dans une chaleur sans glace. Remerii demande ce qu’elle devra changer, puis accepte de répondre à la même question ; l’après-soin devient la dernière preuve que son attention circule dans les trois directions."],
      shared: ["Vous partagez l’eau et nommez chacun un geste à conserver, un à ajuster. Hylee et Remerii se répondent comme deux partenaires ; votre propre réponse reçoit exactement la même place."],
    },
    routes: [
      { id: "givre-conduit", labels: sexText("Recevoir Hylee tandis que Remerii soutient son audace et la vôtre", "Laisser Hylee suivre votre désir pendant que Remerii la trouble", "Confier votre anatomie à Hylee sans laisser Remerii hors du cercle"), detail: "Hylee conduit le plaisir du protagoniste ; Remerii stimule Hylee et maintient l’équilibre sans reprendre son ancien rôle de mentore.", opening: [["Hylee", "Je veux commencer. Pas pour prouver que je sais faire — parce que j’en ai envie.", "determined"], ["Remerii", "Alors je vous suivrai. Toutes les deux. Sans corriger.", "calm"]], tender: ["Hylee se place au centre du cercle et vous demande chaque avancée ; Remerii l’embrasse entre deux gestes et garde votre main contre la sienne."], suggestive: ["Hylee ouvre vos vêtements tandis que Remerii ouvre les siens. Vous sentez la respiration de la mage contre votre épaule et le givre de la cryomancienne descendre sans ambiguïté sur votre corps."], explicit: groupExplicit("group-date-hylee-remerii", "first"), ellipse: ["La lanterne se pose derrière Hylee ; Remerii rejoint son dos et vos trois accords précèdent le rideau de givre."], closing: ["Hylee reste entre vous, non comme un lien à protéger mais comme une femme qui vient de conduire son propre désir.", ["Remerii", "Vous n’avez eu besoin d’aucune permission de ma part.", "calm"], ["Hylee", "Seulement de ta présence. Et de la sienne.", "soft"]] },
      { id: "mesure-defaite", labels: sexText("Désordonner la précision de Remerii avec Hylee comme complice", "Laisser Remerii vous apprendre sans partition pendant qu’Hylee la défait", "Guider Remerii ensemble sans supposer aucun rôle à votre corps"), detail: "Remerii mène le protagoniste tandis qu’Hylee transforme sa méthode en improvisation partagée.", opening: [["Remerii", "Je souhaite commencer. Hylee, si je recommence à enseigner… interrompez-moi.", "smirk"], ["Hylee", "J’ai plusieurs méthodes en tête.", "teasing"]], tender: ["Remerii vous attire avec soin ; Hylee embrasse ses mains, ses épaules puis sa bouche chaque fois que l’attention devient trop studieuse."], suggestive: ["Remerii suit votre peau tandis qu’Hylee suit la sienne. Ses consignes raccourcissent jusqu’à devenir des demandes que vous entendez toutes les deux."], explicit: groupExplicit("group-date-hylee-remerii", "second"), ellipse: ["Hylee retourne la dernière partition. Remerii confirme les trois limites et la lanterne s’éteint sur son premier geste improvisé."], closing: ["Remerii demeure au milieu de vous, cheveux défaits et méthode oubliée.", ["Hylee", "Tu n’as corrigé personne.", "teasing"], ["Remerii", "Une réussite que je refuse absolument de noter.", "smirk"]] },
      { id: "lanterne-trois", labels: sexText("Faire circuler trois plaisirs sous la lanterne de givre", "Changer de place jusqu’à ce que trois désirs trouvent leur mesure", "Inventer un langage physique qui respecte chacun des trois corps"), detail: "L’initiative circule et la relation Hylee–Remerii se transforme sans exclure le protagoniste.", opening: ["Vous posez une main sur Hylee et une sur Remerii. Elles ajoutent leurs mains jusqu’à ce qu’aucune ne puisse dire laquelle a commencé.", ["Hylee", "À nous. Vraiment à nous trois.", "soft"]], tender: ["Les baisers et les caresses passent de l’une à l’autre sans ordre fixe. Chaque personne demeure assez proche pour demander, répondre et être entendue."], suggestive: ["Vos vêtements se mêlent au pied de la table. La lanterne révèle les changements de position et les mains qui les proposent, sans jamais fondre vos silhouettes."], explicit: groupExplicit("group-date-hylee-remerii", "shared"), ellipse: ["Vous répétez les trois signes et laissez la lanterne opacifier lentement ses parois. La suite appartient aux trois corps qu’elle éclaire encore."], closing: ["La lumière retrouve trois couleurs distinctes au moment où vos souffles ralentissent.", ["Remerii", "Aucune voix principale."], ["Hylee", "Et aucune personne laissée dans le noir.", "soft"]] },
    ],
  },

  "group-date-valurn-bellirith": {
    agreement: ["Vous placez la feuille de score près de la porte et écrivez au-dessus : le consentement ne rapporte aucun point et son retrait ne constitue jamais une défaite. Valurn signe ; Bellirith ajoute qu’aucun charme ne sera utilisé pour obtenir une réponse.", ["Valurn", "Nous pouvons donc être odieusement compétitifs sur tout le reste.", "charming"], ["Bellirith", "Il compte perdre avec panache.", "smirk"]],
    deepening: {
      first: ["Valurn réclame la première manche et demande à Bellirith de choisir sa contrainte. Elle lui interdit de détourner vos réponses par l’humour ; vous exigez en retour que Bellirith ne transforme pas ses propres réactions en spectacle."],
      second: ["Bellirith prend le centre et demande à Valurn de rester visible lorsqu’il la touche. Il accepte, puis lui fait formuler le geste qu’elle désire au lieu de la laisser le mettre en scène pour vous."],
      shared: ["Vous refusez de rester entre eux comme une ligne de séparation. Valurn et Bellirith doivent se demander directement chaque changement avant de vous y inclure ; la rivalité gagne en intensité lorsqu’elle devient enfin lisible."],
    },
    escalation: {
      first: ["Valurn fait de chaque provocation une question réelle. Bellirith répond en touchant Valurn pendant qu’il vous touche, puis attend que vous confirmiez apprécier la configuration avant de revendiquer un point."],
      second: ["Bellirith abandonne ses poses parfaites et laisse Valurn voir ce que vos réactions provoquent chez elle. Il cesse de rire assez longtemps pour la toucher comme une personne, non comme une adversaire."],
      shared: ["Vous échangez les positions à chaque manche, mais jamais par surprise. Les mains changent, les bouches se rencontrent, la feuille se froisse et personne ne compte plus les reprises avec exactitude."],
    },
    continuations: {
      first: { tender: ["Valurn vous embrasse avec une douceur qu’il prétend stratégique. Bellirith caresse sa nuque et votre visage, puis accorde généreusement le point à la sincérité."], suggestive: ["Valurn ouvre vos vêtements sous le regard de Bellirith ; elle ouvre les siens et lui murmure des défis qu’il ne peut relever qu’en restant attentif à vos réponses."], explicitFlavor: ["Valurn maintient le rythme que vous avez choisi tandis que Bellirith le stimule à son tour. Sa rivalité devient physique sans devenir brutale : elle lui demande de ne pas ralentir, il vous demande si vous voulez davantage, et les deux réponses priment sur le score."], ellipse: ["Valurn pose les cartes, Bellirith retire les bijoux et vous répétez le mot d’arrêt. Le rideau tombe seulement après le troisième oui."] },
      second: { tender: ["Bellirith vous couvre de baisers sans charme pendant que Valurn lui tient la main et vous caresse l’épaule. Son visage au repos devient le centre le plus vulnérable de la manche."], suggestive: ["Bellirith suit votre corps ; Valurn défait lentement sa tenue et commente moins à mesure que ses vraies réactions remplacent le spectacle."], explicitFlavor: ["Bellirith vous donne du plaisir sans magie pendant que Valurn lui en donne avec une précision compétitive. Elle conserve votre rythme même lorsque son propre plaisir la traverse ; Valurn attend sa demande avant de reprendre, plus fier de l’avoir entendue que de l’avoir vaincue."], ellipse: ["Bellirith éteint ses charmes ; Valurn retourne la feuille. Vous restez trois silhouettes réelles avant que le récit ne ferme la salle."] },
      shared: { tender: ["Chaque attaque devient un baiser rendu dans une autre direction. Valurn et Bellirith acceptent une trêve assez longue pour vous entourer sans chercher lequel paraît le plus séduisant."], suggestive: ["Les changements d’initiative deviennent rapides mais toujours annoncés. Une main cède, une bouche reprend et vos trois regards remplacent enfin l’arbitre."], explicitFlavor: ["Vous faites circuler le plaisir et la conduite, donnant à l’un pendant que l’autre vous stimule, puis inversant après un accord clair. Valurn et Bellirith tentent encore de faire mieux que leur rival ; vous leur rappelez que « mieux » signifie écouter davantage, et tous deux relèvent ce défi."], ellipse: ["La feuille brûle dans une coupe. Sans score, vos trois corps trouvent une nouvelle compétition que la chronique choisit de ne pas arbitrer."] },
    },
    aftercare: {
      first: ["Bellirith apporte l’eau ; Valurn vérifie directement si sa fermeté est restée agréable. Vous interrogez aussi Bellirith sur le moment où elle a cessé de jouer : elle répond sans sourire, et Valurn ne transforme pas l’aveu en victoire."],
      second: ["Valurn enveloppe Bellirith et vous dans le rideau tombé. Bellirith confirme que chaque charme est resté éteint ; vous demandez à Valurn si la compétition a parfois dépassé son plaisir, et il répond sans esquive."],
      shared: ["Vous examinez les marques, partagez l’eau et attribuez chacun un point à un geste d’écoute. Valurn et Bellirith protestent contre cette catégorie avant d’y participer avec un sérieux révélateur."],
    },
    routes: [
      { id: "valurn-mene", labels: sexText("Défier Valurn de vous faire céder tandis que Bellirith le défait", "Laisser Valurn prendre votre plaisir comme mise et Bellirith comme rivale", "Donner à Valurn un corps sans modèle et à Bellirith le droit de le troubler"), detail: "Valurn mène le plaisir du protagoniste ; Bellirith le stimule et conteste chaque avantage sans transformer le protagoniste en trophée.", opening: [["Valurn", "Première manche : je te fais oublier le score.", "charming"], ["Bellirith", "Et moi, je lui fais oublier son propre nom avant la fin.", "seductive"], P("Vous demanderez avant chaque changement. C’est ma règle.")], tender: ["Valurn vous embrasse ; Bellirith embrasse Valurn puis vous. La manche devient une chaîne de gestes doux qu’aucun ne veut reconnaître comme stratégie."], suggestive: ["Valurn descend sur votre corps pendant que Bellirith ouvre sa chemise et garde une main sur vous. Chaque provocation s’accompagne d’une vérification réelle."], explicit: groupExplicit("group-date-valurn-bellirith", "first"), ellipse: ["Bellirith annonce le premier point, Valurn conteste et vous les attirez tous deux derrière le rideau après avoir répété la limite."], closing: ["Valurn réclame la victoire, encore essoufflé entre vous et Bellirith.", ["Bellirith", "Tu as oublié le score avant nous.", "smirk"], ["Valurn", "Je considère cela comme une stratégie avancée.", "charming"]] },
      { id: "bellirith-mene", labels: sexText("Laisser Bellirith prouver sans magie ce que Valurn voudrait surpasser", "Offrir votre désir réel à Bellirith sous le regard rival de Valurn", "Demander à Bellirith de lire vos indications, pas votre anatomie supposée"), detail: "Bellirith mène sans charme ; Valurn la stimule, la provoque et finit par protéger la sincérité qu’il voulait dépasser.", opening: [["Bellirith", "Je commence sans magie. Valurn peut vérifier chaque seconde.", "seductive"], ["Valurn", "Je prévois surtout de la distraire."], P("Seulement si elle le demande.")], tender: ["Bellirith vous embrasse sans posture ; Valurn garde une main sur sa nuque et l’autre dans la vôtre. Son sourire disparaît, remplacé par une attention qui ne cherche plus à impressionner."], suggestive: ["Bellirith ouvre vos vêtements tandis que Valurn défait les siens. Elle formule ce qu’elle veut recevoir sans cesser de suivre vos réactions."], explicit: groupExplicit("group-date-valurn-bellirith", "second"), ellipse: ["Les bijoux restent au sol, les cartes sur la table et les trois fragments de la limite à vos poignets. Le récit se retire avant la revanche."], closing: ["Bellirith repose sans sourire étudié, une main sur vous et l’autre sur Valurn.", ["Valurn", "Tu étais meilleure quand tu as cessé d’essayer de gagner."], ["Bellirith", "C’est presque tendre. Je ne le répéterai pas.", "thoughtful"]] },
      { id: "score-brule", labels: sexText("Faire de leurs rivalités deux chemins vers votre plaisir partagé", "Changer la victoire en relais entre Valurn, Bellirith et vous", "Brûler les rôles et construire une compétition adaptée aux trois corps"), detail: "La rivalité devient un relais négocié : chacun conduit, reçoit et abandonne une victoire au profit du trio.", opening: ["Vous brûlez un coin de la feuille et exigez un relais : une personne mène, une reçoit, la troisième vérifie puis les rôles tournent.", ["Valurn", "Une compétition où tout le monde doit savoir perdre."], ["Bellirith", "Il est enfin qualifié.", "smirk"]], tender: ["Les relais se font par des baisers et des mains offertes. Bellirith cède l’initiative à Valurn sans humiliation ; il vous la rend sans feinte."], suggestive: ["Vos vêtements quittent la piste à chaque changement annoncé. Les provocations deviennent des instructions désirées et les ripostes des gestes qui incluent toujours le troisième corps."], explicit: groupExplicit("group-date-valurn-bellirith", "shared"), ellipse: ["La feuille finit de brûler. Trois consentements restent, puis le rideau se referme sur une compétition que personne ne pourra raconter correctement."], closing: ["Le score n’existe plus. Valurn et Bellirith cherchent encore une formule qui leur permettrait de revendiquer la nuit.", P("Nous avons tous les trois choisi de rester."), ["Bellirith", "La seule victoire acceptable.", "thoughtful"]] },
    ],
  },

  "group-date-iriana-valurn": {
    agreement: ["Les trois règles restent écrites sur la table : annoncer les changements, parler pour soi, interrompre sans dette. Iriana les signe de son prénom ; Valurn ajoute qu’aucune plaisanterie ne pourra servir à cacher un non ou transformer un oui en pari.", ["Iriana", "Nous pouvons être audacieux parce que nous resterons lisibles.", "calm"], ["Valurn", "Et scandaleusement honnêtes. Voilà la partie difficile."]],
    deepening: {
      first: ["Iriana prend la première initiative et demande à Valurn de rester près de vous plutôt que de jouer le spectateur détaché. Il accepte ; lorsqu’elle lui demande aussi de la toucher, son ironie cède devant la netteté de son désir."],
      second: ["Valurn propose de conduire sans détourner la scène en provocation politique. Iriana lui rappelle la règle de l’annonce, puis pose elle-même sa main sur lui pendant qu’il vient vers vous."],
      shared: ["Vous retirez la dernière préséance : chaque personne aura le centre, puis le cédera seulement sur une demande. Iriana et Valurn se regardent comme deux stratèges forcés de faire confiance à une règle plus simple que leurs habitudes."],
    },
    escalation: {
      first: ["Iriana ouvre vos vêtements sans titre ni ordre. Valurn ouvre les siens et lui demande à voix haute où poser ses mains ; elle répond au singulier, puis revient vérifier votre regard avant de poursuivre."],
      second: ["Valurn transforme son insolence en questions concrètes. Iriana répond pour elle-même et touche Valurn pendant qu’il suit votre corps, reliant la proximité au lieu de la surveiller."],
      shared: ["Vous changez les positions comme une négociation réussie : proposition, accord, mouvement. L’intensité augmente précisément parce que personne ne doit deviner lequel des trois peut parler."],
    },
    continuations: {
      first: { tender: ["Iriana vous garde contre elle ; Valurn embrasse sa main puis votre épaule. La souveraine reçoit la douceur sans responsabilité publique et le démonologue la donne sans marché caché."], suggestive: ["Iriana descend sur votre peau pendant que Valurn défait son corsage et suit son souffle. Ses demandes restent nettes même lorsqu’elles perdent toute solennité."], explicitFlavor: ["Iriana garde le rythme choisi sur votre corps tandis que Valurn la stimule. Elle ne transforme pas votre plaisir en obéissance ni le sien en faiblesse : elle demande, reçoit, puis exige que Valurn vous regarde lorsque votre orgasme approche."], ellipse: ["Iriana dépose le titre, Valurn dépose les cartes et vous répétez les trois règles. La porte se ferme sur leurs premières demandes sans masque."] },
      second: { tender: ["Valurn vous embrasse sans provoquer Iriana ; elle tient sa nuque et votre main, surprise par une tendresse qui ne cherche aucune conséquence."], suggestive: ["Valurn suit votre corps pendant qu’Iriana ouvre sa chemise. Chaque trait d’humour qu’il abandonne devient une caresse plus honnête dans l’une ou l’autre direction."], explicitFlavor: ["Valurn vous donne du plaisir pendant qu’Iriana lui en donne. Il conserve votre cadence malgré son propre souffle rompu et demande à Iriana de continuer sans transformer la phrase en défi ; elle obéit à son désir, non à une place dans la hiérarchie."], ellipse: ["Valurn annonce la position, Iriana l’accepte et vous confirmez la vôtre. La chronique se retire avant que le dernier protocole ne tombe avec leurs vêtements."] },
      shared: { tender: ["Vous échangez les places sans cérémonie, chaque personne gardant une main sur les deux autres. Iriana rit lorsque Valurn demande trop poliment la suite ; il recommence avec son prénom."], suggestive: ["Les titres disparaissent, puis les vêtements. La circulation de l’initiative laisse Iriana libre de recevoir, Valurn libre de demander et vous libre de ne représenter personne d’autre que vous-même."], explicitFlavor: ["Les trois plaisirs se poursuivent en relais : Iriana reçoit sans dette, Valurn cède sans perdre, vous donnez et recevez selon votre anatomie réelle. Aucune position ne devient permanente ni symbolique ; elle dure seulement tant que les trois réponses restent oui."], ellipse: ["Les règles restent visibles à la lumière de la lampe. Vos trois corps changent encore de place, puis le récit choisit de ne pas transformer cette liberté en document public."] },
    },
    aftercare: {
      first: ["Valurn apporte l’eau sans commentaire ; Iriana demande si sa conduite a parfois ressemblé à un ordre. Vous répondez, puis la même question revient vers Valurn : la vulnérabilité circule au lieu d’être exigée d’une seule personne."],
      second: ["Iriana couvre Valurn et vous, vérifie la limite la plus difficile à maintenir et accepte qu’il nomme aussi la sienne. Aucun des deux ne transforme cet examen en conseil de guerre."],
      shared: ["Vous relisez les trois règles après coup. Chacun confirme un moment juste et un ajustement possible ; Iriana garde la feuille privée, Valurn promet de ne jamais l’utiliser comme preuve d’une victoire."],
    },
    routes: [
      { id: "iriana-prenom", labels: sexText("Laisser Iriana conduire en femme tandis que Valurn refuse la cour", "Recevoir Iriana sans titre pendant que Valurn révèle son désir", "Donner à Iriana votre langage corporel et à Valurn sa place sans symbole"), detail: "Iriana mène hors protocole ; Valurn la stimule et protège le droit de chacun à ne rien devoir au pouvoir.", opening: [["Iriana", "Je veux commencer. Iriana, pas l’Empire.", "calm"], ["Valurn", "Et je veux voir si tu sais demander sans proclamer."], ["Iriana", "Touche-moi pendant que je viens vers elle — ou lui.", "smirk"]], tender: ["Iriana vous embrasse et laisse Valurn embrasser sa nuque. Sa main tient la vôtre ; la sienne trouve celle de Valurn sans qu’aucun geste devienne alliance."], suggestive: ["Iriana ouvre vos vêtements pendant que Valurn ouvre les siens. Vous entendez chaque demande et voyez chaque changement avant qu’il ne devienne mouvement."], explicit: groupExplicit("group-date-iriana-valurn", "first"), ellipse: ["Iriana répète son prénom ; Valurn répète la limite et vous les attirez tous deux loin de la couronne avant que le récit ne se ferme."], closing: ["Iriana reste au centre sans gouverner personne.", ["Valurn", "Tu as réussi à ne représenter aucun royaume."], ["Iriana", "Vous avez tous deux réussi à rester.", "calm"]] },
      { id: "valurn-sans-pari", labels: sexText("Confier votre plaisir à Valurn pendant qu’Iriana désarme ses feintes", "Laisser Valurn céder à vos réactions sous le regard privé d’Iriana", "Faire nommer à Valurn chaque geste pendant qu’Iriana l’empêche de supposer"), detail: "Valurn mène sans pari caché ; Iriana le stimule et exige de lui une honnêteté aussi nette que la sienne.", opening: [["Valurn", "Je commence sans mise et sans conséquence politique. C’est presque indécent."], ["Iriana", "Commencez surtout sans détour. Demandez."], ["Valurn", "Est-ce que tu me veux entre tes mains pendant que je m’occupe de toi ?"]], tender: ["Valurn vous embrasse avec une simplicité qui étonne Iriana. Elle pose sa main sur lui, puis sur vous, et le moment cesse de demander lequel des deux est le plus vulnérable."], suggestive: ["Valurn descend sur votre corps tandis qu’Iriana défait sa tenue. Il annonce chaque changement avec une franchise que son sourire ne parvient plus à déguiser."], explicit: groupExplicit("group-date-iriana-valurn", "second"), ellipse: ["Valurn pose son masque sur la table avec les cartes. Iriana confirme son choix ; vous confirmez le vôtre et la porte devient enfin privée."], closing: ["Valurn repose entre vous sans plaisanter sur l’avantage obtenu.", ["Iriana", "Vous n’avez rien gagné."], ["Valurn", "Exact. C’est ce qui rend la nuit précieuse."] ] },
      { id: "regles-vivantes", labels: sexText("Faire circuler le désir entre une princesse, un démonologue et vous", "Transformer leurs règles en relais plutôt qu’en hiérarchie", "Adapter chaque relais aux trois corps sans donner de rôle au sexe"), detail: "Les règles protègent une alternance complète : chacun conduit, reçoit et parle pour son propre désir.", opening: ["Vous leur demandez de choisir ensemble qui reçoit le premier geste et qui garde le contact. La réponse arrive sans titre, sans carte et sans majorité imposée.", ["Iriana", "Nous changeons dès que la personne au centre le demande."], ["Valurn", "Une règle terriblement sensée. Je vais devoir l’aimer."]], tender: ["Chaque place reçoit une étreinte et deux attentions. Le relais garde les mains liées, afin qu’aucune personne ne disparaisse lorsque le centre change."], suggestive: ["Les changements annoncés deviennent plus audacieux. Iriana conduit puis reçoit ; Valurn cède puis reprend ; vous restez sujet de votre propre désir dans toutes les positions."], explicit: groupExplicit("group-date-iriana-valurn", "shared"), ellipse: ["Trois règles, trois consentements et trois positions encore possibles demeurent à la lumière. La chronique n’en choisit aucune à votre place."], closing: ["La feuille est intacte et les trois règles ont survécu à l’intensité.", ["Iriana", "Nous étions libres à l’intérieur de ce que nous avions choisi."], ["Valurn", "La meilleure forme de scandale."] ] },
    ],
  },

  "group-date-hylee-naiah": {
    agreement: ["Le fil de givre relie vos trois poignets ; un seul reflet flotte au plafond. Hylee rappelle que le fil cassé arrête tout. Naïah confirme qu’aucune illusion ne créera un contact, un corps ou un consentement qui n’existe pas réellement.", ["Naïah", "Je peux embellir le décor, jamais votre réponse."], ["Hylee", "Et je peux l’arrêter sans transformer la soirée en échec.", "soft"]],
    deepening: {
      first: ["Hylee demande à commencer et à garder Naïah visible près de vous. Naïah pose une main sur elle, une sur vous ; le fil montre que chaque mouvement relie trois personnes réelles."],
      second: ["Naïah prend l’initiative sans double ni métamorphose. Hylee suit chaque geste dans le reflet, puis touche Naïah à son tour après lui avoir demandé si l’image correspond encore à son envie."],
      shared: ["Vous placez le reflet au-dessus d’un triangle de corps plutôt qu’au-dessus d’une scène idéale. Hylee et Naïah conviennent que la personne au centre choisit la magie qui reste et le geste qui vient."],
    },
    escalation: {
      first: ["Hylee suit votre peau avec le givre tandis que Naïah réchauffe les traces et touche Hylee. Le reflet montre chaque main réelle ; aucune brume ne vient combler ce que les mots doivent demander."],
      second: ["Naïah descend sur votre corps pendant qu’Hylee suit le sien. La brume souligne les souffles sans inventer de sensation, et le fil reste assez souple pour que chacun puisse reculer."],
      shared: ["Givre et brume deviennent des indications visuelles : position, rythme, changement proposé. Vos corps restent les seuls à produire le contact et les seuls à pouvoir l’accepter."],
    },
    continuations: {
      first: { tender: ["Hylee vous embrasse pendant que Naïah la tient par la taille et garde votre main contre sa joue. Le reflet renvoie trois visages sans aucun rôle supplémentaire."], suggestive: ["Hylee ouvre vos vêtements ; Naïah ouvre les siens et fait fondre chaque trace de froid d’une bouche réelle. Vous voyez et sentez exactement laquelle vous touche."], explicitFlavor: ["Hylee maintient le geste choisi sur votre corps tandis que Naïah stimule Hylee et l’embrasse. Le givre casse si l’une de vous s’éloigne trop ; il reste intact parce que chaque demande reçoit une réponse entendue dans les trois directions."], ellipse: ["Hylee épaissit le givre, Naïah dissipe la brume et vous gardez le fil visible jusqu’au dernier instant raconté."] },
      second: { tender: ["Naïah vous embrasse sans masque tandis qu’Hylee réchauffe sa nuque et tient votre poignet. Sa douceur réelle étonne davantage que n’importe quelle illusion."], suggestive: ["Naïah suit votre peau ; Hylee suit la sienne et le reflet révèle ses vraies réactions avant qu’elle puisse les transformer en jeu."], explicitFlavor: ["Naïah vous donne du plaisir sans fabriquer la moindre sensation magique. Hylee lui en donne simultanément et garde le fil lisible ; lorsque Naïah demande davantage, elle le fait de sa propre voix et attend un oui avant de reprendre votre rythme."], ellipse: ["Naïah éteint le reflet, Hylee confirme le fil et vos trois corps réels disparaissent seulement derrière la brume protectrice du décor."] },
      shared: { tender: ["Vous tournez lentement les places, chaque personne recevant deux gestes assez doux pour rester entièrement lisibles. Le reflet devient inutile et Naïah le dissipe d’elle-même."], suggestive: ["Les vêtements, puis la magie décorative disparaissent. Givre et brume restent seulement aux poignets, témoins des changements demandés."], explicitFlavor: ["Vous donnez et recevez en relais sans laisser la magie ajouter un corps ou une sensation. Hylee et Naïah s’occupent l’une de l’autre tout en restant engagées avec vous ; le plaisir devient plus intense parce qu’aucune réaction ne peut être confondue avec une illusion."], ellipse: ["Le reflet se divise en trois lumières, pas en trois doubles. Vos signes restent visibles avant que la brume n’accorde au récit son seul fondu."] },
    },
    aftercare: {
      first: ["Naïah dissipe toute la magie pendant qu’Hylee fait fondre le fil et vérifie votre peau. Vous demandez à Naïah si elle s’est sentie incluse autrement que comme décor ; sa réponse sérieuse reçoit les deux mains qui lui manquaient."],
      second: ["Hylee apporte de l’eau et demande à Naïah ce qui était vrai pour elle. Naïah répond sans énigme, puis vérifie votre confort et celui d’Hylee avec la même attention."],
      shared: ["Sans reflet, vous comparez les sensations réelles, les limites tenues et celles à ajuster. Hylee garde le ruban ; Naïah conserve une goutte de givre non pour rejouer la scène, mais pour se souvenir de sa clarté."],
    },
    routes: [
      { id: "fil-hylee", labels: sexText("Suivre Hylee pendant que Naïah réchauffe chaque trace de givre", "Laisser le désir d’Hylee vous guider sous le regard réel de Naïah", "Montrer votre anatomie à Hylee pendant que Naïah garde le fil lisible"), detail: "Hylee mène ; Naïah soutient son audace sans ajouter de corps ni de sensations illusoires.", opening: [["Hylee", "Je veux commencer avec le fil visible.", "determined"], ["Naïah", "Et je veux la toucher pendant qu’elle te touche. Rien que tu ne puisses voir.", "smirk"]], tender: ["Hylee vous embrasse ; Naïah embrasse son épaule et garde votre main entre les siennes. Le froid et la chaleur deviennent deux attentions réelles."], suggestive: ["Hylee descend sur votre corps tandis que Naïah ouvre sa tenue. Le reflet confirme la position sans anticiper aucun mouvement."], explicit: groupExplicit("group-date-hylee-naiah", "first"), ellipse: ["Le fil reste intact lorsque le givre devient rideau. Naïah ne laisse que vos trois ombres réelles avant que le récit ne s’efface."], closing: ["Hylee regarde le fil intact avec une fierté tranquille.", ["Naïah", "Tu n’as pas seulement tenu. Tu as choisi chaque mouvement."], ["Hylee", "Et vous étiez toutes les deux là pour l’entendre.", "soft"]] },
      { id: "brume-naiah", labels: sexText("Recevoir Naïah sans illusion pendant qu’Hylee garde l’ancrage", "Laisser Naïah découvrir votre désir réel sous le givre d’Hylee", "Guider la bouche de Naïah pendant qu’Hylee protège votre langage corporel"), detail: "Naïah mène sans masque ; Hylee la stimule et maintient un ancrage qui n’emprisonne personne.", opening: [["Naïah", "Un seul corps. Ma vraie bouche. Mes deux mains exactement où tu peux les voir."], ["Hylee", "Et le fil si l’un de nous a besoin de revenir.", "soft"]], tender: ["Naïah vous embrasse avec une retenue inhabituelle ; Hylee lui tient la taille et vous garde relié·e par la paume."], suggestive: ["Naïah ouvre vos vêtements tandis qu’Hylee suit sa peau de givre et de baisers. Le reflet renvoie les réactions qu’elle ne peut pas falsifier."], explicit: groupExplicit("group-date-hylee-naiah", "second"), ellipse: ["Naïah demande à Hylee d’opacifier le reflet. Le fil demeure ; vos trois accords réels précèdent la seule illusion protectrice de la nuit."], closing: ["Naïah reste sans brume entre vous et Hylee.", ["Hylee", "Je savais toujours où tu étais."], ["Naïah", "Et tu es restée même lorsque je n’ai plus rien changé."] ] },
      { id: "reflet-trois", labels: sexText("Faire tourner trois plaisirs dans un reflet qui ne ment plus", "Partager l’initiative entre le givre, la brume et votre corps", "Construire un relais où chaque anatomie reste réelle et nommée"), detail: "L’initiative circule ; la magie montre les gestes sans les créer et les deux femmes développent leur propre lien dans le trio.", opening: ["Vous demandez au reflet de ne montrer que ce qui existe déjà. Hylee et Naïah prennent chacune une de vos mains, puis joignent les leurs.", ["Naïah", "Aucun futur séduisant."], ["Hylee", "Seulement ce que nous choisissons maintenant.", "soft"]], tender: ["Vous tournez les places dans des étreintes lentes. Chaque changement attend une question et le reflet s’assombrit lorsqu’une personne demande du temps."], suggestive: ["Vos vêtements tombent ; le reflet reste honnête. Les mains changent de corps et la magie n’ajoute que de la lumière autour des consentements visibles."], explicit: groupExplicit("group-date-hylee-naiah", "shared"), ellipse: ["Le reflet cesse de montrer les corps et ne garde que trois lumières. La chronique accepte de suivre son exemple."], closing: ["Givre et brume ont disparu ; le ruban réel demeure autour de vos trois mains.", ["Hylee", "On n’a pas eu besoin de choisir entre prudence et désir."], ["Naïah", "Ils ont enfin appris à jouer ensemble."] ] },
    ],
  },

  "group-date-remerii-iriana": {
    agreement: ["La partition est retournée. Vous gardez seulement trois signes : offrir l’initiative, la rendre, arrêter. Remerii confirme qu’aucune précision ne lui permet de décider pour une autre ; Iriana confirme qu’aucune habitude d’obéir ne vaudra consentement.", ["Remerii", "Une structure qui protège la liberté de variation."], ["Iriana", "Et qui m’autorise à manquer la mesure.", "smirk"]],
    deepening: {
      first: ["Remerii commence après avoir demandé à Iriana de surveiller non votre comportement, mais le sien. Iriana accepte et touche Remerii chaque fois que sa précision menace de redevenir distance."],
      second: ["Iriana prend la conduite et demande à Remerii de corriger seulement les positions inconfortables. Remerii lui demande alors ce qu’elle veut recevoir, pas ce qu’une princesse devrait offrir."],
      shared: ["Vous faites tourner le centre comme une mélodie : quatre souffles, puis une proposition. Remerii et Iriana apprennent à céder l’initiative sans se reléguer mutuellement à l’accompagnement."],
    },
    escalation: {
      first: ["Remerii suit votre peau avec méthode tandis qu’Iriana suit la sienne. Chaque correction devient une question ; chaque réponse peut maintenir ou rompre la cadence sans devoir rester élégante."],
      second: ["Iriana ouvre vos vêtements pendant que Remerii ouvre les siens. Sa voix quitte le registre public ; Remerii ne félicite pas cette liberté, elle la désire et le dit."],
      shared: ["Vos gestes composent un contrepoint où deux personnes donnent pendant que la troisième reçoit, puis changent après un signe. La structure empêche seulement qu’une voix disparaisse."],
    },
    continuations: {
      first: { tender: ["Remerii vous embrasse lentement ; Iriana caresse sa nuque et votre main. La précision devient chaleur, la préséance disparaît."], suggestive: ["Remerii descend sur votre corps pendant qu’Iriana défait ses attaches. Ses indications se brisent en demandes que vous recevez toutes les deux."], explicitFlavor: ["Remerii maintient votre stimulation tandis qu’Iriana lui donne du plaisir. Elle tente de compter, perd le chiffre lorsque votre corps cède puis choisit de conserver la cadence plutôt que de retrouver le contrôle."], ellipse: ["Remerii ferme le clavier, Iriana dépose le diadème et les trois signes restent à portée avant que la dernière lumière ne s’éteigne."] },
      second: { tender: ["Iriana vous tient contre elle tandis que Remerii embrasse ses mains et votre épaule. Elle reçoit une attention qui ne ressemble ni à un service ni à une audience."], suggestive: ["Iriana suit votre peau ; Remerii suit la sienne et lui demande chaque variation au lieu d’annoncer ce qui serait juste."], explicitFlavor: ["Iriana garde le rythme que vous réclamez pendant que Remerii la stimule avec sa précision. Elle formule son propre plaisir sans ordre ; Remerii répond comme partenaire, et votre orgasme devient une note qu’aucune d’elles ne tente de s’approprier."], ellipse: ["Iriana laisse la dernière mesure inachevée. Remerii confirme les positions et le récit se retire avant que vos corps n’inventent leur propre cadence."] },
      shared: { tender: ["Vous échangez baisers et mains offertes, chacune devenant tour à tour mélodie et soutien sans y rester enfermée."], suggestive: ["Les vêtements quittent le banc ; vos trois souffles remplacent le métronome et annoncent les changements d’initiative."], explicitFlavor: ["Vous donnez et recevez en contrepoint, gardant le plaisir de la personne au centre pendant que la troisième reste engagée avec les deux. Iriana improvise, Remerii suit, puis leurs rôles changent ; vous conduisez une mesure sans devenir la voix principale de toute la nuit."], ellipse: ["Trois mains restent sur la partition blanche. La lumière baisse lorsque les signes sont répétés une dernière fois et la chronique respecte la mesure de silence."] },
    },
    aftercare: {
      first: ["Iriana apporte de l’eau tandis que Remerii vérifie le confort de chacun, y compris le sien après votre question. Vous demandez à Iriana si elle s’est sentie actrice ou soutien ; sa réponse devient la dernière mesure à écouter."],
      second: ["Remerii replace les coussins et demande à Iriana si une habitude d’obéir a remplacé un choix. Iriana répond, puis retourne la question à Remerii sur sa méthode : l’attention cesse d’être à sens unique."],
      shared: ["Vous nommez chacun une mesure juste et une dissonance à retravailler. Remerii n’écrit rien ; Iriana ne tranche rien. Les deux gardent vos mains pendant que le silence retrouve sa douceur."],
    },
    routes: [
      { id: "remerii-conduit", labels: sexText("Recevoir la précision de Remerii pendant qu’Iriana brise sa mesure", "Laisser Remerii apprendre votre rythme tandis qu’Iriana la trouble", "Donner vos indications à Remerii et votre regard à Iriana"), detail: "Remerii mène ; Iriana la stimule et transforme la maîtrise en désir improvisé.", opening: [["Remerii", "Je commence, mais je ne déciderai pas de la conclusion."], ["Iriana", "Et je vous rappellerai que manquer la mesure est permis.", "smirk"]], tender: ["Remerii vous embrasse ; Iriana embrasse sa nuque et garde votre main entre les siennes. La structure sert la proximité au lieu de la diriger."], suggestive: ["Remerii ouvre vos vêtements pendant qu’Iriana ouvre sa tenue. Leurs gestes restent synchrones sans devenir identiques."], explicit: groupExplicit("group-date-remerii-iriana", "first"), ellipse: ["Remerii retourne la partition ; Iriana laisse la dernière note suspendue et vous confirmez tous trois la suite hors champ."], closing: ["Remerii demeure entre vous sans corriger le drap ni sa respiration.", ["Iriana", "Vous avez improvisé."], ["Remerii", "Avec deux partenaires remarquablement convaincant·es.", "smirk"]] },
      { id: "iriana-improvise", labels: sexText("Laisser Iriana inventer son désir sous l’écoute précise de Remerii", "Recevoir Iriana comme femme pendant que Remerii oublie le protocole", "Faire guider vos gestes par Iriana sans rôle assigné à votre sexe"), detail: "Iriana mène hors de ses pas appris ; Remerii la stimule et écoute sans corriger.", opening: [["Iriana", "Je veux mener une mesure que personne ne m’a enseignée."], ["Remerii", "Je vous suivrai jusqu’à ce que vous choisissiez de la rendre.", "calm"]], tender: ["Iriana vous embrasse en hésitant puis en choisissant. Remerii lui tient la taille et vous caresse, attentive sans faire de l’hésitation une faute."], suggestive: ["Iriana suit votre corps tandis que Remerii suit le sien. Elle demande chaque geste au singulier et reçoit des réponses dans les deux directions."], explicit: groupExplicit("group-date-remerii-iriana", "second"), ellipse: ["La valse cesse. Remerii confirme le signe d’arrêt et Iriana choisit la prochaine position avant que le récit ne quitte la pièce."], closing: ["Iriana repose sans diadème, soutenue par vous et Remerii.", ["Remerii", "Votre mesure n’existait dans aucun manuel."], ["Iriana", "C’est pourquoi elle était enfin à moi. À nous.", "calm"]] },
      { id: "contrepoint-trois", labels: sexText("Composer trois plaisirs sans voix principale", "Faire tourner la conduite entre vos trois corps", "Écrire un contrepoint adapté aux anatomies et désirs réels"), detail: "Les trois voix circulent ; le respect réciproque de Remerii et Iriana devient une intimité pleinement partagée.", opening: ["Vous posez vos trois mains sur la partition blanche et décidez que la personne au centre offrira elle-même la prochaine mesure.", ["Remerii", "Aucune préséance."], ["Iriana", "Aucun accompagnement permanent."]], tender: ["Les places changent dans des étreintes lentes. Chacun reçoit deux attentions et peut rendre l’une sans abandonner l’autre."], suggestive: ["Vos vêtements quittent le salon au rythme des signes. Les respirations deviennent le seul tempo qu’aucun de vous ne possède."], explicit: groupExplicit("group-date-remerii-iriana", "shared"), ellipse: ["La partition demeure blanche et les trois signes restent visibles. La chronique se retire sur une mesure que personne ne conclut seul."], closing: ["Le contrepoint se termine dans un silence partagé.", ["Remerii", "Aucune voix n’a disparu."], ["Iriana", "Et aucune n’a dû régner.", "calm"]] },
    ],
  },

  "group-date-naiah-bellirith": {
    agreement: ["Les deux femmes dissipent leurs artifices avant d’en choisir de nouveaux. Un fragment de masque suit chaque poignet : le briser arrête toute la scène pour la personne qui le porte, sans vote ni négociation.", ["Bellirith", "Même mon charme ne pourra prétendre qu’un silence signifie oui."], ["Naïah", "Et même ma brume ne cachera celui ou celle qui veut partir."]],
    deepening: {
      first: ["Naïah prend la première initiative avec un seul corps et demande à Bellirith de ne modifier que le décor. Bellirith refuse d’être réduite à une machiniste : elle touche Naïah et vous après avoir obtenu deux accords distincts."],
      second: ["Bellirith commence sans charme et demande à Naïah de garder le décor stable. Naïah accepte, mais exige que Bellirith lui montre aussi les réactions qu’elle ne présente jamais au public."],
      shared: ["Vous imposez une scène où chaque masque retiré doit être remplacé par une demande réelle. Naïah et Bellirith transforment leur rivalité en défi de sincérité, chacune attentive au moment où l’autre cesse de jouer."],
    },
    escalation: {
      first: ["Naïah suit votre corps sans illusion tandis que Bellirith touche Naïah et vous. Le décor change seulement lorsque les trois fragments restent intacts et que trois voix acceptent la modification."],
      second: ["Bellirith ouvre vos vêtements avec son expérience réelle ; Naïah ouvre les siens et laisse la salle parfaitement stable pour que chaque mouvement demeure attribuable à un corps visible."],
      shared: ["Vous retirez un masque à chaque changement d’initiative : posture, plaisanterie, brume, lumière. Les corps deviennent plus lisibles et la rivalité plus intense à mesure qu’elle perd ses armes faciles."],
    },
    continuations: {
      first: { tender: ["Naïah vous embrasse tandis que Bellirith lui caresse le visage et tient votre main. Aucune image ne vient améliorer la douceur, qui devient précisément pour cela difficile à nier."], suggestive: ["Naïah descend sur votre peau ; Bellirith ouvre sa tenue et laisse sa propre respiration perdre sa perfection."], explicitFlavor: ["Naïah vous donne du plaisir sans créer de sensation magique pendant que Bellirith lui en donne sans charme. Chacune surveille encore la vérité de l’autre, mais la compétition consiste désormais à mieux entendre les demandes plutôt qu’à produire le plus bel effet."], ellipse: ["Naïah dissipe le décor avant d’épaissir seulement la brume autour des trois corps. Les fragments restent visibles jusqu’au fondu."] },
      second: { tender: ["Bellirith vous embrasse sans rôle ; Naïah garde une main sur elle et une sur vous. Le sourire de Bellirith disparaît sans que personne ne tente de le remplacer."], suggestive: ["Bellirith suit votre corps pendant que Naïah suit le sien. Aucun reflet ne retouche les réactions qui passent de l’une à l’autre."], explicitFlavor: ["Bellirith vous stimule sans charme tandis que Naïah la stimule sans illusion. Elle maintient votre rythme même lorsque son propre masque tombe dans le plaisir ; Naïah lui demande si elle veut continuer, et son oui essoufflé devient la seule mise en scène nécessaire."], ellipse: ["Bellirith retire le dernier bijou, Naïah le dernier reflet. Trois corps sans artifice poursuivent hors du regard de la chronique."] },
      shared: { tender: ["Vous échangez les places et les baisers, chaque personne offrant son visage au repos avant de recevoir la prochaine caresse."], suggestive: ["Les vêtements et les décors rejoignent le sol. Une bouche répond à une autre, une main change de corps sur demande et les fragments d’arrêt suivent tous les mouvements."], explicitFlavor: ["Le plaisir circule entre vous trois sans charme, double ni sensation ajoutée. Naïah et Bellirith s’occupent l’une de l’autre tout en vous donnant et en recevant ; chaque orgasme révèle un visage réel que les deux autres protègent au lieu de juger."], ellipse: ["Les masques se divisent en lumière autour de trois consentements intacts. Le récit laisse la scène continuer sans public."] },
    },
    aftercare: {
      first: ["Bellirith apporte de l’eau pendant que Naïah dissipe jusqu’à la dernière lueur. Vous demandez à Bellirith si elle s’est sentie réduite au décor ; Naïah écoute la réponse sans ironie et lui offre sa vraie main."],
      second: ["Naïah enveloppe Bellirith et vous dans une brume uniquement thermique, nommée et acceptée. Bellirith confirme qu’aucun charme n’a remplacé sa voix, puis vérifie les fragments et vos sensations à tous les trois."],
      shared: ["Vous replacez les trois fragments côte à côte et nommez les masques qui sont revenus par réflexe. Naïah et Bellirith ne se déclarent pas gagnantes : elles choisissent chacune une vérité à garder au matin."],
    },
    routes: [
      { id: "naiah-sans-double", labels: sexText("Recevoir la vraie Naïah pendant que Bellirith met son masque au défi", "Laisser Naïah suivre votre désir réel sous les mains de Bellirith", "Guider Naïah sans anatomie supposée pendant que Bellirith la désarme"), detail: "Naïah mène sans double ; Bellirith la stimule et transforme leur rivalité en vérification de vérité.", opening: [["Naïah", "Un corps. Aucun contact inventé."], ["Bellirith", "Et moi pour vérifier qu’elle ne rend pas tout scandaleusement avantageux."], P("Vous demanderez toutes les deux avant de changer quoi que ce soit.")], tender: ["Naïah vous embrasse ; Bellirith embrasse Naïah puis garde votre main contre sa joue. Le décor réel suffit."], suggestive: ["Naïah ouvre vos vêtements tandis que Bellirith ouvre les siens. La brume souligne les mouvements sans en créer aucun."], explicit: groupExplicit("group-date-naiah-bellirith", "first"), ellipse: ["Naïah garde un seul voile de brume ; Bellirith garde les fragments visibles. Trois accords précèdent la sortie du récit."], closing: ["Naïah reste sans masque entre vous et Bellirith.", ["Bellirith", "Tu étais plus convaincante quand tu ne changeais rien."], ["Naïah", "Tu étais plus belle quand tu as cessé de me noter."] ] },
      { id: "bellirith-sans-charme", labels: sexText("Laisser Bellirith vous séduire sans magie pendant que Naïah révèle ses réactions", "Recevoir le talent réel de Bellirith sous la brume honnête de Naïah", "Donner vos indications à Bellirith et interdire à Naïah de les embellir"), detail: "Bellirith mène sans charme ; Naïah la stimule et rend impossible la reconstruction immédiate de son masque.", opening: [["Bellirith", "Aucun charme. Si vous me désirez, je veux savoir que c’est moi."], ["Naïah", "Et si tu cèdes, je veux voir le visage que tu caches ensuite."], P("Seulement ce que chacun choisit de montrer.")], tender: ["Bellirith vous embrasse sans spectacle tandis que Naïah lui tient la taille. Son expression se détend ; vous la gardez près au lieu de la complimenter."], suggestive: ["Bellirith suit votre peau ; Naïah suit la sienne sans reflet ni double. Toutes les réactions demeurent lisibles dans la lumière réelle."], explicit: groupExplicit("group-date-naiah-bellirith", "second"), ellipse: ["Bellirith retire les bijoux ; Naïah retire la salle enchantée. Les trois fragments restent intacts avant que la chronique ne ferme les ruines."], closing: ["Bellirith repose sans pose flatteuse entre vous et Naïah.", ["Naïah", "Tu n’as rien enchanté."], ["Bellirith", "Et vous êtes resté·es. Je reconnais la qualité de la preuve.", "thoughtful"]] },
      { id: "masques-brises", labels: sexText("Briser trois masques et faire circuler les plaisirs réels", "Changer leur duel d’images en relais entre trois corps", "Construire une scène adaptée à chaque corps, sans charme ni double"), detail: "Les trois personnes conduisent et reçoivent ; Naïah et Bellirith se défient à rester sincères jusque dans leur propre plaisir.", opening: ["Vous posez les fragments au centre et proposez un relais : chaque personne retire un masque, formule un désir puis reçoit une réponse des deux autres.", ["Naïah", "Je commence par le mystère."], ["Bellirith", "Moi, par la perfection."], P("Je commence par l’idée que je dois vous départager.")], tender: ["Les baisers passent de l’une à l’autre sans décor. Chaque visage au repos reçoit une main et une place entière."], suggestive: ["Vos vêtements tombent avec les derniers artifices. Les changements d’initiative sont annoncés, les réactions non retouchées et les deux rivalités tournées vers l’écoute."], explicit: groupExplicit("group-date-naiah-bellirith", "shared"), ellipse: ["Les fragments brillent encore autour de trois corps réels. Aucun public, aucun masque obligatoire : la chronique se retire."] , closing: ["Les ruines réapparaissent sans lumière flatteuse.", ["Bellirith", "Personne n’a gagné."], ["Naïah", "Personne n’a eu besoin de disparaître. C’est plus rare."] ] },
    ],
  },
};

function buildGroupRoute(pairId: string, sex: PlayerSex, seed: GroupRouteSeed, routeIndex: number): GroupIntimacyRoute {
  const pair = PAIR_ROUTE_DATA[pairId];
  const role: GroupRole = routeIndex === 0 ? "first" : routeIndex === 1 ? "second" : "shared";
  const modeSeed = (mode: IntimacyMode): RawLine[] => mode === "tendre" ? seed.tender : mode === "suggestif" ? seed.suggestive : mode === "explicite" ? seed.explicit[sex] : seed.ellipse;
  const continuation = (mode: IntimacyMode): RawLine[] => mode === "tendre" ? pair.continuations[role].tender : mode === "suggestif" ? pair.continuations[role].suggestive : mode === "explicite" ? pair.continuations[role].explicitFlavor : pair.continuations[role].ellipse;
  const chapters = (mode: IntimacyMode): DialogueLine[][] => [
    rawLines(seed.opening),
    rawLines(pair.agreement),
    rawLines(pair.deepening[role]),
    rawLines(pair.escalation[role]),
    rawLines(modeSeed(mode)),
    rawLines(continuation(mode)),
    rawLines(pair.aftercare[role]),
    rawLines(seed.closing),
  ];
  return {
    id: `${pairId}-${sex}-${seed.id}`,
    text: seed.labels[sex],
    detail: seed.detail,
    chapters: { tendre: chapters("tendre"), suggestif: chapters("suggestif"), explicite: chapters("explicite"), ellipse: chapters("ellipse") },
  };
}

export const GROUP_INTIMACY_ROUTES_BY_SEX: Record<string, Record<PlayerSex, GroupIntimacyRoute[]>> = Object.fromEntries(
  Object.entries(PAIR_ROUTE_DATA).map(([pairId, pair]) => [pairId, {
    femme: pair.routes.map((seed, index) => buildGroupRoute(pairId, "femme", seed, index)),
    homme: pair.routes.map((seed, index) => buildGroupRoute(pairId, "homme", seed, index)),
    intersexe: pair.routes.map((seed, index) => buildGroupRoute(pairId, "intersexe", seed, index)),
  }]),
);

export function groupIntimacyRoutes(pairId: string, sex: PlayerSex): GroupIntimacyRoute[] {
  return GROUP_INTIMACY_ROUTES_BY_SEX[pairId]?.[sex] || [];
}

export function groupIntimacyOpening(date: GroupDateScene): DialogueLine[] {
  return [
    ...date.intimacySetting.opening.map(N),
    N("Avant le premier geste intime, chacun formule une envie, une limite et le signe qui lui permettra de ralentir. Les trois réponses restent modifiables pendant toute la scène."),
  ];
}

export function groupIntimacyEnding(date: GroupDateScene): DialogueLine[] {
  return [
    N("La proximité ralentit sans se rompre brutalement. Vous vérifiez tous trois le confort, les limites tenues et les émotions qui demandent encore des mots."),
    ...date.intimacySetting.closing.map(N),
  ];
}

export function validateGroupIntimacyCatalog(): { pairs: number; combinations: number; routes: number; chapters: number; dates: number; games: number } {
  let combinations = 0;
  let routes = 0;
  let chapters = 0;
  const labels: string[] = [];
  Object.entries(GROUP_INTIMACY_ROUTES_BY_SEX).forEach(([pairId, bySex]) => {
    (["femme", "homme", "intersexe"] as PlayerSex[]).forEach((sex) => {
      const entries = bySex[sex];
      if (!entries || entries.length !== 3) throw new Error(`${pairId}/${sex}: trois routes sont requises`);
      entries.forEach((entry) => {
        labels.push(entry.text);
        (["tendre", "suggestif", "explicite", "ellipse"] as IntimacyMode[]).forEach((mode) => {
          const sequence = entry.chapters[mode];
          const words = sequence.flat().reduce((total, current) => total + current.text.trim().split(/\s+/u).length, 0);
          const minimum = mode === "explicite" ? 320 : 200;
          if (sequence.length !== 8 || sequence.some((chapter) => chapter.length === 0)) throw new Error(`${entry.id}/${mode}: huit séquences requises`);
          if (words < minimum) throw new Error(`${entry.id}/${mode}: ${words} mots, minimum ${minimum}`);
          chapters += sequence.length;
        });
      });
      combinations += 1;
      routes += entries.length;
    });
    const game = GROUP_INTIMACY_GAMES[pairId];
    if (!game || game.beats.length !== 4 || game.beats.some((beat) => beat.options.length !== 3)) throw new Error(`${pairId}: mini-jeu incomplet`);
  });
  if (new Set(labels).size !== labels.length) throw new Error("Chaque route à trois doit avoir un libellé unique par duo et par sexe");
  if (GROUP_DATES.length !== Object.keys(PAIR_ROUTE_DATA).length) throw new Error("Chaque duo doit avoir un rendez-vous");
  return { pairs: Object.keys(PAIR_ROUTE_DATA).length, combinations, routes, chapters, dates: GROUP_DATES.length, games: Object.keys(GROUP_INTIMACY_GAMES).length };
}

validateGroupIntimacyCatalog();
