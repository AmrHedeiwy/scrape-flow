import React from "react";
import { notFound } from "next/navigation";

import { GetWorkflowExecutionWithPhase } from "@/actions/getWorkflowExecutionWithPhase";
import ExecutionViewer from "./ExecutionViewer";

const ExecutionViewerWrapper = async ({
  executionId,
}: {
  executionId: string;
}) => {
  const workflowExecition = await GetWorkflowExecutionWithPhase(executionId);

  if (!workflowExecition) return notFound();

  return <ExecutionViewer initialData={workflowExecition} />;
};

export default ExecutionViewerWrapper;
