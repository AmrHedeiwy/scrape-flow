import React from "react";

import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { IWorkflowNodeData } from "@/types/workflow-node";

const NodeComponent = React.memo((props: NodeProps) => {
  const nodeData = props.data as IWorkflowNodeData;

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} />
    </NodeCard>
  );
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";
