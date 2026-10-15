/**
 * Météo régionale déterministe : (jour de partie, région) donne toujours le même temps.
 * Rien n’est sauvegardé ; le profil climatique de chaque lieu de la carte est déduit de la bible
 * du calendrier (section 2.4 et 6) et de la description des lieux dans game-data.ts.
 */
import { imperialDate, type SeasonId } from "./calendar";
import { SCOUT_VOCATION } from "./gameplay-rules";

export type WeatherId = "clair" | "voile" | "brume" | "brume-dense" | "pluie" | "vent" | "orage" | "tempete" | "chaleur" | "canicule" | "neige" | "blizzard" | "sable";

export type WeatherInfo = { id: WeatherId; label: string; icon: string; /** Périodes de trajet en plus (0 à 2). */ severity: number; detail: string; overlay: string };

export const WEATHER: Record<WeatherId, WeatherInfo> = {
  clair: { id: "clair", label: "Ciel clair", icon: "☀", severity: 0, detail: "Routes dégagées.", overlay: "clair" },
  voile: { id: "voile", label: "Ciel voilé", icon: "⛅", severity: 0, detail: "Lumière douce, routes sûres.", overlay: "voile" },
  brume: { id: "brume", label: "Brume", icon: "≋", severity: 0, detail: "La brume ralentit le regard, pas la marche.", overlay: "brume" },
  "brume-dense": { id: "brume-dense", label: "Brume épaisse", icon: "≋", severity: 1, detail: "Les chemins se dérobent : une période de plus pour entrer ou sortir.", overlay: "brume-dense" },
  pluie: { id: "pluie", label: "Pluie", icon: "☂", severity: 0, detail: "Averses ; certains préfèrent rester à l’abri.", overlay: "pluie" },
  vent: { id: "vent", label: "Grand vent", icon: "≈", severity: 0, detail: "Rafales sur les hauteurs.", overlay: "vent" },
  orage: { id: "orage", label: "Orage", icon: "ϟ", severity: 1, detail: "Routes détrempées : une période de plus.", overlay: "orage" },
  tempete: { id: "tempete", label: "Tempête", icon: "ϟ", severity: 1, detail: "Mer forte, convois retenus : une période de plus.", overlay: "tempete" },
  chaleur: { id: "chaleur", label: "Chaleur", icon: "☀", severity: 0, detail: "Air lourd ; on voyage tôt ou tard.", overlay: "chaleur" },
  canicule: { id: "canicule", label: "Canicule", icon: "☀", severity: 1, detail: "Haltes forcées aux heures brûlantes : une période de plus.", overlay: "canicule" },
  neige: { id: "neige", label: "Neige", icon: "❄", severity: 1, detail: "Neige sur les routes : une période de plus.", overlay: "neige" },
  blizzard: { id: "blizzard", label: "Tourmente de neige", icon: "❄", severity: 2, detail: "Cols presque fermés : deux périodes de plus.", overlay: "blizzard" },
  sable: { id: "sable", label: "Vent de sable", icon: "∿", severity: 2, detail: "Pistes effacées : deux périodes de plus.", overlay: "sable" },
};

export type ClimateId = "capitale" | "dome" | "brumes" | "archipel" | "roche-noire" | "desert" | "montagne" | "foret" | "fleuve" | "plaine";

export type ClimateProfile = { id: ClimateId; label: string; detail: string; table: Record<SeasonId, Partial<Record<WeatherId, number>>> };

