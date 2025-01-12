import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

const NodeCard = ({
  nodeId,
  isSelected,
  children,
}: {
  nodeId: string;
  isSelected: boolean;
} & React.PropsWithChildren) => {
  const { getNode, setCenter } = useReactFlow();

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
        },
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
