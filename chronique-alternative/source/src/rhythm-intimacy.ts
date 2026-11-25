import type { DialogueLine } from "./game-data";

/*
 * Jeu de rythme intime · textes (prototype, une scène).
 *
 * Scène : Hylee, intimité au logis, parcours homme, mood « audacieuse »
 * (route « hylee-home-homme-audacieuse »), réglage Explicite. Le jeu remplace
 * les séquences 4 à 8 écrites, des caresses sur la table jusqu'au climax : il
 * s'ouvre quand Hylee vous libère du dernier tissu contre la table et rend la
 * main à l'après-climax, qui affiche la CG post-orgasme. « Lire la version
 * écrite » rejoue ces séquences d'origine.
 *
 * Trois phases préliminaires (sa main, ses lèvres, votre langue) précèdent les
 * quatre positions. Chaque section correspond à un geste ou à une position. Ses trois paliers se débloquent par
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
  /** Version Suggestif : textes adoucis, sprite flouté, voix et bruits corporels remplacés par des sons neutres. */
  suggestive?: boolean;
};

const N = (text: string, intimateMood?: string): DialogueLine => ({ speaker: "Narration", text, ...(intimateMood ? { intimateMood } : {}) });
const H = (text: string, intimateMood: string, mood?: string): DialogueLine => ({ speaker: "Hylee", text, intimateMood, ...(mood ? { mood } : {}) });

