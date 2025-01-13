"use server";

import prisma from "@/lib/primsa";

import { Edge } from "@xyflow/react";

import { WorkflowStatus } from "@/types/workflow";
import { IWorkflowNode } from "@/types/workflow-node";

import { CreateWorkflowSchema, TCreateWorkflowSchema } from "@/schema/workflow";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateFlowNode } from "@/lib/workflow/create-flow-node";
import { TaskType } from "@/types/task";

export const CreateWorkflow = async (form: TCreateWorkflowSchema) => {
  const { success, data } = CreateWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated user");
  }

  const initialDefinition: { nodes: IWorkflowNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  initialDefinition.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialDefinition),
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
};
