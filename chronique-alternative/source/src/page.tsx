"use client";
/* eslint-disable @next/next/no-img-element -- sprites and map assets use dynamic canon paths */

import { ChangeEvent, Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  CHARACTERS,
  GIFTS,
  INTRO_CHOICES,
  INTRO_SCENE,
  LOCATIONS,
  PERIODS,
  ROUTE_SCENES,
  routeFlagRequirements,
  routeHistoryRequirements,
  routeKnowledgeRequirements,
  routeStoryRequirement,
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
import { linevaDateApproaches, linevaDateIntimacyPhase } from "./lineva-date-intimacy";
import { allennaDateApproaches, allennaDateIntimacyPhase } from "./allenna-date-intimacy";
import { hyleeDateApproaches, hyleeDateIntimacyEnding, hyleeDateIntimacyOpening, hyleeDateIntimacyPhase, hyleeDateIntimacyRoutes, hyleeIntimacyContext } from "./hylee-date-intimacy";
import { remeriiDateApproaches, remeriiDateIntimacyEnding, remeriiDateIntimacyOpening, remeriiDateIntimacyPhase, remeriiDateIntimacyRoutes, remeriiIntimacyContext } from "./remerii-date-intimacy";
import { linevaRelationBeat } from "./lineva-relation-beats";
import { allennaRelationBeat } from "./allenna-relation-beats";
import { hyleeRelationBeat, hyleeRouteVariant } from "./hylee-relation";
import { hyleeDateBeat } from "./hylee-dates";
import { remeriiRouteVariant } from "./remerii-relation";
import { remeriiDateBeat, migrateRemeriiDateId } from "./remerii-dates";
import { naiahDateBeat } from "./naiah-dates";
import { naiahProximityApproaches, naiahProximityContext, naiahProximityEnding, naiahProximityOpening, naiahProximityPhase, naiahProximityRoutes } from "./naiah-date-intimacy";
import { HOME_INTIMACY_APPROACHES, homeIntimacyEnding, homeIntimacyOpening, homeIntimacyRoutes } from "./home-intimacy-routes";
import { INTIMACY_GAMES, intimacyGameResult, type IntimacyGameOption } from "./intimacy-games";
import { groupIntimateVisualState, soloIntimateVisualState, type IntimateCgState } from "./intimate-cg";
import {
  GROUP_DATES,
  GROUP_INTIMACY_GAMES,
  HOME_GROUP_INTIMACY_DATES,
  groupIntimacyEnding,
  groupIntimacyGameResult,
  groupIntimacyOpening,
  groupIntimacyRoutes,
  groupIntimacyContextById,
  isManualGroupIntimacy,
  type GroupDateScene,
  type GroupIntimacyRoute,
} from "./group-dates";
import {
  LINEVA_ALLENNA_CORRESPONDENCE_DAYS,
  LINEVA_ALLENNA_FINAL_FLAGS,
  LINEVA_ALLENNA_LETTERS,
  LINEVA_ALLENNA_MILESTONES,
  advanceCrossTimeline,
  completedCrossMilestones,
  createLinevaAllennaProgress,
  crossMilestone,
  crossSceneForStage,
  linevaAllennaSeriesUnlocked,
  nextCrossTimelineDay,
  type CrossLetter,
  type CrossQuestProgress,
} from "./cross-quests";
import {
  ALPHA_GRID_SIZE,
  ALPHA_SECTOR_NAMES,
  alphaAdjacent,
  alphaCellInRange,
  alphaCellName,
  alphaMoveAllowed,
  createAlphaHunt,
  launchAlphaAssault,
  moveAlphaDuo,
  retryAlphaHunt,
  strikeAlphaCell,
  validateAlphaState,
  type AlphaCell,
  type AlphaHuntState,
} from "./alpha-hunt";
import { enrichDialogueLines, moodForCharacter, speakerCharacterIds } from "./narrative-system";
import { spritePath } from "./sprite-system";
import {
  hasIntimateSprites,
  intimateSpriteFallbackPath,
  intimateSpritePath,
  isIntimateGroupContext,
  withGroupIntimateMoods,
  withSoloIntimateEnding,
  withSoloIntimateMoods,
} from "./intimate-sprite-system";
import { MAIN_STORY, SUPPORTING_FIGURES, storyProgress } from "./story-data";
import { ACT_ONE_SCENE_ORDER, CAMPAIGN_SCENES, campaignSceneById, campaignSceneDialogue, campaignSceneOutro, type CampaignScene } from "./campaign-scenes";
import { ROUTE_CONTEXTUAL_CHOICES } from "./route-contextual-choices";
import { sceneClosure } from "./scene-closures";
import { MUSIC_LABELS, musicForContext } from "./music-data";
import { HR_KEY, HR_OPEN, HR_TITLES, HR_LETTERS, hrUnlocked, hrIndividualIntimacy, createHRProgress, hydrateHR, hrQuestScene, hrRecognition, type HRBeat } from "./hylee-remerii-cross-quest";
import { HR_DATE_IDS, HR_DATE_BEATS, hrDateReason, hrDateVisibility } from "./hylee-remerii-dates";
import { HRDossier, AnchorOperationModal } from "./hylee-remerii-ui";
import { CrossQuestDossier } from "./cross-quest-dossier";
import { createAnchorOperation, type AnchorState } from "./anchor-operation";
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
  isObsoletePermanentFriendshipFlag,
  routeChoiceCompletes,
  travelDurationLabel,
  travelPeriodCost,
  withoutObsoletePermanentFriendshipFlags,
} from "./gameplay-rules";
import {
  DEFAULT_ATLAS_UI_SETTINGS,
  UI_STYLE_META,
  atlasCssVariables,
  nextUiStyle,
  normalizeAtlasUiSettings,
  type AccentTone,
  type AtlasUiSettings,
  type TouchNavigation,
  type UiStyle,
} from "./ui/atlas/atlas-ui";
import type { AtlasTab } from "./ui/atlas/atlas-shell";
import { V2Title } from "./ui/v2/title";
import { AudioButtons, Kbd, Orn4, ROMAINS, Seau, V2Dialog, moveFocus } from "./ui/v2/common";
import { DEFAULT_SCALES, ECHELLES, SCALE_KEYS, applyScales, borne, createParticles, installGlobalSfx, playTransition, readScales, reduit, setReducedSetting, setUiPrefs, sfx, storeScales, subscribeUiPrefs, uiPrefs, type FxMode, type ScaleKey, type Scales } from "./ui/v2/fx";

type Screen = "title" | "creator" | "game";
type Tab = AtlasTab;
type PlacePanel = "actions" | "presences" | "waiting";
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

type GameSettings = AtlasUiSettings & {
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
  reoffers?: number;
};

type GameState = {
  version: 17;
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
  crossQuestSeries: Record<string, CrossQuestProgress>;
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
  hrScene?: boolean;
  beats?: HRBeat[];
  music?: string;
  id: string;
  title: string;
  background: string;
  mood: string;
  character?: string;
  intro: DialogueLine[];
  choices?: ChoiceData[];
  kind: "intro" | "story" | "route" | "ambient" | "social" | "date" | "group-date" | "cross-quest" | "home" | "secret" | "world" | "invitation";
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
  crossQuestStage?: number;
  cast: string[];
  departure?: { location: string; spot: string };
};

type DialogueState = {
  scene: SceneView;
  lines: DialogueLine[];
  lineIndex: number;
  phase: "intro" | "choices" | "response" | "relation-intro" | "relation-choices" | "relation-response";
  chosen?: ChoiceData;
  primaryChoice?: ChoiceData;
  dateRound?: number;
  datePicks?: string[];
  spriteMoods?: Record<string, string>;
  replay?: boolean;
  replayNextCrossStage?: number;
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
  | { kind: "title-options" }
  | { kind: "shop" }
  | { kind: "character"; character: string }
  | { kind: "gift"; character: string }
  | { kind: "date-planner"; character: string }
  | { kind: "home-date"; character: string }
  | { kind: "home-pair-date"; pairId: string }
  | { kind: "home-pair-date-result"; pairId: string }
  | { kind: "home-date-result"; character: string; score: number }
  | { kind: "intimacy"; character: string; background?: string; replay?: boolean; dateId?: string; home?: boolean }
  | { kind: "date-result"; character: string; dateId: string }
  | { kind: "group-date-planner" }
  | { kind: "group-date-result"; groupDateId: string }
  | { kind: "group-intimacy"; groupDateId: string; background?: string; replay?: boolean }
  | { kind: "cross-letter"; letterId: string }
  | { kind: "alpha-hunt"; replay?: boolean; state?: AlphaHuntState }
  | { kind: "anchor-operation"; replay?: boolean; state?: AnchorState }
  | { kind: "letter"; letterId: string }
  | { kind: "invitation"; invitationId: string }
  | { kind: "ritual" }
  | { kind: "job"; jobId: string }
  | { kind: "notice"; title: string; text: string; consumeTime?: boolean; actionLabel?: string; gift?: V2GiftReaction }
  | null;

type IntimacyModalState = Extract<NonNullable<ModalState>, { kind: "intimacy" }>;
type GroupIntimacyModalState = Extract<NonNullable<ModalState>, { kind: "group-intimacy" }>;
type DevIntimacyTarget =
  | { kind: "date"; dateId: string }
  | { kind: "home"; character: string }
  | { kind: "group"; groupDateId: string };

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

const AUTHORED_DATE_CHARACTERS = new Set(["hylee", "remerii", "naiah"]);
const DEDICATED_HOME_DATE_CHARACTERS = new Set(["hylee", "remerii", "naiah"]);

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
  ...DEFAULT_ATLAS_UI_SETTINGS,
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
    version: 17,
    player,
    day: 1,
    period: 0,
    location: "echo-clearing",
    spot: "echo-clearing",
    stats: playerStats(player),
    relationships: emptyRelationships(),
    inventory: { tartelette: 1, the: 1 },
    coins: 32,
    confluence: 8,
    flags: [],
    journal: ["Un portail défectueux vous a abandonné·e dans une réalité qui n'est pas la vôtre.", "Saidin vous a trouvé·e sur la route, sans prétendre connaître votre origine.", `Écho résiduel : ${player.origin} · Vocation choisie : ${player.vocation}.`],
    codex: ["La Confluence"],
    visitedLocations: ["echo-clearing"],
    visitedSpots: ["echo-clearing"],
    history: [],
    ambientHistory: emptyAmbientHistory(),
    sharedHistory: [],
    sceneMemories: {},
    dateHistory: [],
    groupDateHistory: [],
    crossQuestSeries: {},
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
    "Réflexe protecteur": "Lorsque le portail crépite encore, votre corps se place entre Saidin et la fracture avant même que vous sachiez qui il est. Ce réflexe vous appartient ; le souvenir qui l'a forgé demeure absent.",
    "Familiarité du pouvoir": "Le phénix gravé sur le jeton vous semble lié à une autorité avant même que Saidin parle d'Al’Gratal. Il refuse d'appeler cette intuition une preuve d'origine.",
    "Affinité des ombres": "Les résidus sombres du portail glissent sur votre peau sans éveiller de souvenir ni de panique. Saidin note seulement que votre prudence ressemble à une habitude très ancienne.",
    "Curiosité mécanique": "Malgré l’amnésie, vos doigts cherchent aussitôt le défaut du mécanisme emprunté. Vous ne savez pas où vous avez appris ce geste ; Saidin ignore si la compétence vient de votre réalité d’origine ou du portail lui-même.",
    "Mémoire de la pierre": "La roche humide du chemin vous paraît à la fois neuve et familière. Aucune image ne revient, seulement la certitude physique que la pierre de votre monde ne vibrait pas exactement ainsi.",
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
  const knowledgeAliases: Record<string, string> = {
    knows_naiah_tartlets: "knows_naiah_hylee_nights",
    knows_hylee_tartlets: "knows_hylee_naiah_nights",
    heard_rumor_naiah_tartlets: "heard_rumor_naiah_guardian",
  };
  const secretAliases: Record<string, string> = {
    "secret-naiah-tartlets": "secret-naiah-hylee-nights",
    "secret-hylee-naiah-v2": "secret-hylee-naiah-nights",
  };
  const migrateKnowledgeId = (id: string) => knowledgeAliases[id] || id;
  const migrateSecretId = (id: string) => secretAliases[id] || id;
  const migrateRumorId = (id: string) => id === "rumor-forbidden-tartlets" ? "rumor-forbidden-guardian" : id;
  const legacyTimeline = savedVersion < 8;
  const resetCharacters = new Set(["iriana", "valurn", "bellirith", "amanea", "draven"]);
  const oldRelationships = Object.fromEntries(CHARACTERS.map((character) => {
    const saved = { ...fresh.relationships[character.id], ...(value.relationships?.[character.id] || {}) };
    if (!legacyTimeline || !resetCharacters.has(character.id)) return [character.id, saved];
    return [character.id, { ...fresh.relationships[character.id], gifts: saved.gifts }];
  }));
  const obsoleteRoute = (id: string) => legacyTimeline && /^(iriana|valurn|bellirith|amanea|draven)-[0-4]$/.test(id);
  const obsoleteFlag = (flag: string) => legacyTimeline && (
    flag === "main-story-complete" ||
    /^(story-(amanea|draven|pact|allenna|naiah)|social:(amanea-family-truth|draven-lineva-letter|medig-window)|date(-intimate)?:date-amanea)/.test(flag)
  );
  const previousCampaignIds = new Set([
    "campaign-archives-channel",
    "campaign-forged-proof",
    "campaign-convergence-council",
    "campaign-convergence-operation",
    "campaign-epilogue",
  ]);
  const preserveCompletedCampaign = savedVersion < 14 && (value.flags || []).includes("main-story-complete");
  const migratedFlags = unique([
    ...(value.flags || []).filter((flag) => !obsoleteFlag(flag) && !isObsoletePermanentFriendshipFlag(flag)),
    ...(savedVersion < 14 ? ["story-saidin-met", "story-phoenix-token", "story-route-algratal"] : []),
    ...(preserveCompletedCampaign ? ["main-story-act-1-complete", "amanea-letter-to-tia", "story-rocky-portal-open", "story-empire-obscurci-rupture"] : []),
  ]);
  const migratedRouteHistory = (value.history || []).filter((id) => !obsoleteRoute(id) && !(savedVersion < 14 && previousCampaignIds.has(id)));
  const migratedHistory = unique([
    ...migratedRouteHistory,
    ...(preserveCompletedCampaign ? CAMPAIGN_SCENES.map((scene) => scene.id) : []),
  ]);
  const friendshipLockJournal = /^(?:Lien avec .+ · amitié choisie après .+\.|Lineva & Allenna · complicité à trois explicitement platonique\.)$/u;
  const cleanedJournal = (value.journal || fresh.journal).filter((entry) => !friendshipLockJournal.test(entry));
  const migratedJournal = legacyTimeline
    ? ["Chronologie recalée : Amanea règne encore, Draven voyage vers l’Empire et le rassemblement d’Iriana n’a jamais eu lieu.", ...cleanedJournal]
    : cleanedJournal;
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
  const normalizedCrossQuestSeries = Object.fromEntries(Object.entries(value.crossQuestSeries || {}).map(([id, progress]) => [id, id === HR_KEY ? hydrateHR(progress, {
    flags: migratedFlags,
    groupDateHistory: value.groupDateHistory || [],
  }) : {
    ...progress,
    id,
    stage: Math.max(0, Math.min(8, Number(progress.stage) || 0)),
    startedDay: Math.max(1, Number(progress.startedDay) || 1),
    stageStartedDay: Math.max(1, Number(progress.stageStartedDay) || Number(progress.startedDay) || 1),
    letters: Array.isArray(progress.letters) ? progress.letters.filter((entry) => LINEVA_ALLENNA_LETTERS.some((letter) => letter.id === entry.id)) : [],
    alphaState: progress.alphaState && validateAlphaState(progress.alphaState) ? progress.alphaState : undefined,
  }]));
  const normalizedHR = normalizedCrossQuestSeries[HR_KEY];
  const normalizeHROpen = normalizedHR?.stage >= 7
    && normalizedHR.hr?.branch === "double"
    && normalizedHR.hr.configuration === "accepted";
  return {
    ...fresh,
    ...value,
    version: 17,
    player: { ...fresh.player, ...value.player, sex: value.player.sex || "intersexe" },
    location,
    spot,
    stats: { ...fresh.stats, ...(value.stats || {}) },
    relationships: oldRelationships,
    inventory: { ...fresh.inventory, ...(value.inventory || {}) },
    settings: {
      ...DEFAULT_SETTINGS,
      ...(value.settings || {}),
      ...normalizeAtlasUiSettings(value.settings),
      fontScale: Math.max(80, Math.min(140, Number(value.settings?.fontScale) || DEFAULT_SETTINGS.fontScale)),
      volume: Math.max(0, Math.min(100, Number(value.settings?.volume) || DEFAULT_SETTINGS.volume)),
    },
    flags: unique([
      ...migratedFlags.map(flag => flag === "date-intimate:date-remerii-music" ? "date-intimate:date-remerii-lanterns" : flag),
      ...(migratedFlags.some(flag => flag === "home-intimate:remerii" || flag.startsWith("date-intimate:date-remerii-")) ? ["remerii-intimacy-lived"] : []),
      ...(normalizeHROpen ? [HR_OPEN] : []),
    ]),
    journal: migratedJournal,
    codex: value.codex || fresh.codex,
    visitedLocations,
    visitedSpots,
    history: migratedHistory,
    ambientHistory: Object.fromEntries(CHARACTERS.map((character) => [character.id, legacyTimeline && ["amanea", "draven"].includes(character.id) ? [] : (value.ambientHistory?.[character.id] || [])])),
    sharedHistory: (value.sharedHistory || []).filter((id) => !legacyTimeline || !["amanea-family-truth", "draven-lineva-letter", "medig-window"].includes(id)),
    sceneMemories: Object.fromEntries(Object.entries(value.sceneMemories || {}).map(([id, place]) => [
      id === "intimacy:date-remerii-music" ? "intimacy:date-remerii-lanterns" : migrateRemeriiDateId(id),
      id === "date-remerii-music" ? "miraldas-lanterns" : place,
    ])),
    dateHistory: (value.dateHistory || []).filter((id) => !legacyTimeline || !id.startsWith("date-amanea")).map(migrateRemeriiDateId),
    groupDateHistory: value.groupDateHistory || [],
    crossQuestSeries: normalizedCrossQuestSeries,
    knowledge: unique((value.knowledge || []).map(migrateKnowledgeId).filter((id) => ALL_KNOWLEDGE_ENTRIES.some((entry) => entry.id === id))),
    secretHistory: unique((value.secretHistory || []).map(migrateSecretId).filter((id) => SECRET_CONVERSATIONS.some((entry) => entry.id === id))),
    letters: (value.letters || []).filter((entry) => LETTERS.some((letter) => letter.id === entry.id)).map((entry) => ({
      id: entry.id,
      receivedDay: Math.max(1, Number(entry.receivedDay) || 1),
      read: Boolean(entry.read),
      replyId: entry.id === "letter-naiah-margin" && entry.replyId === "naiah-food" ? "naiah-verso" : entry.replyId,
    })),
    invitations: (value.invitations || []).filter((entry) => INVITATIONS.some((invitation) => invitation.id === entry.id)).map((entry) => ({
      id: entry.id,
      receivedDay: Math.max(1, Number(entry.receivedDay) || 1),
      expiresDay: Math.max(1, Number(entry.expiresDay) || 1),
      status: ["pending", "accepted", "declined", "expired"].includes(entry.status) ? entry.status : "expired",
      reoffers: Math.max(0, Number(entry.reoffers) || 0),
    })) as ReceivedInvitation[],
    rumors: (value.rumors || []).map((entry) => ({ ...entry, id: migrateRumorId(entry.id) })).filter((entry) => RUMORS.some((rumor) => rumor.id === entry.id)).map((entry) => ({ id: entry.id, heardDay: Math.max(1, Number(entry.heardDay) || 1) })),
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
    && routeHistoryRequirements(scene).every((id) => ["hylee", "remerii"].includes(scene.character) ? campaignHistorySatisfied(id, game) : game.history.includes(id))
    && storyProgress(game.history, game.flags) >= routeStoryRequirement(scene)
    && routeFlagRequirements(scene).every((flag) => game.flags.includes(flag))
  );
}

function routeAvailableAtPlace(scene: RouteScene | undefined, game: GameState): boolean {
  if (!scene) return false;
  const relation = game.relationships[scene.character];
  const periods = ROUTE_PERIODS[scene.id];
  return game.day >= scene.dayMin
    && scene.location === game.location
    && ROUTE_SPOTS[scene.id] === game.spot
    && (!periods || periods.includes(PERIODS[game.period].id))
    && relation.affection + relation.trust >= BOND_THRESHOLDS[scene.stage]
    && routeNarrativeReady(scene, game);
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
  const missingHistory = routeHistoryRequirements(scene).filter((id) => ["hylee", "remerii"].includes(scene.character) ? !campaignHistorySatisfied(id, game) : !game.history.includes(id));
  if (missingHistory.length) {
    if (scene.id === "lineva-0") return "Rencontrez d’abord Lineva lors du départ de Draven à Forthaven.";
    return "Une étape de l’histoire principale doit encore présenter cette situation.";
  }
  const requiredStory = routeStoryRequirement(scene);
  const currentStory = storyProgress(game.history, game.flags);
  if (currentStory < requiredStory) {
    return `Poursuivez l’histoire principale jusqu’à la fin du chapitre ${MAIN_STORY[requiredStory - 1]?.number || requiredStory}.`;
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
  if (scene.id === "draven-4") {
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

const CHARACTER_INTRODUCTIONS: Record<string, { history?: string; flag?: string }> = {
  saidin: { flag: "story-saidin-met" },
  hylee: { history: "campaign-echoes" },
  remerii: { history: "campaign-echoes" },
  iriana: { history: "campaign-imperial-audience" },
  valurn: { history: "campaign-imperial-audience" },
  naiah: { history: "campaign-naiah-promise" },
  draven: { history: "campaign-forthaven-assault" },
  lineva: { history: "campaign-lineva-departure" },
  allenna: { history: "campaign-akuhn-gates" },
  amanea: { history: "campaign-amanea-audience" },
  tia: { history: "campaign-before-light" },
  bellirith: { history: "campaign-coalition-preparation" },
};

function characterUnlocked(game: GameState, character: CharacterData) {
  if (game.settings.unlockAll) return true;
  if (game.relationships[character.id]?.met) return true;
  const introduction = CHARACTER_INTRODUCTIONS[character.id];
  if (!introduction) return false;
  return Boolean(
    (introduction.history && game.history.includes(introduction.history))
    || (introduction.flag && game.flags.includes(introduction.flag)),
  );
}

function locationUnlocked(game: GameState, locationId: string) {
  if (game.settings.unlockAll || game.visitedLocations.includes(locationId)) return true;
  if (locationId === "echo-clearing") return true;
  if (locationId === "algratal") return game.flags.includes("story-route-algratal");
  if (["forestier", "miraldas"].includes(locationId)) return game.history.includes("campaign-echoes");
  if (["forbidden", "forthaven", "river-halt", "imperial-road"].includes(locationId)) return game.history.includes("campaign-imperial-audience");
  if (locationId === "akuhn") return game.history.includes("campaign-akuhn-gates");
  if (locationId === "rocky-spires") return game.history.includes("campaign-rocky-spires") || game.flags.includes("story-rocky-portal-open");
  if (["tzekarun", "obsidian-waystation"].includes(locationId)) return game.flags.includes("story-tzekarun-discovered");
  return false;
}

function secretConversationReady(secret: SecretConversation, game: GameState, requirePlace = true) {
  const relation = game.relationships[secret.character];
  if (!relation || !relation.met || game.secretHistory.includes(secret.id)) return false;
  // Chaque couche de passé répond à une scène réellement vécue : une forte
  // relation obtenue par cadeaux ou moments libres ne peut plus sauter le
  // premier chapitre de la route ni révéler plusieurs niveaux à l’avance.
  if (!game.settings.unlockAll && !["hylee", "remerii"].includes(secret.character) && relation.stage < secret.tier / 20) return false;
  if (!game.settings.unlockAll && relation.trust < (secret.minTrust || 0)) return false;
  if (!game.settings.unlockAll && relation.affection + relation.trust < secret.tier) return false;
  if (!game.settings.unlockAll && game.day < (secret.minDay || 1)) return false;
  if (!game.settings.unlockAll && !hasKnowledge(game, secret.requiresKnowledge)) return false;
  if (requirePlace && secret.locations?.length && !secret.locations.includes(game.location)) return false;
  if (requirePlace && secret.spots?.length && !secret.spots.includes(game.spot)) return false;
  return true;
}

function availableSecretForCharacter(characterId: string, game: GameState) {
  return SECRET_CONVERSATIONS
    .filter((secret) => secret.character === characterId && secretConversationReady(secret, game))
    .sort((left, right) => left.tier - right.tier)[0];
}

function spontaneousEventReady(event: SpontaneousEvent, game: GameState) {
  if (game.crossQuestSeries[HR_KEY]?.stage === 4 && event.characters.includes("hylee") && event.characters.includes("remerii")) return false;
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

const LIVING_WORLD_DELIVERY_GAP = 2;
const INVITATION_REOFFER_DELAY = 6;
const MAX_UNREAD_LETTERS = 2;

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
  const invitations = game.invitations.map((entry) => {
    if (entry.status !== "pending" || game.day <= entry.expiresDay) return entry;
    return { ...entry, status: "expired" as const };
  });
  const base = { ...game, invitations, livingWorldTick: tick };

  const deliveries = [
    ...base.letters.map((entry) => ({ day: entry.receivedDay, kind: "letter" as const })),
    ...base.invitations.map((entry) => ({ day: entry.receivedDay, kind: "invitation" as const })),
  ].sort((left, right) => right.day - left.day);
  const previousDelivery = deliveries[0];
  const deliveryAllowed = !previousDelivery || base.day - previousDelivery.day >= LIVING_WORLD_DELIVERY_GAP;
  if (!deliveryAllowed) return base;

  const unreadLetters = base.letters.filter((entry) => !entry.read).length;
  const hasPendingInvitation = base.invitations.some((entry) => entry.status === "pending");
  const letter = unreadLetters < MAX_UNREAD_LETTERS ? LETTERS.find((entry) => letterReady(entry, base)) : undefined;
  const expiredInvitation = !hasPendingInvitation
    ? base.invitations.find((entry) => entry.status === "expired" && base.day >= entry.expiresDay + INVITATION_REOFFER_DELAY)
    : undefined;
  const freshInvitation = !hasPendingInvitation && !expiredInvitation
    ? INVITATIONS.find((entry) => invitationReady(entry, base))
    : undefined;
  const invitationEntry = expiredInvitation || undefined;
  const invitation = invitationEntry
    ? INVITATIONS.find((entry) => entry.id === invitationEntry.id)
    : freshInvitation;

  // Une seule initiative peut arriver au cours d'un même créneau. Lorsque les
  // deux types de contenu sont prêts, on alterne avec le dernier reçu afin que
  // les lettres ne noient pas les invitations (et inversement).
  const preferredKind = previousDelivery?.kind === "letter" ? "invitation" : "letter";
  const deliverLetter = Boolean(letter && (preferredKind === "letter" || !invitation));
  const deliverInvitation = Boolean(invitation && !deliverLetter);
  if (!deliverLetter && !deliverInvitation) return base;

  const newLetters = deliverLetter && letter
    ? [...base.letters, { id: letter.id, receivedDay: base.day, read: false }]
    : base.letters;
  const newInvitations = deliverInvitation && invitation
    ? invitationEntry
      ? base.invitations.map((entry) => entry.id === invitation.id ? {
        ...entry,
        receivedDay: base.day,
        expiresDay: base.day + invitation.expiresAfter,
        status: "pending" as const,
        reoffers: (entry.reoffers || 0) + 1,
      } : entry)
      : [...base.invitations, { id: invitation.id, receivedDay: base.day, expiresDay: base.day + invitation.expiresAfter, status: "pending" as const, reoffers: 0 }]
    : base.invitations;
  return {
    ...base,
    letters: newLetters,
    invitations: newInvitations,
    journal: [
      ...base.journal,
      ...(deliverLetter && letter ? [`Correspondance reçue · ${letter.subject}`] : []),
      ...(deliverInvitation && invitation ? [`${invitationEntry ? "Invitation renouvelée" : "Invitation reçue"} · ${invitation.title}`] : []),
    ],
  };
}

function evolveCrossQuests(game: GameState): GameState {
  if (!game.crossQuestSeries[HR_KEY] && hrUnlocked(game)) game = { ...game, crossQuestSeries: { ...game.crossQuestSeries, [HR_KEY]: createHRProgress(game.day) }, journal: [...game.journal, "Quêtes croisées · Hylee & Remerii · Après les Serres"] };
  let progress = game.crossQuestSeries.linevaAllenna;
  if (!progress && linevaAllennaSeriesUnlocked({ ...game, unlockAll: game.settings.unlockAll })) {
    progress = createLinevaAllennaProgress(game.day);
    return {
      ...game,
      crossQuestSeries: { ...game.crossQuestSeries, linevaAllenna: progress },
      journal: [...game.journal, "Quêtes croisées · Lineva & Allenna · Le mauvais allié"],
    };
  }
  if (!progress) return game;
  const updated = advanceCrossTimeline(progress, game.day);
  if (updated === progress) return game;
  const previousIds = new Set(progress.letters.map((entry) => entry.id));
  const newLetters = updated.letters
    .filter((entry) => !previousIds.has(entry.id))
    .map((entry) => LINEVA_ALLENNA_LETTERS.find((letter) => letter.id === entry.id))
    .filter((letter): letter is CrossLetter => Boolean(letter));
  const silenceReached = progress.stage === 3 && updated.stage === 4;
  return {
    ...game,
    crossQuestSeries: { ...game.crossQuestSeries, linevaAllenna: updated },
    journal: [
      ...game.journal,
      ...newLetters.map((letter) => `Correspondance croisée reçue · ${letter.subject}`),
      ...(silenceReached ? ["Quêtes croisées · Trois jours sans nouvelles de Forthaven."] : []),
    ],
  };
}

function groupDateUnlocked(game: GameState, date: GroupDateScene): boolean {
  if (date.legacyOnly) return false;
  if (HR_DATE_IDS.includes(date.id)) return !hrDateReason(date, game);
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
  const requiredStage = 5;
  return relation.stage >= requiredStage && relation.affection >= 22 && relation.trust >= 22;
}

function homePairDateUnlocked(game: GameState, pair: HomePairDateProfile): boolean {
  if (pair.id === "hylee-remerii") return false; // Replaced by authored dates. Historical memories stay available.
  const property = propertyById(game.housing.propertyId);
  if (!property) return false;
  if (pair.locations?.length && !pair.locations.includes(property.location)) return false;
  if (!contentBranchAllowed(game.flags, pair)) return false;
  if (pair.id === "allenna-lineva" && !game.settings.unlockAll && !game.groupDateHistory.some((id) => id === "group-date-allenna-lineva-training" || id === "group-date-allenna-lineva-basin")) return false;
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
    if (!locationUnlocked(previous, location.id) && locationUnlocked(next, location.id)) labels.push(`Lieu · ${location.name}`);
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
      title: `Chapitre ${completedAct.number} accompli`,
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
  const beforeHR = previous.crossQuestSeries[HR_KEY], afterHR = next.crossQuestSeries[HR_KEY];
  if (!beforeHR && afterHR) livingWorldChanges.push({ kind: "story", title: "Une nouvelle série croisée est disponible", detail: "Hylee & Remerii · Après les Serres" });
  if (beforeHR && afterHR && beforeHR.stage !== afterHR.stage && afterHR.stage < 7) livingWorldChanges.push({ kind: "story", title: afterHR.stage === 6 ? "Une opération est prête aux Serres Rocheuses" : "Hylee et Remerii · La suite vous attend", detail: HR_TITLES[afterHR.stage] });
  const previousCross = previous.crossQuestSeries.linevaAllenna;
  const nextCross = next.crossQuestSeries.linevaAllenna;
  if (!previousCross && nextCross) livingWorldChanges.push({ kind: "story", title: "Quêtes croisées débloquées", detail: "Lineva & Allenna · Le mauvais allié" });
  if (previousCross && nextCross?.stage === 4 && previousCross.stage === 3) livingWorldChanges.push({ kind: "story", title: "Trois jours de silence", detail: "Retournez à Forthaven." });
  const newCrossLetters = nextCross?.letters.filter((entry) => !previousCross?.letters.some((before) => before.id === entry.id)) || [];
  newCrossLetters.forEach((entry) => livingWorldChanges.push({ kind: "letter", title: "Une correspondance croisée vous attend", detail: LINEVA_ALLENNA_LETTERS.find((letter) => letter.id === entry.id)?.subject }));
  const newInvitations = next.invitations.filter((entry) => !previous.invitations.some((before) => before.id === entry.id));
  newInvitations.forEach((entry) => {
    const invitation = INVITATIONS.find((candidate) => candidate.id === entry.id);
    livingWorldChanges.push({ kind: "invitation", title: invitation?.message || "Quelqu’un souhaite vous voir.", detail: invitation ? `Réponse possible jusqu’au jour ${entry.expiresDay}.` : "Consultez le Journal." });
  });
  const renewedInvitations = next.invitations.filter((entry) => entry.status === "pending" && previous.invitations.some((before) => before.id === entry.id && before.status === "expired"));
  renewedInvitations.forEach((entry) => {
    const invitation = INVITATIONS.find((candidate) => candidate.id === entry.id);
    livingWorldChanges.push({ kind: "invitation", title: `${invitation?.message || "Quelqu’un vous propose une nouvelle date."}`, detail: `L’occasion revient jusqu’au jour ${entry.expiresDay}.` });
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
  const itinerary = character.id === "iriana" && flags.includes("story-forthaven-accord-drafted")
      ? IRIANA_FORTHAVEN_ITINERARY
      : character.itinerary;
  const cycleLength = itinerary.reduce((total, stop) => total + stop.days, 0);
  const anchor = ["hylee", "remerii"].includes(character.id)
    ? Number(flags.find((flag) => flag.startsWith("hylee-itinerary-start:"))?.split(":")[1]) || 1
    : 1;
  const cycleDay = ((Math.max(1, day - anchor + 1) - 1) % cycleLength) + 1;
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

function storyCharacterPlace(characterId: string, day: number, period: number, flags: string[]) {
  const has = (flag: string) => flags.includes(flag);
  const fixed = (location: string, spot: string, action: string) => ({
    location,
    spot,
    action,
    traveling: false,
    untilDay: day + 1,
    days: 1,
    note: action,
    cycleDay: 1,
    cycleLength: 1,
    stopDay: 1,
  });

  if (["hylee", "remerii"].includes(characterId) && !has("campaign-algratal-road")) {
    return fixed("echo-clearing", "echo-clearing", characterId === "hylee" ? "explore la clairière avant le départ vers Al’Gratal" : "prépare discrètement la traversée vers Al’Gratal");
  }
  if (["hylee", "remerii"].includes(characterId) && has("campaign-algratal-road") && !has("campaign-imperial-audience")) {
    return fixed("algratal", period === 2 ? "algratal-market" : "algratal-streets", characterId === "hylee" ? "découvre la capitale sans attendre une invitation du palais" : "surveille les contrôles magiques pendant que Hylee découvre la ville");
  }

  if (characterId === "naiah" && has("campaign-naiah-promise")) {
    const spots = ["forbidden-ruins", "forbidden-crossroads", "forbidden-threshold", "forbidden-sanctuary"];
    const action = has("naiah-guardian-witnessed")
      ? "réaccorde le réseau de brume après la défaillance des protections"
      : has("naiah-intruders-routed")
        ? "cherche les dernières balises copiées par les cartographes intrus"
        : has("naiah-convoy-protected")
          ? "surveille discrètement les routes empruntées par les petits convois"
          : has("naiah-wards-serviced")
            ? "inspecte les trois couches de protection de la Forêt Interdite"
            : has("naiah-watchpoint-seen")
              ? "vérifie les balises cachées derrière ses jeux de sentiers"
              : "entretient les brumes et les chemins de renvoi autour de la frontière";
    return fixed("forbidden", spots[period], action);
  }

  if (characterId === "lineva" && has("campaign-lineva-departure") && !has("main-story-act-1-complete")) {
    const spots = ["forthaven-harbor", "forthaven-war-room", "forthaven-ramparts", "forthaven-quarters"];
    return fixed("forthaven", spots[period], "commande Forthaven pendant l'absence de Draven et la poursuite des vagues de morts-vivants");
  }

  if (characterId === "draven" && has("campaign-lineva-departure") && !has("campaign-price-of-aid")) {
    return fixed("algratal", period === 2 ? "algratal-palace-council" : "algratal-palace-quarters", "attend l'audience d'Iriana après avoir laissé le commandement de Forthaven à Lineva");
  }
  if (characterId === "draven" && has("campaign-price-of-aid") && !has("campaign-akuhn-gates")) {
    return fixed("river-halt", "river-halt", "vous escorte vers la Forêt Interdite et Akuhn’Nabad");
  }
  if (characterId === "draven" && has("campaign-akuhn-gates") && !has("campaign-amanea-letter")) {
    return fixed("akuhn", period === 0 ? "akuhn-palace-exterior" : period === 1 ? "akuhn-archives" : "akuhn-war-room", "reste à Akuhn’Nabad comme escorte et logisticien de l'enquête");
  }
  if (characterId === "draven" && has("campaign-amanea-letter") && !has("campaign-before-light")) {
    return fixed("algratal", "algratal-palace-quarters", "rapporte les preuves d'Alamma et prépare l'audience de Tia");
  }
  if (characterId === "draven" && has("campaign-before-light") && !has("campaign-false-portal")) {
    return fixed("forbidden", period < 2 ? "forbidden-threshold" : "forbidden-ruins", "commande le détachement de Forthaven contre le portail de la Forêt Interdite");
  }
  if (characterId === "draven" && has("campaign-false-portal") && !has("campaign-rocky-spires")) {
    return fixed("algratal", "algratal-palace-quarters", "fait le bilan des pertes avant de ramener ses soldats à Forthaven");
  }

  if (["allenna", "amanea"].includes(characterId) && has("campaign-akuhn-gates") && !has("campaign-before-light")) {
    const spot = characterId === "allenna" ? (period === 1 ? "akuhn-archives" : "akuhn-war-room") : (period === 1 ? "akuhn-throne-room" : "akuhn-terrace");
    return fixed("akuhn", spot, characterId === "allenna" ? "encadre l'enquête puis prépare les forces d'Akuhn’Nabad" : "gouverne la cité pendant que l'enquête sur Alamma progresse");
  }
  if (["allenna", "amanea"].includes(characterId) && has("campaign-before-light") && !has("campaign-false-portal")) {
    return fixed("forbidden", characterId === "allenna" ? "forbidden-ruins" : "forbidden-threshold", characterId === "allenna" ? "commande l'aile obscurcie de l'opération" : "dirige ses forces depuis une ligne séparée de celle de Tia");
  }

  if (["iriana", "valurn"].includes(characterId) && has("campaign-coalition-preparation") && !has("campaign-false-portal")) {
    return fixed("forbidden", characterId === "iriana" ? "forbidden-threshold" : "forbidden-ruins", characterId === "iriana" ? "coordonne les deux lignes sans fusionner leurs commandements" : "stabilise les ancrages démoniaques du faux portail");
  }
  if (characterId === "tia" && has("campaign-before-light") && !has("main-story-act-1-complete")) {
    return fixed("algratal", period === 1 ? "algratal-palace-audience" : "algratal-palace-council", "dirige la mobilisation impériale sans rejoindre personnellement les lignes obscurcies");
  }
  return undefined;
}

function characterPlace(character: CharacterData, day: number, period: number, flags: string[] = [], housing?: HousingState) {
  const campaignPlace = storyCharacterPlace(character.id, day, period, flags);
  if (campaignPlace) return campaignPlace;
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
  if (scene.crossStage) { const stage = game.crossQuestSeries[scene.crossStage.series]?.stage; if (stage === undefined || stage < scene.crossStage.min || stage > scene.crossStage.max) return false; }
  if (game.crossQuestSeries[HR_KEY]?.stage === 4 && !scene.crossStage && scene.characters.includes("hylee") && scene.characters.includes("remerii")) return false;
  if (scene.id.startsWith("hr-")) return false;
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
      || (requirement.affection !== undefined && relation.affection < requirement.affection)
      || (requirement.desire !== undefined && relation.desire < requirement.desire);
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

const INJECTED_CHOICE_AFTERMATH: Record<string, Partial<Record<"misread" | "boundary" | "platonic", DialogueLine[]>>> = {
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

const SERVICE_TIME_LIMIT = 35;
const SERVICE_ERROR_PENALTY = 3;

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
    serviceTimeLeft: correct ? SERVICE_TIME_LIMIT : SERVICE_TIME_LIMIT - SERVICE_ERROR_PENALTY,
    lastResult: correct ? "correct" : "wrong",
  };
}

function flagsSharedByEveryChoice(choices: ChoiceData[]) {
  if (!choices.length) return [];
  const [first, ...rest] = choices;
  return (first.effects.flags || []).filter((flag) => rest.every((choice) => choice.effects.flags?.includes(flag)));
}

function relationRouteVariant(route: RouteScene, game: GameState) {
  let playable = remeriiRouteVariant(hyleeRouteVariant(route, game.knowledge, game.flags), game.knowledge, game.flags);
  if (route.id === "remerii-0" && !game.flags.some(flag => flag.startsWith("hylee-return-choice:"))) {
    // Rattrapage d'une sauvegarde antérieure, sans inventer un second retour.
    playable = { ...playable, intro: [{ speaker: "Narration", text: "Ce souvenir reprend juste après votre retour auprès d’Hylee, dans les rues d’Al’Gratal. Remerii avait encore une question avant votre promenade à la fontaine." }, ...playable.intro] };
  }
  return { route: playable, sceneId: route.id };
}

function authoredDateBeat(sceneId: string, round: number, picks?: string[]) {
  return hyleeDateBeat(sceneId, round, picks) || remeriiDateBeat(sceneId, round) || naiahDateBeat(sceneId, round);
}

function relationBeatFor(sceneId: string, game: GameState) {
  if (sceneId === "allenna-4") return undefined;
  return hyleeRelationBeat(sceneId, game.flags) || linevaRelationBeat(sceneId) || allennaRelationBeat(sceneId);
}

function choicesForDialogue(dialogue: DialogueState, game: GameState) {
  const base = dialogue.scene.choices || [];
  if (dialogue.scene.beats && dialogue.phase === "relation-choices") return dialogue.scene.beats[dialogue.dateRound ?? 0]?.choices || [];
  if (dialogue.phase === "relation-choices" && dialogue.scene.date && AUTHORED_DATE_CHARACTERS.has(dialogue.scene.date.character)) {
    const beat = authoredDateBeat(dialogue.scene.id, dialogue.dateRound ?? 0, dialogue.datePicks);
    return beat?.choices || [];
  }
  if (dialogue.phase === "relation-choices" && dialogue.scene.route) {
    const beat = relationBeatFor(dialogue.scene.route.id, game);
    return beat ? shuffledChoices(beat.choices, `${dialogue.scene.id}:relation:${game.player.name}`) : [];
  }
  // Les moments libres et rendez-vous conservent uniquement leurs choix
  // écrits. Les anciennes réponses génériques pouvaient y contredire la scène
  // ou valider une branche sans son flag. Seules les routes majeures reçoivent
  // des issues supplémentaires, toutes rédigées pour leur scène exacte.
  if (dialogue.replay || dialogue.scene.kind !== "route" || !dialogue.scene.route) return base;
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
  const romanticMoment = !["lineva", "allenna"].includes(characterId)
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
      flags: flagsSharedByEveryChoice(base),
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

function recoverMissingSprite(event: SyntheticEvent<HTMLImageElement>, portrait: string) {
  const image = event.currentTarget;
  if (image.dataset.spriteFallback === "portrait") return;
  image.dataset.spriteFallback = "portrait";
  image.src = portrait;
}

function recoverMissingIntimateSprite(event: SyntheticEvent<HTMLImageElement>, characterId: string) {
  const image = event.currentTarget;
  if (image.dataset.spriteFallback === "intimate-soft") {
    image.hidden = true;
    return;
  }
  image.dataset.spriteFallback = "intimate-soft";
  image.src = intimateSpriteFallbackPath(characterId);
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
  const [placePanel, setPlacePanel] = useState<PlacePanel | null>(null);
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
  /* ---------- Interface V2 : état d’affichage (aucune donnée de jeu propre) ---------- */
  const [v2Dialog, setV2Dialog] = useState<V2DialogState>(null);
  const [linksView, setLinksView] = useState<V2LinksView>("liens");
  const [ficheId, setFicheId] = useState("");
  const [v2Log, setV2Log] = useState<V2LogEntry[]>([]);
  const [timeJump, setTimeJump] = useState<{ day: number; period: number; leaving: boolean } | null>(null);
  const [rankQueue, setRankQueue] = useState<{ id: string; from: number; to: number }[]>([]);
  const [rankLeaving, setRankLeaving] = useState(false);
  const [slotVersion, setSlotVersion] = useState(0);
  const [v2Prefs, setV2Prefs] = useState(() => uiPrefs());
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ReturnType<typeof createParticles> | null>(null);
  const titleAudioRef = useRef<HTMLAudioElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const rankPrevRef = useRef<GameState | null>(null);
  const dayStartRef = useRef<GameState | null>(null);
  const [dayRecap, setDayRecap] = useState<{ from: GameState; to: GameState } | null>(null);

  useEffect(() => { gameRef.current = game; }, [game]);
  useEffect(() => { installGlobalSfx(); applyScales(readScales()); return subscribeUiPrefs(() => setV2Prefs(uiPrefs())); }, []);
  useEffect(() => {
    const reduced = Boolean(game?.settings.reducedMotion);
    setReducedSetting(reduced);
    document.body.classList.toggle("reduit", reduced);
    document.body.classList.toggle("contraste", Boolean(game?.settings.highContrastText));
  }, [game?.settings.reducedMotion, game?.settings.highContrastText]);

  /* Particules : une ambiance par écran (le titre reste la cinématique seule). */
  useEffect(() => {
    const canvas = fxCanvasRef.current;
    if (!canvas) return;
    if (!particlesRef.current) particlesRef.current = createParticles(canvas);
    const fx = particlesRef.current;
    if (screen === "title" || reduit()) { fx.stop(); return; }
    if (screen === "creator") { fx.mode("lucioles"); return; }
    const mode: FxMode = tab === "place" ? (["petales", "poussiere", "poussiere", "lucioles"] as FxMode[])[game?.period ?? 0] : V2_FX_BY_TAB[tab] || "poussiere";
    fx.mode(mode);
  }, [screen, tab, game?.period, game?.settings.reducedMotion]);

  /* Thème du menu : lancé dès que le navigateur l’autorise (geste « Appuyez »). */
  useEffect(() => {
    const audio = titleAudioRef.current;
    if (screen !== "title" || !audio) return;
    if (v2Prefs.titleMusic) void audio.play().catch(() => undefined); else audio.pause();
  }, [screen, v2Prefs.titleMusic]);

  /* Animation « rang supérieur » quand un stade de relation augmente réellement. */
  useEffect(() => {
    if (!game || screen !== "game") { rankPrevRef.current = null; return; }
    const previous = rankPrevRef.current;
    rankPrevRef.current = game;
    if (!previous || previous === game) return;
    const ups = CHARACTERS.filter((character) => (game.relationships[character.id]?.stage ?? 0) > (previous.relationships[character.id]?.stage ?? 0))
      .map((character) => ({ id: character.id, from: previous.relationships[character.id]?.stage ?? 0, to: game.relationships[character.id].stage }));
    if (ups.length && ups.length <= 3) setRankQueue((current) => [...current, ...ups]);
  }, [game, screen]);

  /* Bilan de fin de journée : état au début du jour (comme rankPrevRef, réinitialisé au chargement) → état au changement de jour. */
  useEffect(() => {
    if (!game || screen !== "game") { dayStartRef.current = null; return; }
    const start = dayStartRef.current;
    if (!start || game.day < start.day) { dayStartRef.current = game; return; }
    if (game.day > start.day) {
      dayStartRef.current = game;
      if (!game.settings.noTimeCost) setDayRecap((pending) => ({ from: pending?.from || start, to: game }));
    }
  }, [game, screen]);

  const rankVisible = Boolean(rankQueue.length && !dialogue && !modal && !v2Dialog);
  useEffect(() => {
    if (!rankVisible) return;
    sfx("rang");
    const leave = window.setTimeout(() => setRankLeaving(true), reduit() ? 1800 : 2800);
    const next = window.setTimeout(() => { setRankLeaving(false); setRankQueue((current) => current.slice(1)); }, reduit() ? 1900 : 3200);
    return () => { window.clearTimeout(leave); window.clearTimeout(next); };
  }, [rankVisible, rankQueue[0]?.id, rankQueue[0]?.to]);
  function dismissRank() { setRankLeaving(false); setRankQueue((current) => current.slice(1)); }

  function goTab(next: Tab, instant = false) {
    if (!game) return;
    if (next === tab && !(next === "relations" && linksView !== "liens")) return;
    const apply = () => {
      if (next === "relations") setLinksView("liens");
      if (next === "map" && tab !== "map" && !instant) { setSelectedLocation(game.location); setSelectedSpot(game.spot); }
      setMapDestinationOpen(false);
      setPlacePanel(null);
      setTab(next);
    };
    sfx("onglet");
    if (instant) { apply(); return; }
    void playTransition("entaille").then(apply);
  }

  function v2Wait() {
    if (!game) return;
    if (game.settings.noTimeCost) { setModal({ kind: "notice", title: "Temps figé", text: "Le mode développeur « sans coût de temps » est actif : attendre ne fait pas avancer l’horloge." }); return; }
    const nextPeriod = (game.period + 1) % PERIODS.length;
    const day = nextPeriod === 0 ? game.day + 1 : game.day;
    if (reduit()) { advancePeriod(); return; }
    sfx("temps");
    setTimeJump({ day, period: nextPeriod, leaving: false });
    window.setTimeout(() => advancePeriod(), 900);
    window.setTimeout(() => setTimeJump((current) => current && { ...current, leaving: true }), 1500);
    window.setTimeout(() => setTimeJump(null), 2000);
  }

  /* Clavier V2 : Échap (pause / retour), Q-E (onglets), 1-7, flèches (focus spatial). */
  useEffect(() => {
    if (screen !== "game") return;
    const listener = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (modal && event.key === "Escape" && !dialogue) {
        // Échap = la croix de fermeture réelle de la fenêtre héritée, quand elle en propose une.
        const close = document.querySelector<HTMLButtonElement>(".modal-backdrop .modal-close");
        if (close) { event.preventDefault(); close.click(); }
        return;
      }
      if (modal || dialogue || timeJump) return;
      const arrows: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable='true']");
      if (document.querySelector("dialog[open]")) {
        if (arrows[event.key] && !typing) { event.preventDefault(); moveFocus(...arrows[event.key]); }
        return;
      }
      if (rankQueue.length && event.key === "Escape") { dismissRank(); return; }
      if (event.key === "Escape") {
        event.preventDefault();
        if (tab === "relations" && linksView !== "liens") { sfx("retour"); setLinksView("liens"); } else setV2Dialog({ kind: "pause" });
        return;
      }
      if (typing) return;
      const key = event.key.toLowerCase();
      if (key === "q" || key === "e") {
        event.preventDefault();
        const index = Math.max(0, V2_TABS.findIndex(([id]) => id === tab));
        const nextIndex = (index + (key === "e" ? 1 : -1) + V2_TABS.length) % V2_TABS.length;
        goTab(V2_TABS[nextIndex][0]);
        return;
      }
      const digit = Number(event.key);
      if (digit >= 1 && digit <= V2_TABS.length) { event.preventDefault(); goTab(V2_TABS[digit - 1][0]); return; }
      if (arrows[event.key]) { event.preventDefault(); moveFocus(...arrows[event.key]); }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  const pushNotification = useCallback((draft: ChronicleNotificationDraft) => {
    const id = ++notificationIdRef.current;
    setNotifications((current) => [...current, { ...draft, id }].slice(-4));
    const meta = V2_NOTIF[draft.kind];
    const clock = gameRef.current;
    setV2Log((current) => [{ id, type: meta.type, icon: meta.icon, label: meta.label, title: draft.title, detail: draft.detail, t: clock ? `Jour ${clock.day} · ${PERIODS[clock.period].label}` : "", read: false }, ...current].slice(0, 80));
    sfx("notif");
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
    setGame((current) => current ? evolveLivingWorld(evolveCrossQuests(transform(current))) : current);
  }

  function refreshSlots() {
    setSlotInfo(readSlotInfo());
  }

  function begin() {
    if (!player.name.trim() || player.age < 18) return;
    const next = createGame({ ...player, name: player.name.trim() });
    const introLines = [...INTRO_SCENE.slice(0, 5), originLine(next.player), ...INTRO_SCENE.slice(5)];
    const introScene: SceneView = { id: "intro", title: "Prologue · Le jeton du Phénix", background: "/assets/backgrounds/camp.webp", mood: "mysterious", character: "saidin", cast: ["saidin"], intro: introLines, choices: INTRO_CHOICES, kind: "intro" };
    setGame(next);
    setHasSave(true);
    setSelectedLocation("echo-clearing");
    setSelectedSpot(next.spot);
    setPlacePanel(null);
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
      rankPrevRef.current = loaded; dayStartRef.current = loaded; setDayRecap(null);
      setGame(loaded);
      setSelectedLocation(loaded.location);
      setSelectedSpot(loaded.spot);
      setPlacePanel(null);
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
        flags: unique(withoutObsoletePermanentFriendshipFlags([...current.flags, ...(effects.flags || [])])),
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
    const ready = routeAvailableAtPlace(route, game);
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
      const scene: SceneView = { ...playable.route, id: playable.sceneId, background: routeBackground(playable.route), cast: playable.route.cast || [playable.route.character], kind: "route", route: playable.route };
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

  function readCrossLetter(letterId: string) {
    if (!game) return;
    const letter = LINEVA_ALLENNA_LETTERS.find((entry) => entry.id === letterId);
    const progress = game.crossQuestSeries.linevaAllenna;
    const received = progress?.letters.find((entry) => entry.id === letterId);
    if (!letter || !progress || !received) return;
    updateGame((current) => {
      const currentProgress = current.crossQuestSeries.linevaAllenna;
      if (!currentProgress) return current;
      return {
        ...current,
        crossQuestSeries: { ...current.crossQuestSeries, linevaAllenna: { ...currentProgress, letters: currentProgress.letters.map((entry) => entry.id === letterId ? { ...entry, read: true } : entry) } },
        journal: received.read ? current.journal : [...current.journal, `Lettre croisée lue · ${letter.subject}`],
      };
    });
    setModal({ kind: "cross-letter", letterId });
  }

  function replyToCrossLetter(letter: CrossLetter, replyId: string) {
    if (!game) return;
    const reply = letter.replies?.find((entry) => entry.id === replyId);
    const progress = game.crossQuestSeries.linevaAllenna;
    const received = progress?.letters.find((entry) => entry.id === letter.id);
    if (!reply || !progress || !received || received.replyId) return;
    applyEffects(letter.character, reply.effects);
    updateGame((current) => {
      const currentProgress = current.crossQuestSeries.linevaAllenna;
      if (!currentProgress) return current;
      return {
        ...current,
        crossQuestSeries: { ...current.crossQuestSeries, linevaAllenna: { ...currentProgress, letters: currentProgress.letters.map((entry) => entry.id === letter.id ? { ...entry, replyId } : entry) } },
        journal: [...current.journal, `Réponse croisée envoyée · ${letter.subject}`],
      };
    });
  }

  function openHRDialogue(scene: SceneView, nextGame: GameState, replay = false) {
    const cp = !replay && nextGame.crossQuestSeries[HR_KEY]?.hr?.checkpoint;
    const resume = cp && cp.sceneId === scene.id ? cp : undefined;
    const beat = resume && resume.round >= 0 ? scene.beats?.[resume.round] : undefined;
    const chosen = resume ? (beat?.choices || scene.choices)?.find(c => c.id === resume.picks.at(-1)) : undefined;
    const cast = chosen ? beat?.responseCast || beat?.cast : beat?.cast;
    setModal(null);
    setDialogue({ scene: cast ? { ...scene, cast } : scene, lines: expandedLines(scene, nextGame, chosen ? chosen.response : scene.intro, chosen ? "response" : "intro"), lineIndex: 0, phase: chosen ? resume!.round >= 0 ? "relation-response" : "response" : "intro", chosen, dateRound: resume?.round, datePicks: resume?.picks || [], replay });
  }

  function startHRScene(stage: number, replay = false, recognition = false) {
    if (!game) return;
    const progress = game.crossQuestSeries[HR_KEY];
    if (!progress?.hr || (!replay && progress.stage !== stage) || (replay && !recognition && stage >= progress.stage)) return;
    let hr = progress.hr;
    if (recognition) {
      if (hr.branch !== "double" || progress.stage !== 7) return;
      if (!replay && hr.configuration && hr.configuration !== "waiting") return;
      if (!replay && hr.configuration === "waiting" && game.day <= (hr.recognitionDay || 0)) return;
    }
    if (!replay && stage === 5 && !hr.branch) hr = { ...hr, branch: hrIndividualIntimacy(game.flags, "hylee") && hrIndividualIntimacy(game.flags, "remerii") ? "double" : "standard" };
    const data = recognition ? hrRecognition(hr, !replay && hr.configuration === "waiting") : hrQuestScene(stage, hr);
    if (!data) return;
    let nextGame = { ...game, crossQuestSeries: { ...game.crossQuestSeries, [HR_KEY]: { ...progress, hr } } };
    if (!replay) { nextGame = { ...nextGame, location: data.location, spot: data.spot, ...placeDiscovery(nextGame, data.location, data.spot) }; setGame(evolveLivingWorld(evolveCrossQuests(nextGame))); setSelectedLocation(data.location); setSelectedSpot(data.spot); }
    const scene: SceneView = { ...data, kind: "cross-quest", hrScene: true, character: "hylee", mood: "soft", background: spotById(data.spot)?.background || backgroundUrl("camp") };
    openHRDialogue(scene, nextGame, replay);
  }

  function startAnchorOperation(replay = false) {
    if (!game) return;
    const p = game.crossQuestSeries[HR_KEY];
    if (replay) {
      if (!p?.hr?.prepared || p.stage < 7) return;
      const seed = p.hr.anchor?.seed || game.day * 97 + game.history.length * 13;
      setModal({ kind: "anchor-operation", replay: true, state: createAnchorOperation(seed) });
      return;
    }
    if (p?.stage !== 6 || !p.hr?.prepared) return;
    if (!p.hr.anchor) updateGame(current => { const p = current.crossQuestSeries[HR_KEY]; return { ...current, crossQuestSeries: { ...current.crossQuestSeries, [HR_KEY]: { ...p, hr: { ...p.hr!, anchor: createAnchorOperation(current.day * 97 + current.history.length * 13) } } } }; });
    setModal({ kind: "anchor-operation" });
  }
  function setAnchorState(anchor: AnchorState) {
    if (modal?.kind === "anchor-operation" && modal.replay) {
      setModal({ ...modal, state: anchor });
      return;
    }
    updateGame(current => { const p = current.crossQuestSeries[HR_KEY]; if (p?.stage !== 6 || !p.hr?.prepared || (p.hr.anchor?.result && p.hr.anchor.result !== "retreat")) return current; return { ...current, crossQuestSeries: { ...current.crossQuestSeries, [HR_KEY]: { ...p, hr: { ...p.hr, anchor } } } }; });
  }
  function readHRLetter(id: string) {
    updateGame(current => { const p = current.crossQuestSeries[HR_KEY]; if (!p || !p.letters.some(l => l.id === id && !l.read)) return current; return { ...current, crossQuestSeries: { ...current.crossQuestSeries, [HR_KEY]: { ...p, letters: p.letters.map(l => l.id === id ? { ...l, read: true } : l) } } }; });
  }

  function startCrossQuestScene(stage: number, replay = false) {
    if (!game) return;
    const progress = game.crossQuestSeries.linevaAllenna;
    const data = crossSceneForStage(stage);
    if (!progress || !data || (!replay && progress.stage !== stage)) return;
    const first = CHARACTERS.find((entry) => entry.id === data.lead)!;
    const nextGame = replay ? game : { ...game, location: data.location, spot: data.spot, ...placeDiscovery(game, data.location, data.spot) };
    const scene: SceneView = {
      id: data.id,
      title: data.title,
      background: spotById(data.spot)?.background || backgroundUrl("streets"),
      mood: first.defaultMood,
      character: data.lead,
      cast: data.cast,
      intro: data.intro,
      choices: data.choices,
      kind: "cross-quest",
      crossQuestStage: stage,
    };
    if (!replay) {
      setGame(evolveLivingWorld(evolveCrossQuests(nextGame)));
      setSelectedLocation(data.location);
      setSelectedSpot(data.spot);
    }
    setDialogue({ scene, lines: expandedLines(scene, nextGame, data.intro, "intro", data.spot), lineIndex: 0, phase: "intro", replay, replayNextCrossStage: replay && stage === 0 ? 1 : undefined });
  }

  function waitForCrossTimeline() {
    if (!game) return;
    const progress = game.crossQuestSeries.linevaAllenna;
    if (!progress || progress.stage !== 3) return;
    const targetDay = nextCrossTimelineDay(progress, game.day);
    updateGame((current) => ({
      ...current,
      day: targetDay,
      journal: targetDay > current.day
        ? [...current.journal, `Attente · Prochain courrier de Forthaven au jour ${targetDay}.`]
        : current.journal,
    }));
  }

  function startAlphaHunt(replay = false) {
    if (!game) return;
    const progress = game.crossQuestSeries.linevaAllenna;
    if (replay) {
      if (!progress || progress.stage < 7) return;
      const seed = progress.alphaState?.originalSeed || game.day * 97 + game.history.length * 13 + 41;
      setModal({ kind: "alpha-hunt", replay: true, state: createAlphaHunt(seed) });
      return;
    }
    if (!progress || progress.stage !== 6) return;
    if (!progress.alphaState) {
      const alphaState = createAlphaHunt(game.day * 97 + game.history.length * 13 + 41);
      updateGame((current) => ({
        ...current,
        crossQuestSeries: { ...current.crossQuestSeries, linevaAllenna: { ...current.crossQuestSeries.linevaAllenna, alphaState } },
      }));
    }
    setModal({ kind: "alpha-hunt" });
  }

  function setAlphaHuntState(alphaState: AlphaHuntState) {
    if (modal?.kind === "alpha-hunt" && modal.replay) {
      setModal({ ...modal, state: alphaState });
      return;
    }
    updateGame((current) => {
      const progress = current.crossQuestSeries.linevaAllenna;
      if (!progress || progress.stage !== 6) return current;
      return { ...current, crossQuestSeries: { ...current.crossQuestSeries, linevaAllenna: { ...progress, alphaState } } };
    });
  }

  function finishAlphaHunt() {
    if (!game) return;
    if (modal?.kind === "alpha-hunt" && modal.replay) {
      setModal(null);
      return;
    }
    const progress = game.crossQuestSeries.linevaAllenna;
    if (!progress?.alphaState || progress.alphaState.phase !== "victory") return;
    updateGame((current) => ({
      ...current,
      flags: unique([...current.flags, "cross-la-milestone-6-seen"]),
      crossQuestSeries: { ...current.crossQuestSeries, linevaAllenna: { ...current.crossQuestSeries.linevaAllenna, stage: 7, stageStartedDay: current.day, alphaState: progress.alphaState } },
      journal: [...current.journal, "Quêtes croisées · Le cœur de la ruche · Alpha abattu"],
    }));
    setModal(null);
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
      setDialogue({ ...dialogue, spriteMoods: dialogueSpriteMoods(dialogue), lineIndex: dialogue.lineIndex + 1 });
      return;
    }
    if (dialogue.phase === "intro" && dialogue.scene.choices?.length) {
      setDialogue({ ...dialogue, spriteMoods: dialogueSpriteMoods(dialogue), phase: "choices" });
      return;
    }
    if (dialogue.scene.beats && ["response", "relation-response"].includes(dialogue.phase)) {
      const nextRound = dialogue.phase === "response" ? 0 : (dialogue.dateRound ?? 0) + 1;
      const beat = dialogue.scene.beats[nextRound];
      if (beat) { setDialogue({ ...dialogue, scene: beat.cast ? { ...dialogue.scene, cast: beat.cast } : dialogue.scene, spriteMoods: dialogueSpriteMoods(dialogue), dateRound: nextRound, lines: expandedLines(dialogue.scene, game!, beat.intro, "response"), lineIndex: 0, phase: "relation-intro" }); return; }
    }
    if (dialogue.scene.date && AUTHORED_DATE_CHARACTERS.has(dialogue.scene.date.character) && ["response", "relation-response"].includes(dialogue.phase)) {
      const nextRound = dialogue.phase === "response" ? 0 : (dialogue.dateRound ?? 0) + 1;
      const beat = authoredDateBeat(dialogue.scene.id, nextRound, dialogue.datePicks);
      if (beat) {
        setDialogue({ ...dialogue, spriteMoods: dialogueSpriteMoods(dialogue), dateRound: nextRound, lines: expandedLines(dialogue.scene, game!, beat.intro, "response"), lineIndex: 0, phase: "relation-intro" });
        return;
      }
    }
    if (dialogue.phase === "response" && dialogue.scene.route && dialogue.chosen && routeChoiceCompletes(dialogue.chosen.id)) {
      const beat = relationBeatFor(dialogue.scene.route.id, game!);
      if (beat) {
        setDialogue({
          ...dialogue, spriteMoods: dialogueSpriteMoods(dialogue),
          scene: { ...dialogue.scene, cast: "cast" in beat && beat.cast ? beat.cast : dialogue.scene.cast },
          primaryChoice: dialogue.chosen,
          chosen: undefined,
          lines: expandedLines(dialogue.scene, game!, beat.intro, "response"),
          lineIndex: 0,
          phase: "relation-intro",
        });
        return;
      }
    }
    if (dialogue.phase === "relation-intro") {
      setDialogue({ ...dialogue, spriteMoods: dialogueSpriteMoods(dialogue), phase: "relation-choices" });
      return;
    }
    closeDialogue();
  }

  function selectChoice(choice: ChoiceData) {
    if (!dialogue || !game) return;
    if (choice.requires && game.stats[choice.requires.stat] < choice.requires.value && !game.settings.unlockAll) return;
    if (!hasKnowledge(game, choice.requiresKnowledge) && !game.settings.unlockAll) return;
    if (!relationshipRequirementMet(choice, game) && !game.settings.unlockAll) return;
    const isRelationChoice = dialogue.phase === "relation-choices";
    const hasRelationBeat = Boolean(dialogue.scene.route && relationBeatFor(dialogue.scene.route.id, game));
    const authoredDateContinues = Boolean(dialogue.scene.beats?.[isRelationChoice ? (dialogue.dateRound ?? 0) + 1 : 0] || dialogue.scene.date && AUTHORED_DATE_CHARACTERS.has(dialogue.scene.date.character)
      && authoredDateBeat(dialogue.scene.id, isRelationChoice ? (dialogue.dateRound ?? 0) + 1 : 0, dialogue.datePicks));
    const route = dialogue.scene.kind === "route" && routeChoiceCompletes(choice.id) && (!hasRelationBeat || isRelationChoice)
      ? dialogue.scene.route
      : undefined;
    if (!dialogue.replay && !(dialogue.scene.hrScene && game.crossQuestSeries[HR_KEY]?.hr?.choices[dialogue.scene.id])) applyEffects(dialogue.scene.character, choice.effects, route);
    if (dialogue.scene.hrScene && !dialogue.replay) updateGame(current => {
      const p = current.crossQuestSeries[HR_KEY]; if (!p?.hr) return current;
      return { ...current, crossQuestSeries: { ...current.crossQuestSeries, [HR_KEY]: { ...p, hr: { ...p.hr, checkpoint: { sceneId: dialogue.scene.id, round: isRelationChoice ? dialogue.dateRound ?? 0 : -1, picks: [...(dialogue.datePicks || []), choice.id] } } } } };
    });
    if (!dialogue.replay && dialogue.scene.route?.id === "hylee-0") {
      const main = isRelationChoice ? dialogue.primaryChoice?.id : choice.id;
      if (main) updateGame(current => ({ ...current, flags: [
        ...current.flags.filter(flag => !flag.startsWith("hylee-return-choice:")),
        `hylee-return-choice:${main}${isRelationChoice ? `:${choice.id}` : ""}`,
      ] }));
    }
    if (!dialogue.replay && route?.id === "hylee-4" && dialogue.scene.departure) {
      const destination = dialogue.scene.departure;
      updateGame((current) => {
        const cost = travelPeriodCost(current.location, destination.location, current.player.vocation, LOCATIONS);
        const clock = current.settings.noTimeCost ? { day: current.day, period: current.period } : advanceClock(current, cost, PERIODS.length);
        return { ...current, ...clock, location: destination.location, spot: destination.spot, ...placeDiscovery(current, destination.location, destination.spot) };
      });
      setSelectedLocation(destination.location);
      setSelectedSpot(destination.spot);
    }
    if (!dialogue.replay && dialogue.scene.kind === "story" && dialogue.scene.campaignSceneId) {
      const campaign = campaignSceneById(dialogue.scene.campaignSceneId);
      if (campaign) updateGame((current) => {
        const firstRouteFlag = campaign.id === "campaign-naiah-promise" && !current.history.includes("campaign-forthaven-assault")
          ? "act1-first-route-naiah"
          : campaign.id === "campaign-forthaven-assault" && !current.history.includes("campaign-naiah-promise")
            ? "act1-first-route-forthaven"
            : undefined;
        const relationships = { ...current.relationships };
        campaign.cast.forEach((characterId) => {
          if (relationships[characterId]) relationships[characterId] = { ...relationships[characterId], met: true };
        });
        return {
          ...current,
          relationships,
          flags: unique([...current.flags, campaign.id, ...(firstRouteFlag ? [firstRouteFlag] : []), ...(campaign.id === "campaign-imperial-audience" && !current.flags.some((flag) => flag.startsWith("hylee-itinerary-start:")) ? [`hylee-itinerary-start:${current.day}`] : [])]),
          history: unique([...current.history, campaign.id]),
          sceneMemories: { ...current.sceneMemories, [campaign.id]: campaign.spot },
          journal: [...current.journal, `Acte I · Chapitre ${campaign.chapter} · ${campaign.title}`],
          codex: unique([...current.codex, campaign.title, ...campaign.cast.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name || "").filter(Boolean)]),
        };
      });
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
    if (!dialogue.replay && dialogue.scene.kind === "cross-quest" && dialogue.scene.crossQuestStage !== undefined) {
      const stage = dialogue.scene.crossQuestStage;
      updateGame((current) => {
        const progress = current.crossQuestSeries.linevaAllenna;
        if (!progress || progress.stage !== stage) return current;
        const nextStage = Math.min(8, stage + 1);
        const final = nextStage === 8;
        return {
          ...current,
          flags: unique([...current.flags, `cross-la-scene:${dialogue.scene.id}`, ...(final ? LINEVA_ALLENNA_FINAL_FLAGS : [])]),
          crossQuestSeries: { ...current.crossQuestSeries, linevaAllenna: { ...progress, stage: nextStage, stageStartedDay: current.day } },
          sceneMemories: { ...current.sceneMemories, [dialogue.scene.id]: crossSceneForStage(stage)?.spot || current.spot },
          journal: [...current.journal, `Quêtes croisées · ${crossMilestone(stage)?.title || dialogue.scene.title}${final ? " · Série terminée" : ""}`],
        };
      });
    }
    if (!dialogue.replay && dialogue.scene.kind === "date" && dialogue.scene.date && !authoredDateContinues) {
      const date = dialogue.scene.date;
      updateGame((current) => ({
        ...current,
        dateHistory: [...current.dateHistory, date.id].slice(-96),
        sceneMemories: { ...current.sceneMemories, [date.id]: date.spot },
        journal: [...current.journal, `Rendez-vous · ${date.title} avec ${CHARACTERS.find((entry) => entry.id === date.character)?.name}`],
      }));
    }
    if (!dialogue.replay && !dialogue.scene.hrScene && dialogue.scene.kind === "group-date" && dialogue.scene.groupDate) {
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
    const endingCampaign = dialogue.scene.campaignSceneId ? campaignSceneById(dialogue.scene.campaignSceneId) : undefined;
    const campaignEnding = endingCampaign ? campaignSceneOutro(endingCampaign) : [];
    const continuesToRelationBeat = !isRelationChoice && hasRelationBeat && routeChoiceCompletes(choice.id) && !injectedEnding.length;
    const authoredEnding = dialogue.scene.hrScene || continuesToRelationBeat || authoredDateContinues
      ? []
      : injectedEnding.length
      ? injectedEnding
      : campaignEnding.length
        ? campaignEnding
        : sceneClosure(dialogue.scene.id);
    const response = opening
      ? [opening, ...choice.response, ...authoredEnding]
      : [...choice.response, ...authoredEnding];
    setDialogue({
      ...dialogue, spriteMoods: dialogueSpriteMoods(dialogue),
      scene: isRelationChoice && dialogue.scene.beats?.[dialogue.dateRound ?? 0]?.responseCast ? { ...dialogue.scene, cast: dialogue.scene.beats[dialogue.dateRound ?? 0].responseCast } : dialogue.scene,
      chosen: choice,
      datePicks: dialogue.scene.hrScene || dialogue.scene.date && AUTHORED_DATE_CHARACTERS.has(dialogue.scene.date.character) ? [...(dialogue.datePicks || []), choice.id] : dialogue.datePicks,
      lines: expandedLines(dialogue.scene, game, response, "response"),
      lineIndex: 0,
      phase: isRelationChoice ? "relation-response" : "response",
    });
  }

  function closeDialogue(abortReplay = false) {
    if (!dialogue) return;
    const chainedCrossReplay = !abortReplay
      && dialogue.replay
      && dialogue.replayNextCrossStage !== undefined
      && Boolean(dialogue.chosen)
      && dialogue.lineIndex >= dialogue.lines.length - 1
      && dialogue.phase === "response";
    if (chainedCrossReplay) {
      const nextStage = dialogue.replayNextCrossStage!;
      setDialogue(null);
      startCrossQuestScene(nextStage, true);
      return;
    }
    if (dialogue.scene.hrScene && !dialogue.replay) {
      if (!dialogue.chosen || dialogue.lineIndex < dialogue.lines.length - 1 || !["response", "relation-response"].includes(dialogue.phase) || dialogue.scene.beats?.[dialogue.phase === "response" ? 0 : (dialogue.dateRound ?? 0) + 1]) return;
      updateGame(current => {
        const p = current.crossQuestSeries[HR_KEY]; if (!p?.hr) return current;
        if (p.hr.choices[dialogue.scene.id] && !dialogue.scene.id.startsWith("cross-hr-recognition")) return { ...current, crossQuestSeries: { ...current.crossQuestSeries, [HR_KEY]: { ...p, hr: { ...p.hr, checkpoint: undefined } } } };
        const choices = { ...p.hr.choices, [dialogue.scene.id]: dialogue.datePicks || [dialogue.chosen!.id] };
        let hr = { ...p.hr, choices, checkpoint: undefined };
        let stage = p.stage, flags = current.flags;
        const isDate = Boolean(dialogue.scene.groupDate);
        if (dialogue.scene.id === "cross-hr-07-prepare") hr.prepared = true;
        else if (dialogue.scene.id.startsWith("cross-hr-recognition")) {
          const configuration = dialogue.chosen!.id.replace("cross-hr-config-", "") as NonNullable<typeof hr.configuration>;
          hr = { ...hr, configuration, recognitionDay: current.day };
          if (configuration === "accepted") flags = unique([...flags, HR_OPEN]);
        } else if (!isDate) stage = Math.min(7, stage + 1);
        const due = HR_LETTERS.filter(l => l.stage <= stage && !p.letters.some(e => l.id === e.id)).map(l => ({ id: l.id, receivedDay: current.day, read: false }));
        return { ...current, flags, crossQuestSeries: { ...current.crossQuestSeries, [HR_KEY]: { ...p, hr, stage, stageStartedDay: current.day, letters: [...p.letters, ...due] } }, groupDateHistory: isDate ? unique([...current.groupDateHistory, dialogue.scene.id]) : current.groupDateHistory, sceneMemories: { ...current.sceneMemories, [dialogue.scene.id]: current.spot }, journal: [...current.journal, `${isDate ? "Rendez-vous" : "Quêtes croisées"} · Hylee & Remerii · ${dialogue.scene.title}`] };
      });
    }
    if (!dialogue.replay && dialogue.scene.route?.id === "hylee-0" && game
      && game.relationships.hylee.stage >= 1 && game.relationships.remerii.stage === 0
      && !game.history.includes("remerii-0")) {
      const route = relationRouteVariant(sceneFor("remerii", 0)!, game).route;
      const scene: SceneView = { ...route, cast: route.cast || ["remerii"], background: dialogue.scene.background, kind: "route", route };
      setDialogue({ scene, lines: expandedLines(scene, game, scene.intro, "intro"), lineIndex: 0, phase: "intro" });
      return; // Une conversation continue, sans voyage ni avancement d'heure.
    }
    if (dialogue.scene.kind === "intro" && !dialogue.replay) {
      updateGame((current) => ({
        ...current,
        flags: unique([...current.flags, "story-saidin-met", "story-phoenix-token", "story-route-algratal"]),
        relationships: { ...current.relationships, saidin: { ...current.relationships.saidin, met: true } },
        journal: current.flags.includes("story-saidin-met") ? current.journal : [...current.journal, "Saidin vous a confié le jeton du Phénix et indiqué la route d'Al’Gratal."],
        codex: unique([...current.codex, "Saidin", "Jeton du Phénix"]),
      }));
    }
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
    const dateCanBecomeIntimate = Boolean(date
      && dialogue.chosen
      && (["lineva", "allenna"].includes(date.character) || AUTHORED_DATE_CHARACTERS.has(date.character)
        ? true
        : game!.settings.unlockAll || (dialogue.chosen.dateOutcome === "great"
          && game!.relationships[date.character].stage >= 4
          && game!.relationships[date.character].affection + (dialogue.chosen.effects.affection || 0) >= 34
          && game!.relationships[date.character].trust + (dialogue.chosen.effects.trust || 0) >= 32)));
    const groupDateCanBecomeIntimate = Boolean(groupDate && !groupDate.intimacyDisabled
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
          && relation.desire + (changes.desire || 0) >= (groupDate.intimacyMinDesire ?? groupDate.minDesire)
        );
      }));
    setDialogue(null);
    if (!replay && groupDateCanBecomeIntimate && groupDate) {
      setModal({ kind: "group-date-result", groupDateId: groupDate.id });
    } else if (!replay && dateCanBecomeIntimate && date) {
      setModal({ kind: "date-result", character: date.character, dateId: date.id });
    } else if (intimateCharacter) {
      setModal({ kind: "intimacy", character: intimateCharacter, background, replay });
    } else if (consumesTime && !date && !groupDate && !dialogue.scene.departure) {
      advancePeriod();
    }
  }

  function travel(locationId: string, spotId: string) {
    if (!game) return;
    const location = LOCATIONS.find((entry) => entry.id === locationId);
    const spot = spotById(spotId);
    if (!location || !spot || spot.location !== locationId || !locationUnlocked(game, locationId)) return;
    if (game.location === locationId && game.spot === spotId) return;
    const hylee = CHARACTERS.find((entry) => entry.id === "hylee")!;
    const farewell = sceneFor("hylee", 4)!;
    const hyleePlace = characterPlace(hylee, game.day, game.period, game.flags, game.housing);
    if (locationId !== game.location && game.relationships.hylee.stage === 4
      && hyleePlace.spot === game.spot && routeNarrativeReady(farewell, game)
      && game.relationships.hylee.affection + game.relationships.hylee.trust >= BOND_THRESHOLDS[4]) {
      const intro = farewell.intro.map((line) => line.text === "Oui. Je voulais te voir avant de reprendre la route."
        ? { ...line, text: `Oui. Je pars vers ${location.name}. Il faut que je me mette en marche.` } : line);
      const scene: SceneView = {
        ...farewell, intro, background: spotById(game.spot)?.background || routeBackground(farewell),
        cast: ["hylee"], kind: "route", route: farewell, departure: { location: locationId, spot: spotId },
      };
      setPlacePanel(null);
      setDialogue({ scene, lines: expandedLines(scene, game, intro, "intro"), lineIndex: 0, phase: "intro" });
      return;
    }
    const periods = travelPeriodCost(game.location, locationId, game.player.vocation, LOCATIONS);
    updateGame((current) => {
      const clock = current.settings.noTimeCost ? { day: current.day, period: current.period } : advanceClock(current, periods, PERIODS.length);
      return { ...current, ...clock, location: locationId, spot: spotId, ...placeDiscovery(current, locationId, spotId) };
    });
    setPlacePanel(null);
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
      serviceTimeLeft: SERVICE_TIME_LIMIT,
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
    // Gains réels affichés par la fenêtre de réaction (mêmes formules que la mise à jour ci-dessous).
    const before = game.relationships[characterId];
    const reaction: V2GiftReaction = { character: characterId, giftId, liked, affection: clamp(before.affection + (liked ? 6 : 2)) - before.affection, trust: clamp(before.trust + (liked ? 3 : 1)) - before.trust };
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
    setModal({ kind: "notice", title: liked ? "Un présent qui touche juste" : "Une attention remarquée", text: liked ? `${character.name} reconnaît immédiatement l’attention derrière ce choix.` : `${character.name} accepte le présent avec curiosité. L’intention compte, même si l’objet ne lui correspond pas tout à fait.`, consumeTime: true, gift: reaction });
  }

  function buyProperty(propertyId: string) {
    if (!game) return;
    const property = propertyById(propertyId);
    const city = property && LOCATIONS.find((entry) => entry.id === property.location);
    if (!property || !city || !locationUnlocked(game, city.id)) return;
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
    if (!homeDateUnlocked(game, characterId)) return;
    if (DEDICATED_HOME_DATE_CHARACTERS.has(characterId)) {
      const property = propertyById(game.housing.propertyId)!;
      const day = game.day + 1;
      updateGame((current) => ({ ...current, day, period: 3, location: property.location, spot: property.spot, ...placeDiscovery(current, property.location, property.spot) }));
      setSelectedLocation(property.location);
      setSelectedSpot(property.spot);
    }
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
        day: DEDICATED_HOME_DATE_CHARACTERS.has(characterId) ? current.day : current.day + 1,
        period: 3,
        location: property.location,
        spot: property.spot,
        ...placeDiscovery(current, property.location, property.spot),
        relationships: { ...current.relationships, [characterId]: relation },
        inventory,
        housing: {
          ...current.housing,
          homeDateHistory: [...current.housing.homeDateHistory, `${characterId}:${tone}@${DEDICATED_HOME_DATE_CHARACTERS.has(characterId) ? current.day : current.day + 1}`].slice(-96),
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
    const canBecomeIntimate = tone === "desir" && (game.settings.unlockAll || (
      relation.stage >= (["lineva", "hylee", "remerii", "naiah"].includes(characterId) ? 5 : 4) && relationAfter.affection >= 34 && relationAfter.trust >= 32 && relationAfter.desire >= 24 && (DEDICATED_HOME_DATE_CHARACTERS.has(characterId) || score >= 3) && (!intimateCity || intimateCity === property.location)
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
    const canBecomeIntimate = pair.id === "allenna-lineva" && tone === "desir" && (game.settings.unlockAll || pair.characters.every((id) => game.relationships[id].desire + 7 >= 25));
    setModal(canBecomeIntimate
      ? { kind: "home-pair-date-result", pairId }
      : { kind: "notice", title: score >= 5 ? "Trois présences, un nouveau souvenir" : "Une visite partagée", text: `La dynamique entre ${pair.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name).join(" et ")} a laissé une trace nouvelle dans votre logis. Ce rencard restera distinct de vos moments à deux.` });
  }

  function startHomePairIntimacy(pairId: string) {
    if (!game || pairId !== "allenna-lineva") return;
    const property = propertyById(game.housing.propertyId);
    const contextId = "group-date-allenna-lineva-home";
    const played = game.housing.homeDateHistory.some((entry) => entry.startsWith(`pair:${pairId}:desir@`));
    if (!property || !played || (!game.settings.unlockAll && !["allenna", "lineva"].every((id) => game.relationships[id].desire >= 25))) return;
    setModal({ kind: "group-intimacy", groupDateId: contextId, background: property.background });
  }

  function startHomeIntimacy(characterId: string) {
    const property = game && propertyById(game.housing.propertyId);
    const hasCompletedDesiredDate = game?.housing.homeDateHistory.some((entry) => entry.startsWith(`${characterId}:desir@`));
    if (!game || !property || !hasCompletedDesiredDate) return;
    if (DEDICATED_HOME_DATE_CHARACTERS.has(characterId) && !game.settings.unlockAll) {
      const relation = game.relationships[characterId];
      const lastDate = game.housing.homeDateHistory.at(-1);
      if (relation.stage < 5 || relation.affection < 34 || relation.trust < 32 || relation.desire < 24
        || lastDate !== `${characterId}:desir@${game.day}` || game.location !== property.location || game.spot !== property.spot) return;
    }
    if (characterId === "naiah" && game.player.sex === "intersexe") return;
    setModal({ kind: "intimacy", character: characterId, background: property.background, home: true });
  }

  function startDate(dateId: string) {
    if (!game) return;
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!date || !publicDateUnlocked(game, date)) return;
    const periodIndex = Math.max(0, PERIODS.findIndex((period) => period.id === date.period));
    const scheduledDay = game.day + 1;
    const nextGame: GameState = {
      ...game,
      day: scheduledDay,
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
    setGame(evolveLivingWorld(evolveCrossQuests(nextGame)));
    setSelectedLocation(date.location);
    setSelectedSpot(date.spot);
    setModal(null);
    setDialogue({ scene, lines: expandedLines(scene, nextGame, date.intro, "intro"), lineIndex: 0, phase: "intro" });
  }

  function startGroupDate(groupDateId: string) {
    if (!game) return;
    let date = GROUP_DATES.find((entry) => entry.id === groupDateId);
    if (!date || !groupDateUnlocked(game, date)) return;
    const home = date.home ? propertyById(game.housing.propertyId) : undefined;
    if (date.home && !home) return;
    if (home) date = { ...date, location: home.location, spot: home.spot };
    const periodIndex = Math.max(0, PERIODS.findIndex((period) => period.id === date.period));
    const nextGame: GameState = {
      ...game,
      day: game.day + (game.crossQuestSeries[HR_KEY]?.hr?.checkpoint?.sceneId === date.id ? 0 : 1),
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
      ...(date.authoredBeats ? { hrScene: true, beats: HR_DATE_BEATS[date.id], music: date.music } : {}),
    };
    if (scene.hrScene) {
      const progress = nextGame.crossQuestSeries[HR_KEY];
      if (progress?.hr && progress.hr.checkpoint?.sceneId !== date.id) nextGame.crossQuestSeries = { ...nextGame.crossQuestSeries, [HR_KEY]: { ...progress, hr: { ...progress.hr, checkpoint: { sceneId: date.id, round: -1, picks: [] } } } };
    }
    setGame(evolveLivingWorld(evolveCrossQuests(nextGame)));
    setSelectedLocation(date.location);
    setSelectedSpot(date.spot);
    setModal(null);
    if (scene.hrScene) { openHRDialogue(scene, nextGame); return; }
    setDialogue({ scene, lines: expandedLines(scene, nextGame, date.intro, "intro", date.spot), lineIndex: 0, phase: "intro" });
  }

  function startDateIntimacy(dateId: string) {
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    const refactoredDate = Boolean(date && (["lineva", "allenna"].includes(date.character) || AUTHORED_DATE_CHARACTERS.has(date.character)));
    const desireReady = !refactoredDate || Boolean(game?.settings.unlockAll || (game && date && game.relationships[date.character].desire >= (date.minDesire || 22)));
    if (!game || !date || !desireReady || !game.dateHistory.includes(date.id) || !publicDateUnlocked(game, date) || (date.character === "naiah" && game.player.sex === "intersexe")) return;
    setModal({ kind: "intimacy", character: date.character, dateId: date.id, background: date.intimacySetting.background || spotById(date.spot)?.background });
  }

  function finishDateEnding(dateId: string, friendlyForThisDate: boolean) {
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!game || !date || (!["lineva", "allenna"].includes(date.character) && !AUTHORED_DATE_CHARACTERS.has(date.character)) || !game.dateHistory.includes(date.id)) return;
    const character = CHARACTERS.find((entry) => entry.id === date.character)!;
    if (friendlyForThisDate) {
      updateGame((current) => ({
        ...current,
        flags: withoutObsoletePermanentFriendshipFlags(current.flags),
        journal: [...current.journal, `Rendez-vous avec ${character.name} · proximité amicale choisie pour « ${date.title} ».`],
      }));
      setModal({
        kind: "notice",
        title: "Une soirée amicale",
        text: `${character.name} reçoit votre réponse sans la discuter. Cette soirée se termine dans une proximité amicale, sans fermer les conversations ni les rendez-vous suivants.`,
      });
      return;
    }
    setModal({
      kind: "notice",
      title: "Pas ce soir",
      text: `${character.name} garde votre main une seconde, puis acquiesce. La soirée se termine sans rupture et les prochains rendez-vous restent ouverts.`,
    });
  }

  function startGroupDateIntimacy(groupDateId: string) {
    const date = groupIntimacyContextById(groupDateId);
    if (date?.intimacyDisabled) return;
    if (!game || !date) return;
    const standaloneHomeContext = date.id === "group-date-allenna-lineva-home";
    const played = standaloneHomeContext
      ? game.housing.homeDateHistory.some((entry) => entry.startsWith("pair:allenna-lineva:desir@"))
      : game.groupDateHistory.includes(date.id);
    const desireReady = game.settings.unlockAll || date.characters.every((id) => game.relationships[id].desire >= (date.intimacyMinDesire ?? date.minDesire));
    if (!played || !desireReady || (!standaloneHomeContext && !groupDateUnlocked(game, date))) return;
    const background = date.home
      ? propertyById(game.housing.propertyId)?.background
      : spotById(date.spot)?.background;
    setModal({ kind: "group-intimacy", groupDateId: date.id, background });
  }

  function finishTrioEnding(groupDateId: string, friendlyForThisDate: boolean) {
    const date = groupIntimacyContextById(groupDateId);
    if (!game || !date) return;
    const names = date.characters
      .map((id) => CHARACTERS.find((character) => character.id === id)?.name || id)
      .join(" & ");
    if (friendlyForThisDate) {
      updateGame((current) => ({
        ...current,
        flags: withoutObsoletePermanentFriendshipFlags(current.flags),
        journal: [...current.journal, `${names} · complicité amicale choisie pour « ${date.title} ».`],
      }));
      setModal({ kind: "notice", title: "Une soirée complice", text: "Ce rendez-vous se termine sur une complicité amicale. Les prochaines conversations et les futures possibilités à trois restent entièrement ouvertes." });
    } else {
      setModal({ kind: "notice", title: "Pas ce soir", text: "La proximité demeure. Aucune porte n’est fermée pour un prochain rendez-vous." });
    }
  }

  function closeIntimacy(completed: boolean, memory?: string) {
    if (!modal || modal.kind !== "intimacy") return;
    if (completed && !modal.replay) {
      const memoryKey = `intimacy:${modal.home ? `home:${modal.character}` : modal.dateId || modal.character}`;
      updateGame((current) => ({
        ...current,
        flags: unique([
          ...current.flags,
          ...(modal.dateId ? [`date-intimate:${modal.dateId}`] : []),
          ...(modal.home ? [`home-intimate:${modal.character}`] : []),
          ...(modal.character === "remerii" ? ["remerii-intimacy-lived"] : []),
          ...(modal.character === "lineva" ? ["lineva-tutoiement"] : []),
        ]),
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
        flags: unique([...current.flags, `group-date-intimate:${modal.groupDateId}`, ...(modal.groupDateId.includes("allenna-lineva") ? ["lineva-tutoiement"] : [])]),
        sceneMemories: memory ? { ...current.sceneMemories, [memoryKey]: memory } : current.sceneMemories,
      }));
    }
    setModal(null);
  }

  function replayDateIntimacy(dateId: string) {
    const date = DATE_SCENES.find((entry) => entry.id === dateId);
    if (!date || !game?.flags.includes(`date-intimate:${date.id}`) || (date.character === "naiah" && game.player.sex === "intersexe")) return;
    setModal({ kind: "intimacy", character: date.character, dateId: date.id, background: date.intimacySetting.background || spotById(date.spot)?.background, replay: true });
  }

  function replayGroupDateIntimacy(groupDateId: string) {
    const date = groupIntimacyContextById(groupDateId);
    if (!date || !game?.flags.includes(`group-date-intimate:${date.id}`)) return;
    const homeBackground = date.id.endsWith("-home") ? propertyById(game.housing.propertyId)?.background : undefined;
    setModal({ kind: "group-intimacy", groupDateId: date.id, background: homeBackground || spotById(date.spot)?.background, replay: true });
  }

  function openDevIntimacy(target: DevIntimacyTarget) {
    if (!game?.settings.developer) return;
    setDialogue(null);
    setV2Dialog(null);
    if (target.kind === "date") {
      const date = DATE_SCENES.find((entry) => entry.id === target.dateId);
      if (!date) return;
      setModal({
        kind: "intimacy",
        character: date.character,
        dateId: date.id,
        background: date.intimacySetting.background || spotById(date.spot)?.background,
        replay: true,
      });
      return;
    }
    if (target.kind === "home") {
      const property = propertyById(game.housing.propertyId);
      if (!property || !HOME_DATE_PROFILES[target.character]) {
        setModal({ kind: "notice", title: "Logis requis", text: "Installez d’abord un logis de test depuis les outils développeur." });
        return;
      }
      setModal({ kind: "intimacy", character: target.character, background: property.background, home: true, replay: true });
      return;
    }
    const date = groupIntimacyContextById(target.groupDateId);
    if (!date) return;
    const homeBackground = date.home || date.id.endsWith("-home") ? propertyById(game.housing.propertyId)?.background : undefined;
    setModal({ kind: "group-intimacy", groupDateId: date.id, background: homeBackground || spotById(date.spot)?.background, replay: true });
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
    const targetPeriod = Math.max(0, PERIODS.findIndex((entry) => entry.id === campaign.period));
    const travelCost = travelPeriodCost(game.location, campaign.location, game.player.vocation, LOCATIONS);
    const afterTravel = game.settings.noTimeCost ? { day: game.day, period: game.period } : advanceClock(game, travelCost, PERIODS.length);
    const waitPeriods = (targetPeriod - afterTravel.period + PERIODS.length) % PERIODS.length;
    const arrival = game.settings.noTimeCost
      ? { day: game.day, period: targetPeriod }
      : advanceClock(afterTravel, waitPeriods, PERIODS.length);
    const sceneGame = { ...game, ...arrival, location: campaign.location, spot: campaign.spot };
    const intro = campaignSceneDialogue(campaign, sceneGame);
    const scene: SceneView = {
      id: campaign.id,
      title: campaign.title,
      background: campaign.background,
      mood: campaign.mood,
      character: campaign.lead,
      cast: campaign.cast,
      intro,
      choices: campaign.choices,
      kind: "story",
      campaignSceneId: campaign.id,
    };
    updateGame((current) => ({
      ...current,
      ...arrival,
      location: campaign.location,
      spot: campaign.spot,
      ...placeDiscovery(current, campaign.location, campaign.spot),
      journal: [...current.journal, `Campagne · En route vers ${spotById(campaign.spot)?.name || campaign.title}`],
    }));
    setSelectedLocation(campaign.location);
    setSelectedSpot(campaign.spot);
    setMapDestinationOpen(false);
    setDialogue({ scene, lines: expandedLines(scene, sceneGame, intro, "intro", campaign.spot), lineIndex: 0, phase: "intro" });
  }

  function replayCampaignScene(sceneId: string) {
    if (!game || !game.history.includes(sceneId)) return;
    const campaign = campaignSceneById(sceneId);
    if (!campaign) return;
    const intro = campaignSceneDialogue(campaign, game);
    const scene: SceneView = {
      id: campaign.id,
      title: campaign.title,
      background: campaign.background,
      mood: campaign.mood,
      character: campaign.lead,
      cast: campaign.cast,
      intro,
      choices: campaign.choices,
      kind: "story",
      campaignSceneId: campaign.id,
    };
    setDialogue({ scene, lines: expandedLines(scene, game, intro, "intro", campaign.spot), lineIndex: 0, phase: "intro", replay: true });
  }

  function replayRoute(sceneId: string) {
    const route = ROUTE_SCENES.find((scene) => scene.id === sceneId);
    if (!route || !game) return;
    const playable = relationRouteVariant(route, game);
    const scene: SceneView = { ...playable.route, id: playable.sceneId, background: routeBackground(playable.route), cast: playable.route.cast || [playable.route.character], kind: "route", route: playable.route };
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
    const scene: SceneView = { id: date.id, title: date.title, background: spotById(game.sceneMemories[date.id] || date.spot)?.background || backgroundUrl("streets"), mood: date.mood || first.defaultMood, character: first.id, cast: date.characters, intro: date.intro, choices: date.choices, kind: "group-date", groupDate: date, ...(date.authoredBeats ? { hrScene: true, beats: HR_DATE_BEATS[date.id], music: date.music } : {}) };
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
      rankPrevRef.current = loaded; dayStartRef.current = loaded; setDayRecap(null);
      setGame(loaded);
      setPlayer(loaded.player);
      setSelectedLocation(loaded.location);
      setSelectedSpot(loaded.spot);
      setMapDestinationOpen(false);
      setDialogue(null);
      setModal(null);
      setV2Dialog(null);
      setLinksView("liens");
      setTab("place");
      setScreen("game");
      pushNotification({ kind: "story", title: `Chronique chargée · emplacement ${slot}`, detail: `${loaded.player.name} · Jour ${loaded.day} · ${PERIODS[loaded.period].label}` });
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
        rankPrevRef.current = loaded; dayStartRef.current = loaded; setDayRecap(null);
        setGame(loaded);
        setPlayer(loaded.player);
        setSelectedLocation(loaded.location);
        setSelectedSpot(loaded.spot);
        setDialogue(null);
        setTab("place");
        setScreen("game");
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

  const sons = v2Prefs.sons;
  const toggleSons = () => { setUiPrefs({ sons: !uiPrefs().sons }); if (uiPrefs().sons) sfx("valider"); };
  const toggleTitleMusic = () => setUiPrefs({ titleMusic: !uiPrefs().titleMusic });
  const goStory = () => { window.location.href = "../index.html"; };
  const closeV2 = () => setV2Dialog(null);
  const autosave = hasSave ? v2SlotDetails("auto") : undefined;
  const savesCount = (autosave ? 1 : 0) + Object.keys(slotInfo).length;
  const legacyNotice = modal?.kind === "notice" ? <div className="v2-legacy-layer"><SimpleModal title={modal.title} text={modal.text} onClose={() => (modal.consumeTime ? closeActivityNotice() : setModal(null))} /></div> : null;
  const commonLayers = <>
    <canvas id="fx" ref={fxCanvasRef} aria-hidden="true" />
    <div id="v2-transition" className="transition" aria-hidden="true"><i /><i /><i /></div>
  </>;
  const titleDialogs = v2Dialog && <div className="v2 v2-calque">
    {v2Dialog.kind === "load" && <V2Dialog key="load" surtitre="Reprendre une chronique" titre="Charger" classe="large" onClose={closeV2}><V2SaveSlots game={game} mode="load" onSave={() => undefined} onLoad={(slot) => { closeV2(); loadSlot(slot); }} onLoadAuto={() => { closeV2(); continueGame(); }} version={slotVersion} /></V2Dialog>}
    {v2Dialog.kind === "options" && <V2Dialog key="options" surtitre="Configuration" titre="Options" classe="large" onClose={closeV2}><V2OptionsBody game={screen === "game" ? game : null} updateGame={screen === "game" ? updateGame : undefined} cats={screen === "game" ? ["affichage", "audio", "acces"] : ["affichage", "audio", "acces", "session"]} sons={sons} onToggleSons={toggleSons} titleMusic={v2Prefs.titleMusic} onToggleTitleMusic={toggleTitleMusic} onSave={saveSlot} onLoad={(slot) => { closeV2(); loadSlot(slot); }} onExport={exportSave} onImport={(event) => { closeV2(); importSave(event); }} onTitle={() => { closeV2(); setScreen("title"); }} onStory={() => setV2Dialog({ kind: "story" })} slotVersion={slotVersion} layout="dialog" /></V2Dialog>}
    {v2Dialog.kind === "about" && <V2Dialog key="about" surtitre="Chronique Alternative" titre="À propos du Mode libre" classe="etroit" onClose={closeV2} pied={<button type="button" className="btn principal" data-close onClick={closeV2}>Compris</button>}><p className="texte grand">Une chronique parallèle au Visual Novel : vous vivez librement en Sylvinia, choisissez vos lieux, vos journées et les liens que vous tissez.</p><ul className="puces"><li>{CHARACTERS.length} personnages, des rendez-vous seul à seul et à trois</li><li>Campagne de l’Acte I en {MAIN_STORY.length} chapitres, quêtes croisées</li><li>Jobs, logis, présents et correspondance</li><li>Intimité réglable (18+), sauvegarde locale sur cet appareil</li></ul><p className="discret">Univers, personnages et continuité d’après <em>Chroniques de Sylvinia</em>, le Visual Novel Sylvinia et Les mondes du Chroniqueur. Illustrations, sprites et thèmes musicaux adaptés des ressources autorisées de ces projets.</p></V2Dialog>}
    {v2Dialog.kind === "story" && <V2Dialog key="story" surtitre="Quitter la branche alternative" titre="Retour au Mode Histoire" classe="etroit" onClose={closeV2} pied={<><button type="button" className="btn" data-close onClick={closeV2}>Rester</button><button type="button" className="btn principal" data-act="confirmer-histoire" onClick={goStory}>Revenir au Visual Novel ▸</button></>}><p className="texte grand">Le Visual Novel principal va s’ouvrir.</p><p className="discret">{screen === "game" ? "Votre chronique est enregistrée automatiquement : « Continuer » la reprendra exactement ici." : "Vos sauvegardes de la Chronique Alternative restent sur cet appareil."}</p></V2Dialog>}
    {v2Dialog.kind === "new" && <V2Dialog key="new" surtitre="Nouvelle chronique" titre="Recommencer ?" classe="etroit" onClose={closeV2} pied={<><button type="button" className="btn" data-close onClick={closeV2}>Annuler</button><button type="button" className="btn principal" data-act="confirmer-nouvelle" onClick={() => { closeV2(); setScreen("creator"); }}>Créer un personnage ▸</button></>}><p className="texte grand">La sauvegarde automatique {autosave ? `(${autosave.name} · Jour ${autosave.day})` : ""} sera remplacée dès le début du prologue.</p><p className="discret">Les emplacements manuels 1 à 3 sont conservés. Pensez à y sauvegarder la chronique actuelle si vous souhaitez la garder.</p></V2Dialog>}
  </div>;

  if (screen === "title") {
    return <>
      {commonLayers}
      <div className="v2 v2-root v2-ecran-titre" onPointerDownCapture={() => { if (v2Prefs.titleMusic) { const audio = titleAudioRef.current; if (audio && audio.paused) void audio.play().catch(() => undefined); } }}>
        <audio ref={titleAudioRef} src={`${import.meta.env.BASE_URL}assets/menu/chroniques-alternatives-theme.mp3`} loop preload="auto" onLoadedMetadata={(event) => { event.currentTarget.volume = .45; }} />
        <V2Title
          hasSave={hasSave}
          saveSummary={autosave ? `${autosave.name} · Jour ${autosave.day} · ${autosave.place.split(" · ")[0] || autosave.period}` : undefined}
          savesCount={savesCount}
          music={v2Prefs.titleMusic}
          onToggleMusic={toggleTitleMusic}
          sons={sons}
          onToggleSons={toggleSons}
          dialogOpen={Boolean(v2Dialog) || Boolean(modal)}
          onAction={(action) => {
            if (action === "continuer") void playTransition("encre").then(continueGame);
            else if (action === "nouvelle") { if (hasSave) setV2Dialog({ kind: "new" }); else void playTransition("encre").then(() => setScreen("creator")); }
            else if (action === "charger") { refreshSlots(); setSlotVersion((v) => v + 1); setV2Dialog({ kind: "load" }); }
            else if (action === "options") setV2Dialog({ kind: "options" });
            else if (action === "apropos") setV2Dialog({ kind: "about" });
            else setV2Dialog({ kind: "story" });
          }}
        />
        {titleDialogs}
      </div>
      {legacyNotice}
    </>;
  }

  if (screen === "creator") {
    return <>
      {commonLayers}
      <div className="v2 v2-root v2-ecran-creation">
        <V2Creation player={player} setPlayer={setPlayer} onBack={() => setScreen("title")} onBegin={() => void playTransition("encre").then(begin)} music={v2Prefs.titleMusic} onToggleMusic={toggleTitleMusic} sons={sons} onToggleSons={toggleSons} />
      </div>
      {legacyNotice}
    </>;
  }

  if (!game) return null;

  const period = PERIODS[game.period];
  const currentLocation = LOCATIONS.find((location) => location.id === game.location) || LOCATIONS[0];
  const currentSpot = spotById(game.spot) || spotById(DEFAULT_SPOTS[currentLocation.id])!;
  const currentSpots = spotsForLocation(currentLocation.id).filter((spot) => !spot.housing || spot.id === propertyById(game.housing.propertyId)?.spot);
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
  const soundtrack = modal?.kind === "anchor-operation" ? "serres-operation" : dialogue?.scene.music ? dialogue.scene.music : modal?.kind === "alpha-hunt"
    ? "alpha-chases"
    : musicForContext(game.spot, { locationId: game.location, intimacy: modal?.kind === "intimacy" || modal?.kind === "group-intimacy", prologue: dialogue?.scene.kind === "intro" });
  const soundtrackLabel = MUSIC_LABELS[soundtrack] || "Musique de Sylvinia";
  const anchorModalState = modal?.kind === "anchor-operation"
    ? modal.replay ? modal.state : game.crossQuestSeries[HR_KEY]?.hr?.anchor
    : undefined;
  const sceneActive = Boolean(dialogue || modal?.kind === "intimacy" || modal?.kind === "group-intimacy" || modal?.kind === "home-date" || modal?.kind === "home-pair-date" || modal?.kind === "alpha-hunt" || modal?.kind === "anchor-operation");
  const pendingMail = game.letters.filter((entry) => !entry.read).length + (game.crossQuestSeries.linevaAllenna?.letters.filter((entry) => !entry.read).length || 0) + game.invitations.filter((entry) => entry.status === "pending").length;
  const badges: Partial<Record<V2Tab, number>> = { journal: pendingMail };
  const unread = v2Log.filter((entry) => !entry.read).length;
  const v2Tab = tab as V2Tab;
  const toggleMusic = () => updateGame((current) => ({ ...current, settings: { ...current.settings, music: !current.settings.music } }));
  const background = v2Tab === "place" ? currentSpot.background
    : v2Tab === "map" ? "/assets/map.png"
      : v2Tab === "relations" ? (linksView === "fiche" && ficheId ? spotById(characterPlace(CHARACTERS.find((c) => c.id === ficheId) || CHARACTERS[0], game.day, game.period, game.flags, game.housing).spot)?.background : undefined) || "/assets/backgrounds/purple_forest.webp"
        : v2Tab === "journal" ? "/assets/backgrounds/deep_archives.webp"
          : v2Tab === "jobs" ? "/assets/backgrounds/streets.webp"
            : v2Tab === "inventory" ? propertyById(game.housing.propertyId)?.background || "/assets/backgrounds/streets.webp"
              : v2Tab === "codex" ? "/assets/backgrounds/miraldas_archives.webp"
                : "/assets/backgrounds/throne_room.webp";
  const sceneName = v2Tab === "place" ? "lieu" : v2Tab === "map" ? "carte" : v2Tab === "relations" ? linksView : v2Tab === "inventory" ? "biens" : v2Tab;
  const hints: Record<string, React.ReactNode> = {
    lieu: <><Kbd>↑</Kbd><Kbd>↓</Kbd> Commande <Kbd>Entrée</Kbd> Valider</>,
    carte: <><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd> Destination <Kbd>Entrée</Kbd> Voyager</>,
    fiche: <><Kbd>←</Kbd><Kbd>→</Kbd> Naviguer</>,
  };
  const openFiche = (id: string) => { setFicheId(id); setLinksView("fiche"); setTab("relations"); };
  const locateOnMap = (locationId: string, spotId: string) => { setSelectedLocation(locationId); setSelectedSpot(spotId); goTab("map", true); };
  const legacyJournal = (section: "crossed" | "relations" | "memories") => <JournalView embedded forcedSection={section} game={game} onHRScene={startHRScene} onOperation={startAnchorOperation} onHRLetter={readHRLetter} onStartCampaign={startCampaignScene} onReplayCampaign={replayCampaignScene} onReplayRoute={replayRoute} onReplaySocial={replaySocial} onReplaySecret={replaySecret} onReplayWorldEvent={replayWorldEvent} onReplayDate={replayDate} onReplayDateIntimacy={replayDateIntimacy} onReplayGroupDate={replayGroupDate} onReplayGroupDateIntimacy={replayGroupDateIntimacy} onStartCrossQuest={startCrossQuestScene} onStartAlphaHunt={startAlphaHunt} onReadCrossLetter={readCrossLetter} onWaitForCrossTimeline={waitForCrossTimeline} onWaitForRoute={waitForRoute} onReadLetter={readLetter} onOpenInvitation={(invitationId) => setModal({ kind: "invitation", invitationId })} />;
  const optionsProps = { game, updateGame, sons, onToggleSons: toggleSons, onSave: (slot: number) => { saveSlot(slot); setSlotVersion((v) => v + 1); }, onLoad: (slot: number) => { closeV2(); loadSlot(slot); }, onExport: exportSave, onImport: importSave, onTitle: () => { closeV2(); setScreen("title"); }, onStory: () => setV2Dialog({ kind: "story" }), onDevOpenIntimacy: openDevIntimacy, slotVersion };
  const rank = rankQueue[0];
  const rankCharacter = rank ? CHARACTERS.find((entry) => entry.id === rank.id) : undefined;
  const showRank = Boolean(rank && rankCharacter && !dialogue && !modal && !v2Dialog);
  const dialogJob = v2Dialog?.kind === "job" ? JOBS.find((job) => job.id === v2Dialog.jobId) : undefined;
  const dialogDate = v2Dialog?.kind === "date" ? DATE_SCENES.find((date) => date.id === v2Dialog.dateId) : undefined;
  const ownedProperty = propertyById(game.housing.propertyId);

  return (
    <>
      {commonLayers}
      {game.settings.music && <audio ref={audioRef} key={soundtrack} src={`/assets/audio/${soundtrack}.mp3`} onLoadedMetadata={(event) => { event.currentTarget.volume = audioVolume / 100; }} autoPlay loop />}
      <div className={`v2 v2-root jeu ${V2_PERIOD_CLASSES[game.period] || ""} ${sceneActive ? "scene-active" : ""}`} data-scene={sceneName} inert={sceneActive || undefined}>
        <V2Fond src={background} flou={v2Tab !== "place"} />
        <div className="eclairage" aria-hidden="true" />
        <V2Hud game={game} tab={v2Tab} onTab={(next) => goTab(next)} badges={badges} unread={unread} onRegistre={() => setV2Dialog({ kind: "registre" })} onPause={() => setV2Dialog({ kind: "pause" })} music={game.settings.music} onToggleMusic={toggleMusic} soundtrackLabel={soundtrackLabel} />
        <main id="scene" className={`scene scene-${sceneName}`} tabIndex={-1} key={`${v2Tab}-${linksView}`}>
          {v2Tab === "place" && <V2Lieu game={game} location={currentLocation} spot={currentSpot} spots={currentSpots} present={presentCharacters} visible={visibleCharacters} visitors={upcomingVisitors} event={spontaneousEvent} rumor={localRumor}
            onTalk={openCharacterScene} onGift={(id) => setModal({ kind: "gift", character: id })} onDate={(id) => setModal({ kind: "date-planner", character: id })} onFiche={openFiche}
            onActivity={performActivity} onJob={openJob} onWait={v2Wait} onWaitFor={() => setV2Dialog({ kind: "wait" })} onMap={() => locateOnMap(game.location, game.spot)} onSpot={(spotId) => travel(currentLocation.id, spotId)} onEvent={openSpontaneousEvent} onRumor={hearRumor} />}
          {v2Tab === "map" && <V2Carte game={game} visible={visibleCharacters} selectedLocation={selectedLocation} selectedSpot={selectedSpot} onSelectLocation={setSelectedLocation} onSelectSpot={setSelectedSpot} onTravel={(locationId, spotId) => { void playTransition("encre").then(() => travel(locationId, spotId)); }} onPlace={() => goTab("place")} />}
          {v2Tab === "relations" && linksView === "liens" && <V2Liens game={game} onView={setLinksView} onFiche={openFiche} />}
          {v2Tab === "relations" && linksView === "fiche" && <V2Fiche game={game} characterId={ficheId} onView={setLinksView} onFiche={setFicheId} onGift={(id) => setModal({ kind: "gift", character: id })} onDate={(id) => setModal({ kind: "date-planner", character: id })} onLocate={locateOnMap} onDossier={(id) => setModal({ kind: "character", character: id })} onWaitRoute={waitForRoute} />}
          {v2Tab === "relations" && linksView === "rdv" && <V2Rdv game={game} onView={setLinksView} onDate={(date) => setV2Dialog({ kind: "date", dateId: date.id })} onHome={(id) => setModal({ kind: "date-planner", character: id })} />}
          {v2Tab === "relations" && linksView === "trio" && <V2Trio game={game} onView={setLinksView} onStart={(id) => startGroupDate(id)} />}
          {v2Tab === "journal" && <V2Journal game={game} onStartCampaign={startCampaignScene} onReadLetter={readLetter} onReadCrossLetter={readCrossLetter} onInvitation={(invitationId) => setModal({ kind: "invitation", invitationId })} onLocateSpot={(spotId) => { const spot = spotById(spotId); if (spot) locateOnMap(spot.location, spot.id); }} legacy={legacyJournal} />}
          {v2Tab === "jobs" && <V2Jobs game={game} onJob={(job) => setV2Dialog({ kind: "job", jobId: job.id })} />}
          {v2Tab === "inventory" && <V2Biens game={game} present={presentCharacters} onShop={() => setModal({ kind: "shop" })} onGive={giveGift} onHousing={() => setV2Dialog({ kind: "housing" })} onSell={() => setV2Dialog({ kind: "sell" })} onDisplaySlot={(slot) => setV2Dialog({ kind: "display", slot })} onResidents={() => setV2Dialog({ kind: "residents" })} />}
          {v2Tab === "codex" && <V2Codex game={game} />}
          {v2Tab === "options" && <V2Options {...optionsProps} />}
        </main>
        <footer className="hints-jeu" aria-hidden="true">{hints[sceneName] || <><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd> Naviguer <Kbd>Entrée</Kbd> Valider</>}<span className="sep" /><Kbd>Q</Kbd><Kbd>E</Kbd> Onglets <Kbd>Échap</Kbd> {v2Tab === "relations" && linksView !== "liens" ? "Retour" : "Menu"}</footer>
        <nav className="nav-mobile" aria-label="Navigation">
          {V2_TABS.slice(0, 4).map(([id, label, icon]) => <button type="button" key={id} data-onglet={id} className={v2Tab === id ? "actif" : ""} aria-current={v2Tab === id ? "page" : undefined} onClick={() => goTab(id)}><i>{icon}</i><span>{label}</span>{badges[id] ? <b className="pastille">{badges[id]}</b> : null}</button>)}
          <button type="button" data-onglet="plus" className={["jobs", "inventory", "codex", "options"].includes(v2Tab) ? "actif" : ""} onClick={() => setV2Dialog({ kind: "plus" })}><i>☰</i><span>Plus</span>{unread > 0 && <b className="pastille">{unread}</b>}</button>
        </nav>
      </div>

      <div className={`v2 v2-calque ${dialogue ? "en-scene" : ""}`}>
        <V2Toasts toasts={notifications.map((entry) => ({ id: entry.id, type: V2_NOTIF[entry.kind].type, icon: V2_NOTIF[entry.kind].icon, label: V2_NOTIF[entry.kind].label, title: entry.title, detail: entry.detail, t: "", read: false }))} onDismiss={(id) => setNotifications((current) => current.filter((entry) => entry.id !== id))} />
        {timeJump && <V2TimeJump day={timeJump.day} period={timeJump.period} leaving={timeJump.leaving} />}
        {dayRecap && !timeJump && !showRank && !dialogue && !modal && !v2Dialog && <V2BilanJour key={`${dayRecap.from.day}-${dayRecap.to.day}`} from={dayRecap.from} to={dayRecap.to} onClose={() => setDayRecap(null)} />}
        {showRank && rank && rankCharacter && <V2RankUp character={rankCharacter} from={rank.from} to={rank.to} leaving={rankLeaving} onClose={dismissRank} />}
        {titleDialogs}
        {v2Dialog?.kind === "pause" && <V2Dialog key="pause" surtitre="Pause" titre="Menu système" classe="pause" onClose={closeV2}>
          <div className="pause-grille"><ul className="pause-menu">{([["reprendre", "▶", "Reprendre"], ["sauver", "▤", "Sauvegarder"], ["charger", "⟲", "Charger"], ["options", "⚙", "Options"], ["registre", "✉", "Registre"], ["titre", "⏻", "Écran titre"], ["histoire", "↩", "Mode Histoire"]] as const).map(([id, icon, label], index) => <li key={id}><button type="button" className={`pause-item ${index === 0 ? "principal" : ""}`} data-p={id} style={{ "--i": index } as React.CSSProperties} onClick={() => {
            if (id === "reprendre") closeV2();
            else if (id === "sauver") { refreshSlots(); setSlotVersion((v) => v + 1); setV2Dialog({ kind: "save" }); }
            else if (id === "charger") { refreshSlots(); setSlotVersion((v) => v + 1); setV2Dialog({ kind: "load" }); }
            else if (id === "options") { closeV2(); goTab("options", true); }
            else if (id === "registre") setV2Dialog({ kind: "registre" });
            else if (id === "titre") { closeV2(); void playTransition("encre").then(() => { setDialogue(null); setModal(null); setScreen("title"); }); }
            else setV2Dialog({ kind: "story" });
          }}><i>{icon}</i><span>{label}</span></button></li>)}</ul>
            <aside className="pause-etat"><div className="pe-img" style={{ backgroundImage: `url(${currentSpot.background})` }} /><b>{game.player.name}</b><small>Jour {game.day} · {period.label} {period.time}</small><small>{currentSpot.name} · {currentLocation.name}</small><div className="pe-l"><span>Pièces</span><b>◈ {game.coins}</b></div><div className="pe-l"><span>Liens</span><b>{CHARACTERS.filter((c) => game.relationships[c.id].met).length} / {CHARACTERS.length}</b></div><div className="pe-l"><span>Chapitre</span><b>{Math.min(storyProgress(game.history, game.flags) + 1, MAIN_STORY.length)} / {MAIN_STORY.length}</b></div></aside></div>
        </V2Dialog>}
        {v2Dialog?.kind === "save" && <V2Dialog key="save" surtitre="Chronique" titre="Sauvegarder" classe="large" onClose={closeV2}><V2SaveSlots game={game} mode="save" onSave={(slot) => { saveSlot(slot); setSlotVersion((v) => v + 1); pushNotification({ kind: "story", title: `Sauvegardé · emplacement ${slot}`, detail: `Jour ${game.day} · ${period.label} · ${currentSpot.name}` }); }} onLoad={() => undefined} version={slotVersion} /></V2Dialog>}
        {v2Dialog?.kind === "plus" && <V2Dialog key="plus" surtitre="Menu" titre="Plus" classe="etroit plus" onClose={closeV2}><div className="plus-grille">{([["jobs", "◈", "Jobs", "Contrats et pièces"], ["inventory", "⌂", "Biens", "Inventaire et logis"], ["codex", "✧", "Codex", "Encyclopédie"], ["options", "⚙", "Options", "Réglages"], ["registre", "✉", "Registre", "Notifications"], ["pause", "▤", "Système", "Sauvegarder, titre"]] as const).map(([id, icon, label, detail]) => <button type="button" key={id} className="plus-tuile" data-plus={id} onClick={() => { if (id === "registre") setV2Dialog({ kind: "registre" }); else if (id === "pause") setV2Dialog({ kind: "pause" }); else { closeV2(); goTab(id, true); } }}><i>{icon}</i><b>{label}</b><small>{detail}</small>{id === "registre" && unread > 0 && <em className="pastille">{unread}</em>}</button>)}</div></V2Dialog>}
        {v2Dialog?.kind === "registre" && <V2Dialog key="registre" surtitre="Notifications de la session" titre="Registre" classe="etroit" onClose={closeV2} pied={<><button type="button" className="btn" data-act="toutlu" onClick={() => setV2Log((current) => current.map((entry) => ({ ...entry, read: true })))}>Tout marquer comme lu</button><button type="button" className="btn principal" data-close onClick={closeV2}>Fermer</button></>}>{v2Log.length ? <ul className="registre">{v2Log.map((entry) => <li key={entry.id} className={`t-${entry.type} ${entry.read ? "" : "nonlu"}`}><span className="t-ico"><b>{entry.icon}</b></span><div><strong>{entry.title}</strong><small>{entry.label}{entry.detail ? ` · ${entry.detail}` : ""}</small></div><time>{entry.t}</time></li>)}</ul> : <p className="discret">Aucune notification depuis l’ouverture de la chronique. Les déblocages, lettres, objets et progrès de relation s’afficheront ici.</p>}</V2Dialog>}
        {v2Dialog?.kind === "wait" && <V2Dialog key="wait" surtitre="Rythme du monde" titre="Attendre quelqu’un" classe="etroit" onClose={closeV2}><div className="dons">{upcomingVisitors.map(({ character, target }) => <button type="button" key={character.id} className="choix-don" data-attendre={character.id} onClick={() => { closeV2(); waitForCharacter(character.id); }}><Seau color={character.color} portrait={character.portrait} /><span><b>{character.name}</b><small>{PERIODS[target.period].icon} {PERIODS[target.period].label} · Jour {target.day} · {target.place.action}</small></span><span className="cd-n">{waitDurationLabel(game, target)}</span></button>)}{!upcomingVisitors.length && <p className="discret">Aucun passage connu n’est prévu prochainement dans ce lieu.</p>}</div></V2Dialog>}
        {v2Dialog?.kind === "job" && dialogJob && (() => {
          const spot = spotById(dialogJob.spot); const location = LOCATIONS.find((entry) => entry.id === spot?.location); const access = jobAccess(game, dialogJob); const local = dialogJob.spot === game.spot; const run = game.jobRuns[dialogJob.id] || 0;
          return <V2Dialog key="job" surtitre={`${JOB_KIND_LABELS[dialogJob.kind]} · ${dialogJob.employer}`} titre={dialogJob.title} classe="etroit" onClose={closeV2} pied={<><button type="button" className="btn" data-close onClick={closeV2}>Retour</button><button type="button" className="btn principal" data-act="go" onClick={() => { closeV2(); if (!access.unlocked || local) openJob(dialogJob); else if (spot) locateOnMap(spot.location, spot.id); }}>{!access.unlocked ? "Voir la condition" : local ? "Commencer ▸" : "Localiser ⌖"}</button></>}>
            <div className="job-illu" style={{ backgroundImage: `url(${spot?.background || ""})` }}><span className="af-gain">+{dialogJob.reward} <i>◈</i></span></div>
            <p className="texte">{dialogJob.description}</p>
            <div className="job-meta"><span>⌖ {spot?.name} · {location?.name}</span><span>Prochaine session · {jobSessionLabel(dialogJob, run)}</span><span>{run ? `${run} rotation${run > 1 ? "s" : ""} jouée${run > 1 ? "s" : ""}` : "Banque intacte"}</span></div>
            {!access.unlocked && <ul className="conditions"><li className="ko"><span>Lien avec {access.characterName}</span><b>{access.value} / {access.target}</b></li></ul>}
          </V2Dialog>;
        })()}
        {v2Dialog?.kind === "date" && dialogDate && (() => {
          const character = CHARACTERS.find((entry) => entry.id === dialogDate.character)!; const relation = game.relationships[character.id]; const open = publicDateUnlocked(game, dialogDate); const spot = spotById(dialogDate.spot); const datePeriod = PERIODS.find((entry) => entry.id === dialogDate.period);
          const conditions: [string, boolean, string][] = [["Rang", relation.stage >= dialogDate.unlockStage, `${ROMAINS[relation.stage]} / ${ROMAINS[dialogDate.unlockStage]}`], ["Affection", relation.affection >= dialogDate.minAffection, `${relation.affection} / ${dialogDate.minAffection}`], ["Confiance", relation.trust >= dialogDate.minTrust, `${relation.trust} / ${dialogDate.minTrust}`]];
          return <V2Dialog key="date" surtitre={`Rendez-vous · ${character.name}`} titre={dialogDate.title} classe="etroit" onClose={closeV2} pied={<><button type="button" className="btn" data-close onClick={closeV2}>Retour</button><button type="button" className="btn principal" data-act="plan" disabled={!open} onClick={() => { closeV2(); startDate(dialogDate.id); }}>{open ? "Planifier ▸" : "🔒 Verrouillé"}</button></>}>
            <div className="job-illu" style={{ backgroundImage: `url(${spot?.background || ""})` }}><Seau color={character.color} portrait={character.portrait} className="grand" /></div>
            <p className="texte">{dialogDate.description}</p>
            <div className="job-meta"><span>{datePeriod?.icon} {datePeriod?.label} · le lendemain</span><span>⌖ {spot?.name}</span><span>{dialogDate.type}</span></div>
            <ul className="conditions">{conditions.map(([name, ok, text]) => <li key={name} className={ok || game.settings.unlockAll ? "ok" : "ko"}><span>{name}</span><b>{text}</b></li>)}</ul>
          </V2Dialog>;
        })()}
        {v2Dialog?.kind === "housing" && <V2Dialog key="housing" surtitre="Agences de Sylvinia" titre={ownedProperty ? "Changer de logis" : "Acheter un logis"} classe="large" onClose={closeV2}><div className="logis-liste">{LOCATIONS.filter((city) => ["algratal", "forthaven", "miraldas", "akuhn"].includes(city.id) && locationUnlocked(game, city.id)).flatMap((city) => { const discount = housingDiscount(city.id, game.relationships); return HOUSING_PROPERTIES.filter((entry) => entry.location === city.id).map((property) => { const price = discountedPropertyPrice(property, game.relationships); const balance = price - housingSaleValue(game.housing); const current = property.id === ownedProperty?.id; return <article key={property.id} className={`lg-carte ${current ? "sel" : ""}`}><span className="lg-img" style={{ backgroundImage: `url(${property.background})` }} /><div><span className="surtitre">{city.name} · Gamme {ROMAINS[property.tier] || property.tier}{discount.percent ? ` · remise ${discount.percent} %` : ""}</span><b>{property.name}</b><small>{property.category} · {price} ◈</small></div><button type="button" className="btn petit" data-acheter={property.id} disabled={current || balance > game.coins} onClick={() => { buyProperty(property.id); closeV2(); }}>{current ? "Actuel" : ownedProperty ? balance > 0 ? `Échanger · ${balance} ◈` : `Échanger · +${Math.abs(balance)} ◈` : `${price} ◈`}</button></article>; }); })}</div></V2Dialog>}
        {v2Dialog?.kind === "sell" && ownedProperty && <V2Dialog key="sell" surtitre="Immobilier" titre="Vendre ce logis ?" classe="etroit" onClose={closeV2} pied={<><button type="button" className="btn" data-close onClick={closeV2}>Garder</button><button type="button" className="btn principal danger" onClick={() => { sellProperty(); closeV2(); }}>Vendre · {housingSaleValue(game.housing)} ◈</button></>}><p className="texte grand">{ownedProperty.name} sera revendu {housingSaleValue(game.housing)} ◈.</p><p className="discret">Les résidents quitteront le logis et la vitrine sera vidée.</p></V2Dialog>}
        {v2Dialog?.kind === "residents" && <V2Dialog key="residents" surtitre="Vie commune" titre="Habitant·es du logis" classe="etroit" onClose={closeV2}><p className="discret">Étape relationnelle 3 et confiance 24 requises.</p><div className="dons">{visibleCharacters.map((character) => { const relation = game.relationships[character.id]; const resident = game.housing.residents.includes(character.id); const eligible = game.settings.unlockAll || (relation.stage >= 3 && relation.trust >= 24); return <button type="button" key={character.id} className={`choix-don ${resident ? "aime" : ""}`} disabled={!eligible} data-resident={character.id} onClick={() => toggleResident(character.id)}><Seau color={character.color} portrait={character.portrait} /><span><b>{character.name}</b><small>{resident ? "Vit dans ce logis · libérer la chambre" : eligible ? "Inviter à vivre ici" : `Étape ${relation.stage}/3 · confiance ${relation.trust}/24`}</small></span>{resident && <em>⌂ Résident</em>}</button>; })}</div></V2Dialog>}
        {v2Dialog?.kind === "display" && <V2Dialog key="display" surtitre="Vitrine personnelle" titre={`Emplacement ${v2Dialog.slot + 1}`} classe="etroit" onClose={closeV2}><div className="dons"><button type="button" className="choix-don" onClick={() => { setDisplayedItem(v2Dialog.slot, ""); closeV2(); }}><span className="od-ico petit"><i>◇</i></span><span><b>Ne rien exposer</b><small>Libérer cet emplacement</small></span></button>{DISPLAY_ITEMS.filter((item) => (game.inventory[item.id] || 0) > 0).map((item) => <button type="button" key={item.id} className={`choix-don ${game.housing.displayed[v2Dialog.slot] === item.id ? "aime" : ""}`} onClick={() => { setDisplayedItem(v2Dialog.slot, item.id); closeV2(); }}><span className="od-ico petit"><i>{item.icon}</i></span><span><b>{item.name}</b><small>{item.description}</small></span><span className="cd-n">×{game.inventory[item.id]}</span></button>)}</div></V2Dialog>}
      </div>

      {dialogue && <DialogueOverlay dialogue={dialogue} game={game} onAdvance={advanceDialogue} onChoice={selectChoice} onClose={() => dialogue.scene.kind === "intro" || dialogue.replay ? closeDialogue(true) : undefined} />}
      {modal?.kind === "anchor-operation" && anchorModalState && <AnchorOperationModal state={anchorModalState} replay={modal.replay} onChange={setAnchorState} onClose={() => setModal(null)} onFinish={() => modal.replay ? setModal(null) : startHRScene(6)} />}
      {modal && modal.kind !== "anchor-operation" && <GameModal
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
        finishDateEnding={finishDateEnding}
        finishHomeDate={finishHomeDate}
        finishHomePairDate={finishHomePairDate}
        startHomePairIntimacy={startHomePairIntimacy}
        startHomeIntimacy={startHomeIntimacy}
        onIntimacyClose={closeIntimacy}
        startGroupDate={startGroupDate}
        startGroupDateIntimacy={startGroupDateIntimacy}
        finishTrioEnding={finishTrioEnding}
        onGroupIntimacyClose={closeGroupIntimacy}
        replyToLetter={replyToLetter}
        replyToCrossLetter={replyToCrossLetter}
        setAlphaHuntState={setAlphaHuntState}
        finishAlphaHunt={finishAlphaHunt}
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
    </>
  );
}

function TitleScreen({ hasSave, onNew, onContinue, onChronicle, onOptions, modal, closeModal }: { hasSave: boolean; onNew: () => void; onContinue: () => void; onChronicle: () => void; onOptions: () => void; modal: ModalState; closeModal: () => void }) {
  const titleAudioRef = useRef<HTMLAudioElement>(null);
  const [titleMuted, setTitleMuted] = useState(false);
  const [titleAudioStarted, setTitleAudioStarted] = useState(false);
  const ensureTitleMusic = useCallback(() => {
    const audio = titleAudioRef.current;
    if (!audio || titleMuted || !audio.paused) return;
    void audio.play().then(() => setTitleAudioStarted(true)).catch(() => setTitleAudioStarted(false));
  }, [titleMuted]);

  useEffect(() => { ensureTitleMusic(); }, [ensureTitleMusic]);

  const toggleTitleMusic = () => {
    const audio = titleAudioRef.current;
    if (!audio) return;
    if (titleMuted || audio.paused || !titleAudioStarted) {
      audio.muted = false;
      setTitleMuted(false);
      void audio.play().then(() => setTitleAudioStarted(true)).catch(() => setTitleAudioStarted(false));
      return;
    }
    audio.muted = true;
    setTitleMuted(true);
  };

  return <main className="title-screen atlas-title-screen" onPointerDownCapture={ensureTitleMusic}>
    <video className="title-backdrop-video" autoPlay loop muted playsInline preload="auto" poster={`${import.meta.env.BASE_URL}assets/hero.jpg`} aria-hidden="true"><source src={`${import.meta.env.BASE_URL}assets/menu/chroniques-alternatives.mp4`} type="video/mp4" /></video>
    <audio ref={titleAudioRef} src={`${import.meta.env.BASE_URL}assets/menu/chroniques-alternatives-theme.mp3`} autoPlay loop preload="auto" onLoadedMetadata={(event) => { event.currentTarget.volume = .45; }} onPlay={() => setTitleAudioStarted(true)} onPause={() => setTitleAudioStarted(false)} />
    <div className="atlas-title-shade" />
    <section className="atlas-title-identity"><p>Le Chroniqueur Vagabond présente</p><h1>Sylvinia</h1><strong>Chroniques Alternatives</strong><span>Une autre voie. Les mêmes mondes.</span></section>
    <nav className="atlas-title-menu" aria-label="Menu principal">
      <button className="major" onClick={onNew}><span>Nouvelle chronique</span><small>Franchir le portail</small></button>
      <button disabled={!hasSave} onClick={onContinue}><span>Continuer</span><small>{hasSave ? "Reprendre la dernière sauvegarde" : "Aucune sauvegarde locale"}</small></button>
      <button onClick={onChronicle}><span>À propos de cette chronique</span><small>Continuité, principe et avertissements</small></button>
      <button onClick={onOptions}><span>Préférences</span><small>Son et présentation</small></button>
      <a href="../index.html"><span>Mode Histoire</span><small>Retour au Visual Novel principal</small></a>
    </nav>
    <button className="title-sound-control" onClick={toggleTitleMusic} aria-label={titleMuted ? "Activer la musique du menu" : "Couper la musique du menu"}><span>{titleMuted ? "♩" : "♫"}</span><small>{titleMuted ? "Musique coupée" : titleAudioStarted ? "Thème du menu" : "Activer la musique"}</small></button>
    <p className="title-footer">Une chronique libre dans les mondes de Sylvinia · Sauvegarde locale</p>
    {modal?.kind === "chronicle" && <ChronicleModal onClose={closeModal} />}
    {modal?.kind === "title-options" && <div className="modal-backdrop atlas-title-options" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="title-options-heading"><button className="modal-close" onClick={closeModal} aria-label="Fermer">×</button><p className="eyebrow">Préférences rapides</p><h2 id="title-options-heading">Avant de franchir le portail</h2><p>Le volume du thème peut être contrôlé ici. Les profils Cinématique, Équilibré, Compact et Complet, la taille de l’interface et tous les réglages d’accessibilité restent disponibles à tout moment dans la chronique.</p><button className="secondary-action" onClick={toggleTitleMusic}>{titleMuted ? "Activer le thème" : "Couper le thème"}</button></section></div>}
    {modal?.kind === "notice" && <SimpleModal title={modal.title} text={modal.text} onClose={closeModal} />}
  </main>;
}

function CreatorScreen({ player, setPlayer, onBack, onBegin }: { player: Player; setPlayer: (player: Player) => void; onBack: () => void; onBegin: () => void }) {
  const [explicitWarning, setExplicitWarning] = useState(false);
  const [step, setStep] = useState(0);
  const screenRef = useRef<HTMLElement>(null);
  const initial = player.name.trim().charAt(0).toUpperCase() || "?";
  const steps = ["Identité", "Écho", "Vocation", "Présence"];
  useEffect(() => { screenRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [step]);
  return <main className="creator-screen atlas-creator-screen" ref={screenRef}>
    <header className="screen-header"><button className="back-button" onClick={onBack}>← Titre</button><div><p className="eyebrow">Prologue · La personne entre les mondes</p><h1>Façonnez votre présence</h1></div><span className="step-pill">Adulte · 18+</span></header>
    <nav className="atlas-creator-progress" aria-label="Étapes de création">{steps.map((label, index) => <button type="button" key={label} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => index <= step && setStep(index)}><span>{index < step ? "✓" : index + 1}</span><strong>{label}</strong></button>)}</nav>
    <div className="creator-layout">
      <aside className="creator-preview"><div className="avatar-frame"><div className="avatar-glow" /><div className="avatar-hair" style={{ background: player.hair }} /><div className="avatar-head" style={{ background: player.skin }}><i style={{ background: player.eyes }} /><i style={{ background: player.eyes }} /></div><div className="avatar-body" /><strong>{initial}</strong></div><div className="preview-copy"><span className="kicker">Votre chronique</span><h2>{player.name || "Nom encore inconnu"}</h2><p>{player.age} ans · {player.pronouns} · {player.sex}</p><blockquote>« Mon passé s’est effacé. Ce que je choisirai ici, en revanche, m’appartiendra. »</blockquote></div><div className="preview-stats">{TRAITS.map(([name]) => <div key={name} className={name === player.trait ? "is-primary" : ""}><span>{name}</span><b>{name === player.trait ? 7 : 4}</b></div>)}</div></aside>
      <section className="creator-form atlas-creator-form">
        {step === 0 && <FormSection number="01" title="Identité" detail="Le monde emploiera ces informations dans les dialogues."><div className="form-grid two"><label>Nom ou prénom<input autoFocus value={player.name} maxLength={24} placeholder="Votre nom" onChange={(event) => setPlayer({ ...player, name: event.target.value })} /></label><label>Âge adulte<input type="number" min={18} max={120} value={player.age} onChange={(event) => setPlayer({ ...player, age: Number(event.target.value) })} /></label></div><p className="creator-field-label">Pronoms employés</p><div className="choice-row">{(["elle", "iel", "il"] as Pronouns[]).map((pronouns) => <button key={pronouns} className={player.pronouns === pronouns ? "selected" : ""} onClick={() => setPlayer({ ...player, pronouns })}>{pronouns}</button>)}</div></FormSection>}
        {step === 1 && <FormSection number="02" title="Écho résiduel" detail="Votre mémoire est vide, mais certains réflexes ont traversé le portail avec vous."><div className="card-choices">{ECHOES.map(([name, detail]) => <button key={name} className={player.origin === name ? "selected" : ""} onClick={() => setPlayer({ ...player, origin: name })}><strong>{name}</strong><small>{detail}</small></button>)}</div></FormSection>}
        {step === 2 && <FormSection number="03" title="Vocation & tempérament" detail="La place que vous choisissez de construire à Al’Gratal, et non un passé dont vous vous souviendriez."><div className="form-grid two"><label>Vocation choisie<select value={player.vocation} onChange={(event) => setPlayer({ ...player, vocation: event.target.value })}>{VOCATIONS.map(([name]) => <option key={name}>{name}</option>)}</select></label><label>Facette dominante<select value={player.trait} onChange={(event) => setPlayer({ ...player, trait: event.target.value })}>{TRAITS.map(([name]) => <option key={name}>{name}</option>)}</select></label></div><p className="trait-note">{TRAITS.find(([name]) => name === player.trait)?.[1]}</p><div className="creator-trait-preview">{TRAITS.map(([name, detail]) => <button key={name} type="button" className={player.trait === name ? "selected" : ""} onClick={() => setPlayer({ ...player, trait: name })}><strong>{name}</strong><small>{detail}</small></button>)}</div></FormSection>}
        {step === 3 && <FormSection number="04" title="Présence & intimité" detail="Le sexe adapte les scènes intimes ; il ne détermine ni vos pronoms ni vos relations."><div className="swatch-grid"><ColorField label="Cheveux" value={player.hair} onChange={(hair) => setPlayer({ ...player, hair })} /><ColorField label="Yeux" value={player.eyes} onChange={(eyes) => setPlayer({ ...player, eyes })} /><ColorField label="Peau" value={player.skin} onChange={(skin) => setPlayer({ ...player, skin })} /></div><p className="creator-field-label">Corps du personnage</p><div className="choice-row sex-choice">{(["femme", "intersexe", "homme"] as PlayerSex[]).map((sex) => <button key={sex} className={player.sex === sex ? "selected" : ""} onClick={() => setPlayer({ ...player, sex })}>{sex === "femme" ? "Femme" : sex === "homme" ? "Homme" : "Intersexe"}</button>)}</div><p className="creator-field-label">Niveau de narration intime</p><div className="intimacy-options">{([["tendre", "Tendre", "Romance, baisers et proximité douce"], ["suggestif", "Suggestif", "Sensuel sans description anatomique"], ["explicite", "Explicite", "Narration adulte détaillée, sans coupure"], ["ellipse", "Fondu au noir", "Toute intimité reste hors champ"]] as [Intimacy, string, string][]).map(([id, title, detail]) => <button key={id} className={player.intimacy === id ? "selected" : ""} onClick={() => id === "explicite" && player.intimacy !== "explicite" ? setExplicitWarning(true) : setPlayer({ ...player, intimacy: id })}><strong>{title}</strong><small>{detail}</small></button>)}</div></FormSection>}
        <div className="creator-submit"><button className="secondary-action" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Étape précédente</button><div><strong>{step === 3 ? "Votre personnage est-il prêt ?" : `${step + 1} / ${steps.length} · ${steps[step]}`}</strong><small>{step === 3 ? "Une sauvegarde automatique sera créée au début du prologue." : "Vos choix peuvent encore être modifiés."}</small></div>{step < 3 ? <button className="primary-action" disabled={step === 0 && (!player.name.trim() || player.age < 18)} onClick={() => setStep((current) => Math.min(3, current + 1))}>Continuer</button> : <button className="primary-action" disabled={!player.name.trim() || player.age < 18} onClick={onBegin}>Franchir le portail</button>}</div>
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

function dialogueSpriteMoods(dialogue: DialogueState): Record<string, string> {
  const moods = { ...dialogue.spriteMoods };
  for (const line of dialogue.lines.slice(0, dialogue.lineIndex + 1)) {
    const speaker = speakerCharacterIds(line.speaker, dialogue.scene.cast)[0];
    if (speaker && line.mood) moods[speaker] = line.mood;
  }
  return moods;
}

function DialogueOverlay({ dialogue, game, onAdvance, onChoice, onClose }: { dialogue: DialogueState; game: GameState; onAdvance: () => void; onChoice: (choice: ChoiceData) => void; onClose: () => void }) {
  const currentLine = dialogue.lines[dialogue.lineIndex];
  const choosing = dialogue.phase === "choices" || dialogue.phase === "relation-choices";
  const activeIds = currentLine ? speakerCharacterIds(currentLine.speaker, dialogue.scene.cast) : [];
  const availableChoices = choicesForDialogue(dialogue, game);
  const stableMoods = dialogue.scene.cast.includes("hylee") ? dialogueSpriteMoods(dialogue) : undefined;
  const sceneLabel = dialogue.scene.kind === "story" ? "Histoire principale" : dialogue.scene.kind === "route" ? "Scène de relation" : dialogue.scene.kind === "intro" ? "Prologue" : dialogue.scene.kind === "social" ? "Liens croisés" : dialogue.scene.kind === "date" ? "Rendez-vous" : dialogue.scene.kind === "secret" ? "Confidence personnelle" : dialogue.scene.kind === "world" ? "Événement spontané" : dialogue.scene.kind === "invitation" ? "Invitation" : dialogue.scene.kind === "home" ? "Moment au logis" : "Moment libre";
  // Historique (backlog) : chaque réplique affichée et chaque choix pris pendant la scène, dans l’ordre.
  const [backlog, setBacklog] = useState<V2BacklogEntry[]>([]);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const backlogRef = useRef<HTMLDivElement>(null);
  const lastLogged = useRef("");
  useEffect(() => { setBacklog([]); lastLogged.current = ""; }, [dialogue.scene.id]);
  useEffect(() => {
    if (choosing || !currentLine) return;
    const key = `${dialogue.scene.id}|${dialogue.phase}|${dialogue.lineIndex}|${currentLine.speaker}|${currentLine.text}`;
    if (lastLogged.current === key) return;
    lastLogged.current = key;
    const speakerId = speakerCharacterIds(currentLine.speaker, dialogue.scene.cast)[0];
    setBacklog((entries) => [...entries, { speaker: replacePlayer(currentLine.speaker, game.player), text: replacePlayer(currentLine.text, game.player), color: CHARACTERS.find((entry) => entry.id === speakerId)?.color, narration: currentLine.speaker === "Narration" }]);
  }, [choosing, currentLine, dialogue.scene.id, dialogue.phase, dialogue.lineIndex, dialogue.scene.cast, game.player]);
  const choose = (choice: ChoiceData) => { setBacklog((entries) => [...entries, { speaker: "Votre choix", text: choice.text, choice: true }]); onChoice(choice); };
  useEffect(() => {
    if (!backlogOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key.toLowerCase() === "h") { event.preventDefault(); event.stopPropagation(); setBacklogOpen(false); } };
    window.addEventListener("keydown", onKey, true);
    requestAnimationFrame(() => { const list = backlogRef.current; if (list) list.scrollTop = list.scrollHeight; });
    return () => window.removeEventListener("keydown", onKey, true);
  }, [backlogOpen]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (!backlogOpen && event.key.toLowerCase() === "h" && !(event.target as HTMLElement)?.closest?.("input, textarea")) { event.preventDefault(); setBacklogOpen(true); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backlogOpen]);
  const speakerId = currentLine ? speakerCharacterIds(currentLine.speaker, dialogue.scene.cast)[0] : undefined;
  const speakerColor = CHARACTERS.find((entry) => entry.id === speakerId)?.color;
  return <section className="dialogue-overlay v2-scene" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.15), rgba(5,6,12,.72)), url(${backgroundUrl(dialogue.scene.background)})` }} onWheel={(event) => { if (event.deltaY < -20 && !backlogOpen && backlog.length > 1) setBacklogOpen(true); }}>
    <div className="scene-top"><div className="scene-titre"><p className="eyebrow">{dialogue.replay ? "Souvenir · aucun gain" : sceneLabel}</p><h2>{dialogue.scene.title}</h2></div><div className="scene-outils"><button type="button" className="scene-outil" data-act="backlog" disabled={!backlog.length} aria-label="Historique des répliques" onClick={() => setBacklogOpen(true)}><span aria-hidden="true">☰</span><b>Historique</b><kbd>H</kbd></button>{(dialogue.scene.kind === "intro" || dialogue.replay) && <button type="button" className="scene-outil passer" onClick={onClose}>{dialogue.replay ? "Quitter le souvenir" : "Passer le prologue"}</button>}</div></div>
    <div className={`scene-cast cast-${dialogue.scene.cast.length}`}>{dialogue.scene.cast.map((id, index) => {
      const character = CHARACTERS.find((entry) => entry.id === id);
      if (!character) return null;
      const active = activeIds.includes(id);
      const lineMood = active && (activeIds.length === 1 || activeIds[0] === id) ? currentLine?.mood : undefined;
      const mood = stableMoods
        ? stableMoods[id] || (id === dialogue.scene.cast[0] ? dialogue.scene.mood : character.defaultMood)
        : active ? (lineMood || moodForCharacter(id, `${dialogue.scene.id}-${dialogue.lineIndex}-${id}`, dialogue.scene.mood)) : character.defaultMood;
      return <img key={id} className={`scene-sprite ${active ? "active" : "inactive"} speaker-${index}`} src={spritePath(id, mood, character.defaultMood)} onError={(event) => recoverMissingSprite(event, character.portrait)} alt={character.name} />;
    })}</div>
    <div className="dialogue-gradient" />
    {!choosing ? <button className={`dialogue-box ${currentLine.speaker === "Narration" ? "narration" : ""}`} style={{ "--c": speakerColor || "var(--or)" } as React.CSSProperties} onClick={onAdvance}>
      <span className="speaker">{replacePlayer(currentLine.speaker, game.player)}</span><p key={`${dialogue.phase}-${dialogue.lineIndex}`}>{replacePlayer(currentLine.text, game.player)}</p><small>{dialogue.lineIndex + 1} / {dialogue.lines.length}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
    </button> : <div className="choice-box"><p className="choice-question">{dialogue.scene.date?.character === "hylee" && dialogue.phase === "relation-choices" ? "Que faire ensuite ?" : dialogue.phase === "relation-choices" ? "Que laisser paraître après l’action ?" : "Comment répondre ?"}</p>{availableChoices.map((choice, choiceIndex) => {
      const statLocked = Boolean(choice.requires && game.stats[choice.requires.stat] < choice.requires.value);
      const knowledgeLocked = !hasKnowledge(game, choice.requiresKnowledge);
      const relationLocked = !relationshipRequirementMet(choice, game);
      const locked = (statLocked || knowledgeLocked || relationLocked) && !game.settings.unlockAll;
      const statLabel = STAT_LABELS[choice.stat] || "Choix";
      return <button key={choice.id} className="v2-choix-carte" style={{ "--i": choiceIndex } as React.CSSProperties} disabled={locked} onClick={() => choose(choice)}><i className="choix-num">{ROMAINS[choiceIndex + 1] || choiceIndex + 1}</i><span className={`stat-icon ${choice.stat || "neutral"}`}>{statLabel.charAt(0)}</span><div><strong>{choice.text}</strong>{dialogue.replay ? <small className="replay-note">Souvenir : aucun gain, aucun temps consommé</small> : (game.settings.showImpact || game.settings.developer) && <small>{impactText(choice)}</small>}{locked && <em>{statLocked ? `Nécessite ${STAT_LABELS[choice.requires!.stat]} ${choice.requires!.value}` : knowledgeLocked ? "Cette réponse exige une information que vous n’avez pas encore découverte" : "Nécessite des liens plus avancés avec les personnes concernées"}</em>}</div></button>;
    })}</div>}
    {backlogOpen && <div className="scene-backlog" role="dialog" aria-modal="true" aria-label="Historique de la scène" onClick={(event) => { if (event.target === event.currentTarget) setBacklogOpen(false); }}>
      <div className="backlog-boite"><header><div><span className="surtitre">Historique</span><h3>{dialogue.scene.title}</h3></div><button type="button" className="dlg-x" data-close aria-label="Fermer l’historique" onClick={() => setBacklogOpen(false)}><span>✕</span><kbd>Échap</kbd></button></header>
        <div className="backlog-liste" ref={backlogRef}>{backlog.map((entry, index) => <div key={index} className={`backlog-ligne ${entry.narration ? "narration" : ""} ${entry.choice ? "choix" : ""}`} style={{ "--c": entry.color || "var(--or)" } as React.CSSProperties}>{!entry.narration && <b>{entry.choice ? "➤ Votre choix" : entry.speaker}</b>}<p>{entry.text}</p></div>)}</div>
      </div>
    </div>}
  </section>;
}

type V2BacklogEntry = { speaker: string; text: string; color?: string; narration?: boolean; choice?: boolean };

function SectionTabs<T extends string>({ label, active, items, onChange }: { label: string; active: T; items: { id: T; icon: string; label: string; count?: number | string; hint?: string }[]; onChange: (id: T) => void }) {
  return <nav className="section-tabs" role="tablist" aria-label={label}>
    {items.map((item) => <button key={item.id} type="button" role="tab" aria-selected={active === item.id} className={active === item.id ? "active" : ""} onClick={() => onChange(item.id)}><span>{item.icon}</span><div><strong>{item.label}</strong>{item.hint && <small>{item.hint}</small>}</div>{item.count !== undefined && <b>{item.count}</b>}</button>)}
  </nav>;
}

function JobsView({ game, onStart, onLocate }: { game: GameState; onStart: (job: JobData) => void; onLocate: (job: JobData) => void }) {
  const [section, setSection] = useState<"local" | "available" | "all">("local");
  const knownJobs = JOBS.filter((job) => { const location = spotById(job.spot)?.location; return Boolean(location && locationUnlocked(game, location)); });
  const unlockedCount = knownJobs.filter((job) => jobAccess(game, job).unlocked).length;
  const localCount = knownJobs.filter((job) => job.spot === game.spot && jobAccess(game, job).unlocked).length;
  const filtered = knownJobs.filter((job) => section === "local" ? job.spot === game.spot : section === "available" ? jobAccess(game, job).unlocked : true);
  const ordered = [...filtered].sort((left, right) => {
    const leftLocal = left.spot === game.spot ? 0 : 1;
    const rightLocal = right.spot === game.spot ? 0 : 1;
    const leftLocked = jobAccess(game, left).unlocked ? 0 : 1;
    const rightLocked = jobAccess(game, right).unlocked ? 0 : 1;
    return leftLocal - rightLocal || leftLocked - rightLocked || left.title.localeCompare(right.title, "fr");
  });
  return <section className="jobs-stage">
    <header className="jobs-heading"><div><p className="eyebrow">Registre des contrats</p><h1>Jobs & travaux de Sylvinia</h1><p>Chaque employeur conserve sa propre rotation. De nouveaux contrats apparaissent à mesure que vos routes s'ouvrent.</p></div><div className="jobs-summary"><span><b>{localCount}</b> ici</span><span><b>{unlockedCount}</b> accessibles</span><span><b>{knownJobs.length}</b> connus</span></div></header>
    <SectionTabs label="Filtrer les jobs" active={section} onChange={setSection} items={[
      { id: "local", icon: "⌖", label: "Ici", count: localCount, hint: "Dans ce sous-lieu" },
      { id: "available", icon: "◈", label: "Accessibles", count: unlockedCount, hint: "Prêts à être rejoints" },
      { id: "all", icon: "≡", label: "Contrats connus", count: knownJobs.length, hint: "Inclut les prérequis" },
    ]} />
    {ordered.length ? <div className="jobs-grid">{ordered.map((job) => {
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
    })}</div> : <div className="empty-view menu-empty"><span>⌖</span><h2>Aucun job disponible ici</h2><p>Les contrats de ce sous-lieu ne sont pas encore accessibles. Consultez ceux que vous pouvez rejoindre ailleurs.</p><button className="primary-action" onClick={() => setSection("available")}>Voir les jobs accessibles</button></div>}
  </section>;
}

function RelationsView({ game, setModal, setSelectedLocation, setSelectedSpot, setTab, onWaitForRoute }: { game: GameState; setModal: (modal: ModalState) => void; setSelectedLocation: (id: string) => void; setSelectedSpot: (id: string) => void; setTab: (tab: Tab) => void; onWaitForRoute: (id: string) => void }) {
  const [section, setSection] = useState<"links" | "dates" | "crossed">("links");
  const [selectedCharacterId, setSelectedCharacterId] = useState("saidin");
  const unlockedCharacters = CHARACTERS.filter((character) => characterUnlocked(game, character));
  const knownGroupDates = GROUP_DATES.filter((date) => !date.legacyOnly
    && (!(HR_DATE_IDS as readonly string[]).includes(date.id) || hrDateVisibility(date, game).visible)
    && contentBranchAllowed(game.flags, date)
    && date.characters.every((id) => unlockedCharacters.some((character) => character.id === id)));
  const availableGroupDates = knownGroupDates.filter((date) => groupDateUnlocked(game, date));
  const metCount = unlockedCharacters.length;
  const dateCharacters = unlockedCharacters.filter((character) => DATE_SCENES.some((date) => date.character === character.id) || HOME_DATE_PROFILES[character.id]);
  const selectedCharacter = unlockedCharacters.find((character) => character.id === selectedCharacterId) || unlockedCharacters[0];
  const selectedRelation = selectedCharacter ? game.relationships[selectedCharacter.id] : undefined;
  const selectedSchedule = selectedCharacter ? characterPlace(selectedCharacter, game.day, game.period, game.flags, game.housing) : undefined;
  const selectedLocationData = LOCATIONS.find((entry) => entry.id === selectedSchedule?.location);
  const selectedSpotData = selectedSchedule ? spotById(selectedSchedule.spot) : undefined;
  const selectedRawNext = selectedCharacter && selectedRelation ? sceneFor(selectedCharacter.id, selectedRelation.stage) : undefined;
  const selectedNext = selectedRawNext ? relationRouteVariant(selectedRawNext, game).route : undefined;
  const selectedNeeded = selectedNext && selectedRelation ? Math.max(0, BOND_THRESHOLDS[selectedNext.stage] - selectedRelation.affection - selectedRelation.trust) : 0;
  const selectedObjective = selectedNext ? routeNarrativeObjective(selectedNext, game) : undefined;
  const selectedNarrativeReady = Boolean(selectedNext && !selectedObjective);
  const selectedRouteTarget = selectedCharacter && selectedNext && selectedNarrativeReady ? nextPresence(selectedCharacter, game, ROUTE_SPOTS[selectedNext.id], ROUTE_PERIODS[selectedNext.id], selectedNext.dayMin) : null;
  const selectedHasDatePlanner = selectedCharacter ? DATE_SCENES.some((date) => date.character === selectedCharacter.id) || Boolean(HOME_DATE_PROFILES[selectedCharacter.id]) : false;

  return <section className="content-view relations-view"><header className="content-header"><div><p className="eyebrow">Constellation des liens</p><h1>Relations</h1><p>Consultez séparément les liens, les rendez-vous et les dynamiques croisées. Seules les personnes réellement rencontrées apparaissent.</p></div><span>{metCount} relation{metCount > 1 ? "s" : ""}</span></header>
    <SectionTabs label="Sections des relations" active={section} onChange={setSection} items={[
      { id: "links", icon: "♡", label: "Fils relationnels", count: metCount, hint: "Progression et localisation" },
      { id: "dates", icon: "◇", label: "Rendez-vous", count: dateCharacters.length, hint: "Sorties publiques et logis" },
      { id: "crossed", icon: "3", label: "À trois", count: availableGroupDates.length, hint: "Dynamiques croisées" },
    ]} />

    {section === "dates" && availableGroupDates.length > 0 && <button className="primary-action" onClick={() => setModal({ kind: "group-date-planner" })}>Rendez-vous à plusieurs · sorties et logis</button>}
    {section === "crossed" && <div className="relation-section-panel"><button className="group-date-launcher" disabled={!knownGroupDates.length} onClick={() => setModal({ kind: "group-date-planner" })}><span className="group-date-portraits">{knownGroupDates[0]?.characters.map((id) => <img key={id} src={CHARACTERS.find((entry) => entry.id === id)?.portrait} alt="" />)}</span><div><p className="eyebrow">Relations croisées</p><h2>Rendez-vous à trois</h2><p>Chaque dynamique connue reste visible avec sa condition ou la conséquence du choix narratif.</p></div><b>{availableGroupDates.length} / {knownGroupDates.length}<small>accessibles</small></b></button><div className="crossed-date-grid">{knownGroupDates.map((date) => { const unlocked = groupDateUnlocked(game, date); const reason = (HR_DATE_IDS as readonly string[]).includes(date.id) ? hrDateReason(date, game) : undefined; return <article className={unlocked ? "unlocked" : "locked"} key={date.id}><div>{date.characters.map((id) => { const character = CHARACTERS.find((entry) => entry.id === id); return <img src={character?.portrait} alt="" key={id} />; })}</div><span>{date.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)?.name).join(" · ")}</span><strong>{date.title}</strong><small>{unlocked ? "Dynamique disponible" : reason || "Liens et décisions encore insuffisants"}</small></article>; })}</div></div>}

    {section === "dates" && <div className="date-directory">{dateCharacters.map((character) => {
      const relation = game.relationships[character.id];
      const publicDates = DATE_SCENES.filter((date) => date.character === character.id);
      const availableDates = publicDates.filter((date) => game.settings.unlockAll || (relation.stage >= date.unlockStage && relation.affection >= date.minAffection && relation.trust >= date.minTrust));
      const homeAvailable = homeDateUnlocked(game, character.id);
      const hasPlanner = publicDates.length > 0 || Boolean(HOME_DATE_PROFILES[character.id]);
      return <article className={`date-directory-card ${!hasPlanner ? "locked" : ""}`} style={{ "--character": character.color } as React.CSSProperties} key={character.id}><img src={character.portrait} alt="" /><div><span style={{ color: character.color }}>{character.name}</span><strong>{availableDates.length} sortie${availableDates.length > 1 ? "s" : ""} accessible${availableDates.length > 1 ? "s" : ""}</strong><small>{homeAvailable ? "Une visite au logis est également disponible." : game.housing.propertyId ? "La visite au logis demande encore un lien plus avancé." : "Achetez un logis pour ouvrir les visites privées."}</small></div><button disabled={!hasPlanner} onClick={() => setModal({ kind: "date-planner", character: character.id })}>Planifier</button></article>;
    })}</div>}

    {section === "links" && selectedCharacter && selectedRelation && selectedSchedule && <div className="atlas-relation-stage" style={{ "--character": selectedCharacter.color } as React.CSSProperties}>
      <section className="atlas-relation-hero">
        <div className="atlas-relation-aura" />
        <img src={selectedCharacter.portrait} alt={selectedCharacter.name} />
        <div className="atlas-relation-name"><p>{selectedCharacter.role}</p><h2>{selectedCharacter.name}</h2><span>{STAGE_LABELS[selectedRelation.stage]} · rang {selectedRelation.stage}/5</span></div>
      </section>
      <section className="atlas-relation-dossier">
        <header><div><p className="eyebrow">Dossier relationnel</p><h2>{selectedCharacter.name}</h2></div><button type="button" onClick={() => setModal({ kind: "character", character: selectedCharacter.id })}>Dossier complet</button></header>
        <p className="atlas-relation-role">{selectedCharacter.role}</p>
        <div className="atlas-relation-metrics"><Meter label="Affection" value={selectedRelation.affection} color={selectedCharacter.color} /><Meter label="Confiance" value={selectedRelation.trust} color="#d6c176" /><Meter label="Désir" value={selectedRelation.desire} color="#e76588" /></div>
        <article className="atlas-relation-objective"><span>Présence actuelle</span><strong>{selectedSchedule.traveling ? `Escale · ${selectedSpotData?.name}` : `${selectedLocationData?.name} · ${selectedSpotData?.shortName}`}</strong><p>{selectedSchedule.action}</p><small>{selectedNext ? selectedObjective || (game.day < selectedNext.dayMin ? `Prochaine scène au jour ${selectedNext.dayMin}` : selectedNeeded ? `Encore ${selectedNeeded} points de lien requis.` : ROUTE_SPOTS[selectedNext.id] !== selectedSchedule.spot ? `La prochaine scène vous attend à ${spotById(ROUTE_SPOTS[selectedNext.id])?.name}.` : !ROUTE_PERIODS[selectedNext.id]?.includes(PERIODS[game.period].id) ? `Moment requis : ${ROUTE_PERIODS[selectedNext.id]?.map((id) => PERIODS.find((entry) => entry.id === id)?.label).join(" ou ")}.` : "Une scène importante est disponible ici.") : "Fil accompli · les rencontres libres restent disponibles."}</small></article>
        <div className="atlas-relation-actions"><button onClick={() => { setSelectedLocation(selectedSchedule.location); setSelectedSpot(selectedSchedule.spot); setTab("map"); }}>◇ Localiser</button>{selectedHasDatePlanner && <button className="date-action" onClick={() => setModal({ kind: "date-planner", character: selectedCharacter.id })}>♡ Rendez-vous</button>}{selectedNext && selectedNarrativeReady && !selectedNeeded && selectedRouteTarget && <button onClick={() => onWaitForRoute(selectedNext.id)}>Attendre · {waitDurationLabel(game, selectedRouteTarget)}</button>}</div>
      </section>
      <nav className="atlas-relation-strip" aria-label="Personnages rencontrés">{unlockedCharacters.map((character) => { const relation = game.relationships[character.id]; return <button type="button" key={character.id} className={character.id === selectedCharacter.id ? "active" : ""} onClick={() => setSelectedCharacterId(character.id)} style={{ "--character": character.color } as React.CSSProperties}><img src={character.portrait} alt="" /><span><strong>{character.name}</strong><small>{STAGE_LABELS[relation.stage]}</small></span></button>; })}</nav>
    </div>}
  </section>;
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

function JournalView({ embedded = false, forcedSection, onHRScene, onOperation, onHRLetter, game, onStartCampaign, onReplayCampaign, onReplayRoute, onReplaySocial, onReplaySecret, onReplayWorldEvent, onReplayDate, onReplayDateIntimacy, onReplayGroupDate, onReplayGroupDateIntimacy, onStartCrossQuest, onStartAlphaHunt, onReadCrossLetter, onWaitForCrossTimeline, onWaitForRoute, onReadLetter, onOpenInvitation }: { onHRScene: (stage: number, replay?: boolean, recognition?: boolean) => void; onOperation: (replay?: boolean) => void; onHRLetter: (id: string) => void; game: GameState; onStartCampaign: (id: string) => void; onReplayCampaign: (id: string) => void; onReplayRoute: (id: string) => void; onReplaySocial: (id: string) => void; onReplaySecret: (id: string) => void; onReplayWorldEvent: (id: string) => void; onReplayDate: (id: string) => void; onReplayDateIntimacy: (id: string) => void; onReplayGroupDate: (id: string) => void; onReplayGroupDateIntimacy: (id: string) => void; onStartCrossQuest: (stage: number, replay?: boolean) => void; onStartAlphaHunt: (replay?: boolean) => void; onReadCrossLetter: (id: string) => void; onWaitForCrossTimeline: () => void; onWaitForRoute: (id: string) => void; onReadLetter: (id: string) => void; onOpenInvitation: (id: string) => void; embedded?: boolean; forcedSection?: "campaign" | "crossed" | "relations" | "messages" | "discoveries" | "memories" }) {
  const [chosenSection, setSection] = useState<"campaign" | "crossed" | "relations" | "messages" | "discoveries" | "memories">("campaign");
  const section = forcedSection ?? chosenSection;
  const campaignMemories = CAMPAIGN_SCENES.filter((scene) => game.history.includes(scene.id));
  const socialMemories = game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7)).map((id) => SOCIAL_SCENES.find((scene) => scene.id === id)).filter((scene): scene is SocialScene => Boolean(scene));
  const secretMemories = game.secretHistory.map((id) => SECRET_CONVERSATIONS.find((secret) => secret.id === id)).filter((secret): secret is SecretConversation => Boolean(secret));
  const worldMemories = game.worldEventHistory.map((id) => SPONTANEOUS_EVENTS.find((event) => event.id === id)).filter((event): event is SpontaneousEvent => Boolean(event));
  const dateMemories = unique(game.dateHistory).map((id) => DATE_SCENES.find((date) => date.id === id)).filter((date): date is DateScene => Boolean(date));
  const groupDateMemories = unique(game.groupDateHistory).map((id) => GROUP_DATES.find((date) => date.id === id)).filter((date): date is GroupDateScene => Boolean(date));
  const hrProgress = game.crossQuestSeries[HR_KEY];
  const crossProgress = game.crossQuestSeries.linevaAllenna;
  const crossLetters = (crossProgress?.letters || []).map((received) => ({ received, letter: LINEVA_ALLENNA_LETTERS.find((entry) => entry.id === received.id) })).filter((entry): entry is { received: NonNullable<typeof crossProgress>["letters"][number]; letter: CrossLetter } => Boolean(entry.letter));
  const crossTimelineTarget = crossProgress?.stage === 3 ? nextCrossTimelineDay(crossProgress, game.day) : game.day;
  const crossTimelineElapsed = crossProgress?.stage === 3 ? Math.min(LINEVA_ALLENNA_CORRESPONDENCE_DAYS, Math.max(0, game.day - crossProgress.stageStartedDay)) : 0;
  const crossCorrespondenceComplete = crossProgress?.stage === 3 && crossProgress.letters.length === LINEVA_ALLENNA_LETTERS.length;
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
  const activeCampaignOptions = storyComplete ? [] : activeAct.requiredScenes
    .filter((id) => !discovered.has(id))
    .map((id) => campaignSceneById(id))
    .filter((scene): scene is CampaignScene => Boolean(scene));
  const readyCampaignOptions = activeCampaignOptions.filter((scene) => campaignSceneReady(scene, game));
  const threads = CHARACTERS.filter((character) => characterUnlocked(game, character)).map((character) => {
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
  const pendingMessages = letters.filter(({ received }) => !received.read).length + crossLetters.filter(({ received }) => !received.read).length + invitations.filter(({ received }) => received.status === "pending").length;
  const intimateDateMemories = dateMemories.filter((date) => game.flags.includes(`date-intimate:${date.id}`)).length;
  const intimateGroupMemories = groupDateMemories.filter((date) => game.flags.includes(`group-date-intimate:${date.id}`)).length;
  const crossSceneMemories = crossProgress ? [0, 1, 2, 4, 5, 7].filter((stage) => { const scene = crossSceneForStage(stage); return Boolean(scene && game.flags.includes(`cross-la-scene:${scene.id}`)); }) : [];
  const homeTrioIntimateMemory = game.flags.includes("group-date-intimate:group-date-allenna-lineva-home") ? 1 : 0;
  const memoryCount = game.history.length + socialMemories.length + secretMemories.length + worldMemories.length + dateMemories.length + intimateDateMemories + groupDateMemories.length + intimateGroupMemories + crossSceneMemories.length + homeTrioIntimateMemory;
  const alphaState = crossProgress?.alphaState;
  const alphaStatus = alphaState?.phase === "victory"
    ? "Alpha abattu · convergence brisée"
    : alphaState?.phase === "failure"
      ? "Repli effectué · la même bataille peut être reprise"
      : alphaState
        ? `Traque sauvegardée · ${alphaState.revealed.length}/4 impacts confirmés`
        : "Carte tactique prête · progression sauvegardée à chaque action";
  const linevaAllennaMechanic = crossProgress && crossProgress.stage >= 6 ? {
    title: "Traque de l’Alpha",
    description: "Une chasse tactique sur les quartiers de Forthaven : sonder la ruche, déplacer le duo et ouvrir l’assaut final.",
    status: <span>{alphaStatus}</span>,
    action: crossProgress.stage === 6
      ? <button className="primary-action" onClick={() => onStartAlphaHunt(false)}>{alphaState ? "Reprendre la traque" : "Ouvrir la carte tactique"}</button>
      : <button className="secondary-action" onClick={() => onStartAlphaHunt(true)}>Rejouer le mini-jeu</button>,
  } : undefined;
  const linevaAllennaCorrespondence = crossLetters.length ? (
    <div className="hr-mail cross-route-mail" id="lineva-allenna-correspondence">
      <h3>Correspondance</h3>
      <p>Les vingt-neuf jours de coopération restent consultables sans rejouer artificiellement l’écoulement du temps.</p>
      {crossLetters.map(({ received, letter }) => (
        <button className={received.read ? "" : "unread"} type="button" key={letter.id} onClick={() => onReadCrossLetter(letter.id)}>
          <span>{received.read ? `Jour ${received.receivedDay}` : "Nouveau"}</span>
          <strong>{letter.subject}</strong>
          <small>{CHARACTERS.find((entry) => entry.id === letter.character)?.name} · {letter.delivery}</small>
        </button>
      ))}
    </div>
  ) : undefined;
  const linevaAllennaMilestones = crossProgress ? LINEVA_ALLENNA_MILESTONES
    .filter((entry) => entry.stage !== 1 && (entry.stage === 0 ? crossProgress.stage >= 2 : crossProgress.stage > entry.stage))
    .map((entry) => ({
      id: entry.stage,
      title: entry.title,
      detail: entry.stage === 0
        ? "Deux scènes rejouées à la suite"
        : entry.stage === 3
          ? `${crossLetters.length} courriers conservés`
          : entry.stage === 6
            ? "Mini-jeu tactique"
            : "Relecture protégée",
      actionLabel: entry.stage === 3 ? "Voir les courriers" : entry.stage === 6 ? "Rejouer" : "Relire",
      onReplay: entry.stage === 3
        ? () => document.getElementById("lineva-allenna-correspondence")?.scrollIntoView({ behavior: "smooth", block: "start" })
        : entry.stage === 6
          ? () => onStartAlphaHunt(true)
          : () => onStartCrossQuest(entry.stage, true),
    })) : [];

  return <section className={`content-view journal-view ${embedded ? "journal-embarque" : ""}`}>
    {!embedded && <><header className="content-header"><div><p className="eyebrow">Mémoire de l’entre-mondes</p><h1>Journal de la Confluence</h1><p>Chaque registre possède désormais sa propre vue. Une relecture n’altère jamais la sauvegarde.</p></div><span>Jour {game.day}</span></header>
    <SectionTabs label="Registres du Journal" active={section} onChange={setSection} items={[
      { id: "campaign", icon: "◆", label: "Campagne", count: `${mainProgress}/${MAIN_STORY.length}`, hint: "Objectifs et chapitres" },
      ...(crossProgress || hrProgress ? [{ id: "crossed" as const, icon: "⇄", label: "Quêtes croisées", count: `${(crossProgress ? completedCrossMilestones(crossProgress.stage) : 0) + (hrProgress?.stage || 0)}/${7 * (Number(Boolean(crossProgress)) + Number(Boolean(hrProgress)))}`, hint: "Vos histoires croisées" }] : []),
      { id: "relations", icon: "♡", label: "Relations", count: `${completedRelationScenes}/${totalRelationScenes}`, hint: "Fils narratifs" },
      { id: "messages", icon: "✉", label: "Courrier", count: pendingMessages, hint: "Lettres et invitations" },
      { id: "discoveries", icon: "◌", label: "Découvertes", count: rumors.length + knowledge.length, hint: "Rumeurs et savoirs" },
      { id: "memories", icon: "◇", label: "Souvenirs", count: memoryCount, hint: "Relecture protégée" },
    ]} /></>}
    <div className={`journal-layout ${section === "campaign" ? "" : "single"}`}><div className="quest-column">
      {section === "crossed" && hrProgress && <HRDossier progress={hrProgress} day={game.day} onScene={onHRScene} onOperation={onOperation} onLetter={onHRLetter} />}
      {section === "crossed" && crossProgress && <CrossQuestDossier
        className="lineva-allenna-dossier"
        portraits={[
          { src: CHARACTERS.find((entry) => entry.id === "lineva")?.portrait || "/assets/portraits/lineva.jpg", alt: "Lineva" },
          { src: CHARACTERS.find((entry) => entry.id === "allenna")?.portrait || "/assets/portraits/allenna.jpg", alt: "Allenna" },
        ]}
        eyebrow="Forthaven ↔ Akuhn’Nabad"
        title="Lineva & Allenna"
        description="Amitié, camaraderie et coopération entre deux commandantes qui continuent d’agir sans attendre votre médiation."
        progress={completedCrossMilestones(crossProgress.stage)}
        total={7}
        current={crossProgress.stage < 8 ? {
          title: crossMilestone(crossProgress.stage)?.title || "Coopération en cours",
          objective: crossMilestone(crossProgress.stage)?.objective || "Poursuivre leur série croisée.",
          mechanic: crossProgress.stage === 3 ? <div className="cross-timeline"><small>{crossProgress.letters.length} / {LINEVA_ALLENNA_LETTERS.length} courriers · {crossTimelineElapsed} / {LINEVA_ALLENNA_CORRESPONDENCE_DAYS} jours</small><p>La coopération avance entre vos visites. Chaque attente conduit au prochain courrier, puis au silence qui déclenche la suite.</p><button className="primary-action" onClick={onWaitForCrossTimeline}>{crossCorrespondenceComplete ? `Attendre trois jours sans nouvelles · Jour ${crossTimelineTarget}` : crossTimelineTarget > game.day ? `Attendre le prochain courrier · Jour ${crossTimelineTarget}` : "Recevoir les courriers en attente"}</button></div> : undefined,
          action: crossSceneForStage(crossProgress.stage) ? <button className="primary-action" onClick={() => onStartCrossQuest(crossProgress.stage)}>Vivre cette étape</button> : undefined,
        } : undefined}
        completed={crossProgress.stage >= 8 ? {
          title: "Une relation qui existe aussi sans vous",
          description: "Le canal entre les deux cités tient par les actes. Leurs rendez-vous publics à trois sont disponibles dans Relations.",
        } : undefined}
        mechanic={linevaAllennaMechanic}
        milestones={linevaAllennaMilestones}
        correspondence={linevaAllennaCorrespondence}
      />}
      {section === "campaign" && <section className={`story-progress-overview ${storyComplete ? "complete" : ""}`}>
        <div className="story-progress-heading"><div><p className="eyebrow">Acte I · {storyComplete ? "achevé" : `Chapitre ${activeAct.number} sur ${MAIN_STORY.length}`}</p><h2>{storyComplete ? "Les Serres Rocheuses" : activeAct.title}</h2></div><strong>{mainProgress} / {MAIN_STORY.length} chapitres</strong></div>
        <div className="story-overall-bar"><i style={{ width: `${Math.round((mainProgress / MAIN_STORY.length) * 100)}%` }} /></div>
        <div className="story-current-objective"><span>{storyComplete ? "Entrée de l'Acte II préparée" : "Objectif actuel"}</span><p>{storyComplete ? "Le véritable portail est ouvert et les négociations sont rompues. Le bac à sable reste disponible ; la suite de la campagne commencera avec l'Acte II." : activeAct.objective}</p></div>
        {!storyComplete && <div className="story-next-step"><b>{readyCampaignOptions.length > 1 ? "Pistes disponibles" : "Prochain jalon"}</b><span>{readyCampaignOptions.length > 1 ? `${readyCampaignOptions.length} routes peuvent être entreprises dans l'ordre de votre choix.` : nextMilestone?.title || "Explorez les pistes déjà découvertes"}</span><small>{readyCampaignOptions.length ? `${activeDone} / ${activeAct.requiredScenes.length} jalons accomplis` : nextCampaignBlocker || nextMilestone?.place}</small><div className="story-ready-actions">{readyCampaignOptions.map((scene) => <button className="primary-action" key={scene.id} onClick={() => onStartCampaign(scene.id)}>{scene.title} · {spotById(scene.spot)?.shortName}</button>)}</div>{!readyCampaignOptions.length && nextCampaignReady && nextCampaign && <button className="primary-action" onClick={() => onStartCampaign(nextCampaign.id)}>Rejoindre cette scène de campagne</button>}</div>}
      </section>}

      {(section === "messages" || section === "discoveries") && <section className="living-journal section-surface">
        {section === "messages" && <>
          <div className="journal-section-title"><div><h2>Le monde vous écrit</h2><p>Les initiatives sont espacées. Une invitation simplement manquée reviendra plus tard, sans sanction automatique.</p></div><strong>{pendingMessages} en attente</strong></div>
          <div className="living-journal-grid">
            <article className="living-journal-panel"><header><span>✉</span><div><h3>Correspondances</h3><small>{letters.length + crossLetters.length} reçue{letters.length + crossLetters.length > 1 ? "s" : ""}</small></div></header><div className="living-journal-list">{letters.length + crossLetters.length ? <>{[...crossLetters].reverse().map(({ received, letter }) => <button className={!received.read ? "unread" : ""} key={letter.id} onClick={() => onReadCrossLetter(letter.id)}><span>{!received.read ? "Nouveau · Quête croisée" : received.replyId ? "Répondu" : `Jour ${received.receivedDay}`}</span><strong>{letter.subject}</strong><small>{CHARACTERS.find((entry) => entry.id === letter.character)?.name} · {letter.delivery}</small></button>)}{[...letters].reverse().map(({ received, letter }) => <button className={!received.read ? "unread" : ""} key={letter.id} onClick={() => onReadLetter(letter.id)}><span>{!received.read ? "Nouveau" : received.replyId ? "Répondu" : `Jour ${received.receivedDay}`}</span><strong>{letter.subject}</strong><small>{CHARACTERS.find((entry) => entry.id === letter.character)?.name} · {letter.delivery}</small></button>)}</> : <p>Aucune lettre reçue pour l’instant.</p>}</div></article>
            <article className="living-journal-panel"><header><span>◈</span><div><h3>Invitations</h3><small>Les personnages peuvent prendre l’initiative</small></div></header><div className="living-journal-list">{invitations.length ? [...invitations].reverse().map(({ received, invitation }) => <button className={received.status === "pending" ? "unread" : ""} key={invitation.id} onClick={() => onOpenInvitation(invitation.id)}><span>{received.status === "pending" ? `${received.reoffers ? "Renouvelée · " : ""}Expire J${received.expiresDay}` : received.status === "accepted" ? "Honorée" : received.status === "declined" ? "Refusée" : `Manquée · reviendra après J${received.expiresDay + INVITATION_REOFFER_DELAY}`}</span><strong>{invitation.title}</strong><small>{CHARACTERS.find((entry) => entry.id === invitation.character)?.name} · {spotById(invitation.spot)?.name}</small></button>) : <p>Aucune invitation ne vous attend.</p>}</div></article>
          </div>
        </>}
        {section === "discoveries" && <>
          <div className="journal-section-title"><div><h2>Échos et connaissances</h2><p>Le Journal distingue les paroles entendues des informations réellement recoupées.</p></div><strong>{rumors.length + knowledge.length} entrées</strong></div>
          <div className="living-journal-grid discoveries">
            <article className="living-journal-panel"><header><span>◌</span><div><h3>Rumeurs entendues</h3><small>Leur vérité n’est jamais certifiée</small></div></header><div className="rumor-notes">{rumors.length ? [...rumors].reverse().map(({ heard, rumor }) => <div key={rumor.id}><small>{rumor.source} · Jour {heard.heardDay}</small><p>« {rumor.text} »</p></div>) : <p>Aucune rumeur consignée.</p>}</div></article>
            <article className="living-journal-panel"><header><span>◇</span><div><h3>Ce que vous savez</h3><small>Uniquement les faits et recoupements découverts</small></div></header><div className="knowledge-notes">{knowledge.length ? [...knowledge].reverse().map((entry) => <div key={entry.id}><strong>{entry.title}</strong><p>{entry.summary}</p><small>{entry.people.map((id) => CHARACTERS.find((character) => character.id === id)?.name).filter(Boolean).join(" · ")}</small></div>) : <p>Aucune confidence personnelle n’a encore été consignée.</p>}</div></article>
          </div>
        </>}
      </section>}

      {section === "relations" && <>
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
      </>}

      {section === "memories" && <>
      <h2>Scènes mémorisées</h2>
      <p className="memory-explainer">✦ Relecture protégée : les caractéristiques, relations, objets et l’heure restent strictement inchangés.</p>
      <div className="memory-replay-grid">
        {campaignMemories.map((scene) => <button key={scene.id} onClick={() => onReplayCampaign(scene.id)}><span>◆ Acte {scene.act} · Chapitre {scene.chapter}</span><strong>{scene.title}</strong><small>Revoir sans modifier la chronique</small></button>)}
        {game.history.map((id) => { const scene = ROUTE_SCENES.find((entry) => entry.id === id); const character = CHARACTERS.find((entry) => entry.id === scene?.character); return scene && <button key={id} onClick={() => onReplayRoute(id)}><span style={{ color: character?.color }}>◇ {character?.name}</span><strong>{scene.title}</strong><small>Revoir la scène</small></button>; })}
        {socialMemories.map((scene) => <button key={scene.id} onClick={() => onReplaySocial(scene.id)}><span>✦ Liens croisés</span><strong>{scene.title}</strong><small>Revoir la scène</small></button>)}
        {secretMemories.map((secret) => <button key={secret.id} onClick={() => onReplaySecret(secret.id)}><span style={{ color: CHARACTERS.find((character) => character.id === secret.character)?.color }}>◇ Confidence · {CHARACTERS.find((character) => character.id === secret.character)?.name}</span><strong>{secret.title}</strong><small>Revoir sans gain ni nouvelle découverte</small></button>)}
        {worldMemories.map((event) => <button key={event.id} onClick={() => onReplayWorldEvent(event.id)}><span>◈ Événement spontané · {event.characters.map((id) => CHARACTERS.find((character) => character.id === id)?.name).filter(Boolean).join(" & ")}</span><strong>{event.title}</strong><small>Revoir sans modifier le monde</small></button>)}
        {crossSceneMemories.map((stage) => <button key={`cross-${stage}`} onClick={() => onStartCrossQuest(stage, true)}><span>⇄ Quête croisée · Lineva & Allenna</span><strong>{crossSceneForStage(stage)?.title}</strong><small>Revoir sans modifier la chronique</small></button>)}
        {dateMemories.map((date) => <button key={date.id} onClick={() => onReplayDate(date.id)}><span>♡ Rendez-vous · {CHARACTERS.find((character) => character.id === date.character)?.name}</span><strong>{date.title}</strong><small>Revoir sans gain</small></button>)}
        {dateMemories.filter((date) => game.flags.includes(`date-intimate:${date.id}`)).map((date) => { const unavailable = date.character === "naiah" && game.player.sex === "intersexe"; return <button key={`${date.id}-intimacy`} disabled={unavailable} onClick={() => onReplayDateIntimacy(date.id)}><span>🔥 Souvenir intime · {CHARACTERS.find((character) => character.id === date.character)?.name}</span><strong>{date.title}</strong><small>{unavailable ? "Cette variante n’est pas encore écrite pour la configuration choisie" : "Revoir la scène selon le corps et le niveau d’intimité choisis"}</small></button>; })}
        {groupDateMemories.map((date) => <button key={date.id} onClick={() => onReplayGroupDate(date.id)}><span>♡ Rendez-vous à trois · {date.characters.map((id) => CHARACTERS.find((character) => character.id === id)?.name).join(" & ")}</span><strong>{date.title}</strong><small>Revoir sans gain</small></button>)}
        {groupDateMemories.filter((date) => game.flags.includes(`group-date-intimate:${date.id}`)).map((date) => <button key={`${date.id}-intimacy`} onClick={() => onReplayGroupDateIntimacy(date.id)}><span>🔥 Souvenir à trois · {date.characters.map((id) => CHARACTERS.find((character) => character.id === id)?.name).join(" & ")}</span><strong>{date.title}</strong><small>Revoir les trois routes selon votre sexe et le niveau d’intimité actuel</small></button>)}
        {homeTrioIntimateMemory > 0 && <button onClick={() => onReplayGroupDateIntimacy("group-date-allenna-lineva-home")}><span>🔥 Souvenir au logis · Allenna & Lineva</span><strong>Rien au programme</strong><small>Revoir les trois routes propres au logis</small></button>}
        {!game.history.length && !socialMemories.length && !secretMemories.length && !worldMemories.length && !dateMemories.length && !groupDateMemories.length && <p>Aucune scène majeure n’est encore mémorisée.</p>}
      </div>
      </>}
      {section === "campaign" && <>
      <div className="journal-section-title story-section-title"><div><h2>Histoire principale</h2><p>Les objectifs n’expirent jamais. Les jalons cochés indiquent exactement ce qui a déjà été découvert.</p></div><strong>{mainProgress} / {MAIN_STORY.length}</strong></div>
      {MAIN_STORY.map((act, index) => {
        const done = index < mainProgress;
        const current = !storyComplete && index === mainProgress;
        const revealed = done || current;
        const milestonesDone = act.requiredScenes.filter((id) => discovered.has(id)).length;
        return <article className={`story-timeline ${done ? "done" : ""} ${current ? "current" : ""}`} key={act.id}>
          <span>{act.number}</span>
          <div>
            <strong>{revealed ? act.title : "Chapitre à découvrir"}</strong>
            {revealed ? <><div className="story-act-objective"><b>Objectif</b><p>{act.objective}</p></div>
            <small>{act.detail}</small>
            <div className="story-milestones">
              {act.requiredScenes.length ? act.requiredScenes.map((id) => { const milestone = storyMilestone(id); const achieved = discovered.has(id); return <div className={achieved ? "achieved" : ""} key={id}><i>{achieved ? "✓" : "◇"}</i><span><b>{milestone.title}</b><small>{milestone.place}</small></span></div>; }) : <div className="achieved"><i>✓</i><span><b>Passage dans cette chronologie</b><small>Le prologue ouvre automatiquement ce premier chapitre.</small></span></div>}
            </div></> : <small>Poursuivez le chapitre actuel pour révéler cet objectif sans dévoiler les secrets qui le précèdent.</small>}
          </div>
          <b>{done ? "Accompli" : current ? `${milestonesDone}/${act.requiredScenes.length} jalons` : "À découvrir"}</b>
        </article>;
      })}
      </>}
    </div>{section === "campaign" && <aside className="log-column"><h2>Dernières traces</h2>{game.journal.slice().reverse().slice(0, 14).map((entry, index) => <p key={`${entry}-${index}`}><span>✦</span>{entry}</p>)}</aside>}</div>
  </section>;
}

function AssetsView({ game, presentCharacters, onShop, onGive, onBuyProperty, onSellProperty, onDisplay, onResident }: { game: GameState; presentCharacters: CharacterData[]; onShop: () => void; onGive: (character: string, gift: string) => void; onBuyProperty: (property: string) => void; onSellProperty: () => void; onDisplay: (slot: number, item: string) => void; onResident: (character: string) => void }) {
  const [section, setSection] = useState<"logis" | "inventaire">("logis");
  const ownedProperty = propertyById(game.housing.propertyId);
  const ownedDisplayItems = DISPLAY_ITEMS.filter((item) => (game.inventory[item.id] || 0) > 0);
  const unlockedCities = LOCATIONS.filter((location) => ["algratal", "forthaven", "miraldas", "akuhn"].includes(location.id) && locationUnlocked(game, location.id));
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
          <div className="resident-grid">{CHARACTERS.filter((character) => characterUnlocked(game, character)).map((character) => {
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
  const [section, setSection] = useState<"characters" | "figures" | "locations" | "memories">("characters");
  const discovered = new Set([...game.history, ...game.flags, ...game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  const knownCharacters = CHARACTERS.filter((character) => game.relationships[character.id].met || game.settings.unlockAll).length;
  const knownFigures = SUPPORTING_FIGURES.filter((figure) => game.settings.unlockAll || figure.unlockScenes.some((scene) => discovered.has(scene))).length;
  const knownLocations = LOCATIONS.filter((location) => game.visitedLocations.includes(location.id) || game.settings.unlockAll).length;
  return <section className="content-view codex-view"><header className="content-header"><div><p className="eyebrow">Archives personnelles</p><h1>Codex</h1><p>Choisissez un registre : le Codex n’empile plus personnages, figures, lieux et souvenirs sur la même page.</p></div><span>{game.codex.length} entrées</span></header>
    <SectionTabs label="Registres du Codex" active={section} onChange={setSection} items={[
      { id: "characters", icon: "♡", label: "Personnages", count: knownCharacters, hint: "Relations rencontrées" },
      { id: "figures", icon: "♙", label: "Figures", count: knownFigures, hint: "Acteurs de la campagne" },
      { id: "locations", icon: "⌖", label: "Lieux", count: knownLocations, hint: "Territoires visités" },
      { id: "memories", icon: "✦", label: "Scènes", count: game.history.length, hint: "Mémoire de la chronique" },
    ]} />
    <div className="codex-section">
      {section === "characters" && <div className="codex-characters">{CHARACTERS.filter((character) => game.relationships[character.id].met || game.settings.unlockAll).map((character) => <article key={character.id}><img src={character.portrait} alt="" /><div><span>{character.name}</span><small>{characterDescriptor(character)}</small><p>{character.bio}</p></div></article>)}</div>}
      {section === "figures" && <div className="codex-characters supporting-figures">{SUPPORTING_FIGURES.filter((figure) => game.settings.unlockAll || figure.unlockScenes.some((scene) => discovered.has(scene))).map((figure) => <article key={figure.id}><img src={figure.portrait} alt="" /><div><span>{figure.name}</span><small>{figure.role} · {figure.place}</small><p>{figure.bio}</p></div></article>)}</div>}
      {section === "locations" && <div className="codex-location-grid">{LOCATIONS.filter((location) => game.visitedLocations.includes(location.id) || game.settings.unlockAll).map((location) => <article className="location-codex" key={location.id}><img src={location.image} alt="" /><div><strong>{location.name}</strong><small>{location.subtitle}</small><p>{location.description}</p></div></article>)}</div>}
      {section === "memories" && <div className="memory-list codex-memory-list">{game.history.length ? game.history.map((id) => <span key={id}>✦ {ROUTE_SCENES.find((scene) => scene.id === id)?.title || campaignSceneById(id)?.title || id}</span>) : <div className="empty-view"><span>✦</span><h2>Aucune scène majeure consignée</h2><p>La mémoire de la chronique se remplira à mesure que vous avancerez.</p></div>}</div>}
    </div>
  </section>;
}

function LegacyOptionsView({ game, updateGame, slotInfo, saveSlot, loadSlot, exportSave, importSave, returnTitle }: { game: GameState; updateGame: (fn: (game: GameState) => GameState) => void; slotInfo: Record<number, string>; saveSlot: (slot: number) => void; loadSlot: (slot: number) => void; exportSave: () => void; importSave: (event: ChangeEvent<HTMLInputElement>) => void; returnTitle: () => void }) {
  const [explicitWarning, setExplicitWarning] = useState(false);
  const chooseIntimacy = (intimacy: Intimacy) => {
    if (intimacy === "explicite" && game.player.intimacy !== "explicite") {
      setExplicitWarning(true);
      return;
    }
    updateGame((current) => ({ ...current, player: { ...current.player, intimacy } }));
  };
  return <section className="content-view"><header className="content-header"><div><p className="eyebrow">Chronique & accessibilité</p><h1>Options</h1><p>La progression est automatiquement conservée sur cet appareil.</p></div><div className="options-header-actions"><button className="secondary-action" onClick={returnTitle}>Retour au titre</button><a className="return-story-button" href="../index.html">Retour au Mode Histoire</a></div></header><div className="options-layout"><div className="option-panel"><h2>Lecture & ambiance</h2><label className="range-option"><span>Taille du texte <b>{game.settings.fontScale}%</b></span><input type="range" min={90} max={125} step={5} value={game.settings.fontScale} onChange={(event) => updateGame((current) => ({ ...current, settings: { ...current.settings, fontScale: Number(event.target.value) } }))} /></label><Toggle label="Musique" detail="Thèmes originaux du Visual Novel." active={game.settings.music} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, music: !current.settings.music } }))} /><label className="range-option"><span>Volume <b>{game.settings.volume}%</b></span><input type="range" min={0} max={80} step={4} value={game.settings.volume} onChange={(event) => updateGame((current) => ({ ...current, settings: { ...current.settings, volume: Number(event.target.value) } }))} /></label><Toggle label="Réduire les animations" detail="Désactive les mouvements décoratifs." active={game.settings.reducedMotion} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, reducedMotion: !current.settings.reducedMotion } }))} /><Toggle label="Afficher l’impact des choix" detail="Révèle les gains avant de répondre." active={game.settings.showImpact} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, showImpact: !current.settings.showImpact } }))} /><label className="select-option"><span>Sexe du personnage</span><select value={game.player.sex} onChange={(event) => updateGame((current) => ({ ...current, player: { ...current.player, sex: event.target.value as PlayerSex } }))}><option value="femme">Femme</option><option value="intersexe">Intersexe</option><option value="homme">Homme</option></select></label><label className="select-option"><span>Intimité</span><select value={game.player.intimacy} onChange={(event) => chooseIntimacy(event.target.value as Intimacy)}><option value="tendre">Tendre</option><option value="suggestif">Suggestif</option><option value="explicite">Explicite · sans coupure</option><option value="ellipse">Fondu au noir</option></select></label><p className="hint">Ce réglage peut être modifié à tout moment et adapte la narration des scènes concernées.</p></div><div className="option-panel"><h2>Sauvegardes manuelles</h2>{[1, 2, 3].map((slot) => <div className="save-slot" key={slot}><div><strong>Emplacement {slot}</strong><small>{slotInfo[slot] || "Vide"}</small></div><button onClick={() => saveSlot(slot)}>Sauver</button><button disabled={!slotInfo[slot]} onClick={() => loadSlot(slot)}>Charger</button></div>)}<div className="save-tools"><button onClick={exportSave}>Exporter en fichier</button><label>Importer un fichier<input type="file" accept="application/json,.json" onChange={importSave} /></label></div></div><DeveloperPanel game={game} updateGame={updateGame} /><footer className="option-panel credits-panel"><h2>Chronique parallèle & crédits</h2><p>Univers, personnages et continuité d’après <em>Chroniques de Sylvinia</em>, le <a href="https://github.com/Val1615/SylviniaVN" target="_blank" rel="noreferrer">Visual Novel Sylvinia</a> et <a href="https://github.com/Val1615/Les-mondes-du-Chroniqueur" target="_blank" rel="noreferrer">Les mondes du Chroniqueur</a>. Illustrations, sprites et thèmes musicaux adaptés des ressources autorisées de ces projets.</p></footer></div>{explicitWarning && <ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { updateGame((current) => ({ ...current, player: { ...current.player, intimacy: "explicite" } })); setExplicitWarning(false); }} />}</section>;
}

function DeprecatedOptionsView({ game, updateGame, slotInfo, saveSlot, loadSlot, exportSave, importSave, returnTitle }: { game: GameState; updateGame: (fn: (game: GameState) => GameState) => void; slotInfo: Record<number, string>; saveSlot: (slot: number) => void; loadSlot: (slot: number) => void; exportSave: () => void; importSave: (event: ChangeEvent<HTMLInputElement>) => void; returnTitle: () => void }) {
  const [section, setSection] = useState<"experience" | "saves" | "developer" | "about">("experience");
  const [explicitWarning, setExplicitWarning] = useState(false);
  const chooseIntimacy = (intimacy: Intimacy) => {
    if (intimacy === "explicite" && game.player.intimacy !== "explicite") {
      setExplicitWarning(true);
      return;
    }
    updateGame((current) => ({ ...current, player: { ...current.player, intimacy } }));
  };

  return <section className="content-view options-view">
    <header className="content-header"><div><p className="eyebrow">Chronique & accessibilité</p><h1>Options</h1><p>Réglez uniquement ce dont vous avez besoin ; chaque famille d’options possède désormais son propre espace.</p></div><div className="options-header-actions"><button className="secondary-action" onClick={returnTitle}>Retour au titre</button><a className="return-story-button" href="../index.html">Mode Histoire</a></div></header>
    <SectionTabs label="Catégories des options" active={section} onChange={setSection} items={[
      { id: "experience", icon: "◐", label: "Expérience", hint: "Lecture, son et intimité" },
      { id: "saves", icon: "▣", label: "Sauvegardes", count: Object.values(slotInfo).filter(Boolean).length, hint: "Emplacements et fichiers" },
      { id: "developer", icon: "◇", label: "Développeur", hint: game.settings.developer ? "Outils actifs" : "Outils de vérification" },
      { id: "about", icon: "✦", label: "À propos", hint: "Crédits et continuité" },
    ]} />
    <div className="options-layout modern-options-layout single">
      {section === "experience" && <div className="option-panel option-panel-featured"><div className="option-panel-heading"><div><p className="eyebrow">Confort de lecture</p><h2>Expérience</h2></div><span>Modifiable à tout moment</span></div>
        <label className="range-option"><span>Taille du texte <b>{game.settings.fontScale}%</b></span><input type="range" min={90} max={125} step={5} value={game.settings.fontScale} onChange={(event) => updateGame((current) => ({ ...current, settings: { ...current.settings, fontScale: Number(event.target.value) } }))} /></label>
        <Toggle label="Musique" detail="Thèmes originaux du Visual Novel." active={game.settings.music} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, music: !current.settings.music } }))} />
        <label className="range-option"><span>Volume <b>{game.settings.volume}%</b></span><input type="range" min={0} max={80} step={4} value={game.settings.volume} onChange={(event) => updateGame((current) => ({ ...current, settings: { ...current.settings, volume: Number(event.target.value) } }))} /></label>
        <Toggle label="Réduire les animations" detail="Désactive les mouvements décoratifs." active={game.settings.reducedMotion} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, reducedMotion: !current.settings.reducedMotion } }))} />
        <Toggle label="Afficher l’impact des choix" detail="Révèle les gains avant de répondre." active={game.settings.showImpact} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, showImpact: !current.settings.showImpact } }))} />
        <div className="option-select-grid"><label className="select-option"><span>Sexe du personnage</span><select value={game.player.sex} onChange={(event) => updateGame((current) => ({ ...current, player: { ...current.player, sex: event.target.value as PlayerSex } }))}><option value="femme">Femme</option><option value="intersexe">Intersexe</option><option value="homme">Homme</option></select></label><label className="select-option"><span>Intimité</span><select value={game.player.intimacy} onChange={(event) => chooseIntimacy(event.target.value as Intimacy)}><option value="tendre">Tendre</option><option value="suggestif">Suggestif</option><option value="explicite">Explicite · sans coupure</option><option value="ellipse">Fondu au noir</option></select></label></div>
        <p className="hint">Le mode explicite est réservé aux adultes et affiche un avertissement avant son activation.</p>
      </div>}
      {section === "saves" && <div className="option-panel"><div className="option-panel-heading"><div><p className="eyebrow">Progression</p><h2>Sauvegardes manuelles</h2></div><span>Sauvegarde automatique active</span></div><div className="save-slot-list">{[1, 2, 3].map((slot) => <div className="save-slot" key={slot}><div><strong>Emplacement {slot}</strong><small>{slotInfo[slot] || "Vide"}</small></div><button onClick={() => saveSlot(slot)}>Sauver</button><button disabled={!slotInfo[slot]} onClick={() => loadSlot(slot)}>Charger</button></div>)}</div><div className="save-tools"><button onClick={exportSave}>Exporter en fichier</button><label>Importer un fichier<input type="file" accept="application/json,.json" onChange={importSave} /></label></div></div>}
      {section === "developer" && <DeveloperPanel game={game} updateGame={updateGame} />}
      {section === "about" && <div className="option-panel credits-panel"><p className="eyebrow">Continuité du projet</p><h2>Chronique parallèle & crédits</h2><p>Univers, personnages et continuité d’après <em>Chroniques de Sylvinia</em>, le <a href="https://github.com/Val1615/SylviniaVN" target="_blank" rel="noreferrer">Visual Novel Sylvinia</a> et <a href="https://github.com/Val1615/Les-mondes-du-Chroniqueur" target="_blank" rel="noreferrer">Les mondes du Chroniqueur</a>. Illustrations, sprites et thèmes musicaux adaptés des ressources autorisées de ces projets.</p><div className="about-actions"><button className="secondary-action" onClick={returnTitle}>Revoir l’écran titre</button><a className="return-story-button" href="../index.html">Revenir au Mode Histoire</a></div></div>}
    </div>
    {explicitWarning && <ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { updateGame((current) => ({ ...current, player: { ...current.player, intimacy: "explicite" } })); setExplicitWarning(false); }} />}
  </section>;
}

function RangeOption({ label, value, minimum, maximum, step = 1, suffix = "%", onChange }: { label: string; value: number; minimum: number; maximum: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <label className="range-option atlas-range-option"><span>{label} <b>{value}{suffix}</b></span><input type="range" min={minimum} max={maximum} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function OptionsView({ game, updateGame, slotInfo, saveSlot, loadSlot, exportSave, importSave, returnTitle }: { game: GameState; updateGame: (fn: (game: GameState) => GameState) => void; slotInfo: Record<number, string>; saveSlot: (slot: number) => void; loadSlot: (slot: number) => void; exportSave: () => void; importSave: (event: ChangeEvent<HTMLInputElement>) => void; returnTitle: () => void }) {
  const [section, setSection] = useState<"interface" | "readability" | "device" | "game" | "chronicle">("interface");
  const [explicitWarning, setExplicitWarning] = useState(false);
  const updateSettings = (settings: Partial<GameSettings>) => updateGame((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  const chooseIntimacy = (intimacy: Intimacy) => {
    if (intimacy === "explicite" && game.player.intimacy !== "explicite") {
      setExplicitWarning(true);
      return;
    }
    updateGame((current) => ({ ...current, player: { ...current.player, intimacy } }));
  };

  const sectionCopy = {
    interface: ["Interface", "Composez la densité, la lumière et les détails du monde."],
    readability: ["Lisibilité", "Ajustez le texte, le contraste et les retours de choix."],
    device: ["Appareil", "Laissez l’interface reconnaître l’écran ou imposez une navigation."],
    game: ["Audio & jeu", "Contrôlez l’ambiance sonore et les paramètres narratifs."],
    chronicle: ["Chronique", "Gérez vos sauvegardes, les outils et la continuité du projet."],
  } as const;

  return <section className="content-view options-view atlas-options-view">
    <header className="content-header"><div><p className="eyebrow">Atelier de présentation</p><h1>Options</h1><p>Chaque réglage est enregistré avec votre chronique et peut être modifié sans la recommencer.</p></div><span>{UI_STYLE_META[game.settings.uiStyle].glyph} {UI_STYLE_META[game.settings.uiStyle].label}</span></header>
    <div className="atlas-options-workbench">
      <nav className="atlas-options-categories" aria-label="Catégories des options">{([
        ["interface", "◐", "Interface", "Profils et atmosphère"],
        ["readability", "Aa", "Lisibilité", "Texte et contraste"],
        ["device", "▣", "Appareil", "Adaptation et navigation"],
        ["game", "♫", "Audio & jeu", "Son et narration"],
        ["chronicle", "✦", "Chronique", "Sauvegardes et crédits"],
      ] as [typeof section, string, string, string][]).map(([id, icon, label, detail]) => <button type="button" key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}><span>{icon}</span><div><strong>{label}</strong><small>{detail}</small></div></button>)}</nav>

      <section className="atlas-options-panel">
        <header><p className="eyebrow">{sectionCopy[section][0]}</p><h2>{sectionCopy[section][0]}</h2><p>{sectionCopy[section][1]}</p></header>

        {section === "interface" && <div className="atlas-option-stack">
          <div className="atlas-profile-grid">{(Object.entries(UI_STYLE_META) as [UiStyle, (typeof UI_STYLE_META)[UiStyle]][]).map(([id, meta]) => <button type="button" key={id} className={game.settings.uiStyle === id ? "active" : ""} onClick={() => updateSettings({ uiStyle: id })}><span>{meta.glyph}</span><strong>{meta.label}</strong><small>{meta.detail}</small></button>)}</div>
          <div className="atlas-option-grid"><RangeOption label="Échelle de l’interface" value={game.settings.uiScale} minimum={78} maximum={125} onChange={(uiScale) => updateSettings({ uiScale })} /><RangeOption label="Opacité des panneaux" value={game.settings.panelOpacity} minimum={18} maximum={92} onChange={(panelOpacity) => updateSettings({ panelOpacity })} /><RangeOption label="Assombrissement du décor" value={game.settings.backgroundDim} minimum={0} maximum={70} onChange={(backgroundDim) => updateSettings({ backgroundDim })} /></div>
          <fieldset className="atlas-accent-picker"><legend>Teinte d’accent</legend>{(["imperial", "crimson", "violet", "ice"] as AccentTone[]).map((tone) => <button type="button" key={tone} className={`${tone} ${game.settings.accentTone === tone ? "active" : ""}`} onClick={() => updateSettings({ accentTone: tone })}><i />{tone === "imperial" ? "Or impérial" : tone === "crimson" ? "Carmin" : tone === "violet" ? "Violet" : "Givre"}</button>)}</fieldset>
          <div className="atlas-toggle-grid"><Toggle label="Détails secondaires" detail="Conserve les aides, descriptions et métadonnées." active={game.settings.secondaryDetails} onClick={() => updateSettings({ secondaryDetails: !game.settings.secondaryDetails })} /><Toggle label="Titres monumentaux" detail="Renforce l’identité visuelle des lieux et registres." active={game.settings.monumentalTitles} onClick={() => updateSettings({ monumentalTitles: !game.settings.monumentalTitles })} /><Toggle label="Grain décoratif" detail="Ajoute une texture légère aux surfaces." active={game.settings.decorativeGrain} onClick={() => updateSettings({ decorativeGrain: !game.settings.decorativeGrain })} /></div>
        </div>}

        {section === "readability" && <div className="atlas-option-stack"><div className="atlas-option-grid"><RangeOption label="Taille du texte" value={game.settings.fontScale} minimum={80} maximum={140} step={5} onChange={(fontScale) => updateSettings({ fontScale })} /></div><div className="atlas-reading-sample"><small>Aperçu de lecture</small><h3>Une lumière entre les mondes</h3><p>Les mots doivent rester lisibles sans recouvrir le décor qui leur donne du sens. Cette phrase suit immédiatement vos réglages.</p></div><div className="atlas-toggle-grid"><Toggle label="Contraste renforcé" detail="Éclaircit le texte principal et densifie les panneaux." active={game.settings.highContrastText} onClick={() => updateSettings({ highContrastText: !game.settings.highContrastText })} /><Toggle label="Réduire les animations" detail="Neutralise les transitions et mouvements décoratifs." active={game.settings.reducedMotion} onClick={() => updateSettings({ reducedMotion: !game.settings.reducedMotion })} /><Toggle label="Impact des choix" detail="Révèle les gains avant de répondre." active={game.settings.showImpact} onClick={() => updateSettings({ showImpact: !game.settings.showImpact })} /></div></div>}

        {section === "device" && <div className="atlas-option-stack"><div className="atlas-device-preview"><span>▱</span><div><small>Disposition reconnue</small><strong>L’interface tient compte de la largeur, de la hauteur, de l’orientation et du mode tactile.</strong></div></div><div className="atlas-toggle-grid"><Toggle label="Disposition adaptative" detail="Détecte automatiquement téléphone, écran pliable, tablette ou ordinateur." active={game.settings.adaptiveLayout} onClick={() => updateSettings({ adaptiveLayout: !game.settings.adaptiveLayout })} /><Toggle label="Barre d’état du monde" detail="Affiche le jour, la période, les pièces et la Confluence." active={game.settings.statusBar} onClick={() => updateSettings({ statusBar: !game.settings.statusBar })} /></div><label className="select-option"><span>Navigation tactile</span><select value={game.settings.touchNavigation} onChange={(event) => updateSettings({ touchNavigation: event.target.value as TouchNavigation })}><option value="auto">Automatique</option><option value="bottom">Barre inférieure</option><option value="side">Rail latéral</option></select></label><p className="hint">En mode automatique, le portrait utilise une barre inférieure et le paysage compact conserve un rail latéral pour laisser toute la hauteur au jeu.</p></div>}

        {section === "game" && <div className="atlas-option-stack"><div className="atlas-toggle-grid"><Toggle label="Musique" detail="Thèmes originaux du Visual Novel." active={game.settings.music} onClick={() => updateSettings({ music: !game.settings.music })} /></div><RangeOption label="Volume" value={game.settings.volume} minimum={0} maximum={100} step={4} onChange={(volume) => updateSettings({ volume })} /><div className="option-select-grid"><label className="select-option"><span>Sexe du personnage</span><select value={game.player.sex} onChange={(event) => updateGame((current) => ({ ...current, player: { ...current.player, sex: event.target.value as PlayerSex } }))}><option value="femme">Femme</option><option value="intersexe">Intersexe</option><option value="homme">Homme</option></select></label><label className="select-option"><span>Narration intime</span><select value={game.player.intimacy} onChange={(event) => chooseIntimacy(event.target.value as Intimacy)}><option value="tendre">Tendre</option><option value="suggestif">Suggestif</option><option value="explicite">Explicite · sans coupure</option><option value="ellipse">Fondu au noir</option></select></label></div><p className="hint">Le réglage explicite est réservé aux adultes et demande une confirmation avant son activation.</p></div>}

        {section === "chronicle" && <div className="atlas-option-stack"><div className="atlas-save-list">{[1, 2, 3].map((slot) => <div className="save-slot" key={slot}><div><strong>Emplacement {slot}</strong><small>{slotInfo[slot] || "Vide"}</small></div><button onClick={() => saveSlot(slot)}>Sauver</button><button disabled={!slotInfo[slot]} onClick={() => loadSlot(slot)}>Charger</button></div>)}</div><div className="save-tools"><button onClick={exportSave}>Exporter en fichier</button><label>Importer un fichier<input type="file" accept="application/json,.json" onChange={importSave} /></label></div><DeveloperPanel game={game} updateGame={updateGame} /><footer className="atlas-about"><p className="eyebrow">Continuité du projet</p><h3>Chronique parallèle & crédits</h3><p>Univers, personnages et continuité d’après <em>Chroniques de Sylvinia</em>, le <a href="https://github.com/Val1615/SylviniaVN" target="_blank" rel="noreferrer">Visual Novel Sylvinia</a> et <a href="https://github.com/Val1615/Les-mondes-du-Chroniqueur" target="_blank" rel="noreferrer">Les mondes du Chroniqueur</a>.</p><div><button className="secondary-action" onClick={returnTitle}>Retour au titre</button><a className="return-story-button" href="../index.html">Mode Histoire</a></div></footer></div>}
      </section>
    </div>
    {explicitWarning && <ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { updateGame((current) => ({ ...current, player: { ...current.player, intimacy: "explicite" } })); setExplicitWarning(false); }} />}
  </section>;
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

function IntimateCg({ cg }: { cg: IntimateCgState }) {
  return <div
    className={`intimacy-cg intimacy-cg-${cg.phase}`}
    style={{ "--intimacy-cg": `url(${cg.src})` } as React.CSSProperties}
    data-intimacy-cg={cg.phase}
  >
    <img src={cg.src} alt="Illustration intime de la scène" />
  </div>;
}

type DeveloperPanelProps = {
  game: GameState;
  updateGame: (fn: (game: GameState) => GameState) => void;
  onOpenIntimacy?: (target: DevIntimacyTarget) => void;
};

function DeveloperPanel({ game, updateGame, onOpenIntimacy }: DeveloperPanelProps) {
  const [soloSelection, setSoloSelection] = useState("");
  const [groupSelection, setGroupSelection] = useState("");
  const characterName = (id: string) => CHARACTERS.find((entry) => entry.id === id)?.name || id;
  const hasSoloRoute = (character: string, dateId?: string, home = false) => {
    if (character === "hylee") return game.player.sex !== "intersexe" && Boolean(hyleeIntimacyContext(dateId, home));
    if (character === "remerii") return game.player.sex !== "intersexe" && Boolean(remeriiIntimacyContext(dateId, home));
    if (character === "naiah") return game.player.sex !== "intersexe" && Boolean(naiahProximityContext(dateId, home));
    return home
      ? homeIntimacyRoutes(character, game.player.sex).length > 0
      : intimacyDirections(character, game.player.sex, dateId).length > 0;
  };
  const soloTargets: { key: string; label: string; target: DevIntimacyTarget }[] = [
    ...DATE_SCENES.filter((date) => hasSoloRoute(date.character, date.id)).map((date) => ({
      key: `date:${date.id}`,
      label: `${characterName(date.character)} · ${date.title}`,
      target: { kind: "date" as const, dateId: date.id },
    })),
    ...(game.housing.propertyId ? Object.values(HOME_DATE_PROFILES).filter((profile) => hasSoloRoute(profile.character, undefined, true)).map((profile) => ({
      key: `home:${profile.character}`,
      label: `${characterName(profile.character)} · ${profile.title} (logis)`,
      target: { kind: "home" as const, character: profile.character },
    })) : []),
  ];
  const groupTargets: { key: string; label: string; target: DevIntimacyTarget }[] = [...GROUP_DATES, ...HOME_GROUP_INTIMACY_DATES]
    .filter((date) => !date.legacyOnly && !date.intimacyDisabled)
    .filter((date) => !(date.home || date.id.endsWith("-home")) || Boolean(game.housing.propertyId))
    .filter((date) => groupIntimacyRoutes(date.id, game.player.sex).length > 0)
    .map((date) => ({
      key: `group:${date.id}`,
      label: `${date.characters.map(characterName).join(" & ")} · ${date.title}`,
      target: { kind: "group" as const, groupDateId: date.id },
    }));
  const activeSoloKey = soloTargets.some((entry) => entry.key === soloSelection) ? soloSelection : soloTargets[0]?.key || "";
  const activeGroupKey = groupTargets.some((entry) => entry.key === groupSelection) ? groupSelection : groupTargets[0]?.key || "";
  const launchTarget = (entries: typeof soloTargets, key: string) => {
    const entry = entries.find((candidate) => candidate.key === key);
    if (entry) onOpenIntimacy?.(entry.target);
  };

  if (!game.settings.developer) return <div className="option-panel dev-panel locked">
    <h2>Mode développeur</h2>
    <p>Accès rapide aux jours, caractéristiques, routes, ressources et prévisualisations. Raccourci : Ctrl + Maj + D.</p>
    <button type="button" className="secondary-action" onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, developer: true } }))}>Activer le mode développeur</button>
  </div>;

  const prepareRelationships = () => updateGame((current) => ({
    ...current,
    relationships: Object.fromEntries(CHARACTERS.map((character) => {
      const relation = current.relationships[character.id];
      return [character.id, {
        ...relation,
        met: true,
        stage: 5,
        affection: Math.max(relation.affection, 80),
        trust: Math.max(relation.trust, 80),
        desire: Math.max(relation.desire, 80),
      }];
    })),
  }));
  const completeActOne = () => updateGame((current) => ({
    ...current,
    day: Math.max(current.day, 30),
    history: unique([...current.history, ...ACT_ONE_SCENE_ORDER]),
    flags: unique([
      ...current.flags,
      "story-saidin-met",
      "story-phoenix-token",
      "story-route-algratal",
      "story-rocky-portal-open",
      "story-empire-obscurci-rupture",
      "main-story-act-1-complete",
      "act2-investigation-window",
    ]),
    journal: current.flags.includes("main-story-act-1-complete")
      ? current.journal
      : [...current.journal, "Outil développeur · Acte I marqué comme accompli avec l’état canonique actuel."],
  }));
  const installTestHome = () => updateGame((current) => {
    if (current.housing.propertyId) return current;
    const property = HOUSING_PROPERTIES[0];
    return {
      ...current,
      location: property.location,
      spot: property.spot,
      visitedLocations: unique([...current.visitedLocations, property.location]),
      visitedSpots: unique([...current.visitedSpots, property.spot]),
      housing: { ...current.housing, propertyId: property.id, purchasePrice: 0 },
      journal: [...current.journal, `Outil développeur · ${property.name} installé comme logis de test.`],
    };
  });

  return <div className="option-panel dev-panel">
    <div className="dev-title">
      <div><span>DEV</span><h2>Mode développeur</h2></div>
      <button type="button" onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, developer: false } }))}>Désactiver</button>
    </div>

    <h3>Temps et ressources</h3>
    <div className="dev-row">
      <label>Jour<input type="number" min={1} value={game.day} onChange={(event) => updateGame((current) => ({ ...current, day: Math.max(1, Number(event.target.value) || 1) }))} /></label>
      <label>Période<select value={game.period} onChange={(event) => updateGame((current) => ({ ...current, period: Number(event.target.value) }))}>{PERIODS.map((period, index) => <option value={index} key={period.id}>{period.label}</option>)}</select></label>
      <button type="button" onClick={() => updateGame((current) => ({ ...current, day: current.day + 7, period: 0 }))}>+7 jours</button>
      <button type="button" onClick={() => updateGame((current) => ({ ...current, coins: current.coins + 100 }))}>+100 pièces</button>
      <button type="button" onClick={() => updateGame((current) => ({ ...current, confluence: 100 }))}>Confluence 100</button>
      <button type="button" onClick={() => updateGame((current) => ({ ...current, ambientHistory: emptyAmbientHistory(), sharedHistory: [] }))}>Réinitialiser les conversations</button>
    </div>
    <div className="dev-stats">{(Object.keys(game.stats) as StatKey[]).map((stat) => <button type="button" key={stat} onClick={() => updateGame((current) => ({ ...current, stats: { ...current.stats, [stat]: current.stats[stat] + 1 } }))}>{STAT_LABELS[stat]} <b>{game.stats[stat]}</b> +</button>)}</div>
    <div className="dev-toggles">
      <Toggle label="Aucun coût de temps" detail="Voyages et scènes ne font plus avancer l’heure." active={game.settings.noTimeCost} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, noTimeCost: !current.settings.noTimeCost } }))} />
      <Toggle label="Tout déverrouiller" detail="Ignore jours, seuils et routes fermées." active={game.settings.unlockAll} onClick={() => updateGame((current) => ({ ...current, settings: { ...current.settings, unlockAll: !current.settings.unlockAll } }))} />
    </div>

    <h3>Préparation de la partie</h3>
    <div className="dev-row">
      <button type="button" onClick={completeActOne}>Marquer l’Acte I accompli</button>
      <button type="button" onClick={prepareRelationships}>Préparer toutes les relations</button>
      <button type="button" disabled={Boolean(game.housing.propertyId)} onClick={installTestHome}>{game.housing.propertyId ? "Logis déjà disponible" : "Installer un logis de test"}</button>
    </div>

    <h3>Accès direct aux scènes intimes</h3>
    <p className="dev-help">Ces lancements sautent le rendez-vous et ouvrent directement sa continuation intime en mode souvenir : aucun gain, aucun temps consommé et aucune mutation de la sauvegarde.</p>
    <div className="dev-preview-grid">
      <label>
        <span>Rendez-vous solo</span>
        <select value={activeSoloKey} onChange={(event) => setSoloSelection(event.target.value)} disabled={!soloTargets.length}>{soloTargets.map((entry) => <option key={entry.key} value={entry.key}>{entry.label}</option>)}</select>
        <button type="button" disabled={!activeSoloKey || !onOpenIntimacy} onClick={() => launchTarget(soloTargets, activeSoloKey)}>Ouvrir la partie intime</button>
      </label>
      <label>
        <span>Rendez-vous à trois</span>
        <select value={activeGroupKey} onChange={(event) => setGroupSelection(event.target.value)} disabled={!groupTargets.length}>{groupTargets.map((entry) => <option key={entry.key} value={entry.key}>{entry.label}</option>)}</select>
        <button type="button" disabled={!activeGroupKey || !onOpenIntimacy} onClick={() => launchTarget(groupTargets, activeGroupKey)}>Ouvrir la partie intime</button>
      </label>
    </div>
    {game.player.sex === "intersexe" && <p className="dev-help">Les scènes dédiées sans variante intersexe validée sont masquées. Le corps peut être changé dans l’onglet Intimité.</p>}
    {!game.housing.propertyId && <p className="dev-help">Installez un logis de test pour faire apparaître les continuations domestiques.</p>}

    <h3>Étapes relationnelles</h3>
    <div className="dev-routes">{CHARACTERS.map((character) => <label key={character.id}><span>{character.name}</span><select value={game.relationships[character.id].stage} onChange={(event) => updateGame((current) => ({ ...current, relationships: { ...current.relationships, [character.id]: { ...current.relationships[character.id], stage: Number(event.target.value), met: true, affection: Math.max(current.relationships[character.id].affection, Number(event.target.value) * 10), trust: Math.max(current.relationships[character.id].trust, Number(event.target.value) * 10) } } }))}>{[0, 1, 2, 3, 4, 5].map((stage) => <option key={stage} value={stage}>{stage} · {STAGE_LABELS[stage]}</option>)}</select></label>)}</div>
  </div>;
}

type IntimacyStep = "opening" | "approach-choice" | "approach-lines" | "attunement-choice" | "attunement-lines" | "attunement-result" | "direction-choice" | "direction-lines" | "ending" | "done";


/* Historique partagé des scènes intimes (UI V2 rose — contenu inchangé). */
function useIntimacyBacklog(resetKey: string, currentLine: DialogueLine | undefined, isChoice: boolean, player: Player, cast: string[]) {
  const [backlog, setBacklog] = useState<V2BacklogEntry[]>([]);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const backlogRef = useRef<HTMLDivElement>(null);
  const lastLogged = useRef("");
  useEffect(() => { setBacklog([]); lastLogged.current = ""; }, [resetKey]);
  useEffect(() => {
    if (isChoice || !currentLine) return;
    const key = `${resetKey}|${currentLine.speaker}|${currentLine.text}`;
    if (lastLogged.current === key) return;
    lastLogged.current = key;
    const speakerId = speakerCharacterIds(currentLine.speaker, cast)[0];
    setBacklog((entries) => [...entries, { speaker: replacePlayer(currentLine.speaker, player), text: replacePlayer(currentLine.text, player), color: CHARACTERS.find((entry) => entry.id === speakerId)?.color, narration: currentLine.speaker === "Narration" }]);
  }, [isChoice, currentLine, resetKey, player, cast]);
  useEffect(() => {
    if (!backlogOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key.toLowerCase() === "h") { event.preventDefault(); event.stopPropagation(); setBacklogOpen(false); } };
    window.addEventListener("keydown", onKey, true);
    requestAnimationFrame(() => { const list = backlogRef.current; if (list) list.scrollTop = list.scrollHeight; });
    return () => window.removeEventListener("keydown", onKey, true);
  }, [backlogOpen]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (!backlogOpen && event.key.toLowerCase() === "h" && !(event.target as HTMLElement)?.closest?.("input, textarea")) { event.preventDefault(); setBacklogOpen(true); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backlogOpen]);
  const logChoice = (text: string) => setBacklog((entries) => [...entries, { speaker: "Votre choix", text, choice: true }]);
  return { backlog, backlogOpen, setBacklogOpen, backlogRef, logChoice };
}

function V2IntimacyBacklog({ title, backlog, backlogRef, onClose }: { title: string; backlog: V2BacklogEntry[]; backlogRef: React.RefObject<HTMLDivElement | null>; onClose: () => void }) {
  return <div className="scene-backlog" role="dialog" aria-modal="true" aria-label="Historique de la scène" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="backlog-boite"><header><div><span className="surtitre">Historique</span><h3>{title}</h3></div><button type="button" className="dlg-x" data-close aria-label="Fermer l’historique" onClick={onClose}><span>✕</span><kbd>Échap</kbd></button></header>
      <div className="backlog-liste" ref={backlogRef as React.RefObject<HTMLDivElement>}>{backlog.map((entry, index) => <div key={index} className={`backlog-ligne ${entry.narration ? "narration" : ""} ${entry.choice ? "choix" : ""}`} style={{ "--c": entry.color || "var(--or)" } as React.CSSProperties}>{!entry.narration && <b>{entry.choice ? "➤ Votre choix" : entry.speaker}</b>}<p>{entry.text}</p></div>)}</div>
    </div>
  </div>;
}

function InteractiveIntimacyModal({ modal, game, onFinish, onStop }: { modal: IntimacyModalState; game: GameState; onFinish: (memory: string) => void; onStop: () => void }) {
  const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
  const date = modal.dateId ? DATE_SCENES.find((entry) => entry.id === modal.dateId) : undefined;
  const homeProperty = modal.home ? propertyById(game.housing.propertyId) : undefined;
  const homeItems = modal.home ? game.housing.displayed.map((id) => displayItemById(id)).filter((item): item is NonNullable<ReturnType<typeof displayItemById>> => Boolean(item)) : [];
  const profile = INTIMACY_PROFILES[character.id];
  // Le traitement intersexe Hylee et Remerii reste volontairement celui déjà
  // en place : leur canon corporel attend encore une décision de direction.
  // Les scènes dédiées couvrent intégralement les parcours femme et homme.
  const hyleeContext = character.id === "hylee" && game.player.sex !== "intersexe"
    ? hyleeIntimacyContext(modal.dateId, Boolean(modal.home))
    : undefined;
  const remeriiContext = character.id === "remerii" && game.player.sex !== "intersexe"
    ? remeriiIntimacyContext(modal.dateId, Boolean(modal.home))
    : undefined;
  const naiahContext = character.id === "naiah" && game.player.sex !== "intersexe"
    ? naiahProximityContext(modal.dateId, Boolean(modal.home))
    : undefined;
  const dedicatedIntimacy = Boolean(hyleeContext || remeriiContext || naiahContext || (modal.dateId && ["date-lineva-", "date-allenna-"].some((prefix) => modal.dateId!.startsWith(prefix))));
  const intimacyGame = dedicatedIntimacy ? undefined : INTIMACY_GAMES[character.id];
  const [step, setStep] = useState<IntimacyStep>("opening");
  const [lines, setLines] = useState<DialogueLine[]>(() => hyleeContext
    ? hyleeDateIntimacyOpening(hyleeContext)
    : remeriiContext
      ? remeriiDateIntimacyOpening(remeriiContext)
      : naiahContext
        ? naiahProximityOpening(naiahContext)
      : homeProperty
        ? homeIntimacyOpening(character.id, homeProperty, homeItems)
        : intimacyOpening(character.id, date));
  const [lineIndex, setLineIndex] = useState(0);
  const [approach, setApproach] = useState<IntimacyChoice | null>(null);
  const [direction, setDirection] = useState<IntimacyDirectionChoice | null>(null);
  const [directionSequence, setDirectionSequence] = useState<DialogueLine[][]>([]);
  const [directionChapter, setDirectionChapter] = useState(0);
  const [attunementBeat, setAttunementBeat] = useState(0);
  const [attunementScore, setAttunementScore] = useState(0);
  const [approachChoices] = useState(() => shuffledChoices(hyleeDateApproaches(hyleeContext) || remeriiDateApproaches(remeriiContext) || naiahProximityApproaches(naiahContext) || (modal.home ? HOME_INTIMACY_APPROACHES[character.id] : linevaDateApproaches(modal.dateId) || allennaDateApproaches(modal.dateId) || profile.approaches), `${modal.character}:${modal.home ? "home" : modal.dateId || "route"}:approaches:${game.player.name}`));
  const [directionChoices] = useState(() => shuffledChoices(hyleeContext
    ? hyleeDateIntimacyRoutes(hyleeContext, game.player.sex)
    : remeriiContext
      ? remeriiDateIntimacyRoutes(remeriiContext, game.player.sex, game.knowledge.includes("knows_remerii_curse"))
      : naiahContext
        ? naiahProximityRoutes(naiahContext, game.player.sex)
      : modal.home
        ? homeIntimacyRoutes(character.id, game.player.sex)
        : intimacyDirections(character.id, game.player.sex, modal.dateId), `${modal.character}:${game.player.sex}:${modal.home ? "home" : modal.dateId || "route"}:directions:${game.player.name}`));
  const currentLine = lines[lineIndex];
  const characterSpeaking = currentLine ? speakerCharacterIds(currentLine.speaker, [character.id]).includes(character.id) : false;
  const spriteMood = characterSpeaking
    ? (currentLine.mood || moodForCharacter(character.id, `intimacy-${character.id}-${step}-${lineIndex}`, character.defaultMood))
    : character.defaultMood;
  const intimateMood = currentLine?.intimateMood || "soft";

  function beginSegment(nextStep: IntimacyStep, nextLines: DialogueLine[]) {
    setStep(nextStep);
    setLines(nextLines);
    setLineIndex(0);
  }

  function endingLines() {
    return hyleeContext
      ? hyleeDateIntimacyEnding(hyleeContext)
      : remeriiContext
        ? remeriiDateIntimacyEnding(remeriiContext)
        : naiahContext
          ? naiahProximityEnding(naiahContext)
        : homeProperty
          ? homeIntimacyEnding(character.id, homeProperty)
          : intimacyEnding(character.id, date);
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
      } else beginSegment("ending", withSoloIntimateEnding(endingLines(), character.id, direction?.id || modal.dateId || character.id, directionSequence.length));
    }
    else if (step === "ending") setStep("done");
  }

  function chooseApproach(choice: IntimacyChoice) {
    setApproach(choice);
    beginSegment("approach-lines", choice.lines);
  }

  function chooseDirection(choice: IntimacyDirectionChoice) {
    setDirection(choice);
    const chapters = (hyleeContext || remeriiContext || naiahContext || modal.home) && "chapters" in choice
      ? choice.chapters[game.player.intimacy]
      : directionChapters(character.id, choice.id, game.player.intimacy, game.player.sex, modal.dateId);
    const intimateChapters = withSoloIntimateMoods(chapters, character.id, choice.id);
    setDirectionSequence(intimateChapters);
    setDirectionChapter(0);
    if (intimateChapters.length) beginSegment("direction-lines", intimateChapters[0]);
    else beginSegment("ending", withSoloIntimateEnding(endingLines(), character.id, choice.id, 0));
  }

  function chooseAttunement(option: IntimacyGameOption) {
    setAttunementScore((score) => score + option.score);
    beginSegment("attunement-lines", option.lines);
  }

  const isChoice = step === "approach-choice" || step === "attunement-choice" || step === "direction-choice";
  const isDone = step === "done";
  const intimacyTitle = `${character.name} · ${modal.home ? homeProperty?.name || "Chez vous" : date?.title || "Derrière la dernière porte"}`;
  const { backlog, backlogOpen, setBacklogOpen, backlogRef, logChoice } = useIntimacyBacklog(`${character.id}:${modal.dateId || "home"}:${modal.replay ? "r" : "l"}`, currentLine, isChoice, game.player, [character.id]);
  const speakerColor = character.color;
  const background = backgroundUrl(modal.background || "/assets/backgrounds/bedroom.webp");
  const modeLabel = game.player.intimacy === "ellipse" ? "Fondu au noir" : game.player.intimacy === "explicite" ? "Explicite · sans coupure" : game.player.intimacy;
  const intimateVisual = soloIntimateVisualState({
    character: character.id,
    mode: game.player.intimacy,
    surface: modal.home ? "home" : "route",
    step,
    chapter: directionChapter,
    narrativePhase: character.id === "lineva" && modal.dateId?.startsWith("date-lineva-")
      ? linevaDateIntimacyPhase(directionChapter)
      : character.id === "allenna" && modal.dateId?.startsWith("date-allenna-")
        ? allennaDateIntimacyPhase(directionChapter)
        : hyleeContext
          ? hyleeDateIntimacyPhase(directionChapter)
          : remeriiContext
            ? remeriiDateIntimacyPhase(directionChapter)
            : naiahContext
              ? naiahProximityPhase(directionChapter)
            : undefined,
    revealChapter: direction?.visual?.revealChapter,
    postOrgasmChapter: direction?.visual?.postOrgasmChapter,
  });
  const intimateCg = intimateVisual.cg;
  const useIntimateSprite = hasIntimateSprites(character.id) && intimateVisual.useIntimateSprites;

  return <section className={`interactive-intimacy v2-scene v2-scene-intime ${intimateCg ? `has-intimacy-cg cg-${intimateCg.phase}` : ""}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.18), rgba(5,6,12,.82)), url(${background})` }} onWheel={(event) => { if (event.deltaY < -20 && !backlogOpen && backlog.length > 1) setBacklogOpen(true); }}>
    <div className="scene-top intimacy-top"><div className="scene-titre"><p className="eyebrow">{modal.replay ? `Souvenir intime · aucun gain` : `${modal.home ? "Intimité au logis" : "Scène intime"} · ${modeLabel}`}</p><h2>{intimacyTitle}</h2></div><div className="scene-outils"><button type="button" className="scene-outil" data-act="backlog" disabled={!backlog.length} aria-label="Historique des répliques" onClick={() => setBacklogOpen(true)}><span aria-hidden="true">☰</span><b>Historique</b><kbd>H</kbd></button><button type="button" className="scene-outil passer" onClick={onStop}>{modal.replay ? "Quitter le souvenir" : "Interrompre ici"}</button></div></div>
    {intimateCg ? <IntimateCg cg={intimateCg} /> : <div className={`intimacy-sprite ${useIntimateSprite ? "uses-intimate-sprite" : "uses-standard-sprite"} ${characterSpeaking ? "active" : "quiet"}`}><img data-sprite-channel={useIntimateSprite ? "intimate" : "standard"} src={useIntimateSprite ? intimateSpritePath(character.id, intimateMood) : spritePath(character.id, spriteMood, character.defaultMood)} onError={(event) => useIntimateSprite ? recoverMissingIntimateSprite(event, character.id) : recoverMissingSprite(event, character.portrait)} alt={character.name} /></div>}
    <div className="dialogue-gradient" />
    {!isChoice && !isDone && currentLine && <button className={`dialogue-box intimacy-dialogue ${currentLine.speaker === "Narration" ? "narration" : ""}`} style={{ "--c": speakerColor || "var(--or)" } as React.CSSProperties} onClick={advance}>
      <span className="speaker">{replacePlayer(currentLine.speaker, game.player)}</span>
      <p key={`${step}-${lineIndex}`}>{replacePlayer(currentLine.text, game.player)}</p>
      <small>{step === "direction-lines" && directionSequence.length > 1 ? `Séquence ${directionChapter + 1} / ${directionSequence.length} · ` : ""}{lineIndex + 1} / {lines.length}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
    </button>}
    {step === "approach-choice" && <div className="choice-box intimacy-choices"><p className="choice-question">Comment entrer dans ce moment ?</p>{approachChoices.map((choice, index) => <button key={choice.id} className="v2-choix-carte" style={{ "--i": index } as React.CSSProperties} onClick={() => { logChoice(choice.text); chooseApproach(choice); }}><i className="choix-num">{ROMAINS[index + 1] || index + 1}</i><div><strong>{choice.text}</strong></div></button>)}<button type="button" className="intimacy-stop-choice v2-choix-carte stop" onClick={onStop}><i className="choix-num">✕</i><span>Rester simplement ensemble et terminer la soirée ici</span></button></div>}
    {step === "attunement-choice" && intimacyGame && <div className="choice-box intimacy-choices intimacy-game-box"><div className="intimacy-game-heading"><div><span>Moment partagé · {attunementBeat + 1} / {intimacyGame.beats.length}</span><h3>{intimacyGame.title}</h3></div><div className="intimacy-game-progress">{intimacyGame.beats.map((_, index) => <i key={index} className={index < attunementBeat ? "done" : index === attunementBeat ? "current" : ""} />)}</div></div>{attunementBeat === 0 && <p className="intimacy-game-instruction">{intimacyGame.instruction}</p>}<p className="choice-question">{intimacyGame.beats[attunementBeat].prompt}</p><small className="intimacy-game-detail">{intimacyGame.beats[attunementBeat].detail}</small>{shuffledChoices(intimacyGame.beats[attunementBeat].options, `${character.id}:${modal.dateId || "route"}:beat:${attunementBeat}:${game.player.name}`).map((option, index) => <button key={option.id} className="v2-choix-carte" style={{ "--i": index } as React.CSSProperties} onClick={() => { logChoice(option.label); chooseAttunement(option); }}><i className="choix-num">{ROMAINS[index + 1] || index + 1}</i><div><strong>{option.label}</strong></div></button>)}</div>}
    {step === "direction-choice" && <div className="choice-box intimacy-choices"><p className="choice-question">{approach ? `Après « ${approach.text.toLocaleLowerCase("fr")} »…` : "Comment poursuivre ?"}</p><small className="intimacy-route-note">{naiahContext ? "Trois façons de prolonger ce moment. Chacune transforme un élément concret du rendez-vous en une progression faite de jeu, de baisers et de confiance." : `Trois routes écrites pour ${character.name} et pour le corps que vous avez choisi. Chacune se développe en au moins huit séquences détaillées${modal.home ? ", entièrement propres au logement" : ""}.`}</small>{directionChoices.map((choice, index) => <button key={choice.id} className="v2-choix-carte" style={{ "--i": index } as React.CSSProperties} onClick={() => { logChoice(choice.text); chooseDirection(choice); }}><i className="choix-num">{ROMAINS[index + 1] || index + 1}</i><div><strong>{choice.text}</strong>{"detail" in choice && choice.detail && <small>{choice.detail}</small>}</div></button>)}<button type="button" className="intimacy-stop-choice v2-choix-carte stop" onClick={onStop}><i className="choix-num">✕</i><span>Pas ce soir · rester ensemble et terminer la scène sans fermer les rendez-vous suivants</span></button></div>}
    {isDone && <div className="intimacy-complete"><p className="eyebrow">{modal.replay ? "Fin du souvenir" : "La nuit se poursuit"}</p><h3>{direction ? direction.text : "Un moment partagé"}</h3><p>{modal.replay ? "Vous pouvez quitter ce souvenir sans modifier la chronique." : "La manière dont vous avez joué, répondu et pris l’initiative appartient désormais à votre histoire commune."}</p><button type="button" className="btn principal primary-action" onClick={() => onFinish(`${approach?.id || "approach"}|accord-${attunementScore}|${direction?.id || "direction"}`)}>{modal.replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
    {backlogOpen && <V2IntimacyBacklog title={intimacyTitle} backlog={backlog} backlogRef={backlogRef} onClose={() => setBacklogOpen(false)} />}
  </section>;
}

type GroupIntimacyStep = "opening" | "attunement-choice" | "attunement-lines" | "attunement-result" | "direction-choice" | "direction-lines" | "ending" | "done";

function InteractiveGroupIntimacyModal({ modal, game, onFinish, onStop }: { modal: GroupIntimacyModalState; game: GameState; onFinish: (memory: string) => void; onStop: () => void }) {
  const date = groupIntimacyContextById(modal.groupDateId)!;
  const first = CHARACTERS.find((entry) => entry.id === date.characters[0])!;
  const second = CHARACTERS.find((entry) => entry.id === date.characters[1])!;
  const intimacyGame = GROUP_INTIMACY_GAMES[date.id];
  const manualGroupIntimacy = isManualGroupIntimacy(date.id);
  const naiahGroup = date.characters.includes("naiah");
  const [step, setStep] = useState<GroupIntimacyStep>(manualGroupIntimacy ? "attunement-choice" : "opening");
  const [lines, setLines] = useState<DialogueLine[]>(() => manualGroupIntimacy ? [] : groupIntimacyOpening(date));
  const [lineIndex, setLineIndex] = useState(0);
  const [direction, setDirection] = useState<GroupIntimacyRoute | null>(null);
  const [directionSequence, setDirectionSequence] = useState<DialogueLine[][]>([]);
  const [directionChapter, setDirectionChapter] = useState(0);
  const [attunementBeat, setAttunementBeat] = useState(0);
  const [attunementScore, setAttunementScore] = useState(0);
  const [directionChoices] = useState(() => shuffledChoices(groupIntimacyRoutes(date.id, game.player.sex), `${date.id}:${game.player.sex}:directions:${game.player.name}`));
  const currentLine = lines[lineIndex];
  const speakingIds = currentLine ? speakerCharacterIds(currentLine.speaker, [first.id, second.id]) : [];
  const firstSpeaking = speakingIds.includes(first.id);
  const secondSpeaking = speakingIds.includes(second.id);
  const firstMood = firstSpeaking ? (currentLine.mood || moodForCharacter(first.id, `${date.id}-${step}-${lineIndex}`, first.defaultMood)) : first.defaultMood;
  const secondMood = secondSpeaking ? (currentLine.mood || moodForCharacter(second.id, `${date.id}-${step}-${lineIndex}`, second.defaultMood)) : second.defaultMood;
  const firstIntimateMood = currentLine?.intimateMoods?.[first.id] || "soft";
  const secondIntimateMood = currentLine?.intimateMoods?.[second.id] || "soft";

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
      } else if (manualGroupIntimacy) setStep("done");
      else beginSegment("ending", groupIntimacyEnding(date));
    } else if (step === "ending") setStep("done");
  }

  function chooseAttunement(option: IntimacyGameOption) {
    setAttunementScore((score) => score + option.score);
    beginSegment("attunement-lines", option.lines);
  }

  function chooseDirection(choice: GroupIntimacyRoute) {
    setDirection(choice);
    const linevaAddress = game.flags.includes("lineva-tutoiement")
      ? choice.linevaAddress?.familiar
      : choice.linevaAddress?.firstTime;
    const authoredSequence = choice.chapters[game.player.intimacy].map((chapter, index) => index === 0 && linevaAddress
      ? [...linevaAddress, ...chapter]
      : chapter);
    const sequence = withGroupIntimateMoods(authoredSequence, date.id, [first.id, second.id]);
    setDirectionSequence(sequence);
    setDirectionChapter(0);
    beginSegment("direction-lines", sequence[0]);
  }

  const isChoice = step === "attunement-choice" || step === "direction-choice";
  const isDone = step === "done";
  const intimacyTitle = `${first.name} & ${second.name} · ${date.title}`;
  const { backlog, backlogOpen, setBacklogOpen, backlogRef, logChoice } = useIntimacyBacklog(`${date.id}:${modal.replay ? "r" : "l"}`, currentLine, isChoice, game.player, [first.id, second.id]);
  const speakerColor = (firstSpeaking ? first.color : secondSpeaking ? second.color : undefined) || first.color;
  const background = backgroundUrl(modal.background || spotById(date.spot)?.background || "/assets/backgrounds/bedroom.webp");
  const modeLabel = game.player.intimacy === "ellipse" ? "Fondu au noir" : game.player.intimacy === "explicite" ? "Explicite · sans coupure" : game.player.intimacy;
  const intimateVisual = groupIntimateVisualState({
    pairId: date.id,
    mode: game.player.intimacy,
    step,
    chapter: directionChapter,
    revealChapter: direction?.progression?.revealChapter,
    postOrgasmChapter: direction?.progression?.postOrgasmChapter,
  });
  const intimateCg = intimateVisual.cg;
  const useFirstIntimateSprite = isIntimateGroupContext(date.id) && hasIntimateSprites(first.id) && intimateVisual.useIntimateSprites;
  const useSecondIntimateSprite = isIntimateGroupContext(date.id) && hasIntimateSprites(second.id) && intimateVisual.useIntimateSprites;
  const useIntimateSprites = useFirstIntimateSprite || useSecondIntimateSprite;

  return <section className={`interactive-intimacy group-interactive-intimacy v2-scene v2-scene-intime ${intimateCg ? `has-intimacy-cg cg-${intimateCg.phase}` : ""}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,6,12,.16), rgba(5,6,12,.84)), url(${background})` }} onWheel={(event) => { if (event.deltaY < -20 && !backlogOpen && backlog.length > 1) setBacklogOpen(true); }}>
    <div className="scene-top intimacy-top"><div className="scene-titre"><p className="eyebrow">{modal.replay ? `${naiahGroup ? "Souvenir de proximité à trois" : "Souvenir à trois"} · aucun gain` : `${naiahGroup ? "Proximité à trois" : "Scène intime à trois"} · ${modeLabel}`}</p><h2>{intimacyTitle}</h2></div><div className="scene-outils"><button type="button" className="scene-outil" data-act="backlog" disabled={!backlog.length} aria-label="Historique des répliques" onClick={() => setBacklogOpen(true)}><span aria-hidden="true">☰</span><b>Historique</b><kbd>H</kbd></button><button type="button" className="scene-outil passer" onClick={onStop}>{modal.replay ? "Quitter le souvenir" : "Interrompre ici"}</button></div></div>
    {intimateCg ? <IntimateCg cg={intimateCg} /> : <div className={`group-intimacy-sprites ${useIntimateSprites ? "uses-intimate-sprites" : "uses-standard-sprites"}`} aria-hidden="true">
      <div className={`group-intimacy-sprite first ${firstSpeaking ? "active" : "quiet"}`}><img data-sprite-channel={useFirstIntimateSprite ? "intimate" : "standard"} src={useFirstIntimateSprite ? intimateSpritePath(first.id, firstIntimateMood) : spritePath(first.id, firstMood, first.defaultMood)} onError={(event) => useFirstIntimateSprite ? recoverMissingIntimateSprite(event, first.id) : recoverMissingSprite(event, first.portrait)} alt="" /></div>
      <div className={`group-intimacy-sprite second ${secondSpeaking ? "active" : "quiet"}`}><img data-sprite-channel={useSecondIntimateSprite ? "intimate" : "standard"} src={useSecondIntimateSprite ? intimateSpritePath(second.id, secondIntimateMood) : spritePath(second.id, secondMood, second.defaultMood)} onError={(event) => useSecondIntimateSprite ? recoverMissingIntimateSprite(event, second.id) : recoverMissingSprite(event, second.portrait)} alt="" /></div>
    </div>}
    <div className="dialogue-gradient" />
    {!isChoice && !isDone && currentLine && <button className={`dialogue-box intimacy-dialogue ${currentLine.speaker === "Narration" ? "narration" : ""}`} style={{ "--c": speakerColor || "var(--or)" } as React.CSSProperties} onClick={advance}>
      <span className="speaker">{replacePlayer(currentLine.speaker, game.player)}</span>
      <p key={`${step}-${lineIndex}`}>{replacePlayer(currentLine.text, game.player)}</p>
      <small>{step === "direction-lines" ? `Séquence ${directionChapter + 1} / ${directionSequence.length} · ` : ""}{lineIndex + 1} / {lines.length}<span className="suite-txt"> · Cliquer pour continuer</span></small><i className="dialogue-suite" aria-hidden="true">▼</i>
    </button>}
    {step === "attunement-choice" && <div className="choice-box intimacy-choices intimacy-game-box"><div className="intimacy-game-heading"><div><span>Harmonie à trois · {attunementBeat + 1} / {intimacyGame.beats.length}</span><h3>{intimacyGame.title}</h3></div><div className="intimacy-game-progress">{intimacyGame.beats.map((_, index) => <i key={index} className={index < attunementBeat ? "done" : index === attunementBeat ? "current" : ""} />)}</div></div>{attunementBeat === 0 && <p className="intimacy-game-instruction">{intimacyGame.instruction}</p>}<p className="choice-question">{intimacyGame.beats[attunementBeat].prompt}</p><small className="intimacy-game-detail">{intimacyGame.beats[attunementBeat].detail}</small>{shuffledChoices(intimacyGame.beats[attunementBeat].options, `${date.id}:beat:${attunementBeat}:${game.player.name}`).map((option, index) => <button key={option.id} className="v2-choix-carte" style={{ "--i": index } as React.CSSProperties} onClick={() => { logChoice(option.label); chooseAttunement(option); }}><i className="choix-num">{ROMAINS[index + 1] || index + 1}</i><div><strong>{option.label}</strong></div></button>)}<button type="button" className="intimacy-stop-choice v2-choix-carte stop" onClick={onStop}><i className="choix-num">✕</i><span>Rester simplement proches et terminer la soirée ici</span></button></div>}
    {step === "direction-choice" && <div className="choice-box intimacy-choices group-direction-choices"><p className="choice-question">Quelle dynamique donner à la suite ?</p><small className="intimacy-route-note">{naiahGroup ? `Trois façons de prolonger ce moment avec ${first.name} et ${second.name}. Le jeu, les baisers et le contact choisi changent avec la route ; la confiance reste votre fil commun.` : `Trois routes uniques pour ${first.name}, ${second.name} et le corps que vous avez choisi. Chacune comporte au moins huit séquences détaillées et maintient les trois personnes actives.`}</small>{directionChoices.map((choice, index) => <button key={choice.id} className="v2-choix-carte" style={{ "--i": index } as React.CSSProperties} onClick={() => { logChoice(choice.text); chooseDirection(choice); }}><i className="choix-num">{ROMAINS[index + 1] || index + 1}</i><div><strong>{choice.text}</strong><small>{choice.detail}</small></div></button>)}<button type="button" className="intimacy-stop-choice v2-choix-carte stop" onClick={onStop}><i className="choix-num">✕</i><span>Rester enlacé·es et clore la scène ici</span></button></div>}
    {isDone && <div className="intimacy-complete"><p className="eyebrow">{modal.replay ? "Fin du souvenir" : "Trois places sont restées entières"}</p><h3>{direction?.text || "Un moment partagé"}</h3><p>{modal.replay ? "Ce souvenir peut être quitté sans modifier la chronique." : "Le rendez-vous, le mini-jeu et la route choisie rejoignent les souvenirs communs de ces trois personnes."}</p><button type="button" className="btn principal primary-action" onClick={() => onFinish(`accord-${attunementScore}|${direction?.id || "direction"}`)}>{modal.replay ? "Quitter le souvenir" : "Continuer la chronique"}</button></div>}
    {backlogOpen && <V2IntimacyBacklog title={intimacyTitle} backlog={backlog} backlogRef={backlogRef} onClose={() => setBacklogOpen(false)} />}
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
      <div className={`job-timer ${state.serviceTimeLeft <= 8 ? "urgent" : ""}`}><div><span>Temps de commande</span><strong>{state.serviceTimeLeft}s</strong></div><i style={{ width: `${(state.serviceTimeLeft / SERVICE_TIME_LIMIT) * 100}%` }} /></div>
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

  const jobSpot = spotById(job.spot);
  const jobEmblem = job.kind === "service" ? "☕" : job.kind === "observation" ? "◉" : job.kind === "bargain" ? "◈" : job.kind === "sort" ? "▤" : job.kind === "timing" ? "⌖" : job.kind === "packing" ? "▦" : job.kind === "path" ? "⌁" : job.kind === "assembly" ? "⚙" : "◇";
  useEffect(() => { sfx("ouvrir"); }, []);
  return <div className="v2 v2-fen-calque"><div className="modal-backdrop job-backdrop v2-fen-fond v2-job-fond"><section className={`v2-fen dlg-boite v2-jeu v2-job ritual-modal job-modal varied-job job-kind-${job.kind} job-id-${job.id} phase-${state.phase}`} style={{ "--job-bg": jobSpot?.background ? `url(${jobSpot.background})` : "none" } as React.CSSProperties}><Orn4 />
    <header className="dlg-tete job-tete"><div><span className="surtitre eyebrow">Job local · {jobSpot?.shortName}</span><h2>{job.title}</h2></div><span className="job-emb" aria-hidden="true">{jobEmblem}</span></header>
    <div className="dlg-corps" ref={modalScrollRef as React.RefObject<HTMLDivElement>}>
    {state.phase === "briefing" && <div className="job-lanceur">
      <div className="job-banniere"><span className="job-rotation">Rotation {state.variant + 1} · {jobSessionLabel(job, state.variant)}</span><div className="job-gains"><span className="af-gain">+{job.reward} <i>◈</i></span><span className="job-perf">Perfection · {perfectPay} ◈</span></div></div>
      <p className="job-employer">Proposé par <b>{job.employer}</b></p>
      <p className="texte">{job.description}</p><blockquote className="fen-citation">{job.briefing}</blockquote>
      <div className="job-mechanic"><span>{jobEmblem}</span><div><strong>{job.kind === "service" ? "Lecture de commandes" : JOB_KIND_LABELS[job.kind]}</strong><small>Stat associée : {STAT_LABELS[job.stat]} {statValue}{assisted ? " · avantage actif" : " · avantage au niveau 6"}</small></div></div>
      <div className="job-lanceur-actions"><button type="button" className="btn text-button" onClick={onCancel}>Refuser sans perdre de temps</button><button type="button" className="btn principal primary-action" data-act="job-accepter" onClick={onBegin}>Accepter le travail</button></div>
    </div>}
    {(state.phase === "play" || state.phase === "memorize") && <><div className="job-progress-line"><i style={{ width: `${progressTotal ? Math.min(100, (progressNow / progressTotal) * 100) : 0}%` }} /></div>{job.id === "forestier-service" ? renderService() : job.id === "forestier-rooms" ? renderInspection() : job.id === "algratal-petitions" ? renderPetitions() : job.id === "tzekarun-mechanism" ? renderAssembly() : job.id === "forbidden-herbs" ? renderHarvest() : job.id === "algratal-merchant" ? renderMarket() : ["observation", "bargain", "sort", "assembly"].includes(job.kind) ? renderChoiceGame() : job.kind === "timing" ? renderTiming() : job.kind === "packing" ? renderPacking() : job.kind === "path" ? renderPath() : renderMemory()}</>}
    {complete && <V2JeuResultat succes={state.phase !== "failure"} icone={state.phase === "perfect" ? "✦" : state.phase === "success" ? "◈" : "◇"} titre={state.phase === "perfect" ? "Travail impeccable" : state.phase === "success" ? "Travail accompli" : "Travail partiel"} texte={state.phase === "perfect" ? job.perfect : state.phase === "success" ? job.success : job.failure} gain={`${state.phase === "perfect" ? perfectPay : state.phase === "success" ? job.reward : partialPay} pièces${state.phase !== "failure" ? ` · ${STAT_LABELS[job.stat]} +1` : ""}`}><button type="button" className={`btn ${state.phase === "failure" ? "secondary-action" : "principal primary-action"}`} onClick={onFinish}>{state.phase === "failure" ? "Recevoir la compensation" : "Recevoir le salaire"}</button></V2JeuResultat>}
    </div>
  </section></div></div>;
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
    <div className="scene-cast cast-1"><img className={`scene-sprite ${characterSpeaking ? "active" : "inactive"}`} src={spritePath(character.id, spriteMood, character.defaultMood)} onError={(event) => recoverMissingSprite(event, character.portrait)} alt={character.name} /></div>
    <div className="dialogue-gradient" />
    {(phase === "opening" || phase === "tone-lines" || phase === "answer" || phase === "result") && displayedLine && <button className={`dialogue-box home-date-dialogue-box ${displayedLine.speaker === "Narration" ? "narration" : ""}`} onClick={nextLine}><span className="speaker">{shownSpeaker}</span><p>{shownText}</p><small>{phase === "result" && lineIndex === resultLines.length - 1 ? "Terminer le rendez-vous" : "Continuer"} · Cliquer pour continuer</small></button>}
    {phase === "tone" && <div className="choice-box home-date-choice-panel"><div className="home-date-choice-heading"><p className="eyebrow">Donner le ton</p><p className="choice-question">Quelle relation souhaitez-vous vivre ce soir ?</p></div>{(Object.entries(profile.tones) as [HomeDateTone, HomeDateProfile["tones"][HomeDateTone]][]).map(([id, option], index) => <button key={id} onClick={() => chooseTone(id)}><span className="home-choice-number">{index + 1}</span><div><strong>{option.label}</strong><small>{option.detail}</small></div></button>)}</div>}
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
    <div className={`scene-cast cast-${characters.length}`}>{characters.map((character, index) => { const active = activeIds.includes(character.id); const mood = active && displayedLine ? (displayedLine.mood || moodForCharacter(character.id, `home-pair-${pair.id}-${phase}-${lineIndex}-${character.id}`, character.defaultMood)) : character.defaultMood; return <img key={character.id} className={`scene-sprite ${active ? "active" : "inactive"} speaker-${index}`} src={spritePath(character.id, mood, character.defaultMood)} onError={(event) => recoverMissingSprite(event, character.portrait)} alt={character.name} />; })}</div>
    <div className="dialogue-gradient" />
    {(phase === "opening" || phase === "tone-lines" || phase === "answer" || phase === "result") && displayedLine && <button className={`dialogue-box home-date-dialogue-box ${displayedLine.speaker === "Narration" ? "narration" : ""}`} onClick={nextLine}><span className="speaker">{displayedLine.speaker === "{player}" ? game.player.name : displayedLine.speaker}</span><p>{replacePlayer(displayedLine.text, game.player)}</p><small>{phase === "result" && lineIndex === resultLines.length - 1 ? "Terminer le rendez-vous" : "Continuer"} · Cliquer pour continuer</small></button>}
    {phase === "tone" && <div className="choice-box home-date-choice-panel"><div className="home-date-choice-heading"><p className="eyebrow">Dynamique partagée</p><p className="choice-question">Quel ton donner à cette visite ?</p></div>{pair.tones.map((id, index) => <button key={id} onClick={() => chooseTone(id)}><span className="home-choice-number">{index + 1}</span><div><strong>{id === "amical" ? "Complicité amicale" : id === "amoureux" ? "Tendresse à trois" : "Rivalité et désir"}</strong><small>Une variante écrite pour cette combinaison précise.</small></div></button>)}</div>}
    {phase === "game" && <div className="choice-box home-date-choice-panel home-date-game-panel"><div className="home-date-choice-heading"><p className="eyebrow">Jeu partagé · manche {round + 1}/{pair.rounds.length}</p><h3>{pair.title}</h3><small>{pair.rounds[round].detail}</small></div><p className="choice-question">{pair.rounds[round].prompt}</p>{pair.rounds[round].options.map((option, index) => <button key={option.id} onClick={() => chooseAnswer(option)}><span className="home-choice-number">{index + 1}</span><div><strong>{option.label}</strong></div></button>)}<small className="home-date-score">Harmonie actuelle : {score} / {pair.rounds.length * 2}</small></div>}
  </section>;
}

function AlphaHuntModal({ state, onChange, onFinish, onClose, replay = false }: { state: AlphaHuntState; onChange: (state: AlphaHuntState) => void; onFinish: () => void; onClose: () => void; replay?: boolean }) {
  const cellAt = (row: number, col: number): AlphaCell => ({ row, col });
  const cellKey = (cell: AlphaCell) => `${cell.row}:${cell.col}`;
  const revealed = new Set(state.revealed.map(cellKey));
  const showAlpha = state.revealed.length === 4 || state.phase === "victory";
  const onCell = (cell: AlphaCell) => {
    if (state.phase === "observation" && alphaCellInRange(state, cell)) onChange(strikeAlphaCell(state, cell));
    else if ((state.phase === "movement" || state.phase === "localized") && alphaMoveAllowed(state, cell)) onChange(moveAlphaDuo(state, cell));
  };
  const phaseLabel = state.phase === "observation" ? "Observation" : state.phase === "movement" || state.phase === "localized" ? "Déplacement" : state.phase === "failure" ? "Repli" : "Assaut";
  return <div className="modal-backdrop alpha-hunt-backdrop"><section className="alpha-hunt-modal">
    <header><div><p className="eyebrow">{replay ? "Relecture tactique · aucun gain" : "Quête croisée · Le cœur de la ruche"}</p><h2>Traque de l’Alpha</h2><p>{state.lastReaction}</p></div><button className="modal-close" aria-label={replay ? "Fermer la relecture" : "Sauvegarder et fermer"} onClick={onClose}>×</button></header>
    <div className="alpha-hud"><span><small>Impact Alpha</small><b>{state.revealed.length}/4</b></span><span><small>Patrouilles</small><b>{state.patrols.filter((patrol) => !patrol.respawnTurn).length}</b></span><span><small>Accrochages</small><b>{state.clashes}/2</b></span><span><small>Phase</small><b>{phaseLabel}</b></span></div>
    <div className="alpha-board-wrap"><div className="alpha-map-key" aria-label="Quartiers de la carte">{ALPHA_SECTOR_NAMES.map((name) => <span key={name}>{name}</span>)}</div><div className="alpha-board" style={{ backgroundImage: "linear-gradient(rgba(4,6,12,.1),rgba(4,6,12,.24)),url('/assets/backgrounds/forthaven-alpha-map.jpg')" }} role="grid" aria-label="Carte tactique de Forthaven, grille sept par sept">{Array.from({ length: ALPHA_GRID_SIZE }, (_, row) => Array.from({ length: ALPHA_GRID_SIZE }, (_, col) => {
      const cell = cellAt(row, col);
      const key = cellKey(cell);
      const inRange = alphaCellInRange(state, cell);
      const movable = alphaMoveAllowed(state, cell);
      const isDuo = cellKey(state.duo) === key;
      const patrols = state.patrols.filter((patrol) => !patrol.respawnTurn && cellKey(patrol.cell) === key);
      const alpha = state.alpha.some((entry) => cellKey(entry) === key) && (showAlpha || revealed.has(key));
      const usable = state.phase === "observation" ? inRange : movable;
      return <button role="gridcell" title={alphaCellName(cell)} aria-label={`${alphaCellName(cell)}${isDuo ? ", Lineva et Allenna" : ""}${patrols.length ? ", patrouille" : ""}${alpha ? ", Alpha" : ""}`} disabled={!usable || state.phase === "failure" || state.phase === "victory"} className={`${row === 0 ? "high-city" : ""} ${inRange ? "in-range" : "out-range"} ${movable ? "movable" : ""} ${alpha ? "alpha-cell" : ""} ${isDuo ? "duo-cell" : ""} ${patrols.length ? "patrol-cell" : ""}`} key={key} onClick={() => onCell(cell)}>{alpha && <span className="alpha-mark">◆</span>}{patrols.length > 0 && <span className="patrol-mark">☠</span>}{isDuo && <span className="duo-mark"><img src="/assets/portraits/lineva.jpg" alt="" /><img src="/assets/portraits/allenna.jpg" alt="" /></span>}</button>;
    }))}</div></div>
    <div className="alpha-objective"><strong>{state.phase === "observation" ? "Sondez ou frappez une case éclairée." : state.phase === "movement" || state.phase === "localized" ? "Déplacez le duo d’une ou deux cases." : state.phase === "failure" ? "Deux accrochages : la tentative doit être reprise." : "La convergence est brisée."}</strong>{alphaAdjacent(state) && state.phase !== "victory" && <button className="primary-action" onClick={() => onChange(launchAlphaAssault(state))}>Déclencher l’assaut final</button>}{state.phase === "failure" && <button className="primary-action" onClick={() => onChange(retryAlphaHunt(state))}>Reprendre la même bataille</button>}{state.phase === "victory" && <button className="primary-action" onClick={onFinish}>{replay ? "Terminer la relecture" : "Revenir auprès des défenseurs"}</button>}</div>
    <aside className="alpha-vn-notices" aria-live="polite">{state.notices.slice(-3).map((notice) => { const character = CHARACTERS.find((entry) => entry.id === notice.speaker); return <div key={notice.id}><img src={spritePath(notice.speaker, notice.speaker === "lineva" ? "determined" : "stern", character?.defaultMood)} onError={(event) => character && recoverMissingSprite(event, character.portrait)} alt="" /><span><b>{notice.speaker === "lineva" ? "Lineva" : "Allenna"}</b>{notice.text}</span></div>; })}</aside>
  </section></div>;
}

function GameModal({ modal, game, onClose, onActivityClose, buyGift, giveGift, startDate, startHomeDate, startHomePairDate, startDateIntimacy, finishDateEnding, finishHomeDate, finishHomePairDate, startHomePairIntimacy, startHomeIntimacy, onIntimacyClose, startGroupDate, startGroupDateIntimacy, finishTrioEnding, onGroupIntimacyClose, replyToLetter, replyToCrossLetter, setAlphaHuntState, finishAlphaHunt, acceptInvitation, declineInvitation, ritual, onRitualClose, jobState, onJobBegin, onMemoryStart, onJobAction, onJobClose }: { modal: NonNullable<ModalState>; game: GameState; onClose: () => void; onActivityClose: () => void; buyGift: (gift: string) => void; giveGift: (character: string, gift: string) => void; startDate: (dateId: string) => void; startHomeDate: (characterId: string) => void; startHomePairDate: (pairId: string) => void; startDateIntimacy: (dateId: string) => void; finishDateEnding: (dateId: string, friendlyForThisDate: boolean) => void; finishHomeDate: (character: string, tone: HomeDateTone, score: number) => void; finishHomePairDate: (pair: string, tone: HomeDateTone, score: number) => void; startHomePairIntimacy: (pair: string) => void; startHomeIntimacy: (character: string) => void; onIntimacyClose: (completed: boolean, memory?: string) => void; startGroupDate: (dateId: string) => void; startGroupDateIntimacy: (dateId: string) => void; finishTrioEnding: (dateId: string, friendlyForThisDate: boolean) => void; onGroupIntimacyClose: (completed: boolean, memory?: string) => void; replyToLetter: (letter: LetterTemplate, replyId: string) => void; replyToCrossLetter: (letter: CrossLetter, replyId: string) => void; setAlphaHuntState: (state: AlphaHuntState) => void; finishAlphaHunt: () => void; acceptInvitation: (invitation: InvitationTemplate) => void; declineInvitation: (invitation: InvitationTemplate) => void; ritual: { sequence: string[]; step: number; phase: string; setPhase: (phase: "memorize" | "play" | "success" | "failure") => void; play: (rune: string) => void }; onRitualClose: () => void; jobState: JobState | null; onJobBegin: () => void; onMemoryStart: () => void; onJobAction: (action: string) => void; onJobClose: () => void }) {
  if (modal.kind === "chronicle") return <ChronicleModal onClose={onClose} />;
  if (modal.kind === "notice") return <SimpleModal title={modal.title} text={modal.text} actionLabel={modal.actionLabel} gift={modal.gift} onClose={modal.consumeTime ? onActivityClose : onClose} />;
  if (modal.kind === "letter") {
    const letter = LETTERS.find((entry) => entry.id === modal.letterId);
    const received = game.letters.find((entry) => entry.id === modal.letterId);
    if (!letter || !received) return null;
    const character = CHARACTERS.find((entry) => entry.id === letter.character);
    const selectedReply = letter.replies?.find((entry) => entry.id === received.replyId);
    const attachment = letter.attachedItem ? GIFTS.find((entry) => entry.id === letter.attachedItem)?.name || displayItemById(letter.attachedItem)?.name || letter.attachedItem : undefined;
    return <V2Lettre game={game} character={character} surtitre={`Correspondance · Jour ${received.receivedDay}`} subject={letter.subject} delivery={letter.delivery} body={letter.body} signature={letter.signature} attachment={attachment}
      replies={letter.replies?.length && !received.replyId ? letter.replies : undefined} repliesHint="Répondre — ce choix nuance la relation sans transformer la lettre en épreuve." onReply={(replyId) => replyToLetter(letter, replyId)}
      response={selectedReply?.response} onClose={onClose} />;
  }
  if (modal.kind === "cross-letter") {
    const letter = LINEVA_ALLENNA_LETTERS.find((entry) => entry.id === modal.letterId);
    const received = game.crossQuestSeries.linevaAllenna?.letters.find((entry) => entry.id === modal.letterId);
    if (!letter || !received) return null;
    const character = CHARACTERS.find((entry) => entry.id === letter.character);
    const selectedReply = letter.replies?.find((entry) => entry.id === received.replyId);
    return <V2Lettre game={game} character={character} surtitre={`Quête croisée · Jour ${received.receivedDay}`} subject={letter.subject} delivery={letter.delivery} body={letter.body} signature={letter.signature}
      replies={letter.replies?.length && !received.replyId ? letter.replies : undefined} repliesHint="Répondre est facultatif : Lineva et Allenna poursuivent leur relation sans attendre votre intervention." onReply={(replyId) => replyToCrossLetter(letter, replyId)}
      response={selectedReply?.response} noReplyHint="Ce courrier n’appelle aucune réponse." onClose={onClose} />;
  }
  if (modal.kind === "alpha-hunt") {
    const state = modal.replay ? modal.state : game.crossQuestSeries.linevaAllenna?.alphaState;
    return state ? <AlphaHuntModal state={state} replay={modal.replay} onChange={setAlphaHuntState} onFinish={finishAlphaHunt} onClose={onClose} /> : null;
  }
  if (modal.kind === "invitation") {
    const invitation = INVITATIONS.find((entry) => entry.id === modal.invitationId);
    const received = game.invitations.find((entry) => entry.id === modal.invitationId);
    if (!invitation || !received) return null;
    const character = CHARACTERS.find((entry) => entry.id === invitation.character);
    const pending = received.status === "pending" && game.day <= received.expiresDay;
    const status = pending ? `${received.reoffers ? "Invitation renouvelée · " : ""}Réponse possible jusqu’au jour ${received.expiresDay}` : received.status === "accepted" ? "Invitation déjà honorée" : received.status === "declined" ? "Invitation refusée" : `Invitation manquée · elle pourra revenir après le jour ${received.expiresDay + INVITATION_REOFFER_DELAY}`;
    const spot = spotById(invitation.spot);
    return <V2Fenetre surtitre={`Initiative de ${character?.name || ""}`} titre={invitation.title} classe="large v2-invitation" style={{ "--c": character?.color } as React.CSSProperties} onClose={onClose}
      pied={pending ? <><button type="button" className="btn text-button" onClick={onClose}>Décider plus tard</button><button type="button" className="btn secondary-action" onClick={() => declineInvitation(invitation)}>Refuser</button><button type="button" className="btn principal primary-action" onClick={() => acceptInvitation(invitation)}>Accepter et s’y rendre</button></> : <button type="button" className="btn secondary-action" onClick={onClose}>Refermer</button>}>
      <div className="fen-vn">
        {character && <V2PortraitCarte character={character} />}
        <div className="fen-vn-texte">
          <span className={`fen-etat ${pending ? "ouvert" : ""}`}>{status}</span>
          <blockquote className="fen-citation">{invitation.message}</blockquote>
          <div className="fen-lieu" style={{ backgroundImage: spot?.background ? `linear-gradient(90deg, rgba(6,6,14,.92), rgba(6,6,14,.35)), url(${spot.background})` : undefined }}><span>⌖</span><div><strong>{spot?.name}</strong><small>{LOCATIONS.find((entry) => entry.id === invitation.location)?.name} · {PERIODS.find((entry) => entry.id === invitation.period)?.label}</small></div></div>
        </div>
      </div>
    </V2Fenetre>;
  }
  if (modal.kind === "shop") return <V2Fenetre surtitre="Marché de la Confluence" titre="Présents & curiosités" classe="large v2-marche" onClose={onClose} pied={<button type="button" className="btn secondary-action" onClick={onClose}>Quitter l’étal</button>}>
    <div className="marche-bandeau"><ol className="marche-etapes"><li><b>I</b>Achetez ici</li><li><b>II</b>Rejoignez la personne</li><li><b>III</b>Choisissez « Offrir »</li></ol><span className="hud-bourse"><i>◈</i><b>{game.coins}</b></span></div>
    <p className="discret">L’objet rejoint vos Biens, dans la section Inventaire. Vous pourrez l’exposer au logis ou le remettre directement lorsque son destinataire se trouve avec vous.</p>
    <div className="cad-grille marche-grille">{GIFTS.map((gift, index) => <article key={gift.id} className={`cad-carte rar-${v2Rarity(gift.price)}`} style={{ "--i": index } as React.CSSProperties}><span className="od-ico"><i>{gift.icon}</i></span><b>{gift.name}</b><small>{gift.description}</small><span className="cd-n" title="Dans l’inventaire">×{game.inventory[gift.id] || 0}</span><span className="cad-rar">{v2RarityLabel(gift.price)}</span><button type="button" className="btn petit" data-achat={gift.id} disabled={game.coins < gift.price} onClick={() => buyGift(gift.id)}>Acheter · {gift.price} ◈</button></article>)}</div>
  </V2Fenetre>;
  if (modal.kind === "gift") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
    const present = place.location === game.location && place.spot === game.spot;
    const owned = GIFTS.filter((gift) => (game.inventory[gift.id] || 0) > 0);
    return <V2Cadeau game={game} character={character} present={present} owned={owned} onGive={giveGift} onClose={onClose} />;
  }
  if (modal.kind === "character") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const relation = game.relationships[character.id];
    const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
    const present = place.location === game.location && place.spot === game.spot;
    const owned = GIFTS.filter((gift) => (game.inventory[gift.id] || 0) > 0);
    const discoveredKnowledge = game.knowledge.map((id) => ALL_KNOWLEDGE_ENTRIES.find((entry) => entry.id === id)).filter((entry) => entry?.people.includes(character.id));
    return <V2Fenetre surtitre="Dossier relationnel" titre={character.name} classe="large v2-dossier" style={{ "--c": character.color } as React.CSSProperties} onClose={onClose}>
      <div className="fen-vn">
        <V2PortraitCarte character={character} />
        <div className="fen-vn-texte">
          <p className="dossier-desc">{characterDescriptor(character)}</p>
          <blockquote className="fen-citation">« {character.tagline} »</blockquote>
          <div className="dossier-rang"><span className="surtitre">Rang de lien</span><b>{STAGE_LABELS[relation.stage]}</b></div>
          <div className="stats"><V2Stat cls="aff" label="Affection" value={relation.affection} /><V2Stat cls="conf" label="Confiance" value={relation.trust} /><V2Stat cls="des" label="Désir" value={relation.desire} /></div>
          <h3 className="fen-h">Ce que vous savez</h3><p className="texte">{character.bio}</p>
          {discoveredKnowledge.length > 0 && <div className="dossier-decouvertes">{discoveredKnowledge.map((entry, index) => entry && <article key={entry.id} style={{ "--i": index } as React.CSSProperties}><strong>{entry.title}</strong><p>{entry.summary}</p></article>)}</div>}
          <h3 className="fen-h">Apprécie</h3><p className="texte">{character.appreciates}</p>
          <h3 className="fen-h">Offrir un présent</h3>
          {present ? owned.length ? <div className="cad-grille compacte">{owned.map((gift, index) => <button type="button" key={gift.id} data-don={gift.id} className={`cad-carte rar-${v2Rarity(gift.price)} ${character.giftLikes.includes(gift.id) ? "aime" : ""}`} style={{ "--i": index } as React.CSSProperties} onClick={() => giveGift(character.id, gift.id)}><span className="od-ico"><i>{gift.icon}</i></span><b>{gift.name}</b><span className="cd-n">×{game.inventory[gift.id]}</span>{character.giftLikes.includes(gift.id) && <em>♥ Favori</em>}</button>)}</div> : <p className="discret">Votre inventaire ne contient aucun présent.</p> : <p className="discret">{character.name} se trouve actuellement à {spotById(place.spot)?.name}. Rejoignez exactement ce sous-lieu pour offrir quelque chose.</p>}
        </div>
      </div>
    </V2Fenetre>;
  }
  if (modal.kind === "group-date-planner") {
    const property = propertyById(game.housing.propertyId);
    const knownCharacters = new Set(CHARACTERS.filter((character) => characterUnlocked(game, character)).map((character) => character.id));
    const knownGroupDates = GROUP_DATES.filter((date) => !date.legacyOnly
      && (!(HR_DATE_IDS as readonly string[]).includes(date.id) || hrDateVisibility(date, game).visible)
      && contentBranchAllowed(game.flags, date)
      && date.characters.every((id) => knownCharacters.has(id)));
    const knownHomePairs = HOME_PAIR_DATES.filter((pair) => pair.id !== "hylee-remerii" && pair.characters.every((id) => knownCharacters.has(id)) && (pair.id !== "allenna-lineva" || game.flags.includes("cross-la-series-complete")));
    return <V2Fenetre surtitre="Planifier une relation croisée" titre="Rendez-vous à trois connus" classe="large v2-planif" onClose={onClose}>
      <p className="discret">Les sorties publiques et les visites dans votre logis apparaissent seulement après la rencontre des deux personnes concernées.</p>
      <div className="planif-grille">{knownGroupDates.map((date, index) => {
        const unlocked = groupDateUnlocked(game, date);
        const characters = date.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
        const place = date.home ? propertyById(game.housing.propertyId) : spotById(date.spot);
        return <article key={date.id} className={`planif-carte ${!unlocked ? "verrou" : ""}`} style={{ "--c": characters[0].color, "--i": index, backgroundImage: `linear-gradient(180deg, rgba(8,8,16,.2), rgba(8,8,16,.96) 72%), url(${place?.background})` } as React.CSSProperties}>
          <div className="planif-sceaux">{characters.map((character) => <Seau key={character.id} color={character.color} portrait={character.portrait} />)}</div>
          <span className="planif-sur">{characters.map((character) => character.name).join(" · ")} · {PERIODS.find((period) => period.id === date.period)?.label}</span><h3>{date.title}</h3><p>{date.description}</p><blockquote>{date.dynamic}</blockquote><small>⌖ {place?.name || "Votre futur logis"}{game.groupDateHistory.includes(date.id) ? " · Déjà vécu" : ""}</small>
          {unlocked ? <button type="button" className="btn principal primary-action" onClick={() => startGroupDate(date.id)}>{game.crossQuestSeries[HR_KEY]?.hr?.checkpoint?.sceneId === date.id ? "Reprendre ce rendez-vous" : "Réserver ce moment à trois"}</button> : <div className="planif-verrou">{date.authoredBeats && <p>{hrDateReason(date, game)}</p>}<ul className="conditions">{characters.map((character) => { const relation = game.relationships[character.id]; return <li key={character.id} className="ko"><span>{character.name}</span><b>Étape {relation.stage}/{date.minStage} · Aff. {relation.affection}/{date.minAffection} · Conf. {relation.trust}/{date.minTrust} · Désir {relation.desire}/{date.minDesire}</b></li>; })}</ul></div>}
        </article>;
      })}{knownHomePairs.map((pair, index) => {
        const characters = pair.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
        const unlocked = Boolean(property) && homePairDateUnlocked(game, pair);
        return <article key={`home-${pair.id}`} className={`planif-carte logis ${!unlocked ? "verrou" : ""}`} style={{ "--c": characters[0].color, "--i": knownGroupDates.length + index, backgroundImage: `linear-gradient(180deg, rgba(8,8,16,.2), rgba(8,8,16,.96) 72%), url(${property?.background || backgroundUrl("bedroom")})` } as React.CSSProperties}>
          <div className="planif-sceaux">{characters.map((character) => <Seau key={character.id} color={character.color} portrait={character.portrait} />)}</div>
          <span className="planif-sur">Au logis · {characters.map((character) => character.name).join(" · ")}</span><h3>{pair.title}</h3><p>{pair.description}</p><blockquote>Une visite privée construite autour de votre logement, de ses objets et de cette dynamique précise.</blockquote><small>⌂ {property?.name || "Aucun logis acheté"}</small>
          {unlocked ? <button type="button" className="btn principal primary-action" onClick={() => startHomePairDate(pair.id)}>Inviter au logis</button> : <div className="planif-verrou"><p>{pair.id === "allenna-lineva" ? "Requis : logis à Forthaven ou Akuhn’Nabad et au moins un rendez-vous public joué" : property ? `Requis : étape ${pair.minStage} · confiance ${pair.minTrust} · dynamique correspondante` : "Requis : posséder un logis"}</p></div>}
        </article>;
      })}</div>
    </V2Fenetre>;
  }
  if (modal.kind === "group-date-result") {
    const date = GROUP_DATES.find((entry) => entry.id === modal.groupDateId)!;
    const characters = date.characters.map((id) => CHARACTERS.find((entry) => entry.id === id)!);
    const naiahGroup = date.characters.includes("naiah");
    const refactored = naiahGroup || date.id.includes("allenna-lineva") || (HR_DATE_IDS as readonly string[]).includes(date.id);
    const resultBackground = date.home ? propertyById(game.housing.propertyId)?.background : spotById(date.spot)?.background;
    return <V2Resultat background={resultBackground} characters={characters} surtitre="La soirée garde trois places ouvertes" titre={`${characters[0].name} et ${characters[1].name} restent avec vous`}
      texte={naiahGroup ? `Après « ${date.title} », le jeu peut se prolonger à trois : baisers, contact choisi et confiance partagée. Personne n’a besoin de donner à ce moment une autre forme que celle qui vous convient.` : `Après « ${date.title} », la tension entre vous ne demande plus d’explication. Vous pouvez ouvrir une scène intime à trois — avec un mini-jeu et trois routes propres à ce lieu et au corps que vous avez choisi — ou garder une proximité amicale pour cette soirée seulement.`}>
      <button type="button" className="btn principal primary-action" onClick={() => startGroupDateIntimacy(date.id)}>{naiahGroup ? "Prolonger la proximité à trois" : "Poursuivre à trois"}</button>{refactored ? <><button type="button" className="btn secondary-action" onClick={() => finishTrioEnding(date.id, false)}>Pas ce soir</button><button type="button" className="btn secondary-action" onClick={() => finishTrioEnding(date.id, true)}>Rester complices ce soir</button></> : <button type="button" className="btn secondary-action" onClick={onClose}>Terminer la soirée ici</button>}
    </V2Resultat>;
  }
  if (modal.kind === "date-planner") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const relation = game.relationships[character.id];
    const dates = DATE_SCENES.filter((date) => date.character === character.id);
    const homeProfile = HOME_DATE_PROFILES[character.id];
    const property = propertyById(game.housing.propertyId);
    const homeUnlocked = Boolean(property) && homeDateUnlocked(game, character.id);
    return <V2Fenetre surtitre="Planifier un rendez-vous" titre={`Une journée avec ${character.name}`} classe="large v2-planif" style={{ "--c": character.color } as React.CSSProperties} onClose={onClose}>
      <div className="planif-tete"><Seau color={character.color} portrait={character.portrait} className="grand" /><p className="discret">Invitez la personne pour le lendemain, quel que soit son lieu de séjour. Une journée est réservée pour votre sortie ou votre soirée au logis.</p></div>
      <div className="planif-grille">{dates.map((date, index) => { const unlocked = publicDateUnlocked(game, date); const place = spotById(date.spot); const day = game.day + 1; return <article key={date.id} className={`planif-carte ${!unlocked ? "verrou" : ""}`} style={{ "--c": character.color, "--i": index, backgroundImage: `linear-gradient(180deg, rgba(8,8,16,.15), rgba(8,8,16,.96) 70%), url(${place?.background})` } as React.CSSProperties}>
        <span className="planif-sur">{date.type} · {PERIODS.find((period) => period.id === date.period)?.label}</span><h3>{date.title}</h3><p>{date.description}</p><small>⌖ {place?.name}</small>
        {unlocked ? <button type="button" className="btn principal primary-action" onClick={() => startDate(date.id)}>{`Inviter pour le jour ${day}`}</button> : <ul className="conditions"><li className={relation.stage >= date.unlockStage ? "ok" : "ko"}><span>Étape</span><b>{relation.stage} / {date.unlockStage}</b></li><li className={relation.affection >= date.minAffection ? "ok" : "ko"}><span>Affection</span><b>{relation.affection} / {date.minAffection}</b></li><li className={relation.trust >= date.minTrust ? "ok" : "ko"}><span>Confiance</span><b>{relation.trust} / {date.minTrust}</b></li></ul>}
      </article>; })}{homeProfile && <article className={`planif-carte logis ${!homeUnlocked ? "verrou" : ""}`} style={{ "--c": character.color, "--i": dates.length, backgroundImage: `linear-gradient(180deg, rgba(8,8,16,.15), rgba(8,8,16,.96) 70%), url(${property?.background || backgroundUrl("bedroom")})` } as React.CSSProperties}>
        <span className="planif-sur">Rendez-vous au logis · Soirée</span><h3>{homeProfile.title}</h3><p>{homeProfile.description}</p><small>⌂ {property?.name || "Aucun logis acheté"}</small>
        {homeUnlocked ? <><button type="button" className="btn principal primary-action" onClick={() => startHomeDate(character.id)}>Inviter {character.name} au logis</button><small>Soirée prévue au jour {game.day + 1}.</small></> : <div className="planif-verrou"><p>{property ? `Requis : étape ${5} · affection 22 · confiance 22` : "Requis : posséder un logis"}</p></div>}
      </article>}</div>
    </V2Fenetre>;
  }
  if (modal.kind === "home-date") return <HomeDateModal characterId={modal.character} game={game} onFinish={finishHomeDate} onClose={onClose} />;
  if (modal.kind === "home-pair-date") return <HomePairDateModal pairId={modal.pairId} game={game} onFinish={finishHomePairDate} onClose={onClose} />;
  if (modal.kind === "home-pair-date-result") {
    const property = propertyById(game.housing.propertyId)!;
    const pairCharacters = ["allenna", "lineva"].map((id) => CHARACTERS.find((entry) => entry.id === id)!);
    return <V2Resultat background={property.background} characters={pairCharacters} surtitre="Rien au programme" titre="Personne ne cherche encore la porte" texte="Le désir de Lineva et celui d’Allenna permettent de prolonger cette soirée au logis. Le canapé, la cuisine et la chambre ouvrent trois routes qui n’appartiennent à aucun rendez-vous public. Une fin amicale ne vaut que pour cette visite.">
      <button type="button" className="btn principal primary-action" onClick={() => startHomePairIntimacy(modal.pairId)}>Prolonger la nuit à trois</button><button type="button" className="btn secondary-action" onClick={() => finishTrioEnding("group-date-allenna-lineva-home", false)}>Pas ce soir</button><button type="button" className="btn secondary-action" onClick={() => finishTrioEnding("group-date-allenna-lineva-home", true)}>Rester complices ce soir</button>
    </V2Resultat>;
  }
  if (modal.kind === "home-date-result") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const property = propertyById(game.housing.propertyId)!;
    const naiah = character.id === "naiah";
    const naiahIntersex = naiah && game.player.sex === "intersexe";
    const copy = naiahIntersex
      ? "Cette continuation n’est pas encore écrite pour la configuration choisie. Le rendez-vous reste accompli et rejouable ; la chronique préfère s’arrêter ici plutôt que d’improviser une variante incomplète."
      : naiah
        ? "La lanterne est posée, le fauteuil reste déplacé et Naïah a déjà transformé vos habitudes en terrain de jeu. Vous pouvez ouvrir une continuation intime propre à ce logis, selon le niveau de narration choisi."
        : `Le jeu est rangé, les trois objets exposés ont retrouvé leur silence et la soirée dispose enfin du temps qu’aucun lieu public ne lui aurait laissé. Ici, vous pouvez explorer une route intime propre à ${character.name}, déclinée selon votre corps et votre réglage d’intimité.`;
    return <V2Resultat background={property.background} characters={[character]} surtitre="Le reste du monde est derrière votre porte" titre={`${character.name} ne semble pas pressé·e de partir`} texte={copy}>
      {!naiahIntersex && <button type="button" className="btn principal primary-action" onClick={() => startHomeIntimacy(character.id)}>{naiah ? "Rester proches au logis" : "Prolonger la nuit au logis"}</button>}<button type="button" className="btn secondary-action" onClick={onClose}>Rester enlacé·es, puis terminer ici</button>
    </V2Resultat>;  }
  if (modal.kind === "date-result") {
    const character = CHARACTERS.find((entry) => entry.id === modal.character)!;
    const date = DATE_SCENES.find((entry) => entry.id === modal.dateId)!;
    const naiah = character.id === "naiah";
    const naiahIntersex = naiah && game.player.sex === "intersexe";
    const refactored = ["lineva", "allenna"].includes(character.id) || AUTHORED_DATE_CHARACTERS.has(character.id);
    const desireReady = !refactored || game.settings.unlockAll || game.relationships[character.id].desire >= (date.minDesire || 22);
    const closeText = naiahIntersex
      ? "Le rendez-vous reste accompli et rejouable. Cette continuation n’est pas encore écrite pour la configuration choisie ; la chronique préfère s’arrêter ici plutôt que d’improviser une variante incomplète."
      : desireReady
      ? naiah
        ? `${character.name} reste près de vous. Le jeu peut devenir franchement sexuel sans cesser d’être le sien : défi, curiosité, magie et fourberie. Vous pouvez le poursuivre ou garder cette suite pour un autre soir.`
        : `${character.name} reste près de vous et attend une réponse franche. Vous pouvez prolonger la nuit, remettre la suite à un autre soir ou garder une proximité amicale pour ce rendez-vous seulement.`
      : `Après « ${date.title} », la proximité demeure douce, mais la tension physique ne demande pas encore à être prolongée. La soirée peut s'achever naturellement, sans fermer les suivantes.`;
    return <V2Resultat background={spotById(date.spot)?.background} characters={[character]} surtitre="La soirée refuse de finir" titre={`${character.name} reste près de vous`} texte={closeText}>
      {desireReady && !naiahIntersex && <button type="button" className="btn principal primary-action" onClick={() => startDateIntimacy(date.id)}>{naiah ? "Prolonger la proximité" : `Suivre ${character.name}`}</button>}{refactored && desireReady ? <><button type="button" className="btn secondary-action" onClick={() => finishDateEnding(date.id, false)}>Pas ce soir</button><button type="button" className="btn secondary-action" onClick={() => finishDateEnding(date.id, true)}>Rester proches amicalement</button></> : refactored ? <button type="button" className="btn secondary-action" onClick={() => finishDateEnding(date.id, false)}>Terminer doucement la soirée</button> : <button type="button" className="btn secondary-action" onClick={onClose}>Rentrer ensemble, puis se séparer ici</button>}
    </V2Resultat>;  }
  if (modal.kind === "intimacy") {
    return <InteractiveIntimacyModal key={`${modal.character}:${modal.home ? "home" : modal.dateId || "route"}:${modal.replay ? "replay" : "live"}`} modal={modal} game={game} onFinish={(memory) => onIntimacyClose(true, memory)} onStop={() => onIntimacyClose(false)} />;
  }
  if (modal.kind === "group-intimacy") {
    return <InteractiveGroupIntimacyModal key={`${modal.groupDateId}:${game.player.sex}:${modal.replay ? "replay" : "live"}`} modal={modal} game={game} onFinish={(memory) => onGroupIntimacyClose(true, memory)} onStop={() => onGroupIntimacyClose(false)} />;
  }
  if (modal.kind === "ritual") {
    const runes = ["✦", "◇", "◐", "⌁", "✧"];
    return <V2Fenetre surtitre="Mini-jeu de Résonance" titre="Accorder les quatre échos" classe="v2-jeu v2-rituel">
      {ritual.phase === "memorize" && <div className="jeu-phase"><p className="texte">Mémorisez la séquence. Elle disparaîtra lorsque vous commencerez.</p><div className="ritual-sequence runes-v2">{ritual.sequence.map((rune, index) => <span key={`${rune}-${index}`} style={{ "--i": index } as React.CSSProperties}>{rune}</span>)}</div><button type="button" className="btn principal primary-action" onClick={() => ritual.setPhase("play")}>Je suis prêt·e</button></div>}
      {ritual.phase === "play" && <div className="jeu-phase"><p className="texte">Reproduisez les échos dans le bon ordre.</p><div className="ritual-progress">{ritual.sequence.map((_, index) => <i className={index < ritual.step ? "done" : ""} key={index} />)}</div><div className="rune-buttons runes-v2">{runes.map((rune) => <button type="button" key={rune} onClick={() => ritual.play(rune)}>{rune}</button>)}</div></div>}
      {ritual.phase === "success" && <V2JeuResultat succes icone="✦" titre="Accord parfait" texte="Résonance +1 · Confluence +8"><button type="button" className="btn principal primary-action" onClick={onRitualClose}>Revenir</button></V2JeuResultat>}
      {ritual.phase === "failure" && <V2JeuResultat icone="◇" titre="Écho dissonant" texte="La tentative stabilise tout de même la Confluence de 2 points."><button type="button" className="btn secondary-action" onClick={onRitualClose}>Revenir</button></V2JeuResultat>}
    </V2Fenetre>;
  }
  if (modal.kind === "job") {
    const job = JOBS.find((entry) => entry.id === modal.jobId);
    if (!job || !jobState) return null;
    return <JobGameModal job={job} state={jobState} game={game} onBegin={onJobBegin} onMemoryStart={onMemoryStart} onAction={onJobAction} onFinish={onJobClose} onCancel={onClose} />;
  }
  return null;
}

type V2GiftReaction = { character: string; giftId: string; liked: boolean; affection: number; trust: number };

function SimpleModal({ title, text, actionLabel, gift, onClose }: { title: string; text: string; actionLabel?: string; gift?: V2GiftReaction; onClose: () => void }) {
  if (gift) return <V2CadeauReaction title={title} text={text} gift={gift} onClose={onClose} />;
  return <V2Fenetre surtitre="Chronique" titre={title} classe="etroit v2-avis" onClose={onClose} pied={<button type="button" className="btn principal primary-action" onClick={onClose}>{actionLabel || "Continuer"}</button>}>
    {text.split(/\n+/).filter(Boolean).map((paragraph, index) => <p key={index} className="texte grand">{paragraph}</p>)}
  </V2Fenetre>;
}

function ChronicleModal({ onClose }: { onClose: () => void }) {
  return <V2Fenetre surtitre="À propos de cette histoire" titre="Une branche alternative au début du Tome 1" classe="v2-avis" onClose={onClose} pied={<button type="button" className="btn principal primary-action" onClick={onClose}>Compris</button>}>
    <p className="texte grand">Hylee vient de quitter l’Auberge du Forestier avec Remerii. Iriana enquête seule sur des irrégularités impériales, Amanea règne encore à Akuhn’Nabad et Draven cherche l’aide nécessaire pour défendre Forthaven. Chacun suit déjà sa propre trajectoire lorsque votre arrivée déplace, à petite échelle, les liens entre ces routes.</p>
    <p className="texte grand">Vous savez être étranger·e à cette réalité, sans vous souvenir de celle dont vous venez. Vous ne connaissez ni l’avenir ni les événements des romans : les alliances que vous bâtirez appartiennent entièrement à cette chronique.</p>
  </V2Fenetre>;
}

/* ---------- Fenêtres V2.5 : cadre commun, portraits réactifs, cartes animées (aucune logique propre). ---------- */
function V2Fenetre({ surtitre, titre, classe = "", onClose, children, pied, style, label }: { surtitre?: string; titre: React.ReactNode; classe?: string; onClose?: () => void; children: React.ReactNode; pied?: React.ReactNode; style?: React.CSSProperties; label?: string }) {
  useEffect(() => { sfx("ouvrir"); }, []);
  return <div className="v2 v2-fen-calque"><div className="modal-backdrop v2-fen-fond" role="presentation">
    <section className={`v2-fen dlg-boite ${classe}`} role="dialog" aria-modal="true" aria-label={label || (typeof titre === "string" ? titre : undefined)} style={style}>
      <Orn4 />
      <header className="dlg-tete"><div>{surtitre && <span className="surtitre">{surtitre}</span>}<h2>{titre}</h2></div>{onClose && <button type="button" className="dlg-x modal-close" data-close aria-label="Fermer" onClick={onClose}><span>✕</span><kbd>Échap</kbd></button>}</header>
      <div className="dlg-corps">{children}</div>
      {pied && <footer className="dlg-pied">{pied}</footer>}
    </section>
  </div></div>;
}

/* Portrait illustré (avec son décor) fondu dans l’interface : fiches et dossiers. Repli sur le sprite si le personnage n’a pas de portrait. */
function V2PortraitFiche({ character }: { character: CharacterData }) {
  const [repli, setRepli] = useState(!character.portrait);
  useEffect(() => { setRepli(!character.portrait); }, [character.id, character.portrait]);
  if (repli) return <figure className="fiche-sprite" key={character.id}><div className="halo" /><img className="sprite entree respire" src={spritePath(character.id, character.defaultMood, character.defaultMood)} alt={character.name} /></figure>;
  return <figure className="fiche-sprite fiche-portrait" key={character.id} data-portrait={character.id}><div className="halo" /><img className="portrait-img entree" src={character.portrait} alt={character.name} onError={() => setRepli(true)} /><span className="portrait-voile" aria-hidden="true" /></figure>;
}

function V2PortraitCarte({ character }: { character: CharacterData }) {
  const [repli, setRepli] = useState(!character.portrait);
  useEffect(() => { setRepli(!character.portrait); }, [character.id, character.portrait]);
  if (repli) return <V2Portrait character={character} />;
  return <figure className="fen-sprite fen-portrait" style={{ "--c": character.color } as React.CSSProperties} data-portrait={character.id} aria-hidden="true">
    <img className="fen-portrait-img" src={character.portrait} alt="" onError={() => setRepli(true)} />
    <span className="portrait-voile" />
    <figcaption className="fen-plaque"><b>{character.name}</b></figcaption>
  </figure>;
}

function V2Portrait({ character, mood, classe = "" }: { character: CharacterData; mood?: string; classe?: string }) {
  const resolved = mood || character.defaultMood;
  return <figure className={`fen-sprite ${classe}`} style={{ "--c": character.color } as React.CSSProperties} aria-hidden="true">
    <div className="halo" />
    <img key={resolved} className="fen-sprite-img" src={spritePath(character.id, resolved, character.defaultMood)} alt="" onError={(event) => recoverMissingSprite(event, character.portrait)} />
    <figcaption className="fen-plaque"><b>{character.name}</b></figcaption>
  </figure>;
}

/* Cadeau : la personne réagit selon la vraie préférence (giftLikes) — mêmes sprites réactifs que les scènes. */
const V2_GIFT_MOOD = { liked: "happy", other: "curious" } as const;
function V2Cadeau({ game, character, present, owned, onGive, onClose }: { game: GameState; character: CharacterData; present: boolean; owned: typeof GIFTS; onGive: (character: string, gift: string) => void; onClose: () => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const hovered = owned.find((gift) => gift.id === hover);
  const hoveredLiked = Boolean(hovered && character.giftLikes.includes(hovered.id));
  return <V2Fenetre surtitre="Remettre un présent" titre={`Offrir à ${character.name}`} classe="large v2-cadeau" style={{ "--c": character.color } as React.CSSProperties} onClose={onClose} pied={<button type="button" className="btn secondary-action" onClick={onClose}>Annuler</button>}>
    <div className="fen-vn">
      <V2Portrait character={character} mood={hovered ? (hoveredLiked ? V2_GIFT_MOOD.liked : V2_GIFT_MOOD.other) : undefined} classe={hovered ? (hoveredLiked ? "ravi" : "poli") : ""} />
      <div className="fen-vn-texte">
        <span className={`fen-etat ${present ? "ouvert" : ""}`}>{present ? `Avec vous · ${spotById(game.spot)?.name}` : `${character.name} n’est plus ici`}</span>
        {present && owned.length ? <div className="cad-grille">{owned.map((gift, index) => { const liked = character.giftLikes.includes(gift.id); return <button type="button" key={gift.id} data-don={gift.id} className={`cad-carte rar-${v2Rarity(gift.price)} ${liked ? "aime" : ""}`} style={{ "--i": index } as React.CSSProperties} onPointerEnter={() => setHover(gift.id)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(gift.id)} onBlur={() => setHover(null)} onClick={() => onGive(character.id, gift.id)}><span className="od-ico"><i>{gift.icon}</i></span><b>{gift.name}</b><small>{gift.description}</small><span className="cd-n">×{game.inventory[gift.id]}</span>{liked && <em>♥ Favori</em>}<span className="cad-rar">{v2RarityLabel(gift.price)}</span></button>; })}</div>
          : <p className="discret">{present ? "Votre inventaire ne contient aucun présent. Achetez-en au marché depuis Biens." : `Rejoignez ${character.name} au même sous-lieu avant de remettre l’objet.`}</p>}
      </div>
    </div>
  </V2Fenetre>;
}

function V2CadeauReaction({ title, text, gift, onClose }: { title: string; text: string; gift: V2GiftReaction; onClose: () => void }) {
  const character = CHARACTERS.find((entry) => entry.id === gift.character);
  const item = GIFTS.find((entry) => entry.id === gift.giftId);
  if (!character || !item) return null;
  return <V2Fenetre surtitre={`Présent remis · ${item.name}`} titre={title} classe="large v2-cadeau v2-reaction" style={{ "--c": character.color } as React.CSSProperties} onClose={onClose} pied={<button type="button" className="btn principal primary-action" onClick={onClose}>Continuer</button>}>
    <div className="fen-vn">
      <V2Portrait character={character} mood={gift.liked ? V2_GIFT_MOOD.liked : V2_GIFT_MOOD.other} classe={gift.liked ? "ravi" : "poli"} />
      <div className="fen-vn-texte">
        <div className={`cad-remis rar-${v2Rarity(item.price)} ${gift.liked ? "aime" : ""}`}><span className="od-ico"><i>{item.icon}</i></span><b>{item.name}</b>{gift.liked && <em>♥ Favori</em>}</div>
        {gift.liked && <span className="cad-coeurs" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((index) => <i key={index} style={{ "--i": index } as React.CSSProperties}>♥</i>)}</span>}
        {text.split(/\n+/).filter(Boolean).map((paragraph, index) => <p key={index} className="texte grand">{paragraph}</p>)}
        {(gift.affection > 0 || gift.trust > 0) && <div className="cad-gains">{gift.affection > 0 && <span className="aff">♥ Affection +{gift.affection}</span>}{gift.trust > 0 && <span className="conf">✦ Confiance +{gift.trust}</span>}</div>}
      </div>
    </div>
  </V2Fenetre>;
}

function V2Lettre({ game, character, surtitre, subject, delivery, body, signature, attachment, replies, repliesHint, onReply, response, noReplyHint, onClose }: { game: GameState; character?: CharacterData; surtitre: string; subject: string; delivery: string; body: string[]; signature: string; attachment?: string; replies?: { id: string; label: string }[]; repliesHint: string; onReply: (replyId: string) => void; response?: string; noReplyHint?: string; onClose: () => void }) {
  return <V2Fenetre surtitre={surtitre} titre={subject} classe="large v2-lettre" style={{ "--c": character?.color } as React.CSSProperties} onClose={onClose} pied={<button type="button" className="btn secondary-action" onClick={onClose}>Refermer la lettre</button>}>
    <div className="lettre-tete">{character && <Seau color={character.color} portrait={character.portrait} className="grand" />}<div><b>{character?.name}</b><small>{delivery}</small></div></div>
    <article className="lettre-papier">{body.map((paragraph, index) => <p key={index} style={{ "--i": index } as React.CSSProperties}>{replacePlayer(paragraph, game.player)}</p>)}<strong className="lettre-signature">{signature}</strong><span className="lettre-cachet" aria-hidden="true">✦</span></article>
    {attachment && <div className="lettre-jointe"><span className="od-ico petit"><i>◇</i></span><div><small>Objet joint</small><strong>{attachment}</strong></div></div>}
    {replies ? <div className="lettre-reponses"><span className="surtitre">{repliesHint}</span>{replies.map((reply, index) => <button type="button" key={reply.id} className="v2-choix-carte" data-reponse={reply.id} style={{ "--i": index } as React.CSSProperties} onClick={() => onReply(reply.id)}><i>{ROMAINS[index + 1] || index + 1}</i><span>{reply.label}</span></button>)}</div>
      : response ? <div className="lettre-reponse"><span className="surtitre">Votre réponse</span><p>{response}</p></div>
      : noReplyHint ? <p className="discret">{noReplyHint}</p> : null}
  </V2Fenetre>;
}

function V2Resultat({ background, characters, surtitre, titre, texte, children }: { background?: string; characters: CharacterData[]; surtitre: string; titre: string; texte: string; children: React.ReactNode }) {
  useEffect(() => { sfx("ouvrir"); }, []);
  return <div className="v2 v2-fen-calque"><div className="modal-backdrop v2-fen-fond v2-resultat" role="presentation" style={{ backgroundImage: background ? `linear-gradient(180deg, rgba(5,6,12,.25), rgba(5,6,12,.92) 82%), url(${background})` : undefined }}>
    <div className={`resultat-scene cast-${characters.length}`}>{characters.map((character) => <V2Portrait key={character.id} character={character} />)}</div>
    <section className="v2-fen dlg-boite resultat-boite" role="dialog" aria-modal="true" aria-label={titre}><Orn4 />
      <header className="dlg-tete"><div><span className="surtitre">{surtitre}</span><h2>{titre}</h2></div></header>
      <div className="dlg-corps"><p className="texte grand">{texte}</p></div>
      <footer className="dlg-pied date-result-actions">{children}</footer>
    </section>
  </div></div>;
}

function V2JeuResultat({ succes = false, icone, titre, texte, gain, children }: { succes?: boolean; icone: string; titre: string; texte: string; gain?: string; children: React.ReactNode }) {
  return <div className={`jeu-resultat ritual-result ${succes ? "success" : ""}`}><span className="jeu-embleme">{icone}</span><h3>{titre}</h3><p className="texte">{texte}</p>{gain && <strong className="job-pay jeu-gain">{gain}</strong>}<div className="jeu-resultat-actions">{children}</div></div>;
}

type V2DialogState =
  | { kind: "pause" | "save" | "load" | "options" | "about" | "story" | "new" | "registre" | "plus" | "wait" | "housing" | "sell" | "residents" }
  | { kind: "job"; jobId: string }
  | { kind: "date"; dateId: string }
  | { kind: "display"; slot: number }
  | null;

/* ==========================================================================
   Interface V2 « Les Liens du Crépuscule » — scènes branchées sur l’état réel
   ========================================================================== */

type V2Tab = "place" | "map" | "relations" | "journal" | "jobs" | "inventory" | "codex" | "options";
type V2LinksView = "liens" | "fiche" | "rdv" | "trio";
type V2ToastType = "relation" | "romance" | "lettre" | "codex" | "chronique" | "butin" | "temps";
type V2LogEntry = { id: number; type: V2ToastType; icon: string; title: string; detail?: string; label: string; t: string; read: boolean };

const V2_TABS: [V2Tab, string, string][] = [["place", "Lieu", "◉"], ["map", "Carte", "⌖"], ["relations", "Liens", "♡"], ["journal", "Journal", "✎"], ["jobs", "Jobs", "◈"], ["inventory", "Biens", "⌂"], ["codex", "Codex", "✧"]];
const V2_PERIOD_CLASSES = ["p-aube", "p-matin", "p-apres", "p-soir"];
const V2_NOTIF: Record<NotificationKind, { type: V2ToastType; icon: string; label: string }> = {
  unlock: { type: "romance", icon: "✦", label: "Déblocage" },
  item: { type: "butin", icon: "◇", label: "Inventaire" },
  relation: { type: "relation", icon: "♥", label: "Relation" },
  story: { type: "chronique", icon: "▤", label: "Chronique" },
  codex: { type: "codex", icon: "✧", label: "Codex" },
  home: { type: "chronique", icon: "⌂", label: "Logis" },
  letter: { type: "lettre", icon: "✉", label: "Correspondance" },
  invitation: { type: "romance", icon: "◈", label: "Invitation" },
  rumor: { type: "chronique", icon: "◌", label: "Rumeur" },
  knowledge: { type: "codex", icon: "◇", label: "Découverte" },
};
const V2_JOB_ICONS: Record<string, string> = { service: "♨", observation: "◎", bargain: "⚖", sort: "▦", timing: "◷", packing: "▣", path: "⌁", assembly: "⚙", memory: "✧" };
const V2_FX_BY_TAB: Record<string, FxMode> = { map: "givre", relations: "petales", journal: "poussiere", jobs: "poussiere", inventory: "poussiere", codex: "lucioles", options: "lucioles" };

function v2Rarity(price: number) { return price >= 14 ? "rare" : price >= 10 ? "fin" : "commun"; }
function v2RarityLabel(price: number) { return price >= 14 ? "Rare" : price >= 10 ? "Raffiné" : "Commun"; }

/** Libellés réels d’interaction d’une présence (même logique que l’ancien panneau Présences). */
function presenceInteraction(game: GameState, character: CharacterData) {
  const relation = game.relationships[character.id];
  const rawNextScene = sceneFor(character.id, relation.stage);
  const nextScene = rawNextScene ? relationRouteVariant(rawNextScene, game).route : undefined;
  const place = characterPlace(character, game.day, game.period, game.flags, game.housing);
  const special = routeAvailableAtPlace(nextScene, game);
  const queuedSocial = chooseSocialScene(character.id, game);
  const confidence = availableSecretForCharacter(character.id, game);
  const homeInteraction = propertyById(game.housing.propertyId)?.spot === game.spot && game.housing.residents.includes(character.id);
  const label = !relation.met
    ? "Première rencontre"
    : homeInteraction
      ? "Moment au logis"
      : queuedSocial?.oneTime
        ? `Événement croisé · ${queuedSocial.title}`
        : special && nextScene
          ? `Scène de relation · ${nextScene.title}`
          : confidence
            ? `Confidence · ${confidence.title}`
            : queuedSocial
              ? `Liens croisés · ${queuedSocial.title}`
              : "Moment libre";
  const action = confidence && !homeInteraction && !queuedSocial?.oneTime && !special ? "Écouter" : special || queuedSocial?.oneTime ? "Vivre la scène" : "Parler";
  const hasDatePlanner = DATE_SCENES.some((date) => date.character === character.id) || Boolean(HOME_DATE_PROFILES[character.id]);
  return { relation, place, label, action, hasDatePlanner, important: Boolean(special || queuedSocial?.oneTime) };
}

function v2SlotDetails(slot: number | "auto") {
  if (typeof window === "undefined") return undefined;
  const raw = window.localStorage.getItem(slot === "auto" ? SAVE_KEY : `sylvinia-liens-slot-${slot}`);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Partial<GameState> & { savedAt?: string };
    const spot = parsed.spot ? spotById(parsed.spot) : undefined;
    const location = LOCATIONS.find((entry) => entry.id === parsed.location);
    return {
      name: parsed.player?.name || "Chronique",
      day: parsed.day ?? 1,
      period: PERIODS[parsed.period ?? 0]?.label || "",
      place: [spot?.name, location?.name].filter(Boolean).join(" · "),
      background: spot?.background || location?.background || "",
      savedAt: parsed.savedAt,
      coins: parsed.coins,
    };
  } catch { return { name: "Sauvegarde illisible", day: 0, period: "", place: "", background: "", savedAt: undefined, coins: undefined }; }
}

function V2SceneTete({ surtitre, titre, children }: { surtitre: string; titre: string; children?: React.ReactNode }) {
  return <header className="scene-tete"><div><span className="surtitre">{surtitre}</span><h1 className="titre-jeu">{titre}</h1></div>{children}</header>;
}

function V2Compteur({ value }: { value: number }) {
  const [shown, setShown] = useState(() => (reduit() ? value : 0));
  useEffect(() => {
    if (reduit()) { setShown(value); return; }
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => { const k = Math.min(1, (now - start) / 900); setShown(Math.round(value * (1 - Math.pow(1 - k, 3)))); if (k < 1) frame = requestAnimationFrame(step); };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <b className="compteur">{shown}</b>;
}

function V2Stat({ cls, label, value, max = 100 }: { cls: string; label: string; value: number; max?: number }) {
  return <div className={`stat ${cls}`}><span className="stat-lib">{label}</span><span className="stat-barre"><i style={{ "--v": `${Math.min(100, Math.max(0, (value / max) * 100))}%` } as React.CSSProperties} /></span><V2Compteur value={value} /></div>;
}

function V2RangLosange({ stage }: { stage: number }) { return <span className="rang-losange"><b>{ROMAINS[stage] ?? stage}</b></span>; }

function V2Fond({ src, flou }: { src: string; flou: boolean }) {
  const [layers, setLayers] = useState<{ a: string; b: string; showA: boolean }>({ a: src, b: "", showA: true });
  useEffect(() => {
    setLayers((current) => {
      const visible = current.showA ? current.a : current.b;
      if (visible === src) return current;
      return current.showA ? { a: current.a, b: src, showA: false } : { a: src, b: current.b, showA: true };
    });
  }, [src]);
  return <div className={`fond ${flou ? "flou" : ""}`} aria-hidden="true">
    {layers.a && <img alt="" src={layers.a} style={{ opacity: layers.showA ? 1 : 0 }} />}
    {layers.b && <img alt="" src={layers.b} style={{ opacity: layers.showA ? 0 : 1 }} />}
  </div>;
}

const V2_HAIR = ["#3a2230", "#1b1b22", "#e8d6a8", "#b8563a", "#dfe7f2", "#6d4bb0"];
const V2_EYES = ["#62d4c7", "#d8bd78", "#8964c4", "#6fa7e8", "#c0473f", "#6c8a4f"];
const V2_SKIN = ["#f3d2b8", "#e2b48f", "#c68e62", "#9a6440", "#6b4128", "#f0c9a8"];
const V2_INTIMACY: [Intimacy, string, string][] = [["tendre", "Tendre", "Romance, baisers et proximité douce"], ["suggestif", "Suggestif", "Sensuel sans description anatomique"], ["explicite", "Explicite", "Narration adulte détaillée, sans coupure — confirmation requise"], ["ellipse", "Fondu au noir", "Toute intimité reste hors champ"]];
const V2_PRONOUNS: Pronouns[] = ["elle", "iel", "il"];
const V2_SEXES: PlayerSex[] = ["femme", "intersexe", "homme"];
const v2SexLabel = (sex: PlayerSex) => (sex === "femme" ? "Femme" : sex === "homme" ? "Homme" : "Intersexe");
const v2Cap = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function V2Selecteur<T extends string>({ values, value, label, onChange }: { values: T[]; value: T; label: (value: T) => string; onChange: (value: T) => void }) {
  const index = Math.max(0, values.indexOf(value));
  const move = (dir: number) => { sfx("survol"); onChange(values[(index + dir + values.length) % values.length]); };
  return <div className="selecteur"><button type="button" className="sel-fl" aria-label="Précédent" onClick={() => move(-1)}>◀</button><span className="sel-val">{label(value)}</span><button type="button" className="sel-fl" aria-label="Suivant" onClick={() => move(1)}>▶</button><i className="sel-pts">{values.map((entry) => <b key={entry} className={entry === value ? "on" : ""} />)}</i></div>;
}

function V2Palette({ colors, value, label, onChange }: { colors: string[]; value: string; label: string; onChange: (value: string) => void }) {
  const custom = !colors.includes(value);
  return <div className="couleurs">
    {colors.map((color) => <button type="button" key={color} style={{ "--c": color } as React.CSSProperties} aria-label={`${label} ${color}`} aria-pressed={value === color} onClick={() => onChange(color)} />)}
    <label className={`couleur-libre ${custom ? "on" : ""}`} style={{ "--c": value } as React.CSSProperties} title="Couleur personnalisée"><input type="color" value={value} aria-label={`${label} : couleur personnalisée`} onChange={(event) => onChange(event.target.value)} /><span aria-hidden="true">✎</span></label>
  </div>;
}

function V2ChoiceCards({ items, value, cls = "", onChoose }: { items: readonly (readonly string[])[]; value: string; cls?: string; onChoose: (name: string) => void }) {
  return <div className={`cartes-choix ${cls}`}>{items.map(([name, detail], index) => <button type="button" key={name} className="carte-choix" aria-pressed={value === name} style={{ "--i": index } as React.CSSProperties} onClick={() => onChoose(name)}><span className="cc-num">{ROMAINS[index + 1] || index + 1}</span><strong>{name}</strong><span>{detail}</span></button>)}</div>;
}

function V2Creation({ player, setPlayer, onBack, onBegin, music, onToggleMusic, sons, onToggleSons }: { player: Player; setPlayer: (player: Player) => void; onBack: () => void; onBegin: () => void; music: boolean; onToggleMusic: () => void; sons: boolean; onToggleSons: () => void }) {
  const [step, setStep] = useState(0);
  const [explicitWarning, setExplicitWarning] = useState(false);
  const names = ["Identité", "Écho", "Vocation", "Intimité"];
  const identityValid = Boolean(player.name.trim()) && player.age >= 18;
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => { contentRef.current?.scrollTo({ top: 0 }); }, [step]);
  const back = useCallback(() => { sfx("retour"); if (step > 0) setStep((current) => current - 1); else onBack(); }, [step, onBack]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (explicitWarning || document.querySelector("dialog[open], .modal-backdrop")) return;
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input[type=text], input[type=number]");
      if (event.key === "Escape") { event.preventDefault(); back(); return; }
      if (typing) return;
      const dirs: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (dirs[event.key]) { event.preventDefault(); moveFocus(...dirs[event.key]); }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [back, explicitWarning]);
  const next = () => {
    if (step === 0 && !identityValid) return;
    if (step < 3) { sfx("valider"); setStep(step + 1); return; }
    if (!identityValid) { setStep(0); return; }
    sfx("depart");
    onBegin();
  };
  const chooseIntimacy = (id: Intimacy) => { if (id === "explicite" && player.intimacy !== "explicite") setExplicitWarning(true); else setPlayer({ ...player, intimacy: id }); };
  const glyphs = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ";
  return <main className="creation" aria-label="Création de personnage">
    <div className="c-fond" aria-hidden="true" />
    <header className="c-tete">
      <button type="button" className="bouton-coin retour-btn" onClick={() => { sfx("retour"); onBack(); }}><Kbd>Échap</Kbd> Titre</button>
      <ol className="c-etapes">{names.map((name, index) => <li key={name} className={index === step ? "actif" : index < step ? "fait" : ""} aria-current={index === step ? "step" : undefined}><b>{index < step ? "✓" : ROMAINS[index + 1]}</b><span>{name}</span></li>)}</ol>
      <div className="t-coin statique"><AudioButtons music={music} onMusic={onToggleMusic} sons={sons} onSons={onToggleSons} /></div>
    </header>
    <section className="c-portail" aria-label="Aperçu">
      <svg className="runes" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="186" className="r1" /><circle cx="200" cy="200" r="170" className="r2" /><circle cx="200" cy="200" r="132" className="r3" />
        <g className="r-glyphes">{Array.from({ length: 24 }, (_, index) => <text key={index} x="200" y="26" transform={`rotate(${index * 15} 200 200)`} textAnchor="middle">{glyphs[index % 12]}</text>)}</g>
        <g className="r-etoile"><path d="M200 70 L313 265 L87 265 Z" /><path d="M200 330 L87 135 L313 135 Z" /></g>
      </svg>
      <svg className="silhouette" viewBox="0 0 200 260" aria-hidden="true">
        <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2140" /><stop offset="1" stopColor="#0b0d18" /></linearGradient></defs>
        <path d="M100 18c-30 0-46 22-46 50 0 20 8 36 20 46-30 8-54 28-60 60l-6 86h184l-6-86c-6-32-30-52-60-60 12-10 20-26 20-46 0-28-16-50-46-50z" fill="url(#sg)" stroke="rgba(243,228,181,.55)" strokeWidth="1.5" />
        <ellipse cx="100" cy="74" rx="34" ry="40" fill={player.skin} opacity=".22" />
        <path d="M56 70c-4-34 20-56 44-56s50 18 46 58c-8-22-22-34-46-34S62 50 56 70z" fill={player.hair} opacity=".95" />
        <circle cx="84" cy="74" r="4" fill={player.eyes} className="oeil" /><circle cx="116" cy="74" r="4" fill={player.eyes} className="oeil" />
      </svg>
      <div className="c-plaque"><span className="surtitre">Votre chronique</span><strong>{player.name.trim() || "Sans nom"}</strong><small>{v2Cap(player.pronouns)} · {player.age} ans · {v2SexLabel(player.sex)}</small>
        <dl><dt>Écho</dt><dd>{player.origin}</dd><dt>Vocation</dt><dd>{player.vocation}</dd><dt>Trait</dt><dd>{player.trait}</dd></dl></div>
    </section>
    <section className="c-panneau cadre"><Orn4 /><div className="c-contenu" ref={contentRef}>
      {step === 0 && <>
        <h2 className="titre-jeu">Qui franchit le portail ?</h2><p className="intro">Votre passé s’est effacé. Ce que vous choisirez ici vous appartiendra.</p>
        <div className="c-champs">
          <label className="c-ligne"><span>Nom</span><input id="c-nom" type="text" value={player.name} maxLength={24} autoComplete="off" placeholder="Votre nom" onChange={(event) => setPlayer({ ...player, name: event.target.value })} /></label>
          <div className="c-ligne"><span>Pronoms</span><V2Selecteur values={V2_PRONOUNS} value={player.pronouns} label={v2Cap} onChange={(pronouns) => setPlayer({ ...player, pronouns })} /></div>
          <div className="c-ligne"><span>Corps</span><V2Selecteur values={V2_SEXES} value={player.sex} label={v2SexLabel} onChange={(sex) => setPlayer({ ...player, sex })} /></div>
          <label className="c-ligne"><span>Âge</span><input id="c-age" type="number" min={18} max={120} value={player.age} onChange={(event) => setPlayer({ ...player, age: Number(event.target.value) })} /></label>
          <div className="c-ligne"><span>Cheveux</span><V2Palette colors={V2_HAIR} value={player.hair} label="Cheveux" onChange={(hair) => setPlayer({ ...player, hair })} /></div>
          <div className="c-ligne"><span>Yeux</span><V2Palette colors={V2_EYES} value={player.eyes} label="Yeux" onChange={(eyes) => setPlayer({ ...player, eyes })} /></div>
          <div className="c-ligne"><span>Peau</span><V2Palette colors={V2_SKIN} value={player.skin} label="Peau" onChange={(skin) => setPlayer({ ...player, skin })} /></div>
        </div>
        {!identityValid && <p className="c-erreur" role="alert">{!player.name.trim() ? "Indiquez un nom pour continuer." : "La chronique est réservée aux personnes majeures (18 ans minimum)."}</p>}
      </>}
      {step === 1 && <><h2 className="titre-jeu">Un écho vous suit</h2><p className="intro">Votre mémoire est vide, mais certains réflexes ont traversé le portail avec vous.</p><V2ChoiceCards items={ECHOES} value={player.origin} onChoose={(origin) => setPlayer({ ...player, origin })} /></>}
      {step === 2 && <><h2 className="titre-jeu">Votre manière d’avancer</h2><p className="intro">La vocation est la place que vous choisissez de construire à Al’Gratal ; le trait révèle ce que les autres remarquent d’abord.</p><V2ChoiceCards items={VOCATIONS} value={player.vocation} cls="deux" onChoose={(vocation) => setPlayer({ ...player, vocation })} /><h3 className="c-sous">Trait dominant</h3><V2ChoiceCards items={TRAITS} value={player.trait} cls="quatre" onChoose={(trait) => setPlayer({ ...player, trait })} /></>}
      {step === 3 && <><h2 className="titre-jeu">Réglage d’intimité</h2><p className="intro">Adapte la narration des scènes concernées. Le corps choisi adapte les scènes intimes ; il ne détermine ni vos pronoms ni vos relations. Modifiable à tout moment dans les Options.</p>
        <div className="cartes-choix deux">{V2_INTIMACY.map(([id, title, detail], index) => <button type="button" key={id} className="carte-choix" aria-pressed={player.intimacy === id} style={{ "--i": index } as React.CSSProperties} onClick={() => chooseIntimacy(id)}><span className="cc-num">{ROMAINS[index + 1]}</span><strong>{title}</strong><span>{detail}</span></button>)}</div>
        <div className="avert"><b>18+</b><p>Chronique réservée aux personnes majeures. Aucune scène intime ne se déclenche sans votre choix explicite ; chaque lien peut rester platonique. Une sauvegarde automatique sera créée au début du prologue.</p></div></>}
    </div></section>
    <footer className="c-pied">
      <span className="hints"><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd> Naviguer <Kbd>Entrée</Kbd> Choisir <Kbd>Échap</Kbd> Retour</span>
      <div className="c-boutons"><button type="button" className="btn" onClick={back}>{step === 0 ? "Annuler" : "◀ Précédent"}</button><button type="button" className="btn principal" disabled={step === 0 && !identityValid} onClick={next}>{step === 3 ? "Franchir le portail ✦" : "Suivant ▶"}</button></div>
    </footer>
    {explicitWarning && <div className="v2-legacy-layer"><ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { setPlayer({ ...player, intimacy: "explicite" }); setExplicitWarning(false); }} /></div>}
  </main>;
}

function V2Hud({ game, tab, onTab, badges, unread, onRegistre, onPause, music, onToggleMusic, soundtrackLabel }: { game: GameState; tab: V2Tab; onTab: (tab: V2Tab) => void; badges: Partial<Record<V2Tab, number>>; unread: number; onRegistre: () => void; onPause: () => void; music: boolean; onToggleMusic: () => void; soundtrackLabel: string }) {
  const period = PERIODS[game.period];
  return <header className="hud">
    <div className="hud-date" aria-live="polite">
      <div className="hud-jour"><small>Jour</small><b>{game.day}</b></div>
      <div className="hud-periode"><span className="hud-per-nom"><i>{period.icon}</i>{period.label}</span><em>{period.time}</em>
        <span className="hud-phases" aria-label={`Période ${game.period + 1} sur ${PERIODS.length}`}>{PERIODS.map((entry, index) => <b key={entry.id} className={index === game.period ? "on" : index < game.period ? "passe" : ""} title={entry.label} />)}</span></div>
    </div>
    <nav className="hud-onglets" aria-label="Menu du jeu">
      <span className="hud-touche"><Kbd>Q</Kbd></span>
      {V2_TABS.map(([id, label, icon]) => <button type="button" key={id} className={`onglet ${tab === id ? "actif" : ""}`} data-onglet={id} title={label} aria-label={label} aria-current={tab === id ? "page" : undefined} onClick={() => onTab(id)}><i aria-hidden="true">{icon}</i><span>{label}</span>{badges[id] ? <b className="pastille">{badges[id]}</b> : null}</button>)}
      <span className="hud-touche"><Kbd>E</Kbd></span>
    </nav>
    <div className="hud-droite">
      <span className="hud-bourse" title="Pièces"><i>◈</i><b>{game.coins}</b></span>
      <button type="button" className={`rond hud-musique ${music ? "on" : ""}`} aria-pressed={music} title={music ? `Couper la musique · ${soundtrackLabel}` : `Activer la musique · ${soundtrackLabel}`} aria-label={music ? `Couper la musique · ${soundtrackLabel}` : `Activer la musique · ${soundtrackLabel}`} onClick={onToggleMusic}><svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="6.5" cy="18" r="2.6" fill="currentColor" /><circle cx="17.5" cy="16" r="2.6" fill="currentColor" /></svg></button>
      <button type="button" className="rond" aria-label="Registre des notifications" title="Registre" onClick={onRegistre}><svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z M10 21h4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>{unread > 0 && <b className="pastille badge-registre">{unread}</b>}</button>
      <button type="button" className="rond" aria-label="Menu système" title="Menu système (Échap)" onClick={onPause}><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" /></svg></button>
    </div>
  </header>;
}

type V2LieuProps = {
  game: GameState;
  location: (typeof LOCATIONS)[number];
  spot: NonNullable<ReturnType<typeof spotById>>;
  spots: NonNullable<ReturnType<typeof spotById>>[];
  present: CharacterData[];
  visible: CharacterData[];
  visitors: { character: CharacterData; target: NonNullable<ReturnType<typeof nextPresence>> }[];
  event?: SpontaneousEvent;
  rumor?: RumorTemplate;
  onTalk: (id: string) => void;
  onGift: (id: string) => void;
  onDate: (id: string) => void;
  onFiche: (id: string) => void;
  onActivity: (id: string) => void;
  onJob: (job: JobData) => void;
  onWait: () => void;
  onWaitFor: () => void;
  onMap: () => void;
  onSpot: (spotId: string) => void;
  onEvent: (event: SpontaneousEvent) => void;
  onRumor: (rumor: RumorTemplate) => void;
};

function V2Lieu({ game, location, spot, spots, present, visible, visitors, event, rumor, onTalk, onGift, onDate, onFiche, onActivity, onJob, onWait, onWaitFor, onMap, onSpot, onEvent, onRumor }: V2LieuProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(present[0]?.id);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => { setExpanded(false); }, [spot.id]);
  const character = present.find((entry) => entry.id === selectedId) || present[0];
  const info = character ? presenceInteraction(game, character) : undefined;
  const nextPeriod = PERIODS[(game.period + 1) % PERIODS.length];
  const jobs = jobsAtSpot(spot.id);
  type Cmd = { key: string; icon: string; label: string; sub?: string; onClick: () => void; locked?: boolean };
  const activities: Cmd[] = [
    ...spot.activities.flatMap((id): Cmd[] => { const activity = ACTIVITIES[id]; return activity ? [{ key: `act-${id}`, icon: activity.icon, label: activity.label, sub: activity.detail, onClick: () => onActivity(id) }] : []; }),
    ...jobs.map((job) => { const access = jobAccess(game, job); return { key: `job-${job.id}`, icon: access.unlocked ? "◈" : "♙", label: job.title, sub: access.unlocked ? `${JOB_KIND_LABELS[job.kind]} · +${job.reward} ◈` : `Lien avec ${access.characterName} · ${access.value}/${access.target}`, onClick: () => onJob(job), locked: !access.unlocked }; }),
  ];
  const item = (cmd: Cmd, extra = "", principal = false) => <li key={cmd.key} className={extra}><button type="button" className={`cmd-item ${cmd.locked ? "verrou" : ""}`} data-cmd={cmd.key} data-principal={principal ? "" : undefined} onClick={cmd.onClick}><i className="cmd-ico">{cmd.icon}</i><span className="cmd-lib">{cmd.label}</span>{cmd.sub && <small>{cmd.sub}</small>}<b className="cmd-fl">▸</b></button></li>;
  const otherSpots = spots.filter((entry) => entry.id !== spot.id);
  return <div className="lieu">
    <section className="lieu-plaque">
      <span className="surtitre">{location.subtitle}</span>
      <h1 className="titre-jeu geant">{location.name}</h1>
      <div className="lieu-spot"><i>{spot.icon}</i><span>{spot.name}</span></div>
      <p className="lieu-desc">{spot.description}</p>
      {(event || rumor) && <div className="lieu-evts">
        {event && <button type="button" className="evt" data-act="evenement" onClick={() => onEvent(event)}><i>✦</i><span><small>Événement</small>{event.title}</span></button>}
        {rumor && <button type="button" className="evt rumeur" data-act="rumeur" onClick={() => onRumor(rumor)}><i>◌</i><span><small>Rumeur</small>Un écho circule ici</span></button>}
      </div>}
      {otherSpots.length > 0 && <nav className="lieu-sous" aria-label={`Sous-lieux de ${location.name}`}>
        <span className="surtitre">Sous-lieux · même lieu</span>
        <div>{spots.map((entry) => { const occupants = visible.filter((who) => characterPlace(who, game.day, game.period, game.flags, game.housing).spot === entry.id); return <button type="button" key={entry.id} className={`sous-lieu ${entry.id === spot.id ? "actif" : ""}`} disabled={entry.id === spot.id} aria-current={entry.id === spot.id ? "true" : undefined} title={occupants.length ? occupants.map((who) => who.name).join(" · ") : "Lieu calme"} onClick={() => onSpot(entry.id)}><i>{entry.icon}</i><span>{entry.shortName}</span>{occupants.length > 0 && <b>{occupants.length} ♡</b>}</button>; })}</div>
      </nav>}
    </section>
    {character && info && <figure className="lieu-perso" key={character.id} style={{ "--c": character.color } as React.CSSProperties} aria-label={character.name}>
      <div className="halo" />
      <img className="sprite entree respire" src={spritePath(character.id, character.defaultMood, character.defaultMood)} alt={character.name} onError={(e) => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = "1"; img.src = character.portrait; } }} />
      <figcaption className="plaque-nom"><V2RangLosange stage={info.relation.stage} /><span className="pn-txt"><b>{character.name}</b><small>{character.role} · {STAGE_LABELS[info.relation.stage]}</small></span>{!info.relation.met && <em className="neuf">Nouveau</em>}</figcaption>
      <p className="bulle">{info.place.action}…</p>
    </figure>}
    <aside className="commandes" aria-label="Actions">
      <div className="pres">
        <span className="surtitre">Présences <b>{present.length}</b></span>
        {character && info && <div className="pn-mini" style={{ "--c": character.color } as React.CSSProperties}><V2RangLosange stage={info.relation.stage} /><span className="pn-txt"><b>{character.name}</b><small>{character.role} · {STAGE_LABELS[info.relation.stage]}</small><em>{info.place.action}…</em></span></div>}
        {present.length > 0 ? <div className="pres-liste">{present.map((entry) => <button type="button" key={entry.id} className={`pres-btn ${entry === character ? "on" : ""}`} style={{ "--c": entry.color } as React.CSSProperties} aria-pressed={entry === character} aria-label={entry.name} onClick={() => { sfx("survol"); setSelectedId(entry.id); }}><img src={entry.portrait} alt="" /><span>{entry.name}</span>{!game.relationships[entry.id].met && <i className="point-neuf" />}</button>)}</div>
          : <p className="pres-vide">Le lieu est calme pour l’instant.</p>}
      </div>
      <ul className={`cmd ${expanded ? "deplie" : ""}`}>
        {character && info && <>
          {item({ key: "parler", icon: "❝", label: `${info.action} · ${character.name}`, sub: info.label, onClick: () => onTalk(character.id) }, info.important ? "cmd-important" : "", true)}
          {item({ key: "offrir", icon: "❖", label: "Offrir un présent", onClick: () => onGift(character.id) })}
          {info.hasDatePlanner && item({ key: "rdv", icon: "♡", label: "Proposer un rendez-vous", onClick: () => onDate(character.id) })}
          {item({ key: "fiche", icon: "✦", label: "Fiche de lien", sub: `${STAGE_LABELS[info.relation.stage]} · rang ${info.relation.stage}/5`, onClick: () => onFiche(character.id) })}
        </>}
        {activities.length > 0 && <li className="cmd-sep"><span>Activités</span></li>}
        {activities.map((cmd, index) => item(cmd, index >= 2 ? "cmd-extra" : ""))}
        {activities.length > 2 && <li className="cmd-plus-li"><button type="button" className="cmd-plus" data-act="cmd-plus" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><i>{expanded ? "－" : "＋"}</i><span>{expanded ? "Moins d’activités" : `${activities.length - 2} autre${activities.length > 3 ? "s" : ""} activité${activities.length > 3 ? "s" : ""}`}</span></button></li>}
        <li className="cmd-sep"><span>Temps</span></li>
        <li className="cmd-temps"><ul>
          {item({ key: "attendre", icon: "⧗", label: "Attendre", sub: game.settings.noTimeCost ? "Temps figé (mode développeur)" : `→ ${nextPeriod.label}`, onClick: onWait })}
          {item({ key: "voyager", icon: "⌖", label: "Voyager", sub: "Ouvrir la carte", onClick: onMap })}
        </ul></li>
        {visitors.length > 0 && <li className="cmd-attente">{item({ key: "attendre-qui", icon: "◷", label: "Attendre quelqu’un", sub: `${visitors[0].character.name} · ${waitDurationLabel(game, visitors[0].target)}`, onClick: onWaitFor })}</li>}
      </ul>
    </aside>
  </div>;
}

function v2DeclutterPins(cadreEl: HTMLElement | null) {
  if (!cadreEl) return;
  const pins = [...cadreEl.querySelectorAll<HTMLElement>(".pin")];
  if (!pins.length) return;
  pins.forEach((pin) => pin.classList.remove("nom-cache", "nom-haut", "nom-droite", "nom-gauche"));
  const prio = (pin: HTMLElement) => (pin.classList.contains("sel") ? 0 : pin.classList.contains("ici") ? 1 : pin.classList.contains("voile") ? 4 : pin.classList.contains("mineur") ? 3 : 2);
  const sorted = [...pins].sort((a, b) => prio(a) - prio(b));
  const cadre = cadreEl.getBoundingClientRect();
  const margin = 4;
  const marks = new Map(pins.map((pin) => [pin, (pin.querySelector(".pin-los") || pin).getBoundingClientRect()]));
  const hit = (r: DOMRect, q: DOMRect) => !(r.right + margin < q.left || r.left - margin > q.right || r.bottom + margin < q.top || r.top - margin > q.bottom);
  const taken: DOMRect[] = [];
  for (const pin of sorted) {
    const others = [...marks].filter(([other]) => other !== pin).map(([, rect]) => rect);
    const fits = () => { const r = pin.getBoundingClientRect(); const out = r.left < cadre.left || r.right > cadre.right || r.top < cadre.top || r.bottom > cadre.bottom; return !out && !taken.some((q) => hit(r, q)) && !others.some((q) => hit(r, q)); };
    if (fits()) { taken.push(pin.getBoundingClientRect()); continue; }
    let ok = false;
    for (const variant of ["nom-haut", "nom-droite", "nom-gauche"]) { pin.classList.add(variant); if (fits()) { ok = true; break; } pin.classList.remove(variant); }
    if (ok || prio(pin) === 0) { taken.push(pin.getBoundingClientRect()); continue; }
    pin.classList.add("nom-cache");
    taken.push(marks.get(pin)!);
  }
}

function V2Carte({ game, visible, selectedLocation, selectedSpot, onSelectLocation, onSelectSpot, onTravel, onPlace }: { game: GameState; visible: CharacterData[]; selectedLocation: string; selectedSpot: string; onSelectLocation: (id: string) => void; onSelectSpot: (id: string) => void; onTravel: (location: string, spot: string) => void; onPlace: () => void }) {
  const cadreRef = useRef<HTMLDivElement>(null);
  const [destOpen, setDestOpen] = useState(false);
  const known = LOCATIONS.filter((entry) => locationUnlocked(game, entry.id));
  const location = known.find((entry) => entry.id === selectedLocation) || LOCATIONS.find((entry) => entry.id === game.location) || LOCATIONS[0];
  const spots = spotsForLocation(location.id).filter((entry) => !entry.housing || entry.id === propertyById(game.housing.propertyId)?.spot);
  const spotSel = spots.find((entry) => entry.id === selectedSpot) || (location.id === game.location ? spots.find((entry) => entry.id === game.spot) : undefined) || spotById(DEFAULT_SPOTS[location.id]) || spots[0];
  const presentAt = (locationId: string) => visible.filter((who) => characterPlace(who, game.day, game.period, game.flags, game.housing).location === locationId);
  const presentAtSpot = (spotId: string) => visible.filter((who) => characterPlace(who, game.day, game.period, game.flags, game.housing).spot === spotId);
  const here = game.location === location.id && game.spot === spotSel?.id;
  const travelPeriods = travelPeriodCost(game.location, location.id, game.player.vocation, LOCATIONS);
  useLayoutEffect(() => {
    const run = () => v2DeclutterPins(cadreRef.current);
    const frame = requestAnimationFrame(() => requestAnimationFrame(run));
    window.addEventListener("resize", run);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", run); };
  }, [location.id, game.location, game.period]);
  const visibleLocations = LOCATIONS.filter((entry) => locationUnlocked(game, entry.id) || !entry.minor);
  return <div className="carte">
    <div className="carte-zone">
      <div className="carte-cadre" ref={cadreRef}><Orn4 />
        <img className="carte-img" src="/assets/map.png" alt="Carte de Sylvinia" />
        <div className="brume" aria-hidden="true"><i /><i /><i /></div>
        {visibleLocations.map((entry) => {
          const isKnown = locationUnlocked(game, entry.id);
          const occupants = isKnown ? presentAt(entry.id) : [];
          return <button type="button" key={entry.id} className={`pin ${entry.id === game.location ? "ici" : ""} ${entry.id === location.id ? "sel" : ""} ${isKnown ? "" : "voile"} ${occupants.length ? "" : "mineur"}`} style={{ left: `${entry.pin[0]}%`, top: `${entry.pin[1]}%` }} data-loc={entry.id} disabled={!isKnown} aria-label={isKnown ? `${entry.name}${occupants.length ? ` · ${occupants.map((who) => who.name).join(", ")}` : ""}` : "Lieu inconnu"} onClick={() => { sfx("survol"); onSelectLocation(entry.id); onSelectSpot(entry.id === game.location ? game.spot : DEFAULT_SPOTS[entry.id]); }}>
            <i className="pin-los" />{entry.id === game.location && <span className="pin-vous">Vous</span>}<span className="pin-nom">{isKnown ? entry.name : "???"}</span>
            {occupants.length > 0 && <span className="pin-pres">{occupants.slice(0, 3).map((who) => <img key={who.id} src={who.portrait} alt="" />)}</span>}
          </button>;
        })}
        <div className="rose-vents" aria-hidden="true">✧</div>
      </div>
    </div>
    <aside className="carte-fiche cadre" aria-live="polite"><Orn4 />
      <div className="cf-img" style={{ backgroundImage: `url(${spotSel?.background || location.image})` }}><span className="surtitre">{location.subtitle}</span></div>
      <div className="cf-corps">
        <h2 className="titre-jeu">{location.name}</h2>
        <p className="texte">{location.description}</p>
        <div className="cf-bloc"><span className="surtitre">Présences</span><div className="cf-pres">{presentAt(location.id).length ? presentAt(location.id).map((who) => <Fragment key={who.id}><Seau color={who.color} portrait={who.portrait} /><span>{who.name}</span></Fragment>) : <span className="discret">Personne de connu</span>}</div></div>
        <details className="cf-dest" open={destOpen} onToggle={(event) => setDestOpen((event.currentTarget as HTMLDetailsElement).open)}><summary><span className="surtitre">Destinations connues · {known.length}</span><i aria-hidden="true">▾</i></summary><ul>{known.map((entry) => <li key={entry.id}><button type="button" className={entry.id === location.id ? "sel" : ""} data-dest={entry.id} onClick={() => { onSelectLocation(entry.id); onSelectSpot(entry.id === game.location ? game.spot : DEFAULT_SPOTS[entry.id]); }}>{entry.id === game.location ? <i className="ici">◆</i> : <i>◇</i>}<span>{entry.name}</span>{presentAt(entry.id).length > 0 && <b>{presentAt(entry.id).length} ♡</b>}</button></li>)}</ul></details>
        <div className="cf-bloc"><span className="surtitre">Lieux · {spots.length}</span><ul className="cf-spots">{spots.map((entry) => { const occupants = presentAtSpot(entry.id); const spotJobs = jobsAtSpot(entry.id); return <li key={entry.id}><button type="button" className={`cf-spot ${entry.id === spotSel?.id ? "sel" : ""}`} aria-pressed={entry.id === spotSel?.id} onClick={() => onSelectSpot(entry.id)}><i>{entry.icon}</i><span>{entry.name}{entry.id === game.spot && location.id === game.location && <em> · vous</em>}</span>{occupants.length > 0 && <b title={occupants.map((who) => who.name).join(", ")}>{occupants.length} ♡</b>}{spotJobs.length > 0 && <b className="cf-job" title={spotJobs.map((job) => job.title).join(", ")}>◈{spotJobs.length}</b>}</button></li>; })}</ul></div>
        {spotSel && <p className="cf-spot-desc discret">{spotSel.description}</p>}
      </div>
      {here ? <button type="button" className="btn principal large" data-act="voyager" onClick={onPlace}>Vous êtes ici · revenir au lieu</button>
        : spotSel && <button type="button" className="btn principal large" data-act="voyager" onClick={() => onTravel(location.id, spotSel.id)}>{game.location === location.id ? `Se rendre à ${spotSel.shortName}` : `Voyager · ${travelDurationLabel(travelPeriods)}`}{game.location !== location.id && game.player.vocation === SCOUT_VOCATION ? " · éclaireur" : ""} ▸</button>}
    </aside>
  </div>;
}

function v2KnownGroupDates(game: GameState) {
  const unlocked = CHARACTERS.filter((character) => characterUnlocked(game, character)).map((character) => character.id);
  return GROUP_DATES.filter((date) => !date.legacyOnly
    && (!(HR_DATE_IDS as readonly string[]).includes(date.id) || hrDateVisibility(date, game).visible)
    && contentBranchAllowed(game.flags, date)
    && date.characters.every((id) => unlocked.includes(id)));
}
function v2DateOpen(game: GameState, date: DateScene) {
  const relation = game.relationships[date.character];
  return game.settings.unlockAll || (relation.stage >= date.unlockStage && relation.affection >= date.minAffection && relation.trust >= date.minTrust);
}

function V2SousOnglets({ game, active, onView }: { game: GameState; active: V2LinksView; onView: (view: V2LinksView) => void }) {
  const unlocked = CHARACTERS.filter((character) => characterUnlocked(game, character));
  const dates = DATE_SCENES.filter((date) => unlocked.some((character) => character.id === date.character));
  const groups = v2KnownGroupDates(game);
  const items: [V2LinksView, string, string][] = [["liens", "Personnes", String(unlocked.length)], ["rdv", "Rendez-vous", String(dates.filter((date) => v2DateOpen(game, date)).length)], ["trio", "À trois", `${groups.filter((date) => groupDateUnlocked(game, date)).length}/${groups.length}`]];
  return <nav className="sous-onglets" aria-label="Sections des liens">{items.map(([id, label, count]) => <button type="button" key={id} className={active === id || (active === "fiche" && id === "liens") ? "actif" : ""} aria-current={active === id ? "page" : undefined} onClick={() => onView(id)}><span>{label}</span><b>{count}</b></button>)}</nav>;
}

function V2Liens({ game, onView, onFiche }: { game: GameState; onView: (view: V2LinksView) => void; onFiche: (id: string) => void }) {
  const ordered = CHARACTERS.slice().sort((a, b) => Number(characterUnlocked(game, b)) - Number(characterUnlocked(game, a)) || game.relationships[b.id].stage - game.relationships[a.id].stage);
  return <div className="liens">
    <V2SceneTete surtitre="Constellation des liens" titre="Liens"><V2SousOnglets game={game} active="liens" onView={onView} /></V2SceneTete>
    <div className="galerie">{ordered.map((character, index) => {
      const relation = game.relationships[character.id];
      if (!characterUnlocked(game, character)) return <div className="lien-carte verrou" key={character.id} style={{ "--i": index } as React.CSSProperties}><div className="lc-img lc-inconnu" aria-hidden="true">?</div><div className="lc-bas"><b className="lc-nom">???</b><small>{character.id === "tia" && game.day >= character.unlockDay ? "Accès impérial requis" : `Pas encore rencontré·e`}</small></div></div>;
      return <button type="button" className="lien-carte" key={character.id} data-fiche={character.id} style={{ "--c": character.color, "--i": index } as React.CSSProperties} aria-label={`${character.name}, ${STAGE_LABELS[relation.stage]}`} onClick={() => onFiche(character.id)}>
        <div className="lc-img"><img src={character.portrait} alt="" /></div>
        <V2RangLosange stage={relation.stage} />
        {!relation.met && <em className="neuf">À rencontrer</em>}
        <div className="lc-bas"><b className="lc-nom">{character.name}</b><small>{STAGE_LABELS[relation.stage]}</small>
          <span className="lc-jauges"><i className="aff" style={{ "--v": `${Math.min(100, relation.affection)}%` } as React.CSSProperties} /><i className="conf" style={{ "--v": `${Math.min(100, relation.trust)}%` } as React.CSSProperties} /><i className="des" style={{ "--v": `${Math.min(100, relation.desire)}%` } as React.CSSProperties} /></span></div>
      </button>;
    })}</div>
    <p className="legende"><i className="aff" />Affection <i className="conf" />Confiance <i className="des" />Désir</p>
  </div>;
}

function V2Fiche({ game, characterId, onView, onFiche, onGift, onDate, onLocate, onDossier, onWaitRoute }: { game: GameState; characterId: string; onView: (view: V2LinksView) => void; onFiche: (id: string) => void; onGift: (id: string) => void; onDate: (id: string) => void; onLocate: (location: string, spot: string) => void; onDossier: (id: string) => void; onWaitRoute: (sceneId: string) => void }) {
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const known = CHARACTERS.filter((character) => characterUnlocked(game, character));
  const character = known.find((entry) => entry.id === characterId) || known[0];
  if (!character) return null;
  const relation = game.relationships[character.id];
  const index = known.indexOf(character);
  const prev = known[(index - 1 + known.length) % known.length];
  const next = known[(index + 1) % known.length];
  const schedule = characterPlace(character, game.day, game.period, game.flags, game.housing);
  const scheduleLocation = LOCATIONS.find((entry) => entry.id === schedule.location);
  const scheduleSpot = spotById(schedule.spot);
  const rawNext = sceneFor(character.id, relation.stage);
  const nextScene = rawNext ? relationRouteVariant(rawNext, game).route : undefined;
  const bond = relation.affection + relation.trust;
  const threshold = nextScene ? BOND_THRESHOLDS[nextScene.stage] : 0;
  const needed = nextScene ? Math.max(0, threshold - bond) : 0;
  const objective = nextScene ? routeNarrativeObjective(nextScene, game) : undefined;
  const narrativeReady = Boolean(nextScene && !objective);
  const routeTarget = nextScene && narrativeReady ? nextPresence(character, game, ROUTE_SPOTS[nextScene.id], ROUTE_PERIODS[nextScene.id], nextScene.dayMin) : null;
  const routeSpot = nextScene ? spotById(ROUTE_SPOTS[nextScene.id]) : undefined;
  const routePeriods = nextScene ? ROUTE_PERIODS[nextScene.id]?.map((id) => PERIODS.find((entry) => entry.id === id)?.label).filter(Boolean).join(" ou ") : "";
  const progress = relationshipNarrativeProgress(game, character.id);
  const circ = 2 * Math.PI * 54;
  const tastes = character.giftLikes.map((id) => GIFTS.find((gift) => gift.id === id)).filter((gift): gift is (typeof GIFTS)[number] => Boolean(gift));
  const hasPlanner = DATE_SCENES.some((date) => date.character === character.id) || Boolean(HOME_DATE_PROFILES[character.id]);
  // Glisser horizontalement sur le portrait = personnage voisin (le panneau garde son défilement normal).
  const onTouchStart = (event: React.TouchEvent) => { const t = event.touches[0]; swipeRef.current = (event.target as HTMLElement).closest(".fiche-panneau, .fiche-pas") ? null : { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (event: React.TouchEvent) => { const start = swipeRef.current; swipeRef.current = null; if (!start || known.length < 2) return; const t = event.changedTouches[0]; const dx = t.clientX - start.x; if (Math.abs(dx) > 60 && Math.abs(t.clientY - start.y) < 50) { sfx("survol"); onFiche((dx < 0 ? next : prev).id); } };
  return <div className="fiche" style={{ "--c": character.color } as React.CSSProperties} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div className="fiche-filigrane" aria-hidden="true">{character.name}</div>
    <V2PortraitFiche character={character} />
    <section className="fiche-panneau cadre"><Orn4 />
      <button type="button" className="retour-lien" onClick={() => { sfx("retour"); onView("liens"); }}><Kbd>Échap</Kbd> Liens</button>
      <span className="surtitre">{character.role}</span>
      <h1 className="titre-jeu geant">{character.name}</h1>
      <div className="rang-bloc">
        <svg className="anneau" viewBox="0 0 128 128" aria-hidden="true"><circle cx="64" cy="64" r="54" className="a-fond" /><circle cx="64" cy="64" r="54" className="a-val" style={{ "--circ": circ, "--off": circ * (1 - relation.stage / 5) } as React.CSSProperties} />{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={64 + 54 * Math.sin(((k + 1) / 5) * 2 * Math.PI)} cy={64 - 54 * Math.cos(((k + 1) / 5) * 2 * Math.PI)} r="4" className={`a-cran ${k < relation.stage ? "on" : ""}`} />)}<text x="64" y="76" textAnchor="middle" className="a-num">{ROMAINS[relation.stage]}</text></svg>
        <div className="rang-txt"><small>Rang de lien</small><b>{STAGE_LABELS[relation.stage]}</b><span className="coeurs">{[1, 2, 3, 4, 5].map((k) => <i key={k} className={k <= relation.stage ? "on" : ""}>♥</i>)}</span></div>
      </div>
      <div className="stats"><V2Stat cls="aff" label="Affection" value={relation.affection} /><V2Stat cls="conf" label="Confiance" value={relation.trust} /><V2Stat cls="des" label="Désir" value={relation.desire} /></div>
      {nextScene ? <div className="prochain"><span className="surtitre">Prochaine scène · {nextScene.title}</span><ul>
        <li className={needed ? "" : "ok"}>Lien {bond} / {threshold}{needed ? ` · encore ${needed}` : ""}</li>
        {game.day < nextScene.dayMin ? <li>À partir du jour {nextScene.dayMin}</li> : <li className="ok">Jour atteint</li>}
        {objective ? <li>{objective}</li> : <li className={routeSpot && schedule.spot === routeSpot.id ? "ok" : ""}>{routeSpot?.name || "Lieu indiqué"}{routePeriods ? ` · ${routePeriods}` : ""}</li>}
      </ul></div> : <div className="prochain max"><span className="surtitre">Fil narratif accompli</span><p>Les {progress.total} scènes de lien sont vécues. Les moments libres et rendez-vous restent disponibles.</p></div>}
      <blockquote className="citation">{character.tagline}</blockquote>
      <div className="fiche-infos">
        <div><span className="surtitre">Présence actuelle</span><p className="texte">{schedule.traveling ? `Escale · ${scheduleSpot?.name || ""}` : `${scheduleLocation?.name || ""} · ${scheduleSpot?.shortName || ""}`} — {schedule.action}</p></div>
        <div><span className="surtitre">Présents favoris</span><p className="gouts">{tastes.map((gift) => <span key={gift.id} title={gift.name}><i>{gift.icon}</i>{gift.name.split(" ")[0]}</span>)}</p></div>
      </div>
      <div className="fiche-actions">
        <button type="button" className="btn" data-act="offrir" onClick={() => onGift(character.id)}>❖ Offrir</button>
        {hasPlanner && <button type="button" className="btn" data-act="rdv" onClick={() => onDate(character.id)}>♡ Rendez-vous</button>}
        <button type="button" className="btn" data-act="localiser" onClick={() => onLocate(schedule.location, schedule.spot)}>⌖ Localiser</button>
        <button type="button" className="btn" data-act="dossier" onClick={() => onDossier(character.id)}>▤ Dossier complet</button>
        {nextScene && narrativeReady && !needed && routeTarget && <button type="button" className="btn principal" data-act="attendre-route" onClick={() => onWaitRoute(nextScene.id)}>⧗ Attendre · {waitDurationLabel(game, routeTarget)}</button>}
      </div>
    </section>
    {known.length > 1 && <nav className="fiche-pas" aria-label="Changer de personnage">
      <button type="button" aria-label={`Précédent : ${prev.name}`} title={prev.name} onClick={() => { sfx("survol"); onFiche(prev.id); }}>‹</button>
      <span aria-live="polite">{index + 1}<i>/</i>{known.length}</span>
      <button type="button" aria-label={`Suivant : ${next.name}`} title={next.name} onClick={() => { sfx("survol"); onFiche(next.id); }}>›</button>
    </nav>}
  </div>;
}

function V2Rdv({ game, onView, onDate, onHome }: { game: GameState; onView: (view: V2LinksView) => void; onDate: (date: DateScene) => void; onHome: (characterId: string) => void }) {
  const unlocked = CHARACTERS.filter((character) => characterUnlocked(game, character));
  const list = DATE_SCENES.filter((date) => unlocked.some((character) => character.id === date.character)).sort((a, b) => Number(v2DateOpen(game, b)) - Number(v2DateOpen(game, a)));
  const homes = unlocked.filter((character) => HOME_DATE_PROFILES[character.id]);
  const home = propertyById(game.housing.propertyId);
  return <div className="rdv">
    <V2SceneTete surtitre="Constellation des liens" titre="Rendez-vous"><V2SousOnglets game={game} active="rdv" onView={onView} /></V2SceneTete>
    <div className="rdv-grille">
      {list.map((date, index) => {
        const character = CHARACTERS.find((entry) => entry.id === date.character)!;
        const open = v2DateOpen(game, date);
        const spot = spotById(date.spot);
        const period = PERIODS.find((entry) => entry.id === date.period);
        const done = game.dateHistory.includes(date.id);
        return <button type="button" key={date.id} className={`rdv-carte ${open ? "" : "verrou"}`} data-date={date.id} style={{ "--c": character.color, "--i": index } as React.CSSProperties} onClick={() => onDate(date)}>
          <span className="rc-img" style={{ backgroundImage: `url(${spot?.background || ""})` }} />
          <Seau color={character.color} portrait={character.portrait} className="grand" />
          <span className="rc-txt"><small>{character.name} · {date.type}</small><b>{date.title}</b><span className="rc-meta">{period ? `${period.icon} ${period.label}` : ""} · {spot?.shortName || spot?.name || ""}</span></span>
          <span className="rc-etat">{open ? done ? "Déjà vécu · rejouable" : "Disponible" : `🔒 Rang ${ROMAINS[date.unlockStage]}`}</span>
        </button>;
      })}
      {homes.map((character, index) => {
        const open = homeDateUnlocked(game, character.id);
        return <button type="button" key={`home-${character.id}`} className={`rdv-carte logis ${open ? "" : "verrou"}`} data-home={character.id} style={{ "--c": character.color, "--i": list.length + index } as React.CSSProperties} onClick={() => onHome(character.id)}>
          <span className="rc-img" style={{ backgroundImage: `url(${home?.background || "/assets/backgrounds/terrace.webp"})` }} />
          <Seau color={character.color} portrait={character.portrait} className="grand" />
          <span className="rc-txt"><small>{character.name} · Visite au logis</small><b>{home ? home.name : "Logis requis"}</b><span className="rc-meta">⌂ {home ? "Votre adresse" : "Achetez un logis dans Biens"}</span></span>
          <span className="rc-etat">{open ? "Disponible" : home ? "🔒 Lien plus avancé" : "🔒 Logis requis"}</span>
        </button>;
      })}
      {!list.length && !homes.length && <p className="discret">Aucun rendez-vous connu pour l’instant : rencontrez d’abord les habitants de Sylvinia.</p>}
    </div>
  </div>;
}

function V2Trio({ game, onView, onStart }: { game: GameState; onView: (view: V2LinksView) => void; onStart: (id: string) => void }) {
  const list = v2KnownGroupDates(game);
  const [selectedId, setSelectedId] = useState(list[0]?.id);
  const selected = list.find((entry) => entry.id === selectedId) || list[0];
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => { listRef.current?.querySelector(".trio-entree.sel")?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [selectedId]);
  if (!selected) return <div className="trio">
    <V2SceneTete surtitre="Relations croisées" titre="À trois"><V2SousOnglets game={game} active="trio" onView={onView} /></V2SceneTete>
    <div className="trio-vide cadre"><Orn4 /><p className="texte grand">Aucune dynamique à trois n’est encore connue.</p><p className="discret">Elles apparaissent lorsque vous avez rencontré les deux personnes concernées et que l’histoire les rend possibles.</p></div>
  </div>;
  const open = groupDateUnlocked(game, selected);
  const reason = (HR_DATE_IDS as readonly string[]).includes(selected.id) ? hrDateReason(selected, game) : undefined;
  const homeMissing = Boolean(selected.home && !game.housing.propertyId);
  const spot = spotById(selected.spot);
  const period = PERIODS.find((entry) => entry.id === selected.period);
  const slot = (id: string) => {
    const character = CHARACTERS.find((entry) => entry.id === id)!;
    const relation = game.relationships[id];
    const conditions: [string, number, number, string?][] = [["Rang", relation.stage, selected.minStage, `${ROMAINS[relation.stage]} / ${ROMAINS[selected.minStage]}`], ["Affection", relation.affection, selected.minAffection], ["Confiance", relation.trust, selected.minTrust], ["Désir", relation.desire, selected.minDesire]];
    return <div className="slot" key={id} style={{ "--c": character.color } as React.CSSProperties}><div className="halo" /><img className="slot-sprite entree" src={spritePath(character.id, character.defaultMood, character.defaultMood)} alt={character.name} onError={(e) => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = "1"; img.src = character.portrait; } }} /><div className="slot-plaque"><b>{character.name}</b><small>{STAGE_LABELS[relation.stage]}</small><ul>{conditions.map(([name, value, min, text]) => <li key={name} className={game.settings.unlockAll || value >= min ? "ok" : "ko"}><span>{name}</span><b>{text || `${value} / ${min}`}</b></li>)}</ul></div></div>;
  };
  return <div className="trio">
    <V2SceneTete surtitre="Relations croisées" titre="À trois"><V2SousOnglets game={game} active="trio" onView={onView} /></V2SceneTete>
    <div className="trio-corps">
      <ul className="trio-liste" aria-label="Rendez-vous à trois" ref={listRef}>{list.map((entry) => { const entryOpen = groupDateUnlocked(game, entry); return <li key={entry.id}><button type="button" className={`trio-entree ${entry.id === selected.id ? "sel" : ""} ${entryOpen ? "ouvert" : ""}`} aria-pressed={entry.id === selected.id} data-trio={entry.id} onClick={() => { sfx("survol"); setSelectedId(entry.id); }}><span className="te-duo">{entry.characters.map((id) => { const who = CHARACTERS.find((c) => c.id === id)!; return <Seau key={id} color={who.color} portrait={who.portrait} />; })}</span><span className="te-txt"><b>{entry.title}</b><small>{entry.characters.map((id) => CHARACTERS.find((c) => c.id === id)?.name).join(" · ")}</small></span><span className="te-etat">{entryOpen ? "✦" : "🔒"}</span></button></li>; })}</ul>
      <section className="trio-scene">
        <div className="equipe">
          <div className="slot vous"><div className="slot-vous-ico">✦</div><div className="slot-plaque"><b>{game.player.name}</b><small>Vous</small><ul><li className={homeMissing ? "ko" : "ok"}><span>Logis</span><b>{selected.home ? homeMissing ? "Requis ✗" : "Requis ✓" : "—"}</b></li></ul></div></div>
          {selected.characters.map(slot)}
        </div>
        <div className="trio-info cadre"><Orn4 />
          <span className="surtitre">{period ? `${period.icon} ${period.label}` : ""} · {selected.home ? "Votre logis" : spot?.name || ""}</span>
          <h2 className="titre-jeu">{selected.title}</h2>
          <p className="texte">{selected.description}</p>
          {selected.dynamic && <blockquote className="citation petite">{selected.dynamic}</blockquote>}
          <div className="ti-pied">{open && !homeMissing ? <span className="etat ok">✦ Toutes les conditions sont réunies · le rendez-vous aura lieu le lendemain</span> : <span className="etat ko">🔒 {reason || (homeMissing ? "Un logis est nécessaire" : "Conditions manquantes en rouge")}</span>}<button type="button" className="btn principal" data-act="lancer" disabled={!open || homeMissing} onClick={() => onStart(selected.id)}>{game.groupDateHistory.includes(selected.id) ? "Revivre ▸" : "Planifier ▸"}</button></div>
        </div>
      </section>
    </div>
  </div>;
}

type V2JournalTab = "chronique" | "courrier" | "decouvertes" | "relations" | "souvenirs" | "croisees";
type V2JournalProps = {
  game: GameState;
  onStartCampaign: (id: string) => void;
  onReadLetter: (id: string) => void;
  onReadCrossLetter: (id: string) => void;
  onInvitation: (id: string) => void;
  onLocateSpot: (spotId: string) => void;
  legacy: (section: "crossed" | "relations" | "memories") => React.ReactNode;
};

function V2Journal({ game, onStartCampaign, onReadLetter, onReadCrossLetter, onInvitation, onLocateSpot, legacy }: V2JournalProps) {
  const [tab, setTab] = useState<V2JournalTab>("chronique");
  const discovered = new Set([...game.history, ...game.flags, ...game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  const progress = storyProgress(game.history, game.flags);
  const storyComplete = progress >= MAIN_STORY.length;
  const [actIndex, setActIndex] = useState(Math.min(progress, MAIN_STORY.length - 1));
  const crossProgress = game.crossQuestSeries.linevaAllenna;
  const hrProgress = game.crossQuestSeries[HR_KEY];
  const letters = game.letters.map((received) => ({ received, letter: LETTERS.find((entry) => entry.id === received.id) })).filter((entry): entry is { received: ReceivedLetter; letter: LetterTemplate } => Boolean(entry.letter));
  const crossLetters = (crossProgress?.letters || []).map((received) => ({ received, letter: LINEVA_ALLENNA_LETTERS.find((entry) => entry.id === received.id) })).filter((entry): entry is { received: NonNullable<typeof crossProgress>["letters"][number]; letter: CrossLetter } => Boolean(entry.letter));
  const invitations = game.invitations.map((received) => ({ received, invitation: INVITATIONS.find((entry) => entry.id === received.id) })).filter((entry): entry is { received: ReceivedInvitation; invitation: InvitationTemplate } => Boolean(entry.invitation));
  const rumors = game.rumors.map((heard) => ({ heard, rumor: RUMORS.find((entry) => entry.id === heard.id) })).filter((entry): entry is { heard: { id: string; heardDay: number }; rumor: RumorTemplate } => Boolean(entry.rumor));
  const knowledge = game.knowledge.map((id) => ALL_KNOWLEDGE_ENTRIES.find((entry) => entry.id === id)).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const pending = letters.filter(({ received }) => !received.read).length + crossLetters.filter(({ received }) => !received.read).length + invitations.filter(({ received }) => received.status === "pending").length;
  type Mail = { key: string; kind: "letter" | "cross" | "invitation"; id: string; subject: string; character?: CharacterData; day: number; unread: boolean; status: string; body?: string[]; signature?: string };
  const mails: Mail[] = [
    ...crossLetters.map(({ received, letter }) => ({ key: `c-${letter.id}`, kind: "cross" as const, id: letter.id, subject: letter.subject, character: CHARACTERS.find((entry) => entry.id === letter.character), day: received.receivedDay, unread: !received.read, status: !received.read ? "Nouveau · Quête croisée" : received.replyId ? "Répondu" : `Jour ${received.receivedDay}`, body: (letter as { body?: string[] }).body, signature: (letter as { signature?: string }).signature })),
    ...letters.map(({ received, letter }) => ({ key: `l-${letter.id}`, kind: "letter" as const, id: letter.id, subject: letter.subject, character: CHARACTERS.find((entry) => entry.id === letter.character), day: received.receivedDay, unread: !received.read, status: !received.read ? "Nouveau" : received.replyId ? "Répondu" : `Jour ${received.receivedDay}`, body: letter.body, signature: letter.signature })),
    ...invitations.map(({ received, invitation }) => ({ key: `i-${invitation.id}`, kind: "invitation" as const, id: invitation.id, subject: invitation.title, character: CHARACTERS.find((entry) => entry.id === invitation.character), day: received.receivedDay ?? 0, unread: received.status === "pending", status: received.status === "pending" ? `Invitation · expire J${received.expiresDay}` : received.status === "accepted" ? "Honorée" : received.status === "declined" ? "Refusée" : "Manquée · reviendra" })),
  ].sort((a, b) => b.day - a.day);
  const [mailKey, setMailKey] = useState<string | undefined>(undefined);
  const mail = mails.find((entry) => entry.key === mailKey);
  const openMail = (entry: Mail) => {
    setMailKey(entry.key);
    if (entry.kind === "letter") onReadLetter(entry.id);
    else if (entry.kind === "cross") onReadCrossLetter(entry.id);
    else onInvitation(entry.id);
  };
  const tabs: [V2JournalTab, string, string, number?][] = [
    ["chronique", "Chronique", "▤"],
    ["courrier", "Courrier", "✉", pending],
    ["decouvertes", "Découvertes", "◌"],
    ["relations", "Relations", "♡"],
    ["souvenirs", "Souvenirs", "◇"],
    ...(crossProgress || hrProgress ? [["croisees", "Croisées", "⇄"] as [V2JournalTab, string, string]] : []),
  ];
  let gauche: React.ReactNode = null;
  let droite: React.ReactNode = null;
  let leftTitle = "";
  if (tab === "chronique") {
    leftTitle = "Chapitres de l’Acte I";
    const act = MAIN_STORY[actIndex];
    const done = actIndex < progress;
    const current = !storyComplete && actIndex === progress;
    const options = current ? act.requiredScenes.filter((id) => !discovered.has(id)).map((id) => campaignSceneById(id)).filter((scene): scene is CampaignScene => Boolean(scene)) : [];
    const ready = options.filter((scene) => campaignSceneReady(scene, game));
    const blocked = options.find((scene) => !campaignSceneReady(scene, game));
    const nextId = current ? act.requiredScenes.find((id) => !discovered.has(id)) : undefined;
    const nextMilestone = nextId ? storyMilestone(nextId) : undefined;
    const nextCampaign = nextId ? campaignSceneById(nextId) : undefined;
    const illustration = (nextCampaign && spotById(nextCampaign.spot)?.background) || (act.requiredScenes[0] && campaignSceneById(act.requiredScenes[0]) && spotById(campaignSceneById(act.requiredScenes[0])!.spot)?.background) || "/assets/backgrounds/deep_archives.webp";
    gauche = <ol className="j-liste">{MAIN_STORY.map((entry, index) => { const state = index < progress ? "fait" : !storyComplete && index === progress ? "encours" : "voile"; return <li key={entry.id}><button type="button" className={`j-entree ${state} ${index === actIndex ? "sel" : ""}`} data-chap={index} disabled={state === "voile"} onClick={() => setActIndex(index)}><span className="j-num">{entry.number}</span><span><b>{state === "voile" ? "Chapitre scellé" : entry.title}</b><small>{state === "fait" ? "Accompli" : state === "encours" ? "En cours" : "Pas encore révélé"}</small></span></button></li>; })}</ol>;
    droite = <>
      <span className="surtitre">Acte I · Chapitre {act.number}</span><h2 className="titre-jeu">{act.title}</h2>
      <div className="j-illu" style={{ backgroundImage: `url(${illustration})` }} />
      <div className="objectif"><span className="surtitre">Objectif</span><p>{act.objective}</p></div>
      <p className="texte">{act.detail}</p>
      <ul className="j-jalons">{act.requiredScenes.length ? act.requiredScenes.map((id) => { const milestone = storyMilestone(id); const achieved = discovered.has(id); return <li key={id} className={achieved ? "ok" : ""}><i>{achieved ? "✓" : "◇"}</i><span><b>{milestone.title}</b><small>{milestone.place}</small></span></li>; }) : <li className="ok"><i>✓</i><span><b>Passage dans cette chronologie</b><small>Le prologue ouvre automatiquement ce premier chapitre.</small></span></li>}</ul>
      {current && <div className="prochaine"><span className="surtitre">{ready.length > 1 ? "Pistes disponibles" : "Prochaine étape"}</span>
        <p>{ready.length ? `${ready.length} scène${ready.length > 1 ? "s" : ""} de campagne peu${ready.length > 1 ? "vent" : "t"} être vécue${ready.length > 1 ? "s" : ""} maintenant.` : blocked ? campaignBlockingObjective(blocked, game) || nextMilestone?.place : nextMilestone ? `${nextMilestone.title} · ${nextMilestone.place}` : "Explorez les pistes déjà découvertes."}</p>
        <div className="j-actions">{ready.map((scene) => <button type="button" key={scene.id} className="btn principal" onClick={() => onStartCampaign(scene.id)}>✦ {scene.title} · {spotById(scene.spot)?.shortName}</button>)}{!ready.length && nextCampaign && <button type="button" className="btn" onClick={() => onLocateSpot(nextCampaign.spot)}>⌖ Montrer sur la carte</button>}</div>
      </div>}
      {done && <p className="tampon">Accompli</p>}
      {storyComplete && actIndex === MAIN_STORY.length - 1 && <p className="texte">Le véritable portail est ouvert et les négociations sont rompues. Le bac à sable reste disponible ; la suite commencera avec l’Acte II.</p>}
      {game.journal.length > 0 && <div className="j-traces"><span className="surtitre">Dernières traces</span><ul>{game.journal.slice(-6).reverse().map((entry, index) => <li key={`${entry}-${index}`}>✦ {entry}</li>)}</ul></div>}
    </>;
  } else if (tab === "courrier") {
    leftTitle = "Correspondance";
    gauche = mails.length ? <ul className="j-liste">{mails.map((entry) => <li key={entry.key}><button type="button" className={`j-entree lettre ${entry.key === mailKey ? "sel" : ""} ${entry.unread ? "neuve" : ""}`} data-lettre={entry.id} onClick={() => openMail(entry)}>{entry.character ? <Seau color={entry.character.color} portrait={entry.character.portrait} /> : <span className="j-num">✉</span>}<span><b>{entry.subject}</b><small>{entry.character?.name || ""} · {entry.status}</small></span>{entry.unread && <i className="point-neuf" />}</button></li>)}</ul> : <p className="discret">Aucune lettre ni invitation reçue pour l’instant. Les personnages écrivent à mesure que vos liens grandissent.</p>;
    droite = mail && mail.character ? <article className="missive"><header><Seau color={mail.character.color} portrait={mail.character.portrait} className="grand" /><div><span className="surtitre">{mail.kind === "invitation" ? "Invitation" : `Jour ${mail.day}`} · de {mail.character.name}</span><h2 className="titre-jeu">{mail.subject}</h2></div></header>
      {mail.body?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{mail.signature && <p className="signature">{mail.signature}</p>}
      <span className="cachet" aria-hidden="true" style={{ "--c": mail.character.color } as React.CSSProperties}>{mail.character.name[0]}</span>
      <div className="reponses"><button type="button" className="reponse" onClick={() => openMail(mail)}><i>✉</i>{mail.kind === "invitation" ? "Ouvrir l’invitation (accepter / décliner)" : "Rouvrir la lettre et ses réponses"}</button></div>
    </article> : <div className="j-vide"><span className="surtitre">Le monde vous écrit</span><h2 className="titre-jeu">{pending ? `${pending} message${pending > 1 ? "s" : ""} en attente` : "Courrier à jour"}</h2><p className="texte">Choisissez une lettre ou une invitation à gauche : elle s’ouvre avec ses réponses possibles. Une invitation manquée reviendra plus tard, sans sanction.</p></div>;
  } else if (tab === "decouvertes") {
    leftTitle = "Rumeurs & savoirs";
    gauche = <ul className="j-liste">{rumors.length + knowledge.length ? <>{[...knowledge].reverse().map((entry) => <li key={`k-${entry.id}`}><span className="j-entree"><span className="j-num">◇</span><span><b>{entry.title}</b><small>Recoupé · {entry.people.map((id) => CHARACTERS.find((character) => character.id === id)?.name).filter(Boolean).join(" · ")}</small></span></span></li>)}{[...rumors].reverse().map(({ heard, rumor }) => <li key={`r-${rumor.id}`}><span className="j-entree"><span className="j-num">◌</span><span><b>{rumor.source}</b><small>Jour {heard.heardDay}</small></span></span></li>)}</> : <li className="discret">Rien de consigné pour l’instant.</li>}</ul>;
    droite = <><span className="surtitre">Échos et connaissances</span><h2 className="titre-jeu">Ce qui se murmure</h2>
      {knowledge.length > 0 && <div className="j-savoirs">{[...knowledge].reverse().map((entry) => <div key={entry.id} className="objectif"><span className="surtitre">{entry.title}</span><p>{entry.summary}</p></div>)}</div>}
      {[...rumors].reverse().map(({ heard, rumor }) => <blockquote className="citation" key={rumor.id}>« {rumor.text} »<cite>{rumor.source} · Jour {heard.heardDay}</cite></blockquote>)}
      {!rumors.length && !knowledge.length && <p className="texte">Écoutez les rumeurs des lieux (bouton « Rumeur » dans la scène Lieu) et gagnez la confiance des personnages pour remplir ces pages.</p>}
      <p className="discret">Le Journal distingue les paroles entendues des informations réellement recoupées.</p></>;
  }
  const legacySection = tab === "relations" ? "relations" : tab === "souvenirs" ? "memories" : tab === "croisees" ? "crossed" : undefined;
  return <div className="journal">
    <div className={`grimoire ${legacySection ? "grimoire-plein" : ""}`}>
      <nav className="signets" aria-label="Sections du journal">{tabs.map(([id, label, icon, count]) => <button type="button" key={id} className={`signet ${tab === id ? "actif" : ""}`} data-jtab={id} aria-pressed={tab === id} onClick={() => { sfx("onglet"); setTab(id); }}><i>{icon}</i><span>{label}</span>{count ? <b className="pastille">{count}</b> : null}</button>)}</nav>
      {legacySection ? <section className="page pleine v2-legacy">{legacy(legacySection)}</section> : <>
        <section className="page gauche"><span className="surtitre">{leftTitle}</span>{gauche}</section>
        <div className="reliure" aria-hidden="true" />
        <section className="page droite">{droite}</section>
      </>}
      <Orn4 />
    </div>
  </div>;
}

function V2Jobs({ game, onJob }: { game: GameState; onJob: (job: JobData) => void }) {
  const [filter, setFilter] = useState<"ici" | "accessibles" | "tous">("tous");
  const known = JOBS.filter((job) => { const location = spotById(job.spot)?.location; return Boolean(location && locationUnlocked(game, location)); });
  const here = known.filter((job) => spotById(job.spot)?.location === game.location);
  const accessible = known.filter((job) => jobAccess(game, job).unlocked);
  const list = (filter === "ici" ? here : filter === "accessibles" ? accessible : known).slice().sort((a, b) => {
    const local = (job: JobData) => (job.spot === game.spot ? 0 : spotById(job.spot)?.location === game.location ? 1 : 2);
    return local(a) - local(b) || Number(!jobAccess(game, a).unlocked) - Number(!jobAccess(game, b).unlocked) || a.title.localeCompare(b.title, "fr");
  });
  return <div className="jobs">
    <V2SceneTete surtitre="Contrats & petits boulots" titre="Tableau des jobs"><div className="filtres">
      <button type="button" className={`filtre ${filter === "tous" ? "actif" : ""}`} data-jf="tous" onClick={() => setFilter("tous")}>Connus <b>{known.length}</b></button>
      <button type="button" className={`filtre ${filter === "accessibles" ? "actif" : ""}`} data-jf="accessibles" onClick={() => setFilter("accessibles")}>Accessibles <b>{accessible.length}</b></button>
      <button type="button" className={`filtre ${filter === "ici" ? "actif" : ""}`} data-jf="ici" onClick={() => setFilter("ici")}>Ici <b>{here.length}</b></button>
      <span className="hud-bourse"><i>◈</i><b>{game.coins}</b></span>
    </div></V2SceneTete>
    {list.length ? <div className="tableau">{list.map((job, index) => {
      const spot = spotById(job.spot);
      const location = LOCATIONS.find((entry) => entry.id === spot?.location);
      const access = jobAccess(game, job);
      const isHere = job.spot === game.spot;
      return <button type="button" key={job.id} className={`affiche ${isHere ? "ici" : ""} ${access.unlocked ? "" : "verrou"}`} data-job={job.id} style={{ "--i": index, "--r": `${((index * 37) % 5) - 2}deg` } as React.CSSProperties} onClick={() => onJob(job)}>
        <span className="punaise" aria-hidden="true" />
        <span className="af-type"><i>{V2_JOB_ICONS[job.kind] || "◈"}</i>{JOB_KIND_LABELS[job.kind]}</span>
        <b className="af-titre">{job.title}</b>
        <span className="af-emp">{job.employer}</span>
        <span className="af-lieu">⌖ {location?.name || ""} · {spot?.shortName || ""}{isHere && <em>Ici</em>}</span>
        <span className="af-pied"><span className="af-diff">{access.unlocked ? `Session · ${jobSessionLabel(job, game.jobRuns[job.id] || 0)}` : `🔒 ${access.characterName} ${access.value}/${access.target}`}</span><span className="af-gain">+{job.reward} <i>◈</i></span></span>
      </button>;
    })}</div> : <p className="discret">Aucun contrat dans ce filtre pour l’instant.</p>}
  </div>;
}

type V2BiensProps = {
  game: GameState;
  present: CharacterData[];
  onShop: () => void;
  onGive: (character: string, gift: string) => void;
  onHousing: () => void;
  onSell: () => void;
  onDisplaySlot: (slot: number) => void;
  onResidents: () => void;
};

function V2Biens({ game, present, onShop, onGive, onHousing, onSell, onDisplaySlot, onResidents }: V2BiensProps) {
  const [tab, setTab] = useState<"inventaire" | "logis">("inventaire");
  const owned = DISPLAY_ITEMS.filter((item) => (game.inventory[item.id] || 0) > 0);
  const [selectedId, setSelectedId] = useState<string | undefined>(owned[0]?.id);
  const selected = owned.find((item) => item.id === selectedId) || owned[0];
  const property = propertyById(game.housing.propertyId);
  const priceOf = (id: string) => GIFTS.find((gift) => gift.id === id)?.price;
  const rarity = (id: string) => { const price = priceOf(id); return price === undefined ? "rare" : v2Rarity(price); };
  const total = owned.reduce((sum, item) => sum + (game.inventory[item.id] || 0), 0);
  const cells = [...owned, ...Array.from({ length: Math.max(0, 24 - owned.length) }, () => null)];
  let body: React.ReactNode;
  if (tab === "inventaire") {
    const isGift = selected ? GIFTS.some((gift) => gift.id === selected.id) : false;
    const likedBy = selected ? CHARACTERS.filter((character) => characterUnlocked(game, character) && character.giftLikes.includes(selected.id)) : [];
    const price = selected ? priceOf(selected.id) : undefined;
    body = <div className="inventaire">
      <div className="cases cadre"><Orn4 />{cells.map((item, index) => item ? <button type="button" key={item.id} className={`case ${item.id === selected?.id ? "sel" : ""} rar-${rarity(item.id)}`} data-bien={item.id} aria-label={`${item.name}, ${game.inventory[item.id]}`} onClick={() => setSelectedId(item.id)}><i>{item.icon}</i><b>{game.inventory[item.id]}</b></button> : <span key={`vide-${index}`} className="case vide" aria-hidden="true" />)}</div>
      <aside className="objet-detail cadre"><Orn4 />
        {selected ? <>
          <div className={`od-ico rar-${rarity(selected.id)}`}><i>{selected.icon}</i></div>
          <span className="surtitre">{price !== undefined ? `${v2RarityLabel(price)} · Présent` : selected.source === "story" ? "Souvenir personnel" : selected.source === "date" ? "Cadeau de visite" : "Objet"}</span>
          <h2 className="titre-jeu">{selected.name}</h2>
          <p className="texte">{selected.description}</p>
          <div className="cf-bloc"><span className="surtitre">Apprécié par</span><div className="cf-pres">{likedBy.length ? likedBy.map((who) => <Fragment key={who.id}><Seau color={who.color} portrait={who.portrait} /><span>{who.name}</span></Fragment>) : <span className="discret">Personne de connu pour l’instant</span>}</div></div>
          {isGift && <div className="cf-bloc"><span className="surtitre">Offrir ici</span><div className="od-dons">{present.length ? present.map((who) => <button type="button" key={who.id} className="btn petit" onClick={() => onGive(who.id, selected.id)}>❖ {who.name}</button>) : <span className="discret">Personne n’est avec vous dans ce sous-lieu.</span>}</div></div>}
          <div className="od-pied">{price !== undefined && <span>Valeur <b>{price} ◈</b></span>}<span>Possédé <b>×{game.inventory[selected.id] || 0}</b></span></div>
        </> : <><h2 className="titre-jeu">Inventaire vide</h2><p className="texte">Les marchés, histoires personnelles et visites au logis y ajouteront des objets.</p></>}
        <button type="button" className="btn principal large" data-act="marche" onClick={onShop}>◈ Ouvrir le marché</button>
      </aside>
    </div>;
  } else {
    const residents = game.housing.residents.map((id) => CHARACTERS.find((entry) => entry.id === id)).filter((entry): entry is CharacterData => Boolean(entry));
    body = property ? <div className="logis">
      <div className="logis-vue cadre" style={{ backgroundImage: `url(${property.background})` }}><Orn4 /><div className="lv-txt"><span className="surtitre">{property.category} · Gamme {ROMAINS[property.tier] || property.tier} · {LOCATIONS.find((entry) => entry.id === property.location)?.name}</span><h2 className="titre-jeu">{property.name}</h2><p>{property.description}</p></div></div>
      <aside className="logis-cote">
        <div className="cadre bloc"><Orn4 /><span className="surtitre">Résidents · {residents.length}</span><div className="cf-pres">{residents.map((who) => <Fragment key={who.id}><Seau color={who.color} portrait={who.portrait} /><span>{who.name}</span></Fragment>)}<button type="button" className="sceau ajout" data-act="inviter" aria-label="Gérer les résidents" onClick={onResidents}>+</button></div></div>
        <div className="cadre bloc"><Orn4 /><span className="surtitre">Vitrine · 3 emplacements</span><div className="vitrine">{[0, 1, 2].map((slot) => { const item = displayItemById(game.housing.displayed[slot] || undefined); return <button type="button" key={slot} className={`case ${item ? `rar-${rarity(item.id)}` : "vide"}`} data-act="vitrine" aria-label={item ? item.name : "Emplacement libre"} title={item ? item.name : "Choisir un objet à exposer"} onClick={() => onDisplaySlot(slot)}>{item ? <i>{item.icon}</i> : "+"}</button>; })}</div></div>
        <button type="button" className="btn large" data-act="demenager" onClick={onHousing}>⌂ Changer de logis</button>
        <button type="button" className="btn large danger" data-act="vendre" onClick={onSell}>Vendre · {housingSaleValue(game.housing)} ◈</button>
      </aside>
    </div> : <div className="logis"><div className="logis-vue cadre logis-aucun"><Orn4 /><div className="lv-txt"><span className="surtitre">Aucune adresse</span><h2 className="titre-jeu">Vous n’avez pas encore de logis</h2><p>Achetez une propriété dans une ville accessible. Vous pourrez ensuite l’habiter, l’exposer sur la carte et y inviter vos proches.</p></div></div><aside className="logis-cote"><button type="button" className="btn principal large" data-act="demenager" onClick={onHousing}>⌂ Acheter un logis</button></aside></div>;
  }
  return <div className="biens">
    <V2SceneTete surtitre="Possessions" titre="Biens"><nav className="sous-onglets">{([["inventaire", "Inventaire", total], ["logis", "Logis", property ? 1 : 0]] as const).map(([id, label, count]) => <button type="button" key={id} className={tab === id ? "actif" : ""} data-btab={id} onClick={() => setTab(id)}><span>{label}</span><b>{count}</b></button>)}<span className="hud-bourse"><i>◈</i><b>{game.coins}</b></span></nav></V2SceneTete>
    {body}
  </div>;
}

function V2Codex({ game }: { game: GameState }) {
  const [tab, setTab] = useState<"personnages" | "figures" | "lieux" | "scenes">("personnages");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const discovered = new Set([...game.history, ...game.flags, ...game.flags.filter((flag) => flag.startsWith("social:")).map((flag) => flag.slice(7))]);
  type Entry = { id: string; ok: boolean; title: string; sub: string; img: string; text: string; quote?: string; pos: string };
  const items: Entry[] = tab === "personnages"
    ? CHARACTERS.map((character) => ({ id: character.id, ok: game.relationships[character.id].met || game.settings.unlockAll, title: character.name, sub: characterDescriptor(character), img: character.portrait, text: character.bio, quote: character.tagline, pos: "50% 16%" }))
    : tab === "figures"
      ? SUPPORTING_FIGURES.map((figure) => ({ id: figure.id, ok: game.settings.unlockAll || figure.unlockScenes.some((scene) => discovered.has(scene)), title: figure.name, sub: `${figure.role} · ${figure.place}`, img: figure.portrait, text: figure.bio, pos: "50% 16%" }))
      : tab === "lieux"
        ? LOCATIONS.map((location) => ({ id: location.id, ok: game.visitedLocations.includes(location.id) || game.settings.unlockAll, title: location.name, sub: location.subtitle, img: location.image, text: location.description, pos: "50% 42%" }))
        : game.history.map((id) => {
          const route = ROUTE_SCENES.find((scene) => scene.id === id);
          const campaign = campaignSceneById(id);
          const character = route ? CHARACTERS.find((entry) => entry.id === route.character) : undefined;
          return { id, ok: true, title: route?.title || campaign?.title || id, sub: route ? `Lien · ${character?.name || ""}` : campaign ? `Acte ${campaign.act} · Chapitre ${campaign.chapter}` : "Scène", img: route ? routeBackground(route) : campaign ? spotById(campaign.spot)?.background || campaign.background : "/assets/backgrounds/deep_archives.webp", text: campaign?.objective || (route ? `Scène de lien vécue avec ${character?.name || ""}. Relecture possible depuis Journal › Souvenirs.` : "Scène consignée dans la chronique."), pos: "50% 45%" };
        });
  const selected = items.find((entry) => entry.id === selectedId && entry.ok) || items.find((entry) => entry.ok);
  const count = items.filter((entry) => entry.ok).length;
  const choose = (id: string) => {
    const ul = listRef.current; const pos = ul ? [ul.scrollTop, ul.scrollLeft] : [0, 0];
    setSelectedId(id);
    requestAnimationFrame(() => { if (ul) { ul.scrollTop = pos[0]; ul.scrollLeft = pos[1]; } });
  };
  const cx = tab === "personnages" || tab === "figures" ? "personnages" : tab === "lieux" ? "lieux" : "chronique";
  return <div className="codex">
    <V2SceneTete surtitre="Encyclopédie de Sylvinia" titre="Codex"><nav className="sous-onglets" aria-label="Sections du codex">{([["personnages", "Personnages"], ["figures", "Figures"], ["lieux", "Lieux"], ["scenes", "Scènes"]] as const).map(([id, label]) => <button type="button" key={id} className={tab === id ? "actif" : ""} data-ctab={id} aria-current={tab === id ? "true" : undefined} onClick={() => { setTab(id); setSelectedId(null); }}><span>{label}</span></button>)}</nav></V2SceneTete>
    <div className="codex-corps">
      <div className="codex-liste cadre"><Orn4 /><div className="cl-prog"><span>Découvert</span><b>{count} / {items.length}</b><i style={{ "--v": `${items.length ? (count / items.length) * 100 : 0}%` } as React.CSSProperties} /></div>
        <ul ref={listRef}>{items.map((entry) => <li key={entry.id}><button type="button" className={`cl-entree ${entry === selected ? "sel" : ""} ${entry.ok ? "" : "verrou"}`} data-cx={entry.id} disabled={!entry.ok} aria-current={entry === selected ? "true" : undefined} onClick={() => choose(entry.id)}><span className="cl-img" style={{ backgroundImage: entry.ok ? `url(${entry.img})` : undefined }} /><span className="cl-txt"><b>{entry.ok ? entry.title : "???"}</b><small>{entry.ok ? entry.sub : "Non découvert"}</small></span></button></li>)}</ul>
      </div>
      {selected ? <article className={`codex-page cadre cx-${cx}`} aria-label={selected.title}><Orn4 />
        <div className="cp-grille" data-filigrane={selected.title}>
          <figure className="cp-media"><img src={selected.img} alt="" style={{ objectPosition: selected.pos }} /><span className="cp-num">N° {String(items.indexOf(selected) + 1).padStart(2, "0")}</span></figure>
          <div className="cp-txt"><span className="surtitre">{selected.sub}</span><h2 className="titre-jeu">{selected.title}</h2><i className="cp-filet" aria-hidden="true" /><p className="texte">{selected.text}</p>{selected.quote && <blockquote className="citation">{selected.quote}</blockquote>}</div>
        </div>
      </article> : <article className="codex-page cadre"><Orn4 /><div className="cp-txt"><h2 className="titre-jeu">Aucune entrée</h2><p className="texte">Ce registre se remplira à mesure que vous avancerez.</p></div></article>}
    </div>
  </div>;
}

type V2OptCat = "affichage" | "audio" | "acces" | "intimite" | "sauvegardes" | "session";
const V2_OPT_CATS: [V2OptCat, string, string][] = [["affichage", "Affichage", "Aa"], ["audio", "Audio", "♫"], ["acces", "Accessibilité", "◐"], ["intimite", "Intimité", "♡"], ["sauvegardes", "Sauvegardes", "▤"], ["session", "Session", "⏻"]];

function V2OptLigne({ id, label, desc, values, index, onMove }: { id: string; label: string; desc: string; values: string[]; index: number; onMove: (dir: number) => void }) {
  return <div className="opt-ligne"><div><b>{label}</b><small>{desc}</small></div><div className="selecteur" data-opt={id}><button type="button" className="sel-fl" aria-label={`${label} : précédent`} onClick={() => onMove(-1)}>◀</button><span className="sel-val">{values[index]}</span><button type="button" className="sel-fl" aria-label={`${label} : suivant`} onClick={() => onMove(1)}>▶</button><i className="sel-pts">{values.map((value, i) => <b key={value} className={i === index ? "on" : ""} />)}</i></div></div>;
}
const V2_ONOFF = ["Désactivé", "Activé"];

function V2Curseur({ k, value, onChange }: { k: ScaleKey; value: number; onChange: (value: number) => void }) {
  const e = ECHELLES[k];
  return <div className="opt-curseur" data-curseur={k} style={{ "--p": `${((value - e.min) / (e.max - e.min)) * 100}%` } as React.CSSProperties}>
    <div className="oc-tete"><b>{e.lib}</b><small title={`${e.desc} · ${e.min}–${e.max} %`}>{e.desc}</small><output>{value} %</output></div>
    <div className="curseur-opt"><button type="button" className="sel-fl" aria-label={`${e.lib} : moins 5 %`} onClick={() => onChange(borne(k, value - 5))}>◀</button><input type="range" min={e.min} max={e.max} step={5} value={value} aria-label={`${e.lib} (${e.min} à ${e.max} %)`} aria-valuetext={`${value} %`} onChange={(event) => onChange(borne(k, Number(event.target.value)))} /><button type="button" className="sel-fl" aria-label={`${e.lib} : plus 5 %`} onClick={() => onChange(borne(k, value + 5))}>▶</button></div>
  </div>;
}

function useV2Scales() {
  const [scales, setScales] = useState<Scales>(() => readScales());
  const update = (key: ScaleKey, value: number) => setScales((current) => { const next = { ...current, [key]: value }; applyScales(next); storeScales(next); return next; });
  const reset = () => { const next = { ...DEFAULT_SCALES }; applyScales(next); storeScales(next); setScales(next); };
  return { scales, update, reset };
}

function V2SaveSlots({ game, mode, onSave, onLoad, onLoadAuto, version }: { game?: GameState | null; mode: "save" | "load" | "both"; onSave: (slot: number) => void; onLoad: (slot: number) => void; onLoadAuto?: () => void; version: number }) {
  const rows: (number | "auto")[] = ["auto", 1, 2, 3];
  void version;
  return <div className="emplacements">{rows.map((slot, index) => {
    const info = v2SlotDetails(slot);
    const auto = slot === "auto";
    return <article key={String(slot)} className={`emplacement ${auto ? "auto" : ""} ${info ? "" : "vide"}`} style={{ "--i": index } as React.CSSProperties} data-slot={slot}>
      <span className="em-vignette" style={info?.background ? { backgroundImage: `url(${info.background})` } : undefined}><b>{info ? auto ? "AUTO" : String(slot).padStart(2, "0") : "—"}</b></span>
      <div className="em-txt"><strong>{auto ? "Sauvegarde automatique" : `Emplacement ${slot}`}</strong>{info ? <><small>{info.name} · Jour {info.day} · {info.period}</small><small>{info.place}</small><small className="discret">{auto ? "Mise à jour à chaque action" : info.savedAt || "Sauvegarde existante"}{info.coins !== undefined ? ` · ${info.coins} ◈` : ""}</small></> : <small className="discret">Emplacement libre</small>}</div>
      <div className="em-actions">
        {mode !== "load" && !auto && game && <button type="button" className="btn petit" data-sauver={slot} onClick={() => onSave(slot as number)}>{info ? "Écraser" : "Sauvegarder"}</button>}
        {mode !== "save" && info && (auto ? onLoadAuto && <button type="button" className={`btn petit ${mode === "load" ? "principal" : ""}`} data-charger="auto" onClick={onLoadAuto}>Charger</button> : <button type="button" className={`btn petit ${mode === "load" ? "principal" : ""}`} data-charger={slot} onClick={() => onLoad(slot as number)}>Charger</button>)}
      </div>
    </article>;
  })}</div>;
}

type V2OptionsProps = {
  game: GameState | null;
  updateGame?: (fn: (game: GameState) => GameState) => void;
  cats: V2OptCat[];
  sons: boolean;
  onToggleSons: () => void;
  titleMusic?: boolean;
  onToggleTitleMusic?: () => void;
  onSave: (slot: number) => void;
  onLoad: (slot: number) => void;
  onExport: () => void;
  onImport: (event: ChangeEvent<HTMLInputElement>) => void;
  onTitle: () => void;
  onStory: () => void;
  onDevOpenIntimacy?: (target: DevIntimacyTarget) => void;
  slotVersion: number;
  layout: "scene" | "dialog";
};

function V2OptionsBody({ game, updateGame, cats, sons, onToggleSons, titleMusic, onToggleTitleMusic, onSave, onLoad, onExport, onImport, onTitle, onStory, onDevOpenIntimacy, slotVersion, layout }: V2OptionsProps & { cat?: V2OptCat }) {
  const { scales, update, reset } = useV2Scales();
  const [explicitWarning, setExplicitWarning] = useState(false);
  const settings = game?.settings;
  const setSettings = (patch: Partial<GameSettings>) => updateGame?.((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  const render = (cat: V2OptCat) => {
    if (cat === "affichage") return <Fragment key={cat}>
      <div className="oc-groupe"><span className="surtitre">Échelles · appliquées en direct</span><div className="oc-grille">{SCALE_KEYS.map((k) => <V2Curseur key={k} k={k} value={scales[k]} onChange={(value) => update(k, value)} />)}</div></div>
      <div className="opt-ligne opt-reinit"><div><b>Échelles par défaut</b><small>Tous les curseurs à 100 %</small></div><button type="button" className="btn petit" data-act="echelles-defaut" onClick={reset}>↺ Réinitialiser</button></div>
      {settings && <V2OptLigne id="impact" label="Impact des choix" desc="Révèle les gains de relation avant de répondre" values={V2_ONOFF} index={Number(settings.showImpact)} onMove={() => setSettings({ showImpact: !settings.showImpact })} />}
    </Fragment>;
    if (cat === "audio") return <Fragment key={cat}>
      {settings ? <>
        <V2OptLigne id="musique" label="Musique" desc="Thèmes originaux du Visual Novel" values={V2_ONOFF} index={Number(settings.music)} onMove={() => setSettings({ music: !settings.music })} />
        <div className="opt-ligne"><div><b>Volume de la musique</b><small>Appliqué immédiatement</small></div><div className="jauge-opt" data-jauge="volume"><button type="button" className="sel-fl" aria-label="Volume : moins" onClick={() => setSettings({ volume: Math.max(0, settings.volume - 10) })}>◀</button><span className="jo-barre">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < Math.round(settings.volume / 10) ? "on" : ""} />)}</span><button type="button" className="sel-fl" aria-label="Volume : plus" onClick={() => setSettings({ volume: Math.min(100, settings.volume + 10) })}>▶</button><b>{settings.volume}</b></div></div>
      </> : onToggleTitleMusic && <V2OptLigne id="musique-titre" label="Thème du menu" desc="Musique de l’écran titre" values={V2_ONOFF} index={Number(Boolean(titleMusic))} onMove={onToggleTitleMusic} />}
      <V2OptLigne id="sons" label="Sons d’interface" desc="Survol, validation, retour — synthétisés" values={V2_ONOFF} index={Number(sons)} onMove={onToggleSons} />
    </Fragment>;
    if (cat === "acces") return <Fragment key={cat}>
      {settings ? <>
        <V2OptLigne id="reduit" label="Réduire les animations" desc="Coupe particules, parallaxe et transitions, fige la cinématique. Suit aussi le système." values={V2_ONOFF} index={Number(settings.reducedMotion)} onMove={() => setSettings({ reducedMotion: !settings.reducedMotion })} />
        <V2OptLigne id="contraste" label="Contraste renforcé" desc="Éclaircit textes secondaires et bordures" values={V2_ONOFF} index={Number(settings.highContrastText)} onMove={() => setSettings({ highContrastText: !settings.highContrastText })} />
      </> : <p className="discret">Animations réduites et contraste renforcé sont enregistrés avec votre chronique : réglables une fois la partie lancée. Le réglage système « réduire les animations » est toujours respecté.</p>}
    </Fragment>;
    if (cat === "intimite" && game) {
      const intimacyIds = V2_INTIMACY.map(([id]) => id);
      return <Fragment key={cat}>
        <V2OptLigne id="intimite" label="Niveau de narration" desc="Modifiable à tout moment · le mode explicite demande une confirmation" values={V2_INTIMACY.map(([, title]) => title)} index={Math.max(0, intimacyIds.indexOf(game.player.intimacy))} onMove={(dir) => { const nextId = intimacyIds[(intimacyIds.indexOf(game.player.intimacy) + dir + intimacyIds.length) % intimacyIds.length]; if (nextId === "explicite") setExplicitWarning(true); else updateGame?.((current) => ({ ...current, player: { ...current.player, intimacy: nextId } })); }} />
        <V2OptLigne id="corps" label="Corps du personnage" desc="Adapte les scènes concernées, sans changer pronoms ni relations" values={V2_SEXES.map(v2SexLabel)} index={Math.max(0, V2_SEXES.indexOf(game.player.sex))} onMove={(dir) => { const next = V2_SEXES[(V2_SEXES.indexOf(game.player.sex) + dir + V2_SEXES.length) % V2_SEXES.length]; updateGame?.((current) => ({ ...current, player: { ...current.player, sex: next } })); }} />
      </Fragment>;
    }
    if (cat === "sauvegardes") return <V2SaveSlots key={cat} game={game} mode="both" onSave={onSave} onLoad={onLoad} version={slotVersion} />;
    if (cat === "session") return <Fragment key={cat}>
      <div className="session">
        {game && <button type="button" className="btn large" data-act="exporter" onClick={onExport}>⇩ Exporter la sauvegarde</button>}
        <label className="btn large" data-act="importer">⇧ Importer un fichier<input type="file" accept="application/json,.json" className="v2-fichier" onChange={onImport} /></label>
        {game && <button type="button" className="btn large danger" data-act="titre" onClick={onTitle}>⏻ Retour à l’écran titre</button>}
        <button type="button" className="btn large" data-act="histoire" onClick={onStory}>↩ Mode Histoire</button>
      </div>
      {game && updateGame && <div className="v2-legacy v2-dev"><DeveloperPanel game={game} updateGame={updateGame} onOpenIntimacy={onDevOpenIntimacy} /></div>}
      <p className="discret">Univers, personnages et continuité d’après <em>Chroniques de Sylvinia</em>, le Visual Novel Sylvinia et Les mondes du Chroniqueur.</p>
    </Fragment>;
    return null;
  };
  return <>
    {layout === "dialog" ? <div className="opt-lignes">{cats.map(render)}</div> : render(cats[0])}
    {explicitWarning && <div className="v2-legacy-layer"><ExplicitModeWarning onCancel={() => setExplicitWarning(false)} onConfirm={() => { updateGame?.((current) => ({ ...current, player: { ...current.player, intimacy: "explicite" } })); setExplicitWarning(false); }} /></div>}
  </>;
}

function V2Options(props: Omit<V2OptionsProps, "cats" | "layout">) {
  const [cat, setCat] = useState<V2OptCat>("affichage");
  return <div className="options">
    <V2SceneTete surtitre="Configuration" titre="Options" />
    <div className="opt-corps">
      <nav className="opt-cats">{V2_OPT_CATS.map(([id, label, icon]) => <button type="button" key={id} className={`opt-cat ${cat === id ? "actif" : ""}`} data-otab={id} onClick={() => { sfx("onglet"); setCat(id); }}><i>{icon}</i><span>{label}</span></button>)}</nav>
      <section className="opt-panneau cadre"><Orn4 /><h2 className="titre-jeu">{V2_OPT_CATS.find(([id]) => id === cat)?.[1]}</h2><div className="opt-lignes"><V2OptionsBody {...props} cats={[cat]} layout="scene" key={cat} /></div><p className="discret">Les échelles sont enregistrées sur cet appareil ; les autres réglages voyagent avec votre chronique.</p></section>
    </div>
  </div>;
}

function V2Toasts({ toasts, onDismiss }: { toasts: V2LogEntry[]; onDismiss: (id: number) => void }) {
  return <div className="toasts" aria-live="polite">{toasts.slice(-2).reverse().map((toast) => <div key={toast.id} className={`toast t-${toast.type}`} role="status" onClick={() => onDismiss(toast.id)}><span className="t-ico"><b>{toast.icon}</b></span><div className="t-txt"><span className="t-type">{toast.label}</span><strong>{toast.title}</strong>{toast.detail && <small>{toast.detail}</small>}</div><i className="t-duree" /></div>)}</div>;
}

function V2TimeJump({ day, period, leaving }: { day: number; period: number; leaving: boolean }) {
  const entry = PERIODS[period];
  return <div className={`saut-temps ${leaving ? "sort" : ""}`}><div className="st-bande" /><div className="st-txt"><small>Jour {day}</small><b>{entry.label}</b><em>{entry.time}</em></div><div className="st-cadran">{PERIODS.map((p, index) => <i key={p.id} className={index === period ? "on" : ""}>{p.icon}</i>)}</div></div>;
}

function V2RankUp({ character, from, to, leaving, onClose }: { character: CharacterData; from: number; to: number; leaving: boolean; onClose: () => void }) {
  return <div className={`rang-up ${leaving ? "sort" : ""}`} style={{ "--c": character.color } as React.CSSProperties} onClick={onClose} role="status">
    <div className="ru-bande b1" /><div className="ru-bande b2" /><div className="ru-eclat" />
    <img className="ru-portrait" src={character.portrait} alt="" />
    <div className="ru-txt"><small>{character.name}</small><b>Rang supérieur</b><span><s>{STAGE_LABELS[from]}</s> ▸ {STAGE_LABELS[to]}</span><em>{ROMAINS[to]}</em></div>
    {Array.from({ length: 18 }, (_, k) => <i key={k} className="ru-coeur" style={{ "--x": `${Math.round(Math.cos((k / 18) * 6.28) * (180 + (k % 3) * 60))}px`, "--y": `${Math.round(Math.sin((k / 18) * 6.28) * (120 + (k % 4) * 40))}px`, "--d": `${(k % 5) * 60}ms` } as React.CSSProperties}>♥</i>)}
  </div>;
}

/* ---------- Bilan de fin de journée (style calendrier) : uniquement des écarts réels entre deux états du jeu. ---------- */
type V2BilanLigne =
  | { kind: "lien"; character: CharacterData; affection: number; trust: number; desire: number; from: number; to: number; met: boolean }
  | { kind: "bourse"; delta: number }
  | { kind: "stat"; label: string; delta: number }
  | { kind: "confluence"; delta: number }
  | { kind: "liste"; icon: string; label: string; items: string[] }
  | { kind: "compte"; icon: string; label: string; count: number };

function v2DayRecap(from: GameState, to: GameState): V2BilanLigne[] {
  const rows: V2BilanLigne[] = [];
  const added = (before: string[], after: string[]) => after.filter((entry) => !before.includes(entry));
  for (const character of CHARACTERS) {
    const a = from.relationships[character.id]; const b = to.relationships[character.id];
    if (!a || !b) continue;
    const row = { kind: "lien" as const, character, affection: b.affection - a.affection, trust: b.trust - a.trust, desire: b.desire - a.desire, from: a.stage, to: b.stage, met: !a.met && b.met };
    if (row.affection || row.trust || row.desire || row.from !== row.to || row.met) rows.push(row);
  }
  if (to.coins !== from.coins) rows.push({ kind: "bourse", delta: to.coins - from.coins });
  for (const key of Object.keys(STAT_LABELS) as StatKey[]) {
    const delta = (to.stats[key] || 0) - (from.stats[key] || 0);
    if (delta) rows.push({ kind: "stat", label: STAT_LABELS[key], delta });
  }
  if (to.confluence !== from.confluence) rows.push({ kind: "confluence", delta: to.confluence - from.confluence });
  const places = [...added(from.visitedLocations, to.visitedLocations).map((id) => LOCATIONS.find((entry) => entry.id === id)?.name), ...added(from.visitedSpots, to.visitedSpots).map((id) => spotById(id)?.name)].filter((name): name is string => Boolean(name));
  if (places.length) rows.push({ kind: "liste", icon: "⌖", label: "Lieux découverts", items: places });
  const scenes = added(from.history, to.history).map((id) => ROUTE_SCENES.find((scene) => scene.id === id)?.title || campaignSceneById(id)?.title).filter((title): title is string => Boolean(title));
  if (scenes.length) rows.push({ kind: "liste", icon: "✦", label: "Scènes vécues", items: scenes });
  const codex = added(from.codex, to.codex).filter((name) => !places.includes(name) && !scenes.includes(name));
  if (codex.length) rows.push({ kind: "liste", icon: "❖", label: "Codex", items: codex });
  const knowledge = added(from.knowledge, to.knowledge).map((id) => ALL_KNOWLEDGE_ENTRIES.find((entry) => entry.id === id)?.title).filter((title): title is string => Boolean(title));
  if (knowledge.length) rows.push({ kind: "liste", icon: "◌", label: "Découvertes", items: knowledge });
  const letters = to.letters.filter((letter) => !from.letters.some((entry) => entry.id === letter.id)).map((letter) => LETTERS.find((entry) => entry.id === letter.id)?.subject).filter((subject): subject is string => Boolean(subject));
  if (letters.length) rows.push({ kind: "liste", icon: "✉", label: "Courrier reçu", items: letters });
  const rumors = to.rumors.length - from.rumors.length;
  if (rumors > 0) rows.push({ kind: "compte", icon: "❝", label: "Rumeurs entendues", count: rumors });
  const jobs = Object.values(to.jobRuns).reduce((sum, value) => sum + value, 0) - Object.values(from.jobRuns).reduce((sum, value) => sum + value, 0);
  if (jobs > 0) rows.push({ kind: "compte", icon: "⚒", label: "Jobs accomplis", count: jobs });
  return rows;
}

function V2Delta({ value, label, cls }: { value: number; label: string; cls?: string }) {
  if (!value) return null;
  return <span className={`bj-delta ${cls || ""} ${value < 0 ? "moins" : ""}`}><small>{label}</small><b>{value > 0 ? "+" : "−"}{Math.abs(value)}</b></span>;
}

function V2BilanJour({ from, to, onClose }: { from: GameState; to: GameState; onClose: () => void }) {
  const rows = v2DayRecap(from, to);
  const [complet, setComplet] = useState(() => reduit());
  const completRef = useRef(complet);
  completRef.current = complet;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    sfx("temps");
    const timer = window.setTimeout(() => setComplet(true), 1300 + rows.length * 160);
    const onKey = (event: KeyboardEvent) => {
      if (!["Enter", " ", "Escape"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      if (completRef.current) closeRef.current(); else setComplet(true);
    };
    window.addEventListener("keydown", onKey, true);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKey, true); };
  }, [rows.length]);
  const elapsed = to.day - from.day;
  const more = (items: string[]) => items.length > 4 ? [...items.slice(0, 4), `+${items.length - 4}`] : items;
  return <div className={`bilan-jour ${complet ? "complet" : ""}`} role="dialog" aria-modal="true" aria-label={`Bilan du jour ${from.day}`} data-bilan onClick={() => { if (completRef.current) onClose(); else setComplet(true); }}>
    <div className="bj-bandes" aria-hidden="true"><i /><i /><i /></div>
    <div className="bj-calendrier" aria-hidden="true">
      <div className="bj-feuille ancienne"><small>Jour</small><b>{from.day}</b><em>{PERIODS[from.period]?.label}</em></div>
      <div className="bj-feuille nouvelle"><small>Jour</small><b>{to.day}</b><em>{PERIODS[to.period]?.label}</em></div>
    </div>
    <div className="bj-corps">
      <span className="surtitre">Fin du jour {from.day}{elapsed > 1 ? ` · ${elapsed} jours écoulés` : ""}</span>
      <h2>Bilan de la journée</h2>
      {rows.length ? <ul className="bj-liste">{rows.map((row, index) => <li key={index} className={`bj-ligne bj-${row.kind}`} style={{ "--i": index, "--c": row.kind === "lien" ? row.character.color : undefined } as React.CSSProperties}>
        {row.kind === "lien" && <><Seau color={row.character.color} portrait={row.character.portrait} /><span className="bj-nom">{row.character.name}{row.met && <i className="bj-tag">Rencontre</i>}{row.to > row.from && <i className="bj-tag rang">Rang {ROMAINS[row.from]} ▸ {ROMAINS[row.to]}</i>}</span><span className="bj-valeurs"><V2Delta value={row.affection} label="Aff." cls="aff" /><V2Delta value={row.trust} label="Conf." cls="conf" /><V2Delta value={row.desire} label="Désir" cls="des" /></span></>}
        {row.kind === "bourse" && <><span className="bj-ico">◈</span><span className="bj-nom">Bourse</span><span className="bj-valeurs"><V2Delta value={row.delta} label="Pièces" cls="or" /></span></>}
        {row.kind === "stat" && <><span className="bj-ico">◆</span><span className="bj-nom">{row.label}</span><span className="bj-valeurs"><V2Delta value={row.delta} label="Aptitude" /></span></>}
        {row.kind === "confluence" && <><span className="bj-ico">✧</span><span className="bj-nom">Confluence</span><span className="bj-valeurs"><V2Delta value={row.delta} label="Stabilité" /></span></>}
        {row.kind === "liste" && <><span className="bj-ico">{row.icon}</span><span className="bj-nom">{row.label}</span><span className="bj-items">{more(row.items).map((item) => <i key={item}>{item}</i>)}</span></>}
        {row.kind === "compte" && <><span className="bj-ico">{row.icon}</span><span className="bj-nom">{row.label}</span><span className="bj-valeurs"><V2Delta value={row.count} label="Nouv." /></span></>}
      </li>)}</ul> : <p className="discret bj-vide">Aucun changement consigné pendant cette journée.</p>}
      <p className="bj-suite">{complet ? "Toucher pour continuer" : "Toucher pour tout afficher"} <kbd>Entrée</kbd></p>
    </div>
  </div>;
}
