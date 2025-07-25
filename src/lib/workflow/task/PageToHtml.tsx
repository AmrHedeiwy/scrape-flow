import { TaskParamType, TaskType } from "@/types/task";
import { TWorkflowTask } from "@/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROSWER_INSTANCE,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
    },
    {
      name: "Web Page",
      type: TaskParamType.BROSWER_INSTANCE,
    },
  ] as const,
} satisfies TWorkflowTask;
