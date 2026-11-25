/*
 * Jeu de rythme intime · fiches personnages (lot 0).
 *
 * Module technique (exclu de l'enveloppe Studio, voir SKIP_MODULES) : difficulté
 * recommandée, cadences par geste, palette, banque de voix, comportements de jeu
 * et barème de relation. Les bulles et les titres vivent dans rhythm-bubbles*.ts
 * (modifiables depuis le Studio). Aucun texte de scène n'est copié ici : les
 * séquences affichées pendant le jeu sont lues dans le catalogue de la scène.
 *
 * Décisions de Valentin (25 novembre 2026) : trois fins selon la performance,
 * une bulle finale du personnage, et une baisse de relation sur « tâtonnement »
 * selon le personnage (Hylee, Allenna, Naïah 0 ; Remerii, Lineva, Valurn −1 ;
 * Bellirith −2), une seule fois par scène, en Chronique seulement.
 */
import type { RhythmDifficulty } from "./rhythm-intimacy-engine";

/** Banque de voix d'un personnage : dossier sous assets/audio/rythme/ et nombre d'extraits par groupe. */
export type RhythmVoiceBank = {
  /** Sous-dossier des extraits (vide : voix de Hylee, à la racine du dossier rythme). */
  dir: string;
  groups: Partial<Record<"souffle" | "soupir" | "gemit" | "halete" | "apogee" | "bouche" | "etouffe" | "langue" | "rire", number>>;
};

/** Scènes à plusieurs : une voix par personne, désignée dans l'ancrage par sa clé (« @A », « @L »). */
export type RhythmGroupVoice = {
  key: string;
  character: string;
  bank: RhythmVoiceBank;
  /** Ordres (vagues d'aura) seulement sur les phases de cette voix ; silence au bord sur sa première phase. */
  aura?: boolean;
  bord?: boolean;
};

export type RhythmProfile = {
  character: string;
  difficulty: RhythmDifficulty;
  /** Cadences en coups par minute (Normal) : main, bouche, langue, frottement, puis pénétration lente, moyenne, vive et montée finale. */
  bpm: { main: number; bouche: number; langue: number; frottement: number; penetration: [number, number, number]; ramp: [number, number] };
  /** Palette de l'interface (composantes RVB) : teinte vive et teinte profonde. */
  palette: { vive: string; profonde: string };
  voice: RhythmVoiceBank;
  behaviours: {
    /** Leurres : un tous les n coups simples. */
    baits?: number;
    /** Vagues d'aura : accélération brève (coups, facteur de tempo) annoncée par une pulsation une mesure avant. */
    aura?: { strokes: number; factor: number };
    /** Lineva : les vagues d'aura (ses ordres) touchent aussi les phases à motif (mains, bouches, frottement). */
    auraMotifs?: boolean;
    /** Silences au bord : battements de silence. */
    bord?: { beats: number };
    /** Ruptures écrites : la piste gèle (il ne faut rien toucher). Sinon, simple accalmie. */
    gel?: boolean;
    /** Coup pour coup : appel et réponse dans les scènes de duel. */
    appel?: boolean;
    /** Remerii, « la mesure » : une suite de coups réguliers (écart faible, même en « Bien ») est notée d'une bulle et d'un petit bonus de jauge. */
    mesure?: { window: number; spreadMs: number };
    /** Remerii, « voix retenue » : en extérieur (rendez-vous), ses gémissements de paliers sont assourdis ; au logis, pleins. */
    retenue?: boolean;
    /** Remerii, « au fond » : tenue finale plus longue (secondes) que les autres fiches (3,2 s). */
    deepHold?: number;
  };
  /** Poids de la Résistance dans la fin obtenue (0 : la justesse seule). */
  resistanceWeight: number;
  /** Baisse de relation (affection) sur « tâtonnement », une fois par scène, en Chronique seulement. */
  relationPenalty: number;
  /** Scènes à plusieurs : baisse par personnage (remplace relationPenalty). */
  relationPenalties?: Record<string, number>;
  /** Scènes à plusieurs : banques de voix, la première sert par défaut. */
  voices?: RhythmGroupVoice[];
  /** Durée maximale d'affichage d'une phrase du texte (ms) : les séquences écrites sont plus longues que les bulles. */
  captionMaxMs: number;
  /** Humeurs du sprite intime par geste. */
  moods: Record<"main" | "bouche" | "langue" | "frottement" | "penetration" | "interlude" | "rire", string>;
};

