"use client";

import React from "react";

import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import CustomDialogHeader from "@/components/CustomDialogHeader";

import {
  DuplicateWorkflowSchema,
  TDuplicateWorkflowSchema,
} from "@/schema/workflow";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DuplicateWorkflow } from "@/actions/worflow/duplicateWorkflow";
import { cn } from "@/lib/utils";

const DuplicateWorflowDialog = ({
  name,
  description,
  workflowId,
}: {
  name: string;
  description?: string | null;
  workflowId: string;
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<TDuplicateWorkflowSchema>({
    resolver: zodResolver(DuplicateWorkflowSchema),
    defaultValues: {
      name: `${name} Copy`,
      description: description ?? undefined,
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicate", { id: "duplicate-workflow" });
      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const handleSubmit = React.useCallback(
    (data: TDuplicateWorkflowSchema) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(data);
    },
    [mutate],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "ml-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100",
          )}
        >
          <CopyIcon className="h-4 w-4 cursor-pointer text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={Layers2Icon} title="Duplicate workflow" />

        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Name
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormDescription>
                      Choose a unique and description name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Description
                      <p className="text-sm text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.
                      <br /> This is optional but can help you remember the
                      workflow&apos;s purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateWorflowDialog;
