"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutions = (workflowId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
