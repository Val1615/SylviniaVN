import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { CrossQuestProgress } from "./cross-quests";
import { validAnchorState, type AnchorState } from "./anchor-operation";

export const HR_KEY = "hyleeRemerii";
export const HR_OPEN = "cross-hr-dates-unlocked";

export type HRBeat = {
  intro: DialogueLine[];
  choices: ChoiceData[];
  cast?: string[];
  responseCast?: string[];
};

export type HRScene = HRBeat & {
  id: string;
  title: string;
  location: string;
  spot: string;
  cast: string[];
  beats: HRBeat[];
  music: string;
};

export type HRConfiguration = "waiting" | "separate" | "refused" | "accepted";

export type HRState = {
  branch?: "standard" | "double";
  configuration?: HRConfiguration;
  prepared?: boolean;
  anchor?: AnchorState;
  recognitionDay?: number;
  checkpoint?: { sceneId: string; round: number; picks: string[] };
  choices: Record<string, string[]>;
};

export type HRHydrationEvidence = {
  flags?: string[];
  groupDateHistory?: string[];
};

export const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
export const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
export const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

// Une nouvelle réponse ne peut pas hériter silencieusement de Lucidité.
export const Q = (
  id: string,
  text: string,
  stat: StatKey,
  response: DialogueLine[],
  effects: Effects = {},
): ChoiceData => ({ id, text, stat, response, effects });

export const HR_TITLES = [
  "Après les Serres",
  "Quelque chose dans les relevés",
  "La distance correcte",
  "Ce qu’on dit quand on a peur",
  "Ce qu’on n’a pas su dire",
  "Ce qui existait déjà",
  "Les Trois Points d’Ancrage",
];

export const HR_OBJECTIVES = [
  "Des secousses continuent autour des installations périphériques du portail. Retrouver Hylee et Remerii à Mir’Aldas et examiner les premiers rapports.",
  "Plusieurs témoignages semblent décrire les mêmes perturbations. Comparer les horaires et la géographie pour isoler leur origine réelle.",
  "Trois terrasses pourraient relayer l’activité du portail. Les observer depuis le col, sans approcher l’ouverture ni engager les mécanismes.",
  "Le plan expose Hylee. Rejoindre l’atelier et définir son rôle sans laisser la peur décider à sa place.",
  "La dispute a blessé leur confiance. Revoir Hylee puis Remerii, et leur laisser réparer elles-mêmes ce qui s’est rompu.",
  "La relève du col approche. Les retrouver à la résidence pour préparer le départ et partager un moment ordinaire avant l’opération.",
  "Gagner les terrasses, neutraliser les trois relais et préserver une voie de repli. La progression de l’opération sera conservée.",
];

export const HR_LETTERS = [
  {
    id: "cross-hr-letter-reports",
    stage: 1,
    subject: "Les relevés",
    body: [
      "Les originaux seront à la bibliothèque. Nous cherchons d’abord à savoir si les secousses menacent encore les convois ; personne ne retourne au portail. — Remerii",
      "J’ai réservé les trois presse-papiers avant qu’elle ne le fasse. Prends de quoi écrire au dos des copies. — Hylee",
    ],
  },
  {
    id: "cross-hr-letter-detail",
    stage: 2,
    subject: "La deuxième secousse",
    body: [
      "Le carrier confirme deux secousses. La troisième venait de sa charrette ; il a refait le bruit pour être certain. — Hylee",
      "Elle a également fait sursauter la moitié des archives. Le détail reste utile. Garde l’original. — R.",
    ],
  },
  {
    id: "cross-hr-letter-bag",
    stage: 5,
    subject: "Le sac bleu",
    body: [
      "Nous partons avec les deux cordes. Le sac bleu est réparé et Hylee a ajouté le repère de repli sur notre copie. — Remerii",
      "Par moi. Elle a tenu la boucle et prétend maintenant avoir fait la moitié. Nous mangerons avant de partir ; il y a une troisième assiette. — Hylee",
    ],
  },
  {
    id: "cross-hr-letter-window",
    stage: 6,
    subject: "Le passage du col",
    body: [
      "Le poste nous laissera gagner les terrasses après la relève. Le portail reste hors de portée. Si la voie de retour se ferme, nous nous replions. — Remerii",
      "J’ai essayé les gants. Cette fois je peux fermer les doigts, et elle les a vérifiés seulement deux fois. — Hylee",
    ],
  },
];

export function hrUnlocked(g: {
  flags: string[];
  relationships: Record<string, { stage: number }>;
}) {
  return g.flags.some((flag) => ["main-story-act-1-complete", "main-story-complete"].includes(flag))
    && g.relationships.hylee?.stage >= 5
    && g.relationships.remerii?.stage >= 5;
}

export function hrIndividualIntimacy(flags: string[], person: "hylee" | "remerii") {
  return flags.some((flag) => flag === `home-intimate:${person}` || flag.startsWith(`date-intimate:date-${person}-`));
}

export function createHRProgress(day: number): CrossQuestProgress {
  return {
    id: HR_KEY,
    stage: 0,
    startedDay: day,
    stageStartedDay: day,
    letters: [],
    hr: { choices: {} },
  };
}

function configurationFromChoices(choices: Record<string, string[]>): HRConfiguration | undefined {
  const picked = Object.entries(choices)
    .filter(([sceneId]) => sceneId.startsWith("cross-hr-recognition"))
    .flatMap(([, ids]) => ids)
    .filter((id) => id.startsWith("cross-hr-config-"))
    .at(-1);
  const candidate = picked?.slice("cross-hr-config-".length);
  return ["waiting", "separate", "refused", "accepted"].includes(candidate || "")
    ? candidate as HRConfiguration
    : undefined;
}

export function hrTriadAccepted(
  progress: CrossQuestProgress | undefined,
  evidence: HRHydrationEvidence = {},
) {
  if (!progress?.hr || progress.stage < 7) return false;
  const normalized = hydrateHR(progress, evidence);
  return normalized.hr?.branch === "double" && normalized.hr.configuration === "accepted";
}

