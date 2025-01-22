import React, { Suspense } from "react";

import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2 } from "lucide-react";
import ExecutionViewerWrapper from "./_components/ExecutionViewerWrapper";

const ExecutionViewerPage = ({
  params,
}: {
  params: { workflowId: string; executionId: string };
}) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow Execution Details"
        subtitle={`Execution ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
};

export default ExecutionViewerPage;
