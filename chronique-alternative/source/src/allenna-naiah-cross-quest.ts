import type { CrossQuestProgress } from "./cross-quests";
import { AN_BOND } from "./allenna-naiah-kit";
import { hydrateANMini, newANMini, anMiniSummary, type ANMiniState } from "./allenna-naiah-minigame";
import { AN_MOMENT_IDS, AN_QUEST_IDS, AN_BORDEREAU, anScene } from "./allenna-naiah-scenes-b";
import type { ANRelation, ANSceneContext, ANSceneData } from "./allenna-naiah-scenes";
import { AN_DATE_BRANCHES, AN_DATE_IDS, AN_DATE_SHORT, anBranchFromPicks, anDateScene, type ANDateContext, type ANDateId } from "./allenna-naiah-dates";
import { AN_LAKE_EXTENSIONS } from "./allenna-naiah-intimacy-lake";
import { AN_RELAY_EXTENSIONS } from "./allenna-naiah-intimacy-relay";
import { AN_HOME_EXTENSIONS } from "./allenna-naiah-intimacy-home";
import type { ANExtension } from "./allenna-naiah-intimacy-types";

/**
 * Quête croisée Allenna × Naïah « Les fils sous la cendre ».
 * Débute après la destruction du leurre (fin de l’Acte I). L’état vit dans
 * CrossQuestProgress.an ; aucune clé de GROUP_DATES n’est touchée.
 * Sauvegardes : un progrès sans `an` est hydraté proprement ; rien n’est inventé.
 */

export const AN_KEY = "allenna-naiah";
export const AN_STAGE_TOTAL = 8; // Q1..Q7 + enquête
export const AN_TITLES = [
  "Ce que les pierres ont gardé", "La sœur à la porte", "L’invitée qui n’existe pas", "Les registres menteurs",
  "Les fils sous la cendre", "Une seconde main", "Les portes se referment", "Une route pour revenir",
];
export const AN_OBJECTIVES = [
  "Rejoindre Naïah aux ruines du faux portail, dans la Forêt Interdite.",
  "Retrouver Allenna au poste obscurci de la lisière des brumes.",
  "Entrer dans Akuhn’Nabad par la poterne des fondeurs, de nuit.",
  "Ouvrir l’enquête dans l’aile des registres de transit.",
  "Reconstituer la chaîne : traces, registres et chemins.",
  "Examiner le dépôt secondaire de l’ancienne citerne.",
  "Sortir de la Cité avec ce qui peut l’être.",
  "Retrouver les deux sœurs au sanctuaire de Naïah.",
];

export type ANCheckpoint = { sceneId: string; round: number; picks: string[] };
export type ANDateState = { branch?: string; day: number; ext?: "pending" | "lived" | "stopped"; extPicks?: string[] };
export type ANExtCheckpoint = { id: string; seq: number; picks: Record<string, string> };
export type ANState = {
  choices: Record<string, string[]>;
  checkpoint?: ANCheckpoint;
  /** Jour de fin de chaque scène (attentes « le lendemain »). */
  days: Record<string, number>;
  mini?: ANMiniState;
  /** Jour de fin de l’enquête. */
  miniDay?: number;
  dates: Partial<Record<ANDateId, ANDateState>>;
  extCheckpoint?: ANExtCheckpoint;
  completed?: boolean;
};

const KNOWN = new Set<string>([...AN_QUEST_IDS, ...AN_MOMENT_IDS, ...AN_DATE_IDS]);
export const AN_EXTENSIONS: ANExtension[] = [...AN_LAKE_EXTENSIONS, ...AN_RELAY_EXTENSIONS, ...AN_HOME_EXTENSIONS];
export const anExtension = (id: string) => AN_EXTENSIONS.find((e) => e.id === id);

type UnlockGame = { flags: string[]; relationships: Record<string, { stage: number; met?: boolean } | undefined> };

