"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/primsa";

import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import {
  ExecutionpPhaseStatus,
  TWorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { redirect } from "next/navigation";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export const RunWorkflow = async (form: {
  workflowId: string;
  flowDefinition?: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  const { workflowId, flowDefinition } = form;

  if (!workflowId) throw new Error("Workflow ID is required");

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) throw new Error("Workflow not found");

  let executionPlan: TWorkflowExecutionPlan;
  if (!flowDefinition) throw new Error("Flow definition is required");

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) throw new Error("Flow definition is invalid");

  if (!result.executionPlan) throw new Error("No execution plan generated");

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      trigger: WorkflowExecutionTrigger.MANUAL,
      startedAt: new Date(),
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => ({
            userId,
            status: ExecutionpPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type].label,
          }));
        }),
      },
    },
    select: { id: true, phases: true },
  });

  if (!execution) throw new Error("Execution not created");

  ExecuteWorkflow(execution.id); // run in the background
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
};
