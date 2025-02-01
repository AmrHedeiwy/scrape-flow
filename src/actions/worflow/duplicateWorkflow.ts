"use server";

import prisma from "@/lib/primsa";

import {
  DuplicateWorkflowSchema,
  TDuplicateWorkflowSchema,
} from "@/schema/workflow";

import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

export const DuplicateWorkflow = async (form: TDuplicateWorkflowSchema) => {
  const { success, data } = DuplicateWorkflowSchema.safeParse(form);
  if (!success) throw new Error("Invalid form data");

  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId,
    },
  });

  if (!sourceWorkflow) throw new Error("Workflow not found");

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });

  if (!result) throw new Error("Failed to duplicate workflow");

  revalidatePath("/workflows");
};
