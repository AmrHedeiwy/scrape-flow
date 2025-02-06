"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ICON_SIZE } from "@/constants/icon-size";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { Coins } from "lucide-react";
import React from "react";

const TaskMenuButton = ({ type }: { type: TaskType }) => {
  const { icon: Icon, label, credits } = TaskRegistry[type];

  const onDragStart = (e: React.DragEvent, type: TaskType) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant="secondary"
      className="flex w-full cursor-grab items-center justify-between gap-2 border active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, type)}
    >
      <div className="flex gap-2">
        <Icon size={ICON_SIZE.M} />
        {label}
      </div>
      <Badge className="flex items-center gap-2" variant="outline">
        <Coins size={ICON_SIZE.S} />
        {credits}
      </Badge>
    </Button>
  );
};

export default TaskMenuButton;
