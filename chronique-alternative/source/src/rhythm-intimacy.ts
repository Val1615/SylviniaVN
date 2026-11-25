import type { DialogueLine } from "./game-data";

/*
 * Jeu de rythme intime · textes (prototype, une scène).
 *
 * Scène : Hylee, intimité au logis, parcours homme, mood « audacieuse »
 * (route « hylee-home-homme-audacieuse »), réglage Explicite. Le jeu remplace
 * la séquence « climax » écrite : il s'ouvre juste après l'intensification
 * (Hylee vous chevauche dans la chambre, une étoile de givre sur le photophore)
 * et rend la main à l'après-climax, qui affiche la CG post-orgasme.
 *
 * Chaque section correspond à une position. Ses trois paliers se débloquent par
 * la justesse du joueur et décrivent l'acte à mesure que la cadence monte. Des
 * lignes courtes suivent les coups eux-mêmes, et les répliques d'Hylee montent
 * en intensité avec la jauge de plaisir.
 * Aucune ligne n'est recyclée d'une autre scène.
 */

export type RhythmSectionText = {
  label: string;
  cadence: string;
  intimateMood: string;
  intro: DialogueLine;
  tiers: [DialogueLine, DialogueLine, DialogueLine];
  /** Lignes courtes qui accompagnent les coups, dans l'ordre (une toutes les quelques poussées). */
  strokes: DialogueLine[];
  /** Répliques brèves d'Hylee, de plus en plus intenses à mesure que la jauge monte. */
  voice: DialogueLine[];
};

export type RhythmSceneText = {
  id: string;
  routeId: string;
  title: string;
  instruction: string;
  controls: { keyboard: string; touch: string };
  sections: RhythmSectionText[];
  teases: DialogueLine[];
  conclusions: Record<"embrasement" | "accord" | "tatonnement", { title: string; lines: DialogueLine[] }>;
};

const N = (text: string, intimateMood?: string): DialogueLine => ({ speaker: "Narration", text, ...(intimateMood ? { intimateMood } : {}) });
const H = (text: string, intimateMood: string, mood?: string): DialogueLine => ({ speaker: "Hylee", text, intimateMood, ...(mood ? { mood } : {}) });