export function anUnlockChecks(game: UnlockGame) {
  const a = game.relationships.allenna, n = game.relationships.naiah;
  return [
    { id: "act1", label: "Acte I terminé", ok: game.flags.some((f) => f === "main-story-act-1-complete" || f === "main-story-complete") },
    { id: "decoy", label: "Leurre des ruines détruit", ok: game.flags.includes("story-decoy-destroyed") || game.flags.includes("main-story-act-1-complete") },
    { id: "allenna", label: "Relation Allenna à l’étape 2", ok: Boolean(a && a.stage >= 2) },
    { id: "naiah", label: "Relation Naïah à l’étape 2", ok: Boolean(n && n.stage >= 2) },
    { id: "met", label: "Allenna et Naïah rencontrées", ok: Boolean(a?.met && n?.met) },
  ];
}
export const anUnlocked = (game: UnlockGame) => anUnlockChecks(game).every((c) => c.ok);

export function createANProgress(day: number): CrossQuestProgress {
  return { id: AN_KEY, stage: 0, startedDay: day, stageStartedDay: day, letters: [], an: { choices: {}, days: {}, dates: {} } };
}

function provenStage(an: Pick<ANState, "choices" | "mini">): number {
  const done = (id: string) => Boolean(an.choices[id]);
  let stage = 0;
  for (const id of ["cross-an-01", "cross-an-02", "cross-an-03", "cross-an-04"]) { if (!done(id)) return stage; stage++; }
  if (!an.mini?.complete) return stage;
  stage++;
  for (const id of ["cross-an-05", "cross-an-06", "cross-an-07"]) { if (!done(id)) return stage; stage++; }
  return stage;
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Hydratation défensive (sauvegardes v18 sans `an`, champs corrompus). Idempotente. */
export function hydrateAN(progress: CrossQuestProgress): CrossQuestProgress {
  const src = (progress.an && typeof progress.an === "object" ? progress.an : {}) as Partial<ANState>;
  const choices = src.choices && typeof src.choices === "object"
    ? Object.fromEntries(Object.entries(src.choices).filter(([id, picks]) => KNOWN.has(id) && Array.isArray(picks) && picks.every((p) => typeof p === "string")))
    : {};
  const days = src.days && typeof src.days === "object" ? Object.fromEntries(Object.entries(src.days).filter(([id, d]) => KNOWN.has(id) && isNum(d))) : {};
  const cp = src.checkpoint;
  const checkpoint = cp && typeof cp.sceneId === "string" && KNOWN.has(cp.sceneId) && Number.isInteger(cp.round) && cp.round >= -1 && Array.isArray(cp.picks) && cp.picks.every((p) => typeof p === "string")
    ? { sceneId: cp.sceneId, round: cp.round, picks: [...cp.picks] } : undefined;
  const mini = src.mini || choices["cross-an-04"] ? hydrateANMini(src.mini) : undefined;
  const dates: ANState["dates"] = {};
  for (const id of AN_DATE_IDS) {
    const raw = src.dates?.[id];
    const branch = choices[id] ? anBranchFromPicks(id, choices[id]) : undefined;
    if (!branch) continue;
    const ext = raw?.ext === "lived" || raw?.ext === "stopped" || raw?.ext === "pending" ? raw.ext : undefined;
    dates[id] = { branch, day: isNum(raw?.day) ? raw!.day : days[id] || 1, ext, extPicks: Array.isArray(raw?.extPicks) ? raw!.extPicks.filter((p) => typeof p === "string") : undefined };
  }
  const ec = src.extCheckpoint;
  const extCheckpoint = ec && typeof ec.id === "string" && anExtension(ec.id) && Number.isInteger(ec.seq) && ec.seq >= 0 && ec.seq < 12 && ec.picks && typeof ec.picks === "object"
    ? { id: ec.id, seq: ec.seq, picks: Object.fromEntries(Object.entries(ec.picks).filter(([, v]) => typeof v === "string")) as Record<string, string> } : undefined;
  let stage = Math.max(0, Math.min(AN_STAGE_TOTAL, Math.trunc(Number(progress.stage) || 0)));
  const proven = provenStage({ choices, mini });
  if (stage !== proven) stage = proven;
  return {
    ...progress, id: AN_KEY, stage, letters: [],
    startedDay: Math.max(1, Number(progress.startedDay) || 1), stageStartedDay: Math.max(1, Number(progress.stageStartedDay) || 1),
    an: { choices, checkpoint, days, mini, miniDay: isNum(src.miniDay) ? src.miniDay : undefined, dates, extCheckpoint, completed: stage >= AN_STAGE_TOTAL },
  };
}

/** Emplacement d’Amanea fourni par la page (itinéraire réel). */
export type AmaneaWhere = { location?: string; travelTo?: string };

/**
 * Garde-fou canonique : Amanea et Naïah ne se trouvent jamais au même endroit.
 * Forêt : rien n’est jouable quand Amanea y séjourne. Halte du fleuve : rien n’est jouable quand Amanea voyage.
 */
export function anAmaneaBlocks(location: string, amanea: AmaneaWhere | undefined): string | undefined {
  if (!amanea) return undefined;
  if (location === "forbidden" && amanea.location === "forbidden") return "Amanea séjourne dans la Forêt Interdite. Allenna refuse toute rencontre tant qu’elle n’en est pas repartie.";
  if (location === "river-halt" && !amanea.location) return "Amanea est sur la route du fleuve. Allenna repousse la halte à son retour.";
  return undefined;
}

export type ANAvailability = { scenes: string[]; mini: boolean; wait?: string; blocked?: string; dates: ANDateId[] };

const SCENE_LOCATION: Record<string, string> = {
  "cross-an-01": "forbidden", "cross-an-02": "forbidden", "cross-an-03": "akuhn", "cross-an-04": "akuhn", "cross-an-05": "akuhn",
  "cross-an-06": "akuhn", "cross-an-07": "forbidden", "cross-an-m1": "forbidden", "cross-an-m2": "forbidden",
  "group-date-allenna-naiah-lake": "forbidden", "group-date-allenna-naiah-relay": "river-halt", "group-date-allenna-naiah-home": "home",
};
export const anSceneLocation = (id: string) => SCENE_LOCATION[id];

export function anAvailable(progress: CrossQuestProgress | undefined, day: number, amanea?: AmaneaWhere, hasHome = true): ANAvailability {
  const an = progress?.an;
  if (!progress || !an) return { scenes: [], mini: false, dates: [] };
  const next = AN_QUEST_IDS.find((id) => !an.choices[id]);
  const guard = (ids: string[]) => {
    let blocked: string | undefined;
    const ok = ids.filter((id) => { const why = anAmaneaBlocks(SCENE_LOCATION[id], amanea); if (why) blocked = blocked || why; return !why; });
    return { ok, blocked };
  };
  if (next) {
    const waitAfter: Record<string, string> = { "cross-an-02": "cross-an-01", "cross-an-03": "cross-an-02", "cross-an-07": "cross-an-06" };
    const prev = waitAfter[next];
    if (prev && an.days[prev] !== undefined && day <= an.days[prev]) {
      const label = next === "cross-an-02" ? "Allenna répondra demain, au poste de la lisière." : next === "cross-an-03" ? "La relève de la porte basse change la nuit prochaine." : "Les deux sœurs vous attendent demain soir au sanctuaire.";
      return { scenes: [], mini: false, wait: label, dates: [] };
    }
    if (next === "cross-an-05" && !an.mini?.complete) return { scenes: [], mini: Boolean(an.choices["cross-an-04"]), dates: [] };
    const { ok, blocked } = guard([next]);
    return { scenes: ok, mini: false, blocked, dates: [] };
  }
  // Série achevée : moments libres et rendez-vous.
  const moments = AN_MOMENT_IDS.filter((id) => !an.choices[id] && (id === "cross-an-m1" ? day > (an.days["cross-an-07"] || 0) : Boolean(an.choices["cross-an-m1"]) && day > (an.days["cross-an-m1"] || 0)));
  const openDates = AN_DATE_IDS.filter((id) => !an.choices[id] && (hasHome || id !== "group-date-allenna-naiah-home"));
  const g1 = guard([...moments]);
  const g2 = guard(openDates.filter((id) => id !== "group-date-allenna-naiah-home"));
  const dates = [...(g2.ok as ANDateId[]), ...(openDates.includes("group-date-allenna-naiah-home") ? ["group-date-allenna-naiah-home" as ANDateId] : [])];
  return { scenes: g1.ok, mini: false, blocked: g1.blocked || g2.blocked, dates: AN_DATE_IDS.filter((id) => dates.includes(id)) };
}

/** Fin d’une scène (quête, moment ou rendez-vous). Idempotente. */
export function finishANScene(progress: CrossQuestProgress, sceneId: string, picks: readonly string[], day: number): CrossQuestProgress {
  const an = progress.an || { choices: {}, days: {}, dates: {} };
  if (an.choices[sceneId]) return { ...progress, an: { ...an, checkpoint: undefined } };
  const choices = { ...an.choices, [sceneId]: [...picks] };
  const next: ANState = { ...an, choices, days: { ...an.days, [sceneId]: day }, checkpoint: undefined };
  if (sceneId === "cross-an-04" && !next.mini) next.mini = newANMini();
  if ((AN_DATE_IDS as readonly string[]).includes(sceneId)) {
    const id = sceneId as ANDateId;
    const branch = anBranchFromPicks(id, picks);
    const prolonged = picks.some((p) => p.endsWith("-prolonger"));
    const declined = picks.some((p) => p.endsWith("-attendre"));
    next.dates = { ...an.dates, [id]: { branch, day, ext: prolonged || declined ? "pending" : undefined } };
  }
  const stage = Math.max(progress.stage, provenStage(next));
  next.completed = stage >= AN_STAGE_TOTAL;
  return { ...progress, stage, stageStartedDay: stage !== progress.stage ? day : progress.stageStartedDay, an: next };
}

/** Sauvegarde après chaque action. Une enquête résolue n’est plus jamais réécrite (le rejeu reste local). */
export function anSaveMini(progress: CrossQuestProgress, mini: ANMiniState, day: number): CrossQuestProgress {
  const an = progress.an || { choices: {}, days: {}, dates: {} };
  if (an.mini?.complete) return progress;
  const next: ANState = { ...an, mini, miniDay: mini.complete ? day : an.miniDay };
  const stage = Math.max(progress.stage, provenStage(next));
  return { ...progress, stage, stageStartedDay: stage !== progress.stage ? day : progress.stageStartedDay, an: next };
}

export function anSaveExtCheckpoint(progress: CrossQuestProgress, cp: ANExtCheckpoint | undefined): CrossQuestProgress {
  const an = progress.an; if (!an) return progress;
  return { ...progress, an: { ...an, extCheckpoint: cp } };
}

export function finishANExtension(progress: CrossQuestProgress, extId: string, completed: boolean, picks: Record<string, string>): CrossQuestProgress {
  const an = progress.an; const ext = anExtension(extId);
  if (!an || !ext) return progress;
  const dateId = AN_DATE_IDS.find((id) => AN_DATE_SHORT[id] === ext.date)!;
  const d = an.dates[dateId];
  if (!d || d.ext === "lived") return { ...progress, an: { ...an, extCheckpoint: undefined } };
  return { ...progress, an: { ...an, extCheckpoint: undefined, dates: { ...an.dates, [dateId]: { ...d, ext: completed ? "lived" : "stopped", extPicks: Object.values(picks) } } } };
}

/** Extension en attente pour un rendez-vous déjà vécu (prolongation remise à plus tard). */
export function anPendingExtensions(progress: CrossQuestProgress | undefined): string[] {
  const an = progress?.an; if (!an) return [];
  return AN_DATE_IDS.flatMap((id) => { const d = an.dates[id]; return d?.branch && (d.ext === "pending" || d.ext === "stopped") ? [`an-ext:${AN_DATE_SHORT[id]}:${d.branch}`] : []; });
}

export function anExtEffects(romance: boolean) {
  return { allenna: { affection: 3, trust: 2, ...(romance ? { desire: 2 } : {}) }, naiah: { affection: 2, trust: 3 } };
}

export function anOrientation(progress?: CrossQuestProgress): ANDateContext["orientation"] {
  const pick = progress?.an?.choices["cross-an-07"]?.find((p) => /cross-an-07-(partenariat|confiance|complicite)$/.test(p));
  return pick ? pick.replace("cross-an-07-", "") as ANDateContext["orientation"] : undefined;
}

/** Lien fraternel 0..10, recalculé depuis les choix enregistrés. */
export function anSisterBond(progress?: CrossQuestProgress): number {
  const an = progress?.an; if (!an) return 0;
  let bond = 0;
  for (const picks of Object.values(an.choices)) for (const p of picks) bond += AN_BOND[p] || 0;
  return Math.max(0, Math.min(10, bond));
}

/** Flags dérivés stables (idempotents). Les noms suivent la consigne. */
export function anFlags(progress: CrossQuestProgress): string[] {
  const an = progress.an; if (!an) return [];
  const flags: string[] = [];
  if (an.choices["cross-an-01"]) flags.push("cross-an-started");
  for (const id of [...AN_QUEST_IDS, ...AN_MOMENT_IDS]) if (an.choices[id]) flags.push(`${id}-done`);
  if (an.mini?.complete) {
    flags.push("cross-an-mini-complete", "cross-an-internal-modification-found");
    if (anMiniSummary(an.mini).transmission) flags.push("an-transmission-sans-finalite");
  }
  if (an.choices["cross-an-05"]) flags.push("knows_tellia_name", "has_tellia_portal_document");
  const orientation = anOrientation(progress);
  if (orientation) flags.push(`an-orientation:${orientation}`);
  for (const id of AN_DATE_IDS) {
    const d = an.dates[id];
    if (d?.branch) flags.push(`${id}-done`, `an-date:${AN_DATE_SHORT[id]}:${d.branch}`);
    if (d?.ext === "lived") flags.push(`an-ext-lived:${AN_DATE_SHORT[id]}`);
  }
  if (an.completed) flags.push("cross-an-series-complete");
  if (anSisterBond(progress) >= 6) flags.push("an-sisters-bond-strong");
  return flags;
}
export const AN_ALL_FLAG_PREFIXES = ["cross-an-", "an-orientation:", "an-date:", "an-ext-lived:", "an-transmission", "an-sisters-", "group-date-allenna-naiah-", "knows_tellia_name", "has_tellia_portal_document"];

export type ANGame = { flags: string[]; relationships: Record<string, (ANRelation & { met?: boolean }) | undefined> };

export function anSceneContext(game: ANGame, progress?: CrossQuestProgress): ANSceneContext {
  const an = progress?.an;
  return {
    flags: [...game.flags, ...(progress ? anFlags(progress) : [])], picks: an?.choices || {},
    allenna: game.relationships.allenna, naiah: game.relationships.naiah,
    mini: an?.mini?.complete ? { transmission: anMiniSummary(an.mini).transmission, ops: an.mini.ops } : undefined,
    datesDone: AN_DATE_IDS.filter((id) => an?.dates[id]?.branch),
  };
}

export function anDateContext(game: ANGame, progress: CrossQuestProgress | undefined, home: ANDateContext["home"], dev = false): ANDateContext {
  const an = progress?.an;
  const a = game.relationships.allenna, n = game.relationships.naiah;
  const eligible = dev || Boolean(a && n && a.affection >= 20 && a.trust >= 20 && n.affection >= 20 && n.trust >= 20);
  return {
    done: AN_DATE_IDS.filter((id) => an?.dates[id]?.branch), orientation: anOrientation(progress), eligible, home,
    branches: Object.fromEntries(AN_DATE_IDS.flatMap((id) => an?.dates[id]?.branch ? [[id, an.dates[id]!.branch!]] : [])),
  };
}

export function anBuildScene(id: string, game: ANGame, progress: CrossQuestProgress | undefined, home?: ANDateContext["home"], dev = false): ANSceneData | undefined {
  if ((AN_DATE_IDS as readonly string[]).includes(id)) return anDateScene(id as ANDateId, anDateContext(game, progress, home, dev));
  return anScene(id, anSceneContext(game, progress));
}

export const AN_SCENE_TITLES: Record<string, string> = {
  "cross-an-01": "Ce que les pierres ont gardé", "cross-an-02": "La sœur à la porte", "cross-an-03": "L’invitée qui n’existe pas",
  "cross-an-04": "Les registres menteurs", "cross-an-05": "Une seconde main", "cross-an-06": "Les portes se referment",
  "cross-an-07": "Une route pour revenir", "cross-an-m1": "La carte corrigée", "cross-an-m2": "La pierre à aiguiser",
  "group-date-allenna-naiah-lake": "Le lac de brume", "group-date-allenna-naiah-relay": "La halte du Fleuve bleu", "group-date-allenna-naiah-home": "Un seuil pour trois",
};

/** Correspondance post-rendez-vous (section 9 du pack) : mot de Naïah après le lac, message d’Allenna après la halte. */
export const AN_NOTES: Record<string, { from: "naiah" | "allenna"; title: string; body: string }> = {
  "lake:barque": { from: "naiah", title: "Un mot plié en bateau", body: "La barque est revenue toute seule ce matin. Elle te réclame. Moi non, évidemment. Reviens quand même. N." },
  "lake:rive": { from: "naiah", title: "Un mot humide", body: "Tes bottes ont oublié une chaussette sous le saule. Je la garde en otage. Rançon : une soirée. N." },
  "lake:lucioles": { from: "naiah", title: "Un mot qui luit", body: "Une luciole refuse de quitter la lanterne. Je crois qu’elle attend la suite de l’histoire. Moi aussi, un peu. N." },
  "relay:table": { from: "allenna", title: "Rapport de halte", body: "La convoyeuse m’a demandé de vos nouvelles au retour. J’ai répondu que vous étiez en bonne santé. Je l’ai vérifié. A." },
  "relay:des": { from: "allenna", title: "Note de service", body: "J’ai racheté des dés. Je m’entraîne. La prochaine fois, je gagnerai contre vous deux, sans tricher. A." },
  "relay:pluie": { from: "allenna", title: "Bulletin du fleuve", body: "Il a plu cette nuit sur la Cité. J’ai laissé un bol sur le rebord de ma fenêtre. C’est absurde. Je le laisse quand même. A." },
};

/** Variations de répliques au logis après la soirée (section 9). */
export const AN_HOME_ECHO: Record<string, string> = {
  cuisine: "Naïah a laissé un brin de thym séché sur la table, avec un mot : « Pour la prochaine omelette. Côté gauche seulement. »",
  objets: "Sur le rebord de la fenêtre, à l’endroit choisi par Allenna, un objet est apparu : un petit sifflet de patrouille, poli par l’usage.",
  toit: "Sur la lucarne, quelqu’un a tracé à la craie deux étoiles, une rouge et une blanche, reliées par un trait.",
};

export { AN_BORDEREAU, AN_DATE_BRANCHES };
