"use server";

import prisma from "@/lib/primsa";

import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

export const UnPublishWorkflow = async (workflowId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  if (!workflowId) throw new Error("Workflow ID is required");

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) throw new Error("Workflow not found");
  if (workflow.status !== WorkflowStatus.PUBLISHED)
    throw new Error("Workflow is not published");

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  revalidatePath(`/workflow/editor/${workflowId}`);
};
