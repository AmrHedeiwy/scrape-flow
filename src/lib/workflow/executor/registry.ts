import { TaskType } from "@/types/task";
import { TExecutionEnvironment } from "@/types/executor";
import { TWorkflowTask } from "@/types/workflow";

import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";
import { ExtractDataWithAIExecutor } from "./ExtractDataWithAIExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { AddPropertyFromJsonExecutor } from "./AddPropertyFromJsonExecutor";
import { NavigateUrlExecutorExecutor } from "./NavigateUrlExecutor";

type TExecutorFn<T extends TWorkflowTask> = (
  environment: TExecutionEnvironment<T>,
) => Promise<boolean>;

type TExecutionRegistry = {
  [K in TaskType]: TExecutorFn<TWorkflowTask & { type: K }>;
};

export const ExecutorRegistry: TExecutionRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyFromJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutorExecutor,
};
