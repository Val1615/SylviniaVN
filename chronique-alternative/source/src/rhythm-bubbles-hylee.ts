import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";

/*
 * Jeu de rythme intime · bulles de Hylee (modifiables depuis le Studio), lot 8.
 *
 * Réalignement du prototype : plus aucune position inventée. Hylee curieuse, joueuse,
 * qui rougit puis ose, tutoiement, bulles courtes reprises des répliques du prototype
 * quand elles ne nomment ni lieu ni position, jamais une phrase de la scène écrite.
 */

const H = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Hylee", text, intimateMood });

export const HYLEE_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme",
  instruction: "Suivez le geste de Hylee : un coup à chaque battement, quand la note touche le cercle. Gardez l'appui quand elle vous retient, glissez quand elle change de geste. Elle va doucement, la dernière phase accélère jusqu'au bout.",
  voice: {
    main: [H("Tout doux. Je t'ai à peine effleuré.", "teasing"), H("Regarde comme tu me réponds.", "seductive"), H("Mmh. Encore un peu, rien qu'à moi.", "teasing")],
    bouche: [H("Mmh...", "seductive"), H("Tu as bon goût, tu sais.", "teasing"), H("Pas encore. J'ai d'autres projets.", "tender")],
    langue: [H("Oh... juste là.", "tender"), H("Surtout, ne t'arrête pas.", "seductive"), H("Tu apprends vite...", "shy")],
    frottement: [H("Doucement...", "seductive"), H("Tu le sens, là ?", "teasing"), H("Mmh. Reste avec moi.", "seductive"), H("Oui... comme ça.", "tender")],
    penetration: [H("Oui... oui...", "seductive"), H("Ne t'arrête surtout pas.", "tender"), H("Regarde-moi...", "soft"), H("Encore... encore...", "seductive"), H("Avec moi. Maintenant.", "soft")],
  },
  teases: [
    H("Hé. Tu m'as perdue une seconde. Rattrape-moi.", "teasing"),
    H("Je compte pour toi ? Un, deux... voilà, c'est mieux.", "teasing"),
    H("Tu rêvasses ? Je suis juste là, tu sais.", "teasing"),
    H("Je t'ai vu hésiter. C'était mignon. Recommence.", "shy"),
    H("Oups. On dira que c'était une figure de style.", "shy"),
  ],
  resisted: [H("Tu tiens bien. J'aime ça.", "teasing")],
  ceded: [H("Hé, pas si vite.", "shy")],
  bordHeld: [H("Tu m'as attendue.", "tender")],
  bordBroken: [H("Trop tôt... recommence.", "shy")],
  aura: [H("Un peu plus vite ?", "teasing")],
  call: [H("À toi.", "teasing")],
  endings: {
    embrasement: { title: "Embrasement", lines: [H("On n'a pas perdu une seule mesure. Je le savais.", "teasing")] },
    accord: { title: "Au même souffle", lines: [H("Quelques faux pas. Je recommence quand tu veux.", "soft")] },
    tatonnement: { title: "Tâtonnement", lines: [H("Hé, ce n'est rien. On a ri, non ?", "tender")] },
  },
  relationNote: "",
};
