import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { IWorkflowNode } from "@/types/workflow-node";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export const useExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan } = FlowToExecutionPlan(
      nodes as IWorkflowNode[],
      edges,
    );

    return executionPlan;
  }, [toObject]);
  return generateExecutionPlan;
};
