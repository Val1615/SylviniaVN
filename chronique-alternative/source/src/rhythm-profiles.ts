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
    /** Silences au bord : battements de silence. */
    bord?: { beats: number };
    /** Ruptures écrites : la piste gèle (il ne faut rien toucher). Sinon, simple accalmie. */
    gel?: boolean;
    /** Coup pour coup : appel et réponse dans les scènes de duel. */
    appel?: boolean;
  };
  /** Poids de la Résistance dans la fin obtenue (0 : la justesse seule). */
  resistanceWeight: number;
  /** Baisse de relation (affection) sur « tâtonnement », une fois par scène, en Chronique seulement. */
  relationPenalty: number;
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
};

/** Barème de relation validé (t232u, t233u), pour les lots à venir. */
export const RHYTHM_RELATION_PENALTIES: Record<string, number> = { hylee: 0, allenna: 0, naiah: 0, remerii: -1, lineva: -1, valurn: -1, bellirith: -2 };

/** Voix retenues (t224u à t233u), une seule par personnage. Seule la fiche Bellirith est branchée dans ce lot. */
export const RHYTHM_VOICES: Record<string, string> = {
  hylee: "MagicalMysticVA", bellirith: "aarrnnoo", valurn: "Teebee_Deael", lineva: "Vidrik", naiah: "DarkNightPrincess", remerii: "epanody", allenna: "guinefurrie",
};

export function rhythmProfileFor(character: string): RhythmProfile | undefined { return RHYTHM_PROFILES[character]; }
