import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { ICON_SIZE } from "@/constants/icon-size";
import { Loader, Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Logo iconSize={50} fontSize="text-3xl" />
      <Separator className="max-w-xs" />
      <div className="flex items-center justify-center gap-2">
        <Loader2 size={ICON_SIZE.S} className="animate-spin stroke-primary" />
        <p className="text-muted-foreground">Setting up your account</p>
      </div>
    </div>
  );
};

export default loading;
