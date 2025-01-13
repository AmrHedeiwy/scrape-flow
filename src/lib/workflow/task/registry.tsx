import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";

export const TaskRegistry = {
  [LaunchBrowserTask.type]: LaunchBrowserTask,
  [PageToHtml.type]: PageToHtml,
};
