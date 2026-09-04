import type { PlayerSex } from "./date-scenes";
import type { GroupIntimacyRoute } from "./group-dates";
import { LINEVA_ALLENNA_TRAINING_ROUTES } from "./lineva-allenna-training-intimacy";
import { LINEVA_ALLENNA_BASIN_ROUTES } from "./lineva-allenna-basin-intimacy";
import { LINEVA_ALLENNA_HOME_ROUTES } from "./lineva-allenna-home-intimacy";

export const LINEVA_ALLENNA_MANUAL_CONTEXT_IDS = [
  "group-date-allenna-lineva-training",
  "group-date-allenna-lineva-basin",
  "group-date-allenna-lineva-home",
] as const;

export const LINEVA_ALLENNA_MANUAL_ROUTES: Record<string, Record<PlayerSex, GroupIntimacyRoute[]>> = {
  "group-date-allenna-lineva-training": LINEVA_ALLENNA_TRAINING_ROUTES,
  "group-date-allenna-lineva-basin": LINEVA_ALLENNA_BASIN_ROUTES,
  "group-date-allenna-lineva-home": LINEVA_ALLENNA_HOME_ROUTES,
};

export function isLinevaAllennaManualContext(id: string): boolean {
  return (LINEVA_ALLENNA_MANUAL_CONTEXT_IDS as readonly string[]).includes(id);
}
