import React from "react";

import { ExecutionPhaseStatus } from "@/types/workflow";
import { CircleCheck, CircleDashed, CircleX, Loader2 } from "lucide-react";
import { ICON_SIZE } from "@/constants/icon-size";

const PhaseStatusBadge = ({ status }: { status: ExecutionPhaseStatus }) => {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return (
        <CircleDashed size={ICON_SIZE.M} className="stroke-muted-foreground" />
      );
    case ExecutionPhaseStatus.RUNNING:
      return (
        <Loader2
          size={ICON_SIZE.M}
          className="animate-spin stroke-yellow-500"
        />
      );
    case ExecutionPhaseStatus.FAILED:
      return <CircleX size={ICON_SIZE.M} className="stroke-destructive" />;
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheck size={ICON_SIZE.M} className="stroke-green-500" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
};

export default PhaseStatusBadge;
