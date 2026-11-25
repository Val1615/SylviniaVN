import type { DialogueLine } from "./game-data";
import type { RhythmCharacterBubbles } from "./rhythm-bubbles";

/*
 * Jeu de rythme intime · bulles de Remerii (modifiables depuis le Studio).
 *
 * Précise et directe : elle mesure, note la régularité plutôt que la perfection et assume
 * son désir sans détour. Vouvoiement, vocabulaire d'expérience (hypothèse, mesure, résultat),
 * bulles de deux à huit mots, jamais une phrase de la scène écrite réécrite.
 */

const R = (text: string, intimateMood: string): DialogueLine => ({ speaker: "Remerii", text, intimateMood });

export const REMERII_RHYTHM_BUBBLES: RhythmCharacterBubbles = {
  title: "Jeu de rythme",
  instruction: "Remerii mesure plus qu'elle ne juge : gardez des coups réguliers, même imparfaits, elle le remarque. Dehors, elle retient sa voix. Au sommet, tenez l'appui jusqu'au bout.",
  voice: {
    main: [R("Gardez cette mesure.", "inviting"), R("Régulier. C'est noté.", "smirk"), R("Encore une fois, identique.", "teasing")],
    bouche: [R("Laissez-moi compter.", "teasing"), R("Votre souffle me renseigne.", "smirk"), R("Hypothèse confirmée.", "teasing")],
    langue: [R("Là. Ne déplacez rien.", "soft"), R("Exactement ce point.", "soft"), R("Ne changez pas la courbe.", "inviting")],
    frottement: [R("Pas encore. Patience.", "smirk"), R("Je choisis l'angle.", "teasing"), R("Plus près. Voilà.", "inviting")],
    penetration: [R("Gardez cette mesure.", "inviting"), R("Plus profond.", "inviting"), R("Résultat satisfaisant.", "smirk"), R("Restez au fond.", "soft")],
  },
  teases: [
    R("Écart notable. Reprenez.", "strict"),
    R("Vous avez perdu le compte.", "smirk"),
    R("Recommençons à la mesure.", "strict"),
    R("Je n'ai pas demandé de variation.", "teasing"),
  ],
  resisted: [R("Bien. Aucune précipitation.", "smirk")],
  ceded: [R("Trop tôt. Je le note.", "strict")],
  bordHeld: [R("Maîtrise remarquable.", "smirk")],
  bordBroken: [R("Vous anticipez. Dommage.", "strict")],
  aura: [R("Accélérez. Un peu.", "inviting")],
  call: [R("À vous de répondre.", "teasing")],
  mesure: [R("Écart minime. Excellent.", "smirk"), R("Cette régularité me plaît.", "inviting"), R("Gardez exactement ce tempo.", "soft")],
  endings: {
    embrasement: { title: "Hypothèse confirmée", lines: [R("Résultat au-delà de mes prévisions.", "inviting")] },
    accord: { title: "Résultat satisfaisant", lines: [R("Satisfaisant. Je propose une seconde mesure.", "smirk")] },
    tatonnement: { title: "Résultat insuffisant", lines: [R("Résultat insuffisant. Nous recommencerons.", "strict")] },
  },
  relationNote: "Remerii mesure tout, l'à-peu-près aussi : votre lien en garde la trace.",
};
