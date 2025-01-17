import { TaskType } from "@/types/task";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { TWorkflowTask } from "@/types/workflow";

type TTaskRegistry = {
  [K in TaskType]: TWorkflowTask & { type: K };
};

export const TaskRegistry: TTaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtml,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
};
