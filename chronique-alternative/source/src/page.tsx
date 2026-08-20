"use client";
/* eslint-disable @next/next/no-img-element -- sprites and map assets use dynamic canon paths */

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  CHARACTERS,
  GIFTS,
  INTRO_SCENE,
  LOCATIONS,
  PERIODS,
  ROUTE_SCENES,
  routeFlagRequirements,
  routeKnowledgeRequirements,
  type CharacterData,
  type ChoiceData,
  type DialogueLine,
  type Effects,
  type RouteScene,
  type StatKey,
} from "./game-data";
import { AMBIENT_LINES, type AmbientDialogue } from "./ambient-dialogues";
import {
  ALL_KNOWLEDGE_ENTRIES,
  INVITATIONS,
  LETTERS,
  RUMORS,
  SECRET_CONVERSATIONS,
  SPONTANEOUS_EVENTS,
  type InvitationTemplate,
  type LetterTemplate,
  type RumorTemplate,
  type SecretConversation,
  type SpontaneousEvent,
} from "./heritages-data";
import { SOCIAL_SCENES, type SocialScene } from "./social-scenes";
import { DATE_SCENES, type DateScene, type PlayerSex } from "./date-scenes";
import { INTIMACY_PROFILES, directionChapters, intimacyDirections, intimacyEnding, intimacyOpening, type IntimacyChoice, type IntimacyDirectionChoice } from "./intimacy-scenes";
import { HOME_INTIMACY_APPROACHES, homeIntimacyEnding, homeIntimacyOpening, homeIntimacyRoutes } from "./home-intimacy-routes";
import { INTIMACY_GAMES, intimacyGameResult, type IntimacyGameOption } from "./intimacy-games";
import {
  GROUP_DATES,
  GROUP_INTIMACY_GAMES,
  groupIntimacyEnding,
  groupIntimacyGameResult,
  groupIntimacyOpening,
  groupIntimacyRoutes,
  type GroupDateScene,
  type GroupIntimacyRoute,
} from "./group-dates";
import { enrichDialogueLines, moodForCharacter, speakerCharacterIds } from "./narrative-system";
import { MAIN_STORY, SUPPORTING_FIGURES, storyProgress } from "./story-data";
import { CAMPAIGN_SCENES, campaignSceneById, type CampaignScene } from "./campaign-scenes";
import { ROUTE_CONTEXTUAL_CHOICES } from "./route-contextual-choices";
import { sceneClosure } from "./scene-closures";
import { MUSIC_LABELS, musicForContext } from "./music-data";
import {
  DISPLAY_ITEMS,
  HOME_INTIMACY_CITY,
  HOUSING_PROPERTIES,
  STORY_KEEPSAKE_BY_CHARACTER,
  discountedPropertyPrice,
  displayItemById,
  emptyHousingState,
  housingDiscount,
  housingSaleValue,
  propertyById,
  type HousingState,
} from "./housing-data";
import {
  HOME_DATE_PROFILES,
  HOME_PAIR_DATES,
  RESIDENT_MOMENTS,
  availableSharedHomeMoment,
  homeDateOpening,
  pairDateOpening,
  type HomePairDateProfile,
  type HomeDateProfile,
  type HomeDateTone,
} from "./housing-scenes";
import { JOBS, JOB_KIND_LABELS, allJobRounds, jobCratesForSession, jobPathForSession, jobRoundOrder, jobSessionLabel, jobsAtSpot, type JobData, type JobOption, type JobRound } from "./jobs-data";
import {
  ASSEMBLY_PARTS,
  HARVEST_TOOLS,
  MARKET_TACTICS,
  MENU_CATEGORY_LABELS,
  PETITION_ACTIONS,
  ROTATION_LABELS,
  TAVERN_MENU,
  assemblyBlueprint,
  harvestNodes,
  inspectionRoom,
  marketCustomers,
  petitionDeck,
  serviceCustomers,
  serviceOrderIsValid,
  type HarvestSense,
  type MarketTactic,
  type MenuCategory,
} from "./advanced-jobs";
import {
  AMBIENT_SPOT_HINTS,
  DEFAULT_SPOTS,
  ROUTE_PERIODS,
  ROUTE_SPOTS,
  routineFor,
  spotById,
  spotsForLocation,
  travelWaypoint,
} from "./world-data";
import {
  SCOUT_VOCATION,
  advanceClock,
  contentBranchAllowed,
  injectedChoiceKind,
  routeChoiceCompletes,
  travelDurationLabel,
  travelPeriodCost,
} from "./gameplay-rules";

type Screen = "title" | "creator" | "game";
type Tab = "place" | "map" | "jobs" | "relations" | "journal" | "inventory" | "codex" | "options";
type Pronouns = "elle" | "il" | "iel";
type Intimacy = "tendre" | "suggestif" | "explicite" | "ellipse";

type Player = {
  name: string;
  age: number;
  pronouns: Pronouns;
  sex: PlayerSex;
  origin: string;
  vocation: string;
  trait: string;
  hair: string;
  eyes: string;
  skin: string;
  intimacy: Intimacy;
};

type Relationship = {
  affection: number;
  trust: number;
  desire: number;
  stage: number;
  met: boolean;
  gifts: number;
};

type GameSettings = {
  fontScale: number;
  reducedMotion: boolean;
  showImpact: boolean;
  music: boolean;
  volume: number;
  developer: boolean;
  noTimeCost: boolean;
  unlockAll: boolean;
};

type ReceivedLetter = {
  id: string;
  receivedDay: number;
  read: boolean;
  replyId?: string;
};

type ReceivedInvitation = {
  id: string;
  receivedDay: number;
  expiresDay: number;
  status: "pending" | "accepted" | "declined" | "expired";
};

type GameState = {
  version: 13;
  player: Player;
  day: number;
  period: number;
  location: string;
  spot: string;
  stats: Record<StatKey, number>;
  relationships: Record<string, Relationship>;
  inventory: Record<string, number>;
  coins: number;
  confluence: number;
  flags: string[];
  journal: string[];
  codex: string[];
  visitedLocations: string[];
  visitedSpots: string[];
  history: string[];
  ambientHistory: Record<string, string[]>;
  sharedHistory: string[];
  sceneMemories: Record<string, string>;
  dateHistory: string[];
  groupDateHistory: string[];
  knowledge: string[];
  secretHistory: string[];
  letters: ReceivedLetter[];
  invitations: ReceivedInvitation[];
  rumors: { id: string; heardDay: number }[];
  worldEventHistory: string[];
  livingWorldTick: string;
  jobRuns: Record<string, number>;
  housing: HousingState;
  settings: GameSettings;
};

type SceneView = {
  id: string;
  title: string;
  background: string;
  mood: string;
  character?: string;
  intro: DialogueLine[];
  choices?: ChoiceData[];
  kind: "intro" | "story" | "route" | "ambient" | "social" | "date" | "group-date" | "home" | "secret" | "world" | "invitation";
  route?: RouteScene;
  ambientId?: string;
  socialId?: string;
  date?: DateScene;
  groupDate?: GroupDateScene;
  homeMomentId?: string;
  homeMomentCharacters?: string[];
  secretId?: string;
  worldEventId?: string;
  invitationId?: string;
  campaignSceneId?: string;
  cast: string[];
};

type DialogueState = {
  scene: SceneView;
  lines: DialogueLine[];
  lineIndex: number;
  phase: "intro" | "choices" | "response";
  chosen?: ChoiceData;
  replay?: boolean;
};

type JobPhase = "briefing" | "memorize" | "play" | "perfect" | "success" | "failure";

type JobState = {
  jobId: string;
  sequence: string[];
  step: number;
  phase: JobPhase;
  round: number;
  score: number;
  mistakes: number;
  variant: number;
  leftWeight: number;
  rightWeight: number;
  pathPosition: number;
  pathSteps: number;
  timingPosition: number;
  timingDirection: 1 | -1;
  roundOrder: number[];
  combo: number;
  maxCombo: number;
  lastResult?: "correct" | "wrong";
  feedbackText?: string;
  serviceSelections: Partial<Record<MenuCategory, string>>;
  serviceTimeLeft: number;
  inspectionFound: string[];
  inspectionScanUsed: boolean;
  assemblySlots: (string | null)[];
  assemblyRotations: number[];
  assemblySelected?: string;
  assemblySelectedRotation: number;
  assemblyStage: "build" | "calibrate";
  assemblyTests: number;
  harvestTimeLeft: number;
  harvestTool: HarvestSense;
  harvestWave: number;
  harvestWaveScore: number;
  harvestPicked: string[];
  harvestRejected: string[];
  harvestFocus: number;
  harvestHinted?: string;
  harvestExamined?: string;
  marketPrice: number;
  marketTactic: MarketTactic;
  marketCounter: number;
  marketProfit: number;
  marketReputation: number;
  visited: number[];
};

type ModalState =
  | { kind: "chronicle" }
  | { kind: "shop" }
  | { kind: "character"; character: string }
  | { kind: "gift"; character: string }
  | { kind: "date-planner"; character: string }
  | { kind: "home-date"; character: string }
  | { kind: "home-pair-date"; pairId: string }
  | { kind: "home-date-result"; character: string; score: number }
  | { kind: "intimacy"; character: string; background?: string; replay?: boolean; dateId?: string; home?: boolean }
  | { kind: "date-result"; character: string; dateId: string }
  | { kind: "group-date-planner" }
  | { kind: "group-date-result"; groupDateId: string }
  | { kind: "group-intimacy"; groupDateId: string; background?: string; replay?: boolean }
  | { kind: "letter"; letterId: string }
  | { kind: "invitation"; invitationId: string }
  | { kind: "ritual" }
  | { kind: "job"; jobId: string }
  | { kind: "notice"; title: string; text: string; consumeTime?: boolean; actionLabel?: string }
  | null;

type IntimacyModalState = Extract<NonNullable<ModalState>, { kind: "intimacy" }>;
type GroupIntimacyModalState = Extract<NonNullable<ModalState>, { kind: "group-intimacy" }>;

type NotificationKind = "unlock" | "item" | "relation" | "story" | "codex" | "home" | "letter" | "invitation" | "rumor" | "knowledge";

type ChronicleNotification = {
  id: number;
  kind: NotificationKind;
  title: string;
  detail?: string;
};

type ChronicleNotificationDraft = Omit<ChronicleNotification, "id">;

const ECHOES = [
  ["Réflexe protecteur", "Votre corps se place instinctivement entre le danger et les autres"],
  ["Familiarité du pouvoir", "Les usages d’une cour inconnue vous semblent étrangement naturels"],
  ["Affinité des ombres", "Les magies inquiétantes éveillent moins de peur que de prudence"],
  ["Curiosité mécanique", "Les mécanismes et portails vous attirent sans souvenir précis"],
  ["Mémoire de la pierre", "Certains lieux éveillent des sensations que votre esprit ne peut nommer"],
] as const;

const VOCATIONS = [
  ["Cartographe des Échos", "Résonance +2 · perçoit les fractures", "resonance"],
  ["Diplomate itinérant·e", "Lucidité +2 · lit les sous-textes", "lucidite"],
  ["Éclaireur·se des routes", "Sang-froid +2 · voyage plus vite", "sangFroid"],
  ["Artisan·e arcanique", "Audace +1 · Résonance +1", "mixed"],
] as const;

const TRAITS = [
  ["Audace", "Répondre, provoquer, assumer ses envies", "audace"],
  ["Lucidité", "Observer juste et respecter les silences", "lucidite"],
  ["Sang-froid", "Rester fiable lorsque tout vacille", "sangFroid"],
  ["Résonance", "Sentir la magie avant de la comprendre", "resonance"],
] as const;

const STAT_LABELS: Record<StatKey, string> = {
  audace: "Audace",
  lucidite: "Lucidité",
  sangFroid: "Sang-froid",
  resonance: "Résonance",
};

const STAGE_LABELS = ["Inconnu·e", "Première impression", "Complicité", "Confidence", "Attirance", "Lien accompli"];
const BOND_THRESHOLDS = [0, 5, 14, 26, 40];
const SAVE_KEY = "sylvinia-liens-autosave";
const DEFAULT_PLAYER: Player = {
  name: "",
  age: 24,
  pronouns: "iel",
  sex: "intersexe",
  origin: ECHOES[0][0],
  vocation: VOCATIONS[0][0],
  trait: TRAITS[0][0],
  hair: "#321e2a",
  eyes: "#62d4c7",
  skin: "#c99175",
  intimacy: "suggestif",
};

const DEFAULT_SETTINGS: GameSettings = {
  fontScale: 100,
  reducedMotion: false,
  showImpact: false,
  music: true,
  volume: 36,
  developer: false,
  noTimeCost: false,
  unlockAll: false,
};

const ACTIVITIES: Record<string, { icon: string; label: string; detail: string; stat?: StatKey; coins?: number }> = {
  market: { icon: "◈", label: "Marché", detail: "Acheter des présents" },
  court: { icon: "♜", label: "Cour", detail: "Lire les jeux de pouvoir", stat: "lucidite" },
  rest: { icon: "☾", label: "Se reposer", detail: "Retrouver son ancrage" },
  archives: { icon: "▤", label: "Archives", detail: "Étudier les fractures", stat: "lucidite" },
  training: { icon: "⚔", label: "S’entraîner", detail: "Garder la maîtrise", stat: "sangFroid" },
  attunement: { icon: "✦", label: "S’accorder", detail: "Rituel de Résonance", stat: "resonance" },
  explore: { icon: "⌁", label: "Explorer", detail: "Suivre un chemin instable", stat: "audace" },
  harbor: { icon: "≋", label: "Observer les quais", detail: "Comprendre la chaîne portuaire", stat: "sangFroid" },
  workshop: { icon: "⚙", label: "Étudier l’atelier", detail: "Comprendre ses mécanismes", stat: "resonance" },
};

function emptyRelationships(): Record<string, Relationship> {
  return Object.fromEntries(CHARACTERS.map((character) => [character.id, { affection: 0, trust: 0, desire: 0, stage: 0, met: false, gifts: 0 }]));
}

function emptyAmbientHistory(): Record<string, string[]> {
  return Object.fromEntries(CHARACTERS.map((character) => [character.id, []]));
}

function playerStats(player: Player): Record<StatKey, number> {
  const stats: Record<StatKey, number> = { audace: 4, lucidite: 4, sangFroid: 4, resonance: 4 };
  const trait = TRAITS.find(([label]) => label === player.trait)?.[2] as StatKey | undefined;
  if (trait) stats[trait] += 3;
  const vocation = VOCATIONS.find(([label]) => label === player.vocation)?.[2];
  if (vocation === "mixed") {
    stats.audace += 1;
    stats.resonance += 1;
  } else if (vocation) {
    stats[vocation as StatKey] += 2;
  }
  return stats;
}

function createGame(player: Player): GameState {
  return {
    version: 13,
    player,
    day: 1,
    period: 0,
    location: "algratal",
    spot: "algratal-palace-quarters",
    stats: playerStats(player),
    relationships: emptyRelationships(),
    inventory: { tartelette: 1, the: 1 },
    coins: 32,
    confluence: 8,
    flags: [],
    journal: ["Saidin vous a recueilli·e à la sortie d’un portail défectueux.", "Vous savez instinctivement que cette réalité n’est pas la vôtre, mais vos souvenirs demeurent introuvables.", "Iriana enquête seule sur des irrégularités impériales ; aucune expédition commune n’a été constituée.", `Écho résiduel : ${player.origin} · Vocation choisie : ${player.vocation}.`],
    codex: ["La Confluence", "Al’Gratal"],
    visitedLocations: ["algratal"],
    visitedSpots: ["algratal-palace-quarters"],
    history: [],
    ambientHistory: emptyAmbientHistory(),
    sharedHistory: [],
    sceneMemories: {},
    dateHistory: [],
    groupDateHistory: [],
    knowledge: [],
    secretHistory: [],
    letters: [],
    invitations: [],
    rumors: [],
    worldEventHistory: [],
    livingWorldTick: "",
    jobRuns: {},
    housing: emptyHousingState(),
    settings: { ...DEFAULT_SETTINGS },
  };
}

function originLine(player: Player): DialogueLine {
  const lines: Record<string, string> = {
    "Réflexe protecteur": "Lorsque le portail crépite encore, votre corps se place entre Saidin et la fracture avant même que vous sachiez qui il est. Ce réflexe vous appartient ; le souvenir qui l’a forgé, lui, demeure absent.",
    "Familiarité du pouvoir": "Les appartements impériaux ne vous rappellent aucun lieu, pourtant vous reconnaissez instinctivement les distances, les silences et les portes réservées au pouvoir. Saidin refuse d’appeler cela une preuve d’origine.",
    "Affinité des ombres": "Les résidus sombres du portail glissent sur votre peau sans éveiller de souvenir ni de panique. Saidin note seulement que votre prudence ressemble à une habitude très ancienne.",
    "Curiosité mécanique": "Malgré l’amnésie, vos doigts cherchent aussitôt le défaut du mécanisme emprunté. Vous ne savez pas où vous avez appris ce geste ; Saidin ignore si la compétence vient de votre réalité d’origine ou du portail lui-même.",
    "Mémoire de la pierre": "Le marbre d’Al’Gratal vous paraît à la fois neuf et familier. Aucune image ne revient, seulement la certitude physique que la pierre de votre monde ne vibrait pas exactement ainsi.",
  };
  return { speaker: "Narration", text: lines[player.origin] || "Votre corps conserve des réflexes dont votre mémoire ne peut plus raconter l’origine." };
}

function hydrateGame(raw: unknown): GameState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<GameState> & { player?: Player };
  if (!value.player?.name) return null;
  const fresh = createGame(value.player);
  const location = LOCATIONS.some((entry) => entry.id === value.location) ? value.location! : fresh.location;
  const requestedSpot = typeof value.spot === "string" ? spotById(value.spot) : undefined;
  const savedProperty = propertyById(value.housing?.propertyId);
  const spotBelongsToSavedHome = Boolean(savedProperty && requestedSpot?.id === savedProperty.spot);
  const spot = requestedSpot?.location === location && (!requestedSpot.housing || spotBelongsToSavedHome)
    ? requestedSpot.id
    : (DEFAULT_SPOTS[location] || fresh.spot);
  const savedVersion = Number((raw as { version?: number }).version || 0);
  const legacyTimeline = savedVersion < 8;
  const resetCharacters = new Set(["iriana", "valurn", "bellirith", "amanea", "draven"]);
  const oldRelationships = Object.fromEntries(CHARACTERS.map((character) => {
    const saved = { ...fresh.relationships[character.id], ...(value.relationships?.[character.id] || {}) };
    if (!legacyTimeline || !resetCharacters.has(character.id)) return [character.id, saved];
    return [character.id, { ...fresh.relationships[character.id], gifts: saved.gifts }];
  }));
  const obsoleteRoute = (id: string) => legacyTimeline && /^(iriana|valurn|bellirith|amanea|draven)-[0-4]$/.test(id);
  const obsoleteFlag = (flag: string) => legacyTimeline && (
    flag === "main-story-complete" || flag === "amanea-platonic" ||
    /^(story-(amanea|draven|pact|allenna|naiah)|social:(amanea-family-truth|draven-lineva-letter|medig-window)|date(-intimate)?:date-amanea)/.test(flag)
  );
  const migratedFlags = (value.flags || []).filter((flag) => !obsoleteFlag(flag));
  const migratedRouteHistory = (value.history || []).filter((id) => !obsoleteRoute(id));
  const preserveCompletedCampaign = savedVersion >= 8 && savedVersion < 13 && migratedFlags.includes("main-story-complete");
  const migratedHistory = unique([
    ...migratedRouteHistory,
    ...(preserveCompletedCampaign ? CAMPAIGN_SCENES.map((scene) => scene.id) : []),
  ]);
  const migratedJournal = legacyTimeline
    ? ["Chronologie recalée : Amanea règne encore, Draven voyage vers l’Empire et le rassemblement d’Iriana n’a jamais eu lieu.", ...(value.journal || fresh.journal)]
    : (value.journal || fresh.journal);
  const rememberedSpots = unique([
    spot,
    ...Object.values(value.sceneMemories || {}),
    ...(value.history || []).map((id) => ROUTE_SPOTS[id]),
    ...(value.dateHistory || []).map((id) => DATE_SCENES.find((date) => date.id === id)?.spot),
    ...(value.groupDateHistory || []).map((id) => GROUP_DATES.find((date) => date.id === id)?.spot),
  ].filter((id): id is string => Boolean(id && spotById(id))));
  const visitedSpots = unique((value.visitedSpots || rememberedSpots).filter((id) => Boolean(spotById(id))));
  const visitedLocations = unique((value.visitedLocations || [location, ...visitedSpots.map((id) => spotById(id)?.location)])
    .filter((id): id is string => Boolean(id && LOCATIONS.some((entry) => entry.id === id))));
  return {
    ...fresh,
    ...value,
    version: 13,
    player: { ...fresh.player, ...value.player, sex: value.player.sex || "intersexe" },
    location,
    spot,
    stats: { ...fresh.stats, ...(value.stats || {}) },
    relationships: oldRelationships,
    inventory: { ...fresh.inventory, ...(value.inventory || {}) },
    settings: { ...DEFAULT_SETTINGS, ...(value.settings || {}) },
    flags: migratedFlags,
    journal: migratedJournal,
    codex: value.codex || fresh.codex,
    visitedLocations,
    visitedSpots,
    history: migratedHistory,
    ambientHistory: Object.fromEntries(CHARACTERS.map((character) => [character.id, legacyTimeline && ["amanea", "draven"].includes(character.id) ? [] : (value.ambientHistory?.[character.id] || [])])),
    sharedHistory: (value.sharedHistory || []).filter((id) => !legacyTimeline || !["amanea-family-truth", "draven-lineva-letter", "medig-window"].includes(id)),
    sceneMemories: value.sceneMemories || {},
    dateHistory: (value.dateHistory || []).filter((id) => !legacyTimeline || !id.startsWith("date-amanea")),
    groupDateHistory: value.groupDateHistory || [],
    knowledge: unique((value.knowledge || []).filter((id) => ALL_KNOWLEDGE_ENTRIES.some((entry) => entry.id === id))),
    secretHistory: unique((value.secretHistory || []).filter((id) => SECRET_CONVERSATIONS.some((entry) => entry.id === id))),
    letters: (value.letters || []).filter((entry) => LETTERS.some((letter) => letter.id === entry.id)).map((entry) => ({
      id: entry.id,
      receivedDay: Math.max(1, Number(entry.receivedDay) || 1),
      read: Boolean(entry.read),
      replyId: entry.replyId,
    })),
    invitations: (value.invitations || []).filter((entry) => INVITATIONS.some((invitation) => invitation.id === entry.id)).map((entry) => ({
      id: entry.id,
      receivedDay: Math.max(1, Number(entry.receivedDay) || 1),
      expiresDay: Math.max(1, Number(entry.expiresDay) || 1),
      status: ["pending", "accepted", "declined", "expired"].includes(entry.status) ? entry.status : "expired",
    })) as ReceivedInvitation[],
    rumors: (value.rumors || []).filter((entry) => RUMORS.some((rumor) => rumor.id === entry.id)).map((entry) => ({ id: entry.id, heardDay: Math.max(1, Number(entry.heardDay) || 1) })),
    worldEventHistory: unique((value.worldEventHistory || []).filter((id) => SPONTANEOUS_EVENTS.some((entry) => entry.id === id))),
    livingWorldTick: typeof value.livingWorldTick === "string" ? value.livingWorldTick : "",
    jobRuns: value.jobRuns || {},
    housing: {
      ...emptyHousingState(),
      ...(value.housing || {}),
      propertyId: savedProperty?.id,
      purchasePrice: savedProperty ? Math.max(0, Number(value.housing?.purchasePrice) || savedProperty.price) : 0,
      displayed: Array.from({ length: 3 }, (_, index) => {
        const item = value.housing?.displayed?.[index] || null;
        return item && (value.inventory?.[item] || 0) > 0 ? item : null;
      }),
      residents: savedProperty ? unique(value.housing?.residents || []).filter((id) => CHARACTERS.some((character) => character.id === id)) : [],
      homeDateHistory: value.housing?.homeDateHistory || [],
      homeDateGifts: value.housing?.homeDateGifts || [],
      residentMomentHistory: value.housing?.residentMomentHistory || {},
      sharedMomentHistory: value.housing?.sharedMomentHistory || [],
    },
  };
}

function jobAccess(game: GameState, job: JobData) {
  if (!job.requirement || game.settings.unlockAll) return { unlocked: true, value: 0, target: 0, characterName: "" };
  const relationship = game.relationships[job.requirement.character] || { affection: 0, trust: 0 };
  const value = relationship.affection + relationship.trust;
  const characterName = CHARACTERS.find((character) => character.id === job.requirement!.character)?.name || job.requirement.character;
  return { unlocked: value >= job.requirement.bond, value, target: job.requirement.bond, characterName };
}

function replacePlayer(text: string, player: Player) {
  return text.replaceAll("{player}", player.name);
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function placeDiscovery(game: GameState, locationId: string, spotId: string) {
  const location = LOCATIONS.find((entry) => entry.id === locationId);
  const spot = spotById(spotId);
  return {
    codex: unique([...game.codex, location?.name || "", spot?.name || ""].filter(Boolean)),
    visitedLocations: unique([...game.visitedLocations, locationId]),
    visitedSpots: unique([...game.visitedSpots, spotId]),
  };
}

function hasKnowledge(game: GameState, ids: string[] = []) {
  return ids.every((id) => game.knowledge.includes(id));
}

function routeNarrativeReady(scene: RouteScene, game: GameState) {
  return game.settings.unlockAll || (
    hasKnowledge(game, routeKnowledgeRequirements(scene))
    && routeFlagRequirements(scene).every((flag) => game.flags.includes(flag))
  );
}

function routeNarrativeObjective(scene: RouteScene, game: GameState): string | undefined {
  if (game.settings.unlockAll) return undefined;
  if (!hasKnowledge(game, routeKnowledgeRequirements(scene))) {
    const bond = game.relationships[scene.character].affection + game.relationships[scene.character].trust;
    const confidenceThreshold = scene.stage * 20;
    const missingBond = Math.max(0, confidenceThreshold - bond);
    if (missingBond > 0) {
      return `Approfondissez encore ce lien de ${missingBond} point${missingBond > 1 ? "s" : ""}. Une conversation personnelle devra précéder la prochaine scène.`;
    }
    const character = CHARACTERS.find((entry) => entry.id === scene.character);
    return `Une conversation personnelle semble maintenant possible avec ${character?.name || "cette personne"}. Retrouvez-la dans l’un de ses lieux habituels.`;
  }
  const missingFlags = routeFlagRequirements(scene).filter((flag) => !game.flags.includes(flag));
  if (!missingFlags.length) return undefined;
  if (scene.id === "amanea-3" || scene.id === "iriana-3") return "Le canal d’archives entre les deux camps doit d’abord être sécurisé dans le fil principal.";
  if (scene.id === "iriana-4") return "Iriana doit d’abord dissocier sa confidence de toute dette affective. Retrouvez-la au Salon de musique d’Al’Gratal.";
  if (scene.id === "valurn-4" || scene.id === "bellirith-4") {
    if (!game.flags.includes("fracture-valurn-bellirith-truth")) return "Bellirith doit encore recevoir la partie de l’histoire que Valurn lui a cachée. Une copie de l’inscription pourrait les réunir dans les Archives profondes d’Akuhn’Nabad.";
    if (!game.flags.includes("fracture-valurn-bellirith-distance-set")) return "Après la révélation, Bellirith et Valurn doivent encore poser une distance qui ne soit ni pardon ni punition. Retrouvez-les dans la salle de musique d’Akuhn’Nabad.";
    if (scene.id === "valurn-4") return "Valurn doit d’abord assumer son récit sans transformer l’aveu en acquittement. Retrouvez-le au Grand Marché d’Al’Gratal.";
    return "Bellirith doit d’abord reprendre possession de son histoire loin de toute attente intime. Retrouvez-la dans la salle de musique d’Akuhn’Nabad.";
  }
  if (scene.id === "amanea-4") return "Amanea doit d’abord poser avec vous les limites qu’impose le secret de Naïah. Retrouvez-la sur la terrasse d’Akuhn’Nabad.";
  if (scene.id === "allenna-4") return "Allenna doit d’abord éprouver une présence qui ne devienne ni surveillance ni sauvetage. Retrouvez-la sur la terrasse d’Akuhn’Nabad.";
  if (scene.id === "lineva-4" || scene.id === "draven-4") {
    if (!game.flags.includes("lineva-mother-truth-resolved")) return "Lineva doit encore décider comment annoncer à Draven la mort de sa mère. Retrouvez-les sur les quais de Forthaven.";
    return "Après l’annonce, Lineva et Draven doivent traverser leur première soirée de deuil sans vous confier la décision à leur place. Retrouvez-les dans les quartiers de Forthaven.";
  }
  return "Un événement lié à cette relation doit encore avoir lieu avant la prochaine scène.";
}

function campaignHistorySatisfied(id: string, game: GameState) {
  if (game.history.includes(id)) return true;
  if (game.flags.includes(`social:${id}`) || game.flags.includes(id)) return true;
  // Compatibilité avec les anciennes sauvegardes dont l’étape relationnelle
  // était enregistrée mais pas toujours son identifiant de scène.
  const route = ROUTE_SCENES.find((entry) => entry.id === id);
  return Boolean(route && (game.relationships[route.character]?.stage || 0) > route.stage);
}

function campaignBlockingObjective(scene: CampaignScene, game: GameState) {
  if (!game.settings.unlockAll && game.day < scene.minDay) return `Cette étape commence au plus tôt au jour ${scene.minDay}.`;
  const missingHistory = (scene.requiresHistory || []).filter((id) => !campaignHistorySatisfied(id, game));
  if (missingHistory.length) {
    const missingRoutes = missingHistory.map((id) => ROUTE_SCENES.find((route) => route.id === id)).filter((route): route is RouteScene => Boolean(route));
    const missingCampaign = missingHistory.map((id) => campaignSceneById(id)).find(Boolean);
    if (missingCampaign) return `Terminez d’abord le jalon de campagne « ${missingCampaign.title} ».`;
    if (missingRoutes.length) {
      const names = unique(missingRoutes.map((route) => CHARACTERS.find((character) => character.id === route.character)?.name).filter((name): name is string => Boolean(name)));
      return `Rencontrez encore ${names.slice(0, 4).join(", ")}${names.length > 4 ? ` et ${names.length - 4} autre${names.length > 5 ? "s" : ""}` : ""} dans leur première scène majeure.`;
    }
    return "Une scène précédente du fil principal doit encore être vécue.";
  }
  const missingFlags = (scene.requiresFlags || []).filter((flag) => !game.flags.includes(flag));
  if (missingFlags.length) return "Les preuves ou garanties produites par l’étape précédente ne sont pas encore réunies.";
  if (!hasKnowledge(game, scene.requiresKnowledge)) return "Une connaissance indispensable doit encore être découverte.";
  return undefined;
}

function campaignSceneReady(scene: CampaignScene, game: GameState) {
  if (game.history.includes(scene.id)) return false;
  return !campaignBlockingObjective(scene, game);
}

function characterUnlocked(game: GameState, character: CharacterData) {
  if (game.settings.unlockAll) return true;
  if (game.day < character.unlockDay) return false;
  // Tia doit d'abord exister comme institution. Son accès personnel n'apparaît
  // qu'après un premier véritable approfondissement du fil d'Amanea.
  if (character.id === "tia") return (game.relationships.amanea?.stage || 0) >= 2;
  return true;
}

function secretConversationReady(secret: SecretConversation, game: GameState, requirePlace = true) {
  const relation = game.relationships[secret.character];
  if (!relation || !relation.met || game.secretHistory.includes(secret.id)) return false;
  // Chaque couche de passé répond à une scène réellement vécue : une forte
  // relation obtenue par cadeaux ou moments libres ne peut plus sauter le
  // premier chapitre de la route ni révéler plusieurs niveaux à l’avance.
  if (!game.settings.unlockAll && relation.stage < secret.tier / 20) return false;
  if (!game.settings.unlockAll && relation.affection + relation.trust < secret.tier) return false;
  if (!game.settings.unlockAll && game.day < (secret.minDay || 1)) return false;
  if (!game.settings.unlockAll && !hasKnowledge(game, secret.requiresKnowledge)) return false;
  if (requirePlace && secret.locations?.length && !secret.locations.includes(game.location)) return false;
  return true;
}

function availableSecretForCharacter(characterId: string, game: GameState) {
  return SECRET_CONVERSATIONS
    .filter((secret) => secret.character === characterId && secretConversationReady(secret, game))
    .sort((left, right) => left.tier - right.tier)[0];
}

function spontaneousEventReady(event: SpontaneousEvent, game: GameState) {
  if (game.worldEventHistory.includes(event.id)) return false;
  const containsForbiddenPair = event.characters.includes("amanea") && event.characters.includes("naiah");
  if (containsForbiddenPair && !event.amaneaNaiahSafeguard) return false;
  if (game.day < event.minDay && !game.settings.unlockAll) return false;
  if (event.location !== game.location) return false;
  if (event.spots?.length && !event.spots.includes(game.spot)) return false;
  if (!game.settings.unlockAll && event.characters.some((id) => {
    if (event.remoteCharacters?.includes(id)) return false;
    const character = CHARACTERS.find((entry) => entry.id === id);
    const place = character ? characterPlace(character, game.day, game.period, game.flags, game.housing) : undefined;
    return !place || place.location !== game.location || place.spot !== game.spot;
  })) return false;
  if (!game.settings.unlockAll && event.characters.some((id) => {
    const character = CHARACTERS.find((entry) => entry.id === id);
    return !character || !characterUnlocked(game, character);
  })) return false;
  if (!game.settings.unlockAll && Object.entries(event.minStages || {}).some(([id, stage]) => (game.relationships[id]?.stage || 0) < stage)) return false;
  if (!game.settings.unlockAll && !hasKnowledge(game, event.requiresKnowledge)) return false;
  if (event.requiresFlags?.some((flag) => !game.flags.includes(flag))) return false;
  if (event.excludesFlags?.some((flag) => game.flags.includes(flag))) return false;
  return true;
}

function availableSpontaneousEvent(game: GameState) {
  return SPONTANEOUS_EVENTS.find((event) => spontaneousEventReady(event, game));
}

function rumorReady(rumor: RumorTemplate, game: GameState) {
  return rumor.location === game.location
    && game.day >= rumor.minDay
    && (!rumor.spots?.length || rumor.spots.includes(game.spot))
    && !game.rumors.some((entry) => entry.id === rumor.id);
}

function availableRumor(game: GameState) {
  const deck = RUMORS.filter((rumor) => rumorReady(rumor, game));
  if (!deck.length) return undefined;
  return deck[(game.day + game.period + game.rumors.length) % deck.length];
}

function letterReady(letter: LetterTemplate, game: GameState) {
  const character = CHARACTERS.find((entry) => entry.id === letter.character);
  const relation = game.relationships[letter.character];
  return Boolean(character && relation && characterUnlocked(game, character)
    && relation.met
    && game.day >= letter.minDay
    && relation.stage >= letter.minStage
    && hasKnowledge(game, letter.requiresKnowledge)
    && !letter.requiresFlags?.some((flag) => !game.flags.includes(flag))
    && !letter.excludesFlags?.some((flag) => game.flags.includes(flag))
    && !game.letters.some((entry) => entry.id === letter.id));
}

function invitationReady(invitation: InvitationTemplate, game: GameState) {
  const character = CHARACTERS.find((entry) => entry.id === invitation.character);
  const relation = game.relationships[invitation.character];
  return Boolean(character && relation && characterUnlocked(game, character)
    && relation.met
    && game.day >= invitation.minDay
    && relation.stage >= invitation.minStage
    && hasKnowledge(game, invitation.requiresKnowledge)
    && !game.invitations.some((entry) => entry.id === invitation.id));
}

function evolveLivingWorld(game: GameState): GameState {
  const tick = `${game.day}:${game.period}`;
  if (game.livingWorldTick === tick) return game;
  const invitations = game.invitations.map((entry) => entry.status === "pending" && game.day > entry.expiresDay ? { ...entry, status: "expired" as const } : entry);
  const base = { ...game, invitations, livingWorldTick: tick };
  const letter = LETTERS.find((entry) => letterReady(entry, base));
  const invitation = INVITATIONS.find((entry) => invitationReady(entry, base));
  const newLetters = letter ? [...base.letters, { id: letter.id, receivedDay: base.day, read: false }] : base.letters;
  const newInvitations = invitation ? [...base.invitations, { id: invitation.id, receivedDay: base.day, expiresDay: base.day + invitation.expiresAfter, status: "pending" as const }] : base.invitations;
  if (!letter && !invitation && invitations === game.invitations) return base;
  return {
    ...base,
    letters: newLetters,
    invitations: newInvitations,
    journal: [
      ...base.journal,
      ...(letter ? [`Correspondance reçue · ${letter.subject}`] : []),
      ...(invitation ? [`Invitation reçue · ${invitation.title}`] : []),
    ],
  };
}

function groupDateUnlocked(game: GameState, date: GroupDateScene): boolean {
  if (!contentBranchAllowed(game.flags, date)) return false;
  if (game.settings.unlockAll) return true;
  return date.characters.every((characterId) => {
    const relation = game.relationships[characterId];
    return relation.stage >= date.minStage
      && relation.affection >= date.minAffection
      && relation.trust >= date.minTrust
      && relation.desire >= date.minDesire;
  });
}

function publicDateUnlocked(game: GameState, date: DateScene): boolean {
  if (game.flags.includes(`${date.character}-platonic`)) return false;
  if (game.settings.unlockAll) return true;
  const relation = game.relationships[date.character];
  return relation.stage >= date.unlockStage
    && relation.affection >= date.minAffection
    && relation.trust >= date.minTrust;
}

function homeDateUnlocked(game: GameState, characterId: string): boolean {
  if (!game.housing.propertyId || !HOME_DATE_PROFILES[characterId]) return false;
  if (game.settings.unlockAll) return true;
  const relation = game.relationships[characterId];
  return relation.stage >= 3 && relation.affection >= 22 && relation.trust >= 22;
}

function homePairDateUnlocked(game: GameState, pair: HomePairDateProfile): boolean {
  if (!game.housing.propertyId) return false;
  if (!contentBranchAllowed(game.flags, pair)) return false;
  return game.settings.unlockAll || (
    pair.characters.every((id) => game.relationships[id].stage >= pair.minStage && game.relationships[id].trust >= pair.minTrust)
  );
}

function characterDescriptor(character: CharacterData) {
  return [character.role, character.ageNote].filter(Boolean).join(" · ");
}

function relationshipNarrativeProgress(game: GameState, characterId: string) {
  const scenes = ROUTE_SCENES.filter((scene) => scene.character === characterId).sort((left, right) => left.stage - right.stage);
  const historyCount = scenes.filter((scene) => game.history.includes(scene.id)).length;
  const relationStage = game.relationships[characterId]?.stage || 0;
  return {
    scenes,
    total: scenes.length,
    completed: Math.min(scenes.length, Math.max(historyCount, relationStage)),
  };
}

function storyMilestone(id: string) {
  const campaign = campaignSceneById(id);
  if (campaign) {
    return { title: campaign.title, place: spotById(campaign.spot)?.name || "Scène de campagne" };
  }
  const route = ROUTE_SCENES.find((scene) => scene.id === id);
  if (route) {
    const spot = spotById(ROUTE_SPOTS[route.id]);
    return { title: route.title, place: spot?.name || LOCATIONS.find((location) => location.id === route.location)?.name || "Lieu à découvrir" };
  }
  const social = SOCIAL_SCENES.find((scene) => scene.id === id);
  const socialSpot = social?.sublocations?.map((spotId) => spotById(spotId)?.name).filter(Boolean).join(" ou ");
  return { title: social?.title || id, place: socialSpot || "Progressez dans les relations concernées" };
}

function newlyUnlockedContent(previous: GameState, next: GameState) {
  if (previous.settings.unlockAll !== next.settings.unlockAll) return [];
  const labels: string[] = [];

  LOCATIONS.forEach((location) => {
    if (previous.day < location.unlockDay && next.day >= location.unlockDay) labels.push(`Lieu · ${location.name}`);
  });
  CHARACTERS.forEach((character) => {
    if (!characterUnlocked(previous, character) && characterUnlocked(next, character)) labels.push(`Relation · ${character.name}`);
  });
  JOBS.forEach((job) => {
    if (!jobAccess(previous, job).unlocked && jobAccess(next, job).unlocked) labels.push(`Job · ${job.title}`);
  });
  DATE_SCENES.forEach((date) => {
    if (!publicDateUnlocked(previous, date) && publicDateUnlocked(next, date)) labels.push(`Rendez-vous · ${date.title}`);
  });
  GROUP_DATES.forEach((date) => {
    if (!groupDateUnlocked(previous, date) && groupDateUnlocked(next, date)) labels.push(`Rendez-vous à trois · ${date.title}`);
  });
  Object.keys(HOME_DATE_PROFILES).forEach((characterId) => {
    if (!homeDateUnlocked(previous, characterId) && homeDateUnlocked(next, characterId)) {
      const character = CHARACTERS.find((entry) => entry.id === characterId);
      labels.push(`Au logis · ${character?.name || characterId}`);
    }
  });
  HOME_PAIR_DATES.forEach((pair) => {
    if (!homePairDateUnlocked(previous, pair) && homePairDateUnlocked(next, pair)) labels.push(`Au logis à trois · ${pair.title}`);
  });

  return unique(labels);
}

function gameNotifications(previous: GameState, next: GameState): ChronicleNotificationDraft[] {
  const storyChanges: ChronicleNotificationDraft[] = [];
  const relationChanges: ChronicleNotificationDraft[] = [];
  const itemChanges: ChronicleNotificationDraft[] = [];
  const homeChanges: ChronicleNotificationDraft[] = [];
  const unlockChanges: ChronicleNotificationDraft[] = [];
  const codexChanges: ChronicleNotificationDraft[] = [];
  const livingWorldChanges: ChronicleNotificationDraft[] = [];

  const previousStory = storyProgress(previous.history, previous.flags);
  const nextStory = storyProgress(next.history, next.flags);
  if (nextStory > previousStory) {
    const completedAct = MAIN_STORY[Math.min(nextStory - 1, MAIN_STORY.length - 1)];
    const followingAct = MAIN_STORY[nextStory];
    storyChanges.push({
      kind: "story",
      title: `Acte ${completedAct.number} accompli`,
      detail: followingAct ? `Nouvel objectif · ${followingAct.title}` : "Le fil principal est accompli ; le monde reste ouvert.",
    });
  }

  CHARACTERS.forEach((character) => {
    const before = previous.relationships[character.id];
    const after = next.relationships[character.id];
    if (!before || !after) return;
    if (after.stage > before.stage) {
      const progress = relationshipNarrativeProgress(next, character.id);
      const nextScene = sceneFor(character.id, after.stage);
      const nextVariant = nextScene ? relationRouteVariant(nextScene, next).route : undefined;
      const confidenceObjective = nextVariant ? routeNarrativeObjective(nextVariant, next) : undefined;
      relationChanges.push({
        kind: "relation",
        title: `Fil de ${character.name} · ${progress.completed}/${progress.total}`,
        detail: nextVariant
          ? confidenceObjective || `Prochaine scène · ${nextVariant.title}`
          : "Toutes les scènes narratives sont accomplies.",
      });
    } else if (!before.met && after.met) {
      relationChanges.push({ kind: "relation", title: `Nouvelle relation · ${character.name}`, detail: character.role });
    }
    const beforeSecret = SECRET_CONVERSATIONS.find((secret) => secret.character === character.id && secretConversationReady(secret, previous, false));
    const afterSecret = SECRET_CONVERSATIONS.find((secret) => secret.character === character.id && secretConversationReady(secret, next, false));
    if (!beforeSecret && afterSecret) {
      relationChanges.push({ kind: "relation", title: `Une nouvelle conversation pourrait être possible avec ${character.name}.`, detail: "Retrouvez cette personne dans l’un de ses lieux habituels." });
    }
  });

  Object.entries(next.inventory).forEach(([itemId, amount]) => {
    const gained = amount - (previous.inventory[itemId] || 0);
    if (gained <= 0) return;
    const item = displayItemById(itemId);
    const purchased = previous.coins > next.coins && item?.source === "market";
    itemChanges.push({
      kind: "item",
      title: purchased ? "Objet acheté" : "Objet obtenu",
      detail: `${item?.name || itemId}${gained > 1 ? ` · +${gained}` : ""}`,
    });
  });

  if (previous.housing.propertyId !== next.housing.propertyId && next.housing.propertyId) {
    homeChanges.push({ kind: "home", title: "Nouveau logis", detail: propertyById(next.housing.propertyId)?.name || "Votre nouvelle adresse est disponible sur la carte." });
  }

  const unlocked = newlyUnlockedContent(previous, next);
  if (unlocked.length) {
    unlockChanges.push({
      kind: "unlock",
      title: `${unlocked.length} nouveauté${unlocked.length > 1 ? "s" : ""} débloquée${unlocked.length > 1 ? "s" : ""}`,
      detail: `${unlocked.slice(0, 2).join(" · ")}${unlocked.length > 2 ? ` · +${unlocked.length - 2}` : ""}`,
    });
  }

  const newCodex = next.codex.filter((entry) => !previous.codex.includes(entry));
  if (newCodex.length) {
    codexChanges.push({
      kind: "codex",
      title: "Codex mis à jour",
      detail: `${newCodex.slice(0, 2).join(" · ")}${newCodex.length > 2 ? ` · +${newCodex.length - 2}` : ""}`,
    });
  }

  const newLetters = next.letters.filter((entry) => !previous.letters.some((before) => before.id === entry.id));
  newLetters.forEach((entry) => {
    const letter = LETTERS.find((candidate) => candidate.id === entry.id);
    livingWorldChanges.push({ kind: "letter", title: "Une correspondance vous attend", detail: letter?.subject || "Consultez le Journal." });
  });
  const newInvitations = next.invitations.filter((entry) => !previous.invitations.some((before) => before.id === entry.id));
  newInvitations.forEach((entry) => {
    const invitation = INVITATIONS.find((candidate) => candidate.id === entry.id);
    livingWorldChanges.push({ kind: "invitation", title: invitation?.message || "Quelqu’un souhaite vous voir.", detail: invitation ? `Réponse possible jusqu’au jour ${entry.expiresDay}.` : "Consultez le Journal." });
  });
  const expiredInvitations = next.invitations.filter((entry) => entry.status === "expired" && previous.invitations.some((before) => before.id === entry.id && before.status === "pending"));
  expiredInvitations.forEach((entry) => {
    const invitation = INVITATIONS.find((candidate) => candidate.id === entry.id);
    livingWorldChanges.push({ kind: "invitation", title: "Une invitation a expiré", detail: invitation?.title || "Le personnage a poursuivi sa propre journée." });
  });
  const newRumors = next.rumors.filter((entry) => !previous.rumors.some((before) => before.id === entry.id));
  if (newRumors.length) livingWorldChanges.push({ kind: "rumor", title: "Une rumeur rejoint votre Journal", detail: "Son exactitude demeure inconnue." });
  const newKnowledge = next.knowledge.filter((id) => !previous.knowledge.includes(id));
  if (newKnowledge.length) {
    const entry = ALL_KNOWLEDGE_ENTRIES.find((candidate) => candidate.id === newKnowledge[0]);
    livingWorldChanges.push({ kind: "knowledge", title: "Votre compréhension a changé", detail: entry?.title || "Une information pourra éclairer d’autres conversations." });
  }

  return [...storyChanges, ...relationChanges, ...livingWorldChanges, ...itemChanges, ...homeChanges, ...unlockChanges, ...codexChanges].slice(0, 4);
}

function readSlotInfo() {
  const next: Record<number, string> = {};
  if (typeof window === "undefined") return next;
  for (let slot = 1; slot <= 3; slot += 1) {
    const raw = window.localStorage.getItem(`sylvinia-liens-slot-${slot}`);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      next[slot] = parsed.savedAt || "Sauvegarde existante";
    } catch { /* slot illisible */ }
  }
  return next;
}

const LINEVA_TRAVEL_ITINERARY: CharacterData["itinerary"] = [
  { days: 14, location: "forthaven", note: "Tient Forthaven et prépare une relève capable de voyager sans elle" },
  { days: 3, travelTo: "algratal", note: "Voyage vers Al’Gratal après avoir été convaincue de défendre elle-même son dossier" },
  { days: 3, location: "algratal", note: "Plaide pour Forthaven aux côtés de Draven" },
  { days: 3, travelTo: "forthaven", note: "Retour vers le front avec l’accord négocié" },
  { days: 15, location: "forthaven", note: "Reprend le commandement et mesure ce que sa relève a accompli" },
];

const IRIANA_FORTHAVEN_ITINERARY: CharacterData["itinerary"] = [
  { days: 12, location: "algratal", note: "Audiences impériales et recherches secrètes sur le pacte" },
  { days: 3, travelTo: "akuhn", note: "Voyage clandestin organisé avec Valurn" },
  { days: 3, location: "akuhn", note: "Consultation discrète des archives d’Amanea" },
  { days: 3, travelTo: "algratal", note: "Retour secret vers la capitale" },
  { days: 6, location: "algratal", note: "Finalise l’accord de renfort avec Draven" },
  { days: 3, travelTo: "forthaven", note: "Accompagne la délégation sans réclamer le commandement du port" },
  { days: 3, location: "forthaven", note: "Travaille sous l’autorité militaire de Lineva" },
  { days: 3, travelTo: "algratal", note: "Regagne la capitale après l’inspection des renforts" },
  { days: 2, location: "algratal", note: "Présente au Conseil les corrections décidées à Forthaven" },
];

function characterSchedule(character: CharacterData, day: number, flags: string[] = []) {
  const itinerary = character.id === "lineva" && flags.includes("lineva-travel")
    ? LINEVA_TRAVEL_ITINERARY
    : character.id === "iriana" && flags.includes("story-forthaven-accord-drafted")
      ? IRIANA_FORTHAVEN_ITINERARY
      : character.itinerary;
  const cycleLength = itinerary.reduce((total, stop) => total + stop.days, 0);
  const cycleDay = ((Math.max(1, day) - 1) % cycleLength) + 1;
  let cursor = 1;
  for (const stop of itinerary) {
    const end = cursor + stop.days - 1;
    if (cycleDay <= end) {
      const cycleStart = day - cycleDay + 1;
      return { ...stop, untilDay: cycleStart + end, cycleDay, cycleLength, stopDay: cycleDay - cursor + 1 };
    }
    cursor = end + 1;
  }
  return { ...itinerary[0], untilDay: day, cycleDay, cycleLength, stopDay: 1 };
}

function characterPlace(character: CharacterData, day: number, period: number, flags: string[] = [], housing?: HousingState) {
  const home = propertyById(housing?.propertyId);
  const residentIndex = housing?.residents.indexOf(character.id) ?? -1;
  const residentHome = home && residentIndex >= 0 && (period === 0 || period === 3 || (day + residentIndex) % 4 === period);
  if (residentHome) {
    return {
      location: home.location,
      spot: home.spot,
      action: period === 0 ? "commence sa journée dans votre logis" : period === 3 ? "retrouve le calme de votre logis" : "profite librement de votre logis",
      traveling: false,
      untilDay: day + 1,
    };
  }
  const schedule = characterSchedule(character, day, flags);
  let moment = schedule.location
    ? routineFor(character.id, schedule.location, PERIODS[period].id, day)
    : travelWaypoint(character.id, schedule.travelTo, schedule.note, schedule.stopDay);
  if (character.id === "naiah" && schedule.location === "forbidden") {
    const hylee = CHARACTERS.find((entry) => entry.id === "hylee");
    const hyleeSchedule = hylee ? characterSchedule(hylee, day, flags) : undefined;
    if (hyleeSchedule?.location === "forbidden") moment = { spot: "forbidden-sanctuary", action: "accueille Hylee et maintient le chemin de la clairière stable" };
  }
  const spot = spotById(moment.spot);
  return {
    ...schedule,
    location: spot?.location || schedule.location || schedule.travelTo || "algratal",
    spot: moment.spot,
    action: moment.action,
    traveling: !schedule.location,
  };
}

function nextPresence(
  character: CharacterData,
  game: GameState,
  spotId: string,
  allowedPeriods?: (typeof PERIODS)[number]["id"][],
  minDay = game.day,
) {
  const start = game.day * PERIODS.length + game.period;
  for (let offset = 1; offset <= 38 * PERIODS.length; offset += 1) {
    const absolute = start + offset;
    const day = Math.floor(absolute / PERIODS.length);
    const period = absolute % PERIODS.length;
    const place = characterPlace(character, day, period, game.flags, game.housing);
    if (day >= minDay && place.spot === spotId && (!allowedPeriods || allowedPeriods.includes(PERIODS[period].id))) {
      return { day, period, place, offset };
    }
  }
  return undefined;
}

function waitDurationLabel(game: GameState, target: { day: number; period: number }) {
  const days = target.day - game.day;
  if (days <= 0) return `${target.period - game.period} période${target.period - game.period > 1 ? "s" : ""}`;
  return `${days} jour${days > 1 ? "s" : ""}`;
}

function sceneFor(characterId: string, stage: number) {
  return ROUTE_SCENES.find((scene) => scene.character === characterId && scene.stage === stage);
}

function chooseAmbientDialogue(
  deck: AmbientDialogue[],
  stage: number,
  location: string,
  spot: string,
  period: string,
  history: string[],
) {
  const atStage = deck.filter((entry) => stage >= (entry.minStage ?? 0) && stage <= (entry.maxStage ?? 5));
  const atLocation = atStage.filter((entry) => !entry.locations || entry.locations.includes(location));
  const atPeriod = atLocation.filter((entry) => !entry.periods || entry.periods.includes(period as (typeof PERIODS)[number]["id"]));
  const contextual = atPeriod.length ? atPeriod : atLocation.filter((entry) => !entry.periods);
  if (!contextual.length) return undefined;

  // Les sous-lieux sont une préférence de mise en scène, pas une prison qui
  // oblige à rejouer l'unique scène compatible. On épuise d'abord tout le
  // paquet cohérent avec le lieu, puis on reprend la scène vue depuis le plus
  // longtemps. Aucune sélection au hasard : le même historique donne toujours
  // la même suite, facile à comprendre et à tester.
  const strict = contextual.filter((entry) => !AMBIENT_SPOT_HINTS[entry.id] || AMBIENT_SPOT_HINTS[entry.id].includes(spot));
  const seen = new Set(history);
  const strictUnseen = strict.filter((entry) => !seen.has(entry.id));
  const contextualUnseen = contextual.filter((entry) => !seen.has(entry.id));
  const unseen = strictUnseen.length ? strictUnseen : contextualUnseen;
  if (unseen.length) return unseen[seen.size % unseen.length];

  const lastSeenAt = (id: string) => history.lastIndexOf(id);
  return [...contextual].sort((a, b) => lastSeenAt(a.id) - lastSeenAt(b.id) || a.id.localeCompare(b.id, "fr"))[0];
}

function socialSceneReady(scene: SocialScene, selectedCharacter: string, game: GameState) {
  const triggers = scene.triggerCharacters || scene.characters;
  if (!triggers.includes(selectedCharacter)) return false;
  if (scene.oneTime && game.flags.includes(`social:${scene.id}`)) return false;
  if (scene.locations && !scene.locations.includes(game.location)) return false;
  if (scene.sublocations && !scene.sublocations.includes(game.spot)) return false;
  if ((scene.requiredPresent || scene.characters).some((id) => {
    const character = CHARACTERS.find((entry) => entry.id === id);
    const place = character ? characterPlace(character, game.day, game.period, game.flags, game.housing) : undefined;
    return !place || place.location !== game.location || place.spot !== game.spot;
  })) return false;
  if (scene.minStages && Object.entries(scene.minStages).some(([id, stage]) => game.relationships[id].stage < stage)) return false;
  if (scene.stageSum && scene.characters.reduce((sum, id) => sum + game.relationships[id].stage, 0) < scene.stageSum) return false;
  if (!hasKnowledge(game, scene.requiresKnowledge)) return false;
  if (scene.requiresFlags?.some((flag) => !game.flags.includes(flag))) return false;
  if (scene.requiresAnyFlags && !scene.requiresAnyFlags.some((flag) => game.flags.includes(flag))) return false;
  if (scene.excludesFlags?.some((flag) => game.flags.includes(flag))) return false;
  if (!scene.oneTime) {
    const last = game.sharedHistory.slice().reverse().find((entry) => entry.startsWith(`${scene.id}@`));
    const lastDay = last ? Number(last.split("@")[1]) : -99;
    if (game.day - lastDay < 7) return false;
  }
  return true;
}

function chooseSocialScene(characterId: string, game: GameState) {
  const eligible = SOCIAL_SCENES.filter((scene) => socialSceneReady(scene, characterId, game));
  const oneTime = eligible.filter((scene) => scene.oneTime).sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (oneTime.length) return oneTime[0];
  const recurring = eligible.filter((scene) => !scene.oneTime);
  const lastDay = (id: string) => {
    const entry = game.sharedHistory.slice().reverse().find((item) => item.startsWith(`${id}@`));
    return entry ? Number(entry.split("@")[1]) : -999;
  };
  return [...recurring].sort((a, b) => lastDay(a.id) - lastDay(b.id) || a.id.localeCompare(b.id, "fr"))[0];
}

function relationshipRequirementMet(choice: ChoiceData, game: GameState) {
  const relationshipMissing = choice.requiresRelationship?.some((requirement) => {
    const relation = game.relationships[requirement.character];
    return !relation
      || (requirement.stage !== undefined && relation.stage < requirement.stage)
      || (requirement.trust !== undefined && relation.trust < requirement.trust)
      || (requirement.affection !== undefined && relation.affection < requirement.affection);
  });
  return !relationshipMissing;
}

function impactText(choice: ChoiceData) {
  const values: string[] = [`+1 ${STAT_LABELS[choice.stat]}`];
  const signed = (value: number) => value > 0 ? `+${value}` : `${value}`;
  if (choice.effects.affection) values.push(`Affection ${signed(choice.effects.affection)}`);
  if (choice.effects.trust) values.push(`Confiance ${signed(choice.effects.trust)}`);
  if (choice.effects.desire) values.push(`Désir ${signed(choice.effects.desire)}`);
  if (choice.effects.confluence) values.push(`Confluence ${signed(choice.effects.confluence)}`);
  return values.join(" · ");
}

type Misread = { text: string; response: string; stat: StatKey };

const MISREADS: Record<string, Misread[]> = {
  hylee: [
    { text: "La rassurer en affirmant qu’elle n’a aucune raison d’avoir peur.", response: "Ce n’est pas vraiment ce que j’ai dit. J’ai peur. J’avais surtout besoin que tu ne décides pas à ma place que cette peur est ridicule.", stat: "sangFroid" },
    { text: "Décider de la solution la plus sûre avant qu’elle ait terminé.", response: "Attends… Tu viens de choisir pour moi. C’est précisément ce que j’essayais de ne plus laisser faire.", stat: "lucidite" },
    { text: "Lui expliquer ce que Remerii ferait mieux dans la même situation.", response: "J’admire Remerii. Mais je n’ai pas envie de devenir sa copie pour mériter qu’on m’écoute.", stat: "lucidite" },
    { text: "Détourner immédiatement sa gêne par une plaisanterie.", response: "Je sais rire de moi. Là, j’essayais quand même de te dire quelque chose de vrai.", stat: "audace" },
    { text: "Lui promettre que vous ne la laisserez plus jamais avoir peur.", response: "Tu ne peux pas me promettre ça. Et je n’ai pas besoin d’une vie sans peur ; j’ai besoin de pouvoir choisir malgré elle.", stat: "audace" },
    { text: "Toucher sa main pour la calmer sans lui demander.", response: "Attends. Je sais que tu voulais m’aider, mais mon corps n’a pas eu le temps de comprendre que ce contact venait de toi.", stat: "sangFroid" },
    { text: "Présenter sa magie comme ce qui la rend exceptionnelle.", response: "Ma magie est importante. Mais si c’est la seule chose exceptionnelle que tu vois, je redeviens encore un pouvoir avant d’être une personne.", stat: "resonance" },
    { text: "L’assurer que vous savez exactement ce qui est bon pour elle.", response: "C’est une phrase que j’ai trop entendue. Même dite doucement, elle décide encore à ma place.", stat: "lucidite" },
  ],
  remerii: [
    { text: "Lui assurer qu’une archimage de son niveau maîtrise forcément la situation.", response: "Voilà une manière élégante de me rendre ma compétence comme bouclier. Je vous parlais justement de ce qu’elle ne protège pas.", stat: "lucidite" },
    { text: "Prendre les choses en main pour lui éviter un nouvel échec.", response: "Vous confondez aide et confiscation. Je suis capable d’échouer sans vous céder la conduite de ma propre vie.", stat: "audace" },
    { text: "Interpréter son calme comme la preuve qu’elle n’est pas réellement atteinte.", response: "Mon contrôle décrit ma méthode, pas l’absence de douleur. J’espérais que vous aviez appris cette différence.", stat: "sangFroid" },
    { text: "Comparer sa réaction à celle qu’aurait Hylee.", response: "Hylee n’est ni une unité de mesure ni un moyen de contourner ce que je viens de vous dire.", stat: "lucidite" },
    { text: "Lui demander une solution précise avant d’accueillir ce qu’elle ressent.", response: "Je vous ai confié une difficulté, pas soumis un problème d’examen. Tout ne réclame pas une solution avant d’être entendu.", stat: "lucidite" },
    { text: "Lui dire que sa froideur rend ses intentions impossibles à comprendre.", response: "Ma retenue peut vous frustrer. Elle ne vous autorise pas à transformer toute ma nuance en absence de sentiment.", stat: "audace" },
    { text: "Insister pour qu’elle cesse immédiatement de tout contrôler.", response: "Vous exigez que j’abandonne un mécanisme de survie selon votre calendrier. Voilà une forme de contrôle assez ironique.", stat: "audace" },
    { text: "La féliciter d’avoir parfaitement protégé Hylee jusque-là.", response: "J’ai aussi étouffé certains de ses choix en prétendant les sécuriser. Votre compliment efface précisément la faute que j’essaie de regarder.", stat: "sangFroid" },
  ],
  iriana: [
    { text: "Lui rappeler que son rang lui garantit déjà une place exceptionnelle.", response: "Vous venez de répondre à Iriana en complimentant la Princesse. C’était exactement la confusion que je redoutais.", stat: "lucidite" },
    { text: "Accepter son plan sans poser de question pour lui prouver votre loyauté.", response: "L’obéissance sans examen ne m’est pas utile. Elle est seulement confortable — et je me méfie de ce confort.", stat: "sangFroid" },
    { text: "Présenter le pacte de son père comme un héritage qu’elle doit assumer.", response: "Je passe ma vie à refuser d’être réduite à son sang. Ne recommencez pas cela sous le nom du devoir.", stat: "audace" },
    { text: "L’encourager à rendre cette confidence publique pour reprendre le contrôle.", response: "Une vérité intime ne devient pas plus libre parce qu’une salle entière peut l’utiliser contre moi.", stat: "audace" },
    { text: "Lui assurer qu’une princesse ne devrait jamais montrer autant d’hésitation.", response: "Vous venez de renforcer la prison au moment même où je vous montrais la porte. Mon rang hésite moins ; il vit moins aussi.", stat: "sangFroid" },
    { text: "Transformer immédiatement sa confidence en stratégie contre son père.", response: "Tout ce que je vous confie n’est pas une arme à retourner. Certaines vérités ont le droit d’exister avant de devenir utiles.", stat: "lucidite" },
    { text: "Lui dire que Valurn semble mieux comprendre cette part d’elle.", response: "Valurn n’est pas un instrument destiné à mesurer votre proximité avec moi. Répondez à ce que je vous offre, pas à ce qu’il possède déjà.", stat: "lucidite" },
    { text: "Lui promettre de toujours obéir à ses décisions privées.", response: "Je ne cherche pas une autre cour. Votre désaccord honnête me serait plus précieux qu’une loyauté qui m’empêche de me voir.", stat: "audace" },
  ],
  valurn: [
    { text: "Traiter son flirt comme une promesse qu’il devra désormais tenir.", response: "Vous venez de transformer un jeu partagé en contrat unilatéral. Mon père apprécierait la méthode ; ce n’est pas un compliment.", stat: "audace" },
    { text: "Lui dire que vous comprenez parfaitement ce qu’il a vécu.", response: "Parfaitement ? Quelle efficacité. J’ai mis des années à ne pas me comprendre et vous venez de résoudre l’affaire en une phrase.", stat: "lucidite" },
    { text: "Exiger qu’il abandonne immédiatement toute plaisanterie pour être sincère.", response: "Vous voulez la vérité, mais seulement si elle porte l’uniforme que vous avez choisi. C’est moins libre qu’il n’y paraît.", stat: "sangFroid" },
    { text: "Promettre de le sauver de sa famille et du Chaos.", response: "Je ne cherche pas un nouveau propriétaire bien intentionné. Gardez la cape héroïque pour quelqu’un qui l’a demandée.", stat: "audace" },
    { text: "Jouer avec son pacte comme s’il s’agissait d’un simple trait séduisant.", response: "Le Chaos est très décoratif jusqu’à ce qu’il réclame son dû. Ne transformez pas ma chaîne en accessoire parce qu’elle brille bien.", stat: "resonance" },
    { text: "Lui demander de prouver qu’il peut enfin être digne de confiance.", response: "La confiance n’est pas une épreuve que je passe pour obtenir votre affection. Regardez mes actes, ou ne me la donnez pas.", stat: "sangFroid" },
    { text: "Lui assurer que son père ne peut plus avoir de prise sur lui.", response: "Les chaînes ne disparaissent pas parce que vous ne les voyez pas. Votre optimisme n’annule ni le pacte ni ce qu’il m’a appris à devenir.", stat: "lucidite" },
    { text: "Répondre à sa vulnérabilité par une provocation plus cruelle encore.", response: "J’aime les lames verbales. J’aime moins qu’on les utilise au moment précis où je viens de poser les miennes.", stat: "audace" },
  ],
  naiah: [
    { text: "Rire de sa dernière phrase comme s’il ne s’agissait que d’une provocation.", response: "Oh. Tu as ri au bon endroit et écouté au mauvais. C’était la partie vraie.", stat: "audace" },
    { text: "La qualifier de petite menace finalement inoffensive.", response: "Petite, peut-être. Inoffensive, non. Et mignonne ne signifie pas que tu peux cesser de me regarder sérieusement.", stat: "sangFroid" },
    { text: "Supposer qu’Amanea avait nécessairement de bonnes raisons de la chasser.", response: "Deux secondes. C’est le temps qu’il t’a fallu pour offrir à ma mère une innocence qu’elle ne t’a même pas demandée.", stat: "lucidite" },
    { text: "Lui demander de se comporter normalement pour faciliter la conversation.", response: "Normalement selon qui ? Toi ? Ma mère ? Les gens qui aiment les monstres uniquement quand ils restent décoratifs ?", stat: "sangFroid" },
    { text: "Lui demander de dissiper toutes ses illusions pour prouver sa sincérité.", response: "Ma magie n’est pas automatiquement un mensonge. Me forcer à l’effacer pour mériter d’être crue ressemble encore à une cage.", stat: "resonance" },
    { text: "Traiter son besoin de garder une sortie comme une exagération.", response: "Les portes fermées ont compté dans ma vie. Tu n’as pas besoin d’avoir peur avec moi, mais ne te moque pas de ce qui m’a appris à vérifier.", stat: "sangFroid" },
    { text: "Lui dire qu’Hylee est probablement la seule personne capable de l’apaiser.", response: "Hylee compte énormément. Elle n’est pas la gardienne officielle de mon humanité, et moi je ne suis pas son problème à résoudre.", stat: "lucidite" },
    { text: "Répondre à sa jalousie en la mettant aussitôt en compétition.", response: "Voilà. Je te parle de la peur de ne pas être choisie et tu construis déjà un tournoi. Je ne veux pas gagner quelqu’un.", stat: "audace" },
  ],
  lineva: [
    { text: "Lui ordonner de se reposer parce que vous savez ce qui est bon pour elle.", response: "Vous avez transformé une inquiétude raisonnable en ordre mal placé. Recommencez sans prendre mon commandement.", stat: "audace" },
    { text: "Lui dire que Draven aurait été fier qu’elle agisse exactement comme lui.", response: "Je ne tiens pas Forthaven pour devenir une copie convenable de mon père.", stat: "lucidite" },
    { text: "Minimiser le danger pour l’aider à relâcher la pression.", response: "Les morts-vivants ne deviennent pas moins réels parce que votre réconfort exige une version plus simple du front.", stat: "sangFroid" },
    { text: "Accepter toutes les tâches qu’elle propose sans fixer de limite.", response: "Une aide qui s’effondre demain devient un problème supplémentaire. Choisissez ce que vous pouvez réellement tenir.", stat: "sangFroid" },
    { text: "Lui conseiller de laisser les décisions difficiles à l’Empire.", response: "L’Empire ne connaît ni mes rues ni le nom de mes soldats. Son aide compte ; son confort ne commandera pas Forthaven.", stat: "lucidite" },
    { text: "Lui dire que sa fatigue prouve qu’elle n’est pas faite pour commander.", response: "Ma fatigue prouve que la situation dure. J’accepterai qu’on m’aide, pas qu’on réduise mon commandement à une nuit trop courte.", stat: "sangFroid" },
    { text: "Transformer immédiatement son inquiétude pour Draven en faiblesse.", response: "Mon père me manque. Cela ne retire rien à mon jugement. Les commandantes ne deviennent pas incompétentes lorsqu’elles aiment quelqu’un.", stat: "lucidite" },
    { text: "Promettre de rester au front quoi qu’elle vous demande.", response: "Une promesse sans limite est une future désobéissance ou un futur cadavre. Je ne veux ni l’un ni l’autre.", stat: "audace" },
  ],
  saidin: [
    { text: "Accepter sa première réponse sans la questionner davantage.", response: "Vous me laissez choisir votre conclusion parce que ma certitude paraît confortable. Ce n’est pas la même chose que me faire confiance.", stat: "sangFroid" },
    { text: "Lui rappeler qu’il connaît probablement déjà la bonne solution.", response: "Connaître une conséquence possible ne me donne pas le droit de transformer votre choix en formalité.", stat: "lucidite" },
    { text: "Exiger une prédiction précise avant d’accepter de continuer.", response: "Si je vous la donne, passerez-vous le reste du chemin à choisir — ou seulement à lui obéir ?", stat: "audace" },
    { text: "Prendre son détachement pour la preuve que rien ne l’atteint.", response: "La distance est une méthode. Vous venez d’en faire une absence de sentiment parce que cette lecture était plus facile.", stat: "lucidite" },
    { text: "Lui demander de consulter les futurs pour confirmer vos sentiments.", response: "Un sentiment n’est pas plus vrai parce qu’une version future le conserve. Vous me demandez une preuve qui détruirait précisément sa liberté.", stat: "resonance" },
    { text: "Lui reprocher de ne jamais donner de réponse simple.", response: "Je complique parfois par habitude. Ici, pourtant, la réponse simple vous retirerait un choix que je refuse de prendre à votre place.", stat: "audace" },
    { text: "Supposer que votre arrivée faisait nécessairement partie de son plan.", response: "Vous me prêtez une maîtrise flatteuse et fausse. Je vous ai trouvé ; je ne vous ai ni créé ni convoqué.", stat: "lucidite" },
    { text: "Lui demander de promettre que cette relation finira bien.", response: "Je pourrais sélectionner un avenir heureux et vous condamner à le poursuivre. Ce ne serait pas une promesse, mais une contrainte élégante.", stat: "sangFroid" },
  ],
  bellirith: [
    { text: "Prendre sa séduction pour la promesse qu’elle ira forcément plus loin.", response: "Vous avez confondu mon goût du jeu avec une promesse. Je déteste qu’on écrive la fin de mes scènes avant moi.", stat: "audace" },
    { text: "Promettre que votre affection suffira à réparer ses blessures.", response: "Charmant. Vous m’aimez donc assez pour nier tout le travail que je n’ai pas encore fait moi-même.", stat: "lucidite" },
    { text: "La comparer à Valurn pour lui montrer que vous comprenez leur conflit.", response: "Vous venez de remettre mon frère au centre d’une phrase qui parlait de moi. Une habitude familiale particulièrement laide.", stat: "lucidite" },
    { text: "Répondre à sa manipulation par davantage de proximité.", response: "Vous récompensez le piège et appelez cela de la tendresse. Je pourrais en profiter ; je préfère vous prévenir que c’est une mauvaise idée.", stat: "audace" },
    { text: "Lui demander d’utiliser légèrement son charme pour rendre la scène plus intense.", response: "Légèrement est encore une manière de modifier votre volonté. Si vous me désirez, je veux savoir que ce désir a survécu à mon abstention.", stat: "resonance" },
    { text: "Lui assurer qu’un refus ne pourrait jamais réellement la blesser.", response: "Il me blesserait. Je peux reculer sans prétendre que cela ne coûte rien ; ne transformez pas ma retenue en indifférence.", stat: "sangFroid" },
    { text: "Prendre sa vulnérabilité pour une nouvelle technique de séduction.", response: "Je comprends votre méfiance. Mais si chaque vérité devient encore une performance à vos yeux, je n’ai plus aucun moyen de parler sans mon masque.", stat: "lucidite" },
    { text: "Lui dire qu’elle serait plus aimable si elle abandonnait entièrement son pouvoir.", response: "Mon pouvoir fait partie de moi. Je peux le retenir sans devenir inoffensive pour mériter votre affection.", stat: "audace" },
  ],
  amanea: [
    { text: "Lui promettre une obéissance entière pour gagner sa confiance.", response: "Je demandais ta fiabilité, pas ton effacement. Les serments faciles produisent des sujets dangereux et de très mauvais partenaires.", stat: "sangFroid" },
    { text: "Qualifier l’exil de Naïah de sacrifice malheureusement nécessaire.", response: "Ne rends pas mon choix plus noble qu’il ne l’était. J’ai protégé, contrôlé et blessé dans le même geste.", stat: "lucidite" },
    { text: "Flatter la réputation terrifiante de la Reine Noire.", response: "Ma réputation garde certaines portes. Elle ne répond pas à la femme qui vient de te parler.", stat: "audace" },
    { text: "Expliquer ce qu’Allenna ou Naïah devrait accepter à sa place.", response: "Mes filles ont déjà assez souffert de décisions prises en leur nom. Tu ne gagneras pas ma confiance en ajoutant la tienne.", stat: "lucidite" },
    { text: "Lui dire que Naïah finira forcément par lui pardonner.", response: "Le pardon de ma fille n’est ni un dû ni une conclusion nécessaire. Ne m’offre pas ce qui lui appartient.", stat: "sangFroid" },
    { text: "Présenter Allenna comme une version améliorée de sa mère.", response: "Allenna n’est pas ma correction. Elle est une femme entière, et mon héritière précisément parce qu’elle sait me contredire.", stat: "lucidite" },
    { text: "L’encourager à braver l’Empire au grand jour pour prouver sa force.", response: "Une reine qui confond courage et spectacle sacrifie ses sujets à son orgueil. Akuhn’Nabad n’a pas besoin d’une démonstration.", stat: "audace" },
    { text: "Lui demander de révéler immédiatement la clause concernant Naïah.", response: "Nommer cette clause peut guider le démon jusqu’à elle. Ton impatience est compréhensible ; elle ne rend pas le risque acceptable.", stat: "resonance" },
  ],
  draven: [
    { text: "Lui conseiller de transmettre des ordres plus stricts à Lineva.", response: "Ma fille commande Forthaven. Si je profite de la distance pour reprendre sa place, je n’aurai rien défendu du tout.", stat: "sangFroid" },
    { text: "Affirmer que l’Empire finira forcément par sauver la ville.", response: "Un espoir sans clause, sans délai et sans navire n’est pas un plan. C’est une manière élégante d’attendre les morts.", stat: "audace" },
    { text: "Parler des pertes comme d’un coût stratégique acceptable.", response: "Les cartes disent pertes. Moi, je connais les noms. Ne me demandez pas de confondre les deux.", stat: "lucidite" },
    { text: "Suggérer qu’il serait temps de laisser la guerre aux plus jeunes.", response: "Le jour où je ne serai plus utile, Lineva me le dira. Jusque-là, jugez mes actes plutôt que mes cheveux blancs.", stat: "audace" },
    { text: "Lui promettre que Lineva restera en sécurité pendant son absence.", response: "Vous ne contrôlez ni la mer ni les morts. Ne transformez pas mon inquiétude en promesse que personne ne peut tenir.", stat: "sangFroid" },
    { text: "Lui conseiller de reprendre le commandement dès son retour.", response: "Lineva tient Forthaven. Si je rentre pour lui retirer ce qu’elle a construit, mon retour deviendra une défaite.", stat: "lucidite" },
    { text: "Présenter son endurance comme une raison de ne jamais se reposer.", response: "Tenir longtemps n’est pas tenir sans relève. Cette logique a déjà enterré assez de bons soldats.", stat: "sangFroid" },
    { text: "Se moquer de sa méfiance envers la magie pour détendre l’atmosphère.", response: "Je peux apprendre ce que je ne comprends pas. Me traiter d’ignorant ne rendra pas vos sorts plus fiables sur le terrain.", stat: "audace" },
  ],
};

const BOUNDARY_RESPONSES: Record<string, string> = {
  hylee: "D’accord… ça pique un peu, je ne vais pas mentir. Laisse-moi reprendre mon souffle et on continue moins vite.",
  remerii: "C’est clair. Désagréable, mais clair. Accordez-moi quelques minutes pour retrouver une contenance qui ne ressemble pas à une dissertation.",
  iriana: "J’entends. Laissez-moi seulement une seconde avant de remettre mon titre et mon visage de cour au même endroit.",
  valurn: "Un refus net. Voilà qui ruine trois traits d’esprit et un plan très séduisant. Je survivrai à cette tragédie.",
  naiah: "Oh… d’accord. Je vais être vexée cinq minutes, peut-être six, puis nous pourrons reparler sans que je transforme les coussins en crapauds.",
  lineva: "Compris. Nous nous arrêtons là. Je préférerais marcher un peu avant de reprendre la conversation.",
  saidin: "Alors cette possibilité s’arrête ici. C’est étrange : parmi tant d’avenirs, une réponse présente demeure toujours la plus nette.",
  bellirith: "Je pourrais sourire comme si cela ne m’atteignait pas. Épargnons-nous cette mauvaise scène : cela m’atteint, et je vais tout de même reculer.",
  amanea: "Très bien. Je n’apprécie pas cette réponse, mais je l’ai entendue. Laisse-moi un moment avant de redevenir raisonnable.",
};

const PLATONIC_RESPONSES: Record<string, string> = {
  hylee: "Je comprends. J’aurai besoin d’un peu de temps pour ranger mes espoirs, mais pas notre amitié avec eux.",
  remerii: "Une réponse définitive. Mon esprit proteste contre sa conclusion et apprécie honteusement sa précision. Je saurai m’y tenir.",
  iriana: "Alors votre place auprès de moi portera un autre nom. Elle n’en sera pas moins réelle, seulement différente de celle que j’avais imaginée.",
  valurn: "Ami, donc. Une loyauté qui ne finit ni dans un lit ni devant un notaire démoniaque : j’ignorais que vous aimiez les expériences radicales.",
  naiah: "Ça fait mal. Mais je préfère être ton amie sans mensonge que passer des mois à essayer de devenir une réponse différente.",
  lineva: "Reçu. Votre présence compte toujours. Il me faudra simplement quelques jours pour lui rendre une forme qui ne me fasse pas attendre autre chose.",
  saidin: "Je ferme donc cette branche. Le chemin qui demeure n’est pas moindre ; il conduit seulement ailleurs.",
  bellirith: "Voilà qui m’oblige à apprendre la proximité sans en faire une conquête. Ce sera terriblement peu glamour… et probablement utile.",
  amanea: "Cette voie s’arrête donc ici. L’affection, elle, peut demeurer si tu acceptes qu’elle retrouve lentement sa place.",
};

const PLATONIC_CONTINUATIONS: Record<string, { title: string; intro: DialogueLine[]; response: DialogueLine[] }> = {
  hylee: {
    title: "Une place qui ne disparaît pas",
    intro: [{ speaker: "Narration", text: "Hylee vous retrouve avec deux tartelettes et aucune tentative de revenir sur votre réponse. Elle veut seulement savoir quelle forme réelle votre amitié peut prendre." }, { speaker: "Hylee", text: "Je ne vais pas prétendre que cela n’a rien changé. Mais je refuse que ma déception efface tout ce qui compte encore entre nous." }],
    response: [{ speaker: "Hylee", text: "Alors on garde une place l’un·e pour l’autre, sans lui donner un nom qui promettrait autre chose. Ça me va." }],
  },
  remerii: {
    title: "La mesure qui demeure",
    intro: [{ speaker: "Narration", text: "Remerii a préparé deux tasses et volontairement laissé la troisième chaise hors de toute conclusion symbolique." }, { speaker: "Remerii", text: "J’ai cessé de traiter votre réponse comme un problème à résoudre. J’aimerais maintenant apprendre ce que notre proximité devient lorsqu’elle n’attend aucune conversion." }],
    response: [{ speaker: "Remerii", text: "Une relation définie par ce que nous choisissons réellement, et non par ce que j’avais anticipé. Je peux travailler avec cette vérité." }],
  },
  iriana: {
    title: "Une confiance sans couronne",
    intro: [{ speaker: "Narration", text: "Iriana vous accorde une heure privée qui n’est ni une audience ni un rendez-vous. Aucun protocole ne vous oblige à feindre que la conversation est inchangée." }, { speaker: "Iriana", text: "Votre refus m’a atteinte. Il ne vous a pourtant retiré ni votre voix auprès de moi, ni la confiance que vous avez gagnée." }],
    response: [{ speaker: "Iriana", text: "Restez donc comme une personne capable de me contredire sans me posséder. Cette place est plus rare que la cour ne l’imagine." }],
  },
  valurn: {
    title: "Une partie sans mise cachée",
    intro: [{ speaker: "Narration", text: "Valurn étale un jeu dont il a retiré toutes les cartes de séduction, puis vous accuse de l’avoir rendu dramatiquement raisonnable." }, { speaker: "Valurn", text: "Je confirme que mon ego a survécu. Reste à savoir si notre amitié peut supporter une soirée où je ne tente pas de gagner davantage." }],
    response: [{ speaker: "Valurn", text: "Aucune conquête, aucune dette. Seulement une alliance choisie et quelques tricheries parfaitement amicales." }],
  },
  naiah: {
    title: "Le chemin qui reste ouvert",
    intro: [{ speaker: "Narration", text: "Naïah a déplacé les sentiers afin qu’aucun ne conduise par accident à un décor romantique. Elle vous attend dans une clairière volontairement ordinaire." }, { speaker: "Naïah", text: "J’ai été triste. Je le suis encore un peu. Mais je préfère un chemin vrai qui reste ouvert à une illusion où tu finirais par te sentir prisonnier·e." }],
    response: [{ speaker: "Naïah", text: "Alors reviens. Pas comme consolation, pas comme promesse. Comme toi — c’est déjà beaucoup." }],
  },
  lineva: {
    title: "La relève choisie",
    intro: [{ speaker: "Narration", text: "Lineva vous rejoint après la relève. Elle n’a préparé ni discours ni mission destinée à rendre votre proximité plus facile à classer." }, { speaker: "Lineva", text: "J’ai ajusté mes attentes. Pas votre importance. Je voulais que cette distinction soit dite aussi clairement qu’un ordre de relève." }],
    response: [{ speaker: "Lineva", text: "Vous restez quelqu’un auprès de qui je peux déposer l’armure. Cela n’exige aucune autre promesse." }],
  },
  saidin: {
    title: "Un présent sans branche secrète",
    intro: [{ speaker: "Narration", text: "Saidin a fermé sa montre et refuse de consulter les futurs dans lesquels votre réponse aurait été différente." }, { speaker: "Saidin", text: "Une possibilité s’est close. Le présent, lui, contient encore votre amitié entière, à condition que je ne le traite pas comme une salle d’attente." }],
    response: [{ speaker: "Saidin", text: "Alors restons dans cette minute-ci. Elle ne mène pas où je l’avais imaginé, mais elle nous appartient réellement." }],
  },
  bellirith: {
    title: "Sans conquête à accomplir",
    intro: [{ speaker: "Narration", text: "Bellirith vient sans charme et sans sourire de scène. Elle ne transforme pas votre refus en défi à renverser." }, { speaker: "Bellirith", text: "J’ai passé trop de temps à croire qu’une proximité devait devenir victoire ou humiliation. J’aimerais essayer une troisième option avec vous." }],
    response: [{ speaker: "Bellirith", text: "Amis, donc — et assez honnêtes pour ne pas appeler tension ce qui n’est plus une invitation. C’est étrangement reposant." }],
  },
  amanea: {
    title: "L’alliance sans chambre secrète",
    intro: [{ speaker: "Narration", text: "Amanea vous reçoit sur la terrasse sans garde et sans transformer cet isolement en promesse romantique. La reine a besoin de votre franchise ; la femme respecte encore votre refus." }, { speaker: "Amanea", text: "Tu ne seras ni sujet, ni amant·e, ni consolation. Si tu demeures, ce sera comme l’égal·e qui connaît mes contradictions et choisit malgré tout de me répondre." }],
    response: [{ speaker: "Amanea", text: "Alors l’alliance tient. Non parce qu’elle dissimule un désir, mais parce qu’aucun de nous n’a besoin de mentir sur sa nature." }],
  },
  tia: {
    title: "Une audience sans conquête",
    intro: [{ speaker: "Narration", text: "Tia a maintenu l’heure qu’elle vous réservait. La porte reste fermée aux courtisans, mais rien dans la pièce ne tente de rebaptiser votre refus." }, { speaker: "Tia", text: "Votre réponse a modifié les termes de cet accès. Elle ne l’a pas annulé. Je préfère une présence exacte à une dévotion entretenue par l’ambiguïté." }],
    response: [{ speaker: "Tia", text: "Vous demeurerez donc un regard privé que je n’ai ni acheté ni conquis. Ne confondez pas cette confiance avec de la douceur ; elle est plus rare, et je la tiendrai avec davantage de soin." }],
  },
  allenna: {
    title: "La place laissée libre",
    intro: [{ speaker: "Narration", text: "Allenna a laissé deux chaises près de la fenêtre et rangé le rapport qu’elle relisait. Elle ne dissimule ni sa déception ni sa décision de respecter la limite posée entre vous." }, { speaker: "Allenna", text: "J’ai vérifié si votre refus changeait mon jugement. Ce n’est pas le cas. Il change seulement ce que j’avais commencé à attendre de ces heures sans ordre." }],
    response: [{ speaker: "Allenna", text: "Confiance maintenue. Aucun commandement ne lui donnera un autre nom, pas même l’un des miens." }],
  },
};

const INJECTED_CHOICE_AFTERMATH: Record<string, Record<"misread" | "boundary" | "platonic", DialogueLine[]>> = {
  hylee: {
    misread: [{ speaker: "Narration", text: "Hylee ramène une mèche derrière son oreille. Le geste lui donne le temps de reprendre sa pensée au point où votre réponse l’avait coupée." }],
    boundary: [{ speaker: "Narration", text: "Le froid gagne un instant ses doigts, puis se résorbe. Hylee reste près de vous, sans chercher à ranimer ce qui vient de s’interrompre." }],
    platonic: [{ speaker: "Narration", text: "Elle acquiesce, les yeux brillants mais le dos droit. Le silence qui suit n’efface pas ce que vous avez déjà traversé ensemble." }],
  },
  remerii: {
    misread: [{ speaker: "Narration", text: "Remerii remet d’aplomb un objet qui n’en avait nul besoin. Lorsqu’elle revient à vous, son calme a retrouvé un bord plus coupant." }],
    boundary: [{ speaker: "Narration", text: "Elle corrige machinalement un pli de sa manche, puis renonce à prétendre que ce seul détail occupait son attention." }],
    platonic: [{ speaker: "Narration", text: "Remerii inspire lentement. Elle ne négocie pas la conclusion ; elle se contente de l’inscrire parmi les vérités qu’elle devra apprendre à habiter." }],
  },
  iriana: {
    misread: [{ speaker: "Narration", text: "Le visage de la princesse se referme avant que celui d’Iriana ait fini de parler. Vous venez de remettre son titre entre vous." }],
    boundary: [{ speaker: "Narration", text: "Iriana lisse le bord de son gant. Quand elle relève la tête, la déception demeure visible, mais elle ne vous demande pas de la réparer." }],
    platonic: [{ speaker: "Narration", text: "Elle reçoit votre réponse comme une décision privée, sans témoin ni appel. Sa main quitte la vôtre avec lenteur." }],
  },
  tia: {
    misread: [{ speaker: "Narration", text: "Le visage de Tia ne livre rien à la cour absente. Seul le silence, plus long que le protocole ne l’autorise, trahit que votre réponse a atteint la femme derrière la fonction." }],
    boundary: [{ speaker: "Narration", text: "Tia rappelle la garde d’un geste, puis se ravise. Elle vous laisse l’espace demandé sans convertir votre limite en fin d’audience." }],
    platonic: [{ speaker: "Narration", text: "Elle reformule mentalement votre place comme elle corrigerait un traité : sans effacer ce qui demeure valide, sans conserver une clause que l’autre partie a refusée." }],
  },
  valurn: {
    misread: [{ speaker: "Narration", text: "Le sourire de Valurn tient une seconde de trop, puis tombe. Cette fois, aucune plaisanterie ne vient récupérer ce qu’il avait confié." }],
    boundary: [{ speaker: "Narration", text: "Il s’incline avec une légèreté un peu forcée et vous rend l’espace entre vos corps avant de chercher une nouvelle phrase." }],
    platonic: [{ speaker: "Narration", text: "Valurn retourne une carte imaginaire entre ses doigts. La partie change de règles, et il ne tente pas de reprendre la donne." }],
  },
  naiah: {
    misread: [{ speaker: "Narration", text: "Les lucioles autour de Naïah s’éteignent une à une. Elle demeure pourtant là, assez longtemps pour que vous compreniez où votre réponse a dérapé." }],
    boundary: [{ speaker: "Narration", text: "Naïah recule d’un pas et s’assied dans l’herbe, les bras autour des genoux. Sa moue ne devient ni sortilège ni vengeance." }],
    platonic: [{ speaker: "Narration", text: "Une illusion commence à couvrir son expression ; elle la dissipe d’un geste agacé et vous laisse voir la peine telle qu’elle est." }],
  },
  lineva: {
    misread: [{ speaker: "Narration", text: "Lineva croise les bras. Son regard ne quitte pas le vôtre, mais la conversation vient de reprendre la raideur d’un rapport militaire." }],
    boundary: [{ speaker: "Narration", text: "Elle recule jusqu’au parapet et regarde les feux de Forthaven, le temps de remettre ses pensées en ordre." }],
    platonic: [{ speaker: "Narration", text: "Lineva incline brièvement la tête. Elle accepte la nouvelle ligne entre vous avec la gravité d’un engagement qu’elle entend respecter." }],
  },
  saidin: {
    misread: [{ speaker: "Narration", text: "Le regard de Saidin se perd dans plusieurs réponses possibles. Il les abandonne toutes afin de rester devant celle que vous venez réellement de donner." }],
    boundary: [{ speaker: "Narration", text: "Une lueur traverse ses yeux puis s’éteint. Saidin ne poursuit aucune des phrases qui auraient pu changer votre réponse." }],
    platonic: [{ speaker: "Narration", text: "Autour de lui, les futurs se simplifient d’un seul coup. Il semble à la fois soulagé de leur silence et atteint par ce qu’il signifie." }],
  },
  bellirith: {
    misread: [{ speaker: "Narration", text: "Bellirith laisse son charme retomber. Sans l’éclat de son sourire, la blessure que votre réponse vient d’effleurer paraît beaucoup moins théâtrale." }],
    boundary: [{ speaker: "Narration", text: "Elle fait un pas de côté, assez élégant pour sauver les apparences et assez net pour laisser la distance intacte." }],
    platonic: [{ speaker: "Narration", text: "Bellirith détourne les yeux vers la foule. Pour une fois, elle ne cherche pas dans un autre regard de quoi annuler le vôtre." }],
  },
  amanea: {
    misread: [{ speaker: "Narration", text: "Amanea s’immobilise. Son silence n’est pas une menace : il contient seulement tout ce qu’elle refuse de laisser la reine répondre à la place de la mère ou de la femme." }],
    boundary: [{ speaker: "Narration", text: "La souveraine reprend sa cape sur ses épaules. Amanea, elle, demeure encore un instant dans son regard." }],
    platonic: [{ speaker: "Narration", text: "Elle remet sa couronne sans cérémonie. Le métal referme une possibilité, pas la confiance déjà déposée entre vous." }],
  },
  allenna: {
    misread: [{ speaker: "Narration", text: "Allenna se redresse comme devant une erreur de manœuvre. Elle ne hausse pas la voix ; la précision de son retrait suffit à mesurer ce que vous avez mal compris." }],
    boundary: [{ speaker: "Narration", text: "Elle recule d’un pas réglementaire, puis laisse tomber ses mains le long du corps. Cette fois, elle ne transforme pas la distance demandée en position de combat." }],
    platonic: [{ speaker: "Narration", text: "Allenna acquiesce une seule fois. Sa déception reste visible, mais elle ne devient ni ordre, ni dette, ni épreuve supplémentaire." }],
  },
};

function injectedChoiceAftermath(choice: ChoiceData, characterId: string) {
  const kind = injectedChoiceKind(choice.id);
  return kind ? INJECTED_CHOICE_AFTERMATH[characterId]?.[kind] || [] : [];
}

function stableChoiceIndex(value: string, length: number) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash) % Math.max(1, length);
}

function shuffledChoices<T extends { id: string }>(values: T[], seed: string) {
  return [...values]
    .map((value) => ({ value, rank: stableChoiceIndex(`${seed}:${value.id}`, 1_000_003) }))
    .sort((left, right) => left.rank - right.rank || left.value.id.localeCompare(right.value.id, "fr"))
    .map(({ value }) => value);
}

function orderedJobRounds(job: JobData, order: number[]) {
  const pool = allJobRounds(job);
  return order.map((index) => pool[index]).filter((round): round is JobRound => Boolean(round));
}

function memoryWaveLength(round: number, maximum: number) {
  return Math.min([3, 4, 6][round] || maximum, maximum);
}

function finishServiceCustomer(current: JobState, correct: boolean, feedbackText: string): JobState {
  const total = serviceCustomers(current.variant).length;
  const score = current.score + (correct ? 1 : 0);
  const mistakes = current.mistakes + (correct ? 0 : 1);
  const combo = correct ? current.combo + 1 : 0;
  const maxCombo = Math.max(current.maxCombo, combo);
  const round = current.round + 1;
  if (round >= total) {
    return {
      ...current, round, score, mistakes, combo, maxCombo, feedbackText,
      serviceSelections: {},
      phase: mistakes === 0 ? "perfect" : mistakes <= 2 ? "success" : "failure",
      lastResult: correct ? "correct" : "wrong",
    };
  }
  return {
    ...current, round, score, mistakes, combo, maxCombo, feedbackText,
    serviceSelections: {},
    serviceTimeLeft: correct ? 20 : 17,
    lastResult: correct ? "correct" : "wrong",
  };
}

function flagsSharedByEveryChoice(choices: ChoiceData[]) {
  if (!choices.length) return [];
  const [first, ...rest] = choices;
  return (first.effects.flags || []).filter((flag) => rest.every((choice) => choice.effects.flags?.includes(flag)));
}

function relationRouteVariant(route: RouteScene, game: GameState) {
  const continuation = route.intimate && game.flags.includes(`${route.character}-platonic`)
    ? PLATONIC_CONTINUATIONS[route.character]
    : undefined;
  if (!continuation) return { route, sceneId: route.id };
  const character = CHARACTERS.find((entry) => entry.id === route.character);
  const variant: RouteScene = {
    ...route,
    title: continuation.title,
    mood: character?.defaultMood || route.mood,
    intro: continuation.intro,
    intimate: false,
    choices: [{
      id: `${route.id}-friendship-finale`,
      text: `Confirmer à ${character?.name || "cette personne"} que ce lien compte sans devenir romantique.`,
      stat: "sangFroid",
      response: continuation.response,
      effects: {
        stats: { sangFroid: 1 },
        affection: 6,
        trust: 10,
        confluence: 6,
        flags: unique([...flagsSharedByEveryChoice(route.choices), `${route.character}-platonic`]),
      },
    }],
  };
  return { route: variant, sceneId: `${route.id}-friendship-finale` };
}

function choicesForDialogue(dialogue: DialogueState, game: GameState) {
  const base = dialogue.scene.choices || [];
  // Les moments libres et rendez-vous conservent uniquement leurs choix
  // écrits. Les anciennes réponses génériques pouvaient y contredire la scène
  // ou valider une branche sans son flag. Seules les routes majeures reçoivent
  // des issues supplémentaires, toutes rédigées pour leur scène exacte.
  if (dialogue.replay || dialogue.scene.kind !== "route" || !dialogue.scene.route) return base;
  // La conclusion amicale est déjà une scène de conséquence entièrement
  // écrite : y réinjecter une « mauvaise lecture » romantique recréerait la
  // contradiction que cette variante vient précisément résoudre.
  if (dialogue.scene.id.endsWith("-friendship-finale")) return base;
  const characterId = dialogue.scene.character || dialogue.scene.cast[0];
  const character = CHARACTERS.find((entry) => entry.id === characterId);
  const contextual = ROUTE_CONTEXTUAL_CHOICES[dialogue.scene.route.id];
  if (!character || !contextual) return base;
  const misread = contextual.misread;
  const extra: ChoiceData[] = [{
    id: `${dialogue.scene.id}-misread`, text: misread.text, stat: misread.stat,
    response: [{ speaker: character.name, text: misread.response }],
    effects: { stats: { [misread.stat]: 1 }, affection: -3, trust: -5, desire: -2 },
  }];
  const romanticMoment = characterId !== "draven"
    && !game.flags.includes(`${characterId}-platonic`)
    && dialogue.scene.route.stage >= 3;
  if (romanticMoment && contextual.boundary) extra.push({
    id: `${dialogue.scene.id}-boundary`,
    text: contextual.boundary.text,
    stat: contextual.boundary.stat,
    response: [{ speaker: character.name, text: contextual.boundary.response }],
    effects: { stats: { [contextual.boundary.stat]: 1 }, affection: -1, trust: 2, desire: -8 },
  });
  const baseAlreadyOffersPlatonic = base.some((choice) => choice.effects.flags?.includes(`${characterId}-platonic`));
  if (romanticMoment && contextual.platonic && !baseAlreadyOffersPlatonic) extra.push({
    id: `${dialogue.scene.id}-platonic`,
    text: contextual.platonic.text,
    stat: contextual.platonic.stat,
    response: [{ speaker: character.name, text: contextual.platonic.response }],
    effects: {
      stats: { [contextual.platonic.stat]: 1 },
      trust: 3,
      desire: -15,
      flags: unique([`${characterId}-platonic`, ...flagsSharedByEveryChoice(base)]),
    },
  });
  return shuffledChoices([...base, ...extra], `${dialogue.scene.id}:${game.day}:${game.period}:${game.relationships[characterId]?.stage || 0}`);
}

function choiceOpeningLine(choice: ChoiceData): DialogueLine | undefined {
  if (choice.response[0]?.speaker === "{player}") return undefined;
  if (choice.playerLine) return { speaker: "{player}", text: choice.playerLine };
  const spoken = choice.text.match(/«([^»]+)»/s)?.[1];
  if (spoken) return { speaker: "{player}", text: spoken };
  const action = choice.text.replace(/[. ]+$/, "");
  const forms: [RegExp, string][] = [
    [/^Lui demander\s+/i, "Vous lui demandez "], [/^Lui dire\s+/i, "Vous lui dites "], [/^Lui rappeler\s+/i, "Vous lui rappelez "], [/^Lui proposer\s+/i, "Vous lui proposez "], [/^Lui offrir\s+/i, "Vous lui offrez "], [/^Lui répondre\s+/i, "Vous lui répondez "],
    [/^Leur demander\s+/i, "Vous leur demandez "], [/^Leur dire\s+/i, "Vous leur dites "], [/^Leur proposer\s+/i, "Vous leur proposez "], [/^Leur rappeler\s+/i, "Vous leur rappelez "],
    [/^Le laisser\s+/i, "Vous le laissez "], [/^La laisser\s+/i, "Vous la laissez "], [/^Les laisser\s+/i, "Vous les laissez "],
    [/^L’inviter\s+/i, "Vous l’invitez "], [/^L'entraîner\s+/i, "Vous l’entraînez "], [/^L’entraîner\s+/i, "Vous l’entraînez "], [/^L’emmener\s+/i, "Vous l’emmenez "], [/^L’embrasser\s+/i, "Vous l’embrassez "], [/^L’obliger\s+/i, "Vous l’obligez "],
    [/^Demander\s+/i, "Vous demandez "], [/^Proposer\s+/i, "Vous proposez "], [/^Observer\s+/i, "Vous observez "], [/^Écouter\s+/i, "Vous écoutez "], [/^Laisser\s+/i, "Vous laissez "], [/^Rester\s+/i, "Vous restez "],
    [/^Refuser\s+/i, "Vous refusez "], [/^Accepter\s+/i, "Vous acceptez "], [/^Rappeler\s+/i, "Vous rappelez "],
    [/^Prendre\s+/i, "Vous prenez "], [/^Offrir\s+/i, "Vous offrez "], [/^Choisir\s+/i, "Vous choisissez "],
    [/^Suivre\s+/i, "Vous suivez "], [/^Poser\s+/i, "Vous posez "], [/^Partager\s+/i, "Vous partagez "],
    [/^Admettre\s+/i, "Vous admettez "], [/^Transformer\s+/i, "Vous transformez "], [/^Accorder\s+/i, "Vous accordez "],
    [/^Commencer\s+/i, "Vous commencez "], [/^Continuer\s+/i, "Vous continuez "], [/^Bâtir\s+/i, "Vous bâtissez "], [/^Construire\s+/i, "Vous construisez "], [/^Prononcer\s+/i, "Vous prononcez "], [/^Nommer\s+/i, "Vous nommez "],
    [/^Ranger\s+/i, "Vous rangez "], [/^Inventer\s+/i, "Vous inventez "], [/^Comparer\s+/i, "Vous comparez "],
    [/^Lever\s+/i, "Vous levez "], [/^Écrire\s+/i, "Vous écrivez "], [/^Soutenir\s+/i, "Vous soutenez "],
    [/^Détourner\s+/i, "Vous détournez "], [/^Toucher\s+/i, "Vous touchez "], [/^Répondre\s+/i, "Vous répondez "], [/^Dire\s+/i, "Vous dites "], [/^Garder\s+/i, "Vous gardez "],
    [/^Jouer\s+/i, "Vous jouez "], [/^Lire\s+/i, "Vous lisez "], [/^Repousser\s+/i, "Vous repoussez "], [/^Retourner\s+/i, "Vous retournez "], [/^Quitter\s+/i, "Vous quittez "], [/^Entrer\s+/i, "Vous entrez "], [/^Saisir\s+/i, "Vous saisissez "],
    [/^Vérifier\s+/i, "Vous vérifiez "], [/^Repérer\s+/i, "Vous repérez "], [/^Fermer\s+/i, "Vous fermez "], [/^Montrer\s+/i, "Vous montrez "], [/^Ancrer\s+/i, "Vous ancrez "], [/^Souffler\s+/i, "Vous soufflez "],
    [/^Examiner\s+/i, "Vous examinez "], [/^Détruire\s+/i, "Vous détruisez "], [/^Provoquer\s+/i, "Vous provoquez "], [/^Présenter\s+/i, "Vous présentez "], [/^Maintenir\s+/i, "Vous maintenez "], [/^Accuser\s+/i, "Vous accusez "],
    [/^Établir\s+/i, "Vous établissez "], [/^Utiliser\s+/i, "Vous utilisez "], [/^Reconnaître\s+/i, "Vous reconnaissez "], [/^Dissocier\s+/i, "Vous dissociez "], [/^Fixer\s+/i, "Vous fixez "], [/^Menacer\s+/i, "Vous menacez "],
    [/^Souligner\s+/i, "Vous soulignez "], [/^Obtenir\s+/i, "Vous obtenez "], [/^Assumer\s+/i, "Vous assumez "], [/^Mettre\s+/i, "Vous mettez "], [/^Exiger\s+/i, "Vous exigez "], [/^Rompre\s+/i, "Vous rompez "],
    [/^Avouer\s+/i, "Vous avouez "], [/^Préférer\s+/i, "Vous préférez "], [/^Préserver\s+/i, "Vous préservez "], [/^Marcher\s+/i, "Vous marchez "], [/^Séparer\s+/i, "Vous séparez "], [/^Distinguer\s+/i, "Vous distinguez "],
    [/^Déchirer\s+/i, "Vous déchirez "], [/^Jeter\s+/i, "Vous jetez "], [/^Mélanger\s+/i, "Vous mélangez "], [/^Rendre\s+/i, "Vous rendez "], [/^Stabiliser\s+/i, "Vous stabilisez "],
  ];
  const form = forms.find(([pattern]) => pattern.test(action));
  if (!form) return undefined;
  return { speaker: "Narration", text: `${action.replace(form[0], form[1])}.` };
}

function ambientPromptLines(prompt: string, characterName: string): DialogueLine[] {
  const lines: DialogueLine[] = [];
  const pattern = /«([^»]+)»/g;
  let cursor = 0;
  for (const match of prompt.matchAll(pattern)) {
    const before = prompt.slice(cursor, match.index).trim();
    if (before) lines.push({ speaker: "Narration", text: before });
    lines.push({ speaker: characterName, text: match[1] });
    cursor = (match.index || 0) + match[0].length;
  }
  const after = prompt.slice(cursor).trim();
  if (after) lines.push({ speaker: "Narration", text: after });
  return lines.length ? lines : [{ speaker: "Narration", text: prompt }];
}

function backgroundUrl(background: string) {
  if (/^(?:\/|\.{1,2}\/|assets\/|https?:\/\/|data:)/iu.test(background)) return background;
  return `/assets/backgrounds/${background}.webp`;
}

function routeBackground(scene: RouteScene) {
  return spotById(ROUTE_SPOTS[scene.id])?.background || backgroundUrl(scene.background);
}

function expandedLines(scene: SceneView, game: GameState, lines: DialogueLine[], phase: "intro" | "response", spotId = game.spot) {
  const spot = spotById(spotId);
  const lead = scene.cast[0] ? CHARACTERS.find((character) => character.id === scene.cast[0]) : undefined;
  const place = lead ? characterPlace(lead, game.day, game.period, game.flags, game.housing) : undefined;
  return enrichDialogueLines(lines, {
    sceneId: scene.id,
    title: scene.title,
    kind: scene.kind,
    phase,
    cast: scene.cast,
    baseMood: scene.mood,
    spotName: spot?.name,
    action: place?.action,
  });
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("title");
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);
  const [game, setGame] = useState<GameState | null>(null);
  const [tab, setTab] = useState<Tab>("place");
  const [hasSave, setHasSave] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("algratal");
  const [selectedSpot, setSelectedSpot] = useState("algratal-palace-council");
  const [mapDestinationOpen, setMapDestinationOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [slotInfo, setSlotInfo] = useState<Record<number, string>>({});
  const [ritualSequence, setRitualSequence] = useState<string[]>([]);
  const [ritualStep, setRitualStep] = useState(0);
  const [ritualPhase, setRitualPhase] = useState<"memorize" | "play" | "success" | "failure">("memorize");
  const [jobState, setJobState] = useState<JobState | null>(null);
  const [notifications, setNotifications] = useState<ChronicleNotification[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousGameRef = useRef<GameState | null>(null);
  const notificationIdRef = useRef(0);
  const notificationTimersRef = useRef<number[]>([]);
  const audioVolume = game?.settings.volume ?? DEFAULT_SETTINGS.volume;
  const activeJobId = jobState?.jobId;
  const activeJobPhase = jobState?.phase;
  const activeAssemblyStage = jobState?.assemblyStage;
  const currentPlaceKey = game ? `${game.location}:${game.spot}` : "";

  const pushNotification = useCallback((draft: ChronicleNotificationDraft) => {
    const id = ++notificationIdRef.current;
    setNotifications((current) => [...current, { ...draft, id }].slice(-4));
    const timer = window.setTimeout(() => {
      setNotifications((current) => current.filter((entry) => entry.id !== id));
      notificationTimersRef.current = notificationTimersRef.current.filter((entry) => entry !== timer);
    }, 5200);
    notificationTimersRef.current.push(timer);
  }, []);

  useEffect(() => () => {
    notificationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!game || screen !== "game") {
      previousGameRef.current = null;
      return;
    }
    const previous = previousGameRef.current;
    previousGameRef.current = game;
    if (!previous || previous === game) return;
    gameNotifications(previous, game).forEach(pushNotification);
  }, [game, pushNotification, screen]);

  useEffect(() => {
    if (!mapDestinationOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMapDestinationOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mapDestinationOpen]);

  useEffect(() => {
    if (!activeJobId || activeJobPhase !== "play") return;
    const job = JOBS.find((entry) => entry.id === activeJobId);
    const calibratingAssembly = job?.id === "tzekarun-mechanism" && activeAssemblyStage === "calibrate";
    if (job?.kind !== "timing" && !calibratingAssembly) return;
    const timer = window.setInterval(() => {
      setJobState((current) => {
        if (!current || current.phase !== "play") return current;
        const speed = calibratingAssembly ? 2.5 + current.round * .35 : 2.2 + current.round * .45;
        let next = current.timingPosition + speed * current.timingDirection;
        let direction = current.timingDirection;
        if (next >= 100) { next = 100; direction = -1; }
        if (next <= 0) { next = 0; direction = 1; }
        return { ...current, timingPosition: next, timingDirection: direction };
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [activeAssemblyStage, activeJobId, activeJobPhase]);

  useEffect(() => {
    if (activeJobId !== "forestier-service" || activeJobPhase !== "play") return;
    const timer = window.setInterval(() => {
      setJobState((current) => {
        if (!current || current.jobId !== "forestier-service" || current.phase !== "play") return current;
        if (current.serviceTimeLeft <= 1) return finishServiceCustomer(current, false, "Le client renonce à attendre. La table suivante vous laisse trois secondes de moins.");
        return { ...current, serviceTimeLeft: current.serviceTimeLeft - 1 };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeJobId, activeJobPhase]);

  useEffect(() => {
    if (activeJobId !== "forbidden-herbs" || activeJobPhase !== "play") return;
    const timer = window.setInterval(() => {
      setJobState((current) => {
        if (!current || current.jobId !== "forbidden-herbs" || current.phase !== "play") return current;
        if (current.harvestTimeLeft <= 1) return { ...current, harvestTimeLeft: 0, phase: current.score >= 5 ? "success" : "failure", feedbackText: "La brume se referme et efface les dernières pousses." };
        return { ...current, harvestTimeLeft: current.harvestTimeLeft - 1 };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeJobId, activeJobPhase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasSave(Boolean(window.localStorage.getItem(SAVE_KEY)));
      setSlotInfo(readSlotInfo());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!game || screen !== "game") return;
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }, [game, screen]);

  useEffect(() => {
    if (screen !== "game") return;
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    return () => window.cancelAnimationFrame(frame);
  }, [currentPlaceKey, screen, tab]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = audioVolume / 100;
  }, [audioVolume]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        updateGame((current) => ({ ...current, settings: { ...current.settings, developer: !current.settings.developer } }));
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  function updateGame(transform: (current: GameState) => GameState) {
    setGame((current) => current ? evolveLivingWorld(transform(current)) : current);
  }

  function refreshSlots() {
    setSlotInfo(readSlotInfo());
  }

  function begin() {
    if (!player.name.trim() || player.age < 18) return;
    const next = createGame({ ...player, name: player.name.trim() });
    const introLines = [...INTRO_SCENE, originLine(next.player)];
    const introScene: SceneView = { id: "intro", title: "Prologue · Le portail emprunté", background: "/assets/backgrounds/bedroom.webp", mood: "mysterious", character: "saidin", cast: ["saidin"], intro: introLines, kind: "intro" };
    setGame(next);
    setHasSave(true);
    setSelectedLocation("algratal");
    setSelectedSpot(next.spot);
    setTab("place");
    setScreen("game");
    setDialogue({
      scene: introScene,
      lines: expandedLines(introScene, next, introLines, "intro"),
      lineIndex: 0,
      phase: "intro",
    });
  }

  function continueGame() {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const loaded = hydrateGame(JSON.parse(raw));
      if (!loaded) throw new Error("invalid save");
      setPlayer(loaded.player);
      previousGameRef.current = loaded;
      setGame(loaded);
      setSelectedLocation(loaded.location);
      setSelectedSpot(loaded.spot);
      setTab("place");
      setScreen("game");
    } catch {
      setHasSave(false);
      setModal({ kind: "notice", title: "Sauvegarde illisible", text: "La chronique automatique n’a pas pu être restaurée." });
    }
  }

  function advancePeriod(steps = 1) {
    if (!game || game.settings.noTimeCost) return;
    updateGame((current) => {
      if (current.settings.noTimeCost) return current;
      const clock = advanceClock(current, steps, PERIODS.length);
      return { ...current, ...clock };
    });
  }

  function applyEffects(characterId: string | undefined, effects: Effects, completedScene?: RouteScene) {
    updateGame((current) => {
      const stats = { ...current.stats };
      for (const [key, value] of Object.entries(effects.stats || {})) stats[key as StatKey] += value || 0;
      const relationships = { ...current.relationships };
      if (characterId) {
        const relation = { ...relationships[characterId] };
        relation.affection = clamp(relation.affection + (effects.affection || 0));
        relation.trust = clamp(relation.trust + (effects.trust || 0));
        relation.desire = clamp(relation.desire + (effects.desire || 0));
        relation.met = true;
        if (completedScene) relation.stage = Math.max(relation.stage, completedScene.stage + 1);
        relationships[characterId] = relation;
      }
      for (const [otherId, changes] of Object.entries(effects.relationshipEffects || {})) {
        if (!relationships[otherId]) continue;
        const relation = { ...relationships[otherId] };
        relation.affection = clamp(relation.affection + (changes.affection || 0));
        relation.trust = clamp(relation.trust + (changes.trust || 0));
        relation.desire = clamp(relation.desire + (changes.desire || 0));
        relation.met = true;
        relationships[otherId] = relation;
      }
      const character = CHARACTERS.find((entry) => entry.id === characterId);
      const inventory = { ...current.inventory };
      for (const [itemId, amount] of Object.entries(effects.items || {})) inventory[itemId] = (inventory[itemId] || 0) + amount;
      if (completedScene?.stage === 4 && characterId && characterId !== "valurn") {
        const keepsake = STORY_KEEPSAKE_BY_CHARACTER[characterId];
        if (keepsake && !inventory[keepsake]) inventory[keepsake] = 1;
      }
      return {
        ...current,
        stats,
        relationships,
        inventory,
        confluence: clamp(current.confluence + (effects.confluence || 0)),
        coins: Math.max(0, current.coins + (effects.coins || 0)),
        flags: unique([...current.flags, ...(effects.flags || [])]),
        knowledge: unique([...current.knowledge, ...(effects.knowledge || [])]),
        history: completedScene ? unique([...current.history, completedScene.id]) : current.history,
        journal: completedScene ? [...current.journal, `${character?.name || "Rencontre"} · ${completedScene.title}`] : current.journal,
        codex: completedScene ? unique([...current.codex, character?.name || "", completedScene.title].filter(Boolean)) : current.codex,
      };
    });
  }

  function openCharacterScene(characterId: string) {
    if (!game) return;
    const character = CHARACTERS.find((entry) => entry.id === characterId);
    if (!character) return;
    const relation = game.relationships[characterId];
    const ownedHome = propertyById(game.housing.propertyId);
    if (ownedHome?.spot === game.spot && game.housing.residents.includes(characterId)) {
      const residentsHere = game.housing.residents.filter((id) => {
        const resident = CHARACTERS.find((entry) => entry.id === id);
        return resident && characterPlace(resident, game.day, game.period, game.flags, game.housing).spot === game.spot;
      });
      const sharedMoment = availableSharedHomeMoment(residentsHere, game.housing.sharedMomentHistory);
      const sharedForCharacter = sharedMoment?.characters.includes(characterId) ? sharedMoment : undefined;
      const seen = game.housing.residentMomentHistory[characterId] || [];
      const personalDeck = RESIDENT_MOMENTS[characterId] || [];
      const personalMoment = personalDeck.find((entry) => !seen.includes(entry.id)) || personalDeck[seen.length % Math.max(1, personalDeck.length)];
      const homeMoment = sharedForCharacter || personalMoment;
      if (homeMoment) {
        const scene: SceneView = {
          id: homeMoment.id,
          title: homeMoment.title,
          background: ownedHome.background,
          mood: character.defaultMood,
          character: homeMoment.characters[0],
          cast: homeMoment.characters,
          intro: homeMoment.intro,
          choices: homeMoment.choices,
          kind: "home",
          homeMomentId: homeMoment.id,
          homeMomentCharacters: homeMoment.characters,
        };
        setDialogue({ scene, lines: expandedLines(scene, game, scene.intro, "intro"), lineIndex: 0, phase: "intro" });
        return;
      }
    }
    const route = sceneFor(characterId, relation.stage);
    const bond = relation.affection + relation.trust;
    const routeSpotId = route ? ROUTE_SPOTS[route.id] : undefined;
    const routePeriods = route ? ROUTE_PERIODS[route.id] : undefined;
    const ready = route
      && game.day >= route.dayMin
      && route.location === game.location
      && routeSpotId === game.spot
      && (!routePeriods || routePeriods.includes(PERIODS[game.period].id))
      && bond >= BOND_THRESHOLDS[route.stage]
      && routeNarrativeReady(route, game);
    const queuedSocial = chooseSocialScene(characterId, game);
    if (queuedSocial?.oneTime) {
      const scene: SceneView = {
        id: queuedSocial.id,
        title: queuedSocial.title,
        background: spotById(game.spot)?.background || backgroundUrl("streets"),
        mood: queuedSocial.mood || character.defaultMood,
        character: characterId,
        cast: queuedSocial.characters,
        intro: queuedSocial.prompt,
        choices: queuedSocial.choices,
        kind: "social",
        socialId: queuedSocial.id,
      };
      setDialogue({
        scene,
        lines: expandedLines(scene, game, queuedSocial.prompt, "intro"),
        lineIndex: 0,
        phase: "intro",
      });
      return;
    }
    if (ready && route) {
      const playable = relationRouteVariant(route, game);
      const scene: SceneView = { ...playable.route, id: playable.sceneId, background: routeBackground(playable.route), cast: [playable.route.character], kind: "route", route: playable.route };
      setDialogue({
        scene,
        lines: expandedLines(scene, game, playable.route.intro, "intro"),
        lineIndex: 0,
        phase: "intro",
      });
      return;
    }
    const secret = availableSecretForCharacter(characterId, game);
    if (secret) {
      const scene: SceneView = {
        id: secret.id,
        title: secret.title,
        background: spotById(game.spot)?.background || backgroundUrl("streets"),
        mood: character.defaultMood,
        character: characterId,
        cast: [characterId],
        intro: secret.intro,
        choices: secret.choices,
        kind: "secret",
        secretId: secret.id,
      };
      setDialogue({ scene, lines: expandedLines(scene, game, secret.intro, "intro"), lineIndex: 0, phase: "intro" });
      return;
    }
    const social = queuedSocial;
    if (social) {
      const scene: SceneView = {
        id: social.id,
        title: social.title,
        background: spotById(game.spot)?.background || backgroundUrl("streets"),
        mood: social.mood || character.defaultMood,
        character: characterId,
        cast: social.characters,
        intro: social.prompt,
        choices: social.choices,
        kind: "social",
        socialId: social.id,
      };
      setDialogue({
        scene,
        lines: expandedLines(scene, game, social.prompt, "intro"),
        lineIndex: 0,
        phase: "intro",
      });
      return;
    }
    const ambientHistory = game.ambientHistory[characterId] || [];
    const ambient = chooseAmbientDialogue(
      AMBIENT_LINES[characterId] || [],
      relation.stage,
      game.location,
      game.spot,
      PERIODS[game.period].id,
      ambientHistory,
    );
    if (!ambient) {
      const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
      setModal({ kind: "notice", title: `${character.name} est occupé·e`, text: `${character.name} ${place.action}. Revenez à une autre période : ses conversations suivent maintenant son activité et ce sous-lieu.` });
      return;
    }
    const ambientIntro = ambientPromptLines(ambient.prompt, character.name);
    const scene: SceneView = {
      id: ambient.id,
      title: ambient.title,
      background: spotById(game.spot)?.background || backgroundUrl("streets"),
      mood: ambient.mood || character.defaultMood,
      character: characterId,
      cast: [characterId],
      intro: ambientIntro,
      choices: ambient.choices,
      kind: "ambient",
      ambientId: ambient.id,
    };
    setDialogue({
      scene,
      lines: expandedLines(scene, game, ambientIntro, "intro"),
      lineIndex: 0,
      phase: "intro",
    });
  }

  function openSpontaneousEvent(event: SpontaneousEvent) {
    if (!game || !spontaneousEventReady(event, game)) return;
    const lead = CHARACTERS.find((entry) => entry.id === event.characters[0]);
    const scene: SceneView = {
      id: event.id,
      title: event.title,
      background: spotById(game.spot)?.background || backgroundUrl("streets"),
      mood: event.mood || lead?.defaultMood || "neutral",
      character: event.characters[0],
      cast: event.characters,
      intro: event.intro,
      choices: event.choices,
      kind: "world",
      worldEventId: event.id,
    };
    setDialogue({ scene, lines: expandedLines(scene, game, event.intro, "intro"), lineIndex: 0, phase: "intro" });
  }

  function hearRumor(rumor: RumorTemplate) {
    if (!game || !rumorReady(rumor, game)) return;
    updateGame((current) => ({
      ...current,
      rumors: [...current.rumors, { id: rumor.id, heardDay: current.day }],
      knowledge: rumor.leadKnowledge ? unique([...current.knowledge, rumor.leadKnowledge]) : current.knowledge,
      journal: [...current.journal, `Rumeur entendue · ${rumor.source}`],
    }));
    setModal({ kind: "notice", title: rumor.source, text: `« ${rumor.text} »\n\nLe Journal conserve cette version sans prétendre qu’elle soit vraie.` });
  }

  function readLetter(letterId: string) {
    if (!game) return;
    const letter = LETTERS.find((entry) => entry.id === letterId);
    const received = game.letters.find((entry) => entry.id === letterId);
    if (!letter || !received) return;
    const firstRead = !received.read;
    updateGame((current) => {
      const inventory = { ...current.inventory };
      if (firstRead && letter.attachedItem) inventory[letter.attachedItem] = (inventory[letter.attachedItem] || 0) + 1;
      return {
        ...current,
        inventory,
        letters: current.letters.map((entry) => entry.id === letterId ? { ...entry, read: true } : entry),
        journal: firstRead ? [...current.journal, `Lettre lue · ${letter.subject}`] : current.journal,
      };
    });
    setModal({ kind: "letter", letterId });
  }

  function replyToLetter(letter: LetterTemplate, replyId: string) {
    if (!game) return;
    const reply = letter.replies?.find((entry) => entry.id === replyId);
    const received = game.letters.find((entry) => entry.id === letter.id);
    if (!reply || !received || received.replyId) return;
    applyEffects(letter.character, reply.effects);
    updateGame((current) => ({
      ...current,
      letters: current.letters.map((entry) => entry.id === letter.id ? { ...entry, replyId } : entry),
      journal: [...current.journal, `Réponse envoyée · ${letter.subject}`],
    }));
  }

  function acceptInvitation(invitation: InvitationTemplate) {
    if (!game) return;
    const received = game.invitations.find((entry) => entry.id === invitation.id);
    if (!received || received.status !== "pending" || game.day > received.expiresDay) return;
    const character = CHARACTERS.find((entry) => entry.id === invitation.character);
    const period = PERIODS.findIndex((entry) => entry.id === invitation.period);
    const scene: SceneView = {
      id: invitation.id,
      title: invitation.title,
      background: spotById(invitation.spot)?.background || backgroundUrl("streets"),
      mood: character?.defaultMood || "neutral",
      character: invitation.character,
      cast: [invitation.character],
      intro: invitation.intro,
      choices: invitation.choices,
      kind: "invitation",
      invitationId: invitation.id,
    };
    updateGame((current) => ({
      ...current,
      location: invitation.location,
      spot: invitation.spot,
      period: period >= 0 ? period : current.period,
      ...placeDiscovery(current, invitation.location, invitation.spot),
      invitations: current.invitations.map((entry) => entry.id === invitation.id ? { ...entry, status: "accepted" } : entry),
    }));
    setSelectedLocation(invitation.location);
    setSelectedSpot(invitation.spot);
    setModal(null);
    setDialogue({ scene, lines: expandedLines(scene, { ...game, location: invitation.location, spot: invitation.spot, period: period >= 0 ? period : game.period }, invitation.intro, "intro", invitation.spot), lineIndex: 0, phase: "intro" });
  }

  function declineInvitation(invitation: InvitationTemplate) {
    if (!game) return;
    const received = game.invitations.find((entry) => entry.id === invitation.id);
    if (!received || received.status !== "pending") return;
    if (invitation.declineEffects) applyEffects(invitation.character, invitation.declineEffects);
    updateGame((current) => ({
      ...current,
      invitations: current.invitations.map((entry) => entry.id === invitation.id ? { ...entry, status: "declined" } : entry),
      journal: [...current.journal, `Invitation refusée · ${invitation.title}`],
    }));
    setModal({ kind: "notice", title: "Invitation refusée", text: invitation.declineText });
  }

  function advanceDialogue() {
    if (!dialogue) return;
    if (dialogue.lineIndex < dialogue.lines.length - 1) {
      setDialogue({ ...dialogue, lineIndex: dialogue.lineIndex + 1 });
      return;
    }
    if (dialogue.phase === "intro" && dialogue.scene.choices?.length) {
      setDialogue({ ...dialogue, phase: "choices" });
      return;
    }
    closeDialogue();
  }

  function selectChoice(choice: ChoiceData) {
    if (!dialogue || !game) return;
    if (choice.requires && game.stats[choice.requires.stat] < choice.requires.value && !game.settings.unlockAll) return;
    if (!hasKnowledge(game, choice.requiresKnowledge) && !game.settings.unlockAll) return;
    if (!relationshipRequirementMet(choice, game) && !game.settings.unlockAll) return;
    const route = dialogue.scene.kind === "route" && routeChoiceCompletes(choice.id) ? dialogue.scene.route : undefined;
    if (!dialogue.replay) applyEffects(dialogue.scene.character, choice.effects, route);
    if (!dialogue.replay && dialogue.scene.kind === "story" && dialogue.scene.campaignSceneId) {
      const campaign = campaignSceneById(dialogue.scene.campaignSceneId);
      if (campaign) updateGame((current) => ({
        ...current,
        history: unique([...current.history, campaign.id]),
        sceneMemories: { ...current.sceneMemories, [campaign.id]: campaign.spot },
        journal: [...current.journal, `Campagne · ${campaign.title}`],
        codex: unique([...current.codex, campaign.title]),
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "ambient" && dialogue.scene.character && dialogue.scene.ambientId) {
      const characterId = dialogue.scene.character;
      const ambientId = dialogue.scene.ambientId;
      updateGame((current) => ({
        ...current,
        ambientHistory: {
          ...current.ambientHistory,
          [characterId]: [...(current.ambientHistory[characterId] || []), ambientId].slice(-96),
        },
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "social" && dialogue.scene.socialId) {
      const socialId = dialogue.scene.socialId;
      const social = SOCIAL_SCENES.find((entry) => entry.id === socialId);
      updateGame((current) => ({
        ...current,
        flags: social?.oneTime ? unique([...current.flags, `social:${socialId}`]) : current.flags,
        sharedHistory: [...current.sharedHistory, `${socialId}@${current.day}`].slice(-96),
        sceneMemories: { ...current.sceneMemories, [socialId]: current.spot },
        journal: social?.oneTime ? [...current.journal, `Liens croisés · ${social.title}`] : current.journal,
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "home" && dialogue.scene.homeMomentId) {
      const momentId = dialogue.scene.homeMomentId;
      const characters = dialogue.scene.homeMomentCharacters || dialogue.scene.cast;
      updateGame((current) => {
        const sharedMoment = momentId.startsWith("home-shared-");
        const residentMomentHistory = { ...current.housing.residentMomentHistory };
        if (!sharedMoment) {
          const owner = characters[0];
          residentMomentHistory[owner] = unique([...(residentMomentHistory[owner] || []), momentId]).slice(-24);
        }
        return {
          ...current,
          housing: {
            ...current.housing,
            residentMomentHistory,
            sharedMomentHistory: sharedMoment ? unique([...current.housing.sharedMomentHistory, momentId]) : current.housing.sharedMomentHistory,
          },
          journal: [...current.journal, `Logis · ${dialogue.scene.title} · ${characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name).filter(Boolean).join(" et ")}`],
        };
      });
    }
    if (!dialogue.replay && dialogue.scene.kind === "secret" && dialogue.scene.secretId) {
      const secret = SECRET_CONVERSATIONS.find((entry) => entry.id === dialogue.scene.secretId);
      if (secret) updateGame((current) => ({
        ...current,
        secretHistory: unique([...current.secretHistory, secret.id]),
        knowledge: unique([...current.knowledge, ...secret.reveals]),
        sceneMemories: { ...current.sceneMemories, [secret.id]: current.spot },
        journal: [...current.journal, `Confidence · ${CHARACTERS.find((entry) => entry.id === secret.character)?.name} · ${secret.title}`],
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "world" && dialogue.scene.worldEventId) {
      const event = SPONTANEOUS_EVENTS.find((entry) => entry.id === dialogue.scene.worldEventId);
      if (event) updateGame((current) => ({
        ...current,
        worldEventHistory: unique([...current.worldEventHistory, event.id]),
        sceneMemories: { ...current.sceneMemories, [event.id]: current.spot },
        journal: [...current.journal, `Événement croisé · ${event.title}`],
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "invitation" && dialogue.scene.invitationId) {
      const invitation = INVITATIONS.find((entry) => entry.id === dialogue.scene.invitationId);
      if (invitation) updateGame((current) => ({
        ...current,
        invitations: current.invitations.map((entry) => entry.id === invitation.id ? { ...entry, status: "accepted" } : entry),
        journal: [...current.journal, `Invitation honorée · ${invitation.title}`],
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "date" && dialogue.scene.date) {
      const date = dialogue.scene.date;
      updateGame((current) => ({
        ...current,
        dateHistory: [...current.dateHistory, date.id].slice(-96),
        sceneMemories: { ...current.sceneMemories, [date.id]: date.spot },
        journal: [...current.journal, `Rendez-vous · ${date.title} avec ${CHARACTERS.find((entry) => entry.id === date.character)?.name}`],
      }));
    }
    if (!dialogue.replay && dialogue.scene.kind === "group-date" && dialogue.scene.groupDate) {
      const groupDate = dialogue.scene.groupDate;
      const names = groupDate.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name || id).join(" et ");
      updateGame((current) => ({
        ...current,
        groupDateHistory: [...current.groupDateHistory, groupDate.id].slice(-96),
        sceneMemories: { ...current.sceneMemories, [groupDate.id]: groupDate.spot },
        journal: [...current.journal, `Rendez-vous à trois · ${groupDate.title} avec ${names}`],
      }));
    }
    const opening = choiceOpeningLine(choice);
    const injectedEnding = injectedChoiceAftermath(choice, dialogue.scene.character || dialogue.scene.cast[0]);
    const authoredEnding = injectedEnding.length ? injectedEnding : sceneClosure(dialogue.scene.id);
    const response = opening
      ? [opening, ...choice.response, ...authoredEnding]
      : [...choice.response, ...authoredEnding];
    setDialogue({ ...dialogue, chosen: choice, lines: expandedLines(dialogue.scene, game, response, "response"), lineIndex: 0, phase: "response" });
  }

  function closeDialogue() {
    if (!dialogue) return;
    const intimateCharacter = dialogue.scene.route?.intimate
      && Boolean(dialogue.chosen && routeChoiceCompletes(dialogue.chosen.id))
      && !dialogue.chosen?.effects.flags?.some((flag) => flag.endsWith("-platonic"))
      && !dialogue.chosen?.id.endsWith("-boundary")
      && !dialogue.chosen?.id.endsWith("-platonic")
      ? dialogue.scene.character : undefined;
    const consumesTime = dialogue.scene.kind !== "intro" && !dialogue.replay;
    const replay = dialogue.replay;
    const background = dialogue.scene.background;
    const date = dialogue.scene.date;
    const groupDate = dialogue.scene.groupDate;
    const dateCanBecomeIntimate = date
      && dialogue.chosen?.dateOutcome === "great"
      && !game!.flags.includes(`${date.character}-platonic`)
      && (game!.relationships[date.character].stage >= 4 || game!.settings.unlockAll)
      && (game!.relationships[date.character].affection + (dialogue.chosen.effects.affection || 0) >= 34 || game!.settings.unlockAll)
      && (game!.relationships[date.character].trust + (dialogue.chosen.effects.trust || 0) >= 32 || game!.settings.unlockAll);
    const groupDateCanBecomeIntimate = Boolean(groupDate
      && dialogue.chosen?.dateOutcome === "great"
      && groupDateUnlocked(game!, groupDate)
      && groupDate.characters.every((characterId, index) => {
        const relation = game!.relationships[characterId];
        const changes = index === 0
          ? dialogue.chosen!.effects
          : dialogue.chosen!.effects.relationshipEffects?.[characterId] || {};
        return game!.settings.unlockAll || (
          relation.stage >= groupDate.minStage
          && relation.affection + (changes.affection || 0) >= groupDate.minAffection
          && relation.trust + (changes.trust || 0) >= groupDate.minTrust
          && relation.desire + (changes.desire || 0) >= groupDate.minDesire
        );
      }));
    setDialogue(null);
    if (!replay && groupDateCanBecomeIntimate && groupDate) {
      setModal({ kind: "group-date-result", groupDateId: groupDate.id });
    } else if (!replay && dateCanBecomeIntimate && date) {
      setModal({ kind: "date-result", character: date.character, dateId: date.id });
    } else if (intimateCharacter) {
      setModal({ kind: "intimacy", character: intimateCharacter, background, replay });
    } else if (consumesTime && !date && !groupDate) {
      advancePeriod();
    }
  }

  function travel(locationId: string, spotId: string) {
    if (!game) return;
    const location = LOCATIONS.find((entry) => entry.id === locationId);
    const spot = spotById(spotId);
    if (!location || !spot || spot.location !== locationId || (game.day < location.unlockDay && !game.settings.unlockAll)) return;
    if (game.location === locationId && game.spot === spotId) return;
    const periods = travelPeriodCost(game.location, locationId, game.player.vocation, LOCATIONS);
    updateGame((current) => {
      const clock = current.settings.noTimeCost ? { day: current.day, period: current.period } : advanceClock(current, periods, PERIODS.length);
      return { ...current, ...clock, location: locationId, spot: spotId, ...placeDiscovery(current, locationId, spotId) };
    });
    setTab("place");
  }

  function performActivity(activityId: string) {
    if (!game) return;
    if (activityId === "market") {
      setModal({ kind: "shop" });
      return;
    }
    if (activityId === "attunement") {
      const runes = ["✦", "◇", "◐", "⌁", "✧"];
      const start = (game.day + game.period) % runes.length;
      setRitualSequence(Array.from({ length: 4 }, (_, index) => runes[(start + index * 2) % runes.length]));
      setRitualStep(0);
      setRitualPhase("memorize");
      setModal({ kind: "ritual" });
      return;
    }
    const activity = ACTIVITIES[activityId];
    if (!activity) return;
    updateGame((current) => {
      const stats = { ...current.stats };
      if (activity.stat) stats[activity.stat] += 1;
      return {
        ...current,
        stats,
        coins: current.coins + (activity.coins || 0),
        confluence: clamp(current.confluence + (activityId === "rest" ? 3 : 1)),
        journal: [...current.journal, `${PERIODS[current.period].label} · ${activity.label} à ${spotById(current.spot)?.name || LOCATIONS.find((location) => location.id === current.location)?.name}`],
      };
    });
    setModal({ kind: "notice", title: activity.label, text: activity.stat ? `${STAT_LABELS[activity.stat]} progresse. La Confluence répond à votre action.` : "Vous reprenez votre souffle. La Confluence se stabilise légèrement.", consumeTime: true });
  }

  function closeActivityNotice() {
    setModal(null);
    advancePeriod();
  }

  function openJob(job: JobData) {
    if (!game) return;
    const access = jobAccess(game, job);
    if (!access.unlocked) {
      setModal({ kind: "notice", title: "Contrat réservé", text: `${job.employer} ne confie pas encore ce travail à une personne inconnue du dossier. Développez votre lien avec ${access.characterName} : ${access.value} / ${access.target}.` });
      return;
    }
    const run = game.jobRuns[job.id] || 0;
    const symbols = job.symbols || [];
    const variant = run;
    const roundOrder = jobRoundOrder(job, run, 5);
    const sequence = job.kind === "memory" ? Array.from({ length: job.length || 4 }, (_, index) => (
      symbols[stableChoiceIndex(`${job.id}:memory:${run}:${index}`, symbols.length)]
    )) : [];
    const firstMarketCustomer = job.id === "algratal-merchant" ? marketCustomers(variant)[0] : undefined;
    const path = jobPathForSession(job, variant);
    updateGame((current) => ({ ...current, jobRuns: { ...current.jobRuns, [job.id]: run + 1 } }));
    setJobState({
      jobId: job.id,
      sequence,
      step: 0,
      phase: "briefing",
      round: 0,
      score: 0,
      mistakes: 0,
      variant,
      leftWeight: 0,
      rightWeight: 0,
      pathPosition: path?.start || 0,
      pathSteps: 0,
      timingPosition: 0,
      timingDirection: 1,
      roundOrder,
      combo: 0,
      maxCombo: 0,
      serviceSelections: {},
      serviceTimeLeft: 20,
      inspectionFound: [],
      inspectionScanUsed: false,
      assemblySlots: [null, null, null, null],
      assemblyRotations: [0, 0, 0, 0],
      assemblySelectedRotation: 0,
      assemblyStage: "build",
      assemblyTests: 0,
      harvestTimeLeft: 45,
      harvestTool: "shadow",
      harvestWave: 0,
      harvestWaveScore: 0,
      harvestPicked: [],
      harvestRejected: [],
      harvestFocus: 2,
      marketPrice: firstMarketCustomer?.base || 0,
      marketTactic: "direct",
      marketCounter: 0,
      marketProfit: 0,
      marketReputation: 0,
      visited: path ? [path.start] : [],
    });
    setModal({ kind: "job", jobId: job.id });
  }

  function beginJob() {
    setJobState((current) => {
      if (!current || current.phase !== "briefing") return current;
      const job = JOBS.find((entry) => entry.id === current.jobId);
      return { ...current, phase: job?.kind === "memory" ? "memorize" : "play" };
    });
  }

  function startMemoryJob() {
    setJobState((current) => current?.phase === "memorize" ? { ...current, phase: "play" } : current);
  }

  function playJobAction(action: string) {
    if (!game) return;
    setJobState((current) => {
      if (!current || current.phase !== "play") return current;
      const job = JOBS.find((entry) => entry.id === current.jobId);
      if (!job) return current;

      if (job.id === "forestier-service") {
        const customers = serviceCustomers(current.variant);
        const customer = customers[current.round];
        if (!customer) return current;
        if (action.startsWith("service:item:")) {
          const itemId = action.slice("service:item:".length);
          const item = TAVERN_MENU.find((entry) => entry.id === itemId);
          if (!item) return current;
          const selections = { ...current.serviceSelections };
          selections[item.category] = selections[item.category] === item.id ? undefined : item.id;
          return { ...current, serviceSelections: selections, feedbackText: undefined, lastResult: undefined };
        }
        if (action === "service:clear") return { ...current, serviceSelections: {}, feedbackText: undefined };
        if (action !== "service:serve" || !Object.keys(current.serviceSelections).length) return current;
        const correct = serviceOrderIsValid(customer, current.serviceSelections);
        return finishServiceCustomer(
          current,
          correct,
          correct
            ? "Le client confirme le plateau d’un signe satisfait. La table suivante s’installe."
            : "Le plateau revient en cuisine. La prochaine table commence avec trois secondes de moins.",
        );
      }

      if (job.id === "forestier-rooms") {
        const room = inspectionRoom(current.variant, current.round);
        if (action === "inspection:scan") {
          return { ...current, inspectionScanUsed: true, feedbackText: "La lanterne d’inspection souligne les défauts inhabituels. La prime de perfection ne sera plus accordée.", lastResult: undefined };
        }
        if (!action.startsWith("inspection:hotspot:")) return current;
        const hotspotId = action.slice("inspection:hotspot:".length);
        if (current.inspectionFound.includes(hotspotId)) return current;
        const hotspot = room.hotspots.find((entry) => entry.id === hotspotId);
        if (!hotspot) return current;
        const inspectionFound = [...current.inspectionFound, hotspotId];
        if (hotspot.kind === "decoy") {
          const mistakes = current.mistakes + 1;
          return {
            ...current, inspectionFound, mistakes,
            phase: mistakes >= 4 ? "failure" : current.phase,
            feedbackText: "Vous perdez du temps sur un objet usé mais parfaitement propre et fonctionnel.",
            lastResult: "wrong",
          };
        }
        const score = current.score + 1;
        const foundTasks = room.hotspots.filter((entry) => entry.kind !== "decoy" && inspectionFound.includes(entry.id)).length;
        if (foundTasks < room.taskCount) {
          return { ...current, inspectionFound, score, feedbackText: hotspot.detail, lastResult: "correct" };
        }
        const round = current.round + 1;
        if (round >= 3) {
          return {
            ...current, round, score, inspectionFound: [],
            phase: current.mistakes === 0 && !current.inspectionScanUsed ? "perfect" : current.mistakes <= 3 ? "success" : "failure",
            feedbackText: "La dernière chambre est prête avant l’arrivée des voyageurs.", lastResult: "correct",
          };
        }
        return {
          ...current, round, score, inspectionFound: [], feedbackText: "La chambre est prête. Vous passez à la suivante.", lastResult: "correct",
        };
      }

      if (job.id === "algratal-petitions") {
        if (!action.startsWith("petition:")) return current;
        const petitions = petitionDeck(current.variant);
        const petition = petitions[current.round];
        if (!petition) return current;
        const decision = action.slice("petition:".length);
        const correct = decision === petition.action || Boolean(petition.special?.accepted && decision === `special:${petition.special.id}`);
        const score = current.score + (correct ? 1 : 0);
        const mistakes = current.mistakes + (correct ? 0 : 1);
        const round = current.round + 1;
        const destination = petition.action === "empress" ? "le cabinet impérial" : petition.action === "guard" ? "la garde impériale" : petition.action === "approve" ? "l’intendance compétente" : "la corbeille des requêtes classées";
        const feedbackText = correct
          ? decision.startsWith("special:") ? "L’annotation provoque un silence, puis un rire étouffé : contre toute attente, elle règle le dossier." : `Le dossier rejoint ${destination}.`
          : `Le secrétaire reprend le feuillet avant son départ : certains détails imposaient ${destination}.`;
        if (round >= petitions.length) return { ...current, round, score, mistakes, phase: mistakes === 0 ? "perfect" : mistakes <= 3 ? "success" : "failure", feedbackText, lastResult: correct ? "correct" : "wrong" };
        return { ...current, round, score, mistakes, feedbackText, lastResult: correct ? "correct" : "wrong" };
      }

      if (job.id === "tzekarun-mechanism") {
        const blueprint = assemblyBlueprint(current.variant);
        if (current.assemblyStage === "build") {
          if (action.startsWith("assembly:select:")) {
            const partId = action.slice("assembly:select:".length);
            if (!ASSEMBLY_PARTS.some((part) => part.id === partId)) return current;
            return { ...current, assemblySelected: partId, assemblySelectedRotation: 0, feedbackText: undefined, lastResult: undefined };
          }
          if (action === "assembly:rotate" && current.assemblySelected) return { ...current, assemblySelectedRotation: (current.assemblySelectedRotation + 90) % 360, feedbackText: undefined };
          if (action.startsWith("assembly:remove:")) {
            const slotIndex = Number(action.slice("assembly:remove:".length));
            if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 3) return current;
            const slots = [...current.assemblySlots];
            slots[slotIndex] = null;
            return { ...current, assemblySlots: slots, feedbackText: "La pièce revient sur l’établi." };
          }
          if (action.startsWith("assembly:place:") && current.assemblySelected) {
            const slotIndex = Number(action.slice("assembly:place:".length));
            const part = ASSEMBLY_PARTS.find((entry) => entry.id === current.assemblySelected);
            const slot = blueprint.slots[slotIndex];
            if (!part || !slot) return current;
            if (part.type !== slot.type) return { ...current, mistakes: current.mistakes + 1, feedbackText: "Les attaches ne correspondent pas à ce logement.", lastResult: "wrong" };
            const slots = [...current.assemblySlots];
            const rotations = [...current.assemblyRotations];
            slots[slotIndex] = part.id;
            rotations[slotIndex] = current.assemblySelectedRotation;
            return { ...current, assemblySlots: slots, assemblyRotations: rotations, assemblySelected: undefined, assemblySelectedRotation: 0, feedbackText: `${part.name} verrouillé dans le logement « ${slot.label} ».`, lastResult: "correct" };
          }
          if (action !== "assembly:test") return current;
          if (current.assemblySlots.some((part) => !part)) return { ...current, feedbackText: "Quatre logements doivent être équipés avant la mise en pression.", lastResult: "wrong" };
          const mismatches = blueprint.slots.filter((slot, index) => current.assemblySlots[index] !== slot.part || current.assemblyRotations[index] !== slot.rotation).length;
          const assemblyTests = current.assemblyTests + 1;
          if (mismatches > 0) {
            return {
              ...current, assemblyTests,
              phase: assemblyTests >= 3 ? "failure" : current.phase,
              feedbackText: `${mismatches} incompatibilité${mismatches > 1 ? "s" : ""} bloque${mismatches > 1 ? "nt" : ""} la mise en pression. Le plan reste consultable pour corriger le montage.`,
              lastResult: "wrong",
            };
          }
          return { ...current, assemblyTests, assemblyStage: "calibrate", round: 0, score: 0, timingPosition: 0, timingDirection: 1, feedbackText: "Le mécanisme tourne. Trois soupapes doivent maintenant être verrouillées au bon niveau.", lastResult: "correct" };
        }
        if (action !== "assembly:lock") return current;
        const target = blueprint.calibration[current.round];
        const width = 14 + Math.min(8, game.stats[job.stat]);
        const hit = Math.abs(current.timingPosition - target) <= width / 2;
        const score = current.score + (hit ? 1 : 0);
        const mistakes = current.mistakes + (hit ? 0 : 1);
        const round = current.round + 1;
        if (round >= blueprint.calibration.length) return { ...current, round, score, mistakes, phase: hit && score === 3 && current.assemblyTests === 1 && mistakes === 0 ? "perfect" : score >= 2 ? "success" : "failure", feedbackText: hit ? "La dernière soupape se stabilise dans un déclic net." : "La dernière soupape vibre hors de sa plage.", lastResult: hit ? "correct" : "wrong" };
        return { ...current, round, score, mistakes, timingPosition: 0, timingDirection: 1, feedbackText: hit ? "La soupape tient. Le flux passe au circuit suivant." : "Le verrouillage mord trop tôt ; le circuit suivant reçoit la surcharge.", lastResult: hit ? "correct" : "wrong" };
      }

      if (job.id === "forbidden-herbs") {
        if (action.startsWith("harvest:tool:")) {
          const tool = action.slice("harvest:tool:".length) as HarvestSense;
          if (!HARVEST_TOOLS.some((entry) => entry.id === tool)) return current;
          return { ...current, harvestTool: tool, feedbackText: undefined, lastResult: undefined };
        }
        const nodes = harvestNodes(current.variant, current.harvestWave);
        if (action.startsWith("harvest:examine:")) {
          const nodeId = action.slice("harvest:examine:".length);
          if (!nodes.some((node) => node.id === nodeId) || current.harvestPicked.includes(nodeId) || current.harvestRejected.includes(nodeId)) return current;
          return { ...current, harvestExamined: nodeId, feedbackText: undefined, lastResult: undefined };
        }
        if (action === "harvest:focus") {
          if (current.harvestFocus <= 0) return current;
          const hinted = nodes.find((node) => node.real && !current.harvestPicked.includes(node.id));
          return { ...current, harvestFocus: current.harvestFocus - 1, harvestHinted: hinted?.id, harvestExamined: hinted?.id, feedbackText: "Vous retenez votre souffle : une pousse véritable se détache un instant de la brume.", lastResult: undefined };
        }
        if (!action.startsWith("harvest:node:")) return current;
        const nodeId = action.slice("harvest:node:".length);
        if (current.harvestPicked.includes(nodeId) || current.harvestRejected.includes(nodeId)) return current;
        const node = nodes.find((entry) => entry.id === nodeId);
        if (!node) return current;
        const correct = node.real && node.sense === current.harvestTool;
        if (!correct) {
          const mistakes = current.mistakes + 1;
          const harvestTimeLeft = Math.max(0, current.harvestTimeLeft - 3);
          return {
            ...current, mistakes, harvestTimeLeft, harvestExamined: undefined,
            harvestRejected: node.real ? current.harvestRejected : [...current.harvestRejected, node.id],
            phase: mistakes >= 5 || harvestTimeLeft === 0 ? "failure" : current.phase,
            feedbackText: node.real ? "Le signal choisi ne permet pas de vérifier cette espèce. Changez d’outil avant de la couper." : "La pousse se défait en brume et vous coûte trois secondes.",
            lastResult: "wrong",
          };
        }
        const score = current.score + 1;
        const harvestWaveScore = current.harvestWaveScore + 1;
        const harvestPicked = [...current.harvestPicked, node.id];
        if (score >= 7) return { ...current, score, harvestWaveScore, harvestPicked, harvestExamined: undefined, phase: current.mistakes === 0 && current.harvestFocus === 2 && current.harvestTimeLeft >= 15 ? "perfect" : "success", feedbackText: "Le septième spécimen reste solide dans le panier tandis que la brume se retire.", lastResult: "correct" };
        if (harvestWaveScore >= 4) return { ...current, score, harvestWave: current.harvestWave + 1, harvestWaveScore: 0, harvestPicked: [], harvestRejected: [], harvestHinted: undefined, harvestExamined: undefined, feedbackText: "La parcelle s’épuise. Vous avancez vers une poche de brume encore intacte.", lastResult: "correct" };
        return { ...current, score, harvestWaveScore, harvestPicked, harvestExamined: undefined, feedbackText: `${node.name} rejoint le panier sans se dissoudre.`, lastResult: "correct" };
      }

      if (job.id === "algratal-merchant") {
        const customers = marketCustomers(current.variant);
        const customer = customers[current.round];
        if (!customer) return current;
        const moveToNextCustomer = (quality: number, reputation: number, profit: number, feedbackText: string, correct: boolean): JobState => {
          const round = current.round + 1;
          const score = current.score + quality;
          const mistakes = current.mistakes + (correct ? 0 : 1);
          const marketProfit = current.marketProfit + profit;
          const marketReputation = current.marketReputation + reputation;
          if (round >= customers.length) {
            return { ...current, round, score, mistakes, marketProfit, marketReputation, feedbackText, phase: mistakes === 0 && score >= 13 && marketReputation >= 8 ? "perfect" : score >= 7 && marketReputation >= 3 ? "success" : "failure", lastResult: correct ? "correct" : "wrong" };
          }
          return { ...current, round, score, mistakes, marketProfit, marketReputation, feedbackText, marketPrice: customers[round].base, marketTactic: "direct", marketCounter: 0, lastResult: correct ? "correct" : "wrong" };
        };
        if (action.startsWith("market:price:")) {
          const price = Number(action.slice("market:price:".length));
          if (!Number.isFinite(price)) return current;
          return { ...current, marketPrice: Math.max(Math.max(0, customer.cost - 2), Math.min(customer.base + 12, Math.round(price))), feedbackText: undefined, lastResult: undefined };
        }
        if (action.startsWith("market:tactic:")) {
          const tactic = action.slice("market:tactic:".length) as MarketTactic;
          if (!MARKET_TACTICS.some((entry) => entry.id === tactic)) return current;
          return { ...current, marketTactic: tactic, feedbackText: undefined, lastResult: undefined };
        }
        if (action === "market:special" && customer.special) return moveToNextCustomer(2, 2, 0, customer.special.result, true);
        if (action === "market:refuse") {
          return customer.kind === "scam"
            ? moveToNextCustomer(2, 2, 0, "Vous fermez la caisse et appelez un surveillant. Le client disparaît avant son arrivée.", true)
            : moveToNextCustomer(0, -1, 0, "Le client repart les mains vides. L’étal voisin récupère probablement la vente.", false);
        }
        if (action !== "market:offer") return current;
        if (customer.kind === "scam") return moveToNextCustomer(0, -2, -2, "L’affaire était douteuse. Vous perdez du temps, de la marchandise et la confiance de deux témoins.", false);
        const tacticCost = current.marketTactic === "bundle" || current.marketTactic === "guarantee" ? 1 : 0;
        const matchingTactic = current.marketTactic === customer.preference;
        const tacticAllowance = matchingTactic ? 4 : current.marketTactic === "direct" ? 0 : -1;
        const acceptable = current.marketPrice <= customer.budget + tacticAllowance;
        if (!acceptable && current.marketCounter === 0) {
          return { ...current, marketCounter: 1, feedbackText: `Le client refuse, mais reste devant l’étal : « ${customer.budget + Math.max(0, tacticAllowance - 1)} pièces, ou donnez-moi une raison de monter. »`, lastResult: "wrong" };
        }
        if (!acceptable) return moveToNextCustomer(0, -1, 0, "La seconde offre dépasse encore ce que le client accepte. Il quitte l’étal.", false);
        const profit = current.marketPrice - customer.cost - tacticCost;
        const reputation = (matchingTactic ? 2 : 0) + (current.marketPrice <= customer.base + 2 ? 1 : -1) + (profit < 0 ? 1 : 0);
        const quality = profit >= 2 && reputation >= 1 ? 2 : 1;
        return moveToNextCustomer(quality, Math.max(-1, reputation), profit, profit >= 2 ? "Marché conclu : la marge reste saine et le client emporte son achat sans amertume." : "La vente se fait, mais la marge est mince. La bonne impression devra compenser.", true);
      }

      if (job.kind === "memory") {
        const waveLength = memoryWaveLength(current.round, current.sequence.length);
        if (action !== current.sequence[current.step]) {
          const mistakes = current.mistakes + 1;
          return mistakes >= 2
            ? { ...current, mistakes, phase: "failure", lastResult: "wrong" }
            : { ...current, mistakes, step: 0, phase: "memorize", lastResult: "wrong" };
        }
        if (current.step === waveLength - 1) {
          const score = current.score + waveLength;
          const round = current.round + 1;
          if (round >= 3) return { ...current, step: waveLength, round, score, phase: current.mistakes === 0 ? "perfect" : "success", lastResult: "correct" };
          return { ...current, step: 0, round, score, phase: "memorize", lastResult: "correct" };
        }
        return { ...current, step: current.step + 1, lastResult: undefined };
      }

      if (job.kind === "timing") {
        const width = 16 + Math.min(10, game.stats[job.stat]);
        const center = 22 + ((current.variant * 17 + current.round * 29) % 57);
        const hit = Math.abs(current.timingPosition - center) <= width / 2;
        const score = current.score + (hit ? 1 : 0);
        const round = current.round + 1;
        if (round >= 6) return { ...current, round, score, phase: score === 6 ? "perfect" : score >= 4 ? "success" : "failure", lastResult: hit ? "correct" : "wrong" };
        return { ...current, round, score, timingPosition: 0, timingDirection: 1, lastResult: hit ? "correct" : "wrong" };
      }

      if (job.kind === "packing") {
        const crates = jobCratesForSession(job, current.variant);
        const crate = crates[current.round];
        if (!crate) return current;
        const leftWeight = current.leftWeight + (action === "left" ? crate.weight : 0);
        const rightWeight = current.rightWeight + (action === "right" ? crate.weight : 0);
        const respectedRule = !crate.requiredSide || crate.requiredSide === action;
        const mistakes = current.mistakes + (respectedRule ? 0 : 1);
        const round = current.round + 1;
        if (round >= crates.length) {
          const difference = Math.abs(leftWeight - rightWeight);
          return { ...current, round, leftWeight, rightWeight, mistakes, phase: difference === 0 && mistakes === 0 ? "perfect" : difference <= 2 && mistakes <= 1 ? "success" : "failure", lastResult: respectedRule ? "correct" : "wrong" };
        }
        return { ...current, round, leftWeight, rightWeight, mistakes, lastResult: respectedRule ? "correct" : "wrong" };
      }

      if (job.kind === "path") {
        const path = jobPathForSession(job, current.variant);
        if (!path) return current;
        const size = path.size;
        const row = Math.floor(current.pathPosition / size);
        const column = current.pathPosition % size;
        const delta = action === "up" ? -size : action === "down" ? size : action === "left" ? -1 : 1;
        const crossesEdge = (action === "left" && column === 0) || (action === "right" && column === size - 1) || (action === "up" && row === 0) || (action === "down" && row === size - 1);
        const candidate = current.pathPosition + delta;
        const invalid = crossesEdge || candidate < 0 || candidate >= size * size || path.blocked.includes(candidate);
        const mistakes = current.mistakes + (invalid ? 1 : 0);
        const pathSteps = current.pathSteps + 1;
        const pathPosition = invalid ? current.pathPosition : candidate;
        const visited = invalid || current.visited.includes(pathPosition) ? current.visited : [...current.visited, pathPosition];
        if (mistakes >= (game.stats[job.stat] >= 6 ? 3 : 2) || pathSteps > path.maxSteps + 2) return { ...current, mistakes, pathSteps, pathPosition, visited, phase: "failure", lastResult: "wrong" };
        if (pathPosition === path.goal) return { ...current, mistakes, pathSteps, pathPosition, visited, phase: pathSteps <= path.maxSteps - 1 && mistakes === 0 ? "perfect" : "success", lastResult: "correct" };
        return { ...current, mistakes, pathSteps, pathPosition, visited, lastResult: invalid ? "wrong" : "correct" };
      }

      const rounds = orderedJobRounds(job, current.roundOrder);
      const challenge = rounds[current.round];
      if (!challenge) return current;
      if (job.kind === "bargain") {
        const value = challenge.options.find((option) => option.id === action)?.score || 0;
        const score = current.score + value;
        const round = current.round + 1;
        const strong = value >= 2;
        if (round >= rounds.length) return { ...current, round, score, phase: score >= rounds.length * 2 ? "perfect" : score >= rounds.length ? "success" : "failure", lastResult: strong ? "correct" : "wrong" };
        return { ...current, round, score, lastResult: strong ? "correct" : "wrong" };
      }

      const correct = action === challenge.correct;
      const score = current.score + (correct ? 1 : 0);
      const mistakes = current.mistakes + (correct ? 0 : 1);
      const round = current.round + 1;
      if (round >= rounds.length) return { ...current, round, score, mistakes, phase: mistakes === 0 ? "perfect" : mistakes <= 2 ? "success" : "failure", lastResult: correct ? "correct" : "wrong" };
      return { ...current, round, score, mistakes, lastResult: correct ? "correct" : "wrong" };
    });
  }

  function closeJob() {
    if (!jobState || !["perfect", "success", "failure"].includes(jobState.phase)) return;
    const job = JOBS.find((entry) => entry.id === jobState.jobId);
    if (!job) return;
    const succeeded = jobState.phase === "success" || jobState.phase === "perfect";
    const pay = jobState.phase === "perfect" ? Math.ceil(job.reward * 1.5) : succeeded ? job.reward : Math.max(2, Math.floor(job.reward / 4));
    updateGame((current) => ({
      ...current,
      coins: current.coins + pay,
      stats: succeeded ? { ...current.stats, [job.stat]: current.stats[job.stat] + 1 } : current.stats,
      confluence: clamp(current.confluence + (jobState.phase === "perfect" ? 2 : succeeded ? 1 : 0)),
      journal: [...current.journal, `Job · ${job.title} · ${jobState.phase === "perfect" ? "travail parfait" : succeeded ? "mission accomplie" : "travail partiel"} · ${pay} pièces`],
    }));
    setJobState(null);
    setModal(null);
    advancePeriod();
  }

  function buyGift(giftId: string) {
    if (!game) return;
    const gift = GIFTS.find((entry) => entry.id === giftId);
    if (!gift || game.coins < gift.price) return;
    updateGame((current) => ({ ...current, coins: current.coins - gift.price, inventory: { ...current.inventory, [giftId]: (current.inventory[giftId] || 0) + 1 } }));
  }

  function giveGift(characterId: string, giftId: string) {
    if (!game || !(game.inventory[giftId] > 0)) return;
    const character = CHARACTERS.find((entry) => entry.id === characterId);
    const gift = GIFTS.find((entry) => entry.id === giftId);
    if (!character || !gift) return;
    const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
    if (place.location !== game.location || place.spot !== game.spot) {
      setModal({ kind: "notice", title: "Impossible de remettre le présent", text: `${character.name} n’est plus dans ce sous-lieu. Retrouvez cette personne exactement au même endroit et à la même période.` });
      return;
    }
    const liked = character.giftLikes.includes(giftId);
    updateGame((current) => {
      const relation = { ...current.relationships[characterId] };
      relation.met = true;
      relation.gifts += 1;
      relation.affection = clamp(relation.affection + (liked ? 6 : 2));
      relation.trust = clamp(relation.trust + (liked ? 3 : 1));
      const remaining = Math.max(0, (current.inventory[giftId] || 0) - 1);
      const displayed = remaining > 0
        ? current.housing.displayed
        : current.housing.displayed.map((item) => item === giftId ? null : item);
      return {
        ...current,
        relationships: { ...current.relationships, [characterId]: relation },
        inventory: { ...current.inventory, [giftId]: remaining },
        housing: { ...current.housing, displayed },
        journal: [...current.journal, `Présent offert à ${character.name} : ${gift.name}.`],
      };
    });
    setModal({ kind: "notice", title: liked ? "Un présent qui touche juste" : "Une attention remarquée", text: liked ? `${character.name} reconnaît immédiatement l’attention derrière ce choix.` : `${character.name} accepte le présent avec curiosité. L’intention compte, même si l’objet ne lui correspond pas tout à fait.`, consumeTime: true });
  }

  function buyProperty(propertyId: string) {
    if (!game) return;
    const property = propertyById(propertyId);
    const city = property && LOCATIONS.find((entry) => entry.id === property.location);
    if (!property || !city || (game.day < city.unlockDay && !game.settings.unlockAll)) return;
    const price = discountedPropertyPrice(property, game.relationships);
    const credit = housingSaleValue(game.housing);
    const balance = price - credit;
    if (balance > game.coins) {
      setModal({ kind: "notice", title: "Fonds insuffisants", text: `L’échange demande encore ${balance - game.coins} pièces après la reprise de votre logement actuel.` });
      return;
    }
    const former = propertyById(game.housing.propertyId);
    updateGame((current) => {
      const movingHome = current.spot === former?.spot;
      return {
        ...current,
        coins: current.coins - balance,
        housing: {
          ...current.housing,
          propertyId: property.id,
          purchasePrice: price,
          displayed: former ? current.housing.displayed : [null, null, null],
          residents: former ? current.housing.residents : [],
        },
        journal: [...current.journal, `${former ? "Échange" : "Achat"} immobilier · ${property.name} à ${city.name} · ${price} pièces${credit ? `, reprise ${credit}` : ""}.`],
        location: movingHome ? property.location : current.location,
        spot: movingHome ? property.spot : current.spot,
        ...(movingHome ? placeDiscovery(current, property.location, property.spot) : {}),
        codex: unique([...current.codex, property.name, ...(movingHome ? [city.name, property.name] : [])]),
      };
    });
    if (game.spot === former?.spot) {
      setSelectedLocation(property.location);
      setSelectedSpot(property.spot);
    }
  }

  function sellProperty() {
    if (!game) return;
    const property = propertyById(game.housing.propertyId);
    if (!property) return;
    const value = housingSaleValue(game.housing);
    updateGame((current) => {
      const leavingHome = current.spot === property.spot;
      const nextSpot = leavingHome ? DEFAULT_SPOTS[property.location] : current.spot;
      return {
        ...current,
        coins: current.coins + value,
        location: leavingHome ? property.location : current.location,
        spot: nextSpot,
        ...(leavingHome ? placeDiscovery(current, property.location, nextSpot) : {}),
        housing: {
          ...current.housing,
          propertyId: undefined,
          purchasePrice: 0,
          displayed: [null, null, null],
          residents: [],
        },
        journal: [...current.journal, `Vente immobilière · ${property.name} · ${value} pièces récupérées.`],
      };
    });
    if (game.spot === property.spot) {
      setSelectedLocation(property.location);
      setSelectedSpot(DEFAULT_SPOTS[property.location]);
    }
  }

  function setDisplayedItem(slot: number, itemId: string) {
    if (!game?.housing.propertyId || slot < 0 || slot > 2) return;
    const nextId = itemId || null;
    if (nextId && !(game.inventory[nextId] > 0)) return;
    updateGame((current) => {
      const displayed = [...current.housing.displayed];
      displayed[slot] = nextId;
      return { ...current, housing: { ...current.housing, displayed } };
    });
  }

  function toggleResident(characterId: string) {
    if (!game?.housing.propertyId) return;
    const character = CHARACTERS.find((entry) => entry.id === characterId);
    const relation = game.relationships[characterId];
    if (!character || (!game.settings.unlockAll && (relation.stage < 3 || relation.trust < 24))) return;
    const already = game.housing.residents.includes(characterId);
    updateGame((current) => ({
      ...current,
      housing: { ...current.housing, residents: already ? current.housing.residents.filter((id) => id !== characterId) : unique([...current.housing.residents, characterId]) },
      journal: [...current.journal, already ? `${character.name} conserve désormais son propre logement.` : `${character.name} accepte de vivre aussi dans votre logis.`],
    }));
  }

  function startHomeDate(characterId: string) {
    if (!game?.housing.propertyId || !HOME_DATE_PROFILES[characterId]) return;
    const relation = game.relationships[characterId];
    if (!game.settings.unlockAll && (relation.stage < 3 || relation.affection < 22 || relation.trust < 22)) return;
    setModal({ kind: "home-date", character: characterId });
  }

  function startHomePairDate(pairId: string) {
    if (!game?.housing.propertyId) return;
    const pair = HOME_PAIR_DATES.find((entry) => entry.id === pairId);
    if (!pair) return;
    if (homePairDateUnlocked(game, pair)) setModal({ kind: "home-pair-date", pairId });
  }

  function finishHomeDate(characterId: string, tone: HomeDateTone, score: number) {
    if (!game) return;
    if (game.flags.includes(`${characterId}-platonic`) && tone !== "amical") return;
    const profile = HOME_DATE_PROFILES[characterId];
    const property = propertyById(game.housing.propertyId);
    if (!profile || !property) return;
    const character = CHARACTERS.find((entry) => entry.id === characterId)!;
    const relation = game.relationships[characterId];
    const effects = profile.tones[tone].effects;
    const newGift = !game.housing.homeDateGifts.includes(characterId);
    updateGame((current) => {
      const relation = { ...current.relationships[characterId] };
      relation.affection = clamp(relation.affection + (effects.affection || 0) + (score >= 5 ? 3 : score >= 3 ? 1 : 0));
      relation.trust = clamp(relation.trust + (effects.trust || 0) + (score >= 4 ? 2 : 0));
      relation.desire = clamp(relation.desire + (effects.desire || 0));
      relation.met = true;
      const inventory = { ...current.inventory };
      if (newGift) inventory[profile.gift] = (inventory[profile.gift] || 0) + 1;
      return {
        ...current,
        day: current.day + 1,
        period: 3,
        location: property.location,
        spot: property.spot,
        ...placeDiscovery(current, property.location, property.spot),
        relationships: { ...current.relationships, [characterId]: relation },
        inventory,
        housing: {
          ...current.housing,
          homeDateHistory: [...current.housing.homeDateHistory, `${characterId}:${tone}@${current.day + 1}`].slice(-96),
          homeDateGifts: newGift ? unique([...current.housing.homeDateGifts, characterId]) : current.housing.homeDateGifts,
        },
        journal: [...current.journal, `Rendez-vous au logis · ${profile.title} avec ${character.name}${newGift ? ` · cadeau reçu : ${displayItemById(profile.gift)?.name}` : ""}.`],
      };
    });
    setSelectedLocation(property.location);
    setSelectedSpot(property.spot);
    const relationAfter = {
      affection: relation.affection + (effects.affection || 0) + (score >= 5 ? 3 : score >= 3 ? 1 : 0),
      trust: relation.trust + (effects.trust || 0) + (score >= 4 ? 2 : 0),
      desire: relation.desire + (effects.desire || 0),
    };
    const intimateCity = HOME_INTIMACY_CITY[characterId];
    const canBecomeIntimate = tone === "desir" && characterId !== "draven" && !game.flags.includes(`${characterId}-platonic`) && (game.settings.unlockAll || (
      relation.stage >= 4 && relationAfter.affection >= 34 && relationAfter.trust >= 32 && relationAfter.desire >= 24 && score >= 3 && (!intimateCity || intimateCity === property.location)
    ));
    setModal(canBecomeIntimate
      ? { kind: "home-date-result", character: characterId, score }
      : { kind: "notice", title: score >= 5 ? "Une soirée qui habitera les murs" : "Une soirée chez vous", text: `${character.name} repart en laissant derrière ${newGift ? displayItemById(profile.gift)?.name?.toLowerCase() : "un nouveau souvenir"}. Le rendez-vous est désormais inscrit dans l’histoire de ce logis.` });
  }

  function finishHomePairDate(pairId: string, tone: HomeDateTone, score: number) {
    if (!game) return;
    const pair = HOME_PAIR_DATES.find((entry) => entry.id === pairId);
    const property = propertyById(game.housing.propertyId);
    if (!pair || !property || !homePairDateUnlocked(game, pair)) return;
    updateGame((current) => {
      const relationships = { ...current.relationships };
      pair.characters.forEach((id) => {
        const relation = { ...relationships[id] };
        relation.affection = clamp(relation.affection + (tone === "amical" ? 5 : 7) + (score >= 5 ? 2 : 0));
        relation.trust = clamp(relation.trust + 6 + (score >= 4 ? 2 : 0));
        relation.desire = clamp(relation.desire + (tone === "desir" ? 7 : tone === "amoureux" ? 3 : 0));
        relationships[id] = relation;
      });
      return {
        ...current,
        day: current.day + 1,
        period: 3,
        location: property.location,
        spot: property.spot,
        ...placeDiscovery(current, property.location, property.spot),
        relationships,
        housing: { ...current.housing, homeDateHistory: [...current.housing.homeDateHistory, `pair:${pair.id}:${tone}@${current.day + 1}`].slice(-96) },
        journal: [...current.journal, `Rendez-vous partagé au logis · ${pair.title} · ${pair.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name).join(" et ")}.`],
      };
    });
    setSelectedLocation(property.location);
    setSelectedSpot(property.spot);
    setModal({ kind: "notice", title: score >= 5 ? "Trois présences, un nouveau souvenir" : "Une visite partagée", text: `La dynamique entre ${pair.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name).join(" et ")} a laissé une trace nouvelle dans votre logis. Ce rencard restera distinct de vos moments à deux.` });
  }

  function startHomeIntimacy(characterId: string) {
    const property = game && propertyById(game.housing.propertyId);
    const hasCompletedDesiredDate = game?.housing.homeDateHistory.some((entry) => entry.startsWith(`${characterId}:desir@`));
    if (!game || !property || characterId === "draven" || game.flags.includes(`${characterId}-platonic`) || !hasCompletedDesiredDate) return;
    setModal({ kind: "intimacy", character: characterId, background: property.background, home: true });
  }

  function startDate(dateId: string) {
    if (!game) return;
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!date || !publicDateUnlocked(game, date)) return;
    const periodIndex = Math.max(0, PERIODS.findIndex((period) => period.id === date.period));
    const nextGame: GameState = {
      ...game,
      day: game.day + 1,
      period: periodIndex,
      location: date.location,
      spot: date.spot,
      ...placeDiscovery(game, date.location, date.spot),
    };
    const character = CHARACTERS.find((entry) => entry.id === date.character)!;
    const scene: SceneView = {
      id: date.id,
      title: date.title,
      background: spotById(date.spot)?.background || backgroundUrl("streets"),
      mood: date.mood || character.defaultMood,
      character: date.character,
      cast: [date.character],
      intro: date.intro,
      choices: date.choices,
      kind: "date",
      date,
    };
    setGame(nextGame);
    setSelectedLocation(date.location);
    setSelectedSpot(date.spot);
    setModal(null);
    setDialogue({ scene, lines: expandedLines(scene, nextGame, date.intro, "intro"), lineIndex: 0, phase: "intro" });
  }

  function startGroupDate(groupDateId: string) {
    if (!game) return;
    const date = GROUP_DATES.find((entry) => entry.id === groupDateId);
    if (!date || !groupDateUnlocked(game, date)) return;
    const periodIndex = Math.max(0, PERIODS.findIndex((period) => period.id === date.period));
    const nextGame: GameState = {
      ...game,
      day: game.day + 1,
      period: periodIndex,
      location: date.location,
      spot: date.spot,
      ...placeDiscovery(game, date.location, date.spot),
    };
    const first = CHARACTERS.find((entry) => entry.id === date.characters[0])!;
    const scene: SceneView = {
      id: date.id,
      title: date.title,
      background: spotById(date.spot)?.background || backgroundUrl("streets"),
      mood: date.mood || first.defaultMood,
      character: first.id,
      cast: date.characters,
      intro: date.intro,
      choices: date.choices,
      kind: "group-date",
      groupDate: date,
    };
    setGame(nextGame);
    setSelectedLocation(date.location);
    setSelectedSpot(date.spot);
    setModal(null);
    setDialogue({ scene, lines: expandedLines(scene, nextGame, date.intro, "intro", date.spot), lineIndex: 0, phase: "intro" });
  }

  function startDateIntimacy(dateId: string) {
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!game || !date || game.flags.includes(`${date.character}-platonic`) || !game.dateHistory.includes(date.id) || !publicDateUnlocked(game, date)) return;
    setModal({ kind: "intimacy", character: date.character, dateId: date.id, background: spotById(date.spot)?.background });
  }

  function startGroupDateIntimacy(groupDateId: string) {
    const date = GROUP_DATES.find((entry) => entry.id === groupDateId);
    if (!game || !date || !game.groupDateHistory.includes(date.id) || !groupDateUnlocked(game, date)) return;
    setModal({ kind: "group-intimacy", groupDateId: date.id, background: spotById(date.spot)?.background });
  }

  function closeIntimacy(completed: boolean, memory?: string) {
    if (!modal || modal.kind !== "intimacy") return;
    if (completed && !modal.replay) {
      const memoryKey = `intimacy:${modal.home ? `home:${modal.character}` : modal.dateId || modal.character}`;
      updateGame((current) => ({
        ...current,
        flags: unique([...current.flags, ...(modal.dateId ? [`date-intimate:${modal.dateId}`] : []), ...(modal.home ? [`home-intimate:${modal.character}`] : [])]),
        sceneMemories: memory ? { ...current.sceneMemories, [memoryKey]: memory } : current.sceneMemories,
      }));
    }
    const noTime = Boolean(modal.replay || modal.dateId);
    setModal(null);
    if (!noTime) advancePeriod();
  }

  function closeGroupIntimacy(completed: boolean, memory?: string) {
    if (!modal || modal.kind !== "group-intimacy") return;
    if (completed && !modal.replay) {
      const memoryKey = `group-intimacy:${modal.groupDateId}`;
      updateGame((current) => ({
        ...current,
        flags: unique([...current.flags, `group-date-intimate:${modal.groupDateId}`]),
        sceneMemories: memory ? { ...current.sceneMemories, [memoryKey]: memory } : current.sceneMemories,
      }));
    }
    setModal(null);
  }

  function replayDateIntimacy(dateId: string) {
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!date || !game?.flags.includes(`date-intimate:${date.id}`)) return;
    setModal({ kind: "intimacy", character: date.character, dateId: date.id, background: spotById(date.spot)?.background, replay: true });
  }

  function replayGroupDateIntimacy(groupDateId: string) {
    const date = GROUP_DATES.find((entry) => entry.id === groupDateId);
    if (!date || !game?.flags.includes(`group-date-intimate:${date.id}`)) return;
    setModal({ kind: "group-intimacy", groupDateId: date.id, background: spotById(date.spot)?.background, replay: true });
  }

  function waitForCharacter(characterId: string, spotId = game?.spot || "") {
    if (!game) return;
    const character = CHARACTERS.find((entry) => entry.id === characterId);
    if (!character) return;
    const target = nextPresence(character, game, spotId);
    if (!target) {
      setModal({ kind: "notice", title: "Aucun passage prévu", text: `${character.name} ne passera pas par ce sous-lieu pendant son prochain cycle de voyage.` });
      return;
    }
    updateGame((current) => ({
      ...current,
      day: target.day,
      period: target.period,
      journal: [...current.journal, `Attente · ${character.name} rejoint ${spotById(spotId)?.name} après ${waitDurationLabel(current, target)}.`],
    }));
  }

  function waitForRoute(sceneId: string) {
    if (!game) return;
    const route = ROUTE_SCENES.find((entry) => entry.id === sceneId);
    const character = CHARACTERS.find((entry) => entry.id === route?.character);
    if (!route || !character) return;
    const confidenceObjective = routeNarrativeObjective(route, game);
    if (confidenceObjective) {
      setModal({ kind: "notice", title: "Un chapitre manque encore", text: confidenceObjective });
      return;
    }
    const spotId = ROUTE_SPOTS[route.id];
    const target = nextPresence(character, game, spotId, ROUTE_PERIODS[route.id], route.dayMin);
    if (!target) {
      setModal({ kind: "notice", title: "Rencontre introuvable", text: "Aucun créneau cohérent n’apparaît dans le prochain cycle de voyage." });
      return;
    }
    updateGame((current) => ({
      ...current,
      day: target.day,
      period: target.period,
      location: route.location,
      spot: spotId,
      ...placeDiscovery(current, route.location, spotId),
      journal: [...current.journal, `Attente scénarisée · ${character.name} arrive à ${spotById(spotId)?.name}.`],
    }));
    setSelectedLocation(route.location);
    setSelectedSpot(spotId);
    setMapDestinationOpen(false);
    setTab("map");
  }

  function startCampaignScene(sceneId: string) {
    if (!game) return;
    const campaign = campaignSceneById(sceneId);
    if (!campaign || !campaignSceneReady(campaign, game)) {
      setModal({ kind: "notice", title: "Jalon encore inaccessible", text: campaign ? campaignBlockingObjective(campaign, game) || "Cette scène a déjà été accomplie." : "Ce jalon n’existe pas." });
      return;
    }
    const scene: SceneView = {
      id: campaign.id,
      title: campaign.title,
      background: campaign.background,
      mood: campaign.mood,
      character: campaign.lead,
      cast: campaign.cast,
      intro: campaign.intro,
      choices: campaign.choices,
      kind: "story",
      campaignSceneId: campaign.id,
    };
    const sceneGame = { ...game, location: campaign.location, spot: campaign.spot };
    updateGame((current) => ({
      ...current,
      location: campaign.location,
      spot: campaign.spot,
      ...placeDiscovery(current, campaign.location, campaign.spot),
      journal: [...current.journal, `Campagne · En route vers ${spotById(campaign.spot)?.name || campaign.title}`],
    }));
    setSelectedLocation(campaign.location);
    setSelectedSpot(campaign.spot);
    setMapDestinationOpen(false);
    setDialogue({ scene, lines: expandedLines(scene, sceneGame, campaign.intro, "intro", campaign.spot), lineIndex: 0, phase: "intro" });
  }

  function replayCampaignScene(sceneId: string) {
    if (!game || !game.history.includes(sceneId)) return;
    const campaign = campaignSceneById(sceneId);
    if (!campaign) return;
    const scene: SceneView = {
      id: campaign.id,
      title: campaign.title,
      background: campaign.background,
      mood: campaign.mood,
      character: campaign.lead,
      cast: campaign.cast,
      intro: campaign.intro,
      choices: campaign.choices,
      kind: "story",
      campaignSceneId: campaign.id,
    };
    setDialogue({ scene, lines: expandedLines(scene, game, campaign.intro, "intro", campaign.spot), lineIndex: 0, phase: "intro", replay: true });
  }

  function replayRoute(sceneId: string) {
    const route = ROUTE_SCENES.find((scene) => scene.id === sceneId);
    if (!route || !game) return;
    const playable = relationRouteVariant(route, game);
    const scene: SceneView = { ...playable.route, id: playable.sceneId, background: routeBackground(playable.route), cast: [playable.route.character], kind: "route", route: playable.route };
    setDialogue({
      scene,
      lines: expandedLines(scene, game, playable.route.intro, "intro", ROUTE_SPOTS[route.id]),
      lineIndex: 0,
      phase: "intro",
      replay: true,
    });
  }

  function replaySocial(sceneId: string) {
    const social = SOCIAL_SCENES.find((scene) => scene.id === sceneId);
    if (!social) return;
    const character = CHARACTERS.find((entry) => entry.id === social.characters[0]);
    const memorySpot = spotById(game?.sceneMemories[social.id] || "")
      || spotById(social.sublocations?.[0] || "")
      || spotById(DEFAULT_SPOTS[social.locations?.[0] || game?.location || "algratal"]);
    const scene: SceneView = {
        id: social.id,
        title: social.title,
        background: memorySpot?.background || backgroundUrl("streets"),
        mood: social.mood || character?.defaultMood || "calm",
        character: character?.id,
        cast: social.characters,
        intro: social.prompt,
        choices: social.choices,
        kind: "social",
        socialId: social.id,
      };
    setDialogue({
      scene,
      lines: expandedLines(scene, game!, social.prompt, "intro", memorySpot?.id),
      lineIndex: 0,
      phase: "intro",
      replay: true,
    });
  }

  function replaySecret(secretId: string) {
    if (!game) return;
    const secret = SECRET_CONVERSATIONS.find((entry) => entry.id === secretId);
    const character = CHARACTERS.find((entry) => entry.id === secret?.character);
    if (!secret || !character || !game.secretHistory.includes(secret.id)) return;
    const scene: SceneView = {
      id: secret.id,
      title: secret.title,
      background: spotById(game.sceneMemories[secret.id] || game.spot)?.background || backgroundUrl("streets"),
      mood: character.defaultMood,
      character: character.id,
      cast: [character.id],
      intro: secret.intro,
      choices: secret.choices,
      kind: "secret",
      secretId: secret.id,
    };
    setDialogue({ scene, lines: expandedLines(scene, game, secret.intro, "intro"), lineIndex: 0, phase: "intro", replay: true });
  }

  function replayWorldEvent(eventId: string) {
    if (!game) return;
    const event = SPONTANEOUS_EVENTS.find((entry) => entry.id === eventId);
    const lead = CHARACTERS.find((entry) => entry.id === event?.characters[0]);
    if (!event || !lead || !game.worldEventHistory.includes(event.id)) return;
    const scene: SceneView = {
      id: event.id,
      title: event.title,
      background: spotById(game.sceneMemories[event.id] || event.spots?.[0] || game.spot)?.background || backgroundUrl("streets"),
      mood: event.mood || lead.defaultMood,
      character: lead.id,
      cast: event.characters,
      intro: event.intro,
      choices: event.choices,
      kind: "world",
      worldEventId: event.id,
    };
    setDialogue({ scene, lines: expandedLines(scene, game, event.intro, "intro"), lineIndex: 0, phase: "intro", replay: true });
  }

  function replayDate(dateId: string) {
    if (!game) return;
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!date) return;
    const character = CHARACTERS.find((entry) => entry.id === date.character)!;
    const scene: SceneView = { id: date.id, title: date.title, background: spotById(date.spot)?.background || backgroundUrl("streets"), mood: date.mood || character.defaultMood, character: date.character, cast: [date.character], intro: date.intro, choices: date.choices, kind: "date", date };
    setDialogue({ scene, lines: expandedLines(scene, game, date.intro, "intro", date.spot), lineIndex: 0, phase: "intro", replay: true });
  }

  function replayGroupDate(groupDateId: string) {
    if (!game) return;
    const date = GROUP_DATES.find((entry) => entry.id === groupDateId);
    if (!date) return;
    const first = CHARACTERS.find((entry) => entry.id === date.characters[0])!;
    const scene: SceneView = { id: date.id, title: date.title, background: spotById(date.spot)?.background || backgroundUrl("streets"), mood: date.mood || first.defaultMood, character: first.id, cast: date.characters, intro: date.intro, choices: date.choices, kind: "group-date", groupDate: date };
    setDialogue({ scene, lines: expandedLines(scene, game, date.intro, "intro", date.spot), lineIndex: 0, phase: "intro", replay: true });
  }

  function saveSlot(slot: number) {
    if (!game) return;
    const payload = { ...game, savedAt: new Date().toLocaleString("fr-FR") };
    window.localStorage.setItem(`sylvinia-liens-slot-${slot}`, JSON.stringify(payload));
    refreshSlots();
  }

  function loadSlot(slot: number) {
    const raw = window.localStorage.getItem(`sylvinia-liens-slot-${slot}`);
    if (!raw) return;
    try {
      const loaded = hydrateGame(JSON.parse(raw));
      if (!loaded) return;
      previousGameRef.current = loaded;
      setGame(loaded);
      setPlayer(loaded.player);
      setSelectedLocation(loaded.location);
      setSelectedSpot(loaded.spot);
      setMapDestinationOpen(false);
      setTab("map");
    } catch { /* sauvegarde invalide ignorée */ }
  }

  function exportSave() {
    if (!game) return;
    const blob = new Blob([JSON.stringify(game, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sylvinia-${game.player.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}-jour-${game.day}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importSave(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const loaded = hydrateGame(JSON.parse(String(reader.result)));
        if (!loaded) throw new Error("invalid");
        previousGameRef.current = loaded;
        setGame(loaded);
        setPlayer(loaded.player);
        setSelectedLocation(loaded.location);
        setSelectedSpot(loaded.spot);
        setModal({ kind: "notice", title: "Chronique importée", text: "La sauvegarde a été restaurée et enregistrée automatiquement sur cet appareil." });
      } catch {
        setModal({ kind: "notice", title: "Import impossible", text: "Ce fichier ne contient pas une chronique compatible." });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function playRitualRune(rune: string) {
    if (!game || ritualPhase !== "play") return;
    if (rune !== ritualSequence[ritualStep]) {
      setRitualPhase("failure");
      updateGame((current) => ({ ...current, confluence: clamp(current.confluence + 2) }));
      return;
    }
    if (ritualStep === ritualSequence.length - 1) {
      setRitualPhase("success");
      updateGame((current) => ({ ...current, confluence: clamp(current.confluence + 8), stats: { ...current.stats, resonance: current.stats.resonance + 1 } }));
      return;
    }
    setRitualStep(ritualStep + 1);
  }

  const playerInitial = player.name.trim().charAt(0).toUpperCase() || "?";

  if (screen === "title") {
    return (
      <TitleScreen
        hasSave={hasSave}
        onNew={() => setScreen("creator")}
        onContinue={continueGame}
        onChronicle={() => setModal({ kind: "chronicle" })}
        modal={modal}
        closeModal={() => setModal(null)}
      />
    );
  }

  if (screen === "creator") {
    return <CreatorScreen player={player} setPlayer={setPlayer} onBack={() => setScreen("title")} onBegin={begin} />;
  }

  if (!game) return null;

  const period = PERIODS[game.period];
  const currentLocation = LOCATIONS.find((location) => location.id === game.location) || LOCATIONS[0];
  const currentSpot = spotById(game.spot) || spotById(DEFAULT_SPOTS[currentLocation.id])!;
  const viewedLocation = LOCATIONS.find((location) => location.id === selectedLocation) || currentLocation;
  const selectedSpotData = spotById(selectedSpot);
  const viewedSpot = selectedSpotData?.location === viewedLocation.id ? selectedSpotData : spotById(DEFAULT_SPOTS[viewedLocation.id])!;
  const viewedSpots = spotsForLocation(viewedLocation.id).filter((spot) => !spot.housing || spot.id === propertyById(game.housing.propertyId)?.spot);
  const viewedTravelPeriods = travelPeriodCost(game.location, viewedLocation.id, game.player.vocation, LOCATIONS);
  const presentCharacters = CHARACTERS.filter((character) => {
    const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
    return characterUnlocked(game, character) && place.location === game.location && place.spot === game.spot;
  });
  const visibleCharacters = CHARACTERS.filter((character) => characterUnlocked(game, character));
  const upcomingVisitors = visibleCharacters
    .map((character) => ({ character, target: nextPresence(character, game, game.spot) }))
    .filter((entry): entry is { character: CharacterData; target: NonNullable<ReturnType<typeof nextPresence>> } => Boolean(entry.target))
    .sort((left, right) => left.target.offset - right.target.offset)
    .slice(0, 4);
  const spontaneousEvent = availableSpontaneousEvent(game);
  const localRumor = availableRumor(game);
  const soundtrack = musicForContext(game.spot, { locationId: game.location, intimacy: modal?.kind === "intimacy" || modal?.kind === "group-intimacy", prologue: dialogue?.scene.kind === "intro" });
  const soundtrackLabel = MUSIC_LABELS[soundtrack] || "Musique de Sylvinia";

  return (
    <main className={`game-shell ${game.settings.reducedMotion ? "reduce-motion" : ""} ${dialogue || modal?.kind === "intimacy" || modal?.kind === "group-intimacy" || modal?.kind === "home-date" || modal?.kind === "home-pair-date" ? "scene-active" : ""}`} style={{ fontSize: `${game.settings.fontScale}%` }}>
      {game.settings.music && <audio ref={audioRef} key={soundtrack} src={`/assets/audio/${soundtrack}.mp3`} onLoadedMetadata={(event) => { event.currentTarget.volume = audioVolume / 100; }} autoPlay loop />}
      <NotificationLayer notifications={notifications} />
      <header className="game-topbar">
        <button className="brand-small" onClick={() => setTab("place")}><span>✦</span><div><strong>Les Liens du Crépuscule</strong><small>Chronique Alternative</small></div></button>
        <div className="time-block"><small>Jour {game.day} · Monde ouvert · {currentSpot.shortName}</small><strong>{period.icon} {period.label} · {period.time}</strong></div>
        <div className="resource"><small>Stabilité de la Confluence</small><div><i style={{ width: `${game.confluence}%` }} /></div><b>{game.confluence} / 100</b></div>
        <button className="music-button" title={soundtrackLabel} aria-label={game.settings.music ? `Couper la musique · ${soundtrackLabel}` : `Activer la musique · ${soundtrackLabel}`} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, music: !current.settings.music } }))}>{game.settings.music ? "♫" : "♩"}</button>
        {game.settings.developer && <button className="dev-badge" onClick={() => setTab("options")}>DEV</button>}
        <button className="profile-chip" onClick={() => setTab("options")}><span style={{ background: game.player.skin, color: game.player.eyes }}>{playerInitial}</span><div><strong>{game.player.name}</strong><small>{game.player.vocation}</small></div></button>
      </header>

      {tab === "place" && (
        <section className="place-stage" style={{ backgroundImage: `url(${currentSpot.background})` }}>
          <div className="place-atmosphere" aria-hidden="true" />
          <header className="place-identity">
            <p className="eyebrow">{currentLocation.subtitle}</p>
            <h1>{currentLocation.name}</h1>
            <div className="place-subtitle"><span>{currentSpot.icon}</span><strong>{currentSpot.name}</strong></div>
            <p>{currentSpot.description}</p>
            <div className="place-context-chips">
              <span>{period.icon} {period.label} · {period.time}</span>
              <span>Jour {game.day}</span>
              <span>{presentCharacters.length} présence{presentCharacters.length > 1 ? "s" : ""}</span>
            </div>
          </header>
          <div className="place-quick-actions">
            <button onClick={() => { setSelectedLocation(game.location); setSelectedSpot(game.spot); setMapDestinationOpen(false); setTab("map"); }}>⌖ Ouvrir la carte</button>
            <span title={soundtrackLabel}>♫ {soundtrackLabel}</span>
          </div>

          <div className="place-bottom-deck">
            {(spontaneousEvent || localRumor) && <section className="living-world-panel">
              {spontaneousEvent && <button className="living-world-event" onClick={() => openSpontaneousEvent(spontaneousEvent)}><span>◈</span><div><small>Une scène est déjà en cours</small><strong>{spontaneousEvent.title}</strong><p>{spontaneousEvent.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name).filter(Boolean).join(" · ")}</p></div><b>Intervenir ›</b></button>}
              {localRumor && <button className="living-world-rumor" onClick={() => hearRumor(localRumor)}><span>◌</span><div><small>Échos de {currentSpot.shortName}</small><strong>Écouter une rumeur</strong><p>Sa vérité ne sera pas indiquée.</p></div><b>Écouter ›</b></button>}
            </section>}
            <section className="place-panel place-presences">
              <header><div><p className="eyebrow">Rencontres</p><h2>Présences maintenant</h2></div><span>{presentCharacters.length}</span></header>
              <div className="immersive-presence-list">
                {presentCharacters.length ? presentCharacters.map((character) => {
                  const relation = game.relationships[character.id];
                  const rawNextScene = sceneFor(character.id, relation.stage);
                  const nextScene = rawNextScene ? relationRouteVariant(rawNextScene, game).route : undefined;
                  const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
                  const special = nextScene && nextScene.location === game.location && ROUTE_SPOTS[nextScene.id] === game.spot && (!ROUTE_PERIODS[nextScene.id] || ROUTE_PERIODS[nextScene.id].includes(period.id)) && game.day >= nextScene.dayMin && relation.affection + relation.trust >= BOND_THRESHOLDS[nextScene.stage] && routeNarrativeReady(nextScene, game);
                  const canDate = !game.flags.includes(`${character.id}-platonic`) && DATE_SCENES.some((date) => date.character === character.id && (game.settings.unlockAll || (relation.stage >= date.unlockStage && relation.affection >= date.minAffection && relation.trust >= date.minTrust)));
                  return <article className="immersive-presence" key={character.id} style={{ "--character": character.color } as React.CSSProperties}>
                    <button className="immersive-presence-main" onClick={() => openCharacterScene(character.id)}><img src={character.portrait} alt="" /><div><strong>{character.name}</strong><small>{place.action}</small><span>{special ? `Scène · ${nextScene.title}` : relation.met ? "Moment libre" : "Première rencontre"}</span></div></button>
                    <div className="immersive-presence-actions"><button onClick={() => openCharacterScene(character.id)}>Parler</button><button onClick={() => setModal({ kind: "gift", character: character.id })}>Offrir</button>{canDate && <button onClick={() => setModal({ kind: "date-planner", character: character.id })}>Rendez-vous</button>}</div>
                  </article>;
                }) : <div className="place-empty"><span>☾</span><p>Le lieu est calme pour l’instant.</p></div>}
              </div>
            </section>

            <section className="place-panel place-waiting">
              <header><div><p className="eyebrow">Rythme du monde</p><h2>Attendre</h2></div><span>{period.icon}</span></header>
              <button className="wait-period" onClick={() => advancePeriod()}><span>◷</span><div><strong>Attendre une période</strong><small>Passer à l’étape suivante de la journée</small></div><b>›</b></button>
              {upcomingVisitors.length > 0 && <div className="next-arrivals"><small>Prochains passages dans ce lieu</small>{upcomingVisitors.slice(0, 3).map(({ character, target }) => <button key={character.id} onClick={() => waitForCharacter(character.id)}><img src={character.portrait} alt="" /><span><strong>{character.name}</strong><small>{waitDurationLabel(game, target)} · {PERIODS[target.period].label}</small></span></button>)}</div>}
              {!upcomingVisitors.length && <p className="waiting-note">Aucun passage connu n’est prévu prochainement. Le monde continuera néanmoins d’évoluer.</p>}
            </section>

            <section className="place-panel place-actions-panel">
              <header><div><p className="eyebrow">Sur place</p><h2>Actions disponibles</h2></div><span>{currentSpot.icon}</span></header>
              <div className="immersive-action-grid">
                {currentSpot.activities.map((activityId) => { const activity = ACTIVITIES[activityId]; return <button key={activityId} onClick={() => performActivity(activityId)}><span>{activity.icon}</span><div><b>{activity.label}</b><small>{activity.detail}</small></div></button>; })}
                {jobsAtSpot(currentSpot.id).map((job) => { const access = jobAccess(game, job); return <button className={`immersive-job-action ${access.unlocked ? "" : "locked"}`} key={job.id} onClick={() => openJob(job)}><span>{access.unlocked ? "◈" : "♙"}</span><div><b>{job.title}</b><small>{access.unlocked ? `${JOB_KIND_LABELS[job.kind]} · ${job.reward} pièces` : `Lien avec ${access.characterName} · ${access.value}/${access.target}`}</small></div></button>; })}
              </div>
            </section>
          </div>
        </section>
      )}

      {tab === "map" && (
        <section className="game-stage map-stage">
          <div className="map-panel">
            <div className="panel-heading"><div><p className="eyebrow">Carte des routes</p><h1>Où souhaitez-vous aller ?</h1></div><span className="weather">{period.icon} {game.period === 3 ? "Brume nocturne" : "Ciel de Confluence"}</span></div>
            <div className="world-map">
              <img src="/assets/map.png" alt="Carte de Sylvinia" />
              {LOCATIONS.map((location) => {
                const locked = game.day < location.unlockDay && !game.settings.unlockAll;
                const occupants = visibleCharacters.filter((character) => characterPlace(character, game.day, game.period, game.flags, game.housing).location === location.id);
                return <button key={location.id} aria-label={`${location.name}${occupants.length ? ` · ${occupants.map((character) => character.name).join(", ")}` : ""}`} className={`map-pin ${location.minor ? "minor" : ""} ${selectedLocation === location.id ? "active" : ""} ${game.location === location.id ? "current" : ""} ${locked ? "locked" : ""}`} style={{ left: `${location.pin[0]}%`, top: `${location.pin[1]}%` }} onClick={() => { if (!locked) { setSelectedLocation(location.id); setSelectedSpot(location.id === game.location ? game.spot : DEFAULT_SPOTS[location.id]); setMapDestinationOpen(true); } }}><i /><span>{location.name}</span>{occupants.length > 0 && <span className="pin-occupants">{occupants.slice(0, 4).map((character) => <img key={character.id} src={character.portrait} alt={character.name} title={character.name} />)}{occupants.length > 4 && <b>+{occupants.length - 4}</b>}</span>}{locked && <em>J{location.unlockDay}</em>}</button>;
              })}
            </div>
            <div className="map-legend"><span><i className="open" />Accessible</span><span><i className="current" />Position</span><span><i className="locked" />À découvrir</span><span>Trajet : 1 période sur place, davantage entre régions.</span><span className="map-selection-hint">Touchez un lieu pour l’examiner</span></div>
          </div>

          {mapDestinationOpen && <div className="map-destination-layer">
            <button className="map-destination-backdrop" type="button" aria-label="Fermer la destination" onClick={() => setMapDestinationOpen(false)} />
            <aside id="map-destination" role="dialog" aria-modal="true" aria-labelledby="map-destination-title" className={`location-panel map-location-panel ${viewedSpots.length > 1 ? "has-sublocations" : "single-destination"}`}>
              <button className="map-destination-close" type="button" aria-label="Fermer" onClick={() => setMapDestinationOpen(false)}>×</button>
              <div className="location-visual" style={{ backgroundImage: `url(${viewedSpot.background})` }}>
                <div><p className="eyebrow">{game.location === viewedLocation.id && game.spot === viewedSpot.id ? "Position actuelle" : "Destination"}</p><h2 id="map-destination-title">{viewedLocation.name}</h2><span>{viewedSpot.name}</span></div>
              </div>
              {viewedSpots.length > 1 && <div className="sublocation-list"><div><strong>Sous-lieux</strong><small>{viewedSpots.length} endroits vivants</small></div>{viewedSpots.map((spot) => {
                const occupants = visibleCharacters.filter((character) => characterPlace(character, game.day, game.period, game.flags, game.housing).spot === spot.id);
                const spotJobs = jobsAtSpot(spot.id);
                return <button key={spot.id} className={viewedSpot.id === spot.id ? "active" : ""} onClick={() => setSelectedSpot(spot.id)}><span>{spot.icon}</span><div><b>{spot.shortName}</b><small>{spot.description}</small>{spotJobs.length > 0 && <span className="spot-job-badges">{spotJobs.map((job) => { const access = jobAccess(game, job); return <em className={access.unlocked ? "" : "locked"} key={job.id}>{access.unlocked ? "◈" : "♙"} {job.title}</em>; })}</span>}</div>{occupants.length > 0 && <span className="spot-occupants">{occupants.map((character) => <img key={character.id} src={character.portrait} alt={character.name} title={character.name} />)}</span>}</button>;
              })}</div>}
              <div className={`travel-card ${game.location === viewedLocation.id && game.spot === viewedSpot.id ? "is-current" : ""}`}><p>{viewedSpot.description}</p>{jobsAtSpot(viewedSpot.id).length > 0 && <div className="travel-job-list"><strong>Jobs dans ce sous-lieu</strong>{jobsAtSpot(viewedSpot.id).map((job) => { const access = jobAccess(game, job); return <span className={access.unlocked ? "" : "locked"} key={job.id}>{access.unlocked ? "◈" : "♙"} {job.title}<small>{access.unlocked ? `${JOB_KIND_LABELS[job.kind]} · ${job.reward} pièces` : `Lien avec ${access.characterName} ${access.value}/${access.target}`}</small></span>; })}</div>}{game.location === viewedLocation.id && game.spot === viewedSpot.id ? <button className="secondary-action" onClick={() => setTab("place")}>Revenir dans le lieu</button> : <button className="primary-action" onClick={() => travel(viewedLocation.id, viewedSpot.id)}>{game.location === viewedLocation.id ? `Se rendre à ${viewedSpot.shortName}` : `Voyager vers ${viewedLocation.name}`}</button>}<small>{game.location === viewedLocation.id && game.spot === viewedSpot.id ? "Votre position actuelle" : `Temps de trajet · ${travelDurationLabel(viewedTravelPeriods)}${game.location !== viewedLocation.id && game.player.vocation === SCOUT_VOCATION ? " · bonus d’éclaireur actif" : ""}`}</small></div>
            </aside>
          </div>}
        </section>
      )}

      {tab === "jobs" && <JobsView game={game} onStart={openJob} onLocate={(job) => { const spot = spotById(job.spot); if (!spot) return; setSelectedLocation(spot.location); setSelectedSpot(spot.id); setMapDestinationOpen(true); setTab("map"); }} />}
      {tab === "relations" && <RelationsView game={game} setModal={setModal} setSelectedLocation={setSelectedLocation} setSelectedSpot={setSelectedSpot} setTab={setTab} onWaitForRoute={waitForRoute} />}
      {tab === "journal" && <JournalView game={game} onStartCampaign={startCampaignScene} onReplayCampaign={replayCampaignScene} onReplayRoute={replayRoute} onReplaySocial={replaySocial} onReplaySecret={replaySecret} onReplayWorldEvent={replayWorldEvent} onReplayDate={replayDate} onReplayDateIntimacy={replayDateIntimacy} onReplayGroupDate={replayGroupDate} onReplayGroupDateIntimacy={replayGroupDateIntimacy} onWaitForRoute={waitForRoute} onReadLetter={readLetter} onOpenInvitation={(invitationId) => setModal({ kind: "invitation", invitationId })} />}
      {tab === "inventory" && <AssetsView game={game} presentCharacters={presentCharacters} onShop={() => setModal({ kind: "shop" })} onGive={giveGift} onBuyProperty={buyProperty} onSellProperty={sellProperty} onDisplay={setDisplayedItem} onResident={toggleResident} />}
      {tab === "codex" && <CodexView game={game} />}
      {tab === "options" && <OptionsView game={game} updateGame={updateGame} slotInfo={slotInfo} saveSlot={saveSlot} loadSlot={loadSlot} exportSave={exportSave} importSave={importSave} returnTitle={() => setScreen("title")} />}

      <nav className="game-nav">
        {([
          ["place", "◉", "Lieu"], ["map", "⌖", "Carte"], ["jobs", "◈", "Jobs"], ["relations", "♡", "Relations"], ["journal", "≡", "Journal"], ["inventory", "⌂", "Biens"], ["codex", "✧", "Codex"], ["options", "⚙", "Options"],
        ] as [Tab, string, string][]).map(([id, icon, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => { setMapDestinationOpen(false); setTab(id); }}><span>{icon}</span>{label}</button>)}
      </nav>

      {dialogue && <DialogueOverlay dialogue={dialogue} game={game} onAdvance={advanceDialogue} onChoice={selectChoice} onClose={() => dialogue.scene.kind === "intro" || dialogue.replay ? closeDialogue() : undefined} />}
      {modal && <GameModal
        modal={modal}
        game={game}
        onClose={() => setModal(null)}
        onActivityClose={closeActivityNotice}
        buyGift={buyGift}
        giveGift={giveGift}
        startDate={startDate}
        startHomeDate={startHomeDate}
        startHomePairDate={startHomePairDate}
        startDateIntimacy={startDateIntimacy}
        finishHomeDate={finishHomeDate}
        finishHomePairDate={finishHomePairDate}
        startHomeIntimacy={startHomeIntimacy}
        onIntimacyClose={closeIntimacy}
        startGroupDate={startGroupDate}
        startGroupDateIntimacy={startGroupDateIntimacy}
        onGroupIntimacyClose={closeGroupIntimacy}
        replyToLetter={replyToLetter}
        acceptInvitation={acceptInvitation}
        declineInvitation={declineInvitation}
        ritual={{ sequence: ritualSequence, step: ritualStep, phase: ritualPhase, setPhase: setRitualPhase, play: playRitualRune }}
        onRitualClose={() => setModal(null)}
        jobState={jobState}
        onJobBegin={beginJob}
        onMemoryStart={startMemoryJob}
        onJobAction={playJobAction}
        onJobClose={closeJob}
      />}
    </main>
  );
}

function TitleScreen({ hasSave, onNew, onContinue, onChronicle, modal, closeModal }: { hasSave: boolean; onNew: () => void; onContinue: () => void; onChronicle: () => void; modal: ModalState; closeModal: () => void }) {
  return <main className="title-screen">
    <div className="title-backdrop" /><div className="title-vignette" />
    <button className="chronicle-badge" onClick={onChronicle}><span>Chronique Alternative</span><small>Mode libre · Une autre Sylvinia</small></button>
    <section className="title-panel"><div className="title-mark">✦</div><p className="eyebrow">Mode libre · Le Chroniqueur Vagabond présente</p><h1>Sylvinia</h1><p className="title-subtitle">Les Liens du Crépuscule</p><p className="title-copy">Égaré·e dans une réalité qui n’est pas la vôtre, explorez une Sylvinia où Iriana enquête seule et tissez des alliances qui n’appartiennent qu’à vous.</p><div className="title-actions"><button className="primary-action" onClick={onNew}>Nouvelle chronique</button><button className="secondary-action" disabled={!hasSave} onClick={onContinue}>Continuer</button><a className="return-story-button" href="../index.html">Retour au Mode Histoire</a></div></section>
    <p className="title-footer">Intimité réglable · Scènes interactives · Sauvegarde locale</p>
    {modal?.kind === "chronicle" && <ChronicleModal onClose={closeModal} />}
    {modal?.kind === "notice" && <SimpleModal title={modal.title} text={modal.text} onClose={closeModal} />}
  </main>;
}

function CreatorScreen({ player, setPlayer, onBack, onBegin }: { player: Player; setPlayer: (player: Player) => void; onBack: () => void; onBegin: () => void }) {
  const [explicitWarning, setExplicitWarning] = useState(false);
  const initial = player.name.trim().charAt(0).toUpperCase() || "?";
  return <main className="creator-screen">
    <header className="screen-header"><button className="back-button" onClick={onBack}>← Retour</button><div><p className="eyebrow">Prologue · La personne entre les mondes</p><h1>Créez votre protagoniste</h1></div><span className="step-pill">Adulte · 18+</span></header>
    <div className="creator-layout">
      <aside className="creator-preview"><div className="avatar-frame"><div className="avatar-glow" /><div className="avatar-hair" style={{ background: player.hair }} /><div className="avatar-head" style={{ background: player.skin }}><i style={{ background: player.eyes }} /><i style={{ background: player.eyes }} /></div><div className="avatar-body" /><strong>{initial}</strong></div><div className="preview-copy"><span className="kicker">Votre chronique</span><h2>{player.name || "Nom encore inconnu"}</h2><p>{player.age} ans · {player.pronouns} · {player.sex}</p><blockquote>« Mon passé s’est effacé. Ce que je choisirai ici, en revanche, m’appartiendra. »</blockquote></div><div className="preview-stats">{TRAITS.map(([name]) => <div key={name} className={name === player.trait ? "is-primary" : ""}><span>{name}</span><b>{name === player.trait ? 7 : 4}</b></div>)}</div></aside>
      <section className="creator-form">
        <FormSection number="01" title="Identité" detail="Le monde emploiera ces informations dans les dialogues."><div className="form-grid two"><label>Nom ou prénom<input value={player.name} maxLength={24} placeholder="Votre nom" onChange={(event) => setPlayer({ ...player, name: event.target.value })} /></label><label>Âge adulte<input type="number" min={18} max={120} value={player.age} onChange={(event) => setPlayer({ ...player, age: Number(event.target.value) })} /></label></div><div className="choice-row">{(["elle", "iel", "il"] as Pronouns[]).map((pronouns) => <button key={pronouns} className={player.pronouns === pronouns ? "selected" : ""} onClick={() => setPlayer({ ...player, pronouns })}>{pronouns}</button>)}</div></FormSection>
        <FormSection number="02" title="Écho résiduel" detail="Votre mémoire est vide, mais certains réflexes ont traversé le portail avec vous."><div className="card-choices">{ECHOES.map(([name, detail]) => <button key={name} className={player.origin === name ? "selected" : ""} onClick={() => setPlayer({ ...player, origin: name })}><strong>{name}</strong><small>{detail}</small></button>)}</div></FormSection>
        <FormSection number="03" title="Vocation & tempérament" detail="Cette orientation décrit la place que vous choisissez de construire à Al’Gratal, pas un passé dont vous vous souviendriez."><div className="form-grid two"><label>Vocation choisie<select value={player.vocation} onChange={(event) => setPlayer({ ...player, vocation: event.target.value })}>{VOCATIONS.map(([name]) => <option key={name}>{name}</option>)}</select></label><label>Facette dominante<select value={player.trait} onChange={(event) => setPlayer({ ...player, trait: event.target.value })}>{TRAITS.map(([name]) => <option key={name}>{name}</option>)}</select></label></div><p className="trait-note">{TRAITS.find(([name]) => name === player.trait)?.[1]}</p></FormSection>
        <FormSection number="04" title="Apparence, sexe & intimité" detail="Le sexe adapte la narration des scènes intimes ; il ne détermine ni vos pronoms ni vos relations."><div className="swatch-grid"><ColorField label="Cheveux" value={player.hair} onChange={(hair) => setPlayer({ ...player, hair })} /><ColorField label="Yeux" value={player.eyes} onChange={(eyes) => setPlayer({ ...player, eyes })} /><ColorField label="Peau" value={player.skin} onChange={(skin) => setPlayer({ ...player, skin })} /></div><div className="choice-row sex-choice">{(["femme", "intersexe", "homme"] as PlayerSex[]).map((sex) => <button key={sex} className={player.sex === sex ? "selected" : ""} onClick={() => setPlayer({ ...player, sex })}>{sex === "femme" ? "Femme" : sex === "homme" ? "Homme" : "Intersexe"}</button>)}</div><div className="intimacy-options">{([[
          "tendre", "Tendre", "Romance, baisers et proximité douce"], ["suggestif", "Suggestif", "Sensuel sans description anatomique"], ["explicite", "Explicite", "Narration adulte détaillée, sans coupure"], ["ellipse", "Fondu au noir", "Toute intimité reste hors champ"]] as [Intimacy, string, string][]).map(([id, title, detail]) => <button key={id} className={player.intimacy === id ? "selected" : ""} onClick={() => id === "explicite" && player.intimacy !== "explicite" ? setExplicitWarning(true) : setPlayer({ ...player, intimacy: id })}><strong>{title}</strong><small>{detail}</small></button>)}</div></FormSection>
        <div className="creator-submit"><div><strong>Votre personnage est-il prêt ?</strong><small>Une sauvegarde automatique sera créée au début du prologue.</small></div><button className="primary-action" disabled={!player.name.trim() || player.age < 18} onClick={onBegin}>Franchir le portail</button></div>
      </section>
    </div>
    {explicitWarning && <ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { setPlayer({ ...player, intimacy: "explicite" }); setExplicitWarning(false); }} />}
  </main>;
}

function FormSection({ number, title, detail, children }: { number: string; title: string; detail: string; children: React.ReactNode }) {
  return <div className="form-section"><div className="section-title"><span>{number}</span><div><h2>{title}</h2><p>{detail}</p></div></div>{children}</div>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="color-field"><span>{label}</span><input type="color" value={value} onChange={(event) => onChange(event.target.value)} /><code>{value}</code></label>;
}

function DialogueOverlay({ dialogue, game, onAdvance, onChoice, onClose }: { dialogue: DialogueState; game: GameState; onAdvance: () => void; onChoice: (choice: ChoiceData) => void; onClose: () => void }) {
  const currentLine = dialogue.lines[dialogue.lineIndex];
  const activeIds = currentLine ? speakerCharacterIds(currentLine.speaker, dialogue.scene.cast) : [];
  const availableChoices = choicesForDialogue(dialogue, game);
  const sceneLabel = dialogue.scene.kind === "story" ? "Histoire principale" : dialogue.scene.kind === "route" ? "Scène de relation" : dialogue.scene.kind === "intro" ? "Prologue" : dialogue.scene.kind === "social" ? "Liens croisés" : dialogue.scene.kind === "date" ? "Rendez-vous" : dialogue.scene.kind === "secret" ? "Conversation personnelle" : dialogue.scene.kind === "world" ? "Événement spontané" : dialogue.scene.kind === "invitation" ? "Invitation" : "Moment libre";
  return <section className="dialogue-overlay" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.15), rgba(5,6,12,.72)), url(${backgroundUrl(dialogue.scene.background)})` }}>
    <div className="scene-top"><div><p className="eyebrow">{dialogue.replay ? "Souvenir · aucun gain" : sceneLabel}</p><h2>{dialogue.scene.title}</h2></div>{(dialogue.scene.kind === "intro" || dialogue.replay) && <button onClick={onClose}>{dialogue.replay ? "Quitter le souvenir" : "Passer le prologue"}</button>}</div>
    <div className={`scene-cast cast-${dialogue.scene.cast.length}`}>{dialogue.scene.cast.map((id, index) => { const character = CHARACTERS.find((entry) => entry.id === id); if (!character) return null; const active = activeIds.includes(id); const lineMood = active && (activeIds.length === 1 || activeIds[0] === id) ? currentLine?.mood : undefined; const mood = active ? (lineMood || moodForCharacter(id, `${dialogue.scene.id}-${dialogue.lineIndex}-${id}`, character.defaultMood)) : character.defaultMood; return <img key={id} className={`scene-sprite ${active ? "active" : "inactive"} speaker-${index}`} src={`/assets/sprites/${id}/${mood}.webp`} alt={character.name} />; })}</div>
    <div className="dialogue-gradient" />
    {dialogue.phase !== "choices" ? <button className={`dialogue-box ${currentLine.speaker === "Narration" ? "narration" : ""}`} onClick={onAdvance}>
      <span className="speaker">{replacePlayer(currentLine.speaker, game.player)}</span><p>{replacePlayer(currentLine.text, game.player)}</p><small>{dialogue.lineIndex + 1} / {dialogue.lines.length} · Cliquer pour continuer</small>
    </button> : <div className="choice-box"><p className="choice-question">Comment répondre ?</p>{availableChoices.map((choice) => {
      const statLocked = Boolean(choice.requires && game.stats[choice.requires.stat] < choice.requires.value);
      const knowledgeLocked = !hasKnowledge(game, choice.requiresKnowledge);
      const relationLocked = !relationshipRequirementMet(choice, game);
      const locked = (statLocked || knowledgeLocked || relationLocked) && !game.settings.unlockAll;
      return <button key={choice.id} disabled={locked} onClick={() => onChoice(choice)}><span className={`stat-icon ${choice.stat}`}>{STAT_LABELS[choice.stat].charAt(0)}</span><div><strong>{choice.text}</strong>{dialogue.replay ? <small className="replay-note">Souvenir : aucun gain, aucun temps consommé</small> : (game.settings.showImpact || game.settings.developer) && <small>{impactText(choice)}</small>}{locked && <em>{statLocked ? `Nécessite ${STAT_LABELS[choice.requires!.stat]} ${choice.requires!.value}` : knowledgeLocked ? "Cette réponse exige une information que vous n’avez pas encore découverte" : "Nécessite des liens plus avancés avec les personnes concernées"}</em>}</div></button>;
    })}</div>}
  </section>;
}

function JobsView({ game, onStart, onLocate }: { game: GameState; onStart: (job: JobData) => void; onLocate: (job: JobData) => void }) {
  const ordered = [...JOBS].sort((left, right) => {
    const leftLocal = left.spot === game.spot ? 0 : 1;
    const rightLocal = right.spot === game.spot ? 0 : 1;
    const leftLocked = jobAccess(game, left).unlocked ? 0 : 1;
    const rightLocked = jobAccess(game, right).unlocked ? 0 : 1;
    return leftLocal - rightLocal || leftLocked - rightLocked || left.title.localeCompare(right.title, "fr");
  });
  const unlockedCount = JOBS.filter((job) => jobAccess(game, job).unlocked).length;
  const localCount = JOBS.filter((job) => job.spot === game.spot && jobAccess(game, job).unlocked).length;
  return <section className="jobs-stage">
    <header className="jobs-heading"><div><p className="eyebrow">Registre des contrats</p><h1>Jobs & travaux de Sylvinia</h1><p>Chaque employeur conserve sa propre rotation. Les situations inédites sont distribuées avant le retour des anciennes, puis les banques sont rebattues.</p></div><div className="jobs-summary"><span><b>{localCount}</b> ici</span><span><b>{unlockedCount}</b> accessibles</span><span><b>{JOBS.length}</b> contrats</span></div></header>
    <div className="jobs-grid">{ordered.map((job) => {
      const access = jobAccess(game, job);
      const spot = spotById(job.spot);
      const location = LOCATIONS.find((entry) => entry.id === spot?.location);
      const local = job.spot === game.spot;
      const run = game.jobRuns[job.id] || 0;
      return <article key={job.id} className={`job-contract-card ${local ? "local" : ""} ${access.unlocked ? "" : "locked"}`}>
        <header><span>{access.unlocked ? "◈" : "♙"}</span><div><small>{JOB_KIND_LABELS[job.kind]} · {job.employer}</small><h2>{job.title}</h2></div><b>{job.reward} ◈</b></header>
        <p>{job.description}</p>
        <div className="job-contract-place"><span>{spot?.icon || "⌖"}</span><div><strong>{location?.name || "Sylvinia"}</strong><small>{spot?.name || job.spot}</small></div>{local && <em>Vous êtes ici</em>}</div>
        <div className="job-contract-rotation"><small>Prochaine session</small><strong>{jobSessionLabel(job, run)}</strong><span>{run ? `${run} rotation${run > 1 ? "s" : ""} jouée${run > 1 ? "s" : ""}` : "Banque intacte"}</span></div>
        {!access.unlocked && <div className="job-contract-lock"><b>Lien requis avec {access.characterName}</b><span>{access.value} / {access.target}</span><i><em style={{ width: `${Math.min(100, (access.value / access.target) * 100)}%` }} /></i></div>}
        <button className={local && access.unlocked ? "primary-action" : "secondary-action"} onClick={() => access.unlocked && !local ? onLocate(job) : onStart(job)}>{access.unlocked ? local ? "Commencer ce job" : "Localiser sur la carte" : "Voir la condition"}</button>
      </article>;
    })}</div>
  </section>;
}

function RelationsView({ game, setModal, setSelectedLocation, setSelectedSpot, setTab, onWaitForRoute }: { game: GameState; setModal: (modal: ModalState) => void; setSelectedLocation: (id: string) => void; setSelectedSpot: (id: string) => void; setTab: (tab: Tab) => void; onWaitForRoute: (id: string) => void }) {
  const availableGroupDates = GROUP_DATES.filter((date) => groupDateUnlocked(game, date));
  return <section className="content-view"><header className="content-header"><div><p className="eyebrow">Constellation des liens</p><h1>Relations</h1><p>La confiance et l’affection ouvrent les scènes importantes. Le désir ne remplace jamais l’une ou l’autre. La route de Draven est narrative et non romantique.</p></div><span>{CHARACTERS.filter((character) => game.relationships[character.id].met).length} / {CHARACTERS.length} rencontré·es</span></header><button className="group-date-launcher" onClick={() => setModal({ kind: "group-date-planner" })}><span className="group-date-portraits">{GROUP_DATES[0].characters.map((id) => <img key={id} src={CHARACTERS.find((entry) => entry.id === id)?.portrait} alt="" />)}</span><div><p className="eyebrow">Relations croisées</p><h2>Rendez-vous à trois</h2><p>{GROUP_DATES.length} duos compatibles, chacun avec une dynamique, un mini-jeu et trois conclusions propres à votre sexe.</p></div><b>{availableGroupDates.length} / {GROUP_DATES.length}<small>accessibles</small></b></button><div className="relationship-grid">{CHARACTERS.map((character) => {
    const relation = game.relationships[character.id];
    const unlocked = characterUnlocked(game, character);
    const schedule = characterPlace(character, game.day, game.period, game.flags, game.housing);
    const locationId = schedule.location;
    const location = LOCATIONS.find((entry) => entry.id === locationId);
    const exactSpot = spotById(schedule.spot);
    const rawNext = sceneFor(character.id, relation.stage);
    const next = rawNext ? relationRouteVariant(rawNext, game).route : undefined;
    const needed = next ? Math.max(0, BOND_THRESHOLDS[next.stage] - relation.affection - relation.trust) : 0;
    const confidenceObjective = next ? routeNarrativeObjective(next, game) : undefined;
    const narrativeReady = Boolean(next && !confidenceObjective);
    const dates = game.flags.includes(`${character.id}-platonic`) ? [] : DATE_SCENES.filter((date) => date.character === character.id);
    const hasDatePlanner = dates.length > 0 || Boolean(HOME_DATE_PROFILES[character.id]);
    const routeTarget = next && narrativeReady ? nextPresence(character, game, ROUTE_SPOTS[next.id], ROUTE_PERIODS[next.id], next.dayMin) : null;
    return <article key={character.id} className={`relationship-card ${!unlocked ? "locked" : ""}`} style={{ "--character": character.color } as React.CSSProperties}>
      <button className="relationship-portrait" disabled={!unlocked} onClick={() => setModal({ kind: "character", character: character.id })}><img src={character.portrait} alt="" /><div><span>{unlocked ? character.name : "Inconnu·e"}</span><small>{unlocked ? character.role : character.id === "tia" && game.day >= character.unlockDay ? "Une puissance impériale encore inaccessible" : `Disponible au jour ${character.unlockDay}`}</small></div></button>
      <div className="relationship-body"><div className="stage-line"><strong>{STAGE_LABELS[relation.stage]}</strong><span>{relation.stage} / 5</span></div><Meter label="Affection" value={relation.affection} color={character.color} /><Meter label="Confiance" value={relation.trust} color="#d6c176" /><Meter label="Désir" value={relation.desire} color="#e76588" />
        {unlocked && <div className="relation-clue"><span>{schedule.traveling ? `↝ Escale · ${exactSpot?.name}` : `⌖ ${location?.name} · ${exactSpot?.shortName} · jusqu’au J${schedule.untilDay}`}</span><small>{schedule.action}</small><small>{next ? confidenceObjective || (game.day < next.dayMin ? `Prochaine scène au jour ${next.dayMin}` : needed ? `Lien requis : encore ${needed} points` : ROUTE_SPOTS[next.id] !== schedule.spot ? `Prochaine scène : ${spotById(ROUTE_SPOTS[next.id])?.name}` : !ROUTE_PERIODS[next.id]?.includes(PERIODS[game.period].id) ? `Moment requis : ${ROUTE_PERIODS[next.id]?.map((id) => PERIODS.find((entry) => entry.id === id)?.label).join(" ou ")}` : "Une scène importante est disponible") : "Route accomplie · rencontres libres disponibles"}</small></div>}
        {unlocked && <div className="card-actions"><button onClick={() => setModal({ kind: "character", character: character.id })}>Voir le dossier</button><button onClick={() => { setSelectedLocation(locationId); setSelectedSpot(schedule.spot); setTab("map"); }}>Localiser</button>{hasDatePlanner && <button className="date-action" onClick={() => setModal({ kind: "date-planner", character: character.id })}>♡ Rendez-vous</button>}{next && narrativeReady && !needed && routeTarget && <button onClick={() => onWaitForRoute(next.id)}>Attendre · {waitDurationLabel(game, routeTarget)}</button>}</div>}
      </div>
    </article>;
  })}</div></section>;
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="meter"><div><span>{label}</span><b>{value}</b></div><i><em style={{ width: `${value}%`, background: color }} /></i></div>;
}

function NotificationLayer({ notifications }: { notifications: ChronicleNotification[] }) {
  const icons: Record<NotificationKind, string> = { unlock: "✦", item: "◇", relation: "♡", story: "▤", codex: "⌁", home: "⌂", letter: "✉", invitation: "◈", rumor: "◌", knowledge: "◇" };
  const labels: Record<NotificationKind, string> = { unlock: "Déblocage", item: "Inventaire", relation: "Relation", story: "Chronique", codex: "Codex", home: "Logis", letter: "Correspondance", invitation: "Invitation", rumor: "Rumeur", knowledge: "Découverte" };
  return <aside className="chronicle-notifications" aria-live="polite" aria-atomic="false">
    {notifications.map((notification) => <article className={`chronicle-notification ${notification.kind}`} key={notification.id}>
      <span className="notification-sigil">{icons[notification.kind]}</span>
      <div><small>{labels[notification.kind]}</small><strong>{notification.title}</strong>{notification.detail && <p>{notification.detail}</p>}</div>
    </article>)}
  </aside>;
}

function JournalView({ game, onStartCampaign, onReplayCampaign, onReplayRoute, onReplaySocial, onReplaySecret, onReplayWorldEvent, onReplayDate, onReplayDateIntimacy, onReplayGroupDate, onReplayGroupDateIntimacy, onWaitForRoute, onReadLetter, onOpenInvitation }: { game: GameState; onStartCampaign: (id: string) => void; onReplayCampaign: (id: string) => void; onReplayRoute: (id: string) => void; onReplaySocial: (id: string) => void; onReplaySecret: (id: string) => void; onReplayWorldEvent: (id: string) => void; onReplayDate: (id: string) => void; onReplayDateIntimacy: (id: string) => void; onReplayGroupDate: (id: string) => void; onReplayGroupDateIntimacy: (id: string) => void; onWaitForRoute: (id: string) => void; onReadLetter: (id: string) => void; onOpenInvitation: (id: string) => void }) {
  const campaignMemories = CAMPAIGN_SCENES.filter((scene) => game.history.includes(scene.id));
  const socialMemories = game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7)).map((id) => SOCIAL_SCENES.find((scene) => scene.id === id)).filter((scene): scene is SocialScene => Boolean(scene));
  const secretMemories = game.secretHistory.map((id) => SECRET_CONVERSATIONS.find((secret) => secret.id === id)).filter((secret): secret is SecretConversation => Boolean(secret));
  const worldMemories = game.worldEventHistory.map((id) => SPONTANEOUS_EVENTS.find((event) => event.id === id)).filter((event): event is SpontaneousEvent => Boolean(event));
  const dateMemories = unique(game.dateHistory).map((id) => DATE_SCENES.find((date) => date.id === id)).filter((date): date is DateScene => Boolean(date));
  const groupDateMemories = unique(game.groupDateHistory).map((id) => GROUP_DATES.find((date) => date.id === id)).filter((date): date is GroupDateScene => Boolean(date));
  const discovered = new Set([...game.history, ...game.flags, ...game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  const mainProgress = storyProgress(game.history, game.flags);
  const storyComplete = mainProgress >= MAIN_STORY.length;
  const activeAct = MAIN_STORY[Math.min(mainProgress, MAIN_STORY.length - 1)];
  const activeDone = activeAct.requiredScenes.filter((id) => discovered.has(id)).length;
  const nextMilestoneId = storyComplete ? undefined : activeAct.requiredScenes.find((id) => !discovered.has(id));
  const nextMilestone = nextMilestoneId ? storyMilestone(nextMilestoneId) : undefined;
  const nextCampaign = nextMilestoneId ? campaignSceneById(nextMilestoneId) : undefined;
  const nextCampaignReady = Boolean(nextCampaign && campaignSceneReady(nextCampaign, game));
  const nextCampaignBlocker = nextCampaign && !nextCampaignReady ? campaignBlockingObjective(nextCampaign, game) : undefined;
  const threads = CHARACTERS.map((character) => {
    const relation = game.relationships[character.id];
    const progress = relationshipNarrativeProgress(game, character.id);
    const scene = sceneFor(character.id, relation.stage);
    const unlocked = characterUnlocked(game, character);
    const needed = scene ? Math.max(0, BOND_THRESHOLDS[scene.stage] - relation.affection - relation.trust) : 0;
    const confidenceObjective = scene ? routeNarrativeObjective(scene, game) : undefined;
    const target = scene && !confidenceObjective ? nextPresence(character, game, ROUTE_SPOTS[scene.id], ROUTE_PERIODS[scene.id], scene.dayMin) : undefined;
    const confidences = secretMemories.filter((secret) => secret.character === character.id).length;
    return { character, relation, progress, scene, unlocked, needed, confidenceObjective, target, confidences };
  });
  const completedRelationScenes = threads.reduce((total, thread) => total + thread.progress.completed, 0);
  const totalRelationScenes = threads.reduce((total, thread) => total + thread.progress.total, 0);
  const letters = game.letters.map((received) => ({ received, letter: LETTERS.find((entry) => entry.id === received.id) })).filter((entry): entry is { received: ReceivedLetter; letter: LetterTemplate } => Boolean(entry.letter));
  const invitations = game.invitations.map((received) => ({ received, invitation: INVITATIONS.find((entry) => entry.id === received.id) })).filter((entry): entry is { received: ReceivedInvitation; invitation: InvitationTemplate } => Boolean(entry.invitation));
  const rumors = game.rumors.map((heard) => ({ heard, rumor: RUMORS.find((entry) => entry.id === heard.id) })).filter((entry): entry is { heard: { id: string; heardDay: number }; rumor: RumorTemplate } => Boolean(entry.rumor));
  const knowledge = game.knowledge.map((id) => ALL_KNOWLEDGE_ENTRIES.find((entry) => entry.id === id)).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return <section className="content-view">
    <header className="content-header"><div><p className="eyebrow">Mémoire de l’entre-mondes</p><h1>Journal de la Confluence</h1><p>Suivez ici vos objectifs, vos fils relationnels et les scènes déjà mémorisées. Une relecture n’altère jamais la sauvegarde.</p></div><span>Jour {game.day}</span></header>
    <div className="journal-layout"><div className="quest-column">
      <section className={`story-progress-overview ${storyComplete ? "complete" : ""}`}>
        <div className="story-progress-heading"><div><p className="eyebrow">Fil principal · {storyComplete ? "accompli" : `Acte ${activeAct.number} sur ${MAIN_STORY.length}`}</p><h2>{storyComplete ? "La convergence est stabilisée" : activeAct.title}</h2></div><strong>{mainProgress} / {MAIN_STORY.length} actes</strong></div>
        <div className="story-overall-bar"><i style={{ width: `${Math.round((mainProgress / MAIN_STORY.length) * 100)}%` }} /></div>
        <div className="story-current-objective"><span>{storyComplete ? "Monde ouvert" : "Objectif actuel"}</span><p>{storyComplete ? "Le fil principal est terminé. Tous les voyages, relations, rendez-vous et activités restent disponibles sans limite de temps." : activeAct.objective}</p></div>
        {!storyComplete && <div className="story-next-step"><b>Prochain jalon</b><span>{nextMilestone?.title || "Explorez les pistes déjà découvertes"}</span><small>{nextCampaignBlocker || nextMilestone?.place || `${activeDone} / ${activeAct.requiredScenes.length} jalons accomplis`}</small>{nextCampaignReady && nextCampaign && <button className="primary-action" onClick={() => onStartCampaign(nextCampaign.id)}>Rejoindre cette scène de campagne</button>}</div>}
      </section>

      <section className="living-journal">
        <div className="journal-section-title"><div><h2>Le monde vous écrit</h2><p>Correspondances et invitations apparaissent ici lorsqu’elles existent réellement. Une invitation ignorée peut expirer sans sanction automatique.</p></div><strong>{letters.filter(({ received }) => !received.read).length + invitations.filter(({ received }) => received.status === "pending").length} en attente</strong></div>
        <div className="living-journal-grid">
          <article className="living-journal-panel"><header><span>✉</span><div><h3>Correspondances</h3><small>{letters.length} reçue{letters.length > 1 ? "s" : ""}</small></div></header><div className="living-journal-list">{letters.length ? [...letters].reverse().map(({ received, letter }) => <button className={!received.read ? "unread" : ""} key={letter.id} onClick={() => onReadLetter(letter.id)}><span>{!received.read ? "Nouveau" : received.replyId ? "Répondu" : `Jour ${received.receivedDay}`}</span><strong>{letter.subject}</strong><small>{CHARACTERS.find((entry) => entry.id === letter.character)?.name} · {letter.delivery}</small></button>) : <p>Aucune lettre reçue pour l’instant.</p>}</div></article>
          <article className="living-journal-panel"><header><span>◈</span><div><h3>Invitations</h3><small>Les personnages peuvent prendre l’initiative</small></div></header><div className="living-journal-list">{invitations.length ? [...invitations].reverse().map(({ received, invitation }) => <button className={received.status === "pending" ? "unread" : ""} key={invitation.id} onClick={() => onOpenInvitation(invitation.id)}><span>{received.status === "pending" ? `Expire J${received.expiresDay}` : received.status === "accepted" ? "Honorée" : received.status === "declined" ? "Refusée" : "Expirée"}</span><strong>{invitation.title}</strong><small>{CHARACTERS.find((entry) => entry.id === invitation.character)?.name} · {spotById(invitation.spot)?.name}</small></button>) : <p>Aucune invitation ne vous attend.</p>}</div></article>
        </div>
        <div className="living-journal-grid discoveries">
          <article className="living-journal-panel"><header><span>◌</span><div><h3>Rumeurs entendues</h3><small>Leur vérité n’est jamais certifiée</small></div></header><div className="rumor-notes">{rumors.length ? [...rumors].reverse().map(({ heard, rumor }) => <div key={rumor.id}><small>{rumor.source} · Jour {heard.heardDay}</small><p>« {rumor.text} »</p></div>) : <p>Aucune rumeur consignée.</p>}</div></article>
          <article className="living-journal-panel"><header><span>◇</span><div><h3>Ce que vous savez</h3><small>Uniquement les faits et recoupements découverts</small></div></header><div className="knowledge-notes">{knowledge.length ? [...knowledge].reverse().map((entry) => <div key={entry.id}><strong>{entry.title}</strong><p>{entry.summary}</p><small>{entry.people.map((id) => CHARACTERS.find((character) => character.id === id)?.name).filter(Boolean).join(" · ")}</small></div>) : <p>Aucune confidence personnelle n’a encore été consignée.</p>}</div></article>
        </div>
      </section>

      <div className="journal-section-title"><div><h2>Fils relationnels</h2><p>Chaque personnage possède cinq scènes narratives majeures, distinctes des moments libres et des rendez-vous.</p></div><strong>{completedRelationScenes} / {totalRelationScenes}</strong></div>
      {threads.map(({ character, relation, progress, scene, unlocked, needed, confidenceObjective, target, confidences }) => {
        const scenePlace = scene ? spotById(ROUTE_SPOTS[scene.id]) : undefined;
        const periods = scene ? ROUTE_PERIODS[scene.id]?.map((id) => PERIODS.find((entry) => entry.id === id)?.label).filter(Boolean).join(" / ") : "";
        const objective = !unlocked
          ? character.id === "tia" && game.day >= character.unlockDay ? "Approfondissez d’abord votre compréhension d’Amanea : Tia demeure encore une institution, pas une relation personnelle." : `Ce fil deviendra accessible au jour ${character.unlockDay}.`
          : !scene
            ? "Toutes les scènes narratives de ce personnage ont été accomplies. Les moments libres et rendez-vous restent disponibles."
            : confidenceObjective
              ? confidenceObjective
              : game.day < scene.dayMin
              ? `Patientez jusqu’au jour ${scene.dayMin}, puis rejoignez ${scenePlace?.name || "le lieu indiqué"}${periods ? ` · ${periods}` : ""}.`
              : needed > 0
                ? `Renforcez encore ce lien de ${needed} point${needed > 1 ? "s" : ""}, puis rejoignez ${scenePlace?.name || "le lieu indiqué"}.`
                : `Rejoignez ${scenePlace?.name || "le lieu indiqué"}${periods ? ` · ${periods}` : ""}.`;
        const status = !unlocked ? character.id === "tia" && game.day >= character.unlockDay ? "Accès impérial" : `Jour ${character.unlockDay}` : !scene ? "Accompli" : confidenceObjective ? "Confidence" : game.day < scene.dayMin ? `Jour ${scene.dayMin}` : needed ? `Lien +${needed}` : "Disponible";
        return <article className={`quest-card relation-thread-card ${!unlocked ? "locked" : ""} ${!scene ? "complete" : ""}`} key={character.id}>
          <img src={character.portrait} alt="" />
          <div>
            <div className="relation-thread-heading"><span style={{ color: character.color }}>{character.name}</span><small>Scènes narratives · {progress.completed} / {progress.total}{confidences ? ` · ${confidences} confidence${confidences > 1 ? "s" : ""} découverte${confidences > 1 ? "s" : ""}` : ""}</small></div>
            <div className="relation-thread-progress"><i style={{ width: `${progress.total ? (progress.completed / progress.total) * 100 : 0}%`, background: character.color }} /></div>
            <h3>{scene ? `Prochaine scène · ${scene.title}` : "Fil narratif accompli"}</h3>
            <p><b>Objectif :</b> {objective}</p>
            {unlocked && scene && !confidenceObjective && !needed && target && <button onClick={() => onWaitForRoute(scene.id)}>Attendre et rejoindre · {waitDurationLabel(game, target)}</button>}
          </div>
          <b>{status}</b>
        </article>;
      })}

      <h2>Scènes mémorisées</h2>
      <p className="memory-explainer">✦ Relecture protégée : les caractéristiques, relations, objets et l’heure restent strictement inchangés.</p>
      <div className="memory-replay-grid">
        {campaignMemories.map((scene) => <button key={scene.id} onClick={() => onReplayCampaign(scene.id)}><span>◆ Campagne · Acte {scene.act}</span><strong>{scene.title}</strong><small>Revoir sans modifier la chronique</small></button>)}
        {game.history.map((id) => { const scene = ROUTE_SCENES.find((entry) => entry.id === id); const character = CHARACTERS.find((entry) => entry.id === scene?.character); return scene && <button key={id} onClick={() => onReplayRoute(id)}><span style={{ color: character?.color }}>◇ {character?.name}</span><strong>{scene.title}</strong><small>Revoir la scène</small></button>; })}
        {socialMemories.map((scene) => <button key={scene.id} onClick={() => onReplaySocial(scene.id)}><span>✦ Liens croisés</span><strong>{scene.title}</strong><small>Revoir la scène</small></button>)}
        {secretMemories.map((secret) => <button key={secret.id} onClick={() => onReplaySecret(secret.id)}><span style={{ color: CHARACTERS.find((character) => character.id === secret.character)?.color }}>◇ Confidence · {CHARACTERS.find((character) => character.id === secret.character)?.name}</span><strong>{secret.title}</strong><small>Revoir sans gain ni nouvelle découverte</small></button>)}
        {worldMemories.map((event) => <button key={event.id} onClick={() => onReplayWorldEvent(event.id)}><span>◈ Événement spontané · {event.characters.map((id) => CHARACTERS.find((character) => character.id === id)?.name).filter(Boolean).join(" & ")}</span><strong>{event.title}</strong><small>Revoir sans modifier le monde</small></button>)}
        {dateMemories.map((date) => <button key={date.id} onClick={() => onReplayDate(date.id)}><span>♡ Rendez-vous · {CHARACTERS.find((character) => character.id === date.character)?.name}</span><strong>{date.title}</strong><small>Revoir sans gain</small></button>)}
        {dateMemories.filter((date) => game.flags.includes(`date-intimate:${date.id}`)).map((date) => <button key={`${date.id}-intimacy`} onClick={() => onReplayDateIntimacy(date.id)}><span>🔥 Souvenir intime · {CHARACTERS.find((character) => character.id === date.character)?.name}</span><strong>{date.title}</strong><small>Revoir selon le niveau d’intimité actuel</small></button>)}
        {groupDateMemories.map((date) => <button key={date.id} onClick={() => onReplayGroupDate(date.id)}><span>♡ Rendez-vous à trois · {date.characters.map((id) => CHARACTERS.find((character) => character.id === id)?.name).join(" & ")}</span><strong>{date.title}</strong><small>Revoir sans gain</small></button>)}
        {groupDateMemories.filter((date) => game.flags.includes(`group-date-intimate:${date.id}`)).map((date) => <button key={`${date.id}-intimacy`} onClick={() => onReplayGroupDateIntimacy(date.id)}><span>🔥 Souvenir à trois · {date.characters.map((id) => CHARACTERS.find((character) => character.id === id)?.name).join(" & ")}</span><strong>{date.title}</strong><small>Revoir les trois routes selon votre sexe et le niveau d’intimité actuel</small></button>)}
        {!game.history.length && !socialMemories.length && !secretMemories.length && !worldMemories.length && !dateMemories.length && !groupDateMemories.length && <p>Aucune scène majeure n’est encore mémorisée.</p>}
      </div>
      <div className="journal-section-title story-section-title"><div><h2>Histoire principale</h2><p>Les objectifs n’expirent jamais. Les jalons cochés indiquent exactement ce qui a déjà été découvert.</p></div><strong>{mainProgress} / {MAIN_STORY.length}</strong></div>
      {MAIN_STORY.map((act, index) => {
        const done = index < mainProgress;
        const current = !storyComplete && index === mainProgress;
        const revealed = done || current;
        const milestonesDone = act.requiredScenes.filter((id) => discovered.has(id)).length;
        return <article className={`story-timeline ${done ? "done" : ""} ${current ? "current" : ""}`} key={act.id}>
          <span>{act.number}</span>
          <div>
            <strong>{revealed ? act.title : "Acte à découvrir"}</strong>
            {revealed ? <><div className="story-act-objective"><b>Objectif</b><p>{act.objective}</p></div>
            <small>{act.detail}</small>
            <div className="story-milestones">
              {act.requiredScenes.length ? act.requiredScenes.map((id) => { const milestone = storyMilestone(id); const achieved = discovered.has(id); return <div className={achieved ? "achieved" : ""} key={id}><i>{achieved ? "✓" : "◇"}</i><span><b>{milestone.title}</b><small>{milestone.place}</small></span></div>; }) : <div className="achieved"><i>✓</i><span><b>Passage dans cette chronologie</b><small>Le prologue ouvre automatiquement ce premier acte.</small></span></div>}
            </div></> : <small>Poursuivez l’acte actuel pour révéler cet objectif sans dévoiler les secrets qui le précèdent.</small>}
          </div>
          <b>{done ? "Accompli" : current ? `${milestonesDone}/${act.requiredScenes.length} jalons` : "À découvrir"}</b>
        </article>;
      })}
    </div><aside className="log-column"><h2>Dernières traces</h2>{game.journal.slice().reverse().slice(0, 14).map((entry, index) => <p key={`${entry}-${index}`}><span>✦</span>{entry}</p>)}</aside></div>
  </section>;
}

function AssetsView({ game, presentCharacters, onShop, onGive, onBuyProperty, onSellProperty, onDisplay, onResident }: { game: GameState; presentCharacters: CharacterData[]; onShop: () => void; onGive: (character: string, gift: string) => void; onBuyProperty: (property: string) => void; onSellProperty: () => void; onDisplay: (slot: number, item: string) => void; onResident: (character: string) => void }) {
  const [section, setSection] = useState<"logis" | "inventaire">("logis");
  const ownedProperty = propertyById(game.housing.propertyId);
  const ownedDisplayItems = DISPLAY_ITEMS.filter((item) => (game.inventory[item.id] || 0) > 0);
  const unlockedCities = LOCATIONS.filter((location) => ["algratal", "forthaven", "miraldas", "akuhn"].includes(location.id) && (game.day >= location.unlockDay || game.settings.unlockAll));
  return <section className="content-view assets-view">
    <header className="content-header"><div><p className="eyebrow">Inventaire & patrimoine</p><h1>Biens</h1><p>Vos objets voyagent avec vous. Votre logis, lui, devient un véritable lieu de la carte et de vos relations.</p></div><button className="coins-button" onClick={onShop}>◈ {game.coins} · Marché</button></header>
    <div className="assets-tabs"><button className={section === "logis" ? "active" : ""} onClick={() => setSection("logis")}>⌂ Logis</button><button className={section === "inventaire" ? "active" : ""} onClick={() => setSection("inventaire")}>◇ Inventaire</button></div>
    {section === "inventaire" && <>
      <div className="gift-steps"><span><b>1</b>Acheter ou découvrir</span><span><b>2</b>Exposer au logis</span><span><b>3</b>Offrir sur place</span></div>
      {ownedDisplayItems.length ? <div className="inventory-grid">{ownedDisplayItems.map((item) => <article key={item.id}><span>{item.icon}</span><div><h3>{item.name}</h3><p>{item.description}</p><small>Possédé : {game.inventory[item.id]} · {item.source === "story" ? "Souvenir personnel" : item.source === "date" ? "Cadeau de visite" : "Objet du marché"}</small>{GIFTS.some((gift) => gift.id === item.id) && <div className="gift-recipient-row">{presentCharacters.length ? presentCharacters.map((character) => <button key={character.id} onClick={() => onGive(character.id, item.id)}>Offrir à {character.name}</button>) : <em>Personne n’est avec vous dans ce sous-lieu.</em>}</div>}</div></article>)}</div> : <div className="empty-view"><span>◇</span><h2>Votre inventaire est vide</h2><p>Les marchés, histoires personnelles et visites au logis y ajouteront des objets.</p><button className="primary-action" onClick={onShop}>Voir le marché</button></div>}
    </>}
    {section === "logis" && <div className="housing-layout">
      {ownedProperty ? <>
        <article className="owned-home-card" style={{ backgroundImage: `linear-gradient(180deg,rgba(6,7,14,.08),rgba(6,7,14,.94)),url(${ownedProperty.background})` }}><p className="eyebrow">Votre adresse à {LOCATIONS.find((entry) => entry.id === ownedProperty.location)?.name}</p><h2>{ownedProperty.name}</h2><p>{ownedProperty.description}</p><div><span>Gamme {ownedProperty.tier} · {ownedProperty.category}</span><span>Valeur de reprise : {housingSaleValue(game.housing)} ◈</span></div><button className="secondary-action" onClick={onSellProperty}>Vendre ce logis</button></article>
        <section className="housing-panel"><header><div><p className="eyebrow">Vitrine personnelle</p><h2>Trois objets exposés</h2></div><span>3 emplacements</span></header><p>Chaque visiteur commentera ce que vous avez choisi de montrer, surtout lorsqu’un objet raconte sa propre histoire.</p><div className="display-slots">{[0, 1, 2].map((slot) => { const item = displayItemById(game.housing.displayed[slot]); return <label key={slot}><span>{item?.icon || "◇"}</span><strong>{item?.name || `Emplacement ${slot + 1}`}</strong><select value={game.housing.displayed[slot] || ""} onChange={(event) => onDisplay(slot, event.target.value)}><option value="">Ne rien exposer</option>{ownedDisplayItems.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>; })}</div></section>
        <section className="housing-panel">
          <header><div><p className="eyebrow">Vie commune</p><h2>Habitant·es du logis</h2></div><span>{game.housing.residents.length} résident·es</span></header>
          <p>Étape relationnelle 3 et confiance 24 requises. Gérez ici la cohabitation ; les visites et rendez-vous se planifient désormais depuis Relations → Rendez-vous.</p>
          <div className="resident-grid">{CHARACTERS.map((character) => {
            const relation = game.relationships[character.id];
            const resident = game.housing.residents.includes(character.id);
            const eligible = game.settings.unlockAll || (relation.stage >= 3 && relation.trust >= 24);
            return <article key={character.id} className={resident ? "resident" : ""}><img src={character.portrait} alt="" /><div><strong>{character.name}</strong><small>{resident ? "Vit dans ce logis" : eligible ? "Invitation possible" : `Étape ${relation.stage}/3 · confiance ${relation.trust}/24`}</small></div><button disabled={!eligible} onClick={() => onResident(character.id)}>{resident ? "Libérer la chambre" : "Inviter à vivre ici"}</button></article>;
          })}</div>
        </section>
      </> : <div className="housing-empty"><span>⌂</span><h2>Vous n’avez pas encore de logis</h2><p>Achetez une propriété dans une ville accessible. Vous pourrez ensuite l’habiter, l’exposer sur la carte et y inviter vos proches.</p></div>}
      <section className="housing-panel housing-market"><header><div><p className="eyebrow">Agences de Sylvinia</p><h2>{ownedProperty ? "Changer de logis" : "Acheter un logis"}</h2></div><span>{unlockedCities.length} ville{unlockedCities.length > 1 ? "s" : ""} accessible{unlockedCities.length > 1 ? "s" : ""}</span></header>{unlockedCities.map((city) => { const discount = housingDiscount(city.id, game.relationships); const patron = CHARACTERS.find((entry) => entry.id === discount.character); return <div className="housing-city" key={city.id}><div className="housing-city-title"><div><h3>{city.name}</h3><small>{patron && discount.percent ? `Appui de ${patron.name} · remise ${discount.percent}%` : "Tarifs publics"}</small></div></div><div className="property-grid">{HOUSING_PROPERTIES.filter((entry) => entry.location === city.id).map((property) => { const price = discountedPropertyPrice(property, game.relationships); const credit = housingSaleValue(game.housing); const balance = price - credit; const current = property.id === ownedProperty?.id; return <article key={property.id} className={current ? "current" : ""} style={{ backgroundImage: `linear-gradient(180deg,rgba(8,8,16,.16),rgba(8,8,16,.96)),url(${property.background})` }}><span>Gamme {property.tier}</span><h4>{property.name}</h4><p>{property.description}</p><div><strong>{price} ◈</strong>{discount.percent > 0 && <del>{property.price} ◈</del>}</div>{current ? <button disabled>Votre logis</button> : <button disabled={balance > game.coins} onClick={() => onBuyProperty(property.id)}>{ownedProperty ? balance > 0 ? `Échanger · ${balance} ◈` : `Échanger · +${Math.abs(balance)} ◈` : `Acheter · ${price} ◈`}</button>}</article>; })}</div></div>; })}</section>
    </div>}
  </section>;
}

function CodexView({ game }: { game: GameState }) {
  const discovered = new Set([...game.history, ...game.flags, ...game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  return <section className="content-view"><header className="content-header"><div><p className="eyebrow">Archives personnelles</p><h1>Codex</h1><p>Les entrées se complètent en voyageant, en rencontrant les personnages et en vivant leurs scènes.</p></div><span>{game.codex.length} entrées</span></header><div className="codex-layout"><div><h2>Personnages rencontrables</h2><div className="codex-characters">{CHARACTERS.map((character) => { const known = game.relationships[character.id].met || game.settings.unlockAll; return <article key={character.id} className={!known ? "unknown" : ""}><img src={character.portrait} alt="" /><div><span>{known ? character.name : "Entrée verrouillée"}</span><small>{known ? characterDescriptor(character) : "Rencontrez cette personne"}</small>{known && <p>{character.bio}</p>}</div></article>; })}</div><h2>Figures de la chronique</h2><div className="codex-characters supporting-figures">{SUPPORTING_FIGURES.map((figure) => { const known = game.settings.unlockAll || figure.unlockScenes.some((scene) => discovered.has(scene)); return <article key={figure.id} className={!known ? "unknown" : ""}><img src={figure.portrait} alt="" /><div><span>{known ? figure.name : "Entrée verrouillée"}</span><small>{known ? `${figure.role} · ${figure.place}` : "Progressez dans l’histoire principale"}</small>{known && <p>{figure.bio}</p>}</div></article>; })}</div></div><div><h2>Lieux découverts</h2>{LOCATIONS.map((location) => { const known = game.visitedLocations.includes(location.id) || game.settings.unlockAll; return <article className={`location-codex ${!known ? "unknown" : ""}`} key={location.id}><img src={location.image} alt="" /><div><strong>{known ? location.name : "Terre inconnue"}</strong><small>{known ? location.subtitle : game.day >= location.unlockDay ? "Route accessible · lieu non visité" : `Route stable au jour ${location.unlockDay}`}</small>{known && <p>{location.description}</p>}</div></article>; })}<h2>Scènes mémorisées</h2><div className="memory-list">{game.history.length ? game.history.map((id) => <span key={id}>✦ {ROUTE_SCENES.find((scene) => scene.id === id)?.title || campaignSceneById(id)?.title || id}</span>) : <p>Aucune scène majeure consignée.</p>}</div></div></div></section>;
}

function OptionsView({ game, updateGame, slotInfo, saveSlot, loadSlot, exportSave, importSave, returnTitle }: { game: GameState; updateGame: (fn: (game: GameState) => GameState) => void; slotInfo: Record<number, string>; saveSlot: (slot: number) => void; loadSlot: (slot: number) => void; exportSave: () => void; importSave: (event: ChangeEvent<HTMLInputElement>) => void; returnTitle: () => void }) {
  const [explicitWarning, setExplicitWarning] = useState(false);
  const chooseIntimacy = (intimacy: Intimacy) => {
    if (intimacy === "explicite" && game.player.intimacy !== "explicite") {
      setExplicitWarning(true);
      return;
    }
    updateGame((current) => ({ ...current, player: { ...current.player, intimacy } }));
  };
  return <section className="content-view"><header className="content-header"><div><p className="eyebrow">Chronique & accessibilité</p><h1>Options</h1><p>La progression est automatiquement conservée sur cet appareil.</p></div><div className="options-header-actions"><button className="secondary-action" onClick={returnTitle}>Retour au titre</button><a className="return-story-button" href="../index.html">Retour au Mode Histoire</a></div></header><div className="options-layout"><div className="option-panel"><h2>Lecture & ambiance</h2><label className="range-option"><span>Taille du texte <b>{game.settings.fontScale}%</b></span><input type="range" min={90} max={125} step={5} value={game.settings.fontScale} onChange={(event) => updateGame((current) => ({ ...current, settings: { ...current.settings, fontScale: Number(event.target.value) } }))} /></label><Toggle label="Musique" detail="Thèmes originaux du Visual Novel." active={game.settings.music} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, music: !current.settings.music } }))} /><label className="range-option"><span>Volume <b>{game.settings.volume}%</b></span><input type="range" min={0} max={80} step={4} value={game.settings.volume} onChange={(event) => updateGame((current) => ({ ...current, settings: { ...current.settings, volume: Number(event.target.value) } }))} /></label><Toggle label="Réduire les animations" detail="Désactive les mouvements décoratifs." active={game.settings.reducedMotion} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, reducedMotion: !current.settings.reducedMotion } }))} /><Toggle label="Afficher l’impact des choix" detail="Révèle les gains avant de répondre." active={game.settings.showImpact} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, showImpact: !current.settings.showImpact } }))} /><label className="select-option"><span>Sexe du protagoniste</span><select value={game.player.sex} onChange={(event) => updateGame((current) => ({ ...current, player: { ...current.player, sex: event.target.value as PlayerSex } }))}><option value="femme">Femme</option><option value="intersexe">Intersexe</option><option value="homme">Homme</option></select></label><label className="select-option"><span>Intimité</span><select value={game.player.intimacy} onChange={(event) => chooseIntimacy(event.target.value as Intimacy)}><option value="tendre">Tendre</option><option value="suggestif">Suggestif</option><option value="explicite">Explicite · sans coupure</option><option value="ellipse">Fondu au noir</option></select></label><p className="hint">Ce réglage peut être modifié à tout moment et adapte la narration des scènes concernées.</p></div><div className="option-panel"><h2>Sauvegardes manuelles</h2>{[1, 2, 3].map((slot) => <div className="save-slot" key={slot}><div><strong>Emplacement {slot}</strong><small>{slotInfo[slot] || "Vide"}</small></div><button onClick={() => saveSlot(slot)}>Sauver</button><button disabled={!slotInfo[slot]} onClick={() => loadSlot(slot)}>Charger</button></div>)}<div className="save-tools"><button onClick={exportSave}>Exporter en fichier</button><label>Importer un fichier<input type="file" accept="application/json,.json" onChange={importSave} /></label></div></div><DeveloperPanel game={game} updateGame={updateGame} /><footer className="option-panel credits-panel"><h2>Chronique parallèle & crédits</h2><p>Univers, personnages et continuité d’après <em>Chroniques de Sylvinia</em>, le <a href="https://github.com/Val1615/SylviniaVN" target="_blank" rel="noreferrer">Visual Novel Sylvinia</a> et <a href="https://github.com/Val1615/Les-mondes-du-Chroniqueur" target="_blank" rel="noreferrer">Les mondes du Chroniqueur</a>. Illustrations, sprites et thèmes musicaux adaptés des ressources autorisées de ces projets.</p></footer></div>{explicitWarning && <ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { updateGame((current) => ({ ...current, player: { ...current.player, intimacy: "explicite" } })); setExplicitWarning(false); }} />}</section>;
}

function Toggle({ label, detail, active, onClick }: { label: string; detail: string; active: boolean; onClick: () => void }) {
  return <button className="toggle-option" onClick={onClick}><div><strong>{label}</strong><small>{detail}</small></div><i className={active ? "active" : ""}><em /></i></button>;
}

function ExplicitModeWarning({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return <div className="modal-backdrop explicit-warning-backdrop" role="presentation">
    <section className="explicit-warning-modal" role="dialog" aria-modal="true" aria-labelledby="explicit-warning-title">
      <span className="explicit-warning-mark">18+</span>
      <p className="eyebrow">Réglage d’intimité</p>
      <h2 id="explicit-warning-title">Activer le mode explicite ?</h2>
      <p>Ce mode contient des scènes sexuelles décrites de manière détaillée. Il est strictement réservé à un public majeur.</p>
      <div><button className="primary-action" onClick={onConfirm}>J’ai 18 ans ou plus · Activer</button><button className="secondary-action" onClick={onCancel}>Annuler</button></div>
    </section>
  </div>;
}

function DeveloperPanel({ game, updateGame }: { game: GameState; updateGame: (fn: (game: GameState) => GameState) => void }) {
  if (!game.settings.developer) return <div className="option-panel dev-panel locked"><h2>Mode développeur</h2><p>Accès rapide aux jours, caractéristiques, routes et ressources. Raccourci : Ctrl + Maj + D.</p><button className="secondary-action" onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, developer: true } }))}>Activer le mode développeur</button></div>;
  return <div className="option-panel dev-panel"><div className="dev-title"><div><span>DEV</span><h2>Mode développeur</h2></div><button onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, developer: false } }))}>Désactiver</button></div><div className="dev-row"><label>Jour<input type="number" min={1} value={game.day} onChange={(event) => updateGame((current) => ({ ...current, day: Math.max(1, Number(event.target.value) || 1) }))} /></label><label>Période<select value={game.period} onChange={(event) => updateGame((current) => ({ ...current, period: Number(event.target.value) }))}>{PERIODS.map((period, index) => <option value={index} key={period.id}>{period.label}</option>)}</select></label><button onClick={() => updateGame((current) => ({ ...current, day: current.day + 7, period: 0 }))}>+7 jours</button><button onClick={() => updateGame((current) => ({ ...current, coins: current.coins + 100 }))}>+100 pièces</button><button onClick={() => updateGame((current) => ({ ...current, confluence: 100 }))}>Confluence 100</button><button onClick={() => updateGame((current) => ({ ...current, ambientHistory: emptyAmbientHistory(), sharedHistory: [] }))}>Réinitialiser les conversations</button></div><div className="dev-stats">{(Object.keys(game.stats) as StatKey[]).map((stat) => <button key={stat} onClick={() => updateGame((current) => ({ ...current, stats: { ...current.stats, [stat]: current.stats[stat] + 1 } }))}>{STAT_LABELS[stat]} <b>{game.stats[stat]}</b> +</button>)}</div><div className="dev-toggles"><Toggle label="Aucun coût de temps" detail="Voyages et scènes ne font plus avancer l’heure." active={game.settings.noTimeCost} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, noTimeCost: !current.settings.noTimeCost } }))} /><Toggle label="Tout déverrouiller" detail="Ignore jours, seuils et routes fermées." active={game.settings.unlockAll} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, unlockAll: !current.settings.unlockAll } }))} /></div><h3>Fil principal</h3><div className="dev-row"><button onClick={() => updateGame((current) => ({ ...current, day: Math.max(8, current.day), location: "akuhn", spot: "akuhn-throne-room", period: 0 }))}>Aller à l’audience d’Amanea</button><button onClick={() => updateGame((current) => ({ ...current, history: unique([...current.history, "iriana-0", "draven-0", "amanea-0", "valurn-2", "amanea-3", "iriana-3", "amanea-4", "draven-4", "bellirith-3"]), flags: unique([...current.flags, "social:medig-window", "social:amanea-family-truth", "main-story-complete"]), relationships: { ...current.relationships, iriana: { ...current.relationships.iriana, stage: 5, met: true, affection: 60, trust: 70 }, valurn: { ...current.relationships.valurn, stage: 5, met: true, affection: 60, trust: 70 }, bellirith: { ...current.relationships.bellirith, stage: 5, met: true, affection: 60, trust: 70 }, amanea: { ...current.relationships.amanea, stage: 5, met: true, affection: 60, trust: 70, desire: 45 }, draven: { ...current.relationships.draven, stage: 5, met: true, affection: 40, trust: 75, desire: 0 } } }))}>Accomplir l’histoire</button></div><h3>Étapes relationnelles</h3><div className="dev-routes">{CHARACTERS.map((character) => <label key={character.id}><span>{character.name}</span><select value={game.relationships[character.id].stage} onChange={(event) => updateGame((current) => ({ ...current, relationships: { ...current.relationships, [character.id]: { ...current.relationships[character.id], stage: Number(event.target.value), met: true, affection: Math.max(current.relationships[character.id].affection, Number(event.target.value) * 10), trust: Math.max(current.relationships[character.id].trust, Number(event.target.value) * 10) } } }))}>{[0, 1, 2, 3, 4, 5].map((stage) => <option key={stage} value={stage}>{stage} · {STAGE_LABELS[stage]}</option>)}</select></label>)}</div></div>;
}

type IntimacyStep = "opening" | "approach-choice" | "approach-lines" | "attunement-choice" | "attunement-lines" | "attunement-result" | "direction-choice" | "direction-lines" | "ending" | "done";

function InteractiveIntimacyModal({ modal, game, onFinish, onStop }: { modal: IntimacyModalState; game: GameState; onFinish: (memory: string) => void; onStop: () => void }) {
  const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
  const date = modal.dateId ? DATE_SCENES.find((entry) => entry.id === modal.dateId) : undefined;
  const homeProperty = modal.home ? propertyById(game.housing.propertyId) : undefined;
  const homeItems = modal.home ? game.housing.displayed.map((id) => displayItemById(id)).filter((item): item is NonNullable<ReturnType<typeof displayItemById>> => Boolean(item)) : [];
  const profile = INTIMACY_PROFILES[character.id];
  const intimacyGame = INTIMACY_GAMES[character.id];
  const [step, setStep] = useState<IntimacyStep>("opening");
  const [lines, setLines] = useState<DialogueLine[]>(() => homeProperty ? homeIntimacyOpening(character.id, homeProperty, homeItems) : intimacyOpening(character.id, date));
  const [lineIndex, setLineIndex] = useState(0);
  const [approach, setApproach] = useState<IntimacyChoice | null>(null);
  const [direction, setDirection] = useState<IntimacyDirectionChoice | null>(null);
  const [directionSequence, setDirectionSequence] = useState<DialogueLine[][]>([]);
  const [directionChapter, setDirectionChapter] = useState(0);
  const [attunementBeat, setAttunementBeat] = useState(0);
  const [attunementScore, setAttunementScore] = useState(0);
  const [approachChoices] = useState(() => shuffledChoices(modal.home ? HOME_INTIMACY_APPROACHES[character.id] : profile.approaches, `${modal.character}:${modal.home ? "home" : modal.dateId || "route"}:approaches:${game.player.name}`));
  const [directionChoices] = useState(() => shuffledChoices(modal.home ? homeIntimacyRoutes(character.id, game.player.sex) : intimacyDirections(character.id, game.player.sex), `${modal.character}:${game.player.sex}:${modal.home ? "home" : modal.dateId || "route"}:directions:${game.player.name}`));
  const currentLine = lines[lineIndex];
  const characterSpeaking = currentLine?.speaker === character.name;
  const spriteMood = characterSpeaking
    ? (currentLine.mood || moodForCharacter(character.id, `intimacy-${character.id}-${step}-${lineIndex}`, character.defaultMood))
    : character.defaultMood;

  function beginSegment(nextStep: IntimacyStep, nextLines: DialogueLine[]) {
    setStep(nextStep);
    setLines(nextLines);
    setLineIndex(0);
  }

  function advance() {
    if (lineIndex < lines.length - 1) {
      setLineIndex((index) => index + 1);
      return;
    }
    if (step === "opening") setStep("approach-choice");
    else if (step === "approach-lines") setStep(intimacyGame ? "attunement-choice" : "direction-choice");
    else if (step === "attunement-lines") {
      if (attunementBeat < (intimacyGame?.beats.length || 0) - 1) {
        setAttunementBeat((beat) => beat + 1);
        setStep("attunement-choice");
      } else beginSegment("attunement-result", intimacyGameResult(character.id, attunementScore));
    }
    else if (step === "attunement-result") setStep("direction-choice");
    else if (step === "direction-lines") {
      if (directionChapter < directionSequence.length - 1) {
        const nextChapter = directionChapter + 1;
        setDirectionChapter(nextChapter);
        beginSegment("direction-lines", directionSequence[nextChapter]);
      } else beginSegment("ending", homeProperty ? homeIntimacyEnding(character.id, homeProperty) : intimacyEnding(character.id, date));
    }
    else if (step === "ending") setStep("done");
  }

  function chooseApproach(choice: IntimacyChoice) {
    setApproach(choice);
    beginSegment("approach-lines", choice.lines);
  }

  function chooseDirection(choice: IntimacyDirectionChoice) {
    setDirection(choice);
    const chapters = modal.home ? choice.chapters[game.player.intimacy] : directionChapters(character.id, choice.id, game.player.intimacy, game.player.sex);
    setDirectionSequence(chapters);
    setDirectionChapter(0);
    if (chapters.length) beginSegment("direction-lines", chapters[0]);
    else beginSegment("ending", homeProperty ? homeIntimacyEnding(character.id, homeProperty) : intimacyEnding(character.id, date));
  }

  function chooseAttunement(option: IntimacyGameOption) {
    setAttunementScore((score) => score + option.score);
    beginSegment("attunement-lines", option.lines);
  }

  const isChoice = step === "approach-choice" || step === "attunement-choice" || step === "direction-choice";
  const isDone = step === "done";
  const background = backgroundUrl(modal.background || "/assets/backgrounds/bedroom.webp");
  const modeLabel = game.player.intimacy === "ellipse" ? "Fondu au noir" : game.player.intimacy === "explicite" ? "Explicite · sans coupure" : game.player.intimacy;

  return <section className="interactive-intimacy" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.18), rgba(5,6,12,.82)), url(${background})` }}>
    <div className="scene-top intimacy-top"><div><p className="eyebrow">{modal.replay ? "Souvenir intime · aucun gain" : `${modal.home ? "Intimité au logis" : "Scène intime"} · ${modeLabel}`}</p><h2>{character.name} · {modal.home ? homeProperty?.name || "Chez vous" : date?.title || "Derrière la dernière porte"}</h2></div><button onClick={onStop}>{modal.replay ? "Quitter le souvenir" : "Interrompre ici"}</button></div>
    <div className={`intimacy-sprite ${characterSpeaking ? "active" : "quiet"}`}><img src={`/assets/sprites/${character.id}/${spriteMood}.webp`} alt={character.name} /></div>
    <div className="dialogue-gradient" />
    {!isChoice && !isDone && currentLine && <button className={`dialogue-box intimacy-dialogue ${currentLine.speaker === "Narration" ? "narration" : ""}`} onClick={advance}>
      <span className="speaker">{replacePlayer(currentLine.speaker, game.player)}</span>
      <p>{replacePlayer(currentLine.text, game.player)}</p>
      <small>{step === "direction-lines" && directionSequence.length > 1 ? `Séquence ${directionChapter + 1} / ${directionSequence.length} · ` : ""}{lineIndex + 1} / {lines.length} · Cliquer pour continuer</small>
    </button>}
    {step === "approach-choice" && <div className="choice-box intimacy-choices"><p className="choice-question">Comment entrer dans ce moment ?</p>{approachChoices.map((choice, index) => <button key={choice.id} onClick={() => chooseApproach(choice)}><span className="choice-number">{index + 1}</span><div><strong>{choice.text}</strong></div></button>)}<button className="intimacy-stop-choice" onClick={onStop}>Rester simplement ensemble et terminer la soirée ici</button></div>}
    {step === "attunement-choice" && intimacyGame && <div className="choice-box intimacy-choices intimacy-game-box"><div className="intimacy-game-heading"><div><span>Moment partagé · {attunementBeat + 1} / {intimacyGame.beats.length}</span><h3>{intimacyGame.title}</h3></div><div className="intimacy-game-progress">{intimacyGame.beats.map((_, index) => <i key={index} className={index < attunementBeat ? "done" : index === attunementBeat ? "current" : ""} />)}</div></div>{attunementBeat === 0 && <p className="intimacy-game-instruction">{intimacyGame.instruction}</p>}<p className="choice-question">{intimacyGame.beats[attunementBeat].prompt}</p><small className="intimacy-game-detail">{intimacyGame.beats[attunementBeat].detail}</small>{shuffledChoices(intimacyGame.beats[attunementBeat].options, `${character.id}:${modal.dateId || "route"}:beat:${attunementBeat}:${game.player.name}`).map((option, index) => <button key={option.id} onClick={() => chooseAttunement(option)}><span className="choice-number">{index + 1}</span><div><strong>{option.label}</strong></div></button>)}</div>}
    {step === "direction-choice" && <div className="choice-box intimacy-choices"><p className="choice-question">{approach ? `Après « ${approach.text.toLocaleLowerCase("fr")} »…` : "Comment poursuivre ?"}</p><small className="intimacy-route-note">Trois routes écrites pour {character.name} et pour le corps choisi de votre protagoniste. Chacune se développe en huit séquences détaillées{modal.home ? ", entièrement propres au logement" : ""}.</small>{directionChoices.map((choice, index) => <button key={choice.id} onClick={() => chooseDirection(choice)}><span className="choice-number">{index + 1}</span><div><strong>{choice.text}</strong>{"detail" in choice && choice.detail && <small>{choice.detail}</small>}</div></button>)}<button className="intimacy-stop-choice" onClick={onStop}>Ralentir, rester enlacé·es et clore la scène ici</button></div>}
    {isDone && <div className="intimacy-complete"><p className="eyebrow">{modal.replay ? "Fin du souvenir" : "La nuit se poursuit"}</p><h3>{direction ? direction.text : "Un moment partagé"}</h3><p>{modal.replay ? "Vous pouvez quitter ce souvenir sans modifier la chronique." : "La manière dont vous avez joué, répondu et pris l’initiative appartient désormais à votre histoire commune."}</p><button className="primary-action" onClick={() => onFinish(`${approach?.id || "approach"}|accord-${attunementScore}|${direction?.id || "direction"}`)}>{modal.replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
  </section>;
}

type GroupIntimacyStep = "opening" | "attunement-choice" | "attunement-lines" | "attunement-result" | "direction-choice" | "direction-lines" | "ending" | "done";

function InteractiveGroupIntimacyModal({ modal, game, onFinish, onStop }: { modal: GroupIntimacyModalState; game: GameState; onFinish: (memory: string) => void; onStop: () => void }) {
  const date = GROUP_DATES.find((entry) => entry.id === modal.groupDateId)!;
  const first = CHARACTERS.find((entry) => entry.id === date.characters[0])!;
  const second = CHARACTERS.find((entry) => entry.id === date.characters[1])!;
  const intimacyGame = GROUP_INTIMACY_GAMES[date.id];
  const [step, setStep] = useState<GroupIntimacyStep>("opening");
  const [lines, setLines] = useState<DialogueLine[]>(() => groupIntimacyOpening(date));
  const [lineIndex, setLineIndex] = useState(0);
  const [direction, setDirection] = useState<GroupIntimacyRoute | null>(null);
  const [directionSequence, setDirectionSequence] = useState<DialogueLine[][]>([]);
  const [directionChapter, setDirectionChapter] = useState(0);
  const [attunementBeat, setAttunementBeat] = useState(0);
  const [attunementScore, setAttunementScore] = useState(0);
  const [directionChoices] = useState(() => shuffledChoices(groupIntimacyRoutes(date.id, game.player.sex), `${date.id}:${game.player.sex}:directions:${game.player.name}`));
  const currentLine = lines[lineIndex];
  const firstSpeaking = currentLine?.speaker === first.name;
  const secondSpeaking = currentLine?.speaker === second.name;
  const firstMood = firstSpeaking ? (currentLine.mood || moodForCharacter(first.id, `${date.id}-${step}-${lineIndex}`, first.defaultMood)) : first.defaultMood;
  const secondMood = secondSpeaking ? (currentLine.mood || moodForCharacter(second.id, `${date.id}-${step}-${lineIndex}`, second.defaultMood)) : second.defaultMood;

  function beginSegment(nextStep: GroupIntimacyStep, nextLines: DialogueLine[]) {
    setStep(nextStep);
    setLines(nextLines);
    setLineIndex(0);
  }

  function advance() {
    if (lineIndex < lines.length - 1) {
      setLineIndex((index) => index + 1);
      return;
    }
    if (step === "opening") setStep("attunement-choice");
    else if (step === "attunement-lines") {
      if (attunementBeat < intimacyGame.beats.length - 1) {
        setAttunementBeat((beat) => beat + 1);
        setStep("attunement-choice");
      } else beginSegment("attunement-result", groupIntimacyGameResult(date.id, attunementScore));
    } else if (step === "attunement-result") setStep("direction-choice");
    else if (step === "direction-lines") {
      if (directionChapter < directionSequence.length - 1) {
        const nextChapter = directionChapter + 1;
        setDirectionChapter(nextChapter);
        beginSegment("direction-lines", directionSequence[nextChapter]);
      } else beginSegment("ending", groupIntimacyEnding(date));
    } else if (step === "ending") setStep("done");
  }

  function chooseAttunement(option: IntimacyGameOption) {
    setAttunementScore((score) => score + option.score);
    beginSegment("attunement-lines", option.lines);
  }

  function chooseDirection(choice: GroupIntimacyRoute) {
    setDirection(choice);
    const sequence = choice.chapters[game.player.intimacy];
    setDirectionSequence(sequence);
    setDirectionChapter(0);
    beginSegment("direction-lines", sequence[0]);
  }

  const isChoice = step === "attunement-choice" || step === "direction-choice";
  const isDone = step === "done";
  const background = backgroundUrl(modal.background || spotById(date.spot)?.background || "/assets/backgrounds/bedroom.webp");
  const modeLabel = game.player.intimacy === "ellipse" ? "Fondu au noir" : game.player.intimacy === "explicite" ? "Explicite · sans coupure" : game.player.intimacy;

  return <section className="interactive-intimacy group-interactive-intimacy" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.16), rgba(5,6,12,.84)), url(${background})` }}>
    <div className="scene-top intimacy-top"><div><p className="eyebrow">{modal.replay ? "Souvenir à trois · aucun gain" : `Scène intime à trois · ${modeLabel}`}</p><h2>{first.name} · {second.name} · {date.title}</h2></div><button onClick={onStop}>{modal.replay ? "Quitter le souvenir" : "Interrompre ici"}</button></div>
    <div className="group-intimacy-sprites" aria-hidden="true">
      <div className={`group-intimacy-sprite first ${firstSpeaking ? "active" : "quiet"}`}><img src={`/assets/sprites/${first.id}/${firstMood}.webp`} alt="" /></div>
      <div className={`group-intimacy-sprite second ${secondSpeaking ? "active" : "quiet"}`}><img src={`/assets/sprites/${second.id}/${secondMood}.webp`} alt="" /></div>
    </div>
    <div className="dialogue-gradient" />
    {!isChoice && !isDone && currentLine && <button className={`dialogue-box intimacy-dialogue ${currentLine.speaker === "Narration" ? "narration" : ""}`} onClick={advance}>
      <span className="speaker">{replacePlayer(currentLine.speaker, game.player)}</span>
      <p>{replacePlayer(currentLine.text, game.player)}</p>
      <small>{step === "direction-lines" ? `Séquence ${directionChapter + 1} / ${directionSequence.length} · ` : ""}{lineIndex + 1} / {lines.length} · Cliquer pour continuer</small>
    </button>}
    {step === "attunement-choice" && <div className="choice-box intimacy-choices intimacy-game-box"><div className="intimacy-game-heading"><div><span>Harmonie à trois · {attunementBeat + 1} / {intimacyGame.beats.length}</span><h3>{intimacyGame.title}</h3></div><div className="intimacy-game-progress">{intimacyGame.beats.map((_, index) => <i key={index} className={index < attunementBeat ? "done" : index === attunementBeat ? "current" : ""} />)}</div></div>{attunementBeat === 0 && <p className="intimacy-game-instruction">{intimacyGame.instruction}</p>}<p className="choice-question">{intimacyGame.beats[attunementBeat].prompt}</p><small className="intimacy-game-detail">{intimacyGame.beats[attunementBeat].detail}</small>{shuffledChoices(intimacyGame.beats[attunementBeat].options, `${date.id}:beat:${attunementBeat}:${game.player.name}`).map((option, index) => <button key={option.id} onClick={() => chooseAttunement(option)}><span className="choice-number">{index + 1}</span><div><strong>{option.label}</strong></div></button>)}<button className="intimacy-stop-choice" onClick={onStop}>Terminer la soirée dans une proximité non sexuelle</button></div>}
    {step === "direction-choice" && <div className="choice-box intimacy-choices group-direction-choices"><p className="choice-question">Quelle dynamique donner à la suite ?</p><small className="intimacy-route-note">Trois routes uniques pour {first.name}, {second.name} et le sexe choisi de votre protagoniste. Chacune comporte huit séquences détaillées et maintient les trois personnes actives.</small>{directionChoices.map((choice, index) => <button key={choice.id} onClick={() => chooseDirection(choice)}><span className="choice-number">{index + 1}</span><div><strong>{choice.text}</strong><small>{choice.detail}</small></div></button>)}<button className="intimacy-stop-choice" onClick={onStop}>Rester enlacé·es et clore la scène ici</button></div>}
    {isDone && <div className="intimacy-complete"><p className="eyebrow">{modal.replay ? "Fin du souvenir" : "Trois places sont restées entières"}</p><h3>{direction?.text || "Un moment partagé"}</h3><p>{modal.replay ? "Ce souvenir peut être quitté sans modifier la chronique." : "Le rendez-vous, le mini-jeu et la route choisie rejoignent les souvenirs communs de ces trois personnes."}</p><button className="primary-action" onClick={() => onFinish(`accord-${attunementScore}|${direction?.id || "direction"}`)}>{modal.replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
  </section>;
}

function JobGameModal({ job, state, game, onBegin, onMemoryStart, onAction, onFinish, onCancel }: { job: JobData; state: JobState; game: GameState; onBegin: () => void; onMemoryStart: () => void; onAction: (action: string) => void; onFinish: () => void; onCancel: () => void }) {
  const modalScrollRef = useRef<HTMLElement>(null);
  const complete = state.phase === "perfect" || state.phase === "success" || state.phase === "failure";
  const partialPay = Math.max(2, Math.floor(job.reward / 4));
  const perfectPay = Math.ceil(job.reward * 1.5);
  const statValue = game.stats[job.stat];
  const assisted = statValue >= 6;
  const sessionRounds = orderedJobRounds(job, state.roundOrder);
  const round = sessionRounds[state.round];
  const sessionCrates = jobCratesForSession(job, state.variant);
  const sessionPath = jobPathForSession(job, state.variant);
  let progressTotal = job.kind === "timing" ? 6 : job.kind === "packing" ? sessionCrates.length : job.kind === "path" ? sessionPath?.maxSteps || 0 : job.kind === "memory" ? 3 : sessionRounds.length;
  let progressNow = job.kind === "path" ? state.pathSteps : job.kind === "memory" ? Math.min(3, state.round + state.step / Math.max(1, memoryWaveLength(state.round, state.sequence.length))) : state.round;
  if (job.id === "forestier-service") { progressTotal = serviceCustomers(state.variant).length; progressNow = state.round; }
  if (job.id === "forestier-rooms") { progressTotal = 3; progressNow = state.round; }
  if (job.id === "algratal-petitions") { progressTotal = petitionDeck(state.variant).length; progressNow = state.round; }
  if (job.id === "tzekarun-mechanism") { progressTotal = 7; progressNow = state.assemblyStage === "build" ? state.assemblySlots.filter(Boolean).length : 4 + state.round; }
  if (job.id === "forbidden-herbs") { progressTotal = 7; progressNow = state.score; }
  if (job.id === "algratal-merchant") { progressTotal = marketCustomers(state.variant).length; progressNow = state.round; }

  useEffect(() => {
    if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
  }, [job.id, state.phase, state.round]);

  const rotateOptions = (options: JobOption[]) => shuffledChoices(options, `${job.id}:${state.variant}:${state.round}:options`);

  const assistElimination = round && assisted ? (() => {
    if (job.kind === "bargain") return [...round.options].sort((a, b) => (a.score || 0) - (b.score || 0))[0]?.id;
    return round.options.find((option) => option.id !== round.correct)?.id;
  })() : undefined;

  const renderChoiceGame = () => {
    if (!round) return null;
    return <div className={`job-challenge job-${job.kind}`}>
      <div className="job-round-title"><span>{job.kind === "bargain" ? "Client" : job.kind === "sort" ? "Dossier" : job.kind === "assembly" ? "Étape de montage" : "Observation"} {state.round + 1} / {sessionRounds.length}</span><b>{STAT_LABELS[job.stat]} {statValue}</b></div>
      <h3>{round.prompt}</h3>{round.detail && <p>{round.detail}</p>}
      {state.lastResult && <div className={`job-live-feedback ${state.lastResult}`}>{state.lastResult === "correct" ? "La décision précédente a tenu." : "La décision précédente a coûté du temps ou de la marge."}</div>}
      {assisted && <div className="job-assist">✦ Votre {STAT_LABELS[job.stat]} permet d’écarter une option manifestement faible.</div>}
      <div className="job-option-grid">{rotateOptions(round.options).map((option) => {
        const eliminated = option.id === assistElimination;
        return <button key={option.id} disabled={eliminated} className={eliminated ? "eliminated" : ""} onClick={() => onAction(option.id)}><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}{eliminated && <em>Écartée</em>}</button>;
      })}</div>
    </div>;
  };

  const renderService = () => {
    const customers = serviceCustomers(state.variant);
    const customer = customers[state.round];
    if (!customer) return null;
    const selectedItems = Object.values(state.serviceSelections).filter(Boolean).map((id) => TAVERN_MENU.find((item) => item.id === id)).filter(Boolean);
    return <div className="job-challenge service-game advanced-service">
      <div className="job-round-title"><span>Client {state.round + 1} / {customers.length}</span><b>Série : {state.combo} · Record : {state.maxCombo}</b></div>
      <div className={`job-timer ${state.serviceTimeLeft <= 6 ? "urgent" : ""}`}><div><span>Temps de commande</span><strong>{state.serviceTimeLeft}s</strong></div><i style={{ width: `${(state.serviceTimeLeft / 20) * 100}%` }} /></div>
      {state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}
      <div className="service-customer-card"><span>{customer.mode === "suggestion" ? "?" : "✎"}</span><div><small>{customer.title}</small><h3>{customer.name}</h3><p>{customer.request}</p></div></div>
      <div className="full-menu">{(["starter", "main", "drink", "dessert"] as MenuCategory[]).map((category) => <section key={category}><header><h4>{MENU_CATEGORY_LABELS[category]}</h4><small>{TAVERN_MENU.filter((item) => item.category === category).length} choix</small></header>{TAVERN_MENU.filter((item) => item.category === category).map((item) => <button key={item.id} className={state.serviceSelections[category] === item.id ? "selected" : ""} onClick={() => onAction(`service:item:${item.id}`)}><span><strong>{item.name}</strong><small>{item.description}</small></span><b>{item.price} ◈</b></button>)}</section>)}</div>
      <div className="service-tray full-tray"><div><small>Plateau en cours · les catégories non demandées restent vides</small><p>{selectedItems.length ? selectedItems.map((item) => item!.name).join(" · ") : "Aucun produit sélectionné"}</p></div><button className="text-button" disabled={!selectedItems.length} onClick={() => onAction("service:clear")}>Vider</button><button className="primary-action" disabled={!selectedItems.length} onClick={() => onAction("service:serve")}>Servir la commande</button></div>
    </div>;
  };

  const renderInspection = () => {
    const room = inspectionRoom(state.variant, state.round);
    const foundCorrect = room.hotspots.filter((hotspot) => hotspot.kind !== "decoy" && state.inspectionFound.includes(hotspot.id)).length;
    const anomalyFound = room.hotspots.filter((hotspot) => hotspot.kind === "anomaly" && state.inspectionFound.includes(hotspot.id)).length;
    return <div className="job-challenge inspection-game">
      <div className="job-round-title"><span>Chambre {state.round + 1} / 3</span><b>{foundCorrect} / {room.taskCount} tâches · {state.mistakes} erreur{state.mistakes > 1 ? "s" : ""}</b></div>
      <div className="inspection-heading"><div><h3>{room.title}</h3><p>{room.subtitle}</p></div><button disabled={state.inspectionScanUsed} onClick={() => onAction("inspection:scan")}>◉ Lever la lanterne d’inspection</button></div>
      {state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}
      <div className="inspection-layout"><aside><h4>Travail systématique</h4>{room.hotspots.filter((hotspot) => hotspot.kind === "routine").map((hotspot) => <span key={hotspot.id} className={state.inspectionFound.includes(hotspot.id) ? "done" : ""}><b>{state.inspectionFound.includes(hotspot.id) ? "✓" : "○"}</b>{hotspot.label}</span>)}<h4>Anomalies occasionnelles</h4><span className={anomalyFound >= 2 ? "done" : ""}><b>{anomalyFound >= 2 ? "✓" : "!"}</b>{anomalyFound} / 2 repérées</span><small>Les marques très discrètes signalent les zones douteuses. La lanterne les révèle nettement, mais retire la prime parfaite.</small></aside><div className={`inspection-room ${state.inspectionScanUsed ? "scan-active" : ""}`} style={{ backgroundImage: `url(${room.background})` }}>{room.hotspots.map((hotspot) => { const found = state.inspectionFound.includes(hotspot.id); const visibleMarker = hotspot.kind === "routine" || (hotspot.kind === "anomaly" && (state.inspectionScanUsed || !found)); return <button key={hotspot.id} aria-label={hotspot.kind === "routine" ? hotspot.label : "Inspecter cette zone"} title={state.inspectionScanUsed && hotspot.kind === "anomaly" ? hotspot.label : "Inspecter"} disabled={found} className={`${hotspot.kind} ${found ? "found" : ""}`} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.size}%`, aspectRatio: "1" }} onClick={() => onAction(`inspection:hotspot:${hotspot.id}`)}><span>{found ? (hotspot.kind === "decoy" ? "×" : "✓") : visibleMarker ? (hotspot.kind === "routine" ? hotspot.icon : "!") : ""}</span></button>; })}</div></div>
    </div>;
  };

  const renderPetitions = () => {
    const petitions = petitionDeck(state.variant);
    const petition = petitions[state.round];
    if (!petition) return null;
    return <div className="job-challenge petition-game">
      <div className="job-round-title"><span>Requête {state.round + 1} / {petitions.length}</span><b>{state.score} décision{state.score > 1 ? "s" : ""} tenue{state.score > 1 ? "s" : ""}</b></div>
      {state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}
      <article className="petition-paper"><header><span>✦</span><div><small>Pétition adressée au Conseil impérial</small><h3>{petition.petitioner}</h3><b>{petition.district}</b></div></header><p>{petition.text}</p><blockquote>{petition.clue}</blockquote><footer>Sceau d’arrivée · Jour {game.day} · registre {String(state.variant % 997).padStart(3, "0")}</footer></article>
      <p className="petition-rule">L’impératrice ne reçoit que les affaires majeures. Les dossiers ordinaires relèvent de votre bureau ; toute manœuvre douteuse appartient à la garde.</p>
      <div className="petition-actions">{PETITION_ACTIONS.map((decision) => <button key={decision.id} onClick={() => onAction(`petition:${decision.id}`)}><span>{decision.icon}</span><strong>{decision.label}</strong></button>)}{petition.special && <button className="whimsical" onClick={() => onAction(`petition:special:${petition.special!.id}`)}><span>✧</span><strong>{petition.special.label}</strong></button>}</div>
    </div>;
  };

  const renderAssembly = () => {
    const blueprint = assemblyBlueprint(state.variant);
    if (state.assemblyStage === "calibrate") {
      const target = blueprint.calibration[state.round];
      const width = 14 + Math.min(8, statValue);
      return <div className="job-challenge assembly-calibration"><div className="job-round-title"><span>Soupape {state.round + 1} / {blueprint.calibration.length}</span><b>{state.score} verrouillage{state.score > 1 ? "s" : ""}</b></div><h3>Mise en pression · {blueprint.name}</h3><p>Verrouillez l’aiguille dans la plage lumineuse avant que le flux ne reparte.</p>{state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}<div className="mechanical-gauge"><span>0</span><div><i className="timing-target" style={{ left: `${target - width / 2}%`, width: `${width}%` }} /><b className="timing-needle" style={{ left: `${state.timingPosition}%` }} /></div><span>100</span></div><div className="machine-pulse"><i style={{ animationDuration: `${Math.max(.6, 1.4 - state.round * .2)}s` }} /><span>Pression</span><i style={{ animationDuration: `${Math.max(.6, 1.2 - state.round * .15)}s` }} /></div><button className="primary-action timing-lock" onClick={() => onAction("assembly:lock")}>Fermer la soupape</button></div>;
    }
    const selected = ASSEMBLY_PARTS.find((part) => part.id === state.assemblySelected);
    return <div className="job-challenge assembly-game">
      <div className="job-round-title"><span>Plan {blueprint.name}</span><b>Essais de pression : {state.assemblyTests} / 3</b></div>
      <div className="blueprint-card"><span>⚙</span><div><h3>{blueprint.name}</h3><p>{blueprint.purpose}</p></div></div>
      {state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}
      <div className="assembly-workbench"><section className="assembly-slots"><h4>Bâti d’obsidienne</h4>{blueprint.slots.map((slot, index) => { const part = ASSEMBLY_PARTS.find((entry) => entry.id === state.assemblySlots[index]); return <article key={slot.type} className={part ? "filled" : ""}><header><span>{index + 1}</span><div><strong>{slot.label}</strong><small>{slot.requirement}</small></div></header>{part ? <div className="installed-part"><b style={{ transform: `rotate(${state.assemblyRotations[index]}deg)` }}>{part.icon}</b><span>{part.name}<small>Orientation : {ROTATION_LABELS[state.assemblyRotations[index]]}</small></span><button onClick={() => onAction(`assembly:remove:${index}`)}>Retirer</button></div> : <button disabled={!selected || selected.type !== slot.type} onClick={() => onAction(`assembly:place:${index}`)}>{selected?.type === slot.type ? `Installer ${selected.name}` : `Logement ${slot.type}`}</button>}</article>; })}<button className="primary-action" disabled={state.assemblySlots.some((part) => !part)} onClick={() => onAction("assembly:test")}>Mettre le mécanisme sous pression</button></section><section className="parts-bin"><h4>Pièces disponibles</h4><div>{ASSEMBLY_PARTS.map((part) => <button key={part.id} className={state.assemblySelected === part.id ? "selected" : ""} onClick={() => onAction(`assembly:select:${part.id}`)}><span>{part.icon}</span><div><strong>{part.name}</strong><small>{part.detail}</small></div><em>{part.type}</em></button>)}</div>{selected && <aside><span style={{ transform: `rotate(${state.assemblySelectedRotation}deg)` }}>{selected.icon}</span><div><strong>{selected.name}</strong><small>Orientation : {ROTATION_LABELS[state.assemblySelectedRotation]}</small></div><button onClick={() => onAction("assembly:rotate")}>↻ Tourner de 90°</button></aside>}</section></div>
    </div>;
  };

  const renderHarvest = () => {
    const nodes = harvestNodes(state.variant, state.harvestWave);
    const examined = nodes.find((node) => node.id === state.harvestExamined);
    const currentTool = HARVEST_TOOLS.find((tool) => tool.id === state.harvestTool)!;
    return <div className="job-challenge harvest-game">
      <div className="job-round-title"><span>Parcelle {state.harvestWave + 1} · Panier {state.score} / 7</span><b>{state.mistakes} illusion{state.mistakes > 1 ? "s" : ""}</b></div>
      <div className={`job-timer ${state.harvestTimeLeft <= 10 ? "urgent" : ""}`}><div><span>Fermeture de la brume</span><strong>{state.harvestTimeLeft}s</strong></div><i style={{ width: `${(state.harvestTimeLeft / 45) * 100}%` }} /></div>
      {state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}
      <div className="harvest-tools">{HARVEST_TOOLS.map((tool) => <button key={tool.id} className={state.harvestTool === tool.id ? "selected" : ""} onClick={() => onAction(`harvest:tool:${tool.id}`)}><span>{tool.icon}</span><div><strong>{tool.label}</strong><small>{tool.guide}</small></div></button>)}<button className="focus-tool" disabled={state.harvestFocus <= 0} onClick={() => onAction("harvest:focus")}><span>✦</span><div><strong>Faire le silence</strong><small>{state.harvestFocus} concentration{state.harvestFocus > 1 ? "s" : ""} restante{state.harvestFocus > 1 ? "s" : ""}</small></div></button></div>
      <div className="harvest-field" style={{ backgroundImage: "linear-gradient(180deg,rgba(10,9,20,.12),rgba(10,9,20,.58)),url(/assets/backgrounds/forbidden_forest.webp)" }}>{nodes.map((node) => { const picked = state.harvestPicked.includes(node.id); const rejected = state.harvestRejected.includes(node.id); return <button key={node.id} disabled={picked || rejected} className={`${picked ? "picked" : ""} ${rejected ? "rejected" : ""} ${state.harvestHinted === node.id ? "hinted" : ""} ${state.harvestExamined === node.id ? "examined" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => onAction(`harvest:examine:${node.id}`)}><span>{picked ? "✓" : rejected ? "×" : node.icon}</span></button>; })}<div className="moving-mist mist-one" /><div className="moving-mist mist-two" /></div>
      <div className="harvest-reading">{examined ? <><div><span>{examined.icon}</span><h3>{examined.name}</h3><small>Lecture par {currentTool.label.toLocaleLowerCase("fr-FR")}</small></div><blockquote>{examined.reading[state.harvestTool]}</blockquote><button className="primary-action" onClick={() => onAction(`harvest:node:${examined.id}`)}>Couper cette pousse</button></> : <p>Choisissez un outil, puis touchez une pousse dans la brume pour l’examiner avant de la couper.</p>}</div>
    </div>;
  };

  const renderMarket = () => {
    const customers = marketCustomers(state.variant);
    const customer = customers[state.round];
    if (!customer) return null;
    const minPrice = Math.max(0, customer.cost - 2);
    const maxPrice = customer.base + 12;
    return <div className="job-challenge market-game">
      <div className="market-scoreboard"><span>Client <b>{state.round + 1}/{customers.length}</b></span><span>Marge <b>{state.marketProfit >= 0 ? "+" : ""}{state.marketProfit} ◈</b></span><span>Réputation <b>{state.marketReputation >= 0 ? "+" : ""}{state.marketReputation}</b></span><span>Patience <b>{state.marketCounter ? "Dernière offre" : "2 offres"}</b></span></div>
      {state.feedbackText && <div className={`job-live-feedback ${state.lastResult || ""}`}>{state.feedbackText}</div>}
      <div className="market-customer"><span>{customer.icon}</span><div><small>{customer.name}</small><h3>{customer.item}</h3><p>{customer.opening}</p><blockquote>{customer.clue}</blockquote></div><aside><small>Prix conseillé</small><b>{customer.base} ◈</b><span>Coût : {customer.cost} ◈</span></aside></div>
      <div className="price-counter"><button onClick={() => onAction(`market:price:${state.marketPrice - 1}`)}>−</button><div><span>Votre prix</span><strong>{state.marketPrice} ◈</strong><input aria-label="Prix proposé" type="range" min={minPrice} max={maxPrice} value={state.marketPrice} onChange={(event) => onAction(`market:price:${event.target.value}`)} /></div><button onClick={() => onAction(`market:price:${state.marketPrice + 1}`)}>+</button></div>
      <div className="market-tactics">{MARKET_TACTICS.map((tactic) => <button key={tactic.id} className={state.marketTactic === tactic.id ? "selected" : ""} onClick={() => onAction(`market:tactic:${tactic.id}`)}><strong>{tactic.label}</strong><small>{tactic.detail}</small></button>)}</div>
      <div className="market-actions"><button className="primary-action" onClick={() => onAction("market:offer")}>Présenter l’offre</button><button onClick={() => onAction("market:refuse")}>Refuser la vente</button>{customer.special && <button className="whimsical" onClick={() => onAction("market:special")}>{customer.special.label}</button>}</div>
    </div>;
  };

  const renderTiming = () => {
    const width = 16 + Math.min(10, statValue);
    const center = 22 + ((state.variant * 17 + state.round * 29) % 57);
    return <div className="job-challenge timing-game"><div className="job-round-title"><span>Essai {state.round + 1} / 6</span><b>{state.score} réussite{state.score > 1 ? "s" : ""}</b></div><h3>{job.id.includes("defense") ? "Attendez l’entrée dans la ligne de tir" : "Maintenez l’aiguille dans la fréquence lumineuse"}</h3>{state.lastResult && <div className={`job-live-feedback ${state.lastResult}`}>{state.lastResult === "correct" ? "Verrouillage net. La prochaine cible accélère." : "Fenêtre manquée. Reprenez le rythme avant le passage suivant."}</div>}<div className="timing-track"><i className="timing-target" style={{ left: `${center - width / 2}%`, width: `${width}%` }} /><b className="timing-needle" style={{ left: `${state.timingPosition}%` }} /></div><p>{assisted ? `Votre ${STAT_LABELS[job.stat]} élargit légèrement la fenêtre.` : "Touchez le bouton lorsque l’aiguille traverse la zone."}</p><button className="primary-action timing-lock" onClick={() => onAction("lock")}>{job.id.includes("defense") ? "Déclencher le tir" : "Stabiliser maintenant"}</button></div>;
  };

  const renderPacking = () => {
    const crate = sessionCrates[state.round];
    if (!crate) return null;
    const leftAfter = state.leftWeight + crate.weight;
    const rightAfter = state.rightWeight + crate.weight;
    return <div className="job-challenge packing-game"><div className="job-round-title"><span>Cargaison {state.round + 1} / {sessionCrates.length}</span><b>Écart actuel : {Math.abs(state.leftWeight - state.rightWeight)}</b></div>{state.lastResult && <div className={`job-live-feedback ${state.lastResult}`}>{state.lastResult === "correct" ? "Le dernier chargement est arrimé correctement." : "Une consigne de sécurité vient d’être enfreinte."}</div>}<div className="hold-balance"><div><span>Bâbord</span><strong>{state.leftWeight}</strong><i style={{ height: `${Math.min(100, state.leftWeight * 7)}%` }} /></div><article><span>{crate.icon}</span><h3>{crate.label}</h3><b>{crate.weight} unités</b><small>{crate.detail}</small>{crate.ruleText && <em>{crate.ruleText}</em>}</article><div><span>Tribord</span><strong>{state.rightWeight}</strong><i style={{ height: `${Math.min(100, state.rightWeight * 7)}%` }} /></div></div><div className="packing-actions"><button onClick={() => onAction("left")}>Placer à bâbord{assisted && <small>Après : {leftAfter} / {state.rightWeight}</small>}</button><button onClick={() => onAction("right")}>Placer à tribord{assisted && <small>Après : {state.leftWeight} / {rightAfter}</small>}</button></div></div>;
  };

  const renderPath = () => {
    if (!sessionPath) return null;
    return <div className="job-challenge path-game"><div className="job-round-title"><span>Déplacements : {state.pathSteps} / {sessionPath.maxSteps}</span><b>Cases reconnues : {state.visited.length}</b></div><h3>{job.id.includes("crystal") ? "Conduisez la flamme jusqu’au cristal" : "Conduisez la lanterne jusqu’au sanctuaire"}</h3>{state.lastResult === "wrong" && <div className="job-live-feedback wrong">Le passage résiste : la charge reste sur la dalle précédente.</div>}<div className="path-grid" style={{ gridTemplateColumns: `repeat(${sessionPath.size}, 1fr)` }}>{Array.from({ length: sessionPath.size * sessionPath.size }, (_, index) => { const blocked = sessionPath.blocked.includes(index); const current = state.pathPosition === index; const goal = sessionPath.goal === index; const seen = state.visited.includes(index); return <span key={index} className={`${blocked ? "blocked" : ""} ${current ? "current" : ""} ${goal ? "goal" : ""} ${seen ? "seen" : ""}`}>{current ? (job.id.includes("crystal") ? "♨" : "◐") : goal ? "✦" : sessionPath.flavor[index] || "·"}</span>; })}</div>{assisted && <div className="job-assist">✦ Votre {STAT_LABELS[job.stat]} vous permet d’encaisser une erreur supplémentaire.</div>}<div className="path-controls"><button onClick={() => onAction("up")}>↑</button><button onClick={() => onAction("left")}>←</button><button onClick={() => onAction("down")}>↓</button><button onClick={() => onAction("right")}>→</button></div></div>;
  };

  const renderMemory = () => {
    const wave = state.sequence.slice(0, memoryWaveLength(state.round, state.sequence.length));
    return state.phase === "memorize" ? <div className="job-challenge memory-game"><div className="job-round-title"><span>Vague {Math.min(3, state.round + 1)} / 3</span><b>{state.mistakes} erreur{state.mistakes > 1 ? "s" : ""}</b></div>{state.lastResult && <div className={`job-live-feedback ${state.lastResult}`}>{state.lastResult === "correct" ? "La vague précédente dort. Une nouvelle marque rejoint la chaîne." : "La chaîne s’est tendue. Réobservez cette vague avant un second essai."}</div>}<p>Observez l’ordre d’endormissement des sceaux. La série disparaîtra lorsque vous commencerez.</p><div className="ritual-sequence">{wave.map((symbol, index) => <span key={`${symbol}-${index}`}>{symbol}</span>)}</div><button className="primary-action" onClick={onMemoryStart}>Toucher les sceaux</button></div> : <div className="job-challenge memory-game"><div className="job-round-title"><span>Vague {state.round + 1} / 3</span><b>{wave.length} signes</b></div><p>Reproduisez la séquence sans réveiller les protections.</p><div className="ritual-progress">{wave.map((_, index) => <i className={index < state.step ? "done" : ""} key={index} />)}</div><div className="rune-buttons">{shuffledChoices((job.symbols || []).map((symbol) => ({ id: symbol, symbol })), `${job.id}:${state.variant}:${state.round}:symbols`).map(({ symbol }) => <button key={symbol} onClick={() => onAction(symbol)}>{symbol}</button>)}</div></div>;
  };

  return <div className="modal-backdrop job-backdrop"><section ref={modalScrollRef} className={`ritual-modal job-modal varied-job job-kind-${job.kind} job-id-${job.id}`}><p className="eyebrow">Job local · {spotById(job.spot)?.shortName}</p><h2>{job.title}</h2>
    {state.phase === "briefing" && <><p className="job-session-name">Rotation {state.variant + 1} · {jobSessionLabel(job, state.variant)}</p><p className="job-employer">Proposé par {job.employer} · Salaire : <b>{job.reward} pièces</b> · Perfection : <b>{perfectPay}</b></p><p>{job.description}</p><blockquote>{job.briefing}</blockquote><div className="job-mechanic"><span>{job.kind === "service" ? "☕" : job.kind === "observation" ? "◉" : job.kind === "bargain" ? "◈" : job.kind === "sort" ? "▤" : job.kind === "timing" ? "⌖" : job.kind === "packing" ? "▦" : job.kind === "path" ? "⌁" : job.kind === "assembly" ? "⚙" : "◇"}</span><div><strong>{job.kind === "service" ? "Lecture de commandes" : JOB_KIND_LABELS[job.kind]}</strong><small>Stat associée : {STAT_LABELS[job.stat]} {statValue}{assisted ? " · avantage actif" : " · avantage au niveau 6"}</small></div></div><button className="primary-action" onClick={onBegin}>Accepter le travail</button><button className="text-button" onClick={onCancel}>Refuser sans perdre de temps</button></>}
    {(state.phase === "play" || state.phase === "memorize") && <><div className="job-progress-line"><i style={{ width: `${progressTotal ? Math.min(100, (progressNow / progressTotal) * 100) : 0}%` }} /></div>{job.id === "forestier-service" ? renderService() : job.id === "forestier-rooms" ? renderInspection() : job.id === "algratal-petitions" ? renderPetitions() : job.id === "tzekarun-mechanism" ? renderAssembly() : job.id === "forbidden-herbs" ? renderHarvest() : job.id === "algratal-merchant" ? renderMarket() : ["observation", "bargain", "sort", "assembly"].includes(job.kind) ? renderChoiceGame() : job.kind === "timing" ? renderTiming() : job.kind === "packing" ? renderPacking() : job.kind === "path" ? renderPath() : renderMemory()}</>}
    {complete && <div className={`ritual-result ${state.phase !== "failure" ? "success" : ""}`}><span>{state.phase === "perfect" ? "✦" : state.phase === "success" ? "◈" : "◇"}</span><h3>{state.phase === "perfect" ? "Travail impeccable" : state.phase === "success" ? "Travail accompli" : "Travail partiel"}</h3><p>{state.phase === "perfect" ? job.perfect : state.phase === "success" ? job.success : job.failure}</p><strong className="job-pay">{state.phase === "perfect" ? perfectPay : state.phase === "success" ? job.reward : partialPay} pièces{state.phase !== "failure" ? ` · ${STAT_LABELS[job.stat]} +1` : ""}</strong><button className={state.phase === "failure" ? "secondary-action" : "primary-action"} onClick={onFinish}>{state.phase === "failure" ? "Recevoir la compensation" : "Recevoir le salaire"}</button></div>}
  </section></div>;
}

function HomeDateModal({ characterId, game, onFinish, onClose }: { characterId: string; game: GameState; onFinish: (character: string, tone: HomeDateTone, score: number) => void; onClose: () => void }) {
  const profile = HOME_DATE_PROFILES[characterId];
  const character = CHARACTERS.find((entry) => entry.id === characterId);
  const property = propertyById(game.housing.propertyId);
  const items = game.housing.displayed.map((id) => displayItemById(id)).filter((item): item is NonNullable<ReturnType<typeof displayItemById>> => Boolean(item));
  const opening = profile && property ? homeDateOpening(profile, property, items) : [];
  const [phase, setPhase] = useState<"opening" | "tone" | "tone-lines" | "game" | "answer" | "result">("opening");
  const [lineIndex, setLineIndex] = useState(0);
  const [tone, setTone] = useState<HomeDateTone>("amical");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answerLines, setAnswerLines] = useState<DialogueLine[]>([]);
  const [resultLines, setResultLines] = useState<DialogueLine[]>([]);
  if (!profile || !property || !character) return null;
  const displayedLine = phase === "opening" ? opening[lineIndex] : phase === "tone-lines" ? profile.tones[tone].lines[lineIndex] : phase === "answer" ? answerLines[lineIndex] : phase === "result" ? resultLines[lineIndex] : undefined;
  const shownText = displayedLine ? replacePlayer(displayedLine.text, game.player) : "";
  const shownSpeaker = displayedLine?.speaker === "{player}" ? game.player.name : displayedLine?.speaker;
  const characterSpeaking = displayedLine ? speakerCharacterIds(displayedLine.speaker, [character.id]).includes(character.id) : true;
  const spriteMood = characterSpeaking && displayedLine
    ? (displayedLine.mood || moodForCharacter(character.id, `home-date-${character.id}-${phase}-${lineIndex}`, character.defaultMood))
    : character.defaultMood;
  const nextLine = () => {
    const lines = phase === "opening" ? opening : phase === "tone-lines" ? profile.tones[tone].lines : phase === "answer" ? answerLines : resultLines;
    if (lineIndex < lines.length - 1) { setLineIndex(lineIndex + 1); return; }
    setLineIndex(0);
    if (phase === "opening") setPhase("tone");
    else if (phase === "tone-lines") setPhase("game");
    else if (phase === "answer") {
      if (round + 1 < profile.rounds.length) { setRound(round + 1); setPhase("game"); }
      else {
        const bucket = score >= 5 ? profile.results.perfect : score >= 3 ? profile.results.warm : profile.results.close;
        setResultLines(bucket);
        setPhase("result");
      }
    } else onFinish(characterId, tone, score);
  };
  const chooseTone = (nextTone: HomeDateTone) => { setTone(nextTone); setLineIndex(0); setPhase("tone-lines"); };
  const chooseAnswer = (option: HomeDateProfile["rounds"][number]["options"][number]) => {
    const nextScore = score + option.score;
    setScore(nextScore);
    setAnswerLines(option.response);
    setLineIndex(0);
    setPhase("answer");
  };
  return <section className="home-date-scene" style={{ backgroundImage: `linear-gradient(180deg,rgba(5,6,12,.14),rgba(5,6,12,.72)),url(${property.background})` }}>
    <div className="scene-top home-date-scene-top"><div><p className="eyebrow">Rendez-vous dans votre logis · {property.name}</p><h2>{profile.title}</h2><p>{profile.description}</p></div><button onClick={onClose}>Quitter le rendez-vous</button></div>
    <div className="scene-cast cast-1"><img className={`scene-sprite ${characterSpeaking ? "active" : "inactive"}`} src={`/assets/sprites/${character.id}/${spriteMood}.webp`} alt={character.name} /></div>
    <div className="dialogue-gradient" />
    {(phase === "opening" || phase === "tone-lines" || phase === "answer" || phase === "result") && displayedLine && <button className={`dialogue-box home-date-dialogue-box ${displayedLine.speaker === "Narration" ? "narration" : ""}`} onClick={nextLine}><span className="speaker">{shownSpeaker}</span><p>{shownText}</p><small>{phase === "result" && lineIndex === resultLines.length - 1 ? "Terminer le rendez-vous" : "Continuer"} · Cliquer pour continuer</small></button>}
    {phase === "tone" && <div className="choice-box home-date-choice-panel"><div className="home-date-choice-heading"><p className="eyebrow">Donner le ton</p><p className="choice-question">Quelle relation souhaitez-vous vivre ce soir ?</p></div>{(Object.entries(profile.tones) as [HomeDateTone, HomeDateProfile["tones"][HomeDateTone]][]).map(([id, option], index) => { const blocked = id !== "amical" && (character.id === "draven" || game.flags.includes(`${character.id}-platonic`)); return <button key={id} disabled={blocked} onClick={() => chooseTone(id)}><span className="home-choice-number">{index + 1}</span><div><strong>{option.label}</strong><small>{blocked ? "Votre relation demeure amicale" : option.detail}</small></div></button>; })}</div>}
    {phase === "game" && <div className="choice-box home-date-choice-panel home-date-game-panel"><div className="home-date-choice-heading"><p className="eyebrow">Activité unique · manche {round + 1}/{profile.rounds.length}</p><h3>{profile.activityTitle}</h3><small>{round === 0 ? profile.activityInstruction : profile.rounds[round].detail}</small></div><p className="choice-question">{profile.rounds[round].prompt}</p>{profile.rounds[round].options.map((option, index) => <button key={option.id} onClick={() => chooseAnswer(option)}><span className="home-choice-number">{index + 1}</span><div><strong>{option.label}</strong></div></button>)}<small className="home-date-score">Harmonie actuelle : {score} / {profile.rounds.length * 2}</small></div>}
  </section>;
}

function HomePairDateModal({ pairId, game, onFinish, onClose }: { pairId: string; game: GameState; onFinish: (pair: string, tone: HomeDateTone, score: number) => void; onClose: () => void }) {
  const pair = HOME_PAIR_DATES.find((entry) => entry.id === pairId);
  const property = propertyById(game.housing.propertyId);
  const items = game.housing.displayed.map((id) => displayItemById(id)).filter((item): item is NonNullable<ReturnType<typeof displayItemById>> => Boolean(item));
  const opening = pair && property ? pairDateOpening(pair, property, items) : [];
  const [phase, setPhase] = useState<"opening" | "tone" | "tone-lines" | "game" | "answer" | "result">("opening");
  const [lineIndex, setLineIndex] = useState(0);
  const [tone, setTone] = useState<HomeDateTone>("amical");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answerLines, setAnswerLines] = useState<DialogueLine[]>([]);
  const [resultLines, setResultLines] = useState<DialogueLine[]>([]);
  if (!pair || !property) return null;
  const characters = pair.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
  const toneLines = pair.toneLines[tone];
  const displayedLine = phase === "opening" ? opening[lineIndex] : phase === "tone-lines" ? toneLines[lineIndex] : phase === "answer" ? answerLines[lineIndex] : phase === "result" ? resultLines[lineIndex] : undefined;
  const activeIds = displayedLine ? speakerCharacterIds(displayedLine.speaker, pair.characters) : pair.characters;
  const nextLine = () => {
    const lines = phase === "opening" ? opening : phase === "tone-lines" ? toneLines : phase === "answer" ? answerLines : resultLines;
    if (lineIndex < lines.length - 1) { setLineIndex(lineIndex + 1); return; }
    setLineIndex(0);
    if (phase === "opening") setPhase("tone");
    else if (phase === "tone-lines") setPhase("game");
    else if (phase === "answer") {
      if (round + 1 < pair.rounds.length) { setRound(round + 1); setPhase("game"); }
      else { setResultLines(score >= 5 ? pair.results.perfect : score >= 3 ? pair.results.warm : pair.results.close); setPhase("result"); }
    } else onFinish(pair.id, tone, score);
  };
  const chooseTone = (nextTone: HomeDateTone) => { setTone(nextTone); setLineIndex(0); setPhase("tone-lines"); };
  const chooseAnswer = (option: HomePairDateProfile["rounds"][number]["options"][number]) => { setScore(score + option.score); setAnswerLines(option.response); setLineIndex(0); setPhase("answer"); };
  return <section className="home-date-scene" style={{ backgroundImage: `linear-gradient(180deg,rgba(5,6,12,.14),rgba(5,6,12,.72)),url(${property.background})` }}>
    <div className="scene-top home-date-scene-top"><div><p className="eyebrow">Rendez-vous à trois dans votre logis · {property.name}</p><h2>{pair.title}</h2><p>{pair.description}</p></div><button onClick={onClose}>Quitter le rendez-vous</button></div>
    <div className={`scene-cast cast-${characters.length}`}>{characters.map((character, index) => { const active = activeIds.includes(character.id); const mood = active && displayedLine ? (displayedLine.mood || moodForCharacter(character.id, `home-pair-${pair.id}-${phase}-${lineIndex}-${character.id}`, character.defaultMood)) : character.defaultMood; return <img key={character.id} className={`scene-sprite ${active ? "active" : "inactive"} speaker-${index}`} src={`/assets/sprites/${character.id}/${mood}.webp`} alt={character.name} />; })}</div>
    <div className="dialogue-gradient" />
    {(phase === "opening" || phase === "tone-lines" || phase === "answer" || phase === "result") && displayedLine && <button className={`dialogue-box home-date-dialogue-box ${displayedLine.speaker === "Narration" ? "narration" : ""}`} onClick={nextLine}><span className="speaker">{displayedLine.speaker === "{player}" ? game.player.name : displayedLine.speaker}</span><p>{replacePlayer(displayedLine.text, game.player)}</p><small>{phase === "result" && lineIndex === resultLines.length - 1 ? "Terminer le rendez-vous" : "Continuer"} · Cliquer pour continuer</small></button>}
    {phase === "tone" && <div className="choice-box home-date-choice-panel"><div className="home-date-choice-heading"><p className="eyebrow">Dynamique partagée</p><p className="choice-question">Quel ton donner à cette visite ?</p></div>{pair.tones.map((id, index) => <button key={id} onClick={() => chooseTone(id)}><span className="home-choice-number">{index + 1}</span><div><strong>{id === "amical" ? "Complicité amicale" : id === "amoureux" ? "Tendresse à trois" : "Rivalité et désir"}</strong><small>Une variante écrite pour cette combinaison précise.</small></div></button>)}</div>}
    {phase === "game" && <div className="choice-box home-date-choice-panel home-date-game-panel"><div className="home-date-choice-heading"><p className="eyebrow">Jeu partagé · manche {round + 1}/{pair.rounds.length}</p><h3>{pair.title}</h3><small>{pair.rounds[round].detail}</small></div><p className="choice-question">{pair.rounds[round].prompt}</p>{pair.rounds[round].options.map((option, index) => <button key={option.id} onClick={() => chooseAnswer(option)}><span className="home-choice-number">{index + 1}</span><div><strong>{option.label}</strong></div></button>)}<small className="home-date-score">Harmonie actuelle : {score} / {pair.rounds.length * 2}</small></div>}
  </section>;
}

function GameModal({ modal, game, onClose, onActivityClose, buyGift, giveGift, startDate, startHomeDate, startHomePairDate, startDateIntimacy, finishHomeDate, finishHomePairDate, startHomeIntimacy, onIntimacyClose, startGroupDate, startGroupDateIntimacy, onGroupIntimacyClose, replyToLetter, acceptInvitation, declineInvitation, ritual, onRitualClose, jobState, onJobBegin, onMemoryStart, onJobAction, onJobClose }: { modal: NonNullable<ModalState>; game: GameState; onClose: () => void; onActivityClose: () => void; buyGift: (gift: string) => void; giveGift: (character: string, gift: string) => void; startDate: (dateId: string) => void; startHomeDate: (characterId: string) => void; startHomePairDate: (pairId: string) => void; startDateIntimacy: (dateId: string) => void; finishHomeDate: (character: string, tone: HomeDateTone, score: number) => void; finishHomePairDate: (pair: string, tone: HomeDateTone, score: number) => void; startHomeIntimacy: (character: string) => void; onIntimacyClose: (completed: boolean, memory?: string) => void; startGroupDate: (dateId: string) => void; startGroupDateIntimacy: (dateId: string) => void; onGroupIntimacyClose: (completed: boolean, memory?: string) => void; replyToLetter: (letter: LetterTemplate, replyId: string) => void; acceptInvitation: (invitation: InvitationTemplate) => void; declineInvitation: (invitation: InvitationTemplate) => void; ritual: { sequence: string[]; step: number; phase: string; setPhase: (phase: "memorize" | "play" | "success" | "failure") => void; play: (rune: string) => void }; onRitualClose: () => void; jobState: JobState | null; onJobBegin: () => void; onMemoryStart: () => void; onJobAction: (action: string) => void; onJobClose: () => void }) {
  if (modal.kind === "chronicle") return <ChronicleModal onClose={onClose} />;
  if (modal.kind === "notice") return <SimpleModal title={modal.title} text={modal.text} actionLabel={modal.actionLabel} onClose={modal.consumeTime ? onActivityClose : onClose} />;
  if (modal.kind === "letter") {
    const letter = LETTERS.find((entry) => entry.id === modal.letterId);
    const received = game.letters.find((entry) => entry.id === modal.letterId);
    if (!letter || !received) return null;
    const character = CHARACTERS.find((entry) => entry.id === letter.character);
    const selectedReply = letter.replies?.find((entry) => entry.id === received.replyId);
    const attachment = letter.attachedItem ? GIFTS.find((entry) => entry.id === letter.attachedItem)?.name || displayItemById(letter.attachedItem)?.name || letter.attachedItem : undefined;
    return <div className="modal-backdrop"><section className="correspondence-modal" style={{ "--character": character?.color } as React.CSSProperties}><button className="modal-close" onClick={onClose}>×</button><header><img src={character?.portrait} alt="" /><div><p className="eyebrow">Correspondance · Jour {received.receivedDay}</p><h2>{letter.subject}</h2><small>{letter.delivery}</small></div></header><div className="letter-paper">{letter.body.map((paragraph, index) => <p key={index}>{replacePlayer(paragraph, game.player)}</p>)}<strong>{letter.signature}</strong></div>{attachment && <div className="letter-attachment"><span>◇</span><div><small>Objet joint</small><strong>{attachment}</strong></div></div>}{letter.replies?.length && !received.replyId ? <div className="letter-replies"><small>Répondre — ce choix nuance la relation sans transformer la lettre en épreuve.</small>{letter.replies.map((reply) => <button key={reply.id} onClick={() => replyToLetter(letter, reply.id)}>{reply.label}</button>)}</div> : selectedReply ? <div className="letter-response"><small>Votre réponse</small><p>{selectedReply.response}</p></div> : null}<button className="secondary-action" onClick={onClose}>Refermer la lettre</button></section></div>;
  }
  if (modal.kind === "invitation") {
    const invitation = INVITATIONS.find((entry) => entry.id === modal.invitationId);
    const received = game.invitations.find((entry) => entry.id === modal.invitationId);
    if (!invitation || !received) return null;
    const character = CHARACTERS.find((entry) => entry.id === invitation.character);
    const pending = received.status === "pending" && game.day <= received.expiresDay;
    const status = pending ? `Réponse possible jusqu’au jour ${received.expiresDay}` : received.status === "accepted" ? "Invitation déjà honorée" : received.status === "declined" ? "Invitation refusée" : "Invitation expirée";
    return <div className="modal-backdrop"><section className="invitation-modal" style={{ "--character": character?.color } as React.CSSProperties}><button className="modal-close" onClick={onClose}>×</button><header><img src={character?.portrait} alt="" /><div><p className="eyebrow">Initiative de {character?.name}</p><h2>{invitation.title}</h2><span>{status}</span></div></header><blockquote>{invitation.message}</blockquote><div className="invitation-place"><span>⌖</span><div><strong>{spotById(invitation.spot)?.name}</strong><small>{LOCATIONS.find((entry) => entry.id === invitation.location)?.name} · {PERIODS.find((entry) => entry.id === invitation.period)?.label}</small></div></div>{pending ? <div className="invitation-actions"><button className="primary-action" onClick={() => acceptInvitation(invitation)}>Accepter et s’y rendre</button><button className="secondary-action" onClick={() => declineInvitation(invitation)}>Refuser</button><button className="text-button" onClick={onClose}>Décider plus tard</button></div> : <button className="secondary-action" onClick={onClose}>Refermer</button>}</section></div>;
  }
  if (modal.kind === "shop") return <div className="modal-backdrop"><section className="wide-modal"><button className="modal-close" onClick={onClose}>×</button><div className="shop-header"><div><p className="eyebrow">Marché de la Confluence</p><h2>Présents & curiosités</h2></div><strong>◈ {game.coins}</strong></div><div className="gift-steps compact"><span><b>1</b>Achetez ici</span><span><b>2</b>Rejoignez la personne</span><span><b>3</b>Cliquez sur « Offrir »</span></div><p className="shop-help">L’objet rejoint vos Biens, dans la section Inventaire. Vous pourrez l’exposer au logis ou le remettre directement lorsque son destinataire se trouve avec vous.</p><div className="shop-grid">{GIFTS.map((gift) => <article key={gift.id}><span>{gift.icon}</span><div><h3>{gift.name}</h3><p>{gift.description}</p><small>Dans l’inventaire : {game.inventory[gift.id] || 0}</small></div><button disabled={game.coins < gift.price} onClick={() => buyGift(gift.id)}>Acheter · {gift.price} ◈</button></article>)}</div></section></div>;
  if (modal.kind === "gift") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
    const present = place.location === game.location && place.spot === game.spot;
    const owned = GIFTS.filter((gift) => (game.inventory[gift.id] || 0) > 0);
    return <div className="modal-backdrop"><section className="gift-modal"><button className="modal-close" onClick={onClose}>×</button><div className="gift-modal-title"><img src={character.portrait} alt="" /><div><p className="eyebrow">Remettre un présent</p><h2>Offrir à {character.name}</h2><small>{present ? `Avec vous · ${spotById(game.spot)?.name}` : `${character.name} n’est plus ici`}</small></div></div>{present && owned.length ? <div className="gift-list large">{owned.map((gift) => <button key={gift.id} onClick={() => giveGift(character.id, gift.id)}><span>{gift.icon}</span><div><b>{gift.name}</b><small>{gift.description} · x{game.inventory[gift.id]}</small></div><em>Offrir</em></button>)}</div> : <p className="hint">{present ? "Votre inventaire ne contient aucun présent. Achetez-en au marché depuis Biens." : `Rejoignez ${character.name} au même sous-lieu avant de remettre l’objet.`}</p>}<button className="secondary-action" onClick={onClose}>Annuler</button></section></div>;
  }
  if (modal.kind === "character") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const relation = game.relationships[character.id];
    const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
    const present = place.location === game.location && place.spot === game.spot;
    const owned = GIFTS.filter((gift) => (game.inventory[gift.id] || 0) > 0);
    const discoveredKnowledge = game.knowledge.map((id) => ALL_KNOWLEDGE_ENTRIES.find((entry) => entry.id === id)).filter((entry) => entry?.people.includes(character.id));
    return <div className="modal-backdrop"><section className="character-modal" style={{ "--character": character.color } as React.CSSProperties}><button className="modal-close" onClick={onClose}>×</button><div className="character-hero"><img src={character.portrait} alt="" /><div><p className="eyebrow">Dossier relationnel</p><h2>{character.name}</h2><span>{characterDescriptor(character)}</span><blockquote>« {character.tagline} »</blockquote></div></div><div className="character-details"><div><h3>Ce que vous savez</h3><p>{character.bio}</p>{discoveredKnowledge.length > 0 && <div className="character-discoveries">{discoveredKnowledge.map((entry) => entry && <article key={entry.id}><strong>{entry.title}</strong><p>{entry.summary}</p></article>)}</div>}<h3>Apprécie</h3><p>{character.appreciates}</p></div><aside><strong>{STAGE_LABELS[relation.stage]}</strong><Meter label="Affection" value={relation.affection} color={character.color} /><Meter label="Confiance" value={relation.trust} color="#d6c176" /><Meter label="Désir" value={relation.desire} color="#e76588" /><h3>Offrir un présent</h3>{present ? owned.length ? <div className="gift-list">{owned.map((gift) => <button key={gift.id} onClick={() => giveGift(character.id, gift.id)}><span>{gift.icon}</span><div><b>{gift.name}</b><small>x{game.inventory[gift.id]}</small></div></button>)}</div> : <p className="hint">Votre inventaire ne contient aucun présent.</p> : <p className="hint">{character.name} se trouve actuellement à {spotById(place.spot)?.name}. Rejoignez exactement ce sous-lieu pour offrir quelque chose.</p>}</aside></div></section></div>;
  }
  if (modal.kind === "group-date-planner") {
    const property = propertyById(game.housing.propertyId);
    return <div className="modal-backdrop"><section className="wide-modal date-planner group-date-planner"><button className="modal-close" onClick={onClose}>×</button><header className="group-date-planner-header"><div className="group-date-header-mark">3</div><div><p className="eyebrow">Planifier une relation croisée</p><h2>Tous les rendez-vous à trois</h2><p>Les sorties publiques et les visites dans votre logis sont réunies ici. Chaque duo conserve sa dynamique et son mini-jeu propres.</p></div></header><div className="date-grid group-date-grid">{GROUP_DATES.map((date) => {
      const unlocked = groupDateUnlocked(game, date);
      const characters = date.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
      const place = spotById(date.spot);
      return <article key={date.id} className={!unlocked ? "locked" : ""} style={{ "--character": characters[0].color, backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.26), #12111d 78%), url(${place?.background})` } as React.CSSProperties}><div className="group-date-card-portraits">{characters.map((character) => <img key={character.id} src={character.portrait} alt={character.name} />)}</div><span>{characters.map((character) => character.name).join(" · ")} · {PERIODS.find((period) => period.id === date.period)?.label}</span><h3>{date.title}</h3><p>{date.description}</p><blockquote>{date.dynamic}</blockquote><small>⌖ {place?.name}</small>{unlocked ? <button className="primary-action" onClick={() => startGroupDate(date.id)}>Réserver cette journée à trois</button> : <div className="group-date-requirements">{characters.map((character) => { const relation = game.relationships[character.id]; return <span key={character.id}><b>{character.name}</b><small>Étape {relation.stage}/{date.minStage} · Aff. {relation.affection}/{date.minAffection} · Conf. {relation.trust}/{date.minTrust} · Désir {relation.desire}/{date.minDesire}</small></span>; })}</div>}</article>;
    })}{HOME_PAIR_DATES.map((pair) => {
      const characters = pair.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
      const unlocked = Boolean(property) && homePairDateUnlocked(game, pair);
      return <article key={`home-${pair.id}`} className={`home-date-plan-card ${!unlocked ? "locked" : ""}`} style={{ "--character": characters[0].color, backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.24), #12111d 78%), url(${property?.background || backgroundUrl("bedroom")})` } as React.CSSProperties}><div className="group-date-card-portraits">{characters.map((character) => <img key={character.id} src={character.portrait} alt={character.name} />)}</div><span>Au logis · {characters.map((character) => character.name).join(" · ")}</span><h3>{pair.title}</h3><p>{pair.description}</p><blockquote>Une visite privée construite autour de votre logement, de ses objets et de cette dynamique précise.</blockquote><small>⌂ {property?.name || "Aucun logis acheté"}</small>{unlocked ? <button className="primary-action" onClick={() => startHomePairDate(pair.id)}>Inviter au logis</button> : <div className="date-lock">{property ? `Requis : étape ${pair.minStage} · confiance ${pair.minTrust} · dynamique correspondante` : "Requis : posséder un logis"}</div>}</article>;
    })}</div></section></div>;
  }
  if (modal.kind === "group-date-result") {
    const date = GROUP_DATES.find((entry) => entry.id === modal.groupDateId)!;
    const characters = date.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
    return <div className="modal-backdrop"><section className="date-result-modal group-date-result-modal" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.38), #11101b 86%), url(${spotById(date.spot)?.background})` }}><div className="group-result-portraits">{characters.map((character) => <img key={character.id} src={character.portrait} alt={character.name} />)}</div><p className="eyebrow">La soirée garde trois places ouvertes</p><h2>{characters[0].name} et {characters[1].name} restent avec vous</h2><p>Après « {date.title} », la tension entre vous ne demande plus d’explication. Vous pouvez ouvrir une scène intime à trois — avec un mini-jeu et trois routes propres à ce duo et au sexe de votre protagoniste — ou laisser la soirée s’achever sur cette promesse.</p><div className="date-result-actions"><button className="primary-action" onClick={() => startGroupDateIntimacy(date.id)}>Poursuivre à trois</button><button className="secondary-action" onClick={onClose}>Terminer la soirée ici</button></div></section></div>;
  }
  if (modal.kind === "date-planner") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const relation = game.relationships[character.id];
    const dates = game.flags.includes(`${character.id}-platonic`) ? [] : DATE_SCENES.filter((date) => date.character === character.id);
    const homeProfile = HOME_DATE_PROFILES[character.id];
    const property = propertyById(game.housing.propertyId);
    const homeUnlocked = Boolean(property) && (game.settings.unlockAll || (relation.stage >= 3 && relation.affection >= 22 && relation.trust >= 22));
    return <div className="modal-backdrop"><section className="wide-modal date-planner" style={{ "--character": character.color } as React.CSSProperties}><button className="modal-close" onClick={onClose}>×</button><header className="date-planner-header"><img src={character.portrait} alt="" /><div><p className="eyebrow">Planifier un rendez-vous</p><h2>Une journée avec {character.name}</h2><p>Les rendez-vous publics et votre soirée au logis sont réunis ici. Chacun consomme une journée complète.</p></div></header><div className="date-grid">{dates.map((date) => { const unlocked = game.settings.unlockAll || (relation.stage >= date.unlockStage && relation.affection >= date.minAffection && relation.trust >= date.minTrust); const place = spotById(date.spot); return <article key={date.id} className={!unlocked ? "locked" : ""} style={{ backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.25), #12111d 78%), url(${place?.background})` }}><span>{date.type} · {PERIODS.find((period) => period.id === date.period)?.label}</span><h3>{date.title}</h3><p>{date.description}</p><small>⌖ {place?.name}</small>{unlocked ? <button className="primary-action" onClick={() => startDate(date.id)}>Réserver cette journée</button> : <div className="date-lock">Requis : étape {date.unlockStage} · affection {date.minAffection} · confiance {date.minTrust}</div>}</article>; })}{homeProfile && <article className={`home-date-plan-card ${!homeUnlocked ? "locked" : ""}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.2), #12111d 78%), url(${property?.background || backgroundUrl("bedroom")})` }}><span>Rendez-vous au logis · Soirée</span><h3>{homeProfile.title}</h3><p>{homeProfile.description}</p><small>⌂ {property?.name || "Aucun logis acheté"}</small>{homeUnlocked ? <button className="primary-action" onClick={() => startHomeDate(character.id)}>Inviter {character.name} au logis</button> : <div className="date-lock">{property ? "Requis : étape 3 · affection 22 · confiance 22" : "Requis : posséder un logis"}</div>}</article>}</div></section></div>;
  }
  if (modal.kind === "home-date") return <HomeDateModal characterId={modal.character} game={game} onFinish={finishHomeDate} onClose={onClose} />;
  if (modal.kind === "home-pair-date") return <HomePairDateModal pairId={modal.pairId} game={game} onFinish={finishHomePairDate} onClose={onClose} />;
  if (modal.kind === "home-date-result") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const property = propertyById(game.housing.propertyId)!;
    return <div className="modal-backdrop"><section className="date-result-modal" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.28), #11101b 88%), url(${property.background})` }}><p className="eyebrow">Le reste du monde est derrière votre porte</p><h2>{character.name} ne semble pas pressé·e de partir</h2><p>Le jeu est rangé, les trois objets exposés ont retrouvé leur silence et la soirée dispose enfin du temps qu’aucun lieu public ne lui aurait laissé. Ici, vous pouvez explorer une route intime propre à {character.name}, déclinée selon votre corps et votre réglage d’intimité.</p><div className="date-result-actions"><button className="primary-action" onClick={() => startHomeIntimacy(character.id)}>Prolonger la nuit au logis</button><button className="secondary-action" onClick={onClose}>Rester enlacé·es, puis terminer ici</button></div></section></div>;
  }
  if (modal.kind === "date-result") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const date = DATE_SCENES.find((entry) => entry.id === modal.dateId)!;
    return <div className="modal-backdrop"><section className="date-result-modal" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,9,16,.38), #11101b 86%), url(${spotById(date.spot)?.background})` }}><p className="eyebrow">La soirée refuse de finir</p><h2>{character.name} reste près de vous</h2><p>Après « {date.title} », la conversation s’est tue sans que la proximité disparaisse. Il reste encore une porte à franchir — ou une nuit à laisser s’achever sur ce dernier regard.</p><div className="date-result-actions"><button className="primary-action" onClick={() => startDateIntimacy(date.id)}>Suivre {character.name}</button><button className="secondary-action" onClick={onClose}>Rentrer ensemble, puis se séparer ici</button></div></section></div>;
  }
  if (modal.kind === "intimacy") {
    return <InteractiveIntimacyModal key={`${modal.character}:${modal.home ? "home" : modal.dateId || "route"}:${modal.replay ? "replay" : "live"}`} modal={modal} game={game} onFinish={(memory) => onIntimacyClose(true, memory)} onStop={() => onIntimacyClose(false)} />;
  }
  if (modal.kind === "group-intimacy") {
    return <InteractiveGroupIntimacyModal key={`${modal.groupDateId}:${game.player.sex}:${modal.replay ? "replay" : "live"}`} modal={modal} game={game} onFinish={(memory) => onGroupIntimacyClose(true, memory)} onStop={() => onGroupIntimacyClose(false)} />;
  }
  if (modal.kind === "ritual") {
    const runes = ["✦", "◇", "◐", "⌁", "✧"];
    return <div className="modal-backdrop"><section className="ritual-modal"><p className="eyebrow">Mini-jeu de Résonance</p><h2>Accorder les quatre échos</h2>{ritual.phase === "memorize" && <><p>Mémorisez la séquence. Elle disparaîtra lorsque vous commencerez.</p><div className="ritual-sequence">{ritual.sequence.map((rune, index) => <span key={`${rune}-${index}`}>{rune}</span>)}</div><button className="primary-action" onClick={() => ritual.setPhase("play")}>Je suis prêt·e</button></>}{ritual.phase === "play" && <><p>Reproduisez les échos dans le bon ordre.</p><div className="ritual-progress">{ritual.sequence.map((_, index) => <i className={index < ritual.step ? "done" : ""} key={index} />)}</div><div className="rune-buttons">{runes.map((rune) => <button key={rune} onClick={() => ritual.play(rune)}>{rune}</button>)}</div></>}{ritual.phase === "success" && <div className="ritual-result success"><span>✦</span><h3>Accord parfait</h3><p>Résonance +1 · Confluence +8</p><button className="primary-action" onClick={onRitualClose}>Revenir</button></div>}{ritual.phase === "failure" && <div className="ritual-result"><span>◇</span><h3>Écho dissonant</h3><p>La tentative stabilise tout de même la Confluence de 2 points.</p><button className="secondary-action" onClick={onRitualClose}>Revenir</button></div>}</section></div>;
  }
  if (modal.kind === "job") {
    const job = JOBS.find((entry) => entry.id === modal.jobId);
    if (!job || !jobState) return null;
    return <JobGameModal job={job} state={jobState} game={game} onBegin={onJobBegin} onMemoryStart={onMemoryStart} onAction={onJobAction} onFinish={onJobClose} onCancel={onClose} />;
  }
  return null;
}

function SimpleModal({ title, text, actionLabel, onClose }: { title: string; text: string; actionLabel?: string; onClose: () => void }) {
  return <div className="modal-backdrop"><section className="chronicle-modal"><p className="eyebrow">Chronique</p><h2>{title}</h2><p>{text}</p><button className="primary-action" onClick={onClose}>{actionLabel || "Continuer"}</button></section></div>;
}

function ChronicleModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="chronicle-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><p className="eyebrow">À propos de cette histoire</p><h2>Une branche alternative au début du Tome 1</h2><p>Hylee vient de quitter l’Auberge du Forestier avec Remerii. Iriana enquête seule sur des irrégularités impériales, Amanea règne encore à Akuhn’Nabad et Draven cherche l’aide nécessaire pour défendre Forthaven. Chacun suit déjà sa propre trajectoire lorsque votre arrivée déplace, à petite échelle, les liens entre ces routes.</p><p>Vous savez être étranger·e à cette réalité, sans vous souvenir de celle dont vous venez. Vous ne connaissez ni l’avenir ni les événements des romans : les alliances que vous bâtirez appartiennent entièrement à cette chronique.</p><button className="primary-action" onClick={onClose}>Compris</button></section></div>;
}
