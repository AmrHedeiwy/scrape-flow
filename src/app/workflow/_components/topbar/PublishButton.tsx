"use client";

import React from "react";
import { toast } from "sonner";

import { Upload } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";
import { Button } from "@/components/ui/button";

import { useExecutionPlan } from "@/components/hooks/use-execution-plan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";

import { PublishWorkflow } from "@/actions/publishWorkflow";

const PublishButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Published", {
        id: workflowId,
      });
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
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

        toast.loading("Publishing workflow...", { id: workflowId });
        mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}
    >
      <Upload size={ICON_SIZE.S} className="stroke-green-400" />
      Publish
    </Button>
  );
};

export default PublishButton;
