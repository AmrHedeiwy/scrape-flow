"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export const UpdateWorkflowCron = async ({
  workflowId,
  cron,
}: {
  workflowId: string;
  cron: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  try {
    const interval = parser.parseExpression(cron, { utc: true });

    await prisma.workflow.update({
      where: {
        id: workflowId,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("Invalid cron", error.message);
    throw new Error("Invalid cron expression");
  }

  revalidatePath("/workflows");
};
