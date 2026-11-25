import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";

/*
 * Jeu de rythme intime · bulles d'Allenna (modifiables depuis le Studio).
 *
 * Guerrière franche que sa propre gêne surprend : elle hésite, rougit, puis décide.
 * Pas de leurre : ses silences au bord sont des hésitations. Sa mauvaise fin parle de
 * revanche, jamais de reproche. Bulles de deux à huit mots, dans sa voix, jamais une
 * phrase de la scène écrite réécrite.
 */

const A = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Allenna", text, intimateMood });

export const ALLENNA_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme",
  instruction: "Suivez sa cadence, sans brusquer. Il lui arrive de s'arrêter au bord, le temps d'une hésitation : ne touchez à rien, laissez-la décider de repartir.",
  voice: {
    main: [A("Comme ça ?", "shy"), A("Je vais y arriver.", "soft"), A("Ne détournez pas les yeux.", "seductive")],
    bouche: [A("Laissez-moi faire.", "seductive"), A("Je sais ce que je veux.", "soft"), A("Pas encore.", "shy")],
    langue: [A("Là… restez là.", "troubled"), A("Je ne me cache plus.", "seductive"), A("Encore. Doucement.", "soft")],
    frottement: [A("Plus près.", "soft"), A("Je vous sens.", "seductive"), A("Ne lâchez pas.", "troubled")],
    penetration: [A("Je le veux.", "seductive"), A("Plus profond.", "troubled"), A("Ne vous arrêtez pas.", "seductive"), A("Encore. Avec moi.", "soft")],
  },
  teases: [
    A("Vous aussi, vous hésitez ?", "shy"),
    A("On recommence. Ensemble.", "soft"),
    A("Je ne compte pas les coups.", "soft"),
    A("Regardez-moi, pas vos mains.", "stern"),
  ],
  resisted: [A("Merci d'avoir attendu.", "soft"), A("Vous m'avez laissée choisir.", "shy")],
  ceded: [A("Trop vite.", "stern"), A("Attendez-moi.", "troubled")],
  bordHeld: [A("Vous avez attendu. Merci.", "soft"), A("Je suis prête, maintenant.", "seductive"), A("C'est moi qui repars.", "seductive")],
  bordBroken: [A("Pas encore. Je décide.", "stern"), A("Laissez-moi respirer.", "troubled")],
  aura: [A("Tenez bon.", "stern")],
  call: [A("À vous.", "soft")],
  endings: {
    embrasement: { title: "Elle ne se cache plus", lines: [A("Ne dites rien. Recommencez.", "seductive")] },
    accord: { title: "Au même pas", lines: [A("Pas mal. Pour une première manche.", "soft")] },
    tatonnement: { title: "Revanche promise", lines: [A("J'exige une revanche. Bientôt.", "stern")] },
  },
  relationNote: "",
  relay: [A("Pas fini. Pas encore.", "seductive"), A("Restez. Je suis là.", "soft")],
};
