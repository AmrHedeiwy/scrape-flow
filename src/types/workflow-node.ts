import { ITaskParam, TaskType } from "./task";

import { Node } from "@xyflow/react";

export interface IWorkflowNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface IWorkflowNode extends Node {
  data: IWorkflowNodeData;
}

export interface IParamProps {
  param: ITaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

export type TWorkflowNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
