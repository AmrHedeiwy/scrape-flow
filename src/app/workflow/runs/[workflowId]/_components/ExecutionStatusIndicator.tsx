"use client";

import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
  COMPLETED: "bg-green-600",
};

const ExecutionStatusIndicator = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return (
    <div className={cn("h-2 w-2 rounded-full", indicatorColors[status])} />
  );
};

export default ExecutionStatusIndicator;