export const HYLEE_HOME_RHYTHM: RhythmSceneText = {
  id: "rythme-hylee-logis-audacieuse",
  routeId: "hylee-home-homme-audacieuse",
  title: "Au rythme du givre",
  instruction: "Suivez le geste d'Hylee : un coup à chaque battement, quand la note touche le cercle. Les flèches ˄ ˅ marquent le va-et-vient de sa main ; gardez l'appui quand elle vous retient, glissez quand elle change de geste ou de position. Chaque phase a sa cadence, la dernière accélère jusqu'au bout.",
  controls: {
    keyboard: "Espace, J ou F : toucher et maintenir · ← → : glisser · Échap : pause",
    touch: "Touchez n'importe où : toucher · gardez le doigt : maintenir · balayez : glisser",
  },
  sections: [
    {
      label: "Sa main",
      cadence: "va-et-vient",
      intimateMood: "teasing",
      intro: N("Hylee vous assoit au bord de la table et se glisse entre vos genoux, le menton levé. Ses doigts se referment sur vous, puis entament un va-et-vient lent qu'elle compte à mi-voix.", "teasing"),
      tiers: [
        N("Sa paume monte, redescend, s'attarde tout en haut. Elle a trouvé d'emblée la mesure qui vous fait retenir votre souffle, et elle n'en change plus.", "seductive"),
        H("Tu vois ? Je n'ai même pas besoin de demander ce qui te plaît. Ta respiration me répond.", "teasing", "teasing"),
        N("Ses doigts glissent, luisants et chauds, et la caresse prend de l'assurance. À chaque longue remontée, elle vous guette par en dessous pour surprendre le moment où vous céderez.", "seductive"),
      ],
      strokes: [
        N("Sa main monte. Puis redescend, sans hâte."),
        N("Un tour de poignet, tout en haut."),
        N("Ses doigts serrent juste ce qu'il faut."),
        N("Elle souffle sur vous, amusée."),
        N("La caresse s'allonge, s'attarde."),
        N("Votre main cherche le bord de la table."),
      ],
      voice: [
        H("Tout doux. Je t'ai à peine effleuré.", "teasing"),
        H("Regarde comme tu me réponds.", "seductive"),
        H("Mmh. Encore un peu, rien qu'à moi.", "teasing"),
        H("Pas encore. J'ai d'autres projets.", "tender"),
      ],
    },
    {
      label: "Ses lèvres",
      cadence: "profonde",
      intimateMood: "seductive",
      intro: N("Elle se penche plus bas, dépose un baiser là où sa main s'attardait, puis vous accueille entre ses lèvres avec une lenteur délibérée, les yeux toujours levés vers les vôtres.", "seductive"),
      tiers: [
        N("Elle alterne de petites pressions rapides et de longues descentes où elle vous garde au chaud, immobile, jusqu'à vous arracher un frisson.", "seductive"),
        H("Mmh... Ne bouge pas. C'est moi qui choisis le tempo, tu te souviens ?", "teasing", "teasing"),
        N("Sa langue dessine un cercle au sommet chaque fois qu'elle remonte. Vos doigts se perdent dans ses cheveux, et elle sourit contre vous, ravie de sentir votre maîtrise s'effriter.", "tender"),
      ],
      strokes: [
        N("Ses lèvres glissent, humides et lentes."),
        N("Elle remonte, vous libère, reprend."),
        N("Un regard par en dessous, malicieux."),
        N("Elle vous garde au fond, sans un mouvement."),
        N("Ses cheveux balaient vos cuisses."),
        N("Un murmure étouffé vibre contre vous."),
      ],
      voice: [
        H("Mmh...", "seductive"),
        H("Tu as bon goût, tu sais.", "teasing"),
        H("Ne me retiens pas... pas encore.", "seductive"),
        H("Assez. À mon tour.", "teasing"),
      ],
    },
    {
      label: "Votre langue",
      cadence: "irrégulière",
      intimateMood: "tender",
      intro: N("Hylee se redresse, prend votre place sur la table et ouvre les genoux sans détourner les yeux. Une main dans vos cheveux, elle vous guide vers sa chaleur et vous montre où commencer.", "teasing"),
      tiers: [
        N("Vos lèvres trouvent le point qu'elle vous désigne. Un effleurement court, un autre, puis une longue caresse de la langue, et sa cuisse tressaille contre votre joue.", "tender"),
        H("Là... Non, ne change rien. Ce petit rythme bancal me rend folle.", "seductive", "teasing"),
        N("Elle ne donne plus d'ordres, seulement des soupirs. Ses hanches viennent à votre rencontre, ses doigts se crispent dans vos cheveux et les frissons remontent de son ventre jusqu'à sa gorge.", "soft"),
      ],
      strokes: [
        N("Un effleurement, un autre, puis une longue caresse."),
        N("Sa cuisse tremble contre votre joue."),
        N("Elle se cambre, la nuque renversée."),
        N("Vos lèvres tracent un cercle lent."),
        N("Un frisson court jusqu'à ses épaules."),
        N("Ses talons glissent sur le rebord de la table."),
      ],
      voice: [
        H("Oh... juste là.", "tender"),
        H("Surtout, ne t'arrête pas.", "seductive"),
        H("Tu apprends vite...", "shy"),
        H("Viens. La chambre. Maintenant.", "soft"),
      ],
    },
    {
      label: "Elle mène",
      cadence: "lente",
      intimateMood: "seductive",
      intro: N("Elle vous entraîne jusqu'à la chambre, vous renverse sur le lit et s'installe sur vos hanches. D'un seul geste, elle vous guide en elle, puis ralentit exprès : elle descend jusqu'au bout, s'arrête là et remonte avec une lenteur de provocation.", "seductive"),
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

/*
 * Version Suggestif de la même scène : même cadence, mêmes phases et même jauge, mais des textes sensuels
 * sans description anatomique (comme les séquences écrites en Suggestif), le sprite flouté, et ni voix
 * ni bruits corporels : seulement des sons neutres, la musique et l'interface.
 */
export const HYLEE_HOME_RHYTHM_SUGGESTIF: RhythmSceneText = {
  id: "rythme-hylee-logis-audacieuse-suggestif",
  routeId: HYLEE_HOME_RHYTHM.routeId,
  title: "Au rythme du givre",
  suggestive: true,
  instruction: "Suivez la cadence d'Hylee : un coup à chaque battement, quand la note touche le cercle. Les flèches ˄ ˅ marquent le va-et-vient de ses caresses ; gardez l'appui quand elle vous retient, glissez quand elle change d'élan. Version Suggestif : l'image reste voilée et seuls des sons neutres marquent le rythme.",
  controls: HYLEE_HOME_RHYTHM.controls,
  sections: [
    {
      label: "Ses mains",
      cadence: "va-et-vient",
      intimateMood: "teasing",
      intro: N("Hylee vous assoit au bord de la table et se glisse tout contre vous. Ses mains descendent sans se presser, puis trouvent une cadence lente qu'elle compte à mi-voix.", "teasing"),
      tiers: [
        N("Elle a trouvé d'emblée la mesure qui vous fait retenir votre souffle, et elle la garde, attentive au moindre de vos frissons.", "seductive"),
        H("Tu vois ? Je n'ai rien à demander. Ton souffle me répond pour toi.", "teasing", "teasing"),
        N("La caresse prend de l'assurance. Hylee vous guette par en dessous, un sourire en coin, prête à surprendre l'instant où vous céderez.", "seductive"),
      ],
      strokes: [
        N("Ses mains montent, puis redescendent, sans hâte."),
        N("Elle s'attarde, juste ce qu'il faut."),
        N("Un souffle amusé contre votre épaule."),
        N("La caresse s'allonge et s'attarde encore."),
        N("Vos doigts cherchent le bord de la table."),
        N("Elle compte tout bas, et vous suivez."),
      ],
      voice: [
        H("Tout doux. Je commence à peine.", "teasing"),
        H("Regarde comme tu m'obéis bien.", "seductive"),
        H("Mmh. Encore un peu, rien qu'à moi.", "teasing"),
        H("Pas si vite. J'ai d'autres idées.", "tender"),
      ],
    },
    {
      label: "Ses baisers",
      cadence: "profonde",
      intimateMood: "seductive",
      intro: N("Elle se penche, sème des baisers de plus en plus bas, puis disparaît de votre vue avec une lenteur délibérée. Le reste se devine à votre souffle qui se brise.", "seductive"),
      tiers: [
        N("Elle alterne des instants vifs et de longues pauses où elle vous tient immobile, juste au bord, jusqu'à vous arracher un frisson.", "seductive"),
        H("Ne bouge pas. C'est moi qui choisis le tempo, tu te souviens ?", "teasing", "teasing"),
        N("Vos doigts se perdent dans ses cheveux. Vous la sentez sourire, ravie de voir votre sang-froid s'effriter à chacun de ses retours.", "tender"),
      ],
      strokes: [
        N("Un baiser, plus bas, puis un autre."),
        N("Elle s'éloigne, revient, recommence."),
        N("Un regard par en dessous, malicieux."),
        N("Elle vous garde au bord, sans un geste."),
        N("Ses cheveux glissent sur vos genoux."),
        N("Un murmure, et tout votre corps répond."),
      ],
      voice: [
        H("Chut... laisse-toi faire.", "seductive"),
        H("Tu es adorable quand tu lâches prise.", "teasing"),
        H("Pas encore. Retiens-toi pour moi.", "seductive"),
        H("Assez. C'est ton tour.", "teasing"),
      ],
    },
    {
      label: "À votre tour",
      cadence: "irrégulière",
      intimateMood: "tender",
      intro: N("Hylee prend votre place sur la table et vous attire vers elle, une main dans vos cheveux. Elle vous guide sans un mot, et vous laisse deviner le reste à ses soupirs.", "teasing"),
      tiers: [
        N("Vous suivez chacun de ses frémissements. Un effleurement, un autre, puis une caresse plus longue, et elle retient sa respiration.", "tender"),
        H("Là... ne change rien. Ce petit rythme bancal me rend folle.", "seductive", "teasing"),
        N("Elle ne donne plus d'ordres, seulement des soupirs. Ses doigts se crispent dans vos cheveux et les frissons la gagnent jusqu'aux épaules.", "soft"),
      ],
      strokes: [
        N("Un effleurement, un autre, puis plus longuement."),
        N("Elle tressaille et rit tout bas."),
        N("Sa nuque se renverse en arrière."),
        N("Vous traînez exprès, elle proteste à peine."),
        N("Un frisson remonte jusqu'à ses épaules."),
        N("Ses talons tapotent le rebord de la table."),
      ],
      voice: [
        H("Oh... juste comme ça.", "tender"),
        H("Surtout, continue.", "seductive"),
        H("Tu apprends drôlement vite...", "shy"),
        H("Viens. La chambre. Tout de suite.", "soft"),
      ],
    },
    {
      label: "Elle mène",
      cadence: "lente",
      intimateMood: "seductive",
      intro: N("Elle vous entraîne jusqu'à la chambre, vous fait basculer sur le lit et prend place sur vous. Le drap retombe sur vos hanches, et Hylee impose une lenteur de provocation.", "seductive"),
      tiers: [
        N("Elle ondule à peine, s'arrête, vous regarde attendre. Chaque pause lui arrache un sourire, et à vous un soupir.", "seductive"),
        H("Comme ça. Ne bouge plus... Voilà. Maintenant, suis-moi.", "teasing", "teasing"),
        N("Ses hanches roulent en longues vagues sous le drap. Sur le photophore, une dentelle de givre s'étend au même tempo que le vôtre.", "seductive"),
      ],
      strokes: [
        N("Elle ondule, lentement, sous le drap."),
        N("Un temps immobile, puis la vague reprend."),
        N("Ses mains s'ouvrent sur votre torse."),
        N("Encore une fois, sans se presser."),
        N("Le sommier soupire, à peine."),
        N("Son souffle s'accroche au vôtre."),
      ],
      voice: [
        H("Doucement, mon cœur...", "seductive"),
        H("Tu me sens, là ?", "teasing"),
        H("Reste avec moi.", "seductive"),
        H("Oui... exactement ainsi.", "tender"),
      ],
    },
    {
      label: "Dos tourné",
      cadence: "plus vive",
      intimateMood: "teasing",
      intro: N("Sans rompre l'étreinte, Hylee se retourne sur vous. Elle vous offre la courbe de son dos dans la lumière bleue, et le drap glisse un peu plus.", "teasing"),
      tiers: [
        N("Vos mains trouvent sa taille. Elle accélère en mesure, et chaque élan fait frémir la ligne de son dos jusqu'à la nuque.", "teasing"),
        H("Tu vois mieux d'ici ? Moi, je sens tout. C'est injuste, j'adore.", "teasing", "teasing"),
        N("La cadence devient une danse serrée. Elle se cambre, ralentit quand l'envie l'en prend et rit tout bas quand vous tenez la mesure.", "seductive"),
      ],
      strokes: [
        N("Son dos se cambre à chaque élan."),
        N("Vos mains guident sa taille."),
        N("Le rythme se fait plus franc."),
        N("Elle revient vers vous, toujours plus vite."),
        N("Sa nuque ploie, ses cheveux glissent."),
        N("Un frisson court le long de sa colonne."),
      ],
      voice: [
        H("Ah... plus vite.", "teasing"),
        H("Ne me lâche surtout pas.", "seductive"),
        H("Là. Encore.", "seductive"),
        H("Tu vas finir par m'avoir...", "tender"),
      ],
    },
    {
      label: "Renversée",
      cadence: "rapide",
      intimateMood: "tender",
      intro: N("Hylee bascule sur le côté en vous entraînant. Vous roulez ensemble sous le drap, et c'est elle qui vous attire au-dessus d'elle, ses chevilles croisées dans votre dos.", "tender"),
      tiers: [
        N("Vous reprenez la cadence qu'elle vient de vous apprendre. Elle vous serre pour réclamer davantage, et vous accélérez sans rien perdre de l'ampleur.", "tender"),
        H("Plus près... encore plus près. Et surtout, ne t'arrête pas.", "seductive", "determined"),
        N("L'élan s'emballe. Hylee s'accroche à vos épaules, le souffle cassé en petits éclats, tandis que des étoiles de givre grimpent le long des montants du lit.", "tender"),
      ],
      strokes: [
        N("Ses chevilles vous retiennent contre elle."),
        N("Elle se cambre pour aller à votre rencontre."),
        N("Le rythme ne laisse plus de place aux mots."),
        N("Ses ongles effleurent vos épaules."),
        N("La lampe de givre vacille à chaque élan."),
        N("Chaque élan lui arrache un éclat de rire ou de voix."),
      ],
      voice: [
        H("Oui... oui...", "seductive"),
        H("Garde-moi contre toi.", "seductive"),
        H("Ne t'arrête pas maintenant.", "tender"),
        H("J'y suis presque...", "soft"),
      ],
    },
    {
      label: "Face à face",
      cadence: "jusqu'au bout",
      intimateMood: "soft",
      intro: N("Elle se redresse d'un élan, vous fait asseoir et s'installe tout contre vous, front contre front. Il ne reste plus un pouce d'air entre vos deux souffles.", "soft"),
      tiers: [
        N("Vous bougez ensemble, encore et encore. Elle noue les bras à votre nuque et cale son élan sur le vôtre, battement contre battement.", "soft"),
        H("Regarde-moi. Je veux voir le moment où ça arrive.", "soft", "soft"),
        N("La cadence s'emballe. Hylee tremble contre vous, et vous sentez la vague se former dans ses yeux autant que dans chacun de vos gestes.", "seductive"),
      ],
      strokes: [
        N("Front contre front, souffle mêlé."),
        N("Elle revient contre vous, encore, encore."),
        N("Ses bras se referment sur votre nuque."),
        N("Plus rien ne retient l'élan."),
        N("Elle frémit tout entière."),
        N("La vague arrive, toute proche."),
      ],
      voice: [
        H("Regarde-moi, s'il te plaît...", "soft"),
        H("Encore un peu...", "seductive"),
        H("Ensemble. Maintenant.", "soft"),
        H("Oh... !", "seductive"),
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
    H("J'avais une longueur d'avance. Rejoins-moi.", "seductive", "teasing"),
    H("Tu comptes dans ta tête ? Regarde-moi plutôt, je te donne la mesure.", "teasing", "teasing"),
    H("Oups. On dira que c'était une figure de style.", "shy", "teasing"),
  ],
  conclusions: {
    embrasement: {
      title: "Embrasement",
      lines: [
        N("Au dernier temps, Hylee se fige contre vous, les yeux grands ouverts, et la même vague vous emporte tous les deux sous le drap.", "seductive"),
        N("Le photophore s'ouvre en une pluie de givre scintillant qui retombe sur vos épaules sans jamais vous refroidir.", "soft"),
        H("Pas une seule mesure perdue. Je le savais depuis la table.", "teasing", "teasing"),
      ],
    },
    accord: {
      title: "Accord",
      lines: [
        N("La cadence se rompt quand Hylee bascule la première, serrée contre vous. Ses frissons vous rattrapent quelques battements plus tard.", "seductive"),
        N("Une seule étoile de givre fond lentement sur le verre du photophore.", "soft"),
        H("Quelques faux pas, et pourtant... On recommence quand tu veux.", "soft", "soft"),
      ],
    },
    tatonnement: {
      title: "Tâtonnement",
      lines: [
        N("Hylee finit par ne plus compter du tout. Elle vous serre, prend l'allure qui lui plaît et vous entraîne jusqu'au bout en riant contre votre épaule.", "tender"),
        H("On n'était pas toujours d'accord sur le tempo. J'ai adoré quand même.", "teasing", "teasing"),
      ],
    },
  },
};

/**
 * Le prototype n'existe que sur une scène : Hylee au logis, parcours homme, mood audacieuse.
 * Explicite : version complète. Suggestif : version adoucie (textes, image voilée, sons neutres).
 * Tendre et Fondu au noir : pas de jeu, la scène écrite reste telle quelle.
 */
export function rhythmSceneFor(routeId: string | undefined, mode: string): RhythmSceneText | undefined {
  if (routeId !== HYLEE_HOME_RHYTHM.routeId) return undefined;
  if (mode === "explicite") return HYLEE_HOME_RHYTHM;
  if (mode === "suggestif") return HYLEE_HOME_RHYTHM_SUGGESTIF;
  return undefined;
}

/** Index de la séquence « climax » des scènes Hylee : la conclusion du jeu la remplace. */
export const RHYTHM_REPLACED_CHAPTER = 7;
/**
 * Première séquence remplacée par le jeu (phase « partner-discovery » : caresses et bouche sur la table).
 * Le jeu couvre les séquences RHYTHM_START_CHAPTER à RHYTHM_REPLACED_CHAPTER ; la version écrite les rejoue.
 */
export const RHYTHM_START_CHAPTER = 3;
/** Séquence dont le visuel (sprites intimes, sans CG) habille tout le jeu. */
export const RHYTHM_VISUAL_CHAPTER = RHYTHM_REPLACED_CHAPTER - 1;
