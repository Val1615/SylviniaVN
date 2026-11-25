import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";

/*
 * Jeu de rythme intime · bulles de Naïah (modifiables depuis le Studio), lot 10.
 *
 * « L'apprentissage » : elle essaie, se trompe, comprend, puis triche. Son plaisir est celui de
 * comprendre et de piéger : jamais un gémissement, jamais une jauge de son désir. Tutoiement,
 * bulles de deux à huit mots, jamais une phrase de la scène écrite.
 */

const N = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Naïah", text, intimateMood });

export const NAIAH_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme",
  instruction: "Naïah apprend en trichant. Ses illusions (notes en contour argenté) ne comptent pas : ne les touchez pas. Quand une ombre vous retient au bord, ne bougez plus. Elle va lentement ; la difficulté, ce sont ses ruses.",
  voice: {
    main: [N("Hm. Comme ça ?", "teasing"), N("Et si je faisais… ça ?", "smirk"), N("J'ai noté.", "smirk")],
    bouche: [N("Intéressant.", "smirk"), N("Ah. C'est donc ça.", "inviting"), N("Celle-ci, je la garde.", "teasing")],
    langue: [N("Tu triches, toi aussi.", "laugh"), N("Je n'avais pas prévu ça.", "soft"), N("Recommence. J'observe.", "inviting")],
    frottement: [N("Mauvais angle. Exprès.", "smirk"), N("Hm. Corrigé.", "teasing"), N("Deuxième essai.", "teasing")],
    penetration: [N("J'ai noté.", "smirk"), N("Hm. Corrigé.", "teasing")],
  },
  teases: [
    N("Raté. J'adore apprendre ça.", "laugh"),
    N("Tu as cru la mauvaise.", "smirk"),
    N("Une erreur ? Je la note.", "teasing"),
    N("Tu me laisses gagner ?", "teasing"),
  ],
  resisted: [N("Tu l'as vue. Vexant.", "stern"), N("Pas dupe. Bien.", "smirk")],
  ceded: [N("Celle-là n'existait pas.", "laugh"), N("Illusion. Point pour moi.", "smirk")],
  bordHeld: [N("Tu as tenu. Je recommence.", "teasing")],
  bordBroken: [N("Trop tôt. Je l'ai vu venir.", "laugh")],
  aura: [N("Plus vite ? Non.", "teasing")],
  call: [N("À toi.", "teasing")],
  endings: {
    embrasement: { title: "Leçon apprise", lines: [N("Tout compris. Je déteste ça. Encore.", "laugh")] },
    accord: { title: "Manche nulle", lines: [N("Égalité. J'ai trois nouvelles ruses.", "smirk")] },
    tatonnement: { title: "Expérience ratée", lines: [N("Raté. C'était passionnant.", "laugh")] },
  },
  relationNote: "",
  trapLabels: { bait: "Illusion" },
};
