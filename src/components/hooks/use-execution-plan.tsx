import { IWorkflowNode } from "@/types/workflow-node";

import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError,
  TFlowToExecutionPlan,
} from "@/lib/workflow/execution-plan";
import { toast } from "sonner";

import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useFlowValidation } from "./use-flow-validation";

export const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: Exclude<TFlowToExecutionPlan["error"], undefined>) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found", { id: "no-entry-point" });
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all input values are set", { id: "invalid-inputs" });
          setInvalidInputs(error.invalidElements!);
          break;
        default:
          toast.error("Something went wrong", { id: "something-went-wrong" });
      }
    },
    [setInvalidInputs],
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as IWorkflowNode[],
      edges,
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);
  return generateExecutionPlan;
};
