"use client";

import React from "react";
import Link from "next/link";

import {
  ChevronRight,
  Clock,
  Coins,
  CornerDownRight,
  FileTextIcon,
  MoveRight,
  PlayIcon,
  ShuffleIcon,
} from "lucide-react";

import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";

import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/constants/icon-size";
import { STATUS_COLORS } from "../_constants/status-colors";

import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

import { Workflow } from "@prisma/client";
import WorkflowActions from "./WorkflowActions";
import RunButton from "./RunButton";
import SchedularDialog from "./SchedularDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";

import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ExecutionStatusLabel from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusLabel";
import DuplicateWorflowDialog from "./DuplicateWorflowDialog";

const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="group/card border-separate overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md dark:shadow-primary/30">
      <ScrollArea scrollHideDelay={0}>
        <CardContent className="flex h-[100px] items-center justify-between gap-2 p-4">
          <div className="flex items-center justify-end space-x-3">
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                STATUS_COLORS[workflow.status as WorkflowStatus],
              )}
            >
              {isDraft ? (
                <FileTextIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="flex items-center text-base font-bold text-muted-foreground">
                <TooltipWrapper content={workflow.description}>
                  <Link
                    href={`/workflow/editor/${workflow.id}`}
                    className="flex items-center hover:underline"
                  >
                    {workflow.name}
                  </Link>
                </TooltipWrapper>
                {isDraft && (
                  <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                    Draft
                  </span>
                )}

                <DuplicateWorflowDialog
                  name={workflow.name}
                  description={workflow.description}
                  workflowId={workflow.id}
                />
              </h3>
              <SchedularSection
                isDraft={isDraft}
                creditsCost={workflow.creditsCost}
                workflowId={workflow.id}
                cron={workflow.cron}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isDraft && <RunButton workflowId={workflow.id} />}
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
        <LastRunDetails workflow={workflow} />
        <ScrollBar orientation="horizontal" className="absolute top-0" />
      </ScrollArea>
    </Card>
  );
};

export default WorkflowCard;

const SchedularSection = ({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) => {
  if (isDraft) return null;

  return (
    <div className="flex h-6 items-center gap-2">
      <CornerDownRight className="h-4 w-4 flex-shrink-0 self-start text-muted-foreground" />

      <div className="self-start">
        <SchedularDialog
          workflowId={workflowId}
          cron={cron}
          key={`${cron}-${workflowId}`}
        />
      </div>
      <MoveRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flxe items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 rounded-sm text-muted-foreground"
          >
            <Coins className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
};

const LastRunDetails = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  if (isDraft) return null;

  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formatStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="flex items-center justify-between truncate bg-primary/5 px-4 py-1 text-muted-foreground">
      <div className="flex items-center gap-2 text-sm">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="group flex items-center gap-2 text-sm"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formatStartedAt}</span>
            <ChevronRight
              size={ICON_SIZE.S}
              className="flex-shrink-0 -translate-x-[2px] transition group-hover:translate-x-0"
            />
          </Link>
        )}
        {!lastRunAt && <p>No runs yet</p>}
      </div>
      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="flex-shrink-0" size={ICON_SIZE.XS} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
};
