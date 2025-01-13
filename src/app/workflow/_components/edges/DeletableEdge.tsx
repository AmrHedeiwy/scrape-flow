"use client";

import { Button } from "@/components/ui/button";
import { ICON_SIZE } from "@/constants/icon-size";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { XIcon } from "lucide-react";
import React from "react";

const DeletableEdge = (props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
            onClick={() => {
              setEdges((eds) => eds.filter((e) => e.id !== props.id));
            }}
          >
            <XIcon size={ICON_SIZE.XS} />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default DeletableEdge;