export function hydrateHR(
  progress: CrossQuestProgress,
  evidence: HRHydrationEvidence = {},
): CrossQuestProgress {
  const source = progress.hr || { choices: {} };
  const choices = source.choices && typeof source.choices === "object"
    ? Object.fromEntries(Object.entries(source.choices).filter(([, ids]) => Array.isArray(ids) && ids.every((id) => typeof id === "string")))
    : {};
  const canonicalChoice = configurationFromChoices(choices);
  const historyProvesAcceptance = (evidence.groupDateHistory || []).some((id) => id.startsWith("group-date-hylee-remerii-"));
  const flagProvesAcceptance = (evidence.flags || []).includes(HR_OPEN);
  const storedConfiguration = ["waiting", "separate", "refused", "accepted"].includes(source.configuration || "")
    ? source.configuration
    : undefined;
  const acceptanceProved = canonicalChoice === "accepted"
    || storedConfiguration === "accepted"
    || flagProvesAcceptance
    || historyProvesAcceptance;
  const configuration = acceptanceProved ? "accepted" : canonicalChoice || storedConfiguration;
  const branch = source.branch === "double" || source.branch === "standard"
    ? source.branch
    : configuration ? "double" : undefined;
  const normalizedBranch = configuration === "accepted" ? "double" : branch;
  const checkpoint = source.checkpoint
    && typeof source.checkpoint.sceneId === "string"
    && Number.isInteger(source.checkpoint.round)
    && source.checkpoint.round >= -1
    && Array.isArray(source.checkpoint.picks)
    && source.checkpoint.picks.every((pick) => typeof pick === "string")
    ? source.checkpoint
    : undefined;

  return {
    ...progress,
    stage: Math.max(0, Math.min(7, Math.floor(Number(progress.stage) || 0))),
    letters: Array.isArray(progress.letters)
      ? progress.letters.filter((entry) => HR_LETTERS.some((letter) => letter.id === entry.id))
      : [],
    hr: {
      ...source,
      branch: normalizedBranch,
      configuration,
      choices,
      anchor: validAnchorState(source.anchor) ? source.anchor : undefined,
      checkpoint,
    },
  };
}

export function hrAmbient(stage: number): DialogueLine[] {
  if (stage === 4) {
    return [N("La chaise d’Hylee reste vide à l’atelier. Remerii en a retiré les livres par réflexe, puis a posé près du dossier l’écharpe qu’Hylee oublie toujours lorsqu’elle est contrariée.")];
  }
  if (stage === 5) {
    return [N("Hylee pose une boucle sur la table. Remerii rapproche la lampe avant qu’elle le demande. Elles essaient deux trous, échangent le poinçon et reprennent leur couture.")];
  }
  if (stage > 1 && stage < 4) {
    return [N("Une feuille dépasse du livre de Remerii. Hylee la retourne avant qu’elle soit rangée : au dos, une heure manque encore. Remerii lui passe déjà la plume.")];
  }
  return [];
}

const S = (
  id: string,
  title: string,
  spot: string,
  intro: DialogueLine[],
  choices: ChoiceData[],
  beats: HRBeat[] = [],
  cast = ["hylee", "remerii"],
  music = "mage-city",
): HRScene => ({
  id,
  title,
  location: spot.startsWith("rocky-") ? "rocky-spires" : "miraldas",
  spot,
  intro,
  choices,
  beats,
  cast,
  music,
});

