"use client";

import React from "react";

import { ChevronLeftIcon } from "lucide-react";

import { ICON_SIZE } from "@/constants/icon-size";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";

import SaveButton from "./SaveButton";
import ExecuteButton from "./ExecuteButton";

import { useRouter } from "next/navigation";

interface ITopbarProps {
  title: string;
  subtitle?: string;
  workflowId: string;
}

const Topbar = ({ title, subtitle, workflowId }: ITopbarProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-[60px] w-full border-separate justify-between border-b-2 bg-background p-2">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="black">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={ICON_SIZE.XL} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="truncate text-ellipsis font-bold">{title}</p>
          {subtitle && (
            <p className="truncate text-ellipsis text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-1">
        <ExecuteButton workflowId={workflowId} />
        <SaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};

export default Topbar;
