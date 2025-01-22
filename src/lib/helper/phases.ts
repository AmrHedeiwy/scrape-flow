import { ExecutionPhase } from "@prisma/client";

type TPhase = Pick<ExecutionPhase, "creditsConsumed">;

export const GetPhasesTotalCost = (phases: TPhase[]) => {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
};
