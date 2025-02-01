"use client";

import { UpdateWorkflowCron } from "@/actions/worflow/updateWorkflowCron";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import { Calendar, Clock, TriangleAlert } from "lucide-react";

import CustomDialogHeader from "@/components/CustomDialogHeader";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import cronstrue from "cronstrue";
import parser from "cron-parser";
import { RemoveWorkflowSchedule } from "@/actions/worflow/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

const SchedularDialog = (props: {
  workflowId: string;
  cron: string | null;
}) => {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const updateCronMutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      parser.parseExpression(cron);
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = !!(props.cron && props.cron.length > 0);
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn("h-auto p-0 text-sm text-orange-500", {
            "text-primary": workflowHasValidCron,
          })}
        >
          {workflowHasValidCron && (
            <div className="flex items-start gap-2 text-wrap text-left">
              <Clock className="flex-shrink-0" />
              <span className="line-clamp-2">{readableSavedCron}</span>
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlert className="h-3 w-3 flex-shrink-0" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={Calendar}
        />
        <div className="space-y-6 p-6">
          <p className="text-sm text-muted-foreground">
            Specify a cron expression to schedule periodic execution. All times
            in UTC
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => {
              setCron(e.target.value);
            }}
          />
          <div
            className={cn("rounded-md border bg-accent p-4 text-sm", {
              "border-primary text-primary": validCron,
              "border-destructive text-destructive": !validCron,
            })}
          >
            {validCron ? readableCron : "Invalid cron expression"}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  className="w-full border-destructive text-destructive hover:text-destructive"
                  variant="outline"
                  disabled={
                    removeScheduleMutation.isPending ||
                    updateCronMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });

                    removeScheduleMutation.mutate({
                      workflowId: props.workflowId,
                    });
                  }}
                >
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="gap-2 px-6">
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              onClick={() => {
                toast.loading("Saving", { id: "cron" });
                updateCronMutation.mutate({
                  workflowId: props.workflowId,
                  cron,
                });
              }}
              disabled={updateCronMutation.isPending || !validCron}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedularDialog;