export const HR_SCENES: HRScene[] = [
  S(
    "cross-hr-01",
    HR_TITLES[0],
    "miraldas-atelier",
    [
      N("L’incident des Serres est terminé, mais la caisse déposée dans l’atelier prouve que le portail n’a pas cessé d’inquiéter les postes du col. Elle contient des rapports de gardes, deux instruments fendus et de la poussière rouge venue des terrasses périphériques."),
      N("Hylee retient le couvercle avec son genou. Remerii lui tend la pince avant même qu’elle ouvre la main."),
      H("Merci. Le dernier clou tourne dans le bois."),
      R("Comme celui de Rivel. Tu l’avais arraché au couteau et nous avions mangé avec une lame tordue pendant trois jours."),
      H("Tu avais dit que ce couteau était déjà inutilisable."),
      R("J’essayais de sauver notre dîner."),
      N("Le sourire de Remerii disparaît seulement lorsqu’elle déplie le premier rapport. Hylee pose aussitôt le clou dans la coupelle où Remerii range toujours les petites pièces dangereuses."),
      R("Le portail n’a pas été réactivé. En revanche, deux convois et le poste nord signalent des secousses sur les installations extérieures."),
      P("Quelqu’un propose d’y retourner ?"),
      R("Certainement pas. Nous resterons loin de l’ouverture. Je veux savoir si ce qui bouge autour d’elle peut encore mettre la route en danger."),
      H("Et si quelque chose continue de lui répondre, je viens le vérifier avec toi."),
      R("Je savais que tu dirais cela."),
      H("Alors tu as gagné du temps."),
      N("Remerii tire déjà une seconde chaise avec le pied. Hylee s’y installe comme si la place avait toujours été prévue."),
      R("{player}, vous savez lire une carte de convoi et reconnaître un mécanisme bloqué. Hylee et moi nous occuperons de ce qui relève de l’Arcane."),
      N("Trois compétences, aucune invitation à franchir le portail : il faut d’abord comprendre ce qui secoue encore ses terrasses périphériques."),
    ],
    [
      Q(
        "cross-hr-01-order",
        "Classer les rapports par heure et laisser visibles les contradictions.",
        "lucidite",
        [
          P("Je place les faits dans l’ordre. Les hypothèses resteront dans la marge."),
          R("Exactement. Ne corrigez pas les trous pour rendre le récit plus élégant."),
          H("Je prends les convois. Ils écrivent toujours la fin au dos."),
          N("Remerii lui passe le second presse-papier sans regarder. Hylee le rattrape au vol et vous fait une place entre leurs deux piles."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-01-witness",
        "Retrouver les témoins avant de tirer une conclusion.",
        "sangFroid",
        [
          H("Le carrier revient demain chercher son reçu. J’ai gardé son nom."),
          R("Demandez-lui ce qu’il a vu, pas ce qu’on lui a déjà expliqué."),
          P("Ses mots d’abord. Nos conclusions ensuite."),
          N("Remerii acquiesce. Hylee souligne une seule fois le nom dans la marge : leur ancien code pour une piste encore ouverte."),
        ],
        { trust: 1, relationshipEffects: { remerii: { trust: 1 } } },
      ),
      {
        ...Q(
          "cross-hr-01-habit",
          "Leur faire remarquer qu’elles ont déjà organisé trois piles sans se consulter.",
          "audace",
          [
            P("Vous pourriez au moins prétendre que je suis arrivé avant le milieu d’une conversation vieille de plusieurs années."),
            H("Impossible. Elle avait déjà choisi mon presse-papier."),
            R("Tu prends toujours le plus lourd, puis tu te plains de ne plus pouvoir tourner les pages."),
            H("Et tu gardes toujours le léger pour me le donner ensuite."),
            N("Elles se tournent vers vous avec le même sourire coupable. La place entre leurs piles devient officiellement la vôtre."),
          ],
          { affection: 1, desire: 1, relationshipEffects: { remerii: { affection: 1, desire: 1 } } },
        ),
        requiresRelationship: [
          { character: "hylee", stage: 5, affection: 20 },
          { character: "remerii", stage: 5, affection: 20 },
        ],
      },
      Q(
        "cross-hr-01-hero",
        "Assurer que Remerii trouvera seule comment arrêter les secousses.",
        "resonance",
        [
          R("Je ne sais pas encore ce qui les provoque."),
          H("Et elle ne travaille pas seule quand je suis assise juste là."),
          N("Remerii repose le rapport au centre de la table plutôt que devant elle."),
          R("Commençons par ne retirer personne de l’équation."),
        ],
        { trust: -2, relationshipEffects: { remerii: { trust: -1 } } },
      ),
    ],
  ),
  S(
    "cross-hr-02",
    HR_TITLES[1],
    "miraldas-archives",
    [
      N("Les archives ont réservé le bout d’une table aux rapports des Serres. Hylee apporte le reçu du carrier, plié en quatre et taché de farine."),
      H("Il a compté deux secousses. La troisième, c’était sa charrette qui retombait dans une ornière."),
      R("Tu lui as demandé ce qui avait bougé avant les roues ?"),
      H("La rambarde. Puis la chaîne. Il a refait les deux bruits et s’est excusé auprès de la bibliothécaire."),
      R("Je suppose que tu l’as aidé."),
      H("Seulement pour la chaîne."),
      N("Remerii barre un horaire avec un sourire qu’elle tente inutilement de cacher. Une fois le faux signal retiré, plusieurs témoignages cessent de se contredire."),
      P("Le poste nord voyait la terrasse centrale, mais pas celle de gauche. Ce rapport et celui du convoi peuvent parler de la même pulsation."),
      N("Vous posez les deux heures l’une sous l’autre. Hylee déplace le plan ; trois zones périphériques apparaissent, jamais l’ouverture elle-même."),
      R("Les manifestations restent autour du portail. Celle du centre précède les deux autres de quelques instants."),
      H("Pas toujours les deux. Regarde ici : la terrasse orientale répond avant celle de gauche, mais elle continue après."),
      N("Remerii suit son doigt, gomme une flèche et en trace deux. Elle ne défend pas son premier dessin."),
      R("Alors le centre ne commande peut-être pas seul. Ces trois mécanismes pourraient se relayer et maintenir une réponse périphérique."),
      P("Des points d’ancrage ?"),
      R("Une hypothèse, pas encore un nom. Pour la vérifier, nous devons observer les trois terrasses depuis le col et rester hors de portée du portail."),
      H("A, B et C, alors. Des lettres sont plus faciles à corriger qu’une certitude."),
    ],
    [
      Q(
        "cross-hr-02-facts",
        "Séparer sur la carte les observations, les heures et les hypothèses.",
        "lucidite",
        [
          P("Trait plein pour ce qui a été vu, pointillé pour ce que nous supposons."),
          R("Et aucun trait jusqu’au portail tant qu’un rapport ne le justifie."),
          H("Je recopie les trois terrasses. Tu me diras si j’inverse encore l’est et la gauche."),
          R("Tu les inverses seulement quand tu racontes le chemin."),
          H("C’est donc une compétence narrative."),
          N("Le modèle devient lisible sans devenir définitif."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-02-hylee",
        "Suivre l’observation d’Hylee sur la terrasse est.",
        "resonance",
        [
          P("Si C continue après les autres, son rôle n’est pas le même."),
          H("Oui. Elle reçoit peut-être la charge au lieu de la lancer."),
          R("Cela change notre ordre d’observation."),
          N("Remerii retourne son crayon et le tend à Hylee pour qu’elle redessine la flèche elle-même."),
          R("Montre-moi exactement où tu la places."),
        ],
        { affection: 1, trust: 1, relationshipEffects: { remerii: { affection: 1 } } },
      ),
      Q(
        "cross-hr-02-route",
        "Proposer un point d’observation qui garde le chemin de retour visible.",
        "sangFroid",
        [
          P("Le col domine les trois terrasses et laisse le poste derrière nous. Nous n’avons aucune raison de descendre plus bas lors de la reconnaissance."),
          R("C’est la bonne distance."),
          H("Et depuis le rocher fendu, on verra C sans s’approcher de l’ouverture."),
          N("Vous entourez ensemble un trajet qui observe sans engager l’opération."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 1 } } },
      ),
      Q(
        "cross-hr-02-certainty",
        "Rédiger immédiatement un rapport annonçant trois ancrages.",
        "audace",
        [
          R("Écrivez trois terrasses. Le reste serait une conclusion empruntée à demain."),
          H("On a déjà assez de rapports qui se recopient entre eux."),
          N("Vous rayez le mot. Sous la correction, la prochaine étape redevient simple : aller regarder."),
        ],
        { trust: -2, relationshipEffects: { remerii: { trust: -2 } } },
      ),
    ],
  ),
  S(
    "cross-hr-03",
    HR_TITLES[2],
    "rocky-spires-pass",
    [
      N("Depuis le col, le portail n’est qu’une blessure rouge au fond des aiguilles rocheuses. Aucun chemin de votre reconnaissance ne s’en approche. Plus bas, trois terrasses reliées par des passerelles dominent le ravin."),
      R("Nous restons sur le chemin haut. Aujourd’hui, nous regardons ; nous ne touchons à rien."),
      H("Tu as répété la phrase au poste, dans la montée et devant ce rocher."),
      R("Et tu l’as contestée au poste, dans la montée et devant ce rocher."),
      H("Je vérifiais sa solidité."),
      N("Remerii lui remet une mèche sous la capuche, geste bref que le vent défait aussitôt. Hylee rit et lui serre elle-même l’attache du manteau."),
      P("Les poignées sont mécaniques. Une sur chaque palier."),
      H("Les fentes sous les anneaux, elles, ne s’allument pas ensemble."),
      N("Vous notez B, puis C, puis A. Hylee s’avance jusqu’au rocher fendu ; Remerii tend son bâton en travers du sentier sans la toucher."),
      R("Le bord est friable derrière."),
      H("Je reste sur le chemin. J’ai seulement besoin de l’angle que tu viens de me décrire."),
      R("Je vais regarder."),
      H("Tu l’as déjà fait. Laisse-moi voir maintenant."),
      N("Le vieux désaccord est immédiatement reconnaissable : Remerii cherche le danger avant le passage ; Hylee refuse que cette précaution devienne une place assignée."),
      N("Un bruit de chaîne traverse le ravin. Toutes deux se tournent vers les terrasses. La pulsation reprend : B, C, A."),
      P("Le cycle confirme les rapports. On repart avec cela."),
      R("Oui."),
      H("Et demain, on parle de qui fait quoi. Pas seulement d’où tu préférerais me regarder."),
      R("Demain."),
    ],
    [
      Q(
        "cross-hr-03-cycle",
        "Décrire le cycle sans quitter le chemin haut.",
        "lucidite",
        [
          P("B part en premier. C garde la charge plus longtemps. A répond quand les deux passerelles vibrent."),
          H("C aura besoin d’un vrai temps de décharge."),
          R("Et A d’une liaison qu’on puisse interrompre."),
          N("La carte gagne un ordre exploitable sans transformer la reconnaissance en intervention."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-03-space",
        "Laisser Hylee prendre l’angle prévu pendant que vous sécurisez le sentier.",
        "sangFroid",
        [
          P("Je garde le bord et la corde. Hylee peut prendre l’angle sans franchir le rocher."),
          N("Remerii observe le sol, puis abaisse son bâton."),
          R("Trois pas. Tu me dis si la pierre bouge."),
          H("Trois pas. Et je te le dis avant le quatrième."),
          N("Hylee revient avec une lecture plus nette de C. Remerii l’inscrit sous son nom, sans la reformuler."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      {
        ...Q(
          "cross-hr-03-middle",
          "Proposer de rester entre elles pour être surveillé par deux expertes à la fois.",
          "audace",
          [
            P("Je peux rester au milieu. Ainsi, aucune de vous n’aura à prétendre qu’elle surveille seulement le terrain."),
            H("C’est généreux. Elle allait justement vérifier ton nœud une quatrième fois."),
            R("Troisième. Et le vôtre est mal fermé."),
            N("Remerii resserre votre attache. Hylee pose sa main par-dessus la sienne et déclare le contrôle terminé."),
            H("Voilà. Deux expertes satisfaites."),
          ],
          { affection: 1, desire: 2, relationshipEffects: { remerii: { affection: 1, desire: 2 } } },
        ),
        requiresRelationship: [
          { character: "hylee", desire: 12 },
          { character: "remerii", desire: 12 },
        ],
      },
      Q(
        "cross-hr-03-proof",
        "Demander à Hylee une démonstration pour prouver qu’elle peut participer.",
        "resonance",
        [
          H("Je n’ai pas besoin d’un examen improvisé au bord d’un ravin."),
          R("Et je n’ai pas le droit de transformer sa place en récompense après une démonstration."),
          N("Leur accord sur ce point est immédiat. Vous rangez l’idée avec le matériel."),
        ],
        { trust: -3, relationshipEffects: { remerii: { trust: -1 } } },
      ),
    ],
    [],
    ["hylee", "remerii"],
    "tension",
  ),
  S(
    "cross-hr-04",
    HR_TITLES[3],
    "miraldas-atelier",
    [
      N("Trois anneaux de charbon couvrent la table. Les copeaux représentent les positions ; celui d’Hylee attend près du point A depuis qu’elle l’y a posé. Remerii le déplace vers la voie de retour."),
      H("Tu viens encore de me sortir du plan."),
      R("Je t’ai placée là où tu peux maintenir le repli."),
      H("Il n’y a rien à maintenir. Nous l’avons vérifié hier."),
      R("Hier, tu as aussi avancé jusqu’au seul bord friable du col."),
      H("Trois pas sur ton propre trajet. Ne déplace pas le problème."),
      N("Remerii cesse de faire tourner le charbon. Elle connaît ce ton : Hylee ne plaisante plus, même si sa voix reste basse."),
      R("A te rendrait visible depuis les postes. Si quelqu’un comprend ce que tu es capable de faire, nous ne choisirons plus qui l’apprend."),
      H("Je le sais. Je sais aussi que tu ne peux pas tenir A et B en même temps."),
      R("Je trouverai un autre angle."),
      H("Tu as cherché tout le matin. Ton autre angle, c’est moi derrière toi."),
      N("Hylee remet son copeau sur A. Remerii le retient du bout de l’ongle, vieux geste de leurs cartes de voyage qu’Hylee reconnaît aussitôt."),
      H("Tu fais ça quand tu as déjà décidé et que tu veux encore avoir l’air de réfléchir."),
      R("Et tu frottes ton pouce quand tu vas me promettre que tout ira bien."),
      H("Je ne te promets pas ça. Je te promets de dire quand je ne tiens plus. C’est toi qui m’as appris à reconnaître la limite."),
      R("Une limite reconnue trop tard reste une chute."),
      H("Alors aide-moi à préparer le repli. Ne m’efface pas avant que nous soyons parties."),
    ],
    [
      Q(
        "cross-hr-04-breathe",
        "Poser le charbon et laisser quelques secondes au silence.",
        "sangFroid",
        [
          P("Le plan peut attendre un instant."),
          N("Vous retirez le charbon de la main de Remerii et le posez entre les deux copeaux. Personne ne parle. Hylee cesse enfin de frotter son pouce ; Remerii regarde ce geste disparaître."),
          R("Je t’entends. Je ne sais pas encore le faire sans avoir peur."),
          H("Tu peux commencer par ne pas appeler ta peur un plan."),
        ],
        { trust: 1, relationshipEffects: { remerii: { trust: 1 } } },
      ),
      Q(
        "cross-hr-04-risk",
        "Revenir aux durées, aux limites et au signal de repli proposés par Hylee.",
        "lucidite",
        [
          P("Elle a donné une durée, un signe d’alerte et une sortie. On peut vérifier ces trois éléments sans décider à sa place."),
          R("Une durée annoncée n’empêche pas la panique."),
          H("Non. Mais c’est la méthode que tu exiges de toi-même. Laisse-moi au moins l’utiliser."),
          N("Remerii regarde le plan, puis sa main toujours posée sur le copeau d’Hylee."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 1 } } },
      ),
      Q(
        "cross-hr-04-fear",
        "Nommer la peur de Remerii sans répondre à la place d’Hylee.",
        "resonance",
        [
          P("Vous avez peur de la perdre. Hylee vous demande ce que cette peur change au plan, pas qu’on la fasse disparaître."),
          H("Je peux entendre que tu as peur."),
          R("Et si je n’arrive pas à distinguer ma peur du risque ?"),
          H("Alors tu me le dis. Tu ne me ranges pas derrière en appelant ça une conclusion."),
        ],
        { affection: 1, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-04-arbitrate",
        "Trancher que l’expérience de Remerii doit l’emporter.",
        "audace",
        [
          H("Alors pourquoi m’avoir demandé de construire ce plan ?"),
          R("Je ne vous ai pas demandé de décider pour moi, {player}."),
          N("Pour la première fois de la dispute, elles se tournent toutes deux contre votre intervention. L’accord ne répare pourtant rien entre elles."),
        ],
        { trust: -3, relationshipEffects: { remerii: { trust: -2 } } },
      ),
    ],
    [
      {
        intro: [
          R("Tu parles de rester seule si le sort cède comme si tu savais déjà ce que c’est. Tu n’as jamais eu à appeler dans le vide en comprenant que personne ne viendrait.", "strict"),
          N("La phrase tombe avec une précision dont Remerii mesure l’horreur une seconde trop tard. Elle connaît l’auberge, les départs et les portes derrière lesquelles Hylee a attendu."),
          H("Tu sais où tu m’as trouvée.", "sad"),
          R("Oui."),
          H("Alors ne me dis jamais que je ne connais pas le vide."),
          N("Hylee prend ses gants. Remerii lâche enfin le copeau, mais Hylee ne le ramasse pas."),
          R("Hylee, je—"),
          H("Pas maintenant."),
          N("Elle ferme la porte sans la claquer. Remerii reconnaît aussi ce geste : Hylee ne veut pas détruire la pièce, seulement en sortir avant que la colère ne le fasse à sa place."),
        ],
        responseCast: ["remerii"],
        choices: [
          Q(
            "cross-hr-04-after-truth",
            "Dire seulement que cette phrase l’a blessée.",
            "resonance",
            [
              P("Vous saviez où frapper. Elle aussi."),
              R("Oui."),
              N("Remerii frotte le bord de sa manche, tic qu’elle cache d’ordinaire dès qu’Hylee le remarque."),
              R("Je lui parlerai moi-même. Pas pour expliquer la phrase. Pour en répondre."),
            ],
            { relationshipEffects: { remerii: { trust: 1 } } },
          ),
          Q(
            "cross-hr-04-after-space",
            "Laisser le registre et partir sans prolonger la dispute.",
            "sangFroid",
            [
              N("Vous posez le registre près du copeau d’Hylee. Remerii ne vous demande ni de transmettre un message ni de la défendre."),
              R("Je viendrai quand elle aura choisi de m’entendre."),
              N("Elle remet le copeau sur A avant que vous quittiez l’atelier."),
            ],
          ),
        ],
      },
    ],
    ["hylee", "remerii"],
    "imperial-lament-instrumental",
  ),
  S(
    "cross-hr-05",
    HR_TITLES[4],
    "miraldas-quarters",
    [
      N("Hylee répare une couture près de la fenêtre. Elle vous montre la chaise du menton ; l’aiguille a déjà traversé deux fois le même trou."),
      H("Elle t’envoie ?", "sad"),
      P("Non."),
      H("Tant mieux. Elle déteste faire porter ses excuses par quelqu’un d’autre. Moi aussi."),
      N("Elle défait le point inutile, reprend le fil et vous tend le bord du tissu sans demander si vous savez le tenir."),
      H("Je sais qu’elle a eu peur. Je l’ai vue vérifier trois fois mes gants et faire semblant de chercher autre chose."),
      P("Tu connais ses détours."),
      H("Presque tous. Elle connaît les miens aussi. C’est justement pour ça que sa phrase a fait mal."),
      N("Hylee tire doucement sur la couture. Cette fois, le bord reste droit."),
      H("Je veux lui parler. Je ne veux pas que tu répares la conversation avant son arrivée."),
    ],
    [
      Q(
        "cross-hr-05-company",
        "Lui demander quelle compagnie elle souhaite en attendant.",
        "resonance",
        [
          P("Je peux rester, partir ou simplement tenir ce bord."),
          H("Tiens le bord. Et reste jusqu’à ce qu’elle arrive."),
          N("Vous suivez la couture sans chercher une phrase de plus. Hylee reprend un second point seulement lorsqu’elle le choisit."),
        ],
        { trust: 2 },
      ),
      Q(
        "cross-hr-05-no-message",
        "Respecter son refus de recevoir un message indirect.",
        "sangFroid",
        [
          P("Je ne parlerai pas pour elle. Je peux seulement ouvrir quand elle frappera."),
          H("Ça me va."),
          N("Hylee laisse retomber ses épaules. Le silence suivant n’est pas confortable, mais il lui appartient."),
        ],
        { trust: 1 },
      ),
      Q(
        "cross-hr-05-excuse",
        "Expliquer que Remerii tient trop à elle pour avoir voulu la blesser.",
        "lucidite",
        [
          H("Moi aussi je tiens à elle. Ça ne transforme pas sa phrase en accident sans conséquence."),
          P("Tu as raison. J’essayais d’aller trop vite."),
          H("Alors aide-moi en ne finissant pas l’histoire avant nous."),
        ],
        { trust: -2 },
      ),
    ],
    [
      {
        cast: ["remerii"],
        intro: [
          N("Remerii arrive avec le registre sous le bras. Elle reste près de la porte et frotte le bord de sa manche. Hylee avait prédit le geste avant même d’entendre ses pas."),
          R("Elle est ici ?"),
          P("Oui."),
          R("Je sais ce que je dois corriger dans le plan. Pour le reste, chaque phrase que j’ai préparée ressemble à une défense."),
          N("Elle pose le registre sur le banc, hors de ses mains, puis attend."),
        ],
        choices: [
          Q(
            "cross-hr-05-door",
            "Ouvrir, puis leur laisser l’espace de se parler.",
            "sangFroid",
            [
              P("Elle veut bien vous entendre. Je vais ouvrir ; les mots seront les vôtres."),
              R("Merci."),
              N("Remerii vérifie par réflexe que le registre reste sur le banc, puis entre sans le reprendre."),
            ],
            { relationshipEffects: { remerii: { trust: 2 } } },
          ),
          Q(
            "cross-hr-05-simple",
            "Lui demander la première phrase sans justification.",
            "resonance",
            [
              P("Quelle phrase reste si vous retirez toutes les explications ?"),
              R("J’ai été cruelle avec quelqu’un que j’aime."),
              P("Commencez par ce que vous êtes prête à lui dire."),
              R("J’ai été cruelle. Le reste lui appartient autant qu’à moi."),
            ],
            { relationshipEffects: { remerii: { trust: 1 } } },
          ),
        ],
      },
      {
        cast: ["hylee", "remerii"],
        intro: [
          N("Hylee ouvre. Son regard va de la manche froissée de Remerii au registre abandonné sur le banc."),
          H("Tu frottes encore le tissu."),
          R("Depuis l’escalier."),
          H("Je sais."),
          N("Cette évidence ancienne les place face à face sans vous demander de devenir arbitre."),
          R("Ce que je t’ai dit était cruel. Je connaissais assez ton histoire pour comprendre exactement ce que ma phrase nierait. J’ai eu peur, et j’ai utilisé cette peur pour te faire reculer."),
          H("Tu pensais vraiment que je ne savais pas ce que c’était d’attendre seule ?", "sad"),
          R("Non. Je savais le contraire. C’est pour cela que je ne chercherai aucune excuse."),
          N("Hylee garde une main sur la poignée. Remerii ne s’avance pas."),
          H("La prochaine fois, dis-moi que tu as peur."),
          R("Même si cela me rend insupportable ?"),
          H("Tu es déjà insupportable. Ce sera seulement plus honnête."),
          N("Le rire de Remerii arrive trop court et trop fragile, mais Hylee le laisse revenir. Elle quitte enfin le seuil."),
          R("Pour le plan : tu tiens A. Nous fixons ensemble un mot de repli. Si tu le prononces, je reprends sans discuter. Si je panique avant, je te le dis au lieu de déplacer ton copeau."),
          H("Le mot sera ‘bleu’. Tu détestes le sac bleu, tu ne pourras pas prétendre ne pas l’avoir entendu."),
          R("Je déteste sa boucle. Le sac n’y est pour rien."),
          N("Hylee s’approche, remet correctement l’épingle qui glissait dans les cheveux de Remerii et laisse ses doigts une seconde contre sa tempe."),
          H("Alors répare-la avec moi."),
          N("Remerii prend le poinçon ; Hylee apporte le sac. Leur tendresse revient par une tâche commune, pas par une conclusion parfaite."),
        ],
        choices: [
          Q(
            "cross-hr-05-plan",
            "Apporter la carte et leur laisser redessiner le repli.",
            "lucidite",
            [
              N("Vous posez la carte sans toucher aux copeaux. Hylee dessine l’endroit où sa glace peut céder ; Remerii ajoute le passage par lequel elle la relayera."),
              H("Ici, tu attends mon mot."),
              R("Ici, je te fais confiance avant de le craindre."),
              N("Le plan porte leurs deux écritures et votre itinéraire mécanique entre les terrasses."),
            ],
            { trust: 1, relationshipEffects: { remerii: { trust: 1 } } },
          ),
          Q(
            "cross-hr-05-tea",
            "Leur proposer de laisser la carte fermée jusqu’à demain.",
            "resonance",
            [
              H("Demain. J’ai assez parlé pour ce soir."),
              R("D’accord."),
              N("Vous apportez de l’eau chaude. Hylee garde le sac sur ses genoux ; Remerii répare la boucle pendant qu’elles discutent enfin d’autre chose."),
            ],
            { affection: 1, relationshipEffects: { remerii: { affection: 1 } } },
          ),
        ],
      },
    ],
    ["hylee"],
    "imperial-lament-instrumental",
  ),
  S(
    "cross-hr-06",
    HR_TITLES[5],
    "miraldas-quarters",
    [
      N("La relève du col n’est pas encore passée. Les sacs attendent près de la porte et une marmite refroidit sur la table. Hylee retire la longue épingle prise dans les cheveux de Remerii ; celle-ci incline la tête sans interrompre sa lecture."),
      H("Tu l’as encore passée à travers deux mèches."),
      R("Elle tenait."),
      H("C’est ta défense depuis la route de Rivel."),
      R("À Rivel, tu avais perdu les deux tiennes."),
      H("Je les avais prêtées."),
      R("À un rideau."),
      N("L’épingle cède. Hylee la pose hors de portée du bol et va chercher une troisième assiette."),
      P("Je tombe au milieu du repas ?"),
      H("Au bon moment. Sinon elle relit le billet jusqu’à ce que la soupe soit froide."),
      R("Le précédent annonçait une autre heure."),
      H("Et je te l’ai lu pendant que tu mangeais. Je peux encore accomplir cet exploit."),
      N("Remerii plie enfin le papier. Hylee lui sert la partie la moins épaisse, puis racle le fond pour elle-même."),
      R("Tu fais encore cela."),
      H("Tu laisses tous les morceaux."),
      R("Je pourrais changer d’avis."),
      H("Essaie."),
      N("Remerii prend un morceau directement dans la cuillère d’Hylee. Elles se regardent une seconde de trop pour que le geste soit seulement pratique, puis Hylee pose sa main sur son épaule en rejoignant sa place."),
      H("On attendait déjà les mauvaises nouvelles comme ça avant de te connaître. Pas les mêmes nouvelles."),
      R("Et pas toujours assez de bols."),
      H("Tu pouvais en acheter un deuxième."),
      R("Je n’avais pas prévu que tu resterais aussi près du mien."),
    ],
    [
      Q(
        "cross-hr-06-memories",
        "Partager le repas et leur demander comment elles occupaient ces attentes.",
        "resonance",
        [
          H("Je lui posais des questions jusqu’à ce qu’elle prétende avoir besoin de silence."),
          R("J’avais réellement besoin de silence."),
          H("Tu répondais quand même."),
          R("Tu laissais très peu de place au doute."),
          N("Vous vous servez. Le billet reste plié pendant qu’elles se disputent doucement le souvenir d’une auberge où la pluie entrait par le toit."),
        ],
        { affection: 1, relationshipEffects: { remerii: { affection: 1 } } },
      ),
      Q(
        "cross-hr-06-hearth",
        "Prendre la marmite et proposer de réchauffer ce qui reste.",
        "sangFroid",
        [
          R("Il y a encore assez de braises."),
          H("Je viens. La poignée tourne."),
          N("Remerii tend déjà un linge à Hylee. Celle-ci le prend, effleure son poignet et vous aide à porter la marmite."),
          R("Je surveille les bols."),
          H("Elle veut dire qu’elle en garde trois."),
        ],
        { trust: 1, relationshipEffects: { remerii: { trust: 1 } } },
      ),
      {
        ...Q(
          "cross-hr-06-conspiracy",
          "Les accuser de s’être liguées pour vous donner le bol le plus rempli.",
          "audace",
          [
            P("Je reconnais une opération coordonnée. Vous m’avez donné la meilleure part sans même vous consulter."),
            H("Elle a choisi le bol."),
            R("Tu as choisi la portion."),
            P("Donc je suis bien victime de deux personnes très organisées."),
            N("Hylee se penche pour goûter votre soupe. Remerii reprend la cuillère dans sa main, en goûte à son tour et conclut avec un calme suspect qu’elle est effectivement meilleure."),
            H("On recommencera."),
          ],
          { affection: 2, desire: 2, relationshipEffects: { remerii: { affection: 2, desire: 2 } } },
        ),
        requiresRelationship: [
          { character: "hylee", desire: 15 },
          { character: "remerii", desire: 15 },
        ],
      },
      Q(
        "cross-hr-06-label",
        "Exiger qu’elles donnent un nom définitif à ce qui existe entre elles.",
        "lucidite",
        [
          H("On t’a raconté des routes, des repas et des disputes. Le reste n’a pas toujours eu besoin d’un titre."),
          R("Et nous ne vous devons pas une conclusion avant d’avoir fini de la vivre."),
          N("Vous revenez au repas. Elles vous gardent une place, mais pas le droit de réduire leur histoire à une définition commode."),
        ],
        { trust: -2, relationshipEffects: { remerii: { trust: -2 } } },
      ),
    ],
    [],
    ["hylee", "remerii"],
    "two-stars-night",
  ),
];

const DOUBLE_BEAT: HRBeat = {
  intro: [
    N("Lorsque les bols sont vides, Hylee reste près de Remerii. Elle fait tourner l’épingle entre ses doigts, puis la remet elle-même dans ses cheveux."),
    H("Je vais dire quelque chose sans demander qu’on décide quoi que ce soit ce soir."),
    R("Cette introduction ne te ressemble pas."),
    H("Laisse-moi profiter de l’effort."),
    N("Remerii ferme la bouche avec un sourire. Hylee garde deux doigts sur son épingle."),
    H("J’ai envie de retrouver {player}. Toi aussi."),
    R("Oui."),
    H("Et je n’ai pas envie que nous fassions semblant de découvrir cela séparément."),
    R("Non."),
    H("Tu pourrais développer un peu."),
    R("Je pourrais. Mais tu sais déjà quand je regarde {player}, et {player} vient de nous voir partager une cuillère pendant tout un repas."),
    N("Hylee rougit, puis rit. Remerii lui prend la main avant qu’elle recommence à torturer l’épingle."),
    R("Ce qui existe entre nous ne disparaît pas. Ce que nous ressentons pour {player} non plus. C’est tout ce que je suis prête à constater avant une opération."),
    H("C’était presque développé."),
    N("Elles se tournent vers vous, non pour obtenir une décision, mais pour vous laisser une place dans ce constat."),
  ],
  choices: [
    Q(
      "cross-hr-06-double-playful",
      "Faire remarquer que leurs dénégations sont remarquablement coordonnées.",
      "audace",
      [
        P("Vous dites ‘constater’ avec l’air de deux personnes qui ont préparé la même dénégation."),
        H("Je n’ai rien préparé."),
        R("C’est précisément ce qu’elle avait prévu de dire."),
        N("Hylee donne un coup d’épaule à Remerii. Elles se liguent aussitôt pour vous reprocher votre sourire, sans lâcher vos mains lorsqu’elles les trouvent."),
      ],
      { affection: 1, desire: 3, relationshipEffects: { remerii: { affection: 1, desire: 3 } } },
    ),
    Q(
      "cross-hr-06-double-gentle",
      "Leur dire que leur lien compte autant que ce que vous ressentez pour chacune.",
      "resonance",
      [
        P("Je ne veux pas entrer entre vous. J’ai envie de découvrir s’il existe une place avec vous."),
        H("C’est aussi la question que j’essayais de ne pas poser."),
        R("Alors gardons-la entière jusqu’à notre retour."),
        N("Remerii pose sa main sur celle d’Hylee. Vous couvrez les deux, sans promettre encore la forme que prendra cette proximité."),
      ],
      { trust: 2, affection: 1, relationshipEffects: { remerii: { trust: 2, affection: 1 } } },
    ),
    Q(
      "cross-hr-06-double-space",
      "Laisser le constat exister sans lui demander une conclusion avant le départ.",
      "sangFroid",
      [
        P("Je l’entends. Nous n’avons pas besoin de décider davantage ce soir."),
        R("Merci."),
        H("Après les Serres, on pourra au moins choisir une journée où personne ne porte un sac bleu."),
        N("La conversation revient au départ. Ce qui vient d’être reconnu ne se referme pas pour autant."),
      ],
      { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
    ),
  ],
};

export function hrQuestScene(stage: number, hr: HRState): HRScene | undefined {
  if (stage < 6) {
    const scene = HR_SCENES[stage];
    return scene && stage === 5 && hr.branch === "double"
      ? { ...scene, beats: [...scene.beats, DOUBLE_BEAT] }
      : scene;
  }
  if (stage !== 6) return undefined;

  if (!hr.anchor?.result || hr.anchor.result === "retreat") {
    return S(
      "cross-hr-07-prepare",
      HR_TITLES[6],
      "rocky-spires-pass",
      [
        N("Le poste vous laisse passer à la relève. Au-delà du dernier abri, les trois terrasses plongent dans la brume. Le portail reste loin au-dessus et aucune étape de l’opération ne mène jusqu’à lui."),
        R("B donne le premier rythme. Je retiens sa charge. Hylee prend A après la décharge de C."),
        H("Et je dis ‘bleu’ si je ne tiens plus."),
        R("Je reprends alors la liaison sans discuter."),
        H("Tu peux hésiter avant. Tu n’as simplement pas le droit de décider à ma place pendant."),
        R("Je sais."),
        N("Remerii vérifie une dernière fois le gant d’Hylee, puis lui offre sa paume plutôt que d’en reprendre la boucle. Hylee la serre."),
        P("Je manœuvre les verrous, lis les repères et garde la voie de retour. Aucun sort de substitution."),
        R("Exactement. Deux incidents imposent le repli. Les relevés seront conservés et nous reprendrons depuis une nouvelle tentative."),
        H("Et si je dis que je tiens le dernier cycle ?"),
        N("Remerii la regarde assez longtemps pour que l’ancienne peur soit visible."),
        R("Alors je te crois. Un cycle, et j’attends votre signal."),
      ],
      [
        Q(
          "cross-hr-07-ready",
          "Vérifier la corde, les poignées et le signe de repli avant d’avancer.",
          "sangFroid",
          [
            N("Vous contrôlez chaque point sans vous presser. Le nœud tient, les poignées répondent et le chemin du col reste libre."),
            H("Je vous vois tous les deux."),
            R("Je suis en place."),
            P("On commence."),
          ],
          { trust: 1, relationshipEffects: { remerii: { trust: 1 } } },
        ),
      ],
      [],
      ["hylee", "remerii"],
      "serres-operation",
    );
  }

  return S(
    "cross-hr-07-return",
    HR_TITLES[6],
    "rocky-spires-pass",
    [
      N(hr.anchor.result === "pressure"
        ? "Un bord du relevé a brûlé pendant l’incident, mais les heures du dernier cycle restent lisibles. Derrière vous, les trois relais sont éteints."
        : "Les cinq phases du cycle sont consignées. Derrière vous, les trois relais restent silencieux."),
      N("Le portail luit encore au fond de la montagne. Vous n’avez pas prétendu l’anéantir : vous avez empêché ses installations périphériques de continuer à lui répondre."),
      H("J’ai les doigts engourdis."),
      N("Remerii s’arrête. Hylee ouvre et ferme les mains devant elle avant que l’inquiétude ne redevienne un ordre."),
      H("Ça revient. Je peux marcher."),
      R("D’accord."),
      N("Elle attend qu’Hylee remette son gant, puis reprend le chemin à sa hauteur."),
      H("Sur le dernier cycle, tu as voulu reprendre."),
      R("Oui."),
      H("Mais tu ne l’as pas fait."),
      R("Tu avais dit que tu tenais."),
      N("Hylee lui prend le bras. Remerii laisse enfin sortir son souffle et pose brièvement son front contre sa tempe."),
      P("Le poste voudra les heures."),
      H("Il les aura. Ensuite, je choisis ce qu’on mange."),
      R("Cette fois, je mangerai les morceaux."),
      H("Je veux voir ça."),
    ],
    [
      Q(
        "cross-hr-07-report",
        "Confier les relevés au poste et organiser la surveillance suivante.",
        "lucidite",
        [
          N("Le garde recopie les heures et marque les trois terrasses comme neutralisées. Vous lui laissez également les signes annonçant un nouveau cycle."),
          R("Ils pourront évacuer la passerelle avant une reprise."),
          H("Et nous saurons ce qui a recommencé, au lieu de courir jusqu’ici sur une rumeur."),
          N("Vous repartez avec un problème circonscrit et un poste mieux préparé."),
        ],
        { trust: 2, relationshipEffects: { remerii: { trust: 2 } } },
      ),
      Q(
        "cross-hr-07-rest",
        "Proposer une pause où chacune peut enfin relâcher sa vigilance.",
        "resonance",
        [
          H("Oui. Là, je veux bien m’asseoir."),
          N("Remerii dégage une pierre plate et s’installe près d’elle. Hylee pose la tête sur son épaule ; Remerii lui tient le gant retiré plutôt que de lui reprendre la main."),
          R("Quelques minutes."),
          N("Vous vous asseyez de l’autre côté. Lorsque Hylee annonce d’elle-même que la chaleur est revenue, Remerii la croit encore."),
        ],
        { affection: 2, relationshipEffects: { remerii: { affection: 2 } } },
      ),
      {
        ...Q(
          "cross-hr-07-no-plan",
          "Réclamer un repas où aucune d’elles n’a le droit d’apporter de carte.",
          "audace",
          [
            P("Je pose une condition au repas : aucune carte, aucun relevé, et personne ne me laisse seul avec le sac bleu."),
            H("J’accepte si Remerii promet de ne pas choisir les trois plats à l’avance."),
            R("Je peux n’en choisir que deux."),
            N("Elles se rapprochent de vous pour descendre. Hylee prend une poignée du sac, Remerii l’autre, et vous laisse celle du milieu."),
          ],
          { affection: 1, desire: 2, relationshipEffects: { remerii: { affection: 1, desire: 2 } } },
        ),
        requiresRelationship: [
          { character: "hylee", affection: 20 },
          { character: "remerii", affection: 20 },
        ],
      },
    ],
    [],
    ["hylee", "remerii"],
    "wild-calm",
  );
}

function recognitionPrelude(hr: HRState, waiting: boolean): DialogueLine[] {
  if (waiting) {
    return [
      N("Hylee vous garde la même chaise. Cette fois, aucune relève du col ne permet de remettre la réponse à demain."),
      H("Tu nous avais demandé du temps. Est-ce que tu sais un peu mieux où tu en es ?"),
    ];
  }
  const picks = hr.choices["cross-hr-06"] || [];
  if (picks.includes("cross-hr-06-double-playful")) {
    return [
      N("Le matériel est rendu. Hylee a posé trois tasses sur la table ; Remerii affirme que leur disposition n’a rien de coordonné."),
      H("Elle a préparé la même dénégation que l’autre soir."),
      R("Et toi, la même accusation."),
    ];
  }
  if (picks.includes("cross-hr-06-double-gentle")) {
    return [
      N("Le matériel est rendu. Hylee et Remerii ont gardé entre elles la place dont vous aviez parlé avant le départ : ni entre leur histoire, ni en dehors d’elle."),
    ];
  }
  return [
    N("Le matériel est rendu et les relevés déposés. Trois boissons attendent à la résidence ; aucun rapport n’est ouvert devant Remerii."),
  ];
}

export function hrRecognition(hr: HRState, waiting = false): HRScene {
  return S(
    waiting ? "cross-hr-recognition-later" : "cross-hr-recognition",
    "Une place à la table",
    "miraldas-quarters",
    [
      ...recognitionPrelude(hr, waiting),
      H("J’ai envie qu’on se revoie tous les trois, exprès. Sans portail, sans plan et sans prétendre que ce serait seulement deux rendez-vous posés côte à côte."),
      R("J’en ai envie aussi."),
      N("Hylee la regarde, surprise par la réponse sans détour. Remerii hausse légèrement un sourcil."),
      R("Tu m’as reproché de ne pas développer. J’ai commencé par l’essentiel."),
      H("Continue."),
      R("Ce qui existe entre nous compte. Ce que je ressens pour {player} aussi. Je voudrais découvrir une forme où personne ne devient l’invitée de la relation des deux autres."),
      N("Hylee prend sa main sur la table. Remerii la serre, puis tourne vers vous son autre paume, ouverte."),
      H("On peut essayer une journée. Pas décider de toute notre vie avant d’avoir choisi où manger."),
      R("Et vous pouvez préférer nous voir séparément. La réponse ne réécrira pas ce que nous avons déjà partagé."),
    ],
    [
      {
        ...Q(
          "cross-hr-config-accepted",
          "Proposer une première journée ensemble.",
          "audace",
          [
            P("Oui. Une journée à trois, et on découvrira ce qui nous ressemble au lieu de le décider d’avance."),
            H("J’ai déjà une idée."),
            R("Garde-la jusqu’à ce que nous ayons fini de boire."),
            H("D’accord. Mais pas de registre."),
            N("Remerii acquiesce. Hylee glisse sa main entre les vôtres, puis attire celle de Remerii par-dessus."),
          ],
          { affection: 2, desire: 2, relationshipEffects: { remerii: { affection: 2, desire: 2 } } },
        ),
        requiresRelationship: [
          { character: "hylee", stage: 5, trust: 22, affection: 22 },
          { character: "remerii", stage: 5, trust: 22, affection: 22 },
        ],
      },
      Q(
        "cross-hr-config-separate",
        "Préférer continuer vos relations séparément.",
        "resonance",
        [
          H("D’accord. Je voudrais quand même te revoir."),
          R("Moi aussi. Et cela ne change rien à ce que nous sommes l’une pour l’autre."),
          N("Leurs mains restent jointes. La place qu’elles vous avaient gardée redevient une chaise d’amitié, sans punition ni promesse forcée."),
        ],
      ),
      Q(
        "cross-hr-config-waiting",
        "Demander encore un peu de temps.",
        "sangFroid",
        [
          R("Prenez-le. Nous ne vous demanderons pas de recommencer toute cette conversation."),
          H("Reviens demain ou plus tard. Tu nous diras seulement où tu en es."),
          N("Vous restez finir votre boisson. La table ne se vide pas à cause de votre hésitation."),
        ],
      ),
      Q(
        "cross-hr-config-refused",
        "Dire que vous ne souhaitez pas de rendez-vous à trois.",
        "lucidite",
        [
          H("Merci de le dire clairement."),
          R("Nous n’en ferons pas la condition de nos autres rencontres."),
          N("La conversation passe au repas du lendemain. Leur lien continue devant vous sans demander à votre refus de le valider ou de l’effacer."),
        ],
      ),
    ],
    [],
    ["hylee", "remerii"],
    "two-stars-night",
  );
}
