import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";
import { BELLIRITH_RHYTHM_BUBBLES } from "./rhythm-bubbles-bellirith";
import { NAIAH_RHYTHM_BUBBLES } from "./rhythm-bubbles-naiah";

/*
 * Jeu de rythme intime · bulles de Bellirith et Naïah ensemble (modifiables depuis le Studio), lot 12.
 *
 * La piste est celle de Bellirith (Intense) : elle compte les points, lit les corps, accélère
 * en aura. Naïah « simule » : ses réactions parfaites sont des leurres à ignorer. Naïah ne gémit
 * jamais et son désir n'est jamais jaugé : elle rit, elle compte. Le joueur ne touche que
 * Bellirith. Tutoiement, jamais une phrase de la scène réécrite.
 */

const B = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Bellirith", text, intimateMood });
const N = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Naïah", text, intimateMood });
const both = (key: keyof RhythmCharacterBubbles["voice"]) => [...BELLIRITH_RHYTHM_BUBBLES.voice[key], ...NAIAH_RHYTHM_BUBBLES.voice[key]];

export const BELLIRITH_NAIAH_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme à trois",
  instruction: "Bellirith mène et compte les points. Naïah simule : ses réactions trop parfaites (notes en contour argenté) sont des leurres, ne les touchez pas. Au bord, ne bougez plus. Quand la piste pulse en violet, l'aura de Bellirith va accélérer.",
  voice: { main: both("main"), bouche: both("bouche"), langue: both("langue"), frottement: both("frottement"), penetration: both("penetration") },
  teases: [...BELLIRITH_RHYTHM_BUBBLES.teases.slice(0, 3), ...NAIAH_RHYTHM_BUBBLES.teases.slice(0, 2)],
  resisted: [N("Tu ne t'es pas fait avoir.", "smirk"), B("Elle bluffe. Tu l'as vu.", "smug")],
  ceded: [N("Celle-là, c'était du théâtre.", "laugh"), B("Elle t'a eu·e. Moi aussi.", "haughty")],
  bordHeld: BELLIRITH_RHYTHM_BUBBLES.bordHeld,
  bordBroken: BELLIRITH_RHYTHM_BUBBLES.bordBroken,
  aura: BELLIRITH_RHYTHM_BUBBLES.aura,
  call: BELLIRITH_RHYTHM_BUBBLES.call,
  endings: {
    embrasement: { title: "Un point pour vous deux", lines: [B("Un point. Pour toi, pas pour elle.", "sultry"), N("Je note quand même.", "smirk")] },
    accord: { title: "Partie serrée", lines: [N("Égalité. Ça l'agace.", "smirk"), B("Presque pas.", "smug")] },
    tatonnement: { title: "Le point à Naïah", lines: [N("Encore un bâton pour moi.", "laugh"), B("Tu m'as fait perdre, toi.", "haughty")] },
  },
  relationNote: "Bellirith n'aime pas la facilité : votre lien avec elle en garde la trace.",
  trapLabels: { bait: "Simulation" },
};
