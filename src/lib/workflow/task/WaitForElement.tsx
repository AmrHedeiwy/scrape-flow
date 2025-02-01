import { TaskParamType, TaskType } from "@/types/task";
import { TWorkflowTask } from "@/types/workflow";
import { LucideProps, MousePointerClick, TextIcon } from "lucide-react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for element",
  icon: (props: LucideProps) => (
    <MousePointerClick className="stroke-amber-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROSWER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Visibility",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Visible", value: "visible" },
        { label: "Hidden", value: "hidden" },
      ],
      hideHandle: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROSWER_INSTANCE,
    },
  ] as const,
} satisfies TWorkflowTask;
