import React from "react";

import { ITaskParam } from "@/types/task";

import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";

import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";

export const NodeInputs = ({ children }: React.PropsWithChildren) => {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
};

export const NodeInput = ({
  input,
  nodeId,
}: {
  input: ITaskParam;
  nodeId: string;
}) => {
  return (
    <div className="relative flex w-full justify-start bg-secondary p-3">
      <NodeParamField param={input} nodeId={nodeId} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!-left-2 !h-4 !w-4 !border-2 !border-background !bg-muted-foreground",
            ColorForHandle[input.type],
          )}
        />
      )}
    </div>
  );
};
