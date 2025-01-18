"use client";
import React from "react";

import { PlayIcon } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";

import { Button } from "@/components/ui/button";
import { useExecutionPlan } from "@/components/hooks/use-execution-plan";

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
