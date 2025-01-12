import React from "react";

import { ICON_SIZE } from "@/constants/icon-size";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon, Workflow } from "lucide-react";

import { GetWorkflowsForUser } from "@/actions/getWorkflowsForUser";
import CreateWorflowDialog from "./CreateWorflowDialog";
import WorkflowCard from "./WorkflowCard";

const UserWorkflows = async () => {
  const workflows = await GetWorkflowsForUser();

  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>

        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <InboxIcon className="stroke-primary" size={ICON_SIZE.XXL} />
        </div>

        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorflowDialog triggerText="Create your first workflow" />
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
};

export default UserWorkflows;