/** Tables de probabilités relatives par saison. La chaleur estivale est en plus modulée par le pic thermique de Caeloreth. */
export const CLIMATES: Record<ClimateId, ClimateProfile> = {
  capitale: { id: "capitale", label: "Tempéré impérial", detail: "Plaine fertile et cité de pierre blanche : saisons nettes, orages d’été, rares neiges.", table: {
    printemps: { clair: 4, voile: 3, pluie: 3, vent: 1, orage: 1 }, ete: { clair: 5, voile: 2, chaleur: 3, orage: 2, canicule: 1 },
    automne: { voile: 4, pluie: 4, vent: 2, brume: 2, clair: 2 }, hiver: { voile: 4, clair: 2, pluie: 2, neige: 2, vent: 1 } } },
  dome: { id: "dome", label: "Forêt pourpre sous dôme", detail: "Le Dôme adoucit les extrêmes : brumes arcaniques, pluie fine, neige poudreuse en hiver, jamais de tempête.", table: {
    printemps: { clair: 3, voile: 3, brume: 3, pluie: 3 }, ete: { clair: 5, voile: 3, chaleur: 2, pluie: 1 },
    automne: { brume: 4, voile: 3, pluie: 3, clair: 2 }, hiver: { neige: 3, brume: 3, voile: 3, clair: 2 } } },
  brumes: { id: "brumes", label: "Forêt des brumes", detail: "Brume présente toute l’année ; elle s’épaissit en automne et en hiver.", table: {
    printemps: { brume: 6, "brume-dense": 1, pluie: 2, voile: 2 }, ete: { brume: 4, voile: 3, clair: 2, orage: 1 },
    automne: { brume: 5, "brume-dense": 3, pluie: 2 }, hiver: { brume: 4, "brume-dense": 3, neige: 2 } } },
  archipel: { id: "archipel", label: "Archipel maritime", detail: "Vent et pluie fréquents, tempêtes d’automne et d’hiver, étés venteux mais doux.", table: {
    printemps: { voile: 3, vent: 3, pluie: 3, clair: 2, tempete: 1 }, ete: { clair: 4, vent: 3, voile: 2, orage: 1 },
    automne: { pluie: 4, vent: 3, tempete: 3, voile: 2 }, hiver: { pluie: 3, tempete: 3, vent: 3, voile: 2, neige: 1 } } },
  "roche-noire": { id: "roche-noire", label: "Cité creusée dans la roche noire", detail: "Air sec et chaud, orages secs ; la cité verticale protège de presque tout.", table: {
    printemps: { clair: 4, voile: 2, vent: 2, chaleur: 1 }, ete: { chaleur: 4, clair: 3, canicule: 2, orage: 1 },
    automne: { clair: 3, voile: 3, vent: 2, orage: 1 }, hiver: { voile: 4, clair: 3, vent: 2, pluie: 1 } } },
  desert: { id: "desert", label: "Désert d’Hil’dinis", detail: "Ciel dur, chaleur écrasante en été, vents de sable en saison chaude et à l’automne.", table: {
    printemps: { clair: 5, chaleur: 2, vent: 2, sable: 1 }, ete: { canicule: 3, chaleur: 4, sable: 2, clair: 1 },
    automne: { clair: 4, vent: 2, sable: 2, chaleur: 1 }, hiver: { clair: 5, voile: 2, vent: 2 } } },
  montagne: { id: "montagne", label: "Crêtes minérales", detail: "Vent permanent, neige précoce et tourmentes en hiver.", table: {
    printemps: { vent: 3, voile: 3, clair: 2, neige: 1 }, ete: { clair: 4, vent: 3, orage: 2 },
    automne: { vent: 3, voile: 2, neige: 2, orage: 1 }, hiver: { neige: 4, blizzard: 2, vent: 2, voile: 1 } } },
  foret: { id: "foret", label: "Forêt tempérée", detail: "Couvert protecteur : pluie et brume fréquentes, peu d’extrêmes.", table: {
    printemps: { pluie: 3, voile: 3, clair: 3, brume: 1 }, ete: { clair: 4, voile: 2, orage: 2, chaleur: 1 },
    automne: { pluie: 3, brume: 3, voile: 3, vent: 1 }, hiver: { voile: 3, neige: 2, brume: 2, clair: 2 } } },
  fleuve: { id: "fleuve", label: "Vallée du Fleuve bleu", detail: "Brumes de rivière ; la route monte ensuite vers les montagnes, enneigées en hiver.", table: {
    printemps: { brume: 3, pluie: 3, voile: 2, clair: 2 }, ete: { clair: 4, voile: 2, orage: 2, brume: 1 },
    automne: { brume: 4, pluie: 3, voile: 2 }, hiver: { neige: 3, brume: 3, voile: 2, blizzard: 1 } } },
  plaine: { id: "plaine", label: "Plaine vers la côte", detail: "Vent de mer, pluies d’automne, orages d’été.", table: {
    printemps: { clair: 3, voile: 3, pluie: 2, vent: 2 }, ete: { clair: 4, chaleur: 2, orage: 2 },
    automne: { pluie: 4, vent: 3, voile: 2, orage: 1 }, hiver: { voile: 3, pluie: 3, vent: 2, neige: 1 } } },
};

/** Profil climatique de chaque région ou escale de la carte (LOCATIONS). */
export const LOCATION_CLIMATE: Record<string, ClimateId> = {
  algratal: "capitale",
  miraldas: "dome",
  forbidden: "brumes",
  forthaven: "archipel",
  akuhn: "roche-noire",
  "rocky-spires": "montagne",
  tzekarun: "desert",
  forestier: "foret",
  "echo-clearing": "foret",
  "river-halt": "fleuve",
  "imperial-road": "plaine",
  "obsidian-waystation": "desert",
};

/** Lieux abrités où la météo se voit à peine (intérieurs, cité souterraine). */
const SHELTERED_LOCATIONS = new Set(["tzekarun"]);

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function climateOf(locationId: string): ClimateProfile { return CLIMATES[LOCATION_CLIMATE[locationId] || "capitale"]; }

