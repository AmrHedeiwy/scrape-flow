"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskType } from "@/types/task";
import TaskMenuButton from "./TaskMenuButton";

const TaskMenu = () => {
  return (
    <aside className="h-full w-[340px] min-w-[340px] max-w-[340px] border-separate overflow-auto border-r-2 p-2 px-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">Extraction</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton type={TaskType.PAGE_TO_HTML} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

export default TaskMenu;
