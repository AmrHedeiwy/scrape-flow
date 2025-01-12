import { TaskType } from "@/types/task";
import { IWorkflowNode } from "@/types/workflow-node";

export const CreateFlowNode = (
  nodetType: TaskType,
  position?: { x: number; y: number },
): IWorkflowNode => {
  return {
    id: crypto.randomUUID(),
    type: "FlowScrapeNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodetType,
      inputs: {},
    },
    position: position ?? {
      x: 0,
      y: 0,
    },
  };
};
