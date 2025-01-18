import React from "react";
import { NodeProps } from "@xyflow/react";

import { IWorkflowNodeData } from "@/types/workflow-node";

import { TaskRegistry } from "@/lib/workflow/task/registry";

import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const NodeComponent = React.memo((props: NodeProps) => {
  const nodeData = props.data as IWorkflowNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";
