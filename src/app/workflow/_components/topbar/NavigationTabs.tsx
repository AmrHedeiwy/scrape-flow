"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavigationTabs = ({ workflowId }: { workflowId: string }) => {
  const pathname = usePathname();
  const activeTab = pathname.split("/")[2];

  return (
    <Tabs className="w-[400px]" value={activeTab}>
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            Executions
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default NavigationTabs;
