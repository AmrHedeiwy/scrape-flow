"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const RemoveWorkflowSchedule = async ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath("/workflows");
};
