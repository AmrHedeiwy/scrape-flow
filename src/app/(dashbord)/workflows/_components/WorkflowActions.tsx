import React from "react";

import { MoreVerticalIcon, TrashIcon } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TooltipWrapper from "@/components/TooltipWrapper";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";

const WorkflowActions = ({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <TooltipWrapper content="More actions">
              <div className="flex h-full w-full items-center justify-center">
                <MoreVerticalIcon size={ICON_SIZE.S} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={ICON_SIZE.S} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default WorkflowActions;
