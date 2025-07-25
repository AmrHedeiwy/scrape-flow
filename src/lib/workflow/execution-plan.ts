import {
  TWorkflowExecutionPlan,
  TWorkflowExecutionPlanPhase,
} from "@/types/workflow";
import {
  IWorkflowNode,
  TWorkflowNodeMissingInputs,
} from "@/types/workflow-node";

import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

export type TFlowToExecutionPlan = {
  executionPlan?: TWorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: TWorkflowNodeMissingInputs[];
  };
};

export const FlowToExecutionPlan = (
  nodes: IWorkflowNode[],
  edges: Edge[],
): TFlowToExecutionPlan => {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint,
  );

  if (!entryPoint)
    return {
      error: { type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT },
    };

  const inputsWithErrors: TWorkflowNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan: TWorkflowExecutionPlan = [
    { phase: 1, nodes: [entryPoint] },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: TWorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currenNode of nodes) {
      if (planned.has(currenNode.id)) continue; // already in execution plan

      const invalidInputs = getInvalidInputs(currenNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currenNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all incomers are already in the execution plan and there are still invalid inputs
          // this means that this particular node has invalid inputs
          // which means the workflow in invalid
          console.error("invalid inputs", currenNode.id, invalidInputs);
          inputsWithErrors.push({
            nodeId: currenNode.id,
            inputs: invalidInputs,
          });
        } else continue; // skip for now
      }
      nextPhase.nodes.push(currenNode);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }

    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0)
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };

  return { executionPlan };
};

const getInvalidInputs = (
  node: IWorkflowNode,
  edges: Edge[],
  planned: Set<string>,
) => {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    if (inputValue?.length > 0) continue; // input is fine

    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name,
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput)
      continue; // input is fine
    else if (!input.required) {
      if (!inputLinkedToOutput) continue; // input not required and not linked to output so it's fine
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source))
        continue; // input not required and linked to output and planned so it's fine
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
};

const getIncomers = (
  node: IWorkflowNode,
  nodes: IWorkflowNode[],
  edges: Edge[],
) => {
  if (!node.id) return [];

  const incomersIds = new Set();
  for (const edge of edges) {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  }

  return nodes.filter((node) => incomersIds.has(node.id));
};
