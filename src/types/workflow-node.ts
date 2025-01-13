import { Node } from "@xyflow/react";
import { TaskType } from "./task";

export interface IWorkflowNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface IWorkflowNode extends Node {
  data: IWorkflowNodeData;
}
