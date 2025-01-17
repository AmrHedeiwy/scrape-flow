import React, { useCallback } from "react";

import { ITaskParam, TaskParamType } from "@/types/task";

import { useReactFlow } from "@xyflow/react";

import StringParam from "./param/StringParam";
import { IWorkflowNode } from "@/types/workflow-node";
import BrowserInstanceParam from "./param/BrowserInstanceParam";

const NodeParamField = ({
  param,
  nodeId,
  disabled,
}: {
  param: ITaskParam;
  nodeId: string;
  disabled: boolean;
}) => {
  const { updateNodeData, getNode } = useReactFlow();

  const node = getNode(nodeId) as IWorkflowNode | undefined;
  const value = node?.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (value: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: value,
        },
      });
    },
    [nodeId, param.name, node?.data.inputs, updateNodeData],
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value || ""}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.BROSWER_INSTANCE:
      return (
        <BrowserInstanceParam
          param={param}
          value=""
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
};

export default NodeParamField;
