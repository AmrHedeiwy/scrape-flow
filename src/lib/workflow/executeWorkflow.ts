import "server-only";

import prisma from "../primsa";

import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { IWorkflowNode } from "@/types/workflow-node";
import { TLogCollector } from "@/types/log";
import { TEnvironment, TExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";

import { ExecutionPhase, Prisma } from "@prisma/client";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { createLogCollector } from "../log";

export const ExecuteWorkflow = async (executionId: string) => {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });
  if (!execution) throw new Error("Execution not found");

  const edges = JSON.parse(execution.definition).edges as Edge[];

  const environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId,
    );
    creditsConsumed += phaseExecution.creditsConsumed;

    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed,
  );

  await cleanUpEnvironment(environment);
  revalidatePath("/workflow/runs");
};

const initializeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
) => {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
};

const initializePhaseStatuses = async (
  execution: Prisma.WorkflowExecutionGetPayload<{
    include: {
      workflow: true;
      phases: true;
    };
  }>,
) => {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
};

const finalizeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number,
) => {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      completedAt: new Date(),
      status: finalStatus,
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      console.error(
        "ERROR IN FINALIZE WORKFLOW EXECUTION - UPDATE WORKFLOW",
        err,
      ); // 2 workflow executions can run at the same time??
    });
};

const executeWorkflowPhase = async (
  phase: ExecutionPhase,
  environment: TEnvironment,
  edges: Edge[],
  userId: string,
) => {
  const logCollector = createLogCollector();
  const started = new Date();
  const node = JSON.parse(phase.node) as IWorkflowNode;

  setupEnvironmentForPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt: started,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    // execute phase if credits are sufficient
    success = await executePhase(phase, node, environment, logCollector);
  }

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed,
  );
  return { success, creditsConsumed };
};

const finalizePhase = async (
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: TLogCollector,
  creditsConsumed: number,
) => {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
};

const executePhase = async (
  phase: ExecutionPhase,
  node: IWorkflowNode,
  environment: TEnvironment,
  logCollector: TLogCollector,
): Promise<boolean> => {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) return false;

  const executionEnvironment: TExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);

  return await runFn(executionEnvironment);
};

const setupEnvironmentForPhase = (
  node: IWorkflowNode,
  environment: TEnvironment,
  edges: Edge[],
) => {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };

  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    if (input.type === TaskParamType.BROSWER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from outputs in the environment
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );

    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "Node ID:", node.id);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
};

export const createExecutionEnvironment = (
  node: IWorkflowNode,
  environment: TEnvironment,
  logCollector: TLogCollector,
): TExecutionEnvironment<any> => {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),

    log: logCollector,
  };
};

const cleanUpEnvironment = async (environment: TEnvironment) => {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((err) => console.error("Error closing browser", err));
  }
};

const decrementCredits = async (
  userId: string,
  amount: number,
  logCollector: TLogCollector,
) => {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: { gte: amount },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    logCollector.error("insufficient balance");
    return false;
  }
};
