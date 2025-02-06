"use client";

import React from "react";
import { formatDistanceToNow, set } from "date-fns";

import { GetWorkflowExecutionWithPhase } from "@/actions/getWorkflowExecutionWithPhase";
import { ICON_SIZE } from "@/constants/icon-size";

import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
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
import ParamterViewer from "./ParamterViewer";
import LogViewer from "./LogViewer";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountupWrapper from "@/components/ReactCountupWrapper";

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
    queryKey: ["phaseDetails", selectedPhase, data?.status],
    enabled: selectedPhase != null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = data?.status === WorkflowExecutionStatus.RUNNING;
  React.useEffect(() => {
    const phases = data?.phases || [];
    if (isRunning) {
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1,
      )[0];

      setSelectedPhase(phaseToSelect.id);
      return;
    }

    const phaseToSelect = phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1,
    )[0];
    setSelectedPhase(phaseToSelect.id);
  }, [isRunning, data, setSelectedPhase]);

  const duration = DatesToDurationString(data?.completedAt, data?.startedAt);
  const creditsConsumed = GetPhasesTotalCost(data?.phases || []);

  return (
    <div className="flex h-full w-full">
      <aside className="flex w-[440px] min-w-[440px] max-w-[440px] flex-grow border-separate flex-col overflow-hidden border-r-2">
        <div className="px-2 py-4">
          <ExecutionLabel
            label="Status"
            icon={CircleDashed}
            value={
              <div className="flex items-center gap-2 font-semibold capitalize">
                <PhaseStatusBadge
                  status={data?.status as ExecutionPhaseStatus}
                />
                <span>{data?.status}</span>
              </div>
            }
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
            value={<ReactCountupWrapper value={creditsConsumed} />}
          />
        </div>

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
              <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex h-full w-full">
        {isRunning && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <p className="font-bold">Execution is in progress, please wait</p>
          </div>
        )}

        {!isRunning && !selectedPhase && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>
              <p className="text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}

        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="container flex flex-col gap-4 overflow-auto py-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="space-x-4">
                <div className="flex items-center gap-1">
                  <Coins
                    size={ICON_SIZE.S}
                    className="stroke-muted-foreground"
                  />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>

              <Badge variant="outline" className="space-x-4">
                <div className="flex items-center gap-1">
                  <Clock
                    size={ICON_SIZE.S}
                    className="stroke-muted-foreground"
                  />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startedAt,
                  ) || "-"}
                </span>
              </Badge>
            </div>
            <ParamterViewer
              title="Inputs"
              subtitle="Inputs used for this phase"
              paramsJson={phaseDetails.data.inputs}
            />
            <ParamterViewer
              title="Outputs"
              subtitle="Outputs generated by this phase"
              paramsJson={phaseDetails.data.outputs}
            />

            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
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
