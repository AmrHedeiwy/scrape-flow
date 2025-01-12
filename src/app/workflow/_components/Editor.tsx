import React from "react";

import { Workflow } from "@prisma/client";

import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <ReactFlowProvider>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
};

export default Editor;
