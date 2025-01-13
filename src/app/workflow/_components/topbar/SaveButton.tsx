"use client";

import React from "react";

import { CheckIcon } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";

import { Button } from "@/components/ui/button";

import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflow } from "@/actions/updateWorkflow";
import { toast } from "sonner";

const SaveButton = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });

        mutate({ id: workflowId, definition: workflowDefinition });
      }}
      disabled={isPending}
    >
      <CheckIcon size={ICON_SIZE.S} className="stroke-green-400" />
      Save
    </Button>
  );
};

export default SaveButton;
