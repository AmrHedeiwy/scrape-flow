"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICON_SIZE } from "@/constants/icon-size";

import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import React from "react";
import { cn } from "@/lib/utils";

const DeletableEdge = (props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  const [isHovered, setIsHovered] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!timeoutRef.current) {
      setIsHovered(true);
    } else {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setIsHovered(false);
    }, 600);
  };

  return (
    <g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <foreignObject>
        <EdgeLabelRenderer>
          <div
            className={cn("transition-opacity duration-300", {
              "pointer-events-none opacity-0": !isHovered,
              "pointer-events-auto opacity-100": isHovered,
            })}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
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
      </foreignObject>
    </g>
  );
};

export default DeletableEdge;
