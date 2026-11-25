import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";
import { ALLENNA_RHYTHM_BUBBLES } from "./rhythm-bubbles-allenna";
import { LINEVA_RHYTHM_BUBBLES } from "./rhythm-bubbles-lineva";

/*
 * Jeu de rythme intime · bulles d'Allenna et Lineva ensemble (modifiables depuis le Studio).
 *
 * Chaque phase garde la voix de la personne qui y reçoit le geste : les bulles de la
 * phase sont choisies parmi celles de cette personne. Relais de sommets : quand l'une
 * atteint son sommet au milieu de la scène, elle le dit en deux mots et la scène continue.
 */

const A = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Allenna", text, intimateMood });
const L = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Lineva", text, intimateMood });
const both = (key: keyof RhythmCharacterBubbles["voice"]) => [...ALLENNA_RHYTHM_BUBBLES.voice[key], ...LINEVA_RHYTHM_BUBBLES.voice[key]];

export const ALLENNA_LINEVA_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme à trois",
  instruction: "Trois cadences, un seul fil. Lineva donne des ordres (la piste pulse en bleu, le tempo accélère), Allenna s'arrête parfois au bord : ne touchez à rien. Quand l'une atteint son sommet, tenez la note jusqu'au bout : la scène continue.",
  voice: { main: both("main"), bouche: both("bouche"), langue: both("langue"), frottement: both("frottement"), penetration: both("penetration") },
  teases: [...ALLENNA_RHYTHM_BUBBLES.teases.slice(0, 2), ...LINEVA_RHYTHM_BUBBLES.teases.slice(0, 2)],
  resisted: [...ALLENNA_RHYTHM_BUBBLES.resisted, ...LINEVA_RHYTHM_BUBBLES.resisted],
  ceded: [...ALLENNA_RHYTHM_BUBBLES.ceded, ...LINEVA_RHYTHM_BUBBLES.ceded],
  bordHeld: ALLENNA_RHYTHM_BUBBLES.bordHeld,
  bordBroken: ALLENNA_RHYTHM_BUBBLES.bordBroken,
  aura: LINEVA_RHYTHM_BUBBLES.aura,
  call: LINEVA_RHYTHM_BUBBLES.call,
  endings: {
    embrasement: { title: "Trois sommets, un seul fil", lines: [L("Score incontestable. Pour une fois.", "passionate"), A("Ne dites surtout rien.", "seductive")] },
    accord: { title: "Égalité à trois", lines: [A("Égalité. On recommencera.", "soft")] },
    tatonnement: { title: "Revanche à trois", lines: [L("Repos. On reprendra l'exercice.", "pouting")] },
  },
  relationNote: "Lineva déteste l'à-peu-près : votre lien avec elle en garde la trace. Allenna, elle, réclame seulement une revanche.",
  trapLabels: { aura: "Ordre" },
  relay: [...ALLENNA_RHYTHM_BUBBLES.relay!, ...LINEVA_RHYTHM_BUBBLES.relay!],
  autoNote: LINEVA_RHYTHM_BUBBLES.autoNote,
};
