import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const PageToHtml = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPount: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROSWER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
    },
    {
      name: "Web Page",
      type: TaskParamType.BROSWER_INSTANCE,
    },
  ],
};
