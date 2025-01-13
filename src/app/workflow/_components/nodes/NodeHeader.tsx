"use client";

import React from "react";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { ICON_SIZE } from "@/constants/icon-size";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, GripVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NodeHeader = ({ taskType }: { taskType: TaskType }) => {
  const { icon: Icon, label, isEntryPount } = TaskRegistry[taskType];

  return (
    <div className="flex items-center gap-2 p-2">
      <Icon size={ICON_SIZE.S} />
      <div className="flex w-full items-center justify-between">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {label}
        </p>
        <div className="flex items-center gap-1">
          {isEntryPount && <Badge>Entry point</Badge>}
          <Badge className="flex items-center gap-2 text-xs">
            <CoinsIcon size={ICON_SIZE.S} />
            TODO
          </Badge>
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
