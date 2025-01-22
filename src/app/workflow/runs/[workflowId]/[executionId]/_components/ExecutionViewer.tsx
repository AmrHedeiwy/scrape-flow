"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";

import { GetWorkflowExecutionWithPhase } from "@/actions/getWorkflowExecutionWithPhase";
import { ICON_SIZE } from "@/constants/icon-size";

import { WorkflowExecutionStatus } from "@/types/workflow";
import {
  Calendar,
  CircleDashed,
  Clock,
  Coins,
  Loader2,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { GetWorkflowPhaseDetails } from "@/actions/getWorkflowPhaseDetails";

type TExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>;

const ExecutionViewer = ({ initialData }: { initialData: TExecutionData }) => {
  const [selectedPhase, setSelectedPhase] = React.useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhase(initialData?.id!),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase != null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = data?.status === WorkflowExecutionStatus.RUNNING;
  const duration = DatesToDurationString(data?.completedAt, data?.startedAt);
  const creditsConsumed = GetPhasesTotalCost(data?.phases || []);

  return (
    <div className="flex h-full w-full">
      <aside className="flex w-[440px] min-w-[440px] max-w-[440px] flex-grow border-separate flex-col overflow-hidden border-r-2">
        <div className="px-2 py-4">
          <ExecutionLabel
            label="Status"
            icon={CircleDashed}
            value={data?.status}
          />
          <ExecutionLabel
            label="Started at"
            icon={Calendar}
            value={
              <span className="lowercase">
                {data?.startedAt
                  ? formatDistanceToNow(data.startedAt, { addSuffix: true })
                  : "-"}
              </span>
            }
          />

          <ExecutionLabel
            label="Duration"
            icon={Clock}
            value={
              duration ? (
                duration
              ) : (
                <Loader2 size={ICON_SIZE.M} className="animate-spin" />
              )
            }
          />
          <ExecutionLabel
            label="Credits consumed"
            icon={Coins}
            value={creditsConsumed}
          />

          <Separator />

          <div className="flex items-center justify-center px-4 py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <WorkflowIcon className="stroke-muted-foreground/80" />
              <span className="font-semibold">Phases</span>
            </div>
          </div>

          <Separator />

          <div className="h-full overflow-auto px-2 py-4">
            {data?.phases.map((phase, index) => (
              <Button
                key={phase.id}
                className="w-full justify-between"
                variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                onClick={() => {
                  if (isRunning) return;

                  setSelectedPhase(phase.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{phase.status}</p>
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex h-full w-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 2)}</pre>
      </div>
    </div>
  );
};

const ExecutionLabel = ({
  label,
  icon: Icon,
  value,
}: {
  label: React.ReactNode;
  icon: LucideIcon;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={ICON_SIZE.M} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2 font-semibold capitalize">
        {value}
      </div>
    </div>
  );
};

export default ExecutionViewer;
