"use client";

import { Button } from "@/components/ui/button";
import { ICON_SIZE } from "@/constants/icon-size";
import { useExecutionPlan } from "@/hooks/use-execution-plan";
import { PlayIcon } from "lucide-react";
import React from "react";

const ExecuteButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.table(plan);
      }}
    >
      <PlayIcon size={ICON_SIZE.S} className="stroke-orange-400" />
      Execute
    </Button>
  );
};

export default ExecuteButton;
