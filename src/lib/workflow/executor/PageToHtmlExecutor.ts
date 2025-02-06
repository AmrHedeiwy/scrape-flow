import { TExecutionEnvironment } from "@/types/executor";

import { PageToHtmlTask } from "../task/PageToHtml";
import { waitFor } from "@/lib/helper/waitFor";

export const PageToHtmlExecutor = async (
  environment: TExecutionEnvironment<typeof PageToHtmlTask>,
) => {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);
    return false;
  }
};