export const RHYTHM_PROFILES: Record<string, RhythmProfile> = {
  bellirith: {
    character: "bellirith",
    difficulty: "intense",
    bpm: { main: 72, bouche: 84, langue: 96, frottement: 80, penetration: [66, 92, 118], ramp: [140, 168] },
    palette: { vive: "155,93,229", profonde: "92,38,140" },
    voice: { dir: "bellirith", groups: { souffle: 3, soupir: 2, gemit: 5, apogee: 2, rire: 7 } },
    behaviours: { baits: 5, aura: { strokes: 8, factor: 1.15 }, bord: { beats: 4 }, gel: true, appel: true },
    resistanceWeight: 0.1,
    relationPenalty: -2,
    captionMaxMs: 10000,
    moods: { main: "teasing", bouche: "hungry", langue: "sultry", frottement: "inviting", penetration: "smug", interlude: "haughty", rire: "smug" },
  },
  allenna: {
    character: "allenna",
    // Doux : elle avance par hésitations et revanches, jamais par pièges.
    difficulty: "doux",
    bpm: { main: 58, bouche: 64, langue: 74, frottement: 66, penetration: [52, 70, 90], ramp: [116, 136] },
    palette: { vive: "96,168,128", profonde: "150,90,50" },
    voice: { dir: "allenna", groups: { souffle: 4, soupir: 3, gemit: 7, apogee: 2, bouche: 4 } },
    behaviours: { bord: { beats: 4 } },
    resistanceWeight: 0,
    relationPenalty: 0,
    captionMaxMs: 10000,
    moods: { main: "shy", bouche: "seductive", langue: "troubled", frottement: "soft", penetration: "seductive", interlude: "soft", rire: "soft" },
  },
  lineva: {
    character: "lineva",
    // Normal, tempo vif : la capitaine donne des ordres (vagues d'aura annoncées) et ne ralentit jamais.
    difficulty: "normal",
    bpm: { main: 70, bouche: 80, langue: 92, frottement: 78, penetration: [70, 94, 118], ramp: [144, 166] },
    palette: { vive: "60,120,200", profonde: "20,40,80" },
    voice: { dir: "lineva", groups: { souffle: 3, soupir: 2, gemit: 6, apogee: 2 } },
    behaviours: { aura: { strokes: 6, factor: 1.2 }, auraMotifs: true },
    resistanceWeight: 0,
    relationPenalty: -1,
    captionMaxMs: 10000,
    moods: { main: "smirk", bouche: "teasing", langue: "passionate", frottement: "passionate", penetration: "passionate", interlude: "soft", rire: "smirk" },
  },
  "allenna-lineva": {
    character: "allenna-lineva",
    // À trois : cadence de Lineva adoucie par Allenna, ses ordres sur ses phases, l'hésitation d'Allenna sur la sienne.
    difficulty: "normal",
    bpm: { main: 64, bouche: 72, langue: 84, frottement: 72, penetration: [60, 82, 104], ramp: [130, 152] },
    palette: { vive: "96,168,128", profonde: "20,40,80" },
    voice: { dir: "allenna", groups: { souffle: 4, soupir: 3, gemit: 7, apogee: 2, bouche: 4 } },
    voices: [
      { key: "A", character: "allenna", bank: { dir: "allenna", groups: { souffle: 4, soupir: 3, gemit: 7, apogee: 2, bouche: 4 } }, bord: true },
      { key: "L", character: "lineva", bank: { dir: "lineva", groups: { souffle: 3, soupir: 2, gemit: 6, apogee: 2 } }, aura: true },
    ],
    behaviours: { aura: { strokes: 6, factor: 1.15 }, auraMotifs: true, bord: { beats: 4 } },
    resistanceWeight: 0,
    relationPenalty: -1,
    relationPenalties: { allenna: 0, lineva: -1 },
    captionMaxMs: 10000,
    moods: { main: "soft", bouche: "seductive", langue: "passionate", frottement: "soft", penetration: "passionate", interlude: "soft", rire: "soft" },
  },
  hylee: {
    character: "hylee",
    // Doux (référence) : cadences du prototype, sa voix unique (MagicalMysticVA) à la racine du dossier rythme, aucun piège.
    difficulty: "doux",
    bpm: { main: 64, bouche: 72, langue: 84, frottement: 70, penetration: [56, 76, 98], ramp: [122, 150] },
    palette: { vive: "231,101,136", profonde: "200,40,70" },
    voice: { dir: "", groups: { souffle: 5, soupir: 5, gemit: 12, halete: 6, apogee: 3, bouche: 4, etouffe: 5, langue: 4 } },
    behaviours: {},
    resistanceWeight: 0,
    relationPenalty: 0,
    captionMaxMs: 10000,
    moods: { main: "teasing", bouche: "seductive", langue: "tender", frottement: "seductive", penetration: "seductive", interlude: "soft", rire: "teasing" },
  },
  remerii: {
    character: "remerii",
    // Normal, métronomique : elle mesure votre régularité plus que votre perfection, retient sa voix dehors et vous garde au fond.
    difficulty: "normal",
    bpm: { main: 66, bouche: 76, langue: 88, frottement: 72, penetration: [62, 82, 104], ramp: [128, 150] },
    palette: { vive: "58,86,170", profonde: "18,26,64" },
    voice: { dir: "remerii", groups: { souffle: 5, soupir: 3, gemit: 8, apogee: 2 } },
    behaviours: { mesure: { window: 8, spreadMs: 30 }, retenue: true, deepHold: 5 },
    resistanceWeight: 0,
    relationPenalty: -1,
    captionMaxMs: 10000,
    moods: { main: "inviting", bouche: "teasing", langue: "soft", frottement: "smirk", penetration: "inviting", interlude: "soft", rire: "smirk" },
  },
};

/** Barème de relation validé (t232u, t233u), pour les lots à venir. */
export const RHYTHM_RELATION_PENALTIES: Record<string, number> = { hylee: 0, allenna: 0, naiah: 0, remerii: -1, lineva: -1, valurn: -1, bellirith: -2 };

/** Voix retenues (t224u à t233u), une seule par personnage. Bellirith (lot 1), Allenna, Lineva et leur trio (lots 4 à 6), Remerii (lot 7), Hylee (lot 8, prototype réaligné) sont branchés. */
export const RHYTHM_VOICES: Record<string, string> = {
  hylee: "MagicalMysticVA", bellirith: "aarrnnoo", valurn: "Teebee_Deael", lineva: "Vidrik", naiah: "DarkNightPrincess", remerii: "epanody", allenna: "guinefurrie",
};

export function rhythmProfileFor(character: string): RhythmProfile | undefined { return RHYTHM_PROFILES[character]; }
