"use client";

import React from "react";
import { toast } from "sonner";

import { PlayIcon } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";
import { Button } from "@/components/ui/button";

import { useExecutionPlan } from "@/components/hooks/use-execution-plan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";

import { RunWorkflow } from "@/actions/runWorkflow";

const ExecuteButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution Started", {
        id: "flow-execution",
      });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // client side validation
          return;
        }

        mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}
    >
      <PlayIcon size={ICON_SIZE.S} className="stroke-orange-400" />
      Execute
    </Button>
  );
};

export default ExecuteButton;
