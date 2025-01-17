"use client";

import React from "react";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { ICON_SIZE } from "@/constants/icon-size";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/create-flow-node";
import { IWorkflowNode } from "@/types/workflow-node";

const NodeHeader = ({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) => {
  const { icon: Icon, label, isEntryPoint, credits } = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      <Icon size={ICON_SIZE.S} />
      <div className="flex w-full items-center justify-between gap-1">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {label}
        </p>
        <div className="flex items-center gap-1">
          {isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="flex items-center gap-2 text-xs">
            <CoinsIcon size={ICON_SIZE.S} />
            {credits}
          </Badge>
          {!isEntryPoint && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  });
                }}
              >
                <TrashIcon size={ICON_SIZE.XS} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const node = getNode(nodeId) as IWorkflowNode;
                  const newX = node?.position.x;
                  const newY = node?.position.y + node.measured?.height! + 20;
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY,
                  });

                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={ICON_SIZE.XS} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab active:cursor-grabbing"
          >
            <GripVerticalIcon size={ICON_SIZE.M} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;
