import type { PlayerSex } from "./date-scenes";
import type { BVIntimacyScene, BVVoie } from "./bellirith-valurn-intimacy-kit";
import { BV_A_FEMME, BV_A_HOMME } from "./bellirith-valurn-intimacy-a";
import { BV_B_FEMME, BV_B_HOMME } from "./bellirith-valurn-intimacy-b";
import { BV_C_FEMME, BV_C_HOMME } from "./bellirith-valurn-intimacy-c";

export const BV_INTIMACY_SCENES: readonly BVIntimacyScene[] = [BV_A_FEMME, BV_A_HOMME, BV_B_FEMME, BV_B_HOMME, BV_C_FEMME, BV_C_HOMME];

export function bvIntimacyScene(voie: BVVoie, sex: PlayerSex): BVIntimacyScene {
  return BV_INTIMACY_SCENES.find((scene) => scene.voie === voie && scene.sex === sex) ?? BV_A_FEMME;
}
