import React from "react";

import { Workflow } from "@prisma/client";

import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";
import { FlowValidationProvider } from "@/components/context/FlowValidationContext";
import { WorkflowStatus } from "@/types/workflow";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <FlowValidationProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationProvider>
  );
};

export default Editor;
