import type { DialogueLine } from "./game-data";

/*
 * Jeu de rythme intime · textes communs aux fiches personnages (modifiables depuis le Studio).
 *
 * Seuls contenus nouveaux du jeu : les noms des phases, les consignes et les
 * petites bulles des personnages (rhythm-bubbles-<perso>.ts). Le texte des
 * séquences, lui, vient toujours de la scène écrite, sans aucune réécriture.
 */

export type RhythmCharacterBubbles = {
  /** Titre du jeu (suivi du titre de la scène). */
  title: string;
  /** Consigne affichée avant de commencer. */
  instruction: string;
  /** Bulles courtes au fil des coups réussis, par geste, de plus en plus intenses. */
  voice: Record<"main" | "bouche" | "langue" | "frottement" | "penetration", DialogueLine[]>;
  /** Taquineries après un raté. */
  teases: DialogueLine[];
  /** Leurre ignoré, leurre touché, silence tenu, silence rompu, vague d'aura qui arrive. */
  resisted: DialogueLine[];
  ceded: DialogueLine[];
  bordHeld: DialogueLine[];
  bordBroken: DialogueLine[];
  aura: DialogueLine[];
  /** Coup pour coup : son appel, votre réponse réussie. */
  call: DialogueLine[];
  /** Trois fins : titre du bilan et bulle de commentaire du personnage, bonne, neutre ou mauvaise. */
  endings: Record<"embrasement" | "accord" | "tatonnement", { title: string; lines: DialogueLine[] }>;
  /** Mention affichée au bilan quand la relation baisse (Chronique seulement). */
  relationNote: string;
  /** Noms de pièges propres au personnage (les ordres de Lineva, par exemple), sinon les noms communs. */
  trapLabels?: Partial<Record<keyof typeof RHYTHM_TRAP_LABELS, string>>;
  /** Relais de sommets (scènes à plusieurs) : bulle quand une personne atteint son sommet au milieu de la scène. */
  relay?: DialogueLine[];
  /** Remarque affichée au bilan quand la démonstration automatique a joué. */
  autoNote?: DialogueLine;
};

/** Noms des phases et des cadences, communs à tous les personnages. */
export const RHYTHM_PHASE_LABELS = {
  main: "Caresses",
  mainJoueur: "Vos doigts",
  bouche: "Sa bouche",
  langue: "Votre bouche",
  frottement: "Peau contre peau",
  penetrationVertical: "Elle mène",
  penetrationProfondeur: "Au plus profond",
  interlude: "Ne touchez rien",
  bord: "Au bord",
};
export const RHYTHM_CADENCE_LABELS = {
  lent: "lent",
  moyen: "plus vif",
  vif: "vif",
  montee: "jusqu'au bout",
  gel: "la piste se fige",
  appel: "coup pour coup",
};
export const RHYTHM_TRAP_LABELS = {
  bait: "Leurre",
  resisted: "Résisté",
  ceded: "Cédé",
  bordHeld: "Tenu au bord",
  bordBroken: "Trop tôt",
  gel: "Ne touchez rien",
  gelNote: "silence",
  bordNote: "au bord",
  bordBanner: "Au bord : ne bougez plus",
  aura: "Aura",
  call: "Écoutez",
  answer: "À vous",
  resistance: "Résistance",
  recommended: "Recommandé",
  relay: "Sommet",
};
