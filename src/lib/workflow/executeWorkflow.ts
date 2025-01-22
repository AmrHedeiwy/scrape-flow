import "server-only";
import prisma from "../primsa";
import { revalidatePath } from "next/cache";
import {
  ExecutionpPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase, Prisma } from "@prisma/client";
import { waitFor } from "../helper/waitFor";
import { IWorkflowNode } from "@/types/workflow-node";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { TEnvironment, TExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";

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
    );
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
  // clean up environment

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
      status: ExecutionpPhaseStatus.PENDING,
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
) => {
  const started = new Date();
  const node = JSON.parse(phase.node) as IWorkflowNode;

  setupEnvironmentForPhase(node, environment, edges);

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionpPhaseStatus.RUNNING,
      startedAt: started,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  const success = await executePhase(phase, node, environment);

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs);
  return { success };
};

const finalizePhase = async (
  phaseId: string,
  success: boolean,
  outputs: any,
) => {
  const finalStatus = success
    ? ExecutionpPhaseStatus.COMPLETED
    : ExecutionpPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
    },
  });
};

const executePhase = async (
  phase: ExecutionPhase,
  node: IWorkflowNode,
  environment: TEnvironment,
): Promise<boolean> => {
  const runFn = ExecutorRegistry[node.data.type];

  if (!runFn) return false;

  const executionEnvironment: TExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment);

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
  };
};

const cleanUpEnvironment = async (environment: TEnvironment) => {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((err) => console.error("Error closing browser", err));
  }
};
