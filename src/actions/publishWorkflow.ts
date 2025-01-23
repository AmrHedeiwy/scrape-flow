"use server";

import prisma from "@/lib/primsa";
import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const PublishWorkflow = async ({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition: string;
}) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated user");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft status");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) throw new Error("flow definition is invalid");
  if (!result.executionPlan) throw new Error("no execution plan generated");

  const creditsCost = CalculateWorkflowCost(flow.nodes);

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  });

  revalidatePath(`/workflows/editor/${workflowId}`);
};
