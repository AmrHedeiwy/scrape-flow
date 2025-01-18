import React from "react";

import { cn } from "@/lib/utils";

import { useReactFlow } from "@xyflow/react";
import { useFlowValidation } from "@/components/hooks/use-flow-validation";

const NodeCard = ({
  nodeId,
  isSelected,
  children,
}: {
  nodeId: string;
  isSelected: boolean;
} & React.PropsWithChildren) => {
  const { getNode, setCenter } = useReactFlow();

  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some(
    (input) => input.nodeId === nodeId,
  );

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;

        const { position, measured } = node;
        if (!position || !measured) return;

        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;

        if (x === undefined || y === undefined) return;

        setCenter(x, y, { zoom: 1, duration: 500 });
      }}
      className={cn(
        "flex w-[420px] border-separate cursor-pointer flex-col gap-1 rounded-md border-2 bg-background text-xs",
        {
          "border-primary": isSelected,
          "border-2 border-destructive": hasInvalidInputs,
        },
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
