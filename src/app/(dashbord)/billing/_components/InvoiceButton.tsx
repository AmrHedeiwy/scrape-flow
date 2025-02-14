"use client";

import { DownloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const InvoiceButton = ({ id }: { id: string }) => {
  const { isPending, mutate } = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => (window.location.href = data as string),
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 px-1 text-xs text-muted-foreground"
      disabled={isPending}
      onClick={() => mutate(id)}
    >
      Invoice
      {isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
    </Button>
  );
};

export default InvoiceButton;