function rawWeather(day: number, locationId: string): WeatherInfo {
  const date = imperialDate(day);
  const table = climateOf(locationId).table[date.season];
  // Pic thermique : la chaleur pèse davantage près de Caeloreth, moins en début d’été.
  const entries = (Object.entries(table) as [WeatherId, number][]).map(([id, weight]) => [id, id === "chaleur" || id === "canicule" ? weight * (0.4 + date.heat) : weight] as [WeatherId, number]);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = hash(`${locationId}:${date.year}:${date.dayOfYear}`) * total;
  for (const [id, weight] of entries) { cursor -= weight; if (cursor < 0) return WEATHER[id]; }
  return WEATHER[entries[entries.length - 1][0]];
}

/** Temps du jour (identique sur les quatre périodes) pour une région. Déterministe, sans sauvegarde. */
export function weatherAt(day: number, locationId: string): WeatherInfo {
  const safe = Math.max(1, Math.floor(day));
  // Persistance : près d’un jour sur deux reprend le temps de la veille (même saison), pour un ciel moins changeant.
  if (safe > 1 && imperialDate(safe - 1).season === imperialDate(safe).season && hash(`keep:${locationId}:${safe}`) < 0.45) return rawWeather(safe - 1, locationId);
  return rawWeather(safe, locationId);
}

/** Prévisions sur quelques jours (le jour courant inclus). */
export function forecast(day: number, locationId: string, days = 3) {
  return Array.from({ length: days }, (_, index) => ({ day: day + index, weather: weatherAt(day + index, locationId) }));
}

/* ---------- Effet sur les trajets ---------- */

/** Plafond de surcoût météo : jamais plus de deux périodes, soit une demi-journée. */
export const WEATHER_TRAVEL_CAP = 2;

export type WeatherTravel = { surcharge: number; reason?: WeatherInfo; where?: string; waived?: "story" | "invitation" | "same-place" | "setting"; scoutHelped: boolean };

/**
 * Surcoût en périodes d’un trajet entre deux régions selon la météo du jour du départ.
 * Règles : changement de sous-lieu dans une même région jamais affecté ; on retient le pire temps
 * entre départ et arrivée ; l’Éclaireur·se retire une période au surcoût ; plafond de deux périodes.
 * Les trajets imposés par l’histoire et ceux qui rejoignent une invitation acceptée sont exemptés (voir page.tsx).
 */
export function weatherTravel(fromLocationId: string, toLocationId: string, day: number, vocation: string, exemption?: WeatherTravel["waived"]): WeatherTravel {
  if (fromLocationId === toLocationId) return { surcharge: 0, waived: "same-place", scoutHelped: false };
  const from = SHELTERED_LOCATIONS.has(fromLocationId) ? WEATHER.clair : weatherAt(day, fromLocationId);
  const to = SHELTERED_LOCATIONS.has(toLocationId) ? WEATHER.clair : weatherAt(day, toLocationId);
  const worst = to.severity >= from.severity ? { info: to, where: toLocationId } : { info: from, where: fromLocationId };
  if (!worst.info.severity) return { surcharge: 0, scoutHelped: false };
  if (exemption) return { surcharge: 0, reason: worst.info, where: worst.where, waived: exemption, scoutHelped: false };
  const scout = vocation === SCOUT_VOCATION;
  const surcharge = Math.min(WEATHER_TRAVEL_CAP, Math.max(0, worst.info.severity - (scout ? 1 : 0)));
  return { surcharge, reason: worst.info, where: worst.where, scoutHelped: scout };
}

/* ---------- Abris : petits déplacements de routine par mauvais temps ---------- */

/** Sous-lieu extérieur vers un abri de la même région. Seulement des paires sûres et existantes. */
export const WEATHER_SHELTERS: Record<string, string> = {
  "miraldas-lake": "miraldas-lanterns",
  "miraldas-purple-woods": "miraldas-lanterns",
  "forthaven-ramparts": "forthaven-war-room",
  "forthaven-training-yard": "forthaven-war-room",
  "forthaven-harbor": "forthaven-memorial",
  "akuhn-terrace": "akuhn-music-room",
  "algratal-streets": "algratal-market",
};

const SHELTER_WEATHER = new Set<WeatherId>(["pluie", "orage", "tempete", "neige", "blizzard", "sable", "canicule"]);

/**
 * Abri éventuel pour une présence de routine. `protectedSpots` contient tous les sous-lieux où une scène,
 * une invitation, un rendez-vous ou un événement attend un personnage : ils ne sont jamais déplacés.
 */
export function shelterSpot(spotId: string, locationId: string, day: number, protectedSpots: ReadonlySet<string>) {
  const target = WEATHER_SHELTERS[spotId];
  if (!target || protectedSpots.has(spotId)) return undefined;
  const weather = weatherAt(day, locationId);
  return SHELTER_WEATHER.has(weather.id) ? { spot: target, weather } : undefined;
}
