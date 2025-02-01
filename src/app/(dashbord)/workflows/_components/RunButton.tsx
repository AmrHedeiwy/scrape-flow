"use client";

import { RunWorkflow } from "@/actions/runWorkflow";
import { Button } from "@/components/ui/button";
import { ICON_SIZE } from "@/constants/icon-size";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const RunButton = ({ workflowId }: { workflowId: string }) => {
  const { isPending, mutate } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow Stated", { id: workflowId });
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });

  return (
    <Button
      className="flex items-center gap-2"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        toast.loading("Executing workflow...", { id: workflowId });
        mutate({ workflowId });
      }}
    >
      <PlayIcon size={ICON_SIZE.S} />
      Run
    </Button>
  );
};

export default RunButton;
