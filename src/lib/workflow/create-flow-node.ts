import { TaskType } from "@/types/task";
import { IWorkflowNode } from "@/types/workflow-node";

export const CreateFlowNode = (
  nodeType: TaskType,
  position?: { x: number; y: number },
): IWorkflowNode => {
  return {
    id: crypto.randomUUID(),
    type: "FlowScrapeNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? {
      x: 0,
      y: 0,
    },
  };
};
