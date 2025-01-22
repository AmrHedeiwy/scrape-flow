import React from "react";

import { ExecutionpPhaseStatus } from "@/types/workflow";
import { CircleCheck, CircleDashed, CircleX, Loader2 } from "lucide-react";
import { ICON_SIZE } from "@/constants/icon-size";

const PhaseStatusBadge = ({ status }: { status: ExecutionpPhaseStatus }) => {
  switch (status) {
    case ExecutionpPhaseStatus.PENDING:
      return (
        <CircleDashed size={ICON_SIZE.M} className="stroke-muted-foreground" />
      );
    case ExecutionpPhaseStatus.RUNNING:
      return (
        <Loader2
          size={ICON_SIZE.M}
          className="animate-spin stroke-yellow-500"
        />
      );
    case ExecutionpPhaseStatus.FAILED:
      return <CircleX size={ICON_SIZE.M} className="stroke-destructive" />;
    case ExecutionpPhaseStatus.COMPLETED:
      return <CircleCheck size={ICON_SIZE.M} className="stroke-green-500" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
};

export default PhaseStatusBadge;
