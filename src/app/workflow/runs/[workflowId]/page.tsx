import React, { Suspense } from "react";
import Topbar from "../../_components/topbar/Topbar";
import { GetWorkflowExecutions } from "@/actions/getWorkflowExecutions";
import { Inbox, Loader2 } from "lucide-react";
import { ICON_SIZE } from "@/constants/icon-size";
import ExecutionsTable from "./_components/ExecutionsTable";

const ExecutionPage = ({ params }: { params: { workflowId: string } }) => {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={params.workflowId}
        title="All Executions"
        subtitle="List of all executions for this workflow"
        hideButtons
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2
              size={ICON_SIZE.XL}
              className="animate-spin stroke-primary"
            />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
};

const ExecutionsTableWrapper = async ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) return <div>No executions found</div>;

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
            <Inbox size={ICON_SIZE.XXL} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No executions have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new execution in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container w-full py-6">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
};

export default ExecutionPage;
