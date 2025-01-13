"use client";

import { cn } from "@/lib/utils";
import { ITaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React, { PropsWithChildren } from "react";
import { ColorForHandle } from "./common";

export const NodeOutputs = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col gap-1 divide-y">{children}</div>;
};

export const NodeOutput = ({ output }: { output: ITaskParam }) => {
  return (
    <div className="relative flex justify-end bg-secondary p-3">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!-right-2 !h-4 !w-4 !border-2 !border-background !bg-muted-foreground",
          ColorForHandle[output.type],
        )}
      />
    </div>
  );
};
