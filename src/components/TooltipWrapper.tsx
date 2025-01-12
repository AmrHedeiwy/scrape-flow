import React, { PropsWithChildren } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TooltipWrapperProps extends PropsWithChildren {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const TooltipWrapper = ({
  content,
  side = "top",
  children,
}: TooltipWrapperProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
