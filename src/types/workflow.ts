import { LucideProps } from "lucide-react";
import { ITaskParam, TaskType } from "./task";
import React from "react";
import { IWorkflowNode } from "./workflow-node";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type TWorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: ITaskParam[];
  outputs: ITaskParam[];
  credits: number;
};

export type TWorkflowExecutionPlanPhase = {
  phase: number;
  nodes: IWorkflowNode[];
};

export type TWorkflowExecutionPlan = TWorkflowExecutionPlanPhase[];
