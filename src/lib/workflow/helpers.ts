import { IWorkflowNode } from "@/types/workflow-node";
import { TaskRegistry } from "./task/registry";

export const CalculateWorkflowCost = (nodes: IWorkflowNode[]) => {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
};
