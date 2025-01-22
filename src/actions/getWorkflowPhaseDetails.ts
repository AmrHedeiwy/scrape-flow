"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowPhaseDetails = async (phaseId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      userId,
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
};
