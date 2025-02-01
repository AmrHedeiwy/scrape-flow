import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
  COMPLETED: "text-green-600",
};

const ExecutionStatusLabel = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
};

export default ExecutionStatusLabel;
