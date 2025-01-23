"use client";

import React from "react";
import { toast } from "sonner";

import { Download } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";
import { Button } from "@/components/ui/button";

import { useMutation } from "@tanstack/react-query";

import { UnPublishWorkflow } from "@/actions/unPublishWorkflow";

const UnPublishButton = ({ workflowId }: { workflowId: string }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow UnPublished", {
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
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutate(workflowId);
      }}
    >
      <Download size={ICON_SIZE.S} className="stroke-orange-400" />
      Unpublish
    </Button>
  );
};

export default UnPublishButton;