export const HYLEE_HOME_RHYTHM: RhythmSceneText = {
  id: "rythme-hylee-logis-audacieuse",
  routeId: "hylee-home-homme-audacieuse",
  title: "Au rythme du givre",
  instruction: "Suivez ses va-et-vient : un coup à chaque battement, quand la note touche le cercle. Gardez l'appui quand elle vous retient au fond, glissez quand elle change de position. La cadence accélère jusqu'au bout.",
  controls: {
    keyboard: "Espace, J ou F : toucher et maintenir · ← → : glisser · Échap : pause",
    touch: "Touchez n'importe où : toucher · gardez le doigt : maintenir · balayez : glisser",
  },
  sections: [
    {
      label: "Elle mène",
      cadence: "lente",
      intimateMood: "seductive",
      intro: N("Hylee ralentit exprès. Elle descend sur vous jusqu'au bout, s'arrête là, puis remonte avec une lenteur qui ressemble à une provocation.", "seductive"),
      tiers: [
        N("Chaque fois que vous restez au fond, elle serre les genoux contre vos flancs et laisse filer un souffle étonné, comme si elle découvrait la profondeur du geste.", "seductive"),
        H("Comme ça. Ne bouge plus... Voilà. Maintenant, tu me suis.", "teasing", "teasing"),
        N("Ses hanches roulent en longues vagues. Sur le photophore, une dentelle de givre s'étend au même tempo que celui que vous lui rendez.", "seductive"),
      ],
      strokes: [
        N("Elle descend. Lentement. Jusqu'au bout."),
        N("Un temps immobile, puis elle remonte."),
        N("Ses doigts s'ouvrent sur votre torse."),
        N("Encore une fois, toute la longueur."),
        N("Le lit grince, à peine."),
        N("Son souffle s'accroche au vôtre."),
      ],
      voice: [
        H("Doucement...", "seductive"),
        H("Tu le sens, là ?", "teasing"),
        H("Mmh. Reste avec moi.", "seductive"),
        H("Oui... comme ça.", "tender"),
      ],
    },
    {
      label: "Dos tourné",
      cadence: "plus vive",
      intimateMood: "teasing",
      intro: N("Sans vous quitter, Hylee pivote sur vous. Elle vous tourne le dos, pose les mains sur vos genoux et vous offre la cambrure de ses reins dans la lumière bleue.", "teasing"),
      tiers: [
        N("Vos mains trouvent ses hanches. Elle s'abaisse en mesure, plus vite, et chaque reprise fait frémir la ligne de son dos jusqu'à la nuque.", "teasing"),
        H("Tu vois mieux d'ici ? Moi, je sens tout. C'est injuste, et j'adore ça.", "teasing", "teasing"),
        N("Le va-et-vient devient une danse serrée. Elle se cambre, vous garde enfoui en elle quand l'envie l'en prend et rit tout bas quand vous tenez la mesure.", "seductive"),
      ],
      strokes: [
        N("Ses reins se creusent à chaque reprise."),
        N("Vos mains guident ses hanches."),
        N("La peau claque, plus franche."),
        N("Elle revient sur vous, chaque fois plus vite."),
        N("Sa nuque ploie, ses cheveux glissent."),
        N("Un frisson court le long de son dos."),
      ],
      voice: [
        H("Ah... plus vite.", "teasing"),
        H("Ne lâche pas mes hanches.", "seductive"),
        H("Là. Encore là.", "seductive"),
        H("Tu vas me rendre folle...", "tender"),
      ],
    },
    {
      label: "Renversée",
      cadence: "rapide",
      intimateMood: "tender",
      intro: N("Hylee bascule sur le côté en vous entraînant. Vous roulez ensemble, et c'est elle qui vous attire au-dessus d'elle, les chevilles nouées dans votre dos.", "tender"),
      tiers: [
        N("Vous reprenez le rythme qu'elle vient de vous apprendre. Ses talons pressent vos reins pour réclamer davantage, et vous accélérez sans rien perdre de l'ampleur.", "tender"),
        H("Plus fort... non, plus près. Les deux. Surtout, ne t'arrête pas.", "seductive", "determined"),
        N("Vos coups de reins s'enchaînent, rapides et pleins. Hylee s'accroche à vos épaules, le souffle cassé en petits éclats, pendant que des étoiles de givre grimpent le long des montants du lit.", "tender"),
      ],
      strokes: [
        N("Ses talons pressent vos reins."),
        N("Vous plongez, elle se cambre pour vous accueillir."),
        N("Le rythme ne laisse plus de place aux mots."),
        N("Ses ongles marquent vos épaules."),
        N("La lampe de givre vacille à chaque élan."),
        N("Chaque poussée lui arrache un éclat de voix."),
      ],
      voice: [
        H("Oui... oui...", "seductive"),
        H("Plus profond, je t'en prie.", "seductive"),
        H("Ne t'arrête surtout pas.", "tender"),
        H("Je... j'y suis presque...", "soft"),
      ],
    },
    {
      label: "Face à face",
      cadence: "jusqu'au bout",
      intimateMood: "soft",
      intro: N("Elle se redresse d'un élan, vous fait asseoir et s'installe sur vos cuisses, front contre front. Il ne reste plus un pouce d'air entre vos deux souffles.", "soft"),
      tiers: [
        N("Vous la soulevez puis la laissez retomber, encore et encore. Elle noue les bras à votre nuque et cale son élan sur le vôtre, battement contre battement.", "soft"),
        H("Regarde-moi. Je veux que tu voies quand ça arrive.", "soft", "soft"),
        N("La cadence s'emballe. Hylee tremble contre vous, se resserre à chaque montée, et vous sentez la vague se former au creux de votre union autant qu'au fond de ses yeux.", "seductive"),
      ],
      strokes: [
        N("Front contre front, souffle contre souffle."),
        N("Elle retombe sur vous, encore, encore."),
        N("Ses bras se nouent à votre nuque."),
        N("Plus rien ne retient la cadence."),
        N("Elle frémit, se referme sur vous."),
        N("La vague monte, toute proche."),
      ],
      voice: [
        H("Regarde-moi...", "soft"),
        H("Encore... encore...", "seductive"),
        H("Avec moi. Maintenant.", "soft"),
        H("Ah... !", "seductive"),
      ],
    },
  ],
  teases: [
    H("Hé. Tu m'as perdue une seconde. Rattrape-moi.", "teasing", "teasing"),
    H("Je compte pour toi ? Un, deux... voilà, c'est mieux.", "teasing", "teasing"),
    H("Tu rêvasses ? Je suis juste là, tu sais.", "teasing", "teasing"),
    H("Raté. Je garde le point, tu me le rendras en baisers.", "teasing", "teasing"),
    H("Doucement ou plus vite, comme tu veux. Mais choisis.", "annoyed", "teasing"),
    H("Si tu t'arrêtes maintenant, je te gèle les orteils.", "teasing", "teasing"),
    H("Je t'ai vu hésiter. C'était mignon. Recommence.", "shy", "teasing"),
    H("Mes hanches avaient de l'avance. Rejoins-les.", "seductive", "teasing"),
    H("Tu comptes dans ta tête ? Regarde-moi plutôt, je te donne la mesure.", "teasing", "teasing"),
    H("Oups. On dira que c'était une figure de style.", "shy", "teasing"),
  ],
  conclusions: {
    embrasement: {
      title: "Embrasement",
      lines: [
        N("Au dernier temps, Hylee se fige contre vous, les yeux grands ouverts. Le plaisir la traverse en longues secousses et vous emporte avec elle dans le même abandon.", "seductive"),
        N("Le photophore éclate en une pluie de givre scintillant qui retombe sur vos épaules sans jamais vous refroidir.", "soft"),
        H("On n'a pas perdu une seule mesure. Je le savais. Je le savais depuis la table.", "teasing", "teasing"),
      ],
    },
    accord: {
      title: "Accord",
      lines: [
        N("La cadence se rompt d'un coup quand Hylee bascule la première, serrée contre vous. Ses frissons vous entraînent à votre tour, quelques battements plus tard.", "seductive"),
        N("Une seule étoile de givre fond lentement sur le verre du photophore.", "soft"),
        H("Quelques faux pas, et pourtant... Je recommence quand tu veux. Ce soir, si possible.", "soft", "soft"),
      ],
    },
    tatonnement: {
      title: "Tâtonnement",
      lines: [
        N("Hylee finit par cesser de compter. Elle vous serre, prend l'allure qui lui plaît et vous mène jusqu'au bout en riant contre votre bouche, jusqu'à ce que la jouissance vous rattrape tous les deux.", "tender"),
        H("Tes hanches et les miennes n'étaient pas toujours d'accord. Moi, j'ai trouvé ça délicieux quand même.", "teasing", "teasing"),
      ],
    },
  },
};

/** Le prototype n'existe que sur une scène : Hylee au logis, parcours homme, mood audacieuse, réglage Explicite. */
export function rhythmSceneFor(routeId: string | undefined, mode: string): RhythmSceneText | undefined {
  return mode === "explicite" && routeId === HYLEE_HOME_RHYTHM.routeId ? HYLEE_HOME_RHYTHM : undefined;
}

/** Index de la séquence remplacée par le jeu (phase « climax » des scènes Hylee). */
export const RHYTHM_REPLACED_CHAPTER = 7;
