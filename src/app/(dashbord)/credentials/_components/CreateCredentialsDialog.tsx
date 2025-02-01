"use client";

import React from "react";

import { Layers2Icon, Loader2, ShieldEllipsis } from "lucide-react";
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

import { CreateWorkflow } from "@/actions/createWorkflow";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCredentialsSchema,
  TCreateCredentialsSchema,
} from "@/schema/credential";
import { CreateCredential } from "@/actions/credentials/createCredentials";

const CreateCredentialsDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<TCreateCredentialsSchema>({
    resolver: zodResolver(CreateCredentialsSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created", { id: "create-credential" });
    },
    onError: () => {
      toast.error("Failed to create credential", { id: "create-credential" });
    },
  });

  const handleSubmit = React.useCallback(
    (data: TCreateCredentialsSchema) => {
      toast.loading("Creating credential...", { id: "create-credential" });
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
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={ShieldEllipsis} title="Create credential" />

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
                      Enter a unique and descriptive name for the credential
                      <br />
                      This name will be used to identify the credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Value
                      <p className="text-sm text-primary">(requried)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with the credential
                      <br /> This value will be securely encrypted and stored
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

export default CreateCredentialsDialog;
