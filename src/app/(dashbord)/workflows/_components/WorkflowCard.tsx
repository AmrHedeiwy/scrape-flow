"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import { FileTextIcon, PlayIcon, ShuffleIcon } from "lucide-react";
import React from "react";
import { STATUS_COLORS } from "../_constants/status-colors";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ICON_SIZE } from "@/constants/icon-size";
import WorkflowActions from "./WorkflowActions";

const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="shadow-s, dard:shadow-primary/30 border-separate overflow-hidden rounded-lg border hover:shadow-md">
      <CardContent className="flex h-[100px] items-center justify-between p-4">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              STATUS_COLORS[workflow.status as WorkflowStatus],
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5 " />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="flex items-center text-base font-bold text-muted-foreground">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex items-center gap-2",
            })}
          >
            <ShuffleIcon size={ICON_SIZE.S} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
