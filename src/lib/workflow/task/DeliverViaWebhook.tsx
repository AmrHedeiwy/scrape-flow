import { TaskParamType, TaskType } from "@/types/task";
import { TWorkflowTask } from "@/types/workflow";
import { LucideProps, Send } from "lucide-react";

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via webhook",
  icon: (props: LucideProps) => <Send className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [] as const,
} satisfies TWorkflowTask;
