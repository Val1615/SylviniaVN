import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";

/*
 * Jeu de rythme intime · bulles de Lineva (modifiables depuis le Studio).
 *
 * Capitaine qui commande comme on respire, joueuse et exigeante : ses ordres sont des
 * vagues d'aura annoncées (« Plus vite. »), elle ne ralentit jamais et n'aime pas qu'on
 * la regarde faire une démonstration. Vouvoiement de commandement, bulles de deux à
 * huit mots, jamais une phrase de la scène écrite réécrite.
 */

const L = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Lineva", text, intimateMood });

export const LINEVA_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme",
  instruction: "Tenez sa cadence, elle ne ralentit jamais. Quand la piste pulse en bleu, Lineva donne un ordre : le tempo accélère quelques coups. Suivez, puis reprenez le pas.",
  voice: {
    main: [L("Tenez.", "smirk"), L("Pas si vite. Si, en fait.", "teasing"), L("Mieux.", "smirk")],
    bouche: [L("Regardez-moi.", "teasing"), L("Vous tiendrez ?", "smirk"), L("Je n'ai pas dit stop.", "teasing")],
    langue: [L("Là. Exactement là.", "passionate"), L("Ne ralentissez pas.", "passionate"), L("Bien. Continuez.", "smirk")],
    frottement: [L("Suivez-moi.", "teasing"), L("Plus près. C'est un ordre.", "smirk"), L("Maintenant.", "passionate")],
    penetration: [L("Plus vite.", "passionate"), L("Tenez la cadence.", "smirk"), L("Ne ralentissez pas.", "passionate"), L("Maintenant.", "passionate")],
  },
  teases: [
    L("Reprenez. Au signal.", "teasing"),
    L("Vous comptiez les étoiles ?", "smirk"),
    L("On reprend au début du geste.", "annoyed"),
    L("Je ne répète pas deux fois.", "pouting"),
  ],
  resisted: [L("Discipline. J'aime ça.", "smirk")],
  ceded: [L("Pas sans mon ordre.", "annoyed")],
  bordHeld: [L("Bien tenu.", "smirk")],
  bordBroken: [L("Trop tôt, soldat.", "pouting")],
  aura: [L("Plus vite.", "passionate"), L("Maintenant.", "passionate"), L("Tenez.", "smirk"), L("Ne ralentissez pas.", "passionate")],
  call: [L("À vous.", "smirk")],
  endings: {
    embrasement: { title: "Ordre exécuté", lines: [L("Parfait. Je n'ai rien à corriger.", "passionate")] },
    accord: { title: "Bon pour le service", lines: [L("Correct. On peut faire mieux. Ensemble.", "smirk")] },
    tatonnement: { title: "Exercice à reprendre", lines: [L("Repos. On reprendra l'exercice.", "pouting")] },
  },
  relationNote: "Lineva déteste l'à-peu-près : votre lien en garde la trace.",
  trapLabels: { aura: "Ordre" },
  relay: [L("Un point. Pas le dernier.", "smirk"), L("Ne ralentissez pas.", "passionate")],
  autoNote: L("Pas de démonstration. Je veux vos mains, pas un spectacle.", "annoyed"),
};
