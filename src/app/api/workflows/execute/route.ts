import prisma from "@/lib/primsa";

import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";

import {
  ExecutionPhaseStatus,
  TWorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";

import { timingSafeEqual } from "crypto";
import parser from "cron-parser";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId");

  if (!workflowId) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!,
  ) as TWorkflowExecutionPlan;
  if (!executionPlan) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const cron = parser.parseExpression(workflow.cron!, { utc: true });
    const nextRun = cron.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => ({
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }));
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}
