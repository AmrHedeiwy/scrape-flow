import { Node } from "@xyflow/react";
import { TaskType } from "./task";

export interface IWorkflowNodeData {
  [key: string]: any;
  type: TaskType;
  inputs: Record<string, string>;
}

export interface IWorkflowNode extends Node {
  data: IWorkflowNodeData;
}
