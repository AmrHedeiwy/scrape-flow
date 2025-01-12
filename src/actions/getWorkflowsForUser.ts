"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowsForUser = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthenticated user");
  }

  return prisma.workflow.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
