import { TExecutionEnvironment } from "@/types/executor";

import { PageToHtmlTask } from "../task/PageToHtml";

export const PageToHtmlExecutor = async (
  environment: TExecutionEnvironment<typeof PageToHtmlTask>,
) => {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);

    return true;
  } catch (error) {
    console.error("Error page to html executor", error);
    return false;
  }
};
