import { TaskType } from "@/types/task";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { TWorkflowTask } from "@/types/workflow";

type TTaskRegistry = {
  [K in TaskType]: TWorkflowTask & { type: K };
};

export const TaskRegistry: TTaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
