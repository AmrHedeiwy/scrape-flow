"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutionWithPhase = async (executionId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
};
