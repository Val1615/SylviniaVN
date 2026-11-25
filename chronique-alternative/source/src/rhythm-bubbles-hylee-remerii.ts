import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";
import { HYLEE_RHYTHM_BUBBLES } from "./rhythm-bubbles-hylee";
import { REMERII_RHYTHM_BUBBLES } from "./rhythm-bubbles-remerii";

/*
 * Jeu de rythme intime · bulles de Hylee et Remerii ensemble (modifiables depuis le Studio), lot 9.
 *
 * Chaque phase garde la voix de la personne qui y reçoit le geste ou y atteint son sommet.
 * Relais de sommets : quand l'une jouit au milieu de la scène, elle le dit en deux mots et
 * la scène continue. Hylee tutoie, Remerii vouvoie, jamais une phrase de la scène réécrite.
 */

const H = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Hylee", text, intimateMood });
const R = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Remerii", text, intimateMood });
const both = (key: keyof RhythmCharacterBubbles["voice"]) => [...HYLEE_RHYTHM_BUBBLES.voice[key], ...REMERII_RHYTHM_BUBBLES.voice[key]];

export const HYLEE_REMERII_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme à trois",
  instruction: "Deux cadences qui se connaissent par cœur. Hylee va doucement, Remerii mesure : gardez des coups réguliers. Quand l'une atteint son sommet, tenez la note jusqu'au bout : la scène continue.",
  voice: { main: both("main"), bouche: both("bouche"), langue: both("langue"), frottement: both("frottement"), penetration: both("penetration") },
  teases: [...HYLEE_RHYTHM_BUBBLES.teases.slice(0, 2), ...REMERII_RHYTHM_BUBBLES.teases.slice(0, 2)],
  resisted: [...HYLEE_RHYTHM_BUBBLES.resisted, ...REMERII_RHYTHM_BUBBLES.resisted],
  ceded: [...HYLEE_RHYTHM_BUBBLES.ceded, ...REMERII_RHYTHM_BUBBLES.ceded],
  bordHeld: HYLEE_RHYTHM_BUBBLES.bordHeld,
  bordBroken: HYLEE_RHYTHM_BUBBLES.bordBroken,
  aura: REMERII_RHYTHM_BUBBLES.aura,
  call: REMERII_RHYTHM_BUBBLES.call,
  mesure: REMERII_RHYTHM_BUBBLES.mesure,
  endings: {
    embrasement: { title: "Deux sommets, une même mesure", lines: [R("Hypothèse confirmée. Deux fois.", "smirk"), H("Tu vois ? Je le savais.", "teasing")] },
    accord: { title: "Au même souffle", lines: [H("Quelques faux pas. On recommence ?", "soft"), R("Résultat satisfaisant.", "inviting")] },
    tatonnement: { title: "Expérience à reprendre", lines: [H("Hé, ce n'est rien. On a ri, non ?", "tender"), R("Nous recommencerons.", "strict")] },
  },
  relationNote: "Remerii note les approximations : votre lien avec elle en garde la trace. Hylee, elle, en rit avec vous.",
  relay: [H("Oh... ne vous arrêtez pas.", "seductive"), H("Là... c'est là.", "tender"), R("Je... perds le compte.", "soft"), R("Mesure perdue. Continuez.", "inviting")],
};
