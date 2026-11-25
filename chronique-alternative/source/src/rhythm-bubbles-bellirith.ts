import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";

/*
 * Jeu de rythme intime · bulles de Bellirith (modifiables depuis le Studio).
 *
 * Succube experte qui lit les corps et met tout en scène, mais dont le désir naît
 * de la résistance : elle compte les points, déteste perdre, sauf quand elle aime
 * perdre. Bulles de deux à huit mots, dans sa voix, jamais une phrase de la scène
 * écrite réécrite. « Demande mieux. » reprend une réplique déjà écrite du duel.
 */

const B = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Bellirith", text, intimateMood });

export const BELLIRITH_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme",
  instruction: "Suivez sa cadence. Elle tend des leurres (notes pâles, sans cœur) et s'arrête au bord : ne touchez à rien, votre résistance nourrit son désir. Quand la piste pulse en violet, son aura va accélérer.",
  voice: {
    main: [B("Résiste. J'adore ça.", "teasing"), B("Pas encore.", "haughty"), B("Tu trembles déjà ?", "smug")],
    bouche: [B("Regarde-moi faire.", "hungry"), B("Tu tiendras ?", "teasing"), B("Pas encore. Je décide.", "smug")],
    langue: [B("Mieux. Continue.", "sultry"), B("Un point pour toi. Un seul.", "smug"), B("Ne t'arrête pas là.", "hungry")],
    frottement: [B("Suis-moi, si tu peux.", "inviting"), B("Plus près.", "sultry"), B("C'est moi qui mène.", "haughty")],
    penetration: [B("Demande mieux.", "smug"), B("Tu apprends vite.", "teasing"), B("Encore. Plus fort.", "hungry"), B("Ne me fais pas attendre.", "sultry")],
  },
  teases: [
    B("Tu bluffes ?", "teasing"),
    B("Je compte, tu sais.", "smug"),
    B("Un point pour moi.", "haughty"),
    B("Concentre-toi. Sur moi.", "teasing"),
    B("Tu perds le fil ?", "smug"),
    B("Ce n'est pas un rythme, ça.", "haughty"),
  ],
  resisted: [B("Tu ne mords pas ? Dommage.", "teasing"), B("Bien. Résiste encore.", "sultry"), B("Tu me lis, maintenant ?", "smug")],
  ceded: [B("Trop facile.", "smug"), B("Tu as cédé. Noté.", "haughty"), B("Je t'ai eu·e.", "teasing")],
  bordHeld: [B("Tu as tenu. J'adore ça.", "hungry"), B("Pas un geste. Parfait.", "sultry"), B("Tu me plais, comme ça.", "inviting")],
  bordBroken: [B("Pas encore, j'ai dit.", "haughty"), B("Impatience. Un point pour moi.", "smug")],
  aura: [B("Tiens-toi bien.", "smug"), B("Sens-tu ça ?", "sultry")],
  call: [B("Écoute. Puis rends-le-moi.", "teasing"), B("À toi, maintenant.", "smug")],
  endings: {
    embrasement: { title: "Elle a perdu le compte", lines: [B("Un point pour toi. Un seul. Le plus beau.", "sultry")] },
    accord: { title: "Égalité", lines: [B("Égalité. Je déteste ça. Presque.", "smug")] },
    tatonnement: { title: "Un point pour elle", lines: [B("C'était ça, ta résistance ?", "haughty")] },
  },
  relationNote: "Bellirith n'aime pas la facilité : votre lien en garde la trace.",
};
