import { BN_FIRST_INTIMACY } from "./bellirith-naiah-intimacy-first";
import { BN_LIMIT_INTIMACY } from "./bellirith-naiah-intimacy-limit";
import { BN_SIMULATION_INTIMACY } from "./bellirith-naiah-intimacy-simulation";
import type { BNIntimacyScene } from "./bellirith-naiah-intimacy-kit";
import type { BNIntimacyId } from "./bellirith-naiah-cross-quest";

export { bnAllLines, bnRenderChapters, bnRenderOpening, bnVisualState } from "./bellirith-naiah-intimacy-kit";
export type { BNIntimacyScene, BNVisual } from "./bellirith-naiah-intimacy-kit";

export const BN_INTIMACY_SCENES: Record<BNIntimacyId, BNIntimacyScene> = {
  "bn-first": BN_FIRST_INTIMACY,
  "bn-limit": BN_LIMIT_INTIMACY,
  "bn-simulation": BN_SIMULATION_INTIMACY,
};

export function bnIntimacyScene(id: BNIntimacyId): BNIntimacyScene {
  return BN_INTIMACY_SCENES[id];
}
