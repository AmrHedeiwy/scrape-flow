import React from "react";

import { GetWorkflowsForUser } from "@/actions/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Inbox, InboxIcon } from "lucide-react";
import { ICON_SIZE } from "@/constants/icon-size";

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
      </div>
    );

  return <div>UserWorkflows</div>;
};

export default UserWorkflows;
