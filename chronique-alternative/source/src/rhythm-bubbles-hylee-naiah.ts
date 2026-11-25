import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";
import { HYLEE_RHYTHM_BUBBLES } from "./rhythm-bubbles-hylee";
import { NAIAH_RHYTHM_BUBBLES } from "./rhythm-bubbles-naiah";

/*
 * Jeu de rythme intime · bulles de Hylee et Naïah ensemble (modifiables depuis le Studio), lot 11.
 *
 * La piste est celle de Hylee (Doux) ; Naïah y ajoute ses fourberies (illusions à ignorer, une
 * ombre qui retient au bord). Chaque phase garde la voix de la personne qui y mène le geste :
 * Hylee gémit, Naïah rit, jamais l'inverse. Tutoiement, jamais une phrase de la scène réécrite.
 */

const H = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Hylee", text, intimateMood });
const N = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Naïah", text, intimateMood });
const both = (key: keyof RhythmCharacterBubbles["voice"]) => [...HYLEE_RHYTHM_BUBBLES.voice[key], ...NAIAH_RHYTHM_BUBBLES.voice[key]];

export const HYLEE_NAIAH_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme à trois",
  instruction: "Hylee donne le rythme, Naïah le casse exprès. Ses illusions (notes en contour argenté) ne comptent pas : ne les touchez pas. Quand une ombre vous retient au bord, ne bougez plus. Au sommet de Hylee, tenez la note : la partie continue.",
  voice: { main: both("main"), bouche: both("bouche"), langue: both("langue"), frottement: both("frottement"), penetration: both("penetration") },
  teases: [...HYLEE_RHYTHM_BUBBLES.teases.slice(0, 2), ...NAIAH_RHYTHM_BUBBLES.teases.slice(0, 2)],
  resisted: NAIAH_RHYTHM_BUBBLES.resisted,
  ceded: NAIAH_RHYTHM_BUBBLES.ceded,
  bordHeld: NAIAH_RHYTHM_BUBBLES.bordHeld,
  bordBroken: NAIAH_RHYTHM_BUBBLES.bordBroken,
  aura: NAIAH_RHYTHM_BUBBLES.aura,
  call: NAIAH_RHYTHM_BUBBLES.call,
  endings: {
    embrasement: { title: "Partie gagnée à trois", lines: [H("Tu vois ? On a gagné.", "teasing"), N("Je réclame quand même le point.", "smirk")] },
    accord: { title: "Score contesté", lines: [N("Égalité. Je conteste.", "smirk"), H("Revanche quand tu veux.", "soft")] },
    tatonnement: { title: "Manche perdue", lines: [H("Hé, ce n'est rien. On a ri, non ?", "tender"), N("Moi, j'ai appris trois choses.", "laugh")] },
  },
  relationNote: "",
  trapLabels: { bait: "Illusion" },
  relay: [H("Oh... ne t'arrête pas.", "seductive"), H("Là... c'est là.", "tender")],
};
